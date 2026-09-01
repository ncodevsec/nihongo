import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shuffle } from "../lib/utils.js";
import { useHotkeys } from "../hooks/useHotkeys.js";
import { t, pickLang } from "../lib/i18n.js";
import Hanko from "./Hanko.jsx";
import { classifyPartOfSpeech, POS_CATEGORIES, classifyCounting, COUNTING_CATEGORIES } from "../lib/vocabClassify.js";

const LETTERS = ["A", "B", "C", "D", "E"];

function buildQuestions(pool, allData, { isVocab, vocabLang, optionCount }) {
  const textOf = (d) => (isVocab && vocabLang === "en" ? d.meaningEn || d.meaning : d.meaning);
  const shuffledPool = shuffle(pool);
  const shuffledAll = shuffle(allData);
  const total = shuffledAll.length;
  const distractorCount = Math.max(1, optionCount - 1);
  let cursor = 0;

  return shuffledPool.map((item) => {
    const correctKey = isVocab ? textOf(item) : item.reading;
    const distractors = [];
    let scanned = 0;
    while (distractors.length < distractorCount && scanned < total) {
      const candidate = shuffledAll[cursor % total];
      cursor++;
      scanned++;
      if (candidate.id === item.id) continue;
      const candidateKey = isVocab ? textOf(candidate) : candidate.reading;
      if (candidateKey === correctKey) continue;
      if (distractors.some((d) => d.id === candidate.id)) continue;
      distractors.push(candidate);
    }

    if (isVocab) {
      const options = shuffle([
        { primary: correctKey, correct: true },
        ...distractors.map((d) => ({ primary: textOf(d), correct: false })),
      ]);
      return { ...item, options };
    }
    const options = shuffle([
      { primary: item.reading, secondary: item.meaning, correct: true },
      ...distractors.map((d) => ({ primary: d.reading, secondary: d.meaning, correct: false })),
    ]);
    return { ...item, options };
  });
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const LENGTH_OPTIONS = ["all", "10", "20", "50"];

export default function Quiz({ moduleKey, kanjiData, categories, progress, recordQuizResult, settings, updateSetting = () => {}, isActive = true }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const isVocab = moduleKey === "vocabulary";
  const showMeaning = isVocab ? true : settings.showKanjiBn;

  const availableCategories = useMemo(() => {
    const used = new Set(kanjiData.map((k) => k.category));
    return categories.filter((c) => used.has(c.key));
  }, [kanjiData, categories]);

  const availablePosCategories = useMemo(() => {
    if (!isVocab) return [];
    const used = new Set(kanjiData.map((k) => classifyPartOfSpeech(k)));
    return POS_CATEGORIES.filter((c) => used.has(c.key));
  }, [kanjiData, isVocab]);

  const availableCountingCategories = useMemo(() => {
    if (!isVocab) return [];
    const used = new Set(kanjiData.map((k) => classifyCounting(k)).filter(Boolean));
    return COUNTING_CATEGORIES.filter((c) => used.has(c.key));
  }, [kanjiData, isVocab]);

  // ---- Setup phase state (persists as the new defaults via updateSetting
  // once the quiz is actually started) ----
  const [phase, setPhase] = useState("setup");
  const [setupGroupBy, setSetupGroupBy] = useState("lesson"); // 'lesson' | 'pos' (vocab only)
  const [setupCategory, setSetupCategory] = useState("all");
  const [setupLength, setSetupLength] = useState(settings.quizLength);
  const [setupOptionCount, setSetupOptionCount] = useState(settings.quizOptionCount);
  const [setupTimed, setSetupTimed] = useState(settings.timedQuiz);
  const [setupMinutes, setSetupMinutes] = useState(settings.timedMinutes);

  // Reset back to a fresh setup screen whenever the underlying dataset
  // changes (switching level/module) so stale question state can't linger.
  useEffect(() => {
    setPhase("setup");
    setSetupGroupBy("lesson");
    setSetupCategory("all");
  }, [kanjiData]);

  useEffect(() => {
    setSetupCategory("all");
  }, [setupGroupBy]);

  const setupCategoryFiltered = useMemo(() => {
    if (setupCategory === "all") return kanjiData;
    if (setupGroupBy === "pos") return kanjiData.filter((k) => classifyPartOfSpeech(k) === setupCategory);
    if (setupGroupBy === "count") return kanjiData.filter((k) => classifyCounting(k) === setupCategory);
    return kanjiData.filter((k) => k.category === setupCategory);
  }, [kanjiData, setupCategory, setupGroupBy]);

  const setupAvailableCount =
    setupLength === "all" ? setupCategoryFiltered.length : Math.min(Number(setupLength), setupCategoryFiltered.length);

  // ---- Active quiz state ----
  const [category, setCategory] = useState("all");
  const [optionCount, setOptionCount] = useState(4);
  const [mode, setMode] = useState("all");
  const [runId, setRunId] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState({});
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const categoryFiltered = useMemo(() => {
    return category === "all" ? kanjiData : kanjiData.filter((k) => k.category === category);
  }, [kanjiData, category]);

  const applyLength = useCallback((list, len) => {
    if (len === "all") return list;
    const n = Number(len);
    return list.slice(0, Math.min(n, list.length));
  }, []);

  const weakPool = useMemo(
    () =>
      categoryFiltered.filter((k) => {
        const p = progress[k.id];
        return p && !p.learned && p.wrong > 0;
      }),
    [categoryFiltered, progress]
  );

  const startQuizRun = useCallback(
    ({ cat, len, opts, timed, minutes, nextMode, source }) => {
      setCategory(cat);
      setOptionCount(opts);
      setMode(nextMode);
      const buildOpts = { isVocab, vocabLang: settings.vocabLang, optionCount: opts };
      setQuestions(applyLength(shuffle(buildQuestions(source, kanjiData, buildOpts)), len));
      setCurrent(0);
      setResults({});
      setSelected(null);
      setAnswered(false);
      setFinished(false);
      setTimeLeft(timed ? minutes * 60 : 0);
      setRunId((id) => id + 1);
      setPhase("active");
    },
    [applyLength, isVocab, kanjiData, settings.vocabLang]
  );

  const handleStartFromSetup = () => {
    // Persist the chosen configuration as the new defaults.
    updateSetting("quizLength", setupLength);
    updateSetting("quizOptionCount", setupOptionCount);
    updateSetting("timedQuiz", setupTimed);
    updateSetting("timedMinutes", setupMinutes);
    startQuizRun({
      cat: setupCategory,
      len: setupLength,
      opts: setupOptionCount,
      timed: setupTimed,
      minutes: setupMinutes,
      nextMode: "all",
      source: setupCategoryFiltered,
    });
  };

  const startNew = (nextMode) => {
    const m = nextMode ?? mode;
    const source = m === "weak" && weakPool.length >= 4 ? weakPool : categoryFiltered;
    startQuizRun({
      cat: category,
      len: settings.quizLength,
      opts: optionCount,
      timed: settings.timedQuiz,
      minutes: settings.timedMinutes,
      nextMode: m,
      source,
    });
  };

  const goToSetup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("setup");
  };

  // Timed exam mode: countdown, auto-finish at zero. Restarts cleanly on
  // every new run via runId, rather than inferring restarts from state.
  useEffect(() => {
    if (phase !== "active" || !settings.timedQuiz || finished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((tl) => {
        if (tl <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return tl - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, settings.timedQuiz, finished, runId]);

  const total = questions.length;
  const q = questions[current];
  const answeredCount = Object.keys(results).length;
  const score = Object.values(results).filter((r) => r === "correct").length;

  const handleSelect = useCallback(
    (idx) => {
      if (answered || !q) return;
      const opt = q.options[idx];
      const outcome = opt.correct ? "correct" : "wrong";
      setResults((r) => ({ ...r, [current]: outcome }));
      setSelected(idx);
      setAnswered(true);
      recordQuizResult(q.id, opt.correct);
    },
    [answered, q, current, recordQuizResult]
  );

  const goNext = useCallback(() => {
    setCurrent((c) => {
      if (c === total - 1) {
        setFinished(true);
        return c;
      }
      return c + 1;
    });
    setSelected(null);
    setAnswered(false);
  }, [total]);

  useHotkeys(
    useCallback(
      (e) => {
        if (!isActive || phase !== "active" || finished || !q) return;
        if (!answered) {
          const i = LETTERS.indexOf(e.key.toUpperCase());
          if (i !== -1 && i < q.options.length) handleSelect(i);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goNext();
        }
      },
      [isActive, phase, finished, q, answered, handleSelect, goNext]
    )
  );

  // ---------------- SETUP SCREEN ----------------
  if (phase === "setup") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-sm p-5">
          <h2 className="font-bengali text-lg font-bold text-ink dark:text-night-ink mb-4">
            {T("quizSetupTitle")}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted block mb-1.5">
                {T("quizSetupCategory")}
              </label>
              {isVocab && (
                <div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden mb-2 w-fit">
                  {[
                    { key: "lesson", label: T("groupByLesson") },
                    { key: "pos", label: T("groupByPos") },
                    { key: "count", label: T("groupByCount") },
                  ].map((g) => (
                    <button
                      key={g.key}
                      onClick={() => setSetupGroupBy(g.key)}
                      className={`px-2.5 py-1.5 text-xs font-bengali font-medium transition-colors ${
                        setupGroupBy === g.key
                          ? "bg-ai text-washi"
                          : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              )}
              <select
                value={setupCategory}
                onChange={(e) => setSetupCategory(e.target.value)}
                className="font-bengali w-full border border-ai-line dark:border-night-line rounded-md px-3 py-2 text-sm bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
              >
                <option value="all">{T("allCategories")}</option>
                {(setupGroupBy === "pos"
                  ? availablePosCategories
                  : setupGroupBy === "count"
                  ? availableCountingCategories
                  : availableCategories
                ).map((c) => (
                  <option key={c.key} value={c.key}>
                    {pickLang(c, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted block mb-1.5">
                {T("quizSetupLength")}
              </label>
              <div className="flex flex-wrap gap-2">
                {LENGTH_OPTIONS.map((len) => (
                  <button
                    key={len}
                    onClick={() => setSetupLength(len)}
                    className={`px-3 py-1.5 rounded-md border text-sm font-bengali transition-colors ${
                      setupLength === len
                        ? "bg-shu text-washi border-shu"
                        : "border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-shu/50"
                    }`}
                  >
                    {len === "all" ? T("quizLenAll") : len}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted block mb-1.5">
                {T("quizSetupOptions")}
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSetupOptionCount(n)}
                    className={`w-10 h-10 rounded-md border text-sm font-mono font-semibold transition-colors ${
                      setupOptionCount === n
                        ? "bg-ai text-washi border-ai"
                        : "border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-ai/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
                {T("quizSetupTimed")}
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={setupTimed}
                onClick={() => setSetupTimed((v) => !v)}
                className={`w-11 h-6 shrink-0 rounded-full relative transition-colors ${
                  setupTimed ? "bg-ai dark:bg-ai-glow" : "bg-ai-line dark:bg-night-line"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-150 ${
                    setupTimed ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {setupTimed && (
              <div className="flex items-center justify-between">
                <label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
                  {T("quizSetupMinutes")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={setupMinutes}
                  onChange={(e) => setSetupMinutes(Math.max(1, Number(e.target.value) || 1))}
                  className="font-mono text-sm border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 w-20 bg-paper dark:bg-night-paper text-ink dark:text-night-ink text-right"
                />
              </div>
            )}
          </div>

          <p className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted text-center mt-5">
            {setupAvailableCount} {T("quizSetupAvailable")}
          </p>

          <button
            onClick={handleStartFromSetup}
            disabled={setupAvailableCount < 2}
            className="w-full mt-3 font-bengali text-base font-semibold bg-shu text-washi rounded-lg py-3 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {T("quizSetupStart")}
          </button>
        </div>
      </div>
    );
  }

  const categorySelector = (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="font-bengali border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 bg-paper dark:bg-night-paper text-ink dark:text-night-ink text-xs"
    >
      <option value="all">{T("allCategories")}</option>
      {availableCategories.map((c) => (
        <option key={c.key} value={c.key}>
          {pickLang(c, lang)}
        </option>
      ))}
    </select>
  );

  const restartButton = (
    <button
      onClick={goToSetup}
      aria-label={T("quizRestart")}
      title={T("quizRestart")}
      className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper text-shu dark:text-shu-glow hover:bg-shu-soft dark:hover:bg-shu/10 transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
    </button>
  );

  // ---------------- FINISHED SCREEN ----------------
  if (finished) {
    const pct = total ? Math.round((score / total) * 100) : 0;
    const missed = questions.filter((_, i) => results[i] === "wrong");
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-3 flex items-center gap-2">
          {categorySelector}
          {restartButton}
        </div>
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-sm p-6">
          <div className="flex justify-center mb-4">
            <Hanko label={`${pct}%`} tone={pct >= 80 ? "take" : "shu"} size="lg" />
          </div>
          <h2 className="font-bengali text-xl text-ink dark:text-night-ink font-bold mb-1">
            {T("quizFinishedTitle")}
          </h2>
          <p className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted mb-5">
            {score} / {total} {T("quizCorrectOf")}
            {settings.timedQuiz && timeLeft === 0 ? T("quizTimeUp") : ""}
          </p>

          {missed.length > 0 && (
            <div className="text-left mb-5">
              <p className="font-bengali text-xs font-semibold text-shu dark:text-shu-glow mb-2">
                {T("quizReviewNeeded")} ({missed.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {missed.map((m) => (
                  <span
                    key={m.id}
                    className="font-mincho text-base border border-shu/30 dark:border-shu-glow/30 rounded-md px-2 py-1 bg-shu-soft dark:bg-shu/10 text-ink dark:text-night-ink"
                    title={`${m.reading} — ${m.meaning}`}
                  >
                    {isVocab ? m.reading : m.kanji}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => startNew("all")}
              className="font-bengali text-sm border border-ai-line dark:border-night-line text-ai dark:text-ai-glow rounded-md py-2 hover:bg-ai-soft dark:hover:bg-night-line transition-colors"
            >
              {T("quizAll")}
            </button>
            <button
              onClick={() => startNew("weak")}
              disabled={weakPool.length < 4}
              className="font-bengali text-sm border border-shu/40 dark:border-shu-glow/40 text-shu dark:text-shu-glow rounded-md py-2 hover:bg-shu-soft dark:hover:bg-shu/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {T("quizWeakOnly")} ({weakPool.length})
            </button>
          </div>
          <button
            onClick={goToSetup}
            className="w-full font-bengali text-xs text-ink-muted dark:text-night-ink-muted hover:text-shu dark:hover:text-shu-glow py-2 transition-colors"
          >
            {T("quizSetupTitle")}
          </button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="mb-3 flex items-center gap-2">
          {categorySelector}
          {restartButton}
        </div>
        <div className="text-center py-12 font-bengali text-ink-muted dark:text-night-ink-muted">
          {T("quizNoQuestionsForFilter")}
        </div>
      </div>
    );
  }

  const cat = categories.find((c) => c.key === q.category);
  const questionMain = isVocab ? q.reading : q.kanji;
  const showWordAbove = isVocab && settings.showVocabKanji;

  // ---------------- ACTIVE QUIZ SCREEN ----------------
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-3 flex items-center gap-2">
        {categorySelector}
        {restartButton}
      </div>

      <div className="flex items-center justify-between mb-3 text-xs font-mono text-ink-muted dark:text-night-ink-muted">
        <span>
          {T("quizQuestionOf")} {current + 1} / {total}
        </span>
        {settings.timedQuiz ? (
          <span className={timeLeft <= 30 ? "text-shu dark:text-shu-glow font-semibold" : ""}>
            ⏱ {formatTime(timeLeft)}
          </span>
        ) : (
          <span>
            {T("quizScore")} {score} / {answeredCount}
          </span>
        )}
      </div>
      <div className="w-full h-1 bg-ai-soft dark:bg-night-line rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-ai transition-all"
          style={{ width: `${(answeredCount / total) * 100}%` }}
        />
      </div>

      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bengali text-[11px] bg-ai-soft dark:bg-night-line text-ai dark:text-ai-glow rounded-full px-2 py-0.5">
            {pickLang(cat, lang)}
          </span>
          {mode === "weak" && (
            <span className="font-bengali text-[11px] text-shu dark:text-shu-glow">
              {T("quizWeakReviewBadge")}
            </span>
          )}
        </div>

        <p className="text-center font-bengali text-xs text-ink-muted dark:text-night-ink-muted mb-3">
          {isVocab ? T("quizQuestionVocab") : T("quizQuestionKanji")}
        </p>
        <div className="flex flex-col items-center gap-1 mb-5">
          {showWordAbove && (
            <div className="font-mincho text-2xl text-ai dark:text-ai-glow">{q.kanji}</div>
          )}
          <div className="font-mincho text-4xl sm:text-5xl min-w-28 px-4 h-24 flex items-center justify-center bg-washi dark:bg-night border border-ai-line dark:border-night-line rounded-lg text-ink dark:text-night-ink text-center">
            {questionMain}
          </div>
        </div>

        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            let style =
              "border-ai-line dark:border-night-line bg-paper dark:bg-night-paper hover:border-ai/40 dark:hover:border-ai-glow/40";
            if (answered) {
              if (opt.correct) style = "border-take bg-take-soft dark:bg-take/10";
              else if (idx === selected) style = "border-shu bg-shu-soft dark:bg-shu/10";
              else
                style =
                  "border-ai-line dark:border-night-line bg-washi dark:bg-night opacity-50";
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full text-left border rounded-md px-3 py-2 transition-colors ${style} ${
                  !answered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-ink-muted dark:text-night-ink-muted font-semibold w-4">
                    {LETTERS[idx]}
                  </span>
                  {isVocab ? (
                    <span className="font-bengali text-sm text-ink dark:text-night-ink">
                      {opt.primary}
                    </span>
                  ) : (
                    <>
                      <span className="font-mincho text-lg text-ink dark:text-night-ink">
                        {opt.primary}
                      </span>
                      {showMeaning && (
                        <span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
                          {opt.secondary}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="flex items-center justify-end mt-4">
            <button
              onClick={goNext}
              className="font-bengali text-sm bg-ai dark:bg-ai-glow text-washi dark:text-night rounded-md px-4 py-2 hover:opacity-90 transition-opacity"
            >
              {current === total - 1 ? T("quizResultButton") : T("quizNextButton")} →
            </button>
          </div>
        )}
      </div>

      <p className="text-center font-mono text-[10px] text-ink-muted/60 dark:text-night-ink-muted/60 mt-3">
        {T("quizListenHint")}
      </p>
    </div>
  );
}
