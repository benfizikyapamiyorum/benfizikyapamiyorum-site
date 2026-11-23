// 10. sınıf, Enerji ünitesi 2. ders: İş, enerji ve güç ilişkisi; güç (yaklaşık 20 dakikalık video)
// MEB ders kitabı 2.1 B) İş, Enerji ve Güç Kavramları Arasındaki İlişki, s. 93-101 ile paralel:
// iş-enerji değişimi (net iş), vinç karşılaştırması, merdiven yarışı, P = W / t, güçten kuvvete (rampa), forklift, balkon motoru, aynı sürede iki işçi.
// TYMM FİZ.10.2.2. Önceki ders: 10-is-kuvvet-yer-degistirme. Sonraki ders: 10-kwh-elektrik-faturasi. g = 10 m/s².
module.exports = {
  slug: '10-guc',
  baslik: '10. Sınıf Fizik: İş, Enerji ve Güç İlişkisi',
  dersAdi: '10. sınıf, güç',
  slaytlar: (k) => {
    const T = '#b06a3b', N = '#1d3b8f', G = '#244f40', M = '#7a3e9d';
    const yz = (x, y, t, renk = '#173430', boy = 22, a = 'middle') => `<text x="${x}" y="${y}" font-size="${boy}" font-weight="800" fill="${renk}" text-anchor="${a}">${t}</text>`;

    // Şekil: masadaki koli, itme ve sürtünme
    const sKoli = k.svg(520, 300,
      `<rect x="20" y="200" width="480" height="14" fill="#cfc9ba"/>` + k.kutu(250, 165, 70, '3 kg') +
      k.ok({ x1: 285, y1: 165, x2: 440, y2: 165, ad: 'F', renk: T, etiket: 'F = 20 N', ex: -62, ey: -18 }) +
      k.ok({ x1: 215, y1: 165, x2: 120, y2: 165, ad: 'f', renk: M, etiket: 'f = 8 N', ex: 30, ey: -18 }) +
      k.ok({ x1: 215, y1: 252, x2: 395, y2: 252, ad: 'dx', renk: N, kalin: 5, etiket: 'Δx = 5 m', ex: -90, ey: 34 }));

    // Şekil: iki vinç, özdeş yükler
    const vinc = (x, ad, sure, renk) => `<g class="vek" data-ad="${ad}"><line x1="${x - 70}" y1="340" x2="${x - 70}" y2="50" stroke="${renk}" stroke-width="9" stroke-linecap="round"/><line x1="${x - 70}" y1="50" x2="${x + 14}" y2="50" stroke="${renk}" stroke-width="9" stroke-linecap="round"/><line x1="${x}" y1="50" x2="${x}" y2="126" stroke="#6b7d76" stroke-width="3"/>` +
      `<rect x="${x - 36}" y="126" width="72" height="56" rx="7" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/>${yz(x, 162, '200 kg', '#173430', 19)}${yz(x - 22, 30, ad + ' vinci', renk, 22)}${yz(x - 20, 372, sure, renk, 22)}</g>`;
    const sVinc = k.svg(500, 384, `<line x1="10" y1="340" x2="490" y2="340" stroke="#6b7d76" stroke-width="3"/>` + vinc(130, 'K', '20 saniye', G) + vinc(400, 'L', '30 saniye', N) +
      k.ok({ x1: 250, y1: 340, x2: 250, y2: 184, ad: 'h', renk: T, kalin: 4, etiket: 'h = 15 m', ex: 0, ey: -14 }));

    // Şekil: merdiven, 12 m, iki öğrenci
    let basamak = '';
    for (let i = 0; i < 6; i++) basamak += `<rect x="${60 + i * 50}" y="${330 - (i + 1) * 45}" width="${(6 - i) * 50}" height="45" fill="${i % 2 ? '#e3e0d6' : '#ece8de'}" stroke="#cfc9ba"/>`;
    const sMer = k.svg(440, 380, basamak +
      `<line x1="10" y1="330" x2="400" y2="330" stroke="#6b7d76" stroke-width="3"/>` +
      k.ok({ x1: 395, y1: 330, x2: 395, y2: 60, ad: 'h', renk: T, kalin: 4, etiket: 'h = 12 m', ex: -10, ey: -16 }) +
      `<g class="vek" data-ad="ali"><circle cx="85" cy="268" r="15" fill="#244f40"/><text x="85" y="235" font-size="22" font-weight="800" fill="#244f40" text-anchor="middle">Ali</text></g>` +
      `<g class="vek" data-ad="veli"><circle cx="33" cy="312" r="17" fill="#1d3b8f"/><text x="33" y="280" font-size="22" font-weight="800" fill="#1d3b8f" text-anchor="middle">Veli</text></g>`);

    // Şekil: rampa, rampaya paralel kuvvet (eğim açısı atan(180/400))
    const ca = 400 / Math.hypot(400, 180), sa = 180 / Math.hypot(400, 180), aci = Math.atan2(180, 400) * 180 / Math.PI;
    const bx = 40 + 150, by = 290 - 150 * 180 / 400, mx = bx - sa * 34, my = by - ca * 34;
    const sRampa = k.svg(500, 330,
      `<polygon points="40,290 440,290 440,110" fill="#ece8de" stroke="#cfc9ba" stroke-width="3"/>` +
      `<g transform="translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${(-aci).toFixed(2)})"><rect x="-34" y="-30" width="68" height="60" rx="7" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/></g>` +
      k.ok({ x1: mx + ca * 46, y1: my - sa * 46, x2: mx + ca * 166, y2: my - sa * 166, ad: 'F', renk: T, etiket: 'F', ex: 4, ey: -18 }) +
      `<g class="vek" data-ad="yol">${yz(300, 268, 'rampa uzunluğu 12 m', N, 21)}</g>`);

    // Şekil: forklift ve balkon motoru
    const sFork = k.svg(520, 370,
      `<line x1="10" y1="330" x2="510" y2="330" stroke="#6b7d76" stroke-width="3"/>` +
      `<g class="vek" data-ad="fork"><rect x="118" y="70" width="12" height="260" fill="#6b7d76"/><rect x="40" y="262" width="80" height="50" rx="8" fill="#244f40"/><circle cx="58" cy="318" r="12" fill="#173430"/><circle cx="104" cy="318" r="12" fill="#173430"/>` +
      `<rect x="130" y="150" width="86" height="8" fill="#173430"/><rect x="140" y="94" width="66" height="56" rx="7" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/>${yz(173, 130, '2 ton', '#173430', 20)}` +
      `<rect x="140" y="274" width="66" height="56" rx="7" fill="none" stroke="#b06a3b" stroke-width="2.5" stroke-dasharray="7 6"/></g>` +
      k.ok({ x1: 232, y1: 330, x2: 232, y2: 152, ad: 'fh', renk: T, kalin: 4, etiket: '3 m', ex: 36, ey: 110 }) +
      `<g class="vek" data-ad="motor"><rect x="388" y="40" width="112" height="290" fill="#ece8de" stroke="#cfc9ba" stroke-width="3"/><rect x="372" y="118" width="128" height="10" fill="#6b7d76"/><circle cx="372" cy="106" r="15" fill="#1d3b8f"/>${yz(444, 96, '100 W', N, 21)}` +
      `<line x1="358" y1="110" x2="358" y2="270" stroke="#6b7d76" stroke-width="3"/><rect x="328" y="270" width="60" height="56" rx="7" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/>${yz(358, 306, '20 kg', '#173430', 19)}</g>` +
      k.ok({ x1: 312, y1: 330, x2: 312, y2: 124, ad: 'mh', renk: T, kalin: 4, etiket: 'h = ?', ex: -22, ey: -14 }));

    // Şekil: iki işçi, koliler C noktasında buluşuyor
    const sIki = k.svg(560, 270,
      `<rect x="20" y="170" width="520" height="14" fill="#cfc9ba"/>` + k.kutu(70, 135, 64, '') + k.kutu(490, 135, 64, '') +
      k.ok({ x1: 104, y1: 135, x2: 224, y2: 135, ad: 'S', renk: G, etiket: '30 N', ex: -50, ey: -18 }) +
      k.ok({ x1: 456, y1: 135, x2: 376, y2: 135, ad: 'B', renk: N, etiket: '20 N', ex: 36, ey: -18 }) +
      `<line x1="310" y1="92" x2="310" y2="200" stroke="#6b7d76" stroke-width="3" stroke-dasharray="8 7"/>${yz(310, 80, 'C', '#173430', 24)}` +
      `<g class="vek" data-ad="S">${yz(190, 232, '12 m', G, 22)}${yz(70, 82, 'Selim', G, 21)}</g><g class="vek" data-ad="B">${yz(400, 232, '9 m', N, 22)}${yz(490, 82, 'Barış', N, 21)}</g>` +
      `<line x1="70" y1="204" x2="310" y2="204" stroke="${G}" stroke-width="3"/><line x1="310" y1="204" x2="490" y2="204" stroke="${N}" stroke-width="3"/>`);

    return [
      k.kapak({ etiket: '10. SINIF FİZİK, ENERJİ', baslik: 'Güç.', vurgu: 'Ne kadar iş, ne kadar sürede?', aciklama: 'İş yapılınca enerji nasıl değişir, güç nedir ve “daha çok iş yapan daha güçlüdür” doğru mu? Ders kitabı 2.1, sayfa 93-101.' }),
      k.konu({
        etiket: 'HATIRLAYALIM', kod: 'FİZ.10.2.2', baslik: 'İş yapılınca ne değişir?', sekil: sKoli,
        maddeler: [
          { metin: 'Geçen ders: kuvvet, cisim kuvvet doğrultusunda yer değiştirince iş yapar. W = F · Δx, birimi joule (J).', vurgu: 'F,dx' },
          'İş yapılan cismin enerjisi değişir. Hareket yönündeki kuvvet <b>pozitif</b> iş yapar, cisme enerji kazandırır.',
          { metin: 'Harekete zıt yöndeki kuvvet <b>negatif</b> iş yapar, cismin enerjisini azaltır.', vurgu: 'f' },
          { formul: 'W<sub>net</sub> = ΔE = E<sub>son</sub> − E<sub>ilk</sub>', aciklama: 'Net kuvvetin yaptığı iş, cismin enerjisindeki değişime eşittir.' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', baslik: 'Masadaki koli', sekil: sKoli,
        baglam: 'Ece, masada duran 3 kg kütleli koliyi yatay 20 N büyüklüğünde kuvvetle itiyor. Koliye hareketi boyunca 8 N büyüklüğünde sürtünme kuvveti etki ediyor. Koli 5 m yer değiştiriyor.',
        maddeler: [
          { metin: 'Ece’nin uyguladığı kuvvetin yaptığı iş kaç J’dür?', puan: '3 puan', adimlar: [{ metin: 'W<sub>F</sub> = F · Δx = 20 × 5', vurgu: 'F,dx' }], cevap: 'W<sub>F</sub> = 100 J' },
          { metin: 'Sürtünme kuvvetinin yaptığı iş kaç J’dür?', puan: '3 puan', adimlar: [{ metin: 'Sürtünme harekete zıt yöndedir, işi negatiftir: W<sub>f</sub> = −8 × 5', vurgu: 'f,dx' }], cevap: 'W<sub>f</sub> = −40 J' },
          { metin: 'Net kuvvetin yaptığı iş kaç J’dür? Kolinin enerjisi nasıl değişir?', puan: '4 puan', adimlar: ['Net kuvvet: 20 − 8 = 12 N,  W<sub>net</sub> = 12 × 5 = 60 J', 'Kontrol: 100 + (−40) = 60 J'], cevap: 'W<sub>net</sub> = 60 J. Koli 60 J enerji kazanır.' },
        ],
      }),
      k.konu({
        etiket: 'HİPOTEZ KURALIM', kod: 'FİZ.10.2.2', baslik: 'İki öğrenci, aynı merdiven', sekil: sMer,
        maddeler: [
          { metin: 'Ali (50 kg) 12 m yüksekliğe merdivenle 20 saniyede, Veli (60 kg) 30 saniyede çıkıyor.', vurgu: 'ali,veli,h' },
          'Hipotez 1: Ağırlığı büyük olan Veli daha çok iş yapar.',
          'Hipotez 2: Daha kısa sürede çıkan Ali daha güçlüdür.',
          { formul: 'İkisini de birazdan hesapla sınayacağız.', aciklama: 'Önce iş, enerji ve güç arasındaki ilişkiyi kuralım.' },
        ],
      }),
      k.konu({
        etiket: 'İLİŞKİYİ KURALIM', kod: 'FİZ.10.2.2', baslik: 'İş, enerji ve güç arasındaki bağ',
        maddeler: [
          '<b>İş:</b> Kuvvetin, cismi kuvvet doğrultusunda yer değiştirterek yaptığı etki. Birimi joule (J).',
          '<b>Enerji:</b> İş yapabilme yeteneği. Yapılan iş kadar enerji aktarılır ya da dönüşür. Birimi joule (J).',
          '<b>Güç:</b> İşin ne kadar kısa sürede yapıldığının ölçüsü. Birim zamanda yapılan iş ya da aktarılan enerji.',
          { formul: 'P = W / t', aciklama: 'Güç skaler bir niceliktir. Birimi watt (W). 1 W = 1 J/s. 1 kW = 1000 W.' },
        ],
      }),
      k.konu({
        etiket: 'KARŞILAŞTIRALIM', kod: 'FİZ.10.2.2', baslik: 'İş ile güç aynı şey değil',
        maddeler: [
          'İş ve enerji “ne kadar” sorusunun cevabıdır. Güç “ne kadar hızlı” sorusunun cevabıdır.',
          'Aynı iş daha kısa sürede yapılırsa güç artar: güç süreyle ters orantılıdır.',
          'Aynı sürede daha çok iş yapılırsa güç artar: güç işle doğru orantılıdır.',
          { formul: 'W = P · t', aciklama: 'Gücü bilinen bir motorun yaptığı iş, gücüyle çalışma süresinin çarpımıdır.' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', baslik: 'İki vinç, özdeş yükler', sekil: sVinc,
        baglam: 'Bir inşaatta K ve L vinçleri 200 kg kütleli özdeş yükleri aynı anda yerden 15 m yüksekliğe sabit süratle çıkarıyor. K vinci yükü 20 saniyede, L vinci 30 saniyede çıkarıyor. g = 10 m/s² alınız.',
        maddeler: [
          { metin: 'Vinçlerin yaptığı işleri karşılaştırınız.', puan: '3 puan', adimlar: [{ metin: 'W = m · g · h = 200 × 10 × 15 = 30 000 J', vurgu: 'h' }], cevap: 'İşler eşittir: ikisi de 30 000 J.' },
          { metin: 'Yüklerin kazandığı enerjileri karşılaştırınız.', puan: '2 puan', cevap: 'Eşittir. Yapılan iş kadar enerji aktarılır: her yük 30 000 J enerji kazanır.' },
          { metin: 'Vinçlerin güçlerini bulunuz. Yüklerin farklı sürelerde çıkması hangi kavramla açıklanır?', puan: '5 puan', adimlar: [{ metin: 'K: P = 30 000 / 20 = 1500 W', vurgu: 'K' }, { metin: 'L: P = 30 000 / 30 = 1000 W', vurgu: 'L' }], cevap: 'Güç kavramıyla. K vinci daha güçlüdür; aynı işi daha kısa sürede yapar.' },
        ],
      }),
      k.soru({
        etiket: 'HİPOTEZİ SINAYALIM', baslik: 'Merdivende kim daha güçlü?', sekil: sMer,
        baglam: 'Ali (50 kg) 12 m yüksekliğe 20 saniyede, Veli (60 kg) aynı yüksekliğe 30 saniyede çıkıyor. İkisi de merdiveni sabit süratle çıkıyor. g = 10 m/s² alınız.',
        maddeler: [
          { metin: 'Her birinin kendi ağırlığına karşı yaptığı işi bulunuz.', puan: '4 puan', adimlar: ['Sabit süratle yükselmek için ağırlığa eşit büyüklükte, düşey yukarı yönlü kuvvet gerekir: W = m · g · h', { metin: 'Ali: W = 50 × 10 × 12 = 6000 J', vurgu: 'ali,h' }, { metin: 'Veli: W = 60 × 10 × 12 = 7200 J', vurgu: 'veli,h' }], cevap: 'Ali 6000 J, Veli 7200 J. Hipotez 1 doğru.' },
          { metin: 'Her birinin gücünü bulunuz.', puan: '4 puan', adimlar: [{ metin: 'Ali: P = 6000 / 20 = 300 W', vurgu: 'ali' }, { metin: 'Veli: P = 7200 / 30 = 240 W', vurgu: 'veli' }], cevap: 'Ali 300 W, Veli 240 W. Hipotez 2 doğru.' },
          { metin: '“Daha çok iş yapan her zaman daha güçlüdür.” önermesini değerlendiriniz.', puan: '2 puan', adimlar: ['Veli daha çok iş yaptı ama gücü daha küçük.'], cevap: 'Önerme yanlış. Güç, işin ne kadar sürede yapıldığına da bağlıdır.' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', baslik: 'Güçten kuvvete: rampa', sekil: sRampa,
        baglam: 'Mert, bir sandığı sürtünmesi ihmal edilen rampa boyunca rampaya paralel F kuvvetiyle iterek 40 saniyede yukarı çıkarıyor. Rampanın uzunluğu 12 m, Mert’in harcadığı güç 150 W’tır.',
        maddeler: [
          { metin: 'Mert’in yaptığı iş kaç J’dür?', puan: '3 puan', adimlar: ['P = W / t  ise  W = P · t = 150 × 40'], cevap: 'W = 6000 J' },
          { metin: 'Mert’in sandığa uyguladığı kuvvetin büyüklüğü kaç N’dur?', puan: '4 puan', adimlar: [{ metin: 'Kuvvet rampaya paralel, yer değiştirme rampa boyunca: W = F · Δx,  6000 = F × 12', vurgu: 'F,yol' }], cevap: 'F = 500 N' },
          { metin: 'Mert aynı işi 20 saniyede yapsaydı gücü kaç W olurdu?', puan: '3 puan', adimlar: ['P = 6000 / 20'], cevap: '300 W. Süre yarıya inince güç 2 katına çıkar.' },
        ],
      }),
      k.soru({
        etiket: 'GÜNLÜK HAYAT', baslik: 'Forklift ve balkon motoru', sekil: sFork,
        baglam: 'Bir depoda forklift 2 ton kütleli yükü 3 m yüksekliğe 10 saniyede kaldırıyor. Bir apartmanda gücü 100 W olan motor, 20 kg kütleli yükü 12 saniyede zeminden balkona sabit süratle çıkarıyor. Sürtünmeler ihmal ediliyor, g = 10 m/s².',
        maddeler: [
          { metin: 'Forkliftin gücü kaç kW’tır?', puan: '5 puan', adimlar: [{ metin: '2 ton = 2000 kg,  W = m · g · h = 2000 × 10 × 3 = 60 000 J', vurgu: 'fork,fh' }, 'P = 60 000 / 10 = 6000 W'], cevap: 'P = 6 kW' },
          { metin: 'Balkon zeminden kaç metre yüksektedir?', puan: '5 puan', adimlar: [{ metin: 'Motorun yaptığı iş: W = P · t = 100 × 12 = 1200 J', vurgu: 'motor' }, { metin: 'W = m · g · h,  1200 = 20 × 10 × h', vurgu: 'mh' }], cevap: 'h = 6 m' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', baslik: 'Aynı sürede iki işçi', sekil: sIki,
        baglam: 'Depoda Selim ve Barış, sürtünmesi ihmal edilen zeminde kolilerini yatay kuvvetlerle birbirine doğru çekiyor. Selim 30 N büyüklüğünde kuvvetle kolisini 12 m, Barış 20 N büyüklüğünde kuvvetle kolisini 9 m çekiyor. Aynı anda başlıyor ve 6 saniye sonra C noktasında buluşuyorlar.',
        maddeler: [
          { metin: 'Selim ve Barış’ın yaptığı işleri bulunuz.', puan: '4 puan', adimlar: [{ metin: 'Selim: W = 30 × 12 = 360 J', vurgu: 'S' }, { metin: 'Barış: W = 20 × 9 = 180 J', vurgu: 'B' }], cevap: 'Selim 360 J, Barış 180 J.' },
          { metin: 'Güçlerini bulunuz.', puan: '4 puan', adimlar: [{ metin: 'Selim: P = 360 / 6 = 60 W', vurgu: 'S' }, { metin: 'Barış: P = 180 / 6 = 30 W', vurgu: 'B' }], cevap: 'Selim 60 W, Barış 30 W.' },
          { metin: 'Süreler eşitken güçlerin oranı neye eşittir?', puan: '2 puan', cevap: 'İşlerin oranına: 360 / 180 = 2. Süre aynıysa çok iş yapan daha güçlüdür.' },
        ],
      }),
      k.konu({
        etiket: 'ÖZET', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          'Net kuvvetin yaptığı iş, cismin enerjisindeki değişime eşittir. Pozitif iş enerji kazandırır, negatif iş enerjiyi azaltır.',
          'Güç, birim zamanda yapılan iş ya da aktarılan enerjidir: P = W / t. Birimi watt (W), 1 W = 1 J/s.',
          'Aynı iş kısa sürede yapılırsa güç büyür. Çok iş yapmak tek başına güçlü olmak demek değildir.',
          { formul: 'W = P · t   ve   W = F · Δx', aciklama: 'İkisini birlikte kullanarak güçten kuvvete, kuvvetten güce geçebiliriz.' },
        ],
      }),
      k.kapanis({ baslik: 'Güç: işin ne kadar hızlı yapıldığı.', vurgu: 'Gelecek ders: kWh ve elektrik faturası.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
