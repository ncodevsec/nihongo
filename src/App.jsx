import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "./context/AppContext.jsx";
import { useProgress } from "./hooks/useProgress.js";
import { useSettings } from "./hooks/useSettings.js";
import { useFavorites } from "./hooks/useFavorites.js";
import { useAppUpdate } from "./hooks/useAppUpdate.js";
import { useTimeTracking } from "./hooks/useTimeTracking.js";
import { useLastSession } from "./hooks/useLastSession.js";
import { useModuleData } from "./hooks/useModuleData.js";
import { DEFAULT_SELECTION, isLevel, isModule, pathFor, studyPath, tabFromPath } from "./lib/routes.js";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import StudyPage from "./pages/StudyPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import MockPage from "./pages/MockPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// Module + level currently "selected" — taken from the URL on study/progress
// pages, remembered everywhere else (so Mock Test, the dock and Home follow it).
function useSelection(lastSession) {
	const { pathname } = useLocation();
	const [selection, setSelection] = useState(() =>
		lastSession && isModule(lastSession.moduleKey) && isLevel(lastSession.level)
			? { moduleKey: lastSession.moduleKey, level: lastSession.level }
			: DEFAULT_SELECTION,
	);
	useEffect(() => {
		const m = pathname.match(/^\/(?:study|progress)\/([^/]+)\/([^/]+)/);
		if (m && isModule(m[1]) && isLevel(m[2])) {
			setSelection((s) => (s.moduleKey === m[1] && s.level === m[2] ? s : { moduleKey: m[1], level: m[2] }));
		}
	}, [pathname]);
	return selection;
}

export default function App() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const tab = tabFromPath(pathname);

	const progressApi = useProgress();
	const { settings, updateSetting, resetSettings } = useSettings();
	const { favorites, toggleFavorite } = useFavorites();
	const update = useAppUpdate();
	const time = useTimeTracking();
	const { lastSession, saveSession } = useLastSession();
	const selection = useSelection(lastSession);
	const { moduleKey, level } = selection;

	// Remember the last study context so Home can offer "Continue learning".
	useEffect(() => {
		if (["study", "quiz", "reference", "progress", "mock"].includes(tab)) {
			saveSession({ moduleKey, level, tab });
		}
	}, [tab, moduleKey, level, saveSession]);

	// go(tab, module?, level?) — navigate by tab name (Sidebar, bars, Home, dock).
	const go = useCallback(
		(nextTab, nextModule = moduleKey, nextLevel = level) => {
			navigate(pathFor(nextModule, nextLevel, nextTab));
			window.scrollTo({ top: 0 });
		},
		[navigate, moduleKey, level],
	);
	const launch = useCallback((m, l, t) => go(t, m, l), [go]);

	const d = useModuleData(moduleKey, level, settings, progressApi.progress);
	const sidebarTab = tab === "settings" ? "settings" : tab;
	const barTab = ["study", "quiz", "reference", "progress"].includes(tab) ? tab : "study";

	const ctx = useMemo(
		() => ({
			settings, updateSetting, resetSettings, favorites, toggleFavorite,
			...progressApi, ...update,
			todaySeconds: time.todaySeconds, weekSeconds: time.weekSeconds, totalSeconds: time.totalSeconds,
			lastSession, selection, go, launch,
		}),
		[settings, updateSetting, resetSettings, favorites, toggleFavorite, progressApi, update, time.todaySeconds, time.weekSeconds, time.totalSeconds, lastSession, selection, go, launch],
	);

	return (
		<AppContext.Provider value={ctx}>
			<div className="min-h-screen bg-washi dark:bg-[#0d0d0d] text-ink dark:text-night-ink lg:flex">
				<Sidebar
					active={sidebarTab}
					onChange={(t) => go(t)}
					moduleKey={moduleKey}
					onModuleChange={(m) => go(barTab, m, level)}
					level={level}
					onLevelChange={(l) => go(barTab, moduleKey, l)}
					accuracy={d.accuracy}
					masteredCount={d.masteredCount}
					total={d.kanjiData.length}
					settings={settings}
					updateAvailable={update.updateAvailable}
				/>

				<div className="flex-1 min-w-0 flex flex-col">
					<div className="lg:hidden">
						<Header
							active={tab}
							onChange={(t) => go(t)}
							moduleKey={moduleKey}
							accuracy={d.accuracy}
							masteredCount={d.masteredCount}
							total={d.kanjiData.length}
							settings={settings}
							updateAvailable={update.updateAvailable}
						/>
					</div>

					<main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-5 lg:px-10 pt-4 sm:pt-5 lg:pt-10 pb-28 lg:pb-12">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/study" element={<Navigate to={studyPath(moduleKey, level)} replace />} />
							<Route path="/study/:module/:level/:mode" element={<StudyPage />} />
							<Route path="/study/:module/:level" element={<RedirectStudy />} />
							<Route path="/progress" element={<Navigate to={pathFor(moduleKey, level, "progress")} replace />} />
							<Route path="/progress/:module/:level" element={<ProgressPage />} />
							<Route path="/mock-test" element={<MockPage />} />
							<Route path="/profile" element={<ProfilePage />} />
							<Route path="/settings" element={<Navigate to="/profile" replace />} />
							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
					</main>

					<div className="hidden lg:block">
						<Footer settings={settings} moduleKey={moduleKey} level={level} />
					</div>
					<div className="lg:hidden pb-20">
						<Footer settings={settings} moduleKey={moduleKey} level={level} />
					</div>
				</div>
				<BottomNav />
			</div>
		</AppContext.Provider>
	);
}

function RedirectStudy() {
	const { pathname } = useLocation();
	return <Navigate to={`${pathname.replace(/\/$/, "")}/flashcards`} replace />;
}
