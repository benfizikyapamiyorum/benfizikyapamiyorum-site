// 11. sınıf, Kuvvet ve Hareket: Newton’ın hareket yasaları ve ip gerilmesi (yaklaşık 20 dakikalık video)
// TYMM FİZ.11.1.4 (Newton’ın hareket yasaları) ve FİZ.11.1.5 (serbest cisim diyagramıyla yorum: ip gerilmesi, bağlı cisimler).
// Sınırlama: sabit ivmeli hareket, aynı ivmeli bağlı cisimler; sürtünme yok (sürtünme FİZ.11.1.6). g = 10 m/s².
module.exports = {
  slug: '11-newton-yasalari-ip-gerilmesi',
  baslik: '11. Sınıf Fizik: Newton’ın Hareket Yasaları ve İp Gerilmesi',
  dersAdi: '11. sınıf, Newton’ın yasaları ve ip gerilmesi',
  slaytlar: (k) => {
    const G = '#244f40', N = '#1d3b8f', T = '#b06a3b', F = '#7a3e9d', V = k.V;
    const yaz = (x, y, t, r = '#173430', a = 'middle', s = 22, w = 700) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${r}" text-anchor="${a}">${t}</text>`;
    const zemin = (x1, x2, y) => `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="14" fill="#cfc9ba"/>`;
    const tavan = (x1, x2) => `<rect x="${x1}" y="20" width="${x2 - x1}" height="16" fill="#cfc9ba"/>`;
    const ip = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7d76" stroke-width="3"/>`;

    // 2. yasa: kutu, F ve a
    const s2 = k.svg(460, 290,
      zemin(20, 440, 200) + yaz(440, 240, 'sürtünmesiz zemin', '#6b7d76', 'end', 18, 600) +
      k.kutu(190, 165, 70, 'm') +
      k.ok({ x1: 225, y1: 165, x2: 360, y2: 165, ad: 'F', renk: T, etiket: 'F', ex: 0, ey: -16 }) +
      k.ok({ x1: 150, y1: 92, x2: 240, y2: 92, ad: 'a', renk: F, kalin: 3, etiket: 'a', ex: 18, ey: 8, gizli: true }));

    // 3. yasa: A ve B kutuları, el A’yı itiyor
    const s3 = k.svg(460, 290,
      zemin(20, 440, 200) +
      k.kutu(170, 165, 70, 'A') + k.kutu(240, 165, 70, 'B') +
      k.ok({ x1: 40, y1: 165, x2: 132, y2: 165, ad: 'itme', renk: '#6b7d76', kalin: 4, etiket: 'itme', ex: -50, ey: -16 }) +
      k.ok({ x1: 240, y1: 112, x2: 335, y2: 112, ad: 'AB', renk: T, kalin: 4, etiket: 'F<sub>AB</sub>', ex: -48, ey: -14, gizli: true }) +
      k.ok({ x1: 170, y1: 112, x2: 75, y2: 112, ad: 'BA', renk: N, kalin: 4, etiket: 'F<sub>BA</sub>', ex: 48, ey: -14, gizli: true }) +
      `<g class="vek gizli" data-ad="AB">${yaz(287, 56, 'B’ye etki eder', T, 'middle', 17, 600)}</g><g class="vek gizli" data-ad="BA">${yaz(122, 56, 'A’ya etki eder', N, 'middle', 17, 600)}</g>`);

    // İp gerilmesi: tavana asılı kutu
    const s4 = k.svg(340, 380,
      tavan(40, 300) + ip(170, 36, 170, 170) + k.kutu(170, 205, 70, '') +
      k.ok({ x1: 182, y1: 205, x2: 182, y2: 85, ad: 'T', renk: T, etiket: 'T', ex: 24, ey: 14, gizli: true }) +
      k.ok({ x1: 170, y1: 205, x2: 170, y2: 335, ad: 'G', renk: G, etiket: 'G', ex: 26, ey: 0, gizli: true }));

    // Üst üste asılı iki cisim
    const s5 = k.svg(340, 400,
      tavan(40, 300) + ip(170, 36, 170, 120) + k.kutu(170, 150, 60, '') + ip(170, 180, 170, 250) + k.kutu(170, 285, 70, '') +
      yaz(190, 85, '1. ip', '#6b7d76', 'start', 20) + yaz(190, 222, '2. ip', '#6b7d76', 'start', 20) +
      yaz(215, 158, '2 kg', '#173430', 'start') + yaz(220, 293, '3 kg', '#173430', 'start') +
      k.ok({ x1: 150, y1: 250, x2: 150, y2: 196, ad: 'T2', renk: T, kalin: 4, etiket: 'T<sub>2</sub>', ex: -26, ey: 14, gizli: true }) +
      k.ok({ x1: 170, y1: 320, x2: 170, y2: 392, ad: 'G2', renk: G, kalin: 4, etiket: '30 N', ex: 42, ey: -4, gizli: true }));

    // Yatay düzlemde iki kutu (A 2 kg, B 3 kg, F = 20 N B’ye sağa)
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
      k.ok({ x1: 175, y1: 108, x2: 255, y2: 108, ad: 'TA', renk: T, kalin: 4, etiket: 'T', ex: 16, ey: 8, gizli: true }) +
      k.ok({ x1: 100, y1: 70, x2: 180, y2: 70, ad: 'aA', renk: F, kalin: 3, etiket: 'a', ex: 16, ey: 8, gizli: true }) +
      k.ok({ x1: 380, y1: 268, x2: 380, y2: 196, ad: 'TB', renk: T, kalin: 4, etiket: 'T', ex: 16, ey: 14, gizli: true }) +
      k.ok({ x1: 360, y1: 332, x2: 360, y2: 412, ad: 'GB', renk: G, kalin: 4, etiket: 'G', ex: 22, ey: -6, gizli: true }) +
      k.ok({ x1: 450, y1: 250, x2: 450, y2: 330, ad: 'aB', renk: F, kalin: 3, etiket: 'a', ex: -16, ey: 30, gizli: true }));

    // Üç kutu: K 3 kg, L 2 kg, M 1 kg, F = 12 N M’ye sağa
    const s8 = k.svg(500, 220,
      zemin(10, 490, 160) +
      k.kutu(55, 132, 56, 'K') + ip(83, 132, 167, 132) + k.kutu(195, 132, 56, 'L') + ip(223, 132, 307, 132) + k.kutu(335, 132, 56, 'M') +
      k.ok({ x1: 363, y1: 132, x2: 480, y2: 132, ad: 'F', renk: F, etiket: '12 N', ex: -22, ey: -16 }) +
      yaz(125, 118, '1. ip', '#6b7d76', 'middle', 19, 600) + yaz(265, 118, '2. ip', '#6b7d76', 'middle', 19, 600) +
      yaz(55, 204, '3 kg') + yaz(195, 204, '2 kg') + yaz(335, 204, '1 kg'));

    return [
      k.kapak({ etiket: '11. SINIF FİZİK, KUVVET VE HAREKET', baslik: 'Newton’ın yasaları ve ip gerilmesi.', vurgu: 'Üç yasa, bir ip.', aciklama: 'Eylemsizlik, F = m · a, etki-tepki ve iple bağlı cisimlerde gerilme kuvveti.' }),
      k.konu({
        etiket: '1. YASA', kod: 'FİZ.11.1.4', baslik: 'Eylemsizlik',
        maddeler: [
          'Otobüs aniden fren yapınca yolcular öne doğru savrulur. Onları öne iten bir kuvvet yok.',
          'Masa örtüsü hızla çekilince üstündeki tabaklar yerinde kalır.',
          'Cisimlerin hareket durumlarını koruma eğilimine <b>eylemsizlik</b> denir.',
          '<b>1. yasa:</b> Net kuvvet sıfırsa duran cisim durmaya, hareket eden cisim sabit hızla doğrusal hareketine devam eder.',
          { formul: 'ΣF = 0 ise a = 0', aciklama: 'Net kuvvetin sıfır olması kuvvet yok demek değildir. Kuvvetler birbirini dengeliyordur.' },
        ],
      }),
      k.konu({
        etiket: '2. YASA', kod: 'FİZ.11.1.4', baslik: 'Net kuvvet ivme kazandırır', sekil: s2,
        maddeler: [
          { metin: 'Sürtünmesiz zemindeki kutuya bir kuvvet uygularsak kutunun hızı değişir: kutu ivme kazanır.', vurgu: 'F' },
          { metin: 'İvme, net kuvvetle aynı yöndedir.', vurgu: 'F,a' },
          'Kuvvet iki katına çıkarsa ivme iki katına çıkar. Kütle iki katına çıkarsa ivme yarıya iner.',
          { formul: 'ΣF = m · a', aciklama: 'ΣF: net kuvvet (N), m: kütle (kg), a: ivme (m/s²). 1 N = 1 kg · m/s²', vurgu: 'F,a' },
        ],
      }),
      k.soru({
        etiket: 'TEKRAR 1', kod: 'FİZ.11.1.4', baslik: 'Kuvvet, kütle ve ivme',
        baglam: 'Sürtünmesiz yatay düzlemde duran 2 kg kütleli kutuya 10 N büyüklüğünde yatay bir kuvvet uygulanıyor.',
        maddeler: [
          { metin: 'Kutunun ivmesi kaç m/s²’dir?', puan: '3 puan', adimlar: ['a = ΣF / m = 10 / 2'], cevap: '5 m/s², kuvvet yönünde' },
          { metin: 'Kuvvet 20 N olsaydı ivme kaç m/s² olurdu?', puan: '3 puan', adimlar: ['a = 20 / 2'], cevap: '10 m/s². Kuvvet iki katına çıktı, ivme de iki katına çıktı.' },
          { metin: 'Aynı 10 N’luk kuvvet 4 kg’lık kutuya uygulansaydı ivme kaç m/s² olurdu?', puan: '4 puan', adimlar: ['a = 10 / 4'], cevap: '2,5 m/s². Kütle iki katına çıktı, ivme yarıya indi.' },
        ],
      }),
      k.konu({
        etiket: '3. YASA', kod: 'FİZ.11.1.4', baslik: 'Etki ve tepki', sekil: s3,
        maddeler: [
          { metin: 'A kutusu B’yi iterse B de A’yı iter.', vurgu: 'AB,BA' },
          { metin: 'İki kuvvet aynı anda oluşur, büyüklükleri eşit, yönleri zıttır.', vurgu: 'AB,BA' },
          '<b>Dikkat:</b> Etki ve tepki farklı cisimlere etki eder. Biri A’ya, diğeri B’ye. Bu yüzden birbirini götürmez.',
          { formul: `${V('F<sub>AB</sub>')} = −${V('F<sub>BA</sub>')}`, aciklama: 'F<sub>AB</sub>: A’nın B’ye uyguladığı kuvvet. Eksi işareti zıt yönü gösterir.', vurgu: 'AB,BA' },
        ],
      }),
      k.soru({
        etiket: 'TEKRAR 2', kod: 'FİZ.11.1.4', baslik: 'Etki-tepki mi, değil mi?',
        baglam: 'Her soruyu önce kendin cevapla, sonra ekrana dokun.',
        maddeler: [
          { metin: 'Masadaki kitaba etki eden ağırlık ile masanın kitaba uyguladığı tepki kuvveti (N) bir etki-tepki çifti midir?', puan: '4 puan', adimlar: ['İkisi de aynı cisme, kitaba etki ediyor. Kitap dengede olduğu için birbirini dengeliyorlar.'], cevap: 'Hayır. Ağırlığın eşi, kitabın Dünya’yı çektiği kuvvettir. N’nin eşi ise kitabın masaya uyguladığı kuvvettir.' },
          { metin: 'Bir kamyon küçük bir arabaya çarpıyor. Hangisi diğerine daha büyük kuvvet uygular?', puan: '3 puan', adimlar: ['Çarpışma kuvvetleri bir etki-tepki çiftidir.'], cevap: 'Kuvvetler eşittir. Arabanın kütlesi küçük olduğu için ivmesi daha büyük olur.' },
          { metin: 'Sürtünmenin önemsiz olduğu buz pistinde 50 kg’lık Ali ile 25 kg’lık kardeşi birbirini itiyor. Kardeşin ivmesi Ali’nin ivmesinin kaç katıdır?', puan: '3 puan', adimlar: ['İki kuvvet eşit büyüklükte. a = F / m ve kardeşin kütlesi yarı.'], cevap: '2 katı, zıt yönde.' },
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
      k.konu({
        etiket: 'YÖNTEM', kod: 'FİZ.11.1.5', baslik: 'Bağlı cisimlerde iki adım',
        maddeler: [
          'Gergin bir iple bağlı cisimler (ip uzamıyorsa) aynı büyüklükte ivmeyle hareket eder.',
          { formul: 'a = ΣF<sub>dış</sub> / m<sub>toplam</sub>', aciklama: '1. adım: Bütün sistemi tek bir cisim gibi düşün. İpin iki ucundaki T’ler iç kuvvettir, sistemin hesabına girmez. Tek cismi incelerken T mutlaka yazılır.' },
          { formul: 'ΣF = m · a (tek cisim)', aciklama: '2. adım: Bir cismi ayır, onun serbest cisim diyagramından ipteki gerilmeyi bul.' },
          'Kontrol: Aynı gerilmeyi diğer cisimden de bulabilmelisin.',
        ],
      }),
      k.soru({
        etiket: 'YATAY DÜZLEM', kod: 'FİZ.11.1.5', baslik: 'İple bağlı iki kutu', sekil: s6,
        baglam: 'Sürtünmesiz yatay düzlemde A ve B kutuları bir iple bağlıdır. B’ye 20 N büyüklüğünde yatay kuvvet uygulanıyor.',
        maddeler: [
          { metin: 'Sistemin ivmesi kaç m/s²’dir?', puan: '3 puan', adimlar: ['a = 20 / (2 + 3)'], cevap: '4 m/s², sağa' },
          { metin: 'İpteki gerilme kaç N’dur?', puan: '4 puan', adimlar: [{ metin: 'A’yı yalnızca ip çeker: T = 2 · 4', vurgu: 'TA' }, { metin: 'Kontrol, B için: 20 − T = 3 · 4, T = 8 N', vurgu: 'TA,TB' }], cevap: '8 N', cevapVurgu: 'TA,TB' },
          { metin: 'Şekildeki kuvvet kaldırılıp aynı 20 N’luk kuvvet A’ya sola doğru uygulansaydı ipteki gerilme kaç N olurdu?', puan: '3 puan', adimlar: ['İvme yine 4 m/s², bu kez sola. İp artık B’yi çeker: T = 3 · 4'], cevap: '12 N. Gerilme, ipin çektiği kütleye bağlıdır.' },
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
      k.soru({
        etiket: 'ÜÇ KUTU', kod: 'FİZ.11.1.5', baslik: 'Hangi ip daha çok gerilir?', sekil: s8,
        baglam: 'Sürtünmesiz yatay düzlemde K, L ve M kutuları iplerle bağlıdır. M’ye 12 N büyüklüğünde yatay kuvvet uygulanıyor.',
        maddeler: [
          { metin: 'Sistemin ivmesi kaç m/s²’dir?', puan: '2 puan', adimlar: ['a = 12 / (3 + 2 + 1)'], cevap: '2 m/s²' },
          { metin: '1. ipteki gerilme kaç N’dur?', puan: '3 puan', adimlar: ['1. ip yalnızca K’yi çeker: T<sub>1</sub> = 3 · 2'], cevap: '6 N' },
          { metin: '2. ipteki gerilme kaç N’dur?', puan: '3 puan', adimlar: ['2. ip K ve L’yi birlikte çeker: T<sub>2</sub> = (3 + 2) · 2', 'Kontrol, M için: 12 − T<sub>2</sub> = 1 · 2, T<sub>2</sub> = 10 N'], cevap: '10 N' },
          { metin: 'Kuvvet artırılırsa önce hangi ip kopar?', puan: '2 puan', cevap: '2. ip. Kuvvete yakın olan ip daha çok kütleyi çeker, gerilmesi daha büyüktür.' },
        ],
      }),
      k.konu({
        etiket: 'KISA TEKRAR', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          '1. yasa: Net kuvvet sıfırsa cismin hızı değişmez.',
          '2. yasa: ΣF = m · a. İvme net kuvvet yönündedir.',
          '3. yasa: Etki ve tepki eşit büyüklükte, zıt yönlü ve farklı cisimler üzerindedir.',
          'İp yalnızca çeker. Asılı cisimde T, ivmeye göre ağırlıktan büyük, küçük ya da ona eşit olabilir.',
          'Bağlı cisimlerde önce sistemin ivmesi, sonra tek cisimden ipteki gerilme bulunur.',
        ],
      }),
      k.kapanis({ baslik: 'Üç yasa ve ip tamam.', vurgu: 'Gelecek ders: sürtünme kuvvetleri.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },
};
