/* Altı küçük deney: aynı fizik modeliyle görsel, sonuç ve anlatım. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./lab3d.js').Physics,require('./world3d.js'));
  else root.FizikceConcepts=factory(root.FizikceLab3D.Physics,root.FizikceWorld3D);
})(typeof window!=='undefined'?window:globalThis,(P,W)=>{
  'use strict';
  const supports=type=>['floating','friction','refraction','ohm','wave','heat'].includes(type);
  const fmt=n=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1}).format(Math.abs(n)<1e-9?0:n);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function model(type,state={}){
    if(type==='floating'){
      const value=clamp(Number.isFinite(state.value)?state.value:1,1,1.4),f=P.floating(value);
      return {...f,type,value,min:1,max:1.4,step:.1,unit:' g/cm³',title:'Sıvı yoğunluğu',heading:'Daha az batıyor. Peki kuvvet?',objectY:50+80*f.fraction,
        result:`Batan hacim ${fmt(f.volume)} cm³. Fₖ = G = 0,6 N.`,formula:`Vbatan = 60 / ${fmt(value)} = ${fmt(f.volume)} cm³`,
        insight:'Sıvı yoğunlaştıkça daha küçük bir batan hacim yeterli olur. Dengede kaldırma kuvveti yine aynı ağırlığı karşılar.',
        note:'100 cm³, 60 g küp · g = 10 m/s² · başka düşey kuvvet yok. Farklı yüzme dengelerini karşılaştırıyoruz; aradaki yükseliş temsili. Sıvılar yalnızca yoğunlukları bakımından farklıdır.'};
    }
    if(type==='friction'){
      const value=clamp(Number.isFinite(state.value)?state.value:(state.mode==='moving'?9:3),0,12),f=P.friction(value);
      return {...f,type,value,min:0,max:12,step:1,unit:' N',title:'İtme kuvveti',heading:f.moving?'Sınır aşıldı. Kutu hızlanıyor.':'İtme arttı. Kutu hâlâ durabilir.',acceleration:f.net,
        result:f.moving?`Sürtünme 5 N. Net kuvvet ${fmt(f.net)} N sağa.`:`Statik sürtünme ${fmt(f.friction)} N. Net kuvvet 0 N.`,
        formula:f.moving?`Fnet = ${fmt(value)} − 5 = ${fmt(f.net)} N · a = ${fmt(f.net)} / 1 = ${fmt(f.net)} m/s²`:`Fnet = ${fmt(value)} − ${fmt(f.friction)} = 0 N`,
        insight:f.moving?'Kayma başladıktan sonra bu modelde sürtünme 5 N. Net kuvvet kutuyu sağa hızlandırır.':'Statik sürtünme, gerekli olduğu kadar kuvvet uygular; sınırı olan 8 N’ye her zaman eşit değildir.',
        note:'Her deneme durgun 1 kg kutuyla başlar · yatay düzlem · statik sınır 8 N, kinetik sürtünme 5 N · sabit itme · N = G = 10 N. Çizim ölçekli değildir.'};
    }
    if(type==='refraction'){
      const value=clamp(Number.isFinite(state.value)?state.value:30,0,70),f=P.refraction(value);
      return {...f,type,value,min:0,max:70,step:5,unit:'°',title:'Gelme açısı',heading:'Açıyı yüzeyden mi ölçtün?',
        result:`i = ${fmt(value)}° · r = ${fmt(f.degrees)}°`,formula:`sin r = sin ${fmt(value)}° / 1,5 → r = ${fmt(f.degrees)}°`,
        insight:value===0?'Işın normal boyunca geçer; yön değiştirmez. Camda sürati yine azalır.':'Camda sürat azalır. Kırılma açısı gelme açısından küçüktür: ışın normale yaklaşır.',
        note:'Hava n = 1, cam n = 1,5 · açılar yüzey normalinden ölçülür · ışığın yolu yavaşlatılarak gösterilir. Yansıyan ışın bu modelde gösterilmiyor.'};
    }
    if(type==='ohm'){
      const value=clamp(Number.isFinite(state.value)?state.value:6,3,12),resistance=6,current=value/resistance,power=value*current,heatLevel=power/24;
      return {type,value,resistance,current,power,heatLevel,min:3,max:12,step:3,unit:' V',title:'Direncin uçları arasındaki gerilim',heading:'Gerilimi artır. Telin kızarmasını izle.',
        result:`Akım ${fmt(current)} A. Direnç yine 6 Ω.`,formula:`I = V / R = ${fmt(value)} / 6 = ${fmt(current)} A`,
        insight:'Aynı dirençte gerilim ve akım birlikte artar. V / I oranı sabit kalır; tek başına akım artışı direncin arttığını göstermez.',
        action:'Gerilimi artır, kızarmayı izle',start:3,end:12,startMessage:'Gerilim 3 V’tan 12 V’a çıkıyor. Telin rengi, artan ısınma gücünü gösteriyor.',endMessage:'Akım 0,5 A → 2 A; ısınma gücü 1,5 W → 24 W. Gerilim 4 katına, güç 16 katına çıktı. R yine 6 Ω.',
        note:'İdeal üreteç ve kablolar · R = 6 Ω sabit kabul edilir; sıcaklıkla direnç değişimi hesaba katılmaz. Kıvrımlı tel temsili bir iç görünümdür. Kızarma, ısınma gücünü gösterir; tel sıcaklığı veya gerçek akkorlaşma rengi hesaplanmaz. Akım oku geleneksel akım yönüdür.'};
    }
    if(type==='wave'){
      const value=clamp(Number.isFinite(state.value)?state.value:20,10,40),frequency=2,wavelength=value/frequency;
      return {type,value,frequency,wavelength,min:10,max:40,step:10,unit:' cm/s',title:'İkinci bölgedeki yayılma sürati',heading:'Dalga sıklaştı. Kaynak hızlandı mı?',
        result:`f = 2 Hz · λ₂ = ${fmt(wavelength)} cm`,formula:`λ₂ = v₂ / f = ${fmt(value)} / 2 = ${fmt(wavelength)} cm`,
        insight:value===40?'İki bölgede sürat eşit; dalga boyları da eşit. Kaynak her saniye yine iki titreşim yapar.':'İkinci bölgede sürat azalınca dalga boyu küçülür. Sınırı geçen dalganın frekansı kaynağın frekansıyla aynı kalır.',
        action:'▶ Dalgayı oynat',start:40,end:10,startMessage:'Kaynak aynı. İkinci bölgedeki sürati 40’tan 10 cm/s’ye indiriyoruz.',endMessage:'Dalga boyu 20 cm’den 5 cm’ye indi. Frekans iki bölgede de 2 Hz.',
        note:'Aynı kaynakla üretilen su dalgaları · sınıra dik geliş · birinci bölgede v₁ = 40 cm/s · genlik sabit gösterildi. Oynatma ¼ hızdadır: ekrandaki 2 saniye, modelde 0,5 saniyedir. Dalga tepeleri sağa ilerler; frekans iki bölgede de 2 Hz kalır. Sürati değiştirdiğinde yeni bir kararlı dalga düzeni gösterilir; geçiş süreci ve yansıma modellenmez.'};
    }
    if(type==='heat'){
      const value=clamp(Number.isFinite(state.value)?state.value:200,100,400),mass=value/1000,energy=8400,specificHeat=4200,initial=20,delta=energy/(mass*specificHeat),temperature=initial+delta;
      return {type,value,mass,energy,specificHeat,initial,delta,temperature,min:100,max:400,step:100,unit:' g',title:'İkinci kaptaki suyun kütlesi',heading:'Aynı enerji. Aynı sıcaklık mı?',
        result:`Sıcaklık artışı ${fmt(delta)} °C. Son sıcaklık ${fmt(temperature)} °C.`,formula:`ΔT = Q / (m × c) = 8400 / (${fmt(mass)} × 4200) = ${fmt(delta)} °C`,
        insight:value===100?'Kütleler ve diğer koşullar aynı; iki kapta da sıcaklık artışı 20 °C.':'Aynı maddeye aynı enerji aktarılıyor. Daha fazla su, daha küçük sıcaklık artışı demek. Isı miktarı ve sıcaklık artışı aynı nicelik değildir.',
        action:'Suyu artır, farkı izle',start:100,end:400,startMessage:'Her kap 8400 J alıyor. İkinci kaptaki suyu 100 g’dan 400 g’a çıkarıyoruz.',endMessage:'Sıcaklık artışı 20 °C’den 5 °C’ye indi. İki kaba aktarılan enerji yine aynı: 8400 J.',
        note:'Her deneme 20 °C suyla başlar · c = 4200 J/(kg·°C) sabit · her kaba 8400 J aktarılır · ısı kaybı, kapların ısı sığası ve hâl değişimi yok. Farklı kütlelerle yapılan deneylerin son durumlarını karşılaştırıyoruz.'};
    }
    throw new RangeError('Desteklenmeyen fizik modeli.');
  }
  function frame(type,state,progress){
    const m=model(type,state),p=clamp(Number.isFinite(progress)?progress:0,0,1);
    if(type==='floating'){const value=Math.round((1+.4*p)*10)/10;return {value,objectY:model(type,{value}).objectY};}
    if(type==='friction'){const time=2*p,distance=.5*m.acceleration*time*time;return {time,distance,speed:m.acceleration*time,offset:distance*7,moving:m.moving};}
    if(['ohm','wave','heat'].includes(type)){const value=m.start+(m.end-m.start)*p;return {value:clamp(Math.round(value/m.step)*m.step,m.min,m.max)};}
    const elapsed=p*2.5,glass=elapsed>1,q=glass?(elapsed-1)/1.5:elapsed;
    const from=glass?[180,130]:[180-100*Math.sin(m.i),130-100*Math.cos(m.i)],to=glass?[180+100*Math.sin(m.r),130+100*Math.cos(m.r)]:[180,130];
    return {x:from[0]+(to[0]-from[0])*q,y:from[1]+(to[1]-from[1])*q,glass};
  }
  function scene(type,state={}){return W.concept(type,model(type,state),state);}
  function steps(type,state={}){
    const m=model(type,state),target=name=>`[data-concept-target="${name}"]`;
    if(type==='floating')return [
      {target:target('control'),text:`1. Sıvı yoğunluğu ${fmt(m.value)} g/cm³. Küpün kütlesi 60 g; toplam hacmi 100 cm³. Küp değişmedi.`},
      {target:target('volume'),text:`2. Denge için ρsıvı × Vbatan = 60 g. Batan hacim: 60 / ${fmt(m.value)} = ${fmt(m.volume)} cm³.`},
      {target:target('weight'),text:'3. Ağırlık aşağı yönlüdür: G = m × g = 0,06 kg × 10 = 0,6 N. Kütleyi kilogram olarak kullan.'},
      {target:target('buoyancy'),text:'4. Düşey dengede yukarı yönlü kaldırma kuvveti ağırlığı dengeler: Fₖ = G = 0,6 N.'},
      {target:target('formula'),text:'5. Daha yoğun sıvı → daha az batan hacim. “Daha az batıyor” demek, dengede kaldırma kuvveti azaldı demek değildir.'}
    ];
    if(type==='friction')return [
      {target:target('control'),text:`1. Durgun kutuyu ${fmt(m.force)} N ile sağa itiyoruz. Statik sürtünmenin sınırı 8 N.`},
      {target:m.force===0?target('friction-value'):target('friction'),text:m.moving?'2. İtme 8 N sınırını aştı; kutu kaymaya başlıyor. Kayarken bu modelde sürtünme 5 N.':`2. Statik sürtünme itmeye karşı ${fmt(m.friction)} N uyguluyor. ${m.force===8?'Tam sınırda; bu ideal modelde henüz kayma yok.':'Sınır olan 8 N’yi doğrudan kullanma.'}`},
      {target:target('formula'),text:`3. Sağı pozitif al: Fnet = ${fmt(m.force)} − ${fmt(m.friction)} = ${fmt(m.net)} N.`},
      {target:target('result'),text:m.moving?`4. Kütle 1 kg: a = Fnet / m = ${fmt(m.net)} / 1 = ${fmt(m.acceleration)} m/s². “Kutuyu dene” ile hareketi izle.`:'4. Net kuvvet 0; kutu başlangıçta durduğu için durmaya devam eder. Kuvvet uygulamak tek başına hareket garantisi değildir.'}
    ];
    if(type==='ohm')return [
      {target:target('resistor'),text:'1. Sabit olanı bul: R = 6 Ω. Bu ideal modelde sıcaklığın dirence etkisi hesaba katılmıyor.'},
      {target:target('voltage'),text:`2. Direncin uçları arasındaki gerilim ${fmt(m.value)} V. Akımı bulmak için gerilimi dirence böl.`},
      {target:target('formula'),text:`3. I = V / R = ${fmt(m.value)} / 6 = ${fmt(m.current)} A. Volt / ohm bize amper verir.`},
      {target:target('current'),text:`4. Kontrol et: V / I = ${fmt(m.value)} / ${fmt(m.current)} = 6 Ω. Akım değişti; direnç değişmedi.`},
      {target:target('heating'),text:`5. Isınma gücü: P = V × I = ${fmt(m.value)} × ${fmt(m.current)} = ${fmt(m.power)} W. P = V² / R: gerilim iki katına çıkarsa güç dört katına çıkar. Telin kızarması bu gücü temsil eder.`}
    ];
    if(type==='wave')return [
      {target:target('frequency'),text:'1. Kaynak değişmiyor: f = 2 Hz. Sınırı geçen dalganın frekansını da 2 Hz al.'},
      {target:target('speed'),text:`2. İkinci bölgenin sürati ${fmt(m.value)} cm/s. Sürat ortama bağlıdır; frekansla karıştırma.`},
      {target:target('formula'),text:`3. v = f × λ. Dalga boyu için sürati frekansa böl: λ₂ = ${fmt(m.value)} / 2 = ${fmt(m.wavelength)} cm.`},
      {target:target('wavelength'),text:`4. Turuncu aralık bir dalga boyu: ${fmt(m.wavelength)} cm. Sürat küçülünce aynı frekansta tepeler birbirine yaklaşır.`}
    ];
    if(type==='heat')return [
      {target:target('energy'),text:'1. İki kaba da aktarılan enerji 8400 J. Başlangıç sıcaklığı 20 °C; madde aynı: su.'},
      {target:target('control'),text:`2. Joule ve kilogramlı öz ısı kullanıyoruz. ${fmt(m.value)} g / 1000 = ${fmt(m.mass)} kg.`},
      {target:target('formula'),text:`3. Önce kütleyi öz ısıyla çarp: m × c = ${fmt(m.mass)} × 4200 = ${fmt(m.mass*4200)} J/°C. Bu, suyun ısı sığasıdır.`},
      {target:target('result'),text:`4. Enerjiyi ısı sığasına böl: ΔT = 8400 / ${fmt(m.mass*4200)} = ${fmt(m.delta)} °C. Bulduğun, son sıcaklık değil; sıcaklık artışı.`},
      {target:target('temperature'),text:`5. Başlangıç sıcaklığına ekle: Tson = 20 + ${fmt(m.delta)} = ${fmt(m.temperature)} °C.`}
    ];
    return [
      {target:target('normal'),text:'1. Kesikli çizgi yüzeye diktir: normal. Gelme ve kırılma açılarını bu çizgiden ölç.'},
      {target:target('incident'),text:`2. Havadaki gelme açısı ${fmt(m.value)}°. Hava n = 1, cam n = 1,5.`},
      {target:target('formula'),text:`3. Snell Yasası: 1 × sin i = 1,5 × sin r. Bu yüzden sin r = sin ${fmt(m.value)}° / 1,5.`},
      {target:target('refracted'),text:m.value===0?'4. i = r = 0°. Işın yön değiştirmeden geçer; camda sürati azalır.':`4. r = ${fmt(m.degrees)}°; gelme açısından küçük. Işın camda normale yaklaşır. “Işının yolunu izle” ile takip et.`}
    ];
  }
  function stats(type,state){const m=model(type,state);return `${type==='floating'?`<p class="concept-volume" data-concept-target="volume">Batan hacim <strong>${fmt(m.volume)} cm³</strong></p>`:type==='friction'?`<p class="concept-volume" data-concept-target="friction-value">Sürtünme <strong>${fmt(m.friction)} N</strong></p>`:''}<p class="graph-result-value" data-concept-target="result">${esc(m.result)}</p><p class="graph-formula" data-concept-target="formula">${esc(m.formula)}</p>${type==='ohm'?`<div class="concept-power"><p class="concept-volume">Isınma gücü <strong>${fmt(m.power)} W</strong></p><p class="graph-formula">P = V × I = ${fmt(m.value)} × ${fmt(m.current)} = ${fmt(m.power)} W</p><p class="graph-explanation">Gerilim 2 katına çıkarsa güç 4 katına çıkar. Renk bu gücü temsil eder; sıcaklık ölçeği değildir.</p></div>`:''}<p class="graph-explanation">${esc(m.insight)}</p>`;}
  function render(type,state={}){
    const m=model(type,state),presets={floating:[1,1.2,1.4],friction:[3,8,9],refraction:[0,30,60],ohm:[3,6,9,12],wave:[10,20,40],heat:[100,200,400]}[type],action=m.action||(type==='floating'?'Yoğunluğu artır, farkı izle':type==='friction'?'Kutuyu dene':'Işının yolunu izle');
    return `<div class="graph-lab concept-lab" data-teaching-lab><div class="visual-topline"><span class="section-label">Değiştir, nedenini gör</span><span class="visual-badge">Küçük deney</span></div><h3 class="concept-heading">${m.heading}</h3><div class="concept-stage"><div class="concept-player"><div class="concept-actions"><button type="button" data-concept-experiment data-label="${action}">${action}</button><button type="button" data-concept-reset>Başa dön ↺</button></div><p class="concept-demo-status" role="status" aria-live="polite"></p>${type==='wave'?'<p class="wave-play-hint">¼ hız · Oynarken sürati de değiştirebilirsin.</p>':''}</div><div class="concept-drawing">${scene(type,state)}</div></div><label class="visual-slider concept-slider" for="concept-range" data-concept-target="control"><span>${m.title}</span><input id="concept-range" type="range" data-concept-range aria-label="${m.title}" min="${m.min}" max="${m.max}" step="${m.step}" value="${m.value}" aria-valuetext="${fmt(m.value)}${m.unit}"><output for="concept-range" aria-live="off">${fmt(m.value)}${m.unit}</output></label><div class="concept-presets" role="group" aria-label="Hazır deney değerleri">${presets.map(v=>`<button type="button" data-concept-preset="${v}" aria-pressed="${Math.abs(v-m.value)<.001}">${fmt(v)}${m.unit}${type==='friction'?(v===8?' · sınır':v===9?' · kayar':' · dengede'):''}</button>`).join('')}</div><button type="button" class="graph-guide-start" data-guide-start>Nasıl oluyor? Adım adım göster →</button><div class="graph-guide-panel" hidden><p class="graph-guide-text" role="status" aria-live="polite"></p><div class="graph-guide-controls"><button type="button" data-guide-back aria-label="Önceki açıklama adımı">←</button><span class="graph-guide-count"></span><button type="button" data-guide-play>Duraklat</button><button type="button" data-guide-next aria-label="Sonraki açıklama adımı">→</button></div></div><span class="graph-guide-arrow" aria-hidden="true" hidden>➜</span><div class="graph-result concept-stats" data-concept-stats>${stats(type,state)}</div><p class="visual-note">${m.note}</p></div>`;
  }
  return {supports,model,frame,scene,steps,stats,render};
});
