import { N5_KANJI } from "./kanji/n5.js";
import { N4_KANJI } from "./kanji/n4.js";
import { N5_VOCAB } from "./vocab/n5.js";
import { N4_VOCAB } from "./vocab/n4.js";
import { KANJI_CATEGORIES } from "./kanji-categories.js";
import { VOCAB_LESSON_CATEGORIES } from "./vocab-lesson-categories.js";
import { GRAMMAR_N5 } from "./grammar/n5.js";
import { GRAMMAR_N4 } from "./grammar/n4.js";

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
    },
  },
  kanji: {
    key: "kanji",
    bn: "কাঞ্জি",
    en: "Kanji",
    jp: "漢字",
    kind: "flashcard",
    levels: {
      n5: { key: "n5", label: "N5", data: N5_KANJI, categories: KANJI_CATEGORIES },
      n4: { key: "n4", label: "N4", data: N4_KANJI, categories: KANJI_CATEGORIES },
    },
  },
};

export const MODULE_ORDER = ["vocabulary", "grammar", "kanji"];
export const LEVEL_ORDER = ["n5", "n4"];
