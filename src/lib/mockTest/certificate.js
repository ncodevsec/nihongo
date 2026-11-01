// Mock-exam certificate: scores per section → an A4-landscape PNG (canvas).
// Drawn on a 2970 × 2100 canvas (10 px/mm), exported as 2339 × 1654 px = A4 landscape
// (297 × 210 mm) at 200 dpi — sharp for print and small enough to share.
export const CERT_OUT_W = 2339;
export const CERT_OUT_H = 1654;

export const CERT_W = 2970;
export const CERT_H = 2100;

const SERIF = '"Shippori Mincho", "Noto Sans Bengali", "Hiragino Mincho ProN", "Yu Mincho", Georgia, "Times New Roman", serif';
const SANS = '"Noto Sans Bengali", "Hiragino Kaku Gothic ProN", "Segoe UI", Arial, sans-serif';
const RED = "#8f1d1d";
const RED_DARK = "#6b1212";
const GOLD = "#b08d3c";
const INK = "#2a2420";
const MUTED = "#6e655a";

const pct = (c, t) => (t ? Math.round((c / t) * 1000) / 10 : 0);

// Per exam section + overall + skill numbers, taken from a finished result.
export function buildCertificateData(result) {
	const { test, score } = result;
	const sections = test.sections.map((s) => {
		const qs = score.flat.filter((f) => f.q.section === s.key);
		const c = qs.filter((f) => f.ok).length;
		return { key: s.key, c, t: qs.length, p: pct(c, qs.length) };
	});
	const c = sections.reduce((n, s) => n + s.c, 0);
	const t = sections.reduce((n, s) => n + s.t, 0);
	return {
		level: test.level.toUpperCase(),
		format: test.format === "jlpt" ? "JLPT" : "NAT-TEST",
		title: test.title || "",
		timed: !!test.timed,
		sections,
		total: { c, t, p: pct(c, t) },
		scaled: score.complete ? score.total : null,
		passMark: test.passMark,
		pass: !!score.complete && !!score.pass,
		complete: !!score.complete,
		id: String(test.id || "").replace(/^mock-/, "").slice(-8).toUpperCase(),
	};
}

const SECTION_NAME = {
	vocab: ["Language Knowledge — Vocabulary & Kanji", "言語知識（文字・語彙）"],
	grammarReading: ["Language Knowledge — Grammar & Reading", "言語知識（文法）・読解"],
	listening: ["Listening Comprehension", "聴解"],
};

function spaced(ctx, text, x, y, gap) {
	const chars = [...text];
	const widths = chars.map((ch) => ctx.measureText(ch).width);
	const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
	let cx = x - total / 2;
	const align = ctx.textAlign;
	ctx.textAlign = "left";
	chars.forEach((ch, i) => {
		ctx.fillText(ch, cx, y);
		cx += widths[i] + gap;
	});
	ctx.textAlign = align;
}

function fit(ctx, text, maxW, size, weight, family) {
	let s = size;
	do {
		ctx.font = `${weight} ${s}px ${family}`;
		s -= 4;
	} while (ctx.measureText(text).width > maxW && s > 40);
}

function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

// Faint seigaiha (wave) pattern behind everything.
function waves(ctx, x0, y0, x1, y1) {
	const r = 60;
	ctx.save();
	ctx.beginPath();
	ctx.rect(x0, y0, x1 - x0, y1 - y0);
	ctx.clip();
	ctx.strokeStyle = "rgba(143,29,29,0.055)";
	ctx.lineWidth = 3;
	for (let row = 0, y = y0; y < y1 + r; row++, y += r / 2) {
		for (let x = x0 - (row % 2 ? r : 0); x < x1 + r; x += r * 2) {
			for (let k = 3; k >= 1; k--) {
				ctx.beginPath();
				ctx.arc(x + r, y + r, (r * k) / 3, Math.PI, 0);
				ctx.stroke();
			}
		}
	}
	ctx.restore();
}

function corner(ctx, x, y, sx, sy) {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(sx, sy);
	ctx.strokeStyle = GOLD;
	ctx.fillStyle = GOLD;
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.moveTo(0, 150);
	ctx.lineTo(0, 0);
	ctx.lineTo(150, 0);
	ctx.stroke();
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(0, 0, 100, 0, Math.PI / 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(0, 0, 70, 0, Math.PI / 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(34, 34);
	ctx.lineTo(48, 20);
	ctx.lineTo(62, 34);
	ctx.lineTo(48, 48);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function seal(ctx, cx, cy, r, big, small) {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate(-0.12);
	ctx.strokeStyle = "#b8281f";
	ctx.fillStyle = "#b8281f";
	ctx.globalAlpha = 0.92;
	ctx.lineWidth = 12;
	ctx.beginPath();
	ctx.arc(0, 0, r, 0, Math.PI * 2);
	ctx.stroke();
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(0, 0, r - 22, 0, Math.PI * 2);
	ctx.stroke();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `800 ${r * 0.78}px ${SERIF}`;
	ctx.fillText(big, 0, -r * 0.06);
	ctx.font = `700 ${r * 0.2}px ${SANS}`;
	ctx.fillText(small, 0, r * 0.55);
	ctx.restore();
}

function loadImage(src) {
	return new Promise((res) => {
		const img = new Image();
		img.onload = () => res(img);
		img.onerror = () => res(null);
		img.src = src;
	});
}

async function ensureFonts() {
	try {
		if (document.fonts?.load) {
			await Promise.all([
				document.fonts.load(`700 60px "Shippori Mincho"`, "修了証書合格Aa"),
				document.fonts.load(`400 60px "Shippori Mincho"`, "修了証書Aa"),
				document.fonts.load(`400 40px "Noto Sans Bengali"`, "অআকখ"),
			]);
		}
	} catch {
		// fall back to system fonts
	}
}

// → Promise<HTMLCanvasElement>
export async function renderCertificate(data, { name, siteUrl, dateText }) {
	await ensureFonts();
	const logo = await loadImage("/icons/icon-192.png");
	const canvas = document.createElement("canvas");
	canvas.width = CERT_W;
	canvas.height = CERT_H;
	const ctx = canvas.getContext("2d");
	ctx.textBaseline = "alphabetic";

	// paper
	ctx.fillStyle = "#fcf6e6";
	ctx.fillRect(0, 0, CERT_W, CERT_H);
	waves(ctx, 120, 120, CERT_W - 120, CERT_H - 120);

	// borders
	ctx.strokeStyle = RED;
	ctx.lineWidth = 22;
	ctx.strokeRect(70, 70, CERT_W - 140, CERT_H - 140);
	ctx.strokeStyle = GOLD;
	ctx.lineWidth = 5;
	ctx.strokeRect(112, 112, CERT_W - 224, CERT_H - 224);
	ctx.lineWidth = 2;
	ctx.strokeRect(128, 128, CERT_W - 256, CERT_H - 256);
	corner(ctx, 128, 128, 1, 1);
	corner(ctx, CERT_W - 128, 128, -1, 1);
	corner(ctx, 128, CERT_H - 128, 1, -1);
	corner(ctx, CERT_W - 128, CERT_H - 128, -1, -1);

	// watermark
	ctx.save();
	ctx.fillStyle = "rgba(143,29,29,0.03)";
	ctx.textAlign = "center";
	ctx.font = `800 900px ${SERIF}`;
	ctx.fillText("修了", CERT_W / 2, CERT_H / 2 + 330);
	ctx.restore();

	const cx = CERT_W / 2;
	ctx.textAlign = "center";

	// brand
	if (logo) ctx.drawImage(logo, cx - 70, 185, 140, 140);
	ctx.fillStyle = RED;
	ctx.font = `700 46px ${SERIF}`;
	spaced(ctx, "NIHONGO · STUDY LAB", cx, 385, 10);

	// title
	ctx.fillStyle = RED_DARK;
	ctx.font = `800 118px ${SERIF}`;
	spaced(ctx, "CERTIFICATE OF ACHIEVEMENT", cx, 520, 14);
	ctx.fillStyle = GOLD;
	ctx.fillRect(cx - 360, 560, 720, 5);
	ctx.fillStyle = INK;
	ctx.font = `600 54px ${SERIF}`;
	spaced(ctx, "修 了 証 書", cx, 640, 18);

	// body
	ctx.fillStyle = MUTED;
	ctx.font = `italic 400 46px ${SERIF}`;
	ctx.fillText("This is to certify that", cx, 735);

	const shown = (name || "").trim() || "—";
	ctx.fillStyle = RED_DARK;
	fit(ctx, shown, 2100, 140, 700, SERIF);
	ctx.fillText(shown, cx, 870);
	ctx.strokeStyle = GOLD;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(cx - 1000, 905);
	ctx.lineTo(cx + 1000, 905);
	ctx.stroke();

	ctx.fillStyle = INK;
	ctx.font = `400 44px ${SERIF}`;
	const kind = data.title ? `"${data.title}"` : `${data.format} ${data.level} Mock Examination`;
	ctx.fillText(`has completed the full-length ${kind} (${data.timed ? "timed" : "untimed"})`, cx, 975);
	ctx.fillText(`on ${dateText} and achieved the following results:`, cx, 1035);

	// table
	const tx = 440;
	const tw = CERT_W - 880;
	const cols = { name: tx + 40, c: tx + tw * 0.60, t: tx + tw * 0.71, bar: tx + tw * 0.76, p: tx + tw - 40 };
	const rowH = 96;
	let y = 1085;
	ctx.fillStyle = RED;
	roundRect(ctx, tx, y, tw, rowH, 10);
	ctx.fill();
	ctx.fillStyle = "#fff";
	ctx.font = `700 38px ${SANS}`;
	ctx.textAlign = "left";
	ctx.fillText("SECTION", cols.name, y + 62);
	ctx.textAlign = "center";
	ctx.fillText("CORRECT", cols.c, y + 62);
	ctx.fillText("TOTAL", cols.t, y + 62);
	ctx.textAlign = "right";
	ctx.fillText("PERCENTAGE", cols.p, y + 62);
	y += rowH;

	const rows = [...data.sections.map((s) => ({ ...s, label: SECTION_NAME[s.key] || [s.key, ""] })), { ...data.total, label: ["Overall", "総合"], bold: true }];
	rows.forEach((r, i) => {
		if (r.bold) {
			ctx.fillStyle = "rgba(176,141,60,0.22)";
		} else {
			ctx.fillStyle = i % 2 ? "rgba(143,29,29,0.05)" : "rgba(255,255,255,0.65)";
		}
		ctx.fillRect(tx, y, tw, rowH);
		ctx.strokeStyle = "rgba(176,141,60,0.55)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(tx, y + rowH);
		ctx.lineTo(tx + tw, y + rowH);
		ctx.stroke();
		ctx.fillStyle = INK;
		ctx.textAlign = "left";
		ctx.font = `${r.bold ? 800 : 600} 42px ${SERIF}`;
		ctx.fillText(r.label[0], cols.name, y + 63);
		if (r.label[1]) {
			const w = ctx.measureText(r.label[0]).width;
			ctx.fillStyle = MUTED;
			ctx.font = `400 32px ${SERIF}`;
			if (cols.name + w + 30 + ctx.measureText(`（${r.label[1]}）`).width < cols.c - 120) ctx.fillText(`  ${r.label[1]}`, cols.name + w, y + 63);
		}
		ctx.fillStyle = INK;
		ctx.textAlign = "center";
		ctx.font = `${r.bold ? 800 : 600} 46px ${SERIF}`;
		ctx.fillText(String(r.c), cols.c, y + 64);
		ctx.fillText(String(r.t), cols.t, y + 64);
		// bar
		const bw = tw * 0.13;
		ctx.fillStyle = "rgba(0,0,0,0.09)";
		roundRect(ctx, cols.bar, y + 36, bw, 24, 12);
		ctx.fill();
		ctx.fillStyle = r.p >= 75 ? "#3f7a3d" : r.p >= 50 ? "#c28a1c" : "#b8281f";
		roundRect(ctx, cols.bar, y + 36, Math.max(24, (bw * r.p) / 100), 24, 12);
		ctx.fill();
		ctx.fillStyle = INK;
		ctx.textAlign = "right";
		ctx.font = `800 48px ${SERIF}`;
		ctx.fillText(`${r.p.toFixed(1)}%`, cols.p, y + 64);
		y += rowH;
	});
	ctx.strokeStyle = RED;
	ctx.lineWidth = 4;
	roundRect(ctx, tx, 1085, tw, y - 1085, 10);
	ctx.stroke();

	// bottom: score box · signature · seal
	const by = y + 75;
	ctx.textAlign = "left";
	ctx.fillStyle = MUTED;
	ctx.font = `600 34px ${SANS}`;
	ctx.fillText("ESTIMATED SCORE", 330, by);
	ctx.fillStyle = RED_DARK;
	ctx.font = `800 96px ${SERIF}`;
	if (data.scaled != null) {
		ctx.fillText(`${data.scaled}`, 330, by + 100);
		const w = ctx.measureText(`${data.scaled}`).width;
		ctx.fillStyle = MUTED;
		ctx.font = `600 44px ${SERIF}`;
		ctx.fillText(`/ 180   (pass mark ${data.passMark})`, 330 + w + 18, by + 100);
		ctx.fillStyle = data.pass ? "#2f6b2d" : RED_DARK;
		ctx.font = `700 42px ${SANS}`;
		ctx.fillText(data.pass ? "Result: PASS (estimated)" : "Result: Below pass mark (estimated)", 330, by + 160);
	} else {
		ctx.fillText(`${data.total.p.toFixed(1)}%`, 330, by + 100);
		ctx.fillStyle = MUTED;
		ctx.font = `600 38px ${SANS}`;
		ctx.fillText("Overall accuracy (listening not taken)", 330, by + 160);
	}

	// signature
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(1500, by + 70);
	ctx.lineTo(2000, by + 70);
	ctx.stroke();
	ctx.textAlign = "center";
	ctx.fillStyle = INK;
	ctx.font = `italic 400 64px ${SERIF}`;
	ctx.fillText("NihonGo Study Lab", 1750, by + 50);
	ctx.font = `600 32px ${SANS}`;
	ctx.fillStyle = MUTED;
	ctx.fillText("AUTHORISED ISSUER", 1750, by + 120);

	seal(ctx, CERT_W - 470, by + 100, 125, data.pass ? "合格" : "修了", data.pass ? "PASSED" : "COMPLETED");

	// footer
	ctx.textAlign = "center";
	ctx.fillStyle = MUTED;
	ctx.font = `400 30px ${SANS}`;
	ctx.fillText(`Certificate No. ${data.id}   ·   ${siteUrl}`, cx, CERT_H - 205);
	ctx.font = `400 26px ${SANS}`;
	ctx.fillText("Practice certificate — scores are estimates and this is not an official JLPT / NAT-TEST result.", cx, CERT_H - 165);

	const out = document.createElement("canvas");
	out.width = CERT_OUT_W;
	out.height = CERT_OUT_H;
	const octx = out.getContext("2d");
	octx.imageSmoothingQuality = "high";
	octx.drawImage(canvas, 0, 0, CERT_OUT_W, CERT_OUT_H);
	return out;
}

export const canvasToBlob = (canvas) => new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
