import Icon from "./icons.jsx";

// A small daily hook on the hero: one kanji, its readings and one example
// word, all straight from the kanji data. The button opens that level's
// kanji flashcards.
export default function KanjiOfTheDay({ kanji, T, onStudy }) {
	if (!kanji) return null;
	const onyomi = kanji.onyomi?.[0];
	const kunyomi = kanji.kunyomi?.[0];
	const example =
		[...(kanji.onyomi || []), ...(kanji.kunyomi || [])].find(
			(e) => e.word && e.word !== kanji.kanji,
		) || onyomi || kunyomi;

	return (
		<div className="relative rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night p-4 sm:p-5">
			<div className="flex items-center justify-between gap-3 mb-4">
				<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">
					{T("homeKotdTitle")}
				</h3>
				<span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-shu-soft text-shu dark:bg-night-paper dark:text-shu-glow border border-ai-line dark:border-night-line">
					{kanji.level.toUpperCase()}
				</span>
			</div>

			<div className="flex items-center gap-4">
				<div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg border-2 border-shu/40 dark:border-shu-glow/50 bg-paper dark:bg-night-paper flex items-center justify-center shadow-card dark:shadow-none">
					<span
						lang="ja"
						className="font-mincho font-bold text-6xl sm:text-7xl leading-none text-ink dark:text-night-ink"
					>
						{kanji.kanji}
					</span>
				</div>
				<div className="min-w-0 space-y-1.5">
					<div lang="ja" className="font-mincho text-xl text-shu dark:text-shu-glow leading-tight">
						{kanji.reading}
					</div>
					<div className="font-bengali text-base font-semibold text-ink dark:text-night-ink leading-snug break-words">
						{kanji.meaning}
					</div>
					<dl className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted space-y-0.5">
						{onyomi && (
							<div className="flex gap-1.5">
								<dt className="font-bengali opacity-80">{T("onyomi")}</dt>
								<dd lang="ja">{onyomi.reading}</dd>
							</div>
						)}
						{kunyomi && (
							<div className="flex gap-1.5">
								<dt className="font-bengali opacity-80">{T("kunyomi")}</dt>
								<dd lang="ja">{kunyomi.reading}</dd>
							</div>
						)}
					</dl>
				</div>
			</div>

			{example && (
				<div className="mt-4 rounded-md border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper px-3 py-2.5">
					<div className="font-bengali text-[10px] uppercase tracking-wide text-ink-muted dark:text-night-ink-muted mb-0.5">
						{T("homeKotdExample")}
					</div>
					<div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
						<span lang="ja" className="font-mincho text-lg font-semibold text-ink dark:text-night-ink">
							{example.word}
						</span>
						<span lang="ja" className="font-mincho text-xs text-ink-muted dark:text-night-ink-muted">
							{example.wordReading}
						</span>
						<span className="font-bengali text-xs text-ink dark:text-night-ink">
							— {example.meaningBn}
						</span>
					</div>
				</div>
			)}

			<button
				type="button"
				onClick={onStudy}
				className="group mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper px-4 py-2.5 font-bengali text-sm font-semibold text-ink dark:text-night-ink hover:border-shu/60 hover:text-shu dark:hover:text-shu-glow"
			>
				{T("homeKotdStudy")}
				<Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
			</button>
		</div>
	);
}
