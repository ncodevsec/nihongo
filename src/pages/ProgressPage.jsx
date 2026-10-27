import { Navigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { useModuleData } from "../hooks/useModuleData.js";
import { isLevel, isModule, progressPath } from "../lib/routes.js";
import Progress from "../components/Progress.jsx";
import StudyBars from "../components/StudyBars.jsx";

// /progress/:module/:level — progress stats for one module + level.
export default function ProgressPage() {
	const { module: moduleKey, level } = useParams();
	const app = useApp();
	if (!isModule(moduleKey) || !isLevel(level)) {
		return <Navigate to={progressPath(app.selection.moduleKey, app.selection.level)} replace />;
	}
	return <ProgressInner moduleKey={moduleKey} level={level} />;
}

function ProgressInner({ moduleKey, level }) {
	const { settings, progress, resetProgress, resetProgressForIds, activity, favorites, todaySeconds, weekSeconds, totalSeconds } = useApp();
	const d = useModuleData(moduleKey, level, settings, progress);
	return (
		<>
			<StudyBars moduleKey={moduleKey} level={level} tab="progress" />
			<Progress
				key={moduleKey}
				kanjiData={d.isGrammar ? d.grammarPoints : d.kanjiData}
				categories={d.isGrammar ? d.grammarCats : d.categories}
				progress={progress}
				resetProgress={() => resetProgress(d.idPrefix)}
				onResetCategory={(ids) => resetProgressForIds(ids)}
				settings={settings}
				activity={activity}
				favorites={favorites}
				moduleKey={moduleKey}
				level={level}
				timeToday={todaySeconds}
				timeWeek={weekSeconds}
				timeTotal={totalSeconds}
			/>
		</>
	);
}
