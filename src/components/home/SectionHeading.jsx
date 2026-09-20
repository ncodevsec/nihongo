// Shared heading block for every Home section: title, optional one-line
// subtitle, optional right-aligned action.
export default function SectionHeading({ id, title, sub, lang, action }) {
	const headFont = lang === "bn" ? "font-bengali" : "font-mincho";
	return (
		<div className="flex items-end justify-between gap-4 mb-4 sm:mb-5">
			<div className="min-w-0">
				<h2
					id={id}
					className={`${headFont} text-xl sm:text-2xl font-bold text-ink dark:text-night-ink leading-snug`}
				>
					{title}
				</h2>
				{sub && (
					<p className="font-bengali text-xs sm:text-sm text-ink-muted dark:text-night-ink-muted mt-1">
						{sub}
					</p>
				)}
			</div>
			{action}
		</div>
	);
}
