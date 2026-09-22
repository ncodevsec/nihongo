import { useCallback, useEffect, useMemo, useState } from "react";
import { shuffle } from "../../lib/utils.js";
import { useHotkeys } from "../../hooks/useHotkeys.js";
import { t, pickLang } from "../../lib/i18n.js";
import {
	flattenGrammarPoints,
	grammarCategories,
	grammarParticleCategories,
	formatGrammarPointId,
	TRANSFORM_CATEGORIES,
	VERB_TRANSFORM_CATEGORIES,
	ADJECTIVE_TRANSFORM_CATEGORIES,
	buildTransformationRows,
} from "../../lib/grammarUtils.js";
import { StarFilterButton, ShuffleButton, ToggleChip, SortControl } from "../FilterControls.jsx";
import { makeGrammarComparator, grammarSortKeys } from "../../lib/sortItems.js";
import GroupCategoryTabs from "../GroupCategoryTabs.jsx";
import { grammarGroupCounts, transformSubGroupCounts } from "../../lib/categoryCounts.js";
import LeveledKanji from "../LeveledKanji.jsx";

// Renders a rule's Bengali explanation with light structure: sub-points
// (১, ২, ৩...) get their own indented line, bracketed notes get an
// italic aside style, everything else is a plain paragraph. No Japanese
// example sentences live in this block anymore — those are rendered
// separately as dedicated example cards.
function ExplanationBody({ text }) {
	const lines = text
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
	return (
		<div className="space-y-1.5">
			{lines.map((line, i) => {
				const isSubPoint = /^[১২৩৪৫৬৭৮৯০]+\)\s/.test(line);
				const isNote = /^[（(](নোট|Note)/i.test(line);
				if (isSubPoint) {
					return (
						<p
							key={i}
							className="font-bengali text-sm text-ink dark:text-night-ink pl-3 border-l-2 border-sakura-line dark:border-night-line"
						>
							{line}
						</p>
					);
				}
				if (isNote) {
					return (
						<p
							key={i}
							className="font-bengali text-xs italic text-ink-muted dark:text-night-ink-muted"
						>
							{line}
						</p>
					);
				}
				return (
					<p
						key={i}
						className="font-bengali text-sm text-ink dark:text-night-ink leading-relaxed"
					>
						{line}
					</p>
				);
			})}
		</div>
	);
}

function StarButton({ starred, onClick, labelOn, labelOff }) {
	return (
		<button
			onClick={onClick}
			aria-label={starred ? labelOn : labelOff}
			title={starred ? labelOn : labelOff}
			className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
				starred
					? "text-shu dark:text-shu-glow"
					: "text-ink-muted/40 dark:text-night-ink-muted/40 dark:hover:text-shu-glow hover:text-shu"
			}`}
		>
			<svg
				viewBox="0 0 24 24"
				className="w-5 h-5"
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
			className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border ${
				read
					? "border-take bg-take text-washi dark:border-take-glow dark:bg-take-glow dark:text-night"
					: "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-take hover:text-take dark:hover:border-take-glow dark:hover:text-take-glow"
			}`}
		>
			<svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
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

export default function GrammarStudy({
	lessons,
	level,
	settings,
	progress = {},
	setLearned = () => {},
	favorites,
	toggleFavorite,
	isActive = true,
	// When true, this renders as the standalone Transform tab: no lesson or
	// particle grouping, just the two Verb / Adjective category groups over
	// the same conjugation-drill rows Grammar's old Transform group used.
	transformOnly = false,
}) {
	const lang = settings.uiLang;
	const T = (k) => t(lang, k);

	const [groupBy, setGroupBy] = useState(transformOnly ? "verb" : "lesson"); // 'lesson' | 'particle' (grammar) or 'verb' | 'adjective' (transformOnly)
	const lessonCategories = useMemo(
		() => grammarCategories(lessons),
		[lessons],
	);
	const particleCategories = useMemo(
		() => grammarParticleCategories(lessons),
		[lessons],
	);
	const transformRows = useMemo(
		() => buildTransformationRows(level),
		[level],
	);
	const [selectedFilters, setSelectedFilters] = useState([]); // [] = all
	const [onlyUnread, setOnlyUnread] = useState(false);
	const [onlyStarred, setOnlyStarred] = useState(false);
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [reverse, setReverse] = useState(false);
	const allPoints = useMemo(
		() => flattenGrammarPoints(lessons, level),
		[lessons, level],
	);
	const groupCounts = useMemo(
		() => grammarGroupCounts(allPoints, transformRows),
		[allPoints, transformRows],
	);
	const transformGroupCounts = useMemo(
		() => transformSubGroupCounts(transformRows),
		[transformRows],
	);

	useEffect(() => {
		setSelectedFilters([]);
		setIndex(0);
		setFlipped(false);
		setOnlyUnread(false);
		setOnlyStarred(false);
	}, [lessons, level]);

	useEffect(() => {
		setSelectedFilters([]);
	}, [groupBy]);

	const isTransform = transformOnly || groupBy === "transform";

	// Sorting shapes the deck in serial mode only (choosing a sort switches to
	// serial). Options follow the active group: lesson / particle for points,
	// transformation category for drill rows.
	const [sortBy, setSortBy] = useState("lesson");
	const [sortDir, setSortDir] = useState("asc");
	const sortKeys = grammarSortKeys(isTransform);
	const effectiveSort = sortKeys.includes(sortBy) ? sortBy : sortKeys[0];
	const sortLabels = {
		lesson: T("sortLesson"),
		particle: T("groupByParticle"),
		transform: transformOnly
			? groupBy === "adjective"
				? T("groupByAdjective")
				: T("groupByVerb")
			: T("groupByTransform"),
	};

	// Snapshot of which ids belong in the current run, built fresh only
	// when the filter controls themselves change — deliberately NOT
	// recomputed just because `progress`/`favorites` change afterward, so
	// marking a card read/starred mid-session doesn't shrink or reorder
	// the run out from under the person.
	const buildSourceIds = useCallback(
		(useShuffled) => {
			let list;
			if (transformOnly) {
				const pool = transformRows.filter((r) =>
					groupBy === "adjective"
						? r.category.startsWith("i-adj-") || r.category.startsWith("na-adj-")
						: r.category.startsWith("verb-"),
				);
				list =
					selectedFilters.length === 0
						? pool
						: pool.filter((r) => selectedFilters.includes(r.category));
			} else if (isTransform) {
				list =
					selectedFilters.length === 0
						? transformRows
						: transformRows.filter((r) => selectedFilters.includes(r.category));
			} else if (groupBy === "particle") {
				list =
					selectedFilters.length === 0
						? allPoints
						: allPoints.filter((p) => selectedFilters.includes(p.particle || "other"));
			} else {
				list =
					selectedFilters.length === 0
						? allPoints
						: allPoints.filter((p) => selectedFilters.includes(p.category));
			}
			if (onlyUnread) list = list.filter((p) => !progress[p.id]?.learned);
			if (onlyStarred) list = list.filter((p) => favorites[p.id]);
			if (!useShuffled && !(effectiveSort === sortKeys[0] && sortDir === "asc")) {
				list = [...list].sort(
					makeGrammarComparator({
						sortBy: effectiveSort,
						sortDir,
						lessonCategories,
						particleCategories,
						transformCategories: TRANSFORM_CATEGORIES,
					}),
				);
			}
			const ids = list.map((p) => p.id);
			return useShuffled ? shuffle(ids) : ids;
		},
		[isTransform, transformOnly, groupBy, selectedFilters, allPoints, transformRows, onlyUnread, onlyStarred, progress, favorites, effectiveSort, sortDir, lessonCategories, particleCategories],
	);

	const [shuffled, setShuffled] = useState(true);
	const [order, setOrder] = useState(() => buildSourceIds(true));

	useEffect(() => {
		setOrder(buildSourceIds(shuffled));
		setIndex(0);
		setFlipped(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lessons, groupBy, selectedFilters, onlyUnread, onlyStarred]);

	useEffect(() => {
		setOrder(buildSourceIds(shuffled));
		setIndex(0);
		setFlipped(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shuffled, effectiveSort, sortDir]);

	const deck = useMemo(() => {
		const byId = new Map([
			...allPoints.map((p) => [p.id, p]),
			...transformRows.map((r) => [r.id, r]),
		]);
		return order.map((id) => byId.get(id)).filter(Boolean);
	}, [order, allPoints, transformRows]);

	// Jumping back to the first card whenever the visible set changes keeps
	// this in sync with Study.jsx's own flashcard behavior for vocab/kanji.
	useEffect(() => {
		setIndex(0);
		setFlipped(false);
	}, [
		selectedFilters,
		onlyUnread,
		onlyStarred,
		groupBy,
	]);

	useEffect(() => {
		if (index >= deck.length) setIndex(0);
	}, [deck.length, index]);

	if (!transformOnly && (!lessons || lessons.length === 0)) {
		return (
			<div className="max-w-2xl mx-auto text-center py-16 font-bengali text-ink-muted dark:text-night-ink-muted">
				{T("grammarComingSoon")}
			</div>
		);
	}

	const goNext = useCallback(() => {
		setFlipped(false);
		setIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
	}, [deck.length]);
	const goPrev = useCallback(() => {
		setFlipped(false);
		setIndex((i) => (i - 1 >= 0 ? i - 1 : deck.length - 1));
	}, [deck.length]);

	const point = deck[index];

	const mark = useCallback(
		(read) => {
			if (!point) return;
			setLearned(point.id, read);
			goNext();
		},
		[point, setLearned, goNext],
	);

	useHotkeys(
		useCallback(
			(e) => {
				if (!isActive) return;
				if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT")
					return;
				if (e.key === " ") {
					e.preventDefault();
					setFlipped((f) => !f);
				} else if (e.key === "ArrowRight") goNext();
				else if (e.key === "ArrowLeft") goPrev();
				else if (e.key.toLowerCase() === "l") mark(true);
				else if (e.key.toLowerCase() === "r") mark(false);
			},
			[isActive, goNext, goPrev, mark],
		),
	);

	const filterRow = (
		<>
			<div className="flex flex-wrap items-center gap-2 mb-5">
				<GroupCategoryTabs
					groups={
						transformOnly
							? [
									{ key: "verb", label: T("groupByVerb"), categories: VERB_TRANSFORM_CATEGORIES, ...transformGroupCounts.verb },
									{ key: "adjective", label: T("groupByAdjective"), categories: ADJECTIVE_TRANSFORM_CATEGORIES, ...transformGroupCounts.adjective },
								]
							: [
									{ key: "lesson", label: T("groupByLesson"), categories: lessonCategories, ...groupCounts.lesson },
									{ key: "particle", label: T("groupByParticle"), categories: particleCategories, ...groupCounts.particle },
								]
					}
					active={groupBy}
					onActiveChange={setGroupBy}
					selected={selectedFilters}
					onSelectedChange={setSelectedFilters}
					lang={lang}
					allLabel={T("allCategories")}
				/>
				<ToggleChip
					active={onlyUnread}
					onClick={() => setOnlyUnread((v) => !v)}
					title={T("onlyUnread")}
				>
					{T("onlyUnread")}
				</ToggleChip>
				<StarFilterButton
					active={onlyStarred}
					onClick={() => setOnlyStarred((v) => !v)}
					labelOn={T("onlyStarred")}
					labelOff={T("onlyStarred")}
				/>
				{isTransform && (
					<button
						onClick={() => {
							setReverse((v) => !v);
							setFlipped(false);
						}}
						aria-pressed={reverse}
						title={T("reverseRecall")}
						className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 border font-bengali font-medium text-xs ${
							reverse
								? "bg-shu text-washi border-shu"
								: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted border-ai-line dark:border-night-line hover:border-shu/50"
						}`}
					>
						<svg
							viewBox="0 0 24 24"
							className="w-3.5 h-3.5 shrink-0"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<polyline points="17 1 21 5 17 9" />
							<path d="M3 11V9a4 4 0 014-4h14" />
							<polyline points="7 23 3 19 7 15" />
							<path d="M21 13v2a4 4 0 01-4 4H3" />
						</svg>
						{T("reverseRecall")}
					</button>
				)}
				<div className="ml-auto flex flex-wrap items-center gap-2">
					<SortControl
						label={T("sortBy")}
						value={effectiveSort}
						options={sortKeys.map((k) => ({ key: k, label: sortLabels[k] }))}
						onChange={(v) => {
							setSortBy(v);
							setShuffled(false);
						}}
						dir={sortDir}
						onToggleDir={() => {
							setSortDir((d) => (d === "asc" ? "desc" : "asc"));
							setShuffled(false);
						}}
						labelAsc={T("sortAsc")}
						labelDesc={T("sortDesc")}
					/>
					<ShuffleButton shuffled={shuffled} onToggle={() => setShuffled((v) => !v)} label={T("shuffle")} serialLabel={T("serial")} />
				</div>
			</div>
		</>
	);

	if (!point) {
		return (
			<div className="max-w-2xl lg:max-w-3xl mx-auto">
				{filterRow}
				<div className="text-center py-12 font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
					{T("noResults")}
				</div>
			</div>
		);
	}

	const starred = !!favorites[point.id];
	const read = !!progress[point.id]?.learned;

	// Largest size (up to maxRem) at which `text` still fits on ONE line inside
	// the card: CJK glyphs are about 1em wide, so cap the font size at
	// (card width) / (character count).
	const fitStyle = (text, maxRem) => ({
		fontSize: `min(${maxRem}rem, calc((min(100vw, 42rem) - 5.5rem) / ${Math.max(String(text).length, 1)}))`,
	});

	// The form tag pill (Negative form, Past form …) — top of the question
	// face, last line of the answer face.
	const formTag = point ? (
		<span className="font-bengali text-[11px] bg-ai-soft dark:bg-night-line text-ai dark:text-ai-glow rounded-full px-2.5 py-0.5">
			{pickLang(point.formLabel, lang)}
		</span>
	) : null;

	if (isTransform) {
		return (
			<div className="max-w-2xl lg:max-w-3xl mx-auto">
				{filterRow}

				<div className="flex items-center justify-between text-[11px] font-mono text-ink-muted dark:text-night-ink-muted mb-1.5">
					<span>
						{index + 1} / {deck.length}
					</span>
					{read && (
						<span className="text-take dark:text-take-glow font-semibold font-bengali">
							✓ {T("alreadyRead")}
						</span>
					)}
				</div>
				<div className="w-full h-1 bg-ai-soft dark:bg-night-line rounded-full mb-4 overflow-hidden">
					<div
						className="h-full bg-shu transition-all"
						style={{
							width: `${((index + 1) / deck.length) * 100}%`,
						}}
					/>
				</div>

				<div className="relative">
					<button
						onClick={() => toggleFavorite(point.id)}
						aria-label={starred ? T("markAsUnstarred") : T("markAsStarred")}
						title={starred ? T("markAsUnstarred") : T("markAsStarred")}
						className={`absolute top-2.5 right-2.5 z-10 w-11 h-11 flex items-center justify-center rounded-full ${
							starred
								? "text-shu dark:text-shu-glow bg-shu-soft dark:bg-shu/10"
								: "text-ink-muted/50 dark:text-night-ink-muted/50 hover:text-shu dark:hover:text-shu-glow hover:bg-shu-soft dark:hover:bg-shu/10"
						}`}
					>
						<svg
							viewBox="0 0 24 24"
							className="w-5 h-5"
							fill={starred ? "currentColor" : "none"}
							stroke="currentColor"
							strokeWidth="1.6"
						>
							<path
								d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3.5z"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					<button
						onClick={() => setFlipped((f) => !f)}
						className="w-full bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none active:shadow-md active:border-ai/30 dark:active:border-ai-glow/40 sm:hover:shadow-md sm:hover:border-ai/30 dark:sm:hover:border-ai-glow/40 text-left"
					>
						<div className="h-[260px] overflow-y-auto flex flex-col items-center justify-center gap-2.5 py-8 px-4">
							{!flipped ? (
								<>
									{formTag}
									{reverse ? (
										<>
											<div
												style={fitStyle(point.transformedForm, 3)}
												className="font-mincho text-ink dark:text-night-ink text-center whitespace-nowrap"
											>
												{point.transformedForm}
											</div>
											<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-2">
												{T("tapToRevealForm")}
											</span>
										</>
									) : (
										<>
											<div
												style={fitStyle(point.mainForm, 3)}
												className="font-mincho text-ink dark:text-night-ink text-center whitespace-nowrap"
											>
												{point.mainForm}
											</div>
											<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-2">
												{T("tapToRevealForm")}
											</span>
										</>
									)}
								</>
							) : (
								<>
									{/* 1 — the word this card started from, small, with its meaning */}
									<div className="flex flex-wrap items-baseline justify-center gap-x-2 text-center">
										<span lang="ja" className="font-mincho text-base text-ink-muted dark:text-night-ink-muted">
											{point.mainForm}
										</span>
										{point.meaningBn && (
											<span className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted">
												— {point.meaningBn}
											</span>
										)}
									</div>
									{/* 2 — the transformed word: the focus of the card, always one line */}
									<div
										lang="ja"
										style={fitStyle(point.transformedForm, 2.5)}
										className="font-mincho font-semibold text-ink dark:text-night-ink text-center whitespace-nowrap"
									>
										{point.transformedForm}
									</div>
									{/* 3 — other accepted forms, small (only when there are any) */}
									{point.alternates?.length > 0 && (
										<div lang="ja" className="flex flex-wrap items-baseline justify-center gap-x-3 font-mincho text-[13px] text-ink-muted dark:text-night-ink-muted text-center">
											{point.alternates.map((alt, i) => (
												<span key={alt} className="whitespace-nowrap">
													{i > 0 && <span className="mr-3 opacity-60">／</span>}
													{alt}
												</span>
											))}
										</div>
									)}
									{/* 4 — the form tag */}
									<div className="mt-1">{formTag}</div>
								</>
							)}
						</div>
					</button>
				</div>

				<div className="grid grid-cols-2 gap-2.5 mt-4">
					<button
						onClick={() => mark(false)}
						className="flex items-center justify-center font-bengali text-sm font-semibold bg-danger dark:bg-danger-glow text-washi dark:text-white rounded-lg py-3 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
					>
						{T("reviewAgain")}
					</button>
					<button
						onClick={() => mark(true)}
						className="flex items-center justify-center font-bengali text-sm font-semibold bg-take dark:bg-take-glow text-washi dark:text-night rounded-lg py-3 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
					>
						{T("markLearned")}
					</button>
				</div>

				<div className="flex gap-6 items-center justify-center mt-6">
					<button
						onClick={goPrev}
						aria-label={T("prevCard")}
						title={T("prevCard")}
						className="w-14 h-14 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-shu hover:text-shu hover:bg-shu-soft dark:hover:border-shu-glow dark:hover:text-shu-glow dark:hover:bg-night-line active:scale-[0.96] transition-all shadow-sm"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.25"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-6 h-6"
							aria-hidden="true"
						>
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>
					<button
						onClick={goNext}
						aria-label={T("nextCard")}
						title={T("nextCard")}
						className="w-14 h-14 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-shu hover:text-shu hover:bg-shu-soft dark:hover:border-shu-glow dark:hover:text-shu-glow dark:hover:bg-night-line active:scale-[0.96] transition-all shadow-sm"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.25"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-6 h-6"
							aria-hidden="true"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl lg:max-w-3xl mx-auto">
			{filterRow}

			<div className="flex items-center justify-between text-[11px] font-mono text-ink-muted dark:text-night-ink-muted mb-1.5">
				<span>
					{index + 1} / {deck.length}
				</span>
				{read && (
					<span className="text-take dark:text-take-glow font-semibold font-bengali">
						✓ {T("alreadyRead")}
					</span>
				)}
			</div>
			<div className="w-full h-1 bg-ai-soft dark:bg-night-line rounded-full mb-4 overflow-hidden">
				<div
					className="h-full bg-shu transition-all"
					style={{
						width: `${((index + 1) / deck.length) * 100}%`,
					}}
				/>
			</div>

			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden shadow-card dark:shadow-none">
				{/* Rule heading — always visible, on both sides of the card */}
				<div className="flex items-start justify-between gap-2 px-4 sm:px-5 pt-4">
					<div className="flex items-start gap-2.5 min-w-0">
						<span className="shrink-0 mt-0.5 font-mono text-[11px] font-bold text-washi bg-shu rounded-full px-2.5 py-1">
							{formatGrammarPointId(point.pointId)}
						</span>
						<h3 className="font-bengali text-base font-bold text-ink dark:text-night-ink leading-snug">
							{point.headingBn}
						</h3>
					</div>
					<div className="flex items-center gap-1.5 shrink-0">
						<ReadButton
							read={read}
							onClick={() => setLearned(point.id, !read)}
							labelOn={T("markAsUnread")}
							labelOff={T("markAsRead")}
						/>
						<StarButton
							starred={starred}
							onClick={() => toggleFavorite(point.id)}
							labelOn={T("markAsUnstarred")}
							labelOff={T("markAsStarred")}
						/>
					</div>
				</div>

				<button
					onClick={() => setFlipped((f) => !f)}
					className="w-full text-left"
				>
					{!flipped ? (
						<>
							{/* Front: the rule itself — structure and explanation */}
							<div className="px-4 sm:px-5 pt-3 pb-4 h-[260px] overflow-y-auto">
								<ExplanationBody text={point.explanationBn} />
							</div>
							<div className="border-t border-ai-line dark:border-night-line px-4 sm:px-5 py-3 text-center">
								<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
									{T("tapToRevealExamples")}
								</span>
							</div>
						</>
					) : (
						/* Back: only the sentence examples */
						<div className="px-4 sm:px-5 py-4 h-[260px] overflow-y-auto">
							{point.examples.length > 0 ? (
								<>
									<div className="font-bengali text-[10px] font-bold uppercase tracking-wide text-ink-muted dark:text-night-ink-muted mb-2.5">
										{T("grammarExamples")}
									</div>
									<div className="space-y-3">
										{point.examples.map((ex, ei) => (
											<div
												key={ei}
												className={
													ei > 0
														? "pt-3 border-t border-ai-line dark:border-night-line"
														: ""
												}
											>
												{ex.note && (
													<div className="font-bengali text-[11px] italic text-ink-muted dark:text-night-ink-muted mb-1">
														({ex.note})
													</div>
												)}
												<div className="font-mincho text-lg text-ink dark:text-night-ink leading-snug">
													<LeveledKanji text={ex.jp} level={level} />
												</div>
												{ex.meaningBn && (
													<div className="font-bengali text-sm text-ink-muted dark:text-night-ink-muted mt-1">
														{ex.meaningBn}
													</div>
												)}
											</div>
										))}
									</div>
								</>
							) : (
								<div className="text-center py-6">
									<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">
										{T("noResults")}
									</span>
								</div>
							)}
						</div>
					)}
				</button>
			</div>

			<div className="flex gap-6 items-center justify-center mt-6">
				<button
					onClick={goPrev}
					aria-label={T("prevCard")}
					title={T("prevCard")}
					className="w-14 h-14 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-shu hover:text-shu hover:bg-shu-soft dark:hover:border-shu-glow dark:hover:text-shu-glow dark:hover:bg-night-line active:scale-[0.96] transition-all shadow-sm"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.25"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-6 h-6"
						aria-hidden="true"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>
				<button
					onClick={goNext}
					aria-label={T("nextCard")}
					title={T("nextCard")}
					className="w-14 h-14 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-shu hover:text-shu hover:bg-shu-soft dark:hover:border-shu-glow dark:hover:text-shu-glow dark:hover:bg-night-line active:scale-[0.96] transition-all shadow-sm"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.25"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-6 h-6"
						aria-hidden="true"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			</div>
		</div>
	);
}
