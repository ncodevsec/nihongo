import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { t } from "../../lib/i18n.js";
import Hanko from "../Hanko.jsx";
import CategoryMultiSelect from "../CategoryMultiSelect.jsx";
import { flattenGrammarPoints, grammarCategories, grammarParticleCategories, buildGrammarQuestions, shuffle } from "../../lib/grammarUtils.js";

const LETTERS = ["A", "B", "C", "D"];
const LENGTH_OPTIONS = ["all", "10", "20", "50"];

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function GrammarQuiz({ lessons, level, settings, updateSetting = () => {}, recordQuizResult }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const allPoints = useMemo(() => flattenGrammarPoints(lessons, level), [lessons, level]);
  const categories = useMemo(() => grammarCategories(lessons), [lessons]);
  const particleCategories = useMemo(() => grammarParticleCategories(lessons), [lessons]);

  const [phase, setPhase] = useState("setup");
  const [setupGroupBy, setSetupGroupBy] = useState("lesson"); // 'lesson' | 'particle'
  const [setupFilters, setSetupFilters] = useState([]); // [] = all
  const [setupLength, setSetupLength] = useState(settings.quizLength);
  const [setupTimed, setSetupTimed] = useState(settings.timedQuiz);
  const [setupMinutes, setSetupMinutes] = useState(settings.timedMinutes);

  useEffect(() => {
    setPhase("setup");
    setSetupGroupBy("lesson");
    setSetupFilters([]);
  }, [allPoints]);

  useEffect(() => {
    setSetupFilters([]);
  }, [setupGroupBy]);

  const setupPool = useMemo(() => {
    if (setupFilters.length === 0) return allPoints;
    if (setupGroupBy === "particle") return allPoints.filter((p) => setupFilters.includes(p.particle || "other"));
    return allPoints.filter((p) => setupFilters.includes(p.category));
  }, [allPoints, setupFilters, setupGroupBy]);
  const setupAvailableCount =
    setupLength === "all" ? setupPool.length : Math.min(Number(setupLength), setupPool.length);

  const [activeFilters, setActiveFilters] = useState([]); // [] = all
  const [runId, setRunId] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState({});
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timed, setTimed] = useState(false);
  const timerRef = useRef(null);

  const pool = useMemo(
    () => (activeFilters.length === 0 ? allPoints : allPoints.filter((p) => activeFilters.includes(p.category))),
    [allPoints, activeFilters]
  );

  const applyLength = (list, len) => {
    if (len === "all") return list;
    const n = Number(len);
    return list.slice(0, Math.min(n, list.length));
  };

  const startRun = useCallback((lf, len, isTimed, minutes, source) => {
    setActiveFilters(lf);
    setQuestions(applyLength(shuffle(buildGrammarQuestions(source)), len));
    setCurrent(0);
    setResults({});
    setSelected(null);
    setAnswered(false);
    setFinished(false);
    setTimed(isTimed);
    setTimeLeft(isTimed ? minutes * 60 : 0);
    setRunId((id) => id + 1);
    setPhase("active");
  }, []);

  const handleStartFromSetup = () => {
    updateSetting("quizLength", setupLength);
    updateSetting("timedQuiz", setupTimed);
    updateSetting("timedMinutes", setupMinutes);
    startRun(setupFilters, setupLength, setupTimed, setupMinutes, setupPool);
  };

  const goToSetup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("setup");
  };

  useEffect(() => {
    if (phase !== "active" || !timed || finished) {
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
  }, [phase, timed, finished, runId]);

  const total = questions.length;
  const q = questions[current];
  const answeredCount = Object.keys(results).length;
  const score = Object.values(results).filter((r) => r === "correct").length;

  const handleSelect = (idx) => {
    if (answered || !q) return;
    const opt = q.options[idx];
    const outcome = opt.correct ? "correct" : "wrong";
    setResults((r) => ({ ...r, [current]: outcome }));
    setSelected(idx);
    setAnswered(true);
    recordQuizResult(q.id, opt.correct);
  };

  const goNext = () => {
    if (current === total - 1) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  const activeFilterLabel =
    activeFilters.length === 0
      ? T("allCategories")
      : activeFilters.length === 1
      ? (categories.find((c) => c.key === activeFilters[0]) || { en: activeFilters[0] }).en
      : `${activeFilters.length} ${T("allCategories")}`;
  const lessonBadge = (
    <span className="font-bengali text-xs border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted truncate">
      {activeFilterLabel}
    </span>
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

  if (allPoints.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 font-bengali text-ink-muted dark:text-night-ink-muted">
        {T("grammarComingSoon")}
      </div>
    );
  }

  // ---------------- SETUP SCREEN ----------------
  if (phase === "setup") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-5">
          <h2 className="font-bengali text-lg font-bold text-ink dark:text-night-ink mb-4">
            {T("quizSetupTitle")}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted block mb-1.5">
                {T("quizSetupCategory")}
              </label>
              <div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden mb-2 w-fit">
                <button
                  onClick={() => setSetupGroupBy("lesson")}
                  className={`px-2.5 py-1.5 text-xs font-bengali font-medium transition-colors ${
                    setupGroupBy === "lesson"
                      ? "bg-shu text-washi"
                      : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
                  }`}
                >
                  {T("groupByLesson")}
                </button>
                <button
                  onClick={() => setSetupGroupBy("particle")}
                  className={`px-2.5 py-1.5 text-xs font-bengali font-medium transition-colors ${
                    setupGroupBy === "particle"
                      ? "bg-shu text-washi"
                      : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
                  }`}
                >
                  {T("groupByParticle")}
                </button>
              </div>
              <CategoryMultiSelect
                categories={setupGroupBy === "particle" ? particleCategories : categories}
                selected={setupFilters}
                onChange={setSetupFilters}
                lang={lang}
                allLabel={T("allCategories")}
              />
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

  if (finished) {
    const pct = total ? Math.round((score / total) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-3 flex items-center gap-2">
          {lessonBadge}
          {restartButton}
        </div>
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-6">
          <div className="flex justify-center mb-4">
            <Hanko label={`${pct}%`} tone={pct >= 80 ? "take" : "shu"} size="lg" />
          </div>
          <h2 className="font-bengali text-xl text-ink dark:text-night-ink font-bold mb-1">
            {T("quizFinishedTitle")}
          </h2>
          <p className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted mb-5">
            {score} / {total} {T("quizCorrectOf")}
          </p>
          <button
            onClick={goToSetup}
            className="font-bengali text-sm border border-ai-line dark:border-night-line text-ai dark:text-ai-glow rounded-md py-2 px-6 hover:bg-ai-soft dark:hover:bg-night-line transition-colors"
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
          {lessonBadge}
          {restartButton}
        </div>
        <div className="text-center py-12 font-bengali text-ink-muted dark:text-night-ink-muted">
          {T("quizNoQuestionsForFilter")}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-3 flex items-center gap-2">
        {lessonBadge}
        {restartButton}
      </div>

      <div className="flex items-center justify-between mb-3 text-xs font-mono text-ink-muted dark:text-night-ink-muted">
        <span>
          {T("quizQuestionOf")} {current + 1} / {total}
        </span>
        {timed ? (
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
        <div className="h-full bg-ai transition-all" style={{ width: `${(answeredCount / total) * 100}%` }} />
      </div>

      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bengali text-[11px] bg-ai-soft dark:bg-night-line text-ai dark:text-ai-glow rounded-full px-2 py-0.5">
            Lesson {q.lesson}
          </span>
        </div>

        <p className="text-center font-bengali text-xs text-ink-muted dark:text-night-ink-muted mb-1">
          {T("grammarQuizFillBlank")}
        </p>
        <div className="font-mincho text-xl sm:text-2xl text-center text-ink dark:text-night-ink px-2 py-5 mb-2 bg-washi dark:bg-night border border-ai-line dark:border-night-line rounded-lg leading-relaxed">
          {q.blanked}
        </div>
        {q.meaningBn && (
          <p className="text-center font-bengali text-xs text-ink-muted dark:text-night-ink-muted mb-5">
            {q.meaningBn}
          </p>
        )}

        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            let style =
              "border-ai-line dark:border-night-line bg-paper dark:bg-night-paper hover:border-ai/40 dark:hover:border-ai-glow/40";
            if (answered) {
              if (opt.correct) style = "border-take bg-take-soft dark:bg-take/10";
              else if (idx === selected) style = "border-shu bg-shu-soft dark:bg-shu/10";
              else style = "border-ai-line dark:border-night-line bg-washi dark:bg-night opacity-50";
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
                  <span className="font-mincho text-lg text-ink dark:text-night-ink">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted text-center mt-4">
              {q.headingBn}
            </p>
            <div className="flex items-center justify-end mt-3">
              <button
                onClick={goNext}
                className="font-bengali text-sm bg-ai dark:bg-ai-glow text-washi dark:text-night rounded-md px-4 py-2 hover:opacity-90 transition-opacity"
              >
                {current === total - 1 ? T("quizResultButton") : T("quizNextButton")} →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
