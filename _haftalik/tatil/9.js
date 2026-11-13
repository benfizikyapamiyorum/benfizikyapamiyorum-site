// 9. sınıf | Ara Tatil Fizik Kampı | Kapsam: fizik bilimi ve alt dalları, temel ve türetilmiş nicelikler, skaler ve vektörel nicelikler, vektörlerde toplama ve bileşenler
// Trigonometri yok. Vektörler yalnız kareli düzlemde, dik vektörler tam sayılı dik üçgenlerle (3-4-5, 6-8-10).
const { bolum, kutu, formul, sekil, ikili, uclu, hata, tablo, p } = require('./lib');
const R = require('./real');
const { C, S, T, OK, ROZET } = R;
let UID = 0;
const uid = s => 'd9' + s + (++UID);
const alt = (a, b) => `${a}<tspan dy="4" font-size="68%">${b}</tspan><tspan dy="-4" font-size="1"> </tspan>`;

// ---------- Yardımcı çizimler ----------
// Vektör etiketi: eğik harf ve üzerinde küçük ok. pre: harfin önündeki katsayı ("2", "−"), sub: alt indis.
function VL(x, y, s, c = C.koyu, o = {}) {
  const size = o.size || 16, pre = o.pre || '';
  const lw = size * 0.6 * s.length, pw = pre ? pre.length * size * 0.52 + 1 : 0, sw = o.sub ? size * 0.4 : 0;
  const x0 = x - (lw + pw + sw) / 2, lx = x0 + pw, yy = y - size * 0.9;
  return (pre ? T(lx - 1, y, pre, { c, size, a: 'end' }) : '') + T(lx, y, o.sub ? alt(s, o.sub) : s, { c, size, a: 'start', it: true }) +
    `<path d="M ${lx} ${yy} H ${lx + lw}" stroke="#fff" stroke-width="4.6" stroke-linecap="round"/><path d="M ${lx} ${yy} H ${lx + lw} m -3.4 -2.5 l 3.4 2.5 l -3.4 2.5" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// Kareli düzlemde vektör: (x, y) başlangıç, (dx, dy) bileşenler (kare). lab: etiket, yan: -1 | 1 (okun hangi yanında), duz: düz yazı.
function vek(kz, x, y, dx, dy, c, lab, o = {}) {
  const x1 = kz.X(x), y1 = kz.Y(y), x2 = kz.X(x + dx), y2 = kz.Y(y + dy);
  let b = OK(x1, y1, x2, y2, c, { w: o.w || 4.2, hd: o.hd || 12, nokta: o.nokta, dash: o.dash });
  if (lab) {
    const L = Math.hypot(dx, dy), yan = o.yan || -1, off = o.off || 18, t = o.t === undefined ? 0.5 : o.t, size = o.size || 15;
    const cx = x1 + (x2 - x1) * t + (dy / L) * off * yan, cy = y1 + (y2 - y1) * t + (dx / L) * off * yan;
    b += o.duz ? T(cx, cy + size * 0.35, lab, { c, size }) : VL(cx, cy + size * 0.42, lab, c, { size, pre: o.pre, sub: o.sub });
  }
  return b;
}
// Yön gülü: K (kuzey) yukarı, D (doğu) sağa.
const YON = (x, y, r = 13) => `<circle cx="${x}" cy="${y}" r="${r + 9}" fill="#fff" opacity=".88" stroke="#94a3b8" stroke-width="1"/>` +
  `<line x1="${x - r + 4}" y1="${y}" x2="${x + r - 4}" y2="${y}" stroke="#94a3b8" stroke-width="1.4"/><line x1="${x}" y1="${y + r - 4}" x2="${x}" y2="${y - r + 9}" stroke="#334155" stroke-width="1.8"/><polygon points="${x},${y - r + 3} ${x - 3.6},${y - r + 10} ${x + 3.6},${y - r + 10}" fill="#dc2626"/>` +
  T(x, y - r + 1, 'K', { size: 9.5, c: '#dc2626', halo: false }) + T(x + r + 3.5, y + 3.4, 'D', { size: 9, c: '#334155', halo: false }) + T(x - r - 3.5, y + 3.4, 'B', { size: 9, c: '#334155', halo: false }) + T(x, y + r + 6.5, 'G', { size: 9, c: '#334155', halo: false });
// Eksenli kareli düzlem: (ox, oy) orijin.
const EKSEN = (kz, ox, oy, cols, rows) => {
  const ax = (x1, y1, x2, y2) => OK(kz.X(x1), kz.Y(y1), kz.X(x2), kz.Y(y2), '#334155', { w: 1.8, hd: 8, dash: null }).replace(/<line[^>]*stroke="#fff"[^>]*\/><polygon[^>]*stroke="#fff"[^>]*\/>/, '');
  return ax(0.25, oy, cols - 0.25, oy) + ax(ox, 0.25, ox, rows - 0.25);
};

// Sıcak hava balonu: (x, y) balon gövdesinin geniş yerinin ortası. Tepe y − 100k, sepet altı y + 79k.
function BALON(x, y, k = 1, c1 = '#ef4444', c2 = '#fbbf24', c3 = '#2563eb') {
  const id = uid('bl');
  const env = 'M 0 -100 C 55 -100 72 -48 62 -18 C 54 6 24 30 12 48 L -12 48 C -24 30 -54 6 -62 -18 C -72 -48 -55 -100 0 -100 Z';
  return `<g transform="translate(${x} ${y}) scale(${k})"><defs><radialGradient id="${id}" cx=".34" cy=".26" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0f172a" stop-opacity=".4"/></radialGradient></defs>
<path d="${env}" fill="${c1}"/>
<path d="M 0 -100 C 36 -100 46 -45 40 -16 C 35 8 16 30 8 48 L -8 48 C -16 30 -35 8 -40 -16 C -46 -45 -36 -100 0 -100 Z" fill="${c2}"/>
<path d="M 0 -100 C 14 -100 18 -45 15 -16 C 13 8 6 30 3 48 L -3 48 C -6 30 -13 8 -15 -16 C -18 -45 -14 -100 0 -100 Z" fill="${c3}"/>
<path d="${env}" fill="url(#${id})" stroke="rgba(15,23,42,.55)" stroke-width="1.2"/>
<rect x="-13" y="46" width="26" height="5" rx="2" fill="#334155"/>
<path d="M -11 51 L -9 64 M 11 51 L 9 64 M -4 51 L -3 64 M 4 51 L 3 64" stroke="#5b4636" stroke-width="1.3"/>
<rect x="-11" y="64" width="22" height="15" rx="3" fill="url(#gTahta)" stroke="#6b4a22" stroke-width="1.1"/><path d="M -11 69 H 11 M -11 74 H 11" stroke="#8a5a24" stroke-width=".8" opacity=".7"/></g>`;
}
// Sürat göstergesi: 0–160 km/h, 270° kadran.
function GOSTERGE(cx, cy, r, val) {
  const max = 160, a = v => (225 - 270 * v / max) * Math.PI / 180, P = (v, rr) => [cx + rr * Math.cos(a(v)), cy - rr * Math.sin(a(v))];
  const id = uid('gs');
  let b = `<defs><radialGradient id="${id}" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#27324d"/><stop offset="1" stop-color="#0b1220"/></radialGradient></defs><g filter="url(#golge)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gMetalD)" stroke="#334155" stroke-width="1.6"/></g><circle cx="${cx}" cy="${cy}" r="${r * 0.91}" fill="url(#${id})" stroke="#0b1220" stroke-width="1"/>`;
  for (let v = 0; v <= max; v += 10) {
    const big = v % 20 === 0, [x1, y1] = P(v, r * 0.63), [x2, y2] = P(v, r * (big ? 0.51 : 0.57));
    b += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${big ? '#f8fafc' : '#94a3b8'}" stroke-width="${big ? 2.2 : 1.2}" stroke-linecap="round"/>`;
    if (big) { const [tx, ty] = P(v, r * 0.785); b += T(tx, ty + r * 0.048, String(v), { size: r * 0.135, c: '#f8fafc', halo: false, w: 700 }); }
  }
  const [nx, ny] = P(val, r * 0.47), [bx, by] = P(val, -r * 0.12);
  b += T(cx, cy + r * 0.62, 'km/h', { size: r * 0.14, c: '#cbd5e1', halo: false, w: 700 });
  b += `<line x1="${bx}" y1="${by}" x2="${nx}" y2="${ny}" stroke="#ef4444" stroke-width="${r * 0.05}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${r * 0.1}" fill="url(#gJant)" stroke="#334155" stroke-width="1"/>`;
  return b;
}
// Dinamometre: (x, y) üst halka, kanca ucu y + 88. n: göstergenin durduğu çizgi (0–5).
function DINAMO(x, y, n, deger) {
  return `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="#475569" stroke-width="2.6"/><g filter="url(#golge)"><rect x="${x - 11}" y="${y + 6}" width="22" height="62" rx="5" fill="url(#gMetalD)" stroke="#475569" stroke-width="1.2"/></g><rect x="${x - 6}" y="${y + 12}" width="12" height="50" rx="2" fill="#fff" stroke="#94a3b8" stroke-width=".8"/>` +
    Array.from({ length: 6 }, (_, i) => `<line x1="${x - 6}" y1="${y + 16 + i * 9}" x2="${x}" y2="${y + 16 + i * 9}" stroke="#475569" stroke-width="1"/>`).join('') + `<rect x="${x - 6}" y="${y + 16 + n * 9 - 1.3}" width="12" height="2.6" fill="#dc2626"/>` +
    `<path d="M ${x} ${y + 68} V ${y + 80} q 0 8 -6 8" fill="none" stroke="#475569" stroke-width="2.6" stroke-linecap="round"/>` + (deger ? T(x + 19, y + 16 + n * 9 + 4.5, deger, { size: 14, a: 'start', c: C.pembe }) : '');
}
// Pirinç kütle (laboratuvar ağırlığı): (x, y) taban ortası.
const KUTLE = (x, y, lab, k = 1) => { const id = uid('pr'); return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fef3c7"/><stop offset=".35" stop-color="#eab308"/><stop offset="1" stop-color="#92400e"/></linearGradient></defs><rect x="${x - 5 * k}" y="${y - 31 * k}" width="${10 * k}" height="${8 * k}" rx="2" fill="url(#${id})" stroke="#78350f" stroke-width=".9"/><rect x="${x - 15 * k}" y="${y - 24 * k}" width="${30 * k}" height="${24 * k}" rx="3" fill="url(#${id})" stroke="#78350f" stroke-width="1"/>` + (lab ? T(x, y - 8 * k, lab, { size: 10.5 * k, c: '#422006', halo: false }) : ''); };

// ---------- Kapak: rüzgârda yükselen balon, hızların bileşkesi (3-4-5) ve kareli düzlemdeki modeli ----------
const kapak = (() => {
  const w = 720, h = 330;
  const tepe = `<ellipse cx="560" cy="318" rx="290" ry="66" fill="#b5dfa4"/><ellipse cx="110" cy="322" rx="250" ry="56" fill="#a3d692"/>`;
  const s = R.SAHNE(w, h, { tur: 'cim', zh: 34, arka: R.GUNES(62, 60, 24) + R.BULUT(150, 108, .85) + R.BULUT(432, 96, 1.05) + R.BULUT(600, 236, .7) + tepe + BALON(446, 214, .3, '#7c3aed', '#fde68a', '#0f766e') + BALON(390, 250, .19, '#0891b2', '#fff', '#be185d') });
  const yer = s.yerY, ox = 200, oy = 131, u = 34;
  let b = s.b + R.AGAC(36, yer, 1.1) + R.AGAC(84, yer + 1, .8) + R.AGAC(500, yer + 1, .75);
  // rüzgâr tulumu ve izleyenler
  b += `<rect x="637" y="226" width="4" height="${yer - 226}" fill="url(#gMetalD)" stroke="#475569" stroke-width=".8"/><polygon points="641,226 641,242 660,240 660,228" fill="#ea580c"/><polygon points="660,228 660,240 677,238 677,230" fill="#fff"/><polygon points="677,230 677,238 692,236.5 692,231.5" fill="#ea580c"/>`;
  b += R.INSAN(570, yer, { k: .62, renk: '#0f766e' }) + R.INSAN(596, yer + 1, { k: .5, renk: '#be185d', yon: -1 });
  // balon ve gölgesi
  b += `<ellipse cx="214" cy="${yer + 12}" rx="40" ry="6" fill="#0f172a" opacity=".2" filter="url(#yumusak)"/>` + BALON(ox, 213, .8);
  // hız vektörleri (1 m/s = 34 px)
  b += `<path d="M ${ox + 4 * u} ${oy} V ${oy - 3 * u} H ${ox}" fill="none" stroke="#475569" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  b += OK(ox, oy, ox + 4 * u, oy, C.mavi, { w: 6, hd: 17 }) + OK(ox, oy, ox, oy - 3 * u, C.turuncu, { w: 6, hd: 17 }) + OK(ox, oy, ox + 4 * u, oy - 3 * u, C.mor, { w: 6.5, hd: 18, nokta: 5 });
  b += ROZET(ox + 4 * u + 12, oy, 'rüzgâr: 4 m/s', C.mavi, { a: 'start', size: 13 }) + ROZET(ox - 13, oy - 1.6 * u, 'yükselme: 3 m/s', C.turuncu, { a: 'end', size: 13 }) + ROZET(ox + 4 * u + 12, oy - 3 * u, 'bileşke: 5 m/s', C.mor, { a: 'start', size: 13 });
  // kareli düzlemdeki model
  const kz = R.KARELI(6, 5, 26);
  b += `<g transform="translate(512 24)">${kz.b}${vek(kz, 1, 1, 4, 0, C.mavi, '4', { duz: true, yan: 1, w: 4.6, size: 15 })}${vek(kz, 5, 1, 0, 3, C.turuncu, '3', { duz: true, yan: 1, w: 4.6, size: 15 })}${vek(kz, 1, 1, 4, 3, C.mor, '5', { duz: true, w: 4.8, size: 15, nokta: true })}</g>`;
  return S(w, h, 180, b + s.cerceve);
})();

// ---------- Gün 1: alt dal kartları ----------
const mini = (bg, ic) => { const id = uid('mc'); return `<clipPath id="${id}"><rect width="160" height="92" rx="9"/></clipPath><g clip-path="url(#${id})"><rect width="160" height="92" fill="${bg}"/>${ic}</g><rect x=".6" y=".6" width="158.8" height="90.8" rx="9" fill="none" stroke="#b8c4d6" stroke-width="1.2"/>`; };
const mMekanik = () => mini('url(#gGok)', R.BULUT(124, 20, .5) + R.ZEMIN(0, 160, 70, { tur: 'asfalt', h: 22 }) + R.ARABA(60, 71, { k: .62, renk: '#dc2626' }) + OK(106, 48, 150, 48, C.mavi, { w: 4.4, hd: 11 }));
const mTermo = () => {
  const id = uid('mg');
  return mini('#fff1dc', `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e2e8f0"/><stop offset="1" stop-color="#a8b4c6"/></linearGradient></defs>
<ellipse cx="82" cy="82" rx="36" ry="5" fill="#0f172a" opacity=".16"/>
<path d="M 102 48 q 21 0 21 13 q 0 13 -21 13" fill="none" stroke="#8a97ab" stroke-width="8"/><path d="M 102 48 q 21 0 21 13 q 0 13 -21 13" fill="none" stroke="#eef2f7" stroke-width="5"/>
<path d="M 58 40 H 104 V 72 q 0 10 -10 10 H 68 q -10 0 -10 -10 Z" fill="url(#${id})" stroke="#7b8799" stroke-width="1.2"/><rect x="58" y="56" width="46" height="8" fill="#ea580c" opacity=".85"/>
<ellipse cx="81" cy="40" rx="23" ry="5.4" fill="#f8fafc" stroke="#7b8799" stroke-width="1.2"/><ellipse cx="81" cy="40.6" rx="19.5" ry="3.9" fill="#9a3412"/>
<g fill="none" stroke="#94a3b8" stroke-width="2.6" stroke-linecap="round" opacity=".75"><path d="M 70 31 q -6 -6 0 -12 q 6 -6 0 -12"/><path d="M 82 29 q -6 -6 0 -12 q 6 -6 0 -12"/><path d="M 94 31 q -6 -6 0 -12 q 6 -6 0 -12"/></g>`);
};
const mElektro = () => mini('#e9edff', `<g fill="none" stroke="#6366f1" stroke-width="1.6" stroke-dasharray="4 3.4" opacity=".85"><path d="M 61 24 C 61 11 99 11 99 24"/><path d="M 53 24 C 49 -1 111 -1 107 24"/></g>
<g filter="url(#golge)"><path d="M 58 36 V 58 A 22 22 0 0 0 80 80" fill="none" stroke="#dc2626" stroke-width="16"/><path d="M 80 80 A 22 22 0 0 0 102 58 V 36" fill="none" stroke="#2563eb" stroke-width="16"/><rect x="50" y="26" width="16" height="11" fill="url(#gMetal)" stroke="#475569" stroke-width=".9"/><rect x="94" y="26" width="16" height="11" fill="url(#gMetal)" stroke="#475569" stroke-width=".9"/></g>
<path d="M 52.5 40 V 58 A 27.5 27.5 0 0 0 60 77" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>` + T(58, 54, 'N', { size: 10.5, c: '#fff', halo: false }) + T(102, 54, 'S', { size: 10.5, c: '#fff', halo: false }));
const mOptik = () => mini('#101a3c', `<line x1="-2" y1="60" x2="67" y2="46" stroke="#fff" stroke-width="3.4"/><line x1="67" y1="46" x2="94" y2="47" stroke="#fff" stroke-width="2" opacity=".5"/>` +
  ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'].map((c, i) => `<polygon points="93,46 162,${42 + i * 7.6} 162,${49.6 + i * 7.6} 93,48.4" fill="${c}"/>`).join('') +
  `<polygon points="80,16 49,76 111,76" fill="url(#gCam)" opacity=".86" stroke="#e0f2fe" stroke-width="1.6" stroke-linejoin="round"/><polygon points="80,22 56,72 66,72" fill="#fff" opacity=".28"/>`);
const mKati = () => {
  let pin = '';
  for (let i = 0; i < 6; i++) pin += `<rect x="44" y="${27.5 + i * 7}" width="9" height="3.6" rx="1" fill="url(#gMetal)"/><rect x="107" y="${27.5 + i * 7}" width="9" height="3.6" rx="1" fill="url(#gMetal)"/><rect x="${58.5 + i * 7.2}" y="14" width="3.6" height="9" rx="1" fill="url(#gMetal)"/><rect x="${58.5 + i * 7.2}" y="69" width="3.6" height="9" rx="1" fill="url(#gMetal)"/>`;
  const id = uid('cp');
  return mini('#0d5f50', `<g fill="none" stroke="#5eead4" stroke-width="1.5" opacity=".55"><path d="M 0 29 H 26 L 34 37 H 44"/><path d="M 0 57 H 22 L 30 49 H 44"/><path d="M 116 43 H 132 L 140 35 H 160"/><path d="M 116 64 H 128 L 138 74 H 160"/><path d="M 67.5 14 V 0"/><path d="M 96 78 V 92"/></g><circle cx="26" cy="29" r="2.6" fill="#fde68a"/><circle cx="132" cy="43" r="2.6" fill="#fde68a"/><circle cx="22" cy="57" r="2.6" fill="#fde68a"/>
<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#475569"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs>${pin}
<g filter="url(#golge)"><rect x="52" y="22" width="56" height="48" rx="4" fill="url(#${id})" stroke="#0b1220" stroke-width="1"/></g><rect x="65" y="33" width="30" height="26" rx="2.5" fill="url(#gMetalD)" stroke="#334155" stroke-width=".9"/><rect x="68" y="36" width="24" height="7" rx="1.5" fill="#fff" opacity=".4"/><circle cx="58" cy="28" r="1.8" fill="#94a3b8"/>`);
};
const mAtom = () => mini('#f1e7ff', [0, 60, 120].map(a => `<ellipse cx="80" cy="46" rx="44" ry="15" transform="rotate(${a} 80 46)" fill="none" stroke="#7c3aed" stroke-width="1.7" opacity=".8"/>`).join('') +
  R.TOP(77, 44, 6.5, '#ef4444') + R.TOP(84, 45, 6.5, '#64748b') + R.TOP(80, 51, 6.5, '#ef4444') + R.TOP(124, 46, 4.6, '#2563eb') + R.TOP(58, 8, 4.6, '#2563eb') + R.TOP(58, 84, 4.6, '#2563eb'));
const mNukleer = () => {
  let b = '';
  [[0, 0, 1], [13, 0, 0], [-13, 0, 0], [6.5, 11.3, 1], [-6.5, 11.3, 0], [6.5, -11.3, 0], [-6.5, -11.3, 1]].forEach(([dx, dy, pr]) => { b += R.TOP(58 + dx, 46 + dy, 7.6, pr ? '#ef4444' : '#64748b'); });
  return mini('#fff8c9', `<circle cx="58" cy="46" r="31" fill="#fde047" opacity=".35" filter="url(#yumusak)"/>` + b + OK(92, 30, 146, 12, '#d97706', { w: 3.2, hd: 10, dash: '5 4' }) + OK(96, 46, 152, 46, '#d97706', { w: 3.2, hd: 10, dash: '5 4' }) + OK(92, 62, 146, 80, '#d97706', { w: 3.2, hd: 10, dash: '5 4' }));
};
const mPlazma = () => {
  const id = uid('pz'), uc = [[52, 22], [60, 64], [80, 9], [104, 20], [110, 48], [96, 68], [50, 44]];
  const yol = uc.map(([x, y], i) => `M 80 40 Q ${(80 + x) / 2 + (i % 2 ? 7 : -7)} ${(40 + y) / 2 + (i % 3 ? -5 : 6)} ${x} ${y}`).join(' ');
  return mini('#0a0f24', `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f5d0fe"/><stop offset=".3" stop-color="#a855f7"/><stop offset="1" stop-color="#1e1b4b"/></radialGradient></defs>
<path d="M 64 68 H 96 L 104 92 H 56 Z" fill="#334155" stroke="#0b1220" stroke-width="1"/><rect x="64" y="68" width="32" height="4" fill="#64748b"/>
<circle cx="80" cy="40" r="34" fill="url(#${id})" stroke="#c4b5fd" stroke-width="1.4"/><path d="${yol}" fill="none" stroke="#e879f9" stroke-width="5" opacity=".55" filter="url(#yumusak)"/><path d="${yol}" fill="none" stroke="#fdf4ff" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="80" cy="40" r="5" fill="#fdf4ff"/><ellipse cx="66" cy="23" rx="11" ry="5" fill="#fff" opacity=".22" transform="rotate(-35 66 23)"/>`);
};
const dalKart = (svg, ad, inceler, ornek) => `<div class="kart" style="padding:6px 7px 7px"><div class="sekil">${S(160, 92, 37, svg)}</div><h4 style="margin-top:4px">${ad}</h4><p style="font-size:8.7pt;line-height:1.3;margin:0">${inceler}</p><p style="font-size:8.7pt;line-height:1.3;margin:2px 0 0;color:#0b5566"><b>${ornek}</b></p></div>`;
const dallar = () => `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:6px 0;break-inside:avoid">` + [
  [mMekanik(), 'Mekanik', 'Kuvvet, hareket ve denge.', 'Fren yapan otomobilin durması.'],
  [mTermo(), 'Termodinamik', 'Isı, sıcaklık ve ısı alışverişi.', 'Bardaktaki çayın soğuması.'],
  [mElektro(), 'Elektromanyetizma', 'Elektrik yükleri, akım ve mıknatıslar.', 'Mıknatısın çiviyi çekmesi.'],
  [mOptik(), 'Optik', 'Işık olayları: yansıma, kırılma, gölge.', 'Işığın prizmada renklerine ayrılması.'],
  [mKati(), 'Katı hâl fiziği', 'Kristal yapılı katılar ve yarı iletkenler.', 'İşlemci (çip) üretimi.'],
  [mAtom(), 'Atom fiziği', 'Atomun yapısı, elektronların enerji düzeyleri.', 'Lazer ışığının elde edilmesi.'],
  [mNukleer(), 'Nükleer fizik', 'Atom çekirdeği ve çekirdek tepkimeleri.', 'Fosillerin yaşının belirlenmesi.'],
  [mPlazma(), 'Yüksek enerji ve plazma fiziği', 'Atom altı parçacıklar ve plazma hâli.', 'Kutup ışıklarının oluşması.'],
].map(k => dalKart(...k)).join('') + `</div>`;
// Deneme 3: üç görsel yan yana
const fUcGorsel = (mm = 150) => {
  const g = (x, ic, no) => `<g transform="translate(${x} 0)">${ic}</g>` + T(x + 80, 111, no, { size: 15 });
  return S(520, 118, mm, g(0, mElektro(), 'I') + g(180, mOptik(), 'II') + g(360, mTermo(), 'III'));
};

// ---------- Gün 2 şekilleri ----------
// Laboratuvar masası: beş temel nicelik ve ölçme aracı
const fLab = (mm = 176) => {
  const w = 640, h = 190, y = 148, id = uid('lb');
  let b = `<clipPath id="${id}"><rect width="${w}" height="${h}" rx="12"/></clipPath><g clip-path="url(#${id})"><rect width="${w}" height="${h}" fill="#eef3f9"/><rect y="54" width="${w}" height="3" fill="#dde5ef"/>${R.ZEMIN(0, w, y, { tur: 'masa', h: h - y })}</g>`;
  const et = (cx, a, bb, ar) => T(cx, 23, a, { size: 15 }) + T(cx, 41, bb, { size: 13, w: 700, c: '#0e7490' }) + T(cx, y + 27, ar, { size: 12.5, w: 700, c: '#fff', hc: '#7d4d19', hw: 3 });
  // cetvel
  b += R.CETVEL(14, y - 22, 116, 10, { adim: 5 }) + et(72, 'Uzunluk', 'metre (m)', 'cetvel');
  // terazi ve 1 kg'lık kütle
  b += R.TERAZI(197, y - 40, '1000 g') + KUTLE(197, y - 40, '1 kg') + et(197, 'Kütle', 'kilogram (kg)', 'terazi');
  // kronometre
  b += `<ellipse cx="322" cy="${y + 1}" rx="20" ry="3.4" fill="#0f172a" opacity=".22"/>` + R.KRONOMETRE(322, y - 25, 24) + et(322, 'Zaman', 'saniye (s)', 'kronometre');
  // termometre ve su dolu beher
  const tx = 447;
  b += `<ellipse cx="${tx}" cy="${y + 1}" rx="30" ry="3.6" fill="#0f172a" opacity=".2"/><rect x="${tx - 24}" y="${y - 50}" width="48" height="48" fill="url(#gSu)" opacity=".55"/>`;
  b += `<rect x="${tx + 3}" y="${y - 92}" width="7" height="80" rx="3.5" fill="#fff" stroke="#64748b" stroke-width="1.1"/><rect x="${tx + 5.2}" y="${y - 58}" width="2.6" height="46" fill="#dc2626"/><circle cx="${tx + 6.5}" cy="${y - 11}" r="6" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/>` + Array.from({ length: 6 }, (_, i) => `<line x1="${tx + 10}" y1="${y - 86 + i * 7}" x2="${tx + 14}" y2="${y - 86 + i * 7}" stroke="#475569" stroke-width="1"/>`).join('');
  b += `<path d="M ${tx - 26} ${y - 62} V ${y - 5} q 0 4 4 4 H ${tx + 22} q 4 0 4 -4 V ${y - 62}" fill="rgba(224,242,254,.3)" stroke="#6b93b3" stroke-width="1.6"/><path d="M ${tx - 21} ${y - 56} V ${y - 12}" stroke="#fff" stroke-width="2.4" opacity=".7" stroke-linecap="round"/>` + et(tx, 'Sıcaklık', 'kelvin (K)', 'termometre');
  // ampermetre
  const ax = 572, ay = y - 2;
  b += `<g filter="url(#golge)"><rect x="${ax - 39}" y="${y - 60}" width="78" height="60" rx="6" fill="url(#gMetalD)" stroke="#475569" stroke-width="1.3"/></g><rect x="${ax - 32}" y="${y - 54}" width="64" height="36" rx="3" fill="#fff" stroke="#94a3b8" stroke-width="1"/>`;
  for (let d = -50; d <= 50; d += 12.5) { const r1 = d % 25 === 0 ? 32 : 35, sn = Math.sin(d * Math.PI / 180), cs = Math.cos(d * Math.PI / 180); b += `<line x1="${ax + r1 * sn}" y1="${ay - r1 * cs}" x2="${ax + 38 * sn}" y2="${ay - 38 * cs}" stroke="#475569" stroke-width="1.1"/>`; }
  b += `<line x1="${ax + 21 * Math.sin(.42)}" y1="${ay - 21 * Math.cos(.42)}" x2="${ax + 35 * Math.sin(.42)}" y2="${ay - 35 * Math.cos(.42)}" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>` + T(ax - 5, y - 21, 'A', { size: 11.5, halo: false, c: '#334155' });
  b += `<circle cx="${ax - 22}" cy="${y - 9}" r="3.8" fill="#dc2626" stroke="#7f1d1d" stroke-width=".8"/><circle cx="${ax + 22}" cy="${y - 9}" r="3.8" fill="#1e293b" stroke="#0b1220" stroke-width=".8"/>` + et(ax, 'Elektrik akımı', 'amper (A)', 'ampermetre');
  b += `<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="12" fill="none" stroke="#b8c4d6" stroke-width="1.5"/>`;
  return S(w, h, mm, b);
};
// Kütle ve ağırlık: aynı cisim terazide ve dinamometrede
const fAgirlik = (mm = 70) => {
  const w = 360, h = 200, y = 160, id = uid('ag');
  let b = `<clipPath id="${id}"><rect width="${w}" height="${h}" rx="12"/></clipPath><g clip-path="url(#${id})"><rect width="${w}" height="${h}" fill="#eef3f9"/>${R.ZEMIN(0, w, y, { tur: 'masa', h: h - y })}</g>`;
  b += R.TERAZI(80, y - 40, '1000 g') + KUTLE(80, y - 40, '1 kg') + ROZET(80, 62, 'kütle: 1 kg', C.yesil, { size: 13 });
  // sehpa ve dinamometre
  b += `<rect x="322" y="20" width="7" height="${y - 20}" fill="url(#gMetalD)" stroke="#475569" stroke-width="1"/><rect x="250" y="18" width="80" height="7" rx="2" fill="url(#gMetalD)" stroke="#475569" stroke-width="1"/><rect x="304" y="${y - 7}" width="44" height="7" rx="2" fill="#334155"/><line x1="268" y1="25" x2="268" y2="34" stroke="#475569" stroke-width="2.2"/>`;
  b += DINAMO(268, 40, 2) + `<line x1="262" y1="128" x2="268" y2="134" stroke="#475569" stroke-width="2"/>` + KUTLE(268, 165, '1 kg');
  b += ROZET(244, 98, 'ağırlık: 10 N', C.pembe, { size: 13, a: 'end' });
  b += `<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="12" fill="none" stroke="#b8c4d6" stroke-width="1.5"/>`;
  return S(w, h, mm, b);
};
const fGosterge = (val, mm = 40) => S(160, 156, mm, GOSTERGE(80, 78, 70, val));
// Cetvel üzerinde 4 özdeş silgi (3 cm ile 15 cm arası)
const fSilgi = (mm = 124) => {
  const x = 14, L = 400, n = 16, yy = 44, X = i => x + 6 + (L - 12) * i / n;
  let b = R.CETVEL(x, yy, L, n);
  ['#2563eb', '#be185d', '#2563eb', '#be185d'].forEach((c, i) => {
    const x1 = X(3 + 3 * i), x2 = X(6 + 3 * i);
    b += `<rect x="${x1}" y="${yy - 27}" width="${x2 - x1}" height="27" rx="3.5" fill="${c}" stroke="rgba(15,23,42,.6)" stroke-width="1.2"/><rect x="${x1 + (x2 - x1) * 0.3}" y="${yy - 27}" width="${(x2 - x1) * 0.4}" height="27" fill="#f8fafc" stroke="rgba(15,23,42,.45)" stroke-width="1"/><rect x="${x1 + 3}" y="${yy - 24}" width="${x2 - x1 - 6}" height="5" rx="2" fill="#fff" opacity=".35"/>`;
  });
  b += T(x + L + 8, yy + 16, 'cm', { a: 'start', size: 13, c: '#78350f' });
  return S(450, 76, mm, b);
};
// İki terazi: boş kap ve 4 bilyeli kap
const fTerazi2 = (mm = 100) => {
  const w = 380, h = 150, y = 114, id = uid('t2');
  let b = `<clipPath id="${id}"><rect width="${w}" height="${h}" rx="12"/></clipPath><g clip-path="url(#${id})"><rect width="${w}" height="${h}" fill="#eef3f9"/>${R.ZEMIN(0, w, y, { tur: 'masa', h: h - y })}</g>`;
  const kap = (cx, dolu) => {
    let s = '';
    if (dolu) s += R.TOP(cx - 9, y - 49, 8.4, '#94a3b8') + R.TOP(cx + 9, y - 49, 8.4, '#94a3b8') + R.TOP(cx - 9, y - 65.5, 8.4, '#94a3b8') + R.TOP(cx + 9, y - 65.5, 8.4, '#94a3b8');
    return s + `<path d="M ${cx - 21} ${y - 84} V ${y - 44} q 0 4 4 4 H ${cx + 17} q 4 0 4 -4 V ${y - 84}" fill="rgba(186,230,253,.28)" stroke="#6b93b3" stroke-width="1.7"/><path d="M ${cx - 16} ${y - 79} V ${y - 48}" stroke="#fff" stroke-width="2.4" opacity=".75" stroke-linecap="round"/>`;
  };
  b += R.TERAZI(100, y - 40, '150 g') + kap(100, false) + R.TERAZI(280, y - 40, '2150 g') + kap(280, true);
  b += T(100, y + 23, 'boş kap', { size: 13, w: 700, c: '#fff', hc: '#7d4d19', hw: 3 }) + T(280, y + 23, 'kap ve 4 bilye', { size: 13, w: 700, c: '#fff', hc: '#7d4d19', hw: 3 });
  b += `<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="12" fill="none" stroke="#b8c4d6" stroke-width="1.5"/>`;
  return S(w, h, mm, b);
};

// ---------- Gün 3 şekilleri ----------
// Sandığı iten kişi: kütle skaler, kuvvet vektörel
const fIt = (mm = 72) => {
  const w = 330, h = 176, s = R.SAHNE(w, h, { tur: 'zemin', zh: 34, arka: R.BULUT(70, 34, .7) });
  const yer = s.yerY;
  let b = s.b + R.INSAN(84, yer, { kol: 'it', k: 1, renk: '#2563eb' }) + R.KUTU(109, yer - 60, 64, 60, { lab: '20 kg', lw: 23 });
  b += OK(190, yer - 32, 268, yer - 32, C.pembe, { w: 5.4 }) + T(232, yer - 46, '50 N', { c: C.pembe, size: 15 });
  b += T(w - 13, 24, 'doğu →', { a: 'end', size: 12.5, c: '#475569', w: 700 }) + T(w - 76, 24, '← batı', { a: 'end', size: 12.5, c: '#475569', w: 700 });
  return S(w, h, mm, b + s.cerceve);
};
// Vektörün dört özelliği
const fOzellik = (mm = 80) => {
  const kz = R.KARELI(11, 4, 26); let b = kz.b;
  b += `<line x1="${kz.X(0.3)}" y1="${kz.Y(2)}" x2="${kz.X(10.7)}" y2="${kz.Y(2)}" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6 5"/>`;
  b += OK(kz.X(2), kz.Y(2), kz.X(7), kz.Y(2), C.mor, { w: 5, hd: 15, nokta: 5 });
  b += T(kz.X(4.4), kz.Y(2.5), 'büyüklük: 5 birim', { size: 13, c: C.mor }) + T(kz.X(2), kz.Y(1.2), 'başlangıç noktası', { size: 12.5, c: '#334155' }) + T(kz.X(6.9), kz.Y(1.2), 'yön: doğu', { size: 12.5, c: '#334155' }) + T(kz.X(9.1), kz.Y(2.4), 'doğrultu', { size: 12.5, c: '#475569' });
  b += YON(kz.X(9.9), kz.Y(0.95), 10);
  return S(kz.W, kz.H, mm, b);
};
// Eşit, zıt, katı
const fEsit = (mm = 96) => {
  const kz = R.KARELI(16, 7, 22); let b = kz.b;
  b += vek(kz, 1, 4, 4, 2, C.mavi, 'A') + vek(kz, 1, 1, 4, 2, C.mavi, 'B', { yan: 1 }) + vek(kz, 11, 6, -4, -2, C.turuncu, 'C', { yan: 1 }) + vek(kz, 6, 1, 2, 1, C.yesil, 'D', { yan: 1 }) + vek(kz, 15, 4, -6, -3, C.pembe, 'E', { yan: -1 });
  return S(kz.W, kz.H, mm, b);
};
// Isınma 10: K, L, M, N, P
const fS10 = (mm = 112) => {
  const kz = R.KARELI(15, 6, 23); let b = kz.b;
  b += vek(kz, 1, 4, 3, 1, C.mavi, 'K') + vek(kz, 1, 1, 3, 1, C.yesil, 'L') + vek(kz, 10, 5, -3, -1, C.turuncu, 'M', { yan: 1 }) + vek(kz, 5, 1, 1, 3, C.mor, 'N', { yan: 1 }) + vek(kz, 8, 1, 6, 2, C.pembe, 'P', { yan: 1 });
  return S(kz.W, kz.H, mm, b);
};
// Isınma 12: üç otomobil
const fAraclar = (mm = 130) => {
  const w = 520, h = 150, s = R.SAHNE(w, h, { tur: 'asfalt', zh: 38, arka: R.BULUT(268, 30, .7) });
  const yer = s.yerY; let b = s.b;
  [[82, 1, 'K', '#2563eb'], [236, 1, 'M', '#0f766e'], [424, -1, 'L', '#dc2626']].forEach(([x, yon, ad, renk]) => {
    b += R.ARABA(x, yer, { k: .7, renk, yon }) + OK(x - 32 * yon, yer - 48, x + 32 * yon, yer - 48, C.koyu, { w: 4.4, hd: 12 }) + T(x, yer - 60, `${ad}: 25 m/s`, { size: 13.5 });
  });
  b += T(w - 13, 22, 'doğu →', { a: 'end', size: 12.5, c: '#475569', w: 700 }) + T(13, 22, '← batı', { a: 'start', size: 12.5, c: '#475569', w: 700 });
  return S(w, h, mm, b + s.cerceve);
};
// Deneme 9: K ve 5 aday vektör
const fD9 = (mm = 100) => {
  const kz = R.KARELI(15, 7, 22); let b = kz.b;
  b += vek(kz, 1, 2, 2, -1, C.koyu, 'K', { w: 4.6 });
  b += vek(kz, 5, 4, -4, 2, C.mavi, '1', { duz: true, yan: 1 }) + vek(kz, 5, 6, 4, -2, C.turuncu, '2', { duz: true, yan: 1 }) + vek(kz, 8, 1, -2, 1, C.yesil, '3', { duz: true, yan: 1 }) + vek(kz, 13, 3, -4, -2, C.mor, '4', { duz: true, yan: 1 }) + vek(kz, 10, 4, 4, 2, C.pembe, '5', { duz: true });
  return S(kz.W, kz.H, mm, b);
};

// ---------- Gün 4 şekilleri ----------
const fUcUca = (mm = 62) => {
  const kz = R.KARELI(7, 6, 26); let b = kz.b;
  b += vek(kz, 1, 1, 5, 4, C.mor, 'R', { w: 4.8, t: 0.45, nokta: true }) + vek(kz, 1, 1, 4, 1, C.mavi, 'A', { yan: 1 }) + vek(kz, 5, 2, 1, 3, C.turuncu, 'B', { yan: 1 });
  return S(kz.W, kz.H, mm, b);
};
const fParalel = (mm = 62) => {
  const kz = R.KARELI(7, 6, 26); let b = kz.b;
  b += `<path d="M ${kz.X(5)} ${kz.Y(2)} L ${kz.X(6)} ${kz.Y(5)} L ${kz.X(2)} ${kz.Y(4)}" fill="none" stroke="#64748b" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  b += vek(kz, 1, 1, 5, 4, C.mor, 'R', { w: 4.8, t: 0.62, yan: 1, off: 14 }) + vek(kz, 1, 1, 4, 1, C.mavi, 'A', { yan: 1 }) + vek(kz, 1, 1, 1, 3, C.turuncu, 'B', { nokta: true });
  return S(kz.W, kz.H, mm, b);
};
const fOzel = (tur) => {
  const kz = R.KARELI(8, 6, 20); let b = kz.b; const o = { duz: true, size: 14, hd: 11, off: 17 };
  if (tur === 'ayni') b += vek(kz, 1, 4, 4, 0, C.mavi, '4', o) + vek(kz, 5, 4, 2, 0, C.turuncu, '2', o) + vek(kz, 1, 2, 6, 0, C.mor, 'R = 6', o);
  if (tur === 'zit') b += vek(kz, 1, 4, 4, 0, C.mavi, '4', o) + vek(kz, 5, 3, -2, 0, C.turuncu, '2', { ...o, t: 1.45, off: 0.01 }) + vek(kz, 1, 2, 2, 0, C.mor, 'R = 2', { ...o, t: 1.95, off: 0.01 });
  if (tur === 'dik') b += vek(kz, 2, 2, 4, 3, C.mor, 'R = 5', { ...o, off: 22 }) + vek(kz, 2, 2, 4, 0, C.mavi, '4', { ...o, yan: 1 }) + vek(kz, 6, 2, 0, 3, C.turuncu, '3', { ...o, yan: 1 });
  return S(kz.W, kz.H, 44, b);
};
const fBilesen = (mm = 66) => {
  const kz = R.KARELI(9, 6, 26); let b = kz.b + EKSEN(kz, 3, 2, 9, 6);
  b += `<path d="M ${kz.X(7)} ${kz.Y(2)} V ${kz.Y(5)} H ${kz.X(3)}" fill="none" stroke="#64748b" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  b += OK(kz.X(3), kz.Y(2), kz.X(7), kz.Y(2), C.mavi, { w: 4, hd: 11 }) + OK(kz.X(3), kz.Y(2), kz.X(3), kz.Y(5), C.turuncu, { w: 4, hd: 11 }) + vek(kz, 3, 2, 4, 3, C.mor, 'A', { w: 4.8, nokta: true });
  b += T(kz.X(5), kz.Y(1.25), `${alt('A', 'x')} = 4`, { size: 13.5, c: C.mavi }) + T(kz.X(2.42), kz.Y(3.4), `${alt('A', 'y')} = 3`, { size: 13.5, c: C.turuncu, a: 'end' });
  b += T(kz.X(8.55), kz.Y(2.3), 'x', { size: 13.5, it: true, c: '#334155' }) + T(kz.X(3.4), kz.Y(5.55), 'y', { size: 13.5, it: true, c: '#334155' });
  return S(kz.W, kz.H, mm, b);
};
// Isınma 13: park krokisi (yol çizili, kestirme çizilmez)
const fHarita = (mm = 84) => {
  const kz = R.KARELI(10, 6, 26); let b = kz.b;
  b += `<rect x="${kz.X(0)}" y="${kz.Y(6)}" width="${10 * 26}" height="${6 * 26}" rx="3" fill="#86efac" opacity=".2"/>`;
  b += `<ellipse cx="${kz.X(2.5)}" cy="${kz.Y(3.5)}" rx="31" ry="17" fill="url(#gSu)" opacity=".75" stroke="#0369a1" stroke-width="1"/><ellipse cx="${kz.X(2.2)}" cy="${kz.Y(3.7)}" rx="12" ry="4" fill="#fff" opacity=".35"/>`;
  const agac = (x, y) => `<circle cx="${kz.X(x) + 2}" cy="${kz.Y(y) + 3}" r="10" fill="#0f172a" opacity=".15"/><circle cx="${kz.X(x)}" cy="${kz.Y(y)}" r="10" fill="#3f8f45" stroke="#2c6a32" stroke-width="1"/><circle cx="${kz.X(x) - 3}" cy="${kz.Y(y) - 3}" r="4.4" fill="#62b866"/>`;
  b += agac(6.5, 2.5) + agac(5.5, 5.4) + agac(1.5, 5.4) + agac(9.4, 2.5) + agac(4.5, 2.4);
  b += OK(kz.X(1), kz.Y(1), kz.X(8), kz.Y(1), C.mavi, { w: 4.2, hd: 12 }) + OK(kz.X(8), kz.Y(1), kz.X(8), kz.Y(4), C.mavi, { w: 4.2, hd: 12 }) + OK(kz.X(8), kz.Y(4), kz.X(5), kz.Y(4), C.mavi, { w: 4.2, hd: 12 });
  b += R.TOP(kz.X(1), kz.Y(1), 5.5, '#1d2b53') + R.TOP(kz.X(5), kz.Y(4), 5.5, '#dc2626');
  b += T(kz.X(0.5), kz.Y(0.3), 'K', { size: 15 }) + T(kz.X(4.5), kz.Y(4.35), 'L', { size: 15, c: '#b91c1c' }) + YON(kz.X(9.1), kz.Y(5.05), 10);
  return S(kz.W, kz.H, mm, b);
};
// Isınma 15: K, L, M
const fS15 = (mm = 92) => {
  const kz = R.KARELI(13, 6, 23); let b = kz.b;
  b += vek(kz, 1, 1, 3, 2, C.mavi, 'K') + vek(kz, 7, 2, -1, 2, C.turuncu, 'L', { yan: 1 }) + vek(kz, 9, 5, 2, -4, C.yesil, 'M', { yan: -1 });
  b += YON(kz.X(11.9), kz.Y(4.9), 10);
  return S(kz.W, kz.H, mm, b);
};
// Isınma 16: eksenli düzlemde F
const fS16 = (mm = 62) => {
  const kz = R.KARELI(8, 6, 24); let b = kz.b + EKSEN(kz, 5, 1, 8, 6);
  b += vek(kz, 5, 1, -3, 4, C.pembe, 'F', { w: 4.8, nokta: true, yan: 1 });
  b += T(kz.X(7.55), kz.Y(1.3), 'x', { size: 13.5, it: true, c: '#334155' }) + T(kz.X(5.4), kz.Y(5.55), 'y', { size: 13.5, it: true, c: '#334155' });
  return S(kz.W, kz.H, mm, b);
};
// Deneme 13: gölde şişme bot (kuş bakışı), iki ip kuvveti
const fBot = (mm = 78) => {
  const kz = R.KARELI(12, 9, 22); let b = kz.b;
  b += `<rect x="${kz.X(0)}" y="${kz.Y(9)}" width="${12 * 22}" height="${9 * 22}" rx="3" fill="#38bdf8" opacity=".28"/>`;
  [[4.6, 6.4], [8.2, 5.2], [6.2, 8.1], [10.2, 7.3], [9.0, 3.5], [5.2, 4.1], [6.6, 0.8], [10.4, 1.0]].forEach(([x, y]) => { b += `<path d="M ${kz.X(x)} ${kz.Y(y)} q 6 -5 12 0 q 6 5 12 0" fill="none" stroke="#fff" stroke-width="1.8" opacity=".8" stroke-linecap="round"/>`; });
  const cx = kz.X(2), cy = kz.Y(2);
  b += `<ellipse cx="${cx + 3}" cy="${cy + 4}" rx="33" ry="22" fill="#0f172a" opacity=".22" filter="url(#yumusak)"/><ellipse cx="${cx}" cy="${cy}" rx="32" ry="21" fill="#f97316" stroke="#9a3412" stroke-width="1.4"/><ellipse cx="${cx}" cy="${cy}" rx="21" ry="11.5" fill="#7c2d12"/><ellipse cx="${cx}" cy="${cy}" rx="21" ry="11.5" fill="none" stroke="#fdba74" stroke-width="1"/><path d="M ${cx - 22} ${cy - 14} q 22 -9 44 0" fill="none" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>`;
  b += vek(kz, 2, 2, 8, 0, C.mavi, 'F', { sub: '1', w: 4.8, t: 0.62 }) + vek(kz, 2, 2, 0, 6, C.pembe, 'F', { sub: '2', w: 4.8, yan: 1, t: 0.62, nokta: true });
  b += YON(kz.X(10.5), kz.Y(7.7), 10);
  return S(kz.W, kz.H, mm, b);
};
// Deneme 14: A ve B (bileşenlerle toplama)
const fD14 = (mm = 60) => {
  const kz = R.KARELI(9, 8, 22); let b = kz.b;
  b += vek(kz, 1, 3, 5, -2, C.mavi, 'A') + vek(kz, 8, 1, -2, 6, C.turuncu, 'B', { yan: -1 });
  return S(kz.W, kz.H, mm, b);
};
// Deneme 15: uç uca eklenmiş K, L ve M
const fD15 = (mm = 52) => {
  const kz = R.KARELI(6, 5, 24); let b = kz.b;
  b += vek(kz, 1, 1, 4, 3, C.mor, 'M', { w: 4.6 }) + vek(kz, 1, 1, 4, 0, C.mavi, 'K', { yan: 1 }) + vek(kz, 5, 1, 0, 3, C.turuncu, 'L', { yan: 1 });
  return S(kz.W, kz.H, mm, b);
};

// ---------- Günler ----------
const gunler = [
  {
    no: 1, baslik: 'Fizik bilimi ve alt dalları', kisa: 'Fizik bilimi ve alt dalları', alt: 'Fizik neyi inceler, hangi olay hangi alt dalın konusudur? Anahtar soru: “Burada hangi süreç inceleniyor?”',
    plan: 'Fizik biliminin tanımı, sekiz alt dal, hangi olay hangi alt dalın konusu.',
    govde:
      bolum('Fizik bilimi nedir?', `<p>Fizik; <b>madde, enerji, kuvvet, uzay ve zaman</b> arasındaki ilişkileri inceler. Bilgisini <b>gözlem ve deneyle</b> elde eder, bulduğu yasaları çoğu zaman <b>matematik diliyle</b> yazar. İncelediği alan çok geniş olduğundan alt dallara ayrılmıştır.</p>`) +
      bolum('Sekiz alt dal') + dallar() +
      ikili(
        kutu('ana', 'Cihaza değil sürece bak', `Bir olayın alt dalını <b>incelenen süreç</b> belirler. Aynı otomobilin frenlemesi mekaniğin, farlarının yolu aydınlatması optiğin, motorunun ısınması termodinamiğin konusudur.`),
        kutu('sari', 'Yön verenler ve kariyer', `İbnülheysem ışığı deneylerle inceledi (optik). Newton hareket yasalarını ortaya koydu (mekanik). Marie Curie radyoaktiviteyi araştırdı (nükleer fizik). Bugün fizik eğitimi alanlar araştırma merkezlerinde, uzay, enerji, savunma ve sağlık alanlarında çalışıyor.`), 'ust') +
      hata('Atom fiziği ile nükleer fizik aynı alt daldır.', 'Atom fiziği atomun bütününü ve elektronların enerji düzeylerini, nükleer fizik yalnızca atom çekirdeğini inceler.') +
      hata('Her olay yalnızca bir alt dalla açıklanır.', 'Çoğu olay birden çok alt dalın konusudur. Alt dallar birbirini tamamlar.'),
    sorular: [
      { metin: 'Bir mutfakta gözlenen üç olay ve bu olayların ilişkili olduğu alt dallar aşağıdaki gibi eşleştirilmiştir.', onc: ['Ocaktaki çaydanlıkta suyun ısınması: termodinamik.', 'Süs mıknatısının buzdolabı kapağına tutunması: elektromanyetizma.', 'Su dolu bardağa konan kaşığın kırık görünmesi: mekanik.'], kok: 'Eşleştirmelerden hangileri doğrudur?', siklar: ['Yalnız I', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III'], k: 5, cevap: 'B', cozum: 'I ve II doğrudur. Kaşığın kırık görünmesi ışığın kırılmasıyla ilgilidir, yani optiğin konusudur.' },
      { metin: 'Bir akıllı telefonla ilgili üç inceleme konusu şöyledir:', onc: ['Kamera merceğinde ışığın kırılması.', 'İşlemcideki yarı iletken malzemelerin yapısı ve iletkenliği.', 'Elden kayan telefonun yere düşerken hızlanması.'], kok: 'Bu konuların ilişkili olduğu alt dallar sırasıyla hangileridir?', siklar: ['Optik, katı hâl fiziği, mekanik', 'Optik, atom fiziği, mekanik', 'Atom fiziği, katı hâl fiziği, termodinamik', 'Optik, elektromanyetizma, nükleer fizik', 'Elektromanyetizma, katı hâl fiziği, mekanik'], k: 2, cevap: 'A', cozum: 'Işığın kırılması optiğin, yarı iletken katıların özellikleri katı hâl fiziğinin, düşen cismin hareketi mekaniğin konusudur.' },
      { metin: 'Güneş ile ilgili üç olay ve ilişkili olduğu alt dallar aşağıda verilmiştir.', onc: ['Güneş’in merkezinde hidrojen çekirdeklerinin birleşerek helyum çekirdeğine dönüşmesi: nükleer fizik.', 'Güneş’i oluşturan maddenin plazma hâlinde bulunması: yüksek enerji ve plazma fiziği.', 'Güneş tutulmasında Ay’ın gölgesinin Dünya’ya düşmesi: optik.'], kok: 'Eşleştirmelerden hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 5, cevap: 'E', cozum: 'Çekirdek tepkimeleri nükleer fiziğin, plazma hâli yüksek enerji ve plazma fiziğinin, gölge oluşumu optiğin konusudur. Üçü de doğrudur.' },
      { metin: 'Fizik bilimi ve fizikle ilgili kariyer alanları için aşağıdaki yargılar veriliyor.', onc: ['Fizik, evrendeki olayları madde, enerji, kuvvet, uzay ve zaman ilişkileri içinde inceler.', 'Fizik, bulgularını gözlem ve deneye dayandırır ve çoğu zaman matematik diliyle ifade eder.', 'Fizik eğitimi alan bir kişi yalnızca öğretmen ya da akademisyen olarak çalışabilir.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'I ve II fizik biliminin tanımıdır. Fizik eğitimi alanlar araştırma merkezlerinde, sağlık, enerji, uzay ve savunma alanlarında da çalışır, III yanlıştır.' },
    ],
    kontrol: ['Fizik biliminin neyi, nasıl incelediğini kendi cümlemle söyleyebiliyorum.', 'Sekiz alt dalı ve her birinin inceleme alanını sayabiliyorum.', 'Verilen bir olayı, incelenen sürece bakarak doğru alt dalla eşleştirebiliyorum.'],
  },
  {
    no: 2, baslik: 'Nicelikler, birimler ve ölçme', kisa: 'Nicelikler ve birimler', alt: 'Ölçebildiğin her şey bir niceliktir. Sayı tek başına bir şey söylemez, yanında birimi olmalıdır.',
    plan: 'Temel ve türetilmiş nicelikler, SI birimleri, ölçme araçları, birim dönüşümleri.',
    govde:
      bolum('Yedi temel nicelik', `<p>Temel nicelikler <b>doğrudan ölçülür</b>, başka niceliklerle tanımlanmaz. Uluslararası Birimler Sistemi’nde (SI) yedi tanedir. Beşi şekildedir, kalan ikisi <b>madde miktarı</b> (mol) ve <b>ışık şiddetidir</b> (kandela, cd).</p>`) +
      sekil(fLab(178)) +
      ikili(
        bolum('Türetilmiş nicelikler', `<p>Temel niceliklerden <b>matematiksel işlemle</b> elde edilir. Birimi de aynı işlemle türetilir.</p>`) +
        tablo(['Nicelik', 'Nasıl türetilir?', 'SI birimi'], [['Sürat', 'yol ÷ zaman', 'm/s'], ['Hacim', 'en × boy × yükseklik', '$\\text{m}^3$'], ['Yoğunluk', 'kütle ÷ hacim', '$\\text{kg/m}^3$'], ['Kuvvet', 'kütle × ivme', 'N $= \\text{kg}\\ \\text{m/s}^2$']]),
        sekil(fAgirlik(70), 'Aynı cisim: terazi kütlesini, dinamometre ağırlığını ölçer.'), 's') +
      ikili(
        sekil(fGosterge(72, 36), 'Gösterge 72 km/h değerinde.'),
        bolum('Ön ekler ve birim dönüşümü', `<p><b>kilo (k):</b> 1000 katı. 1 km = 1000 m, 1 kg = 1000 g.<br><b>santi (c):</b> 100’de biri. 1 m = 100 cm.<br><b>mili (m):</b> 1000’de biri. 1 m = 1000 mm.<br><b>Zaman:</b> 1 dakika = 60 s, 1 saat = 3600 s.</p>`) +
        formul('72\\ \\dfrac{\\text{km}}{\\text{h}} = \\dfrac{72\\,000\\ \\text{m}}{3600\\ \\text{s}} = 20\\ \\text{m/s}'), 'g') +
      hata('Terazi ağırlığı ölçer, ağırlığın birimi kilogramdır.', 'Terazi kütleyi ölçer (kg). Ağırlık bir kuvvettir, dinamometreyle ölçülür ve birimi newtondur (N).') +
      hata('Sıcaklığın SI birimi °C’tur.', 'Günlük hayatta °C kullanılır ama sıcaklığın SI birimi kelvindir (K).'),
    sorular: [
      { metin: 'Bir öğrenci defterine nicelik, SI birimi ve ölçme aracı eşleştirmelerini aşağıdaki gibi yazıyor.', onc: ['Kütle, kilogram, eşit kollu terazi.', 'Sıcaklık, °C, termometre.', 'Ağırlık, newton, dinamometre.'], kok: 'Öğrencinin yazdığı eşleştirmelerden hangileri <u>tamamen</u> doğrudur?', siklar: ['Yalnız III', 'I ve III', 'I ve II', 'II ve III', 'I, II ve III'], k: 5, cevap: 'B', cozum: 'I ve III doğrudur. Sıcaklık termometreyle ölçülür ama SI birimi °C değil kelvindir, II yanlıştır.' },
      { metin: 'Bir bisikletli düz yolda 18 km/h sabit süratle 10 dakika boyunca pedal çeviriyor.', kok: 'Bisikletli bu sürede kaç m yol alır?', siklar: ['50', '180', '300', '3000', '10 800'], cevap: 'D', cozum: '$18\\ \\text{km/h} = \\tfrac{18\\,000\\ \\text{m}}{3600\\ \\text{s}} = 5$ m/s ve 10 dakika $= 600$ s. Yol $= 5 \\times 600 = 3000$ m.' },
      { metin: 'Bir mühendis, bir yayın sertliğini “yaya uygulanan kuvvetin, yayın uzama miktarına bölümü” olarak tanımlıyor. Kuvvet birimi için $1\\ \\text{N} = 1\\ \\text{kg}\\ \\text{m/s}^2$ eşitliği geçerlidir.', kok: 'Bu niceliğin SI birimi temel birimlerle yazıldığında hangi temel niceliklerin birimleri yer alır?', siklar: ['Kütle ve zaman', 'Kütle ve uzunluk', 'Uzunluk ve zaman', 'Yalnız kütle', 'Kütle, uzunluk ve zaman'], k: 3, cevap: 'A', cozum: '$\\tfrac{\\text{N}}{\\text{m}} = \\tfrac{\\text{kg}\\ \\text{m/s}^2}{\\text{m}} = \\text{kg/s}^2$. Metre sadeleşir, geriye kütle ve zaman birimleri kalır.' },
      { metin: 'Dört özdeş silgi, aralarında boşluk kalmayacak biçimde santimetre bölmeli cetvelin üzerine şekildeki gibi dizilmiştir.', sekil: fSilgi(126), kok: 'Bir silginin uzunluğu kaç mm’dir?', siklar: ['3', '12', '30', '40', '120'], cevap: 'C', cozum: 'Silgiler 3 cm ile 15 cm çizgileri arasındadır: toplam $15 - 3 = 12$ cm. Bir silgi $12 \\div 4 = 3$ cm $= 30$ mm.' },
    ],
    kontrol: ['Yedi temel niceliği, SI birimlerini ve ölçme araçlarını sayabiliyorum.', 'Bir niceliğin temel mi türetilmiş mi olduğunu biriminden anlayabiliyorum.', 'km/h ile m/s, g ile kg, cm ile m arasında dönüşüm yapabiliyorum.', 'Kütle ile ağırlığı birimi ve ölçme aracıyla ayırt edebiliyorum.'],
  },
  {
    no: 3, baslik: 'Skaler ve vektörel nicelikler', kisa: 'Skaler ve vektörel nicelikler', alt: 'Bazı niceliklerde “ne kadar?” sorusu yetmez, “hangi yöne?” sorusu da gerekir.',
    plan: 'Skaler ve vektörel ayrımı, vektörün özellikleri, eşit ve zıt vektörler, vektörün sayıyla çarpımı.',
    govde:
      ikili(
        bolum('Skaler mi, vektörel mi?', `<p><b>Skaler nicelik</b> bir sayı ve bir birimle tam olarak anlatılır. <b>Vektörel nicelik</b> sayı ve birimin yanında <b>yön</b> de ister.</p>`) +
        tablo(['Skaler', 'Vektörel'], [['Kütle, zaman, sıcaklık', 'Kuvvet, ağırlık'], ['Uzunluk, hacim, yoğunluk', 'Hız'], ['Enerji, sürat', 'Yer değiştirme']]) +
        '',
        sekil(fIt(70), 'Kütle için yön sorulmaz: 3 kg + 2 kg her zaman 5 kg eder. Kuvvet için sorulur: 50 N batıya uygulansaydı sandık ters yöne giderdi.'), 's') +
      ikili(
        sekil(fOzellik(86)),
        bolum('Vektörün dört özelliği', `<p><b>Başlangıç noktası:</b> Okun çıktığı nokta.<br><b>Büyüklük:</b> Okun boyu. Sayı ve birimle söylenir.<br><b>Doğrultu:</b> Okun üzerinde bulunduğu doğru.<br><b>Yön:</b> Ok ucunun gösterdiği taraf. Her doğrultuda iki yön vardır.</p>`) +
        p('Gösterim: vektör $\\vec{F}$, büyüklüğü $F = 30$ N.'), 'g') +
      bolum('Eşit vektör, zıt vektör, sayıyla çarpım') +
      ikili(
        sekil(fEsit(84), '$\\vec{B} = \\vec{A}$, &nbsp; $\\vec{C} = -\\vec{A}$, &nbsp; $\\vec{D} = \\tfrac{1}{2}\\vec{A}$, &nbsp; $\\vec{E} = -\\tfrac{3}{2}\\vec{A}$.'),
        kutu('ana', 'Üç kural', `<b>Eşit vektörler:</b> Büyüklükleri ve yönleri aynıdır. Vektör, yönü ve boyu bozulmadan taşınabilir.<br><b>Zıt vektörler:</b> Büyüklükleri aynı, yönleri terstir.<br><b>Sayıyla çarpım:</b> Vektör pozitif sayıyla çarpılırsa yalnız büyüklüğü değişir. Negatif sayıyla çarpılırsa yönü de ters döner. Doğrultusu hiç değişmez.`)) +
      hata('Boyları eşit olan vektörler eşit vektörlerdir.', 'Eşit vektörlerin yönleri de aynı olmalıdır.') +
      hata('$-\\vec{A}$ vektörü, $\\vec{A}$ vektöründen küçüktür.', 'Eksi işareti yalnız yönü ters çevirir. İki vektörün büyüklüğü aynıdır.'),
    sorular: [
      { metin: 'Skaler ve vektörel niceliklerle ilgili aşağıdaki yargılar veriliyor.', onc: ['“Rüzgâr 30 km/h süratle esiyor.” cümlesi rüzgârın hızını eksiksiz bildirir.', 'Bir cisme uygulanan 6 N ve 8 N büyüklüğündeki iki kuvvetin toplamı, yönleri ne olursa olsun 14 N’dır.', '3 kg ve 2 kg kütleli iki paket aynı çantaya konursa çantadaki paketlerin toplam kütlesi her durumda 5 kg olur.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız II', 'Yalnız III', 'I ve II', 'I ve III', 'II ve III'], k: 5, cevap: 'B', cozum: 'Hız vektöreldir, yön verilmeden eksik kalır. Kuvvetlerin toplamı yöne bağlıdır. Kütle skalerdir, sayı gibi toplanır. Yalnız III doğrudur.' },
      { metin: 'Kareli düzlemde $\\vec{K}$, $\\vec{L}$, $\\vec{M}$, $\\vec{N}$ ve $\\vec{P}$ vektörleri şekildeki gibi verilmiştir.', sekil: fS10(116), onc: ['$\\vec{K}$ ile $\\vec{N}$ eşit vektörlerdir.', '$\\vec{K}$ ile $\\vec{M}$ aynı doğrultudadır.', '$\\vec{P} = 2\\vec{L}$ eşitliği doğrudur.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 5, cevap: 'D', cozum: 'K ile N’nin boyları eşittir ama yönleri farklıdır, eşit değildirler. M, K’nin zıttıdır: doğrultuları aynıdır. L, K’ye eşittir ve P bunun 2 katıdır. II ve III doğrudur.' },
      { metin: '$\\vec{K}$ vektörü batı yönünde ve 12 N büyüklüğündedir. $\\vec{L} = -\\tfrac{1}{3}\\vec{K}$ ve $\\vec{M} = 2\\vec{L}$ olarak tanımlanıyor.', kok: '$\\vec{M}$ vektörünün büyüklüğü ve yönü nedir?', siklar: ['8 N, doğu', '8 N, batı', '4 N, doğu', '24 N, batı', '24 N, doğu'], cevap: 'A', cozum: '$\\vec{L}$: büyüklük $12 \\div 3 = 4$ N, eksi işareti yüzünden yön doğu. $\\vec{M} = 2\\vec{L}$: büyüklük 8 N, yön değişmez, doğu.' },
      { metin: 'Doğu–batı doğrultusundaki düz bir yolda K, L ve M otomobillerinin hızları şekildeki gibidir.', sekil: fAraclar(132), onc: ['K ile M’nin hızları eşittir.', 'K ile L’nin süratleri eşittir.', 'K ile L’nin hızları eşittir.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III'], k: 5, cevap: 'B', cozum: 'Hız vektöreldir: K ile M hem büyüklük hem yön olarak aynıdır. Sürat skalerdir, üçünde de 25 m/s’dir. K ile L zıt yönlü olduğundan hızları eşit değildir.' },
    ],
    kontrol: ['Bir niceliğin skaler mi vektörel mi olduğunu gerekçesiyle söyleyebiliyorum.', 'Bir vektörün başlangıç noktasını, büyüklüğünü, doğrultusunu ve yönünü okuyabiliyorum.', 'Kareli düzlemde eşit ve zıt vektörleri ayırt edebiliyorum.', 'Bir vektörün sayıyla çarpımının büyüklüğünü ve yönünü bulabiliyorum.'],
  },
  {
    no: 4, baslik: 'Vektörlerin toplanması ve bileşenler', kisa: 'Vektörlerde toplama', alt: 'Okulunda vektörlerde toplama yeni başlamış olabilir. Bu sayfa hem tekrar hem ön hazırlık.',
    plan: 'Uç uca ekleme, paralelkenar, aynı yönlü, zıt yönlü ve dik vektörler, bileşenler. Okulunda yeni başlamış olabilir: hem tekrar hem ön hazırlık.',
    govde:
      bolum('İki yöntem, tek sonuç', `<p>Vektörlerin toplamına <b>bileşke vektör</b> denir ve $\\vec{R}$ ile gösterilir: $\\vec{R} = \\vec{A} + \\vec{B}$. Bir vektörü taşırken boyunu ve yönünü bozma.</p>`) +
      ikili(
        sekil(fUcUca(58), '<b>Uç uca ekleme:</b> $\\vec{B}$’yi $\\vec{A}$’nın ucuna taşı. Bileşke, ilk başlangıçtan son uca çizilir.'),
        sekil(fParalel(58), '<b>Paralelkenar:</b> Başlangıçları birleştir, paralelleri çiz. Bileşke, başlangıçtan çıkan köşegendir.'), 'ust') +
      bolum('Üç özel durum') +
      uclu([
        { sekil: fOzel('ayni'), baslik: 'Aynı yönlü: $R = A + B$', metin: 'Büyüklükler toplanır. Bileşke en büyük değerini alır.' },
        { sekil: fOzel('zit'), baslik: 'Zıt yönlü: $R = A - B$', metin: 'Büyükten küçük çıkarılır. Yön, büyük olanın yönüdür.' },
        { sekil: fOzel('dik'), baslik: 'Dik: $R^2 = A^2 + B^2$', metin: '3 ile 4 dikse bileşke 7 değil 5’tir. Sık çıkanlar: 3-4-5, 6-8-10, 5-12-13.' },
      ]) +
      ikili(
        bolum('Bileşenlerine ayırma', `<p>Bir vektörün $x$ ve $y$ eksenleri üzerindeki iz düşümlerine <b>bileşen</b> denir. Kareli düzlemde bileşenleri kare sayarak okursun: şekilde $A_x = 4$ birim, $A_y = 3$ birim ve $A = 5$ birim.</p>`) +
        kutu('ana', 'Bileşenlerle toplama', `Her vektörü bileşenlerine ayır. $x$ bileşenlerini kendi arasında, $y$ bileşenlerini kendi arasında topla. Bulduğun $R_x$ ve $R_y$ dik olduğundan $R^2 = R_x^{\\,2} + R_y^{\\,2}$.`),
        sekil(fBilesen(68)), 's') +
      hata('İki vektörün bileşkesinin büyüklüğü, büyüklüklerinin toplamıdır.', 'Bu yalnız aynı yönlü vektörlerde doğrudur. 3 N ile 4 N dik ise bileşke 5 N’dır.'),
    sorular: [
      { metin: 'Emre, parkta K noktasından yürümeye başlıyor. Önce 7 kare doğuya, sonra 3 kare kuzeye, en son 3 kare batıya yürüyerek L noktasına varıyor. Parkın krokisinde bir karenin kenarı 100 m’ye karşılık gelmektedir.', sekil: fHarita(70), yan: true, kok: 'Emre’nin yürüdüğü toplam yol ve L noktasının K noktasına uzaklığı kaç m’dir?', siklar: ['700 ve 500', '1000 ve 500', '1300 ve 500', '1300 ve 700', '1300 ve 1000'], k: 2, cevap: 'C', cozum: 'Toplam yol $7 + 3 + 3 = 13$ kare, yani 1300 m. L noktası K’nin 4 kare doğusunda ve 3 kare kuzeyindedir: $4^2 + 3^2 = 5^2$. Uzaklık 5 kare, yani 500 m.' },
      { metin: 'Aynı noktaya uygulanan iki kuvvet aynı yönlü olduğunda bileşkelerinin büyüklüğü 14 N, zıt yönlü olduğunda 2 N oluyor.', kok: 'Bu iki kuvvet birbirine dik olarak uygulanırsa bileşkelerinin büyüklüğü kaç N olur?', siklar: ['8', '10', '12', '14', '16'], cevap: 'B', cozum: '$F_1 + F_2 = 14$ ve $F_1 - F_2 = 2$ olduğundan kuvvetler 8 N ve 6 N’dır. Dik durumda $R^2 = 8^2 + 6^2 = 100$, $R = 10$ N.' },
      { metin: 'Kareli düzlemde $\\vec{K}$, $\\vec{L}$ ve $\\vec{M}$ vektörleri şekildeki gibidir. Karelerin kenar uzunluğu 1 birimdir.', sekil: fS15(96), kok: '$\\vec{K} + \\vec{L} + \\vec{M}$ bileşke vektörünün büyüklüğü ve yönü nedir?', siklar: ['2 birim, kuzey', '4 birim, batı', '6 birim, doğu', '4 birim, doğu', '8 birim, kuzey'], k: 5, cevap: 'D', cozum: 'Doğu yönündeki bileşenler: $3 - 1 + 2 = 4$. Kuzey yönündeki bileşenler: $2 + 2 - 4 = 0$. Bileşke 4 birim büyüklüğünde ve doğu yönündedir.' },
      { metin: 'Dik koordinat sisteminde $\\vec{F}$ kuvveti kareli düzlemde şekildeki gibi çizilmiştir. Bir karenin kenarı 2 N’a karşılık gelmektedir.', sekil: fS16(52), yan: true, onc: ['$\\vec{F}$’nin $x$ bileşeninin büyüklüğü 6 N’dır.', '$\\vec{F}$’nin $y$ bileşeninin büyüklüğü 4 N’dır.', '$\\vec{F}$’nin büyüklüğü 10 N’dır.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'II ve III', 'I ve III'], k: 3, cevap: 'E', cozum: '$x$ bileşeni 3 kare, yani 6 N. $y$ bileşeni 4 kare, yani 8 N, II yanlıştır. $F^2 = 6^2 + 8^2 = 100$, $F = 10$ N.' },
    ],
    kontrol: ['İki vektörü uç uca ekleme ve paralelkenar yöntemiyle toplayabiliyorum.', 'Aynı yönlü, zıt yönlü ve dik iki vektörün bileşkesinin büyüklüğünü bulabiliyorum.', 'Kareli düzlemde bir vektörü bileşenlerine ayırabiliyorum.', 'Bileşenleri toplayarak bileşke vektörü bulabiliyorum.'],
  },
];

// ---------- Deneme ----------
const deneme = [
  { konu: 'k1', metin: 'Bir gözlem uydusunun tasarımında üç ekip görev alıyor. Birinci ekip uydunun yörüngesini ve hızını hesaplıyor. İkinci ekip kameranın mercek sistemini tasarlıyor. Üçüncü ekip, uydunun Güneş’e bakan yüzünün aşırı ısınmasını önleyecek yalıtımı geliştiriyor.', kok: 'Ekiplerin çalışmaları sırasıyla fizik biliminin en çok hangi alt dallarıyla ilişkilidir?', siklar: ['Mekanik, optik, elektromanyetizma', 'Mekanik, optik, termodinamik', 'Optik, mekanik, termodinamik', 'Mekanik, atom fiziği, termodinamik', 'Nükleer fizik, optik, katı hâl fiziği'], k: 1, cevap: 'B', cozum: 'Yörünge ve hız hesabı mekaniğin, mercek sistemi optiğin, ısınma ve yalıtım termodinamiğin konusudur.' },
  { konu: 'k1', metin: 'Fizik biliminin alt dallarıyla ilgili aşağıdaki yargılar veriliyor.', onc: ['Alt dallar birbirinden bağımsızdır, bir olay yalnızca bir alt dalın konusu olabilir.', 'Aynı cihazın farklı parçaları farklı alt dalların konusu olabilir.', 'Bir olayın hangi alt dalla ilişkili olduğunu, olayda incelenen süreç belirler.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 5, cevap: 'D', cozum: 'Alt dallar birbirini tamamlar, bir olay birden çok alt dalın konusu olabilir: I yanlıştır. II ve III doğrudur.' },
  { konu: 'k1', metin: 'Şekildeki I numaralı görselde çevresinde manyetik alan oluşturan bir mıknatıs, II numaralı görselde ışığı renklerine ayıran bir prizma, III numaralı görselde soğumakta olan sıcak bir içecek vardır.', sekil: fUcGorsel(132), kok: 'Görsellerdeki olaylar sırasıyla fizik biliminin hangi alt dallarının konusudur?', siklar: ['Elektromanyetizma, optik, termodinamik', 'Elektromanyetizma, atom fiziği, termodinamik', 'Mekanik, optik, termodinamik', 'Elektromanyetizma, optik, katı hâl fiziği', 'Katı hâl fiziği, optik, nükleer fizik'], k: 1, cevap: 'A', cozum: 'Mıknatıs elektromanyetizmanın, ışığın renklerine ayrılması optiğin, ısı alışverişi termodinamiğin konusudur.' },
  { konu: 'k2', metin: 'Bir öğrenci, oyuncak arabanın rampadan inişini inceliyor. Rampanın uzunluğunu şerit metreyle, iniş süresini kronometreyle ölçüyor ve bu ölçümlerle arabanın süratini hesaplıyor.', onc: ['Öğrencinin ölçtüğü iki nicelik de temel niceliktir.', 'Öğrencinin hesapladığı nicelik türetilmiş niceliktir.', 'Hesaplanan niceliğin SI birimi km/h’tir.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'Uzunluk ve zaman temel niceliktir. Sürat bu ikisinden türetilir. Süratin SI birimi km/h değil m/s’dir, III yanlıştır.' },
  { konu: 'k2', metin: 'Düz bir otoyolda sabit süratle ilerleyen otomobilin sürat göstergesi şekildeki gibidir.', sekil: fGosterge(90, 38), yan: true, kok: 'Otomobil bu süratle 4 dakikada kaç m yol alır?', siklar: ['100', '360', '1500', '6000', '21 600'], k: 3, cevap: 'D', cozum: 'Gösterge 90 km/h değerindedir: $\\tfrac{90\\,000\\ \\text{m}}{3600\\ \\text{s}} = 25$ m/s. 4 dakika $= 240$ s olduğundan yol $= 25 \\times 240 = 6000$ m.' },
  { konu: 'k2', metin: 'Bir öğrenci, bir cisme uygulanan kuvvet ile kuvvetin uygulanma süresini çarpıp sonucu cismin kütlesine bölerek yeni bir nicelik hesaplıyor. Kuvvet birimi için $1\\ \\text{N} = 1\\ \\text{kg}\\ \\text{m/s}^2$ eşitliği geçerlidir.', kok: 'Bu niceliğin SI birimi, aşağıdaki niceliklerden hangisinin SI birimiyle aynıdır?', siklar: ['Uzunluk', 'İvme', 'Enerji', 'Yoğunluk', 'Sürat'], cevap: 'E', cozum: '$\\tfrac{\\text{N}\\ \\text{s}}{\\text{kg}} = \\tfrac{\\text{kg}\\ \\text{m/s}^2 \\times \\text{s}}{\\text{kg}} = \\text{m/s}$. Bu, süratin SI birimidir.' },
  { konu: 'k2', metin: 'Bir öğrenci önce boş kabı, sonra içine 4 özdeş bilye koyduğu aynı kabı dijital teraziyle tartıyor. Terazinin gösterdiği değerler şekildeki gibidir.', sekil: fTerazi2(98), kok: 'Bir bilyenin kütlesi kaç kg’dır?', siklar: ['0,05', '0,5', '2', '50', '500'], cevap: 'B', cozum: 'Bilyelerin toplam kütlesi $2150 - 150 = 2000$ g. Bir bilye $2000 \\div 4 = 500$ g $= 0{,}5$ kg.' },
  { konu: 'k3', metin: 'Üç fiziksel nicelik, hem temel ya da türetilmiş hem de skaler ya da vektörel olmasına göre aşağıdaki gibi sınıflandırılmıştır.', onc: ['Kütle: temel ve skaler.', 'Kuvvet: türetilmiş ve vektörel.', 'Sıcaklık: türetilmiş ve skaler.'], kok: 'Sınıflandırmalardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5, cevap: 'C', cozum: 'Kütle temel ve skalerdir. Kuvvet türetilmiş ve vektöreldir. Sıcaklık skalerdir ama türetilmiş değil, temel niceliktir.' },
  { konu: 'k3', metin: 'Kareli düzlemde $\\vec{K}$ vektörü ile 1, 2, 3, 4 ve 5 numaralı vektörler şekildeki gibi verilmiştir.', sekil: fD9(104), kok: '$-2\\vec{K}$ vektörü, numaralı vektörlerden hangisidir?', siklar: ['1', '2', '3', '4', '5'], cevap: 'A', cozum: '$\\vec{K}$: 2 kare sağa, 1 kare aşağı. $-2\\vec{K}$ ters yönde ve 2 katıdır: 4 kare sola, 2 kare yukarı, yani 1 numaralı vektör.' },
  { konu: 'k3', metin: 'Sıfırdan farklı $\\vec{A}$, $\\vec{B}$ ve $\\vec{C}$ vektörleri arasında $\\vec{A} = 3\\vec{B}$ ve $\\vec{C} = -\\vec{B}$ ilişkileri vardır.', onc: ['$\\vec{A}$ ile $\\vec{C}$ zıt yönlüdür.', '$\\vec{A}$ ile $\\vec{C}$ zıt vektörlerdir.', '$\\vec{A} + 3\\vec{C}$ toplamı sıfır vektörüdür.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'II ve III', 'I ve III'], k: 5, cevap: 'E', cozum: 'A ile C ters yönlüdür ama büyüklükleri farklıdır: I doğru, II yanlış. $3\\vec{C} = -3\\vec{B} = -\\vec{A}$ olduğundan III doğrudur.' },
  { konu: 'k3', metin: 'Bir haber metni şöyledir: “Feribot saat 08.30’da limandan ayrıldı. Motorlarının sağladığı 20 000 N büyüklüğündeki itme kuvvetiyle hızlandı ve kuzeydoğu yönünde 30 km/h hızla ilerledi. Yolculuk boyunca hava sıcaklığı 9 °C olarak ölçüldü.”', onc: ['Metinde geçen niceliklerden yalnızca biri vektöreldir.', 'Sıcaklık bilgisi, yön belirtilmediği için eksik verilmiştir.', 'Hız bilgisinden yön çıkarılırsa geriye kalan 30 km/h değeri feribotun süratidir.'], kok: 'Bu metinle ilgili yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'I ve III', 'II ve III'], k: 5, cevap: 'B', cozum: 'Kuvvet ve hız vektöreldir: I yanlış. Sıcaklık skalerdir, yön gerektirmez: II yanlış. Hızın büyüklüğü sürattir: III doğru.' },
  { konu: 'k4', metin: 'Aynı noktaya uygulanan iki kuvvetin büyüklükleri 6 N ve 8 N’dır. Kuvvetlerin yönleri değiştirilerek farklı bileşkeler elde ediliyor.', kok: 'Bileşke kuvvetin büyüklüğü aşağıdakilerden hangisi <u>olamaz</u>?', siklar: ['2 N', '6 N', '10 N', '14 N', '16 N'], cevap: 'E', cozum: 'Bileşke en az $8 - 6 = 2$ N (zıt yönlü), en çok $8 + 6 = 14$ N (aynı yönlü) olur. 16 N bu aralığın dışındadır.' },
  { konu: 'k4', metin: 'Göldeki şişme bot iki iple aynı anda çekiliyor. Botun kuş bakışı görünümü ve iplerin bota uyguladığı $\\vec{F}_1$ ve $\\vec{F}_2$ kuvvetleri kareli düzlemde şekildeki gibidir. Bir karenin kenarı 5 N’a karşılık gelmektedir.', sekil: fBot(66), yan: true, kok: 'Bu iki kuvvetin bileşkesinin büyüklüğü kaç N’dır?', siklar: ['10', '14', '50', '70', '100'], k: 3, cevap: 'C', cozum: '$F_1 = 8 \\times 5 = 40$ N, $F_2 = 6 \\times 5 = 30$ N ve kuvvetler birbirine diktir. $R^2 = 40^2 + 30^2 = 2500$, $R = 50$ N.' },
  { konu: 'k4', metin: 'Kareli düzlemde $\\vec{A}$ ve $\\vec{B}$ vektörleri şekildeki gibidir. Karelerin kenar uzunluğu 1 birimdir.', sekil: fD14(50), yan: true, kok: '$\\vec{A} + \\vec{B}$ bileşke vektörünün büyüklüğü kaç birimdir?', siklar: ['5', '7', '9', '10', '15'], k: 3, cevap: 'A', cozum: '$\\vec{A}$: 5 sağa, 2 aşağı. $\\vec{B}$: 2 sola, 6 yukarı. Bileşke 3 sağa, 4 yukarı: $R^2 = 3^2 + 4^2$, $R = 5$ birim.' },
  { konu: 'k4', metin: 'Kareli düzlemde $\\vec{K}$, $\\vec{L}$ ve $\\vec{M}$ vektörleri şekildeki gibidir. Karelerin kenar uzunluğu 1 birimdir.', sekil: fD15(44), yan: true, onc: ['$\\vec{K} + \\vec{L} = \\vec{M}$ eşitliği doğrudur.', '$\\vec{M}$ vektörünün büyüklüğü 7 birimdir.', '$\\vec{M} - \\vec{L} = \\vec{K}$ eşitliği doğrudur.'], kok: 'Yargılardan hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 3, cevap: 'D', cozum: 'M, K’nin başlangıcından L’nin ucuna çizilmiştir: I ve III doğru. K ile L dik olduğundan $M^2 = 4^2 + 3^2$, $M = 5$ birim: II yanlış.' },
];

module.exports = {
  sinif: 9,
  kapakSekil: kapak,
  gunler, deneme,
  denemeKapsam: 'fizik bilimi ve alt dalları, nicelikler ve birimler, skaler ve vektörel nicelikler, vektörler',
  konular: [
    { id: 'k1', ad: 'Fizik bilimi ve alt dalları', paket: null },
    { id: 'k2', ad: 'Temel ve türetilmiş nicelikler, birimler', paket: 1 },
    { id: 'k3', ad: 'Skaler ve vektörel nicelikler', paket: 1 },
    { id: 'k4', ad: 'Vektörlerde toplama ve bileşenler', paket: 3 },
  ],
  paketler: [{ no: 1, not: 'Gün 2 ve Gün 3’ün konusu.' }, { no: 3, not: 'Gün 3 ve Gün 4’ün konusu.' }],
  planNot: 'Okulunda vektörlerde toplama yeni başlamış olabilir. Gün 4 bu yüzden hem tekrar hem ön hazırlık olarak hazırlandı. Trigonometri yok, bütün vektörler kareli düzlemde.',
};
