// Lesson categories for the Kanji module — mirrors how vocabulary already
// categorizes by lesson (vocab-lesson-categories.js) instead of by theme.
// Kanji is divided serially (by how the base kanji are listed) into fixed
// lessons of 10: 11 lessons for N5 (110 kanji) and 16 for N4. N4's last
// lesson currently has only 4 kanji since the practical N4 set here totals
// 154, not a clean multiple of 10 — see kanji/n4.js.
function makeLesson(n) {
  return { key: `lesson${n}`, jp: `第${n}課`, bn: `পাঠ ${n}`, en: `Lesson ${n}` };
}

const JUKUGO_CATEGORY = {
  key: "jukugo",
  jp: "熟語",
  bn: "জুকুগো (দুই-কাঞ্জি শব্দ)",
  en: "Jukugo (compound words)",
};

export const KANJI_LESSON_CATEGORIES_N5 = [
  ...Array.from({ length: 11 }, (_, i) => makeLesson(i + 1)),
  JUKUGO_CATEGORY,
];

export const KANJI_LESSON_CATEGORIES_N4 = [
  ...Array.from({ length: 16 }, (_, i) => makeLesson(i + 1)),
  JUKUGO_CATEGORY,
];
