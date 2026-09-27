import { useEffect, useMemo, useState } from "react";
import { MODULES, levelLabel } from "../../data/modules.js";
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
import ExamCountdown from "./ExamCountdown.jsx";
import SectionHeading from "./SectionHeading.jsx";
import StreakWidget from "../StreakWidget.jsx";

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

	// Nudge to back up once there's real progress worth protecting and it's
	// been a while (or never) since the last export — browser data can be
	// cleared at any time, and this is the only copy of that progress.
	const showBackupReminder = useMemo(() => {
		if (!stats.hasProgress || stats.learned < 15) return false;
		let last = 0;
		try {
			last = Number(localStorage.getItem("nihongo-last-export-v1")) || 0;
		} catch {
			// ignore
		}
		return Date.now() - last > 14 * 24 * 60 * 60 * 1000;
	}, [stats.hasProgress, stats.learned]);
	const prefersDark =
		typeof window !== "undefined" &&
		!!window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;
	const isDark = settings.theme === "dark" || (settings.theme === "system" && prefersDark);

	const resumeModule = lastSession?.moduleKey ?? "vocabulary";
	const continueSub = lastSession
		? [
				pickLang(MODULES[lastSession.moduleKey], lang),
				levelLabel(lastSession.level),
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
			<Rise i={0}>
				<ExamCountdown
					exams={settings.exams}
					onChange={(exams) => updateSetting("exams", exams)}
					lang={lang}
				/>
			</Rise>

			<Banners
				T={T}
				updateAvailable={updateAvailable}
				canInstall={canInstall}
				showBackupReminder={showBackupReminder}
				onOpenSettings={onOpenSettings}
				onInstall={promptInstall}
			/>

			<Rise i={1}>
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

			<Rise i={2}>
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

			<Rise i={3}>
				<section aria-labelledby="home-streak">
					<SectionHeading
						id="home-streak"
						lang={lang}
						title={T("progressActivity")}
						action={
							<button
								type="button"
								onClick={() => onLaunch(resumeModule, level, "progress")}
								className="shrink-0 font-bengali text-xs font-semibold text-shu dark:text-shu-glow hover:underline"
							>
								{T("homeProgressCta")} →
							</button>
						}
					/>
					<StreakWidget activity={activity} lang={lang} />
				</section>
			</Rise>

			<Rise i={4}>
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

			<Rise i={5}>
				<HowItWorks lang={lang} T={T} onOpen={(tab) => onLaunch(resumeModule, level, tab)} />
			</Rise>

			<Rise i={6}>
				<Features lang={lang} T={T} />
			</Rise>

			<Rise i={7}>
				<Faq lang={lang} T={T} />
			</Rise>

			<Rise i={8}>
				<CtaBand lang={lang} T={T} onStart={startFresh} />
			</Rise>
		</div>
	);
}
