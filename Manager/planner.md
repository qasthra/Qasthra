# Remove month titles from 3D contributions globe
/replace(script.js|,lab=mk('div','cg-l')|)
/replace(script.js|const spans=MON.map((m)=>{const s=mk('span','',m);lab.appendChild(s);return s});|)
/replace(script.js|wrap.append(lab,cv)|wrap.append(cv))
/replace(script.js|const lbls=()=>{const h=cv.clientHeight;for(let m=0;m<12;m++){v.set(0,Math.sin((70-m*140/11)*Math.PI/180),0).applyMatrix4(grp.matrixWorld).project(cam);spans[m].style.transform='translateY('+((-v.y*.5+.5)*h)+'px) translateY(-50%)'}};|)
/replace(script.js|paint();lbls();r.render|paint();r.render)
/replace(style.css|.cg-l{position:absolute;left:0;top:0;width:34px;height:100%;pointer-events:none}|)
/replace(style.css|.cg-l span{position:absolute;left:0;top:0;width:34px;text-align:right;color:var(--gray);font:600 10px/1 var(--font);will-change:transform}|)
