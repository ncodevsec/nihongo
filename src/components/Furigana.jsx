import { getKnownReadings } from "../lib/kanjiReadingLookup.js";

const KANJI_RE = /[\u4e00-\u9fff\u3005\u3006\u3007\u303b]/; // includes 々〆〇〻 iteration/numeral marks
const KANA_RE = /[\u3040-\u309f\u30a0-\u30ff]/; // hiragana + katakana (incl. ー long vowel mark)
const BRACKET_RE = /[[［(（][^\]］)）]*[\]］)）]/g;

function classify(ch) {
	if (KANJI_RE.test(ch)) return "kanji";
	if (KANA_RE.test(ch)) return "kana";
	// Everything else — punctuation (。、！？), the ～/〜 placeholder dash
	// used for counter/suffix entries like "～年", digits, latin letters,
	// spaces — is never actually part of a reading, so it's always shown
	// as-is and never required to match anything in the reading string.
	return "other";
}

function katakanaToHiragana(str) {
	return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
		String.fromCharCode(ch.charCodeAt(0) - 0x60),
	);
}

// Splits a word into an ordered sequence of segments: bracket groups kept
// whole (their contents may or may not turn out to be part of the actual
// reading — see buildParts), and consecutive runs of kanji / kana / other
// characters everywhere else.
function tokenize(word) {
	const segments = [];
	const pushRuns = (str) => {
		let current = "";
		let currentType = null;
		for (const ch of str) {
			const type = classify(ch);
			if (type !== currentType) {
				if (current) segments.push({ type: currentType, text: current });
				current = ch;
				currentType = type;
			} else {
				current += ch;
			}
		}
		if (current) segments.push({ type: currentType, text: current });
	};

	let lastIndex = 0;
	let m;
	BRACKET_RE.lastIndex = 0;
	while ((m = BRACKET_RE.exec(word))) {
		if (m.index > lastIndex) pushRuns(word.slice(lastIndex, m.index));
		segments.push({ type: "bracket", raw: m[0], inner: m[0].slice(1, -1) });
		lastIndex = m.index + m[0].length;
	}
	if (lastIndex < word.length) pushRuns(word.slice(lastIndex));
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

// Walks the word's segments left to right against the reading, building
// a flat list of render-ready parts. Returns null if a kana run doesn't
// literally match the reading where expected (a genuinely irregular
// reading) — callers fall back to plain text in that case rather than
// risk a scattered/misaligned result.
function buildParts(segments, reading) {
	const parts = [];
	let pos = 0;

	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i];

		if (seg.type === "other") {
			// Some placeholder/punctuation characters (like the ～ in a
			// counter entry such as "～年") are occasionally echoed
			// literally in the reading string too. If so, stay in sync by
			// consuming it there as well — it's still rendered exactly the
			// same either way, this just keeps the position cursor correct
			// for whatever comes after.
			if (reading.startsWith(seg.text, pos)) pos += seg.text.length;
			parts.push({ type: "plain", text: seg.text });
			continue;
		}

		if (seg.type === "bracket") {
			// Some bracketed content is a real (optional) part of the
			// pronunciation — an honorific prefix like ［お］ in ［お］話 — and
			// some is a non-pronounced grammar/usage note — ［な］ in
			// 嫌い［な］, ［とけいが～］ in 動きます［とけいが～］. Try matching
			// it against the reading at the current position; if it fits,
			// treat it as consumed (so the following kanji doesn't absorb
			// it too); if not, it's just a note — skip over it entirely
			// without moving the reading cursor. Either way it's always
			// rendered as plain text, never wrapped in ruby.
			const hira = katakanaToHiragana(seg.inner);
			if (reading.startsWith(hira, pos)) pos += hira.length;
			else if (reading.startsWith(seg.inner, pos)) pos += seg.inner.length;
			parts.push({ type: "plain", text: seg.raw });
			continue;
		}

		if (seg.type === "kana") {
			if (!reading.startsWith(seg.text, pos)) return null;
			parts.push({ type: "plain", text: seg.text });
			pos += seg.text.length;
			continue;
		}

		// kanji run — find where it ends by anchoring on the next kana
		// segment (skipping over any non-consuming "other"/bracket-note
		// segments in between), or taking the rest of the reading if this
		// is the last meaningful segment.
		let j = i + 1;
		while (segments[j] && segments[j].type === "other") j++;
		let end;
		if (segments[j] && segments[j].type === "kana") {
			const idx = reading.indexOf(segments[j].text, pos);
			end = idx === -1 ? reading.length : idx;
		} else {
			end = reading.length;
		}
		if (end <= pos) return null;

		const chars = [...seg.text];
		const sub = splitCompoundReading(chars, reading.slice(pos, end));
		for (const p of sub) {
			parts.push({ type: "kanji", text: p.char, reading: p.reading });
		}
		pos = end;
	}

	return parts;
}

function renderPart(part, key) {
	if (part.type === "plain") return <span key={key}>{part.text}</span>;
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
// only the kanji. Kana is left as plain text (already phonetic), and so
// is anything punctuation-like or a ～/〜 placeholder dash. Bracketed
// notes (grammar markers, optional prefixes, usage-context reminders)
// are always shown as plain text too — matched against the reading when
// they turn out to be part of the actual pronunciation, skipped over
// when they're not (see buildParts).
export default function Furigana({ text, reading, show, className = "" }) {
	if (!show || !reading || reading === text) {
		return <span className={className}>{text}</span>;
	}

	const segments = tokenize(text);
	if (!segments.some((s) => s.type === "kanji")) {
		return <span className={className}>{text}</span>;
	}

	// A reading occasionally echoes the word's own bracket notation
	// verbatim (a data artifact, e.g. "心配[な]") — strip that. But when
	// the word itself has no brackets at all, a bracket/paren group in the
	// reading is usually genuine optional-pronunciation info instead (e.g.
	// "お正月" read as "(お)しょうがつ" — the お is real, just marked
	// optional) — unwrap those instead of deleting them, keeping the
	// inner content as part of the reading.
	const wordHasBrackets = segments.some((s) => s.type === "bracket");
	const cleanReading = wordHasBrackets
		? reading.replace(BRACKET_RE, "")
		: reading.replace(BRACKET_RE, (m) => m.slice(1, -1));

	const parts = buildParts(segments, cleanReading);
	if (parts) {
		return (
			<span className={className}>
				{parts.map((p, i) => renderPart(p, i))}
			</span>
		);
	}

	// Couldn't cleanly match (a genuinely irregular reading) — fall back
	// to one ruby block, but still only over the actual word, never over
	// bracketed notes, so it can't end up scattered across them.
	const core = segments
		.filter((s) => s.type === "kanji" || s.type === "kana")
		.map((s) => s.text)
		.join("");
	const leading = [];
	const trailing = [];
	let seenCore = false;
	for (const s of segments) {
		if (s.type === "kanji" || s.type === "kana") {
			seenCore = true;
		} else {
			(seenCore ? trailing : leading).push(s.type === "bracket" ? s.raw : s.text);
		}
	}
	if (!core || cleanReading === core) {
		return <span className={className}>{text}</span>;
	}
	return (
		<span className={className}>
			{leading.join("")}
			<ruby>
				{core}
				<rp>(</rp>
				<rt
					className="font-normal text-ai dark:text-ai-glow opacity-90"
					style={{ fontSize: "0.45em" }}
				>
					{cleanReading}
				</rt>
				<rp>)</rp>
			</ruby>
			{trailing.join("")}
		</span>
	);
}
