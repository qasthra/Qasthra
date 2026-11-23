# Qasthra: Project Info

Last generated: 2026-11-24

## 1. Overview

Qasthra is a web app hosted on GitHub Pages. The same site is installed three ways:

- **Android:** a small app (a "TWA") that opens the live site full-screen.
- **Windows / desktop:** installed from Chrome or Edge as a PWA.
- **iPhone:** added to the home screen from Safari.

The website is the only source of truth. Push to the main repo and every install updates itself. No reinstall.

## 2. Key addresses

| What | Address |
|---|---|
| Live site | https://qasthra.github.io/Qasthra/ |
| Main repo | https://github.com/qasthra/Qasthra |
| Ownership repo | https://github.com/qasthra/qasthra.github.io |
| Ownership file | https://qasthra.github.io/.well-known/assetlinks.json |

## 3. Repositories

### 3.1 Main repo: `qasthra/Qasthra`

Serves the site at `/Qasthra/`.

| File / folder | Purpose |
|---|---|
| `index.html` | Page shell, CSP, install meta tags, loads scripts |
| `style.css` | All styling and light/dark themes |
| `script.js` | App logic (tabs, search, coordinates, Supabase, Turnstile) |
| `manifest.webmanifest` | PWA install info (name, icons, colors, shortcuts) |
| `sw.js` | Service worker (offline fallback, always fetches fresh) |
| `pwa.js` | Registers the service worker, checks for updates on reopen |
| `Sources/Icons`, `Sources/Images` | Logo SVG and PNG icons |
| `Manager/` | `operator.py`, `planner.txt`, `memory.txt` (dev tooling) |
| `Materials/` | Backups, chunks, prototypes created by the operator |

`sw.js` and `pwa.js` **must be committed**. If they are in `.gitignore`, the service worker is not deployed.

### 3.2 Ownership repo: `qasthra/qasthra.github.io`

A tiny repo that serves the **root** of `qasthra.github.io`. It exists only so Android can verify the app.

```
qasthra.github.io
├── .nojekyll                 (so GitHub does not hide .well-known)
├── .well-known
│   └── assetlinks.json       (proves the Android app belongs to this site)
└── index.html                (optional: redirects the root to /Qasthra/)
```

Pages is set to: Deploy from a branch, `main`, `/ (root)`.

## 4. PWA layer

What each part does:

- **Manifest:** tells the browser the app's name, icons, colors and start page. `display` is `standalone`, so it opens without browser bars. `id` and `scope` are `./`, which keeps it inside `/Qasthra/`.
- **Service worker (`sw.js`):** network-first. It always asks the network first with `cache: 'no-cache'`, so updates arrive immediately. It uses saved copies only when offline. It ignores every other website (Supabase, Turnstile, fonts, CDNs) and never touches non-GET requests.
- **`pwa.js`:** registers `sw.js` and re-checks for a new version whenever the app is reopened.
- **`index.html`:** has apple-touch-icon and mobile-web-app meta tags (iPhone), two theme-color tags (dark and light), and a small inline style that paints the right background immediately to reduce the white launch flash.
- **Do not add** a forced cache-busting or version system to `index.html`. An older version served stale files and hid an authentication bug.
- To clear the offline cache for everyone, change `CACHE` in `sw.js` (for example `qasthra-offline-v1` to `qasthra-offline-v2`). Old caches are deleted when the worker activates.

Current contents of the files (copied from the project when this document was generated):

#### `manifest.webmanifest`

```json
{
  "id": "./",
  "name": "Qasthra",
  "short_name": "Qasthra",
  "description": "A new way to browse and allocate data, from a general technological advancement association.",
  "start_url": "./",
  "scope": "./",
  "lang": "en",
  "orientation": "any",
  "display_override": ["standalone", "minimal-ui"],
  "prefer_related_applications": false,
  "display": "standalone",
  "background_color": "#050505",
  "theme_color": "#050505",
  "categories": ["technology", "productivity"],
  "icons": [
    {
      "src": "Sources/Images/Qasthra-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "Sources/Images/Qasthra-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "Sources/Images/Qasthra-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "Sources/Images/Qasthra-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "Sources/Images/Qasthra.png",
      "sizes": "2048x2048",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "Sources/Icons/Qasthra.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ],
  "shortcuts": [
    {
      "name": "Version",
      "short_name": "Version",
      "url": "./#showcase"
    },
    {
      "name": "Contact",
      "short_name": "Contact",
      "url": "./#contact"
    },
    {
      "name": "Support",
      "short_name": "Support",
      "url": "./#support"
    }
  ]
}
```

#### `sw.js`

```js
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
```

#### `pwa.js`

```js
// Registers the service worker and re-checks for a new version whenever the app is reopened.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(reg => {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) reg.update().catch(() => {});
      });
    }).catch(() => {});
  });
}
```

## 5. Android app

| Item | Value |
|---|---|
| Type | TWA (Trusted Web Activity), built with PWABuilder |
| Package ID | `io.github.qasthra.app` |
| App name | Qasthra |
| Display | Standalone (no address bar) |
| Splash / theme color | Built into the APK |
| Signing fingerprint (SHA-256) | `65:3D:C0:A5:99:6F:07:DF:19:1D:74:95:AE:C5:6A:90:84:72:D6:54:F9:E1:96:16:11:7F:BE:A9:2D:F8:5B:1E` |

How it works: the APK is a shell that opens `https://qasthra.github.io/Qasthra/`. Android checks `assetlinks.json` on the root domain. If it matches the package name and fingerprint, the address bar is hidden.

### Changes that need NO rebuild (they update by themselves)

- Anything in `index.html`, `style.css`, `script.js`, `sw.js`, `pwa.js`
- Content, layout, features, themes, search logic

### Changes that DO need a rebuild and reinstall

- Package ID or app name
- App icon inside the APK
- Splash screen color, navigation bar color
- Adding or changing the site address or scope

### Keep these safe (back them up outside the phone)

- The PWABuilder **signing key** and its info file
- The `.aab` file (for the Play Store)

Losing the signing key means future updates cannot be signed the same way. Never commit the key to any repo.

## 6. Installing on other platforms

- **Windows / desktop:** open the site in Chrome or Edge, click the install icon at the right of the address bar (or menu, then Install Qasthra).
- **iPhone:** open the site in Safari, tap Share, then Add to Home Screen, then Add. Updates are automatic. A real App Store app would need a Mac, Xcode and a paid Apple Developer account.

## 7. Update workflow

1. Make changes (use `Manager/operator.py` with a planner).
2. Check: `python Manager/operator.py "/status"`.
3. Push to the main repo.
4. Wait about a minute for GitHub Pages.
5. Close and reopen the app. The change appears. No reinstall.

Never run a planner twice. `/replace` would apply again. Run `/status` first if unsure.

## 8. Play Store, later

- Upload the `.aab` from PWABuilder. Google re-signs the app with its own key.
- Then add Google's SHA-256 fingerprint (Play Console, then App integrity, then App signing key) to `assetlinks.json` **in addition** to the current one. Keep both inside the `sha256_cert_fingerprints` list.
- Without the second fingerprint, the Play Store version shows an address bar.

## 9. Troubleshooting

| Problem | Cause and fix |
|---|---|
| Address bar shows in the app | Android caches the ownership check. Close the app, wait a few minutes, reopen. Check that the ownership file loads in a browser. Package ID and fingerprint must match exactly. |
| Ownership file shows 404 | Pages not finished (wait a minute), `.nojekyll` missing, or Pages not enabled on the ownership repo. |
| Slow captcha on first launch | A new install has no Cloudflare history. It becomes normal after use. |
| Brief white flash on launch | Part of it is Android starting its web view. Only a rebuild with `#050505` splash colors removes the rest. |
| Offline fallback not working | `sw.js` or `pwa.js` is gitignored or not pushed. Run `git ls-files sw.js pwa.js`. |
| `git push` asks for a password in Termux | Use `gh auth login --hostname github.com --git-protocol https --web`, then `gh auth setup-git`. Or edit files on github.com. |
| Changes do not show | Wait for the Pages build. Fully close and reopen the app. |

## 10. Coordinate search rules

- Format: `X=1028, Y=-92810, Z=1029.202` (all three, in order X, Y, Z).
- A run of one repeated digit may be written like `1{10}`, but only if the run is continuous. `1{29}919` is valid. `1{28}1919` is rejected, because the 1s continue after the braces.
- The whole entry must be the coordinates. A sentence such as "Where is X=..., Y=..., Z=..." is currently treated as an ordinary text search.
- Planned: recognize coordinates inside a question and show a result card.

## 11. Security notes

- CSP is set in `index.html`. If you add a new service or API, add its address to the right CSP part (`connect-src` for API calls).
- Turnstile and Supabase must allow the site address `qasthra.github.io`.
- Only same-site requests go through the service worker. Auth traffic is never cached.

## 12. Setup history

- 2026-11-23: manifest upgraded; `sw.js` and `pwa.js` added; iPhone meta tags added.
- 2026-11-23: Android TWA built with PWABuilder, package `io.github.qasthra.app`.
- 2026-11-23: `qasthra.github.io` repo created with `assetlinks.json` and `.nojekyll`; Pages enabled.
- 2026-11-23: inline background style added to `index.html` to reduce launch flash.
