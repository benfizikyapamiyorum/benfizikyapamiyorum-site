/* Ortak üst menü: telefonda aç/kapat. */
(() => {
 'use strict';
 const b=document.querySelector('.clarity-menu-button'),m=document.getElementById('clarity-nav');
 if(!b||!m||b.dataset.hazir)return;b.dataset.hazir='1';
 const kapat=odak=>{m.classList.remove('is-open');b.setAttribute('aria-expanded','false');if(odak)b.focus();};
 b.addEventListener('click',()=>{b.setAttribute('aria-expanded',String(m.classList.toggle('is-open')));});
 document.addEventListener('click',e=>{if(!e.target.closest('.clarity-header')||e.target.closest('#clarity-nav a'))kapat();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('is-open'))kapat(true);});
})();
