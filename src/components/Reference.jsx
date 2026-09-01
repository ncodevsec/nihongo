import { useEffect, useMemo, useState } from "react";
import { t, pickLang } from "../lib/i18n.js";
import { StarFilterButton, SortDirectionButton } from "./FilterControls.jsx";
import { classifyPartOfSpeech, POS_CATEGORIES, classifyCounting, COUNTING_CATEGORIES } from "../lib/vocabClassify.js";
import CategoryMultiSelect from "./CategoryMultiSelect.jsx";

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

function StarButton({ starred, onClick, labelOn, labelOff }) {
  return (
    <button
      onClick={onClick}
      aria-label={starred ? labelOn : labelOff}
      title={starred ? labelOn : labelOff}
      className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
        starred ? "text-shu dark:text-shu-glow" : "text-ink-muted/40 dark:text-night-ink-muted/40 dark:hover:text-shu-glow hover:text-shu"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3.5z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function Reference({ moduleKey, kanjiData, categories, progress, setLearned, settings, favorites = {}, toggleFavorite = () => {} }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const isVocab = moduleKey === "vocabulary";
  const showWord = isVocab ? settings.showVocabKanji : true;
  const showMeaning = isVocab ? true : settings.showKanjiBn;
  const meaningText = (item) =>
    isVocab && settings.vocabLang === "en" ? item.meaningEn || item.meaning : item.meaning;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [groupBy, setGroupBy] = useState("lesson"); // 'lesson' | 'pos' (vocab only)
  const [selectedCategories, setSelectedCategories] = useState([]); // [] = all
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sortBy, setSortBy] = useState("lesson");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setSelectedCategories([]);
  }, [groupBy]);

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

  const categoryOf = (item) => {
    if (groupBy === "pos") return classifyPartOfSpeech(item);
    if (groupBy === "count") return classifyCounting(item);
    return item.category;
  };

  // "lesson" keeps the original dataset order (textbook/lesson order),
  // using each category's position in the shared category list as the
  // sort key so it stays stable even after filtering.
  const categoryIndex = useMemo(() => {
    const map = new Map();
    categories.forEach((c, i) => map.set(c.key, i));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return kanjiData.filter((k) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(categoryOf(k))) return false;
      if (onlyStarred && !favorites[k.id]) return false;
      if (!q) return true;
      return (
        k.kanji.toLowerCase().includes(q) ||
        k.reading.toLowerCase().includes(q) ||
        k.meaning.toLowerCase().includes(q) ||
        (k.meaningEn && k.meaningEn.toLowerCase().includes(q))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kanjiData, debouncedQuery, selectedCategories, groupBy, onlyStarred, favorites]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "word") {
        cmp = a.kanji.localeCompare(b.kanji, "ja");
      } else if (sortBy === "reading") {
        cmp = a.reading.localeCompare(b.reading, "ja");
      } else if (sortBy === "meaning") {
        cmp = meaningText(a).localeCompare(meaningText(b), lang === "bn" ? "bn" : "en");
      } else if (sortBy === "status") {
        const la = progress[a.id]?.learned ? 1 : 0;
        const lb = progress[b.id]?.learned ? 1 : 0;
        cmp = la - lb;
      } else {
        // lesson (default): original textbook order via category index
        cmp = (categoryIndex.get(a.category) ?? 0) - (categoryIndex.get(b.category) ?? 0);
      }
      return cmp * dir;
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sortBy, sortDir, categoryIndex, lang, progress]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedQuery, selectedCategories, onlyStarred, kanjiData, sortBy, sortDir]);

  const visible = sorted.slice(0, visibleCount);

  const gridCols = showWord
    ? "grid-cols-[2.5rem_5rem_1fr_auto_auto] sm:grid-cols-[3.5rem_6rem_1fr_7rem_auto_auto]"
    : "grid-cols-[6rem_1fr_auto_auto] sm:grid-cols-[8rem_1fr_7rem_auto_auto]";

  const SORT_OPTIONS = [
    { key: "lesson", label: T("sortLesson") },
    { key: "word", label: T("sortWord") },
    { key: "reading", label: T("sortReading") },
    ...(showMeaning ? [{ key: "meaning", label: T("sortMeaning") }] : []),
    { key: "status", label: T("sortStatus") },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={T("searchPlaceholder")}
          className="font-bengali flex-1 border border-ai-line dark:border-night-line rounded-md px-3 py-1.5 text-sm bg-paper dark:bg-night-paper text-ink dark:text-night-ink placeholder:text-ink-muted/60"
        />
        {isVocab && (
          <div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden shrink-0">
            {[
              { key: "lesson", label: T("groupByLesson") },
              { key: "pos", label: T("groupByPos") },
              { key: "count", label: T("groupByCount") },
            ].map((g) => (
              <button
                key={g.key}
                onClick={() => setGroupBy(g.key)}
                className={`px-2.5 py-1.5 text-sm font-bengali font-medium transition-colors ${
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
        <div className="sm:w-44 shrink-0">
          <CategoryMultiSelect
            categories={
              groupBy === "pos" ? availablePosCategories : groupBy === "count" ? availableCountingCategories : availableCategories
            }
            selected={selectedCategories}
            onChange={setSelectedCategories}
            lang={lang}
            allLabel={`${T("allCategories")} (${kanjiData.length})`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted shrink-0">
          {T("sortBy")}
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="font-bengali border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 text-xs bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
        <SortDirectionButton
          dir={sortDir}
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          labelAsc={T("sortAsc")}
          labelDesc={T("sortDesc")}
        />
        <div className="ml-auto">
          <StarFilterButton
            active={onlyStarred}
            onClick={() => setOnlyStarred((v) => !v)}
            labelOn={T("onlyStarred")}
            labelOff={T("onlyStarred")}
          />
        </div>
      </div>

      <div className="text-[11px] font-mono text-ink-muted dark:text-night-ink-muted mb-2">
        {sorted.length} {T("showingCountOf")} {visible.length} {T("showingCountShown")}
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
          <span aria-hidden="true"></span>
        </div>

        <div className="divide-y divide-ai-line dark:divide-night-line">
          {visible.map((k) => {
            const learned = !!progress[k.id]?.learned;
            const starred = !!favorites[k.id];
            const cat =
              groupBy === "pos"
                ? POS_CATEGORIES.find((c) => c.key === classifyPartOfSpeech(k))
                : groupBy === "count"
                ? COUNTING_CATEGORIES.find((c) => c.key === classifyCounting(k))
                : categories.find((c) => c.key === k.category);
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
                <span className="font-mincho text-sm leading-snug text-ink dark:text-night-ink break-words">
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
                <div className="flex justify-end">
                  <StarButton
                    starred={starred}
                    onClick={() => toggleFavorite(k.id)}
                    labelOn={T("markAsUnstarred")}
                    labelOff={T("markAsStarred")}
                  />
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="px-3 py-8 text-center font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
              {T("noResults")}
            </div>
          )}
        </div>

        {visibleCount < sorted.length && (
          <div className="p-3 text-center border-t border-ai-line dark:border-night-line">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="font-bengali text-xs border border-ai-line dark:border-night-line rounded-md px-4 py-1.5 text-ai dark:text-ai-glow hover:bg-ai-soft dark:hover:bg-night-line transition-colors"
            >
              {T("loadMore")} ({sorted.length - visibleCount} {T("itemsLeft")})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
