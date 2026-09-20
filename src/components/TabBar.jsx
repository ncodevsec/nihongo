import { MODULES } from "../data/modules.js";
import { t } from "../lib/i18n.js";

const ICONS = {
  study: (
    <path d="M4 5.5a2 2 0 012-2h4.5v13H6a2 2 0 00-2 2v-13zM20 5.5a2 2 0 00-2-2h-4.5v13H18a2 2 0 012 2v-13z" />
  ),
  quiz: <path d="M9 11l2 2 4-4M12 3l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />,
  reference: <path d="M4 6h16M4 12h16M4 18h10" />,
  progress: <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />,
};

function TabIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export default function TabBar({ active, onChange, moduleKey, settings }) {
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
    <div className="max-w-4xl mx-auto px-3 sm:px-5">
      {/* Fully-rounded pill bar, buttons flush against the border (no
          inner padding gap) — matches the Level/Module selector styling
          above it in the header. */}
      <nav
        className="flex rounded-full bg-washi dark:bg-night border border-ai-line dark:border-night-line overflow-x-auto overflow-hidden"
        role="tablist"
        aria-label="Sections"
      >
        {TABS.map((tabItem) => {
          const isSel = active === tabItem.key;
          return (
            <button
              key={tabItem.key}
              role="tab"
              aria-selected={isSel}
              onClick={() => onChange(tabItem.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 font-bengali font-medium text-xs whitespace-nowrap transition-all duration-150 ${
                isSel
                  ? "bg-shu text-washi"
                  : "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line hover:text-shu dark:hover:text-shu-glow"
              }`}
            >
              <TabIcon name={tabItem.icon} />
              {tabItem.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
