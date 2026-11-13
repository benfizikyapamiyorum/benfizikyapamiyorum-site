// BFY Ara Tatil Fizik Kampı: sayfa düzeni ve parçalar.
// İçerik dosyaları (9.js, 10.js, 11.js) yalnız buradaki yardımcıları ve real.js şekillerini kullanır.
const path = require('path');
const katex = require('katex');
const NM = p => 'file://' + path.join(__dirname, '..', 'node_modules', p);

function md(s) {
  s = String(s);
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, x) => katex.renderToString(x, { displayMode: true, throwOnError: true, strict: false }));
  s = s.replace(/\$([^$]+?)\$/g, (_, x) => katex.renderToString(x, { displayMode: false, throwOnError: true, strict: false }));
  return s;
}
const RENK = {
  9: { ana: '#0e7490', rozet: '#22b8cf', acik: '#e6f6f9', koyu: '#0b5566', parlak: '#67e8f9' },
  10: { ana: '#b7791f', rozet: '#e9a400', acik: '#fdf5e1', koyu: '#7a4f0c', parlak: '#fcd34d' },
  11: { ana: '#6d28d9', rozet: '#8b5cf6', acik: '#f1ecfd', koyu: '#4c1d95', parlak: '#c4b5fd' },
};
const SITE = 'https://benfizikyapamiyorum.com';
const UTM = '?utm_source=ara_tatil&utm_medium=pdf';

function css(R) {
  return `
:root{--ink:#1d2b53;--ink2:#4b5675;--line:#d7dde8;--soft:#f4f6fa;--ana:${R.ana};--rozet:${R.rozet};--acik:${R.acik};--koyu:${R.koyu};--parlak:${R.parlak}}
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4;margin:15mm 14mm 14mm}
html,body{font-family:'Source Sans 3',Arial,sans-serif;color:var(--ink);font-size:10.6pt;line-height:1.46;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3,.mn{font-family:'Manrope','Source Sans 3',sans-serif}
b,strong{font-weight:700}
p{margin:4px 0}
a{color:inherit;text-decoration:none}
.sb{break-before:page}
.katex{font-size:1.04em}
svg.sk{display:inline-block}
/* Gün başlığı */
.gun{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;background:linear-gradient(115deg,#1b2557 0%,#2b3480 50%,#5b3cc4 100%);color:#fff;border-radius:14px;padding:12px 16px 12px 12px;margin-bottom:11px;position:relative;overflow:hidden}
.gun:after{content:'';position:absolute;right:-30px;top:-40px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.16),rgba(255,255,255,0) 70%)}
.gun .no{width:58px;height:58px;border-radius:13px;background:var(--parlak);color:#1b2557;display:grid;place-items:center;text-align:center;line-height:1}
.gun .no small{display:block;font:800 6.8pt 'Manrope';letter-spacing:.14em}.gun .no b{font:800 24pt 'Manrope'}
.gun h2{font-size:17pt;font-weight:800;line-height:1.15}
.gun p{font-size:9.4pt;color:#dfe4ff;margin:2px 0 0}
.gun .sure{font:800 8pt 'Manrope';letter-spacing:.06em;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);border-radius:99px;padding:5px 11px;white-space:nowrap;position:relative;z-index:1}
h3.b{display:flex;align-items:center;gap:8px;font-size:11.6pt;font-weight:800;margin:11px 0 5px;break-after:avoid}
h3.b i{display:inline-block;width:5px;height:16px;border-radius:3px;background:var(--rozet)}
.ikili{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center;break-inside:avoid}
.ikili.s{grid-template-columns:1.15fr .85fr}.ikili.g{grid-template-columns:.85fr 1.15fr}.ikili.ust{align-items:start}
.uclu{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;break-inside:avoid}
.kutu{border-radius:10px;padding:8px 12px;margin:7px 0;break-inside:avoid}
.kutu.ana{background:var(--acik);border-left:4px solid var(--ana)}
.kutu.sari{background:#fff7e0;border-left:4px solid #e3a92b}
.kutu.koyu{background:#1d2b53;color:#fff}.kutu.koyu .et{color:var(--parlak)}
.kutu .et{font:800 7.4pt 'Manrope';letter-spacing:.13em;color:var(--koyu);text-transform:uppercase;margin-bottom:2px}
.kutu.sari .et{color:#9a6a06}
.kart{border:1.4px solid var(--line);border-radius:11px;padding:8px 10px;background:#fff;break-inside:avoid;text-align:center}
.kart h4{font:800 9.6pt 'Manrope';margin-bottom:3px;color:var(--koyu)}.kart p{font-size:9.2pt;text-align:left}
.formul{display:flex;align-items:center;justify-content:center;gap:14px;background:#fff;border:1.6px solid var(--rozet);border-radius:11px;padding:7px 12px;margin:7px 0;break-inside:avoid;font-size:12pt}
.formul small{font-size:8.8pt;color:var(--ink2)}
.sekil{text-align:center;margin:5px 0 2px;break-inside:avoid;line-height:0}.sekil .alt{line-height:1.3}
.alt{font-size:8.5pt;color:#5b6684;text-align:center;margin-top:2px}
table.t{width:100%;border-collapse:collapse;margin:6px 0 4px;font-size:9.5pt;break-inside:avoid;border-radius:8px;overflow:hidden}
table.t th{background:#1d2b53;color:#fff;text-align:left;padding:5px 8px;font-weight:700}
table.t td{padding:4.5px 8px;border-bottom:1px solid var(--line)}
table.t tr:nth-child(even) td{background:#f7f9fc}
.hata{display:grid;grid-template-columns:1fr 1fr;margin:5px 0;border-radius:9px;overflow:hidden;break-inside:avoid;font-size:9.5pt}
.hata div{padding:6px 11px}.hata .y{background:#fdecec}.hata .d{background:#e8f6ee}
.hata .y b{color:#c0262d}.hata .d b{color:#14804a}
.isinma{display:flex;align-items:center;gap:10px;margin:12px 0 4px;break-after:avoid}
.isinma b{font:800 11.6pt 'Manrope'}.isinma span{flex:1;height:2px;background:linear-gradient(90deg,var(--rozet),transparent)}
.isinma em{font:800 7.6pt 'Manrope';font-style:normal;letter-spacing:.08em;color:var(--koyu);background:var(--acik);border-radius:99px;padding:3px 10px}
.soru{display:grid;grid-template-columns:24px 1fr;gap:8px;margin:9px 0 5px;break-inside:avoid}
.soru .sn{width:22px;height:22px;border-radius:7px;background:var(--rozet);color:#fff;font:800 9pt 'Manrope';display:grid;place-items:center;margin-top:1px}
.soru.yan>div:last-child{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start}
.siklar{display:grid;grid-template-columns:repeat(var(--k,5),1fr);gap:3px 10px;margin-top:5px}
.siklar span b{margin-right:4px}
.onc{margin:4px 0 2px 2px}.onc div{margin:1.5px 0}
.cvb{font:800 11.6pt 'Manrope';margin:10px 0 4px;display:flex;align-items:center;gap:8px;break-after:avoid}
.cvb i{font-style:normal;font-size:8pt;background:var(--rozet);color:#fff;border-radius:6px;padding:2px 8px;letter-spacing:.08em}
.cv{width:100%;border-collapse:collapse;font-size:9.3pt}
.cv td{padding:4.5px 6px;border-bottom:1px solid var(--line);vertical-align:top}
.cv tr{break-inside:avoid}
.cv td:first-child{width:22px;font-weight:800}.cv td:nth-child(2){width:22px;font-weight:800;color:var(--koyu)}
.pg{width:182mm;height:267mm;display:flex;flex-direction:column;break-after:page;overflow:hidden}
.pg>*{flex:0 0 auto}
.yd{flex:1 1 auto!important;min-height:0;margin-top:12px;border:1.5px dashed var(--rozet);border-radius:13px;padding:10px 14px 12px;display:flex;flex-direction:column}
.yd .u{display:flex;justify-content:space-between;align-items:center;font:800 10pt 'Manrope';color:var(--koyu)}
.yd .u span{font:700 8.6pt 'Source Sans 3';color:var(--ink2);display:flex;align-items:center;gap:7px}.yd .u i{display:inline-block;width:17px;height:17px;border:2px solid var(--rozet);border-radius:5px}
.yd p{font-size:9pt;color:var(--ink2);margin:2px 0 4px}
.yd .cz{flex:1;background:repeating-linear-gradient(to bottom,transparent 0,transparent 8.4mm,#cfd6e4 8.4mm,#cfd6e4 calc(8.4mm + 1px));border-radius:4px}
.skor{display:grid;grid-template-columns:repeat(4,1fr) 1.25fr;gap:8px;margin:14px 0 8px;break-inside:avoid}
.skor div{border:1.5px solid var(--line);border-radius:11px;padding:8px 10px;font-size:8.8pt;color:var(--ink2)}
.skor div b{display:block;font:800 9.4pt 'Manrope';color:var(--koyu)}.skor div em{font:800 15pt 'Manrope';font-style:normal;color:var(--ink)}
.skor div.t{background:#1d2b53;border-color:#1d2b53;color:#c9d2ff}.skor div.t b{color:var(--parlak)}.skor div.t em{color:#fff}
.yor{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;break-inside:avoid}
.yor div{border-radius:11px;padding:9px 12px;font-size:9.4pt;background:var(--soft)}.yor div b{display:block;font:800 10pt 'Manrope';margin-bottom:2px}
.yor div:first-child{background:#e8f6ee}.yor div:nth-child(2){background:#fff7e0}.yor div:nth-child(3){background:#fdecec}
.optik{margin-top:14px;border:1.5px solid var(--line);border-radius:13px;padding:10px 14px;break-inside:avoid}
.optik .et{font:800 10pt 'Manrope';color:var(--koyu);margin-bottom:6px;display:flex;justify-content:space-between}.optik .et span{font:600 8.6pt 'Source Sans 3';color:var(--ink2)}
.optik .gr{display:grid;grid-template-columns:repeat(3,1fr);gap:4px 26px}
.optik .r{display:flex;align-items:center;gap:7px;font:800 9pt 'Manrope';margin:5px 0}.optik .r>b{width:18px;text-align:right}
.optik .r i{font-style:normal;display:grid;place-items:center;width:19px;height:19px;border:1.5px solid var(--rozet);border-radius:50%;font:700 7.6pt 'Source Sans 3';color:var(--koyu)}
.knt{background:var(--acik);border-radius:12px;padding:10px 14px;margin-top:12px}
.knt .et{font:800 10pt 'Manrope';color:var(--koyu);margin-bottom:5px}
.knt>div:not(.et){display:grid;grid-template-columns:20px 1fr;gap:8px;align-items:start;margin:4px 0;font-size:9.8pt}
.knt i{display:block;width:16px;height:16px;border:2px solid var(--ana);border-radius:5px;background:#fff;margin-top:1px}
.anahtar{display:grid;grid-template-columns:repeat(15,1fr);gap:3px;margin:8px 0;break-inside:avoid}
.anahtar div{border:1.3px solid var(--line);border-radius:7px;text-align:center;padding:3px 0;font-size:8pt;color:var(--ink2)}
.anahtar div b{display:block;font:800 11pt 'Manrope';color:var(--koyu)}
`;
}

function head(title, R, extra = '') {
  const f = (pk, ws) => ws.map(w => `<link rel="stylesheet" href="${NM(pk + '/' + w + '.css')}">`).join('');
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${title}</title>
<link rel="stylesheet" href="${NM('katex/dist/katex.min.css')}">
${f('@fontsource/source-sans-3', ['400', '600', '700', '800'])}${f('@fontsource/manrope', ['600', '700', '800'])}
<style>${css(R)}${extra}</style></head><body>`;
}

// ---------- İçerik parçaları ----------
const gunBaslik = (g) => `<div class="gun"><div class="no"><div><small>GÜN</small><b>${g.no}</b></div></div><div><h2>${md(g.baslik)}</h2><p>${md(g.alt)}</p></div><div class="sure">${g.sure || '30 dakika'}</div></div>`;
const bolum = (t, html = '') => `<h3 class="b"><i></i>${md(t)}</h3>${md(html)}`;
const kutu = (tur, et, html) => `<div class="kutu ${tur}"><div class="et">${et}</div>${md(html)}</div>`;
const formul = (tex, aciklama) => `<div class="formul"><span>${md('$' + tex + '$')}</span>${aciklama ? `<small>${md(aciklama)}</small>` : ''}</div>`;
const sekil = (svg, alt) => `<div class="sekil">${svg}${alt ? `<div class="alt">${md(alt)}</div>` : ''}</div>`;
const ikili = (a, b, cls = '') => `<div class="ikili ${cls}"><div>${md(a)}</div><div>${md(b)}</div></div>`;
const p = (html) => `<p>${md(html)}</p>`;
const kontrol = (L) => `<div class="knt"><div class="et">Bugün ne yapabiliyorum?</div>${L.map(x => `<div><i></i><span>${md(x)}</span></div>`).join('')}</div>`;
const uclu = (L) => `<div class="uclu">${L.map(k => `<div class="kart">${k.sekil ? `<div class="sekil">${k.sekil}</div>` : ''}<h4>${md(k.baslik)}</h4><p>${md(k.metin)}</p></div>`).join('')}</div>`;
const tablo = (bas, sat) => `<table class="t"><tr>${bas.map(b => `<th>${md(b)}</th>`).join('')}</tr>${sat.map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</table>`;
const hata = (y, d) => `<div class="hata"><div class="y"><b>YANLIŞ:</b> ${md(y)}</div><div class="d"><b>DOĞRUSU:</b> ${md(d)}</div></div>`;

// Soru: { metin, sekil, yan (şekil sağda), onc:[I, II, III öncülleri], kok, siklar:[5], k (sütun) }
function soru(n, q) {
  const uzun = q.siklar.some(s => s.replace(/\$[^$]*\$/g, 'xxxx').replace(/<[^>]+>/g, '').length > 13);
  const cokUzun = q.siklar.some(s => s.replace(/\$[^$]*\$/g, 'xxxx').replace(/<[^>]+>/g, '').length > 34);
  const k = q.k || (cokUzun ? 1 : uzun ? (q.yan ? 2 : 3) : 5);
  const onc = q.onc ? `<div class="onc">${q.onc.map((o, i) => `<div><b>${['I', 'II', 'III', 'IV'][i]}.</b> ${md(o)}</div>`).join('')}</div>` : '';
  const sik = `<div class="siklar" style="--k:${k}">${q.siklar.map((s, i) => `<span><b>${'ABCDE'[i]})</b>${md(s)}</span>`).join('')}</div>`;
  const metin = String(q.metin).replace(/\((\$\\(?:sin|cos)[^)]*)\)/g, '<span style="white-space:nowrap">($1)</span>');
  const govde = `${md(metin)}${!q.yan && q.sekil ? `<div class="sekil">${q.sekil}</div>` : ''}${onc}${q.kok ? `<p><b>${md(q.kok)}</b></p>` : ''}${sik}`;
  return q.yan && q.sekil
    ? `<div class="soru yan"><div class="sn">${n}</div><div><div>${govde}</div><div class="sekil">${q.sekil}</div></div></div>`
    : `<div class="soru"><div class="sn">${n}</div><div>${govde}</div></div>`;
}
const isinma = (L, bas = 1) => `<div class="isinma"><b>Isınma soruları</b><span></span><em>CEVAPLAR SON SAYFALARDA</em></div>` + L.map((q, i) => soru(bas + i, q)).join('');
const cevapTablo = (bas, L, n0 = 1) => `<div class="cvb"><i>${bas[0]}</i>${bas[1]}</div><table class="cv">` + L.map((q, i) => `<tr><td>${n0 + i}</td><td>${q.cevap}</td><td>${md(q.cozum)}</td></tr>`).join('') + `</table>`;

module.exports = { md, RENK, SITE, UTM, NM, css, head, gunBaslik, bolum, kutu, formul, sekil, ikili, p, kontrol, uclu, tablo, hata, soru, isinma, cevapTablo };
