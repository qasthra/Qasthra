# Accent swatches: compact, inset from card edge
/replace(style.css|.qs-sw-g{display:grid;grid-template-columns:repeat(5,32px);justify-content:space-between;row-gap:14px;padding:4px 2px 16px}|.qs-sw-g{display:grid;grid-template-columns:repeat(5,28px);justify-content:start;column-gap:20px;row-gap:16px;padding:14px 20px 16px})
/replace(style.css|.qs-ac{width:32px;height:32px;|.qs-ac{width:28px;height:28px;)
