import { MODULES, MODULE_ORDER, LEVEL_OPTIONS } from "../data/modules.js";
import { t, pickLang } from "../lib/i18n.js";

// Course (All / N5 / N4) and module (Vocabulary / Grammar / Kanji / Transform) selectors.
// Level is a sliding segmented control; modules are icon cards with their Japanese glyph.
export default function LevelModuleBar({ moduleKey, onModuleChange, level, onLevelChange, settings }) {
	const lang = settings.uiLang;
	const idx = Math.max(0, LEVEL_OPTIONS.indexOf(level));
	const n = LEVEL_OPTIONS.length;

	return (
		<div className="max-w-4xl mx-auto space-y-3">
			<div
				role="tablist"
				aria-label={t(lang, "level")}
				className="relative grid rounded-2xl bg-ai-soft dark:bg-night-line/60 p-1 border border-ai-line dark:border-night-line"
				style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
			>
				<span
					aria-hidden="true"
					className="absolute top-1 bottom-1 left-1 rounded-xl bg-shu dark:bg-shu-glow shadow-md transition-transform duration-300 ease-out"
					style={{ width: `calc((100% - 0.5rem) / ${n})`, transform: `translateX(${idx * 100}%)` }}
				/>
				{LEVEL_OPTIONS.map((key) => {
					const active = level === key;
					return (
						<button
							key={key}
							type="button"
							role="tab"
							aria-selected={active}
							onClick={() => onLevelChange(key)}
							className={`tap-quiet relative z-10 py-2 text-sm font-bold transition-colors ${
								active ? "text-washi dark:text-white" : "text-ink-muted dark:text-night-ink-muted hover:text-shu dark:hover:text-shu-glow"
							}`}
						>
							{key === "all" ? t(lang, "levelAll") : MODULES[moduleKey].levels[key].label}
						</button>
					);
				})}
			</div>

			<div role="tablist" aria-label="Module" className="grid grid-cols-4 gap-2">
				{MODULE_ORDER.map((key) => {
					const mod = MODULES[key];
					const active = moduleKey === key;
					return (
						<button
							key={key}
							type="button"
							role="tab"
							aria-selected={active}
							onClick={() => onModuleChange(key)}
							className={`tap-quiet group flex flex-col items-center gap-1 rounded-2xl border px-1 py-2.5 transition-all ${
								active
									? "border-shu dark:border-shu-glow bg-shu-soft dark:bg-night-paper ring-2 ring-shu/15 dark:ring-shu-glow/20"
									: "border-ai-line dark:border-night-line bg-paper dark:bg-night-paper hover:border-shu/40"
							}`}
						>
							<span
								lang="ja"
								className={`flex h-9 w-9 items-center justify-center rounded-xl font-mincho text-sm font-bold transition-colors ${
									active
										? "bg-shu dark:bg-shu-glow text-washi dark:text-white"
										: "bg-ai-soft dark:bg-night-line text-ink-muted dark:text-night-ink-muted group-hover:text-shu"
								}`}
							>
								{mod.jp.slice(0, 2)}
							</span>
							<span
								className={`font-bengali text-[11px] font-semibold leading-tight truncate max-w-full ${
									active ? "text-shu dark:text-shu-glow" : "text-ink-muted dark:text-night-ink-muted"
								}`}
							>
								{pickLang(mod, lang)}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
