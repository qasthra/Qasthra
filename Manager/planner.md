# 1 hide the edit pen when a profile is opened from @username search
/replace(script.js|page.appendChild(tb('pfx-tr','Edit profile',IC_PEN,function(){editForm(d,load)}))|if(!uname)page.appendChild(tb('pfx-tr','Edit profile',IC_PEN,function(){editForm(d,load)})))
# 2 sync icon changes the moment you tap
/replace(script.js|sv('sync', st.sync); pop(); if (st.sync) {|sv('sync', st.sync); pop(); syncDraw(); if (st.sync) {)
# 3 profile save tells settings to refresh the name and profile card in place
/replace(script.js|}})}catch(e){}shut();done()|}})}catch(e){}try{window.dispatchEvent(new Event('qprof'))}catch(e){}shut();done())
/replace(script.js|window.QSET = { open: open,|window.addEventListener('qprof', () => { if (root) load(); }); window.QSET = { open: open,)
