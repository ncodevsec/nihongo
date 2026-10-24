import { useCallback, useState } from "react";

// The learner's imported AI question papers, kept in their own localStorage key
// (nihongo-mock-papers-v1) so progress/settings resets never touch them.
// Each entry: { id, title, level, count, addedAt, paper } — `paper` is the
// validated, ready-to-use form produced by lib/mockTest/paper.js.
const KEY = "nihongo-mock-papers-v1";
const MAX = 30;

const load = () => {
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
		return Array.isArray(raw) ? raw : [];
	} catch {
		return [];
	}
};
const persist = (next) => {
	try {
		localStorage.setItem(KEY, JSON.stringify(next));
		return true;
	} catch {
		return false; // storage full / unavailable
	}
};

export function usePaperLibrary() {
	const [papers, setPapers] = useState(load);

	// entries: [{ paper, count }] → { saved, full }
	const add = useCallback((entries) => {
		const cur = load();
		let next = [...cur];
		for (const { paper, count } of entries) {
			let title = paper.title;
			let n = 2;
			while (next.some((p) => p.title === title && p.level === paper.level)) title = `${paper.title} (${n++})`;
			next = [{ id: `paper-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, level: paper.level, count, addedAt: Date.now(), paper: { ...paper, title } }, ...next];
		}
		next = next.slice(0, MAX);
		if (!persist(next)) return { saved: 0, full: true };
		setPapers(next);
		return { saved: entries.length, full: false, ids: next.slice(0, entries.length).map((p) => p.id) };
	}, []);

	const remove = useCallback((id) => {
		const next = load().filter((p) => p.id !== id);
		persist(next);
		setPapers(next);
	}, []);

	return { papers, add, remove };
}
