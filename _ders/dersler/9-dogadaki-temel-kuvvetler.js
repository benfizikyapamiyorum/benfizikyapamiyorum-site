// 9. sınıf, Kuvvet ve Hareket 4. ders: Doğadaki temel kuvvetler (yaklaşık 20 dakikalık video)
// MEB ders kitabı 2.4, s. 86-91 ile paralel: kuvvetin tanımı, dört temel kuvvet, özellik tablosu,
// "hangi temel kuvvet" örnek ve alıştırma tipleri (olaylar bizim). TYMM FİZ.9.2.5.
// Önceki ders: 9-vektorler-toplama-2. Sonraki ders: konum, yol, yer değiştirme (kitap 2.5.1).
module.exports = {
  slug: '9-dogadaki-temel-kuvvetler',
  baslik: '9. Sınıf Fizik: Doğadaki Temel Kuvvetler',
  dersAdi: '9. sınıf, temel kuvvetler',
  slaytlar: (k) => {
    const T = '#b06a3b', N = '#1d3b8f', G = '#244f40', M = '#7a3b8f', K = '#a33a2a', S = '#173430', GR = '#8b98a5';
    const yz = (x, y, t, renk = S, boy = 22, a = 'start', w = 800) => `<text x="${x}" y="${y}" font-size="${boy}" font-weight="${w}" fill="${renk}" text-anchor="${a}">${t}</text>`;
    const top = (x, y, r, renk, isaret = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${renk}" stroke="#fff" stroke-width="2.5"/>` + (isaret ? yz(x, y + r * 0.36, isaret, '#fff', r * 1.05, 'middle') : '');
    const kart = (x, y, ad, alt, renk, id, ikon) => `<g class="vek" data-ad="${id}"><rect x="${x}" y="${y}" width="280" height="160" rx="14" fill="#fff" stroke="${renk}" stroke-width="3"/><g transform="translate(${x},${y})">${ikon}</g>${yz(x + 140, y + 116, ad, renk, 21, 'middle')}${yz(x + 140, y + 144, alt, S, 17, 'middle', 700)}</g>`;

    // Küçük ikonlar (280 x 84 alan içinde, ortası x = 140, y = 48)
    const iGuclu = top(122, 38, 17, K, '+') + top(156, 38, 17, GR) + top(122, 66, 17, GR) + top(156, 66, 17, K, '+');
    const iEm = `<rect x="84" y="34" width="56" height="34" rx="5" fill="${K}"/><rect x="140" y="34" width="56" height="34" rx="5" fill="${N}"/>` + yz(112, 59, 'N', '#fff', 22, 'middle') + yz(168, 59, 'S', '#fff', 22, 'middle');
    const iZayif = top(96, 52, 20, GR) + k.ok({ x1: 124, y1: 52, x2: 162, y2: 52, renk: S, kalin: 4 }) + top(190, 52, 20, K, '+') + top(226, 36, 7, N);
    const iKutle = top(100, 52, 30, G) + top(204, 52, 12, GR) + k.ok({ x1: 188, y1: 52, x2: 140, y2: 52, renk: T, kalin: 4 });
    const sDort = k.svg(600, 350,
      kart(10, 8, 'Güçlü nükleer kuvvet', 'çekirdeği bir arada tutar', K, 'guclu', iGuclu) + kart(310, 8, 'Elektromanyetik kuvvet', 'yükler ve mıknatıslar', N, 'em', iEm) +
      kart(10, 182, 'Zayıf nükleer kuvvet', 'çekirdeği dönüştürür', M, 'zayif', iZayif) + kart(310, 182, 'Kütle çekim kuvveti', 'kütleler birbirini çeker', G, 'kutle', iKutle));

    // Şekil: atom çekirdeği
    const cek = [[0, 0, 1], [58, 0, 0], [-58, 0, 0], [29, 50, 1], [-29, 50, 0], [29, -50, 0], [-29, -50, 1]];
    const sCekirdek = k.svg(460, 350,
      `<g class="vek" data-ad="cekirdek">${cek.map(([dx, dy, p]) => top(230 + dx, 140 + dy, 30, p ? K : GR, p ? '+' : '')).join('')}</g>` +
      `<g class="vek" data-ad="it">${k.ok({ x1: 178, y1: 68, x2: 140, y2: 34, renk: N, kalin: 5 })}${k.ok({ x1: 282, y1: 212, x2: 320, y2: 246, renk: N, kalin: 5 })}${yz(360, 60, 'protonlar', N, 19, 'middle')}${yz(360, 84, 'birbirini iter', N, 19, 'middle')}</g>` +
      top(80, 306, 14, K, '+') + yz(104, 313, 'proton', S, 21) + top(270, 306, 14, GR) + yz(294, 313, 'nötron', S, 21));

    // Şekil: uzun menzilli iki kuvvet
    const sUzak = k.svg(500, 350,
      `<g class="vek" data-ad="kc">${yz(250, 30, 'Kütle çekim: yalnızca çeker', G, 21, 'middle')}${top(110, 100, 44, G)}${yz(110, 108, 'Dünya', '#fff', 19, 'middle')}${top(400, 100, 20, GR)}${yz(400, 150, 'Ay', S, 19, 'middle')}` +
      k.ok({ x1: 160, y1: 100, x2: 230, y2: 100, renk: T, kalin: 5 }) + k.ok({ x1: 374, y1: 100, x2: 304, y2: 100, renk: T, kalin: 5 }) + `</g>` +
      `<line x1="20" y1="176" x2="480" y2="176" stroke="#d9d3c4" stroke-width="2"/>` +
      `<g class="vek" data-ad="ek">${yz(250, 212, 'Elektromanyetik: çeker ya da iter', N, 21, 'middle')}` +
      top(50, 270, 20, K, '+') + top(190, 270, 20, N, '−') + k.ok({ x1: 76, y1: 270, x2: 110, y2: 270, renk: S, kalin: 4 }) + k.ok({ x1: 164, y1: 270, x2: 130, y2: 270, renk: S, kalin: 4 }) + yz(120, 326, 'zıt yükler çeker', S, 18, 'middle', 700) +
      top(340, 270, 20, K, '+') + top(420, 270, 20, K, '+') + k.ok({ x1: 314, y1: 270, x2: 280, y2: 270, renk: S, kalin: 4 }) + k.ok({ x1: 446, y1: 270, x2: 480, y2: 270, renk: S, kalin: 4 }) + yz(380, 326, 'aynı yükler iter', S, 18, 'middle', 700) + `</g>`);

    return [
      k.kapak({ etiket: '9. SINIF FİZİK, KUVVET VE HAREKET', baslik: 'Doğadaki temel kuvvetler.', vurgu: 'Dört kuvvet, bütün evren.', aciklama: 'Güçlü nükleer, elektromanyetik, zayıf nükleer ve kütle çekim kuvveti. Hangisi nerede etkili, benzerlikleri ve farkları neler? Ders kitabı 2.4, sayfa 86-91.' }),
      k.konu({
        etiket: 'HATIRLA', kod: 'FİZ.9.2.5', baslik: 'Kuvvet ne yapar?',
        maddeler: [
          'Kuvvet; duran cismi harekete geçirebilen, hareket eden cismi hızlandırabilen, yavaşlatabilen ya da durdurabilen etkidir.',
          'Kuvvet cismin hareket yönünü ve şeklini de değiştirebilir.',
          { formul: 'Sembolü F, birimi newton (N)', aciklama: 'Kuvvet vektörel bir niceliktir; büyüklüğü ve yönü vardır.' },
          'Aristo’ya göre kuvvet uygulamak için temas şarttı. Bugün biliyoruz ki mıknatıs çiviyi, Dünya elmayı dokunmadan çeker.',
          'Soru: doğadaki bütün kuvvetlerin kaynağında kaç temel kuvvet var?',
        ],
      }),
      k.konu({
        etiket: 'GENEL BAKIŞ', kod: 'FİZ.9.2.5', baslik: 'Dört temel kuvvet', sekil: sDort,
        maddeler: [
          { metin: '<b>Güçlü nükleer kuvvet:</b> proton ve nötronları çekirdekte bir arada tutar.', vurgu: 'guclu' },
          { metin: '<b>Elektromanyetik kuvvet:</b> elektrik yükleri ve mıknatıslar arasındaki itme ve çekme.', vurgu: 'em' },
          { metin: '<b>Zayıf nükleer kuvvet:</b> çekirdeği kararsız yapar, parçacıkları başka parçacıklara dönüştürür.', vurgu: 'zayif' },
          { metin: '<b>Kütle çekim kuvveti:</b> kütlesi olan her şey birbirini çeker.', vurgu: 'kutle' },
        ],
      }),
      k.konu({
        etiket: 'ÇEKİRDEK DÜZEYİ', kod: 'FİZ.9.2.5', baslik: 'Güçlü ve zayıf nükleer kuvvet', sekil: sCekirdek,
        maddeler: [
          { metin: 'Çekirdekteki protonlar artı yüklüdür ve birbirini iter. Yine de çekirdek dağılmaz.', vurgu: 'it' },
          { metin: '<b>Güçlü nükleer kuvvet</b> proton ve nötronları bir arada tutar. Dört kuvvetin en güçlüsüdür ama yalnızca çekirdek içinde etkilidir.', vurgu: 'cekirdek' },
          'Güneş’te hidrojen çekirdeklerinin birleşip helyuma dönüşmesinde güçlü nükleer kuvvet etkilidir.',
          '<b>Zayıf nükleer kuvvet</b> çekirdeğin yapısını değiştirir: proton ve nötronlar başka parçacıklara dönüşür. Örnek: karbon atomunun azota dönüşmesi, uranyum çekirdeğinin parçalanması.',
        ],
      }),
      k.konu({
        etiket: 'ÇEKİRDEĞİN DIŞI', kod: 'FİZ.9.2.5', baslik: 'Elektromanyetik ve kütle çekim', sekil: sUzak,
        maddeler: [
          { metin: '<b>Kütle çekim kuvveti:</b> iki kütlenin birbirine uyguladığı çekme kuvvetidir. Elmanın düşmesi, gezegenlerin Güneş çevresinde dolanması, gelgit.', vurgu: 'kc' },
          { metin: '<b>Elektromanyetik kuvvet:</b> yüklerin ve manyetik kutupların etkileşimidir. Tarağın kâğıt parçalarını çekmesi, pusula, mıknatıs, şimşek.', vurgu: 'ek' },
          'İkisinin de etki mesafesinin sonsuz olduğu kabul edilir.',
          'Fark: kütle çekim yalnızca çeker. Elektromanyetik kuvvet hem çekebilir hem itebilir.',
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.9.2.5', baslik: 'Hangi temel kuvvet? (1)',
        baglam: 'Aşağıdaki olayların her birinde etkili olan temel kuvveti yazınız.',
        tablo: { basliklar: ['Olay', 'Temel kuvvet'], doldur: 0, satirlar: [
          ['Ay’ın Dünya çevresinde dolanması', 'Kütle çekim'],
          ['Magnetin buzdolabı kapısına yapışması', 'Elektromanyetik'],
          ['Atılan basketbol topunun yere düşmesi', 'Kütle çekim'],
          ['Saça sürtülen balonun saçı çekmesi', 'Elektromanyetik'],
          ['Helyum çekirdeğinde iki protonun bir arada kalması', 'Güçlü nükleer'],
        ] },
        maddeler: [
          { metin: 'Tabloyu doldurunuz.', puan: '5 puan', cevap: 'İpucu: kütle varsa kütle çekim, yük ya da mıknatıs varsa elektromanyetik, çekirdek dağılmıyorsa güçlü nükleer.' },
          { metin: 'Bu olayların hangilerinde cisimler birbirine değmeden etkileşir?', puan: '3 puan', cevap: 'Hepsinde. Temel kuvvetlerin hiçbiri temas gerektirmez.' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.9.2.5', baslik: 'Hangi temel kuvvet? (2)',
        baglam: 'Bu kez olaylar daha çok atom düzeyinde.',
        tablo: { basliklar: ['Olay', 'Temel kuvvet'], doldur: 0, satirlar: [
          ['Uranyum çekirdeğinin santralde parçalanması', 'Zayıf nükleer'],
          ['Çekirdekteki protonların birbirini itmesi', 'Elektromanyetik'],
          ['Demir çekirdeğinin dağılmadan kalması', 'Güçlü nükleer'],
          ['Karbon atomunun zamanla azota dönüşmesi', 'Zayıf nükleer'],
          ['Okyanuslarda gelgit oluşması', 'Kütle çekim'],
        ] },
        maddeler: [
          { metin: 'Tabloyu doldurunuz.', puan: '5 puan', cevap: 'İpucu: çekirdek bir arada kalıyorsa güçlü, çekirdek değişiyor ya da parçalanıyorsa zayıf nükleer kuvvet.' },
          { metin: 'Protonların itmesi neden nükleer kuvvet değil?', puan: '3 puan', cevap: 'İtmenin nedeni protonların elektrik yüküdür. Aynı yükler birbirini iter: elektromanyetik kuvvet.' },
        ],
      }),
      k.soru({
        etiket: 'KARŞILAŞTIR', kod: 'FİZ.9.2.5', baslik: 'Özellikten kuvvete',
        baglam: 'Her özellik bir ya da iki temel kuvvete aittir.',
        tablo: { basliklar: ['Özellik', 'Kuvvet'], doldur: 0, satirlar: [
          ['Yalnızca çekirdek düzeyinde etkilidir.', 'Güçlü ve zayıf nükleer'],
          ['Çekirdeğin dışında da etkilidir.', 'Elektromanyetik, kütle çekim'],
          ['Çekirdeğin yapısını korur.', 'Güçlü nükleer'],
          ['Çekirdeğin yapısında değişime neden olur.', 'Zayıf nükleer'],
          ['Cismin ağırlığının sebebidir.', 'Kütle çekim'],
        ] },
        maddeler: [
          { metin: 'Her özelliğin karşısına ilgili kuvveti ya da kuvvetleri yazınız.', puan: '5 puan', cevap: 'Nükleer kuvvetler çekirdekte kalır. Diğer ikisinin etki mesafesi sonsuz kabul edilir.' },
          { metin: 'Dört kuvvetin ortak bir özelliğini yazınız.', puan: '2 puan', cevap: 'Hepsi cisimler ya da parçacıklar arasındaki bir etkileşimdir ve temas gerektirmez.' },
          { metin: 'Kütle çekim ile elektromanyetik kuvvetin bir farkını yazınız.', puan: '3 puan', cevap: 'Kütle çekim yalnızca çeker ve kütleye bağlıdır. Elektromanyetik kuvvet hem çeker hem iter, yüke bağlıdır.' },
        ],
      }),
      k.soru({
        etiket: 'YORUM', kod: 'FİZ.9.2.5', baslik: 'Çekirdek neden dağılmıyor?', sekil: sCekirdek,
        baglam: 'Bir atom çekirdeğinde artı yüklü protonlar ve yüksüz nötronlar çok küçük bir hacimde bir arada bulunur.',
        maddeler: [
          { metin: 'Protonlar arasındaki itme hangi temel kuvvettir?', puan: '3 puan', adimlar: [{ metin: 'Protonların hepsi artı yüklüdür.', vurgu: 'it' }], cevap: 'Elektromanyetik kuvvet.' },
          { metin: 'Çekirdeği bir arada tutan temel kuvvet hangisidir?', puan: '3 puan', cevap: 'Güçlü nükleer kuvvet.', cevapVurgu: 'cekirdek' },
          { metin: 'Çekirdek dağılmadığına göre bu iki kuvvetin büyüklükleri çekirdek içinde nasıl karşılaştırılır?', puan: '4 puan', cevap: 'Çekirdek içinde güçlü nükleer kuvvet, elektromanyetik itmeden büyüktür. Bu yüzden adı güçlüdür.' },
        ],
      }),
      k.soru({
        etiket: 'YAZILI TİPİ', kod: 'FİZ.9.2.5', baslik: 'Elif’in iddiası', sekil: sDort,
        baglam: 'Elif, “Bir cisme kuvvet uygulamak için ona mutlaka dokunmak gerekir.” diyor.',
        maddeler: [
          { metin: 'Elif’in iddiasını iki örnekle değerlendiriniz.', puan: '4 puan', adimlar: [{ metin: 'Mıknatıs çiviyi dokunmadan çeker.', vurgu: 'em' }, { metin: 'Dünya, daldan kopan yaprağı dokunmadan çeker.', vurgu: 'kutle' }], cevap: 'İddia yanlıştır. Temel kuvvetler temas olmadan da etki eder.' },
          { metin: 'Bu iki örnekteki temel kuvvetleri yazınız.', puan: '3 puan', cevap: 'Mıknatıs: elektromanyetik kuvvet. Yaprak: kütle çekim kuvveti.' },
          { metin: 'Günlük hayatta en kolay gözlemlediğimiz iki temel kuvvet hangileridir? Neden?', puan: '3 puan', cevap: 'Kütle çekim ve elektromanyetik kuvvet. Etki mesafeleri çekirdekle sınırlı değildir.', cevapVurgu: 'em,kutle' },
        ],
      }),
      k.konu({
        etiket: 'ÖZET', kod: 'FİZ.9.2.5', baslik: 'Yazılıda ne sorulur?', sekil: sDort,
        maddeler: [
          { metin: 'Bir olay verilir, etkili temel kuvvet sorulur. Her senaryoda bir soru var.', vurgu: 'guclu,em,zayif,kutle' },
          'Çekirdek bir arada kalıyorsa güçlü, çekirdek değişiyorsa zayıf nükleer kuvvet.',
          'Yük, mıknatıs, pusula, şimşek: elektromanyetik kuvvet.',
          'Ağırlık, düşme, gezegenler, gelgit: kütle çekim kuvveti.',
          'Benzerlik ve fark: etki mesafesi, çekme ve itme, neye bağlı olduğu.',
        ],
      }),
      k.kapanis({ baslik: 'Sıradaki ders: konum, yol, yer değiştirme.', vurgu: 'Abone olmayı unutma.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
