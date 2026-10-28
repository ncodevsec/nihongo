import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { PROFILE_DEFAULTS } from "../hooks/useProfile.js";
import { t } from "../lib/i18n.js";

const inputCls =
	"mt-1 w-full font-bengali text-sm rounded-md border border-ai-line dark:border-night-line bg-washi dark:bg-night px-3 py-2.5 text-ink dark:text-night-ink placeholder:text-ink-muted/60";

function Field({ label, children }) {
	return (
		<label className="block">
			<span className="font-bengali text-[11px] font-semibold text-ink-muted dark:text-night-ink-muted">{label}</span>
			{children}
		</label>
	);
}

// /profile — the learner's personal information (stored on this device only).
export default function ProfilePage() {
	const { settings, profile, saveProfile, clearProfile } = useApp();
	const T = (k) => t(settings.uiLang, k);
	const [form, setForm] = useState(profile);
	const [saved, setSaved] = useState(false);
	const [confirmClear, setConfirmClear] = useState(false);
	const set = (key) => (e) => {
		setForm((f) => ({ ...f, [key]: e.target.value }));
		setSaved(false);
	};
	const initial = (form.name || "?").trim().charAt(0).toUpperCase();
	const dirty = JSON.stringify(form) !== JSON.stringify(profile);

	const onSave = () => {
		saveProfile({ ...form, name: form.name.trim() });
		setSaved(true);
	};
	const onClear = () => {
		if (!confirmClear) return setConfirmClear(true);
		clearProfile();
		setForm(PROFILE_DEFAULTS);
		setConfirmClear(false);
		setSaved(false);
	};

	return (
		<div className="max-w-2xl mx-auto space-y-5">
			<div className="flex items-center gap-4 rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5">
				<span className="shrink-0 w-16 h-16 rounded-full bg-shu text-washi flex items-center justify-center font-mincho text-3xl font-bold">
					{initial}
				</span>
				<div className="min-w-0">
					<h2 className="font-bengali text-lg font-bold text-ink dark:text-night-ink truncate">
						{profile.name || T("profileTitle")}
					</h2>
					<p className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">{T("profileSub")}</p>
				</div>
			</div>

			<section className="rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none p-4 sm:p-5 space-y-4">
				<Field label={T("profileName")}>
					<input className={inputCls} value={form.name} onChange={set("name")} placeholder={T("profileNamePh")} autoComplete="name" />
				</Field>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field label={T("profileEmail")}>
						<input type="email" className={inputCls} value={form.email} onChange={set("email")} autoComplete="email" />
					</Field>
					<Field label={T("profilePhone")}>
						<input type="tel" className={inputCls} value={form.phone} onChange={set("phone")} autoComplete="tel" />
					</Field>
					<Field label={T("profileBirth")}>
						<input type="date" className={inputCls} value={form.birthDate} onChange={set("birthDate")} />
					</Field>
					<Field label={T("profileCountry")}>
						<input className={inputCls} value={form.country} onChange={set("country")} autoComplete="country-name" />
					</Field>
					<Field label={T("profileNative")}>
						<input className={inputCls} value={form.nativeLanguage} onChange={set("nativeLanguage")} />
					</Field>
					<Field label={T("profileTarget")}>
						<select className={inputCls} value={form.targetLevel} onChange={set("targetLevel")}>
							<option value="">—</option>
							<option value="N5">JLPT N5</option>
							<option value="N4">JLPT N4</option>
							<option value="NAT">NAT</option>
						</select>
					</Field>
				</div>
				<Field label={T("profileGoal")}>
					<input className={inputCls} value={form.goal} onChange={set("goal")} placeholder={T("profileGoalPh")} />
				</Field>
				<Field label={T("profileAbout")}>
					<textarea className={`${inputCls} min-h-[88px] resize-y`} value={form.about} onChange={set("about")} />
				</Field>

				<div className="flex flex-wrap items-center gap-2 pt-1">
					<button
						type="button"
						onClick={onSave}
						disabled={!dirty}
						className="rounded-lg bg-shu px-5 py-2.5 font-bengali text-sm font-semibold text-washi disabled:opacity-40"
					>
						{T("profileSave")}
					</button>
					{saved && !dirty && <span className="font-bengali text-xs text-take dark:text-take-glow">✓ {T("profileSaved")}</span>}
					<button
						type="button"
						onClick={onClear}
						className={`ml-auto rounded-md border px-3 py-2 font-bengali text-xs ${
							confirmClear ? "border-shu bg-shu text-washi" : "border-ai-line dark:border-night-line text-ink-muted dark:text-night-ink-muted hover:text-shu"
						}`}
					>
						{confirmClear ? T("confirmButton") : T("profileClear")}
					</button>
				</div>
				<p className="font-bengali text-[11px] text-ink-muted dark:text-night-ink-muted">{T("profilePrivacy")}</p>
			</section>

			<Link
				to="/settings"
				className="flex items-center justify-between rounded-xl border border-ai-line dark:border-night-line bg-paper dark:bg-night-paper shadow-card dark:shadow-none px-4 py-3.5 hover:border-shu/50"
			>
				<span className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{T("tabSettings")}</span>
				<span className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">{T("profileSettingsSub")} →</span>
			</Link>
		</div>
	);
}
