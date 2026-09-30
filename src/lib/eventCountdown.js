// Whole-day countdown to an event date. Dates are plain "YYYY-MM-DD" strings
// (from an <input type="date"> or data/events.js) parsed as a local calendar
// day, not a UTC instant, so "the event is on the 12th" means the same thing
// regardless of the learner's timezone.
export function daysUntil(dateStr, from = new Date()) {
	if (!dateStr) return null;
	const [y, m, d] = dateStr.split("-").map(Number);
	if (!y || !m || !d) return null;
	const target = new Date(y, m - 1, d);
	const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
	return Math.round((target - today) / 86400000);
}

// Upcoming-only view of a list of { id, name, date } events: anything whose
// date is before today is dropped (0 days = today is kept and shown as
// "Today"), the rest is ordered soonest-first.
export function upcomingEvents(events, from = new Date()) {
	return (events || [])
		.map((e) => ({ ...e, days: daysUntil(e.date, from) }))
		.filter((e) => e.days !== null && e.days >= 0)
		.sort((a, b) => a.days - b.days);
}

// What the card shows and what the picker offers.
//   shown   = ticked predefined events + the learner's custom events, upcoming only
//   options = upcoming predefined events not ticked yet
export function resolveEvents(predefined, selectedIds, custom, from = new Date()) {
	const picked = new Set(selectedIds || []);
	const upcomingPredefined = upcomingEvents(predefined, from);
	const shown = upcomingEvents(
		[
			...upcomingPredefined.filter((e) => picked.has(e.id)),
			...(custom || []).map((e) => ({ ...e, custom: true })),
		],
		from,
	);
	return {
		main: shown[0] ?? null,
		others: shown.slice(1),
		options: upcomingPredefined.filter((e) => !picked.has(e.id)),
	};
}
