/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        washi: "#faf8f3",
        paper: "#ffffff",
        ink: "#33312c",
        "ink-muted": "#6b675e",

        ai: "#2d4a6b",
        "ai-soft": "#eef2f6",
        "ai-line": "#d8e0e8",
        "ai-glow": "#8fb2d6",

        shu: "#b0503f",
        "shu-soft": "#faeeec",
        "shu-glow": "#e2917f",

        take: "#5c7a52",
        "take-soft": "#eef3ec",
        "take-glow": "#9dc08e",

        kin: "#b3924f",

        // Dark theme surfaces
        "night": "#1c1e22",
        "night-paper": "#25282e",
        "night-line": "#383c44",
        "night-ink": "#e9e7e1",
        "night-ink-muted": "#a3a8b0",
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
