import { useEffect, useMemo, useState } from "react";
import { t, pickLang } from "../lib/i18n.js";

const PAGE_SIZE = 60;

function CheckButton({ learned, onClick, labelOn, labelOff }) {
  return (
    <button
      onClick={onClick}
      aria-label={learned ? labelOn : labelOff}
      title={learned ? labelOn : labelOff}
      className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full border transition-colors ${
        learned
          ? "border-take bg-take text-washi dark:border-take-glow dark:bg-take-glow dark:text-night"
          : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-take hover:text-take dark:hover:border-take-glow dark:hover:text-take-glow"
      }`}
    >
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
        <path
          d="M4 10.5l4 4 8-9"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function Reference({ moduleKey, kanjiData, categories, progress, setLearned, settings }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const isVocab = moduleKey === "vocabulary";
  const showWord = isVocab ? settings.showVocabKanji : true;
  const showMeaning = isVocab ? true : settings.showKanjiBn;
  const meaningText = (item) =>
    isVocab && settings.vocabLang === "en" ? item.meaningEn || item.meaning : item.meaning;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(timer);
  }, [query]);

  const availableCategories = useMemo(() => {
    const used = new Set(kanjiData.map((k) => k.category));
    return categories.filter((c) => used.has(c.key));
  }, [kanjiData, categories]);

  // Deliberately preserves the original dataset order (textbook/lesson
  // order) — never alphabetized or re-sorted.
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return kanjiData.filter((k) => {
      if (category !== "all" && k.category !== category) return false;
      if (!q) return true;
      return (
        k.kanji.toLowerCase().includes(q) ||
        k.reading.toLowerCase().includes(q) ||
        k.meaning.toLowerCase().includes(q) ||
        (k.meaningEn && k.meaningEn.toLowerCase().includes(q))
      );
    });
  }, [kanjiData, debouncedQuery, category]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedQuery, category, kanjiData]);

  const visible = filtered.slice(0, visibleCount);

  const gridCols = showWord
    ? "grid-cols-[2.5rem_5rem_1fr_auto] sm:grid-cols-[3.5rem_6rem_1fr_7rem_auto]"
    : "grid-cols-[6rem_1fr_auto] sm:grid-cols-[8rem_1fr_7rem_auto]";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={T("searchPlaceholder")}
          className="font-bengali flex-1 border border-ai-line dark:border-night-line rounded-md px-3 py-1.5 text-sm bg-paper dark:bg-night-paper text-ink dark:text-night-ink placeholder:text-ink-muted/60"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="font-bengali border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 text-sm bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
        >
          <option value="all">
            {T("allCategories")} ({kanjiData.length})
          </option>
          {availableCategories.map((c) => (
            <option key={c.key} value={c.key}>
              {pickLang(c, lang)}
            </option>
          ))}
        </select>
      </div>

      <div className="text-[11px] font-mono text-ink-muted dark:text-night-ink-muted mb-2">
        {filtered.length} {T("showingCountOf")} {visible.length} {T("showingCountShown")}
      </div>

      <div className="border border-ai-line dark:border-night-line rounded-lg overflow-hidden bg-paper dark:bg-night-paper">
        <div
          className={`grid ${gridCols} gap-2 px-3 py-2 bg-ai-soft dark:bg-night-line/60 border-b border-ai-line dark:border-night-line text-[10px] font-bengali font-semibold text-ai dark:text-ai-glow uppercase tracking-wide`}
        >
          {showWord && <span>{T("colWord")}</span>}
          <span>{T("colReading")}</span>
          {showMeaning && <span>{T("colMeaning")}</span>}
          <span className="hidden sm:block">{T("colCategory")}</span>
          <span className="text-right">{T("colStatus")}</span>
        </div>

        <div className="divide-y divide-ai-line dark:divide-night-line">
          {visible.map((k) => {
            const learned = !!progress[k.id]?.learned;
            const cat = categories.find((c) => c.key === k.category);
            return (
              <div
                key={k.id}
                className={`grid ${gridCols} gap-2 px-3 py-2.5 items-start hover:bg-washi dark:hover:bg-night transition-colors`}
              >
                {showWord && (
                  <span className="font-mincho text-lg leading-snug text-ink dark:text-night-ink break-words">
                    {k.kanji}
                  </span>
                )}
                <span className="font-mincho text-sm leading-snug text-ai dark:text-ai-glow break-words">
                  {k.reading}
                </span>
                {showMeaning && (
                  <span className="font-bengali text-xs leading-snug text-ink dark:text-night-ink break-words">
                    {meaningText(k)}
                  </span>
                )}
                <span className="hidden sm:block font-bengali text-[10px] text-ai dark:text-ai-glow bg-ai-soft dark:bg-night-line rounded-full px-2 py-0.5 h-fit w-fit">
                  {pickLang(cat, lang)}
                </span>
                <div className="flex justify-end">
                  <CheckButton
                    learned={learned}
                    onClick={() => setLearned(k.id, !learned)}
                    labelOn={T("markAsUnlearned")}
                    labelOff={T("markAsLearned")}
                  />
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
              {T("noResults")}
            </div>
          )}
        </div>

        {visibleCount < filtered.length && (
          <div className="p-3 text-center border-t border-ai-line dark:border-night-line">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="font-bengali text-xs border border-ai-line dark:border-night-line rounded-md px-4 py-1.5 text-ai dark:text-ai-glow hover:bg-ai-soft dark:hover:bg-night-line transition-colors"
            >
              {T("loadMore")} ({filtered.length - visibleCount} {T("itemsLeft")})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
