import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { t } from "../lib/i18n.js";
import { pathFor } from "../lib/routes.js";

const ICONS = {
	home: (
		<>
			<path d="M3 10.5L12 3l9 7.5" />
			<path d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5" />
		</>
	),
	study: <path d="M4 5.5a2 2 0 012-2h4.5v13H6a2 2 0 00-2 2v-13zM20 5.5a2 2 0 00-2-2h-4.5v13H18a2 2 0 012 2v-13z" />,
	mock: (
		<>
			<rect x="5" y="3.5" width="14" height="17" rx="2" />
			<path d="M9 8.5h6M9 12.5h6M9 16.5h3" />
		</>
	),
	progress: <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />,
	profile: (
		<>
			<circle cx="12" cy="8.5" r="3.5" />
			<path d="M5 20c.8-3.6 3.7-5.5 7-5.5s6.2 1.9 7 5.5" />
		</>
	),
};

// Mobile-first bottom dock: Home · Study · Mock Test · Progress · Profile.
// Hidden from lg up, where the Sidebar takes over.
export default function BottomNav() {
	const { settings, selection, updateAvailable } = useApp();
	const lang = settings.uiLang;
	const { pathname } = useLocation();
	const items = [
		{ key: "home", to: "/", label: t(lang, "tabHome"), match: (p) => p === "/" },
		{ key: "study", to: pathFor(selection.moduleKey, selection.level, "study"), label: t(lang, "navStudy"), match: (p) => p.startsWith("/study") },
		{ key: "mock", to: "/mock-test", label: t(lang, "tabMock"), match: (p) => p.startsWith("/mock-test") },
		{ key: "progress", to: pathFor(selection.moduleKey, selection.level, "progress"), label: t(lang, "tabProgress"), match: (p) => p.startsWith("/progress") },
		{ key: "profile", to: "/profile", label: t(lang, "navProfile"), match: (p) => p.startsWith("/profile") },
	];
	return (
		<nav
			aria-label="Primary"
			className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-ai-line dark:border-night-line bg-paper/95 dark:bg-night-paper/95 backdrop-blur shadow-[0_-4px_16px_rgba(20,15,15,0.06)] dark:shadow-none pb-[env(safe-area-inset-bottom)]"
		>
			<ul className="grid grid-cols-5 max-w-xl mx-auto">
				{items.map((it) => {
					const active = it.match(pathname);
					return (
						<li key={it.key}>
							<NavLink
								to={it.to}
								aria-current={active ? "page" : undefined}
								className={`tap-quiet flex flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 font-bengali text-[10px] font-semibold ${
									active ? "text-shu dark:text-shu-glow" : "text-ink-muted dark:text-night-ink-muted"
								}`}
							>
								<span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${active ? "bg-shu-soft dark:bg-shu/15" : ""}`}>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
										{ICONS[it.key]}
									</svg>
									{it.key === "profile" && updateAvailable && (
										<span className="absolute ml-5 -mt-4 w-2 h-2 rounded-full bg-shu dark:bg-shu-glow" aria-hidden="true" />
									)}
								</span>
								<span className="leading-none">{it.label}</span>
							</NavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
