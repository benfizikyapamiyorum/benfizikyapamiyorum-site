(function(){
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const LS={get(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},del(k){try{localStorage.removeItem(k);}catch(e){}}};
  const SURE=40*60, SET='y1';
  const ILLER=['Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkâri','Hatay','Iğdır','Isparta','İstanbul','İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kilis','Kırıkkale','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Şanlıurfa','Siirt','Sinop','Sivas','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak','Yurt dışı'];
  const AYLAR=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const URUN={
    9:[{img:'/img/yazili3gun/kapak-9-1.webp',ad:'Yazılıya 3 Gün Kala · 9. sınıf',alt:'Yazılıdan önceki 3 gün için hazır plan ve gerçek yazılı provası.',f:'₺299 · 1. + 2. yazılı',href:'/yazili-3-gun-kala.html#sinif-sec',cta:'Sınıfını seç',k:'y3g_9'},
       {img:'/img/fizik9/kartlar.webp',ad:'Yapabilirim 9',alt:'21 konunun notu, 504 soru, kavram kartları ve mini oyunlar.',f:'₺599',href:'/9-sinif-fizik-paketi.html',cta:'İncele',dene:'/calis/',k:'yap9'},
       {img:'/kitap9-kapak.jpg',ad:'9. Sınıf Fizik Ders Kitabı',alt:'Konu anlatımı ve sorular, Maarif sırasıyla. Basılı, kargo dahil.',f:'₺399',href:'https://www.shopier.com/benfizikyapamiyorum/49999590',cta:'Kitabı incele',ext:1}],
    10:[{img:'/img/yazili3gun/kapak-10-1.webp',ad:'Yazılıya 3 Gün Kala · 10. sınıf',alt:'Yazılıdan önceki 3 gün için hazır plan ve gerçek yazılı provası.',f:'₺299 · 1. + 2. yazılı',href:'/yazili-3-gun-kala.html#sinif-sec',cta:'Sınıfını seç',k:'y3g_10'},
       {img:'/img/fizik10/set.webp',ad:'Yapabilirim 10',alt:'20 konunun notu, kavram kartları ve tablo-grafikli yeni nesil sorular.',f:'₺599',href:'/10-sinif-fizik-paketi.html',cta:'İncele',dene:'/calis/',k:'yap10'},
       {img:'/bfy10-dijital-kapak.png',ad:'10. Sınıf Fizik Soru Kitabı',alt:'336 sayfa: konu anlatımı, çözümlü örnekler, bağlam temelli sorular.',f:'₺199',href:'https://shopier.com/benfizikyapamiyorum/51233987',cta:'PDF’yi satın al',ext:1}],
    11:[{img:'/img/yazili3gun/kapak-11-1.webp',ad:'Yazılıya 3 Gün Kala · 11. sınıf',alt:'Yazılıdan önceki 3 gün için hazır plan ve gerçek yazılı provası.',f:'₺299 · 1. + 2. yazılı',href:'/yazili-3-gun-kala.html#sinif-sec',cta:'Sınıfını seç',k:'y3g_11'},
       {img:'/img/fizik11/set.webp',ad:'Yapabilirim 11',alt:'Serbest düşme, atışlar ve Newton: not, kavram kartı, adım adım çözüm.',f:'₺599',href:'/11-sinif-fizik-paketi.html',cta:'İncele',dene:'/calis/',k:'yap11'}]
  };

  /* --- hafta (İstanbul saatiyle ISO hafta) --- */
  const now=new Date(Date.now()+3*3600e3); // UTC+3
  const d0=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));
  const wd=(d0.getUTCDay()+6)%7; const mon=new Date(d0-wd*864e5), sun=new Date(+mon+6*864e5);
  const th=new Date(+d0+(3-wd)*864e5), y1=new Date(Date.UTC(th.getUTCFullYear(),0,4));
  const hafta=1+Math.round(((th-y1)/864e5-3+((y1.getUTCDay()+6)%7))/7);
  const DONEM=th.getUTCFullYear()+'-W'+String(hafta).padStart(2,'0');
  const aralik=(mon.getUTCMonth()===sun.getUTCMonth()?mon.getUTCDate():mon.getUTCDate()+' '+AYLAR[mon.getUTCMonth()])+'–'+sun.getUTCDate()+' '+AYLAR[sun.getUTCMonth()];
  $('pvHafta').textContent='TÜRKİYE GENELİ · '+aralik.toLocaleUpperCase('tr-TR')+' HAFTASI';

  /* --- firebase --- */
  let DB=null;
  try{ firebase.initializeApp({apiKey:"AIzaSyAeX9tk4zgoa5c5y2pVH3V4r9ip2mrlMvg",authDomain:"benfizikyapamiyorum-oyun.firebaseapp.com",projectId:"benfizikyapamiyorum-oyun",storageBucket:"benfizikyapamiyorum-oyun.firebasestorage.app",messagingSenderId:"942775741325",appId:"1:942775741325:web:85dca63d6a17e2822cebc4"}); DB=firebase.firestore(); }catch(e){ DB=null; }
  const kayitRef=s=>DB.collection('prova_sonuclar').doc(DONEM+'-'+s+'-'+SET).collection('kayitlar');
  const dagRef=s=>DB.collection('prova_dagilim').doc(DONEM+'-'+s+'-'+SET);
  const ilkKey=s=>'prova_'+DONEM+'_'+s+'_'+SET;

  /* --- giriş --- */
  $('pvIl').innerHTML='<option value="">Seç</option>'+ILLER.map(i=>`<option>${esc(i)}</option>`).join('');
  const prof=LS.get('prova_profil'); if(prof){ $('pvAd').value=prof.ad||''; $('pvIl').value=prof.il||''; if(prof.sinif){ const r=document.querySelector(`input[name=sinif][value="${prof.sinif}"]`); if(r) r.checked=true; } }
  let BANK=null;
  const bankP=fetch('/prova/yazili-1.json',{cache:'no-cache'}).then(r=>r.json()).then(j=>BANK=j).catch(()=>null);

  async function katilim(){ if(!DB) return; try{ let t=0; for(const s of [9,10,11]){ const d=await dagRef(s).get(); if(d.exists) t+=d.data().toplam||0; } $('pvKatilim').textContent=t.toLocaleString('tr-TR'); }catch(e){ $('pvKatilim').textContent='—'; } }
  let lbSinif='9';
  async function lb(s){ lbSinif=s; document.querySelectorAll('[data-lb]').forEach(b=>b.setAttribute('aria-selected',b.dataset.lb===s?'true':'false'));
    const L=$('lbList'); if(!DB){ L.innerHTML='<li class="pv-small">Sıralama şu an yüklenemiyor.</li>'; return; }
    L.innerHTML='<li class="pv-small">Yükleniyor…</li>';
    try{ const q=await kayitRef(s).orderBy('puan','desc').limit(40).get(); const r=q.docs.map(d=>d.data()).sort((a,b)=>b.puan-a.puan||a.sure-b.sure).slice(0,10);
      L.innerHTML=r.length?r.map((x,i)=>`<li class="r"><span class="n">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><span class="a">${esc(x.ad)}<small>${esc(x.il||'')}</small></span><span class="p">${x.puan}</span><span class="t">${sureY(x.sure)}</span></li>`).join(''):`<li class="pv-small">Bu hafta ${s}. sınıfta henüz katılım yok. İlk sen ol!</li>`;
    }catch(e){ L.innerHTML='<li class="pv-small">Sıralama şu an yüklenemiyor.</li>'; } }
  document.querySelectorAll('[data-lb]').forEach(b=>b.onclick=()=>lb(b.dataset.lb));
  const sureY=s=>Math.floor((s||0)/60)+':'+String((s||0)%60).padStart(2,'0');
  katilim(); lb(prof&&prof.sinif?String(prof.sinif):'9');

  /* --- sınav --- */
  let S=null, tick=null;
  const maddeSay=()=>sorular().reduce((t,q)=>t+q.maddeler.length,0);
  const dolu=v=>v!==undefined&&v!==null&&String(v).trim()!=='';
  function sayi(v){ const t=String(v).trim().replace(/\s/g,'').replace(/[−–]/g,'-').replace(',','.'); const m=t.match(/^[+-]?(\d+\.?\d*|\.\d+)/); return m?parseFloat(m[0]):NaN; }
  function dogruMu(m,v){ if(!dolu(v)) return false; if(m.t==='num'){ const x=sayi(v); const tol=m.tol!=null?m.tol:Math.max(0.01*Math.abs(m.dogru),0.01); return isFinite(x)&&Math.abs(x-m.dogru)<=tol+1e-9; } return v===m.dogru; }
  function goster(v){ ['vGiris','vSinav','vSonuc'].forEach(x=>$(x).hidden=x!==v); document.body.classList.toggle('pv-sinavda',v==='vSinav'); window.scrollTo(0,0); }
  $('pvForm').addEventListener('submit',async e=>{ e.preventDefault();
    const sinif=(document.querySelector('input[name=sinif]:checked')||{}).value, ad=$('pvAd').value.trim(), il=$('pvIl').value;
    if(!sinif||!ad||!il){ $('pvErr').hidden=false; $('pvErr').textContent='Sınıfını, takma adını ve ilini seç.'; return; }
    $('pvErr').hidden=true; await bankP; if(!BANK){ $('pvErr').hidden=false; $('pvErr').textContent='Sorular yüklenemedi. Sayfayı yenileyip tekrar dene.'; return; }
    LS.set('prova_profil',{ad,il,sinif});
    S={set:SET,sinif,ad,il,bas:Date.now(),cev:{},i:0,tekrar:!!LS.get(ilkKey(sinif))}; LS.set('prova_aktif',S); baslat(); });
  function sorular(){ return BANK.sorular[S.sinif]; }
  function baslat(){ $('pvSinifEt').textContent=S.sinif+'. sınıf'+(S.tekrar?' · tekrar':''); goster('vSinav'); ciz(); clearInterval(tick); tick=setInterval(zaman,500); zaman(); }
  function kalan(){ return Math.max(0,SURE-Math.floor((Date.now()-S.bas)/1000)); }
  function zaman(){ const k=kalan(); $('pvTimer').textContent=sureY(k); $('pvTimer').classList.toggle('az',k<300); if(k<=0) bitir(); }
  function girdi(q,m,v){ const id=`m-${q.id}-${m.k}`;
    if(m.t==='num') return `<div class="pv-in"><input id="${id}" type="text" inputmode="decimal" autocomplete="off" data-k="${m.k}" value="${esc(v||'')}" placeholder="Cevap" aria-label="${m.k} maddesinin cevabı"><span>${esc(m.birim||'')}</span></div>`;
    if(m.ops.length>4) return `<select id="${id}" data-k="${m.k}" aria-label="${m.k} maddesinin cevabı"><option value="">Seç</option>${m.ops.map(o=>`<option${o===v?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
    return `<div class="pv-chips" role="group" aria-label="${m.k} maddesinin cevabı">${m.ops.map(o=>`<button type="button" class="pv-chip" data-k="${m.k}" data-v="${esc(o)}" aria-pressed="${o===v}">${esc(o)}</button>`).join('')}</div>`; }
  function tablo(t){ return t?`<div class="pv-tw"><table class="pv-tablo"><tr>${t.baslik.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr>${t.satirlar.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`:''; }
  function ciz(){ const Q=sorular(), q=Q[S.i], c=S.cev[q.id]||{};
    $('pvSoru').innerHTML=`<div class="meta"><span>Soru ${S.i+1} / ${Q.length}</span><span class="z">${esc(q.konu)}</span><span class="pp">${q.puan} puan</span></div><p class="metin">${esc(q.metin)}</p>${q.svg?`<div class="pv-fig">${q.svg}</div>`:''}${tablo(q.tablo)}<ol class="pv-mds">${q.maddeler.map(m=>`<li class="pv-md${dolu(c[m.k])?' dolu':''}" data-md="${m.k}"><p class="ms"><b>${m.k})</b> ${esc(m.s)} <small>(${m.p} puan)</small></p>${girdi(q,m,c[m.k])}</li>`).join('')}</ol>`;
    $('pvOnceki').disabled=S.i===0; $('pvSonraki').textContent=S.i===Q.length-1?'Başa dön ↺':'Sonraki →';
    durum(); }
  function durum(){ const Q=sorular(); let n=0; const N=maddeSay();
    $('pvDots').innerHTML=Q.map((x,i)=>{ const c=S.cev[x.id]||{}, k=x.maddeler.filter(m=>dolu(c[m.k])).length; n+=k; const cl=k===x.maddeler.length?'ok':k?'yarim':'';
      return `<button type="button" data-i="${i}" class="${cl}" aria-current="${i===S.i}" aria-label="${i+1}. soru, ${k}/${x.maddeler.length} madde cevaplandı">${i+1}</button>`; }).join('');
    $('pvSayac').textContent=n+'/'+N+' madde'; $('pvBitirNot').textContent=n<N?(N-n)+' madde boş':'Tüm maddeler cevaplandı'; return N-n; }
  function kaydet(k,v){ const q=sorular()[S.i]; const c=S.cev[q.id]=S.cev[q.id]||{}; if(dolu(v)) c[k]=v; else delete c[k]; LS.set('prova_aktif',S);
    const li=$('pvSoru').querySelector(`[data-md="${k}"]`); if(li) li.classList.toggle('dolu',dolu(v)); durum(); }
  $('pvSoru').addEventListener('click',e=>{ const b=e.target.closest('.pv-chip'); if(!b) return; const q=sorular()[S.i], c=S.cev[q.id]||{};
    const v=c[b.dataset.k]===b.dataset.v?'':b.dataset.v; b.parentNode.querySelectorAll('.pv-chip').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===v?'true':'false')); kaydet(b.dataset.k,v); });
  $('pvSoru').addEventListener('input',e=>{ const t=e.target; if(t.matches('input[data-k]')) kaydet(t.dataset.k,t.value); });
  $('pvSoru').addEventListener('change',e=>{ const t=e.target; if(t.matches('select[data-k]')) kaydet(t.dataset.k,t.value); });
  $('pvDots').addEventListener('click',e=>{ const b=e.target.closest('[data-i]'); if(b){ S.i=+b.dataset.i; ciz(); window.scrollTo(0,$('vSinav').offsetTop); } });
  $('pvOnceki').onclick=()=>{ if(S.i>0){ S.i--; ciz(); window.scrollTo(0,$('vSinav').offsetTop); } };
  $('pvSonraki').onclick=()=>{ S.i=S.i<sorular().length-1?S.i+1:0; ciz(); window.scrollTo(0,$('vSinav').offsetTop); };
  $('pvBitir').onclick=()=>{ const bos=durum(); const b=$('pvBitir');
    if(bos>0&&b.dataset.onay!=='1'){ b.dataset.onay='1'; b.textContent=bos+' boş madde var, yine de bitir'; setTimeout(()=>{b.dataset.onay='';b.textContent='Provayı bitir';},4000); return; } bitir(); };

  /* --- sonuç --- */
  let SON=null;
  async function bitir(){ if(!S||S.bitti) return; S.bitti=true; clearInterval(tick); LS.del('prova_aktif');
    const Q=sorular(); let d=0,y=0,b=0,puan=0; const zayif={};
    Q.forEach(q=>{ const c=S.cev[q.id]||{}; let kayip=0; q.maddeler.forEach(m=>{ const v=c[m.k]; if(!dolu(v)){ b++; kayip+=m.p; } else if(dogruMu(m,v)){ d++; puan+=m.p; } else { y++; kayip+=m.p; } }); if(kayip) zayif[q.konu]=(zayif[q.konu]||0)+kayip; });
    puan=Math.round(puan); const sure=Math.min(SURE,Math.round((Date.now()-S.bas)/1000));
    SON={puan,d,y,b,sure,sinif:S.sinif,ad:S.ad,il:S.il,zayif};
    $('rEt').textContent=S.sinif+'. SINIF FİZİK YAZILI PROVASI · '+aralik.toLocaleUpperCase('tr-TR');
    $('rPuan').textContent=puan; $('rD').textContent=d; $('rY').textContent=y; $('rB').textContent=b; $('rS').textContent=sureY(sure);
    gozden(Q); urunler(zayif); paylas(); goster('vSonuc');
    window.BFY&&BFY.track&&BFY.track('prova_complete');
    const ilk=!S.tekrar&&!LS.get(ilkKey(S.sinif));
    $('rNot').textContent=ilk?'Sonucun kaydediliyor…':'Bu hafta bu sınıfta daha önce çözdüğün için bu deneme sıralamaya girmedi.';
    if(!DB){ $('rRank').textContent='Sıralama şu an hesaplanamıyor.'; return; }
    try{
      if(ilk){ await kayitRef(S.sinif).add({ad:S.ad.slice(0,20),il:S.il.slice(0,30),puan,dogru:d,sure,ts:firebase.firestore.FieldValue.serverTimestamp()});
        await dagRef(S.sinif).set({['p'+puan]:firebase.firestore.FieldValue.increment(1),toplam:firebase.firestore.FieldValue.increment(1)},{merge:true});
        LS.set(ilkKey(S.sinif),{puan,d,sure}); $('rNot').textContent='Bu denemen haftanın sıralamasına girdi.'; }
      const g=await dagRef(S.sinif).get(); const h=g.exists?g.data():{}; const tot=h.toplam||0;
      let alt=0; for(let i=0;i<puan;i++) alt+=h['p'+i]||0; const es=h['p'+puan]||0;
      if(tot<5){ $('rRank').innerHTML=`Bu hafta ${S.sinif}. sınıfta provaya ilk katılanlardansın. Sıralama, katılım arttıkça netleşecek.`; }
      else{ const ust=Math.max(1,Math.round(100-(alt+es/2)/tot*100)); SON.ust=ust; SON.tot=tot;
        $('rRank').innerHTML=`Bu hafta katılan <b>${tot.toLocaleString('tr-TR')}</b> ${S.sinif}. sınıf öğrencisi arasında <em>ilk %${ust}</em> dilimindesin.`; }
      paylas(); lb(S.sinif);
    }catch(e){ console.warn(e); $('rRank').textContent='Puanın hesaplandı; sıralama şu an kaydedilemedi.'; if(ilk) $('rNot').textContent='Bağlantı sorunu yüzünden sonucun sıralamaya eklenemedi. Daha sonra tekrar çözersen ilk kaydın sayılır.'; }
  }
  function gozden(Q){ $('revList').innerHTML=Q.map((q,i)=>{ const c=S.cev[q.id]||{}; let al=0, bosT=true;
      const satir=q.maddeler.map(m=>{ const v=c[m.k], ok=dogruMu(m,v); if(dolu(v)) bosT=false; if(ok) al+=m.p;
        const dg=m.t==='num'?String(m.dogru).replace('.',',')+(m.birim?' '+m.birim:''):m.dogru;
        return `<li class="${ok?'dogru':(dolu(v)?'sen':'')}"><div class="mdr"><span><b>${m.k})</b> ${esc(m.s)}</span><span class="cv">Senin cevabın: <b>${dolu(v)?esc(v)+(m.t==='num'&&m.birim?' '+esc(m.birim):''):'boş'}</b>${ok?' ✓':` · Doğru cevap: <b>${esc(dg)}</b>`} <span class="pk">${ok?m.p:0}/${m.p}</span></span></div></li>`; }).join('');
      const st=al===q.puan?['d','Tam puan']:(al===0&&bosT?['b','Boş']:['y',al+'/'+q.puan+' puan']);
      return `<details class="pv-rv"><summary><span class="st ${st[0]}">${i+1} · ${st[1]}</span><span class="q">${esc(q.konu)}</span></summary><div class="body"><p class="metin">${esc(q.metin)}</p>${q.svg?`<div class="pv-fig">${q.svg}</div>`:''}${tablo(q.tablo)}<ul>${satir}</ul><div class="coz"><b>Çözüm:</b>\n${esc(q.cozum)}</div></div></details>`; }).join(''); }
  function urunler(zayif){ const z=Object.entries(zayif).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);
    $('upZayif').textContent=z.length?'En çok zorlandığın konular: '+z.join(' ve ')+'. Yazılıdan önce bunları tekrar et.':'Hepsini doğru yaptın, tebrikler! Yazılıya kadar formunu korumak için:';
    $('upGrid').innerHTML=URUN[S.sinif].map(u=>`<article class="pv-up-card"><img src="${u.img}" alt="" loading="lazy" width="72" height="96"><div><h3>${esc(u.ad)}</h3><p>${esc(u.alt)}</p><div class="row"><strong>${esc(u.f)}</strong><a class="cta" href="${u.href}"${u.ext?' target="_blank" rel="noopener noreferrer"':` data-bfy-event="prova_upsell" data-bfy-lab="${u.k}"`}>${esc(u.cta)} ↗</a>${u.dene?`<a class="alt" href="${u.dene}" data-bfy-event="prova_upsell" data-bfy-lab="${u.k}_dene">Ücretsiz dene →</a>`:''}</div></div></article>`).join(''); }
  function paylas(){ const t=`Türkiye geneli ${SON.sinif}. sınıf fizik yazılı provasında ${SON.puan} puan aldım${SON.ust?` (ilk %${SON.ust})`:''}! Sen kaç alırsın? 👉 benfizikyapamiyorum.com/prova`;
    $('rWa').href='https://wa.me/?text='+encodeURIComponent(t); }
  $('rTekrar').onclick=()=>{ S={set:SET,sinif:SON.sinif,ad:SON.ad,il:SON.il,bas:Date.now(),cev:{},i:0,tekrar:true}; LS.set('prova_aktif',S); baslat(); };

  /* --- skor kartı (1080×1350) --- */
  $('rKart').onclick=async()=>{ const c=document.createElement('canvas'); c.width=1080; c.height=1350; const g=c.getContext('2d');
    try{ await document.fonts.ready; }catch(e){}
    const gr=g.createLinearGradient(0,0,0,1350); gr.addColorStop(0,'#214e41'); gr.addColorStop(1,'#163a30'); g.fillStyle=gr; g.fillRect(0,0,1080,1350);
    g.fillStyle='rgba(255,255,255,.06)'; for(let x=0;x<1080;x+=54) for(let y=0;y<1350;y+=54){ g.beginPath(); g.arc(x+27,y+27,2,0,6.28); g.fill(); }
    const logo=new Image(); logo.src='/bfy-logo-3d.webp'; await new Promise(r=>{logo.onload=r;logo.onerror=r;});
    try{ g.drawImage(logo,80,80,120,120); }catch(e){}
    g.fillStyle='#fff'; g.font='800 40px "Plus Jakarta Sans",Arial'; g.fillText('Ben Fizik Yapamıyorum',224,132); g.fillStyle='#d9edaf'; g.font='600 30px "Plus Jakarta Sans",Arial'; g.fillText('benfizikyapamiyorum.com/prova',224,180);
    g.fillStyle='#e9be64'; g.font='800 34px "Plus Jakarta Sans",Arial'; g.fillText(('TÜRKİYE GENELİ · '+SON.sinif+'. SINIF').toLocaleUpperCase('tr-TR'),80,330);
    g.fillStyle='#fff'; g.font='600 76px Fraunces,Georgia,serif'; g.fillText('Fizik Yazılı Provası',80,420);
    g.font='600 330px Fraunces,Georgia,serif'; g.fillStyle='#fff'; const pt=String(SON.puan); g.fillText(pt,70,780); const w=g.measureText(pt).width;
    g.font='600 90px Fraunces,Georgia,serif'; g.fillStyle='#b9d1c4'; g.fillText('/100',90+w,780);
    g.fillStyle='#fff'; g.font='700 52px "Plus Jakarta Sans",Arial'; g.fillText(SON.ust?('İlk %'+SON.ust+' dilimindeyim'):'Provayı tamamladım!',80,900);
    g.fillStyle='#d9e7df'; g.font='600 38px "Plus Jakarta Sans",Arial'; g.fillText(`${SON.d}/${SON.d+SON.y+SON.b} madde doğru · süre ${sureY(SON.sure)}`,80,970);
    g.fillStyle='#e9be64'; g.beginPath(); g.roundRect(80,1110,920,130,26); g.fill(); g.fillStyle='#203d35'; g.font='800 46px "Plus Jakarta Sans",Arial'; g.fillText('Sen kaç alırsın? Hemen çöz →',120,1192);
    c.toBlob(async blob=>{ const f=new File([blob],'bfy-prova-'+SON.puan+'.png',{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[f]})){ try{ await navigator.share({files:[f],text:'benfizikyapamiyorum.com/prova'}); return; }catch(e){} }
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=f.name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500); },'image/png');
    window.BFY&&BFY.track&&BFY.track('prova_card'); };

  /* --- yarım kalan provaya dön --- */
  const ak=LS.get('prova_aktif');
  if(ak&&ak.set===SET&&Date.now()-ak.bas<SURE*1000){ bankP.then(()=>{ if(BANK){ S=ak; baslat(); } }); } else LS.del('prova_aktif');
})();
