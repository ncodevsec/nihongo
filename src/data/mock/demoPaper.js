// Demo question paper for the "AI papers" feature (downloadable from the Mock
// Test tab). It shows every question type once or twice — a real paper should
// follow the counts in the prompt. Answers are 0-based indexes into `choices`;
// the app shuffles the choices itself, so the correct one may sit anywhere.
export const DEMO_PAPER = {
	format: "nihongo-mock-paper/2",
	title: "N5 Demo Paper",
	level: "n5",
	author: "demo",
	notes: "Demo file — shows the structure only. Counts here are small on purpose. kanjiReading / orthography use the real-exam pattern: a sentence with the underlined target word inside it.",
	sections: {
		vocab: {
			// もんだい1: one sentence, the target word in kanji (the app underlines it); choices = hiragana readings.
			kanjiReading: [
				{ sentence: "リーさんの 前に いる ひとが たなかさんです。", target: "前", choices: ["まえ", "よこ", "となり", "うしろ"], answer: 0, explanation: "前 = まえ (front)" },
				{ sentence: "あした 学校を やすみます。", target: "学校", choices: ["がくこう", "がっこう", "がっこ", "かっこう"], answer: 1, explanation: "学校 = がっこう (school)" },
				{ sentence: "きのうは 雨が ふって いました。", target: "雨", choices: ["ゆき", "くも", "あめ", "かぜ"], answer: 2, explanation: "雨 = あめ (rain)" },
			],
			// もんだい2: one sentence, the target word in hiragana (underlined); choices = kanji spellings.
			orthography: [
				{ sentence: "はなの しゃしんを もらいました。", target: "はな", choices: ["花", "川", "山", "空"], answer: 0, explanation: "はな = 花 (flower)" },
				{ sentence: "しんぶんを よみます。", target: "しんぶん", choices: ["親聞", "新分", "新聞", "親分"], answer: 2, explanation: "しんぶん = 新聞 (newspaper)" },
				{ sentence: "この ほんは ごひゃくえんです。", target: "ごひゃくえん", choices: ["五千円", "六百円", "五万円", "五百円"], answer: 3 },
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
