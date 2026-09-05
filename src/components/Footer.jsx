import { MODULES } from "../data/modules.js";
import { t, pickLang } from "../lib/i18n.js";

export default function Footer({
	settings,
	moduleKey = "vocabulary",
	level = "n5",
}) {
	const lang = settings.uiLang;
	const T = (k) => t(lang, k);
	const mod = MODULES[moduleKey] ?? MODULES.vocabulary;

	return (
		<footer className="border-t border-ai-line dark:border-night-line mt-8 bg-paper dark:bg-night-paper">
			<div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-10 py-8 flex flex-col items-center gap-4">
				<div className="flex items-center gap-2.5">
					<img
						src="./icons/logo-mark-96.png"
						alt="NihonGo"
						className="w-7 h-7"
						width={28}
						height={28}
					/>
					<span className="font-semibold text-base text-ink dark:text-night-ink">
						NihonGo - Study Lab
					</span>
				</div>
				<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted text-center max-w-xs">
					{t(lang, "appSubtitle")}
				</p>

				<div className="flex items-center gap-2.5">
					<a
						href="https://www.linkedin.com/in/ncodevsec"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn"
						title="LinkedIn"
						className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow"
					>
						<svg
							viewBox="0 0 24 24"
							className="w-4 h-4"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
						</svg>
					</a>
					<a
						href="https://www.facebook.com/nihongo.study.lab"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
						title="Facebook"
						className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow"
					>
						<svg
							viewBox="0 0 24 24"
							className="w-4 h-4"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M13.5 21v-8.06h2.7l.4-3.14h-3.1V7.87c0-.91.25-1.53 1.56-1.53h1.67V3.53C15.94 3.36 15.02 3.27 14.1 3.27c-2.4 0-4.05 1.47-4.05 4.16v2.37H7.34v3.14h2.71V21h3.45z" />
						</svg>
					</a>
					<a
						href="https://whatsapp.com/channel/0029VbCy4euL7UVPzJNCxJ2w"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Whatsapp"
						title="Whatsapp"
						className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow"
					>
						<svg
							viewBox="0 0 24 24"
							className="w-4 h-4"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.56 0 .25 5.31.25 11.84c0 2.09.55 4.13 1.6 5.93L.15 24l6.38-1.67a11.84 11.84 0 0 0 5.55 1.41h.01c6.52 0 11.83-5.31 11.83-11.84 0-3.17-1.23-6.14-3.4-8.42zM12.09 21.8h-.01a9.94 9.94 0 0 1-5.07-1.39l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.91 9.91 0 0 1-1.52-5.28C2.12 6.35 6.59 1.88 12.09 1.88c2.66 0 5.16 1.04 7.04 2.92a9.89 9.89 0 0 1 2.91 7.05c0 5.5-4.47 9.95-9.95 9.95zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.89-.79-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
						</svg>
					</a>
					<a
						href="https://t.me/nihongo_study_lab"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Telegram"
						title="Telegram"
						className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow"
					>
						<svg
							viewBox="0 0 24 24"
							className="w-4 h-4"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M21.5 4.5L2.75 11.9c-1.28.51-1.27 1.22-.24 1.53l4.8 1.5 1.85 5.66c.23.62.12.87.78.87.5 0 .72-.23 1-.5l2.4-2.32 4.98 3.68c.92.5 1.58.25 1.81-.85l3.27-15.4c.34-1.35-.5-1.96-1.65-1.57z" />
						</svg>
					</a>
					<a
						href="https://x.com/nihongo.study.lab"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="X (Twitter)"
						title="X (Twitter)"
						className="w-9 h-9 flex items-center justify-center rounded-full border border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu hover:border-shu/50 dark:hover:text-shu-glow"
					>
						<svg
							viewBox="0 0 24 24"
							className="w-4 h-4"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M13.6 10.4L20.2 3h-1.6l-5.7 6.4L8.3 3H3l6.9 9.8L3.3 21h1.6l6.1-6.8L15.9 21H21l-7.4-10.6zm-2.2 2.5l-.7-1L5.1 4.2h2.4l4.5 6.3.7 1 5.9 8.2h-2.4l-4.8-6.7z" />
						</svg>
					</a>
				</div>
			</div>

			<div className="border-t border-ai-line dark:border-night-line">
				<div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] font-bengali text-ink-muted dark:text-night-ink-muted">
					<span>
						NihonGo — {pickLang(mod, lang)} ({level.toUpperCase()}){" "}
						{T("footerFor")}
					</span>
					<span className="font-mono">{T("footerStorage")}</span>
				</div>
			</div>
		</footer>
	);
}
