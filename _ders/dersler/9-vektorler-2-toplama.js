// 9. sınıf, Kuvvet ve Hareket: Vektörlerde toplama, bol örnekli (yaklaşık 20 dakikalık video)
// TYMM FİZ.9.2.4: vektörlerin toplanması (uç uca, paralelkenar) ve dik koordinat sisteminde bileşenlerine ayrılması.
// Sınırlama: trigonometri yok; kareli düzlem, tam sayı bileşenler; dik vektörlerde büyüklük Pisagor ile.
module.exports = {
  slug: '9-vektorler-2-toplama',
  baslik: '9. Sınıf Fizik: Vektörlerde Toplama (Uç Uca, Paralelkenar, Bileşenler)',
  dersAdi: '9. sınıf, vektörlerde toplama',
  slaytlar: (k) => {
    const V = k.V;
    const YA = '#244f40', MA = '#1d3b8f', MO = '#7a3e9d', TU = '#b06a3b', GR = '#6b7d76';
    const yaz = (x, y, t, r = '#173430', a = 'middle', s = 24, w = 800) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${r}" text-anchor="${a}">${t}</text>`;
    const nokta = (g, x, y, ad = '', gizli = true) => { const [a, b] = g.p(x, y); return `<g class="vek${gizli ? ' gizli' : ''}" data-ad="${ad}"><circle cx="${a}" cy="${b}" r="9" fill="${TU}"/></g>`; };

    // KONU: uç uca ekleme
    const gU = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 70 });
    const sU = k.svg(gU.w, gU.h, gU.zemin +
      gU.v({ ad: 'A', from: [0, 0], to: [3, 1], renk: YA, etiket: 'A', ex: 10, ey: 34 }) +
      gU.v({ ad: 'B0', from: [-1 + 1, 2], to: [1, 4], renk: MA, etiket: 'B', ex: -24, ey: 0 }) +
      gU.v({ ad: 'B', from: [3, 1], to: [4, 3], renk: MA, etiket: 'B', ex: 24, ey: 10, gizli: true }) +
      gU.v({ ad: 'R', from: [0, 0], to: [4, 3], renk: TU, kalin: 9, etiket: 'R', ex: -10, ey: -18, gizli: true }));

    // Örnek 1: A(3,1), B(1,2) ayrı çizilmiş
    const g1 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 6, u: 66 });
    const s1 = k.svg(g1.w, g1.h, g1.zemin +
      g1.v({ ad: 'A', from: [0, 0], to: [3, 1], renk: YA, etiket: 'A', ex: 6, ey: 36 }) +
      g1.v({ ad: 'B0', from: [1, 3], to: [2, 5], renk: MA, etiket: 'B', ex: -26, ey: 4 }) +
      g1.v({ ad: 'B', from: [3, 1], to: [4, 3], renk: MA, etiket: 'B', ex: 26, ey: 14, gizli: true }) +
      g1.kesik([0, 0], [4, 0], GR, 'bx', true) + g1.kesik([4, 0], [4, 3], GR, 'bx', true) +
      g1.v({ ad: 'R', from: [0, 0], to: [4, 3], renk: TU, kalin: 9, etiket: 'R', ex: -6, ey: -18, gizli: true }));

    // Örnek 2: zincir K(1,3), L(3,0), M(0,-3)
    const g2 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 4, u: 70 });
    const s2 = k.svg(g2.w, g2.h, g2.zemin +
      g2.v({ ad: 'K', from: [0, 0], to: [1, 3], renk: YA, etiket: 'K', ex: -30, ey: 14 }) +
      g2.v({ ad: 'L', from: [1, 3], to: [4, 3], renk: MA, etiket: 'L', ex: -40, ey: -16 }) +
      g2.v({ ad: 'M', from: [4, 3], to: [4, 0], renk: MO, etiket: 'M', ex: 28, ey: -40 }) +
      g2.v({ ad: 'R', from: [0, 0], to: [4, 0], renk: TU, kalin: 9, etiket: 'R', ex: -60, ey: 40, gizli: true }) +
      g2.v({ ad: 'R2', from: [0, 0], to: [4, 3], renk: TU, kalin: 9, etiket: 'K + L', ex: -40, ey: 110, gizli: true }));

    // Örnek 3: kapalı şekil A(4,1), B(-1,3), C(-3,-1), D(0,-3)
    const g3 = k.kare({ x0: -1, x1: 5, y0: -1, y1: 5, u: 70 });
    const s3 = k.svg(g3.w, g3.h, g3.zemin +
      g3.v({ ad: 'A', from: [0, 0], to: [4, 1], renk: YA, etiket: 'A', ex: -40, ey: 40 }) +
      g3.v({ ad: 'B', from: [4, 1], to: [3, 4], renk: MA, etiket: 'B', ex: 34, ey: 40 }) +
      g3.v({ ad: 'C', from: [3, 4], to: [0, 3], renk: MO, etiket: 'C', ex: 40, ey: -34 }) +
      g3.v({ ad: 'D', from: [0, 3], to: [0, 0], renk: '#b03a3a', etiket: 'D', ex: -28, ey: -60 }) +
      nokta(g3, 0, 0, 'R0') +
      g3.v({ ad: 'R3', from: [0, 0], to: [0, 3], renk: TU, kalin: 9, etiket: 'R', ex: 34, ey: 40, gizli: true }));

    // Örnek 4: bilinmeyen vektör, A(2,3), R(5,3)
    const g4 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 70 });
    const s4 = k.svg(g4.w, g4.h, g4.zemin +
      g4.v({ ad: 'A', from: [0, 0], to: [2, 3], renk: YA, etiket: 'A', ex: -30, ey: 10 }) +
      g4.v({ ad: 'R', from: [0, 0], to: [5, 3], renk: TU, kalin: 9, etiket: 'R', ex: 28, ey: 36 }) +
      g4.v({ ad: 'B', from: [2, 3], to: [5, 3], renk: MA, etiket: 'B', ex: -50, ey: -16, gizli: true }));

    // KONU: paralelkenar
    const gP = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 70 });
    const sP = k.svg(gP.w, gP.h, gP.zemin +
      gP.v({ ad: 'A', from: [0, 0], to: [4, 1], renk: YA, etiket: 'A', ex: 0, ey: 40 }) +
      gP.v({ ad: 'B', from: [0, 0], to: [1, 3], renk: MA, etiket: 'B', ex: -30, ey: 0 }) +
      gP.kesik([4, 1], [5, 4], MA, 'k', true) + gP.kesik([1, 3], [5, 4], YA, 'k', true) +
      gP.v({ ad: 'R', from: [0, 0], to: [5, 4], renk: TU, kalin: 9, etiket: 'R', ex: 6, ey: -18, gizli: true }));

    // P1: A(4,0), B(0,3)
    const gp1 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 70 });
    const sp1 = k.svg(gp1.w, gp1.h, gp1.zemin +
      gp1.v({ ad: 'A', from: [0, 0], to: [4, 0], renk: YA, etiket: 'A', ex: -70, ey: 40 }) +
      gp1.v({ ad: 'B', from: [0, 0], to: [0, 3], renk: MA, etiket: 'B', ex: -32, ey: 50 }) +
      gp1.kesik([4, 0], [4, 3], MA, 'k', true) + gp1.kesik([0, 3], [4, 3], YA, 'k', true) +
      gp1.v({ ad: 'R', from: [0, 0], to: [4, 3], renk: TU, kalin: 9, etiket: 'R', ex: 24, ey: -10, gizli: true }));

    // P2: A(3,1), B(1,3)
    const gp2 = k.kare({ x0: -1, x1: 5, y0: -1, y1: 5, u: 70 });
    const sp2 = k.svg(gp2.w, gp2.h, gp2.zemin +
      gp2.v({ ad: 'A', from: [0, 0], to: [3, 1], renk: YA, etiket: 'A', ex: 6, ey: 38 }) +
      gp2.v({ ad: 'B', from: [0, 0], to: [1, 3], renk: MA, etiket: 'B', ex: -32, ey: 4 }) +
      gp2.kesik([3, 1], [4, 4], MA, 'k', true) + gp2.kesik([1, 3], [4, 4], YA, 'k', true) +
      gp2.v({ ad: 'B2', from: [3, 1], to: [4, 4], renk: MA, etiket: 'B', ex: 28, ey: 50, gizli: true }) +
      gp2.v({ ad: 'R', from: [0, 0], to: [4, 4], renk: TU, kalin: 9, etiket: 'R', ex: -6, ey: -18, gizli: true }));

    // P3: aynı noktadan üç vektör A(4,0), B(0,3), C(-4,0)
    const gp3 = k.kare({ x0: -5, x1: 5, y0: -1, y1: 4, u: 62 });
    const sp3 = k.svg(gp3.w, gp3.h, gp3.zemin +
      gp3.v({ ad: 'A', from: [0, 0], to: [4, 0], renk: YA, etiket: 'A', ex: -10, ey: 40 }) +
      gp3.v({ ad: 'C', from: [0, 0], to: [-4, 0], renk: MO, etiket: 'C', ex: 10, ey: 40 }) +
      gp3.v({ ad: 'B', from: [0, 0], to: [0, 3], renk: MA, etiket: 'B', ex: -32, ey: 30 }) +
      gp3.v({ ad: 'R', from: [0, 0], to: [0, 3], renk: TU, kalin: 11, etiket: 'R = B', ex: 80, ey: 30, gizli: true }));

    // KONU: bileşenler, C(4,3)
    const gB = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 70 });
    const sB = k.svg(gB.w, gB.h, gB.zemin +
      gB.v({ ad: 'C', from: [0, 0], to: [4, 3], renk: TU, kalin: 9, etiket: 'C', ex: -20, ey: -14 }) +
      gB.v({ ad: 'Cx', from: [0, 0], to: [4, 0], renk: YA, etiket: 'C<sub>x</sub> = 4', ex: -70, ey: 42, gizli: true }) +
      gB.v({ ad: 'Cy', from: [4, 0], to: [4, 3], renk: MA, etiket: 'C<sub>y</sub> = 3', ex: 70, ey: 70, gizli: true }));

    // B1: C(4,3) ve D(-3,4)
    const gb1 = k.kare({ x0: -4, x1: 5, y0: -1, y1: 5, u: 62 });
    const sb1 = k.svg(gb1.w, gb1.h, gb1.zemin +
      gb1.v({ ad: 'C', from: [0, 0], to: [4, 3], renk: TU, etiket: 'C', ex: 22, ey: -10 }) +
      gb1.v({ ad: 'D', from: [0, 0], to: [-3, 4], renk: MO, etiket: 'D', ex: -22, ey: -10 }) +
      gb1.kesik([4, 0], [4, 3], TU, 'Cb', true) + gb1.kesik([0, 3], [4, 3], TU, 'Cb', true) +
      gb1.kesik([-3, 0], [-3, 4], MO, 'Db', true) + gb1.kesik([0, 4], [-3, 4], MO, 'Db', true));

    // B2: bileşenlerle toplama, zincir A(2,3), B(4,-1), C(-3,1)
    const gb2 = k.kare({ x0: -1, x1: 5, y0: -1, y1: 5, u: 52 });
    const sb2 = k.svg(gb2.w, gb2.h, gb2.zemin +
      gb2.v({ ad: 'A', from: [0, 0], to: [1, 3], renk: YA, etiket: 'A', ex: -28, ey: 10 }) +
      gb2.v({ ad: 'B', from: [1, 3], to: [4, 4], renk: MA, etiket: 'B', ex: 10, ey: -20 }) +
      gb2.v({ ad: 'C', from: [4, 4], to: [3, 3], renk: MO, etiket: 'C', ex: 46, ey: 6 }) +
      gb2.v({ ad: 'R', from: [0, 0], to: [3, 3], renk: TU, kalin: 9, etiket: 'R', ex: 26, ey: 34, gizli: true })).replace('<svg class="vsvg"', '<svg class="vsvg" style="max-height:430px"');

    // B3: Ali'nin yürüyüşü, 1 kare = 2 m
    const gb3 = k.kare({ x0: -1, x1: 5, y0: -1, y1: 5, u: 70, eksen: false });
    const [ax0, ay0] = gb3.p(0, 0);
    const sb3 = k.svg(gb3.w, gb3.h, gb3.zemin +
      `<circle cx="${ax0}" cy="${ay0}" r="10" fill="#173430"/>` + yaz(ax0, ay0 + 38, 'ev', '#173430', 'middle', 22) +
      yaz(gb3.w - 40, gb3.h - 12, '1 kare = 2 m', GR, 'end', 20, 700) +
      yaz(gb3.w - 46, 66, 'K ↑', GR, 'end', 22, 800) +
      gb3.v({ ad: 'd1', from: [0, 0], to: [3, 0], renk: YA, etiket: '6 m doğu', ex: -70, ey: 40 }) +
      gb3.v({ ad: 'd2', from: [3, 0], to: [3, 4], renk: MA, etiket: '8 m', ex: 40, ey: 90 }) +
      gb3.v({ ad: 'dx', from: [0, 0], to: [3, 4], renk: TU, kalin: 9, etiket: 'Δx', ex: -75, ey: -5, gizli: true }));

    return [
      k.kapak({ etiket: '9. SINIF FİZİK, VEKTÖRLER 2', baslik: 'Vektörlerde toplama.', vurgu: 'Uç uca, paralelkenar, bileşenler.', aciklama: 'Her yöntemden bol örnek. Videoyu durdur, önce sen çiz.' }),

      k.konu({
        etiket: 'UÇ UCA EKLEME', kod: 'FİZ.9.2.4', baslik: 'Birinin bittiği yerden diğeri başlar', sekil: sU,
        maddeler: [
          { metin: 'Birinci vektörü olduğu yerde bırak.', vurgu: 'A' },
          { metin: 'İkinciyi doğrultusunu, yönünü ve büyüklüğünü değiştirmeden taşı, birincinin ucundan başlat.', vurgu: 'A,B' },
          { metin: 'İlk vektörün başlangıç noktasından son vektörün ucuna çizilen vektör bileşkedir.', vurgu: 'A,B,R' },
          { formul: `${V('R')} = ${V('A')} + ${V('B')}`, aciklama: 'Kaç vektör olursa olsun aynı kural: hepsini zincir gibi arka arkaya diz.', vurgu: 'A,B,R' },
        ],
      }),
      k.soru({
        etiket: 'UÇ UCA, ÖRNEK 1', kod: 'FİZ.9.2.4', baslik: 'İki vektör, kareli düzlem', sekil: s1,
        baglam: 'Kareli düzlemde ' + V('A') + ' ve ' + V('B') + ' vektörleri verilmiştir. Bir kare 1 birimdir.',
        maddeler: [
          { metin: V('A') + ' + ' + V('B') + ' bileşkesini uç uca ekleme yöntemiyle çiziniz. Ucu hangi noktadadır?', puan: '5 puan', adimlar: [{ metin: V('A') + ': 3 sağa, 1 yukarı. Ucu (3, 1).', vurgu: 'A' }, { metin: V('B') + '’yi ' + V('A') + '’nın ucuna taşı: 1 sağa, 2 yukarı. Ucu (4, 3).', vurgu: 'A,B' }], cevap: 'Bileşkenin ucu (4, 3)', cevapVurgu: 'R' },
          { metin: 'Bileşkenin büyüklüğü kaç birimdir?', puan: '5 puan', adimlar: [{ metin: 'Bileşke 4 sağa, 3 yukarı gidiyor. Bu iki kenar dik.', vurgu: 'bx,R' }, 'R² = 4² + 3² = 25'], cevap: 'R = 5 birim', cevapVurgu: 'bx,R' },
        ],
      }),
      k.soru({
        etiket: 'UÇ UCA, ÖRNEK 2', kod: 'FİZ.9.2.4', baslik: 'Üç vektörlük zincir', sekil: s2,
        baglam: V('K') + ', ' + V('L') + ' ve ' + V('M') + ' vektörleri uç uca eklenmiştir. Bir kare 1 birimdir.',
        maddeler: [
          { metin: V('K') + ' + ' + V('L') + ' + ' + V('M') + ' bileşkesi kaç birimdir, yönü nedir?', puan: '4 puan', adimlar: ['Zincir (0, 0)’dan başlıyor, (4, 0)’da bitiyor.'], cevap: '4 birim, +x yönünde', cevapVurgu: 'R' },
          { metin: V('M') + ' olmasaydı bileşke kaç birim olurdu?', puan: '4 puan', adimlar: [{ metin: V('K') + ' + ' + V('L') + ': (0, 0)’dan (4, 3)’e. 4 sağa, 3 yukarı.', vurgu: 'K,L,R2' }, 'Büyüklüğü: 4² + 3² = 25, yani 5'], cevap: '5 birim', cevapVurgu: 'R2' },
          { metin: 'Vektörlerin sırası değişirse bileşke değişir mi?', puan: '2 puan', adimlar: [V('L') + ', ' + V('K') + ', ' + V('M') + ' sırasıyla: (3, 0) → (4, 3) → (4, 0). Yine (4, 0)’a varılır.'], cevap: 'Değişmez. Toplamada sıra önemli değildir.' },
        ],
      }),
      k.soru({
        etiket: 'UÇ UCA, ÖRNEK 3', kod: 'FİZ.9.2.4', baslik: 'Başladığı yere dönen zincir', sekil: s3,
        baglam: 'Dört vektör uç uca eklenmiştir. Bir kare 1 birimdir.',
        maddeler: [
          { metin: V('A') + ' + ' + V('B') + ' + ' + V('C') + ' + ' + V('D') + ' bileşkesi nedir?', puan: '5 puan', adimlar: [{ metin: 'Zincir (0, 0)’dan başlıyor ve yine (0, 0)’da bitiyor.', vurgu: 'A,B,C,D,R0' }], cevap: 'Bileşke sıfır. Uç uca eklenen vektörler kapalı şekil oluşturursa bileşke sıfırdır.', cevapVurgu: 'R0' },
          { metin: V('D') + ' olmasaydı kalan üç vektörün bileşkesi ne olurdu?', puan: '5 puan', adimlar: [{ metin: 'Zincir (0, 0)’dan başlayıp ' + V('C') + '’nin ucunda, (0, 3)’te biter.', vurgu: 'A,B,C,R3' }], cevap: '3 birim, +y yönünde. Yani ' + V('D') + '’nin zıttı: −' + V('D'), cevapVurgu: 'R3' },
        ],
      }),
      k.soru({
        etiket: 'UÇ UCA, ÖRNEK 4', kod: 'FİZ.9.2.4', baslik: 'Eksik vektörü bul', sekil: s4,
        baglam: V('A') + ' + ' + V('B') + ' = ' + V('R') + ' olduğu biliniyor. ' + V('A') + ' ve ' + V('R') + ' şekilde verilmiştir. Bir kare 1 birimdir.',
        maddeler: [
          { metin: V('B') + ' vektörünü çiziniz. Kaç birimdir, yönü nedir?', puan: '6 puan', adimlar: [{ metin: 'Uç uca kuralı: ' + V('B') + ', ' + V('A') + '’nın ucundan başlar ve ' + V('R') + '’nin ucunda biter.', vurgu: 'A,R,B' }, 'Başlangıç (2, 3), bitiş (5, 3): 3 sağa, 0 yukarı.'], cevap: 'B = 3 birim, +x yönünde', cevapVurgu: 'B' },
          { metin: V('B') + ' vektörünü ' + V('A') + ' ve ' + V('R') + ' türünden yazınız.', puan: '4 puan', adimlar: [V('R') + '’ye ' + V('A') + '’nın zıttını ekle.'], cevap: V('B') + ' = ' + V('R') + ' + (−' + V('A') + ')' },
        ],
      }),

      k.konu({
        etiket: 'PARALELKENAR', kod: 'FİZ.9.2.4', baslik: 'Aynı noktadan çıkan iki vektör', sekil: sP,
        maddeler: [
          { metin: 'İki vektörün başlangıç noktaları aynı olsun. Değilse birini taşıyarak başlangıçları birleştir.', vurgu: 'A,B' },
          { metin: 'Her vektörün ucundan, diğerine paralel kesik çizgi çiz. Bir paralelkenar oluşur.', vurgu: 'A,B,k' },
          { metin: 'Ortak başlangıçtan karşı köşeye çizilen köşegen bileşkedir.', vurgu: 'k,R' },
          { formul: 'Uç uca ile aynı sonuç', aciklama: 'Paralelkenarın her kenarı, karşısındaki vektörün taşınmış hâlidir. İki yöntem aynı bileşkeyi verir.', vurgu: 'A,B,k,R' },
        ],
      }),
      k.soru({
        etiket: 'PARALELKENAR, ÖRNEK 1', kod: 'FİZ.9.2.4', baslik: 'Dik iki vektör', sekil: sp1,
        baglam: 'Aynı noktadan çıkan ' + V('A') + ' ve ' + V('B') + ' vektörleri verilmiştir. Bu kez bir kare 2 birimdir.',
        maddeler: [
          { metin: 'Paralelkenar yöntemiyle bileşkeyi çiziniz.', puan: '4 puan', adimlar: [{ metin: 'Kesik çizgiler bir dikdörtgen oluşturur, köşesi (4, 3).', vurgu: 'k' }], cevap: 'Bileşke, (0, 0)’dan (4, 3)’e çizilen vektördür.', cevapVurgu: 'k,R' },
          { metin: 'Bileşkenin büyüklüğü kaç birimdir?', puan: '6 puan', adimlar: ['Kareleri birime çevir: A = 4 · 2 = 8 birim, B = 3 · 2 = 6 birim', 'Vektörler birbirine dik: R² = A² + B² = 8² + 6² = 100'], cevap: 'R = 10 birim', cevapVurgu: 'R' },
        ],
      }),
      k.soru({
        etiket: 'PARALELKENAR, ÖRNEK 2', kod: 'FİZ.9.2.4', baslik: 'İki yöntem, aynı sonuç', sekil: sp2,
        baglam: 'Aynı noktadan çıkan ' + V('A') + ' ve ' + V('B') + ' vektörleri verilmiştir. Bir kare 1 birimdir.',
        maddeler: [
          { metin: 'Paralelkenar yöntemiyle bileşkenin ucunu bulunuz.', puan: '4 puan', adimlar: [{ metin: 'Kesik çizgiler (4, 4) noktasında kesişir.', vurgu: 'k' }], cevap: '(4, 4)', cevapVurgu: 'k,R' },
          { metin: 'Aynı vektörleri uç uca ekleseydik bileşke değişir miydi?', puan: '4 puan', adimlar: [{ metin: V('B') + '’yi ' + V('A') + '’nın ucuna taşı: (3, 1)’den (4, 4)’e. Kesik çizgiyle çakışır.', vurgu: 'B2,R' }], cevap: 'Değişmez. İki yöntem aynı bileşkeyi verir.', cevapVurgu: 'B2,R' },
          { metin: 'Bileşkenin büyüklüğü kaç birimdir?', puan: '2 puan', adimlar: ['4 sağa, 4 yukarı: R² = 4² + 4² = 32'], cevap: 'R = √32 = 4√2 ≈ 5,7 birim' },
        ],
      }),
      k.soru({
        etiket: 'ZIT VEKTÖRLER', kod: 'FİZ.9.2.4', baslik: 'Aynı noktadan üç vektör', sekil: sp3,
        baglam: 'Aynı noktadan çıkan ' + V('A') + ', ' + V('B') + ' ve ' + V('C') + ' vektörleri verilmiştir. Bir kare 1 birimdir.',
        maddeler: [
          { metin: V('A') + ' + ' + V('C') + ' bileşkesi nedir?', puan: '4 puan', adimlar: [{ metin: 'Eşit büyüklükte ve zıt yönlüler: ' + V('C') + ' = −' + V('A'), vurgu: 'A,C' }], cevap: 'Sıfır. Zıt vektörler birbirini yok eder.', cevapVurgu: 'A,C' },
          { metin: 'Üç vektörün bileşkesi kaç birimdir?', puan: '6 puan', adimlar: [{ metin: V('A') + ' + ' + V('C') + ' sıfır olduğu için geriye yalnızca ' + V('B') + ' kalır.', vurgu: 'B,R' }], cevap: '3 birim, +y yönünde', cevapVurgu: 'R' },
        ],
      }),

      k.konu({
        etiket: 'BİLEŞENLERE AYIRMA', kod: 'FİZ.9.2.4', baslik: 'Her vektör iki dik vektörün toplamıdır', sekil: sB,
        maddeler: [
          { metin: 'Bir vektörün x ekseni boyunca ne kadar ilerlediği onun x bileşenidir.', vurgu: 'C,Cx' },
          { metin: 'y ekseni boyunca ne kadar ilerlediği, onun y bileşenidir.', vurgu: 'C,Cx,Cy' },
          'Sağa ve yukarı giden bileşenler artı, sola ve aşağı gidenler eksi işaretlidir. C<sub>x</sub> = +4: x bileşeni 4 birim, +x yönünde.',
          { formul: `${V('C')} = ${V('C<sub>x</sub>')} + ${V('C<sub>y</sub>')}`, aciklama: 'Bileşenler birbirine dik olduğundan büyüklük: C² = 4² + 3² = 25, C = 5 birim.', vurgu: 'C,Cx,Cy' },
        ],
      }),
      k.soru({
        etiket: 'BİLEŞENLER, ÖRNEK 1', kod: 'FİZ.9.2.4', baslik: 'İki vektörü bileşenlerine ayır', sekil: sb1,
        baglam: V('C') + ' ve ' + V('D') + ' vektörleri kareli düzlemde verilmiştir. Bir kare 1 birimdir.',
        maddeler: [
          { metin: V('C') + ' vektörünün x ve y bileşenleri kaçtır?', puan: '3 puan', adimlar: [{ metin: '4 kare sağa, 3 kare yukarı.', vurgu: 'C,Cb' }], cevap: 'C<sub>x</sub> = +4, C<sub>y</sub> = +3', cevapVurgu: 'C,Cb' },
          { metin: V('D') + ' vektörünün x ve y bileşenleri kaçtır?', puan: '3 puan', adimlar: [{ metin: '3 kare sola, 4 kare yukarı. Sola gittiği için x bileşeni eksi.', vurgu: 'D,Db' }], cevap: 'D<sub>x</sub> = −3, D<sub>y</sub> = +4', cevapVurgu: 'D,Db' },
          { metin: V('C') + ' ve ' + V('D') + ' vektörlerinin büyüklükleri kaçtır?', puan: '4 puan', adimlar: ['C² = 4² + 3² = 25', 'D² = 3² + 4² = 25'], cevap: 'İkisi de 5 birim. Büyüklükleri eşit, yönleri farklı.' },
        ],
      }),
      k.soru({
        etiket: 'BİLEŞENLER, ÖRNEK 2', kod: 'FİZ.9.2.4', baslik: 'Bileşenlerle toplama', sekil: sb2,
        baglam: 'Üç vektörün bileşenleri tabloda, uç uca eklenmiş hâlleri şekilde verilmiştir.',
        tablo: { basliklar: ['Vektör', 'x bileşeni', 'y bileşeni'], satirlar: [[V('A'), '+1', '+3'], [V('B'), '+3', '+1'], [V('C'), '−1', '−1']] },
        maddeler: [
          { metin: 'Bileşkenin x bileşeni kaçtır?', puan: '3 puan', adimlar: ['Bütün x bileşenlerini topla: 1 + 3 + (−1)'], cevap: 'R<sub>x</sub> = +3' },
          { metin: 'Bileşkenin y bileşeni kaçtır?', puan: '3 puan', adimlar: ['Bütün y bileşenlerini topla: 3 + 1 + (−1)'], cevap: 'R<sub>y</sub> = +3' },
          { metin: 'Bileşke, başlangıç noktasından hangi noktaya çizilir?', puan: '4 puan', cevap: '(3, 3) noktasına. Uç uca zincir de (3, 3)’te bitiyor: iki yöntem aynı sonucu verir.', cevapVurgu: 'A,B,C,R' },
        ],
      }),
      k.soru({
        etiket: 'BİLEŞENLER, ÖRNEK 3', kod: 'FİZ.9.2.4', baslik: 'Ali’nin yürüyüşü', sekil: sb3,
        baglam: 'Ali evden çıkıp önce 6 m doğuya, sonra 8 m kuzeye yürüyor.',
        maddeler: [
          { metin: 'Ali’nin yer değiştirmesi kaç metredir?', puan: '4 puan', adimlar: [{ metin: 'Yer değiştirme, ilk konumdan son konuma çizilen vektördür.', vurgu: 'dx' }, '(Δx)² = 6² + 8² = 100'], cevap: 'Δx = 10 m', cevapVurgu: 'dx' },
          { metin: 'Ali’nin aldığı yol kaç metredir?', puan: '3 puan', adimlar: ['Yol, yürünen bütün mesafelerin toplamıdır: 6 + 8'], cevap: '14 m. Yol skaler, yer değiştirme vektörel.' },
          { metin: 'Yer değiştirmenin doğu ve kuzey bileşenleri nedir?', puan: '3 puan', cevap: '6 m doğu, 8 m kuzey', cevapVurgu: 'd1,d2' },
        ],
      }),

      k.konu({
        etiket: 'KISA TEKRAR', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          '<b>Uç uca:</b> Vektörleri zincir gibi diz. İlk vektörün başlangıcından son vektörün ucuna çizilen vektör bileşkedir.',
          '<b>Kapalı şekil:</b> Zincir başladığı yere dönerse bileşke sıfırdır.',
          '<b>Paralelkenar:</b> Aynı noktadan çıkan iki vektörde köşegen bileşkedir. Uç uca ile aynı sonucu verir.',
          '<b>Bileşenler:</b> x’ler kendi arasında, y’ler kendi arasında toplanır. Sağ ve yukarı artı, sol ve aşağı eksi.',
          '<b>Dik vektörler:</b> Bileşke R² = A² + B², bir vektörün büyüklüğü C² = C<sub>x</sub>² + C<sub>y</sub>².',
        ],
      }),
      k.kapanis({ baslik: 'Toplamanın üç yolu tamam.', vurgu: 'Gelecek ders: bol soru çözümü.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
