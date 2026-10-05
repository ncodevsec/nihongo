import { useCallback, useState } from "react";

// Mock-test persistence, kept in its own localStorage keys (never part of
// progress/settings, so resetting those can't touch it):
//   nihongo-mock-v1          finished attempts (newest first, capped)
//   nihongo-mock-session-v1  the exam in progress, so a reload can resume it
const HISTORY_KEY = "nihongo-mock-v1";
const SESSION_KEY = "nihongo-mock-session-v1";
const MAX_HISTORY = 40;

const read = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
};
const write = (key, value) => {
	try {
		if (value == null) localStorage.removeItem(key);
		else localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// storage unavailable / full — the exam still works, it just won't survive a reload
	}
};

// Latest finished attempts, read straight from storage (Home uses this).
export const readMockHistory = () => {
	const h = read(HISTORY_KEY, []);
	return Array.isArray(h) ? h : [];
};

export function useMockStore() {
	const [history, setHistory] = useState(() => {
		const h = read(HISTORY_KEY, []);
		return Array.isArray(h) ? h : [];
	});

	const addResult = useCallback((entry) => {
		setHistory((h) => {
			const next = [entry, ...h].slice(0, MAX_HISTORY);
			write(HISTORY_KEY, next);
			return next;
		});
	}, []);

	const clearHistory = useCallback(() => {
		write(HISTORY_KEY, null);
		setHistory([]);
	}, []);

	const loadSession = useCallback(() => {
		const s = read(SESSION_KEY, null);
		return s && s.test && Array.isArray(s.test.sections) ? s : null;
	}, []);
	const saveSession = useCallback((s) => write(SESSION_KEY, s), []);

	return { history, addResult, clearHistory, loadSession, saveSession };
}
