import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shuffle } from "../lib/utils.js";
import { useHotkeys } from "../hooks/useHotkeys.js";
import { t, pickLang } from "../lib/i18n.js";
import Hanko from "./Hanko.jsx";

const LETTERS = ["A", "B", "C", "D"];

function buildQuestions(pool, allData, { isVocab, vocabLang }) {
  const textOf = (d) => (isVocab && vocabLang === "en" ? d.meaningEn || d.meaning : d.meaning);
  const shuffledPool = shuffle(pool);
  const shuffledAll = shuffle(allData);
  const total = shuffledAll.length;
  let cursor = 0;

  return shuffledPool.map((item) => {
    const correctKey = isVocab ? textOf(item) : item.reading;
    const distractors = [];
    let scanned = 0;
    while (distractors.length < 3 && scanned < total) {
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

export default function Quiz({ moduleKey, kanjiData, categories, progress, recordQuizResult, settings }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const isVocab = moduleKey === "vocabulary";
  const showMeaning = isVocab ? true : settings.showKanjiBn;
  const buildOpts = { isVocab, vocabLang: settings.vocabLang };

  const [category, setCategory] = useState("all");

  const availableCategories = useMemo(() => {
    const used = new Set(kanjiData.map((k) => k.category));
    return categories.filter((c) => used.has(c.key));
  }, [kanjiData, categories]);

  const categoryFiltered = useMemo(() => {
    return category === "all" ? kanjiData : kanjiData.filter((k) => k.category === category);
  }, [kanjiData, category]);

  const applyLength = useCallback(
    (list) => {
      if (settings.quizLength === "all") return list;
      const n = Number(settings.quizLength);
      return list.slice(0, Math.min(n, list.length));
    },
    [settings.quizLength]
  );

  const [mode, setMode] = useState("all");
  const [runId, setRunId] = useState(0);
  const [questions, setQuestions] = useState(() =>
    applyLength(buildQuestions(kanjiData, kanjiData, buildOpts))
  );
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState({});
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timedMinutes * 60);
  const timerRef = useRef(null);

  const resetRun = useCallback(
    (nextMode, source) => {
      setMode(nextMode);
      setQuestions(applyLength(buildQuestions(source, kanjiData, buildOpts)));
      setCurrent(0);
      setResults({});
      setSelected(null);
      setAnswered(false);
      setFinished(false);
      setTimeLeft(settings.timedMinutes * 60);
      setRunId((id) => id + 1);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kanjiData, settings.vocabLang, settings.quizLength, settings.timedMinutes]
  );

  useEffect(() => {
    resetRun("all", categoryFiltered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kanjiData, category]);

  // Timed exam mode: countdown, auto-finish at zero. Restarts cleanly on
  // every new run via runId, rather than inferring restarts from state.
  useEffect(() => {
    if (!settings.timedQuiz || finished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [settings.timedQuiz, finished, runId]);

  const weakPool = useMemo(
    () =>
      categoryFiltered.filter((k) => {
        const p = progress[k.id];
        return p && !p.learned && p.wrong > 0;
      }),
    [categoryFiltered, progress]
  );

  const startNew = (nextMode) => {
    const m = nextMode ?? mode;
    const source = m === "weak" && weakPool.length >= 4 ? weakPool : categoryFiltered;
    resetRun(m, source);
  };

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
        if (finished || !q) return;
        if (!answered) {
          const i = LETTERS.indexOf(e.key.toUpperCase());
          if (i !== -1 && i < q.options.length) handleSelect(i);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goNext();
        }
      },
      [finished, q, answered, handleSelect, goNext]
    )
  );

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

  if (finished) {
    const pct = total ? Math.round((score / total) * 100) : 0;
    const missed = questions.filter((_, i) => results[i] === "wrong");
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-3 text-left">{categorySelector}</div>
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-sm p-6">
          <div className="flex justify-center mb-4">
            <Hanko label={`${pct}%`} sub={T("quizFinishedTitle")} tone={pct >= 80 ? "take" : "shu"} size="lg" />
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

          <div className="grid grid-cols-2 gap-2">
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
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="mb-3">{categorySelector}</div>
        <div className="text-center py-12 font-bengali text-ink-muted dark:text-night-ink-muted">
          {T("quizNoQuestionsForFilter")}
        </div>
      </div>
    );
  }

  const cat = categories.find((c) => c.key === q.category);
  const questionMain = isVocab ? q.reading : q.kanji;
  const showWordAbove = isVocab && settings.showVocabKanji;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-3">{categorySelector}</div>

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
