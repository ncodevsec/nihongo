import { N5_VOCAB } from "../../data/vocab/n5.js";
import { N4_VOCAB } from "../../data/vocab/n4.js";
import { N5_BANK } from "../../data/mock/n5.js";
import { N4_BANK } from "../../data/mock/n4.js";
import { BLUEPRINTS, PART_META } from "../../data/mock/blueprints.js";
import { shuffle } from "../utils.js";
import { parseScript } from "./speech.js";

// Assembles one mock paper from the blueprint. Vocabulary parts are generated
// from the app's own word lists (so every paper differs); the other parts are
// sampled from the hand-written banks in data/mock/.

const BANKS = { n5: N5_BANK, n4: N4_BANK };

// ---------- vocabulary pools ----------
const HAS_KANJI = /[\u4e00-\u9fff]/;
const KANA = /^[\u3040-\u309f\u30a0-\u30ff]+$/;
const BAD_WORD = /[～~ー［\[（()\s、／,・/0-9?？。!！]/;

function pool(list) {
	const seen = new Set();
	return list
		.filter(
			(v) =>
				HAS_KANJI.test(v.kanji) &&
				!BAD_WORD.test(v.kanji) &&
				[...v.kanji].length <= 5 &&
				KANA.test(v.reading) &&
				!seen.has(v.kanji) &&
				seen.add(v.kanji),
		)
		.map((v) => ({ word: v.kanji, reading: v.reading, meaning: v.meaningEn || v.meaning }));
}
const POOLS = {
	n5: () => pool(N5_VOCAB),
	// N4 papers also draw on N5 words, as the real test does.
	n4: () => [...pool(N4_VOCAB), ...pool(N4_VOCAB), ...pool(N5_VOCAB)],
};

const VOICED = "かが きぎ くぐ けげ こご さざ しじ すず せぜ そぞ ただ ちぢ てで とど はば ひび ふぶ へべ ほぼ".split(" ");
const LONG = [["おう", "お"], ["ゆう", "ゆ"], ["えい", "え"], ["おお", "お"], ["くう", "く"], ["きょう", "きょ"], ["しょう", "しょ"], ["じょう", "じょ"], ["ちょう", "ちょ"], ["しゅう", "しゅ"]];

// Believable wrong readings: change voicing, long vowels or the small っ.
function wrongReadings(r) {
	const out = new Set();
	const ch = [...r];
	ch.forEach((c, i) => {
		for (const [a, b] of VOICED) {
			if (c === a) out.add(ch.slice(0, i).join("") + b + ch.slice(i + 1).join(""));
			if (c === b) out.add(ch.slice(0, i).join("") + a + ch.slice(i + 1).join(""));
		}
	});
	for (const [a, b] of LONG) {
		if (r.includes(a)) out.add(r.replace(a, b));
		else if (r.includes(b)) out.add(r.replace(b, a));
	}
	if (r.includes("っ")) out.add(r.replace("っ", ""));
	else
		for (let i = 1; i < ch.length; i++)
			if ("かきくけこたちつてとさしすせそ".includes(ch[i])) out.add(ch.slice(0, i).join("") + "っ" + ch.slice(i).join(""));
	out.delete(r);
	return shuffle([...out].filter((x) => KANA.test(x)));
}

const take = (arr, n) => shuffle(arr).slice(0, Math.max(0, n));
export const withChoices = (correct, wrongs) => {
	const items = shuffle([{ t: correct, ok: true }, ...wrongs.map((t) => ({ t, ok: false }))]);
	return { choices: items.map((i) => i.t), answer: items.findIndex((i) => i.ok) };
};

const transcriptOf = (lines) => lines.map((l) => (l.who === "N" ? l.text : `${l.who === "F" ? "女" : "男"}：${l.text}`)).join("\n");

// Question factories shared by the generated/banked parts below and by the
// AI-paper importer (paper.js). Each takes the correct answer + the wrong ones.
export const QF = {
	kanjiReading: ({ word, ok, bad, exp }) => ({ kind: "word", prompt: word, ...withChoices(ok, bad), exp }),
	orthography: ({ reading, ok, bad, exp }) => ({ kind: "kana", prompt: reading, ...withChoices(ok, bad), exp }),
	sentence: ({ sentence, ok, bad, exp }) => ({ kind: "sentence", prompt: sentence, ...withChoices(ok, bad), exp }),
	order: ({ pre = "", parts, post = "", star, exp }) => {
		const { choices, answer } = withChoices(parts[star - 1], parts.filter((_, i) => i !== star - 1));
		return { kind: "order", prompt: "", order: { pre, post, star }, choices, answer, exp: exp || `${pre}${parts.join(" ")}${post}` };
	},
	cloze: ({ stim, blank, ok, bad, exp }) => ({ kind: "cloze", prompt: `(${blank})`, stim, blank, ...withChoices(ok, bad), exp }),
	plain: ({ prompt, stim, ok, bad, exp }) => ({ kind: "plain", prompt, stim, ...withChoices(ok, bad), exp }),
	lisQuick: ({ utterance, ok, bad, exp }) => {
		const { choices, answer } = withChoices(ok, bad);
		return { kind: "audioOnly", prompt: "", hide: true, lis: { intro: utterance }, transcript: [utterance, ...choices.map((c, i) => `${i + 1}. ${c}`)].join("\n"), choices, answer, exp };
	},
	lisUtterance: ({ situation, ok, bad, exp }) => ({ kind: "plain", prompt: "", lis: { intro: situation }, transcript: situation, ...withChoices(ok, bad), exp }),
	lisPoint: ({ lines, qtext, ok, bad, exp }) => ({ kind: "plain", prompt: qtext, lis: { dialog: lines, qtext }, transcript: transcriptOf(lines), ...withChoices(ok, bad), exp }),
};
const ans = (ok) => `Answer: ${ok}`;

// ---------- part generators: (level, count, ctx) → questions ----------
const GEN = {
	kanjiReading(level, n, ctx) {
		const p = ctx.pool;
		const used = new Set();
		return take(p, n * 3)
			.filter((w) => !used.has(w.word) && used.add(w.word))
			.slice(0, n)
			.map((w) => {
				let wrongs = wrongReadings(w.reading).slice(0, 3);
				if (wrongs.length < 3) {
					const extra = p.filter((o) => o.reading !== w.reading && Math.abs([...o.reading].length - [...w.reading].length) <= 1);
					wrongs = [...wrongs, ...take(extra, 6).map((o) => o.reading)].filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
				}
				return QF.kanjiReading({ word: w.word, ok: w.reading, bad: wrongs, exp: `${w.word} = ${w.reading} (${w.meaning})` });
			});
	},
	orthography(level, n, ctx) {
		const p = ctx.pool;
		const used = new Set();
		return take(p, n * 3)
			.filter((w) => !used.has(w.word) && used.add(w.word))
			.slice(0, n)
			.map((w) => {
				const same = p.filter((o) => o.word !== w.word && o.reading !== w.reading && [...o.word].length === [...w.word].length);
				const share = same.filter((o) => [...o.word].some((c) => w.word.includes(c) && HAS_KANJI.test(c)));
				const wrongs = [...take(share, 3), ...take(same, 6)].map((o) => o.word).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
				return QF.orthography({ reading: w.reading, ok: w.word, bad: wrongs, exp: `${w.reading} = ${w.word} (${w.meaning})` });
			});
	},
	context: (level, n, ctx) => take(ctx.bank.context, n).map(([s, ok, ...bad]) => QF.sentence({ sentence: s, ok, bad, exp: ans(ok) })),
	paraphrase: (level, n, ctx) => take(ctx.bank.paraphrase, n).map(([s, ok, ...bad]) => QF.sentence({ sentence: s, ok, bad, exp: `Closest in meaning: ${ok}` })),
	grammarForm: (level, n, ctx) => take(ctx.bank.grammar, n).map(([s, ok, a, b, c, exp]) => QF.sentence({ sentence: s, ok, bad: [a, b, c], exp })),
	sentenceOrder: (level, n, ctx) => take(ctx.bank.order, n).map((o) => QF.order(o)),
	textGrammar(level, n, ctx) {
		const c = ctx.bank.cloze;
		const sid = ctx.addStim({ kind: "cloze", title: c.title, text: c.text });
		return c.blanks.slice(0, n).map(([ok, ...bad], i) => QF.cloze({ stim: sid, blank: i + 1, ok, bad, exp: `(${i + 1}) = ${ok}` }));
	},
	reading(level, n, ctx) {
		const order = { short: 0, mid: 1, info: 2 };
		const passages = [...ctx.bank.reading].sort((a, b) => order[a.kind] - order[b.kind]);
		const out = [];
		for (const p of passages) {
			if (out.length + p.qs.length > n) continue;
			const sid = ctx.addStim({ kind: p.kind === "info" ? "info" : "text", title: p.title, text: p.text });
			for (const [q, ok, ...bad] of p.qs) out.push(QF.plain({ prompt: q, stim: sid, ok, bad, exp: ans(ok) }));
		}
		return out;
	},
	lisQuick: (level, n, ctx) => take(ctx.bank.listening.quick, n).map(([u, ok, ...bad]) => QF.lisQuick({ utterance: u, ok, bad, exp: ans(ok) })),
	lisUtterance: (level, n, ctx) => take(ctx.bank.listening.utterance, n).map(([s, ok, ...bad]) => QF.lisUtterance({ situation: s, ok, bad, exp: ans(ok) })),
	lisPoint: (level, n, ctx) => take(ctx.bank.listening.point, n).map(([script, q, ok, ...bad]) => QF.lisPoint({ lines: parseScript(script), qtext: q, ok, bad, exp: ans(ok) })),
};

// Wraps finished sections into the test object the exam/results screens use.
export function packTest({ level, format, mode, timed, neg = 0, lisMode = "pause", title = null, source = "builtin", opts = {}, sections, stimuli }) {
	const bp = BLUEPRINTS[format][level];
	return { id: `mock-${Date.now()}`, level, format, mode, timed, neg, lisMode, title, source, opts, passMark: bp.passMark, createdAt: Date.now(), sections, stimuli };
}

export function buildTest(opts) {
	const { level, format, mode = "full", sectionKey = null, timed = true, listening = true, neg = 0, lisMode = "pause" } = opts;
	const bp = BLUEPRINTS[format][level];
	const stimuli = {};
	let sn = 0;
	const ctx = { bank: BANKS[level], pool: POOLS[level](), addStim: (s) => ((stimuli[`s${++sn}`] = s), `s${sn}`) };
	let qn = 0;
	const sections = bp.sections
		.filter((s) => (mode === "section" ? s.key === sectionKey : s.key !== "listening" || listening))
		.map((s) => {
			const questions = [];
			for (const [part, count] of s.parts) {
				for (const q of GEN[part](level, count, ctx)) {
					questions.push({ id: `q${++qn}`, part, skill: PART_META[part].skill, section: s.key, ...q });
				}
			}
			return { key: s.key, minutes: s.minutes, questions };
		});
	return packTest({ level, format, mode, timed, neg, lisMode, opts, sections, stimuli });
}
