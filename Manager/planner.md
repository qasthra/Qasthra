# Fix: give .qa a real height so the initial display renders again
/replace(style.css|html:has(.wc:not(.out)) .qa{flex:1;min-height:0;overflow:hidden}|html:has(.wc:not(.out)) .qa{height:calc(100dvh - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px));min-height:0;overflow:hidden})
