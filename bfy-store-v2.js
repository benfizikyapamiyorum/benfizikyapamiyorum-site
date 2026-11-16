/* Mağaza v2: öğrenci/öğretmen rafı, sınıf seçimi, kart içi seçenekler, eski bağlantıların korunması. */
(() => {
 'use strict';
 const cards=[...document.querySelectorAll('.store-card')],shelves=[...document.querySelectorAll('.shelf')];
 if(!cards.length)return;
 const whoBtns=[...document.querySelectorAll('.store-who button')],gradeBtns=[...document.querySelectorAll('.store-grades button')],q=document.getElementById('store-q'),
  count=document.getElementById('result-count'),advice=document.getElementById('store-advice'),clear=document.getElementById('store-clear'),empty=document.getElementById('store-empty');
 const NEEDS=['ogren','yazili','tyt','kitap','kit','sinav','deney'],GRADES=gradeBtns.map(b=>b.dataset.grade);
 const norm=s=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');
 const BOS=new Set(['ve','ile','icin','bir','de','da']);
 const st={aud:'ogrenci',grade:'all',need:'all',q:''};
 const V=new Map();
 cards.forEach(c=>{if(c.dataset.variants){try{V.set(c,JSON.parse(c.dataset.variants));}catch(e){}}});
 const f=(c,k)=>c.querySelector('[data-f="'+k+'"]');
 function pick(c,i){
  const vs=V.get(c);if(!vs||!vs[i])return;const v=vs[i];
  c.dataset.i=i;
  f(c,'title').textContent=v.title;f(c,'tag').textContent=v.tag;f(c,'desc').textContent=v.desc;f(c,'facts').textContent=v.facts;f(c,'price').textContent=v.price;f(c,'note').textContent=v.note;
  f(c,'buy').href=v.buy;
  const d=f(c,'detail');if(v.detail){d.href=v.detail;d.hidden=false;}else d.hidden=true;
  const x=f(c,'extra');if(v.extra){x.href=v.extra[0];x.firstChild.nodeValue=v.extra[1]+' ';x.hidden=false;}else x.hidden=true;
  const art=f(c,'art'),href=v.detail||v.buy,img=art.querySelector('img');
  art.href=href;if(/^https?:/.test(href)){art.target='_blank';art.rel='noopener noreferrer';}else{art.removeAttribute('target');art.removeAttribute('rel');}
  if(img&&v.img){img.src=v.img;img.alt=v.title;}
  c.querySelectorAll('.variant-chips button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.i===i)));
 }
 // "Ücretsiz örnek" bağlantısının yazısı metin düğümü + ok olarak durur; boş kartlarda düğümü hazırla.
 cards.forEach(c=>{const x=f(c,'extra');if(x&&!x.firstChild){x.append(document.createTextNode(''));const s=document.createElement('span');s.setAttribute('aria-hidden','true');s.textContent='→';x.append(s);}});
 cards.forEach(c=>c.querySelectorAll('.variant-chips button').forEach(b=>b.addEventListener('click',()=>pick(c,+b.dataset.i))));
 const has=(list,x)=>list.split(' ').includes(x);
 function metin(c){const vs=V.get(c);return norm(c.textContent+' '+(c.dataset.keys||'')+' '+(vs?vs.map(v=>v.title+' '+v.tag+' '+v.k).join(' '):''));}
 function uygula(yaz=true){
  const kelimeler=norm(st.q.trim()).split(/\s+/).filter(w=>w&&!BOS.has(w));let n=0;
  cards.forEach(c=>{
   const ok=has(c.dataset.aud,st.aud)&&(st.grade==='all'||has(c.dataset.grade,st.grade))&&(st.need==='all'||c.dataset.need===st.need)&&(!kelimeler.length||kelimeler.every(w=>metin(c).includes(w)));
   c.hidden=!ok;if(ok)n++;
   if(ok&&st.grade!=='all'&&V.has(c)){const i=V.get(c).findIndex(v=>has(v.g,st.grade));if(i>=0&&+c.dataset.i!==i)pick(c,i);}
  });
  document.querySelector('.shelves').dataset.aud=st.aud;
  shelves.forEach(s=>{s.hidden=!s.querySelector('.store-card:not([hidden])');});
  whoBtns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.aud===st.aud)));
  gradeBtns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.grade===st.grade)));
  count.textContent=n+' ürün';empty.hidden=n>0;
  advice.textContent=st.grade==='yks'?'YKS 2027 kitapları 2018 programına göredir. Maarif müfredatıyla okuyorsan “TYT Maarif”i seç.':st.grade==='maarif'?'Maarif müfredatıyla okuyanlar için. 2027’de sınava gireceksen “12 / Mezun”u seç.':st.aud==='ogretmen'?'Her sınıf ayrı lisanstır.':'';
  clear.hidden=!(st.grade!=='all'||st.need!=='all'||st.q);
  if(yaz){const u=new URL(location.href);u.searchParams.set('kime',st.aud);const set=(k,v)=>{if(v&&v!=='all')u.searchParams.set(k,v);else u.searchParams.delete(k);};set('sinif',st.grade);set('ihtiyac',st.need);set('q',st.q.trim());history.replaceState(null,'',u);}
 }
 function hedef(){
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(e){id=location.hash.slice(1);}
  if(!id)return;
  const es={'kitaplar':'ogrenci','ogrenci-kaynaklar':'ogrenci','ogretmen-kaynaklari':'ogretmen','ogretmen-kaynaklar':'ogretmen'};
  if(es[id]){st.aud=es[id];st.grade=st.need='all';st.q=q.value='';uygula(false);document.getElementById('urunler').scrollIntoView({block:'start'});return;}
  if(id==='sinav-reklam-detay')id='p-sinav';
  const c=cards.find(k=>k.id===id||(k.dataset.old||'').split(' ').includes(id));if(!c)return;
  if(!has(c.dataset.aud,st.aud))st.aud=c.dataset.aud.split(' ')[0];
  st.grade=st.need='all';st.q=q.value='';uygula(false);
  if(V.has(c)){const i=V.get(c).findIndex(v=>v.old===id);if(i>=0)pick(c,i);}
  cards.forEach(k=>k.classList.toggle('is-target',k===c));
  requestAnimationFrame(()=>c.scrollIntoView({block:'start'}));
 }
 function oku(){
  const p=new URLSearchParams(location.search),need=p.get('ihtiyac');
  st.need=NEEDS.includes(need)?need:'all';
  st.grade=GRADES.includes(p.get('sinif'))?p.get('sinif'):'all';
  const kime=p.get('kime');
  if(kime==='ogretmen'||kime==='ogrenci')st.aud=kime;
  else if(st.need!=='all'){const c=cards.find(k=>k.dataset.need===st.need);st.aud=c&&!has(c.dataset.aud,'ogrenci')?'ogretmen':'ogrenci';}
  else st.aud='ogrenci';
  st.q=q.value=(p.get('q')||'').slice(0,80);
  uygula(false);hedef();
 }
 whoBtns.forEach(b=>b.addEventListener('click',()=>{st.aud=b.dataset.aud;st.need='all';uygula();}));
 gradeBtns.forEach(b=>b.addEventListener('click',()=>{st.grade=b.dataset.grade;uygula();}));
 q.addEventListener('input',()=>{st.q=q.value;uygula();});
 const sifirla=()=>{st.grade=st.need='all';st.q=q.value='';uygula();};
 clear.addEventListener('click',sifirla);document.getElementById('store-reset').addEventListener('click',sifirla);
 window.addEventListener('popstate',oku);window.addEventListener('hashchange',hedef);
 cards.forEach(c=>{if(V.has(c))c.dataset.i=0;});
 oku();
})();
