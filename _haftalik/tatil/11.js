// 11. sınıf | Ara Tatil Fizik Kampı | Kapsam: serbest düşme, iki boyutta sabit ivmeli hareket, Newton'ın hareket yasaları, serbest cisim diyagramı (sürtünme yok)
// g = 10 m/s², sin37 = cos53 = 0,6; cos37 = sin53 = 0,8. Hava direnci önemsiz.
const { bolum, kutu, formul, sekil, ikili, uclu, hata } = require('./lib');
const R = require('./real');
const { C, S, T, OK, OLCU, ACI, ROZET } = R;
const alt = (a, b) => `${a}<tspan dy="5" dx="0.5" font-size="64%" font-style="normal">${b}</tspan><tspan dy="-5" font-size="64%">&#8203;</tspan>`;
const V = 'ϑ';

// ---------- Şekiller ----------
// Kapak: uçurumdan yatay fırlatılan top ve yörüngesi
const kapak = (() => {
  const w = 720, h = 330, s = R.SAHNE(w, h, { tur: 'cim', zh: 34, arka: R.GUNES(640, 58, 24) + R.BULUT(250, 56, 1.2) + R.BULUT(470, 96, .8) + R.BULUT(80, 40, .7) });
  const yer = s.yerY, x0 = 170, y0 = 86, k = 2.1; // 1 m = 2,1 px ; h = 100 m?  görsel amaçlı: t = 0..4 s, ϑx = 30 m/s
  let b = s.b + R.UCURUM(150, y0 + 14, 150, yer - y0 - 14) + R.AGAC(60, y0 + 14, .8) + R.AGAC(600, yer, 1.15) + R.AGAC(690, yer, .8);
  const P = t => [x0 + 30 * t * k * 1.45, y0 + 5 * t * t * k * 1.32];
  let d = ''; for (let t = 0; t <= 4.0; t += 0.1) { const [x, y] = P(t); d += (t ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' '; }
  b += `<path d="${d}" fill="none" stroke="#1d2b53" stroke-width="2.4" stroke-dasharray="3 7" stroke-linecap="round" opacity=".7"/>`;
  [1, 2, 3].forEach(t => { const [x, y] = P(t); b += R.HAYALET(x, y, 12, '#ef4444', .25 + t * .1); });
  const [x3, y3] = P(3);
  b += OK(x3, y3, x3 + 64, y3, C.mavi, { w: 5 }) + OK(x3, y3, x3, y3 + 64, C.turuncu, { w: 5 }) + R.TOP(x3, y3, 12, '#ef4444');
  b += T(x3 + 70, y3 - 8, alt(V, 'x'), { a: 'start', c: C.mavi, size: 20, it: true }) + T(x3 - 12, y3 + 62, alt(V, 'y'), { a: 'end', c: C.turuncu, size: 20, it: true });
  b += R.TOP(x0, y0, 12, '#ef4444') + OK(x0, y0, x0 + 64, y0, C.mavi, { w: 5 }) + T(x0 + 70, y0 - 8, alt(V, '0'), { a: 'start', c: C.mavi, size: 20, it: true });
  b += R.INSAN(120, y0 + 14, { renk: '#7c3aed', kol: 'it', k: .8 });
  return S(w, h, 180, b + s.cerceve);
})();

// Gün 1: serbest düşme (0, 1, 2, 3 s). Ölçek 4 px/m.
const fDusme = (mm = 78) => {
  const w = 350, h = 290, s = R.SAHNE(w, h, { tur: 'cim', zh: 26, arka: R.BULUT(60, 34, .6) });
  const yer = s.yerY, k = 4.6, x = 120, y0 = yer - 45 * k - 9;
  let b = s.b + R.BINA(14, yer, 72, 45 * k + 4, { kat: 12, sutun: 3 });
  [[0, 0, 0], [1, 5, 10], [2, 20, 20], [3, 45, 30]].forEach(([t, d, v], i) => {
    const y = y0 + d * k;
    b += i < 3 ? R.HAYALET(x, y, 9, '#ef4444', .4 + i * .15) : R.TOP(x, y, 9, '#ef4444');
    b += `<line x1="${x + 12}" y1="${y}" x2="${x + 104}" y2="${y}" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/>`;
    b += T(x + 110, y + 5, `t = ${t} s`, { a: 'start', size: 13, w: 700, c: '#334155' }) + T(x + 160, y + 5, `${V} = ${v} m/s`, { a: 'start', size: 13, c: C.turuncu });
  });
  b += OLCU(x + 30, y0, x + 30, y0 + 5 * k, '5 m', { size: 12, d: 8 }) + OLCU(x + 30, y0 + 5 * k, x + 30, y0 + 20 * k, '15 m', { size: 12, d: 8 }) + OLCU(x + 30, y0 + 20 * k, x + 30, y0 + 45 * k, '25 m', { size: 12, d: 8 });
  return S(w, h, mm, b + s.cerceve);
};
// ϑ–t grafikleri
const gDusme = (mm = 62) => R.GRAFIK({ xmax: 4, ymax: 40, dx: 1, dy: 10, sx: 46, sy: 3.6, xlab: 't (s)', ylab: `${V} (m/s)`, alan: [{ pts: [[0, 0], [3, 30]], c: C.mavi }], cizgi: [{ pts: [[0, 0], [4, 40]] }], kesik: [[3, 30]], notes: [{ x: 2.05, y: 6, s: 'alan = 45 m', c: C.mavi, size: 13 }], mm });
const gYukari = (mm = 66, o = {}) => R.GRAFIK({ xmax: 6, ymin: -30, ymax: 40, dx: 1, dy: 10, sx: 36, sy: 2.6, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: o.pts || [[0, 30], [6, -30]], c: C.mor }], nokta: o.nokta || [[3, 0, C.mor]], notes: o.notes || [{ x: 3.15, y: 9, s: 'tepe noktası', a: 'start', c: C.mor, size: 12.5 }], mm });

// Gün 2: yatay fırlatma (t = 0..3), ϑx sabit, ϑy artar. Ölçek 4 px/m, ϑx = 20 m/s.
const fYatay = (mm = 88) => {
  const w = 400, h = 270, s = R.SAHNE(w, h, { tur: 'cim', zh: 24 });
  const yer = s.yerY, k = 4.4, x0 = 92, y0 = yer - 45 * k - 8;
  let b = s.b + R.UCURUM(78, y0 + 10, 78, yer - y0 - 10);
  let d = ''; for (let t = 0; t <= 3.001; t += 0.1) d += (t ? 'L' : 'M') + (x0 + 20 * t * k).toFixed(1) + ' ' + (y0 + 5 * t * t * k).toFixed(1) + ' ';
  b += `<path d="${d}" fill="none" stroke="#1d2b53" stroke-width="2" stroke-dasharray="3 6" stroke-linecap="round" opacity=".65"/>`;
  [0, 1, 2].forEach(t => {
    const x = x0 + 20 * t * k, y = y0 + 5 * t * t * k;
    b += OK(x, y, x + 20 * 2.2, y, C.mavi, { w: 4, hd: 11 }) + (t ? OK(x, y, x, y + 10 * t * 2.2, C.turuncu, { w: 4, hd: 11 }) : '');
    b += t < 2 ? R.HAYALET(x, y, 8, '#ef4444', .5 + t * .2) : R.TOP(x, y, 8, '#ef4444');
    b += T(x + 50, y - 7, '20', { a: 'start', c: C.mavi, size: 13 }) + (t ? T(x - 8, y + 10 * t * 2.2 + 2, String(10 * t), { a: 'end', c: C.turuncu, size: 13 }) : '');
  });
  b += R.TOP(x0 + 60 * k, yer - 8, 8, '#ef4444', { golge: yer });
  b += OLCU(x0, yer + 13, x0 + 60 * k, yer + 13, 'x = 60 m', { ust: true, c: '#e2e8f0', tc: '#1d2b53', size: 13 });
  b += T(w - 12, 24, 'Hızlar m/s', { a: 'end', size: 12, w: 700, c: '#475569' });
  return S(w, h, mm, b + s.cerceve);
};
// Eğik fırlatma: ϑ0 = 50 m/s, 53°: ϑx = 30, ϑy = 40; t_uçuş = 8 s, h_max = 80 m, menzil = 240 m. Ölçek 1,45 px/m.
const fEgik = (mm = 150) => {
  const w = 600, h = 244, s = R.SAHNE(w, h, { tur: 'cim', zh: 30, arka: R.BULUT(540, 40, .8) + R.BULUT(70, 40, .7) });
  const yer = s.yerY, k = 1.9, x0 = 60;
  let b = s.b, d = '';
  for (let t = 0; t <= 8.001; t += 0.1) d += (t ? 'L' : 'M') + (x0 + 30 * t * k).toFixed(1) + ' ' + (yer - 8 - (40 * t - 5 * t * t) * k).toFixed(1) + ' ';
  b += `<path d="${d}" fill="none" stroke="#1d2b53" stroke-width="2.2" stroke-dasharray="3 6" stroke-linecap="round" opacity=".65"/>`;
  const P = t => [x0 + 30 * t * k, yer - 8 - (40 * t - 5 * t * t) * k], vk = 1.25;
  const [xt, yt] = P(4), [xs, ys] = P(8);
  // çıkış
  b += OK(x0, yer - 8, x0 + 30 * vk, yer - 8, C.mavi, { w: 3.6, hd: 10, dash: '6 4' }) + OK(x0, yer - 8, x0, yer - 8 - 40 * vk, C.turuncu, { w: 3.6, hd: 10, dash: '6 4' }) + OK(x0, yer - 8, x0 + 30 * vk, yer - 8 - 40 * vk, C.mor, { w: 4.6 });
  b += R.TOP(x0, yer - 8, 8, '#ef4444') + T(x0 + 30 * vk - 34, yer - 8 - 40 * vk - 10, `${alt(V, '0')} = 50 m/s`, { a: 'middle', c: C.mor, size: 13.5 }) + T(x0 - 7, yer - 8 - 28, '40', { a: 'end', c: C.turuncu, size: 13 }) + T(x0 + 50, yer - 13, '30', { a: 'start', c: C.mavi, size: 13 }) + ACI(x0, yer - 8, 20, 0, 53, '53°', { lr: 13, size: 11.5 });
  // tepe
  b += OK(xt, yt, xt + 30 * vk, yt, C.mavi, { w: 4.6 }) + R.TOP(xt, yt, 8, '#ef4444') + T(xt + 30 * vk + 8, yt - 12, `${alt(V, 'x')} = 30 m/s`, { a: 'start', c: C.mavi, size: 13.5 }) + ROZET(xt - 30, yt - 24, 'Tepe: düşey hız 0', C.koyu, { size: 12 });
  b += OLCU(xt, yt + 12, xt, yer, 'h = 80 m', { size: 13, dash: '4 4' });
  b += R.TOP(xs, ys, 8, '#ef4444', { golge: yer });
  b += OLCU(x0, yer + 15, xs, yer + 15, 'menzil = 240 m', { ust: true, c: '#e2e8f0', tc: '#1d2b53', size: 13 });
  return S(w, h, mm, b + s.cerceve);
};

// Gün 3: iki kutulu sistem
const fSistem = (mm = 96, o = {}) => {
  const w = 420, h = 130, y = 96;
  let b = R.ZEMIN(8, w - 8, y, { tur: 'buz', h: 22 });
  b += R.KUTU(70, y - 44, 56, 44, { lab: o.m1 || '2 kg', lw: 20, renk: '#0f766e' }) + R.IP(126, y - 22, 196, y - 22) + R.KUTU(196, y - 54, 68, 54, { lab: o.m2 || '3 kg', lw: 20, renk: '#7c3aed' });
  b += OK(274, y - 27, 274 + 80, y - 27, C.pembe, { w: 5 }) + T(360, y - 21, o.F || 'F = 20 N', { a: 'start', c: C.pembe, size: 15 });
  if (o.T !== false) b += T(161, y - 32, 'T', { c: C.mavi, size: 16, it: true });
  b += T(w / 2, y + 16, 'sürtünmesiz yatay yüzey', { size: 11.5, w: 700, c: '#3b6a86', halo: false });
  return S(w, h, mm, b);
};
const fUcBlok = (mm = 92) => {
  const w = 400, h = 124, y = 92;
  let b = R.ZEMIN(8, w - 8, y, { tur: 'buz', h: 22 });
  b += OK(40, y - 22, 120, y - 22, C.pembe, { w: 5 }) + T(36, y - 36, 'F = 24 N', { a: 'start', c: C.pembe, size: 15 });
  b += R.KUTU(126, y - 34, 40, 34, { lab: '1 kg', lw: 17, size: 12.5, renk: '#0f766e', d: 7 }) + R.KUTU(166, y - 46, 54, 46, { lab: '2 kg', lw: 19, size: 13.5, renk: '#2563eb', d: 7 }) + R.KUTU(220, y - 58, 68, 58, { lab: '3 kg', lw: 20, renk: '#7c3aed', d: 7 });
  b += T(w / 2, y + 16, 'sürtünmesiz yatay yüzey', { size: 11.5, w: 700, c: '#3b6a86', halo: false });
  return S(w, h, mm, b);
};
// Küçük kart şekilleri (3 yasa)
const fYasa1 = () => { let b = R.ZEMIN(4, 196, 84, { tur: 'buz', h: 16 }) + R.KUTU(40, 50, 42, 34, { renk: '#0f766e', d: 7 }) + OK(96, 67, 150, 67, C.mavi, { w: 4, hd: 11 }) + T(124, 54, `${V} sabit`, { c: C.mavi, size: 13 }) + T(100, 24, 'net kuvvet = 0', { size: 13, c: '#334155' }); return S(200, 100, 46, b); };
const fYasa2 = () => { let b = R.ZEMIN(4, 196, 84, { tur: 'buz', h: 16 }) + R.KUTU(30, 46, 46, 38, { renk: '#7c3aed', d: 7, lab: 'm', lw: 12 }) + OK(88, 65, 150, 65, C.pembe, { w: 5 }) + T(120, 52, alt('F', 'net'), { c: C.pembe, size: 14, it: true }) + OK(40, 26, 96, 26, C.yesil, { w: 3.4, hd: 10, dash: '6 4' }) + T(104, 31, 'a', { a: 'start', c: C.yesil, size: 15, it: true }); return S(200, 100, 46, b); };
const fYasa3 = () => { let b = R.ZEMIN(4, 196, 84, { tur: 'zemin', h: 16 }) + R.INSAN(58, 84, { kol: 'it', k: .8, renk: '#2563eb' }) + `<rect x="84" y="12" width="16" height="72" fill="url(#gBeton)" stroke="#64748b" stroke-width="1.2"/>` + OK(102, 38, 150, 38, C.pembe, { w: 4, hd: 11 }) + T(126, 28, 'etki', { c: C.pembe, size: 12.5 }) + OK(150, 62, 102, 62, C.turuncu, { w: 4, hd: 11 }) + T(128, 78, 'tepki', { c: C.turuncu, size: 12.5 }); return S(200, 100, 46, b); };
// Hız–zaman grafiği (soru 10)
const gHiz10 = (mm = 64) => R.GRAFIK({ xmax: 8, ymax: 12, dx: 1, dy: 4, sx: 30, sy: 9, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: [[0, 0], [2, 12], [5, 12], [8, 0]], c: C.mavi }], kesik: [[2, 12], [5, 12]], mm });
// F–a grafiği (deneme 11)
const gFa = (mm = 62) => R.GRAFIK({ xmax: 6, ymax: 12, dx: 2, dy: 4, sx: 34, sy: 10, xlab: 'a (m/s²)', ylab: 'F (N)', cizgi: [{ pts: [[0, 0], [2, 12]], c: C.mor, lab: 'K', lx: 1.5, ly: 12.4 }, { pts: [[0, 0], [6, 12]], c: C.yesil, lab: 'L', lx: 5.4, ly: 12.4 }], kesik: [[2, 12], [6, 12]], mm });
// ϑ–t (deneme 3)
const gD3 = (mm = 62) => R.GRAFIK({ xmax: 4, ymax: 40, dx: 1, dy: 10, sx: 46, sy: 3.6, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: [[0, 0], [4, 40]] }], kesik: [[2, 20], [4, 40]], mm });

// Gün 4: SCD şekilleri
// Açılı çekilen kutu. kuvvet: false → yalnız düzenek (soru şekli). true → solda düzenek, sağda ölçekli serbest cisim diyagramı.
const fAcili = (mm, o = {}) => {
  const m = o.m || 8, F = o.F || 50, aci = o.aci || 37, cs = aci === 37 ? [0.8, 0.6] : [0.6, 0.8], kv = o.kuvvet !== false;
  const G = m * 10, N = G - F * cs[1];
  // düzenek
  const y = 118, bx = 60, bw = 72, bh = 56, ox = bx + bw + 10, oy = y - bh / 2 - 4, L = 92;
  let b = R.ZEMIN(8, 262, y, { tur: 'buz', h: 20 }) + R.KUTU(bx, y - bh, bw, bh, { lab: `${m} kg`, lw: 21, renk: '#7c3aed' });
  b += `<line x1="${ox}" y1="${oy}" x2="${ox + 62}" y2="${oy}" stroke="#64748b" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  b += OK(ox - 2, oy, ox + L * cs[0], oy - L * cs[1], C.pembe) + T(ox + L * cs[0] + 6, oy - L * cs[1] - 4, `F = ${F} N`, { a: 'start', c: C.pembe, size: 15 });
  b += ACI(ox, oy, 34, 0, aci, `${aci}°`, { lr: 18, size: 13, c: C.pembe, tc: C.pembe });
  b += T(135, y + 15, 'sürtünmesiz yatay yüzey', { size: 11.5, w: 700, c: '#3b6a86', halo: false });
  if (!kv) return S(270, 142, mm, b);
  // serbest cisim diyagramı (1,3 px/N)
  const k = 1.3, cx = 372, cy = 108, fx = F * cs[0] * k, fy = F * cs[1] * k;
  b += `<rect x="286" y="6" width="228" height="238" rx="12" fill="#f8fafc" stroke="#d7dde8" stroke-width="1.3"/>` + T(400, 26, 'Serbest cisim diyagramı', { size: 12.5, c: '#475569', halo: false });
  b += `<line x1="${cx}" y1="${cy}" x2="${cx + fx}" y2="${cy}" stroke="${C.pembe}" stroke-width="1.8" stroke-dasharray="5 4"/><line x1="${cx + fx}" y1="${cy}" x2="${cx + fx}" y2="${cy - fy}" stroke="${C.pembe}" stroke-width="1.8" stroke-dasharray="5 4"/>`;
  b += OK(cx, cy, cx, cy - N * k, C.yesil) + OK(cx, cy, cx, cy + G * k, C.turuncu) + OK(cx, cy, cx + fx, cy - fy, C.pembe, { nokta: 5 });
  b += T(cx - 9, cy - N * k + 12, `N = ${N} N`, { a: 'end', c: C.yesil, size: 14 }) + T(cx - 9, cy + G * k - 4, `G = ${G} N`, { a: 'end', c: C.turuncu, size: 14 });
  b += T(cx + fx + 4, cy - fy - 7, `F = ${F} N`, { a: 'middle', c: C.pembe, size: 14 });
  b += T(cx + fx / 2 + 6, cy + 18, `${F * cs[0]} N`, { c: C.pembe, size: 13, w: 700 }) + T(cx + fx + 8, cy - fy / 2 + 5, `${F * cs[1]} N`, { a: 'start', c: C.pembe, size: 13, w: 700 });
  return S(520, 250, mm, b);
};
// Eğik düzlem: açı 37 | 53, kütle m; kuvvet: 'tam' | 'yok' | 'F' (eğim yukarı F oku)
const fEgikD = (mm, o = {}) => {
  const aci = o.aci || 37, m = o.m || 5, sn = aci === 37 ? 0.6 : 0.8, cs = aci === 37 ? 0.8 : 0.6, G = m * 10;
  const w = aci === 37 ? 380 : 300, h = aci === 37 ? 250 : 286, bx = 40, by = aci === 37 ? 214 : 250, B = aci === 37 ? 280 : 172, H = B * sn / cs;
  // dik köşe solda (bx,by), tepe (bx, by-H), uç (bx+B, by)
  let b = R.ZEMIN(8, w - 8, by, { tur: 'zemin', h: 18 }) + R.EGIK(bx, by, B, H, { yon: 'sag' });
  const ux = cs, uy = sn; // eğim aşağı birim vektörü (ekranda)
  const nx = sn, ny = -cs; // yüzey normali (dışarı, yukarı-sağ)
  const t = 0.45, px = bx + B * t, py = by - H + H * t, bw = 50, bh = 38;
  const cx = px + nx * (bh / 2), cy = py + ny * (bh / 2);
  b += `<g transform="rotate(${aci} ${cx} ${cy})">${R.KUTU(cx - bw / 2, cy - bh / 2, bw, bh, { renk: '#7c3aed', d: 0, golge: false })}</g>`;
  if (o.kuvvet !== 'tam') b += T(cx + nx * (bh / 2 + 16) + 4, cy + ny * (bh / 2 + 16) + 5, `${m} kg`, { a: 'start', size: 15, c: '#4c1d95' });
  b += ACI(bx + B, by, 44, 180 - aci, 180, `${aci}°`, { lr: aci === 37 ? 18 : 24, size: 13 });
  const k = o.k || 1.7;
  if (o.kuvvet === 'tam') {
    b += OK(cx, cy, cx + ux * G * sn * k, cy + uy * G * sn * k, C.mavi, { w: 3.6, hd: 11, dash: '6 4' }) + OK(cx, cy, cx - nx * G * cs * k, cy - ny * G * cs * k, C.mavi, { w: 3.6, hd: 11, dash: '6 4' });
    b += OK(cx, cy, cx, cy + G * k, C.turuncu) + OK(cx, cy, cx + nx * G * cs * k, cy + ny * G * cs * k, C.yesil, { nokta: true });
    b += T(cx + nx * G * cs * k + 8, cy + ny * G * cs * k + 2, `N = ${G * cs} N`, { a: 'start', c: C.yesil, size: 14 }) + ROZET(cx + 50, cy + G * k - 12, `G = ${G} N`, C.turuncu, { size: 13 });
    b += ROZET(cx + ux * G * sn * k + 30, cy + uy * G * sn * k + 2, `${G * sn} N`, C.mavi, { size: 12.5 }) + ROZET(cx - nx * G * cs * k - 30, cy - ny * G * cs * k + 6, `${G * cs} N`, C.mavi, { size: 12.5 });
  }
  if (o.kuvvet === 'F') { const fx = cx - ux * (bw / 2 + 4), fy = cy - uy * (bw / 2 + 4); b += OK(fx, fy, fx - ux * 70, fy - uy * 70, C.pembe) + T(fx - ux * 70 + 4, fy - uy * 70 - 10, o.Flab || 'F = 40 N', { a: 'start', c: C.pembe, size: 14.5 }); }
  return S(w, h, mm, b);
};
// Masa + makara + asılı cisim (soru 15)
const fMakara = (mm = 84) => {
  const w = 360, h = 230;
  let b = `<rect x="30" y="92" width="220" height="14" rx="3" fill="url(#gTahta)" stroke="#6b4a22" stroke-width="1.4"/><rect x="48" y="106" width="12" height="100" fill="url(#gTahtaYan)"/><rect x="220" y="106" width="12" height="100" fill="url(#gTahtaYan)"/>` + R.ZEMIN(8, w - 8, 206, { tur: 'zemin', h: 18 });
  b += R.KUTU(84, 44, 62, 48, { lab: '3 kg', lw: 20, renk: '#7c3aed' }) + R.IP(146, 68, 262, 68) + R.IP(276, 82, 276, 130) + `<line x1="248" y1="94" x2="262" y2="82" stroke="#475569" stroke-width="4" stroke-linecap="round"/>` + R.MAKARA(262, 82, 14);
  b += R.KUTU(254, 130, 44, 40, { lab: '2 kg', lw: 19, size: 13.5, renk: '#0f766e', d: 7, golge: false });
  b += T(140, 84 + 46, 'sürtünmesiz masa', { size: 11.5, w: 700, c: '#6b4a22' });
  return S(w, h, mm, b);
};
// Asansör + baskül (soru 14)
const fAsansor = (mm = 44) => {
  const w = 190, h = 230;
  let b = `<rect x="20" y="6" width="150" height="218" rx="4" fill="#eef2f7" stroke="#94a3b8" stroke-width="1.4"/><line x1="95" y1="6" x2="95" y2="34" stroke="#475569" stroke-width="3"/>`;
  b += `<g filter="url(#golge)"><rect x="40" y="34" width="110" height="170" rx="6" fill="url(#gMetalD)" stroke="#475569" stroke-width="1.8"/></g><rect x="50" y="44" width="90" height="150" rx="3" fill="#f8fafc" stroke="#94a3b8"/>`;
  b += `<rect x="70" y="182" width="50" height="10" rx="3" fill="#334155"/><rect x="82" y="184.5" width="26" height="5" rx="1.5" fill="#4ade80"/>` + R.INSAN(95, 182, { k: 1.05, renk: '#2563eb' });
  b += T(95, 218, 'baskül', { size: 11, w: 700, c: '#334155', halo: false });
  return S(w, h, mm, b);
};
// Tavana asılı iki cisim (deneme 13)
const fAsili = (mm = 40) => {
  const w = 190, h = 240;
  let b = R.TAVAN(30, 160, 20) + R.IP(95, 20, 95, 70) + R.KUTU(72, 70, 46, 38, { lab: '2 kg', lw: 19, size: 13.5, renk: '#0f766e', d: 7, golge: false }) + R.IP(95, 108, 95, 158) + R.KUTU(66, 158, 58, 48, { lab: '3 kg', lw: 20, renk: '#7c3aed', d: 7, golge: false });
  b += T(108, 50, alt('T', '1'), { a: 'start', c: C.mavi, size: 16, it: true }) + T(108, 138, alt('T', '2'), { a: 'start', c: C.mavi, size: 16, it: true });
  return S(w, h, mm, b);
};
// Yatay borudan fışkıran su (soru 8). Ölçek 30 px/m: h = 5 m, x = 8 m.
const fSu = (mm = 96) => {
  const w = 430, h = 236, s = R.SAHNE(w, h, { tur: 'cim', zh: 26, arka: R.BULUT(330, 40, .8) });
  const yer = s.yerY, k = 30, x0 = 96, y0 = yer - 5 * k;
  let b = s.b + `<rect x="20" y="${y0 - 26}" width="52" height="${yer - y0 + 26}" fill="url(#gBeton)" stroke="#7b8799" stroke-width="1.3"/><rect x="14" y="${y0 - 34}" width="64" height="10" rx="2" fill="#aab4c3" stroke="#7b8799" stroke-width="1.2"/>`;
  b += `<g filter="url(#golge)"><rect x="66" y="${y0 - 8}" width="${x0 - 66}" height="16" rx="3" fill="url(#gMetal)" stroke="#475569" stroke-width="1.2"/><rect x="${x0 - 6}" y="${y0 - 10}" width="7" height="20" rx="2" fill="#64748b"/></g>`;
  let d1 = '', d2 = '';
  for (let t = 0; t <= 1.0001; t += 0.05) { const x = x0 + 8 * k * t, y = y0 + 5 * k * t * t; d1 += (t ? 'L' : 'M') + x.toFixed(1) + ' ' + (y - 5 + 3 * t).toFixed(1) + ' '; d2 = `L${x.toFixed(1)} ${(y + 5 + 2 * t).toFixed(1)} ` + d2; }
  b += `<path d="${d1}${d2}Z" fill="url(#gSu)" opacity=".82"/><path d="${d1}" fill="none" stroke="#e0f2fe" stroke-width="1.6" opacity=".9"/>`;
  b += `<ellipse cx="${x0 + 8 * k + 4}" cy="${yer + 5}" rx="34" ry="5" fill="#38bdf8" opacity=".75"/><ellipse cx="${x0 + 8 * k - 2}" cy="${yer + 4}" rx="14" ry="2" fill="#e0f2fe" opacity=".9"/>`;
  b += `<line x1="${x0 - 30}" y1="${y0}" x2="${x0 - 62}" y2="${y0}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3 3" opacity="0"/>` + OLCU(x0 + 4, y0 + 10, x0 + 4, yer, '', {}) .replace(/<line[^>]*\/>/g, '') + OLCU(84, y0, 84, yer, '5 m', { size: 13.5, d: 9 });
  b += OLCU(x0, yer + 15, x0 + 8 * k, yer + 15, '8 m', { ust: true, c: '#e2e8f0', tc: '#1d2b53', size: 13.5 });
  return S(w, h, mm, b + s.cerceve);
};
// Stroboskop fotoğrafı (deneme 8): kareli zemin, 1 kare = 5 m; yatayda her aralıkta 2 kare, düşeyde 1, 3, 5 kare
const fStrobo = (mm = 62) => {
  const kz = R.KARELI(8, 11, 22); let b = kz.b;
  const P = [[1, 10], [3, 9], [5, 6], [7, 1]];
  let d = ''; for (let t = 0; t <= 3.001; t += 0.1) d += (t ? 'L' : 'M') + kz.X(1 + 2 * t).toFixed(1) + ' ' + kz.Y(10 - t * t).toFixed(1) + ' ';
  b += `<path d="${d}" fill="none" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="3 4"/>`;
  P.forEach(([x, y], i) => { b += R.TOP(kz.X(x), kz.Y(y), 7, '#ef4444'); b += T(kz.X(x) + 11, kz.Y(y) - 9, String(i + 1), { size: 12.5, a: 'start', c: '#334155' }); });
  return S(kz.W, kz.H, mm, b);
};

// ---------- Ek ısınma soruları için şekiller ----------
// Gün 1: yükseklik–zaman grafiği (yukarı atılan cisim, ϑ0 = 30 m/s)
const gHt = (mm = 58) => { const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 10; pts.push([t, 30 * t - 5 * t * t]); } return R.GRAFIK({ xmax: 6, ymax: 60, dx: 1, dy: 15, sx: 36, sy: 2.4, xlab: 't (s)', ylab: 'h (m)', cizgi: [{ pts, c: C.mor }], kesik: [[3, 45]], mm }); };
// Gün 1: 20 m'lik binadan bırakılan K ve 1 s sonra aşağı atılan L. Ölçek 9 px/m; K 1 s'de 5 m düşmüş.
const fIkiTas = (mm = 46) => {
  const w = 250, h = 250, s = R.SAHNE(w, h, { tur: 'cim', zh: 24 });
  const yer = s.yerY, k = 9, y0 = yer - 20 * k - 8;
  let b = s.b + R.BINA(18, yer, 80, 20 * k, { kat: 6, sutun: 3 }) + R.AGAC(226, yer, .8);
  b += `<line x1="112" y1="${y0 + 8}" x2="186" y2="${y0 + 8}" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  b += R.HAYALET(132, y0, 8, '#ef4444', .4) + R.TOP(132, y0 + 5 * k, 8, '#ef4444') + T(132, y0 + 5 * k + 26, 'K', { size: 15, c: '#b91c1c' });
  b += OK(158, y0 + 13, 158, y0 + 53, C.turuncu, { w: 4, hd: 11 }) + R.TOP(158, y0, 8, '#2563eb') + T(158, y0 - 13, 'L', { size: 15, c: '#1d4ed8' }) + T(168, y0 + 41, V, { a: 'start', size: 16, c: C.turuncu });
  b += OLCU(186, y0 + 8, 186, yer, '20 m', { size: 13, d: 8 });
  return S(w, h, mm, b + s.cerceve);
};
// Gün 2: hız bileşenleri–zaman grafiği (ϑx = 40 m/s, ϑ0y = 50 m/s)
const gBilesen = (mm = 66) => R.GRAFIK({ xmax: 10, ymin: -50, ymax: 50, dx: 1, dy: 10, sx: 24, sy: 1.8, xlab: 't (s)', ylab: `${V} (m/s)`, cizgi: [{ pts: [[0, 40], [10, 40]], c: C.mavi, lab: alt(V, 'x'), lx: 8.9, ly: 44.5 }, { pts: [[0, 50], [10, -50]], c: C.turuncu, lab: alt(V, 'y'), lx: 7.5, ly: -45 }], mm });
// Gün 2: 25 m/s, 37° ile atılan top 40 m uzaktaki binanın çatısına düşer (t = 2 s, h = 10 m). Ölçek 5,5 px/m.
const fCati = (mm = 96) => {
  const w = 340, h = 160, s = R.SAHNE(w, h, { tur: 'cim', zh: 24, arka: R.BULUT(96, 26, .6) });
  const yer = s.yerY, k = 5.5, x0 = 40, base = yer - 7;
  let b = s.b, d = '';
  for (let t = 0; t <= 2.001; t += 0.05) d += (t ? 'L' : 'M') + (x0 + 20 * t * k).toFixed(1) + ' ' + (base - (15 * t - 5 * t * t) * k).toFixed(1) + ' ';
  b += R.BINA(254, yer, 56, 10 * k, { kat: 3, sutun: 2 });
  b += `<path d="${d}" fill="none" stroke="#1d2b53" stroke-width="2" stroke-dasharray="3 6" stroke-linecap="round" opacity=".65"/>`;
  b += `<line x1="${x0}" y1="${base}" x2="${x0 + 72}" y2="${base}" stroke="#64748b" stroke-width="1.3" stroke-dasharray="5 4"/>`;
  b += OK(x0, base, x0 + 40, base - 30, C.mor, { w: 4.4, hd: 12 }) + R.TOP(x0, base, 7, '#ef4444') + ACI(x0, base, 30, 0, 37, '37°', { lr: 17, size: 12 });
  b += T(10, base - 45, `${alt(V, '0')} = 25 m/s`, { a: 'start', c: C.mor, size: 13 });
  b += R.TOP(x0 + 40 * k, base - 10 * k, 7, '#ef4444');
  b += OLCU(x0, yer + 13, x0 + 40 * k, yer + 13, '40 m', { ust: true, c: '#e2e8f0', tc: '#1d2b53', size: 13 });
  return S(w, h, mm, b + s.cerceve);
};
// Gün 3: kuş bakışı kareli zeminde üç kuvvet (1 kare = 2 N): F1 = 5 kare sağa, F2 = 4 kare yukarı, F3 = 2 kare sola.
const fKuvvetGrid = (mm = 52) => {
  const kz = R.KARELI(9, 6, 24), X = kz.X, Y = kz.Y; let b = kz.b;
  b += OK(X(3), Y(1), X(8), Y(1), C.pembe, { w: 4.4, hd: 13 }) + OK(X(3), Y(1), X(3), Y(5), C.mavi, { w: 4.4, hd: 13 }) + OK(X(3), Y(1), X(1), Y(1), C.turuncu, { w: 4.4, hd: 13 });
  b += R.TOP(X(3), Y(1), 8, '#64748b');
  b += T(X(7.5), Y(1) - 11, alt('F', '1'), { c: C.pembe, size: 15, it: true }) + T(X(3) + 12, Y(4.5) + 5, alt('F', '2'), { a: 'start', c: C.mavi, size: 15, it: true }) + T(X(1.5), Y(1) - 11, alt('F', '3'), { c: C.turuncu, size: 15, it: true });
  return S(kz.W, kz.H, mm, b);
};
// Gün 3: net kuvvet–zaman grafiği
const gFt = (mm = 60) => R.GRAFIK({ xmax: 6, ymin: -4, ymax: 8, dx: 1, dy: 4, sx: 34, sy: 11, xlab: 't (s)', ylab: `${alt('F', 'net')} (N)`, cizgi: [{ pts: [[0, 8], [2, 8]], c: C.pembe }, { pts: [[2, 0], [4, 0]], c: C.pembe }, { pts: [[4, -4], [6, -4]], c: C.pembe }], kesik: [[2, 8], [4, -4], [6, -4]], mm });
// Gün 4: aynı kutu I'de 37° yukarı çekiliyor, II'de 37° aşağı itiliyor (oklar eşit boyda).
const fItCek = (mm = 124) => {
  const w = 520, h = 146, y = 122, L = 80;
  const yuz = x => T(x, y + 15, 'sürtünmesiz yatay yüzey', { size: 11.5, w: 700, c: '#3b6a86', halo: false });
  const kutu = x => R.KUTU(x, y - 50, 64, 50, { lab: 'm', lw: 13, renk: '#7c3aed' });
  const ox = 126, oy = y - 29, tx = 386, ty = y - 42;
  let b = R.ZEMIN(8, 250, y, { tur: 'buz', h: 20 }) + kutu(50) + `<line x1="${ox}" y1="${oy}" x2="${ox + 62}" y2="${oy}" stroke="#64748b" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  b += OK(ox - 2, oy, ox + L * .8, oy - L * .6, C.pembe) + T(ox + L * .8 + 7, oy - L * .6 - 3, 'F', { a: 'start', c: C.pembe, size: 16, it: true }) + ACI(ox, oy, 34, 0, 37, '37°', { lr: 18, size: 13, c: C.pembe, tc: C.pembe });
  b += ROZET(28, 22, 'I', C.koyu, { size: 13, w: 26 }) + yuz(129);
  b += R.ZEMIN(270, 512, y, { tur: 'buz', h: 20 }) + kutu(390) + `<line x1="${tx}" y1="${ty}" x2="${tx - 62}" y2="${ty}" stroke="#64748b" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  b += OK(tx - L * .8, ty - L * .6, tx, ty, C.pembe) + T(tx - L * .8 - 6, ty - L * .6 - 6, 'F', { c: C.pembe, size: 16, it: true }) + ACI(tx, ty, 34, 143, 180, '37°', { lr: 18, size: 13, c: C.pembe, tc: C.pembe });
  b += ROZET(494, 22, 'II', C.koyu, { size: 13, w: 30 }) + yuz(391);
  return S(w, h, mm, b);
};
// Gün 4: tavana asılı makara, iki yanında 1 kg ve 4 kg
const fAtwood = (mm = 30) => {
  const w = 200, h = 250;
  let b = R.TAVAN(30, 170, 20) + `<line x1="100" y1="20" x2="100" y2="58" stroke="#475569" stroke-width="4" stroke-linecap="round"/>` + R.IP(74, 58, 74, 176) + R.IP(126, 58, 126, 110) + R.MAKARA(100, 58, 26);
  b += R.KUTU(57, 176, 34, 30, { lab: '1 kg', lw: 16, size: 12.5, renk: '#0f766e', d: 6, golge: false }) + R.KUTU(104, 110, 44, 40, { lab: '4 kg', lw: 19, size: 13.5, renk: '#7c3aed', d: 7, golge: false });
  b += R.ZEMIN(8, w - 8, 228, { tur: 'zemin', h: 18 });
  return S(w, h, mm, b);
};
// Gün 4: 37° eğik düzlemdeki cisim, tepedeki makaradan geçen iple asılı cisme bağlı
const fEgikMakara = (mm = 58) => {
  const w = 380, h = 258, bx = 110, by = 236, B = 240, H = 180, cs = 0.8, sn = 0.6, nx = sn, ny = -cs;
  const tx = bx, ty = by - H, bw = 50, bh = 38, q = bh / 2, r = 13, e = 36;
  const cx = tx + cs * 150 + nx * q, cy = ty + sn * 150 + ny * q;
  const mx = tx - cs * e + nx * (q - r), my = ty - sn * e + ny * (q - r);
  let b = R.ZEMIN(8, w - 8, by, { tur: 'zemin', h: 18 }) + R.EGIK(bx, by, B, H, { yon: 'sag' });
  b += `<line x1="${tx}" y1="${ty + 3}" x2="${mx}" y2="${my}" stroke="#475569" stroke-width="5" stroke-linecap="round"/>`;
  b += R.IP(cx - cs * bw / 2, cy - sn * bw / 2, mx + nx * r, my + ny * r) + R.IP(mx - r, my, mx - r, 122) + R.MAKARA(mx, my, r);
  b += `<g transform="rotate(37 ${cx} ${cy})">${R.KUTU(cx - bw / 2, cy - bh / 2, bw, bh, { renk: '#7c3aed', d: 0, golge: false })}</g>`;
  b += T(cx + nx * (bh / 2 + 16) + 4, cy + ny * (bh / 2 + 16) + 5, '6 kg', { a: 'start', size: 15, c: '#4c1d95' });
  b += R.KUTU(mx - r - 22, 122, 44, 40, { lab: '6 kg', lw: 19, size: 13.5, renk: '#0f766e', d: 7, golge: false });
  b += ACI(bx + B, by, 44, 143, 180, '37°', { lr: 24, size: 13 });
  return S(w, h, mm, b);
};

// ---------- Günler ----------
const gunler = [
  {
    kontrol: ["Düşme süresinden yüksekliği ve çarpma hızını bulabiliyorum.", "Yukarı atılan cismin çıkış süresini ve en büyük yüksekliğini hesaplayabiliyorum.", "Hız–zaman grafiğinin eğiminden ivmeyi, alanından yolu okuyabiliyorum."],
    no: 1, baslik: 'Serbest düşme', kisa: 'Serbest düşme', alt: 'Yalnızca yer çekimi etkisindeki hareket. Hava direnci önemsiz, $g = 10\\ \\text{m/s}^2$.',
    plan: 'Düşen ve yukarı atılan cisim, hız ve yol hesapları, ϑ–t grafiği.',
    govde:
      ikili(
        bolum('Durgun hâlden bırakılan cisim', `<p>Cisim her saniye <b>10 m/s</b> hızlanır. Hız düzgün artar, alınan yol ise zamanın karesiyle büyür.</p>`) +
        formul('\\vartheta = g\\,t \\qquad h = \\tfrac{1}{2}\\,g\\,t^2 \\qquad \\vartheta^2 = 2\\,g\\,h') +
        kutu('ana', '1 : 3 : 5 kuralı', `Ardışık saniyelerde alınan yollar <b>5 m, 15 m, 25 m</b> diye gider. Toplamları 5, 20, 45 m eder. Bu sayılar aklındaysa çoğu soruda formüle gerek kalmaz.`) +
        kutu('sari', 'Kütle nerede?', `Formüllerin hiçbirinde kütle yok. Hava direnci önemsizse çekiç de tüy de <b>aynı anda</b> yere düşer.`),
        sekil(fDusme(80), 'Şekil ölçeklidir: top 3 s’de 45 m düşer.'), 's') +
      ikili(
        bolum('Yukarı atılan cisim', `<p>Çıkarken her saniye 10 m/s yavaşlar, tepe noktasında hızı <b>anlık</b> sıfır olur, sonra aynı yoldan geri döner.</p>`) +
        formul('t_{\\text{çıkış}} = \\dfrac{\\vartheta_0}{g} \\qquad h_{\\max} = \\dfrac{\\vartheta_0^{\\,2}}{2\\,g}') +
        `<p><b>Simetri:</b> Çıkış süresi iniş süresine eşittir. Cisim aynı yükseklikten çıkarken ve inerken <b>aynı süratle</b> geçer.</p>`,
        sekil(gYukari(70), '30 m/s ile yukarı atılan cisim. Eğim her yerde $-10\\ \\text{m/s}^2$.'), 's') +
      hata('Tepe noktasında hız sıfır olduğuna göre ivme de sıfırdır.', 'Tepede yalnız hız sıfırdır. İvme her an $g$ kadardır ve aşağı yönlüdür.') +
      hata('Ağır cisim daha çabuk düşer.', 'Hava direnci önemsizken düşme süresi kütleye bağlı değildir.'),
    sorular: [
      { metin: 'Aynı yükseklikten K cismi serbest bırakılıyor, L cismi $\\vartheta$ süratiyle düşey aşağı, M cismi aynı $\\vartheta$ süratiyle düşey yukarı atılıyor. Hava direnci önemsizdir.', kok: 'Cisimlerin yere çarpma hızlarının büyüklükleri $\\vartheta_K$, $\\vartheta_L$ ve $\\vartheta_M$ arasındaki ilişki nedir?', siklar: ['$\\vartheta_K = \\vartheta_L = \\vartheta_M$', '$\\vartheta_L = \\vartheta_M > \\vartheta_K$', '$\\vartheta_L > \\vartheta_K > \\vartheta_M$', '$\\vartheta_L > \\vartheta_M > \\vartheta_K$', '$\\vartheta_M > \\vartheta_L > \\vartheta_K$'], k: 3, cevap: 'B', cozum: 'M, atıldığı noktaya aynı $\\vartheta$ süratiyle ve aşağı yönlü olarak geri döner, bundan sonra L ile aynı hareketi yapar: $\\vartheta_L = \\vartheta_M$. K ilk hızsız düştüğünden çarpma hızı en küçüktür.' },
      { metin: 'Bir köprüden 5 m/s hızla düşey aşağı atılan taş, atıldıktan 3 s sonra köprünün altındaki suya çarpıyor.', kok: 'Taşın atıldığı noktanın su yüzeyinden yüksekliği ve taşın suya çarpma hızı sırasıyla kaç m ve kaç m/s’dir?', siklar: ['45 ve 30', '45 ve 35', '60 ve 30', '60 ve 35', '75 ve 35'], k: 5, cevap: 'D', cozum: '$h = 5 \\times 3 + 5 \\times 3^2 = 15 + 45 = 60$ m. $\\vartheta = 5 + 10 \\times 3 = 35$ m/s.' },
      { metin: 'K cismi $h$ yüksekliğinden serbest bırakıldığında $t$ sürede ve $\\vartheta$ hızıyla yere çarpıyor. L cismi aynı ortamda $4h$ yüksekliğinden serbest bırakılıyor.', kok: 'L’nin yere düşme süresi ve yere çarpma hızı nedir?', siklar: ['$2t$ ve $2\\vartheta$', '$2t$ ve $4\\vartheta$', '$4t$ ve $2\\vartheta$', '$4t$ ve $4\\vartheta$', '$\\sqrt{2}\\,t$ ve $2\\vartheta$'], k: 3, cevap: 'A', cozum: '$h = 5t^2$ olduğundan yükseklik 4 katına çıkınca süre 2 katına çıkar. $\\vartheta = g\\,t$ olduğundan hız da 2 katına çıkar.' },
      { metin: 'K cismi yüksek bir kuleden $t = 0$ anında serbest bırakılıyor. L cismi aynı noktadan $t = 1$ s anında serbest bırakılıyor. L bırakıldıktan sonra, iki cisim de havadayken;', onc: ['$t = 3$ s anında aralarındaki uzaklık 25 m’dir.', 'Aralarındaki uzaklık zamanla değişmez.', 'Hızlarının büyüklükleri arasındaki fark her an 10 m/s’dir.'], kok: 'yargılarından hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız III', 'I ve III', 'II ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'I: K 3 s’de 45 m, L 2 s’de 20 m düşer, aradaki uzaklık 25 m, doğru. II: K her an daha hızlı olduğundan uzaklık sürekli artar, yanlış. III: Hız farkı $10t - 10(t - 1) = 10$ m/s, doğru.' },
      { metin: 'Hava direncinin önemsiz olduğu bir ortamda bir taş 80 m yükseklikten serbest bırakılıyor.', kok: 'Taş, yere çarpmadan önceki son 1 saniyede kaç m yol alır?', siklar: ['15', '20', '25', '30', '35'], cevap: 'E', cozum: '$80 = 5t^2$ olduğundan $t = 4$ s. İlk 3 s’de $5 \\times 9 = 45$ m düşer. Son 1 s’de $80 - 45 = 35$ m yol alır.' },
      { metin: 'Yerden düşey yukarı atılan bir cismin yerden yüksekliğinin zamana bağlı grafiği şekildeki gibidir.', sekil: gHt(58), yan: true, onc: ['Cisim 30 m/s hızla atılmıştır.', '$t = 1$ s ve $t = 5$ s anlarında cismin sürati aynıdır.', 'Cismin 0–6 s aralığındaki yer değiştirmesi 90 m’dir.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III'], k: 3, cevap: 'B', cozum: 'I: Tepeye 3 s’de çıkmış, $\\vartheta_0 = 10 \\times 3 = 30$ m/s, doğru. II: İki an tepe noktasına eşit uzaklıktadır, sürat ikisinde de 20 m/s, doğru. III: Cisim atıldığı yere dönmüştür, yer değiştirme sıfırdır. 90 m alınan yoldur, yanlış.' },
      { metin: 'Yerden düşey yukarı atılan bir cismin hız–zaman grafiği şekildeki gibidir. Yukarı yön pozitif seçilmiştir.', sekil: gYukari(62, { pts: [[0, 40], [6, -20]], nokta: [[4, 0, C.mor]], notes: [] }), yan: true, onc: ['Cismin çıkabildiği en büyük yükseklik 80 m’dir.', '$t = 6$ s anında cisim yerden 60 m yüksektedir.', '$t = 4$ s anında cismin ivmesi sıfırdır.'], kok: 'Buna göre yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 3, cevap: 'C', cozum: 'I: 0–4 s alanı $\\tfrac{40 \\times 4}{2} = 80$ m, doğru. II: 4–6 s’de $\\tfrac{20 \\times 2}{2} = 20$ m iner, $80 - 20 = 60$ m, doğru. III: İvme grafiğin eğimidir, her an $-10\\ \\text{m/s}^2$, yanlış.' },
      { metin: 'Yüksekliği 20 m olan binanın çatısından K taşı serbest bırakılıyor. K bırakıldıktan <span style="white-space:nowrap">1 s</span> sonra L taşı aynı yükseklikten $\\vartheta$ hızıyla düşey aşağı atılıyor. Şekil, L’nin atıldığı anı göstermektedir. İki taş yere aynı anda çarpıyor.', sekil: fIkiTas(44), yan: true, kok: 'L taşının atılma hızı $\\vartheta$ kaç m/s’dir?', siklar: ['15', '20', '25', '30', '35'], cevap: 'A', cozum: 'K için $20 = 5t^2$, $t = 2$ s. L havada $2 - 1 = 1$ s kalır: $20 = \\vartheta \\times 1 + 5 \\times 1^2$, $\\vartheta = 15$ m/s.' },
      { metin: 'Bir çocuk balkondan bir topu 20 m/s hızla düşey yukarı atıyor. Top, atıldıktan 5 s sonra yere çarpıyor.', kok: 'Topun atıldığı nokta yerden kaç m yüksektedir?', siklar: ['5', '15', '20', '25', '45'], cevap: 'D', cozum: 'Yukarı yön pozitif: $y = 20 \\times 5 - 5 \\times 5^2 = 100 - 125 = -25$ m. Top atıldığı noktanın 25 m altına inmiştir, balkon 25 m yüksektedir.' },
      { metin: 'Yerden düşey yukarı atılan bir cisim, $t = 2$ s ve $t = 8$ s anlarında yerden aynı yükseklikteki P noktasından geçiyor.', kok: 'Cismin atılma hızı ve P noktasının yerden yüksekliği sırasıyla kaç m/s ve kaç m’dir?', siklar: ['30 ve 40', '40 ve 60', '50 ve 45', '50 ve 60', '50 ve 80'], k: 5, cevap: 'E', cozum: 'Hareket simetrik olduğundan cisim tepe noktasına $\\tfrac{2 + 8}{2} = 5$ s’de çıkar: $\\vartheta_0 = 10 \\times 5 = 50$ m/s. $t = 2$ s anında yükseklik $50 \\times 2 - 5 \\times 2^2 = 80$ m.' },
    ],
  },
  {
    kontrol: ["Yatay ve düşey hareketi ayrı ayrı yazabiliyorum.", "Süreyi düşey hareketten bulup yatay uzaklığı hesaplayabiliyorum.", "Eğik fırlatılan cismin ilk hızını bileşenlerine ayırabiliyorum.", "Tepe noktasındaki hızı ve menzili bulabiliyorum."],
    no: 2, baslik: 'İki boyutta sabit ivmeli hareket', kisa: 'İki boyutta hareket', alt: 'Yatay doğrultuda ve eğik olarak fırlatılan cisimler. Sır: yatay ve düşey hareketi ayrı ayrı düşün.',
    plan: 'Yatay ve eğik fırlatılan cisim, bileşenler, tepe noktası, menzil.',
    govde:
      ikili(
        bolum('Yatay doğrultuda fırlatılan cisim', `<p><b>Yatayda</b> kuvvet yok: hız hiç değişmez. <b>Düşeyde</b> cisim serbest düşme yapar. İki hareketin ortak tek şeyi <b>süredir</b>.</p>`) +
        formul('x = \\vartheta_0\\,t \\qquad h = \\tfrac{1}{2}\\,g\\,t^2 \\qquad \\vartheta_y = g\\,t') +
        kutu('ana', 'Önce süre', `Süreyi her zaman <b>düşey</b> hareketten bul. Şekilde $45 = 5t^2$, yani $t = 3$ s. Sonra yatayda $x = 20 \\times 3 = 60$ m.`) +
        `<p>Yere çarpma hızı iki bileşenin bileşkesidir: $\\vartheta = \\sqrt{\\vartheta_x^{\\,2} + \\vartheta_y^{\\,2}}$.</p>`,
        sekil(fYatay(86), 'Mavi oklar hep aynı boyda, turuncu oklar her saniye 10 m/s uzar.'), 's') +
      bolum('Eğik olarak fırlatılan cisim', `<p>İlk hızı bileşenlerine ayır: $\\vartheta_{0x} = \\vartheta_0 \\cos\\alpha$ ve $\\vartheta_{0y} = \\vartheta_0 \\sin\\alpha$. Düşey bileşen yukarı atılan cisim gibi davranır, yatay bileşen hiç değişmez.</p>`) +
      sekil(fEgik(158), '50 m/s hızla ve 53° açıyla fırlatılan cisim: çıkış 4 s, uçuş 8 s.') +
      formul('t_{\\text{çıkış}} = \\dfrac{\\vartheta_{0y}}{g} \\qquad h_{\\max} = \\dfrac{\\vartheta_{0y}^{\\,2}}{2\\,g} \\qquad \\text{menzil} = \\vartheta_{0x}\\; t_{\\text{uçuş}}') +
      hata('Eğik fırlatılan cismin tepe noktasında hızı sıfırdır.', 'Tepede yalnız düşey bileşen sıfırdır. Cismin hızı $\\vartheta_{0x}$ kadardır.') +
      hata('Yatay fırlatılan cisim, aynı yükseklikten bırakılan cisimden geç düşer.', 'İkisinin düşey hareketi aynıdır, aynı anda yere düşerler.'),
    sorular: [
      { metin: 'Bir okçu, 60 m uzaktaki hedefin tam merkezine nişan alıp oku 60 m/s hızla <b>yatay doğrultuda</b> fırlatıyor.', kok: 'Ok, hedefin bulunduğu düşey düzleme nişan alınan noktanın kaç m altında ulaşır?', siklar: ['1', '2', '4', '5', '10'], cevap: 'D', cozum: 'Ok yataydaki 60 m’yi $\\tfrac{60}{60} = 1$ s’de alır. Bu sürede düşeyde serbest düşme yapar ve $5 \\times 1^2 = 5$ m aşağı iner.' },
      { metin: 'Aynı yükseklikten K cismi serbest bırakılıyor, L cismi $\\vartheta$ hızıyla, M cismi $2\\vartheta$ hızıyla yatay doğrultuda fırlatılıyor.', kok: 'Cisimlerin yere düşme süreleri $t_K, t_L, t_M$ ve yere çarpma hızlarının büyüklükleri $\\vartheta_K, \\vartheta_L, \\vartheta_M$ arasındaki ilişki nedir?', siklar: ['$t_K = t_L = t_M$ ve $\\vartheta_K = \\vartheta_L = \\vartheta_M$', '$t_K = t_L = t_M$ ve $\\vartheta_M > \\vartheta_L > \\vartheta_K$', '$t_M > t_L > t_K$ ve $\\vartheta_M > \\vartheta_L > \\vartheta_K$', '$t_K > t_L > t_M$ ve $\\vartheta_K = \\vartheta_L = \\vartheta_M$', '$t_M > t_L > t_K$ ve $\\vartheta_K = \\vartheta_L = \\vartheta_M$'], k: 1, cevap: 'B', cozum: 'Düşey hareketleri aynı olduğundan süreler ve düşey hızlar eşittir. Yatay hızı büyük olanın bileşke hızı da büyüktür: $\\vartheta_M > \\vartheta_L > \\vartheta_K$.' },
      { metin: 'K ve L cisimleri yerden aynı $\\vartheta_0$ süratiyle, K yatayla 37°, L yatayla 53° açı yapacak biçimde fırlatılıyor. ($\\sin 37^\\circ = \\cos 53^\\circ = 0{,}6$; $\\cos 37^\\circ = \\sin 53^\\circ = 0{,}8$)', onc: ['L, havada K’den daha uzun süre kalır.', 'K ve L’nin menzilleri eşittir.', 'K ve L’nin tepe noktasındaki hızları eşittir.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'I: Uçuş süresi düşey bileşene bağlıdır, L’ninki daha büyüktür ($0{,}8\\,\\vartheta_0$), doğru. II: Menzil, yatay hız ile uçuş süresinin çarpımıdır, ikisinde de $0{,}6 \\times 0{,}8$ çarpanı bulunur, doğru. III: Tepedeki hız yatay bileşendir: K’de $0{,}8\\,\\vartheta_0$, L’de $0{,}6\\,\\vartheta_0$, yanlış.' },
      { metin: 'Bir cisim 80 m yüksekliğindeki bir kuleden 30 m/s hızla yatay doğrultuda fırlatılıyor.', kok: 'Cismin yere çarpma hızının büyüklüğü kaç m/s’dir?', siklar: ['30', '40', '50', '70', '80'], cevap: 'C', cozum: '$80 = 5t^2$, $t = 4$ s. $\\vartheta_y = 10 \\times 4 = 40$ m/s, $\\vartheta_x = 30$ m/s. $\\vartheta = \\sqrt{30^2 + 40^2} = 50$ m/s.' },
      { metin: 'Bir taş, yerden 20 m yükseklikteki bir noktadan 24 m/s hızla yatay doğrultuda fırlatılıyor.', kok: 'Taşın, fırlatıldığı andan yere çarptığı ana kadarki yer değiştirmesinin büyüklüğü kaç m’dir?', siklar: ['20', '28', '44', '48', '52'], cevap: 'E', cozum: '$20 = 5t^2$, $t = 2$ s. Taş yatayda $24 \\times 2 = 48$ m, düşeyde 20 m yol alır. Yer değiştirme bu ikisinin bileşkesidir: $\\sqrt{48^2 + 20^2} = 52$ m.' },
      { metin: 'Bir bahçe duvarındaki yatay borudan fışkıran su, borunun ağzından 5 m aşağıdaki zemine şekildeki gibi düşüyor. Suyun yere değdiği nokta, boru ağzının yatayda 8 m ilerisindedir.', sekil: fSu(88), kok: 'Su borudan kaç m/s hızla çıkmaktadır?', siklar: ['4', '5', '8', '10', '16'], cevap: 'C', cozum: 'Süre düşey hareketten bulunur: $5 = 5t^2$, $t = 1$ s. Su bu sürede yatayda 8 m gitmiştir: $\\vartheta_0 = \\tfrac{8}{1} = 8$ m/s.' },
      { metin: 'Bir top yerden 50 m/s hızla, yatayla 37° açı yapacak biçimde fırlatılıyor. ($\\sin 37^\\circ = 0{,}6$; $\\cos 37^\\circ = 0{,}8$)', kok: 'Topun çıkabildiği en büyük yükseklik ve menzili kaç m’dir?', siklar: ['45 ve 120', '45 ve 240', '80 ve 120', '80 ve 240', '90 ve 240'], k: 5, cevap: 'B', cozum: '$\\vartheta_{0x} = 40$ m/s, $\\vartheta_{0y} = 30$ m/s. $h_{\\max} = \\tfrac{30^2}{20} = 45$ m. Uçuş süresi $2 \\times 3 = 6$ s, menzil $40 \\times 6 = 240$ m.' },
      { metin: 'Yerden eğik olarak fırlatılan bir cismin hızının yatay bileşeni $\\vartheta_x$ ile düşey bileşeni $\\vartheta_y$’nin zamana bağlı grafiği şekildeki gibidir. Yukarı yön pozitif seçilmiştir.', sekil: gBilesen(68), yan: true, kok: 'Cismin hızının büyüklüğü, atıldıktan kaç s sonra <b>ilk kez</b> 50 m/s olur ve cisim o anda atıldığı noktadan yatayda kaç m uzaktadır?', siklar: ['2 ve 80', '2 ve 100', '3 ve 120', '5 ve 200', '8 ve 320'], k: 3, cevap: 'A', cozum: '$\\vartheta_x = 40$ m/s sabittir. Hızın büyüklüğünün 50 m/s olması için düşey bileşen 30 m/s olmalıdır, bu ilk kez $t = 2$ s anında gerçekleşir. Yatay uzaklık $40 \\times 2 = 80$ m.' },
      { metin: 'Bir top yerden 25 m/s hızla, yatayla 37° açı yapacak biçimde fırlatılıyor ve atıldığı noktadan yatayda 40 m uzaktaki binanın düz çatısına, şekildeki gibi çatının kenarına düşüyor. ($\\sin 37^\\circ = 0{,}6$; $\\cos 37^\\circ = 0{,}8$)', sekil: fCati(96), kok: 'Binanın yüksekliği kaç m’dir?', siklar: ['5', '10', '15', '20', '30'], cevap: 'B', cozum: '$\\vartheta_{0x} = 20$ m/s, $\\vartheta_{0y} = 15$ m/s. Top 40 m’lik yatay yolu $\\tfrac{40}{20} = 2$ s’de alır. Bu andaki yüksekliği $15 \\times 2 - 5 \\times 2^2 = 10$ m.' },
      { metin: 'Yerden 45 m yükseklikteki K cismi serbest bırakıldığı anda, aynı yükseklikte ve K’den yatayda 40 m uzakta bulunan L cismi, K’ye doğru 20 m/s hızla yatay doğrultuda fırlatılıyor.', kok: 'Cisimler yerden kaç m yükseklikte çarpışır?', siklar: ['5', '15', '20', '25', 'Çarpışmazlar.'], k: 5, cevap: 'D', cozum: 'İkisi de düşeyde serbest düşme yaptığından her an aynı yüksekliktedir. L yataydaki 40 m’yi $\\tfrac{40}{20} = 2$ s’de alır. Bu sürede ikisi de $5 \\times 2^2 = 20$ m düşer, yerden $45 - 20 = 25$ m yüksekte çarpışırlar.' },
    ],
  },
  {
    kontrol: ["Üç yasayı günlük hayattan birer örnekle açıklayabiliyorum.", "Net kuvvetten ivmeyi, ivmeden net kuvveti bulabiliyorum.", "İple bağlı cisimlerde önce sistemin ivmesini, sonra ip gerilmesini bulabiliyorum."],
    no: 3, baslik: 'Newton’ın hareket yasaları', kisa: 'Newton’ın hareket yasaları', alt: 'Hareketin sürmesi için kuvvet gerekmez. Kuvvet, hareketi <b>değiştirir</b>.',
    plan: 'Eylemsizlik, F = m a, etki–tepki ve iple bağlı sistemler.',
    govde:
      uclu([
        { sekil: fYasa1(), baslik: '1. yasa: Eylemsizlik', metin: 'Net kuvvet sıfırsa duran cisim durur, hareketli cisim <b>sabit hızla</b> yoluna devam eder.' },
        { sekil: fYasa2(), baslik: '2. yasa: $F_{\\text{net}} = m\\,a$', metin: 'Net kuvvet varsa cisim, net kuvvet yönünde ivmelenir. İvme kütleyle ters orantılıdır.' },
        { sekil: fYasa3(), baslik: '3. yasa: Etki–tepki', metin: 'Kuvvetler çift doğar: eşit büyüklükte, zıt yönde ve <b>farklı cisimler</b> üzerinde.' },
      ]) +
      ikili(
        bolum('İple bağlı cisimler: sistem düşün', `<p><b>1. adım:</b> Bütün sistemi tek cisim gibi al, ivmeyi bul. <b>2. adım:</b> İp gerilmesi için cisimlerden <b>birini</b> tek başına incele.</p>`) +
        `<p>Şekilde $a = \\dfrac{F}{m_1 + m_2} = \\dfrac{20}{5} = 4\\ \\text{m/s}^2$. 2 kg’lık cismi yalnız ip çeker: $T = 2 \\times 4 = 8$ N.</p>`,
        sekil(fSistem(92), 'İp, arkadaki cismi çeken tek yatay kuvvettir.'), 's') +
      kutu('ana', 'Birim ve yön', `1 N, 1 kg’lık cisme $1\\ \\text{m/s}^2$ ivme veren kuvvettir. İvmenin yönü <b>net kuvvetin</b> yönüdür, hızın yönü olmak zorunda değildir: fren yapan arabada hız ileri, ivme geriye doğrudur.`) +
      hata('Sabit hızla giden cisme hareket yönünde net bir kuvvet etki eder.', 'Hız sabitse net kuvvet sıfırdır. Kuvvet, hızı değiştirmek için gerekir.') +
      hata('Etki ve tepki eşit ve zıt olduğundan birbirini götürür.', 'Etki ve tepki farklı cisimlere uygulanır, aynı cisim üzerinde toplanamaz.'),
    sorular: [
      { metin: 'Aşağıda üç durum verilmiştir.', onc: ['Doğrusal bir yolda 90 km/h sabit hızla ilerleyen otomobil.', 'Masanın üzerinde durmakta olan kitap.', 'Düşey yukarı atılan topun tepe noktasında bulunduğu an.'], kok: 'Bu durumların hangilerinde cisme etki eden net kuvvet sıfırdır?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'I ve II’de hız değişmediğinden net kuvvet sıfırdır. III’te topun hızı anlık olarak sıfırdır ama ağırlık etki etmeye devam eder, net kuvvet sıfır değildir.' },
      { metin: 'Bir kitap, yatay masanın üzerinde durmaktadır.', onc: ['Kitabın ağırlığı ile masanın kitaba uyguladığı tepki kuvveti etki–tepki çiftidir.', 'Kitabın masaya uyguladığı kuvvet ile masanın kitaba uyguladığı kuvvet etki–tepki çiftidir.', 'Yer’in kitaba uyguladığı çekim kuvvetinin tepkisi, kitabın Yer’e uyguladığı çekim kuvvetidir.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 5, cevap: 'D', cozum: 'I: İki kuvvet de kitaba etki eder. Etki–tepki çifti aynı cisim üzerinde olamaz, bunlar dengelenmiş kuvvetlerdir, yanlış. II ve III: Kuvvetler iki farklı cisme karşılıklı uygulanır, doğru.' },
      { metin: 'Sürtünmesiz yatay yüzeyde iple bağlı 4 kg ve 6 kg kütleli cisimlerden 6 kg’lık olan, şekildeki gibi 30 N büyüklüğündeki yatay kuvvetle çekiliyor.', sekil: fSistem(84, { m1: '4 kg', m2: '6 kg', F: 'F = 30 N' }), kok: 'İpteki gerilme kuvveti kaç N’dir?', siklar: ['6', '12', '15', '18', '30'], cevap: 'B', cozum: '$a = \\tfrac{30}{4 + 6} = 3\\ \\text{m/s}^2$. 4 kg’lık cismi yalnız ip çeker: $T = 4 \\times 3 = 12$ N.' },
      { metin: 'Sürtünmesiz yatay düzlemde durmakta olan 2 kg kütleli diske, kuş bakışı görünümü verilen şekildeki $F_1$, $F_2$ ve $F_3$ kuvvetleri aynı anda uygulanıyor. Kuvvetler kareli zemine ölçekli çizilmiştir ve bir karenin kenarı 2 N’ye karşılık gelmektedir.', sekil: fKuvvetGrid(50), yan: true, kok: 'Diskin ivmesinin büyüklüğü kaç $\\text{m/s}^2$’dir?', siklar: ['5', '7', '9', '10', '11'], cevap: 'A', cozum: 'Yatayda $5 - 2 = 3$ kare, düşeyde 4 kare: net kuvvet $\\sqrt{3^2 + 4^2} = 5$ kare, yani $5 \\times 2 = 10$ N. $a = \\tfrac{10}{2} = 5\\ \\text{m/s}^2$.' },
      { metin: 'Kütlesi 6000 kg olan bir kamyon ile kütlesi 1000 kg olan bir otomobil kafa kafaya çarpışıyor. Çarpışma sırasında kamyonun otomobile uyguladığı kuvvetin büyüklüğü $F$, otomobilin ivmesinin büyüklüğü $a$’dır.', kok: 'Çarpışma sırasında otomobilin kamyona uyguladığı kuvvetin ve kamyonun ivmesinin büyüklüğü nedir? (Yalnız bu iki kuvvet dikkate alınacaktır.)', siklar: ['$F$ ve $a$', '$F$ ve $\\dfrac{a}{6}$', '$\\dfrac{F}{6}$ ve $a$', '$\\dfrac{F}{6}$ ve $\\dfrac{a}{6}$', '$6F$ ve $\\dfrac{a}{6}$'], k: 5, cevap: 'B', cozum: 'Etki–tepki gereği kuvvetler eşittir: $F$. İvme kütleyle ters orantılıdır. Kamyonun kütlesi 6 kat olduğundan ivmesi $\\tfrac{a}{6}$ olur.' },
      { metin: 'Sürtünmesiz yatay yüzeyde durmakta olan 5 kg kütleli cisme aynı anda, zıt yönlü 30 N ve 10 N büyüklüğünde iki yatay kuvvet uygulanıyor.', kok: 'Cisim ilk 4 saniyede kaç m yer değiştirir?', siklar: ['8', '16', '20', '24', '32'], cevap: 'E', cozum: '$F_{\\text{net}} = 30 - 10 = 20$ N, $a = \\tfrac{20}{5} = 4\\ \\text{m/s}^2$. $x = \\tfrac{1}{2} \\times 4 \\times 4^2 = 32$ m.' },
      { metin: 'Sürtünmesiz yatay yüzeyde durmakta olan 2 kg kütleli cisme etki eden net kuvvetin zamana bağlı grafiği şekildeki gibidir.', sekil: gFt(58), yan: true, kok: 'Cismin $t = 6$ s anındaki hızının büyüklüğü kaç m/s’dir?', siklar: ['0', '2', '4', '8', '12'], cevap: 'C', cozum: '0–2 s: $a = \\tfrac{8}{2} = 4\\ \\text{m/s}^2$, hız 8 m/s olur. 2–4 s: Net kuvvet sıfırdır, hız 8 m/s kalır. 4–6 s: $a = -2\\ \\text{m/s}^2$, hız $8 - 2 \\times 2 = 4$ m/s.' },
      { metin: 'Doğrusal bir yolda hareket eden 4 kg kütleli cismin hız–zaman grafiği şekildeki gibidir.', sekil: gHiz10(60), yan: true, onc: ['0–2 s aralığında cisme etki eden net kuvvet 24 N’dir.', '2–5 s aralığında cisme hiçbir kuvvet etki etmemektedir.', '5–8 s aralığında net kuvvet 16 N’dir ve hareket yönüne zıttır.'], kok: 'Yargılardan hangileri <u>kesinlikle</u> doğrudur?', siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'I ve III', 'I, II ve III'], k: 3, cevap: 'D', cozum: 'I: $a = 6\\ \\text{m/s}^2$, $F = 4 \\times 6 = 24$ N, doğru. II: Net kuvvet sıfırdır ama dengelenmiş kuvvetler olabilir, kesin değil. III: $a = -4\\ \\text{m/s}^2$, $F = 16$ N ve harekete zıt, doğru.' },
      { metin: 'Sürtünmesiz yatay yüzeyde doğuya doğru 10 m/s hızla gitmekte olan 2 kg kütleli cisme, $t = 0$ anından itibaren batıya doğru 4 N büyüklüğünde sabit bir kuvvet uygulanıyor.', kok: 'Cisim hangi anda anlık olarak durur ve $t = 8$ s anındaki hızı nedir?', siklar: ['$t = 5$ s; batıya doğru 6 m/s', '$t = 5$ s; doğuya doğru 6 m/s', '$t = 5$ s; sıfır', '$t = 5$ s; batıya doğru 16 m/s', '$t = 8$ s; sıfır'], k: 3, cevap: 'A', cozum: '$a = \\tfrac{4}{2} = 2\\ \\text{m/s}^2$ ve batıya doğrudur. Cisim $\\tfrac{10}{2} = 5$ s’de durur. Kuvvet sürdüğünden sonraki 3 s’de batıya doğru hızlanır: $2 \\times 3 = 6$ m/s.' },
      { metin: 'Sürtünmesiz yatay yüzeydeki 3 kg ve 5 kg kütleli cisimler birbirine iple bağlıdır. İp en fazla 12 N büyüklüğündeki gerilme kuvvetine dayanabilmektedir. Sistem, 5 kg kütleli cisme uygulanan yatay $F$ kuvvetiyle, ip gergin olacak biçimde çekiliyor.', kok: 'İpin kopmaması için $F$ en fazla kaç N olabilir?', siklar: ['12', '20', '24', '30', '32'], cevap: 'E', cozum: 'İp yalnız 3 kg’lık cismi çeker: $12 = 3\\,a$, ivme en fazla $4\\ \\text{m/s}^2$ olabilir. Sistemin tamamı için $F = (3 + 5) \\times 4 = 32$ N.' },
    ],
  },
  {
    kontrol: ["Bir cismin üzerindeki bütün kuvvetleri doğru yönde çizebiliyorum.", "Açılı kuvveti bileşenlerine ayırıp tepki kuvvetini bulabiliyorum.", "Eğik düzlemde ağırlığı bileşenlerine ayırıp ivmeyi hesaplayabiliyorum."],
    no: 4, baslik: 'Serbest cisim diyagramı', kisa: 'Serbest cisim diyagramı', alt: 'Cismi tek başına çiz, üzerindeki bütün kuvvetleri göster. Sorunun yarısı burada biter.',
    plan: 'Ağırlık, tepki kuvveti, ip gerilmesi, açılı kuvvet ve eğik düzlem.',
    govde:
      kutu('koyu', '4 adımda serbest cisim diyagramı', `<b>1.</b> Cismi bir nokta olarak çiz. &nbsp; <b>2.</b> Ağırlığı çiz: $G = m\\,g$, her zaman düşey aşağı. &nbsp; <b>3.</b> Değdiği her şey için bir kuvvet çiz: yüzey varsa yüzeyin tepki kuvveti $N$ (yüzeye <b>dik</b>), ip varsa $T$ (ip boyunca). &nbsp; <b>4.</b> Eksen seç, eğik kuvvetleri bileşenlerine ayır ve her eksende $F_{\\text{net}} = m\\,a$ yaz.`) +
      ikili(
        sekil(fAcili(98, { m: 8, F: 50, aci: 37 }), 'Solda düzenek, sağda ölçekli serbest cisim diyagramı.'),
        bolum('Açılı çekilen kutu', `<p><b>Düşeyde</b> ivme yok: $N + 30 = 80$, yani $N = 50$ N. Tepki kuvveti ağırlıktan <b>küçük</b> çıktı, çünkü kuvvetin düşey bileşeni yükün bir kısmını taşıyor.</p><p><b>Yatayda:</b> $40 = 8\\,a$, yani $a = 5\\ \\text{m/s}^2$.</p>`) +
        kutu('sari', 'Dikkat', `$N = m\\,g$ bir kural değildir. $N$’yi her soruda düşey kuvvetlerin dengesinden bul.`), 's') +
      ikili(
        bolum('Sürtünmesiz eğik düzlem', `<p>Eksenleri <b>eğime paralel</b> ve <b>eğime dik</b> seç. Ağırlığı bu iki eksene ayır:</p>`) +
        formul('G_{\\parallel} = m\\,g\\,\\sin\\alpha \\qquad G_{\\perp} = m\\,g\\,\\cos\\alpha') +
        `<p>Eğime dik yönde ivme yok: $N = m\\,g\\cos\\alpha$. Eğim boyunca: $m\\,g\\sin\\alpha = m\\,a$, yani <b>$a = g\\sin\\alpha$</b>. Kütle sadeleşti: ivme kütleye bağlı değil.</p>`,
        sekil(fEgikD(74, { aci: 37, m: 5, kuvvet: 'tam' }), '5 kg, 37°: $N = 40$ N, $a = 6\\ \\text{m/s}^2$.'), 's') +
      hata('Eğik düzlemde tepki kuvveti düşey yukarı yönlüdür.', 'Tepki kuvveti her zaman yüzeye diktir. Eğik düzlemde düşeyle açı yapar.'),
    sorular: [
      { metin: 'Sürtünmesiz eğik düzlemin alt ucundan eğim yukarı doğru fırlatılan bir cisim, eğik düzlem üzerinde yukarı doğru kaymaktadır.', onc: ['Düşey aşağı yönlü ağırlık.', 'Eğik düzleme dik tepki kuvveti.', 'Eğim yukarı yönlü itme kuvveti.'], kok: 'Cisim yukarı doğru kayarken serbest cisim diyagramında bu kuvvetlerden hangileri bulunur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'Cisme yalnız Yer (ağırlık) ve değdiği yüzey (tepki kuvveti) kuvvet uygular. Fırlatan el artık cisme değmediğinden itme kuvveti yoktur. Cisim eylemsizliği nedeniyle yukarı kayar ve yavaşlar.' },
      { metin: 'Kütlesi 2 kg olan su dolu kova, bir iple kuyudan düşey yukarı çekiliyor. Kova önce $3\\ \\text{m/s}^2$ büyüklüğündeki ivmeyle hızlanıyor, sonra sabit hızla yükseliyor.', kok: 'İpteki gerilme kuvveti, kova hızlanırken ve sabit hızla yükselirken sırasıyla kaç N’dir?', siklar: ['6 ve 0', '6 ve 20', '26 ve 0', '26 ve 20', '26 ve 26'], k: 5, cevap: 'D', cozum: 'Hızlanırken $T - 20 = 2 \\times 3$, $T = 26$ N. Sabit hızda net kuvvet sıfırdır: $T = 20$ N.' },
      { metin: 'Sürtünmesiz yatay yüzeyde duran 6 kg kütleli kutu, yatayla 53° açı yapan 50 N büyüklüğündeki kuvvetle şekildeki gibi çekiliyor. <span style="white-space:nowrap">($\\sin 53^\\circ = 0{,}8$; $\\cos 53^\\circ = 0{,}6$)</span>', sekil: fAcili(58, { m: 6, F: 50, aci: 53, kuvvet: false }), yan: true, kok: 'Yüzeyin kutuya uyguladığı tepki kuvveti kaç N, kutunun ivmesi kaç $\\text{m/s}^2$’dir?', siklar: ['20 ve 5', '20 ve 8', '30 ve 5', '60 ve 5', '60 ve 8'], k: 3, cevap: 'A', cozum: '$F_y = 50 \\times 0{,}8 = 40$ N, $N = 60 - 40 = 20$ N. $F_x = 50 \\times 0{,}6 = 30$ N, $a = \\tfrac{30}{6} = 5\\ \\text{m/s}^2$.' },
      { metin: 'Sürtünmesiz yatay yüzeydeki $m$ kütleli kutu, Şekil I’de yatayla 37° açı yapan $F$ büyüklüğündeki kuvvetle çekiliyor. Şekil II’de ise aynı büyüklükteki kuvvetle, yatayla 37° açı yapacak biçimde yukarıdan itiliyor. İki durumda da kutu yüzeyden ayrılmıyor. ($\\sin 37^\\circ = 0{,}6$; $\\cos 37^\\circ = 0{,}8$)', sekil: fItCek(124), kok: 'Yüzeyin kutuya uyguladığı tepki kuvvetleri $N_1$, $N_2$ ve kutunun ivmeleri $a_1$, $a_2$ arasındaki ilişki nedir?', siklar: ['$N_1 = N_2$ ve $a_1 = a_2$', '$N_1 < N_2$ ve $a_1 = a_2$', '$N_1 > N_2$ ve $a_1 = a_2$', '$N_1 < N_2$ ve $a_1 < a_2$', '$N_1 < N_2$ ve $a_1 > a_2$'], k: 3, cevap: 'B', cozum: 'Kuvvetin düşey bileşeni I’de yukarı, II’de aşağı yönlüdür: $N_1 = m\\,g - 0{,}6F$, $N_2 = m\\,g + 0{,}6F$, yani $N_1 < N_2$. Yatay bileşen ikisinde de $0{,}8F$ olduğundan ivmeler eşittir.' },
      { metin: 'Eğim açısı 37° olan sürtünmesiz eğik düzlemin tepesinden serbest bırakılan bir cisim, eğik düzlem boyunca 12 m yol alarak tabana ulaşıyor. ($\\sin 37^\\circ = 0{,}6$; $\\cos 37^\\circ = 0{,}8$)', kok: 'Cismin tabana ulaştığı andaki hızı kaç m/s’dir?', siklar: ['4', '6', '8', '10', '12'], cevap: 'E', cozum: '$a = g \\sin 37^\\circ = 6\\ \\text{m/s}^2$. $\\vartheta^2 = 2\\,a\\,x = 2 \\times 6 \\times 12 = 144$, $\\vartheta = 12$ m/s.' },
      { metin: 'Sürtünmesiz masadaki 3 kg kütleli cisim, makaradan geçen iple 2 kg kütleli cisme şekildeki gibi bağlanıp serbest bırakılıyor. Makaranın kütlesi ve sürtünmeler önemsizdir.', sekil: fMakara(62), yan: true, kok: 'İpteki gerilme kuvveti kaç N’dir?', siklar: ['8', '12', '16', '20', '30'], cevap: 'B', cozum: 'Sistemi yalnız asılı cismin ağırlığı hızlandırır: $a = \\tfrac{20}{3 + 2} = 4\\ \\text{m/s}^2$. Masadaki cismi yalnız ip çeker: $T = 3 \\times 4 = 12$ N.' },
      { metin: 'Kütlesi 60 kg olan bir kişi, asansörün içindeki baskülün üzerinde durmaktadır. Asansör hareket ederken baskül 720 N değerini göstermektedir.', sekil: fAsansor(34), yan: true, onc: ['Asansör yukarı doğru çıkarken $2\\ \\text{m/s}^2$ büyüklüğündeki ivmeyle hızlanmaktadır.', 'Asansör aşağı doğru inerken $2\\ \\text{m/s}^2$ büyüklüğündeki ivmeyle yavaşlamaktadır.', 'Asansör yukarı doğru sabit hızla çıkmaktadır.'], kok: 'Asansörün hareketi için hangileri doğru <u>olabilir</u>?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 3, cevap: 'C', cozum: '$N - m\\,g = m\\,a$: $720 - 600 = 60\\,a$, $a = 2\\ \\text{m/s}^2$ ve yukarı yönlü. İvme yukarıysa asansör ya yukarı çıkarken hızlanıyor ya da aşağı inerken yavaşlıyordur. Sabit hızda baskül 600 N gösterirdi.' },
      { metin: 'Kütleleri 1 kg ve 4 kg olan cisimler, tavana asılı makaradan geçen iple şekildeki gibi bağlanıp serbest bırakılıyor. Makaranın ve ipin kütlesi ile sürtünmeler önemsizdir.', sekil: fAtwood(40), yan: true, kok: 'Cisimlerin serbest bırakıldıktan 1 s sonraki sürati ve ipteki gerilme kuvveti sırasıyla kaç m/s ve kaç N’dir?', siklar: ['3 ve 16', '6 ve 10', '6 ve 12', '6 ve 16', '6 ve 40'], k: 3, cevap: 'D', cozum: '$a = \\tfrac{40 - 10}{1 + 4} = 6\\ \\text{m/s}^2$, 1 s sonra sürat 6 m/s olur. 1 kg’lık cisim için $T - 10 = 1 \\times 6$, $T = 16$ N.' },
      { metin: 'Eğim açısı 37° olan sürtünmesiz eğik düzlemdeki 4 kg kütleli cisim, eğime paralel ve yukarı yönlü 40 N büyüklüğündeki kuvvetle şekildeki gibi çekiliyor. ($\\sin 37^\\circ = 0{,}6$; $\\cos 37^\\circ = 0{,}8$)', sekil: fEgikD(62, { aci: 37, m: 4, kuvvet: 'F' }), yan: true, kok: 'Cismin ivmesinin büyüklüğü ve yönü nedir?', siklar: ['$4\\ \\text{m/s}^2$, eğim yukarı', '$4\\ \\text{m/s}^2$, eğim aşağı', '$6\\ \\text{m/s}^2$, eğim aşağı', '$10\\ \\text{m/s}^2$, eğim yukarı', '$2\\ \\text{m/s}^2$, eğim yukarı'], k: 2, cevap: 'A', cozum: 'Ağırlığın eğime paralel bileşeni $40 \\times 0{,}6 = 24$ N, eğim aşağı. $F_{\\text{net}} = 40 - 24 = 16$ N, eğim yukarı. $a = \\tfrac{16}{4} = 4\\ \\text{m/s}^2$.' },
      { metin: 'Eğim açısı 37° olan sürtünmesiz eğik düzlemdeki 6 kg kütleli cisim, makaradan geçen iple 6 kg kütleli asılı cisme şekildeki gibi bağlanıp serbest bırakılıyor. Makaranın kütlesi ve sürtünmeler önemsizdir. ($\\sin 37^\\circ = 0{,}6$; $\\cos 37^\\circ = 0{,}8$)', sekil: fEgikMakara(64), yan: true, kok: 'İpteki gerilme kuvveti kaç N’dir?', siklar: ['12', '24', '36', '48', '60'], cevap: 'D', cozum: 'Asılı cismin ağırlığı 60 N, eğik düzlemdeki cismin ağırlığının eğime paralel bileşeni $60 \\times 0{,}6 = 36$ N’dir. $a = \\tfrac{60 - 36}{6 + 6} = 2\\ \\text{m/s}^2$. Asılı cisim için $60 - T = 6 \\times 2$, $T = 48$ N.' },
    ],
  },
];

// ---------- Deneme ----------
const deneme = [
  { konu: 'k1', metin: 'Hava direncinin önemsiz olduğu ortamda serbest bırakılan bir cisim, yere çarpmadan önceki <b>son 2 saniyede</b> 80 m yol alıyor.', kok: 'Cisim yerden kaç m yükseklikten bırakılmıştır?', siklar: ['125', '145', '160', '180', '245'], cevap: 'A', cozum: 'Düşme süresi $t$ olsun. Son 2 s’de alınan yol $5t^2 - 5(t - 2)^2 = 20t - 20 = 80$, buradan $t = 5$ s. Yükseklik $5 \\times 25 = 125$ m.' },
  { konu: 'k1', metin: 'Bir cisim yerden 30 m/s hızla düşey yukarı atılıyor.', kok: 'Cismin hızı, atıldıktan kaç s sonra <b>aşağı yönlü</b> 10 m/s olur ve cisim o anda yerden kaç m yüksektedir?', siklar: ['2 s ve 40 m', '4 s ve 40 m', '4 s ve 45 m', '2 s ve 45 m', '4 s ve 80 m'], k: 5, cevap: 'B', cozum: '$-10 = 30 - 10t$, $t = 4$ s. $y = 30 \\times 4 - 5 \\times 16 = 40$ m. $t = 2$ s anında da 40 m yüksekliktedir ama hızı yukarı yönlüdür.' },
  { konu: 'k1', metin: 'Serbest bırakılan bir cismin hız–zaman grafiği şekildeki gibidir.', sekil: gD3(58), yan: true, kok: 'Cisim $t = 2$ s ile $t = 4$ s arasında kaç m yol almıştır?', siklar: ['40', '50', '60', '80', '100'], cevap: 'C', cozum: 'Yol, grafiğin altındaki alandır. 2–4 s arasındaki yamuk: $\\tfrac{(20 + 40) \\times 2}{2} = 60$ m.' },
  { konu: 'k1', metin: 'K cismi 60 m yükseklikten serbest bırakıldığı anda, tam altındaki L cismi yerden 30 m/s hızla düşey yukarı atılıyor.', kok: 'Cisimler yerden kaç m yükseklikte karşılaşır?', siklar: ['20', '25', '30', '40', '45'], cevap: 'D', cozum: 'İkisinin ivmesi aynı olduğundan aralarındaki 60 m, 30 m/s hızla kapanır: $t = 2$ s. L’nin yüksekliği $30 \\times 2 - 5 \\times 4 = 40$ m.' },
  { konu: 'k2', metin: 'Bir cisim 20 m yükseklikten yatay doğrultuda fırlatılıyor. Cisim yere çarptığı anda hızı yatayla 45° açı yapıyor.', kok: 'Cismin yere çarptığı nokta, fırlatıldığı noktanın yatayda kaç m ilerisindedir?', siklar: ['10', '20', '30', '40', '80'], cevap: 'D', cozum: '$20 = 5t^2$, $t = 2$ s, $\\vartheta_y = 20$ m/s. Açı 45° olduğundan $\\vartheta_x = \\vartheta_y = 20$ m/s. $x = 20 \\times 2 = 40$ m.' },
  { konu: 'k2', metin: 'Yerden eğik olarak fırlatılan bir cismin ilk hızının yatay bileşeni 15 m/s, düşey bileşeni 20 m/s’dir.', onc: ['Cismin tepe noktasındaki hızı 15 m/s’dir.', 'Cismin çıkabildiği en büyük yükseklik 20 m’dir.', 'Cismin menzili 100 m’dir.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'I: Tepede yalnız yatay bileşen kalır, doğru. II: $\\tfrac{20^2}{20} = 20$ m, doğru. III: Uçuş süresi 4 s, menzil $15 \\times 4 = 60$ m, yanlış.' },
  { konu: 'k2', metin: 'Hava direncinin önemsiz olduğu ortamda eğik olarak fırlatılan bir cismin uçuşu boyunca;', onc: ['hızının yatay bileşeni,', 'ivmesi,', 'hızının büyüklüğü'], kok: 'niceliklerinden hangileri <u>değişmez</u>?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'Yatayda kuvvet olmadığından yatay hız sabittir. İvme her an $g$’dir. Düşey bileşen değiştiği için hızın büyüklüğü değişir.' },
  { konu: 'k2', metin: 'Yatay doğrultuda fırlatılan bir topun <b>eşit zaman aralıklarıyla</b> çekilmiş fotoğrafları kareli zemine şekildeki gibi yerleştirilmiştir. 1 numaralı konum fırlatma anıdır ve bir karenin kenarı 5 m’ye karşılık gelmektedir.', sekil: fStrobo(52), yan: true, kok: 'Topun ilk hızı kaç m/s’dir?', siklar: ['5', '10', '15', '20', '25'], cevap: 'B', cozum: 'İlk aralıkta düşeyde 1 kare, yani 5 m düşmüş: $5 = 5t^2$, aralık 1 s. Aynı sürede yatayda 2 kare, yani 10 m gitmiş: $\\vartheta_0 = 10$ m/s.' },
  { konu: 'k3', metin: 'Sürtünmesiz yatay yüzeyde birbirine değen 1 kg, 2 kg ve 3 kg kütleli bloklar, 24 N büyüklüğündeki yatay kuvvetle şekildeki gibi itiliyor.', sekil: fUcBlok(84), kok: '2 kg kütleli bloğun 3 kg kütleli bloğa uyguladığı kuvvet kaç N’dir?', siklar: ['12', '16', '18', '20', '24'], cevap: 'A', cozum: '$a = \\tfrac{24}{6} = 4\\ \\text{m/s}^2$. 3 kg’lık bloğu ileri iten tek kuvvet 2 kg’lık bloğun uyguladığı kuvvettir: $3 \\times 4 = 12$ N.' },
  { konu: 'k3', metin: 'Günlük hayattan üç olay ve açıklandıkları yasalar eşleştirilmiştir.', onc: ['Ani fren yapan otobüste ayaktaki yolcunun öne doğru gitmesi: eylemsizlik.', 'Kürek çeken sporcunun suyu geriye itmesiyle teknenin ileri gitmesi: etki–tepki.', 'Aynı kuvvetle itilen dolu alışveriş arabasının boş arabadan daha yavaş hızlanması: $F_{\\text{net}} = m\\,a$.'], kok: 'Eşleştirmelerden hangileri doğrudur?', siklar: ['Yalnız I', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III'], k: 5, cevap: 'E', cozum: 'Üçü de doğrudur. Yolcu hızını korumak ister (1. yasa), su tekneyi ileri iter (3. yasa), kütle büyüdükçe aynı kuvvetle ivme küçülür (2. yasa).' },
  { konu: 'k3', metin: 'Sürtünmesiz yatay yüzeydeki K ve L cisimlerine uygulanan net kuvvetin, cisimlerin ivmesine bağlı grafiği şekildeki gibidir.', sekil: gFa(56), yan: true, kok: 'K ve L birbirine yapıştırılıp 16 N büyüklüğünde net kuvvet uygulanırsa ivme kaç $\\text{m/s}^2$ olur?', siklar: ['1', '2', '3', '4', '8'], cevap: 'B', cozum: 'Grafiğin eğimi kütledir: $m_K = \\tfrac{12}{2} = 6$ kg, $m_L = \\tfrac{12}{6} = 2$ kg. $a = \\tfrac{16}{6 + 2} = 2\\ \\text{m/s}^2$.' },
  { konu: 'k3', metin: 'Düz yolda 72 km/h hızla giden 1000 kg kütleli otomobil, sürücünün frene basmasıyla düzgün yavaşlayarak 5 s’de duruyor.', kok: 'Otomobile etki eden net kuvvetin büyüklüğü kaç N, otomobilin durana kadar aldığı yol kaç m’dir?', siklar: ['2000 ve 50', '4000 ve 50', '4000 ve 100', '14 400 ve 50', '14 400 ve 180'], k: 5, cevap: 'B', cozum: '$72\\ \\text{km/h} = 20$ m/s. $a = \\tfrac{20}{5} = 4\\ \\text{m/s}^2$, $F = 1000 \\times 4 = 4000$ N. Yol: $\\tfrac{20 + 0}{2} \\times 5 = 50$ m.' },
  { konu: 'k4', metin: 'Kütleleri 2 kg ve 3 kg olan iki cisim, iplerle şekildeki gibi tavana asılmış ve dengededir.', sekil: fAsili(30), yan: true, kok: 'İplerdeki gerilme kuvvetleri $T_1$ ve $T_2$ kaç N’dir?', siklar: ['20 ve 30', '30 ve 20', '50 ve 20', '50 ve 30', '50 ve 50'], k: 3, cevap: 'D', cozum: 'Alt ip yalnız 3 kg’lık cismi taşır: $T_2 = 30$ N. Üst ip iki cismi birden taşır: $T_1 = 20 + 30 = 50$ N.' },
  { konu: 'k4', metin: 'Eğim açısı 53° olan sürtünmesiz eğik düzleme 2 kg kütleli bir cisim bırakılıyor. ($\\sin 53^\\circ = 0{,}8$; $\\cos 53^\\circ = 0{,}6$)', sekil: fEgikD(44, { aci: 53, m: 2, kuvvet: 'yok' }), yan: true, kok: 'Cismin ivmesi kaç $\\text{m/s}^2$, eğik düzlemin cisme uyguladığı tepki kuvveti kaç N’dir?', siklar: ['6 ve 16', '8 ve 12', '8 ve 16', '8 ve 20', '10 ve 12'], k: 3, cevap: 'B', cozum: '$a = g \\sin 53^\\circ = 10 \\times 0{,}8 = 8\\ \\text{m/s}^2$. $N = m\\,g \\cos 53^\\circ = 20 \\times 0{,}6 = 12$ N.' },
  { konu: 'k4', metin: 'Yüküyle birlikte kütlesi 500 kg olan ve durmakta olan bir asansör, halatındaki gerilme kuvveti 6000 N olacak biçimde yukarı çekilmeye başlıyor.', kok: 'Asansörün 3 s sonraki hızı kaç m/s’dir?', siklar: ['2', '3', '4', '5', '6'], cevap: 'E', cozum: '$T - m\\,g = m\\,a$: $6000 - 5000 = 500\\,a$, $a = 2\\ \\text{m/s}^2$. $\\vartheta = 2 \\times 3 = 6$ m/s.' },
];

module.exports = {
  sinif: 11,
  kapakSekil: kapak,
  gunler, deneme,
  denemeKapsam: 'serbest düşme, iki boyutta hareket, Newton’ın hareket yasaları, serbest cisim diyagramı',
  konular: [
    { id: 'k1', ad: 'Serbest düşme', paket: 1 },
    { id: 'k2', ad: 'İki boyutta sabit ivmeli hareket', paket: 1 },
    { id: 'k3', ad: 'Newton’ın hareket yasaları', paket: null },
    { id: 'k4', ad: 'Serbest cisim diyagramı', paket: null },
  ],
  paketler: [{ no: 1, not: 'Gün 1 ve Gün 2’nin konusu.' }, { no: 2, not: 'Aralık ayında işlenecek konu, öne geçmek isteyene.' }],
  planNot: 'Bu kitapçıkta sürtünme yok. Sürtünme kuvveti tatilden sonraki ilk konu, o yüzden bütün yüzeyler sürtünmesiz alındı.',
};
