import { useState } from "react";
import { t } from "../../lib/i18n.js";
import { daysUntil } from "../../lib/examCountdown.js";

// A compact card: once the learner names an exam and picks a date, Home
// shows a running day-count for it; until then, a one-line prompt invites
// setting one up. Editing happens inline, in the same card — no separate
// settings screen needed for something this small.
export default function ExamCountdown({ examName, examDate, onSave, lang }) {
	const T = (k) => t(lang, k);
	const [editing, setEditing] = useState(!examDate);
	const [name, setName] = useState(examName);
	const [date, setDate] = useState(examDate);

	const days = daysUntil(examDate);
	const save = () => {
		onSave({ examName: name.trim(), examDate: date });
		if (date) setEditing(false);
	};
	const clear = () => {
		setName("");
		setDate("");
		onSave({ examName: "", examDate: "" });
		setEditing(true);
	};

	if (editing) {
		return (
			<div className="rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4">
				<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">
					{examDate ? T("examCountdownEdit") : T("examCountdownSetup")}
				</h3>
				{!examDate && (
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-1">
						{T("examCountdownSetupSub")}
					</p>
				)}
				<div className="mt-3 space-y-2.5">
					<div>
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
							className="mt-1 w-full font-mono text-sm rounded-md border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2 text-ink dark:text-night-ink"
						/>
					</div>
					<div className="flex gap-2 pt-1">
						<button
							type="button"
							onClick={save}
							disabled={!date}
							className="flex-1 rounded-lg bg-shu dark:bg-shu-glow text-washi dark:text-white font-bengali text-sm font-semibold py-2 disabled:opacity-40"
						>
							{T("examCountdownSave")}
						</button>
						{examDate && (
							<button
								type="button"
								onClick={() => setEditing(false)}
								className="rounded-lg border border-ai-line dark:border-night-line px-4 font-bengali text-sm text-ink-muted dark:text-night-ink-muted"
							>
								✕
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}

	const label =
		days > 1
			? `${days} ${T("examDaysLeft")}`
			: days === 1
				? `1 ${T("examDayLeft")}`
				: days === 0
					? T("examToday")
					: T("examPast");

	return (
		<div className="rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink truncate">
						{examName || T("examCountdownTitle")}
					</h3>
					<div
						className={`font-mono mt-1 leading-none ${
							days <= 0 ? "text-2xl" : "text-4xl"
						} font-bold ${
							days > 0 ? "text-shu dark:text-shu-glow" : "text-ink-muted dark:text-night-ink-muted"
						}`}
					>
						{days > 0 ? days : ""}
					</div>
					<div className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-1">
						{label}
					</div>
				</div>
				<div className="flex flex-col gap-1.5 shrink-0">
					<button
						type="button"
						onClick={() => setEditing(true)}
						className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted hover:text-shu dark:hover:text-shu-glow underline"
					>
						{T("examCountdownEdit")}
					</button>
					<button
						type="button"
						onClick={clear}
						className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted hover:text-shu dark:hover:text-shu-glow underline"
					>
						{T("examCountdownClear")}
					</button>
				</div>
			</div>
		</div>
	);
}
