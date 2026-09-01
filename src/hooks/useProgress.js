import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nihongo-progress-v2";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (private browsing, quota) — degrade silently
  }
}

// Progress shape per kanji id: { seen, correct, wrong, learned }
export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    persist(progress);
  }, [progress]);

  const recordQuizResult = useCallback((id, correct) => {
    setProgress((p) => {
      const cur = p[id] || { seen: 0, correct: 0, wrong: 0, learned: false };
      const next = {
        ...cur,
        seen: cur.seen + 1,
        correct: cur.correct + (correct ? 1 : 0),
        wrong: cur.wrong + (correct ? 0 : 1),
        // three correct answers in a row (roughly) auto-promotes to learned
        learned: cur.learned || (correct && cur.correct + 1 >= 3 && cur.wrong === 0),
      };
      return { ...p, [id]: next };
    });
  }, []);

  const setLearned = useCallback((id, learned) => {
    setProgress((p) => {
      const cur = p[id] || { seen: 0, correct: 0, wrong: 0, learned: false };
      return { ...p, [id]: { ...cur, learned } };
    });
  }, []);

  // With no prefix, clears everything. With a prefix (e.g. "n5-"), clears
  // only that level's entries so switching levels never wipes the other.
  const resetProgress = useCallback((prefix) => {
    if (!prefix) {
      setProgress({});
      return;
    }
    setProgress((p) => {
      const next = {};
      for (const [id, v] of Object.entries(p)) {
        if (!id.startsWith(prefix)) next[id] = v;
      }
      return next;
    });
  }, []);

  return { progress, recordQuizResult, setLearned, resetProgress };
}
