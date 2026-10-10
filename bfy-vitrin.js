// BFY · Ana sayfa 3B vitrini — ürünler döner bir sahnede sırayla öne gelir; sürükle, tıkla, incele.
import * as THREE from './bfy-three.module.min.js';

const URUNLER = [
  { tip: 'phone', img: 'img/fizik9/ana.webp', ar: 780 / 1688, renk: '#2e6b57', kat: 'Öğrenci · Dijital paket', ad: 'Yapabilirim 9', alt: '21 konu, 504 soru, kavram kartları ve mini oyunlar. Telefon, tablet, PDF.', fiyat: '₺599', link: '9-sinif-fizik-paketi.html', dene: 'calis/' },
  { tip: 'tablet', img: 'img/fizik10/tablet.webp', ar: 1600 / 1112, renk: '#214e41', kat: 'Öğrenci · Dijital paket', ad: 'Yapabilirim 10', alt: '20 konu, 480 soru, adım adım çözümler. Kalemle çöz, kitapçığını yazdır.', fiyat: '₺599', link: '10-sinif-fizik-paketi.html', dene: 'calis/' },
  { tip: 'phone', img: 'img/fizik11/set.webp', ar: 780 / 1688, renk: '#3b4f8a', kat: 'Öğrenci · Dijital paket', ad: 'Yapabilirim 11', alt: '18 konu, 416 soru ve açık uçlu görev. Deneme modu ve ilerleme takibi.', fiyat: '₺599', link: '11-sinif-fizik-paketi.html', dene: 'calis/' },
  { tip: 'book', img: 'bfy10-dijital-kapak.png', ar: 1191 / 1684, renk: '#c16b4b', kalin: .14, kat: 'Öğrenci · Kitap (PDF)', ad: '10. Sınıf Fizik Soru Kitabı', alt: '336 sayfa: konu anlatımı, çözümlü örnekler, bağlam temelli sorular.', fiyat: '₺199', link: 'https://shopier.com/benfizikyapamiyorum/51233987', dene: 'BFY10_UCRETSIZ_ONIZLEME_10_SAYFA.pdf', deneAd: '10 sayfa incele' },
  { tip: 'book', img: 'kitap9-kapak.jpg', ar: 1178 / 1790, renk: '#1f2b4a', kalin: .12, kat: 'Öğrenci · Basılı kitap', ad: '9. Sınıf Fizik Ders Kitabı', alt: 'Konu anlatımı ve sorular, Maarif sırasıyla tek kitapta. Kargo dahil.', fiyat: '₺399', link: 'https://www.shopier.com/benfizikyapamiyorum/49999590' },
  { tip: 'box', img: 'img/hocakiti/10_kapak_ana.png', img2: 'img/hocakiti/01_kapak_ana.png', ar: 1, renk: '#163a63', kat: 'Öğretmen · Hoca Kiti', ad: 'Fizik Hoca Kiti', alt: '9, 10 ve 11. sınıf için 36 haftalık ders hazırlığı: plan, çalışma kâğıdı, test, sunum.', fiyat: '₺1.299’dan', link: 'materyaller.html', dene: 'materyaller.html#onizleme', deneAd: '2 hafta ücretsiz' },
  { tip: 'book', img: 'bfy-deney-kapak.webp', ar: 920 / 1300, renk: '#e9be64', kalin: .1, kat: 'Öğretmen · Etkinlik PDF', ad: 'Fizik Deney Atölyesi', alt: '84 deney etkinliği, 178 sayfa. Öğretmen yönergesi ve öğrenci sayfası birlikte.', fiyat: '₺299', link: 'materyaller.html#deney-planlari' },
  { tip: 'stand', img: 'fizo-3d-tanitim.webp', ar: 640 / 960, renk: '#203d35', kat: 'Uygulama · App Store', ad: 'Fizo', alt: 'Kişisel fizik çalışma arkadaşın. İlk 500 üyeye 150 gün ücretsiz.', fiyat: 'Ücretsiz başla', btn: 'App Store’dan indir', link: 'https://apps.apple.com/tr/app/fizo-ben-fizik-yapam%C4%B1yorum/id6815309623', dene: 'https://fizo.benfizikyapamiyorum.com', deneAd: 'Tarayıcıda kullan' },
  { tip: 'icon', img: 'hocam-3d-tanitim.png', ar: 1, renk: '#e8ede5', kat: 'Uygulama · App Store', ad: 'HocaMeet', alt: 'Öğrenci ve öğretmeni buluşturan uygulama. iPhone’da ve tarayıcıda.', fiyat: 'Ücretsiz', btn: 'App Store’dan indir', link: 'https://apps.apple.com/tr/app/hocameet/id6814831147', dene: 'https://hocameet.com/', deneAd: 'Tarayıcıda kullan' },
];

const root = document.getElementById('bfy-vitrin'); if (!root) throw 0;
const host = root.querySelector('.vitrin-sahne'), card = root.querySelector('.vitrin-kart'), dotsEl = root.querySelector('.vitrin-noktalar');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, mobile = Math.min(screen.width, screen.height) < 700;


/* ---------- bilgi kartı (HTML) ---------- */
const N = URUNLER.length, ext = u => /^https?:/.test(u);
let pos = 0;                                   // açılmış (sınırsız) indeks; öndeki ürün = pos mod N
const cur = () => ((pos % N) + N) % N;
function showCard(i) {
  const u = URUNLER[i];
  card.querySelector('.vk-kat').textContent = u.kat;
  card.querySelector('.vk-ad').textContent = u.ad;
  card.querySelector('.vk-alt').textContent = u.alt;
  card.querySelector('.vk-fiyat').textContent = u.fiyat;
  const a = card.querySelector('.vk-incele'); a.textContent = (u.btn || 'İncele') + ' ↗'; a.href = u.link; a.target = ext(u.link) ? '_blank' : ''; a.rel = ext(u.link) ? 'noopener' : '';
  const d = card.querySelector('.vk-dene'); d.hidden = !u.dene; if (u.dene) { d.href = u.dene; d.textContent = (u.deneAd || 'Ücretsiz dene') + ' ↗'; d.target = ext(u.dene) ? '_blank' : ''; }
  dotsEl.querySelectorAll('button').forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
  card.classList.remove('vk-anim'); void card.offsetWidth; card.classList.add('vk-anim');
}
let idle = 0, userT = 0;
function goTo(p, user) { pos = p; showCard(cur()); idle = 0; if (user) userT = 7; }
function go(i, user) { let d = i - cur(); if (d > N / 2) d -= N; if (d < -N / 2) d += N; goTo(pos + d, user); }
URUNLER.forEach((u, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', u.ad); b.onclick = () => go(i, true); dotsEl.appendChild(b); });
root.querySelector('.vitrin-onceki').onclick = () => goTo(pos - 1, true);
root.querySelector('.vitrin-sonraki').onclick = () => goTo(pos + 1, true);
root.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') goTo(pos - 1, true); if (e.key === 'ArrowRight') goTo(pos + 1, true); });
showCard(0);

/* ---------- 3B sahne ---------- */
let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); }
catch (e) { root.classList.add('vitrin-3d-yok'); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(26, 2, .1, 80);

// Stüdyo ortamı: yumuşak ışık kutuları olan bir oda (cam ve metal yüzeylerde gerçekçi yansıma için)
{ const room = new THREE.Scene(), box = new THREE.BoxGeometry(1, 1, 1);
  const wall = new THREE.Mesh(box, new THREE.MeshStandardMaterial({ color: '#d8d2c4', side: THREE.BackSide, roughness: 1 })); wall.scale.set(30, 16, 30); wall.position.y = 6; room.add(wall);
  const lamp = (w, h, x, y, z, rx, ry, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * .97, k * .92) })); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); room.add(m); };
  lamp(10, 4, 0, 13.9, 0, Math.PI / 2, 0, 6);            // tavan ışık kutusu
  lamp(6, 9, -14.9, 6, 2, 0, Math.PI / 2, 3.2);         // sol softbox
  lamp(4, 8, 14.9, 5, -4, 0, -Math.PI / 2, 2.2);        // sağ dolgu
  lamp(12, 2, 0, 4, -14.9, 0, 0, 2.8);                  // arka şerit (kenar parlaması)
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(room, .035).texture; scene.environmentIntensity = .9; }
scene.add(new THREE.HemisphereLight('#fffaf0', '#c9c1ae', .55));
const key = new THREE.SpotLight('#fff3e0', 120, 30, .55, .75, 1.6); key.position.set(-4.5, 8, 6.5); key.target.position.set(0, .6, 0); key.castShadow = true;
key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048); key.shadow.bias = -.00025; key.shadow.normalBias = .02; key.shadow.radius = 6; key.shadow.camera.near = 3; key.shadow.camera.far = 22; scene.add(key, key.target);
const rim = new THREE.DirectionalLight('#ffe8cc', 1.4); rim.position.set(3, 4, -6); scene.add(rim);

const loader = new THREE.TextureLoader(), aniso = renderer.capabilities.getMaxAnisotropy();
const tex = p => { const t = loader.load(p); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
const canvasT = (w, h, draw, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
function rShape(w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
// yuvarlak kenarlı blok (pahlı ekstrüzyon)
function slab(w, h, d, r, bev, mat) { const b = Math.min(bev, d / 2 - .001); const g = new THREE.ExtrudeGeometry(rShape(w - 2 * b, h - 2 * b, Math.max(.001, r - b)), { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 5, curveSegments: 16 });
  g.translate(0, 0, -(d - 2 * b) / 2); g.computeVertexNormals(); const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; return m; }
function flat(w, h, r, mat) { const g = new THREE.ShapeGeometry(rShape(w, h, r), 16); const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + .5, p.getY(i) / h + .5); return new THREE.Mesh(g, mat); }
const screenMat = t => new THREE.MeshBasicMaterial({ map: t, toneMapped: false, color: new THREE.Color(.93, .93, .93) });
const glassMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .04, metalness: 0, transparent: true, opacity: .14, envMapIntensity: 1.6, clearcoat: 1, clearcoatRoughness: .02, depthWrite: false });
const titanium = new THREE.MeshPhysicalMaterial({ color: '#2a302e', roughness: .28, metalness: .85, clearcoat: .6, clearcoatRoughness: .25, envMapIntensity: 1.2 });
const blackBezel = new THREE.MeshStandardMaterial({ color: '#050607', roughness: .2, metalness: .1 });
const pagesTex = canvasT(16, 512, (g, w, h) => { g.fillStyle = '#f5efdf'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(140,128,100,${.06 + Math.random() * .1})`; g.fillRect(0, y, w, 1); } });
const pagesMat = new THREE.MeshStandardMaterial({ map: pagesTex, roughness: .95 });

function device(u, t, W, H, D, rCorner, bezel) {
  const g = new THREE.Group();
  g.add(slab(W, H, D, rCorner, D * .45, titanium));
  const front = flat(W - .012, H - .012, rCorner - .006, blackBezel); front.position.z = D / 2 + .0005; g.add(front);
  const sw = W - 2 * bezel, sh = H - 2 * bezel, scr = flat(sw, sh, Math.max(.01, rCorner - bezel), screenMat(t)); scr.position.z = D / 2 + .0015; g.add(scr);
  const gl = flat(W - .012, H - .012, rCorner - .006, glassMat); gl.position.z = D / 2 + .003; gl.renderOrder = 2; g.add(gl);
  return g;
}
function makeItem(u) {
  const g = new THREE.Group(), t = tex(u.img);
  if (u.tip === 'phone') { const H = 1.5, W = H * .49, d = device(u, t, W, H, .075, .11, .028);
    const isl = flat(.17, .045, .022, blackBezel); isl.position.set(0, H / 2 - .065, .0395); d.add(isl);
    for (const [y, h] of [[.32, .16], [.12, .1]]) { const b = slab(.012, h, .02, .005, .004, titanium); b.position.set(-W / 2 - .004, y, 0); d.add(b); }
    const cam = slab(.26, .26, .025, .07, .01, titanium); cam.position.set(-W / 2 + .2, H / 2 - .2, -.05); d.add(cam);
    d.position.y = H / 2 + .02; d.rotation.x = -.04; g.add(d); g.userData.h = H; }
  else if (u.tip === 'tablet') { const W = 2.05, H = W / u.ar, d = device(u, t, W, H, .06, .1, .05);
    const cover = slab(W * .98, H * .55, .02, .05, .008, new THREE.MeshStandardMaterial({ color: '#214e41', roughness: .7 })); cover.position.set(0, -H * .1, -.2); cover.rotation.x = .55; d.add(cover);
    d.position.set(0, H / 2 + .07, 0); d.rotation.x = -.2; g.add(d); g.userData.h = H; }
  else if (u.tip === 'book') { const H = 1.5, W = H * u.ar, T = u.kalin || .12, board = .018, over = .022;
    const coverM = new THREE.MeshStandardMaterial({ map: t, roughness: .42, envMapIntensity: .8 }), sideM = new THREE.MeshStandardMaterial({ color: u.renk, roughness: .5, envMapIntensity: .7 });
    const fb = new THREE.Mesh(new THREE.BoxGeometry(W, H, board), [sideM, sideM, sideM, sideM, coverM, sideM]); fb.position.z = T / 2 - board / 2; fb.castShadow = true;
    const bb = new THREE.Mesh(new THREE.BoxGeometry(W, H, board), sideM); bb.position.z = -T / 2 + board / 2; bb.castShadow = true;
    const pg = new THREE.Mesh(new THREE.BoxGeometry(W - over * 1.6, H - over * 2, T - 2 * board), pagesMat); pg.position.x = over * .8; pg.castShadow = true;
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(T / 2, T / 2, H, 24, 1, true, Math.PI, Math.PI), sideM); sp.position.x = -W / 2; sp.castShadow = true;
    const b = new THREE.Group(); b.add(fb, bb, pg, sp); b.position.y = H / 2 + .01; b.rotation.y = -.18; g.add(b); g.userData.h = H; }
  else if (u.tip === 'box') { const H = 1.3, W = H, D = .36;
    const one = (img, col) => { const bx = new THREE.Group(); const coverM = new THREE.MeshStandardMaterial({ map: tex(img), roughness: .45 }), sideM = new THREE.MeshStandardMaterial({ color: col, roughness: .5 });
      const m = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), [sideM, sideM, sideM, sideM, coverM, sideM]); m.castShadow = m.receiveShadow = true; bx.add(m);
      const seam = new THREE.Mesh(new THREE.BoxGeometry(W + .004, .012, D + .004), new THREE.MeshStandardMaterial({ color: '#0b0d10', roughness: .6 })); seam.position.y = H / 2 - .16; bx.add(seam); return bx; };
    const back = one(u.img2, '#d29a2e'); back.position.set(-.5, H / 2, -.45); back.rotation.y = .42; const front = one(u.img, u.renk); front.position.set(.18, H / 2, .02); front.rotation.y = -.1; g.add(back, front); g.userData.h = H; }
  else if (u.tip === 'stand') { const H = 1.55, W = H * u.ar;
    const acr = slab(W + .12, H + .12, .06, .1, .025, new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .03, transparent: true, opacity: .22, clearcoat: 1, envMapIntensity: 1.8, depthWrite: false }));
    const img = flat(W, H, .07, screenMat(t)); img.position.z = .001;
    const wood = new THREE.MeshStandardMaterial({ color: '#b98a5a', roughness: .55 }), base = slab(W + .3, .12, .34, .05, .03, wood); base.rotation.x = -Math.PI / 2; base.position.y = .06;
    const st = new THREE.Group(); st.add(img, acr); st.position.y = H / 2 + .16; g.add(base, st); g.userData.h = H; }
  else if (u.tip === 'icon') { const S = 1.15;
    const tile = slab(S, S, .18, .27, .06, new THREE.MeshPhysicalMaterial({ color: '#f3efe6', roughness: .25, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: 1 }));
    const face = flat(S * .86, S * .86, .2, screenMat(t)); face.position.z = .091;
    const ic = new THREE.Group(); ic.add(tile, face); ic.position.y = S / 2 + .2; ic.rotation.x = -.06; g.add(ic); g.userData.h = S; }
  g.traverse(o => { if (o.isMesh && !o.material.transparent) o.castShadow = true; });
  return g;
}

/* zemin: yumuşak parlak yüzey, kenarlara doğru arka plana karışır */
const floorAlpha = canvasT(512, 512, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); r.addColorStop(0, '#fff'); r.addColorStop(.55, '#fff'); r.addColorStop(1, '#000'); g.fillStyle = r; g.fillRect(0, 0, w, h); }, false);
const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 96).rotateX(-Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: '#efe9db', roughness: .38, metalness: 0, clearcoat: .5, clearcoatRoughness: .3, alphaMap: floorAlpha, transparent: true, envMapIntensity: .6 }));
floor.receiveShadow = true; floor.position.z = -2; scene.add(floor);
const aoTex = canvasT(256, 256, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); r.addColorStop(0, 'rgba(40,30,20,.55)'); r.addColorStop(.5, 'rgba(40,30,20,.22)'); r.addColorStop(1, 'rgba(40,30,20,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });

// kaide: yuvarlatılmış kenarlı pürüzsüz disk (torna profili)
const PR = .8, PH = .09, pedGeo = (() => { const pts = [new THREE.Vector2(0, 0)], r = .03; pts.push(new THREE.Vector2(PR - .01, 0));
  for (let k = 0; k <= 8; k++) { const a = -Math.PI / 2 + k / 8 * Math.PI / 2; pts.push(new THREE.Vector2(PR - r + Math.cos(a) * r, r + Math.sin(a) * r)); }
  for (let k = 0; k <= 8; k++) { const a = k / 8 * Math.PI / 2; pts.push(new THREE.Vector2(PR - r + Math.cos(a) * r, PH - r + Math.sin(a) * r)); }
  pts.push(new THREE.Vector2(0, PH)); return new THREE.LatheGeometry(pts, 128); })();
const pedMat = new THREE.MeshPhysicalMaterial({ color: '#f4efe4', roughness: .32, clearcoat: .9, clearcoatRoughness: .12, envMapIntensity: .85 });
const ringGeo = new THREE.TorusGeometry(PR + .003, .009, 10, 160).rotateX(Math.PI / 2), ringMat = new THREE.MeshStandardMaterial({ color: '#c16b4b', roughness: .3, metalness: .5 });
const items = URUNLER.map((u, i) => {
  const holder = new THREE.Group();
  const ped = new THREE.Mesh(pedGeo, pedMat); ped.castShadow = ped.receiveShadow = true; holder.add(ped);
  const ring = new THREE.Mesh(ringGeo, ringMat); ring.position.y = PH / 2; holder.add(ring);
  const ao = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: aoTex, transparent: true, depthWrite: false })); ao.position.y = .002; holder.add(ao);
  const it = makeItem(u); it.scale.setScalar(1.18); it.position.y = PH; holder.add(it); holder.userData = { i, it };
  scene.add(holder); return holder; });

/* yerleşim: öndeki ürün ortada, komşular yay üzerinde geride */
function place(f, time) {
  items.forEach(h => { let d = h.userData.i - f; d = ((d % N) + N + N / 2) % N - N / 2; const a = Math.abs(d);
    const vis = 1 - THREE.MathUtils.smoothstep(a, 2.1, 2.9);
    h.visible = vis > .001;
    h.position.set(Math.sin(d * .6) * 4.3, 0, -(1 - Math.cos(d * .6)) * 3.6 - a * .3);
    h.rotation.y = -d * .42;
    const s = (1 - Math.min(a, 2.5) * .13) * (.35 + .65 * vis); h.scale.setScalar(s);
    const it = h.userData.it, front = Math.max(0, 1 - a);
    it.rotation.y = reduce ? 0 : front * Math.sin(time * .55) * .28;          // öndeki ürün yavaşça sağa-sola döner
    it.position.y = PH + (reduce ? 0 : Math.sin(time * 1.2 + h.userData.i) * .015) + front * .05; });
}

/* kamera, boyut */
let px = 0, py = 0, tpx = 0, tpy = 0;
function frameCam() { const narrow = camera.aspect < 1.25, dist = narrow ? 8.4 : 7.1;
  camera.position.set(px * .5, 2.15 + py * .25, dist); camera.lookAt(0, .95, -.5); }
function resize() { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); frameCam(); }
new ResizeObserver(resize).observe(host); resize();

/* etkileşim */
const ray = new THREE.Raycaster(), mp = new THREE.Vector2(), el = renderer.domElement; let drag = null, hover = false, fpos = 0;
el.addEventListener('pointerdown', e => { drag = { x: e.clientX, p: fpos, moved: false }; el.setPointerCapture(e.pointerId); });
el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); tpx = (e.clientX - r.left) / r.width * 2 - 1; tpy = (e.clientY - r.top) / r.height * 2 - 1;
  if (drag) { const dx = e.clientX - drag.x; if (Math.abs(dx) > 6) drag.moved = true; if (drag.moved) { fpos = drag.p - dx / host.clientWidth * 3.2; userT = 7; } } });
el.addEventListener('pointerup', e => { if (!drag) return; const moved = drag.moved; drag = null;
  if (moved) { goTo(Math.round(fpos), true); return; }
  const r = el.getBoundingClientRect(); mp.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(mp, camera);
  const hit = ray.intersectObjects(items.filter(h => h.visible), true)[0]; if (!hit) return; let o = hit.object; while (o && o.userData.i === undefined) o = o.parent; if (!o) return;
  if (o.userData.i === cur()) { const u = URUNLER[cur()]; if (ext(u.link)) window.open(u.link, '_blank', 'noopener'); else location.href = u.link; } else go(o.userData.i, true); });
el.addEventListener('pointerenter', () => hover = true); el.addEventListener('pointerleave', () => { hover = false; drag = null; tpx = tpy = 0; });

/* döngü */
let visible = false, last = performance.now(), time = 0;
new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) { last = performance.now(); requestAnimationFrame(loop); } }, { threshold: .05 }).observe(host);
function loop(now) {
  if (!visible) return; requestAnimationFrame(loop);
  const dt = Math.min(.05, (now - last) / 1000); last = now; time += dt;
  userT = Math.max(0, userT - dt);
  if (!reduce && !hover && !userT && !drag) { idle += dt; if (idle > 3.6) goTo(pos + 1, false); }
  if (!drag) fpos += (pos - fpos) * (1 - Math.exp(-dt * 4));
  px += (tpx - px) * (1 - Math.exp(-dt * 3)); py += (tpy - py) * (1 - Math.exp(-dt * 3)); frameCam();
  place(fpos, time);
  renderer.render(scene, camera);
}
root.classList.add('vitrin-hazir');
window.__vitrin = { goTo, jump: i => { goTo(i, true); fpos = pos; }, get pos() { return pos; } };
