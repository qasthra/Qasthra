# sw.js: cache v5, offline Qast logo, cache-first media
/replace(sw.js|qasthra-offline-v4|qasthra-offline-v5)
/replace(sw.js|'Sources/Icons/Qasthra.svg', 'Sources/Images/Qasthra-192.png'];|'Sources/Icons/Qasthra.svg', 'Sources/Icons/Qast.svg', 'Sources/Images/Qasthra-192.png'];)
/replace(sw.js|const res = await fetch(r, { cache: 'no-cache' });|const media = u.pathname.indexOf('/Sources/') >= 0;\n      if (media) { const hit0 = await caches.match(r); if (hit0) return hit0; }\n      const res = await fetch(r, { cache: media ? 'default' : 'no-cache' });)
