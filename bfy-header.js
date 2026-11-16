/* Ortak üst menü: telefonda aç/kapat + site içi arama. Bütün sayfalarda aynı dosya. */
(() => {
 'use strict';
 const hdr=document.querySelector('.clarity-header'),row=hdr&&hdr.querySelector('.header-row'),b=hdr&&hdr.querySelector('.clarity-menu-button'),m=document.getElementById('clarity-nav');
 if(!row||window.__bfyHeader)return;window.__bfyHeader=1;
 // Menü düğmesi: bfy-clarity.js yüklü sayfalarda o dosya zaten bağlıyor.
 if(b&&m&&!document.querySelector('script[src*="bfy-clarity.js"]')){
  const kapat=odak=>{m.classList.remove('is-open');b.setAttribute('aria-expanded','false');if(odak)b.focus();};
  b.addEventListener('click',()=>{b.setAttribute('aria-expanded',String(m.classList.toggle('is-open')));});
  document.addEventListener('click',e=>{if(!e.target.closest('.clarity-header')||e.target.closest('#clarity-nav a'))kapat();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('is-open'))kapat(true);});
 }
 // ---- Arama ----
 const IK='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
 const btn=document.createElement('button');btn.type='button';btn.className='bfy-ara-btn';btn.setAttribute('aria-label','Sitede ara');btn.innerHTML=IK+'<span>Ara</span>';
 row.insertBefore(btn,b||m);
 const norm=s=>s.replace(/İ/g,'i').replace(/I/g,'ı').toLowerCase().replace(/[çğıöşüâîû]/g,c=>({'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','â':'a','î':'i','û':'u'}[c])).replace(/[^a-z0-9]+/g,' ').trim();
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const SIRA=['Konu','Yazılı','Not','Test','Simülasyon','Ders','Oyun','Rehber','Öğretmen','Sayfa','Kitap ve paket'],BOS=new Set(['ve','ile','icin','bir','de','da','mi','ne','nasil']);
 const HIZLI=[['Yazılı soruları','yazılı soruları'],['Vektörler','vektör'],['Newton','newton'],['Serbest düşme','serbest düşme'],['Simülasyon','simülasyon'],['Ücretsiz not','not']];
 let kutu,girdi,liste,veri=null,yukleniyor=null,secili=-1,onceki=null;
 function kur(){
  kutu=document.createElement('div');kutu.className='bfy-ara';kutu.hidden=true;kutu.setAttribute('role','dialog');kutu.setAttribute('aria-modal','true');kutu.setAttribute('aria-label','Sitede ara');
  kutu.innerHTML='<div class="bfy-ara-panel"><div class="bfy-ara-ust">'+IK+'<input type="search" id="bfy-ara-girdi" placeholder="Konu, not, test ya da simülasyon ara" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="60" aria-controls="bfy-ara-liste" aria-label="Aranacak kelime"><button type="button" class="bfy-ara-kapat" aria-label="Aramayı kapat">Kapat</button></div><div class="bfy-ara-liste" id="bfy-ara-liste" role="listbox" aria-live="polite"></div></div>';
  document.body.appendChild(kutu);girdi=kutu.querySelector('input');liste=kutu.querySelector('.bfy-ara-liste');
  kutu.addEventListener('click',e=>{if(e.target===kutu||e.target.closest('.bfy-ara-kapat'))kapa();const h=e.target.closest('[data-hizli]');if(h){girdi.value=h.dataset.hizli;ciz();girdi.focus();}});
  girdi.addEventListener('input',()=>{secili=-1;ciz();});
  kutu.addEventListener('keydown',e=>{
   const a=[...liste.querySelectorAll('a.bfy-ara-sonuc')];
   if(e.key==='Escape'){e.preventDefault();kapa();}
   else if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!a.length)return;e.preventDefault();secili=(secili+(e.key==='ArrowDown'?1:-1)+a.length)%a.length;a.forEach((x,i)=>x.classList.toggle('is-secili',i===secili));a[secili].scrollIntoView({block:'nearest'});}
   else if(e.key==='Enter'&&document.activeElement===girdi){const x=a[secili>=0?secili:0];if(x){e.preventDefault();x.click();}}
   else if(e.key==='Tab'){const f=[girdi,kutu.querySelector('.bfy-ara-kapat'),...a,...liste.querySelectorAll('button,a:not(.bfy-ara-sonuc)')];const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();}}
  });
 }
 function yukle(){
  if(veri||yukleniyor)return yukleniyor;
  yukleniyor=fetch('/bfy-arama.json?v=20261116').then(r=>{if(!r.ok)throw 0;return r.json();}).then(d=>{veri=d.map(k=>({...k,nt:norm(k.t).split(' '),nx:k.x.split(' ')}));ciz();}).catch(()=>{veri=[];liste.innerHTML='<p class="bfy-ara-bos">Arama şu an açılamadı. Sayfayı yenileyip tekrar dene.</p>';});
  return yukleniyor;
 }
 function ara(q){
  const w=norm(q).split(' ').filter(x=>x&&!BOS.has(x));if(!w.length)return null;
  const out=[];
  for(const k of veri){
   let p=0,ok=true;
   for(const x of w){
    const sayi=/^\d+$/.test(x);
    if(sayi&&k.g){if(k.g===x){p+=6;continue;}ok=false;break;}
    if(k.nt.some(t=>t===x))p+=6;else if(!sayi&&k.nt.some(t=>t.startsWith(x)))p+=4;else if(k.nx.some(t=>sayi?t===x:t.startsWith(x)))p+=1;else{ok=false;break;}
   }
   if(ok)out.push([p-SIRA.indexOf(k.k)*.3,k]);
  }
  out.sort((a,c)=>c[0]-a[0]);
  const son=[];let urun=0;
  for(const [,k] of out){if(k.k==='Kitap ve paket'){if(urun>=3)continue;urun++;}son.push(k);if(son.length>=8)break;}
  return son;
 }
 function ciz(){
  if(!veri){liste.innerHTML='<p class="bfy-ara-bos">Yükleniyor…</p>';return;}
  const r=ara(girdi.value);
  if(r===null){liste.innerHTML='<p class="bfy-ara-etiket">Çok arananlar</p><div class="bfy-ara-hizli">'+HIZLI.map(h=>'<button type="button" data-hizli="'+esc(h[1])+'">'+esc(h[0])+'</button>').join('')+'</div>';return;}
  if(!r.length){liste.innerHTML='<p class="bfy-ara-bos"><b>“'+esc(girdi.value.trim())+'” için bir şey bulamadık.</b>Daha kısa yazmayı dene (örneğin “sürtünme”) ya da <a href="https://wa.me/905425549386" target="_blank" rel="noopener noreferrer">WhatsApp’tan sor</a>.</p>';return;}
  liste.innerHTML=r.map(k=>'<a class="bfy-ara-sonuc" role="option" href="'+esc(k.u)+'"><span class="bfy-ara-tur">'+esc(k.k)+(k.g?' · '+esc(k.g)+'. sınıf':'')+'</span><b>'+esc(k.t)+'</b>'+(k.d?'<small>'+esc(k.d)+'</small>':'')+'</a>').join('');
 }
 function ac(){if(!kutu)kur();onceki=document.activeElement;kutu.hidden=false;document.documentElement.classList.add('bfy-ara-acik');girdi.value='';secili=-1;ciz();yukle();setTimeout(()=>girdi.focus(),30);if(m)m.classList.remove('is-open');}
 function kapa(){kutu.hidden=true;document.documentElement.classList.remove('bfy-ara-acik');if(onceki&&onceki.focus)onceki.focus();}
 btn.addEventListener('click',ac);
 document.addEventListener('keydown',e=>{
  const t=e.target,yazi=t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  if((e.key==='k'&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&!yazi&&!e.metaKey&&!e.ctrlKey&&!e.altKey)){if(kutu&&!kutu.hidden)return;e.preventDefault();ac();}
 });
})();
