import { useMemo, useState } from "react";
import { t, pickLang } from "../lib/i18n.js";
import { formatDuration } from "../lib/utils.js";
import Hanko from "./Hanko.jsx";
import ActivityCalendar from "./ActivityCalendar.jsx";
import {
	classifyPartOfSpeech,
	POS_CATEGORIES,
	classifyCounting,
	COUNTING_CATEGORIES,
} from "../lib/vocabClassify.js";

function toDateKey(d) {
	return d.toISOString().slice(0, 10);
}

function computeStreak(activity) {
	const today = new Date();
	let cursor = new Date(today);
	// If nothing logged today yet, start checking from yesterday so a
	// still-unbroken streak from previous days doesn't read as zero.
	if (!activity[toDateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
	let streak = 0;
	while (activity[toDateKey(cursor)]) {
		streak += 1;
		cursor.setDate(cursor.getDate() - 1);
	}
	return streak;
}

export default function Progress({
	kanjiData,
	categories,
	progress,
	resetProgress,
	onResetCategory,
	settings,
	activity = {},
	favorites = {},
	moduleKey,
	timeToday = 0,
	timeWeek = 0,
	timeTotal = 0,
}) {
	const lang = settings.uiLang;
	const T = (k) => t(lang, k);

	const [confirmingReset, setConfirmingReset] = useState(false);
	const [confirmingCategory, setConfirmingCategory] = useState(null);
	const isVocab = moduleKey === "vocabulary";
	const [groupBy, setGroupBy] = useState("lesson"); // 'lesson' | 'pos' | 'count' (vocab only)

	const stats = useMemo(() => {
		const relevantIds = new Set(kanjiData.map((k) => k.id));
		const entries = kanjiData.map((k) => progress[k.id]);

		const seen = entries.reduce((s, e) => s + (e?.seen || 0), 0);
		const correct = entries.reduce((s, e) => s + (e?.correct || 0), 0);
		const mastered = entries.filter((e) => e?.learned).length;
		const learning = entries.filter(
			(e) => e && !e.learned && e.seen > 0,
		).length;
		const untouched = kanjiData.length - mastered - learning;
		const accuracy = seen ? Math.round((correct / seen) * 100) : 0;
		const starred = kanjiData.filter((k) => favorites[k.id]).length;

		const categoryList =
			groupBy === "pos"
				? POS_CATEGORIES
				: groupBy === "count"
					? COUNTING_CATEGORIES
					: categories;
		const categoryOf = (item) => {
			if (groupBy === "pos") return classifyPartOfSpeech(item);
			if (groupBy === "count") return classifyCounting(item);
			return item.category;
		};

		const byCategory = categoryList
			.map((c) => {
				const items = kanjiData.filter((k) => categoryOf(k) === c.key);
				const done = items.filter(
					(k) => progress[k.id]?.learned,
				).length;
				const started = items.filter(
					(k) => progress[k.id]?.seen > 0 && !progress[k.id]?.learned,
				).length;
				// Kept alongside the counts so the per-category reset button
				// can clear exactly these items' progress without touching
				// any other category, lesson, or grouping. "Touched" means
				// there's *anything* to reset — either quizzed (seen > 0)
				// or marked Memorized directly from a flashcard, which sets
				// `learned` without ever touching `seen`. Checking seen
				// alone would leave memorized-only items with no working
				// reset control at all.
				const ids = items.map((k) => k.id);
				const touched = items.filter(
					(k) => progress[k.id]?.seen > 0 || progress[k.id]?.learned,
				).length;
				return { ...c, done, started, total: items.length, ids, touched };
			})
			.filter((c) => c.total > 0);

		return {
			mastered,
			learning,
			untouched,
			accuracy,
			seen,
			byCategory,
			starred,
			relevantIds,
		};
	}, [kanjiData, categories, progress, favorites, groupBy]);

	const streak = useMemo(() => computeStreak(activity), [activity]);

	const handleReset = () => {
		if (!confirmingReset) {
			setConfirmingReset(true);
			return;
		}
		resetProgress();
		setConfirmingReset(false);
	};

	const handleResetCategory = (c) => {
		if (confirmingCategory !== c.key) {
			setConfirmingCategory(c.key);
			return;
		}
		onResetCategory?.(c.ids);
		setConfirmingCategory(null);
	};

	const total = kanjiData.length;
	const masteredPct = total ? (stats.mastered / total) * 100 : 0;
	const learningPct = total ? (stats.learning / total) * 100 : 0;
	const untouchedPct = total ? (stats.untouched / total) * 100 : 0;

	return (
		<div className="max-w-2xl lg:max-w-3xl mx-auto">
			{/* Overview — four balanced stat cards */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
				<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-3 flex flex-col items-center gap-1.5 text-center">
					<Hanko label={`${stats.mastered}`} tone="take" size="sm" />
					<span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
						{T("progressMastered")}
					</span>
				</div>
				<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-3 flex flex-col items-center gap-1.5 text-center">
					<Hanko
						label={`${stats.accuracy}%`}
						tone="sakura"
						size="sm"
					/>
					<span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
						{T("progressAccuracyLabel")}
					</span>
				</div>
				<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-3 flex flex-col items-center gap-1.5 text-center">
					<Hanko label={`${stats.seen}`} tone="shu" size="sm" />
					<span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
						{T("progressAnswered")}
					</span>
				</div>
				<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-3 flex flex-col items-center gap-1.5 text-center">
					<Hanko label={`${stats.starred}`} tone="ai" size="sm" />
					<span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
						{T("progressStarred")}
					</span>
				</div>
			</div>

			{/* Status breakdown — New / Learning / Mastered */}
			<h2 className="font-bengali text-sm font-bold text-ink dark:text-shu-glow mb-2">
				{T("progressStatusBreakdown")}
			</h2>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-4 mb-5">
				<div className="w-full h-3 rounded-full overflow-hidden flex mb-3 bg-ai-soft dark:bg-night-line">
					{masteredPct > 0 && (
						<div
							className="h-full bg-take"
							style={{ width: `${masteredPct}%` }}
						/>
					)}
					{learningPct > 0 && (
						<div
							className="h-full bg-sakura"
							style={{ width: `${learningPct}%` }}
						/>
					)}
					{untouchedPct > 0 && (
						<div
							className="h-full bg-ai-line dark:bg-night-line"
							style={{ width: `${untouchedPct}%` }}
						/>
					)}
				</div>
				<div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bengali">
					<span className="flex items-center gap-1.5 text-ink dark:text-night-ink">
						<span className="w-2.5 h-2.5 rounded-full bg-take inline-block" />
						{T("statusMastered")}{" "}
						<span className="font-mono text-ink-muted dark:text-night-ink-muted">
							({stats.mastered})
						</span>
					</span>
					<span className="flex items-center gap-1.5 text-ink dark:text-night-ink">
						<span className="w-2.5 h-2.5 rounded-full bg-sakura inline-block" />
						{T("statusLearning")}{" "}
						<span className="font-mono text-ink-muted dark:text-night-ink-muted">
							({stats.learning})
						</span>
					</span>
					<span className="flex items-center gap-1.5 text-ink dark:text-night-ink">
						<span className="w-2.5 h-2.5 rounded-full bg-ai-line dark:bg-night-line inline-block" />
						{T("statusNew")}{" "}
						<span className="font-mono text-ink-muted dark:text-night-ink-muted">
							({stats.untouched})
						</span>
					</span>
				</div>
			</div>

			{/* Streak + monthly activity calendar */}
			<h2 className="font-bengali text-sm font-bold text-ink dark:text-shu-glow mb-2">
				{T("progressActivity")}
			</h2>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-4 mb-5">
				<div className="flex items-center gap-3 mb-4">
					<Hanko label={`${streak}`} tone="shu" size="sm" />
					<div>
						<div className="font-bengali text-sm text-ink dark:text-night-ink font-semibold">
							{T("progressStreak")}
						</div>
						<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">
							{T("progressStreakSub")}
						</div>
					</div>
				</div>
				<ActivityCalendar activity={activity} lang={lang} />
			</div>

			{/* Time spent — today / this week / all time, tracked while the
			    app is actually in active use (foreground + interacted with),
			    kept in its own storage bucket separate from progress. */}
			<h2 className="font-bengali text-sm font-bold text-ink dark:text-shu-glow mb-2">
				{T("timeSpentTitle")}
			</h2>
			<div className="grid grid-cols-3 gap-2.5 mb-5">
				<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-3 flex flex-col items-center gap-1 text-center">
					<span className="font-mono text-base font-semibold text-shu dark:text-shu-glow">
						{formatDuration(
							timeToday,
							T("timeHourShort"),
							T("timeMinuteShort"),
							T("timeUnderMinute"),
						)}
					</span>
					<span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
						{T("timeToday")}
					</span>
				</div>
				<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-3 flex flex-col items-center gap-1 text-center">
					<span className="font-mono text-base font-semibold text-shu dark:text-shu-glow">
						{formatDuration(
							timeWeek,
							T("timeHourShort"),
							T("timeMinuteShort"),
							T("timeUnderMinute"),
						)}
					</span>
					<span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
						{T("timeThisWeek")}
					</span>
				</div>
				<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-3 flex flex-col items-center gap-1 text-center">
					<span className="font-mono text-base font-semibold text-shu dark:text-shu-glow">
						{formatDuration(
							timeTotal,
							T("timeHourShort"),
							T("timeMinuteShort"),
							T("timeUnderMinute"),
						)}
					</span>
					<span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
						{T("timeAllTime")}
					</span>
				</div>
			</div>

			{/* Per-category breakdown */}
			<div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
				<h2 className="font-bengali text-sm font-bold text-ink dark:text-shu-glow">
					{T("progressByCategory")}
				</h2>
				{isVocab && (
					<div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden">
						{[
							{ key: "lesson", label: T("groupByLesson") },
							{ key: "pos", label: T("groupByPos") },
							{ key: "count", label: T("groupByCount") },
						].map((g) => (
							<button
								key={g.key}
								onClick={() => {
									setGroupBy(g.key);
									setConfirmingCategory(null);
								}}
								className={`px-2.5 py-1 text-[11px] font-bengali font-medium ${
									groupBy === g.key
										? "bg-shu text-washi"
										: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
								}`}
							>
								{g.label}
							</button>
						))}
					</div>
				)}
			</div>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none divide-y divide-ai-line dark:divide-night-line mb-6">
				{stats.byCategory.map((c) => {
					const donePct = c.total ? (c.done / c.total) * 100 : 0;
					const startedPct = c.total
						? (c.started / c.total) * 100
						: 0;
					const isConfirming = confirmingCategory === c.key;
					return (
						<div key={c.key} className="px-4 py-2.5">
							<div className="flex items-center justify-between text-xs mb-1 gap-2">
								<span className="font-bengali text-ink dark:text-night-ink font-medium truncate">
									{pickLang(c, lang)}
								</span>
								<span className="flex items-center gap-2 shrink-0">
									<span className="font-mono text-ink-muted dark:text-night-ink-muted">
										{c.done}/{c.total}
									</span>
									{c.touched > 0 ? (
										<button
											onClick={() => handleResetCategory(c)}
											aria-label={T("resetCategoryAria")}
											title={
												isConfirming
													? T("resetCategoryConfirm")
													: T("resetCategoryAria")
											}
											className={`tap-quiet w-5 h-5 flex items-center justify-center rounded-full border ${
												isConfirming
													? "border-shu bg-shu text-washi"
													: "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-shu hover:text-shu"
											}`}
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="w-3 h-3"
												aria-hidden="true"
											>
												<polyline points="1 4 1 10 7 10" />
												<path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
											</svg>
										</button>
									) : (
										<span
											aria-hidden="true"
											title={T("resetCategoryNothingYet")}
											className="w-5 h-5 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted/40 dark:text-night-ink-muted/40 opacity-50"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="w-3 h-3"
												aria-hidden="true"
											>
												<polyline points="1 4 1 10 7 10" />
												<path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
											</svg>
										</span>
									)}
								</span>
							</div>
							{isConfirming && (
								<div className="font-bengali text-[10px] text-shu dark:text-shu-glow mb-1">
									{T("resetCategoryConfirm")}
								</div>
							)}
							<div className="w-full h-1.5 bg-ai-soft dark:bg-night-line rounded-full overflow-hidden flex">
								<div
									className="h-full bg-take transition-all"
									style={{ width: `${donePct}%` }}
								/>
								<div
									className="h-full bg-sakura transition-all"
									style={{ width: `${startedPct}%` }}
								/>
							</div>
						</div>
					);
				})}
				{stats.byCategory.length === 0 && (
					<div className="px-4 py-8 text-center font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
						{T("noItemsInFilter")}
					</div>
				)}
			</div>

			<div className="text-center">
				<button
					onClick={handleReset}
					className={`font-bengali text-xs rounded-md px-3 py-1.5 border ${
						confirmingReset
							? "border-shu bg-shu text-washi"
							: "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-shu hover:text-shu"
					}`}
				>
					{confirmingReset
						? T("resetProgressConfirm")
						: T("resetProgress")}
				</button>
			</div>
		</div>
	);
}
