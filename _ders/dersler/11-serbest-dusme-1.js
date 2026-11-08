// 11. sınıf, Kuvvet ve Hareket ünitesinin başı: Serbest düşme (yaklaşık 20 dakikalık video)
// TYMM FİZ.11.1.1 (serbest düşen cisimlerin ivmesi: ivme-hız ilişkisi, genelleme), FİZ.11.1.2 (veri toplar, veri seti oluşturur,
// verilere dayalı açıklar; v-t, a-t, konum-zaman grafikleri). Hava direnci ihmal, g sabit (10 m/s²).
// "Düşey atış" ifadesi kullanılmaz: ilk hızı olan ya da olmayan, yalnız yer çekimi etkisindeki her hareket serbest düşmedir.
module.exports = {
  slug: '11-serbest-dusme-1',
  baslik: '11. Sınıf Fizik: Serbest Düşme',
  dersAdi: '11. sınıf, serbest düşme',
  slaytlar: (k) => {
    const T = '#b06a3b', N = '#1d3b8f', G = '#244f40';
    const yaz = (x, y, t, r = '#173430', a = 'middle', s = 21, w = 700) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${r}" text-anchor="${a}">${t}</text>`;

    // Stroboskop: t = 0,1,2,3 s; düşülen yol 0, 5, 20, 45 m (7 px/m)
    let st = `<line x1="150" y1="20" x2="150" y2="380" stroke="#d9e2da" stroke-width="2" stroke-dasharray="6 6"/>`;
    [[0, 0, 0], [1, 5, 10], [2, 20, 20], [3, 45, 30]].forEach(([t, h, v], i) => {
      const y = 40 + h * 7;
      st += `<g class="vek${i ? ' gizli' : ''}" data-ad="t${t}"><circle cx="150" cy="${y}" r="16" fill="${T}"/>` +
        yaz(185, y + 7, `t = ${t} s`, '#173430', 'start') + yaz(300, y + 7, `v = ${v} m/s`, N, 'start') +
        yaz(115, y + 7, `${h} m`, '#6b7d76', 'end', 19, 600) + `</g>`;
    });
    const s1 = k.svg(440, 400, st);

    // Üç grafik (ilk hızı sıfır): v-t, a-t, düşülen yol-t
    const gv = k.grafik({ x1: 4, y1: 40, w: 360, h: 250, pl: 56, xt: [0, 1, 2, 3, 4], yt: [0, 20, 40], xad: 't (s)', yad: 'v (m/s)' });
    const ga = k.grafik({ x1: 4, y1: 15, w: 360, h: 250, pl: 56, xt: [0, 1, 2, 3, 4], yt: [0, 10], xad: 't (s)', yad: 'a (m/s²)' });
    const gx = k.grafik({ x1: 4, y1: 80, w: 360, h: 250, pl: 56, xt: [0, 1, 2, 3, 4], yt: [0, 40, 80], xad: 't (s)', yad: 'h (m)' });
    const s2 = k.svg(760, 540,
      `<g transform="translate(0,0)">${gv.zemin}${gv.cizgi([[0, 0], [4, 40]], T, 'gv', true)}</g>` +
      `<g transform="translate(400,0)">${ga.zemin}${ga.cizgi([[0, 10], [4, 10]], N, 'ga', true)}</g>` +
      `<g transform="translate(200,280)">${gx.zemin}${gx.egri(t => 5 * t * t, 0, 4, G, 'gx', true)}</g>`);

    // Köprüden bırakılan taş
    const s3 = k.svg(420, 400,
      `<rect x="20" y="70" width="200" height="22" fill="#cfc9ba"/><rect x="40" y="92" width="16" height="250" fill="#cfc9ba"/><rect x="184" y="92" width="16" height="250" fill="#cfc9ba"/>` +
      `<rect x="0" y="342" width="420" height="58" fill="#b9d3e6"/>` +
      `<circle cx="250" cy="70" r="14" fill="${T}"/>` +
      `<line x1="250" y1="92" x2="250" y2="330" stroke="${T}" stroke-width="2" stroke-dasharray="6 7"/>` +
      k.ok({ x1: 330, y1: 342, x2: 330, y2: 76, ad: 'h', renk: G, kalin: 3, etiket: 'h = ?', ex: 30, ey: 140, gizli: true }) +
      yaz(250, 40, 'bırakılıyor', '#6b7d76', 'middle', 20, 600));

    // Yukarı fırlatılan top: v-t (yukarı +), 20 → -20 m/s, 0-4 s
    const gu = k.grafik({ x1: 5, y0: -30, y1: 30, w: 560, h: 400, xt: [0, 1, 2, 3, 4, 5], yt: [-20, -10, 0, 10, 20], xad: 't (s)', yad: 'v (m/s)' });
    const s4 = k.svg(gu.w, gu.h, gu.zemin +
      gu.alan([[0, 0], [0, 20], [2, 0]], '#e9a774', 'up', true, '+20 m') +
      gu.alan([[2, 0], [4, -20], [4, 0]], '#b9c6ec', 'dn', true, '−20 m') +
      gu.cizgi([[0, 20], [4, -20]], T, 'v'));

    return [
      k.kapak({ etiket: '11. SINIF FİZİK, KUVVET VE HAREKET', baslik: 'Serbest düşme.', vurgu: 'Tüy ve çekiç aynı anda.', aciklama: 'Düşen cisimlerin hızı nasıl değişir, ivmeleri neden hep aynıdır ve yukarı atılan bir top neden yine serbest düşer?' }),
      k.konu({
        etiket: 'GÖZLEM', kod: 'FİZ.11.1.1', baslik: 'Hangisi önce yere düşer?',
        maddeler: [
          'Bir kitap ile düz bir kâğıt aynı yükseklikten bırakılırsa kitap çok daha önce düşer.',
          'Aynı kâğıdı buruşturup top yaparsak kitapla neredeyse aynı anda düşer. Kâğıdın kütlesi değişmedi, değişen havanın etkisi.',
          '1971’de Apollo 15 astronotu David Scott, havası olmayan Ay’da bir çekiç ve bir tüyü aynı anda bıraktı. İkisi yere aynı anda düştü.',
          { formul: 'Hava direnci yoksa bütün cisimler aynı ivmeyle düşer.', aciklama: 'Kütle ne olursa olsun.' },
        ],
      }),
      k.konu({
        etiket: 'TANIM', kod: 'FİZ.11.1.1', baslik: 'Serbest düşme nedir?',
        maddeler: [
          'Yalnızca yer çekimi etkisindeki harekete <b>serbest düşme</b> denir. Hava direnci ihmal edilir.',
          'Elden bırakılan taş serbest düşer. İlk hızı sıfırdır.',
          'Yukarı ya da aşağı doğru fırlatılan top da, elden çıktıktan sonra serbest düşer. Yalnızca ilk hızı sıfırdan farklıdır.',
          { formul: 'g ≈ 10 m/s², düşey aşağı ve sabit', aciklama: 'Serbest düşen her cismin ivmesi yer çekimi ivmesidir. Cisim yukarı çıkarken de, inerken de.' },
        ],
      }),
      k.konu({
        etiket: 'İVME VE HIZ', kod: 'FİZ.11.1.1', baslik: 'Her saniye 10 m/s', sekil: s1,
        maddeler: [
          { metin: 'Bırakılan bir topun saniyede bir fotoğrafı çekiliyor.', vurgu: 't0' },
          { metin: '1. saniyenin sonunda hızı 10 m/s.', vurgu: 't0,t1' },
          { metin: '2. saniyenin sonunda 20 m/s, 3. saniyenin sonunda 30 m/s.', vurgu: 't0,t1,t2,t3' },
          { metin: 'Toplar arasındaki mesafe giderek artıyor: top hızlanıyor.', vurgu: 't1,t2,t3' },
          { formul: 'a = Δv / Δt = 10 / 1 = 10 m/s²', aciklama: 'Hız her saniye aynı miktarda artıyor: ivme sabit.' },
        ],
      }),
      k.soru({
        etiket: 'VERİ SETİ', kod: 'FİZ.11.1.2', baslik: 'Düşen topun tablosu',
        baglam: 'Yüksek bir yerden bırakılan topun hızı her saniye ölçülüyor. Hava direnci yok, g = 10 m/s².',
        tablo: { basliklar: ['t (s)', 'v (m/s)', 'Toplam düşülen yol (m)'], doldur: 1, satirlar: [['0', '0', '0'], ['1', '10', '5'], ['2', '20', '20'], ['3', '30', '45'], ['4', '40', '80']] },
        maddeler: [
          { metin: 'Hız her saniye kaç m/s artıyor? Topun ivmesi kaçtır?', puan: '2 puan', cevap: 'Her saniye 10 m/s artıyor: a = 10 m/s².' },
          { metin: 'Ortalama hız = (ilk hız + son hız) / 2 bağıntısını kullanarak toplam düşülen yol sütununu doldurunuz.', puan: '5 puan', adimlar: ['Örnek, ilk 2 saniye: ortalama hız (0 + 20) / 2 = 10 m/s, yol 10 · 2 = 20 m'] },
          { metin: 'Her bir saniyede düşülen yollar arasında nasıl bir örüntü var?', puan: '3 puan', adimlar: ['1. saniye 5 m, 2. saniye 15 m, 3. saniye 25 m, 4. saniye 35 m'], cevap: 'Her saniye bir öncekinden 10 m daha fazla yol alınıyor.' },
        ],
      }),
      k.konu({
        etiket: 'GRAFİKLER', kod: 'FİZ.11.1.2', baslik: 'Serbest düşmenin üç grafiği', sekil: s2,
        maddeler: [
          { metin: '<b>Hız–zaman:</b> Başlangıçtan geçen düz bir çizgi. Eğimi ivmedir: 10 m/s².', vurgu: 'gv' },
          { metin: '<b>İvme–zaman:</b> Yatay bir çizgi. İvme hiç değişmiyor.', vurgu: 'gv,ga' },
          { metin: '<b>Düşülen yol–zaman:</b> Giderek dikleşen bir eğri. Cisim her saniye daha çok yol alıyor.', vurgu: 'gv,ga,gx' },
          { formul: 'Hız–zaman grafiğinin altındaki alan = yer değiştirme', aciklama: 'İlk 4 saniye: ½ · 4 · 40 = 80 m. Tablodaki değerin aynısı.', vurgu: 'gv' },
        ],
      }),
      k.konu({
        etiket: 'MATEMATİKSEL MODEL', kod: 'FİZ.11.1.2', baslik: 'Bırakılan cisim için iki bağıntı',
        maddeler: [
          { formul: 'v = g · t', aciklama: 'Hız zamanla doğru orantılı artar. 3 s sonra: 10 · 3 = 30 m/s' },
          { formul: 'h = ½ · g · t²', aciklama: 'Düşülen yol zamanın karesiyle artar. 3 s sonunda: ½ · 10 · 9 = 45 m' },
          'Süre iki katına çıkınca hız iki katına, düşülen yol dört katına çıkar.',
          'İlk hızla fırlatılan cisimde yönleri dikkatle seçmek gerekir. Yukarıyı artı alırsak: v = v₀ − g · t',
        ],
      }),
      k.soru({
        etiket: 'HESAP', baslik: 'Köprüden bırakılan taş', sekil: s3,
        baglam: 'Bir köprünün üstünden serbest bırakılan taş 3 saniye sonra suya düşüyor. Hava direnci ihmal ediliyor, g = 10 m/s².',
        maddeler: [
          { metin: 'Taş suya kaç m/s hızla çarpar?', puan: '3 puan', adimlar: ['v = g · t = 10 · 3'], cevap: '30 m/s' },
          { metin: 'Köprünün sudan yüksekliği kaç m’dir?', puan: '3 puan', adimlar: [{ metin: 'h = ½ · g · t² = ½ · 10 · 3²', vurgu: 'h' }], cevap: '45 m', cevapVurgu: 'h' },
          { metin: 'Taş son 1 saniyede kaç m yol alır?', puan: '4 puan', adimlar: ['İlk 2 saniyede düşülen yol: ½ · 10 · 2² = 20 m', 'Son 1 saniye: 45 − 20'], cevap: '25 m' },
        ],
      }),
      k.soru({
        etiket: 'İLK HIZLI', baslik: 'Yukarı fırlatılan top',
        baglam: 'Bir top yerden düşey yukarı doğru 20 m/s hızla fırlatılıyor. Hava direnci ihmal ediliyor, g = 10 m/s². Yukarı yön artı alınıyor.',
        maddeler: [
          { metin: 'Top kaç saniyede en yüksek noktaya çıkar?', puan: '3 puan', adimlar: ['Her saniye hızı 10 m/s azalır. En tepede hız sıfırdır.', '0 = 20 − 10 · t'], cevap: 't = 2 s' },
          { metin: 'Top yerden en fazla kaç m yükselir?', puan: '3 puan', adimlar: ['Ortalama hız (20 + 0) / 2 = 10 m/s, süre 2 s'], cevap: '10 · 2 = 20 m' },
          { metin: 'En yüksek noktada topun hızı ve ivmesi nedir?', puan: '2 puan', adimlar: ['Hız bir an için sıfır olur. Ama yer çekimi hâlâ etki ediyor.'], cevap: 'v = 0, a = 10 m/s² ve aşağı yönlü. İvme sıfır değildir.' },
          { metin: 'Top fırlatıldığı yere kaç saniye sonra döner?', puan: '2 puan', adimlar: ['Çıkış ve iniş süreleri eşittir: 2 + 2'], cevap: '4 s' },
        ],
      }),
      k.soru({
        etiket: 'GRAFİK YORUMU', kod: 'FİZ.11.1.2', baslik: 'Aynı topun hız–zaman grafiği', sekil: s4,
        baglam: 'Grafik, yukarı fırlatılan topun 4 saniyelik hareketini gösteriyor. Yukarı yön artıdır.',
        maddeler: [
          { metin: 'Top hangi anda en yüksek noktadadır? Grafikten nasıl anlaşılır?', puan: '3 puan', adimlar: [{ metin: 'Hızın sıfır olduğu an: grafiğin zaman eksenini kestiği yer.', vurgu: 'v' }], cevap: 't = 2 s' },
          { metin: 'Grafiğin eğimi neyi gösterir? Hareket boyunca değişir mi?', puan: '3 puan', adimlar: ['Eğim: (−20 − 20) / 4 = −10 m/s²'], cevap: 'İvmeyi gösterir: 10 m/s², aşağı yönlü ve sabit. Hareketin tamamı serbest düşmedir.' },
          { metin: '0–4 s arasında topun yer değiştirmesi kaç m’dir?', puan: '4 puan', adimlar: [{ metin: 'İlk 2 s: eksenin üstündeki alan +20 m (yukarı).', vurgu: 'v,up' }, { metin: 'Son 2 s: eksenin altındaki alan −20 m (aşağı).', vurgu: 'v,dn' }], cevap: 'Yer değiştirme 0. Top fırlatıldığı yere döndü, toplam yolu ise 40 m.', cevapVurgu: 'up,dn' },
        ],
      }),
      k.konu({
        etiket: 'KISA TEKRAR', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          'Serbest düşme: yalnızca yer çekimi etkisindeki hareket. Hava direnci yok.',
          'Bütün serbest düşen cisimlerin ivmesi aynı: g ≈ 10 m/s², aşağı ve sabit.',
          'Bırakılan cisimde hız her saniye 10 m/s artar. v = g · t, h = ½ · g · t²',
          'Yukarı fırlatılan cisim de serbest düşer. Tepede hızı sıfırdır ama ivmesi yine 10 m/s², aşağı.',
        ],
      }),
      k.kapanis({ baslik: 'Serbest düşme tamam.', vurgu: 'Gelecek ders: iki boyutta hareket.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
