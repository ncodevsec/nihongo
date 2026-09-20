import { useEffect, useMemo, useRef, useState } from "react";
import { t } from "../lib/i18n.js";
import {
	DEFAULT_HUE,
	HUE_PRESETS,
	applyThemeHue,
	hueGradient,
	primaryAt,
} from "../lib/themeColor.js";

const PRESET_LABEL = {
	red: "themeHueRed",
	orange: "themeHueOrange",
	green: "themeHueGreen",
	teal: "themeHueTeal",
	blue: "themeHueBlue",
	purple: "themeHuePurple",
	pink: "themeHuePink",
};

// Accent-color picker for Settings: a hue slider whose track is a gradient
// of the actual resulting colors, quick presets, a live preview built from
// the same classes the real UI uses, and a reset. While dragging, the color
// is applied straight to the page (cheap); the setting itself is saved a
// moment after the last movement so the whole app isn't re-rendered on
// every tick.
export default function ThemeColorPicker({ hue, onCommit, lang }) {
	const T = (k) => t(lang, k);
	const [value, setValue] = useState(hue);
	const timer = useRef(null);
	const latest = useRef(hue);
	const commitRef = useRef(onCommit);
	commitRef.current = onCommit;

	// Follow external changes (e.g. "reset settings").
	useEffect(() => {
		setValue(hue);
		latest.current = hue;
	}, [hue]);

	// Save any pending change if the panel closes mid-drag.
	useEffect(
		() => () => {
			if (timer.current) {
				clearTimeout(timer.current);
				commitRef.current(latest.current);
			}
		},
		[],
	);

	const change = (next) => {
		latest.current = next;
		setValue(next);
		applyThemeHue(next);
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			timer.current = null;
			commitRef.current(next);
		}, 200);
	};

	const track = useMemo(() => hueGradient(36), []);
	const isDefault = Math.abs(value - DEFAULT_HUE) < 0.5;

	return (
		<div className="border-t border-ai-line dark:border-night-line px-4 py-4 space-y-4">
			<div>
				<div className="font-bengali text-sm text-ink dark:text-night-ink">{T("themeColor")}</div>
				<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-0.5">
					{T("themeColorSub")}
				</div>
			</div>

			<div className="px-1">
				<input
					type="range"
					min={0}
					max={360}
					step={1}
					value={Math.round(value)}
					onChange={(e) => change(Number(e.target.value))}
					aria-label={T("themeColorHue")}
					className="hue-slider"
					style={{ background: track }}
				/>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-2" role="group" aria-label={T("themeColor")}>
					{HUE_PRESETS.map((p) => {
						const active = Math.abs(value - p.hue) < 4;
						return (
							<button
								key={p.key}
								type="button"
								onClick={() => change(p.hue)}
								aria-label={T(PRESET_LABEL[p.key])}
								aria-pressed={active}
								title={T(PRESET_LABEL[p.key])}
								className={`w-7 h-7 rounded-full border-2 border-paper dark:border-night-paper transition-transform hover:scale-110 ${
									active ? "ring-2 ring-ink dark:ring-night-ink" : "ring-1 ring-ai-line dark:ring-night-line"
								}`}
								style={{ backgroundColor: primaryAt(p.hue) }}
							/>
						);
					})}
				</div>
				<button
					type="button"
					onClick={() => change(DEFAULT_HUE)}
					disabled={isDefault}
					className="font-bengali text-xs rounded-md px-3 py-1.5 border border-ai-line dark:border-night-line text-shu dark:text-shu-glow hover:bg-shu-soft dark:hover:bg-night-line disabled:opacity-40 disabled:hover:bg-transparent"
				>
					{T("themeColorReset")}
				</button>
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
