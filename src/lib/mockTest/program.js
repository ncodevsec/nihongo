import { parseScript } from "./speech.js";

// Continuous-listening programme. Modelled on the structure measured from real
// JLPT listening recordings: the narrator opens the section, reads the
// directions for each part, calls every item by number ("1番"), plays it once
// — with the question read before and after the conversation for
// point-comprehension — then leaves a silent answer window before the next
// number. Nothing can be paused or replayed.
//
// Timings (seconds) come from the measured gaps of a real N2 recording
// (answer windows 8–12 s, ~3 s between directions and the first item, ~0.8 s
// between speakers) and are reused for N5/N4, which follow the same pattern.
export const TIMING = {
	open: 3,
	afterDirections: 3,
	optionRead: 8, // printed options are read silently before the dialogue
	answer: { lisQuick: 8, lisUtterance: 8, lisPoint: 12 },
	optionGapMs: 1800, // between the spoken options of a quick-response item
	turnGapMs: 800, // between the speakers of a dialogue
	close: 2,
};

const N = (text, after) => ({ who: "N", text, after });

export const DIRECTIONS = {
	lisQuick: "もんだい。ぶんを きいて、へんじを 1、2、3の なかから、いちばん いい ものを 一つ えらんで ください。",
	lisUtterance: "もんだい。じょうきょうを きいて、なんと いいますか。1、2、3の なかから、いちばん いい ものを 一つ えらんで ください。",
	lisPoint: "もんだい。はじめに しつもんを きいて ください。それから はなしを きいて、1から4の なかから、いちばん いい ものを 一つ えらんで ください。",
};

// → [{ k: "say" | "wait", tag, qi, lines | sec }]  (qi = the question the event belongs to)
export function buildProgram(questions) {
	const ev = [];
	const say = (tag, qi, lines, gapMs) => ev.push({ k: "say", tag, qi, lines, gapMs });
	const wait = (tag, qi, sec) => ev.push({ k: "wait", tag, qi, sec });
	say("open", 0, [N("ちょうかいの しけんを はじめます。")]);
	wait("open", 0, TIMING.open);
	let prev = null;
	questions.forEach((q, qi) => {
		if (q.part !== prev) {
			say("dir", qi, [N(DIRECTIONS[q.part])]);
			wait("dir", qi, TIMING.afterDirections);
			prev = q.part;
		}
		const num = `${qi + 1}番。`;
		const lis = q.lis;
		if (q.part === "lisQuick") {
			say("item", qi, [N(num + lis.intro, 1500), ...q.choices.map((c, i) => N(`${i + 1}番、${c}`, TIMING.optionGapMs))]);
		} else if (q.part === "lisUtterance") {
			say("item", qi, [N(num + lis.intro)]);
		} else {
			say("item", qi, [N(num + lis.qtext)]);
			wait("read", qi, TIMING.optionRead);
			say("item", qi, lis.dialog, TIMING.turnGapMs);
			say("item", qi, [N(lis.qtext)]);
		}
		wait("answer", qi, TIMING.answer[q.part]);
	});
	say("close", questions.length - 1, [N("これで ちょうかいの しけんを おわります。")]);
	wait("close", questions.length - 1, TIMING.close);
	return ev;
}

// The audio used by pause-and-replay mode (one self-contained clip per item).
export const clipFor = (q) =>
	q.part === "lisQuick"
		? [N(q.lis.intro, 1200), ...q.choices.map((c, i) => N(`${i + 1}番、${c}`, 1500))]
		: q.part === "lisUtterance"
			? [N(q.lis.intro)]
			: [...q.lis.dialog, N(q.lis.qtext)];

export { parseScript };
