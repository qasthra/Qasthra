// Registers the service worker and re-checks for a new version whenever the app is reopened.
if ('serviceWorker' in navigator) {
  let had = !!navigator.serviceWorker.controller, calm = true, fresh = false;
  const idle = () => { calm = false; };
  ['pointerdown', 'keydown', 'touchstart'].forEach(t => window.addEventListener(t, idle, { passive: true }));
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!had) { had = true; return; }
    if (document.hidden) { location.reload(); return; }
    if (calm) { location.reload(); return; }
    fresh = true;
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(reg => {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) return;
        calm = true;
        if (fresh) { location.reload(); return; }
        reg.update().catch(() => {});
      });
    }).catch(() => {});
  });
}
