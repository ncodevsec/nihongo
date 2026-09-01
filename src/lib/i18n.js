// Site-wide UI translation layer. Content data (kanji/vocab meanings) is
// separate — this only covers interface chrome: labels, buttons, messages.

export function pickLang(item, lang) {
  if (!item) return "";
  if (lang === "en" && item.en) return item.en;
  return item.bn;
}

const UI = {
  // Header
  appSubtitle: { bn: "জাপানি ভাষা ও JLPT / NAT পরীক্ষার প্রস্তুতি", en: "Japanese language & JLPT/NAT exam prep" },
  accuracy: { bn: "নির্ভুলতা", en: "Accuracy" },
  learnedCount: { bn: "শেখা হয়েছে", en: "Learned" },
  level: { bn: "Level", en: "Level" },
  tabStudy: { bn: "ফ্ল্যাশকার্ড", en: "Flashcards" },
  tabQuiz: { bn: "পরীক্ষা", en: "Quiz" },
  tabReference: { bn: "তালিকা", en: "List" },
  tabProgress: { bn: "অগ্রগতি", en: "Progress" },
  tabSettings: { bn: "সেটিংস", en: "Settings" },
  tabGrammarContent: { bn: "গ্রামার", en: "Grammar" },

  // Shared
  allCategories: { bn: "সব বিভাগ", en: "All categories" },
  category: { bn: "বিভাগ", en: "Category" },
  lesson: { bn: "পাঠ", en: "Lesson" },
  noItemsInFilter: { bn: "এই ফিল্টারে কোনো কিছু নেই। অন্য ফিল্টার বেছে নিন।", en: "Nothing matches this filter. Try a different one." },
  grammarComingSoon: { bn: "এই স্তরের গ্রামার এখনো যোগ করা হয়নি — শীঘ্রই আসছে।", en: "Grammar for this level hasn't been added yet — coming soon." },
  grammarSelectLesson: { bn: "একটি পাঠ বেছে নিন", en: "Select a lesson" },

  // Study
  onlyUnlearned: { bn: "যা শিখিনি", en: "Not Memorized" },
  shuffle: { bn: "এলোমেলো করুন ↻", en: "Shuffle ↻" },
  alreadyLearned: { bn: "শেখা হয়ে গেছে", en: "Learned" },
  tapToRevealMeaning: { bn: "অর্থ দেখতে এখানে চাপুন (বা স্পেসবার)", en: "Tap to reveal meaning (or press Space)" },
  meaningHidden: { bn: "(অর্থ লুকানো আছে — সেটিংসে চালু করুন)", en: "(meaning hidden — enable it in Settings)" },
  reviewAgain: { bn: "আবার দেখব", en: "Review again" },
  markLearned: { bn: "শিখে ফেলেছি ✓", en: "Got it ✓" },
  prevCard: { bn: "← আগেরটা", en: "← Previous" },
  nextCard: { bn: "পরেরটা →", en: "Next →" },
  studyHotkeys: {
    bn: "কীবোর্ড শর্টকাট: Space = উল্টান, ← → = নেভিগেট, L = শিখেছি, R = আবার দেখব",
    en: "Keyboard: Space = flip, ← → = navigate, L = learned, R = review again",
  },

  // Quiz
  quizWeakOnly: { bn: "শুধু ভুল হওয়াগুলো", en: "Weak items only" },
  quizAll: { bn: "সব দিয়ে আবার", en: "Restart with all" },
  quizQuestionOf: { bn: "প্রশ্ন", en: "Question" },
  quizScore: { bn: "স্কোর", en: "Score" },
  quizFinishedTitle: { bn: "পরীক্ষা শেষ", en: "Quiz complete" },
  quizCorrectOf: { bn: "টি সঠিক হয়েছে", en: "correct" },
  quizTimeUp: { bn: " (সময় শেষ)", en: " (time's up)" },
  quizReviewNeeded: { bn: "এগুলো আবার দেখা দরকার", en: "These need another look" },
  quizWeakReviewBadge: { bn: "ভুল হওয়া রিভিউ", en: "Weak-item review" },
  quizQuestionVocab: { bn: "এই শব্দের সঠিক অর্থ কোনটি?", en: "What does this word mean?" },
  quizQuestionKanji: { bn: "এর সঠিক পড়া কোনটি?", en: "What is the correct reading?" },
  quizResultButton: { bn: "ফলাফল দেখুন", en: "See results" },
  quizNextButton: { bn: "পরের প্রশ্ন", en: "Next question" },
  quizListenHint: { bn: "কীবোর্ড: A/B/C/D = উত্তর দিন, Enter = পরবর্তী", en: "Keyboard: A/B/C/D = answer, Enter = next" },
  quizNoQuestionsForFilter: { bn: "এই ফিল্টারে যথেষ্ট প্রশ্ন তৈরি করা যাচ্ছে না।", en: "Not enough items in this filter to build a quiz." },

  // Reference
  searchPlaceholder: { bn: "লিখে খুঁজুন…", en: "Search…" },
  colWord: { bn: "শব্দ", en: "Word" },
  colReading: { bn: "পড়া", en: "Reading" },
  colMeaning: { bn: "অর্থ", en: "Meaning" },
  colCategory: { bn: "বিভাগ", en: "Category" },
  colStatus: { bn: "অবস্থা", en: "Status" },
  showingCountOf: { bn: "টির মধ্যে", en: "of" },
  showingCountShown: { bn: "টি দেখানো হচ্ছে", en: "shown" },
  noResults: { bn: "কিছু পাওয়া যায়নি। অন্য কিছু লিখে খুঁজুন।", en: "No results. Try a different search." },
  loadMore: { bn: "আরও দেখান", en: "Show more" },
  itemsLeft: { bn: "টি বাকি", en: "left" },
  markAsLearned: { bn: "শিখেছি হিসেবে চিহ্নিত করুন", en: "Mark as learned" },
  markAsUnlearned: { bn: "অশেখা হিসেবে চিহ্নিত করুন", en: "Mark as not learned" },

  // Progress
  progressMastered: { bn: "শেখা", en: "Mastered" },
  progressMasteredOf: { bn: "টির মধ্যে শেখা হয়েছে", en: "learned" },
  progressAccuracyLabel: { bn: "নির্ভুলতা", en: "Accuracy" },
  progressOverallAccuracy: { bn: "পরীক্ষায় সামগ্রিক নির্ভুলতা", en: "Overall quiz accuracy" },
  progressAnswered: { bn: "উত্তর", en: "Answered" },
  progressTotalAnswered: { bn: "মোট উত্তর দেওয়া প্রশ্ন", en: "Total questions answered" },
  progressByCategory: { bn: "বিভাগ অনুযায়ী অগ্রগতি", en: "Progress by category" },
  resetProgress: { bn: "অগ্রগতি রিসেট করুন", en: "Reset progress" },
  resetProgressConfirm: { bn: "নিশ্চিত? আবার চাপুন — সব অগ্রগতি মুছে যাবে", en: "Are you sure? Tap again — this clears all progress" },

  // Settings
  sectionLanguage: { bn: "ভাষা", en: "Language" },
  siteLanguage: { bn: "সাইটের ভাষা", en: "Site language" },
  siteLanguageSub: { bn: "মেনু, বাটন ও লেবেলের ভাষা", en: "Language of menus, buttons, and labels" },
  sectionTheme: { bn: "থিম", en: "Theme" },
  appTheme: { bn: "অ্যাপের থিম", en: "App theme" },
  appThemeSub: { bn: "সিস্টেম ডিফল্ট আপনার ডিভাইসের সেটিং অনুসরণ করে", en: "System default follows your device setting" },
  themeLight: { bn: "লাইট", en: "Light" },
  themeDark: { bn: "ডার্ক", en: "Dark" },
  themeSystem: { bn: "সিস্টেম ডিফল্ট", en: "System default" },
  sectionKanji: { bn: "কাঞ্জি বিভাগ", en: "Kanji module" },
  showBnMeaning: { bn: "বাংলা অর্থ দেখান", en: "Show meaning" },
  showBnMeaningSub: { bn: "বন্ধ করলে শুধু কাঞ্জি ও পড়া দেখাবে, অর্থ লুকানো থাকবে", en: "Turn off to show only the character and reading" },
  sectionVocab: { bn: "শব্দভাণ্ডার বিভাগ", en: "Vocabulary module" },
  showVocabKanji: { bn: "কাঞ্জি স্ক্রিপ্ট দেখান", en: "Show kanji script" },
  showVocabKanjiSub: { bn: "বন্ধ থাকলে শুধু হিরাগানা/কাতাকানা দেখাবে — পরীক্ষার জন্য উপযোগী", en: "Off shows only hiragana/katakana — good for testing recall" },
  meaningLanguage: { bn: "অর্থের ভাষা", en: "Meaning language" },
  meaningLanguageSub: { bn: "পরীক্ষায় ও কার্ডে অর্থ কোন ভাষায় দেখাবে", en: "Language used for meanings in quizzes and cards" },
  langBangla: { bn: "বাংলা", en: "বাংলা" },
  langEnglish: { bn: "English", en: "English" },
  sectionQuiz: { bn: "পরীক্ষা", en: "Quiz" },
  quizLengthLabel: { bn: "প্রতি পরীক্ষায় প্রশ্নের সংখ্যা", en: "Questions per quiz" },
  quizLengthSub: { bn: "ছোট সেট দ্রুত অনুশীলনের জন্য ভালো", en: "Shorter sets are good for quick practice" },
  quizLenAll: { bn: "সবগুলো", en: "All" },
  quizLen10: { bn: "১০টি", en: "10" },
  quizLen20: { bn: "২০টি", en: "20" },
  quizLen50: { bn: "৫০টি", en: "50" },
  timedQuiz: { bn: "সময়সীমাসহ পরীক্ষা (Exam Mode)", en: "Timed quiz (Exam Mode)" },
  timedQuizSub: { bn: "JLPT/NAT-এর মতো বাস্তব পরীক্ষার পরিবেশে অনুশীলন করুন", en: "Practice under real exam-like time pressure" },
  timedMinutes: { bn: "সময়সীমা (মিনিট)", en: "Time limit (minutes)" },
  sectionData: { bn: "ডেটা", en: "Data" },
  resetSettingsLabel: { bn: "সব সেটিংস ডিফল্টে ফিরিয়ে আনুন", en: "Reset all settings to default" },
  resetAllProgressLabel: { bn: "সব অগ্রগতি মুছে ফেলুন", en: "Clear all progress" },
  resetAllProgressSub: { bn: "সব বিভাগ ও স্তরের শেখা-অবস্থা মুছে যাবে", en: "Clears learned status across every module and level" },
  confirmButton: { bn: "নিশ্চিত করুন", en: "Confirm" },
  resetButton: { bn: "রিসেট করুন", en: "Reset" },
  deleteButton: { bn: "মুছে ফেলুন", en: "Delete" },

  // Footer
  footerFor: { bn: "অনুশীলনের জন্য", en: "practice" },
  footerStorage: { bn: "অগ্রগতি এই ব্রাউজারে সংরক্ষিত হয়", en: "Progress is saved in this browser" },
};

export function t(lang, key) {
  const entry = UI[key];
  if (!entry) return key;
  return lang === "en" ? entry.en ?? entry.bn : entry.bn;
}
