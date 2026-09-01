import { useState } from "react";
import { t } from "../lib/i18n.js";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`tap-quiet w-11 h-6 shrink-0 rounded-full relative transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu ${
        checked ? "bg-ai dark:bg-ai-glow" : "bg-ai-line dark:bg-night-line"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-150 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Row({ title, subtitle, children }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0 pr-2">
        <div className="font-bengali text-sm text-ink dark:text-night-ink">{title}</div>
        {subtitle && (
          <div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
      <div className="shrink-0 flex items-center">{children}</div>
    </div>
  );
}

export default function Settings({ settings, updateSetting, resetSettings, resetAllProgress }) {
  const lang = settings.uiLang;
  const T = (k) => t(lang, k);

  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmSettingsReset, setConfirmSettingsReset] = useState(false);

  const THEME_OPTIONS = [
    { key: "light", label: T("themeLight") },
    { key: "dark", label: T("themeDark") },
    { key: "system", label: T("themeSystem") },
  ];

  const QUIZ_LENGTH_OPTIONS = [
    { key: "all", label: T("quizLenAll") },
    { key: "10", label: T("quizLen10") },
    { key: "20", label: T("quizLen20") },
    { key: "50", label: T("quizLen50") },
  ];

  const SectionLabel = ({ children }) => (
    <h2 className="font-bengali text-xs font-bold text-ai dark:text-ai-glow uppercase tracking-wide mb-2 mt-6 first:mt-0">
      {children}
    </h2>
  );

  const handleResetProgress = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetAllProgress();
    setConfirmReset(false);
  };

  const handleResetSettings = () => {
    if (!confirmSettingsReset) {
      setConfirmSettingsReset(true);
      return;
    }
    resetSettings();
    setConfirmSettingsReset(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <SectionLabel>{T("sectionLanguage")}</SectionLabel>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden">
        <Row title={T("siteLanguage")} subtitle={T("siteLanguageSub")}>
          <div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden shrink-0">
            {[
              { key: "bn", label: t("bn", "langBangla") },
              { key: "en", label: t("en", "langEnglish") },
            ].map((l) => (
              <button
                key={l.key}
                onClick={() => updateSetting("uiLang", l.key)}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  settings.uiLang === l.key
                    ? "bg-ai text-washi dark:bg-ai-glow dark:text-night"
                    : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Row>
      </div>

      <SectionLabel>{T("sectionTheme")}</SectionLabel>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden">
        <Row title={T("appTheme")} subtitle={T("appThemeSub")}>
          <div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden shrink-0">
            {THEME_OPTIONS.map((th) => (
              <button
                key={th.key}
                onClick={() => updateSetting("theme", th.key)}
                className={`px-2.5 py-1.5 text-[11px] font-bengali font-medium transition-colors ${
                  settings.theme === th.key
                    ? "bg-ai text-washi dark:bg-ai-glow dark:text-night"
                    : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </Row>
      </div>

      <SectionLabel>{T("sectionKanji")}</SectionLabel>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden divide-y divide-ai-line dark:divide-night-line">
        <Row title={T("showBnMeaning")} subtitle={T("showBnMeaningSub")}>
          <Toggle
            checked={settings.showKanjiBn}
            onChange={(v) => updateSetting("showKanjiBn", v)}
          />
        </Row>
      </div>

      <SectionLabel>{T("sectionVocab")}</SectionLabel>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden divide-y divide-ai-line dark:divide-night-line">
        <Row title={T("showVocabKanji")} subtitle={T("showVocabKanjiSub")}>
          <Toggle
            checked={settings.showVocabKanji}
            onChange={(v) => updateSetting("showVocabKanji", v)}
          />
        </Row>
        <Row title={T("meaningLanguage")} subtitle={T("meaningLanguageSub")}>
          <div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden shrink-0">
            {[
              { key: "bn", label: T("langBangla") },
              { key: "en", label: T("langEnglish") },
            ].map((l) => (
              <button
                key={l.key}
                onClick={() => updateSetting("vocabLang", l.key)}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  settings.vocabLang === l.key
                    ? "bg-ai text-washi dark:bg-ai-glow dark:text-night"
                    : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-ai-soft dark:hover:bg-night-line"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Row>
      </div>

      <SectionLabel>{T("sectionQuiz")}</SectionLabel>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden divide-y divide-ai-line dark:divide-night-line">
        <Row title={T("quizLengthLabel")} subtitle={T("quizLengthSub")}>
          <select
            value={settings.quizLength}
            onChange={(e) => updateSetting("quizLength", e.target.value)}
            className="font-bengali text-xs border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
          >
            {QUIZ_LENGTH_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </Row>
        <Row title={T("timedQuiz")} subtitle={T("timedQuizSub")}>
          <Toggle checked={settings.timedQuiz} onChange={(v) => updateSetting("timedQuiz", v)} />
        </Row>
        {settings.timedQuiz && (
          <Row title={T("timedMinutes")}>
            <input
              type="number"
              min={1}
              max={120}
              value={settings.timedMinutes}
              onChange={(e) =>
                updateSetting("timedMinutes", Math.max(1, Number(e.target.value) || 1))
              }
              className="font-mono text-sm border border-ai-line dark:border-night-line rounded-md px-2 py-1.5 w-20 bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
            />
          </Row>
        )}
      </div>

      <SectionLabel>{T("sectionData")}</SectionLabel>
      <div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden divide-y divide-ai-line dark:divide-night-line mb-8">
        <Row title={T("resetSettingsLabel")}>
          <button
            onClick={handleResetSettings}
            className={`font-bengali text-xs rounded-md px-3 py-1.5 border transition-colors shrink-0 min-w-[7.5rem] text-center ${
              confirmSettingsReset
                ? "border-shu bg-shu text-washi"
                : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-shu hover:text-shu"
            }`}
          >
            {confirmSettingsReset ? T("confirmButton") : T("resetButton")}
          </button>
        </Row>
        <Row title={T("resetAllProgressLabel")} subtitle={T("resetAllProgressSub")}>
          <button
            onClick={handleResetProgress}
            className={`font-bengali text-xs rounded-md px-3 py-1.5 border transition-colors shrink-0 min-w-[7.5rem] text-center ${
              confirmReset
                ? "border-shu bg-shu text-washi"
                : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-shu hover:text-shu"
            }`}
          >
            {confirmReset ? T("confirmButton") : T("deleteButton")}
          </button>
        </Row>
      </div>
    </div>
  );
}
