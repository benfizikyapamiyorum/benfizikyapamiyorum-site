// 9. sınıf, Vektörler 1: baştan giriş, bol tekrarlı (yaklaşık 20 dakikalık video)
// TYMM FİZ.9.2.2 (skaler/vektörel karşılaştırma), FİZ.9.2.3 (aynı doğrultudaki vektörler: eşit, zıt, gerçek sayıyla çarpılmış),
// FİZ.9.2.4'e giriş (uç uca ekleme). Trigonometri yok.
module.exports = {
  slug: '9-vektorler-1-giris',
  baslik: '9. Sınıf Fizik: Vektörlere Giriş (Skaler, Vektörel, Aynı Doğrultudaki Vektörler)',
  dersAdi: '9. sınıf, vektörlere giriş',
  slaytlar: (k) => {
    const A = '#244f40', B = '#1d3b8f', R = '#b06a3b', M = '#7a3e9d', V = k.V;

    // Vektörün öğeleri
    const g0 = k.kare({ x0: 0, x1: 8, y0: 0, y1: 5, u: 60, eksen: false });
    const [bx, by] = g0.p(1, 1), [ux, uy] = g0.p(7, 4);
    const s0 = k.svg(g0.w, g0.h, g0.zemin +
      `<g class="vek gizli" data-ad="dog"><line x1="${g0.p(0, 0.5)[0]}" y1="${g0.p(0, 0.5)[1]}" x2="${g0.p(8, 4.5)[0]}" y2="${g0.p(8, 4.5)[1]}" stroke="#6b7d76" stroke-width="2" stroke-dasharray="8 8"/></g>` +
      g0.v({ ad: 'K', from: [1, 1], to: [7, 4], renk: R, etiket: '', kalin: 6 }) +
      `<g class="vek gizli" data-ad="bas"><circle cx="${bx}" cy="${by}" r="9" fill="${A}"/><text x="${bx + 4}" y="${by + 38}" font-size="22" font-weight="700" fill="${A}" text-anchor="middle">başlangıç</text></g>` +
      `<g class="vek gizli" data-ad="uc"><text x="${ux - 20}" y="${uy - 18}" font-size="22" font-weight="700" fill="${R}" text-anchor="middle">uç (yön)</text></g>` +
      `<g class="vek gizli" data-ad="buy"><text x="${(bx + ux) / 2 + 40}" y="${(by + uy) / 2 + 44}" font-size="22" font-weight="700" fill="${B}" text-anchor="middle">uzunluk = büyüklük</text></g>`);

    // Eşit, zıt, sayıyla çarpılmış vektörler (A'nın uzunluğu 2 birim)
    const g1 = k.kare({ x0: 0, x1: 12, y0: 0, y1: 5, u: 46, eksen: false });
    const s1 = k.svg(g1.w, g1.h, g1.zemin +
      g1.v({ ad: 'A', from: [1, 4], to: [3, 4], renk: A, etiket: 'A', ex: -24, ey: -12 }) +
      g1.v({ ad: 'es', from: [5, 4], to: [7, 4], renk: A, etiket: 'B', ex: -24, ey: -12 }) +
      g1.v({ ad: 'zit', from: [11, 4], to: [9, 4], renk: B, etiket: '−A', ex: 24, ey: -12 }) +
      g1.v({ ad: 'iki', from: [1, 2], to: [5, 2], renk: R, etiket: '2A', ex: -40, ey: -12 }) +
      g1.v({ ad: 'yarim', from: [9, 2], to: [8, 2], renk: M, etiket: '−½A', ex: 22, ey: -12 }));

    // Tekrar 2: K, L, M, N
    const g2 = k.kare({ x0: 0, x1: 12, y0: 0, y1: 5, u: 46, eksen: false });
    const s2 = k.svg(g2.w, g2.h, g2.zemin +
      g2.v({ ad: 'K', from: [1, 4], to: [4, 4], renk: A, etiket: 'K', ex: -36, ey: -12 }) +
      g2.v({ ad: 'L', from: [7, 4], to: [10, 4], renk: B, etiket: 'L', ex: -36, ey: -12 }) +
      g2.v({ ad: 'M', from: [1, 2], to: [7, 2], renk: R, etiket: 'M', ex: -70, ey: -12 }) +
      g2.v({ ad: 'N', from: [11, 2], to: [8, 2], renk: M, etiket: 'N', ex: 36, ey: -12 }));

    // Aynı doğrultuda toplama (1 kare = 1 N)
    const g3 = k.kare({ x0: 0, x1: 8, y0: 0, y1: 6, u: 50, eksen: false });
    const s3 = k.svg(g3.w, g3.h, g3.zemin +
      g3.v({ ad: 'ay', from: [1, 5], to: [4, 5], renk: A, etiket: '3 N', ex: -36, ey: -12 }) +
      g3.v({ ad: 'ay', from: [4, 5], to: [6, 5], renk: B, etiket: '2 N', ex: -24, ey: -12 }) +
      g3.v({ ad: 'ayR', from: [1, 4], to: [6, 4], renk: R, etiket: 'R = 5 N', ex: 10, ey: 32, gizli: true }) +
      g3.v({ ad: 'zt', from: [1, 2], to: [4, 2], renk: A, etiket: '3 N', ex: -36, ey: -12 }) +
      g3.v({ ad: 'zt', from: [4, 1.6], to: [2, 1.6], renk: B, etiket: '2 N', ex: 0, ey: 30 }) +
      g3.v({ ad: 'ztR', from: [1, 0.6], to: [2, 0.6], renk: R, etiket: 'R = 1 N', ex: 60, ey: 8, gizli: true }));

    // Uç uca ekleme (giriş)
    const g4 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 60 });
    const s4 = k.svg(g4.w, g4.h, g4.zemin +
      g4.v({ ad: 'A', from: [0, 0], to: [3, 1], renk: A, etiket: 'A', ex: 0, ey: 34 }) +
      g4.v({ ad: 'B', from: [3, 1], to: [4, 4], renk: B, etiket: 'B', ex: 26, ey: 30, gizli: true }) +
      g4.v({ ad: 'R', from: [0, 0], to: [4, 4], renk: R, etiket: 'R', ex: -28, ey: 4, gizli: true }));

    // Tekrar 4: üç vektör A(2,1), B(1,2), C(-2,1), bileşke (1,4)
    const g5 = k.kare({ x0: -3, x1: 5, y0: -1, y1: 5, u: 56 });
    const s5 = k.svg(g5.w, g5.h, g5.zemin +
      g5.v({ ad: 'A', from: [0, 0], to: [2, 1], renk: A, etiket: 'A', ex: 0, ey: 32 }) +
      g5.v({ ad: 'B', from: [0, 0], to: [1, 2], renk: B, etiket: 'B', ex: -22, ey: 0 }) +
      g5.v({ ad: 'C', from: [0, 0], to: [-2, 1], renk: M, etiket: 'C', ex: -22, ey: 0 }) +
      g5.v({ ad: 'B2', from: [2, 1], to: [3, 3], renk: B, etiket: '', gizli: true }) +
      g5.v({ ad: 'C2', from: [3, 3], to: [1, 4], renk: M, etiket: '', gizli: true }) +
      g5.v({ ad: 'R', from: [0, 0], to: [1, 4], renk: R, etiket: 'R', ex: -24, ey: 4, gizli: true }));

    return [
      k.kapak({ etiket: '9. SINIF FİZİK, VEKTÖRLER 1', baslik: 'Vektörlere baştan başlıyoruz.', vurgu: 'Skaler, vektörel, ok.', aciklama: 'Her bölümün arkasından bir tekrar sorusu var. Önce sen düşün, sonra ekrana dokun.' }),
      k.konu({
        etiket: 'BAŞLANGIÇ', kod: 'FİZ.9.2.2', baslik: 'Her nicelik aynı şekilde anlatılmaz',
        maddeler: [
          '“Sınıfın sıcaklığı 22 °C.” Başka bilgiye gerek var mı? Yok.',
          '“Kutuyu 50 N ile itiyorum.” Kutu nereye gidecek? Bilmiyoruz. Hangi yöne ittiğimi de söylemeliyim.',
          '<b>Skaler nicelik:</b> Sayı ve birimle tam anlatılır. Kütle, sıcaklık, zaman, enerji, sürat.',
          '<b>Vektörel nicelik:</b> Sayı ve birimin yanında yön de gerekir. Kuvvet, yer değiştirme, hız.',
          { formul: 'Vektörel = büyüklük + yön', aciklama: 'Büyüklük: sayı ve birim. Yön: nereye doğru olduğu.' },
        ],
      }),
      k.soru({
        etiket: 'TEKRAR 1', kod: 'FİZ.9.2.2', baslik: 'Skaler mi, vektörel mi?',
        baglam: 'Aşağıdaki nicelikleri tek tek düşün. Her biri için “yön söylemem gerekir mi?” diye sor.',
        tablo: { basliklar: ['Nicelik', 'Örnek', 'Türü'], doldur: 0, satirlar: [
          ['Kütle', '5 kg şeker', 'Skaler'], ['Kuvvet', '20 N, doğuya', 'Vektörel'], ['Sıcaklık', '−5 °C', 'Skaler'],
          ['Yer değiştirme', '300 m, kuzeye', 'Vektörel'], ['Zaman', '45 dakika', 'Skaler'], ['Hız', '60 km/h, batıya', 'Vektörel'],
          ['Sürat', '60 km/h', 'Skaler'], ['Enerji', '200 J', 'Skaler']] },
        maddeler: [
          { metin: 'Tablodaki nicelikleri skaler ve vektörel olarak sınıflandırınız.', puan: '8 puan', cevap: 'Skaler: kütle, sıcaklık, zaman, sürat, enerji. Vektörel: kuvvet, yer değiştirme, hız.' },
          { metin: 'Hız ile sürat arasındaki fark nedir?', puan: '2 puan', cevap: 'Hız yer değiştirmeye bağlıdır ve yönü vardır, vektöreldir. Sürat alınan yola bağlıdır, yönü yoktur, skalerdir.' },
        ],
      }),
      k.konu({
        etiket: 'KARŞILAŞTIRALIM', kod: 'FİZ.9.2.2', baslik: 'Benzerlikler ve farklar',
        maddeler: [
          '<b>Benzer:</b> İkisi de ölçülür, sayı ve birimle yazılır. Aynı türden nicelikler toplanabilir.',
          '<b>Fark 1:</b> Vektörel niceliğin yönü vardır, skaler niceliğin yoktur.',
          '<b>Fark 2, toplama:</b> 2 kg + 3 kg her zaman 5 kg’dır. Ama 2 N ile 3 N’luk iki kuvvetin toplamı yönlerine göre 1 N ile 5 N arasında herhangi bir değer olabilir.',
          { formul: 'Skalerler sayı gibi, vektörler yönüyle toplanır.', aciklama: 'Vektörleri toplamanın yollarını bu derste ve gelecek derste göreceğiz.' },
        ],
      }),
      k.konu({
        etiket: 'GÖSTERİM', kod: 'FİZ.9.2.3', baslik: 'Vektör okla gösterilir', sekil: s0,
        maddeler: [
          { metin: 'Okun başladığı yer: <b>başlangıç noktası</b>.', vurgu: 'K,bas' },
          { metin: 'Okun uzunluğu: <b>büyüklük</b>. Uzun ok, büyük nicelik.', vurgu: 'K,buy' },
          { metin: 'Okun üzerinde bulunduğu çizgi: <b>doğrultu</b>.', vurgu: 'dog' },
          { metin: 'Okun ucu: <b>yön</b>. Aynı doğrultuda iki yön vardır.', vurgu: 'K,uc' },
          { formul: `${V('K')}  ve  K`, aciklama: 'Üstü oklu yazılışı vektörün kendisi, oksuz yazılışı yalnızca büyüklüğüdür.' },
        ],
      }),
      k.konu({
        etiket: 'AYNI DOĞRULTUDA', kod: 'FİZ.9.2.3', baslik: 'Eşit, zıt ve sayıyla çarpılmış vektörler', sekil: s1,
        maddeler: [
          { metin: '<b>Eşit vektörler:</b> Büyüklükleri ve yönleri aynı. Nerede çizildikleri önemli değil.', vurgu: 'A,es' },
          { metin: '<b>Zıt vektör:</b> Büyüklüğü aynı, yönü ters. ' + V('A') + ' vektörünün zıttı −' + V('A') + '.', vurgu: 'A,zit' },
          { metin: '<b>Sayıyla çarpma:</b> 2' + V('A') + ' aynı yönde, iki kat uzun.', vurgu: 'A,iki' },
          { metin: 'Negatif bir sayıyla çarpınca yön ters döner: −½' + V('A') + ' ters yönde, yarı uzunlukta.', vurgu: 'A,yarim' },
          { formul: 'Sayının büyüklüğü uzunluğu, işareti yönü belirler.', aciklama: 'Artı: aynı yön. Eksi: ters yön.' },
        ],
      }),
      k.soru({
        etiket: 'TEKRAR 2', kod: 'FİZ.9.2.3', baslik: 'Kareli düzlemde dört vektör', sekil: s2,
        baglam: 'K, L, M ve N vektörleri aynı doğrultudadır. Kareler eşit büyüklüktedir.',
        maddeler: [
          { metin: V('K') + '’ye eşit olan vektör hangisidir?', puan: '2 puan', adimlar: [{ metin: 'K: 3 kare, sağa. L: 3 kare, sağa.', vurgu: 'K,L' }], cevap: V('L') + ', çünkü büyüklüğü ve yönü aynı.' },
          { metin: V('K') + '’nin zıttı olan vektör hangisidir?', puan: '2 puan', adimlar: [{ metin: 'N: 3 kare, sola. Büyüklük aynı, yön ters.', vurgu: 'K,N' }], cevap: V('N') + ' = −' + V('K') },
          { metin: V('M') + '’yi ' + V('K') + ' türünden yazınız.', puan: '2 puan', adimlar: [{ metin: 'M: 6 kare, sağa. K’nin iki katı ve aynı yönde.', vurgu: 'K,M' }], cevap: V('M') + ' = 2' + V('K') },
          { metin: V('N') + '’yi ' + V('M') + ' türünden yazınız.', puan: '2 puan', adimlar: [{ metin: 'N, M’nin yarısı kadar uzun ve ters yönde.', vurgu: 'M,N' }], cevap: V('N') + ' = −½' + V('M') },
        ],
      }),
      k.konu({
        etiket: 'AYNI DOĞRULTUDA TOPLAMA', kod: 'FİZ.9.2.4', baslik: 'Bileşke: hepsinin yerini tutan tek vektör', sekil: s3,
        maddeler: [
          { metin: '<b>Aynı yönde:</b> Büyüklükler toplanır. 3 N + 2 N, sağa doğru.', vurgu: 'ay' },
          { metin: 'Bileşke 5 N, yine sağa.', vurgu: 'ay,ayR' },
          { metin: '<b>Zıt yönde:</b> Büyük olandan küçük olan çıkarılır. 3 N sağa, 2 N sola.', vurgu: 'zt' },
          { metin: 'Bileşke 1 N, büyük olanın yönünde, yani sağa.', vurgu: 'zt,ztR' },
          { formul: 'R<sub>en büyük</sub> = F<sub>1</sub> + F<sub>2</sub><br>R<sub>en küçük</sub> = |F<sub>1</sub> − F<sub>2</sub>|', aciklama: 'Aynı yönde en büyük, zıt yönde en küçük bileşke çıkar.' },
        ],
      }),
      k.soru({
        etiket: 'TEKRAR 3', baslik: 'Halat çekme',
        baglam: 'Halat çekme oyununda Ali halatı 200 N, Ayşe 150 N büyüklüğünde kuvvetle sağa çekiyor. Karşı tarafta Can halatı 400 N büyüklüğünde kuvvetle sola çekiyor.',
        maddeler: [
          { metin: 'Ali ve Ayşe’nin kuvvetlerinin bileşkesi kaç N ve hangi yöndedir?', puan: '3 puan', adimlar: ['Aynı yönde: büyüklükler toplanır. 200 + 150'], cevap: '350 N, sağa' },
          { metin: 'Halata etki eden üç kuvvetin bileşkesi kaç N ve hangi yöndedir?', puan: '4 puan', adimlar: ['Sağa 350 N, sola 400 N. Zıt yönde: büyükten küçük çıkarılır. 400 − 350'], cevap: '50 N, sola' },
          { metin: 'Bileşkenin sıfır olması için dördüncü bir kişi hangi tarafa geçip kaç N’luk kuvvetle çekmelidir?', puan: '3 puan', adimlar: ['Sola doğru 50 N fazla var. Bunu dengelemek için sağa 50 N gerekir.'], cevap: 'Ali’nin tarafına geçip 50 N ile sağa çekmelidir.' },
        ],
      }),
      k.konu({
        etiket: 'FARKLI DOĞRULTULAR', kod: 'FİZ.9.2.4', baslik: 'Uç uca ekleme yöntemi', sekil: s4,
        maddeler: [
          'Vektörler aynı doğrultuda değilse sayılar gibi toplanmaz. Çizerek toplarız.',
          { metin: 'Birinci vektörü çiz.', vurgu: 'A' },
          { metin: 'İkincisini, yönünü ve uzunluğunu değiştirmeden birincinin ucundan başlat.', vurgu: 'A,B' },
          { metin: 'Birincinin başlangıcından sonuncunun ucuna çizilen vektör bileşkedir.', vurgu: 'A,B,R' },
          { formul: `${V('R')} = ${V('A')} + ${V('B')}`, aciklama: 'Kareli düzlemde bileşkenin ucu (4, 4) noktasıdır.', vurgu: 'R' },
        ],
      }),
      k.soru({
        etiket: 'TEKRAR 4', kod: 'FİZ.9.2.4', baslik: 'Üç vektörü uç uca ekle', sekil: s5,
        baglam: 'Kareli düzlemde A, B ve C vektörleri aynı başlangıç noktasından çizilmiştir.',
        maddeler: [
          {
            metin: 'Uç uca ekleme yöntemiyle ' + V('A') + ' + ' + V('B') + ' + ' + V('C') + ' bileşkesini çiziniz. Bileşkenin ucu hangi noktadadır?', puan: '6 puan',
            adimlar: [
              { metin: V('A') + '’yı olduğu gibi bırak: ucu (2, 1).', vurgu: 'A' },
              { metin: V('B') + '’yi ' + V('A') + '’nın ucuna taşı: 1 sağa, 2 yukarı. Ucu (3, 3).', vurgu: 'A,B2' },
              { metin: V('C') + '’yi ' + V('B') + '’nin ucuna taşı: 2 sola, 1 yukarı. Ucu (1, 4).', vurgu: 'A,B2,C2' },
            ],
            cevap: 'Bileşke başlangıç noktasından (1, 4) noktasına çizilen vektördür.', cevapVurgu: 'A,B2,C2,R',
          },
          { metin: 'Vektörleri ' + V('C') + ', ' + V('A') + ', ' + V('B') + ' sırasıyla ekleseydik bileşke değişir miydi?', puan: '2 puan', cevap: 'Değişmezdi. Toplama sırası bileşkeyi değiştirmez.', cevapVurgu: 'R' },
        ],
      }),
      k.soru({
        etiket: 'KARMA TEKRAR', baslik: 'Kısa sorular, hızlı cevaplar',
        baglam: 'Her soruyu önce kendin cevapla, sonra ekrana dokun.',
        maddeler: [
          { metin: '5 N ve 3 N büyüklüğündeki iki kuvvetin bileşkesi en az ve en çok kaç N olabilir?', puan: '3 puan', adimlar: ['En çok: aynı yönde, 5 + 3. En az: zıt yönde, 5 − 3.'], cevap: 'En az 2 N, en çok 8 N' },
          { metin: V('K') + ' vektörünün üç katı büyüklüğünde ve ters yönlü vektör nasıl yazılır?', puan: '2 puan', cevap: '−3' + V('K') },
          { metin: '“Hava sıcaklığı −5 °C, eksi işareti olduğuna göre sıcaklığın yönü vardır.” Bu görüş doğru mu?', puan: '3 puan', adimlar: ['Eksi işareti sıcaklığın sıfırın altında olduğunu gösterir, bir yön göstermez.'], cevap: 'Yanlış. Sıcaklık skaler bir niceliktir.' },
        ],
      }),
      k.konu({
        etiket: 'KISA TEKRAR', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          'Skaler: sayı ve birim. Vektörel: sayı, birim ve yön.',
          'Vektör okla gösterilir: uzunluğu büyüklük, ucu yön.',
          'Eşit vektör: aynı büyüklük, aynı yön. Zıt vektör: aynı büyüklük, ters yön.',
          'Sayıyla çarpmada sayının büyüklüğü uzunluğu, işareti yönü belirler (eksi: ters yön).',
          'Aynı doğrultuda: aynı yönde topla, zıt yönde çıkar. Farklı doğrultuda: uç uca ekle.',
        ],
      }),
      k.kapanis({ baslik: 'Vektörlerin temeli tamam.', vurgu: 'Gelecek ders: paralelkenar ve bileşenler.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
