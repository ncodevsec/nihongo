import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { t } from "../lib/i18n.js";
import { pathFor } from "../lib/routes.js";

export const NAV_ICONS = {
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

// The five primary destinations, shared by the mobile dock and the desktop sidebar.
export function useNavItems() {
	const { settings, selection } = useApp();
	const lang = settings.uiLang;
	const { pathname } = useLocation();
	const { moduleKey, level } = selection;
	return [
		{ key: "home", to: "/", label: t(lang, "tabHome"), active: pathname === "/" },
		{ key: "study", to: pathFor(moduleKey, level, "study"), label: t(lang, "navStudy"), active: pathname.startsWith("/study") },
		{ key: "mock", to: "/mock-test", label: t(lang, "tabMock"), active: pathname.startsWith("/mock-test") },
		{ key: "progress", to: pathFor(moduleKey, level, "progress"), label: t(lang, "tabProgress"), active: pathname.startsWith("/progress") },
		{ key: "profile", to: "/profile", label: t(lang, "navProfile"), active: pathname.startsWith("/profile") || pathname.startsWith("/settings") },
	];
}
