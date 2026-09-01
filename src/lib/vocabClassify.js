// Lightweight, dependency-free classifiers for vocabulary words. These are
// study aids, not linguistic authorities — the rules below are built from
// direct inspection of the actual word lists (not guesswork), specifically
// to avoid known false positives (e.g. 自分/多分/半分 end in 分 but are not
// "minute" words, so suffix-guessing on bare kanji is avoided in favor of
// curated word lists and a small, unambiguous set of tilde-counter forms).

// ---------------------------------------------------------------------
// Part of speech: Noun / Verb / い-Adjective / な-Adjective
// ---------------------------------------------------------------------

// な-adjectives are marked in the source data with a bracketed な right
// after the word (full-width in the N5 file, half-width in the N4 file),
// e.g. きれい［な］, 心配[な] — this is a reliable, explicit marker.
function isNaAdjective(w) {
  return w.includes("［な］") || w.includes("[な]");
}

// い-ending words in this word list that are NOT い-adjectives (common
// adverbs/nouns that happen to end in い).
const NON_ADJECTIVE_I_EXCEPTIONS = new Set([
  "はい", "いいえ", "だいたい", "たいてい", "せい", "きゅうり",
]);

// Curated list of actual adverbs present in this word list — verified
// against the real data rather than guessed from a suffix pattern, since
// Japanese adverbs have no single reliable ending. Conjunctions (しかし,
// でも, それから) and particles (だけ, など) are deliberately excluded —
// they're a different part of speech even though they sit near adverbs.
const ADVERB_WORDS = new Set([
  "よく", "たくさん", "だいたい", "すこし", "あまり", "ぜんぜん", "とても",
  "いつも", "ときどき", "たぶん", "もちろん", "ぜひ", "どうぞ", "どうも",
  "なかなか", "もう", "まだ", "すぐ", "ちょっと", "きっと", "ずっと",
  "だんだん", "はじめて", "いちばん", "ほんとうに", "いろいろ", "だいじょうぶ",
  "ぐらい", "くらい", "いっしょに", "いつか", "どうして", "やっと", "たいてい",
  "なぜ", "ほとんど", "とくに", "まず", "つぎに", "たいへん", "いくら",
  "いくつ", "どのくらい", "ゆっくり", "これから", "たまに", "できるだけ",
  "はっきり", "かなり", "ぜったいに", "さっき",
]);

export function classifyPartOfSpeech(item) {
  const w = item.kanji || "";
  if (ADVERB_WORDS.has(w)) return "adverb";
  if (isNaAdjective(w)) return "adjective-na";
  if (/ます$/.test(w)) return "verb";
  if (/い$/.test(w) && !NON_ADJECTIVE_I_EXCEPTIONS.has(w)) return "adjective-i";
  return "noun";
}

export const POS_CATEGORIES = [
  { key: "noun", bn: "বিশেষ্য (Noun)", en: "Nouns" },
  { key: "verb", bn: "ক্রিয়া (Verb)", en: "Verbs" },
  { key: "adjective-i", bn: "い-বিশেষণ", en: "い-Adjectives" },
  { key: "adjective-na", bn: "な-বিশেষণ", en: "な-Adjectives" },
  { key: "adverb", bn: "ক্রিয়া বিশেষণ (Adverb)", en: "Adverbs" },
];

// ---------------------------------------------------------------------
// Counting: Quantity / Number / Day / Month / Year / Week / Weekday /
// Hour / Minute / Things — kept entirely separate from part-of-speech.
// ---------------------------------------------------------------------

// A few words are genuinely ambiguous by kanji alone (same spelling, two
// different readings, two different buckets) — these are resolved by
// checking the reading explicitly, before any of the generic checks run.
function classifySpecialCase(w, reading) {
  if (w === "十") {
    if (reading === "じゅう") return "numeral"; // pure number: ten
    if (reading === "とお") return "quantity"; // つ-counter: ten (things)
  }
  if (w === "～人" || w === "~人") {
    // にん = genuine people-counter ("things"); じん = nationality suffix
    // ("a national of ~"), which isn't really a counting word at all.
    return reading === "にん" ? "things" : null;
  }
  return undefined; // not a special case — fall through to normal checks
}

// "Quantity" — the つ-counter series for counting generic objects (this
// was previously labeled "Number", which was confusing once a dedicated
// pure-numeral category was added — see NUMERAL_WORDS below).
const QUANTITY_WORDS = new Set([
  "一つ", "二つ", "三つ", "四つ", "五つ", "六つ", "七つ", "八つ", "九つ",
  "いくつ", "いくら", "半分",
]);

// "Number" — pure numerals (kanji + reading both checked, since e.g. 十
// alone is ambiguous between "じゅう" (numeral ten) and "とお" (quantity
// ten) — see classifySpecialCase above for that one).
const NUMERAL_WORDS = new Set([
  "一|いち", "二|に", "三|さん", "四|よん", "五|ご", "六|ろく", "七|なな", "八|はち", "九|きゅう",
  "二十|にじゅう", "三十|さんじゅう", "四十|よんじゅう", "五十|ごじゅう", "六十|ろくじゅう",
  "七十|ななじゅう", "八十|はちじゅう", "九十|きゅうじゅう",
  "百|ひゃく", "二百|にひゃく", "三百|さんびゃく", "四百|よんひゃく", "五百|ごひゃく",
  "六百|ろっぴゃく", "七百|ななひゃく", "八百|はっぴゃく", "九百|きゅうひゃく",
  "千|せん", "二千|にせん", "三千|さんぜん", "四千|よんせん", "五千|ごせん",
  "六千|ろくせん", "七千|ななせん", "八千|はっせん", "九千|きゅうせん",
  "万|まん", "億|おく",
]);

const DAY_WORDS = new Set([
  "今日", "明日", "明後日", "昨日", "一昨日", "あさって", "おととい", "毎日", "何日", "誕生日",
  "一日", "二日", "三日", "四日", "五日", "六日", "七日", "八日", "九日", "十日",
  "十四日", "二十日", "二十四日",
]);

const MONTH_WORDS = new Set([
  "今月", "来月", "先月", "再来月", "さ来月", "毎月", "何月",
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
]);

const YEAR_WORDS = new Set([
  "今年", "来年", "去年", "再来年", "一昨年", "さ来年", "毎年", "半年",
]);

const WEEK_WORDS = new Set([
  "今週", "来週", "先週", "再来週", "先々週", "毎週", "何週間",
  "一週間", "二週間", "三週間", "四週間", "五週間",
  "六週間", "七週間", "八週間", "九週間", "十週間",
]);

const WEEKDAY_WORDS = new Set([
  "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日", "何曜日",
]);

const HOUR_WORDS = new Set([
  "何時", "時間",
  "一時", "二時", "三時", "四時", "五時", "六時",
  "七時", "八時", "九時", "十時", "十一時", "十二時",
]);

const MINUTE_WORDS = new Set([
  "何分",
  "一分", "二分", "三分", "四分", "五分", "六分", "七分", "八分", "九分", "十分",
]);

// Words with no counter placeholder character at all in the source data
// (written with a literal leading number instead of ～/ー), but that are
// still meant as a generic "this is the counter" vocabulary entry.
const EXACT_THINGS_WORDS = new Set(["一冊"]);

// For tilde-prefixed counter forms, only the bare suffix after the
// placeholder is checked against this map. Two placeholder conventions
// appear in the source data: "～" (most entries) and "ー" (a couple of
// N4 entries, e.g. "ー本"/"ー杯") — both are treated the same way.
const TILDE_SUFFIX_MAP = {
  "時": "hour",
  "時間": "hour",
  "分": "minute",
  "月": "month",
  "か月": "month",
  "日": "day",
  "年": "year",
  "週間": "week",
  "人": "things",
  "歳": "things",
  "階": "things",
  "円": "things",
  "番線": "things",
  "番": "things",
  "段目": "things",
  "台": "things",
  "枚": "things",
  "回": "things",
  "メートル": "things",
  "本": "things",
  "杯": "things",
  "匹": "things",
  "軒": "things",
  "足": "things",
  "着": "things",
  "冊": "things",
};

// Returns one of "numeral"|"quantity"|"day"|"month"|"year"|"week"|
// "weekday"|"hour"|"minute"|"things", or null if the word isn't a
// counting-type word.
export function classifyCounting(item) {
  const w = item.kanji || "";
  const reading = item.reading || "";

  const special = classifySpecialCase(w, reading);
  if (special !== undefined) return special;

  const combo = `${w}|${reading}`;
  if (NUMERAL_WORDS.has(combo)) return "numeral";

  if (DAY_WORDS.has(w)) return "day";
  if (MONTH_WORDS.has(w)) return "month";
  if (YEAR_WORDS.has(w)) return "year";
  if (WEEK_WORDS.has(w)) return "week";
  if (WEEKDAY_WORDS.has(w)) return "weekday";
  if (HOUR_WORDS.has(w)) return "hour";
  if (MINUTE_WORDS.has(w)) return "minute";
  if (QUANTITY_WORDS.has(w)) return "quantity";
  if (EXACT_THINGS_WORDS.has(w)) return "things";

  if (w.startsWith("～") || w.startsWith("~") || w.startsWith("ー")) {
    const bare = w.slice(1);
    return TILDE_SUFFIX_MAP[bare] || null;
  }
  return null;
}

export const COUNTING_CATEGORIES = [
  { key: "numeral", bn: "সংখ্যা", en: "Numbers" },
  { key: "quantity", bn: "পরিমাণ", en: "Quantity" },
  { key: "day", bn: "দিন/তারিখ", en: "Day / Date" },
  { key: "month", bn: "মাস", en: "Month" },
  { key: "year", bn: "বছর", en: "Year" },
  { key: "week", bn: "সপ্তাহ", en: "Week" },
  { key: "weekday", bn: "সপ্তাহের দিন", en: "Weekday" },
  { key: "hour", bn: "ঘণ্টা", en: "Hour" },
  { key: "minute", bn: "মিনিট", en: "Minute" },
  { key: "things", bn: "জিনিসপত্র ও অন্যান্য গণনা", en: "Things (counters)" },
];
