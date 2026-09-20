import { useMemo } from "react";
import { t } from "../lib/i18n.js";
import { computeStreak, computeBestStreak } from "../lib/utils.js";
import Hanko from "./Hanko.jsx";
import ActivityCalendar from "./ActivityCalendar.jsx";

function StreakTile({ value, label, sub, tone, badge }) {
	return (
		<div className="flex items-center gap-3 rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2.5 min-w-0">
			<Hanko label={`${value}`} tone={tone} size="sm" />
			<div className="min-w-0">
				<div className="font-bengali text-[13px] font-semibold text-ink dark:text-night-ink leading-tight">
					{label}
				</div>
				<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
					<span className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{sub}</span>
					{badge && (
						<span className="font-bengali text-[10px] font-semibold rounded-full px-1.5 py-0.5 bg-shu-soft dark:bg-shu/10 text-shu dark:text-shu-glow">
							{badge}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

// The study-streak card shared by Progress and Home: current streak and
// best-ever streak side by side, above the GitHub-style activity chart.
export default function StreakWidget({ activity, lang }) {
	const T = (k) => t(lang, k);
	const current = useMemo(() => computeStreak(activity), [activity]);
	const best = useMemo(() => computeBestStreak(activity), [activity]);
	const unit = (n) => `${n} ${T(n === 1 ? "streakDay" : "streakDays")}`;

	return (
		<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-4">
			<div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4">
				<StreakTile
					value={current}
					tone="shu"
					label={T("streakCurrent")}
					sub={unit(current)}
					badge={current > 0 && current >= best ? T("streakPersonalBest") : null}
				/>
				<StreakTile value={best} tone="take" label={T("streakBest")} sub={unit(best)} />
			</div>
			<ActivityCalendar activity={activity} lang={lang} />
			<p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-3">
				{T("progressStreakSub")}
			</p>
		</div>
	);
}
