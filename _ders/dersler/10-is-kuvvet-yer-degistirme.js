// 10. sınıf, Enerji ünitesine giriş: İş (yaklaşık 20 dakikalık video)
// TYMM FİZ.10.2.1: Kuvvet-yer değiştirme grafiği kullanılarak iş ile ilgili tümevarımsal akıl yürütebilme
// a) kuvvet, yer değiştirme ve iş arasındaki ilişkiyi matematiksel olarak modeller, b) genelleme yapar.
// Uygulama: tahmin et-gözle-açıkla, veri setinden F-x grafiği, sabit olmayan kuvvet grafikleri, grafik üzerinden açıklama. g = 10 m/s².
module.exports = {
  slug: '10-is-kuvvet-yer-degistirme',
  baslik: '10. Sınıf Fizik: İş ve Kuvvet–Yer Değiştirme Grafiği',
  dersAdi: '10. sınıf, iş',
  slaytlar: (k) => {
    const T = '#b06a3b', N = '#1d3b8f', G = '#244f40';

    // Sabit 20 N, 0-4 m
    const g1 = k.grafik({ x1: 5, y1: 30, xt: [0, 1, 2, 3, 4, 5], yt: [0, 10, 20, 30], xad: 'Δx (m)', yad: 'F (N)' });
    const s1 = k.svg(g1.w, g1.h, g1.zemin +
      g1.alan([[0, 0], [0, 20], [4, 20], [4, 0]], '#e9a774', 'alan', true) + g1.yazi(2, 9, 'W = 20 · 4 = 80 J', '#173430', 'alany', true, 22) +
      g1.cizgi([[0, 20], [4, 20]], T, 'F'));

    // Sabit olmayan kuvvet: 0'dan 40 N'a doğrusal, 0-4 m
    const g2 = k.grafik({ x1: 5, y1: 50, xt: [0, 1, 2, 3, 4, 5], yt: [0, 10, 20, 30, 40, 50], xad: 'Δx (m)', yad: 'F (N)' });
    const s2 = k.svg(g2.w, g2.h, g2.zemin +
      g2.alan([[0, 0], [4, 40], [4, 0]], '#e9a774', 'alan', true, '') + g2.yazi(2.55, 7, 'W = ½ · 4 · 40 = 80 J', '#173430', 'alany', true, 19) +
      g2.cizgi([[0, 0], [4, 40]], T, 'F'));

    // Parçalı grafik: 10 N (0-2 m), 10→30 N (2-4 m), 30 N (4-6 m)
    const g3 = k.grafik({ x1: 7, y1: 40, xt: [0, 1, 2, 3, 4, 5, 6, 7], yt: [0, 10, 20, 30, 40], xad: 'Δx (m)', yad: 'F (N)' });
    const s3 = k.svg(g3.w, g3.h, g3.zemin +
      g3.alan([[0, 0], [0, 10], [2, 10], [2, 0]], '#e9a774', 'a1', true) + g3.yazi(1, 3.6, '20 J', '#173430', 'a1y', true, 22) +
      g3.alan([[2, 0], [2, 10], [4, 30], [4, 0]], '#9fc5b4', 'a2', true) + g3.yazi(3.1, 8, '40 J', '#173430', 'a2y', true, 22) +
      g3.alan([[4, 0], [4, 30], [6, 30], [6, 0]], '#b9c6ec', 'a3', true) + g3.yazi(5, 13.6, '60 J', '#173430', 'a3y', true, 22) +
      g3.cizgi([[0, 10], [2, 10], [4, 30], [6, 30]], T, 'F'));

    // Market arabası: 40 N (0-15 m), 20 N (15-25 m)
    const g4 = k.grafik({ x1: 30, y1: 50, xt: [0, 5, 10, 15, 20, 25, 30], yt: [0, 10, 20, 30, 40, 50], xad: 'Δx (m)', yad: 'F (N)' });
    const s4 = k.svg(g4.w, g4.h, g4.zemin +
      g4.alan([[0, 0], [0, 40], [15, 40], [15, 0]], '#e9a774', 'b1', true, '600 J') +
      g4.alan([[15, 0], [15, 20], [25, 20], [25, 0]], '#9fc5b4', 'b2', true, '200 J') +
      g4.cizgi([[0, 40], [15, 40]], T, 'cz', true) + g4.cizgi([[15, 20], [25, 20]], T, 'cz', true));

    // Zıt yönde iki kuvvet: Ali 50 N sağa, Ayşe 20 N sola, kutu 4 m sağa
    const sZ = k.svg(500, 270,
      `<rect x="20" y="180" width="460" height="14" fill="#cfc9ba"/>` + k.kutu(250, 145, 70, '') +
      k.ok({ x1: 285, y1: 145, x2: 435, y2: 145, ad: 'F1', renk: T, etiket: 'Ali, 50 N', ex: -40, ey: -16 }) +
      k.ok({ x1: 215, y1: 145, x2: 155, y2: 145, ad: 'F2', renk: '#7a3e9d', etiket: 'Ayşe, 20 N', ex: -52, ey: -16 }) +
      k.ok({ x1: 215, y1: 228, x2: 375, y2: 228, ad: 'dx', renk: N, etiket: 'Δx = 4 m', ex: -80, ey: 32 }));

    // MEB ders kitabındaki tekne örneği: I 20 N (0-5 m), II 0 (5-10 m), III -30 N (10-15 m)
    const g5 = k.grafik({ x1: 16, y0: -40, y1: 40, xt: [0, 5, 10, 15], yt: [-30, -20, -10, 0, 10, 20, 30], xad: 'Δx (m)', yad: 'F (N)' });
    const s5 = k.svg(g5.w, g5.h, g5.zemin +
      g5.alan([[0, 0], [0, 20], [5, 20], [5, 0]], '#e9a774', 'b1', true) + g5.yazi(2.5, 7, '+100 J', '#173430', 'b1y', true, 22) +
      g5.alan([[10, 0], [10, -30], [15, -30], [15, 0]], '#b9c6ec', 'b3', true) + g5.yazi(12.5, -17, '−150 J', '#173430', 'b3y', true, 22) +
      g5.cizgi([[0, 20], [5, 20]], T, 'Fc') + g5.cizgi([[5, 0], [10, 0]], T, 'Fc', false, 6) + g5.cizgi([[10, -30], [15, -30]], T, 'Fc') +
      g5.yazi(2.5, 33, 'I', '#6b7d76', '', false, 22) + g5.yazi(7.5, 33, 'II', '#6b7d76', '', false, 22) + g5.yazi(12.5, 33, 'III', '#6b7d76', '', false, 22));

    // Çantası sırtında düz yolda yürüyen çocuk
    const cizgi = (x1, y1, x2, y2, op = 1) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#173430" stroke-width="7" stroke-linecap="round" opacity="${op}"/>`;
    const cocuk = (x, op) => `<circle cx="${x}" cy="112" r="22" fill="none" stroke="#173430" stroke-width="6" opacity="${op}"/>` +
      cizgi(x, 134, x, 215, op) + cizgi(x, 215, x - 22, 292, op) + cizgi(x, 215, x + 22, 292, op) + cizgi(x, 152, x + 26, 196, op) +
      `<rect x="${x - 40}" y="140" width="34" height="58" rx="7" fill="#e9a774" stroke="#b06a3b" stroke-width="3" opacity="${op}"/>`;
    const sC = k.svg(500, 330,
      `<rect x="10" y="296" width="480" height="14" fill="#cfc9ba"/>` + cocuk(400, 0.3) + cocuk(120, 1) +
      k.ok({ x1: 88, y1: 169, x2: 88, y2: 52, ad: 'F', renk: T, etiket: 'F', ex: -22, ey: 14, gizli: true }) +
      k.ok({ x1: 150, y1: 50, x2: 400, y2: 50, ad: 'dx', renk: N, etiket: 'Δx', ex: -125, ey: -12, gizli: true }));

    return [
      k.kapak({ etiket: '10. SINIF FİZİK, ENERJİ ÜNİTESİ', baslik: 'Fizikte iş.', vurgu: 'Yorulmak yetmez, yer değiştirmek gerek.', aciklama: 'İş nedir, kuvvet–yer değiştirme grafiğinden nasıl bulunur ve hangi durumlarda hiç iş yapılmaz?' }),
      k.konu({
        etiket: 'TAHMİN ET', kod: 'FİZ.10.2.1', baslik: 'Hangisinde iş yapılıyor?',
        giris: 'Üç durumu düşün. Günlük dilde üçünde de “çok çalıştım” deriz.',
        maddeler: [
          '1. Ali 10 dakika boyunca okulun duvarını var gücüyle itiyor. Duvar kımıldamıyor.',
          '2. Ayşe yerdeki kitabını kaldırıp rafa koyuyor.',
          '3. Can sırt çantasıyla yatay yolda sabit hızla okula kadar yürüyor. Çanta ne yükseliyor ne alçalıyor.',
          { formul: 'Fizikte iş yalnızca 2. durumda yapılır.', aciklama: 'Kitap, uygulanan kuvvetin doğrultusunda yer değiştirdi. Duvar yer değiştirmedi. Çantayı taşıyan kuvvet yukarı, yer değiştirme yatay.' },
        ],
      }),
      k.konu({
        etiket: 'TANIM', kod: 'FİZ.10.2.1', baslik: 'İş nedir?',
        maddeler: [
          'Bir cisme kuvvet uygulanır ve cisim <b>kuvvetin doğrultusunda</b> yer değiştirirse kuvvet iş yapar.',
          'Kuvvet sabitse ve yer değiştirmeyle aynı yöndeyse iş, ikisinin çarpımıdır.',
          { formul: 'W = F · Δx', aciklama: 'W: iş (J), F: kuvvet (N), Δx: yer değiştirme (m).' },
          '1 joule: Cisim, kendisine uygulanan 1 N’luk kuvvetin yönünde 1 m yer değiştirdiğinde kuvvetin yaptığı iştir. 1 J = 1 N · m',
          'Kuvvet hareketin tersine yönelmişse iş negatiftir. Böyle bir kuvvet cismi yavaşlatır.',
          'İş skaler bir niceliktir, yönü yoktur. İşaret yalnızca hareketi hızlandırıp yavaşlattığını gösterir.',
        ],
      }),
      k.konu({
        etiket: 'GRAFİKLE MODEL', kod: 'FİZ.10.2.1', baslik: 'Kuvvet–yer değiştirme grafiği', sekil: s1,
        maddeler: [
          { metin: 'Bir kutu 20 N’luk sabit kuvvetle 4 m itiliyor. Kuvvet hiç değişmediği için grafik yatay bir çizgi.', vurgu: 'F' },
          { metin: 'Grafiğin altında kalan bölge bir dikdörtgen: eni 4 m, boyu 20 N.', vurgu: 'F,alan' },
          { metin: 'Dikdörtgenin alanı: 20 · 4 = 80. Bu tam olarak W = F · Δx.', vurgu: 'alan,alany' },
          { formul: 'İş = grafiğin altındaki alan', aciklama: 'Grafiğin altındaki alanın birimi N · m, yani joule.', vurgu: 'alan,alany' },
        ],
      }),
      k.soru({
        etiket: 'VERİ SETİ', kod: 'FİZ.10.2.1', baslik: 'Kuvvet sabit, yol değişiyor',
        baglam: 'Bir öğrenci simülasyonda bir kutuyu 20 N’luk sabit kuvvetle farklı mesafeler boyunca itiyor.',
        tablo: { basliklar: ['Δx (m)', 'F (N)', 'W (J)'], doldur: 0, satirlar: [['1', '20', '20'], ['2', '20', '40'], ['3', '20', '60'], ['4', '20', '80']] },
        maddeler: [
          { metin: 'Her satırda W = F · Δx bağıntısını kullanarak tablonun iş sütununu doldurunuz.', puan: '4 puan', adimlar: ['Kontrol: 4 m için 20 · 4 = 80 J. Her metrede iş 20 J artıyor.'] },
          { metin: 'İş ile yer değiştirme arasında nasıl bir ilişki vardır?', puan: '3 puan', adimlar: ['Δx iki katına çıkınca W de iki katına çıkıyor.'], cevap: 'Doğru orantılı: kuvvet sabitken iş yer değiştirmeyle doğru orantılıdır.' },
          { metin: 'Kuvvet 40 N olsaydı 4 m sonunda yapılan iş kaç J olurdu?', puan: '3 puan', adimlar: ['W = 40 · 4'], cevap: '160 J. Kuvvet iki katına çıkınca iş de iki katına çıkar.' },
        ],
      }),
      k.soru({
        etiket: 'ZIT KUVVET', kod: 'FİZ.10.2.1', baslik: 'İki yandan itilen kutu', sekil: sZ,
        baglam: 'Ali bir kutuyu 50 N’luk kuvvetle sağa itiyor. Ayşe aynı anda kutuyu 20 N’luk kuvvetle sola itiyor. Kutu 4 m sağa yer değiştiriyor.',
        maddeler: [
          { metin: 'Ali’nin uyguladığı kuvvetin yaptığı iş kaç J’dür?', puan: '3 puan', adimlar: [{ metin: 'Kuvvet hareket yönünde: W = 50 · 4', vurgu: 'F1,dx' }], cevap: '200 J' },
          { metin: 'Ayşe’nin uyguladığı kuvvetin yaptığı iş kaç J’dür?', puan: '4 puan', adimlar: [{ metin: 'Kuvvet hareketin tersine, iş negatif: W = −20 · 4', vurgu: 'F2,dx' }], cevap: '−80 J. Bu kuvvet hareketi zorlaştırır.' },
          { metin: 'Kutu üzerinde yapılan net iş kaç J’dür?', puan: '3 puan', adimlar: ['1. yol, işleri topla: 200 + (−80)', '2. yol, net kuvvetle: (50 − 20) · 4'], cevap: '120 J. İki yol aynı sonucu verir.' },
        ],
      }),
      k.konu({
        etiket: 'KUVVET DEĞİŞİRSE', kod: 'FİZ.10.2.1', baslik: 'Sabit olmayan kuvvetin işi', sekil: s2,
        maddeler: [
          { metin: 'Bir kutuya hareket yönünde uygulanan kuvvet, sıfırdan başlayıp düzgün artarak 4 m sonunda 40 N’a çıkıyor.', vurgu: 'F' },
          'Hangi kuvveti kullanacağız: 0 mı, 40 N mu? W = F · Δx tek başına yetmiyor.',
          { metin: 'Grafiğin altındaki alan yine işi verir. Bu kez alan bir üçgen.', vurgu: 'F,alan' },
          { formul: 'W = ½ · 4 · 40 = 80 J', aciklama: 'Kuvvet sabit olsun ya da olmasın, iş her zaman grafiğin altındaki alandır.', vurgu: 'alan,alany' },
        ],
      }),
      k.soru({
        etiket: 'GRAFİK OKU', kod: 'FİZ.10.2.1', baslik: 'Parça parça değişen kuvvet', sekil: s3,
        baglam: 'Yatay bir yolda hareket eden bir cisme, hareket yönünde uygulanan kuvvetin yer değiştirmeye göre değişimi grafikteki gibidir.',
        maddeler: [
          { metin: 'İlk 2 m’de kuvvetin yaptığı iş kaç J’dür?', puan: '3 puan', adimlar: [{ metin: 'Dikdörtgen: 10 · 2', vurgu: 'F,a1' }], cevap: '20 J', cevapVurgu: 'a1,a1y' },
          { metin: '2 m ile 4 m arasında yapılan iş kaç J’dür?', puan: '4 puan', adimlar: [{ metin: 'Yamuk: (10 + 30) / 2 · 2', vurgu: 'F,a2' }], cevap: '40 J', cevapVurgu: 'a1,a2,a2y' },
          { metin: '6 m sonunda yapılan toplam iş kaç J’dür?', puan: '3 puan', adimlar: [{ metin: 'Son parça dikdörtgen: 30 · 2 = 60 J', vurgu: 'F,a3' }, '20 + 40 + 60'], cevap: '120 J', cevapVurgu: 'a1,a2,a3,a1y,a2y,a3y' },
        ],
      }),
      k.soru({
        etiket: 'MEB ÖRNEĞİ', kod: 'FİZ.10.2.1', baslik: 'Teknenin kuvvet–yer değiştirme grafiği', sekil: s5,
        baglam: 'Durgun suda hep ileri giden bir tekneye etki eden net kuvvetin, teknenin yer değiştirmesine göre değişimi grafikteki gibidir. Kuvvet ileri yönde artı alınmıştır.',
        maddeler: [
          { metin: 'I. bölgede yapılan iş kaç J’dür?', puan: '2 puan', adimlar: [{ metin: 'Eksenin üstündeki dikdörtgen: 20 · 5', vurgu: 'b1' }], cevap: '+100 J. Tekne hızlanır.', cevapVurgu: 'b1,b1y' },
          { metin: 'II. bölgede iş yapılır mı?', puan: '2 puan', adimlar: ['Net kuvvet sıfır, grafiğin altında alan yok.'], cevap: '0 J. Tekne sabit hızla gider.' },
          { metin: 'III. bölgede yapılan iş kaç J’dür? Neden negatiftir?', puan: '3 puan', adimlar: [{ metin: 'Eksenin altındaki dikdörtgen: −30 · 5', vurgu: 'b3' }], cevap: '−150 J. Kuvvet hareketin tersine, tekne yavaşlar.', cevapVurgu: 'b3,b3y' },
          { metin: '15 m sonunda yapılan net iş kaç J’dür?', puan: '3 puan', adimlar: [{ metin: '100 + 0 + (−150)', vurgu: 'b1,b3' }], cevap: '−50 J', cevapVurgu: 'b1,b3,b1y,b3y' },
        ],
      }),
      k.konu({
        etiket: 'İŞ YOK', kod: 'FİZ.10.2.1', baslik: 'Çantası sırtında yürüyen çocuk', sekil: sC,
        maddeler: [
          { metin: 'Can çantasını sırtında taşıyor. Çantaya yukarı yönde, ağırlığı kadar bir kuvvet uyguluyor.', vurgu: 'F' },
          { metin: 'Can yatay yolda sabit hızla yürüyor. Çanta yatay doğrultuda yer değiştiriyor.', vurgu: 'F,dx' },
          { metin: 'Kuvvet yukarı, yer değiştirme yatay. Kuvvetin doğrultusunda hiç yer değiştirme yok.', vurgu: 'F,dx' },
          { formul: 'Kuvvet harekete dikse W = 0', aciklama: 'Can yorulur ama çantayı taşıyan kuvvet iş yapmaz. Merdiven çıkarken çanta yukarı da yer değiştirir, o zaman iş yapılır.', vurgu: 'F,dx' },
        ],
      }),
      k.konu({
        etiket: 'GENELLEME', kod: 'FİZ.10.2.1', baslik: 'İşle ilgili dört kural',
        maddeler: [
          '<b>1.</b> İş, kuvvet–yer değiştirme grafiğinin altındaki alana eşittir.',
          '<b>2.</b> Sabit kuvvette, kuvvetin büyüklüğü ya da yer değiştirme iki katına çıkarsa iş de iki katına çıkar.',
          '<b>3.</b> Yer değiştirme yoksa iş yoktur. Duvarı ne kadar itersen it, Δx = 0 ise W = 0.',
          '<b>4.</b> Kuvvet hareket doğrultusuna dikse o kuvvet iş yapmaz. Sırttaki çantayı taşıyan yukarı kuvvet, yatay yolda sabit hızla yürürken iş yapmaz.',
        ],
      }),
      k.soru({
        etiket: 'GÜNLÜK HAYAT', baslik: 'Market arabası', sekil: s4,
        baglam: 'Bir müşteri market arabasını önce 40 N’luk kuvvetle 15 m, ardından 20 N’luk kuvvetle 10 m daha itiyor. Kuvvet her an hareket yönündedir.',
        maddeler: [
          { metin: 'Bu hareketin kuvvet–yer değiştirme grafiğini çiziniz.', puan: '3 puan', adimlar: [], cevap: '0–15 m arası 40 N, 15–25 m arası 20 N’da yatay iki çizgi.', cevapVurgu: 'cz' },
          { metin: 'Müşterinin uyguladığı kuvvetin yaptığı toplam iş kaç J’dür?', puan: '4 puan', adimlar: [{ metin: 'İlk parça: 40 · 15 = 600 J', vurgu: 'cz,b1' }, { metin: 'İkinci parça: 20 · 10 = 200 J', vurgu: 'cz,b2' }], cevap: '600 + 200 = 800 J', cevapVurgu: 'cz,b1,b2' },
        ],
      }),
      k.soru({
        etiket: 'İŞ VAR MI?', baslik: 'Halter, duvar ve tepsi',
        baglam: 'Her durumda belirtilen kuvvetin iş yapıp yapmadığını ve yapıyorsa kaç J yaptığını bulunuz. g = 10 m/s² alınız.',
        maddeler: [
          { metin: 'Halterci 100 kg’lık halteri sabit hızla 2 m yükseğe kaldırıyor. Haltercinin uyguladığı kuvvetin yaptığı iş kaç J’dür?', puan: '4 puan', adimlar: ['Sabit hızla kaldırırken kuvvet ağırlığa eşit: F = 100 · 10 = 1000 N, yukarı.', 'Yer değiştirme de yukarı, 2 m. W = 1000 · 2'], cevap: '2000 J' },
          { metin: 'Halterci halteri başının üstünde 3 saniye tutuyor. Bu sürede iş yapılır mı?', puan: '3 puan', adimlar: ['Kuvvet var ama halter yer değiştirmiyor: Δx = 0'], cevap: 'İş yapılmaz, W = 0. Halterci yorulur ama fiziksel iş sıfırdır.' },
          { metin: 'Garson tepsiyi yere paralel tutarak sabit hızla 5 m yürüyor. Tepsiyi tutan kuvvet iş yapar mı?', puan: '3 puan', adimlar: ['Tepsiyi tutan kuvvet yukarı, yer değiştirme yatay. Kuvvet harekete dik.'], cevap: 'İş yapmaz.' },
        ],
      }),
      k.konu({
        etiket: 'KISA TEKRAR', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          'İş için iki şart: kuvvet ve o kuvvetin doğrultusunda yer değiştirme.',
          'Kuvvet sabitse W = F · Δx. Birimi joule (J).',
          'Kuvvet–yer değiştirme grafiğinin altındaki alan her zaman işi verir.',
          'Δx = 0 ise ya da kuvvet harekete dikse iş yapılmaz.',
          'Harekete zıt yönlü kuvvet negatif iş yapar. Grafikte eksenin altındaki alan negatiftir.',
        ],
      }),
      k.kapanis({ baslik: 'İşi öğrendik.', vurgu: 'Gelecek ders: güç ve kWh.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
