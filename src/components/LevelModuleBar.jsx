import { MODULES, MODULE_ORDER, LEVEL_ORDER } from "../data/modules.js";
import { t, pickLang } from "../lib/i18n.js";

export default function LevelModuleBar({ moduleKey, onModuleChange, level, onLevelChange, settings }) {
  const lang = settings.uiLang;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden bg-washi dark:bg-night">
          {LEVEL_ORDER.map((key) => {
            const lvl = MODULES[moduleKey].levels[key];
            const isActiveLevel = level === key;
            return (
              <button
                key={key}
                onClick={() => onLevelChange(key)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActiveLevel
                    ? "bg-ai text-washi shadow-sm"
                    : "text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

        <span className="hidden sm:block w-px h-6 bg-ai-line dark:bg-night-line" aria-hidden="true" />

        <div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden bg-washi dark:bg-night">
          {MODULE_ORDER.map((key) => {
            const mod = MODULES[key];
            const isActiveModule = moduleKey === key;
            return (
              <button
                key={key}
                onClick={() => onModuleChange(key)}
                className={`px-3 py-1.5 text-xs font-bengali font-semibold transition-colors ${
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
    </div>
  );
}
