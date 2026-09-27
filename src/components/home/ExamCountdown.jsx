import { useState } from "react";
import { t } from "../../lib/i18n.js";
import { upcomingExams } from "../../lib/examCountdown.js";
import Icon from "./icons.jsx";

function daysLabel(days, T) {
	if (days === 0) return T("examToday");
	if (days === 1) return `1 ${T("examDayLeft")}`;
	return `${days} ${T("examDaysLeft")}`;
}

// Inline add/edit form — shared by the main card and the "+ add" tag, so
// there is exactly one place that knows how to create or change an exam.
function ExamForm({ initial, onSave, onCancel, onDelete, T }) {
	const [name, setName] = useState(initial?.name ?? "");
	const [date, setDate] = useState(initial?.date ?? "");
	return (
		<div className="flex flex-col sm:flex-row sm:items-end gap-2.5 w-full">
			<div className="flex-1 min-w-0">
				<label className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">
					{T("examNameLabel")}
				</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder={T("examNamePlaceholder")}
					className="mt-1 w-full font-bengali text-sm rounded-md border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2 text-ink dark:text-night-ink"
				/>
			</div>
			<div>
				<label className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">
					{T("examDateLabel")}
				</label>
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="mt-1 w-full sm:w-auto font-mono text-sm rounded-md border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2 text-ink dark:text-night-ink"
				/>
			</div>
			<div className="flex gap-2 shrink-0">
				<button
					type="button"
					onClick={() => date && onSave({ name: name.trim(), date })}
					disabled={!date}
					className="flex-1 sm:flex-none rounded-md bg-shu dark:bg-shu-glow text-washi dark:text-white font-bengali text-sm font-semibold px-4 py-2 disabled:opacity-40"
				>
					{T("examCountdownSave")}
				</button>
				{onDelete && (
					<button
						type="button"
						onClick={onDelete}
						aria-label={T("examCountdownClear")}
						className="rounded-md border border-ai-line dark:border-night-line px-3 py-2 text-ink-muted dark:text-night-ink-muted hover:text-shu dark:hover:text-shu-glow"
					>
						<Icon name="archive" className="w-4 h-4" />
					</button>
				)}
				<button
					type="button"
					onClick={onCancel}
					aria-label="Cancel"
					className="rounded-md border border-ai-line dark:border-night-line px-3 py-2 text-ink-muted dark:text-night-ink-muted"
				>
					✕
				</button>
			</div>
		</div>
	);
}

// Home's exam countdown: one exam in the spotlight (big number, name right
// beside it) plus any others as small tags underneath. A finished exam
// simply stops being "upcoming" (see upcomingExams), so the next one takes
// the spotlight automatically — no extra bookkeeping.
export default function ExamCountdown({ exams, onChange, lang }) {
	const T = (k) => t(lang, k);
	const [editingId, setEditingId] = useState(null); // exam id | "new" | null
	const { main, others } = upcomingExams(exams);

	const save = (id, data) => {
		const withId = { id: id === "new" ? `exam-${Date.now()}` : id, ...data };
		const next =
			id === "new"
				? [...(exams || []), withId]
				: (exams || []).map((e) => (e.id === id ? { ...e, ...data } : e));
		onChange(next);
		setEditingId(null);
	};
	const remove = (id) => {
		onChange((exams || []).filter((e) => e.id !== id));
		setEditingId(null);
	};

	// Nothing upcoming at all: one compact prompt (or the add form itself).
	if (!main) {
		return (
			<div className="rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4">
				{editingId === "new" ? (
					<ExamForm T={T} onSave={(d) => save("new", d)} onCancel={() => setEditingId(null)} />
				) : (
					<button
						type="button"
						onClick={() => setEditingId("new")}
						className="flex w-full items-center gap-3 text-left"
					>
						<span className="shrink-0 w-10 h-10 rounded-full bg-shu-soft dark:bg-night flex items-center justify-center text-shu dark:text-shu-glow">
							<Icon name="target" className="w-5 h-5" />
						</span>
						<span className="min-w-0">
							<span className="block font-bengali text-sm font-bold text-ink dark:text-night-ink">
								{T("examCountdownSetup")}
							</span>
							<span className="block font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
								{T("examCountdownSetupSub")}
							</span>
						</span>
					</button>
				)}
			</div>
		);
	}

	const mainEditing = editingId === main.id;

	return (
		<div className="rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5">
			{mainEditing ? (
				<ExamForm
					T={T}
					initial={main}
					onSave={(d) => save(main.id, d)}
					onCancel={() => setEditingId(null)}
					onDelete={() => remove(main.id)}
				/>
			) : (
				<div className="flex items-center gap-4 sm:gap-6">
					{/* Big number first: the day-count is the point of the card. */}
					<div className="shrink-0 flex items-baseline gap-1.5">
						<span className="font-mono text-4xl sm:text-5xl font-bold leading-none text-shu dark:text-shu-glow">
							{main.days}
						</span>
						<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted whitespace-nowrap">
							{T(main.days === 1 ? "examDayLeft" : "examDaysLeft")}
						</span>
					</div>
					<div className="w-px self-stretch bg-ai-line dark:bg-night-line shrink-0" />
					{/* The exam's name, clearly secondary to the number but still the
					    first thing read after it. */}
					<div className="min-w-0 flex-1">
						<div className="font-bengali text-sm sm:text-base font-bold text-ink dark:text-night-ink truncate">
							{main.name || T("examCountdownTitle")}
						</div>
						<div className="font-mono text-xs text-ink-muted dark:text-night-ink-muted mt-0.5">
							{main.date}
						</div>
					</div>
					<button
						type="button"
						onClick={() => setEditingId(main.id)}
						className="shrink-0 font-bengali text-xs font-semibold text-ink-muted dark:text-night-ink-muted hover:text-shu dark:hover:text-shu-glow underline"
					>
						{T("examCountdownEdit")}
					</button>
				</div>
			)}

			{/* Every other upcoming exam, as small tags — tap one to edit it in
			    place, right below the spotlight card. */}
			{(others.length > 0 || editingId === "new" || (others.length === 0 && !mainEditing)) && (
				<div className="mt-3 pt-3 border-t border-ai-line dark:border-night-line flex flex-wrap items-center gap-2">
					{others.map((e) =>
						editingId === e.id ? (
							<div key={e.id} className="w-full">
								<ExamForm
									T={T}
									initial={e}
									onSave={(d) => save(e.id, d)}
									onCancel={() => setEditingId(null)}
									onDelete={() => remove(e.id)}
								/>
							</div>
						) : (
							<button
								key={e.id}
								type="button"
								onClick={() => setEditingId(e.id)}
								className="flex items-center gap-1.5 rounded-full border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-1.5 hover:border-shu/50"
							>
								<span className="font-bengali text-xs font-medium text-ink dark:text-night-ink truncate max-w-[8rem]">
									{e.name || T("examCountdownTitle")}
								</span>
								<span className="font-mono text-[11px] text-shu dark:text-shu-glow shrink-0">
									{daysLabel(e.days, T)}
								</span>
							</button>
						),
					)}
					{editingId === "new" ? (
						<div className="w-full">
							<ExamForm T={T} onSave={(d) => save("new", d)} onCancel={() => setEditingId(null)} />
						</div>
					) : (
						<button
							type="button"
							onClick={() => setEditingId("new")}
							className="flex items-center gap-1 rounded-full border border-dashed border-ai-line dark:border-night-line px-3 py-1.5 font-bengali text-xs text-ink-muted dark:text-night-ink-muted hover:border-shu/50 hover:text-shu dark:hover:text-shu-glow"
						>
							<span aria-hidden="true">+</span>
							{T("examCountdownAdd")}
						</button>
					)}
				</div>
			)}
		</div>
	);
}
