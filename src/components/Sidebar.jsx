import { MODULES, MODULE_ORDER, LEVEL_ORDER } from "../data/modules.js";
import { t, pickLang } from "../lib/i18n.js";

const ICONS = {
  study: (
    <path d="M4 5.5a2 2 0 012-2h4.5v13H6a2 2 0 00-2 2v-13zM20 5.5a2 2 0 00-2-2h-4.5v13H18a2 2 0 012 2v-13z" />
  ),
  quiz: <path d="M9 11l2 2 4-4M12 3l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />,
  reference: <path d="M4 6h16M4 12h16M4 18h10" />,
  progress: <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </>
  ),
};

function NavIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export default function Sidebar({
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

  const TABS = [
    { key: "study", label: isGrammar ? T("tabGrammarContent") : T("tabStudy"), icon: "study" },
    { key: "quiz", label: T("tabQuiz"), icon: "quiz" },
    { key: "reference", label: T("tabReference"), icon: "reference" },
    { key: "progress", label: T("tabProgress"), icon: "progress" },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:shrink-0 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto border-r border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-ai-line dark:border-night-line mb-4">
        <img src="./icons/logo-mark-128.png" alt="NihonGo" className="w-9 h-9 shrink-0" width={36} height={36} />
        <div className="min-w-0">
          <h1 className="font-mincho text-lg font-bold text-ink dark:text-night-ink truncate">NihonGo</h1>
          <p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted truncate">
            {T("appSubtitle")}
          </p>
        </div>
      </div>

      {/* Level + Module selectors, stacked vertically */}
      <div className="px-5 pb-5 space-y-2">
        <div className="flex gap-5 justify-center w-full my-6">
          {LEVEL_ORDER.map((key) => {
            const lvl = MODULES[moduleKey].levels[key];
            const isActiveLevel = level === key;
            return (
              <button
                key={key}
                onClick={() => onLevelChange(key)}
                className={`rounded-full p-3 border border-ai-line dark:border-night-line hover:outline outline-slate-200 dark:outline-gray-700 text-2xl font-semibold transition-colors ${
                  isActiveLevel
                    ? "bg-shu text-washi shadow-sm"
                    : "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

        <div className="flex justify-stretch my-6 rounded-full border border-ai-line dark:border-night-line overflow-hidden bg-washi dark:bg-night">
          {MODULE_ORDER.map((key) => {
            const mod = MODULES[key];
            const isActiveModule = moduleKey === key;
            return (
              <button
                key={key}
                onClick={() => onModuleChange(key)}
                className={`flex-1 px-3.5 py-2 text-xs text-center font-bengali font-semibold transition-colors ${
                  isActiveModule
                    ? "bg-shu text-washi shadow-sm"
                    : "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
                }`}
              >
                {pickLang(mod, lang)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 space-y-1" role="tablist" aria-label="Sections">
        {TABS.map((tabItem) => {
          const isSel = active === tabItem.key;
          return (
            <button
              key={tabItem.key}
              role="tab"
              aria-selected={isSel}
              onClick={() => onChange(tabItem.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bengali font-medium text-sm transition-colors ${
                isSel
                  ? "bg-shu text-washi shadow-sm"
                  : "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line hover:text-shu dark:hover:text-shu-glow"
              }`}
            >
              <NavIcon name={tabItem.icon} />
              {tabItem.label}
            </button>
          );
        })}
      </nav>
      
      {/* Accuracy / mastered snapshot */}
      {!isGrammar && (
        <div className="mx-5 mb-5 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2 text-center">
            <div className="text-shu dark:text-shu-glow font-mono text-base font-semibold">{accuracy}%</div>
            <div className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">{T("accuracy")}</div>
          </div>
          <div className="rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2 text-center">
            <div className="text-ink dark:text-night-ink font-mono text-base font-semibold">
              {masteredCount}/{total}
            </div>
            <div className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">{T("learnedCount")}</div>
          </div>
        </div>
      )}

      {/* Settings, pinned to the bottom */}
      <div className="px-3 py-4 border-t border-ai-line dark:border-night-line mt-3">
        <button
          onClick={() => onChange("settings")}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bengali font-medium text-sm transition-colors ${
            active === "settings"
              ? "bg-shu text-washi shadow-sm"
              : "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line hover:text-shu dark:hover:text-shu-glow"
          }`}
        >
          <NavIcon name="settings" />
          {T("tabSettings")}
        </button>
      </div>
    </aside>
  );
}
