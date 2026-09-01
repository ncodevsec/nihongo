// A hanko-style seal stamp — the single recurring signature element.
// Styled like a real red ink stamp on paper, used for scores and mastery
// counts rather than as a heavy decorative block.
export default function Hanko({ label, sub, tone = "shu", size = "md" }) {
  const toneClasses = {
    shu: "border-shu text-shu dark:border-shu-glow dark:text-shu-glow",
    ai: "border-ai text-ai dark:border-ai-glow dark:text-ai-glow",
    take: "border-take text-take dark:border-take-glow dark:text-take-glow",
    sakura: "border-sakura-deep text-sakura-deep dark:border-sakura dark:text-sakura",
  }[tone];

  const sizeClasses = {
    sm: "w-9 h-9 text-[11px]",
    md: "w-14 h-14 text-sm",
    lg: "w-20 h-20 text-lg",
  }[size];

  return (
    <div
      className={`shrink-0 inline-flex flex-col items-center justify-center rounded-full border-2 bg-paper dark:bg-night-paper ${toneClasses} ${sizeClasses} font-mincho leading-none select-none`}
      aria-hidden="true"
    >
      <span className="font-bold tracking-tight">{label}</span>
      {sub && <span className="text-[0.6em] mt-0.5 opacity-75">{sub}</span>}
    </div>
  );
}
