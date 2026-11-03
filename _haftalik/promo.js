// Notun son sayfası: ürün tanıtımı (başlık/altbilgi yok, kendi bandı var)
const path = require('path');
const QR = require('qrcode');
const { head, RENK } = require('./lib');

// Ürün bilgileri sınıfa göre. Görseller site deposundan (SITE env ya da ../benfizikyapamiyorum-site).
const URUN = {
  9: { ad: 'Yapabilirim 9', sayfa: '9-sinif-fizik-paketi.html', fiyat: '₺599', konu: 21, soru: 510, kart: 157, gorsel: ['img/fizik9/set.webp', 'img/fizik9/pdf-set.webp'] },
  10: { ad: 'Yapabilirim 10', sayfa: '10-sinif-fizik-paketi.html', fiyat: '₺599', konu: 20, soru: 576, kart: 155, gorsel: ['img/fizik10/set.webp', 'img/fizik10/pdf-set.webp'] },
  11: { ad: 'Yapabilirim 11', sayfa: '11-sinif-fizik-paketi.html', fiyat: '₺599', konu: 18, soru: 504, kart: 126, gorsel: ['img/fizik11/set.webp', 'img/fizik11/pdf-set.webp'] },
};

async function promoHTML(N, site) {
  const R = RENK[N.sinif], U = URUN[N.sinif];
  const url = 'benfizikyapamiyorum.com/' + U.sayfa;
  const qr = await QR.toString('https://' + url, { type: 'svg', margin: 0, color: { dark: '#1d2b53', light: '#ffffff' } });
  const img = p => 'file://' + path.join(site, p);
  const extra = `
@page{size:A4;margin:12mm}
.pb{display:flex;justify-content:space-between;font-size:7.6pt;font-weight:800;letter-spacing:.06em;color:var(--ana);margin-bottom:6px}
.ph{background:linear-gradient(115deg,#1b2557 0%,#2b3480 45%,#5b3cc4 100%);color:#fff;border-radius:12px;padding:16px 20px}
.ph .e{font-size:7.6pt;font-weight:800;letter-spacing:.16em;color:#c9d2ff}
.ph h1{font-size:21pt;font-weight:800;margin:6px 0 4px;line-height:1.15}.ph p{color:#dfe4ff;font-size:10pt}
.gr{display:grid;grid-template-columns:1.1fr .9fr;gap:12px;margin-top:12px}
.kt{border:1.5px solid var(--line);border-radius:12px;padding:12px 14px}
.kt h3{font-size:13pt;font-weight:800;margin:8px 0 6px}
.kt ul{margin:4px 0 8px 16px;font-size:9.6pt}.kt li{margin:2px 0}
.fy{display:flex;align-items:center;gap:10px;margin-top:8px}.fy b{font-size:24pt;color:var(--ana);font-weight:800}.fy span{font-size:8.6pt;color:var(--ink2);line-height:1.3}
.gs{display:flex;gap:10px;justify-content:center;align-items:flex-start}
.gs img{border-radius:10px;box-shadow:0 6px 18px rgba(29,43,83,.18);border:1px solid #e2e8f0}
.st{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}
.st div{background:var(--acik);border-radius:9px;padding:8px;text-align:center}.st b{display:block;font-size:15pt;color:var(--koyu);font-weight:800}.st span{font-size:8.2pt;color:var(--ink2)}
.alt3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:12px}
.alt3>div{border:1.5px solid var(--line);border-radius:12px;padding:11px 13px;font-size:9.2pt}
.alt3 h4{font-size:10.4pt;font-weight:800;margin-bottom:4px}
.qr{text-align:center;border-color:var(--ana)!important}.qr svg{width:30mm;height:30mm}.qr p{font-size:8.4pt;font-weight:700;margin-top:4px}
.kod{display:inline-block;border:2px dashed var(--ana);color:var(--koyu);font-weight:800;font-size:13pt;letter-spacing:.08em;padding:3px 10px;border-radius:7px;margin-top:6px}
.bant{display:flex;justify-content:space-between;background:#1d2b53;color:#fff;border-radius:10px;padding:10px 14px;margin-top:12px;font-size:8.8pt}.bant b{color:#fcd34d}`;
  return head(`${U.ad} tanıtım`, R, extra) + `
<div class="pb"><span>BEN FİZİK YAPAMIYORUM</span><span>BU NOTUN DEVAMI</span></div>
<div class="ph"><div class="e">ÇALIŞMAYA DEVAM · ${N.sinif}. SINIF</div><h1>Okudun. Şimdi kendini dene.</h1><p>${N.promoKonu || N.konuKisa} ve ${N.sinif}. sınıfın bütün konuları ${U.ad}'da: konu notu, yeni nesil sorular, yanlışının nedenini söyleyen çözümler.</p></div>
<div class="gr">
 <div class="kt"><div class="gs"><img src="${img(U.gorsel[0])}" style="height:104mm"><img src="${img(U.gorsel[1])}" style="height:104mm;margin-top:14mm"></div></div>
 <div class="kt"><h3>${U.ad}</h3>
  <ul><li>Her konuda kısa konu notu ve kavram kartları</li><li>Sınavdaki gibi şekilli sorular, adım adım çözümler</li><li>Yanlış cevapta “neden yanlış?” açıklaması</li><li>Telefon, tablet ve yazdırılabilir PDF</li><li>Her konunun notu ve ilk 4 sorusu ücretsiz</li></ul>
  <div class="st"><div><b>${U.konu}</b><span>konu</span></div><div><b>${U.soru}</b><span>soru</span></div><div><b>${U.kart}</b><span>kavram kartı</span></div></div>
  <div class="fy"><b>${U.fiyat}</b><span>Tek ödeme, yıl boyu kullanım.<br>Ücretsiz sürümle önce dene.</span></div></div>
</div>
<div class="alt3">
 <div class="qr">${qr}<p>Okut ya da yaz:<br>${url.replace('.html', '')}</p></div>
 <div><h4>Yazılıya 3 gün kala</h4>Yazılıdan önceki 3 gün için hazır plan: konuyu topla, çözerek öğren, son gün prova et. <b>Yazılıya 3 Gün Kala ${N.sinif}</b> kitapçığı sitede.</div>
 <div><h4>Bu PDF’yi okuyanlara %10</h4>${U.ad} ve Yazılıya 3 Gün Kala’da Shopier ödeme adımında yaz:<br><span class="kod">NOTLAR10</span></div>
</div>
<div class="bant"><span>Her hafta yeni ücretsiz not: <b>Pazartesi 9 · Çarşamba 10 · Cuma 11. sınıf</b></span><span>benfizikyapamiyorum.com · @benfizikyapamiyorum</span></div>
</body></html>`;
}
module.exports = { promoHTML, URUN };
