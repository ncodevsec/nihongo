import { useCallback, useEffect, useRef, useState } from "react";

// Only ever reads/writes this one small localStorage key — never touches
// nihongo-progress-v2, nihongo-favorites-v1, or nihongo-settings-v1, so
// applying an update can never wipe study progress, starred items, or
// settings. Those all live in plain localStorage, which persists through
// service-worker cache changes and through everything this hook does.
const VERSION_KEY = "nihongo-build-version";

function getKnownVersion() {
  try {
    return localStorage.getItem(VERSION_KEY);
  } catch {
    return null;
  }
}

function setKnownVersion(v) {
  try {
    localStorage.setItem(VERSION_KEY, v);
  } catch {
    // ignore — worst case we just re-check next time
  }
}

// Drives the "Check for updates" / "Update now" flow in Settings.
//
// Two independent signals feed into "an update is available":
//  1. The service worker lifecycle — a new sw.js installed and is sitting
//     in `waiting` because a previous version already controls the page.
//  2. version.json — a tiny build-timestamp file (see vite.config.js)
//     fetched with cache: "no-store", compared against the timestamp seen
//     on the last visit. Catches the case where the SW hasn't (yet)
//     noticed anything but a new deploy clearly exists.
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
          const remote = String(data.buildTime);
          const known = getKnownVersion();
          if (known && known !== remote) foundNewer = true;
          if (!known) setKnownVersion(remote);
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
    // Record the new build's timestamp as "known" before reloading, so the
    // freshly-loaded app doesn't immediately think it's out of date again.
    try {
      const res = await fetch(`./version.json?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setKnownVersion(String(data.buildTime));
      }
    } catch {
      // ignore — worst case the next check re-detects the same update
    }

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
    window.location.reload();
  }, []);

  // Record the current version as "known" once on first successful load,
  // so the very next check has something to compare against.
  useEffect(() => {
    fetch(`./version.json?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !getKnownVersion()) setKnownVersion(String(data.buildTime));
      })
      .catch(() => {});
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
