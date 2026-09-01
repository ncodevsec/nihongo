import { useEffect, useMemo, useState } from "react";
import { t, pickLang } from "../../lib/i18n.js";
import { grammarItemId, flattenGrammarPoints, grammarCategories, grammarParticleCategories } from "../../lib/grammarUtils.js";
import { StarFilterButton } from "../FilterControls.jsx";
import CategoryMultiSelect from "../CategoryMultiSelect.jsx";

// Renders a rule's Bengali explanation with light structure: sub-points
// (১, ২, ৩...) get their own indented line, bracketed notes get an
// italic aside style, everything else is a plain paragraph. No Japanese
// example sentences live in this block anymore — those are rendered
// separately as dedicated example cards.
function ExplanationBody({ text }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const isSubPoint = /^[১২৩৪৫৬৭৮৯০]+\)\s/.test(line);
        const isNote = /^[（(](নোট|Note)/i.test(line);
        if (isSubPoint) {
          return (
            <p key={i} className="font-bengali text-sm text-ink dark:text-night-ink pl-3 border-l-2 border-sakura-line dark:border-night-line">
              {line}
            </p>
          );
        }
        if (isNote) {
          return (
            <p key={i} className="font-bengali text-xs italic text-ink-muted dark:text-night-ink-muted">
              {line}
            </p>
          );
        }
        return (
          <p key={i} className="font-bengali text-sm text-ink dark:text-night-ink leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

function StarButton({ starred, onClick, labelOn, labelOff }) {
  return (
    <button
      onClick={onClick}
      aria-label={starred ? labelOn : labelOff}
      title={starred ? labelOn : labelOff}
      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
        starred ? "text-shu dark:text-shu-glow" : "text-ink-muted/40 dark:text-night-ink-muted/40 dark:hover:text-shu-glow hover:text-shu"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill={starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3.5z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function GrammarStudy({ lessons, level, settings, favorites, toggleFavorite }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const [groupBy, setGroupBy] = useState("lesson"); // 'lesson' | 'particle'
  const lessonCategories = useMemo(() => grammarCategories(lessons), [lessons]);
  const particleCategories = useMemo(() => grammarParticleCategories(lessons), [lessons]);
  const [selectedLessons, setSelectedLessons] = useState([]); // [] = all
  const [selectedParticles, setSelectedParticles] = useState([]); // [] = all
  const [onlyStarred, setOnlyStarred] = useState(false);
  const allPoints = useMemo(() => flattenGrammarPoints(lessons, level), [lessons, level]);

  useEffect(() => {
    setSelectedLessons([]);
    setSelectedParticles([]);
  }, [lessons]);

  useEffect(() => {
    setSelectedLessons([]);
    setSelectedParticles([]);
  }, [groupBy]);

  if (!lessons || lessons.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 font-bengali text-ink-muted dark:text-night-ink-muted">
        {T("grammarComingSoon")}
      </div>
    );
  }

  let visiblePoints;
  const showLessonBadgePerPoint = true;
  if (groupBy === "particle") {
    visiblePoints =
      selectedParticles.length === 0
        ? allPoints
        : allPoints.filter((p) => selectedParticles.includes(p.particle || "other"));
  } else {
    visiblePoints =
      selectedLessons.length === 0
        ? allPoints
        : allPoints.filter((p) => selectedLessons.includes(p.category));
  }
  if (onlyStarred) visiblePoints = visiblePoints.filter((p) => favorites[p.id]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden">
          <button
            onClick={() => setGroupBy("lesson")}
            className={`px-3 py-1.5 text-xs font-bengali font-medium transition-colors ${
              groupBy === "lesson"
                ? "bg-ai text-washi"
                : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
            }`}
          >
            {T("groupByLesson")}
          </button>
          <button
            onClick={() => setGroupBy("particle")}
            className={`px-3 py-1.5 text-xs font-bengali font-medium transition-colors ${
              groupBy === "particle"
                ? "bg-ai text-washi"
                : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
            }`}
          >
            {T("groupByParticle")}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="flex-1">
          <label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted block mb-1.5">
            {groupBy === "particle" ? T("grammarSelectParticle") : T("grammarSelectLesson")}
          </label>
          {groupBy === "particle" ? (
            <CategoryMultiSelect
              categories={particleCategories}
              selected={selectedParticles}
              onChange={setSelectedParticles}
              lang={lang}
              allLabel={T("allCategories")}
            />
          ) : (
            <CategoryMultiSelect
              categories={lessonCategories}
              selected={selectedLessons}
              onChange={setSelectedLessons}
              lang={lang}
              allLabel={T("allCategories")}
            />
          )}
        </div>
        <div className="self-end sm:self-auto sm:mt-[22px]">
          <StarFilterButton
            active={onlyStarred}
            onClick={() => setOnlyStarred((v) => !v)}
            labelOn={T("onlyStarred")}
            labelOff={T("onlyStarred")}
          />
        </div>
      </div>

      <div className="space-y-4">
        {visiblePoints.map((point, i) => {
          const pointId = point.id;
          const starred = !!favorites[pointId];
          return (
            <div
              key={pointId}
              className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden shadow-sm"
            >
              {/* Rule heading */}
              <div className="flex items-start justify-between gap-2 px-4 sm:px-5 pt-4">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-shu text-washi font-mono text-[11px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    {showLessonBadgePerPoint && (
                      <span className="inline-block font-bengali text-[10px] text-ai dark:text-ai-glow bg-ai-soft dark:bg-night-line rounded-full px-2 py-0.5 mb-1">
                        Lesson {point.lesson}
                      </span>
                    )}
                    <h3 className="font-bengali text-base font-bold text-ink dark:text-night-ink leading-snug">
                      {point.headingBn}
                    </h3>
                  </div>
                </div>
                <StarButton
                  starred={starred}
                  onClick={() => toggleFavorite(pointId)}
                  labelOn={T("markAsUnstarred")}
                  labelOff={T("markAsStarred")}
                />
              </div>

              {/* Explanation */}
              <div className="px-4 sm:px-5 pt-3 pb-4">
                <ExplanationBody text={point.explanationBn} />
              </div>

              {/* Examples — visually separated from the rule text */}
              {point.examples.length > 0 && (
                <div className="bg-sakura-soft dark:bg-night border-t border-ai-line dark:border-night-line px-4 sm:px-5 py-3.5">
                  <div className="font-bengali text-[10px] font-bold uppercase tracking-wide text-sakura-deep dark:text-sakura mb-2.5">
                    {T("grammarExamples")}
                  </div>
                  <div className="space-y-3">
                    {point.examples.map((ex, ei) => (
                      <div key={ei} className={ei > 0 ? "pt-3 border-t border-sakura-line dark:border-night-line" : ""}>
                        {ex.note && (
                          <div className="font-bengali text-[11px] italic text-ink-muted dark:text-night-ink-muted mb-1">
                            ({ex.note})
                          </div>
                        )}
                        <div className="font-mincho text-lg text-ink dark:text-night-ink leading-snug">{ex.jp}</div>
                        {ex.meaningBn && (
                          <div className="font-bengali text-sm text-sakura-deep dark:text-sakura mt-1">
                            {ex.meaningBn}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {visiblePoints.length === 0 && (
          <div className="text-center py-12 font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
            {T("noResults")}
          </div>
        )}
      </div>
    </div>
  );
}
