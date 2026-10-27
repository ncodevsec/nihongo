import { useApp } from "../context/AppContext.jsx";
import MockTest from "../components/mock/MockTest.jsx";

// /mock-test — exam sessions persist in useMockStore, so unmounting is safe.
export default function MockPage() {
	const { settings, selection, launch } = useApp();
	return <MockTest settings={settings} level={selection.level} onLaunch={launch} isActive />;
}
