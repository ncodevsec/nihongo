import { SECTIONAL } from "../../data/mock/blueprints.js";

// Estimated JLPT-style scoring. The real test uses equating (scaled scores), so
// raw accuracy is only an approximation: Language Knowledge+Reading is the mean
// accuracy of its three parts scaled to 0–120, Listening is scaled to 0–60.
// Pass = total ≥ pass mark AND LK+Reading ≥ 38 AND Listening ≥ 19.

const acc = (x) => (x && x.t ? x.c / x.t : null);

export function scoreTest(test, answers, secondsUsed = {}) {
	const skills = {};
	const parts = {};
	const flat = [];
	for (const s of test.sections) {
		for (const q of s.questions) {
			const ok = answers[q.id] === q.answer;
			flat.push({ q, ok, given: answers[q.id] });
			for (const [bag, key] of [[skills, q.skill], [parts, q.part]]) {
				bag[key] ||= { c: 0, t: 0 };
				bag[key].t += 1;
				if (ok) bag[key].c += 1;
			}
		}
	}
	const lkParts = ["vocab", "grammar", "reading"].map((k) => acc(skills[k]));
	const hasLk = lkParts.every((x) => x !== null);
	const lk = hasLk ? Math.round((SECTIONAL.lkMax * lkParts.reduce((a, b) => a + b, 0)) / 3) : null;
	const lisAcc = acc(skills.listening);
	const lis = lisAcc === null ? null : Math.round(SECTIONAL.lisMax * lisAcc);
	const total = lk !== null && lis !== null ? lk + lis : null;
	const complete = total !== null;
	const pass = complete && total >= test.passMark && lk >= SECTIONAL.lk && lis >= SECTIONAL.lis;
	const correct = flat.filter((f) => f.ok).length;
	const answered = flat.filter((f) => f.given !== undefined).length;
	// Margin over the pass mark decides the readiness band.
	let band = null;
	if (complete) band = pass ? (total - test.passMark >= 15 ? "ready" : "borderline") : total >= test.passMark - 15 ? "close" : "work";
	return { skills, parts, flat, lk, lis, total, complete, pass, band, correct, totalQuestions: flat.length, answered, secondsUsed };
}
