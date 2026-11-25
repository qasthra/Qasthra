# 1 sync spins while turning off (state shows busy during the off work)
/replace(script.js|(!st.sync ? 'off' : navigator.onLine === false|(!st.sync ? (syncB > 0 ? 'busy' : 'off') : navigator.onLine === false)
/replace(script.js|if (st.sync) { await pull(); await push(); } else { const u = await who();|if (st.sync) { await pull(); await push(); } else { syncB++; syncDraw(); const u = await who();)
/replace(script.js|ob.length = 0; sv('outbox', ob); } catch (e) {} } } pop(); };|ob.length = 0; sv('outbox', ob); } catch (e) {} } syncB--; setTimeout(syncDraw, 350); } pop(); };)
# 2 sync look in desktop mode (wider than 560px): no dot, gray off, white on, spin only
/append(style.css|@media (min-width:561px){.qb-sync::after{display:none!important}.qb-sync[data-s="off"]{opacity:1;color:var(--gray)}.qb-sync[data-s="on"],.qb-sync[data-s="busy"]{color:var(--mono)}.qb-sync[data-s="err"]{color:#e5484d}})
# 3 landscape: keep content clear of camera notches (the bars themselves are hidden by fullscreen)
/append(style.css|body{padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)}.qb-dock{padding-left:max(8px,env(safe-area-inset-left,0px));padding-right:max(8px,env(safe-area-inset-right,0px))})
