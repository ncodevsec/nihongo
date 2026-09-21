import { useEffect, useState } from "react";
import { t } from "../lib/i18n.js";
import {
	JP_FONTS,
	JP_FONT_SAMPLE_KANA,
	JP_FONT_SAMPLE_KANJI,
	checkJpFont,
	loadPreviewFonts,
} from "../lib/jpFonts.js";

// Settings list of Japanese typefaces. Each row shows its own sample text
// set in that font, so the choice is made by eye; picking one applies it
// to the whole app immediately.
export default function JpFontPicker({ value, onChange, lang }) {
	const T = (k) => t(lang, k);

	// key -> "loading" | "ok" | "failed", so a font that did not actually
	// load is reported instead of quietly looking like the others.
	const [status, setStatus] = useState({});

	useEffect(() => {
		loadPreviewFonts();
		let cancelled = false;
		for (const f of JP_FONTS) {
			checkJpFont(f.key).then((ok) => {
				if (!cancelled) setStatus((s) => ({ ...s, [f.key]: ok ? "ok" : "failed" }));
			});
		}
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div className="px-4 pb-4">
			<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mb-3">
				{T("jpFontSub")}
			</div>
			<div className="space-y-2" role="radiogroup" aria-label={T("sectionJpFont")}>
				{JP_FONTS.map((f) => {
					const active = value === f.key;
					return (
						<button
							key={f.key}
							type="button"
							role="radio"
							aria-checked={active}
							onClick={() => onChange(f.key)}
							className={`w-full text-left rounded-lg border px-3.5 py-3 transition-colors ${
								active
									? "border-shu dark:border-shu-glow bg-shu-soft dark:bg-night"
									: "border-ai-line dark:border-night-line hover:border-shu/40"
							}`}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<span className="font-mono text-[13px] font-semibold text-ink dark:text-night-ink">
											{f.name}
										</span>
										{f.key === "default" && (
											<span className="font-bengali text-[10px] font-semibold rounded-full px-2 py-0.5 bg-ai-soft dark:bg-night-line text-ai dark:text-ai-glow">
												{T("jpFontDefaultTag")}
											</span>
										)}
									</div>
									<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-0.5">
										{T(f.descKey)}
									</div>
								</div>
								<span
									aria-hidden="true"
									className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
										active
											? "bg-shu border-shu dark:bg-shu-glow dark:border-shu-glow text-washi"
											: "border-ai-line dark:border-night-line text-transparent"
									}`}
								>
									<svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
										<path d="M5 12.5l4.5 4.5L19 7.5" />
									</svg>
								</span>
							</div>
							<div
								lang="ja"
								style={{ fontFamily: `${f.family}, serif` }}
								className="mt-3 text-ink dark:text-night-ink break-words"
							>
								<div className="text-2xl sm:text-3xl leading-snug">{JP_FONT_SAMPLE_KANA}</div>
								<div className="text-lg sm:text-xl leading-relaxed font-bold">{JP_FONT_SAMPLE_KANJI}</div>
							</div>
							{status[f.key] === "failed" && (
								<div className="mt-2 font-bengali text-[11px] text-danger dark:text-danger-glow">
									{T("jpFontFailed")}
								</div>
							)}
							{!status[f.key] && (
								<div className="mt-2 font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">
									{T("jpFontLoading")}
								</div>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
