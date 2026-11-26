# Background fades out with the card when Browse is tapped
/replace(style.css|.qa-view{background:url(|.wb{position:absolute;inset:0;z-index:0;pointer-events:none;transition:opacity .25s ease;background:url()
/replace(style.css|.qa-view::before|.wb::before)
/replace(style.css|.qa-view::after|.wb::after)
/replace(style.css| .qb-page.qb-qast{background:transparent}|)
/append(style.css|.wb.out{opacity:0} :root[data-motion="reduce"] .wb{transition:none})
/append(script.js|(() => { const mk = () => { const v = document.querySelector('.qa-view'); if (!v || !v.querySelector('.wc')) return false; if (v.querySelector('.wb')) return true; const b = document.createElement('div'); b.className = 'wb'; b.setAttribute('aria-hidden', 'true'); v.insertBefore(b, v.firstChild); const go = v.querySelector('.wc-go'); if (go) go.addEventListener('click', () => { b.classList.add('out'); setTimeout(() => b.remove(), 260); }); return true; }; const mo = new MutationObserver(() => { if (mk()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); mk(); })();)
