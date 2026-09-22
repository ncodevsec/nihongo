import { MODULES, MODULE_ORDER, LEVEL_OPTIONS, levelLabel } from "../../data/modules.js";
import { pickLang } from "../../lib/i18n.js";
import Icon from "./icons.jsx";
import SectionHeading from "./SectionHeading.jsx";

function ProgressBar({ value, total }) {
	const pct = total ? Math.round((value / total) * 100) : 0;
	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={pct}
			className="h-1.5 w-full rounded-full bg-ai-line dark:bg-night-line overflow-hidden"
		>
			<div
				className="h-full rounded-full bg-shu dark:bg-shu-glow transition-[width] duration-500"
				style={{ width: `${pct}%` }}
			/>
		</div>
	);
}

const MODULE_UNIT = {
	vocabulary: "homeUnitWords",
	grammar: "homeUnitPoints",
	kanji: "homeUnitKanji",
	transform: "homeUnitForms",
};
const MODULE_DESC = {
	vocabulary: "homeModVocabDesc",
	grammar: "homeModGrammarDesc",
	kanji: "homeModKanjiDesc",
	transform: "homeModTransformDesc",
};

// Level picker (doubles as N5 / N4 overview) + the three module cards for
// the chosen level. Every card action launches straight into that
// module/level/tab.
export default function LevelModules({ lang, T, level, onLevelChange, stats, onLaunch }) {
	const headFont = lang === "bn" ? "font-bengali" : "font-mincho";

	return (
		<>
			<section aria-labelledby="home-levels">
				<SectionHeading
					id="home-levels"
					lang={lang}
					title={T("homeLevelsTitle")}
					sub={T("homeLevelsSub")}
				/>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
					{LEVEL_OPTIONS.map((key) => {
						const selected = level === key;
						const s = stats.byLevel[key];
						return (
							<button
								key={key}
								type="button"
								aria-pressed={selected}
								onClick={() => onLevelChange(key)}
								className={`relative flex flex-col text-left rounded-xl border p-3.5 sm:p-5 transition-colors ${key === "all" ? "col-span-2 sm:col-span-1 " : ""}${
									selected
										? "border-shu dark:border-shu-glow bg-shu-soft dark:bg-night-paper ring-2 ring-shu/15 dark:ring-shu-glow/20"
										: "border-ai-line dark:border-night-line bg-paper dark:bg-night-paper hover:border-shu/50"
								}`}
							>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<div className={`${headFont} text-3xl sm:text-4xl font-bold leading-none ${selected ? "text-shu dark:text-shu-glow" : "text-ink dark:text-night-ink"}`}>
											{key === "all" ? T("levelAll") : key.toUpperCase()}
										</div>
										<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink mt-2">
											{T({ all: "homeLevelAllName", n5: "homeLevelN5Name", n4: "homeLevelN4Name" }[key])}
										</div>
										<div className="font-bengali text-[11px] sm:text-xs text-ink-muted dark:text-night-ink-muted mt-0.5">
											{T({ all: "homeLevelAllDesc", n5: "homeLevelN5Desc", n4: "homeLevelN4Desc" }[key])}
										</div>
									</div>
									<span
										aria-hidden="true"
										className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
											selected
												? "bg-shu border-shu dark:bg-shu-glow dark:border-shu-glow text-washi"
												: "border-ai-line dark:border-night-line text-transparent"
										}`}
									>
										<Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} />
									</span>
								</div>
								<div className="mt-auto pt-4">
									<ProgressBar value={s.learned} total={s.total} />
									<div className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted mt-1.5">
										{s.learned}/{s.total} · {T("learnedCount")}
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</section>

			<section aria-labelledby="home-modules">
				<SectionHeading
					id="home-modules"
					lang={lang}
					title={T("homeModulesTitle")}
					sub={T("homeModulesSub")}
				/>
				<div className="grid gap-4 md:grid-cols-3">
					{MODULE_ORDER.map((key) => {
						const mod = MODULES[key];
						const s = stats.byModule[key][level];
						const pct = s.total ? Math.round((s.learned / s.total) * 100) : 0;
						return (
							<article
								key={key}
								className="flex flex-col rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5"
							>
								<div className="flex items-center gap-3">
									<span
										lang="ja"
										className="shrink-0 w-12 h-12 rounded-lg bg-shu-soft dark:bg-night border border-ai-line dark:border-night-line flex items-center justify-center font-mincho text-xl font-bold text-shu dark:text-shu-glow"
									>
										{mod.jp.slice(0, 2)}
									</span>
									<div className="min-w-0">
										<h3 className="font-bengali text-base font-bold text-ink dark:text-night-ink leading-tight">
											{pickLang(mod, lang)}
										</h3>
										<div className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted mt-0.5">
											{s.total.toLocaleString("en-US")} {T(MODULE_UNIT[key])} · {levelLabel(level)}
										</div>
									</div>
								</div>

								<p className="font-bengali text-xs sm:text-[13px] leading-relaxed text-ink-muted dark:text-night-ink-muted mt-3 flex-1">
									{T(MODULE_DESC[key])}
								</p>

								<div className="mt-4">
									<div className="flex items-center justify-between font-mono text-[11px] text-ink-muted dark:text-night-ink-muted mb-1.5">
										<span>{s.learned}/{s.total}</span>
										<span>{pct}%</span>
									</div>
									<ProgressBar value={s.learned} total={s.total} />
								</div>

								<div className="mt-4 grid grid-cols-2 gap-2">
									<button
										type="button"
										onClick={() => onLaunch(key, level, "study")}
										className="col-span-2 group inline-flex items-center justify-center gap-2 rounded-lg bg-shu px-4 py-2.5 font-bengali text-sm font-semibold text-washi hover:brightness-110"
									>
										{key === "grammar" ? T("tabGrammarContent") : T("tabStudy")}
										<Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
									</button>
									<button
										type="button"
										onClick={() => onLaunch(key, level, "quiz")}
										className="rounded-lg border border-ai-line dark:border-night-line px-3 py-2 font-bengali text-xs font-semibold text-ink-muted dark:text-night-ink-muted hover:border-shu/60 hover:text-shu dark:hover:text-shu-glow"
									>
										{T("tabQuiz")}
									</button>
									<button
										type="button"
										onClick={() => onLaunch(key, level, "reference")}
										className="rounded-lg border border-ai-line dark:border-night-line px-3 py-2 font-bengali text-xs font-semibold text-ink-muted dark:text-night-ink-muted hover:border-shu/60 hover:text-shu dark:hover:text-shu-glow"
									>
										{T("tabReference")}
									</button>
								</div>
							</article>
						);
					})}
				</div>
			</section>
		</>
	);
}
