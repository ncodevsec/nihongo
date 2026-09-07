import { getKnownReadings } from "../lib/kanjiReadingLookup.js";

const KANJI_RE = /[\u4e00-\u9fff\u3005\u3006\u3007\u303b]/; // includes 々〆〇〻 iteration/numeral marks
const BRACKET_RE = /[[［][^\]］]*[\]］]/g;

function isKanjiChar(ch) {
	return KANJI_RE.test(ch);
}

// Some vocab entries embed bracket notation right in the word string —
// a na-adjective marker ("嫌い［な］"), an optional honorific prefix
// ("［お］酒"), or a usage-context reminder ("動きます［とけいが～］").
// None of that is meant to be pronounced/matched against the reading, so
// it's split out here into its own segments and rendered as plain text,
// leaving only the actual word for furigana matching.
function tokenizeBrackets(word) {
	const segments = [];
	let lastIndex = 0;
	let m;
	BRACKET_RE.lastIndex = 0;
	while ((m = BRACKET_RE.exec(word))) {
		if (m.index > lastIndex) {
			segments.push({ type: "text", content: word.slice(lastIndex, m.index) });
		}
		segments.push({ type: "bracket", content: m[0] });
		lastIndex = m.index + m[0].length;
	}
	if (lastIndex < word.length) {
		segments.push({ type: "text", content: word.slice(lastIndex) });
	}
	return segments;
}

function stripBrackets(str) {
	return str.replace(BRACKET_RE, "");
}

// Splits a word into consecutive runs of kanji vs. everything else (kana,
// punctuation, etc).
function segmentWord(word) {
	const segments = [];
	let current = "";
	let currentType = null;
	for (const ch of word) {
		const type = isKanjiChar(ch) ? "kanji" : "kana";
		if (type !== currentType) {
			if (current) segments.push({ type: currentType, text: current });
			current = ch;
			currentType = type;
		} else {
			current += ch;
		}
	}
	if (current) segments.push({ type: currentType, text: current });
	return segments;
}

// Splits a multi-kanji run's reading into one piece per character (e.g.
// 日本語/にほんご → 日→に, 本→ほん, 語→ご) using our own kanji dataset's
// known onyomi/kunyomi as anchors: peels a matching known reading off
// whichever end has one, then recurses on the rest, so an unmatched
// character in the middle (often an irregular reading) gets whatever's
// left over by elimination. Falls back to an even split when no anchor
// can be found at all.
function splitCompoundReading(chars, reading) {
	if (chars.length === 1) return [{ char: chars[0], reading }];

	const first = chars[0];
	const firstMatch = getKnownReadings(first).find((r) =>
		reading.startsWith(r),
	);
	if (firstMatch) {
		return [
			{ char: first, reading: firstMatch },
			...splitCompoundReading(
				chars.slice(1),
				reading.slice(firstMatch.length),
			),
		];
	}

	const last = chars[chars.length - 1];
	const lastMatch = getKnownReadings(last).find((r) => reading.endsWith(r));
	if (lastMatch) {
		return [
			...splitCompoundReading(
				chars.slice(0, -1),
				reading.slice(0, reading.length - lastMatch.length),
			),
			{ char: last, reading: lastMatch },
		];
	}

	const base = Math.floor(reading.length / chars.length);
	const extra = reading.length % chars.length;
	const result = [];
	let pos = 0;
	for (let i = 0; i < chars.length; i++) {
		const len = base + (i < extra ? 1 : 0);
		result.push({ char: chars[i], reading: reading.slice(pos, pos + len) });
		pos += len;
	}
	return result;
}

// Given a bracket-free word like "食べます" and its reading "たべます",
// works out which slice of the reading belongs to each kanji character.
// Returns null if there's no kanji, or a kana run doesn't literally match
// the reading where expected (an irregular reading) — callers fall back
// to plain text in that case.
function splitReadingByKanji(word, reading) {
	const segments = segmentWord(word);
	if (!segments.some((s) => s.type === "kanji")) return null;

	const result = [];
	let pos = 0;
	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i];
		if (seg.type === "kana") {
			if (!reading.startsWith(seg.text, pos)) return null;
			result.push({ type: "kana", text: seg.text });
			pos += seg.text.length;
		} else {
			const next = segments[i + 1];
			let end;
			if (next) {
				const idx = reading.indexOf(next.text, pos);
				if (idx === -1) return null;
				end = idx;
			} else {
				end = reading.length;
			}
			if (end <= pos) return null;
			const chars = [...seg.text];
			const parts = splitCompoundReading(chars, reading.slice(pos, end));
			for (const p of parts) {
				result.push({ type: "kanji", text: p.char, reading: p.reading });
			}
			pos = end;
		}
	}
	return result;
}

function renderPart(part, key) {
	if (part.type === "kana") return <span key={key}>{part.text}</span>;
	return (
		<ruby key={key}>
			{part.text}
			<rp>(</rp>
			<rt
				className="font-normal text-ai dark:text-ai-glow opacity-90"
				style={{ fontSize: "0.45em" }}
			>
				{part.reading}
			</rt>
			<rp>)</rp>
		</ruby>
	);
}

// Renders Japanese text with an optional furigana reading, annotating
// only the kanji — kana (hiragana/katakana) is left as plain text since
// it's already phonetic. Bracket-notation portions of the word (na-
// adjective markers, optional prefixes, usage hints — see
// tokenizeBrackets) are always shown as plain text at their original
// position, never wrapped in ruby, since they're not actually pronounced
// as part of the reading.
export default function Furigana({ text, reading, show, className = "" }) {
	if (!show || !reading || reading === text) {
		return <span className={className}>{text}</span>;
	}

	const segments = tokenizeBrackets(text);
	const hasBrackets = segments.some((s) => s.type === "bracket");
	const coreWord = segments
		.filter((s) => s.type === "text")
		.map((s) => s.content)
		.join("");
	const coreReading = hasBrackets ? stripBrackets(reading) : reading;

	if (!coreWord || coreReading === coreWord) {
		return <span className={className}>{text}</span>;
	}

	const parts = splitReadingByKanji(coreWord, coreReading);

	if (!hasBrackets) {
		if (!parts) {
			// Couldn't cleanly separate kana from kanji (e.g. an irregular
			// reading with no kana anchor) — still better to show the
			// reading over the whole word than not at all.
			return (
				<ruby className={className}>
					{text}
					<rp>(</rp>
					<rt
						className="font-normal text-ai dark:text-ai-glow opacity-90"
						style={{ fontSize: "0.45em" }}
					>
						{reading}
					</rt>
					<rp>)</rp>
				</ruby>
			);
		}
		return (
			<span className={className}>
				{parts.map((p, i) => renderPart(p, i))}
			</span>
		);
	}

	// Bracket-notation entry: never fall back to a single ruby block
	// spanning brackets/hints too (that's exactly what produced furigana
	// scattered across unrelated glyphs) — if a clean split isn't
	// possible, just show the plain word instead.
	if (!parts) {
		return <span className={className}>{text}</span>;
	}

	const rendered = [];
	let coreOffset = 0;
	let partCursor = 0;
	for (const seg of segments) {
		if (seg.type === "bracket") {
			rendered.push(<span key={rendered.length}>{seg.content}</span>);
			continue;
		}
		const segEnd = coreOffset + seg.content.length;
		while (partCursor < parts.length && coreOffset < segEnd) {
			const p = parts[partCursor];
			rendered.push(renderPart(p, rendered.length));
			coreOffset += p.type === "kana" ? p.text.length : 1;
			partCursor++;
		}
	}

	return <span className={className}>{rendered}</span>;
}
