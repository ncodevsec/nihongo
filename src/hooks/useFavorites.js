import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nihongo-favorites-v1";

function loadFavorites() {
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
    // storage unavailable — degrade silently
  }
}

// Favorites shape: { [id]: true }. Works for any item id — kanji, vocab,
// or a synthetic grammar-point id like "vocabulary-n4-lesson26-3" or
// "grammar-n4-26-1" — the caller decides the id scheme.
export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    persist(favorites);
  }, [favorites]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((f) => {
      const next = { ...f };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => !!favorites[id], [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
