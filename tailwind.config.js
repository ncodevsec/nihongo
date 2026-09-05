/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Light mode base ----
        // A soft, warm paper tone rather than stark white — reduces glare
        // during long study sessions. Text is a warm near-black (never
        // pure #000) so contrast stays high without the harshness of true
        // black-on-white.
        washi: "#faf7f2",
        paper: "#fffdfb",
        ink: "#2e2b27",
        "ink-muted": "#726c62",

        // The entire palette below is generated from a single hue (0°) —
        // the exact pure red (#FF0000) sampled from the app's own logo —
        // by systematically varying only saturation/lightness per role.
        // This is what keeps every red-family accent across the app
        // (buttons, borders, dark-mode text, tints) feeling like one
        // deliberate, cohesive brand color rather than several
        // independently-picked reds.

        // "ai" — a deeper, more restrained shade of the brand hue, used
        // for structural/secondary accents (Level selector, dropdown
        // focus, progress fills) so it reads as distinct from "shu"
        // (below) while clearly staying in the same color family.
        ai: "#862727",
        "ai-soft": "#faefef",
        "ai-line": "#ebe0e0",
        // Dark-mode-only text/border/fill variant of "ai" — lifted in
        // lightness so it stays crisp against the dark background instead
        // of reading as washed-out.
        "ai-glow": "#ff5454",

        // "shu" — the primary brand red, a direct professional-strength
        // derivation of the logo's pure red (same hue, tuned saturation/
        // lightness for legible UI use). Used for primary buttons, the
        // module selector, active nav states, and "wrong answer" states.
        shu: "#bd2828",
        "shu-soft": "#fbeeee",
        // "shu-glow": "#e56c6c",
        "shu-glow": "#ff3434",

        // Cherry-blossom pink — same hue again, pushed toward high
        // lightness for a soft decorative accent (example panels, chips).
        // "sakura-deep" is the light-mode text variant (dark enough for
        // contrast); "sakura" itself doubles as the dark-mode text
        // variant (lighter, for legibility at night).
        sakura: "#e48b8b",
        "sakura-soft": "#faefef",
        "sakura-line": "#efdcdc",
        "sakura-deep": "#9b3b3b",

        // Muted sage green for "correct/mastered" states — the one
        // deliberately different hue in the palette, since it's a
        // semantic (not brand) signal and needs to read as green
        // regardless of the red brand color.
        take: "#5b7a5a",
        "take-soft": "#eef3ec",
        "take-glow": "#78c96c",

        // Star/favorite color matches the primary brand red.
        kin: "#bd2828",

        // ---- Dark mode surfaces ----
        // True neutral black/gray — deliberately NOT tinted with the brand
        // hue. Earlier versions carried a faint red undertone into the
        // background/surfaces/borders, which softened the whole theme into
        // a muddy "reddish-brown" look. Keeping surfaces strictly neutral
        // (black → dark gray → mid gray) is what makes the red accents
        // (buttons, active states, headings) actually pop with real
        // contrast — the same "black canvas, red highlights" approach
        // ChatGPT and X use for their dark themes.
        night: "#000000",
        "night-paper": "#151515",
        "night-line": "#2a2a2a",
        "night-ink": "#e9e9e9",
        "night-ink-muted": "#9a9a9a",
      },
      boxShadow: {
        // A more formal, visibly-elevated card shadow for light mode —
        // used instead of shadow-sm on primary surfaces (flashcards, quiz
        // cards, panels) so the UI reads as a deliberately designed
        // desktop app rather than flat/sketch-like. Dark mode surfaces use
        // borders instead (shadows barely read against a black backdrop).
        card: "0 1px 2px rgba(20,15,15,0.04), 0 8px 24px -4px rgba(20,15,15,0.12)",
        "card-lg": "0 2px 4px rgba(20,15,15,0.05), 0 16px 40px -8px rgba(20,15,15,0.16)",
      },
      fontFamily: {
        mincho: ['"Shippori Mincho"', "serif"],
        bengali: ['"Noto Sans Bengali"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
    },
  },
  plugins: [],
};
