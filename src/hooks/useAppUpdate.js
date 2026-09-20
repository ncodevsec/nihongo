import { useCallback, useEffect, useRef, useState } from "react";

// The running build's timestamp is baked into the bundle at build time
// (__APP_BUILD_TIME__, see vite.config.js). "Update available" simply means
// the deployed version.json carries a different timestamp than the code that
// is running right now — no stored state that could drift out of sync with
// what is actually on screen. Nothing here touches progress, favorites or
// settings in localStorage.
const RUNNING_BUILD = typeof __APP_BUILD_TIME__ !== "undefined" ? __APP_BUILD_TIME__ : null;

// Drives the "Check for updates" / "Update now" flow in Settings.
//
// Two independent signals feed into "an update is available":
//  1. The service worker lifecycle — a new sw.js installed and is sitting
//     in `waiting` because a previous version already controls the page.
//  2. version.json — a tiny build-timestamp file (see vite.config.js)
//     fetched with cache: "no-store" and compared with the timestamp of
//     the build that is running. Catches the case where the SW hasn't
//     (yet) noticed anything but a new deploy clearly exists.
//
// Applying an update: message the waiting worker to skipWaiting, wait for
// controllerchange, then reload. If there's no waiting worker (e.g. only
// version.json changed) we still clear the app's own cache bucket first
// so nothing stale can be served, then reload directly.
export function useAppUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState(null);
  const registrationRef = useRef(null);
  const waitingWorkerRef = useRef(null);
  const reloadingRef = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return undefined;
    let cancelled = false;

    function watchInstalling(reg) {
      const installing = reg.installing;
      if (!installing) return;
      installing.addEventListener("statechange", () => {
        if (installing.state === "installed" && navigator.serviceWorker.controller) {
          waitingWorkerRef.current = installing;
          setUpdateAvailable(true);
        }
      });
    }

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg || cancelled) return;
      registrationRef.current = reg;
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingWorkerRef.current = reg.waiting;
        setUpdateAvailable(true);
      }
      reg.addEventListener("updatefound", () => watchInstalling(reg));
    });

    const onControllerChange = () => {
      if (reloadingRef.current) return;
      reloadingRef.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const checkForUpdate = useCallback(async () => {
    setChecking(true);
    try {
      // Signal 1: nudge the service worker to look for a new sw.js/cache.
      try {
        const reg = registrationRef.current || (await navigator.serviceWorker?.getRegistration());
        registrationRef.current = reg || null;
        await reg?.update();
      } catch {
        // offline or unsupported — fall through to the version.json check
      }

      // Signal 2: compare the live build timestamp to the last one seen.
      let foundNewer = false;
      try {
        const res = await fetch(`./version.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (RUNNING_BUILD && String(data.buildTime) !== RUNNING_BUILD) foundNewer = true;
        }
      } catch {
        // offline, or version.json not present in dev — ignore
      }

      // Give the browser a brief moment to finish installing anything
      // registration.update() kicked off, then check for a waiting worker.
      await new Promise((r) => setTimeout(r, 600));
      const reg = registrationRef.current;
      if (reg?.waiting && navigator.serviceWorker?.controller) {
        waitingWorkerRef.current = reg.waiting;
        foundNewer = true;
      }

      setLastCheckedAt(Date.now());
      if (foundNewer) setUpdateAvailable(true);
      return foundNewer;
    } finally {
      setChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    const worker = waitingWorkerRef.current || registrationRef.current?.waiting;
    if (worker) {
      // Triggers the "message" listener in public/sw.js, which calls
      // self.skipWaiting(); the resulting controllerchange event (wired
      // up above) reloads the page once the new worker takes over.
      worker.postMessage({ type: "SKIP_WAITING" });
      return;
    }
    // No waiting worker (e.g. only version.json moved) — still clear the
    // cache bucket directly so a reload can't serve anything stale. This
    // only touches Cache Storage, never localStorage, so progress,
    // favorites, and settings are all untouched.
    try {
      await caches.delete("nihongo-cache-v2");
    } catch {
      // ignore
    }
    // Also refresh the browser's HTTP cache entries for the app shell:
    // GitHub Pages serves max-age=600, so a plain reload could otherwise
    // re-serve the old bundle and look like nothing updated.
    await Promise.all(
      ["./", "./assets/index.js", "./assets/index.css", "./version.json"].map((u) =>
        fetch(u, { cache: "reload" }).catch(() => {})
      )
    );
    window.location.reload();
  }, []);

  // Every time the site loads, quietly check for a newer deploy on its
  // own — no need to open Settings and tap "Check for updates" manually.
  // A short delay lets the app finish its own first render first.
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForUpdate().catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, [checkForUpdate]);

  return { updateAvailable, checking, lastCheckedAt, checkForUpdate, applyUpdate };
}
