import { useMemo } from "react";

// Small dependency-free Markdown renderer for grammar descriptions. Renders
// straight to React elements (no HTML injection). Supports headings, bold /
// italic / `code`, bullet + numbered lists, tables, dividers, quotes and
// callouts (> [!NOTE] / [!TIP] / [!WARN]).

const CALLOUTS = {
	NOTE: {
		label: { bn: "নোট", en: "Note" },
		cls: "border-ai dark:border-ai-glow bg-ai-soft dark:bg-night",
		text: "text-ai dark:text-ai-glow",
	},
	TIP: {
		label: { bn: "টিপ", en: "Tip" },
		cls: "border-take dark:border-take-glow bg-take-soft dark:bg-take/10",
		text: "text-take dark:text-take-glow",
	},
	WARN: {
		label: { bn: "সতর্কতা", en: "Watch out" },
		cls: "border-shu dark:border-shu-glow bg-shu-soft dark:bg-shu/10",
		text: "text-shu dark:text-shu-glow",
	},
};

const LIST_RE = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const HR_RE = /^\s*(-{3,}|\*{3,})\s*$/;
const SEP_RE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
const splitRow = (l) =>
	l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());

function startsBlock(line, next) {
	return (
		/^#{1,4}\s/.test(line) ||
		HR_RE.test(line) ||
		/^\s*>/.test(line) ||
		LIST_RE.test(line) ||
		(line.trim().startsWith("|") && next !== undefined && SEP_RE.test(next))
	);
}

export function parseMarkdown(src) {
	const lines = String(src || "").replace(/\r\n?/g, "\n").split("\n");
	const blocks = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) {
			i++;
			continue;
		}
		let m = line.match(/^(#{1,4})\s+(.*)$/);
		if (m) {
			blocks.push({ type: "h", level: m[1].length, text: m[2].trim() });
			i++;
			continue;
		}
		if (HR_RE.test(line)) {
			blocks.push({ type: "hr" });
			i++;
			continue;
		}
		if (line.trim().startsWith("|") && i + 1 < lines.length && SEP_RE.test(lines[i + 1])) {
			const head = splitRow(line);
			i += 2;
			const rows = [];
			while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(splitRow(lines[i++]));
			blocks.push({ type: "table", head, rows });
			continue;
		}
		if (/^\s*>/.test(line)) {
			const body = [];
			while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ""));
			const k = body[0].match(/^\[!(\w+)\]\s*(.*)$/);
			const kind = k && CALLOUTS[k[1].toUpperCase()] ? k[1].toUpperCase() : null;
			if (kind) body[0] = k[2];
			blocks.push({ type: "quote", kind, body: body.join("\n") });
			continue;
		}
		if (LIST_RE.test(line)) {
			const items = [];
			while (i < lines.length) {
				const l = lines[i];
				const lm = l.match(LIST_RE);
				if (lm) {
					items.push({ indent: lm[1].length, ordered: /\d/.test(lm[2]), text: lm[3] });
					i++;
				} else if (!l.trim()) {
					const nxt = lines.slice(i + 1).find((x) => x.trim());
					if (nxt && LIST_RE.test(nxt)) i++;
					else break;
				} else if (/^\s+/.test(l) && !startsBlock(l.trim())) {
					items[items.length - 1].text += " " + l.trim();
					i++;
				} else break;
			}
			blocks.push({ type: "list", items });
			continue;
		}
		const para = [];
		while (i < lines.length && lines[i].trim() && !(para.length && startsBlock(lines[i], lines[i + 1]))) {
			para.push(lines[i++].trim());
		}
		blocks.push({ type: "p", text: para.join(" ") });
	}
	return blocks;
}

function inline(text) {
	const out = [];
	const re = /\*\*([^*]+)\*\*|`([^`]+)`|\*([^*\s][^*]*)\*/g;
	let last = 0;
	let m;
	let k = 0;
	while ((m = re.exec(text))) {
		if (m.index > last) out.push(text.slice(last, m.index));
		if (m[1] != null)
			out.push(<strong key={k++} className="font-bold text-ink dark:text-night-ink">{m[1]}</strong>);
		else if (m[2] != null)
			out.push(
				<code
					key={k++}
					className="font-mincho text-[0.95em] px-1.5 py-0.5 rounded bg-shu-soft dark:bg-night text-shu dark:text-shu-glow"
				>
					{m[2]}
				</code>,
			);
		else out.push(<em key={k++}>{m[3]}</em>);
		last = m.index + m[0].length;
	}
	if (last < text.length) out.push(text.slice(last));
	return out;
}

function Blocks({ blocks, lang }) {
	return (
		<div className="space-y-3 font-bengali">
			{blocks.map((b, bi) => {
				if (b.type === "h") {
					if (b.level >= 4)
						return (
							<h5 key={bi} className="pt-1 text-[11px] font-bold uppercase tracking-wide text-shu dark:text-shu-glow">
								{inline(b.text)}
							</h5>
						);
					if (b.level === 3)
						return (
							<h4 key={bi} className="pt-1 flex items-center gap-2 text-sm font-bold text-ink dark:text-night-ink">
								<span className="w-1 h-4 rounded-full bg-shu dark:bg-shu-glow shrink-0" />
								{inline(b.text)}
							</h4>
						);
					return (
						<h3 key={bi} className="pt-1 pb-1 border-b border-ai-line dark:border-night-line text-base font-bold text-ink dark:text-night-ink">
							{inline(b.text)}
						</h3>
					);
				}
				if (b.type === "hr")
					return <hr key={bi} className="border-ai-line dark:border-night-line" />;
				if (b.type === "p")
					return (
						<p key={bi} className="text-sm leading-relaxed text-ink dark:text-night-ink">
							{inline(b.text)}
						</p>
					);
				if (b.type === "list") {
					const counters = {};
					return (
						<ul key={bi} className="space-y-1.5" role="list">
							{b.items.map((it, ii) => {
								const level = Math.min(2, Math.floor(it.indent / 2));
								counters[level] = (counters[level] || 0) + 1;
								Object.keys(counters).forEach((l) => l > level && delete counters[l]);
								return (
									<li
										key={ii}
										style={{ marginLeft: level * 16 }}
										className="flex gap-2 text-sm leading-relaxed text-ink dark:text-night-ink"
									>
										{it.ordered ? (
											<span className="shrink-0 w-5 text-right font-mono text-[11px] font-bold text-shu dark:text-shu-glow pt-0.5">
												{counters[level]}.
											</span>
										) : (
											<span className="shrink-0 mt-[0.6em] w-1.5 h-1.5 rounded-full bg-shu/70 dark:bg-shu-glow/70" />
										)}
										<span className="min-w-0">{inline(it.text)}</span>
									</li>
								);
							})}
						</ul>
					);
				}
				if (b.type === "table")
					return (
						<div key={bi} className="overflow-x-auto rounded-lg border border-ai-line dark:border-night-line">
							<table className="min-w-full text-xs">
								<thead className="bg-ai-soft dark:bg-night-line/60 text-ai dark:text-ai-glow">
									<tr>
										{b.head.map((h, hi) => (
											<th key={hi} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
												{inline(h)}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-ai-line dark:divide-night-line">
									{b.rows.map((r, ri) => (
										<tr key={ri}>
											{r.map((c, ci) => (
												<td
													key={ci}
													className={`px-3 py-2 align-top leading-snug text-ink dark:text-night-ink ${ci === 0 ? "font-semibold" : ""}`}
												>
													{inline(c)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					);
				if (b.type === "quote") {
					const c = b.kind && CALLOUTS[b.kind];
					const inner = <Blocks blocks={parseMarkdown(b.body)} lang={lang} />;
					if (!c)
						return (
							<blockquote key={bi} className="border-l-2 border-sakura-line dark:border-night-line pl-3 text-ink-muted dark:text-night-ink-muted">
								{inner}
							</blockquote>
						);
					return (
						<aside key={bi} className={`rounded-lg border-l-4 px-3 py-2.5 ${c.cls}`}>
							<div className={`mb-1 text-[10px] font-bold uppercase tracking-wide ${c.text}`}>
								{lang === "bn" ? c.label.bn : c.label.en}
							</div>
							{inner}
						</aside>
					);
				}
				return null;
			})}
		</div>
	);
}

export default function Markdown({ text, lang = "en" }) {
	const blocks = useMemo(() => parseMarkdown(text), [text]);
	if (!blocks.length) return null;
	return <Blocks blocks={blocks} lang={lang} />;
}
