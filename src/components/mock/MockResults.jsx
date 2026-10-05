import { useMemo, useState } from "react";
import { mt } from "../../lib/mockI18n.js";
import { PART_META, SECTIONAL } from "../../data/mock/blueprints.js";
import Hanko from "../Hanko.jsx";
import { Prompt, Stimulus } from "./MockExam.jsx";

const Card = ({ children, className = "" }) => (
	<section className={`rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none ${className}`}>{children}</section>
);

// A 0..max bar with an optional tick marking the minimum / pass level.
function ScoreBar({ label, value, max, mark, markLabel, tone = "shu" }) {
	const pct = value === null ? 0 : (value / max) * 100;
	const ok = value !== null && mark != null && value >= mark;
	return (
		<div>
			<div className="flex items-baseline justify-between mb-1.5">
				<span className="font-bengali text-xs font-semibold text-ink dark:text-night-ink">{label}</span>
				<span className="font-mono text-sm font-bold text-ink dark:text-night-ink">{value === null ? "—" : value}<span className="text-ink-muted dark:text-night-ink-muted font-normal text-xs"> / {max}</span></span>
			</div>
			<div className="relative h-3 rounded-full bg-ai-soft dark:bg-night-line overflow-visible">
				<div className={`h-full rounded-full transition-all ${ok || mark == null ? (tone === "take" ? "bg-take dark:bg-take-glow" : "bg-shu dark:bg-shu-glow") : "bg-danger dark:bg-danger-glow"}`} style={{ width: `${pct}%` }} />
				{mark != null && (
					<span className="absolute -top-1 bottom-[-4px] w-0.5 bg-ink dark:bg-night-ink" style={{ left: `${(mark / max) * 100}%` }} title={markLabel} />
				)}
			</div>
			{mark != null && <div className="font-mono text-[10px] text-ink-muted dark:text-night-ink-muted mt-1" style={{ marginLeft: `calc(${(mark / max) * 100}% - 1rem)` }}>{markLabel}</div>}
		</div>
	);
}

function AccBar({ label, c, t }) {
	const pct = t ? Math.round((c / t) * 100) : 0;
	return (
		<div>
			<div className="flex items-baseline justify-between mb-1">
				<span className="font-bengali text-xs text-ink dark:text-night-ink">{label}</span>
				<span className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{c}/{t} · {pct}%</span>
			</div>
			<div className="h-2 rounded-full bg-ai-soft dark:bg-night-line overflow-hidden">
				<div className={`h-full rounded-full ${pct >= 75 ? "bg-take dark:bg-take-glow" : pct >= 50 ? "bg-sakura" : "bg-danger dark:bg-danger-glow"}`} style={{ width: `${pct}%` }} />
			</div>
		</div>
	);
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

// What to study next, per weakest skill.
const NEXT = {
	vocab: { module: "vocabulary", tab: "quiz", key: "nextVocab" },
	grammar: { module: "grammar", tab: "quiz", key: "nextGrammar" },
	reading: { module: "vocabulary", tab: "study", key: "nextReading" },
	listening: { module: "vocabulary", tab: "study", key: "nextListening" },
};

export default function MockResults({ result, lang, onClose, onRetake, onLaunch }) {
	const M = (k, v) => mt(lang, k, v);
	const { test, answers, flags, score } = result;
	const [filter, setFilter] = useState("all");
	const [open, setOpen] = useState(null);

	const weak = useMemo(
		() =>
			Object.entries(score.skills)
				.map(([k, v]) => ({ k, pct: v.c / v.t }))
				.filter((x) => x.pct < 0.75)
				.sort((a, b) => a.pct - b.pct)
				.slice(0, 2),
		[score],
	);
	// Kanji practice helps most when the kanji parts were the weak ones.
	const kanjiWeak = ["kanjiReading", "orthography"].some((p) => score.parts[p] && score.parts[p].c / score.parts[p].t < 0.7);

	const items = score.flat.filter((f) =>
		filter === "wrong" ? f.given !== undefined && !f.ok : filter === "blank" ? f.given === undefined : filter === "flagged" ? flags[f.q.id] : true,
	);
	const numbering = new Map(score.flat.map((f, i) => [f.q.id, i + 1]));

	const heroKey = !score.complete ? "partialTitle" : score.pass ? "passTitle" : "failTitle";
	const secondsTotal = Object.values(score.secondsUsed).reduce((a, b) => a + b, 0);

	return (
		<div className="max-w-3xl mx-auto space-y-5">
			<Card className="p-5 sm:p-7">
				<div className="flex items-center gap-4 sm:gap-6">
					<Hanko label={score.complete ? (score.pass ? "合格" : "もう少し") : `${Math.round((score.correct / score.totalQuestions) * 100)}%`} sub={score.complete ? undefined : undefined} tone={score.complete ? (score.pass ? "take" : "shu") : "ai"} size="lg" />
					<div className="min-w-0">
						<div className="font-mono text-[11px] font-semibold text-shu dark:text-shu-glow">{test.level.toUpperCase()} · {test.format === "jlpt" ? "JLPT" : "NAT-TEST"} · {M("estimated")}</div>
						<h2 className="font-bengali text-xl sm:text-2xl font-bold text-ink dark:text-night-ink leading-snug">{M(heroKey)}</h2>
						{score.complete ? (
							<div className="font-mono text-3xl sm:text-4xl font-bold text-ink dark:text-night-ink mt-1">{score.total}<span className="text-base font-normal text-ink-muted dark:text-night-ink-muted"> / 180</span></div>
						) : (
							<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-1">{M("partialNote")}</p>
						)}
					</div>
				</div>
				{score.band && <p className="font-bengali text-sm text-ink dark:text-night-ink mt-4 leading-relaxed rounded-lg bg-washi dark:bg-night border border-ai-line dark:border-night-line px-4 py-3">{M(`band_${score.band}`, { pass: test.passMark })}</p>}
			</Card>

			<Card className="p-4 sm:p-5 space-y-5">
				<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{M("scoreBreakdown")}</h3>
				<ScoreBar label={M("lkScore")} value={score.lk} max={SECTIONAL.lkMax} mark={SECTIONAL.lk} markLabel={`${M("min")} ${SECTIONAL.lk}`} />
				<ScoreBar label={M("lisScore")} value={score.lis} max={SECTIONAL.lisMax} mark={SECTIONAL.lis} markLabel={`${M("min")} ${SECTIONAL.lis}`} />
				<ScoreBar label={M("totalScore")} value={score.total} max={180} mark={test.passMark} markLabel={`${M("passMark")} ${test.passMark}`} tone="take" />
				<p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-relaxed">{M("estimateNote")}</p>
			</Card>

			<div className="grid gap-5 sm:grid-cols-2">
				<Card className="p-4 sm:p-5 space-y-3">
					<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{M("bySkill")}</h3>
					{["vocab", "grammar", "reading", "listening"].filter((k) => score.skills[k]).map((k) => <AccBar key={k} label={M(`skill_${k}`)} {...score.skills[k]} />)}
				</Card>
				<Card className="p-4 sm:p-5 space-y-3">
					<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{M("byPart")}</h3>
					{Object.keys(PART_META).filter((p) => score.parts[p]).map((p) => <AccBar key={p} label={M(`part_${p}`)} {...score.parts[p]} />)}
				</Card>
			</div>

			<Card className="p-4 sm:p-5">
				<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink mb-3">{M("timeUsed")}</h3>
				<div className="flex flex-wrap gap-2">
					{test.sections.map((s) => (
						<div key={s.key} className="rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2">
							<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{M(`sec_${s.key}_short`)}</div>
							<div className="font-mono text-sm font-bold text-ink dark:text-night-ink">{mmss(score.secondsUsed[s.key] || 0)}{test.timed && <span className="text-ink-muted dark:text-night-ink-muted font-normal text-xs"> / {s.minutes}:00</span>}</div>
						</div>
					))}
					<div className="rounded-lg border border-shu/30 bg-shu-soft dark:bg-night px-3 py-2">
						<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{M("total")}</div>
						<div className="font-mono text-sm font-bold text-shu dark:text-shu-glow">{mmss(secondsTotal)}</div>
					</div>
				</div>
			</Card>

			{(weak.length > 0 || kanjiWeak) && (
				<Card className="p-4 sm:p-5">
					<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink mb-3">{M("nextSteps")}</h3>
					<ul className="space-y-2.5">
						{weak.map(({ k }) => (
							<li key={k} className="flex flex-wrap items-center justify-between gap-2">
								<span className="font-bengali text-xs text-ink dark:text-night-ink flex-1 min-w-[12rem] leading-relaxed">{M(NEXT[k].key)}</span>
								{k !== "listening" && k !== "reading" && (
									<button onClick={() => onLaunch(NEXT[k].module, test.level, NEXT[k].tab)} className="font-bengali text-xs font-semibold rounded-md border border-shu/40 text-shu dark:text-shu-glow px-3 py-1.5 hover:bg-shu-soft dark:hover:bg-night">{M("practice")} →</button>
								)}
							</li>
						))}
						{kanjiWeak && (
							<li className="flex flex-wrap items-center justify-between gap-2">
								<span className="font-bengali text-xs text-ink dark:text-night-ink flex-1 min-w-[12rem] leading-relaxed">{M("nextKanji")}</span>
								<button onClick={() => onLaunch("kanji", test.level, "quiz")} className="font-bengali text-xs font-semibold rounded-md border border-shu/40 text-shu dark:text-shu-glow px-3 py-1.5 hover:bg-shu-soft dark:hover:bg-night">{M("practice")} →</button>
							</li>
						)}
					</ul>
				</Card>
			)}

			<div className="grid grid-cols-2 gap-2.5">
				<button onClick={onRetake} className="font-bengali text-sm font-semibold bg-shu text-washi rounded-lg py-3 hover:brightness-110">{M("retake")}</button>
				<button onClick={onClose} className="font-bengali text-sm font-semibold border border-ai-line dark:border-night-line rounded-lg py-3 text-ink dark:text-night-ink hover:border-shu/60">{M("backToMock")}</button>
			</div>

			<Card className="overflow-hidden">
				<div className="px-4 sm:px-5 py-3 border-b border-ai-line dark:border-night-line flex flex-wrap items-center justify-between gap-2">
					<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{M("reviewAnswers")}</h3>
					<div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden text-[11px] font-bengali font-semibold">
						{["all", "wrong", "blank", "flagged"].map((k) => (
							<button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k} className={`px-3 py-1 ${filter === k ? "bg-shu text-washi" : "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"}`}>{M(`f_${k}`)}</button>
						))}
					</div>
				</div>
				<div className="divide-y divide-ai-line dark:divide-night-line">
					{items.length === 0 && <p className="px-5 py-8 text-center font-bengali text-sm text-ink-muted dark:text-night-ink-muted">{M("nothingHere")}</p>}
					{items.map(({ q, ok, given }) => {
						const isOpen = open === q.id;
						const stim = q.stim ? test.stimuli[q.stim] : null;
						return (
							<div key={q.id}>
								<button onClick={() => setOpen(isOpen ? null : q.id)} aria-expanded={isOpen} className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 text-left hover:bg-washi dark:hover:bg-night">
									<span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-washi ${given === undefined ? "bg-ink-muted/50" : ok ? "bg-take dark:bg-take-glow" : "bg-danger dark:bg-danger-glow"}`}>{given === undefined ? "–" : ok ? "✓" : "✗"}</span>
									<span className="font-mono text-xs text-ink-muted dark:text-night-ink-muted w-8 shrink-0">#{numbering.get(q.id)}</span>
									<span lang="ja" className="font-mincho text-sm text-ink dark:text-night-ink truncate flex-1">{q.prompt || q.exp}</span>
									<span className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted shrink-0 hidden sm:block">{M(`part_${q.part}`)}</span>
								</button>
								{isOpen && (
									<div className="px-4 sm:px-5 pb-4 pt-1 bg-washi dark:bg-night space-y-3">
										<Stimulus s={stim} blank={q.blank} />
										<Prompt q={q} />
										<div className="space-y-1.5">
											{q.choices.map((c, i) => (
												<div key={i} className={`flex items-center gap-2.5 rounded-md border px-3 py-2 ${i === q.answer ? "border-take dark:border-take-glow bg-take-soft dark:bg-take/10" : i === given ? "border-danger dark:border-danger-glow bg-danger-soft dark:bg-danger/10" : "border-ai-line dark:border-night-line"}`}>
													<span className="font-mono text-xs font-bold w-4 text-ink-muted dark:text-night-ink-muted">{i + 1}</span>
													<span lang="ja" className="font-mincho text-sm text-ink dark:text-night-ink flex-1">{c}</span>
													{i === q.answer && <span className="font-bengali text-[10px] font-bold text-take dark:text-take-glow">{M("correct")}</span>}
													{i === given && i !== q.answer && <span className="font-bengali text-[10px] font-bold text-danger dark:text-danger-glow">{M("yourAnswer")}</span>}
												</div>
											))}
										</div>
										{q.exp && <p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted leading-relaxed"><span className="font-bold text-ink dark:text-night-ink">{M("explanation")}: </span><span lang="ja">{q.exp}</span></p>}
										{q.transcript && <pre lang="ja" className="font-mincho text-xs whitespace-pre-wrap rounded-md bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line px-3 py-2 text-ink dark:text-night-ink"><span className="font-bengali font-bold block mb-1 text-shu dark:text-shu-glow">{M("transcript")}</span>{q.transcript}</pre>}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</Card>
		</div>
	);
}
