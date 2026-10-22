/* BFY çevrimdışı çalışma: Yapabilirim (/calis/) ve Ben Fizik Yapabilirim TYT (/tyt/) uygulamaları.
   İnternet varken uygulama sayfası her açılışta ağdan güncellenir; yoksa son kaydedilen sürüm açılır.
   Formül (KaTeX), yazı tipi ve 3B (three.js) dosyaları bir kez indirilip saklanır.
   Lisans bilgisi bu dosyaya hiç girmez; tarayıcının kendi deposunda kalır. */
const UYG = 'bfy-uyg-v1';      // uygulama sayfaları (ağ öncelikli)
const VARLIK = 'bfy-varlik-v1'; // sürümü sabit dış dosyalar (önbellek öncelikli)
const KATEX = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/';
const KFONT = ['AMS-Regular', 'Caligraphic-Bold', 'Caligraphic-Regular', 'Fraktur-Bold', 'Fraktur-Regular', 'Main-Bold', 'Main-BoldItalic', 'Main-Italic', 'Main-Regular', 'Math-BoldItalic', 'Math-Italic', 'SansSerif-Bold', 'SansSerif-Italic', 'SansSerif-Regular', 'Script-Regular', 'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular', 'Typewriter-Regular'];
const ON = [KATEX + 'katex.min.css', KATEX + 'katex.min.js', ...KFONT.map(f => KATEX + 'fonts/KaTeX_' + f + '.woff2'),
  'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap'];
const UYG_YOL = /^\/(calis|tyt)(\/|$)/;
const DIS = /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VARLIK);
    await Promise.allSettled(ON.map(async u => { if (await c.match(u)) return; const r = await fetch(new Request(u, { mode: 'cors', credentials: 'omit' })); if (r.ok) await c.put(u, r); }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const tut = [UYG, VARLIK];
    for (const k of await caches.keys()) if (k.startsWith('bfy-') && !tut.includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});
// Sayfa ilk açılışta SW'den önce yüklendiği için kendini kaydettirir.
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.tur === 'kaydet' && typeof d.yol === 'string' && UYG_YOL.test(d.yol)) e.waitUntil(uygGetir(new URL(d.yol, self.location.origin).href).catch(() => {}));
});
const anahtar = u => { const x = new URL(u); return x.origin + x.pathname; };
async function uygGetir(u) {
  const r = await fetch(u, { cache: 'no-cache', credentials: 'same-origin' });
  if (r.ok && r.type === 'basic') { const c = await caches.open(UYG); await c.put(anahtar(u), r.clone()); }
  return r;
}
self.addEventListener('fetch', e => {
  const q = e.request; if (q.method !== 'GET') return;
  const u = new URL(q.url);
  if (u.origin === self.location.origin && q.mode === 'navigate' && UYG_YOL.test(u.pathname)) { e.respondWith(sayfa(e, q)); return; }
  if (DIS.test(q.url)) { e.respondWith(varlik(q)); return; }
});
// Ağ öncelikli; bağlantı yavaşsa 6 saniyede kayıtlı sürüm açılır, yeni sürüm arkada inmeye devam eder.
async function sayfa(e, q) {
  const c = await caches.open(UYG), k = anahtar(q.url);
  const ag = uygGetir(k);
  e.waitUntil(ag.then(() => {}, () => {}));
  const eski = await c.match(k);
  if (!eski) { try { return await ag; } catch (x) { return cevrimdisiSayfa(); } }
  return Promise.race([ag.then(r => (r.ok ? r : eski), () => eski), new Promise(r => setTimeout(() => r(eski), 6000))]);
}
async function varlik(q) {
  const c = await caches.open(VARLIK);
  const v = await c.match(q.url);
  const css = /fonts\.googleapis\.com/.test(q.url);
  if (v && !css) return v;
  try {
    const r = await fetch(q);
    if (r.ok || r.type === 'opaque') await c.put(q.url, r.clone());
    return r;
  } catch (x) { if (v) return v; throw x; }
}
function cevrimdisiSayfa() {
  return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>İnternet yok</title><body style="font-family:system-ui;padding:32px;color:#173a30;background:#f6f4ee"><h2>İnternet bağlantısı yok</h2><p>Kitabını internetsiz kullanabilmek için önce bir kez internete bağlıyken aç. Sonraki açılışlarda bağlantı olmadan da çalışır.</p></body>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
