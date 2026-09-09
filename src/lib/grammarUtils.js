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
        id: grammarItemId(level, point.id),
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

// The two categories for the "By Transformation" grouping view — parts-
// of-speech conjugation practice, independent of level/lesson since the
// conjugation rules themselves don't change between N5 and N4.
export const TRANSFORM_CATEGORIES = [
  { key: "verb", jp: "動詞", bn: "ক্রিয়াপদ (Verb)", en: "Verb" },
  { key: "adjective", jp: "形容詞", bn: "বিশেষণ (Adjective)", en: "Adjective" },
];

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

// Flattens the compact per-verb/per-adjective source data (one object per
// word, all its forms together) into one row per (word, transformation)
// pair — e.g. たべます becomes 4 rows (dictionary/te/ta/nai), each with
// its own id so star/read status track independently per transformation,
// not per word.
export function buildTransformationRows(verbs, adjectives) {
  const rows = [];
  for (const v of verbs) {
    for (const key of ["dictionary", "te", "ta", "nai"]) {
      rows.push({
        id: `transform-${v.id}-${key}`,
        category: "verb",
        mainForm: v.masu,
        transformedForm: v[key],
        formLabel: VERB_FORM_LABELS[key],
        meaningBn: v.meaningBn,
      });
    }
  }
  for (const a of adjectives) {
    for (const key of ["past", "negative", "pastNegative"]) {
      rows.push({
        id: `transform-${a.id}-${key}`,
        category: "adjective",
        mainForm: a.base,
        transformedForm: a[key],
        formLabel: ADJ_FORM_LABELS[key],
        meaningBn: a.meaningBn,
      });
    }
  }
  return rows;
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
