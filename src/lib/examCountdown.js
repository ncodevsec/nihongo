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
