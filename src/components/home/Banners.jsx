import Icon from "./icons.jsx";

function Banner({ icon, title, sub, actionLabel, onAction }) {
	return (
		<div className="flex flex-wrap items-center gap-3 rounded-lg border border-shu/30 dark:border-shu-glow/30 bg-shu-soft dark:bg-night-paper px-4 py-3">
			<span className="shrink-0 w-9 h-9 rounded-full bg-paper dark:bg-night flex items-center justify-center text-shu dark:text-shu-glow">
				<Icon name={icon} className="w-4 h-4" />
			</span>
			<div className="min-w-0 flex-1 basis-48">
				<div className="font-bengali text-sm font-semibold text-ink dark:text-night-ink">{title}</div>
				{sub && (
					<div className="font-bengali text-xs text-ink-muted dark:text-night-ink-muted">{sub}</div>
				)}
			</div>
			<button
				type="button"
				onClick={onAction}
				className="shrink-0 rounded-md bg-shu px-3.5 py-1.5 font-bengali text-xs font-semibold text-washi hover:brightness-110"
			>
				{actionLabel}
			</button>
		</div>
	);
}

// Only rendered when there is something to act on: a new deploy is waiting,
// or the browser is offering to install the app.
export default function Banners({ T, updateAvailable, canInstall, onOpenSettings, onInstall }) {
	if (!updateAvailable && !canInstall) return null;
	return (
		<div className="space-y-3">
			{updateAvailable && (
				<Banner
					icon="refresh"
					title={T("homeUpdateBanner")}
					actionLabel={T("homeUpdateBtn")}
					onAction={onOpenSettings}
				/>
			)}
			{canInstall && (
				<Banner
					icon="download"
					title={T("homeInstallTitle")}
					sub={T("homeInstallSub")}
					actionLabel={T("homeInstallBtn")}
					onAction={onInstall}
				/>
			)}
		</div>
	);
}
