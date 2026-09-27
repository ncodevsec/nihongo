// Whole-day countdown to a student-chosen exam date. Dates are plain
// "YYYY-MM-DD" strings (from an <input type="date">) parsed as a local
// calendar day, not a UTC instant, so "the exam is on the 12th" means the
// same thing regardless of the learner's timezone.
export function daysUntil(dateStr, from = new Date()) {
	if (!dateStr) return null;
	const [y, m, d] = dateStr.split("-").map(Number);
	if (!y || !m || !d) return null;
	const target = new Date(y, m - 1, d);
	const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
	return Math.round((target - today) / 86400000);
}

// Sorted, upcoming-only view of a list of { id, name, date } exams: past
// dates are dropped entirely (an ended exam is never shown again, so the
// next one is automatically "promoted" to the front with no extra state
// to track), and what remains is ordered soonest-first. `main` is the one
// exam in the spotlight; `others` are the rest, shown as small tags.
export function upcomingExams(exams, from = new Date()) {
	const withDays = (exams || [])
		.map((e) => ({ ...e, days: daysUntil(e.date, from) }))
		.filter((e) => e.days !== null && e.days >= 0)
		.sort((a, b) => a.days - b.days);
	return { main: withDays[0] ?? null, others: withDays.slice(1) };
}
