# N5 漢字研究室 — কাঞ্জি স্টাডি রুম

A static, dependency-free web app for studying the 110 basic N5 kanji.
React and Tailwind are already compiled into `assets/index-*.js` and
`assets/index-*.css` — this is plain HTML, CSS, and JavaScript. No
Node.js, npm, or build step required to run or deploy it.

## What's in this version

**Design** — a formal, document-like Japanese reference aesthetic: indigo
(藍) and vermillion seal-red (朱) on a warm washi-paper background,
Shippori Mincho for kanji display, hairline rules instead of heavy
shadows, and a recurring hanko (印, seal stamp) motif used for scores
and mastery counts.

**Features for a Japanese-language student:**

| Tab | Purpose |
|---|---|
| 学習 (Study) | Flip-card flashcards, filterable by category, self-marked 覚えた (learned) / もう一度 (review again). Keyboard: Space=flip, ←/→=navigate, L/R=mark. |
| テスト (Quiz) | Multiple-choice reading quiz. Includes a **weak-kanji review mode** that pulls only kanji you've previously gotten wrong. Keyboard: A/B/C/D=answer, Enter=next. |
| 一覧 (Reference) | Full searchable/filterable table of all 110 kanji with readings, meanings, and category tags — a quick lookup reference. |
| 進捗 (Progress) | Overall accuracy, mastered-kanji count, and a per-category breakdown bar chart. |

Every kanji also has a 🔊 speaker button that reads the reading aloud
using the browser's built-in Japanese text-to-speech (no external API).

**Progress is saved automatically** in the browser's local storage, so
it persists between visits on the same device/browser.

## Files

```
index.html
assets/
  index-*.js    (compiled React app)
  index-*.css   (compiled Tailwind styles)
```

## Run it locally (optional)

Double-click `index.html`, or open it in a browser directly.

If your browser blocks `type="module"` scripts on `file://`, run any
static server instead, e.g. `python3 -m http.server` in this folder,
then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new empty repo on GitHub (no README/gitignore).
2. Push these files as-is to the repo root:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source → Deploy from a branch**,
   branch `main`, folder `/ (root)`, **Save**.
4. Live at:

   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

## Editing content

The JS here is compiled/minified, so to edit the kanji list, categories,
or styling you'll need the original React source project rather than
these files — ask if you'd like that version to make further changes.
