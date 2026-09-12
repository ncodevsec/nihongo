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
	buildTransformationRows,
} from "../../lib/grammarUtils.js";
import { StarFilterButton, ShuffleButton, ToggleChip } from "../FilterControls.jsx";
import CategoryMultiSelect from "../CategoryMultiSelect.jsx";
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
}) {
	const lang = settings.uiLang;
	const T = (k) => t(lang, k);

	const [groupBy, setGroupBy] = useState("lesson"); // 'lesson' | 'particle' | 'transform'
	const lessonCategories = useMemo(
		() => grammarCategories(lessons),
		[lessons],
	);
	const particleCategories = useMemo(
		() => grammarParticleCategories(lessons),
		[lessons],
	);
	const transformRows = useMemo(() => buildTransformationRows(), []);
	const [selectedLessons, setSelectedLessons] = useState([]); // [] = all
	const [selectedParticles, setSelectedParticles] = useState([]); // [] = all
	const [selectedTransformCats, setSelectedTransformCats] = useState([]); // [] = all
	const [onlyUnread, setOnlyUnread] = useState(false);
	const [onlyStarred, setOnlyStarred] = useState(false);
	const [index, setIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const allPoints = useMemo(
		() => flattenGrammarPoints(lessons, level),
		[lessons, level],
	);

	useEffect(() => {
		setSelectedLessons([]);
		setSelectedParticles([]);
		setIndex(0);
		setFlipped(false);
		setOnlyUnread(false);
		setOnlyStarred(false);
	}, [lessons]);

	useEffect(() => {
		setSelectedLessons([]);
		setSelectedParticles([]);
		setSelectedTransformCats([]);
	}, [groupBy]);

	const isTransform = groupBy === "transform";

	let visiblePoints;
	if (isTransform) {
		visiblePoints =
			selectedTransformCats.length === 0
				? transformRows
				: transformRows.filter((r) =>
						selectedTransformCats.includes(r.category),
					);
	} else if (groupBy === "particle") {
		visiblePoints =
			selectedParticles.length === 0
				? allPoints
				: allPoints.filter((p) =>
						selectedParticles.includes(p.particle || "other"),
					);
	} else {
		visiblePoints =
			selectedLessons.length === 0
				? allPoints
				: allPoints.filter((p) => selectedLessons.includes(p.category));
	}
	if (onlyUnread)
		visiblePoints = visiblePoints.filter((p) => !progress[p.id]?.learned);
	if (onlyStarred)
		visiblePoints = visiblePoints.filter((p) => favorites[p.id]);

	// A shuffled deck, same pattern as Study.jsx's flashcards for
	// vocab/kanji: an id order is picked once and reused across filter
	// changes (new items not yet in it are appended), so re-shuffling is
	// an explicit action rather than happening on every filter tweak.
	const [order, setOrder] = useState(() =>
		shuffle(allPoints.map((p) => p.id)).concat(
			shuffle(transformRows.map((r) => r.id)),
		),
	);

	useEffect(() => {
		setOrder(
			shuffle(allPoints.map((p) => p.id)).concat(
				shuffle(transformRows.map((r) => r.id)),
			),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lessons]);

	const deck = useMemo(() => {
		const visibleIds = new Set(visiblePoints.map((p) => p.id));
		const byId = new Map(visiblePoints.map((p) => [p.id, p]));
		const orderedIds = order.filter((id) => visibleIds.has(id));
		const seen = new Set(orderedIds);
		for (const p of visiblePoints) {
			if (!seen.has(p.id)) {
				orderedIds.push(p.id);
				seen.add(p.id);
			}
		}
		return orderedIds.map((id) => byId.get(id)).filter(Boolean);
	}, [order, visiblePoints]);

	const reshuffle = () => {
		setOrder(shuffle(deck.map((p) => p.id)));
		setIndex(0);
		setFlipped(false);
	};

	// Jumping back to the first card whenever the visible set changes keeps
	// this in sync with Study.jsx's own flashcard behavior for vocab/kanji.
	useEffect(() => {
		setIndex(0);
		setFlipped(false);
	}, [
		selectedLessons,
		selectedParticles,
		selectedTransformCats,
		onlyUnread,
		onlyStarred,
		groupBy,
	]);

	useEffect(() => {
		if (index >= deck.length) setIndex(0);
	}, [deck.length, index]);

	if (!lessons || lessons.length === 0) {
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
			<div className="flex items-center gap-2 mb-3">
				<div className="flex rounded-full border border-ai-line dark:border-night-line overflow-hidden">
					<button
						onClick={() => setGroupBy("lesson")}
						className={`px-3 py-1.5 text-xs font-bengali font-medium ${
							groupBy === "lesson"
								? "bg-shu text-washi"
								: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
						}`}
					>
						{T("groupByLesson")}
					</button>
					<button
						onClick={() => setGroupBy("particle")}
						className={`px-3 py-1.5 text-xs font-bengali font-medium ${
							groupBy === "particle"
								? "bg-shu text-washi"
								: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
						}`}
					>
						{T("groupByParticle")}
					</button>
					<button
						onClick={() => setGroupBy("transform")}
						className={`px-3 py-1.5 text-xs font-bengali font-medium ${
							groupBy === "transform"
								? "bg-shu text-washi"
								: "bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line"
						}`}
					>
						{T("groupByTransform")}
					</button>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-2 mb-5">
				<div className="flex-1">
					<label className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted block mb-1.5">
						{isTransform
							? T("grammarSelectTransform")
							: groupBy === "particle"
								? T("grammarSelectParticle")
								: T("grammarSelectLesson")}
					</label>
					{isTransform ? (
						<CategoryMultiSelect
							categories={TRANSFORM_CATEGORIES}
							selected={selectedTransformCats}
							onChange={setSelectedTransformCats}
							lang={lang}
							allLabel={T("allCategories")}
						/>
					) : groupBy === "particle" ? (
						<CategoryMultiSelect
							categories={particleCategories}
							selected={selectedParticles}
							onChange={setSelectedParticles}
							lang={lang}
							allLabel={T("allCategories")}
						/>
					) : (
						<CategoryMultiSelect
							categories={lessonCategories}
							selected={selectedLessons}
							onChange={setSelectedLessons}
							lang={lang}
							allLabel={T("allCategories")}
						/>
					)}
				</div>
				<div className="self-end sm:self-auto sm:mt-[22px] flex items-center gap-2">
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
					<ShuffleButton onClick={reshuffle} label={T("shuffle")} />
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

				<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg overflow-hidden shadow-card dark:shadow-none">
					<div className="flex items-start justify-between gap-2 px-4 sm:px-5 pt-4">
						<span className="font-bengali text-[11px] bg-ai-soft dark:bg-night-line text-ai dark:text-ai-glow rounded-full px-2.5 py-1">
							{pickLang(point.formLabel, lang)}
						</span>
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
						className="w-full flex flex-col items-center justify-center gap-3 py-12 px-4 text-left min-h-[220px]"
					>
						{!flipped ? (
							<>
								<div className="font-mincho text-4xl sm:text-5xl text-ink dark:text-night-ink text-center">
									{point.mainForm}
								</div>
								<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-2">
									{T("tapToRevealForm")}
								</span>
							</>
						) : (
							<div className="font-mincho text-4xl sm:text-5xl text-shu dark:text-shu-glow text-center">
								{point.transformedForm}
							</div>
						)}
					</button>

					{flipped && point.meaningBn && (
						<div className="bg-sakura-soft dark:bg-night border-t border-ai-line dark:border-night-line px-4 sm:px-5 py-3 text-center">
							<span className="font-bengali text-sm text-sakura-deep dark:text-sakura">
								{point.meaningBn}
							</span>
						</div>
					)}
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
							<div className="px-4 sm:px-5 pt-3 pb-4">
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
						<div className="bg-sakura-soft dark:bg-night px-4 sm:px-5 py-4">
							{point.examples.length > 0 ? (
								<>
									<div className="font-bengali text-[10px] font-bold uppercase tracking-wide text-sakura-deep dark:text-sakura mb-2.5">
										{T("grammarExamples")}
									</div>
									<div className="space-y-3">
										{point.examples.map((ex, ei) => (
											<div
												key={ei}
												className={
													ei > 0
														? "pt-3 border-t border-sakura-line dark:border-night-line"
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
													<div className="font-bengali text-sm text-sakura-deep dark:text-sakura mt-1">
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
