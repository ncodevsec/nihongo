// Demo question paper for the "AI papers" feature (downloadable from the Mock
// Test tab). It shows every question type once or twice — a real paper should
// follow the counts in the prompt. Answers are 0-based indexes into `choices`;
// the app shuffles the choices itself, so the correct one may sit anywhere.
export const DEMO_PAPER = {
	format: "nihongo-mock-paper/1",
	title: "N5 Demo Paper",
	level: "n5",
	author: "demo",
	notes: "Demo file — shows the structure only. Counts here are small on purpose.",
	sections: {
		vocab: {
			kanjiReading: [
				{ word: "学校", choices: ["がっこう", "がくこう", "がっこ", "かっこう"], answer: 0, explanation: "学校 = がっこう (school)" },
				{ word: "電話", choices: ["てんわ", "でんわ", "でんは", "てんは"], answer: 1, explanation: "電話 = でんわ (telephone)" },
			],
			orthography: [
				{ reading: "えき", choices: ["駅", "馬", "訳", "沢"], answer: 0, explanation: "えき = 駅 (station)" },
				{ reading: "ともだち", choices: ["友だち", "反だち", "支だち", "友だら"], answer: 0 },
			],
			context: [
				{ sentence: "のどが かわきましたから、( ) を のみたいです。", choices: ["くつ", "かさ", "みず", "とけい"], answer: 2, explanation: "Only みず (water) can be drunk." },
			],
			paraphrase: [
				{ sentence: "この ほんは やさしいです。", choices: ["この ほんは たかいです。", "この ほんは むずかしくないです。", "この ほんは ふるいです。", "この ほんは おもしろくないです。"], answer: 1 },
			],
		},
		grammarReading: {
			grammarForm: [
				{ sentence: "わたしは まいあさ バス ( ) がっこうへ いきます。", choices: ["を", "に", "が", "で"], answer: 3, explanation: "で marks the means of transport." },
				{ sentence: "ここに なまえを ( ) ください。", choices: ["かく", "かいて", "かいた", "かかない"], answer: 1, explanation: "て-form + ください = request." },
			],
			sentenceOrder: [
				{ pre: "わたしは ", parts: ["ともだちと", "えいがを", "みに", "いきました"], post: "。", star: 3 },
			],
			textGrammar: {
				title: "せんしゅうの にちようび",
				text: "せんしゅうの にちようび、わたしは ともだち (1) こうえんへ いきました。そこで おべんとうを たべました。とても たのしかった (2)、また いきたいです。",
				questions: [
					{ choices: ["を", "と", "が", "の"], answer: 1 },
					{ choices: ["ので", "のに", "でも", "から"], answer: 0 },
				],
			},
			reading: [
				{
					kind: "short",
					title: "メモ",
					text: "田中さんへ\nあしたは わたしは かいしゃを やすみます。かいぎは らいしゅうの 月曜日に します。\nミラー",
					questions: [{ question: "かいぎは いつですか。", choices: ["あした", "らいしゅうの 月曜日", "きょう", "らいしゅうの 火曜日"], answer: 1 }],
				},
				{
					kind: "info",
					title: "おしらせ",
					text: "【にほんご きょうしつ】\n月・水・金　10:00〜12:00\n１かい 二千円（はじめての ひとは 五百円）\nやすみ：日曜日",
					questions: [{ question: "はじめて この きょうしつに いく ひとは いくら はらいますか。", choices: ["二千円", "千五百円", "五百円", "０円"], answer: 2 }],
				},
			],
		},
		listening: {
			lisQuick: [
				{ utterance: "おげんきですか。", choices: ["はい、どうぞ。", "いいえ、ちがいます。", "はい、げんきです。"], answer: 2 },
				{ utterance: "すみません、でんわを かして ください。", choices: ["はい、どうぞ。", "いいえ、かしました。", "はい、かりました。"], answer: 0 },
			],
			lisUtterance: [
				{ situation: "ごはんを たべる まえに、なんと いいますか。", choices: ["ごちそうさま。", "おやすみなさい。", "いただきます。"], answer: 2 },
			],
			lisPoint: [
				{
					script: "F:あした なん時に あいますか。／M:三時は どうですか。／F:三時は ちょっと…。四時に しましょう。／M:はい、わかりました。",
					question: "ふたりは なん時に あいますか。",
					choices: ["三時", "二時", "五時", "四時"],
					answer: 3,
				},
			],
		},
	},
};
