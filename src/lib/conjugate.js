// Algorithmic verb/adjective conjugation. Rather than a separately
// maintained list, the Grammar "By Transformation" feature derives its
// full set directly from the app's own vocab data (see
// buildTransformationRows in grammarUtils.js) — so "all verbs" and "all
// adjectives" always matches whatever's actually in vocab/n5.js and
// vocab/n4.js, and stays in sync automatically if that data changes.

// い-row-ending stems (き/ぎ/し/ち/に/ひ/び/み/り/じ) are overwhelmingly
// Godan in real vocabulary (書きます→書く, 飲みます→飲む, 帰ります→帰る,
// 呼びます→呼ぶ...) — Ichidan verbs sharing this exact shape (借りる,
// 起きる, 見る) are the much smaller, closed set, so unlike え-row stems
// below, this defaults to Godan and lists the Ichidan exceptions instead.
const ICHIDAN_EXCEPTIONS_FOR_I_ROW = new Set([
  "おきます", // 起きます (起きる)
  "みます", // 見ます (見る)
  "かります", // 借ります (借りる)
  "しんじます", // 信じます (信じる)
  "おります", // 降ります (降りる) — more common in this vocab than 居る
  "できます", // できます (できる)
  "たります", // 足ります (足りる)
  "あびます", // 浴びます (浴びる)
  "のびます", // 伸びます (伸びる)
  "おちます", // 落ちます (落ちる)
  "とじます", // 閉じます (閉じる)
  "すぎます", // 過ぎます (過ぎる)
  "ぞんじます", // 存じます (存じる, humble)
]);

// え-row-ending stems are overwhelmingly Ichidan (食べる, 見せる, 教える,
// 掛ける...) — the reverse situation from い-row above — so this keeps
// the default as Ichidan and lists the (much rarer) Godan exceptions,
// like 減る (へる) if it appears in vocab.
const GODAN_EXCEPTIONS_FOR_E_ROW = new Set([
  "へります", // 減ります (減る)
]);

// あります is Godan but has a genuinely irregular negative (ない, not
// あらない) — the one true irregular exception among otherwise-regular
// Godan verbs in this vocabulary. Also included in the lookalike set
// below since its stem ("あり") ends in り, the same ambiguous shape.
const IRREGULAR_NAI_OVERRIDES = {
  あります: "ない",
};

// A handful of "special Godan" honorific verbs (特殊五段動詞) whose
// ます-stem ends in い instead of the り a normal Godan る-verb would
// have (いらっしゃる → いらっしゃいます, not いらっしゃります), but which
// still take Godan-style って/った endings and an irregular らない
// negative — small enough, and irregular enough, to just hardcode.
const SPECIAL_HONORIFIC_VERBS = {
  いらっしゃいます: { dictionary: "いらっしゃる", te: "いらっしゃって", ta: "いらっしゃった", nai: "いらっしゃらない" },
  おっしゃいます: { dictionary: "おっしゃる", te: "おっしゃって", ta: "おっしゃった", nai: "おっしゃらない" },
  くださいます: { dictionary: "くださる", te: "くださって", ta: "くださった", nai: "くださらない" },
  なさいます: { dictionary: "なさる", te: "なさって", ta: "なさった", nai: "なさらない" },
  ございます: { dictionary: "ござる", te: "ございまして", ta: "ございました", nai: "ございません" },
  めしあがります: { dictionary: "めしあがる", te: "めしあがって", ta: "めしあがった", nai: "めしあがらない" },
  ごらんになります: { dictionary: "ごらんになる", te: "ごらんになって", ta: "ごらんになった", nai: "ごらんにならない" },
};

// する-compounds (noun/adverb + します, e.g. 勉強します → 勉強する) are
// structurally identical in ます-form to ordinary Godan す-verbs (話す →
// 話します) — both simply end in "…します". There's no way to tell them
// apart from shape alone, so known する-compound stems (the part before
// します) are listed explicitly here; anything else ending in します
// defaults to being treated as a plain Godan す-verb instead, which is
// the safer default (an incorrectly-godan-conjugated true する-compound
// would look obviously wrong, but so would the reverse — this list is
// built directly from this project's own vocab data).
const KNOWN_SURU_STEMS = new Set([
  "べんきょう", "けっこん", "かいもの", "しょくじ", "さんぽ", "けんがく",
  "けんきゅう", "しんぱい", "ざんぎょう", "しゅっちょう", "うんてん", "よやく",
  "そうじ", "せんたく", "れんしゅう", "ひっこし", "しょうかい", "あんない",
  "せつめい", "れんらく", "さんか", "しつもん", "ちゅうい", "けんか",
  "びっくり", "がっかり", "あんしん", "りこん", "せいようか", "しゅっぱつ",
  "とうちゃく", "そうだん", "けいさん", "ちょうせつ", "ろくおん", "りよう",
  "にゅういん", "たいいん", "せいり", "きゅうけい", "うんどう", "せいこう",
  "よしゅう", "ふくしゅう", "ゆしゅつ", "ゆにゅう", "ほんやく", "はつめい",
  "はっけん", "にゅうりょく", "ちょきん", "しょうたい", "むりを", "なかよく",
  "そのままに", "せわを", "しつれい", "おねがい", "コピー", "メモ", "クリック",
  "リサイクル", "キャンセル", "しんせつに", "はいけん", "ようい", "りゅうがく",
]);


function isVowelRowChar(ch, row) {
  return row.includes(ch);
}

const I_ROW = "いきしちにひみりぎじびぴ";
const E_ROW = "えけせてねへめれげぜでべぺ";

// JLPT-textbook verb grouping (グループ1/2/3), for the Transform tab's Verb
// group filter — a simpler, teaching-oriented classification than
// classifyVerbGroup above, given directly by the app's owner:
//   Group 1: ます-stem ends in an い-row character (書きます, 買います…)
//   Group 2: ます-stem ends in an え-row character (食べます, 見せます…),
//            PLUS a fixed list of い-row-ending verbs taught as Group 2
//            exceptions (かります, たります, おります, あびます, できます,
//            おきます, きます [着ます, "wear"], います, みます).
//   Group 3: irregular — します (and other 〜します verbs) and きます
//            (来ます, "come").
// きます is ambiguous in kana alone (来ます "come" vs 着ます "wear"); this
// vocab only ever surfaces one きます entry (来ます), so the Group 3 check
// below is tried first and takes it — the Group 2 exception entry is kept
// for completeness in case a distinguishable 着ます is ever added.
const JLPT_GROUP2_I_ROW_EXCEPTIONS = new Set([
  "かります",
  "たります",
  "おります",
  "あびます",
  "できます",
  "おきます",
  "きます",
  "います",
  "みます",
]);

export function classifyJlptVerbGroup(masu) {
  if (!masu.endsWith("ます")) return null;
  if (masu === "きます") return "group3"; // 来ます (kuru)
  if (masu.endsWith("します")) {
    const stem = masu.slice(0, -3); // strip します
    if (KNOWN_SURU_STEMS.has(stem)) return "group3"; // real する-compound
    // otherwise falls through: an ordinary Godan す-verb (話します → 話す)
  }
  const stem = masu.slice(0, -2);
  if (!stem) return null;
  const last = stem[stem.length - 1];
  if (JLPT_GROUP2_I_ROW_EXCEPTIONS.has(masu)) return "group2";
  if (isVowelRowChar(last, I_ROW)) return "group1";
  if (isVowelRowChar(last, E_ROW)) return "group2";
  return "group1"; // あ/う/お-row stem endings are unambiguously Group 1
}

// Classifies a ます-form verb's group. Returns null if it doesn't look
// like a conjugatable verb at all (used to skip non-verb entries safely).
export function classifyVerbGroup(masu) {
  if (!masu.endsWith("ます")) return null;
  if (SPECIAL_HONORIFIC_VERBS[masu]) return "special-honorific";
  if (masu === "きます" || masu === "来ます") return "irregular-kuru";
  if (masu === "します") return "irregular-suru";
  if (masu.endsWith("します")) {
    const stem = masu.slice(0, -3); // strip します
    return KNOWN_SURU_STEMS.has(stem) ? "irregular-suru" : "godan";
  }

  const stem = masu.slice(0, -2); // strip ます
  if (!stem) return null;
  const last = stem[stem.length - 1];

  // Stems ending in い are a special case: this shape is overwhelmingly
  // Godan う-verbs (買う→かいます, 違う→ちがいます, 洗う→あらいます, etc.)
  // — there's no genuine Ichidan いる-verb in this project's vocab data —
  // so unlike the other い-row endings below, this has no exception list.
  if (last === "い") return "godan";

  if (isVowelRowChar(last, I_ROW)) {
    return ICHIDAN_EXCEPTIONS_FOR_I_ROW.has(masu) ? "ichidan" : "godan";
  }
  if (isVowelRowChar(last, E_ROW)) {
    return GODAN_EXCEPTIONS_FOR_E_ROW.has(masu) ? "godan" : "ichidan";
  }
  return "godan"; // stem ends in an あ/う/お-row mora — unambiguously Godan
}

const GODAN_TE_TA_MAP = {
  き: ["いて", "いた"],
  ぎ: ["いで", "いだ"],
  し: ["して", "した"],
  ち: ["って", "った"],
  に: ["んで", "んだ"],
  び: ["んで", "んだ"],
  み: ["んで", "んだ"],
  り: ["って", "った"],
  い: ["って", "った"],
  じ: ["いで", "いだ"], // essentially nonexistent in standard Japanese, kept for completeness
};

// あ-row equivalent of each い-row mora, for the ない-form (…わ/か/が/さ/
// た/な/ば/ま/ら + ない). う-ending verbs take わ, not あ, to avoke an
// impossible "あない" ending.
const I_TO_A_ROW = {
  き: "か", ぎ: "が", し: "さ", ち: "た", に: "な",
  び: "ば", み: "ま", り: "ら", い: "わ", じ: "ざ",
};

// い-row → う-row, for the Godan dictionary form.
const I_TO_U_ROW = {
  き: "く", ぎ: "ぐ", し: "す", ち: "つ", に: "ぬ",
  び: "ぶ", み: "む", り: "る", い: "う", じ: "ず",
};

export function conjugateVerb(masu) {
  const group = classifyVerbGroup(masu);
  if (!group) return null;

  if (group === "special-honorific") {
    return SPECIAL_HONORIFIC_VERBS[masu];
  }
  if (group === "irregular-suru") {
    const prefix = masu.slice(0, -3); // strip します (3 chars: し/ま/す)
    return {
      dictionary: `${prefix}する`,
      te: `${prefix}して`,
      ta: `${prefix}した`,
      nai: `${prefix}しない`,
    };
  }
  if (group === "irregular-kuru") {
    return { dictionary: "くる", te: "きて", ta: "きた", nai: "こない" };
  }

  const stem = masu.slice(0, -2);
  const naiOverride = IRREGULAR_NAI_OVERRIDES[masu];

  if (group === "ichidan") {
    return {
      dictionary: `${stem}る`,
      te: `${stem}て`,
      ta: `${stem}た`,
      nai: naiOverride || `${stem}ない`,
    };
  }

  // Godan
  const base = stem.slice(0, -1);
  const lastKana = stem[stem.length - 1];
  const [teSuffix, taSuffix] = GODAN_TE_TA_MAP[lastKana] || ["って", "った"];
  const uRow = I_TO_U_ROW[lastKana] || "る";
  const aRow = I_TO_A_ROW[lastKana] || "ら";
  return {
    dictionary: `${base}${uRow}`,
    te: `${base}${teSuffix}`,
    ta: `${base}${taSuffix}`,
    nai: naiOverride || `${base}${aRow}ない`,
  };
}

// い-Adjective: base ends in い (e.g. あつい). Past/negative/past-negative
// all derive from dropping the final い. いい (good) is irregular — every
// form is built from よ instead — and that includes phrases where いい
// is clearly acting as its own word (頭がいい, ちょうどいい, かっこいい,
// from 格好＋いい), not just the bare word itself. かわいい is the one
// common exception: despite ending in the same two characters, it has no
// relation to いい and conjugates completely normally (かわいかった, not
// かわよかった).
const REGULAR_II_ENDING_EXCEPTIONS = ["かわいい"];

export function conjugateIAdjective(base) {
  if (!base.endsWith("い")) return null;
  const isIrregularIi =
    base.endsWith("いい") &&
    !REGULAR_II_ENDING_EXCEPTIONS.some((w) => base.endsWith(w));
  if (isIrregularIi) {
    const prefix = base.slice(0, -2);
    return {
      past: `${prefix}よかった`,
      negative: `${prefix}よくない`,
      pastNegative: `${prefix}よくなかった`,
    };
  }
  const stem = base.slice(0, -1);
  return {
    past: `${stem}かった`,
    negative: `${stem}くない`,
    pastNegative: `${stem}くなかった`,
  };
}

// な-Adjective: base is given with the ［な］/[な] marker still attached
// (e.g. "きれい［な］") — this strips it before conjugating.
export function conjugateNaAdjective(rawBase) {
  const base = rawBase.replace(/[［[]な[］\]]/g, "");
  if (!base) return null;
  return {
    past: `${base}だった`,
    // Main answer is the polite ～じゃありません; the other two ways to say
    // it (formal ～ではありません and casual ～じゃない) are kept as
    // `alternates` and shown in small text under it.
    negative: `${base}じゃありません`,
    pastNegative: `${base}じゃなかった`,
    alternates: {
      negative: [`${base}ではありません`, `${base}じゃない`],
    },
  };
}
