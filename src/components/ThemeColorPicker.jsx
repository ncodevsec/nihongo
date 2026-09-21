import { t } from "../lib/i18n.js";
import { HUE_PRESETS, primaryAt, snapToPreset } from "../lib/themeColor.js";

export const PRESET_LABEL = {
	red: "themeHueRed",
	blue: "themeHueBlue",
	green: "themeHueGreen",
	purple: "themeHuePurple",
	orange: "themeHueOrange",
};

// Accent-color picker for Settings: five curated colors plus a live
// preview built from the same classes the real UI uses. Picking one
// recolors the whole app immediately (see lib/themeColor.js).
export default function ThemeColorPicker({ hue, onChange, lang }) {
	const T = (k) => t(lang, k);
	const current = snapToPreset(hue);

	return (
		<div className="px-4 pb-4 space-y-4">

			<div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={T("themeColor")}>
				{HUE_PRESETS.map((p) => {
					const active = current === p.hue;
					return (
						<button
							key={p.key}
							type="button"
							role="radio"
							aria-checked={active}
							onClick={() => onChange(p.hue)}
							className={`flex flex-col items-center gap-1.5 rounded-lg border px-1 py-2.5 transition-colors ${
								active
									? "border-shu dark:border-shu-glow bg-shu-soft dark:bg-night"
									: "border-ai-line dark:border-night-line hover:border-shu/40"
							}`}
						>
							<span
								className="relative w-9 h-9 rounded-full shadow-sm ring-2 ring-paper dark:ring-night-paper flex items-center justify-center"
								style={{ backgroundColor: primaryAt(p.hue) }}
							>
								{active && (
									<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
										<path d="M5 12.5l4.5 4.5L19 7.5" />
									</svg>
								)}
							</span>
							<span className="font-bengali text-[11px] font-medium text-ink dark:text-night-ink">
								{T(PRESET_LABEL[p.key])}
							</span>
						</button>
					);
				})}
			</div>

			{/* Live preview — real theme classes, so it is exactly what the app will look like */}
			<div className="rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night p-3.5">
				<div className="font-bengali text-[10px] uppercase tracking-wide text-ink-muted dark:text-night-ink-muted mb-2.5">
					{T("themePreview")}
				</div>
				<div className="flex flex-wrap items-center gap-2.5">
					<span className="font-bengali text-xs font-semibold rounded-md px-3.5 py-1.5 bg-shu dark:bg-shu-glow text-washi dark:text-white shadow-sm">
						{T("themePreviewPrimary")}
					</span>
					<span className="font-bengali text-xs font-semibold rounded-md px-3.5 py-1.5 border border-shu/40 dark:border-shu-glow/40 text-shu dark:text-shu-glow">
						{T("themePreviewOutline")}
					</span>
					<span className="font-bengali text-[11px] rounded-full px-2.5 py-1 bg-shu-soft dark:bg-shu/10 text-shu dark:text-shu-glow border border-ai-line dark:border-night-line">
						{T("themePreviewTag")}
					</span>
				</div>
				<div className="mt-3">
					<div className="flex justify-between font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mb-1">
						<span>{T("themePreviewProgress")}</span>
						<span className="font-mono text-shu dark:text-shu-glow">64%</span>
					</div>
					<div className="h-1.5 rounded-full bg-ai-line dark:bg-night-line overflow-hidden">
						<div className="h-full w-[64%] rounded-full bg-shu dark:bg-shu-glow" />
					</div>
				</div>
			</div>
		</div>
	);
}
