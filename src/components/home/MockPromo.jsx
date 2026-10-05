import { useMemo } from "react";
import { mt } from "../../lib/mockI18n.js";
import { readMockHistory } from "../../hooks/useMockStore.js";
import { MOCK_LEVELS } from "../../data/mock/blueprints.js";
import Icon from "./icons.jsx";
import SectionHeading from "./SectionHeading.jsx";

// Home entry point to the Mock Test tab: one button per level, plus the most
// recent full-paper score so the learner sees where they stand.
export default function MockPromo({ lang, isActive, onLaunch }) {
	const M = (k) => mt(lang, k);
	// Re-read whenever Home becomes visible again (a test may have just finished).
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const last = useMemo(() => readMockHistory().find((h) => h.complete), [isActive]);
	return (
		<section aria-labelledby="home-mock">
			<SectionHeading id="home-mock" lang={lang} title={M("promoTitle")} sub={M("promoSub")} />
			<div className="relative overflow-hidden rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5">
				<span aria-hidden="true" lang="ja" className="pointer-events-none select-none absolute -right-1 -bottom-6 font-mincho font-bold text-[7rem] leading-none text-shu/[0.06] dark:text-shu-glow/[0.08]">模試</span>
				<div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex items-center gap-3 min-w-0">
						<span className="shrink-0 w-11 h-11 rounded-lg bg-shu-soft dark:bg-night border border-ai-line dark:border-night-line flex items-center justify-center text-shu dark:text-shu-glow">
							<Icon name="mock" className="w-5 h-5" />
						</span>
						<div className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">
							{last ? `${M("promoLast")}: ${last.total}/180 · ${last.level.toUpperCase()} ${last.format.toUpperCase()}` : "JLPT · NAT-TEST"}
						</div>
					</div>
					<div className="flex gap-2.5">
						{MOCK_LEVELS.map((lv) => (
							<button
								key={lv}
								type="button"
								onClick={() => onLaunch("vocabulary", lv, "mock")}
								className="group inline-flex items-center gap-2 rounded-lg bg-shu px-5 py-2.5 font-bengali text-sm font-semibold text-washi hover:brightness-110"
							>
								{lv.toUpperCase()}
								<Icon name="arrowRight" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
