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
    route() { const h = location.hash; document.title = /^#dashboard/.test(h) ? 'Dashboard' : /^#x-unused/.test(h) ? '| Qasthra' : /^#signin/.test(h) ? 'Sign in | Qasthra' : /^#info/.test(h) ? 'Information | Qasthra' : /^#contact/.test(h) ? 'Contact | Qasthra' : /^#support/.test(h) ? 'Support | Qasthra' : 'Qasthra'; api.render(/^#dashboard/.test(h) ? 'dashboard' : /^#signin/.test(h) ? 'auth' : 'home'); }
  };
  Object.defineProperty(window, 'screen', { value: api, writable: true, configurable: true });
  api.render('home');
  window.addEventListener('hashchange', api.route);
  api.route();
})();

(() => {
  const host = document.getElementById('scene');
  if (!host || typeof THREE === 'undefined') return;

  const init = () => {
  const reduce = false;
  const dark = matchMedia('(prefers-color-scheme: dark)');

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

  const N = 80;
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
  dark.addEventListener('change', () => { theme(); lit.fill(1); nodeLit.fill(1); });
  window.addEventListener('themechange', () => { theme(); lit.fill(1); nodeLit.fill(1); });

  const glowSyn = new Float32Array(synCount);
  const lit = new Uint8Array(synCount).fill(1); const nodeLit = new Uint8Array(N).fill(1);
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
    if (document.documentElement.dataset.screen !== 'home' || !visible || document.hidden) { last = now; return; }
    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    const m = reduce ? .15 : 1;

    if (now > nextSpin) {
      spinTarget = rnd(-.45, .45) * (Math.random() < .25 ? 2 : 1);
      nextSpin = now + rnd(2500, 6000);
    }
    spinV += (spinTarget - spinV) * Math.min(1, dt * .8);
    rotY += spinV * dt * m;
    rotX = .18 + Math.sin(now * .00035) * .22 + Math.sin(now * .00091) * .06;
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
    const decay = Math.exp(-dt * 2.4);
    let changed = false, nodeChanged = false;
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
      if (glowNode[i] < .004 && !nodeLit[i]) continue; const g = glowNode[i] *= decay; nodeLit[i] = g < .004 ? 0 : 1; nodeChanged = true;
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
    if (nodeChanged) nodes.instanceColor.needsUpdate = true;
    if (nodeChanged) nodes.instanceMatrix.needsUpdate = true;

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
  const waitForRoute = () => { if (document.documentElement.dataset.screenTransition === '1' || /^#dashboard/.test(location.hash) || (authHint() && Date.now() - waitStarted < 2500)) { setTimeout(waitForRoute, 180); return; } init(); };
  schedule(waitForRoute);
})();

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

window.db = (window.supabase && window.supabase.createClient) ? window.supabase.createClient('https://hwffsxhonbymzwomhoyd.supabase.co', 'sb_publishable_Rqtyo62gG01MIWkF5Jz8Qw_Xe-UoXCZ', { auth: { flowType: 'pkce' } }) : null;

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
(() => {
  const nb = document.querySelector('.nav-center');
  const hb = document.getElementById('showBtn');
  if (!nb || !hb || !('IntersectionObserver' in window)) return;
  new IntersectionObserver((en) => nb.classList.toggle('show', !en[0].isIntersecting)).observe(hb);
})();
(() => { const box = document.querySelector('#page .page-in'); if (!box) return; const data = { info: { t: 'Informations', d: ['Everything about how Qasthra works.', 'Guides and references in one place.'] }, contact: { t: 'Contact', d: ['Questions, ideas and partnerships.', 'We reply as soon as we can.'] }, support: { t: 'Support', d: ['Help us improve the service and product.', 'Share suggestions, report bugs or send code.'] } }; const draw = () => { const x = data[location.hash.slice(1)]; if (!x) { box.innerHTML = ''; return; } box.innerHTML = '<header class="view-head"><h2>' + x.t + '</h2><p class="sub">' + x.d[0] + '<br>' + x.d[1] + '</p></header>'; }; window.addEventListener('hashchange', draw); draw(); })();
(() => { const box = document.querySelector('#page .page-in'); if (!box) return; const BAD = /[<>{}\[\]`]/; const EMAIL = /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|proton\.me)$/i; const GH = /^https:\/\/github\.com\/[A-Za-z0-9_.\/-]{1,120}$/; const clean = (s) => String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim(); const PH = { name: 'Your name', email: 'you@example.com', phone: '+63 900 000 0000', link: 'https://github.com/qasthra/Qasthra' }; const AC = { name: 'name', email: 'email', phone: 'tel' }; const inp = (n, l, t, m, req) => '<label class="cs-f"><span>' + l.replace(' *', ' <em>*</em>') + '</span><input name="' + n + '" type="' + t + '" maxlength="' + m + '" autocomplete="' + (AC[n] || 'off') + '" placeholder="' + (PH[n] || '') + '"' + (t === 'tel' ? ' inputmode="tel"' : '') + (req ? ' required' : '') + '></label>'; const area = '<label class="cs-f"><span>Message <em>*</em></span><textarea name="message" rows="5" maxlength="1000" placeholder="Write your message here" required></textarea></label>'; const hp = '<div class="cs-hp" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>'; const tail = '<button class="btn btn-mono cs-send" type="submit">Send message</button><p class="cs-note" role="status" aria-live="polite"></p></form></div>'; const HTML = { contact: '<div class="cs"><div class="cs-info"><div class="cs-card"><i class="cs-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></i><div class="cs-txt"><b>Email</b><a href="mailto:Qasthra@gmail.com">Qasthra@gmail.com</a></div><button class="cs-copy" type="button" data-copy="Qasthra@gmail.com">Copy</button></div><div class="cs-card"><i class="cs-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></i><div class="cs-txt"><b>Phone</b><a href="tel:+639245266251">+63 924 526 6251</a></div><button class="cs-copy" type="button" data-copy="+63 924 526 6251">Copy</button></div></div><form class="cs-form" novalidate data-v="contact"><h3 class="cs-title">Send us a message</h3><p class="cs-hint">Fields marked * are required.</p>' + inp('name', 'Name *', 'text', 60, 1) + '<div class="cs-row">' + inp('email', 'Email *', 'email', 120, 1) + inp('phone', 'Phone *', 'tel', 30, 1) + '</div>' + area + hp + tail, support: '<div class="cs"><div class="cs-info"><div class="cs-card"><i class="cs-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg></i><div class="cs-txt"><b>GitHub</b><a class="cs-stretch" href="https://github.com/qasthra/Qasthra" target="_blank" rel="noopener noreferrer">github.com/qasthra/Qasthra</a></div></div><div class="cs-card"><i class="cs-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg></i><div class="cs-txt"><b>Help us improve</b><span>Suggest features, report bugs or share code.</span></div></div></div><form class="cs-form" novalidate data-v="support"><h3 class="cs-title">Share your idea</h3><p class="cs-hint">Fields marked * are required.</p><div class="cs-row">' + inp('name', 'Name *', 'text', 60, 1) + inp('email', 'Email', 'email', 120, 0) + '</div><div class="cs-row">' + inp('phone', 'Phone', 'tel', 30, 0) + '<label class="cs-f"><span>Type</span><select name="kind"><option value="Suggestion">Suggestion</option><option value="Feature request">Feature request</option><option value="Bug report">Bug report</option><option value="Code contribution">Code contribution</option><option value="Performance issue">Performance issue</option><option value="Security concern">Security concern</option><option value="Design feedback">Design feedback</option><option value="Documentation">Documentation</option><option value="Integration request">Integration request</option><option value="Partnership">Partnership</option><option value="Question">Question</option><option value="Other">Other</option></select></label></div>' + inp('link', 'GitHub', 'url', 200, 0) + area + hp + tail }; const draw = () => { const h = location.hash.slice(1); if (!HTML[h] || box.querySelector('.cs')) return; box.insertAdjacentHTML('beforeend', HTML[h]); }; window.addEventListener('hashchange', draw); draw(); box.addEventListener('submit', async (e) => { const f = e.target.closest('form.cs-form'); if (!f) return; e.preventDefault(); const note = f.querySelector('.cs-note'), btn = f.querySelector('button'); const say = (t, ok) => { note.textContent = ok === 0 ? '' : t; note.dataset.ok = ok === 1 ? '1' : ok === 2 ? '2' : '0'; }; const v = f.dataset.v, d = new FormData(f); if (d.get('website')) { say('Thanks!', 1); f.reset(); return; } const row = {}; for (const k of ['name', 'email', 'phone', 'kind', 'link', 'message']) { if (!d.has(k)) continue; const x = clean(d.get(k)); if (x && BAD.test(x)) { say('Please remove these symbols and try again: < > { } [ ] and backtick.', 0); return; } row[k] = x || null; } if (!row.message || row.message.length < 5) { say('Please write a message of at least 5 characters.', 0); return; } if (!row.name) { say('Please enter your name.', 0); return; } if (v === 'contact' && !row.phone) { say('Please enter your phone number.', 0); return; } if ((v === 'contact' || row.email) && !EMAIL.test(row.email || '')) { say('Please enter a valid email address.', 0); return; } if (row.link && !GH.test(row.link)) { say('Link must start with https://github.com/', 0); return; } if (row.phone && !/^\+?[0-9][0-9 -]{5,18}[0-9]$/.test(row.phone)) { say('Please enter a valid phone number.', 0); return; } try { if (Date.now() - Number(localStorage.getItem('cs_last') || 0) < 30000) { say('Please wait a moment before sending again.', 2); return; } } catch (x) {} if (!window.db) { say('Connection unavailable. Please try again later.', 2); return; } btn.disabled = true; try { const r = await window.db.from(v === 'contact' ? 'contact_messages' : 'support_suggestions').insert([row]); if (r.error) throw r.error; try { localStorage.setItem('cs_last', String(Date.now())); } catch (x) {} f.reset(); say('Sent. Thank you!', 1); } catch (x) { say('Could not send. Please try again later.', 2); } if (window.csGate) window.csGate(f); else btn.disabled = false; }); })();





(() => { const show = document.getElementById('showBtn'), dash = document.getElementById('dashBtn'); if (!show || !dash) return; const name = show.textContent.trim(); let on = false, busy = false, w0 = 0, vw = window.innerWidth, tm;
const expand = () => { if (busy) return; busy = true; clearTimeout(tm); const s = show.getBoundingClientRect(), d = dash.getBoundingClientRect(); w0 = s.width; dash.style.width = dash.getBoundingClientRect().width + 'px'; const w1 = Math.abs(s.top - d.top) < 6 ? Math.max(s.width, s.right - d.left) : s.width; show.style.width = w0 + 'px'; show.style.marginLeft = '0px'; void show.offsetWidth; on = true; show.textContent = 'A1.00'; show.setAttribute('aria-expanded', 'true'); show.parentElement.classList.add('soon'); show.style.width = w1 + 'px'; show.style.marginLeft = (w0 - w1) + 'px'; setTimeout(() => { busy = false; }, 450); };
const collapse = () => { if (!on || busy) return; busy = true; on = false; show.textContent = name; show.setAttribute('aria-expanded', 'false'); show.parentElement.classList.remove('soon'); show.style.width = w0 + 'px'; show.style.marginLeft = '0px'; tm = setTimeout(() => { show.style.width = ''; show.style.marginLeft = ''; dash.style.width = ''; busy = false; }, 450); };
show.setAttribute('aria-expanded', 'false'); show.addEventListener('click', () => { if (on) collapse(); else expand(); }); dash.addEventListener('click', collapse); window.addEventListener('resize', () => { if (window.innerWidth !== vw) { vw = window.innerWidth; if (on && !busy) collapse(); } });
})();
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

(() => {
  const $ = (s, r) => (r || document).querySelector(s);
  const html = document.documentElement;
  const sys = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (html.dataset.theme ? html.dataset.theme === 'dark' : sys.matches);
  const flip = () => { const n = isDark() ? 'light' : 'dark'; html.dataset.theme = n; try { localStorage.setItem('theme', n); } catch (e) {} window.dispatchEvent(new Event('themechange')); };
  document.addEventListener('click', (e) => { if (e.target.closest('[data-theme-btn]')) flip(); });
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
    const img = L.querySelector('img'); img.src = window.QGIF ? window.QGIF.url(src || fallback) : src || fallback;
    L.dataset.s = Date.now(); img.onload = () => { img.dataset.t = Date.now(); }; img.onerror = () => { if (img.src.indexOf(fallback) < 0) img.src = fallback; };
    const finish = () => { const t = +img.dataset.t, s = +L.dataset.s, need = ms ? ms : 2200, n = Date.now(); if ((t > 0 ? n - t < need - 300 : true) && n - s < need + 3000) { veilTimer = setTimeout(finish, 100); return; } if (window.QWAIT) { veilTimer = setTimeout(finish, 150); return; } L.classList.add('out'); veilRemoveTimer = setTimeout(() => { if (L.parentNode) L.remove(); if (src && /intro/i.test(src)) delete document.documentElement.dataset.screenTransition; resolve(); }, 400); }; veilTimer = setTimeout(finish, ms || 2200);
  });
  const hideVeil = () => { clearTimeout(veilTimer); clearTimeout(veilRemoveTimer); const L = document.getElementById('qload'); if (L) L.remove(); };
  const signOut = async () => { document.documentElement.classList.add('qx'); sP = null; try { if (window.QPROF && window.QPROF.reset) window.QPROF.reset(); } catch (e) {} window.QBLOCK = true; document.documentElement.dataset.screenTransition = '1'; const veil = showVeil('Sources/Videos/Qasthra_outro.gif', 4300); try { if (window.db) await window.db.auth.signOut({ scope: 'local' }); } catch (e) {} sP = null; await veil; location.hash = ''; hideVeil(); window.QBLOCK = false; setTimeout(() => document.documentElement.classList.remove('qx'), 300); delete document.documentElement.dataset.screenTransition; };
  const GB = {}; ['Sources/Videos/Qasthra.gif', 'Sources/Videos/Qasthra_intro.gif', 'Sources/Videos/Qasthra_outro.gif'].forEach((u) => { fetch(u).then((r) => (r.ok ? r.blob() : null)).then((b) => { if (b) GB[u] = b; }).catch(() => {}); }); window.QGIF = { url: (u) => (GB[u] ? URL.createObjectURL(GB[u]) : u + (u.indexOf('?') < 0 ? '?' : '&') + 'r=' + Date.now()) }; window.QAUTH = { session, showVeil, hideVeil, signOut };
  const clean = (s) => String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  const EMAIL = /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|proton\.me)$/i;
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
  const addr = (u) => 'qasthra+' + u + '@gmail.com';
  const ageOf = (iso) => { const b = new Date(iso); if (isNaN(b)) return -1; const n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; return a; };
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
    + '<p>By continuing you agree and have read:</p><p class="au-links"><a href="#" data-pop="licenses">Licenses and Policies</a> | <a href="#" data-pop="terms">Terms and Conditions</a> | <a href="#" data-pop="guidance">Guidance and Recovery</a></p></div>'
    + '</form></main></div>';

  const DASH = '<div class="qa"><header class="qa-bar" id="qbHost"></header><main class="qa-view"></main></div>';

  const QA = window.QA = {};

  QA.auth = () => {
    const host = $('#authRoot');
    if (!host) return;
    if (!window.db) { host.textContent = 'Auth is not available. Check your connection.'; return; }
    session().then((s) => { if (s) location.replace('#dashboard'); });
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
          if (!r.error) { location.replace('#dashboard'); return; }
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
        if (r.data && r.data.session) { location.replace('#dashboard'); } else if (r.data && r.data.user && r.data.user.identities && r.data.user.identities.length === 0) { exists = true; say(TAKEN); fresh(); } else { toIn(); say('Account created. Sign in to continue.'); fresh(); }
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
    if (await session()) { location.replace('#dashboard'); return; }
    if (window.CAP.state() !== 'ok') return;
    location.hash = 'signin';
  });
})();
(() => {
const Q = window.QA; if (!Q || !Q.dashboard) return;
const $ = (s, r) => (r || document).querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + ';');
const uid = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), (x) => (x % 36).toString(36)).join('');
const ld = (k, d) => { try { const v = localStorage.getItem('qb:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const sv = (k, v) => { try { localStorage.setItem('qb:' + k, JSON.stringify(v)); } catch (e) {} };
const ic = (d) => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = { left: ic('<path d="M15 6l-6 6 6 6"/>'), right: ic('<path d="M9 6l6 6-6 6"/>'), up: ic('<path d="M6 15l6-6 6 6"/>'), down: ic('<path d="M6 9l6 6 6-6"/>'), reload: ic('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'), plus: ic('<path d="M12 5v14M5 12h14"/>'), x: ic('<path d="M6 6l12 12M18 6L6 18"/>'), clock: ic('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'), star: ic('<path d="M12 4l2.4 5 5.6.7-4.1 3.8 1 5.5-4.9-2.7-4.9 2.7 1-5.5L4 9.7 9.6 9z"/>'), xfer: ic('<path d="M8 4v14M4 14l4 4 4-4M16 20V6M12 10l4-4 4 4"/>'), lock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'), unlock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.4-2"/>'), minus: ic('<path d="M5 12h14"/>'), search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'), gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>') };
const DIG = /^(\d)(?:\{(\d{1,9})\})?/;
const rle = (s) => { const r = []; let i = 0; while (i < s.length) { const m = DIG.exec(s.slice(i)); if (!m) return null; const b = !!m[2], n = b ? +m[2] : 1, l = r[r.length - 1]; if (b && n < 2) return null; if (l && l.d === m[1]) { if (b || l.b) return null; l.n += 1; } else r.push({ d: m[1], n: n, b: b }); i += m[0].length; } return r.length ? r : null; };
const axis = (s) => { const m = /^([+-]?)([0-9{}]+)(?:\.([0-9{}]+))?$/.exec(s.trim()); if (!m) return null; const a = rle(m[2]), f = m[3] ? rle(m[3]) : []; if (!a || !f) return null; const len = a.reduce((t, x) => t + x.n, 0), zero = a.length === 1 && a[0].d === '0', mag = len - 1 + Math.log10(Math.max(1, +a[0].d)), p = zero ? 0 : Math.min(46, 4 + 5 * Math.log2(2 + mag)); return { raw: m[1] + m[2] + (m[3] ? '.' + m[3] : ''), p: m[1] === '-' ? -p : p }; };
const coords = (q) => { q = q.trim().replace(/^[("']+|[)"']+$/g, ''); const w = q.split(','); if (w.length !== 3) return null; const o = {}; for (let i = 0; i < 3; i++) { const m = /^\s*([XYZxyz])\s*=\s*(.+)$/.exec(w[i]); if (!m || m[1].toUpperCase() !== 'XYZ'.charAt(i)) return null; const v = axis(m[2]); if (!v) return null; o[m[1].toUpperCase()] = v; } return o; };
const ctext = (c) => 'X=' + c.X.raw + ', Y=' + c.Y.raw + ', Z=' + c.Z.raw;
const TIERS = ['Core', 'Orbit', 'Archive'];
const st = { worlds: [], active: '', priv: ['Encrypted', 'Private'].includes(ld('acstatus', 'Decrypted')), panel: '', hist: ld('hist', []).filter((h) => h && h.k !== 'world'), saved: ld('saved', []), xfer: [], sync: ld('sync', false) };
const QZ = 'X=0, Y=0, Z=0', QMSG = 'Only 1 Qasthra tab is allowed.';
const qfull = (w) => st.worlds.filter((x) => x !== w && title(x) === 'Qasthra').length >= 1;
const nw = () => ({ id: uid(), tr: [{ k: 'universe', q: '' }], i: 0 });
st.worlds = ((() => { try { return localStorage.getItem('qs:restore') === '0'; } catch (e) { return false; } })() ? [] : ld('worlds', [])).filter((w) => w && Array.isArray(w.tr) && w.tr[w.i]).map((w) => ({ id: w.id, tr: [w.tr[w.i]], i: 0 })).filter((w, n, a) => { const q0 = (x) => x.tr[x.i].k === 'universe' ? true : x.tr[x.i].k === 'coord' && x.tr[x.i].q === QZ; return !q0(w) ? true : a.findIndex(q0) === n; });
const ent = (w) => w.tr[w.i];
const cur = () => st.worlds.find((w) => w.id === st.active) || st.worlds[0];
const title = (w) => { const e = ent(w); return e.k === 'universe' ? 'Qasthra' : e.k === 'coord' ? siteTitle(e.c) : e.q; };
let kt = 0; const keep = () => { sv('worlds', st.worlds); if (st.sync) { clearTimeout(kt); kt = setTimeout(() => push(), 1500); } };
const say = () => {};
const who = async () => { try { const r = await window.db.auth.getSession(); return r.data.session.user.id; } catch (e) { return null; } };
const push0 = async () => { if (!st.sync || !window.db) return; await flush(); await pushTabs(); await push1(); }; const push1 = async () => { if (!st.sync || !window.db) return; const u = await who(); if (!u) return; try { await window.db.from('worlds_saved').upsert(st.saved.map((s) => ({ id: s.id, user_id: u, title: s.title, q: s.q, tier: s.tier, at: s.at })), { onConflict: 'id' }); await window.db.from('worlds_history').upsert(st.hist.map((h) => ({ id: h.id, user_id: u, kind: h.k, q: h.q, at: h.at })), { onConflict: 'id' }); } catch (e) {} };
const pull0 = async () => { if (!st.sync) return; await flush(); await pullTabs(); await pull1(); }; const pull1 = async () => { if (!window.db) return; const u = await who(); if (!u) return; try { const a = await window.db.from('worlds_saved').select('*').eq('user_id', u), b = await window.db.from('worlds_history').select('*').eq('user_id', u).order('at', { ascending: false }).limit(200); (a.data || []).forEach((r) => { if (!st.saved.some((s) => s.id === r.id)) st.saved.push({ id: r.id, title: r.title, q: r.q, tier: r.tier, at: Number(r.at) }); }); (b.data || []).forEach((r) => { if (r.kind !== 'world' && !st.hist.some((h) => h.id === r.id)) st.hist.push({ id: r.id, k: r.kind, q: r.q, at: Number(r.at) }); }); st.hist.sort((x, y) => y.at - x.at); st.hist.length = Math.min(st.hist.length, 200); sv('saved', st.saved); sv('hist', st.hist); } catch (e) {} };
const pushTabs = async () => { const u = await who(); if (!u) return; const rows = st.worlds.map((w, n) => { const e = ent(w); return { id: w.id, user_id: u, pos: n, k: e.k, q: e.q, at: Date.now() }; }); try { if (rows.length) await window.db.from('worlds_open').upsert(rows, { onConflict: 'id' }); let d = window.db.from('worlds_open').delete().eq('user_id', u); if (rows.length) d = d.not('id', 'in', '(' + rows.map((r) => '"' + r.id + '"').join(',') + ')'); await d; } catch (e) {} }; const pullTabs = async () => { if (!window.db) return; const u = await who(); if (!u) return; try { const r = await window.db.from('worlds_open').select('*').eq('user_id', u).order('pos', { ascending: true }); const rows = r.data || []; if (!rows.length) return; if (st.worlds.some((w) => ent(w).k !== 'universe')) return; let n = 0; rows.forEach((x) => { if (x.k === 'universe' || st.worlds.some((w) => w.id === x.id)) return; const c = x.k === 'coord' ? coords(x.q) : null; const e = c ? { k: 'coord', q: ctext(c), c: c } : x.k === 'search' ? { k: 'search', q: String(x.q).slice(0, 200) } : null; if (!e) return; st.worlds.push({ id: x.id, tr: [e], i: 0 }); n++; }); if (n && $('#qbHost')) { keep(); draw(); } } catch (e) {} }; let syncB = 0;
const SYNC_T = { off: 'Sync off, tap to turn on', on: 'Sync on and up to date, tap to turn off', busy: 'Syncing, tap to turn off', err: 'Sync paused, you are offline. Tap to turn off' };
const syncState = () => (!st.sync ? (syncB > 0 ? 'busy' : 'off') : navigator.onLine === false ? 'err' : syncB > 0 ? 'busy' : 'on');
const syncSpin = (b, s) => { const g = b.querySelector('svg'); if (!g) return; if (s !== 'off') { g.style.animation = ''; g.style.transition = ''; g.style.transform = ''; b._sp = 1; return; } if (!b._sp) return; b._sp = 0; let a = 0; const m = getComputedStyle(g).transform, v = m && m.match(/matrix\(([^)]+)\)/); if (v) { const p = v[1].split(',').map(Number); a = Math.atan2(p[1], p[0]) * 180 / Math.PI; if (a < 0) a += 360; } let t = 360 - a; if (t < 100) t += 360; g.style.animation = 'none'; g.style.transition = 'none'; g.style.transform = 'rotate(' + a + 'deg)'; void g.getBoundingClientRect(); g.style.transition = 'transform .8s cubic-bezier(.1,.55,.25,1)'; g.style.transform = 'rotate(' + (a + t) + 'deg)'; g.addEventListener('transitionend', () => { g.style.transition = ''; g.style.transform = ''; g.style.animation = ''; }, { once: true }); }; const syncDraw = () => { const s = syncState(); document.querySelectorAll('[data-sw]').forEach((b) => { b.dataset.s = s; syncSpin(b, s); }); document.querySelectorAll('.qb-set [data-sw]').forEach((b) => { b.setAttribute('aria-pressed', String(s !== 'off')); b.setAttribute('title', SYNC_T[s]); b.setAttribute('aria-label', SYNC_T[s]); }); };
const syncRun = (f) => async (...a) => { if (!st.sync) return f(...a); syncB++; syncDraw(); try { return await f(...a); } finally { syncB--; setTimeout(syncDraw, 350); } };
const push = syncRun(push0), pull = syncRun(pull0);
window.addEventListener('online', () => { syncDraw(); push(); });
window.addEventListener('offline', syncDraw);
const ob = ld('outbox', []); const flush = async () => { if (!st.sync || !window.db || navigator.onLine === false || !ob.length) return; const batch = ob.splice(0); for (const o of batch) { let bad = true; try { const r = await window.db.from(o.t).delete().eq(o.c, o.v); bad = !!r.error; } catch (e) {} if (bad) ob.push(o); } sv('outbox', ob); }; const drop = async (t, c, v) => { if (!st.sync) return; ob.push({ t: t, c: c, v: v }); sv('outbox', ob); flush(); };
const toggleSync = async () => { st.sync = !st.sync; sv('sync', st.sync); pop(); syncDraw(); if (st.sync) { await pull(); await push(); } else { const u = await who(); if (u && window.db) { try { await window.db.from('worlds_saved').delete().eq('user_id', u); await window.db.from('worlds_history').delete().eq('user_id', u); await window.db.from('worlds_open').delete().eq('user_id', u); ob.length = 0; sv('outbox', ob); } catch (e) {} } } pop(); };

const SITES = {}, ICONS = {}, SC = new Map(), FAV = 'Sources/Icons/Qasthra.svg';
const favOf = (x) => { const e = ent(x); const k = e.k === 'coord' ? ctext(e.c) : ''; return ICONS[k] ? ICONS[k] : FAV; };
const favBind = (im) => { im.onerror = () => { im.onerror = null; im.src = FAV; }; };
const favDraw = () => { document.querySelectorAll('.qb-strip .qb-w').forEach((t) => { const x = st.worlds.find((y) => String(y.id) === t.dataset.w); const im = t.querySelector('.qb-fav'); if (!x || !im) return; const s = favOf(x); if (im.getAttribute('src') !== s) { favBind(im); im.src = s; } }); };
let ctlOn = false, ctlT = 0, lkT = 0, sgT = 0, RS = { q: '', r: [] };

const QC = { gap: 0, hits: [], lock: 0, db: [], fly: 0 }; const clean = (s, n) => String(s == null ? '' : s).normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180E\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\u3164\uFEFF\uFFA0\uFFF9-\uFFFB]/g, '').replace(/\s+/g, ' ').slice(0, n).replace(/[\uD800-\uDBFF]$/, ''); const okGo = () => { const t = Date.now(); QC.hits = QC.hits.filter((x) => t - x < 10000); if (t < QC.lock || t - QC.gap < 350) return false; if (QC.hits.length >= 8) { QC.lock = t + 5000; return false; } QC.hits.push(t); QC.gap = t; return true; }; const dbOk = () => { const t = Date.now(); QC.db = QC.db.filter((x) => t - x < 60000); if (QC.fly >= 3 || QC.db.length >= 30 || t - (QC.db[QC.db.length - 1] || 0) < 150) return false; QC.db.push(t); return true; }; const fnCall = async (body) => { try { const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 6000); const q = await fetch('https://hwffsxhonbymzwomhoyd.supabase.co/functions/v1/search-sites', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: 'sb_publishable_Rqtyo62gG01MIWkF5Jz8Qw_Xe-UoXCZ' }, body: JSON.stringify(body), signal: ac.signal }); clearTimeout(tm); if (!q.ok) return null; return await q.json(); } catch (e) { return null; } }; const siteFind = async (q, n) => { if (!window.db) return []; const t = clean(q, 60).trim(); if (!t) return []; const key = n + ':' + t.toLowerCase(); const hit = SC.get(key); if (hit && Date.now() - hit.t < 60000) return hit.r; if (!dbOk()) return hit ? hit.r : []; QC.fly++; try { const j = await fnCall({ op: 'find', q: t, n: n }); const a = { data: j && Array.isArray(j.r) ? j.r : [] }, b = { data: [] }; const r = (a.data ? a.data : []).concat(b.data ? b.data : []).slice(0, n); r.forEach((s) => { SITES[s.coord] = s.name; ICONS[s.coord] = /^https:/i.test(s.icon) ? s.icon : ''; }); if (SC.size > 200) SC.clear(); SC.set(key, { t: Date.now(), r: r }); return r; } catch (e) { return []; } finally { QC.fly--; } };
const bumpSite = (id) => { if (!window.db) return; SC.clear(); window.db.rpc('bump_site', { s: id }).then(() => {}, () => {}); };
const lookupName = (c) => { const k = ctext(c); if (SITES[k] !== undefined) { if (SITES[k]) { clearTimeout(lkT); lkT = setTimeout(() => { const w = cur(); if (w && ent(w).k === 'coord' && ctext(ent(w).c) === k && qSeen !== k) view(w); }, 400); } return; } if (!window.db) { SITES[k] = ''; return; } clearTimeout(lkT); lkT = setTimeout(async () => { try { const r = await fnCall({ op: 'coord', coord: k }).then((j) => ({ data: j ? j.r : null, error: j ? null : 1 })); if (r.error) { SITES[k] = ''; } else { SITES[k] = r.data && r.data.name ? r.data.name : ''; ICONS[k] = r.data && /^https:/i.test(r.data.icon) ? r.data.icon : ''; } } catch (e) { SITES[k] = ''; } favDraw(); dispDraw(); const w = cur(), t = $('.qb-w[aria-selected="true"] span'); if (w && ent(w).k === 'coord' && ctext(ent(w).c) === k) { if (t) t.textContent = title(w); if (SITES[k] && qSeen !== k) view(w); } }, 400); };
const siteSug = (v) => { clearTimeout(sgT); const t = clean(v, 60).trim(); if (t.length < 2) return; if (coords(t)) return; const k = t.toLowerCase(); if (RS.q === k) return; sgT = setTimeout(async () => { const r = await siteFind(t, 6); const i = $('.qb-omni input'); if (!i) return; if (document.activeElement !== i) return; if (i.value.trim().toLowerCase() !== k) return; RS = { q: k, r: r.map((s) => ({ q: s.name, tag: s.official ? 'Official' : 'Unofficial', site: s.coord, id: s.id })) }; sugDraw(true); }, 250); };
const lbl = (q) => { const c = coords(q); return c ? siteTitle(c) : q; };
const siteName = (c) => (SITES[ctext(c)] ? SITES[ctext(c)] : ctext(c) === 'X=0, Y=0, Z=0' ? 'Qasthra' : 'Unknown');
const siteTitle = (c) => SITES[ctext(c)] || (ctext(c) === QZ ? 'Qasthra' : ctext(c));
const dispDraw = () => { const f = $('.qb-omni'), d = $('.qb-disp'), i = $('.qb-omni input'); if (!f || !d || !i) return; const e = ent(cur()); if (e.k === 'coord') lookupName(e.c); const on = e.k === 'coord' && document.activeElement !== i; f.classList.toggle('show-disp', on); d.hidden = !on; const xw = $('.qb-wipe'); if (xw) xw.hidden = !(i.value || on); if (on) { if (!d.firstChild) d.innerHTML = '<span class="qb-nm"></span><span class="qb-co"></span>'; d.firstChild.textContent = siteName(e.c); d.lastChild.textContent = e.q; d.classList.toggle('cc', ctlOn); } };
const sugs = (t) => { t = t.trim().toLowerCase(); if (!t) return []; const out = [], seen = new Set(); const add = (q, tag) => { if (coords(q)) return; const k = q.toLowerCase(); if (k === t) return; if (seen.has(k)) return; if (k.indexOf(t) < 0) return; seen.add(k); out.push({ q: q, tag: tag }); }; st.saved.forEach((s) => add(s.q, 'Favorite')); st.hist.forEach((h) => { if (h.k === 'search') add(h.q, 'History'); }); out.sort((a, b) => (b.q.toLowerCase().indexOf(t) === 0) - (a.q.toLowerCase().indexOf(t) === 0)); return out.slice(0, 6); };
const sugDraw = (show) => { const i = $('.qb-omni input'), b = $('#qbSug'), x = $('.qb-wipe'); if (!i) return; if (x) x.hidden = !i.value; if (!b) return; const rs = RS.q === i.value.trim().toLowerCase() ? RS.r : []; const r = show ? rs.concat(sugs(i.value)).slice(0, 8) : []; if (show) siteSug(i.value); if (!r.length) { b.hidden = true; b.innerHTML = ''; return; } b.innerHTML = r.map((s) => '<button class="qb-item" type="button" role="option" data-pick="' + esc(s.site ? s.site : s.q) + '"' + (s.id ? ' data-sid="' + esc(s.id) + '"' : '') + '><span>' + esc(s.q) + '</span><small>' + s.tag + '</small></button>').join(''); b.hidden = false; };
const wipe = () => { const i = $('.qb-omni input'), f = $('.qb-omni'), d = $('.qb-disp'); if (!i) return; const w0 = cur(); if (ent(w0).k !== 'universe') { if (qfull(w0)) { say(QMSG); return; } w0.tr = w0.tr.slice(0, w0.i + 1); w0.tr.push({ k: 'universe', q: '' }); if (w0.tr.length > 50) w0.tr.shift(); w0.i = w0.tr.length - 1; keep(); draw(); } if (f) f.classList.remove('show-disp'); if (d) d.hidden = true; i.value = ''; i.focus(); sugDraw(false); };
const pick = (e) => { const b = e.target.closest('[data-pick]'); if (!b) return; const i = $('.qb-omni input'); if (b.dataset.sid) bumpSite(b.dataset.sid); go(b.dataset.pick); if (i) i.blur(); sugDraw(false); };
const exp = (s) => { let n = 0; const r = s.replace(/(\d)\{(\d+)\}/g, (m, d, k) => { n += +k; return n > 2000 ? '' : d.repeat(+k); }); return n > 2000 ? null : r; };
const pack = (s) => s.replace(/(\d)\1{3,}/g, (m, d) => d + '{' + m.length + '}');
const bump = (a, d) => { const m = /^([+-]?)([0-9{}]+)(?:\.([0-9{}]+))?$/.exec(a.raw); if (!m) return null; const i = exp(m[2]), f = m[3] ? exp(m[3]) : ''; if (i === null) return null; if (f === null) return null; const sc = f.length; const v = BigInt((m[1] === '-' ? '-' : '') + i + f) + BigInt('1' + '0'.repeat(sc)) * BigInt(d); const neg = v < 0n; const s = (neg ? -v : v).toString().padStart(sc + 1, '0'); const ip = s.slice(0, s.length - sc), fp = s.slice(s.length - sc); return axis((neg ? '-' : '') + pack(ip) + (sc ? '.' + pack(fp) : '')); };
const AX = { left: ['X', -1], right: ['X', 1], up: ['Y', 1], down: ['Y', -1], zin: ['Z', 1], zout: ['Z', -1] };
let hrec = 0, rep = 0;
const place = (c) => { const w = cur(), e = { k: 'coord', q: ctext(c), c: c }; w.tr = w.tr.slice(0, w.i + 1); w.tr.push(e); if (w.tr.length > 50) w.tr.shift(); w.i = w.tr.length - 1; return e; };
const lite = () => { starDraw(); const w = cur(), h = $('#qbHost'); if (!h) return; const t = $('.qb-w[aria-selected="true"] span', h); if (t) t.textContent = title(w); const o = $('.qb-omni input', h); if (o && document.activeElement !== o) o.value = ''; dispDraw(); qStop(); document.querySelectorAll('[data-ro]').forEach((n) => { const c = ent(w).c; n.textContent = c ? c[n.dataset.ro].raw : '0'; }); };
const nudge = (k, amount) => { const a = AX[k]; if (!a) return false; { const pf = $('.qb-pfv'); if (pf) { pf.remove(); qTok++; } } const oi = $('.qb-omni input'); if (oi) { oi.value = ''; if (document.activeElement === oi) oi.blur(); sugDraw(false); } const w = cur(); let e = ent(w), fresh = false; if (e.k !== 'coord') { e = place({ X: axis('0'), Y: axis('0'), Z: axis('0') }); fresh = true; } const n = bump(e.c[a[0]], (amount || 1) * a[1]); if (!n) { say('That number is too large to nudge.'); return false; } e.c[a[0]] = n; e.q = ctext(e.c); if (e.q === QZ && !qfull(w)) { w.tr[w.i] = { k: 'universe', q: '' }; ctlOn = false; clearTimeout(ctlT); clearTimeout(hrec); keep(); draw(); document.querySelectorAll('[data-ro]').forEach((n) => { n.textContent = '0'; }); return true; } ctlOn = true; clearTimeout(ctlT); ctlT = setTimeout(() => { ctlOn = false; dispDraw(); }, 1000); clearTimeout(hrec); hrec = setTimeout(() => rec('search', e.q), 900); keep(); if (fresh) { const pv = $('.qb-pfv'); if (pv) pv.remove(); qTok++; noLoad = true; draw(); noLoad = false; } else { lite(); } return true; };
const zero = () => { if (title(cur()) !== 'Qasthra' && qfull(cur())) { say(QMSG); return; } place({ X: axis('0'), Y: axis('0'), Z: axis('0') }); rec('search', ent(cur()).q); keep(); draw(); };
const copy = () => { const e = ent(cur()); if (e.k !== 'coord') { say('No coordinates to copy yet.'); return; } if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(e.q).then(() => say('Coordinates copied.'), () => say('Could not copy.')); else say('Copy is not supported here.'); };
const speed = (t0) => { const d = window.QPUSH == null ? 0 : window.QPUSH, s = window.QHOLD ? window.QHOLD : t0 ? t0 : Date.now(), h = Math.min(1, (Date.now() - s) / 2500); return Math.min(1, d * 0.75 + h * 0.25); }; window.QSPEED = speed; const stop = () => { clearTimeout(rep); rep = 0; };
const press = (e) => { if (e.button > 0) return; const b = e.target.closest('[data-n]'); if (!b) return; e.preventDefault(); stop(); const k = b.dataset.n; if (!nudge(k, 1)) return; const t0 = Date.now(); const step = () => { const sp = speed(t0); rep = setTimeout(() => { if (!nudge(k, 1)) { stop(); return; } step(); }, Math.max(40, Math.round(1000 / (3 + 22 * sp * sp)))); }; step(); };
const tap = (e) => { const b = e.target.closest('[data-n]'); if (b && e.detail === 0) nudge(b.dataset.n); };
const rec = (k, q) => { if (!q || k === 'world') return; st.hist.unshift({ id: uid(), k: k, q: q, at: Date.now() }); st.hist.length = Math.min(st.hist.length, 200); sv('hist', st.hist); push(); };
const go = (q) => { q = clean(q, 200).trim(); if (!q) return; if (!okGo()) return; { const pf = $('.qb-pfv'); if (pf && q.charAt(0) !== '@') { pf.remove(); qTok++; } } if (/^qasthra$/i.test(q)) q = QZ; const c = coords(q); if (!c && /^[xyz]\s*=/i.test(q)) { say('Use X=1028, Y=-92810, Z=1029.202. A repeat looks like 1{10}.'); return; } const w = cur(), e = c ? { k: 'coord', q: ctext(c), c: c } : { k: 'search', q: q.slice(0, 200) }; if (c && ctext(c) === QZ && title(w) !== 'Qasthra' && qfull(w)) { say(QMSG); return; } w.tr = w.tr.slice(0, w.i + 1); w.tr.push(e); if (w.tr.length > 50) w.tr.shift(); w.i = w.tr.length - 1; rec('search', e.q); keep(); draw(); };
window.addEventListener('pagehide', () => { try { sv('worlds', st.worlds.map((w) => ({ id: w.id, tr: [w.tr[w.i]], i: 0 }))); } catch (e) {} }); const hop = (d) => { const w = cur(); let n = w.i + d; if (qfull(w)) while (n >= 0 && n < w.tr.length && w.tr[n].k === 'universe') n += d; if (n < 0 || n >= w.tr.length) return; w.i = n; keep(); draw(); };
const swap = (d) => { const n = st.worlds.indexOf(cur()) + d; if (n < 0 || n >= st.worlds.length) return; st.active = st.worlds[n].id; keep(); draw(); };
const add = () => { if (qfull(null)) { say(QMSG); return false; } const w = nw(); st.worlds.push(w); st.active = w.id; st.panel = ''; keep(); draw(); const o = $('.qb-omni input'); if (o) o.focus(); };
const shut = (id) => { const i = st.worlds.findIndex((w) => w.id === id); if (i < 0) return; const w = st.worlds[i]; if (window.QSET && window.QSET.get('confirm') === '1' && ent(w).k !== 'universe' && !confirm('Close this World?')) return; const firstQ = st.worlds.findIndex((x) => title(x) === 'Qasthra'); if (title(w) === 'Qasthra' && i === firstQ) { say('The leftmost Qasthra tab cannot be closed.'); return; } if (ent(w).k !== 'universe') rec('world', ent(w).q || title(w)); st.worlds.splice(i, 1); if (!st.worlds.length) st.worlds.push(nw()); if (st.active === id || !cur()) st.active = st.worlds[Math.max(0, i - 1)].id; keep(); draw(); };
const flip = () => { st.priv = !st.priv; sv('acstatus', st.priv ? 'Encrypted' : 'Decrypted'); st.panel = ''; draw(); };
const saveCur = () => { const w = cur(), e = ent(w); if (e.k === 'universe') { say('Open a search or coordinate first.'); return; } if (st.saved.some((s) => s.q === e.q)) { say('Already in Favorites.'); return; } st.saved.unshift({ id: uid(), title: title(w), q: e.q, tier: 'Core', at: Date.now() }); sv('saved', st.saved); push(); say('Added to Favorites.'); starDraw(); if (st.panel === 'saved') pop(); };
const starOf = (x) => { const e = ent(x); return e.k === 'universe' ? null : st.saved.find((s) => s.q === e.q) || null; };
const starBtn = (x) => { if (ent(x).k === 'universe') return ''; const f = starOf(x); return '<button class="qb-star" type="button" data-fav="' + esc(x.id) + '" aria-pressed="' + (!!f) + '" aria-label="' + (f ? 'Remove from Favorites' : 'Add to Favorites') + '" title="' + (f ? 'Favorited. Long-press for Favorites' : 'Favorite. Long-press for Favorites') + '"' + '>' + I.star + '</button>'; };
const starDraw = () => { document.querySelectorAll('.qb-star').forEach((b) => { const x = st.worlds.find((y) => y.id === b.dataset.fav); if (!x) return; const f = starOf(x); b.setAttribute('aria-pressed', String(!!f)); b.setAttribute('aria-label', f ? 'Remove from Favorites' : 'Add to Favorites'); b.setAttribute('title', f ? 'Favorited. Long-press for Favorites' : 'Favorite. Long-press for Favorites'); }); };
const toggleFav = (id) => { const w = st.worlds.find((x) => x.id === id); if (!w) return; const e = ent(w); if (e.k === 'universe') return; const f = starOf(w); if (f) { st.saved = st.saved.filter((s) => s.id !== f.id); sv('saved', st.saved); drop('worlds_saved', 'id', f.id); } else { st.saved.unshift({ id: uid(), title: title(w), q: e.q, tier: 'Core', at: Date.now() }); sv('saved', st.saved); push(); const b = document.querySelector('.qb-star[data-fav="' + id + '"]'); if (b) { b.classList.remove('qb-bump'); void b.offsetWidth; b.classList.add('qb-bump'); } } starDraw(); if (st.panel === 'saved') pop(); };
const clearHist = async () => { st.hist = []; sv('hist', []); const u = await who(); if (u) drop('worlds_history', 'user_id', u); say('History cleared.'); pop(); };
const wipeLocal = () => { ['hist', 'saved', 'worlds', 'outbox'].forEach((k) => { try { localStorage.removeItem('qb:' + k); } catch (e) {} }); try { clearTimeout(kt); clearTimeout(hrec); } catch (e) {} st.hist = []; st.saved = []; st.xfer = []; st.panel = ''; ob.length = 0; st.worlds = [nw()]; st.active = st.worlds[0].id; }; const ownChk = async () => { const u = await who(); if (!u) return; let o = null; try { o = localStorage.getItem('qs:owner'); } catch (e) {} if (o && o !== u) { wipeLocal(); try { draw(); } catch (e) {} } try { localStorage.setItem('qs:owner', u); } catch (e) {} }; (function w() { if (window.db && window.db.auth) { window.db.auth.onAuthStateChange((e) => { if (e === 'SIGNED_IN' || e === 'INITIAL_SESSION') setTimeout(ownChk, 0); }); } else setTimeout(w, 400); })(); const signout = async () => { if (window.QAUTH && window.QAUTH.signOut) await window.QAUTH.signOut(); wipeLocal(); try { localStorage.removeItem('qs:owner'); } catch (e) {} try { if (window.CAP) window.CAP.fresh(); } catch (e) {} };
let qTok = 0, qSeen = '', noLoad = false; const qStop = () => { qTok++; const ov = $('.qb-ov'); if (ov && ov.querySelector('.qb-world-loader')) ov.innerHTML = ''; }; const pOpen = (e) => { const o = $('.qb-ov'); if (!o) return; const tok = ++qTok, nm = e.q.slice(1).toLowerCase(); qSeen = ''; window.QST = null; const pv = window.QCARD ? window.QCARD.open(o, 1) : (o.innerHTML = '<div class="qb-pfv"></div>', o.firstChild); const back = () => { if (tok !== qTok) return; const w = cur(); if (!w) return; if (ent(w) !== e) return; if (!qfull(w)) { w.tr[w.i] = { k: 'universe', q: '' }; keep(); draw(); } else { const p = w.i; hop(-1); if (w.i === p) { const x = st.worlds.indexOf(w); st.worlds.splice(x, 1); st.active = st.worlds[Math.max(0, x - 1)].id; keep(); draw(); } } }; if (!/^[a-z][a-z0-9_-]{4,24}$/.test(nm)) { back(); return; } if (!window.QPROF) { back(); return; } window.QPROF.mount(pv, nm, back); const xb = document.createElement('button'); xb.type = 'button'; xb.className = 'qs-pf-x'; xb.style.zIndex = '5'; xb.setAttribute('aria-label', 'Close profile'); xb.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'; xb.onclick = () => { const t = qTok; back(); if (t === qTok) { const pf = $('.qb-pfv'); if (pf) pf.remove(); } }; pv.appendChild(xb); }; const qOpen = (e) => { if (e.k === 'search' && e.q.charAt(0) === '@') { pOpen(e); return; } const o = $('.qb-ov'); if (!o) return; const tok = ++qTok, t0 = Date.now(), LOAD = 2500, MAXQ = 5000, k0 = e.k === 'coord' ? ctext(e.c) : ''; qSeen = k0; window.QST = null; window.QCARD.open(o); const live = () => tok === qTok && cur() && ent(cur()) === e && (e.k !== 'coord' || ctext(e.c) === k0) && $('.qb-ov'); const done = (res) => { setTimeout(() => { const ov = live(); if (!ov) return; if (res && res.text) { if (e.k === 'search') { e.k = 'coord'; e.c = res.c; e.q = ctext(res.c); } if (res.name) SITES[res.k] = res.name; qSeen = res.k; window.QST = { coord: res.k, text: res.text }; window.QCARD.show(ov, res.text); const t = $('.qb-w[aria-selected="true"] span'), i = $('.qb-omni input'); if (t) t.textContent = title(cur()); if (i && document.activeElement !== i) i.value = ''; dispDraw(); keep(); return; } const bar = $('.qb-omni input'); if (res && !res.text) { if (e.k === 'search') { e.k = 'coord'; e.c = res.c; e.q = ctext(res.c); } if (res.name) SITES[res.k] = res.name; qSeen = res.k; window.QST = null; window.QCARD.show(ov, ''); const t2 = $('.qb-w[aria-selected="true"] span'); if (t2) t2.textContent = title(cur()); if (bar) bar.value = ''; dispDraw(); keep(); return; } if (k0 === QZ) { const w1 = cur(); w1.tr[w1.i] = { k: 'universe', q: '' }; keep(); draw(); return; } if (window.QCARD) { window.QCARD.err(ov); return; } const w = cur(); if (!qfull(w)) { w.tr[w.i] = { k: 'universe', q: '' }; keep(); draw(); } else { const p = w.i; hop(-1); if (w.i === p) { const x = st.worlds.indexOf(w); st.worlds.splice(x, 1); st.active = st.worlds[Math.max(0, x - 1)].id; keep(); draw(); } } }, Math.max(0, LOAD - (Date.now() - t0))); }; const job = async () => { let c = e.c; if (e.k === 'search') { const r = await siteFind(e.q, 5), t = e.q.trim().toLowerCase(), s = r.find((x) => String(x.name).toLowerCase() === t) || r[0]; if (!s) return null; c = coords(s.coord); if (!c) return null; bumpSite(s.id); } const k = ctext(c), r2 = await fnCall({ op: 'coord', coord: k, full: true }).then((j) => ({ data: j ? j.r : null, error: j ? null : 1 })); if (r2.error || !r2.data) return null; return { c: c, k: k, name: r2.data.name || '', text: typeof r2.data.qst === 'string' ? r2.data.qst.trim().slice(0, MAXQ) : '' }; }; if (!window.db) { done(null); return; } Promise.race([job().catch(() => null), new Promise((r) => setTimeout(() => r(null), LOAD))]).then(done); };
const view = (w) => { const v = $('.qa-view'); if (!v) return; let s = $('.qb-stage', v); if (!s) { v.innerHTML = '<div class="qb-stage"><div class="qb-ov"></div></div>'; s = $('.qb-stage', v); } if (noLoad) { qStop(); return; } const e = ent(w); if (e.k === 'universe') { qTok++; qSeen = ''; window.QST = null; $('.qb-ov', s).innerHTML = ''; return; } qOpen(e); };
const nb = (k, l, ico, cls) => '<button class="qb-ic qb-nb' + (cls ? ' ' + cls : '') + '" type="button" data-n="' + k + '" aria-label="' + l + '" title="' + l + '">' + ico + '</button>';
I.prev = ic('<path d="M19 12H6M11 6l-6 6 6 6"/>'); I.next = ic('<path d="M5 12h13M13 6l6 6-6 6"/>');
const PANELS = {
};
const qbDay = (t) => { const d = new Date(t), n = new Date(), f = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(), k = Math.round((f(n) - f(d)) / 864e5); return k <= 0 ? 'Today' : k === 1 ? 'Yesterday' : d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }); }; const qbClk = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); const qbSheet = (t, n, act, bar, body) => '<div class="qb-bd" data-a="shutp"></div><div class="qb-sheet" role="dialog" aria-modal="true" aria-label="' + t + '"><header class="qb-sh-h"><h3 class="qb-sh-t">' + t + '</h3>' + (n === '' ? '' : '<span class="qb-sh-n">' + n + '</span>') + '<span class="qb-sh-a">' + act + '</span><button class="qb-sh-x" type="button" data-a="shutp" aria-label="Close">' + I.x + '</button></header>' + bar + '<div class="qb-sh-b">' + body + '</div></div>'; const qbXb = (a, v, l) => '<button class="qb-ix" type="button" data-' + a + '="' + v + '" aria-label="' + l + '">' + I.x + '</button>'; const QSHEETS = { history: () => { const r = st.hist.filter((h) => h.k === 'search'); let last = '', out = ''; r.forEach((h) => { const g = qbDay(h.at); if (g !== last) { last = g; out += '<p class="qb-cap">' + g + '</p>'; } out += '<div class="qb-item"><span class="qb-ii">' + I.clock + '</span><button class="qb-grow" type="button" data-run="' + esc(h.q) + '"><span>' + esc(lbl(h.q)) + '</span></button><small>' + qbClk(h.at) + '</small>' + qbXb('hx', esc(h.id), 'Remove') + '</div>'; }); return qbSheet('History', r.length, '', '', r.length ? '<div class="qb-list">' + out + '</div>' : ''); }, saved: () => { const out = TIERS.map((t) => { const r = st.saved.filter((s) => s.tier === t); return r.length ? '<p class="qb-cap">' + t + '</p><div class="qb-list">' + r.map((s) => '<div class="qb-item"><span class="qb-ii">' + I.star + '</span><button class="qb-grow" type="button" data-run="' + esc(s.q) + '"><span>' + esc(s.title) + '</span></button><button class="qb-chip" type="button" data-tier="' + esc(s.id) + '" title="Change tier">' + t + '</button>' + qbXb('del', esc(s.id), 'Remove') + '</div>').join('') + '</div>' : ''; }).join(''); return qbSheet('Favorites', st.saved.length, '', '', out); }, xfer: () => qbSheet('Transfers', st.xfer.length, '', '', '') }; const pop = () => { document.querySelectorAll('.qb-set [data-p]').forEach((b) => { b.setAttribute('aria-pressed', String(st.panel === b.dataset.p)); }); syncDraw(); const p = $('.qb-pop'); if (!p) return; const sh = !!QSHEETS[st.panel]; clearTimeout(p._t); if (!st.panel) { if (p.hidden) return; if (!p.classList.contains('sheet')) { p.hidden = true; return; } p.classList.add('out'); p._t = setTimeout(() => { p.hidden = true; p.classList.remove('out'); p.innerHTML = ''; p.dataset.m = ''; }, 190); return; } const was = sh && !p.hidden && p.dataset.m === st.panel && !p.classList.contains('out'), sb = was ? p.querySelector('.qb-sh-b') : null, y = sb ? sb.scrollTop : 0; p.hidden = false; p.dataset.m = st.panel; p.className = 'qb-pop' + (sh ? ' sheet' : '') + (was ? ' still' : ''); p.innerHTML = sh ? QSHEETS[st.panel]() : PANELS[st.panel](); if (y) { const nb = p.querySelector('.qb-sh-b'); if (nb) nb.scrollTop = y; } if (sh && !was) { const xb = p.querySelector('.qb-sh-x'); if (xb) xb.focus({ preventScroll: true }); } if (!window.QBEsc) { window.QBEsc = 1; document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && QSHEETS[st.panel]) { st.panel = ''; pop(); } }); } };
const draw = () => { if (dg) { clearTimeout(dg.t); dg = null; } const h = $('#qbHost'); if (!h) return; const w = cur(), i = st.worlds.indexOf(w), strip = $('.qb-strip', h), firstQ = st.worlds.findIndex((x) => title(x) === 'Qasthra'); strip.innerHTML = st.worlds.map((x, n) => '<div class="qb-w" role="tab" tabindex="0" data-w="' + esc(x.id) + '" aria-selected="' + (x.id === w.id) + '"><img class="qb-fav" src="' + esc(favOf(x)) + '" alt="" width="16" height="16"><span>' + esc(title(x)) + '</span>' + starBtn(x) + (title(x) === 'Qasthra' && n === firstQ ? '' : '<button class="qb-x" type="button" data-x="' + esc(x.id) + '" aria-label="Close World">' + I.x + '</button>') + '</div>').join(''); strip.querySelectorAll('.qb-fav').forEach(favBind); const ab = $('.qb-worlds > [data-a="add"]', h); if (ab) ab.hidden = st.worlds.some((x) => title(x) === 'Qasthra'); const a = $('[aria-selected="true"]', strip); if (a && a.scrollIntoView) a.scrollIntoView({ inline: 'nearest', block: 'nearest' }); const all = (s) => Array.from(h.querySelectorAll(s)); all('[data-a="back"]').forEach((b) => { b.disabled = w.i < 1; }); all('[data-a="fwd"]').forEach((b) => { b.disabled = w.i >= w.tr.length - 1; }); all('[data-a="wprev"]').forEach((b) => { b.disabled = i < 1; }); all('[data-a="wnext"]').forEach((b) => { b.disabled = i >= st.worlds.length - 1; }); all('.qb-count b').forEach((b) => { b.textContent = st.worlds.length; }); all('[data-a="priv"]').forEach((b) => { b.setAttribute('aria-pressed', String(st.priv)); b.setAttribute('title', st.priv ? 'Encrypted, tap to decrypt' : 'Decrypted, tap to encrypt'); const s = b.querySelector('svg'); if (s) s.outerHTML = st.priv ? I.lock : I.unlock; }); $('.qb-omni input', h).value = ent(w).k === 'search' ? ent(w).q : ''; sugDraw(false); dispDraw(); view(w); pop(); };
const bt = (attr, label, icon, cls) => '<button class="qb-ic' + (cls ? ' ' + cls : '') + '" type="button" ' + attr + ' aria-label="' + label + '" title="' + label + '">' + icon + '</button>';
const SET = '<div class="qb-set" role="toolbar" aria-label="Quick settings">' + bt('data-p="history"', 'History', I.clock) + bt('data-p="xfer"', 'Transfers', I.xfer) + bt('data-p="saved"', 'Favorites', I.star) + bt('data-sw="sync"', 'Sync off, tap to Sync', ic('<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"/>'), 'qb-sync') + '<button class="qb-ic qb-th" type="button" data-theme-btn aria-label="Switch theme" title="Switch theme"><span class="t-d">' + ic('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>') + '</span><span class="t-l">' + ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>') + '</span></button></div>';
const KIRBY = '<' + '!-- SPIRIT (soon): the Kirby strip is where a talker will live, an AI model or a human model, as a support system while browsing. For now it only holds the 3D control. --' + '>' + '<div class="qb-kirby" aria-label="Spirit and 3D control"><svg class="qb-kb" viewBox="0 0 88 86" preserveAspectRatio="none" aria-hidden="true"><path class="qb-kf" d="M88 86H44A43 43 0 0 1 44 0H88Z"/><path class="qb-ks" d="M44 .5A42.5 42.5 0 0 0 1.6 38"/><path class="qb-ks" d="M0 85.5H88"/></svg><div class="qb-orb" id="qbOrbK" role="button" tabindex="0" aria-label="3D control" aria-expanded="false"><canvas id="qbBallK" width="128" height="128"></canvas><span class="qb-jx" hidden>' + nb('left', 'Left, X minus', I.left) + nb('right', 'Right, X plus', I.right) + nb('up', 'Up, Y plus', I.up) + nb('down', 'Down, Y minus', I.down) + nb('zin', 'Z plus, depth in', I.plus) + nb('zout', 'Z minus, depth out', I.minus) + '</span></div></div>';
const BAR = '<div class="qb"><div class="qb-col"><div class="qb-row qb-worlds"><div class="qb-strip" role="tablist" aria-label="Worlds"></div>' + bt('data-a="add"', 'New World', I.plus) + '</div><div class="qb-row qb-tool">' + '<div class="qb-nav qb-dk">' + bt('data-a="back"', 'Back', I.prev) + bt('data-a="priv"', 'Decrypted, tap to encrypt', I.unlock) + bt('data-a="fwd"', 'Next', I.next) + '</div><form class="qb-omni" autocomplete="off"><span class="qb-ic qb-mag" aria-hidden="true">' + I.search + '</span><button class="qb-disp" type="button" hidden aria-label="Edit search"></button><input type="text" maxlength="400" enterkeyhint="go" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Search" placeholder="Search">' + bt('data-a="wipe" hidden', 'Clear search', I.x, 'qb-wipe') + bt('data-a="reload"', 'Reload', I.reload) + '<div class="qb-sug" id="qbSug" role="listbox" hidden></div></form>' + SET + bt('data-p="set"', 'Settings', I.gear, 'qb-gear-m') + '</div></div>' + KIRBY + '<div class="qb-dock" role="toolbar" aria-label="Browser">' + bt('data-a="back"', 'Back', I.prev, 'qb-bk') + '<div class="qb-orb" id="qbOrb" role="button" tabindex="0" aria-label="3D control" aria-expanded="false"><canvas id="qbBall" width="224" height="224"></canvas><svg class="qb-arc" viewBox="-50 -50 100 56" aria-hidden="true"><path class="qb-ae" pathLength="100" d="M-36.66 16A40 40 0 1 1 36.66 16"/><path class="qb-at" pathLength="100" d="M-36.66 16A40 40 0 1 1 36.66 16"/><path class="qb-ag" pathLength="100" d="M-36.66 16A40 40 0 1 1 36.66 16"/><path class="qb-af" pathLength="100" d="M-36.66 16A40 40 0 1 1 36.66 16"/></svg>' + nb('zin', 'Z plus, depth in', I.plus, 'qb-zb qb-zu') + nb('zout', 'Z minus, depth out', I.minus, 'qb-zb qb-zd') + '<span class="qb-jx" hidden>' + nb('left', 'Left, X minus', I.left) + nb('right', 'Right, X plus', I.right) + nb('up', 'Up, Y plus', I.up) + nb('down', 'Down, Y minus', I.down) + '</span></div>' + bt('data-a="fwd"', 'Next', I.next, 'qb-fw') + '</div><div class="qb-pop" hidden></div><input type="file" id="qbFile" multiple hidden></div>';
const reloadWorld = () => { const w = cur(); if (!w) return; st.panel = ''; const e = ent(w); if (e.k === 'coord') { window.QST = null; view(w); } else if (e.k === 'search') { view(w); } else { draw(); } };
const click = (e) => { const t = e.target.closest('[data-a],[data-p],[data-w],[data-x],[data-run],[data-reopen],[data-tier],[data-del],[data-hx],[data-tab],[data-sw],[data-fav]'); if (!t) return; const d = t.dataset; if (d.fav) { if (lp) { lp = false; return; } toggleFav(d.fav); return; } if (d.x) { shut(d.x); return; } if (d.w) { st.active = d.w; st.panel = ''; keep(); draw(); return; } if (d.p === 'set') { st.panel = ''; pop(); if (window.QSET) window.QSET.open(); return; } if (d.p) { st.panel = st.panel === d.p ? '' : d.p; pop(); return; } if (d.run !== undefined) { st.panel = ''; go(d.run); pop(); return; } if (d.reopen !== undefined) { if (add() === false) return; go(d.reopen); return; } if (d.hx) { st.hist = st.hist.filter((h) => h.id !== d.hx); sv('hist', st.hist); drop('worlds_history', 'id', d.hx); pop(); return; } if (d.tier) { const s = st.saved.find((x) => x.id === d.tier); if (s) { s.tier = TIERS[(TIERS.indexOf(s.tier) + 1) % TIERS.length]; sv('saved', st.saved); push(); pop(); } return; } if (d.del) { st.saved = st.saved.filter((x) => x.id !== d.del); sv('saved', st.saved); drop('worlds_saved', 'id', d.del); pop(); starDraw(); return; } if (d.sw) { toggleSync(); return; } const f = { add: add, priv: flip, back: () => hop(-1), fwd: () => hop(1), wprev: () => swap(-1), wnext: () => swap(1), wipe: wipe, reload: reloadWorld, save: saveCur, upload: () => { const i = $('#qbFile'); if (i) i.click(); }, clear: clearHist, signout: signout, shutp: () => { st.panel = ''; pop(); } }[d.a]; if (f) f(); };
const KN = { a: 'left', d: 'right', w: 'up', s: 'down', q: 'zout', e: 'zin' };
const KP = { h: 'history', u: 'xfer', ',': 'set' };
let kdown = '';
const hold = (k) => { stop(); if (!nudge(k, 1)) return; const t0 = Date.now(); const step = () => { const sp = speed(t0); rep = setTimeout(() => { if (!nudge(k, 1)) { stop(); return; } step(); }, Math.max(40, Math.round(1000 / (3 + 22 * sp * sp)))); }; step(); };
const kbd = (e) => { if (e.ctrlKey || e.metaKey) { if (e.ctrlKey && e.key.toLowerCase() === 'k') { e.preventDefault(); const i = $('.qb-omni input'); if (i) i.focus(); } return; } const t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return; const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (KN[k]) { e.preventDefault(); if (!e.repeat) { kdown = k; hold(KN[k]); } return; } if (KP[k]) { e.preventDefault(); if (KP[k] === 'set') { if (window.QSET) window.QSET.open(); return; } st.panel = st.panel === KP[k] ? '' : KP[k]; pop(); return; } const m = { '0': zero, '[': () => hop(-1), ']': () => hop(1), '<': () => swap(-1), '>': () => swap(1), t: add, x: () => shut(cur().id), r: reloadWorld, p: flip, f: saveCur, c: copy, y: toggleSync, m: () => { const b = $('[data-theme-btn]'); if (b) b.click(); }, '/': () => { const i = $('.qb-omni input'); if (i) i.focus(); } }[k]; if (m) { e.preventDefault(); if (!e.repeat) m(); } };
document.addEventListener('keyup', (e) => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (k === kdown) { kdown = ''; stop(); } });
let dg = null, lp = false, lpT = 0, lpX = 0, lpY = 0, sup = false, settling = false;
const GAP = 2;
const vib = (n) => { try { if (navigator.vibrate && !(window.QSET && window.QSET.get('haptics') === '0')) navigator.vibrate(n); } catch (x) {} };
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
const wire = () => { if (wired) return; wired = true; ['pointerup', 'pointercancel', 'blur'].forEach((n) => window.addEventListener(n, stop)); document.addEventListener('click', (e) => { if (st.panel && !e.target.closest('.qb')) { st.panel = ''; pop(); } }, true); document.addEventListener('keydown', (e) => { if (document.documentElement.classList.contains('qs-open')) return; const q = $('.qb'); if (!q || q.offsetParent === null) return; if (e.key === 'Escape' && st.panel) { st.panel = ''; pop(); return; } if (!e.altKey) { kbd(e); return; } const sh = e.shiftKey; const m = { ArrowLeft: () => (sh ? hop(-1) : nudge('left')), ArrowRight: () => (sh ? hop(1) : nudge('right')), ArrowUp: () => (sh ? swap(-1) : nudge('up')), ArrowDown: () => (sh ? swap(1) : nudge('down')), PageUp: () => nudge('zin'), PageDown: () => nudge('zout') }[e.key]; if (m) { e.preventDefault(); m(); } }); };
let boot = true;
const mount = () => { const h = $('#qbHost'); if (!h) return; if (boot) { boot = false; if (!st.worlds.some((w) => ent(w).k === 'universe')) st.worlds.unshift(nw()); st.active = st.worlds.find((w) => ent(w).k === 'universe').id; } h.innerHTML = BAR; st.panel = ''; const root = h.closest('.qa') || h; root.addEventListener('click', click); root.addEventListener('pointerdown', press); root.addEventListener('click', tap); root.addEventListener('click', pick); root.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-n]')) e.preventDefault(); }); root.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.qb-w')) { e.preventDefault(); e.target.click(); } }); $('.qb-omni', h).addEventListener('submit', (e) => { e.preventDefault(); go($('input', e.target).value); $('input', e.target).blur(); sugDraw(false); }); const oi = $('.qb-omni input', h); oi.addEventListener('focus', (e) => { if (ctlOn) { e.target.blur(); return; } const e0 = ent(cur()); if (e0.k === 'coord') e.target.value = e0.q; e.target.select(); sugDraw(false); dispDraw(); }); oi.addEventListener('input', () => { if (ctlOn) { oi.value = ''; oi.blur(); sugDraw(false); dispDraw(); return; } sugDraw(true); }); oi.addEventListener('paste', (e) => { const d = e.clipboardData; if (!d) return; e.preventDefault(); const t = clean(d.getData('text'), 400), a = oi.selectionStart, z = oi.selectionEnd, room = 400 - (oi.value.length - (z - a)); if (room > 0) { oi.setRangeText(t.slice(0, room), a, z, 'end'); oi.dispatchEvent(new Event('input', { bubbles: true })); } }); oi.addEventListener('blur', () => { sugDraw(false); dispDraw(); }); oi.addEventListener('keydown', (e) => { if (e.key === 'Escape') oi.blur(); }); $('#qbSug', h).addEventListener('pointerdown', (e) => e.preventDefault()); $('.qb-disp', h).addEventListener('click', () => { const f = $('.qb-omni', h), d = $('.qb-disp', h); if (f) f.classList.remove('show-disp'); if (d) d.hidden = true; oi.focus(); }); ['.qb-wipe', '.qb-mag'].forEach((s) => $(s, h).addEventListener('pointerdown', (e) => e.preventDefault())); $('#qbFile', h).addEventListener('change', (e) => { Array.from(e.target.files || []).forEach((f) => st.xfer.unshift({ name: f.name, size: f.size })); e.target.value = ''; pop(); }); wire(); draw(); };
window.QNUDGE = { hold: hold, stop: stop }; window.QBAPI = { count: () => ({ worlds: st.worlds.length, hist: st.hist.length, favs: st.saved.length, xfer: st.xfer.length }), clearHist: clearHist, clearFavs: () => { const ids = st.saved.map((s) => s.id); st.saved = []; sv('saved', st.saved); ids.forEach((i) => drop('worlds_saved', 'id', i)); starDraw(); }, syncOn: () => st.sync, toggleSync: toggleSync, enc: () => st.priv, setEnc: (v) => { if (st.priv !== !!v) flip(); }, signout: signout, panel: (p) => { st.panel = p; pop(); }, importData: async (x) => { st.saved.splice(0, st.saved.length, ...x.favorites); st.hist.splice(0, st.hist.length, ...x.history.filter((h) => h.k !== 'world').slice(0, 200)); st.hist.sort((p, q) => q.at - p.at); sv('saved', st.saved); sv('hist', st.hist); try { ob.length = 0; sv('outbox', ob); } catch (e) {} try { pop(); } catch (e) {} if (!st.sync || !window.db) return true; const u = await who(); if (!u) return true; try { const a = await window.db.from('worlds_saved').delete().eq('user_id', u); if (a.error) return false; const b = await window.db.from('worlds_history').delete().eq('user_id', u); if (b.error) return false; if (st.saved.length) { const r = await window.db.from('worlds_saved').upsert(st.saved.map((s) => ({ id: s.id, user_id: u, title: s.title, q: s.q, tier: s.tier, at: s.at })), { onConflict: 'id' }); if (r.error) return false; } if (st.hist.length) { const r = await window.db.from('worlds_history').upsert(st.hist.map((h) => ({ id: h.id, user_id: u, kind: h.k, q: h.q, at: h.at })), { onConflict: 'id' }); if (r.error) return false; } return true; } catch (e) { return false; } }, exportData: () => ({ favorites: st.saved, history: st.hist, worlds: st.worlds.map((w) => ({ tabs: w.tr.map((e) => e.q).filter(Boolean) })) }) }; const base = Q.dashboard;
Q.dashboard = () => { base(); mount(); if (st.sync) pull().then(push); };
if (window.screen && window.screen.current === 'dashboard' && !$('#qbHost')) setTimeout(() => Q.dashboard(), 0);
})();
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
let g = 0, rx = 0, ry = 0, spin = 0, tt = 0, kx = 0, ky = 0, last = performance.now();
const loop = (now) => {
if (!document.body.contains(cv)) { r.dispose(); return; }
requestAnimationFrame(loop); if (document.hidden || document.getElementById('qload') || now - last < 30) return;
if (!cv.offsetParent) { last = now; return; } const HC = document.documentElement.classList; if (HC.contains('qs-open') ? true : HC.contains('pop-open')) { last = now; return; } if (!S.act && now - last < 66) return; const dt = Math.min(0.1, (now - last) / 1000), d = dark(); last = now;
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
const S = { act: 0, tx: 0, ty: 0, kx: 0, ky: 0 }; let it = 0, pid = -1, held = false, drag = false, dir = '', zone = 'xy', sx = 0, sy = 0, mv = 0;
const bootBall = () => { if (document.getElementById('qload') || !cv.offsetParent) { setTimeout(bootBall, 400); return; } lib(() => ball(cv, S)); }; bootBall();
const poke = () => { clearTimeout(it); it = setTimeout(rest, IDLE); };
const rest = () => { if (held) { poke(); return; } orb.classList.remove('on'); orb.setAttribute('aria-expanded', 'false'); S.act = 0; S.kx = 0; S.ky = 0; S.tx = 0; S.ty = 0; };
const af = orb.querySelector('.qb-af'); let raf = 0, sp = 0; const tick = () => { const t = dir ? (window.QSPEED ? window.QSPEED() : 0) : 0; sp += (t - sp) * 0.25; if (af) af.style.strokeDashoffset = String(100 - sp * 100); if (drag ? true : sp > 0.01) raf = requestAnimationFrame(tick); else raf = 0; }; const open = () => { orb.classList.add('on'); orb.setAttribute('aria-expanded', 'true'); S.act = 1; if (!raf) raf = requestAnimationFrame(tick); poke(); };
const on = () => orb.classList.contains('on');
const send = (k) => { if (k === dir) return; dir = k; if (window.QNUDGE) { if (k) window.QNUDGE.hold(k); else window.QNUDGE.stop(); } };
const move = (e) => {
const b = orb.getBoundingClientRect(), R = 70, V = Math.max(24, b.width * 0.3);
let dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2); const m = Math.hypot(dx, dy);
if (m > R) { dx = dx / m * R; dy = dy / m * R; }
mv = Math.max(mv, Math.hypot(e.clientX - sx, e.clientY - sy));
window.QPUSH = Math.max(0, Math.min(1, (m - R * 0.12) / (R * 0.88))); const mc = Math.hypot(dx, dy) || 1, f = Math.min(1, mc / V); S.kx = dx / mc * f; S.ky = dy / mc * f; S.tx = S.ky * 0.45; S.ty = S.kx * 0.6;
 send(zone === 'z' ? (sx < b.left + b.width / 2 ? 'zout' : 'zin') : (m < R * 0.12 || mv < 8 ? '' : Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'))); poke();
};
const end = () => { if (!drag) return; drag = false; send('');  window.QPUSH = null; window.QHOLD = null; S.kx = 0; S.ky = 0; S.tx = 0; S.ty = 0; held = false; rest(); };
orb.addEventListener('pointerdown', (e) => {
if (e.button > 0) return;
if (e.target.closest('[data-n]')) { held = true; poke(); return; }
sx = e.clientX; sy = e.clientY; mv = 0; const b = orb.getBoundingClientRect(); zone = Math.abs(sx - (b.left + b.width / 2)) > b.width * 0.22 ? 'z' : 'xy';
if (!on()) open(); window.QHOLD = Date.now();
drag = true; held = true; pid = e.pointerId; try { orb.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); move(e);
});
window.addEventListener('pointermove', (e) => { if (drag && e.pointerId === pid) move(e); }); window.addEventListener('pointerup', (e) => { if (drag && e.pointerId === pid) end(); }, true); window.addEventListener('pointercancel', (e) => { if (drag && e.pointerId === pid) end(); }, true); window.addEventListener('blur', () => { if (drag) end(); });
orb.addEventListener('pointerup', (e) => { if (e.target.closest('[data-n]')) return; end(); });
orb.addEventListener('pointercancel', () => { mv = 99; end(); }); orb.addEventListener('contextmenu', (e) => e.preventDefault());
orb.addEventListener('keydown', (e) => { if (e.key !== 'Enter' && e.key !== ' ') return; e.preventDefault(); if (on()) { held = false; rest(); } else open(); });
window.addEventListener('pointerup', (e) => { if (!e.isTrusted) return; if (!on()) return; held = false; poke(); });
};
const prev = Q.dashboard; Q.dashboard = () => { prev(); init('qbOrb', 'qbBall'); init('qbOrbK', 'qbBallK'); }; if ($('#qbOrb')) { init('qbOrb', 'qbBall'); init('qbOrbK', 'qbBallK'); }
})();

(() => {
  const isDash = () => /^#dashboard/.test(location.hash);
  const S = ['Sources/Musics/Qasthra.mp3', 'Sources/Musics/Qasthra.m4a'];
  const ev = ['pointerup', 'touchend', 'click', 'keydown'];
  let a = null, i = 0, was = false;
  const off = () => ev.forEach((e) => window.removeEventListener(e, go, true));
  const go = () => { if (!a || window.QBLOCK || !isDash()) return; if (window.QSET && window.QSET.get('music') === '0') return; const p = a.play(); if (p && p.then) p.then(off).catch(() => {}); };
  const start = () => { if (a) return; a = new Audio(); a.loop = false; const me = a; me.addEventListener('ended', () => { setTimeout(() => { if (a === me) { me.currentTime = 0; go(); } }, 30000); }); a.preload = 'metadata'; a.volume = window.QSET ? window.QSET.vol() : 0.08; a.src = S[0]; a.addEventListener('error', () => { if (i < S.length - 1) { i++; a.src = S[i]; a.load(); go(); } }); ev.forEach((e) => window.addEventListener(e, go, true)); go(); };
  const stop = () => { off(); if (a) { a.pause(); a.removeAttribute('src'); a.load(); a = null; i = 0; } };
  const authed = async () => !!(window.QAUTH && await window.QAUTH.session());
  const sync = async () => {
    const d = isDash(); if (d === was) return; was = d;
    if (!d) { stop(); if (!window.QBLOCK && window.QAUTH) window.QAUTH.hideVeil(); return; }
    if (await authed()) { if (isDash() && !window.QBLOCK) { start(); if (!document.getElementById('qload')) window.QAUTH.showVeil('Sources/Videos/Qasthra_intro.gif', 4300); } }
    else if (window.QAUTH) window.QAUTH.hideVeil();
  };
  window.addEventListener('hashchange', sync); document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); } else if (isDash() && !window.QBLOCK) { authed().then((ok) => { if (ok && isDash() && !window.QBLOCK && !document.hidden) start(); }); } }); window.addEventListener('pagehide', stop); window.addEventListener('qsetchange', () => { if (!window.QSET) return; if (!a) { if (isDash() && !document.hidden && window.QSET.get('music') !== '0') start(); return; } a.volume = window.QSET.vol(); if (window.QSET.get('music') === '0') a.pause(); else go(); });
  sync();
  (async () => {
    if (isDash()) return;
    document.documentElement.dataset.screenTransition = '1';
    const hint = (() => { try { return Object.keys(localStorage).some((k) => /auth-token/i.test(k)); } catch (e) { return false; } })(); if (hint && window.QAUTH) window.QAUTH.showVeil('Sources/Videos/Qasthra_intro.gif', 4300); window.QWAIT = true; let saved = false; try { saved = await Promise.race([authed(), new Promise((r) => setTimeout(() => r(false), 8000))]); } catch (e) { saved = false; }
    if (saved && !isDash()) { location.replace('#dashboard'); window.QWAIT = false; }
    else { window.QWAIT = false; if (!isDash()) { delete document.documentElement.dataset.screenTransition; if (window.QAUTH) window.QAUTH.hideVeil(); } }
  })();
})();
(() => {
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
  window.csGate = gate; window.QFIX = { email: fixEmail, phone: fixPhone, bad: BADCH };
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
(() => {
const $ = (s, r) => (r || document).querySelector(s); const html = document.documentElement; const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + ';'); const rd = (k) => { try { return localStorage.getItem('qs:' + k); } catch (e) { return null; } }; const wr = (k, v) => { try { localStorage.setItem('qs:' + k, String(v)); } catch (e) {} }; const D = { music: '1', vol: '8', haptics: '1', restore: '1', confirm: '0', text: 'default', motion: '0' }; const get = (k) => { const v = rd(k); return v === null ? D[k] : v; };
const apply = () => { html.dataset.text = get('text'); html.dataset.motion = get('motion') === '1' ? 'reduce' : 'off'; }; const set = (k, v) => { wr(k, v); apply(); window.dispatchEvent(new Event('qsetchange')); }; const th = () => { try { return localStorage.getItem('theme') || 'system'; } catch (e) { return 'system'; } }; const setTheme = (v) => { try { if (v === 'system') { localStorage.removeItem('theme'); delete html.dataset.theme; } else { localStorage.setItem('theme', v); html.dataset.theme = v; } } catch (e) {} window.dispatchEvent(new Event('themechange')); }; apply();
const P = { sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', text: '<path d="M4 19l5-14 5 14M6 14h6M16 19l2.5-7 2.5 7M17 17h3"/>', motion: '<path d="M3 12h4l3-8 4 16 3-8h4"/>', tab: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18"/>', warn: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.01"/>', haptic: '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4 8v8M20 8v8"/>', music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>', volume: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', logout: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>', sync: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"/>', download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>', upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>', db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>', reset: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>', star: '<path d="M12 4l2.4 5 5.6.7-4.1 3.8 1 5.5-4.9-2.7-4.9 2.7 1-5.5L4 9.7 9.6 9z"/>', clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>', plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>', keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>', file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>', back: '<path d="M15 6l-6 6 6 6"/>', chev: '<path d="M9 6l6 6-6 6"/>', user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>', pencil: '<path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" stroke="none"/>', share: '<circle cx="6.4" cy="12" r="2.8" fill="currentColor" stroke="none"/><circle cx="17.6" cy="6.2" r="2.8" fill="currentColor" stroke="none"/><circle cx="17.6" cy="17.9" r="2.8" fill="currentColor" stroke="none"/><path d="M6.4 12L17.6 6.2M6.4 12l11.2 5.9" stroke-width="2"/>' }; const ic = (n) => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>';
const DS = { Favorites: 'Saved Worlds and coordinates.', History: 'Past searches.', Transfers: 'Uploaded and downloaded files.', Theme: 'Interface colors.', Text: 'Text size.', Motion: 'Animations.', 'Restore': 'Tabs from the last session.', 'Warnings': 'Prompts before closing.', Haptics: 'Touch vibration.', Music: 'Background music.', Volume: 'Music loudness.', Encrypted: 'Browsing security mode.', Decrypted: 'Browsing security mode.', Synced: 'Data across devices.', Unsynced: 'Data across devices.', Export: 'Data as a file.', Import: 'Data from a file.', Storage: 'Space used on this device.', 'Reset': 'Default settings.', Version: 'Current release.' }; const dsc = (t) => (DS[t] ? '<small>' + DS[t] + '</small>' : ''); const row = (n, t, c) => '<div class="qs-row"><i class="qs-ic">' + ic(n) + '</i><div class="qs-tx"><b>' + t + '</b>' + dsc(t) + '</div>' + c + '</div>'; const tog = (n, t, k, on) => '<div class="qs-row qs-hit" data-tr="' + k + '"><i class="qs-ic">' + ic(n) + '</i><div class="qs-tx"><b>' + t + '</b>' + dsc(t) + '</div><button class="qb-sw" type="button" role="switch" aria-checked="' + on + '" aria-label="' + t + '"></button></div>'; const pick = (n, t, k, o, cur) => '<button class="qs-row qs-hit" type="button" data-do="pick" data-k="' + k + '" data-o="' + esc(JSON.stringify(o)) + '"><i class="qs-ic">' + ic(n) + '</i><div class="qs-tx"><b>' + t + '</b>' + dsc(t) + '</div><span class="qs-v">' + (o.find((x) => x[0] === cur) ? o.find((x) => x[0] === cur)[1] : o[0][1]) + '</span><i class="qs-ch">' + ic('chev') + '</i></button>'; 
const act = (n, t, d, v, x, arg) => '<button class="qs-row qs-hit' + (x ? ' ' + x : '') + '" type="button" data-do="' + d + '"' + (arg ? ' data-arg="' + arg + '"' : '') + '><i class="qs-ic">' + ic(n) + '</i><div class="qs-tx"><b>' + t + '</b>' + dsc(t) + '</div>' + (v !== '' && v != null ? '<span class="qs-v">' + v + '</span>' : '') + '<i class="qs-ch">' + ic('chev') + '</i></button>'; const lnk = (t, id) => '<a class="qs-row qs-hit" href="#" data-pop="' + id + '"><i class="qs-ic">' + ic('file') + '</i><div class="qs-tx"><b>' + t + '</b>' + dsc(t) + '</div><i class="qs-ch">' + ic('chev') + '</i></a>';
let UC = null, UT = 0; const usage = () => { if (UC !== null && Date.now() - UT < 3000) return UC; let n = 0; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^(qb|qs):/.test(k)) n += k.length + String(localStorage.getItem(k)).length; } } catch (e) {} UC = n < 1024 ? n + ' B' : (n / 1024).toFixed(1) + ' KB'; UT = Date.now(); return UC; }; const CAT = [['library', 'Library', 'star'], ['appearance', 'Appearance', 'sun'], ['browsing', 'Browsing', 'tab'], ['sound', 'Sound', 'music'], ['privacy', 'Privacy', 'shield'], ['data', 'Data', 'db']]; const K = [['Move left or right', 'A', 'D'], ['Move up or down', 'W', 'S'], ['Depth in or out', 'E', 'Q'], ['Go to Qasthra', '0'], ['Back or Next', '[', ']'], ['Previous or next World', '<', '>'], ['New World', 'T'], ['Close World', 'X'], ['Reload', 'R'], ['Encrypted', 'P'], ['Favorite', 'F'], ['Copy coordinates', 'C'], ['Sync', 'Y'], ['Theme', 'M'], ['Search', '/', 'Ctrl K'], ['Panels', 'H', 'U', ',']];
const sec = (id, t, rows) => '<section class="qs-sec" data-c="' + id + '"><div class="qs-list">' + rows.join('') + '</div></section>'; const secs = () => { const B = window.QBAPI, c = B ? B.count() : { hist: 0, favs: 0, xfer: 0 }; const S = { library: [act('star', 'Favorites', 'panel', c.favs, '', 'saved'), act('clock', 'History', 'panel', c.hist, '', 'history'), act('download', 'Transfers', 'panel', c.xfer, '', 'xfer')], appearance: [pick('sun', 'Theme', 'theme', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']], th()), pick('text', 'Text', 'text', [['small', 'Small'], ['default', 'Default'], ['large', 'Large']], get('text')), tog('motion', 'Motion', 'motion', get('motion') !== '1')], browsing: [tog('tab', 'Restore', 'restore', get('restore') === '1'), tog('warn', 'Warnings', 'confirm', get('confirm') === '1'), tog('haptic', 'Haptics', 'haptics', get('haptics') === '1')], sound: [tog('music', 'Music', 'music', get('music') === '1'), row('volume', 'Volume', '<input class="qs-rng" type="range" min="0" max="100" step="1" value="' + get('vol') + '" data-r="vol" aria-label="Volume"><span class="qs-v qs-pc">' + get('vol') + '%</span>')], privacy: [tog('lock', (B ? B.enc() : false) ? 'Encrypted' : 'Decrypted', 'enc', B ? B.enc() : false), tog('sync', (B ? B.syncOn() : false) ? 'Synced' : 'Unsynced', 'sync', B ? B.syncOn() : false)], data: [act('download', 'Export', 'export', 'JSON'), act('upload', 'Import', 'import', 'JSON'), row('db', 'Storage', '<span class="qs-v">' + usage() + '</span>'), act('reset', 'Reset', 'reset', '')], shortcuts: K.map((x) => '<div class="qs-row qs-sc"><div class="qs-tx"><b>' + x[0] + '</b></div><span class="qs-keys">' + x.slice(1).map((k) => '<kbd>' + esc(k) + '</kbd>').join('') + '</span></div>'), about: [row('info', 'Version', '<span class="qs-v">A1.00</span>'), lnk('Licenses and Policies', 'licenses'), lnk('Terms and Conditions', 'terms'), lnk('Guidance', 'guidance'), lnk('Recovery', 'recovery'), lnk('Certificates', 'certificates')] }; return CAT.map((x) => sec(x[0], x[1], S[x[0]])).join(''); };
const LANG = ['English', 'Filipino', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Ukrainian', 'Polish', 'Turkish', 'Arabic', 'Hebrew', 'Persian', 'Hindi', 'Bengali', 'Urdu', 'Tamil', 'Indonesian', 'Malay', 'Thai', 'Vietnamese', 'Chinese', 'Japanese', 'Korean', 'Swahili', 'Cebuano', 'Ilocano', 'Other']; const fld = (n, l, t, m, x) => '<label class="cs-f"><span>' + l + '</span><input name="' + n + '" type="' + t + '" maxlength="' + m + '"' + (x || '') + '></label>';
const card = () => '<div class="qs-card"><div class="qs-ct qs-tap" data-do="profile" role="button" tabindex="0" aria-label="Open profile"><div class="qs-av" data-av>?</div><div class="qs-who"><h2 class="qs-nm" data-nm>Account</h2><p class="qs-un" data-un></p></div></div><div class="qs-cf"><button class="qs-pill" type="button" data-do="signout" aria-label="Switch account">' + ic('user') + '<span>Switch</span></button><span class="qs-cg">' + (window.QBUG ? window.QBUG.btn() : '') + '<button class="qs-pill qs-circ" type="button" data-do="manage" aria-label="Edit">' + ic('pencil') + '</button></span></div>' + (window.QBUG ? window.QBUG.box() : '') + '</div>';
const AK = ['full_name', 'recovery_email', 'phone', 'gender', 'sex', 'language', 'address_home', 'address_work', 'bio'];
const ALB = { username: 'Username', full_name: 'Name', birthday: 'Birthday', recovery_email: 'Email', phone: 'Phone', address_home: 'Home address', address_work: 'Work address', gender: 'Gender', sex: 'Sex', language: 'Language', bio: 'About' };
const ATX = { full_name: ['text', 40, 'name'], recovery_email: ['email', 120, 'email'], phone: ['tel', 24, 'tel'], address_home: ['text', 160, 'off'], address_work: ['text', 160, 'off'], bio: ['area', 260, 'off'] };
const AOP = { gender: ['Man', 'Woman', 'Non-binary', 'Prefer not to say'], sex: ['Male', 'Female', 'Intersex', 'Prefer not to say'], language: LANG };
const qsv = (d) => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
const CVS = '<span class="cv-d">' + qsv('M6 9l6 6 6-6') + '</span><span class="cv-u">' + qsv('M6 15l6-6 6 6') + '</span>'; const CHK = qsv('M5 12.5l4.5 4.5L19 7.5');
const erow = (k) => '<div class="qs-er"><button class="qs-row qs-hit" type="button" data-do="edit" data-k="' + k + '" aria-haspopup="dialog" aria-expanded="false"><div class="qs-tx"><small>' + ALB[k] + '</small><b data-show="' + k + '"></b></div><i class="qs-ch">' + ic('pencil') + '</i></button><input name="' + k + '" type="hidden"></div>';
const rrow = (k) => '<div class="qs-er qs-ro"><div class="qs-row"><div class="qs-tx"><small>' + ALB[k] + '</small><b data-show="' + k + '"></b></div></div><input name="' + k + '" type="hidden"></div>';
const pwf = (n, l, a) => '<label class="cs-f"><span>' + l + '</span><div class="qs-pwf"><input name="' + n + '" type="password" maxlength="72" autocomplete="' + a + '" autocapitalize="none" autocorrect="off" spellcheck="false"><button class="qs-eye" type="button" data-do="eye" aria-label="Show password" aria-pressed="false">Show</button></div></label>'; const pwrow = () => '<div class="qs-er qs-pw"><button class="qs-row qs-hit" type="button" data-do="pwx" aria-expanded="false"><i class="qs-ic">' + ic('lock') + '</i><div class="qs-tx"><b>Password</b><small>Confirm your current password to change it.</small></div><i class="qs-ch">' + CVS + '</i></button><div class="qs-ei">' + pwf('pw0', 'Current', 'current-password') + pwf('pw1', 'Replacer', 'new-password') + '<div class="qs-ts"" aria-live="polite"></div></div></div>';
const lst = (rows) => '<div class="qs-list">' + rows.join('') + '</div>';
const accHtml = () => '<div class="qs-acc"><header class="qs-bar"><button class="qs-back" type="button" data-do="back" aria-label="Back to settings">' + ic('back') + '</button><span class="qs-ttl">Account</span><span class="qs-sp"></span></header><div class="qs-accw"><form class="qs-af" data-f="acc" novalidate>' + lst([rrow('username'), erow('full_name'), rrow('birthday')]) + lst([erow('recovery_email'), erow('phone'), erow('address_home'), erow('address_work')]) + lst([erow('gender'), erow('sex'), erow('language'), erow('bio')]) + lst([pwrow()]) + '<div class="qs-chg" hidden><p class="qs-note" role="status" aria-live="polite"></p><div class="qs-acts"><button class="btn btn-second qs-cx" type="button" data-do="cancel">Cancel</button><button class="btn btn-mono qs-save" type="submit">Change</button></div></div></form></div><div class="qs-sh" hidden><div class="qs-sh-bd" data-sh="x"></div><div class="qs-sh-p" role="dialog" aria-modal="true" aria-label="Edit"><h4 class="qs-sh-t"></h4><div class="qs-sh-c"></div></div></div></div>';
const TSK = '0x4AAAAAAGLGlnJ2L6nuIdEP'; const SBU = 'https://hwffsxhonbymzwomhoyd.supabase.co'; const SBK = 'sb_publishable_Rqtyo62gG01MIWkF5Jz8Qw_Xe-UoXCZ'; let tw = null, ttok = '', shk = '', shb = null;
const tsOff = () => { try { if (tw !== null && window.turnstile) window.turnstile.remove(tw); } catch (e) {} tw = null; ttok = ''; const b = root && $('.qs-ts', root); if (b) { b.innerHTML = ''; b.classList.remove('chal'); } };
const tsOn = (n) => { const b = root && $('.qs-ts', root); if (!b) return; const t = window.turnstile; if (!t) { if ((n || 0) < 40) setTimeout(() => tsOn((n || 0) + 1), 250); return; } tsOff(); try { tw = t.render(b, { sitekey: TSK, action: 'auth', theme: html.dataset.theme || 'auto', size: 'flexible', appearance: 'interaction-only', retry: 'never', 'refresh-expired': 'manual', 'refresh-timeout': 'manual', callback: (v) => { ttok = v; b.classList.remove('chal'); }, 'before-interactive-callback': () => { b.classList.add('chal'); }, 'after-interactive-callback': () => { b.classList.remove('chal'); }, 'expired-callback': () => { ttok = ''; tsOn(); }, 'timeout-callback': () => { ttok = ''; }, 'error-callback': () => { ttok = ''; } }); } catch (e) { tw = null; } };
const BWS = ['fuck', 'shit', 'bitch', 'cunt', 'nigg', 'fagg', 'nazi', 'hitler', 'porn'];
const bwHit = (s) => String(s || '').toLowerCase().split(/[^a-z]+/).some((w) => w && (BWS.some((b) => w.indexOf(b) === 0) || /^rap(e|ed|es|ing|ist|ists)$/.test(w)));
const LNK = /(https?:|ftp:|www\.|\b[a-z0-9-]+\.(com|net|org|info|xyz|app|dev|gg|ly|ru|cn|tk)\b|[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,})/i;
const fixTxt = (k, v) => { v = String(v == null ? '' : v); const q = window.QFIX || {};
if (k === 'full_name') return v.normalize('NFC').replace(/[^\p{L} ]/gu, '').replace(/\s+/g, ' ').replace(/^ +/, '').slice(0, 60);
if (k === 'recovery_email') return q.email ? q.email(v) : v.toLowerCase().replace(/[^a-z0-9._%+@-]/g, '').slice(0, 120);
if (k === 'phone') return q.phone ? q.phone(v) : v.replace(/[^0-9+ ]/g, '').slice(0, 24);
if (k === 'bio') return v.replace(q.bad || /[<>{}\[\]`]/g, '').replace(/\s+/g, ' ').replace(/^ +/, '').slice(0, 260);
return v.normalize('NFC').replace(/[^\p{L}\p{M}\p{N} .,'#\/&()-]/gu, '').replace(/\s+/g, ' ').replace(/^[ .,'#\/&)-]+/, '').slice(0, 160); };
const chkTxt = (k, v) => { v = String(v || '').trim();
if (k === 'full_name') { if (v.length < 2 || !/^\p{L}+(?:\s+\p{L}+)*$/u.test(v)) return 'Name must be 2 to 60 letters and spaces only.'; return bwHit(v) ? 'That name is not allowed.' : ''; }
if (k === 'recovery_email') return v.length <= 120 && /^[a-z0-9]+(?:[._%+-][a-z0-9]+)*@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|proton\.me)$/.test(v.toLowerCase()) ? '' : 'Use a Gmail, Yahoo, Outlook, Hotmail, iCloud or Proton email.';
if (k === 'phone') { const d = v.replace(/[^0-9]/g, ''); return (d.slice(0, 2) === '63' ? d.length === 12 : d.length >= 8 && d.length <= 15) ? '' : 'Enter a complete phone number.'; }
if (!v) return ''; const L = ALB[k] || 'This field';
if (k === 'bio') { if (v.length < 5) return 'About needs at least 5 characters.'; if (LNK.test(v)) return 'Links and email addresses are not allowed in About.'; return bwHit(v) ? 'Please remove offensive words from About.' : ''; }
if (v.length < 5 || !/\p{L}/u.test(v)) return L + ' needs at least 5 characters, with letters.'; if (LNK.test(v)) return 'Links are not allowed in ' + L + '.'; return bwHit(v) ? 'Please remove offensive words from ' + L + '.' : ''; };
const shCount = () => { const n = root && $('.qs-sh-n', root); if (!n) return; if (shk !== 'bio') { n.textContent = ''; return; } const i = $('.qs-sh-c [name="v"]', root); n.textContent = '(' + Math.max(0, 260 - (i ? i.value.length : 0)) + ')'; };
const accForm = () => (root ? $('form[data-f="acc"]', root) : null); const pwFilled = (f) => ['pw0', 'pw1'].some((k) => f.elements[k] && f.elements[k].value); const shEl = () => (root ? $('.qs-sh', root) : null);
const PWBAD = /[\u0000-\u001F\u007F-\u009F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180E\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\u3164\uFEFF\uFFA0\uFFF9-\uFFFB]/g; const pwClean = (s) => { s = String(s == null ? '' : s).replace(PWBAD, ''); const e = new TextEncoder(), a = Array.from(s); while (a.length && e.encode(a.join('')).length > 72) a.pop(); return a.join(''); }; const PWCOMMON = new Set('password password1 password12 password123 password1234 passw0rd p@ssw0rd p@ssword 12345678 123456789 1234567890 11111111 00000000 12341234 123123123 qwertyui qwerty123 qwerty1234 qwertyuiop 1q2w3e4r 1q2w3e4r5t 1qaz2wsx qazwsxedc asdfghjk asdfghjkl zxcvbnm123 iloveyou iloveyou1 abc12345 abcd1234 abcdefgh abcdefg1 letmein1 letmein123 welcome1 welcome123 admin123 administrator monkey123 dragon123 football1 baseball1 superman1 trustno1 sunshine1 princess1 master123 shadow123 michael1 jessica1 charlie1 starwars1 whatever1 changeme changeme1 default123 test1234 testing123 login123 user1234 guest123 qasthra qasthra1 qasthra123 qasthra2026 secret123 football123 batman123 liverpool1 chelsea123 arsenal123 mustang1 access123 hello123 hello1234 freedom1 summer123 winter123 spring123 autumn123 internet1 computer1 samsung1 google123 iphone123 pass1234 pass12345 pass123456 pa55word pa55w0rd 987654321 98765432 123456abc 1234qwer qwer1234 zaq12wsx 1qazxsw2 2wsx3edc q1w2e3r4 q1w2e3r4t5 a1b2c3d4 a1b2c3d4e5'.split(' ')); const pwOk = (p) => { p = String(p == null ? '' : p); return p.length >= 8 && p.length <= 72 && /\p{L}/u.test(p) && /\p{N}/u.test(p) && !PWCOMMON.has(p.toLowerCase()); }; const accSync = (ev) => { const f = accForm(); if (!f) return; const w1 = f.elements.pw1; if (w1 && !(ev && ev.isComposing)) { const c1 = pwClean(w1.value); if (c1 !== w1.value) w1.value = c1; } const m = (U && U.user_metadata) || {}; root.querySelectorAll('[data-show]').forEach((el) => { const i = f.elements[el.dataset.show]; const v = i ? String(i.value || '').trim() : ''; el.textContent = v || 'Not set'; el.classList.toggle('qs-nil', !v); }); const dirty = AK.some((k) => f.elements[k] && String(f.elements[k].value || '').trim() !== String(m[k] || '').trim()); const sb = $('.qs-save', f); if (sb && !f.dataset.busy) sb.disabled = pwFilled(f) && !pwOk(f.elements.pw1 ? f.elements.pw1.value : ''); const bar = $('.qs-chg', f); if (bar) bar.hidden = !(dirty || pwFilled(f)); };
const shClose = (back) => { const s = shEl(); if (!s || s.hidden) return; s.hidden = true; $('.qs-sh-c', s).innerHTML = ''; if (shb) { shb.classList.remove('open'); shb.setAttribute('aria-expanded', 'false'); if (back !== false) { try { shb.focus({ preventScroll: true }); } catch (e) {} } } shb = null; shk = ''; };
const accEdit = (a) => { const f = accForm(), s = shEl(), k = a.dataset.k; if (!f || !s || !f.elements[k]) return; shClose(false); shk = k; shb = a; a.classList.add('open'); a.setAttribute('aria-expanded', 'true'); const cur = String(f.elements[k].value || ''), c = $('.qs-sh-c', s); $('.qs-sh-t', s).textContent = ALB[k]; s.dataset.t = AOP[k] ? 'pick' : 'text';
if (AOP[k]) { c.innerHTML = '<div class="qs-op-l" role="listbox" aria-label="' + ALB[k] + '">' + AOP[k].map((v) => '<button class="qs-op" type="button" role="option" data-sh="pick" data-v="' + esc(v) + '" aria-selected="' + (v === cur) + '"><span>' + esc(v) + '</span>' + CHK + '</button>').join('') + '</div>'; s.hidden = false; const on = $('.qs-op[aria-selected="true"]', c) || $('.qs-op', c); if (on) { try { on.focus({ preventScroll: true }); on.scrollIntoView({ block: 'center' }); } catch (e) {} } return; }
const x = ATX[k]; c.innerHTML = '<label class="cs-f"><span>' + ALB[k] + '</span>' + (x[0] === 'area' ? '<textarea name="v" rows="4" maxlength="' + x[1] + '" autocomplete="off"></textarea>' : '<input name="v" type="' + x[0] + '" maxlength="' + x[1] + '" autocomplete="' + x[2] + '">') + '</label><p class="qs-sh-n" aria-live="polite"></p><p class="qs-sh-e" role="alert"></p><div class="qs-sh-a"><button class="btn btn-second" type="button" data-sh="no">Cancel</button><button class="btn btn-mono" type="button" data-sh="ok">Done</button></div>'; const i = $('[name="v"]', c); i.value = cur; shCount(); s.hidden = false; i.focus(); };
const accReset = () => { const f = accForm(); if (!f) return; shClose(false); tsOff(); const w = $('.qs-pw', f); if (w) w.classList.remove('ed'); const pb = $('.qs-pw > .qs-hit', f); if (pb) pb.setAttribute('aria-expanded', 'false'); ['pw0', 'pw1'].forEach((k) => { if (f.elements[k]) { f.elements[k].value = ''; f.elements[k].type = 'password'; } }); f.querySelectorAll('.qs-eye').forEach((b) => { b.textContent = 'Show'; b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Show password'); }); const n = $('.qs-note', f); if (n) n.textContent = ''; paint(); };
const accPw = () => { const f = accForm(); if (!f) return; const w = $('.qs-pw', f), b = $('.qs-pw > .qs-hit', f); const on = !w.classList.contains('ed'); w.classList.toggle('ed', on); b.setAttribute('aria-expanded', String(on)); if (on) { tsOn(); setTimeout(() => { try { w.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }, 60); } else { tsOff(); ['pw0', 'pw1'].forEach((k) => { f.elements[k].value = ''; f.elements[k].type = 'password'; }); f.querySelectorAll('.qs-eye').forEach((b) => { b.textContent = 'Show'; b.setAttribute('aria-pressed', 'false'); }); accSync(); } };
const submitAcc = async (e) => { const f = e.target.closest && e.target.closest('form[data-f="acc"]'); if (!f) return; e.preventDefault(); e.stopPropagation(); if (f.dataset.busy) return; const note = $('.qs-note', f), btn = $('.qs-save', f); const say = (t) => { note.textContent = t; }; const cl = (s) => String(s || '').replace(/[\u0000-\u001f\u007f<>{}\[\]`]/g, ' ').replace(/\s+/g, ' ').trim(); if (!window.db) { say('Connection unavailable. Try again later.'); return; } const m = (U && U.user_metadata) || {}; const g = (k) => cl(f.elements[k].value); const data = {}; AK.forEach((k) => { const v = k === 'bio' ? g(k).slice(0, 260) : g(k); if (v !== String(m[k] || '').trim()) data[k] = k === 'recovery_email' ? v.toLowerCase() : (v || null); });
for (const k of ['full_name', 'recovery_email', 'phone', 'bio', 'address_home', 'address_work']) { if (data[k] === undefined) continue; const v = data[k] || ''; const er = chkTxt(k, v); if (er) { say(er); return; } if ((k === 'full_name' || k === 'bio' || k.indexOf('address_') === 0) && v && fixTxt(k, v) !== v) { say(ALB[k] + ' has characters that are not allowed.'); return; } } if ((data.gender !== undefined && !data.gender) || (data.sex !== undefined && !data.sex)) { say('Choose your gender and sex, or Prefer not to say.'); return; }
const wantPw = pwFilled(f); const p0 = f.elements.pw0.value, p1 = f.elements.pw1.value; if (!wantPw && !Object.keys(data).length) return; if (wantPw) { if (!p0) { say('Enter your current password.'); return; } if (!p1) { say('Enter your replacer password.'); return; } if (p1.length < 8) { say('Your replacer needs at least 8 characters.'); return; } if (p1.length > 72) { say('Your replacer is too long.'); return; } if (p1 === p0) { say('Your replacer must be different from the current password.'); return; } if (!pwOk(p1)) return; if (!U || !U.email) { say('Your session expired. Sign in again.'); return; } if (!ttok) { say('Still checking that you are human. Try again in a moment.'); return; } }
f.dataset.busy = '1'; btn.disabled = true; say('Saving...'); try { if (wantPw) { let ok = false, msg = ''; try { const q = await fetch(SBU + '/functions/v1/sign-in', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SBK }, body: JSON.stringify({ email: U.email, password: p0, captchaToken: ttok, pass: '' }) }); const j = await q.json().catch(() => ({})); if (q.status === 403) msg = j.message || 'Human check failed. Try again.'; else if (q.status === 429) msg = j.message || 'Too many attempts. Try again later.'; else if (q.ok && j.access_token) { ok = true; fetch(SBU + '/auth/v1/logout?scope=local', { method: 'POST', headers: { apikey: SBK, Authorization: 'Bearer ' + j.access_token } }).catch(() => {}); } else msg = 'Your current password is incorrect.'; } catch (x) { msg = 'Could not verify your password. Try again later.'; } ttok = ''; if (!ok) { say(msg); tsOn(); delete f.dataset.busy; btn.disabled = false; return; } }
const payload = {}; if (Object.keys(data).length) payload.data = data; if (wantPw) payload.password = p1; const r = await window.db.auth.updateUser(payload); if (r.error) throw r.error; U = r.data.user; try { const pu = {}; if (data.full_name) pu.display_name = String(data.full_name).slice(0, 40); if (data.bio !== undefined) pu.bio = data.bio; if (Object.keys(pu).length) await window.db.from('profiles').update(pu).eq('id', U.id); } catch (e) {} accReset(); toast(wantPw ? 'Password changed.' : 'Changes saved.'); } catch (x) { say(x && x.message ? x.message : 'Could not save. Try again later.'); if (wantPw) tsOn(); } delete f.dataset.busy; btn.disabled = false; };
const wireAcc = () => { root.addEventListener('submit', submitAcc, true); root.addEventListener('input', accSync); root.addEventListener('change', accSync);
root.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-sh]'); if (!b) return; const f = accForm(), k = shk, act = b.dataset.sh; if (act === 'x' || act === 'no') { shClose(); return; } if (!f || !k) return; if (act === 'pick') { f.elements[k].value = String(b.dataset.v); shClose(); accSync(); return; } if (act === 'ok') { const i = $('.qs-sh-c [name="v"]', root); if (!i) return; const v = fixTxt(k, i.value).trim(); const er = chkTxt(k, v); if (er) { const p = $('.qs-sh-e', root); if (p) p.textContent = er; return; } f.elements[k].value = v; shClose(); accSync(); } });
root.addEventListener('input', (e) => { const i = e.target; if (!i || e.isComposing || !shk || !i.matches || !i.matches('.qs-sh-c [name="v"]')) return; const v = fixTxt(shk, i.value); if (v !== i.value) i.value = v; const p = $('.qs-sh-e', root); if (p) p.textContent = ''; shCount(); });
root.addEventListener('keydown', (e) => { const s = shEl(); if (!s || s.hidden) return; if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); shClose(); return; } if (e.key === 'Enter' && e.target.matches && e.target.matches('.qs-sh-c input')) { e.preventDefault(); const ok = $('[data-sh="ok"]', s); if (ok) ok.click(); } }); };
const build = () => '<div class="qs-in"><header class="qs-bar"><button class="qs-back" type="button" data-do="close" aria-label="Close settings">' + ic('back') + '</button><span class="qs-ttl">Settings</span><button class="qs-info" type="button" data-do="info" aria-label="Information" aria-haspopup="true" aria-expanded="false"><span aria-hidden="true">i</span></button><div class="qs-pop" aria-label="Information" hidden><a class="qs-pl" href="#" data-pop="licenses">' + ic('file') + '<span>Licenses and Policies</span></a><a class="qs-pl" href="#" data-pop="terms">' + ic('file') + '<span>Terms and Conditions</span></a><a class="qs-pl" href="#" data-pop="guidance">' + ic('file') + '<span>Guidance and Recovery</span></a><p class="qs-ver"><span>Version: A1.00</span><span>24/11/26</span></p></div></header>' + (window.QNOTIF ? window.QNOTIF.html() : '') + '<div class="qs-wrap"><aside class="qs-side">' + card() + '<nav class="qs-nv-l" aria-label="Settings sections">' + CAT.map((x) => '<button class="qs-nv" type="button" data-nav="' + x[0] + '" aria-current="false"><i class="qs-ic">' + ic(x[2]) + '</i>' + x[1] + '</button>').join('') + '</nav></aside><main class="qs-main">' + secs() + '</main></div></div>' + accHtml() + '<div class="qs-sh qs-sp" hidden><div class="qs-sh-bd" data-spx="1"></div><div class="qs-sh-p" role="dialog" aria-modal="true" aria-label="Choose"><h4 class="qs-sh-t"></h4><div class="qs-sh-c"></div></div></div><div class="qs-toast" role="status" aria-live="polite"></div>';
let root = null, last = null, U = null, cat = 'library', tt = 0; const toast = (t) => { const el = root && $('.qs-toast', root); if (!el) return; el.textContent = t; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 2200); }; const showCat = (id) => { cat = id; if (!root) return; root.querySelectorAll('.qs-sec').forEach((s) => s.classList.toggle('on', s.dataset.c === id)); root.querySelectorAll('[data-nav]').forEach((b) => b.setAttribute('aria-current', String(b.dataset.nav === id))); }; const refresh = () => { const m = root && $('.qs-main', root); if (!m) return; m.innerHTML = secs(); showCat(cat); };
const paint = () => { if (!root) return; const m = (U && U.user_metadata) || {}; const nm = m.full_name || m.username || 'Account'; root.querySelectorAll('[data-av]').forEach((x) => { x.innerHTML = '<svg viewBox="3.5 3.8 17 17.2" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5z"/></svg>' || '?'; }); root.querySelectorAll('[data-nm]').forEach((x) => { x.textContent = nm; }); if (window.QPROF && window.QPROF.card) window.QPROF.card(); root.querySelectorAll('[data-un]').forEach((x) => { x.textContent = m.username ? '@' + m.username : ''; }); root.querySelectorAll('[data-em]').forEach((x) => { x.textContent = m.recovery_email || (m.username ? '@' + m.username : ''); }); const f = $('form[data-f="acc"]', root); if (f) { ['username', 'full_name', 'recovery_email', 'phone', 'gender', 'sex', 'language', 'address_home', 'address_work', 'bio'].forEach((k) => { const el = f.elements[k]; if (el) el.value = m[k] || ''; }); if (f.elements.birthday) f.elements.birthday.value = m.birthday ? m.birthday + (m.age != null ? ' (' + m.age + ')' : '') : ''; } accSync(); }; const load = async () => { try { const r = await window.db.auth.getSession(); U = r.data && r.data.session ? r.data.session.user : null; } catch (e) { U = null; } paint(); };
const close = () => { if (!root) return; try { tsOff(); } catch (e) {} root.remove(); root = null; html.classList.remove('qs-open'); const a = document.getElementById('app'); if (a) a.inert = false; if (last && last.focus) { try { last.focus(); } catch (e) {} } last = null; }; const importProf = (p) => { const out = {}; if (p === undefined || p === null) return out; if (typeof p !== 'object' || Array.isArray(p)) return null; const cl = (s) => String(s || '').replace(/[\u0000-\u001f\u007f<>{}\[\]`]/g, ' ').replace(/\s+/g, ' ').trim(); for (const k of AK) { if (!Object.prototype.hasOwnProperty.call(p, k)) continue; const raw = p[k]; if (raw !== null && typeof raw !== 'string') return null; let v = raw === null ? '' : (k === 'bio' ? cl(raw).slice(0, 260) : cl(raw)); if (k === 'recovery_email') v = v.toLowerCase(); if (AOP[k]) { if (v && AOP[k].indexOf(v) < 0) return null; } else if (v || k === 'full_name' || k === 'recovery_email' || k === 'phone') { if (chkTxt(k, v)) return null; if ((k === 'full_name' || k === 'bio' || k.indexOf('address_') === 0) && v && fixTxt(k, v) !== v) return null; } if (v) out[k] = v; else if (k === 'address_home' || k === 'address_work' || k === 'bio') out[k] = null; } return out; }; const importCheck = (d) => { const isO = (x) => x !== null && typeof x === 'object' && !Array.isArray(x), str = (x, n) => typeof x === 'string' && x.length > 0 && x.length <= n, txt = (x, n) => typeof x === 'string' && x.length <= n, num = (x) => typeof x === 'number' && isFinite(x), bin = (x) => x === '0' || x === '1'; if (!isO(d) || !str(d.exported, 40) || isNaN(Date.parse(d.exported)) || !isO(d.settings) || !isO(d.browser)) return null; const s = d.settings, b = d.browser, vol = Number(s.volume); if (['system', 'light', 'dark'].indexOf(s.theme) < 0 || ['small', 'default', 'large'].indexOf(s.text) < 0 || !bin(s.motion) || !bin(s.music) || !bin(s.haptics) || !bin(s.restore) || !bin(s.confirm) || !(vol >= 0 && vol <= 100) || !Array.isArray(b.favorites) || !Array.isArray(b.history) || b.favorites.length > 1000 || b.history.length > 200) return null; const pr = importProf(d.profile); if (pr === null) return null; const seen = {}, fav = [], his = []; for (const x of b.favorites) { if (!isO(x) || !str(x.id, 64) || !txt(x.title, 300) || !txt(x.q, 2000) || ['Core', 'Orbit', 'Archive'].indexOf(x.tier) < 0 || !num(x.at) || seen['f' + x.id]) return null; seen['f' + x.id] = 1; fav.push({ id: x.id, title: x.title, q: x.q, tier: x.tier, at: x.at }); } for (const x of b.history) { if (!isO(x) || !str(x.id, 64) || !str(x.k, 20) || !txt(x.q, 2000) || !num(x.at) || seen['h' + x.id]) return null; seen['h' + x.id] = 1; his.push({ id: x.id, k: x.k, q: x.q, at: x.at }); } return { settings: { theme: s.theme, text: s.text, motion: s.motion, music: s.music, haptics: s.haptics, restore: s.restore, confirm: s.confirm, vol: String(Math.round(vol)) }, favorites: fav, history: his, profile: pr }; }; const importFlow = () => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json'; inp.style.cssText = 'position:fixed;left:-9999px;opacity:0'; inp.addEventListener('cancel', () => inp.remove()); inp.addEventListener('change', async () => { const f = inp.files && inp.files[0]; inp.remove(); if (!f) return; const bad = () => toast('That file is not a valid Qasthra export.'); if (f.size > 2000000) return bad(); let d; try { d = JSON.parse(await f.text()); } catch (e) { return bad(); } const v = importCheck(d); if (!v) return bad(); if (!confirm('Warning: importing replaces ALL your data on this device and online with the contents of this file, including your editable profile details (never your username, birthday or password). This cannot be undone. Continue?')) return; try { setTheme(v.settings.theme); ['text', 'motion', 'music', 'haptics', 'restore', 'confirm', 'vol'].forEach((k) => wr(k, v.settings[k])); apply(); window.dispatchEvent(new Event('qsetchange')); const ok = window.QBAPI ? await window.QBAPI.importData(v) : false; let pok = true; if (Object.keys(v.profile).length) { try { if (!window.db) throw 0; const r = await window.db.auth.updateUser({ data: v.profile }); if (r.error) throw r.error; U = r.data.user; paint(); } catch (e) { pok = false; } } refresh(); toast(!pok ? 'Imported, but your profile could not be saved.' : ok ? 'Data imported.' : 'Imported on this device. Online update failed.'); } catch (e) { toast('Import failed.'); } }); document.body.appendChild(inp); inp.click(); }; const exportData = () => { const data = { exported: new Date().toISOString(), profile: (U && U.user_metadata) || {}, settings: { theme: th(), text: get('text'), motion: get('motion'), music: get('music'), volume: get('vol'), haptics: get('haptics'), restore: get('restore'), confirm: get('confirm') }, browser: window.QBAPI ? window.QBAPI.exportData() : null }; const b = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'qasthra-data.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); toast('Data exported.'); };
document.addEventListener('click', (e) => { if (!root) return; const a = e.target.closest && e.target.closest('a[data-pop]'); if (!a) return; const p = $('.qs-pop', root), b = $('.qs-info', root); if (p) p.hidden = true; if (b) b.setAttribute('aria-expanded', 'false'); }, true); const openProf = () => { if (document.querySelector('.qs-pf')) return; const p = document.createElement('div'); p.className = 'qs-pf'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true'); p.setAttribute('aria-label', 'Profile'); const b = document.createElement('button'); b.type = 'button'; b.className = 'qs-pf-x'; b.setAttribute('aria-label', 'Back'); b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>'; const shut = () => { p.remove(); document.removeEventListener('keydown', esc, true); const t = root ? $('.qs-ct', root) : null; if (t) t.focus(); }; const esc = (e) => { if (e.key === 'Escape') { e.stopPropagation(); shut(); } }; b.addEventListener('click', shut); document.addEventListener('keydown', esc, true); p.appendChild(b); document.body.appendChild(p); b.focus(); if (window.QPROF) window.QPROF.mount(p, null); }; document.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.qs-ct[data-do="profile"]')) { e.preventDefault(); openProf(); } }); const spEl = () => (root ? $('.qs-sh.qs-sp', root) : null); const spClose = () => { const s = spEl(); if (s) s.hidden = true; }; const spOpen = (a) => { const s = spEl(); if (!s) return; const o = JSON.parse(a.dataset.o), k = a.dataset.k, cur = k === 'theme' ? th() : get(k); s.dataset.k = k; $('.qs-sh-t', s).textContent = $('.qs-tx b', a).textContent; $('.qs-sh-c', s).innerHTML = '<div class="qs-op-l" role="listbox">' + o.map((x) => '<button class="qs-op" type="button" role="option" data-sp="' + esc(x[0]) + '" aria-selected="' + (x[0] === cur) + '"><span>' + esc(x[1]) + '</span>' + CHK + '</button>').join('') + '</div>'; s.hidden = false; let on = $('.qs-op[aria-selected="true"]', s); if (!on) on = $('.qs-op', s); if (on) { try { on.focus({ preventScroll: true }); on.scrollIntoView({ block: 'center' }); } catch (e) {} } }; const A = { pick: (a) => spOpen(a), edit: (a) => accEdit(a), pwx: () => accPw(), eye: (a) => { const i = a.parentNode.querySelector('input'); if (!i) return; const on = i.type === 'password'; i.type = on ? 'text' : 'password'; a.textContent = on ? 'Hide' : 'Show'; a.setAttribute('aria-pressed', String(on)); a.setAttribute('aria-label', on ? 'Hide password' : 'Show password'); }, cancel: () => accReset(), profile: openProf, info: () => { const p = $('.qs-pop', root), b = $('.qs-info', root); if (!p || !b) return; const o = p.hidden; p.hidden = !o; b.setAttribute('aria-expanded', String(o)); }, close: () => close(), manage: () => { root.dataset.v = 'acc'; root.scrollTop = 0; }, back: () => { accReset(); root.dataset.v = 'main'; root.scrollTop = 0; }, signout: () => { close(); if (window.QBAPI) window.QBAPI.signout(); }, panel: (a) => { close(); if (window.QBAPI) window.QBAPI.panel(a.dataset.arg); }, clearhist: async () => { if (!window.QBAPI || !confirm('Clear all history on this device?')) return; await window.QBAPI.clearHist(); refresh(); toast('History cleared.'); }, clearfavs: () => { if (!window.QBAPI || !confirm('Remove all favorites?')) return; window.QBAPI.clearFavs(); refresh(); toast('Favorites cleared.'); }, export: exportData, import: importFlow, reset: () => { if (!confirm('Reset all settings to default?')) return; Object.keys(D).forEach((k) => { try { localStorage.removeItem('qs:' + k); } catch (e) {} }); apply(); window.dispatchEvent(new Event('qsetchange')); refresh(); toast('Settings reset.'); } };
const relab = (sw, t) => { const r = sw.closest('.qs-row'); if (!r) return; const b = r.querySelector('.qs-tx b'), s = r.querySelector('.qs-tx small'); if (b) b.textContent = t; if (s) s.textContent = DS[t] ? DS[t] : ''; sw.setAttribute('aria-label', t); }; const flipT = async (sw, k) => { const on = sw.getAttribute('aria-checked') !== 'true'; if (k === 'sync') { if (!window.QBAPI) return; await window.QBAPI.toggleSync(); sw.setAttribute('aria-checked', String(window.QBAPI.syncOn())); relab(sw, window.QBAPI.syncOn() ? 'Synced' : 'Unsynced'); return; } if (k === 'enc') { if (window.QBAPI) window.QBAPI.setEnc(on); } else set(k, k === 'motion' ? (on ? '0' : '1') : (on ? '1' : '0')); sw.setAttribute('aria-checked', String(on)); if (k === 'enc') relab(sw, on ? 'Encrypted' : 'Decrypted'); };
const wire = () => { root.addEventListener('click', (e) => { const t = e.target; const sp = t.closest('[data-sp]'); if (sp) { const s = spEl(), k = s.dataset.k; if (k === 'theme') setTheme(sp.dataset.sp); else set(k, sp.dataset.sp); spClose(); refresh(); return; } if (t.closest('[data-spx]')) { spClose(); return; } const r = t.closest('.qs-row[data-tr]'); if (r) { const sw = r.querySelector('.qb-sw'); if (sw) flipT(sw, r.dataset.tr); return; } const n = t.closest('[data-nav]'); if (n) { showCat(n.dataset.nav); return; } const a = t.closest('[data-do]'); if (!a) return; const fn = A[a.dataset.do]; if (fn) fn(a); }); root.addEventListener('change', (e) => { const s = e.target.closest('select[data-k]'); if (!s) return; if (s.dataset.k === 'theme') setTheme(s.value); else set(s.dataset.k, s.value); const v = s.parentNode.querySelector('.qs-v'); if (v) v.textContent = s.options[s.selectedIndex].text; }); root.addEventListener('input', (e) => { const r = e.target.closest('input[data-r]'); if (!r) return; set(r.dataset.r, r.value); const v = r.parentNode.querySelector('.qs-pc'); if (v) v.textContent = r.value + '%'; }); root.addEventListener('pointerdown', (e) => { const p = $('.qs-pop', root); if (!p || p.hidden) return; if (e.target.closest('.qs-pop') || e.target.closest('.qs-info')) return; p.hidden = true; const b = $('.qs-info', root); if (b) b.setAttribute('aria-expanded', 'false'); }); };
const open = () => { if (root) return; last = document.activeElement; root = document.createElement('div'); root.className = 'qs'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Settings'); try { new Image().src = 'Sources/Videos/Qasthra_outro.gif'; } catch (e) {} root.dataset.v = 'main'; root.innerHTML = build(); document.body.appendChild(root); html.classList.add('qs-open'); const a = document.getElementById('app'); if (a) a.inert = true; wire(); wireAcc(); showCat(cat); U = null; paint(); load(); const b = $('.qs-back', root); if (b) b.focus(); }; document.addEventListener('keydown', (e) => { if (e.key !== 'Escape' || !root) return; if (document.querySelector('.pop')) return; const sp0 = spEl(); if (sp0 && !sp0.hidden) { sp0.hidden = true; return; } const ip = $('.qs-pop', root); if (ip && !ip.hidden) { ip.hidden = true; return; } if (root.dataset.v === 'acc') { accReset(); root.dataset.v = 'main'; return; } close(); }); window.addEventListener('hashchange', close); window.addEventListener('qprof', () => { if (root) load(); }); window.QSET = { open: open, close: close, get: get, vol: () => Math.max(0, Math.min(1, (Number(get('vol')) || 0) / 100)) };
})();
(() => { const CHK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'; const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + ';'); let sheet = null, from = null; const close = () => { if (sheet) { sheet.remove(); sheet = null; } const f = from; from = null; if (f && f.focus) { try { f.focus({ preventScroll: true }); } catch (e) {} } }; const shown = (s) => { const o = s.options[s.selectedIndex]; return o && o.value !== '' ? o.text : ''; }; const paint = (b, s) => { const t = shown(s); b.firstChild.textContent = t ? t : s.options[0].text; b.classList.toggle('qd-ph', !t); }; const open = (b, s) => { close(); from = b; const lb = s.closest('.cs-f'); const sp = lb ? lb.querySelector('span') : null; const title = s.getAttribute('aria-label') ? s.getAttribute('aria-label') : (sp ? sp.textContent.replace(/\s*\*\s*$/, '').trim() : 'Choose'); sheet = document.createElement('div'); sheet.className = 'qs-sh'; sheet.innerHTML = '<div class="qs-sh-bd" data-qx="1"></div><div class="qs-sh-p" role="dialog" aria-modal="true"><h4 class="qs-sh-t"></h4><div class="qs-sh-c"><div class="qs-op-l" role="listbox"></div></div></div>'; sheet.querySelector('.qs-sh-t').textContent = title; const cur = s.value; sheet.querySelector('.qs-op-l').innerHTML = Array.from(s.options).filter((o) => o.value !== '').map((o) => '<button class="qs-op" type="button" role="option" data-v="' + esc(o.value) + '" aria-selected="' + (o.value === cur) + '"><span>' + esc(o.text) + '</span>' + CHK + '</button>').join(''); sheet.addEventListener('click', (e) => { if (e.target.closest('[data-qx]')) { close(); return; } const x = e.target.closest('.qs-op'); if (!x) return; s.value = x.dataset.v; s.dispatchEvent(new Event('change', { bubbles: true })); s.dispatchEvent(new Event('input', { bubbles: true })); close(); }); document.body.appendChild(sheet); const on = sheet.querySelector('.qs-op[aria-selected="true"]'); if (on) on.scrollIntoView({ block: 'center' }); }; const enhance = (s) => { if (s.dataset.qd) return; s.dataset.qd = '1'; const b = document.createElement('button'); b.type = 'button'; b.className = 'qd-b'; b.setAttribute('aria-haspopup', 'dialog'); b.innerHTML = '<span></span>'; s.classList.add('qd-n'); s.tabIndex = -1; s.setAttribute('aria-hidden', 'true'); s.before(b); const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value'); Object.defineProperty(s, 'value', { configurable: true, get() { return d.get.call(s); }, set(v) { d.set.call(s, v); paint(b, s); } }); s.addEventListener('change', () => paint(b, s)); b.addEventListener('click', () => open(b, s)); paint(b, s); }; const scan = () => { document.querySelectorAll('.au-setup select').forEach(enhance); }; let sq = 0; new MutationObserver(() => { if (sq) return; sq = 1; requestAnimationFrame(() => { sq = 0; scan(); }); }).observe(document.body, { childList: true, subtree: true }); scan(); document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet) close(); }); window.addEventListener('hashchange', close); })();
(() => { const h = document.documentElement; const wrap = (obj, name) => { const f = obj[name]; if (typeof f !== 'function') return; obj[name] = function (a, b) { if (h.dataset.motion === 'reduce' && a && typeof a === 'object') a = Object.assign({}, a, { behavior: 'auto' }); return f.call(this, a, b); }; }; wrap(Element.prototype, 'scrollIntoView'); wrap(Element.prototype, 'scrollTo'); wrap(Element.prototype, 'scrollBy'); wrap(window, 'scrollTo'); wrap(window, 'scrollBy'); })();
document.addEventListener('input', (e) => { const i = e.target; if (!i.classList.contains('qb-fs')) return; const b = i.closest('.qb-sheet'); if (!b) return; const q = i.value.trim().toLowerCase(); b.querySelectorAll('.qb-item').forEach((x) => { x.hidden = !!q && x.textContent.toLowerCase().indexOf(q) < 0; }); b.querySelectorAll('.qb-cap').forEach((c) => { let n = c.nextElementSibling, any = false; while (n && !n.classList.contains('qb-cap')) { if (n.matches('.qb-item:not([hidden])') || n.querySelector('.qb-item:not([hidden])')) any = true; n = n.nextElementSibling; } c.hidden = !any; }); });
;(function(){var P={},DB=function(){return window.db},ROOT='https://hwffsxhonbymzwomhoyd.supabase.co/storage/',VIS=[['everyone','Everyone'],['partners','Partners only'],['nobody','Only me']],WHY=[['spam','Spam'],['harassment','Harassment'],['impersonation','Impersonation'],['inappropriate','Inappropriate content'],['other','Other']];
var ICO={full_name:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6.5 16c.5-1.5 1.5-2 2.5-2s2 .5 2.5 2M14 10h4M14 14h4"/>',birthday:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',recovery_email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',address_home:'<path d="M4 11l8-7 8 7M6 10v10h12V10"/>',address_work:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 13h18"/>',gender:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',sex:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',language:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'};
var INF=[['full_name','Full name'],['birthday','Birthday'],['recovery_email','Email'],['phone','Phone'],['address_home','Home address'],['address_work','Work address'],['gender','Gender'],['sex','Sex'],['language','Language']];
function shown(d,k){var v=(d.info&&d.info[k])||(d.um&&d.um[k])||'';return !!v&&v!=='Prefer not to say'}function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function cln(s,n){return String(s||'').replace(/[\u0000-\u001f\u007f<>{}\[\]`]/g,' ').replace(/\s+/g,' ').trim().slice(0,n)}
function ok(u){return u&&u.indexOf(ROOT)===0&&!/["'()\s]/.test(u)?u:''}
function ini(n){return String(n).trim().split(/\s+/).slice(0,2).map(function(w){return w.charAt(0).toUpperCase()}).join('')||'?'}
function crop(f,w,h){return new Promise(function(res,rej){var u=URL.createObjectURL(f),i=new Image();i.onload=function(){var c=document.createElement('canvas'),x=c.getContext('2d'),s=Math.max(w/i.width,h/i.height),dw=i.width*s,dh=i.height*s;c.width=w;c.height=h;x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(i,(w-dw)/2,(h-dh)/2,dw,dh);URL.revokeObjectURL(u);c.toBlob(function(b){b?res(b):rej()},'image/jpeg',0.85)};i.onerror=function(){URL.revokeObjectURL(u);rej()};i.src=u})}
async function put(bk,uid,blob){var p=uid+'/'+bk+'.jpg',r=await DB().storage.from(bk).upload(p,blob,{upsert:true,contentType:'image/jpeg'});if(r.error)throw r.error;return DB().storage.from(bk).getPublicUrl(p).data.publicUrl+'?v='+Date.now()}
var CAM='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';
function sheet(title,body,onSave){var ov=mk('div','pfx-ov'),sh=mk('div','pfx-sh'),hd=mk('div','pfx-hd'),cx=mk('button','pfx-link','Cancel'),sv=mk('button','pfx-link pfx-sv','Save');ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label',title);cx.type='button';sv.type='button';
function shut(){window.removeEventListener('keydown',esc,true);ov.remove()}
function esc(e){if(e.key==='Escape'){e.stopPropagation();shut()}}
cx.onclick=shut;ov.addEventListener('click',function(e){if(e.target===ov)shut()});window.addEventListener('keydown',esc,true);
hd.appendChild(cx);hd.appendChild(mk('b','pfx-tt',title==='Edit profile'?'':title));if(onSave){sv.onclick=function(){if(sv.disabled)return;onSave(shut,sv)};hd.appendChild(sv);ov._sv=sv}else hd.appendChild(mk('span'));
sh.appendChild(hd);sh.appendChild(body);ov.appendChild(sh);document.body.appendChild(ov);var f=body.querySelector('input,textarea,button');if(f)f.focus();return shut}
function field(label,el){var w=mk('label','pfx-fl');w.appendChild(mk('span','',label));w.appendChild(el);return w}
function pick(val){var s=mk('select','pfx-fi');VIS.forEach(function(o){var n=mk('option','',o[1]);n.value=o[0];if(o[0]===val)n.selected=true;s.appendChild(n)});return s}
function editForm(d,done){var body=mk('div','pfx-form'),st={},cv=mk('div','pfx-ecv'),av=mk('div','pfx-eav'),msg=mk('p','pfx-msg'),ni=mk('input','pfx-fi'),bi=mk('textarea','pfx-fi'),cn=mk('span','pfx-cnt'),sa=pick(d.show_age),sp=pick(d.show_partners),nm=d.display_name||d.username||'User';
function paint(){var c=st.cover?st.cover.url:ok(d.cover_url),a=st.avatar?st.avatar.url:ok(d.avatar_url);cv.style.backgroundImage=c?'url("'+c+'")':'';av.style.backgroundImage=a?'url("'+a+'")':'';av.firstChild.innerHTML=a?'':'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5z"/></svg>'}
function cam(par,kind,w,h){var b=mk('button','pfx-ecam'),f=document.createElement('input');b.type='button';b.innerHTML=CAM;b.setAttribute('aria-label','Change '+kind);f.type='file';f.accept='.jpg,.jpeg,.png,image/jpeg,image/png';f.hidden=true;b.onclick=function(){var bd=mk('div','pfx-form'),sh;[['Local','Files on this device'],['Cloud','Drive, Dropbox and other cloud apps']].forEach(function(o){var x=mk('button','btn btn-second pfx-b pfx-src',o[0]);x.type='button';x.onclick=function(){sh();f.click()};x.appendChild(mk('small','',o[1]));bd.appendChild(x)});var has=st[kind]?!st[kind].gone:!!ok(kind==='cover'?d.cover_url:d.avatar_url);if(has){var rm=mk('button','btn btn-second pfx-b pfx-rm','Remove');rm.type='button';rm.onclick=function(){st[kind]={gone:true};sh();msg.textContent='';paint();if(window.QPFCHK)window.QPFCHK()};bd.appendChild(rm)}sh=sheet('Choose from',bd)};f.onchange=async function(){var x=f.files&&f.files[0];if(!x)return;if(['image/jpeg','image/png'].indexOf(x.type)<0||['jpg','jpeg','png'].indexOf(x.name.toLowerCase().split('.').pop())<0){f.value='';msg.textContent='Only PNG and JPG images are allowed.';return}if(x.size>8000000){msg.textContent='Image is too big (max 8 MB).';return}try{var bl=await crop(x,w,h);st[kind]={blob:bl,url:URL.createObjectURL(bl)};msg.textContent='';paint();if(window.QPFCHK)window.QPFCHK()}catch(e){msg.textContent='That image could not be read.'}};par.appendChild(b);par.appendChild(f)}
av.appendChild(mk('span'));cam(cv,'cover',1200,400);cam(av,'avatar',512,512);cv.appendChild(av);paint();
ni.value=d.display_name||'';ni.maxLength=40;ni.placeholder='Name';bi.value=d.bio||'';bi.maxLength=260;bi.rows=4;bi.placeholder='Bio';cn.textContent=bi.value.length+'/260';bi.oninput=function(){cn.textContent=bi.value.length+'/260'};
body.appendChild(cv);body.appendChild(ni);void(0&&mk('p','pfx-hint','@'+(d.username||'')+' cannot be changed here.'));body.appendChild(bi);body.appendChild(cn);body.appendChild(field('Age',sa));body.appendChild(field('Partners',sp));body.appendChild(mk('div','pfx-gap'));var iv={};INF.forEach(function(o){iv[o[0]]=pick((d.info_vis&&d.info_vis[o[0]])||'nobody');if(shown(d,o[0]))body.appendChild(field(o[1],iv[o[0]]))});body.appendChild(msg);
var ni0=ni.value,bi0=bi.value,v0=[sa.value,sp.value];INF.forEach(function(o){v0.push(iv[o[0]].value)});var chk=function(){var ov=body.closest('.pfx-ov'),b=ov?ov._sv:null;if(!b)return;var ch=ni.value.trim()!==ni0.trim();if(bi.value!==bi0)ch=true;if(sa.value!==v0[0])ch=true;if(sp.value!==v0[1])ch=true;INF.forEach(function(o,n){if(iv[o[0]].value!==v0[n+2])ch=true});if(st.cover)ch=true;if(st.avatar)ch=true;b.disabled=!ch};window.QPFCHK=chk;body.addEventListener('input',chk);body.addEventListener('change',chk);setTimeout(chk,0);sheet('Edit profile',body,async function(shut,sv){var n=cln(ni.value,40);if(!n){msg.textContent='Add a name first.';return}sv.disabled=true;msg.textContent='Saving...';try{var o={display_name:n,bio:cln(bi.value,260)||null,show_age:sa.value,show_partners:sp.value,info_vis:(function(){var vv={};INF.forEach(function(x){vv[x[0]]=iv[x[0]].value});return vv})()};if(st.cover)o.cover_url=st.cover.gone?null:await put('covers',d.id,st.cover.blob);if(st.avatar)o.avatar_url=st.avatar.gone?null:await put('avatars',d.id,st.avatar.blob);var r=await DB().from('profiles').update(o).eq('id',d.id);if(r.error)throw r.error;try{await window.db.auth.updateUser({data:{full_name:n,bio:cln(bi.value,260)||null}})}catch(e){}try{window.dispatchEvent(new Event('qprof'))}catch(e){}shut();done()}catch(e){sv.disabled=false;msg.textContent='Could not save. Try again.'}})}
P.mount=async function(host,uname,miss){var page=mk('div','pfx'),d=null;host.appendChild(page);var ld=mk('img','pfx-ld');ld.src=window.QGIF?window.QGIF.url('Sources/Videos/Qasthra.gif'):'Sources/Videos/Qasthra.gif';ld.alt='Loading';page.appendChild(ld);
function note(t){var m=page.querySelector('.pfx-note');if(m)m.textContent=t||''}
async function act(fn,args,okm){note('...');var r=await DB().rpc(fn,args);if(r.error){note('Something went wrong. Try again.');return}await load();note(okm||'')}
function bt(t,c,fn){var b=mk('button','btn '+c+' pfx-b',t);b.type='button';b.onclick=fn;return b}
var SV='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',IC_PEN='<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',IC_SHR=SV+'<circle cx="6.4" cy="12" r="2.8" fill="currentColor" stroke="none"/><circle cx="17.6" cy="6.2" r="2.8" fill="currentColor" stroke="none"/><circle cx="17.6" cy="17.9" r="2.8" fill="currentColor" stroke="none"/><path d="M6.4 12L17.6 6.2M6.4 12l11.2 5.9"/></svg>',IC_WARN=SV+'<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.01"/></svg>',IC_PLUS=SV+'<path d="M12 5v14M5 12h14"/></svg>',IC_MINUS=SV+'<path d="M5 12h14"/></svg>';
function tb(c,l,s,f){var b=mk('button','pfx-tb '+c);b.type='button';b.setAttribute('aria-label',l);b.innerHTML=s;b.onclick=f;return b}
async function share(nm){var t=nm+' (@'+(d.username||'')+') on Qasthra. Search @'+(d.username?d.username:'')+' in the dashboard.';t='@'+(d.username||'');try{await navigator.clipboard.writeText(t)}catch(e){try{var x=document.createElement('textarea');x.value=t;x.style.cssText='position:fixed;opacity:0';document.body.appendChild(x);x.select();document.execCommand('copy');x.remove()}catch(e2){note('Could not copy.')}}}
function reportSheet(){var body=mk('div','pfx-form'),shut;body.appendChild(mk('p','pfx-hint','Why are you reporting @'+(d.username||'')+'?'));WHY.forEach(function(o){var x=bt(o[1],'btn-second',async function(){x.disabled=true;var r=await DB().from('profile_reports').insert({reported:d.id,reason:o[0]});shut();note(r.error?(r.error.code==='23505'?'You already reported this profile.':'Report failed. Try again.'):'Report sent. Thank you.')});body.appendChild(x)});shut=sheet('Report',body)}
function fin(el,s){el.textContent='';var b='';s.forEach(function(k){if(k.i){if(b){el.appendChild(document.createTextNode(b));b=''}var w=mk('span','pfx-ic');w.innerHTML=k.i;el.appendChild(w)}else b+=k.c});if(b)el.appendChild(document.createTextNode(b))}function widths(el,s){var b=mk('span','pfx-mb');el.appendChild(b);s.forEach(function(k){var t=mk('span','pfx-m');if(k.i)t.innerHTML=k.i;else t.textContent=k.c;b.appendChild(t)});var w=Array.prototype.map.call(b.children,function(t){return t.getBoundingClientRect().width});b.remove();return w}function slotsOf(x){var s=[];if(x.i){s.push({i:x.i});s.push({c:' '})}Array.from(String(x.t)).forEach(function(c){s.push({c:c})});return s}function rowsNow(){var r=[],ic=function(p){return SV+p+'</svg>'},src=d.info||d.um;if(d.age!=null)r.push({i:ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),t:d.age+(d.age===1?' Year old':' Years old')});if(d.partners_count!=null)r.push({i:ic('<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M18 14c2 .8 3 2.7 3 6"/>'),t:d.partners_count+' Partners'});if(src)INF.forEach(function(o){var v=src[o[0]];if(o[0]==='full_name')return;if(!v||v==='Prefer not to say')return;if(o[0]==='birthday'){var dt=new Date(v+'T00:00:00');if(!isNaN(dt))v=dt.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})}r.push({i:ic(ICO[o[0]]||''),t:String(v)})});return r}function morph(el,a,b){return new Promise(function(done){var wa=widths(el,a),wb=widths(el,b),sp=widths(el,[{c:' '}])[0],N=Math.max(a.length,b.length),S=Math.min(420,Math.max(120,N*12)),D=300,an=[];el.textContent='';for(var i=0;i<N;i++){var o=a[i],n=b[i],s=mk('span','pfx-s'),oe=null,ne=null;if(o){oe=mk('span','pfx-o');if(o.i)oe.innerHTML=o.i;else oe.textContent=o.c;s.appendChild(oe)}if(n){ne=mk('span','pfx-n');if(n.i)ne.innerHTML=n.i;else ne.textContent=n.c;s.appendChild(ne)}s.style.width=(o?wa[i]:0)+'px';el.appendChild(s);var op={duration:D,delay:Math.round(i/N*S),fill:'both',easing:'cubic-bezier(.2,.8,.2,1)'};an.push(s.animate([{width:(o?wa[i]:0)+'px'},{width:sp+'px',offset:.35},{width:(n?wb[i]:0)+'px'}],op));if(oe)an.push(oe.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.4)',offset:.35},{opacity:0,transform:'scale(.4)'}],op));if(ne)an.push(ne.animate([{opacity:0,transform:'scale(.4)'},{opacity:0,transform:'scale(.4)',offset:.35},{opacity:1,transform:'scale(1)'}],op))}Promise.all(an.map(function(x){return x.finished})).then(function(){done()},function(){done()})})}function bioCycle(bp){return cyc3(bp)}function cyc3(bp){if(!bp)return;var k=page._k,rs=rowsNow().filter(function(r){return !/Years? old$/.test(r.t)&&!/ Partners$/.test(r.t)}),bt=d.bio?d.bio:'',st=mk('div','pfx-stat');if(d.age!=null)st.appendChild(mk('span','',d.age+(d.age===1?' Year old':' Years old')));if(d.partners_count!=null){var pc=mk('span');pc.appendChild(document.createTextNode('Partners: '));pc.appendChild(mk('b','',String(d.partners_count)));st.appendChild(pc)}if(st.children.length)bp.after(st);if(!rs.length){if(bt)bp.textContent=bt;else bp.remove();return}var mk1=function(r){var s=mk('span','pfx-it');if(r.i){var e=mk('span','pfx-ic');e.innerHTML=r.i;s.appendChild(e)}s.appendChild(document.createTextNode(r.t));return s};bp.textContent=bt;var h=bp.offsetHeight;bp.textContent='';rs.forEach(function(r){bp.appendChild(mk1(r))});bp.textContent=bt;var fit=function(f){var a=bp.offsetHeight;f();var b=bp.offsetHeight;if(mot()&&a!==b){bp.style.overflow='hidden';bp.animate([{height:a+'px'},{height:b+'px'}],{duration:300,easing:'ease'}).finished.catch(function(){}).then(function(){bp.style.overflow=''})}};var alive=function(){return page._k===k&&document.contains(bp)},mot=function(){return document.documentElement.dataset.motion!=='reduce'&&!false},sleep=function(ms){return new Promise(function(z){page._t=setTimeout(z,ms)})},an=function(el,a,b,ms){return el.animate([a,b],{duration:ms,easing:'ease',fill:'forwards'}).finished.catch(function(){})};(async function(){for(;;){await sleep(3000);if(!alive())return;if(document.hidden)continue;if(document.querySelector('.pfx-ov'))continue;if(mot())await an(bp,{opacity:1},{opacity:0},300);if(!alive())return;bp.getAnimations().forEach(function(a){a.cancel()});fit(function(){bp.textContent='';bp.appendChild(mk1(rs[0]))});await sleep(1200);if(!alive())return;for(var i=1;i<rs.length;i++){var el=mk1(rs[i]);bp.appendChild(el);if(mot())an(el,{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'},400);await sleep(1200);if(!alive())return}await sleep(2000);if(!alive())return;if(mot())await an(bp,{opacity:1},{opacity:0},300);bp.getAnimations().forEach(function(a){a.cancel()});fit(function(){bp.textContent=bt});if(mot())await an(bp,{opacity:0},{opacity:1},300)}})()}function cycOld(bp){if(!bp)return;var k=page._k,items=[],rs=rowsNow().filter(function(r){return !/Years? old$/.test(r.t)&&!/ Partners$/.test(r.t)});if(d.bio)items.push({c:d.bio});rs.forEach(function(r){items.push(r)});var st=mk('div','pfx-stat');if(d.age!=null)st.appendChild(mk('span','',d.age+(d.age===1?' Year old':' Years old')));if(d.partners_count!=null){var pc=mk('span');pc.appendChild(document.createTextNode('Partners: '));pc.appendChild(mk('b','',String(d.partners_count)));st.appendChild(pc)}if(st.children.length)bp.after(st);if(!items.length){bp.remove();return}var show=function(it){bp.textContent='';var w=mk('span','pfx-slide');if(it.c!=null)w.textContent=it.c;else{if(it.i){var e=mk('span','pfx-ic');e.innerHTML=it.i;w.appendChild(e);w.appendChild(document.createTextNode(' '))}w.appendChild(document.createTextNode(it.t))}bp.appendChild(w);return w},h=0;items.forEach(function(it){show(it);h=Math.max(h,bp.offsetHeight)});bp.style.minHeight=h+'px';var cur=show(items[0]);if(items.length<2)return;var alive=function(){return page._k===k&&document.contains(bp)},mot=function(){return document.documentElement.dataset.motion!=='reduce'&&!false},sleep=function(ms){return new Promise(function(z){page._t=setTimeout(z,ms)})},an=function(el,a,b){return el.animate([a,b],{duration:300,easing:'ease',fill:'forwards'}).finished.catch(function(){})};(async function(){var n=0;for(;;){await sleep(3000);if(!alive())return;if(document.hidden||document.querySelector('.pfx-ov'))continue;if(mot()){await an(cur,{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'});if(!alive())return}n=(n+1)%items.length;cur=show(items[n]);if(mot())await an(cur,{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'})}})()}function bioOld(bp){if(!bp)return;var rs=rowsNow();if(!rs.length)return;if(!d.bio){var al=[];rs.forEach(function(r,n){if(n){al.push({c:' '});al.push({c:' '})}slotsOf(r).forEach(function(s){al.push(s)})});fin(bp,al);return}var k=page._k,bio=Array.from(d.bio||'').map(function(c){return{c:c}}),alive=function(){return page._k===k&&document.contains(bp)},mot=function(){return document.documentElement.dataset.motion!=='reduce'&&!false},sleep=function(ms){return new Promise(function(z){page._t=setTimeout(z,ms)})},swap=function(a,b){return mot()?morph(bp,a,b).then(function(){fin(bp,b)}):Promise.resolve(fin(bp,b))};(async function(){for(;;){await sleep(5000);if(!alive())return;if(document.hidden||document.querySelector('.pfx-ov'))continue;bp.style.minHeight=bp.getBoundingClientRect().height+'px';var all=[];rs.forEach(function(r,n){if(n){all.push({c:' '});all.push({c:' '})}slotsOf(r).forEach(function(s){all.push(s)})});await swap(bio,all);if(!alive())return;await sleep(1500);if(!alive())return;await swap(all,bio);if(!alive())return;bp.style.minHeight=''}})()}function draw(){clearTimeout(page._t);page._k=(page._k||0)+1;page.innerHTML='';var pmb=null,who=mk('div','pfx-who'),cv=mk('div','pfx-cv'),bd=mk('div','pfx-bd'),inn=mk('div','pfx-in'),av=mk('div','pfx-av'),ac=mk('div','pfx-act'),nm=d.display_name||d.username||'User',cu=ok(d.cover_url),au=ok(d.avatar_url);
if(cu)cv.style.backgroundImage='url("'+cu+'")';if(au)av.style.backgroundImage='url("'+au+'")';else av.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5z"/></svg>';
if(d.is_owner){page.appendChild(tb('pfx-tl','Share profile',IC_SHR,function(){share(nm)}));if(!uname)page.appendChild(tb('pfx-tr','Edit profile',IC_PEN,function(){editForm(d,load)}))}
else{var rl=d.relation,pm=null;page.appendChild(tb('pfx-tl','Share profile',IC_SHR,function(){share(nm)}));page.appendChild(tb('pfx-tr','Report profile',IC_WARN,reportSheet));if(rl==='none')pm=['+','Add partner',function(){act('partner_request',{t:d.id},'Request sent.')}];if(rl==='pending_out')pm=['-','Cancel request',function(){if(confirm('Cancel this request?'))act('partner_remove',{t:d.id})}];
if(rl==='pending_in')pm=['+','Accept request',function(){if(confirm('Accept this partner request?'))act('partner_respond',{t:d.id,accept:true},'You are now partners.');else if(confirm('Decline it instead?'))act('partner_respond',{t:d.id,accept:false})}];
if(rl==='partners')pm=['-','Remove partner',function(){if(confirm('Remove this partner?'))act('partner_remove',{t:d.id})}];if(pm){var pb=mk('button','pfx-pm');pb.type='button';pb.setAttribute('aria-label',pm[1]);pb.innerHTML=pm[0]==='+'?IC_PLUS:IC_MINUS;pb.onclick=pm[2];pmb=pb}}
inn.appendChild(av);inn.appendChild(ac);inn.appendChild(who);who.appendChild(mk('h2','pfx-un','@'+(d.username||'')));who.appendChild(mk('p','pfx-nm',shown(d,'full_name')?(d.info&&d.info.full_name?d.info.full_name:d.um.full_name):'Unknown'));if(pmb)inn.appendChild(pmb);var bp=null;if(d.bio||rowsNow().length){bp=mk('p','pfx-bio',d.bio||'');inn.appendChild(bp)}
if(d.age!=null||d.partners_count!=null){var mt=mk('div','pfx-meta');if(d.age!=null)mt.appendChild(mk('span','',d.age+(d.age===1?' Year old':' Years old')));if(d.partners_count!=null){var sb=mk('span');sb.appendChild(mk('b','',String(d.partners_count)));sb.appendChild(document.createTextNode(' Partners'));mt.appendChild(sb)}mt=null}

if(d.info){var il=mk('dl','pfx-info');INF.forEach(function(o){var v=d.info[o[0]];if(!v||v==='Prefer not to say')return;if(o[0]==='birthday'){var dt=new Date(v+'T00:00:00');if(!isNaN(dt))v=dt.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})}var row=mk('div','pfx-ir'),ic=mk('span','pfx-ii');ic.innerHTML=SV+(ICO[o[0]]||'')+'</svg>';row.appendChild(ic);row.appendChild(mk('dt','pfx-sr',o[1]));row.appendChild(mk('dd','',v));il.appendChild(row)});if(il.children.length)il=null}inn.appendChild(mk('p','pfx-note'));bd.appendChild(inn);page.appendChild(cv);page.appendChild(bd);bioCycle(bp)}
async function load(){var r=await DB().rpc('get_profile',{u:uname||''});if(r.error||!r.data){page.innerHTML='';if(miss){var m0=miss;miss=null;m0();return}page.appendChild(mk('p','pfx-msg pfx-load','Profile not found.'));return}d=r.data;if(d.is_owner){try{var ss=await DB().auth.getSession();d.um=ss.data.session.user.user_metadata||{}}catch(e){d.um={}}}draw();if(d.is_owner)P.card(true)}
await load();};
P.reset=function(){P.ca=P.cc=P.cd=P.ct=0;P.busy=0;var r=document.querySelector('.qs'),av=r&&r.querySelector('.qs-av'),ct=r&&r.querySelector('.qs-ct');if(av){av.style.backgroundImage='';av.classList.remove('has-img')}if(ct){ct.style.backgroundImage='';ct.classList.remove('has-cv')}};(function w(){var lu=null;if(window.db&&window.db.auth){window.db.auth.onAuthStateChange(function(e,s){var id=s&&s.user?s.user.id:null;if(e==='SIGNED_OUT'){lu=null;P.reset()}else if(id&&lu&&id!==lu){P.reset()}if(id)lu=id})}else setTimeout(w,400)})();P.card=async function(f){var r=document.querySelector('.qs'),ct=r&&r.querySelector('.qs-ct'),av=r&&r.querySelector('.qs-av');if(!ct||!av)return;var sc='color-mix(in srgb,var(--bg) 74%,transparent)',pre=function(u){return new Promise(function(z){if(!u){z('');return}var i=new Image(),t=setTimeout(function(){z('')},10000);i.onload=function(){clearTimeout(t);z(u)};i.onerror=function(){clearTimeout(t);z('')};i.src=u})},ap=function(){var a=P.ca,c=P.cc;av.style.backgroundImage=a?'url("'+a+'")':'';av.classList.toggle('has-img',!!a);ct.style.backgroundImage=c?'linear-gradient('+sc+','+sc+'),url("'+c+'")':'';ct.classList.toggle('has-cv',!!c);av.classList.remove('ld');ct.classList.remove('ld')};if(P.cd&&!f){ap();if(Date.now()-P.ct<5000)return}else{if(P.busy&&!f)return;P.busy=1;av.classList.add('ld');ct.classList.add('ld')}P.ct=Date.now();var t0=Date.now();try{var x=DB()?await DB().rpc('get_profile',{u:''}):null;if(x&&!x.error&&x.data){P.ca=ok(x.data.avatar_url);P.cc=ok(x.data.cover_url);var pp=await Promise.all([pre(P.ca),pre(P.cc)]);P.ca=pp[0];P.cc=pp[1];var w=200-(Date.now()-t0);if(w>0)await new Promise(function(z){setTimeout(z,w)});P.cd=1}}catch(e){}P.busy=0;if(document.body.contains(ct))ap()};
P.open=function(u){if(document.querySelector('.qs-pf'))return;var p=mk('div','qs-pf'),b=mk('button','qs-pf-x');p.setAttribute('role','dialog');p.setAttribute('aria-modal','true');p.setAttribute('aria-label','Profile');b.type='button';b.setAttribute('aria-label','Back');b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';b.onclick=function(){p.remove()};p.appendChild(b);document.body.appendChild(p);P.mount(p,u)};
window.QPROF=P})();
(() => { const home = () => !location.hash || location.hash === '#'; window.addEventListener('hashchange', () => { if (!home() || !window.db) return; window.db.auth.getSession().then((r) => { if (r && r.data && r.data.session && home() && !window.QBLOCK) location.replace('#dashboard'); }).catch(() => {}); }); })();
(() => { const H = document.documentElement; let busy = false, at = 0; const hint = () => { try { return Object.keys(localStorage).some((k) => /auth-token/i.test(k)); } catch (e) { return false; } }; const gone = (e) => !!e && (e.status === 403 || e.status === 404 || /user_not_found|user.*not.*exist/i.test(String(e.code || '') + ' ' + String(e.message || ''))); const wipe = async () => { H.classList.add('qx'); try { await window.db.auth.signOut({ scope: 'local' }); } catch (e) {} try { ['hist', 'saved', 'worlds', 'outbox'].forEach((k) => localStorage.removeItem('qb:' + k)); localStorage.removeItem('qs:owner'); } catch (e) {} try { if (window.caches) { for (const k of await caches.keys()) await caches.delete(k); } } catch (e) {} location.replace(location.pathname + location.search); }; const check = async (force) => { if (busy || window.QBLOCK || !window.db || !window.db.auth || !hint() || navigator.onLine === false) return; if (!force && Date.now() - at < 15000) return; busy = true; at = Date.now(); try { const s = await window.db.auth.getSession(); if (s && s.data && !s.data.session && !s.error && hint()) { await wipe(); } else if (s && s.data && s.data.session) { const r = await window.db.auth.getUser(); if (r.error && gone(r.error)) await wipe(); } } catch (e) {} busy = false; }; setTimeout(() => check(true), 3000); setInterval(() => check(true), 180000); document.addEventListener('visibilitychange', () => { if (!document.hidden) check(false); }); window.addEventListener('online', () => check(true)); })();
(() => { const $ = (s) => document.querySelector(s); const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => '&#' + c.charCodeAt(0) + ';'); let rows = [], uid = null, ch = null, busy = false; const unread = () => rows.filter((n) => !n.read).length; const ago = (t) => { const s = Math.max(1, Math.round((Date.now() - new Date(t)) / 1000)); return s < 60 ? 'now' : s < 3600 ? Math.floor(s / 60) + 'm' : s < 86400 ? Math.floor(s / 3600) + 'h' : Math.floor(s / 86400) + 'd'; }; const item = (n) => '<div class="qn-i' + (n.read ? '' : ' un') + '" data-nid="' + esc(n.id) + '"><div class="qn-t"><b>' + esc(n.title) + '</b><span class="qn-r"><small>' + ago(n.created_at) + '</small><button type="button" class="qn-d" data-qn="d" aria-label="Delete notification"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button></span></div>' + (n.body ? '<p>' + esc(n.body) + '</p>' : '') + (n.kind === 'partner_request' && n.data && n.data.from ? '<div class="qn-a"><button type="button" class="qn-y" data-qn="y">Accept</button><button type="button" data-qn="n">Decline</button></div>' : '') + '</div>'; const html = () => '<section class="qn" data-nt aria-label="Notifications"><div class="qn-h"><h3>Notifications</h3>' + (unread() ? '<span class="qn-c">' + unread() + '</span>' : '') + (unread() ? '<button type="button" class="qn-x" data-qn="all">Mark all read</button>' : '') + '</div><div class="qn-l">' + (rows.length ? rows.map(item).join('') : '<p class="qn-e">You are all caught up.</p>') + '</div></section>'; const badge = () => { const n = unread(), t = n > 99 ? '99+' : String(n); document.querySelectorAll('.qb-gear-m').forEach((b) => { let x = b.querySelector('.qn-b'); if (!n) { if (x) x.remove(); return; } if (!x) { x = document.createElement('span'); x.className = 'qn-b'; b.appendChild(x); } if (x.textContent !== t) x.textContent = t; }); }; const draw = () => { badge(); const el = $('.qs [data-nt]'); if (!el) return; const l = el.querySelector('.qn-l'), y = l ? l.scrollTop : 0; el.outerHTML = html(); const n = $('.qs [data-nt] .qn-l'); if (n && y) n.scrollTop = y; }; const unsub = () => { if (ch) { try { window.db.removeChannel(ch); } catch (e) {} ch = null; } }; const sub = () => { unsub(); ch = window.db.channel('notifs:' + uid).on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: 'user_id=eq.' + uid }, (p) => { const n = p.new, o = p.old; if (p.eventType === 'INSERT') { if (!rows.some((x) => x.id === n.id)) rows.unshift(n); } else if (p.eventType === 'UPDATE') { rows = rows.map((x) => (x.id === n.id ? n : x)); } else if (o && o.id) rows = rows.filter((x) => x.id !== o.id); draw(); }).subscribe(); }; const load = async () => { if (!window.db || busy) return; busy = true; try { const s = await window.db.auth.getSession(), u = s.data && s.data.session ? s.data.session.user.id : null; if (!u) { rows = []; uid = null; unsub(); } else { if (u !== uid) { uid = u; sub(); } const r = await window.db.from('notifications').select('id,kind,title,body,data,read,created_at').order('created_at', { ascending: false }).limit(50); if (!r.error) rows = r.data || []; } } catch (e) {} busy = false; draw(); }; document.addEventListener('click', async (e) => { if (!window.db || !e.target.closest) return; const b = e.target.closest('[data-nt] [data-qn]'), it = e.target.closest('[data-nt] .qn-i'); if (!b) { if (it && it.classList.contains('un')) { const n = rows.find((x) => x.id === it.dataset.nid); if (n) { n.read = true; draw(); await window.db.from('notifications').update({ read: true }).eq('id', n.id); } } return; } const a = b.dataset.qn; if (a === 'd') { const n0 = rows.find((x) => x.id === it.dataset.nid); if (!n0) return; if (window.QSET && window.QSET.get('confirm') === '1' && !confirm('Delete this notification?')) return; rows = rows.filter((x) => x.id !== n0.id); draw(); await window.db.from('notifications').delete().eq('id', n0.id); return; } if (a === 'all') { rows.forEach((n) => { n.read = true; }); draw(); await window.db.from('notifications').update({ read: true }).eq('read', false); return; } const n = rows.find((x) => x.id === it.dataset.nid); if (!n || !n.data || !n.data.from) return; b.disabled = true; const r = await window.db.rpc('partner_respond', { t: n.data.from, accept: a === 'y' }); if (r.error) { b.disabled = false; return; } rows = rows.filter((x) => x.id !== n.id); draw(); await window.db.from('notifications').delete().eq('id', n.id); }, true); window.QNOTIF = { html: html, reload: load }; let q = 0; new MutationObserver(() => { if (q) return; q = 1; requestAnimationFrame(() => { q = 0; badge(); }); }).observe(document.body, { childList: true, subtree: true }); window.addEventListener('online', load); document.addEventListener('visibilitychange', () => { if (!document.hidden) load(); }); (function w() { if (window.db && window.db.auth) { window.db.auth.onAuthStateChange(() => setTimeout(load, 0)); load(); } else setTimeout(w, 400); })(); })();
(() => { const NL = String.fromCharCode(10), BADC = /[<>{}\[\]`]/g, CTRL = /[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u00ad\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\ufeff]/g, EMAIL = /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|proton\.me)$/i, PHONE = /^\+?[0-9][0-9 -]{5,18}[0-9]$/; const CONTACT = ['Account problem', 'Question', 'Partnership', 'Report abuse', 'Other'], SUPPORT = ['Bug report', 'Feature request', 'Performance issue', 'Security concern', 'Design feedback']; const one = (s, n) => String(s == null ? '' : s).replace(CTRL, ' ').replace(BADC, '').replace(/\s+/g, ' ').trim().slice(0, n).replace(/[\uD800-\uDBFF]$/, ''); const many = (s, n) => String(s == null ? '' : s).replace(/\r/g, '').replace(CTRL, '').replace(BADC, '').replace(/[ ]{2,}/g, ' ').replace(new RegExp(NL + '{3,}', 'g'), NL + NL).trim().slice(0, n).replace(/[\uD800-\uDBFF]$/, ''); const ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3 3 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>'; const btn = () => '<button class="qs-pill qs-circ" type="button" data-do="bug" aria-label="Report a bug" aria-expanded="false">' + ICON + '</button>'; const box = () => '<div class="qs-bug" hidden><input class="qs-bi" name="topic" type="text" maxlength="100" placeholder="Whats the topic?" aria-label="Topic" autocomplete="off" spellcheck="false"><textarea class="qs-bi qs-bt" name="desc" maxlength="500" placeholder="Describe..." aria-label="Description"></textarea><select class="qs-bi" name="type" aria-label="Type">' + SUPPORT.concat(CONTACT).map((t, i) => '<option' + (i === 0 ? ' selected' : '') + '>' + t + '</option>').join('') + '</select><input class="qs-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="qs-bm"><span class="qs-bc">0/500</span><button class="qs-pill qs-bs" type="button" data-bug="send">Send</button></div><p class="qs-bn" role="status" aria-live="polite"></p></div>'; window.QBUG = { btn: btn, box: box }; let busy = false; document.addEventListener('input', (e) => { const i = e.target; if (!i || !i.closest || !i.closest('.qs-bug')) return; if (i.name === 'topic' || i.name === 'desc') { const v = i.value.replace(CTRL, '').replace(BADC, ''); if (v !== i.value) i.value = v; } if (i.name === 'desc') { const c = i.closest('.qs-bug').querySelector('.qs-bc'); if (c) c.textContent = i.value.length + '/500'; } }); document.addEventListener('click', async (e) => { const t = e.target.closest ? e.target.closest('[data-do="bug"],[data-bug="send"]') : null; if (!t) return; const card = t.closest('.qs-card'), bx = card && card.querySelector('.qs-bug'); if (!bx) return; if (t.dataset.do === 'bug') { const on = bx.hidden; bx.hidden = !on; t.setAttribute('aria-expanded', String(on)); if (on) setTimeout(() => { try { bx.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (x) {} }, 30); return; } if (busy) return; const q = (s) => bx.querySelector(s), note = q('.qs-bn'), say = (m) => { note.textContent = m; }; if (q('[name="website"]').value) { say('Sent. Thank you!'); return; } const topic = one(q('[name="topic"]').value, 100), desc = many(q('[name="desc"]').value, 500), type = q('[name="type"]').value; if (topic.length < 3) { say('Add a topic of at least 3 characters.'); return; } if (desc.length < 5) { say('Describe it in at least 5 characters.'); return; } if (!window.db) { say('Connection unavailable. Try again later.'); return; } try { if (Date.now() - Number(localStorage.getItem('bg_last') || 0) < 30000) { say('Please wait a moment before sending again.'); return; } } catch (x) {} busy = true; t.disabled = true; say('Sending...'); try { let m = null; try { const s = await window.db.auth.getSession(); m = s.data && s.data.session ? s.data.session.user.user_metadata || {} : null; } catch (x) {} if (!m) { say('Sign in to send a report.'); return; } const un = one(m.username, 30), nm = one(m.full_name || m.username, 60) || 'User', em = one(m.recovery_email, 120).toLowerCase(), ph = one(m.phone, 30), okE = EMAIL.test(em), okP = PHONE.test(ph), sup = SUPPORT.indexOf(type) >= 0; if (!sup && !(okE && okP)) { say('This type needs a recovery email and phone on your account. Pick another type or add them in Edit.'); return; } const message = ((sup ? '' : 'Type: ' + type + NL) + 'Topic: ' + topic + NL + NL + desc + (un ? NL + NL + 'From: @' + un : '')).slice(0, 1000); const row = sup ? { name: nm, email: okE ? em : null, phone: okP ? ph : null, kind: type, link: null, message: message } : { name: nm, email: em, phone: ph, message: message }; const r = await window.db.from(sup ? 'support_suggestions' : 'contact_messages').insert([row]); if (r.error) throw r.error; try { localStorage.setItem('bg_last', String(Date.now())); } catch (x) {} q('[name="topic"]').value = ''; q('[name="desc"]').value = ''; q('.qs-bc').textContent = '0/500'; say('Sent. Thank you!'); setTimeout(() => { bx.hidden = true; const bb = card.querySelector('[data-do="bug"]'); if (bb) bb.setAttribute('aria-expanded', 'false'); note.textContent = ''; }, 1500); } catch (x) { say('Could not send. Try again later.'); } finally { busy = false; t.disabled = false; } }); })();
(() => { const q = (s, r) => (r || document).querySelector(s); const blank = () => { const t = q('.qb-w[aria-selected="true"] > span'); return !!t && t.textContent.trim() === 'Qasthra' && !q('.sc'); }; const drop = (el) => { if (!el || el.classList.contains('out')) return; el.classList.add('out'); setTimeout(() => { if (el.classList.contains('out')) el.remove(); }, 260); }; const sync = () => { const v = q('.qa-view'); if (!v || !q('.qb-stage', v)) return; const c = q('.wc', v), b = q('.wb', v); if (blank()) { if (c && !c.classList.contains('out')) return; if (c) c.remove(); if (b) b.remove(); const wb = document.createElement('div'); wb.className = 'wb'; wb.setAttribute('aria-hidden', 'true'); wb.innerHTML = '<span class="wr wt"><i></i></span><span class="wr wl"><i></i></span>'; v.insertBefore(wb, v.firstChild); const w = document.createElement('div'); w.className = 'wc'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Welcome'); w.innerHTML = '<div class="wc-card"><img class="wc-logo" src="Sources/Icons/Qasthra.svg" alt="" width="40" height="40"><h2 class="wc-t">Welcome to Qasthra</h2><p class="wc-d">Search by name or coordinates and move through the web one World at a time.</p><button class="btn btn-mono wc-go" type="button">Contribute</button></div>'; w.addEventListener('keydown', (e) => e.stopPropagation()); v.appendChild(w); } else { drop(c); if (!(b && !b.classList.contains('out'))) { if (b) b.remove(); const wb2 = document.createElement('div'); wb2.className = 'wb'; wb2.setAttribute('aria-hidden', 'true'); wb2.innerHTML = '<span class="wr wt"><i></i></span><span class="wr wl"><i></i></span>'; v.insertBefore(wb2, v.firstChild); } } }; let tm = 0; const later = () => { clearTimeout(tm); tm = setTimeout(sync, 30); }; new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-selected'] }); window.addEventListener('hashchange', later); later(); })();
(() => {const DOTS='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>';const cl=(t)=>Math.max(0,Math.min(1,t)),lp=(a,b,t)=>a+(b-a)*t,ez=(t)=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,mo=()=>document.documentElement.dataset.motion==='reduce'?.02:1;const run=(dur,fn)=>new Promise((res)=>{const t0=performance.now(),d=Math.max(1,dur*mo());const f=(n)=>{const p=cl((n-t0)/d);fn(p);if(p<1)requestAnimationFrame(f);else res();};requestAnimationFrame(f);});const open=async(wc)=>{const card=wc?wc.querySelector('.wc-card'):null;if(!card||card.dataset.b)return;card.dataset.b='1';const w0=card.offsetWidth,h0=card.offsetHeight,Wt=Math.max(w0,wc.clientWidth*.9),Ht=Math.max(h0,wc.clientHeight*.9);card.style.width=w0+'px';card.style.height=h0+'px';card.classList.add('go');await run(280,()=>{});await run(520,(p)=>{const e=ez(p);card.style.width=lp(w0,Wt,e)+'px';card.style.height=lp(h0,Ht,e)+'px';});card.dataset.b='2';const tab=document.createElement('div');tab.className='wk-c';tab.innerHTML='<svg class="wk-cv" viewBox="0 0 88 44" preserveAspectRatio="none" aria-hidden="true"><path class="wk-cf" d="M0 0H88A44 44 0 0 1 0 0Z"/><path class="wk-cs" d="M88 0A44 44 0 0 1 0 0"/></svg><button class="wk-dots" type="button" aria-label="Close">'+DOTS+'</button>';card.appendChild(tab);tab.querySelector('button').onclick=async()=>{if(card.dataset.b!=='2')return;card.dataset.b='3';const a=card.offsetWidth,b=card.offsetHeight;tab.remove();await run(520,(p)=>{const e=ez(p);card.style.width=lp(a,w0,e)+'px';card.style.height=lp(b,h0,e)+'px';});card.style.width='';card.style.height='';card.classList.remove('go');delete card.dataset.b;};};document.addEventListener('click',(e)=>{const b=e.target.closest?e.target.closest('.wc-go'):null;if(b)open(b.closest('.wc'));});})();
(() => { const X = '<svg class="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M4 4l6 6M15 4h5v5M20 4l-6 6M20 15v5h-5M20 20l-6-6M9 20H4v-5M4 20l6-6"/></svg>', S = '<svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h6V4M10 10L3 3M20 10h-6V4M14 10l7-7M20 14h-6v6M14 14l7 7M4 14h6v6M10 14l-7 7"/></svg>'; const gif = () => (window.QGIF ? window.QGIF.url('Sources/Videos/Qasthra.gif') : 'Sources/Videos/Qasthra.gif'); const card = (o) => { let s = o.querySelector(':scope > .sc'); Array.from(o.children).forEach((c) => { if (c !== s) c.remove(); }); if (s) return s; s = document.createElement('div'); s.className = 'sc'; s.innerHTML = '<div class="sc-card"><div class="wk-c"><svg class="wk-cv" viewBox="0 0 88 44" preserveAspectRatio="none" aria-hidden="true"><path class="wk-cf" d="M0 0H88A44 44 0 0 1 0 0Z"/><path class="wk-cs" d="M88 0A44 44 0 0 1 0 0"/></svg><button class="wk-dots sc-ex" type="button" aria-label="Expand" aria-pressed="false">' + X + S + '</button></div><div class="sc-body"></div></div>'; o.appendChild(s); requestAnimationFrame(() => requestAnimationFrame(() => { const c = s.querySelector('.sc-card'); if (c) c.classList.add('on'); })); return s; }; const body = (o) => { const b = card(o).querySelector('.sc-body'); b.textContent = ''; return b; }; window.QCARD = { open: (o, prof) => { const b = body(o); if (prof) { const p = document.createElement('div'); p.className = 'qb-pfv'; b.appendChild(p); return p; } const i = document.createElement('img'); i.className = 'qb-world-loader'; i.alt = 'Loading'; i.src = gif(); b.appendChild(i); return b; }, show: (o, t) => { const b = body(o), p = document.createElement('div'); p.className = t ? 'qb-qtext' : 'sc-err'; p.textContent = t || 'This World is empty.'; b.appendChild(p); }, err: (o) => { const b = body(o), p = document.createElement('p'), a = document.createElement('a'); p.className = 'sc-err'; p.appendChild(document.createTextNode('Error: World does not exist or is set to private, learn more at ')); a.href = '#'; a.setAttribute('data-pop', 'guidance'); a.textContent = 'Guidance & Recovery'; p.appendChild(a); p.appendChild(document.createTextNode('.')); b.appendChild(p); } }; document.addEventListener('click', (e) => { const b = e.target.closest ? e.target.closest('.sc-ex') : null; if (!b) return; const s = b.closest('.sc'), on = s.classList.toggle('full'); b.setAttribute('aria-label', on ? 'Shrink' : 'Expand'); b.setAttribute('aria-pressed', String(on)); }); document.addEventListener('keydown', (e) => { if (e.key !== 'Escape') return; const s = document.querySelector('.sc'); if (!s || document.querySelector('.pop') || document.documentElement.classList.contains('qs-open')) return; if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (s.classList.contains('full')) { s.querySelector('.sc-ex').click(); return; } const w = document.querySelector('.qb-strip .qb-w'); if (w) w.click(); }); new MutationObserver(() => { const b = document.querySelector('.sc-body'); if (b && !b.firstChild) { const s = b.closest('.sc'); if (s) s.remove(); } }).observe(document.body, { childList: true, subtree: true }); })();
