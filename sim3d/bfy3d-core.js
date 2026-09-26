// BFY · Ortak sinematik 3B motor (Three.js r180, kendi barındırdığımız)
// Her laboratuvar bu modülü içe aktarır: sahne, ortam (HDRI), son işleme, uyarlanır kalite,
// yörünge kamerası, parçacıklar, oklar ve HUD yardımcıları burada.
import * as THREE from 'three';
import { GLTFLoader } from './lib/loaders/GLTFLoader.js';
import { HDRLoader } from './lib/loaders/HDRLoader.js';
import { EffectComposer } from './lib/postprocessing/EffectComposer.js';
import { RenderPass } from './lib/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './lib/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './lib/postprocessing/OutputPass.js';
export { THREE };

/* ---------- küçük yardımcılar ---------- */
export const $ = id => document.getElementById(id);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
export const fmt = (n, d = 1) => (Math.abs(n) < .5 * Math.pow(10, -d) ? 0 : n).toFixed(d).replace('.', ',');
export const DEG = Math.PI / 180;
export const reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
export const isMobile = Math.min(screen.width, screen.height) < 700 || /Android|iPhone|iPad/i.test(navigator.userAgent);
export function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export const Noise = (() => {
  const R = rng(1907); const p = new Uint8Array(512); const b = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  for (let i = 0; i < 512; i++) p[i] = b[i & 255];
  const g = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]], F2 = .5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  function n2(x, y) {
    const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s), t = (i + j) * G2, x0 = x - (i - t), y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1, x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2, ii = i & 255, jj = j & 255; let n = 0;
    let t0 = .5 - x0 * x0 - y0 * y0; if (t0 > 0) { const q = g[p[ii + p[jj]] & 7]; t0 *= t0; n += t0 * t0 * (q[0] * x0 + q[1] * y0); }
    let t1 = .5 - x1 * x1 - y1 * y1; if (t1 > 0) { const q = g[p[ii + i1 + p[jj + j1]] & 7]; t1 *= t1; n += t1 * t1 * (q[0] * x1 + q[1] * y1); }
    let t2 = .5 - x2 * x2 - y2 * y2; if (t2 > 0) { const q = g[p[ii + 1 + p[jj + 1]] & 7]; t2 *= t2; n += t2 * t2 * (q[0] * x2 + q[1] * y2); }
    return 70 * n;
  }
  const fbm = (x, y, o = 5) => { let a = .5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * n2(x * f, y * f); f *= 2.03; a *= .5; } return s; };
  return { n2, fbm };
})();
export function canvasTex(w, h, draw, { repeat = null, srgb = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  t.anisotropy = 8; return t;
}

/* ---------- ortamlar (fotoğraf gerçekliğinde 360° arka planlar) ---------- */
const BASE = new URL('./', import.meta.url).href;
export const ENVS = {
  alps: { bg: 'env/earth_bg.jpg', hdr: 'env/earth_1k.hdr', sunUV: [.5967, .2598], rot: 2.45, exposure: .95, sunI: 3.4, sunC: '#fff2dc', hemi: .5 },
  lake: { bg: 'env/lake_bg.jpg', hdr: 'env/lake_1k.hdr', sunUV: [.5947, .2539], rot: 2.83, exposure: .95, sunI: 3.2, sunC: '#fff2dc', hemi: .45 },
  lab:  { bg: 'env/lab_bg.jpg', hdr: 'env/lab_1k.hdr', sunUV: [.54, .28], rot: 0, exposure: 1.0, sunI: 1.6, sunC: '#fff6ea', hemi: .25, blur: .035 },
};
const uvToDir = (u, vTop) => { const phi = (u - .5) * Math.PI * 2, th = (.5 - vTop) * Math.PI; return new THREE.Vector3(Math.cos(th) * Math.cos(phi), Math.sin(th), Math.cos(th) * Math.sin(phi)); };

/* ---------- dünya ---------- */
export function createWorld({ stage, canvas, fov = 36, near = .02, far = 20000, bloom = [.25, .5, .96], shadowBox = 4, shadowFar = 60, antialiasSamples } = {}) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); }
  catch (e) { const L = $('loading'); if (L) L.innerHTML = '<div style="max-width:420px;text-align:center;padding:20px">Tarayıcın 3B grafiği (WebGL) desteklemiyor. Chrome, Edge ya da Safari\'nin güncel sürümünü dene.</div>'; throw e; }
  const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2);
  renderer.setPixelRatio(DPR); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 16 / 9, near, far);
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: new URLSearchParams(location.search).has('aa') ? +new URLSearchParams(location.search).get('aa') : (antialiasSamples ?? 4) }));
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), bloom[0], bloom[1], bloom[2]);
  composer.addPass(bloomPass); composer.addPass(new OutputPass());
  const hemi = new THREE.HemisphereLight('#c8d6ea', '#6a6450', .3); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffffff', 2); sun.castShadow = true;
  sun.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -shadowBox, right: shadowBox, top: shadowBox, bottom: -shadowBox, near: .1, far: shadowFar });
  sun.shadow.bias = -.0002; sun.shadow.normalBias = .02; scene.add(sun, sun.target);
  const sunDir = new THREE.Vector3(-.4, .8, .5).normalize();

  const manager = new THREE.LoadingManager();
  manager.onProgress = (u, l, t) => { const el = $('load-pct'); if (el) el.textContent = Math.round(l / t * 100) + '%'; };
  const texL = new THREE.TextureLoader(manager), hdrL = new HDRLoader(manager), gltfL = new GLTFLoader(manager);
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const W = { THREE, renderer, scene, camera, composer, bloomPass, hemi, sun, sunDir, pmrem, stage, canvas, DPR };
  W.tex = (path, srgb = true, rep) => { const t = texL.load(BASE + path); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = aniso; if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const gcache = {};
  const TEXKEYS = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'clearcoatMap', 'clearcoatNormalMap', 'sheenColorMap', 'alphaMap'];
  const sharpen = root => root.traverse(o => { if (!o.isMesh) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => TEXKEYS.forEach(k => { if (m[k]) { m[k].anisotropy = aniso; m[k].needsUpdate = true; } })); });
  W.gltf = path => gcache[path] || (gcache[path] = new Promise((res, rej) => gltfL.load(BASE + path, g => { sharpen(g.scene); res(g.scene); }, undefined, rej)));
  W.loadEnv = key => new Promise(res => {
    const E = ENVS[key]; let pend = 2; const done = () => { if (--pend === 0) res(); };
    texL.load(BASE + E.bg, t => { t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; scene.background = t; done(); });
    hdrL.load(BASE + E.hdr, t => { t.mapping = THREE.EquirectangularReflectionMapping; scene.environment = pmrem.fromEquirectangular(t).texture; t.dispose(); done(); });
    scene.backgroundRotation.set(0, E.rot, 0); scene.environmentRotation.set(0, E.rot, 0);
    scene.backgroundBlurriness = E.blur || 0; scene.backgroundIntensity = 1; scene.environmentIntensity = 1;
    sunDir.copy(uvToDir(E.sunUV[0], E.sunUV[1]).applyAxisAngle(new THREE.Vector3(0, 1, 0), -E.rot));
    sun.color.set(E.sunC); sun.intensity = E.sunI; hemi.intensity = E.hemi; renderer.toneMappingExposure = E.exposure;
  });

  /* uyarlanır kalite */
  const qp = new URLSearchParams(location.search).get('q');
  const Q = W.Q = { level: qp === 'low' ? 0 : qp === 'med' ? 1 : qp === 'high' ? 2 : (isMobile ? 1 : 2), locked: !!qp, dpr: DPR, frames: 0, acc: 0, warm: 0 };
  function resize() {
    const r = stage.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false); composer.setPixelRatio(Q.dpr); composer.setSize(w, h); bloomPass.setSize(w * Q.dpr / 2, h * Q.dpr / 2);
    camera.aspect = w / h; camera.updateProjectionMatrix(); W.onResize && W.onResize(w, h);
  }
  function applyQuality() {
    Q.dpr = Q.level === 2 ? DPR : Q.level === 1 ? Math.min(DPR, 1.5) : 1; renderer.setPixelRatio(Q.dpr); bloomPass.enabled = Q.level > 0;
    const sm = Q.level === 2 ? (isMobile ? 1024 : 2048) : 1024;
    if (sun.shadow.mapSize.x !== sm) { sun.shadow.mapSize.set(sm, sm); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
    renderer.shadowMap.type = Q.level === 0 ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap; resize();
  }
  W.resize = resize; applyQuality();
  new ResizeObserver(resize).observe(stage);

  /* ekran izdüşümü ve etiketler */
  const V = new THREE.Vector3();
  W.toScreen = p => { V.copy(p).project(camera); const r = canvas.getBoundingClientRect(); return { x: (V.x * .5 + .5) * r.width, y: (-V.y * .5 + .5) * r.height, ok: V.z < 1 && V.z > -1 }; };
  W.tag = (el, p, html) => { if (!el) return; const s = W.toScreen(p); if (!s.ok) { el.style.display = 'none'; return; } el.style.display = 'block'; el.style.left = s.x + 'px'; el.style.top = s.y + 'px'; if (html != null && el._h !== html) { el.innerHTML = html; el._h = html; } };

  /* yörünge kamerası */
  const orbit = W.orbit = { target: new THREE.Vector3(), r: 2, th: 0, ph: 1.2, minR: .3, maxR: 50, minPh: .2, maxPh: 1.52, enabled: true, auto: 0, look: new THREE.Vector3() };
  W.orbitPos = (o = orbit) => new THREE.Vector3(Math.sin(o.ph) * Math.sin(o.th), Math.cos(o.ph), Math.sin(o.ph) * Math.cos(o.th)).multiplyScalar(o.r).add(o.target);
  const pointers = new Map(); let pinch0 = 0, r0 = 0, dragging = false;
  W.pointerHook = null; // laboratuvar kendi sürükleme işlemini buraya bağlar: (type, e) => true ise yörüngeyi engeller
  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); r0 = orbit.r; dragging = false; return; }
    dragging = !(W.pointerHook && W.pointerHook('down', e)); if (dragging) orbit.auto = 0;
  });
  canvas.addEventListener('pointermove', e => {
    const prev = pointers.get(e.pointerId); if (!prev) { W.pointerHook && W.pointerHook('hover', e); return; }
    const now = { x: e.clientX, y: e.clientY }; pointers.set(e.pointerId, now);
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch0) orbit.r = clamp(r0 * pinch0 / d, orbit.minR, orbit.maxR); return; }
    if (!dragging) { W.pointerHook && W.pointerHook('move', e); return; }
    if (!orbit.enabled) return;
    orbit.th -= (now.x - prev.x) * .006; orbit.ph = clamp(orbit.ph - (now.y - prev.y) * .005, orbit.minPh, orbit.maxPh);
  });
  const up = e => { pointers.delete(e.pointerId); if (!dragging) W.pointerHook && W.pointerHook('up', e); dragging = false; if (pointers.size < 2) pinch0 = 0; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('wheel', e => { if (!orbit.enabled) return; e.preventDefault(); orbit.r = clamp(orbit.r * Math.exp(e.deltaY * .0012), orbit.minR, orbit.maxR); }, { passive: false });
  W.updateOrbit = (dt, k = 7) => {
    if (orbit.auto) orbit.th += orbit.auto * dt;
    camera.position.lerp(W.orbitPos(), 1 - Math.exp(-dt * k)); orbit.look.lerp(orbit.target, 1 - Math.exp(-dt * k)); camera.lookAt(orbit.look);
  };
  W.ray = (e) => { const r = canvas.getBoundingClientRect(); const rc = new THREE.Raycaster(); rc.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera); return rc; };

  /* parçacıklar */
  W.smokeTex = (() => { const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); const img = g.createImageData(N, N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const x = i / N - .5, y = j / N - .5, r = Math.hypot(x, y) * 2, n = Noise.fbm(i * .045, j * .045, 5) * .5 + .5, a = Math.max(0, 1 - r) ** 1.6 * (.55 + n * .9), k = (j * N + i) * 4, l = 200 + n * 55;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = l; img.data[k + 3] = clamp(a * 255, 0, 255); }
    g.putImageData(img, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  W.dropTex = canvasTex(64, 64, g => { const gr = g.createRadialGradient(28, 26, 2, 32, 32, 30); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(220,240,255,.8)'); gr.addColorStop(1, 'rgba(200,230,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
  const parts = [];
  W.puff = (pos, vel, { color = '#dcdcdc', size = 1, grow = 2, life = 2.5, grav = 0, drag = 1.2, op = .8, tex = W.smokeTex, add = false, hdr = 1, floor = -1e9 } = {}) => {
    const m = new THREE.SpriteMaterial({ map: tex, color: new THREE.Color(color).multiplyScalar(hdr), transparent: true, depthWrite: false, opacity: op, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: !add });
    const s = new THREE.Sprite(m); s.position.copy(pos); s.scale.setScalar(size); m.rotation = Math.random() * 6; scene.add(s);
    parts.push({ s, v: vel.clone(), size, grow, life, t: 0, grav, drag, op, floor, spin: (Math.random() - .5) * .8 });
  };
  function stepParts(dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.t += dt; const k = p.t / p.life;
      if (k >= 1 || p.s.position.y < p.floor) { scene.remove(p.s); p.s.material.dispose(); parts.splice(i, 1); continue; }
      p.v.multiplyScalar(Math.exp(-p.drag * dt)); p.v.y -= p.grav * dt; p.s.position.addScaledVector(p.v, dt); p.s.material.rotation += p.spin * dt;
      p.s.scale.setScalar(p.size * (1 + p.grow * Math.sqrt(k))); p.s.material.opacity = p.op * (1 - k) * (k < .06 ? k / .06 : 1);
    }
  }

  /* döngü */
  const clock = new THREE.Clock(); let visible = true, first = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);
  W.update = null;
  function tick() {
    requestAnimationFrame(tick);
    if (window.__pause) { clock.getDelta(); return; }
    const raw = clock.getDelta(), dt = Math.min(raw, 1 / 20);
    if (!visible && !document.fullscreenElement && !stage.classList.contains('pseudo-full')) return;
    W.update && W.update(dt);
    stepParts(dt);
    composer.render(dt);
    if (first) { first = false; const L = $('loading'); if (L) L.classList.add('off'); }
    // Uyarlanır kalite: yalnızca uzun süre gerçekten yavaşsa ve en fazla bir kademe düşer (keskinlik korunur)
    if (!Q.locked && Q.level === 2) { Q.warm += raw; if (Q.warm > 6 && raw < .2) { Q.frames++; Q.acc += raw; if (Q.frames >= 240) { const fps = Q.frames / Q.acc; Q.frames = 0; Q.acc = 0; if (fps < 28) { Q.level = 1; applyQuality(); } Q.locked = true; } } }
  }
  W.start = () => {
    // Açılışta gölgelendiricileri önceden derle: ilk etkileşimde takılma olmasın
    const warm = [W.smokeTex, W.dropTex].flatMap(t => [false, true].map(add => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity: .001, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: !add })); s.position.copy(camera.position).add(new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)); scene.add(s); return s; }));
    try { renderer.compile(scene, camera); } catch (e) { }
    setTimeout(() => warm.forEach(s => { scene.remove(s); s.material.dispose(); }), 800);
    clock.getDelta(); requestAnimationFrame(tick);
  };

  W.bindFullscreen = btn => btn && btn.addEventListener('click', () => {
    if (document.fullscreenElement || stage.classList.contains('pseudo-full')) { if (document.fullscreenElement) document.exitFullscreen(); stage.classList.remove('pseudo-full'); return; }
    if (stage.requestFullscreen) stage.requestFullscreen().catch(() => stage.classList.add('pseudo-full')); else stage.classList.add('pseudo-full');
  });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') stage.classList.remove('pseudo-full'); });
  W.orient = (mesh, a, b) => { const d = new THREE.Vector3().subVectors(b, a), L = d.length(); mesh.position.copy(a).addScaledVector(d, .5); mesh.scale.set(1, L, 1); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); };
  return W;
}

/* ---------- ok (kalın, her zaman görünür) ---------- */
export class Arrow {
  constructor(scene, color, { glow = 1.6, depthTest = false } = {}) {
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(glow), depthTest, transparent: true, opacity: .96, toneMapped: false });
    this.g = new THREE.Group(); this.shaft = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 14).translate(0, .5, 0), m); this.head = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 20).translate(0, .5, 0), m);
    this.g.add(this.shaft, this.head); [this.g, this.shaft, this.head].forEach(o => o.renderOrder = 20); this.g.visible = false; scene.add(this.g); this.mat = m;
  }
  set(from, vec, thick) {
    const L = vec.length(); if (L < 1e-5) { this.g.visible = false; return; } this.g.visible = true;
    const hl = Math.min(L * .4, thick * 5), sl = L - hl;
    this.g.position.copy(from); this.g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec.clone().normalize());
    this.shaft.scale.set(thick, sl, thick); this.head.position.y = sl; this.head.scale.set(thick * 2.6, hl, thick * 2.6);
  }
  hide() { this.g.visible = false; }
}

/* ---------- dünya koordinatlı PBR yüzey (döşeme kırıcı) ---------- */
export function worldUVMaterial({ map, normalMap, roughnessMap, tile = 1, tint = '#ffffff', roughness = 1, metalness = 0, normalScale = 1, envMapIntensity = .8, axis = 'xz' }) {
  const m = new THREE.MeshStandardMaterial({ map, normalMap, roughnessMap, roughness, metalness, envMapIntensity, color: tint });
  m.normalScale.set(normalScale, normalScale);
  m.onBeforeCompile = sh => {
    sh.uniforms.uTile = { value: tile };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    for (const c of ['map_fragment', 'normal_fragment_maps', 'roughnessmap_fragment', 'metalnessmap_fragment']) sh.fragmentShader = sh.fragmentShader.replace(`#include <${c}>`, THREE.ShaderChunk[c]);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos; uniform float uTile;')
      .replace('void main() {', `void main() { vec2 wuv = vWPos.${axis} / uTile;`)
      .replace(/vMapUv/g, 'wuv').replace(/vNormalMapUv/g, 'wuv').replace(/vRoughnessMapUv/g, 'wuv');
  };
  return m;
}
