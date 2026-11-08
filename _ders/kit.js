// BFY ders sunumu yapı taşları. Her fonksiyon bir slayt (<section>) HTML'i döndürür.
// Parmakla dokunuş -> sıradaki .adim açılır; Apple Pencil -> üstüne yazar (motor.js).
'use strict';

const esc = s => String(s);           // içerik bilerek HTML olarak yazılır (<sub>, <b>, SVG...)
const P = (t) => t ? `<p>${t}</p>` : '';

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
    if (typeof x === 'string') return `<div class="nokta adim">${x}</div>`;
    if (x.formul) return `<div class="formul adim"${x.vurgu ? ` data-vurgu="${x.vurgu}"` : ''}><div class="f">${x.formul}</div>${x.aciklama ? `<div class="fa">${x.aciklama}</div>` : ''}</div>`;
    return `<div class="nokta adim"${x.vurgu ? ` data-vurgu="${x.vurgu}"` : ''}>${x.metin}</div>`;
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
      ? `<div class="cev adim">${a}</div>`
      : `<div class="cev adim"${a.vurgu ? ` data-vurgu="${a.vurgu}"` : ''}>${a.metin}</div>`).join('');
    const cv = m.cevap ? `<div class="cev adim son">${m.cevap}</div>` : '';
    return `<div class="madde" data-m="${i}"><div class="mm">${m.puan ? `<span class="p">${m.puan}</span>` : ''}<b>${harf})</b>${m.metin}</div>${ad}${cv}</div>`;
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
function ok({ x1, y1, x2, y2, renk = '#244f40', kalin = 5, ad = '', etiket = '', ex = 0, ey = 0 }) {
  const id = 'u' + Math.random().toString(36).slice(2, 8);
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = 16, w = 8;
  const bx = x2 - ux * h, by = y2 - uy * h;
  const tri = `${x2},${y2} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`;
  const lbl = etiket ? `<text x="${x2 + ex}" y="${y2 + ey}" font-size="26" font-weight="800" fill="${renk}" text-anchor="middle">${etiket}</text>` : '';
  return `<g class="vek" data-ad="${ad}"><line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${renk}" stroke-width="${kalin}" stroke-linecap="round"/><polygon points="${tri}" fill="${renk}"/>${lbl}</g>`;
}
const svg = (w, h, ic) => `<svg class="vsvg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Plus Jakarta Sans,sans-serif">${ic}</svg>`;

module.exports = { basla, kapak, bolum, konu, soru, kapanis, ok, svg };
