/* Ana sayfa v2: sınıf seçimi. JS yoksa bütün paneller açık kalır. */
(() => {
 'use strict';
 const chips=[...document.querySelectorAll('.grade-chip')],panels=[...document.querySelectorAll('[data-grade-panel]')],wrap=document.getElementById('sinif-paneli');
 if(!chips.length||!wrap)return;
 const KEY='bfy-sinif';
 function show(g,scroll){
  const ok=panels.some(p=>p.dataset.gradePanel===g);
  wrap.hidden=!ok;
  panels.forEach(p=>{p.hidden=p.dataset.gradePanel!==g;});
  chips.forEach(c=>c.setAttribute('aria-pressed',String(ok&&c.dataset.grade===g)));
  if(!ok)return;
  try{localStorage.setItem(KEY,g);}catch(e){}
  if(scroll){const r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;wrap.scrollIntoView({behavior:r?'auto':'smooth',block:'start'});}
 }
 chips.forEach(c=>c.addEventListener('click',()=>show(c.dataset.grade,true)));
 let saved=null;try{saved=localStorage.getItem(KEY);}catch(e){}
 show(saved||'',false);
 // Eski bağlantılar: #magaza ve türevleri yeni "kaynaklar" bölümüne gider.
 const eski={'ogrenci-kaynaklar':'magaza','neler-var':'magaza','bfy-vitrin':'magaza','yazili-haftasi':'magaza','diger-kaynaklar':'ucretsiz-kaynaklar','ogretmen-kaynaklar':'ogretmenler','ogretmen-kaynaklari':'ogretmenler'};
 function git(){const id=location.hash.slice(1);if(eski[id])document.getElementById(eski[id])?.scrollIntoView({block:'start'});if(id==='fizikce-turkce')location.replace('kaynak-magazasi.html#p-fizikce');if(id==='bfy-koleksiyon')location.replace('koleksiyon/');}
 window.addEventListener('hashchange',git);git();
})();

/* Kahraman bölümündeki canlı eğik atış. g = 10 m/s². */
(() => {
 'use strict';
 const cv=document.getElementById('hero-lab-canvas');if(!cv)return;
 const ctx=cv.getContext('2d'),aci=document.getElementById('hl-aci'),hiz=document.getElementById('hl-hiz'),btn=document.getElementById('hl-firlat');
 const out={aci:document.getElementById('hl-aci-o'),hiz:document.getElementById('hl-hiz-o'),R:document.getElementById('hl-menzil'),H:document.getElementById('hl-hmax'),T:document.getElementById('hl-sure')};
 const G=10,XMAX=100,YMAX=50,HIZLANDIRMA=1.5,sakin=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 const tr=(n,d=1)=>n.toLocaleString('tr-TR',{minimumFractionDigits:d,maximumFractionDigits:d});
 let W=0,Hh=0,t=null,raf=0,son=0;
 const P=()=>{const a=+aci.value*Math.PI/180,v=+hiz.value,vx=v*Math.cos(a),vy=v*Math.sin(a);return{vx,vy,T:2*vy/G,R:vx*2*vy/G,H:vy*vy/(2*G)};};
 function boyut(){const r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);W=r.width;Hh=r.height;cv.width=Math.round(W*d);cv.height=Math.round(Hh*d);ctx.setTransform(d,0,0,d,0,0);ciz();}
 function ciz(){
  if(!W)return;
  const L=34,B=26,sx=(W-L-14)/XMAX,sy=(Hh-B-12)/YMAX,X=x=>L+x*sx,Y=y=>Hh-B-y*sy,p=P();
  ctx.clearRect(0,0,W,Hh);
  ctx.font='600 10.5px "Plus Jakarta Sans",system-ui,sans-serif';ctx.lineWidth=1;
  for(let x=0;x<=XMAX;x+=20){ctx.strokeStyle='#17302a';ctx.beginPath();ctx.moveTo(X(x),Y(0));ctx.lineTo(X(x),Y(YMAX));ctx.stroke();ctx.fillStyle='#6f887d';ctx.textAlign='center';ctx.fillText(x+(x===XMAX?' m':''),X(x)-(x===XMAX?8:0),Hh-8);}
  for(let y=10;y<=YMAX;y+=10){ctx.strokeStyle='#17302a';ctx.beginPath();ctx.moveTo(X(0),Y(y));ctx.lineTo(X(XMAX),Y(y));ctx.stroke();ctx.fillStyle='#6f887d';ctx.textAlign='right';ctx.fillText(y,L-8,Y(y)+4);}
  ctx.strokeStyle='#3c5a50';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(X(0),Y(0));ctx.lineTo(X(XMAX),Y(0));ctx.stroke();
  // Öngörülen yol
  ctx.setLineDash([5,6]);ctx.strokeStyle='#5d7a6f';ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<=60;i++){const tt=p.T*i/60;ctx[i?'lineTo':'moveTo'](X(p.vx*tt),Y(p.vy*tt-G*tt*tt/2));}
  ctx.stroke();ctx.setLineDash([]);
  // Tepe ve menzil işaretleri
  ctx.fillStyle='#9fb5aa';ctx.textAlign='center';
  ctx.beginPath();ctx.arc(X(p.R/2),Y(p.H),3,0,7);ctx.fill();
  ctx.fillText('h = '+tr(p.H)+' m',Math.min(Math.max(X(p.R/2),L+34),W-44),Math.max(Y(p.H)-9,12));
  ctx.beginPath();ctx.arc(X(p.R),Y(0),3,0,7);ctx.fill();
  // Atıcı
  const a=+aci.value*Math.PI/180;ctx.strokeStyle='#f1ca75';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(X(0),Y(0));ctx.lineTo(X(0)+22*Math.cos(a),Y(0)-22*Math.sin(a));ctx.stroke();ctx.lineCap='butt';
  // Uçuş izi ve top
  const tt=t===null?0:Math.min(t,p.T);
  if(t!==null){ctx.strokeStyle='#f1ca75';ctx.lineWidth=2.5;ctx.beginPath();const n=Math.max(2,Math.ceil(60*tt/p.T));for(let i=0;i<=n;i++){const q=tt*i/n;ctx[i?'lineTo':'moveTo'](X(p.vx*q),Y(p.vy*q-G*q*q/2));}ctx.stroke();}
  const bx=X(p.vx*tt),by=Y(p.vy*tt-G*tt*tt/2);
  ctx.fillStyle='rgba(241,202,117,.22)';ctx.beginPath();ctx.arc(bx,by,13,0,7);ctx.fill();
  ctx.fillStyle='#f1ca75';ctx.beginPath();ctx.arc(bx,by,6.5,0,7);ctx.fill();
 }
 function yaz(){const p=P();out.aci.textContent=aci.value+'°';out.hiz.textContent=hiz.value+' m/s';out.R.textContent=tr(p.R)+' m';out.H.textContent=tr(p.H)+' m';out.T.textContent=tr(p.T)+' s';}
 function adim(z){if(!son)son=z;t+=(z-son)/1000*HIZLANDIRMA;son=z;ciz();if(t<P().T)raf=requestAnimationFrame(adim);else{raf=0;t=P().T;ciz();}}
 function firlat(){cancelAnimationFrame(raf);if(sakin){t=P().T;ciz();return;}t=0;son=0;raf=requestAnimationFrame(adim);}
 function degisti(){cancelAnimationFrame(raf);raf=0;t=null;yaz();ciz();}
 aci.addEventListener('input',degisti);hiz.addEventListener('input',degisti);btn.addEventListener('click',firlat);
 window.addEventListener('resize',boyut);
 yaz();boyut();
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ciz);
 if(!sakin)setTimeout(firlat,700);
})();
