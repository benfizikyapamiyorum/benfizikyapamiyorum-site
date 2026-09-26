// BFY · 3B Vektör Laboratuvarı — akıntılı nehirde motorlu kayık, bileşke hız
import { THREE, createWorld, worldUVMaterial, canvasTex, Arrow, $, clamp, lerp, fmt, DEG, rng, isMobile } from './bfy3d-core.js?v=3';

const Z0 = 10, Z1 = -10, D = Z0 - Z1;       // kalkış ve varış çizgileri (m)
const BANK = 13;                            // kıyı çizgisi |z|
const K = 2.4;                              // 1 m/s → 2,4 m ok
const S = { vk: 2.5, th: 0, va: 1.2, run: false, t: 0, x: 0, z: Z0, done: false, mode: 'tip', vec: true, comp: false, path: true, trail: true, cam: 'drone', speed: 1, sc: 'straight', mission: false };

/* ---------- dünya ---------- */
const stage = $('stage'), canvas = $('c3d');
const W = createWorld({ stage, canvas, fov: 38, near: .1, far: 4000, shadowBox: 26, shadowFar: 160, bloom: [.2, .4, 1.5] });
const { scene, camera } = W;

/* ---------- su ---------- */
function waveNormal(seed, N = 256, waves = 14, str = 2.2) {
  const R = rng(seed), W_ = []; for (let i = 0; i < waves; i++) { const kx = Math.round((R() - .5) * 14), ky = Math.round((R() - .5) * 14); if (!kx && !ky) { i--; continue; } W_.push([kx, ky, R() * 6.28, 1 / Math.hypot(kx, ky)]); }
  const hgt = new Float32Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let h = 0; for (const [kx, ky, p, a] of W_) h += a * Math.sin(2 * Math.PI * (kx * x + ky * y) / N + p); hgt[y * N + x] = h; }
  return canvasTex(N, N, (g) => { const d = g.createImageData(N, N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const hx = hgt[y * N + (x + 1) % N] - hgt[y * N + (x - 1 + N) % N], hy = hgt[((y + 1) % N) * N + x] - hgt[((y - 1 + N) % N) * N + x];
      let nx = -hx * str, ny = -hy * str, nz = 1; const l = Math.hypot(nx, ny, nz); const i = (y * N + x) * 4; d.data[i] = (nx / l * .5 + .5) * 255; d.data[i + 1] = (ny / l * .5 + .5) * 255; d.data[i + 2] = (nz / l * .5 + .5) * 255; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); }, { repeat: [1, 1], srgb: false });
}
const n1 = waveNormal(11), n2 = waveNormal(23, 256, 18, 1.4);
[n1, n2].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; });
const WS = 800; n1.repeat.set(WS / 7, WS / 7); n2.repeat.set(WS / 2.6, WS / 2.6);
const waterMat = new THREE.MeshPhysicalMaterial({ color: '#16403f', roughness: .22, metalness: 0, normalMap: n1, normalScale: new THREE.Vector2(.3, .3), clearcoat: .8, clearcoatRoughness: .16, clearcoatNormalMap: n2, clearcoatNormalScale: new THREE.Vector2(.18, .18), envMapIntensity: 1, ior: 1.33 });
waterMat.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <clearcoat_normal_fragment_maps>', '#include <clearcoat_normal_fragment_maps>\n { float fd = smoothstep(18.0, 90.0, length(vViewPosition)); normal = normalize(mix(normal, nonPerturbedNormal, fd * .85)); clearcoatNormal = normalize(mix(clearcoatNormal, nonPerturbedNormal, fd)); }'); };
const water = new THREE.Mesh(new THREE.PlaneGeometry(WS, WS).rotateX(-Math.PI / 2), waterMat); water.receiveShadow = true; scene.add(water);

/* ---------- kıyılar ---------- */
const gT = { col: W.tex('tex/grass_col.jpg'), nor: W.tex('tex/grass_nor.jpg', false), rough: W.tex('tex/grass_rough.jpg', false) };
const grassMat = worldUVMaterial({ map: gT.col, normalMap: gT.nor, roughnessMap: gT.rough, tile: 2.4, tint: '#a9b276', normalScale: 1.1, envMapIntensity: .5 });
grassMat.vertexColors = true;

const cbT = { col: W.tex('tex/grassy_cobblestone_col.jpg'), nor: W.tex('tex/grassy_cobblestone_nor.jpg', false), arm: W.tex('tex/grassy_cobblestone_arm.jpg', false) };
const cobMat = worldUVMaterial({ map: cbT.col, normalMap: cbT.nor, roughnessMap: cbT.arm, tile: 2.2, tint: '#bdbab2', normalScale: 1.3, envMapIntensity: .55 });
cobMat.vertexColors = true;
// geniş ölçekli renk oynaması (uzaktan düz görünmesin)
const MACRO = `
  float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ return .5 * vn(p) + .3 * vn(p * 2.3 + 7.1) + .2 * vn(p * 5.1 + 3.3); }`;
function macro(mat, key, a, b, sc) { const ob = mat.onBeforeCompile; mat.onBeforeCompile = sh => { ob(sh); sh.fragmentShader = sh.fragmentShader.replace('void main() {', MACRO + '\nvoid main() {')
    .replace('#include <color_fragment>', `
  { float n = fbm(vWPos.xz / ${sc.toFixed(1)}); float n2 = fbm(vWPos.xz / ${(sc * 3.7).toFixed(1)} + 11.); diffuseColor.rgb *= mix(vec3(${a}), vec3(${b}), clamp(n * .8 + n2 * .6 - .2, 0., 1.)); }
#include <color_fragment>`); }; mat.customProgramCacheKey = () => key; }
macro(grassMat, 'g-macro', '.55,.6,.42', '1.2,1.12,.85', 6.);
macro(cobMat, 'c-macro', '.6,.62,.6', '1.15,1.1,1.02', 3.);
function bank(profile, mat, wob = 0) { // profile: [[z,y,ıslak],...] artan z; x boyunca uzatılır
  const NX = 160, X0 = -320, X1 = 320, pos = [], col = [], idx = [];
  for (let i = 0; i <= NX; i++) { const x = X0 + (X1 - X0) * i / NX; profile.forEach(([z, y, wet]) => { const w = wet ? (Math.sin(x * .13) * .25 + Math.sin(x * .41 + 1) * .12) * wob : 0; pos.push(x, y, z + w); const k = wet ? .55 + .45 * clamp((y + .2) / .5, 0, 1) : 1; col.push(k * .96, k * .95, k * .93); }); }
  const M = profile.length; for (let i = 0; i < NX; i++) for (let j = 0; j < M - 1; j++) { const a = i * M + j, b = a + M; idx.push(a, a + 1, b, b, a + 1, b + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat); m.receiveShadow = true; scene.add(m); return m;
}
// yakın kıyı: taş kaplı şev + çimenlik
bank([[BANK - 3, -1.4, 1], [BANK - 1.2, -.55, 1], [BANK - .2, -.1, 1], [BANK + .9, .3, 0], [BANK + 2.3, .72, 0], [BANK + 2.6, .76, 0]], cobMat, 1);
bank([[BANK + 2.6, .76, 0], [BANK + 12, .85, 0], [BANK + 60, 1.0, 0], [BANK + 260, 1.4, 0]], grassMat);
// karşı kıyı: taş dalgakıran (arkasında göl)
bank([[-BANK - 11, -1.4, 1], [-BANK - 9.3, -.3, 1], [-BANK - 8.2, .3, 0], [-BANK - 6.6, .7, 0], [-BANK - 2.4, .7, 0], [-BANK - .9, .3, 0], [-BANK + .2, -.1, 1], [-BANK + 1.2, -.55, 1], [-BANK + 3, -1.4, 1]], cobMat, 1);
// dalgakıran fenerleri
{ const poleM = new THREE.MeshStandardMaterial({ color: '#2c3036', metalness: .7, roughness: .4 }); for (const x of [-26, -8, 12, 30]) { const g = new THREE.Group(); g.position.set(x, .7, -BANK - 4.5); const p = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, 4, 10), poleM); p.position.y = 2; p.castShadow = true; g.add(p);
  const hd = new THREE.Mesh(new THREE.CylinderGeometry(.22, .14, .35, 12), poleM); hd.position.y = 4.1; g.add(hd); const gl = new THREE.Mesh(new THREE.SphereGeometry(.13, 12, 8), new THREE.MeshStandardMaterial({ color: '#fff8e0', emissive: '#fff1c2', emissiveIntensity: .4 })); gl.position.y = 3.9; g.add(gl); scene.add(g); } }
// sazlar
{ const N = isMobile ? 500 : 1200, R = rng(5); const g = new THREE.ConeGeometry(.018, 1, 4, 1, true).translate(0, .5, 0);
  const m = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ color: '#8f9a4a', roughness: .8, side: THREE.DoubleSide }), N); const o = new THREE.Object3D(), c = new THREE.Color();
  for (let i = 0; i < N; i++) { const side = R() < .5 ? 1 : -1; const x = (R() - .5) * 140; const z = side > 0 ? BANK + .1 + R() * 1.4 : -BANK - .2 - R() * .8; o.position.set(x, side > 0 ? -.15 : -.1, z); if (side < 0 && R() < .6) continue; o.rotation.set((R() - .5) * .35, R() * 6, (R() - .5) * .35); o.scale.set(1, .7 + R() * 1.1, 1); o.updateMatrix(); m.setMatrixAt(i, o.matrix); c.setHSL(.16 + R() * .06, .45, .32 + R() * .18); m.setColorAt(i, c); }
  m.castShadow = true; scene.add(m); }

/* ---------- iskeleler ---------- */
W.gltf('models/pier/modular_wooden_pier.gltf').then(o => {
  o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } });
  const bb = new THREE.Box3().setFromObject(o); const cx = (bb.min.x + bb.max.x) / 2;
  for (const s of [1, -1]) { const p = s > 0 ? o : o.clone(); const holder = new THREE.Group(); holder.add(p);
    p.position.set(-cx + 2.3 * s, -1.75, -bb.min.z);          // suya bakan uç holder'ın z=0'ında
    holder.position.set(0, 0, s * (Z0 + .9)); holder.rotation.y = s > 0 ? 0 : Math.PI; scene.add(holder); }
});

/* ---------- kayık ---------- */
function hullTex() { return canvasTex(1024, 512, (g, w, h) => {
  for (let y = 0; y < h; y++) { const s = Math.abs(y / h * 2 - 1); g.fillStyle = s > .86 ? '#1f4e8c' : s > .8 ? '#f4f1e8' : s > .52 ? '#f1ede2' : s > .49 ? '#1a1a1a' : '#a8322a'; g.fillRect(0, y, w, 1); }
  const R = rng(4); for (let i = 1; i < 14; i++) { const y = i / 14 * h; g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(0, y, w, 1.5); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, y + 2, w, 1); }
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(60,40,20,${R() * .05})`; g.fillRect(R() * w, R() * h, 6 + R() * 40, 1); }
  g.save(); g.translate(w * .72, h * .66); g.scale(1, -1); g.fillStyle = '#1f4e8c'; g.font = '900 34px Arial'; g.fillText('BFY-1', 0, 0); g.restore();
  g.fillStyle = '#1f4e8c'; g.font = '900 34px Arial'; g.fillText('BFY-1', w * .72, h * .36); }); }
function woodTex() { return canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#9a6a3a'; g.fillRect(0, 0, w, h); const R = rng(8);
  for (let i = 0; i < 10; i++) { const y = i / 10 * h; g.fillStyle = `hsl(28,${40 + R() * 15}%,${30 + R() * 12}%)`; g.fillRect(0, y, w, h / 10 - 2); }
  for (let i = 0; i < 400; i++) { g.strokeStyle = `rgba(50,28,10,${R() * .2})`; g.beginPath(); const y = R() * h; g.moveTo(0, y); g.lineTo(w, y + (R() - .5) * 6); g.stroke(); } }); }
function makeBoat() {
  const grp = new THREE.Group(), L = 3.6, B = 1.35, Dp = .56, NU = 56, NS = 28;
  const hw = u => B / 2 * (0.72 + 0.28 * Math.sin(Math.PI * Math.min(1, u * 1.05))) * Math.pow(Math.max(0, 1 - Math.pow(u, 3.3)), .55);
  const sheer = u => .16 * Math.pow(u, 2.6) + .05 * Math.pow(1 - u, 3);
  const keel = u => -Dp * (1 - .5 * Math.pow(u, 2.4)) + .1 * Math.pow(1 - u, 5);
  const P = (u, s, inset = 0) => { const ph = s * Math.PI / 2, c = Math.cos(ph), si = Math.sin(ph); const w = Math.max(0, hw(u) - inset); const top = sheer(u), bot = keel(u) + inset;
    return [-L / 2 + u * L, top + (bot - top) * Math.pow(c, 1.5), w * Math.sign(si) * Math.pow(Math.abs(si), .7)]; };
  function surf(inset, flip, u0 = 0, u1 = 1) { const pos = [], uv = [], idx = [];
    for (let i = 0; i <= NU; i++) { const u = u0 + (u1 - u0) * i / NU; for (let j = 0; j <= NS; j++) { const s = -1 + 2 * j / NS; pos.push(...P(u, s, inset)); uv.push(u, j / NS); } }
    for (let i = 0; i < NU; i++) for (let j = 0; j < NS; j++) { const a = i * (NS + 1) + j, b = a + NS + 1; flip ? idx.push(a, a + 1, b, b, a + 1, b + 1) : idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; }
  const hullM = new THREE.MeshPhysicalMaterial({ map: hullTex(), roughness: .38, clearcoat: .7, clearcoatRoughness: .15, side: THREE.FrontSide });
  const woodM = new THREE.MeshStandardMaterial({ map: woodTex(), roughness: .55 });
  const outer = new THREE.Mesh(surf(0, false), hullM); outer.castShadow = true; grp.add(outer);
  const inner = new THREE.Mesh(surf(.04, true, .012, .975), woodM); inner.castShadow = false; grp.add(inner);
  // ayna kıç (transom)
  { const pts = []; for (let j = 0; j <= NS; j++) pts.push(P(0, -1 + 2 * j / NS)); const pos = [], idx = []; const cy = (pts[0][1] + pts[NS / 2][1]) / 2; pos.push(-L / 2, cy, 0); pts.forEach(p => pos.push(...p)); for (let j = 1; j <= NS; j++) idx.push(0, j + 1, j);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); const tm = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: '#e9e3d4', roughness: .5, side: THREE.DoubleSide })); grp.add(tm); }
  // küpeşte
  const rimM = new THREE.MeshStandardMaterial({ color: '#6b4524', roughness: .45 });
  for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; const p = P(u, s); pts.push(new THREE.Vector3(p[0], p[1] + .012, p[2])); } const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, .032, 8), rimM); t.castShadow = true; grp.add(t); }
  // oturaklar
  for (const u of [.3, .6]) { const w = hw(u) * 2 - .1; const b = new THREE.Mesh(new THREE.BoxGeometry(.24, .04, w), woodM); b.position.set(-L / 2 + u * L, sheer(u) - .2, 0); b.castShadow = true; grp.add(b); }
  // taban tahtası
  { const b = new THREE.Mesh(new THREE.BoxGeometry(L * .7, .03, .5), woodM); b.position.set(-.15, keel(.45) + .07, 0); grp.add(b); }
  // dıştan takma motor
  const mot = new THREE.Group(); mot.position.set(-L / 2 - .08, sheer(0) + .05, 0); grp.add(mot);
  const cowlM = new THREE.MeshPhysicalMaterial({ color: '#d8dadd', roughness: .3, clearcoat: 1, clearcoatRoughness: .1 }), blackM = new THREE.MeshStandardMaterial({ color: '#1b1c1f', roughness: .5, metalness: .3 });
  const cowl = new THREE.Mesh(new THREE.CapsuleGeometry(.14, .16, 6, 16).rotateZ(Math.PI / 2), cowlM); cowl.scale.set(1, 1.15, .85); cowl.position.set(-.12, .22, 0); cowl.castShadow = true; mot.add(cowl);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(.142, .142, .05, 24).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#c8412f', roughness: .4 })); band.scale.set(1.26, 1.15, 1); band.position.set(-.12, .12, 0); band.rotation.set(Math.PI / 2, 0, 0); mot.add(band);
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(.08, .75, .06), blackM); shaft.position.set(-.1, -.28, 0); shaft.castShadow = true; mot.add(shaft);
  const prop = new THREE.Group(); prop.position.set(-.17, -.62, 0); mot.add(prop);
  for (let i = 0; i < 3; i++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(.01, .12, .05), blackM); bl.position.y = .06; const p2 = new THREE.Group(); p2.rotation.x = i * 2.094; bl.rotation.y = .5; p2.add(bl); prop.add(p2); }
  const till = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .5, 10).rotateZ(Math.PI / 2 - .25), blackM); till.position.set(.2, .2, 0); mot.add(till);
  // bayrak
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .7, 8), rimM); pole.position.set(L / 2 - .25, sheer(.93) + .35, 0); grp.add(pole);
  const flagG = new THREE.PlaneGeometry(.38, .24, 12, 4).translate(.19, 0, 0); const flag = new THREE.Mesh(flagG, new THREE.MeshStandardMaterial({ map: canvasTex(128, 80, (g, w, h) => { g.fillStyle = '#e30a17'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.beginPath(); g.arc(w * .4, h / 2, h * .25, 0, 7); g.fill(); g.fillStyle = '#e30a17'; g.beginPath(); g.arc(w * .45, h / 2, h * .2, 0, 7); g.fill(); g.fillStyle = '#fff'; g.save(); g.translate(w * .62, h / 2); g.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 4 * Math.PI / 5; g.lineTo(Math.cos(a) * h * .11, Math.sin(a) * h * .11); } g.fill(); g.restore(); }), side: THREE.DoubleSide, roughness: .8 }));
  flag.position.set(L / 2 - .25, sheer(.93) + .6, 0); grp.add(flag);
  const root = new THREE.Group(); root.add(grp); grp.position.y = .3; scene.add(root);
  return { root, grp, prop, flag, flagG, flagP: flagG.attributes.position.array.slice(), L };
}
const boat = makeBoat();

/* ---------- köpük izi, sıçrama, yapraklar ---------- */
const foamTex = canvasTex(128, 128, g => { const R = rng(9); for (let i = 0; i < 220; i++) { const a = R() * 6.28, r = Math.sqrt(R()) * 52; const x = 64 + Math.cos(a) * r, y = 64 + Math.sin(a) * r; g.fillStyle = `rgba(255,255,255,${.15 + R() * .45 * (1 - r / 60)})`; g.beginPath(); g.arc(x, y, 1 + R() * 3.5, 0, 7); g.fill(); } });
const foamGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
const foams = Array.from({ length: 110 }, () => { const m = new THREE.Mesh(foamGeo, new THREE.MeshBasicMaterial({ map: foamTex, transparent: true, depthWrite: false, opacity: 0, color: new THREE.Color(1.1, 1.1, 1.1) })); m.visible = false; m.renderOrder = 2; scene.add(m); return { m, life: 0 }; });
let foamI = 0, foamT = 0;
function spawnFoam(p, s) { const f = foams[foamI++ % foams.length]; f.m.visible = true; f.m.position.set(p.x, .025, p.z); f.m.rotation.y = Math.random() * 6; f.life = 1; f.s = s; }
const leafN = 70, leaves = new THREE.InstancedMesh(new THREE.PlaneGeometry(.22, .12).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6d7a2c', roughness: .7, side: THREE.DoubleSide }), leafN); scene.add(leaves);
const LF = Array.from({ length: leafN }, (_, i) => { const R = Math.random; return { x: (R() - .5) * 80, z: (R() - .5) * 2 * (BANK - 1), r: R() * 6, w: (R() - .5) * .4, c: new THREE.Color().setHSL(.08 + R() * .12, .5, .25 + R() * .15) }; });
LF.forEach((l, i) => leaves.setColorAt(i, l.c));

/* ---------- vektör okları ---------- */
const arK = new Arrow(scene, '#35c25c'), arA = new Arrow(scene, '#3d8bff'), arR = new Arrow(scene, '#ffc93a', { glow: 1.9 }), arCx = new Arrow(scene, '#c46bff'), arCz = new Arrow(scene, '#c46bff');
const dashMat = new THREE.LineDashedMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(1.4), dashSize: .25, gapSize: .18, transparent: true, opacity: .8, toneMapped: false, depthTest: false });
const mkLine = n => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); const l = new THREE.Line(g, dashMat); l.renderOrder = 19; l.frustumCulled = false; scene.add(l); return l; };
const paraA = mkLine(2), paraB = mkLine(2), pathL = mkLine(2);
const setLine = (l, a, b) => { const p = l.geometry.attributes.position.array; p.set([a.x, a.y, a.z, b.x, b.y, b.z]); l.geometry.attributes.position.needsUpdate = true; l.computeLineDistances(); l.visible = true; };
// iz
const TRN = 600, trailG = new THREE.BufferGeometry(); trailG.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRN * 3), 3)); trailG.setDrawRange(0, 0);
const trail = new THREE.Line(trailG, new THREE.LineBasicMaterial({ color: new THREE.Color('#9ad0ff').multiplyScalar(1.6), toneMapped: false, transparent: true, opacity: .9 })); trail.frustumCulled = false; scene.add(trail); let trailN = 0;
// varış ve iskele işaretleri
const ringM = c => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(2), toneMapped: false, transparent: true, opacity: .9, depthWrite: false });
const landRing = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 8, 64).rotateX(Math.PI / 2), ringM('#ffffff')); scene.add(landRing);
const pierRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, .07, 8, 64).rotateX(Math.PI / 2), ringM('#f2c230')); pierRing.position.set(0, .05, Z1); scene.add(pierRing);

/* ---------- kinematik ---------- */
const vel = () => ({ x: S.va - S.vk * Math.sin(S.th * DEG), z: -S.vk * Math.cos(S.th * DEG) });
const crossT = () => { const vz = S.vk * Math.cos(S.th * DEG); return vz > 1e-6 ? D / vz : Infinity; };
const landX = () => vel().x * crossT();
function heading() { const t = S.th * DEG; return { x: -Math.sin(t), z: -Math.cos(t) }; }

/* ---------- arayüz ---------- */
const toastEl = $('toast'); let toastT = 0; function toast(m, ms = 4600) { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), ms); }
const SC = {
  straight: { name: 'Burnu dik tut', sub: 'Kayık karşıya bakıyor, akıntı sürüklüyor', vk: 2.5, th: 0, va: 1.2 },
  aim: { name: 'Görev: iskeleye yanaş', sub: 'Burun açısını sen bul', vk: 2.5, th: 0, va: 1.5, mission: true },
  strong: { name: 'Güçlü akıntı', sub: 'Akıntı kayıktan hızlı', vk: 1.2, th: 30, va: 2.2 },
  calm: { name: 'Durgun su', sub: 'Akıntı yok: kayık baktığı yere gider', vk: 2.5, th: 0, va: 0 },
};
function syncUI() {
  $('i-vk').value = S.vk; $('i-th').value = S.th; $('i-va').value = S.va;
  $('o-vk').textContent = fmt(S.vk, 1) + ' m/s'; $('o-th').textContent = (S.th > 0 ? '+' : '') + S.th + '°'; $('o-va').textContent = fmt(S.va, 1) + ' m/s';
  $('dial-t').textContent = S.th === 0 ? 'θ = 0: burun tam karşı kıyıya bakıyor.' : S.th > 0 ? `Burun ${S.th}° akıntıya karşı (yukarı) çevrildi.` : `Burun ${-S.th}° akıntı yönüne (aşağı) çevrildi.`;
  drawDial(); values();
}
function drawDial() {
  const c = $('dial'), g = c.getContext('2d'), w = c.width, r = w * .4, cx = w / 2, cy = w / 2; g.clearRect(0, 0, w, w);
  g.fillStyle = '#e8f3f9'; g.beginPath(); g.arc(cx, cy, r + 8, 0, 7); g.fill();
  g.strokeStyle = '#9ec3d8'; g.lineWidth = 2; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(cx - r * .9, cy + i * 16); g.lineTo(cx + r * .9, cy + i * 16); g.stroke(); }
  g.fillStyle = '#2d6fd2'; g.beginPath(); g.moveTo(cx + r * .95, cy + r * .75); g.lineTo(cx + r * .6, cy + r * .6); g.lineTo(cx + r * .6, cy + r * .9); g.fill(); // akıntı yönü (sağa)
  g.save(); g.translate(cx, cy); g.rotate(-S.th * DEG); // yukarı = karşı kıyı; pozitif θ sola (akıntıya karşı)
  g.fillStyle = '#f1ede2'; g.strokeStyle = '#1f4e8c'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -r * .85); g.quadraticCurveTo(r * .34, -r * .2, r * .22, r * .6); g.lineTo(-r * .22, r * .6); g.quadraticCurveTo(-r * .34, -r * .2, 0, -r * .85); g.fill(); g.stroke();
  g.restore(); g.strokeStyle = '#c8412f'; g.setLineDash([4, 4]); g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy - r - 6); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#0e0c08'; g.font = '800 22px "Plus Jakarta Sans",sans-serif'; g.textAlign = 'center'; g.fillText((S.th > 0 ? '+' : '') + S.th + '°', cx, w - 6);
}
function values() {
  const v = vel(), vr = Math.hypot(v.x, v.z), T = crossT(), lx = landX(); const ang = Math.atan2(v.x, -v.z) / DEG;
  const rows = [['Karşıya doğru bileşen vₖ·cosθ', fmt(-v.z, 2) + ' m/s'], ['Akıntı yönünde bileşen vₐ − vₖ·sinθ', fmt(v.x, 2) + ' m/s'], ['Bileşke hız |v<sub>R</sub>|', fmt(vr, 2) + ' m/s'],
    ['Nehir genişliği d', D + ' m'], ['Karşıya geçiş süresi', isFinite(T) ? fmt(T, 1) + ' s' : '—'], ['Varışta sapma', isFinite(T) ? (Math.abs(lx) < .05 ? 'tam karşı' : `${fmt(Math.abs(lx), 1)} m ${lx > 0 ? 'aşağıda' : 'yukarıda'}`) : '—']];
  $('vals').innerHTML = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') + `<tr class="f"><td colspan="2">|v<sub>R</sub>|² = vₖ² + vₐ² − 2·vₖ·vₐ·sinθ<br>t = d / (vₖ·cosθ) · sapma = (vₐ − vₖ·sinθ)·t</td></tr>`;
}
function setScenario(k) { S.sc = k; const s = SC[k]; S.vk = s.vk; S.th = s.th; S.va = s.va; S.mission = !!s.mission; $('h-mode').innerHTML = `${s.name}<small>${s.sub}</small>`; syncUI(); resetAll();
  if (k === 'aim') toast('Görev: kayığı tam karşıdaki sarı halkaya getir. İpucu: burnu akıntıya karşı çevir. Kaç derece olmalı?', 6000);
  if (k === 'strong') toast('Akıntı kayıktan hızlı: burnu nereye çevirirsen çevir, kayık tam karşıya varamaz.');
  if (k === 'calm') toast('Akıntı yokken kayık tam baktığı yöne gider. Bileşke hız, kayığın kendi hızıdır.'); }
function resetAll() { S.run = false; S.t = 0; S.x = 0; S.z = Z0; S.done = false; trailN = 0; trailG.setDrawRange(0, 0); $('btn-go').textContent = '▶ Yola çık'; }
function go() { if (S.done) resetAll(); if (S.run) { S.run = false; $('btn-go').textContent = '▶ Devam'; return; }
  if (!isFinite(crossT())) { toast('Burun tamamen yana dönük: kayık karşıya hiç ilerlemez.'); return; }
  S.run = true; $('btn-go').textContent = '⏸ Durdur'; $('aimhint').style.display = 'none'; }
$('btn-go').onclick = go; $('btn-reset').onclick = resetAll;
document.querySelectorAll('#cards-sc .a3c').forEach(b => b.onclick = () => { document.querySelectorAll('#cards-sc .a3c').forEach(x => x.classList.toggle('on', x === b)); setScenario(b.dataset.sc); });
const bindR = (id, key, f = v => v) => $(id).addEventListener('input', e => { S[key] = f(+e.target.value); if (!S.mission) { document.querySelectorAll('#cards-sc .a3c').forEach(x => x.classList.remove('on')); $('h-mode').innerHTML = 'Kendi ayarın<small>Değerleri sen seçtin</small>'; } syncUI(); if (!S.run) resetAll(); });
bindR('i-vk', 'vk'); bindR('i-th', 'th', v => Math.round(v)); bindR('i-va', 'va');
const tg = (id, k, after) => $(id).addEventListener('click', e => { S[k] = !S[k]; e.currentTarget.classList.toggle('on', S[k]); after && after(); });
tg('tg-vec', 'vec'); tg('tg-comp', 'comp', () => S.comp && toast('Mor oklar bileşke hızın bileşenleri: biri karşıya doğru, biri akıntı yönünde.')); tg('tg-path', 'path'); tg('tg-trail', 'trail');
const segs = (id, fn) => { const el = $(id); el.querySelectorAll('button').forEach(b => b.onclick = () => { el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); fn(b); }); };
segs('seg-add', b => { S.mode = b.dataset.m; toast(S.mode === 'tip' ? 'Uç uca: akıntı okunu kayık okunun ucuna ekle. Bileşke, ilk okun başından son okun ucuna gider.' : 'Paralelkenar: iki ok aynı noktadan çizilir. Bileşke, paralelkenarın köşegenidir.'); });
segs('seg-cam', b => { S.cam = b.dataset.cam; W.orbit.auto = 0; }); segs('seg-speed', b => S.speed = +b.dataset.s);
W.bindFullscreen($('btn-full'));

/* ---------- döngü ---------- */
let time = 0, lastUI = 0; const tmp = new THREE.Vector3();
W.update = dt => {
  time += dt;
  const v = vel(), h = heading();
  // akıntı: normal haritaları akış yönünde kaydır
  n1.offset.x -= S.va * dt / 7 + .002 * dt; n1.offset.y += .004 * dt; n2.offset.x -= S.va * dt / 2.6 * .9; n2.offset.y -= .006 * dt;
  // yapraklar
  const o = new THREE.Object3D(); LF.forEach((l, i) => { l.x += S.va * dt; l.r += l.w * dt; if (l.x > 45) l.x -= 90; o.position.set(l.x, .02, l.z); o.rotation.set(0, l.r, 0); o.updateMatrix(); leaves.setMatrixAt(i, o.matrix); }); leaves.instanceMatrix.needsUpdate = true;
  // hareket
  if (S.run) { const sdt = dt * S.speed; S.t += sdt; S.x += v.x * sdt; S.z += v.z * sdt;
    if (S.z <= Z1) { const over = (Z1 - S.z) / -v.z; S.t -= over; S.x -= v.x * over; S.z = Z1; S.run = false; S.done = true; $('btn-go').textContent = '↺ Tekrar'; arrive(); }
    if (S.trail && trailN < TRN) { const p = trailG.attributes.position.array; p.set([S.x, .06, S.z], trailN * 3); trailN++; trailG.setDrawRange(0, trailN); trailG.attributes.position.needsUpdate = true; } }
  trail.visible = S.trail;
  // kayık konumu, yönü ve sallanma
  const yaw = Math.atan2(-h.z, h.x); boat.root.position.set(S.x, 0, S.z); boat.root.rotation.y = yaw;
  const moving = S.run ? 1 : 0; boat.grp.rotation.z = .025 * Math.sin(time * 1.3) + moving * .05; boat.grp.rotation.x = .03 * Math.sin(time * 1.7 + 1); boat.grp.position.y = .3 + .03 * Math.sin(time * 2.1);
  boat.prop.rotation.x += dt * (S.run ? 40 : 2);
  { const a = boat.flagG.attributes.position.array, b = boat.flagP; for (let i = 0; i < a.length; i += 3) { const x = b[i]; a[i + 2] = Math.sin(x * 14 - time * 9) * x * .12; } boat.flagG.attributes.position.needsUpdate = true; }
  // köpük ve sıçrama
  if (S.run) { foamT -= dt; if (foamT <= 0) { foamT = .06; const st = new THREE.Vector3(-boat.L / 2 - .2, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).add(boat.root.position); spawnFoam(st, .7);
      const bw = new THREE.Vector3(boat.L / 2 - .2, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).add(boat.root.position); for (const sd of [-1, 1]) { const side = new THREE.Vector3(0, 0, sd * .7).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw); spawnFoam(bw.clone().add(side), .45); } } }
  foams.forEach(f => { if (f.life <= 0) return; f.life -= dt * .45; f.m.position.x += S.va * dt; const k = 1 - f.life; f.m.scale.setScalar(f.s * (1 + k * 1.6)); f.m.material.opacity = Math.pow(Math.max(0, f.life), 1.5) * .5; if (f.life <= 0) f.m.visible = false; });
  // oklar
  const P = new THREE.Vector3(S.x, 1.1, S.z), vk = new THREE.Vector3(h.x, 0, h.z).multiplyScalar(S.vk * K), va = new THREE.Vector3(S.va * K, 0, 0), vr = vk.clone().add(va);
  if (S.vec) { const th = .11; arK.set(P, vk, th); arR.set(P, vr, th * 1.15);
    if (S.mode === 'tip') { arA.set(P.clone().add(vk), va, th); paraA.visible = paraB.visible = false; } else { arA.set(P, va, th); setLine(paraA, P.clone().add(vk), P.clone().add(vr)); setLine(paraB, P.clone().add(va), P.clone().add(vr)); }
    if (S.va < .01) arA.hide(); }
  else { arK.hide(); arA.hide(); arR.hide(); paraA.visible = paraB.visible = false; }
  if (S.comp && S.vec) { arCx.set(P.clone().setY(1.06), new THREE.Vector3(vr.x, 0, 0), .04); arCz.set(P.clone().setY(1.06), new THREE.Vector3(0, 0, vr.z), .04); } else { arCx.hide(); arCz.hide(); }
  // tahmini rota ve varış noktası
  const T = crossT(); const lx = S.x + v.x * ((S.z - Z1) / Math.max(1e-6, -v.z));
  if (S.path && isFinite(T) && !S.done) { setLine(pathL, new THREE.Vector3(S.x, .08, S.z), new THREE.Vector3(lx, .08, Z1)); landRing.visible = true; landRing.position.set(lx, .05, Z1); landRing.scale.setScalar(1 + .08 * Math.sin(time * 4)); }
  else { pathL.visible = false; landRing.visible = S.done; if (S.done) landRing.position.set(S.x, .05, Z1); }
  pierRing.scale.setScalar(1 + .05 * Math.sin(time * 3)); pierRing.material.opacity = S.mission ? .95 : .45;
  cameraDirector(dt);
  W.updateOrbit(dt, S.cam === 'boat' ? 4 : 2.5);
  if (time - lastUI > .08) { lastUI = time; ui(v, lx); }
};
function arrive() {
  const miss = Math.abs(S.x);
  if (S.mission) { if (miss <= 1.5) { toast(`Harika! İskeleye yanaştın (sapma ${fmt(miss, 1)} m). vₖ·sinθ ≈ vₐ oldu: akıntıyı tam dengeledin.`, 7000); for (let i = 0; i < 40; i++) W.puff(new THREE.Vector3(S.x, 1.5, Z1), new THREE.Vector3((Math.random() - .5) * 6, 4 + Math.random() * 4, (Math.random() - .5) * 6), { color: ['#f2c230', '#ff5a3d', '#35c25c', '#3d8bff'][i % 4], size: .18, grow: 0, life: 2, grav: 6, op: 1, tex: W.dropTex, add: true, hdr: 2 }); }
    else toast(`İskeleyi ${fmt(miss, 1)} m ${S.x > 0 ? 'aşağıdan' : 'yukarıdan'} kaçırdın. Burun açısını ${S.x > 0 ? 'artır' : 'azalt'} ve tekrar dene.`, 6000); }
  else toast(`Karşıya vardın: ${fmt(S.t, 1)} s sürdü, ${Math.abs(S.x) < .05 ? 'tam karşıya' : fmt(Math.abs(S.x), 1) + ' m ' + (S.x > 0 ? 'aşağıya' : 'yukarıya')} vardın.`, 6000);
}
function cameraDirector() {
  if (S.cam === 'free') return; const o = W.orbit; const bp = new THREE.Vector3(S.x, .8, S.z);
  if (S.cam === 'drone') { o.target.lerp(new THREE.Vector3(S.x * .6, 0, 0), .05); o.r = isMobile ? 32 : 24; o.th = lerp(o.th, -.45, .02); o.ph = .82; }
  else if (S.cam === 'bank') { o.target.lerp(bp, .08); o.r = isMobile ? 24 : 19; o.th = lerp(o.th, -.7, .03); o.ph = 1.32; }
  else { const h = heading(); o.target.lerp(bp.clone().add(new THREE.Vector3(h.x, 0, h.z).multiplyScalar(6)), .15); o.r = isMobile ? 18 : 15; o.th = Math.atan2(-h.x, -h.z); o.ph = 1.08; }
}
function ui(v, lx) {
  $('h-t').textContent = fmt(S.t, 1) + ' s';
  $('hud').innerHTML = `<div class="a3p"><small>Kayık vₖ</small><span>${fmt(S.vk, 1)} m/s</span></div><div class="a3p"><small>Akıntı vₐ</small><span>${fmt(S.va, 1)} m/s</span></div><div class="a3p v"><small>Bileşke v<sub>R</sub></small><span>${fmt(Math.hypot(v.x, v.z), 2)} m/s</span></div><div class="a3p"><small>Yol</small><span>${fmt(Math.hypot(S.x, S.z - Z0), 1)} m</span></div>`;
  const P = new THREE.Vector3(S.x, 1.1, S.z), h = heading(), vk = new THREE.Vector3(h.x, 0, h.z).multiplyScalar(S.vk * K), va = new THREE.Vector3(S.va * K, 0, 0), vr = vk.clone().add(va);
  if (S.vec) { const pr = new THREE.Vector3(-vr.z, 0, vr.x).normalize();
    W.tag($('tag-vk'), P.clone().addScaledVector(vk, .5).add(new THREE.Vector3(-1.1, .3, 0)), `v<i>k</i>`);
    W.tag($('tag-vr'), P.clone().addScaledVector(vr, .5).addScaledVector(pr, 1.1).setY(1.4), `v<i>R</i> ${fmt(Math.hypot(v.x, v.z), 1)}`);
    if (S.va > .01) W.tag($('tag-va'), (S.mode === 'tip' ? P.clone().add(vk).addScaledVector(va, .35).add(new THREE.Vector3(0, .45, -.45)) : P.clone().addScaledVector(va, .5).add(new THREE.Vector3(0, .3, .9))), `v<i>a</i>`); else $('tag-va').style.display = 'none'; }
  else ['tag-vk', 'tag-va', 'tag-vr'].forEach(i => $(i).style.display = 'none');
  if (landRing.visible && !S.done && S.path) W.tag($('tag-land'), new THREE.Vector3(lx, .3, Z1 - 1.2), Math.abs(lx) < .3 ? 'Tam karşı!' : 'Varış'); else $('tag-land').style.display = 'none';
  W.tag($('tag-pier'), new THREE.Vector3(0, 2.4, Z1 - 3), 'İskele');
}

/* ---------- başlat ---------- */
W.orbit.minR = 4; W.orbit.maxR = 120; W.orbit.maxPh = 1.45; W.orbit.minPh = .25;
syncUI(); resetAll(); W.orbit.target.set(0, 0, 0); W.orbit.r = 60; W.orbit.th = -1.1; W.orbit.ph = .9; camera.position.copy(W.orbitPos()); W.orbit.look.copy(W.orbit.target);
W.loadEnv('lake').then(() => W.start());
window.__bfyLab = { W, S, setScenario, resetAll, go, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) W.update(1 / 60); } };
