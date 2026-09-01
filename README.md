# Nihongo — Source Project

The full React + Vite + Tailwind source for the Nihongo JLPT/NAT study
app. This is the raw, unbuilt project — customize it, then build for
production yourself.

## Structure

```
src/
  App.jsx                  Top-level state (module/level/tab) + layout
  main.jsx                 React entry point
  index.css                Base styles, Tailwind directives, dark mode

  components/
    Header.jsx              Top bar: logo, level/module switcher, tabs
    Study.jsx                Flashcard mode (Kanji + Vocabulary)
    Quiz.jsx                  Multiple-choice quiz mode
    Reference.jsx              Searchable/paginated list mode
    Progress.jsx                Accuracy + mastery stats
    Settings.jsx                  Site language, theme, display toggles, etc.
    Grammar.jsx                    Grammar lesson browser
    Hanko.jsx                       Seal-stamp badge UI element

  hooks/
    useProgress.js          Per-item learned/seen/correct tracking (localStorage)
    useSettings.js           Site settings incl. theme (localStorage)
    useHotkeys.js              Stable keyboard-shortcut listener

  lib/
    i18n.js                  Bengali/English UI string dictionary
    utils.js                  shuffle() helper

  data/
    modules.js                Registry: Vocabulary / Grammar / Kanji × N5/N4
    kanji/n5.js, kanji/n4.js    Kanji datasets
    vocab/n5.js, vocab/n4.js     Vocabulary datasets (Minna no Nihongo I & II)
    grammar/n4.js, grammar/n5.js  Grammar notes by lesson (N5 currently empty)
    kanji-categories.js            Kanji study categories
    vocab-lesson-categories.js      Shared lesson categories (1-50)
```

## Requirements

- Node.js 18+ and npm

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens a local dev server with hot reload.

## Build for production

```bash
npm run build
```

Outputs a static site to `dist/` — plain HTML/CSS/JS, deployable anywhere
(GitHub Pages, Netlify, any static host, or just opened directly).

By default `vite.config.js` reads a `BASE_PATH` env var for the site's
base path (falls back to `/`). For a GitHub Pages project site at
`https://<user>.github.io/<repo>/`, build with:

```bash
BASE_PATH=/<repo>/ npm run build
```

For a custom domain or root-hosted deployment, just run `npm run build`
as-is, or set `BASE_PATH=./` for fully relative paths that work from any
subpath (including opening `dist/index.html` directly).

## Notes on content data

- `src/data/vocab/n5.js` and `src/data/vocab/n4.js` — transcribed from
  Minna no Nihongo I & II. N5 uses the textbook's real Lessons 1–25; N4
  uses the textbook's real Lessons 26–50.
- `src/data/grammar/n4.js` — grammar notes per lesson (26–50), Bengali
  explanations with Japanese examples, stored as one text block per
  lesson in `GRAMMAR_N4`. `src/data/grammar/n5.js` is currently an empty
  placeholder (`GRAMMAR_N5 = []`) — add entries in the same shape to
  populate it:
  ```js
  export const GRAMMAR_N5 = [
    { lesson: 1, title: "Lesson 1", content: `...text...` },
  ];
  ```
- Kanji/vocab entries share a common shape:
  ```js
  { id, kanji, reading, meaning, meaningEn, category }
  ```
  `category` keys must match an entry in the relevant categories file for
  filtering to work.

## A note on localStorage

Progress (`useProgress.js`) and settings (`useSettings.js`) both persist
to `localStorage` in this source project — appropriate for a real
deployed site, but if you ever adapt this into a sandboxed preview/canvas
environment that disallows `localStorage`, swap those two hooks for
in-memory-only versions (state only, no `localStorage` calls).
