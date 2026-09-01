import { useEffect, useRef, useState } from "react";

// `selected` is an array of category keys. An empty array means "all".
// `onChange` receives the new array. Categories: [{ key, bn, en }].
export default function CategoryMultiSelect({ categories, selected, onChange, lang, allLabel, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const label = (c) => (lang === "bn" ? c.bn : c.en) || c.en || c.bn;

  const toggle = (key) => {
    if (selected.includes(key)) onChange(selected.filter((k) => k !== key));
    else onChange([...selected, key]);
  };

  const isAll = selected.length === 0;
  const buttonText = isAll
    ? allLabel
    : selected.length === 1
    ? label(categories.find((c) => c.key === selected[0]) || { en: selected[0], bn: selected[0] })
    : `${selected.length} selected`;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-bengali w-full flex items-center justify-between gap-2 border border-ai-line dark:border-night-line rounded-md px-3 py-1.5 text-sm bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
      >
        <span className="truncate">{buttonText}</span>
        <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full min-w-[12rem] max-h-64 overflow-y-auto bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-md shadow-lg py-1">
          <button
            type="button"
            onClick={() => onChange([])}
            className={`w-full text-left px-3 py-1.5 text-sm font-bengali hover:bg-ai-soft dark:hover:bg-night-line ${
              isAll ? "text-shu dark:text-shu-glow font-semibold" : "text-ink dark:text-night-ink"
            }`}
          >
            {allLabel}
          </button>
          <div className="border-t border-ai-line dark:border-night-line my-1" />
          {categories.map((c) => {
            const checked = selected.includes(c.key);
            return (
              <label
                key={c.key}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-bengali text-ink dark:text-night-ink hover:bg-ai-soft dark:hover:bg-night-line cursor-pointer"
              >
                <input type="checkbox" checked={checked} onChange={() => toggle(c.key)} className="shrink-0" />
                <span className="truncate">{label(c)}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
