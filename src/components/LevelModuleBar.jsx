import { MODULES, MODULE_ORDER, LEVEL_ORDER } from "../data/modules.js";
import { t, pickLang } from "../lib/i18n.js";

export default function LevelModuleBar({
	moduleKey,
	onModuleChange,
	level,
	onLevelChange,
	onHome,
	settings,
}) {
	const lang = settings.uiLang;

	return (
		<div className="max-w-4xl mx-auto px-3 sm:px-5">
			<div className="flex flex-wrap items-center gap-2 sm:gap-3">
				<button
					type="button"
					onClick={onHome}
					aria-label={t(lang, "tabHome")}
					title={t(lang, "tabHome")}
					className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line bg-washi dark:bg-night text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft hover:text-shu dark:hover:bg-night-line dark:hover:text-shu-glow"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
						<path d="M3 10.5L12 3l9 7.5" />
						<path d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5" />
					</svg>
				</button>

				<div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden bg-washi dark:bg-night">
					{LEVEL_ORDER.map((key) => {
						const lvl = MODULES[moduleKey].levels[key];
						const isActiveLevel = level === key;
						return (
							<button
								key={key}
								onClick={() => onLevelChange(key)}
								className={`px-3 py-1.5 text-xs font-semibold ${
									isActiveLevel
										? "bg-shu text-washi shadow-sm"
										: "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
								}`}
							>
								{lvl.label}
							</button>
						);
					})}
				</div>

				<span
					className="hidden sm:block w-px h-6 bg-ai-line dark:bg-night-line"
					aria-hidden="true"
				/>

				<div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden bg-washi dark:bg-night">
					{MODULE_ORDER.map((key) => {
						const mod = MODULES[key];
						const isActiveModule = moduleKey === key;
						return (
							<button
								key={key}
								onClick={() => onModuleChange(key)}
								className={`px-3 py-1.5 text-xs font-bengali font-semibold ${
									isActiveModule
										? "bg-shu text-washi shadow-sm"
										: "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
								}`}
							>
								{pickLang(mod, lang)}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
