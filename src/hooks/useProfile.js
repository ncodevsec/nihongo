import { useCallback, useState } from "react";

// Personal information, stored only in this browser (localStorage), same as progress/settings.
const STORAGE_KEY = "nihongo-profile-v1";

export const PROFILE_DEFAULTS = {
	name: "",
	email: "",
	phone: "",
	birthDate: "",
	country: "",
	nativeLanguage: "",
	targetLevel: "",
	goal: "",
	about: "",
};

function load() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? { ...PROFILE_DEFAULTS, ...JSON.parse(raw) } : PROFILE_DEFAULTS;
	} catch {
		return PROFILE_DEFAULTS;
	}
}

export function useProfile() {
	const [profile, setProfile] = useState(load);

	const saveProfile = useCallback((next) => {
		const clean = { ...PROFILE_DEFAULTS, ...next };
		setProfile(clean);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
		} catch {
			// storage unavailable — stays in memory for this session
		}
	}, []);

	const clearProfile = useCallback(() => {
		setProfile(PROFILE_DEFAULTS);
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {
			// ignore
		}
	}, []);

	return { profile, saveProfile, clearProfile };
}
