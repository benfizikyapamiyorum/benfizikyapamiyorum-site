// BFY tatil kitapçığı: gerçekçi, dolgun SVG şekil kütüphanesi.
// Her şekil S(w, h, mm, govde) ile sarılır; DEFS (degrade, gölge) otomatik eklenir.
// Kurallar: etiketler cismin ya da okun üstünden geçmez, oklar ölçekli, gölge ve hacim var.
const FONT = "'Source Sans 3', sans-serif";
const C = {
  mavi: '#2563eb', turuncu: '#ea580c', yesil: '#0f766e', mor: '#7c3aed', pembe: '#be185d', kirmizi: '#dc2626',
  gri: '#64748b', koyu: '#1d2b53', sari: '#d97706', cam: '#0891b2',
};
let UID = 0;
const uid = p => p + (++UID);

const DEFS = `<defs>
<filter id="golge" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="3.2"/><feOffset dy="3"/><feComponentTransfer><feFuncA type="linear" slope=".28"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="yumusak" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
<linearGradient id="gGok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe8fb"/><stop offset="1" stop-color="#f3faff"/></linearGradient>
<linearGradient id="gAksam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2557"/><stop offset=".6" stop-color="#5b3cc4"/><stop offset="1" stop-color="#f59e8b"/></linearGradient>
<linearGradient id="gCim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86c66a"/><stop offset=".25" stop-color="#5fa84a"/><stop offset="1" stop-color="#3f7d34"/></linearGradient>
<linearGradient id="gAsfalt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b8494"/><stop offset=".2" stop-color="#5b6473"/><stop offset="1" stop-color="#434a57"/></linearGradient>
<linearGradient id="gZemin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c7a8"/><stop offset=".2" stop-color="#c2ab85"/><stop offset="1" stop-color="#9c855f"/></linearGradient>
<linearGradient id="gBuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4fbff"/><stop offset=".3" stop-color="#d3ecf9"/><stop offset="1" stop-color="#a9d3ea"/></linearGradient>
<linearGradient id="gTahta" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2b071"/><stop offset=".5" stop-color="#c98f4b"/><stop offset="1" stop-color="#a66f31"/></linearGradient>
<linearGradient id="gTahtaUst" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f0c88f"/><stop offset="1" stop-color="#dba762"/></linearGradient>
<linearGradient id="gTahtaYan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9c6427"/><stop offset="1" stop-color="#7d4d19"/></linearGradient>
<linearGradient id="gMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset=".45" stop-color="#b6c0cf"/><stop offset=".55" stop-color="#8f9bb0"/><stop offset="1" stop-color="#cfd6e2"/></linearGradient>
<linearGradient id="gMetalD" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8edf3"/><stop offset=".5" stop-color="#9aa6b8"/><stop offset="1" stop-color="#d6dce6"/></linearGradient>
<linearGradient id="gBeton" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e5e9f0"/><stop offset=".6" stop-color="#c3cad6"/><stop offset="1" stop-color="#9ea8b8"/></linearGradient>
<linearGradient id="gKaya" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9a48a"/><stop offset=".5" stop-color="#8e7a63"/><stop offset="1" stop-color="#6a5a48"/></linearGradient>
<linearGradient id="gCam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dff4ff"/><stop offset=".5" stop-color="#9fd3f0"/><stop offset="1" stop-color="#6fb3dc"/></linearGradient>
<linearGradient id="gSu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#0284c7"/></linearGradient>
<radialGradient id="gLastik" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#4b5563"/><stop offset=".55" stop-color="#1f2937"/><stop offset="1" stop-color="#0b1220"/></radialGradient>
<radialGradient id="gJant" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#b8c2d0"/><stop offset="1" stop-color="#7c8799"/></radialGradient>
<radialGradient id="gGunes" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7c2"/><stop offset=".5" stop-color="#fde047"/><stop offset="1" stop-color="#f59e0b"/></radialGradient>
</defs>`;

const S = (w, h, mm, b) => `<svg class="sk" viewBox="0 0 ${w} ${h}" style="width:${mm}mm;max-width:100%">${DEFS}${b}</svg>`;

// Metin: beyaz hale ile, cisimlerin üstüne binmeden okunur.
const VT = '<tspan font-family="KaTeX_Math" font-style="italic" font-weight="400" font-size="118%">ϑ</tspan>';
function T(x, y, s, o = {}) {
  s = String(s).replace(/ϑ/g, VT);
  return `<text x="${x}" y="${y}" font-family="${o.font || FONT}" font-size="${o.size || 15}" font-weight="${o.w || 800}" fill="${o.c || C.koyu}" text-anchor="${o.a || 'middle'}"${o.it ? ' font-style="italic"' : ''}${o.halo === false ? '' : ` stroke="${o.hc || '#fff'}" stroke-width="${o.hw || 4.5}" paint-order="stroke" stroke-linejoin="round"`}>${s}</text>`;
}
// Etiket rozeti (beyaz hap içinde renkli yazı): kalabalık zeminlerde okunurluk için.
function ROZET(x, y, s, c = C.koyu, o = {}) {
  const size = o.size || 14, w = o.w || (String(s).replace(/<[^>]+>/g, '').length * size * 0.56 + 16), h = size + 10;
  const ax = o.a === 'start' ? x : o.a === 'end' ? x - w : x - w / 2;
  return `<g filter="url(#golge)"><rect x="${ax}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" stroke="${c}" stroke-width="1.6"/></g>` +
    T(ax + w / 2, y + size * 0.35, s, { size, c, halo: false, w: 800 });
}

// Kuvvet / hız oku: koyu kenarlı, dolgun gövde.
function OK(x1, y1, x2, y2, c = C.mavi, o = {}) {
  const w = o.w || 5, hd = o.hd || 15, a = Math.atan2(y2 - y1, x2 - x1);
  const L = Math.hypot(x2 - x1, y2 - y1); if (L < 1) return '';
  const bx = x2 - hd * Math.cos(a), by = y2 - hd * Math.sin(a), k = hd * 0.52;
  const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
  const head = `${x2},${y2} ${bx + k * Math.sin(a)},${by - k * Math.cos(a)} ${bx - k * Math.sin(a)},${by + k * Math.cos(a)}`;
  let s = '';
  if (!o.dash) s += `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="#fff" stroke-width="${w + 3.4}" stroke-linecap="round"/><polygon points="${head}" fill="#fff" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/>`;
  s += `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash}/><polygon points="${head}" fill="${c}"/>`;
  if (o.nokta) s += `<circle cx="${x1}" cy="${y1}" r="${o.nokta === true ? 4.2 : o.nokta}" fill="${C.koyu}" stroke="#fff" stroke-width="1.4"/>`;
  return s;
}
// Ölçü çizgisi (iki ucu çentikli, ortasında etiket)
function OLCU(x1, y1, x2, y2, lab, o = {}) {
  const c = o.c || C.gri, a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * 6, ny = Math.cos(a) * 6;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, d = o.d === undefined ? 14 : o.d;
  const yatay = Math.abs(Math.sin(a)) < 0.3;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.6" stroke-dasharray="${o.dash || '0'}"/>` +
    `<line x1="${x1 - nx}" y1="${y1 - ny}" x2="${x1 + nx}" y2="${y1 + ny}" stroke="${c}" stroke-width="1.8"/><line x1="${x2 - nx}" y1="${y2 - ny}" x2="${x2 + nx}" y2="${y2 + ny}" stroke="${c}" stroke-width="1.8"/>` +
    (lab ? T(yatay ? mx : mx + (o.yan === 'sol' ? -d : d), yatay ? my + (o.ust ? -8 : d + 6) : my + 5, lab, { size: o.size || 14, c: o.tc || '#334155', a: yatay ? 'middle' : (o.yan === 'sol' ? 'end' : 'start'), w: 700 }) : '');
}
// Açı yayı: (cx,cy) merkez, a1→a2 derece (matematiksel yön, 0 = sağ, saat tersine artı)
function ACI(cx, cy, r, a1, a2, lab, o = {}) {
  const rad = d => d * Math.PI / 180, c = o.c || C.gri;
  const x1 = cx + r * Math.cos(rad(a1)), y1 = cy - r * Math.sin(rad(a1)), x2 = cx + r * Math.cos(rad(a2)), y2 = cy - r * Math.sin(rad(a2));
  const am = rad((a1 + a2) / 2), lr = r + (o.lr || 16);
  return `<path d="M ${x1} ${y1} A ${r} ${r} 0 0 ${a2 > a1 ? 0 : 1} ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="1.8"/>` +
    (lab ? T(cx + lr * Math.cos(am), cy - lr * Math.sin(am) + 5, lab, { size: o.size || 14, c: o.tc || '#334155', w: 700 }) : '');
}

// ---------- Zemin ve çevre ----------
// tur: 'cim' | 'asfalt' | 'zemin' (toprak/laboratuvar) | 'buz' | 'masa'
function ZEMIN(x1, x2, y, o = {}) {
  const tur = o.tur || 'zemin', h = o.h || 26, id = { cim: 'gCim', asfalt: 'gAsfalt', zemin: 'gZemin', buz: 'gBuz', masa: 'gTahta' }[tur];
  let s = `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="${h}" fill="url(#${id})"/><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="rgba(15,23,42,.35)" stroke-width="1.4"/>`;
  if (tur === 'cim') for (let x = x1 + 6; x < x2 - 4; x += 11) s += `<path d="M ${x} ${y + 1} l 2 -6 l 2 6" fill="#6fb656" opacity=".9"/>`;
  if (tur === 'asfalt') for (let x = x1 + 18; x < x2 - 30; x += 64) s += `<rect x="${x}" y="${y + h * 0.52}" width="30" height="3" rx="1.5" fill="#f8fafc" opacity=".8"/>`;
  if (tur === 'zemin') for (let x = x1 + 9; x < x2 - 4; x += 23) s += `<circle cx="${x}" cy="${y + 9 + (x * 7 % 9)}" r="1.3" fill="#7d6a48" opacity=".5"/>`;
  if (tur === 'buz') for (let x = x1 + 20; x < x2 - 30; x += 70) s += `<path d="M ${x} ${y + 6} l 26 0" stroke="#fff" stroke-width="2" opacity=".9" stroke-linecap="round"/>`;
  return s;
}
const GOK = (w, h, o = {}) => `<rect x="0" y="0" width="${w}" height="${h}" rx="${o.rx === undefined ? 10 : o.rx}" fill="url(#${o.aksam ? 'gAksam' : 'gGok'})"/>`;
const BULUT = (x, y, k = 1) => `<g opacity=".95" transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="0" rx="26" ry="11" fill="#fff"/><ellipse cx="-16" cy="-7" rx="14" ry="10" fill="#fff"/><ellipse cx="8" cy="-11" rx="17" ry="13" fill="#fff"/><ellipse cx="24" cy="-3" rx="12" ry="8" fill="#fff"/></g>`;
const GUNES = (x, y, r = 20) => `<circle cx="${x}" cy="${y}" r="${r * 1.7}" fill="#fde68a" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gGunes)"/>`;
function AGAC(x, y, k = 1) {
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="2" cy="1" rx="20" ry="4" fill="#0f172a" opacity=".18"/><rect x="-4" y="-34" width="8" height="35" rx="2" fill="#7c5a3a"/><circle cx="0" cy="-50" r="21" fill="#3f8f45"/><circle cx="-14" cy="-40" r="14" fill="#4aa24f"/><circle cx="14" cy="-40" r="14" fill="#357c3b"/><circle cx="-5" cy="-58" r="10" fill="#62b866" opacity=".8"/></g>`;
}
// Bina: (x, y) sol alt köşe. Pencereli, yan yüzü gölgeli.
function BINA(x, y, w, h, o = {}) {
  const kat = o.kat || Math.max(2, Math.round(h / 34)), sut = o.sutun || Math.max(2, Math.round(w / 26));
  let s = `<polygon points="${x + w},${y} ${x + w + 12},${y - 8} ${x + w + 12},${y - h - 8} ${x + w},${y - h}" fill="#8f9bb0"/><polygon points="${x},${y - h} ${x + 12},${y - h - 8} ${x + w + 12},${y - h - 8} ${x + w},${y - h}" fill="#dfe5ee"/>`;
  s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="url(#gBeton)" stroke="#7b8799" stroke-width="1.2"/>`;
  const pw = (w - 12) / sut, ph = (h - 12) / kat;
  for (let i = 0; i < sut; i++) for (let j = 0; j < kat; j++) s += `<rect x="${x + 8 + i * pw}" y="${y - h + 8 + j * ph}" width="${pw - 6}" height="${ph - 8}" rx="1.5" fill="url(#gCam)" stroke="#5f7d99" stroke-width=".8"/>`;
  return s;
}
// Uçurum / platform: sol tarafta yükselti. (x, y) üst sağ köşe (kenar), w genişlik, h yükseklik.
function UCURUM(x, y, w, h) {
  return `<path d="M ${x - w} ${y} L ${x} ${y} L ${x + 5} ${y + h * 0.3} L ${x - 3} ${y + h * 0.62} L ${x + 4} ${y + h} L ${x - w} ${y + h} Z" fill="url(#gKaya)" stroke="#5b4c3c" stroke-width="1.4"/>` +
    `<path d="M ${x - w} ${y} L ${x} ${y} L ${x - 2} ${y + 7} L ${x - w} ${y + 7} Z" fill="#5fa84a"/>` +
    `<path d="M ${x - w * 0.6} ${y + h * 0.3} l 14 10 M ${x - w * 0.3} ${y + h * 0.6} l -12 12 M ${x - w * 0.75} ${y + h * 0.7} l 10 6" stroke="#5b4c3c" stroke-width="1.2" opacity=".5" fill="none"/>`;
}

// ---------- Cisimler ----------
// 3B sandık / blok: (x, y) ön yüzün sol üst köşesi. renk: 'tahta' | hex
function KUTU(x, y, w, h, o = {}) {
  const d = o.d === undefined ? 10 : o.d, lab = o.lab;
  const tahta = !o.renk || o.renk === 'tahta';
  const on = tahta ? 'url(#gTahta)' : o.renk, ust = tahta ? 'url(#gTahtaUst)' : shade(o.renk, 0.35), yan = tahta ? 'url(#gTahtaYan)' : shade(o.renk, -0.25);
  let s = o.golge === false ? '' : `<ellipse cx="${x + w / 2 + d / 2}" cy="${y + h + 2}" rx="${w * 0.58}" ry="5" fill="#0f172a" opacity=".2" filter="url(#yumusak)"/>`;
  s += `<polygon points="${x},${y} ${x + d},${y - d * 0.7} ${x + w + d},${y - d * 0.7} ${x + w},${y}" fill="${ust}" stroke="rgba(15,23,42,.45)" stroke-width="1"/>`;
  s += `<polygon points="${x + w},${y} ${x + w + d},${y - d * 0.7} ${x + w + d},${y + h - d * 0.7} ${x + w},${y + h}" fill="${yan}" stroke="rgba(15,23,42,.45)" stroke-width="1"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${on}" stroke="rgba(15,23,42,.55)" stroke-width="1.2"/>`;
  if (tahta) s += `<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="1.5" fill="none" stroke="#8a5a24" stroke-width="1.4" opacity=".7"/><line x1="${x + 4}" y1="${y + 4}" x2="${x + w - 4}" y2="${y + h - 4}" stroke="#8a5a24" stroke-width="1.2" opacity=".35"/>`;
  else s += `<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h * 0.3}" rx="2" fill="#fff" opacity=".18"/>`;
  if (lab) s += `<rect x="${x + w / 2 - (o.lw || 24)}" y="${y + h / 2 - 11}" width="${(o.lw || 24) * 2}" height="22" rx="5" fill="#fff" opacity=".93"/>` + T(x + w / 2, y + h / 2 + 5.5, lab, { size: o.size || 15, halo: false });
  return s;
}
function shade(hex, p) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(p > 0 ? v + (255 - v) * p : v * (1 + p))));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}
// Küre / top: parlak noktalı
function TOP(x, y, r, c = '#ef4444', o = {}) {
  const id = uid('tp');
  return `<defs><radialGradient id="${id}" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="${shade(c, 0.75)}"/><stop offset=".35" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.5)}"/></radialGradient></defs>` +
    (o.golge ? `<ellipse cx="${x}" cy="${o.golge}" rx="${r * 0.95}" ry="${Math.max(2, r * 0.22)}" fill="#0f172a" opacity=".22" filter="url(#yumusak)"/>` : '') +
    `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})" stroke="rgba(15,23,42,.45)" stroke-width="1"/>` +
    (o.hayalet ? '' : `<ellipse cx="${x - r * 0.32}" cy="${y - r * 0.4}" rx="${r * 0.26}" ry="${r * 0.16}" fill="#fff" opacity=".7" transform="rotate(-30 ${x - r * 0.32} ${y - r * 0.4})"/>`);
}
// Hareket izi: soluk kopyalar
const HAYALET = (x, y, r, c, op = 0.35) => `<g opacity="${op}">${TOP(x, y, r, c, { hayalet: true })}</g>`;
// Basketbol / futbol topu deseni isteğe bağlı: tur 'basket'
function BASKET(x, y, r, o = {}) {
  return TOP(x, y, r, '#e8731c', o) + `<g fill="none" stroke="#3b1d07" stroke-width="${Math.max(1, r * 0.09)}" opacity=".8"><path d="M ${x - r} ${y} H ${x + r}"/><path d="M ${x} ${y - r} V ${y + r}"/><path d="M ${x - r * 0.72} ${y - r * 0.7} Q ${x - r * 0.2} ${y} ${x - r * 0.72} ${y + r * 0.7}"/><path d="M ${x + r * 0.72} ${y - r * 0.7} Q ${x + r * 0.2} ${y} ${x + r * 0.72} ${y + r * 0.7}"/></g>`;
}
// Otomobil: (x, y) = ön-arka ortası, tekerleklerin yere değdiği seviye. yon: 1 sağa bakar, -1 sola. Boy ≈ 120k px.
function ARABA(x, y, o = {}) {
  const k = o.k || 1, c = o.renk || '#2563eb', yon = o.yon || 1, id = uid('ar');
  return `<g transform="translate(${x} ${y}) scale(${k * yon} ${k})">
<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c, 0.45)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.35)}"/></linearGradient></defs>
<ellipse cx="0" cy="1" rx="62" ry="5" fill="#0f172a" opacity=".25" filter="url(#yumusak)"/>
<path d="M -58 -12 Q -60 -26 -46 -28 L -30 -30 Q -18 -48 4 -48 L 20 -48 Q 34 -47 44 -30 L 54 -27 Q 61 -24 60 -12 Q 60 -8 54 -8 L -54 -8 Q -58 -8 -58 -12 Z" fill="url(#${id})" stroke="rgba(15,23,42,.6)" stroke-width="1.2"/>
<path d="M -24 -30 Q -15 -43 2 -43 L 6 -43 L 6 -30 Z" fill="url(#gCam)" stroke="#31506b" stroke-width=".9"/>
<path d="M 11 -43 L 20 -43 Q 30 -42 37 -30 L 11 -30 Z" fill="url(#gCam)" stroke="#31506b" stroke-width=".9"/>
<rect x="-52" y="-16" width="108" height="2.4" rx="1.2" fill="#fff" opacity=".25"/>
<rect x="53" y="-24" width="6" height="5" rx="2" fill="#fde68a" stroke="#b45309" stroke-width=".6"/><rect x="-59" y="-24" width="4" height="6" rx="2" fill="#ef4444"/>
<g><circle cx="-34" cy="-9" r="11" fill="url(#gLastik)"/><circle cx="-34" cy="-9" r="5.6" fill="url(#gJant)"/><circle cx="36" cy="-9" r="11" fill="url(#gLastik)"/><circle cx="36" cy="-9" r="5.6" fill="url(#gJant)"/></g>
</g>`;
}
// Kamyonet / servis yerine yük arabası (el arabası değil): market arabası tarzı sade platform araba
function PLATFORM_ARABA(x, y, w, o = {}) {
  const h = o.h || 12;
  return `<ellipse cx="${x + w / 2}" cy="${y + 1}" rx="${w * 0.55}" ry="4" fill="#0f172a" opacity=".22" filter="url(#yumusak)"/>` +
    `<rect x="${x}" y="${y - 16 - h}" width="${w}" height="${h}" rx="3" fill="url(#gMetal)" stroke="#475569" stroke-width="1.2"/>` +
    [x + w * 0.2, x + w * 0.8].map(cx => `<circle cx="${cx}" cy="${y - 8}" r="8" fill="url(#gLastik)"/><circle cx="${cx}" cy="${y - 8}" r="3.6" fill="url(#gJant)"/>`).join('');
}
// İnsan figürü (sade, dolgun siluet): (x, y) ayak tabanı ortası, boy ≈ 86k px. Kollar: 'serbest' | 'it' (öne uzanmış)
function INSAN(x, y, o = {}) {
  const k = o.k || 1, c = o.renk || '#2563eb', yon = o.yon || 1, ten = '#f2c29b';
  const kol = o.kol === 'it' ? `<path d="M 3 -62 L 24 -56" stroke="${ten}" stroke-width="6.5" stroke-linecap="round"/><path d="M 1 -60 L 24 -50" stroke="${shade(c, -0.15)}" stroke-width="7" stroke-linecap="round" opacity="0"/>` : `<path d="M 8 -62 L 12 -40" stroke="${ten}" stroke-width="6" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${k * yon} ${k})"><ellipse cx="0" cy="0" rx="16" ry="3.5" fill="#0f172a" opacity=".22"/>
<path d="M -5 -36 L -7 -2" stroke="#1e293b" stroke-width="8" stroke-linecap="round"/><path d="M 4 -36 L ${o.kol === 'it' ? 12 : 6} -2" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
<rect x="-10" y="-66" width="20" height="33" rx="8" fill="${c}"/><rect x="-10" y="-66" width="20" height="10" rx="5" fill="#fff" opacity=".15"/>
${kol}<circle cx="0" cy="-76" r="9.5" fill="${ten}"/><path d="M -9.5 -78 Q -8 -88 1 -87 Q 10 -86 9.5 -77 Q 4 -82 -9.5 -78 Z" fill="#3b2a1e"/></g>`;
}
// Eğik düzlem: (x, y) dik köşe (sol alt ya da sağ alt), taban b, yükseklik h. yon: 'sag' → tepe solda, eğim sağa iner.
function EGIK(x, y, b, h, o = {}) {
  const sag = (o.yon || 'sag') === 'sag';
  const p = sag ? `${x},${y - h} ${x},${y} ${x + b},${y}` : `${x},${y - h} ${x},${y} ${x - b},${y}`;
  return `<polygon points="${p}" fill="url(#gTahta)" stroke="#6b4a22" stroke-width="1.6"/>` +
    `<polygon points="${p}" fill="none" stroke="#fff" stroke-width="1" opacity=".25" transform="translate(${sag ? 3 : -3} -2)"/>`;
}
// İp
const IP = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#5b4636" stroke-width="3.2" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d7b98e" stroke-width="1.2" stroke-dasharray="3 3"/>`;
// Makara: merkez (x, y)
const MAKARA = (x, y, r = 14) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gMetalD)" stroke="#475569" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="none" stroke="#64748b" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r * 0.2}" fill="#334155"/>`;
// Tavan / duvar taraması
const TAVAN = (x1, x2, y) => `<rect x="${x1}" y="${y - 12}" width="${x2 - x1}" height="12" fill="url(#gBeton)" stroke="#64748b" stroke-width="1.2"/>` + Array.from({ length: Math.floor((x2 - x1) / 12) }, (_, i) => `<line x1="${x1 + 4 + i * 12}" y1="${y - 1}" x2="${x1 + 10 + i * 12}" y2="${y - 11}" stroke="#94a3b8" stroke-width="1.2"/>`).join('');
// Yay (sarmal): yatay ya da dikey
function YAY(x1, y1, x2, y2, n = 8, amp = 7) {
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux;
  let d = `M ${x1} ${y1} L ${x1 + ux * 8} ${y1 + uy * 8}`; const seg = (L - 16) / (n * 2);
  for (let i = 0; i < n * 2; i++) { const t = 8 + seg * (i + 0.5), s = i % 2 ? -1 : 1; d += ` L ${x1 + ux * t + nx * amp * s} ${y1 + uy * t + ny * amp * s}`; }
  d += ` L ${x2 - ux * 8} ${y2 - uy * 8} L ${x2} ${y2}`;
  return `<path d="${d}" fill="none" stroke="#475569" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-linejoin="round"/>`;
}
// Kronometre
function KRONOMETRE(x, y, r = 24, yazi = '') {
  return `<g filter="url(#golge)"><rect x="${x - 5}" y="${y - r - 9}" width="10" height="8" rx="2" fill="#475569"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gMetalD)" stroke="#334155" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="${r * 0.8}" fill="#fff" stroke="#94a3b8" stroke-width="1"/></g>` +
    Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${x + Math.sin(a) * r * 0.68}" y1="${y - Math.cos(a) * r * 0.68}" x2="${x + Math.sin(a) * r * 0.78}" y2="${y - Math.cos(a) * r * 0.78}" stroke="#475569" stroke-width="1.3"/>`; }).join('') +
    `<line x1="${x}" y1="${y}" x2="${x + r * 0.42}" y2="${y - r * 0.42}" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="2.4" fill="#1d2b53"/>` + (yazi ? T(x, y + r + 18, yazi, { size: 13, w: 700, c: '#334155' }) : '');
}
// Cetvel: (x, y) sol üst, uzunluk L px, n bölme
function CETVEL(x, y, L, n = 10, o = {}) {
  let s = `<g filter="url(#golge)"><rect x="${x}" y="${y}" width="${L}" height="22" rx="3" fill="#fde68a" stroke="#b45309" stroke-width="1.2"/></g>`;
  for (let i = 0; i <= n; i++) { const px = x + 6 + (L - 12) * i / n; s += `<line x1="${px}" y1="${y}" x2="${px}" y2="${y + (i % 5 ? 6 : 10)}" stroke="#78350f" stroke-width="1.1"/>`; if (o.sayi !== false && i % (o.adim || 1) === 0) s += T(px, y + 19, i * (o.kat || 1), { size: 8.5, w: 700, c: '#78350f', halo: false }); }
  return s;
}
// Dijital terazi: (x, y) üst tabla ortası
function TERAZI(x, y, deger) {
  return `<g filter="url(#golge)"><rect x="${x - 44}" y="${y}" width="88" height="7" rx="3" fill="url(#gMetal)" stroke="#475569" stroke-width="1"/><path d="M ${x - 50} ${y + 7} H ${x + 50} L ${x + 56} ${y + 40} H ${x - 56} Z" fill="#334155" stroke="#0f172a" stroke-width="1"/><rect x="${x - 30}" y="${y + 15}" width="60" height="18" rx="3" fill="#0b1220" stroke="#64748b" stroke-width="1"/></g>` + T(x, y + 29, deger, { size: 13, c: '#4ade80', halo: false, w: 700, font: 'monospace' });
}
// Dinamometre (el kantarı): (x, y) üst halka, alt kanca y + 90
function DINAMOMETRE(x, y, deger = '') {
  return `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="#475569" stroke-width="2.6"/><g filter="url(#golge)"><rect x="${x - 11}" y="${y + 6}" width="22" height="62" rx="5" fill="url(#gMetalD)" stroke="#475569" stroke-width="1.2"/></g><rect x="${x - 6}" y="${y + 12}" width="12" height="50" rx="2" fill="#fff" stroke="#94a3b8" stroke-width=".8"/>` +
    Array.from({ length: 6 }, (_, i) => `<line x1="${x - 6}" y1="${y + 16 + i * 9}" x2="${x}" y2="${y + 16 + i * 9}" stroke="#475569" stroke-width="1"/>`).join('') + `<rect x="${x - 6}" y="${y + 40}" width="12" height="2.6" fill="#dc2626"/>` +
    `<path d="M ${x} ${y + 68} V ${y + 80} q 0 8 -6 8" fill="none" stroke="#475569" stroke-width="2.6" stroke-linecap="round"/>` + (deger ? T(x + 18, y + 44, deger, { size: 13, a: 'start', w: 700, c: '#334155' }) : '');
}
// Sahne çerçevesi: yuvarlak köşeli kart, gökyüzü + zemin. Dönen: { b, yerY }
function SAHNE(w, h, o = {}) {
  const yerY = h - (o.zh || 30), id = uid('cl');
  const b = `<clipPath id="${id}"><rect x="0" y="0" width="${w}" height="${h}" rx="12"/></clipPath><g clip-path="url(#${id})">${GOK(w, h, { rx: 0, aksam: o.aksam })}${o.arka || ''}${ZEMIN(0, w, yerY, { tur: o.tur || 'cim', h: h - yerY })}</g>`;
  const cerceve = `<rect x=".75" y=".75" width="${w - 1.5}" height="${h - 1.5}" rx="12" fill="none" stroke="#b8c4d6" stroke-width="1.5"/>`;
  return { b, yerY, cerceve };
}
// Kareli zemin (vektör soruları): cols×rows, s px. Dönen: { b, X, Y, W, H }
function KARELI(cols, rows, s = 28, o = {}) {
  const P = o.pad === undefined ? 14 : o.pad, W = cols * s, H = rows * s, X = x => P + x * s, Y = y => P + H - y * s;
  let b = `<g filter="url(#golge)"><rect x="${P}" y="${P}" width="${W}" height="${H}" rx="3" fill="#fffef8"/></g>`;
  for (let i = 0; i <= cols; i++) b += `<line x1="${X(i)}" y1="${P}" x2="${X(i)}" y2="${P + H}" stroke="${i % 5 ? '#d6e0ee' : '#b9c7dc'}" stroke-width="${i % 5 ? 0.9 : 1.2}"/>`;
  for (let j = 0; j <= rows; j++) b += `<line x1="${P}" y1="${Y(j)}" x2="${P + W}" y2="${Y(j)}" stroke="${j % 5 ? '#d6e0ee' : '#b9c7dc'}" stroke-width="${j % 5 ? 0.9 : 1.2}"/>`;
  b += `<rect x="${P}" y="${P}" width="${W}" height="${H}" rx="3" fill="none" stroke="#94a3b8" stroke-width="1.2"/>`;
  return { b, X, Y, W: W + 2 * P, H: H + 2 * P, s };
}
// Grafik (x-t, ϑ-t, a-t, F-x): eksen etiketi yatay eksenin sağ ucunda, yanında. Alan dolgusu degrade.
// f = { xmax, ymin, ymax, dx, dy, sx, sy, xlab, ylab, cizgi:[{pts,c,lab,lx,ly,la}], alan:[{pts,c}], kesik:[[x,y]], nokta:[[x,y,c]], notes:[{x,y,s,c,a,size}], mm }
function GRAFIK(f) {
  const sx = f.sx || 40, sy = f.sy || 10, L = 54, Tp = 30, R = 78, B = 30, ymin = f.ymin || 0;
  const W = f.xmax * sx, H = (f.ymax - ymin) * sy, X = t => L + t * sx, Y = y => Tp + (f.ymax - y) * sy;
  let b = `<rect x="${L}" y="${Tp}" width="${W}" height="${H}" fill="#fbfdff"/>`;
  for (let t = f.dx; t <= f.xmax + 1e-9; t += f.dx) b += `<line x1="${X(t)}" y1="${Tp}" x2="${X(t)}" y2="${Tp + H}" stroke="#dbe4f0" stroke-width="1"/>` + (f.xsayi === false ? '' : T(X(t), (ymin < 0 ? Tp + H : Y(0)) + 17, String(+t.toFixed(2)).replace('.', ','), { size: 12.5, w: 600, c: '#475569', hw: 3 }));
  for (let y = Math.ceil(ymin / f.dy) * f.dy; y <= f.ymax + 1e-9; y += f.dy) { if (Math.abs(y) < 1e-9) continue; b += `<line x1="${L}" y1="${Y(y)}" x2="${L + W}" y2="${Y(y)}" stroke="#dbe4f0" stroke-width="1"/>` + (f.ysayi === false ? '' : T(L - 8, Y(y) + 4.5, String(+y.toFixed(2)).replace('.', ',').replace('-', '−'), { size: 12.5, w: 600, c: '#475569', a: 'end', halo: false })); }
  b += T(L - 8, Y(0) + 4.5, '0', { size: 12.5, w: 600, c: '#475569', a: 'end', halo: false });
  (f.alan || []).forEach(a => {
    const id = uid('al'), c = a.c || C.mavi, p = a.pts.map(([t, y]) => `${X(t)},${Y(y)}`).join(' ');
    b += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".42"/><stop offset="1" stop-color="${c}" stop-opacity=".1"/></linearGradient></defs><polygon points="${X(a.pts[0][0])},${Y(0)} ${p} ${X(a.pts[a.pts.length - 1][0])},${Y(0)}" fill="url(#${id})"/>`;
  });
  (f.kesik || []).forEach(([t, y]) => { b += `<line x1="${X(t)}" y1="${Y(y)}" x2="${X(t)}" y2="${Y(0)}" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="4 4"/><line x1="${L}" y1="${Y(y)}" x2="${X(t)}" y2="${Y(y)}" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="4 4"/>`; });
  const ax = (x1, y1, x2, y2) => OK(x1, y1, x2, y2, C.koyu, { w: 2, hd: 10, dash: null }).replace(/<line[^>]*stroke="#fff"[^>]*\/><polygon[^>]*stroke="#fff"[^>]*\/>/, '');
  b += ax(L, Tp + H + (ymin < 0 ? 0 : 5), L, Tp - 18) + ax(L - 4, Y(0), L + W + 22, Y(0));
  b += T(L + 8, Tp - 12, f.ylab, { size: 14, a: 'start' }) + T(L + W + 28, Y(0) + 5, f.xlab, { size: 14, a: 'start' });
  (f.cizgi || []).forEach(c => {
    b += `<polyline points="${c.pts.map(([t, y]) => `${X(t)},${Y(y)}`).join(' ')}" fill="none" stroke="#fff" stroke-width="${(c.w || 3.6) + 3}" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${c.pts.map(([t, y]) => `${X(t)},${Y(y)}`).join(' ')}" fill="none" stroke="${c.c || C.mavi}" stroke-width="${c.w || 3.6}" stroke-linejoin="round" stroke-linecap="round"${c.dash ? ` stroke-dasharray="${c.dash}"` : ''}/>`;
    if (c.lab) b += T(X(c.lx), Y(c.ly), c.lab, { c: c.c || C.mavi, size: c.size || 15, a: c.la || 'middle' });
  });
  (f.nokta || []).forEach(([t, y, c]) => { b += `<circle cx="${X(t)}" cy="${Y(y)}" r="4.6" fill="${c || C.koyu}" stroke="#fff" stroke-width="1.6"/>`; });
  (f.notes || []).forEach(n => { b += T(X(n.x), Y(n.y), n.s, { c: n.c || '#334155', size: n.size || 13, w: n.w || 700, a: n.a || 'middle' }); });
  const vw = L + W + R, vh = Tp + H + B;
  return `<svg class="sk" viewBox="0 0 ${vw} ${vh}" style="width:${f.mm || vw * 0.24}mm;max-width:100%">${DEFS}${b}</svg>`;
}

module.exports = { C, DEFS, S, T, ROZET, OK, OLCU, ACI, ZEMIN, GOK, BULUT, GUNES, AGAC, BINA, UCURUM, KUTU, TOP, HAYALET, BASKET, ARABA, PLATFORM_ARABA, INSAN, EGIK, IP, MAKARA, TAVAN, YAY, KRONOMETRE, CETVEL, TERAZI, DINAMOMETRE, SAHNE, KARELI, GRAFIK, shade, FONT };
