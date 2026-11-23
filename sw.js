// Qasthra service worker: network-first so updates always arrive, cache only as an offline fallback.
const CACHE = 'qasthra-offline-v1';
const SHELL = ['./', 'index.html', 'style.css', 'script.js', 'manifest.webmanifest',
               'Sources/Icons/Qasthra.svg', 'Sources/Images/Qasthra-192.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return; // Supabase, Turnstile, fonts and CDNs are never touched
  e.respondWith((async () => {
    try {
      const res = await fetch(r, { cache: 'no-cache' });
      if (res.status === 200) {
        const c = await caches.open(CACHE);
        c.put(r, res.clone()).catch(() => {});
      }
      return res;
    } catch (err) {
      const hit = await caches.match(r);
      if (hit) return hit;
      if (r.mode === 'navigate') {
        const home = (await caches.match('index.html')) || (await caches.match('./'));
        if (home) return home;
      }
      return Response.error();
    }
  })());
});
