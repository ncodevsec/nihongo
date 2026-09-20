import { useCallback, useEffect, useState } from "react";

// Wraps the browser's "install this app" prompt (Chrome/Edge/Android).
// `canInstall` is only true when the browser actually offers installation,
// so Home shows the Install card only where it can work.
export function useInstallPrompt() {
	const [deferred, setDeferred] = useState(null);

	useEffect(() => {
		const onPrompt = (e) => {
			e.preventDefault();
			setDeferred(e);
		};
		const onInstalled = () => setDeferred(null);
		window.addEventListener("beforeinstallprompt", onPrompt);
		window.addEventListener("appinstalled", onInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onPrompt);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);

	const promptInstall = useCallback(async () => {
		if (!deferred) return;
		deferred.prompt();
		try {
			await deferred.userChoice;
		} finally {
			setDeferred(null);
		}
	}, [deferred]);

	return { canInstall: !!deferred, promptInstall };
}
