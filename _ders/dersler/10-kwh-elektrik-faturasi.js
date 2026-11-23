// 10. sınıf, Enerji ünitesi 3. ders: Güç birimleri, kWh ve elektrik faturası (yaklaşık 20 dakikalık video)
// MEB ders kitabı 2.1, s. 99-107 ile paralel: watt, kW, beygir gücü, ruhsattaki motor gücü, kWh, güç etiketi,
// fatura hesabı (güç, süre, birim fiyat), iki evin karşılaştırılması, faturadan güce, bilinçli tüketici.
// TYMM FİZ.10.2.2. Önceki ders: 10-guc. Sonraki ders: enerji biçimleri (kitap 2.2).
module.exports = {
  slug: '10-kwh-elektrik-faturasi',
  baslik: '10. Sınıf Fizik: kWh ve Elektrik Faturası',
  dersAdi: '10. sınıf, kWh ve fatura',
  slaytlar: (k) => {
    const T = '#b06a3b', N = '#1d3b8f', G = '#244f40';
    const yz = (x, y, t, renk = '#173430', boy = 22, a = 'start', w = 800) => `<text x="${x}" y="${y}" font-size="${boy}" font-weight="${w}" fill="${renk}" text-anchor="${a}">${t}</text>`;

    // Şekil: araç ruhsatından bir bölüm
    const satir = (y, ad, deger, id = '') => `<g class="vek" data-ad="${id}"><line x1="24" y1="${y + 14}" x2="436" y2="${y + 14}" stroke="#d9d3c4" stroke-width="2"/>${yz(36, y, ad, '#6b7d76', 19, 'start', 700)}${yz(424, y, deger, '#173430', 22, 'end')}</g>`;
    const sRuhsat = k.svg(460, 330, `<rect x="12" y="12" width="436" height="306" rx="16" fill="#fff" stroke="#b06a3b" stroke-width="3"/>` +
      yz(230, 54, 'ARAÇ TESCİL BELGESİ', T, 22, 'middle') + satir(104, 'Cinsi', 'Otomobil') + satir(154, 'Yakıt cinsi', 'Benzin') +
      satir(204, 'Net ağırlığı', '1200 kg') + satir(254, 'Motor gücü', '60 kW', 'guc') + yz(230, 300, 'Güç bilgisi kW ile yazılır.', '#6b7d76', 18, 'middle', 700));

    // Şekil: cihaz güç etiketleri
    const etiket = (x, y, ad, guc, renk, id) => `<g class="vek" data-ad="${id}"><rect x="${x}" y="${y}" width="300" height="88" rx="12" fill="#fff" stroke="${renk}" stroke-width="3"/>
      <text x="${x + 18}" y="${y + 36}" font-size="24" font-weight="800" fill="#173430">${ad}</text>
      <text x="${x + 18}" y="${y + 70}" font-size="24" font-weight="700" fill="${renk}">${guc}</text></g>`;
    const sEtiket = k.svg(340, 330, etiket(20, 10, 'Elektrikli ısıtıcı', '2000 W, 220–240 V', T, 'isitici') +
      etiket(20, 120, 'Saç kurutma', '2000 W', N, 'kurutma') + etiket(20, 230, 'LED lamba (10 adet)', 'tanesi 20 W', G, 'led'));

    // Şekil: fatura hesabının üç adımı
    const kutu = (y, ust, alt, renk, id) => `<g class="vek" data-ad="${id}"><rect x="20" y="${y}" width="400" height="92" rx="14" fill="#fff" stroke="${renk}" stroke-width="3"/>${yz(40, y + 38, ust, renk, 23)}${yz(40, y + 72, alt, '#173430', 21, 'start', 700)}</g>`;
    const sFatura = k.svg(440, 350, kutu(10, '1. Güç (kW)', 'Bulaşık makinesi: 2000 W = 2 kW', T, 'f1') + kutu(128, '2. Süre (saat)', 'Günde 1 saat, 30 gün: 30 saat', N, 'f2') + kutu(246, '3. Birim fiyat', '1 kWh için 3 TL', G, 'f3'));

    return [
      k.kapak({ etiket: '10. SINIF FİZİK, ENERJİ', baslik: 'Elektrik faturası.', vurgu: 'kWh neyi ölçer?', aciklama: 'Watt, kilowatt, beygir gücü ve kilowattsaat. Bir cihazın faturaya ne kadar yansıdığını kendin hesapla. Ders kitabı 2.1, sayfa 99-107.' }),
      k.konu({
        etiket: 'GÜÇ BİRİMLERİ', kod: 'FİZ.10.2.2', baslik: 'Watt, kilowatt, beygir gücü', sekil: sRuhsat,
        maddeler: [
          'Geçen ders: güç, birim zamanda yapılan iş ya da aktarılan enerjidir. P = W / t, 1 W = 1 J/s.',
          { metin: '1 kW = 1000 W. Motorların ve elektrikli cihazların gücü çoğunlukla kW ile verilir.', vurgu: 'guc' },
          'Beygir gücü (BG), James Watt’ın buhar makinelerinin gücünü anlatmak için kullandığı birimdir. 1 BG yaklaşık 746 W’tır.',
          { formul: 'W = P · t', aciklama: 'Gücü bilinen bir motorun belli sürede aktardığı enerji bu modelle bulunur.' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', baslik: 'Ruhsattaki motor gücü', sekil: sRuhsat,
        baglam: 'Bir otomobilin ruhsatında motor gücü 60 kW olarak yazıyor. Motorun bu güçle çalıştığını kabul ediniz.',
        maddeler: [
          { metin: 'Motor 1 saniyede kaç J enerji aktarır?', puan: '3 puan', adimlar: [{ metin: '60 kW = 60 000 W = 60 000 J/s', vurgu: 'guc' }], cevap: '60 000 J' },
          { metin: 'Motor 1 dakikada kaç J enerji aktarır?', puan: '3 puan', adimlar: ['W = P · t = 60 000 × 60'], cevap: '3 600 000 J' },
          { metin: 'Bu enerji kaç kWh eder?', puan: '4 puan', adimlar: ['1 dakika = 1/60 saat,  W = 60 kW × 1/60 h'], cevap: '1 kWh. Demek ki 1 kWh = 3 600 000 J.' },
        ],
      }),
      k.konu({
        etiket: 'YENİ BİRİM', kod: 'FİZ.10.2.2', baslik: 'Faturadaki kWh ne demek?', sekil: sEtiket,
        maddeler: [
          'kWh (kilowattsaat) bir güç birimi değil, bir <b>enerji</b> birimidir.',
          { formul: '1 kWh = 3 600 000 J', aciklama: '1 kW gücündeki bir cihazın 1 saatte harcadığı enerji: 1000 W × 3600 s.' },
          { metin: 'Cihazların gücü, üzerlerindeki güç etiketinde yazar. Örnek: 2000 W’lık ısıtıcı 3 saat çalışırsa 2 kW × 3 h = 6 kWh enerji harcar.', vurgu: 'isitici' },
          'Fatura cihazın gücüne göre değil, harcanan enerjiye (kWh) göre ödenir.',
        ],
      }),
      k.konu({
        etiket: 'MATEMATİKSEL MODEL', kod: 'FİZ.10.2.2', baslik: 'Fatura üç şeye bağlıdır', sekil: sFatura,
        maddeler: [
          { metin: 'Cihazın gücü: etiketten okunur ve kW’a çevrilir.', vurgu: 'f1' },
          { metin: 'Kullanım süresi: günlük süre, gün sayısıyla çarpılır.', vurgu: 'f2' },
          { metin: 'Birim fiyat: 1 kWh enerjinin bedeli.', vurgu: 'f3' },
          { formul: '2 kW × 30 h = 60 kWh', aciklama: 'Bedel: 60 × 3 = 180 TL. Bu makine ayda faturaya 180 TL yansıtır.', vurgu: 'f1,f2,f3' },
        ],
      }),
      k.soru({
        etiket: 'GÜNLÜK HAYAT', baslik: 'Evin elektrik tüketimi', sekil: sEtiket,
        baglam: 'Bir evde her gün 2000 W’lık ısıtıcı 3 saat, 2000 W’lık saç kurutma makinesi yarım saat, tanesi 20 W olan 10 LED lamba 10 saat çalışıyor.',
        maddeler: [
          { metin: 'Isıtıcının bir günde harcadığı enerji kaç kWh’tir?', puan: '3 puan', adimlar: [{ metin: 'W = P · t = 2 kW × 3 h', vurgu: 'isitici' }], cevap: '6 kWh' },
          { metin: '“Gücü büyük olan cihaz her zaman daha çok enerji harcar.” Saç kurutma makinesi ve lambalarla değerlendiriniz.', puan: '4 puan', adimlar: [{ metin: 'Saç kurutma: 2 kW, yarım saat. 2 kWh’nin yarısı: 1 kWh', vurgu: 'kurutma' }, { metin: 'Lambalar: 10 × 20 W = 200 W,  200 W × 10 h = 2000 Wh = 2 kWh', vurgu: 'led' }], cevap: 'Önerme yanlış. Gücü küçük lambalar daha çok enerji harcadı. Enerji süreye de bağlıdır.' },
          { metin: 'Üç cihazın 30 günlük toplam enerjisi kaç kWh’tir? 1 kWh 3 TL ise kaç TL ödenir?', puan: '3 puan', adimlar: ['Bir gün: 6 + 1 + 2 = 9 kWh', '30 gün: 9 × 30 = 270 kWh'], cevap: '270 kWh, 270 × 3 = 810 TL' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', baslik: 'İki ev, aynı eşyalar',
        baglam: 'İki evde aynı eşyalar aynı sürelerle kullanılıyor. Birinci evdeki eşyalar verimli (A sınıfı), ikinci evdekiler eski tiptir. 1 kWh’nin bedeli 3 TL’dir.',
        tablo: { basliklar: ['Cihaz', 'Günlük süre', '1. ev', '2. ev'], satirlar: [['Buzdolabı', '24 saat', '125 W', '250 W'], ['Çamaşır makinesi', '1 saat', '1000 W', '2000 W'], ['Televizyon', '4 saat', '250 W', '500 W']] },
        maddeler: [
          { metin: 'Birinci evin bir günde harcadığı enerji kaç kWh’tir?', puan: '4 puan', adimlar: ['Buzdolabı: 125 × 24 = 3000 Wh = 3 kWh', 'Çamaşır makinesi: 1000 × 1 = 1000 Wh = 1 kWh,  televizyon: 250 × 4 = 1000 Wh = 1 kWh'], cevap: '3 + 1 + 1 = 5 kWh' },
          { metin: 'İkinci evin bir günde harcadığı enerji kaç kWh’tir?', puan: '3 puan', adimlar: ['Bütün güçler 2 katı, süreler aynı: enerji de 2 katı.'], cevap: '6 + 2 + 2 = 10 kWh' },
          { metin: '30 günlük faturalar arasındaki fark kaç TL’dir?', puan: '3 puan', adimlar: ['Günlük fark 5 kWh, 30 günde 5 × 30 = 150 kWh'], cevap: '150 × 3 = 450 TL. Verimli cihaz faturayı yarıya indirdi.' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', baslik: 'Faturadan güce',
        baglam: 'Bir ay (30 gün) boyunca her gün 5 saat çalışan dizüstü ve masaüstü bilgisayarların faturaya yansıyan bedelleri sırasıyla 45 TL ve 90 TL’dir. 1 kWh’nin bedeli 3 TL’dir.',
        maddeler: [
          { metin: 'Bilgisayarların bir ayda harcadığı enerjiler kaç kWh’tir?', puan: '3 puan', adimlar: ['Dizüstü: 45 / 3 = 15 kWh', 'Masaüstü: 90 / 3 = 30 kWh'], cevap: '15 kWh ve 30 kWh' },
          { metin: 'Bilgisayarların güçleri kaç W’tır?', puan: '4 puan', adimlar: ['Toplam çalışma süresi: 5 × 30 = 150 saat', '15 kWh = 15 000 Wh,  P = W / t = 15 000 / 150 = 100 W', '30 kWh = 30 000 Wh,  30 000 / 150 = 200 W'], cevap: 'Dizüstü 100 W, masaüstü 200 W' },
          { metin: 'Masaüstü bilgisayar günde 1 saat az kullanılırsa bir ayda kaç TL tasarruf edilir?', puan: '3 puan', adimlar: ['Ayda 30 saat az çalışır: 200 W × 30 h = 6000 Wh = 6 kWh'], cevap: '6 × 3 = 18 TL' },
        ],
      }),
      k.konu({
        etiket: 'BİLİNÇLİ TÜKETİCİ', baslik: 'Enerjiyi israf etmeden kullanmak',
        maddeler: [
          'Cihaz alırken güç etiketine ve enerji sınıfına bak. Aynı işi daha az güçle yapan cihaz, faturayı her ay düşürür.',
          'Aydınlatmada LED lamba kullan. Aynı ışığı çok daha küçük güçle verir.',
          'Kullanmadığın cihazı kapat. Enerji süreyle doğru orantılıdır: süre yarıya inerse harcanan enerji de yarıya iner.',
          { formul: 'Tasarruf = güç × kısalan süre', aciklama: 'Aile bütçesine, ülke ekonomisine ve çevreye katkı sağlar.' },
        ],
      }),
      k.konu({
        etiket: 'ÖZET', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          '1 kW = 1000 W. 1 BG yaklaşık 746 W. İkisi de güç birimidir.',
          'kWh bir enerji birimidir: 1 kWh = 3 600 000 J.',
          'Harcanan enerji: W = P · t. Güç kW, süre saat alınırsa sonuç kWh çıkar.',
          { formul: 'Fatura = güç (kW) × süre (h) × birim fiyat', aciklama: 'Gücü küçük bir cihaz uzun süre çalışırsa, gücü büyük bir cihazdan daha çok enerji harcayabilir.' },
        ],
      }),
      k.kapanis({ baslik: 'Faturayı artık sen hesaplarsın.', vurgu: 'Gelecek ders: enerji biçimleri.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
