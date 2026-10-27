import { useApp } from "../context/AppContext.jsx";
import Home from "../components/home/Home.jsx";

export default function HomePage() {
	const a = useApp();
	return (
		<Home
			settings={a.settings}
			updateSetting={a.updateSetting}
			progress={a.progress}
			activity={a.activity}
			timeToday={a.todaySeconds}
			lastSession={a.lastSession}
			updateAvailable={a.updateAvailable}
			onLaunch={a.launch}
			onOpenSettings={() => a.go("settings")}
			isActive
		/>
	);
}
