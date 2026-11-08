// 9. sınıf, Hafta 9 (9–13 Kasım 2026): Vektörler, toplama yöntemleri ve bileşenlerine ayırma (2/4)
// TYMM FİZ.9.2.4: uç uca ekleme, paralelkenar yöntemi, bileşenlerine ayırma (tümevarımsal akıl yürütme:
// a) örüntüleri bulur, b) genelleme yapar). Sınırlama: trigonometri yok, bileşenler yalnız dik koordinat sisteminde.
module.exports = {
  slug: '9-hafta-09-vektorler-2',
  baslik: '9. Sınıf Fizik: Paralelkenar Yöntemi ve Bileşenlerine Ayırma',
  dersAdi: '9. sınıf, vektörler (2/4)',
  slaytlar: (k) => {
    const A = '#244f40', B = '#1d3b8f', R = '#b06a3b', V = k.V;

    // Şekil 1: uç uca ekleme, A(3,1) + B(1,3) = R(4,4)
    const g1 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 64 });
    const s1 = k.svg(g1.w, g1.h, g1.zemin +
      g1.v({ ad: 'A', from: [0, 0], to: [3, 1], renk: A, etiket: 'A', ex: 0, ey: 34 }) +
      g1.v({ ad: 'B', from: [3, 1], to: [4, 4], renk: B, etiket: 'B', ex: 26, ey: 30, gizli: true }) +
      g1.v({ ad: 'R', from: [0, 0], to: [4, 4], renk: R, etiket: 'R', ex: -28, ey: 4, gizli: true }));

    // Şekil 2: paralelkenar, A ve B aynı noktadan
    const g2 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 64 });
    const s2 = k.svg(g2.w, g2.h, g2.zemin +
      g2.kesik([3, 1], [4, 4], B, 'p', true) + g2.kesik([1, 3], [4, 4], A, 'p', true) +
      g2.v({ ad: 'A', from: [0, 0], to: [3, 1], renk: A, etiket: 'A', ex: 0, ey: 34 }) +
      g2.v({ ad: 'B', from: [0, 0], to: [1, 3], renk: B, etiket: 'B', ex: -26, ey: 6 }) +
      g2.v({ ad: 'R', from: [0, 0], to: [4, 4], renk: R, etiket: 'R', ex: 26, ey: 0, gizli: true }));

    // Şekil 3: C(4,3) ve bileşenleri
    const g3 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 64 });
    const s3 = k.svg(g3.w, g3.h, g3.zemin +
      g3.v({ ad: 'Cx', from: [0, 0], to: [4, 0], renk: A, etiket: 'C<sub>x</sub> = 4', ex: -40, ey: 40, gizli: true }) +
      g3.v({ ad: 'Cy', from: [4, 0], to: [4, 3], renk: B, etiket: 'C<sub>y</sub> = 3', ex: 62, ey: 110, gizli: true }) +
      g3.v({ ad: 'C', from: [0, 0], to: [4, 3], renk: R, etiket: 'C', ex: -30, ey: 0 }));

    // Şekil 4: bileşenlerle toplama
    const g4 = k.kare({ x0: -1, x1: 6, y0: -1, y1: 5, u: 64 });
    const s4 = k.svg(g4.w, g4.h, g4.zemin +
      g4.v({ ad: 'A', from: [0, 0], to: [3, 1], renk: A, etiket: 'A', ex: 0, ey: 34 }) +
      g4.v({ ad: 'B', from: [0, 0], to: [1, 3], renk: B, etiket: 'B', ex: -26, ey: 6 }) +
      g4.kesik([0, 0], [4, 0], R, 'Rb', true) + g4.kesik([4, 0], [4, 4], R, 'Rb', true) +
      g4.v({ ad: 'R', from: [0, 0], to: [4, 4], renk: R, etiket: 'R', ex: 26, ey: 0, gizli: true }));

    // Soru 1: K(2,4), L(2,-1); bileşke ve paralelkenar çizgileri cevap adımlarında belirir
    const g5 = k.kare({ x0: -1, x1: 6, y0: -2, y1: 5, u: 58 });
    const s5 = k.svg(g5.w, g5.h, g5.zemin +
      g5.kesik([2, 4], [4, 3], B, 'p', true) + g5.kesik([2, -1], [4, 3], A, 'p', true) +
      g5.v({ ad: 'K', from: [0, 0], to: [2, 4], renk: A, etiket: 'K', ex: -26, ey: 6 }) +
      g5.v({ ad: 'L', from: [0, 0], to: [2, -1], renk: B, etiket: 'L', ex: 6, ey: 36 }) +
      g5.v({ ad: 'R', from: [0, 0], to: [4, 3], renk: R, etiket: 'R', ex: 28, ey: 4, gizli: true }));

    // Soru 2: römorkörler, F1(4,1) kN, F2(-1,3) kN; x doğu, y kuzey
    const g6 = k.kare({ x0: -2, x1: 5, y0: -1, y1: 5, u: 60 });
    const [mx, my] = g6.p(0, 0);
    const s6 = k.svg(g6.w, g6.h, g6.zemin +
      `<rect x="${mx - 26}" y="${my - 14}" width="52" height="28" rx="8" fill="#6b7d76"/>` +
      g6.v({ ad: 'F1', from: [0, 0], to: [4, 1], renk: A, etiket: 'F<sub>1</sub>', ex: 4, ey: 36 }) +
      g6.v({ ad: 'F2', from: [0, 0], to: [-1, 3], renk: B, etiket: 'F<sub>2</sub>', ex: -30, ey: 4 }) +
      g6.v({ ad: 'R', from: [0, 0], to: [3, 4], renk: R, etiket: 'R', ex: 28, ey: 4, gizli: true }));

    return [
      k.kapak({ etiket: '9. SINIF FİZİK, HAFTA 9', baslik: 'Paralelkenar yöntemi', vurgu: 've bileşenlerine ayırma.', aciklama: 'Vektörleri toplamanın üç yolu ve hepsinin aynı sonucu vermesinin nedeni.' }),
      k.konu({
        etiket: 'HATIRLAYALIM', kod: 'FİZ.9.2.4', baslik: 'Uç uca ekleme yöntemi', sekil: s1,
        maddeler: [
          { metin: 'Birinci vektörü çiz.', vurgu: 'A' },
          { metin: 'İkinci vektörü, yönünü ve uzunluğunu değiştirmeden birincinin ucundan başlat.', vurgu: 'A,B' },
          { metin: 'Birincinin başlangıcından sonuncunun ucuna çizilen vektör bileşkedir.', vurgu: 'R' },
          { formul: `${V('R')} = ${V('A')} + ${V('B')}`, aciklama: 'Kareli düzlemde bileşkenin ucu (4, 4) noktasıdır.', vurgu: 'R' },
        ],
      }),
      k.konu({
        etiket: 'YENİ YÖNTEM', kod: 'FİZ.9.2.4', baslik: 'Paralelkenar yöntemi', sekil: s2,
        maddeler: [
          { metin: 'İki vektörü aynı başlangıç noktasından çiz.', vurgu: 'A,B' },
          { metin: 'Her vektörün ucundan diğer vektöre paralel bir çizgi çiz. Bir paralelkenar oluşur.', vurgu: 'A,B,p' },
          { metin: 'Başlangıç noktasından çıkan köşegen bileşkedir.', vurgu: 'R' },
          { formul: 'Sonuç aynı: bileşkenin ucu yine (4, 4)', aciklama: 'A’nın ucundan çizilen kesikli kenar, B’nin A’nın ucuna taşınmış hâlidir. Bu yüzden iki yöntem aynı bileşkeyi verir.', vurgu: 'R,p' },
        ],
      }),
      k.konu({
        etiket: 'YENİ YÖNTEM', kod: 'FİZ.9.2.4', baslik: 'Bileşenlerine ayırma', sekil: s3,
        maddeler: [
          'Dik koordinat sisteminde her vektör, x ve y doğrultusundaki iki vektörün toplamı olarak yazılabilir.',
          { metin: 'x bileşeni: vektörün x ekseni boyunca ne kadar ilerlediği. Burada C<sub>x</sub> = 4 birim.', vurgu: 'Cx' },
          { metin: 'y bileşeni: y ekseni boyunca ne kadar ilerlediği. Burada C<sub>y</sub> = 3 birim.', vurgu: 'Cx,Cy' },
          '+x ve +y yönündeki bileşen artı, ters yöndeki bileşen eksi işaretle yazılır.',
          { formul: `${V('C')} = ${V('C<sub>x</sub>')} + ${V('C<sub>y</sub>')}`, aciklama: 'Bileşenler birbirine dik olduğundan büyüklük: C² = 4² + 3² = 25, C = 5 birim.', vurgu: 'Cx,Cy,C' },
        ],
      }),
      k.konu({
        etiket: 'ÖRÜNTÜ VE GENELLEME', kod: 'FİZ.9.2.4', baslik: 'Bileşenlerle toplama', sekil: s4,
        maddeler: [
          { metin: 'A’nın bileşenleri: A<sub>x</sub> = 3, A<sub>y</sub> = 1. B’nin bileşenleri: B<sub>x</sub> = 1, B<sub>y</sub> = 3.', vurgu: 'A,B' },
          { metin: 'x bileşenlerini kendi arasında, y bileşenlerini kendi arasında topla: R<sub>x</sub> = 3 + 1 = 4, R<sub>y</sub> = 1 + 3 = 4.', vurgu: 'Rb' },
          { metin: 'Uç uca eklemede ve paralelkenarda bulduğumuz (4, 4) noktasının aynısı çıktı.', vurgu: 'R,Rb' },
          { formul: 'R<sub>x</sub> = A<sub>x</sub> + B<sub>x</sub>,&emsp;R<sub>y</sub> = A<sub>y</sub> + B<sub>y</sub>', aciklama: 'Genelleme: Üç yöntem de aynı bileşkeyi verir. Bileşenlerine ayırma yöntemi hesapla, diğer ikisi çizimle sonuca ulaştırır.', vurgu: 'R,Rb' },
        ],
      }),
      k.soru({
        etiket: 'ÇİZİM VE HESAP', baslik: 'Kareli düzlemde iki vektör', sekil: s5,
        baglam: 'Kareli düzlemde K ve L vektörleri aynı başlangıç noktasından çizilmiştir. Bir kare kenarı 1 N büyüklüğündeki kuvveti göstermektedir.',
        maddeler: [
          {
            metin: 'K ve L’nin bileşkesini paralelkenar yöntemiyle çiziniz.', puan: '4 puan',
            adimlar: [
              { metin: 'K ve L zaten aynı noktadan başlıyor.', vurgu: 'K,L' },
              { metin: 'K’nin ucundan L’ye, L’nin ucundan K’ye paralel çizgiler çizilir.', vurgu: 'K,L,p' },
            ],
            cevap: 'Başlangıç noktasından çıkan köşegen bileşkedir. Bileşkenin ucu (4, 3) noktasındadır.', cevapVurgu: 'R,p',
          },
          {
            metin: 'Bileşke vektörün x ve y bileşenlerini bulunuz.', puan: '4 puan',
            adimlar: [
              { metin: 'K<sub>x</sub> = 2, K<sub>y</sub> = 4. L<sub>x</sub> = 2, L<sub>y</sub> = −1. (L’nin y bileşeni −y yönünde olduğu için eksi.)', vurgu: 'K,L' },
              'R<sub>x</sub> = 2 + 2 = 4 N,  R<sub>y</sub> = 4 + (−1) = 3 N',
            ],
            cevap: 'R<sub>x</sub> = 4 N, R<sub>y</sub> = 3 N', cevapVurgu: 'R',
          },
          {
            metin: 'Bileşke kuvvetin büyüklüğü kaç N’dur?', puan: '2 puan',
            adimlar: [{ metin: 'R² = 4² + 3² = 16 + 9 = 25', vurgu: 'R' }],
            cevap: 'R = 5 N', cevapVurgu: 'R',
          },
        ],
      }),
      k.soru({
        etiket: 'GÜNLÜK HAYAT', baslik: 'Mavnayı çeken römorkörler', sekil: s6,
        baglam: 'Limanda bir mavnayı iki römorkör çekiyor. Kareli düzlemde x ekseni doğuyu, y ekseni kuzeyi gösteriyor ve bir kare kenarı 1 kN’dur.',
        maddeler: [
          {
            metin: 'F<sub>1</sub> ve F<sub>2</sub> kuvvetlerinin x ve y bileşenlerini yazınız.', puan: '4 puan',
            adimlar: [
              { metin: 'F<sub>1</sub>: 4 kare doğuya, 1 kare kuzeye. F<sub>1x</sub> = 4 kN, F<sub>1y</sub> = 1 kN', vurgu: 'F1' },
              { metin: 'F<sub>2</sub>: 1 kare batıya, 3 kare kuzeye. F<sub>2x</sub> = −1 kN, F<sub>2y</sub> = 3 kN', vurgu: 'F2' },
            ],
          },
          {
            metin: 'Bileşke kuvvetin bileşenlerini ve büyüklüğünü bulunuz.', puan: '4 puan',
            adimlar: [
              { metin: 'R<sub>x</sub> = 4 + (−1) = 3 kN,  R<sub>y</sub> = 1 + 3 = 4 kN', vurgu: 'R' },
              'R² = 3² + 4² = 25',
            ],
            cevap: 'R = 5 kN', cevapVurgu: 'R',
          },
          {
            metin: 'Bileşke kuvvetin tam doğu yönünde olması isteniyor. Üçüncü bir römorkör yalnız kuzey-güney doğrultusunda çekebiliyor. Hangi yönde kaç kN’luk kuvvet uygulamalıdır?', puan: '4 puan',
            adimlar: [
              'Bileşke tam doğu yönünde olacaksa y bileşeni sıfır olmalıdır.',
              { metin: 'Şu an R<sub>y</sub> = 4 kN, kuzey yönünde. Bunu sıfırlamak için güney yönünde 4 kN gerekir.', vurgu: 'R' },
            ],
            cevap: 'Güney yönünde 4 kN. Yeni bileşke 3 kN, doğu yönünde.',
          },
        ],
      }),
      k.kapanis({ baslik: 'Üç yöntem, tek bileşke.', vurgu: 'Gelecek ders: karma problemler.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
