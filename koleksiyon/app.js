(() => {
 'use strict';
 const data=JSON.parse(document.getElementById('product-data').textContent),base=document.body.dataset.base,productId=document.body.dataset.product;
 const labels={anime:'ANIME SERİSİ',optik:'OPTİK SERİ',sade:'İLK SERİ',kupalar:'KUPALAR'};
 const kindLabel=k=>({hoodie:'Hoodie',tshirt:'Tişört',mug:'Kupa'})[k],kindsFor=p=>p.kinds||['hoodie','tshirt'];
 const prices={tshirt:949,hoodie:1299,mug:699},priceText=k=>prices[k].toLocaleString('tr-TR')+' TL';
 const defaultView=p=>p.series==='anime'?'back':'front';
 const previewSrc=(p,k,v=defaultView(p))=>base+'assets/'+(k==='mug'?p.id:'urun-'+p.id+'-'+k+'-'+v)+'.webp';
 const palettes={tshirt:[['siyah','Siyah','#17191b'],['beyaz','Beyaz','#f7f5f0',true],['yesil','Yeşil','#145e39'],['kahverengi','Kahverengi','#bf6322'],['bej','Bej','#ffe8db',true]],hoodie:[['siyah','Siyah','#17191b'],['beyaz','Beyaz','#f7f5f0',true],['sax','Sax','#2814bd'],['bordo','Bordo','#8c0d26'],['yesil','Yeşil','#344030'],['kahverengi','Kahverengi','#4d3123'],['lacivert','Lacivert','#000124'],['gri','Gri','#e3e3e1',true]],mug:[['beyaz','Beyaz','#f7f5f0',true]]};
 const colorsFor=k=>palettes[k].map(([id,name,hex,light=false])=>({id,name,hex,light}));
 const notice='Dijital ürün önizlemesi. 3B model temsili bir kalıptır; baskı yerleşimi ve bedene oranı yaklaşık gösterilir. Kesin kumaş, renk ve beden bilgileri satış öncesinde paylaşılacaktır.';
 const css=document.createElement('link');css.rel='stylesheet';css.href=base+'three/viewer.css?v=20261102-colors2';document.head.append(css);
 const style=document.createElement('style');style.textContent='.art-frame.garment-art{background:#d3d0cb!important}.art-frame.garment-art img{padding:0;object-fit:contain}.mockup-label{position:absolute;bottom:12px;left:12px;right:12px;text-align:center;font-size:10px;color:#3d443f;background:rgba(255,253,248,.9);padding:6px 8px}';document.head.append(style);
 const footer=document.querySelector('footer.footer');if(footer&&!footer.querySelector('.shipping-note')){const p=document.createElement('p');p.className='wrap shipping-note';p.textContent='Ürün fiyatlarına 120 TL kargo ücreti dahildir. Kargo için ayrıca ücret alınmaz.';p.style.cssText='margin-top:24px;padding-top:20px;border-top:1px solid currentColor;font-size:13px';footer.append(p);}
 document.querySelectorAll('.catalog-footnote').forEach(p=>p.textContent='Tasarımı seç; ürün sayfasında tişörtü veya hoodie’yi 3B olarak çevir, baskıyı ayrıca incele. Görseller dijital önizlemedir. Satış ve ödeme henüz açık değildir.');
 const card=(p,kind='hoodie')=>{const supported=kindsFor(p);kind=supported.includes(kind)?kind:supported[0];const mug=kind==='mug';return `<a class="product" data-series="${p.series}" href="${base}${p.id}/?urun=${kind}"><div class="art-frame ${mug?'mug-art':'garment-art'}" style="background:${p.bg}"><span class="badge">${labels[p.series]}</span><img src="${previewSrc(p,kind)}" alt="${p.name} ${kindLabel(kind)} dijital ürün görünümü" width="${mug?1600:626}" height="${mug?800:626}" loading="lazy">${mug?'':'<span class="mockup-label">Ön / arka · 3B inceleme</span>'}</div><div class="card-meta"><h3>${p.name}</h3><span class="arrow" aria-hidden="true">↗</span></div><p class="tagline">${p.tagline}</p><div class="price-row"><span>${kindLabel(kind)} · <strong>${priceText(kind)}</strong></span><small>Ürünü incele ↗</small></div></a>`;};
 if(!productId){
  let series='all',kind='hoodie';const grid=document.getElementById('catalog-grid');
  function render(){const selected=data.filter(p=>series==='all'||p.series===series);grid.innerHTML=selected.map(p=>card(p,kind)).join('');document.getElementById('result-count').textContent=selected.length+' tasarım';document.querySelector('.type-filter').hidden=series==='kupalar';grid.classList.toggle('cup-only',series==='kupalar');}
  document.querySelectorAll('[data-series-filter]').forEach(b=>b.addEventListener('click',()=>{series=b.dataset.seriesFilter;document.querySelectorAll('[data-series-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  document.getElementById('product-type').addEventListener('change',e=>{kind=e.target.value;render();});render();return;
 }
 const product=data.find(p=>p.id===productId);if(!product)return;
 const requested=new URLSearchParams(location.search).get('urun'),supported=kindsFor(product);
 let kind=supported.includes(requested)?requested:supported[0],view=defaultView(product),viewer=null,photo=false,loading=false;
 let color=colorsFor(kind).find(c=>c.id===new URLSearchParams(location.search).get('renk'))||colorsFor(kind)[0],printView=defaultView(product);
 const printSrc=side=>base+'assets/baski-'+product.id+'-'+side+(color.light&&kind!=='mug'?'-light':'')+'.webp';
 const art=document.getElementById('detail-art'),image=document.getElementById('detail-image');
 const status=document.querySelector('.launch-status');status.textContent='Satışa hazırlanıyor · Ödeme henüz açık değil';
 const price=document.createElement('p');price.id='selected-price';price.setAttribute('aria-live','polite');price.style.cssText='margin:20px 0 12px;font-size:28px;font-weight:700';status.before(price);
 const colorPanel=document.createElement('fieldset');colorPanel.className='color-panel';price.before(colorPanel);
 function saveSelection(){const url=new URL(location.href);url.searchParams.set('urun',kind);url.searchParams.set('renk',color.id);history.replaceState(null,'',url);}
 function renderColors(){colorPanel.innerHTML='<legend>RENK <strong aria-live="polite">'+color.name+'</strong></legend><div class="color-options">'+colorsFor(kind).map(c=>'<button type="button" class="color-option" data-color="'+c.id+'" aria-label="'+c.name+' renk" aria-pressed="'+(c.id===color.id)+'" title="'+c.name+'"><span style="background:'+c.hex+'"></span><small>'+c.name+'</small></button>').join('')+'</div><p>'+(kind==='mug'?'Beyaz seramik üzerine baskı önizlemesi.':'Renkler temsili gösterilir. Beden bazında bulunurluk satış açıldığında netleşecektir.')+'</p>';colorPanel.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{color=colorsFor(kind).find(c=>c.id===b.dataset.color);photo=false;renderColors();saveSelection();updatePrint();if(viewer){art.dataset.ready='false';hint.textContent='Renk güncelleniyor…';viewer.update(kind,color);}updateImage();}));}
 function updatePrint(){const surface=document.querySelector('.print-surface');if(surface){surface.style.background=color.hex;surface.querySelector('img').src=printSrc(printView);}}
 document.querySelectorAll('.detail-notice').forEach(p=>{if(!p.querySelector('#selected-kind'))p.textContent=notice;});
 const question=document.createElement('section');question.className='product-question';question.innerHTML='<h2>Ürün hakkında sor</h2><p>Tasarım, baskı veya ürünle ilgili sorularını Instagram’dan bize iletebilirsin. Bu sayfada şu an sipariş ve ödeme alınmıyor.</p><a class="button outline" href="https://www.instagram.com/benfizikyapamiyorum/" target="_blank" rel="noopener">Ürün hakkında sor ↗</a>';
 document.querySelector('.interest-box')?.replaceWith(question);
 document.querySelectorAll('.accordion p').forEach(p=>p.textContent=p.textContent.replace('Kesin fiyat, kargo, teslimat süresi ve iade koşulları','Teslimat süresi ve iade koşulları').replace('Fiyat ve satış tarihi henüz kesinleşmedi.','Satış tarihi henüz kesinleşmedi.'));
 let hint,toolbar;
 if(art){
  art.classList.remove('garment-detail','chest','mug-detail');art.classList.add('model-stage');
  const title=document.createElement('h2');title.className='product-gallery-title';title.innerHTML='Ürün görünümü <span>ETKİLEŞİMLİ 3B</span>';art.before(title);
  document.querySelector('.view-tabs')?.remove();document.querySelector('.garment-caption')?.remove();
  toolbar=document.createElement('div');toolbar.className='model-toolbar';toolbar.setAttribute('aria-label','Ürün görünümü');toolbar.innerHTML='<button type="button" class="tab" data-model-view="front">Ön görünüm</button><button type="button" class="tab" data-model-view="back">Arka görünüm</button><button type="button" class="tab" data-model-photo>Siyah ürün görseli</button><button type="button" class="tab" aria-label="3B ürünü yakınlaştır" data-model-zoom="-0.5">+</button><button type="button" class="tab" aria-label="3B ürünü uzaklaştır" data-model-zoom="0.5">−</button>';art.after(toolbar);
  if(kind==='mug')toolbar.querySelector('[data-model-photo]').textContent='Ürün görseli';
  hint=document.createElement('p');hint.className='model-hint';hint.setAttribute('aria-live','polite');hint.textContent='3B görünüm yükleniyor… Dijital ürün görseli gösteriliyor.';toolbar.after(hint);hint.after(colorPanel);
  toolbar.querySelectorAll('[data-model-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.modelView;photo=false;viewer?.setView(view);updateImage();}));
  toolbar.querySelector('[data-model-photo]').addEventListener('click',()=>{photo=true;updateImage();});
  toolbar.querySelectorAll('[data-model-zoom]').forEach(b=>b.addEventListener('click',()=>{photo=false;viewer?.zoom(Number(b.dataset.modelZoom));updateImage();}));
  const printPanel=document.createElement('section');printPanel.className='print-panel';printPanel.setAttribute('aria-label','Ayrı baskı tasarımı');
  printPanel.innerHTML='<h2>Baskı tasarımı</h2><p>Çizimi ürünün üzerinde olmadan, ayrıntılarıyla incele.</p>'+(product.series==='anime'?'<div class="print-tabs"><button type="button" class="tab" data-print="back" aria-pressed="true">Arka baskı</button><button type="button" class="tab" data-print="front" aria-pressed="false">Ön amblem</button></div>':'')+`<div class="print-surface" style="background:#242828"><img src="${printSrc(defaultView(product))}" alt="${product.name} baskı tasarımı" loading="lazy"></div>`;
  document.querySelector('.detail').after(printPanel);
  printPanel.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>{printView=b.dataset.print;updatePrint();printPanel.querySelector('img').alt=product.name+(b.dataset.print==='front'?' ön amblemi':' arka baskısı');printPanel.querySelector('.print-surface').classList.toggle('chest-print',b.dataset.print==='front');printPanel.querySelectorAll('[data-print]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
  loading=true;
  import(new URL(base+'three/garment.js?v=20261102-colors2',document.baseURI).href).then(async module=>{
   const initialKind=kind,initialColor=color;
   viewer=await module.mountGarment({host:art,product,kind:initialKind,base,color:initialColor,onReady(){loading=false;art.dataset.ready='true';updateImage();},onError(){loading=false;art.dataset.ready='false';hint.textContent='Bu cihazda 3B görünüm açılamadı. Ön ve arka dijital görselleri inceleyebilirsin.';updateImage();}});
   if(viewer){viewer.setView(view);if(initialKind!==kind||initialColor.id!==color.id){art.dataset.ready='false';await viewer.update(kind,color);}updateImage();}
  }).catch(()=>{loading=false;hint.textContent='Bu cihazda 3B görünüm açılamadı. Ön ve arka dijital görselleri inceleyebilirsin.';});
 }
 function updateImage(){
  image.src=previewSrc(product,kind,view);image.alt=product.name+' '+kindLabel(kind)+' '+(view==='front'?'ön':'arka')+' dijital görünümü';
  if(art){
   const ready=art.dataset.ready==='true';art.classList.toggle('is-3d',ready&&!photo);
   toolbar.querySelectorAll('[data-model-view]').forEach(b=>b.setAttribute('aria-pressed',String(!photo&&b.dataset.modelView===view)));
   toolbar.querySelector('[data-model-photo]').setAttribute('aria-pressed',String(photo));
   if(ready)hint.textContent=photo&&kind==='mug'?'Aynı kupanın iki yönden dijital ürün görseli.':photo?'Siyah kumaş üzerindeki dijital ürün görseli. Seçtiğin rengi görmek için ön veya arka 3B görünüme dön.':'Sürükleyerek çevir · + / − ile yakınlaş · Klavyede ok tuşlarını kullan';
  }
 }
 function update(){
  price.innerHTML=priceText(kind)+'<small style="display:block;font-size:13px;font-weight:400;margin-top:5px">120 TL kargo ücreti dahildir.</small>';
  document.getElementById('selected-kind').textContent=kindLabel(kind);
  document.querySelectorAll('[data-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kind===kind)));
  const related=data.filter(p=>p.id!==productId&&p.series===product.series);document.getElementById('related-grid').innerHTML=(related.length?related:data.filter(p=>p.id!==productId)).slice(0,3).map(p=>card(p,kind)).join('');
  renderColors();updatePrint();updateImage();
 }
 document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{if(kind===b.dataset.kind)return;kind=b.dataset.kind;color=colorsFor(kind).find(c=>c.id===color.id)||colorsFor(kind)[0];photo=false;if(viewer){art.dataset.ready='false';hint.textContent='Ürün modeli güncelleniyor…';viewer.update(kind,color);}update();saveSelection();}));
 update();
})();
