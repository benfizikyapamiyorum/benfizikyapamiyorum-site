// 11. sınıf, Kuvvet ve Hareket: Düzgün çembersel hareket 1 (yaklaşık 20 dakikalık video)
// MEB ders kitabı 1.6.1 ve 1.6.2'nin ilk kısmı, s. 95-105 ile paralel: yörünge, yarıçap ve hız vektörleri, uydunun hız vektörü,
// günlük örnekler, periyot ve frekans, çizgisel hız ve açısal hız, platform ve tekerlek soruları (kitapta 39. Alıştırma tipi).
// TYMM FİZ.11.1.9. Önceki ders: limit hız. Sonraki ders: merkezcil ivme ve merkezcil kuvvet. π = 3.
module.exports = {
  slug: '11-cembersel-hareket-1',
  baslik: '11. Sınıf Fizik: Düzgün Çembersel Hareket 1',
  dersAdi: '11. sınıf, Düzgün çembersel hareket',
  slaytlar: (k) => {
    const G = '#244f40', N = '#1d3b8f', T = '#b06a3b', GR = '#475569';
    const yz = (x, y, t, r = '#173430', a = 'middle', s = 21, w = 800) => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${r}" text-anchor="${a}">${t}</text>`;
    const gz = (ad, ic) => `<g class="vek gizli" data-ad="${ad}">${ic}</g>`;
    const vk = (ad, ic) => `<g class="vek" data-ad="${ad}">${ic}</g>`;
    const top = (x, y, r = 13, op = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${N}" stroke="#173430" stroke-width="2.5" opacity="${op}"/>`;

    // Şekil: dönme dolap
    let kab = '';
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, x = 320 + 130 * Math.cos(a), y = 170 + 130 * Math.sin(a); kab += `<line x1="320" y1="170" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#94a3b8" stroke-width="3"/><rect x="${(x - 14).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="28" height="24" rx="6" fill="${i === 0 ? T : N}" stroke="#173430" stroke-width="2"/>`; }
    const sDolap = k.svg(700, 400,
      `<rect x="0" y="352" width="700" height="48" fill="#cfc9ba"/>` +
      `<line x1="320" y1="170" x2="240" y2="352" stroke="${GR}" stroke-width="9" stroke-linecap="round"/><line x1="320" y1="170" x2="400" y2="352" stroke="${GR}" stroke-width="9" stroke-linecap="round"/>` +
      `<circle cx="320" cy="170" r="130" fill="none" stroke="${GR}" stroke-width="5"/>` + kab + `<circle cx="320" cy="170" r="11" fill="#173430"/>` +
      vk('surat', `<path d="M 500 80 A 200 200 0 0 1 532 170" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/><polygon points="535,198 519,168 547,166" fill="${G}"/>` + yz(556, 124, 'sabit sürat', G, 'start', 22)) +
      gz('hiz', k.ok({ x1: 450, y1: 196, x2: 450, y2: 276, renk: N, kalin: 7 }) + yz(470, 262, 'ϑ', N, 'start', 28) +
        k.ok({ x1: 320, y1: 40, x2: 400, y2: 40, renk: N, kalin: 7 }) + yz(386, 22, 'ϑ', N, 'middle', 28)));

    // Şekil: yörünge, yarıçap vektörü, hız vektörü
    const sYorunge = k.svg(720, 400,
      gz('y1', `<circle cx="340" cy="210" r="140" fill="none" stroke="#6b7d76" stroke-width="3" stroke-dasharray="10 8"/><circle cx="340" cy="210" r="7" fill="#173430"/>` + yz(322, 240, 'O', '#173430', 'end', 24) + yz(206, 356, 'yörünge', '#6b7d76', 'end')) +
      gz('y2', k.ok({ x1: 340, y1: 210, x2: 464, y2: 210, renk: T, kalin: 6 }) + yz(400, 242, 'r', T, 'middle', 27) + top(480, 210)) +
      gz('y3', k.ok({ x1: 480, y1: 194, x2: 480, y2: 96, renk: N, kalin: 7 }) + yz(500, 130, 'ϑ', N, 'start', 29) + `<path d="M 462 210 L 462 192 L 480 192" fill="none" stroke="#173430" stroke-width="2.5"/>`) +
      gz('y4', `<line x1="340" y1="210" x2="340" y2="84" stroke="${T}" stroke-width="3" stroke-dasharray="8 7"/>` + top(340, 70, 13, .55) + k.ok({ x1: 324, y1: 70, x2: 226, y2: 70, renk: N, kalin: 7 }) + yz(276, 50, 'ϑ', N, 'middle', 29) + yz(706, 356, 'büyüklük aynı, yön farklı', N, 'end', 22)));

    // Şekil: Dünya çevresindeki uydu, A, B ve C konumları
    const sUydu = k.svg(720, 400,
      `<circle cx="340" cy="200" r="140" fill="none" stroke="#6b7d76" stroke-width="3" stroke-dasharray="10 8"/><circle cx="340" cy="200" r="42" fill="${G}"/>` + yz(340, 207, 'Dünya', '#fff', 'middle', 19) +
      `<line x1="340" y1="158" x2="340" y2="74" stroke="${T}" stroke-width="3"/><line x1="382" y1="200" x2="466" y2="200" stroke="${T}" stroke-width="3"/><line x1="310" y1="230" x2="251" y2="289" stroke="${T}" stroke-width="3"/>` +
      top(340, 60) + top(480, 200) + top(241, 299) + yz(360, 44, 'A', '#173430', 'start', 24) + yz(500, 232, 'B', '#173430', 'start', 24) + yz(214, 300, 'C', '#173430', 'end', 24) +
      vk('vA', k.ok({ x1: 324, y1: 60, x2: 230, y2: 60, renk: N, kalin: 7 }) + yz(270, 40, 'ϑ', N, 'middle', 27)) +
      gz('vB', k.ok({ x1: 480, y1: 184, x2: 480, y2: 90, renk: N, kalin: 7 }) + yz(500, 126, 'ϑ', N, 'start', 27)) +
      gz('vC', k.ok({ x1: 252, y1: 310, x2: 318, y2: 376, renk: N, kalin: 7 }) + yz(334, 358, 'ϑ', N, 'start', 27)) +
      gz('vT', k.ok({ x1: 356, y1: 60, x2: 450, y2: 60, renk: G, kalin: 7 }) + yz(466, 50, 'ters yönde', G, 'start', 20) + yz(466, 76, 'dolanırsa', G, 'start', 20)));

    // Şekil: periyot ve frekans
    const sPeriyot = k.svg(720, 380,
      `<circle cx="340" cy="190" r="140" fill="#e9eef0" stroke="${GR}" stroke-width="4"/><circle cx="340" cy="190" r="8" fill="#173430"/>` +
      `<line x1="340" y1="190" x2="462" y2="190" stroke="${T}" stroke-width="3" stroke-dasharray="8 7"/>` + top(462, 190, 16) +
      `<path d="M 512 126 A 186 186 0 0 0 420 30" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/><polygon points="394,22 426,16 420,44" fill="${G}"/>` +
      vk('T', yz(612, 190, '1 tur için', '#173430', 'middle', 22) + yz(612, 222, 'geçen süre: T', T, 'middle', 24)) +
      vk('f', yz(612, 290, '1 saniyedeki', '#173430', 'middle', 22) + yz(612, 322, 'tur sayısı: f', N, 'middle', 24)) +
      vk('ornek', yz(94, 176, '10 saniyede', '#173430', 'middle', 22) + yz(94, 210, '5 tur', G, 'middle', 27)));

    // Şekil: platformun kenarındaki çocuk (r = 2 m, T = 6 s)
    const sPlatform = k.svg(640, 380,
      `<circle cx="300" cy="200" r="140" fill="#e9eef0" stroke="${GR}" stroke-width="4"/><circle cx="300" cy="200" r="8" fill="#173430"/>` +
      `<line x1="300" y1="200" x2="424" y2="200" stroke="${T}" stroke-width="3.5" stroke-dasharray="8 7"/>` + yz(362, 232, 'r = 2 m', T, 'middle', 23) + top(440, 200, 16) +
      `<path d="M 478 132 A 190 190 0 0 0 384 32" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/><polygon points="358,24 390,18 384,46" fill="${G}"/>` + yz(500, 70, 'T = 6 s', G, 'start', 23));

    // Şekil: çizgisel hız ve açısal hız
    const sModel = k.svg(720, 400,
      `<circle cx="300" cy="210" r="140" fill="none" stroke="#6b7d76" stroke-width="3" stroke-dasharray="10 8"/><circle cx="300" cy="210" r="7" fill="#173430"/>` +
      vk('r', k.ok({ x1: 300, y1: 210, x2: 424, y2: 210, renk: T, kalin: 6 }) + yz(362, 242, 'r', T, 'middle', 27)) + top(440, 210) +
      vk('v', k.ok({ x1: 440, y1: 194, x2: 440, y2: 96, renk: N, kalin: 7 }) + yz(460, 130, 'ϑ', N, 'start', 29) + yz(500, 338, 'Bir turda yol: 2 π r', N, 'start', 22)) +
      vk('w', `<line x1="300" y1="210" x2="399" y2="111" stroke="${T}" stroke-width="3" stroke-dasharray="8 7"/><path d="M 356 210 A 56 56 0 0 0 340 170" fill="none" stroke="${G}" stroke-width="5" stroke-linecap="round"/><polygon points="332,160 352,166 338,180" fill="${G}"/>` + yz(372, 184, 'ω', G, 'start', 27) + yz(500, 374, 'Bir turda açı: 2 π rad', G, 'start', 22)));

    // Şekil: traktör
    const teker = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3b4652" stroke="#173430" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r * .38}" fill="#e2e8f0"/><circle cx="${cx}" cy="${cy}" r="6" fill="#173430"/><line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${T}" stroke-width="3.5" stroke-dasharray="8 7"/>`;
    const sTraktor = k.svg(720, 400,
      `<rect x="0" y="330" width="720" height="70" fill="#cfc9ba"/>` +
      `<rect x="220" y="190" width="310" height="60" rx="10" fill="${G}" stroke="#173430" stroke-width="2.5"/><rect x="226" y="100" width="116" height="94" rx="10" fill="#dbe7e0" stroke="#173430" stroke-width="2.5"/>` +
      vk('arka', teker(240, 234, 96) + yz(240, 374, 'r = 1 m', '#173430', 'middle', 23)) + vk('on', teker(500, 282, 48) + yz(500, 374, 'r = 50 cm', '#173430', 'middle', 23)) +
      vk('v', k.ok({ x1: 570, y1: 150, x2: 680, y2: 150, renk: N, kalin: 7 }) + yz(620, 126, '6 m/s', N, 'middle', 24)));

    const deneySag = `<canvas id="chC" width="2200" height="1240"></canvas>
<div class="dk"><span>Yarıçap</span>${k.secim('chR', [['2', '2 m'], ['4', '4 m'], ['6', '6 m']], 2)}<span style="margin-left:14px">Periyot</span>${k.secim('chT', [['6', '6 s'], ['3', '3 s'], ['2', '2 s']], 1)}${k.dugme('chDur', 'Durdur', 'ik')}</div>
<div class="olcu"><div><span>Frekans</span><b id="chF">1/3 s⁻¹</b></div><div><span>Açısal hız</span><b id="chW">2 rad/s</b></div><div><span>Ayşe’nin sürati</span><b id="chA">12 m/s</b></div><div><span>Burak’ın sürati</span><b id="chB">6 m/s</b></div></div>`;

    return [
      k.kapak({ etiket: '11. SINIF FİZİK, KUVVET VE HAREKET', baslik: 'Düzgün çembersel hareket.', vurgu: 'Sürat sabitken hız değişir mi?', aciklama: 'Yörünge, yarıçap ve hız vektörleri. Periyot, frekans, çizgisel hız ve açısal hız. Ders kitabı 1.6, sayfa 95-105.' }),
      k.konu({
        etiket: 'BAŞLANGIÇ SORUSU', kod: 'FİZ.11.1.9', baslik: 'Kabinin hızı değişiyor mu?', sekil: sDolap,
        maddeler: [
          { metin: 'Bir dönme dolap sabit süratle dönüyor. Kabinlerden birinde oturuyorsun.', vurgu: 'surat' },
          'Hız vektörel bir niceliktir: büyüklüğü de yönü de vardır.',
          { metin: 'Kabin her an başka bir yöne doğru gider. Büyüklük aynı kalsa da yön değiştiği için hız değişir.', vurgu: 'hiz' },
          { formul: 'Sürat sabit, hız değişken.', aciklama: 'Hız değişiyorsa hareket ivmelidir. Bu ivmeyi gelecek derste inceleyeceğiz.' },
        ],
      }),
      k.konu({
        etiket: 'ADIM ADIM', kod: 'FİZ.11.1.9', baslik: 'Yörünge, yarıçap, hız', sekil: sYorunge,
        maddeler: [
          { metin: '<b>Yörünge ve merkez:</b> cismin izlediği yol bir çemberdir. Çemberin merkezi O, yörünge merkezidir.', vurgu: 'y1' },
          { metin: '<b>Yarıçap vektörü:</b> merkezden cismin bulunduğu noktaya çizilir. Cismin konumunu gösterir.', vurgu: 'y2' },
          { metin: '<b>Hız vektörü:</b> yörüngeye teğettir ve hareket yönündedir. Bu yüzden yarıçap vektörüne diktir.', vurgu: 'y3' },
          { metin: 'Cisim eşit zaman aralıklarında eşit yol alıyorsa hareket <b>düzgün çembersel harekettir</b>.', vurgu: 'y1,y2,y3,y4' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.11.1.9', baslik: 'Uydunun hız vektörü', sekil: sUydu,
        baglam: 'Bir haberleşme uydusu Dünya çevresinde düzgün çembersel hareket yapıyor. Uydunun A konumundaki hız vektörü şekilde verilmiştir.',
        maddeler: [
          { metin: 'Uydunun B konumundaki hız vektörünü çiziniz.', puan: '3 puan', adimlar: [{ metin: 'A’daki vektöre göre uydu saat yönünün tersine dolanıyor.', vurgu: 'vA' }], cevap: 'Yarıçapa dik ve yukarı doğrudur. Boyu A’dakiyle aynıdır.', cevapVurgu: 'vB' },
          { metin: 'Uydunun C konumundaki hız vektörünü çiziniz.', puan: '3 puan', cevap: 'Yine yarıçapa diktir. Sağa ve aşağıya doğrudur.', cevapVurgu: 'vC' },
          { metin: 'Uydu ters yönde dolansaydı A’daki hız vektörü nasıl olurdu?', puan: '4 puan', cevap: 'Yine yörüngeye teğet olurdu ama zıt yönü gösterirdi.', cevapVurgu: 'vT' },
        ],
      }),
      k.soru({
        etiket: 'GÜNLÜK HAYAT', kod: 'FİZ.11.1.9', baslik: 'Hepsi aynı hareket',
        baglam: 'Tablodaki noktaların hepsi sabit tempoda dönüyor.',
        tablo: { basliklar: ['Nokta', 'Yörünge', 'Yörünge merkezi'], doldur: 0, satirlar: [['Dönen plağın kenarındaki nokta', 'Çember', 'Plağın merkezi'], ['Rüzgâr türbini kanadının ucu', 'Çember', 'Türbinin göbeği'], ['Saatin yelkovanının ucu', 'Çember', 'Saatin merkezi']] },
        maddeler: [
          { metin: 'Her noktanın yörünge merkezini yazınız.', puan: '3 puan', adimlar: ['Üçü de sabit bir nokta etrafında çember çizer.'] },
          { metin: 'Bu noktaların sürati ve hızının yönü için ne söylenir?', puan: '4 puan', adimlar: ['Eşit zaman aralıklarında eşit yol alırlar.'], cevap: 'Sürat sabittir. Hız yörüngeye teğettir, yönü sürekli değişir.' },
          { metin: 'Yelkovanın ucu ile ortasındaki noktadan hangisinin sürati daha büyüktür?', puan: '3 puan', adimlar: ['İkisi de bir turu aynı sürede atar ama uçtaki nokta daha büyük çember çizer.'], cevap: 'Ucundaki noktanın. Aynı sürede daha çok yol alır.' },
        ],
      }),
      k.konu({
        etiket: 'İKİ YENİ KAVRAM', kod: 'FİZ.11.1.9', baslik: 'Periyot ve frekans', sekil: sPeriyot,
        maddeler: [
          { metin: '<b>Periyot (T):</b> cismin bir tam tur atması için geçen süredir. Birimi saniyedir.', vurgu: 'T' },
          { metin: '<b>Frekans (f):</b> cismin bir saniyede attığı tur sayısıdır. Birimi s⁻¹ ya da hertzdir (Hz).', vurgu: 'f' },
          { formul: 'T f = 1,  f = 1 / T', aciklama: 'Biri büyürse diğeri küçülür.', vurgu: 'T,f' },
          { metin: 'Platform 10 saniyede 5 tur atıyor. Bir tur 10 / 5 = 2 s sürer: T = 2 s, f = 1/2 s⁻¹.', vurgu: 'ornek' },
        ],
      }),
      k.soru({
        etiket: 'ALIŞTIRMA', kod: 'FİZ.11.1.9', baslik: 'Periyot mu, frekans mı?',
        baglam: '“Kaç saniyede bir tur” periyottur. “Saniyede kaç tur” frekanstır.',
        maddeler: [
          { metin: 'Bir matkap ucu saniyede 20 tur atıyor. Frekansı ve periyodu nedir?', puan: '3 puan', adimlar: ['Saniyedeki tur sayısı verilmiş: f = 20 s⁻¹'], cevap: 'f = 20 s⁻¹,  T = 1/20 s' },
          { metin: 'Bir çamaşır makinesinin tamburu 1 dakikada 600 tur atıyor. Frekansı kaç s⁻¹’dir?', puan: '3 puan', adimlar: ['1 dakika = 60 s,  f = 600 / 60'], cevap: 'f = 10 s⁻¹,  T = 1/10 s' },
          { metin: 'Bir cismin periyodu 4 katına çıkarılırsa frekansı nasıl değişir?', puan: '4 puan', adimlar: ['T f = 1: periyot ile frekans ters orantılıdır.'], cevap: 'Frekans dörtte birine iner.' },
        ],
        yatay: true,
      }),
      k.konu({
        etiket: 'MATEMATİKSEL MODEL', kod: 'FİZ.11.1.9', baslik: 'Çizgisel hız, açısal hız', sekil: sModel,
        maddeler: [
          { formul: 'ϑ = 2 π r / T = 2 π r f', aciklama: 'Çizgisel hız: yörüngeye teğet olan hızdır. Birimi m/s.', vurgu: 'v,r' },
          { formul: 'ω = 2 π / T = 2 π f', aciklama: 'Açısal hız: yarıçap vektörünün birim zamanda taradığı açıdır. Birimi rad/s.', vurgu: 'w' },
          { formul: 'ϑ = ω r', aciklama: 'Aynı cisimde bütün noktaların açısal hızı eşittir. Çizgisel sürat yarıçapla artar.', vurgu: 'v,w,r' },
          'Açısal hız vektörünün yönü sağ el kuralıyla bulunur: dört parmak dönüş yönünde kıvrılır, başparmak açısal hızın yönünü gösterir.',
        ],
      }),
      k.deney({
        kod: 'FİZ.11.1.9', baslik: 'Kenardaki mi hızlı, ortadaki mi?',
        giris: 'Ayşe platformun kenarında, Burak merkezle kenarın tam ortasında duruyor. Yarıçapı ve periyodu değiştir, okları izle.',
        sag: deneySag,
        maddeler: [
          'İkisi de bir turu aynı sürede atar: periyotları, frekansları ve açısal hızları eşittir.',
          'Ayşe 2 kat büyük çember çizer. Çizgisel sürati Burak’ınkinin 2 katıdır.',
          'Periyot yarıya inerse çizgisel sürat de açısal hız da 2 katına çıkar.',
          { formul: 'ω eşit,  ϑ = ω r', aciklama: 'Hesaplarda π = 3 alınmıştır.' },
        ],
      }),
      k.soru({
        etiket: 'ADIM ADIM ÇÖZÜM', kod: 'FİZ.11.1.9', baslik: 'Platformdaki çocuk', sekil: sPlatform,
        baglam: 'Yarıçapı 2 m olan platformun kenarındaki çocuk düzgün çembersel hareket yapıyor ve bir turu 6 s’de tamamlıyor. π = 3 alınız.',
        maddeler: [
          { metin: 'Çocuğun frekansı kaç s⁻¹’dir?', puan: '2 puan', cevap: 'f = 1 / T = 1/6 s⁻¹' },
          { metin: 'Çocuğun çizgisel sürati kaç m/s’dir?', puan: '4 puan', adimlar: ['Bir turda alınan yol çemberin çevresidir: ϑ = 2 π r / T = 2 × 3 × 2 / 6'], cevap: 'ϑ = 2 m/s' },
          { metin: 'Çocuğun açısal hızının büyüklüğü kaç rad/s’dir?', puan: '4 puan', adimlar: ['Bir turda taranan açı 2 π radyandır: ω = 2 π / T = 2 × 3 / 6'], cevap: 'ω = 1 rad/s. Kontrol: ϑ = ω r = 1 × 2 = 2 m/s' },
        ],
      }),
      k.soru({
        etiket: 'DERS KİTABI TİPİ', kod: 'FİZ.11.1.9', baslik: 'Büyük tekerlek, küçük tekerlek', sekil: sTraktor,
        baglam: 'Bir traktör düz yolda 6 m/s sabit süratle ilerliyor. Arka tekerleğin yarıçapı 1 m, ön tekerleğin yarıçapı 50 cm’dir. Tekerlekler kaymadan dönüyor. π = 3 alınız.',
        maddeler: [
          { metin: 'Tekerleklerin kenarındaki noktaların merkeze göre çizgisel süratlerini karşılaştırınız.', puan: '2 puan', adimlar: [{ metin: 'İki tekerlek aynı sürede aynı yolu alır.', vurgu: 'v' }], cevap: 'Eşittir: ikisi de 6 m/s.' },
          { metin: 'Tekerleklerin periyotları kaç saniyedir?', puan: '4 puan', adimlar: [{ metin: 'T = 2 π r / ϑ.  Arka: 2 × 3 × 1 / 6 = 1 s', vurgu: 'arka' }, { metin: 'Ön: yarıçap yarısı, periyot da yarısı.', vurgu: 'on' }], cevap: 'Arka 1 s, ön 1/2 s. Küçük tekerlek 2 kat çok döner.' },
          { metin: 'Tekerleklerin açısal hızları kaç rad/s’dir?', puan: '4 puan', adimlar: ['ω = 2 π / T.  Arka: 2 × 3 / 1,  ön: 2 × 3 × 2'], cevap: 'Arka 6 rad/s, ön 12 rad/s. Sürat eşitken açısal hız yarıçapla ters orantılıdır.' },
        ],
      }),
      k.soru({
        etiket: 'YAZILIYA HAZIRLIK', etiketRenk: 'B', kod: 'FİZ.11.1.9', baslik: 'Doğru mu, yanlış mı?',
        baglam: 'Düzgün çembersel hareket yapan cisimlerle ilgili ifadeler verilmiştir.',
        tablo: { basliklar: ['No', 'İfade', 'D&nbsp;/&nbsp;Y'], doldur: 0, satirlar: [
          ['1', 'Cismin sürati sabittir.', 'D'],
          ['2', 'Cismin hızı sabittir.', 'Y'],
          ['3', 'Hız vektörü ile yarıçap vektörü arasındaki açı 90°’dir.', 'D'],
          ['4', '20 saniyede 10 tur atan cismin periyodu 2 s’dir.', 'D'],
          ['5', 'Aynı platformda merkeze uzak olan çocuğun açısal hızı daha büyüktür.', 'Y'],
          ['6', 'Yarıçap sabitken frekans 2 katına çıkarsa çizgisel sürat 4 katına çıkar.', 'Y'],
        ] },
        maddeler: [
          { metin: 'Tablonun son sütununu doldurunuz.', puan: '6 puan', adimlar: ['Sırayla: D, Y, D, D, Y, Y'] },
          { metin: 'Yanlış ifadeleri düzeltiniz.', puan: '6 puan', adimlar: ['2: Hızın yönü sürekli değişir, hız sabit değildir.', '5: İkisi bir turu aynı sürede atar, açısal hızları eşittir.', '6: ϑ = 2 π r f. Çizgisel sürat 2 katına çıkar.'] },
        ],
      }),
      k.konu({
        etiket: 'ÖZET', baslik: 'Bugün ne öğrendik?',
        maddeler: [
          'Düzgün çembersel harekette sürat sabittir. Hız yörüngeye teğet ve yarıçapa diktir, yönü sürekli değişir.',
          'Periyot bir tur için geçen süre, frekans bir saniyedeki tur sayısıdır: T f = 1.',
          { formul: 'ϑ = 2 π r / T,  ω = 2 π / T,  ϑ = ω r', aciklama: 'Aynı cisimde açısal hız her noktada eşittir. Çizgisel sürat yarıçapla artar.' },
        ],
      }),
      k.kapanis({ baslik: 'Hızın yönü hep değişiyor.', vurgu: 'Gelecek ders: merkezcil ivme ve kuvvet.', aciklama: 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' }),
    ];
  },

  // Canlı deney: dönen platform. A kenarda (r), B ortada (r / 2). π = 3: ω = 6 / T, ϑ = ω r.
  // Platform ölçeksiz çizilir (yarıçap büyüdükçe biraz büyür); oklar süratle orantılıdır (1 m/s = 12 birim).
  betik: function () {
    var $ = function (i) { return document.getElementById(i); }, cv = $('chC'); if (!cv) return;
    var x = cv.getContext('2d'), W = 1100, H = 620, sl = cv.closest('.sl'); x.setTransform(2, 0, 0, 2, 0, 0);
    var S = { aci: 0.5, son: 0, dur: false };
    var sec = function (id) { return +document.querySelector('#' + id + ' button.on').dataset.v; };
    function deger() { var r = sec('chR'), T = sec('chT'); return { r: r, T: T, w: 6 / T, vA: 6 * r / T, vB: 3 * r / T }; }
    function yazi(t, px, py, boy, renk, hiza, w) { x.font = (w || 700) + ' ' + boy + 'px "Plus Jakarta Sans",sans-serif'; x.fillStyle = renk; x.textAlign = hiza || 'left'; x.textBaseline = 'middle'; x.fillText(t, px, py); }
    function ok(x1, y1, x2, y2, renk, kal) { var L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = Math.min(kal * 2.6, L * .7), w = h * .55, bx = x2 - ux * h, by = y2 - uy * h; x.strokeStyle = renk; x.fillStyle = renk; x.lineWidth = kal; x.lineCap = 'round'; x.beginPath(); x.moveTo(x1, y1); x.lineTo(bx, by); x.stroke(); x.beginPath(); x.moveTo(x2, y2); x.lineTo(bx - uy * w, by + ux * w); x.lineTo(bx + uy * w, by - ux * w); x.closePath(); x.fill(); }
    function ciz() {
      var d = deger(), cx = 310, cy = 310, R = 100 + 15 * d.r, a = S.aci, ca = Math.cos(a), sa = Math.sin(a), kk = 12, u = 17;
      x.clearRect(0, 0, W, H); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#e9eef0'; x.strokeStyle = '#475569'; x.lineWidth = 4; x.beginPath(); x.arc(cx, cy, R + 18, 0, 7); x.fill(); x.stroke();
      x.strokeStyle = '#cbd5e1'; x.lineWidth = 2.5; x.setLineDash([8, 7]); x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke(); x.beginPath(); x.arc(cx, cy, R / 2, 0, 7); x.stroke();
      x.strokeStyle = '#b06a3b'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + R * ca, cy - R * sa); x.stroke(); x.setLineDash([]);
      x.fillStyle = '#173430'; x.beginPath(); x.arc(cx, cy, 7, 0, 7); x.fill();
      var ax = cx + R * ca, ay = cy - R * sa, bx = cx + R / 2 * ca, by = cy - R / 2 * sa;
      ok(bx - sa * u, by - ca * u, bx - sa * (u + d.vB * kk), by - ca * (u + d.vB * kk), '#1d3b8f', 7);
      ok(ax - sa * u, ay - ca * u, ax - sa * (u + d.vA * kk), ay - ca * (u + d.vA * kk), '#1d3b8f', 8);
      x.fillStyle = '#b06a3b'; x.beginPath(); x.arc(ax, ay, 17, 0, 7); x.fill(); x.fillStyle = '#244f40'; x.beginPath(); x.arc(bx, by, 17, 0, 7); x.fill();
      yazi('A', ax, ay + 1, 19, '#fff', 'center', 800); yazi('B', bx, by + 1, 19, '#fff', 'center', 800);
      var tx = 680;
      yazi('Ayşe (A): kenarda', tx, 150, 28, '#b06a3b', 'left', 800); yazi('r = ' + d.r + ' m,  ϑ = ' + d.vA + ' m/s', tx, 192, 28, '#173430', 'left', 700);
      yazi('Burak (B): ortada', tx, 280, 28, '#244f40', 'left', 800); yazi('r = ' + d.r / 2 + ' m,  ϑ = ' + d.vB + ' m/s', tx, 322, 28, '#173430', 'left', 700);
      yazi('İkisi için de', tx, 410, 28, '#173430', 'left', 800); yazi('T = ' + d.T + ' s,  ω = ' + d.w + ' rad/s', tx, 452, 28, '#173430', 'left', 700);
      $('chF').textContent = '1/' + d.T + ' s⁻¹'; $('chW').textContent = d.w + ' rad/s'; $('chA').textContent = d.vA + ' m/s'; $('chB').textContent = d.vB + ' m/s';
    }
    function dongu(t) {
      var dt = Math.min(0.05, (t - S.son) / 1000 || 0); S.son = t;
      if (sl.classList.contains('aktif') && !S.dur) { S.aci = (S.aci + 2 * Math.PI / deger().T * dt) % (2 * Math.PI); ciz(); }
      requestAnimationFrame(dongu);
    }
    ['chR', 'chT'].forEach(function (id) {
      [].forEach.call($(id).children, function (b) { b.addEventListener('etk', function () { [].forEach.call($(id).children, function (o) { o.classList.toggle('on', o === b); }); ciz(); }); });
    });
    $('chDur').addEventListener('etk', function () { S.dur = !S.dur; $('chDur').textContent = S.dur ? 'Devam' : 'Durdur'; });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(ciz); ciz(); requestAnimationFrame(dongu);
  },
};
