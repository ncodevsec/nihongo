// Renders Japanese text with an optional furigana reading using the
// browser's native <ruby>/<rt> elements. Falls back to plain text when
// furigana is turned off in Settings, when there's no reading to show, or
// when the reading is identical to the text itself (kana-only entries,
// where a reading annotation would just repeat what's already there).
export default function Furigana({ text, reading, show, className = "" }) {
	if (!show || !reading || reading === text) {
		return <span className={className}>{text}</span>;
	}
	return (
		<ruby className={className}>
			{text}
			<rp>(</rp>
			<rt
				className="font-normal text-ai dark:text-ai-glow opacity-90"
				style={{ fontSize: "0.45em" }}
			>
				{reading}
			</rt>
			<rp>)</rp>
		</ruby>
	);
}
