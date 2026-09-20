// Radical (部首) grouping for the Kanji module — a second way to
// categorize kanji next to the textbook lessons in kanji-categories.js.
//
// Radicals follow the traditional Kangxi numbering as used by KANJIDIC2
// (each kanji's "classical" radical), so the grouping matches what a kanji
// dictionary lists the character under, e.g. 休 -> 人 (亻), 時 -> 日, 語 -> 言.
// Ordered by Kangxi number, which is the standard order in kanji
// dictionaries (roughly by stroke count of the radical).
//
// `ch` is the Kangxi radical; `alt` is the common shortened form it takes
// when it sits inside a kanji (亻, 氵, 扌 ...). Only radicals that at
// least one N5/N4 base kanji actually belongs to are listed.
//
// Jukugo (two-kanji compounds) have no single radical, so they keep their
// own "Jukugo" category here, mirroring the lesson grouping.
import { JUKUGO_CATEGORY } from "./kanji-categories.js";

const RADICALS = [
  { n: 1, ch: "一", alt: "", en: "One", bn: "এক", kanji: "一三七万上下" },
  { n: 2, ch: "丨", alt: "", en: "Vertical line", bn: "খাড়া দাগ", kanji: "中" },
  { n: 3, ch: "丶", alt: "", en: "Dot", bn: "ফোঁটা", kanji: "主" },
  { n: 4, ch: "丿", alt: "", en: "Slash", bn: "তির্যক দাগ", kanji: "乗" },
  { n: 5, ch: "乙", alt: "", en: "Hook", bn: "বাঁকা হুক", kanji: "九" },
  { n: 7, ch: "二", alt: "", en: "Two", bn: "দুই", kanji: "二五" },
  { n: 9, ch: "人", alt: "亻", en: "Person", bn: "মানুষ", kanji: "人何休今会倍供側低便借使働" },
  { n: 10, ch: "儿", alt: "", en: "Legs", bn: "মানুষের পা", kanji: "先光兄" },
  { n: 11, ch: "入", alt: "", en: "Enter", bn: "প্রবেশ", kanji: "入" },
  { n: 12, ch: "八", alt: "", en: "Eight", bn: "আট", kanji: "六八具" },
  { n: 13, ch: "冂", alt: "", en: "Borders", bn: "সীমানা", kanji: "円" },
  { n: 15, ch: "冫", alt: "", en: "Ice", bn: "বরফ", kanji: "冷" },
  { n: 17, ch: "凵", alt: "", en: "Open box", bn: "খোলা বাক্স", kanji: "出" },
  { n: 18, ch: "刀", alt: "刂", en: "Knife", bn: "ছুরি", kanji: "分前別券" },
  { n: 19, ch: "力", alt: "", en: "Power", bn: "শক্তি", kanji: "力動" },
  { n: 21, ch: "匕", alt: "", en: "Spoon", bn: "চামচ", kanji: "北化" },
  { n: 23, ch: "匸", alt: "", en: "Hiding enclosure", bn: "লুকানোর বেষ্টনী", kanji: "医" },
  { n: 24, ch: "十", alt: "", en: "Ten", bn: "দশ", kanji: "十千半南午" },
  { n: 26, ch: "卩", alt: "", en: "Seal", bn: "সিলমোহর", kanji: "危" },
  { n: 29, ch: "又", alt: "", en: "Right hand", bn: "ডান হাত", kanji: "友反" },
  { n: 30, ch: "口", alt: "", en: "Mouth", bn: "মুখ", kanji: "口右名古員合品号味" },
  { n: 31, ch: "囗", alt: "", en: "Enclosure", bn: "ঘেরা জায়গা", kanji: "四国回困図" },
  { n: 32, ch: "土", alt: "", en: "Earth", bn: "মাটি", kanji: "土場" },
  { n: 34, ch: "夂", alt: "", en: "Go slowly", bn: "ধীরে চলা", kanji: "変" },
  { n: 36, ch: "夕", alt: "", en: "Evening", bn: "সন্ধ্যা", kanji: "外多" },
  { n: 37, ch: "大", alt: "", en: "Big", bn: "বড়", kanji: "天大央太" },
  { n: 38, ch: "女", alt: "", en: "Woman", bn: "নারী", kanji: "女姉妹始" },
  { n: 39, ch: "子", alt: "", en: "Child", bn: "শিশু", kanji: "子学" },
  { n: 40, ch: "宀", alt: "", en: "Roof", bn: "ছাদ", kanji: "安寝室" },
  { n: 41, ch: "寸", alt: "", en: "Inch", bn: "ইঞ্চি", kanji: "対" },
  { n: 42, ch: "小", alt: "", en: "Small", bn: "ছোট", kanji: "小少" },
  { n: 44, ch: "尸", alt: "", en: "Corpse", bn: "দেহ", kanji: "屋局" },
  { n: 46, ch: "山", alt: "", en: "Mountain", bn: "পাহাড়", kanji: "山島岸" },
  { n: 47, ch: "川", alt: "", en: "River", bn: "নদী", kanji: "川" },
  { n: 48, ch: "工", alt: "", en: "Work", bn: "কাজ", kanji: "左工" },
  { n: 50, ch: "巾", alt: "", en: "Cloth", bn: "কাপড়", kanji: "帰席" },
  { n: 51, ch: "干", alt: "", en: "Dry", bn: "শুকনো", kanji: "年" },
  { n: 53, ch: "广", alt: "", en: "Building", bn: "ঘর", kanji: "店度広" },
  { n: 54, ch: "廴", alt: "", en: "Long stride", bn: "দীর্ঘ পদক্ষেপ", kanji: "建" },
  { n: 57, ch: "弓", alt: "", en: "Bow", bn: "ধনুক", kanji: "弟強弱" },
  { n: 60, ch: "彳", alt: "", en: "Step", bn: "পদক্ষেপ", kanji: "後待" },
  { n: 61, ch: "心", alt: "忄", en: "Heart", bn: "হৃদয়", kanji: "忙忘怒心意" },
  { n: 64, ch: "手", alt: "扌", en: "Hand", bn: "হাত", kanji: "手持" },
  { n: 66, ch: "攴", alt: "攵", en: "Strike", bn: "আঘাত", kanji: "教" },
  { n: 69, ch: "斤", alt: "", en: "Axe", bn: "কুঠার", kanji: "新" },
  { n: 70, ch: "方", alt: "", en: "Direction", bn: "দিক", kanji: "族旅" },
  { n: 72, ch: "日", alt: "", en: "Sun", bn: "সূর্য", kanji: "日早時星曇晴昔曜昨暗明暖易映" },
  { n: 73, ch: "曰", alt: "", en: "Say", bn: "বলা", kanji: "書最" },
  { n: 74, ch: "月", alt: "", en: "Moon", bn: "চাঁদ", kanji: "月期有" },
  { n: 75, ch: "木", alt: "", en: "Tree", bn: "গাছ", kanji: "木校本東来森林楽業機橋" },
  { n: 76, ch: "欠", alt: "", en: "Lack", bn: "অভাব", kanji: "次" },
  { n: 77, ch: "止", alt: "", en: "Stop", bn: "থামা", kanji: "歩" },
  { n: 78, ch: "歹", alt: "", en: "Death", bn: "মৃত্যু", kanji: "死" },
  { n: 80, ch: "毋", alt: "母", en: "Mother", bn: "মা", kanji: "母毎" },
  { n: 83, ch: "氏", alt: "", en: "Clan", bn: "বংশ", kanji: "民" },
  { n: 84, ch: "气", alt: "", en: "Steam", bn: "বাষ্প", kanji: "気" },
  { n: 85, ch: "水", alt: "氵", en: "Water", bn: "জল", kanji: "水波池温深浅涼汚消泳洗決泣港" },
  { n: 86, ch: "火", alt: "灬", en: "Fire", bn: "আগুন", kanji: "火熱" },
  { n: 88, ch: "父", alt: "", en: "Father", bn: "বাবা", kanji: "父" },
  { n: 93, ch: "牛", alt: "牜", en: "Cow", bn: "গরু", kanji: "牛特物" },
  { n: 94, ch: "犬", alt: "犭", en: "Dog", bn: "কুকুর", kanji: "狭" },
  { n: 99, ch: "甘", alt: "", en: "Sweet", bn: "মিষ্টি", kanji: "甘" },
  { n: 100, ch: "生", alt: "", en: "Life", bn: "জীবন", kanji: "生産" },
  { n: 102, ch: "田", alt: "", en: "Field", bn: "ক্ষেত", kanji: "田男画界番由" },
  { n: 104, ch: "疒", alt: "", en: "Sickness", bn: "অসুখ", kanji: "病" },
  { n: 105, ch: "癶", alt: "", en: "Footsteps", bn: "পদচিহ্ন", kanji: "登" },
  { n: 106, ch: "白", alt: "", en: "White", bn: "সাদা", kanji: "百白" },
  { n: 109, ch: "目", alt: "", en: "Eye", bn: "চোখ", kanji: "目着" },
  { n: 112, ch: "石", alt: "", en: "Stone", bn: "পাথর", kanji: "研" },
  { n: 113, ch: "示", alt: "礻", en: "Altar", bn: "বেদি", kanji: "社神" },
  { n: 116, ch: "穴", alt: "", en: "Hole", bn: "গর্ত", kanji: "空究" },
  { n: 117, ch: "立", alt: "", en: "Stand", bn: "দাঁড়ানো", kanji: "立" },
  { n: 118, ch: "竹", alt: "⺮", en: "Bamboo", bn: "বাঁশ", kanji: "笑" },
  { n: 120, ch: "糸", alt: "", en: "Thread", bn: "সুতা", kanji: "緑細続終経" },
  { n: 124, ch: "羽", alt: "", en: "Feather", bn: "পালক", kanji: "習" },
  { n: 125, ch: "老", alt: "耂", en: "Old", bn: "বৃদ্ধ", kanji: "者" },
  { n: 128, ch: "耳", alt: "", en: "Ear", bn: "কান", kanji: "耳聞" },
  { n: 140, ch: "艸", alt: "艹", en: "Grass", bn: "ঘাস", kanji: "花荷" },
  { n: 144, ch: "行", alt: "", en: "Go", bn: "যাওয়া", kanji: "行" },
  { n: 146, ch: "襾", alt: "西", en: "West", bn: "পশ্চিম", kanji: "西" },
  { n: 147, ch: "見", alt: "", en: "See", bn: "দেখা", kanji: "見覚" },
  { n: 149, ch: "言", alt: "訁", en: "Speech", bn: "কথা", kanji: "言話読語試" },
  { n: 154, ch: "貝", alt: "", en: "Shell", bn: "ঝিনুক", kanji: "貝買貸" },
  { n: 156, ch: "走", alt: "", en: "Run", bn: "দৌড়ানো", kanji: "走起" },
  { n: 157, ch: "足", alt: "⻊", en: "Foot", bn: "পা", kanji: "足" },
  { n: 159, ch: "車", alt: "", en: "Vehicle", bn: "গাড়ি", kanji: "車軽" },
  { n: 160, ch: "辛", alt: "", en: "Bitter", bn: "তেতো", kanji: "辛" },
  { n: 161, ch: "辰", alt: "", en: "Dragon", bn: "ড্রাগন", kanji: "農" },
  { n: 162, ch: "辵", alt: "⻌", en: "Walk", bn: "হাঁটা", kanji: "週道近遠送返運遊通" },
  { n: 164, ch: "酉", alt: "", en: "Wine jar", bn: "পানীয়ের পাত্র", kanji: "配" },
  { n: 166, ch: "里", alt: "", en: "Village", bn: "গ্রাম", kanji: "重" },
  { n: 167, ch: "金", alt: "", en: "Metal", bn: "ধাতু", kanji: "金銀" },
  { n: 168, ch: "長", alt: "", en: "Long", bn: "লম্বা", kanji: "長" },
  { n: 169, ch: "門", alt: "", en: "Gate", bn: "ফটক", kanji: "門間開閉" },
  { n: 170, ch: "阜", alt: "阝", en: "Mound", bn: "টিলা", kanji: "隣降階" },
  { n: 172, ch: "隹", alt: "", en: "Short-tailed bird", bn: "ছোট লেজের পাখি", kanji: "難集" },
  { n: 173, ch: "雨", alt: "", en: "Rain", bn: "বৃষ্টি", kanji: "雨電雪" },
  { n: 181, ch: "頁", alt: "", en: "Head", bn: "মাথা", kanji: "頃" },
  { n: 182, ch: "風", alt: "", en: "Wind", bn: "বাতাস", kanji: "風" },
  { n: 184, ch: "食", alt: "飠", en: "Eat", bn: "খাওয়া", kanji: "食飲館" },
  { n: 187, ch: "馬", alt: "", en: "Horse", bn: "ঘোড়া", kanji: "馬駅験" },
  { n: 189, ch: "高", alt: "", en: "Tall", bn: "উঁচু", kanji: "高" },
  { n: 195, ch: "魚", alt: "", en: "Fish", bn: "মাছ", kanji: "魚" },
];

const radicalLabel = (r, name) =>
  `${r.ch}${r.alt ? ` (${r.alt})` : ""} · ${name}`;

export const RADICAL_CATEGORIES = [
  ...RADICALS.map((r) => ({
    key: `rad${r.n}`,
    bn: radicalLabel(r, r.bn),
    en: radicalLabel(r, r.en),
  })),
  JUKUGO_CATEGORY,
];

// kanji character -> category key ("rad9", "rad72", ...)
const KANJI_TO_RADICAL_KEY = new Map();
for (const r of RADICALS) {
  for (const ch of r.kanji) KANJI_TO_RADICAL_KEY.set(ch, `rad${r.n}`);
}

// Category key for a kanji-module entry under the radical grouping.
// Returns null for anything without a known radical (kept out of every
// radical category, still visible under "all").
export function radicalKeyOf(item) {
  if (item.isJukugo || item.category === "jukugo") return "jukugo";
  return KANJI_TO_RADICAL_KEY.get(item.kanji) ?? null;
}
