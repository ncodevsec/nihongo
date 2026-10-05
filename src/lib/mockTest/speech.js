// Listening questions are read aloud with the browser's speech synthesis
// (ja-JP). There is no recorded audio: this is a practice aid, not a replica
// of the exam's audio, and quality depends on the voices installed on the
// device. Lines look like { who: "F" | "M" | "N", text }.

export const speechAvailable = () =>
	typeof window !== "undefined" &&
	"speechSynthesis" in window &&
	typeof window.SpeechSynthesisUtterance !== "undefined";

const jaVoices = () =>
	(window.speechSynthesis.getVoices() || []).filter((v) => /^ja/i.test(v.lang));

export const hasJapaneseVoice = () => speechAvailable() && jaVoices().length > 0;

// Calls back now and again whenever the browser finishes loading its voices.
export function onVoicesChanged(cb) {
	if (!speechAvailable()) return () => {};
	cb();
	window.speechSynthesis.addEventListener?.("voiceschanged", cb);
	return () => window.speechSynthesis.removeEventListener?.("voiceschanged", cb);
}

export function stopSpeech() {
	if (speechAvailable()) window.speechSynthesis.cancel();
}

// "F:…／M:…" → [{ who, text }]; a line without a prefix is the narrator.
export function parseScript(script) {
	return String(script)
		.split("／")
		.map((s) => s.trim())
		.filter(Boolean)
		.map((s) => {
			const m = s.match(/^([FMN]):\s*(.*)$/);
			return m ? { who: m[1], text: m[2] } : { who: "N", text: s };
		});
}

// Speaks the lines one after another; returns a cancel function.
export function speakLines(lines, { rate = 0.85, onEnd } = {}) {
	if (!speechAvailable()) {
		onEnd?.();
		return () => {};
	}
	const synth = window.speechSynthesis;
	synth.cancel();
	const voice = jaVoices()[0];
	let cancelled = false;
	let i = 0;
	const next = () => {
		if (cancelled) return;
		if (i >= lines.length) {
			onEnd?.();
			return;
		}
		const { who, text } = lines[i++];
		const u = new window.SpeechSynthesisUtterance(text);
		u.lang = "ja-JP";
		if (voice) u.voice = voice;
		u.rate = rate;
		u.pitch = who === "F" ? 1.25 : who === "M" ? 0.8 : 1;
		u.onend = () => setTimeout(next, 350);
		u.onerror = () => onEnd?.();
		synth.speak(u);
	};
	next();
	return () => {
		cancelled = true;
		synth.cancel();
	};
}
