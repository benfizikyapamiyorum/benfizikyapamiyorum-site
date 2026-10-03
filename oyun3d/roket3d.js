// BFY · Roket İnişi — 3B görüntü katmanı (oyun mantığı sayfadaki betikte, burada yalnızca çizim)
import { THREE, createWorld, worldUVMaterial, canvasTex, Arrow, ENVS, clamp, lerp, rng, Noise, isMobile } from '../sim3d/bfy3d-core.js?v=5';

const G = window.BFY_GAME; if (!G) throw new Error('oyun yok');
const PX = G.SCALE;                         // 1 m = 7 px
const GROUND_PX = G.H - 70;                 // oyundaki zemin çizgisi
const toX = x => (x - G.W / 2) / PX, toY = y => (GROUND_PX - y) / PX;
const CEN = 30 / PX;                        // roket merkezi, ayak tabanından 4,3 m yukarıda

/* ---------- dünya ---------- */
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas'); canvas.id = 'g3d'; stage.insertBefore(canvas, stage.firstChild);
const W = createWorld({ stage, canvas, fov: 36, near: .2, far: 9000, shadowBox: 70, shadowFar: 400, bloom: [.35, .45, 1.2] });
const { scene, camera, renderer, sun, hemi } = W;
W.orbit.enabled = false;
Object.assign(ENVS, {
  r_earth: { ...ENVS.alps },
  r_mars: { bg: 'env/mars_bg.jpg', hdr: 'env/earth_1k.hdr', sunUV: [.6172, .2129], rot: 2.2, exposure: 1.0, sunI: 2.8, sunC: '#ffe2c8', hemi: .45 },
});

/* ---------- ortak malzemeler ---------- */
const white = new THREE.MeshPhysicalMaterial({ color: '#f4f5f7', roughness: .32, metalness: .15, clearcoat: .6, clearcoatRoughness: .2 });
const dark = new THREE.MeshStandardMaterial({ color: '#1d2024', roughness: .5, metalness: .6 });
const steel = new THREE.MeshStandardMaterial({ color: '#b9bec6', roughness: .3, metalness: 1 });
const copper = new THREE.MeshStandardMaterial({ color: '#8a4a26', roughness: .35, metalness: 1 });
const glass = new THREE.MeshPhysicalMaterial({ color: '#14324f', roughness: .05, metalness: .2, clearcoat: 1, envMapIntensity: 2 });

/* ---------- roket ---------- */
function decal() {
  return canvasTex(1024, 256, (g, w, h) => {
    g.fillStyle = '#f4f5f7'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1d2024'; g.fillRect(0, 0, w, 16); g.fillRect(0, h - 22, w, 22);
    g.fillStyle = '#e26d4f'; g.fillRect(0, 22, w, 8);
    g.save(); g.translate(w * .25, h / 2); g.rotate(-Math.PI / 2); g.fillStyle = '#1d2024'; g.font = '900 64px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BFY', 0, 0); g.restore();
    g.fillStyle = '#e30a17'; g.fillRect(w * .72, h * .38, 64, 42); g.fillStyle = '#fff'; g.beginPath(); g.arc(w * .72 + 25, h * .38 + 21, 12, 0, 7); g.fill(); g.fillStyle = '#e30a17'; g.beginPath(); g.arc(w * .72 + 28, h * .38 + 21, 9.5, 0, 7); g.fill();
  });
}
function makeRocket() {
  const root = new THREE.Group(), body = new THREE.Group(); body.position.y = -CEN; root.add(body);
  const bodyMat = white.clone(); bodyMat.map = decal();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.3, 5.4, 48, 1, true), bodyMat); tube.position.y = 1.5 + 2.7; body.add(tube);
  const ogive = []; for (let i = 0; i <= 24; i++) { const t = i / 24; ogive.push(new THREE.Vector2(1.25 * Math.sqrt(1 - t * t) * (1 - t * .15) + .02, 6.9 + t * 2.3)); }
  const nose = new THREE.Mesh(new THREE.LatheGeometry(ogive, 48), white); body.add(nose);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(1.33, 1.33, .35, 48), dark); band.position.y = 1.55; body.add(band);
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.1, .6, 48), dark); skirt.position.y = 1.1; body.add(skirt);
  const bellPts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; bellPts.push(new THREE.Vector2(.32 + .5 * t * t, 1 - t * .8)); }
  const bell = new THREE.Mesh(new THREE.LatheGeometry(bellPts, 32), copper); bell.material.side = THREE.DoubleSide; body.add(bell);
  const win = new THREE.Mesh(new THREE.SphereGeometry(.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glass); win.rotation.x = Math.PI / 2; win.position.set(0, 5.9, 1.2); win.scale.z = .35; body.add(win);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.44, .06, 10, 32), steel); ring.position.set(0, 5.9, 1.27); body.add(ring);
  // ızgara kanatçıklar
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, f = new THREE.Mesh(new THREE.BoxGeometry(.9, .7, .08), dark); f.position.set(Math.cos(a) * 1.6, 6.55, Math.sin(a) * 1.6); f.rotation.y = -a; body.add(f); }
  // iniş bacakları
  const legs = [];
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2 + Math.PI / 4, top = new THREE.Vector3(Math.cos(a) * 1.15, 2.6, Math.sin(a) * 1.15), foot = new THREE.Vector3(Math.cos(a) * 2.7, .12, Math.sin(a) * 2.7);
    const s = new THREE.Mesh(new THREE.CylinderGeometry(.11, .14, 1, 10), steel); W.orient(s, top, foot); body.add(s);
    const mid = top.clone().lerp(foot, .55), base = new THREE.Vector3(Math.cos(a) * 1.28, 1.35, Math.sin(a) * 1.28);
    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 1, 8), dark); W.orient(b2, base, mid); body.add(b2);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(.42, .5, .12, 20), dark); pad.position.copy(foot); body.add(pad); legs.push(pad);
  }
  body.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  // RCS iticileri (yan)
  const rcsMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.8, 3.2), transparent: true, opacity: .0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const rcsL = new THREE.Mesh(new THREE.ConeGeometry(.35, 2.4, 16, 1, true).rotateZ(Math.PI / 2), rcsMat.clone()); rcsL.position.set(-2.4, 6.3, 0); body.add(rcsL);
  const rcsR = new THREE.Mesh(new THREE.ConeGeometry(.35, 2.4, 16, 1, true).rotateZ(-Math.PI / 2), rcsMat.clone()); rcsR.position.set(2.4, 6.3, 0); body.add(rcsR);
  // ana alev
  const flameTex = canvasTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.12, 'rgba(255,236,170,1)'); gr.addColorStop(.4, 'rgba(255,150,60,.85)'); gr.addColorStop(1, 'rgba(255,60,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const r2 = g.createLinearGradient(0, 0, w, 0); r2.addColorStop(0, 'rgba(0,0,0,1)'); r2.addColorStop(.5, 'rgba(0,0,0,0)'); r2.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = r2; g.fillRect(0, 0, w, h); });
  const flameMat = new THREE.MeshBasicMaterial({ map: flameTex, color: new THREE.Color(2.4, 1.9, 1.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide });
  flameMat.forceSinglePass = true; // toplamalı karışımda arka/ön iki geçiş aynı sonucu verir; çift geçiş ilk itkide ayrı program derletiyordu
  const flame = new THREE.Group(); flame.position.y = .25; body.add(flame);
  for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(.75 - k * .18, 7 - k * 1.6, 24, 1, true).rotateX(Math.PI).translate(0, -(7 - k * 1.6) / 2, 0), flameMat); c.rotation.y = k; flame.add(c); }
  const core = new THREE.Mesh(new THREE.SphereGeometry(.55, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 3.5, 2.6), toneMapped: false })); core.scale.y = .5; flame.add(core);
  // itki ışığı doğrudan sahnede ve hep görünür: gizlenen ışık ışık sayısını değiştirip tüm malzemeleri yeniden derletir
  const light = new THREE.PointLight('#ffb070', 0, 60, 1.6); scene.add(light);
  return { root, body, flame, light, rcsL, rcsR };
}
const R = makeRocket(); scene.add(R.root);

/* ---------- iniş pisti ---------- */
function padTex(accent) {
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#2a2d31'; g.fillRect(0, 0, w, h); const r = rng(5);
    for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${r() < .5 ? 255 : 0},${r() < .5 ? 255 : 0},${r() < .5 ? 255 : 0},${r() * .04})`; g.fillRect(r() * w, r() * h, 2 + r() * 6, 2 + r() * 6); }
    g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 3; for (let i = 1; i < 8; i++) { g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, h); g.stroke(); }
    g.strokeStyle = accent; g.lineWidth = 16; g.strokeRect(24, 24, w - 48, h - 48);
    g.beginPath(); g.arc(w / 2, h / 2, 150, 0, 7); g.lineWidth = 18; g.stroke();
    g.fillStyle = accent; g.font = '900 190px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', w / 2, h / 2 + 8);
    g.font = '800 44px Arial'; g.fillText('BFY', 130, h - 70); g.fillText('İNİŞ PİSTİ', w - 190, h - 70);
  });
}
const padTexC = {}; // renk başına bir kez çizilir (her gezegen geçişinde yeni 1024×512 doku yüklenmesin)
const padTexFor = accent => padTexC[accent] || (padTexC[accent] = padTex(accent));
const padG = new THREE.Group(); scene.add(padG);
const PAD_W = 160 / PX, PAD_D = 16;
const padTop = new THREE.MeshStandardMaterial({ map: padTexFor('#f2c230'), roughness: .8, metalness: .1 });
const padSlab = new THREE.Mesh(new THREE.BoxGeometry(PAD_W, .5, PAD_D), [dark, dark, padTop, dark, dark, dark]); padSlab.position.y = -.24; padSlab.receiveShadow = padSlab.castShadow = true; padG.add(padSlab);
const lampMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.2, .6), toneMapped: false });
const lamps = []; for (let i = 0; i < 18; i++) { const side = i < 9 ? 1 : -1, t = (i % 9) / 8; const m = new THREE.Mesh(new THREE.SphereGeometry(.18, 12, 8), lampMat.clone()); m.position.set(-PAD_W / 2 + t * PAD_W, .08, side * (PAD_D / 2 + .15)); padG.add(m); lamps.push(m); }

/* ---------- gezegen sahneleri ---------- */
const stars = (() => { const n = 2600, p = new Float32Array(n * 3), c = new Float32Array(n * 3), r = rng(3); for (let i = 0; i < n; i++) { const u = r() * 2 - 1, a = r() * 6.283, s = Math.sqrt(1 - u * u); p.set([s * Math.cos(a) * 4000, u * 4000, s * Math.sin(a) * 4000], i * 3); const b = .5 + r() * .8; c.set([b, b, b * (.9 + r() * .2)], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, toneMapped: false, fog: false })); m.frustumCulled = false; scene.add(m); return m; })();
const skyBody = new THREE.Mesh(new THREE.SphereGeometry(160, 64, 48), new THREE.MeshStandardMaterial({ roughness: .8, fog: false })); scene.add(skyBody);
const saturnRing = new THREE.Mesh(new THREE.RingGeometry(200, 330, 96), new THREE.MeshBasicMaterial({ color: '#d9c7a0', transparent: true, opacity: .55, side: THREE.DoubleSide, fog: false, forceSinglePass: true })); scene.add(saturnRing);
// sis hep aynı nesne: null ↔ FogExp2 geçişi tüm gölgelendiricileri yeniden derletiyordu; sissiz gezegende yoğunluk 0
scene.fog = new THREE.FogExp2('#000000', 0);

const texC = {}; // dokular yol başına bir kez yüklenir (Ay ve Titan aynı dokuları paylaşır)
const tx = (path, srgb = true) => texC[path] || (texC[path] = W.tex(path, srgb));
function groundTex(key) { const P = { moon: 'moon', mars: 'mars', titan: 'moon' }[key]; return P ? { col: tx(`tex/${P}_col.jpg`), nor: tx(`tex/${P}_nor.jpg`, false), arm: tx(`tex/${P}_arm.jpg`, false) } : { col: tx('tex/grass_col.jpg'), nor: tx('tex/grass_nor.jpg', false), arm: tx('tex/grass_rough.jpg', false) }; }
const craterH = (x, z, seed) => { let h = Noise.fbm(x * .008 + seed, z * .008, 4) * 9; const r = rng(seed * 100 | 0);
  for (let i = 0; i < 34; i++) { const cx = (r() - .5) * 1400, cz = -40 - r() * 900, cr = 6 + r() * 38, d = Math.hypot(x - cx, z - cz) / cr; if (d < 1.4) h += d < 1 ? (d * d - 1) * cr * .22 : Math.exp(-(d - 1) * 8) * cr * .08; }
  const near = clamp((-z - 20) / 60, 0, 1) * clamp((Math.abs(x) - 0) / 1, 0, 1); return h * near * near; };
let ground = null;
const grounds = {}; // gezegen başına zemin + kayalar bir kez kurulur, sonra yalnızca sahneye takılıp çıkarılır
const PL = {
  Ay:      { key: 'moon', sky: 'space', tint: '#b8b8b6', tile: 6, fog: null, sunDir: [-.6, .45, .55], sunI: 5, hemi: .06, envI: .12, exp: 1.05, pad: '#f2c230', body: 'earth' },
  Mars:    { key: 'mars', env: 'r_mars', tint: '#f0b48a', tile: 5, fog: ['#c79570', .0022], sunI: 2.8, hemi: .45, envI: 1, exp: 1, pad: '#ffffff' },
  'Dünya': { key: 'earth', env: 'r_earth', tint: '#aab87e', tile: 3.2, fog: null, sunI: 3.4, hemi: .5, envI: 1, exp: .95, pad: '#f2c230' },
  'Jüpiter': { key: 'jupiter', sky: 'jupiter', fog: ['#c9a574', .0035], sunDir: [-.4, .6, .5], sunI: 2.2, hemi: .9, envI: 1, exp: 1, pad: '#f2c230' },
  Titan:   { key: 'titan', sky: 'titan', tint: '#6f5a44', tile: 6, fog: ['#b77a3a', .0055], sunDir: [-.3, .8, .3], sunI: .9, hemi: 1.1, envI: .9, exp: 1.25, pad: '#ffd27a', body: 'saturn' },
};
function skyCanvas(kind) {
  return canvasTex(2048, 1024, (g, w, h) => {
    if (kind === 'jupiter') {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#20314f'); gr.addColorStop(.38, '#6e7ea0'); gr.addColorStop(.5, '#e8cfa2'); gr.addColorStop(.62, '#b68656'); gr.addColorStop(1, '#5a3a20'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      const r = rng(8); for (let i = 0; i < 90; i++) { const y = h * (.5 + r() * .5), bh = 4 + r() * 22; g.fillStyle = `rgba(${150 + r() * 90 | 0},${100 + r() * 70 | 0},${50 + r() * 50 | 0},${.12 + r() * .25})`; g.beginPath(); g.ellipse(r() * w, y, 200 + r() * 700, bh, 0, 0, 7); g.fill(); }
      g.fillStyle = 'rgba(190,80,50,.5)'; g.beginPath(); g.ellipse(w * .7, h * .66, 90, 34, 0, 0, 7); g.fill();
    } else if (kind === 'titan') {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#6e4a22'); gr.addColorStop(.45, '#c98a45'); gr.addColorStop(.52, '#e0a560'); gr.addColorStop(1, '#5a3a1c'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }
  }, { srgb: true });
}
/* gökyüzü / ortam önbelleği: her gezegenin {arka plan, ortam, dönüş, güneş} değeri bir kez üretilir.
   W.loadEnv her çağrıda 4096×2048 arka planı ve yeni PMREM'i baştan yüklüyordu (GPU belleği sızıyordu). */
const skyC = {}, BLACK = new THREE.Color('#000');
let envQ = Promise.resolve();
const withTimeout = (p, ms) => Promise.race([p, new Promise(res => setTimeout(res, ms))]);
function loadEnvKey(key) { // W.loadEnv sahneye doğrudan yazar: aynı anda tek yükleme olsun ki doğru sonuç yakalansın
  const k = 'env:' + key; if (skyC[k]) return Promise.resolve(skyC[k]);
  const job = envQ.then(() => skyC[k] || W.loadEnv(key).then(() => {
    skyC[k] = { bg: scene.background, env: scene.environment, rot: scene.backgroundRotation.y, sunDir: W.sunDir.clone(), sunC: sun.color.clone() };
    resync(); return skyC[k];
  }));
  envQ = job.catch(() => {});
  return withTimeout(job, 20000);
}
async function loadSky(P) {
  const k = P.env ? 'env:' + P.env : P.sky; if (skyC[k]) return skyC[k];
  if (P.env) return loadEnvKey(P.env);
  if (P.sky === 'space') { const e = await loadEnvKey('r_earth'); if (!e) return null; return (skyC[k] = { ...e, bg: BLACK }); }
  const t = skyCanvas(P.sky); t.mapping = THREE.EquirectangularReflectionMapping;
  return (skyC[k] = { bg: t, env: W.pmrem.fromEquirectangular(t).texture, rot: ENVS.r_earth.rot, sunC: new THREE.Color(ENVS.r_earth.sunC) });
}
let earthMat = null; const saturnMat = new THREE.MeshStandardMaterial({ roughness: .8, fog: false, color: '#e0c894' });
function setLook(P) { // gezegene ait ışık, sis ve gök cisimleri (senkron, derleme gerektirmez)
  stars.visible = P.sky === 'space'; skyBody.visible = !!P.body; saturnRing.visible = P.body === 'saturn';
  if (P.sunDir) W.sunDir.set(...P.sunDir).normalize();
  sun.intensity = P.sunI; hemi.intensity = P.hemi; scene.environmentIntensity = P.envI; renderer.toneMappingExposure = P.exp; scene.backgroundIntensity = 1; scene.backgroundBlurriness = 0;
  if (P.fog) { scene.fog.color.set(P.fog[0]); scene.fog.density = P.fog[1]; } else scene.fog.density = 0;
  // dokulu/dokusuz iki ayrı malzeme: tek malzemede map değiştirmek programı silip her geçişte yeniden derletiyordu
  if (P.body === 'earth') { skyBody.material = earthMat || (earthMat = new THREE.MeshStandardMaterial({ roughness: .8, fog: false, map: W.tex('tex/earth_day.jpg') })); skyBody.scale.setScalar(1); }
  if (P.body === 'saturn') { skyBody.material = saturnMat; skyBody.scale.setScalar(1.3); }
}
function setSky(P, S) {
  if (!S) return;
  scene.background = S.bg; scene.environment = S.env;
  scene.backgroundRotation.set(0, S.rot, 0); scene.environmentRotation.set(0, S.rot, 0);
  if (S.sunDir) W.sunDir.copy(S.sunDir); sun.color.copy(S.sunC);
  setLook(P); // gezegenin kendi güneş yönü/şiddeti ortamınkinin üstüne yazılır
}
// sırada bekleyen bir W.loadEnv geç çalışıp sahneyi başka gezegenin ortamıyla bırakırsa düzelt
function resync() { const P = PL[cur]; if (!P) return; const S = skyC[P.env ? 'env:' + P.env : P.sky]; if (S) setSky(P, S); }

function buildGround(P) {
  if (P.key === 'jupiter') { const d = makeDeck(); d.userData.rocks = Promise.resolve(); return d; }
  const g = new THREE.Group(), rocks = new THREE.Group(); g.add(rocks); g.userData.key = P.key;
  const T = groundTex(P.key), N = isMobile ? 160 : 240;
  const geo = new THREE.PlaneGeometry(2400, 1600, N, N).rotateX(-Math.PI / 2); geo.translate(0, 0, -400);
  if (P.key !== 'earth') { const p = geo.attributes.position, seed = P.key === 'mars' ? 2.3 : P.key === 'titan' ? 4.1 : 1.1; for (let i = 0; i < p.count; i++) p.setY(i, craterH(p.getX(i), p.getZ(i), seed) - .02); geo.computeVertexNormals(); }
  const m = worldUVMaterial({ map: T.col, normalMap: T.nor, roughnessMap: T.arm, tile: P.tile, tint: P.tint, normalScale: P.key === 'earth' ? 1 : 1.4, envMapIntensity: .7 });
  { const ob = m.onBeforeCompile, fade = P.key === 'earth'; m.transparent = fade; m.onBeforeCompile = sh => { ob(sh);
      sh.fragmentShader = sh.fragmentShader.replace('void main() {', `float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
        void main() {`).replace('#include <color_fragment>', `#include <color_fragment>
        { float n = vn(vWPos.xz / 9.) * .55 + vn(vWPos.xz / 37. + 7.) * .45; diffuseColor.rgb *= mix(.62, 1.25, n); }`)
      .replace('#include <opaque_fragment>', '#include <opaque_fragment>' + (fade ? '\n gl_FragColor.a *= 1.0 - smoothstep(170.0, 420.0, length(vWPos.xz - cameraPosition.xz));' : '')); };
    m.customProgramCacheKey = () => 'rg' + P.key; }
  const mesh = new THREE.Mesh(geo, m); mesh.receiveShadow = true; g.add(mesh);
  // kayalar (kaynak malzeme başına tek kopya; eskiden her kaya için ayrı klon)
  const file = P.key === 'earth' ? 'boulder_01' : 'namaqualand_boulder_02';
  g.userData.rocks = W.gltf(`models/${file}/${file}_lo.gltf`).then(o => { const r = rng(7), src = []; o.traverse(q => { if (q.isMesh) src.push(q); });
    const mats = src.map(q => { const k = q.material.clone(); k.color.set(P.tint); return k; });
    for (let i = 0; i < (P.key === 'earth' ? 10 : 34); i++) { let x = (r() - .5) * 320, z = -r() * 160 + 20; if (Math.abs(z) < 14 && Math.abs(x) < 80) z -= 30; const s = (P.key === 'earth' ? .8 : .6) + r() * 2.4;
      const c = new THREE.Group(); src.forEach((q, j) => { const k = new THREE.Mesh(q.geometry, mats[j]); k.castShadow = k.receiveShadow = true; c.add(k); });
      c.position.set(x, craterH(x, z, P.key === 'mars' ? 2.3 : P.key === 'titan' ? 4.1 : 1.1) - .2, z); c.scale.setScalar(s); c.rotation.y = r() * 6; rocks.add(c); } })
    .catch(e => console.warn('kayalar yüklenemedi', e));
  return g;
}
function makeGround(P) {
  const g = grounds[P.key] || (grounds[P.key] = buildGround(P));
  if (ground && ground !== g) scene.remove(ground);
  ground = g; if (!g.parent) scene.add(g);
}
function makeDeck() {
  const g = new THREE.Group(), deckMat = new THREE.MeshStandardMaterial({ map: canvasTex(512, 512, (x, w, h) => { x.fillStyle = '#5a5f66'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 4; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); } }, { repeat: [20, 6] }), roughness: .6, metalness: .7 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(170, 1.2, 46), deckMat); deck.position.y = -.61; deck.receiveShadow = true; g.add(deck);
  for (const z of [-23, 23]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(170, 1.1, .3), steel); rail.position.set(0, .6, z); g.add(rail); }
  const balMat = new THREE.MeshStandardMaterial({ color: '#e8e2d6', roughness: .5 }), balGeo = new THREE.SphereGeometry(9, 32, 24), cabGeo = new THREE.CylinderGeometry(.15, .15, 10, 6);
  for (let i = 0; i < 8; i++) { const b = new THREE.Mesh(balGeo, balMat); b.scale.y = .7; b.position.set(-75 + i * 21.4, -16, (i % 2 ? 1 : -1) * 12); g.add(b);
    const cab = new THREE.Mesh(cabGeo, dark); cab.position.set(b.position.x, -6, b.position.z * .6); g.add(cab); }
  // bulut denizi
  const cl = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000, 1, 1).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#e6c89a', roughness: 1, map: canvasTex(512, 512, (x, w, h) => { const r = rng(4); x.fillStyle = '#d8b07a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(255,${230 + r() * 25 | 0},${190 + r() * 40 | 0},${r() * .25})`; x.beginPath(); x.ellipse(r() * w, r() * h, 20 + r() * 60, 6 + r() * 20, 0, 0, 7); x.fill(); } }, { repeat: [40, 40] }) }));
  cl.position.y = -28; g.add(cl); g.userData.clouds = cl; g.userData.key = 'jupiter';
  return g;
}

/* ---------- efekt örnekleri (önceden derleme için) ---------- */
const flashTex = canvasTex(128, 128, g => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(.25, 'rgba(255,200,110,.95)'); gr.addColorStop(.6, 'rgba(255,110,30,.4)'); gr.addColorStop(1, 'rgba(255,60,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
const debris = []; const debGeo = new THREE.BoxGeometry(.5, .3, .4);
const mkDeb = mat => { const m = new THREE.Mesh(debGeo, mat); m.castShadow = true; return m; };
// kırıklar + alev/itici/ok malzemeleri: kamera önünde gerçekten çizilsinler ki programlar oyundaki hedef (son işleme tamponu) için derlensin
// roketin kopyası da: çakılınca roket gizli kalır, sonraki gezegenin ön derlemesinde görünmeyebilir
const warmObjs = () => { const rk = new THREE.Group(), b = R.body.clone(); b.traverse(o => { o.visible = true; }); rk.add(b); rk.scale.setScalar(.1);
  return [mkDeb(white), mkDeb(dark), rk, ...[R.flame.children[0].material, R.rcsL.material, arT.mat].map(m => new THREE.Mesh(debGeo, m))]; };

let cur = null, ready = false, applyTok = 0, applied = null;
const warmed = {};
async function applyPlanet(name) {
  const P = PL[name] || PL.Ay; if (cur === name) return; cur = name; applied = null; const tok = ++applyTok;
  // gök önbellekteyse beklemeden uygula; değilse önce yüklenir. Zemin ortamla aynı anda takılır:
  // yeni zeminin eski gezegenin ortamıyla çizildiği ara karede gereksiz bir program derlenmesin
  let S = skyC[P.env ? 'env:' + P.env : P.sky];
  if (!S) { S = await loadSky(P); if (tok !== applyTok) return; } // bu arada başka gezegen seçildi
  makeGround(P); padTop.map = padTexFor(P.pad);
  setSky(P, S); if (!S) setLook(P);
  if (!warmed[name]) { // ilk ziyarette bu gezegenin ortam/sis varyantlarını şimdi derle (ilk itki/patlamada takılmasın)
    await withTimeout(ground.userData.rocks, 8000);
    if (tok !== applyTok) return;
    const fv = R.flame.visible; R.flame.visible = true;
    try { if (W.prewarm) await W.prewarm(warmObjs()); } finally { R.flame.visible = fv; }
    warmed[name] = true;
  }
  ready = true; applied = name; canvas.style.opacity = 1; G.canvas.style.visibility = 'hidden';
}

/* ---------- kuvvet okları ---------- */
const arW = new Arrow(scene, '#ff4a3d'), arT = new Arrow(scene, '#46d39a'), arD = new Arrow(scene, '#58a6ff');
const tagBox = document.createElement('div'); tagBox.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:3;font:800 12px "Plus Jakarta Sans",Arial;color:#fff';
stage.appendChild(tagBox);
const mkTag = (bg) => { const d = document.createElement('div'); d.style.cssText = `position:absolute;transform:translate(8px,-50%);background:${bg};padding:3px 8px;border-radius:8px;white-space:nowrap;display:none`; tagBox.appendChild(d); return d; };
const tagW = mkTag('rgba(214,56,44,.92)'), tagT = mkTag('rgba(40,160,110,.92)'), tagD = mkTag('rgba(50,120,220,.92)');
function tagAt(el, p, txt) { const s = W.toScreen(p); if (!s.ok) { el.style.display = 'none'; return; } el.style.display = 'block'; el.style.left = s.x + 'px'; el.style.top = s.y + 'px'; if (el._t !== txt) { el.textContent = txt; el._t = txt; } }

/* ---------- efektler ---------- */
function clearDebris() { debris.forEach(d => scene.remove(d.m)); debris.length = 0; }
function explode(p) {
  for (let i = 0; i < 26; i++) W.puff(p.clone().add(new THREE.Vector3((Math.random() - .5) * 3, Math.random() * 3, (Math.random() - .5) * 3)), new THREE.Vector3((Math.random() - .5) * 26, 4 + Math.random() * 20, (Math.random() - .5) * 26), { tex: flashTex, color: '#ffffff', size: 4 + Math.random() * 5, grow: 1.5, life: .5 + Math.random() * .6, drag: 2.5, op: 1, add: true, hdr: 3 });
  const air = cur !== 'Ay';
  for (let i = 0; i < (air ? 30 : 14); i++) W.puff(p.clone(), new THREE.Vector3((Math.random() - .5) * 18, 3 + Math.random() * 14, (Math.random() - .5) * 18), { color: cur === 'Mars' ? '#b07050' : '#3a3634', size: 3 + Math.random() * 4, grow: air ? 4 : 1.5, life: 2.5 + Math.random() * 2, drag: air ? 1.4 : .05, op: .8, grav: air ? -1 : 0 });
  clearDebris(); // üst üste patlamada eski parçalar sahnede birikmesin
  for (let i = 0; i < 28; i++) { const m = mkDeb(Math.random() < .5 ? white : dark); m.position.copy(p); scene.add(m); debris.push({ m, v: new THREE.Vector3((Math.random() - .5) * 30, 6 + Math.random() * 22, (Math.random() - .5) * 30), w: new THREE.Vector3(Math.random() * 9, Math.random() * 9, Math.random() * 9), t: 0 }); }
  shake = 1.6;
}
function confetti(p) {
  const cols = ['#f2c230', '#46d39a', '#58a6ff', '#ff6b6b', '#ffffff'];
  for (let i = 0; i < 70; i++) W.puff(p.clone().add(new THREE.Vector3(0, 8, 0)), new THREE.Vector3((Math.random() - .5) * 16, 6 + Math.random() * 14, (Math.random() - .5) * 16), { tex: W.dropTex, color: cols[i % 5], size: .5, grow: 0, life: 2.2, grav: 6, drag: .6, op: 1, add: true, hdr: 1.6 });
}
let shake = 0, landedOk = null;
G.on = (type) => {
  if (type === 'reset') { snap = true; R.root.visible = true; landedOk = null; clearDebris(); return; }
  if (!G.rocket) return;
  const p = new THREE.Vector3(toX(G.rocket.x), toY(G.rocket.y), 0);
  if (type === 'explode') { R.root.visible = false; landedOk = false; explode(p); }
  if (type === 'land') { landedOk = true; confetti(p); }
};

/* ---------- kamera ---------- */
const camPos = new THREE.Vector3(0, 20, 90), camLook = new THREE.Vector3(0, 10, 0); let idleT = 0, snap = false;
const _want = new THREE.Vector3(), _look = new THREE.Vector3();
function updateCamera(dt, rp, pp) {
  const want = _want, look = _look;
  if (G.state === 'start') { idleT += dt; const a = Math.sin(idleT * .12) * .5; look.copy(pp).y += 12; want.set(look.x + Math.sin(a) * 70, look.y + 10 + Math.sin(idleT * .2) * 4, look.z + Math.cos(a) * 70); }
  else {
    const tv = Math.tan(camera.fov * Math.PI / 360), top = Math.max(rp.y + 22, 26), x0 = Math.min(rp.x, pp.x) - 16, x1 = Math.max(rp.x, pp.x) + 16;
    look.set((x0 + x1) / 2, top * .44 - 2, 0);
    const d = clamp(Math.max(top * .56 / tv, (x1 - x0) * .56 / (tv * camera.aspect)), 34, 170);
    want.set(look.x - d * .12, look.y + d * .08 + 2, look.z + d);
  }
  if (snap) { camPos.copy(want); camLook.copy(look); snap = false; }
  const k = 1 - Math.exp(-dt * (G.state === 'start' ? 1.2 : 2.6));
  camPos.lerp(want, k); camLook.lerp(look, k);
  camera.position.copy(camPos); camera.lookAt(camLook);
  if (shake > 0) { camera.position.x += (Math.random() - .5) * shake; camera.position.y += (Math.random() - .5) * shake; shake = Math.max(0, shake - dt * 1.8); }
}

/* ---------- kare ---------- */
let time = 0, dustT = 0, retryAt = 0;
// karede yeniden kullanılan geçici vektörler (her karede yeni nesne üretip çöp toplayıcıyı yormasın)
const _pp = new THREE.Vector3(), _rp = new THREE.Vector3(), _v = new THREE.Vector3(), _w = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3();
const ZAX = new THREE.Vector3(0, 0, 1), SKY_T = new THREE.Vector3(-700, 520, -2900), SKY_O = new THREE.Vector3(-900, 330, -2900);
const LAMP_OK = [.4, 3, 1], LAMP_BAD = [3, .3, .2], LAMP_IDLE = [3, 2.2, .6];
function switchPlanet(name) {
  applyPlanet(name).catch(e => { console.error('gezegen uygulanamadı', e); cur = null; retryAt = performance.now() + 2000; });
}
function frame(dt) {
  time += dt;
  const r = G.rocket, pad = G.pad, planet = G.planet;
  if (cur !== planet.name && performance.now() >= retryAt) switchPlanet(planet.name);
  const pp = _pp.set(toX(pad.x + pad.w / 2), 0, 0); padG.position.copy(pp);
  const rp = r ? _rp.set(toX(r.x), toY(r.y), 0) : _rp.copy(pp).setY(CEN);
  R.root.position.copy(rp); R.root.rotation.z = r ? -r.angle : 0;
  const play = G.state === 'play', fuel = r && r.fuel > 0, up = play && fuel && G.keys.up;
  // alev (ışık yalnızca şiddetiyle açılıp kapanır)
  const fl = up ? 1 : 0; R.flame.visible = fl > 0; R.flame.scale.set(1 + Math.random() * .1, .8 + Math.random() * .35, 1 + Math.random() * .1);
  R.light.intensity = fl * (80 + Math.random() * 40);
  R.light.position.set(0, -CEN + .25 - 1.5, 0).applyAxisAngle(ZAX, R.root.rotation.z).add(rp);
  R.rcsL.material.opacity = play && fuel && G.keys.right ? .8 + Math.random() * .2 : 0; R.rcsR.material.opacity = play && fuel && G.keys.left ? .8 + Math.random() * .2 : 0;
  // duman ve toz
  if (up) { dustT -= dt; if (dustT <= 0) { dustT = .045; const noz = _c.set(0, -CEN - .4, 0).applyAxisAngle(ZAX, -r.angle).add(rp);
      const air = planet.name !== 'Ay';
      W.puff(noz, _v.set(Math.sin(r.angle) * 6 + (Math.random() - .5) * 3, -14, (Math.random() - .5) * 3), { color: '#e8e2d8', size: 1.4, grow: air ? 5 : 2, life: air ? 2.2 : .7, drag: air ? 2.2 : .3, op: air ? .45 : .25, floor: -1 });
      const alt = toY(r.y) - CEN; if (alt < 26) { const k = 1 - alt / 26; for (let i = 0; i < 3; i++) { const a = Math.random() * 6.283, sp = 10 + Math.random() * 16; W.puff(_w.set(rp.x + Math.cos(a) * 2, .4, Math.sin(a) * 2), _v.set(Math.cos(a) * sp, .5 + Math.random() * 2, Math.sin(a) * sp), { color: planet.name === 'Mars' ? '#c68a60' : planet.name === 'Dünya' ? '#b0a58c' : planet.name === 'Jüpiter' ? '#d8d0c0' : '#b8b6b0', size: 1.5 + k * 2, grow: 3, life: 1.6, drag: air ? 1.6 : .2, op: .55 * k }); } } } }
  // enkaz
  for (let i = debris.length - 1; i >= 0; i--) { const d = debris[i]; d.t += dt; d.v.y -= planet.g * dt; d.m.position.addScaledVector(d.v, dt); d.m.rotation.x += d.w.x * dt; d.m.rotation.y += d.w.y * dt;
    if (d.m.position.y < .15) { d.m.position.y = .15; d.v.multiplyScalar(.35); d.v.y = Math.abs(d.v.y) * .3; d.w.multiplyScalar(.5); } }
  // pist ışıkları
  for (let i = 0; i < lamps.length; i++) { const on = landedOk === true ? 1 : landedOk === false ? (Math.sin(time * 10) > 0 ? 1 : .15) : (Math.sin(time * 5 - i * .6) > .2 ? 1 : .25); const c = landedOk === true ? LAMP_OK : landedOk === false ? LAMP_BAD : LAMP_IDLE; lamps[i].material.color.setRGB(c[0] * on, c[1] * on, c[2] * on); }
  // kuvvetler
  const show = G.forces && r && play && R.root.visible;
  if (show) { const Kf = .42, c = rp; arW.set(_c.copy(c).add(_w.set(1.9, 0, 1.6)), _v.set(0, -planet.g * Kf, 0), .16); tagAt(tagW, _c.copy(c).add(_w.set(2.1, -planet.g * Kf * .6, 1.6)), 'Ağırlık  G = m·g');
    if (up) { const a = G.THRUST / PX; arT.set(_c.copy(c).add(_w.set(-1.9, 0, 1.6)), _d.set(Math.sin(r.angle), Math.cos(r.angle), 0).multiplyScalar(a * Kf), .16); tagAt(tagT, _c.copy(c).add(_w.set(-1.9, a * Kf * .6, 1.6)), 'İtki'); } else { arT.hide(); tagT.style.display = 'none'; }
    const dr = G.dragAcc ? G.dragAcc() : 0; if (Math.abs(dr) > .05) { arD.set(_c.copy(c).add(_w.set(3.4, -1.5, 1.6)), _v.set(0, dr * Kf, 0), .12); tagAt(tagD, _c.copy(c).add(_w.set(3.6, -1.5 + dr * Kf, 1.6)), 'Hava direnci'); } else { arD.hide(); tagD.style.display = 'none'; } }
  else { arW.hide(); arT.hide(); arD.hide(); tagW.style.display = tagT.style.display = tagD.style.display = 'none'; }
  // gökyüzü cisimleri
  stars.position.copy(camera.position);
  if (skyBody.visible) { skyBody.position.copy(camera.position).add(cur === 'Titan' ? SKY_T : SKY_O); skyBody.rotation.y += dt * .01; saturnRing.position.copy(skyBody.position); saturnRing.rotation.set(-1.25, .2, .3); }
  if (ground && ground.userData.clouds) ground.userData.clouds.material.map.offset.x += dt * .004;
  // gölge kutusu roketi takip etsin
  sun.target.position.set(Math.round(rp.x / 2) * 2, 0, 0); sun.position.copy(sun.target.position).addScaledVector(W.sunDir, 200);
  updateCamera(dt, rp, pp);
  W.frame(dt);
}
/* ---------- başlat ---------- */
canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .6s';
let boots = 0;
(function boot() {
  applyPlanet(G.planet.name).then(() => { window.BFY_R3D = { frame, ready: true }; })
    .catch(e => { console.error('3B sahne açılamadı', e); cur = null; if (++boots < 3) setTimeout(boot, 2000); }); // 2B oyun bu arada çalışmaya devam eder
})();
window.__r3d = { R, camera, scene, W, renderer, get planet() { return applied; } };
