/* Product suggestions use only this test's counts; no answers or topic names are transmitted. */
(function(root){
  'use strict';
  const PRODUCTS=Object.freeze({
    9:{name:'Yapabilirim 9',url:'https://www.shopier.com/benfizikyapamiyorum/51625370',details:'9-sinif-fizik-paketi.html'},
    10:{name:'Yapabilirim 10',url:'https://www.shopier.com/benfizikyapamiyorum/51545360',details:'10-sinif-fizik-paketi.html'},
    11:{name:'Yapabilirim 11',url:'https://www.shopier.com/benfizikyapamiyorum/51387941',details:'11-sinif-fizik-paketi.html'}
  });
  function testRecommendation(grade,byTopic,names){
    const product=PRODUCTS[Number(grade)]; if(!product)return null;
    const rows=Object.entries(byTopic||{}).filter(([,d])=>d&&Number.isFinite(d.total)&&d.total>0&&['dogru','yanlis','bos'].every(k=>Number.isFinite(d[k])&&d[k]>=0)&&d.dogru+d.yanlis+d.bos===d.total);
    const total=rows.reduce((s,[,d])=>s+d.total,0),correct=rows.reduce((s,[,d])=>s+d.dogru,0),blank=rows.reduce((s,[,d])=>s+d.bos,0);
    const base={grade:Number(grade),product,total,correct,blank};
    if(!total)return {...base,kind:'grade',title:grade+'. sınıf için çalışma kaynakların',text:'Konu notlarını, çözümlü soruları ve yazdırılabilir çalışma kitapçıklarını tek pakette incele.',button:'Sınıfımın Paketini Al →'};
    if(blank===total)return {...base,kind:'blank',title:'Önce çözümlerle başlayabilirsin.',text:'Bu testte tüm sorular boş kaldı; konu düzeyin hakkında sonuç çıkarmıyoruz. '+grade+'. sınıf konu notları ve adım adım çözümlerle çalışmak istersen '+product.name+' paketini incele.',button:'Sınıfımın Paketini Al →'};
    if(correct===total)return {...base,kind:'complete',title:'Bu testte tüm soruları doğru yanıtladın.',text:'Farklı soru türleriyle devam etmek için '+product.name+' konu notlarını, çözümlü sorularını ve yazdırılabilir PDF kitapçıklarını keşfet.',button:'Yeni Sorular İçin Paketi Al →'};
    const weak=rows.filter(([,d])=>d.dogru<d.total).sort((a,b)=>(a[1].dogru/a[1].total)-(b[1].dogru/b[1].total)||(b[1].yanlis+b[1].bos)-(a[1].yanlis+a[1].bos)||a[0].localeCompare(b[0],'tr'))[0];
    const [code,d]=weak,topic=names&&names[code]||grade+'. sınıf';
    return {...base,kind:'review',topic,code,title:topic+' konusunu pekiştir.',text:'Bu testte bu konudan '+d.total+' soruda '+d.dogru+' doğru, '+d.yanlis+' yanlış ve '+d.bos+' boş var. Okul sınavlarına hazırlanırken Timur YILDIRIM’ın '+product.name+' dijital kitabı ve yazdırılabilir PDF kitapçıklarıyla adım adım çalışabilirsin.',button:'Eksik Konu Paketini Al →'};
  }
  function renderTestOffer(container,grade,byTopic,names){
    const rec=testRecommendation(grade,byTopic,names);if(!container||!rec)return;
    const doc=container.ownerDocument;
    function el(tag,cls,text){const node=doc.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;}
    const heading=el('h3','',rec.title);heading.id='bfy-test-offer-title';
    const price=el('p','bfy-sales-offer-price',rec.product.name+' · '+grade+'. sınıf öğrenci lisansı · ₺599');
    const actions=el('div','bfy-sales-actions');
    const buy=el('a','bfy-sales-button',rec.button);buy.href=rec.product.url;buy.target='_blank';buy.rel='noopener noreferrer';buy.dataset.bfyEvent='test_offer_click';
    const details=el('a','bfy-sales-secondary','Paket içeriği ve ücretsiz örnek ↗');details.href=rec.product.details;details.dataset.bfyEvent='review_resource';
    actions.append(buy,details);
    const note=el('small','bfy-sales-offer-note','Tam sınıf paketi · dijital ürün · tek ödeme. Bu öneri yalnızca bu testteki cevaplarına dayanır.');
    container.replaceChildren(el('p','bfy-sales-kicker','🎯 ANALİZ TAMAMLANDI'),heading,el('p','',rec.text),price,actions,note);
    container.setAttribute('aria-labelledby',heading.id);container.hidden=false;
    try{root.BFY?.track('test_offer_view');}catch(_){}
  }
  const api=Object.freeze({testRecommendation,renderTestOffer});
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.BFYSales=api;
})(typeof window!=='undefined'?window:null);
