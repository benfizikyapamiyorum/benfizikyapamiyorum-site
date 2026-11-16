// node reels2.js            → out/reels2/ara-tatil-reels-timur.mp4 (1080×1920, 30 fps, sesli)
// node reels2.js onizle     → out/reels2/on-*.jpg (seçili anlar)
// node reels2.js onizle 5.2 9.1 …  → verilen saniyeler
// Girdi: CEKIM klasöründe tam.mp4 (1080×1920, 30 fps çekim) ve ses48.wav (özgün ses). Çekim repoya girmez.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const NM = p => 'file://' + path.join(__dirname, '..', 'node_modules', p);
const CEKIM = process.env.CEKIM || '/tmp/claude-0/-home-claude/848e291e-f4e9-5f0b-a6d0-af1673d3bb48/scratchpad/cekim';
const R1 = path.join(__dirname, 'out', 'reels');   // sayfa PNG'leri (reels.js üretir)
const OUT = path.join(__dirname, 'out', 'reels2');
const FPS = 30;
const KELIME = process.env.KELIME || 'TATİL';
fs.mkdirSync(OUT, { recursive: true });

// ── Kurgu: çekimden alınan cümleler (kaynak saniyeleri) ──
const KES = [
  [43.47, 46.90],   // 1 Ara tatili fiziği toparlama ve geliştirme sürecine çevirelim.
  [54.30, 58.47],   // 2 9, 10 ve 11'ler için 5 günlük bir fizik programı hazırladım.
  [69.93, 74.23],   // 3 Dönemin başından bugüne kadar işlenen bütün fizik konuları içinde.
  [81.07, 82.40],   // 4 Her gün tek konu var.
  [89.07, 93.53],   // 5 Önce tek sayfalık şekilli özet, sonra kolaydan zora 10 tane soru.
  [100.30, 102.70], // 6 Günde en çok 40 dakikanızı alır.
  [108.33, 111.37], // 7 Beşinci gün 15 soruluk bir deneme çözüyorsunuz.
  [123.23, 125.75], // 8 Sonunda hangi konuda eksiğiniz olduğunu görüyorsunuz.
  [131.00, 135.80], // 9 Hem de hepsi ücretsiz. Yoruma TATİL yazın. Hemen size linki yollayayım.
];
const N = KES.map(([a, b]) => Math.round((b - a) * FPS));
const ts = [0]; N.forEach(n => ts.push(ts[ts.length - 1] + n / FPS));
const BEKLE = 0.9; // son karede kısa duruş
const SURE = ts[ts.length - 1] + BEKLE;
const TOPLAM = N.reduce((a, b) => a + b, 0);
// kaynak saniyesi → çıktı saniyesi
const o = (src) => { for (let i = 0; i < KES.length; i++) if (src >= KES[i][0] - 0.01 && src <= KES[i][1] + 0.01) return +(ts[i] + (src - KES[i][0])).toFixed(3); throw new Error('kurgu dışı: ' + src); };

// ── Altyazı ──
const ALT = [
  [43.47, 44.22, 'Ara tatili,'], [44.22, 45.30, 'fiziği <b>toparlama</b> ve'], [45.30, 46.36, '<b>geliştirme</b> sürecine'], [46.36, 46.90, 'çevirelim.'],
  [54.30, 56.00, '9, 10 ve 11’ler için'], [56.00, 57.84, '<b>5 günlük</b> bir fizik programı'], [57.84, 58.47, 'hazırladım.'],
  [69.93, 71.36, 'Dönemin başından'], [71.36, 72.58, 'bugüne kadar işlenen'], [72.58, 74.23, '<b>bütün</b> fizik konuları içinde.'],
  [81.07, 82.40, 'Her gün <b>tek konu</b> var.'],
  [89.07, 90.23, 'Önce tek sayfalık'], [90.23, 91.10, 'şekilli <b>özet,</b>'], [91.10, 92.19, 'sonra kolaydan zora'], [92.19, 93.53, '<b>10 tane soru.</b>'],
  [100.30, 101.01, 'Günde en çok'], [101.01, 102.70, '<b>40 dakikanızı</b> alır.'],
  [108.33, 109.06, 'Beşinci gün'], [109.06, 110.48, '<b>15 soruluk</b> bir deneme'], [110.48, 111.37, 'çözüyorsunuz.'],
  [123.23, 124.36, 'Sonunda hangi konuda'], [124.36, 125.10, '<b>eksiğiniz</b> olduğunu'], [125.10, 125.75, 'görüyorsunuz.'],
  [131.00, 132.50, 'Hem de hepsi <b>ücretsiz.</b>'], [132.50, 134.05, `Yoruma <b>${KELIME}</b> yazın.`], [134.05, 135.11, 'Hemen size linki'], [135.11, 135.80, 'yollayayım.'],
].map(([a, b, m]) => [o(a), o(b), m]);

// ── Video çerçevesinin durumları ──
const YX = 640, YY = 800; // yüz merkezi (kaynak karede)
const FULL = s => ({ x: 0, y: 0, w: 1080, h: 1920, r: 0, sc: s, ix: YX * (1 - s), iy: YY * (1 - s), b: 0 });
const CARD = { x: 60, y: 1000, w: 960, h: 590, r: 44, sc: 0.889, ix: 0, iy: -452, b: 1 };
const BUB = { x: 56, y: 1240, w: 316, h: 316, r: 158, sc: 0.60, ix: 158 - YX * 0.60, iy: 158 - 785 * 0.60, b: 1 };
const tM = o(56.0) - 0.08;  // "5 günlük…": karta küçül
const KF = [
  [0, FULL(1.0)], [ts[1] - 0.001, FULL(1.05)],
  [ts[1], FULL(1.13)], [tM, FULL(1.16)], [tM + 0.55, CARD, 1],
  [ts[3] - 0.001, CARD],
  [ts[3], FULL(1.10)], [ts[4] - 0.001, FULL(1.13)],
  [ts[4], FULL(1.0)], [ts[4] + 0.5, BUB, 1], [ts[5] - 0.001, BUB],
  [ts[5], FULL(1.0)], [ts[6] - 0.001, FULL(1.05)],
  [ts[6], FULL(1.12)], [ts[6] + 0.5, BUB, 1], [ts[8] - 0.001, BUB],
  [ts[8], FULL(1.10)], [SURE, FULL(1.17)],
];

// ── Sahne zamanları ──
const Z = {
  s1: [0, ts[1]], s2a: [ts[1], tM + 0.1], s2b: [tM + 0.25, ts[2]], s3: [ts[2], ts[3]], s4: [ts[3], ts[4]],
  s5: [ts[4], ts[5]], s6: [ts[5], ts[6]], s7: [ts[6], ts[7]], s8: [ts[7], ts[8]], s9: [ts[8], SURE],
};
const tSw = o(91.10) - 0.1;   // özet → sorular
const tY = o(132.50);          // "Yoruma…"
const tH = o(134.05);          // "Hemen…"
const sahne = (k, gir = .22, cik = .16, son = false) => `animation:gir ${gir}s ${Z[k][0]}s both cubic-bezier(.2,.8,.2,1)${son ? '' : `, cik ${cik}s ${(Z[k][1] - cik).toFixed(3)}s forwards ease-in`}`;
const d = (t) => `animation-delay:${t.toFixed(3)}s`;
const I = f => 'file://' + path.join(R1, f);
const tik = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22b8cf"/><path d="M6.5 12.5l3.6 3.6 7.4-8" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const KONU = [
  [9, ['Fizik bilimi', 'Nicelikler ve ölçme', 'Skaler ve vektörel', 'Vektörlerde toplama']],
  [10, ['Sabit hızlı hareket', 'İvmeli hareket', 'İş', 'Güç']],
  [11, ['Serbest düşme', 'İki boyutta hareket', 'Newton yasaları', 'Serbest cisim diyagramı']],
];
const s3b = Z.s3[0] + 0.25, s3ad = (Z.s3[1] - 0.5 - s3b) / 12;

const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
${['600', '700', '800'].map(w => `<link rel="stylesheet" href="${NM('@fontsource/manrope/' + w + '.css')}">`).join('')}
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;font-family:'Manrope',sans-serif;color:#fff;background:#0f1638}
.bg{position:absolute;inset:0;background:linear-gradient(165deg,#0f1638 0%,#1b2557 30%,#3a2f96 68%,#6a3fd0 100%)}
.kr{position:absolute;inset:-60px;background-image:linear-gradient(rgba(255,255,255,.055) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,.055) 1.5px,transparent 1.5px);background-size:60px 60px;animation:kay ${SURE}s linear both}
@keyframes kay{from{transform:translate(0,0)}to{transform:translate(-60px,-120px)}}
.orb{position:absolute;border-radius:50%;width:1000px;height:1000px;left:-420px;bottom:-380px;background:radial-gradient(circle,rgba(34,184,207,.4),rgba(0,0,0,0) 70%)}
#v{position:absolute;overflow:hidden;background:#222;z-index:5}
#v img{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0;filter:contrast(1.06) saturate(1.14) brightness(1.03)}
#vr{position:absolute;z-index:6;pointer-events:none;border:6px solid #fff;box-shadow:0 26px 60px rgba(5,8,30,.55)}
#scr{position:absolute;left:0;right:0;top:0;height:700px;z-index:7;background:linear-gradient(to bottom,rgba(15,22,56,.93) 0,rgba(15,22,56,.82) 400px,rgba(15,22,56,0) 690px)}
#scr2{position:absolute;left:0;right:0;bottom:0;height:640px;z-index:7;background:linear-gradient(to top,rgba(15,22,56,.9) 0,rgba(15,22,56,.55) 330px,rgba(15,22,56,0) 640px)}
.sc{position:absolute;inset:0;opacity:0;z-index:8}
.sc.alt{z-index:4}
@keyframes gir{from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:none}}
@keyframes cik{to{opacity:0;transform:translateY(-30px)}}
@keyframes soz{from{opacity:0;transform:translateY(60px) scale(.9)}to{opacity:1;transform:none}}
@keyframes pat{0%{opacity:0;transform:scale(.3) rotate(-12deg)}70%{opacity:1;transform:scale(1.12) rotate(2deg)}100%{opacity:1;transform:none}}
@keyframes ciz{to{stroke-dashoffset:0}}
.hap{display:inline-block;background:#c4b5fd;color:#1b2557;font-weight:800;font-size:32px;letter-spacing:.12em;border-radius:99px;padding:12px 30px;white-space:nowrap}
.hap.sr{background:#fcd34d}
h1{font-weight:800;line-height:1.06;letter-spacing:-.02em}
.vur{color:#c4b5fd}.sari{color:#fcd34d}
.soz{display:inline-block;opacity:0;animation:soz .34s both cubic-bezier(.2,.9,.2,1)}
.ust{position:absolute;left:70px;right:70px;top:196px}
/* 1 */
.s1 .k{font-size:76px;font-weight:800;margin-top:22px;line-height:1.1}
.s1 h1{font-size:104px;white-space:nowrap}
.s1 svg{position:absolute;left:-6px;top:384px;width:520px;height:40px;overflow:visible}
.s1 svg path{fill:none;stroke:#fcd34d;stroke-width:11;stroke-linecap:round;stroke-dasharray:560;stroke-dashoffset:560;animation:ciz .45s both ease-out}
/* 2a */
.s2a .kr3{position:absolute;left:90px;top:226px;display:flex;gap:30px}
.s2a .kr3 div{width:280px;height:250px;border-radius:44px;background:#fff;color:#1b2557;text-align:center;box-shadow:0 26px 60px rgba(5,8,30,.5);opacity:0;animation:pat .4s both}
.s2a .kr3 b{display:block;font-size:150px;font-weight:800;line-height:1;margin-top:26px;color:#5b3cc4;letter-spacing:-.04em}
.s2a .kr3 span{font-size:30px;font-weight:800;letter-spacing:.16em}
/* 2b */
.s2b h1{font-size:88px;margin-top:22px}
.s2b .yg{position:absolute;left:0;right:0;top:500px;height:480px}
.s2b .yg img{position:absolute;width:318px;border-radius:20px;box-shadow:0 30px 70px rgba(5,8,30,.6);border:2px solid rgba(255,255,255,.25)}
.s2b .yg img:nth-child(1){left:70px;top:36px;animation:k1 .6s ${(Z.s2b[0] + .1).toFixed(3)}s both cubic-bezier(.2,.9,.2,1)}
.s2b .yg img:nth-child(2){right:70px;top:36px;animation:k2 .6s ${(Z.s2b[0] + .2).toFixed(3)}s both cubic-bezier(.2,.9,.2,1)}
.s2b .yg img:nth-child(3){left:381px;top:0;z-index:2;animation:k3 .6s ${(Z.s2b[0] + .3).toFixed(3)}s both cubic-bezier(.2,.9,.2,1)}
@keyframes k1{from{opacity:0;transform:translate(-300px,200px) rotate(-30deg)}to{opacity:1;transform:rotate(-8deg)}}
@keyframes k2{from{opacity:0;transform:translate(300px,200px) rotate(30deg)}to{opacity:1;transform:rotate(8deg)}}
@keyframes k3{from{opacity:0;transform:translateY(300px) scale(.8)}to{opacity:1;transform:none}}
/* 3 */
.s3 h1{font-size:66px}
.s3 .ks{position:absolute;left:60px;right:60px;top:392px;display:flex;flex-direction:column;gap:16px}
.s3 .kc{height:178px;border-radius:32px;background:#fff;color:#1b2557;display:flex;align-items:center;padding:0 26px 0 22px;gap:24px;box-shadow:0 20px 50px rgba(5,8,30,.45);opacity:0;animation:soz .4s both cubic-bezier(.2,.9,.2,1)}
.s3 .kc>b{flex:0 0 122px;height:122px;border-radius:28px;background:linear-gradient(150deg,#5b3cc4,#3a2f96);color:#fff;font-size:70px;font-weight:800;display:flex;align-items:center;justify-content:center;letter-spacing:-.04em}
.s3 .kc ul{list-style:none;display:grid;grid-template-columns:auto auto;gap:16px 22px;flex:1;justify-content:space-between}
.s3 .kc li{font-size:27px;font-weight:800;display:flex;align-items:center;gap:10px;white-space:nowrap}
.s3 .kc li i{flex:0 0 32px;height:32px;opacity:0;animation:pat .3s both}
.s3 .kc li svg{display:block;width:32px;height:32px}
/* 4 */
.s4 h1{font-size:122px}
.s4 .gn{position:absolute;left:70px;top:486px;display:flex;gap:14px}
.s4 .gn span{font-size:32px;font-weight:800;border-radius:99px;padding:10px 24px;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.4);opacity:0;animation:pat .26s both}
.s4 .gn span.a{background:#fcd34d;color:#1b2557;border-color:#fcd34d}
/* 5, 7, 8 ortak panel */
.bs{position:absolute;left:70px;right:60px;top:190px;height:150px}
.bs .t{position:absolute;left:0;top:0;opacity:0}
.bs h1{font-size:62px;margin-top:14px;white-space:nowrap}
.pn{position:absolute;left:60px;top:366px;width:960px;height:1194px;border-radius:36px;overflow:hidden;background:#fff;box-shadow:0 40px 100px rgba(5,8,30,.6);border:3px solid rgba(255,255,255,.3)}
.pn img{display:block;width:960px}
.s5 .ser{position:absolute;left:0;top:0;width:1920px;display:flex;animation:yan .5s ${tSw.toFixed(3)}s both cubic-bezier(.6,0,.2,1)}
@keyframes yan{to{transform:translateX(-960px)}}
.s5 .ser div{width:960px;animation:yuk ${(Z.s5[1] - Z.s5[0]).toFixed(3)}s ${Z.s5[0]}s both linear}
@keyframes yuk{from{transform:translateY(0)}to{transform:translateY(-164px)}}
@keyframes cik2{to{opacity:0;transform:translateY(-24px)}}
/* 6 */
.s6 .hl{position:absolute;left:70px;top:206px;width:330px;height:330px}
.s6 .hl svg{width:330px;height:330px;transform:rotate(-90deg)}
.s6 .hl .n{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800}
.s6 .hl .n b{font-size:130px;line-height:1;letter-spacing:-.04em}
.s6 .hl .n span{font-size:34px;letter-spacing:.14em;color:#c4b5fd}
.s6 .yz{position:absolute;left:446px;top:232px}
.s6 .yz div{font-size:66px;font-weight:800;line-height:1.14}
.s6 .yz .bk{font-size:90px;white-space:nowrap}
/* 7 */
.s7 .iki img{position:absolute;width:610px;border-radius:22px;background:#fff;box-shadow:0 40px 90px rgba(5,8,30,.6);border:2px solid rgba(255,255,255,.3)}
.s7 .iki img:nth-child(1){left:36px;top:388px;animation:d1 .55s ${(Z.s7[0] + .15).toFixed(3)}s both cubic-bezier(.2,.9,.2,1)}
.s7 .iki img:nth-child(2){right:36px;top:640px;animation:d2 .55s ${(Z.s7[0] + .32).toFixed(3)}s both cubic-bezier(.2,.9,.2,1)}
@keyframes d1{from{opacity:0;transform:translateX(-300px) rotate(-22deg)}to{opacity:1;transform:rotate(-5deg)}}
@keyframes d2{from{opacity:0;transform:translateX(300px) rotate(22deg)}to{opacity:1;transform:rotate(5deg)}}
.s7 .rz{position:absolute;right:54px;top:392px;z-index:3;background:#fcd34d;color:#1b2557;font-weight:800;font-size:36px;border-radius:99px;padding:14px 30px;box-shadow:0 14px 30px rgba(5,8,30,.4);opacity:0;animation:pat .4s ${(Z.s7[0] + .9).toFixed(3)}s both}
/* 8 */
.s8 .pg{position:absolute;left:0;top:0;width:960px;transform-origin:50% 0;animation:yak .75s ${(Z.s8[0] + .25).toFixed(3)}s both cubic-bezier(.5,0,.2,1)}
@keyframes yak{from{transform:translateY(0) scale(1)}to{transform:translateY(46px) scale(1.1)}}
.s8 .pg svg{position:absolute;left:0;top:0;width:960px;height:1358px;overflow:visible}
.s8 .pg svg path{fill:none;stroke:#e11d48;stroke-width:7;stroke-linecap:round;stroke-dasharray:2400;stroke-dashoffset:2400;animation:ciz .6s ${(Z.s8[0] + 1.1).toFixed(3)}s both ease-out}
/* 9 */
.s9 .dm{position:absolute;left:70px;top:214px;transform:rotate(-3deg);opacity:0;animation:pat .4s ${(Z.s9[0] + .2).toFixed(3)}s both, cik2 .18s ${(tY - .22).toFixed(3)}s forwards}
.s9 .dm b{display:inline-block;background:#fcd34d;color:#1b2557;font-size:112px;font-weight:800;letter-spacing:-.02em;line-height:1.08;padding:6px 34px 12px;border-radius:26px;box-shadow:0 24px 60px rgba(5,8,30,.5)}
.s9 .dm span{display:block;margin:20px 0 0 10px;font-size:44px;font-weight:800}
.s9 .yr{position:absolute;left:60px;top:200px;width:960px;height:222px;background:#fff;color:#1b2557;border-radius:44px;box-shadow:0 30px 70px rgba(5,8,30,.55);display:flex;align-items:center;gap:28px;padding:0 40px;opacity:0;animation:soz .36s ${tY.toFixed(3)}s both cubic-bezier(.2,.9,.2,1)}
.s9 .yr .av{flex:0 0 118px;height:118px;border-radius:50%;background:linear-gradient(150deg,#c4b5fd,#5b3cc4);display:flex;align-items:center;justify-content:center}
.s9 .yr .av svg{width:66px;height:66px}
.s9 .yr small{display:block;font-size:34px;font-weight:700;color:#4b5675}
.s9 .yr .kl{font-size:118px;font-weight:800;line-height:1;color:#5b3cc4;letter-spacing:.02em;white-space:nowrap}
.s9 .yr .kl i{display:inline-block;width:8px;height:96px;background:#1b2557;margin-left:8px;vertical-align:-8px}
.s9 .ms{position:absolute;right:60px;top:446px;background:linear-gradient(135deg,#6a3fd0,#3a2f96);border:3px solid rgba(255,255,255,.35);border-radius:40px 40px 10px 40px;padding:22px 38px 24px;box-shadow:0 26px 60px rgba(5,8,30,.5);opacity:0;animation:soz .36s ${(tH + .15).toFixed(3)}s both cubic-bezier(.2,.9,.2,1)}
.s9 .ms small{display:block;font-size:28px;font-weight:800;letter-spacing:.12em;color:#c4b5fd}
.s9 .ms b{font-size:46px;font-weight:800;white-space:nowrap}
.s9 .tk{position:absolute;left:0;right:0;top:1424px;text-align:center;opacity:0;animation:soz .36s ${(ALT[ALT.length - 1][1] + .1).toFixed(3)}s both}
.s9 .tk span{display:inline-block;background:#fff;color:#1b2557;border-radius:99px;padding:18px 40px;font-size:42px;font-weight:800;box-shadow:0 20px 50px rgba(5,8,30,.5)}
/* altyazı */
#ay{position:absolute;top:1436px;z-index:9;text-align:center;transform:translateX(-50%);white-space:nowrap}
#ay span{display:inline-block;background:rgba(15,22,56,.9);border-radius:22px;padding:12px 30px 15px;font-weight:800;font-size:48px;line-height:1.15;box-shadow:0 12px 30px rgba(5,8,30,.35)}
#ay.kc span{font-size:40px;padding:10px 24px 13px}
#ay b{color:#fcd34d}
</style></head><body>
<div class="bg"></div><div class="kr"></div><div class="orb"></div>
<div id="v"><img id="vi"></div><div id="vr"></div>
<div id="scr"></div><div id="scr2"></div>

<div class="sc s1" style="animation:cik .14s ${(Z.s1[1] - .14).toFixed(3)}s forwards ease-in;opacity:1"><div class="ust">
 <span class="hap">ARA TATİL, 16–20 KASIM</span>
 <div class="k">Ara tatili</div>
 <h1><span class="soz" style="${d(o(44.22) - .08)}">fiziği</span> <span class="soz vur" style="${d(o(44.80) - .08)}">toparla,</span><br><span class="soz vur" style="${d(o(45.30) - .05)}">geliştir.</span></h1>
 <svg viewBox="0 0 520 40"><path d="M8 22 C120 4 260 34 512 12" style="${d(o(45.95))}"/></svg>
</div></div>

<div class="sc s2a" style="${sahne('s2a', .12, .2)}"><div class="kr3">
 <div style="${d(o(54.36))}"><b>9</b><span>. SINIF</span></div><div style="${d(o(54.90))}"><b>10</b><span>. SINIF</span></div><div style="${d(o(55.26))}"><b>11</b><span>. SINIF</span></div>
</div></div>

<div class="sc s2b" style="${sahne('s2b', .3, .2)}"><div class="ust"><span class="hap">9 | 10 | 11. SINIF</span><h1>5 günlük<br><span class="vur">fizik programı.</span></h1></div>
 <div class="yg"><img src="${I('n9-01.png')}"><img src="${I('n10-01.png')}"><img src="${I('n11-01.png')}"></div>
</div>

<div class="sc s3" style="${sahne('s3', .25, .16)}"><div class="ust"><h1>Dönemin başından bugüne<br><span class="vur">bütün konular içinde.</span></h1></div>
 <div class="ks">${KONU.map(([s, L], i) => `<div class="kc" style="${d(Z.s3[0] + .08 + i * .12)}"><b>${s}</b><ul>${L.map((k, j) => `<li><i style="${d(s3b + (i * 4 + j) * s3ad)}">${tik}</i>${k}</li>`).join('')}</ul></div>`).join('')}</div>
</div>

<div class="sc s4" style="${sahne('s4', .1, .12)}"><div class="ust"><h1>Her gün<br><span class="vur">tek konu.</span></h1></div>
 <div class="gn">${[1, 2, 3, 4, 5].map(g => `<span class="${g === 1 ? 'a' : ''}" style="${d(Z.s4[0] + .2 + g * .09)}">${g}. gün</span>`).join('')}</div>
</div>

<div class="sc s5 alt" style="${sahne('s5', .3, .14)}">
 <div class="bs"><div class="t" style="animation:soz .3s ${(Z.s5[0] + .1).toFixed(3)}s both, cik2 .2s ${(tSw - .05).toFixed(3)}s forwards"><span class="hap">ÖNCE</span><h1>Tek sayfalık <span class="vur">şekilli özet.</span></h1></div>
  <div class="t" style="animation:soz .3s ${(tSw + .2).toFixed(3)}s both"><span class="hap sr">SONRA</span><h1>10 soru, <span class="sari">kolaydan zora.</span></h1></div></div>
 <div class="pn"><div class="ser"><div><img src="${I('n11-03.png')}"></div><div><img src="${I('n11-04.png')}"></div></div></div>
</div>

<div class="sc s6" style="${sahne('s6', .1, .12)}">
 <div class="hl"><svg viewBox="0 0 330 330"><circle cx="165" cy="165" r="145" fill="rgba(15,22,56,.55)" stroke="rgba(255,255,255,.25)" stroke-width="24"/><circle id="hal" cx="165" cy="165" r="145" fill="none" stroke="#fcd34d" stroke-width="24" stroke-linecap="round" stroke-dasharray="911" stroke-dashoffset="911"/></svg><div class="n"><b id="hn">0</b><span>DAKİKA</span></div></div>
 <div class="yz"><div>Günde</div><div>en çok</div><div class="bk sari">40 dakika.</div></div>
</div>

<div class="sc s7 alt" style="${sahne('s7', .3, .16)}">
 <div class="bs"><div class="t" style="opacity:1"><span class="hap">5. GÜN</span><h1>15 soruluk <span class="vur">deneme.</span></h1></div></div>
 <div class="rz">30 dakika</div>
 <div class="iki"><img src="${I('d11-2.png')}"><img src="${I('d11-3.png')}"></div>
</div>

<div class="sc s8 alt" style="${sahne('s8', .25, .14)}">
 <div class="bs"><div class="t" style="opacity:1"><span class="hap sr">SONUNDA</span><h1>Eksiğin <span class="sari">hangi konuda?</span></h1></div></div>
 <div class="pn"><div class="pg"><img src="${I('d11-5.png')}"><svg viewBox="0 0 960 1358"><path id="cmb" d="M70 372 C240 350 760 350 905 372 C930 440 928 610 900 672 C740 692 220 692 62 672 C40 600 42 440 78 368"/></svg></div></div>
</div>

<div class="sc s9" style="${sahne('s9', .1, 0, true)}">
 <div class="dm"><b>Hepsi ücretsiz.</b><span>9, 10 ve 11. sınıf, PDF.</span></div>
 <div class="yr"><div class="av"><svg viewBox="0 0 24 24"><path d="M4 5.5h16v10H9.5L5 19.2V15.5H4z" fill="#fff"/></svg></div><div><small>Yoruma yaz:</small><div class="kl"><span id="kl"></span><i id="im"></i></div></div></div>
 <div class="ms"><small>MESAJ KUTUNDA</small><b>Linki hemen gönderiyorum.</b></div>
 <div class="tk"><span>@benfizikyapamiyorum</span></div>
</div>

<div id="ay"><span></span></div>
<script>
const KF=${JSON.stringify(KF)}, ALT=${JSON.stringify(ALT)}, Z=${JSON.stringify(Z)}, tY=${tY}, KEL=${JSON.stringify(KELIME)};
const ez=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, L=(a,b,k)=>a+(b-a)*k;
const v=document.getElementById('v'),vi=document.getElementById('vi'),vr=document.getElementById('vr'),scr=document.getElementById('scr'),scr2=document.getElementById('scr2'),ay=document.getElementById('ay');
const anim=document.getAnimations(); anim.forEach(a=>a.pause());
window.setT=async(t,src)=>{
  if(vi.dataset.s!==src){vi.dataset.s=src;vi.src=src;await vi.decode();}
  anim.forEach(a=>{a.currentTime=t*1000;});
  let i=0; while(i<KF.length-2&&t>=KF[i+1][0])i++;
  const A=KF[i],B=KF[i+1]; let k=Math.min(1,Math.max(0,(t-A[0])/Math.max(1e-6,B[0]-A[0]))); if(B[2])k=ez(k);
  const s={}; for(const q in A[1])s[q]=L(A[1][q],B[1][q],k);
  v.style.cssText='left:'+s.x+'px;top:'+s.y+'px;width:'+s.w+'px;height:'+s.h+'px;border-radius:'+s.r+'px';
  vi.style.transform='translate('+s.ix+'px,'+s.iy+'px) scale('+s.sc+')';
  vr.style.cssText='left:'+(s.x-3)+'px;top:'+(s.y-3)+'px;width:'+(s.w+6)+'px;height:'+(s.h+6)+'px;border-radius:'+(s.r+3)+'px;opacity:'+s.b;
  scr.style.opacity=1-s.b; scr2.style.opacity=(1-s.b)*.75;
  // altyazı
  const c=ALT.find(c=>t>=c[0]&&t<c[1]); const kucuk=s.w<400&&s.b>.5;
  ay.className=kucuk?'kc':''; ay.style.left=(kucuk?706:540)+'px'; ay.style.display=c?'block':'none';
  if(c){ay.firstChild.innerHTML=c[2]; const p=Math.min(1,(t-c[0])/.1); ay.firstChild.style.transform='scale('+(.9+.1*p)+')'; ay.firstChild.style.opacity=p;}
  // sayaç
  const p6=Math.min(1,Math.max(0,(t-Z.s6[0]-.15)/1.0)), e6=1-Math.pow(1-p6,3);
  document.getElementById('hn').textContent=Math.round(40*e6); document.getElementById('hal').style.strokeDashoffset=911*(1-e6*40/60);
  // yazılan kelime
  const n=Math.max(0,Math.min(KEL.length,Math.floor((t-tY-.42)/.13)+1)); document.getElementById('kl').textContent=t<tY+.42?'':KEL.slice(0,n);
  document.getElementById('im').style.opacity=(n>=KEL.length&&Math.floor(t*2.5)%2)?0:1;
};
</script></body></html>`;
fs.writeFileSync(path.join(OUT, 'reels2.html'), html);

(async () => {
  // çekim karelerini çıkar (bir kez)
  const FI = path.join(CEKIM, 'fi');
  if (!fs.existsSync(path.join(FI, String(TOPLAM - 1).padStart(5, '0') + '.jpg'))) {
    fs.rmSync(FI, { recursive: true, force: true }); fs.mkdirSync(FI, { recursive: true });
    let k = 0;
    KES.forEach(([a], i) => { execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', a.toFixed(3), '-i', path.join(CEKIM, 'tam.mp4'), '-frames:v', String(N[i]), '-q:v', '2', '-start_number', String(k), path.join(FI, '%05d.jpg')]); k += N[i]; });
  }
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(OUT, 'reels2.html'), { waitUntil: 'networkidle' });
  await p.evaluate('document.fonts.ready');
  const tek = process.argv[2] === 'onizle';
  const zamanlar = tek ? (process.argv.length > 3 ? process.argv.slice(3).map(Number) : [0, 1.2, 3.2, 4.6, 6.6, 9.2, 11.6, 12.8, 14.6, 16.9, 19.2, 21.6, 24.9, 26.6, 28.6, SURE - .1]) : Array.from({ length: TOPLAM + Math.round(BEKLE * FPS) }, (_, i) => i / FPS);
  const F = path.join(OUT, 'f'); if (!tek) { fs.rmSync(F, { recursive: true, force: true }); fs.mkdirSync(F, { recursive: true }); }
  for (let i = 0; i < zamanlar.length; i++) {
    const t = zamanlar[i], fr = Math.min(TOPLAM - 1, Math.round(t * FPS));
    await p.evaluate(([t, s]) => window.setT(t, s), [t, 'file://' + path.join(FI, String(fr).padStart(5, '0') + '.jpg')]);
    await p.screenshot({ path: tek ? path.join(OUT, `on-${String(i).padStart(2, '0')}.jpg`) : path.join(F, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: tek ? 78 : 94 });
  }
  await b.close();
  if (tek) return console.log('önizleme hazır', zamanlar.join(' '), 'süre', SURE.toFixed(2));
  // ses: aynı kesimler, kısa geçişlerle birleştir, düzeyi ayarla
  const fc = KES.map(([a], i) => { const dd = N[i] / FPS; return `[1:a]atrim=${a.toFixed(3)}:${(a + dd).toFixed(5)},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=${(dd - 0.03).toFixed(3)}:d=0.03[a${i}]`; }).join(';')
    + ';' + KES.map((_, i) => `[a${i}]`).join('') + `concat=n=${KES.length}:v=0:a=1,highpass=f=70,loudnorm=I=-15:TP=-1.5:LRA=9,aresample=48000,apad[a]`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(F, '%05d.jpg'), '-i', path.join(CEKIM, 'ses48.wav'), '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(OUT, 'ara-tatil-reels-timur.mp4')]);
  fs.copyFileSync(path.join(F, String(Math.round((o(46.5)) * FPS)).padStart(5, '0') + '.jpg'), path.join(OUT, 'kapak.jpg'));
  fs.rmSync(F, { recursive: true, force: true });
  console.log('OK', path.join(OUT, 'ara-tatil-reels-timur.mp4'), SURE.toFixed(2) + ' s');
})();
