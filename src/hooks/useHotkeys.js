import { useEffect, useRef } from "react";

// Attaches a single, stable window keydown listener (added once, never
// re-added on every render) and always calls the *latest* handler via a
// ref. The previous pattern re-ran useEffect with no dependency array on
// every render, tearing down and rebuilding the window listener constantly
// — that's the main cause of the app feeling slow/unresponsive to clicks.
export function useHotkeys(handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const onKeyDown = (e) => handlerRef.current(e);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
