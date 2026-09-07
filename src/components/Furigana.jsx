const KANJI_RE = /[\u4e00-\u9fff\u3005\u3006\u3007\u303b]/; // includes 々〆〇〻 iteration/numeral marks

function isKanjiChar(ch) {
	return KANJI_RE.test(ch);
}

// Splits a word into consecutive runs of kanji vs. everything else (kana,
// punctuation, etc). Adjacent kanji characters merge into one run — e.g.
// 学校 stays a single run, so a compound still gets one furigana label
// over the whole thing rather than one per character.
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

// Given a word like "食べます" and its whole-word reading "たべます",
// works out which slice of the reading belongs to each kanji run, using
// the kana runs (read literally, matching themselves) as anchors. Returns
// null if the word has no kanji, or if the reading doesn't literally
// contain the kana runs where expected (an irregular reading) — callers
// fall back to a single ruby block over the whole word in that case.
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
			if (end <= pos) return null; // no reading left for this kanji run
			result.push({
				type: "kanji",
				text: seg.text,
				reading: reading.slice(pos, end),
			});
			pos = end;
		}
	}
	return result;
}

// Renders Japanese text with an optional furigana reading, annotating
// only the kanji portions — kana (hiragana/katakana) is left as plain
// text since it's already phonetic and doesn't need a reading hint.
// Falls back to plain text entirely when furigana is off, there's no
// reading, the reading matches the text verbatim (kana-only entries), or
// the word/reading pair can't be split reliably (an irregular reading —
// rare, but safer to show nothing extra than something wrong).
export default function Furigana({ text, reading, show, className = "" }) {
	if (!show || !reading || reading === text) {
		return <span className={className}>{text}</span>;
	}

	const parts = splitReadingByKanji(text, reading);
	if (!parts) {
		// Couldn't cleanly separate kana from kanji (e.g. no kana runs to
		// anchor against, or an irregular reading) — still better to show
		// the reading over the whole word than not at all.
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
