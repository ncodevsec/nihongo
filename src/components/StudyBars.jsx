import { useApp } from "../context/AppContext.jsx";
import LevelModuleBar from "./LevelModuleBar.jsx";
import TabBar from "./TabBar.jsx";

// Level / module / tab selectors shown at the top of Study and Progress pages
// on mobile + tablet (the desktop Sidebar carries the same controls).
export default function StudyBars({ moduleKey, level, tab }) {
	const { settings, go } = useApp();
	return (
		<div className="lg:hidden pb-3 space-y-2.5 -mt-1">
			<LevelModuleBar
				moduleKey={moduleKey}
				onModuleChange={(m) => go(tab === "progress" ? "progress" : "study", m, level)}
				level={level}
				onLevelChange={(l) => go(tab === "progress" ? "progress" : "study", moduleKey, l)}
				onHome={() => go("home")}
				settings={settings}
				mockActive={false}
				onMock={() => go("mock")}
			/>
			<TabBar
				active={tab}
				onChange={(next) => go(next, moduleKey, level)}
				moduleKey={moduleKey}
				settings={settings}
			/>
		</div>
	);
}
