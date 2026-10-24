import { useEffect, useMemo, useState } from "react";
import { mt } from "../../lib/mockI18n.js";
import { BLUEPRINTS, FORMATS, MOCK_LEVELS, SECTIONAL } from "../../data/mock/blueprints.js";
import { paperRows } from "../../lib/mockTest/paper.js";
import { hasJapaneseVoice, onVoicesChanged, speechAvailable } from "../../lib/mockTest/speech.js";
import Hanko from "../Hanko.jsx";
import PaperLibrary from "./PaperLibrary.jsx";

function Pills({ value, options, onChange, label, disabled }) {
	return (
		<div role="group" aria-label={label} className={`inline-flex rounded-full border border-ai-line dark:border-night-line overflow-hidden bg-washi dark:bg-night ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
			{options.map((o) => (
				<button
					key={o.key}
					type="button"
					aria-pressed={value === o.key}
					onClick={() => onChange(o.key)}
					className={`font-bengali px-4 py-1.5 text-xs font-semibold ${value === o.key ? "bg-shu text-washi" : "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"}`}
				>
					{o.label}
				</button>
			))}
		</div>
	);
}

function Toggle({ checked, onChange, disabled }) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={`tap-quiet w-11 h-6 shrink-0 rounded-full relative disabled:opacity-40 ${checked ? "bg-shu dark:bg-shu-glow" : "bg-ai-line dark:bg-night-line"}`}
		>
			<span className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-150 ${checked ? "translate-x-5" : ""}`} />
		</button>
	);
}

const Card = ({ children, className = "" }) => (
	<section className={`rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none ${className}`}>{children}</section>
);

const Label = ({ children }) => <div className="font-bengali text-xs font-semibold text-ink-muted dark:text-night-ink-muted mb-1.5">{children}</div>;

function Trend({ points }) {
	if (points.length < 2) return null;
	const w = 160;
	const h = 44;
	const xs = points.map((_, i) => (i / (points.length - 1)) * (w - 8) + 4);
	const ys = points.map((p) => h - 4 - (p / 180) * (h - 8));
	return (
		<svg viewBox={`0 0 ${w} ${h}`} className="w-40 h-11" aria-hidden="true">
			<polyline points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="text-shu dark:text-shu-glow" />
			{xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="2.5" className="fill-shu dark:fill-shu-glow" />)}
		</svg>
	);
}

const NEG = [{ key: 0, label: "Off" }, { key: 0.25, label: "−¼" }, { key: 1 / 3, label: "−⅓" }, { key: 0.5, label: "−½" }];

export default function MockSetup({ lang, level: baseLevel, setLevel, history, onClearHistory, library, onStart }) {
	const M = (k, v) => mt(lang, k, v);
	const [format, setFormat] = useState("jlpt");
	const [mode, setMode] = useState("full");
	const [sectionKey, setSectionKey] = useState("vocab");
	const [timed, setTimed] = useState(true);
	const [listening, setListening] = useState(true);
	const [lisMode, setLisMode] = useState("pause");
	const [neg, setNeg] = useState(0);
	const [source, setSource] = useState("builtin");
	const [paperId, setPaperId] = useState(null);
	const [voice, setVoice] = useState({ speech: false, ja: false });
	const [confirmClear, setConfirmClear] = useState(false);

	useEffect(() => onVoicesChanged(() => setVoice({ speech: speechAvailable(), ja: hasJapaneseVoice() })), []);

	const entry = source === "paper" ? library.papers.find((p) => p.id === paperId) : null;
	const usingPaper = !!entry;
	const level = usingPaper ? entry.paper.level : baseLevel;
	const listeningOk = voice.speech;

	const bp = BLUEPRINTS[format][level];
	const rows = useMemo(
		() => (usingPaper ? paperRows(entry.paper, format) : bp.sections.map((s) => ({ ...s, count: s.parts.reduce((n, [, c]) => n + c, 0) }))),
		[usingPaper, entry, format, bp],
	);
	const hasListening = rows.some((r) => r.key === "listening");
	const withListening = hasListening && listening && listeningOk;
	// Keep the section choice valid for whichever paper is selected.
	const secKeys = rows.map((r) => r.key);
	const effSection = secKeys.includes(sectionKey) ? sectionKey : secKeys[0];
	const shown = mode === "section" ? rows.filter((r) => r.key === effSection) : rows.filter((r) => r.key !== "listening" || withListening);
	const listeningActive = mode === "section" ? effSection === "listening" : withListening;
	const totalMin = shown.reduce((n, r) => n + r.minutes, 0);
	const totalQ = shown.reduce((n, r) => n + r.count, 0);
	const negActive = format === "nat" ? neg : 0;

	const best = history.filter((h) => h.complete).reduce((b, h) => (!b || h.total > b.total ? h : b), null);
	const trend = history.filter((h) => h.complete && h.level === level).slice(0, 8).reverse().map((h) => h.total);
	const pickSource = (k) => {
		setSource(k);
		if (k === "paper" && !paperId && library.papers[0]) setPaperId(library.papers[0].id);
	};
	const canStart = source === "builtin" || usingPaper;

	const begin = () =>
		onStart({
			level,
			format,
			mode,
			sectionKey: mode === "section" ? effSection : null,
			timed,
			listening: withListening,
			lisMode,
			neg: negActive,
			source: usingPaper ? "paper" : "builtin",
			paperId: usingPaper ? entry.id : null,
		});

	return (
		<div className="max-w-4xl mx-auto space-y-5">
			<Card className="relative overflow-hidden p-5 sm:p-7">
				<span aria-hidden="true" lang="ja" className="pointer-events-none select-none absolute -right-2 -bottom-8 font-mincho font-bold text-[8rem] sm:text-[10rem] leading-none text-shu/[0.06] dark:text-shu-glow/[0.08]">模試</span>
				<div className="relative">
					<div className="font-mono text-[11px] font-semibold text-shu dark:text-shu-glow">JLPT · NAT-TEST</div>
					<h2 className="font-bengali text-2xl sm:text-3xl font-bold text-ink dark:text-night-ink mt-1">{M("title")}</h2>
					<p className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted mt-2 max-w-xl leading-relaxed">{M("subtitle")}</p>
					{best && (
						<p className="font-mono text-xs text-ink-muted dark:text-night-ink-muted mt-3">
							{M("bestScore")}: <span className="font-bold text-shu dark:text-shu-glow">{best.total}/180</span> · {best.level.toUpperCase()} {best.format.toUpperCase()}
						</p>
					)}
				</div>
			</Card>

			<Card className="p-4 sm:p-5 space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<Label>{M("level")}</Label>
						<Pills value={level} onChange={setLevel} label={M("level")} disabled={usingPaper} options={MOCK_LEVELS.map((k) => ({ key: k, label: k.toUpperCase() }))} />
					</div>
					<div>
						<Label>{M("format")}</Label>
						<Pills value={format} onChange={setFormat} label={M("format")} options={FORMATS.map((k) => ({ key: k, label: k === "jlpt" ? "JLPT" : "NAT-TEST" }))} />
					</div>
					<div className="sm:col-span-2">
						<Label>{M("source")}</Label>
						<div className="flex flex-wrap items-center gap-2">
							<Pills value={source} onChange={pickSource} label={M("source")} options={[{ key: "builtin", label: M("srcBuiltin") }, { key: "paper", label: `${M("srcPaper")} (${library.papers.length})` }]} />
							{source === "paper" && library.papers.length > 0 && (
								<select value={paperId || ""} onChange={(e) => setPaperId(e.target.value)} className="font-bengali text-xs border border-ai-line dark:border-night-line rounded-md px-2.5 py-1.5 bg-paper dark:bg-night-paper text-ink dark:text-night-ink max-w-[16rem]">
									{library.papers.map((p) => <option key={p.id} value={p.id}>{p.title} · {p.level.toUpperCase()}</option>)}
								</select>
							)}
						</div>
						<p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-1.5">{source === "paper" ? (library.papers.length ? M("srcPaperNote") : M("srcPaperEmpty")) : M("srcBuiltinNote")}</p>
					</div>
					<div className="sm:col-span-2">
						<Label>{M("mode")}</Label>
						<div className="flex flex-wrap items-center gap-2">
							<Pills value={mode} onChange={setMode} label={M("mode")} options={[{ key: "full", label: M("modeFull") }, { key: "section", label: M("modeSection") }]} />
							{mode === "section" && <Pills value={effSection} onChange={setSectionKey} label={M("section")} options={secKeys.map((k) => ({ key: k, label: M(`sec_${k}_short`) }))} />}
						</div>
					</div>
				</div>

				<div className="divide-y divide-ai-line dark:divide-night-line border-t border-ai-line dark:border-night-line">
					<div className="flex items-center justify-between gap-3 py-3">
						<div className="min-w-0">
							<div className="font-bengali text-sm text-ink dark:text-night-ink">{M("timed")}</div>
							<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{M("timedSub")}</div>
						</div>
						<Toggle checked={timed} onChange={setTimed} />
					</div>
					{mode === "full" && hasListening && (
						<div className="flex items-center justify-between gap-3 py-3">
							<div className="min-w-0">
								<div className="font-bengali text-sm text-ink dark:text-night-ink">{M("withListening")}</div>
								<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{!listeningOk ? M("noSpeech") : voice.ja ? M("listeningSub") : M("noJaVoice")}</div>
							</div>
							<Toggle checked={withListening} onChange={setListening} disabled={!listeningOk} />
						</div>
					)}
					{listeningActive && (
						<div className="py-3">
							<Label>{M("lisModeTitle")}</Label>
							<div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={M("lisModeTitle")}>
								{[["continuous", "lisContinuous", "lisContinuousSub"], ["pause", "lisPause", "lisPauseSub"]].map(([k, t, d]) => (
									<button key={k} type="button" role="radio" aria-checked={lisMode === k} onClick={() => setLisMode(k)} className={`text-left rounded-lg border px-3.5 py-3 ${lisMode === k ? "border-shu dark:border-shu-glow bg-shu-soft dark:bg-night ring-1 ring-shu/30" : "border-ai-line dark:border-night-line hover:border-shu/50"}`}>
										<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{M(t)}</div>
										<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-0.5 leading-relaxed">{M(d)}</div>
									</button>
								))}
							</div>
						</div>
					)}
					{format === "nat" && (
						<div className="py-3">
							<Label>{M("negTitle")}</Label>
							<Pills value={neg} onChange={setNeg} label={M("negTitle")} options={NEG.map((o) => ({ key: o.key, label: o.key === 0 ? M("off") : o.label }))} />
							<p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-1.5 leading-relaxed">{neg ? M("negOn") : M("negOffNote")}</p>
						</div>
					)}
				</div>
			</Card>

			<Card className="overflow-hidden">
				<div className="px-4 sm:px-5 py-3 border-b border-ai-line dark:border-night-line">
					<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{usingPaper ? entry.title : M("paperTitle", { level: level.toUpperCase() })}</h3>
				</div>
				<div className="divide-y divide-ai-line dark:divide-night-line">
					{shown.map((r) => (
						<div key={r.key} className="px-4 sm:px-5 py-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
							<div className="min-w-0">
								<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{M(`sec_${r.key}`)}</div>
								<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-0.5">{r.parts.map(([p, c]) => `${M(`part_${p}`)} ×${c}`).join(" · ")}</div>
							</div>
							<div className="font-mono text-xs text-ink-muted dark:text-night-ink-muted shrink-0 text-right">{r.count} {M("questionsShort")} · {r.minutes} {M("minShort")}</div>
						</div>
					))}
					<div className="px-4 sm:px-5 py-3 flex items-center justify-between bg-washi dark:bg-night">
						<span className="font-bengali text-xs font-bold text-ink dark:text-night-ink">{M("total")}</span>
						<span className="font-mono text-xs font-semibold text-shu dark:text-shu-glow">{totalQ} {M("questionsShort")} · {timed ? `${totalMin} ${M("minShort")}` : M("untimed")}</span>
					</div>
				</div>
				<div className="px-4 sm:px-5 py-3 border-t border-ai-line dark:border-night-line font-bengali text-[11px] leading-relaxed text-ink-muted dark:text-night-ink-muted space-y-1">
					<p><span className="font-semibold text-ink dark:text-night-ink">{M("passRule")}:</span> {M("passRuleText", { pass: bp.passMark, lk: SECTIONAL.lk, lis: SECTIONAL.lis })}</p>
					<p>{M("honestNote")}</p>
				</div>
			</Card>

			<button type="button" onClick={begin} disabled={!canStart} className="w-full font-bengali text-base font-semibold bg-shu text-washi rounded-xl py-3.5 shadow-card hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-40">
				{M("start")} · {level.toUpperCase()} {format === "jlpt" ? "JLPT" : "NAT-TEST"}
			</button>

			<PaperLibrary lang={lang} library={library} selectedId={usingPaper ? entry.id : null} onSelect={(id) => (id ? (setPaperId(id), setSource("paper")) : setSource("builtin"))} />

			<Card className="p-4 sm:p-5">
				<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink mb-2">{M("rulesTitle")}</h3>
				<ul className="space-y-1.5">
					{["rule1", "rule2", negActive ? "rule3neg" : "rule3", "rule4"].map((k) => (
						<li key={k} className="flex gap-2 font-bengali text-xs text-ink-muted dark:text-night-ink-muted leading-relaxed">
							<span className="mt-[0.5em] w-1.5 h-1.5 rounded-full bg-shu/70 shrink-0" />
							{M(k)}
						</li>
					))}
				</ul>
			</Card>

			<Card className="p-4 sm:p-5">
				<div className="flex items-center justify-between gap-3 mb-3">
					<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{M("history")}</h3>
					{history.length > 0 && (
						<button type="button" onClick={() => (confirmClear ? (onClearHistory(), setConfirmClear(false)) : setConfirmClear(true))} className={`font-bengali text-[11px] rounded-md px-2.5 py-1 border ${confirmClear ? "border-shu bg-shu text-washi" : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu"}`}>
							{confirmClear ? M("confirm") : M("clearHistory")}
						</button>
					)}
				</div>
				{history.length === 0 ? (
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">{M("noHistory")}</p>
				) : (
					<>
						{trend.length > 1 && (
							<div className="flex items-center gap-3 mb-3 text-ink-muted dark:text-night-ink-muted">
								<Trend points={trend} />
								<span className="font-bengali text-[11px]">{M("trend", { level: level.toUpperCase() })}</span>
							</div>
						)}
						<ul className="divide-y divide-ai-line dark:divide-night-line">
							{history.slice(0, 6).map((h) => (
								<li key={h.id} className="py-2.5 flex items-center gap-3">
									<Hanko label={h.complete ? (h.pass ? "合" : "不") : "練"} tone={h.complete ? (h.pass ? "take" : "shu") : "ai"} size="sm" />
									<div className="min-w-0 flex-1">
										<div className="font-bengali text-xs font-semibold text-ink dark:text-night-ink truncate">
											{h.title || `${h.level.toUpperCase()} · ${h.format === "jlpt" ? "JLPT" : "NAT-TEST"}`} · {h.mode === "full" ? M("modeFull") : M(`sec_${h.section}_short`)}{h.neg ? ` · −${h.neg === 0.25 ? "¼" : h.neg === 0.5 ? "½" : "⅓"}` : ""}
										</div>
										<div className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{new Date(h.at).toLocaleDateString()} · {h.correct}/{h.questions}</div>
									</div>
									<div className="font-mono text-sm font-bold text-shu dark:text-shu-glow shrink-0">{h.complete ? `${h.total}/180` : `${Math.round((h.correct / h.questions) * 100)}%`}</div>
								</li>
							))}
						</ul>
					</>
				)}
			</Card>
		</div>
	);
}
