// 9. sınıf, Vektörler 3. ders: Bileşenlerine ayırma, bileşenlerle toplama ve çıkarma (yaklaşık 20 dakikalık video)
// MEB ders kitabı 2.3.3, s. 80-85 ile paralel: bileşenlerine ayırma basamakları, bileşenlerle toplama, K - L örneği, K + L - M alıştırması,
// ev-okul güzergâhı, doğru-yanlış çalışma yaprağı. Önceki ders: 9-vektorler-toplama-1. Sonraki ders: kitap 2.4 Doğadaki Temel Kuvvetler.
// TYMM FİZ.9.2.4: vektörlerin toplanması (uç uca, paralelkenar) ve dik koordinat sisteminde bileşenlerine ayrılması.
// Sınırlama: trigonometri yok; kareli düzlem, tam sayı bileşenler; dik vektörlerde büyüklük Pisagor ile.
module.exports = {
  slug: '9-vektorler-toplama-2',
  baslik: '9. Sınıf Fizik: Vektörleri Bileşenlerine Ayırma',
  dersAdi: '9. sınıf, bileşenlerine ayırma',
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

    // Zıt vektör: L(2,1) ve -L(-2,-1)
    const gZ = k.kare({ x0: -3, x1: 3, y0: -2, y1: 2, u: 70 });
    const sZ = k.svg(gZ.w, gZ.h, gZ.zemin +
      gZ.v({ ad: 'L', from: [0, 0], to: [2, 1], renk: MA, etiket: 'L', ex: 14, ey: -16 }) +
      gZ.v({ ad: 'mL', from: [0, 0], to: [-2, -1], renk: MO, etiket: '−L', ex: -18, ey: 40, gizli: true }));

    // K - L: K(1,3), L(-2,-1), -L(2,1), K - L = (3,4)
    const gC = k.kare({ x0: -3, x1: 4, y0: -2, y1: 5, u: 58 });
    const sC = k.svg(gC.w, gC.h, gC.zemin +
      gC.v({ ad: 'K', from: [0, 0], to: [1, 3], renk: YA, etiket: 'K', ex: -30, ey: 6 }) +
      gC.v({ ad: 'L', from: [0, 0], to: [-2, -1], renk: MA, etiket: 'L', ex: -22, ey: 34 }) +
      gC.v({ ad: 'mL', from: [0, 0], to: [2, 1], renk: MO, etiket: '−L', ex: 34, ey: 22, gizli: true }) +
      gC.kesik([1, 3], [3, 4], MO, 'kk', true) + gC.kesik([2, 1], [3, 4], YA, 'kk', true) +
      gC.v({ ad: 'R', from: [0, 0], to: [3, 4], renk: TU, kalin: 9, etiket: 'K − L', ex: 44, ey: -14, gizli: true }));

    // K + L - M: K(3,1), L(-1,2), M(-2,0), sonuç (4,3)
    const gM = k.kare({ x0: -3, x1: 5, y0: -1, y1: 4, u: 58 });
    const sM = k.svg(gM.w, gM.h, gM.zemin +
      gM.v({ ad: 'K', from: [0, 0], to: [3, 1], renk: YA, etiket: 'K', ex: 8, ey: 38 }) +
      gM.v({ ad: 'L', from: [0, 0], to: [-1, 2], renk: MA, etiket: 'L', ex: -26, ey: -4 }) +
      gM.v({ ad: 'M', from: [0, 0], to: [-2, 0], renk: MO, etiket: 'M', ex: 6, ey: 40 }) +
      gM.kesik([0, 0], [4, 0], GR, 'bx', true) + gM.kesik([4, 0], [4, 3], GR, 'bx', true) +
      gM.v({ ad: 'R', from: [0, 0], to: [4, 3], renk: TU, kalin: 9, etiket: 'R', ex: 14, ey: -18, gizli: true }));

    return [
      k.kapak({ etiket: '9. SINIF FİZİK, VEKTÖRLER 3', baslik: 'Bileşenlerine ayırma.', vurgu: 'Toplamanın üçüncü yolu.', aciklama: 'Her vektör bir yatay, bir düşey parçaya ayrılır. Toplama ve çıkarma sayı işlemine döner. Ders kitabı 2.3, sayfa 80-85.' }),

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
        etiket: 'ÇIKARMA', kod: 'FİZ.9.2.4', baslik: 'Çıkarmak, zıttını eklemektir', sekil: sZ,
        maddeler: [
          { metin: 'Bir vektörün zıttı, büyüklüğü aynı, yönü ters olan vektördür.', vurgu: 'L,mL' },
          { metin: V('L') + ' vektörünün bileşenleri +2 ve +1 ise −' + V('L') + ' vektörünün bileşenleri −2 ve −1 olur. İki bileşenin de işareti değişir.', vurgu: 'L,mL' },
          { formul: `${V('K')} − ${V('L')} = ${V('K')} + (−${V('L')})`, aciklama: 'Çıkarılacak vektörün yönünü ters çevir, sonra topla.' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.9.2.4', baslik: 'İki vektörün farkı', sekil: sC,
        baglam: 'Kareli düzlemde aynı noktadan çıkan ' + V('K') + ' ve ' + V('L') + ' vektörleri verilmiştir. Bir kare 1 birimdir.',
        maddeler: [
          { metin: V('K') + ' ve ' + V('L') + ' vektörlerinin bileşenleri kaçtır?', puan: '3 puan', adimlar: [{ metin: V('K') + ': 1 kare sağa, 3 kare yukarı.', vurgu: 'K' }, { metin: V('L') + ': 2 kare sola, 1 kare aşağı.', vurgu: 'L' }], cevap: 'K<sub>x</sub> = +1, K<sub>y</sub> = +3;  L<sub>x</sub> = −2, L<sub>y</sub> = −1' },
          { metin: '−' + V('L') + ' vektörünü çiziniz. Bileşenleri kaçtır?', puan: '3 puan', adimlar: [{ metin: V('L') + '’nin yönünü ters çevir: 2 kare sağa, 1 kare yukarı.', vurgu: 'L,mL' }], cevap: '+2 ve +1', cevapVurgu: 'mL' },
          { metin: V('K') + ' − ' + V('L') + ' vektörünün bileşenlerini ve büyüklüğünü bulunuz.', puan: '4 puan', adimlar: ['x: 1 − (−2) = 3,  y: 3 − (−1) = 4', { metin: 'Bileşenler dik: 3² + 4² = 25', vurgu: 'K,mL,kk,R' }], cevap: '3 sağa, 4 yukarı; büyüklüğü 5 birim.', cevapVurgu: 'K,mL,kk,R' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.9.2.4', baslik: 'Topla ve çıkar', sekil: sM,
        baglam: '' + V('K') + ', ' + V('L') + ' ve ' + V('M') + ' vektörleri kareli düzlemde verilmiştir. Bir kare 1 birimdir. ' + V('R') + ' = ' + V('K') + ' + ' + V('L') + ' − ' + V('M') + ' vektörü isteniyor.',
        maddeler: [
          { metin: V('R') + ' vektörünün x bileşeni kaçtır?', puan: '3 puan', adimlar: ['Şekilden oku: K<sub>x</sub> = +3, L<sub>x</sub> = −1, M<sub>x</sub> = −2', 'Toplananları ekle, çıkarılanı çıkar: 3 + (−1) − (−2)'], cevap: 'R<sub>x</sub> = +4' },
          { metin: V('R') + ' vektörünün y bileşeni kaçtır?', puan: '3 puan', adimlar: ['K<sub>y</sub> = +1, L<sub>y</sub> = +2, M<sub>y</sub> = 0', '1 + 2 − 0'], cevap: 'R<sub>y</sub> = +3' },
          { metin: V('R') + ' vektörünü çiziniz. Büyüklüğü kaç birimdir?', puan: '4 puan', adimlar: [{ metin: '4 sağa, 3 yukarı: 4² + 3² = 25', vurgu: 'bx,R' }], cevap: 'R = 5 birim', cevapVurgu: 'bx,R' },
        ],
      }),
      k.soru({
        etiket: 'DOĞRU MU, YANLIŞ MI?', kod: 'FİZ.9.2.4', baslik: 'Üç yöntemi karşılaştır',
        baglam: 'Aşağıdaki ifadelerin her biri için doğru ise D, yanlış ise Y yazınız.',
        tablo: { basliklar: ['İfade', 'D / Y'], doldur: 0, satirlar: [
          ['Bileşke her zaman toplanan vektörlerden birine eşittir.', 'Y'],
          ['Uç uca ekleme ve paralelkenar aynı bileşkeyi verir.', 'D'],
          ['Paralelkenarda vektörler aynı noktadan başlatılır.', 'D'],
          ['Bir vektör taşınırken yönü değiştirilebilir.', 'Y'],
          ['Bir vektörün bileşenlerinin bileşkesi kendisidir.', 'D']] },
        maddeler: [
          { metin: 'Tablonun son sütununu doldurunuz.', puan: '5 puan', adimlar: ['Sırayla: Y, D, D, Y, D'] },
          { metin: 'Yanlış ifadeleri düzeltiniz.', puan: '5 puan', adimlar: ['1. ifade: Bileşke çoğunlukla ikisinden de farklı bir vektördür.'], cevap: '4. ifade: Vektör taşınırken yönü ve büyüklüğü değiştirilmez.' },
        ],
      }),

      k.konu({
        etiket: 'KISA TEKRAR', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          'Bir vektörün ucundan eksenlere paraleller çizilir; eksenler üzerindeki parçalar vektörün x ve y bileşenleridir.',
          'Sağa ve yukarı giden bileşenler artı, sola ve aşağı gidenler eksi işaretlidir.',
          'Toplamada x bileşenleri kendi arasında, y bileşenleri kendi arasında toplanır. Çıkarılan vektörün bileşenleri işaret değiştirir.',
          { formul: 'R² = R<sub>x</sub>² + R<sub>y</sub>²', aciklama: 'Bileşenler birbirine dik olduğu için bileşkenin büyüklüğü dik üçgenden bulunur.' },
        ],
      }),
      k.kapanis({ baslik: 'Vektörler tamam.', vurgu: 'Gelecek ders: doğadaki temel kuvvetler.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
