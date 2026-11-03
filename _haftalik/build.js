// node build.js notlar/9-02.js  → out/<slug>/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const L = require('./lib');
const { promoHTML } = require('./promo');
const S = require('./slides');

const SITE = process.env.SITE || (path.basename(__dirname) === '_haftalik' ? path.resolve(__dirname, '..') : path.resolve(__dirname, '..', 'benfizikyapamiyorum-site'));

const HEAD = (R) => `<div style="width:100%;font-family:Arial,sans-serif;font-size:7.4pt;font-weight:700;color:${R.ana};padding:0 14mm;display:flex;justify-content:space-between;letter-spacing:.05em"><span>BEN FİZİK YAPAMIYORUM</span><span>FİZİK NOTLARI</span></div>`;
const FOOT = (lab) => `<div style="width:100%;font-family:Arial,sans-serif;font-size:7.2pt;color:#6b7590;padding:0 14mm;display:flex;justify-content:space-between"><span>Ben Fizik Yapamıyorum | Timur Hoca</span><span>${lab}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

(async () => {
  const file = path.resolve(process.argv[2]);
  const N = require(file);
  const R = L.RENK[N.sinif];
  const out = path.join(__dirname, 'out', N.slug);
  fs.mkdirSync(path.join(out, 'slayt'), { recursive: true });
  const title = `${N.sinif}. Sınıf ${N.pdfBaslik} Fizik Notları`;

  fs.writeFileSync(path.join(out, 'main.html'), L.head(title, R) + L.hero(N) + N.govde + '</body></html>');
  fs.writeFileSync(path.join(out, 'promo.html'), await promoHTML(N, SITE));

  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.goto('file://' + path.join(out, 'main.html'), { waitUntil: 'networkidle' });
  await pg.evaluate('document.fonts.ready');
  await pg.pdf({ path: path.join(out, 'main.pdf'), preferCSSPageSize: true, printBackground: true, displayHeaderFooter: true,
    headerTemplate: HEAD(R), footerTemplate: FOOT(`${N.sinif}. Sınıf Fizik Notları #${N.no} · ${N.konuKisa}`) });
  await pg.goto('file://' + path.join(out, 'promo.html'), { waitUntil: 'networkidle' });
  await pg.evaluate('document.fonts.ready');
  await pg.pdf({ path: path.join(out, 'promo.pdf'), preferCSSPageSize: true, printBackground: true });

  await b.close();

  // Birleştir
  const pdf = path.join(out, N.slug + '.pdf');
  execFileSync('python3', ['-c', `
import sys
from pypdf import PdfWriter, PdfReader
w=PdfWriter()
for f in sys.argv[1:3]:
    for p in PdfReader(f).pages: w.add_page(p)
w.add_metadata({'/Title': sys.argv[4], '/Author': 'Timur Yıldırım · Ben Fizik Yapamıyorum'})
w.write(sys.argv[3])
`, path.join(out, 'main.pdf'), path.join(out, 'promo.pdf'), pdf, title]);
  const sayfa = parseInt(execFileSync('pdfinfo', [pdf]).toString().match(/Pages:\s+(\d+)/)[1]);

  // Kapak webp (hub kartı 560×347): 1. sayfanın üst kısmı
  execFileSync('pdftoppm', ['-r', '136', '-png', '-f', '1', '-l', '1', '-singlefile', pdf, path.join(out, 'p1')]);
  execFileSync('python3', ['-c', `
from PIL import Image
im=Image.open('${path.join(out, 'p1.png')}'); w=im.width
crop=im.crop((0,0,w,int(w*347/560)))
crop.resize((560,347),Image.LANCZOS).save('${path.join(out, N.slug + '.webp')}','WEBP',quality=86)
`]);
  // Slaytlar (PDF önizlemesi hazır olduktan sonra)
  N.onizleme = path.join(out, 'p1.png');
  const b2 = await chromium.launch();
  const sp = await b2.newPage({ viewport: { width: 1080, height: 1350 } });
  const list = [S.kapak(N), ...N.slaytlar.map((s, i) => S.icerik(N, s, i + 1, N.slaytlar.length + 1)), S.cta(N, N.slaytlar.length + 1, N.slaytlar.length + 1)];
  for (let i = 0; i < list.length; i++) {
    const h = path.join(out, 'slayt', `s${i}.html`);
    fs.writeFileSync(h, list[i]);
    await sp.goto('file://' + h, { waitUntil: 'networkidle' });
    await sp.evaluate('document.fonts.ready');
    const name = i === 0 ? `${N.sinif}_not${N.no}_slayt_0_kapak.png` : `${N.sinif}_not${N.no}_slayt_${i}.png`;
    await sp.screenshot({ path: path.join(out, 'slayt', name) });
    fs.mkdirSync(path.join(out, 'slayt', 'jpg'), { recursive: true });
    await sp.screenshot({ path: path.join(out, 'slayt', 'jpg', name.replace('.png', '.jpg')), type: 'jpeg', quality: 92 });
    // taşma denetimi: içerik 1350'yi aşıyor mu
    const over = await sp.evaluate(() => { const w = document.querySelector('.w'); return w.scrollHeight > 1350 + 1 ? w.scrollHeight : 0; });
    if (over) console.log('UYARI taşma slayt', i, over);
  }
  await b2.close();
  // Denetim montajları
  execFileSync('pdftoppm', ['-r', '60', '-png', pdf, path.join(out, 'pg')]);
  fs.writeFileSync(path.join(out, 'aciklama.txt'), N.aciklama.trim() + '\n\n--- İlk yorum (sabitle) ---\n' + N.ilkYorum.trim() + '\n');
  fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify({ sinif: N.sinif, no: N.no, slug: N.slug, sayfa, hub: N.hub }, null, 1));
  console.log('OK', pdf, 'sayfa', sayfa, 'slayt', list.length);
})();
