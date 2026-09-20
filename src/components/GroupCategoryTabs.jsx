import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Each group: { key, label, categories: [{ key, bn, en }] }. `active` is
// the current group's key. `selected` is the array of selected category
// keys within the active group (empty = all) — switching the active
// group always resets this to [], matching how the separate toggle-row +
// dropdown pattern this replaces used to behave.
export default function GroupCategoryTabs({
	groups,
	active,
	onActiveChange,
	selected,
	onSelectedChange,
	lang,
	allLabel,
}) {
	const [openKey, setOpenKey] = useState(null);
	const [pos, setPos] = useState(null); // { left, top, maxHeight } of the open menu
	const ref = useRef(null);
	const triggerRefs = useRef({});
	const panelRef = useRef(null);

	// The menu is rendered in a portal with fixed positioning and clamped to
	// the visible screen: it can never spill past the right/left edge (the
	// last tab of a row used to push it off-screen) or be clipped by a parent,
	// and it flips above the button when there is more room there.
	const reposition = useCallback(() => {
		const btn = triggerRefs.current[openKey];
		const panel = panelRef.current;
		if (!btn || !panel) return;
		const r = btn.getBoundingClientRect();
		const margin = 8;
		const vw = document.documentElement.clientWidth;
		const vh = window.innerHeight;
		const width = Math.min(panel.offsetWidth, vw - margin * 2);
		const left = Math.min(Math.max(r.left, margin), vw - width - margin);
		const below = vh - r.bottom - margin - 4;
		const above = r.top - margin - 4;
		const openUp = below < 200 && above > below;
		const maxHeight = Math.max(120, Math.min(320, openUp ? above : below));
		const height = Math.min(panel.scrollHeight, maxHeight);
		const top = openUp ? Math.max(margin, r.top - 4 - height) : r.bottom + 4;
		setPos({ left, top, maxHeight });
	}, [openKey]);

	useLayoutEffect(() => {
		if (openKey) reposition();
		else setPos(null);
	}, [openKey, reposition, selected, active]);

	useEffect(() => {
		if (!openKey) return undefined;
		const onClickOutside = (e) => {
			const inside =
				(ref.current && ref.current.contains(e.target)) ||
				(panelRef.current && panelRef.current.contains(e.target));
			if (!inside) setOpenKey(null);
		};
		const onKey = (e) => {
			if (e.key === "Escape") setOpenKey(null);
		};
		document.addEventListener("mousedown", onClickOutside);
		document.addEventListener("keydown", onKey);
		window.addEventListener("resize", reposition);
		window.addEventListener("scroll", reposition, true);
		return () => {
			document.removeEventListener("mousedown", onClickOutside);
			document.removeEventListener("keydown", onKey);
			window.removeEventListener("resize", reposition);
			window.removeEventListener("scroll", reposition, true);
		};
	}, [openKey, reposition]);

	const label = (c) => (lang === "bn" ? c.bn : c.en) || c.en || c.bn;

	const handleTabClick = (group) => {
		if (group.key !== active) {
			onActiveChange(group.key);
			setOpenKey(group.key);
		} else {
			setOpenKey((k) => (k === group.key ? null : group.key));
		}
	};

	const toggleCategory = (key) => {
		if (selected.includes(key)) onSelectedChange(selected.filter((k) => k !== key));
		else onSelectedChange([...selected, key]);
	};

	const activeGroup = groups.find((g) => g.key === active);

	return (
		<div ref={ref} className="flex flex-wrap gap-2">
			{groups.map((group) => {
				const isActive = group.key === active;
				const isOpen = openKey === group.key;
				const isAll = isActive && selected.length === 0;
				const buttonText = !isActive
					? group.label
					: isAll
						? group.label
						: selected.length === 1
							? label(
									group.categories.find((c) => c.key === selected[0]) || {
										en: selected[0],
										bn: selected[0],
									},
								)
							: `${group.label} (${selected.length})`;

				return (
					<div key={group.key} className="relative">
						<button
							type="button"
							ref={(el) => {
								triggerRefs.current[group.key] = el;
							}}
							aria-haspopup="true"
							aria-expanded={isOpen}
							onClick={() => handleTabClick(group)}
							aria-pressed={isActive}
							className={`font-bengali flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm border ${
								isActive
									? "bg-shu text-washi border-shu"
									: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted border-ai-line dark:border-night-line hover:border-shu/50"
							}`}
						>
							<span className="truncate max-w-[10rem]">{buttonText}</span>
							<svg
								viewBox="0 0 24 24"
								className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>

						{isOpen &&
							createPortal(
							<div
								ref={panelRef}
								style={{
									left: pos?.left ?? 0,
									top: pos?.top ?? 0,
									maxHeight: pos?.maxHeight ?? 320,
									visibility: pos ? "visible" : "hidden",
								}}
								className="fixed z-50 min-w-[12rem] max-w-[calc(100vw-1rem)] overflow-y-auto bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-md shadow-lg py-1"
							>
								<button
									type="button"
									onClick={() => onSelectedChange([])}
									className={`w-full text-left px-3 py-1.5 text-sm font-bengali hover:bg-ai-soft dark:hover:bg-night-line ${
										isAll
											? "text-shu dark:text-shu-glow font-semibold"
											: "text-ink dark:text-night-ink"
									}`}
								>
									{allLabel}
								</button>
								<div className="border-t border-ai-line dark:border-night-line my-1" />
								{(isActive ? activeGroup : group).categories.map((c) => {
									const checked = isActive && selected.includes(c.key);
									return (
										<label
											key={c.key}
											className="flex items-center gap-2 px-3 py-1.5 text-sm font-bengali text-ink dark:text-night-ink hover:bg-ai-soft dark:hover:bg-night-line cursor-pointer"
										>
											<input
												type="checkbox"
												checked={checked}
												onChange={() => toggleCategory(c.key)}
												className="shrink-0"
											/>
											<span className="truncate">{label(c)}</span>
										</label>
									);
								})}
							</div>,
							document.body,
						)}
					</div>
				);
			})}
		</div>
	);
}
