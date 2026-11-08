// 11. sınıf, Hafta 9 (9–13 Kasım 2026): Serbest cisim diyagramı
// TYMM FİZ.11.1.5: Newton'ın Hareket Yasalarını serbest cisim diyagramını kullanarak yorumlayabilme
// a) kuvvetleri belirler, b) serbest cisim diyagramında gösterir, c) diyagramla Newton'ın yasalarını yeniden ifade eder.
// Sınırlama: sabit ivmeli hareket; farklı ivmeli cisim sistemleri hesaplanmaz. Sürtünme sonraki hafta (FİZ.11.1.6).
module.exports = {
  slug: '11-hafta-09-serbest-cisim-diyagrami',
  baslik: '11. Sınıf Fizik: Serbest Cisim Diyagramı',
  dersAdi: '11. sınıf, serbest cisim diyagramı',
  slaytlar: (k) => {
    const G = '#244f40', N = '#1d3b8f', T = '#b06a3b', F = '#7a3e9d';
    const yaz = (x, y, t, r = '#173430', a = 'middle', s = 24) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="700" fill="${r}" text-anchor="${a}">${t}</text>`;

    // Şekil 1: masadaki kitap ve SCD'si
    const s1 = k.svg(500, 420,
      `<rect x="20" y="250" width="200" height="16" rx="4" fill="#cfc9ba"/><rect x="40" y="266" width="12" height="120" fill="#cfc9ba"/><rect x="188" y="266" width="12" height="120" fill="#cfc9ba"/>` +
      `<rect x="80" y="214" width="80" height="36" rx="4" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/>` + yaz(120, 200, 'Masadaki kitap', '#6b7d76', 'middle', 20) +
      `<line x1="250" y1="40" x2="250" y2="400" stroke="#d9e2da" stroke-width="2" stroke-dasharray="6 6"/>` +
      k.kutu(350, 220, 70, '') +
      k.ok({ x1: 350, y1: 220, x2: 350, y2: 340, ad: 'G', renk: G, etiket: 'G', ex: 26, ey: 0 }) +
      k.ok({ x1: 350, y1: 220, x2: 350, y2: 100, ad: 'N', renk: N, etiket: 'N', ex: 26, ey: 14 }) +
      yaz(360, 410, 'Serbest cisim diyagramı', '#6b7d76', 'middle', 20));

    // Şekil 2: tavana asılı lamba
    const s2 = k.svg(360, 420,
      `<rect x="40" y="20" width="280" height="16" fill="#cfc9ba"/><line x1="180" y1="36" x2="180" y2="190" stroke="#6b7d76" stroke-width="3"/>` +
      `<path d="M140 190 h80 l-14 44 h-52 z" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/>` +
      k.ok({ x1: 180, y1: 212, x2: 180, y2: 92, ad: 'T', renk: T, etiket: 'T', ex: 26, ey: 14, gizli: true }) +
      k.ok({ x1: 180, y1: 212, x2: 180, y2: 332, ad: 'G', renk: G, etiket: 'G', ex: 26, ey: 0, gizli: true }) +
      yaz(180, 400, 'm = 2 kg', '#6b7d76'));

    // Şekil 3: iple yukarı çekilen kova (T = 60 N, G = 50 N; 2 px/N)
    const s3 = k.svg(380, 440,
      k.kutu(170, 230, 70, '') +
      `<line x1="170" y1="195" x2="170" y2="20" stroke="#6b7d76" stroke-width="3"/>` +
      k.ok({ x1: 170, y1: 230, x2: 170, y2: 110, ad: 'T', renk: T, etiket: 'T', ex: 26, ey: 14, gizli: true }) +
      k.ok({ x1: 170, y1: 230, x2: 170, y2: 330, ad: 'G', renk: G, etiket: 'G', ex: 26, ey: 0, gizli: true }) +
      k.ok({ x1: 90, y1: 280, x2: 90, y2: 200, ad: 'a', renk: F, kalin: 3, etiket: 'a', ex: -22, ey: 20 }) +
      yaz(212, 240, 'kova', '#6b7d76', 'start', 20) + yaz(170, 420, 'm = 5 kg', '#6b7d76'));

    // Şekil 4: sürtünmesiz yatay zeminde kutu (F1 = 30 N sağa, F2 = 10 N sola, G = N = 40 N; 5 px/N, oklar merkezden)
    const s4 = k.svg(520, 470,
      `<rect x="20" y="255" width="480" height="14" fill="#cfc9ba"/>` + yaz(500, 298, 'sürtünmesiz zemin', '#6b7d76', 'end', 18) +
      k.kutu(260, 230, 50, '') +
      k.ok({ x1: 260, y1: 230, x2: 410, y2: 230, ad: 'F1', renk: T, etiket: '30 N', ex: 4, ey: -16 }) +
      k.ok({ x1: 260, y1: 230, x2: 210, y2: 230, ad: 'F2', renk: F, etiket: '10 N', ex: -44, ey: 8 }) +
      k.ok({ x1: 260, y1: 230, x2: 260, y2: 30, ad: 'N', renk: N, etiket: 'N', ex: 24, ey: 14, gizli: true }) +
      k.ok({ x1: 260, y1: 230, x2: 260, y2: 430, ad: 'G', renk: G, etiket: 'G', ex: 24, ey: 0, gizli: true }) +
      yaz(300, 200, '4 kg', '#173430', 'start', 20));

    return [
      k.kapak({ etiket: '11. SINIF FİZİK, HAFTA 9', baslik: 'Serbest cisim diyagramı.', vurgu: 'Kuvvetleri gör, yasayı oku.', aciklama: 'Bir cisme etki eden bütün kuvvetleri bulmak, doğru çizmek ve Newton’ın yasalarını diyagramdan okumak.' }),
      k.konu({
        etiket: 'KAVRAM', kod: 'FİZ.11.1.5', baslik: 'Serbest cisim diyagramı nedir?', sekil: s1,
        maddeler: [
          'Cisim, çevresinden ayrılmış tek başına bir kutu ya da nokta gibi çizilir.',
          { metin: 'Yalnızca <b>o cisme</b> etki eden kuvvetler oklarla gösterilir.', vurgu: 'G,N' },
          'Cismin başka cisimlere uyguladığı kuvvetler bu diyagrama çizilmez.',
          { formul: 'Ok uzunluğu ∝ kuvvetin büyüklüğü', aciklama: 'Masadaki kitap dengede olduğu için G ve N okları eşit uzunlukta çizilir.', vurgu: 'G,N' },
        ],
      }),
      k.konu({
        etiket: 'KUVVETLERİ BELİRLEYELİM', kod: 'FİZ.11.1.5', baslik: 'Sık karşılaşılan kuvvetler',
        maddeler: [
          '<b>Ağırlık (G):</b> Dünya’nın cisme uyguladığı çekim kuvveti. Her zaman düşey aşağı. G = m · g',
          '<b>Normal kuvvet (N):</b> Cismin dokunduğu yüzeyin cisme uyguladığı itme. Yüzeye dik.',
          '<b>Gerilme kuvveti (T):</b> Gergin bir ipin cisme uyguladığı çekme. İp boyunca, cisimden dışarı doğru.',
          '<b>Uygulanan kuvvet (F):</b> Bir kişinin ya da makinenin cismi itmesi ya da çekmesi.',
          { formul: 'Bu derste temas gerektirmeyen tek kuvvet: ağırlık', aciklama: 'Diğer her kuvvet için “Cisme ne dokunuyor?” diye sor.' },
        ],
      }),
      k.konu({
        etiket: 'YÖNTEM', kod: 'FİZ.11.1.5', baslik: 'Dört adımda serbest cisim diyagramı',
        maddeler: [
          '1. İncelenecek cismi seç ve ayrı bir kutu olarak çiz.',
          '2. Ağırlığı çiz: cismin merkezinden düşey aşağı. Diğer kuvvetleri de merkezden başlatabilirsin.',
          '3. Cisme dokunan her şeyi bul (yüzey, ip, el) ve her biri için bir kuvvet çiz.',
          '4. Okların uzunluklarını cismin hareket durumuna göre ayarla: dengede ise zıt kuvvetler eşit.',
        ],
      }),
      k.konu({
        etiket: 'NEWTON’IN YASALARI', kod: 'FİZ.11.1.5', baslik: 'Diyagramdan yasayı okumak',
        maddeler: [
          '<b>1. yasa:</b> Diyagramdaki kuvvetlerin bileşkesi sıfırsa duran cisim durmaya, hareket eden cisim sabit hızla doğrusal hareketine devam eder.',
          '<b>2. yasa:</b> Bileşke sıfır değilse cisim bileşke yönünde ivmelenir.',
          { formul: 'F<sub>net</sub> = m · a', aciklama: 'F<sub>net</sub>, diyagramdaki bütün kuvvetlerin bileşkesidir.' },
          '<b>3. yasa:</b> Etki-tepki çiftleri farklı cisimlere etki eder, bu yüzden aynı diyagramda birlikte yer almaz.',
        ],
      }),
      k.soru({
        etiket: 'DENGE', baslik: 'Tavana asılı lamba', sekil: s2,
        baglam: 'Kütlesi 2 kg olan bir lamba, tavana bağlı hafif bir ipe asılı olarak hareketsiz duruyor. g = 10 m/s² alınız.',
        maddeler: [
          {
            metin: 'Lambaya etki eden kuvvetleri belirleyip serbest cisim diyagramını çiziniz.', puan: '4 puan',
            adimlar: [
              { metin: 'Ağırlık G: düşey aşağı.', vurgu: 'G' },
              { metin: 'Lambaya dokunan tek şey ip: gerilme kuvveti T, düşey yukarı.', vurgu: 'T' },
            ],
            cevap: 'İki kuvvet: T yukarı, G aşağı, eşit uzunlukta.',
          },
          {
            metin: 'İpteki gerilme kuvveti kaç N’dur?', puan: '3 puan',
            adimlar: [
              'Lamba hareketsiz: F<sub>net</sub> = 0 (1. yasa).',
              { metin: 'T = G = m · g = 2 · 10 = 20 N', vurgu: 'T,G' },
            ],
            cevap: 'T = 20 N',
          },
          {
            metin: 'Bir öğrenci “T ile G etki-tepki çiftidir.” diyor. Değerlendiriniz.', puan: '3 puan',
            adimlar: ['T ve G aynı cisme, lambaya etki ediyor. Etki-tepki çiftleri ise farklı cisimlere etki eder.'],
            cevap: 'Yanlış. G’nin tepkisi, lambanın Dünya’yı çekmesidir.',
          },
        ],
      }),
      k.soru({
        etiket: 'İVMELİ HAREKET', baslik: 'Yukarı çekilen kova', sekil: s3,
        baglam: 'Kütlesi 5 kg olan bir kova, düşey bir iple yukarı doğru 2 m/s² büyüklüğünde sabit ivmeyle çekiliyor. Hava direnci önemsizdir. g = 10 m/s² alınız.',
        maddeler: [
          {
            metin: 'Kovanın serbest cisim diyagramını çiziniz. Hangi ok daha uzun olmalıdır?', puan: '3 puan',
            adimlar: [
              { metin: 'T yukarı, G aşağı.', vurgu: 'T,G' },
              { metin: 'İvme yukarı yönlü olduğuna göre bileşke kuvvet de yukarı yönlüdür.', vurgu: 'a' },
            ],
            cevap: 'T oku G okundan uzun çizilir.',
          },
          {
            metin: 'İpteki gerilme kuvveti kaç N’dur?', puan: '4 puan',
            adimlar: [
              'G = 5 · 10 = 50 N',
              'F<sub>net</sub> = m · a = 5 · 2 = 10 N, yukarı',
              { metin: 'T − G = F<sub>net</sub>  →  T = 50 + 10', vurgu: 'T,G' },
            ],
            cevap: 'T = 60 N',
          },
          {
            metin: 'Kova sabit hızla çekilseydi gerilme kuvveti kaç N olurdu?', puan: '3 puan',
            adimlar: ['Sabit hız: a = 0, F<sub>net</sub> = 0 (1. yasa).'],
            cevap: 'T = G = 50 N',
          },
        ],
      }),
      k.soru({
        etiket: 'YATAY DÜZLEM', baslik: 'İki kuvvetle çekilen kutu', sekil: s4,
        baglam: 'Sürtünmesiz yatay zemindeki 4 kg kütleli kutuya sağa doğru 30 N, sola doğru 10 N büyüklüğünde yatay kuvvetler uygulanıyor. g = 10 m/s² alınız.',
        maddeler: [
          {
            metin: 'Kutuya etki eden bütün kuvvetleri belirleyiniz.', puan: '3 puan',
            adimlar: [
              { metin: 'Yatayda: 30 N sağa, 10 N sola.', vurgu: 'F1,F2' },
              { metin: 'Düşeyde: G = 40 N aşağı, zeminin normal kuvveti N yukarı.', vurgu: 'G,N' },
            ],
          },
          {
            metin: 'Normal kuvvet kaç N’dur?', puan: '2 puan',
            adimlar: [{ metin: 'Düşeyde hareket yok: N = G = 4 · 10', vurgu: 'G,N' }],
            cevap: 'N = 40 N',
          },
          {
            metin: 'Kutunun ivmesinin büyüklüğü ve yönü nedir?', puan: '5 puan',
            adimlar: [
              { metin: 'F<sub>net</sub> = 30 − 10 = 20 N, sağa', vurgu: 'F1,F2' },
              'a = F<sub>net</sub> / m = 20 / 4',
            ],
            cevap: 'a = 5 m/s², sağa',
          },
        ],
      }),
      k.kapanis({ baslik: 'Önce diyagram, sonra denklem.', vurgu: 'Gelecek ders: sürtünme kuvvetleri.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
