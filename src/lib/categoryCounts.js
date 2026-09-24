import { classifyPartOfSpeech, classifyCounting } from "./vocabClassify.js";
import { radicalKeyOf } from "../data/kanji-radicals.js";

// How many items each category holds, for the numbers shown next to every
// entry in the category dropdowns. Counts are over the whole current
// dataset (module + level), independent of any other filter that happens
// to be active, so they answer "how many items are in this category?".

function tally(items, keyFn) {
	const counts = {};
	for (const item of items) {
		const key = keyFn(item);
		if (key) counts[key] = (counts[key] || 0) + 1;
	}
	return counts;
}

// Like tally, but for a group where one item can belong to several
// categories at once (grammar points and their `particles` array) — each
// item is counted once per category it carries.
function tallyMulti(items, keysFn) {
	const counts = {};
	for (const item of items) {
		for (const key of keysFn(item) || []) {
			counts[key] = (counts[key] || 0) + 1;
		}
	}
	return counts;
}

// Vocabulary: lesson / part of speech / counting. Kanji: lesson / radical.
// `total` is the size of the whole dataset (the "All categories" number).
export function vocabKanjiGroupCounts(items, isVocab) {
	const total = items.length;
	const lesson = { counts: tally(items, (k) => k.category), total };
	return isVocab
		? {
				lesson,
				pos: { counts: tally(items, classifyPartOfSpeech), total },
				count: { counts: tally(items, classifyCounting), total },
			}
		: {
				lesson,
				radical: { counts: tally(items, radicalKeyOf), total },
			};
}

// Grammar: lesson and particle group points; transform groups the
// conjugation drill rows.
export function grammarGroupCounts(points, transformRows) {
	return {
		lesson: { counts: tally(points, (p) => p.category), total: points.length },
		particle: { counts: tallyMulti(points, (p) => p.particles), total: points.length },
		transform: { counts: tally(transformRows, (r) => r.category), total: transformRows.length },
	};
}

// Verb / Adjective counts for the standalone Transform tab.
export function transformSubGroupCounts(transformRows) {
	const verb = transformRows.filter((r) => r.category.startsWith("verb-"));
	const adjective = transformRows.filter(
		(r) => r.category.startsWith("i-adj-") || r.category.startsWith("na-adj-"),
	);
	return {
		verb: { counts: tally(verb, (r) => r.category), total: verb.length },
		adjective: { counts: tally(adjective, (r) => r.category), total: adjective.length },
	};
}
