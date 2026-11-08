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
      g1.alan([[0, 0], [0, 20], [4, 20], [4, 0]], '#e9a774', 'alan', true, 'W = 20 · 4 = 80 J') +
      g1.cizgi([[0, 20], [4, 20]], T, 'F'));

    // Sabit olmayan kuvvet: 0'dan 40 N'a doğrusal, 0-4 m
    const g2 = k.grafik({ x1: 5, y1: 50, xt: [0, 1, 2, 3, 4, 5], yt: [0, 10, 20, 30, 40, 50], xad: 'Δx (m)', yad: 'F (N)' });
    const s2 = k.svg(g2.w, g2.h, g2.zemin +
      g2.alan([[0, 0], [4, 40], [4, 0]], '#e9a774', 'alan', true, '') + g2.yazi(3, 10, 'W = ½ · 4 · 40 = 80 J', '#173430', 'alan', true, 21) +
      g2.cizgi([[0, 0], [4, 40]], T, 'F'));

    // Parçalı grafik: 10 N (0-2 m), 10→30 N (2-4 m), 30 N (4-6 m)
    const g3 = k.grafik({ x1: 7, y1: 40, xt: [0, 1, 2, 3, 4, 5, 6, 7], yt: [0, 10, 20, 30, 40], xad: 'Δx (m)', yad: 'F (N)' });
    const s3 = k.svg(g3.w, g3.h, g3.zemin +
      g3.alan([[0, 0], [0, 10], [2, 10], [2, 0]], '#e9a774', 'a1', true, '20 J') +
      g3.alan([[2, 0], [2, 10], [4, 30], [4, 0]], '#9fc5b4', 'a2', true, '40 J') +
      g3.alan([[4, 0], [4, 30], [6, 30], [6, 0]], '#b9c6ec', 'a3', true, '60 J') +
      g3.cizgi([[0, 10], [2, 10], [4, 30], [6, 30]], T, 'F'));

    // Market arabası: 40 N (0-15 m), 20 N (15-25 m)
    const g4 = k.grafik({ x1: 30, y1: 50, xt: [0, 5, 10, 15, 20, 25, 30], yt: [0, 10, 20, 30, 40, 50], xad: 'Δx (m)', yad: 'F (N)' });
    const s4 = k.svg(g4.w, g4.h, g4.zemin +
      g4.alan([[0, 0], [0, 40], [15, 40], [15, 0]], '#e9a774', 'b1', true, '600 J') +
      g4.alan([[15, 0], [15, 20], [25, 20], [25, 0]], '#9fc5b4', 'b2', true, '200 J') +
      g4.cizgi([[0, 40], [15, 40]], T, 'cz', true) + g4.cizgi([[15, 20], [25, 20]], T, 'cz', true));

    return [
      k.kapak({ etiket: '10. SINIF FİZİK, ENERJİ ÜNİTESİ', baslik: 'Fizikte iş.', vurgu: 'Yorulmak yetmez, yer değiştirmek gerek.', aciklama: 'İş nedir, kuvvet–yer değiştirme grafiğinden nasıl bulunur ve hangi durumlarda hiç iş yapılmaz?' }),
      k.konu({
        etiket: 'TAHMİN ET', kod: 'FİZ.10.2.1', baslik: 'Hangisinde iş yapılıyor?',
        giris: 'Üç durumu düşün. Günlük dilde üçünde de “çok çalıştım” deriz.',
        maddeler: [
          '1. Ali 10 dakika boyunca okulun duvarını var gücüyle itiyor. Duvar kımıldamıyor.',
          '2. Ayşe yerdeki çantasını kaldırıp masaya koyuyor.',
          '3. Can kitabını elinde tutarak durağa kadar yürüyor ama kitabı ne kaldırıyor ne indiriyor.',
          { formul: 'Fizikte iş, yalnızca 2. durumda tartışmasız var.', aciklama: 'Çanta, uygulanan kuvvetin doğrultusunda yer değiştirdi. Duvar yer değiştirmedi. Kitabı tutan kuvvet yukarı, yer değiştirme yatay.' },
        ],
      }),
      k.konu({
        etiket: 'TANIM', kod: 'FİZ.10.2.1', baslik: 'İş nedir?',
        maddeler: [
          'Bir cisme kuvvet uygulanır ve cisim <b>kuvvetin doğrultusunda</b> yer değiştirirse kuvvet iş yapar.',
          'Kuvvet ve yer değiştirme aynı doğrultudaysa iş, ikisinin çarpımıdır.',
          { formul: 'W = F · Δx', aciklama: 'W: iş (J), F: kuvvet (N), Δx: yer değiştirme (m).' },
          '1 joule: 1 N’luk kuvvetin cismi 1 m yer değiştirdiğinde yaptığı iştir. 1 J = 1 N · m',
          'İş skaler bir niceliktir, yönü yoktur.',
        ],
      }),
      k.konu({
        etiket: 'GRAFİKLE MODEL', kod: 'FİZ.10.2.1', baslik: 'Kuvvet–yer değiştirme grafiği', sekil: s1,
        maddeler: [
          { metin: 'Bir kutu 20 N’luk sabit kuvvetle 4 m itiliyor. Kuvvet hiç değişmediği için grafik yatay bir çizgi.', vurgu: 'F' },
          { metin: 'Grafiğin altında kalan bölge bir dikdörtgen: eni 4 m, boyu 20 N.', vurgu: 'F,alan' },
          { metin: 'Dikdörtgenin alanı: 20 · 4 = 80. Bu tam olarak W = F · Δx.', vurgu: 'alan' },
          { formul: 'İş = grafiğin altındaki alan', aciklama: 'Grafiğin altındaki alanın birimi N · m, yani joule.', vurgu: 'alan' },
        ],
      }),
      k.soru({
        etiket: 'VERİ SETİ', kod: 'FİZ.10.2.1', baslik: 'Kuvvet sabit, yol değişiyor',
        baglam: 'Bir öğrenci simülasyonda bir kutuyu 20 N’luk sabit kuvvetle farklı mesafeler boyunca itiyor ve kuvvetin yaptığı işi kaydediyor.',
        tablo: { basliklar: ['Δx (m)', 'F (N)', 'W (J)'], doldur: 0, satirlar: [['1', '20', '20'], ['2', '20', '40'], ['3', '20', '60'], ['4', '20', '80']] },
        maddeler: [
          { metin: 'Tablonun iş sütununu doldurunuz.', puan: '4 puan', adimlar: ['Her satırda W = F · Δx = 20 · Δx'] },
          { metin: 'İş ile yer değiştirme arasında nasıl bir ilişki vardır?', puan: '3 puan', adimlar: ['Δx iki katına çıkınca W de iki katına çıkıyor.'], cevap: 'Doğru orantılı: kuvvet sabitken iş yer değiştirmeyle doğru orantılıdır.' },
          { metin: 'Kuvvet 40 N olsaydı 4 m sonunda yapılan iş kaç J olurdu?', puan: '3 puan', adimlar: ['W = 40 · 4'], cevap: '160 J. Kuvvet iki katına çıkınca iş de iki katına çıkar.' },
        ],
      }),
      k.konu({
        etiket: 'KUVVET DEĞİŞİRSE', kod: 'FİZ.10.2.1', baslik: 'Sabit olmayan kuvvetin işi', sekil: s2,
        maddeler: [
          { metin: 'Bir yay gerilirken uygulanan kuvvet sıfırdan başlayıp 4 m sonunda 40 N’a çıkıyor.', vurgu: 'F' },
          'Hangi kuvveti kullanacağız: 0 mı, 40 N mu? W = F · Δx tek başına yetmiyor.',
          { metin: 'Grafiğin altındaki alan yine işi verir. Bu kez alan bir üçgen.', vurgu: 'F,alan' },
          { formul: 'W = ½ · 4 · 40 = 80 J', aciklama: 'Kuvvet sabit olsun ya da olmasın, iş her zaman grafiğin altındaki alandır.', vurgu: 'alan' },
        ],
      }),
      k.soru({
        etiket: 'GRAFİK OKU', kod: 'FİZ.10.2.1', baslik: 'Parça parça değişen kuvvet', sekil: s3,
        baglam: 'Yatay bir yolda hareket eden bir cisme, hareket yönünde uygulanan kuvvetin yer değiştirmeye göre değişimi grafikteki gibidir.',
        maddeler: [
          { metin: 'İlk 2 m’de kuvvetin yaptığı iş kaç J’dür?', puan: '3 puan', adimlar: [{ metin: 'Dikdörtgen: 10 · 2', vurgu: 'F,a1' }], cevap: '20 J', cevapVurgu: 'a1' },
          { metin: '2 m ile 4 m arasında yapılan iş kaç J’dür?', puan: '4 puan', adimlar: [{ metin: 'Yamuk: (10 + 30) / 2 · 2', vurgu: 'F,a2' }], cevap: '40 J', cevapVurgu: 'a1,a2' },
          { metin: '6 m sonunda yapılan toplam iş kaç J’dür?', puan: '3 puan', adimlar: [{ metin: 'Son parça dikdörtgen: 30 · 2 = 60 J', vurgu: 'F,a3' }, '20 + 40 + 60'], cevap: '120 J', cevapVurgu: 'a1,a2,a3' },
        ],
      }),
      k.konu({
        etiket: 'GENELLEME', kod: 'FİZ.10.2.1', baslik: 'İşle ilgili dört kural',
        maddeler: [
          '<b>1.</b> İş, kuvvet–yer değiştirme grafiğinin altındaki alana eşittir.',
          '<b>2.</b> Kuvvet sabitken kuvvet ya da yer değiştirme iki katına çıkarsa iş de iki katına çıkar.',
          '<b>3.</b> Yer değiştirme yoksa iş yoktur. Duvarı ne kadar itersen it, Δx = 0 ise W = 0.',
          '<b>4.</b> Kuvvet hareket doğrultusuna dikse o kuvvet iş yapmaz. Kitabı tutan yukarı kuvvet, yatay yürürken iş yapmaz.',
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
          { metin: 'Halterci 100 kg’lık halteri sabit hızla 2 m yükseğe kaldırıyor. Halterciye ait kaldırma kuvvetinin işi kaçtır?', puan: '4 puan', adimlar: ['Sabit hızla kaldırırken kuvvet ağırlığa eşit: F = 100 · 10 = 1000 N, yukarı.', 'Yer değiştirme de yukarı, 2 m. W = 1000 · 2'], cevap: '2000 J' },
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
        ],
      }),
      k.kapanis({ baslik: 'İşi öğrendik.', vurgu: 'Gelecek ders: güç ve kWh.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
