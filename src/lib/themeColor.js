// Runtime accent-color ("theme hue") engine.
//
// The whole brand palette (buttons, borders, tints, dark-mode glows …) was
// designed around one red hue. To let the learner pick any other color
// without losing that carefully tuned look, every brand color is shifted in
// OKLCH — a perceptual color space — by rotating only its HUE and keeping
// its perceived LIGHTNESS and CHROMA. So light red becomes light blue, dark
// red becomes dark blue, and white text keeps the same contrast on the
// primary color whatever the hue. (Rotating hue in plain HSL would not:
// yellow at the same HSL lightness is far brighter than blue.)
//
// Colors that would fall outside the sRGB screen gamut at the new hue have
// their chroma reduced just enough to fit (lightness is never touched).
//
// Semantic colors — success green ("take") and error red ("danger") — and
// the neutral surfaces are deliberately NOT part of this: "correct" stays
// green and "wrong" stays red whatever the theme.

// The original palette (hue 0 / red). Keys are the Tailwind color names,
// which read the CSS variable of the same name (see tailwind.config.js).
export const BASE_COLORS = {
	shu: "#bd2828",
	"shu-soft": "#fbeeee",
	"shu-glow": "#ff3434",
	ai: "#862727",
	"ai-soft": "#faefef",
	"ai-line": "#ebe0e0",
	"ai-glow": "#ff5454",
	sakura: "#e48b8b",
	"sakura-soft": "#faefef",
	"sakura-line": "#efdcdc",
	"sakura-deep": "#9b3b3b",
	kin: "#bd2828",
};

const CACHE_KEY = "nihongo-theme-v1";

// ---------- sRGB <-> OKLab/OKLCH (Björn Ottosson's reference matrices) ----
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToRgb(hex) {
	const n = parseInt(hex.slice(1), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToOklch([r, g, b]) {
	const lr = toLinear(r / 255);
	const lg = toLinear(g / 255);
	const lb = toLinear(b / 255);
	const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
	const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
	const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	return { L, C: Math.hypot(a, bb), h: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

// Returns linear-light rgb (may be out of [0,1] when outside the gamut).
function oklchToLinear({ L, C, h }) {
	const a = C * Math.cos((h * Math.PI) / 180);
	const b = C * Math.sin((h * Math.PI) / 180);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
	];
}

const inGamut = (lin) => lin.every((v) => v >= -0.0005 && v <= 1.0005);

function oklchToRgb(color) {
	let lin = oklchToLinear(color);
	if (!inGamut(lin)) {
		// Keep L and h, pull chroma back until the color is displayable.
		let lo = 0;
		let hi = color.C;
		for (let i = 0; i < 24; i += 1) {
			const mid = (lo + hi) / 2;
			if (inGamut(oklchToLinear({ ...color, C: mid }))) lo = mid;
			else hi = mid;
		}
		lin = oklchToLinear({ ...color, C: lo });
	}
	return lin.map((v) => Math.round(Math.min(1, Math.max(0, fromLinear(Math.min(1, Math.max(0, v))))) * 255));
}

const rgbToHex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

// HSL hue (0-360) of an rgb triple — only used to rotate the logo image.
function hslHue([r, g, b]) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	if (max === min) return 0;
	const d = max - min;
	let h;
	if (max === r) h = ((g - b) / d) % 6;
	else if (max === g) h = (b - r) / d + 2;
	else h = (r - g) / d + 4;
	return (h * 60 + 360) % 360;
}

// The primary brand color's OKLCH hue is what the slider position means.
const BASE_OKLCH = Object.fromEntries(
	Object.entries(BASE_COLORS).map(([k, hex]) => [k, rgbToOklch(hexToRgb(hex))]),
);
export const DEFAULT_HUE = Math.round(BASE_OKLCH.shu.h);

function shiftedRgb(name, hue) {
	const base = BASE_OKLCH[name];
	const delta = hue - BASE_OKLCH.shu.h;
	return oklchToRgb({ L: base.L, C: base.C, h: (base.h + delta + 360) % 360 });
}

// Primary color at a given slider position, as hex (used by the slider
// track, preset swatches and the browser theme-color).
export function primaryAt(hue) {
	if (Math.abs(hue - DEFAULT_HUE) < 0.5) return BASE_COLORS.shu;
	return rgbToHex(shiftedRgb("shu", hue));
}

export function hueGradient(steps = 24) {
	const stops = [];
	for (let i = 0; i <= steps; i += 1) {
		stops.push(`${primaryAt((i / steps) * 360)} ${((i / steps) * 100).toFixed(1)}%`);
	}
	return `linear-gradient(to right, ${stops.join(", ")})`;
}

export const HUE_PRESETS = [
	{ key: "red", hue: DEFAULT_HUE },
	{ key: "orange", hue: 55 },
	{ key: "green", hue: 150 },
	{ key: "teal", hue: 195 },
	{ key: "blue", hue: 255 },
	{ key: "purple", hue: 300 },
	{ key: "pink", hue: 355 },
];

export const normalizeHue = (hue) => {
	const n = Number(hue);
	return Number.isFinite(n) ? Math.min(360, Math.max(0, n)) : DEFAULT_HUE;
};

// { "--shu": "r g b", … , "--logo-rotate": "…deg" } for a slider position.
function buildVars(hue) {
	const vars = {};
	for (const name of Object.keys(BASE_COLORS)) {
		vars[`--${name}`] = shiftedRgb(name, hue).join(" ");
	}
	vars["--logo-rotate"] = `${Math.round(hslHue(shiftedRgb("shu", hue)) - hslHue(hexToRgb(BASE_COLORS.shu)))}deg`;
	return vars;
}

function setMetaThemeColor(hex) {
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) meta.setAttribute("content", hex);
}

// Applies (or, for the default hue, clears) the theme on <html>. Cheap
// enough to call on every slider tick. A copy of the computed variables is
// cached so the inline script in index.html can paint the right colors
// before React loads.
export function applyThemeHue(rawHue) {
	if (typeof document === "undefined") return;
	const hue = normalizeHue(rawHue);
	const root = document.documentElement;
	const isDefault = Math.abs(hue - DEFAULT_HUE) < 0.5;

	if (isDefault) {
		for (const name of Object.keys(BASE_COLORS)) root.style.removeProperty(`--${name}`);
		root.style.removeProperty("--logo-rotate");
		setMetaThemeColor(BASE_COLORS.shu);
		try {
			localStorage.removeItem(CACHE_KEY);
		} catch {
			// ignore
		}
		return;
	}

	const vars = buildVars(hue);
	for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
	const meta = primaryAt(hue);
	setMetaThemeColor(meta);
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ vars, meta }));
	} catch {
		// ignore — worst case a brief default-color flash on next launch
	}
}
