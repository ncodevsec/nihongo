import { useCallback, useEffect, useMemo, useState } from "react";
import { shuffle } from "../lib/utils.js";
import { useHotkeys } from "../hooks/useHotkeys.js";
import { t, pickLang } from "../lib/i18n.js";

export default function Study({ moduleKey, kanjiData, categories, progress, setLearned, settings }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const isVocab = moduleKey === "vocabulary";
  const showWord = isVocab ? settings.showVocabKanji : true;
  const showMeaning = isVocab ? true : settings.showKanjiBn;
  const meaningText = (item) =>
    isVocab && settings.vocabLang === "en" ? item.meaningEn || item.meaning : item.meaning;

  const [category, setCategory] = useState("all");
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);
  const [order, setOrder] = useState(() => shuffle(kanjiData.map((k) => k.id)));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(shuffle(kanjiData.map((k) => k.id)));
    setIndex(0);
    setFlipped(false);
    setCategory("all");
    setOnlyUnlearned(false);
  }, [kanjiData]);

  const availableCategories = useMemo(() => {
    const used = new Set(kanjiData.map((k) => k.category));
    return categories.filter((c) => used.has(c.key));
  }, [kanjiData, categories]);

  const pool = useMemo(() => {
    let list = kanjiData;
    if (category !== "all") list = list.filter((k) => k.category === category);
    if (onlyUnlearned) list = list.filter((k) => !progress[k.id]?.learned);
    return list;
  }, [kanjiData, category, onlyUnlearned, progress]);

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
  }, [category, onlyUnlearned]);

  useEffect(() => {
    if (index >= deck.length) setIndex(0);
  }, [deck.length, index]);

  const card = deck[index];
  const cat = card && categories.find((c) => c.key === card.category);

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
        if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;
        if (e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        } else if (e.key === "ArrowRight") goNext();
        else if (e.key === "ArrowLeft") goPrev();
        else if (e.key.toLowerCase() === "l") mark(true);
        else if (e.key.toLowerCase() === "r") mark(false);
      },
      [goNext, goPrev, mark]
    )
  );

  if (!card) {
    return (
      <div className="text-center py-16 font-bengali text-ink-muted dark:text-night-ink-muted">
        {T("noItemsInFilter")}
      </div>
    );
  }

  const isLearned = !!progress[card.id]?.learned;
  const frontText = showWord ? card.kanji : card.reading;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="font-bengali border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
        >
          <option value="all">{T("allCategories")}</option>
          {availableCategories.map((c) => (
            <option key={c.key} value={c.key}>
              {pickLang(c, lang)}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 font-bengali border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 bg-paper dark:bg-night-paper text-ink dark:text-night-ink cursor-pointer">
          <input
            type="checkbox"
            checked={onlyUnlearned}
            onChange={(e) => setOnlyUnlearned(e.target.checked)}
          />
          {T("onlyUnlearned")}
        </label>

        <button
          onClick={reshuffle}
          className="ml-auto font-bengali border border-ai-line dark:border-night-line rounded-md px-2.5 py-1.5 bg-paper dark:bg-night-paper text-ai dark:text-ai-glow hover:bg-ai-soft dark:hover:bg-night-line transition-colors"
        >
          {T("shuffle")}
        </button>
      </div>

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
              <div className="font-mincho text-2xl sm:text-3xl text-ai dark:text-ai-glow text-center">
                {card.reading}
              </div>
            )}
            {showMeaning ? (
              <div className="font-bengali text-xl text-ink dark:text-night-ink text-center">
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

      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => mark(false)}
          className="font-bengali text-sm border border-shu/40 text-shu dark:text-shu-glow dark:border-shu-glow/40 rounded-md py-2 hover:bg-shu-soft dark:hover:bg-shu/10 transition-colors"
        >
          {T("reviewAgain")}
        </button>
        <button
          onClick={() => mark(true)}
          className="font-bengali text-sm border border-take/40 text-take dark:text-take-glow dark:border-take-glow/40 rounded-md py-2 hover:bg-take-soft dark:hover:bg-take/10 transition-colors"
        >
          {T("markLearned")}
        </button>
      </div>

      <div className="flex justify-between mt-3">
        <button
          onClick={goPrev}
          className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted hover:text-ai dark:hover:text-ai-glow px-2 py-1"
        >
          {T("prevCard")}
        </button>
        <button
          onClick={goNext}
          className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted hover:text-ai dark:hover:text-ai-glow px-2 py-1"
        >
          {T("nextCard")}
        </button>
      </div>

      <p className="text-center font-mono text-[10px] text-ink-muted/60 dark:text-night-ink-muted/60 mt-4">
        {T("studyHotkeys")}
      </p>
    </div>
  );
}
