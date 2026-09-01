// Bump this whenever you want to force clients to drop old cached assets
// (e.g. after a deploy that changes the shell in an incompatible way).
// Content-hashed JS/CSS filenames change automatically on every build, so
// this rarely needs a manual bump for normal updates.
const CACHE_NAME = "nihongo-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(["./", "./index.html"]))
      .then(() => self.skipWaiting())
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

function isShellRequest(request) {
  if (request.mode === "navigate") return true;
  const url = new URL(request.url);
  return url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (isShellRequest(request)) {
    // Network-first for the HTML shell: whenever online, always fetch the
    // latest index.html (which references the current build's hashed
    // asset filenames). Falls back to whatever shell is cached when
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

  // Cache-first for everything else — JS/CSS bundles (content-hashed, so
  // safe to cache indefinitely), icons, and webfonts. This is what makes
  // the whole app, including all vocabulary/kanji/grammar data bundled
  // into the JS, keep working with no network connection after the first
  // successful visit.
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
