#!/usr/bin/env node
// Kullanım: node _ders/build.js _ders/dersler/<ders>.js   ->  sunum/<slug>.html
// Ders dosyası: module.exports = { slug, baslik, dersAdi, slaytlar: (k) => [k.kapak(...), k.konu(...), k.soru(...), ...] }
'use strict';
const fs = require('fs'), path = require('path');
const kit = require('./kit');
const KOK = path.resolve(__dirname, '..');

function derle(dosya) {
  const d = require(path.resolve(dosya));
  kit.basla(d.dersAdi || d.baslik);
  d.slaytlar = d.slaytlar(kit);
  if (!/^[a-z0-9-]+$/.test(d.slug)) throw new Error('slug sadece küçük harf, rakam ve tire: ' + d.slug);
  const css = fs.readFileSync(path.join(__dirname, 'motor.css'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, 'motor.js'), 'utf8');
  const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${d.baslik}</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Noto+Sans+Math&display=swap" rel="stylesheet"><style>
${css}</style></head>
<body>
<div id="sahne">${d.slaytlar.join('')}<canvas id="ink" width="1920" height="1080"></canvas></div>
<div id="kalembar"><button data-r="#1d3b8f" class="on" style="background:#1d3b8f" aria-label="Mavi kalem"></button><button data-r="#c0392b" style="background:#c0392b" aria-label="Kırmızı kalem"></button><button data-r="#1e7a4f" style="background:#1e7a4f" aria-label="Yeşil kalem"></button><button id="silgi" aria-label="Silgi">⌫</button><button id="temizle" aria-label="Sayfayı temizle">🗑</button><button id="fare" aria-label="Fareyle çiz">✎</button></div>
<div id="ilerleme"></div>
<div id="kontrol"><button id="geri" aria-label="Geri">‹</button><span id="sayac"></span><button id="ileri" aria-label="İleri">›</button><button id="tam" aria-label="Tam ekran">⛶</button></div>
<div id="ipucu">Parmakla dokun: cevaplar adım adım açılır. Kalemle (Apple Pencil) doğrudan yaz. Geri için ‹, tam ekran için ⛶.</div>
<script>
${js}</script>
</body></html>
`;
  const cikis = path.join(KOK, 'sunum', d.slug + '.html');
  fs.writeFileSync(cikis, html);
  console.log(`${path.relative(KOK, cikis)}  (${d.slaytlar.length} slayt)  ->  https://benfizikyapamiyorum.com/sunum/${d.slug}.html`);
}

const dosyalar = process.argv.slice(2);
if (!dosyalar.length) { console.error('Kullanım: node _ders/build.js _ders/dersler/<ders>.js [...]'); process.exit(1); }
dosyalar.forEach(derle);
