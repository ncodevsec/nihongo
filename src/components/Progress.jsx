import { useMemo, useState } from "react";
import { t, pickLang } from "../lib/i18n.js";
import Hanko from "./Hanko.jsx";
import { classifyPartOfSpeech, POS_CATEGORIES, classifyCounting, COUNTING_CATEGORIES } from "../lib/vocabClassify.js";

function toDateKey(d) {
  return d.toISOString().slice(0, 10);
}

function computeStreak(activity) {
  const today = new Date();
  let cursor = new Date(today);
  // If nothing logged today yet, start checking from yesterday so a
  // still-unbroken streak from previous days doesn't read as zero.
  if (!activity[toDateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (activity[toDateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function last14Days(activity) {
  const days = [];
  const cursor = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() - i);
    const key = toDateKey(d);
    days.push({ key, count: activity[key] || 0, weekday: d.getDay() });
  }
  return days;
}

export default function Progress({ kanjiData, categories, progress, resetProgress, settings, activity = {}, favorites = {}, moduleKey }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const [confirmingReset, setConfirmingReset] = useState(false);
  const isVocab = moduleKey === "vocabulary";
  const [groupBy, setGroupBy] = useState("lesson"); // 'lesson' | 'pos' | 'count' (vocab only)

  const stats = useMemo(() => {
    const relevantIds = new Set(kanjiData.map((k) => k.id));
    const entries = kanjiData.map((k) => progress[k.id]);

    const seen = entries.reduce((s, e) => s + (e?.seen || 0), 0);
    const correct = entries.reduce((s, e) => s + (e?.correct || 0), 0);
    const mastered = entries.filter((e) => e?.learned).length;
    const learning = entries.filter((e) => e && !e.learned && e.seen > 0).length;
    const untouched = kanjiData.length - mastered - learning;
    const accuracy = seen ? Math.round((correct / seen) * 100) : 0;
    const starred = kanjiData.filter((k) => favorites[k.id]).length;

    const categoryList =
      groupBy === "pos" ? POS_CATEGORIES : groupBy === "count" ? COUNTING_CATEGORIES : categories;
    const categoryOf = (item) => {
      if (groupBy === "pos") return classifyPartOfSpeech(item);
      if (groupBy === "count") return classifyCounting(item);
      return item.category;
    };

    const byCategory = categoryList
      .map((c) => {
        const items = kanjiData.filter((k) => categoryOf(k) === c.key);
        const done = items.filter((k) => progress[k.id]?.learned).length;
        const started = items.filter((k) => progress[k.id]?.seen > 0 && !progress[k.id]?.learned).length;
        return { ...c, done, started, total: items.length };
      })
      .filter((c) => c.total > 0);

    return { mastered, learning, untouched, accuracy, seen, byCategory, starred, relevantIds };
  }, [kanjiData, categories, progress, favorites, groupBy]);

  const streak = useMemo(() => computeStreak(activity), [activity]);
  const days = useMemo(() => last14Days(activity), [activity]);
  const maxDayCount = Math.max(1, ...days.map((d) => d.count));

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    resetProgress();
    setConfirmingReset(false);
  };

  const total = kanjiData.length;
  const masteredPct = total ? (stats.mastered / total) * 100 : 0;
  const learningPct = total ? (stats.learning / total) * 100 : 0;
  const untouchedPct = total ? (stats.untouched / total) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Overview — four balanced stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-3 flex flex-col items-center gap-1.5 text-center">
          <Hanko label={`${stats.mastered}`} tone="take" size="sm" />
          <span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
            {T("progressMastered")}
          </span>
        </div>
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-3 flex flex-col items-center gap-1.5 text-center">
          <Hanko label={`${stats.accuracy}%`} tone="sakura" size="sm" />
          <span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
            {T("progressAccuracyLabel")}
          </span>
        </div>
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-3 flex flex-col items-center gap-1.5 text-center">
          <Hanko label={`${stats.seen}`} tone="shu" size="sm" />
          <span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
            {T("progressAnswered")}
          </span>
        </div>
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-3 flex flex-col items-center gap-1.5 text-center">
          <Hanko label={`${stats.starred}`} tone="ai" size="sm" />
          <span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted leading-tight">
            {T("progressStarred")}
          </span>
        </div>
      </div>

      {/* Status breakdown — New / Learning / Mastered */}
      <h2 className="font-bengali text-sm font-bold text-ink dark:text-night-ink mb-2">
        {T("progressStatusBreakdown")}
      </h2>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-4 mb-5">
        <div className="w-full h-3 rounded-full overflow-hidden flex mb-3 bg-ai-soft dark:bg-night-line">
          {masteredPct > 0 && <div className="h-full bg-take" style={{ width: `${masteredPct}%` }} />}
          {learningPct > 0 && <div className="h-full bg-sakura" style={{ width: `${learningPct}%` }} />}
          {untouchedPct > 0 && (
            <div className="h-full bg-ai-line dark:bg-night-line" style={{ width: `${untouchedPct}%` }} />
          )}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bengali">
          <span className="flex items-center gap-1.5 text-ink dark:text-night-ink">
            <span className="w-2.5 h-2.5 rounded-full bg-take inline-block" />
            {T("statusMastered")} <span className="font-mono text-ink-muted dark:text-night-ink-muted">({stats.mastered})</span>
          </span>
          <span className="flex items-center gap-1.5 text-ink dark:text-night-ink">
            <span className="w-2.5 h-2.5 rounded-full bg-sakura inline-block" />
            {T("statusLearning")} <span className="font-mono text-ink-muted dark:text-night-ink-muted">({stats.learning})</span>
          </span>
          <span className="flex items-center gap-1.5 text-ink dark:text-night-ink">
            <span className="w-2.5 h-2.5 rounded-full bg-ai-line dark:bg-night-line inline-block" />
            {T("statusNew")} <span className="font-mono text-ink-muted dark:text-night-ink-muted">({stats.untouched})</span>
          </span>
        </div>
      </div>

      {/* Streak + 14-day activity */}
      <h2 className="font-bengali text-sm font-bold text-ink dark:text-night-ink mb-2">
        {T("progressActivity")}
      </h2>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-4 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <Hanko label={`${streak}`} tone="shu" size="sm" />
          <div>
            <div className="font-bengali text-sm text-ink dark:text-night-ink font-semibold">
              {T("progressStreak")}
            </div>
            <div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">
              {T("progressStreakSub")}
            </div>
          </div>
        </div>
        <div className="flex items-end gap-1.5">
          {days.map((d) => {
            const intensity = d.count === 0 ? 0 : Math.min(1, d.count / maxDayCount);
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-sm ${d.count > 0 ? "bg-shu" : "bg-ai-soft dark:bg-night-line"}`}
                  style={{ height: 28, opacity: d.count > 0 ? 0.35 + intensity * 0.65 : 1 }}
                  title={`${d.key}: ${d.count}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1 font-mono text-[9px] text-ink-muted dark:text-night-ink-muted">
          <span>{T("progressFourteenDaysAgo")}</span>
          <span>{T("progressToday")}</span>
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <h2 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">
          {T("progressByCategory")}
        </h2>
        {isVocab && (
          <div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden">
            {[
              { key: "lesson", label: T("groupByLesson") },
              { key: "pos", label: T("groupByPos") },
              { key: "count", label: T("groupByCount") },
            ].map((g) => (
              <button
                key={g.key}
                onClick={() => setGroupBy(g.key)}
                className={`px-2.5 py-1 text-[11px] font-bengali font-medium transition-colors ${
                  groupBy === g.key
                    ? "bg-ai text-washi"
                    : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg divide-y divide-ai-line dark:divide-night-line mb-6">
        {stats.byCategory.map((c) => {
          const donePct = c.total ? (c.done / c.total) * 100 : 0;
          const startedPct = c.total ? (c.started / c.total) * 100 : 0;
          return (
            <div key={c.key} className="px-4 py-2.5">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bengali text-ink dark:text-night-ink font-medium">
                  {pickLang(c, lang)}
                </span>
                <span className="font-mono text-ink-muted dark:text-night-ink-muted">
                  {c.done}/{c.total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-ai-soft dark:bg-night-line rounded-full overflow-hidden flex">
                <div className="h-full bg-take transition-all" style={{ width: `${donePct}%` }} />
                <div className="h-full bg-sakura transition-all" style={{ width: `${startedPct}%` }} />
              </div>
            </div>
          );
        })}
        {stats.byCategory.length === 0 && (
          <div className="px-4 py-8 text-center font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
            {T("noItemsInFilter")}
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={handleReset}
          className={`font-bengali text-xs rounded-md px-3 py-1.5 border transition-colors ${
            confirmingReset
              ? "border-shu bg-shu text-washi"
              : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-shu hover:text-shu"
          }`}
        >
          {confirmingReset ? T("resetProgressConfirm") : T("resetProgress")}
        </button>
      </div>
    </div>
  );
}
