import { useRef, useState } from "react";
import { mt } from "../../lib/mockI18n.js";
import { DEMO_PAPER } from "../../data/mock/demoPaper.js";
import { buildPrompt, fixRequest, paperCount, parsePaperText, validatePaper } from "../../lib/mockTest/paper.js";

async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const ta = document.createElement("textarea");
		ta.value = text;
		ta.style.position = "fixed";
		ta.style.opacity = "0";
		document.body.appendChild(ta);
		ta.select();
		let ok = false;
		try {
			ok = document.execCommand("copy");
		} catch {
			ok = false;
		}
		document.body.removeChild(ta);
		return ok;
	}
}

function download(name, text, type = "application/json") {
	const url = URL.createObjectURL(new Blob([text], { type }));
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

const Btn = ({ children, onClick, primary, disabled }) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className={`font-bengali text-xs font-semibold rounded-lg px-3.5 py-2 disabled:opacity-40 ${primary ? "bg-shu text-washi hover:brightness-110" : "border border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-shu/60"}`}
	>
		{children}
	</button>
);

const Step = ({ n, title, children }) => (
	<li className="flex gap-3">
		<span className="shrink-0 w-6 h-6 rounded-full bg-shu text-washi font-mono text-xs font-bold flex items-center justify-center mt-0.5">{n}</span>
		<div className="min-w-0 flex-1">
			<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{title}</div>
			<div className="mt-1.5 space-y-2">{children}</div>
		</div>
	</li>
);

// "AI question papers": get the demo + prompt, hand them to an AI, import the
// JSON it returns, then pick a paper to sit. Papers live in the library.
export default function PaperLibrary({ lang, library, selectedId, onSelect }) {
	const M = (k, v) => mt(lang, k, v);
	const [pl, setPl] = useState("n5");
	const [theme, setTheme] = useState("");
	const [showPrompt, setShowPrompt] = useState(false);
	const [paste, setPaste] = useState("");
	const [showPaste, setShowPaste] = useState(false);
	const [copied, setCopied] = useState("");
	const [note, setNote] = useState(null); // { ok, text, errors? }
	const [confirmDel, setConfirmDel] = useState(null);
	const fileRef = useRef(null);
	const prompt = buildPrompt({ level: pl, theme: theme.trim() });

	const flash = (k) => {
		setCopied(k);
		setTimeout(() => setCopied(""), 1800);
	};

	const importTexts = (items) => {
		const good = [];
		const bad = [];
		for (const { name, text } of items) {
			try {
				const r = validatePaper(parsePaperText(text));
				if (r.ok) good.push({ paper: r.paper, count: paperCount(r.paper), name, warnings: r.warnings });
				else bad.push({ name, errors: r.errors });
			} catch (e) {
				bad.push({ name, errors: [`Not valid JSON (${e.message}). Ask the AI to return only the JSON object.`] });
			}
		}
		let msg = null;
		if (good.length) {
			const res = library.add(good);
			if (res.full) msg = { ok: false, text: M("storageFull"), errors: [] };
			else {
				msg = { ok: true, text: M("importedN", { n: good.length }), warnings: good.flatMap((g) => g.warnings).slice(0, 4) };
				onSelect(res.ids[0]);
			}
		}
		if (bad.length) {
			const errors = bad.flatMap((b) => (items.length > 1 ? b.errors.map((e) => `${b.name}: ${e}`) : b.errors));
			msg = { ok: false, text: M("importFailed"), errors: errors.slice(0, 10), more: Math.max(0, errors.length - 10), prior: msg };
		}
		setNote(msg);
	};

	const onFiles = async (e) => {
		const files = [...(e.target.files || [])];
		e.target.value = "";
		if (!files.length) return;
		importTexts(await Promise.all(files.map(async (f) => ({ name: f.name, text: await f.text() }))));
	};

	return (
		<section className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5">
			<div className="flex items-start gap-3 mb-4">
				<div className="min-w-0">
					<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{M("aiTitle")}</h3>
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-1 leading-relaxed">{M("aiSub")}</p>
				</div>
			</div>

			<ol className="space-y-4">
				<Step n="1" title={M("aiStep1")}>
					<Btn onClick={() => download("demo-paper.json", JSON.stringify(DEMO_PAPER, null, 2))}>⬇ {M("downloadDemo")}</Btn>
				</Step>
				<Step n="2" title={M("aiStep2")}>
					<div className="flex flex-wrap items-center gap-2">
						<div className="inline-flex rounded-full border border-ai-line dark:border-night-line overflow-hidden bg-washi dark:bg-night">
							{["n5", "n4"].map((k) => (
								<button key={k} type="button" aria-pressed={pl === k} onClick={() => setPl(k)} className={`px-3.5 py-1.5 text-xs font-semibold ${pl === k ? "bg-shu text-washi" : "text-ink-muted dark:text-night-ink-muted"}`}>{k.toUpperCase()}</button>
							))}
						</div>
						<input
							value={theme}
							onChange={(e) => setTheme(e.target.value)}
							placeholder={M("themePlaceholder")}
							className="font-bengali flex-1 min-w-[10rem] border border-ai-line dark:border-night-line rounded-md px-3 py-1.5 text-xs bg-paper dark:bg-night-paper text-ink dark:text-night-ink"
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						<Btn primary onClick={async () => flash((await copyText(prompt)) ? "prompt" : "fail")}>{copied === "prompt" ? `✓ ${M("copied")}` : copied === "fail" ? M("copyFailed") : `⧉ ${M("copyPrompt")}`}</Btn>
						<Btn onClick={() => setShowPrompt((v) => !v)}>{showPrompt ? M("hidePrompt") : M("showPrompt")}</Btn>
					</div>
					{showPrompt && <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night p-3 font-mono text-[11px] leading-relaxed text-ink dark:text-night-ink">{prompt}</pre>}
				</Step>
				<Step n="3" title={M("aiStep3")}>
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted leading-relaxed">{M("aiStep3Sub")}</p>
				</Step>
				<Step n="4" title={M("aiStep4")}>
					<div className="flex flex-wrap gap-2">
						<Btn primary onClick={() => fileRef.current?.click()}>⬆ {M("uploadJson")}</Btn>
						<Btn onClick={() => setShowPaste((v) => !v)}>{M("pasteJson")}</Btn>
						<input ref={fileRef} type="file" accept=".json,application/json,text/plain" multiple onChange={onFiles} className="hidden" />
					</div>
					{showPaste && (
						<div className="space-y-2">
							<textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={5} placeholder={M("pasteHint")} className="w-full font-mono text-[11px] border border-ai-line dark:border-night-line rounded-lg p-2.5 bg-paper dark:bg-night-paper text-ink dark:text-night-ink" />
							<Btn primary disabled={!paste.trim()} onClick={() => { importTexts([{ name: "pasted", text: paste }]); setPaste(""); }}>{M("addPaper")}</Btn>
						</div>
					)}
				</Step>
			</ol>

			{note && (
				<div className={`mt-4 rounded-lg border px-3.5 py-3 ${note.ok ? "border-take dark:border-take-glow bg-take-soft dark:bg-take/10" : "border-danger dark:border-danger-glow bg-danger-soft dark:bg-danger/10"}`} role="status">
					{note.prior && <p className="font-bengali text-xs font-semibold text-take dark:text-take-glow mb-1">✓ {note.prior.text}</p>}
					<p className="font-bengali text-xs font-semibold text-ink dark:text-night-ink">{note.ok ? "✓ " : "✗ "}{note.text}</p>
					{note.warnings?.length > 0 && <ul className="mt-1 list-disc pl-4 font-mono text-[11px] text-ink-muted dark:text-night-ink-muted">{note.warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
					{note.errors?.length > 0 && (
						<>
							<ul className="mt-1.5 list-disc pl-4 font-mono text-[11px] text-ink dark:text-night-ink space-y-0.5">{note.errors.map((e) => <li key={e}>{e}</li>)}</ul>
							{note.more > 0 && <p className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted mt-1">+{note.more} …</p>}
							<div className="mt-2"><Btn onClick={async () => flash((await copyText(fixRequest(note.errors))) ? "fix" : "fail")}>{copied === "fix" ? `✓ ${M("copied")}` : M("copyFix")}</Btn></div>
						</>
					)}
				</div>
			)}

			<div className="mt-5 pt-4 border-t border-ai-line dark:border-night-line">
				<h4 className="font-bengali text-xs font-bold text-ink dark:text-night-ink mb-2">{M("yourPapers")} ({library.papers.length})</h4>
				{library.papers.length === 0 ? (
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">{M("noPapers")}</p>
				) : (
					<ul className="divide-y divide-ai-line dark:divide-night-line">
						{library.papers.map((p) => (
							<li key={p.id} className="py-2 flex items-center gap-2.5">
								<button type="button" onClick={() => onSelect(selectedId === p.id ? null : p.id)} className="flex-1 min-w-0 flex items-center gap-2.5 text-left" aria-pressed={selectedId === p.id}>
									<span className={`shrink-0 w-4 h-4 rounded-full border-2 ${selectedId === p.id ? "border-shu bg-shu ring-2 ring-shu/20" : "border-ai-line dark:border-night-line"}`} />
									<span className="min-w-0">
										<span className="block font-bengali text-xs font-semibold text-ink dark:text-night-ink truncate">{p.title}</span>
										<span className="block font-mono text-[10px] text-ink-muted dark:text-night-ink-muted">{p.level.toUpperCase()} · {p.count} {M("questionsShort")} · {new Date(p.addedAt).toLocaleDateString()}</span>
									</span>
								</button>
								<button type="button" onClick={() => (confirmDel === p.id ? (library.remove(p.id), setConfirmDel(null), selectedId === p.id && onSelect(null)) : setConfirmDel(p.id))} className={`shrink-0 font-bengali text-[11px] rounded-md px-2 py-1 border ${confirmDel === p.id ? "border-shu bg-shu text-washi" : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu"}`}>
									{confirmDel === p.id ? M("confirm") : "✕"}
								</button>
							</li>
						))}
					</ul>
				)}
				<p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-3 leading-relaxed">💡 {M("aiTip")}</p>
			</div>
		</section>
	);
}
