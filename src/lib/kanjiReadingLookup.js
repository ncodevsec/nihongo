import { N5_KANJI } from "../data/kanji/n5.js";
import { N4_KANJI } from "../data/kanji/n4.js";

// Onyomi is conventionally stored in katakana (e.g. "ホン"); readings we
// split against (whole-word furigana) are in hiragana, so onyomi needs
// converting before it's usable as a lookup key.
function katakanaToHiragana(str) {
	return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
		String.fromCharCode(ch.charCodeAt(0) - 0x60),
	);
}

function buildLookup() {
	const map = new Map();
	for (const entry of [...N5_KANJI, ...N4_KANJI]) {
		if (entry.isJukugo) continue;
		const readings = new Set();
		for (const r of entry.onyomi || []) {
			if (r.reading) readings.add(katakanaToHiragana(r.reading));
		}
		for (const r of entry.kunyomi || []) {
			if (r.reading) readings.add(r.reading);
		}
		const existing = map.get(entry.kanji);
		if (existing) {
			for (const r of readings) existing.add(r);
		} else {
			map.set(entry.kanji, readings);
		}
	}
	// Longest reading first, so greedy matching prefers e.g. a 2-mora
	// reading over a 1-mora one that happens to also be a valid prefix.
	const sorted = new Map();
	for (const [kanji, set] of map) {
		sorted.set(kanji, [...set].sort((a, b) => b.length - a.length));
	}
	return sorted;
}

// Lazily built on first use — this module is only imported by Furigana.jsx.
let lookup = null;
export function getKnownReadings(kanji) {
	if (!lookup) lookup = buildLookup();
	return lookup.get(kanji) || [];
}

// Per-level sets of individual kanji characters, used to color-code kanji
// throughout the app by whether they belong to the level the person is
// currently studying (e.g. red while in N5 for every kanji that's part of
// the N5 set). Jukugo entries are included too, but since jukugo are only
// ever built from that level's own base kanji, this doesn't add anything
// the base entries don't already cover — it's just a safe, simple way to
// build the set without needing to special-case them.
function buildLevelSet(kanjiList) {
	const set = new Set();
	for (const entry of kanjiList) {
		for (const ch of entry.kanji) set.add(ch);
	}
	return set;
}

let levelSets = null;
export function getLevelKanjiSet(level) {
	if (!levelSets) {
		levelSets = {
			n5: buildLevelSet(N5_KANJI),
			n4: buildLevelSet(N4_KANJI),
		};
	}
	return levelSets[level] || null;
}
