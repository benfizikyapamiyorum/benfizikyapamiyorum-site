// BFY haftalık ücretsiz fizik notu üreticisi: ortak parçalar
// Kullanım: node build.js notlar/9-02.js  → out/<slug>/ altında PDF, webp kapak, Instagram slaytları, açıklama
const fs = require('fs');
const path = require('path');
const katex = require('katex');

const NM = p => 'file://' + path.join(__dirname, 'node_modules', p);

// $...$ ve $$...$$ → KaTeX
function md(s) {
  s = String(s);
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, x) => katex.renderToString(x, { displayMode: true, throwOnError: true, strict: false }));
  s = s.replace(/\$([^$]+?)\$/g, (_, x) => katex.renderToString(x, { displayMode: false, throwOnError: true, strict: false }));
  return s;
}

// Sınıf renkleri (Instagram serisiyle aynı: 9 turkuaz, 10 sarı, 11 mor)
const RENK = {
  9: { ana: '#0e7490', rozet: '#22b8cf', acik: '#e6f6f9', koyu: '#0b5566' },
  10: { ana: '#b7791f', rozet: '#e9a400', acik: '#fdf5e1', koyu: '#7a4f0c' },
  11: { ana: '#6d28d9', rozet: '#8b5cf6', acik: '#f1ecfd', koyu: '#4c1d95' },
};

// ---------- SVG yardımcıları ----------
const FONT = "'Source Sans 3', sans-serif";
const VC = ['#2563eb', '#ea580c', '#0f766e', '#7c3aed', '#be185d', '#475569'];

function txt(x, y, s, o = {}) {
  return `<text x="${x}" y="${y}" font-family="${o.font || FONT}" font-size="${o.size || 16}" font-weight="${o.w || 800}" fill="${o.c || '#1d2b53'}" text-anchor="${o.a || 'middle'}"${o.it ? ' font-style="italic"' : ''} stroke="${o.halo === false ? 'none' : (o.hc || '#fff')}" stroke-width="${o.hw || 4}" paint-order="stroke" stroke-linejoin="round">${s}</text>`;
}
function ok(x1, y1, x2, y2, c, w = 3.2, hd = 13, dash) {
  const a = Math.atan2(y2 - y1, x2 - x1), bx = x2 - hd * Math.cos(a), by = y2 - hd * Math.sin(a);
  const k = hd * 0.45;
  return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>` +
    `<polygon points="${x2},${y2} ${bx + k * Math.sin(a)},${by - k * Math.cos(a)} ${bx - k * Math.sin(a)},${by + k * Math.cos(a)}" fill="${c}"/>`;
}

// Kareli düzlem şekli.
// f = { cols, rows, s (kare px), vecs:[{x,y,dx,dy,lab,c,dash,lp:'u'|'d'|'l'|'r'|[dx,dy], nokta:true}], notes:[{x,y,t,c,size,a}], width (mm), olcek:true }
// Koordinatlar kare biriminde, (0,0) sol alt köşe, y yukarı.
function kare(f) {
  const s = f.s || 30, P = f.pad || 16, W = f.cols * s, H = f.rows * s;
  const X = x => P + x * s, Y = y => P + H - y * s;
  let b = `<rect x="${P}" y="${P}" width="${W}" height="${H}" fill="#fff"/>`;
  for (let i = 0; i <= f.cols; i++) b += `<line x1="${X(i)}" y1="${P}" x2="${X(i)}" y2="${P + H}" stroke="#d5dde8" stroke-width="1"/>`;
  for (let j = 0; j <= f.rows; j++) b += `<line x1="${P}" y1="${Y(j)}" x2="${P + W}" y2="${Y(j)}" stroke="#d5dde8" stroke-width="1"/>`;
  (f.cizgi || []).forEach(l => { b += `<line x1="${X(l.x1)}" y1="${Y(l.y1)}" x2="${X(l.x2)}" y2="${Y(l.y2)}" stroke="${l.c || '#94a3b8'}" stroke-width="${l.w || 1.6}" stroke-dasharray="${l.dash || '5 4'}"/>`; });
  (f.vecs || []).forEach((v, i) => {
    const c = v.c || VC[i % VC.length];
    const x1 = X(v.x), y1 = Y(v.y), x2 = X(v.x + v.dx), y2 = Y(v.y + v.dy);
    if (v.nokta !== false) b += `<circle cx="${x1}" cy="${y1}" r="3.6" fill="${c}"/>`;
    b += ok(x1, y1, x2, y2, c, v.w || 3.4, v.hd || 13, v.dash);
    if (v.lab) {
      let lx = (x1 + x2) / 2, ly = (y1 + y2) / 2;
      const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L; // sol normal (ekranda)
      const d = v.ld || 17;
      if (v.lp === 'tip') { const ux = (x2 - x1) / L, uy = (y2 - y1) / L; lx = x2 + ux * 10; ly = y2 + uy * 10; b += txt(lx, ly + 6, v.lab, { c, size: v.size || 18, it: v.it !== false, a: ux >= 0 ? 'start' : 'end' }); return; }
      if (Array.isArray(v.lp)) { lx += v.lp[0]; ly += v.lp[1]; }
      else if (v.lp === 'u') ly -= d; else if (v.lp === 'd') ly += d + 6;
      else if (v.lp === 'l') lx -= d + 6; else if (v.lp === 'r') lx += d + 6;
      else { lx += nx * d; ly += ny * d; }
      b += txt(lx, ly + 6, v.lab, { c, size: v.size || 18, it: v.it !== false });
    }
  });
  (f.notes || []).forEach(n => { b += txt(X(n.x), Y(n.y), n.t, { c: n.c || '#334155', size: n.size || 13, w: n.w || 700, a: n.a || 'middle', it: n.it }); });
  if (f.olcek) b += txt(P + W, P + H + 15, '1 kare = 1 birim', { size: 11.5, w: 600, c: '#64748b', a: 'end' });
  const vh = H + 2 * P + (f.olcek ? 8 : 0);
  return `<svg class="sk" viewBox="0 0 ${W + 2 * P} ${vh}" style="width:${f.width || ((W + 2 * P) * 0.26)}mm;max-width:100%">${b}</svg>`;
}

// Sayı doğrusu üzerinde uç uca eklenen aynı doğrultudaki vektörler
// f = { min, max, rows:[{x0, d, lab, c}], R:{x0,d,lab}, birim }
function dogru(f) {
  const s = f.s || 34, P = 26, n = f.max - f.min, W = n * s;
  const X = x => P + (x - f.min) * s;
  const rows = f.rows.length + (f.R ? 1 : 0);
  const H = 40 + rows * 38 + 20;
  let b = '';
  const ay = H - 30;
  b += `<line x1="${P - 10}" y1="${ay}" x2="${P + W + 10}" y2="${ay}" stroke="#64748b" stroke-width="1.6"/>`;
  for (let x = f.min; x <= f.max; x++) {
    b += `<line x1="${X(x)}" y1="${ay - 5}" x2="${X(x)}" y2="${ay + 5}" stroke="#64748b" stroke-width="1.4"/>`;
    if (f.etiket !== false) b += txt(X(x), ay + 21, x, { size: 12, w: 600, c: '#64748b', halo: false });
  }
  f.rows.forEach((r, i) => {
    const y = 26 + i * 38, c = r.c || VC[i];
    b += `<line x1="${X(r.x0)}" y1="${y}" x2="${X(r.x0)}" y2="${ay}" stroke="${c}" stroke-width="1" stroke-dasharray="3 4" opacity=".55"/>`;
    b += `<circle cx="${X(r.x0)}" cy="${y}" r="3.4" fill="${c}"/>` + ok(X(r.x0), y, X(r.x0 + r.d), y, c, 3.4, 13);
    b += txt((X(r.x0) + X(r.x0 + r.d)) / 2, y - 8, r.lab, { c, size: 16, it: r.it });
  });
  if (f.R) {
    const y = 26 + f.rows.length * 38, c = f.R.c || '#0f172a';
    b += `<circle cx="${X(f.R.x0)}" cy="${y}" r="3.4" fill="${c}"/>` + ok(X(f.R.x0), y, X(f.R.x0 + f.R.d), y, c, 4, 14);
    b += txt((X(f.R.x0) + X(f.R.x0 + f.R.d)) / 2, y - 8, f.R.lab, { c, size: 16, it: f.R.it });
  }
  return `<svg class="sk" viewBox="0 0 ${W + 2 * P} ${H}" style="width:${f.width || ((W + 2 * P) * 0.26)}mm;max-width:100%">${b}</svg>`;
}

// ---------- PDF sayfası HTML parçaları ----------
function css(R) {
  return `
:root{--ink:#1d2b53;--ink2:#4b5675;--line:#d7dde8;--soft:#f4f6fa;--ana:${R.ana};--rozet:${R.rozet};--acik:${R.acik};--koyu:${R.koyu}}
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:16mm 14mm 15mm}
html,body{font-family:'Source Sans 3',Arial,sans-serif;color:var(--ink);font-size:10.6pt;line-height:1.48;-webkit-print-color-adjust:exact;print-color-adjust:exact}
b,strong{font-weight:700}
.hero{background:linear-gradient(115deg,#1b2557 0%,#2b3480 45%,#5b3cc4 100%);color:#fff;border-radius:12px;padding:16px 20px 15px;margin-bottom:14px}
.hero .ust{display:flex;justify-content:space-between;font-size:7.6pt;font-weight:800;letter-spacing:.16em;color:#c9d2ff;text-transform:uppercase}
.hero .ust span:last-child{letter-spacing:.02em;text-transform:none;color:#fff}
.hero h1{font-size:21pt;line-height:1.12;font-weight:800;margin:7px 0 6px}
.hero p{font-size:9.6pt;color:#dfe4ff}
h2.b{display:flex;align-items:center;gap:8px;font-size:13pt;font-weight:800;margin:14px 0 6px;break-after:avoid}
h2.b .n{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:5px;background:var(--rozet);color:#fff;font-size:9.5pt}
p{margin:4px 0}
table.t{width:100%;border-collapse:collapse;margin:6px 0 4px;font-size:9.6pt;break-inside:avoid}
table.t th{background:#1d2b53;color:#fff;text-align:left;padding:5px 8px;font-weight:700}
table.t td{padding:4.5px 8px;border-bottom:1px solid var(--line)}
table.t tr:nth-child(even) td{background:#f7f9fc}
.ikili{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center;break-inside:avoid}
.ikili.s{grid-template-columns:1.05fr .95fr}
.kutu{border-radius:9px;padding:9px 12px;margin:8px 0;break-inside:avoid}
.kutu.ana{background:var(--acik);border-left:4px solid var(--ana)}
.kutu.sari{background:#fff7e0;border-left:4px solid #e3a92b}
.kutu .et{font-size:7.6pt;font-weight:800;letter-spacing:.14em;color:var(--koyu);text-transform:uppercase;margin-bottom:2px}
.kutu.sari .et{color:#9a6a06}
.sekil{text-align:center;margin:6px 0 2px;break-inside:avoid;line-height:0}.sekil .alt{line-height:1.3}
.alt{font-size:8.6pt;color:#5b6684;text-align:center;margin-top:1px}
.hata{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:6px 0;border-radius:8px;overflow:hidden;break-inside:avoid;font-size:9.6pt}
.hata div{padding:7px 11px}
.hata .y{background:#fdecec}.hata .d{background:#e8f6ee}
.hata .y b{color:#c0262d}.hata .d b{color:#14804a}
.orn{border:1.5px solid var(--rozet);border-radius:10px;padding:9px 13px;margin:9px 0;background:#fff;break-inside:avoid}
.orn .et{font-size:7.8pt;font-weight:800;letter-spacing:.13em;color:var(--koyu);margin-bottom:3px}
.soru{display:grid;grid-template-columns:22px 1fr;gap:8px;margin:11px 0 6px;break-inside:avoid}
.soru .sn{width:20px;height:20px;border-radius:50%;background:var(--rozet);color:#fff;font-weight:800;font-size:9pt;display:grid;place-items:center;margin-top:1px}
.siklar{display:grid;grid-template-columns:repeat(var(--k,3),1fr);gap:3px 12px;margin-top:5px}
.siklar span b{margin-right:4px}
.cv{width:100%;border-collapse:collapse;font-size:9.4pt}
.cv td{padding:5px 6px;border-bottom:1px solid var(--line);vertical-align:top}
.cv td:first-child{width:22px;font-weight:800}.cv td:nth-child(2){width:24px;font-weight:800;color:var(--koyu)}
.son{display:flex;justify-content:space-between;align-items:center;background:#1d2b53;color:#fff;border-radius:10px;padding:12px 16px;margin-top:14px;break-inside:avoid;font-size:9.6pt}
.son b{color:#7dd3fc}
.sb{break-before:page}
.katex{font-size:1.04em}
svg.sk{display:inline-block}
`;
}

function head(title, R, extra = '') {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${title}</title>
<link rel="stylesheet" href="${NM('katex/dist/katex.min.css')}">
${['400', '600', '700', '800'].map(w => `<link rel="stylesheet" href="${NM('@fontsource/source-sans-3/' + w + '.css')}">`).join('')}
<style>${css(R)}${extra}</style></head><body>`;
}

const hero = (N) => `<div class="hero"><div class="ust"><span>Fizik notları · ${N.sinif}. sınıf · Maarif Modeli · #${N.no}</span><span>@benfizikyapamiyorum</span></div><h1>${md(N.baslik)}</h1><p>${md(N.alt)}</p></div>`;
const bolum = (n, t, html) => `<h2 class="b"><span class="n">${n}</span>${md(t)}</h2>${md(html)}`;
const kutu = (tur, et, html) => `<div class="kutu ${tur}"><div class="et">${et}</div>${md(html)}</div>`;
const sekil = (svg, alt) => `<div class="sekil">${svg}${alt ? `<div class="alt">${md(alt)}</div>` : ''}</div>`;
const hatalar = L => `<h2 class="b"><span class="n">!</span>Sık yapılan 5 hata</h2>` + L.map(([y, d]) => `<div class="hata"><div class="y"><b>YANLIŞ:</b> ${md(y)}</div><div class="d"><b>DOĞRUSU:</b> ${md(d)}</div></div>`).join('');
const ornek = (n, et, html) => `<div class="orn"><div class="et">ÇÖZÜMLÜ ÖRNEK ${n} · ${et}</div>${md(html)}</div>`;
function soru(n, q) {
  const k = q.k || (q.siklar && q.siklar.some(s => s.replace(/\$[^$]*\$/g, 'xx').length > 26) ? 2 : (q.siklar && q.siklar.length === 5 ? 3 : 3));
  const sik = q.siklar ? `<div class="siklar" style="--k:${q.k || k}">${q.siklar.map((s, i) => `<span><b>${'ABCDE'[i]})</b>${md(s)}</span>`).join('')}</div>` : '';
  return `<div class="soru"><div class="sn">${n}</div><div>${md(q.metin)}${q.sekil ? `<div class="sekil">${q.sekil}</div>` : ''}${q.kok ? `<p><b>${md(q.kok)}</b></p>` : ''}${sik}${q.ek || ''}</div></div>`;
}
const cevaplar = L => `<h2 class="b"><span class="n">✓</span>Cevaplar ve çözümler</h2><table class="cv">` + L.map((c, i) => `<tr><td>${i + 1}</td><td>${c[0]}</td><td>${md(c[1])}</td></tr>`).join('') + `</table>`;
const sonraki = t => `<a class="son" href="https://benfizikyapamiyorum.com/ucretsiz/pdf?utm_source=haftalik_not&utm_medium=pdf" style="text-decoration:none"><div>Bu notu faydalı bulduysan arkadaşına gönder. Gelecek hafta:<br><b>${md(t)}</b></div><div style="text-align:right"><b>Tüm ücretsiz notlar →</b><br>benfizikyapamiyorum.com/ucretsiz/pdf</div></a>`;

module.exports = { md, RENK, VC, txt, ok, kare, dogru, head, hero, bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki, NM, FONT };
