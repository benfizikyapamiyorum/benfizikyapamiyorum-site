(() => {
  'use strict';
  const footer = document.querySelector('footer.footer');
  if (footer && !footer.querySelector('.shipping-note')) {
    const shippingNote = document.createElement('p');
    shippingNote.className = 'wrap shipping-note';
    shippingNote.textContent = 'Ürün fiyatlarına 120 TL kargo ücreti dahildir. Kargo için ayrıca ücret alınmaz.';
    shippingNote.style.cssText = 'margin-top:24px;margin-bottom:0;padding-top:20px;border-top:1px solid currentColor;font-size:13px;line-height:1.7;opacity:.9';
    footer.append(shippingNote);
  }
  const data=JSON.parse(document.getElementById('product-data').textContent);
  const base=document.body.dataset.base;
  const productId=document.body.dataset.product;
  const labels={anime:'ANIME SERİSİ',optik:'OPTİK SERİ',sade:'İLK SERİ',kupalar:'KUPALAR'};
  const kindLabel=k=>({hoodie:'Hoodie',tshirt:'Tişört',mug:'Kupa'})[k];
  const kindsFor=p=>p.kinds||['hoodie','tshirt'];
  const prices=Object.freeze({tshirt:949,hoodie:1299,mug:699});
  const priceText=kind=>prices[kind].toLocaleString('tr-TR')+' TL';
  document.querySelectorAll('.catalog-footnote,.interest-note,.accordion p').forEach(p=>{
    const updated=p.textContent
      .replace('kesin fiyat, renk, beden ve ürün fotoğrafları','renk, beden ve ürün fotoğrafları')
      .replace('Fiyat ve satış tarihi henüz kesinleşmedi.','Satış tarihi henüz kesinleşmedi.')
      .replace('Kesin fiyat, kargo, teslimat süresi ve iade koşulları','Teslimat süresi ve iade koşulları');
    if(updated!==p.textContent)p.textContent=updated;
  });

  // Garment previews preserve the approved print artwork; these are digital mockups.
  const defaultView=p=>p.series==='anime'?'back':'front';
  const previewSrc=(p,kind,view=defaultView(p))=>base+'assets/'+(kind==='mug'?p.id:'urun-'+p.id+'-'+kind+'-'+view)+'.webp';
  const previewNote='Dijital ürün önizlemesi. Baskı yerleşimi yaklaşık olarak gösterilir; kumaşın rengi, kalıbı ve baskının bedene oranı üretilecek üründe farklılık gösterebilir. Kesin ürün bilgileri satış öncesinde paylaşılacaktır.';
  const garmentStyles=document.createElement('style');
  garmentStyles.textContent='.art-frame.garment-art{background:#d3d0cb!important}.art-frame.garment-art img{padding:0;object-fit:contain}.mockup-label{position:absolute;bottom:12px;left:12px;right:12px;text-align:center;font-size:10px;color:#3d443f;background:rgba(255,253,248,.9);padding:6px 8px}.detail-art.garment-detail{height:auto;aspect-ratio:1;background:#d3d0cb!important}.detail-art.garment-detail img{padding:0;max-width:100%;max-height:100%}.view-tabs{flex-wrap:wrap}.garment-caption{font-size:12px;color:var(--muted);margin:12px 0;line-height:1.7}';
  document.head.append(garmentStyles);
  document.querySelectorAll('.catalog-footnote').forEach(p=>{p.textContent=previewNote+' İlgini Instagram’dan iletebilirsin; henüz ödeme alınmıyor.';});
  const card=(p,kind='hoodie')=>{
    const supported=kindsFor(p);kind=supported.includes(kind)?kind:supported[0];
    const mug=kind==='mug';
    return `<a class="product" data-series="${p.series}" href="${base}${p.id}/?urun=${kind}"><div class="art-frame${mug?' mug-art':' garment-art'}" style="background:${p.bg}"><span class="badge">${labels[p.series]}</span><img src="${previewSrc(p,kind)}" alt="${p.name}${mug?' beyaz kupa üzerinde iki yönden dijital önizleme':' '+kindLabel(kind)+' üzerinde '+(defaultView(p)==='back'?'arka':'ön')+' görünüm — dijital önizleme'}" width="${mug?1600:700}" height="800" loading="lazy">${mug?'':'<span class="mockup-label">Dijital ürün önizlemesi</span>'}</div><div class="card-meta"><h3>${p.name}</h3><span class="arrow" aria-hidden="true">↗</span></div><p class="tagline">${p.tagline}</p><div class="price-row"><span>${kindLabel(kind)} · <strong>${priceText(kind)}</strong></span><small>Haberdar ol ↗</small></div></a>`;
  };
  if(!productId){
    let series='all',kind='hoodie';
    const grid=document.getElementById('catalog-grid');
    function render(){const selected=data.filter(p=>series==='all'||p.series===series);grid.innerHTML=selected.map(p=>card(p,kind)).join('');document.getElementById('result-count').textContent=selected.length+' tasarım';document.querySelector('.type-filter').hidden=series==='kupalar';grid.classList.toggle('cup-only',series==='kupalar');}
    document.querySelectorAll('[data-series-filter]').forEach(b=>b.addEventListener('click',()=>{series=b.dataset.seriesFilter;document.querySelectorAll('[data-series-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
    document.getElementById('product-type').addEventListener('change',e=>{kind=e.target.value;render();});
    render();
  }else{
    const product=data.find(p=>p.id===productId);
    const requestedKind=new URLSearchParams(location.search).get('urun');
    const supported=kindsFor(product);
    let kind=supported.includes(requestedKind)?requestedKind:supported[0];
    let view=defaultView(product);
    const art=document.getElementById('detail-art');
    const detailImage=document.getElementById('detail-image');
    if(kind!=='mug'){
      art.classList.add('garment-detail');
      let tabs=document.querySelector('.view-tabs');
      if(!tabs){tabs=document.createElement('div');tabs.className='view-tabs';art.after(tabs);}
      tabs.setAttribute('aria-label','Ürün görünümü');
      tabs.innerHTML='<button class="tab" data-preview="front">Ön görünüm</button><button class="tab" data-preview="back">Arka görünüm</button><button class="tab" data-preview="art">Baskı detayı</button>';
      const caption=document.createElement('p');caption.className='garment-caption';caption.textContent='Dijital ürün önizlemesi · Siyah kumaş üzerinde örnek yerleşim';tabs.after(caption);
      document.querySelectorAll('.detail-notice').forEach(p=>{if(!p.querySelector('#selected-kind'))p.textContent=previewNote;});
      tabs.querySelectorAll('[data-preview]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.preview;updatePreview();}));
    }
    function updatePreview(){
      if(kind==='mug')return;
      const flat=view==='art';
      art.classList.toggle('garment-detail',!flat);
      detailImage.src=flat?base+'assets/'+product.id+'.webp':previewSrc(product,kind,view);
      detailImage.alt=product.name+(flat?' ana baskı detayı':' '+kindLabel(kind)+' '+(view==='front'?'ön':'arka')+' görünümü — dijital ürün önizlemesi');
      document.querySelectorAll('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preview===view)));
      const sameSeries=data.filter(p=>p.id!==productId&&p.series===product.series);
      document.getElementById('related-grid').innerHTML=(sameSeries.length?sameSeries:data.filter(p=>p.id!==productId)).slice(0,3).map(p=>card(p,kind)).join('');
    }
    const priceBlock=document.createElement('p');
    priceBlock.id='selected-price';
    priceBlock.setAttribute('aria-live','polite');
    priceBlock.style.cssText='margin:18px 0 12px;font-size:28px;font-weight:700;line-height:1.35';
    document.querySelector('.launch-status').before(priceBlock);
    function updatePrice(){
      priceBlock.replaceChildren();
      const amount=document.createElement('span');
      amount.textContent=priceText(kind);
      const shipping=document.createElement('small');
      shipping.textContent='120 TL kargo ücreti dahildir.';
      shipping.style.cssText='display:block;margin-top:5px;font-size:13px;font-weight:400';
      priceBlock.append(amount,shipping);
    }
    const size=document.getElementById('interest-size');
    const message=document.getElementById('interest-message');
    const feedback=document.getElementById('interest-feedback');
    function updateMessage(){updatePrice();updatePreview();const value=kind!=='mug'&&size?size.value.trim():'';message.value=product.name+' / '+kindLabel(kind)+(value?' / Tahmini beden: '+value:'')+'. Bu ürün satışa açıldığında Instagram’dan haber almak istiyorum.';feedback.textContent='';}
    document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.kind;document.querySelectorAll('[data-kind]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('selected-kind').textContent=kindLabel(kind);updateMessage();}));
    if(size)size.addEventListener('input',updateMessage);
    document.getElementById('copy-interest').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message.value);feedback.textContent='Mesaj kopyalandı. Şimdi Instagram’ı açıp bize gönderebilirsin.';}catch{message.focus();message.select();feedback.textContent='Otomatik kopyalama kullanılamadı. Seçili metni kopyalayıp Instagram’dan gönderebilirsin.';}});
    const sameSeries=data.filter(p=>p.id!==productId&&p.series===product.series);
    document.getElementById('related-grid').innerHTML=(sameSeries.length?sameSeries:data.filter(p=>p.id!==productId)).slice(0,3).map(p=>card(p)).join('');
    document.querySelectorAll('[data-kind]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.kind===kind)));
    document.getElementById('selected-kind').textContent=kindLabel(kind);
    updateMessage();
  }
})();
