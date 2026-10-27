// Legacy GitHub Pages service worker, replaced by a "kill switch": the site moved to Vercel.
// Installed copies of the old app pick this up on their next update check, drop every cache,
// unregister themselves and reload each open tab so it lands on the redirect page.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("message", (e) => { if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url).catch(() => {}));
    })()
  );
});
