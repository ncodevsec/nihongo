import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { t } from "../lib/i18n.js";
import { NAV_ICONS, useNavItems } from "./navItems.jsx";

// Desktop sidebar (lg+): the same five destinations as the mobile bottom dock.
export default function Sidebar() {
	const { settings, updateAvailable } = useApp();
	const items = useNavItems();
	return (
		<aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto border-r border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none">
			<NavLink to="/" className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-ai-line dark:border-night-line mb-4">
				<img src="/icons/icon-192.png" alt="NihonGo - Study Lab" className="brand-logo w-9 h-9 shrink-0" width={36} height={36} />
				<div className="min-w-0">
					<h1 className="font-mincho text-md font-bold text-ink dark:text-night-ink truncate">NihonGo - Study Lab</h1>
					<p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted truncate">{t(settings.uiLang, "appSubtitle")}</p>
				</div>
			</NavLink>
			<nav aria-label="Primary" className="flex flex-col gap-1.5 px-3">
				{items.map((it) => (
					<NavLink
						key={it.key}
						to={it.to}
						aria-current={it.active ? "page" : undefined}
						className={`relative flex items-center gap-3 rounded-full px-4 py-2.5 font-bengali text-sm font-semibold transition-colors ${
							it.active
								? "bg-shu text-washi shadow-sm"
								: "text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line hover:text-shu dark:hover:text-shu-glow"
						}`}
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0" aria-hidden="true">
							{NAV_ICONS[it.key]}
						</svg>
						{it.label}
						{it.key === "profile" && updateAvailable && (
							<span className={`absolute right-4 w-2 h-2 rounded-full ${it.active ? "bg-washi" : "bg-shu dark:bg-shu-glow"}`} aria-hidden="true" />
						)}
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
