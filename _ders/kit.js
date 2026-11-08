// BFY ders sunumu yapı taşları. Her fonksiyon bir slayt (<section>) HTML'i döndürür.
// Parmakla dokunuş -> sıradaki .adim açılır; Apple Pencil -> üstüne yazar (motor.js).
'use strict';

const esc = s => String(s);
// sayılar ve birimler satır sonunda bölünmesin: 3 600 000 J, 2 kW, 5 h
const ns = (t) => t == null ? t : String(t).replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u00a0').replace(/(\d) (?=(?:kWh|kW|MJ|kN|kg|TL|W|J|N|m|s|h)(?![A-Za-zçğıöşüÇĞİÖŞÜ]))/g, '$1\u00a0').replace(/ ([×=+−\/·]) /g, '\u00a0$1 ');           // içerik bilerek HTML olarak yazılır (<sub>, <b>, SVG...)
const P = (t) => t ? `<p>${ns(t)}</p>` : '';

let SORU_NO = 0, DERS_ADI = '';
function basla(dersAdi) { SORU_NO = 0; DERS_ADI = dersAdi; }

const alt = (sag) => `<div class="alt"><span>Ben Fizik Yapamıyorum, ${DERS_ADI}</span><span>${sag || 'benfizikyapamiyorum.com'}</span></div>`;

// Açılış slaytı (koyu zemin)
function kapak({ etiket = '', baslik, vurgu = '', aciklama = '' }) {
  return `<section class="sl kapak">${etiket ? `<span class="etk">${etiket}</span>` : ''}
<h1>${baslik}${vurgu ? `<br><em>${vurgu}</em>` : ''}</h1>${P(aciklama)}
<div class="alt"><span>Ben Fizik Yapamıyorum, Timur YILDIRIM</span><span>benfizikyapamiyorum.com</span></div></section>`;
}

// Bölüm arası (açık zemin, büyük başlık)
function bolum({ etiket = 'BÖLÜM', baslik, aciklama = '' }) {
  return `<section class="sl bolum"><span class="etk A buyuk">${etiket}</span><h2>${baslik}</h2>${P(aciklama)}${alt()}</section>`;
}

// Konu anlatımı: maddeler tek tek açılır. formul: madde gibi açılan vurgulu kutu.
// maddeler: ['metin', {metin, vurgu:'F1,F2'}, {formul:'v = Δx / Δt', aciklama:'...'}]
function konu({ etiket = 'KONU', kod = '', baslik, giris = '', maddeler = [], sekil = '' }) {
  const m = maddeler.map(x => {
    if (typeof x === 'string') return `<div class="nokta adim">${ns(x)}</div>`;
    if (x.formul) return `<div class="formul adim"${x.vurgu ? ` data-vurgu="${x.vurgu}"` : ''}><div class="f">${ns(x.formul)}</div>${x.aciklama ? `<div class="fa">${ns(x.aciklama)}</div>` : ''}</div>`;
    return `<div class="nokta adim"${x.vurgu ? ` data-vurgu="${x.vurgu}"` : ''}>${ns(x.metin)}</div>`;
  }).join('');
  const sol = `<div class="sol mad">${giris ? `<p class="ac">${giris}</p>` : ''}${m}</div>`;
  const sag = sekil ? `<div class="sag"><div class="sekil">${sekil}</div></div>` : '';
  return `<section class="sl konu"><div class="ust"><span class="etk A">${etiket}</span>${kod ? `<span class="kod">${kod}</span>` : ''}</div><h2>${baslik}</h2><div class="gov">${sol}${sag}</div>${alt(baslik)}</section>`;
}

// Soru: bağlam + (tablo) + (şekil) + maddeler. Her maddenin çözümü adım adım açılır.
// maddeler: [{metin, puan:'4 puan', adimlar:['1. adım...', {metin, vurgu:'R'}], cevap:'R = 5 N'}]
// tablo: {basliklar:['No','Durum','Cevap'], satirlar:[['1','...','Mekanik']], doldur:0}
//        doldur = satır cevaplarını hangi maddenin çözümünde açılacağı (madde sırası, 0'dan)
function soru({ etiket = 'SORU', etiketRenk = 'A', kod = '', baslik, baglam = '', tablo = null, sekil = '', maddeler = [], yatay = false }) {
  SORU_NO++;
  let tb = '';
  if (tablo) {
    const son = tablo.basliklar.length - 1;
    tb = `<table class="bt"><thead><tr>${tablo.basliklar.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>` +
      tablo.satirlar.map(r => tablo.doldur !== undefined
        ? `<tr class="adim satir">${r.map((c, i) => i === son ? `<td class="dolhucre"><span class="dol">${c}</span></td>` : `<td>${c}</td>`).join('')}</tr>`
        : `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') + `</tbody></table>`;
  }
  const md = maddeler.map((m, i) => {
    const harf = 'abcdefgh'[i];
    const ad = (m.adimlar || []).map(a => typeof a === 'string'
      ? `<div class="cev adim">${ns(a)}</div>`
      : `<div class="cev adim"${a.vurgu ? ` data-vurgu="${a.vurgu}"` : ''}>${ns(a.metin)}</div>`).join('');
    const cv = m.cevap ? `<div class="cev adim son"${m.cevapVurgu ? ` data-vurgu="${m.cevapVurgu}"` : ''}>${ns(m.cevap)}</div>` : '';
    return `<div class="madde" data-m="${i}"><div class="mm">${m.puan ? `<span class="p">${m.puan}</span>` : ''}<b>${harf})</b>${ns(m.metin)}</div>${ad}${cv}</div>`;
  }).join('');
  const dold = tablo && tablo.doldur !== undefined ? ` data-dold="${tablo.doldur}"` : '';
  const sol = `<div class="sol bag">${P(baglam)}${tb}${sekil ? `<div class="sekil">${sekil}</div>` : ''}</div>`;
  const govde = yatay
    ? `${sol}</div><div class="sag mad yatay">${md}`
    : `${sol}<div class="sag mad">${md}</div>`;
  return `<section class="sl soru"${dold}><div class="ust"><span class="etk ${etiketRenk}">${etiket}</span><span class="kod">Soru ${SORU_NO}${kod ? `, ${kod}` : ''}</span></div><h2>${baslik}</h2><div class="gov">${govde}</div>${alt('Soru ' + SORU_NO)}</section>`;
}

// Kapanış (koyu zemin): abone + site çağrısı
function kapanis({ baslik = 'Bir sonraki derste görüşürüz.', vurgu = 'Abone olmayı unutma.', aciklama = 'Bu sunumun linki video açıklamasında. Konu notları ve daha fazla soru için: benfizikyapamiyorum.com' } = {}) {
  return `<section class="sl kapak"><h1>${baslik}<br><em>${vurgu}</em></h1>${P(aciklama)}
<div class="alt"><span>Ben Fizik Yapamıyorum, Timur YILDIRIM</span><span>@benfizikyapamiyorum</span></div></section>`;
}

// Vektör/ok çizimi için küçük SVG yardımcıları (şekiller elle de yazılabilir)
function ok({ x1, y1, x2, y2, renk = '#244f40', kalin = 5, ad = '', etiket = '', ex = 0, ey = 0, gizli = false }) {
  etiket = String(etiket).replace(/<sub>(.*?)<\/sub>/g, '<tspan font-size="0.68em" dy="0.32em">$1</tspan><tspan dy="-0.32em"> </tspan>');
  const id = 'u' + Math.random().toString(36).slice(2, 8);
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = 16, w = 8;
  const bx = x2 - ux * h, by = y2 - uy * h;
  const tri = `${x2},${y2} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`;
  const lbl = etiket ? `<text x="${x2 + ex}" y="${y2 + ey}" font-size="26" font-weight="800" fill="${renk}" text-anchor="middle">${etiket}</text>` : '';
  return `<g class="vek${gizli ? ' gizli' : ''}" data-ad="${ad}"><line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${renk}" stroke-width="${kalin}" stroke-linecap="round"/><polygon points="${tri}" fill="${renk}"/>${lbl}</g>`;
}
const svg = (w, h, ic) => `<svg class="vsvg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Plus Jakarta Sans,sans-serif">${ic}</svg>`;

// Kareli düzlem: tam sayı koordinatlı vektör çizimleri için.
// const g = k.kare({ x0:-1, x1:7, y0:-2, y1:5, u:56 }); g.p(3,2) -> [px,py];  k.svg(g.w, g.h, g.zemin + ...)
function kare({ x0 = 0, x1 = 6, y0 = 0, y1 = 6, u = 56, pad = 34, eksen = true }) {
  const w = (x1 - x0) * u + 2 * pad, h = (y1 - y0) * u + 2 * pad;
  const p = (x, y) => [pad + (x - x0) * u, pad + (y1 - y) * u];
  let z = `<rect x="${pad}" y="${pad}" width="${(x1 - x0) * u}" height="${(y1 - y0) * u}" fill="#fff"/>`;
  for (let x = x0; x <= x1; x++) { const [a] = p(x, 0); z += `<line x1="${a}" y1="${pad}" x2="${a}" y2="${h - pad}" stroke="#dfe6df" stroke-width="1.5"/>`; }
  for (let y = y0; y <= y1; y++) { const [, b] = p(0, y); z += `<line x1="${pad}" y1="${b}" x2="${w - pad}" y2="${b}" stroke="#dfe6df" stroke-width="1.5"/>`; }
  if (eksen && x0 <= 0 && x1 >= 0 && y0 <= 0 && y1 >= 0) {
    const [ax, ay] = p(0, 0);
    z += `<line x1="${pad}" y1="${ay}" x2="${w - pad + 14}" y2="${ay}" stroke="#6b7d76" stroke-width="2.5"/><text x="${w - pad + 8}" y="${ay - 10}" font-size="22" fill="#6b7d76" font-weight="700">x</text>`;
    z += `<line x1="${ax}" y1="${h - pad}" x2="${ax}" y2="${pad - 14}" stroke="#6b7d76" stroke-width="2.5"/><text x="${ax + 10}" y="${pad - 4}" font-size="22" fill="#6b7d76" font-weight="700">y</text>`;
  }
  // kareli düzlemde vektör: g.v({ad, from:[x,y], to:[x,y], renk, etiket, ex, ey})
  const v = ({ ad = '', from, to, renk = '#244f40', etiket = '', ex = 0, ey = 0, kalin = 5, gizli = false }) => {
    const [x1p, y1p] = p(...from), [x2p, y2p] = p(...to);
    return ok({ x1: x1p, y1: y1p, x2: x2p, y2: y2p, ad, renk, etiket, ex, ey, kalin, gizli });
  };
  // kesikli yardımcı çizgi
  const kesik = (a, b, renk = '#6b7d76', ad = '', gizli = false) => {
    const [x1p, y1p] = p(...a), [x2p, y2p] = p(...b);
    return `<g class="vek${gizli ? ' gizli' : ''}" data-ad="${ad}"><line x1="${x1p}" y1="${y1p}" x2="${x2p}" y2="${y2p}" stroke="${renk}" stroke-width="2.5" stroke-dasharray="8 7"/></g>`;
  };
  return { w, h, p, v, kesik, zemin: z };
}

// Grafik ekseni: const gr = k.grafik({x1:6, y1:40, xt:[0,2,4,6], yt:[0,10,20,30,40], xad:'Δx (m)', yad:'F (N)'})
// gr.p(x,y) -> [px,py];  gr.cizgi([[0,10],[2,10]], renk, ad, gizli);  gr.alan([[0,0],[0,10],[2,10],[2,0]], renk, ad, gizli)
function grafik({ x0 = 0, x1, y0 = 0, y1, w = 560, h = 380, pl = 70, pr = 40, pt = 30, pb = 56, xt = [], yt = [], xad = '', yad = '' }) {
  const p = (x, y) => [pl + (x - x0) / (x1 - x0) * (w - pl - pr), pt + (y1 - y) / (y1 - y0) * (h - pt - pb)];
  const [ox, oy] = p(x0, 0 >= y0 && 0 <= y1 ? 0 : y0);
  let z = `<rect x="${pl}" y="${pt}" width="${w - pl - pr}" height="${h - pt - pb}" fill="#fff"/>`;
  const ty = (y0 < 0 ? h - pb : oy) + 26; // eksen ortadaysa sayılar grafiğin altına
  xt.forEach(x => { const [a] = p(x, 0); z += `<line x1="${a}" y1="${pt}" x2="${a}" y2="${h - pb}" stroke="#e6ebe6" stroke-width="1.5"/><text x="${a}" y="${ty}" font-size="19" fill="#6b7d76" text-anchor="middle">${x}</text>`; });
  yt.forEach(y => { const [, b] = p(0, y); z += `<line x1="${pl}" y1="${b}" x2="${w - pr}" y2="${b}" stroke="#e6ebe6" stroke-width="1.5"/><text x="${pl - 10}" y="${b + 6}" font-size="19" fill="#6b7d76" text-anchor="end">${String(y).replace('-', '−')}</text>`; });
  z += `<line x1="${pl}" y1="${oy}" x2="${w - pr + 18}" y2="${oy}" stroke="#173430" stroke-width="2.5"/><polygon points="${w - pr + 22},${oy} ${w - pr + 10},${oy - 6} ${w - pr + 10},${oy + 6}" fill="#173430"/>`;
  z += `<line x1="${pl}" y1="${h - pb}" x2="${pl}" y2="${pt - 18}" stroke="#173430" stroke-width="2.5"/><polygon points="${pl},${pt - 22} ${pl - 6},${pt - 10} ${pl + 6},${pt - 10}" fill="#173430"/>`;
  z += `<text x="${w - pr + 20}" y="${ty + 27}" font-size="20" font-weight="700" fill="#173430" text-anchor="end">${xad}</text><text x="${pl + 10}" y="${pt - 6}" font-size="20" font-weight="700" fill="#173430">${yad}</text>`;
  const cizgi = (pts, renk = '#b06a3b', ad = '', gizli = false, kalin = 4.5) =>
    `<g class="vek${gizli ? ' gizli' : ''}" data-ad="${ad}"><polyline points="${pts.map(q => p(...q).join(',')).join(' ')}" fill="none" stroke="${renk}" stroke-width="${kalin}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const egri = (f, a, b, renk = '#b06a3b', ad = '', gizli = false) => {
    const pts = []; for (let i = 0; i <= 60; i++) { const x = a + (b - a) * i / 60; pts.push([x, f(x)]); } return cizgi(pts, renk, ad, gizli);
  };
  const alan = (pts, renk = '#e9a774', ad = '', gizli = false, yazi = '') => {
    const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length, cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
    const [tx, ty] = p(cx, cy);
    return `<g class="vek${gizli ? ' gizli' : ''}" data-ad="${ad}"><polygon points="${pts.map(q => p(...q).join(',')).join(' ')}" fill="${renk}" fill-opacity=".45" stroke="${renk}" stroke-width="2"/>${yazi ? `<text x="${tx}" y="${ty + 8}" font-size="22" font-weight="800" fill="#173430" text-anchor="middle">${yazi}</text>` : ''}</g>`;
  };
  const yazi = (x, y, t, renk = '#173430', ad = '', gizli = false, boy = 20) => { const [a, b] = p(x, y); return `<g class="vek${gizli ? ' gizli' : ''}" data-ad="${ad}"><text x="${a}" y="${b}" font-size="${boy}" font-weight="700" fill="${renk}" text-anchor="middle">${t}</text></g>`; };
  return { w, h, p, cizgi, egri, alan, yazi, zemin: z };
}

// Serbest cisim diyagramı için kutu (cisim). Merkezi [cx,cy].
const kutu = (cx, cy, s = 70, yazi = '') => `<rect x="${cx - s / 2}" y="${cy - s / 2}" width="${s}" height="${s}" rx="8" fill="#e9a774" stroke="#b06a3b" stroke-width="3"/>${yazi ? `<text x="${cx}" y="${cy + 9}" font-size="26" font-weight="800" fill="#173430" text-anchor="middle">${yazi}</text>` : ''}`;

// vektör adı üstünde ok: k.V('C') ya da k.V('C<sub>x</sub>')
const V = (t) => `<span class="vk">${t}</span>`;

module.exports = { V, basla, kapak, bolum, konu, soru, kapanis, ok, svg, kare, kutu, grafik };
