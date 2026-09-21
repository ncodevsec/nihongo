// Selectable typefaces for Japanese text.
//
// Every option is a free Google Font, loaded only when it is actually
// chosen (the Settings list loads just a few-character subset of each so
// the samples render). The choice is written to two CSS variables:
//   --font-jp-display  used by `font-mincho` (flashcards, headings…)
//   --font-jp-body     appended to the body / `font-bengali` stacks, so any
//                      other Japanese text falls through to the same font
// The default (Shippori Mincho) leaves both variables at their defaults in
// index.css, so nothing changes unless the learner picks another font.

export const JP_FONTS = [
	{
		key: "default",
		name: "Shippori Mincho",
		family: '"Shippori Mincho"',
		google: null,
		descKey: "jpFontDescDefault",
	},
	{
		key: "noto-sans",
		name: "Noto Sans JP",
		family: '"Noto Sans JP"',
		google: "Noto+Sans+JP:wght@400;500;700",
		descKey: "jpFontDescNotoSans",
	},
	{
		key: "biz-ud",
		name: "BIZ UDPGothic",
		family: '"BIZ UDPGothic"',
		google: "BIZ+UDPGothic:wght@400;700",
		descKey: "jpFontDescBizUd",
	},
	{
		key: "zen-kaku",
		name: "Zen Kaku Gothic New",
		family: '"Zen Kaku Gothic New"',
		google: "Zen+Kaku+Gothic+New:wght@400;500;700",
		descKey: "jpFontDescZenKaku",
	},
	{
		key: "mplus-rounded",
		name: "M PLUS Rounded 1c",
		family: '"M PLUS Rounded 1c"',
		google: "M+PLUS+Rounded+1c:wght@400;500;700",
		descKey: "jpFontDescMplus",
	},
	{
		key: "noto-serif",
		name: "Noto Serif JP",
		family: '"Noto Serif JP"',
		google: "Noto+Serif+JP:wght@400;500;700",
		descKey: "jpFontDescNotoSerif",
	},
];

// Text shown in the Settings samples; also the only characters fetched for
// the preview subsets. Kana are what set these gothic/rounded/serif faces
// apart most clearly, so they lead.
export const JP_FONT_SAMPLE_KANA = "あいうえお さしすせそ ふきそ カタカナ";
export const JP_FONT_SAMPLE_KANJI = "日本語の漢字 山川雨魚 学習";
export const JP_FONT_SAMPLE = `${JP_FONT_SAMPLE_KANA} ${JP_FONT_SAMPLE_KANJI}`;

const CACHE_KEY = "nihongo-jpfont-v1";
const VARS = ["--font-jp-display", "--font-jp-body"];

const hrefFor = (font, text) =>
	`https://fonts.googleapis.com/css2?family=${font.google}${
		text ? `&text=${encodeURIComponent(text)}` : ""
	}&display=swap`;

function ensureStylesheet(id, href) {
	const existing = document.getElementById(id);
	if (existing) return existing;
	const link = document.createElement("link");
	link.id = id;
	link.rel = "stylesheet";
	link.href = href;
	document.head.appendChild(link);
	return link;
}

export const isJpFontKey = (key) => JP_FONTS.some((f) => f.key === key);

// Applies (or, for the default, clears) the chosen font. Cheap to call on
// every settings change. A small cache lets index.html apply the same font
// before first paint on the next launch.
export function applyJpFont(key) {
	if (typeof document === "undefined") return;
	const font = JP_FONTS.find((f) => f.key === key) ?? JP_FONTS[0];
	const root = document.documentElement;

	if (!font.google) {
		for (const v of VARS) root.style.removeProperty(v);
		try {
			localStorage.removeItem(CACHE_KEY);
		} catch {
			// ignore
		}
		return;
	}

	// The Settings sample subset uses the same family name as the full font;
	// two @font-face sets for one family would fight over which glyphs are
	// available, so the active font never keeps its sample stylesheet.
	document.getElementById(`jpfont-preview-${font.key}`)?.remove();
	document.getElementById(`jpfont-preview-full-${font.key}`)?.remove();
	const href = hrefFor(font);
	ensureStylesheet(`jpfont-${font.key}`, href);
	for (const v of VARS) root.style.setProperty(v, font.family);
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ key: font.key, family: font.family, href }));
	} catch {
		// ignore — worst case a brief fallback font on next launch
	}
}

// Loads a tiny sample-text subset of every font so Settings can show what
// each one looks like without downloading them in full. If the subset
// request fails for any reason, that font falls back to its normal
// stylesheet (the browser then fetches only the slices the sample needs).
export function loadPreviewFonts() {
	if (typeof document === "undefined") return;
	for (const font of JP_FONTS) {
		// Skip fonts already loaded in full (see applyJpFont).
		if (!font.google || document.getElementById(`jpfont-${font.key}`)) continue;
		const link = ensureStylesheet(`jpfont-preview-${font.key}`, hrefFor(font, JP_FONT_SAMPLE));
		link.addEventListener(
			"error",
			() => {
				link.remove();
				ensureStylesheet(`jpfont-preview-full-${font.key}`, hrefFor(font));
			},
			{ once: true },
		);
	}
}

const sheetReady = (link) =>
	!link || link.sheet
		? Promise.resolve()
		: new Promise((resolve) => {
				link.addEventListener("load", resolve, { once: true });
				link.addEventListener("error", resolve, { once: true });
			});

// Resolves true once the font's real glyphs are available for the sample
// text, false if it could not be loaded (offline, blocked, bad response, or
// nothing arrived within `timeoutMs`). Lets Settings say so instead of
// silently showing a fallback font that looks like every other row.
export async function checkJpFont(key, timeoutMs = 10000) {
	const font = JP_FONTS.find((f) => f.key === key);
	if (!font || typeof document === "undefined" || !document.fonts?.load) return true;
	const work = (async () => {
		if (font.google) {
			const find = () =>
				document.getElementById(`jpfont-${font.key}`) ||
				document.getElementById(`jpfont-preview-${font.key}`) ||
				document.getElementById(`jpfont-preview-full-${font.key}`);
			await sheetReady(find());
			await sheetReady(find()); // covers the subset -> full fallback swap
		}
		const faces = await document.fonts.load(`400 20px ${font.family}`, JP_FONT_SAMPLE);
		return faces.some((f) => f.status === "loaded");
	})();
	const timeout = new Promise((resolve) => setTimeout(() => resolve(false), timeoutMs));
	try {
		return await Promise.race([work, timeout]);
	} catch {
		return false;
	}
}
