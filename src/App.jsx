import { useMemo, useState } from "react";
import { MODULES } from "./data/modules.js";
import { useProgress } from "./hooks/useProgress.js";
import { useSettings } from "./hooks/useSettings.js";
import { useFavorites } from "./hooks/useFavorites.js";
import { t, pickLang } from "./lib/i18n.js";
import { flattenGrammarPoints, grammarCategories } from "./lib/grammarUtils.js";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import LevelModuleBar from "./components/LevelModuleBar.jsx";
import TabBar from "./components/TabBar.jsx";
import Study from "./components/Study.jsx";
import Quiz from "./components/Quiz.jsx";
import Reference from "./components/Reference.jsx";
import Progress from "./components/Progress.jsx";
import Settings from "./components/Settings.jsx";
import GrammarStudy from "./components/grammar/GrammarStudy.jsx";
import GrammarQuiz from "./components/grammar/GrammarQuiz.jsx";
import GrammarList from "./components/grammar/GrammarList.jsx";

export default function App() {
  const [tab, setTabRaw] = useState("study");
  const [lastTab, setLastTab] = useState("study");
  const setTab = (next) => {
    if (next !== "settings") setLastTab(next);
    setTabRaw(next);
  };
  const goBack = () => setTabRaw(lastTab);
  const [moduleKey, setModuleKey] = useState("vocabulary");
  const [level, setLevel] = useState("n5");
  const { progress, recordQuizResult, setLearned, resetProgress, activity } = useProgress();
  const { settings, updateSetting, resetSettings } = useSettings();
  const { favorites, toggleFavorite } = useFavorites();

  const mod = MODULES[moduleKey];
  const isGrammar = mod.kind === "grammar";
  const levelData = mod.levels[level];
  const rawKanjiData = isGrammar ? [] : levelData.data;
  const kanjiData = useMemo(() => {
    if (isGrammar) return rawKanjiData;
    if (moduleKey === "kanji" && !settings.showJukugo) {
      return rawKanjiData.filter((k) => !k.isJukugo);
    }
    return rawKanjiData;
  }, [isGrammar, rawKanjiData, moduleKey, settings.showJukugo]);
  const categories = isGrammar ? [] : levelData.categories;
  const lang = settings.uiLang;

  const grammarLessons = isGrammar ? levelData.lessons : [];
  const grammarPoints = useMemo(
    () => (isGrammar ? flattenGrammarPoints(grammarLessons, level) : []),
    [isGrammar, grammarLessons, level]
  );
  const grammarCats = useMemo(
    () => (isGrammar ? grammarCategories(grammarLessons) : []),
    [isGrammar, grammarLessons]
  );

  // Data ids use a shorter module prefix ("vocab-n4-…", "kanji-n4-…",
  // "grammar-n4-…") than the moduleKey itself ("vocabulary"), so resets
  // and favorites need this mapping to actually match real ids.
  const idPrefixMap = { vocabulary: "vocab", kanji: "kanji", grammar: "grammar" };
  const idPrefix = `${idPrefixMap[moduleKey]}-${level}-`;

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
    <div className="min-h-screen bg-washi dark:bg-[#0d0d0d] text-ink dark:text-night-ink transition-colors lg:flex">
      <Sidebar
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

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile/tablet header + level/module/tab bars — the desktop
            Sidebar covers this same navigation from lg (1024px) up, so
            this whole stacked-header pattern is hidden there instead of
            being awkwardly stretched across a wide viewport. */}
        <div className="lg:hidden">
          <Header
            active={tab}
            onChange={setTab}
            onBack={goBack}
            moduleKey={moduleKey}
            accuracy={accuracy}
            masteredCount={masteredCount}
            total={kanjiData.length}
            settings={settings}
          />

          {tab !== "settings" && (
            <div className="pt-3 space-y-2.5">
              <LevelModuleBar
                moduleKey={moduleKey}
                onModuleChange={handleModuleChange}
                level={level}
                onLevelChange={handleLevelChange}
                settings={settings}
              />
              <TabBar active={tab} onChange={setTab} moduleKey={moduleKey} settings={settings} />
            </div>
          )}
        </div>

        {/* Every applicable tab panel stays mounted at all times; only
            visibility toggles via the "hidden" class. This is what keeps
            each panel's own state (selected lesson/category, flashcard
            position, in-progress quiz, scroll position, etc.) alive when
            switching between tabs — previously each panel was conditionally
            rendered, which unmounted and threw away its state every time. */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-5 lg:px-10 pt-4 sm:pt-5 lg:pt-10 pb-6 lg:pb-12">
        {isGrammar ? (
          <>
            <div className={tab === "study" ? "" : "hidden"}>
              <GrammarStudy
                lessons={grammarLessons}
                level={level}
                settings={settings}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            </div>
            <div className={tab === "quiz" ? "" : "hidden"}>
              <GrammarQuiz
                lessons={grammarLessons}
                level={level}
                settings={settings}
                updateSetting={updateSetting}
                recordQuizResult={recordQuizResult}
              />
            </div>
            <div className={tab === "reference" ? "" : "hidden"}>
              <GrammarList
                lessons={grammarLessons}
                level={level}
                settings={settings}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            </div>
            <div className={tab === "progress" ? "" : "hidden"}>
              <Progress
                kanjiData={grammarPoints}
                categories={grammarCats}
                progress={progress}
                resetProgress={() => resetProgress(idPrefix)}
                settings={settings}
                activity={activity}
                favorites={favorites}
              />
            </div>
            <div className={tab === "settings" ? "" : "hidden"}>
              <Settings
                settings={settings}
                updateSetting={updateSetting}
                resetSettings={resetSettings}
                resetAllProgress={() => resetProgress()}
              />
            </div>
          </>
        ) : (
          <>
            <div className={tab === "study" ? "" : "hidden"}>
              <Study
                moduleKey={moduleKey}
                kanjiData={kanjiData}
                categories={categories}
                progress={progress}
                setLearned={setLearned}
                settings={settings}
                isActive={tab === "study"}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            </div>
            <div className={tab === "quiz" ? "" : "hidden"}>
              <Quiz
                moduleKey={moduleKey}
                kanjiData={kanjiData}
                categories={categories}
                progress={progress}
                recordQuizResult={recordQuizResult}
                settings={settings}
                updateSetting={updateSetting}
                isActive={tab === "quiz"}
              />
            </div>
            <div className={tab === "reference" ? "" : "hidden"}>
              <Reference
                moduleKey={moduleKey}
                kanjiData={kanjiData}
                categories={categories}
                progress={progress}
                setLearned={setLearned}
                settings={settings}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            </div>
            <div className={tab === "progress" ? "" : "hidden"}>
              <Progress
                kanjiData={kanjiData}
                categories={categories}
                progress={progress}
                resetProgress={() => resetProgress(idPrefix)}
                settings={settings}
                activity={activity}
                favorites={favorites}
                moduleKey={moduleKey}
              />
            </div>
            <div className={tab === "settings" ? "" : "hidden"}>
              <Settings
                settings={settings}
                updateSetting={updateSetting}
                resetSettings={resetSettings}
                resetAllProgress={() => resetProgress()}
              />
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-ai-line dark:border-night-line mt-8 bg-paper dark:bg-night-paper">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-10 py-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img src="./icons/logo-mark-96.png" alt="NihonGo" className="w-7 h-7" width={28} height={28} />
            <span className="font-mincho text-base font-bold text-ink dark:text-night-ink">NihonGo</span>
          </div>
          <p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted text-center max-w-xs">
            {t(lang, "appSubtitle")}
          </p>

          <div className="flex items-center gap-2.5">
            <a
              href="https://www.linkedin.com/in/ncodevsec"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/ncodevsec"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-8.06h2.7l.4-3.14h-3.1V7.87c0-.91.25-1.53 1.56-1.53h1.67V3.53C15.94 3.36 15.02 3.27 14.1 3.27c-2.4 0-4.05 1.47-4.05 4.16v2.37H7.34v3.14h2.71V21h3.45z" />
              </svg>
            </a>
            <a
              href="https://t.me/ncodevsec"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              title="Telegram"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M21.5 4.5L2.75 11.9c-1.28.51-1.27 1.22-.24 1.53l4.8 1.5 1.85 5.66c.23.62.12.87.78.87.5 0 .72-.23 1-.5l2.4-2.32 4.98 3.68c.92.5 1.58.25 1.81-.85l3.27-15.4c.34-1.35-.5-1.96-1.65-1.57z" />
              </svg>
            </a>
            <a
              href="https://x.com/ncodevsec"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              title="X (Twitter)"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                <path d="M13.6 10.4L20.2 3h-1.6l-5.7 6.4L8.3 3H3l6.9 9.8L3.3 21h1.6l6.1-6.8L15.9 21H21l-7.4-10.6zm-2.2 2.5l-.7-1L5.1 4.2h2.4l4.5 6.3.7 1 5.9 8.2h-2.4l-4.8-6.7z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-ai-line dark:border-night-line">
          <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] font-bengali text-ink-muted dark:text-night-ink-muted">
            <span>
              NihonGo — {pickLang(mod, lang)} ({level.toUpperCase()}) {t(lang, "footerFor")}
            </span>
            <span className="font-mono">{t(lang, "footerStorage")}</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
