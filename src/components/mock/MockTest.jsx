import { useCallback, useEffect, useState } from "react";
import { useMockStore } from "../../hooks/useMockStore.js";
import { usePaperLibrary } from "../../hooks/usePaperLibrary.js";
import { buildTest } from "../../lib/mockTest/build.js";
import { paperToTest } from "../../lib/mockTest/paper.js";
import { scoreTest } from "../../lib/mockTest/score.js";
import { stopSpeech } from "../../lib/mockTest/speech.js";
import MockSetup from "./MockSetup.jsx";
import MockExam from "./MockExam.jsx";
import MockResults from "./MockResults.jsx";

// The Mock Test tab: setup → exam → results. The exam in progress lives in
// `session` (persisted by useMockStore so a reload can resume it); once the last
// section is submitted it is scored, saved to history and shown as `result`.
export default function MockTest({ settings, level: appLevel, onLaunch, isActive = true }) {
	const lang = settings.uiLang;
	const store = useMockStore();
	const library = usePaperLibrary();
	const [level, setLevel] = useState(appLevel === "n4" ? "n4" : "n5");
	const [session, setSessionState] = useState(store.loadSession);
	const [result, setResult] = useState(null);

	// Follow the app-wide level switch (N5 / N4); "All" keeps the current one.
	useEffect(() => {
		if (appLevel === "n5" || appLevel === "n4") setLevel(appLevel);
	}, [appLevel]);

	const { saveSession, addResult } = store;
	const setSession = useCallback(
		(updater) => {
			setSessionState((prev) => {
				const next = typeof updater === "function" ? updater(prev) : updater;
				saveSession(next);
				return next;
			});
		},
		[saveSession],
	);

	// opts: { level, format, mode, sectionKey, timed, listening, lisMode, neg, source, paperId }
	const start = (opts) => {
		let test = null;
		if (opts.source === "paper") {
			const entry = library.papers.find((p) => p.id === opts.paperId);
			test = entry ? paperToTest(entry.paper, opts) : null;
		}
		if (!test) test = buildTest({ ...opts, source: "builtin" });
		setResult(null);
		setSession({
			test,
			answers: {},
			flags: {},
			plays: {},
			lisPos: 0,
			sIdx: 0,
			qIdx: 0,
			stage: "intro",
			sectionStartedAt: null,
			secondsUsed: {},
			startedAt: Date.now(),
		});
		window.scrollTo({ top: 0 });
	};

	const finish = useCallback(
		(s) => {
			stopSpeech();
			const score = scoreTest(s.test, s.answers, s.secondsUsed);
			const seconds = Object.values(s.secondsUsed).reduce((a, b) => a + b, 0);
			addResult({
				id: s.test.id,
				at: Date.now(),
				level: s.test.level,
				format: s.test.format,
				mode: s.test.mode,
				section: s.test.mode === "section" ? s.test.sections[0].key : null,
				title: s.test.title,
				neg: s.test.neg || 0,
				lk: score.lk,
				lis: score.lis,
				total: score.total,
				pass: score.pass,
				complete: score.complete,
				correct: score.correct,
				questions: score.totalQuestions,
				seconds,
			});
			setResult({ test: s.test, answers: s.answers, flags: s.flags, score });
			setSession(null);
			window.scrollTo({ top: 0 });
		},
		[addResult, setSession],
	);

	const abandon = () => {
		stopSpeech();
		setSession(null);
	};

	if (session) {
		return <MockExam session={session} setSession={setSession} lang={lang} isActive={isActive} onFinish={finish} onAbandon={abandon} />;
	}
	if (result) {
		return (
			<MockResults
				result={result}
				lang={lang}
				onClose={() => setResult(null)}
				onRetake={() => {
					const t = result.test;
					// `opts` is missing on papers started before v1.26 — rebuild it from the test.
					start(t.opts || { level: t.level, format: t.format, mode: t.mode, sectionKey: t.mode === "section" ? t.sections[0].key : null, timed: t.timed, listening: t.sections.some((x) => x.key === "listening") });
				}}
				onLaunch={onLaunch}
			/>
		);
	}
	return (
		<MockSetup
			lang={lang}
			level={level}
			setLevel={setLevel}
			history={store.history}
			onClearHistory={store.clearHistory}
			library={library}
			onStart={start}
		/>
	);
}
