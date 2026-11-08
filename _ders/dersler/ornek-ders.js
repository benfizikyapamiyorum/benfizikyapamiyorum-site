// Örnek ders: altyapının tüm slayt türlerini gösterir. Yeni ders için bu dosyayı kopyala.
module.exports = {
  slug: 'ornek-ders',
  baslik: '9. Sınıf Fizik: Vektörlerde Bileşke (Örnek Ders)',
  dersAdi: '9. sınıf, vektörlerde bileşke',
  slaytlar: (k) => {
    // Şekil 1: dik iki vektör uç uca (70 px = 1 N)
    const s1 = k.svg(440, 380, `
      <line x1="80" y1="330" x2="300" y2="330" stroke="#d9e2da" stroke-width="2"/>
      ${k.ok({ x1: 80, y1: 330, x2: 290, y2: 330, ad: 'F1', etiket: 'F₁ = 3 N', ex: -100, ey: 40 })}
      ${k.ok({ x1: 290, y1: 330, x2: 290, y2: 50, ad: 'F2', renk: '#1d3b8f', etiket: 'F₂ = 4 N', ex: 78, ey: 150 })}
      ${k.ok({ x1: 80, y1: 330, x2: 290, y2: 50, ad: 'R', renk: '#b06a3b', etiket: 'R', ex: -140, ey: 100 })}
      <polyline points="270,330 270,310 290,310" fill="none" stroke="#6b7d76" stroke-width="2"/>`);
    // Şekil 2: koli ve iki ip (30 px = 1 N)
    const s2 = k.svg(420, 380, `
      <rect x="70" y="290" width="60" height="60" rx="6" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/>
      ${k.ok({ x1: 100, y1: 320, x2: 280, y2: 320, ad: 'F1', etiket: '6 N', ex: 36, ey: 10 })}
      ${k.ok({ x1: 100, y1: 320, x2: 100, y2: 80, ad: 'F2', renk: '#1d3b8f', etiket: '8 N', ex: 0, ey: -14 })}
      ${k.ok({ x1: 100, y1: 320, x2: 280, y2: 80, ad: 'R', renk: '#b06a3b', etiket: 'R', ex: 22, ey: -6 })}
      <line x1="100" y1="80" x2="280" y2="80" stroke="#6b7d76" stroke-width="2" stroke-dasharray="7 7"/>
      <line x1="280" y1="320" x2="280" y2="80" stroke="#6b7d76" stroke-width="2" stroke-dasharray="7 7"/>
      <text x="290" y="362" font-size="22" fill="#6b7d76" text-anchor="middle">doğu</text>
      <text x="100" y="40" font-size="22" fill="#6b7d76" text-anchor="middle">kuzey</text>`);
    return [
      k.kapak({ etiket: '9. SINIF FİZİK, ÖRNEK DERS', baslik: 'Vektörlerde bileşke.', vurgu: 'İki kuvvet, tek etki.', aciklama: 'Ekrana dokundukça her adım sırayla açılır. Kalemle doğrudan üstüne yazabilirsin.' }),
      k.konu({
        etiket: 'KONU', baslik: 'Skaler ve vektörel büyüklükler',
        maddeler: [
          '<b>Skaler</b> büyüklük yalnızca sayı ve birimle tam anlatılır: kütle, sıcaklık, zaman.',
          '<b>Vektörel</b> büyüklüğü anlatmak için yön de gerekir: kuvvet, yer değiştirme, hız.',
          'Vektör okla gösterilir. Okun uzunluğu büyüklüğü, ucu yönü gösterir.',
          { formul: 'Bileşke (R)', aciklama: 'Birden fazla vektörün birlikte yaptığı etkiyi tek başına yapan vektör.' },
        ],
      }),
      k.konu({
        etiket: 'KONU', baslik: 'Dik iki vektörün bileşkesi', sekil: s1,
        maddeler: [
          { metin: 'Birinci kuvvet: 3 N, doğuya.', vurgu: 'F1' },
          { metin: 'İkinci kuvvet: 4 N, kuzeye.', vurgu: 'F2' },
          { metin: 'Uç uca ekle: ikinci vektörü birincinin ucundan başlat.', vurgu: 'F1,F2' },
          { formul: 'R² = F₁² + F₂²', aciklama: 'Dik vektörlerde bileşke, dik üçgenin hipotenüsüdür. Burada R = 5 N.', vurgu: 'R' },
        ],
      }),
      k.soru({
        etiket: 'ÖRNEK SORU', baslik: 'İki iple çekilen koli', sekil: s2,
        baglam: 'Yatay bir zemindeki koli iki iple çekiliyor. Birinci ip koliyi doğuya 6 N, ikinci ip kuzeye 8 N büyüklüğünde kuvvetle çekiyor.',
        maddeler: [
          {
            metin: 'İplerin koliye uyguladığı kuvvetlerin bileşkesi kaç N’dur?', puan: '4 puan',
            adimlar: [
              { metin: 'İki kuvvet birbirine dik. Bileşke, kenarları 6 N ve 8 N olan dik üçgenin hipotenüsüdür.', vurgu: 'F1,F2' },
              { metin: 'R² = 6² + 8² = 36 + 64 = 100', vurgu: 'R' },
            ],
            cevap: 'R = 10 N',
          },
          {
            metin: 'Koli bu iki ip varken dengede kalsın diye üçüncü bir ip hangi büyüklükte ve hangi yönde çekmelidir?', puan: '4 puan',
            adimlar: [
              'Dengede kuvvetlerin bileşkesi sıfır olmalıdır.',
              { metin: 'Üçüncü kuvvet, ilk iki kuvvetin bileşkesine eşit büyüklükte ve ona zıt yönde olmalıdır.', vurgu: 'R' },
            ],
            cevap: '10 N, bileşkenin tam tersi yönünde',
          },
        ],
      }),
      k.kapanis(),
    ];
  },
};
