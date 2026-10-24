import { BLUEPRINTS, PART_META } from "../../data/mock/blueprints.js";
import { QF, packTest } from "./build.js";
import { parseScript } from "./speech.js";

// AI question papers: validate a JSON paper, turn it into a test, and build
// the prompt users give an AI to generate more of them. Format id:
export const PAPER_FORMAT = "nihongo-mock-paper/1";

const SECTION_PARTS = {
	vocab: ["kanjiReading", "orthography", "context", "paraphrase"],
	grammarReading: ["grammarForm", "sentenceOrder", "textGrammar", "reading"],
	listening: ["lisQuick", "lisUtterance", "lisPoint"],
};
const str = (v) => typeof v === "string" && v.trim().length > 0;

// AI answers often arrive wrapped in a ```json fence or with chatter around
// them — keep just the JSON object.
export function parsePaperText(text) {
	let t = String(text).trim();
	const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
	if (fence) t = fence[1].trim();
	const a = t.indexOf("{");
	const b = t.lastIndexOf("}");
	if (a >= 0 && b > a) t = t.slice(a, b + 1);
	return JSON.parse(t);
}

const scriptLines = (v) => {
	const raw = Array.isArray(v) ? v.join("／") : typeof v === "string" ? v.replace(/\n+/g, "／") : "";
	return parseScript(raw.replace(/([FM])：/g, "$1:"));
};

// → { ok, errors[], warnings[], paper }   (paper is QF-ready, see paperToTest)
export function validatePaper(raw) {
	const errors = [];
	const warnings = [];
	const err = (p, m) => errors.push(`${p}: ${m}`);
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, errors: ["The file must contain one JSON object."], warnings, paper: null };
	if (raw.format !== PAPER_FORMAT) err("format", `must be "${PAPER_FORMAT}"`);
	if (!["n5", "n4"].includes(raw.level)) err("level", 'must be "n5" or "n4"');
	if (!str(raw.title)) err("title", "must be a non-empty string");
	if (!raw.sections || typeof raw.sections !== "object") err("sections", "missing");

	const choiceCheck = (q, p, { min = 2, max = 4 } = {}) => {
		const c = q?.choices;
		if (!Array.isArray(c) || c.length < min || c.length > max || !c.every(str)) return err(p, `"choices" must be ${min === max ? min : `${min}–${max}`} non-empty strings`), null;
		if (new Set(c.map((x) => x.trim())).size !== c.length) return err(p, '"choices" contain duplicates'), null;
		if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= c.length) return err(p, `"answer" must be a 0-based index between 0 and ${c.length - 1}`), null;
		return { ok: c[q.answer].trim(), bad: c.filter((_, i) => i !== q.answer).map((x) => x.trim()) };
	};
	const need = (q, p, ...keys) => keys.every((k) => (str(q?.[k]) ? true : (err(p, `"${k}" must be a non-empty string`), false)));

	const out = { vocab: {}, grammarReading: {}, listening: {} };
	const secs = raw.sections && typeof raw.sections === "object" ? raw.sections : {};
	for (const [sec, parts] of Object.entries(SECTION_PARTS)) {
		const sraw = secs[sec];
		if (sraw === undefined) continue;
		if (!sraw || typeof sraw !== "object") { err(`sections.${sec}`, "must be an object"); continue; }
		for (const part of parts) {
			let list = sraw[part];
			if (list === undefined) continue;
			if (part === "textGrammar" && list && !Array.isArray(list)) list = [list];
			if (!Array.isArray(list) || !list.length) { err(`${sec}.${part}`, "must be a non-empty array"); continue; }
			const items = [];
			list.forEach((q, i) => {
				const p = `${sec}.${part}[${i + 1}]`;
				if (!q || typeof q !== "object") return err(p, "must be an object");
				const exp = str(q.explanation) ? q.explanation.trim() : undefined;
				if (part === "kanjiReading") {
					const c = need(q, p, "word") && choiceCheck(q, p);
					if (c) items.push({ part, word: q.word.trim(), ...c, exp });
				} else if (part === "orthography") {
					const c = need(q, p, "reading") && choiceCheck(q, p);
					if (c) items.push({ part, reading: q.reading.trim(), ...c, exp });
				} else if (["context", "paraphrase", "grammarForm"].includes(part)) {
					const c = need(q, p, "sentence") && choiceCheck(q, p);
					if (c) {
						if (part !== "paraphrase" && !q.sentence.includes("( )")) warnings.push(`${p}: sentence has no "( )" blank`);
						items.push({ part, sentence: q.sentence.trim(), ...c, exp });
					}
				} else if (part === "sentenceOrder") {
					if (!Array.isArray(q.parts) || q.parts.length !== 4 || !q.parts.every(str)) return err(p, '"parts" must be exactly 4 non-empty strings in the CORRECT order');
					if (!Number.isInteger(q.star) || q.star < 1 || q.star > 4) return err(p, '"star" must be 1, 2, 3 or 4 (which position holds the ★)');
					items.push({ part, pre: q.pre || "", parts: q.parts.map((x) => x.trim()), post: q.post || "", star: q.star, exp });
				} else if (part === "textGrammar") {
					if (!str(q.text) || !Array.isArray(q.questions) || !q.questions.length) return err(p, '"text" and a non-empty "questions" array are required');
					const marks = [...q.text.matchAll(/\((\d+)\)/g)].map((m) => Number(m[1]));
					if (marks.length !== q.questions.length || !marks.every((m, k) => m === k + 1)) return err(p, `"text" must contain the markers (1)…(${q.questions.length}) in order, one per question`);
					const qs = q.questions.map((qq, k) => choiceCheck(qq, `${p}.questions[${k + 1}]`));
					if (qs.every(Boolean)) items.push({ part, title: q.title || "", text: q.text, qs });
				} else if (part === "reading") {
					if (!str(q.text) || !Array.isArray(q.questions) || !q.questions.length) return err(p, '"text" and a non-empty "questions" array are required');
					const qs = q.questions.map((qq, k) => {
						const pp = `${p}.questions[${k + 1}]`;
						const c = need(qq, pp, "question") && choiceCheck(qq, pp);
						return c ? { prompt: qq.question.trim(), ...c } : null;
					});
					if (qs.every(Boolean)) items.push({ part, kind: ["info", "mid"].includes(q.kind) ? q.kind : "short", title: q.title || "", text: q.text, qs });
				} else if (part === "lisQuick") {
					const c = need(q, p, "utterance") && choiceCheck(q, p, { min: 3, max: 4 });
					if (c) items.push({ part, utterance: q.utterance.trim(), ...c, exp });
				} else if (part === "lisUtterance") {
					const c = need(q, p, "situation") && choiceCheck(q, p, { min: 3, max: 4 });
					if (c) items.push({ part, situation: q.situation.trim(), ...c, exp });
				} else if (part === "lisPoint") {
					const lines = scriptLines(q.script);
					if (!lines.length) return err(p, '"script" is required, e.g. "F:…／M:…／F:…"');
					if (!lines.some((l) => l.who !== "N")) warnings.push(`${p}: script lines should start with F: or M:`);
					const c = need(q, p, "question") && choiceCheck(q, p, { min: 4, max: 4 });
					if (c) items.push({ part, lines, qtext: q.question.trim(), ...c, exp });
				}
			});
			if (items.length) out[sec][part] = items;
		}
	}
	const total = Object.values(out).reduce((n, s) => n + Object.values(s).reduce((m, arr) => m + arr.length, 0), 0);
	if (!errors.length && total === 0) err("sections", "no questions found");
	if (errors.length) return { ok: false, errors, warnings, paper: null };
	return { ok: true, errors, warnings, paper: { format: PAPER_FORMAT, title: raw.title.trim(), level: raw.level, author: raw.author || null, sections: out } };
}

const countOf = (items) => items.reduce((n, it) => n + (it.qs ? it.qs.length : 1), 0);

// Rows like the built-in blueprint, for the setup screen.
export function paperRows(paper, format) {
	const bp = BLUEPRINTS[format][paper.level];
	return bp.sections
		.filter((s) => paper.sections[s.key] && Object.keys(paper.sections[s.key]).length)
		.map((s) => {
			const parts = Object.entries(paper.sections[s.key]).map(([p, items]) => [p, countOf(items)]);
			return { key: s.key, minutes: s.minutes, parts, count: parts.reduce((n, [, c]) => n + c, 0) };
		});
}
export const paperCount = (paper) => Object.values(paper.sections).reduce((n, s) => n + Object.values(s).reduce((m, a) => m + countOf(a), 0), 0);

export function paperToTest(paper, opts) {
	const { format, mode = "full", sectionKey = null, timed = true, listening = true, neg = 0, lisMode = "pause" } = opts;
	const bp = BLUEPRINTS[format][paper.level];
	const stimuli = {};
	let sn = 0;
	let qn = 0;
	const addStim = (s) => ((stimuli[`s${++sn}`] = s), `s${sn}`);
	const sections = bp.sections
		.filter((s) => paper.sections[s.key] && Object.keys(paper.sections[s.key]).length)
		.filter((s) => (mode === "section" ? s.key === sectionKey : s.key !== "listening" || listening))
		.map((s) => {
			const questions = [];
			const push = (part, q) => questions.push({ id: `q${++qn}`, part, skill: PART_META[part].skill, section: s.key, ...q });
			for (const part of SECTION_PARTS[s.key]) {
				for (const it of paper.sections[s.key][part] || []) {
					const exp = it.exp || (it.ok ? `Answer: ${it.ok}` : undefined);
					if (part === "kanjiReading") push(part, QF.kanjiReading({ ...it, exp: it.exp || `${it.word} = ${it.ok}` }));
					else if (part === "orthography") push(part, QF.orthography({ ...it, exp: it.exp || `${it.reading} = ${it.ok}` }));
					else if (["context", "paraphrase", "grammarForm"].includes(part)) push(part, QF.sentence({ ...it, exp }));
					else if (part === "sentenceOrder") push(part, QF.order(it));
					else if (part === "textGrammar") {
						const sid = addStim({ kind: "cloze", title: it.title, text: it.text });
						it.qs.forEach((c, k) => push(part, QF.cloze({ stim: sid, blank: k + 1, ok: c.ok, bad: c.bad, exp: `(${k + 1}) = ${c.ok}` })));
					} else if (part === "reading") {
						const sid = addStim({ kind: it.kind === "info" ? "info" : "text", title: it.title, text: it.text });
						for (const c of it.qs) push(part, QF.plain({ prompt: c.prompt, stim: sid, ok: c.ok, bad: c.bad, exp: `Answer: ${c.ok}` }));
					} else if (part === "lisQuick") push(part, QF.lisQuick({ ...it, exp }));
					else if (part === "lisUtterance") push(part, QF.lisUtterance({ ...it, exp }));
					else if (part === "lisPoint") push(part, QF.lisPoint({ ...it, exp }));
				}
			}
			return { key: s.key, minutes: s.minutes, questions };
		})
		.filter((s) => s.questions.length);
	if (!sections.length) return null;
	return packTest({ level: paper.level, format, mode, timed, neg, lisMode, title: paper.title, source: "paper", opts, sections, stimuli });
}

// ---- the prompt users hand to an AI (with the demo JSON attached) ----
export function buildPrompt({ level = "n5", theme = "" } = {}) {
	const L = level.toUpperCase();
	const cnt = Object.fromEntries(BLUEPRINTS.jlpt[level].sections.flatMap((s) => s.parts));
	const book = level === "n5" ? "Minna no Nihongo I (lessons 1–25)" : "Minna no Nihongo II (lessons 26–50), plus all N5 material";
	const kanji = level === "n5" ? "only basic N5 kanji (about 100); write everything else in hiragana, with spaces between phrases as in real N5 papers" : "N5 + N4 kanji only (about 300); anything harder in hiragana";
	return `You are an experienced JLPT/NAT-TEST item writer. Write ONE complete, original ${L} mock exam paper as a single JSON file.

I have attached "demo-paper.json". Follow its structure EXACTLY (same keys, nesting and "format" value). The demo is short on purpose; your paper must have the full counts below.

LEVEL AND CONTENT
- Level: JLPT ${L} (NAT-TEST ${level === "n5" ? "5Q" : "4Q"}). Vocabulary and grammar must stay within ${book}.
- Kanji: ${kanji}.
- All questions must be original (not copied from past papers), natural, and have exactly ONE clearly correct answer. Wrong choices must be plausible but definitely wrong (same part of speech / same type).
- Vary which choice is correct: "answer" is the 0-based index of the correct choice within "choices" — do not always use 0.${theme ? `\n- Theme to lean on where natural: ${theme}.` : ""}

REQUIRED COUNTS
- sections.vocab: kanjiReading ${cnt.kanjiReading}, orthography ${cnt.orthography}, context ${cnt.context}, paraphrase ${cnt.paraphrase}
- sections.grammarReading: grammarForm ${cnt.grammarForm}, sentenceOrder ${cnt.sentenceOrder}, textGrammar 1 passage with 5 blanks, reading ${level === "n5" ? "3 short + 2 medium + 1 info passage (6 questions)" : "4 short + 2 medium + 1 info passage (10 questions)"}
- sections.listening: lisQuick ${cnt.lisQuick} (3 choices each), lisUtterance ${cnt.lisUtterance}, lisPoint ${cnt.lisPoint} (4 choices each)

FORMAT RULES
- kanjiReading: { word (with kanji), choices (4 hiragana readings), answer }. orthography: { reading (hiragana), choices (4 written forms), answer }.
- context / grammarForm: { sentence containing one "( )", choices (4), answer, explanation (one short English line for grammarForm) }. paraphrase: { sentence, choices (4 sentences), answer }.
- sentenceOrder: { pre, parts (EXACTLY 4 pieces in the CORRECT order), post, star (1–4: the position of the ★ piece) } — choose pieces so only one natural order exists.
- textGrammar: { title, text with markers (1) (2) (3) (4) (5), questions: 5 × { choices, answer } }.
- reading: { kind: "short" | "mid" | "info", title, text, questions: [{ question, choices, answer }] }.
- Listening is read aloud by a text-to-speech voice: write scripts the way people speak, numbers in kanji (e.g. 三千円), no emoji, no brackets. lisQuick: { utterance, choices: 3 replies, answer }. lisUtterance: { situation, choices: 3, answer }. lisPoint: { script: "F:…／M:…／F:…／M:…" (speakers F or M, separated by ／), question, choices: 4, answer }.
- Top level: "format": "${PAPER_FORMAT}", "title" (unique, e.g. "${L} Mock Paper — <topic> — <today's date>"), "level": "${level}", optional "author".

BEFORE ANSWERING, silently check every question: exactly one correct choice, "answer" index correct, counts met, JSON valid.

OUTPUT: return ONLY the JSON object in one code block — no commentary, double quotes only, no trailing commas, Japanese written as normal UTF-8 characters.`;
}

export const fixRequest = (errors) =>
	`The JSON paper you gave me failed validation in my app. Please fix ONLY these problems and return the complete corrected JSON in one code block, nothing else:\n\n${errors.map((e) => `- ${e}`).join("\n")}`;
