import { Navigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { useModuleData } from "../hooks/useModuleData.js";
import { isLevel, isModule, SLUG_MODE, studyPath } from "../lib/routes.js";
import Study from "../components/Study.jsx";
import Quiz from "../components/Quiz.jsx";
import Reference from "../components/Reference.jsx";
import GrammarStudy from "../components/grammar/GrammarStudy.jsx";
import GrammarQuiz from "../components/grammar/GrammarQuiz.jsx";
import GrammarList from "../components/grammar/GrammarList.jsx";
import StudyBars from "../components/StudyBars.jsx";

// Stable reference for the Transform tab's unused "lessons" prop (a fresh []
// each render would reset GrammarStudy/Quiz/List state on every tick).
const EMPTY_LESSONS = [];

// /study/:module/:level/:mode — the Flashcards / Quiz / List panels of one
// module + level. The three panels stay mounted and only visibility toggles,
// so switching between them keeps flashcard position, quiz progress, filters…
export default function StudyPage() {
	const { module: moduleKey, level, mode } = useParams();
	const app = useApp();
	if (!isModule(moduleKey) || !isLevel(level) || !SLUG_MODE[mode]) {
		return <Navigate to={studyPath(app.selection.moduleKey, app.selection.level)} replace />;
	}
	return <StudyInner moduleKey={moduleKey} level={level} tab={SLUG_MODE[mode]} />;
}

function StudyInner({ moduleKey, level, tab }) {
	const { settings, updateSetting, progress, recordQuizResult, setLearned, favorites, toggleFavorite } = useApp();
	const d = useModuleData(moduleKey, level, settings, progress);
	const show = (t) => (tab === t ? "" : "hidden");

	return (
		<>
			<StudyBars moduleKey={moduleKey} level={level} tab={tab} />
			{d.isGrammar || d.isTransformKind ? (
				<>
					<div className={show("study")}>
						<GrammarStudy
							key={d.isGrammar ? "grammar-study" : "transform-study"}
							transformOnly={d.isTransformKind}
							lessons={d.isGrammar ? d.grammarLessons : EMPTY_LESSONS}
							level={level}
							settings={settings}
							progress={progress}
							setLearned={setLearned}
							favorites={favorites}
							toggleFavorite={toggleFavorite}
							isActive={tab === "study"}
						/>
					</div>
					<div className={show("quiz")}>
						<GrammarQuiz
							key={d.isGrammar ? "grammar-quiz" : "transform-quiz"}
							transformOnly={d.isTransformKind}
							lessons={d.isGrammar ? d.grammarLessons : EMPTY_LESSONS}
							level={level}
							settings={settings}
							updateSetting={updateSetting}
							recordQuizResult={recordQuizResult}
						/>
					</div>
					<div className={show("reference")}>
						<GrammarList
							key={d.isGrammar ? "grammar-list" : "transform-list"}
							transformOnly={d.isTransformKind}
							lessons={d.isGrammar ? d.grammarLessons : EMPTY_LESSONS}
							level={level}
							settings={settings}
							progress={progress}
							setLearned={setLearned}
							favorites={favorites}
							toggleFavorite={toggleFavorite}
						/>
					</div>
				</>
			) : (
				<>
					<div className={show("study")}>
						<Study
							key={moduleKey}
							moduleKey={moduleKey}
							kanjiData={d.kanjiData}
							categories={d.categories}
							progress={progress}
							setLearned={setLearned}
							settings={settings}
							isActive={tab === "study"}
							favorites={favorites}
							toggleFavorite={toggleFavorite}
							level={level}
						/>
					</div>
					<div className={show("quiz")}>
						<Quiz
							key={moduleKey}
							moduleKey={moduleKey}
							kanjiData={d.kanjiData}
							categories={d.categories}
							progress={progress}
							recordQuizResult={recordQuizResult}
							settings={settings}
							updateSetting={updateSetting}
							isActive={tab === "quiz"}
							level={level}
						/>
					</div>
					<div className={show("reference")}>
						<Reference
							key={moduleKey}
							moduleKey={moduleKey}
							kanjiData={d.kanjiData}
							categories={d.categories}
							progress={progress}
							setLearned={setLearned}
							settings={settings}
							favorites={favorites}
							toggleFavorite={toggleFavorite}
							level={level}
						/>
					</div>
				</>
			)}
		</>
	);
}
