import { useState } from "react";
import { t } from "../../lib/i18n.js";
import { resolveEvents } from "../../lib/eventCountdown.js";
import { PREDEFINED_EVENTS } from "../../data/events.js";
import Icon from "./icons.jsx";

function daysLabel(days, T) {
	if (days === 0)
		return (
			<span className="font-bengali text-[11px] font-bold text-shu dark:text-shu-glow shrink-0">
				{T("eventToday")}
			</span>
		);
	return (
		<span className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted shrink-0">
			<span className="font-bold text-shu dark:text-shu-glow">{days}</span>{" "}
			{T(days === 1 ? "eventDayLeft" : "eventDaysLeft")}
		</span>
	);
}

// Inline add/edit form for a custom event — the one place that knows how to
// create or change one.
function EventForm({ initial, onSave, onCancel, onDelete, T }) {
	const [name, setName] = useState(initial?.name ?? "");
	const [date, setDate] = useState(initial?.date ?? "");
	return (
		<div className="flex flex-col sm:flex-row sm:items-end gap-2.5 w-full">
			<div className="flex-1 min-w-0">
				<label className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">
					{T("eventNameLabel")}
				</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder={T("eventNamePlaceholder")}
					className="mt-1 w-full font-bengali text-sm rounded-md border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2 text-ink dark:text-night-ink"
				/>
			</div>
			<div>
				<label className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">
					{T("eventDateLabel")}
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
					{T("eventSave")}
				</button>
				{onDelete && (
					<button
						type="button"
						onClick={onDelete}
						aria-label={T("eventClear")}
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

// The "+ Add event" panel: upcoming developer-set events to show with one
// tap, plus a "Custom event" button that opens the form.
function PickerPanel({ options, onPick, onCustom, onCancel, T }) {
	return (
		<div className="w-full rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night p-3">
			<div className="flex items-center justify-between gap-2 mb-2">
				<span className="font-bengali text-[11px] font-semibold text-ink-muted dark:text-night-ink-muted">
					{T("eventPickTitle")}
				</span>
				<button
					type="button"
					onClick={onCancel}
					aria-label="Cancel"
					className="text-ink-muted dark:text-night-ink-muted"
				>
					✕
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{options.map((e) => (
					<button
						key={e.id}
						type="button"
						onClick={() => onPick(e.id)}
						className="flex items-center gap-2 rounded-full border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper px-3 py-1.5 hover:border-shu/50"
					>
						<span className="font-bengali text-xs font-semibold text-ink dark:text-night-ink">
							{e.name}
						</span>
						<span className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">
							{e.date}
						</span>
						{daysLabel(e.days, T)}
					</button>
				))}
				<button
					type="button"
					onClick={onCustom}
					className="flex items-center gap-1 rounded-full border border-dashed border-shu/50 dark:border-shu-glow/50 px-3 py-1.5 font-bengali text-xs font-semibold text-shu dark:text-shu-glow"
				>
					<span aria-hidden="true">+</span>
					{T("eventCustom")}
				</button>
			</div>
		</div>
	);
}

// Home's event countdown: one event in the spotlight (big number, name right
// beside it) plus any others as small tags underneath. Events come from two
// places — developer-set ones in data/events.js that the learner ticks to
// show, and the learner's own custom events. An event whose date has passed
// simply stops being "upcoming" (see resolveEvents), so it leaves the card
// and the picker on its own and the next one takes the spotlight.
export default function EventCountdown({
	events,
	selectedEvents,
	onChangeEvents,
	onChangeSelected,
	lang,
}) {
	const T = (k) => t(lang, k);
	// event id | "new" (custom form) | "menu" (picker) | null
	const [editingId, setEditingId] = useState(null);
	const { main, others, options } = resolveEvents(
		PREDEFINED_EVENTS,
		selectedEvents,
		events,
	);

	const saveCustom = (id, data) => {
		const next =
			id === "new"
				? [...(events || []), { id: `event-${Date.now()}`, ...data }]
				: (events || []).map((e) => (e.id === id ? { ...e, ...data } : e));
		onChangeEvents(next);
		setEditingId(null);
	};
	const removeCustom = (id) => {
		onChangeEvents((events || []).filter((e) => e.id !== id));
		setEditingId(null);
	};
	const pick = (id) => {
		onChangeSelected([...(selectedEvents || []), id]);
		setEditingId(null);
	};
	const hide = (id) =>
		onChangeSelected((selectedEvents || []).filter((x) => x !== id));

	const addArea =
		editingId === "new" ? (
			<div className="w-full">
				<EventForm T={T} onSave={(d) => saveCustom("new", d)} onCancel={() => setEditingId(null)} />
			</div>
		) : editingId === "menu" ? (
			<PickerPanel
				T={T}
				options={options}
				onPick={pick}
				onCustom={() => setEditingId("new")}
				onCancel={() => setEditingId(null)}
			/>
		) : (
			<button
				type="button"
				onClick={() => setEditingId("menu")}
				className="flex items-center gap-1 rounded-full border border-dashed border-ai-line dark:border-night-line px-3 py-1.5 font-bengali text-xs text-ink-muted dark:text-night-ink-muted hover:border-shu/50 hover:text-shu dark:hover:text-shu-glow"
			>
				<span aria-hidden="true">+</span>
				{T("eventAdd")}
			</button>
		);

	// Nothing to show: one compact prompt (or the picker / form itself).
	if (!main) {
		return (
			<div className="rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4">
				{editingId === "new" || editingId === "menu" ? (
					addArea
				) : (
					<button
						type="button"
						onClick={() => setEditingId("menu")}
						className="flex w-full items-center gap-3 text-left"
					>
						<span className="shrink-0 w-10 h-10 rounded-full bg-shu-soft dark:bg-night flex items-center justify-center text-shu dark:text-shu-glow">
							<Icon name="target" className="w-5 h-5" />
						</span>
						<span className="min-w-0">
							<span className="block font-bengali text-sm font-bold text-ink dark:text-night-ink">
								{T("eventCountdownSetup")}
							</span>
							<span className="block font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
								{T("eventCountdownSetupSub")}
							</span>
						</span>
					</button>
				)}
			</div>
		);
	}

	const mainEditing = editingId === main.id;
	const isToday = main.days === 0;

	return (
		<div className="rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5">
			{mainEditing ? (
				<EventForm
					T={T}
					initial={main}
					onSave={(d) => saveCustom(main.id, d)}
					onCancel={() => setEditingId(null)}
					onDelete={() => removeCustom(main.id)}
				/>
			) : (
				<div className="flex items-center gap-4 sm:gap-6">
					{/* Big number first: the day-count is the point of the card. */}
					<div className="shrink-0 flex flex-col items-center gap-1.5">
						<span
							className={`font-bold leading-none text-shu dark:text-shu-glow ${
								isToday ? "font-bengali text-4xl" : "font-mono text-5xl"
							}`}
						>
							{isToday ? T("eventToday") : main.days}
						</span>
						{!isToday && (
							<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted whitespace-nowrap">
								{T(main.days === 1 ? "eventDayLeft" : "eventDaysLeft")}
							</span>
						)}
					</div>
					<div className="w-px self-stretch bg-ai-line dark:bg-night-line shrink-0" />
					<div className="min-w-0 flex-1">
						<div className="font-bengali text-4xl font-bold text-ink dark:text-night-ink truncate">
							{main.name || T("eventCountdownTitle")}
						</div>
						<div className="font-mono text-sm text-ink-muted dark:text-night-ink-muted mt-0.5">
							{main.date}
						</div>
					</div>
					<button
						type="button"
						onClick={() => (main.custom ? setEditingId(main.id) : hide(main.id))}
						className="shrink-0 font-bengali text-xs font-semibold text-ink-muted dark:text-night-ink-muted hover:text-shu dark:hover:text-shu-glow underline"
					>
						{main.custom ? T("eventEdit") : T("eventHide")}
					</button>
				</div>
			)}

			{/* Every other upcoming event, as small tags — tap a custom one to
			    edit it in place, or ✕ a predefined one to hide it. */}
			{!mainEditing && (
				<div className="mt-3 pt-3 border-t border-ai-line dark:border-night-line flex flex-wrap items-center gap-2">
					{others.map((e) =>
						editingId === e.id ? (
							<div key={e.id} className="w-full">
								<EventForm
									T={T}
									initial={e}
									onSave={(d) => saveCustom(e.id, d)}
									onCancel={() => setEditingId(null)}
									onDelete={() => removeCustom(e.id)}
								/>
							</div>
						) : (
							<span
								key={e.id}
								className="flex items-center gap-1.5 rounded-full border border-ai-line dark:border-night-line bg-washi dark:bg-night pl-3 pr-2 py-1.5"
							>
								<button
									type="button"
									disabled={!e.custom}
									onClick={() => setEditingId(e.id)}
									className="flex items-center gap-1.5 disabled:cursor-default"
								>
									<span className="font-bengali text-xs font-medium text-ink dark:text-night-ink truncate max-w-[8rem]">
										{e.name || T("eventCountdownTitle")}
									</span>
									{daysLabel(e.days, T)}
								</button>
								{!e.custom && (
									<button
										type="button"
										onClick={() => hide(e.id)}
										aria-label={T("eventHide")}
										title={T("eventHide")}
										className="text-ink-muted dark:text-night-ink-muted hover:text-shu dark:hover:text-shu-glow text-xs px-1"
									>
										✕
									</button>
								)}
							</span>
						),
					)}
					{addArea}
				</div>
			)}
		</div>
	);
}
