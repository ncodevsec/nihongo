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
import Footer from "./components/Footer.jsx";

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
	const { progress, recordQuizResult, setLearned, resetProgress, activity } =
		useProgress();
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
		[isGrammar, grammarLessons, level],
	);
	const grammarCats = useMemo(
		() => (isGrammar ? grammarCategories(grammarLessons) : []),
		[isGrammar, grammarLessons],
	);

	// Data ids use a shorter module prefix ("vocab-n4-…", "kanji-n4-…",
	// "grammar-n4-…") than the moduleKey itself ("vocabulary"), so resets
	// and favorites need this mapping to actually match real ids.
	const idPrefixMap = {
		vocabulary: "vocab",
		kanji: "kanji",
		grammar: "grammar",
	};
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
		<div className="min-h-screen bg-washi dark:bg-[#0d0d0d] text-ink dark:text-night-ink lg:flex">
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
							<TabBar
								active={tab}
								onChange={setTab}
								moduleKey={moduleKey}
								settings={settings}
							/>
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
							<div
								className={tab === "reference" ? "" : "hidden"}
							>
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
									resetProgress={() =>
										resetProgress(idPrefix)
									}
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
							<div
								className={tab === "reference" ? "" : "hidden"}
							>
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
									resetProgress={() =>
										resetProgress(idPrefix)
									}
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

				{/* Footer Section */}
				<Footer
					settings={settings}
					moduleKey={moduleKey}
					level={level}
				/>
			</div>
		</div>
	);
}
