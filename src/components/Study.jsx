import { useCallback, useEffect, useMemo, useState } from "react";
import { shuffle } from "../lib/utils.js";
import { useHotkeys } from "../hooks/useHotkeys.js";
import { t, pickLang } from "../lib/i18n.js";
import { ToggleChip, StarFilterButton, ShuffleButton } from "./FilterControls.jsx";
import { classifyPartOfSpeech, POS_CATEGORIES, classifyCounting, COUNTING_CATEGORIES } from "../lib/vocabClassify.js";

export default function Study({ moduleKey, kanjiData, categories, progress, setLearned, settings, isActive = true, favorites = {}, toggleFavorite = () => {} }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const isVocab = moduleKey === "vocabulary";
  const showWord = isVocab ? settings.showVocabKanji : true;
  const showMeaning = isVocab ? true : settings.showKanjiBn;
  const meaningText = (item) =>
    isVocab && settings.vocabLang === "en" ? item.meaningEn || item.meaning : item.meaning;

  const [groupBy, setGroupBy] = useState("lesson"); // 'lesson' | 'pos' (vocab only)
  const [category, setCategory] = useState("all");
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [order, setOrder] = useState(() => shuffle(kanjiData.map((k) => k.id)));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(shuffle(kanjiData.map((k) => k.id)));
    setIndex(0);
    setFlipped(false);
    setGroupBy("lesson");
    setCategory("all");
    setOnlyUnlearned(false);
    setOnlyStarred(false);
  }, [kanjiData]);

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

  const categoryOf = useCallback(
    (item) => {
      if (groupBy === "pos") return classifyPartOfSpeech(item);
      if (groupBy === "count") return classifyCounting(item);
      return item.category;
    },
    [groupBy]
  );

  const pool = useMemo(() => {
    let list = kanjiData;
    if (category !== "all") list = list.filter((k) => categoryOf(k) === category);
    if (onlyUnlearned) list = list.filter((k) => !progress[k.id]?.learned);
    if (onlyStarred) list = list.filter((k) => favorites[k.id]);
    return list;
  }, [kanjiData, category, categoryOf, onlyUnlearned, onlyStarred, progress, favorites]);

  const deck = useMemo(() => {
    const poolIds = new Set(pool.map((k) => k.id));
    const kanjiById = new Map(kanjiData.map((k) => [k.id, k]));
    const orderedIds = order.filter((id) => poolIds.has(id));
    const seen = new Set(orderedIds);
    for (const k of pool) {
      if (!seen.has(k.id)) {
        orderedIds.push(k.id);
        seen.add(k.id);
      }
    }
    return orderedIds.map((id) => kanjiById.get(id)).filter(Boolean);
  }, [order, pool, kanjiData]);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [category, onlyUnlearned, onlyStarred]);

  useEffect(() => {
    setCategory("all");
  }, [groupBy]);

  useEffect(() => {
    if (index >= deck.length) setIndex(0);
  }, [deck.length, index]);

  const card = deck[index];
  const cat =
    card &&
    (groupBy === "pos"
      ? POS_CATEGORIES.find((c) => c.key === classifyPartOfSpeech(card))
      : groupBy === "count"
      ? COUNTING_CATEGORIES.find((c) => c.key === classifyCounting(card))
      : categories.find((c) => c.key === card.category));

  const reshuffle = () => {
    setOrder(shuffle(kanjiData.map((k) => k.id)));
    setIndex(0);
    setFlipped(false);
  };

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
  }, [deck.length]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i - 1 >= 0 ? i - 1 : deck.length - 1));
  }, [deck.length]);

  const mark = useCallback(
    (learned) => {
      if (!card) return;
      setLearned(card.id, learned);
      goNext();
    },
    [card, setLearned, goNext]
  );

  useHotkeys(
    useCallback(
      (e) => {
        if (!isActive) return;
        if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;
        if (e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        } else if (e.key === "ArrowRight") goNext();
        else if (e.key === "ArrowLeft") goPrev();
        else if (e.key.toLowerCase() === "l") mark(true);
        else if (e.key.toLowerCase() === "r") mark(false);
      },
      [isActive, goNext, goPrev, mark]
    )
  );

  const isLearned = card ? !!progress[card.id]?.learned : false;
  const frontText = card ? (showWord ? card.kanji : card.reading) : "";

  const filterRow = (
    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
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
              className={`px-2.5 py-1.5 font-bengali font-medium transition-colors ${
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

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="font-bengali border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
      >
        <option value="all">{T("allCategories")}</option>
        {(groupBy === "pos"
          ? availablePosCategories
          : groupBy === "count"
          ? availableCountingCategories
          : availableCategories
        ).map((c) => (
          <option key={c.key} value={c.key}>
            {pickLang(c, lang)}
          </option>
        ))}
      </select>

      <ToggleChip active={onlyUnlearned} onClick={() => setOnlyUnlearned((v) => !v)} title={T("onlyUnlearned")}>
        {T("onlyUnlearned")}
      </ToggleChip>

      <StarFilterButton
        active={onlyStarred}
        onClick={() => setOnlyStarred((v) => !v)}
        labelOn={T("onlyStarred")}
        labelOff={T("onlyStarred")}
      />

      <div className="ml-auto">
        <ShuffleButton onClick={reshuffle} label={T("shuffle")} />
      </div>
    </div>
  );

  if (!card) {
    return (
      <div className="max-w-lg mx-auto">
        {filterRow}
        <div className="text-center py-16 font-bengali text-ink-muted dark:text-night-ink-muted">
          {T("noItemsInFilter")}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {filterRow}

      <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted dark:text-night-ink-muted mb-1.5">
        <span>
          {index + 1} / {deck.length}
        </span>
        <span
          className={
            isLearned
              ? "text-take dark:text-take-glow font-semibold font-bengali"
              : "font-bengali"
          }
        >
          {isLearned ? `✓ ${T("alreadyLearned")}` : pickLang(cat, lang)}
        </span>
      </div>
      <div className="w-full h-1 bg-ai-soft dark:bg-night-line rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-shu transition-all"
          style={{ width: `${((index + 1) / deck.length) * 100}%` }}
        />
      </div>

      <div className="relative">
        <button
          onClick={() => toggleFavorite(card.id)}
          aria-label={favorites[card.id] ? T("markAsUnstarred") : T("markAsStarred")}
          title={favorites[card.id] ? T("markAsUnstarred") : T("markAsStarred")}
          className={`absolute top-2.5 right-2.5 z-10 w-11 h-11 flex items-center justify-center rounded-full transition-colors ${
            favorites[card.id]
              ? "text-shu dark:text-shu-glow bg-shu-soft dark:bg-shu/10"
              : "text-ink-muted/50 dark:text-night-ink-muted/50 hover:text-shu dark:hover:text-shu-glow hover:bg-shu-soft dark:hover:bg-shu/10"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill={favorites[card.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
            <path
              d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3.5z"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="w-full bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-sm active:shadow-md active:border-ai/30 dark:active:border-ai-glow/40 sm:hover:shadow-md sm:hover:border-ai/30 dark:sm:hover:border-ai-glow/40 text-left"
          style={{ minHeight: 260 }}
        >
          {!flipped ? (
            <div className="h-[260px] flex flex-col items-center justify-center gap-3">
              <div
                className={`font-mincho text-ink dark:text-night-ink text-center px-4 break-words ${
                  isVocab && !showWord ? "text-4xl sm:text-5xl" : "text-6xl sm:text-7xl"
                }`}
              >
                {frontText}
              </div>
              {showWord && isVocab && (
                <div className="font-mincho text-lg text-ai dark:text-ai-glow">{card.reading}</div>
              )}
              <span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
                {T("tapToRevealMeaning")}
              </span>
            </div>
          ) : (
            <div className="h-[260px] flex flex-col items-center justify-center gap-3 px-6">
              {!isVocab && (
                <div className="font-mincho text-3xl sm:text-4xl text-ai dark:text-ai-glow text-center">
                  {card.reading}
                </div>
              )}
              {showMeaning ? (
                <div
                  className={`font-bengali text-ink dark:text-night-ink text-center ${
                    !isVocab ? "text-2xl sm:text-3xl" : "text-xl"
                  }`}
                >
                  {meaningText(card)}
                </div>
              ) : (
                <div className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted text-center">
                  {T("meaningHidden")}
                </div>
              )}
              <span className="font-bengali text-[11px] bg-ai-soft dark:bg-night-line text-ai dark:text-ai-glow rounded-full px-2.5 py-0.5">
                {pickLang(cat, lang)}
              </span>
            </div>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <button
          onClick={() => mark(false)}
          className="flex items-center justify-center font-bengali text-sm font-semibold border-2 border-shu text-shu dark:border-shu-glow dark:text-shu-glow rounded-lg py-3 hover:bg-shu hover:text-washi dark:hover:bg-shu-glow dark:hover:text-night active:scale-[0.98] transition-all"
        >
          {T("reviewAgain")}
        </button>
        <button
          onClick={() => mark(true)}
          className="flex items-center justify-center font-bengali text-sm font-semibold bg-take dark:bg-take-glow text-washi dark:text-night rounded-lg py-3 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {T("markLearned")}
        </button>
      </div>

      <div className="flex gap-2.5 mt-3">
        <button
          onClick={goPrev}
          className="flex-1 flex items-center justify-center gap-1.5 font-bengali text-sm border border-ai-line dark:border-night-line rounded-lg py-2.5 text-ink dark:text-night-ink hover:border-shu hover:text-shu dark:hover:border-shu-glow dark:hover:text-shu-glow active:scale-[0.98] transition-all"
        >
          <span className="font-mono text-base leading-none" aria-hidden="true">‹</span>
          {T("prevCard")}
        </button>
        <button
          onClick={goNext}
          className="flex-1 flex items-center justify-center gap-1.5 font-bengali text-sm border border-ai-line dark:border-night-line rounded-lg py-2.5 text-ink dark:text-night-ink hover:border-shu hover:text-shu dark:hover:border-shu-glow dark:hover:text-shu-glow active:scale-[0.98] transition-all"
        >
          {T("nextCard")}
          <span className="font-mono text-base leading-none" aria-hidden="true">›</span>
        </button>
      </div>

      <p className="text-center font-mono text-[10px] text-ink-muted/60 dark:text-night-ink-muted/60 mt-4">
        {T("studyHotkeys")}
      </p>
    </div>
  );
}
