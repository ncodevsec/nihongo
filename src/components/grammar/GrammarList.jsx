import { useEffect, useMemo, useState } from "react";
import { t, pickLang } from "../../lib/i18n.js";
import {
	flattenGrammarPoints,
	grammarCategories,
	grammarParticleCategories,
	formatGrammarPointId,
	TRANSFORM_CATEGORIES,
	buildTransformationRows,
} from "../../lib/grammarUtils.js";
import {
	VERB_TRANSFORMATIONS,
	ADJECTIVE_TRANSFORMATIONS,
} from "../../data/grammar/transformations.js";
import { StarFilterButton } from "../FilterControls.jsx";
import CategoryMultiSelect from "../CategoryMultiSelect.jsx";

const PAGE_SIZE = 40;

function StarButton({ starred, onClick, labelOn, labelOff }) {
	return (
		<button
			onClick={onClick}
			aria-label={starred ? labelOn : labelOff}
			title={starred ? labelOn : labelOff}
			className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full ${
				starred
					? "text-shu dark:text-shu-glow"
					: "text-ink-muted/40 dark:text-night-ink-muted/40 dark:hover:text-shu-glow hover:text-shu"
			}`}
		>
			<svg
				viewBox="0 0 24 24"
				className="w-4 h-4"
				fill={starred ? "currentColor" : "none"}
				stroke="currentColor"
				strokeWidth="1.6"
				aria-hidden="true"
			>
				<path
					d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3.5z"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}

// Same read/unread check control Reference.jsx uses for vocab and kanji —
// a filled checkmark once a rule has been marked as read.
function ReadButton({ read, onClick, labelOn, labelOff }) {
	return (
		<button
			onClick={onClick}
			aria-label={read ? labelOn : labelOff}
			title={read ? labelOn : labelOff}
			className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full border ${
				read
					? "border-take bg-take text-washi dark:border-take-glow dark:bg-take-glow dark:text-night"
					: "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-take hover:text-take dark:hover:border-take-glow dark:hover:text-take-glow"
			}`}
		>
			<svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
				<path
					d="M4 10.5l4 4 8-9"
					stroke="currentColor"
					strokeWidth="2.2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}

export default function GrammarList({
	lessons,
	level,
	settings,
	progress = {},
	setLearned = () => {},
	favorites,
	toggleFavorite,
}) {
	const lang = settings.uiLang;
	const T = (k) => t(lang, k);

	const allPoints = useMemo(
		() => flattenGrammarPoints(lessons, level),
		[lessons, level],
	);
	const categories = useMemo(() => grammarCategories(lessons), [lessons]);
	const particleCategories = useMemo(
		() => grammarParticleCategories(lessons),
		[lessons],
	);
	const transformRows = useMemo(
		() =>
			buildTransformationRows(
				VERB_TRANSFORMATIONS,
				ADJECTIVE_TRANSFORMATIONS,
			),
		[],
	);

	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [groupBy, setGroupBy] = useState("lesson"); // 'lesson' | 'particle' | 'transform'
	const [selectedFilters, setSelectedFilters] = useState([]); // [] = all
	const [onlyStarred, setOnlyStarred] = useState(false);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [expanded, setExpanded] = useState(null);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedQuery(query), 150);
		return () => clearTimeout(timer);
	}, [query]);

	useEffect(() => {
		setSelectedFilters([]);
	}, [groupBy]);

	const isTransform = groupBy === "transform";

	const filtered = useMemo(() => {
		const q = debouncedQuery.trim().toLowerCase();
		if (isTransform) {
			return transformRows.filter((r) => {
				if (
					selectedFilters.length > 0 &&
					!selectedFilters.includes(r.category)
				)
					return false;
				if (onlyStarred && !favorites[r.id]) return false;
				if (!q) return true;
				const haystack = (
					r.mainForm +
					" " +
					r.transformedForm +
					" " +
					r.meaningBn
				).toLowerCase();
				return haystack.includes(q);
			});
		}
		return allPoints.filter((p) => {
			if (selectedFilters.length > 0) {
				const key =
					groupBy === "particle" ? p.particle || "other" : p.category;
				if (!selectedFilters.includes(key)) return false;
			}
			if (onlyStarred && !favorites[p.id]) return false;
			if (!q) return true;
			const haystack =
				p.headingBn.toLowerCase() +
				" " +
				p.explanationBn.toLowerCase() +
				" " +
				p.examples
					.map((e) => e.jp + " " + (e.meaningBn || ""))
					.join(" ")
					.toLowerCase();
			return haystack.includes(q);
		});
	}, [
		allPoints,
		transformRows,
		isTransform,
		debouncedQuery,
		selectedFilters,
		groupBy,
		onlyStarred,
		favorites,
	]);

	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, [debouncedQuery, selectedFilters, onlyStarred]);

	const visible = filtered.slice(0, visibleCount);

	if (allPoints.length === 0 && !isTransform) {
		return (
			<div className="max-w-2xl mx-auto text-center py-16 font-bengali text-ink-muted dark:text-night-ink-muted">
				{T("grammarComingSoon")}
			</div>
		);
	}

	return (
		<div className="max-w-2xl lg:max-w-3xl mx-auto">
			<div className="flex flex-col sm:flex-row gap-2 mb-3">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={T("searchPlaceholder")}
					className="font-bengali flex-1 border border-ai-line dark:border-night-line rounded-md px-3 py-1.5 text-sm bg-paper dark:bg-night-paper text-ink dark:text-night-ink placeholder:text-ink-muted/60"
				/>
				<div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden shrink-0">
					<button
						onClick={() => setGroupBy("lesson")}
						className={`px-2.5 py-1.5 text-sm font-bengali font-medium ${
							groupBy === "lesson"
								? "bg-shu text-washi"
								: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
						}`}
					>
						{T("groupByLesson")}
					</button>
					<button
						onClick={() => setGroupBy("particle")}
						className={`px-2.5 py-1.5 text-sm font-bengali font-medium ${
							groupBy === "particle"
								? "bg-shu text-washi"
								: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
						}`}
					>
						{T("groupByParticle")}
					</button>
					<button
						onClick={() => setGroupBy("transform")}
						className={`px-2.5 py-1.5 text-sm font-bengali font-medium ${
							groupBy === "transform"
								? "bg-shu text-washi"
								: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
						}`}
					>
						{T("groupByTransform")}
					</button>
				</div>
				<div className="sm:w-44 shrink-0">
					<CategoryMultiSelect
						categories={
							isTransform
								? TRANSFORM_CATEGORIES
								: groupBy === "particle"
									? particleCategories
									: categories
						}
						selected={selectedFilters}
						onChange={setSelectedFilters}
						lang={lang}
						allLabel={`${T("allCategories")} (${isTransform ? transformRows.length : allPoints.length})`}
					/>
				</div>
				<StarFilterButton
					active={onlyStarred}
					onClick={() => setOnlyStarred((v) => !v)}
					labelOn={T("onlyStarred")}
					labelOff={T("onlyStarred")}
				/>
			</div>

			<div className="text-[11px] font-mono text-ink-muted dark:text-night-ink-muted mb-2">
				{filtered.length} {T("showingCountOf")} {visible.length}{" "}
				{T("showingCountShown")}
			</div>

			{isTransform ? (
				<div className="border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none overflow-hidden bg-paper dark:bg-night-paper">
					<div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 px-3 py-2 bg-washi dark:bg-night border-b border-ai-line dark:border-night-line font-bengali text-[11px] font-semibold text-ink-muted dark:text-night-ink-muted">
						<span>{T("colMainForm")}</span>
						<span>{T("colTransformedForm")}</span>
						<span className="w-7" />
						<span className="w-7" />
					</div>
					<div className="divide-y divide-ai-line dark:divide-night-line">
						{visible.map((r) => {
							const starred = !!favorites[r.id];
							const read = !!progress[r.id]?.learned;
							return (
								<div
									key={r.id}
									className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center px-3 py-2.5 hover:bg-washi dark:hover:bg-night"
								>
									<span className="font-mincho text-base text-ink dark:text-night-ink truncate">
										{r.mainForm}
									</span>
									<span className="min-w-0">
										<span className="font-mincho text-base text-shu dark:text-shu-glow truncate block">
											{r.transformedForm}
										</span>
										<span className="font-bengali text-[10px] text-ink-muted dark:text-night-ink-muted">
											{pickLang(r.formLabel, lang)}
										</span>
									</span>
									<ReadButton
										read={read}
										onClick={() => setLearned(r.id, !read)}
										labelOn={T("markAsUnread")}
										labelOff={T("markAsRead")}
									/>
									<StarButton
										starred={starred}
										onClick={() => toggleFavorite(r.id)}
										labelOn={T("markAsUnstarred")}
										labelOff={T("markAsStarred")}
									/>
								</div>
							);
						})}
						{filtered.length === 0 && (
							<div className="px-3 py-8 text-center font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
								{T("noResults")}
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none overflow-hidden bg-paper dark:bg-night-paper divide-y divide-ai-line dark:divide-night-line">
					{visible.map((p) => {
						const isOpen = expanded === p.id;
						const starred = !!favorites[p.id];
						const read = !!progress[p.id]?.learned;
						return (
							<div key={p.id}>
								<div className="flex items-center gap-2 px-3 py-2.5 hover:bg-washi dark:hover:bg-night">
									<button
										onClick={() =>
											setExpanded(isOpen ? null : p.id)
										}
										className="flex-1 min-w-0 flex items-center gap-2.5 text-left"
									>
										<span className="shrink-0 font-mono text-[10px] text-ai dark:text-ai-glow bg-ai-soft dark:bg-night-line rounded-full px-2 py-0.5">
											{formatGrammarPointId(p.pointId)}
										</span>
										<span className="font-bengali text-sm text-ink dark:text-night-ink truncate">
											{p.headingBn}
										</span>
									</button>
									<ReadButton
										read={read}
										onClick={() => setLearned(p.id, !read)}
										labelOn={T("markAsUnread")}
										labelOff={T("markAsRead")}
									/>
									<StarButton
										starred={starred}
										onClick={() => toggleFavorite(p.id)}
										labelOn={T("markAsUnstarred")}
										labelOff={T("markAsStarred")}
									/>
								</div>
								{isOpen && (
									<div className="px-4 pb-4 pt-1 bg-washi dark:bg-night border-t border-ai-line dark:border-night-line">
										<p className="font-bengali text-sm text-ink dark:text-night-ink leading-relaxed whitespace-pre-line mb-3">
											{p.explanationBn}
										</p>
										{p.examples.length > 0 && (
											<div className="bg-sakura-soft dark:bg-night-paper rounded-md p-3 space-y-2.5">
												{p.examples.map((ex, ei) => (
													<div key={ei}>
														<div className="font-mincho text-base text-ink dark:text-night-ink">
															{ex.jp}
														</div>
														{ex.meaningBn && (
															<div className="font-bengali text-xs text-sakura-deep dark:text-sakura mt-0.5">
																{ex.meaningBn}
															</div>
														)}
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						);
					})}
					{filtered.length === 0 && (
						<div className="px-3 py-8 text-center font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
							{T("noResults")}
						</div>
					)}
				</div>
			)}

			{visibleCount < filtered.length && (
				<div className="p-3 text-center">
					<button
						onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
						className="font-bengali text-xs border border-ai-line dark:border-night-line rounded-md px-4 py-1.5 text-ai dark:text-ai-glow hover:bg-ai-soft dark:hover:bg-night-line"
					>
						{T("loadMore")} ({filtered.length - visibleCount}{" "}
						{T("itemsLeft")})
					</button>
				</div>
			)}
		</div>
	);
}
