// BFY · 3B Eğik Atış Laboratuvarı (v2 — fotoğraf gerçekliğinde)
// Three.js r180 (kendi barındırdığımız) + Poly Haven / ambientCG CC0 varlıkları.
import * as THREE from 'three';
import { GLTFLoader } from './sim3d/lib/loaders/GLTFLoader.js';
import { HDRLoader } from './sim3d/lib/loaders/HDRLoader.js';
import { EffectComposer } from './sim3d/lib/postprocessing/EffectComposer.js';
import { RenderPass } from './sim3d/lib/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './sim3d/lib/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './sim3d/lib/postprocessing/OutputPass.js';

/* =====================================================================
   0) Yardımcılar
   ===================================================================== */
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const fmt = (n, d = 1) => { const s = (Math.abs(n) < .5 * Math.pow(10, -d) ? 0 : n).toFixed(d); return s.replace('.', ','); };
const DEG = Math.PI / 180;
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = Math.min(screen.width, screen.height) < 700 || /Android|iPhone|iPad/i.test(navigator.userAgent);
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const Noise = (() => {
  const R = rng(1907); const p = new Uint8Array(512); const base = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  const g = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  const F2 = .5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  function n2(x, y) {
    const s = (x + y) * F2; const i = Math.floor(x + s), j = Math.floor(y + s);
    const t = (i + j) * G2; const x0 = x - (i - t), y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255; let n = 0;
    let t0 = .5 - x0 * x0 - y0 * y0; if (t0 > 0) { const q = g[p[ii + p[jj]] & 7]; t0 *= t0; n += t0 * t0 * (q[0] * x0 + q[1] * y0); }
    let t1 = .5 - x1 * x1 - y1 * y1; if (t1 > 0) { const q = g[p[ii + i1 + p[jj + j1]] & 7]; t1 *= t1; n += t1 * t1 * (q[0] * x1 + q[1] * y1); }
    let t2 = .5 - x2 * x2 - y2 * y2; if (t2 > 0) { const q = g[p[ii + 1 + p[jj + 1]] & 7]; t2 *= t2; n += t2 * t2 * (q[0] * x2 + q[1] * y2); }
    return 70 * n;
  }
  function fbm(x, y, o = 5) { let a = .5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * n2(x * f, y * f); f *= 2.03; a *= .5; } return s; }
  function ridge(x, y, o = 5) { let a = .5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * (1 - Math.abs(n2(x * f, y * f))); f *= 2.1; a *= .5; } return s; }
  return { n2, fbm, ridge };
})();
function canvasTex(w, h, draw, { repeat = null, srgb = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  t.anisotropy = 8; return t;
}

/* =====================================================================
   1) Sabitler
   ===================================================================== */
const PLANETS = {
  earth: { name: 'Dünya', g: 9.8, rho: 1.225, sound: true },
  moon:  { name: 'Ay', g: 1.62, rho: 0, sound: false },
  mars:  { name: 'Mars', g: 3.71, rho: .020, sound: true },
};
const BALLS = {
  iron:   { name: 'Demir gülle', r: .25, m: 515, cd: .47 },
  soccer: { name: 'Futbol topu', r: .11, m: .43, cd: .25 },
  beach:  { name: 'Plaj topu', r: .25, m: .10, cd: .47 },
};
const AXLE_R = .25;          // namlu ekseninin h0 üstündeki yüksekliği
const SC = 1.3;              // top ölçeği (namlu ağzı etrafında)
const STROBE = .25;          // stroboskop aralığı (s)
const CORR = 20;             // atış alanı yarı genişliği (m)
const CX0 = -60, CX1 = 1300; // atış alanı x aralığı
const PIT = { x0: -4.9, x1: .66, z: 1.5, wall: .5, front: .2 };

const S = {
  v0: 18, ang: 45, h0: 0, planet: 'earth', ball: 'iron', drag: false, g10: false,
  cam: 'side', speed: 1, strobe: true, vec: true, comp: false, pred: false, sound: true,
  phase: 'idle',
};
const gNow = () => (S.planet === 'earth' && S.g10) ? 10 : PLANETS[S.planet].g;
const dragOn = () => S.drag && PLANETS[S.planet].rho > 0;

/* =====================================================================
   2) Fizik: yörüngeyi baştan hesapla
   ===================================================================== */
function simulate(p) {
  const { v0, ang, h0, g, drag, rho, ball } = p;
  const c = Math.cos(ang * DEG), s = Math.sin(ang * DEG);
  const vx0 = v0 * c, vy0 = v0 * s;
  const out = { T: 0, R: 0, H: h0, tA: 0, vImp: v0, pts: [] };
  const dt = 1 / 600;
  if (!drag) {
    const T = h0 > 0 || vy0 > 0 ? (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * h0)) / g : 0;
    out.T = T; out.R = vx0 * T; out.tA = Math.max(0, vy0 / g); out.H = h0 + (vy0 > 0 ? vy0 * vy0 / (2 * g) : 0);
    const n = Math.max(1, Math.ceil(T / dt));
    for (let i = 0; i <= n; i++) { const t = Math.min(T, i * dt); out.pts.push(t, vx0 * t, Math.max(0, h0 + vy0 * t - .5 * g * t * t), vx0, vy0 - g * t); }
    const vyI = vy0 - g * T; out.vImp = Math.hypot(vx0, vyI);
    return out;
  }
  const k = .5 * rho * ball.cd * Math.PI * ball.r * ball.r / ball.m;
  const acc = (vx, vy) => { const v = Math.hypot(vx, vy); return [-k * v * vx, -g - k * v * vy]; };
  let t = 0, x = 0, y = h0, vx = vx0, vy = vy0;
  out.pts.push(0, 0, h0, vx, vy);
  if (!(h0 > 0 || vy0 > 0)) return out;
  let apexDone = vy0 <= 0; if (apexDone) out.tA = 0;
  for (let it = 0; it < 600 * 400; it++) {
    const [a1x, a1y] = acc(vx, vy);
    const [a2x, a2y] = acc(vx + a1x * dt / 2, vy + a1y * dt / 2);
    const [a3x, a3y] = acc(vx + a2x * dt / 2, vy + a2y * dt / 2);
    const [a4x, a4y] = acc(vx + a3x * dt, vy + a3y * dt);
    const nx = x + dt * (vx + dt / 6 * (a1x + a2x + a3x)) , ny = y + dt * (vy + dt / 6 * (a1y + a2y + a3y));
    const nvx = vx + dt / 6 * (a1x + 2 * a2x + 2 * a3x + a4x), nvy = vy + dt / 6 * (a1y + 2 * a2y + 2 * a3y + a4y);
    if (!apexDone && nvy <= 0) { const f = vy / (vy - nvy); out.tA = t + f * dt; out.H = y + (ny - y) * f; apexDone = true; }
    if (ny <= 0) {
      const f = y / (y - ny); t += f * dt; x += (nx - x) * f; vx += (nvx - vx) * f; vy += (nvy - vy) * f;
      out.pts.push(t, x, 0, vx, vy); break;
    }
    t += dt; x = nx; y = ny; vx = nvx; vy = nvy; out.pts.push(t, x, y, vx, vy);
  }
  out.T = t; out.R = x; out.vImp = Math.hypot(vx, vy);
  return out;
}
function params() { const P = PLANETS[S.planet]; return { v0: S.v0, ang: S.ang, h0: S.h0, g: gNow(), drag: dragOn(), rho: P.rho, ball: BALLS[S.ball] }; }
function sampleAt(sim, t) { // doğrusal ara değer (örnekler 1/600 s)
  const P = sim.pts, n = P.length / 5; if (n === 1 || t <= 0) return P.slice(0, 5);
  const T = P[(n - 1) * 5]; if (t >= T) return P.slice((n - 1) * 5, n * 5);
  let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m * 5] <= t) lo = m; else hi = m; }
  const a = lo * 5, b = hi * 5, f = (t - P[a]) / ((P[b] - P[a]) || 1);
  return [t, lerp(P[a + 1], P[b + 1], f), lerp(P[a + 2], P[b + 2], f), lerp(P[a + 3], P[b + 3], f), lerp(P[a + 4], P[b + 4], f)];
}


/* =====================================================================
   3) Sahne, işleyici, son işleme
   ===================================================================== */
const stage = $('stage'), canvas = $('c3d');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); }
catch (e) { $('loading').innerHTML = '<div style="max-width:420px;text-align:center;padding:20px">Tarayıcın 3B grafiği (WebGL) desteklemiyor.<br><a href="egik-atis-laboratuvari.html">Klasik Eğik Atış Laboratuvarı\'nı aç →</a></div>'; throw e; }
const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);
renderer.setPixelRatio(DPR);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const MAXANISO = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 16 / 9, .2, 30000);
camera.position.set(20, 8, 50);

const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: isMobile ? 2 : 4 }));
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .28, .5, .96);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const hemi = new THREE.HemisphereLight('#ffffff', '#555555', 0); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffffff', 3);
sun.castShadow = true;
sun.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -36, right: 36, top: 36, bottom: -36, near: 1, far: 600 });
sun.shadow.bias = -.0003; sun.shadow.normalBias = .04;
scene.add(sun, sun.target);
const SUN_DIR = new THREE.Vector3(-.4, .7, .6).normalize();

/* ---------- Yükleyiciler ---------- */
const manager = new THREE.LoadingManager();
let loadDone = 0, loadTotal = 1;
manager.onProgress = (u, l, t) => { loadDone = l; loadTotal = t; const el = $('load-pct'); if (el) el.textContent = Math.round(l / t * 100) + '%'; };
const texL = new THREE.TextureLoader(manager), hdrL = new HDRLoader(manager), gltfL = new GLTFLoader(manager);
const A = 'sim3d/';
function tex(path, srgb = true) { const t = texL.load(A + path); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = MAXANISO; return t; }
const pmrem = new THREE.PMREMGenerator(renderer);

// Döşemeyi kırmak için dikişsiz düşük frekanslı gürültü
const noiseTex = (() => {
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); const img = g.createImageData(N, N);
  const f = (x, y, o) => Noise.fbm(x * 6 + o, y * 6 + o * 1.7, 5);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const u = i / N, v = j / N; const k = (j * N + i) * 4;
    const t = (o) => f(u, v, o) * (1 - u) * (1 - v) + f(u - 1, v, o) * u * (1 - v) + f(u, v - 1, o) * (1 - u) * v + f(u - 1, v - 1, o) * u * v;
    img.data[k] = 128 + t(0) * 200; img.data[k + 1] = 128 + t(11) * 200; img.data[k + 2] = 128 + t(23) * 200; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0); const tx = new THREE.CanvasTexture(c); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.colorSpace = THREE.NoColorSpace; return tx;
})();

/* ---------- Zemin malzemesi: dünya koordinatlı UV, döşeme kırma, çukur deliği, kenar solması ---------- */
function groundMaterial({ col, nor, arm, tile, tintA, tintB, stripe = 0, fade = null, normalScale = 1, rough = 1, useArm = true }) {
  const m = new THREE.MeshStandardMaterial({ map: col, normalMap: nor, roughnessMap: useArm ? arm : null, roughness: rough, metalness: 0, transparent: !!fade, depthWrite: true, envMapIntensity: .55 });
  m.normalScale.set(normalScale, normalScale);
  const U = { uTile: { value: tile }, uNoise: { value: noiseTex }, uTintA: { value: new THREE.Color(tintA) }, uTintB: { value: new THREE.Color(tintB) },
    uStripe: { value: stripe }, uPit: { value: new THREE.Vector3(1e9, -1e9, 0) }, uCenter: { value: new THREE.Vector2() }, uFade: { value: new THREE.Vector2(fade ? fade[0] : 1e9, fade ? fade[1] : 2e9) },
    uCorr: { value: new THREE.Vector3(CX0, CX1, CORR) } };
  m.userData.U = U;
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vWPos; uniform float uTile, uStripe; uniform sampler2D uNoise; uniform vec3 uTintA, uTintB, uPit, uCorr; uniform vec2 uCenter, uFade;`)
      .replace('void main() {', `void main() {
        if (vWPos.x > uPit.x && vWPos.x < uPit.y && abs(vWPos.z) < uPit.z) discard;
        vec2 wuv = vWPos.xz / uTile;
        vec3 nz = texture2D(uNoise, vWPos.xz * .0035).rgb;
        vec3 nz2 = texture2D(uNoise, vWPos.xz * .021 + .37).rgb;`)
      .replace('#include <map_fragment>', `
        vec2 uv2 = mat2(.8, -.6, .6, .8) * wuv * .43 + .31;
        vec4 c1 = texture2D(map, wuv), c2 = texture2D(map, uv2);
        vec4 texelColor = mix(c1, c2, smoothstep(.4, .6, nz2.r));
        texelColor.rgb *= mix(uTintA, uTintB, smoothstep(.3, .7, nz.g));
        texelColor.rgb *= .92 + .16 * nz2.b;
        float inC = step(uCorr.x, vWPos.x) * step(vWPos.x, uCorr.y) * step(abs(vWPos.z), uCorr.z);
        float stripe = smoothstep(.46, .54, fract(vWPos.x / 10.0)) - smoothstep(.96, 1.0, fract(vWPos.x / 10.0));
        texelColor.rgb *= 1.0 + inC * (stripe - .5) * uStripe;
        diffuseColor *= texelColor;`)
      .replace(/vNormalMapUv/g, 'wuv').replace(/vRoughnessMapUv/g, 'wuv')
      .replace('#include <opaque_fragment>', `#include <opaque_fragment>
        gl_FragColor.a *= 1.0 - smoothstep(uFade.x, uFade.y, length(vWPos.xz - uCenter));`);
  };
  return m;
}

/* ---------- Gezegen varlık kümeleri (tembel yükleme) ---------- */
const PSET = {
  earth: { bg: 'env/earth_bg.jpg', hdr: 'env/earth_1k.hdr', sunUV: [.5967, .2598], rot: 2.45, exposure: .95, envI: 1, bgI: 1, sunI: 3.4, sunC: '#fff2dc', hemi: .5,
           ground: { col: 'tex/grass_col.jpg', nor: 'tex/grass_nor.jpg', arm: 'tex/grass_rough.jpg', armIsRough: true, tile: 3.2, tintA: '#e2ecb4', tintB: '#b9c98a', stripe: .07, normalScale: .9 }, fog: null },
  mars:  { bg: 'env/mars_bg.jpg', hdr: null, sunUV: [.6172, .2129], rot: 2.2, exposure: 1.0, envI: 1.1, bgI: 1, sunI: 2.8, sunC: '#ffe2c8', hemi: .45,
           ground: { col: 'tex/mars_col.jpg', nor: 'tex/mars_nor.jpg', arm: 'tex/mars_arm.jpg', tile: 4.5, tintA: '#f0b48a', tintB: '#d6936a', stripe: 0, normalScale: 1.2 }, fog: ['#c79570', .00045] },
  moon:  { bg: null, hdr: null, sunDir: [-.55, .42, .72], exposure: 1.05, envI: .08, bgI: 1, sunI: 5.2, sunC: '#ffffff', hemi: .05,
           ground: { col: 'tex/moon_col.jpg', nor: 'tex/moon_nor.jpg', arm: 'tex/moon_arm.jpg', tile: 5, tintA: '#b9b9b6', tintB: '#9a9a98', stripe: 0, normalScale: 1.4 }, fog: null },
};
const loaded = {};
function loadPlanet(pl) {
  if (loaded[pl]) return loaded[pl];
  const P = PSET[pl];
  loaded[pl] = new Promise(res => {
    const out = {}; let pend = 0; const done = () => { if (--pend === 0) res(out); };
    const G = P.ground; out.gcol = tex(G.col); out.gnor = tex(G.nor, false); out.garm = tex(G.arm, false);
    if (P.bg) { pend++; texL.load(A + P.bg, t => { t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; out.bg = t; if (!P.hdr) out.env = pmrem.fromEquirectangular(t).texture; done(); }); }
    if (P.hdr) { pend++; hdrL.load(A + P.hdr, t => { t.mapping = THREE.EquirectangularReflectionMapping; out.env = pmrem.fromEquirectangular(t).texture; done(); }); }
    if (!pend) { pend = 1; done(); }
  });
  return loaded[pl];
}
function uvToDir(u, vTop) { const phi = (u - .5) * Math.PI * 2, th = (.5 - vTop) * Math.PI; return new THREE.Vector3(Math.cos(th) * Math.cos(phi), Math.sin(th), Math.cos(th) * Math.sin(phi)); }

/* ---------- Zeminler ---------- */
// Dünya/Mars: kamerayı izleyen büyük disk (doku dünyaya sabit, kayma yok), uzakta fotoğrafa karışır
const diskGeo = new THREE.CircleGeometry(1700, 128); diskGeo.rotateX(-Math.PI / 2);
const disk = new THREE.Mesh(diskGeo, new THREE.MeshStandardMaterial({ color: '#6b8a3a' })); disk.receiveShadow = true; disk.renderOrder = -1; scene.add(disk);
// Ay: kraterli arazi
const TW = 2800, TD = 3000, TCELL = 10;
const terrainGeo = new THREE.PlaneGeometry(TW, TD, TW / TCELL, TD / TCELL); terrainGeo.rotateX(-Math.PI / 2); terrainGeo.translate(500, 0, 0);
const craterList = (() => { const R = rng(42), L = []; for (let i = 0; i < 80; i++) { let x, z; do { x = -700 + R() * 2400; z = (R() * 2 - 1) * 1300; } while (Math.abs(z) < CORR + 30 && x > CX0 - 20 && x < CX1 + 20); L.push([x, z, 12 + Math.pow(R(), 2) * 90]); } return L; })();
function outsideDist(x, z) { const dx = Math.max(CX0 - x, 0, x - CX1), dz = Math.max(Math.abs(z) - CORR, 0); return Math.hypot(dx, dz); }
function moonH(x, z) {
  const d = outsideDist(x, z); if (d <= 0) return 0;
  const w = smooth(0, 70, d), far = smooth(260, 900, d);
  if (z > 0 && x > -300 && x < 1700) { return w * (Noise.fbm(x * .006, z * .006, 4) * 2.2 + .6) + smooth(1250, 1500, z) * Noise.fbm(x * .0012, z * .0012, 5) * 230; }
  let h = w * (Noise.fbm(x * .004, z * .004, 5) * 16 + 4) + far * Noise.fbm(x * .0012, z * .0012, 5) * 230;
  for (const [cx, cz, r] of craterList) { const q = Math.hypot(x - cx, z - cz) / r; if (q < 1.6) h += w * r * .22 * (q < 1 ? (q * q - 1) * .9 + .25 : .25 * Math.exp(-((q - 1) * (q - 1)) / .08)); }
  return h;
}
{ const p = terrainGeo.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, moonH(p.getX(i), p.getZ(i))); terrainGeo.computeVertexNormals(); }
const terrain = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ color: '#999' })); terrain.receiveShadow = true; terrain.castShadow = false; terrain.visible = false; scene.add(terrain);
const groundH = (pl, x, z) => pl === 'moon' ? moonH(x, z) : 0;

// Yıldızlar ve Ay göğündeki Dünya
const stars = (() => {
  const R = rng(77), n = 5000, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, th = R() * Math.PI * 2, r = Math.sqrt(1 - u * u); pos.set([r * Math.cos(th) * 9000, u * 9000, r * Math.sin(th) * 9000], i * 3);
    const b = Math.pow(R(), 3) * 1.6 + .25; const w = R(); col.set([b * (w > .8 ? 1 : .85), b * .9, b * (w < .2 ? 1.1 : .95)], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.4, sizeAttenuation: false, vertexColors: true, fog: false, depthWrite: false, toneMapped: false }));
  p.frustumCulled = false; p.visible = false; scene.add(p); return p;
})();
const earthInSky = new THREE.Mesh(new THREE.SphereGeometry(62, 64, 48), new THREE.MeshStandardMaterial({ roughness: .75, metalness: 0, fog: false }));
earthInSky.visible = false; earthInSky.rotation.set(.35, 2.2, .1); scene.add(earthInSky);
const EARTH_DIR = new THREE.Vector3(-.28, .24, -1).normalize().multiplyScalar(4200);

/* ---------- Atış alanı işaretleri ---------- */
const marks = new THREE.Group(); scene.add(marks);
const paintMat = new THREE.MeshStandardMaterial({ color: '#f3f1ea', roughness: .95, transparent: true, opacity: .82, polygonOffset: true, polygonOffsetFactor: -2, depthWrite: false });
for (let x = 10; x <= 1250; x += (x < 200 ? 10 : 50)) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(x % 50 === 0 ? .22 : .13, CORR * 2 - 2), paintMat); m.rotation.x = -Math.PI / 2; m.position.set(x, .012, 0); m.receiveShadow = true; marks.add(m);
}
for (const zz of [-CORR + 1.5, CORR - 1.5]) { const e = new THREE.Mesh(new THREE.PlaneGeometry(CX1 - 1, .14), paintMat); e.rotation.x = -Math.PI / 2; e.position.set(CX1 / 2 + .5, .012, zz); marks.add(e); }
const woodMat = new THREE.MeshStandardMaterial({ color: '#7a5a3a', roughness: .8 });
for (let x = 10; x <= 200; x += 10) {
  const t = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#f6f3ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8e2d2'; for (let i = 0; i < 400; i++) g.fillRect(Math.random() * w, Math.random() * h, 2, 1);
    g.strokeStyle = '#1d1b17'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#16140f'; g.font = '800 66px "Plus Jakarta Sans", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(x + ' m', w / 2, h / 2 + 4); });
  const face = new THREE.MeshStandardMaterial({ map: t, roughness: .7 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(1.3, .65, .05), [woodMat, woodMat, woodMat, woodMat, face, woodMat]); b.position.set(x, 1.35, -7); b.castShadow = true; marks.add(b);
  const p = new THREE.Mesh(new THREE.BoxGeometry(.09, 1.3, .09), woodMat); p.position.set(x, .65, -7.06); p.castShadow = true; marks.add(p);
}

/* =====================================================================
   4) Tabya: toprak atış seti + hidrolik makaslı platform + kızak + namlu
   ---------------------------------------------------------------------
   Fizik, namlu ağzını atış noktası sayar (h₀ = namlu ağzının atış
   pistinden yüksekliği). Namlu ağzı her açıda aynı yükseklikte kalsın diye
   top, makaslı hidrolik platformun üstünde yükselip alçalır ve kızak
   üzerinde ileri geri kayar. h₀ = 0 iken top, pistin önündeki alçak
   alanda durur ve tamamen görünür.
   ===================================================================== */
const cT = { col: tex('tex/concrete_col.jpg'), nor: tex('tex/concrete_nor.jpg', false), arm: tex('tex/concrete_arm.jpg', false) };
const concreteMat = new THREE.MeshStandardMaterial({ map: cT.col, normalMap: cT.nor, roughnessMap: cT.arm, color: '#f2efe8', roughness: 1, metalness: 0 });
const rT = { col: tex('tex/rust_col.jpg'), nor: tex('tex/rust_nor.jpg', false), arm: tex('tex/rust_arm.jpg', false) };
const hazardTex = canvasTex(256, 32, (g, w, h) => { g.fillStyle = '#f0b91e'; g.fillRect(0, 0, w, h); g.fillStyle = '#161616'; for (let x = -h; x < w + h; x += 32) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 16, h); g.lineTo(x + 16 + h, 0); g.lineTo(x + h, 0); g.fill(); } }, { repeat: [1, 1] });
function boxUV(w, h, d, tile = 2.2) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / tile, uv.getY(i) * dims[f][1] / tile); }
  return g;
}
const steel = new THREE.MeshStandardMaterial({ color: '#33373c', metalness: .9, roughness: .36 });
const darkSteel = new THREE.MeshStandardMaterial({ color: '#202326', metalness: .85, roughness: .5 });
const yellowSteel = new THREE.MeshStandardMaterial({ color: '#e2a915', metalness: .3, roughness: .4 });
const chrome = new THREE.MeshStandardMaterial({ color: '#e6e9ec', metalness: 1, roughness: .1 });
const gunMat = new THREE.MeshStandardMaterial({ map: rT.col, normalMap: rT.nor, roughnessMap: rT.arm, color: '#626366', metalness: .78, roughness: .85 });
gunMat.normalScale.set(.5, .5);
const bronzeMat = new THREE.MeshStandardMaterial({ color: '#b3874a', metalness: 1, roughness: .26 });
const boreMat = new THREE.MeshBasicMaterial({ color: '#030303', side: THREE.BackSide });
const ironMat = new THREE.MeshStandardMaterial({ map: rT.col, normalMap: rT.nor, roughnessMap: rT.arm, color: '#57585b', metalness: .8, roughness: .8 });

const GUN = { f: 2.5, cheek: 1.3, liftMin: .35, stage: 1.85 };
const DROP = GUN.liftMin + GUN.cheek + GUN.f * Math.sin(80 * DEG) + .26;   // namlu ekseninden alçak zemine en az mesafe
const liftFor = a => GUN.liftMin + GUN.f * (Math.sin(80 * DEG) - Math.sin(a));
let meadowY = 0, gunBaseY = 0;

const site = new THREE.Group(); scene.add(site);
const rig = new THREE.Group(); site.add(rig);            // alçak zemindeki makaslı platform
const sled = new THREE.Group(); rig.add(sled);           // platform üstünde kayan kızak
const pivot = new THREE.Group(); sled.add(pivot);        // muylu (namlunun döndüğü eksen)
const barrel = (() => {
  const g = new THREE.Group();
  const prof = [[0, -3.3], [.1, -3.29], [.15, -3.22], [.13, -3.15], [.09, -3.1], [.2, -3.06], [.38, -3.02], [.44, -2.97], [.44, -2.78], [.41, -2.74],
    [.405, -2.1], [.435, -2.06], [.435, -1.94], [.4, -1.9], [.35, -.62], [.37, -.56], [.37, -.46], [.345, -.42], [.35, -.18], [.39, -.12], [.4, -.05], [.37, 0], [.285, 0]];
  const lathe = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 72);
  { const uv = lathe.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2.5, uv.getY(i) * 3.5); }
  lathe.rotateZ(-Math.PI / 2);
  const body = new THREE.Mesh(lathe, gunMat); body.castShadow = true; body.receiveShadow = true; g.add(body);
  for (const [x0, len, s] of [[-2.0, .13, 1], [-.5, .1, .86], [-2.86, .1, 1.01]]) { const ring = new THREE.Mesh(new THREE.CylinderGeometry(.445 * s, .445 * s, len, 72).rotateZ(Math.PI / 2), bronzeMat); ring.position.x = x0; ring.castShadow = true; g.add(ring); }
  const bore = new THREE.Mesh(new THREE.CylinderGeometry(.285, .285, 1.6, 32, 1, true).rotateZ(Math.PI / 2), boreMat); bore.position.x = -.8; g.add(bore);
  const plug = new THREE.Mesh(new THREE.CircleGeometry(.285, 32).rotateY(Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#020202' })); plug.position.x = -1.6; g.add(plug);
  // Muylu kolları (namlunun iki yanında)
  for (const sg of [-1, 1]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .22, 32).rotateX(Math.PI / 2), bronzeMat); t.position.set(-GUN.f, 0, sg * .5); t.castShadow = true; g.add(t); }
  const lug = new THREE.Mesh(new THREE.BoxGeometry(.34, .24, .2), steel); lug.position.set(-GUN.f + 1.3, -.46, 0); g.add(lug);
  g.position.x = GUN.f;  // namlu ağzı muylunun f kadar önünde
  return g;
})();
pivot.add(barrel);
// Kızak: iki yanak + muylu yatakları + taban
const sledBase = new THREE.Mesh(boxUV(1.5, .28, 1.5, 1), darkSteel); sledBase.position.y = .14; sledBase.castShadow = true; sled.add(sledBase);
for (const sg of [-1, 1]) {
  const sh = new THREE.Shape(); sh.moveTo(-.65, 0); sh.lineTo(.65, 0); sh.lineTo(.3, GUN.cheek - .05); sh.quadraticCurveTo(0, GUN.cheek + .28, -.3, GUN.cheek - .05); sh.closePath();
  const cheek = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .09, bevelEnabled: true, bevelSize: .015, bevelThickness: .015, bevelSegments: 2 }), yellowSteel);
  cheek.position.set(0, .26, sg * .64 - .045); cheek.castShadow = true; cheek.receiveShadow = true; sled.add(cheek);
  const brg = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .14, 32).rotateX(Math.PI / 2), steel); brg.position.set(0, GUN.cheek, sg * .71); brg.castShadow = true; sled.add(brg);
}
pivot.position.set(0, GUN.cheek, 0);
// Yükseliş pistonu (kızaktan namlu altına)
const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, 1, 32), yellowSteel); pistonOuter.castShadow = true;
const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(.065, .065, 1, 24), chrome); pistonRod.castShadow = true;
sled.add(pistonOuter, pistonRod);
// Platform, raylar, makas kolları, taban
const platTop = new THREE.Mesh(boxUV(4.4, .18, 2.4, 1.2), darkSteel); platTop.castShadow = true; platTop.receiveShadow = true; rig.add(platTop);
const rails = [-1, 1].map(sg => { const r = new THREE.Mesh(new THREE.BoxGeometry(3.9, .08, .1), chrome); r.castShadow = true; rig.add(r); r.userData.sg = sg; return r; });
const baseTop = new THREE.Mesh(boxUV(4.6, .16, 2.6, 1.2), darkSteel); baseTop.position.y = .08; baseTop.castShadow = true; baseTop.receiveShadow = true; rig.add(baseTop);
const stripeMat = new THREE.MeshStandardMaterial({ map: (() => { const t = hazardTex.clone(); t.repeat.set(5, 1); t.needsUpdate = true; return t; })(), roughness: .5 });
const platEdge = new THREE.Mesh(new THREE.BoxGeometry(4.42, .06, 2.42), stripeMat); rig.add(platEdge);
const barGeo = new THREE.BoxGeometry(.11, 1, .07);
const bars = []; for (let i = 0; i < 8; i++) { const b = new THREE.Mesh(barGeo, yellowSteel); b.castShadow = true; rig.add(b); bars.push(b); }
const pins = []; for (let i = 0; i < 12; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .1, 12).rotateX(Math.PI / 2), chrome); rig.add(p); pins.push(p); }
const liftCyl = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 1, 20), chrome); liftCyl.castShadow = true; rig.add(liftCyl);
const liftCylO = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, 1, 20), yellowSteel); liftCylO.castShadow = true; rig.add(liftCylO);
function orient(mesh, a, b) { const d = new THREE.Vector3().subVectors(b, a); const L = d.length(); mesh.position.copy(a).addScaledVector(d, .5); mesh.scale.set(1, L, 1); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); }
const PX0 = -3.6; // platform arka ucu (dünya x)
function setBarrel(angDeg) {
  const a = angDeg * DEG, M = S.h0 + AXLE_R;
  gunBaseY = M - DROP; rig.position.set(0, gunBaseY, 0);
  const lh = liftFor(a);           // platform üst yüzeyi, taban üstünden
  const topY = lh + .16;
  platTop.position.set(PX0 + 2.2, lh + .09, 0); platEdge.position.set(PX0 + 2.2, lh + .005, 0);
  rails.forEach(r => r.position.set(PX0 + 2.2, lh + .22, r.userData.sg * .55));
  // iki katlı makas: her kat yüksekliği lh/2
  const hs = Math.max(.05, (lh - .16) / 2), Ls = GUN.stage, span = Math.sqrt(Math.max(.01, Ls * Ls - hs * hs));
  const xa = PX0 + .3, xb = xa + span, y0 = .16;
  let bi = 0, pi = 0;
  for (const zz of [-1.05, 1.05]) for (let st = 0; st < 2; st++) {
    const yb = y0 + st * hs, yt = yb + hs;
    orient(bars[bi++], new THREE.Vector3(xa, yb, zz), new THREE.Vector3(xb, yt, zz));
    orient(bars[bi++], new THREE.Vector3(xa, yt, zz + (zz > 0 ? .08 : -.08)), new THREE.Vector3(xb, yb, zz + (zz > 0 ? .08 : -.08)));
    if (st === 0) { pins[pi++].position.set(xa, yb, zz); pins[pi++].position.set(xb, yb, zz); }
    pins[pi++].position.set((xa + xb) / 2, yb + hs / 2, zz + (zz > 0 ? .1 : -.1));
    if (st === 1) { pins[pi++].position.set(xa, yt, zz); pins[pi++].position.set(xb, yt, zz); }
  }
  orient(liftCylO, new THREE.Vector3(xa + .2, y0 + .05, 0), new THREE.Vector3(xa + span * .45, y0 + hs * .8, 0));
  orient(liftCyl, new THREE.Vector3(xa + span * .4, y0 + hs * .72, 0), new THREE.Vector3((xa + xb) / 2, y0 + hs * 1.5, 0));
  // Kızak: muylu x = -f·cosθ
  const tx = -GUN.f * Math.cos(a);
  sled.position.set(tx, topY + .1, 0);
  pivot.rotation.z = a;
  // Piston: kızak önü → namlu kulağı
  const Pa = new THREE.Vector3(.55, .35, 0);
  const lugL = new THREE.Vector3(1.3 * Math.cos(a) + .46 * Math.sin(a), GUN.cheek + 1.3 * Math.sin(a) - .46 * Math.cos(a) - .12, 0);
  const u = lugL.clone().sub(Pa); const L = u.length(); u.normalize();
  orient(pistonOuter, Pa, Pa.clone().addScaledVector(u, Math.min(1.1, L * .62))); orient(pistonRod, Pa.clone().addScaledVector(u, Math.min(1.1, L * .62) - .08), lugL);
}

/* ---------- Atış seti (toprak dolgu) ya da kaide ---------- */
const bermGroup = new THREE.Group(); scene.add(bermGroup);
const bermMats = {};
let bermKey = '';
function buildBerm() {
  const key = S.h0 + '|' + S.planet; if (key === bermKey) return; bermKey = key;
  bermGroup.traverse(o => { if (o.isMesh) o.geometry.dispose(); }); bermGroup.clear();
  meadowY = Math.min(0, S.h0 + AXLE_R - DROP);
  const Hd = -meadowY;
  disk.position.y = meadowY; terrain.position.y = meadowY; props.position.y = meadowY; ammo.position.y = meadowY; decor.position.y = meadowY;
  if (Hd > .01) {
    // Kesit: üst |z|≤CORR, şevler 1:1.35
    const s = 1.35, X0 = .5, X1 = CX1, zt = CORR, zb = CORR + Hd * s;
    const pos = [], idx = [];
    const quad = (a, b, c, d) => { const i = pos.length / 3; pos.push(...a, ...b, ...c, ...d); idx.push(i, i + 1, i + 2, i, i + 2, i + 3); };
    const segs = 40;
    for (let k = 0; k < segs; k++) {
      const xa = X0 + (X1 - X0) * k / segs, xb = X0 + (X1 - X0) * (k + 1) / segs;
      quad([xa, 0, -zt], [xa, 0, zt], [xb, 0, zt], [xb, 0, -zt]);
      quad([xa, 0, zt], [xa, -Hd, zb], [xb, -Hd, zb], [xb, 0, zt]);
      quad([xa, -Hd, -zb], [xa, 0, -zt], [xb, 0, -zt], [xb, -Hd, -zb]);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
    g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, bermMats[S.planet] || disk.material); m.receiveShadow = true; m.castShadow = true; bermGroup.add(m);
    // Ön istinat duvarı (beton), yamuk kesit
    const sh = new THREE.Shape(); sh.moveTo(-zb, -Hd - .3); sh.lineTo(zb, -Hd - .3); sh.lineTo(zt, 0); sh.lineTo(-zt, 0); sh.closePath();
    const wg = new THREE.ExtrudeGeometry(sh, { depth: .45, bevelEnabled: false }); wg.rotateY(-Math.PI / 2);
    { const uv = wg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 2.2, uv.getY(i) / 2.2); }
    const w = new THREE.Mesh(wg, concreteMat); w.position.set(X0 + .45, 0, 0); w.castShadow = w.receiveShadow = true; bermGroup.add(w);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(.5, .08, zt * 2), stripeMat); cap.position.set(X0 + .22, .04, 0); bermGroup.add(cap);
  } else {
    // Kaide: top yüksekte, pist alçakta
    const Hb = S.h0 + AXLE_R - DROP; if (Hb > .01) {
      const b = new THREE.Mesh(boxUV(6.2, Hb, 4.2), concreteMat); b.position.set(-1.4, Hb / 2, 0); b.castShadow = b.receiveShadow = true; bermGroup.add(b);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(6.22, .06, 4.22), stripeMat); cap.position.set(-1.4, Hb + .03, 0); bermGroup.add(cap);
      if (Hb > 2) { for (const zz of [-.35, .35]) { const r = new THREE.Mesh(new THREE.BoxGeometry(.06, Hb + 1, .06), chrome); r.position.set(-4.62, (Hb + 1) / 2, zz + 1.2); bermGroup.add(r); }
        for (let y = .3; y < Hb; y += .35) { const st = new THREE.Mesh(new THREE.BoxGeometry(.05, .04, .7), chrome); st.position.set(-4.62, y, 1.2); bermGroup.add(st); } }
    }
  }
}
function buildTower() { buildBerm(); }

const ammo = new THREE.Group(); scene.add(ammo);
{ const g = new THREE.SphereGeometry(.25, 32, 20);
  for (let L = 0; L < 3; L++) { const n = 3 - L; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const s = new THREE.Mesh(g, ironMat); s.position.set(-6.4 + (i - (n - 1) / 2) * .5, .25 + L * .36, 3.6 + (j - (n - 1) / 2) * .5); s.rotation.set(i, j, L); s.castShadow = true; s.receiveShadow = true; ammo.add(s); } } }
const decor = new THREE.Group(); scene.add(decor);
{ const t = canvasTex(512, 200, (g, w, h) => { g.fillStyle = '#0e0c08'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2c230'; g.fillRect(0, h - 16, w, 16);
    g.fillStyle = '#fff'; g.font = '800 58px "Plus Jakarta Sans", Arial, sans-serif'; g.textBaseline = 'middle'; g.fillText('BFY ATIŞ ALANI', 28, 78);
    g.fillStyle = '#f2c230'; g.font = '700 30px "Plus Jakarta Sans", Arial, sans-serif'; g.fillText('benfizikyapamiyorum.com', 30, 138); });
  const b = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.25, .08), [steel, steel, steel, steel, new THREE.MeshStandardMaterial({ map: t, roughness: .5 }), steel]);
  b.position.set(-10, 2.1, -4.5); b.rotation.y = .4; b.castShadow = true; decor.add(b);
  for (const dx of [-1.3, 1.3]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.1, 2.2, .1), steel); p.position.set(-10 + dx * Math.cos(.4), 1.1, -4.5 - dx * Math.sin(.4) - .06); p.castShadow = true; decor.add(p); }
  // Kum torbası siperi (topun arkasında ve uzak yanında)
  const g = new THREE.SphereGeometry(1, 20, 12); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const k = 1 + Noise.n2(x * 3 + z * 2, y * 4) * .06; p.setXYZ(i, Math.sign(x) * Math.pow(Math.abs(x), .55) * k, y * (y < 0 ? .7 : 1) * k, Math.sign(z) * Math.pow(Math.abs(z), .6) * k); }
  g.computeVertexNormals();
  const bagMat = new THREE.MeshStandardMaterial({ map: cT.col, normalMap: rT.nor, color: '#cdb48c', roughness: .96 }); bagMat.normalScale.set(.35, .35);
  const L = []; for (let lay = 0; lay < 3; lay++) { const o = lay % 2 ? .3 : 0; for (let x = -6.5 + o; x < .2; x += .62) L.push([x, -3.2, 0, lay]); for (let z = -3 + o; z < 2.6; z += .62) L.push([-7, z, Math.PI / 2, lay]); }
  const m = new THREE.InstancedMesh(g, bagMat, L.length); const d = new THREE.Object3D(); const R = rng(4);
  L.forEach((q, i) => { d.position.set(q[0], .12 + q[3] * .22, q[1]); d.rotation.set((R() - .5) * .08, q[2] + (R() - .5) * .15, (R() - .5) * .08); d.scale.set(.31, .12, .18); d.updateMatrix(); m.setMatrixAt(i, d.matrix); });
  m.castShadow = m.receiveShadow = true; decor.add(m);
}


/* ---------- Kayalar ve sandıklar (sahne süsleri, tembel) ---------- */
const props = new THREE.Group(); scene.add(props);
const rockSets = {};
function scatterRocks(pl) {
  props.children.forEach(o => o.visible = o.userData.pl === pl || o.userData.pl === 'all');
  if (rockSets[pl]) return;
  rockSets[pl] = true;
  const file = pl === 'earth' ? 'boulder_01' : 'namaqualand_boulder_02';
  gltfL.load(`${A}models/${file}/${file}_lo.gltf`, gl => {
    let mesh = null; gl.scene.traverse(o => { if (o.isMesh && !mesh) mesh = o; });
    if (!mesh) return;
    const geo = mesh.geometry.clone(); geo.computeBoundingBox(); const bb = geo.boundingBox, sz = new THREE.Vector3(); bb.getSize(sz);
    const s0 = 1 / Math.max(sz.x, sz.z); geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y - sz.y * .12, -(bb.min.z + bb.max.z) / 2); geo.scale(s0, s0, s0);
    const mat = mesh.material.clone();
    if (pl === 'moon') { mat.color = new THREE.Color('#9d9d9d'); mat.map = null; mat.needsUpdate = true; }
    if (pl === 'mars') mat.color = new THREE.Color('#e6a47c');
    const n = pl === 'earth' ? 14 : 70, R = rng(pl === 'moon' ? 91 : pl === 'mars' ? 92 : 93);
    const m = new THREE.InstancedMesh(geo, mat, n); const d = new THREE.Object3D(); let k = 0;
    while (k < n) {
      const x = -60 + R() * (pl === 'earth' ? 260 : 700), side = R() < (pl === 'earth' ? .8 : .6) ? -1 : 1, z = side * (CORR + 8 + Math.pow(R(), 1.5) * (side < 0 ? 140 : 90));
      if (Math.hypot(x + 9, z + 5) < 6) continue;
      const s = pl === 'earth' ? .5 + Math.pow(R(), 2) * 2.4 : .3 + Math.pow(R(), 3) * 4;
      d.position.set(x, groundH(pl, x, z), z); d.rotation.set((R() - .5) * .3, R() * 6.3, (R() - .5) * .3); d.scale.setScalar(s); d.updateMatrix(); m.setMatrixAt(k++, d.matrix);
    }
    m.castShadow = true; m.receiveShadow = true; m.userData.pl = pl; m.visible = S.planet === pl; props.add(m);
  });
}
function loadCrates() {
  gltfL.load(`${A}models/wooden_crate_02/wooden_crate_02.gltf`, gl => {
    const c = gl.scene; c.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
    const bb = new THREE.Box3().setFromObject(c), sz = new THREE.Vector3(); bb.getSize(sz); const s = .9 / Math.max(sz.x, sz.y, sz.z);
    [[-5.2, 4.4, .3], [-6.2, 4.7, -.4], [-5.7, 4.5, 1.2, 1]].forEach(([x, z, r, up]) => { const k = c.clone(); k.scale.setScalar(s); k.position.set(x, up ? sz.y * s : 0, z); k.rotation.y = r; k.userData.pl = 'all'; props.add(k); });
  });
}

/* =====================================================================
   5) Toplar, izler, vektörler, parçacıklar
   ===================================================================== */
const ballTex = (() => { const cols = [[231, 69, 59], [250, 250, 250], [46, 127, 216], [245, 197, 43], [250, 250, 250], [53, 168, 82]];
  return canvasTex(512, 256, (g, w, h) => { for (let i = 0; i < 6; i++) { g.fillStyle = `rgb(${cols[i]})`; g.fillRect(i * w / 6, 0, w / 6 + 1, h); } g.fillStyle = '#fafafa'; g.fillRect(0, 0, w, 24); g.fillRect(0, h - 24, w, 24); }); })();
const ballMats = {
  iron: ironMat,
  soccer: new THREE.MeshStandardMaterial({ color: '#f4f4f0', roughness: .45 }),
  beach: new THREE.MeshPhysicalMaterial({ map: ballTex, roughness: .22, clearcoat: 1, clearcoatRoughness: .12 }),
};
const ballGeo = new THREE.SphereGeometry(1, 64, 40);
const ball = new THREE.Group(); scene.add(ball);
const ballMesh = new THREE.Mesh(ballGeo, ironMat); ballMesh.castShadow = true; ball.add(ballMesh);
let footballObj = null;
gltfL.load(`${A}models/football/football.gltf`, gl => {
  const o = gl.scene; o.traverse(m => { if (/deflated/i.test(m.name)) m.visible = false; });
  const inf = o.getObjectByName('football_inflated') || o; const bb = new THREE.Box3().setFromObject(inf), sph = new THREE.Sphere(); bb.getBoundingSphere(sph);
  o.position.sub(sph.center); const w = new THREE.Group(); w.add(o); w.scale.setScalar(1 / sph.radius * .98);
  o.traverse(m => { if (m.isMesh) m.castShadow = true; }); footballObj = w; if (S.ball === 'soccer') setBallLook();
});
function setBallLook() {
  if (S.ball === 'soccer' && footballObj) { ballMesh.visible = false; if (footballObj.parent !== ball) ball.add(footballObj); footballObj.visible = true; }
  else { ballMesh.visible = true; ballMesh.material = ballMats[S.ball]; if (footballObj) footballObj.visible = false; }
}

function trailMat(color, opacity = 1, dashed = false, glow = 2.2) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    uniforms: { uTime: { value: 1e9 }, uColor: { value: new THREE.Color(color).multiplyScalar(glow) }, uOp: { value: opacity }, uPx: { value: 3 * DPR }, uWorld: { value: .08 }, uScale: { value: 500 }, uDash: { value: dashed ? 1 : 0 } },
    vertexShader: `attribute float aT; uniform float uTime,uPx,uWorld,uScale; varying float vVis; varying float vT;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); gl_Position = projectionMatrix * mv; vVis = aT <= uTime ? 1. : 0.; vT = aT;
        gl_PointSize = max(uWorld * uScale / max(-mv.z, .1), uPx); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uOp,uDash; varying float vVis; varying float vT;
      void main(){ if (vVis < .5) discard; if (uDash > .5 && mod(vT, .16) > .09) discard; vec2 q = gl_PointCoord - .5; float r = dot(q,q); if (r > .25) discard;
        gl_FragColor = vec4(uColor, uOp * smoothstep(.25, .1, r)); }`,
  });
}
function makeTrail(sim, color, op, dashed) {
  const P = sim.pts, n = P.length / 5, step = Math.max(1, Math.floor(n / 40000));
  const cnt = Math.ceil(n / step), pos = new Float32Array(cnt * 3), at = new Float32Array(cnt);
  for (let i = 0, k = 0; i < n; i += step, k++) { pos[k * 3] = P[i * 5 + 1]; pos[k * 3 + 1] = P[i * 5 + 2] + BALLS[S.ball].r; pos[k * 3 + 2] = 0; at[k] = P[i * 5]; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aT', new THREE.BufferAttribute(at, 1));
  const pts = new THREE.Points(g, trailMat(color, op, dashed, dashed ? 1.2 : 2.2)); pts.frustumCulled = false; pts.renderOrder = 3; scene.add(pts); return pts;
}
const TRAIL_COLS = ['#ff8a3d', '#4fa3ff', '#6ee07a', '#c58bff', '#ffd24a'];
let trails = [], trailIdx = 0, predTrail = null;

const MAXG = 520;
const ghostMat = new THREE.MeshStandardMaterial({ color: '#ffd35a', emissive: '#ffb020', emissiveIntensity: .9, roughness: .4, transparent: true, opacity: .55, depthWrite: false });
const ghosts = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 24, 16), ghostMat, MAXG); ghosts.count = 0; ghosts.frustumCulled = false; ghosts.renderOrder = 2; scene.add(ghosts);
let ghostPts = [];

class Arrow {
  constructor(color) {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(1.6), depthTest: false, transparent: true, opacity: .96, toneMapped: false });
    this.g = new THREE.Group(); this.shaft = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 12).translate(0, .5, 0), m); this.head = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 18).translate(0, .5, 0), m);
    this.g.add(this.shaft, this.head); [this.g, this.shaft, this.head].forEach(o => o.renderOrder = 10); scene.add(this.g);
  }
  set(from, vec, thick) {
    const L = vec.length(); if (L < 1e-3) { this.g.visible = false; return; } this.g.visible = true;
    const hl = Math.min(L * .45, thick * 5.5), sl = L - hl;
    this.g.position.copy(from); this.g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec.clone().normalize());
    this.shaft.scale.set(thick, sl, thick); this.head.position.y = sl; this.head.scale.set(thick * 2.6, hl, thick * 2.6);
  }
  hide() { this.g.visible = false; }
}
const arV = new Arrow('#f2c230'), arVx = new Arrow('#58a6ff'), arVy = new Arrow('#ff6b5e'), arAim = new Arrow('#ffffff');
[arV, arVx, arVy, arAim].forEach(a => a.hide());

const compG = new THREE.Group(); scene.add(compG);
const poleTex = canvasTex(64, 1024, (g, w, h) => { for (let i = 0; i < 64; i++) { g.fillStyle = i % 2 ? '#d8402f' : '#f7f5ef'; g.fillRect(0, i * 16, w, 16); } g.fillStyle = '#0e0c08'; for (let i = 0; i < 64; i++) g.fillRect(0, i * 16, w * .35, 2); });
const pole = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 1, 16).translate(0, .5, 0), new THREE.MeshStandardMaterial({ map: poleTex, roughness: .5 })); pole.position.set(1.6, 0, -2.9); pole.castShadow = true; compG.add(pole);
const markX = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshStandardMaterial({ color: '#58a6ff', emissive: '#2a78ff', emissiveIntensity: 1.2, roughness: .3 }));
const markY = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshStandardMaterial({ color: '#ff6b5e', emissive: '#ff3a24', emissiveIntensity: 1.2, roughness: .3 }));
compG.add(markX, markY);
const dashMat = new THREE.LineDashedMaterial({ color: '#ffffff', dashSize: .4, gapSize: .3, transparent: true, opacity: .8, depthTest: false });
const dashX = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), dashMat); dashX.renderOrder = 9;
const dashY = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), dashMat); dashY.renderOrder = 9;
compG.add(dashX, dashY); compG.visible = false;
function setLine(line, a, b) { const p = line.geometry.attributes.position; p.setXYZ(0, a.x, a.y, a.z); p.setXYZ(1, b.x, b.y, b.z); p.needsUpdate = true; line.computeLineDistances(); }

// Parçacıklar: gürültülü duman, alev parlaması, toz, taş parçaları
const smokeTex = (() => { const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); const img = g.createImageData(N, N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const x = i / N - .5, y = j / N - .5, r = Math.hypot(x, y) * 2; const n = Noise.fbm(i * .045, j * .045, 5) * .5 + .5;
    const a = Math.max(0, 1 - r) ** 1.6 * (.55 + n * .9); const k = (j * N + i) * 4; const l = 200 + n * 55; img.data[k] = l; img.data[k + 1] = l; img.data[k + 2] = l; img.data[k + 3] = clamp(a * 255, 0, 255); }
  g.putImageData(img, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const flashTex = canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(.2, 'rgba(255,210,120,.95)'); gr.addColorStop(.5, 'rgba(255,120,30,.45)'); gr.addColorStop(1, 'rgba(255,60,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
const parts = [];
function puff(pos, vel, { color = '#dcdcdc', size = 1, grow = 2, life = 2.5, grav = 0, drag = 1.2, op = .8, tex = smokeTex, add = false, hdr = 1 } = {}) {
  const m = new THREE.SpriteMaterial({ map: tex, color: new THREE.Color(color).multiplyScalar(hdr), transparent: true, depthWrite: false, opacity: op, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: !add });
  const s = new THREE.Sprite(m); s.position.copy(pos); s.scale.setScalar(size); m.rotation = Math.random() * 6; scene.add(s);
  parts.push({ s, v: vel.clone(), size, grow, life, t: 0, grav, drag, op, spin: (Math.random() - .5) * .8 });
}
function stepParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.t += dt; const k = p.t / p.life;
    if (k >= 1) { scene.remove(p.s); p.s.material.dispose(); parts.splice(i, 1); continue; }
    p.v.multiplyScalar(Math.exp(-p.drag * dt)); p.v.y -= p.grav * dt; p.s.position.addScaledVector(p.v, dt);
    if (p.grav > 0 && p.s.position.y < p.size * .3) { p.s.position.y = p.size * .3; p.v.set(0, 0, 0); }
    p.s.material.rotation += p.spin * dt;
    p.s.scale.setScalar(p.size * (1 + p.grow * Math.sqrt(k))); p.s.material.opacity = p.op * (1 - k) * (k < .06 ? k / .06 : 1);
  }
}
// Taş parçaları (fiziksel, sıçrayan)
const debrisGeo = new THREE.DodecahedronGeometry(1, 0);
const debrisMat = new THREE.MeshStandardMaterial({ color: '#6b5a44', roughness: .95 });
const debris = new THREE.InstancedMesh(debrisGeo, debrisMat, 160); debris.count = 0; debris.castShadow = true; scene.add(debris);
let debrisList = [];
function spawnDebris(x, n, color, g) {
  debrisMat.color.set(color); debrisList = [];
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, sp = 2 + Math.random() * 7; debrisList.push({ p: new THREE.Vector3(x + (Math.random() - .5) * .6, .2, (Math.random() - .5) * .6), v: new THREE.Vector3(Math.cos(a) * sp * .6, 3 + Math.random() * 7, Math.sin(a) * sp * .6), s: .03 + Math.random() * .09, r: new THREE.Euler(Math.random() * 6, Math.random() * 6, 0), g }); }
  debris.count = n;
}
const dObj = new THREE.Object3D();
function stepDebris(dt) {
  if (!debris.count) return;
  debrisList.forEach((d, i) => { if (d.p.y > d.s * .5 || d.v.y > 0) { d.v.y -= d.g * dt; d.p.addScaledVector(d.v, dt); d.r.x += dt * 8; if (d.p.y < d.s * .5) { d.p.y = d.s * .5; d.v.y *= -.25; d.v.x *= .5; d.v.z *= .5; if (Math.abs(d.v.y) < .6) d.v.set(0, 0, 0); } }
    dObj.position.copy(d.p); dObj.rotation.copy(d.r); dObj.scale.setScalar(d.s); dObj.updateMatrix(); debris.setMatrixAt(i, dObj.matrix); });
  debris.instanceMatrix.needsUpdate = true;
}
const flashLight = new THREE.PointLight('#ffb35a', 0, 60, 1.5); scene.add(flashLight);
const craterTex = canvasTex(256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(22,16,9,.92)'); gr.addColorStop(.35, 'rgba(48,36,22,.8)'); gr.addColorStop(.55, 'rgba(92,74,50,.55)'); gr.addColorStop(.72, 'rgba(120,100,70,.28)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const R = rng(2); for (let i = 0; i < 90; i++) { const a = R() * 7, r = 50 + R() * 75; g.fillStyle = `rgba(${40 + R() * 40},${30 + R() * 30},${20 + R() * 20},${.3 + R() * .5})`; g.beginPath(); g.arc(128 + Math.cos(a) * r, 128 + Math.sin(a) * r, 1 + R() * 5, 0, 7); g.fill(); } });
const craters = new THREE.Group(); scene.add(craters);
function addCrater(x, size, tint) { const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ map: craterTex, color: tint, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, roughness: 1 })); m.rotation.set(-Math.PI / 2, 0, Math.random() * 6); m.position.set(x, .02, 0); m.receiveShadow = true; craters.add(m); }

const flag = (() => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, 2.2, 10).translate(0, 1.1, 0), chrome); const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(.9, -.28); sh.lineTo(0, -.56); const f = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({ color: '#e8563a', side: THREE.DoubleSide, roughness: .6 })); f.position.y = 2.15; p.castShadow = f.castShadow = true; g.add(p, f); g.visible = false; scene.add(g); return g; })();
const targetTex = canvasTex(512, 512, (g) => { const cols = ['#d8402f', '#f8f6ef', '#d8402f', '#f8f6ef', '#d8402f']; for (let i = 0; i < 5; i++) { g.fillStyle = cols[i]; g.beginPath(); g.arc(256, 256, 256 - i * 51, 0, 7); g.fill(); } g.fillStyle = '#0e0c08'; g.beginPath(); g.arc(256, 256, 12, 0, 7); g.fill(); });
const target = (() => { const g = new THREE.Group(); const d = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.MeshStandardMaterial({ map: targetTex, roughness: .85, transparent: true, opacity: .92, polygonOffset: true, polygonOffsetFactor: -3 })); d.rotation.x = -Math.PI / 2; d.position.y = .016; d.receiveShadow = true;
  const p = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 3.2, 10).translate(0, 1.6, 0), chrome); p.position.z = -3.4; p.castShadow = true;
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(1.2, 0); sh.lineTo(1.2, -.7); sh.lineTo(0, -.7); const f = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({ color: '#f2c230', side: THREE.DoubleSide })); f.position.set(0, 3.15, -3.4);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 16, 64, 1, true), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
    uniforms: { c: { value: new THREE.Color('#ffc93a').multiplyScalar(1.4) } },
    vertexShader: 'varying float vY; void main(){ vY = position.y / 16. + .5; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: 'uniform vec3 c; varying float vY; void main(){ gl_FragColor = vec4(c, .32 * pow(1. - vY, 2.2)); }' }));
  beam.position.y = 8; beam.renderOrder = 4;
  const board = new THREE.Mesh(new THREE.CircleGeometry(.85, 48), new THREE.MeshStandardMaterial({ map: targetTex, roughness: .7 })); board.position.set(0, 2.3, -3.35); board.castShadow = true;
  g.add(d, p, f, beam, board); g.visible = false; scene.add(g); return g; })();

/* =====================================================================
   6) Gezegen uygulama
   ===================================================================== */
const groundMats = {};
let curEnvRot = 0;
async function applyPlanet(pl) {
  const P = PSET[pl];
  const L = await loadPlanet(pl);
  if (pl !== S.planet) return;
  const G = P.ground;
  if (!groundMats[pl]) groundMats[pl] = groundMaterial({ col: L.gcol, nor: L.gnor, arm: L.garm, tile: G.tile, tintA: G.tintA, tintB: G.tintB, stripe: G.stripe, normalScale: G.normalScale, useArm: !G.armIsRough, fade: pl === 'moon' ? null : [950, 1650] });
  const gm = groundMats[pl];
  if (!bermMats[pl]) bermMats[pl] = groundMaterial({ col: L.gcol, nor: L.gnor, arm: L.garm, tile: G.tile, tintA: G.tintA, tintB: G.tintB, stripe: G.stripe, normalScale: G.normalScale, useArm: !G.armIsRough, fade: null });
  bermKey = ''; buildBerm();
  if (pl === 'moon') { terrain.material = gm; terrain.visible = true; disk.visible = false; }
  else { disk.material = gm; disk.visible = true; terrain.visible = false; }
  scene.background = pl === 'moon' ? new THREE.Color('#000000') : L.bg;
  scene.environment = L.env || null;
  scene.environmentIntensity = P.envI; scene.backgroundIntensity = P.bgI;
  let sd;
  if (P.sunUV) { curEnvRot = P.rot; const d = uvToDir(P.sunUV[0], P.sunUV[1]); sd = d.applyAxisAngle(new THREE.Vector3(0, 1, 0), -curEnvRot); scene.backgroundRotation.set(0, curEnvRot, 0); scene.environmentRotation.set(0, curEnvRot, 0); }
  else { sd = new THREE.Vector3(...P.sunDir).normalize(); scene.backgroundRotation.set(0, 0, 0); }
  SUN_DIR.copy(sd);
  sun.color.set(P.sunC); sun.intensity = P.sunI; hemi.intensity = P.hemi; hemi.color.set(pl === 'mars' ? '#e8c0a0' : '#c8d6ea'); hemi.groundColor.set(pl === 'mars' ? '#7a4a30' : '#6a7a4a');
  renderer.toneMappingExposure = P.exposure;
  scene.fog = P.fog ? new THREE.FogExp2(P.fog[0], P.fog[1]) : null;
  stars.visible = earthInSky.visible = pl === 'moon';
  if (pl === 'moon' && !earthInSky.material.map) { earthInSky.material.map = tex('tex/earth_day.jpg'); earthInSky.material.needsUpdate = true; }
  paintMat.opacity = pl === 'earth' ? .82 : .6;
  debrisMat.color.set(pl === 'earth' ? '#5d4b36' : pl === 'mars' ? '#8a4526' : '#77777a');
  scatterRocks(pl);
  craters.clear();
}

/* =====================================================================
   7) Kamera
   ===================================================================== */
const camT = { pos: new THREE.Vector3(), look: new THREE.Vector3() }, camLook = new THREE.Vector3(12, 5, 0);
const orbit = { th: -.6, ph: 1.15, r: 70, target: new THREE.Vector3(20, 5, 0) };
let frameBox = { x0: -6, x1: 40, y1: 12 };
function computeFrame() {
  let R, H;
  if (mission) { R = Math.max(mission.x * 1.12, 22); H = Math.max(R * .3, S.h0 + 7); }
  else { const sim = simulate(params()); R = Math.max(sim.R, 14); H = Math.max(sim.H, 5); }
  frameBox = { x0: -8, x1: R + Math.max(4, R * .05), y1: H + Math.max(2.5, H * .1) };
}
function sideCam(out) {
  const w = frameBox.x1 - frameBox.x0, cx = (frameBox.x0 + frameBox.x1) / 2, tv = Math.tan(camera.fov * DEG / 2);
  const yb = Math.min(0, gunBaseY) - .5, span = Math.max((frameBox.y1 - yb) / .86, w / camera.aspect);
  const d = span / (2 * tv), cy = yb + span * .46;
  out.pos.set(cx, cy + d * .07, d); out.look.set(cx, cy, 0);
}
let camShake = 0, intro = { t: 0, on: !reduceMotion };
const director = { shot: -1, t: 0, slow: 1, phase: 0 };
function cineShot(dt, bpos) {
  // Sinematik yönetmen: namlu arkası → yan takip → iniş noktası (ağır çekim) → dönen bitiş
  const T = cur ? cur.T : 1, t = tSim;
  let pos, look, k = 3;
  if (S.phase === 'flying' && cur) {
    const f = t / T;
    if (f < .2) { const q = sampleAt(cur, Math.min(T, T * .45)); pos = new THREE.Vector3(-12, S.h0 + 1.6, 7.5); look = new THREE.Vector3(q[1], q[2] * .8 + S.h0 * .2, 0); k = 12; director.slow = 1; director.phase = 1; }
    else if (f < .72) { pos = bpos.clone().add(new THREE.Vector3(-7 - cur.R * .04, 1.5 + bpos.y * -.15, 13 + cur.R * .06)); pos.y = Math.max(pos.y, 1.6); look = bpos.clone().add(new THREE.Vector3(5, 0, 0)); k = 4; director.slow = 1; director.phase = 2; }
    else { const R = cur.R; pos = new THREE.Vector3(R + 7 + R * .05, 1.3, 8 + R * .04); look = bpos.clone().lerp(new THREE.Vector3(R, 0, 0), .35); k = 5; director.slow = .4; director.phase = 3; }
  } else if (S.phase === 'landed' && cur) {
    director.t += dt; const a = director.t * .25 + .6, R = cur.R, r = 12 + R * .06;
    pos = new THREE.Vector3(R + Math.cos(a) * r, 3 + R * .02, Math.sin(a) * r + 2); look = new THREE.Vector3(R, .5, 0); k = 2; director.slow = 1;
  } else { director.t += dt; const a = 2.15 + Math.sin(director.t * .2) * .55, gc = new THREE.Vector3(-1.6, gunBaseY + 2.2, 0), r = 9.5;
    pos = gc.clone().add(new THREE.Vector3(Math.cos(a) * r, 1.4, Math.sin(a) * r)); look = gc.clone().add(new THREE.Vector3(.8, .4, 0)); k = 2.5; director.slow = 1; }
  pos.y = Math.max(pos.y, groundH(S.planet, pos.x, pos.z) + 1);
  camera.position.lerp(pos, 1 - Math.exp(-dt * k)); camLook.lerp(look, 1 - Math.exp(-dt * k * 1.4));
}
function updateCamera(dt, bpos, bvel) {
  if (intro.on) {
    intro.t += dt; const f = smooth(0, 1, intro.t / 4.2); sideCam(camT);
    const a = lerp(-1.9, 0, f), start = new THREE.Vector3(-2 + Math.cos(a) * 16, S.h0 + lerp(3, 0, f), Math.sin(a) * -16 + 3);
    const p = start.lerp(camT.pos, smooth(.35, 1, f)); camera.position.copy(p); camLook.copy(new THREE.Vector3(-1, S.h0 + 1, 0).lerp(camT.look, smooth(.2, 1, f)));
    if (f >= 1) intro.on = false; camera.lookAt(camLook); return;
  }
  const k = 1 - Math.exp(-dt * 3.2);
  if (S.cam === 'side') { sideCam(camT); camera.position.lerp(camT.pos, k); camLook.lerp(camT.look, k); director.slow = 1; }
  else if (S.cam === 'cine') cineShot(dt, bpos);
  else if (S.cam === 'chase') {
    director.slow = 1;
    const v = bvel.clone(); if (v.lengthSq() < .01 || S.phase !== 'flying') v.set(Math.cos(S.ang * DEG), Math.sin(S.ang * DEG) * .3, 0);
    const dir = v.normalize();
    const want = bpos.clone().add(new THREE.Vector3(-10, 3, 7.5)); want.y = Math.max(want.y, 1.4);
    camera.position.lerp(want, 1 - Math.exp(-dt * (S.phase === 'flying' ? 6 : 2.5)));
    camLook.lerp(bpos.clone().add(new THREE.Vector3(dir.x * 6, dir.y * 3, 0)), 1 - Math.exp(-dt * 7));
  } else {
    director.slow = 1;
    const o = orbit; const want = new THREE.Vector3(Math.sin(o.ph) * Math.sin(o.th), Math.cos(o.ph), Math.sin(o.ph) * Math.cos(o.th)).multiplyScalar(o.r).add(o.target);
    want.y = Math.max(want.y, groundH(S.planet, want.x, want.z) + 1.5);
    camera.position.lerp(want, 1 - Math.exp(-dt * 8)); camLook.lerp(o.target, 1 - Math.exp(-dt * 8));
  }
  camera.lookAt(camLook);
  if (camShake > 0 && !reduceMotion) { camera.position.x += (Math.random() - .5) * camShake; camera.position.y += (Math.random() - .5) * camShake; camShake *= Math.exp(-dt * 9); if (camShake < .004) camShake = 0; }
}

/* =====================================================================
   8) Ses
   ===================================================================== */
let AC = null;
function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
function boom(strength = 1, low = false) {
  const ac = audio(); if (!ac || !S.sound) return; const t = ac.currentTime;
  const len = 1.6, buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, low ? 5 : 3);
  const src = ac.createBufferSource(); src.buffer = buf; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(low ? 500 : 1800, t); lp.frequency.exponentialRampToValueAtTime(90, t + 1.2);
  const gn = ac.createGain(); gn.gain.setValueAtTime(.9 * strength, t); gn.gain.exponentialRampToValueAtTime(.001, t + len);
  const o = ac.createOscillator(); o.frequency.setValueAtTime(low ? 70 : 110, t); o.frequency.exponentialRampToValueAtTime(35, t + .5); const og = ac.createGain(); og.gain.setValueAtTime(.8 * strength, t); og.gain.exponentialRampToValueAtTime(.001, t + .6);
  src.connect(lp).connect(gn).connect(ac.destination); o.connect(og).connect(ac.destination); src.start(t); o.start(t); o.stop(t + .7);
}
function thud(soft) { const ac = audio(); if (!ac || !S.sound) return; const t = ac.currentTime; const o = ac.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(soft ? 260 : 90, t); o.frequency.exponentialRampToValueAtTime(soft ? 120 : 40, t + .2); const g = ac.createGain(); g.gain.setValueAtTime(soft ? .25 : .7, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + .35); }


/* =====================================================================
   9) Atış durumu
   ===================================================================== */
let cur = null, tSim = 0, landAnim = 0, landInfo = null, mission = null;
const BALLPOS = new THREE.Vector3(), BALLVEL = new THREE.Vector3();
function ballR() { return BALLS[S.ball].r; }
function restBall() { BALLPOS.set(0, S.h0 + ballR(), 0); BALLVEL.set(0, 0, 0); }
let pivotKick = 0;
function fire() {
  if (S.phase === 'flying' || intro.on) { if (intro.on) intro.on = false; else return; }
  audio();
  cur = simulate(params()); cur.params = { ...params(), planet: S.planet, ballKey: S.ball, g10: S.g10 };
  tSim = 0; S.phase = 'flying'; landInfo = null; ghostPts = []; ghosts.count = 0; director.t = 0;
  $('result').classList.remove('on'); flag.visible = false; hideTags();
  if (trails.length >= 5) { const t = trails.shift(); scene.remove(t); t.geometry.dispose(); }
  trails.forEach(t => t.material.uniforms.uOp.value = .4);
  const tr = makeTrail(cur, TRAIL_COLS[trailIdx++ % TRAIL_COLS.length], 1, false); tr.material.uniforms.uTime.value = 0; trails.push(tr); cur.trail = tr;
  if (predTrail) predTrail.visible = false;
  const a = S.ang * DEG, dir = new THREE.Vector3(Math.cos(a), Math.sin(a), 0), mouth = new THREE.Vector3(0, S.h0 + AXLE_R, 0);
  const air = PLANETS[S.planet].rho > 0;
  const smokeCol = S.planet === 'mars' ? '#e7c6aa' : '#d9d8d4';
  for (let i = 0; i < (air ? 34 : 14); i++) {
    const sp = Math.random();
    const v = dir.clone().multiplyScalar(3 + sp * 16).add(new THREE.Vector3((Math.random() - .5) * 5, (Math.random() - .3) * 3, (Math.random() - .5) * 5));
    puff(mouth.clone().addScaledVector(dir, .8), v, { color: smokeCol, size: .9 + Math.random() * 1.1, grow: air ? 5.5 : 2.5, life: air ? 3 + Math.random() * 2.5 : .9, drag: air ? 2.4 : .1, op: air ? .7 : .45 });
  }
  for (let i = 0; i < 3; i++) puff(mouth.clone().addScaledVector(dir, .9 + i * .5), dir.clone().multiplyScalar(4 + i * 3), { tex: flashTex, color: '#ffffff', size: 2.8 - i * .6, grow: .5, life: .12 + i * .03, drag: 0, op: 1, add: true, hdr: 3.5 });
  flashLight.position.copy(mouth).addScaledVector(dir, 1.2); flashLight.intensity = 90;
  pivotKick = .22; camShake = S.cam === 'side' ? 0 : .22;
  if (PLANETS[S.planet].sound) boom(S.planet === 'mars' ? .35 : 1, S.planet === 'mars'); else toast("Ay'da hava yok: patlamanın sesi duyulmaz.");
  if (S.planet === 'mars' && S.sound) toast("Mars'ın ince havasında ses çok kısık ve boğuk duyulur.");
  $('btn-fire').disabled = true; $('aimhint').style.display = 'none';
  graphHist.unshift(null); if (graphHist.length > 2) graphHist.pop();
}
function land() {
  S.phase = 'landed'; landAnim = 0; $('btn-fire').disabled = false; director.t = 0;
  const sim = cur, p = sim.params, x = sim.R;
  landInfo = { x, vImp: sim.vImp };
  const air = PLANETS[p.planet].rho > 0, moon = p.planet === 'moon';
  const dustCol = p.planet === 'earth' ? '#8a765a' : p.planet === 'mars' ? '#c47a4c' : '#a9a8a4';
  const heavy = p.ballKey === 'iron', E = heavy ? 1 : .25;
  for (let i = 0; i < (heavy ? 42 : 10); i++) {
    const a = Math.random() * Math.PI * 2, sp = (2 + Math.random() * 7) * E * (moon ? 1.6 : 1);
    const v = new THREE.Vector3(Math.cos(a) * sp * .7, (2 + Math.random() * 6) * E * (moon ? 1.4 : 1), Math.sin(a) * sp * .7);
    puff(new THREE.Vector3(x, .3, 0), v, { color: dustCol, size: heavy ? .8 + Math.random() * 1.2 : .35, grow: air ? 3.8 : .35, life: moon ? 2.6 : 2.2 + Math.random() * 1.8, grav: moon ? 1.62 : (air ? 1.2 : 3), drag: air ? 1.5 : 0, op: .8 });
  }
  if (heavy) { addCrater(x, 3, p.planet === 'moon' ? '#b0b0b0' : '#ffffff'); spawnDebris(x, 60, dustCol, p.g); camShake = S.cam === 'side' ? .05 : .35; thud(false); } else thud(true);
  flag.position.set(x, 0, -1.2); flag.visible = true;
  ghostUpdate(sim.T);
  if (mission) judgeMission(x); else if (S.cam === 'cine') setTimeout(() => { if (S.phase === 'landed' && cur === sim) showResult(); }, 1800); else showResult();
  graphHist[0] = { sim };
}
function resetShot() {
  S.phase = 'idle'; tSim = 0; $('btn-fire').disabled = false; restBall();
  ghosts.count = 0; ghostPts = []; flag.visible = false; $('result').classList.remove('on'); hideTags(); director.slow = 1;
  if (predTrail) predTrail.visible = true;
}
function ghostUpdate(t) {
  if (!S.strobe || !cur) { ghosts.count = 0; return; }
  const need = Math.min(MAXG, Math.floor(t / STROBE + 1e-9) + 1);
  while (ghostPts.length < need) { const q = sampleAt(cur, ghostPts.length * STROBE); ghostPts.push([q[1], q[2]]); }
  ghosts.count = ghostPts.length;
}

/* =====================================================================
   10) HUD, etiketler, sonuç kartı
   ===================================================================== */
const V3 = new THREE.Vector3();
function toScreen(p) { V3.copy(p).project(camera); const r = canvas.getBoundingClientRect(); return { x: (V3.x * .5 + .5) * r.width, y: (-V3.y * .5 + .5) * r.height, ok: V3.z < 1 && V3.z > -1 }; }
function tag(id, p, html) { const el = $(id), s = toScreen(p); if (!s.ok) { el.style.display = 'none'; return; } el.style.display = 'block'; el.style.left = s.x + 'px'; el.style.top = (s.y - 6) + 'px'; if (html != null && el._h !== html) { el.innerHTML = html; el._h = html; } }
function hideTags() { ['tag-apex', 'tag-land'].forEach(i => $(i).style.display = 'none'); }
function setHUD(q) {
  const [t, x, y, vx, vy] = q;
  $('h-t').textContent = fmt(t, 2) + ' s'; $('h-x').textContent = fmt(x, 1) + ' m'; $('h-y').textContent = fmt(y, 1) + ' m';
  $('h-vx').textContent = fmt(vx, 1) + ' m/s'; $('h-vy').textContent = fmt(vy, 1) + ' m/s'; $('h-v').textContent = fmt(Math.hypot(vx, vy), 1) + ' m/s';
}
function showResult() {
  const sim = cur, p = sim.params, gtxt = p.g === 10 ? '10' : fmt(p.g, 2).replace(/0$/, '');
  const c = Math.cos(p.ang * DEG), s = Math.sin(p.ang * DEG);
  let fx = '';
  if (!p.drag) {
    const vy = p.v0 * s, vx = p.v0 * c;
    fx = `<b>Formülle kontrol</b><br>vₓ = v₀·cosθ = ${fmt(vx, 2)} m/s, v₀ᵧ = v₀·sinθ = ${fmt(vy, 2)} m/s<br>` +
      `t<sub>tepe</sub> = v₀ᵧ / g = ${fmt(vy, 2)} / ${gtxt} = <b>${fmt(Math.max(0, vy / p.g), 2)} s</b><br>` +
      `h<sub>maks</sub> = h₀ + v₀ᵧ² / 2g = <b>${fmt(sim.H, 2)} m</b><br>` +
      (p.h0 === 0 ? `R = v₀²·sin2θ / g = ${fmt(p.v0 * p.v0, 0)}·${fmt(Math.sin(2 * p.ang * DEG), 3)} / ${gtxt} = <b>${fmt(sim.R, 2)} m</b>` : `R = vₓ·t<sub>uçuş</sub> = ${fmt(vx, 2)}·${fmt(sim.T, 2)} = <b>${fmt(sim.R, 2)} m</b>`);
  } else {
    const ideal = simulate({ ...p, drag: false });
    const loss = ideal.R - sim.R;
    fx = `<b>Hava direnci etkisi</b><br>Havasız ortamda menzil ${fmt(ideal.R, 1)} m olurdu. Hava, topu <b>${fmt(loss, 1)} m</b> (%${fmt(loss / ideal.R * 100, 0)}) kısa düşürdü.` +
      (p.ballKey === 'iron' ? '<br>Ağır gülle havadan az etkilenir.' : '<br>Hafif top havadan çok etkilenir; yörünge simetrik değildir.');
  }
  const hitHtml = mission && mission.last ? mission.last : '';
  $('result').innerHTML = `<h4>Atış sonucu <button aria-label="Kapat" onclick="this.closest('.a3res').classList.remove('on')">✕</button></h4>${hitHtml}
    <table><tr><td>Menzil (yatay uzaklık)</td><td>${fmt(sim.R, 1)} m</td></tr>
    <tr><td>Maksimum yükseklik</td><td>${fmt(sim.H, 1)} m</td></tr>
    <tr><td>Tepeye çıkış süresi</td><td>${fmt(sim.tA, 2)} s</td></tr>
    <tr><td>Uçuş süresi</td><td>${fmt(sim.T, 2)} s</td></tr>
    <tr><td>Yere çarpma hızı</td><td>${fmt(sim.vImp, 1)} m/s</td></tr></table><div class="fx">${fx}</div>`;
  $('result').classList.add('on');
}
let toastT = 0; function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 3200); }

/* =====================================================================
   11) Grafik
   ===================================================================== */
const gc = $('graph'), gx = gc.getContext('2d');
let graphKey = 'y', graphHist = [];
function drawGraph() {
  const r = gc.getBoundingClientRect(), W = r.width, H = r.height; if (!W) return;
  if (gc.width !== Math.round(W * DPR)) { gc.width = Math.round(W * DPR); gc.height = Math.round(H * DPR); }
  gx.setTransform(DPR, 0, 0, DPR, 0, 0); gx.clearRect(0, 0, W, H);
  const sim = cur && (S.phase !== 'idle') ? cur : simulate(params());
  const idx = { x: 1, y: 2, vx: 3, vy: 4 }[graphKey], names = { x: ['x', 'm'], y: ['y', 'm'], vx: ['vₓ', 'm/s'], vy: ['vᵧ', 'm/s'] }[graphKey];
  const col = { x: '#2d7dd2', y: '#e26d4f', vx: '#2d7dd2', vy: '#e0483b' }[graphKey];
  const P = sim.pts, n = P.length / 5, T = Math.max(sim.T, .5);
  let lo = 0, hi = 0; for (let i = 0; i < n; i++) { const v = P[i * 5 + idx]; lo = Math.min(lo, v); hi = Math.max(hi, v); }
  const prev = graphHist[1]; if (prev && prev.sim) { const Q = prev.sim.pts; for (let i = 0; i < Q.length / 5; i++) { lo = Math.min(lo, Q[i * 5 + idx]); hi = Math.max(hi, Q[i * 5 + idx]); } }
  if (hi - lo < 1) hi = lo + 1; const pad = (hi - lo) * .1; hi += pad; if (lo < 0) lo -= pad;
  const Tm = Math.max(T, prev && prev.sim ? prev.sim.T : 0);
  const L = 48, Rr = 48, Tp = 14, B = 26, pw = W - L - Rr, ph = H - Tp - B;
  const X = t => L + t / Tm * pw, Y = v => Tp + (hi - v) / (hi - lo) * ph;
  // ızgara
  gx.font = '600 11px "Plus Jakarta Sans", sans-serif'; gx.fillStyle = '#8a8375'; gx.strokeStyle = '#f0e8d6'; gx.lineWidth = 1;
  const nice = (span, k) => { const raw = span / k, p10 = Math.pow(10, Math.floor(Math.log10(raw))); const m = raw / p10; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p10; };
  const sy = nice(hi - lo, 4), st = nice(Tm, 6);
  gx.textAlign = 'right'; gx.textBaseline = 'middle';
  for (let v = Math.ceil(lo / sy) * sy; v <= hi; v += sy) { gx.beginPath(); gx.moveTo(L, Y(v)); gx.lineTo(L + pw, Y(v)); gx.stroke(); gx.fillText(fmt(v, sy < 1 ? 1 : 0), L - 6, Y(v)); }
  gx.textAlign = 'center'; gx.textBaseline = 'top';
  for (let t = 0; t <= Tm + 1e-9; t += st) { gx.beginPath(); gx.moveTo(X(t), Tp); gx.lineTo(X(t), Tp + ph); gx.stroke(); gx.fillText(fmt(t, st < 1 ? 1 : 0), X(t), Tp + ph + 5 > Y(0) + 3 && lo < 0 ? Y(0) + 4 : Tp + ph + 5); }
  // eksenler
  gx.strokeStyle = '#0e0c08'; gx.lineWidth = 1.5; const y0 = Y(Math.max(lo, 0) === lo ? lo : 0);
  gx.beginPath(); gx.moveTo(L, Tp - 4); gx.lineTo(L, Tp + ph); gx.moveTo(L, y0); gx.lineTo(L + pw + 10, y0); gx.stroke();
  gx.fillStyle = '#0e0c08'; gx.beginPath(); gx.moveTo(L + pw + 16, y0); gx.lineTo(L + pw + 8, y0 - 4); gx.lineTo(L + pw + 8, y0 + 4); gx.fill();
  gx.beginPath(); gx.moveTo(L, Tp - 10); gx.lineTo(L - 4, Tp - 2); gx.lineTo(L + 4, Tp - 2); gx.fill();
  gx.font = '800 12px "Plus Jakarta Sans", sans-serif'; gx.textAlign = 'left'; gx.textBaseline = 'middle'; gx.fillText('t (s)', L + pw + 20, y0);
  gx.textAlign = 'left'; gx.textBaseline = 'top'; gx.fillText(`${names[0]} (${names[1]})`, L + 8, Tp - 8);
  // önceki atış
  const line = (Q, upto, c, w, a) => { gx.strokeStyle = c; gx.globalAlpha = a; gx.lineWidth = w; gx.beginPath(); const m = Q.length / 5; const step = Math.max(1, Math.floor(m / 800)); let f = true; for (let i = 0; i < m; i += step) { if (Q[i * 5] > upto) break; const px = X(Q[i * 5]), py = Y(Q[i * 5 + idx]); f ? gx.moveTo(px, py) : gx.lineTo(px, py); f = false; } gx.stroke(); gx.globalAlpha = 1; };
  if (prev && prev.sim) line(prev.sim.pts, 1e9, '#b9b1a1', 2, .8);
  const upto = S.phase === 'flying' ? tSim : S.phase === 'landed' ? 1e9 : -1;
  if (S.phase === 'idle') { gx.setLineDash([5, 5]); line(P, 1e9, col, 2, .35); gx.setLineDash([]); }
  else line(P, upto, col, 3, 1);
  if (S.phase === 'flying') { const q = sampleAt(sim, tSim); gx.fillStyle = col; gx.beginPath(); gx.arc(X(q[0]), Y(q[idx]), 5, 0, 7); gx.fill(); }
  if (S.phase === 'idle') { gx.fillStyle = '#8a8375'; gx.font = '600 12px "Plus Jakarta Sans", sans-serif'; gx.textAlign = 'right'; gx.textBaseline = 'top'; gx.fillText('Ateşlediğinde grafik canlı çizilir', L + pw, Tp); }
}

/* =====================================================================
   12) Hedef görevi
   ===================================================================== */
let streak = 0; try { streak = +localStorage.getItem('bfy3d-streak') || 0; } catch (e) { }
function newMission() {
  const g = gNow(); S.drag = false; $('i-drag').checked = false; S.h0 = 0; $('i-h0').value = 0; buildTower(0);
  const type = Math.random() < .5 ? 'angle' : 'speed';
  let v0, ang;
  if (type === 'angle') { v0 = Math.round(14 + Math.random() * 20); ang = Math.round(18 + Math.random() * 30); S.v0 = v0; }
  else { ang = [30, 37, 45, 53, 60][Math.floor(Math.random() * 5)]; v0 = Math.round((14 + Math.random() * 22) * 2) / 2; S.ang = ang; }
  const x = Math.round(v0 * v0 * Math.sin(2 * ang * DEG) / g * 2) / 2;
  mission = { type, x, tries: 0, last: '' };
  target.position.set(x, 0, 0); target.visible = true;
  const gt = g === 10 ? '10' : fmt(g, 2).replace(/0$/, '');
  $('m-text').innerHTML = type === 'angle'
    ? `Hedef <b>${fmt(x, 1)} m</b> uzakta. Hız sabit: <b>v₀ = ${fmt(S.v0, 0)} m/s</b>. Açıyı bul. (g = ${gt} m/s², hava yok)`
    : `Hedef <b>${fmt(x, 1)} m</b> uzakta. Açı sabit: <b>θ = ${S.ang}°</b>. Hızı bul. (g = ${gt} m/s², hava yok)`;
  $('btn-mission').textContent = 'Başka hedef';
  $('i-v0').disabled = type === 'angle'; $('i-ang').disabled = type === 'speed'; $('i-h0').disabled = true;
  syncUI(); computeFrame(); resetShot(); updateScore();
  toast(type === 'angle' ? 'Açıyı ayarla ve ateşle!' : 'Hızı ayarla ve ateşle!');
}
function endMission() { mission = null; target.visible = false; $('i-v0').disabled = $('i-ang').disabled = $('i-h0').disabled = false; $('m-text').innerHTML = 'Sahneye bir hedef yerleştir. Hesapla, ayarla, tek atışta vurmaya çalış.'; $('btn-mission').textContent = 'Yeni hedef'; $('m-score').textContent = ''; }
function judgeMission(x) {
  mission.tries++; const d = x - mission.x, ad = Math.abs(d);
  if (ad <= 1.2) {
    if (mission.tries === 1) streak++; mission.last = `<div class="hit yes">🎯 ${ad < .4 ? 'Tam on ikiden!' : 'İsabet!'} ${mission.tries === 1 ? 'İlk atışta vurdun.' : mission.tries + '. atışta vurdun.'}</div>`;
    toast(mission.tries === 1 ? '🎯 İlk atışta isabet! Seri: ' + streak : '🎯 İsabet!');
    try { localStorage.setItem('bfy3d-streak', streak); } catch (e) { }
    mission.done = true;
  } else {
    if (mission.tries === 1) { streak = 0; try { localStorage.setItem('bfy3d-streak', 0); } catch (e) { } }
    mission.last = `<div class="hit no">${fmt(ad, 1)} m ${d < 0 ? 'kısa' : 'uzun'} kaldı. ${mission.tries >= 3 ? 'İpucu: R = v₀²·sin2θ / g' : 'Tekrar dene.'}</div>`;
  }
  showResult(); updateScore();
}
function updateScore() { $('m-score').textContent = mission ? `Atış: ${mission.tries} · İlk atış serisi: ${streak}` : ''; }


/* =====================================================================
   13) Arayüz bağlantıları
   ===================================================================== */
function syncUI() {
  $('i-v0').value = S.v0; $('i-ang').value = S.ang; $('i-h0').value = S.h0;
  $('o-v0').textContent = fmt(S.v0, S.v0 % 1 ? 1 : 0) + ' m/s'; $('o-ang').textContent = S.ang + '°'; $('o-h0').textContent = S.h0 + ' m';
  const P = PLANETS[S.planet], g = gNow();
  $('h-planet').innerHTML = `${P.name}<small>g = ${g === 10 ? '10' : fmt(g, 2).replace(/0$/, '')} m/s² · ${P.rho > 0 ? (S.drag ? 'hava direnci açık' : 'hava direnci kapalı') : 'hava yok'}</small>`;
  $('i-drag').disabled = P.rho === 0 || !!mission;
  $('drag-note').textContent = P.rho === 0 ? "Ay'da hava yok." : S.planet === 'mars' ? "Mars havası Dünya'nınkinin yaklaşık %1,6'sı kadar yoğun." : 'Kapalıyken kütle önemsizdir.';
  $('i-g10').disabled = S.planet !== 'earth';
  setBarrel(S.ang);
  if (S.phase !== 'flying') restBall();
  updatePred();
}
function updatePred() {
  if (predTrail) { scene.remove(predTrail); predTrail.geometry.dispose(); predTrail = null; }
  if (S.pred && !mission && S.phase !== 'flying') predTrail = makeTrail(simulate(params()), '#ffffff', .8, true);
}
let frameTimer = 0;
function paramChanged() { if (S.phase === 'landed') resetShot(); syncUI(); clearTimeout(frameTimer); frameTimer = setTimeout(computeFrame, 120); }
$('i-v0').addEventListener('input', e => { S.v0 = +e.target.value; paramChanged(); });
$('i-ang').addEventListener('input', e => { S.ang = +e.target.value; paramChanged(); });
$('i-h0').addEventListener('input', e => { S.h0 = +e.target.value; buildTower(S.h0); paramChanged(); });
$('i-drag').addEventListener('change', e => { S.drag = e.target.checked; paramChanged(); });
$('i-g10').addEventListener('change', e => { S.g10 = e.target.checked; if (mission) newMission(); paramChanged(); });
document.querySelectorAll('#cards-planet .a3c').forEach(b => b.addEventListener('click', () => {
  if (S.planet === b.dataset.p) return;
  if (S.phase !== 'idle') resetShot();
  document.querySelectorAll('#cards-planet .a3c').forEach(x => x.classList.toggle('on', x === b));
  S.planet = b.dataset.p; clearTrails();
  if (!loaded[S.planet]) toast(S.planet === 'moon' ? "Ay yüzeyi yükleniyor…" : "Mars yüzeyi yükleniyor…");
  applyPlanet(S.planet).then(() => toast(S.planet === 'moon' ? 'Ay: g ≈ 1,62 m/s², hava yok.' : S.planet === 'mars' ? 'Mars: g ≈ 3,71 m/s², çok ince hava.' : 'Dünya: g ≈ 9,8 m/s².'));
  if (mission) newMission(); paramChanged();
}));
document.querySelectorAll('#cards-ball .a3c').forEach(b => b.addEventListener('click', () => {
  if (S.phase !== 'idle') resetShot();
  document.querySelectorAll('#cards-ball .a3c').forEach(x => x.classList.toggle('on', x === b));
  S.ball = b.dataset.b; setBallLook(); paramChanged();
  if (S.ball === 'beach' && !S.drag && PLANETS[S.planet].rho > 0) toast('İpucu: Plaj topuyla "Hava direnci"ni açıp bir de öyle dene.');
}));
function segs(id, fn) { const el = $(id); el.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); fn(b); })); }
segs('seg-cam', b => { S.cam = b.dataset.cam; intro.on = false; director.t = 0;
  if (S.cam === 'free') { orbit.target.set((frameBox.x0 + frameBox.x1) / 2, frameBox.y1 * .3, 0); orbit.r = Math.max(30, (frameBox.x1 - frameBox.x0) * .9); orbit.th = -.7; orbit.ph = 1.2; toast('Sürükleyerek döndür, tekerlek ya da iki parmakla yakınlaş.'); }
  if (S.cam === 'cine') toast('Sinematik kamera: ateşle ve izle.'); });
segs('seg-speed', b => { S.speed = +b.dataset.s; });
segs('seg-graph', b => { graphKey = b.dataset.g; });
const tg = (id, key, after) => $(id).addEventListener('click', e => { S[key] = !S[key]; e.currentTarget.classList.toggle('on', S[key]); after && after(); });
tg('tg-strobe', 'strobe', () => { if (!S.strobe) ghosts.count = 0; else if (cur && S.phase !== 'idle') ghostUpdate(S.phase === 'landed' ? cur.T : tSim); });
tg('tg-vec', 'vec'); tg('tg-comp', 'comp'); tg('tg-pred', 'pred', () => { if (S.pred && mission) toast('Hedef görevinde tahmini yörünge gizlidir.'); updatePred(); });
$('btn-fire').addEventListener('click', fire);
$('btn-clear').addEventListener('click', () => { clearTrails(); resetShot(); });
function clearTrails() { trails.forEach(t => { scene.remove(t); t.geometry.dispose(); }); trails = []; craters.clear(); graphHist = []; ghosts.count = 0; ghostPts = []; debris.count = 0; }
$('btn-sound').addEventListener('click', e => { S.sound = !S.sound; e.currentTarget.textContent = S.sound ? '🔊' : '🔇'; });
$('btn-full').addEventListener('click', () => {
  if (document.fullscreenElement || stage.classList.contains('pseudo-full')) { if (document.fullscreenElement) document.exitFullscreen(); stage.classList.remove('pseudo-full'); return; }
  if (stage.requestFullscreen) stage.requestFullscreen().catch(() => stage.classList.add('pseudo-full')); else stage.classList.add('pseudo-full');
});
$('btn-mission').addEventListener('click', () => { if (S.phase !== 'idle') resetShot(); clearTrails(); newMission(); });
window.addEventListener('keydown', e => { if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return; if (e.code === 'Space' || e.key === 'Enter') { if (e.target.tagName === 'BUTTON') return; e.preventDefault(); fire(); } if (e.key === 'Escape') stage.classList.remove('pseudo-full'); });

const pointers = new Map(); let aiming = false, pinch0 = 0, r0 = 0;
canvas.addEventListener('pointerdown', e => {
  canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); intro.on = false;
  if (pointers.size === 2 && S.cam === 'free') { const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); r0 = orbit.r; return; }
  if (S.phase === 'flying') return;
  const r = canvas.getBoundingClientRect(), m = toScreen(new THREE.Vector3(0, S.h0 + AXLE_R, 0));
  if (S.cam !== 'free' && Math.hypot(e.clientX - r.left - m.x, e.clientY - r.top - m.y) < Math.max(70, r.width * .08)) { aiming = true; if (S.phase === 'landed') resetShot(); aimAt(e); }
});
function aimAt(e) {
  const r = canvas.getBoundingClientRect(), m = toScreen(new THREE.Vector3(0, S.h0 + AXLE_R, 0));
  const dx = e.clientX - r.left - m.x, dy = -(e.clientY - r.top - m.y); const len = Math.hypot(dx, dy); if (len < 8) return;
  const a = clamp(Math.round(Math.atan2(dy, dx) / DEG), 0, 80);
  const v = clamp(Math.round((5 + len / Math.max(160, r.width * .22) * 30) * 2) / 2, 5, 40);
  if (!(mission && mission.type === 'speed')) S.ang = a;
  if (!(mission && mission.type === 'angle')) S.v0 = v;
  syncUI(); $('aimhint').style.display = 'none';
}
canvas.addEventListener('pointermove', e => {
  const prev = pointers.get(e.pointerId); if (!prev) return; const now = { x: e.clientX, y: e.clientY }; pointers.set(e.pointerId, now);
  if (aiming) { aimAt(e); return; }
  if (S.cam === 'free') {
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch0) orbit.r = clamp(r0 * pinch0 / d, 6, 1800); return; }
    orbit.th -= (now.x - prev.x) * .006; orbit.ph = clamp(orbit.ph - (now.y - prev.y) * .005, .15, 1.52);
  }
});
const endPtr = e => { pointers.delete(e.pointerId); if (aiming) { aiming = false; computeFrame(); } if (pointers.size < 2) pinch0 = 0; };
canvas.addEventListener('pointerup', endPtr); canvas.addEventListener('pointercancel', endPtr);
canvas.addEventListener('wheel', e => { if (S.cam !== 'free') return; e.preventDefault(); orbit.r = clamp(orbit.r * Math.exp(e.deltaY * .0012), 6, 1800); }, { passive: false });

/* =====================================================================
   14) Döngü
   ===================================================================== */
// Uyarlanır kalite: yavaş cihazda (akıllı tahta, eski telefon) çözünürlük, parıltı ve gölge kendiliğinden düşer
const qParam = new URLSearchParams(location.search).get('q');
const Q = { level: qParam === 'low' ? 0 : qParam === 'med' ? 1 : qParam === 'high' ? 2 : (isMobile ? 1 : 2), locked: !!qParam, dpr: DPR, frames: 0, acc: 0 };
function applyQuality() {
  Q.dpr = Q.level === 2 ? DPR : Q.level === 1 ? Math.min(DPR, 1.25) : 1;
  renderer.setPixelRatio(Q.dpr);
  const sm = Q.level === 2 ? (isMobile ? 1024 : 2048) : 1024;
  if (sun.shadow.mapSize.x !== sm) { sun.shadow.mapSize.set(sm, sm); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
  renderer.shadowMap.type = Q.level === 0 ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  resize();
}
function resize() {
  const r = stage.getBoundingClientRect(); const w = Math.max(1, r.width), h = Math.max(1, r.height);
  renderer.setSize(w, h, false); composer.setPixelRatio(Q.dpr); composer.setSize(w, h); bloom.setSize(w * Q.dpr / 2, h * Q.dpr / 2);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
function qualityTick(dt) {
  if (Q.locked || Q.level === 0 || intro.on && intro.t < .6) return;
  Q.frames++; Q.acc += dt;
  if (Q.frames >= 90) { const fps = Q.frames / Q.acc; Q.frames = 0; Q.acc = 0;
    if (fps < 45) { Q.level--; applyQuality(); if (Q.level === 0) Q.locked = true; } else Q.locked = true; }
}
new ResizeObserver(() => { resize(); computeFrame(); }).observe(stage);
applyQuality();

const clock = new THREE.Clock(); let firstFrame = true, spin = 0, running = false;
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3();
function visScale(p, r) { const d = camera.position.distanceTo(p); const px = (2 * r) / (2 * d * Math.tan(camera.fov * DEG / 2)) * canvas.clientHeight; return Math.max(1, 9 / Math.max(px, 1e-3)); }
let visible = true;
new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);
function tick() {
  requestAnimationFrame(tick);
  if (window.__pause) { clock.getDelta(); return; }
  const rawDt = clock.getDelta(), dt = Math.min(rawDt, 1 / 20);
  if (!visible && !document.fullscreenElement) return;
  const r = ballR();
  let q = [0, 0, S.h0, 0, 0];
  if (S.phase === 'flying' && cur) {
    tSim += dt * S.speed * director.slow;
    if (tSim >= cur.T) { tSim = cur.T; q = sampleAt(cur, tSim); BALLPOS.set(q[1], q[2] + r, 0); land(); }
    else { q = sampleAt(cur, tSim); BALLPOS.set(q[1], q[2] + r, 0); BALLVEL.set(q[3], q[4], 0); }
    cur.trail.material.uniforms.uTime.value = tSim; ghostUpdate(tSim);
    spin += dt * S.speed * director.slow * (S.ball === 'iron' ? 1.5 : 9);
  } else if (S.phase === 'landed' && cur) {
    q = sampleAt(cur, cur.T); landAnim += dt;
    const p = cur.params, rr = BALLS[p.ballKey].r;
    if (p.ballKey === 'iron') BALLPOS.set(cur.R, rr - Math.min(landAnim * 4, 1) * rr * .45, 0);
    else {
      const e = p.ballKey === 'beach' ? .45 : .55, gg = p.g; let vy = Math.min(Math.abs(q[4]) * e, 12), x = cur.R, y = 0, vx = q[3] * .6, tt = landAnim;
      while (vy > .4 && tt > 2 * vy / gg) { tt -= 2 * vy / gg; x += vx * 2 * vy / gg; vy *= e; vx *= .7; }
      if (vy > .4) { y = vy * tt - .5 * gg * tt * tt; x += vx * tt; spin += dt * 5; } else x += vx * Math.min(tt, .6) * (1 - Math.min(tt, .6) / 1.2);
      BALLPOS.set(x, Math.max(0, y) + rr, 0);
    }
    BALLVEL.set(0, 0, 0);
  } else { restBall(); }

  updateCamera(dt, BALLPOS, BALLVEL);
  camera.updateMatrixWorld();

  const k = (S.cam === 'side' || S.cam === 'free') ? visScale(BALLPOS, r) : 1;
  const idle = S.phase === 'idle';
  ball.scale.setScalar(r * (idle ? 1 : k)); ball.position.copy(BALLPOS);
  if (!idle && k > 1 && S.phase === 'landed') ball.position.y += r * (k - 1);
  ball.rotation.set(0, 0, -spin);
  if (ghosts.count) { const kg = (S.cam === 'side' || S.cam === 'free') ? visScale(camLook, r) * .9 : 1; for (let i = 0; i < ghosts.count; i++) { const [gx0, gy0] = ghostPts[i]; tmpP.set(gx0, gy0 + r, 0); tmpS.setScalar(r * Math.max(1, kg) * .9); tmpM.compose(tmpP, tmpQ, tmpS); ghosts.setMatrixAt(i, tmpM); } ghosts.instanceMatrix.needsUpdate = true; }
  const scalePx = canvas.clientHeight / (2 * Math.tan(camera.fov * DEG / 2)) * DPR;
  trails.forEach(t => { t.material.uniforms.uScale.value = scalePx; }); if (predTrail) predTrail.material.uniforms.uScale.value = scalePx;

  if (S.vec && S.phase === 'flying' && !(S.cam === 'cine' && director.phase !== 2) && S.cam !== 'chase') {
    const f = Math.max(1, k * .6), sc = .16 * f, th = .045 * f, c = BALLPOS.clone();
    arV.set(c, new THREE.Vector3(q[3], q[4], 0).multiplyScalar(sc), th);
    arVx.set(c, new THREE.Vector3(q[3], 0, 0).multiplyScalar(sc), th * .8);
    arVy.set(c, new THREE.Vector3(0, q[4], 0).multiplyScalar(sc), th * .8);
  } else { arV.hide(); arVx.hide(); arVy.hide(); }
  if (S.phase !== 'flying' && (aiming || S.phase === 'idle') && S.cam !== 'cine') {
    const a = S.ang * DEG, dir = new THREE.Vector3(Math.cos(a), Math.sin(a), 0), from = new THREE.Vector3(0, S.h0 + AXLE_R, 0).addScaledVector(dir, .6);
    const kk = Math.max(1, visScale(from, .25) * .5); arAim.set(from, dir.multiplyScalar(S.v0 * .14 * kk), .05 * kk); arAim.shaft.material.opacity = aiming ? .95 : .5;
  } else arAim.hide();
  compG.visible = S.comp && S.phase !== 'idle';
  if (compG.visible) {
    const kc = Math.max(1, visScale(BALLPOS, .2) * .8);
    pole.scale.y = Math.max(10, (cur ? cur.H : 10) + 3); pole.scale.x = pole.scale.z = Math.max(1, kc * .6);
    markX.scale.setScalar(.2 * kc); markX.position.set(q[1], .2 * kc, 0);
    markY.scale.setScalar(.2 * kc); markY.position.set(1.6, q[2] + r, -2.9);
    setLine(dashX, BALLPOS, markX.position); setLine(dashY, BALLPOS, markY.position);
  }
  if (pivotKick > 0) pivotKick = Math.max(0, pivotKick - dt * .9);
  barrel.position.x = GUN.f - pivotKick * Math.min(1, pivotKick * 12) * 1.2;
  flashLight.intensity *= Math.exp(-dt * 28);
  stepParts(dt); stepDebris(dt);

  disk.position.set(camera.position.x, meadowY, camera.position.z);
  if (disk.material.userData.U) disk.material.userData.U.uCenter.value.set(camera.position.x, camera.position.z);
  stars.position.copy(camera.position); earthInSky.position.copy(camera.position).add(EARTH_DIR);
  const focus = S.phase === 'flying' ? BALLPOS : camLook;
  sun.target.position.set(Math.round(focus.x / 4) * 4, 0, Math.round(focus.z / 4) * 4); sun.position.copy(sun.target.position).addScaledVector(SUN_DIR, 300);

  if (S.phase === 'landed' && cur) {
    tag('tag-apex', new THREE.Vector3(sampleAt(cur, cur.tA)[1], cur.H + r * 2 + .6, 0), `h<sub>maks</sub> = ${fmt(cur.H, 1)} m`);
    tag('tag-land', new THREE.Vector3(cur.R, 2.7, -1.2), `R = ${fmt(cur.R, 1)} m`);
  }
  if (mission) tag('tag-target', new THREE.Vector3(mission.x, 3.8, -3.4), `🎯 ${fmt(mission.x, 1)} m`); else $('tag-target').style.display = 'none';
  setHUD(q);
  drawGraph();
  if (Q.level > 0) composer.render(dt); else renderer.render(scene, camera);
  qualityTick(Math.min(rawDt, .5));
  if (firstFrame) { firstFrame = false; $('loading').classList.add('off'); }
}

/* =====================================================================
   15) Başlat
   ===================================================================== */
resize(); syncUI(); computeFrame();
applyPlanet('earth').then(() => {
  sideCam(camT); camLook.copy(camT.look);
  loadCrates();
  if (!running) { running = true; clock.getDelta(); requestAnimationFrame(tick); }
});
window.__bfy3d = { simulate, params, S, fire, Q, get cur() { return cur; }, camera, scene, intro, director, target, get mission() { return mission; }, set speed(v) { S.speed = v; } };
