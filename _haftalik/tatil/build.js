// node tatil/build.js 9   → tatil/out/9/: ara-tatil-fizik-kampi-9-sinif.pdf, ara-tatil-fizik-denemesi-9-sinif.pdf, kapak png'leri
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const QR = require('qrcode');
const L = require('./lib');
const { md, RENK, SITE, UTM } = L;

const REPO = path.resolve(__dirname, '..', '..');
const img = p => 'file://' + path.join(REPO, p);
const PAKET = {
  9: { 1: { ad: 'Nicelikler', a: 's9', k: 'kapak-9.webp', soru: 50 }, 2: { ad: 'Hareket ve Hareket Türleri', a: 's9-2', k: 'kapak-9-2.webp', soru: 50 }, 3: { ad: 'Vektörler', a: 's9-3', k: 'kapak-9-3.webp', soru: 60 } },
  10: { 1: { ad: 'Sabit Hızlı Hareket ve Grafik Okuma', a: 's10', k: 'kapak-10.webp', soru: 50 }, 2: { ad: 'İş, Enerji ve Güç', a: 's10-2', k: 'kapak-10-2.webp', soru: 50 }, 3: { ad: 'Mekanik Enerji ve Enerji Kaynakları', a: 's10-3', k: 'kapak-10-3.webp', soru: 60 } },
  11: { 1: { ad: 'Serbest Düşme ve İki Boyutta Sabit İvmeli Hareket', a: 's11', k: 'kapak-11.webp', soru: 50 }, 2: { ad: 'Düzgün Çembersel Hareket', a: 's11-2', k: 'kapak-11-2.webp', soru: 50 } },
};
const YAP = { 9: '9-sinif-fizik-paketi.html', 10: '10-sinif-fizik-paketi.html', 11: '11-sinif-fizik-paketi.html' };
const paketURL = (s, no) => `${SITE}/paket/${UTM}&utm_campaign=tatil${s}#${PAKET[s][no].a}`;
const yapURL = s => `${SITE}/${YAP[s]}${UTM}&utm_campaign=tatil${s}`;
const tatilURL = s => `${SITE}/tatil/${UTM}&utm_campaign=tatil${s}#sinif-${s}`;
const qr = (u, dark = '#1d2b53') => QR.toString(u, { type: 'svg', margin: 0, color: { dark, light: '#ffffff' } });

const DESEN = `<svg width="100%" height="100%" style="position:absolute;inset:0" preserveAspectRatio="none"><defs><pattern id="kr" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M 26 0 H 0 V 26" fill="none" stroke="#fff" stroke-opacity=".055" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#kr)"/></svg>`;

// ---------- Kapak ----------
const TOP = N => N.gunler.reduce((a, g) => a + g.sorular.length, 0);
const GS = N => N.gunler[0].sorular.length;
const DK = 40;
function kapakHTML(N, tur) {
  const R = RENK[N.sinif], den = tur === 'deneme';
  const extra = `
@page{size:A4;margin:0}
html{height:296.6mm;overflow:hidden}body{width:210mm;height:296.6mm;background:linear-gradient(160deg,#0f1638 0%,#1b2557 32%,#3a2f96 68%,#6a3fd0 100%);color:#fff;position:relative;overflow:hidden}
.orb{position:absolute;border-radius:50%;filter:blur(2px)}
.w{position:absolute;left:0;top:0;width:210mm;height:296.6mm;padding:15mm 15mm 12mm;display:flex;flex-direction:column}
.ust{display:flex;justify-content:space-between;align-items:center;font:800 8.4pt 'Manrope';letter-spacing:.14em;color:#c9d2ff}
.ust b{color:#fff;letter-spacing:.04em}
.rz{display:inline-flex;align-items:center;gap:8px;margin-top:13mm;font:800 9.4pt 'Manrope';letter-spacing:.16em;color:#1b2557;background:var(--parlak);border-radius:99px;padding:6px 15px;align-self:flex-start}
h1{font-size:${den ? 43 : 47}pt;line-height:1.02;font-weight:800;margin-top:6mm;letter-spacing:-.015em}
h1 span{color:var(--parlak)}
.alt1{font-size:13.2pt;color:#dfe4ff;margin-top:5mm;max-width:150mm;line-height:1.4}
.alt1 b{color:#fff}
.hero{margin-top:8mm;background:#fff;border-radius:18px;padding:5px;box-shadow:0 18px 50px rgba(5,8,30,.5);line-height:0}
.hero svg.sk{width:100%!important;border-radius:14px}
.cips{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:7mm}
.cip{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.24);border-radius:12px;padding:8px 9px 9px;font-size:9pt;line-height:1.25;color:#eef1ff}
.cip b{display:block;font:800 7.2pt 'Manrope';letter-spacing:.14em;color:var(--parlak);margin-bottom:3px}
.cip.d{background:var(--parlak);color:#1b2557;border-color:var(--parlak)}.cip.d b{color:#3a2f96}
.st{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:9mm;border-top:1px solid rgba(255,255,255,.22);border-bottom:1px solid rgba(255,255,255,.22);padding:5mm 0}
.st div{padding:0 5mm;border-left:1px solid rgba(255,255,255,.22);font-size:9.6pt;color:#dfe4ff;line-height:1.3}.st div:first-child{border-left:0;padding-left:0}
.st b{display:block;font:800 25pt 'Manrope';color:#fff;line-height:1.05}
.cip{min-height:19mm}
.dip{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;font-size:8.6pt;color:#c9d2ff;line-height:1.45}
.dip b{color:#fff;font:800 10.4pt 'Manrope'}
.uy{max-width:92mm;text-align:right}`;
  const cips = N.gunler.map(g => `<div class="cip"><b>GÜN ${g.no}</b>${g.kisa}</div>`).join('') + `<div class="cip d"><b>GÜN 5</b>Deneme: 15 soru, 30 dakika</div>`;
  return L.head(`Ara Tatil Fizik Kampı ${N.sinif}. Sınıf`, R, extra) + `
<div class="orb" style="width:120mm;height:120mm;right:-40mm;top:-40mm;background:radial-gradient(circle,rgba(255,255,255,.14),rgba(255,255,255,0) 70%)"></div>
<div class="orb" style="width:150mm;height:150mm;left:-60mm;bottom:-70mm;background:radial-gradient(circle,${R.rozet}55,rgba(0,0,0,0) 70%)"></div>
${DESEN}
<div class="w">
 <div class="ust"><span>BEN FİZİK YAPAMIYORUM</span><b>@benfizikyapamiyorum</b></div>
 <div class="rz">${N.sinif}. SINIF &nbsp;|&nbsp; MAARİF MODELİ &nbsp;|&nbsp; ${den ? 'DENEME' : 'TEKRAR NOTU'}</div>
 <h1>${den ? 'Ara Tatil<br><span>Fizik Denemesi</span>' : 'Ara Tatil<br><span>Fizik Kampı</span>'}</h1>
 <p class="alt1">${den ? `<b>15 soru, 30 dakika.</b> Okulda bugüne kadar işlenen konulardan. Sonunda cevap anahtarı, kısa çözümler ve <b>eksik konu tablosu</b> var.` : `<b>5 gün, günde en çok ${DK} dakika.</b> Dönemin başından bugüne işlenen konuları toparla, okula bir adım önde dön.`}</p>
 <div class="hero">${N.kapakSekil}</div>
 ${den ? `<div class="cips" style="grid-template-columns:repeat(${N.konular.length},1fr)">${N.konular.map((k, i) => `<div class="cip"><b>KONU ${i + 1}</b>${k.ad}</div>`).join('')}</div><div class="st"><div><b>15</b>soru, çoktan seçmeli</div><div><b>30</b>dakika, süre tut</div><div><b>${N.konular.length}</b>konu, eksik konu tablosu</div><div><b>✓</b>cevap anahtarı ve kısa çözümler</div></div>` : `<div class="cips">${cips}</div><div class="st"><div><b>4</b>konu özeti, şekillerle</div><div><b>${TOP(N)}</b>ısınma sorusu</div><div><b>15</b>soruluk deneme, ayrı PDF</div><div><b>✓</b>cevaplar ve kısa çözümler</div></div>`}
 <div class="dip"><div><b>benfizikyapamiyorum.com</b><br>Timur YILDIRIM | 16 yıllık fizik öğretmeni<br>Türkiye Yüzyılı Maarif Modeli fizik dersi öğretim programına göre hazırlanmıştır.</div><div class="uy">Okulunun konu sırası farklı olabilir, öğretmeninin işlediği konuları esas al.<br>Ücretsizdir, parayla satılamaz.</div></div>
</div></body></html>`;
}

// ---------- Not PDF gövdesi ----------
function planHTML(N) {
  const sat = N.gunler.map(g => `<tr><td class="g"><b>Gün ${g.no}</b></td><td><b>${md(g.baslik)}</b><br><span>${md(g.plan || g.alt)}</span></td><td class="s">${DK} dk</td><td class="c"><i></i></td></tr>`).join('') +
    `<tr class="dn"><td class="g"><b>Gün 5</b></td><td><b>Ara Tatil Fizik Denemesi</b><br><span>15 soru, 30 dakika. Ayrı PDF olarak aynı sayfadan indir, süre tutarak çöz.</span></td><td class="s">30 dk</td><td class="c"><i></i></td></tr>`;
  return `<style>
.pl h1{font-size:22pt;font-weight:800;line-height:1.1}.pl h1 span{color:var(--ana)}
.pl .g1{font-size:11pt;color:var(--ink2);margin:5px 0 12px}
.ad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0 14px}
.ad div{background:var(--acik);border-radius:12px;padding:11px 13px;font-size:9.8pt}
.ad b.n{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--ana);color:#fff;font:800 11pt 'Manrope';margin-bottom:6px}
.ad h4{font:800 10.6pt 'Manrope';margin-bottom:2px}
table.pt{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:10pt}
table.pt td{background:#fff;border-top:1.4px solid var(--line);border-bottom:1.4px solid var(--line);padding:9px 10px;vertical-align:middle}
table.pt td:first-child{border-left:1.4px solid var(--line);border-radius:11px 0 0 11px}table.pt td:last-child{border-right:1.4px solid var(--line);border-radius:0 11px 11px 0}
table.pt .g{width:64px;font:800 10.4pt 'Manrope';color:var(--koyu)}table.pt span{color:var(--ink2);font-size:9.4pt}
table.pt .s{width:52px;font-weight:700;color:var(--ink2);text-align:center}
table.pt .c{width:44px}table.pt .c i{display:block;width:22px;height:22px;border:2px solid var(--rozet);border-radius:6px;margin:auto}
table.pt tr.dn td{background:#1d2b53;color:#fff;border-color:#1d2b53}table.pt tr.dn .g{color:var(--parlak)}table.pt tr.dn span{color:#c9d2ff}table.pt tr.dn .s{color:#fff}table.pt tr.dn .c i{border-color:var(--parlak)}
.soz{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.soz div{border:1.4px dashed var(--rozet);border-radius:11px;padding:10px 13px;font-size:9.8pt}
.soz u{display:inline-block;width:38mm;border-bottom:1.2px solid var(--ink2);text-decoration:none;height:12px}
</style><div class="pl">
<h1>Tatil kısa. <span>Plan net.</span></h1>
<p class="g1">Bu kitapçık ders anlatmaz, <b>toparlar</b>. Her gün tek konu, tek sayfa özet ve kolaydan zora ${GS(N)} ısınma sorusu var. Hepsi yaklaşık ${DK} dakikada biter, günün kalanı senin.</p>
<div class="ad">
 <div><b class="n">1</b><h4>Özeti oku</h4>Şekillere bakarak oku. Formülü ezberleme, şeklin üstünde nereden geldiğini gör. Yaklaşık 10 dakika.</div>
 <div><b class="n">2</b><h4>${GS(N)} soruyu çöz</h4>Önce kendin çöz, sonra son sayfalardaki cevapla karşılaştır. Yaklaşık 25 dakika.</div>
 <div><b class="n">3</b><h4>Yanlışını yaz</h4>Yanlış yaptığın sorunun yanına bir cümleyle nedenini yaz. En çok bu adım işe yarar. Yaklaşık 5 dakika.</div>
</div>
<table class="pt">${sat}</table>
<div class="soz"><div><b>Başlangıç tarihim:</b> <u></u><br><span style="color:var(--ink2);font-size:9pt">Bir gün kaçırırsan bırakma, ertesi gün iki günü birleştir.</span></div><div><b>Deneme netim:</b> <u></u><br><span style="color:var(--ink2);font-size:9pt">Deneme PDF’sindeki eksik konu tablosunu doldurmayı unutma.</span></div></div>
${N.planNot ? L.kutu('sari', 'Bilgin olsun', N.planNot) : ''}
</div>`;
}

function notGovde(N) {
  let h = planHTML(N), n = 1;
  N.gunler.forEach(g => { h += `<section class="gunw">` + L.gunBaslik(g) + g.govde + L.isinma(g.sorular, n) + (g.kontrol ? L.kontrol(g.kontrol) : '') + `</section>`; n += g.sorular.length; });
  h += `<div class="gun"><div class="no"><div><small>TÜM</small><b>✓</b></div></div><div><h2>Cevaplar ve kısa çözümler</h2><p>Önce kendin çöz, sonra buraya bak. Yanlışının nedenini sorunun yanına yaz.</p></div><div class="sure">${TOP(N)} soru</div></div>`;
  n = 1;
  N.gunler.forEach(g => { h += L.cevapTablo([`GÜN ${g.no}`, md(g.baslik)], g.sorular, n); n += g.sorular.length; });
  h += `<div class="skor">${N.gunler.map(g => `<div><b>Gün ${g.no}</b><em>__</em> / ${g.sorular.length} doğru</div>`).join('')}<div class="t"><b>TOPLAM</b><em>__</em> / ${TOP(N)} doğru</div></div>`;
  const e1 = Math.ceil(TOP(N) * 0.8), e2 = Math.ceil(TOP(N) * 0.55);
  h += `<div class="yor"><div><b>${e1} ve üzeri</b>Konular yerinde. Gün 5’te denemeyi süre tutarak çöz.</div><div><b>${e2} ile ${e1 - 1} arası</b>En çok yanlış yaptığın günün özet sayfasını yeniden oku, sonra denemeye geç.</div><div><b>${e2 - 1} ve altı</b>Sorun değil, tatil bunun için. Yanlış yaptığın günleri baştan çalış, denemeyi en sona bırak.</div></div>`;
  return h;
}

// Paket kartları (o sınıfın ilgili paketleri)
function paketKart(s, no, not) {
  const P = PAKET[s][no];
  return `<a class="pk" href="${paketURL(s, no)}"><img src="${img('img/paket/' + P.k)}"><div><small>KONU SORU PAKETİ #${no}</small><h4>${P.ad}</h4><p>${P.soru} yazılı sorusu, her birine adım adım çözüm ve puanlama.${not ? ' ' + not : ''}</p><div class="fy"><b>₺99</b><span>PDF, hemen iner&nbsp;→</span></div></div></a>`;
}
const PK_CSS = `
.pk{display:grid;grid-template-columns:27mm minmax(0,1fr);gap:11px;align-items:center;border:1.5px solid var(--line);border-radius:13px;padding:9px 11px;background:#fff;break-inside:avoid}
.pk img{width:27mm;border-radius:6px;box-shadow:0 5px 14px rgba(29,43,83,.22);border:1px solid #e2e8f0}
.pk small{font:800 6.8pt 'Manrope';letter-spacing:.13em;color:var(--koyu)}.pk h4{font:800 10.6pt 'Manrope';line-height:1.2;margin:2px 0 3px}.pk p{font-size:8.8pt;color:var(--ink2);line-height:1.35}
.pk .fy{display:flex;align-items:center;gap:8px;margin-top:5px}.pk .fy b{font:800 15pt 'Manrope';color:var(--ana)}.pk .fy span{font-size:8.2pt;font-weight:700;color:var(--koyu)}`;

async function notPromo(N) {
  const R = RENK[N.sinif], s = N.sinif;
  const q = await qr(tatilURL(s));
  const extra = `@page{size:A4;margin:12mm}${PK_CSS}
.pb{display:flex;justify-content:space-between;font:800 7.6pt 'Manrope';letter-spacing:.08em;color:var(--ana);margin-bottom:6px}
.ph{background:linear-gradient(115deg,#0f1638 0%,#2b3480 50%,#6a3fd0 100%);color:#fff;border-radius:16px;padding:18px 22px;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center}
.ph .e{font:800 7.8pt 'Manrope';letter-spacing:.16em;color:var(--parlak)}
.ph h1{font-size:24pt;font-weight:800;margin:6px 0 6px;line-height:1.1}.ph p{color:#dfe4ff;font-size:10.4pt}
.ph .q{background:#fff;border-radius:12px;padding:8px;text-align:center;color:#1d2b53;font:800 7.6pt 'Manrope';line-height:1.3}.ph .q svg{width:31mm;height:31mm;display:block;margin-bottom:4px}
h2.s{font:800 13.4pt 'Manrope';margin:14px 0 3px}.as{font-size:10pt;color:var(--ink2);margin-bottom:8px}
.pgr{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}
.orn1{border:1.5px solid var(--line);border-radius:12px;padding:8px 10px;margin-top:10px;text-align:center}
.orn1 b{font:800 7.6pt 'Manrope';color:var(--koyu);letter-spacing:.08em}
body{height:272mm;display:flex;flex-direction:column}body>*{flex:0 0 auto}.orn1{flex:1 1 0!important;min-height:0;display:flex;flex-direction:column}.orn1 div{flex:1 1 0;min-height:0;overflow:hidden;border-radius:7px;margin-top:4px;border:1px solid #e2e8f0;position:relative}
.orn1 div:after{content:'';position:absolute;left:0;right:0;bottom:0;height:16mm;background:linear-gradient(to bottom,rgba(255,255,255,0),#fff)}
.orn1 img{width:100%;display:block}
.orn1 span{display:block;font-size:8.6pt;color:var(--ink2);margin-top:3px}
.fark{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;margin-top:10px}
.fark div{border-radius:12px;padding:10px 13px;font-size:9.6pt}.fark .u{background:var(--soft)}.fark .p{background:var(--acik);border:1.5px solid var(--rozet)}
.fark h4{font:800 10pt 'Manrope';margin-bottom:3px}.fark ul{margin-left:15px}.fark li{margin:1.5px 0}
.yp{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;border:1.5px solid var(--line);border-radius:13px;padding:10px 14px;margin-top:10px;font-size:9.6pt}
.yp b.f{font:800 15pt 'Manrope';color:var(--ana)}
.bant{display:flex;justify-content:space-between;background:#1d2b53;color:#fff;border-radius:11px;padding:10px 14px;margin-top:12px;font-size:8.8pt}.bant b{color:#fcd34d}`;
  const paketler = N.paketler.map(p => paketKart(s, p.no, p.not)).join('');
  return L.head('Deneme ve paketler', R, extra) + `
<div class="pb"><span>BEN FİZİK YAPAMIYORUM</span><span>GÜN 5 | SIRADAKİ ADIM</span></div>
<a class="ph" href="${tatilURL(s)}"><div><div class="e">4 GÜN BİTTİ | ŞİMDİ KENDİNİ ÖLÇ</div><h1>Gün 5: Ara Tatil Fizik Denemesi</h1><p>15 soru, 30 dakika. Sonunda cevap anahtarı ve <b>eksik konu tablosu</b> var: hangi konuda kaç yanlışın olduğunu görürsün. Deneme PDF’si ücretsiz, bu notla aynı sayfada.</p></div><div class="q">${q}Okut ya da dokun<br>benfizikyapamiyorum.com/tatil</div></a>
<h2 class="s">Eksik çıkan konuyu kapat</h2><p class="as">Bu not konuyu toparladı. Yazılıda puanı getiren şey ise o konudan çok sayıda <b>yazılı tarzı soru</b> çözmüş olmak. Konu Soru Paketleri tam bunun için.</p>
<div class="pgr">${paketler}</div>
<div class="orn1"><b>PAKETTEN ÖRNEK SORU</b><div><img src="${img(`img/paket/ornek-${s}-soru.webp`)}"></div><span>Devamı, adım adım çözümü ve puanlaması pakette.</span></div>
<div class="fark"><div class="u"><h4>Bu ücretsiz kitapçık</h4><ul><li>Konu başına tek sayfa özet.</li><li>${TOP(N)} ısınma sorusu ve 15 soruluk deneme (test).</li><li>Kısa çözümler.</li></ul></div><div class="p"><h4>Konu Soru Paketi (₺99)</h4><ul><li>Tek konudan 50 ve üzeri <b>açık uçlu yazılı sorusu</b>.</li><li>Her maddeye adım adım çözüm ve puanlama.</li><li>Her soruda “Dikkat” notu, yeni paketlerde 2 deneme yazılısı.</li></ul></div></div>
<a class="yp" href="${yapURL(s)}"><div><b>Bütün yıl için: Yapabilirim ${s}</b><br>${s}. sınıfın bütün konuları tek dijital kitapta: konu notu, yeni nesil sorular, yanlışının nedenini söyleyen çözümler. Tek ödeme, abonelik yok. Paket alanlar paket ücretini Yapabilirim’den düşebilir.</div><div style="text-align:right"><b class="f">₺599</b><br><b>İncele →</b></div></a>
<a class="bant" href="${SITE}/ucretsiz/pdf${UTM}"><span>Okul açılınca her hafta yeni ücretsiz not: <b>Pazartesi 9 | Çarşamba 10 | Cuma 11. sınıf</b></span><span>@benfizikyapamiyorum</span></a>
</body></html>`;
}

// ---------- Deneme PDF ----------
function denemeGovde(N) {
  const D = N.deneme, s = N.sinif;
  let h = `<style>
.db{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center;background:linear-gradient(115deg,#1b2557 0%,#2b3480 50%,#5b3cc4 100%);color:#fff;border-radius:14px;padding:13px 17px;margin-bottom:10px}
.db h2{font-size:17pt;font-weight:800}.db p{font-size:9.4pt;color:#dfe4ff}
.db .bl{display:flex;gap:7px}.db .bl div{background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.28);border-radius:10px;padding:6px 11px;text-align:center;font-size:7.8pt;line-height:1.2}.db .bl b{display:block;font:800 14pt 'Manrope';color:var(--parlak)}
.kr{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:6px;font-size:9.2pt}.kr div{background:var(--acik);border-radius:10px;padding:7px 10px}
.ad2{display:flex;gap:14px;font-size:9.6pt;margin:6px 0 2px}.ad2 u{flex:1;border-bottom:1.2px solid var(--ink2);text-decoration:none}
table.an{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:6px;break-inside:avoid}
table.an th{background:#1d2b53;color:#fff;text-align:left;padding:6px 8px;font-weight:700}
table.an td{padding:7px 8px;border-bottom:1px solid var(--line);vertical-align:middle}
table.an td.y{width:64px;text-align:center}table.an td.y i{display:inline-block;width:30px;height:20px;border:1.6px solid var(--rozet);border-radius:6px}
table.an a{font-weight:700;color:var(--koyu)}table.an a em{white-space:nowrap;font-style:normal;background:var(--ana);color:#fff;border-radius:6px;padding:1px 7px;font:800 8.6pt 'Manrope';margin-left:5px}
.net{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:8px 0}.net div{border:1.5px solid var(--line);border-radius:10px;padding:7px 10px;font-size:9pt;color:var(--ink2)}.net div b{display:block;color:var(--ink);font:800 10pt 'Manrope'}.net div u{display:block;border-bottom:1.2px solid var(--ink2);height:16px;text-decoration:none}
</style>
<div class="db"><div><h2>Ara Tatil Fizik Denemesi</h2><p>${s}. sınıf | Maarif Modeli | Kapsam: ${md(N.denemeKapsam)}</p></div><div class="bl"><div><b>15</b>soru</div><div><b>30</b>dakika</div></div></div>
<div class="kr"><div><b>1.</b> Süreyi başlat, 30 dakika dolunca bırak.</div><div><b>2.</b> Emin olmadığın soruyu boş bırak.</div><div><b>3.</b> Bitince eksik konu tablosunu doldur.</div></div>
<div class="ad2"><span>Başlama saati:</span><u></u><span>Bitiş saati:</span><u></u></div>`;
  D.forEach((q, i) => { h += L.soru(i + 1, q); });
  h += `<div class="optik"><div class="et">Cevap kâğıdım<span>Cevabını işaretle, sonraki sayfadaki anahtarla karşılaştır.</span></div><div class="gr">${[0, 1, 2].map(c => `<div>${[0, 1, 2, 3, 4].map(r => { const n = c * 5 + r + 1; return `<div class="r"><b>${n}</b>${'ABCDE'.split('').map(x => `<i>${x}</i>`).join('')}</div>`; }).join('')}</div>`).join('')}</div></div>`;
  // Cevap anahtarı + analiz
  h += `<div class="sb"></div><div class="gun"><div class="no"><div><small>DENEME</small><b>✓</b></div></div><div><h2>Cevap anahtarı ve eksik konu tablosu</h2><p>Önce netini hesapla, sonra hangi konuda kaç yanlışın olduğunu tabloya yaz.</p></div><div class="sure">15 soru</div></div>`;
  h += `<div class="anahtar">${D.map((q, i) => `<div>${i + 1}<b>${q.cevap}</b></div>`).join('')}</div>`;
  h += `<div class="net"><div><b>Doğru</b><u></u></div><div><b>Yanlış</b><u></u></div><div><b>Boş</b><u></u></div><div><b>Net</b> = Doğru − Yanlış ÷ 4<u></u></div></div>`;
  const sat = N.konular.map(k => {
    const no = D.map((q, i) => q.konu === k.id ? i + 1 : 0).filter(Boolean);
    const oner = k.paket ? `<a href="${paketURL(s, k.paket)}">Konu Soru Paketi #${k.paket}: ${PAKET[s][k.paket].ad}<em>₺99 →</em></a>` : `<a href="${yapURL(s)}">Yapabilirim ${s} içinde bu konu: not, sorular, çözümler<em>İncele →</em></a>`;
    return `<tr><td><b>${md(k.ad)}</b></td><td>${no.join(', ')}</td><td class="y"><i></i></td><td>${oner}</td></tr>`;
  }).join('');
  h += `<h3 class="b"><i></i>Eksik konu tablosu</h3><table class="an"><tr><th>Konu</th><th>Sorular</th><th>Yanlış + boş</th><th>Bu konuda 2 ya da daha fazla yanlışın ya da boşun varsa</th></tr>${sat}</table>`;
  h += `<p style="font-size:9pt;color:var(--ink2);margin:5px 0 0">Bir konuda 2 ya da daha fazla yanlışın ya da boşun varsa önce tekrar notundaki o günün sayfasını yeniden oku, sonra o konudan yazılı tarzı soru çöz.</p><style>.cv td{padding:3.6px 6px}.cvb{margin:8px 0 3px}</style>`;
  h += L.cevapTablo(['ÇÖZÜM', 'Kısa çözümler'], D, 1);
  return h;
}
async function denemePromo(N) {
  const R = RENK[N.sinif], s = N.sinif;
  const q = await qr(`${SITE}/paket/${UTM}&utm_campaign=tatil${s}#${PAKET[s][N.paketler[0].no].a}`);
  const extra = `@page{size:A4;margin:12mm}${PK_CSS}
.pb{display:flex;justify-content:space-between;font:800 7.6pt 'Manrope';letter-spacing:.08em;color:var(--ana);margin-bottom:6px}
.ph{background:linear-gradient(115deg,#0f1638 0%,#2b3480 50%,#6a3fd0 100%);color:#fff;border-radius:16px;padding:18px 22px}
.ph .e{font:800 7.8pt 'Manrope';letter-spacing:.16em;color:var(--parlak)}
.ph h1{font-size:23pt;font-weight:800;margin:6px 0 6px;line-height:1.12}.ph p{color:#dfe4ff;font-size:10.4pt}
.pgr{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;margin-top:12px}
.orn1{border:1.5px solid var(--line);border-radius:12px;padding:8px 10px;margin-top:12px;text-align:center}
.orn1 b{font:800 7.6pt 'Manrope';color:var(--koyu);letter-spacing:.08em}
body{height:272mm;display:flex;flex-direction:column}body>*{flex:0 0 auto}.orn1{flex:1 1 0!important;min-height:0;display:flex;flex-direction:column}.orn1 div{flex:1 1 0;min-height:0;overflow:hidden;border-radius:7px;margin-top:4px;border:1px solid #e2e8f0;position:relative}
.orn1 div:after{content:'';position:absolute;left:0;right:0;bottom:0;height:14mm;background:linear-gradient(to bottom,rgba(255,255,255,0),#fff)}
.orn1 img{width:100%;display:block}
.orn1 span{display:block;font-size:8.6pt;color:var(--ink2);margin-top:3px}
.al{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(0,1fr);gap:12px;margin-top:12px;align-items:stretch}
.al>*{border:1.5px solid var(--line);border-radius:12px;padding:10px 13px;font-size:9.4pt}
.al .q{text-align:center;border-color:var(--ana);font:800 7.6pt 'Manrope'}.al .q svg{width:28mm;height:28mm;display:block;margin:0 auto 4px}
.al h4{font:800 10.4pt 'Manrope';margin-bottom:3px}
.kod{display:inline-block;border:2px dashed var(--ana);color:var(--koyu);font:800 12pt 'Manrope';letter-spacing:.08em;padding:2px 10px;border-radius:7px;margin-top:5px}
.bant{display:flex;justify-content:space-between;background:#1d2b53;color:#fff;border-radius:11px;padding:10px 14px;margin-top:12px;font-size:8.8pt}.bant b{color:#fcd34d}`;
  return L.head('Konu Soru Paketleri', R, extra) + `
<div class="pb"><span>BEN FİZİK YAPAMIYORUM</span><span>DENEMEDEN SONRA</span></div>
<div class="ph"><div class="e">EKSİK KONUN BELLİ OLDU | ŞİMDİ KAPAT</div><h1>Deneme test tarzıydı. Yazılı ise açık uçlu.</h1><p>Okuldaki yazılıda şık yok: çözümü yazarsın, öğretmen adım adım puan verir. <b>Konu Soru Paketleri</b> seni buna hazırlar: tek konudan 50 ve üzeri yazılı sorusu, her maddeye ayrıntılı çözüm ve puanlama.</p></div>
<div class="pgr">${N.paketler.map(p => paketKart(s, p.no, p.not)).join('')}</div>
<div class="orn1"><b>PAKETTEN ÖRNEK ÇÖZÜM VE PUANLAMA</b><div><img src="${img(`img/paket/ornek-${s}-cozum.webp`)}"></div><span>Her soruda adım adım çözüm, puan dağılımı ve “Dikkat” notu.</span></div>
<div class="al"><a class="q" href="${SITE}/paket/${UTM}&utm_campaign=tatil${s}#siniflar">${q}Okut ya da dokun<br>benfizikyapamiyorum.com/paket</a>
<a href="${yapURL(s)}"><h4>Bütün yıl için: Yapabilirim ${s}</h4>${s}. sınıfın bütün konuları tek dijital kitapta. Tek ödeme, abonelik yok. <b style="white-space:nowrap">₺599&nbsp;→</b></a>
<div><h4>Bu PDF’yi çözenlere %10</h4>Yapabilirim ve Yazılıya 3 Gün Kala’da Shopier ödeme adımında yaz:<br><span class="kod">NOTLAR10</span></div></div>
<a class="bant" href="${SITE}/ucretsiz/pdf${UTM}"><span>Okul açılınca her hafta yeni ücretsiz not: <b>Pazartesi 9 | Çarşamba 10 | Cuma 11. sınıf</b></span><span>benfizikyapamiyorum.com | @benfizikyapamiyorum</span></a>
</body></html>`;
}

const HEAD = (R, sag) => `<div style="width:100%;font-family:Arial,sans-serif;font-size:7.2pt;font-weight:700;color:${R.ana};padding:0 14mm;display:flex;justify-content:space-between;letter-spacing:.05em"><span>BEN FİZİK YAPAMIYORUM</span><span>${sag}</span></div>`;
const FOOT = (lab) => `<div style="width:100%;font-family:Arial,sans-serif;font-size:7.2pt;color:#6b7590;padding:0 14mm;display:flex;justify-content:space-between"><span>benfizikyapamiyorum.com | @benfizikyapamiyorum</span><span>${lab}</span><span><span class="pageNumber"></span></span></div>`;

(async () => {
  const s = +process.argv[2];
  const N = require(path.resolve(__dirname, s + '.js'));
  const R = RENK[s];
  const out = path.join(__dirname, 'out', String(s));
  fs.mkdirSync(out, { recursive: true });
  const W = (f, h) => fs.writeFileSync(path.join(out, f), h);
  W('not-kapak.html', kapakHTML(N, 'not'));
  W('not-govde.html', L.head(`Ara Tatil Fizik Kampı ${s}. Sınıf`, R) + notGovde(N) + '</body></html>');
  W('not-promo.html', await notPromo(N));
  W('deneme-kapak.html', kapakHTML(N, 'deneme'));
  W('deneme-govde.html', L.head(`Ara Tatil Fizik Denemesi ${s}. Sınıf`, R) + denemeGovde(N) + '</body></html>');
  W('deneme-promo.html', await denemePromo(N));

  const b = await chromium.launch();
  const pg = await b.newPage();
  const pdf = async (f, o = {}) => {
    await pg.goto('file://' + path.join(out, f + '.html'), { waitUntil: 'networkidle' });
    await pg.evaluate('document.fonts.ready');
    if (f === 'not-govde') {
      await pg.emulateMedia({ media: 'print' });
      const rap = await pg.evaluate(() => {
        const rap = [];
        const plan = document.querySelector('.pl'); const pp = document.createElement('div'); pp.className = 'pg'; plan.replaceWith(pp); pp.appendChild(plan);
        document.querySelectorAll('.gunw').forEach((w, gi) => {
          const nodes = Array.from(w.children); const pages = []; let pg = null;
          const yeni = () => { pg = document.createElement('div'); pg.className = 'pg'; w.appendChild(pg); pages.push(pg); };
          yeni();
          nodes.forEach((n, i) => {
            pg.appendChild(n);
            if (pg.scrollHeight > pg.clientHeight + 1 && pg.children.length > 1) {
              const tasinan = [n]; const once = pg.children[pg.children.length - 2];
              if (once && (once.classList.contains('isinma') || once.tagName === 'H3')) tasinan.unshift(once);
              yeni(); tasinan.forEach(t => pg.appendChild(t));
            }
          });
          const bos = pg.clientHeight - Array.from(pg.children).reduce((a, c) => a + c.getBoundingClientRect().height + parseFloat(getComputedStyle(c).marginTop) + parseFloat(getComputedStyle(c).marginBottom), 0);
          if (bos > 96) { const y = document.createElement('div'); y.className = 'yd'; y.innerHTML = '<div class="u">Yanlış defterim<span>Bu günü bitirdim <i></i></span></div><p>Yanlış yaptığın ya da emin olamadığın sorunun numarasını ve nedenini bir cümleyle yaz. Okul açılınca ilk buraya bak.</p><div class="cz">' + '<i></i>'.repeat(30) + '</div>'; pg.appendChild(y); }
          rap.push(`gün ${gi + 1}: ${pages.length} sayfa, son sayfa boşluk ${Math.round(bos)}px`);
          pages.forEach((p, k) => { if (p.scrollHeight > p.clientHeight + 1) rap.push(`UYARI taşma gün ${gi + 1} sayfa ${k + 1}`); });
        });
        return rap;
      });
      console.log(rap.join(' | '));
    }
    await pg.pdf({ path: path.join(out, f + '.pdf'), preferCSSPageSize: true, printBackground: true, ...o });
  };
  await pdf('not-kapak'); await pdf('not-promo'); await pdf('deneme-kapak'); await pdf('deneme-promo');
  await pdf('not-govde', { displayHeaderFooter: true, headerTemplate: HEAD(R, 'ARA TATİL FİZİK KAMPI'), footerTemplate: FOOT(`${s}. Sınıf Ara Tatil Fizik Kampı | Tekrar Notu`) });
  await pdf('deneme-govde', { displayHeaderFooter: true, headerTemplate: HEAD(R, 'ARA TATİL FİZİK DENEMESİ'), footerTemplate: FOOT(`${s}. Sınıf Ara Tatil Fizik Denemesi`) });
  // kapak görselleri (site kartı ve Reels için)
  for (const t of ['not', 'deneme']) {
    await pg.setViewportSize({ width: 794, height: 1123 });
    await pg.goto('file://' + path.join(out, t + '-kapak.html'), { waitUntil: 'networkidle' });
    await pg.evaluate('document.fonts.ready');
    await pg.screenshot({ path: path.join(out, t + '-kapak.png'), clip: { x: 0, y: 0, width: 794, height: 1123 } });
  }
  await b.close();
  const birles = (parts, hedef, title) => execFileSync('python3', ['-c', `
import sys
from pypdf import PdfWriter, PdfReader
w=PdfWriter()
for f in sys.argv[3:]:
    for p in PdfReader(f).pages: w.add_page(p)
w.add_metadata({'/Title': sys.argv[2], '/Author': 'Timur Yıldırım | Ben Fizik Yapamıyorum'})
w.write(sys.argv[1])
`, hedef, title, ...parts.map(p => path.join(out, p + '.pdf'))]);
  const notPdf = path.join(out, `ara-tatil-fizik-kampi-${s}-sinif.pdf`), denPdf = path.join(out, `ara-tatil-fizik-denemesi-${s}-sinif.pdf`);
  birles(['not-kapak', 'not-govde', 'not-promo'], notPdf, `${s}. Sınıf Ara Tatil Fizik Kampı Tekrar Notu`);
  birles(['deneme-kapak', 'deneme-govde', 'deneme-promo'], denPdf, `${s}. Sınıf Ara Tatil Fizik Denemesi`);
  const say0 = 0; const say = f => parseInt(execFileSync('pdfinfo', [f]).toString().match(/Pages:\s+(\d+)/)[1]);
  for (const [f, pre] of [[notPdf, 'n'], [denPdf, 'd']]) { fs.readdirSync(out).filter(x => x.startsWith(pre + '-') && x.endsWith('.png')).forEach(x => fs.unlinkSync(path.join(out, x))); execFileSync('pdftoppm', ['-r', process.argv[3] || '100', '-png', f, path.join(out, pre)]); }
  fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify({ sinif: s, gunler: N.gunler.map(g => ({ no: g.no, baslik: g.baslik, plan: g.plan || g.alt })), konular: N.konular.map(k => ({ ad: k.ad, paket: k.paket })), paketler: N.paketler.map(p => ({ no: p.no, ...PAKET[s][p.no] })), soruSayisi: TOP(N), gunSoru: GS(N), dk: DK, notSayfa: say(notPdf), denemeSayfa: say(denPdf) }, null, 1));
  console.log('OK', s, 'not', say(notPdf), 'sayfa | deneme', say(denPdf), 'sayfa');
})();
