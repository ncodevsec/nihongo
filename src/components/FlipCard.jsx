// Flashcard with a 3D flip animation. Both faces are always rendered, stacked in one
// grid cell (so the card is as tall as the taller face); the card rotates 180° on Y.
// `cardKey` remounts the card when the item changes, so moving to the next card never
// animates back through the new card's answer side.
export default function FlipCard({
	flipped,
	onToggle,
	front,
	back,
	cardKey,
	faceClass = "bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none text-left",
	className = "",
}) {
	return (
		<div className={`flip-scene ${className}`}>
			<button
				key={cardKey}
				type="button"
				onClick={onToggle}
				aria-pressed={flipped}
				className={`flip-card w-full text-left ${flipped ? "is-flipped" : ""}`}
			>
				<div className={`flip-face ${faceClass}`} aria-hidden={flipped}>
					{front}
				</div>
				<div className={`flip-face flip-back ${faceClass}`} aria-hidden={!flipped}>
					{back}
				</div>
			</button>
		</div>
	);
}
