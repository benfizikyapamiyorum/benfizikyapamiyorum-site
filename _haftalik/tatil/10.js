// 10. sınıf | Ara Tatil Fizik Kampı | Kapsam: yatay doğrultuda sabit hızlı hareket, sabit ivmeli hareket, iş, güç
// g = 10 m/s². Sürtünme yalnız söylendiği yerde var. Açılı kuvvet yok: kuvvetler yer değiştirmeye paralel ya da dik.
const { bolum, kutu, formul, sekil, ikili, uclu, hata } = require('./lib');
const R = require('./real');
const { C, S, T, OK, OLCU, ROZET } = R;
const alt = (a, b) => `${a}<tspan dy="4" font-size="68%">${b}</tspan><tspan dy="-4" font-size="1"> </tspan>`;
const V = 'ϑ';
const nb = t => `<span style="white-space:nowrap">${t}</span>`;
const soluk = (svg, op = .4) => `<g opacity="${op}">${svg}</g>`;

// ---------- Yerel sahne parçaları ----------
// Yol sahnesi: gökyüzü, asfalt şerit ve altında açık renkli kaldırım (ölçü ve etiketler kaldırıma yazılır).
function YOL(w, h, o = {}) {
  const kh = o.kh === undefined ? 28 : o.kh, ah = o.ah || 30, yolY = h - kh - ah, altY = h - kh;
  let kal = `<rect x="0" y="${altY}" width="${w}" height="${kh}" fill="#e9edf3"/><rect x="0" y="${altY}" width="${w}" height="3.5" fill="#b9c2d0"/>`;
  for (let x = 30; x < w; x += 46) kal += `<line x1="${x}" y1="${altY + 3.5}" x2="${x}" y2="${h}" stroke="#d3dae5" stroke-width="1"/>`;
  const s = R.SAHNE(w, h, { tur: 'zemin', zh: 0.01, arka: (o.arka || '') + R.ZEMIN(0, w, yolY, { tur: 'asfalt', h: ah }) + kal });
  return { b: s.b, yolY, altY, cerceve: s.cerceve };
}
// Kule vinç: (x, yer) kule tabanı, H yükseklik. yon -1: bom sola uzanır. kx: arabanın kuleye uzaklığı, ky: halatın indiği seviye.
function VINC(x, yer, H, o = {}) {
  const yon = o.yon || -1, jl = o.jib || 100, cj = o.karsi || 34, mw = o.mw || 13;
  const top = yer - H, yJ = top + 22, yT = yJ - 8, sar = '#f5b301', sk = '#946200';
  const cift = (x1, y1, x2, y2, a = 4, b = 2.4) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sk}" stroke-width="${a}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sar}" stroke-width="${b}" stroke-linecap="round"/>`;
  let s = `<ellipse cx="${x}" cy="${yer + 1}" rx="26" ry="4" fill="#0f172a" opacity=".2" filter="url(#yumusak)"/>`;
  const y0 = yer - 9, n = Math.max(3, Math.round((y0 - yJ) / (mw * 1.15))), sg = (y0 - yJ) / n;
  let d = '';
  for (let i = 0; i < n; i++) { const ya = y0 - i * sg, yb = ya - sg; d += `M ${x - mw / 2} ${ya} L ${x + mw / 2} ${yb} M ${x + mw / 2} ${ya} L ${x - mw / 2} ${yb} M ${x - mw / 2} ${yb} H ${x + mw / 2} `; }
  s += `<rect x="${x - mw / 2}" y="${yJ}" width="${mw}" height="${y0 - yJ}" fill="#fff3c4" opacity=".6"/><path d="${d}" stroke="${sk}" stroke-width="1" fill="none"/>`;
  s += cift(x - mw / 2, y0, x - mw / 2, yT) + cift(x + mw / 2, y0, x + mw / 2, yT);
  // gergi halatları ve tepe
  const xe = x + yon * jl, xc = x - yon * cj;
  s += `<line x1="${x}" y1="${top}" x2="${x + yon * jl * 0.78}" y2="${yT}" stroke="#475569" stroke-width="1.2"/><line x1="${x}" y1="${top}" x2="${xc}" y2="${yJ}" stroke="#475569" stroke-width="1.2"/>`;
  s += `<path d="M ${x - mw / 2} ${yT} L ${x} ${top} L ${x + mw / 2} ${yT} Z" fill="${sar}" stroke="${sk}" stroke-width="1.2" stroke-linejoin="round"/>`;
  // bom
  const m = Math.max(4, Math.round(jl / 10)), st = (xe - x) / m; let dj = '';
  for (let i = 0; i < m; i++) dj += `M ${x + i * st} ${yJ} L ${x + (i + .5) * st} ${yT} L ${x + (i + 1) * st} ${yJ} `;
  s += `<path d="${dj}" stroke="${sk}" stroke-width="1" fill="none"/>` + cift(x, yT, xe - st * .5, yT, 3, 1.6) + cift(xc, yJ, xe, yJ);
  // karşı ağırlık, kabin, temel
  s += `<rect x="${yon < 0 ? xc - 15 : xc}" y="${yJ + 1}" width="15" height="12" rx="1.5" fill="url(#gBeton)" stroke="#64748b" stroke-width="1"/>`;
  s += `<rect x="${yon < 0 ? x - mw / 2 - 11 : x + mw / 2}" y="${yJ + 3}" width="11" height="12" rx="2" fill="#fff" stroke="#475569" stroke-width="1"/><rect x="${yon < 0 ? x - mw / 2 - 9 : x + mw / 2 + 2}" y="${yJ + 5}" width="7" height="5.5" rx="1" fill="url(#gCam)"/>`;
  s += `<rect x="${x - 17}" y="${yer - 9}" width="34" height="9" rx="1.5" fill="url(#gBeton)" stroke="#64748b" stroke-width="1"/>`;
  if (o.kx) { const tx = x + yon * o.kx; s += `<rect x="${tx - 5}" y="${yJ + 1}" width="10" height="4" rx="1" fill="#334155"/><line x1="${tx}" y1="${yJ + 5}" x2="${tx}" y2="${o.ky}" stroke="#334155" stroke-width="1.5"/><path d="M ${tx - 4} ${o.ky} h 8" stroke="#334155" stroke-width="2.6" stroke-linecap="round"/>`; }
  return s;
}
// Su ısıtıcısı: (x, y) tabanın ortası, boy yaklaşık 84k px.
function ISITICI(x, y, k = 1) {
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="2" cy="1" rx="36" ry="4.5" fill="#0f172a" opacity=".22" filter="url(#yumusak)"/>
<path d="M 22 -62 Q 50 -62 47 -34 Q 45 -14 26 -12" fill="none" stroke="#111827" stroke-width="8" stroke-linecap="round"/><path d="M 24 -63 Q 46 -62 44 -38" fill="none" stroke="#4b5563" stroke-width="1.6" stroke-linecap="round"/>
<path d="M -23 -62 L -37 -68 L -33 -56 L -24 -50 Z" fill="url(#gMetalD)" stroke="#475569" stroke-width="1.1" stroke-linejoin="round"/>
<path d="M -27 -7 L -23 -64 Q -22 -72 -12 -72 L 12 -72 Q 22 -72 23 -64 L 27 -7 Z" fill="url(#gMetalD)" stroke="#475569" stroke-width="1.3"/>
<rect x="-17" y="-64" width="5" height="50" rx="2.5" fill="#fff" opacity=".55"/>
<rect x="5" y="-56" width="8" height="38" rx="4" fill="#eaf6ff" stroke="#31506b" stroke-width=".9"/><rect x="6" y="-40" width="6" height="21" rx="3" fill="url(#gSu)"/>
<path d="M -14 -72 Q 0 -83 14 -72 Z" fill="#1f2937"/><circle cx="0" cy="-80" r="3.2" fill="#111827"/>
<rect x="-31" y="-7" width="62" height="8" rx="3.5" fill="#1f2937"/><rect x="-29" y="-6" width="58" height="2" rx="1" fill="#fff" opacity=".18"/><circle cx="16" cy="-3" r="1.9" fill="#f97316"/></g>`;
}
// Güç etiketi: metal plaka, dört vida. satirlar: [alet adı, gerilim satırı, güç]
function ETIKET(x, y, w, h, [ad, volt, guc], o = {}) {
  let s = `<g filter="url(#golge)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="url(#gMetal)" stroke="#64748b" stroke-width="1.3"/></g><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="4.5" fill="#f8fafc" opacity=".82" stroke="#cbd5e1" stroke-width=".8"/>`;
  [[9, 9], [w - 9, 9], [9, h - 9], [w - 9, h - 9]].forEach(([a, b]) => { s += `<circle cx="${x + a}" cy="${y + b}" r="2.4" fill="#94a3b8" stroke="#475569" stroke-width=".8"/><line x1="${x + a - 1.5}" y1="${y + b - 1.5}" x2="${x + a + 1.5}" y2="${y + b + 1.5}" stroke="#475569" stroke-width=".8"/>`; });
  const b = o.buyuk || 21;
  s += T(x + w / 2, y + h * 0.27, ad, { size: o.size || 11.5, halo: false, c: '#334155' }) + T(x + w / 2, y + h * 0.27 + 14, volt, { size: 9.5, w: 600, halo: false, c: '#64748b' });
  s += `<line x1="${x + 18}" y1="${y + h * 0.27 + 20}" x2="${x + w - 18}" y2="${y + h * 0.27 + 20}" stroke="#cbd5e1" stroke-width="1"/>` + T(x + w / 2, y + h - 12, guc, { size: b, halo: false });
  return s;
}

// ---------- Şekiller ----------
// Kapak: durgun hâlden 4 m/s² ivmeyle hızlanan otomobil (t = 1, 2, 3 s). Ölçek 25 px/m: konumlar 2, 8, 18 m. Arkada yük kaldıran vinç.
const kapak = (() => {
  const w = 720, h = 330, kh = 46, ah = 38, yolY = h - kh - ah;
  let arka = R.GUNES(92, 54, 24) + R.BULUT(300, 50, 1.2) + R.BULUT(455, 96, .8) + R.BULUT(205, 104, .6);
  arka += soluk(R.BINA(-6, yolY, 150, 34, { kat: 1, sutun: 6 }) + R.BINA(146, yolY, 40, 124, { sutun: 2 }) + R.BINA(196, yolY, 124, 30, { kat: 1, sutun: 5 }) + R.BINA(330, yolY, 62, 156, { sutun: 3 }) + R.BINA(402, yolY, 60, 98, { sutun: 3 }) + R.BINA(472, yolY, 150, 32, { kat: 1, sutun: 6 }), .62);
  const y = YOL(w, h, { kh, ah, arka });
  const yb = y.yolY + 14, x0 = 40, k = 25;
  let b = y.b + `<rect x="${x0 - 2}" y="${y.yolY}" width="4" height="${ah}" fill="#fff" opacity=".9"/>`;
  // vinç ve yük
  const vx = 664, tx = vx - 84, ky = 112;
  b += VINC(vx, y.yolY, 214, { jib: 118, karsi: 34, kx: 84, ky }) + R.KUTU(tx - 15, ky, 30, 26, { d: 5, golge: false });
  b += OK(tx - 26, ky + 30, tx - 26, ky - 8, C.pembe, { w: 4.5, hd: 12 }) + T(tx - 36, ky + 18, 'F', { a: 'end', c: C.pembe, size: 17, it: true });
  b += ROZET(tx - 12, 82, 'İş: W = F Δx', C.pembe, { a: 'end', size: 13.5 });
  [[1, .42], [2, .68], [3, 1]].forEach(([t, op]) => {
    const x = x0 + 2 * t * t * k, L = 4 * t * 8, car = R.ARABA(x, yb, { k: .9, renk: '#e11d48' });
    b += `<line x1="${x}" y1="${yb + 4}" x2="${x}" y2="${y.altY + 10}" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 3" opacity=".9"/>`;
    b += (op < 1 ? soluk(car, op) : car);
    b += OK(x, yb - 56, x + L, yb - 56, C.mavi, { w: 5, hd: 13 }) + T(x + L / 2, yb - 67, `${V} = ${4 * t} m/s`, { c: C.mavi, size: 15 });
    b += ROZET(x + L / 2, yb - 94, `t = ${t} s`, C.koyu, { size: 13 });
  });
  [[0, 1, '2 m'], [1, 2, '6 m'], [2, 3, '10 m']].forEach(([a, c, lab]) => { b += OLCU(x0 + 2 * a * a * k, y.altY + 14, x0 + 2 * c * c * k, y.altY + 14, lab, { size: 14, c: '#475569', tc: C.koyu, d: 12 }); });
  b += T(w - 84, y.altY + 28, 'a = 4 m/s²', { a: 'end', c: C.turuncu, size: 15 }) + OK(w - 74, y.altY + 23, w - 18, y.altY + 23, C.turuncu, { w: 4.5, hd: 12 });
  return S(w, h, 180, b + y.cerceve);
})();

// Gün 1: konum şeridi. Ölçek 15 px/m (otomobil 4,5 m). Araç 5 m → 20 m → 10 m.
const fKonum = (mm = 88) => {
  const w = 400, h = 216, y = YOL(w, h, { kh: 52, ah: 28, arka: R.BULUT(330, 34, .8) + R.BULUT(60, 44, .6) });
  const X = m => 38 + 15 * m, yb = y.yolY + 8; let b = y.b;
  for (let m = 0; m <= 20; m += 5) b += `<line x1="${X(m)}" y1="${y.altY + 3.5}" x2="${X(m)}" y2="${y.altY + 10}" stroke="#475569" stroke-width="1.5"/>` + T(X(m), y.altY + 23, m, { size: 12.5, w: 700, c: '#334155', hw: 3 });
  b += T(X(20) + 18, y.altY + 23, 'x (m)', { a: 'start', size: 12.5 });
  [5, 20, 10].forEach(m => { b += `<line x1="${X(m)}" y1="${yb}" x2="${X(m)}" y2="${y.altY + 3}" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 3"/>`; });
  b += soluk(R.ARABA(X(5), yb, { k: .56, renk: '#e11d48' }), .4) + soluk(R.ARABA(X(20), yb, { k: .56, renk: '#e11d48' }), .4) + R.ARABA(X(10), yb, { k: .56, renk: '#e11d48', yon: -1 });
  b += OK(X(5), 80, X(20), 80, C.yesil, { w: 3.6, hd: 11, dash: '7 4' }) + T(X(12.5), 70, 'gidiş: 15 m', { c: C.yesil, size: 13.5 });
  b += OK(X(20), 100, X(10), 100, C.turuncu, { w: 3.6, hd: 11, dash: '7 4' }) + T(X(10) - 8, 104.5, 'dönüş: 10 m', { a: 'end', c: C.turuncu, size: 13.5 });
  b += OK(X(5), y.altY + 38, X(10), y.altY + 38, C.mavi, { w: 5, hd: 13 }) + T(X(10) + 8, y.altY + 43, 'Δx = +5 m', { a: 'start', c: C.mavi, size: 14 });
  return S(w, h, mm, b + y.cerceve);
};
const gXt1 = (mm = 72) => R.GRAFIK({ xmax: 5, ymax: 100, dx: 1, dy: 20, sx: 40, sy: 1.5, xlab: 't (s)', ylab: 'x (m)', cizgi: [{ pts: [[0, 20], [4, 80]] }], kesik: [[4, 80]], nokta: [[0, 20, C.mavi], [4, 80, C.mavi]], notes: [{ x: 2.9, y: 30, s: 'eğim = 15 m/s', c: C.mavi, size: 13 }], mm });
const gVt1 = (mm = 72) => R.GRAFIK({ xmax: 5, ymax: 20, dx: 1, dy: 5, sx: 40, sy: 7.5, xlab: 't (s)', ylab: `${V} (m/s)`, alan: [{ pts: [[0, 15], [4, 15]], c: C.turuncu }], cizgi: [{ pts: [[0, 15], [4, 15]], c: C.turuncu }], kesik: [[4, 15]], notes: [{ x: 2, y: 6.5, s: 'alan = 60 m', c: C.turuncu, size: 13 }], mm });
// Isınma 1 ve 3
const gS1 = (mm = 62) => R.GRAFIK({ xmax: 10, ymin: -20, ymax: 40, dx: 2, dy: 20, sx: 22, sy: 2, xlab: 't (s)', ylab: 'x (m)', cizgi: [{ pts: [[0, 0], [4, 40], [6, 40], [10, -20]] }], kesik: [[4, 40], [6, 40], [10, -20]], mm });
const gS3 = (mm = 62) => R.GRAFIK({ xmax: 9, ymin: -4, ymax: 8, dx: 1, dy: 4, sx: 23, sy: 9, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: [[0, 8], [3, 8]], c: C.mor }, { pts: [[3, -4], [9, -4]], c: C.mor }], kesik: [[3, 8], [3, -4], [9, -4]], mm });

// Gün 2: hızlanan ve yavaşlayan araç
const fHizYav = (mm = 84) => {
  const w = 360, h = 178, y = YOL(w, h, { kh: 28, ah: 32, arka: R.BULUT(180, 30, .7) }), yb = y.yolY + 10; let b = y.b;
  [[92, 1, 'Hızlanıyor', '#2563eb'], [268, -1, 'Yavaşlıyor', '#0f766e']].forEach(([x, ya, ad, renk]) => {
    b += R.ARABA(x, yb, { k: .85, renk });
    b += OK(x - 36, yb - 56, x + 36, yb - 56, C.mavi, { w: 5.4, hd: 14 }) + T(x + 43, yb - 50, V, { a: 'start', c: C.mavi, size: 19, it: true });
    b += OK(x - 26 * ya, yb - 80, x + 26 * ya, yb - 80, C.turuncu, { w: 5.4, hd: 14 }) + T(x + 34 * ya, yb - 74, 'a', { a: ya > 0 ? 'start' : 'end', c: C.turuncu, size: 19, it: true });
    b += T(x, y.altY + 19, ad, { size: 14.5, c: '#334155' });
  });
  return S(w, h, mm, b + y.cerceve);
};
const gVt2 = (mm = 72) => R.GRAFIK({ xmax: 5, ymax: 24, dx: 1, dy: 6, sx: 40, sy: 6, xlab: 't (s)', ylab: `${V} (m/s)`, alan: [{ pts: [[0, 6], [4, 18]], c: C.mavi }], cizgi: [{ pts: [[0, 6], [4, 18]] }], kesik: [[4, 18]], notes: [{ x: 2.3, y: 4, s: 'alan = 48 m', c: C.mavi, size: 12.5 }, { x: 0.25, y: 20.3, s: 'eğim = 3 m/s²', a: 'start', c: C.koyu, size: 12.5 }], mm });
const gAt2 = (mm = 72) => R.GRAFIK({ xmax: 5, ymax: 4, dx: 1, dy: 1, sx: 40, sy: 36, xlab: 't (s)', ylab: 'a (m/s²)', alan: [{ pts: [[0, 3], [4, 3]], c: C.yesil }], cizgi: [{ pts: [[0, 3], [4, 3]], c: C.yesil }], kesik: [[4, 3]], notes: [{ x: 2, y: 1.35, s: `alan = Δ${V} = 12 m/s`, c: C.yesil, size: 12.5 }], mm });
const gS5 = (mm = 62) => R.GRAFIK({ xmax: 7, ymin: -8, ymax: 20, dx: 1, dy: 4, sx: 28, sy: 5.2, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: [[0, 20], [7, -8]], c: C.mor }], kesik: [[7, -8]], nokta: [[5, 0, C.mor]], mm });
const gS7 = (mm = 62) => R.GRAFIK({ xmax: 8, ymin: -4, ymax: 4, dx: 2, dy: 1, sx: 25, sy: 15, xlab: 't (s)', ylab: 'a (m/s²)', cizgi: [{ pts: [[0, 2], [4, 2]], c: C.yesil }, { pts: [[4, -3], [8, -3]], c: C.yesil }], kesik: [[4, 2], [4, -3], [8, -3]], mm });

// Gün 3: sandık iten kişi. Ölçek 40 px/m, sandık 1 m, Δx = 5 m, 1 N = 1 px.
const fItme = (mm = 92) => {
  const w = 400, h = 172, s = R.SAHNE(w, h, { tur: 'zemin', zh: 40, arka: R.BULUT(330, 30, .7) }), yer = s.yerY; let b = s.b;
  b += `<line x1="60" y1="${yer - 50}" x2="60" y2="${yer - 86}" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/><line x1="260" y1="${yer - 50}" x2="260" y2="${yer - 86}" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  b += OLCU(60, yer - 86, 260, yer - 86, 'Δx = 5 m', { ust: true, size: 14, tc: C.koyu });
  b += soluk(R.KUTU(40, yer - 40, 40, 40), .4) + R.INSAN(215, yer, { kol: 'it', k: .8, renk: '#2563eb' }) + R.KUTU(240, yer - 40, 40, 40);
  b += OK(260, yer - 20, 320, yer - 20, C.pembe, { w: 5, nokta: true }) + T(332, yer - 26, 'F = 60 N', { a: 'start', c: C.pembe, size: 14 });
  b += OK(260, yer - 6, 240, yer - 6, C.kirmizi, { w: 4.4, hd: 11 }) + `<line x1="238" y1="${yer - 6}" x2="196" y2="${yer + 20}" stroke="${C.kirmizi}" stroke-width="1" stroke-dasharray="3 3"/>` + ROZET(150, yer + 22, 'sürtünme: 20 N', C.kirmizi, { size: 12.5 });
  return S(w, h, mm, b + s.cerceve);
};
const kHareket = (x1, x2, y, yaz = 1) => OK(x1, y, x2, y, C.yesil, { w: 3.4, hd: 10, dash: '6 4' }) + T(yaz > 0 ? x2 + 6 : (x1 + x2) / 2, yaz > 0 ? y + 4.5 : y - 9, 'hareket', { a: yaz > 0 ? 'start' : 'middle', c: C.yesil, size: 12.5 });
const fPoz = () => S(200, 100, 46, R.ZEMIN(4, 196, 84, { tur: 'zemin', h: 16 }) + R.KUTU(36, 50, 42, 34, { d: 7 }) + OK(92, 67, 150, 67, C.pembe, { w: 5 }) + T(121, 55, 'F', { c: C.pembe, size: 15, it: true }) + kHareket(40, 100, 26));
const fNeg = () => S(200, 100, 46, R.ZEMIN(4, 196, 84, { tur: 'zemin', h: 16 }) + R.KUTU(84, 50, 42, 34, { d: 7 }) + OK(78, 67, 22, 67, C.kirmizi, { w: 5 }) + T(50, 55, 'F', { c: C.kirmizi, size: 15, it: true }) + kHareket(88, 144, 26));
const fSifir = () => S(200, 100, 46, R.ZEMIN(4, 196, 88, { tur: 'zemin', h: 12 }) + R.INSAN(70, 88, { kol: 'it', k: .8, renk: '#7c3aed' }) + R.KUTU(86, 30, 24, 16, { d: 5, golge: false }) + OK(98, 27, 98, 3, C.pembe, { w: 4.4, hd: 11 }) + T(108, 15, 'F', { a: 'start', c: C.pembe, size: 15, it: true }) + kHareket(126, 182, 62, -1));
const gFx = (mm = 76) => R.GRAFIK({ xmax: 8, ymax: 50, dx: 2, dy: 10, sx: 27, sy: 2.1, xlab: 'x (m)', ylab: 'F (N)', alan: [{ pts: [[0, 40], [4, 40]], c: C.mavi }, { pts: [[4, 40], [8, 0]], c: C.turuncu }], cizgi: [{ pts: [[0, 40], [4, 40], [8, 0]], c: C.koyu }], kesik: [[4, 40]], notes: [{ x: 2, y: 18, s: '160 J', c: C.mavi, size: 14 }, { x: 5.25, y: 9, s: '80 J', c: C.turuncu, size: 14 }], mm });
const gS10 = (mm = 62) => R.GRAFIK({ xmax: 10, ymin: -20, ymax: 60, dx: 2, dy: 10, sx: 21, sy: 1.7, xlab: 'x (m)', ylab: 'F (N)', cizgi: [{ pts: [[0, 50], [4, 50]], c: C.pembe }, { pts: [[4, -20], [10, -20]], c: C.pembe }], kesik: [[4, 50], [4, -20], [10, -20]], mm });
// Isınma 11: 200 kg yükü 15 m kaldıran vinç. Ölçek 14 px/m.
const fVinc = (mm = 52) => {
  const w = 236, h = 300, s = R.SAHNE(w, h, { tur: 'cim', zh: 22, arka: R.BULUT(60, 44, .7) + R.BULUT(196, 130, .5) }), yer = s.yerY, vx = 178, tx = vx - 78, ky = yer - 210 - 18;
  let b = s.b + R.AGAC(218, yer, .5) + VINC(vx, yer, 262, { jib: 100, karsi: 30, kx: 78, ky });
  b += soluk(R.KUTU(tx - 9, yer - 18, 18, 18, { d: 4 }), .45) + R.KUTU(tx - 9, ky, 18, 18, { d: 4, golge: false });
  b += OK(tx, yer - 36, tx, yer - 110, C.mavi, { w: 3.6, hd: 11, dash: '6 4' }) + T(tx + 10, yer - 68, 'sabit hız', { a: 'start', c: C.mavi, size: 14 });
  b += OLCU(tx - 24, yer, tx - 24, yer - 210, 'h = 15 m', { yan: 'sol', size: 14.5, d: 9 }) + T(tx + 15, yer - 5, '200 kg', { a: 'start', size: 14, c: '#334155' });
  return S(w, h, mm, b + s.cerceve);
};

// Gün 4: aynı yük, aynı yükseklik, farklı süre. Ölçek 20 px/m.
const fGuc = (mm = 96) => {
  const w = 420, h = 262, s = R.SAHNE(w, h, { tur: 'cim', zh: 24, arka: R.BULUT(250, 70, .7) }), yer = s.yerY; let b = s.b;
  [[170, '10 s', 'P = 600 W', 60], [372, '30 s', 'P = 200 W', 180]].forEach(([x, sure, guc, aci]) => {
    const tx = x - 66, ky = yer - 140;
    b += VINC(x, yer, 196, { jib: 86, karsi: 30, kx: 66, ky });
    b += soluk(R.KUTU(tx - 10, yer - 20, 20, 20, { d: 4 }), .4) + R.KUTU(tx - 10, ky, 20, 20, { d: 4, golge: false });
    b += OLCU(tx - 24, yer, tx - 24, yer - 120, 'h = 6 m', { yan: 'sol', size: 12.5, d: 8 }) + T(tx + 17, ky + 15, '100 kg', { a: 'start', size: 11.5, c: '#334155' });
    b += R.KRONOMETRE(x - 33, yer - 78, 14, sure).replace(/<line x1="[^"]*" y1="[^"]*" x2="[^"]*" y2="[^"]*" stroke="#dc2626"/, `<line x1="${x - 33}" y1="${yer - 78}" x2="${x - 33 + 9 * Math.sin(aci * Math.PI / 180)}" y2="${yer - 78 - 9 * Math.cos(aci * Math.PI / 180)}" stroke="#dc2626"`) + ROZET(x - 30, 20, guc, C.koyu, { size: 13.5 });
  });
  return S(w, h, mm, b + s.cerceve);
};
const fEtiket = (mm = 78) => {
  const w = 330, h = 168;
  let b = R.ZEMIN(6, w - 6, 138, { tur: 'masa', h: 22 }) + `<path d="M 96 130 L 168 34 M 96 136 L 168 122" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 4" fill="none"/>`;
  b += ISITICI(72, 138, 1.25) + `<rect x="86" y="129" width="12" height="8" rx="1.5" fill="#e2e8f0" stroke="#475569" stroke-width=".8"/>`;
  b += ETIKET(168, 34, 150, 88, ['SU ISITICISI', '220–240 V ~ 50 Hz', '2000 W'], { buyuk: 24 });
  return S(w, h, mm, b);
};
const fUtu = (mm = 40) => S(170, 104, mm, ETIKET(8, 6, 154, 88, ['ÜTÜ', '220–240 V ~ 50 Hz', '2400 W'], { buyuk: 24 }));

// Deneme şekilleri
const gD1 = (mm = 62) => R.GRAFIK({ xmax: 6, ymax: 100, dx: 1, dy: 20, sx: 32, sy: 1.3, xlab: 't (s)', ylab: 'x (m)', cizgi: [{ pts: [[0, 0], [6, 90]], c: C.mavi, lab: 'K', lx: 5.4, ly: 60 }, { pts: [[0, 100], [6, 40]], c: C.turuncu, lab: 'L', lx: 1.1, ly: 70 }], kesik: [[6, 90], [6, 40]], mm });
// Deneme 2: masada oyuncak araba ve cetvel. Ölçek 4 px/cm, araba 12 cm.
const fOyuncak = (mm = 104) => {
  const w = 384, h = 104, my = 46, rx = 20, ry = 60;
  let b = R.ZEMIN(4, w - 4, my, { tur: 'masa', h: 52 });
  b += `<g filter="url(#golge)"><rect x="${rx}" y="${ry}" width="332" height="26" rx="3" fill="#fde68a" stroke="#b45309" stroke-width="1.2"/></g>`;
  for (let i = 0; i <= 16; i++) { const px = rx + 6 + 20 * i; b += `<line x1="${px}" y1="${ry}" x2="${px}" y2="${ry + (i % 2 ? 6 : 10)}" stroke="#78350f" stroke-width="1.1"/>`; if (i % 2 === 0) b += T(px, ry + 22, i * 5, { size: 11, w: 700, c: '#78350f', halo: false }); }
  b += T(rx + 338, ry + 18, 'cm', { a: 'start', size: 12, c: '#334155' });
  [10, 30, 50, 70].forEach((cm, i) => {
    const xo = rx + 6 + 4 * cm, car = R.ARABA(xo - 21.6, my, { k: .36, renk: '#e11d48' });
    b += (i < 3 ? soluk(car, .35 + i * .15) : car) + `<line x1="${xo}" y1="${my - 3}" x2="${xo}" y2="${ry}" stroke="#1d2b53" stroke-width="1.2" stroke-dasharray="2.5 2.5"/>`;
    b += T(xo - 21.6, my - 24, `t = ${2 * i} s`, { size: 12, c: '#334155' });
  });
  return S(w, h, mm, b);
};
const gD6 = (mm = 62) => R.GRAFIK({ xmax: 10, ymax: 20, dx: 1, dy: 5, sx: 20, sy: 6, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: [[0, 0], [10, 20]], c: C.mavi, lab: 'K', lx: 8.7, ly: 12.6 }, { pts: [[0, 20], [10, 0]], c: C.turuncu, lab: 'L', lx: 1.3, ly: 12.6 }], mm });
// Deneme 7: üç araç, hız ve ivme vektörleri
const fUcArac = (mm = 104) => {
  const w = 420, h = 142, y = YOL(w, h, { kh: 26, ah: 28 }), yb = y.yolY + 8; let b = y.b;
  [[75, 1, 1, 'K', '#2563eb'], [210, 1, -1, 'L', '#0f766e'], [345, -1, -1, 'M', '#7c3aed']].forEach(([x, vy, ay, ad, renk]) => {
    b += R.ARABA(x, yb, { k: .62, renk, yon: vy });
    b += OK(x - 27 * vy, yb - 42, x + 27 * vy, yb - 42, C.mavi, { w: 4.6, hd: 12 }) + T(x + 34 * vy, yb - 37, V, { a: vy > 0 ? 'start' : 'end', c: C.mavi, size: 16, it: true });
    b += OK(x - 20 * ay, yb - 62, x + 20 * ay, yb - 62, C.turuncu, { w: 4.6, hd: 12 }) + T(x + 27 * ay, yb - 57, 'a', { a: ay > 0 ? 'start' : 'end', c: C.turuncu, size: 16, it: true });
    b += T(x, y.altY + 18, ad, { size: 14.5 });
  });
  return S(w, h, mm, b + y.cerceve);
};
const gD9 = (mm = 62) => R.GRAFIK({ xmax: 10, ymax: 150, dx: 2, dy: 30, sx: 21, sy: .9, xlab: 'x (m)', ylab: 'F (N)', cizgi: [{ pts: [[0, 150], [10, 90]], c: C.pembe }], kesik: [[10, 90]], mm });
// Deneme 12: üç sandık. Oklar kuvvetle (30 px = F), ölçüler yer değiştirmeyle (50 px = x) orantılı.
const fUcSandik = (mm = 78) => {
  const w = 330, h = 250; let b = '';
  [['K', 1, 3, '#0f766e'], ['L', 2, 2, '#2563eb'], ['M', 3, 1, '#7c3aed']].forEach(([ad, f, x, renk], i) => {
    const y = 46 + 80 * i;
    b += R.ZEMIN(8, w - 8, y, { tur: 'buz', h: 10 }) + R.KUTU(48, y - 30, 34, 30, { d: 7, renk }) + T(24, y - 9, ad, { size: 15.5 });
    b += OK(96, y - 15, 96 + 30 * f, y - 15, C.pembe, { w: 5 }) + T(96 + 30 * f + 7, y - 10, f > 1 ? `${f}F` : 'F', { a: 'start', c: C.pembe, size: 15, it: true });
    b += OLCU(65, y + 31, 65 + 50 * x, y + 31, '') + T(65 + 25 * x, y + 24, x > 1 ? `${x}x` : 'x', { size: 14, it: true, c: '#334155' });
  });
  return S(w, h, mm, b);
};
const fUcEtiket = (mm = 118) => S(384, 92, mm, ETIKET(6, 6, 118, 78, ['FIRIN', '220–240 V ~ 50 Hz', '2000 W']) + ETIKET(133, 6, 118, 78, ['KLİMA', '220–240 V ~ 50 Hz', '1000 W']) + ETIKET(260, 6, 118, 78, ['TELEVİZYON', '220–240 V ~ 50 Hz', '200 W']));
const gD14 = (mm = 64) => R.GRAFIK({ xmax: 40, ymax: 6000, dx: 10, dy: 2000, sx: 5.4, sy: .022, xlab: 't (s)', ylab: 'W (J)', cizgi: [{ pts: [[0, 0], [20, 6000]], c: C.mavi, lab: 'K', lx: 12.5, ly: 5150 }, { pts: [[0, 0], [40, 4000]], c: C.turuncu, lab: 'L', lx: 31, ly: 2350 }], kesik: [[20, 6000], [40, 4000]], mm });

// ---------- Ek ısınma sorularının şekilleri ----------
// Gün 1: yol kenarında 10 m arayla ağaçlar. Ölçek 8 px/m (otomobil 4,5 m, ağaç yaklaşık 6 m).
const fAgac = (mm = 100) => {
  const w = 420, h = 172, kh = 42, ah = 26, yolY = h - kh - ah, X = i => 60 + 80 * i;
  let arka = R.BULUT(250, 30, .7) + R.BULUT(110, 24, .5) + `<rect x="0" y="${yolY - 9}" width="${w}" height="9" fill="url(#gCim)"/>`;
  for (let i = 0; i < 5; i++) arka += R.AGAC(X(i), yolY - 2, .68);
  const y = YOL(w, h, { kh, ah, arka }), yb = y.yolY + 11; let b = y.b;
  for (let i = 0; i < 5; i++) b += `<line x1="${X(i)}" y1="${y.altY + 3.5}" x2="${X(i)}" y2="${y.altY + 9}" stroke="#475569" stroke-width="1.5"/>` + T(X(i), y.altY + 22, `${i + 1}.`, { size: 13, w: 700, c: '#334155', hw: 3 });
  b += OLCU(X(1), y.altY + 31, X(2), y.altY + 31, '10 m', { ust: true, size: 13, tc: C.koyu });
  b += R.ARABA(42, yb, { k: .3, renk: '#e11d48' });
  b += OK(70, yb - 5, 108, yb - 5, C.mavi, { w: 4, hd: 11 }) + T(114, yb, V, { a: 'start', c: '#fff', size: 16, it: true, halo: false });
  return S(w, h, mm, b + y.cerceve);
};
const gE4 = (mm = 60) => R.GRAFIK({ xmax: 6, ymax: 80, dx: 1, dy: 20, sx: 32, sy: 1.5, xlab: 't (s)', ylab: 'x (m)', cizgi: [{ pts: [[0, 20], [6, 80]], c: C.mavi, lab: 'K', lx: 3.5, ly: 68 }], kesik: [[6, 80]], mm });
const gE6 = (mm = 60) => R.GRAFIK({ xmax: 10, ymin: -5, ymax: 10, dx: 1, dy: 5, sx: 21, sy: 8, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: [[0, 10], [4, 10]], c: C.yesil }, { pts: [[4, 0], [6, 0]], c: C.yesil }, { pts: [[6, -5], [10, -5]], c: C.yesil }], kesik: [[4, 10], [6, -5], [10, -5]], mm });

// Gün 2: hız göstergesi. 0–180 km/h, 270 derecelik kadran, altta sayısal gösterge.
function GOSTERGE(x, y, r, deger) {
  const A = v => (225 - v * 1.5) * Math.PI / 180, px = (v, k) => x + r * k * Math.cos(A(v)), py = (v, k) => y - r * k * Math.sin(A(v));
  let s = `<g filter="url(#golge)"><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gMetalD)" stroke="#0f172a" stroke-width="1.6"/></g><circle cx="${x}" cy="${y}" r="${r * .91}" fill="#fbfdff" stroke="#94a3b8" stroke-width="1"/>`;
  for (let v = 0; v <= 180; v += 10) {
    const b = v % 20 === 0;
    s += `<line x1="${px(v, .87)}" y1="${py(v, .87)}" x2="${px(v, b ? .74 : .8)}" y2="${py(v, b ? .74 : .8)}" stroke="${b ? '#1d2b53' : '#64748b'}" stroke-width="${b ? 2 : 1.2}" stroke-linecap="round"/>`;
    if (b) s += T(px(v, .59), py(v, .59) + 3.6, v, { size: 10.5, w: 700, c: '#334155', halo: false });
  }
  s += `<rect x="${x - 25}" y="${y + r * .53}" width="50" height="15.5" rx="3.5" fill="#0b1220" stroke="#64748b" stroke-width=".8"/>` + T(x, y + r * .53 + 11.4, `${deger} km/h`, { size: 10.5, w: 700, c: '#f1f5f9', halo: false });
  s += `<line x1="${px(deger, -.1)}" y1="${py(deger, -.1)}" x2="${px(deger, .42)}" y2="${py(deger, .42)}" stroke="#dc2626" stroke-width="3.2" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="5.4" fill="#1d2b53" stroke="#fff" stroke-width="1.2"/>`;
  return s;
}
const fGosterge = (mm = 66) => {
  const w = 340, h = 180;
  let b = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="#27303f" stroke="#0f172a" stroke-width="1.5"/>`;
  b += GOSTERGE(90, 76, 64, 36) + GOSTERGE(250, 76, 64, 108);
  b += ROZET(90, 160, 't = 0', C.koyu, { size: 14 }) + ROZET(250, 160, 't = 4 s', C.koyu, { size: 14 });
  return S(w, h, mm, b);
};
const gE12 = (mm = 62) => R.GRAFIK({ xmax: 60, ymax: 20, dx: 10, dy: 5, sx: 4, sy: 6, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: [[0, 0], [20, 20], [50, 20], [60, 0]], c: C.turuncu }], kesik: [[20, 20], [50, 20]], mm });
const tabloE11 = `<table class="t" style="width:74%;margin:6px 0 4px"><tr><th>Araç</th><th>İlk hız (m/s)</th><th>Son hız (m/s)</th><th>Süre (s)</th></tr>${[['K', 10, 30, 10], ['L', 0, 12, 3], ['M', 25, 10, 5]].map(r => `<tr>${r.map((c, i) => `<td style="text-align:center">${i ? c : `<b>${c}</b>`}</td>`).join('')}</tr>`).join('')}</table>`;

// Gün 3: dinamometreyle çekilen blok. Ölçek 3,2 px/cm: blok yaklaşık 14 cm, yer değiştirme 50 cm.
const fDinamo = (mm = 100) => {
  const w = 420, h = 132, my = 88;
  let b = R.ZEMIN(4, w - 4, my, { tur: 'masa', h: 40 });
  b += `<line x1="40" y1="${my - 36}" x2="40" y2="34" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/><line x1="200" y1="${my - 36}" x2="200" y2="34" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  b += OLCU(40, 34, 200, 34, '50 cm', { ust: true, size: 14, tc: C.koyu });
  b += soluk(R.KUTU(40, my - 32, 44, 32), .4) + R.KUTU(200, my - 32, 44, 32);
  b += `<g transform="translate(342 ${my - 19}) rotate(90)">${R.DINAMOMETRE(0, 0)}</g>`;
  b += ROZET(305, 40, '8 N', C.koyu, { size: 14 });
  b += OK(352, my - 19, 400, my - 19, C.pembe, { w: 4.6, hd: 12 }) + T(376, my - 31, 'F', { c: C.pembe, size: 16, it: true });
  return S(w, h, mm, b);
};
const gE27 = (mm = 60) => R.GRAFIK({ xmax: 6, ymax: 60, dx: 1, dy: 10, sx: 33, sy: 2, xlab: 'x (m)', ylab: 'F (N)', cizgi: [{ pts: [[0, 0], [6, 60]], c: C.pembe }], kesik: [[6, 60]], mm });
const gE30 = (mm = 60) => R.GRAFIK({ xmax: 10, ymax: 300, dx: 2, dy: 100, sx: 21, sy: .4, xlab: 'x (m)', ylab: 'W (J)', cizgi: [{ pts: [[0, 0], [4, 200], [6, 200], [10, 300]], c: C.mavi }], kesik: [[4, 200], [6, 200], [10, 300]], mm });

// Gün 4: elektrik sayacı (132 x 92 px) ve güç–zaman grafiği
function SAYAC(x, y, okuma) {
  let s = `<g filter="url(#golge)"><rect x="${x}" y="${y}" width="132" height="92" rx="9" fill="url(#gBeton)" stroke="#64748b" stroke-width="1.3"/></g><rect x="${x + 4}" y="${y + 4}" width="124" height="84" rx="6" fill="#f8fafc" opacity=".7" stroke="#cbd5e1" stroke-width=".8"/>`;
  s += T(x + 66, y + 19.5, 'ELEKTRİK SAYACI', { size: 11.5, halo: false, c: '#334155' });
  s += `<rect x="${x + 12}" y="${y + 27}" width="108" height="34" rx="4" fill="#cfe0c6" stroke="#475569" stroke-width="1.2"/><rect x="${x + 14}" y="${y + 29}" width="104" height="5" rx="2" fill="#fff" opacity=".35"/>`;
  s += T(x + 84, y + 52.5, okuma, { a: 'end', size: 23, w: 700, halo: false, c: '#111827' }) + T(x + 90, y + 52.5, 'kWh', { a: 'start', size: 12.5, w: 700, halo: false, c: '#111827' });
  s += `<circle cx="${x + 22}" cy="${y + 75}" r="3.4" fill="#ef4444" stroke="#7f1d1d" stroke-width=".8"/><rect x="${x + 34}" y="${y + 71}" width="30" height="8" rx="2" fill="#94a3b8"/><rect x="${x + 70}" y="${y + 71}" width="14" height="8" rx="2" fill="#475569"/><rect x="${x + 90}" y="${y + 71}" width="14" height="8" rx="2" fill="#475569"/>`;
  return s;
}
const fSayac = (mm = 64) => {
  const w = 330, h = 152;
  let b = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="#eef2f7" stroke="#b8c4d6" stroke-width="1.5"/>`;
  b += SAYAC(22, 48, '04520') + SAYAC(176, 48, '04529');
  b += ROZET(88, 25, 'Saat 08.00', C.koyu, { size: 13.5 }) + ROZET(242, 25, 'Saat 11.00', C.koyu, { size: 13.5 });
  return S(w, h, mm, b);
};
const gE37 = (mm = 60) => R.GRAFIK({ xmax: 6, ymax: 3, dx: 1, dy: 1, sx: 33, sy: 40, xlab: 't (h)', ylab: 'P (kW)', cizgi: [{ pts: [[0, 2], [2, 2]], c: C.turuncu }, { pts: [[2, 1], [6, 1]], c: C.turuncu }], kesik: [[2, 2], [6, 1]], mm });

// ---------- Günler ----------
const gunler = [
  {
    no: 1, baslik: 'Sabit hızlı hareket ve grafikleri', kisa: 'Sabit hızlı hareket', alt: 'Hız değişmiyorsa iş kolay: eşit sürede eşit yer değiştirme. Gerisi grafik okumak.',
    plan: 'Konum, yer değiştirme, alınan yol, konum–zaman ve hız–zaman grafikleri, karşılaşma.',
    govde:
      ikili(
        bolum('Konum, yer değiştirme, alınan yol', `<p><b>Konum</b> ($x$): cismin seçilen başlangıç noktasına göre yeri. <b>Yer değiştirme</b> ($\\Delta x$): son konum eksi ilk konum, yönlüdür. <b>Alınan yol</b>: gidilen yolun tamamı, yönsüzdür.</p>`) +
        formul('\\Delta x = x_{\\text{son}} - x_{\\text{ilk}} \\qquad \\Delta x = \\vartheta\\,\\Delta t') +
        kutu('ana', 'Sürat mi, hız mı?', `Sürat alınan yoldan, hız yer değiştirmeden bulunur. Şekildeki araç 5 s’de 25 m yol alır ama yer değiştirmesi 5 m’dir: ortalama sürati 5 m/s, ortalama hızı 1 m/s.`),
        sekil(fKonum(88), 'Şekil ölçeklidir. Araç 5 m’den 20 m’ye gidip 10 m’ye geri dönüyor.'), 's') +
      bolum('Sabit hızlı hareketin iki grafiği', `<p>Sabit hızlı harekette cisim eşit sürelerde eşit yer değiştirir, ivmesi sıfırdır. Aşağıdaki iki grafik <b>aynı hareketi</b> anlatıyor.</p>`) +
      ikili(sekil(gXt1(72), 'Konum–zaman: <b>eğim hızı</b> verir. $\\tfrac{80 - 20}{4} = 15$ m/s.'), sekil(gVt1(72), 'Hız–zaman: <b>alan yer değiştirmeyi</b> verir. $15 \\times 4 = 60$ m.')) +
      kutu('sari', 'Karşılaşma ve yetişme', `Zıt yönde gelen iki araç arasındaki uzaklık her saniye $\\vartheta_1 + \\vartheta_2$ kadar, aynı yönde gidenlerde $\\vartheta_1 - \\vartheta_2$ kadar kapanır. Aradaki uzaklığı bu değere bölersen süreyi bulursun.`) +
      hata('Konum–zaman grafiğinde çizgi yükseliyorsa cisim hızlanıyordur.', 'Düz bir doğru sabit hız demektir. Doğru ne kadar dikse hız o kadar büyüktür.') +
      hata('Konum–zaman grafiğinde aşağı inen doğru, cismin yavaşladığını gösterir.', 'Aşağı inen doğru, cismin negatif yönde sabit hızla gittiğini gösterir.'),
    sorular: [
      { metin: 'Doğrusal bir yolda sabit hızla ilerleyen bir bisikletli, $x = -30$ m konumundan $x = +50$ m konumuna 10 s’de ulaşıyor.', kok: 'Bisikletlinin hızı ve harekete başladıktan 6 s sonraki konumu sırasıyla nedir?', siklar: ['2 m/s ve −18 m', '2 m/s ve 12 m', '8 m/s ve 18 m', '8 m/s ve 48 m', '5 m/s ve 30 m'], k: 3, cevap: 'C', cozum: 'Yer değiştirme $50 - (-30) = 80$ m, hız $\\tfrac{80}{10} = 8$ m/s. 6 s’de $8 \\times 6 = 48$ m yer değiştirir: $x = -30 + 48 = 18$ m.' },
      { metin: 'Düz bir yolun kenarına ağaçlar şekildeki gibi 10 m arayla dikilmiştir. Sabit hızla giden bir otomobilin ön ucu, 1. ağacın hizasından 21. ağacın hizasına 10 s’de ulaşıyor.', sekil: fAgac(100), kok: 'Otomobilin hızı kaç km/h’tir?', siklar: ['20', '21', '60', '72', '90'], cevap: 'D', cozum: '1. ağaç ile 21. ağaç arasında 20 aralık vardır: $20 \\times 10 = 200$ m. Hız $\\tfrac{200}{10} = 20$ m/s, yani $20 \\times 3{,}6 = 72$ km/h.' },
      { metin: 'Doğrusal bir yolda hareket eden bir otomobilin konum–zaman grafiği şekildeki gibidir.', sekil: gS1(60), yan: true, kok: 'Otomobilin 0–10 s aralığındaki yer değiştirmesi ve aldığı yol sırasıyla kaç m’dir?', siklar: ['−20 ve 60', '−20 ve 100', '20 ve 100', '−60 ve 100', '60 ve 60'], k: 3, cevap: 'B', cozum: 'Yer değiştirme: $-20 - 0 = -20$ m. Alınan yol: ileri 40 m, sonra geri $40 + 20 = 60$ m, toplam 100 m.' },
      { metin: 'Bir kamyon 360 km’lik yolun ilk yarısını 90 km/h, ikinci yarısını 60 km/h sabit süratle gidiyor.', kok: 'Kamyonun yolun tamamındaki ortalama sürati kaç km/h’tir?', siklar: ['72', '75', '78', '80', '90'], cevap: 'A', cozum: 'Her yarı 180 km’dir. Süreler $\\tfrac{180}{90} = 2$ h ve $\\tfrac{180}{60} = 3$ h. Ortalama sürat $\\tfrac{360}{5} = 72$ km/h. Kamyon yavaş gittiği kısımda daha uzun süre kaldığı için sonuç 75 km/h değildir.' },
      { metin: 'Düz bir yolda K aracı 25 m/s, L aracı 15 m/s sabit hızla aynı yönde gitmektedir. L aracı, K aracının 200 m önündedir.', kok: 'K aracı L’ye yetiştiği anda, başlangıçta bulunduğu noktadan kaç m uzaklaşmıştır?', siklar: ['200', '300', '400', '500', '800'], cevap: 'D', cozum: 'Aradaki uzaklık her saniye $25 - 15 = 10$ m kapanır: $t = \\tfrac{200}{10} = 20$ s. K bu sürede $25 \\times 20 = 500$ m yol alır.' },
      { metin: 'Uzunluğu 200 m olan bir tren, 20 m/s sabit hızla 400 m uzunluğundaki bir tünelden geçiyor.', kok: 'Trenin ön ucunun tünele girdiği andan, son vagonun tünelden tamamen çıktığı ana kadar kaç s geçer?', siklar: ['10', '20', '30', '40', '60'], cevap: 'C', cozum: 'Trenin ön ucu, tünelin boyu kadar ve kendi boyu kadar ilerlemelidir: $400 + 200 = 600$ m. $t = \\tfrac{600}{20} = 30$ s.' },
      { metin: 'Doğrusal bir yolda hareket eden K aracının konum–zaman grafiği şekildeki gibidir. Aynı yolda L aracı $t = 0$ anında $x = 120$ m konumundan geçmekte ve K’ye doğru 15 m/s büyüklüğündeki sabit hızla ilerlemektedir.', sekil: gE4(60), yan: true, kok: 'Araçlar hangi anda ve hangi konumda yan yana gelir?', siklar: ['3 s ve 50 m', '4 s ve 40 m', '5 s ve 70 m', '6 s ve 30 m', '4 s ve 60 m'], k: 3, cevap: 'E', cozum: 'K’nin hızı $\\tfrac{80 - 20}{6} = 10$ m/s. Aradaki 100 m, saniyede $10 + 15 = 25$ m kapanır: $t = 4$ s. K’nin konumu $20 + 10 \\times 4 = 60$ m.' },
      { metin: 'Düz bir yolda aralarında 300 m uzaklık bulunan iki bisikletli, aynı anda 4 m/s ve 6 m/s sabit hızlarla birbirine doğru harekete geçiyor ve karşılaştıktan sonra da aynı hızlarla yollarına devam ediyor.', kok: 'Bisikletliler arasındaki uzaklık, harekete geçtikten kaç s sonra 100 m olur?', siklar: ['20 s ve 40 s', 'Yalnız 20 s', '20 s ve 30 s', 'Yalnız 30 s', '30 s ve 40 s'], k: 5, cevap: 'A', cozum: 'Uzaklık saniyede $4 + 6 = 10$ m kapanır: $\\tfrac{300 - 100}{10} = 20$ s sonra 100 m kalır. 30 s’de karşılaşırlar, sonra saniyede 10 m uzaklaşırlar: 40 s’de uzaklık yine 100 m olur.' },
      { metin: 'Doğrusal bir yol boyunca yatay uçan bir dronun hız–zaman grafiği şekildeki gibidir.', sekil: gS3(60), yan: true, onc: ['Dron $t = 3$ s anında yön değiştirmiştir.', 'Dron 9. saniyenin sonunda harekete başladığı noktadadır.', 'Dronun 9 saniyede aldığı yol 48 m’dir.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'I ve III', 'I, II ve III'], k: 3, cevap: 'E', cozum: 'I: Hız pozitiften negatife geçmiştir, doğru. II: $8 \\times 3 = 24$ m ileri, $4 \\times 6 = 24$ m geri, yer değiştirme sıfır, doğru. III: Alınan yol 48 m, doğru.' },
      { metin: 'Doğrusal bir yolda hareket eden bir aracın hız–zaman grafiği şekildeki gibidir. Araç $t = 0$ anında $x = -30$ m konumundadır.', sekil: gE6(60), yan: true, onc: ['Araç $t = 3$ s anında $x = 0$ konumundadır.', 'Araç 0–10 s aralığında $x = 0$ konumundan iki kez geçmiştir.', 'Aracın $t = 10$ s anındaki konumu 20 m’dir.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III'], k: 3, cevap: 'B', cozum: 'I: $-30 + 10 \\times 3 = 0$, doğru. II: Araç $t = 4$ s anında 10 m konumuna varıp bekler, dönüşte $t = 8$ s anında yine $x = 0$’dan geçer, doğru. III: Yer değiştirme $40 - 20 = 20$ m, konum $-30 + 20 = -10$ m, yanlış.' },
    ],
    kontrol: ['Yer değiştirme ile alınan yolu, hız ile sürati ayırt edebiliyorum.', 'Konum–zaman grafiğinin eğiminden hızı, hız–zaman grafiğinin alanından yer değiştirmeyi bulabiliyorum.', 'Karşılaşma ve yetişme sorularında aradaki uzaklığın saniyede ne kadar kapandığını yazabiliyorum.'],
  },
  {
    no: 2, baslik: 'İvme ve sabit ivmeli hareket', kisa: 'Sabit ivmeli hareket', alt: 'Hız değişiyorsa ivme vardır. Hız düzgün değişiyorsa ivme sabittir.',
    plan: 'İvme, hızlanan ve yavaşlayan hareket, hız–zaman ve ivme–zaman grafikleri.',
    govde:
      ikili(
        bolum('İvme: hız ne kadar çabuk değişiyor?', `<p>İvme, hızın bir saniyedeki değişimidir. $a = 3\\ \\text{m/s}^2$ demek, hız her saniye 3 m/s değişiyor demektir.</p>`) +
        formul('a = \\dfrac{\\Delta\\vartheta}{\\Delta t} \\qquad \\vartheta = \\vartheta_0 + a\\,t') +
        kutu('ana', 'Hızlanıyor mu, yavaşlıyor mu?', `İvme hız ile <b>aynı yönlüyse</b> cisim hızlanır, <b>zıt yönlüyse</b> yavaşlar. İvmenin işaretine tek başına bakma, hızın yönüyle karşılaştır.`),
        sekil(fHizYav(82), 'Gaza basan araçta ivme ileri, frene basan araçta geriye doğrudur.'), 's') +
      bolum('Yer değiştirme: iki model, tek fikir', `<p>Hız düzgün değiştiği için ortalama hız, ilk hız ile son hızın tam ortasıdır.</p>`) +
      formul('\\Delta x = \\dfrac{\\vartheta_0 + \\vartheta}{2}\\;t \\qquad \\Delta x = \\vartheta_0\\,t + \\tfrac{1}{2}\\,a\\,t^2') +
      ikili(sekil(gVt2(64), 'Hız–zaman: <b>eğim ivmeyi</b>, <b>alan yer değiştirmeyi</b> verir.'), sekil(gAt2(64), 'Aynı hareketin ivme–zaman grafiği: <b>alan hız değişimini</b> verir.')) +
      kutu('sari', 'Fren mesafesi', `Aynı ivmeyle yavaşlayan araçta hız 2 katına çıkarsa durma süresi 2 katına, durana kadar alınan yol <b>4 katına</b> çıkar. 10 m/s’den 10 m’de duran araç, 20 m/s’den 40 m’de durur.`) +
      hata('İvmesi negatif olan cisim yavaşlıyordur.', 'İşaret yalnız yönü söyler. Negatif yönde giden cismin ivmesi de negatifse cisim hızlanır.') +
      hata('Hızı büyük olan cismin ivmesi de büyüktür.', 'İvme hızın büyüklüğüne değil, ne kadar çabuk değiştiğine bağlıdır. Sabit 30 m/s hızla giden aracın ivmesi sıfırdır.'),
    sorular: [
      { metin: 'Durgun hâlden sabit ivmeyle harekete geçen bir elektrikli scooter, 0–2 s aralığında 4 m yol alıyor.', kok: 'Scooter aynı ivmeyle hızlanmaya devam ederse 2–4 s aralığında kaç m yol alır?', siklar: ['4', '8', '12', '16', '20'], cevap: 'C', cozum: '$4 = \\tfrac{1}{2} \\times a \\times 2^2$ olduğundan $a = 2\\ \\text{m/s}^2$. İlk 4 s’de $\\tfrac{1}{2} \\times 2 \\times 4^2 = 16$ m yol alır. 2–4 s aralığındaki yol $16 - 4 = 12$ m.' },
      { metin: `Bir test pistinde doğrusal yolda hareket eden K, L ve M araçlarının ilk hızları, son hızları ve bu değişimin süresi tablodaki gibidir. Araçların ivmeleri sabittir.${tabloE11}`, kok: 'Araçların ivmelerinin büyüklükleri $a_K$, $a_L$ ve $a_M$ arasındaki ilişki nedir?', siklar: ['$a_K > a_L > a_M$', '$a_K > a_M > a_L$', '$a_L > a_K > a_M$', '$a_M > a_L > a_K$', '$a_L > a_M > a_K$'], k: 5, cevap: 'E', cozum: '$a_K = \\tfrac{30 - 10}{10} = 2$, $a_L = \\tfrac{12 - 0}{3} = 4$, $a_M = \\tfrac{10 - 25}{5} = -3\\ \\text{m/s}^2$. Büyüklükler 2, 4 ve 3 olduğundan $a_L > a_M > a_K$. Hız değişimi en büyük olan K’nin ivmesi en küçüktür.' },
      { metin: 'Düz yolda sabit ivmeyle hızlanan bir otomobilin hız göstergesinin $t = 0$ ve $t = 4$ s anlarındaki görüntüsü şekildeki gibidir.', sekil: fGosterge(68), yan: true, kok: 'Otomobilin ivmesi ve bu 4 s’deki yer değiştirmesi sırasıyla nedir?', siklar: ['$5\\ \\text{m/s}^2$ ve 80 m', '$5\\ \\text{m/s}^2$ ve 120 m', '$5\\ \\text{m/s}^2$ ve 40 m', '$18\\ \\text{m/s}^2$ ve 80 m', '$18\\ \\text{m/s}^2$ ve 288 m'], k: 2, cevap: 'A', cozum: '36 km/h 10 m/s, 108 km/h 30 m/s’dir. $a = \\tfrac{30 - 10}{4} = 5\\ \\text{m/s}^2$. $\\Delta x = \\tfrac{10 + 30}{2} \\times 4 = 80$ m.' },
      { metin: 'Doğrusal bir yolda $t = 0$ anında 10 m/s hızla hareket eden bir cismin ivme–zaman grafiği şekildeki gibidir.', sekil: gS7(56), yan: true, kok: 'Cismin $t = 8$ s anındaki hızı kaç m/s’dir?', siklar: ['4', '6', '14', '18', '30'], cevap: 'B', cozum: 'İvme–zaman grafiğinde alan hız değişimidir. İlk 4 s’de $+8$ m/s, sonraki 4 s’de $-12$ m/s. $\\vartheta = 10 + 8 - 12 = 6$ m/s.' },
      { metin: 'İki istasyon arasında doğrusal bir hat üzerinde hareket eden metronun hız–zaman grafiği şekildeki gibidir.', sekil: gE12(60), yan: true, kok: 'İki istasyon arasındaki uzaklık ve metronun yavaşlarkenki ivmesinin büyüklüğü sırasıyla kaç m ve kaç $\\text{m/s}^2$’dir?', siklar: ['600 ve 2', '900 ve 1', '1000 ve 2', '1200 ve 2', '900 ve 2'], k: 3, cevap: 'E', cozum: 'Uzaklık grafiğin altındaki alandır: $\\tfrac{20 \\times 20}{2} + 20 \\times 30 + \\tfrac{20 \\times 10}{2} = 900$ m. Yavaşlarken ivmenin büyüklüğü $\\tfrac{20}{10} = 2\\ \\text{m/s}^2$.' },
      { metin: 'Doğrusal bir yolda hareket eden bir aracın hız–zaman grafiği şekildeki gibidir.', sekil: gS5(60), yan: true, onc: ['Aracın ivmesi hareket boyunca $-4\\ \\text{m/s}^2$ olmuştur.', 'Araç $t = 5$ s anında yön değiştirmiştir.', 'Aracın 0–7 s aralığındaki yer değiştirmesi 58 m’dir.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 3, cevap: 'C', cozum: 'I: Eğim $\\tfrac{-8 - 20}{7} = -4\\ \\text{m/s}^2$, doğru. II: Hız $t = 5$ s anında sıfır olup işaret değiştirir, doğru. III: $\\tfrac{20 \\times 5}{2} - \\tfrac{8 \\times 2}{2} = 42$ m, yanlış. 58 m alınan yoldur.' },
      { metin: 'Bir atlet 100 m yarışında durgun hâlden harekete geçiyor, ilk 4 s boyunca sabit ivmeyle hızlanarak 10 m/s hıza ulaşıyor ve yarışın kalanını bu sabit hızla koşuyor.', kok: 'Atlet yarışı kaç s’de bitirir?', siklar: ['8', '10', '11', '12', '14'], cevap: 'D', cozum: 'İlk 4 s’de $\\tfrac{0 + 10}{2} \\times 4 = 20$ m yol alır. Kalan 80 m’yi $\\tfrac{80}{10} = 8$ s’de koşar. Toplam $4 + 8 = 12$ s.' },
      { metin: 'Bir sürücü 30 m/s sabit hızla giderken 130 m ilerisinde yola devrilmiş bir ağaç görüyor. Sürücü ağacı gördükten <span style="white-space:nowrap">1 s</span> sonra frene basıyor ve araç $5\\ \\text{m/s}^2$ büyüklüğündeki sabit ivmeyle yavaşlayarak duruyor.', kok: 'Araç, ağaca kaç m kala durur?', siklar: ['10', '20', '40', '70', '100'], cevap: 'A', cozum: 'İlk 1 s’de sabit hızla 30 m gider. Durma süresi $\\tfrac{30}{5} = 6$ s, bu sürede $\\tfrac{30 + 0}{2} \\times 6 = 90$ m gider. $130 - 30 - 90 = 10$ m.' },
      { metin: 'Trafik ışığında duran K aracı, ışık yeşile döndüğü anda $2\\ \\text{m/s}^2$ sabit ivmeyle hızlanmaya başlıyor. Tam o anda L aracı 10 m/s sabit hızla K’nin yanından geçiyor.', kok: 'K aracı L’ye kaç s sonra yetişir ve o anda K’nin hızı kaç m/s’dir?', siklar: ['5 s ve 10 m/s', '5 s ve 20 m/s', '10 s ve 10 m/s', '10 s ve 20 m/s', '20 s ve 40 m/s'], k: 3, cevap: 'D', cozum: 'Yer değiştirmeler eşit olmalı: $\\tfrac{1}{2} \\times 2 \\times t^2 = 10\\,t$, $t = 10$ s. $\\vartheta_K = 2 \\times 10 = 20$ m/s. $t = 5$ s anında yalnız hızlar eşitlenir, K hâlâ geridedir.' },
      { metin: 'Düz bir yolda L kamyonu 10 m/s sabit hızla ilerliyor. Aynı şeritte arkadan 30 m/s hızla gelen K otomobilinin sürücüsü frene basıyor ve otomobil $5\\ \\text{m/s}^2$ büyüklüğündeki sabit ivmeyle yavaşlıyor.', kok: 'Otomobilin kamyona çarpmaması için frene basıldığı anda araçlar arasındaki uzaklık en az kaç m olmalıdır?', siklar: ['20', '40', '50', '80', '90'], cevap: 'B', cozum: 'Otomobilin hızı 10 m/s’ye düşene kadar aradaki uzaklık kapanır: $t = \\tfrac{30 - 10}{5} = 4$ s. Bu sürede otomobil $\\tfrac{30 + 10}{2} \\times 4 = 80$ m, kamyon $10 \\times 4 = 40$ m yol alır. Fark 40 m’dir.' },
    ],
    kontrol: ['Hız değişimi ile süreden ivmeyi bulabiliyor, ivmenin yönünü yorumlayabiliyorum.', 'Hız–zaman grafiğinin eğiminden ivmeyi, alanından yer değiştirmeyi okuyabiliyorum.', 'İvme–zaman grafiğinin alanından hız değişimini bulabiliyorum.'],
  },
  {
    no: 3, baslik: 'İş', kisa: 'İş', alt: 'Yorulmak iş yapmak değildir. İş için kuvvet ve o kuvvet doğrultusunda yer değiştirme gerekir.',
    plan: 'Fiziksel anlamda iş, pozitif, negatif ve sıfır iş, net iş, kuvvet–yer değiştirme grafiği.',
    govde:
      ikili(
        bolum('Fiziksel anlamda iş', `<p>Bir kuvvet, cismi <b>kendi doğrultusunda</b> yer değiştirtiyorsa iş yapar. İş skalerdir, birimi joule’dür: ${nb('$1\\ \\text{J} = 1\\ \\text{N} \\times 1\\ \\text{m}$')}.</p>`) +
        formul('W = F\\,\\Delta x \\qquad W_{\\text{net}} = F_{\\text{net}}\\,\\Delta x') +
        kutu('ana', 'Her kuvvetin işi ayrı', `Şekilde itme kuvvetinin işi ${nb('$60 \\times 5 = 300$ J')}, sürtünme kuvvetinin işi ${nb('$-20 \\times 5 = -100$ J')}. <b>Net iş</b> ikisinin toplamıdır: 200 J. Net kuvvetle de aynı sonuç çıkar: ${nb('$40 \\times 5 = 200$ J')}.`),
        sekil(fItme(88), 'Şekil ölçeklidir: sandık 5 m ilerliyor, itme kuvveti sürtünmenin 3 katı.')) +
      uclu([
        { sekil: fPoz(), baslik: 'Pozitif iş', metin: 'Kuvvet hareket yönünde. Kuvvet cisme enerji aktarır.' },
        { sekil: fNeg(), baslik: 'Negatif iş', metin: 'Kuvvet harekete zıt yönde. Kuvvet cisimden enerji alır.' },
        { sekil: fSifir(), baslik: 'Sıfır iş', metin: 'Kuvvet harekete dik ya da yer değiştirme yok. Enerji aktarılmaz.' },
      ]) +
      ikili(
        sekil(gFx(66), 'Sabit kısım dikdörtgen, azalan kısım üçgen: toplam 240 J.'),
        bolum('Kuvvet–yer değiştirme grafiği', `<p>Kuvvet sabit de olsa değişse de grafiğin altındaki <b>alan yapılan işi</b> verir.</p><p>Yatay eksenin <b>altında</b> kalan alan negatif iştir. Net işi bulurken üstteki alanlardan alttaki alanları çıkar.</p>`), 'g') +
      hata('Ağır bir çantayı elinde tutarak bekleyen kişi iş yapar.', 'Kişi yorulur ama yer değiştirme olmadığı için fiziksel anlamda iş yapmaz.') +
      hata('Negatif iş, iş yapılmadığı anlamına gelir.', 'Negatif iş de iştir: kuvvet cisimden enerji alır. Sürtünme ve fren kuvveti böyle iş yapar.'),
    sorular: [
      { metin: 'Bir halterci halteri yerden başının üstüne kaldırıyor, orada 3 s hareketsiz tutuyor, sonra yavaşça yere indiriyor.', kok: 'Haltercinin haltere uyguladığı kuvvetin yaptığı iş; kaldırırken, tutarken ve indirirken sırasıyla nasıldır?', siklar: ['Pozitif, pozitif, negatif', 'Pozitif, sıfır, pozitif', 'Pozitif, sıfır, negatif', 'Negatif, sıfır, pozitif', 'Pozitif, sıfır, sıfır'], k: 3, cevap: 'C', cozum: 'Kaldırırken kuvvet de yer değiştirme de yukarı yönlü: pozitif. Tutarken yer değiştirme yok: sıfır. İndirirken kuvvet yine yukarı, yer değiştirme aşağı yönlü: negatif.' },
      { metin: 'Aşağıda üç olay ve bu olaylardaki birer kuvvet verilmiştir.', onc: ['Tepsiyi sabit yükseklikte tutarak yatay zeminde yürüyen garsonun tepsiye uyguladığı düşey kuvvet.', 'Yukarı çıkan asansör kabinini çeken halatın kabine uyguladığı kuvvet.', 'Fren yapan bisikleti yavaşlatan sürtünme kuvveti.'], kok: 'Bu kuvvetlerden hangileri fiziksel anlamda iş yapar?', siklar: ['Yalnız II', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III'], k: 5, cevap: 'D', cozum: 'I: Kuvvet düşey, yer değiştirme yatay, birbirine dik olduğundan iş yapılmaz. II: Kuvvet ve yer değiştirme aynı yönlü, pozitif iş. III: Kuvvet harekete zıt, negatif iş.' },
      { metin: 'Masadaki tahta blok, dinamometreyle yatay doğrultuda sabit hızla çekilerek şekildeki gibi 50 cm yer değiştiriyor. Bu sırada dinamometre 8 N değerini gösteriyor.', sekil: fDinamo(100), kok: 'Bu yer değiştirme sırasında sürtünme kuvvetinin yaptığı iş kaç J’dür?', siklar: ['−400', '−4', '0', '4', '400'], cevap: 'B', cozum: 'Hız sabit olduğundan sürtünme kuvveti, çekme kuvvetiyle eşit büyüklükte ve zıt yönlüdür: 8 N. Yer değiştirme 0,5 m’dir. $W = -8 \\times 0{,}5 = -4$ J.' },
      { metin: 'Yatay yolda hareket eden bir sandığa etki eden net kuvvetin, sandığın yer değiştirmesine bağlı grafiği şekildeki gibidir.', sekil: gS10(60), yan: true, kok: 'Net kuvvetin 0–10 m aralığında yaptığı iş kaç J’dür?', siklar: ['−120', '80', '200', '300', '320'], cevap: 'B', cozum: 'Eksenin üstündeki alan $50 \\times 4 = 200$ J, altındaki alan $20 \\times 6 = 120$ J. Net iş $200 - 120 = 80$ J.' },
      { metin: `Ali ve Burak, özdeş iki sandığı 80 N büyüklüğündeki yatay kuvvetlerle kuvvet yönünde 5 m itiyor. Ali bu işi ${nb('10 s’de')}, Burak ${nb('20 s’de')} tamamlıyor.`, onc: ['İkisinin de uyguladığı kuvvetin yaptığı iş 400 J’dür.', 'Burak kuvveti daha uzun süre uyguladığı için daha fazla iş yapmıştır.', 'Zemin daha sürtünmeli olsaydı da bu kuvvetlerin yaptığı iş değişmezdi.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I ve III'], k: 5, cevap: 'E', cozum: 'Bir kuvvetin işi yalnız kuvvete ve kuvvet doğrultusundaki yer değiştirmeye bağlıdır: $80 \\times 5 = 400$ J. Süre ve sürtünme bu kuvvetin işini değiştirmez, sürtünme yalnız net işi değiştirir.' },
      { metin: 'Buz pistindeki yüklü bir kızağı Kerem bir yöne 900 N, Levent zıt yöne 850 N büyüklüğündeki yatay kuvvetle çekiyor. Kızak, Kerem’in çektiği yönde 2 m yer değiştiriyor.', kok: 'Levent’in uyguladığı kuvvetin yaptığı iş ve bu iki kuvvetin yaptığı net iş sırasıyla kaç J’dür?', siklar: ['−1700 ve 100', '−1700 ve 3500', '1700 ve 100', '1700 ve 3500', '0 ve 1800'], k: 3, cevap: 'A', cozum: 'Levent’in kuvveti yer değiştirmeye zıttır: $-850 \\times 2 = -1700$ J. Kerem’in kuvvetinin işi $900 \\times 2 = 1800$ J. Net iş $1800 - 1700 = 100$ J.' },
      { metin: 'Yatay yolda bir yük arabasını iten işçinin uyguladığı kuvvetin, arabanın yer değiştirmesine bağlı grafiği şekildeki gibidir. Kuvvet, yer değiştirme ile aynı yönlüdür.', sekil: gE27(60), yan: true, kok: 'Bu kuvvetin 0–3 m ve 3–6 m aralıklarında yaptığı işler sırasıyla kaç J’dür?', siklar: ['90 ve 90', '45 ve 90', '60 ve 120', '135 ve 45', '45 ve 135'], k: 3, cevap: 'E', cozum: 'İş, grafiğin altındaki alandır. 0–3 m: $\\tfrac{3 \\times 30}{2} = 45$ J. Toplam $\\tfrac{6 \\times 60}{2} = 180$ J olduğundan 3–6 m: $180 - 45 = 135$ J. Yolun ikinci yarısında 3 kat iş yapılır.' },
      { metin: 'Bir inşaat vinci, 200 kg kütleli yükü sabit hızla 15 m yükseğe şekildeki gibi kaldırıyor.', sekil: fVinc(50), yan: true, kok: 'Bu sırada halatın yüke uyguladığı kuvvetin yaptığı iş ve yük üzerinde yapılan net iş sırasıyla kaç J’dür?', siklar: ['3000 ve 0', '3000 ve 3000', '30 000 ve 0', '30 000 ve 30 000', '30 000 ve 60 000'], k: 2, cevap: 'C', cozum: 'Hız sabit olduğundan halat kuvveti ağırlığa eşittir: $200 \\times 10 = 2000$ N. Halatın işi $2000 \\times 15 = 30\\,000$ J. Ağırlığın işi $-30\\,000$ J olduğundan net iş sıfırdır.' },
      { metin: 'Bir depo robotu, 50 N ağırlığındaki koliyi sabit hızla taşıyor. Robot koliyi önce yatay zeminde 4 m götürüyor, sonra düşey doğrultuda 2 m yukarı kaldırıyor, bu yükseklikte yatay olarak 4 m daha taşıyor ve son olarak düşey doğrultuda 1 m aşağı indirip rafa bırakıyor.', kok: 'Robotun koliye uyguladığı düşey kuvvetin bu hareketin tamamında yaptığı iş kaç J’dür?', siklar: ['50', '100', '150', '450', '550'], cevap: 'A', cozum: 'Yatay taşımada kuvvet yer değiştirmeye dik olduğundan iş sıfırdır. Kaldırırken $50 \\times 2 = 100$ J, indirirken $-50 \\times 1 = -50$ J. Toplam 50 J.' },
      { metin: 'Yatay yolda bir sandığa yer değiştirmesi yönünde uygulanan kuvvetin yaptığı toplam işin, sandığın yer değiştirmesine bağlı grafiği şekildeki gibidir.', sekil: gE30(60), yan: true, onc: ['0–4 m aralığında kuvvetin büyüklüğü 50 N’dur.', '4–6 m aralığında kuvvet iş yapmamıştır.', '6–10 m aralığında uygulanan kuvvet, 0–4 m aralığında uygulanan kuvvetten büyüktür.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız III', 'I ve III', 'I ve II', 'I, II ve III'], k: 3, cevap: 'D', cozum: 'I: $\\tfrac{200}{4} = 50$ N, doğru. II: Toplam iş 200 J’de sabit kalmıştır, doğru. III: $\\tfrac{300 - 200}{4} = 25$ N, 50 N’dan küçüktür, yanlış.' },
    ],
    kontrol: ['Bir kuvvetin iş yapıp yapmadığına, kuvvet ile yer değiştirmenin yönüne bakarak karar verebiliyorum.', 'Pozitif ve negatif işi hesaplayıp net işi bulabiliyorum.', 'Kuvvet–yer değiştirme grafiğinin alanından işi okuyabiliyorum.'],
  },
  {
    no: 4, baslik: 'Güç ve iş, enerji, güç ilişkisi', kisa: 'Güç ve enerji', alt: 'İş ne kadar enerji aktarıldığını, güç bu aktarımın ne kadar hızlı olduğunu söyler.',
    plan: 'P = W / t, watt, güç etiketi, kWh ve elektrik faturası.',
    govde:
      ikili(
        bolum('Güç: işin yapılma hızı', `<p>İş yapmak <b>enerji aktarmaktır</b>: 6000 J iş yapan vinç, yüke 6000 J enerji aktarmıştır. Güç, bir saniyede yapılan iş ya da aktarılan enerjidir.</p>`) +
        formul('P = \\dfrac{W}{t}', '$1\\ \\text{W} = 1\\ \\text{J/s}$<br>$1\\ \\text{kW} = 1000\\ \\text{W}$') +
        kutu('ana', 'Aynı iş, farklı güç', `İki vinç de ${nb('$1000 \\times 6 = 6000$ J')} iş yapar. Biri 10 s’de bitirir: ${nb('$P = 600$ W')}. Diğeri 30 s’de bitirir: ${nb('$P = 200$ W')}. Güç işin miktarını değil, <b>hızını</b> söyler.`),
        sekil(fGuc(88), 'Şekil ölçeklidir. Yük ve yükseklik aynı, süre farklı.')) +
      ikili(
        sekil(fEtiket(74), 'Güç etiketi: bu ısıtıcı her saniye 2000 J elektrik enerjisi harcar.'),
        bolum('Güç etiketi ve kWh', `<p>Harcanan enerji, güç ile sürenin çarpımıdır. Güç <b>kW</b>, süre <b>saat</b> alınırsa enerji <b>kWh</b> çıkar. Faturada ödenen budur.</p>`) +
        formul('W = P\\,t', '$1\\ \\text{kWh} = 1\\ \\text{kW} \\times 1\\ \\text{h}$') +
        `<p><b>Fatura hesabı:</b> Isıtıcı günde toplam yarım saat çalışırsa günde ${nb('$2 \\times 0{,}5 = 1$ kWh')}, 30 günde 30 kWh harcar. 1 kWh 3 TL ise aylık bedel 90 TL olur.</p>`, 'g') +
      hata('Güçlü motor her zaman daha çok iş yapar.', 'Güçlü motor aynı işi daha kısa sürede yapar. Yeterli süre verilirse zayıf motor da aynı işi yapar.') +
      hata('kWh bir güç birimidir.', `kW güç, kWh enerji birimidir: ${nb('$1\\ \\text{kWh} = 1000\\ \\text{W} \\times 3600\\ \\text{s} = 3\\,600\\,000$ J')}.`),
    sorular: [
      { metin: 'Bir LED ampulün üzerinde 10 W yazmaktadır.', onc: ['Ampul yanarken her saniye 10 J elektrik enerjisi harcar.', 'Ampul 5 dakikada 3000 J enerji harcar.', 'Ampul toplam 100 saat yandığında 1 kWh enerji harcamış olur.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'E', cozum: 'I: $10\\ \\text{W} = 10\\ \\text{J/s}$, doğru. II: $10 \\times 300 = 3000$ J, doğru. III: $10 \\times 100 = 1000$ Wh, yani 1 kWh, doğru.' },
      { metin: 'Bir su pompası, kuyudaki suyu sabit hızla 5 m yükseklikteki depoya basıyor. Pompa her dakika 120 kg su çıkarıyor.', kok: 'Pompanın suyu yükseltmek için harcadığı güç kaç W’tır?', siklar: ['10', '100', '600', '1000', '6000'], cevap: 'B', cozum: 'Bir dakikada çıkan suyun ağırlığı $120 \\times 10 = 1200$ N, yapılan iş $1200 \\times 5 = 6000$ J. $P = \\tfrac{6000}{60} = 100$ W.' },
      { metin: 'Bir bisikletli düz yolda 5 m/s sabit hızla ilerliyor. Bisikletliye, hareketine zıt yönde toplam 40 N büyüklüğünde direnç kuvveti etki ediyor.', kok: 'Bisikleti ileri iten kuvvetin 1 dakikada yaptığı iş ve bu kuvvetin gücü sırasıyla nedir?', siklar: ['12 000 J ve 200 W', '12 000 J ve 12 000 W', '2400 J ve 40 W', '200 J ve 200 W', '200 J ve 8 W'], k: 3, cevap: 'A', cozum: 'Hız sabit olduğundan itici kuvvet 40 N’dur. 1 dakikada alınan yol $5 \\times 60 = 300$ m, iş $40 \\times 300 = 12\\,000$ J. Güç $\\tfrac{12\\,000}{60} = 200$ W.' },
      { metin: 'Bir evin elektrik sayacı saat 08.00’de ve saat 11.00’de şekildeki değerleri gösteriyor. Bu sürede evde yalnız bir elektrikli ısıtıcı kesintisiz çalışmıştır.', sekil: fSayac(74), yan: true, kok: 'Isıtıcının gücü kaç W’tır?', siklar: ['3', '27', '300', '3000', '9000'], cevap: 'D', cozum: 'Harcanan enerji $4529 - 4520 = 9$ kWh, süre 3 saattir. $P = \\tfrac{9}{3} = 3$ kW, yani 3000 W.' },
      { metin: 'Kütlesi 50 kg olan Ece ile 60 kg olan Can, 6 m yüksekliğindeki merdiveni sabit hızla çıkıyor. Ece 10 s’de, Can 15 s’de yukarı ulaşıyor.', onc: ['Can, yer çekimine karşı Ece’den daha fazla iş yapmıştır.', 'Ece’nin gücü Can’ın gücünden büyüktür.', 'Can’ın gücü 240 W’tır.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'E', cozum: 'Ece: $500 \\times 6 = 3000$ J, $P = 300$ W. Can: $600 \\times 6 = 3600$ J, $P = \\tfrac{3600}{15} = 240$ W. Can daha çok iş yapmış, Ece daha güçlüdür. Üçü de doğrudur.' },
      { metin: 'Elif’in çalışma lambasındaki 100 W’lık ampul günde 5 saat yanıyor. Elif bu ampulü, aynı ışığı veren 20 W’lık LED ampulle değiştiriyor. 1 kWh elektrik enerjisinin bedeli 3 TL’dir.', kok: 'Bu değişiklikle Elif’in 30 günlük elektrik faturası kaç TL azalır?', siklar: ['9', '12', '36', '45', '54'], cevap: 'C', cozum: 'Güç farkı 80 W. Günde $80 \\times 5 = 400$ Wh, 30 günde $12\\,000$ Wh, yani 12 kWh tasarruf edilir. Bedeli $12 \\times 3 = 36$ TL.' },
      { metin: 'Bir klimanın çektiği elektriksel gücün zamana bağlı grafiği şekildeki gibidir. 1 kWh elektrik enerjisinin bedeli 3 TL’dir.', sekil: gE37(66), yan: true, kok: 'Klimanın 6 saatte harcadığı elektrik enerjisi ve bu enerjinin bedeli sırasıyla nedir?', siklar: ['3 kWh ve 9 TL', '6 kWh ve 18 TL', '7 kWh ve 21 TL', '8 kWh ve 24 TL', '12 kWh ve 36 TL'], k: 2, cevap: 'D', cozum: 'Güç–zaman grafiğinde alan enerjidir: $2 \\times 2 + 1 \\times 4 = 8$ kWh. Bedeli $8 \\times 3 = 24$ TL.' },
      { metin: 'Bir ütünün güç etiketi şekildeki gibidir. Ütü toplam 50 dakika çalıştırılıyor.', sekil: fUtu(42), yan: true, kok: 'Ütünün bu sürede harcadığı elektrik enerjisi kaç J’dür ve bu enerji kaç kWh eder?', siklar: ['7 200 000 J ve 2 kWh', '7 200 000 J ve 120 kWh', '120 000 J ve 2 kWh', '120 000 J ve 120 kWh', '2 000 000 J ve 2 kWh'], k: 2, cevap: 'A', cozum: '50 dakika 3000 s’dir: $2400 \\times 3000 = 7\\,200\\,000$ J. $1\\ \\text{kWh} = 3\\,600\\,000$ J olduğundan bu enerji 2 kWh eder.' },
      { metin: `Bir dizüstü bilgisayarın bataryası tam doluyken 60 Wh (watt saat) enerji depoluyor. Bilgisayar ders çalışılırken ${nb('15 W')}, oyun oynanırken ${nb('30 W')} güç harcıyor. Deniz, tam dolu bataryayla önce 2 saat ders çalışıyor.`, kok: 'Deniz, bataryada kalan enerjiyle en fazla kaç dakika oyun oynayabilir?', siklar: ['30', '60', '90', '120', '150'], cevap: 'B', cozum: '2 saat ders çalışmak $15 \\times 2 = 30$ Wh harcar, geriye 30 Wh kalır. $\\tfrac{30}{30} = 1$ saat, yani 60 dakika oyun oynanabilir.' },
      { metin: 'Bir evin çatısına kurulacak güneş panellerinin her biri güneşli saatlerde 300 W güçle elektrik enerjisi üretiyor. Paneller günde ortalama 5 saat bu güçle çalışıyor. Evin 30 günlük elektrik enerjisi tüketimi 180 kWh’tir.', kok: 'Bu tüketimin tamamını karşılamak için en az kaç panel gerekir?', siklar: ['2', '3', '4', '6', '12'], cevap: 'C', cozum: 'Bir panel günde $0{,}3 \\times 5 = 1{,}5$ kWh, 30 günde 45 kWh üretir. $\\tfrac{180}{45} = 4$ panel gerekir.' },
    ],
    kontrol: ['İş ile süreden gücü hesaplayabiliyor, watt ile joule arasındaki ilişkiyi açıklayabiliyorum.', 'Aynı işi farklı sürede yapan iki makinenin gücünü karşılaştırabiliyorum.', 'Güç etiketinden yola çıkarak kWh cinsinden enerjiyi ve fatura bedelini hesaplayabiliyorum.'],
  },
];

// ---------- Deneme ----------
const tabloD5 = `<table class="t" style="width:58%;margin:6px 0 4px"><tr><th style="width:34%">Zaman (s)</th><td style="text-align:center">0</td><td style="text-align:center">2</td><td style="text-align:center">4</td><td style="text-align:center">6</td></tr><tr><th>Hız (m/s)</th><td style="text-align:center">6</td><td style="text-align:center">10</td><td style="text-align:center">14</td><td style="text-align:center">18</td></tr></table>`;
const deneme = [
  { konu: 'k1', metin: 'Aynı doğrusal yolda hareket eden K ve L araçlarının konum–zaman grafikleri şekildeki gibidir. Araçlar hızlarını değiştirmeden yollarına devam ediyor.', sekil: gD1(58), yan: true, kok: '$t = 8$ s anında araçlar arasındaki uzaklık kaç m olur?', siklar: ['50', '80', '100', '120', '140'], cevap: 'C', cozum: 'Eğimlerden $\\vartheta_K = 15$ m/s, $\\vartheta_L = -10$ m/s. $t = 8$ s’de $x_K = 120$ m, $x_L = 100 - 80 = 20$ m. Uzaklık $120 - 20 = 100$ m.' },
  { konu: 'k1', metin: 'Masada sabit hızla ilerleyen oyuncak arabanın 2 saniye arayla çekilen fotoğrafları şekildeki gibi üst üste getirilmiştir. Arabanın ön ucu sırasıyla cetvelin 10 cm, 30 cm, 50 cm ve 70 cm çizgilerindedir.', sekil: fOyuncak(104), kok: 'Araba aynı hızla ilerlemeye devam ederse ön ucu, ilk fotoğraftan kaç s sonra 150 cm çizgisine ulaşır?', siklar: ['14', '15', '16', '28', '30'], cevap: 'A', cozum: 'Araba 2 s’de 20 cm ilerler: hızı 10 cm/s. Gideceği yol $150 - 10 = 140$ cm, süre $\\tfrac{140}{10} = 14$ s.' },
  { konu: 'k1', metin: 'Doğrusal bir yolda sabit hızla hareket eden bir araç için üç yargı veriliyor.', onc: ['Araç, eşit zaman aralıklarında eşit yer değiştirmeler yapar.', 'Aracın konum–zaman grafiği zaman eksenine paralel bir doğrudur.', 'Aracın ivmesi sıfırdır.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'D', cozum: 'I ve III sabit hızın tanımından gelir. II yanlış: zaman eksenine paralel doğru, cismin durduğunu gösterir.' },
  { konu: 'k1', metin: 'Aralarında 440 km uzaklık bulunan iki şehirden K aracı saat 09.00’da 80 km/h, L aracı saat 10.00’da 100 km/h sabit hızla birbirine doğru yola çıkıyor.', kok: 'Araçlar karşılaştığında K aracı kaç km yol almış olur?', siklar: ['220', '240', '260', '280', '320'], cevap: 'B', cozum: 'K ilk 1 saatte 80 km gider. Kalan 360 km, saatte 180 km kapanır: 2 saat. K toplam $80 \\times 3 = 240$ km gider.' },
  { konu: 'k2', metin: `Doğrusal bir yolda sabit ivmeyle hızlanan bir aracın hızı, 2 saniye arayla ölçülüp tabloya yazılmıştır.${tabloD5}`, kok: 'Araç aynı ivmeyle hızlanmaya devam ederse $t = 8$ s anındaki hızı ve ilk 8 saniyedeki yer değiştirmesi sırasıyla nedir?', siklar: ['20 m/s ve 104 m', '20 m/s ve 160 m', '22 m/s ve 88 m', '22 m/s ve 176 m', '22 m/s ve 112 m'], k: 3, cevap: 'E', cozum: 'Hız her 2 s’de 4 m/s artıyor: $a = 2\\ \\text{m/s}^2$. $\\vartheta = 6 + 2 \\times 8 = 22$ m/s. $\\Delta x = \\tfrac{6 + 22}{2} \\times 8 = 112$ m.' },
  { konu: 'k2', metin: 'Doğrusal bir yolda aynı yönde hareket eden K ve L araçları $t = 0$ anında yan yanadır. Araçların hız–zaman grafikleri şekildeki gibidir.', sekil: gD6(58), yan: true, onc: ['Araçların ivmelerinin büyüklükleri eşittir.', '0–10 s aralığında araçların yer değiştirmeleri eşittir.', '$t = 5$ s anında araçlar yan yanadır.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 3, cevap: 'C', cozum: 'I: İkisinde de $2\\ \\text{m/s}^2$, doğru. II: İki üçgenin alanı da 100 m, doğru. III: $t = 5$ s anında yalnız hızlar eşittir, K 25 m, L 75 m gitmiştir.' },
  { konu: 'k2', metin: 'Doğrusal bir yolda hareket eden K, L ve M araçlarının bir andaki hız ($\\vartheta$) ve ivme ($a$) vektörleri şekildeki gibidir.', sekil: fUcArac(104), kok: 'Bu anda hangi araçların sürati artmaktadır?', siklar: ['Yalnız K', 'Yalnız L', 'K ve L', 'K ve M', 'K, L ve M'], k: 5, cevap: 'D', cozum: 'Hız ile ivme aynı yönlüyse cisim hızlanır: K ve M. L’de zıt yönlü olduklarından L yavaşlar.' },
  { konu: 'k2', metin: 'Durgun hâlden harekete geçen bir yolcu uçağı, pistte $4\\ \\text{m/s}^2$ sabit ivmeyle hızlanıyor. Uçağın havalanabilmesi için hızının 60 m/s olması gerekiyor.', kok: 'Uçağın havalanabilmesi için pistte en az kaç m yol alması gerekir?', siklar: ['225', '450', '480', '900', '1800'], cevap: 'B', cozum: '$60 = 4\\,t$ olduğundan $t = 15$ s. $\\Delta x = \\tfrac{0 + 60}{2} \\times 15 = 450$ m.' },
  { konu: 'k3', metin: 'Kuyudan çekilen su dolu kovanın dibindeki delikten su sızmaktadır. Kova sabit hızla 10 m yukarı çekilirken ipin kovaya uyguladığı kuvvet, kovanın yer değiştirmesine bağlı olarak şekildeki gibi azalıyor.', sekil: gD9(58), yan: true, kok: 'İpin kovaya uyguladığı kuvvetin 10 m boyunca yaptığı iş kaç J’dür?', siklar: ['900', '1200', '1500', '2400', '3000'], cevap: 'B', cozum: 'İş, grafiğin altındaki alandır. Yamuğun alanı $\\tfrac{150 + 90}{2} \\times 10 = 1200$ J.' },
  { konu: 'k3', metin: 'Bir öğrenci, 40 N ağırlığındaki çantasını yerden sabit hızla 1 m yukarı kaldırıyor. Sonra çantayı aynı yükseklikte tutarak yatay koridorda sabit hızla 20 m yürüyor.', kok: 'Öğrencinin çantaya uyguladığı kuvvetin, kaldırma sırasında ve yürüme sırasında yaptığı işler nedir?', siklar: ['0 ve 800 J', '40 J ve 800 J', '40 J ve 840 J', '800 J ve 0', '40 J ve 0'], k: 5, cevap: 'E', cozum: 'Kaldırırken kuvvet ve yer değiştirme aynı yönlü: $40 \\times 1 = 40$ J. Yürürken kuvvet yer değiştirmeye dik, iş sıfır.' },
  { konu: 'k3', metin: 'Bir curling sporcusu, buz üzerinde durmakta olan taşı 40 N büyüklüğündeki yatay kuvvetle 3 m boyunca itip bırakıyor. Taş, itilmeye başladığı noktadan toplam 30 m ilerledikten sonra duruyor. Hareket boyunca taşa 4 N büyüklüğünde sabit bir sürtünme kuvveti etki ediyor.', kok: 'Hareketin tamamında taş üzerinde yapılan net iş kaç J’dür?', siklar: ['0', '12', '108', '120', '240'], cevap: 'A', cozum: 'Sporcunun işi $40 \\times 3 = 120$ J. Sürtünme 30 m boyunca etki eder: $-4 \\times 30 = -120$ J. Net iş sıfırdır.' },
  { konu: 'k3', metin: 'Sürtünmesiz yatay yüzeylerde duran K, L ve M sandıklarına uygulanan yatay kuvvetler ve sandıkların bu kuvvetlerin etkisinde yaptığı yer değiştirmeler şekildeki gibidir.', sekil: fUcSandik(68), yan: true, kok: 'Kuvvetlerin yaptığı işler $W_K$, $W_L$ ve $W_M$ arasındaki ilişki nedir?', siklar: ['$W_K > W_L > W_M$', '$W_M > W_L > W_K$', '$W_K = W_L = W_M$', '$W_L > W_K = W_M$', '$W_K = W_M > W_L$'], k: 1, cevap: 'D', cozum: '$W_K = F \\times 3x = 3Fx$, $W_L = 2F \\times 2x = 4Fx$, $W_M = 3F \\times x = 3Fx$. Buna göre $W_L > W_K = W_M$.' },
  { konu: 'k4', metin: 'Bir evdeki üç elektrikli aletin güç etiketleri şekildeki gibidir. Fırın günde 1 saat, klima günde 3 saat, televizyon günde 5 saat çalışıyor. 1 kWh elektrik enerjisinin bedeli 3 TL’dir.', sekil: fUcEtiket(112), kok: 'Bu üç aletin 30 günde harcadığı elektrik enerjisinin toplam bedeli kaç TL’dir?', siklar: ['180', '360', '540', '720', '1080'], cevap: 'C', cozum: 'Günlük enerji: fırın 2 kWh, klima 3 kWh, televizyon 1 kWh, toplam 6 kWh. 30 günde 180 kWh, bedeli $180 \\times 3 = 540$ TL.' },
  { konu: 'k4', metin: 'K ve L motorlarının yaptıkları işin zamana bağlı grafiği şekildeki gibidir.', sekil: gD14(58), yan: true, kok: 'İki motor birlikte çalıştırılırsa 12 000 J’lük işi kaç s’de yapar?', siklar: ['30', '40', '60', '80', '120'], cevap: 'A', cozum: 'İş–zaman grafiğinde eğim güçtür: $P_K = \\tfrac{6000}{20} = 300$ W, $P_L = \\tfrac{4000}{40} = 100$ W. Birlikte 400 W: $t = \\tfrac{12\\,000}{400} = 30$ s.' },
  { konu: 'k4', metin: 'Bir spor salonundaki bisiklet, pedal çeviren sporcunun aktardığı enerjiyi elektrik enerjisine dönüştürüyor. Bir sporcu ortalama 150 W güçle 20 dakika pedal çeviriyor. Dönüşümdeki enerji kayıpları önemsenmiyor.', kok: 'Üretilen elektrik enerjisi, gücü 50 W olan bir televizyonu kaç dakika çalıştırır?', siklar: ['20', '30', '40', '45', '60'], cevap: 'E', cozum: 'Enerji eşitliği: $150 \\times 20 = 50 \\times t$. Buradan $t = 60$ dakika. Güç 3 kat küçükse aynı enerji 3 kat uzun süre yeter.' },
];

module.exports = {
  sinif: 10,
  kapakSekil: kapak,
  gunler, deneme,
  denemeKapsam: 'sabit hızlı hareket, sabit ivmeli hareket, iş, güç',
  konular: [
    { id: 'k1', ad: 'Sabit hızlı hareket ve grafikler', paket: 1 },
    { id: 'k2', ad: 'İvme ve sabit ivmeli hareket', paket: null },
    { id: 'k3', ad: 'İş', paket: 2 },
    { id: 'k4', ad: 'Güç ve enerji', paket: 2 },
  ],
  paketler: [{ no: 1, not: 'Gün 1’in konusu.' }, { no: 2, not: 'Gün 3 ve Gün 4’ün konusu.' }],
  planNot: 'Tatilden sonraki konu enerji biçimleri ve mekanik enerji. İş ve güç sağlam olursa o konu çok rahat ilerler.',
};
