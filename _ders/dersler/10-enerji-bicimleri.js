// 10. sınıf, Enerji ünitesi 4. ders: Enerji biçimleri (yaklaşık 20 dakikalık video)
// MEB ders kitabı 2.2, s. 109-120 ile paralel: yedi enerji biçimi, özellikleri, benzerlik ve farklılıkları,
// enerji dönüşümleri (akü, vantilatör, yıldırım, mutfak aletleri, nükleer santral tipleri kendi örneklerimizle).
// TYMM FİZ.10.2.3. Önceki ders: 10-kwh-elektrik-faturasi. Sonraki ders: kinetik ve potansiyel enerji (kitap 2.3).
module.exports = {
  slug: '10-enerji-bicimleri',
  baslik: '10. Sınıf Fizik: Enerji Biçimleri',
  dersAdi: '10. sınıf, enerji biçimleri',
  slaytlar: (k) => {
    const T = '#b06a3b', N = '#1d3b8f', G = '#244f40', M = '#7a3b8f', K = '#a33a2a', S = '#173430';
    const yz = (x, y, t, renk = S, boy = 22, a = 'start', w = 800) => `<text x="${x}" y="${y}" font-size="${boy}" font-weight="${w}" fill="${renk}" text-anchor="${a}">${t}</text>`;
    const kart = (x, y, ad, alt, renk, id, w = 250, h = 84) => `<g class="vek" data-ad="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${renk}" stroke-width="3"/><rect x="${x}" y="${y}" width="12" height="${h}" rx="6" fill="${renk}"/>${yz(x + 28, y + 36, ad, renk, 24)}${yz(x + 28, y + 64, alt, S, 16, 'start', 700)}</g>`;

    // Şekil: yedi enerji biçimi
    const sYedi = k.svg(540, 392,
      kart(10, 8, 'Mekanik', 'hareket ve konum', G, 'mek') + kart(280, 8, 'Kimyasal', 'bağlarda depolanır', T, 'kim') +
      kart(10, 104, 'Nükleer', 'atom çekirdeğinden', K, 'nuk') + kart(280, 104, 'Isı', 'sıcaklık farkıyla aktarılır', '#c2410c', 'isi') +
      kart(10, 200, 'Işık', 'boşlukta da yayılır', '#a16207', 'isik') + kart(280, 200, 'Ses', 'madde ortamı ister', N, 'ses') +
      kart(145, 296, 'Elektrik', 'yüklerin hareketi', M, 'elk'));

    // Şekil: akü zinciri
    const kutu = (x, y, w, ust, alt, renk, id) => `<g class="vek" data-ad="${id}"><rect x="${x}" y="${y}" width="${w}" height="72" rx="12" fill="#fff" stroke="${renk}" stroke-width="3"/>${yz(x + w / 2, y + 31, ust, S, 20, 'middle')}${yz(x + w / 2, y + 58, alt, renk, 19, 'middle')}</g>`;
    const sAku = k.svg(540, 372,
      kutu(10, 140, 140, 'Akü', 'kimyasal', T, 'a1') + kutu(196, 140, 130, 'Kablolar', 'elektrik', M, 'a2') +
      kutu(380, 20, 150, 'Far', 'ışık', '#a16207', 'a3') + kutu(380, 140, 150, 'Radyo', 'ses', N, 'a4') + kutu(380, 260, 150, 'Marş motoru', 'mekanik', G, 'a5') +
      k.ok({ x1: 154, y1: 176, x2: 192, y2: 176, renk: S, kalin: 5 }) +
      k.ok({ x1: 330, y1: 160, x2: 376, y2: 70, renk: S, kalin: 5 }) + k.ok({ x1: 330, y1: 176, x2: 376, y2: 176, renk: S, kalin: 5 }) + k.ok({ x1: 330, y1: 192, x2: 376, y2: 282, renk: S, kalin: 5 }) +
      `<g class="vek" data-ad="a6">${yz(270, 356, 'Her dönüşümde bir miktar ısı açığa çıkar.', '#c2410c', 19, 'middle')}</g>`);

    // Şekil: şarjlı matkap
    const sMatkap = k.svg(460, 330, kutu(30, 14, 400, 'Batarya', 'şarj edilmiş', T, 'm1') + kutu(30, 128, 400, 'Elektrik motoru', 'akım geçince döner', M, 'm2') + kutu(30, 242, 400, 'Matkap ucu', 'dönerek duvarı deler', G, 'm3') +
      k.ok({ x1: 230, y1: 90, x2: 230, y2: 124, renk: S, kalin: 5 }) + k.ok({ x1: 230, y1: 204, x2: 230, y2: 238, renk: S, kalin: 5 }));

    // Şekil: havai fişek ve iki gözlemci
    const sFisek = k.svg(560, 250,
      `<line x1="40" y1="150" x2="530" y2="150" stroke="#6b7d76" stroke-width="3"/>` +
      `<g class="vek" data-ad="pat"><circle cx="60" cy="150" r="16" fill="#e9a774" stroke="${T}" stroke-width="3"/>${yz(60, 110, 'patlama', T, 20, 'middle')}</g>` +
      `<g class="vek" data-ad="ali"><circle cx="210" cy="150" r="11" fill="${N}"/>${yz(210, 110, 'Ali', N, 22, 'middle')}${yz(135, 190, '340 m', S, 20, 'middle')}</g>` +
      `<g class="vek" data-ad="can"><circle cx="510" cy="150" r="11" fill="${G}"/>${yz(510, 110, 'Can', G, 22, 'middle')}${yz(285, 226, '1020 m', S, 20, 'middle')}</g>` +
      `<line x1="60" y1="168" x2="60" y2="236" stroke="#6b7d76" stroke-width="2" stroke-dasharray="6 5"/><line x1="210" y1="168" x2="210" y2="200" stroke="#6b7d76" stroke-width="2" stroke-dasharray="6 5"/><line x1="510" y1="168" x2="510" y2="236" stroke="#6b7d76" stroke-width="2" stroke-dasharray="6 5"/>`);

    // Şekil: nükleer santral
    const sSantral = k.svg(460, 330, kutu(30, 14, 400, 'Reaktör', 'çekirdekler bölünür, su kaynar', K, 'r1') + kutu(30, 128, 400, 'Türbin', 'buhar türbini döndürür', G, 'r2') + kutu(30, 242, 400, 'Jeneratör', 'dönen türbin jeneratörü çevirir', M, 'r3') +
      k.ok({ x1: 230, y1: 90, x2: 230, y2: 124, renk: S, kalin: 5 }) + k.ok({ x1: 230, y1: 204, x2: 230, y2: 238, renk: S, kalin: 5 }));

    return [
      k.kapak({ etiket: '10. SINIF FİZİK, ENERJİ', baslik: 'Enerji biçimleri.', vurgu: 'Enerji kılık değiştirir.', aciklama: 'Mekanik, kimyasal, nükleer, ısı, ışık, ses ve elektrik. Özellikleri, benzerlikleri, farkları ve birbirine dönüşümleri. Ders kitabı 2.2, sayfa 109-120.' }),
      k.konu({
        etiket: 'GENEL BAKIŞ', kod: 'FİZ.10.2.3', baslik: 'Yedi enerji biçimi', sekil: sYedi,
        maddeler: [
          'Evdeki cihazların çoğu elektrikle çalışır ama verdikleri enerji farklıdır: ütü ısıtır, lamba aydınlatır, hoparlör ses verir.',
          { metin: 'Ders kitabı yedi enerji biçimini inceler: mekanik, kimyasal, nükleer, ısı, ışık, ses ve elektrik.', vurgu: 'mek,kim,nuk,isi,isik,ses,elk' },
          'Ortak özellikleri: hepsinin birimi joule’dür, hepsi bir kaynaktan elde edilir ve birbirine dönüşebilir.',
          'Farkları: nasıl oluştukları, nasıl taşındıkları, nasıl depolandıkları ve nerede kullanıldıkları.',
        ],
      }),
      k.konu({
        etiket: 'ÖZELLİKLER 1', kod: 'FİZ.10.2.3', baslik: 'Mekanik, kimyasal, nükleer', sekil: sYedi,
        maddeler: [
          { metin: '<b>Mekanik enerji:</b> cismin hareketinden gelen kinetik enerji ile konumundan gelen potansiyel enerjinin toplamıdır. Örnek: barajda biriken su, kayak yapan sporcu.', vurgu: 'mek' },
          { metin: '<b>Kimyasal enerji:</b> moleküllerin bağlarında depolanır, kimyasal tepkimeyle açığa çıkar. Örnek: pil, akü, besinler, yakıtlar.', vurgu: 'kim' },
          { metin: '<b>Nükleer enerji:</b> atom çekirdeğinden elde edilir. Güneş’te hafif çekirdekler birleşir, santrallerde uranyum gibi ağır çekirdekler bölünür.', vurgu: 'nuk' },
        ],
      }),
      k.konu({
        etiket: 'ÖZELLİKLER 2', kod: 'FİZ.10.2.3', baslik: 'Isı, ışık, ses, elektrik', sekil: sYedi,
        maddeler: [
          { metin: '<b>Isı:</b> sıcaklıkları farklı maddeler arasında aktarılan enerjidir. Sıcak olandan soğuk olana geçer.', vurgu: 'isi' },
          { metin: '<b>Işık:</b> bir kaynaktan çıkar, dalgalar hâlinde yayılır. Boşlukta da yayılır.', vurgu: 'isik' },
          { metin: '<b>Ses:</b> moleküllerin titreşmesiyle oluşur. Katı, sıvı ya da gaz bir ortam ister; boşlukta yayılmaz.', vurgu: 'ses' },
          { metin: '<b>Elektrik enerjisi:</b> iletkendeki yüklerin hareketiyle ortaya çıkar. Başka biçimlere kolay dönüştüğü için en çok kullanılan biçimdir.', vurgu: 'elk' },
        ],
      }),
      k.soru({
        etiket: 'EŞLEŞTİR', kod: 'FİZ.10.2.3', baslik: 'Hangi enerji biçimi?',
        baglam: 'Tablodaki her özellik bir enerji biçimini anlatıyor.',
        tablo: { basliklar: ['Özellik', 'Enerji biçimi'], doldur: 0, satirlar: [
          ['Pil ve akülerde depolanır.', 'Kimyasal'],
          ['Atom çekirdeğinin bölünmesiyle açığa çıkar.', 'Nükleer'],
          ['Boşlukta yayılmaz.', 'Ses'],
          ['Sıcaklık farkı nedeniyle aktarılır.', 'Isı'],
          ['Kinetik ve potansiyel enerjinin toplamıdır.', 'Mekanik'],
          ['Güneş’ten Dünya’ya boşluktan geçerek ulaşır.', 'Işık'],
        ] },
        maddeler: [
          { metin: 'Her özelliğin karşısına enerji biçimini yazınız.', puan: '6 puan', cevap: 'Anahtar sözcükler: depolanır, çekirdek, ortam, sıcaklık farkı, hareket ve konum, boşluk.' },
          { metin: 'Bu altı enerji biçiminin ortak iki özelliğini yazınız.', puan: '4 puan', cevap: 'Hepsinin birimi joule’dür. Hepsi başka enerji biçimlerine dönüşebilir.' },
        ],
      }),
      k.konu({
        etiket: 'DÖNÜŞÜM', kod: 'FİZ.10.2.3', baslik: 'Enerji kılık değiştirir', sekil: sAku,
        maddeler: [
          { metin: 'Otomobil aküsü kimyasal enerji depolar. Devre kapanınca bu enerji elektrik enerjisine dönüşür.', vurgu: 'a1,a2' },
          { metin: 'Elektrik enerjisi farda ışığa, radyoda sese, marş motorunda mekanik enerjiye dönüşür.', vurgu: 'a3,a4,a5' },
          'Dönüşümde bir enerji biçimi azalırken başka bir enerji biçimi artar.',
          { metin: 'Her dönüşümde enerjinin bir kısmı istenmeyen biçimlere, çoğunlukla ısıya dönüşür. Buna enerji kaybı denir.', vurgu: 'a6' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.10.2.3', baslik: 'Şarjlı matkap', sekil: sMatkap,
        baglam: 'Bir usta, şarjlı matkapla duvarı deliyor. Bir süre sonra matkabın gövdesi ısınıyor ve çalışırken ses çıkarıyor.',
        maddeler: [
          { metin: 'Matkap çalışırken gerçekleşen enerji dönüşümlerini sırasıyla yazınız.', puan: '4 puan', adimlar: [{ metin: 'Batarya kimyasal enerji depolar.', vurgu: 'm1' }, { metin: 'Motor elektrik enerjisini dönme hareketine çevirir.', vurgu: 'm2,m3' }], cevap: 'Kimyasal → elektrik → mekanik (kinetik)' },
          { metin: 'Enerji kaybı hangi enerji biçimlerine dönüşür?', puan: '3 puan', cevap: 'Isı ve ses. Gövdenin ısınması ve çıkan ses istenmeyen dönüşümlerdir.' },
          { metin: 'Bu enerji biçimlerinin bir benzerliğini ve bir farkını yazınız.', puan: '3 puan', cevap: 'Benzerlik: hepsi joule ile ölçülür ve birbirine dönüşür. Fark: kimyasal enerji depolanabilir, ses ve ısı çevreye yayılır.' },
        ],
      }),
      k.soru({
        etiket: 'YORUM', kod: 'FİZ.10.2.3', baslik: 'Havai fişek', sekil: sFisek,
        baglam: 'Bir havai fişek patlıyor. Ali patlamaya 340 m, Can 1020 m uzaklıkta. İkisi de ışığı aynı anda görüyor ama sesi farklı zamanlarda duyuyor. Sesin havadaki hızı 340 m/s’dir.',
        maddeler: [
          { metin: 'Patlamada hangi enerji dönüşümü gerçekleşir?', puan: '3 puan', adimlar: [{ metin: 'Fişeğin içindeki madde kimyasal enerji depolar.', vurgu: 'pat' }], cevap: 'Kimyasal enerji; ışığa, sese ve ısıya dönüşür.' },
          { metin: 'Ses Ali’ye ve Can’a kaç saniyede ulaşır?', puan: '4 puan', adimlar: [{ metin: 'Ali: 340 / 340 = 1 s', vurgu: 'ali' }, { metin: 'Can: 1020 / 340 = 3 s', vurgu: 'can' }], cevap: 'Ali 1 s, Can 3 s sonra duyar. Işık çok hızlı olduğu için ikisi de aynı anda görür.' },
          { metin: 'Aynı patlama Ay’da olsaydı Ali ve Can ne gözlemlerdi?', puan: '3 puan', cevap: 'Işığı görürler, sesi duymazlar. Ses boşlukta yayılmaz, ışık yayılır.' },
        ],
      }),
      k.soru({
        etiket: 'GÜNLÜK HAYAT', kod: 'FİZ.10.2.3', baslik: 'Evdeki dönüşümler',
        baglam: 'Aşağıdaki cihazların hepsi elektrik enerjisiyle çalışıyor.',
        tablo: { basliklar: ['Cihaz', 'Elektrik enerjisi neye dönüşür?'], doldur: 0, satirlar: [
          ['Ütü', 'Isı'],
          ['Mikser', 'Mekanik (kinetik)'],
          ['LED lamba', 'Işık'],
          ['Hoparlör', 'Ses'],
          ['Şarj olan telefon', 'Kimyasal'],
        ] },
        maddeler: [
          { metin: 'Her cihazda elektrik enerjisinin dönüştüğü asıl enerji biçimini yazınız.', puan: '5 puan', cevap: 'Asıl biçim, cihazın yapılış amacıdır.' },
          { metin: 'Mikser uzun süre çalışınca gövdesi ısınıyor. Bu durum neyi gösterir?', puan: '3 puan', cevap: 'Elektrik enerjisinin bir kısmı ısıya dönüşür. Bu enerji kaybıdır; ses de bir kayıptır.' },
          { metin: 'Telefon şarj olurken neden ısınır?', puan: '2 puan', cevap: 'Elektrik enerjisi kimyasal enerjiye dönüşürken bir kısmı ısıya dönüşür.' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.10.2.3', baslik: 'Nükleer santral', sekil: sSantral,
        baglam: 'Bir nükleer santralde enerji sırasıyla reaktör, türbin ve jeneratörden geçerek elektrik enerjisine dönüşür.',
        maddeler: [
          { metin: 'Reaktörde hangi enerji dönüşümü olur?', puan: '3 puan', adimlar: [{ metin: 'Uranyum çekirdekleri bölünür, çok yüksek ısı açığa çıkar.', vurgu: 'r1' }], cevap: 'Nükleer enerji → ısı' },
          { metin: 'Türbinde hangi enerji dönüşümü olur?', puan: '3 puan', adimlar: [{ metin: 'Isı suyu kaynatır, yüksek basınçlı buhar türbini döndürür.', vurgu: 'r2' }], cevap: 'Isı → kinetik (mekanik) enerji' },
          { metin: 'Jeneratörde hangi enerji dönüşümü olur?', puan: '4 puan', adimlar: [{ metin: 'Dönen türbin jeneratörü çevirir.', vurgu: 'r3' }], cevap: 'Mekanik enerji → elektrik enerjisi. Zincir: nükleer → ısı → mekanik → elektrik.' },
        ],
      }),
      k.konu({
        etiket: 'ÖZET', kod: 'FİZ.10.2.3', baslik: 'Yazılıda ne sorulur?', sekil: sYedi,
        maddeler: [
          'Bir özelliği okuyup enerji biçimini bulmak: depolanır, çekirdek, ortam ister, boşlukta yayılır gibi anahtar sözcüklere bak.',
          'Bir cihazdaki dönüşüm zincirini sırayla yazmak. Ok kullan: kimyasal → elektrik → ışık.',
          'Enerji kaybını söylemek: çoğunlukla ısı, bazen ses.',
          'Benzerlik ve fark yazmak. Benzerlik: birim joule, birbirine dönüşür. Fark: oluşma, taşınma, depolanma, kullanım alanı.',
        ],
      }),
      k.kapanis({ baslik: 'Sıradaki ders: kinetik ve potansiyel enerji.', vurgu: 'Abone olmayı unutma.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
