import { MODULES, LEVEL_OPTIONS } from "../data/modules.js";

// URL <-> app-state mapping. Tabs keep their internal names
// (study / quiz / reference / progress / mock / settings / home); the URL uses readable slugs.
export const MODE_SLUG = { study: "flashcards", quiz: "quiz", reference: "list" };
export const SLUG_MODE = { flashcards: "study", quiz: "quiz", list: "reference" };

export const DEFAULT_SELECTION = { moduleKey: "vocabulary", level: "n5" };

export const isModule = (m) => !!MODULES[m];
export const isLevel = (l) => LEVEL_OPTIONS.includes(l);

export const studyPath = (moduleKey, level, tab = "study") =>
	`/study/${moduleKey}/${level}/${MODE_SLUG[tab] || "flashcards"}`;
export const progressPath = (moduleKey, level) => `/progress/${moduleKey}/${level}`;

// Where a (module, level, tab) request lives.
export function pathFor(moduleKey, level, tab) {
	switch (tab) {
		case "home":
			return "/";
		case "mock":
			return "/mock-test";
		case "settings":
			return "/profile";
		case "progress":
			return progressPath(moduleKey, level);
		default:
			return studyPath(moduleKey, level, tab);
	}
}

// The tab name the current URL corresponds to (drives Sidebar/TabBar highlighting).
export function tabFromPath(pathname) {
	if (pathname === "/" || pathname === "") return "home";
	if (pathname.startsWith("/mock-test")) return "mock";
	if (pathname.startsWith("/progress")) return "progress";
	if (pathname.startsWith("/profile") || pathname.startsWith("/settings")) return "settings";
	const m = pathname.match(/^\/study\/[^/]+\/[^/]+\/([^/]+)/);
	if (m) return SLUG_MODE[m[1]] || "study";
	return "study";
}
