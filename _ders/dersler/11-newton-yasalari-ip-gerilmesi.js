// 11. sınıf, Kuvvet ve Hareket: Newton’ın hareket yasaları (yaklaşık 20 dakikalık video)
// Akış: üç yasa toplu → serbest cisim diyagramı → temel yasa örnekleri ve ip gerilmeleri → etki-tepki (kütle çekimi, masadaki kitap, yan yana itilen kutular).
// TYMM FİZ.11.1.4 (Newton’ın hareket yasaları) ve FİZ.11.1.5 (serbest cisim diyagramıyla yorum).
// Sınırlama: sabit ivmeli hareket, aynı ivmeli bağlı cisimler; sürtünme yok (FİZ.11.1.6). g = 10 m/s².
module.exports = {
  slug: '11-newton-yasalari-ip-gerilmesi',
  baslik: '11. Sınıf Fizik: Newton’ın Hareket Yasaları, İp Gerilmesi ve Etki-Tepki',
  dersAdi: '11. sınıf, Newton’ın hareket yasaları',
  slaytlar: (k) => {
    const G = '#244f40', N = '#1d3b8f', T = '#b06a3b', F = '#7a3e9d', V = k.V;
    const yaz = (x, y, t, r = '#173430', a = 'middle', s = 22, w = 700) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${r}" text-anchor="${a}">${t}</text>`;
    const gz = (ad, ic) => `<g class="vek gizli" data-ad="${ad}">${ic}</g>`;
    const zemin = (x1, x2, y) => `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="14" fill="#cfc9ba"/>`;
    const tavan = (x1, x2) => `<rect x="${x1}" y="20" width="${x2 - x1}" height="16" fill="#cfc9ba"/>`;
    const ip = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7d76" stroke-width="3"/>`;

    // Serbest cisim diyagramı: iple çekilen kutu ve ayrılmış hâli
    const sS = k.svg(560, 400,
      zemin(10, 250, 260) + k.kutu(90, 230, 60, '') + ip(120, 230, 240, 230) + yaz(240, 215, 'ip', '#6b7d76', 'end', 20) +
      yaz(130, 310, 'Durum', '#6b7d76', 'middle', 18, 600) +
      `<line x1="275" y1="40" x2="275" y2="380" stroke="#d9e2da" stroke-width="2" stroke-dasharray="6 6"/>` +
      k.kutu(410, 220, 64, '') +
      k.ok({ x1: 410, y1: 220, x2: 410, y2: 345, ad: 'G', renk: G, etiket: 'G', ex: 24, ey: 0, gizli: true }) +
      k.ok({ x1: 410, y1: 220, x2: 410, y2: 95, ad: 'N', renk: N, etiket: 'N', ex: 24, ey: 14, gizli: true }) +
      k.ok({ x1: 442, y1: 220, x2: 545, y2: 220, ad: 'T', renk: T, etiket: 'T', ex: -10, ey: -16, gizli: true }) +
      yaz(410, 392, 'Serbest cisim diyagramı', '#6b7d76', 'middle', 18, 600));

    // Temel yasa örneği: 5 kg kutu, 40 N sağa, 15 N sola (4 px/N yatayda)
    const sT = k.svg(520, 420,
      zemin(20, 500, 250) + k.kutu(260, 215, 70, '') + yaz(302, 172, '5 kg', '#173430', 'start') +
      k.ok({ x1: 295, y1: 215, x2: 455, y2: 215, ad: 'F1', renk: T, etiket: '40 N', ex: -10, ey: -16 }) +
      k.ok({ x1: 225, y1: 215, x2: 165, y2: 215, ad: 'F2', renk: F, etiket: '15 N', ex: 0, ey: -16 }) +
      k.ok({ x1: 260, y1: 215, x2: 260, y2: 50, ad: 'N', renk: N, etiket: 'N', ex: 24, ey: 14, gizli: true }) +
      k.ok({ x1: 260, y1: 215, x2: 260, y2: 380, ad: 'G', renk: G, etiket: 'G', ex: 24, ey: 0, gizli: true }) +
      yaz(500, 292, 'sürtünmesiz zemin', '#6b7d76', 'end', 18, 600));

    // İp gerilmesi: tavana asılı kutu
    const s4 = k.svg(340, 380,
      tavan(40, 300) + ip(170, 36, 170, 170) + k.kutu(170, 205, 70, '') +
      k.ok({ x1: 182, y1: 205, x2: 182, y2: 75, ad: 'T', renk: T, etiket: 'T', ex: 24, ey: 14, gizli: true }) +
      k.ok({ x1: 170, y1: 205, x2: 170, y2: 335, ad: 'G', renk: G, etiket: 'G', ex: 26, ey: 0, gizli: true }));

    // Üst üste asılı iki cisim
    const s5 = k.svg(340, 400,
      tavan(40, 300) + ip(170, 36, 170, 120) + k.kutu(170, 150, 60, '') + ip(170, 180, 170, 250) + k.kutu(170, 285, 70, '') +
      yaz(190, 85, '1. ip', '#6b7d76', 'start', 20) + yaz(190, 222, '2. ip', '#6b7d76', 'start', 20) +
      yaz(215, 158, '2 kg', '#173430', 'start') + yaz(220, 293, '3 kg', '#173430', 'start') +
      k.ok({ x1: 150, y1: 250, x2: 150, y2: 196, ad: 'T2', renk: T, kalin: 4, etiket: 'T<sub>2</sub>', ex: -26, ey: 14, gizli: true }) +
      k.ok({ x1: 170, y1: 320, x2: 170, y2: 365, ad: 'G2', renk: G, kalin: 4, etiket: '30 N', ex: 42, ey: -4, gizli: true }));

    // Yatay düzlemde iple bağlı iki kutu (A 2 kg, B 3 kg, F = 20 N B’ye sağa)
    const s6 = k.svg(460, 230,
      zemin(10, 450, 170) +
      k.kutu(95, 135, 70, 'A') + k.kutu(285, 135, 70, 'B') + ip(130, 135, 250, 135) +
      k.ok({ x1: 320, y1: 135, x2: 440, y2: 135, ad: 'F', renk: F, etiket: '20 N', ex: -20, ey: -16 }) +
      k.ok({ x1: 130, y1: 108, x2: 178, y2: 108, ad: 'TA', renk: T, kalin: 4, etiket: 'T', ex: -18, ey: -14, gizli: true }) +
      k.ok({ x1: 250, y1: 108, x2: 202, y2: 108, ad: 'TB', renk: T, kalin: 4, etiket: 'T', ex: 18, ey: -14, gizli: true }) +
      yaz(95, 214, '2 kg') + yaz(285, 214, '3 kg'));

    // Makara: masadaki 3 kg, sarkan 2 kg
    const s7 = k.svg(470, 430,
      `<rect x="10" y="170" width="320" height="16" fill="#cfc9ba"/><rect x="26" y="186" width="12" height="214" fill="#cfc9ba"/><rect x="302" y="186" width="12" height="214" fill="#cfc9ba"/>` +
      `<line x1="342" y1="152" x2="322" y2="172" stroke="#6b7d76" stroke-width="5"/><circle cx="342" cy="152" r="18" fill="#fff" stroke="#173430" stroke-width="3"/><circle cx="342" cy="152" r="4" fill="#173430"/>` +
      k.kutu(140, 135, 70, '3 kg') + ip(175, 134, 342, 134) + ip(360, 152, 360, 268) + k.kutu(360, 300, 64, '2 kg') +
      k.ok({ x1: 175, y1: 108, x2: 223, y2: 108, ad: 'TA', renk: T, kalin: 4, etiket: 'T', ex: 16, ey: 8, gizli: true }) +
      k.ok({ x1: 100, y1: 70, x2: 180, y2: 70, ad: 'aA', renk: F, kalin: 3, etiket: 'a', ex: 16, ey: 8, gizli: true }) +
      k.ok({ x1: 380, y1: 268, x2: 380, y2: 220, ad: 'TB', renk: T, kalin: 4, etiket: 'T', ex: 16, ey: 14, gizli: true }) +
      k.ok({ x1: 360, y1: 332, x2: 360, y2: 412, ad: 'GB', renk: G, kalin: 4, etiket: 'G', ex: 22, ey: -6, gizli: true }) +
      k.ok({ x1: 450, y1: 250, x2: 450, y2: 330, ad: 'aB', renk: F, kalin: 3, etiket: 'a', ex: -16, ey: 30, gizli: true }));

    // Kütle çekimi: Dünya ve elma
    const sK = k.svg(400, 420,
      `<circle cx="200" cy="580" r="280" fill="#9fc5b4" stroke="#244f40" stroke-width="3"/>` + yaz(200, 395, 'Dünya', '#244f40', 'middle', 24, 800) +
      `<circle cx="200" cy="80" r="24" fill="#c4473a"/><path d="M200 57 q8 -14 20 -10" stroke="#244f40" stroke-width="4" fill="none"/>` + yaz(240, 88, 'elma', '#6b7d76', 'start', 20, 600) +
      k.ok({ x1: 188, y1: 104, x2: 188, y2: 210, ad: 'de', renk: G, kalin: 5, etiket: 'F', ex: -22, ey: 0, gizli: true }) +
      gz('de', yaz(170, 160, 'Dünya’nın elmaya', G, 'end', 17, 600)) +
      k.ok({ x1: 212, y1: 330, x2: 212, y2: 224, ad: 'ed', renk: T, kalin: 5, etiket: 'F', ex: 22, ey: 14, gizli: true }) +
      gz('ed', yaz(232, 280, 'elmanın Dünya’ya', T, 'start', 17, 600)));

    // Masadaki kitap: G, N ve tepkileri
    const sM = k.svg(440, 370, `<g transform="translate(-40,-100)">` +
      `<rect x="40" y="420" width="440" height="50" fill="#d8cfb8"/>` + yaz(470, 455, 'Dünya', '#6b7d76', 'end', 20, 800) +
      `<rect x="60" y="230" width="300" height="18" fill="#cfc9ba"/><rect x="80" y="248" width="12" height="172" fill="#cfc9ba"/><rect x="328" y="248" width="12" height="172" fill="#cfc9ba"/>` +
      yaz(104, 330, 'masa', '#6b7d76', 'start', 18, 600) +
      `<rect x="160" y="192" width="100" height="38" rx="4" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/>` + yaz(150, 218, 'kitap', '#173430', 'end', 18) +
      k.ok({ x1: 188, y1: 211, x2: 188, y2: 305, ad: 'G', renk: G, kalin: 5, etiket: 'G', ex: -22, ey: 0, gizli: true }) +
      k.ok({ x1: 232, y1: 211, x2: 232, y2: 117, ad: 'N', renk: N, kalin: 5, etiket: 'N', ex: 22, ey: 14, gizli: true }) +
      k.ok({ x1: 252, y1: 240, x2: 252, y2: 334, ad: 'N2', renk: '#5b6fb5', kalin: 5, etiket: 'N′', ex: 24, ey: 0, gizli: true }) +
      k.ok({ x1: 420, y1: 420, x2: 420, y2: 326, ad: 'G2', renk: '#4f8a73', kalin: 5, etiket: 'G′', ex: 26, ey: 14, gizli: true }) +
      gz('G2', yaz(420, 300, 'Dünya’ya', '#4f8a73', 'middle', 17, 700)) + gz('N2', yaz(268, 362, 'masaya', '#5b6fb5', 'start', 17, 700)) + `</g>`);

    // Yan yana itilen iki kutu: A 2 kg, B 3 kg, F = 20 N A’ya sağa
    const sY = k.svg(360, 260,
      zemin(10, 350, 190) + k.kutu(150, 158, 64, 'A') + k.kutu(224, 148, 84, 'B') +
      k.ok({ x1: 16, y1: 158, x2: 114, y2: 158, ad: 'F', renk: F, etiket: '20 N', ex: -50, ey: -16 }) +
      k.ok({ x1: 224, y1: 80, x2: 283, y2: 80, ad: 'AB', renk: T, kalin: 4, etiket: 'F<sub>AB</sub>', ex: -30, ey: -14, gizli: true }) +
      k.ok({ x1: 150, y1: 80, x2: 91, y2: 80, ad: 'BA', renk: N, kalin: 4, etiket: 'F<sub>BA</sub>', ex: 29, ey: -14, gizli: true }) +
      gz('AB', yaz(262, 32, 'B’ye etki eder', T, 'middle', 17, 600)) + gz('BA', yaz(112, 32, 'A’ya etki eder', N, 'middle', 17, 600)) +
      yaz(150, 234, '2 kg') + yaz(224, 234, '3 kg'));

    return [
      k.kapak({ etiket: '11. SINIF FİZİK, KUVVET VE HAREKET', baslik: 'Newton’ın hareket yasaları.', vurgu: 'Üç yasa, ip ve etki-tepki.', aciklama: 'Önce üç yasa, sonra serbest cisim diyagramıyla temel yasa ve ip gerilmeleri, en son etki-tepki örnekleri.' }),
      k.konu({
        etiket: 'ÜÇ YASA', kod: 'FİZ.11.1.4', baslik: 'Newton’ın üç hareket yasası',
        giris: 'Dinamik soruları bu üç yasayla çözülür.',
        maddeler: [
          { formul: '1. Eylemsizlik: ΣF = 0 ise a = 0', aciklama: 'Net kuvvet sıfırsa duran cisim durur, hareket eden sabit hızla doğrusal gider. Otobüs fren yapınca öne savrulmamız bundandır.' },
          { formul: '2. Temel yasa: ΣF = m · a', aciklama: 'Net kuvvet, kendi yönünde ivme kazandırır. Kuvvet artarsa ivme artar, kütle artarsa ivme azalır. 1 N = 1 kg · m/s²' },
          { formul: `3. Etki-tepki: ${V('F<sub>AB</sub>')} = −${V('F<sub>BA</sub>')}`, aciklama: 'F<sub>AB</sub>: A’nın B’ye uyguladığı kuvvet. A, B’ye kuvvet uygularsa B de A’ya eşit büyüklükte, zıt yönde kuvvet uygular. Bu iki kuvvet farklı cisimlere etki eder.' },
        ],
      }),
      k.konu({
        etiket: 'SERBEST CİSİM DİYAGRAMI', kod: 'FİZ.11.1.5', baslik: 'Önce cismi ayır, kuvvetleri çiz', sekil: sS,
        maddeler: [
          'Kuvvetleri doğru yazmak için cismi çevresinden ayırıp tek başına çizeriz.',
          { metin: 'Dünya cismi aşağı çeker: ağırlık, G = m · g.', vurgu: 'G' },
          { metin: 'Yüzey cismi dik olarak iter: yüzeyin tepki kuvveti, N. (N, G’nin 3. yasa eşi değildir.)', vurgu: 'G,N' },
          { metin: 'İp cismi kendi doğrultusunda çeker: gerilme kuvveti, T.', vurgu: 'G,N,T' },
          { formul: 'Diyagram → ΣF = m · a', aciklama: 'Yalnızca cisme etki eden kuvvetler çizilir. Sonra her doğrultu için 2. yasa ayrı ayrı yazılır.', vurgu: 'G,N,T' },
        ],
      }),
      k.soru({
        etiket: 'TEMEL YASA', kod: 'FİZ.11.1.4', baslik: 'İki kuvvetle çekilen kutu', sekil: sT,
        baglam: 'Sürtünmesiz yatay düzlemdeki 5 kg’lık kutuya şekildeki iki yatay kuvvet uygulanıyor. g = 10 m/s².',
        maddeler: [
          { metin: 'Kutunun serbest cisim diyagramındaki kuvvetler nelerdir?', puan: '3 puan', adimlar: ['Yatayda: 40 N sağa, 15 N sola.', { metin: 'Düşeyde: ağırlık G = 5 · 10 = 50 N aşağı, zeminin tepki kuvveti N yukarı.', vurgu: 'N,G' }], cevap: 'Dört kuvvet: 40 N, 15 N, G ve N', cevapVurgu: 'N,G' },
          { metin: 'Zeminin tepki kuvveti kaç N’dur?', puan: '3 puan', adimlar: ['Kutu düşeyde hareket etmiyor: düşeyde ΣF = 0 (1. yasa).'], cevap: 'N = G = 50 N', cevapVurgu: 'N,G' },
          { metin: 'Kutunun ivmesi kaç m/s²’dir?', puan: '4 puan', adimlar: ['ΣF = 40 − 15 = 25 N, sağa', 'a = ΣF / m = 25 / 5'], cevap: '5 m/s², sağa' },
        ],
      }),
      k.konu({
        etiket: 'İP GERİLMESİ', kod: 'FİZ.11.1.5', baslik: 'İp yalnızca çeker', sekil: s4,
        maddeler: [
          { metin: 'İpin cisme uyguladığı kuvvete <b>gerilme kuvveti</b> (T) denir. İp doğrultusundadır ve cisimden ipe doğru yönelir.', vurgu: 'T' },
          'Kütlesi önemsiz bir ipte gerilme ipin her noktasında aynıdır. Sürtünmesiz ve ağırlıksız bir makaradan geçince yönü değişir, büyüklüğü değişmez.',
          { metin: 'Asılı cisim dengedeyse (durgun ya da sabit hızlı) T = G.', vurgu: 'T,G' },
          { metin: 'İvme yukarı yönlüyse T > G, aşağı yönlüyse T < G.', vurgu: 'T,G' },
          { formul: 'T − G = m · a', aciklama: 'Yukarı yön artı. İpteki gerilme her zaman ağırlığa eşit değildir, ivmeye bağlıdır.', vurgu: 'T,G' },
        ],
      }),
      k.soru({
        etiket: 'ASILI CİSİMLER', kod: 'FİZ.11.1.5', baslik: 'Üst üste iki cisim', sekil: s5,
        baglam: 'Tavana bağlı 1. ipin ucunda 2 kg’lık cisim, onun altında 2. iple bağlı 3 kg’lık cisim asılıdır. İplerin kütlesi önemsiz, g = 10 m/s².',
        maddeler: [
          { metin: 'Sistem dengedeyken 2. ipteki gerilme kaç N’dur?', puan: '2 puan', adimlar: ['2. ip yalnızca 3 kg’lık cismi taşır: T<sub>2</sub> = 3 · 10'], cevap: '30 N' },
          { metin: 'Sistem dengedeyken 1. ipteki gerilme kaç N’dur?', puan: '3 puan', adimlar: ['1. ip iki cismi birlikte taşır: T<sub>1</sub> = (2 + 3) · 10'], cevap: '50 N' },
          { metin: 'Düzenek, 2 m/s²’lik ivmeyle yukarı doğru hızlanan bir asansörün tavanına asılı olsaydı iki ipteki gerilme kaç N olurdu?', puan: '5 puan', adimlar: ['Cisimler asansörle birlikte 2 m/s²’lik ivmeyle yukarı hızlanır.', { metin: '3 kg’lık cisim için: T<sub>2</sub> − 30 = 3 · 2, T<sub>2</sub> = 36 N', vurgu: 'T2,G2' }, 'Bütün sistem için: T<sub>1</sub> − 50 = 5 · 2'], cevap: 'T<sub>1</sub> = 60 N, T<sub>2</sub> = 36 N', cevapVurgu: 'T2,G2' },
        ],
      }),
      k.soru({
        etiket: 'BAĞLI CİSİMLER', kod: 'FİZ.11.1.5', baslik: 'İple bağlı iki kutu', sekil: s6,
        baglam: 'Sürtünmesiz yatay düzlemde A ve B kutuları bir iple bağlıdır. B’ye 20 N büyüklüğünde yatay kuvvet uygulanıyor.',
        maddeler: [
          { metin: 'Sistemin ivmesi kaç m/s²’dir?', puan: '4 puan', adimlar: ['İki kutuyu tek cisim gibi düşün. İpin iki ucundaki T’ler iç kuvvettir, hesaba girmez.', 'a = 20 / (2 + 3)'], cevap: '4 m/s², sağa' },
          { metin: 'İpteki gerilme kaç N’dur?', puan: '6 puan', adimlar: [{ metin: 'A’yı tek başına incele. Onu yatayda yalnızca ip çeker: T = 2 · 4', vurgu: 'TA' }, { metin: 'Kontrol, B için: 20 − T = 3 · 4, T = 8 N', vurgu: 'TA,TB' }], cevap: '8 N', cevapVurgu: 'TA,TB' },
        ],
      }),
      k.soru({
        etiket: 'MAKARA', kod: 'FİZ.11.1.5', baslik: 'Masadan sarkan cisim', sekil: s7,
        baglam: 'Sürtünmesiz yatay masadaki 3 kg’lık kutu, sürtünmesiz makaradan geçen iple 2 kg’lık sarkan cisme bağlıdır. Sistem serbest bırakılıyor. g = 10 m/s².',
        maddeler: [
          { metin: 'Sistemin ivmesi kaç m/s²’dir?', puan: '3 puan', adimlar: ['Sistemi hareket ettiren kuvvet sarkan cismin ağırlığıdır: 2 · 10 = 20 N', 'a = 20 / (3 + 2)'], cevap: '4 m/s²', cevapVurgu: 'aA,aB' },
          { metin: 'İpteki gerilme kaç N’dur?', puan: '4 puan', adimlar: [{ metin: 'Masadaki kutuyu yatayda yalnızca ip çeker: T = 3 · 4', vurgu: 'TA,aA' }], cevap: '12 N', cevapVurgu: 'TA' },
          { metin: 'Sarkan cisim için sonucu kontrol et. İpteki gerilme neden 20 N değildir?', puan: '3 puan', adimlar: [{ metin: 'Sarkan cisim: G − T = m · a, 20 − T = 2 · 4, T = 12 N', vurgu: 'TB,GB,aB' }], cevap: 'Sarkan cismin ivmesi aşağı yönlü. Bu yüzden T < G.', cevapVurgu: 'TB,GB' },
        ],
      }),
      k.konu({
        etiket: 'ETKİ-TEPKİ', kod: 'FİZ.11.1.4', baslik: 'Kuvvetler çift oluşur: kütle çekimi', sekil: sK,
        maddeler: [
          { metin: 'Dünya elmayı aşağı çeker. Bu kuvvet elmanın ağırlığıdır.', vurgu: 'de' },
          { metin: 'Elma da Dünya’yı aynı büyüklükte bir kuvvetle yukarı çeker.', vurgu: 'de,ed' },
          'Dünya da elmaya doğru ivmelenir. Ama kütlesi çok büyük olduğu için bu ivme ölçülemeyecek kadar küçüktür: a = F / m.',
          'Kütle çekimi, mıknatısların birbirini çekmesi, itme, çarpışma: her etkileşimde kuvvetler aynı anda ve çift oluşur.',
          { formul: 'Etki ile tepki: eşit büyüklükte, zıt yönlü, farklı cisimlerde', aciklama: 'Farklı cisimlere etki ettikleri için etki ile tepki birbirini götürmez.', vurgu: 'de,ed' },
        ],
      }),
      k.soru({
        etiket: 'ETKİ-TEPKİ', kod: 'FİZ.11.1.4', baslik: 'Masadaki kitap', sekil: sM,
        baglam: '2 kg’lık bir kitap yatay masanın üstünde durmaktadır. g = 10 m/s².',
        maddeler: [
          { metin: 'Kitaba etki eden kuvvetler nelerdir, büyüklükleri kaç N’dur?', puan: '3 puan', adimlar: [{ metin: 'Dünya kitabı aşağı çeker: G = 2 · 10 = 20 N', vurgu: 'G' }, { metin: 'Masa kitabı yukarı iter: N. Kitap dengede, ΣF = 0.', vurgu: 'G,N' }], cevap: 'G = 20 N aşağı, N = 20 N yukarı', cevapVurgu: 'G,N' },
          { metin: 'Kitabın ağırlığının (G) tepkisi hangi kuvvettir, hangi cisme etki eder?', puan: '2 puan', adimlar: [{ metin: 'Dünya kitabı çekiyorsa kitap da Dünya’yı çeker.', vurgu: 'G,G2' }], cevap: 'G′ = 20 N, yukarı yönlü, Dünya’ya etki eder.', cevapVurgu: 'G,G2' },
          { metin: 'Masanın tepki kuvvetinin (N) eşi hangi kuvvettir, hangi cisme etki eder?', puan: '2 puan', adimlar: [{ metin: 'Masa kitabı itiyorsa kitap da masayı iter.', vurgu: 'N,N2' }], cevap: 'N′ = 20 N, aşağı yönlü, masaya etki eder.', cevapVurgu: 'N,N2' },
          { metin: 'G ile N bir etki-tepki çifti midir?', puan: '3 puan', adimlar: [{ metin: 'İkisi de aynı cisme, kitaba etki ediyor.', vurgu: 'G,N' }], cevap: 'Hayır. Eşit olmalarının sebebi kitabın dengede olmasıdır (1. yasa), 3. yasa değil.', cevapVurgu: 'G,N' },
        ],
      }),
      k.soru({
        etiket: 'ETKİ-TEPKİ', kod: 'FİZ.11.1.4', baslik: 'Yan yana iki kutuyu itmek', sekil: sY,
        baglam: 'Sürtünmesiz yatay düzlemde yan yana duran 2 kg’lık A ve 3 kg’lık B kutularından A’ya 20 N’luk yatay kuvvet uygulanıyor.',
        maddeler: [
          { metin: 'Kutuların ivmesi kaç m/s²’dir?', puan: '2 puan', adimlar: ['İki kutu birlikte hareket eder: a = 20 / (2 + 3)'], cevap: '4 m/s², sağa' },
          { metin: 'A’nın B’ye uyguladığı kuvvet kaç N’dur?', puan: '3 puan', adimlar: [{ metin: 'B’yi yatayda yalnızca A iter: F<sub>AB</sub> = 3 · 4', vurgu: 'AB' }], cevap: '12 N, sağa', cevapVurgu: 'AB' },
          { metin: 'B’nin A’ya uyguladığı kuvvet kaç N’dur? A için kontrol et.', puan: '3 puan', adimlar: [{ metin: '3. yasa: F<sub>BA</sub>, F<sub>AB</sub> ile eşit büyüklükte ve zıt yönlüdür.', vurgu: 'AB,BA' }, { metin: 'Kontrol, A için: 20 − 12 = 2 · 4', vurgu: 'AB,BA' }], cevap: '12 N, sola', cevapVurgu: 'AB,BA' },
          { metin: 'Aynı 20 N’luk kuvvet B’ye sola doğru uygulansaydı kutuların birbirine uyguladığı kuvvet kaç N olurdu?', puan: '2 puan', adimlar: ['İvme yine 4 m/s², bu kez sola. Şimdi B, A’yı iter: 2 · 4'], cevap: '8 N. Temas kuvveti, itilen cismin kütlesine bağlıdır.' },
        ],
      }),
      k.konu({
        etiket: 'KISA TEKRAR', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          '1. yasa: Net kuvvet sıfırsa cismin hızı değişmez.',
          '2. yasa: ΣF = m · a. Önce serbest cisim diyagramı, sonra denklem.',
          'İp yalnızca çeker. Bağlı cisimlerde önce sistemin ivmesi, sonra tek cisimden gerilme bulunur.',
          '3. yasa: Etki ve tepki eşit büyüklükte, zıt yönlü ve farklı cisimler üzerindedir.',
          'Masadaki kitapta G ile N eşittir ama etki-tepki değildir.',
        ],
      }),
      k.kapanis({ baslik: 'Newton’ın yasaları tamam.', vurgu: 'Gelecek ders: sürtünme kuvvetleri.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
