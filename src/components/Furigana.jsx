import { getKnownReadings } from "../lib/kanjiReadingLookup.js";

const KANJI_RE = /[\u4e00-\u9fff\u3005\u3006\u3007\u303b]/; // includes 々〆〇〻 iteration/numeral marks

function isKanjiChar(ch) {
	return KANJI_RE.test(ch);
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

// Splits a multi-kanji run's reading into one piece per character, so
// e.g. "日本語"/"にほんご" becomes 日→に, 本→ほん, 語→ご instead of one
// block spanning all three. Since we only have a whole-word reading (not
// per-character data) for compounds, this uses our own kanji dataset's
// known onyomi/kunyomi as anchors: it peels a matching known reading off
// whichever end (first or last character) has one, then recurses on the
// rest, so any unmatched character in the middle (often an irregular
// reading, like 日 here) gets whatever's left over by elimination. Falls
// back to an even split across the run when no anchor can be found at all.
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

	// No anchor at either end — divide as evenly as possible, giving any
	// remainder mora to the earlier characters.
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

// Given a word like "食べます" and its whole-word reading "たべます",
// works out which slice of the reading belongs to each kanji character,
// using kana runs (read literally, matching themselves) as anchors
// between kanji runs, and splitCompoundReading() within a multi-kanji
// run. Returns null if the word has no kanji, or if a kana run doesn't
// literally match the reading where expected (an irregular reading) —
// callers fall back to a single whole-word ruby block in that case.
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

// Renders Japanese text with an optional furigana reading, annotating
// only the kanji — kana (hiragana/katakana) is left as plain text since
// it's already phonetic and doesn't need a reading hint. Each kanji
// character gets its own <ruby> sized to its own width, rather than one
// block spanning a whole compound.
export default function Furigana({ text, reading, show, className = "" }) {
	if (!show || !reading || reading === text) {
		return <span className={className}>{text}</span>;
	}

	const parts = splitReadingByKanji(text, reading);
	if (!parts) {
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
			{parts.map((p, i) =>
				p.type === "kana" ? (
					<span key={i}>{p.text}</span>
				) : (
					<ruby key={i}>
						{p.text}
						<rp>(</rp>
						<rt
							className="font-normal text-ai dark:text-ai-glow opacity-90"
							style={{ fontSize: "0.45em" }}
						>
							{p.reading}
						</rt>
						<rp>)</rp>
					</ruby>
				),
			)}
		</span>
	);
}
