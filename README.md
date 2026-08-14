# কাঞ্জি স্টাডি রুম

A static, dependency-free web app for studying JLPT N5 and N4 kanji.
React and Tailwind are already compiled into `assets/index-*.js` and
`assets/index-*.css` — this is plain HTML, CSS, and JavaScript. No
Node.js, npm, or build step required to run or deploy it.

## What's in this version

**Design** — a calmer, formal Japanese reference-book look: warm
off-white paper background, soft charcoal text (not harsh black),
indigo and vermillion used as accents rather than large color blocks,
and a hanko (印, seal stamp) motif — styled like a real red ink stamp
on paper — used for scores and mastery counts. Labels are Bengali-first
with small Japanese alongside, since the app is for beginners.

**Sections** — an N5 / N4 switcher in the header. N5 is the default
(110 kanji); switching to N4 loads a separate ~150-kanji set with the
same tools. Progress is tracked separately per level.

**Features for a Japanese-language student:**

| Tab | Purpose |
|---|---|
| ফ্ল্যাশকার্ড (Study) | Flip-card flashcards, filterable by category, self-marked "শিখে ফেলেছি" (learned) / "আবার দেখব" (review again). Keyboard: Space=flip, ←/→=navigate, L/R=mark. |
| পরীক্ষা (Quiz) | Multiple-choice reading quiz. Includes a **weak-kanji review mode** that pulls only kanji you've previously gotten wrong. Keyboard: A/B/C/D=answer, Enter=next. |
| কাঞ্জি তালিকা (Reference) | Full searchable/filterable table of every kanji in the current level, with readings, meanings, and category tags. |
| অগ্রগতি (Progress) | Overall accuracy, mastered-kanji count, and a per-category breakdown bar chart. |

Every kanji has a 🔊 button that reads the reading aloud using the
browser's built-in Japanese text-to-speech (no external API). It waits
for the browser's voice list to finish loading and tells you plainly if
your device has no Japanese voice installed, instead of silently doing
nothing.

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

## A note on the 🔊 speaker button

It uses the browser's built-in speech engine (`speechSynthesis`), so it
needs no server or API key — but it depends on what's installed on the
visitor's device/OS. Most desktop browsers and modern phones ship a
Japanese voice by default. If a visitor's device genuinely has none,
the app will say so directly rather than staying silent.

## Editing content

The JS here is compiled/minified, so to edit the kanji lists,
categories, or styling you'll need the original React source project
rather than these files — ask if you'd like that version.
