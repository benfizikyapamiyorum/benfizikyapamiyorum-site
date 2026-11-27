// 11. sınıf · Not #5 · Statik ve kinetik sürtünme kuvvetleri · FİZ.11.1.6
// Kapsam: karşılaştırma, f–F grafiği, sürtünmenin yönü, verilen sürtünme değerleriyle II. yasa.
// Sürtünme katsayısı ve f = kN modeli (FİZ.11.1.7) gelecek haftanın konusu: bu notta YOK.
const { bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki, ok, txt } = require('../lib');
const { grafik } = require('./grafik');

const MAVI = '#2563eb', TURUNCU = '#ea580c', YESIL = '#0f766e', MOR = '#7c3aed', PEMBE = '#be185d', GRI = '#64748b';
const svg = (b, w, h, mm) => `<svg class="sk" viewBox="0 0 ${w} ${h}" style="width:${mm}mm;max-width:100%">${b}</svg>`;
const kutuC = (x, y, w, h, lab, c = MOR) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#f1ecfd" stroke="${c}" stroke-width="2.2"/>` +
  (lab ? txt(x + w / 2, y + h / 2 + 6, lab, { size: 15, c: '#4c1d95', hw: 0 }) : '');
const zemin = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${GRI}" stroke-width="3"/>` +
  Array.from({ length: Math.floor((x2 - x1) / 16) }, (_, i) => `<line x1="${x1 + 8 + i * 16}" y1="${y + 2}" x2="${x1 + i * 16}" y2="${y + 10}" stroke="#cbd5e1" stroke-width="1.5"/>`).join('');
const nokta = (x, y) => `<circle cx="${x}" cy="${y}" r="4" fill="#1d2b53"/>`;
const sub = (a, b) => `${a}<tspan dy="4" font-size="75%">${b}</tspan><tspan dy="-4"> </tspan>`;

// 1) Üç durum: 5 kg kutu, en büyük statik 30 N, kinetik 20 N. Ölçek 2,2 px/N.
const fUcDurum = (mm = 160) => {
  const k = 2.2, gy = 120;
  const panel = (x0, F, f, tur, baslik, alt, kayiyor) => {
    const bx = x0 + 78, c = tur === 's' ? MAVI : TURUNCU;
    let b = zemin(x0 + 8, x0 + 205, gy) + kutuC(bx, gy - 44, 56, 44, '5 kg');
    b += ok(bx + 56, gy - 22, bx + 56 + F * k, gy - 22, PEMBE) + txt(bx + 60, gy - 32, `F = ${F} N`, { a: 'start', size: 14, c: PEMBE });
    b += ok(bx, gy - 3, bx - f * k, gy - 3, c) + txt(bx - 4, gy + 27, `${sub('f', tur)}= ${f} N`, { a: 'end', size: 14, c });
    if (kayiyor) b += ok(bx + 6, gy - 58, bx + 50, gy - 58, YESIL, 2.6, 10) + txt(bx + 58, gy - 53, 'v', { a: 'start', size: 16, c: YESIL, it: true });
    b += txt(x0 + 108, 24, baslik, { size: 15, w: 800, c: '#1d2b53' });
    b += txt(x0 + 108, gy + 52, alt, { size: 13.5, w: 700, c: '#334155' });
    return b;
  };
  let b = panel(0, 10, 10, 's', 'Duruyor', 'Statik: f = F', false);
  b += panel(220, 25, 25, 's', 'Hâlâ duruyor', 'Statik: f = F', false);
  b += panel(440, 40, 20, 'k', 'Kayıyor', 'Kinetik: f sabit', true);
  b += `<line x1="215" y1="10" x2="215" y2="178" stroke="#e2e8f0" stroke-width="1.5"/><line x1="435" y1="10" x2="435" y2="178" stroke="#e2e8f0" stroke-width="1.5"/>`;
  return svg(b, 672, 182, mm);
};

// 2) f–F grafiği: en büyük statik 30 N, kinetik 20 N.
const fGrafik = (mm = 74) => grafik({ tmax: 50, ymax: 40, dt: 10, dy: 10, sx: 6, sy: 6, xlab: 'F (N)', ylab: 'f (N)', width: mm,
  kesik: [[30, 30]],
  cizgi: [
    { pts: [[0, 0], [30, 30]], c: MAVI, lab: 'statik', lx: 9, ly: 19, la: 'middle' },
    { pts: [[30, 30], [30, 20]], c: '#94a3b8', w: 2 },
    { pts: [[30, 20], [50, 20]], c: TURUNCU, lab: 'kinetik', lx: 42, ly: 24 },
  ],
  notes: [{ t: 31, y: 35, s: 'en büyük statik: 30 N', c: MAVI, size: 13, a: 'middle' }],
});
// Soru 1 grafiği: en büyük statik 24 N, kinetik 16 N.
const fGrafikS1 = (mm = 58) => grafik({ tmax: 40, ymax: 32, dt: 8, dy: 8, sx: 7, sy: 7, xlab: 'F (N)', ylab: 'f (N)', width: mm,
  kesik: [[24, 24]],
  cizgi: [{ pts: [[0, 0], [24, 24]], c: MAVI }, { pts: [[24, 24], [24, 16]], c: '#94a3b8', w: 2 }, { pts: [[24, 16], [40, 16]], c: TURUNCU }],
});

// 3) Eğik düzlemde duran kutu (37°). Ölçek 2 px/N.
const fEgik = (mm = 80, m = 5, kuvvet = true) => {
  let b = `<polygon points="60,40 60,280 380,280" fill="#f8fafc" stroke="${GRI}" stroke-width="2.6"/>`;
  b += `<path d="M 330 280 A 50 50 0 0 1 340 250" fill="none" stroke="${GRI}" stroke-width="1.6"/>` + txt(318, 266, '37°', { a: 'end', size: 15, c: '#334155' });
  const ux = 0.8, uy = 0.6, nx = 0.6, ny = -0.8;
  const px = 60 + 0.45 * 320, py = 40 + 0.45 * 240;
  const cx = px + nx * 22, cy = py + ny * 22;
  b += `<rect x="${cx - 26}" y="${cy - 22}" width="52" height="44" rx="5" fill="#f1ecfd" stroke="${MOR}" stroke-width="2.2" transform="rotate(36.87 ${cx} ${cy})"/>`;
  if (!kuvvet) { b += txt(cx, cy + 6, `${m} kg`, { size: 15, c: '#4c1d95', hw: 0 }); return svg(b, 420, 300, mm); }
  const k = 2.0, G = m * 10, Nn = 0.8 * G, f = 0.6 * G;
  b += ok(cx, cy, cx, cy + G * k, TURUNCU) + txt(cx - 10, cy + G * k - 2, `G = ${G} N`, { a: 'end', size: 15, c: TURUNCU });
  b += ok(cx, cy, cx + nx * Nn * k, cy + ny * Nn * k, YESIL) + txt(cx + nx * Nn * k + 8, cy + ny * Nn * k + 4, `N = ${Nn} N`, { a: 'start', size: 15, c: YESIL });
  b += ok(cx, cy, cx + ux * f * k, cy + uy * f * k, GRI, 2.4, 10, '6 5') + txt(cx + ux * f * k + 8, cy + uy * f * k + 12, `${f} N`, { a: 'start', size: 14, c: GRI });
  // sürtünme: temas yüzeyinde, eğim boyunca yukarı
  b += ok(px, py, px - ux * f * k, py - uy * f * k, MAVI) + txt(px - ux * f * k + nx * 20, py - uy * f * k + ny * 20, `${sub('f', 's')}= ${f} N`, { size: 15, c: MAVI });
  b += nokta(cx, cy);
  return svg(b, 420, 300, mm);
};

// 4) Kayan kutu SCD: 4 kg, F = 28 N, kinetik 12 N. Ölçek 3 px/N.
const fKayan = (mm = 74, F = 28, fk = 12, m = 4) => {
  const k = 3, cx = 200, gy = 160, cy = gy - 24, G = m * 10;
  let b = zemin(40, 380, gy) + kutuC(cx - 24, gy - 48, 48, 48, '');
  b += ok(cx, cy, cx, cy - G * k, YESIL) + txt(cx + 10, cy - G * k + 14, `N = ${G} N`, { a: 'start', size: 15, c: YESIL });
  b += ok(cx, cy, cx, cy + G * k, TURUNCU) + txt(cx + 10, cy + G * k - 2, `G = ${G} N`, { a: 'start', size: 15, c: TURUNCU });
  b += ok(cx, cy, cx + F * k, cy, PEMBE) + txt(cx + F * k + 8, cy + 5, `F = ${F} N`, { a: 'start', size: 15, c: PEMBE });
  b += ok(cx - 24, gy - 3, cx - 24 - fk * k, gy - 3, TURUNCU) + txt(cx - 24 - fk * k - 6, gy - 8, `${sub('f', 'k')}= ${fk} N`, { a: 'end', size: 15, c: TURUNCU });
  b += ok(cx - 70, 40, cx - 20, 40, MAVI, 2.6, 10) + txt(cx - 78, 45, 'v', { a: 'end', size: 17, c: MAVI, it: true });
  b += txt(cx - 50, 22, `${m} kg, kayıyor`, { size: 14, w: 700, c: '#4c1d95' });
  b += nokta(cx, cy);
  return svg(b, 420, 300, mm);
};

// 5) Kamyonet kasasında kutu (hızlanıyor): sürtünme ileri.
const fKamyon = (mm = 70) => {
  let b = zemin(10, 410, 200);
  b += `<rect x="40" y="120" width="230" height="44" rx="4" fill="#e2e8f0" stroke="#334155" stroke-width="2.4"/>`;
  b += `<path d="M 270 164 L 270 92 L 330 92 L 362 128 L 362 164 Z" fill="#dbeafe" stroke="#334155" stroke-width="2.4"/><rect x="282" y="102" width="40" height="26" rx="3" fill="#fff" stroke="#334155" stroke-width="1.6"/>`;
  b += [90, 310].map(x => `<circle cx="${x}" cy="180" r="19" fill="#334155"/><circle cx="${x}" cy="180" r="7" fill="#cbd5e1"/>`).join('');
  b += kutuC(56, 74, 66, 46, '20 kg');
  b += ok(89, 117, 89 + 40 * 1.6, 117, PEMBE) + txt(89 + 64 + 6, 112, `${sub('f', 's')}= 40 N`, { a: 'start', size: 15, c: PEMBE });
  b += ok(300, 50, 370, 50, MAVI, 2.8, 11) + txt(378, 55, 'a = 2 m/s²', { a: 'start', size: 15, c: MAVI });
  b += ok(80, 50, 140, 50, YESIL, 2.6, 10) + txt(72, 55, 'v', { a: 'end', size: 17, c: YESIL, it: true });
  return svg(b, 470, 215, mm);
};

// 6) Duvara bastırılan kitap.
const fDuvar = (mm = 40, F = '30 N') => {
  let b = `<line x1="70" y1="20" x2="70" y2="200" stroke="${GRI}" stroke-width="3"/>` +
    Array.from({ length: 11 }, (_, i) => `<line x1="68" y1="${26 + i * 16}" x2="56" y2="${34 + i * 16}" stroke="#cbd5e1" stroke-width="1.5"/>`).join('');
  b += `<rect x="72" y="70" width="26" height="80" rx="3" fill="#fde68a" stroke="#b45309" stroke-width="2.2"/>`;
  b += txt(85, 114, '1 kg', { size: 12, c: '#92400e', hw: 0, a: 'middle' }).replace('<text ', '<text transform="rotate(-90 85 110)" ');
  b += ok(190, 110, 102, 110, PEMBE) + txt(150, 98, `F = ${F}`, { size: 15, c: PEMBE });
  return svg(b, 220, 210, mm);
};

// 7) Durgun blok, yatay kuvvet (soru 9).
const fBlok = (mm = 46) => {
  let b = zemin(20, 260, 64) + kutuC(80, 18, 60, 46, '2 kg');
  b += ok(140, 41, 210, 41, PEMBE) + txt(178, 30, 'F', { size: 17, c: PEMBE, it: true });
  return svg(b, 280, 80, mm);
};

const tKuvvetolcer = `<table class="t" style="margin:2mm 0"><tr><th>Uygulanan kuvvet</th><th>6 N</th><th>10 N</th><th>14 N</th><th>11 N</th></tr>
<tr><td>Bloğun durumu</td><td>Duruyor</td><td>Duruyor</td><td>Bu değer geçilince kaymaya başlıyor</td><td>Kayarken sabit hızla gidiyor</td></tr></table>`;

// --- PDF gövdesi ---
const govde = [
  kutu('sari', 'Bu notta', 'Statik ve kinetik sürtünme kuvvetlerini karşılaştıracak, sürtünme–kuvvet grafiğini okuyacak, sürtünmenin yönünü bulacak ve sürtünmeli yüzeyde Newton’ın II. yasasını kullanacaksın. Bütün notta <b>g = 10 m/s²</b>, sin 37° = 0,6 ve cos 37° = 0,8 alınır. Sürtünmenin neye bağlı olduğu ve matematiksel modeli gelecek haftanın konusudur; bu notta sürtünme değerleri soruda verilir.'),

  bolum(1, 'İki tür sürtünme: statik ve kinetik', `
<p>Sürtünme kuvveti, birbirine değen iki yüzey arasında, yüzeye paralel etki eder. Yüzeyler birbirine göre <b>kaymıyorsa</b> statik ($f_s$), <b>kayıyorsa</b> kinetik ($f_k$) sürtünme vardır.</p>
${sekil(fUcDurum(160), '5 kg kutu, en büyük statik sürtünme 30 N, kinetik sürtünme 20 N. Oklar kuvvetlerle orantılı çizildi.')}
<table class="t"><tr><th></th><th>Statik sürtünme ($f_s$)</th><th>Kinetik sürtünme ($f_k$)</th></tr>
<tr><td><b>Ne zaman?</b></td><td>Yüzeyler birbirine göre kaymazken</td><td>Yüzeyler birbirine göre kayarken</td></tr>
<tr><td><b>Büyüklüğü</b></td><td>Kaymayı önleyecek kadar: sıfırdan en büyük değerine kadar değişir</td><td>Sabittir, cismin hızına bağlı değildir</td></tr>
<tr><td><b>Yönü</b></td><td>Kayma eğilimine zıt</td><td>Kayma yönüne zıt</td></tr>
<tr><td><b>Karşılaştırma</b></td><td colspan="2">Kinetik sürtünme, en büyük statik sürtünmeden küçüktür. Bu yüzden ağır bir dolabı <b>kımıldatmak</b>, kaydırmaya <b>devam etmekten</b> zordur.</td></tr></table>`),

  bolum(2, 'Sürtünme–kuvvet grafiği', `
<div class="ikili s"><div>${sekil(fGrafik(74), 'Yatay kuvvet sıfırdan yavaş yavaş artırılıyor.')}</div><div>
<p><b>Eğik doğru (statik):</b> Kutu durdukça bileşke kuvvet sıfırdır, sürtünme uygulanan kuvvete eşittir: $f = F$.</p>
<p><b>Kırılma noktası:</b> F, 30 N’u geçince kutu kaymaya başlar. Sürtünme 30 N’dan 20 N’a düşer.</p>
<p><b>Yatay doğru (kinetik):</b> Kutu kayarken F ne olursa olsun sürtünme 20 N’dur. Fazlası kutuyu hızlandırır.</p></div></div>
<table class="t"><tr><th>F (N)</th><th>10</th><th>20</th><th>30</th><th>40</th><th>50</th></tr>
<tr><td>Durum</td><td>duruyor</td><td>duruyor</td><td>kaymak üzere</td><td>kayıyor</td><td>kayıyor</td></tr>
<tr><td>f (N)</td><td>10 (statik)</td><td>20 (statik)</td><td>30 (en büyük statik)</td><td>20 (kinetik)</td><td>20 (kinetik)</td></tr>
<tr><td>a (m/s²), 5 kg</td><td>0</td><td>0</td><td>0</td><td>$\\dfrac{40 - 20}{5} = 4$</td><td>$\\dfrac{50 - 20}{5} = 6$</td></tr></table>`),

  bolum(3, 'Sürtünmenin yönü: harekete değil kaymaya zıt', `
<div class="ikili s"><div>${sekil(fEgik(78, 5), 'Eğik düzlemde duran 5 kg kutu. Kesikli ok, ağırlığın eğim boyunca bileşeni.')}</div><div>
<p>Kutu duruyor, ama ağırlığın eğim boyunca $50 \\times 0{,}6 = 30$ N’luk bileşeni onu aşağı kaydırmaya çalışıyor. Bu <b>kayma eğilimidir</b>.</p>
<p>Statik sürtünme bu eğilime zıt, yani <b>eğim boyunca yukarı</b> ve $f_s = 30$ N olur. Eğime dik: $N = 50 \\times 0{,}8 = 40$ N.</p></div></div>
<table class="t"><tr><th>Durum</th><th>Sürtünme türü</th><th>Cisme etki eden sürtünmenin yönü</th></tr>
<tr><td>Yürüyen insanın ayağı (kaymıyor)</td><td>Statik</td><td><b>İleri</b>: ayak yeri geri iter, yer ayağı ileri iter</td></tr>
<tr><td>Hızlanan kamyonetin kasasında kaymayan kutu</td><td>Statik</td><td><b>İleri</b>: kutuyu kamyonetle birlikte hızlandırır</td></tr>
<tr><td>Kaymadan dönen bisiklet tekerinin yere değen noktası</td><td>Statik</td><td>O nokta zemine göre o an durur</td></tr>
<tr><td>Fren yapılıp kilitlenen, yerde kayan teker</td><td>Kinetik</td><td>Kayma yönüne zıt, yani geri</td></tr></table>
${kutu('sari', 'Kural', 'Sürtünme, yüzeylerin <b>birbirine göre</b> kayma ya da kayma eğilimi yönüne zıttır. Cismin hareket yönüne zıt olması gerekmez.')}`),

  bolum(4, 'Sürtünmeli yüzeyde Newton’ın II. yasası', `
<div class="ikili s"><div>${sekil(fKayan(72), '4 kg kutu, 28 N kuvvetle çekiliyor. Kinetik sürtünme 12 N.')}</div><div>
${kutu('ana', 'Kayan cisim', 'Hareket yönü pozitif: $F_{net} = F - f_k$<br>$a = \\dfrac{28 - 12}{4} = 4$ m/s²')}
${kutu('ana', 'Sabit hız', 'Kayan kutu $F = f_k = 12$ N ile çekilirse $F_{net} = 0$ olur. Kutu durmaz, <b>sabit hızla</b> gider.')}
${kutu('ana', 'Kuvvet kesilince', 'Tek yatay kuvvet sürtünmedir: $a = 12 / 4 = 3$ m/s², hıza zıt. Kutu yavaşlar ve durur. Durunca sürtünme sıfır olur.')}
</div></div>`),

  hatalar([
    ['Duran cisme etki eden statik sürtünme her zaman en büyük değerindedir.', 'Statik sürtünme, kaymayı önleyecek kadardır. 30 N sınırlı kutu 10 N’la itilirse sürtünme 10 N olur.'],
    ['Sürtünme her zaman hareket yönüne zıttır.', 'Kayma ya da kayma eğilimi yönüne zıttır. Yürürken ve hızlanan kamyonetteki kutuda sürtünme hareket yönündedir.'],
    ['Cisim hareket ediyorsa uygulanan kuvvet sürtünmeden büyüktür.', 'Sabit hızla kayan cisimde bileşke kuvvet sıfırdır: $F = f_k$.'],
    ['Kuvvet en büyük statik sürtünmeyi geçince sürtünme de artmaya devam eder.', 'Cisim kayınca sürtünme kinetiğe döner, düşer ve sabit kalır.'],
    ['Cisim hızlandıkça kinetik sürtünme de büyür.', 'Kinetik sürtünme cismin hızına bağlı değildir. 2 m/s ile de 8 m/s ile de aynıdır.'],
  ]),

  ornek(1, 'TAŞINMA GÜNÜ', `
<p>Defne ve abisi 50 kg kütleli bir dolabı yatay zeminde kaydırmak istiyor. Dolabı kımıldatmak için 200 N’dan büyük kuvvet gerekiyor, kayan dolabı itmek için ise 150 N’luk kuvvet yetiyor. Kuvvetler yatay doğrultudadır.</p>
<p><b>a) Defne tek başına 120 N’la itiyor.</b> 120 &lt; 200, dolap kımıldamaz. Sürtünme statiktir ve itmeye eşittir: $f_s = 120$ N, itmeye zıt yönde.</p>
<p><b>b) İkisi birlikte toplam 250 N’la itiyor.</b> 250 &gt; 200, dolap kayar ve sürtünme kinetiğe döner: $f_k = 150$ N. $a = \\dfrac{250 - 150}{50} = 2$ m/s².</p>
<p><b>c) Dolap kaymaya başladıktan sonra abi bırakıyor, Defne 150 N’la itmeye devam ediyor.</b> $F = f_k$, bileşke sıfır: dolap <b>sabit hızla</b> kayar. Kımıldatmak için ikisi gerekti, kaydırmayı sürdürmek için biri yetiyor.</p>`),

  ornek(2, 'KAMYONETİN KASASI (MEB TARZI)', `
<div class="ikili s"><div>
<p>Yatay yolda duran bir kamyonet 2 m/s² ivmeyle hızlanıyor. Kasadaki 20 kg kutu kasaya göre kaymıyor. Kutu ile kasa arasındaki en büyük statik sürtünme 60 N’dur.</p>
<p><b>a) Sürtünmenin yönü.</b> Kutu kamyonetle birlikte ileri doğru hızlanıyor. Yatayda kutuya tek kuvvet sürtünmedir, öyleyse sürtünme <b>ileri</b> (hareket yönünde).</p>
<p><b>b) Büyüklüğü.</b> $f_s = ma = 20 \\times 2 = 40$ N. Sınır 60 N’dan küçük olduğu için kutu kaymaz.</p>
<p><b>c) Kamyonet en fazla kaç m/s² ivmeyle hızlanırsa kutu kaymaz?</b> $a = \\dfrac{60}{20} = 3$ m/s².</p>
</div><div>${sekil(fKamyon(76))}</div></div>`),

  `<h2 class="b"><span class="n">?</span>Sorular</h2>`,
  soru(1, { metin: 'Yatay zemindeki bir bloğa uygulanan yatay kuvvet sıfırdan başlayarak yavaş yavaş artırılıyor. Bloğa etki eden sürtünme kuvvetinin uygulanan kuvvete göre grafiği şekildeki gibidir.', sekil: fGrafikS1(64),
    kok: 'Buna göre<br>I. En büyük statik sürtünme kuvveti 24 N’dur.<br>II. Uygulanan kuvvet 16 N iken sürtünme kuvveti 16 N’dur.<br>III. Uygulanan kuvvet 32 N iken sürtünme kuvveti 32 N’dur.<br>yargılarından hangileri doğrudur?',
    siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'II ve III', 'I, II ve III'], k: 5 }),
  soru(2, { metin: '1 kg kütleli bir kitap, şekildeki gibi düşey duvara 30 N’luk yatay kuvvetle bastırılarak hareketsiz tutuluyor.', sekil: fDuvar(32),
    kok: 'Bastırma kuvveti 50 N’a çıkarılırsa kitaba etki eden sürtünme kuvvetinin büyüklüğü ve yönü ne olur?',
    siklar: ['10 N, yukarı', '10 N, aşağı', '30 N, yukarı', '50 N, yukarı', 'Sıfır'] }),
  soru(3, { metin: 'Eğim açısı 37° olan eğik düzlem üzerindeki 4 kg kütleli kutu hareketsiz durmaktadır.', sekil: fEgik(50, 4, false),
    kok: 'Kutuya etki eden sürtünme kuvvetinin büyüklüğü ve yönü nedir?', k: 2,
    siklar: ['24 N, eğim boyunca yukarı', '24 N, eğim boyunca aşağı', '32 N, eğim boyunca yukarı', '40 N, eğim boyunca yukarı', 'Sıfır, kutu durduğu için'] }),
  soru(4, { metin: 'Yatay zeminde kayan 3 kg kütleli bir blok, 12 N’luk yatay kuvvetle çekildiğinde sabit hızla hareket ediyor.', kok: 'Çekme kuvveti 21 N’a çıkarılırsa bloğun ivmesi kaç m/s² olur?',
    siklar: ['0', '3', '4', '7', '11'], k: 5 }),
  soru(5, { metin: 'Bir öğrenci, ayakkabısı yerde kaymadan düz bir yolda yürüyor.', kok: 'Buna göre<br>I. Yerin ayağa uyguladığı sürtünme kuvveti statik sürtünmedir.<br>II. Yerin ayağa uyguladığı sürtünme kuvveti yürüme yönündedir.<br>III. Zemin ne kadar kaygansa yürümeye başlamak o kadar kolaydır.<br>yargılarından hangileri doğrudur?',
    siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5 }),
  soru(6, { metin: 'Yatay zeminde 6 m/s hızla kayan 5 kg kütleli kutuyu iten kuvvet kesiliyor. Kutu ile zemin arasındaki kinetik sürtünme kuvveti 10 N’dur.', kok: 'Kutu, kuvvet kesildikten kaç saniye sonra durur?',
    siklar: ['1', '2', '3', '5', '6'], k: 5 }),
  soru(7, { metin: 'Düz yolda giden bir kamyonet fren yaparak 5 m/s² ivmeyle yavaşlıyor. Kasasındaki 10 kg kütleli sandık kasaya göre kaymıyor.', kok: 'Sandığa etki eden sürtünme kuvvetinin büyüklüğü ve yönü nedir?', k: 2,
    siklar: ['50 N, kamyonetin hareket yönünde', '50 N, kamyonetin hareket yönüne zıt', '100 N, kamyonetin hareket yönüne zıt', '5 N, kamyonetin hareket yönüne zıt', 'Sıfır, sandık kaymadığı için'] }),
  soru(8, { metin: `Zeynep yatay masadaki tahta bloğu kuvvetölçerle yatay doğrultuda çekiyor ve ölçümlerini tabloya yazıyor.${tKuvvetolcer}`,
    kok: 'Buna göre<br>I. Kuvvet 10 N iken sürtünme kuvveti 10 N’dur.<br>II. Blok kayarken 13 N’luk kuvvetle çekilirse sürtünme kuvveti 13 N olur.<br>III. Kinetik sürtünme kuvveti, en büyük statik sürtünme kuvvetinden küçüktür.<br>yargılarından hangileri doğrudur?',
    siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5 }),
  soru(9, { metin: 'Yatay zeminde duran 2 kg kütleli bloğa yatay F kuvveti uygulanıyor. Blok ile zemin arasındaki en büyük statik sürtünme kuvveti 16 N, kinetik sürtünme kuvveti 12 N’dur. Bir denemede F = 10 N, başka bir denemede F = 20 N uygulanıyor.', sekil: fBlok(42),
    kok: 'F = 10 N iken bloğa etki eden sürtünme kuvveti ve F = 20 N iken bloğun ivmesi nedir?', k: 2,
    siklar: ['10 N; 4 m/s²', '16 N; 2 m/s²', '10 N; 10 m/s²', '12 N; 4 m/s²', 'Sıfır; 4 m/s²'] }),
  soru(10, { metin: '<b>Açık uçlu (10 puan).</b> Yatay zemindeki 5 kg kütleli kutuya uygulanan yatay kuvvet sıfırdan başlayarak yavaş yavaş artırılıyor. Kutu, kuvvet 25 N’u geçince harekete geçiyor. Kutu kayarken ona etki eden sürtünme kuvveti 15 N’dur.',
    kok: 'a) Kuvvet 10 N iken kutuya etki eden sürtünme kuvvetinin türünü, büyüklüğünü ve yönünü yazınız. <span style="white-space:nowrap">(2 puan)</span><br>b) Uygulanan kuvvet 0 ile 40 N arasında değişirken sürtünme kuvveti–uygulanan kuvvet grafiğini çiziniz. <span style="white-space:nowrap">(3 puan)</span><br>c) Kuvvet 35 N iken kutunun ivmesini bulunuz. <span style="white-space:nowrap">(3 puan)</span><br>d) Kayan kutunun sabit hızla gitmesi için uygulanan kuvvet kaç N olmalıdır? Gerekçesiyle yazınız. <span style="white-space:nowrap">(2 puan)</span>', ek: '<div style="height:10mm"></div>' }),

  cevaplar([
    ['C', 'Grafikteki tepe noktası en büyük statik sürtünmedir: 24 N (I doğru). 16 N’da blok henüz kaymaz, sürtünme kuvvete eşittir (II doğru). 32 N’da blok kayar, sürtünme kinetiktir: 16 N (III yanlış).'],
    ['A', 'Kitap düşeyde duruyor: sürtünme ağırlığı dengeler, $f_s = mg = 10$ N, yukarı. 50 N’la bastırılınca da kitap durur ve düşeyde yine ağırlığı dengeleyecek kadar sürtünme gerekir: 10 N.'],
    ['A', 'Ağırlık 40 N. Eğim boyunca aşağı bileşen $40 \\times 0{,}6 = 24$ N kutuyu kaydırmaya çalışır. Kutu durduğuna göre statik sürtünme bu bileşene eşit ve zıt: 24 N, eğim boyunca yukarı. (32 N, normal kuvvettir.)'],
    ['B', 'Sabit hızda $F = f_k$, yani $f_k = 12$ N. 21 N’la: $a = \\dfrac{21 - 12}{3} = 3$ m/s². Kinetik sürtünme kuvvet artınca değişmez.'],
    ['C', 'Ayak kaymadığı için sürtünme statiktir (I). Ayak yeri geri iter, yer ayağı ileri iter (II). Kaygan zeminde en büyük statik sürtünme küçüktür, ayak kayar ve yürümeye başlamak zorlaşır (III yanlış).'],
    ['C', 'Yatayda tek kuvvet sürtünme: $a = 10 / 5 = 2$ m/s², hıza zıt. Hız her saniye 2 m/s azalır: $t = 6 / 2 = 3$ s.'],
    ['B', 'Sandık kamyonetle birlikte 5 m/s² ile yavaşlıyor; ivmesi hareket yönüne zıt. Yatayda tek kuvvet sürtünme: $f_s = ma = 10 \\times 5 = 50$ N, hareket yönüne zıt.'],
    ['D', '10 N’da blok durur, sürtünme kuvvete eşittir (I doğru). Blok kayarken sürtünme kinetiktir ve sabittir: 11 N, 13 N değil (II yanlış). Kinetik 11 N, en büyük statik 14 N (III doğru).'],
    ['A', 'F = 10 N &lt; 16 N: blok kaymaz, $f_s = 10$ N. F = 20 N &gt; 16 N: blok kayar, $f_k = 12$ N, $a = \\dfrac{20 - 12}{2} = 4$ m/s².'],
    ['–', 'a) 10 &lt; 25, kutu durur: <b>statik</b> sürtünme, 10 N, uygulanan kuvvete zıt. (2 puan) b) 0–25 N arası $f = F$ doğrusu; 25 N’da sürtünme 15 N’a düşer; 25–40 N arası 15 N’da yatay doğru. (3 puan) c) Kutu kayar: $a = \\dfrac{35 - 15}{5} = 4$ m/s². (3 puan) d) 15 N. Kayan kutuda bileşke sıfır olursa hız değişmez: $F = f_k = 15$ N. (2 puan)'],
  ]),
  sonraki('Sürtünme kuvvetinin matematiksel modeli: sürtünme neye bağlı?'),
].join('\n');

// --- Instagram slaytları ---
const slaytlar = [
  { pill: 'İKİ TÜR SÜRTÜNME', h: 'Kımıldatmak neden <em>daha zor?</em>', svg: fUcDurum(), bd: 'Duran kutuda <b>statik</b> sürtünme itme kadar. Kayınca <b>kinetik</b> sürtünmeye döner ve küçülür.' },
  { pill: 'GRAFİK', h: 'Sürtünme <em>önce artar, sonra düşer</em>', svg: fGrafik(), bd: 'Eğik doğru: kutu duruyor, <b>f = F</b>. 30 N’u geçince kayar, sürtünme <b>20 N’da sabit</b>.' },
  { pill: 'STATİK SÜRTÜNME', h: 'Duran cisimde sürtünme <em>kaç N?</em>', lst: ['30 N sınırlı kutuyu 10 N’la it: sürtünme <b>10 N</b>.', '25 N’la it: sürtünme <b>25 N</b>. Kutu hâlâ duruyor.', '30 N bir <b>sınır</b>dır, her zaman o değer değil.', 'Kural: kutu duruyorsa bileşke sıfır, <b>f = F</b>.'] },
  { pill: 'YÖN', h: 'Sürtünme hep <em>geriye</em> mi?', lst: ['<b>Yürürken:</b> ayak yeri geri iter, yer ayağı <b>ileri</b> iter.', '<b>Hızlanan kamyonetteki kutu:</b> sürtünme <b>ileri</b>, kutuyu hızlandırır.', '<b>Eğik düzlemde duran kutu:</b> sürtünme eğim boyunca <b>yukarı</b>.', 'Sürtünme <b>kaymaya</b> zıttır, harekete değil.'] },
  { pill: 'KAYARKEN', h: 'Sürtünmeli yüzeyde <em>F&nbsp;=&nbsp;ma</em>', svg: fKayan(), bd: '$a = \\dfrac{28 - 12}{4} =$ <b>4 m/s²</b>. 12 N’la çekilirse <b>sabit hız</b>.' },
  { pill: 'DİKKAT', h: 'En sık <em>3 hata</em>', lst: ['<span class="x">✗</span> Duran cisimde sürtünme hep en büyük değerde.<br><span class="v">✓</span> Kaymayı önleyecek kadar.', '<span class="x">✗</span> Hareket varsa $F > f$.<br><span class="v">✓</span> Sabit hızda $F = f_k$.', '<span class="x">✗</span> Hız artınca kinetik sürtünme artar.<br><span class="v">✓</span> Hıza bağlı değil.'] },
  { pill: 'SIRA SENDE', h: 'Bastırmayı artır: <em>sürtünme?</em>', bd: '1 kg kitap duvara 30 N’la bastırılıp tutuluyor. Bastırma 50 N olursa sürtünme ne olur?', svg: fDuvar().replace('max-width:100%', 'max-width:100%;max-height:330px'), sik: ['10 N, yukarı', '10 N, aşağı', '30 N, yukarı', '50 N, yukarı', 'Sıfır'], bant: ['Cevabını yorumlara yaz 👇', 'Çözüm PDF’te'] },
  { pill: 'GÜNLÜK HAYATTA', h: 'Dolabı kaydırmak <em>kaç kişilik iş?</em>', lst: ['50 kg dolap: kımıldatmak için <b>200 N’dan fazla</b>, kaydırmak için <b>150 N</b>.', 'Tek kişi 120 N: dolap durur, sürtünme <b>120 N</b>.', 'İki kişi 250 N: dolap kayar, $a = 100 / 50 =$ <b>2 m/s²</b>.', 'Kaydıktan sonra <b>150 N’la tek kişi</b> sabit hızla iter.'] },
];

module.exports = {
  sinif: 11, no: 5, gun: 'Cuma',
  slug: '11-fizik-notlari-5-statik-ve-kinetik-surtunme',
  konuKisa: 'Statik ve kinetik sürtünme',
  pdfBaslik: 'Statik ve Kinetik Sürtünme Kuvvetleri',
  baslik: 'Statik ve Kinetik Sürtünme Kuvvetleri',
  alt: 'İki tür sürtünmenin karşılaştırması, sürtünme–kuvvet grafiği, sürtünmenin yönü ve sürtünmeli yüzeyde Newton’ın II. yasası. Konu özeti, sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
  slaytBaslik: 'Statik ve kinetik <span style="color:#8b5cf6">sürtünme</span>',
  slaytAlt: 'Kımıldatmak neden kaydırmaktan zor?',
  promoKonu: 'Sürtünme kuvveti',
  pdfOzet: 'Özet, 5 sık hata, 2 çözümlü örnek, <b>10 soru ve çözümleri.</b>',
  govde, slaytlar,
  aciklama: `
Ağır bir dolabı kımıldatmak neden kaydırmaya devam etmekten zordur? 🤔 Cevap iki tür sürtünmede.

Kaydırınca: statik ve kinetik sürtünme, sürtünme–kuvvet grafiği, sürtünmenin yönü (hep geriye mi?), sürtünmeli yüzeyde F = ma, en sık 3 hata ve bir mini soru.

Notun tamamı ücretsiz PDF: özet, 5 sık hata, 2 çözümlü örnek, 10 soru ve çözümleri.
1) Takip et
2) Profildeki linke dokun
3) 11. sınıf bölümünden notu indir (üyelik yok)

7. slayttaki sorunun cevabını yorumlara yaz 👇
Her Cuma 11. sınıf için yeni not.

#11sınıf #11sınıffizik #maarifmodeli #fizik #fiziknotları #sürtünmekuvveti #newtonunyasaları #benfizikyapamiyorum`,
  ilkYorum: '📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf · 7. slaytın cevabı PDF’in çözüm sayfasında (2. soru). Gelecek hafta: sürtünme kuvvetinin matematiksel modeli.',
  hub: {
    etiket: '11. SINIF · MAARİF MODELİ · NOT #5',
    baslik: 'Statik ve kinetik sürtünme kuvvetleri',
    aciklama: 'İki tür sürtünme, sürtünme–kuvvet grafiği, sürtünmenin yönü ve sürtünmeli yüzeyde F = ma. Sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
    takvimLink: 'Not #5 · Statik ve kinetik sürtünme ↓',
    tarih: '2026-11-27',
    devam: { href: '/11-sinif-fizik-paketi.html', img: '/img/fizik11/set.webp', lab: 'not11_yap', b: 'Devamı: Yapabilirim 11 · Sürtünme kuvveti', span: 'Konu notu, kavram kartları, yeni nesil sorular, adım adım çözümler', em: '₺599 →' },
  },
};
