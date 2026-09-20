import { useCallback, useState } from "react";
import { MODULES, LEVEL_ORDER } from "../data/modules.js";

// Remembers where the learner last was (module, level and which tab) so
// Home can offer a one-tap "Continue learning". Its own small localStorage
// key — never part of progress/settings, so resets and backups don't
// touch it.
const STORAGE_KEY = "nihongo-last-v1";
const VALID_TABS = ["study", "quiz", "reference", "progress"];

function isValid(s) {
	return (
		s &&
		MODULES[s.moduleKey] &&
		LEVEL_ORDER.includes(s.level) &&
		VALID_TABS.includes(s.tab)
	);
}

function load() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : null;
		return isValid(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export function useLastSession() {
	const [lastSession, setLastSession] = useState(load);

	const saveSession = useCallback((next) => {
		if (!isValid(next)) return;
		setLastSession((prev) =>
			prev &&
			prev.moduleKey === next.moduleKey &&
			prev.level === next.level &&
			prev.tab === next.tab
				? prev
				: next,
		);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		} catch {
			// storage unavailable — Continue simply won't persist
		}
	}, []);

	return { lastSession, saveSession };
}
