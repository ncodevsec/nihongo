// Verb conjugation practice — common verbs across all three groups
// (Godan/u-verbs, Ichidan/ru-verbs, and the two irregulars する/くる),
// each given as its ます (masu) form alongside the dictionary, て, た,
// and ない forms derived from it. This is a fixed reference set (not
// level-specific) since conjugation itself is the same grammar
// regardless of which level's vocabulary happens to use it.
export const VERB_TRANSFORMATIONS = [
	// Group 1 — Godan (u-verbs)
	{ id: "v-kaku", masu: "かきます", dictionary: "かく", te: "かいて", ta: "かいた", nai: "かかない", meaningBn: "লেখা" },
	{ id: "v-yomu", masu: "よみます", dictionary: "よむ", te: "よんで", ta: "よんだ", nai: "よまない", meaningBn: "পড়া" },
	{ id: "v-hanasu", masu: "はなします", dictionary: "はなす", te: "はなして", ta: "はなした", nai: "はなさない", meaningBn: "কথা বলা" },
	{ id: "v-matsu", masu: "まちます", dictionary: "まつ", te: "まって", ta: "まった", nai: "またない", meaningBn: "অপেক্ষা করা" },
	{ id: "v-kaeru", masu: "かえります", dictionary: "かえる", te: "かえって", ta: "かえった", nai: "かえらない", meaningBn: "ফিরে যাওয়া" },
	{ id: "v-asobu", masu: "あそびます", dictionary: "あそぶ", te: "あそんで", ta: "あそんだ", nai: "あそばない", meaningBn: "খেলা" },
	{ id: "v-iku", masu: "いきます", dictionary: "いく", te: "いって", ta: "いった", nai: "いかない", meaningBn: "যাওয়া" },
	{ id: "v-nomu", masu: "のみます", dictionary: "のむ", te: "のんで", ta: "のんだ", nai: "のまない", meaningBn: "পান করা" },
	{ id: "v-kau", masu: "かいます", dictionary: "かう", te: "かって", ta: "かった", nai: "かわない", meaningBn: "কেনা" },
	// Group 2 — Ichidan (ru-verbs)
	{ id: "v-taberu", masu: "たべます", dictionary: "たべる", te: "たべて", ta: "たべた", nai: "たべない", meaningBn: "খাওয়া" },
	{ id: "v-miru", masu: "みます", dictionary: "みる", te: "みて", ta: "みた", nai: "みない", meaningBn: "দেখা" },
	{ id: "v-okiru", masu: "おきます", dictionary: "おきる", te: "おきて", ta: "おきた", nai: "おきない", meaningBn: "ঘুম থেকে ওঠা" },
	{ id: "v-neru", masu: "ねます", dictionary: "ねる", te: "ねて", ta: "ねた", nai: "ねない", meaningBn: "ঘুমানো" },
	{ id: "v-oshieru", masu: "おしえます", dictionary: "おしえる", te: "おしえて", ta: "おしえた", nai: "おしえない", meaningBn: "শেখানো" },
	// Group 3 — Irregular
	{ id: "v-suru", masu: "します", dictionary: "する", te: "して", ta: "した", nai: "しない", meaningBn: "করা" },
	{ id: "v-kuru", masu: "きます", dictionary: "くる", te: "きて", ta: "きた", nai: "こない", meaningBn: "আসা" },
];

// Adjective conjugation practice — い-adjectives and な-adjectives paired
// with their past, negative, and past-negative forms.
export const ADJECTIVE_TRANSFORMATIONS = [
	// い-Adjectives
	{ id: "a-atsui", type: "i", base: "あつい", past: "あつかった", negative: "あつくない", pastNegative: "あつくなかった", meaningBn: "গরম" },
	{ id: "a-samui", type: "i", base: "さむい", past: "さむかった", negative: "さむくない", pastNegative: "さむくなかった", meaningBn: "ঠান্ডা" },
	{ id: "a-takai", type: "i", base: "たかい", past: "たかかった", negative: "たかくない", pastNegative: "たかくなかった", meaningBn: "উঁচু/দামি" },
	{ id: "a-yasui", type: "i", base: "やすい", past: "やすかった", negative: "やすくない", pastNegative: "やすくなかった", meaningBn: "সস্তা" },
	{ id: "a-muzukashii", type: "i", base: "むずかしい", past: "むずかしかった", negative: "むずかしくない", pastNegative: "むずかしくなかった", meaningBn: "কঠিন" },
	{ id: "a-ii", type: "i", base: "いい", past: "よかった", negative: "よくない", pastNegative: "よくなかった", meaningBn: "ভালো" },
	{ id: "a-omoshiroi", type: "i", base: "おもしろい", past: "おもしろかった", negative: "おもしろくない", pastNegative: "おもしろくなかった", meaningBn: "মজার" },
	// な-Adjectives
	{ id: "a-shizukana", type: "na", base: "しずかな", past: "しずかだった", negative: "しずかじゃない", pastNegative: "しずかじゃなかった", meaningBn: "শান্ত" },
	{ id: "a-yuumeina", type: "na", base: "ゆうめいな", past: "ゆうめいだった", negative: "ゆうめいじゃない", pastNegative: "ゆうめいじゃなかった", meaningBn: "বিখ্যাত" },
	{ id: "a-kireina", type: "na", base: "きれいな", past: "きれいだった", negative: "きれいじゃない", pastNegative: "きれいじゃなかった", meaningBn: "সুন্দর/পরিষ্কার" },
	{ id: "a-benrina", type: "na", base: "べんりな", past: "べんりだった", negative: "べんりじゃない", pastNegative: "べんりじゃなかった", meaningBn: "সুবিধাজনক" },
];
