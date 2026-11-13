// 11. sınıf · Not #4 · Serbest cisim diyagramı · FİZİ.11.1.5 (sürtünme yok: FİZ.11.1.6 sonraki konu)
const { bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki, ok, txt } = require('../lib');

const MAVI = '#2563eb', TURUNCU = '#ea580c', YESIL = '#0f766e', MOR = '#7c3aed', PEMBE = '#be185d', GRI = '#64748b';
const svg = (b, w, h, mm) => `<svg class="sk" viewBox="0 0 ${w} ${h}" style="width:${mm}mm;max-width:100%">${b}</svg>`;
const kutuC = (x, y, w, h, lab, c = MOR, yer) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#f1ecfd" stroke="${c}" stroke-width="2.2"/>` +
  (!lab ? '' : yer === 'sol' ? txt(x - 8, y + h / 2 + 6, lab, { a: 'end', size: 16, c: '#4c1d95' }) : txt(x + w / 2, y + h / 2 + 6, lab, { size: 16, c: '#4c1d95', hw: 0 }));
const zemin = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${GRI}" stroke-width="3"/>` +
  Array.from({ length: Math.floor((x2 - x1) / 16) }, (_, i) => `<line x1="${x1 + 8 + i * 16}" y1="${y + 2}" x2="${x1 + i * 16}" y2="${y + 10}" stroke="#cbd5e1" stroke-width="1.5"/>`).join('');
const nokta = (x, y) => `<circle cx="${x}" cy="${y}" r="4" fill="#1d2b53"/>`;

// 1) Temel kuvvetler: ipe asılı lamba (2 kg) ve yerde itilen kutu (3 kg). Ölçek 2,4 px/N.
const fTemel = (mm = 150) => {
  const k = 2.4;
  let b = `<line x1="30" y1="22" x2="170" y2="22" stroke="${GRI}" stroke-width="3"/>` +
    Array.from({ length: 9 }, (_, i) => `<line x1="${34 + i * 16}" y1="20" x2="${42 + i * 16}" y2="10" stroke="#cbd5e1" stroke-width="1.5"/>`).join('');
  b += `<line x1="100" y1="22" x2="100" y2="112" stroke="#334155" stroke-width="2.4"/>` + kutuC(78, 112, 44, 40, '2 kg', MOR, 'sol');
  b += ok(100, 132, 100, 132 - 20 * k, MAVI) + txt(112, 132 - 20 * k + 26, 'T = 20 N', { a: 'start', size: 16, c: MAVI });
  b += ok(100, 132, 100, 132 + 20 * k, TURUNCU) + txt(112, 132 + 20 * k - 4, 'G = 20 N', { a: 'start', size: 16, c: TURUNCU });
  b += txt(100, 250, 'İpe asılı, duruyor', { size: 15, w: 700, c: '#334155' });
  b += zemin(250, 520, 170) + kutuC(345, 126, 60, 44, '3 kg', MOR, 'sol');
  const cx = 375, cy = 148;
  b += ok(cx, cy, cx, cy - 30 * k, YESIL) + txt(cx + 12, cy - 30 * k + 14, 'N = 30 N', { a: 'start', size: 16, c: YESIL });
  b += ok(cx, cy, cx, cy + 30 * k, TURUNCU) + txt(cx + 12, cy + 30 * k - 2, 'G = 30 N', { a: 'start', size: 16, c: TURUNCU });
  b += ok(cx, cy, cx + 12 * k + 30, cy, PEMBE) + txt(cx + 12 * k + 38, cy + 6, 'F = 12 N', { a: 'start', size: 16, c: PEMBE });
  b += nokta(100, 132) + nokta(cx, cy);
  b += txt(385, 250, 'Sürtünmesiz yatay yüzeyde itiliyor', { size: 15, w: 700, c: '#334155' });
  return svg(b, 540, 262, mm);
};

// 2) Açılı çekilen kutu: varsayılan 4 kg, F = 25 N, yatayla 37° yukarı. Ölçek 3,4 px/N (soru şeklinde yalnız F).
const fAcili = (mm = 82, soruS = false, m = 4, F = 25) => {
  const k = soruS ? 2.4 : 3.4, cx = 170, cy = soruS ? 120 : 150, G = m * 10, Fx = F * 0.8, Fy = F * 0.6;
  let b = zemin(30, 400, cy + 25) + kutuC(cx - 35, cy - 25, 70, 50, `${m} kg`, MOR, 'sol');
  const fx = Fx * k, fy = Fy * k;
  if (!soruS) {
    b += `<line x1="${cx}" y1="${cy}" x2="${cx + fx}" y2="${cy}" stroke="${PEMBE}" stroke-width="2" stroke-dasharray="6 5"/>`;
    b += `<line x1="${cx + fx}" y1="${cy}" x2="${cx + fx}" y2="${cy - fy}" stroke="${PEMBE}" stroke-width="2" stroke-dasharray="6 5"/>`;
    b += txt(cx + fx + 8, cy + 5, `${Fx} N`, { a: 'start', size: 14, c: PEMBE, w: 700 }) + txt(cx + fx + 8, cy - fy / 2 + 5, `${Fy} N`, { a: 'start', size: 14, c: PEMBE, w: 700 });
    b += ok(cx, cy, cx, cy - (G - Fy) * k, YESIL) + txt(cx - 10, cy - (G - Fy) * k + 12, `N = ${G - Fy} N`, { a: 'end', size: 16, c: YESIL });
    b += ok(cx, cy, cx, cy + G * k, TURUNCU) + txt(cx - 10, cy + G * k - 4, `G = ${G} N`, { a: 'end', size: 16, c: TURUNCU });
  }
  b += ok(cx, cy, cx + fx, cy - fy, PEMBE) + txt(cx + fx + 8, cy - fy - 6, `F = ${F} N`, { a: 'start', size: 16, c: PEMBE });
  b += `<path d="M ${cx + 28} ${cy} A 28 28 0 0 0 ${cx + 28 * 0.8} ${cy - 28 * 0.6}" fill="none" stroke="${PEMBE}" stroke-width="1.6"/>` + txt(cx + 33, cy - 4, "37°", { a: "start", size: 14, c: PEMBE });
  b += nokta(cx, cy);
  return soruS ? svg(b, 400, 160, mm) : svg(b, 400, 300, mm);
};

// 3) Sürtünmesiz eğik düzlem, 37°. C(60,40) tepe, A(60,280) dik köşe, B(380,280).
const fEgik = (mm = 84, m = 5, kuvvet = true) => {
  let b = `<polygon points="60,40 60,280 380,280" fill="#f8fafc" stroke="${GRI}" stroke-width="2.6"/>`;
  b += `<path d="M 330 280 A 50 50 0 0 1 340 250" fill="none" stroke="${GRI}" stroke-width="1.6"/>` + txt(318, 266, '37°', { a: 'end', size: 15, c: '#334155' });
  const ux = 0.8, uy = 0.6, nx = 0.6, ny = -0.8;
  const px = 60 + 0.42 * 320, py = 40 + 0.42 * 240; // eğim üzerindeki temas noktası
  const cx = px + nx * 22, cy = py + ny * 22;
  b += `<rect x="${cx - 26}" y="${cy - 22}" width="52" height="44" rx="5" fill="#f1ecfd" stroke="${MOR}" stroke-width="2.2" transform="rotate(36.87 ${cx} ${cy})"/>`;
  if (!kuvvet) { b += txt(cx, cy + 6, `${m} kg`, { size: 15, c: '#4c1d95', hw: 0 }); return svg(b, 420, 300, mm); }
  const k = 2.0, G = m * 10;
  b += ok(cx, cy, cx, cy + G * k, TURUNCU) + txt(cx - 10, cy + G * k - 2, `G = ${G} N`, { a: 'end', size: 15, c: TURUNCU });
  b += ok(cx, cy, cx + nx * 0.8 * G * k, cy + ny * 0.8 * G * k, YESIL) + txt(cx + nx * 0.8 * G * k + 8, cy + ny * 0.8 * G * k + 4, `N = ${0.8 * G} N`, { a: 'start', size: 15, c: YESIL });
  b += ok(cx, cy, cx + ux * 0.6 * G * k, cy + uy * 0.6 * G * k, MAVI, 2.6, 11, '6 5') + txt(cx + ux * 0.6 * G * k + 8, cy + uy * 0.6 * G * k + 10, `${0.6 * G} N`, { a: 'start', size: 15, c: MAVI });
  b += ok(cx, cy, cx - nx * 0.8 * G * k, cy - ny * 0.8 * G * k, MAVI, 2.6, 11, '6 5') + txt(cx - nx * 0.8 * G * k - 8, cy - ny * 0.8 * G * k + 4, `${0.8 * G} N`, { a: 'end', size: 15, c: MAVI });
  b += nokta(cx, cy);
  return svg(b, 420, 300, mm);
};

// 4) İple bağlı iki kutu ve ayrı ayrı SCD’leri. 2 kg (sol), 3 kg (sağ), F = 20 N sağ kutuya. SCD ölçeği 3 px/N.
const fIkiSCD = (mm = 150) => {
  const k = 3;
  let b = zemin(40, 420, 100) + kutuC(90, 60, 60, 40, '2 kg') + `<line x1="150" y1="80" x2="230" y2="80" stroke="#334155" stroke-width="2.4"/>` + kutuC(230, 54, 66, 46, '3 kg');
  b += ok(296, 77, 296 + 20 * k, 77, PEMBE) + txt(326, 64, 'F = 20 N', { size: 15, c: PEMBE });
  b += txt(230, 128, 'Düzenek: sürtünmesiz yatay yüzey', { size: 14, w: 700, c: '#334155' });
  const sc = (x0, y0, m, sag, sol) => {
    let s = txt(x0, 160, `${m} kg kutunun SCD’si`, { size: 14, w: 700, c: '#4c1d95' });
    s += ok(x0, y0, x0, y0 - m * 10 * k, YESIL) + txt(x0 + 8, y0 - m * 10 * k + 14, `N = ${m * 10} N`, { a: 'start', size: 14, c: YESIL });
    s += ok(x0, y0, x0, y0 + m * 10 * k, TURUNCU) + txt(x0 + 8, y0 + m * 10 * k - 2, `G = ${m * 10} N`, { a: 'start', size: 14, c: TURUNCU });
    if (sag) s += ok(x0, y0, x0 + sag[1] * k, y0, sag[2], 3.2, 10) + txt(x0 + sag[1] * k + 6, y0 + 5, sag[0], { a: 'start', size: 14, c: sag[2] });
    if (sol) s += ok(x0, y0, x0 - sol[1] * k, y0, sol[2], 3.2, 10) + txt(x0 - sol[1] * k - 6, y0 + 5, sol[0], { a: 'end', size: 14, c: sol[2] });
    return s + nokta(x0, y0);
  };
  b += sc(130, 270, 2, ['T = 8 N', 8, MAVI]);
  b += sc(330, 270, 3, ['F = 20 N', 20, PEMBE], ['T = 8 N', 8, MAVI]);
  return svg(b, 460, 370, mm);
};

// 5) Masa ve makara: masadaki kutu M, asılı kutu m. Kuvvet çizilmez (soru şekli).
const fMakara = (mm = 82, M = '4 kg', m = '1 kg') => {
  let b = `<rect x="30" y="120" width="300" height="12" fill="#e2e8f0" stroke="${GRI}" stroke-width="2"/>` +
    `<line x1="50" y1="132" x2="50" y2="270" stroke="${GRI}" stroke-width="6"/><line x1="310" y1="132" x2="310" y2="270" stroke="${GRI}" stroke-width="6"/>`;
  b += kutuC(130, 76, 64, 44, M);
  b += `<line x1="194" y1="98" x2="345" y2="98" stroke="#334155" stroke-width="2.4"/>`;
  b += `<line x1="330" y1="126" x2="345" y2="113" stroke="${GRI}" stroke-width="3"/><circle cx="345" cy="113" r="15" fill="#fff" stroke="${GRI}" stroke-width="2.6"/><circle cx="345" cy="113" r="3" fill="${GRI}"/>`;
  b += `<line x1="360" y1="113" x2="360" y2="200" stroke="#334155" stroke-width="2.4"/>` + kutuC(336, 200, 48, 40, m);
  b += txt(180, 290, 'Masa yüzeyi sürtünmesiz', { size: 14, w: 700, c: '#334155' });
  return svg(b, 400, 300, mm);
};

// 6) İki kutu, soru 6: K = 3 kg (sol), L = 2 kg (sağ), F = 25 N L’ye.
const fIpliSoru = (mm = 78) => {
  let b = zemin(20, 380, 120) + kutuC(60, 76, 64, 44, 'K: 3 kg') + `<line x1="124" y1="98" x2="190" y2="98" stroke="#334155" stroke-width="2.4"/>` + kutuC(190, 80, 64, 40, 'L: 2 kg');
  b += ok(254, 100, 340, 100, PEMBE) + txt(298, 88, 'F = 25 N', { size: 15, c: PEMBE });
  b += txt(200, 150, 'Sürtünmesiz yatay yüzey', { size: 14, w: 700, c: '#334155' });
  return svg(b, 400, 160, mm);
};

// 7) Üstten bastırılan kutu (soru 2)
const fBastir = (mm = 46) => {
  let b = zemin(20, 220, 170) + kutuC(80, 120, 80, 50, '4 kg');
  b += ok(120, 40, 120, 116, PEMBE) + txt(130, 70, 'F = 10 N', { a: 'start', size: 15, c: PEMBE });
  return svg(b, 240, 185, mm);
};

// 8) Asansörde baskül
const fAsansor = (mm = 60, deger = '? N', ivme = true) => {
  let b = `<rect x="60" y="20" width="180" height="250" rx="6" fill="#f8fafc" stroke="${GRI}" stroke-width="3"/><line x1="150" y1="0" x2="150" y2="20" stroke="#334155" stroke-width="3"/>`;
  b += `<rect x="110" y="250" width="80" height="18" rx="3" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>`;
  b += `<rect x="125" y="252" width="50" height="12" rx="2" fill="#1d2b53"/>` + txt(150, 262, deger, { size: 11, c: '#7dd3fc', hw: 0 });
  b += `<circle cx="150" cy="105" r="17" fill="#fde68a" stroke="#334155" stroke-width="2"/><line x1="150" y1="122" x2="150" y2="190" stroke="#334155" stroke-width="5"/><line x1="150" y1="140" x2="122" y2="170" stroke="#334155" stroke-width="4"/><line x1="150" y1="140" x2="178" y2="170" stroke="#334155" stroke-width="4"/><line x1="150" y1="190" x2="132" y2="250" stroke="#334155" stroke-width="5"/><line x1="150" y1="190" x2="168" y2="250" stroke="#334155" stroke-width="5"/>`;
  if (ivme) b += ok(270, 190, 270, 110, MAVI) + txt(282, 156, 'a', { a: 'start', size: 20, c: MAVI, it: true });
  return svg(b, 310, 280, mm);
};



const govde = [
  kutu('sari', 'Bu notta', 'Serbest cisim diyagramını (SCD) adım adım çizmeyi, normal kuvveti doğru bulmayı, eğik düzlemde ağırlığı bileşenlerine ayırmayı ve iple bağlı cisimleri çözmeyi göreceksin. Bütün notta <b>g = 10 m/s²</b>, sin 37° = 0,6 ve cos 37° = 0,8 alınır. Yüzeyler sürtünmesizdir; sürtünme kuvveti bir sonraki konudur.'),

  bolum(1, 'SCD dört adımda', `
<p>SCD, <b>tek bir cisme</b> etki eden bütün kuvvetlerin çizimidir. Cisim bir kutu ya da nokta olarak çizilir, kuvvetler bu noktadan başlayan oklarla gösterilir.</p>
${sekil(fTemel(150), 'Oklar kuvvetlerin büyüklüğüyle orantılı çizildi. Lambada bileşke kuvvet sıfır, kutuda 12 N sağa.')}
<div class="ikili">
<table class="t"><tr><th>Kuvvet</th><th>Nereden gelir?</th><th>Yönü</th></tr>
<tr><td><b>G = mg</b></td><td>Dünya</td><td>Düşey, aşağı</td></tr>
<tr><td><b>N</b></td><td>Temas eden yüzey</td><td>Yüzeye dik, cisimden dışarı</td></tr>
<tr><td><b>T</b></td><td>Gergin ip</td><td>İp boyunca, cisimden dışarı</td></tr>
<tr><td><b>F</b></td><td>El, motor, iten cisim</td><td>Uygulandığı yön</td></tr></table>
${kutu('ana', 'Dört adım', '1) Cismi seç ve tek başına çiz.<br>2) Ağırlığı aşağı çiz.<br>3) Cismin <b>değdiği her şey</b> için bir kuvvet ekle.<br>4) Eksen seç: ivme yönünü pozitif al, $F_{net} = ma$ yaz.')}
</div>`),

  bolum(2, 'Normal kuvvet her zaman mg değildir', `
<div class="ikili s"><div>${sekil(fAcili(76), '4 kg kutu yatayla 37° açıyla 25 N kuvvetle çekiliyor.')}</div><div>
<p>Açılı kuvveti önce bileşenlerine ayır: yatay $25 \\times 0{,}8 = 20$ N, düşey $25 \\times 0{,}6 = 15$ N.</p>
<p><b>Düşeyde ivme yok:</b> $N + 15 = 40$, yani $N = 25$ N.</p>
<p><b>Yatayda:</b> $F_{net} = 20$ N, $a = 20 / 4 = 5$ m/s² sağa.</p></div></div>
<table class="t"><tr><th>Durum (m kütleli cisim)</th><th>Düşeyde denklem</th><th>N</th></tr>
<tr><td>Yatay yüzeyde, yalnız yatay kuvvet var</td><td>$N = mg$</td><td>$mg$</td></tr>
<tr><td>Üstten F kuvvetiyle bastırılıyor</td><td>$N = mg + F$</td><td>$mg$’den büyük</td></tr>
<tr><td>Yukarı yönlü bileşeni $F_y$ olan kuvvetle çekiliyor</td><td>$N + F_y = mg$</td><td>$mg$’den küçük</td></tr>
<tr><td>Asansörde, ivme a yukarı</td><td>$N - mg = ma$</td><td>$m(g + a)$</td></tr>
<tr><td>Asansörde, ivme a aşağı</td><td>$mg - N = ma$</td><td>$m(g - a)$</td></tr></table>
${kutu('sari', 'Kural', 'N’yi ezberden değil, <b>yüzeye dik doğrultudaki</b> denklemden bul. O doğrultuda ivme yoksa kuvvetler dengededir.')}`),


  bolum(3, 'Eğik düzlem: ağırlığı eğime göre ayır', `
<div class="ikili s"><div>${sekil(fEgik(80, 5), 'Sürtünmesiz eğik düzlemde 5 kg cisim. Kesikli oklar G’nin bileşenleri.')}</div><div>
<p>Eksenleri <b>eğim boyunca</b> ve <b>eğime dik</b> seç. Ağırlık iki bileşene ayrılır:</p>
<p>Eğim boyunca aşağı: $mg \\sin 37° = 50 \\times 0{,}6 = 30$ N.</p>
<p>Eğime dik: $mg \\cos 37° = 50 \\times 0{,}8 = 40$ N.</p>
<p>Dik doğrultuda ivme yok: $N = 40$ N. Eğim boyunca: $a = 30 / 5 = 6$ m/s², eğim boyunca aşağı.</p></div></div>
${kutu('ana', 'Kütleden bağımsız ivme', 'Sürtünmesiz eğik düzlemde $a = g \\sin\\theta$ olur. 37° için her kütle $6$ m/s² ivmeyle kayar, çünkü hem kuvvet hem kütle aynı oranda büyür.')}`),

  bolum(4, 'İple bağlı cisimler: her cisme ayrı SCD', `
<div class="ikili s"><div>${sekil(fIkiSCD(84), 'Üstte düzenek, altta her kutunun SCD’si. İp gerilmesi iki kutuda zıt yönlerde görünür.')}</div><div>
${kutu('ana', '1. yol: sistem', 'İki kutu aynı ivmeyle hareket eder. Bütün sisteme etki eden dış kuvvet F’dir; T sistemin içindedir ve hesaba girmez.<br>$a = \\dfrac{F}{m_1 + m_2} = \\dfrac{20}{5} = 4$ m/s²')}
${kutu('ana', '2. yol: tek cisim', 'İpi bulmak için yalnız 2 kg kutunun SCD’sine bak. Yatayda tek kuvvet T’dir.<br>$T = m_1 a = 2 \\times 4 = 8$ N<br>Kontrol (3 kg): $20 - 8 = 3 \\times 4$ ✓')}
</div></div>`),

  hatalar([
    ['Hareket eden cisme hareket yönünde bir “hareket kuvveti” çizilir.', 'SCD’de yalnız Dünya’dan ve temas eden cisimlerden gelen kuvvetler olur. Sabit hızla giden cismin bileşke kuvveti sıfırdır.'],
    ['Normal kuvvet her zaman $mg$’ye eşittir.', 'Üstten bastırınca artar, açılı yukarı çekince azalır, eğik düzlemde $mg\\cos\\theta$ olur. Yüzeye dik doğrultuda denklem kur.'],
    ['Eğik düzlemde G’yi ve bileşenlerini birlikte kuvvet olarak toplamak.', 'Bileşenler G’nin yerine geçer. Ya G’yi ya da iki bileşenini kullan, ikisini birden değil.'],
    ['Masa ve makara düzeneğinde ip gerilmesi asılı cismin ağırlığına eşittir.', 'Asılı cisim ivmeliyse $T < mg$ olur. Çözümlü örnek 2’de asılı cismin ağırlığı 20 N, ip gerilmesi 12 N.'],
    ['Kitabın SCD’sine kitabın masaya uyguladığı kuvvet de çizilir.', 'O kuvvet masaya etki eder, masanın SCD’sine aittir. SCD’de yalnız o cisme etki eden kuvvetler bulunur.'],
  ]),

  ornek(1, 'ASANSÖRDE BASKÜL', `
<div class="ikili s"><div>
<p>Kütlesi 50 kg olan Elif, asansörde baskülün üzerinde duruyor. Baskül, Elif’e uyguladığı normal kuvveti gösterir. Yukarı yönü pozitif seçelim: $N - mg = ma$.</p>
<table class="t"><tr><th>Asansörün hareketi</th><th>İvme</th><th>N (baskül)</th></tr>
<tr><td>Sabit hızla yukarı çıkıyor</td><td>0</td><td>$500$ N</td></tr>
<tr><td>Yukarı çıkmaya başlıyor, hızlanıyor</td><td>2 m/s² yukarı</td><td>$500 + 50 \\times 2 = 600$ N</td></tr>
<tr><td>Yukarıda durmak için yavaşlıyor</td><td>2 m/s² aşağı</td><td>$500 - 50 \\times 2 = 400$ N</td></tr></table>
</div><div>${sekil(fAsansor(48, '600 N'))}</div></div>
<p>Elif’in ağırlığı hiç değişmez, hep 500 N’dir. Değişen, baskülün ona uyguladığı normal kuvvettir. Baskülü belirleyen hızın yönü değil, <b>ivmenin yönüdür</b>.</p>`),

  ornek(2, 'MASA VE MAKARA (MEB TARZI)', `
<div class="ikili s"><div>
<p>Sürtünmesiz masadaki 3 kg kutu, makaradan geçen iple 2 kg asılı kutuya bağlıdır. Sistem serbest bırakılıyor. İp ve makaranın kütlesi önemsizdir.</p>
<p><b>a) SCD’ler.</b> Masadaki kutu: G = 30 N aşağı, N = 30 N yukarı, T sağa. Asılı kutu: G = 20 N aşağı, T yukarı.</p>
<p><b>b) İvme.</b> Sistemi hareket ettiren dış kuvvet asılı kutunun ağırlığıdır: $a = \\dfrac{20}{3 + 2} = 4$ m/s².</p>
<p><b>c) İp gerilmesi.</b> Masadaki kutu: $T = 3 \\times 4 = 12$ N. Kontrol (asılı kutu): $20 - 12 = 2 \\times 4$ ✓</p>
</div><div>${sekil(fMakara(70, '3 kg', '2 kg'))}</div></div>`),

  `<h2 class="b"><span class="n">?</span>Sorular</h2>`,
  soru(1, { metin: 'Tavana bağlı bir ipe asılı 2 kg kütleli lamba durgun hâldedir.', kok: 'Lambanın serbest cisim diyagramında hangi kuvvetler bulunur?', k: 1,
    siklar: ['Yalnız lambanın ağırlığı', 'Lambanın ağırlığı ve ipin lambaya uyguladığı gerilme kuvveti', 'Lambanın ağırlığı, ipin gerilme kuvveti ve tavanın tepki kuvveti', 'İpin gerilme kuvveti ve lambanın ipi çekme kuvveti', 'Lambanın ağırlığı ve lambanın tavanı çekme kuvveti'] }),
  soru(2, { metin: 'Yatay yüzeydeki 4 kg kütleli kutu, üstten düşey doğrultuda 10 N kuvvetle bastırılıyor.', sekil: fBastir(36), kok: 'Yüzeyin kutuya uyguladığı normal kuvvet kaç N’dur?',
    siklar: ['10', '30', '40', '50', '60'] }),
  soru(3, { metin: 'Kütlesi 40 kg olan bir öğrenci, asansördeki baskülün üzerinde duruyor. Baskül 480 N gösteriyor.<br>I. Asansör yukarı çıkarken hızlanıyor.<br>II. Asansör aşağı inerken yavaşlıyor.<br>III. Asansör sabit hızla yukarı çıkıyor.', kok: 'Asansörün hareketi için verilenlerden hangileri olabilir?',
    siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'II ve III', 'I, II ve III'] }),
  soru(4, { metin: 'Sürtünmesiz eğik düzlemdeki 10 kg kütleli cisim serbest bırakılıyor.', sekil: fEgik(54, 10, false), kok: 'Eğik düzlemin cisme uyguladığı normal kuvvet ve cismin ivmesinin büyüklüğü nedir?', k: 2,
    siklar: ['N = 80 N; a = 6 m/s²', 'N = 100 N; a = 6 m/s²', 'N = 60 N; a = 8 m/s²', 'N = 80 N; a = 10 m/s²', 'N = 60 N; a = 6 m/s²'] }),
  soru(5, { metin: 'Masanın üzerinde bir kitap durmaktadır. Aşağıdaki kuvvetler veriliyor:<br>I. Dünya’nın kitabı çekmesi<br>II. Masanın kitabı itmesi<br>III. Kitabın masayı itmesi', kok: 'Kitabın serbest cisim diyagramına bu kuvvetlerden hangileri çizilir?',
    siklar: ['Yalnız I', 'Yalnız II', 'I ve III', 'II ve III', 'I ve II'] }),
  soru(6, { metin: 'Sürtünmesiz yatay yüzeydeki K ve L kutuları iple bağlıdır. L kutusu 25 N’luk yatay kuvvetle sağa çekiliyor.', sekil: fIpliSoru(64), kok: 'K ve L arasındaki ipte oluşan gerilme kuvveti kaç N’dur?',
    siklar: ['10', '15', '20', '25', '5'] }),
  soru(7, { metin: 'Sürtünmesiz masadaki 4 kg kutu, makaradan geçen iple 1 kg asılı kutuya bağlıdır. Sistem serbest bırakılıyor. İp ve makaranın kütlesi önemsizdir.', sekil: fMakara(56), kok: 'İpte oluşan gerilme kuvveti kaç N’dur?',
    siklar: ['2', '4', '8', '10', '40'] }),
  soru(8, { metin: 'Düşey bir ipe bağlı 3 kg kütleli cisim, ip tarafından 45 N kuvvetle yukarı çekiliyor. Cisim o anda <b>aşağı doğru</b> hareket etmektedir. Hava direnci önemsizdir.', kok: 'Cismin ivmesi nedir?', k: 2,
    siklar: ['15 m/s², yukarı', '5 m/s², aşağı', '10 m/s², yukarı', '5 m/s², yukarı', 'Sıfır'] }),
  soru(9, { metin: 'Sürtünmesiz yatay yüzeydeki 5 kg kütleli kutu, şekildeki gibi yatayla yukarı doğru 37° açı yapan 50 N’luk kuvvetle çekiliyor. Kutu yüzeyden ayrılmıyor.', sekil: fAcili(68, true, 5, 50), kok: 'Yüzeyin kutuya uyguladığı normal kuvvet ve kutunun ivmesi nedir?', k: 2,
    siklar: ['N = 20 N; a = 8 m/s²', 'N = 50 N; a = 10 m/s²', 'N = 20 N; a = 10 m/s²', 'N = 80 N; a = 8 m/s²', 'N = 30 N; a = 6 m/s²'] }),
  soru(10, { metin: '<b>Açık uçlu (10 puan).</b> Asansörün tavanına bağlı bir ipe 2 kg kütleli cisim asılmıştır. Asansör aşağı inerken 3 m/s² büyüklüğünde ivmeyle yavaşlıyor.',
    kok: 'a) Cismin serbest cisim diyagramını çiziniz. (3 puan)<br>b) Cismin ivmesinin yönünü gerekçesiyle yazınız. (2 puan)<br>c) İpteki gerilme kuvvetini bulunuz. (3 puan)<br>d) Asansör aynı büyüklükte ivmeyle aşağı doğru hızlansaydı ip gerilmesi kaç N olurdu? (2 puan)', ek: '<div style="height:24mm"></div>' }),

  cevaplar([
    ['B', 'Lambaya yalnız Dünya (G = 20 N, aşağı) ve ip (T, yukarı) etki eder. Tavana değmez. “Lambanın ipi çekmesi” ipe etki eder, lambanın SCD’sinde olmaz. Lamba durduğu için T = 20 N.'],
    ['D', 'Düşeyde ivme yok. Yukarı: N. Aşağı: G = 40 N ve F = 10 N. $N = 40 + 10 = 50$ N.'],
    ['C', 'Baskül, öğrenciye uyguladığı normal kuvveti gösterir. G = 400 N, N = 480 N. Yukarı pozitif: $480 - 400 = 40a$, $a = 2$ m/s² <b>yukarı</b>. İvme yukarı ise asansör ya yukarı çıkarken hızlanır (I) ya da aşağı inerken yavaşlar (II). Sabit hızda baskül 400 N gösterirdi (III yanlış).'],
    ['A', 'G = 100 N. Eğime dik: $N = 100 \\times 0{,}8 = 80$ N. Eğim boyunca: $100 \\times 0{,}6 = 60$ N, $a = 60 / 10 = 6$ m/s². (Kısaca $a = g\\sin 37°$.)'],
    ['E', 'SCD’ye kitaba etki eden kuvvetler çizilir: I (ağırlık) ve II (normal kuvvet). III masaya etki eder; II’nin etki-tepki eşidir.'],
    ['B', 'Sistem: $a = 25 / (3 + 2) = 5$ m/s². İpi K kutusu çeker: K’nın yatayda tek kuvveti T, $T = 3 \\times 5 = 15$ N. Kontrol (L): $25 - 15 = 2 \\times 5$ ✓'],
    ['C', 'Hareket ettiren dış kuvvet asılı kutunun ağırlığı 10 N. $a = 10 / (4 + 1) = 2$ m/s². Masadaki kutu: $T = 4 \\times 2 = 8$ N. Kontrol (asılı kutu): $10 - 8 = 1 \\times 2$ ✓. 10 N değildir, çünkü asılı kutu ivmelidir.'],
    ['D', 'Yukarı pozitif: $F_{net} = 45 - 30 = 15$ N, $a = 15 / 3 = 5$ m/s² <b>yukarı</b>. İvme, hareket yönüne değil bileşke kuvvete bağlıdır. Cisim aşağı iniyorsa yavaşlıyordur.'],
    ['A', 'Bileşenler: yatay $50 \\times 0{,}8 = 40$ N, düşey $50 \\times 0{,}6 = 30$ N. Düşeyde: $N + 30 = 50$, $N = 20$ N. Yatayda: $a = 40 / 5 = 8$ m/s².'],
    ['–', 'a) Cisme iki kuvvet etki eder: G = 20 N aşağı, T yukarı (ip yönünde). (3 puan) b) Hız aşağı, cisim yavaşlıyor; ivme hıza zıt, yani <b>yukarı</b>. (2 puan) c) Yukarı pozitif: $T - 20 = 2 \\times 3$, $T = 26$ N. (3 puan) d) İvme aşağı: $20 - T = 2 \\times 3$, $T = 14$ N. (2 puan)'],
  ]),
  sonraki('Ara tatilden sonra (23–27 Kasım): statik ve kinetik sürtünme kuvvetleri'),
].join('\n');

// --- Instagram slaytları ---
const slaytlar = [
  { pill: 'SCD NEDİR?', h: 'Cismi yalnız bırak, <em>kuvvetleri say</em>', svg: fTemel(), bd: 'Dünya’dan <b>G</b>, her temastan bir kuvvet: yüzeyden <b>N</b>, ipten <b>T</b>, elden <b>F</b>.' },
  { pill: '4 ADIM', h: 'SCD <em>4 adımda</em>', lst: ['<b>1.</b> Cismi seç, tek başına çiz.', '<b>2.</b> Ağırlığı (G = mg) aşağı çiz.', '<b>3.</b> Cismin <b>değdiği her şey</b> için bir kuvvet ekle.', '<b>4.</b> İvme yönünü pozitif seç, $F_{net} = ma$ yaz.'] },
  { pill: 'NORMAL KUVVET', h: 'N her zaman <em>mg</em> değil', svg: fAcili(), bd: 'Kuvvetin düşey bileşeni 15 N. Düşeyde denge: <b>N&nbsp;=&nbsp;40&nbsp;−&nbsp;15&nbsp;=&nbsp;25&nbsp;N</b>.' },
  { pill: 'EĞİK DÜZLEM', h: 'G’yi <em>eğime göre</em> ayır', svg: fEgik(), bd: 'Eğim boyunca 30 N, eğime dik 40 N. <b>N&nbsp;=&nbsp;40&nbsp;N</b> ve <b>a&nbsp;=&nbsp;6&nbsp;m/s²</b>.' },
  { pill: 'İPLİ CİSİMLER', h: 'Her cisme <em>ayrı</em> SCD', svg: fIkiSCD(), bd: 'Sistem: a = 20 / 5 = <b>4 m/s²</b>. İp: T = 2 × 4 = <b>8 N</b>.' },
  { pill: 'DİKKAT', h: 'En sık <em>3 hata</em>', lst: ['<span class="x">✗</span> Hareket yönüne “hareket kuvveti” çizmek.<br><span class="v">✓</span> Yalnız Dünya ve temaslardan gelen kuvvetler.', '<span class="x">✗</span> N her zaman mg’dir.<br><span class="v">✓</span> Yüzeye dik doğrultuda denklem kur.', '<span class="x">✗</span> Asılı cisimde T = mg.<br><span class="v">✓</span> Cisim ivmeliyse T &lt; mg.'] },
  { pill: 'SIRA SENDE', h: 'İp gerilmesi <em>kaç N?</em>', bd: 'Masa sürtünmesiz, sistem serbest bırakılıyor.', svg: fMakara().replace('max-width:100%', 'max-width:100%;max-height:380px'), sik: ['2 N', '4 N', '8 N', '10 N', '40 N'], bant: ['Cevabını yorumlara yaz 👇', 'Çözüm PDF’te'] },
  { pill: 'GÜNLÜK HAYATTA', h: 'Asansörde baskül <em>neden değişir?</em>', lst: ['50 kg Elif, sabit hızda: baskül <b>500 N</b>.', 'Yukarı hızlanırken (a = 2 m/s² yukarı): <b>600 N</b>.', 'Durmak için yavaşlarken (a = 2 m/s² aşağı): <b>400 N</b>.', 'Ağırlık değişmez. Değişen, normal kuvvet.'] },
];

module.exports = {
  sinif: 11, no: 4, gun: 'Cuma',
  slug: '11-fizik-notlari-4-serbest-cisim-diyagrami',
  konuKisa: 'Serbest cisim diyagramı',
  pdfBaslik: 'Serbest Cisim Diyagramı',
  baslik: 'Serbest Cisim Diyagramı',
  alt: 'SCD dört adımda, normal kuvvet, sürtünmesiz eğik düzlem ve iple bağlı cisimler. Konu özeti, sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
  slaytBaslik: 'Serbest cisim <span style="color:#8b5cf6">diyagramı</span>',
  slaytAlt: 'Kuvvetleri doğru çiz, soruyu yarıdan fazla çöz.',
  promoKonu: 'Newton’ın hareket yasaları',
  pdfOzet: 'Özet, 5 sık hata, 2 çözümlü örnek, <b>10 soru ve çözümleri.</b>',
  govde, slaytlar,
  aciklama: `
Asansörde baskül neden bazen 600, bazen 400 gösterir? 🤔 Cevap serbest cisim diyagramında.

Kaydırınca: SCD dört adımda, normal kuvvet neden her zaman mg değil, eğik düzlemde ağırlığı ayırma, iple bağlı cisimler, en sık 3 hata ve bir mini soru.

Notun tamamı ücretsiz PDF: özet, 5 sık hata, 2 çözümlü örnek, 10 soru ve çözümleri.
1) Takip et
2) Profildeki linke dokun
3) 11. sınıf bölümünden notu indir (üyelik yok)

7. slayttaki sorunun cevabını yorumlara yaz 👇
Her Cuma 11. sınıf için yeni not.

#11sınıf #11sınıffizik #maarifmodeli #fizik #fiziknotları #serbestcisimdiyagramı #newtonunyasaları #benfizikyapamiyorum`,
  ilkYorum: '📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf · 7. slaytın cevabı PDF’in çözüm sayfasında. Ara tatilden sonra: sürtünme kuvveti.',
  hub: {
    etiket: '11. SINIF · MAARİF MODELİ · NOT #4',
    baslik: 'Serbest cisim diyagramı',
    aciklama: 'SCD dört adımda, normal kuvvet, sürtünmesiz eğik düzlem ve iple bağlı cisimler. Sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
    takvimLink: 'Not #4 · Serbest cisim diyagramı ↓',
    tarih: '2026-11-13',
    devam: { href: '/11-sinif-fizik-paketi.html', img: '/img/fizik11/set.webp', lab: 'not11_yap', b: 'Devamı: Yapabilirim 11 · Newton’ın yasaları', span: 'Konu notu, kavram kartları, yeni nesil sorular, adım adım çözümler', em: '₺599 →' },
  },
};
