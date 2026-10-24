import { LATEST_FEATURES } from "../../data/features.js";
import { mt } from "../../lib/mockI18n.js";
import Icon from "./icons.jsx";

// Home's "latest feature" card: the newest entry of data/features.js, with a
// button that opens it.
export default function LatestFeature({ lang, onOpen }) {
	const f = LATEST_FEATURES[0];
	if (!f) return null;
	const M = (k) => mt(lang, k);
	return (
		<section aria-labelledby="home-latest" className="relative overflow-hidden rounded-xl border border-shu/30 dark:border-shu-glow/30 bg-shu-soft/60 dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-6">
			<span aria-hidden="true" lang="ja" className="pointer-events-none select-none absolute -right-2 -bottom-8 font-mincho font-bold text-[8rem] sm:text-[10rem] leading-none text-shu/[0.07] dark:text-shu-glow/[0.08]">模試</span>
			<div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
				<span className="shrink-0 w-12 h-12 rounded-xl bg-paper dark:bg-night border border-ai-line dark:border-night-line flex items-center justify-center text-shu dark:text-shu-glow">
					<Icon name={f.icon} className="w-6 h-6" />
				</span>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="font-mono text-[10px] font-bold uppercase tracking-wide rounded-full bg-shu text-washi px-2 py-0.5">{M("featNew")}</span>
						<span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{M("featLatest")}</span>
					</div>
					<h2 id="home-latest" className="font-bengali text-lg sm:text-xl font-bold text-ink dark:text-night-ink mt-1.5">{M(f.title)}</h2>
					<p className="font-bengali text-xs sm:text-sm text-ink-muted dark:text-night-ink-muted mt-1 leading-relaxed max-w-xl">{M(f.desc)}</p>
					<ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
						{f.points.map((p) => (
							<li key={p} className="flex items-center gap-1.5 font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
								<Icon name="check" className="w-3.5 h-3.5 text-take dark:text-take-glow" strokeWidth={2.4} />
								{M(p)}
							</li>
						))}
					</ul>
				</div>
				<button type="button" onClick={() => onOpen(f)} className="group shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-shu px-5 py-3 font-bengali text-sm font-semibold text-washi hover:brightness-110">
					{M(f.cta)}
					<Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
				</button>
			</div>
		</section>
	);
}
