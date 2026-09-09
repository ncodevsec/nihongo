import { getLevelKanjiSet } from "../lib/kanjiReadingLookup.js";

// Colors individual kanji characters when they belong to the level the
// person is currently studying (N5 or N4) — a quick "you should already
// know this one" visual cue, usable on any Japanese text: vocab words,
// grammar example sentences, quiz prompts, anywhere — independent of
// whether furigana is also being shown.
export default function LeveledKanji({ text, level, className = "" }) {
	const set = level ? getLevelKanjiSet(level) : null;
	if (!set) return <span className={className}>{text}</span>;
	return (
		<span className={className}>
			{[...text].map((ch, i) =>
				set.has(ch) ? (
					<span key={i} className="text-shu dark:text-shu-glow">
						{ch}
					</span>
				) : (
					ch
				),
			)}
		</span>
	);
}
