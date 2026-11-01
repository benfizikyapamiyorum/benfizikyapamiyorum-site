/* Progressive enhancement: all primary product links exist in the initial HTML. */
(() => {
 'use strict';
 const menuButton=document.querySelector('.clarity-menu-button'),menu=document.getElementById('clarity-nav');
 function closeMenu(focus=false){if(!menu)return;menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');if(focus)menuButton.focus();}
 menuButton?.addEventListener('click',()=>{const open=menu.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(open));});
 document.addEventListener('click',e=>{if(!e.target.closest('.clarity-header')||e.target.closest('#clarity-nav a'))closeMenu();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.classList.contains('is-open'))closeMenu(true);});
 window.matchMedia('(min-width:621px)').addEventListener('change',()=>closeMenu());
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=s=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
 const homeData=document.getElementById('home-product-data');
 if(homeData){
  const data=JSON.parse(homeData.textContent),grid=document.getElementById('home-products'),grade=document.getElementById('home-grade'),radios=[...document.querySelectorAll('[name="home-audience"]')];
  function renderCard(p){
   const external=p.detail.startsWith('http'),attrs=external?' target="_blank" rel="noopener noreferrer"':'';
   let art=p.img?`<img src="${esc(p.img)}" alt="${esc(p.title)} — ürünün kendi görseli" width="480" height="300" decoding="async">`:`<div class="phrase-art"><small>SORUNUN DİLİNİ ÇÖZ</small><b>Fizikçe <i>→</i><br>Türkçe</b><span>“İvmesi negatif.” → İlk adımın ne?</span></div>`;
   return `<article class="shop-card"><a class="product-art ${esc(p.art)}" href="${esc(p.detail)}" tabindex="-1" aria-hidden="true"${attrs}>${art}</a><div class="card-copy"><p class="product-tag">${esc(p.tag)}</p><h3><a href="${esc(p.detail)}"${attrs}>${esc(p.title)}</a></h3><div class="purchase-row"><div class="product-price"><strong>₺${esc(p.price)}</strong><span>${esc(p.note)}</span></div><a class="clarity-button" href="${esc(p.detail)}" data-bfy-event="review_resource"${attrs}>${external?'Shopier’de incele ↗':'İçeriği incele →'}</a></div><p class="product-desc">${esc(p.desc)}</p><p class="product-facts">${esc(p.features)}</p></div></article>`;
  }
  function updateHome(write=true){
   const audience=radios.find(r=>r.checked).value,g=grade.value;
   let selected;
   if(audience==='ogrenci'&&g==='all')selected=data.default;
   else if(audience==='ogretmen'&&g==='all')selected=data.products.filter(p=>p.need==='kit');
   else{
    let candidates=data.products.filter(p=>p.aud.split(' ').includes(audience)&&p.grade.split(' ').includes(g));
    const order=audience==='ogretmen'?['kit','sinav','ogren','tyt','deney']:['yazili','ogren','kitap','tyt'];
    candidates.sort((a,b)=>(Number(b.grade===g)-Number(a.grade===g))||order.indexOf(a.need)-order.indexOf(b.need));
    // In general-study slots, grade-specific books precede the multi-grade supplement.
    if(audience==='ogrenci'&&['9','10'].includes(g))candidates=candidates.filter(p=>p.id!=='p-fizikce');
    if(audience==='ogrenci'&&g==='9')candidates.sort((a,b)=>Number(b.id==='p-kitap')-Number(a.id==='p-kitap'));
    selected=candidates.slice(0,3);
   }
   grid.innerHTML=selected.map(renderCard).join('');
   if(write&&!matchMedia('(prefers-reduced-motion: reduce)').matches)grid.querySelectorAll('.shop-card').forEach((card,i)=>card.animate([{opacity:.5,transform:'translateY(7px) rotateX(2deg)'},{opacity:1,transform:'none'}],{duration:230,delay:i*35,easing:'ease-out'}));
   const params=new URLSearchParams({kime:audience});if(g!=='all')params.set('sinif',g);
   document.getElementById('home-all').href='kaynak-magazasi.html?'+params+'#urunler';
   document.getElementById('home-status').textContent=`${audience==='ogrenci'?'Öğrenci':'Öğretmen'} için ${selected.length} ürün gösteriliyor. Seçilen sınıf: ${grade.options[grade.selectedIndex].text}.`;
   if(write){const u=new URL(location.href);u.searchParams.set('kime',audience);if(g==='all')u.searchParams.delete('sinif');else u.searchParams.set('sinif',g);history.replaceState(null,'',u);}
  }
  function restoreHome(){const p=new URLSearchParams(location.search);radios.forEach(r=>r.checked=r.value===(p.get('kime')==='ogretmen'?'ogretmen':'ogrenci'));grade.value=[...grade.options].some(o=>o.value===p.get('sinif'))?p.get('sinif'):'all';updateHome(false);}
  radios.forEach(r=>r.addEventListener('change',()=>updateHome()));grade.addEventListener('change',()=>updateHome());window.addEventListener('popstate',restoreHome);restoreHome();
 }
 const form=document.querySelector('.catalog-filters');
 if(form){
  const audience=form.elements.kime,grade=form.elements.sinif,need=form.elements.ihtiyac,search=form.elements.q,cards=[...document.querySelectorAll('.catalog-grid .shop-card')],clear=document.querySelector('.clear-filters');
  const valid=(field,value)=>[...field.options].some(o=>o.value===value)?value:'all';
  function filter(write=true){
   const q=normalize(search.value.trim());let count=0;
   const priority=audience.value==='ogretmen'?['kit','ogren','sinav','deney','tyt','yazili','kitap']:['yazili','ogren','tyt','kitap','kit','sinav','deney'];
   const exact=c=>grade.value!=='all'&&c.dataset.grade===grade.value?1:0;
   [...cards].sort((a,b)=>(exact(b)-exact(a))||priority.indexOf(a.dataset.need)-priority.indexOf(b.dataset.need)).forEach(c=>c.parentNode.appendChild(c));
   cards.forEach(card=>{const matches=(audience.value==='all'||card.dataset.aud.split(' ').includes(audience.value))&&(grade.value==='all'||card.dataset.grade.split(' ').includes(grade.value))&&(need.value==='all'||card.dataset.need===need.value)&&(!q||normalize(card.textContent).includes(q));card.hidden=!matches;if(matches)count++;});
   document.getElementById('result-count').textContent=count+' ürün';
   document.querySelector('.empty-state').hidden=count>0;
   const filtered=[audience,grade,need].some(f=>f.value!=='all')||!!q;clear.hidden=!filtered;
   document.getElementById('catalog-title').textContent=audience.value==='ogretmen'?'Öğretmen kaynakları':audience.value==='ogrenci'?'Öğrenci kaynakları':'Tüm ürünler';
   document.getElementById('catalog-advice').textContent=grade.value==='yks'?'YKS 2027: 12. sınıf ve mezunlar için 2018 programı. Maarif TYT paketi farklı bir müfredatı temel alır.':need.value==='sinav'?'Öğretmen sınav paketleri ilgili Hoca Kiti’nde de bulunur; aynı sınıf için tekrar satın alman gerekmez.':need.value==='kit'?'Her sınıf ayrı lisanstır. İkili ve üçlü kit seçeneklerini Hoca Kiti sayfasında inceleyebilirsin.':'Dijital ve basılı ürün bilgileri her kartta ayrı belirtilir. Ayrıntıları ürün sayfasında inceleyebilirsin.';
   if(write){const u=new URL(location.href);for(const f of [audience,grade,need,search]){if(f.value&&f.value!=='all')u.searchParams.set(f.name,f.value);else u.searchParams.delete(f.name);}history.replaceState(null,'',u);}
  }
  function legacyHash(){
   let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{id=location.hash.slice(1);}
   const target=cards.find(c=>c.id===id);
   if(target){for(const f of[audience,grade,need])f.value='all';search.value='';filter(false);requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));return;}
   const aliases={'kitaplar':'ogrenci','ogrenci-kaynaklar':'ogrenci','ogretmen-kaynaklari':'ogretmen','ogretmen-kaynaklar':'ogretmen'};
   if(aliases[id]){audience.value=aliases[id];grade.value=need.value='all';search.value='';filter(false);document.getElementById('urunler').scrollIntoView({block:'start'});}
  }
  function restore(){const p=new URLSearchParams(location.search);for(const f of[audience,grade,need])f.value=valid(f,p.get(f.name));search.value=(p.get('q')||'').slice(0,80);filter(false);legacyHash();}
  function reset(){audience.value=grade.value=need.value='all';search.value='';filter();audience.focus();}
  form.addEventListener('submit',event=>{event.preventDefault();filter();document.getElementById('catalog-title').scrollIntoView({block:'start',behavior:'auto'});});
  [audience,grade,need].forEach(f=>f.addEventListener('change',()=>filter()));search.addEventListener('input',()=>filter());clear.addEventListener('click',reset);document.querySelector('[data-clear]').addEventListener('click',reset);window.addEventListener('popstate',restore);window.addEventListener('hashchange',legacyHash);restore();
 }
 // Old bookmarks and campaign URLs retain sensible destinations.
 if(homeData){const aliases={'ogrenci-kaynaklar':'magaza','ogretmen-kaynaklar':'magaza','neler-var':'magaza','bfy-vitrin':'magaza','ogretmen-kaynaklari':'magaza','diger-kaynaklar':'ucretsiz-kaynaklar','yazili-haftasi':'magaza'};function redirectAnchor(){const id=location.hash.slice(1);if(aliases[id]){if(id.startsWith('ogretmen')){const r=document.querySelector('[name="home-audience"][value="ogretmen"]');r.checked=true;r.dispatchEvent(new Event('change'));}document.getElementById(aliases[id]).scrollIntoView({block:'start'});}if(id==='fizikce-turkce')location.replace('kaynak-magazasi.html#p-fizikce');if(id==='bfy-koleksiyon')location.replace('koleksiyon/');}window.addEventListener('hashchange',redirectAnchor);redirectAnchor();}
})();
