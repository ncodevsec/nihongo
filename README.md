# Nihongo

A static, dependency-free web app for JLPT/NAT Japanese test preparation.
React and Tailwind are already compiled into `assets/index-*.js` and
`assets/index-*.css` — this is plain HTML, CSS, and JavaScript. No
Node.js, npm, or build step required to run or deploy it.

## Structure

**Modules** — Kanji and Vocabulary, switchable from the header.

**Levels** — N5 and N4, switchable independently within each module.
Progress is tracked separately per module + level.

**Tools, available in every module/level combination:**

| Tab | Purpose |
|---|---|
| Flashcards | Flip-card study, filterable by category/lesson, self-marked learned/review. |
| Quiz | Multiple-choice quiz with the same category/lesson filter as Flashcards, plus a weak-item review mode. In Vocabulary, the question shows the reading (kana) and you pick the meaning. |
| List | Full searchable/filterable, paginated reference list, in original textbook order. Long words wrap cleanly instead of being cut off. |
| Progress | Accuracy, mastered-item count, per-category breakdown. |
| Settings | Site language, theme, display toggles, quiz length, timed exam mode, data reset. |

**Site language** — the whole interface (menus, buttons, labels) can be
switched between Bangla and English from Settings. Defaults to English.
This is separate from the "meaning language" setting, which only affects
what language vocabulary meanings are shown/tested in.

**Progress and settings are saved automatically** in the browser's local
storage.

## Deploy to GitHub Pages

1. Create a new empty repo named `nihongo` on GitHub (no README/gitignore).
2. Push these files as-is to the repo root:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/nihongo.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source → Deploy from a branch**,
   branch `main`, folder `/ (root)`, **Save**.
4. Live at `https://<your-username>.github.io/nihongo/`.

## Editing content

The JS here is compiled/minified, so to edit the kanji/vocabulary lists,
categories, or styling you'll need the original React source project
rather than these files — ask if you'd like that version.
