import { useMemo, useState } from "react";
import { MODULES } from "./data/modules.js";
import { useProgress } from "./hooks/useProgress.js";
import { useSettings } from "./hooks/useSettings.js";
import { t, pickLang } from "./lib/i18n.js";
import Header from "./components/Header.jsx";
import Study from "./components/Study.jsx";
import Quiz from "./components/Quiz.jsx";
import Reference from "./components/Reference.jsx";
import Progress from "./components/Progress.jsx";
import Settings from "./components/Settings.jsx";
import Grammar from "./components/Grammar.jsx";

export default function App() {
  const [tab, setTab] = useState("study");
  const [moduleKey, setModuleKey] = useState("vocabulary");
  const [level, setLevel] = useState("n5");
  const { progress, recordQuizResult, setLearned, resetProgress } = useProgress();
  const { settings, updateSetting, resetSettings } = useSettings();

  const mod = MODULES[moduleKey];
  const isGrammar = mod.kind === "grammar";
  const levelData = mod.levels[level];
  const kanjiData = isGrammar ? [] : levelData.data;
  const categories = isGrammar ? [] : levelData.categories;
  const lang = settings.uiLang;

  const { accuracy, masteredCount } = useMemo(() => {
    if (isGrammar) return { accuracy: 0, masteredCount: 0 };
    const relevantIds = new Set(kanjiData.map((k) => k.id));
    const entries = Object.entries(progress)
      .filter(([id]) => relevantIds.has(id))
      .map(([, v]) => v);
    const seen = entries.reduce((s, e) => s + e.seen, 0);
    const correct = entries.reduce((s, e) => s + e.correct, 0);
    const mastered = entries.filter((e) => e.learned).length;
    return {
      accuracy: seen ? Math.round((correct / seen) * 100) : 0,
      masteredCount: mastered,
    };
  }, [progress, kanjiData, isGrammar]);

  const handleModuleChange = (nextModule) => {
    setModuleKey(nextModule);
    setTab("study");
  };

  const handleLevelChange = (nextLevel) => {
    setLevel(nextLevel);
    setTab("study");
  };

  return (
    <div className="min-h-screen bg-washi dark:bg-night text-ink dark:text-night-ink transition-colors">
      <Header
        active={tab}
        onChange={setTab}
        moduleKey={moduleKey}
        onModuleChange={handleModuleChange}
        level={level}
        onLevelChange={handleLevelChange}
        accuracy={accuracy}
        masteredCount={masteredCount}
        total={kanjiData.length}
        settings={settings}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-5 py-6">
        {isGrammar && tab === "study" && (
          <Grammar lessons={levelData.lessons} settings={settings} />
        )}
        {!isGrammar && tab === "study" && (
          <Study
            moduleKey={moduleKey}
            kanjiData={kanjiData}
            categories={categories}
            progress={progress}
            setLearned={setLearned}
            settings={settings}
          />
        )}
        {!isGrammar && tab === "quiz" && (
          <Quiz
            moduleKey={moduleKey}
            kanjiData={kanjiData}
            categories={categories}
            progress={progress}
            recordQuizResult={recordQuizResult}
            settings={settings}
          />
        )}
        {!isGrammar && tab === "reference" && (
          <Reference
            moduleKey={moduleKey}
            kanjiData={kanjiData}
            categories={categories}
            progress={progress}
            setLearned={setLearned}
            settings={settings}
          />
        )}
        {!isGrammar && tab === "progress" && (
          <Progress
            kanjiData={kanjiData}
            categories={categories}
            progress={progress}
            resetProgress={() => resetProgress(`${moduleKey}-${level}-`)}
            settings={settings}
          />
        )}
        {tab === "settings" && (
          <Settings
            settings={settings}
            updateSetting={updateSetting}
            resetSettings={resetSettings}
            resetAllProgress={() => resetProgress()}
          />
        )}
      </main>

      <footer className="border-t border-ai-line dark:border-night-line mt-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] font-bengali text-ink-muted dark:text-night-ink-muted">
          <span>
            Nihongo — {pickLang(mod, lang)} ({level.toUpperCase()}) {t(lang, "footerFor")}
          </span>
          <span className="font-mono">{t(lang, "footerStorage")}</span>
        </div>
      </footer>
    </div>
  );
}
