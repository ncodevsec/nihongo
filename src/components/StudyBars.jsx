import { useApp } from "../context/AppContext.jsx";
import LevelModuleBar from "./LevelModuleBar.jsx";
import TabBar from "./TabBar.jsx";

// Module / level selectors (+ Flashcards · Quiz · List tabs on study pages) at the top of
// the Study and Progress pages, on every screen size.
export default function StudyBars({ moduleKey, level, tab }) {
	const { settings, go } = useApp();
	const isProgress = tab === "progress";
	return (
		<div className="pb-3 space-y-2.5 -mt-1">
			<LevelModuleBar
				moduleKey={moduleKey}
				onModuleChange={(m) => go(isProgress ? "progress" : "study", m, level)}
				level={level}
				onLevelChange={(l) => go(isProgress ? "progress" : "study", moduleKey, l)}
				settings={settings}
			/>
			{!isProgress && (
				<TabBar active={tab} onChange={(next) => go(next, moduleKey, level)} moduleKey={moduleKey} settings={settings} />
			)}
		</div>
	);
}
