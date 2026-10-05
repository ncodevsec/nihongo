// Mock-test blueprints. Section order, times, pass marks and scoring follow the
// official JLPT / NAT-TEST guidelines for N5 (5Q) and N4 (4Q):
//   • 3 test sections — Language Knowledge (Vocabulary) · Language Knowledge
//     (Grammar)・Reading · Listening
//   • 2 scoring sections — Language Knowledge+Reading 0–120 (min 38) and
//     Listening 0–60 (min 19); total 0–180, pass mark N5 80 / N4 90
//   • JLPT times  N5 20/40/30 min · N4 25/55/35 min  (NAT-TEST 5Q/4Q match)
// Question counts per part: JLPT uses the official item counts where our
// banks allow; NAT-TEST uses its smaller official per-section counts.
// Listening counts are reduced (no recorded audio — see lib/mockTest/speech.js).

export const FORMATS = ["jlpt", "nat"];
export const MOCK_LEVELS = ["n5", "n4"];

export const PART_META = {
	kanjiReading: { skill: "vocab", jp: "漢字読み" },
	orthography: { skill: "vocab", jp: "表記" },
	context: { skill: "vocab", jp: "文脈規定" },
	paraphrase: { skill: "vocab", jp: "言い換え" },
	grammarForm: { skill: "grammar", jp: "文の文法1" },
	sentenceOrder: { skill: "grammar", jp: "文の文法2" },
	textGrammar: { skill: "grammar", jp: "文章の文法" },
	reading: { skill: "reading", jp: "読解" },
	lisQuick: { skill: "listening", jp: "即時応答" },
	lisUtterance: { skill: "listening", jp: "発話表現" },
	lisPoint: { skill: "listening", jp: "ポイント理解" },
};

const L = [["lisQuick", 4], ["lisUtterance", 3], ["lisPoint", 5]];
const L4 = [["lisQuick", 4], ["lisUtterance", 2], ["lisPoint", 5]];

export const BLUEPRINTS = {
	jlpt: {
		n5: {
			passMark: 80,
			sections: [
				{ key: "vocab", minutes: 20, parts: [["kanjiReading", 12], ["orthography", 8], ["context", 10], ["paraphrase", 5]] },
				{ key: "grammarReading", minutes: 40, parts: [["grammarForm", 16], ["sentenceOrder", 5], ["textGrammar", 5], ["reading", 6]] },
				{ key: "listening", minutes: 30, parts: L },
			],
		},
		n4: {
			passMark: 90,
			sections: [
				{ key: "vocab", minutes: 25, parts: [["kanjiReading", 9], ["orthography", 6], ["context", 15], ["paraphrase", 5]] },
				{ key: "grammarReading", minutes: 55, parts: [["grammarForm", 15], ["sentenceOrder", 5], ["textGrammar", 5], ["reading", 10]] },
				{ key: "listening", minutes: 35, parts: L4 },
			],
		},
	},
	nat: {
		n5: {
			passMark: 80,
			sections: [
				{ key: "vocab", minutes: 20, parts: [["kanjiReading", 8], ["orthography", 5], ["context", 8]] },
				{ key: "grammarReading", minutes: 40, parts: [["grammarForm", 8], ["sentenceOrder", 3], ["textGrammar", 5], ["reading", 6]] },
				{ key: "listening", minutes: 30, parts: L },
			],
		},
		n4: {
			passMark: 90,
			sections: [
				{ key: "vocab", minutes: 25, parts: [["kanjiReading", 9], ["orthography", 6], ["context", 8], ["paraphrase", 5]] },
				{ key: "grammarReading", minutes: 55, parts: [["grammarForm", 11], ["sentenceOrder", 3], ["textGrammar", 5], ["reading", 10]] },
				{ key: "listening", minutes: 35, parts: L4 },
			],
		},
	},
};

// Official sectional minimums (same for N4 and N5).
export const SECTIONAL = { lk: 38, lkMax: 120, lis: 19, lisMax: 60 };
