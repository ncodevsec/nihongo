import Hanko from "./Hanko.jsx";
import { MODULES, MODULE_ORDER, LEVEL_ORDER } from "../data/modules.js";
import { t, pickLang } from "../lib/i18n.js";

export default function Header({
  active,
  onChange,
  moduleKey,
  onModuleChange,
  level,
  onLevelChange,
  accuracy,
  masteredCount,
  total,
  settings,
}) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);
  const isGrammar = MODULES[moduleKey].kind === "grammar";

  const TABS = isGrammar
    ? [
        { key: "study", label: T("tabGrammarContent") },
        { key: "settings", label: T("tabSettings") },
      ]
    : [
        { key: "study", label: T("tabStudy") },
        { key: "quiz", label: T("tabQuiz") },
        { key: "reference", label: T("tabReference") },
        { key: "progress", label: T("tabProgress") },
        { key: "settings", label: T("tabSettings") },
      ];

  return (
    <header className="bg-paper dark:bg-night-paper border-b border-ai-line dark:border-night-line transition-colors">
      <div className="max-w-4xl mx-auto px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Hanko label="日" tone="shu" size="sm" />
            <div className="min-w-0">
              <h1 className="font-mincho text-lg sm:text-xl font-bold text-ink dark:text-night-ink truncate">
                Nihongo
              </h1>
              <p className="font-bengali text-[11px] sm:text-xs text-ink-muted dark:text-night-ink-muted truncate">
                {T("appSubtitle")}
              </p>
            </div>
          </div>

          {!isGrammar && (
            <div className="hidden sm:flex items-center gap-4 font-mono text-xs shrink-0">
              <div className="text-right">
                <div className="text-ink dark:text-night-ink font-semibold">{accuracy}%</div>
                <div className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">
                  {T("accuracy")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-ink dark:text-night-ink font-semibold">
                  {masteredCount}/{total}
                </div>
                <div className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">
                  {T("learnedCount")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Level selector — now shown first */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
            {T("level")}:
          </span>
          <div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden">
            {LEVEL_ORDER.map((key) => {
              const lvl = MODULES[moduleKey].levels[key];
              const isActive = level === key;
              return (
                <button
                  key={key}
                  onClick={() => onLevelChange(key)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-ai text-washi dark:bg-ai-glow dark:text-night"
                      : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
                  }`}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Module selector — now shown second */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden">
            {MODULE_ORDER.map((key) => {
              const mod = MODULES[key];
              const isActive = moduleKey === key;
              return (
                <button
                  key={key}
                  onClick={() => onModuleChange(key)}
                  className={`px-3 py-1.5 text-xs font-bengali font-semibold transition-colors ${
                    isActive
                      ? "bg-shu text-washi"
                      : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
                  }`}
                >
                  {pickLang(mod, lang)}
                </button>
              );
            })}
          </div>
        </div>

        <nav className="flex gap-1 text-sm -mb-px overflow-x-auto" role="tablist" aria-label="Sections">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={active === tab.key}
              onClick={() => onChange(tab.key)}
              className={`px-3 py-2 rounded-t-md border-b-2 font-bengali font-medium transition-colors whitespace-nowrap ${
                active === tab.key
                  ? "text-ai dark:text-ai-glow border-shu"
                  : "text-ink-muted dark:text-night-ink-muted border-transparent hover:text-ink dark:hover:text-night-ink hover:border-ai-line dark:hover:border-night-line"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
