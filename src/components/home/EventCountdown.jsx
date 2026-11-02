import { useState } from "react";
import { t } from "../../lib/i18n.js";
import { resolveEvents } from "../../lib/eventCountdown.js";
import { PREDEFINED_EVENTS } from "../../data/events.js";
import Icon from "./icons.jsx";

function daysLabel(days, T) {
	if (days === 0)
		return <span className="font-bengali text-[11px] font-bold text-shu dark:text-shu-glow shrink-0">{T("eventToday")}</span>;
	return (
		<span className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted shrink-0">
			<span className="font-bold text-shu dark:text-shu-glow">{days}</span> {T(days === 1 ? "eventDayLeft" : "eventDaysLeft")}
		</span>
	);
}

function Switch({ checked, onChange, label }) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={label}
			onClick={() => onChange(!checked)}
			className={`tap-quiet w-10 h-6 shrink-0 rounded-full relative transition-colors ${checked ? "bg-shu dark:bg-shu-glow" : "bg-ai-line dark:bg-night-line"}`}
		>
			<span className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-150 ${checked ? "translate-x-4" : "translate-x-0"}`} />
		</button>
	);
}

// Add / edit form for a custom event.
function EventForm({ initial, onSave, onCancel, T }) {
	const [name, setName] = useState(initial?.name ?? "");
	const [date, setDate] = useState(initial?.date ?? "");
	const field = "mt-1 w-full text-sm rounded-md border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper px-3 py-2 text-ink dark:text-night-ink";
	return (
		<div className="flex flex-col sm:flex-row sm:items-end gap-2.5 w-full rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper p-3">
			<div className="flex-1 min-w-0">
				<label className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{T("eventNameLabel")}</label>
				<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={T("eventNamePlaceholder")} className={`${field} font-bengali`} />
			</div>
			<div>
				<label className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{T("eventDateLabel")}</label>
				<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${field} font-mono sm:w-auto`} />
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
				<button type="button" onClick={onCancel} aria-label="Cancel" className="rounded-md border border-ai-line dark:border-night-line px-3 py-2 text-ink-muted dark:text-night-ink-muted">
					✕
				</button>
			</div>
		</div>
	);
}

function IconBtn({ icon, label, onClick, danger }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			title={label}
			className={`tap-quiet w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted ${
				danger ? "hover:text-danger hover:border-danger" : "hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow"
			}`}
		>
			<Icon name={icon} className="w-4 h-4" />
		</button>
	);
}

// Everything configurable lives here: tick the exams to show, manage custom events, add one.
function ConfigPanel({ official, custom, pickedIds, onTogglePredefined, onSaveCustom, onRemoveCustom, onClose, T }) {
	const [editing, setEditing] = useState(null); // custom id | "new" | null
	const picked = new Set(pickedIds);
	return (
		<div className="mt-4 pt-4 border-t border-ai-line dark:border-night-line space-y-4">
			<div className="flex items-center justify-between gap-2">
				<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{T("eventConfigTitle")}</h3>
				<button type="button" onClick={onClose} className="font-bengali text-xs font-semibold text-shu dark:text-shu-glow">
					{T("eventDone")}
				</button>
			</div>

			<div>
				<div className="font-bengali text-[11px] font-semibold text-ink-muted dark:text-night-ink-muted mb-1.5">{T("eventOfficial")}</div>
				<ul className="divide-y divide-ai-line dark:divide-night-line rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night">
					{official.map((e) => (
						<li key={e.id} className="flex items-center gap-3 px-3 py-2.5">
							<div className="min-w-0 flex-1">
								<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{e.name}</div>
								<div className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{e.date}</div>
							</div>
							{daysLabel(e.days, T)}
							<Switch checked={picked.has(e.id)} onChange={() => onTogglePredefined(e.id)} label={e.name} />
						</li>
					))}
				</ul>
			</div>

			<div>
				<div className="flex items-center justify-between mb-1.5">
					<span className="font-bengali text-[11px] font-semibold text-ink-muted dark:text-night-ink-muted">{T("eventMine")}</span>
					{editing !== "new" && (
						<button
							type="button"
							onClick={() => setEditing("new")}
							className="flex items-center gap-1 rounded-full border border-dashed border-shu/50 dark:border-shu-glow/50 px-3 py-1 font-bengali text-xs font-semibold text-shu dark:text-shu-glow"
						>
							<Icon name="plus" className="w-3.5 h-3.5" strokeWidth={2.2} />
							{T("eventAdd")}
						</button>
					)}
				</div>
				{editing === "new" && (
					<div className="mb-2">
						<EventForm T={T} onSave={(d) => { onSaveCustom("new", d); setEditing(null); }} onCancel={() => setEditing(null)} />
					</div>
				)}
				{custom.length === 0 && editing !== "new" ? (
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">{T("eventNoMine")}</p>
				) : (
					<ul className="space-y-2">
						{custom.map((e) =>
							editing === e.id ? (
								<li key={e.id}>
									<EventForm T={T} initial={e} onSave={(d) => { onSaveCustom(e.id, d); setEditing(null); }} onCancel={() => setEditing(null)} />
								</li>
							) : (
								<li key={e.id} className="flex items-center gap-2 rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2">
									<div className="min-w-0 flex-1">
										<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink truncate">{e.name || T("eventCountdownTitle")}</div>
										<div className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{e.date}</div>
									</div>
									{daysLabel(e.days, T)}
									<IconBtn icon="pencil" label={T("eventEdit")} onClick={() => setEditing(e.id)} />
									<IconBtn icon="trash" label={T("eventClear")} danger onClick={() => onRemoveCustom(e.id)} />
								</li>
							),
						)}
					</ul>
				)}
			</div>
		</div>
	);
}

// Home's event countdown: one event in the spotlight (big number + name) and any others as small
// tags. A gear button opens the configuration panel. Until the learner configures anything, the
// next JLPT event is shown. Past events drop out on their own (see resolveEvents).
export default function EventCountdown({ events, selectedEvents, eventsConfigured, onChangeEvents, onChangeSelected, lang }) {
	const T = (k) => t(lang, k);
	const [open, setOpen] = useState(false);
	const configured = eventsConfigured || (selectedEvents || []).length > 0 || (events || []).length > 0;
	const { main, others, official, custom, pickedIds } = resolveEvents(PREDEFINED_EVENTS, selectedEvents, events, configured);

	const togglePredefined = (id) =>
		onChangeSelected(pickedIds.includes(id) ? pickedIds.filter((x) => x !== id) : [...pickedIds, id]);
	const saveCustom = (id, data) => {
		const next =
			id === "new"
				? [...(events || []), { id: `event-${Date.now()}`, ...data }]
				: (events || []).map((e) => (e.id === id ? { ...e, ...data } : e));
		onChangeEvents(next);
	};
	const removeCustom = (id) => onChangeEvents((events || []).filter((e) => e.id !== id));

	const gear = (
		<button
			type="button"
			onClick={() => setOpen((v) => !v)}
			aria-label={T("eventConfigure")}
			title={T("eventConfigure")}
			aria-expanded={open}
			className={`tap-quiet w-9 h-9 shrink-0 flex items-center justify-center rounded-full border transition-colors ${
				open
					? "border-shu bg-shu text-washi dark:border-shu-glow dark:bg-shu-glow dark:text-white"
					: "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow"
			}`}
		>
			<Icon name="sliders" className="w-4 h-4" />
		</button>
	);
	const panel = open && (
		<ConfigPanel
			official={official}
			custom={custom}
			pickedIds={pickedIds}
			onTogglePredefined={togglePredefined}
			onSaveCustom={saveCustom}
			onRemoveCustom={removeCustom}
			onClose={() => setOpen(false)}
			T={T}
		/>
	);
	const shell = "rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5";

	if (!main) {
		return (
			<div className={shell}>
				<div className="flex items-center gap-3">
					<span className="shrink-0 w-10 h-10 rounded-full bg-shu-soft dark:bg-night flex items-center justify-center text-shu dark:text-shu-glow">
						<Icon name="target" className="w-5 h-5" />
					</span>
					<span className="min-w-0 flex-1">
						<span className="block font-bengali text-sm font-bold text-ink dark:text-night-ink">{T("eventCountdownSetup")}</span>
						<span className="block font-bengali text-xs text-ink-muted dark:text-night-ink-muted">{T("eventCountdownSetupSub")}</span>
					</span>
					{gear}
				</div>
				{panel}
			</div>
		);
	}

	const isToday = main.days === 0;
	return (
		<div className={shell}>
			<div className="flex items-center gap-4 sm:gap-6">
				<div className="shrink-0 flex flex-col items-center gap-1.5">
					<span className={`font-bold leading-none text-shu dark:text-shu-glow ${isToday ? "font-bengali text-4xl" : "font-mono text-5xl"}`}>
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
					<div className="font-bengali text-4xl font-bold text-ink dark:text-night-ink truncate">{main.name || T("eventCountdownTitle")}</div>
					<div className="font-mono text-sm text-ink-muted dark:text-night-ink-muted mt-0.5">{main.date}</div>
				</div>
				{gear}
			</div>

			{others.length > 0 && (
				<div className="mt-3 pt-3 border-t border-ai-line dark:border-night-line flex flex-wrap items-center gap-2">
					{others.map((e) => (
						<span key={e.id} className="flex items-center gap-1.5 rounded-full border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-1.5">
							<span className="font-bengali text-xs font-medium text-ink dark:text-night-ink truncate max-w-[8rem]">{e.name || T("eventCountdownTitle")}</span>
							{daysLabel(e.days, T)}
						</span>
					))}
				</div>
			)}
			{panel}
		</div>
	);
}
