// Shared "lesson" categories for vocabulary modules. N5 uses lessons 1-25
// (Minna no Nihongo I) and N4 uses lessons 26-50 (Minna no Nihongo II) —
// both are the textbooks' own real lesson numbers, continuing sequentially.
function makeLesson(n) {
  return { key: `lesson${n}`, jp: `第${n}課`, bn: `পাঠ ${n}`, en: `Lesson ${n}` };
}

export const VOCAB_LESSON_CATEGORIES = Array.from({ length: 50 }, (_, i) =>
  makeLesson(i + 1)
);
