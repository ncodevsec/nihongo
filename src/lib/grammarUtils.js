import { N5_VOCAB } from "../data/vocab/n5.js";
import { N4_VOCAB } from "../data/vocab/n4.js";
import { classifyPartOfSpeech } from "./vocabClassify.js";
import {
  conjugateVerb,
  conjugateIAdjective,
  conjugateNaAdjective,
  classifyVerbGroup,
} from "./conjugate.js";

// JLPT-textbook verb groups (Group 1 "u-verbs"/Godan, Group 2
// "ru-verbs"/Ichidan, Group 3 irregular する/くる) for filtering the Verb
// side of the Transform tab. Honorific verbs (くださいます, etc.) conjugate
// irregularly but are still Godan-type, so they count as Group 1.
export const VERB_GROUP_CATEGORIES = [
  { key: "group1", bn: "গ্রুপ ১ (う-verb)", en: "Group 1 (u-verb)" },
  { key: "group2", bn: "গ্রুপ ২ (る-verb)", en: "Group 2 (ru-verb)" },
  { key: "group3", bn: "গ্রুপ ৩ (অনিয়মিত)", en: "Group 3 (irregular)" },
];

function jlptVerbGroup(masu) {
  const g = classifyVerbGroup(masu);
  if (g === "ichidan") return "group2";
  if (g === "irregular-suru" || g === "irregular-kuru") return "group3";
  return "group1"; // godan, special-honorific
}

// Shared helpers for the Grammar module. Grammar data is structured as
// lessons -> points -> examples (see data/grammar/n4.js). These utilities
// adapt that shape for reuse with the generic Progress view, build a
// synthetic "category per lesson" list, and generate lightweight
// fill-in-the-blank quiz questions without needing any NLP library at
// runtime (kanji has already been stripped out of the source data ahead
// of time, so everything here works on plain hiragana/katakana strings).

export function grammarItemId(level, pointId) {
  return `grammar-${level}-${pointId}`;
}

// The raw per-point id in the source data is "[lesson]-[rule]" (e.g.
// "8-5"). Displayed to the user it should read "8.5" instead — the lesson
// and rule number are still both there, just with the same separator the
// rest of the app uses for numbering (see Progress's category labels).
export function formatGrammarPointId(pointId) {
  return pointId.replace("-", ".");
}

// Flattens lessons into a single list of points, each carrying its lesson
// number and a ready-to-use progress/favorites id.
export function flattenGrammarPoints(lessons, level) {
  const out = [];
  for (const lesson of lessons) {
    for (const point of lesson.points) {
      out.push({
        ...point,
        lesson: lesson.lesson,
        category: `lesson${lesson.lesson}`,
        // The composite `id` below (used for progress/favorites storage)
        // overwrites the raw "8-5" id from the source data, so it's kept
        // here under its own key for display purposes.
        pointId: point.id,
        // Lessons in the combined "All" view carry their own level tag so
        // ids stay identical to the ones N5 / N4 use on their own.
        id: grammarItemId(lesson._level ?? level, point.id),
      });
    }
  }
  return out;
}

// One synthetic "category" per lesson, in lesson order — reused by both
// the List filter dropdown and the generic Progress-by-category view.
export function grammarCategories(lessons) {
  return lessons.map((l) => ({
    key: `lesson${l.lesson}`,
    bn: `পাঠ ${l.lesson}`,
    en: `Lesson ${l.lesson}`,
  }));
}

// Distinct particle/marker tags across all points, in first-seen order —
// powers the "By Particle" grouping view (parallel to vocab's "By PoS").
export function grammarParticleCategories(lessons) {
  const seen = new Map();
  for (const lesson of lessons) {
    for (const point of lesson.points) {
      const key = point.particle || "other";
      if (!seen.has(key)) seen.set(key, { key, bn: key, en: key });
    }
  }
  return Array.from(seen.values());
}

// The ten categories for the "By Transformation" grouping view — every
// verb conjugation (Dictionary/て/た/ない) plus い- and な-adjectives kept
// separate for their own past/negative/past-negative forms, so each can
// be studied on its own. Independent of level/lesson since the
// conjugation rules themselves don't change between N5 and N4 — this
// covers every verb and adjective across both vocab lists at once.
export const TRANSFORM_CATEGORIES = [
  { key: "verb-dictionary", jp: "動詞ー辞書形", bn: "ক্রিয়া - অভিধান রূপ", en: "Verb - Dictionary form" },
  { key: "verb-te", jp: "動詞ーて形", bn: "ক্রিয়া - て রূপ", en: "Verb - Te form" },
  { key: "verb-ta", jp: "動詞ーた形", bn: "ক্রিয়া - た রূপ", en: "Verb - Ta form" },
  { key: "verb-nai", jp: "動詞ーない形", bn: "ক্রিয়া - ない রূপ", en: "Verb - Nai form" },
  { key: "i-adj-past", jp: "い形容詞ー過去形", bn: "I-বিশেষণ - অতীত রূপ", en: "I-Adjective - Past form" },
  { key: "i-adj-negative", jp: "い形容詞ー否定形", bn: "I-বিশেষণ - নেতিবাচক রূপ", en: "I-Adjective - Negative form" },
  { key: "i-adj-pastNegative", jp: "い形容詞ー過去否定形", bn: "I-বিশেষণ - অতীত নেতিবাচক রূপ", en: "I-Adjective - Past negative form" },
  { key: "na-adj-past", jp: "な形容詞ー過去形", bn: "Na-বিশেষণ - অতীত রূপ", en: "Na-Adjective - Past form" },
  { key: "na-adj-negative", jp: "な形容詞ー否定形", bn: "Na-বিশেষণ - নেতিবাচক রূপ", en: "Na-Adjective - Negative form" },
  { key: "na-adj-pastNegative", jp: "な形容詞ー過去否定形", bn: "Na-বিশেষণ - অতীত নেতিবাচক রূপ", en: "Na-Adjective - Past negative form" },
];

export const VERB_TRANSFORM_CATEGORIES = TRANSFORM_CATEGORIES.filter((c) =>
  c.key.startsWith("verb-"),
);
export const ADJECTIVE_TRANSFORM_CATEGORIES = TRANSFORM_CATEGORIES.filter(
  (c) => c.key.startsWith("i-adj-") || c.key.startsWith("na-adj-"),
);
// Which of the two Transform tab groups a transformation row's category
// belongs to.
export const transformGroupOf = (categoryKey) =>
  categoryKey.startsWith("verb-") ? "verb" : "adjective";

const VERB_FORM_LABELS = {
  dictionary: { bn: "অভিধান রূপ", en: "Dictionary form" },
  te: { bn: "て রূপ", en: "Te form" },
  ta: { bn: "た রূপ", en: "Ta form" },
  nai: { bn: "ない রূপ", en: "Nai form" },
};

const ADJ_FORM_LABELS = {
  past: { bn: "অতীত রূপ", en: "Past form" },
  negative: { bn: "নেতিবাচক রূপ", en: "Negative form" },
  pastNegative: { bn: "অতীত নেতিবাচক রূপ", en: "Past negative form" },
};

// Entries that are grammatically real ます-forms but aren't suitable for
// a plain conjugation-drill table — fixed greetings, sentence fragments,
// or words already built from a te-form + auxiliary verb (知っています,
// 帰って来ます) where "conjugating" the whole thing again would test a
// compound rather than a single verb.
const VERB_EXCLUDE = new Set([
  "どうもありがとうございます", "これからおせわになります",
  "そろそろ しつれいします", "また こんど おねがいします",
  "〜といいます", "しっています", "にています", "たのしみにしています",
  "もっていきます", "もってきます", "つれていきます", "つれてきます",
  "かえってきます",
]);

// い-ending words that classifyPartOfSpeech tags as adjective-like but
// are actually nouns, greetings, or sentence fragments (お手洗い, おとと
// い, いらっしゃい, a movie title that happens to end in さむらい, etc.)
// — verified against the actual word list, not guessed from a pattern.
const I_ADJ_EXCLUDE = new Set([
  "おてあらい", "おととい", "うけつけい", "いらっしゃい",
  "どうぞ おあがりください", "また いらっしゃってください",
  "しちにんのさむらい", "かしてください", "ぐらい", "ほしうらない",
  "みあい", "おいわい", "おみまい", "におい", "このくらい",
]);

function collectPos(target, level) {
  const seen = new Map();
  const lists =
    level === "n4" ? [N4_VOCAB] : level === "n5" ? [N5_VOCAB] : [N5_VOCAB, N4_VOCAB];
  for (const list of lists) {
    for (const item of list) {
      if (classifyPartOfSpeech(item) !== target) continue;
      const reading = item.reading
        .split(/[、／]/)[0]
        .trim()
        .replace(/[［[]な[］\]]/g, "");
      if (!seen.has(reading)) {
        seen.set(reading, { reading, meaningBn: item.meaning });
      }
    }
  }
  return Array.from(seen.values());
}

// Derives the full "By Transformation" row set directly from this app's
// own vocab data for the given level (N5_VOCAB or N4_VOCAB) — rather than
// a separately maintained list, so it automatically covers every verb
// and adjective actually taught at that level, and stays in sync if that
// data changes. See conjugate.js for the actual conjugation rules.
export function buildTransformationRows(level) {
  if (level === "all") {
    return [...buildTransformationRows("n5"), ...buildTransformationRows("n4")];
  }
  const rows = [];

  for (const { reading, meaningBn } of collectPos("verb", level)) {
    if (VERB_EXCLUDE.has(reading)) continue;
    const conj = conjugateVerb(reading);
    if (!conj) continue;
    for (const key of ["dictionary", "te", "ta", "nai"]) {
      rows.push({
        id: `transform-${level}-verb-${reading}-${key}`,
        category: `verb-${key}`,
        mainForm: reading,
        transformedForm: conj[key],
        formLabel: VERB_FORM_LABELS[key],
        meaningBn,
        verbGroup: jlptVerbGroup(reading),
      });
    }
  }

  for (const { reading, meaningBn } of collectPos("adjective-i", level)) {
    if (I_ADJ_EXCLUDE.has(reading)) continue;
    const conj = conjugateIAdjective(reading);
    if (!conj) continue;
    for (const key of ["past", "negative", "pastNegative"]) {
      rows.push({
        id: `transform-${level}-iadj-${reading}-${key}`,
        category: `i-adj-${key}`,
        mainForm: reading,
        transformedForm: conj[key],
        formLabel: ADJ_FORM_LABELS[key],
        meaningBn,
      });
    }
  }

  for (const { reading, meaningBn } of collectPos("adjective-na", level)) {
    const cleanReading = reading.replace(/[［[]な[］\]]/g, "").trim();
    const conj = conjugateNaAdjective(cleanReading);
    if (!conj) continue;
    for (const key of ["past", "negative", "pastNegative"]) {
      rows.push({
        id: `transform-${level}-naadj-${cleanReading}-${key}`,
        category: `na-adj-${key}`,
        mainForm: cleanReading,
        transformedForm: conj[key],
        alternates: conj.alternates?.[key],
        formLabel: ADJ_FORM_LABELS[key],
        meaningBn,
      });
    }
  }

  return rows;
}

// Builds multiple-choice questions from the transformation rows — given a
// word's main form and which transformation is being asked for, pick the
// correct transformed form out of a few plausible distractors drawn from
// other words in the same category (so wrong options are the same kind
// of transformation, not an unrelated one).
export function buildTransformQuestions(rows) {
  const byCategory = new Map();
  for (const r of rows) {
    if (!byCategory.has(r.category)) byCategory.set(r.category, []);
    byCategory.get(r.category).push(r);
  }
  return rows.map((r) => {
    const siblings = byCategory
      .get(r.category)
      .filter((x) => x.id !== r.id && x.transformedForm !== r.transformedForm);
    const distractorCount = Math.min(3, siblings.length);
    const distractors = shuffleArr(siblings).slice(0, distractorCount);
    const options = shuffleArr([
      { text: r.transformedForm, correct: true },
      ...distractors.map((d) => ({ text: d.transformedForm, correct: false })),
    ]);
    return {
      id: r.id,
      mainForm: r.mainForm,
      formLabel: r.formLabel,
      meaningBn: r.meaningBn,
      options,
    };
  });
}

const KANA_RUN_RE = /[\u3040-\u30ff\u30fc]{2,}/g;

// Finds a short kana phrase from the rule's heading that also appears
// verbatim inside one of its own examples — that phrase becomes the
// fill-in-the-blank target. Prefers the longest matching phrase, since
// that is usually the most distinctive part of the pattern rather than a
// generic ending like です.
function extractTarget(point) {
  if (!point.examples || point.examples.length === 0) return null;
  const runs = Array.from(new Set((point.headingBn.match(KANA_RUN_RE) || [])));
  runs.sort((a, b) => b.length - a.length);
  for (const run of runs) {
    for (const example of point.examples) {
      const idx = example.jp.indexOf(run);
      if (idx !== -1) {
        return { phrase: run, example, idx };
      }
    }
  }
  return null;
}

// Builds multiple-choice fill-in-the-blank questions: one per grammar
// point where a clean target phrase could be identified. `pool` should be
// the full flattened point list for the current level (used to source
// plausible wrong-answer options from other rules).
export function buildGrammarQuestions(points) {
  const withTargets = [];
  for (const point of points) {
    const target = extractTarget(point);
    if (target) withTargets.push({ point, target });
  }

  const allPhrases = Array.from(new Set(withTargets.map((w) => w.target.phrase)));

  return withTargets.map(({ point, target }) => {
    const { phrase, example, idx } = target;
    const blanked = example.jp.slice(0, idx) + "＿＿＿" + example.jp.slice(idx + phrase.length);

    const distractorPool = allPhrases.filter((p) => p !== phrase);
    const distractors = shuffleArr(distractorPool).slice(0, 3);
    // Pad with a generic fallback in the rare case fewer than 3 distinct
    // distractors exist in a very small dataset.
    while (distractors.length < 3) distractors.push("ーーー");

    const options = shuffleArr([
      { text: phrase, correct: true },
      ...distractors.map((text) => ({ text, correct: false })),
    ]);

    return {
      id: point.id,
      lesson: point.lesson,
      pointId: point.pointId,
      headingBn: point.headingBn,
      blanked,
      meaningBn: example.meaningBn,
      fullSentence: example.jp,
      options,
    };
  });
}

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export { shuffleArr as shuffle };
