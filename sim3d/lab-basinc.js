// BFY · 3B Kaldırma Kuvveti Laboratuvarı
import { THREE, createWorld, Arrow, worldUVMaterial, canvasTex, $, clamp, lerp, smooth, fmt, DEG, rng, Noise, isMobile, reduceMotion } from './bfy3d-core.js?v=3';

/* =====================================================================
   Sabitler ve cisimler (SI birimleri: m, kg, s)
   ===================================================================== */
const TY = .76;                                   // masa üst yüzeyi
const TANK = { x: 0, z: 0, w: .40, d: .26, h: .32, glass: .006, base: .014 };
const IN = { w: TANK.w - 2 * TANK.glass, d: TANK.d - 2 * TANK.glass };
const FLOOR = TY + TANK.base;                      // küvet iç tabanı
const WATER_H = .22;                               // başlangıç su yüksekliği
const A_IN = IN.w * IN.d;
const P0 = { earth: 101325, moon: 0 };

const OBJS = [
  { id: 'cork',  name: 'Mantar tıpa',   short: 'Mantar', rho: 240,  shape: 'cyl', r: .021, h: .042, cd: 1.0, ic: 'radial-gradient(circle at 35% 30%,#e6c79a,#b88a52 60%,#7a5530)' },
  { id: 'duck',  name: 'Plastik ördek', short: 'Ördek',  rho: 150,  shape: 'ell', a: .042, c: .047, cd: .6, model: 'rubber_duck_toy', len: .10, ic: 'radial-gradient(circle at 35% 30%,#fff38a,#f2c230 55%,#c98d10)' },
  { id: 'wood',  name: 'Tahta küp',     short: 'Tahta',  rho: 600,  shape: 'box', s: .06, cd: 1.05, ic: 'linear-gradient(135deg,#d7a86a,#9a6a37)', sq: true },
  { id: 'apple', name: 'Elma',          short: 'Elma',   rho: 830,  shape: 'ell', a: .039, c: .034, cd: .5, model: 'food_apple_01', len: .078, ic: 'radial-gradient(circle at 35% 30%,#ff8a7a,#c8231a 60%,#6d0f0a)' },
  { id: 'ice',   name: 'Buz küpü',      short: 'Buz',    rho: 917,  shape: 'box', s: .05, cd: 1.05, ic: 'linear-gradient(135deg,#ffffff,#bfe3f6)', sq: true },
  { id: 'egg',   name: 'Yumurta',       short: 'Yumurta',rho: 1070, shape: 'ell', a: .0215, c: .0285, cd: .45, ic: 'radial-gradient(circle at 35% 30%,#fffaf0,#f0dcc0 60%,#c9a883)' },
  { id: 'al',    name: 'Alüminyum küp', short: 'Alüminyum', rho: 2700, shape: 'box', s: .04, cd: 1.05, ic: 'linear-gradient(135deg,#f2f4f6,#8e969e)', sq: true },
];
const LIQS = [
  { id: 'oil',  name: 'Zeytinyağı', rho: 920,  color: '#c9b64a', att: '#b4a126', dist: .35, ic: 'radial-gradient(circle at 35% 30%,#fff3a8,#c9b64a 60%,#7a6a12)' },
  { id: 'water',name: 'Su',         rho: 1000, color: '#dff4f4', att: '#7ccad0', dist: .75, ic: 'radial-gradient(circle at 35% 30%,#e8fbff,#7fcfe0 60%,#2d8aa8)' },
  { id: 'sea',  name: 'Deniz suyu', rho: 1030, color: '#d8f2ee', att: '#6cc6bf', dist: .9, ic: 'radial-gradient(circle at 35% 30%,#e0fff8,#5fc2b3 60%,#1f7d73)' },
  { id: 'brine',name: 'Doymuş tuzlu su', short: 'Tuzlu su', rho: 1200, color: '#eef7f5', att: '#a9d9d2', dist: .8, ic: 'radial-gradient(circle at 35% 30%,#ffffff,#bfe6df 60%,#6fb3a8)' },
];

for (const o of OBJS) {
  if (o.shape === 'box') { o.H = o.s; o.V = o.s ** 3; o.Aproj = o.s * o.s; }
  else if (o.shape === 'cyl') { o.H = o.h; o.V = Math.PI * o.r * o.r * o.h; o.Aproj = Math.PI * o.r * o.r; }
  else { o.H = 2 * o.c; o.V = 4 / 3 * Math.PI * o.a * o.a * o.c; o.Aproj = Math.PI * o.a * o.a; }
  o.m = o.rho * o.V;
}
// Yükseklik u'daki (tabandan) yatay kesit alanı ve batan hacim
const area = (o, u) => o.shape === 'box' ? o.s * o.s : o.shape === 'cyl' ? Math.PI * o.r * o.r : Math.max(0, Math.PI * o.a * o.a * (1 - ((u - o.c) / o.c) ** 2));
function vsub(o, d) {
  d = clamp(d, 0, o.H);
  if (o.shape === 'box') return o.s * o.s * d;
  if (o.shape === 'cyl') return Math.PI * o.r * o.r * d;
  return Math.PI * o.a * o.a * d * d * (3 * o.c - d) / (3 * o.c * o.c);
}
function buoyCentroid(o, d) { // batan kısmın ağırlık merkezinin tabandan yüksekliği
  d = clamp(d, 0, o.H); if (d <= 0) return 0;
  if (o.shape !== 'ell') return d / 2;
  let s = 0, m = 0; const n = 24; for (let i = 0; i < n; i++) { const u = (i + .5) * d / n, A = area(o, u); s += A * u; m += A; } return s / m;
}

const S = { mode: 'free', liq: LIQS[1], rho: 1000, moon: false, force: true, press: false, labels: true, slow: true, sel: 'egg', cam: 'orbit', dynH: .30 };
const g = () => S.moon ? 1.62 : 9.8;

/* =====================================================================
   Dünya
   ===================================================================== */
const stage = $('stage'), canvas = $('c3d');
const W = createWorld({ stage, canvas, fov: 32, near: .01, far: 400, shadowBox: 1.1, shadowFar: 8, bloom: [.18, .4, .97] });
const { scene, camera } = W;
W.sun.castShadow = false; W.sun.intensity = .8;
camera.position.set(.9, 1.25, 1.1);

// Zemin (laboratuvar fotoğrafına kenarlarda karışan döşeme)
const cT = { col: W.tex('tex/concrete_col.jpg'), nor: W.tex('tex/concrete_nor.jpg', false), arm: W.tex('tex/concrete_arm.jpg', false) };
const floorMat = worldUVMaterial({ map: cT.col, normalMap: cT.nor, roughnessMap: cT.arm, tile: 1.6, tint: '#6d8a86', roughness: 1, normalScale: .6, envMapIntensity: .5 });
floorMat.transparent = true;
{ const ob = floorMat.onBeforeCompile; floorMat.onBeforeCompile = sh => { ob(sh); sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.a *= 1.0 - smoothstep(1.8, 4.2, length(vWPos.xz - vec2(.2, 0.)));'); }; }
const floor = new THREE.Mesh(new THREE.CircleGeometry(4.5, 96).rotateX(-Math.PI / 2), floorMat); floor.receiveShadow = true; scene.add(floor);

// Masa
const tableGroup = new THREE.Group(); scene.add(tableGroup);
W.gltf('models/WoodenTable_01/WoodenTable_01.gltf').then(o => {
  o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  o.scale.set(1, TY / .549, 1.15); o.position.set(.22, 0, 0); tableGroup.add(o);
});

/* ---------- Cam küvet ---------- */
const glassMat = new THREE.MeshPhysicalMaterial({ color: '#f2fbf8', roughness: .04, metalness: 0, transparent: true, opacity: .16, envMapIntensity: 1.6, ior: 1.5, specularIntensity: 1, side: THREE.DoubleSide, depthWrite: false });
const edgeMat = new THREE.MeshPhysicalMaterial({ color: '#bfe3d7', roughness: .05, transparent: true, opacity: .55, envMapIntensity: 1.5 });
const trimMat = new THREE.MeshStandardMaterial({ color: '#16181a', roughness: .45, metalness: .2 });
const tank = new THREE.Group(); tank.position.set(TANK.x, TY, TANK.z); scene.add(tank);
{
  const { w, d, h, glass: t, base } = TANK;
  const panel = (sx, sy, sz, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), glassMat); m.position.set(x, y, z); m.renderOrder = 5; tank.add(m); return m; };
  // cam paneller çerçevenin içinde biter: üst yüzeyleri çerçeveyle çakışıp titreşmesin
  const gh = h - .004, gy = base + (gh - base) / 2, gH = gh - base;
  panel(w - .002, gH, t, 0, gy, d / 2 - t / 2); panel(w - .002, gH, t, 0, gy, -d / 2 + t / 2);
  panel(t, gH, d - 2 * t, w / 2 - t / 2, gy, 0); panel(t, gH, d - 2 * t, -w / 2 + t / 2, gy, 0);
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, base, d), new THREE.MeshPhysicalMaterial({ color: '#cfe9e0', roughness: .1, transparent: true, opacity: .5 })); bottom.position.y = base / 2; bottom.receiveShadow = true; tank.add(bottom);
  // Yeşilimsi cam kenarları (gerçek camın kalın kenarı)
  for (const [sx, sz, x, z] of [[t, t, w / 2 - t / 2, d / 2 - t / 2], [t, t, -w / 2 + t / 2, d / 2 - t / 2], [t, t, w / 2 - t / 2, -d / 2 + t / 2], [t, t, -w / 2 + t / 2, -d / 2 + t / 2]]) { const e = new THREE.Mesh(new THREE.BoxGeometry(sx * 1.2, gH, sz * 1.2), edgeMat); e.position.set(x - Math.sign(x) * .0006, gy, z - Math.sign(z) * .0006); tank.add(e); }
  // Siyah plastik çerçeve (üst ve alt)
  const trim = (y, hh) => { for (const [sx, sz, x, z] of [[w + .006, .0145, 0, d / 2], [w + .006, .0145, 0, -d / 2], [.0145, d - .0146, w / 2, 0], [.0145, d - .0146, -w / 2, 0]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, hh, sz), trimMat); m.position.set(x, y, z); m.castShadow = true; tank.add(m); } };
  trim(h - .0065, .014); trim(.008, .0165);
  // Cetvel çıkartması (ön camda, cm)
  const rt = canvasTex(64, 512, (g, W2, H2) => { g.clearRect(0, 0, W2, H2); g.fillStyle = 'rgba(255,255,255,.0)'; g.fillRect(0, 0, W2, H2);
    g.fillStyle = 'rgba(20,20,20,.9)'; g.font = '700 20px Arial'; for (let cm = 0; cm <= 30; cm++) { const y = H2 - (cm / 30) * H2 * .9375 - 8; const L = cm % 5 === 0 ? 30 : 16; g.fillRect(0, y, L, 2); if (cm % 5 === 0 && cm) g.fillText(cm, 34, y + 7); } });
  const ruler = new THREE.Mesh(new THREE.PlaneGeometry(.024, .32 * .96), new THREE.MeshBasicMaterial({ map: rt, transparent: true, depthWrite: false, toneMapped: true }));
  ruler.position.set(-w / 2 + .03, base + .32 * .48 - .002, d / 2 + .0015); tank.add(ruler);
}

/* ---------- Su ---------- */
const waterNor = (() => { const N = 256, c = document.createElement('canvas'); c.width = c.height = N; const gx = c.getContext('2d'), img = gx.createImageData(N, N);
  const h = (x, y) => { const u = x / N, v = y / N; const f = (a, b) => Noise.fbm(a * 5, b * 5, 4); return f(u, v) * (1 - u) * (1 - v) + f(u - 1, v) * u * (1 - v) + f(u, v - 1) * (1 - u) * v + f(u - 1, v - 1) * u * v; };
  const H = new Float32Array(N * N); for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) H[j * N + i] = h(i, j);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const dx = H[j * N + (i + 1) % N] - H[j * N + (i - 1 + N) % N], dy = H[((j + 1) % N) * N + i] - H[((j - 1 + N) % N) * N + i]; const k = (j * N + i) * 4; img.data[k] = 128 - dx * 180; img.data[k + 1] = 128 - dy * 180; img.data[k + 2] = 255; img.data[k + 3] = 255; }
  gx.putImageData(img, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; t.repeat.set(2.2, 1.4); return t; })();
const waterMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, roughness: .03, metalness: 0, ior: 1.333, thickness: .05, attenuationColor: new THREE.Color('#8fd3d6'), attenuationDistance: 1.2, normalMap: waterNor, normalScale: new THREE.Vector2(.1, .1), envMapIntensity: 1.4, specularIntensity: 1 });
// Menisküs: suyun camla buluştuğu parlak çizgi
const menMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#e8fbff').multiplyScalar(1.3), transparent: true, opacity: .55, depthWrite: false, toneMapped: false });
const meniscus = new THREE.Group(); scene.add(meniscus);
for (const [w2, d2, x2, z2] of [[IN.w, .0025, 0, IN.d / 2 - .001], [IN.w, .0025, 0, -IN.d / 2 + .001], [.0025, IN.d, IN.w / 2 - .001, 0], [.0025, IN.d, -IN.w / 2 + .001, 0]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(w2, .0022, d2), menMat); m.position.set(TANK.x + x2, 0, TANK.z + z2); m.renderOrder = 7; meniscus.add(m); }
const water = new THREE.Mesh(new THREE.BoxGeometry(IN.w - .001, 1, IN.d - .001).translate(0, .5, 0), waterMat); water.position.set(TANK.x, FLOOR, TANK.z); water.renderOrder = 2; scene.add(water);
// Kostik ışık desenleri (küvet tabanında)
const causticTex = (() => { const N = 384, c = document.createElement('canvas'); c.width = c.height = N; const gx = c.getContext('2d'), img = gx.createImageData(N, N); const R = rng(5), P = [];
  for (let i = 0; i < 28; i++) P.push([R() * N, R() * N]);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let f1 = 1e9, f2 = 1e9; for (const [px, py] of P) for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) { const dx = i - px - ox * N, dy = j - py - oy * N, dd = dx * dx + dy * dy; if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd; }
    const e = Math.sqrt(f2) - Math.sqrt(f1); const v = Math.exp(-e * .22) * 255; const k = (j * N + i) * 4; img.data[k] = img.data[k + 1] = img.data[k + 2] = v; img.data[k + 3] = 255; }
  gx.putImageData(img, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; return t; })();
const causticMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  uniforms: { t: { value: causticTex }, time: { value: 0 }, k: { value: .55 }, tint: { value: new THREE.Color('#bff4ff') } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `uniform sampler2D t; uniform float time, k; uniform vec3 tint; varying vec2 vUv;
    void main(){ vec2 u = vUv * vec2(2.4, 1.6); float a = texture2D(t, u + vec2(time * .021, time * .013)).r, b = texture2D(t, u * 1.37 + vec2(-time * .017, time * .024)).r;
      float c = pow(min(a, b), 1.6) * 2.2; float edge = smoothstep(0., .08, vUv.x) * smoothstep(1., .92, vUv.x) * smoothstep(0., .1, vUv.y) * smoothstep(1., .9, vUv.y);
      gl_FragColor = vec4(tint * c * k * edge, 1.); }` });
const caustics = new THREE.Mesh(new THREE.PlaneGeometry(IN.w, IN.d).rotateX(-Math.PI / 2), causticMat); caustics.position.set(TANK.x, FLOOR + .0015, TANK.z); caustics.renderOrder = 1; scene.add(caustics);

/* ---------- Işıklar ---------- */
const lamp = new THREE.SpotLight('#fff4e2', 7, 3.5, .5, .6, 1.4); lamp.position.set(.05, TY + 1.4, .35); lamp.target.position.set(0, TY, 0); lamp.castShadow = true;
lamp.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048); lamp.shadow.bias = -.0003; lamp.shadow.normalBias = .01; scene.add(lamp, lamp.target);

/* ---------- Süsler: kimya takımı ---------- */
W.gltf('models/chemistry_set/chemistry_set.gltf').then(o => {
  o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  o.scale.setScalar(.72); o.position.set(.66, TY, -.13); o.rotation.y = -.15; scene.add(o);
});

/* =====================================================================
   Cisimlerin 3B görünümleri
   ===================================================================== */
const woodTex = { col: W.tex('models/WoodenTable_01/textures/WoodenTable_01_diff_1k.jpg'), nor: W.tex('models/WoodenTable_01/textures/WoodenTable_01_nor_gl_1k.jpg', false) };
function makeMesh(o) {
  const g = new THREE.Group(); let mesh;
  if (o.id === 'wood') mesh = new THREE.Mesh(new THREE.BoxGeometry(o.s, o.s, o.s, 2, 2, 2), new THREE.MeshStandardMaterial({ map: woodTex.col, normalMap: woodTex.nor, roughness: .7, color: '#e8c89a' }));
  else if (o.id === 'ice') { const geo = new THREE.BoxGeometry(o.s, o.s, o.s, 6, 6, 6); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(p, i); const k = o.s / 2 * .9; v.set(clamp(v.x, -k, k), clamp(v.y, -k, k), clamp(v.z, -k, k)); const dv = new THREE.Vector3().fromBufferAttribute(p, i).sub(v); if (dv.length() > 0) v.add(dv.normalize().multiplyScalar(o.s * .05)); p.setXYZ(i, v.x, v.y, v.z); } geo.computeVertexNormals();
    mesh = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: '#f4fbff', roughness: .15, transmission: .9, thickness: .04, ior: 1.31, attenuationColor: new THREE.Color('#d7efff'), attenuationDistance: .15, normalMap: waterNor, normalScale: new THREE.Vector2(.3, .3) })); }
  else if (o.id === 'al') mesh = new THREE.Mesh(new THREE.BoxGeometry(o.s, o.s, o.s), new THREE.MeshStandardMaterial({ color: '#d7dbdf', metalness: 1, roughness: .28, normalMap: cT.nor, normalScale: new THREE.Vector2(.12, .12) }));
  else if (o.id === 'cork') { const tex = canvasTex(128, 128, (gx, w, h) => { gx.fillStyle = '#c69a62'; gx.fillRect(0, 0, w, h); const R = rng(7); for (let i = 0; i < 900; i++) { gx.fillStyle = ['#a8773f', '#dbb47f', '#8f6232', '#e3c08d'][i % 4]; gx.globalAlpha = .5; gx.beginPath(); gx.arc(R() * w, R() * h, .6 + R() * 1.8, 0, 7); gx.fill(); } });
    mesh = new THREE.Mesh(new THREE.CylinderGeometry(o.r, o.r * .93, o.h, 40), new THREE.MeshStandardMaterial({ map: tex, roughness: .95 })); }
  else if (o.id === 'egg') { const geo = new THREE.SphereGeometry(1, 48, 32); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); const k = 1 - .12 * y; p.setXYZ(i, p.getX(i) * o.a * k, y * o.c, p.getZ(i) * o.a * k); } geo.computeVertexNormals();
    mesh = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: '#f3e3cc', roughness: .55, sheen: .3, sheenColor: new THREE.Color('#fff4e6') })); }
  else { mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), new THREE.MeshStandardMaterial({ color: '#ccc' })); mesh.scale.set(o.a, o.c, o.a); }
  mesh.position.y = o.H / 2; mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh);
  if (o.model) W.gltf(`models/${o.model}/${o.model}.gltf`).then(src => {
    const m = src.clone(true); m.traverse(k => { if (k.isMesh) { k.castShadow = true; k.receiveShadow = true; } });
    const bb = new THREE.Box3().setFromObject(m), sz = new THREE.Vector3(); bb.getSize(sz); const sc = o.len / Math.max(sz.x, sz.z);
    m.scale.setScalar(sc); m.position.set(-(bb.min.x + bb.max.x) / 2 * sc, -bb.min.y * sc, -(bb.min.z + bb.max.z) / 2 * sc);
    const wrap = new THREE.Group(); wrap.add(m); if (o.id === 'duck') wrap.rotation.y = -.6;
    g.remove(mesh); g.add(wrap); o.pick = wrap;
  });
  o.pick = mesh; return g;
}
const items = OBJS.map((o, i) => {
  const g3 = makeMesh(o); scene.add(g3);
  const it = { o, g: g3, x: .28 + i * .092, z: .14, y: TY, v: 0, inTank: false, grab: false, hung: false, ds: 0, Fb: 0, T: 0, N: 0, splash: 0, rot: (i * 1.7) % 6.28 };
  if (o.id === 'duck') it.z = .18;
  return it;
});

/* =====================================================================
   Fizik
   ===================================================================== */
let waterY = FLOOR + WATER_H, slowT = 0;
const inside = (it, m = .004) => { const hw = (it.o.shape === 'box' ? it.o.s : 2 * (it.o.a || it.o.r)) / 2 + m; return Math.abs(it.x - TANK.x) < IN.w / 2 - hw && Math.abs(it.z - TANK.z) < IN.d / 2 - hw; };
function step(it, h) {
  const o = it.o, G = g(), rL = S.rho;
  if (it.grab) { it.v = 0; return; }
  const floorY = it.inTank ? FLOOR : TY;
  const d = it.inTank ? clamp(waterY - it.y, 0, o.H) : 0;
  const Vs = vsub(o, d), Fb = rL * G * Vs;
  if (it.hung) {
    // Dinamometreye asılı: ip gergin mi, gevşek mi?
    const hookY = dynHookY(), yT = hookY - DYN.string - o.H;
    const dT = clamp(waterY - yT, 0, o.H), FbT = rL * G * vsub(o, dT);
    let yEq = yT; if (FbT > o.m * G) { // yüzen cisim: ip gevşer, denge konumu
      let lo = yT, hi = waterY; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (rL * G * vsub(o, clamp(waterY - mid, 0, o.H)) > o.m * G) lo = mid; else hi = mid; } yEq = lo; }
    const want = Math.max(yT, yEq, FLOOR);
    it.v = (want - it.y) * 12; it.y += it.v * h;
    const dd = clamp(waterY - it.y, 0, o.H); it.ds = dd; it.Fb = rL * G * vsub(o, dd);
    const taut = it.y <= yT + .0015 && it.y > FLOOR + .0005;
    it.T = taut ? Math.max(0, o.m * G - it.Fb) : 0; it.N = (!taut && it.y <= FLOOR + .0005) ? Math.max(0, o.m * G - it.Fb) : 0; return;
  }
  const mEff = o.m + .5 * rL * Vs;
  let F = Fb - o.m * G;
  if (Vs > 0) {
    F -= .5 * rL * o.cd * o.Aproj * (Vs / o.V) * Math.abs(it.v) * it.v;               // su sürtünmesi
    const kW = rL * G * Math.max(area(o, d), 1e-6); F -= 2 * .2 * Math.sqrt(kW * o.m) * it.v; // yüzey dalgası sönümü
  }
  it.v += F / mEff * h; it.y += it.v * h;
  if (it.y < floorY) { it.y = floorY; it.v = it.v < -.25 ? -it.v * .12 : 0; }
  it.ds = clamp(waterY - it.y, 0, o.H) * (it.inTank ? 1 : 0); it.Fb = rL * G * vsub(o, it.ds);
  it.N = it.y <= floorY + 1e-4 ? Math.max(0, o.m * G - it.Fb) : 0; it.T = 0;
}

/* =====================================================================
   Dinamometre ve basınç ölçer
   ===================================================================== */
const DYN = { x: TANK.x + .02, z: TANK.z, string: .05, body: .17 };
const dynHookY = () => FLOOR + .16 + S.dynH * .85;   // S.dynH: 0..0.30 m
const stand = new THREE.Group(); scene.add(stand);
const chromeMat = new THREE.MeshStandardMaterial({ color: '#e3e6ea', metalness: 1, roughness: .14 });
const blackMat = new THREE.MeshStandardMaterial({ color: '#1b1c1e', metalness: .4, roughness: .5 });
{ const base = new THREE.Mesh(new THREE.BoxGeometry(.2, .018, .14), blackMat); base.position.set(-.33, TY + .009, -.2); base.castShadow = base.receiveShadow = true; stand.add(base);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .78, 20), chromeMat); rod.position.set(-.33, TY + .39, -.2); rod.castShadow = true; stand.add(rod); }
const arm = new THREE.Group(); stand.add(arm);
{ const L = Math.hypot(DYN.x + .33, DYN.z + .2); const bar = new THREE.Mesh(new THREE.CylinderGeometry(.005, .005, L + .02, 16).rotateZ(Math.PI / 2), chromeMat); bar.position.set((DYN.x - .33) / 2, 0, (DYN.z - .2) / 2); bar.rotation.y = -Math.atan2(DYN.z + .2, DYN.x + .33); arm.add(bar);
  const clampB = new THREE.Mesh(new THREE.BoxGeometry(.03, .03, .03), blackMat); clampB.position.set(-.33, 0, -.2); arm.add(clampB); }
const dyn = new THREE.Group(); scene.add(dyn);
const dynScale = canvasTex(128, 512, (gx, w, h) => { gx.fillStyle = '#f7f3e6'; gx.fillRect(0, 0, w, h); gx.fillStyle = '#111'; gx.font = '700 30px Arial'; gx.textAlign = 'left';
  for (let i = 0; i <= 40; i++) { const y = 30 + i * (h - 60) / 40; const L = i % 10 === 0 ? 48 : i % 5 === 0 ? 34 : 20; gx.fillRect(8, y - 1, L, 3); if (i % 10 === 0) gx.fillText((i / 20).toFixed(1).replace('.', ','), 66, y + 11); }
  gx.font = '800 26px Arial'; gx.fillText('N', 90, 22); });
{ const tube = new THREE.Mesh(new THREE.CylinderGeometry(.013, .013, DYN.body, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: .28, roughness: .05, envMapIntensity: 1.4, side: THREE.DoubleSide, depthWrite: false })); tube.position.y = -DYN.body / 2; dyn.add(tube);
  const scale = new THREE.Mesh(new THREE.PlaneGeometry(.018, DYN.body * .95), new THREE.MeshStandardMaterial({ map: dynScale, roughness: .6 })); scale.position.set(0, -DYN.body / 2, -.0035); dyn.add(scale);
  const capT = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .012, 32), blackMat); capT.position.y = -.004; dyn.add(capT);
  const capB = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .01, 32), blackMat); capB.position.y = -DYN.body; dyn.add(capB);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.007, .0015, 10, 24), chromeMat); ring.position.y = .01; dyn.add(ring); }
const dynPointer = new THREE.Mesh(new THREE.BoxGeometry(.024, .003, .018), new THREE.MeshStandardMaterial({ color: '#e0302a', roughness: .4, emissive: '#600' })); dyn.add(dynPointer);
const dynRod = new THREE.Mesh(new THREE.CylinderGeometry(.0018, .0018, 1, 10), chromeMat); dyn.add(dynRod);
const hook = new THREE.Mesh(new THREE.TorusGeometry(.006, .0014, 8, 20, Math.PI * 1.5), chromeMat); dyn.add(hook);
const stringMesh = new THREE.Mesh(new THREE.CylinderGeometry(.0007, .0007, 1, 6), new THREE.MeshStandardMaterial({ color: '#ddd6c6', roughness: .9 })); scene.add(stringMesh);
const spring = (() => { const pts = []; for (let i = 0; i <= 240; i++) { const t = i / 240; pts.push(new THREE.Vector3(Math.cos(t * 44) * .008, -t, Math.sin(t * 44) * .008)); }
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 480, .0011, 6), chromeMat); dyn.add(m); return m; })();
function layoutDyn(T) {
  const on = S.mode === 'dyn'; dyn.visible = on; arm.visible = on; stand.visible = on; stringMesh.visible = on;
  if (!on) return;
  const hy = dynHookY() + DYN.body + .02; dyn.position.set(DYN.x, hy, DYN.z); arm.position.y = hy + .012;
  const ext = clamp(T / 2, 0, 1) * (DYN.body * .8);   // 0-2 N ölçek, gövde içinde
  const pY = -.03 - ext; dynPointer.position.y = pY;
  spring.scale.y = (.026 + ext) ; spring.position.y = -.004;
  W.orient(dynRod, new THREE.Vector3(0, pY, 0), new THREE.Vector3(0, -DYN.body - .012, 0));
  hook.position.set(0, -DYN.body - .018, 0); hook.rotation.z = Math.PI * .25;
}
// Basınç ölçer: sonda + dijital gösterge
const probe = new THREE.Group(); scene.add(probe);
{ const rod = new THREE.Mesh(new THREE.CylinderGeometry(.003, .003, .3, 12).translate(0, .15, 0), chromeMat); probe.add(rod);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(.011, .011, .01, 32).rotateZ(Math.PI / 2), blackMat); probe.add(head);
  const mem = new THREE.Mesh(new THREE.CircleGeometry(.009, 32).rotateY(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#d33', roughness: .5 })); mem.position.x = .0052; probe.add(mem); }
const meterTexC = document.createElement('canvas'); meterTexC.width = 256; meterTexC.height = 128; const meterTex = new THREE.CanvasTexture(meterTexC); meterTex.colorSpace = THREE.SRGBColorSpace;
const meter = new THREE.Group(); scene.add(meter);
{ const box = new THREE.Mesh(new THREE.BoxGeometry(.13, .075, .05), [blackMat, blackMat, blackMat, blackMat, new THREE.MeshBasicMaterial({ map: meterTex, toneMapped: false }), blackMat]); box.position.y = .038; box.castShadow = true; meter.add(box);
  meter.position.set(-.3, TY, .12); meter.rotation.y = .5; }
const hose = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(.1, .1, .1), new THREE.Vector3(.2, 0, 0)]), 40, .0025, 8), new THREE.MeshStandardMaterial({ color: '#222', roughness: .7 })); scene.add(hose);
const P = { x: TANK.x - .08, y: FLOOR + .1, z: TANK.z + .03 };
function drawMeter(pk, hcm) { const g2 = meterTexC.getContext('2d'); g2.fillStyle = '#0c1a12'; g2.fillRect(0, 0, 256, 128); g2.fillStyle = '#6dff9c'; g2.font = '700 58px ui-monospace,Menlo,monospace'; g2.textAlign = 'right'; g2.fillText(fmt(pk, 2), 200, 72); g2.font = '700 24px Arial'; g2.fillText('kPa', 246, 72); g2.fillStyle = '#9fd9b3'; g2.font = '600 20px Arial'; g2.textAlign = 'left'; g2.fillText('Derinlik ' + fmt(hcm, 1) + ' cm', 14, 110); meterTex.needsUpdate = true; }
function layoutProbe() {
  const on = S.mode === 'probe'; probe.visible = on; meter.visible = on; hose.visible = on; if (!on) return;
  P.x = clamp(P.x, TANK.x - IN.w / 2 + .02, TANK.x + IN.w / 2 - .02); P.y = clamp(P.y, FLOOR + .012, waterY + .08);
  probe.position.set(P.x, P.y, P.z);
  const a = new THREE.Vector3(P.x, P.y + .3, P.z), b = new THREE.Vector3(-.3 + .06, TY + .04, .12 + .03);
  hose.geometry.dispose(); hose.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, a.clone().add(new THREE.Vector3(-.04, .08, .02)), new THREE.Vector3((a.x + b.x) / 2 - .05, TY + .34, .2), b.clone().add(new THREE.Vector3(0, .06, .02)), b]), 60, .0028, 8);
  const depth = Math.max(0, waterY - P.y); const pk = S.rho * g() * depth / 1000; drawMeter(pk, depth * 100);
  return { depth, pk };
}

/* =====================================================================
   Oklar, halkalar, kabarcıklar
   ===================================================================== */
const arW = new Arrow(scene, '#ff4a3d'), arF = new Arrow(scene, '#3d8bff'), arT = new Arrow(scene, '#ffc93a'), arN = new Arrow(scene, '#4ad16a');
const pArrows = Array.from({ length: 7 }, () => new Arrow(scene, '#58a6ff', { glow: 1.3 }));
const ringTex = canvasTex(128, 128, gx => { const gr = gx.createRadialGradient(64, 64, 40, 64, 64, 62); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.6, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128); });
const rings = [];
function ripple(x, z, amp) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, depthWrite: false, opacity: .5 * amp, color: '#ffffff' }));
  m.position.set(x, waterY + .0015, z); m.renderOrder = 6; scene.add(m); rings.push({ m, t: 0, amp });
}
function splash(it, speed) {
  const n = Math.min(40, Math.round(speed * 26));
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, s = (.3 + Math.random() * .8) * speed * .7;
    W.puff(new THREE.Vector3(it.x + Math.cos(a) * .02, waterY + .005, it.z + Math.sin(a) * .02), new THREE.Vector3(Math.cos(a) * s * .5, s * (1 + Math.random()), Math.sin(a) * s * .5), { tex: W.dropTex, color: '#e8f6ff', size: .006 + Math.random() * .007, grow: 0, life: .9, grav: 9.8, drag: .2, op: .9, floor: waterY }); }
  for (let k = 0; k < 3; k++) setTimeout(() => ripple(it.x, it.z, clamp(speed, .3, 1.3)), k * 140);
  for (let i = 0; i < Math.min(26, n); i++) W.puff(new THREE.Vector3(it.x + (Math.random() - .5) * .04, waterY - .02 - Math.random() * .05, it.z + (Math.random() - .5) * .03), new THREE.Vector3((Math.random() - .5) * .02, .08 + Math.random() * .1, 0), { tex: W.dropTex, color: '#ffffff', size: .003 + Math.random() * .004, grow: .2, life: 1.2 + Math.random(), grav: -.05, drag: .5, op: .7 });
  if (S.slow && !reduceMotion) slowT = .8;
}

/* =====================================================================
   Etkileşim: cisim tut-sürükle, sonda sürükle
   ===================================================================== */
let grabbed = null, grabPlane = new THREE.Plane(), grabOff = new THREE.Vector3();
function pickTargets() { const L = items.map(it => it.g); if (S.mode === 'probe') L.push(probe); return L; }
W.pointerHook = (type, e) => {
  if (type === 'down') {
    const rc = W.ray(e); const hits = rc.intersectObjects(pickTargets(), true);
    if (!hits.length) return false;
    let obj = hits[0].object; while (obj.parent && !pickTargets().includes(obj)) obj = obj.parent;
    const n = new THREE.Vector3(); camera.getWorldDirection(n); n.y = 0; n.normalize();
    grabPlane.setFromNormalAndCoplanarPoint(n, hits[0].point);
    if (obj === probe) { grabbed = { probe: true }; grabOff.set(P.x, P.y, P.z).sub(hits[0].point); }
    else { const it = items.find(i => i.g === obj); if (it.hung) return true; grabbed = { it }; it.grab = true; grabOff.set(it.x, it.y, it.z).sub(hits[0].point); select(it.o.id); }
    W.orbit.auto = 0; $('aimhint').style.display = 'none'; return true;
  }
  if (type === 'move' && grabbed) {
    const p = new THREE.Vector3(); if (!W.ray(e).ray.intersectPlane(grabPlane, p)) return;
    p.add(grabOff);
    if (grabbed.probe) { P.x = p.x; P.y = p.y; return; }
    const it = grabbed.it; it.x = clamp(p.x, -.62, 1.0); it.z = clamp(p.z, -.26, .3); it.y = Math.max(p.y, TY);
    if (inside(it, 0) && it.y < TY + TANK.h + .02 && !it.inTank) it.y = Math.max(it.y, TY + TANK.h + .01); // cam duvarın içinden geçmesin
    it.inTank = inside(it) && it.y > FLOOR - .001; if (!inside(it)) it.inTank = false;
  }
  if (type === 'up' && grabbed) {
    if (grabbed.it) { const it = grabbed.it; it.grab = false; it.v = 0; it.inTank = inside(it); if (it.inTank) it.y = Math.max(it.y, FLOOR); else it.y = Math.max(TY, it.y); }
    grabbed = null;
  }
};

/* =====================================================================
   Arayüz
   ===================================================================== */
const toastEl = $('toast'); let toastT = 0; const toast = m => { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 3000); };
const cardsObj = $('cards-obj');
OBJS.forEach(o => { const b = document.createElement('button'); b.className = 'a3c'; b.dataset.o = o.id; b.innerHTML = `<span class="ic${o.sq ? ' sq' : ''}" style="background:${o.ic}"></span>${o.short}<small>${fmt(o.rho / 1000, 2)} g/cm³</small>`; b.onclick = () => { select(o.id); dropSelected(); }; cardsObj.appendChild(b); });
const cardsLiq = $('cards-liq');
LIQS.forEach(l => { const b = document.createElement('button'); b.className = 'a3c'; b.dataset.l = l.id; b.innerHTML = `<span class="ic" style="background:${l.ic}"></span>${l.short || l.name}<small>${fmt(l.rho / 1000, 2)}</small>`; b.onclick = () => setLiquid(l); cardsLiq.appendChild(b); });
function select(id) { S.sel = id; cardsObj.querySelectorAll('.a3c').forEach(b => b.classList.toggle('on', b.dataset.o === id)); if (S.mode === 'dyn') hangSelected(); }
function setLiquid(l, keepRho) {
  S.liq = l; if (!keepRho) S.rho = l.rho; cardsLiq.querySelectorAll('.a3c').forEach(b => b.classList.toggle('on', b.dataset.l === l.id));
  $('i-rho').value = S.rho / 1000; applyLiquidLook();
}
function applyLiquidLook() {
  // Özkütle arttıkça (tuz) biraz daha bulanık-yeşil, yağ sarı
  const base = S.liq; waterMat.attenuationColor.set(base.att); waterMat.attenuationDistance = base.dist; waterMat.ior = base.id === 'oil' ? 1.47 : 1.333 + (S.rho - 1000) / 1000 * .06;
  causticMat.uniforms.tint.value.set(base.id === 'oil' ? '#fff0a8' : '#bff4ff');
  $('o-rho').textContent = fmt(S.rho / 1000, 3).replace(/0$/, '') + ' g/cm³';
  $('h-liq').innerHTML = `${base.name}<small>ρ = ${fmt(S.rho / 1000, 3).replace(/0$/, '')} g/cm³${S.moon ? ' · Ay' : ''}</small>`;
}
$('i-rho').addEventListener('input', e => { S.rho = Math.round(+e.target.value * 1000); const look = S.rho < 960 ? LIQS[0] : LIQS.filter(l => l.id !== 'oil').reduce((x, y) => Math.abs(y.rho - S.rho) < Math.abs(x.rho - S.rho) ? y : x); setLiquid(look, true); });
$('i-moon').addEventListener('change', e => { S.moon = e.target.checked; applyLiquidLook(); toast(S.moon ? "Ay'da g küçük: ağırlık da kaldırma kuvveti de 6 kat azalır. Kim yüzüyorsa yine yüzer!" : 'Dünya: g = 9,8 m/s²'); });
function dropSelected() {
  const it = items.find(i => i.o.id === S.sel); if (S.mode === 'dyn') { hangSelected(); return; }
  if (it.inTank && Math.abs(it.v) < .02) { // küvetteyse dışarı al ve yeniden bırak
  }
  const SLOTS = [[-.135, -.05], [-.045, .05], [.045, -.05], [.135, .05], [-.135, .055], [-.045, -.055], [.045, .055], [.135, -.055]];
  const busy = items.filter(i => i !== it && (i.inTank || flights.some(f => f.it === i))).map(i => { const f = flights.find(q => q.it === i); return f ? [f.to.x, f.to.z] : [i.x, i.z]; });
  let bestS = SLOTS[0], bd = -1; for (const sl of SLOTS) { const dmin = busy.length ? Math.min(...busy.map(q => Math.hypot(q[0] - sl[0] - TANK.x, q[1] - sl[1] - TANK.z))) : 1; if (dmin > bd + 1e-6) { bd = dmin; bestS = sl; } }
  flyTo(it, TANK.x + bestS[0], TANK.z + bestS[1], waterY + .09);
}
const flights = [];
function flyTo(it, x, z, y) { it.grab = true; flights.push({ it, t: 0, from: new THREE.Vector3(it.x, it.y, it.z), to: new THREE.Vector3(x, y, z) }); }
$('btn-drop').onclick = dropSelected;
$('btn-all').onclick = () => { if (S.mode !== 'free') setMode('free'); let k = 0; items.forEach((it, i) => { if (!it.inTank) setTimeout(() => { S.sel = it.o.id; dropSelected(); }, k++ * 420); }); };
$('btn-clear').onclick = () => { items.forEach((it, i) => { it.inTank = false; it.hung = false; it.grab = false; it.v = 0; it.x = .28 + i * .092; it.z = it.o.id === 'duck' ? .18 : .14; it.y = TY; }); flights.length = 0; if (S.mode === 'dyn') hangSelected(); };
const modes = $('modes');
function setMode(m) { S.mode = m; modes.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.m === m)); $('dyn-ctrl').style.display = m === 'dyn' ? '' : 'none'; $('dynread').style.display = m === 'dyn' ? 'block' : 'none';
  items.forEach(it => { if (it.hung) { it.hung = false; it.inTank = inside(it); } });
  if (m === 'dyn') { if (!['al', 'egg', 'wood', 'apple', 'ice', 'cork', 'duck'].includes(S.sel)) S.sel = 'al'; hangSelected(); toast('Dinamometreyi aşağı indir: cisim suya girdikçe okunan değer azalır. Aradaki fark kaldırma kuvvetidir.'); }
  if (m === 'probe') toast('Sondayı tutup aşağı-yukarı sürükle. Basınç yalnızca derinliğe bağlıdır.');
  $('obj-hint').textContent = m === 'dyn' ? 'Dinamometreye asılacak cismi seç.' : 'Birine dokun: seçilir ve küvete bırakılır.';
}
modes.querySelectorAll('button').forEach(b => b.onclick = () => setMode(b.dataset.m));
function hangSelected() { items.forEach(it => { if (it.hung) { it.hung = false; it.inTank = inside(it); it.v = 0; } }); const it = items.find(i => i.o.id === S.sel); flights.splice(0, flights.length, ...flights.filter(f => f.it !== it)); it.grab = false; it.hung = true; it.inTank = true; it.x = DYN.x; it.z = DYN.z; it.y = dynHookY() - DYN.string - it.o.H; it.v = 0; }
$('i-dyn').addEventListener('input', e => { S.dynH = +e.target.value / 100; $('o-dyn').textContent = fmt(+e.target.value, 0) + ' cm'; });
const tgl = (id, key) => $(id).addEventListener('click', e => { S[key] = !S[key]; e.currentTarget.classList.toggle('on', S[key]); });
tgl('tg-force', 'force'); tgl('tg-press', 'press'); tgl('tg-labels', 'labels'); tgl('tg-slow', 'slow');
const segCam = $('seg-cam'); segCam.querySelectorAll('button').forEach(b => b.onclick = () => { segCam.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); S.cam = b.dataset.cam; setCam(); });
function setCam() { const o = W.orbit; o.auto = 0;
  if (S.cam === 'side') { o.target.set(TANK.x, waterY - .03, TANK.z); o.r = .72; o.th = 0; o.ph = Math.PI / 2 - .02; }
  else if (S.cam === 'top') { o.target.set(TANK.x, FLOOR + .1, TANK.z); o.r = .95; o.th = .2; o.ph = .45; }
  else { o.target.set(TANK.x + .06, FLOOR + .11, TANK.z); o.r = 1.05; o.th = .5; o.ph = 1.18; } }
W.bindFullscreen($('btn-full'));

function stateOf(it) {
  const o = it.o; if (!it.inTank || it.ds <= 0) return ['Havada', 'hava'];
  if (it.hung) return it.T > 1e-4 ? (it.ds >= o.H - 1e-4 ? ['Asılı · tamamen suda', 'ask'] : ['Asılı · kısmen suda', 'ask']) : ['Yüzüyor (ip gevşek)', 'yuz'];
  const r = o.rho / S.rho;
  if (Math.abs(r - 1) < .004) return ['Askıda', 'ask'];
  if (r < 1) return ['Yüzüyor', 'yuz'];
  return ['Batıyor', 'bat'];
}
function updateTable(it) {
  const o = it.o, G = g(), pct = it.ds / o.H * 100, vsPct = vsub(o, it.ds) / o.V * 100; const [st, cls] = stateOf(it);
  $('vals').innerHTML = `<tr><td>${o.name}</td><td><span class="state ${cls}">${st}</span></td></tr>
    <tr><td>Kütle m</td><td>${fmt(o.m * 1000, 0)} g</td></tr><tr><td>Hacim V</td><td>${fmt(o.V * 1e6, 0)} cm³</td></tr>
    <tr><td>Özkütle d<sub>cisim</sub></td><td>${fmt(o.rho / 1000, 2)} g/cm³</td></tr>
    <tr><td>Ağırlık G = m·g</td><td>${fmt(o.m * G, 3)} N</td></tr>
    <tr><td>Kaldırma F<sub>k</sub> = V<sub>b</sub>·d·g</td><td>${fmt(it.Fb, 3)} N</td></tr>
    <tr><td>Batan hacim oranı</td><td>%${fmt(vsPct, 0)}</td></tr>
    ${S.mode === 'dyn' && it.hung ? `<tr><td>Dinamometre T = G − F<sub>k</sub></td><td>${fmt(it.T, 3)} N</td></tr>` : ''}
    ${it.N > 1e-4 && !it.hung ? `<tr><td>Tabanın tepkisi N</td><td>${fmt(it.N, 3)} N</td></tr>` : ''}
    <tr><td>Su seviyesi</td><td>${fmt((waterY - FLOOR) * 100, 2)} cm</td></tr>`;
  $('h-obj').textContent = o.short; $('h-state').textContent = st; $('h-sub').textContent = '%' + fmt(vsPct, 0);
}

/* =====================================================================
   Döngü
   ===================================================================== */
let time = 0, lastTable = 0;
const tmp = new THREE.Vector3();
W.update = dt => {
  const scale = slowT > 0 ? .3 : 1; slowT = Math.max(0, slowT - dt);
  const h = dt * scale; time += dt;
  // uçuşlar (kart ile bırakma)
  for (let i = flights.length - 1; i >= 0; i--) { const f = flights[i]; f.t += dt / .55; const k = smooth(0, 1, Math.min(1, f.t)), it = f.it;
    it.x = lerp(f.from.x, f.to.x, k); it.z = lerp(f.from.z, f.to.z, k); it.y = lerp(f.from.y, f.to.y, k) + Math.sin(k * Math.PI) * .12;
    if (f.t >= 1) { it.grab = false; it.inTank = true; it.v = 0; flights.splice(i, 1); } }
  // su seviyesi = başlangıç + batan hacimler / taban alanı
  let Vt = 0; items.forEach(it => { if (it.inTank) Vt += vsub(it.o, clamp(waterY - it.y, 0, it.o.H)); });
  waterY = FLOOR + WATER_H + Vt / A_IN;
  // fizik alt adımları
  const n = Math.max(1, Math.ceil(h / .0015)), hh = h / n;
  items.forEach(it => { const before = it.y - waterY; for (let k = 0; k < n; k++) step(it, hh); const after = it.y - waterY;
    if (it.inTank && before > -.001 && after <= -.001 && it.v < -.25) splash(it, -it.v); });
  // yerleşim
  items.forEach(it => { it.g.position.set(it.x, it.y, it.z); it.g.rotation.y = it.rot; });
  water.scale.y = waterY - FLOOR; meniscus.position.y = waterY;
  waterNor.offset.x = time * .012; waterNor.offset.y = time * .008;
  causticMat.uniforms.time.value = time; causticMat.uniforms.k.value = .55 * (S.liq.id === 'oil' ? .6 : 1);
  for (let i = rings.length - 1; i >= 0; i--) { const r = rings[i]; r.t += dt; const s = .02 + r.t * .22; r.m.scale.set(s, 1, s); r.m.position.y = waterY + .0015; r.m.material.opacity = .45 * r.amp * (1 - r.t / 1.1);
    if (r.t > 1.1) { scene.remove(r.m); r.m.geometry.dispose(); r.m.material.dispose(); rings.splice(i, 1); } }
  // dinamometre ve sonda
  const hungIt = items.find(i => i.hung);
  layoutDyn(hungIt ? hungIt.T : 0);
  if (hungIt) { const top = new THREE.Vector3(DYN.x, dynHookY() + .002, DYN.z), bot = new THREE.Vector3(hungIt.x, hungIt.y + hungIt.o.H, hungIt.z); W.orient(stringMesh, bot, top);
    $('dyn-val').textContent = fmt(hungIt.T, 2) + ' N'; $('dyn-sub').textContent = `Havada: ${fmt(hungIt.o.m * g(), 2)} N · Kaldırma: ${fmt(hungIt.Fb, 2)} N`; }
  const pr = layoutProbe();
  // kamera
  W.updateOrbit(dt, 5);
  // kuvvet okları
  const sel = items.find(i => i.o.id === S.sel); const SC = .045; // m / N
  const tags = { w: $('tag-w'), f: $('tag-f'), t: $('tag-t'), p: $('tag-p') };
  if (S.force && sel && (sel.inTank || sel.y > TY + .001 || sel.grab)) {
    const o = sel.o, G = g(), c = new THREE.Vector3(sel.x, sel.y + o.H / 2, sel.z), th = .0032;
    const Wv = new THREE.Vector3(0, -o.m * G * SC, 0); arW.set(c.clone().add(new THREE.Vector3(-.006, 0, .03)), Wv, th);
    if (sel.Fb > 1e-4) { const cb = new THREE.Vector3(sel.x + .006, sel.y + buoyCentroid(o, sel.ds), sel.z + .03); arF.set(cb, new THREE.Vector3(0, sel.Fb * SC, 0), th); } else arF.hide();
    if (sel.T > 1e-4) arT.set(new THREE.Vector3(sel.x, sel.y + o.H, sel.z + .03), new THREE.Vector3(0, sel.T * SC, 0), th * .9); else arT.hide();
    if (sel.N > 1e-4) arN.set(new THREE.Vector3(sel.x + .012, (sel.inTank ? FLOOR : TY) + .001, sel.z + .03), new THREE.Vector3(0, sel.N * SC, 0), th * .9); else arN.hide();
    if (S.labels) {
      W.tag(tags.w, c.clone().add(Wv).add(new THREE.Vector3(-.006, -.012, .03)), `G = ${fmt(o.m * G, 2)} N`);
      if (sel.Fb > 1e-4) W.tag(tags.f, new THREE.Vector3(sel.x + .006, sel.y + buoyCentroid(o, sel.ds) + sel.Fb * SC + .018, sel.z + .03), `F<sub>k</sub> = ${fmt(sel.Fb, 2)} N`); else tags.f.style.display = 'none';
      if (sel.T > 1e-4) W.tag(tags.t, new THREE.Vector3(sel.x + .03, sel.y + o.H + .02, sel.z + .03), `T = ${fmt(sel.T, 2)} N`); else tags.t.style.display = 'none';
    } else { tags.w.style.display = tags.f.style.display = tags.t.style.display = 'none'; }
  } else { arW.hide(); arF.hide(); arT.hide(); arN.hide(); tags.w.style.display = tags.f.style.display = tags.t.style.display = 'none'; }
  if (pr && S.labels) W.tag(tags.p, new THREE.Vector3(P.x, P.y + .03, P.z), `P = d·g·h = ${fmt(pr.pk, 2)} kPa`); else tags.p.style.display = 'none';
  // basınç okları (sol cam duvara)
  pArrows.forEach((a, i) => { const dep = (i + .5) / pArrows.length * (waterY - FLOOR - .01); if (!S.press) { a.hide(); return; } const pk = S.rho * g() * dep;
    const L = pk / (1000 * 9.8 * .25) * .09; a.set(new THREE.Vector3(TANK.x - IN.w / 2 + .012 + L, waterY - dep, TANK.z + .02), new THREE.Vector3(-L, 0, 0), .0022); });
  if (time - lastTable > .12 && sel) { lastTable = time; updateTable(sel); }
};

/* =====================================================================
   Başlat
   ===================================================================== */
W.orbit.minR = .25; W.orbit.maxR = 3; W.orbit.minPh = .25;
setLiquid(LIQS[1]); select('egg'); setCam();
W.orbit.th = 1.4; W.orbit.r = 1.6; W.orbit.ph = 1.05; camera.position.copy(W.orbitPos()); W.orbit.look.copy(W.orbit.target);
setTimeout(() => { setCam(); W.orbit.auto = 0; }, 200);
W.loadEnv('lab').then(() => { W.start(); });
window.__bfyLab = { W, S, items, OBJS, vsub, setMode, select, dropSelected, get waterY() { return waterY; }, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) W.update(1 / 60); } };
