// 11. sınıf, Kuvvet ve Hareket: Limit hız (yaklaşık 20 dakikalık video)
// MEB ders kitabı 1.5. Limit Hız, s. 86-94 ile paralel: hava direnci, düşen cismin üç anı, limit hızı etkileyen değişkenler,
// F_d = k A ϑ² modeli, gezegen karşılaştırması (kitapta Anka-1 sondası ve Tablo 1.2), hız-zaman grafiği yorumu.
// TYMM FİZ.11.1.8. Önceki ders: sürtünme kuvveti. Sonraki ders: düzgün çembersel hareket. g = 10 m/s².
module.exports = {
  slug: '11-limit-hiz',
  baslik: '11. Sınıf Fizik: Limit Hız',
  dersAdi: '11. sınıf, Limit hız',
  slaytlar: (k) => {
    const G = '#244f40', N = '#1d3b8f', T = '#b06a3b', GR = '#475569';
    const yz = (x, y, t, r = '#173430', a = 'middle', s = 20, w = 800) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${r}" text-anchor="${a}">${t}</text>`;
    const gz = (ad, ic) => `<g class="vek gizli" data-ad="${ad}">${ic}</g>`;
    const vk = (ad, ic) => `<g class="vek" data-ad="${ad}">${ic}</g>`;

    // Şekil: düz ve buruşturulmuş kâğıt
    const sKagit = k.svg(640, 400,
      `<rect x="0" y="352" width="640" height="48" fill="#cfc9ba"/>` +
      `<line x1="50" y1="70" x2="590" y2="70" stroke="#6b7d76" stroke-width="2.5" stroke-dasharray="9 8"/>` + yz(590, 52, 'aynı yükseklik', '#6b7d76', 'end', 20, 700) +
      vk('duz', `<path d="M110,84 q60,-18 120,0 l-9,12 q-52,-13 -102,0 z" fill="#fff" stroke="${GR}" stroke-width="3"/>` + yz(170, 136, 'düz kâğıt')) +
      vk('top', `<path d="M438,98 l16,-16 18,7 16,-9 12,16 -5,18 -20,9 -21,-4 -14,-9 z" fill="#fff" stroke="${GR}" stroke-width="3"/>` + yz(470, 152, 'buruşturulmuş kâğıt')) +
      gz('hiz', k.ok({ x1: 170, y1: 160, x2: 170, y2: 212, renk: G, kalin: 6 }) + yz(170, 244, 'yavaş düşer', G) +
        k.ok({ x1: 470, y1: 176, x2: 470, y2: 296, renk: G, kalin: 6 }) + yz(470, 328, 'hızlı düşer', G)) +
      yz(320, 384, 'Kütleleri eşit', '#173430', 'middle', 21));

    // Şekil: düşen cismin üç anı
    const an = (cx, ad, no, dir, alt) => {
      const agir = k.ok({ x1: cx, y1: 206, x2: cx, y2: 312, renk: GR, kalin: 8 }) + yz(cx + 22, 276, 'ağırlık', GR, 'start');
      const dr = dir ? k.ok({ x1: cx, y1: 154, x2: cx, y2: 154 - dir, renk: T, kalin: 8 }) + yz(cx + 22, 154 - dir / 2 + 4, 'direnç', T, 'start') : '';
      return yz(cx, 36, no) + `<circle cx="${cx}" cy="180" r="26" fill="#cbd5e1" stroke="${GR}" stroke-width="3"/>` + gz(ad, agir + dr + yz(cx, 356, alt, G, 'middle', 20));
    };
    const sUcAn = k.svg(740, 380,
      `<line x1="250" y1="16" x2="250" y2="364" stroke="#d9e2da" stroke-width="2.5"/><line x1="490" y1="16" x2="490" y2="364" stroke="#d9e2da" stroke-width="2.5"/>` +
      an(110, 'a1', '1. an', 0, 'ivme = g') + an(350, 'a2', '2. an', 50, 'ivme azalıyor') + an(590, 'a3', '3. an', 106, 'ivme = 0, hız sabit'));

    // Şekil: paraşüt ve model
    const sModel = k.svg(720, 380,
      vk('A', `<path d="M250 170 Q380 30 510 170 Z" fill="#f1cfb4" stroke="${T}" stroke-width="3"/>` +
        `<line x1="250" y1="192" x2="510" y2="192" stroke="${N}" stroke-width="3" stroke-dasharray="8 7"/>` + yz(524, 198, 'A: kesit alanı', N, 'start', 22)) +
      `<line x1="252" y1="170" x2="370" y2="262" stroke="#6b7d76" stroke-width="2.5"/><line x1="508" y1="170" x2="390" y2="262" stroke="#6b7d76" stroke-width="2.5"/><line x1="380" y1="170" x2="380" y2="258" stroke="#6b7d76" stroke-width="2.5"/>` +
      `<rect x="354" y="258" width="52" height="48" rx="8" fill="#cbd5e1" stroke="${GR}" stroke-width="3"/>` +
      vk('Fd', k.ok({ x1: 110, y1: 172, x2: 110, y2: 56, renk: T, kalin: 8 }) + `<text x="132" y="110" font-size="24" font-weight="800" fill="${T}">F<tspan font-size="16" dy="6">d</tspan><tspan dy="-6"> = k A ϑ²</tspan></text>`) +
      vk('mg', k.ok({ x1: 110, y1: 214, x2: 110, y2: 330, renk: GR, kalin: 8 }) + yz(132, 286, 'm g', GR, 'start', 24)) +
      gz('esit', yz(110, 200, 'eşit', '#173430', 'middle', 21)) +
      gz('v', k.ok({ x1: 590, y1: 250, x2: 590, y2: 340, renk: G, kalin: 7 }) + yz(590, 372, 'ϑ sabit', G, 'middle', 22)));

    // Şekil: bir atlayışın hız-zaman grafiği
    const nk = (x, y, h, hx, hy) => `<circle cx="${x}" cy="${y}" r="7" fill="#173430"/>` + yz(x + hx, y + hy, h, '#173430', 'middle', 24);
    const sGrafik = k.svg(720, 400,
      `<rect x="70" y="40" width="600" height="290" fill="#fff"/>` +
      `<path d="M70,30 V330 H680" fill="none" stroke="#173430" stroke-width="3"/><polygon points="70,16 62,34 78,34" fill="#173430"/><polygon points="696,330 678,322 678,338" fill="#173430"/>` +
      yz(86, 30, 'hız', '#173430', 'start') + yz(690, 366, 'zaman', '#173430', 'end') +
      vk('KL', `<path d="M70,330 C120,190 170,102 270,100" fill="none" stroke="${T}" stroke-width="5.5" stroke-linecap="round"/>`) +
      vk('LM', `<path d="M270,100 L400,100" fill="none" stroke="${T}" stroke-width="5.5" stroke-linecap="round"/>`) +
      vk('MN', `<path d="M400,100 C420,100 428,286 470,286" fill="none" stroke="${T}" stroke-width="5.5" stroke-linecap="round"/>` + yz(448, 180, 'paraşüt açılıyor', '#6b7d76', 'start', 19, 700)) +
      vk('NP', `<path d="M470,286 L640,286" fill="none" stroke="${T}" stroke-width="5.5" stroke-linecap="round"/>`) +
      nk(70, 330, 'K', -24, 26) + nk(270, 100, 'L', 0, -18) + nk(400, 100, 'M', 0, -18) + nk(470, 286, 'N', 0, -18) + nk(640, 286, 'P', 0, -18));

    // Şekil: yağmur damlaları
    const sYagmur = k.svg(640, 380,
      `<rect x="0" y="0" width="640" height="380" rx="14" fill="#e9f3fa"/><rect x="0" y="340" width="640" height="40" fill="#8fb37c"/>` +
      `<g fill="#fff" stroke="#b8cbd9" stroke-width="2.5"><ellipse cx="190" cy="62" rx="110" ry="32"/><ellipse cx="290" cy="48" rx="90" ry="32"/><ellipse cx="400" cy="64" rx="120" ry="32"/></g>` +
      vk('iri', `<path d="M210,160 q-20,32 0,45 q20,-13 0,-45 z" fill="${N}"/>` + yz(210, 240, 'iri damla')) +
      vk('cis', `<path d="M400,172 q-8,14 0,20 q8,-6 0,-20 z" fill="${N}"/>` + yz(400, 226, 'çisenti damlası')) +
      `<line x1="590" y1="96" x2="590" y2="332" stroke="#173430" stroke-width="3"/><polygon points="590,84 582,102 598,102" fill="#173430"/><polygon points="590,340 582,322 598,322" fill="#173430"/>` + yz(576, 220, '2000 m', '#173430', 'end', 22));

    const deneySag = `<canvas id="lhC" width="2200" height="1120"></canvas>
<div class="dk"><span>Kütle</span>${k.secim('lhKutle', [['40', '40 kg'], ['60', '60 kg'], ['80', '80 kg'], ['100', '100 kg']], 2)}${k.dugme('lhBirak', 'Bırak')}${k.dugme('lhSil', 'Tabloyu temizle', 'ik')}</div>
<div class="dk"><span>Duruş</span>${k.secim('lhDurus', [['0', 'Baş aşağı'], ['1', 'Yüzüstü, kollar açık'], ['2', 'Paraşüt açık']], 1)}</div>
<div class="olcu"><div><span>Hız</span><b id="lhV">0 m/s</b></div><div><span>Hava direnci</span><b id="lhR">0 N</b></div><div><span>Ağırlık</span><b id="lhG">800 N</b></div><div><span>İvme</span><b id="lhA">10 m/s²</b></div></div>`;
    const deneySol = `<table class="bt"><thead><tr><th>Deneme</th><th>Kütle</th><th>Duruş</th><th>Limit hız</th></tr></thead><tbody id="lhTablo"><tr><td colspan="4" class="bos">Henüz deneme yok. Paraşütçüyü bırak.</td></tr></tbody></table>`;

    return [
      k.kapak({ etiket: '11. SINIF FİZİK, KUVVET VE HAREKET', baslik: 'Limit hız.', vurgu: 'Düşen cisim neden hızlanmayı bırakır?', aciklama: 'Hava direnci, limit hızı değiştiren değişkenler ve bir paraşütçünün hız grafiği. Ders kitabı 1.5, sayfa 86-94.' }),
      k.konu({
        etiket: 'BAŞLANGIÇ DENEYİ', kod: 'FİZ.11.1.8', baslik: 'Hangisi yere önce ulaşır?', sekil: sKagit,
        maddeler: [
          'İki özdeş kâğıt var. Biri düz, diğeri buruşturulup top yapılmış. İkisi aynı yükseklikten aynı anda bırakılıyor.',
          { metin: 'Kütleleri, yani ağırlıkları eşittir. Fark hava direncindedir.', vurgu: 'duz,top' },
          { metin: 'Düz kâğıdın havayı karşılayan yüzeyi büyüktür. Küçük bir hızda bile hava direnci ağırlığı dengeler.', vurgu: 'duz,hiz' },
          { metin: 'Buruşturulmuş kâğıt çok daha büyük hıza ulaşır ve yere önce düşer.', vurgu: 'top,hiz' },
          { formul: 'Bu derste hava direnci ihmal edilmez.', aciklama: 'Serbest düşme modelinde hava direnci yok sayılıyordu.' },
        ],
      }),
      k.konu({
        etiket: 'ADIM ADIM', kod: 'FİZ.11.1.8', baslik: 'Hız neden bir yerde sabitleniyor?', sekil: sUcAn,
        maddeler: [
          { metin: '<b>Bırakıldığı an:</b> hız sıfırdır, hava direnci yoktur. Cisme yalnızca ağırlık etki eder, ivme g olur.', vurgu: 'a1' },
          { metin: '<b>Hızlanırken:</b> hız arttıkça hava direnci büyür. Bileşke kuvvet küçülür, ivme azalır. Cisim hâlâ hızlanır.', vurgu: 'a2' },
          { metin: '<b>Direnç ağırlığa eşit:</b> bileşke kuvvet ve ivme sıfırdır. Newton’ın I. yasasına göre cisim sabit hızla düşer.', vurgu: 'a3' },
          { formul: 'Limit hız: ulaşılan sabit hız', aciklama: 'Hava direnci ağırlığı dengelediğinde cisim durmaz, yalnızca hızı artmaz.' },
        ],
      }),
      k.deney({
        kod: 'FİZ.11.1.8', baslik: 'Limit hızı ne değiştirir?',
        giris: 'Kütleyi ve duruşu seç, paraşütçüyü bırak. Her denemenin limit hızı tabloya yazılır.',
        sol: deneySol, sag: deneySag,
        maddeler: [
          'Duruş aynıyken kütle artarsa limit hız artar.',
          'Kütle aynıyken havayı karşılayan yüzey büyürse limit hız azalır.',
          { formul: 'Limit hızda: direnç = ağırlık', aciklama: 'Cismin biçimi ve içinde düştüğü ortam da limit hızı değiştirir.' },
        ],
      }),
      k.konu({
        etiket: 'MATEMATİKSEL MODEL', kod: 'FİZ.11.1.8', baslik: 'Limit hız neye bağlı?', sekil: sModel,
        maddeler: [
          { metin: 'Akışkan içinde hareket eden cisme, harekete zıt yönde <b>direnç kuvveti</b> (F<sub>d</sub>) etki eder.', vurgu: 'Fd' },
          { formul: 'F<sub>d</sub> = k A ϑ²', aciklama: 'k: ortamın sürtünme katsayısı, A: harekete dik en büyük kesit alanı, ϑ: hızın büyüklüğü.', vurgu: 'Fd,A' },
          { metin: 'Limit hızda direnç kuvveti ağırlığa eşittir: m g = k A ϑ²', vurgu: 'Fd,mg,esit,v' },
          { formul: 'ϑ = √(m g / k A)', aciklama: 'm ve g büyüdükçe limit hız artar. k ve A büyüdükçe limit hız azalır.', vurgu: 'v' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.11.1.8', baslik: 'Üç gezegende aynı sonda',
        baglam: 'Bir sonda aynı paraşütle üç gezegenin atmosferine bırakılıyor. Sürtünme katsayıları Dünya’daki değere göre verilmiştir.',
        tablo: { basliklar: ['Gezegen', 'Çekim ivmesi (m/s²)', 'Sürtünme katsayısı', 'g / k'], doldur: 1, satirlar: [['Venüs', '9', '100 k<sub>0</sub>', '9 / 100'], ['Dünya', '10', 'k<sub>0</sub>', '10'], ['Mars', '4', 'k<sub>0</sub> / 100', '400']] },
        maddeler: [
          { metin: 'Aynı paraşüte bağlanan yükün kütlesi 4 katına çıkarılırsa limit hız kaç katına çıkar?', puan: '3 puan', adimlar: ['ϑ = √(m g / k A): limit hız kütlenin kareköküyle orantılıdır.'], cevap: '√4 = 2 katına çıkar.' },
          { metin: 'Sondanın üç gezegendeki limit hızlarını büyükten küçüğe sıralayınız.', puan: '4 puan', adimlar: ['Kütle ve kesit alanı aynı: limit hız g / k oranının kareköküyle orantılıdır.'], cevap: 'Mars > Dünya > Venüs. Mars’ın atmosferi çok incedir, paraşütle inmek zordur.' },
          { metin: 'Mars’taki limit hızın Dünya’dakine eşit olması için paraşütün kesit alanı kaç katına çıkarılmalıdır?', puan: '3 puan', adimlar: ['g / (k A) oranı eşit olmalı. Mars’ta g / k, Dünya’dakinin 400 / 10 = 40 katı.'], cevap: 'Kesit alanı 40 katına çıkarılmalıdır.' },
        ],
      }),
      k.soru({
        etiket: 'GRAFİK YORUMU', kod: 'FİZ.11.1.8', baslik: 'Bir atlayışın hız grafiği', sekil: sGrafik,
        baglam: 'Grafik, uçaktan atlayan bir paraşütçünün hızının büyüklüğünü gösteriyor. Paraşüt M anında açılıyor.',
        maddeler: [
          { metin: 'K ile L arasında paraşütçünün ivmesi nasıl değişir?', puan: '5 puan', adimlar: [{ metin: 'Eğri giderek yataylaşıyor. Hız arttıkça hava direnci büyür, bileşke kuvvet küçülür.', vurgu: 'KL' }], cevap: 'İvme azalır.', cevapVurgu: 'KL' },
          { metin: 'L ile M arasında hava direnci ile ağırlık arasındaki ilişki nedir?', puan: '5 puan', adimlar: [{ metin: 'Hız sabit, bileşke kuvvet sıfır.', vurgu: 'LM' }], cevap: 'Hava direnci ağırlığa eşittir. Bu hız, paraşüt kapalıykenki limit hızdır.', cevapVurgu: 'LM' },
        ],
      }),
      k.soru({
        etiket: 'GRAFİK YORUMU', kod: 'FİZ.11.1.8', baslik: 'Paraşüt açılınca ne olur?', sekil: sGrafik,
        baglam: 'Aynı grafik. Paraşüt M anında açılıyor, N anından sonra hız yeniden sabit kalıyor.',
        maddeler: [
          { metin: 'M ile N arasında paraşütçü yukarı mı çıkar? Bileşke kuvvetin yönü nedir?', puan: '5 puan', adimlar: [{ metin: 'Hız sıfıra inmiyor, yalnızca küçülüyor. Paraşütçü hâlâ aşağı düşüyor.', vurgu: 'MN' }], cevap: 'Yukarı çıkmaz. Direnç ağırlıktan büyüktür, bileşke kuvvet yukarı yönlüdür, paraşütçü yavaşlar.', cevapVurgu: 'MN' },
          { metin: 'N ile P arasındaki hava direnci, L ile M arasındakinden büyük müdür?', puan: '5 puan', adimlar: [{ metin: 'İki aralıkta da hız sabittir, direnç ağırlığa eşittir.', vurgu: 'LM,NP' }], cevap: 'Eşittir. Değişen direnç kuvveti değil, bu direncin oluştuğu hızdır.', cevapVurgu: 'LM,NP' },
        ],
      }),
      k.soru({
        etiket: 'GÜNLÜK HAYAT', kod: 'FİZ.11.1.8', baslik: 'Yağmur neden canımızı yakmaz?', sekil: sYagmur,
        baglam: 'Bir yağmur damlası 2000 m yükseklikteki buluttan düşüyor. g = 10 m/s² alınız.',
        maddeler: [
          { metin: 'Hava direnci hiç olmasaydı damla yere hangi hızla çarpardı?', puan: '4 puan', adimlar: ['Serbest düşme: ϑ² = 2 g h = 2 × 10 × 2000 = 40 000'], cevap: 'ϑ = 200 m/s. Bu, saatte 720 km eder.' },
          { metin: 'Gerçekte damla yere saniyede yalnızca birkaç metre hızla ulaşır. Nedenini açıklayınız.', puan: '3 puan', adimlar: ['Hız arttıkça hava direnci büyür ve kısa sürede ağırlığa eşit olur.'], cevap: 'Damla limit hıza ulaşır, sonra sabit hızla düşer.' },
          { metin: 'İri damla mı, çisenti damlası mı yere daha hızlı ulaşır?', puan: '3 puan', adimlar: [{ metin: 'Damla büyüdükçe kütlesi, kesit alanından daha çok artar. Ağırlığı dengelemek için daha büyük hız gerekir.', vurgu: 'iri' }], cevap: 'İri damla. Sağanakta damlalar hızlı, çisentide yavaş düşer.', cevapVurgu: 'iri' },
        ],
      }),
      k.soru({
        etiket: 'YAZILIYA HAZIRLIK', etiketRenk: 'B', kod: 'FİZ.11.1.8', baslik: 'Doğru mu, yanlış mı?',
        baglam: 'Hava direncinin ihmal edilmediği ortamda düşen cisimlerle ilgili ifadeler verilmiştir.',
        tablo: { basliklar: ['No', 'İfade', 'D&nbsp;/&nbsp;Y'], doldur: 0, satirlar: [
          ['1', 'Limit hızla düşen paraşütçüye etki eden bileşke kuvvet sıfırdır.', 'D'],
          ['2', 'Buruşturulan kâğıt, kütlesi arttığı için daha çabuk düşer.', 'Y'],
          ['3', 'Cisim limit hıza ulaşana kadar ivmesi azalır.', 'D'],
          ['4', 'Aynı paraşütle atlayan 90 kg kütleli paraşütçünün limit hızı, 60 kg kütleli olanınkinden büyüktür.', 'D'],
          ['5', 'Paraşüt açıldığı anda paraşütçü yukarı doğru hareket eder.', 'Y'],
          ['6', 'Paraşüt açıkken ulaşılan limit hızda hava direnci, paraşüt kapalıykenkinden büyüktür.', 'Y'],
        ] },
        maddeler: [
          { metin: 'Tablonun son sütununu doldurunuz.', puan: '6 puan', adimlar: ['Sırayla: D, Y, D, D, Y, Y'] },
          { metin: 'Yanlış ifadeleri düzeltiniz.', puan: '6 puan', adimlar: ['2: Kütle değişmez. Havayı karşılayan yüzey küçülür, hava direnci azalır.', '5: Bileşke kuvvet yukarı yönlüdür ama paraşütçü yavaşlayarak düşmeyi sürdürür.', '6: İki durumda da direnç ağırlığa eşittir. Farklı olan limit hızlardır.'] },
        ],
      }),
      k.konu({
        etiket: 'ÖZET', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          'Düşen cismin hızı arttıkça hava direnci büyür, ivmesi azalır.',
          'Direnç ağırlığa eşit olunca bileşke kuvvet sıfırdır. Cisim limit hızla, sabit hızla düşer.',
          'Kütle ve çekim ivmesi artarsa limit hız artar. Kesit alanı ve ortamın sürtünme katsayısı artarsa limit hız azalır.',
          { formul: 'F<sub>d</sub> = k A ϑ²,  ϑ = √(m g / k A)', aciklama: 'Limit hızda hava direnci her zaman ağırlığa eşittir.' },
        ],
      }),
      k.kapanis({ baslik: 'Limit hız tamam.', vurgu: 'Gelecek ders: düzgün çembersel hareket.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },

  // Canlı deney: paraşütçü. Model: m a = m g − k ϑ², k = 0,4 × yüzey. Hareket 4 kat hızlandırılır.
  betik: function () {
    var $ = function (i) { return document.getElementById(i); }, cv = $('lhC'); if (!cv) return;
    var x = cv.getContext('2d'), W = 1100, H = 560; x.setTransform(2, 0, 0, 2, 0, 0);
    var ALAN = [0.3, 0.8, 25], DURUS = ['Baş aşağı', 'Yüzüstü', 'Paraşüt açık'], HIZLI = 4, TSON = 30, VMAX = 100;
    var S = { t: 0, v: 0, yol: [[0, 0]], kos: false, son: 0, bitti: false, n: 0, bulut: 0 };
    var sec = function (id) { return +document.querySelector('#' + id + ' button.on').dataset.v; };
    function deger() { var m = sec('lhKutle'), d = sec('lhDurus'), kk = 0.4 * ALAN[d]; return { m: m, d: d, k: kk, G: m * 10, vl: Math.sqrt(m * 10 / kk) }; }
    function yazi(t, px, py, boy, renk, hiza, w) { x.font = (w || 700) + ' ' + boy + 'px "Plus Jakarta Sans",sans-serif'; x.fillStyle = renk; x.textAlign = hiza || 'left'; x.textBaseline = 'middle'; x.fillText(t, px, py); }
    function ok(x1, y1, x2, y2, renk, kal) { var L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = kal * 2.6, w = kal * 1.4, bx = x2 - ux * h, by = y2 - uy * h; x.strokeStyle = renk; x.fillStyle = renk; x.lineWidth = kal; x.lineCap = 'round'; x.beginPath(); x.moveTo(x1, y1); x.lineTo(bx, by); x.stroke(); x.beginPath(); x.moveTo(x2, y2); x.lineTo(bx - uy * w, by + ux * w); x.lineTo(bx + uy * w, by - ux * w); x.closePath(); x.fill(); }
    function ciz() {
      var p = deger(), R = p.k * S.v * S.v, i;
      x.clearRect(0, 0, W, H);
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#bfe0f7'); g.addColorStop(1, '#eef7fd'); x.fillStyle = g; x.fillRect(0, 0, 390, H);
      x.save(); x.beginPath(); x.rect(0, 0, 390, H); x.clip(); x.fillStyle = 'rgba(255,255,255,.92)';
      for (i = 0; i < 4; i++) { var by = ((i * 160 - S.bulut) % 640 + 640) % 640 - 40, bx = [70, 300, 150, 330][i]; x.beginPath(); x.ellipse(bx, by, 54, 18, 0, 0, 7); x.fill(); }
      x.restore();
      var cx = 160, cy = 290;
      if (p.d === 2) { x.fillStyle = '#b06a3b'; x.beginPath(); x.moveTo(cx - 92, cy - 118); x.quadraticCurveTo(cx, cy - 210, cx + 92, cy - 118); x.closePath(); x.fill(); x.strokeStyle = '#6b7d76'; x.lineWidth = 2.5; [-92, -32, 32, 92].forEach(function (o) { x.beginPath(); x.moveTo(cx + o, cy - 118); x.lineTo(cx, cy - 26); x.stroke(); }); }
      x.strokeStyle = '#244f40'; x.lineCap = 'round';
      if (p.d === 1) { x.lineWidth = 20; x.beginPath(); x.moveTo(cx - 56, cy); x.lineTo(cx + 56, cy); x.stroke(); x.lineWidth = 13; x.beginPath(); x.moveTo(cx - 56, cy); x.lineTo(cx - 82, cy - 24); x.moveTo(cx + 56, cy); x.lineTo(cx + 82, cy - 24); x.stroke(); x.fillStyle = '#f1c9a5'; x.beginPath(); x.arc(cx, cy - 24, 18, 0, 7); x.fill(); }
      else { x.lineWidth = 22; x.beginPath(); x.moveTo(cx, cy - 26); x.lineTo(cx, cy + 38); x.stroke(); x.fillStyle = '#f1c9a5'; x.beginPath(); x.arc(cx, p.d === 0 ? cy + 58 : cy - 46, 18, 0, 7); x.fill(); }
      /* kuvvetler: ağırlık sabit boyda, direnç ağırlığa oranla çizilir */
      var boy = 120, rb = Math.min(1.25, R / p.G) * boy, fx = 312;
      ok(fx, cy, fx, cy + boy, '#475569', 11); yazi('ağırlık', fx, cy + boy + 26, 24, '#475569', 'center', 800);
      if (rb > 8) { ok(fx, cy, fx, cy - rb, '#b06a3b', 11); yazi('direnç', fx, cy - rb - 24, 24, '#b06a3b', 'center', 800); }
      /* hız-zaman grafiği */
      var gx = 490, gy = 480, gw = 560, gh = 400;
      x.fillStyle = '#fff'; x.fillRect(390, 0, W - 390, H);
      x.strokeStyle = '#e6ebe6'; x.lineWidth = 1.5;
      for (i = 25; i <= 100; i += 25) { x.beginPath(); x.moveTo(gx, gy - i / VMAX * gh); x.lineTo(gx + gw, gy - i / VMAX * gh); x.stroke(); }
      for (i = 10; i <= 30; i += 10) { x.beginPath(); x.moveTo(gx + i / TSON * gw, gy); x.lineTo(gx + i / TSON * gw, gy - gh); x.stroke(); }
      x.strokeStyle = '#173430'; x.lineWidth = 3; x.beginPath(); x.moveTo(gx, gy - gh - 22); x.lineTo(gx, gy); x.lineTo(gx + gw + 16, gy); x.stroke();
      for (i = 0; i <= 30; i += 10) yazi(String(i), gx + i / TSON * gw, gy + 24, 22, '#6b7d76', 'center', 700);
      for (i = 25; i <= 100; i += 25) yazi(String(i), gx - 14, gy - i / VMAX * gh, 22, '#6b7d76', 'right', 700);
      yazi('hız (m/s)', gx + 14, gy - gh - 22, 23, '#173430', 'left', 800); yazi('zaman (s)', gx + gw + 16, gy + 56, 23, '#173430', 'right', 800);
      if (S.yol.length > 1) { x.strokeStyle = '#b06a3b'; x.lineWidth = 5; x.lineJoin = 'round'; x.beginPath(); S.yol.forEach(function (q, j) { var px = gx + q[0] / TSON * gw, py = gy - q[1] / VMAX * gh; if (j) x.lineTo(px, py); else x.moveTo(px, py); }); x.stroke(); }
      if (S.bitti) { var ly = gy - p.vl / VMAX * gh; x.save(); x.setLineDash([10, 8]); x.strokeStyle = '#244f40'; x.lineWidth = 3; x.beginPath(); x.moveTo(gx, ly); x.lineTo(gx + gw, ly); x.stroke(); x.restore(); yazi('limit hız: ' + Math.round(p.vl) + ' m/s', gx + gw, ly + (ly < 110 ? 28 : -24), 25, '#244f40', 'right', 800); }
      $('lhV').textContent = Math.round(S.v) + ' m/s'; $('lhR').textContent = Math.round(R) + ' N'; $('lhG').textContent = p.G + ' N';
      $('lhA').textContent = Math.max(0, Math.round(10 - R / p.m)) + ' m/s²';
    }
    function satir() {
      var p = deger(), tb = $('lhTablo'); if (!S.n) tb.innerHTML = ''; S.n++;
      var r = document.createElement('tr'); r.innerHTML = '<td>' + S.n + '</td><td>' + p.m + ' kg</td><td>' + DURUS[p.d] + '</td><td>' + Math.round(p.vl) + ' m/s</td>'; tb.appendChild(r); while (tb.children.length > 5) tb.removeChild(tb.firstChild);
    }
    function ilerle(dt) { var p = deger(), n = 20, h = dt / n, i; for (i = 0; i < n; i++) S.v += (10 - p.k / p.m * S.v * S.v) * h; S.t += dt; S.yol.push([S.t, S.v]); S.bulut += S.v * dt * 5; }
    function kilit(v) { $('lhBirak').disabled = v; ['lhKutle', 'lhDurus'].forEach(function (i) { $(i).classList.toggle('kilit', v); }); }
    function dongu(t) {
      if (!S.kos) return;
      var dt = Math.min(0.05, (t - S.son) / 1000) * HIZLI; S.son = t; ilerle(Math.min(dt, TSON - S.t));
      if (S.t >= TSON - 1e-6) { S.kos = false; S.bitti = true; kilit(false); satir(); }
      ciz(); if (S.kos) requestAnimationFrame(dongu);
    }
    function sifir() { S.t = 0; S.v = 0; S.yol = [[0, 0]]; S.bitti = false; S.kos = false; kilit(false); ciz(); }
    ['lhKutle', 'lhDurus'].forEach(function (id) {
      [].forEach.call($(id).children, function (b) { b.addEventListener('etk', function () { if (S.kos) return; [].forEach.call($(id).children, function (o) { o.classList.toggle('on', o === b); }); sifir(); }); });
    });
    $('lhBirak').addEventListener('etk', function () { if (S.kos) return; sifir(); S.kos = true; kilit(true); S.son = performance.now(); requestAnimationFrame(dongu); });
    $('lhSil').addEventListener('etk', function () { S.n = 0; $('lhTablo').innerHTML = '<tr><td colspan="4" class="bos">Henüz deneme yok. Paraşütçüyü bırak.</td></tr>'; });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(ciz); ciz();
  },
};
