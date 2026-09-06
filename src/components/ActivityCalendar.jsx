import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { t } from "../lib/i18n.js";

// Builds the same YYYY-MM-DD shape useProgress's todayKey() writes
// (new Date().toISOString().slice(0, 10)) for a given day, by taking the
// real current moment and only swapping its date fields. This mirrors how
// the streak calc reads activity, so a cell always lines up with the day
// it actually represents — important for anyone east of UTC (like
// Bangladesh, UTC+6), where local midnight already maps to the previous
// UTC calendar date.
function dateKeyFor(referenceNow, year, month, day) {
	const d = new Date(referenceNow);
	d.setFullYear(year, month, day);
	return d.toISOString().slice(0, 10);
}

const WEEKDAY_ROW_KEYS = [
	"weekdaySun",
	"weekdayMon",
	"weekdayTue",
	"weekdayWed",
	"weekdayThu",
	"weekdayFri",
	"weekdaySat",
];
const MONTH_SHORT_KEYS = Array.from(
	{ length: 12 },
	(_, i) => `monthShort${i + 1}`,
);

const MAX_WEEKS = 53; // a trailing year, same span GitHub's graph covers
const MIN_WEEKS = 4;
const CELL_PX = 18;
const GAP_PX = 3;
const COL_PITCH_PX = CELL_PX + GAP_PX; // horizontal space one week-column takes
const LABEL_COL_PX = 30; // reserved for the weekday-name column on the left

function levelForCount(count) {
	if (count <= 0) return 0;
	if (count <= 3) return 1;
	if (count <= 7) return 2;
	if (count <= 14) return 3;
	return 4;
}

const LEVEL_CLASSES = [
	"bg-ai-soft dark:bg-night-line",
	"bg-shu/25 dark:bg-shu-glow/25",
	"bg-shu/50 dark:bg-shu-glow/50",
	"bg-shu/75 dark:bg-shu-glow/75",
	"bg-shu dark:bg-shu-glow",
];

const CELL = "w-[18px] h-[18px]";

// A GitHub-contributions-style graph: each column is one Sun–Sat week,
// each row a weekday, running left (oldest) to right (this week), with
// darker squares for busier days. Rather than generating a fixed year and
// leaving it to horizontal scroll, this measures the space it actually
// has and only builds as many week-columns as fit — few on a phone, more
// on a tablet, most on a wide desktop layout — always keeping the most
// recent week visible.
export default function ActivityCalendar({ activity = {}, lang }) {
	const T = (k) => t(lang, k);
	const now = useMemo(() => new Date(), []);
	const todayKeyValue = now.toISOString().slice(0, 10);
	const containerRef = useRef(null);
	const [visibleWeeks, setVisibleWeeks] = useState(MIN_WEEKS);

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el) return undefined;

		const compute = () => {
			const available = Math.max(0, el.clientWidth - LABEL_COL_PX);
			const count = Math.floor(available / COL_PITCH_PX);
			setVisibleWeeks(Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, count)));
		};

		compute();
		const ro = new ResizeObserver(compute);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const allWeeks = useMemo(() => {
		const endOfWeek = new Date(now);
		endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // this week's Saturday
		const totalDays = MAX_WEEKS * 7;
		const start = new Date(endOfWeek);
		start.setDate(endOfWeek.getDate() - totalDays + 1); // a Sunday

		const cols = [];
		const cursor = new Date(start);
		for (let w = 0; w < MAX_WEEKS; w++) {
			const col = [];
			for (let d = 0; d < 7; d++) {
				const key = dateKeyFor(
					now,
					cursor.getFullYear(),
					cursor.getMonth(),
					cursor.getDate(),
				);
				col.push({ key, date: new Date(cursor), count: activity[key] || 0 });
				cursor.setDate(cursor.getDate() + 1);
			}
			cols.push(col);
		}
		return cols;
	}, [now, activity]);

	// Always keep the most recent weeks; trim from the oldest end first.
	const weeks = useMemo(
		() => allWeeks.slice(allWeeks.length - visibleWeeks),
		[allWeeks, visibleWeeks],
	);

	// Groups consecutive columns that fall in the same month (using each
	// week's Wednesday as the column's "representative" day, since a
	// Sun–Sat week can straddle two months), then places one label
	// centered above the middle of each group's column span — rather than
	// anchored at the group's first column — so it reads as "this whole
	// stretch of columns is September" instead of only marking where
	// September began.
	const monthLabelByCol = useMemo(() => {
		const groups = [];
		weeks.forEach((col, i) => {
			const rep = col[3].date; // Wednesday
			const key = `${rep.getFullYear()}-${rep.getMonth()}`;
			const last = groups[groups.length - 1];
			if (last && last.key === key) {
				last.end = i;
			} else {
				groups.push({ key, month: rep.getMonth(), start: i, end: i });
			}
		});
		const labels = {};
		for (const g of groups) {
			const center = Math.floor((g.start + g.end) / 2);
			labels[center] = T(MONTH_SHORT_KEYS[g.month]);
		}
		return labels;
	}, [weeks, lang]);

	return (
		<div ref={containerRef} className="w-full">
			<div className="flex flex-col gap-1">
				<div className="flex gap-[3px] pl-6">
					{weeks.map((_, i) => (
						<div key={i} className="relative w-[18px] h-[11px] shrink-0">
							{monthLabelByCol[i] && (
								<span className="absolute left-1/2 -translate-x-1/2 top-0 font-bengali text-[9px] text-ink-muted dark:text-night-ink-muted whitespace-nowrap">
									{monthLabelByCol[i]}
								</span>
							)}
						</div>
					))}
				</div>

				<div className="flex gap-[3px]">
					<div className="flex flex-col gap-[3px] pr-1 shrink-0">
						{WEEKDAY_ROW_KEYS.map((k) => (
							<div
								key={k}
								className="w-5 h-[18px] flex items-center"
							>
								<span className="font-bengali text-[9px] text-ink-muted dark:text-night-ink-muted leading-none">
									{T(k)}
								</span>
							</div>
						))}
					</div>

					{weeks.map((col, ci) => (
						<div key={ci} className="flex flex-col gap-[3px] shrink-0">
							{col.map((cell) => {
								const isToday = cell.key === todayKeyValue;
								const isFuture = cell.key > todayKeyValue;
								const level = levelForCount(cell.count);
								const textClass =
									level >= 2
										? "text-washi"
										: "text-ink-muted/70 dark:text-night-ink-muted/70";
								return (
									<div
										key={cell.key}
										title={`${cell.key}: ${cell.count}`}
										className={`${CELL} rounded-[2px] flex items-center justify-center ${
											isFuture ? "bg-transparent" : LEVEL_CLASSES[level]
										} ${
											isToday
												? "ring-1 ring-shu dark:ring-shu-glow"
												: ""
										}`}
									>
										<span
											className={`font-mono text-[8px] leading-none select-none ${
												isFuture
													? "text-ink-muted/30 dark:text-night-ink-muted/30"
													: textClass
											}`}
										>
											{cell.date.getDate()}
										</span>
									</div>
								);
							})}
						</div>
					))}
				</div>

				<div className="flex items-center justify-end gap-1 pt-1 pr-1">
					<span className="font-bengali text-[9px] text-ink-muted dark:text-night-ink-muted">
						{T("calendarLess")}
					</span>
					{LEVEL_CLASSES.map((cls, i) => (
						<div key={i} className={`${CELL} rounded-[2px] ${cls}`} />
					))}
					<span className="font-bengali text-[9px] text-ink-muted dark:text-night-ink-muted">
						{T("calendarMore")}
					</span>
				</div>
			</div>
		</div>
	);
}
