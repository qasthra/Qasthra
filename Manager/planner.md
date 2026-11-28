# Reserved username message: add official brand note and Contact link
/replace(script.js|if (ue) { say(ue); return; }|if (ue) { say(ue); if (/reserved/.test(ue)) { note.append(' Official brand or company? Request it through '); const a = document.createElement('a'); a.href = '#contact'; a.textContent = 'Contact'; note.append(a, '.'); } return; })
/append(style.css|.au-note a{color:inherit;font-weight:700;text-decoration:underline;text-underline-offset:2px})
