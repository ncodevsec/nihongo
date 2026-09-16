import { useEffect, useRef, useState } from "react";

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
	const ref = useRef(null);

	useEffect(() => {
		if (!openKey) return undefined;
		const onClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpenKey(null);
		};
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, [openKey]);

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

						{isOpen && (
							<div className="absolute z-20 mt-1 min-w-[12rem] max-h-80 overflow-y-auto bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-md shadow-lg py-1">
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
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
