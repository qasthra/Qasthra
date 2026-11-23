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
