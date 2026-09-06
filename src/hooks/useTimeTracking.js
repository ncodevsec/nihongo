import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Separate storage key from progress/favorites/settings — resetting or
// exporting/importing those never touches this, and this never touches
// them. { "YYYY-MM-DD": totalSeconds }
const STORAGE_KEY = "nihongo-time-v1";

// Same date-key convention used everywhere else in the app (useProgress's
// todayKey(), the streak calc): new Date().toISOString().slice(0, 10).
function todayKey() {
	return new Date().toISOString().slice(0, 10);
}

// How often an in-progress session is written to localStorage, so a tab
// close or crash can lose at most this many seconds of the current
// session rather than the whole thing.
const FLUSH_INTERVAL_MS = 15000;

// If the tab is visible/focused but nothing has been clicked, tapped, or
// typed for this long, we stop counting — an idle open tab in the
// background of someone's day shouldn't inflate "time studied".
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

function loadTimeLog() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : {};
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}

function persistTimeLog(log) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
	} catch {
		// ignore — worst case this session's time isn't saved
	}
}

function isPageActive() {
	return document.visibilityState === "visible" && document.hasFocus();
}

// Tracks how long the app has actually been used — foreground and
// recently-interacted-with only, not just "tab open in a background
// window" — bucketed per calendar day so Progress can show today's, this
// week's, and all-time totals.
export function useTimeTracking() {
	const [timeLog, setTimeLog] = useState(loadTimeLog);
	const segmentStartRef = useRef(null); // ms timestamp, or null while paused
	const lastActivityRef = useRef(Date.now());

	const commitSegment = useCallback(() => {
		if (segmentStartRef.current == null) return;
		const now = Date.now();
		const elapsedSeconds = Math.floor((now - segmentStartRef.current) / 1000);
		segmentStartRef.current = now;
		if (elapsedSeconds <= 0) return;
		setTimeLog((log) => {
			const key = todayKey();
			const next = { ...log, [key]: (log[key] || 0) + elapsedSeconds };
			persistTimeLog(next);
			return next;
		});
	}, []);

	const startSegment = useCallback(() => {
		if (segmentStartRef.current == null) segmentStartRef.current = Date.now();
	}, []);

	const pauseSegment = useCallback(() => {
		commitSegment();
		segmentStartRef.current = null;
	}, [commitSegment]);

	useEffect(() => {
		if (isPageActive()) startSegment();

		const markActivity = () => {
			lastActivityRef.current = Date.now();
			if (isPageActive() && segmentStartRef.current == null) startSegment();
		};

		const handleVisibilityOrFocus = () => {
			if (isPageActive()) markActivity();
			else pauseSegment();
		};

		const idleCheck = setInterval(() => {
			if (
				segmentStartRef.current != null &&
				Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS
			) {
				pauseSegment();
			}
		}, 30000);

		const flush = setInterval(() => {
			if (segmentStartRef.current != null) commitSegment();
		}, FLUSH_INTERVAL_MS);

		document.addEventListener("visibilitychange", handleVisibilityOrFocus);
		window.addEventListener("focus", markActivity);
		window.addEventListener("blur", pauseSegment);
		window.addEventListener("pointerdown", markActivity);
		window.addEventListener("keydown", markActivity);
		window.addEventListener("scroll", markActivity, { passive: true });
		window.addEventListener("beforeunload", commitSegment);

		return () => {
			commitSegment();
			clearInterval(idleCheck);
			clearInterval(flush);
			document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
			window.removeEventListener("focus", markActivity);
			window.removeEventListener("blur", pauseSegment);
			window.removeEventListener("pointerdown", markActivity);
			window.removeEventListener("keydown", markActivity);
			window.removeEventListener("scroll", markActivity);
			window.removeEventListener("beforeunload", commitSegment);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const todaySeconds = timeLog[todayKey()] || 0;

	// "This week" = the current Sun–Sat calendar week, matching the same
	// Sun-first convention ActivityCalendar's weekday header uses.
	const weekSeconds = useMemo(() => {
		const now = new Date();
		const sunday = new Date(now);
		sunday.setDate(now.getDate() - now.getDay());
		let total = 0;
		for (let i = 0; i < 7; i++) {
			const d = new Date(sunday);
			d.setDate(sunday.getDate() + i);
			const key = d.toISOString().slice(0, 10);
			total += timeLog[key] || 0;
		}
		return total;
	}, [timeLog]);

	const totalSeconds = useMemo(
		() => Object.values(timeLog).reduce((sum, s) => sum + s, 0),
		[timeLog],
	);

	return { todaySeconds, weekSeconds, totalSeconds };
}
