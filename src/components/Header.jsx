import { MODULES } from "../data/modules.js";
import { t } from "../lib/i18n.js";

function SettingsIcon({ className = "w-4 h-4" }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${className} shrink-0`}
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
		</svg>
	);
}

function BackIcon({ className = "w-4 h-4" }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${className} shrink-0`}
			aria-hidden="true"
		>
			<polyline points="15 18 9 12 15 6" />
		</svg>
	);
}

export default function Header({
	active,
	onChange,
	onBack,
	moduleKey,
	accuracy,
	masteredCount,
	total,
	settings,
}) {
	const lang = settings.uiLang;
	const T = (k) => t(lang, k);
	const isGrammar = MODULES[moduleKey].kind === "grammar";
	const isSettings = active === "settings";

	return (
		<header className="relative bg-paper dark:bg-night-paper border-b border-ai-line dark:border-night-line overflow-hidden shadow-card dark:shadow-none">
			{/* Faint cherry-blossom accent wash in the corner — decorative only */}
			<div
				className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.35] dark:opacity-[0.12] blur-2xl"
				style={{
					background:
						"radial-gradient(circle, #e48b8b 0%, transparent 70%)",
				}}
				aria-hidden="true"
			/>

			<div className="relative max-w-4xl mx-auto px-3 sm:px-5 py-3 sm:py-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3 min-w-0">
						<img
							src="./icons/logo-mark-96.png"
							alt="NihonGoSL"
							className="w-9 h-9 shrink-0"
							width={36}
							height={36}
						/>
						<div className="min-w-0">
							<h1 className="font-mincho text-lg sm:text-xl font-bold text-ink dark:text-night-ink truncate">
								NihonGo - Study Lab
							</h1>
							<p className="font-bengali text-[11px] sm:text-xs text-ink-muted dark:text-night-ink-muted truncate">
								{T("appSubtitle")}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3 shrink-0">
						{!isGrammar && !isSettings && (
							<div className="hidden sm:flex items-center gap-4 font-mono text-xs">
								<div className="text-right">
									<div className="text-shu dark:text-shu-glow font-semibold">
										{accuracy}%
									</div>
									<div className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">
										{T("accuracy")}
									</div>
								</div>
								<div className="text-right">
									<div className="text-ink dark:text-night-ink font-semibold">
										{masteredCount}/{total}
									</div>
									<div className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">
										{T("learnedCount")}
									</div>
								</div>
							</div>
						)}

						{/* This single button doubles as the Settings entry point and,
                while on the Settings page, a Back button — same position,
                swapped icon/action, so it's always reachable in one tap. */}
						<button
							onClick={() =>
								isSettings ? onBack() : onChange("settings")
							}
							aria-label={
								isSettings ? T("backButton") : T("tabSettings")
							}
							title={
								isSettings ? T("backButton") : T("tabSettings")
							}
							aria-pressed={isSettings}
							className={`w-9 h-9 flex items-center justify-center rounded-full border ${
								isSettings
									? "bg-shu border-shu text-washi"
									: "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 hover:bg-shu-soft dark:hover:bg-night-line"
							}`}
						>
							{isSettings ? <BackIcon /> : <SettingsIcon />}
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
