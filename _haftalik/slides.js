// Instagram carousel slaytları (1080×1350). Kapak = slayt 0, içerik 1..n, son slayt CTA.
const { head, md, RENK } = require('./lib');

function slideCSS(R) {
  return `
@page{size:1080px 1350px;margin:0}
html,body{width:1080px;height:1350px;font-family:Inter,'Source Sans 3',sans-serif;font-size:30px;line-height:1.38;color:#e8ecff}
body{background:radial-gradient(1200px 900px at 100% 100%,rgba(91,60,196,.45),transparent 60%),linear-gradient(160deg,#121a45 0%,#0d1433 100%);position:relative;overflow:hidden}
body:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:54px 54px}
.w{position:absolute;inset:0;padding:52px 72px 60px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:16px;font-weight:800;letter-spacing:.06em;font-size:27px;color:#fff}
.logo{width:50px;height:50px;border-radius:13px;background:linear-gradient(135deg,#6d5df6,#8b5cf6);display:grid;place-items:center;font-size:17px;font-weight:900;letter-spacing:.02em}
.top .sy{margin-left:auto;color:#94a3c8;font-size:27px;letter-spacing:.04em}
.pill{display:inline-block;align-self:flex-start;border:2.5px solid ${R.rozet};color:${R.rozet};border-radius:40px;padding:8px 26px;font-weight:800;letter-spacing:.14em;font-size:24px;margin-top:44px}
h1{font-size:78px;line-height:1.06;font-weight:800;color:#fff;margin:28px 0 20px;letter-spacing:-.01em}
h1 em{font-style:normal;color:${R.rozet}}
.bd{font-size:37px;line-height:1.36;color:#cdd5f5}
.bd b{color:#fff}
.kart{background:#fff;border-radius:28px;padding:26px 28px;color:#1d2b53;font-size:27px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.35)}
.kart svg{width:100%!important;height:auto;max-height:560px}
.kart .alt{font-size:23px;color:#475569;margin-top:6px}
.lst{display:flex;flex-direction:column;gap:22px}
.li{background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.12);border-radius:24px;padding:26px 30px;font-size:36px;line-height:1.35;color:#e2e8ff}
.li b{color:#fff}.li .x{color:#fb7185;font-weight:800}.li .v{color:#4ade80;font-weight:800}
.alt-bant{margin-top:24px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg,#3b3f9e,#5b3cc4);border-radius:26px;padding:26px 32px;font-weight:800;font-size:30px;color:#fff}
.alt-bant span:last-child{color:${R.rozet}}
.sik{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
.sik div{background:rgba(255,255,255,.07);border-radius:16px;padding:12px 18px;font-size:27px}
.sik b{color:${R.rozet};margin-right:8px}
.katex{font-size:1.02em}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center;padding:10px 0}
.ft{display:flex;justify-content:space-between;color:#94a3c8;font-size:25px;font-weight:700;margin-top:20px}
.prev{position:absolute;right:70px;bottom:205px;width:300px;transform:rotate(-5deg);border-radius:14px;box-shadow:0 30px 70px rgba(0,0,0,.5)}
`;
}

function cerceve(N, i, toplam, ic) {
  const R = RENK[N.sinif];
  return head('slayt', R, slideCSS(R)) + `<div class="w"><div class="top"><div class="logo">BFY</div>BEN FİZİK YAPAMIYORUM${i ? `<span class="sy">${i} / ${toplam}</span>` : ''}</div>${ic}</div></body></html>`;
}

function kapak(N) {
  const R = RENK[N.sinif];
  const ic = `
<div style="display:flex;align-items:flex-end;gap:26px;margin-top:70px">
 <div style="font-size:300px;line-height:.8;font-weight:900;color:${R.rozet};letter-spacing:-.04em">${N.sinif}</div>
 <div style="padding-bottom:18px"><div style="font-size:30px;font-weight:800;letter-spacing:.16em;color:#c9d2ff">${N.sinif}. SINIF · FİZİK NOTLARI</div>
 <div style="display:inline-block;margin-top:14px;background:${R.rozet};color:#0d1433;font-weight:900;font-size:34px;padding:6px 20px;border-radius:12px">NOT #${N.no}</div></div>
</div>
<h1 style="font-size:96px;margin-top:56px;max-width:900px">${md(N.slaytBaslik || N.baslik)}</h1>
<div class="bd" style="font-size:34px;max-width:580px">${md(N.slaytAlt || '')}</div>
${N.onizleme ? `<img class="prev" src="file://${N.onizleme}">` : ''}<div class="alt-bant" style="margin-top:auto;font-size:34px;position:relative"><span>ÜCRETSİZ PDF · profildeki linkte</span><span>Kaydır →</span></div>
<div style="margin-top:22px;font-size:26px;color:#94a3c8;font-weight:700">@benfizikyapamiyorum · Maarif Modeli</div>`;
  return cerceve(N, 0, 0, ic);
}

// s = {pill, h, bd, svg, alt, lst:[html], sik:[...], html}
function icerik(N, s, i, toplam) {
  const ic = `<span class="pill">${s.pill}</span><h1>${md(s.h)}</h1>${s.bd ? `<div class="bd">${md(s.bd)}</div>` : ''}<div class="mid">` +
    (s.svg ? `<div class="kart">${s.svg}${s.alt ? `<div class="alt">${md(s.alt)}</div>` : ''}</div>` : '') +
    (s.lst ? `<div class="lst">${s.lst.map(x => `<div class="li">${md(x)}</div>`).join('')}</div>` : '') +
    (s.sik ? `<div class="sik">${s.sik.map((x, k) => `<div><b>${'ABCDE'[k]}</b>${md(x)}</div>`).join('')}</div>` : '') +
    (s.html || '') +
    `</div>` + (s.bant ? `<div class="alt-bant"><span>${md(s.bant[0])}</span><span>${md(s.bant[1] || '')}</span></div>` : '') +
    `<div class="ft"><span>@benfizikyapamiyorum</span><span>${N.sinif}. sınıf · Not #${N.no}${i < toplam - 1 ? ' · kaydır →' : ''}</span></div>`;
  return cerceve(N, i, toplam, ic);
}

function cta(N, i, toplam) {
  const R = RENK[N.sinif];
  const adim = (n, a, b) => `<div class="li" style="display:flex;gap:24px;align-items:center;padding:22px 26px"><div style="width:68px;height:68px;border-radius:16px;background:linear-gradient(135deg,${R.rozet},#8b5cf6);display:grid;place-items:center;font-weight:900;font-size:36px;color:#0d1433;flex:none">${n}</div><div><div style="font-size:36px;font-weight:800;color:#fff">${a}</div><div style="font-size:27px;color:#c3cbec">${b}</div></div></div>`;
  const ic = `<span class="pill">● ÜCRETSİZ PDF</span><h1 style="font-size:104px">Tamamı <em>PDF’te</em></h1>
<div class="bd">${md(N.pdfOzet)}</div>
<div class="lst" style="margin-top:44px;max-width:600px">${adim(1, 'Takip et', `Her ${N.gun} yeni ${N.sinif}. sınıf notu`)}${adim(2, 'Profildeki linke dokun', 'benfizikyapamiyorum.com/ucretsiz/pdf')}${adim(3, `“${N.sinif}. sınıf” bölümü`, 'Notu indir, üyelik yok')}</div>
${N.onizleme ? `<img class="prev" src="file://${N.onizleme}" style="width:300px;right:56px;bottom:300px;transform:rotate(5deg)">` : ''}<div class="alt-bant" style="margin-top:auto;position:relative"><span>Her hafta yeni not</span><span>9 · 10 · 11. sınıf</span></div>
<div style="margin-top:22px;font-size:28px;color:#c3cbec;font-weight:700">@benfizikyapamiyorum</div>`;
  return cerceve(N, i, toplam, ic);
}

module.exports = { kapak, icerik, cta };
