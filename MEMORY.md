# MEMORY.md — shared project context (read me first, update me last)

Shared notes for every agent/person working on **NihonGo – Study Lab**. Keep it short and factual; append a line to
"Change log" when you land something, and fix anything here that became wrong.

## What this is
Solo-built React 18 + Vite + Tailwind PWA for JLPT N5/N4 (and NAT) study. Bengali/English UI. Modules: Vocabulary,
Grammar, Kanji, Transform (conjugation). Also Mock Test (JLPT/NAT style papers). No backend: all user data lives in
`localStorage`.

## Hosting & build
- Hosted on **Vercel** (`vercel.json`: SPA rewrite, no-cache for `sw.js`/`version.json`). `npm run build` → `dist/` (git-ignored). Vite `base` is `"/"`.
- `docs/` is **not** build output any more: it is a hand-written redirect for the old GitHub Pages site
  (`index.html`, `404.html`, kill-switch `sw.js`, `version.json`, `redirect.js` holds the Vercel URL).
- Service worker `public/sw.js` (cache `nihongo-cache-v4`): network-first for the shell, fixed-name `assets/index.js|css`, `version.json`.

## Routing (react-router-dom v6, `src/App.jsx`)
`/` Home · `/study/:module/:level/(flashcards|quiz|list)` · `/progress/:module/:level` · `/mock-test` · `/profile`
(personal info) · `/settings`. modules: vocabulary|grammar|kanji|transform; levels: all|n5|n4.
URL helpers: `src/lib/routes.js`. Shared state comes from `AppContext` (`useApp()`); `go(tab, module?, level?)` navigates by tab name.
Navigation: mobile bottom dock (`BottomNav`) and desktop `Sidebar` share `components/navItems.jsx` (Home, Study, Mock Test, Progress, Profile).

## Key conventions
- UI is mobile-first; Tailwind theme tokens in `tailwind.config.js` (shu = brand red, ai, take = green, washi/paper/ink, night-*).
- All UI strings go in `src/lib/i18n.js` as `{ bn, en }` (mock-test strings in `lib/mockI18n.js`).
- Flashcards use `components/FlipCard.jsx` (3D flip; both faces rendered, `cardKey` remounts per item).
- Storage keys: `nihongo-progress-v2`, `-activity-v1`, `-favorites-v1`, `-settings-v1`, `-profile-v1`, `-time-v1`, `-mock-v1` (history), `-mock-session-v1`. Backup export/import list: `DATA_KEYS` in `components/Settings.jsx`.
- Progress page: Study activity → Time spent → Mock Test progress → course/module selector → status + per-category.
- Bump `package.json` version for every release (semver); `__APP_VERSION__` is shown in Settings.

## Working agreement
- Pull/fetch origin before starting. Work on a branch when another agent may be active; don't push or merge to `main` without being asked.
- Never commit tokens/secrets. Never remove features without asking.

## Change log
- v2.0.0 — routes, mobile dock, animated flashcard flip, Vercel hosting + GH Pages redirect.
- v2.1.0 — desktop sidebar = dock items, trimmed top bars, personal-info Profile page, Settings moved to `/settings`.
- v2.2.0 (branch `feature-progress-page`) — Progress page reorder, removed overview stat cards, Mock Test progress section, redesigned level/module selector.
