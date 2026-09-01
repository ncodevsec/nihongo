import { useMemo, useState } from "react";
import { t, pickLang } from "../lib/i18n.js";
import Hanko from "./Hanko.jsx";

export default function Progress({ kanjiData, categories, progress, resetProgress, settings }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const [confirmingReset, setConfirmingReset] = useState(false);

  const stats = useMemo(() => {
    const relevantIds = new Set(kanjiData.map((k) => k.id));
    const entries = Object.entries(progress)
      .filter(([id]) => relevantIds.has(id))
      .map(([, v]) => v);

    const seen = entries.reduce((s, e) => s + e.seen, 0);
    const correct = entries.reduce((s, e) => s + e.correct, 0);
    const mastered = entries.filter((e) => e.learned).length;
    const accuracy = seen ? Math.round((correct / seen) * 100) : 0;

    const byCategory = categories
      .map((c) => {
        const items = kanjiData.filter((k) => k.category === c.key);
        const done = items.filter((k) => progress[k.id]?.learned).length;
        return { ...c, done, total: items.length };
      })
      .filter((c) => c.total > 0);

    return { mastered, accuracy, seen, byCategory };
  }, [kanjiData, categories, progress]);

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    resetProgress();
    setConfirmingReset(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-4 flex flex-row sm:flex-col items-center gap-3 sm:gap-2">
          <Hanko label={`${stats.mastered}`} sub={T("progressMastered")} tone="take" size="md" />
          <span className="font-bengali text-[12px] sm:text-[11px] text-ink-muted dark:text-night-ink-muted text-left sm:text-center">
            {kanjiData.length} {T("progressMasteredOf")}
          </span>
        </div>
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-4 flex flex-row sm:flex-col items-center gap-3 sm:gap-2">
          <Hanko label={`${stats.accuracy}%`} sub={T("progressAccuracyLabel")} tone="ai" size="md" />
          <span className="font-bengali text-[12px] sm:text-[11px] text-ink-muted dark:text-night-ink-muted text-left sm:text-center">
            {T("progressOverallAccuracy")}
          </span>
        </div>
        <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-4 flex flex-row sm:flex-col items-center gap-3 sm:gap-2">
          <Hanko label={`${stats.seen}`} sub={T("progressAnswered")} tone="shu" size="md" />
          <span className="font-bengali text-[12px] sm:text-[11px] text-ink-muted dark:text-night-ink-muted text-left sm:text-center">
            {T("progressTotalAnswered")}
          </span>
        </div>
      </div>

      <h2 className="font-bengali text-sm font-bold text-ink dark:text-night-ink mb-2">
        {T("progressByCategory")}
      </h2>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg divide-y divide-ai-line dark:divide-night-line mb-6">
        {stats.byCategory.map((c) => {
          const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
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
              <div className="w-full h-1.5 bg-ai-soft dark:bg-night-line rounded-full overflow-hidden">
                <div className="h-full bg-shu transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
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
