import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { mt } from "../../lib/mockI18n.js";
import { useHotkeys } from "../../hooks/useHotkeys.js";
import { speakLines, stopSpeech } from "../../lib/mockTest/speech.js";
import { TIMING, buildProgram, clipFor } from "../../lib/mockTest/program.js";
import { PART_META } from "../../data/mock/blueprints.js";
import Icon from "../home/icons.jsx";

const MAX_PLAYS = 2;
const fmt = (s) => {
	const n = Math.max(0, s);
	const h = Math.floor(n / 3600);
	const m = Math.floor((n % 3600) / 60);
	return `${h ? `${h}:${String(m).padStart(2, "0")}` : m}:${String(n % 60).padStart(2, "0")}`;
};

const Blank = () => <span className="inline-block min-w-[3.5rem] mx-1 border-b-2 border-shu dark:border-shu-glow align-baseline">&nbsp;</span>;

function Sentence({ text }) {
	const bits = text.split("( )");
	return bits.map((b, i) => (
		<span key={i}>
			{b}
			{i < bits.length - 1 && <Blank />}
		</span>
	));
}

export function Stimulus({ s, blank }) {
	if (!s) return null;
	const body =
		s.kind === "cloze"
			? s.text.split(/\((\d)\)/).map((chunk, i) =>
					i % 2 === 1 ? (
						<span key={i} className={`inline-flex items-center justify-center min-w-[1.6rem] mx-0.5 px-1 rounded text-[11px] font-mono font-bold align-baseline ${Number(chunk) === blank ? "bg-shu text-washi" : "bg-ai-soft dark:bg-night-line text-ink-muted dark:text-night-ink-muted"}`}>{chunk}</span>
					) : (
						chunk
					),
				)
			: s.text;
	return (
		<div className={`rounded-lg border px-4 py-3 mb-4 ${s.kind === "info" ? "border-shu/30 dark:border-shu-glow/30 bg-shu-soft/50 dark:bg-night" : "border-ai-line dark:border-night-line bg-washi dark:bg-night"}`}>
			{s.title && <div lang="ja" className="font-mincho text-xs font-bold text-shu dark:text-shu-glow mb-1.5">{s.title}</div>}
			<div lang="ja" className="font-mincho text-[15px] leading-loose text-ink dark:text-night-ink whitespace-pre-line">{body}</div>
		</div>
	);
}

export function Prompt({ q }) {
	if (q.kind === "word")
		return <div lang="ja" className="font-mincho text-4xl sm:text-5xl text-center text-ink dark:text-night-ink py-4"><span className="underline decoration-shu dark:decoration-shu-glow decoration-2 underline-offset-[10px]">{q.prompt}</span></div>;
	if (q.kind === "kana")
		return <div lang="ja" className="font-mincho text-3xl sm:text-4xl text-center text-ink dark:text-night-ink py-4"><span className="underline decoration-shu dark:decoration-shu-glow decoration-2 underline-offset-[10px]">{q.prompt}</span></div>;
	if (q.kind === "order") {
		const slots = [0, 1, 2, 3].map((i) => (i === q.order.star - 1 ? "★" : "＿＿"));
		return (
			<div lang="ja" className="font-mincho text-lg sm:text-xl leading-loose text-ink dark:text-night-ink py-2">
				{q.order.pre}
				{slots.map((s, i) => (
					<span key={i} className={`inline-block mx-1 px-2 border-b-2 text-center min-w-[2.5rem] ${s === "★" ? "border-shu text-shu font-bold" : "border-ink-muted/50 text-ink-muted/40"}`}>{s}</span>
				))}
				{q.order.post}
			</div>
		);
	}
	if (!q.prompt) return null;
	return <div lang="ja" className="font-mincho text-lg sm:text-xl leading-loose text-ink dark:text-night-ink py-1"><Sentence text={q.prompt} /></div>;
}

function Player({ q, plays, onPlay, lang }) {
	const M = (k, v) => mt(lang, k, v);
	const [busy, setBusy] = useState(false);
	const cancel = useRef(null);
	useEffect(() => () => { cancel.current?.(); stopSpeech(); }, [q.id]);
	const left = MAX_PLAYS - (plays || 0);
	const play = () => {
		if (busy || left <= 0) return;
		onPlay();
		setBusy(true);
		cancel.current = speakLines(q.lis ? clipFor(q) : q.audio, { onEnd: () => setBusy(false) });
	};
	return (
		<div className="flex items-center gap-3 rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night px-4 py-3 mb-4">
			<button
				type="button"
				onClick={play}
				disabled={busy || left <= 0}
				aria-label={M("play")}
				className="w-12 h-12 shrink-0 rounded-full bg-shu text-washi flex items-center justify-center shadow-card disabled:opacity-40"
			>
				<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">{busy ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
			</button>
			<div className="min-w-0">
				<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{busy ? M("playing") : left > 0 ? M("tapToListen") : M("noPlaysLeft")}</div>
				<div className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{M("playsLeft", { n: Math.max(0, left), max: MAX_PLAYS })}</div>
			</div>
		</div>
	);
}

function QuestionMap({ questions, qIdx, answers, flags, onGo, lang }) {
	const M = (k) => mt(lang, k);
	return (
		<div>
			<div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-5 gap-1.5">
				{questions.map((q, i) => {
					const done = answers[q.id] !== undefined;
					return (
						<button
							key={q.id}
							type="button"
							onClick={() => onGo(i)}
							aria-label={`${i + 1}`}
							aria-current={i === qIdx}
							className={`relative h-8 rounded-md border font-mono text-[11px] font-semibold ${
								i === qIdx ? "ring-2 ring-shu dark:ring-shu-glow " : ""
							}${done ? "bg-shu-soft dark:bg-night border-shu/40 dark:border-shu-glow/40 text-shu dark:text-shu-glow" : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted"}`}
						>
							{i + 1}
							{flags[q.id] && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />}
						</button>
					);
				})}
			</div>
			<div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">
				<span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-shu-soft border border-shu/40" />{M("legendAnswered")}</span>
				<span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm border border-ai-line" />{M("legendBlank")}</span>
				<span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />{M("legendFlag")}</span>
			</div>
		</div>
	);
}

// Continuous listening ("exam-like"): the whole section is one audio
// programme — opening, directions, numbered items, silent answer windows —
// that can be neither paused nor replayed; items advance by themselves.
function ListeningRun({ session, setSession, section, lang, isActive, onSubmit, quitBar }) {
	const M = (k, v) => mt(lang, k, v);
	const { answers } = session;
	const qs = section.questions;
	const events = useMemo(() => buildProgram(qs), [qs]);
	const [started, setStarted] = useState(false);
	const [pos, setPos] = useState(session.lisPos || 0);
	const [left, setLeft] = useState(0);
	const total = useRef(1);

	useEffect(() => {
		setSession((s) => (s.lisPos === pos ? s : { ...s, lisPos: pos }));
	}, [pos, setSession]);

	useEffect(() => {
		if (!started) return undefined;
		if (pos >= events.length) {
			onSubmit();
			return undefined;
		}
		const ev = events[pos];
		if (ev.k === "say") {
			const stop = speakLines(ev.lines, { gapMs: ev.gapMs ?? TIMING.turnGapMs, rate: 0.9, onEnd: () => setPos((p) => p + 1) });
			return stop;
		}
		const end = Date.now() + ev.sec * 1000;
		total.current = ev.sec;
		setLeft(ev.sec);
		const iv = setInterval(() => {
			const r = Math.ceil((end - Date.now()) / 1000);
			setLeft(Math.max(0, r));
			if (r <= 0) {
				clearInterval(iv);
				setPos((p) => p + 1);
			}
		}, 200);
		return () => clearInterval(iv);
	}, [started, pos, events, onSubmit]);

	useEffect(() => () => stopSpeech(), []);

	const ev = events[Math.min(pos, events.length - 1)];
	const q = qs[ev.qi];
	const itemLive = started && ["item", "read", "answer"].includes(ev.tag);
	const answer = useCallback((i) => itemLive && setSession((s) => ({ ...s, answers: { ...s.answers, [q.id]: i } })), [itemLive, q, setSession]);

	useHotkeys(
		useCallback(
			(e) => {
				if (!isActive || !itemLive || e.metaKey || e.ctrlKey) return;
				const n = Number(e.key);
				if (n >= 1 && n <= q.choices.length) answer(n - 1);
			},
			[isActive, itemLive, q, answer],
		),
	);

	if (!started) {
		return (
			<div className="max-w-xl mx-auto">
				<div className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-5 sm:p-6">
					<div className="font-mono text-[11px] font-semibold text-shu dark:text-shu-glow">{M("lisContinuous")}</div>
					<h2 className="font-bengali text-xl font-bold text-ink dark:text-night-ink mt-1">{M("lisReadyTitle")}</h2>
					<ul className="mt-3 space-y-2">
						{["lisRule1", "lisRule2", "lisRule3", "lisRule4"].map((k) => (
							<li key={k} className="flex gap-2 font-bengali text-xs text-ink-muted dark:text-night-ink-muted leading-relaxed">
								<span className="mt-[0.5em] w-1.5 h-1.5 rounded-full bg-shu/70 shrink-0" />
								{M(k)}
							</li>
						))}
					</ul>
					<div className="grid grid-cols-2 gap-2.5 mt-5">
						<button onClick={() => speakLines([{ who: "N", text: "テストです。この こえが きこえますか。" }], { rate: 0.9 })} className="font-bengali text-sm font-semibold border border-ai-line dark:border-night-line rounded-lg py-2.5 text-ink dark:text-night-ink hover:border-shu/60">🔊 {M("testSound")}</button>
						<button onClick={() => setStarted(true)} className="font-bengali text-sm font-semibold bg-shu text-washi rounded-lg py-2.5 hover:brightness-110">▶ {pos > 0 ? M("lisResume") : M("lisStartAudio")}</button>
					</div>
				</div>
				{quitBar}
			</div>
		);
	}

	const answered = qs.filter((x) => answers[x.id] !== undefined).length;
	const pct = ev.k === "wait" ? (left / total.current) * 100 : 0;
	const status = ev.tag === "read" ? "lisStatusRead" : ev.tag === "answer" ? "lisStatusAnswer" : ev.k === "say" ? "lisStatusPlaying" : "lisStatusWait";

	return (
		<div className="max-w-2xl mx-auto">
			<div className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-6">
				<div className="flex items-center justify-between mb-3">
					<span className="font-mono text-[11px] font-semibold text-shu dark:text-shu-glow">{M("lisContinuous")}</span>
					<span className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{M("qOf", { n: ev.qi + 1, total: qs.length })} · {answered}/{qs.length}</span>
				</div>

				<div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${ev.tag === "answer" ? "border-shu dark:border-shu-glow bg-shu-soft dark:bg-night" : "border-ai-line dark:border-night-line bg-washi dark:bg-night"}`} role="status" aria-live="polite">
					<span className="text-lg" aria-hidden="true">{ev.k === "say" ? "🔊" : "⏳"}</span>
					<div className="min-w-0 flex-1">
						<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{M(status)}{ev.k === "wait" && <span className="font-mono ml-2 text-shu dark:text-shu-glow">{left}s</span>}</div>
						{ev.k === "wait" && <div className="h-1.5 mt-2 rounded-full bg-ai-soft dark:bg-night-line overflow-hidden"><div className="h-full bg-shu dark:bg-shu-glow transition-[width] duration-200" style={{ width: `${pct}%` }} /></div>}
					</div>
				</div>

				{ev.tag === "dir" && (
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted leading-relaxed mt-4"><span lang="ja" className="font-mincho font-bold text-washi bg-shu rounded-full px-2 py-0.5 mr-2">{PART_META[q.part].jp}</span>{M(`ins_${q.part}`)}</p>
				)}
				{ev.tag === "open" && <p className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted text-center mt-6">{M("lisOpening")}</p>}
				{ev.tag === "close" && <p className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted text-center mt-6">{M("lisClosing")}</p>}

				{itemLive && (
					<div className="mt-5">
						<div className="font-mono text-xs font-bold text-shu dark:text-shu-glow mb-2">{M("questionNo", { n: ev.qi + 1 })}</div>
						<div className={q.hide ? "grid grid-cols-3 gap-2.5" : "space-y-2"} role="radiogroup">
							{q.choices.map((c, i) => {
								const on = answers[q.id] === i;
								return (
									<button key={i} role="radio" aria-checked={on} onClick={() => answer(i)} className={`w-full text-left rounded-lg border px-3.5 py-3 flex items-center gap-3 ${on ? "border-shu dark:border-shu-glow bg-shu-soft dark:bg-night ring-1 ring-shu/30" : "border-ai-line dark:border-night-line hover:border-shu/50"} ${q.hide ? "justify-center" : ""}`}>
										<span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${on ? "bg-shu text-washi border-shu" : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted"}`}>{i + 1}</span>
										{!q.hide && <span lang="ja" className="font-mincho text-base text-ink dark:text-night-ink">{c}</span>}
									</button>
								);
							})}
						</div>
						<p className="font-mono text-[10px] text-center text-ink-muted/70 dark:text-night-ink-muted/70 mt-3">{M("lisLocked")}</p>
					</div>
				)}
			</div>
			{quitBar}
		</div>
	);
}

export default function MockExam({ session, setSession, lang, isActive, onFinish, onAbandon }) {
	const M = (k, v) => mt(lang, k, v);
	const { test, answers, flags, plays, sIdx, qIdx, stage } = session;
	const section = test.sections[sIdx];
	const questions = section.questions;
	const q = questions[qIdx];
	const [now, setNow] = useState(Date.now());
	const [confirm, setConfirm] = useState(null); // "submit" | "quit"
	const [mapOpen, setMapOpen] = useState(false);
	const submitted = useRef(false);
	const continuous = test.lisMode === "continuous" && section.key === "listening" && !!q?.lis;

	const deadline = test.timed && !continuous && session.sectionStartedAt ? session.sectionStartedAt + section.minutes * 60000 : null;
	const remaining = deadline ? Math.ceil((deadline - now) / 1000) : null;

	useEffect(() => {
		if (stage !== "run" || !test.timed) return undefined;
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, [stage, test.timed]);

	useEffect(() => {
		if (stage === "done") onFinish(session);
	}, [stage, session, onFinish]);

	const patch = useCallback((p) => setSession((s) => ({ ...s, ...p })), [setSession]);

	const submitSection = useCallback(() => {
		if (submitted.current) return;
		submitted.current = true;
		stopSpeech();
		setConfirm(null);
		setSession((s) => {
			const sec = s.test.sections[s.sIdx];
			const used = Math.min(Math.round((Date.now() - s.sectionStartedAt) / 1000), sec.minutes * 60 + 1);
			const secondsUsed = { ...s.secondsUsed, [sec.key]: used };
			return s.sIdx + 1 >= s.test.sections.length
				? { ...s, secondsUsed, stage: "done" }
				: { ...s, secondsUsed, sIdx: s.sIdx + 1, qIdx: 0, stage: "intro", sectionStartedAt: null };
		});
		window.scrollTo({ top: 0 });
	}, [setSession]);

	useEffect(() => {
		submitted.current = false;
	}, [sIdx, stage]);

	// Time's up — the section is handed in as it stands.
	useEffect(() => {
		if (stage === "run" && remaining !== null && remaining <= 0) submitSection();
	}, [stage, remaining, submitSection]);

	const answer = useCallback((i) => q && patch({ answers: { ...answers, [q.id]: i } }), [q, answers, patch]);
	const go = useCallback((i) => { stopSpeech(); patch({ qIdx: Math.min(Math.max(i, 0), questions.length - 1), stage: "run" }); }, [patch, questions.length]);
	const flag = useCallback(() => q && patch({ flags: { ...flags, [q.id]: !flags[q.id] } }), [q, flags, patch]);

	useHotkeys(
		useCallback(
			(e) => {
				if (!isActive || stage !== "run" || continuous || !q || e.target.tagName === "INPUT" || e.metaKey || e.ctrlKey) return;
				const n = Number(e.key);
				if (n >= 1 && n <= q.choices.length) answer(n - 1);
				else if (e.key === "ArrowRight") go(qIdx + 1);
				else if (e.key === "ArrowLeft") go(qIdx - 1);
				else if (e.key.toLowerCase() === "f") flag();
			},
			[isActive, stage, continuous, q, qIdx, answer, go, flag],
		),
	);

	const answeredCount = questions.filter((x) => answers[x.id] !== undefined).length;
	const flaggedCount = questions.filter((x) => flags[x.id]).length;
	const low = remaining !== null && remaining <= 120;

	const quitBar = (
		<div className="flex justify-center mt-6">
			{confirm === "quit" ? (
				<div className="flex items-center gap-2 font-bengali text-xs">
					<span className="text-ink-muted dark:text-night-ink-muted">{M("quitConfirm")}</span>
					<button onClick={onAbandon} className="rounded-md bg-shu text-washi px-3 py-1.5 font-semibold">{M("quit")}</button>
					<button onClick={() => setConfirm(null)} className="rounded-md border border-ai-line dark:border-night-line px-3 py-1.5 text-ink dark:text-night-ink">{M("cancel")}</button>
				</div>
			) : (
				<button onClick={() => setConfirm("quit")} className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted hover:text-shu underline">{M("quitExam")}</button>
			)}
		</div>
	);

	// ---------- section intro ----------
	if (stage === "intro") {
		const count = questions.length;
		const parts = [...new Set(questions.map((x) => x.part))];
		return (
			<div className="max-w-xl mx-auto">
				<div className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-5 sm:p-6">
					<div className="font-mono text-[11px] font-semibold text-shu dark:text-shu-glow">{M("sectionOf", { n: sIdx + 1, total: test.sections.length })}</div>
					<h2 className="font-bengali text-xl sm:text-2xl font-bold text-ink dark:text-night-ink mt-1">{M(`sec_${section.key}`)}</h2>
					<dl className="grid grid-cols-2 gap-3 mt-4">
						<div className="rounded-lg bg-washi dark:bg-night border border-ai-line dark:border-night-line px-3 py-2.5 text-center">
							<dd className="font-mono text-lg font-bold text-ink dark:text-night-ink">{count}</dd>
							<dt className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{M("questions")}</dt>
						</div>
						<div className="rounded-lg bg-washi dark:bg-night border border-ai-line dark:border-night-line px-3 py-2.5 text-center">
							<dd className="font-mono text-lg font-bold text-ink dark:text-night-ink">{continuous ? M("audioPaced") : test.timed ? `${section.minutes} ${M("minShort")}` : "∞"}</dd>
							<dt className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{M("timeAllowed")}</dt>
						</div>
					</dl>
					<ul className="mt-4 space-y-2">
						{parts.map((p, i) => (
							<li key={p} className="flex gap-2.5">
								<span lang="ja" className="shrink-0 font-mincho text-[11px] font-bold text-washi bg-shu rounded-full px-2 py-0.5 h-fit">{PART_META[p].jp}</span>
								<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted leading-relaxed">{M(`ins_${p}`)}</span>
							</li>
						))}
					</ul>
					<p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-4">{M(continuous ? "lisContIntro" : "introNote")}</p>
					<button
						onClick={() => { patch({ stage: "run", sectionStartedAt: Date.now(), qIdx: 0 }); setNow(Date.now()); window.scrollTo({ top: 0 }); }}
						className="w-full mt-5 font-bengali text-base font-semibold bg-shu text-washi rounded-lg py-3 hover:brightness-110"
					>
						{M("startSection")}
					</button>
				</div>
				{quitBar}
			</div>
		);
	}

	// ---------- review before submit ----------
	if (stage === "review") {
		return (
			<div className="max-w-xl mx-auto">
				<div className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-5 sm:p-6">
					<h2 className="font-bengali text-lg font-bold text-ink dark:text-night-ink">{M("reviewTitle")}</h2>
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-1">{M(`sec_${section.key}`)}{remaining !== null && ` · ⏱ ${fmt(remaining)}`}</p>
					<div className="grid grid-cols-3 gap-2.5 my-4 text-center">
						{[["answered", answeredCount], ["unanswered", questions.length - answeredCount], ["flagged", flaggedCount]].map(([k, v]) => (
							<div key={k} className="rounded-lg bg-washi dark:bg-night border border-ai-line dark:border-night-line py-2.5">
								<div className={`font-mono text-lg font-bold ${k === "unanswered" && v ? "text-shu dark:text-shu-glow" : "text-ink dark:text-night-ink"}`}>{v}</div>
								<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{M(k)}</div>
							</div>
						))}
					</div>
					<QuestionMap questions={questions} qIdx={-1} answers={answers} flags={flags} onGo={go} lang={lang} />
					<div className="grid grid-cols-2 gap-2.5 mt-5">
						<button onClick={() => go(qIdx)} className="font-bengali text-sm font-semibold border border-ai-line dark:border-night-line rounded-lg py-2.5 text-ink dark:text-night-ink hover:border-shu/60">{M("backToQuestions")}</button>
						{confirm === "submit" ? (
							<button onClick={submitSection} className="font-bengali text-sm font-semibold bg-shu text-washi rounded-lg py-2.5 hover:brightness-110">{M("confirmSubmit")}</button>
						) : (
							<button onClick={() => setConfirm("submit")} className="font-bengali text-sm font-semibold bg-shu text-washi rounded-lg py-2.5 hover:brightness-110">{M(sIdx + 1 >= test.sections.length ? "finishExam" : "submitSection")}</button>
						)}
					</div>
					{confirm === "submit" && <p className="font-bengali text-[11px] text-shu dark:text-shu-glow mt-2 text-center">{M("submitWarn")}</p>}
				</div>
			</div>
		);
	}

	// ---------- continuous listening ----------
	if (continuous) return <ListeningRun session={session} setSession={setSession} section={section} lang={lang} isActive={isActive} onSubmit={submitSection} quitBar={quitBar} />;

	// ---------- questions ----------
	const stim = q.stim ? test.stimuli[q.stim] : null;
	const prevPart = qIdx > 0 ? questions[qIdx - 1].part : null;
	const isLast = qIdx === questions.length - 1;

	return (
		<div className="max-w-4xl mx-auto">
			<div className="sticky top-0 z-20 -mx-3 sm:mx-0 px-3 sm:px-4 py-2.5 mb-4 bg-washi/95 dark:bg-night/95 backdrop-blur border-b sm:border border-ai-line dark:border-night-line sm:rounded-xl">
				<div className="flex items-center justify-between gap-3">
					<div className="min-w-0">
						<div className="font-bengali text-xs font-bold text-ink dark:text-night-ink truncate">{M(`sec_${section.key}`)}</div>
						<div className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{M("qOf", { n: qIdx + 1, total: questions.length })} · {answeredCount}/{questions.length}</div>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						{remaining !== null && (
							<span className={`font-mono text-sm font-bold rounded-full px-3 py-1 border ${low ? "border-danger text-danger dark:border-danger-glow dark:text-danger-glow animate-pulse" : "border-ai-line dark:border-night-line text-ink dark:text-night-ink"}`}>⏱ {fmt(remaining)}</span>
						)}
						<button onClick={() => { stopSpeech(); patch({ stage: "review" }); }} className="font-bengali text-xs font-semibold rounded-full bg-shu text-washi px-3.5 py-1.5 hover:brightness-110">{M("review")}</button>
					</div>
				</div>
				<div className="h-1 mt-2 rounded-full bg-ai-soft dark:bg-night-line overflow-hidden">
					<div className="h-full bg-shu dark:bg-shu-glow transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem] items-start">
				<div className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-6">
					{q.part !== prevPart && (
						<div className="flex gap-2.5 mb-4 pb-3 border-b border-ai-line dark:border-night-line">
							<span lang="ja" className="shrink-0 font-mincho text-[11px] font-bold text-washi bg-shu rounded-full px-2 py-0.5 h-fit">{PART_META[q.part].jp}</span>
							<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted leading-relaxed">{M(`ins_${q.part}`)}</span>
						</div>
					)}
					<div className="flex items-center justify-between mb-2">
						<span className="font-mono text-xs font-bold text-shu dark:text-shu-glow">{M("questionNo", { n: qIdx + 1 })}</span>
						<button onClick={flag} aria-pressed={!!flags[q.id]} className={`flex items-center gap-1.5 font-bengali text-xs rounded-md px-2.5 py-1 border ${flags[q.id] ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-amber-500"}`}>
							<svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={flags[q.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M5 21V4m0 0h11l-2 4 2 4H5" /></svg>
							{M(flags[q.id] ? "flagged1" : "flag")}
						</button>
					</div>

					{q.audio && <Player key={q.id} q={q} plays={plays?.[q.id]} lang={lang} onPlay={() => patch({ plays: { ...plays, [q.id]: (plays?.[q.id] || 0) + 1 } })} />}
					<Stimulus s={stim} blank={q.blank} />
					<Prompt q={q} />

					<div className={`mt-3 ${q.hide ? "grid grid-cols-3 gap-2.5" : "space-y-2"}`} role="radiogroup">
						{q.choices.map((c, i) => {
							const on = answers[q.id] === i;
							return (
								<button
									key={i}
									role="radio"
									aria-checked={on}
									onClick={() => answer(i)}
									className={`w-full text-left rounded-lg border px-3.5 py-3 flex items-center gap-3 transition-colors ${on ? "border-shu dark:border-shu-glow bg-shu-soft dark:bg-night ring-1 ring-shu/30" : "border-ai-line dark:border-night-line hover:border-shu/50"} ${q.hide ? "justify-center" : ""}`}
								>
									<span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${on ? "bg-shu text-washi border-shu" : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted"}`}>{i + 1}</span>
									{!q.hide && <span lang="ja" className="font-mincho text-base text-ink dark:text-night-ink">{c}</span>}
								</button>
							);
						})}
					</div>

					<div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-ai-line dark:border-night-line">
						<button onClick={() => go(qIdx - 1)} disabled={qIdx === 0} className="font-bengali text-sm font-semibold border border-ai-line dark:border-night-line rounded-lg px-4 py-2 text-ink dark:text-night-ink disabled:opacity-30 hover:border-shu/60">← {M("prev")}</button>
						<button onClick={() => (isLast ? (stopSpeech(), patch({ stage: "review" })) : go(qIdx + 1))} className="font-bengali text-sm font-semibold bg-shu text-washi rounded-lg px-5 py-2 hover:brightness-110">{isLast ? M("review") : `${M("next")} →`}</button>
					</div>
					<p className="hidden sm:block text-center font-mono text-[10px] text-ink-muted/60 dark:text-night-ink-muted/60 mt-3">{M("hotkeys")}</p>
				</div>

				<aside className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper p-3.5 lg:sticky lg:top-24">
					<button onClick={() => setMapOpen((v) => !v)} className="lg:hidden w-full flex items-center justify-between font-bengali text-xs font-semibold text-ink dark:text-night-ink" aria-expanded={mapOpen}>
						{M("questionMap")}
						<Icon name="chevronDown" className={`w-4 h-4 transition-transform ${mapOpen ? "rotate-180" : ""}`} />
					</button>
					<div className="hidden lg:block font-bengali text-xs font-bold text-ink dark:text-night-ink mb-2.5">{M("questionMap")}</div>
					<div className={`${mapOpen ? "block mt-3" : "hidden"} lg:block`}>
						<QuestionMap questions={questions} qIdx={qIdx} answers={answers} flags={flags} onGo={(i) => { go(i); setMapOpen(false); }} lang={lang} />
					</div>
				</aside>
			</div>
			{quitBar}
		</div>
	);
}
