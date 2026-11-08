// 10. sınıf, Hafta 9 (9–13 Kasım 2026): İş, enerji ve güç ilişkisi (P = W/t, kWh)
// TYMM FİZ.10.2.2: a) hipotez kurar, b) ilişkileri listeler, c) karşılaştırır, ç) iş-güç ilişkisine yönelik önermede bulunur,
// d) önermelerini matematiksel modele dönüştürerek değerlendirir. g = 10 m/s².
module.exports = {
  slug: '10-hafta-09-is-enerji-guc',
  baslik: '10. Sınıf Fizik: İş, Enerji ve Güç İlişkisi',
  dersAdi: '10. sınıf, iş, enerji ve güç',
  slaytlar: (k) => {
    // Şekil 1: merdiven, 12 m, iki öğrenci
    let basamak = '';
    for (let i = 0; i < 6; i++) basamak += `<rect x="${60 + i * 50}" y="${330 - (i + 1) * 45}" width="${(6 - i) * 50}" height="45" fill="${i % 2 ? '#e3e0d6' : '#ece8de'}" stroke="#cfc9ba"/>`;
    const s1 = k.svg(440, 380, basamak +
      `<line x1="10" y1="330" x2="400" y2="330" stroke="#6b7d76" stroke-width="3"/>` +
      k.ok({ x1: 395, y1: 330, x2: 395, y2: 60, ad: 'h', renk: '#b06a3b', kalin: 4, etiket: 'h = 12 m', ex: -10, ey: -16 }) +
      `<g class="vek" data-ad="ali"><circle cx="85" cy="268" r="15" fill="#244f40"/><text x="85" y="235" font-size="22" font-weight="800" fill="#244f40" text-anchor="middle">Ali</text></g>` +
      `<g class="vek" data-ad="veli"><circle cx="33" cy="312" r="17" fill="#1d3b8f"/><text x="33" y="280" font-size="22" font-weight="800" fill="#1d3b8f" text-anchor="middle">Veli</text></g>`);

    // Şekil 2: cihaz güç etiketi
    const etiket = (x, y, ad, guc, renk, id) => `<g class="vek" data-ad="${id}"><rect x="${x}" y="${y}" width="300" height="88" rx="12" fill="#fff" stroke="${renk}" stroke-width="3"/>
      <text x="${x + 18}" y="${y + 36}" font-size="24" font-weight="800" fill="#173430">${ad}</text>
      <text x="${x + 18}" y="${y + 70}" font-size="24" font-weight="700" fill="${renk}">${guc}</text></g>`;
    const s2 = k.svg(340, 330, etiket(20, 10, 'Elektrikli ısıtıcı', '2000 W, 220–240 V', '#b06a3b', 'isitici') +
      etiket(20, 120, 'Saç kurutma mak.', '2000 W', '#1d3b8f', 'kurutma') +
      etiket(20, 230, 'LED lamba (6 adet)', 'tanesi 10 W', '#244f40', 'led'));

    return [
      k.kapak({ etiket: '10. SINIF FİZİK, HAFTA 9', baslik: 'İş, enerji ve güç.', vurgu: 'Ne kadar ve ne kadar hızlı?', aciklama: 'Güç nedir, elektrik faturasındaki kWh neyi ölçer ve “daha çok iş yapan daha güçlüdür” doğru mu?' }),
      k.konu({
        etiket: 'HİPOTEZ KURALIM', kod: 'FİZ.10.2.2', baslik: 'İki öğrenci, aynı merdiven', sekil: s1,
        maddeler: [
          { metin: 'Ali (50 kg) 12 m yüksekliğe merdivenle 20 saniyede, Veli (60 kg) 30 saniyede çıkıyor.', vurgu: 'ali,veli,h' },
          'Hipotez 1: Ağırlığı büyük olan Veli daha çok iş yapar.',
          'Hipotez 2: Daha kısa sürede çıkan Ali daha güçlüdür.',
          { formul: 'İkisini de birazdan hesapla sınayacağız.', aciklama: 'Önce iş, enerji ve güç arasındaki ilişkileri listeleyelim.' },
        ],
      }),
      k.konu({
        etiket: 'İLİŞKİLERİ LİSTELEYELİM', kod: 'FİZ.10.2.2', baslik: 'İş, enerji ve güç arasındaki bağ',
        maddeler: [
          '<b>İş:</b> Cisim, kuvvet doğrultusunda yer değiştirdiğinde kuvvet iş yapar. W = F · Δx, birimi joule (J).',
          '<b>Enerji:</b> İş yapıldığında enerji bir yerden başka bir yere aktarılır ya da bir biçimden başka bir biçime dönüşür. Yapılan iş kadar enerji aktarılır.',
          '<b>Güç:</b> Bu aktarımın ne kadar hızlı olduğudur. Birim zamanda yapılan iş.',
          { formul: 'P = W / t', aciklama: 'Birimi watt (W). 1 W = 1 J/s, yani her saniye 1 joule enerji aktarılması. 1 kW = 1000 W.' },
        ],
      }),
      k.konu({
        etiket: 'KARŞILAŞTIRALIM', kod: 'FİZ.10.2.2', baslik: 'İş ile güç aynı şey değil',
        maddeler: [
          'İş ve enerji “ne kadar” sorusunun cevabıdır. Güç “ne kadar hızlı” sorusunun cevabıdır.',
          'Aynı iş daha kısa sürede yapılırsa güç artar.',
          'Güç sabitse, süre iki katına çıkınca yapılan iş de iki katına çıkar.',
          { formul: 'W = P · t', aciklama: 'Gücü bilinen bir cihazın aktardığı enerji, gücüyle çalışma süresinin çarpımıdır.' },
        ],
      }),
      k.konu({
        etiket: 'MATEMATİKSEL MODEL', kod: 'FİZ.10.2.2', baslik: 'Faturadaki kWh ne demek?', sekil: s2,
        maddeler: [
          'kWh (kilovatsaat) bir güç birimi değil, bir <b>enerji</b> birimidir.',
          { formul: '1 kWh = 1000 W × 3600 s = 3 600 000 J', aciklama: '1 kW gücündeki bir cihazın 1 saat çalışınca aktardığı enerji.' },
          { metin: 'Örnek: 2000 W’lık ısıtıcı 3 saat çalışırsa 2 kW × 3 h = 6 kWh enerji harcar.', vurgu: 'isitici' },
          'Fatura cihazın gücüne göre değil, harcanan enerjiye (kWh) göre ödenir.',
        ],
      }),
      k.soru({
        etiket: 'HİPOTEZİ SINAYALIM', baslik: 'Merdivende kim daha güçlü?', sekil: s1,
        baglam: 'Ali (50 kg) 12 m yüksekliğe 20 saniyede, Veli (60 kg) aynı yüksekliğe 30 saniyede çıkıyor. İkisi de merdiveni sabit süratle çıkıyor. g = 10 m/s² alınız.',
        maddeler: [
          {
            metin: 'Her birinin kendi ağırlığına karşı yaptığı işi bulunuz.', puan: '4 puan',
            adimlar: [
              'Sabit süratle yükselmek için ağırlığa eşit büyüklükte, düşey yukarı yönlü bir kuvvet gerekir. Kuvvet düşey olduğundan yalnız yükseklik önemlidir: W = G · h, G = m · g',
              { metin: 'Ali: G = 50 · 10 = 500 N,  W = 500 · 12 = 6000 J', vurgu: 'ali,h' },
              { metin: 'Veli: G = 60 · 10 = 600 N,  W = 600 · 12 = 7200 J', vurgu: 'veli,h' },
            ],
            cevap: 'Ali 6000 J, Veli 7200 J. Hipotez 1 doğru.',
          },
          {
            metin: 'Her birinin gücünü bulunuz.', puan: '4 puan',
            adimlar: [
              { metin: 'Ali: P = 6000 / 20 = 300 W', vurgu: 'ali' },
              { metin: 'Veli: P = 7200 / 30 = 240 W', vurgu: 'veli' },
            ],
            cevap: 'Ali 300 W, Veli 240 W. Hipotez 2 doğru.',
          },
          {
            metin: '“Daha çok iş yapan her zaman daha güçlüdür.” önermesini değerlendiriniz.', puan: '2 puan',
            adimlar: ['Veli daha çok iş yaptı ama gücü daha küçük.'],
            cevap: 'Önerme yanlış. Güç, işin ne kadar sürede yapıldığına da bağlıdır: P = W / t.',
          },
        ],
      }),
      k.soru({
        etiket: 'GÜNLÜK HAYAT', baslik: 'Evin elektrik tüketimi', sekil: s2,
        baglam: 'Bir evde her gün 2000 W’lık ısıtıcı 3 saat, 2000 W’lık saç kurutma makinesi 6 dakika, tanesi 10 W olan 6 LED lamba 5 saat çalışıyor.',
        maddeler: [
          {
            metin: 'Isıtıcının bir günde harcadığı enerji kaç kWh ve kaç J’dür?', puan: '3 puan',
            adimlar: [
              { metin: 'E = P · t = 2 kW × 3 h = 6 kWh', vurgu: 'isitici' },
              '6 × 3 600 000 J = 21 600 000 J',
            ],
            cevap: '6 kWh = 21 600 000 J',
          },
          {
            metin: '“Gücü büyük olan cihaz her zaman daha çok enerji harcar.” önermesini saç kurutma makinesi ve lambalarla değerlendiriniz.', puan: '4 puan',
            adimlar: [
              { metin: 'Saç kurutma: 2 kW × 0,1 h = 0,2 kWh  (6 dakika = 0,1 saat)', vurgu: 'kurutma' },
              { metin: 'Lambalar: 6 × 10 W = 60 W = 0,06 kW,  0,06 kW × 5 h = 0,3 kWh', vurgu: 'led' },
            ],
            cevap: 'Önerme yanlış. Gücü çok küçük lambalar daha çok enerji harcadı, çünkü E = P · t.',
          },
          {
            metin: 'Bu üç cihazın 30 günde harcadığı toplam enerjiyi bulunuz. 1 kWh’nin bedeli 3 TL kabul edilirse ödenecek tutar ne olur?', puan: '3 puan',
            adimlar: [
              'Bir gün: 6 + 0,2 + 0,3 = 6,5 kWh',
              '30 gün: 6,5 × 30 = 195 kWh',
            ],
            cevap: '195 kWh, 195 × 3 = 585 TL',
          },
        ],
      }),
      k.kapanis({ baslik: 'Güç: işin ne kadar hızlı yapıldığı.', vurgu: 'Gelecek ders: enerji biçimleri.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
