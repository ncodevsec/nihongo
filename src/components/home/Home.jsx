import { useEffect, useMemo, useState } from "react";
import { MODULES } from "../../data/modules.js";
import { t, pickLang } from "../../lib/i18n.js";
import { computeStreak, formatDuration } from "../../lib/utils.js";
import {
	buildContentIndex,
	computeHomeStats,
	contentCounts,
	kanjiOfTheDay,
} from "../../lib/homeStats.js";
import { useInstallPrompt } from "../../hooks/useInstallPrompt.js";
import HomeHero from "./HomeHero.jsx";
import KanjiOfTheDay from "./KanjiOfTheDay.jsx";
import StatsStrip from "./StatsStrip.jsx";
import LevelModules from "./LevelModules.jsx";
import HowItWorks from "./HowItWorks.jsx";
import Features from "./Features.jsx";
import Faq from "./Faq.jsx";
import CtaBand from "./CtaBand.jsx";
import Banners from "./Banners.jsx";

const TAB_LABEL_KEYS = {
	study: "tabStudy",
	quiz: "tabQuiz",
	reference: "tabReference",
	progress: "tabProgress",
};

// Staggered fade-up on entry (re-plays each time Home becomes visible; the
// global reduced-motion rule in index.css turns it off where requested).
function Rise({ i = 0, children }) {
	return (
		<div className="home-rise" style={{ animationDelay: `${i * 70}ms` }}>
			{children}
		</div>
	);
}

// The landing page: the first thing shown on every launch and the hub for
// getting into every module, level and mode. It owns no data of its own —
// content counts come from the data files and personal numbers from the
// same progress/activity store the Progress tab reads.
export default function Home({
	settings,
	updateSetting,
	progress,
	activity,
	timeToday,
	lastSession,
	updateAvailable,
	onLaunch,
	onOpenSettings,
	isActive,
}) {
	const lang = settings.uiLang;
	const T = (k) => t(lang, k);

	const { canInstall, promptInstall } = useInstallPrompt();
	const [level, setLevel] = useState(lastSession?.level ?? "n5");

	const index = useMemo(() => buildContentIndex(settings.showJukugo), [settings.showJukugo]);
	const stats = useMemo(() => computeHomeStats(index, progress), [index, progress]);
	const streak = useMemo(() => computeStreak(activity), [activity]);
	const counts = useMemo(() => contentCounts(), []);
	// Re-picked whenever Home is (re)opened so it rolls over at midnight.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const kotd = useMemo(() => kanjiOfTheDay(), [isActive]);

	// Back to the top whenever the learner returns to Home from another tab.
	useEffect(() => {
		if (isActive) window.scrollTo({ top: 0 });
	}, [isActive]);

	const isReturning = stats.hasProgress || !!lastSession;
	const prefersDark =
		typeof window !== "undefined" &&
		!!window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;
	const isDark = settings.theme === "dark" || (settings.theme === "system" && prefersDark);

	const resumeModule = lastSession?.moduleKey ?? "vocabulary";
	const continueSub = lastSession
		? [
				pickLang(MODULES[lastSession.moduleKey], lang),
				lastSession.level.toUpperCase(),
				lastSession.moduleKey === "grammar" && lastSession.tab === "study"
					? T("tabGrammarContent")
					: T(TAB_LABEL_KEYS[lastSession.tab]),
			].join(" · ")
		: null;

	const startFresh = () => onLaunch("vocabulary", "n5", "study");
	const scrollTo = (id) =>
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

	return (
		<div className="space-y-8 sm:space-y-10 lg:space-y-14">
			<Banners
				T={T}
				updateAvailable={updateAvailable}
				canInstall={canInstall}
				onOpenSettings={onOpenSettings}
				onInstall={promptInstall}
			/>

			<Rise i={0}>
				<HomeHero
					lang={lang}
					T={T}
					isReturning={isReturning}
					isDark={isDark}
					onLangChange={(l) => updateSetting("uiLang", l)}
					onThemeToggle={() => updateSetting("theme", isDark ? "light" : "dark")}
					primaryLabel={lastSession ? T("homeContinueCta") : T("homeStartCta")}
					primarySub={continueSub}
					onPrimary={() =>
						lastSession
							? onLaunch(lastSession.moduleKey, lastSession.level, lastSession.tab)
							: startFresh()
					}
					secondaryLabel={stats.hasProgress ? T("homeProgressCta") : T("homeHowCta")}
					onSecondary={() =>
						stats.hasProgress ? onLaunch(resumeModule, level, "progress") : scrollTo("home-how")
					}
				>
					<KanjiOfTheDay
						kanji={kotd}
						T={T}
						onStudy={() => onLaunch("kanji", kotd.level, "study")}
					/>
				</HomeHero>
			</Rise>

			<Rise i={1}>
				<StatsStrip
					T={T}
					personal={stats.hasProgress}
					streak={streak}
					learned={stats.learned}
					total={stats.total}
					accuracy={stats.accuracy}
					timeLabel={formatDuration(
						timeToday,
						T("timeHourShort"),
						T("timeMinuteShort"),
						T("timeUnderMinute"),
					)}
					counts={counts}
				/>
			</Rise>

			<Rise i={2}>
				<div className="space-y-8 sm:space-y-10 lg:space-y-14">
					<LevelModules
						lang={lang}
						T={T}
						level={level}
						onLevelChange={setLevel}
						stats={stats}
						onLaunch={onLaunch}
					/>
				</div>
			</Rise>

			<Rise i={3}>
				<HowItWorks lang={lang} T={T} onOpen={(tab) => onLaunch(resumeModule, level, tab)} />
			</Rise>

			<Rise i={4}>
				<Features lang={lang} T={T} />
			</Rise>

			<Rise i={5}>
				<Faq lang={lang} T={T} />
			</Rise>

			<Rise i={6}>
				<CtaBand lang={lang} T={T} onStart={startFresh} />
			</Rise>
		</div>
	);
}
