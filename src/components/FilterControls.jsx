// Small reusable toggle controls shared by the flashcard, list, and
// grammar views. All are real <button> toggles (not checkboxes) that show
// a clearly different "active" style when pressed.

export function ToggleChip({ active, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`font-bengali text-xs rounded-md px-3 py-1.5 border transition-colors ${
        active
          ? "bg-shu text-washi border-shu"
          : "bg-paper dark:bg-night-paper text-ink dark:text-night-ink border-ai-line dark:border-night-line hover:border-shu/50"
      }`}
    >
      {children}
    </button>
  );
}

export function StarFilterButton({ active, onClick, labelOn, labelOff }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? labelOn : labelOff}
      title={active ? labelOn : labelOff}
      className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-md border transition-colors ${
        active
          ? "bg-shu text-washi border-shu"
          : "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted border-ai-line dark:border-night-line hover:text-shu dark:hover:text-shu-glow hover:border-shu/50"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3.5z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function ShuffleButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper text-ai dark:text-ai-glow hover:bg-ai-soft dark:hover:bg-night-line transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    </button>
  );
}

// Bold up/down arrow (filled arrowhead) — much easier to spot than a thin
// unicode ↑/↓ glyph, which nearly disappears at small sizes.
export function SortDirectionButton({ dir, onClick, labelAsc, labelDesc }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "asc" ? labelAsc : labelDesc}
      title={dir === "asc" ? labelAsc : labelDesc}
      className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper text-ai dark:text-ai-glow hover:bg-ai-soft dark:hover:bg-night-line transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === "asc" ? (
          <>
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="6 11 12 5 18 11" />
          </>
        ) : (
          <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="18 13 12 19 6 13" />
          </>
        )}
      </svg>
    </button>
  );
}
