import { useApp } from "../context/AppContext.jsx";
import Settings from "../components/Settings.jsx";

// /settings — settings, backup, app update, reset.
export default function SettingsPage() {
	const a = useApp();
	return (
		<Settings
			settings={a.settings}
			updateSetting={a.updateSetting}
			resetSettings={a.resetSettings}
			resetAllProgress={() => a.resetProgress()}
			updateAvailable={a.updateAvailable}
			checkingForUpdate={a.checking}
			lastCheckedAt={a.lastCheckedAt}
			onCheckForUpdate={a.checkForUpdate}
			onApplyUpdate={a.applyUpdate}
		/>
	);
}
