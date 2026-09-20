import { MODULES, MODULE_ORDER, LEVEL_ORDER } from "../data/modules.js";
import { flattenGrammarPoints } from "./grammarUtils.js";

// Everything the Home page needs to know about content and progress,
// derived from the same data + progress store the rest of the app uses —
// nothing is stored separately, so Home can never disagree with Progress.

// { [moduleKey]: { [level]: string[] of item ids } } — the ids that count
// toward "learned / total" on the Home cards. Mirrors what App.jsx feeds
// each module (kanji respects the "show jukugo" setting; grammar uses the
// flattened per-point ids).
export function buildContentIndex(showJukugo) {
	const index = {};
	for (const moduleKey of MODULE_ORDER) {
		const mod = MODULES[moduleKey];
		index[moduleKey] = {};
		for (const level of LEVEL_ORDER) {
			const levelData = mod.levels[level];
			if (mod.kind === "grammar") {
				index[moduleKey][level] = flattenGrammarPoints(levelData.lessons, level).map(
					(p) => p.id,
				);
			} else {
				index[moduleKey][level] = levelData.data
					.filter((k) => moduleKey !== "kanji" || showJukugo || !k.isJukugo)
					.map((k) => k.id);
			}
		}
		index[moduleKey].all = LEVEL_ORDER.flatMap((level) => index[moduleKey][level]);
	}
	return index;
}

// Learned / total per module+level, per level overall, and across
// everything, plus overall quiz accuracy.
export function computeHomeStats(index, progress) {
	const byModule = {};
	const byLevel = {};
	let learned = 0;
	let total = 0;

	for (const level of LEVEL_ORDER) byLevel[level] = { learned: 0, total: 0 };

	for (const moduleKey of MODULE_ORDER) {
		byModule[moduleKey] = {};
		for (const level of LEVEL_ORDER) {
			const ids = index[moduleKey][level];
			let done = 0;
			for (const id of ids) if (progress[id]?.learned) done += 1;
			byModule[moduleKey][level] = { learned: done, total: ids.length };
			byLevel[level].learned += done;
			byLevel[level].total += ids.length;
			learned += done;
			total += ids.length;
		}
	}

	let seen = 0;
	let correct = 0;
	for (const entry of Object.values(progress)) {
		seen += entry?.seen || 0;
		correct += entry?.correct || 0;
	}

	// Combined "All" figures are sums of the two levels (kept out of the
	// overall totals above so nothing is counted twice).
	byLevel.all = { learned: 0, total: 0 };
	for (const moduleKey of MODULE_ORDER) {
		const parts = LEVEL_ORDER.map((level) => byModule[moduleKey][level]);
		byModule[moduleKey].all = {
			learned: parts.reduce((n, p) => n + p.learned, 0),
			total: parts.reduce((n, p) => n + p.total, 0),
		};
		byLevel.all.learned += byModule[moduleKey].all.learned;
		byLevel.all.total += byModule[moduleKey].all.total;
	}

	return {
		byModule,
		byLevel,
		learned,
		total,
		accuracy: seen ? Math.round((correct / seen) * 100) : 0,
		hasProgress: Object.keys(progress).length > 0,
	};
}

// Deterministic "kanji of the day": same kanji all day for everyone, a
// different one tomorrow. The stride (97, coprime with the pool size) makes
// consecutive days jump around instead of walking the list in order.
export function kanjiOfTheDay(date = new Date()) {
	const pool = [];
	for (const level of LEVEL_ORDER) {
		for (const k of MODULES.kanji.levels[level].data) {
			if (!k.isJukugo) pool.push({ ...k, level });
		}
	}
	const dayNumber = Math.floor(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
	);
	return pool[(dayNumber * 97) % pool.length];
}

// Headline content numbers for first-time visitors (before there is any
// personal progress to show).
export function contentCounts() {
	let words = 0;
	let kanji = 0;
	let grammar = 0;
	for (const level of LEVEL_ORDER) {
		words += MODULES.vocabulary.levels[level].data.length;
		kanji += MODULES.kanji.levels[level].data.filter((k) => !k.isJukugo).length;
		grammar += flattenGrammarPoints(MODULES.grammar.levels[level].lessons, level).length;
	}
	return { words, kanji, grammar };
}
