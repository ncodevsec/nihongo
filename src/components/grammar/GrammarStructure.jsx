import { t } from "../../lib/i18n.js";

// The sentence pattern of a rule. " + " splits a pattern into chips: parts
// that are fixed Japanese (particles, endings) are highlighted, variable
// slots (Noun, Verb て-Form …, anything with Latin letters) are neutral.
// A new line in `structure` starts another pattern.
const isSlot = (s) => /[A-Za-z]/.test(s);

export default function GrammarStructure({ structure, lang, className = "" }) {
	if (!structure) return null;
	const rows = structure.split("\n").filter(Boolean);
	return (
		<div>
			<div className="font-bengali text-xs font-bold uppercase tracking-wide text-shu dark:text-shu-glow mb-1.5">
				{t(lang, "grammarStructure")}
			</div>
			<div
				// className={`rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2.5 ${className}`}
				className={`py-2.5 ${className}`}
			>
				{/* <div className="font-bengali text-[10px] font-bold uppercase tracking-wide text-shu dark:text-shu-glow mb-1.5">
				{t(lang, "grammarStructure")}
			</div> */}
				<div className="space-y-2">
					{rows.map((row, ri) => (
						<div
							key={ri}
							className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5"
						>
							{row.split(" + ").map((part, pi) => (
								<span
									key={pi}
									className="inline-flex items-center gap-1.5"
								>
									{pi > 0 && (
										<span className="text-ink-muted/60 dark:text-night-ink-muted/60 text-xs">
											+
										</span>
									)}
									{/* <span
									lang="ja"
									className={`rounded-md border px-2 py-0.5 text-[13px] leading-snug ${
										isSlot(part)
											? "font-bengali border-ai-line dark:border-night-line bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted"
											: "font-mincho font-semibold border-shu/30 dark:border-shu-glow/30 bg-shu-soft dark:bg-shu/10 text-shu dark:text-shu-glow"
									}`}
								>
									{part}
								</span> */}
									<span
										lang="ja"
										className={`leading-snug text-[13px] rounded-sm px-2 py-1 ${
											isSlot(part)
												? "font-bengali bg-ai-line dark:bg-night-line"
												: "font-mincho bg-shu/20 dark:bg-shu-glow/20"
										}`}
									>
										{part}
									</span>
								</span>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
