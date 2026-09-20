import Icon from "./icons.jsx";

function LangToggle({ lang, T, onChange }) {
	return (
		<div
			role="group"
			aria-label={T("homeLanguage")}
			className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden bg-washi dark:bg-night text-xs font-semibold"
		>
			{[
				{ key: "bn", label: "বাংলা" },
				{ key: "en", label: "EN" },
			].map((o) => (
				<button
					key={o.key}
					type="button"
					aria-pressed={lang === o.key}
					onClick={() => onChange(o.key)}
					className={`font-bengali px-3 py-1.5 ${
						lang === o.key
							? "bg-shu text-washi"
							: "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
					}`}
				>
					{o.label}
				</button>
			))}
		</div>
	);
}

function ThemeToggle({ isDark, label, onToggle }) {
	return (
		<button
			type="button"
			onClick={onToggle}
			aria-label={label}
			title={label}
			className="w-8 h-8 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line bg-washi dark:bg-night text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow"
		>
			<Icon name={isDark ? "sun" : "moon"} className="w-4 h-4" />
		</button>
	);
}

// The landing block: greeting, headline, primary/secondary call to action,
// reassurance chips, and (on wide screens, beside it) the kanji-of-the-day
// card passed in as children. Language and theme switches live here so a
// first-time visitor can pick their language before anything else.
export default function HomeHero({
	lang,
	T,
	isReturning,
	isDark,
	onLangChange,
	onThemeToggle,
	primaryLabel,
	primarySub,
	onPrimary,
	secondaryLabel,
	onSecondary,
	children,
}) {
	const headFont = lang === "bn" ? "font-bengali" : "font-mincho";
	const chips = ["homeChipMeanings", "homeChipOffline", "homeChipNoSignup"];

	return (
		<section
			aria-labelledby="home-title"
			className="relative overflow-hidden rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card-lg dark:shadow-none"
		>
			{/* Decorative only: sakura wash + oversized watermark kanji */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-28 -right-24 w-96 h-96 rounded-full opacity-40 dark:opacity-[0.12] blur-3xl"
				style={{ background: "radial-gradient(circle, rgb(var(--sakura)) 0%, transparent 70%)" }}
			/>
			<span
				aria-hidden="true"
				lang="ja"
				className="pointer-events-none select-none absolute -bottom-6 -left-3 sm:left-4 font-mincho font-bold leading-none text-[8rem] sm:text-[12rem] text-shu/[0.05] dark:text-shu-glow/[0.06] whitespace-nowrap"
			>
				日本語
			</span>

			<div className="relative grid gap-8 p-5 sm:p-8 lg:p-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center">
				<div>
					<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-5 sm:mb-6">
						<span className="inline-flex items-center gap-2 font-bengali text-[11px] sm:text-xs font-semibold text-shu dark:text-shu-glow">
							<span className="w-2 h-2 rounded-full bg-shu dark:bg-shu-glow" aria-hidden="true" />
							{isReturning ? T("homeGreetingBack") : T("homeGreetingNew")}
							<span className="text-ink-muted dark:text-night-ink-muted font-normal">
								· {T("homeEyebrow")}
							</span>
						</span>
						<div className="flex items-center gap-2">
							<LangToggle lang={lang} T={T} onChange={onLangChange} />
							<ThemeToggle isDark={isDark} label={T("homeToggleTheme")} onToggle={onThemeToggle} />
						</div>
					</div>

					<h1
						id="home-title"
						className={`${headFont} text-3xl sm:text-4xl xl:text-[2.75rem] font-bold leading-[1.15] text-ink dark:text-night-ink`}
					>
						<span className="block">{T("homeTitle1")}</span>
						<span className="block text-shu dark:text-shu-glow">{T("homeTitle2")}</span>
					</h1>

					<p className="font-bengali mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-ink-muted dark:text-night-ink-muted">
						{T("homeSubtitle")}
					</p>

					<div className="mt-6 flex flex-col sm:flex-row gap-3">
						<button
							type="button"
							onClick={onPrimary}
							className="group inline-flex items-center justify-between sm:justify-center gap-3 rounded-lg bg-shu px-5 py-3 text-washi shadow-card hover:brightness-110 dark:shadow-none"
						>
							<span className="flex flex-col items-start text-left leading-tight">
								<span className="font-bengali text-sm sm:text-base font-semibold">
									{primaryLabel}
								</span>
								{primarySub && (
									<span className="font-bengali text-[11px] font-normal opacity-85">
										{primarySub}
									</span>
								)}
							</span>
							<Icon
								name="arrowRight"
								className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
								strokeWidth={2}
							/>
						</button>
						<button
							type="button"
							onClick={onSecondary}
							className="inline-flex items-center justify-center rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night px-5 py-3 font-bengali text-sm sm:text-base font-semibold text-ink dark:text-night-ink hover:border-shu/60 hover:text-shu dark:hover:text-shu-glow"
						>
							{secondaryLabel}
						</button>
					</div>

					<ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
						{chips.map((k) => (
							<li
								key={k}
								className="flex items-center gap-1.5 font-bengali text-xs text-ink-muted dark:text-night-ink-muted"
							>
								<Icon name="check" className="w-3.5 h-3.5 text-take dark:text-take-glow" strokeWidth={2.4} />
								{T(k)}
							</li>
						))}
					</ul>
				</div>

				<div>{children}</div>
			</div>
		</section>
	);
}
