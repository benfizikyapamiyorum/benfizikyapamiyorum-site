// node reels.js  → out/reels/ara-tatil-reels.mp4 (1080×1920, 30 fps, sessiz), kapak.jpg
// Kare kare çekim: CSS animasyonları duraklatılır, her karede currentTime ayarlanır.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const NM = p => 'file://' + path.join(__dirname, '..', 'node_modules', p);
const OUT = path.join(__dirname, 'out', 'reels');
const FPS = 30, SURE = 23;
const KELIME = process.env.KELIME || 'TATİL';

fs.mkdirSync(path.join(OUT, 'f'), { recursive: true });
const S = [9, 10, 11].filter(s => fs.existsSync(path.join(__dirname, 'out', String(s), `ara-tatil-fizik-toparlama-${s}-sinif.pdf`)));
// yüksek çözünürlüklü sayfalar
const pg = {};
for (const s of S) {
  const o = path.join(__dirname, 'out', String(s));
  execFileSync('pdftoppm', ['-r', '130', '-png', path.join(o, `ara-tatil-fizik-toparlama-${s}-sinif.pdf`), path.join(OUT, `n${s}`)]);
  execFileSync('pdftoppm', ['-r', '130', '-png', path.join(o, `ara-tatil-fizik-denemesi-${s}-sinif.pdf`), path.join(OUT, `d${s}`)]);
  const L = fs.readdirSync(OUT);
  pg[s] = { n: L.filter(f => f.startsWith(`n${s}-`)).sort(), d: L.filter(f => f.startsWith(`d${s}-`)).sort() };
}
const I = f => 'file://' + path.join(OUT, f);
const kapaklar = (S.length === 3 ? [9, 11, 10] : S).map(s => pg[s].n[0]);
const orta = S.includes(11) ? 11 : S[S.length - 1];
// iç sayfalar: her sınıftan 1. günün özeti + bir sınıftan soru sayfası
const ic = [pg[S[0]].n[2], pg[S[S.length - 1]].n[2], pg[S[S.length - 1]].n[3], pg[S[Math.floor(S.length / 2)]].n[3]];
const den = pg[orta].d;

// sahne zamanları (s)
const T = { s1: [0, 3.4], s2: [3.4, 8.2], s3: [8.2, 14.2], s4: [14.2, 18.4], s5: [18.4, SURE] };
const sahne = (k) => `animation:gir .45s ${T[k][0]}s both cubic-bezier(.2,.8,.2,1), cik .35s ${T[k][1] - .35}s forwards ease-in`;
const son = `animation:gir .45s ${T.s5[0]}s both cubic-bezier(.2,.8,.2,1)`;

const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
${['600', '700', '800'].map(w => `<link rel="stylesheet" href="${NM('@fontsource/manrope/' + w + '.css')}">`).join('')}
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;font-family:'Manrope',sans-serif;color:#fff;background:#0f1638}
.bg{position:absolute;inset:0;background:linear-gradient(165deg,#0f1638 0%,#1b2557 30%,#3a2f96 68%,#6a3fd0 100%)}
.kr{position:absolute;inset:-60px;background-image:linear-gradient(rgba(255,255,255,.055) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,.055) 1.5px,transparent 1.5px);background-size:60px 60px;animation:kay ${SURE}s linear both}
@keyframes kay{from{transform:translate(0,0)}to{transform:translate(-60px,-120px)}}
.orb{position:absolute;border-radius:50%}
.o1{width:900px;height:900px;right:-360px;top:-300px;background:radial-gradient(circle,rgba(255,255,255,.16),rgba(255,255,255,0) 70%);animation:nef ${SURE}s ease-in-out both}
.o2{width:1000px;height:1000px;left:-420px;bottom:-420px;background:radial-gradient(circle,rgba(34,184,207,.42),rgba(0,0,0,0) 70%);animation:nef ${SURE}s ease-in-out both reverse}
@keyframes nef{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
.sc{position:absolute;inset:0;opacity:0}
@keyframes gir{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes cik{to{opacity:0;transform:translateY(-70px)}}
.marka{position:absolute;left:70px;right:70px;top:150px;display:flex;justify-content:space-between;font-weight:800;font-size:27px;letter-spacing:.14em;color:#c9d2ff}
.marka b{color:#fff;letter-spacing:.03em}
.hap{display:inline-block;background:#c4b5fd;color:#1b2557;font-weight:800;font-size:34px;letter-spacing:.12em;border-radius:99px;padding:14px 34px}
h1{font-weight:800;line-height:1.03;letter-spacing:-.02em}
.vur{color:#c4b5fd}
.sari{color:#fcd34d}
/* Sahne 1 */
.s1 .ic{position:absolute;left:70px;right:70px;top:470px}
.s1 .kucuk{font-size:64px;font-weight:700;color:#dfe4ff;line-height:1.2}
.s1 h1{font-size:176px;margin-top:26px}
.s1 h1 span{display:block;opacity:0;animation:soz .5s both cubic-bezier(.2,.9,.2,1)}
@keyframes soz{from{opacity:0;transform:translateY(70px) scale(.94)}to{opacity:1;transform:none}}
.s1 .alt{margin-top:54px;font-size:54px;font-weight:700;color:#dfe4ff;opacity:0;animation:soz .5s 1.7s both}
.s1 .cz{position:absolute;left:70px;top:1330px;display:flex;gap:18px;opacity:0;animation:soz .5s 2.1s both}
.s1 .cz div{background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.28);border-radius:26px;padding:22px 30px;font-size:38px;font-weight:800}
.s1 .cz div b{display:block;font-size:26px;letter-spacing:.14em;color:#c4b5fd;margin-bottom:4px}
/* Sahne 2 */
.s2 .ust{position:absolute;left:70px;right:70px;top:300px}
.s2 h1{font-size:110px;margin-top:30px}
.s2 .yg{position:absolute;left:0;right:0;top:760px;height:860px}
.s2 .yg img{position:absolute;width:470px;border-radius:26px;box-shadow:0 40px 90px rgba(5,8,30,.6);border:2px solid rgba(255,255,255,.2)}
.s2 .yg img:nth-child(1){left:60px;top:90px;animation:k1 .8s ${T.s2[0] + .25}s both cubic-bezier(.2,.9,.2,1)}
.s2 .yg img:nth-child(2){right:60px;top:90px;animation:k2 .8s ${T.s2[0] + .4}s both cubic-bezier(.2,.9,.2,1)}
.s2 .yg img:nth-child(3){left:305px;top:0;z-index:2;animation:k3 .8s ${T.s2[0] + .55}s both cubic-bezier(.2,.9,.2,1)}
@keyframes k1{from{opacity:0;transform:translate(-300px,200px) rotate(-30deg)}to{opacity:1;transform:rotate(-9deg)}}
@keyframes k2{from{opacity:0;transform:translate(300px,200px) rotate(30deg)}to{opacity:1;transform:rotate(9deg)}}
@keyframes k3{from{opacity:0;transform:translateY(300px) scale(.8)}to{opacity:1;transform:none}}
.s2 .alt{position:absolute;left:70px;right:70px;top:1650px;text-align:center;font-size:50px;font-weight:800}
/* Sahne 3 */
.s3 .ust{position:absolute;left:70px;right:70px;top:290px}
.s3 h1{font-size:92px;margin-top:26px}
.s3 .pn{position:absolute;left:70px;right:70px;top:700px;height:1010px;border-radius:34px;overflow:hidden;background:#fff;box-shadow:0 40px 100px rgba(5,8,30,.6);border:3px solid rgba(255,255,255,.25)}
.s3 .pn .ser{position:absolute;left:0;top:0;width:100%;animation:akis ${T.s3[1] - T.s3[0]}s ${T.s3[0]}s both cubic-bezier(.45,0,.3,1)}
.s3 .pn img{display:block;width:100%}
@keyframes akis{0%{transform:translateY(0)}18%{transform:translateY(-4%)}100%{transform:translateY(var(--son))}}
.s3 .rz{position:absolute;right:40px;top:640px;z-index:3;background:#fcd34d;color:#1b2557;font-weight:800;font-size:36px;border-radius:99px;padding:16px 32px;transform:rotate(4deg);box-shadow:0 14px 30px rgba(5,8,30,.4)}
/* Sahne 4 */
.s4 .ust{position:absolute;left:70px;right:70px;top:290px}
.s4 h1{font-size:104px;margin-top:26px}
.s4 .iki{position:absolute;left:0;right:0;top:770px;height:900px}
.s4 .iki img{position:absolute;width:560px;border-radius:24px;background:#fff;box-shadow:0 40px 90px rgba(5,8,30,.6);border:2px solid rgba(255,255,255,.25)}
.s4 .iki img:nth-child(1){left:50px;top:40px;transform:rotate(-5deg);animation:k1b .7s ${T.s4[0] + .2}s both cubic-bezier(.2,.9,.2,1)}
.s4 .iki img:nth-child(2){right:50px;top:110px;transform:rotate(5deg);animation:k2b .7s ${T.s4[0] + .4}s both cubic-bezier(.2,.9,.2,1)}
@keyframes k1b{from{opacity:0;transform:translateX(-300px) rotate(-20deg)}to{opacity:1;transform:rotate(-5deg)}}
@keyframes k2b{from{opacity:0;transform:translateX(300px) rotate(20deg)}to{opacity:1;transform:rotate(5deg)}}
.s4 .cz{position:absolute;left:70px;right:70px;top:1660px;display:flex;gap:18px;justify-content:center}
.s4 .cz div{background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.3);border-radius:99px;padding:16px 26px;font-size:32px;font-weight:800;white-space:nowrap}
/* Sahne 5 */
.s5 .ic{position:absolute;left:70px;right:70px;top:400px;text-align:center}
.s5 h1{font-size:112px;margin-top:40px}
.s5 .yrm{margin:70px auto 0;background:#fff;color:#1b2557;border-radius:44px;padding:44px 40px 48px;box-shadow:0 40px 100px rgba(5,8,30,.55);width:860px;animation:nab 1.4s ${T.s5[0] + .6}s ease-in-out infinite}
@keyframes nab{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
.s5 .yrm small{display:block;font-size:40px;font-weight:700;color:#4b5675}
.s5 .yrm b{display:block;font-size:170px;font-weight:800;letter-spacing:.02em;line-height:1.05;color:#5b3cc4}
.s5 .yrm span{display:block;font-size:42px;font-weight:800}
.s5 .alt{margin-top:70px;font-size:48px;font-weight:700;color:#dfe4ff;line-height:1.35}
.s5 .alt b{color:#fff}
.s5 .tk{margin-top:54px;display:inline-block;border:3px solid rgba(255,255,255,.5);border-radius:99px;padding:18px 40px;font-size:42px;font-weight:800}
.ilerleme{position:absolute;left:70px;right:70px;bottom:330px;height:8px;border-radius:9px;background:rgba(255,255,255,.18);overflow:hidden}
.ilerleme i{display:block;height:100%;width:100%;background:#c4b5fd;transform-origin:left;animation:il ${SURE}s linear both}
@keyframes il{from{transform:scaleX(0)}to{transform:scaleX(1)}}
</style></head><body>
<div class="bg"></div><div class="kr"></div><div class="orb o1"></div><div class="orb o2"></div>
<div class="marka"><span>BEN FİZİK YAPAMIYORUM</span><b>@benfizikyapamiyorum</b></div>

<div class="sc s1" style="${sahne('s1')}"><div class="ic">
 <div class="kucuk">Ara tatili</div>
 <h1><span style="animation-delay:.35s">Fiziği</span><span class="vur" style="animation-delay:.7s">toparla,</span><span class="vur" style="animation-delay:1.0s">geliştir.</span></h1>
 <div class="alt">5 günlük program.<br>Günde en çok <span class="sari" style="white-space:nowrap">40 dakika.</span></div></div>
 <div class="cz"><div><b>SINIF</b>${S.join(', ')}</div><div><b>ÜCRET</b>Yok</div><div><b>BİÇİM</b>PDF</div></div>
</div>

<div class="sc s2" style="${sahne('s2')}"><div class="ust"><span class="hap">${S.join(' | ')}. SINIF</span><h1>Toparlama<br><span class="vur">programı hazır.</span></h1></div>
 <div class="yg">${kapaklar.map(k => `<img src="${I(k)}">`).join('')}</div>
 <div class="alt">Dönemin başından bugüne <span class="sari">bütün konular.</span></div>
</div>

<div class="sc s3" style="${sahne('s3')}"><div class="ust"><span class="hap">HER GÜN TEK KONU</span><h1>Tek sayfa özet,<br><span class="vur">10 ısınma sorusu.</span></h1></div>
 <div class="rz">Şekillerle, kısa ve net</div>
 <div class="pn"><div class="ser" id="ser">${ic.map(k => `<img src="${I(k)}">`).join('')}</div></div>
</div>

<div class="sc s4" style="${sahne('s4')}"><div class="ust"><span class="hap">5. GÜN</span><h1>15 soruluk<br><span class="vur">deneme.</span></h1></div>
 <div class="iki"><img src="${I(den[1])}"><img src="${I(den[den.length - 3])}"></div>
 <div class="cz"><div>30 dakika</div><div>Cevap anahtarı</div><div>Eksik konu tablosu</div></div>
</div>

<div class="sc s5" style="${son}"><div class="ic"><span class="hap">ÜCRETSİZ PDF</span><h1>Linki<br><span class="vur">göndereyim.</span></h1>
 <div class="yrm"><small>Yoruma yaz:</small><b>${KELIME}</b><span>Mesaj kutuna link gelsin.</span></div>
 <div class="alt">Tatilde çalışacak <b>arkadaşına gönder.</b></div>
 <div class="tk">Takip et: @benfizikyapamiyorum</div></div>
</div>
<div class="ilerleme"><i></i></div>
</body></html>`;
fs.writeFileSync(path.join(OUT, 'reels.html'), html);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(OUT, 'reels.html'), { waitUntil: 'networkidle' });
  await p.evaluate('document.fonts.ready');
  // sayfa şeridinin kayma miktarı: şerit yüksekliği − pencere yüksekliği
  await p.evaluate(() => { const s = document.getElementById('ser'); const h = s.scrollHeight, v = s.parentElement.clientHeight; s.style.setProperty('--son', `${-((h - v) / h) * 100}%`); });
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  const tek = process.argv[2] === 'onizle';
  const zamanlar = tek ? [2.9, 6, 9.5, 13, 16.5, 21] : Array.from({ length: FPS * SURE }, (_, i) => i / FPS);
  for (let i = 0; i < zamanlar.length; i++) {
    await p.evaluate(t => document.getAnimations().forEach(a => { a.currentTime = t * 1000; }), zamanlar[i]);
    await p.screenshot({ path: path.join(OUT, tek ? `on-${i}.jpg` : path.join('f', String(i).padStart(4, '0') + '.jpg')), type: 'jpeg', quality: tek ? 80 : 95 });
  }
  await b.close();
  if (tek) return console.log('önizleme kareleri hazır');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(OUT, 'f', '%04d.jpg'), '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', path.join(OUT, 'ara-tatil-reels.mp4')]);
  fs.copyFileSync(path.join(OUT, 'f', String(Math.round(2.9 * FPS)).padStart(4, '0') + '.jpg'), path.join(OUT, 'kapak.jpg'));
  fs.rmSync(path.join(OUT, 'f'), { recursive: true, force: true });
  console.log('OK', path.join(OUT, 'ara-tatil-reels.mp4'));
})();
