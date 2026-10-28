import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { NAV_ICONS, useNavItems } from "./navItems.jsx";

// Mobile-first bottom dock: Home · Study · Mock Test · Progress · Profile.
// Hidden from lg up, where the Sidebar takes over.
export default function BottomNav() {
	const { updateAvailable } = useApp();
	const items = useNavItems();
	return (
		<nav
			aria-label="Primary"
			className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-ai-line dark:border-night-line bg-paper/95 dark:bg-night-paper/95 backdrop-blur shadow-[0_-4px_16px_rgba(20,15,15,0.06)] dark:shadow-none pb-[env(safe-area-inset-bottom)]"
		>
			<ul className="grid grid-cols-5 max-w-xl mx-auto">
				{items.map((it) => {
					const active = it.active;
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
										{NAV_ICONS[it.key]}
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
