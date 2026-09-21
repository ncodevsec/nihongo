import { useId, useState } from "react";

// A collapsible block inside a Settings card: a full-width header (title,
// optional subtitle, a small summary of the current choice, chevron) that
// opens/closes its body. Collapsed by default and the body is only mounted
// while open, so heavy content (like the font samples) costs nothing until
// the learner actually opens it.
export default function SettingsAccordion({ title, subtitle, summary, children }) {
	const [open, setOpen] = useState(false);
	const id = useId();

	return (
		<div className="border-t border-ai-line dark:border-night-line">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={`${id}-body`}
				className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-shu-soft/40 dark:hover:bg-night"
			>
				<div className="min-w-0">
					<div className="font-bengali text-sm text-ink dark:text-night-ink">{title}</div>
					{subtitle && (
						<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-0.5">
							{subtitle}
						</div>
					)}
				</div>
				<div className="flex items-center gap-2.5 shrink-0">
					{summary}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
						className={`w-4 h-4 text-ink-muted dark:text-night-ink-muted transition-transform duration-200 ${
							open ? "rotate-180" : ""
						}`}
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</div>
			</button>
			{open && (
				<div id={`${id}-body`} role="region" aria-label={title}>
					{children}
				</div>
			)}
		</div>
	);
}
