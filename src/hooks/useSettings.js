import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nihongo-settings-v1";

const DEFAULTS = {
  theme: "system", // 'light' | 'dark' | 'system'
  uiLang: "en", // 'bn' | 'en' — site-wide interface language
  showKanjiBn: true, // show Bengali meaning in the Kanji module
  showVocabKanji: false, // show kanji script in the Vocabulary module
  vocabLang: "bn", // 'bn' | 'en' — language for vocabulary meanings
  quizLength: "all", // 'all' | 10 | 20 | 50
  timedQuiz: false,
  timedMinutes: 10,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark" || (theme === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", isDark);
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    applyTheme(settings.theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore — settings just won't persist
    }
  }, [settings]);

  useEffect(() => {
    if (settings.theme !== "system" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.theme]);

  const updateSetting = useCallback((key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULTS), []);

  return { settings, updateSetting, resetSettings };
}
