import { useMemo } from "react";
import { MODULES } from "../data/modules.js";
import { flattenGrammarPoints, grammarCategories } from "../lib/grammarUtils.js";

// Derives everything a module/level needs (previously computed inline in App.jsx).
export function useModuleData(moduleKey, level, settings, progress) {
	const mod = MODULES[moduleKey];
	const isGrammar = mod.kind === "grammar";
	const isTransformKind = mod.kind === "transform";
	const levelData = mod.levels[level];
	const rawKanjiData = isGrammar ? [] : levelData.data;

	const kanjiData = useMemo(() => {
		if (isGrammar) return rawKanjiData;
		if (moduleKey === "kanji" && !settings.showJukugo) return rawKanjiData.filter((k) => !k.isJukugo);
		return rawKanjiData;
	}, [isGrammar, rawKanjiData, moduleKey, settings.showJukugo]);

	const categories = isGrammar ? [] : levelData.categories;
	const grammarLessons = isGrammar ? levelData.lessons : [];
	const grammarPoints = useMemo(
		() => (isGrammar ? flattenGrammarPoints(grammarLessons, level) : []),
		[isGrammar, grammarLessons, level],
	);
	const grammarCats = useMemo(
		() => (isGrammar ? grammarCategories(grammarLessons) : []),
		[isGrammar, grammarLessons],
	);

	const { accuracy, masteredCount } = useMemo(() => {
		if (isGrammar) return { accuracy: 0, masteredCount: 0 };
		const ids = new Set(kanjiData.map((k) => k.id));
		const entries = Object.entries(progress)
			.filter(([id]) => ids.has(id))
			.map(([, v]) => v);
		const seen = entries.reduce((s, e) => s + e.seen, 0);
		const correct = entries.reduce((s, e) => s + e.correct, 0);
		return {
			accuracy: seen ? Math.round((correct / seen) * 100) : 0,
			masteredCount: entries.filter((e) => e.learned).length,
		};
	}, [progress, kanjiData, isGrammar]);

	const idPrefixMap = { vocabulary: "vocab", kanji: "kanji", grammar: "grammar", transform: "transform" };
	const idPrefix = `${idPrefixMap[moduleKey]}-${level === "all" ? "" : `${level}-`}`;

	return {
		mod, isGrammar, isTransformKind, kanjiData, categories,
		grammarLessons, grammarPoints, grammarCats, accuracy, masteredCount, idPrefix,
	};
}
