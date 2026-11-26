# Notifications: capped, scrollable, keeps scroll position on redraw
/append(style.css|@media (min-width:0px){.qn{display:flex;flex-direction:column;max-height:min(46vh,380px)}.qn-h{flex:none}.qn-l{flex:1 1 auto;min-height:0;max-height:none;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}})
/replace(script.js|const draw = () => { badge(); const el = $('.qs [data-nt]'); if (el) el.outerHTML = html(); };|const draw = () => { badge(); const el = $('.qs [data-nt]'); if (!el) return; const l = el.querySelector('.qn-l'), y = l ? l.scrollTop : 0; el.outerHTML = html(); const n = $('.qs [data-nt] .qn-l'); if (n && y) n.scrollTop = y; };)
# Sync: turning off no longer waits on cloud cleanup, ending spin starts at once
/replace(script.js|} else { syncB++; syncDraw(); const u = await who();|} else { const u = await who();)
/replace(script.js|catch (e) {} } syncB--; setTimeout(syncDraw, 350); } pop(); };|catch (e) {} } } pop(); };)
/replace(script.js|transform 1.4s cubic-bezier(.1,.55,.25,1)|transform .8s cubic-bezier(.1,.55,.25,1))
/append(style.css|@media (min-width:561px){.qb-sync{transition:color .12s ease,opacity .12s ease}})
