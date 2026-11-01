import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { mt } from "../../lib/mockI18n.js";
import { buildCertificateData, canvasToBlob, renderCertificate } from "../../lib/mockTest/certificate.js";

const SOCIALS = [
	{ key: "facebook", label: "Facebook", url: (u, t) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}&quote=${encodeURIComponent(t)}` },
	{ key: "x", label: "X", url: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
	{ key: "whatsapp", label: "WhatsApp", url: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}` },
	{ key: "telegram", label: "Telegram", url: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
	{ key: "linkedin", label: "LinkedIn", url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
];

// Certificate card shown on the results page after a full exam: editable name,
// live PNG preview, download, and sharing (native share sheet with the image where
// the browser allows it, plus social links that carry the app address).
export default function Certificate({ result, lang }) {
	const M = (k, v) => mt(lang, k, v);
	const { profile } = useApp();
	const [name, setName] = useState(profile?.name || "");
	const [preview, setPreview] = useState(null);
	const [busy, setBusy] = useState(true);
	const [note, setNote] = useState("");
	const blobRef = useRef(null);

	const data = useMemo(() => buildCertificateData(result), [result]);
	const siteUrl = typeof window !== "undefined" ? `${window.location.origin}/` : "";
	const dateText = useMemo(() => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), []);
	const fileName = `nihongo-certificate-${data.level.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.png`;
	const shareText = M("certShareText", { level: data.level, pct: data.total.p.toFixed(1) });

	useEffect(() => {
		let alive = true;
		let url = null;
		setBusy(true);
		const id = setTimeout(async () => {
			try {
				const canvas = await renderCertificate(data, { name, siteUrl, dateText });
				const blob = await canvasToBlob(canvas);
				if (!alive || !blob) return;
				blobRef.current = blob;
				url = URL.createObjectURL(blob);
				setPreview((old) => {
					if (old) URL.revokeObjectURL(old);
					return url;
				});
			} finally {
				if (alive) setBusy(false);
			}
		}, 350);
		return () => {
			alive = false;
			clearTimeout(id);
		};
	}, [data, name, siteUrl, dateText]);

	useEffect(() => () => preview && URL.revokeObjectURL(preview), []); // eslint-disable-line react-hooks/exhaustive-deps

	const flash = (t) => {
		setNote(t);
		setTimeout(() => setNote(""), 2500);
	};

	const download = () => {
		if (!blobRef.current) return;
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blobRef.current);
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		setTimeout(() => URL.revokeObjectURL(a.href), 1000);
	};

	const share = async () => {
		if (!blobRef.current) return;
		const file = new File([blobRef.current], fileName, { type: "image/png" });
		try {
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file], title: M("certTitle"), text: `${shareText} ${siteUrl}`, url: siteUrl });
			} else if (navigator.share) {
				await navigator.share({ title: M("certTitle"), text: shareText, url: siteUrl });
				flash(M("certAttachHint"));
			} else {
				download();
				flash(M("certAttachHint"));
			}
		} catch {
			// share sheet dismissed
		}
	};

	const openSocial = (s) => {
		download();
		window.open(s.url(siteUrl, shareText), "_blank", "noopener,noreferrer,width=640,height=560");
		flash(M("certAttachHint"));
	};

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(siteUrl);
			flash(M("copied"));
		} catch {
			flash(siteUrl);
		}
	};

	const btn = "font-bengali text-xs font-semibold rounded-lg px-3.5 py-2 disabled:opacity-40";

	return (
		<section className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5">
			<h3 className="font-bengali text-sm font-bold text-ink dark:text-night-ink">{M("certTitle")}</h3>
			<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted mt-1 leading-relaxed">{M("certSub")}</p>

			<label className="block mt-3">
				<span className="font-bengali text-[11px] font-semibold text-ink-muted dark:text-night-ink-muted">{M("certName")}</span>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					maxLength={60}
					placeholder={M("certNamePh")}
					className="mt-1 w-full font-bengali text-sm rounded-md border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2.5 text-ink dark:text-night-ink placeholder:text-ink-muted/60"
				/>
			</label>

			<div className="mt-3 rounded-lg border border-ai-line dark:border-night-line bg-washi dark:bg-night overflow-hidden" style={{ aspectRatio: "297 / 210" }}>
				{preview ? (
					<img src={preview} alt={M("certTitle")} className={`w-full h-full object-contain ${busy ? "opacity-60" : ""}`} />
				) : (
					<div className="w-full h-full flex items-center justify-center font-bengali text-xs text-ink-muted dark:text-night-ink-muted">{M("certMaking")}</div>
				)}
			</div>

			<div className="flex flex-wrap gap-2 mt-3">
				<button type="button" onClick={download} disabled={busy || !preview} className={`${btn} bg-shu text-washi hover:brightness-110`}>⬇ {M("certDownload")}</button>
				<button type="button" onClick={share} disabled={busy || !preview} className={`${btn} border border-shu/40 text-shu dark:text-shu-glow hover:bg-shu-soft dark:hover:bg-night`}>↗ {M("certShare")}</button>
			</div>

			<div className="mt-3 pt-3 border-t border-ai-line dark:border-night-line">
				<div className="font-bengali text-[11px] font-semibold text-ink-muted dark:text-night-ink-muted mb-2">{M("certShareOn")}</div>
				<div className="flex flex-wrap gap-2">
					{SOCIALS.map((s) => (
						<button key={s.key} type="button" disabled={busy || !preview} onClick={() => openSocial(s)} className={`${btn} border border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-shu/60`}>{s.label}</button>
					))}
					<button type="button" onClick={copyLink} className={`${btn} border border-ai-line dark:border-night-line text-ink dark:text-night-ink hover:border-shu/60`}>⧉ {M("certCopyLink")}</button>
				</div>
				<p className="font-mono text-[11px] text-ink-muted dark:text-night-ink-muted mt-2 break-all">{siteUrl}</p>
				{note && <p role="status" className="font-bengali text-[11px] text-shu dark:text-shu-glow mt-1.5">{note}</p>}
			</div>
		</section>
	);
}
