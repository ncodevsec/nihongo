import { N5_KANJI } from "./kanji/n5.js";
import { N4_KANJI } from "./kanji/n4.js";
import { N5_VOCAB } from "./vocab/n5.js";
import { N4_VOCAB } from "./vocab/n4.js";
import { KANJI_LESSON_CATEGORIES_N5, KANJI_LESSON_CATEGORIES_N4, JUKUGO_CATEGORY } from "./kanji-categories.js";
import { VOCAB_LESSON_CATEGORIES } from "./vocab-lesson-categories.js";
import { GRAMMAR_N5 } from "./grammar/n5.js";
import { GRAMMAR_N4 } from "./grammar/n4.js";
import { buildTransformationRows, TRANSFORM_CATEGORIES } from "../lib/grammarUtils.js";

// "All" = N5 and N4 combined. Built from the same source arrays (no copies of
// the content), so ids — and therefore progress and favorites — are exactly
// the ones N5 and N4 already use. Two places need care:
//  - Kanji lesson keys ("lesson1"…) repeat between N5 and N4, so in the
//    combined view each lesson key is prefixed with its level.
//  - Grammar lessons are tagged with their level so each point keeps its
//    own "grammar-n5-…" / "grammar-n4-…" id (see flattenGrammarPoints).
const ALL_KANJI = [
  ...N5_KANJI.map((k) => (k.category === "jukugo" ? k : { ...k, category: `n5-${k.category}` })),
  ...N4_KANJI.map((k) => (k.category === "jukugo" ? k : { ...k, category: `n4-${k.category}` })),
];
const prefixLessons = (cats, lvl) =>
  cats
    .filter((c) => c.key !== "jukugo")
    .map((c) => ({
      ...c,
      key: `${lvl}-${c.key}`,
      bn: `${lvl.toUpperCase()} · ${c.bn}`,
      en: `${lvl.toUpperCase()} · ${c.en}`,
    }));
const ALL_KANJI_CATEGORIES = [
  ...prefixLessons(KANJI_LESSON_CATEGORIES_N5, "n5"),
  ...prefixLessons(KANJI_LESSON_CATEGORIES_N4, "n4"),
  JUKUGO_CATEGORY,
];

export const MODULES = {
  vocabulary: {
    key: "vocabulary",
    bn: "শব্দভাণ্ডার",
    en: "Vocabulary",
    jp: "単語",
    kind: "flashcard",
    levels: {
      n5: { key: "n5", label: "N5", data: N5_VOCAB, categories: VOCAB_LESSON_CATEGORIES },
      n4: { key: "n4", label: "N4", data: N4_VOCAB, categories: VOCAB_LESSON_CATEGORIES },
      all: { key: "all", label: "All", data: [...N5_VOCAB, ...N4_VOCAB], categories: VOCAB_LESSON_CATEGORIES },
    },
  },
  grammar: {
    key: "grammar",
    bn: "গ্রামার",
    en: "Grammar",
    jp: "文法",
    kind: "grammar",
    levels: {
      n5: { key: "n5", label: "N5", lessons: GRAMMAR_N5 },
      n4: { key: "n4", label: "N4", lessons: GRAMMAR_N4 },
      all: {
        key: "all",
        label: "All",
        lessons: [
          ...GRAMMAR_N5.map((l) => ({ ...l, _level: "n5" })),
          ...GRAMMAR_N4.map((l) => ({ ...l, _level: "n4" })),
        ],
      },
    },
  },
  kanji: {
    key: "kanji",
    bn: "কাঞ্জি",
    en: "Kanji",
    jp: "漢字",
    kind: "flashcard",
    levels: {
      n5: { key: "n5", label: "N5", data: N5_KANJI, categories: KANJI_LESSON_CATEGORIES_N5 },
      n4: { key: "n4", label: "N4", data: N4_KANJI, categories: KANJI_LESSON_CATEGORIES_N4 },
      all: { key: "all", label: "All", data: ALL_KANJI, categories: ALL_KANJI_CATEGORIES },
    },
  },
  transform: {
    key: "transform",
    bn: "রূপান্তর",
    en: "Transform",
    jp: "活用",
    kind: "transform",
    levels: {
      n5: { key: "n5", data: buildTransformationRows("n5"), categories: TRANSFORM_CATEGORIES },
      n4: { key: "n4", data: buildTransformationRows("n4"), categories: TRANSFORM_CATEGORIES },
      all: { key: "all", data: buildTransformationRows("all"), categories: TRANSFORM_CATEGORIES },
    },
  },
};

export const MODULE_ORDER = ["vocabulary", "grammar", "kanji", "transform"];
// The two real JLPT levels (used wherever content is counted per level).
export const LEVEL_ORDER = ["n5", "n4"];
// What the level selector offers: everything at once, or a single level.
export const LEVEL_OPTIONS = ["all", "n5", "n4"];
// "N5 + N4" for the combined view, otherwise "N5" / "N4".
export const levelLabel = (level) => (level === "all" ? "N5 + N4" : level.toUpperCase());
