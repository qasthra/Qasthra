# Notice

Every comment removed from the Qasthra source files, grouped by file, with the original line number. Dead code removed in the same pass is listed at the end.

## index.html

- Line 2: Copyrights Applies to this File
- Line 26: Do not add a forced cache-busting/version system here. A previous version served stale assets and hid an authentication bug.

Note: the two inline scripts in index.html were left byte-identical because the Content-Security-Policy pins them by sha256 hash. Editing them breaks the page.

## style.css

- Line 1: Do not add forced cache/version logic to this site. A stale asset previously masked an auth-state bug.
- Line 2: Copyrights Applies to this File
- Line 6: Premium Gray
- Line 7: Premium White (dark site)
- Line 17: Premium Black (light site)
- Line 102: ---------- mobile menu v2 ----------
- Line 116: ---------- mobile v3: theme button + content slide ----------
- Line 126: ---------- mobile menu v4: compact buttons ----------
- Line 134: ---------- h1: always 2 lines, fits its column on every screen ----------
- Line 146: ---------- desktop: sublabel wraps at the middle ----------
- Line 153: ---------- top nav v3: text-only desktop nav ----------
- Line 172: ---------- nav v4: buttons beside logo, menu on touch devices ----------
- Line 190: ---------- contact & support views ----------
- Line 204: ---------- performance ----------
- Line 208: ---------- nav showcase: appears after hero showcase is gone ----------
- Line 211: ---------- view renders: gray centered header ----------
- Line 215: ---------- contact and support forms ----------
- Line 216: ---------- contact and support v2 ----------
- Line 217: ---------- tappable GitHub card ----------
- Line 218: ---------- form hint text ----------
- Line 222: ---------- nav popup: Q&A and P&S ----------
- Line 230: ---------- nav popup v2: full width overlay ----------
- Line 235: ---------- nav popup: solid neutral gray ----------
- Line 243: ---------- hero showcase: expands toward Dashboard ----------
- Line 246: TEMP: top nav Q&A, Informations, P&S and Showcase hidden. Delete this block to restore them.
- Line 249: ---------- showcase expanded hides Dashboard, nav sits in the right corner ----------
- Line 252: ---------- auth + dashboard alpha (mono) ----------
- Line 290: ---------- auth v2: themed security layer ----------
- Line 293: ---------- auth v3: invisible check, tighter spacing, lighter layout ----------
- Line 299: ---------- auth v4: cleaner create form ----------
- Line 306: ---------- auth v6: about box ----------
- Line 308: ---------- auth v7: spacing and cancel ----------
- Line 312: ---------- auth v8: cancel right, roomy fields ----------
- Line 317: ---------- auth v9: gap under email and phone ----------
- Line 319: ---------- captcha status on the Dashboard button ----------
- Line 328: ---------- dashboard: blank, top bar with settings ----------
- Line 331: ---------- qb: browser top nav on the dashboard ----------
- Line 407: ---------- qb mobile: search on top, dock at the bottom ----------
- Line 436: ---------- controller pad ----------
- Line 446: ---------- public/private: icon only, no bg, no border ----------
- Line 449: ---------- search suggestions ----------
- Line 453: ---------- top bar rework ----------
- Line 457: magnifier sits close to the text
- Line 462: name in white, coordinates in gray
- Line 469: ---------- search bar: smaller text, centered with the magnifier ----------
- Line 485: ---------- qb mobile v3: world tabs on top, glass orb dock ----------
- Line 511: qast render: blank full central screen
- Line 513: ---------- dashboard on desktop ----------
- Line 521: World navigation feedback: keep the loading GIF centered and contained without changing page layout.
- Line 525: Keep route changes hidden until the matching intro/outro veil is complete.
- Line 529: ---------- desktop quick bar (matches preview) ----------
- Line 550: ---------- touch + reduced motion ----------
- Line 554: ---------- tab stars, tab drag, sync dot, lock between Back and Next, Kirby strip ----------
- Line 598: ---------- settings full screen ----------
- Line 606: ---------- settings: i button and info popup ----------
- Line 609: ---------- settings v2: profile card and card lists ----------
- Line 636: ---------- settings v3: base card and inner card ----------
- Line 640: ---------- settings v4: slim base, Switch pill ----------
- Line 648: ---------- settings v5: pencil circle, tappable card, profile page ----------
- Line 659: ---------- settings v6: bigger back arrow ----------
- Line 661: ---------- settings v7: X buttons aligned with the i button ----------
- Line 664: ---------- account page v2: rows, expanding password, Change bar ----------
- Line 665: ---------- account page v3: edit sheets, pickers, chevrons ----------
- Line 666: ---------- account page v4: sheet errors and counter ----------
- Line 667: ---------- settings: hidden scrollbar ----------
- Line 670: settings: stable volume row
- Line 671: settings: no scrollbar on any settings screen

## script.js

- Line 1-8: Copyrights Applies to this file IMPORTANT: Never add a forced cache system or trust the presence of an auth-token key. The old code treated stale local Supabase tokens as valid, which showed the loading GIF, redirected to the dashboard, and eventually opened the Create an account form after the account had been deleted. Authentication must always be validated by Supabase first. ---------- screens: index.html is only a container, every fullscreen is rendered here ---------- screen.render('home') is the landing page (nav, hero, 3D scene, in-page views). screen.render('dashboard') is the dashboard (browser nav + worlds).
- Line 91: build the home shell first so the scripts below can find it
- Line 100-101: Keep the landing page interactive first: Three.js geometry and its animation loop are intentionally initialized during browser idle time instead of blocking first paint.
- Line 106: ---------- renderer ----------
- Line 125: ---------- object: node globe, nearest-neighbor links ----------
- Line 184: ---------- theme colours (white on dark site, black on light site) ----------
- Line 198: ---------- random animation state ----------
- Line 219: ---------- drag / wheel interaction ----------
- Line 256: ---------- zoom: pinch or ctrl+wheel, clamped so it cannot over-zoom ----------
- Line 294: random drift: speed and direction change every few seconds, eased
- Line 302: after 1.5s without touch, the tilt/turn eases back to the normal face
- Line 332: decay + write colours
- Line 372: This storage check is only a short performance hint; it never authenticates or routes anyone.
- Line 377: ---------- theme toggle (moon / sun) ----------
- Line 395: ---------- mobile menu ----------
- Line 411-413: ---------- database (Supabase) ---------- Do not purge auth storage with a one-time flag and do not add a cache workaround here. Invalid sessions are cleared by QAUTH.session() after Supabase validates them.
- Line 416: ---------- contact & support views: same page, new render, top nav stays ----------
- Line 438: ---------- nav showcase button: show only when hero showcase button is out of view ----------
- Line 445: ---------- view renders: informations, contact, support ----------
- Line 447: ---------- contact & support content: info, safe forms, Supabase ----------
- Line 449: ---------- contact & support: copy buttons ---------- (() => { const box = document.querySelector('#page .page-in'); if (!box) return; box.addEventListener('click', (e) => { const b = e.target.closest('.cs-copy'); if (!b) return; const t = b.dataset.copy; const done = () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, 1500); }; const fb = () => { const x = document.createElement('textarea'); x.value = t; x.style.position = 'fixed'; x.style.opacity = '0'; document.body.appendChild(x); x.select(); try { document.execCommand('copy'); done(); } catch (z) {} x.remove(); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fb); else fb(); }); })();
- Line 455: ---------- hero Version button: tap for A1.00, tap again to restore ----------
- Line 461: ---------- captcha status on the Dashboard button: starts on arrival, retries until verified ----------
- Line 524: ---------- qasthra auth (one form: sign in or set up) + dashboard alpha ----------
- Line 533-534: One auth gate for the whole app. getSession() reads local state; getUser() validates it with Supabase. A missing user or a rejected token means the local session is invalid. A network error (offline) keeps it.
- Line 563-564: Account identifiers accept only letters, numbers, underscore, and hyphen. Full names are validated separately as letters and spaces only below.
- Line 575: hidden login address: Supabase signs in with an email, the person only ever sees the username. Change this one line to use your own domain.
- Line 771: ---------- qb: browser top nav on the dashboard ----------
- Line 781: coordinates: X=1028, Y=-92810, Z=1029.202 ; a run of one digit may be written 1{10} (only when the run is continuous)
- Line 787: state
- Line 790:
  ENCRYPTED / DECRYPTED (acstatus) - DESIGN NOTE, DO NOT REMOVE
     Yoan's intent: this is a SECURITY status, not a privacy or anonymity feature.
     It marks whether the account's browser activity is encrypted or decrypted (encryption and decryption of user browser activity).
     It is only a localStorage flag: key qb:acstatus, value Decrypted or Encrypted, same on every device. The labels are Encrypted and Decrypted on purpose, never Public, Private, Secured or Unsecured.
     It must never create tabs, dots or private Worlds. No Supabase and no SQL for now.
     Encryption itself is NOT built yet. This flag is the hook for it.
     Nothing else may depend on it: no history, favorites, sync or tab-saving rules, and no dashed or dotted UI.
- Line 798: Qasthra.qst is a placeholder. It is the page the universe (X=0, Y=0, Z=0, the Qasthra tab) will load the way a site loads index.html. Nothing reads it yet. Other sites still read their text from the Supabase sites.qst column.
- Line 812: sync with Supabase (tables worlds_saved and worlds_history), manual on and off
- Line 827: site names: SITES maps a coordinate text to its name, filled in later
- Line 842: search: suggestions from Favorites and History, clear button
- Line 847: controller: tap nudges X, Y or Z by 1, hold repeats
- Line 861: history, worlds and movement
- Line 876: the content area
- Line 880: panels
- Line 890: the bar
- Line 894: SPIRIT (soon): the Kirby strip is where a talker will live, an AI model or a human model, acting as a support system while browsing. For now it only holds the 3D control.
- Line 905: tab drag: every exit path ends in dragEnd, so a tab cannot stay stuck
- Line 989: ---------- qb orb v2: glass ball that turns into the 3D control (XY drag + depth) ----------
- Line 1087: ---------- dashboard only: validated loading screen + music (never on the landing page) ----------
- Line 1114: ---------- input guards: stop bad input while typing, before anything is submitted ----------
- Line 1116: Allowed email endings. Add or remove domains here.
- Line 1197: ---------- settings: full-screen render, Manage page, 8 categories ----------

## Dead code removed

script.js
- BAD0 (unused regex in the contact/support form)
- KEY (duplicate Turnstile site key constant, second copy never read)
- X (unused close-icon svg string in the auth screen)
- check (unused async username check) and settle (only used by check)
- HOME_QST (unused Qasthra.qst constant)
- drop0 (older copy of the sync delete helper, replaced by drop)
- k, t0 (unused timing values in the orb loop)
- tk, tap, bb, st0 (unused tap/zone values in the orb end handler)
- selF, prof (unused settings form helpers)
- A commented-out copy of the contact copy-buttons block (line 449 original)

style.css
- Rules for classes no script or page uses: qa-theme, qb-gear-d, qb-more, qb-priv, qb-pv, qb-seg, qb-tools, qs-cact, qs-danger, qs-em, qs-ex, qs-form, qs-lo, qs-man, qs-mg, qs-prof
- Media queries left empty after those removals
