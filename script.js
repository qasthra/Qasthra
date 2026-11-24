// IMPORTANT: Never add a forced cache system or trust the presence of an auth-token key.
// The old code treated stale local Supabase tokens as valid, which showed the loading GIF,
// redirected to the dashboard, and eventually opened the Create an account form after the
// account had been deleted. Authentication must always be validated by Supabase first.
// ---------- screens: index.html is only a container, every fullscreen is rendered here ----------
// screen.render('home') is the landing page (nav, hero, 3D scene, in-page views).
// screen.render('dashboard') is the dashboard (browser nav + worlds).
(() => {
  const app = document.getElementById('app');
  if (!app) return;
  const SCREENS = {
    home: () => `
<header class="nav">
  <div class="nav-left"><a class="brand" href="#" aria-label="Qasthra">
    <img src="Sources/Icons/Qasthra.svg" alt="" width="28" height="28">
    <span>Qasthra</span>
  </a>
  </div>
  <div class="nav-group" role="group" aria-label="Sections"><button class="nav-text" type="button" data-view="qa">Q&amp;A</button><button class="nav-text" type="button" data-view="info">Informations</button><button class="nav-text" type="button" data-view="ps">P&amp;S</button></div>
  <div class="nav-right"><button class="nav-text nav-center" type="button" data-view="showcase">Version</button>
  <nav class="nav-links" id="navLinks" aria-label="Primary">
    
    <button class="btn btn-second btn-nav" type="button" data-view="contact">Contact</button>
    <button class="btn btn-second btn-nav" type="button" data-view="support">Support</button>
    <a class="btn btn-second btn-icon btn-nav" href="https://x.com/Qasthra" target="_blank" rel="noopener noreferrer" aria-label="X" title="X">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg><span class="menu-label">X</span>
    </a>
  </nav></div>
<button class="btn btn-second btn-icon btn-menu" id="menuToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
<div class="nav-pop" id="navPop" aria-hidden="true"></div>
</header>

<main class="hero">
  <section class="copy">
    <h1>
      <span class="gray">Browse Data.</span>
      <span class="mono">Reallocated.</span>
    </h1>
    <p class="sub">A browser and a new approach to data allocation, computing where data belongs instead of fetching it. Built by a general technological advancement association.</p>
    <div class="actions">
      <button class="btn btn-mono" id="dashBtn" type="button">Dashboard</button>
      <button class="btn btn-second" id="showBtn" type="button">Version</button>
      <button class="btn btn-second btn-icon" id="themeToggle" type="button" aria-label="Switch to light theme" title="Toggle theme">
        <svg class="ico-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="ico-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
      </button>
    </div>
  </section>

  <section class="stage" aria-hidden="true">
    <div id="scene"></div>
  </section>
</main>





<section class="page" id="page" hidden>
<div class="page-in">
</div>
</section>
`,
    dashboard: () => '<main id="dashRoot"></main>',
    auth: () => '<main id="authRoot"></main>'
  };
  const api = {
    current: '',
    render(name) {
      if (!SCREENS[name]) name = 'home';
      let box = document.getElementById('screen-' + name);
      if (!box) {
        box = document.createElement('div');
        box.id = 'screen-' + name;
        box.innerHTML = SCREENS[name]();
        app.appendChild(box);
      }
      app.querySelectorAll(':scope > div').forEach((d) => { d.hidden = d !== box; });
      if (name === 'dashboard' && api.current !== 'dashboard') document.documentElement.dataset.screenTransition = '1';
      if (name !== 'dashboard' && !window.QBLOCK) delete document.documentElement.dataset.screenTransition;
      document.documentElement.dataset.screen = name;
      api.current = name;
      if (window.QA && window.QA[name]) setTimeout(window.QA[name], 0);
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('resize'));
    },
    route() { const h = location.hash; api.render(/^#dashboard/.test(h) ? 'dashboard' : /^#signin/.test(h) ? 'auth' : 'home'); }
  };
  Object.defineProperty(window, 'screen', { value: api, writable: true, configurable: true });
  api.render('home');            // build the home shell first so the scripts below can find it
  window.addEventListener('hashchange', api.route);
  api.route();
})();

(() => {
  const host = document.getElementById('scene');
  if (!host || typeof THREE === 'undefined') return;

  // Keep the landing page interactive first: Three.js geometry and its animation loop
  // are intentionally initialized during browser idle time instead of blocking first paint.
  const init = () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dark = matchMedia('(prefers-color-scheme: dark)');

  // ---------- renderer ----------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, .1, 200);
  camera.position.set(0, 0, 34);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  host.appendChild(renderer.domElement);
  const root = new THREE.Group();
  scene.add(root);

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);

  // ---------- object: node globe, nearest-neighbor links ----------
  const N = 120;
  const R = 10, pos = [], edges = [], nbr = Array.from({ length: N }, () => []);
  for (let i = 0; i < N; i++) {
    const a = i * 2.399963, y = 1 - 2 * (i + .5) / N, r = Math.sqrt(1 - y * y);
    pos.push(new THREE.Vector3(Math.cos(a) * r * R, y * R, Math.sin(a) * r * R));
  }

  const nodeGeo = new THREE.SphereGeometry(.4, 14, 10);
  const synGeo = new THREE.OctahedronGeometry(1);
  const nodes = new THREE.InstancedMesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), N);
  const K = 4, seen = new Set();
  for (let i = 0; i < N; i++) {
    const d = [];
    for (let j = 0; j < N; j++) if (j !== i) d.push([pos[i].distanceToSquared(pos[j]), j]);
    d.sort((x, y) => x[0] - y[0]);
    for (let n = 0; n < K; n++) {
      const j = d[n][1], key = i < j ? i * N + j : j * N + i;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
      nbr[i].push(edges.length - 1);
      nbr[j].push(edges.length - 1);
    }
  }
  const synCount = edges.length;
  const syns = new THREE.InstancedMesh(synGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), synCount);
  nodes.frustumCulled = syns.frustumCulled = false;

  const dummy = new THREE.Object3D();
  const linePos = new Float32Array(synCount * 6);
  for (let e = 0; e < synCount; e++) {
    {
      const k = e, p = pos[edges[e][0]], q = pos[edges[e][1]];
      linePos.set([p.x, p.y, p.z, q.x, q.y, q.z], k * 6);
      dummy.position.copy(p).lerp(q, .5);
      dummy.scale.setScalar(.09);
      dummy.updateMatrix();
      syns.setMatrixAt(k, dummy.matrix);
    }
  }
  for (let i = 0; i < N; i++) {
    dummy.position.copy(pos[i]);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    nodes.setMatrixAt(i, dummy.matrix);
  }

  const lineCol = new Float32Array(synCount * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const lineAttr = new THREE.BufferAttribute(lineCol, 3);
  lineAttr.setUsage(THREE.DynamicDrawUsage);
  lineGeo.setAttribute('color', lineAttr);
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true }));
  lines.frustumCulled = false;

  root.add(lines, syns, nodes);

  // ---------- theme colours (white on dark site, black on light site) ----------
  const fg = new THREE.Color(), lineBase = new THREE.Color(), nodeBase = new THREE.Color(), tmp = new THREE.Color();
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === 'dark' : dark.matches;
  };
  function theme() {
    if (isDark()) { fg.set('#f5f5f4'); lineBase.set('#1c1c1c'); nodeBase.set('#6b6b6b'); }
    else { fg.set('#0a0a0a'); lineBase.set('#d4d4d8'); nodeBase.set('#8e8e94'); }
  }
  theme();
  dark.addEventListener('change', () => { theme(); lit.fill(1); });
  window.addEventListener('themechange', () => { theme(); lit.fill(1); });

  // ---------- random animation state ----------
  const glowSyn = new Float32Array(synCount);
  const lit = new Uint8Array(synCount).fill(1);
  const glowNode = new Float32Array(N);
  const rnd = (a, b) => a + Math.random() * (b - a);

  const waves = [];
  function pulse() {
    const i = Math.floor(Math.random() * N);
    glowNode[i] = 1;
    waves.push({ f: [i], seen: new Set([i]), t: 0, d: 0 });
    if (Math.random() < .3) {
      const q = Math.floor(Math.random() * N);
      glowNode[q] = 1;
      waves.push({ f: [q], seen: new Set([q]), t: 0, d: 0 });
    }
  }

  let spinV = 0, spinTarget = .15, rotX = .15, rotY = -.35;
  let nextSpin = 0, nextPulse = 0, last = performance.now();

  // ---------- drag / wheel interaction ----------
  let offX = 0, offY = 0, dragging = false, lastTouch = 0, px = 0, py = 0;
  const TAU = Math.PI * 2, MAXX = 1.3;
  const clampX = (v) => Math.max(-MAXX, Math.min(MAXX, v));
  const bump = () => { lastTouch = performance.now(); };
  host.style.touchAction = 'none';
  host.style.userSelect = 'none';
  host.style.cursor = 'grab';
  host.addEventListener('pointerdown', (e) => {
    dragging = true; px = e.clientX; py = e.clientY; bump();
    host.setPointerCapture(e.pointerId);
    host.style.cursor = 'grabbing';
  });
  host.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    if (pinching) return;
    offY += (e.clientX - px) * .008;
    offX = clampX(offX + (e.clientY - py) * .008);
    px = e.clientX; py = e.clientY; bump();
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    host.style.cursor = 'grab';
    bump();
  };
  host.addEventListener('pointerup', release);
  host.addEventListener('pointercancel', release);
  host.addEventListener('lostpointercapture', release);
  host.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey) { zoomBy(e.deltaY * .05); bump(); return; }
    offY += e.deltaX * .004;
    offX = clampX(offX - e.deltaY * .004);
    bump();
  }, { passive: false });

  // ---------- zoom: pinch or ctrl+wheel, clamped so it cannot over-zoom ----------
  const ZMIN = -2, ZMAX = 18;
  let zoomOff = 0, pinching = false, pinchD = 0;
  const pts = new Map();
  const zoomBy = (d) => { zoomOff = Math.max(ZMIN, Math.min(ZMAX, zoomOff + d)); };
  const dist = () => { const [a, b] = [...pts.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  host.addEventListener('pointerdown', (e) => {
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) { pinching = true; pinchD = dist(); }
  });
  host.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinching && pts.size === 2) {
      const d = dist();
      zoomBy(-(d - pinchD) * .08);
      pinchD = d; bump();
    }
  });
  const endPt = (e) => {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinching = false;
    if (pts.size === 1) { const r = [...pts.values()][0]; px = r.x; py = r.y; }
  };
  host.addEventListener('pointerup', endPt);
  host.addEventListener('pointercancel', endPt);
  host.addEventListener('lostpointercapture', endPt);
  const tint = new THREE.Color();

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) { last = now; return; }
    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    const m = reduce ? .15 : 1;

    // random drift: speed and direction change every few seconds, eased
    if (now > nextSpin) {
      spinTarget = rnd(-.45, .45) * (Math.random() < .25 ? 2 : 1);
      nextSpin = now + rnd(2500, 6000);
    }
    spinV += (spinTarget - spinV) * Math.min(1, dt * .8);
    rotY += spinV * dt * m;
    rotX = .18 + Math.sin(now * .00035) * .22 + Math.sin(now * .00091) * .06;
    // after 1.5s without touch, the tilt/turn eases back to the normal face
    if (!dragging && !pinching && now - lastTouch > 1500) {
      offY -= Math.round(offY / TAU) * TAU;
      const back = 1 - Math.exp(-dt * 1.2);
      offX -= offX * back;
      offY -= offY * back;
      zoomOff -= zoomOff * back;
    }
    camera.position.z = 34 + zoomOff;
    root.rotation.set(rotX + offX, rotY + offY, 0);
    root.position.y = Math.sin(now * .0006) * .35;

    if (now > nextPulse) {
      const burst = Math.random() < .3 ? 3 : 1;
      for (let b = 0; b < burst; b++) pulse();
      nextPulse = now + rnd(90, 420) / m;
    }

    for (let w = waves.length - 1; w >= 0; w--) {
      const wv = waves[w];
      if (now < wv.t) continue;
      const nf = [];
      for (const a of wv.f) for (const e of nbr[a]) {
        const o = edges[e][0] === a ? edges[e][1] : edges[e][0];
        glowSyn[e] = Math.max(glowSyn[e], 1 - wv.d * .12); lit[e] = 1;
        if (!wv.seen.has(o)) { wv.seen.add(o); nf.push(o); glowNode[o] = Math.max(glowNode[o], 1 - wv.d * .12); }
      }
      wv.f = nf; wv.d++; wv.t = now + 70 / m;
      if (!nf.length || wv.d > 6) waves.splice(w, 1);
    }
    // decay + write colours
    const decay = Math.exp(-dt * 2.4);
    let changed = false;
    for (let i = 0; i < synCount; i++) {
      let g = glowSyn[i]; if (g < .004 && !lit[i]) continue; changed = true; g *= decay; if (g < .004) { g = 0; lit[i] = 0; } else lit[i] = 1; glowSyn[i] = g;
      tint.copy(lineBase).lerp(fg, g);
      const o = i * 6;
      lineCol[o] = lineCol[o + 3] = tint.r;
      lineCol[o + 1] = lineCol[o + 4] = tint.g;
      lineCol[o + 2] = lineCol[o + 5] = tint.b;
      tmp.copy(nodeBase).lerp(fg, .15 + g * .85);
      syns.setColorAt(i, tmp);
    }
    for (let i = 0; i < N; i++) {
      const g = glowNode[i] *= decay;
      tmp.copy(nodeBase).lerp(fg, .35 + g * .65);
      nodes.setColorAt(i, tmp);
      const s = 1 + g * .7;
      dummy.position.copy(pos[i]);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    if (changed) lineAttr.needsUpdate = true;
    if (changed) syns.instanceColor.needsUpdate = true;
    nodes.instanceColor.needsUpdate = true;
    nodes.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  }

  let visible = true, lastDraw = 0;
  const FRAME_MS = matchMedia('(pointer:coarse)').matches ? 28 : 0;
  if ('IntersectionObserver' in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(host);
  resize();
  requestAnimationFrame(frame);
  };
  const schedule = window.requestIdleCallback ? (fn) => window.requestIdleCallback(fn, { timeout: 900 }) : (fn) => setTimeout(fn, 0);
  const authHint = () => { try { return Object.keys(localStorage).some((k) => /auth-token/i.test(k)); } catch (e) { return false; } };
  const waitStarted = Date.now();
  // This storage check is only a short performance hint; it never authenticates or routes anyone.
  const waitForRoute = () => { if (document.documentElement.dataset.screenTransition === '1' || /^#dashboard/.test(location.hash) || (authHint() && Date.now() - waitStarted < 2500)) { setTimeout(waitForRoute, 180); return; } init(); };
  schedule(waitForRoute);
})();

// ---------- theme toggle (moon / sun) ----------
(() => {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const root = document.documentElement;
  const sys = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : sys.matches);
  const sync = () => btn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  sync();
  btn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
    window.dispatchEvent(new Event('themechange'));
  });
})();

// ---------- mobile menu ----------
(() => {
  const btn = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  const set = (open) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  matchMedia('(min-width:561px)').addEventListener('change', () => set(false));
})();

// ---------- database (Supabase) ----------
// Do not purge auth storage with a one-time flag and do not add a cache workaround here.
// Invalid sessions are cleared by QAUTH.session() after Supabase validates them.
window.db = (window.supabase && window.supabase.createClient) ? window.supabase.createClient('https://hwffsxhonbymzwomhoyd.supabase.co', 'sb_publishable_Rqtyo62gG01MIWkF5Jz8Qw_Xe-UoXCZ', { auth: { flowType: 'pkce' } }) : null;

// ---------- contact & support views: same page, new render, top nav stays ----------
(() => {
  const page = document.getElementById('page');
  const nav = document.querySelector('.nav');
  const menu = document.getElementById('menuToggle');
  if (!page || !nav) return;
  const views = ['qa', 'info', 'ps', 'showcase', 'contact', 'support'];
  const triggers = Array.from(document.querySelectorAll('[data-view]'));
  let pv = '', cur = '', swap; const popEl = document.getElementById('navPop'); const paint = () => { if (popEl) { popEl.classList.toggle('on', !!pv); popEl.setAttribute('aria-hidden', pv ? 'false' : 'true'); popEl.dataset.pv = pv; } triggers.forEach((t) => t.classList.toggle('active', t.dataset.view === pv || t.dataset.view === cur)); }; const setPop = (next) => { clearTimeout(swap); if (pv && next && next !== pv) { pv = ''; paint(); swap = setTimeout(() => { pv = next; paint(); }, 380); } else { pv = next; paint(); } }; const render = () => {
    const h = location.hash.slice(1);
    const v = (h === 'qa' || h === 'ps') ? '' : (views.includes(h) ? h : ''); cur = v; setPop(''); if (v) document.body.dataset.view = v; else delete document.body.dataset.view;
    page.hidden = !v;
    triggers.forEach((t) => t.classList.toggle('active', t.dataset.view === (pv || v)));
    nav.classList.remove('open');
    if (menu) { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); }
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('resize'));
  };
  triggers.forEach((t) => t.addEventListener('click', () => { const q = t.dataset.view === 'qa' || t.dataset.view === 'ps'; if (q) { setPop(pv === t.dataset.view ? '' : t.dataset.view); } else { setPop(''); location.hash = t.dataset.view; } }));
  window.addEventListener('hashchange', render);
  render();
})();
// ---------- nav showcase button: show only when hero showcase button is out of view ----------
(() => {
  const nb = document.querySelector('.nav-center');
  const hb = document.getElementById('showBtn');
  if (!nb || !hb || !('IntersectionObserver' in window)) return;
  new IntersectionObserver((en) => nb.classList.toggle('show', !en[0].isIntersecting)).observe(hb);
})();
// ---------- view renders: informations, contact, support ----------
(() => { const box = document.querySelector('#page .page-in'); if (!box) return; const data = { info: { t: 'Informations', d: ['Everything about how Qasthra works.', 'Guides and references in one place.'] }, contact: { t: 'Contact', d: ['Questions, ideas and partnerships.', 'We reply as soon as we can.'] }, support: { t: 'Support', d: ['Help us improve the service and product.', 'Share suggestions, report bugs or send code.'] } }; const draw = () => { const x = data[location.hash.slice(1)]; if (!x) { box.innerHTML = ''; return; } box.innerHTML = '<header class="view-head"><h2>' + x.t + '</h2><p class="sub">' + x.d[0] + '<br>' + x.d[1] + '</p></header>'; }; window.addEventListener('hashchange', draw); draw(); })();
// ---------- contact & support content: info, safe forms, Supabase ----------
(() => { const box = document.querySelector('#page .page-in'); if (!box) return; const BAD = /[<>{}\[\]`]/; const BAD0 = /[<>{}\[\]()`$;\\|^~"]|--|\/\*|\*\/|&#|%3c|%3e|javascript:|\bor\s+1\s*=\s*1|\b(select|insert|update|delete|drop|union|alter|exec|script|truncate|onerror|onload)\b/i; const EMAIL = /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|proton\.me)$/i; const GH = /^https:\/\/github\.com\/[A-Za-z0-9_.\/-]{1,120}$/; const clean = (s) => String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim(); const PH = { name: 'Your name', email: 'you@example.com', phone: '+63 900 000 0000', link: 'https://github.com/qasthra/Qasthra' }; const AC = { name: 'name', email: 'email', phone: 'tel' }; const inp = (n, l, t, m, req) => '<label class="cs-f"><span>' + l.replace(' *', ' <em>*</em>') + '</span><input name="' + n + '" type="' + t + '" maxlength="' + m + '" autocomplete="' + (AC[n] || 'off') + '" placeholder="' + (PH[n] || '') + '"' + (t === 'tel' ? ' inputmode="tel"' : '') + (req ? ' required' : '') + '></label>'; const area = '<label class="cs-f"><span>Message <em>*</em></span><textarea name="message" rows="5" maxlength="1000" placeholder="Write your message here" required></textarea></label>'; const hp = '<div class="cs-hp" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>'; const tail = '<button class="btn btn-mono cs-send" type="submit">Send message</button><p class="cs-note" role="status" aria-live="polite"></p></form></div>'; const HTML = { contact: '<div class="cs"><div class="cs-info"><div class="cs-card"><i class="cs-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></i><div class="cs-txt"><b>Email</b><a href="mailto:Qasthra@gmail.com">Qasthra@gmail.com</a></div><button class="cs-copy" type="button" data-copy="Qasthra@gmail.com">Copy</button></div><div class="cs-card"><i class="cs-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></i><div class="cs-txt"><b>Phone</b><a href="tel:+639245266251">+63 924 526 6251</a></div><button class="cs-copy" type="button" data-copy="+63 924 526 6251">Copy</button></div></div><form class="cs-form" novalidate data-v="contact"><h3 class="cs-title">Send us a message</h3><p class="cs-hint">Fields marked * are required.</p>' + inp('name', 'Name *', 'text', 60, 1) + '<div class="cs-row">' + inp('email', 'Email *', 'email', 120, 1) + inp('phone', 'Phone *', 'tel', 30, 1) + '</div>' + area + hp + tail, support: '<div class="cs"><div class="cs-info"><div class="cs-card"><i class="cs-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg></i><div class="cs-txt"><b>GitHub</b><a class="cs-stretch" href="https://github.com/qasthra/Qasthra" target="_blank" rel="noopener noreferrer">github.com/qasthra/Qasthra</a></div></div><div class="cs-card"><i class="cs-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg></i><div class="cs-txt"><b>Help us improve</b><span>Suggest features, report bugs or share code.</span></div></div></div><form class="cs-form" novalidate data-v="support"><h3 class="cs-title">Share your idea</h3><p class="cs-hint">Fields marked * are required.</p><div class="cs-row">' + inp('name', 'Name *', 'text', 60, 1) + inp('email', 'Email', 'email', 120, 0) + '</div><div class="cs-row">' + inp('phone', 'Phone', 'tel', 30, 0) + '<label class="cs-f"><span>Type</span><select name="kind"><option value="Suggestion">Suggestion</option><option value="Feature request">Feature request</option><option value="Bug report">Bug report</option><option value="Code contribution">Code contribution</option><option value="Performance issue">Performance issue</option><option value="Security concern">Security concern</option><option value="Design feedback">Design feedback</option><option value="Documentation">Documentation</option><option value="Integration request">Integration request</option><option value="Partnership">Partnership</option><option value="Question">Question</option><option value="Other">Other</option></select></label></div>' + inp('link', 'GitHub', 'url', 200, 0) + area + hp + tail }; const draw = () => { const h = location.hash.slice(1); if (!HTML[h] || box.querySelector('.cs')) return; box.insertAdjacentHTML('beforeend', HTML[h]); }; window.addEventListener('hashchange', draw); draw(); box.addEventListener('submit', async (e) => { const f = e.target.closest('form.cs-form'); if (!f) return; e.preventDefault(); const note = f.querySelector('.cs-note'), btn = f.querySelector('button'); const say = (t, ok) => { note.textContent = ok === 0 ? '' : t; note.dataset.ok = ok === 1 ? '1' : ok === 2 ? '2' : '0'; }; const v = f.dataset.v, d = new FormData(f); if (d.get('website')) { say('Thanks!', 1); f.reset(); return; } const row = {}; for (const k of ['name', 'email', 'phone', 'kind', 'link', 'message']) { if (!d.has(k)) continue; const x = clean(d.get(k)); if (x && BAD.test(x)) { say('Please remove these symbols and try again: < > { } [ ] and backtick.', 0); return; } row[k] = x || null; } if (!row.message || row.message.length < 5) { say('Please write a message of at least 5 characters.', 0); return; } if (!row.name) { say('Please enter your name.', 0); return; } if (v === 'contact' && !row.phone) { say('Please enter your phone number.', 0); return; } if ((v === 'contact' || row.email) && !EMAIL.test(row.email || '')) { say('Please enter a valid email address.', 0); return; } if (row.link && !GH.test(row.link)) { say('Link must start with https://github.com/', 0); return; } if (row.phone && !/^\+?[0-9][0-9 -]{5,18}[0-9]$/.test(row.phone)) { say('Please enter a valid phone number.', 0); return; } try { if (Date.now() - Number(localStorage.getItem('cs_last') || 0) < 30000) { say('Please wait a moment before sending again.', 2); return; } } catch (x) {} if (!window.db) { say('Connection unavailable. Please try again later.', 2); return; } btn.disabled = true; try { const r = await window.db.from(v === 'contact' ? 'contact_messages' : 'support_suggestions').insert([row]); if (r.error) throw r.error; try { localStorage.setItem('cs_last', String(Date.now())); } catch (x) {} f.reset(); say('Sent. Thank you!', 1); } catch (x) { say('Could not send. Please try again later.', 2); } if (window.csGate) window.csGate(f); else btn.disabled = false; }); })();
// ---------- contact & support: copy buttons ---------- (() => { const box = document.querySelector('#page .page-in'); if (!box) return; box.addEventListener('click', (e) => { const b = e.target.closest('.cs-copy'); if (!b) return; const t = b.dataset.copy; const done = () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, 1500); }; const fb = () => { const x = document.createElement('textarea'); x.value = t; x.style.position = 'fixed'; x.style.opacity = '0'; document.body.appendChild(x); x.select(); try { document.execCommand('copy'); done(); } catch (z) {} x.remove(); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fb); else fb(); }); })();





// ---------- hero Version button: tap for A1.00, tap again to restore ----------
(() => { const show = document.getElementById('showBtn'), dash = document.getElementById('dashBtn'); if (!show || !dash) return; const name = show.textContent.trim(); let on = false, busy = false, w0 = 0, vw = window.innerWidth, tm;
const expand = () => { if (busy) return; busy = true; clearTimeout(tm); const s = show.getBoundingClientRect(), d = dash.getBoundingClientRect(); w0 = s.width; dash.style.width = dash.getBoundingClientRect().width + 'px'; const w1 = Math.abs(s.top - d.top) < 6 ? Math.max(s.width, s.right - d.left) : s.width; show.style.width = w0 + 'px'; show.style.marginLeft = '0px'; void show.offsetWidth; on = true; show.textContent = 'A1.00'; show.setAttribute('aria-expanded', 'true'); show.parentElement.classList.add('soon'); show.style.width = w1 + 'px'; show.style.marginLeft = (w0 - w1) + 'px'; setTimeout(() => { busy = false; }, 450); };
const collapse = () => { if (!on || busy) return; busy = true; on = false; show.textContent = name; show.setAttribute('aria-expanded', 'false'); show.parentElement.classList.remove('soon'); show.style.width = w0 + 'px'; show.style.marginLeft = '0px'; tm = setTimeout(() => { show.style.width = ''; show.style.marginLeft = ''; dash.style.width = ''; busy = false; }, 450); };
show.setAttribute('aria-expanded', 'false'); show.addEventListener('click', () => { if (on) collapse(); else expand(); }); dash.addEventListener('click', collapse); window.addEventListener('resize', () => { if (window.innerWidth !== vw) { vw = window.innerWidth; if (on && !busy) collapse(); } });
})();
// ---------- captcha status on the Dashboard button: starts on arrival, retries until verified ----------
(() => {
  const KEY = '0x4AAAAAAGLGlnJ2L6nuIdEP';
  const btn = document.getElementById('dashBtn');
  if (!btn) return;
  const idle = btn.textContent.trim();
  const SVG = (d) => '<svg class="cap-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  const SPIN = '<i class="cap-spin" aria-hidden="true"></i>';
  const VIEW = { check: [SPIN, 'Checking'], ok: [SVG('M5 12.5l4.5 4.5L19 7.5'), 'Verified'], bad: [SVG('M6 6l12 12M18 6L6 18'), 'Crashed'], retry: [SPIN, 'Retrying'] };
  const box = document.createElement('div');
  box.id = 'capBox';
  document.body.appendChild(box);
  let state = '', tok = '', wid = null, wait = 0, hold = 0, tries = 0;
  const onDash = () => /^#dashboard/.test(location.hash);
  const stop = () => { clearTimeout(wait); clearTimeout(hold); tries = 0; tok = ''; try { if (wid !== null && window.turnstile) window.turnstile.remove(wid); } catch (e) {} wid = null; box.innerHTML = ''; box.classList.remove('chal'); };
  const set = (s) => {
    state = s;
    clearTimeout(hold);
    document.documentElement.dataset.cap = s;
    btn.dataset.cap = s;
    btn.innerHTML = VIEW[s][0] + '<span>' + VIEW[s][1] + '</span>';
    if (s === 'ok') hold = setTimeout(() => { if (state === 'ok') btn.textContent = idle; }, 2000);
    window.dispatchEvent(new Event('capchange'));
  };
  const crash = () => {
    tok = '';
    clearTimeout(wait);
    set('bad');
    wait = setTimeout(() => { set('retry'); start(); }, 1000);
    return true;
  };
  const start = () => {
    clearTimeout(wait);
    if (onDash()) { stop(); return; }
    const t = window.turnstile;
    if (!t) { if (++tries > 50) { tries = 0; crash(); } else wait = setTimeout(start, 200); return; }
    tries = 0;
    try {
      if (wid !== null) t.remove(wid);
    } catch (e) {}
    wid = null;
    box.innerHTML = '';
    box.classList.remove('chal');
    try {
      wid = t.render(box, {
        sitekey: KEY, action: 'auth', theme: document.documentElement.dataset.theme || 'auto', size: 'flexible', appearance: 'interaction-only', retry: 'never', 'refresh-expired': 'manual', 'refresh-timeout': 'manual',
        callback: (v) => { tok = v; box.classList.remove('chal'); set('ok'); },
        'before-interactive-callback': () => { box.classList.add('chal'); },
        'after-interactive-callback': () => { box.classList.remove('chal'); },
        'expired-callback': () => { tok = ''; set('check'); start(); },
        'timeout-callback': crash,
        'unsupported-callback': crash,
        'error-callback': crash
      });
    } catch (e) { crash(); }
  };
  btn.setAttribute('aria-live', 'polite');
  let was = onDash();
  window.addEventListener('hashchange', () => { const d = onDash(); if (d === was) return; was = d; if (d) stop(); else { set('check'); start(); } });
  window.CAP = { state: () => state, token: () => tok, fresh: () => { tok = ''; set('check'); start(); } };
  set('check'); start();
})();

// ---------- qasthra auth (one form: sign in or set up) + dashboard alpha ----------
(() => {
  const KEY = '0x4AAAAAAGLGlnJ2L6nuIdEP';
  const $ = (s, r) => (r || document).querySelector(s);
  const html = document.documentElement;
  const sys = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (html.dataset.theme ? html.dataset.theme === 'dark' : sys.matches);
  const flip = () => { const n = isDark() ? 'light' : 'dark'; html.dataset.theme = n; try { localStorage.setItem('theme', n); } catch (e) {} window.dispatchEvent(new Event('themechange')); };
  document.addEventListener('click', (e) => { if (e.target.closest('[data-theme-btn]')) flip(); });
  // One auth gate for the whole app. getSession() reads local state; getUser() validates it
  // with Supabase. A missing user or a rejected token means the local session is invalid. A network error (offline) keeps it.
  const clearInvalid = async () => { try { await window.db.auth.signOut({ scope: 'local' }); } catch (e) {} }; const net = (e) => !!e && (e.name === 'AuthRetryableFetchError' || e.status === 0 || e.status >= 500 || navigator.onLine === false);
  let sP = null; const session = () => { if (sP) return sP; const p = session0().then((r) => { if (!r && sP === p) sP = null; return r; }, () => { if (sP === p) sP = null; return null; }); sP = p; setTimeout(() => { if (sP === p) sP = null; }, 8000); return p; }; const session0 = async () => {
    try {
      if (!window.db) return null;
      const r = await window.db.auth.getSession();
      const s = r.data && r.data.session;
      if (!s) return null;
      const u = await window.db.auth.getUser();
      if (u.error || !u.data || !u.data.user) { if (net(u.error)) return s; await clearInvalid(); return null; }
      return s;
    } catch (e) { if (!net(e)) await clearInvalid(); return null; }
  };
  let veilTimer = 0, veilRemoveTimer = 0;
  const showVeil = (src, ms) => new Promise((resolve) => {
    clearTimeout(veilTimer); clearTimeout(veilRemoveTimer);
    const fallback = 'Sources/Videos/Qasthra.gif';
    let L = document.getElementById('qload');
    if (!L) { L = document.createElement('div'); L.id = 'qload'; L.setAttribute('aria-hidden', 'true'); document.body.appendChild(L); }
    L.classList.remove('out'); L.innerHTML = '<img alt="">';
    const img = L.querySelector('img'); img.src = src || fallback;
    img.onerror = () => { if (img.src.indexOf(fallback) < 0) img.src = fallback; };
    const finish = () => { if (window.QWAIT) { veilTimer = setTimeout(finish, 150); return; } L.classList.add('out'); veilRemoveTimer = setTimeout(() => { if (L.parentNode) L.remove(); if (src && /intro/i.test(src)) delete document.documentElement.dataset.screenTransition; resolve(); }, 400); }; veilTimer = setTimeout(finish, ms || 2200);
  });
  const hideVeil = () => { clearTimeout(veilTimer); clearTimeout(veilRemoveTimer); const L = document.getElementById('qload'); if (L) L.remove(); };
  const signOut = async () => { sP = null; window.QBLOCK = true; document.documentElement.dataset.screenTransition = '1'; const veil = showVeil('Sources/Videos/Qasthra_outro.gif', 4300); try { if (window.db) await window.db.auth.signOut({ scope: 'local' }); } catch (e) {} sP = null; await veil; location.hash = ''; hideVeil(); window.QBLOCK = false; delete document.documentElement.dataset.screenTransition; };
  window.QAUTH = { session, showVeil, hideVeil, signOut };
  const clean = (s) => String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  const EMAIL = /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|proton\.me)$/i;
  // Account identifiers accept only letters, numbers, underscore, and hyphen.
  // Full names are validated separately as letters and spaces only below.
  const USER = /^[a-z][a-z0-9_-]{4,24}$/;
  const RESERVED = ['admin', 'administrator', 'root', 'system', 'support', 'help', 'staff', 'team', 'official', 'security', 'moderator', 'owner', 'founder', 'anonymous', 'username', 'dashboard', 'signin', 'signup', 'login', 'logout', 'settings', 'account', 'billing', 'contact', 'terms', 'privacy', 'null', 'undefined', 'github', 'notion'];
  const BLOCKED = ['fuck', 'shit', 'bitch', 'cunt', 'nigg', 'fagg', 'rape', 'nazi', 'hitler', 'porn'];
  const userErr = (u) => {
    if (!USER.test(u) || /(__|--|_-|-_)/.test(u) || /[_-]$/.test(u)) return 'Usernames are 5 to 25 characters: letters, numbers, _ and -, starting with a letter.';
    const flat = u.replace(/[_-]/g, '');
    if (RESERVED.indexOf(u) >= 0 || flat.indexOf('qasthra') >= 0) return 'That username is reserved. Pick another one.';
    if (BLOCKED.some((w) => flat.indexOf(w) >= 0)) return 'That username is not allowed. Pick another one.';
    return '';
  };
  // hidden login address: Supabase signs in with an email, the person only ever sees the username. Change this one line to use your own domain.
  const addr = (u) => 'qasthra+' + u + '@gmail.com';
  const ageOf = (iso) => { const b = new Date(iso); if (isNaN(b)) return -1; const n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; return a; };
  const X = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const LP = () => window.libphonenumber;
  const loadLP = () => { if (window.libphonenumber || document.getElementById('lpjs')) return; const s = document.createElement('script'); s.id = 'lpjs'; s.src = 'https://cdn.jsdelivr.net/npm/libphonenumber-js@1/bundle/libphonenumber-min.js'; s.async = true; document.head.appendChild(s); };
  const fmtPhone = (raw) => {
    const s = String(raw || '').replace(/[^0-9+]/g, '');
    if (!s) return '';
    const plus = s.charAt(0) === '+';
    let d = s.replace(/[+]/g, '');
    if (!plus) {
      if (d.charAt(0) === '0') d = d.slice(1);
      if (!(d.slice(0, 2) === '63' && d.length >= 11)) d = '63' + d;
    }
    if (!d) return '+';
    d = d.slice(0, 15);
    if (d.slice(0, 2) === '63') {
      const n = d.slice(2, 12);
      return '+63' + (n ? ' ' + [n.slice(0, 3), n.slice(3, 6), n.slice(6, 10)].filter(Boolean).join(' ') : '');
    }
    const L = LP();
    if (L && L.AsYouType) {
      try {
        if (L.validatePhoneNumberLength) { while (d.length > 3 && L.validatePhoneNumberLength('+' + d) === 'TOO_LONG') d = d.slice(0, -1); }
        return new L.AsYouType().input('+' + d);
      } catch (e) {}
    }
    return '+' + d.replace(/(.{3})(?=.)/g, '$1 ');
  };
  const phoneOk = (v) => {
    const d = String(v || '').replace(/[^0-9]/g, '');
    if (d.slice(0, 2) === '63') return d.length === 12;
    const L = LP();
    if (L && L.parsePhoneNumberFromString) { try { const p = L.parsePhoneNumberFromString('+' + d); return !!(p && p.isValid()); } catch (e) { return false; } }
    return d.length >= 8 && d.length <= 15;
  };
  const opt = (a) => a.map((v) => '<option value="' + v + '">' + v + '</option>').join('');
  const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const nums = (a, b, step) => { let o = ''; for (let i = a; step > 0 ? i <= b : i >= b; i += step) o += '<option value="' + i + '">' + i + '</option>'; return o; };
  const DOB = '<div class="au-3"><select name="bm" aria-label="Birth month"><option value="">Month</option>' + MON.map((m, i) => '<option value="' + (i + 1) + '">' + m + '</option>').join('') + '</select><select name="bd" aria-label="Birth day"><option value="">Day</option>' + nums(1, 31, 1) + '</select><select name="by" aria-label="Birth year"><option value="">Year</option>' + nums(new Date().getFullYear() - 13, 1900, -1) + '</select><input name="birthday" type="hidden"></div>';
  const field = (n, l, t, m, ph, ac, req, x) => '<label class="cs-f"><span>' + l + (req ? ' <em>*</em>' : '') + '</span><input name="' + n + '" type="' + t + '" maxlength="' + m + '" placeholder="' + ph + '" autocomplete="' + ac + '"' + (x ? ' ' + x : '') + '></label>';

  const AUTH = '<div class="au"><header class="au-bar"><a class="brand" href="#" aria-label="Qasthra"><img src="Sources/Icons/Qasthra.svg" alt="" width="28" height="28"><span>Qasthra</span></a></header>'
    + '<main class="au-main"><form class="au-card" novalidate>'
    + '<div><h2 class="au-title">Welcome to Qasthra</h2><p class="au-sub">Sign in with your username and password. No account yet? Just type the username and password you want, then we will help you set it up.</p></div>'
    + field('username', 'Username', 'text', 25, 'yourname', 'username', 1, 'autocapitalize="none" autocorrect="off" spellcheck="false"')
    + '<label class="cs-f"><span>Password <em>*</em></span><div class="au-pw"><input name="password" type="password" maxlength="72" placeholder="At least 8 characters" autocomplete="current-password"><button class="au-show" type="button">Show</button></div></label>'
    + '<div class="au-setup-w" inert><div><div class="au-setup">'
    + '<div class="au-2">' + field('remail', 'Email', 'email', 120, '', 'email', 1)
    + field('phone', 'Phone', 'tel', 24, '', 'tel', 1, 'inputmode="tel"') + '</div>' + field('name', 'Name', 'text', 60, 'Full name', 'name', 1)
    + '<div class="cs-f"><span>Birthday <em>*</em><i class="au-age"></i></span>' + DOB + '</div>'
    + '<div class="au-2"><label class="cs-f"><span>Gender <em>*</em></span><select name="gender"><option value="">Select</option>' + opt(['Man', 'Woman', 'Non-binary', 'Prefer not to say']) + '</select></label>'
    + '<label class="cs-f"><span>Sex <em>*</em></span><select name="sex"><option value="">Select</option>' + opt(['Male', 'Female', 'Intersex', 'Prefer not to say']) + '</select></label></div>'
    + '<details class="au-more"><summary>More details (optional)</summary><div class="au-opt">'
    + field('home', 'Home address', 'text', 160, 'Street, city, country', 'street-address', 0)
    + field('work', 'Work address', 'text', 160, 'Street, city, country', 'off', 0)
    + '<label class="cs-f"><span>Language</span><select name="lang"><option value="">Select</option>' + opt(['English', 'Filipino', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Ukrainian', 'Polish', 'Turkish', 'Arabic', 'Hebrew', 'Persian', 'Hindi', 'Bengali', 'Urdu', 'Tamil', 'Indonesian', 'Malay', 'Thai', 'Vietnamese', 'Chinese', 'Japanese', 'Korean', 'Swahili', 'Cebuano', 'Ilocano', 'Other']) + '</select></label>'
    + '<label class="cs-f"><span>About <i class="au-age au-cnt">(260)</i></span><textarea name="bio" rows="3" maxlength="260" placeholder="A short bio"></textarea></label></div></details>'
    + '</div></div></div>'
    + '<button class="btn btn-mono au-go" type="submit">Continue</button>'
    + '<p class="au-note" role="status" aria-live="polite"></p>'
    + '<div class="au-why">'
    + '<p>Google and Apple sign-in are not supported. Qasthra stands on its own foundations and technologies.</p>'
    + '<p>By continuing you agree and have read:</p><p class="au-links"><a href="#" data-pop="licenses">Licenses and Policies</a> | <a href="#" data-pop="terms">Terms and Conditions</a> | <a href="#" data-pop="guidance">Guidance</a> | <a href="#" data-pop="recovery">Recovery</a> | <a href="#" data-pop="certificates">Certificates</a></p></div>'
    + '</form></main></div>';

  const DASH = '<div class="qa"><header class="qa-bar" id="qbHost"></header><main class="qa-view"></main></div>';

  const QA = window.QA = {};

  QA.auth = () => {
    const host = $('#authRoot');
    if (!host) return;
    if (!window.db) { host.textContent = 'Auth is not available. Check your connection.'; return; }
    session().then((s) => { if (s) location.hash = 'dashboard'; });
    host.innerHTML = AUTH;
    const card = $('.au-card', host), note = $('.au-note', host), btn = $('.au-go', host), setup = $('.au-setup-w', host), pw = $('[name=password]', host), age = $('.au-age', host);
    const title = $('.au-title', host), sub = $('.au-sub', host);
    let mode = 'in', busy = false;
    const say = (t) => { note.textContent = t || ''; };
    const onCap = () => {
      if (!note.isConnected) { window.removeEventListener('capchange', onCap); return; }
      if (window.CAP.state() === 'ok' && /security check/i.test(note.textContent)) say('');
    };
    window.addEventListener('capchange', onCap);
    let cpass = '';
    const fresh = () => { if (!cpass) window.CAP.fresh(); };
    const toUp = () => { loadLP(); mode = 'up'; card.classList.add('up'); setup.inert = false; pw.autocomplete = 'new-password'; btn.textContent = 'Confirm'; title.textContent = 'Create your Account'; sub.textContent = 'This username is free. Choose a password and add a few details to create your account.'; };
    const toIn = () => { mode = 'in'; card.classList.remove('up'); setup.inert = true; pw.autocomplete = 'current-password'; btn.textContent = 'Continue'; title.textContent = 'Welcome to Qasthra'; sub.textContent = 'Sign in with your username and password. No account yet? Just type the username and password you want, then we will help you set it up.'; };
    const PWERR = 'Password is incorrect or username already taken.';
    const TAKEN = 'Username already taken. Choose another one.';
    const wipe = () => { ['remail', 'phone', 'name', 'home', 'work', 'lang', 'bio', 'bm', 'bd', 'by', 'gender', 'sex', 'birthday'].forEach((n) => { const el = $('[name=' + n + ']', host); if (el) el.value = ''; }); age.textContent = ''; const c = $('.au-cnt', host); if (c) c.textContent = '(260)'; };
    const backToSignIn = () => { toIn(); wipe(); };
    const seen = new Map(); let exists = null, tmr = 0, seq = 0;
    const un = $('[name=username]', host), nameInput = $('[name=name]', host);
    const NAME = /^\p{L}+(?:\s+\p{L}+)*$/u;
    const cleanNameInput = (v) => String(v || '').replace(/[^\p{L}\s]/gu, '').replace(/\s+/g, ' ').slice(0, 60);
    const LK = []; const lookup = async (u) => { if (seen.has(u)) return seen.get(u); const t = Date.now(); while (LK.length && t - LK[0] > 60000) LK.shift(); if (LK.length >= 5 || (LK.length && t - LK[LK.length - 1] < 1500)) return null; LK.push(t); try { const r = await window.db.rpc('username_exists', { u: u }); if (r.error) return null; seen.set(u, r.data === true); return r.data === true; } catch (e) { return null; } };
    const settle = (has) => { exists = has; if (has === false) { say(mode === 'up' ? '' : 'This username is free. Press Continue to create your account.'); } else if (has === true) { say(mode === 'up' ? TAKEN : 'Account found. Enter your password to sign in.'); } };
    const check = async () => { const u = clean(un.value).toLowerCase(); if (userErr(u)) { exists = null; return null; } const my = ++seq; const has = await lookup(u); if (my !== seq) return null; if (has !== null) settle(has); return has; };
    un.addEventListener('input', () => { un.value = un.value.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 25); clearTimeout(tmr); ++seq; exists = null; if (mode === 'up') backToSignIn(); say(''); });
    un.addEventListener('blur', () => { clearTimeout(tmr); });
    $('.au-show', host).addEventListener('click', (e) => { const on = pw.type === 'password'; pw.type = on ? 'text' : 'password'; e.currentTarget.textContent = on ? 'Hide' : 'Show'; });
    const bm = $('[name=bm]', host), bdy = $('[name=bd]', host), by = $('[name=by]', host), bh = $('[name=birthday]', host);
    const dob = () => { const y = by.value, m = bm.value, dd = bdy.value; if (!y || !m || !dd) { bh.value = ''; age.textContent = ''; return; } const dt = new Date(+y, +m - 1, +dd); if (dt.getMonth() !== +m - 1) { bh.value = ''; age.textContent = 'Check date'; return; } bh.value = y + '-' + String(m).padStart(2, '0') + '-' + String(dd).padStart(2, '0'); const a = ageOf(bh.value); age.textContent = a >= 0 && a < 150 ? 'Age ' + a : ''; };
    [bm, bdy, by].forEach((x) => x.addEventListener('change', dob));
    const ph = $('[name=phone]', host);
    nameInput.addEventListener('input', () => { nameInput.value = cleanNameInput(nameInput.value); });
    loadLP();
    pw.addEventListener('input', () => { if (mode === 'up') { backToSignIn(); say(''); } });
    ph.addEventListener('input', () => { const f = fmtPhone(ph.value); if (f !== ph.value) ph.value = f; });
    const bio = $('[name=bio]', host), cnt = $('.au-cnt', host);
    bio.addEventListener('input', () => { cnt.textContent = '(' + Math.max(0, 260 - bio.value.length) + ')'; });
    card.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (busy) return;
      const cs = window.CAP.state();
      if (cs !== 'ok' && !cpass) { say(cs === 'bad' ? 'Security check crashed. Retrying shortly.' : cs === 'retry' ? 'Retrying the security check. Please wait.' : 'Security check in progress. Please wait.'); return; }
      const d = new FormData(card);
      const uname = clean(d.get('username')).toLowerCase(), pass = String(d.get('password') || '');
      const ue = userErr(uname);
      if (!uname) { say('Enter your username.'); return; }
      if (ue) { say(ue); return; }
      const email = addr(uname);
      if (mode === 'up') { seen.delete(uname); const h1 = await lookup(uname); if (h1 === true) { exists = true; say(TAKEN); return; } if (h1 === null) { say('Could not check this username. Try again in a moment.'); return; } }
      if (mode === 'in') { if (exists === null) { busy = true; btn.disabled = true; const has0 = await lookup(uname); busy = false; btn.disabled = false; if (has0 !== null) exists = has0; else { say('Could not check this username. Try again in a moment.'); return; } } if (exists === false) { toUp(); say('This username is free. Choose a password and fill in the details to create your account.'); return; } }
      if (!pass) { say('Enter your password.'); return; }
      if (pass.length < 8) { say('Your password needs at least 8 characters.'); return; }
      let meta = null;
      if (mode === 'up') {
        const name = clean(d.get('name')), phone = clean(d.get('phone')), bd = String(d.get('birthday') || ''), gender = d.get('gender'), sex = d.get('sex'), link = clean(d.get('link'));
        const a = ageOf(bd);
        const rem = clean(d.get('remail')).toLowerCase();
        if (!EMAIL.test(rem)) { say('Use a Gmail, Yahoo, Outlook, Hotmail, iCloud or Proton email.'); return; }
        if (!NAME.test(name)) { say('Full name may contain letters and spaces only.'); return; }
        if (!phoneOk(phone)) { say('Enter a complete phone number.'); return; }
        if (a < 0 || a > 120) { say('Enter your birthday.'); return; }
        if (a < 13) { say('You must be at least 13 to create an account.'); return; }
        if (!gender || !sex) { say('Choose your gender and sex, or Prefer not to say.'); return; }
        meta = { username: uname, recovery_email: rem, full_name: name, phone: phone, birthday: bd, age: a, gender: gender, sex: sex, link: link || null, address_home: clean(d.get('home')) || null, address_work: clean(d.get('work')) || null, language: clean(d.get('lang')) || null, bio: clean(d.get('bio')) || null };
      }
      const tok = window.CAP.token();
      busy = true; btn.disabled = true; say('');
      try {
        if (mode === 'in') {
          let r;
          try {
            const q = await fetch('https://hwffsxhonbymzwomhoyd.supabase.co/functions/v1/sign-in', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: 'sb_publishable_Rqtyo62gG01MIWkF5Jz8Qw_Xe-UoXCZ' }, body: JSON.stringify({ email: email, password: pass, captchaToken: cpass ? '' : tok, pass: cpass }) });
            const j = await q.json();
            if (j.pass) cpass = j.pass;
            if (q.status === 403) { cpass = ''; say(j.message); window.CAP.fresh(); return; }
            if (q.status === 429) { say(j.message || 'Too many attempts. Try again later.'); fresh(); return; }
            r = (q.ok && j.access_token) ? await window.db.auth.setSession({ access_token: j.access_token, refresh_token: j.refresh_token }) : { error: { message: 'Invalid login credentials' } };
          } catch (x) { r = { error: { message: 'Something went wrong. Try again.' } }; }
          if (!r.error) { location.hash = 'dashboard'; return; }
          if (/invalid login|invalid credentials/i.test(r.error.message)) { say(PWERR); } else say(r.error.message);
          fresh();
          return;
        }
        let r;
        try {
          const q = await fetch('https://hwffsxhonbymzwomhoyd.supabase.co/functions/v1/sign-in', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: 'sb_publishable_Rqtyo62gG01MIWkF5Jz8Qw_Xe-UoXCZ' }, body: JSON.stringify({ action: 'signup', email: email, password: pass, data: meta, captchaToken: cpass ? '' : tok, pass: cpass }) });
          const j = await q.json();
          if (j.pass) cpass = j.pass;
          if (q.status === 403) { cpass = ''; say(j.message); window.CAP.fresh(); return; }
          if (!q.ok) { r = { error: { message: j.msg || j.message || 'Could not create the account.' } }; }
          else { if (j.access_token) await window.db.auth.setSession({ access_token: j.access_token, refresh_token: j.refresh_token }); r = { data: { session: j.access_token ? j : null, user: j.user || j } }; }
        } catch (x) { r = { error: { message: 'Something went wrong. Try again.' } }; }
        if (r.error) {
          if (/already|registered/i.test(r.error.message)) { exists = true; say(TAKEN); } else say(r.error.message);
          fresh();
          return;
        }
        if (r.data && r.data.session) { location.hash = 'dashboard'; } else if (r.data && r.data.user && r.data.user.identities && r.data.user.identities.length === 0) { exists = true; say(TAKEN); fresh(); } else { toIn(); say('Account created. Sign in to continue.'); fresh(); }
      } catch (x) { say('Something went wrong. Try again.'); fresh(); } finally { busy = false; btn.disabled = false; }
    });
  };

  QA.dashboard = () => {
    const host = $('#dashRoot');
    if (!host) return;
    host.innerHTML = DASH;
    if (!window.db) { location.hash = ''; return; }
    session().then((s) => { if (!s) location.hash = 'signin'; });
  };


  const go = document.getElementById('dashBtn');
  if (go) go.addEventListener('click', async () => {
    if (!window.db) { alert('Auth is not available. Check your connection.'); return; }
    if (await session()) { location.hash = 'dashboard'; return; }
    if (window.CAP.state() !== 'ok') return;
    location.hash = 'signin';
  });
})();
/* ---------- qb: browser top nav on the dashboard ---------- */
(() => {
const Q = window.QA; if (!Q || !Q.dashboard) return;
const $ = (s, r) => (r || document).querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + ';');
const uid = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), (x) => (x % 36).toString(36)).join('');
const ld = (k, d) => { try { const v = localStorage.getItem('qb:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const sv = (k, v) => { try { localStorage.setItem('qb:' + k, JSON.stringify(v)); } catch (e) {} };
const ic = (d) => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = { left: ic('<path d="M15 6l-6 6 6 6"/>'), right: ic('<path d="M9 6l6 6-6 6"/>'), up: ic('<path d="M6 15l6-6 6 6"/>'), down: ic('<path d="M6 9l6 6 6-6"/>'), reload: ic('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'), plus: ic('<path d="M12 5v14M5 12h14"/>'), x: ic('<path d="M6 6l12 12M18 6L6 18"/>'), clock: ic('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'), star: ic('<path d="M12 4l2.4 5 5.6.7-4.1 3.8 1 5.5-4.9-2.7-4.9 2.7 1-5.5L4 9.7 9.6 9z"/>'), xfer: ic('<path d="M8 4v14M4 14l4 4 4-4M16 20V6M12 10l4-4 4 4"/>'), plug: ic('<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>'), lock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'), unlock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.4-2"/>'), minus: ic('<path d="M5 12h14"/>'), search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'), gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>') };
/* coordinates: X=1028, Y=-92810, Z=1029.202 ; a run of one digit may be written 1{10} (only when the run is continuous) */
const DIG = /^(\d)(?:\{(\d{1,9})\})?/;
const rle = (s) => { const r = []; let i = 0; while (i < s.length) { const m = DIG.exec(s.slice(i)); if (!m) return null; const b = !!m[2], n = b ? +m[2] : 1, l = r[r.length - 1]; if (b && n < 2) return null; if (l && l.d === m[1]) { if (b || l.b) return null; l.n += 1; } else r.push({ d: m[1], n: n, b: b }); i += m[0].length; } return r.length ? r : null; };
const axis = (s) => { const m = /^([+-]?)([0-9{}]+)(?:\.([0-9{}]+))?$/.exec(s.trim()); if (!m) return null; const a = rle(m[2]), f = m[3] ? rle(m[3]) : []; if (!a || !f) return null; const len = a.reduce((t, x) => t + x.n, 0), zero = a.length === 1 && a[0].d === '0', mag = len - 1 + Math.log10(Math.max(1, +a[0].d)), p = zero ? 0 : Math.min(46, 4 + 5 * Math.log2(2 + mag)); return { raw: m[1] + m[2] + (m[3] ? '.' + m[3] : ''), p: m[1] === '-' ? -p : p }; };
const coords = (q) => { q = q.trim().replace(/^[("']+|[)"']+$/g, ''); const w = q.split(','); if (w.length !== 3) return null; const o = {}; for (let i = 0; i < 3; i++) { const m = /^\s*([XYZxyz])\s*=\s*(.+)$/.exec(w[i]); if (!m || m[1].toUpperCase() !== 'XYZ'.charAt(i)) return null; const v = axis(m[2]); if (!v) return null; o[m[1].toUpperCase()] = v; } return o; };
const ctext = (c) => 'X=' + c.X.raw + ', Y=' + c.Y.raw + ', Z=' + c.Z.raw;
/* state */
const TIERS = ['Core', 'Orbit', 'Archive'];
const PLUGS = [['shield', 'Shield', 'Blocks trackers inside a World.'], ['reader', 'Reader', 'A clean reading layout.']];
/* PUBLIC / PRIVATE (acstatus) - DESIGN NOTE, DO NOT REMOVE
   Yoan's intent: this is a SECURITY status, not a privacy or anonymity feature.
   It marks whether the account's browser activity is secured (encryption and decryption of user browser activity) or not.
   It is only a localStorage flag: key qb:acstatus, value Public or Private, same on every device.
   It must never create tabs, dots or private Worlds. No Supabase and no SQL for now.
   Encryption itself is NOT built yet. This flag is the hook for it.
   Nothing else may depend on it: no history, favorites, sync or tab-saving rules, and no dashed or dotted UI. */
const st = { worlds: [], active: '', priv: ld('acstatus', 'Public') === 'Private', panel: '', tab: 'search', hist: ld('hist', []), saved: ld('saved', []), xfer: [], plug: ld('plug', {}), sync: ld('sync', false) };
/* Qasthra.qst is a placeholder. It is the page the universe (X=0, Y=0, Z=0, the Qasthra tab) will load the way a site loads index.html. Nothing reads it yet. Other sites still read their text from the Supabase sites.qst column. */
const HOME_QST = 'Qasthra.qst';
const QZ = 'X=0, Y=0, Z=0', QMSG = 'Only 2 Qasthra tabs are allowed.';
const qfull = (w) => st.worlds.filter((x) => x !== w && title(x) === 'Qasthra').length >= 2;
const nw = () => ({ id: uid(), tr: [{ k: 'universe', q: '' }], i: 0 });
st.worlds = ld('worlds', []).filter((w) => w && Array.isArray(w.tr) && w.tr[w.i]);
const ent = (w) => w.tr[w.i];
const cur = () => st.worlds.find((w) => w.id === st.active) || st.worlds[0];
const title = (w) => { const e = ent(w); return e.k === 'universe' ? 'Qasthra' : e.k === 'coord' ? siteTitle(e.c) : e.q; };
const on = (k) => (k === 'hud' ? st.plug.hud !== false : !!st.plug[k]);
let kt = 0; const keep = () => { sv('worlds', st.worlds); if (st.sync) { clearTimeout(kt); kt = setTimeout(() => push(), 1500); } };
const ago = (t) => { const s = Math.max(0, (Date.now() - t) / 1000); return s < 60 ? 'now' : s < 3600 ? Math.floor(s / 60) + 'm' : s < 86400 ? Math.floor(s / 3600) + 'h' : Math.floor(s / 86400) + 'd'; };
const size = (n) => (n < 1024 ? n + ' B' : n < 1048576 ? Math.round(n / 1024) + ' KB' : (n / 1048576).toFixed(1) + ' MB');
const say = () => {};
/* sync with Supabase (tables worlds_saved and worlds_history), manual on and off */
const who = async () => { try { const r = await window.db.auth.getSession(); return r.data.session.user.id; } catch (e) { return null; } };
const push0 = async () => { if (!st.sync || !window.db) return; await flush(); await pushTabs(); await push1(); }; const push1 = async () => { if (!st.sync || !window.db) return; const u = await who(); if (!u) return; try { await window.db.from('worlds_saved').upsert(st.saved.map((s) => ({ id: s.id, user_id: u, title: s.title, q: s.q, tier: s.tier, at: s.at })), { onConflict: 'id' }); await window.db.from('worlds_history').upsert(st.hist.map((h) => ({ id: h.id, user_id: u, kind: h.k, q: h.q, at: h.at })), { onConflict: 'id' }); } catch (e) {} };
const pull0 = async () => { if (!st.sync) return; await flush(); await pullTabs(); await pull1(); }; const pull1 = async () => { if (!window.db) return; const u = await who(); if (!u) return; try { const a = await window.db.from('worlds_saved').select('*').eq('user_id', u), b = await window.db.from('worlds_history').select('*').eq('user_id', u).order('at', { ascending: false }).limit(200); (a.data || []).forEach((r) => { if (!st.saved.some((s) => s.id === r.id)) st.saved.push({ id: r.id, title: r.title, q: r.q, tier: r.tier, at: Number(r.at) }); }); (b.data || []).forEach((r) => { if (!st.hist.some((h) => h.id === r.id)) st.hist.push({ id: r.id, k: r.kind, q: r.q, at: Number(r.at) }); }); st.hist.sort((x, y) => y.at - x.at); st.hist.length = Math.min(st.hist.length, 200); sv('saved', st.saved); sv('hist', st.hist); } catch (e) {} };
const pushTabs = async () => { const u = await who(); if (!u) return; const rows = st.worlds.map((w, n) => { const e = ent(w); return { id: w.id, user_id: u, pos: n, k: e.k, q: e.q, at: Date.now() }; }); try { if (rows.length) await window.db.from('worlds_open').upsert(rows, { onConflict: 'id' }); let d = window.db.from('worlds_open').delete().eq('user_id', u); if (rows.length) d = d.not('id', 'in', '(' + rows.map((r) => '"' + r.id + '"').join(',') + ')'); await d; } catch (e) {} }; const pullTabs = async () => { if (!window.db) return; const u = await who(); if (!u) return; try { const r = await window.db.from('worlds_open').select('*').eq('user_id', u).order('pos', { ascending: true }); const rows = r.data || []; if (!rows.length) return; if (st.worlds.some((w) => ent(w).k !== 'universe')) return; let n = 0; rows.forEach((x) => { if (x.k === 'universe' || st.worlds.some((w) => w.id === x.id)) return; const c = x.k === 'coord' ? coords(x.q) : null; const e = c ? { k: 'coord', q: ctext(c), c: c } : x.k === 'search' ? { k: 'search', q: String(x.q).slice(0, 200) } : null; if (!e) return; st.worlds.push({ id: x.id, tr: [e], i: 0 }); n++; }); if (n && $('#qbHost')) { keep(); draw(); } } catch (e) {} }; let syncB = 0;
const SYNC_T = { off: 'Sync off, tap to turn on', on: 'Sync on and up to date, tap to turn off', busy: 'Syncing, tap to turn off', err: 'Sync paused, you are offline. Tap to turn off' };
const syncState = () => (!st.sync ? 'off' : navigator.onLine === false ? 'err' : syncB > 0 ? 'busy' : 'on');
const syncDraw = () => { const s = syncState(); document.querySelectorAll('[data-sw]').forEach((b) => { b.dataset.s = s; }); document.querySelectorAll('.qb-set [data-sw]').forEach((b) => { b.setAttribute('aria-pressed', String(s !== 'off')); b.setAttribute('title', SYNC_T[s]); b.setAttribute('aria-label', SYNC_T[s]); }); };
const syncRun = (f) => async (...a) => { if (!st.sync) return f(...a); syncB++; syncDraw(); try { return await f(...a); } finally { syncB--; setTimeout(syncDraw, 350); } };
const push = syncRun(push0), pull = syncRun(pull0);
window.addEventListener('online', () => { syncDraw(); push(); });
window.addEventListener('offline', syncDraw);
const ob = ld('outbox', []); const flush = async () => { if (!st.sync || !window.db || navigator.onLine === false || !ob.length) return; const batch = ob.splice(0); for (const o of batch) { let bad = true; try { const r = await window.db.from(o.t).delete().eq(o.c, o.v); bad = !!r.error; } catch (e) {} if (bad) ob.push(o); } sv('outbox', ob); }; const drop = async (t, c, v) => { if (!st.sync) return; ob.push({ t: t, c: c, v: v }); sv('outbox', ob); flush(); }; const drop0 = async (t, c, v) => { if (!st.sync || !window.db) return; try { await window.db.from(t).delete().eq(c, v); } catch (e) {} };
const toggleSync = async () => { st.sync = !st.sync; sv('sync', st.sync); pop(); if (st.sync) { await pull(); await push(); } else { const u = await who(); if (u && window.db) { try { await window.db.from('worlds_saved').delete().eq('user_id', u); await window.db.from('worlds_history').delete().eq('user_id', u); await window.db.from('worlds_open').delete().eq('user_id', u); ob.length = 0; sv('outbox', ob); } catch (e) {} } } pop(); };

/* site names: SITES maps a coordinate text to its name, filled in later */
const SITES = {}, ICONS = {}, SC = new Map(), FAV = 'Sources/Icons/Qasthra.svg';
const favOf = (x) => { const e = ent(x); const k = e.k === 'coord' ? ctext(e.c) : ''; return ICONS[k] ? ICONS[k] : FAV; };
const favBind = (im) => { im.onerror = () => { im.onerror = null; im.src = FAV; }; };
const favDraw = () => { document.querySelectorAll('.qb-strip .qb-w').forEach((t) => { const x = st.worlds.find((y) => String(y.id) === t.dataset.w); const im = t.querySelector('.qb-fav'); if (!x || !im) return; const s = favOf(x); if (im.getAttribute('src') !== s) { favBind(im); im.src = s; } }); };
let ctlOn = false, ctlT = 0, lkT = 0, sgT = 0, RS = { q: '', r: [] };
const likeEsc = (t) => t.replace(/[%_\\]/g, '\\$&');
const siteFind = async (q, n) => { if (!window.db) return []; const t = q.trim().slice(0, 60); if (!t) return []; const key = n + ':' + t.toLowerCase(); const hit = SC.get(key); if (hit && Date.now() - hit.t < 60000) return hit.r; try { const p = likeEsc(t), sel = 'id,name,coord,official,searches,icon'; const [a, b] = await Promise.all([window.db.from('sites').select(sel).eq('official', true).ilike('name', '%' + p + '%').order('searches', { ascending: false }).limit(n), window.db.from('sites').select(sel).eq('official', false).ilike('name', p + '%').order('searches', { ascending: false }).limit(n)]); const r = (a.data ? a.data : []).concat(b.data ? b.data : []).slice(0, n); r.forEach((s) => { SITES[s.coord] = s.name; ICONS[s.coord] = /^https:/i.test(s.icon) ? s.icon : ''; }); SC.set(key, { t: Date.now(), r: r }); return r; } catch (e) { return []; } };
const bumpSite = (id) => { if (!window.db) return; SC.clear(); window.db.rpc('bump_site', { s: id }).then(() => {}, () => {}); };
const lookupName = (c) => { const k = ctext(c); if (SITES[k] !== undefined) { if (SITES[k]) { clearTimeout(lkT); lkT = setTimeout(() => { const w = cur(); if (w && ent(w).k === 'coord' && ctext(ent(w).c) === k && qSeen !== k) view(w); }, 400); } return; } if (!window.db) { SITES[k] = ''; return; } clearTimeout(lkT); lkT = setTimeout(async () => { try { const r = await window.db.from('sites').select('name,icon').eq('coord', k).maybeSingle(); if (r.error) { SITES[k] = ''; } else { SITES[k] = r.data && r.data.name ? r.data.name : ''; ICONS[k] = r.data && /^https:/i.test(r.data.icon) ? r.data.icon : ''; } } catch (e) { SITES[k] = ''; } favDraw(); dispDraw(); const w = cur(), t = $('.qb-w[aria-selected="true"] span'); if (w && ent(w).k === 'coord' && ctext(ent(w).c) === k) { if (t) t.textContent = title(w); if (SITES[k] && qSeen !== k) view(w); } }, 400); };
const siteSug = (v) => { clearTimeout(sgT); const t = v.trim(); if (t.length < 2) return; if (coords(t)) return; const k = t.toLowerCase(); if (RS.q === k) return; sgT = setTimeout(async () => { const r = await siteFind(t, 6); const i = $('.qb-omni input'); if (!i) return; if (document.activeElement !== i) return; if (i.value.trim().toLowerCase() !== k) return; RS = { q: k, r: r.map((s) => ({ q: s.name, tag: s.official ? 'Official' : 'Unofficial', site: s.coord, id: s.id })) }; sugDraw(true); }, 250); };
const lbl = (q) => { const c = coords(q); return c ? siteTitle(c) : q; };
const siteName = (c) => (SITES[ctext(c)] ? SITES[ctext(c)] : ctext(c) === 'X=0, Y=0, Z=0' ? 'Qasthra' : 'Unknown');
const siteTitle = (c) => SITES[ctext(c)] || (ctext(c) === QZ ? 'Qasthra' : ctext(c));
const dispDraw = () => { const f = $('.qb-omni'), d = $('.qb-disp'), i = $('.qb-omni input'); if (!f || !d || !i) return; const e = ent(cur()); if (e.k === 'coord') lookupName(e.c); const on = e.k === 'coord' && document.activeElement !== i; f.classList.toggle('show-disp', on); d.hidden = !on; const xw = $('.qb-wipe'); if (xw) xw.hidden = !(i.value || on); if (on) { if (!d.firstChild) d.innerHTML = '<span class="qb-nm"></span><span class="qb-co"></span>'; d.firstChild.textContent = siteName(e.c); d.lastChild.textContent = e.q; d.classList.toggle('cc', ctlOn); } };
/* search: suggestions from Favorites and History, clear button */
const sugs = (t) => { t = t.trim().toLowerCase(); if (!t) return []; const out = [], seen = new Set(); const add = (q, tag) => { if (coords(q)) return; const k = q.toLowerCase(); if (k === t) return; if (seen.has(k)) return; if (k.indexOf(t) < 0) return; seen.add(k); out.push({ q: q, tag: tag }); }; st.saved.forEach((s) => add(s.q, 'Favorite')); st.hist.forEach((h) => { if (h.k === 'search') add(h.q, 'History'); }); out.sort((a, b) => (b.q.toLowerCase().indexOf(t) === 0) - (a.q.toLowerCase().indexOf(t) === 0)); return out.slice(0, 6); };
const sugDraw = (show) => { const i = $('.qb-omni input'), b = $('#qbSug'), x = $('.qb-wipe'); if (!i) return; if (x) x.hidden = !i.value; if (!b) return; const rs = RS.q === i.value.trim().toLowerCase() ? RS.r : []; const r = show ? rs.concat(sugs(i.value)).slice(0, 8) : []; if (show) siteSug(i.value); if (!r.length) { b.hidden = true; b.innerHTML = ''; return; } b.innerHTML = r.map((s) => '<button class="qb-item" type="button" role="option" data-pick="' + esc(s.site ? s.site : s.q) + '"' + (s.id ? ' data-sid="' + esc(s.id) + '"' : '') + '><span>' + esc(s.q) + '</span><small>' + s.tag + '</small></button>').join(''); b.hidden = false; };
const wipe = () => { const i = $('.qb-omni input'), f = $('.qb-omni'), d = $('.qb-disp'); if (!i) return; const w0 = cur(); if (ent(w0).k !== 'universe') { if (qfull(w0)) { say(QMSG); return; } w0.tr = w0.tr.slice(0, w0.i + 1); w0.tr.push({ k: 'universe', q: '' }); if (w0.tr.length > 50) w0.tr.shift(); w0.i = w0.tr.length - 1; keep(); draw(); } if (f) f.classList.remove('show-disp'); if (d) d.hidden = true; i.value = ''; i.focus(); sugDraw(false); };
const pick = (e) => { const b = e.target.closest('[data-pick]'); if (!b) return; const i = $('.qb-omni input'); if (b.dataset.sid) bumpSite(b.dataset.sid); go(b.dataset.pick); if (i) i.blur(); sugDraw(false); };
/* controller: tap nudges X, Y or Z by 1, hold repeats */
const exp = (s) => { let n = 0; const r = s.replace(/(\d)\{(\d+)\}/g, (m, d, k) => { n += +k; return n > 2000 ? '' : d.repeat(+k); }); return n > 2000 ? null : r; };
const pack = (s) => s.replace(/(\d)\1{3,}/g, (m, d) => d + '{' + m.length + '}');
const bump = (a, d) => { const m = /^([+-]?)([0-9{}]+)(?:\.([0-9{}]+))?$/.exec(a.raw); if (!m) return null; const i = exp(m[2]), f = m[3] ? exp(m[3]) : ''; if (i === null) return null; if (f === null) return null; const sc = f.length; const v = BigInt((m[1] === '-' ? '-' : '') + i + f) + BigInt('1' + '0'.repeat(sc)) * BigInt(d); const neg = v < 0n; const s = (neg ? -v : v).toString().padStart(sc + 1, '0'); const ip = s.slice(0, s.length - sc), fp = s.slice(s.length - sc); return axis((neg ? '-' : '') + pack(ip) + (sc ? '.' + pack(fp) : '')); };
const AX = { left: ['X', -1], right: ['X', 1], up: ['Y', 1], down: ['Y', -1], zin: ['Z', 1], zout: ['Z', -1] };
let hrec = 0, rep = 0;
const place = (c) => { const w = cur(), e = { k: 'coord', q: ctext(c), c: c }; w.tr = w.tr.slice(0, w.i + 1); w.tr.push(e); if (w.tr.length > 50) w.tr.shift(); w.i = w.tr.length - 1; return e; };
const lite = () => { starDraw(); const w = cur(), h = $('#qbHost'); if (!h) return; const t = $('.qb-w[aria-selected="true"] span', h); if (t) t.textContent = title(w); const o = $('.qb-omni input', h); if (o && document.activeElement !== o) o.value = ''; dispDraw(); qStop(); document.querySelectorAll('[data-ro]').forEach((n) => { const c = ent(w).c; n.textContent = c ? c[n.dataset.ro].raw : '0'; }); };
const nudge = (k, amount) => { const a = AX[k]; if (!a) return false; const oi = $('.qb-omni input'); if (oi) { oi.value = ''; if (document.activeElement === oi) oi.blur(); sugDraw(false); } const w = cur(); let e = ent(w), fresh = false; if (e.k !== 'coord') { e = place({ X: axis('0'), Y: axis('0'), Z: axis('0') }); fresh = true; } const n = bump(e.c[a[0]], (amount || 1) * a[1]); if (!n) { say('That number is too large to nudge.'); return false; } e.c[a[0]] = n; e.q = ctext(e.c); if (e.q === QZ && !qfull(w)) { w.tr[w.i] = { k: 'universe', q: '' }; ctlOn = false; clearTimeout(ctlT); clearTimeout(hrec); keep(); draw(); document.querySelectorAll('[data-ro]').forEach((n) => { n.textContent = '0'; }); return true; } ctlOn = true; clearTimeout(ctlT); ctlT = setTimeout(() => { ctlOn = false; dispDraw(); }, 1000); clearTimeout(hrec); hrec = setTimeout(() => rec('search', e.q), 900); keep(); if (fresh) { noLoad = true; draw(); noLoad = false; } else { lite(); } return true; };
const zero = () => { if (title(cur()) !== 'Qasthra' && qfull(cur())) { say(QMSG); return; } place({ X: axis('0'), Y: axis('0'), Z: axis('0') }); rec('search', ent(cur()).q); keep(); draw(); };
const copy = () => { const e = ent(cur()); if (e.k !== 'coord') { say('No coordinates to copy yet.'); return; } if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(e.q).then(() => say('Coordinates copied.'), () => say('Could not copy.')); else say('Copy is not supported here.'); };
const speed = (t0) => { const d = window.QPUSH == null ? 0 : window.QPUSH, s = window.QHOLD ? window.QHOLD : t0 ? t0 : Date.now(), h = Math.min(1, (Date.now() - s) / 2500); return Math.min(1, d * 0.35 + h * 0.65); }; window.QSPEED = speed; const stop = () => { clearTimeout(rep); rep = 0; };
const press = (e) => { if (e.button > 0) return; const b = e.target.closest('[data-n]'); if (!b) return; e.preventDefault(); stop(); const k = b.dataset.n; if (!nudge(k, 1)) return; const t0 = Date.now(); const step = () => { const sp = speed(t0); rep = setTimeout(() => { if (!nudge(k, 1)) { stop(); return; } step(); }, Math.max(40, Math.round(1000 / (3 + 22 * sp * sp)))); }; step(); };
const tap = (e) => { const b = e.target.closest('[data-n]'); if (b && e.detail === 0) nudge(b.dataset.n); };
/* history, worlds and movement */
const rec = (k, q) => { if (st.priv || !q) return; st.hist.unshift({ id: uid(), k: k, q: q, at: Date.now() }); st.hist.length = Math.min(st.hist.length, 200); sv('hist', st.hist); push(); };
const go = (q) => { q = String(q).trim(); if (!q) return; if (/^qasthra$/i.test(q)) q = QZ; const c = coords(q); if (!c && /^[xyz]\s*=/i.test(q)) { say('Use X=1028, Y=-92810, Z=1029.202. A repeat looks like 1{10}.'); return; } const w = cur(), e = c ? { k: 'coord', q: ctext(c), c: c } : { k: 'search', q: q.slice(0, 200) }; if (c && ctext(c) === QZ && title(w) !== 'Qasthra' && qfull(w)) { say(QMSG); return; } w.tr = w.tr.slice(0, w.i + 1); w.tr.push(e); if (w.tr.length > 50) w.tr.shift(); w.i = w.tr.length - 1; rec('search', e.q); keep(); draw(); };
const hop = (d) => { const w = cur(), n = w.i + d; if (n < 0 || n >= w.tr.length) return; w.i = n; keep(); draw(); };
const swap = (d) => { const n = st.worlds.indexOf(cur()) + d; if (n < 0 || n >= st.worlds.length) return; st.active = st.worlds[n].id; keep(); draw(); };
const add = () => { if (qfull(null)) { say(QMSG); return false; } const w = nw(); st.worlds.push(w); st.active = w.id; st.panel = ''; keep(); draw(); const o = $('.qb-omni input'); if (o) o.focus(); };
const shut = (id) => { const i = st.worlds.findIndex((w) => w.id === id); if (i < 0) return; const w = st.worlds[i]; const firstQ = st.worlds.findIndex((x) => title(x) === 'Qasthra'); if (title(w) === 'Qasthra' && i === firstQ) { say('The leftmost Qasthra tab cannot be closed.'); return; } if (ent(w).k !== 'universe') rec('world', ent(w).q || title(w)); st.worlds.splice(i, 1); if (!st.worlds.length) st.worlds.push(nw()); if (st.active === id || !cur()) st.active = st.worlds[Math.max(0, i - 1)].id; keep(); draw(); };
const flip = () => { st.priv = !st.priv; sv('acstatus', st.priv ? 'Private' : 'Public'); st.panel = ''; draw(); };
const saveCur = () => { if (st.priv) { say('Favorites are off in Private.'); return; } const w = cur(), e = ent(w); if (e.k === 'universe') { say('Open a search or coordinate first.'); return; } if (st.saved.some((s) => s.q === e.q)) { say('Already in Favorites.'); return; } st.saved.unshift({ id: uid(), title: title(w), q: e.q, tier: 'Core', at: Date.now() }); sv('saved', st.saved); push(); say('Added to Favorites.'); starDraw(); if (st.panel === 'saved') pop(); };
const starOf = (x) => { const e = ent(x); return e.k === 'universe' ? null : st.saved.find((s) => s.q === e.q) || null; };
const starBtn = (x) => { if (ent(x).k === 'universe') return ''; const f = starOf(x); return '<button class="qb-star" type="button" data-fav="' + esc(x.id) + '" aria-pressed="' + (!!f) + '" aria-label="' + (f ? 'Remove from Favorites' : 'Add to Favorites') + '" title="' + (f ? 'Favorited. Long-press for Favorites' : 'Favorite. Long-press for Favorites') + '"' + '>' + I.star + '</button>'; };
const starDraw = () => { document.querySelectorAll('.qb-star').forEach((b) => { const x = st.worlds.find((y) => y.id === b.dataset.fav); if (!x) return; const f = starOf(x); b.setAttribute('aria-pressed', String(!!f)); b.setAttribute('aria-label', f ? 'Remove from Favorites' : 'Add to Favorites'); b.setAttribute('title', f ? 'Favorited. Long-press for Favorites' : 'Favorite. Long-press for Favorites'); }); };
const toggleFav = (id) => { const w = st.worlds.find((x) => x.id === id); if (!w) return; const e = ent(w); if (e.k === 'universe') return; const f = starOf(w); if (f) { st.saved = st.saved.filter((s) => s.id !== f.id); sv('saved', st.saved); drop('worlds_saved', 'id', f.id); } else { st.saved.unshift({ id: uid(), title: title(w), q: e.q, tier: 'Core', at: Date.now() }); sv('saved', st.saved); push(); const b = document.querySelector('.qb-star[data-fav="' + id + '"]'); if (b) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } } starDraw(); if (st.panel === 'saved') pop(); };
const clearHist = async () => { st.hist = []; sv('hist', []); const u = await who(); if (u) drop('worlds_history', 'user_id', u); say('History cleared.'); pop(); };
const signout = async () => { if (window.QAUTH && window.QAUTH.signOut) await window.QAUTH.signOut(); try { if (window.CAP) window.CAP.fresh(); } catch (e) {} };
/* the content area */
let qTok = 0, qSeen = '', noLoad = false; const qStop = () => { qTok++; const ov = $('.qb-ov'); if (ov && ov.querySelector('.qb-world-loader')) ov.innerHTML = ''; }; const qOpen = (e) => { const o = $('.qb-ov'); if (!o) return; const tok = ++qTok, t0 = Date.now(), LOAD = 2500, MAXQ = 5000, k0 = e.k === 'coord' ? ctext(e.c) : ''; qSeen = k0; window.QST = null; o.innerHTML = '<div class="qb-page qb-qast"><img class="qb-world-loader" src="Sources/Videos/Qasthra.gif" alt="Loading"></div>'; const live = () => tok === qTok && cur() && ent(cur()) === e && (e.k !== 'coord' || ctext(e.c) === k0) && $('.qb-ov'); const done = (res) => { setTimeout(() => { const ov = live(); if (!ov) return; if (res && res.text) { if (e.k === 'search') { e.k = 'coord'; e.c = res.c; e.q = ctext(res.c); } if (res.name) SITES[res.k] = res.name; qSeen = res.k; window.QST = { coord: res.k, text: res.text }; ov.innerHTML = '<div class="qb-page qb-qast"><div class="qb-qtext"></div></div>'; ov.querySelector('.qb-qtext').textContent = res.text; const t = $('.qb-w[aria-selected="true"] span'), i = $('.qb-omni input'); if (t) t.textContent = title(cur()); if (i && document.activeElement !== i) i.value = ''; dispDraw(); keep(); return; } const bar = $('.qb-omni input'); if (res && !res.text) { if (e.k === 'search') { e.k = 'coord'; e.c = res.c; e.q = ctext(res.c); } if (res.name) SITES[res.k] = res.name; qSeen = res.k; window.QST = null; ov.innerHTML = ''; const t2 = $('.qb-w[aria-selected="true"] span'); if (t2) t2.textContent = title(cur()); if (bar) bar.value = ''; dispDraw(); keep(); return; } if (k0 === QZ) { const w1 = cur(); w1.tr[w1.i] = { k: 'universe', q: '' }; keep(); draw(); return; } const w = cur(); if (!qfull(w)) { w.tr[w.i] = { k: 'universe', q: '' }; keep(); draw(); } else if (w.i > 0) hop(-1); else { if (bar) bar.value = ''; } }, Math.max(0, LOAD - (Date.now() - t0))); }; const job = async () => { let c = e.c; if (e.k === 'search') { const r = await siteFind(e.q, 5), t = e.q.trim().toLowerCase(), s = r.find((x) => String(x.name).toLowerCase() === t) || r[0]; if (!s) return null; c = coords(s.coord); if (!c) return null; bumpSite(s.id); } const k = ctext(c), r2 = await window.db.from('sites').select('name,qst').eq('coord', k).maybeSingle(); if (r2.error || !r2.data) return null; return { c: c, k: k, name: r2.data.name || '', text: typeof r2.data.qst === 'string' ? r2.data.qst.trim().slice(0, MAXQ) : '' }; }; if (!window.db) { done(null); return; } Promise.race([job().catch(() => null), new Promise((r) => setTimeout(() => r(null), LOAD))]).then(done); };
const view = (w) => { const v = $('.qa-view'); if (!v) return; let s = $('.qb-stage', v); if (!s) { v.innerHTML = '<div class="qb-stage"><div class="qb-ov"></div></div>'; s = $('.qb-stage', v); } if (noLoad) { qStop(); return; } const e = ent(w); if (e.k === 'universe') { qTok++; qSeen = ''; window.QST = null; $('.qb-ov', s).innerHTML = ''; return; } qOpen(e); };
const nb = (k, l, ico, cls) => '<button class="qb-ic qb-nb' + (cls ? ' ' + cls : '') + '" type="button" data-n="' + k + '" aria-label="' + l + '" title="' + l + '">' + ico + '</button>';
I.prev = ic('<path d="M19 12H6M11 6l-6 6 6 6"/>'); I.next = ic('<path d="M5 12h13M13 6l6 6-6 6"/>'); /* panels */
const pill = (a, t, o) => '<button class="qb-pill" type="button" data-tab="' + a + '" aria-pressed="' + o + '">' + t + '</button>';
const PANELS = {
history: () => { const k = st.tab === 'world' ? 'world' : 'search', r = st.hist.filter((h) => h.k === k); return '<div class="qb-top"><h3 class="qb-h">History</h3><button class="qb-btn" type="button" data-a="clear">Clear</button></div><div class="qb-tabs">' + pill('search', 'Searches', k === 'search') + pill('world', 'Closed Worlds', k === 'world') + '</div>' + (r.length ? '<div class="qb-list">' + r.map((h) => '<button class="qb-item" type="button" data-' + (k === 'world' ? 'reopen' : 'run') + '="' + esc(h.q) + '"><span>' + esc(lbl(h.q)) + '</span><small>' + ago(h.at) + '</small></button>').join('') + '</div>' : '<p class="qb-empty">Nothing here yet.</p>'); },
saved: () => '<div class="qb-top"><h3 class="qb-h">Favorites</h3><button class="qb-btn" type="button" data-a="save">Add current</button></div>' + (st.saved.length ? TIERS.map((t) => { const r = st.saved.filter((s) => s.tier === t); return r.length ? '<p class="qb-cap">' + t + '</p><div class="qb-list">' + r.map((s) => '<div class="qb-item"><button class="qb-grow" type="button" data-run="' + esc(s.q) + '"><span>' + esc(s.title) + '</span></button><button class="qb-chip" type="button" data-tier="' + esc(s.id) + '" title="Change tier">' + t + '</button><button class="qb-x" type="button" data-del="' + esc(s.id) + '" aria-label="Remove">' + I.x + '</button></div>').join('') + '</div>' : ''; }).join('') : '<p class="qb-empty">No favorites yet. Open a World and press Add current.</p>'),
xfer: () => '<div class="qb-top"><h3 class="qb-h">Uploads and Downloads</h3><span class="qb-acts2"><button class="qb-btn" type="button" data-a="upload">Upload</button><button class="qb-btn" type="button" data-p="set">Settings</button></span></div>' + (st.xfer.length ? '<div class="qb-list">' + st.xfer.map((f) => '<div class="qb-item"><span>' + esc(f.name) + '</span><small>' + size(f.size) + '</small></div>').join('') + '</div>' : '<p class="qb-empty">No transfers yet.</p>') + '<p class="qb-cap">Files are only listed for now. Sending and downloading need a server and a proxy.</p>',
plug: () => '<div class="qb-top"><h3 class="qb-h">Plugins and Plugouts</h3><button class="qb-btn" type="button" data-p="set">Settings</button></div>' + PLUGS.map((p) => '<div class="qb-row2"><div><b>' + p[1] + '</b><small>' + p[2] + '</small></div><button class="qb-btn" type="button" data-plug="' + p[0] + '">' + (on(p[0]) ? 'Plug out' : 'Plug in') + '</button></div>').join('') + '<p class="qb-cap">Plugins and Plugouts are previews for now and do nothing yet.</p>',
set: () => '<h3 class="qb-h">Settings</h3><div class="qb-row2 qb-mob"><div><b>Private</b><small>Security status of your browsing: Private or Public. Saved on this device.</small></div><button class="qb-sw" type="button" role="switch" aria-checked="' + st.priv + '" aria-label="Private" data-a="priv"></button></div><div class="qb-list qb-mob"><button class="qb-item" type="button" data-p="saved">' + I.star + '<span>Favorites</span></button><button class="qb-item" type="button" data-p="history">' + I.clock + '<span>History</span></button><button class="qb-item" type="button" data-p="plug">' + I.plug + '<span>Plugins and Plugouts</span></button><button class="qb-item" type="button" data-p="xfer">' + I.xfer + '<span>Uploads and Downloads</span></button></div><div class="qb-row2 qb-mob"><div><b>Theme</b><small>Dark or light.</small></div><button class="qb-btn" type="button" data-theme-btn>Switch</button></div><div class="qb-row2 qb-mob"><div><b>Sync</b><small>On: follows your account. Off: the cloud copy is deleted.</small></div><button class="qb-sw" type="button" role="switch" aria-checked="' + st.sync + '" aria-label="Sync" data-sw="sync"></button></div><div class="qb-row2"><div><b>History</b><small>Clear searches and closed Worlds on this device.</small></div><button class="qb-btn" type="button" data-a="clear">Clear</button></div><div class="qb-row2"><div><b>Account</b><small>Sign out of Qasthra.</small></div><button class="qb-btn" type="button" data-a="signout">Sign out</button></div>'
};
const pop = () => { document.querySelectorAll('.qb-set [data-p]').forEach((b) => { b.setAttribute('aria-pressed', String(st.panel === b.dataset.p)); }); syncDraw(); const p = $('.qb-pop'); if (!p) return; if (!st.panel) { p.hidden = true; return; } p.hidden = false; p.className = 'qb-pop' + (st.panel === 'quick' ? ' wide' : ''); p.innerHTML = PANELS[st.panel](); };
/* the bar */
const draw = () => { if (dg) { clearTimeout(dg.t); dg = null; } const h = $('#qbHost'); if (!h) return; const w = cur(), i = st.worlds.indexOf(w), strip = $('.qb-strip', h), firstQ = st.worlds.findIndex((x) => title(x) === 'Qasthra'); strip.innerHTML = st.worlds.map((x, n) => '<div class="qb-w" role="tab" tabindex="0" data-w="' + esc(x.id) + '" aria-selected="' + (x.id === w.id) + '"><img class="qb-fav" src="' + esc(favOf(x)) + '" alt="" width="16" height="16"><span>' + esc(title(x)) + '</span>' + starBtn(x) + (title(x) === 'Qasthra' && n === firstQ ? '' : '<button class="qb-x" type="button" data-x="' + esc(x.id) + '" aria-label="Close World">' + I.x + '</button>') + '</div>').join(''); strip.querySelectorAll('.qb-fav').forEach(favBind); const a = $('[aria-selected="true"]', strip); if (a && a.scrollIntoView) a.scrollIntoView({ inline: 'nearest', block: 'nearest' }); const all = (s) => Array.from(h.querySelectorAll(s)); all('[data-a="back"]').forEach((b) => { b.disabled = w.i < 1; }); all('[data-a="fwd"]').forEach((b) => { b.disabled = w.i >= w.tr.length - 1; }); all('[data-a="wprev"]').forEach((b) => { b.disabled = i < 1; }); all('[data-a="wnext"]').forEach((b) => { b.disabled = i >= st.worlds.length - 1; }); all('.qb-count b').forEach((b) => { b.textContent = st.worlds.length; }); all('[data-a="priv"]').forEach((b) => { b.setAttribute('aria-pressed', String(st.priv)); b.setAttribute('title', st.priv ? 'Private, tap for Public' : 'Public, tap for Private'); const s = b.querySelector('svg'); if (s) s.outerHTML = st.priv ? I.lock : I.unlock; }); $('.qb-omni input', h).value = ent(w).k === 'search' ? ent(w).q : ''; sugDraw(false); dispDraw(); view(w); pop(); };
const bt = (attr, label, icon, cls) => '<button class="qb-ic' + (cls ? ' ' + cls : '') + '" type="button" ' + attr + ' aria-label="' + label + '" title="' + label + '">' + icon + '</button>';
const SET = '<div class="qb-set" role="toolbar" aria-label="Quick settings">' + bt('data-p="history"', 'History', I.clock) + bt('data-p="xfer"', 'Uploads and Downloads', I.xfer) + bt('data-p="saved"', 'Favorites', I.star) + bt('data-p="plug"', 'Plugins and Plugouts', I.plug) + bt('data-sw="sync"', 'Sync off, tap to Sync', ic('<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"/>'), 'qb-sync') + '<button class="qb-ic qb-th" type="button" data-theme-btn aria-label="Switch theme" title="Switch theme"><span class="t-d">' + ic('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>') + '</span><span class="t-l">' + ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>') + '</span></button></div>';
/* SPIRIT (soon): the Kirby strip is where a talker will live, an AI model or a human model, acting as a support system while browsing. For now it only holds the 3D control. */
const KIRBY = '<' + '!-- SPIRIT (soon): the Kirby strip is where a talker will live, an AI model or a human model, as a support system while browsing. For now it only holds the 3D control. --' + '>' + '<div class="qb-kirby" aria-label="Spirit and 3D control"><svg class="qb-kb" viewBox="0 0 88 86" preserveAspectRatio="none" aria-hidden="true"><path class="qb-kf" d="M88 86H44A43 43 0 0 1 44 0H88Z"/><path class="qb-ks" d="M44 .5A42.5 42.5 0 0 0 1.6 38"/><path class="qb-ks" d="M0 85.5H88"/></svg><div class="qb-orb" id="qbOrbK" role="button" tabindex="0" aria-label="3D control" aria-expanded="false"><canvas id="qbBallK" width="128" height="128"></canvas><span class="qb-jx" hidden>' + nb('left', 'Left, X minus', I.left) + nb('right', 'Right, X plus', I.right) + nb('up', 'Up, Y plus', I.up) + nb('down', 'Down, Y minus', I.down) + nb('zin', 'Z plus, depth in', I.plus) + nb('zout', 'Z minus, depth out', I.minus) + '</span></div></div>';
const BAR = '<div class="qb"><div class="qb-col"><div class="qb-row qb-worlds"><div class="qb-strip" role="tablist" aria-label="Worlds"></div>' + bt('data-a="add"', 'New World', I.plus) + '</div><div class="qb-row qb-tool">' + '<div class="qb-nav qb-dk">' + bt('data-a="back"', 'Back', I.prev) + bt('data-a="priv"', 'Public, tap for Private', I.unlock) + bt('data-a="fwd"', 'Next', I.next) + '</div><form class="qb-omni" autocomplete="off"><span class="qb-ic qb-mag" aria-hidden="true">' + I.search + '</span><button class="qb-disp" type="button" hidden aria-label="Edit search"></button><input type="text" maxlength="400" enterkeyhint="go" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Search" placeholder="Search">' + bt('data-a="wipe" hidden', 'Clear search', I.x, 'qb-wipe') + bt('data-a="reload"', 'Reload', I.reload) + '<div class="qb-sug" id="qbSug" role="listbox" hidden></div></form>' + SET + bt('data-p="set"', 'Settings', I.gear, 'qb-gear-m') + '</div></div>' + KIRBY + '<div class="qb-dock" role="toolbar" aria-label="Browser">' + bt('data-a="back"', 'Back', I.prev, 'qb-bk') + '<div class="qb-orb" id="qbOrb" role="button" tabindex="0" aria-label="3D control" aria-expanded="false"><canvas id="qbBall" width="224" height="224"></canvas><svg class="qb-arc" viewBox="-50 -50 100 56" aria-hidden="true"><path class="qb-ae" pathLength="100" d="M-36.66 16A40 40 0 1 1 36.66 16"/><path class="qb-at" pathLength="100" d="M-36.66 16A40 40 0 1 1 36.66 16"/><path class="qb-ag" pathLength="100" d="M-36.66 16A40 40 0 1 1 36.66 16"/><path class="qb-af" pathLength="100" d="M-36.66 16A40 40 0 1 1 36.66 16"/></svg>' + nb('zin', 'Z plus, depth in', I.plus, 'qb-zb qb-zu') + nb('zout', 'Z minus, depth out', I.minus, 'qb-zb qb-zd') + '<span class="qb-jx" hidden>' + nb('left', 'Left, X minus', I.left) + nb('right', 'Right, X plus', I.right) + nb('up', 'Up, Y plus', I.up) + nb('down', 'Down, Y minus', I.down) + '</span></div>' + bt('data-a="fwd"', 'Next', I.next, 'qb-fw') + '</div><div class="qb-pop" hidden></div><input type="file" id="qbFile" multiple hidden></div>';
const reloadWorld = () => { const w = cur(); if (!w) return; st.panel = ''; const e = ent(w); if (e.k === 'coord') { window.QST = null; view(w); } else if (e.k === 'search') { view(w); } else { draw(); } };
const click = (e) => { const t = e.target.closest('[data-a],[data-p],[data-w],[data-x],[data-run],[data-reopen],[data-tier],[data-del],[data-tab],[data-plug],[data-sw],[data-fav]'); if (!t) return; const d = t.dataset; if (d.fav) { if (lp) { lp = false; return; } toggleFav(d.fav); return; } if (d.x) { shut(d.x); return; } if (d.w) { st.active = d.w; st.panel = ''; keep(); draw(); return; } if (d.p) { st.panel = st.panel === d.p ? '' : d.p; pop(); return; } if (d.run !== undefined) { st.panel = ''; go(d.run); pop(); return; } if (d.reopen !== undefined) { if (add() === false) return; go(d.reopen); return; } if (d.tab) { st.tab = d.tab; pop(); return; } if (d.tier) { const s = st.saved.find((x) => x.id === d.tier); if (s) { s.tier = TIERS[(TIERS.indexOf(s.tier) + 1) % TIERS.length]; sv('saved', st.saved); push(); pop(); } return; } if (d.del) { st.saved = st.saved.filter((x) => x.id !== d.del); sv('saved', st.saved); drop('worlds_saved', 'id', d.del); pop(); starDraw(); return; } if (d.plug) { st.plug[d.plug] = !on(d.plug); sv('plug', st.plug); pop(); view(cur()); return; } if (d.sw) { toggleSync(); return; } const f = { add: add, priv: flip, back: () => hop(-1), fwd: () => hop(1), wprev: () => swap(-1), wnext: () => swap(1), wipe: wipe, reload: reloadWorld, save: saveCur, upload: () => { const i = $('#qbFile'); if (i) i.click(); }, clear: clearHist, signout: signout }[d.a]; if (f) f(); };
const KN = { a: 'left', d: 'right', w: 'up', s: 'down', q: 'zout', e: 'zin' };
const KP = { h: 'history', u: 'xfer', l: 'plug', ',': 'set' };
let kdown = '';
const hold = (k) => { stop(); if (!nudge(k, 1)) return; const t0 = Date.now(); const step = () => { const sp = speed(t0); rep = setTimeout(() => { if (!nudge(k, 1)) { stop(); return; } step(); }, Math.max(40, Math.round(1000 / (3 + 22 * sp * sp)))); }; step(); };
const kbd = (e) => { if (e.ctrlKey || e.metaKey) { if (e.ctrlKey && e.key.toLowerCase() === 'k') { e.preventDefault(); const i = $('.qb-omni input'); if (i) i.focus(); } return; } const t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return; const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (KN[k]) { e.preventDefault(); if (!e.repeat) { kdown = k; hold(KN[k]); } return; } if (KP[k]) { e.preventDefault(); st.panel = st.panel === KP[k] ? '' : KP[k]; pop(); return; } const m = { '0': zero, '[': () => hop(-1), ']': () => hop(1), '<': () => swap(-1), '>': () => swap(1), t: add, x: () => shut(cur().id), r: reloadWorld, p: flip, f: saveCur, c: copy, y: toggleSync, m: () => { const b = $('[data-theme-btn]'); if (b) b.click(); }, '/': () => { const i = $('.qb-omni input'); if (i) i.focus(); } }[k]; if (m) { e.preventDefault(); if (!e.repeat) m(); } };
document.addEventListener('keyup', (e) => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (k === kdown) { kdown = ''; stop(); } });
/* tab drag: every exit path ends in dragEnd, so a tab cannot stay stuck */
let dg = null, lp = false, lpT = 0, lpX = 0, lpY = 0, sup = false, settling = false;
const GAP = 2;
const vib = (n) => { try { if (navigator.vibrate) navigator.vibrate(n); } catch (x) {} };
const tabEls = () => Array.from($('.qb-strip').children);
const pinN = () => (st.worlds[0] && title(st.worlds[0]) === 'Qasthra' ? 1 : 0);
const slots = (d, order) => { let x = d.base[order[0]]; const m = {}; order.forEach((id) => { m[id] = x; x += d.w[id] + GAP; }); return m; };
const dragStart = (d) => {
  const els = tabEls(); d.base = {}; d.w = {}; d.order = els.map((el) => el.dataset.w);
  els.forEach((el) => { const r = el.getBoundingClientRect(); d.base[el.dataset.w] = r.left; d.w[el.dataset.w] = r.width; });
  d.orig = d.order.slice(); d.on = true;
  els.forEach((el) => el.classList.add(el === d.el ? 'drag' : 'shift'));
  try { d.el.setPointerCapture(d.pid); } catch (x) {}
};
const dragApply = (d, dx) => {
  const o = d.orig, id = d.id, last = o[o.length - 1], P = d.P;
  const lo = d.base[o[P]] - d.base[id], hi = d.base[last] + d.w[last] - d.w[id] - d.base[id];
  dx = Math.max(lo, Math.min(hi, dx));
  const c = d.base[id] + dx + d.w[id] / 2;
  const eps = dx >= 0 ? 0.5 : -0.5; let idx = P; o.forEach((x, n) => { if (n >= P && x !== id && d.base[x] + d.w[x] / 2 < c + eps) idx++; });
  const rest = o.filter((x) => x !== id); rest.splice(idx, 0, id);
  d.order = rest;
  const sl = slots(d, rest);
  tabEls().forEach((el) => { const x = el.dataset.w; el.style.transform = x === id ? 'translateX(' + dx + 'px)' + (d.touch ? ' scale(1.04)' : '') : 'translateX(' + (sl[x] - d.base[x]) + 'px)'; });
};
const dragEnd = (commit) => {
  const d = dg; if (!d) return; dg = null; clearTimeout(d.t);
  if (!d.on) return;
  try { d.el.releasePointerCapture(d.pid); } catch (x) {}
  sup = true; settling = true; setTimeout(() => { sup = false; }, 80);
  const sl = slots(d, d.order);
  tabEls().forEach((el) => { const x = el.dataset.w; el.style.transition = 'transform .2s cubic-bezier(.2,.8,.2,1)'; el.style.transform = commit ? 'translateX(' + (sl[x] - d.base[x]) + 'px)' : 'translateX(0)'; });
  setTimeout(() => {
    settling = false;
    const same = st.active === d.id;
    if (commit) {
      const m = new Map(st.worlds.map((w) => [w.id, w])), nu = d.order.map((id) => m.get(id)).filter(Boolean);
      st.worlds.forEach((w) => { if (nu.indexOf(w) < 0) nu.push(w); });
      st.worlds = nu; st.active = d.id; st.panel = ''; keep();
    }
    if (same) { noLoad = true; draw(); noLoad = false; } else draw();
  }, 230);
};
document.addEventListener('pointerdown', (e) => {
  if (!e.target.closest('#qbHost')) return;
  lp = false;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const s = e.target.closest('.qb-star');
  if (s) { if (s.disabled) return; lpX = e.clientX; lpY = e.clientY; clearTimeout(lpT); lpT = setTimeout(() => { lp = true; st.panel = 'saved'; pop(); vib(14); }, 520); return; }
  if (dg || settling || e.target.closest('.qb-x')) return;
  const el = e.target.closest('.qb-w'); if (!el) return;
  const P = pinN(), i0 = st.worlds.findIndex((x) => x.id === el.dataset.w);
  if (i0 < 0 || i0 < P || st.worlds.length < 2 + P) return;
  const touch = e.pointerType !== 'mouse';
  dg = { id: el.dataset.w, el: el, pid: e.pointerId, sx: e.clientX, sy: e.clientY, touch: touch, on: false, t: 0, P: P };
  if (touch) dg.t = setTimeout(() => { const d = dg; if (!d) return; if (d.on) return; dragStart(d); dragApply(d, 0); vib(14); }, 320);
});
window.addEventListener('pointermove', (e) => {
  if (lpT && Math.hypot(e.clientX - lpX, e.clientY - lpY) > 8) { clearTimeout(lpT); lpT = 0; }
  const d = dg; if (!d) return; if (e.pointerId !== d.pid) return;
  const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
  if (!d.on) {
    if (d.touch) { if (Math.hypot(dx, dy) > 8) { clearTimeout(d.t); dg = null; } return; }
    if (Math.abs(dx) < 5) return;
    dragStart(d);
  }
  e.preventDefault(); dragApply(d, dx);
});
window.addEventListener('pointerup', (e) => { clearTimeout(lpT); const d = dg; if (!d) return; if (e.pointerId !== d.pid) return; if (!d.on) { clearTimeout(d.t); dg = null; return; } dragEnd(true); });
window.addEventListener('pointercancel', (e) => { clearTimeout(lpT); const d = dg; if (!d) return; if (e.pointerId !== d.pid) return; if (!d.on) { clearTimeout(d.t); dg = null; return; } dragEnd(false); });
window.addEventListener('blur', () => { clearTimeout(lpT); if (!dg) return; if (dg.on) dragEnd(false); else { clearTimeout(dg.t); dg = null; } });
document.addEventListener('visibilitychange', () => { if (document.hidden) { if (dg) { if (dg.on) dragEnd(false); else { clearTimeout(dg.t); dg = null; } } } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (dg) { if (dg.on) dragEnd(false); } } });
document.addEventListener('touchmove', (e) => { if (dg) { if (dg.on) e.preventDefault(); } }, { passive: false });
document.addEventListener('click', (e) => { if (sup) { if (e.target.closest('#qbHost')) { e.stopPropagation(); e.preventDefault(); } } }, true);
document.addEventListener('contextmenu', (e) => { if (matchMedia('(pointer:coarse)').matches) { if (e.target.closest('#qbHost .qb-star, #qbHost .qb-w')) e.preventDefault(); } });
let wired = false;
const wire = () => { if (wired) return; wired = true; ['pointerup', 'pointercancel', 'blur'].forEach((n) => window.addEventListener(n, stop)); document.addEventListener('click', (e) => { if (st.panel && !e.target.closest('.qb')) { st.panel = ''; pop(); } }, true); document.addEventListener('keydown', (e) => { const q = $('.qb'); if (!q || q.offsetParent === null) return; if (e.key === 'Escape' && st.panel) { st.panel = ''; pop(); return; } if (!e.altKey) { kbd(e); return; } const sh = e.shiftKey; const m = { ArrowLeft: () => (sh ? hop(-1) : nudge('left')), ArrowRight: () => (sh ? hop(1) : nudge('right')), ArrowUp: () => (sh ? swap(-1) : nudge('up')), ArrowDown: () => (sh ? swap(1) : nudge('down')), PageUp: () => nudge('zin'), PageDown: () => nudge('zout') }[e.key]; if (m) { e.preventDefault(); m(); } }); };
let boot = true;
const mount = () => { const h = $('#qbHost'); if (!h) return; if (boot) { boot = false; if (!st.worlds.some((w) => ent(w).k === 'universe')) st.worlds.unshift(nw()); st.active = st.worlds.find((w) => ent(w).k === 'universe').id; } h.innerHTML = BAR; st.panel = ''; const root = h.closest('.qa') || h; root.addEventListener('click', click); root.addEventListener('pointerdown', press); root.addEventListener('click', tap); root.addEventListener('click', pick); root.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-n]')) e.preventDefault(); }); root.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.qb-w,.qb-tile')) { e.preventDefault(); e.target.click(); } }); $('.qb-omni', h).addEventListener('submit', (e) => { e.preventDefault(); go($('input', e.target).value); $('input', e.target).blur(); sugDraw(false); }); const oi = $('.qb-omni input', h); oi.addEventListener('focus', (e) => { if (ctlOn) { e.target.blur(); return; } const e0 = ent(cur()); if (e0.k === 'coord') e.target.value = e0.q; e.target.select(); sugDraw(false); dispDraw(); }); oi.addEventListener('input', () => { if (ctlOn) { oi.value = ''; oi.blur(); sugDraw(false); dispDraw(); return; } sugDraw(true); }); oi.addEventListener('blur', () => { sugDraw(false); dispDraw(); }); oi.addEventListener('keydown', (e) => { if (e.key === 'Escape') oi.blur(); }); $('#qbSug', h).addEventListener('pointerdown', (e) => e.preventDefault()); $('.qb-disp', h).addEventListener('click', () => { const f = $('.qb-omni', h), d = $('.qb-disp', h); if (f) f.classList.remove('show-disp'); if (d) d.hidden = true; oi.focus(); }); ['.qb-wipe', '.qb-mag'].forEach((s) => $(s, h).addEventListener('pointerdown', (e) => e.preventDefault())); $('#qbFile', h).addEventListener('change', (e) => { Array.from(e.target.files || []).forEach((f) => st.xfer.unshift({ name: f.name, size: f.size })); e.target.value = ''; pop(); }); wire(); draw(); };
const base = Q.dashboard;
Q.dashboard = () => { base(); mount(); if (st.sync) pull().then(push); };
if (window.screen && window.screen.current === 'dashboard' && !$('#qbHost')) setTimeout(() => Q.dashboard(), 0);
})();
/* ---------- qb orb v2: glass ball that turns into the 3D control (XY drag + depth) ---------- */
(() => {
const Q = window.QA; if (!Q) return; if (!Q.dashboard) return;
const $ = (s) => document.querySelector(s);
const IDLE = 2500;
const dark = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; };
let pend = null;
const lib = (cb) => { if (window.THREE) { cb(); return; } if (pend) { pend.push(cb); return; } pend = [cb]; const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'; s.onload = () => { const l = pend; pend = null; l.forEach((f) => f()); }; document.head.appendChild(s); };
const VS = 'varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vec4 m=modelViewMatrix*vec4(position,1.0);vN=normalize(normalMatrix*normal);vV=normalize(-m.xyz);vP=position;gl_Position=projectionMatrix*m;}';
const FS = [
'uniform float uA;uniform float uT;uniform vec3 uC;varying vec3 vN;varying vec3 vV;varying vec3 vP;',
'float L(float v,float w){return 1.0-smoothstep(0.0,w,abs(sin(v)));}',
'void main(){',
'vec3 p=normalize(vP);float t=uT;',
'float a=p.x*3.0+sin(p.y*4.0+t)*0.9+p.z*2.0;',
'float b=p.y*3.5+sin(p.z*3.0-t*0.8)*1.1+p.x*1.5;',
'float c=p.z*4.0+sin(p.x*3.0+t*0.6)*0.8-p.y*2.0;',
'float d=max(dot(vN,vV),0.0);',
'float fr=(L(a*1.7,0.11)+L(b*1.7,0.11)*0.8+L(c*1.7,0.11)*0.6)*(0.3+d*0.7);',
'vec3 q=refract(-vV,vN,0.72);vec3 p2=p*0.6+q*0.55;',
'float inn=(L(p2.x*5.0+sin(p2.y*4.0+t*1.3)*1.2,0.14)+L(p2.y*5.0+sin(p2.z*4.0-t)*1.2,0.14)*0.8)*0.55*d;',
'float f=pow(1.0-d,2.2);',
'float h=pow(max(dot(vN,normalize(vec3(-0.5,0.7,0.6))),0.0),28.0);',
'float k=clamp(fr+inn,0.0,1.0);',
'float al=mix(0.13+f*0.6,0.2+f*0.5,uA)+k*mix(0.45,0.7,uA)+h*0.5;',
'vec3 col=uC*(0.4+f*0.5+k*0.7)+vec3(h*0.6);',
'gl_FragColor=vec4(col,clamp(al,0.0,1.0));',
'}'
].join('');
const ball = (cv, S) => {
const T = window.THREE; let r;
try { r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); } catch (e) { return; }
r.setPixelRatio(Math.min(window.devicePixelRatio, 2)); r.setSize(112, 112, false); r.setClearColor(0x000000, 0);
const sc = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, 0.1, 20), grp = new T.Group();
cam.position.z = 4.6; sc.add(grp);
const U = { uA: { value: 0 }, uT: { value: 0 }, uC: { value: new T.Color(0xf2f2f4) } };
const mat = new T.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, vertexShader: VS, fragmentShader: FS });
grp.add(new T.Mesh(new T.SphereGeometry(1, 56, 40), mat));
const P = [], N = 40, V = (x, y, z) => new T.Vector3(x, y, z), TAU = Math.PI * 2;
for (let la = -60; la <= 60; la += 30) { const y = Math.sin(la * Math.PI / 180), q = Math.cos(la * Math.PI / 180); for (let i = 0; i < N; i++) { const u = i / N * TAU, w = (i + 1) / N * TAU; P.push(V(q * Math.cos(u), y, q * Math.sin(u)), V(q * Math.cos(w), y, q * Math.sin(w))); } }
for (let lo = 0; lo < 6; lo++) { const p = lo * Math.PI / 6; for (let i = 0; i < N; i++) { const u = i / N * TAU, w = (i + 1) / N * TAU; P.push(V(Math.cos(u) * Math.cos(p), Math.sin(u), Math.cos(u) * Math.sin(p)), V(Math.cos(w) * Math.cos(p), Math.sin(w), Math.cos(w) * Math.sin(p))); } }
const lm = new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
const ln = new T.LineSegments(new T.BufferGeometry().setFromPoints(P), lm); ln.scale.setScalar(1.004); grp.add(ln);
const km = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
const rm = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: T.DoubleSide });
const kn = new T.Mesh(new T.SphereGeometry(0.13, 24, 16), km), rg = new T.Mesh(new T.RingGeometry(0.27, 0.3, 40), rm);
const gm = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }), gl = new T.Mesh(new T.SphereGeometry(0.3, 24, 16), gm); sc.add(gl); sc.add(kn); sc.add(rg);
let g = 0, rx = 0, ry = 0, spin = 0, tt = 0, kx = 0, ky = 0, last = performance.now(); const t0 = last;
const loop = (now) => {
if (!document.body.contains(cv)) { r.dispose(); return; }
requestAnimationFrame(loop); if (document.hidden || document.getElementById('qload') || now - last < 30) return;
if (!cv.offsetParent) { last = now; return; } const dt = Math.min(0.1, (now - last) / 1000), k = (now - t0) / 1000, d = dark(); last = now;
g += (S.act - g) * 0.12; spin += dt * 0.16; tt += dt * 0.5;
rx += (S.tx - rx) * 0.15; ry += (S.ty - ry) * 0.15; kx += (S.kx - kx) * 0.3; ky += (S.ky - ky) * 0.3;
U.uA.value = 0; U.uT.value = tt; U.uC.value.setHex(d ? 0xf2f2f4 : 0x1a1a1d);
lm.color.setHex(d ? 0xffffff : 0x111111); lm.opacity = 0;
const x = kx * 0.55, y = -ky * 0.55, z = Math.sqrt(Math.max(0, 1 - x * x - y * y)) + 0.05;
kn.position.set(x, y, z); rg.position.set(x, y, z + 0.01); gl.position.set(x, y, z - 0.02);
km.color.setHex(d ? 0xffffff : 0x111111); rm.color.setHex(d ? 0xffffff : 0x111111); km.opacity = g * 0.95; rm.opacity = 0; gm.color.setHex(d ? 0xffffff : 0x111111); gm.opacity = g * (0.22 + Math.sin(tt * 4) * 0.06);
grp.rotation.y = spin + ry; grp.rotation.x = 0.35 + rx; grp.position.y = 0; grp.scale.setScalar(1);
r.render(sc, cam);
};
requestAnimationFrame(loop);
};
const init = (oid, cid) => {
const orb = $('#' + oid), cv = $('#' + cid); if (!orb) return; if (!cv) return; if (cv.dataset.on) return; cv.dataset.on = '1';
const S = { act: 0, tx: 0, ty: 0, kx: 0, ky: 0 }; let it = 0, held = false, drag = false, dir = '', zone = 'xy', sx = 0, sy = 0, mv = 0, st0 = 0;
const bootBall = () => { if (document.getElementById('qload')) { setTimeout(bootBall, 250); return; } lib(() => ball(cv, S)); }; bootBall();
const poke = () => { clearTimeout(it); it = setTimeout(rest, IDLE); };
const rest = () => { if (held) { poke(); return; } orb.classList.remove('on'); orb.setAttribute('aria-expanded', 'false'); S.act = 0; S.kx = 0; S.ky = 0; S.tx = 0; S.ty = 0; };
const af = orb.querySelector('.qb-af'); let raf = 0, sp = 0; const tick = () => { const t = dir ? (window.QSPEED ? window.QSPEED() : 0) : 0; sp += (t - sp) * 0.25; if (af) af.style.strokeDashoffset = String(100 - sp * 100); if (drag ? true : sp > 0.01) raf = requestAnimationFrame(tick); else raf = 0; }; const open = () => { orb.classList.add('on'); orb.setAttribute('aria-expanded', 'true'); S.act = 1; if (!raf) raf = requestAnimationFrame(tick); poke(); };
const on = () => orb.classList.contains('on');
const send = (k) => { if (k === dir) return; if (dir) window.dispatchEvent(new Event('pointerup')); dir = k; if (!k) return; const b = orb.querySelector('[data-n="' + k + '"]'); if (b) b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 })); };
const move = (e) => {
const b = orb.getBoundingClientRect(), R = b.width * 0.3;
let dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2); const m = Math.hypot(dx, dy);
if (m > R) { dx = dx / m * R; dy = dy / m * R; }
mv = Math.max(mv, Math.hypot(e.clientX - sx, e.clientY - sy));
window.QPUSH = Math.max(0, Math.min(1, (m - R * 0.4) / (R * 0.6))); S.kx = dx / R; S.ky = dy / R; S.tx = S.ky * 0.45; S.ty = S.kx * 0.6;
 send(zone === 'z' ? (sx < b.left + b.width / 2 ? 'zout' : 'zin') : (m < R * 0.4 || mv < 8 ? '' : Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'))); poke();
};
const end = () => { if (!drag) return; drag = false; const bb = orb.getBoundingClientRect(), tk = zone === 'z' ? (sx < bb.left + bb.width / 2 ? 'zout' : 'zin') : '', tap = mv < 8 && Date.now() - st0 < 300; send('');  window.QPUSH = null; window.QHOLD = null; S.kx = 0; S.ky = 0; S.tx = 0; S.ty = 0; held = false; rest(); };
orb.addEventListener('pointerdown', (e) => {
if (e.button > 0) return;
if (e.target.closest('[data-n]')) { held = true; poke(); return; }
sx = e.clientX; sy = e.clientY; mv = 0; st0 = Date.now(); const b = orb.getBoundingClientRect(); zone = Math.abs(sx - (b.left + b.width / 2)) > b.width * 0.22 ? 'z' : 'xy';
if (!on()) open(); window.QHOLD = Date.now();
drag = true; held = true; try { orb.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); move(e);
});
orb.addEventListener('pointermove', (e) => { if (drag) move(e); });
orb.addEventListener('pointerup', (e) => { if (e.target.closest('[data-n]')) return; end(); });
orb.addEventListener('pointercancel', () => { mv = 99; end(); });
orb.addEventListener('keydown', (e) => { if (e.key !== 'Enter' && e.key !== ' ') return; e.preventDefault(); if (on()) { held = false; rest(); } else open(); });
window.addEventListener('pointerup', (e) => { if (!e.isTrusted) return; if (!on()) return; held = false; poke(); });
};
const prev = Q.dashboard; Q.dashboard = () => { prev(); init('qbOrb', 'qbBall'); init('qbOrbK', 'qbBallK'); }; if ($('#qbOrb')) { init('qbOrb', 'qbBall'); init('qbOrbK', 'qbBallK'); }
})();

/* ---------- dashboard only: validated loading screen + music (never on the landing page) ---------- */
(() => {
  const isDash = () => /^#dashboard/.test(location.hash);
  const S = ['Sources/Musics/Qasthra.mp3', 'Sources/Musics/Qasthra.m4a'];
  const ev = ['pointerup', 'touchend', 'click', 'keydown'];
  let a = null, i = 0, was = false;
  const off = () => ev.forEach((e) => window.removeEventListener(e, go, true));
  const go = () => { if (!a || window.QBLOCK || !isDash()) return; const p = a.play(); if (p && p.then) p.then(off).catch(() => {}); };
  const start = () => { if (a) return; a = new Audio(); a.loop = true; a.preload = 'metadata'; a.volume = 0.08; a.src = S[0]; a.addEventListener('error', () => { if (i < S.length - 1) { i++; a.src = S[i]; a.load(); go(); } }); ev.forEach((e) => window.addEventListener(e, go, true)); go(); };
  const stop = () => { off(); if (a) { a.pause(); a.removeAttribute('src'); a.load(); a = null; i = 0; } };
  const authed = async () => !!(window.QAUTH && await window.QAUTH.session());
  const sync = async () => {
    const d = isDash(); if (d === was) return; was = d;
    if (!d) { stop(); if (!window.QBLOCK && window.QAUTH) window.QAUTH.hideVeil(); return; }
    if (await authed()) { if (isDash() && !window.QBLOCK) { start(); if (!document.getElementById('qload')) window.QAUTH.showVeil('Sources/Videos/Qasthra_intro.gif', 4300); } }
    else if (window.QAUTH) window.QAUTH.hideVeil();
  };
  window.addEventListener('hashchange', sync); document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); } else if (isDash() && !window.QBLOCK) { authed().then((ok) => { if (ok && isDash() && !window.QBLOCK && !document.hidden) start(); }); } }); window.addEventListener('pagehide', stop);
  sync();
  (async () => {
    if (isDash()) return;
    document.documentElement.dataset.screenTransition = '1';
    const hint = (() => { try { return Object.keys(localStorage).some((k) => /auth-token/i.test(k)); } catch (e) { return false; } })(); if (hint && window.QAUTH) window.QAUTH.showVeil('Sources/Videos/Qasthra_intro.gif', 4300); window.QWAIT = true; let saved = false; try { saved = await Promise.race([authed(), new Promise((r) => setTimeout(() => r(false), 8000))]); } catch (e) { saved = false; }
    if (saved && !isDash()) { location.hash = 'dashboard'; window.QWAIT = false; }
    else { window.QWAIT = false; if (!isDash()) { delete document.documentElement.dataset.screenTransition; if (window.QAUTH) window.QAUTH.hideVeil(); } }
  })();
})();
// ---------- input guards: stop bad input while typing, before anything is submitted ----------
(() => {
  // Allowed email endings. Add or remove domains here.
  const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me'];
  const BADCH = /[<>{}\[\]`\u0000-\u0009\u000b-\u001f\u007f]/g;
  const EMAIL_OK = new RegExp('^[a-z0-9]+(?:[._%+-][a-z0-9]+)*@(?:' + DOMAINS.map((d) => d.replace('.', '\\.')).join('|') + ')$');
  const GHP = 'https://github.com/';
  const GH_OK = /^https:\/\/github\.com\/[A-Za-z0-9_.\/-]{1,120}$/;
  const fixEmail = (v) => {
    v = String(v || '').toLowerCase().replace(/[^a-z0-9._%+@-]/g, '');
    const i = v.indexOf('@');
    const clean = (s) => s.replace(/^[._%+-]+/, '').replace(/([._%+-])[._%+-]+/g, '$1');
    if (i < 0) return clean(v).slice(0, 64);
    const local = clean(v.slice(0, i)).replace(/[._%+-]+$/, '').slice(0, 64);
    if (!local) return '';
    let dom = v.slice(i + 1).replace(/@/g, '');
    while (dom && !DOMAINS.some((d) => d.indexOf(dom) === 0)) dom = dom.slice(0, -1);
    return local + '@' + dom;
  };
  const fixPhone = (v) => {
    let s = String(v || '').replace(/[^0-9+]/g, '');
    let plus = s.charAt(0) === '+';
    if (!plus && s.charAt(0) === '0') { s = '63' + s.slice(1); plus = true; }
    s = s.replace(/\+/g, '').slice(0, 15);
    if (plus && s.slice(0, 2) === '63') {
      const n = s.slice(2, 12);
      return '+63' + (n ? ' ' + [n.slice(0, 3), n.slice(3, 6), n.slice(6, 10)].filter(Boolean).join(' ') : '');
    }
    return (plus ? '+' : '') + s.replace(/(\d{3})(?=\d)/g, '$1 ');
  };
  const fixName = (v) => String(v || '').replace(/[^\p{L}\p{M} '.-]/gu, '').replace(/\s+/g, ' ').replace(/^[ '.-]+/, '').slice(0, 60);
  const fixLink = (v) => {
    v = String(v || '').replace(/[^A-Za-z0-9_.\/:-]/g, '').slice(0, 200);
    if (!v) return '';
    if (v.indexOf(GHP) === 0) return GHP + v.slice(GHP.length).replace(/:/g, '').slice(0, 120);
    if (GHP.indexOf(v) === 0) return v;
    return GHP + v.replace(/^(?:https?:\/\/)?(?:www\.)?(?:github\.com\/)?/i, '').replace(/:/g, '').slice(0, 120);
  };
  const valid = (f) => {
    const g = (n) => { const e = f.querySelector('[name=' + n + ']'); return e ? String(e.value).replace(/\s+/g, ' ').trim() : ''; };
    const v = f.dataset.v;
    if (!/^\p{L}[\p{L}\p{M} '.-]*$/u.test(g('name'))) return false;
    const em = g('email');
    if ((v === 'contact' || em) && !EMAIL_OK.test(em)) return false;
    const ph = g('phone'), pd = ph.replace(/\D/g, '');
    if ((v === 'contact' || ph) && (pd.length < 8 || pd.length > 15 || false)) return false;
    const lk = g('link');
    if (lk && !GH_OK.test(lk)) return false;
    return g('message').length >= 5;
  };
  const gate = (f) => { const b = f.querySelector('.cs-send'); if (b) b.disabled = !valid(f); };
  window.csGate = gate;
  const plain = (el) => el.matches('input:not([type=password]):not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea') && !/^(username|remail|phone|name)$/.test(el.name);
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (e.isComposing) { const f0 = el && el.closest ? el.closest('.cs-form') : null; if (f0) gate(f0); } if (e.isComposing || !el || !el.name || !el.matches) return;
    const f = el.closest('.cs-form');
    const v = el.value;
    let n;
    if (el.name === 'remail' || (f && el.name === 'email')) n = fixEmail(v);
    else if (f && el.name === 'phone') n = fixPhone(v);
    else if (f && el.name === 'name') n = fixName(v);
    else if (f && el.name === 'link') n = fixLink(v);
    else if (f && el.name === 'message') n = v.replace(BADCH, '').slice(0, 1000);
    else if (el.closest('.au-card') && plain(el)) n = v.replace(BADCH, '');
    else return;
    if (n !== v) el.value = n;
    if (f) gate(f);
  });
  document.addEventListener('change', (e) => { const f = e.target && e.target.closest ? e.target.closest('.cs-form') : null; if (f) gate(f); });
  document.addEventListener('focusout', (e) => {
    const el = e.target;
    if (el && (el.name === 'remail' || el.name === 'email') && /@$/.test(el.value)) { el.value = el.value.slice(0, -1); const f = el.closest('.cs-form'); if (f) gate(f); }
  });
  const init = () => {
    document.querySelectorAll('[name=email],[name=remail]').forEach((el) => { el.setAttribute('inputmode', 'email'); el.setAttribute('autocapitalize', 'none'); el.setAttribute('spellcheck', 'false'); });
    document.querySelectorAll('.cs-form:not([data-g])').forEach((f) => { f.dataset.g = '1'; gate(f); });
  };
  new MutationObserver(init).observe(document.documentElement, { childList: true, subtree: true });
  init();
})();
['keyup', 'compositionend', 'paste', 'focusout'].forEach((t) => document.addEventListener(t, (e) => { const f = e.target && e.target.closest ? e.target.closest('.cs-form') : null; if (f && window.csGate) setTimeout(() => window.csGate(f), 0); }));
(function(){var last=null,app=document.getElementById('app');function close(){var p=document.querySelector('.pop');if(!p)return;p.remove();document.documentElement.classList.remove('pop-open');if(app)app.inert=false;if(last&&last.focus)last.focus();last=null}function open(id,from){close();last=from;var p=document.createElement('div');p.className='pop';p.setAttribute('role','dialog');p.setAttribute('aria-modal','true');p.setAttribute('aria-label',from.textContent);p.dataset.pop=id;var b=document.createElement('button');b.type='button';b.className='pop-x';b.setAttribute('aria-label','Close');b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';p.appendChild(b);document.body.appendChild(p);document.documentElement.classList.add('pop-open');if(app)app.inert=true;b.focus()}document.addEventListener('click',function(e){var a=e.target.closest('a[data-pop]');if(a){e.preventDefault();open(a.dataset.pop,a);return}if(e.target.closest('.pop-x'))close()});document.addEventListener('keydown',function(e){if(e.key==='Escape')close()})})();
