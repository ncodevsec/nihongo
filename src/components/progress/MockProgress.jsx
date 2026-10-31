import { useMemo } from "react";
import { Link } from "react-router-dom";
import { readMockHistory } from "../../hooks/useMockStore.js";
import { BLUEPRINTS, MOCK_LEVELS, SECTIONAL } from "../../data/mock/blueprints.js";
import { t } from "../../lib/i18n.js";
import { formatDuration } from "../../lib/utils.js";

const TOTAL = SECTIONAL.lkMax + SECTIONAL.lisMax; // 180
const passMarkOf = (level) => BLUEPRINTS.jlpt[level]?.passMark ?? 80;
const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);

// A bar with a vertical marker (pass mark / sectional minimum).
function MarkedBar({ value, max, mark, ok }) {
	const w = Math.min(100, (value / max) * 100);
	const m = Math.min(100, (mark / max) * 100);
	return (
		<div className="relative h-2.5 rounded-full bg-ai-soft dark:bg-night-line">
			<div
				className={`h-full rounded-full transition-[width] duration-500 ${ok ? "bg-take dark:bg-take-glow" : "bg-shu dark:bg-shu-glow"}`}
				style={{ width: `${w}%` }}
			/>
			<span className="absolute -top-1 bottom-[-4px] w-0.5 rounded bg-ink dark:bg-night-ink" style={{ left: `calc(${m}% - 1px)` }} aria-hidden="true" />
		</div>
	);
}

function LevelCard({ level, attempts, T }) {
	const full = attempts.filter((a) => a.complete);
	const pass = passMarkOf(level);
	const best = full.length ? Math.max(...full.map((a) => a.total)) : 0;
	const passed = full.some((a) => a.pass);
	const last = full[0];
	const lkAvg = avg(full.map((a) => a.lk));
	const lisAvg = avg(full.map((a) => a.lis));
	return (
		<article className="rounded-xl border border-ai-line dark:border-night-line bg-washi dark:bg-night p-4 flex flex-col">
			<div className="flex items-start justify-between gap-2">
				<div>
					<div className="font-mincho text-2xl font-bold leading-none text-shu dark:text-shu-glow">{level.toUpperCase()}</div>
					<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-1">
						{T("mpPassMark")} {pass}/{TOTAL}
					</div>
				</div>
				{full.length > 0 && (
					<span
						className={`font-bengali text-[11px] font-semibold rounded-full px-2.5 py-1 ${
							passed ? "bg-take-soft text-take dark:bg-take/15 dark:text-take-glow" : "bg-shu-soft text-shu dark:bg-shu/10 dark:text-shu-glow"
						}`}
					>
						{passed ? `✓ ${T("mpPassed")}` : `${Math.max(0, pass - best)} ${T("mpToGo")}`}
					</span>
				)}
			</div>

			{full.length === 0 ? (
				<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-4 flex-1">{T("mpNoFull")}</p>
			) : (
				<>
					<div className="mt-4 flex items-baseline gap-1.5">
						<span className="font-mono text-3xl font-bold text-ink dark:text-night-ink">{best}</span>
						<span className="font-mono text-xs text-ink-muted dark:text-night-ink-muted">/ {TOTAL} · {T("mpBest")}</span>
					</div>
					<div className="mt-2">
						<MarkedBar value={best} max={TOTAL} mark={pass} ok={passed} />
					</div>
					<dl className="mt-4 grid grid-cols-3 gap-2 text-center">
						{[
							[T("mpAttempts"), full.length],
							[T("mpAverage"), avg(full.map((a) => a.total))],
							[T("mpLatest"), last.total],
						].map(([label, v]) => (
							<div key={label} className="rounded-lg bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line py-2">
								<dd className="font-mono text-base font-semibold text-ink dark:text-night-ink">{v}</dd>
								<dt className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">{label}</dt>
							</div>
						))}
					</dl>
					<div className="mt-4 space-y-2.5">
						<div>
							<div className="flex justify-between font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mb-1">
								<span>{T("mpLK")}</span>
								<span className="font-mono">{lkAvg}/{SECTIONAL.lkMax} · min {SECTIONAL.lk}</span>
							</div>
							<MarkedBar value={lkAvg} max={SECTIONAL.lkMax} mark={SECTIONAL.lk} ok={lkAvg >= SECTIONAL.lk} />
						</div>
						<div>
							<div className="flex justify-between font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mb-1">
								<span>{T("mpListening")}</span>
								<span className="font-mono">{lisAvg}/{SECTIONAL.lisMax} · min {SECTIONAL.lis}</span>
							</div>
							<MarkedBar value={lisAvg} max={SECTIONAL.lisMax} mark={SECTIONAL.lis} ok={lisAvg >= SECTIONAL.lis} />
						</div>
					</div>
				</>
			)}
		</article>
	);
}

// Score history: one bar per finished full-length test (oldest → newest), the tick on each
// bar marks the pass mark of that test's level.
function TrendChart({ attempts, T }) {
	const data = [...attempts].reverse().slice(-12);
	const W = 320, H = 130, padB = 18, padT = 8, gap = 6;
	const bw = Math.max(10, (W - gap * (data.length - 1)) / Math.max(data.length, 1));
	const y = (v) => padT + (H - padB - padT) * (1 - v / TOTAL);
	return (
		<div className="overflow-x-auto">
			<svg viewBox={`0 0 ${Math.max(W, data.length * (bw + gap))} ${H}`} className="w-full min-w-[260px] h-36" role="img" aria-label={T("mpTrend")}>
				{[0, 90, 180].map((g) => (
					<g key={g}>
						<line x1="0" x2="100%" y1={y(g)} y2={y(g)} className="stroke-ai-line dark:stroke-night-line" strokeWidth="1" strokeDasharray={g ? "3 4" : "0"} />
					</g>
				))}
				{data.map((a, i) => {
					const x = i * (bw + gap);
					const top = y(a.total);
					return (
						<g key={`${a.id}-${a.at}`}>
							<rect x={x} y={top} width={bw} height={Math.max(2, H - padB - top)} rx="3" className={a.pass ? "fill-take dark:fill-take-glow" : "fill-shu dark:fill-shu-glow"} opacity="0.9" />
							<line x1={x - 2} x2={x + bw + 2} y1={y(passMarkOf(a.level))} y2={y(passMarkOf(a.level))} className="stroke-ink dark:stroke-night-ink" strokeWidth="1.5" />
							<text x={x + bw / 2} y={H - 4} textAnchor="middle" className="fill-ink-muted dark:fill-night-ink-muted" fontSize="8" fontFamily="JetBrains Mono, monospace">
								{a.level.toUpperCase()}
							</text>
							<text x={x + bw / 2} y={Math.max(9, top - 3)} textAnchor="middle" className="fill-ink dark:fill-night-ink" fontSize="8" fontFamily="JetBrains Mono, monospace">
								{a.total}
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
}

// Mock Test progress: per-level summary + score trend, read from the saved mock history.
export default function MockProgress({ lang, history }) {
	const T = (k) => t(lang, k);
	const all = useMemo(() => history || readMockHistory(), [history]);
	const byLevel = useMemo(() => Object.fromEntries(MOCK_LEVELS.map((l) => [l, all.filter((a) => a.level === l)])), [all]);
	const full = all.filter((a) => a.complete);
	const practice = all.length - full.length;
	const seconds = all.reduce((s, a) => s + (a.seconds || 0), 0);

	return (
		<section aria-labelledby="mock-progress" className="mb-5">
			<div className="flex items-center justify-between mb-2">
				<h2 id="mock-progress" className="font-bengali text-sm font-bold text-ink dark:text-shu-glow">
					{T("mpTitle")}
				</h2>
				<Link to="/mock-test" className="font-bengali text-xs font-semibold text-shu dark:text-shu-glow hover:underline">
					{T("mpOpen")} →
				</Link>
			</div>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-4">
				{all.length === 0 ? (
					<div className="text-center py-6">
						<p className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{T("mpEmptyTitle")}</p>
						<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-1 max-w-xs mx-auto">{T("mpEmptySub")}</p>
						<Link to="/mock-test" className="inline-block mt-3 rounded-lg bg-shu px-4 py-2 font-bengali text-sm font-semibold text-washi">
							{T("mpStart")}
						</Link>
					</div>
				) : (
					<>
						<div className="grid gap-3 md:grid-cols-2">
							{MOCK_LEVELS.map((l) => (
								<LevelCard key={l} level={l} attempts={byLevel[l]} T={T} />
							))}
						</div>
						{full.length > 0 && (
							<div className="mt-4">
								<div className="flex items-center justify-between font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mb-1">
									<span className="font-semibold">{T("mpTrend")}</span>
									<span className="flex items-center gap-2.5">
										<span className="flex items-center gap-1"><i className="w-2 h-2 rounded-sm bg-take inline-block" />{T("mpPassed")}</span>
										<span className="flex items-center gap-1"><i className="w-2 h-2 rounded-sm bg-shu inline-block" />{T("mpNotYet")}</span>
										<span className="flex items-center gap-1"><i className="w-3 h-0.5 bg-ink dark:bg-night-ink inline-block" />{T("mpPassMark")}</span>
									</span>
								</div>
								<TrendChart attempts={full} T={T} />
							</div>
						)}
						<p className="mt-3 font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">
							{full.length} {T("mpFullTests")} · {practice} {T("mpPractice")} ·{" "}
							{formatDuration(seconds, T("timeHourShort"), T("timeMinuteShort"), T("timeUnderMinute"))}
						</p>
					</>
				)}
			</div>
		</section>
	);
}
