import Hanko from "../Hanko.jsx";
import Icon from "./icons.jsx";

function StatCard({ icon, value, label, lead }) {
	return (
		<div className="flex items-center gap-3 rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-3.5 sm:p-4 min-w-0">
			{lead || (
				<span className="shrink-0 w-10 h-10 rounded-full bg-shu-soft dark:bg-night flex items-center justify-center text-shu dark:text-shu-glow">
					<Icon name={icon} className="w-5 h-5" />
				</span>
			)}
			<div className="min-w-0">
				<div className="font-mono text-lg sm:text-xl font-semibold text-ink dark:text-night-ink leading-tight truncate">
					{value}
				</div>
				<div className="font-bengali text-[11px] sm:text-xs text-ink-muted dark:text-night-ink-muted leading-tight">
					{label}
				</div>
			</div>
		</div>
	);
}

// Personal numbers for someone who has started; content numbers (what's
// inside the app) for someone who hasn't yet.
export default function StatsStrip({ T, personal, streak, learned, total, accuracy, timeLabel, counts }) {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
			{personal ? (
				<>
					<StatCard
						lead={<Hanko label={`${streak}`} tone="shu" size="sm" />}
						value={streak}
						label={T("progressStreak")}
					/>
					<StatCard icon="checkCircle" value={`${learned}/${total}`} label={T("learnedCount")} />
					<StatCard icon="target" value={`${accuracy}%`} label={T("accuracy")} />
					<StatCard icon="clock" value={timeLabel} label={T("homeStatTime")} />
				</>
			) : (
				<>
					<StatCard icon="study" value={counts.words.toLocaleString("en-US")} label={T("homeStatWords")} />
					<StatCard icon="type" value={counts.kanji.toLocaleString("en-US")} label={T("homeStatKanji")} />
					<StatCard icon="reference" value={counts.grammar.toLocaleString("en-US")} label={T("homeStatGrammar")} />
					<StatCard icon="target" value="N5 · N4" label={T("homeStatLevels")} />
				</>
			)}
		</div>
	);
}
