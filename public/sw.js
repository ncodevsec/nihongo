// Bump this whenever the caching strategy itself changes (like this v2
// rewrite) so every existing installed user gets one guaranteed clean
// cache instead of inheriting old, possibly-stale entries. NOTE: the build
// does NOT use content-hashed JS/CSS filenames (see vite.config.js — they
// are forced to fixed names like assets/index.js for a simpler GitHub
// Pages deploy), so those files are treated as "always re-check with the
// network" below rather than "cache forever," which is what previously
// made deploys invisible until a manual cache clear.
const CACHE_NAME = "nihongo-cache-v2";
const CORE_ASSETS = ["./", "./index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    // No self.skipWaiting() here on purpose: when a previous version is
    // already controlling open tabs, the new worker now waits until the
    // page explicitly asks it to take over (see the "message" handler
    // below), so an update never swaps the running app's code out from
    // under a mid-session user. The very first install (nothing else
    // controlling yet) still activates immediately regardless, per the
    // normal service worker lifecycle.
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Lets the page trigger the waiting worker to activate immediately, right
// after the user taps "Update now" in Settings — see src/hooks/useAppUpdate.js.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isShellRequest(request) {
  if (request.mode === "navigate") return true;
  const url = new URL(request.url);
  return url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
}

// The app bundle's JS/CSS filenames are fixed (not content-hashed), so a
// stale cached copy of these two files is exactly what makes deploys
// invisible. They — plus the small version.json file used by the
// in-app "check for updates" button — are always treated network-first,
// same as the HTML shell.
function isVersionedAppFile(url) {
  return (
    url.pathname.endsWith("/assets/index.js") ||
    url.pathname.endsWith("/assets/index.css") ||
    url.pathname.endsWith("/version.json")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (isShellRequest(request) || isVersionedAppFile(url)) {
    // Network-first: whenever online, always fetch the latest copy so a
    // fresh deploy shows up on the very next load/reload — no manual
    // cache-clearing required. Falls back to whatever is cached when
    // offline, so the app still opens without a network connection.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for everything else — icons, manifest, webfonts, chunk
  // files (if any). These change far less often and cache-first keeps the
  // app instantly available offline after the first successful visit.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
