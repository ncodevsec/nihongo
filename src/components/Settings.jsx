import { useRef, useState } from "react";
import { t } from "../lib/i18n.js";

const DATA_KEYS = [
	"nihongo-settings-v1",
	"nihongo-progress-v2",
	"nihongo-activity-v1",
	"nihongo-favorites-v1",
];

function Toggle({ checked, onChange }) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			onClick={() => onChange(!checked)}
			className={`tap-quiet w-11 h-6 shrink-0 rounded-full relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu ${
				checked
					? "bg-shu dark:bg-shu-glow"
					: "bg-ai-line dark:bg-night-line"
			}`}
		>
			<span
				className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-150 ${
					checked ? "translate-x-5" : "translate-x-0"
				}`}
			/>
		</button>
	);
}

function Row({ title, subtitle, children }) {
	return (
		<div className="flex items-center justify-between gap-3 px-4 py-3">
			<div className="min-w-0 pr-2">
				<div className="font-bengali text-sm text-ink dark:text-night-ink">
					{title}
				</div>
				{subtitle && (
					<div className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted mt-0.5">
						{subtitle}
					</div>
				)}
			</div>
			<div className="shrink-0 flex items-center">{children}</div>
		</div>
	);
}

export default function Settings({
	settings,
	updateSetting,
	resetSettings,
	resetAllProgress,
}) {
	const lang = settings.uiLang;
	const T = (k) => t(lang, k);

	const [confirmReset, setConfirmReset] = useState(false);
	const [confirmSettingsReset, setConfirmSettingsReset] = useState(false);
	const [importStatus, setImportStatus] = useState(null); // null | "success" | "error"
	const fileInputRef = useRef(null);

	const THEME_OPTIONS = [
		{ key: "light", label: T("themeLight") },
		{ key: "dark", label: T("themeDark") },
		{ key: "system", label: T("themeSystem") },
	];

	const SectionLabel = ({ children }) => (
		<h2 className="font-bengali text-xs font-bold text-shu dark:text-shu-glow uppercase tracking-wide mb-2 mt-6 first:mt-0">
			{children}
		</h2>
	);

	const activePillClass =
		"bg-shu text-washi dark:bg-shu-glow dark:text-white";
	const inactivePillClass =
		"bg-paper dark:bg-night-paper text-ink-muted dark:text-night-ink-muted hover:bg-shu-soft dark:hover:bg-night-line";

	const handleResetProgress = () => {
		if (!confirmReset) {
			setConfirmReset(true);
			return;
		}
		resetAllProgress();
		setConfirmReset(false);
	};

	const handleResetSettings = () => {
		if (!confirmSettingsReset) {
			setConfirmSettingsReset(true);
			return;
		}
		resetSettings();
		setConfirmSettingsReset(false);
	};

	const handleExport = () => {
		const payload = {};
		for (const key of DATA_KEYS) {
			const raw = localStorage.getItem(key);
			if (raw != null) {
				try {
					payload[key] = JSON.parse(raw);
				} catch {
					payload[key] = raw;
				}
			}
		}
		const blob = new Blob([JSON.stringify(payload, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		const date = new Date().toISOString().slice(0, 10);
		a.href = url;
		a.download = `nihongo-backup-${date}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleImportClick = () => {
		setImportStatus(null);
		fileInputRef.current?.click();
	};

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const data = JSON.parse(reader.result);
				let wroteAny = false;
				for (const key of DATA_KEYS) {
					if (key in data) {
						localStorage.setItem(key, JSON.stringify(data[key]));
						wroteAny = true;
					}
				}
				if (!wroteAny) throw new Error("no recognized keys");
				setImportStatus("success");
				setTimeout(() => window.location.reload(), 900);
			} catch {
				setImportStatus("error");
			}
		};
		reader.onerror = () => setImportStatus("error");
		reader.readAsText(file);
		e.target.value = "";
	};

	return (
		<div className="max-w-2xl mx-auto">
			<SectionLabel>{T("sectionTheme")}</SectionLabel>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none overflow-hidden">
				<Row title={T("appTheme")} subtitle={T("appThemeSub")}>
					<div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden shrink-0">
						{THEME_OPTIONS.map((th) => (
							<button
								key={th.key}
								onClick={() => updateSetting("theme", th.key)}
								className={`px-2.5 py-1.5 text-[11px] font-bengali font-medium ${
									settings.theme === th.key
										? activePillClass
										: inactivePillClass
								}`}
							>
								{th.label}
							</button>
						))}
					</div>
				</Row>
			</div>

			<SectionLabel>{T("sectionLanguage")}</SectionLabel>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none overflow-hidden">
				<Row title={T("siteLanguage")} subtitle={T("siteLanguageSub")}>
					<div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden shrink-0">
						{[
							{ key: "bn", label: t("bn", "langBangla") },
							{ key: "en", label: t("en", "langEnglish") },
						].map((l) => (
							<button
								key={l.key}
								onClick={() => updateSetting("uiLang", l.key)}
								className={`px-3 py-1.5 text-[11px] font-medium ${
									settings.uiLang === l.key
										? activePillClass
										: inactivePillClass
								}`}
							>
								{l.label}
							</button>
						))}
					</div>
				</Row>
			</div>

			<SectionLabel>{T("sectionVocab")}</SectionLabel>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none overflow-hidden divide-y divide-ai-line dark:divide-night-line">
				<Row
					title={T("showVocabKanji")}
					subtitle={T("showVocabKanjiSub")}
				>
					<Toggle
						checked={settings.showVocabKanji}
						onChange={(v) => updateSetting("showVocabKanji", v)}
					/>
				</Row>
				<Row
					title={T("meaningLanguage")}
					subtitle={T("meaningLanguageSub")}
				>
					<div className="flex rounded-md border border-ai-line dark:border-night-line overflow-hidden shrink-0">
						{[
							{ key: "bn", label: T("langBangla") },
							{ key: "en", label: T("langEnglish") },
						].map((l) => (
							<button
								key={l.key}
								onClick={() =>
									updateSetting("vocabLang", l.key)
								}
								className={`px-3 py-1.5 text-[11px] font-medium ${
									settings.vocabLang === l.key
										? activePillClass
										: inactivePillClass
								}`}
							>
								{l.label}
							</button>
						))}
					</div>
				</Row>
			</div>

			<SectionLabel>{T("sectionKanji")}</SectionLabel>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none overflow-hidden divide-y divide-ai-line dark:divide-night-line">
				<Row
					title={T("showBnMeaning")}
					subtitle={T("showBnMeaningSub")}
				>
					<Toggle
						checked={settings.showKanjiBn}
						onChange={(v) => updateSetting("showKanjiBn", v)}
					/>
				</Row>
				<Row title={T("showJukugo")} subtitle={T("showJukugoSub")}>
					<Toggle
						checked={settings.showJukugo}
						onChange={(v) => updateSetting("showJukugo", v)}
					/>
				</Row>
			</div>

			<SectionLabel>{T("sectionData")}</SectionLabel>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none overflow-hidden divide-y divide-ai-line dark:divide-night-line">
				<Row title={T("exportDataLabel")} subtitle={T("exportDataSub")}>
					<button
						onClick={handleExport}
						className="font-bengali text-xs rounded-md px-3 py-1.5 border border-ai-line dark:border-night-line text-shu dark:text-shu-glow hover:bg-shu-soft dark:hover:bg-shu/10 shrink-0"
					>
						{T("exportDataButton")}
					</button>
				</Row>
				<Row title={T("importDataLabel")} subtitle={T("importDataSub")}>
					<div className="flex items-center gap-2">
						{importStatus === "success" && (
							<span className="font-bengali text-[11px] text-take dark:text-take-glow">
								{T("importSuccess")}
							</span>
						)}
						{importStatus === "error" && (
							<span className="font-bengali text-[11px] text-shu dark:text-shu-glow">
								{T("importError")}
							</span>
						)}
						<button
							onClick={handleImportClick}
							className="font-bengali text-xs rounded-md px-3 py-1.5 border border-ai-line dark:border-night-line text-shu dark:text-shu-glow hover:bg-shu-soft dark:hover:bg-shu/10 shrink-0"
						>
							{T("importDataButton")}
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="application/json"
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>
				</Row>
			</div>

			<SectionLabel>{T("sectionReset")}</SectionLabel>
			<div className="bg-paper dark:bg-night-paper border border-ai-line dark:border-night-line rounded-lg shadow-card dark:shadow-none overflow-hidden divide-y divide-ai-line dark:divide-night-line mb-8">
				<Row title={T("resetSettingsLabel")}>
					<button
						onClick={handleResetSettings}
						className={`font-bengali text-xs rounded-md px-3 py-1.5 border shrink-0 min-w-[7.5rem] text-center ${
							confirmSettingsReset
								? "border-shu bg-shu text-washi"
								: "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-shu hover:text-shu"
						}`}
					>
						{confirmSettingsReset
							? T("confirmButton")
							: T("resetButton")}
					</button>
				</Row>
				<Row
					title={T("resetAllProgressLabel")}
					subtitle={T("resetAllProgressSub")}
				>
					<button
						onClick={handleResetProgress}
						className={`font-bengali text-xs rounded-md px-3 py-1.5 border shrink-0 min-w-[7.5rem] text-center ${
							confirmReset
								? "border-shu bg-shu text-washi"
								: "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:border-shu hover:text-shu"
						}`}
					>
						{confirmReset ? T("confirmButton") : T("deleteButton")}
					</button>
				</Row>
			</div>
		</div>
	);
}
