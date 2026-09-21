import {
	classifyPartOfSpeech,
	classifyCounting,
	POS_CATEGORIES,
	COUNTING_CATEGORIES,
} from "./vocabClassify.js";
import { RADICAL_CATEGORIES, radicalKeyOf } from "../data/kanji-radicals.js";

// Shared ordering for the List and Flashcards tabs. Besides the plain
// columns (word, reading, meaning, learned status) an item list can be
// sorted BY CATEGORY GROUP — lesson, part of speech, counting type, radical
// — in the same order the category dropdowns list them. Items that don't
// belong to any category of the chosen group always sink to the bottom,
// in either direction.

export const indexMap = (categories) => new Map(categories.map((c, i) => [c.key, i]));

const GROUP_INDEX = {
	pos: indexMap(POS_CATEGORIES),
	count: indexMap(COUNTING_CATEGORIES),
	radical: indexMap(RADICAL_CATEGORIES),
};
const GROUP_KEY = {
	pos: classifyPartOfSpeech,
	count: classifyCounting,
	radical: radicalKeyOf,
};

// Compare two items by their position in a category order. Returns null
// when either has no position (caller keeps those last).
function byPosition(indexOf, ka, kb) {
	const a = indexOf.get(ka);
	const b = indexOf.get(kb);
	if (a === undefined && b === undefined) return 0;
	if (a === undefined) return "last-a";
	if (b === undefined) return "last-b";
	return a - b;
}

// Comparator over any list where each item maps to a category key.
// `keyOf(item)` -> key, `indexOf` -> Map(key -> position).
export function makeGroupComparator(keyOf, indexOf, sortDir) {
	const dir = sortDir === "asc" ? 1 : -1;
	return (x, y) => {
		const r = byPosition(indexOf, keyOf(x), keyOf(y));
		if (r === "last-a") return 1;
		if (r === "last-b") return -1;
		return r * dir;
	};
}

// Comparator for vocabulary / kanji items.
//   sortBy: lesson | pos | count | radical | word | reading | meaning | status
export function makeItemComparator({ sortBy, sortDir, lessonIndex, meaningText, lang, progress }) {
	const dir = sortDir === "asc" ? 1 : -1;

	if (GROUP_INDEX[sortBy]) {
		return makeGroupComparator(GROUP_KEY[sortBy], GROUP_INDEX[sortBy], sortDir);
	}

	return (a, b) => {
		let cmp = 0;
		if (sortBy === "word") {
			cmp = a.kanji.localeCompare(b.kanji, "ja");
		} else if (sortBy === "reading") {
			cmp = a.reading.localeCompare(b.reading, "ja");
		} else if (sortBy === "meaning") {
			cmp = meaningText(a).localeCompare(meaningText(b), lang === "bn" ? "bn" : "en");
		} else if (sortBy === "status") {
			cmp = (progress[a.id]?.learned ? 1 : 0) - (progress[b.id]?.learned ? 1 : 0);
		} else {
			// lesson (default): textbook order via the lesson category index
			cmp = (lessonIndex.get(a.category) ?? 0) - (lessonIndex.get(b.category) ?? 0);
		}
		return cmp * dir;
	};
}

// Comparator for grammar points / transformation rows, by category group.
//   sortBy: lesson | particle (points) — transform (drill rows)
export function makeGrammarComparator({ sortBy, sortDir, lessonCategories, particleCategories, transformCategories }) {
	if (sortBy === "particle") {
		return makeGroupComparator((p) => p.particle || "other", indexMap(particleCategories), sortDir);
	}
	if (sortBy === "transform") {
		return makeGroupComparator((r) => r.category, indexMap(transformCategories), sortDir);
	}
	return makeGroupComparator((p) => p.category, indexMap(lessonCategories), sortDir);
}

// Which sort options make sense for the active grammar group: drill rows
// only have their transformation category; points have lesson and particle.
export function grammarSortKeys(isTransform) {
	return isTransform ? ["transform"] : ["lesson", "particle"];
}
