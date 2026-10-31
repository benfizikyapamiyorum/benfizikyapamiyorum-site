(() => {
  'use strict';
  const data=JSON.parse(document.getElementById('product-data').textContent);
  const base=document.body.dataset.base;
  const productId=document.body.dataset.product;
  const labels={anime:'ANIME SERİSİ',optik:'OPTİK SERİ',sade:'İLK SERİ',kupalar:'KUPALAR'};
  const kindLabel=k=>({hoodie:'Hoodie',tshirt:'Tişört',mug:'Kupa'})[k];
  const kindsFor=p=>p.kinds||['hoodie','tshirt'];
  const card=(p,kind='hoodie')=>{
    const supported=kindsFor(p);kind=supported.includes(kind)?kind:supported[0];
    const mug=kind==='mug';
    return `<a class="product" data-series="${p.series}" href="${base}${p.id}/?urun=${kind}"><div class="art-frame${mug?' mug-art':''}" style="background:${p.bg}"><span class="badge">${labels[p.series]}</span><img src="${base}assets/${p.id}.webp" alt="${p.name}${mug?' beyaz kupa üzerinde iki yönden dijital önizleme':' baskı tasarımı'}" width="${mug?1600:700}" height="800" loading="lazy"></div><div class="card-meta"><h3>${p.name}</h3><span class="arrow" aria-hidden="true">↗</span></div><p class="tagline">${p.tagline}</p><div class="price-row"><span>${kindLabel(kind)} · Hazırlanıyor</span><small>Haberdar ol ↗</small></div></a>`;
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
    const size=document.getElementById('interest-size');
    const message=document.getElementById('interest-message');
    const feedback=document.getElementById('interest-feedback');
    function updateMessage(){const value=kind!=='mug'&&size?size.value.trim():'';message.value=product.name+' / '+kindLabel(kind)+(value?' / Tahmini beden: '+value:'')+'. Bu ürün satışa açıldığında Instagram’dan haber almak istiyorum.';feedback.textContent='';}
    document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.kind;document.querySelectorAll('[data-kind]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.getElementById('selected-kind').textContent=kindLabel(kind);updateMessage();}));
    if(size)size.addEventListener('input',updateMessage);
    document.getElementById('copy-interest').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message.value);feedback.textContent='Mesaj kopyalandı. Şimdi Instagram’ı açıp bize gönderebilirsin.';}catch{message.focus();message.select();feedback.textContent='Otomatik kopyalama kullanılamadı. Seçili metni kopyalayıp Instagram’dan gönderebilirsin.';}});
    document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{const front=b.dataset.view==='front';document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const im=document.getElementById('detail-image');im.src=base+'assets/'+product.id+(front?'-on':'')+'.webp';im.alt=product.name+(front?' ön göğüs amblemi':' ana baskı tasarımı');document.getElementById('detail-art').classList.toggle('chest',front);}));
    const sameSeries=data.filter(p=>p.id!==productId&&p.series===product.series);
    document.getElementById('related-grid').innerHTML=(sameSeries.length?sameSeries:data.filter(p=>p.id!==productId)).slice(0,3).map(p=>card(p)).join('');
    document.querySelectorAll('[data-kind]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.kind===kind)));
    document.getElementById('selected-kind').textContent=kindLabel(kind);
    updateMessage();
  }
})();
