# Hide the scrollbar on Settings and Account pages (still scrollable)
/append(style.css|/* ---------- settings: hidden scrollbar ---------- */\n.qs,.qs-pf,.qs-sh-c{scrollbar-width:none;-ms-overflow-style:none}\n.qs::-webkit-scrollbar,.qs-pf::-webkit-scrollbar,.qs-sh-c::-webkit-scrollbar{display:none;width:0;height:0})
