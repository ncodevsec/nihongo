import { useEffect, useState } from "react";
import { t } from "../lib/i18n.js";

// Renders a grammar note body with light structure: numbered points get
// slightly bolder treatment, "Ex:" lines are shown as indented examples,
// everything else is plain paragraph text. The Bengali wording itself is
// left exactly as sourced — this only adds visual scaffolding around it.
function GrammarBody({ content }) {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isNumberedPoint = /^\d+[.)]\s/.test(trimmed);
        const isExample = /^Ex[:.]/.test(trimmed);
        const isSubPoint = /^\d+\)\s/.test(trimmed) || /^\[(নোট|Note)/i.test(trimmed);

        if (isExample) {
          return (
            <p
              key={i}
              className="font-mincho text-sm text-ai dark:text-ai-glow pl-4 border-l-2 border-ai-line dark:border-night-line"
            >
              {trimmed}
            </p>
          );
        }
        if (isNumberedPoint) {
          return (
            <p
              key={i}
              className="font-bengali text-sm text-ink dark:text-night-ink font-semibold mt-4 first:mt-0"
            >
              {trimmed}
            </p>
          );
        }
        if (isSubPoint) {
          return (
            <p
              key={i}
              className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted pl-3"
            >
              {trimmed}
            </p>
          );
        }
        return (
          <p key={i} className="font-bengali text-sm text-ink dark:text-night-ink pl-3">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function Grammar({ lessons, settings }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const [selected, setSelected] = useState(lessons[0]?.lesson ?? null);

  useEffect(() => {
    setSelected(lessons[0]?.lesson ?? null);
  }, [lessons]);

  if (!lessons || lessons.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 font-bengali text-ink-muted dark:text-night-ink-muted">
        {T("grammarComingSoon")}
      </div>
    );
  }

  const current = lessons.find((l) => l.lesson === selected) ?? lessons[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted block mb-1.5">
          {T("grammarSelectLesson")}
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
          className="font-bengali w-full border border-ai-line dark:border-night-line rounded-md px-3 py-2 text-sm bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
        >
          {lessons.map((l) => (
            <option key={l.lesson} value={l.lesson}>
              Lesson {l.lesson}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg p-4 sm:p-5">
        <h2 className="font-mincho text-lg font-bold text-ai dark:text-ai-glow mb-3">
          Lesson {current.lesson}
        </h2>
        <GrammarBody content={current.content} />
      </div>
    </div>
  );
}
