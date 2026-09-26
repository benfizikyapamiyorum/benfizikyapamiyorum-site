// BFY · 3B Manyetik Alan Laboratuvarı — Biot–Savart ile alan, demir tozu, pusulalar
import { THREE, createWorld, worldUVMaterial, canvasTex, $, clamp, lerp, smooth, fmt, DEG, rng, isMobile } from './bfy3d-core.js';

const TY = .76, PY = TY + .12, FY = PY + .004;   // plaka üstü = alan düzlemi
const PL = .46;                                    // plaka kenarı
const MU0 = 4 * Math.PI * 1e-7;
const S = { src: 'wire', I: 10, dir: 1, N: 20, on: true, fil: true, comp: true, lines: false, flow: true, hand: false, earth: false, cam: 'orbit' };
const R_LOOP = .07, SOL = { r: .045, L: .18 }, BAR = { L: .14, w: .026 };

/* ---------- dünya ---------- */
const stage = $('stage'), canvas = $('c3d');
const W = createWorld({ stage, canvas, fov: 32, near: .01, far: 400, shadowBox: .8, shadowFar: 8, bloom: [.3, .4, 1.6] });
const { scene, camera } = W;
W.sun.castShadow = false;
const cT = { col: W.tex('tex/concrete_col.jpg'), nor: W.tex('tex/concrete_nor.jpg', false), arm: W.tex('tex/concrete_arm.jpg', false) };
const floorMat = worldUVMaterial({ map: cT.col, normalMap: cT.nor, roughnessMap: cT.arm, tile: 1.6, tint: '#6d8a86', normalScale: .6, envMapIntensity: .5 });
floorMat.transparent = true;
{ const ob = floorMat.onBeforeCompile; floorMat.onBeforeCompile = sh => { ob(sh); sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.a *= 1.0 - smoothstep(1.8, 4.2, length(vWPos.xz));'); }; }
const floor = new THREE.Mesh(new THREE.CircleGeometry(4.5, 96).rotateX(-Math.PI / 2), floorMat); floor.receiveShadow = true; scene.add(floor);
W.gltf('models/WoodenTable_01/WoodenTable_01.gltf').then(o => { o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); o.scale.set(1, TY / .549, 1.15); o.position.set(.1, 0, 0); scene.add(o); });
const lamp = new THREE.SpotLight('#fff6e8', 4, 3, .5, .6, 1.3); lamp.position.set(.2, TY + 1.2, .5); lamp.target.position.set(0, PY, 0); lamp.castShadow = true; lamp.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048); lamp.shadow.bias = -.0003; scene.add(lamp, lamp.target);
const black = new THREE.MeshStandardMaterial({ color: '#17181a', metalness: .5, roughness: .45 });
const chrome = new THREE.MeshStandardMaterial({ color: '#e6e9ec', metalness: 1, roughness: .12 });
const copper = new THREE.MeshStandardMaterial({ color: '#e7925a', metalness: 1, roughness: .2 });
const brass = new THREE.MeshStandardMaterial({ color: '#c9a04e', metalness: 1, roughness: .28 });

/* ---------- plaka ve kâğıt ---------- */
const plate = new THREE.Mesh(new THREE.BoxGeometry(PL, .006, PL), new THREE.MeshPhysicalMaterial({ color: '#f4fbff', transparent: true, opacity: .35, roughness: .05, envMapIntensity: 1.2 }));
plate.position.set(0, PY, 0); scene.add(plate);
const paperTex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#f3f1ea'; g.fillRect(0, 0, w, h); const R = rng(3); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(120,110,90,${R() * .05})`; g.fillRect(R() * w, R() * h, 1 + R() * 2, 1); } });
const paper = new THREE.Mesh(new THREE.PlaneGeometry(PL * .96, PL * .96).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: paperTex, color: '#cfcabd', roughness: .95 })); paper.position.set(0, PY + .0032, 0); paper.receiveShadow = true; scene.add(paper);
for (const x of [-PL / 2 + .02, PL / 2 - .02]) for (const z of [-PL / 2 + .02, PL / 2 - .02]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(.007, .007, PY - TY, 16), chrome); l.position.set(x, (PY + TY) / 2, z); l.castShadow = true; scene.add(l); }

/* ---------- kaynaklar (görsel) ---------- */
const srcG = { wire: new THREE.Group(), loop: new THREE.Group(), sol: new THREE.Group(), bar: new THREE.Group() };
Object.values(srcG).forEach(g => scene.add(g));
{ const w = new THREE.Mesh(new THREE.CylinderGeometry(.0032, .0032, .42, 24), copper); w.position.set(0, TY + .02 + .21, 0); w.castShadow = true; srcG.wire.add(w);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.006, 16, 12), copper); cap.position.set(0, TY + .44, 0); srcG.wire.add(cap); }
{ const t = new THREE.Mesh(new THREE.TorusGeometry(R_LOOP, .0035, 16, 96), copper); t.position.set(0, PY, 0); t.castShadow = true; srcG.loop.add(t);
  const lead = new THREE.Mesh(new THREE.CylinderGeometry(.0028, .0028, PY - TY - .01, 12), copper); lead.position.set(0, (PY - R_LOOP + TY) / 2, 0); srcG.loop.add(lead); }
let solMesh = null;
function buildSolenoid() {
  if (solMesh) { srcG.sol.remove(solMesh); solMesh.geometry.dispose(); }
  const n = S.N, pts = []; const M = n * 40;
  for (let i = 0; i <= M; i++) { const t = i / M, a = t * n * Math.PI * 2; pts.push(new THREE.Vector3(-SOL.L / 2 + t * SOL.L, PY + Math.cos(a) * SOL.r, Math.sin(a) * SOL.r)); }
  solMesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), M, .0026, 8), copper); solMesh.castShadow = true; srcG.sol.add(solMesh);
  solPath = pts;
}
let solPath = [];
{ const draw = (g, w, h) => { g.fillStyle = '#2455ff'; g.fillRect(0, 0, w / 2, h); g.fillStyle = '#d8231c'; g.fillRect(w / 2, 0, w / 2, h); g.fillStyle = '#fff'; g.font = '900 84px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('S', w * .25, h / 2 + 4); g.fillText('N', w * .75, h / 2 + 4); };
  const tex = canvasTex(512, 128, draw), texB = canvasTex(512, 128, (g, w, h) => { g.translate(w, 0); g.scale(-1, 1); g.fillStyle = '#2455ff'; g.fillRect(0, 0, w / 2, h); g.fillStyle = '#d8231c'; g.fillRect(w / 2, 0, w / 2, h); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#fff'; g.font = '900 84px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('N', w * .25, h / 2 + 4); g.fillText('S', w * .75, h / 2 + 4); });
  const M = t => new THREE.MeshStandardMaterial({ map: t, roughness: .35, metalness: .3 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(BAR.L, BAR.w, BAR.w), [new THREE.MeshStandardMaterial({ color: '#d8231c', roughness: .35 }), new THREE.MeshStandardMaterial({ color: '#2455ff', roughness: .35 }), M(tex), M(tex), M(tex), M(texB)]);
  b.position.set(0, FY + BAR.w / 2, 0); b.castShadow = true; srcG.bar.add(b); }

/* ---------- güç kaynağı ve kablolar ---------- */
const lcdC = document.createElement('canvas'); lcdC.width = 256; lcdC.height = 96; const lcdT = new THREE.CanvasTexture(lcdC); lcdT.colorSpace = THREE.SRGBColorSpace;
const psu = new THREE.Group(); psu.position.set(-.38, TY, .12); psu.rotation.y = .5; scene.add(psu);
{ const body = new THREE.Mesh(new THREE.BoxGeometry(.2, .1, .15), [black, black, black, black, new THREE.MeshStandardMaterial({ color: '#2a2c30', roughness: .5 }), black]); body.position.y = .05; body.castShadow = true; psu.add(body);
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(.1, .038), new THREE.MeshBasicMaterial({ map: lcdT, toneMapped: false })); lcd.position.set(-.03, .062, .0755); psu.add(lcd);
  for (const [x, c] of [[.055, '#d8231c'], [.08, '#111']]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.007, .007, .014, 16).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: c, roughness: .4 })); t.position.set(x, .035, .08); psu.add(t); }
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .012, 24).rotateX(Math.PI / 2), chrome); knob.position.set(.065, .07, .08); psu.add(knob); }
function drawLCD() { const g = lcdC.getContext('2d'); g.fillStyle = '#081208'; g.fillRect(0, 0, 256, 96); g.fillStyle = S.on && S.src !== 'bar' ? '#5dff8a' : '#1f4a2a'; g.font = '700 58px ui-monospace,Menlo,monospace'; g.textAlign = 'right'; g.fillText(fmt(S.on && S.src !== 'bar' ? S.I : 0, 1), 196, 66); g.font = '700 26px Arial'; g.fillText('A', 240, 66); lcdT.needsUpdate = true; }
const cableMat = [new THREE.MeshStandardMaterial({ color: '#b3261e', roughness: .6 }), new THREE.MeshStandardMaterial({ color: '#141414', roughness: .6 })];
const cables = [new THREE.Mesh(new THREE.BufferGeometry(), cableMat[0]), new THREE.Mesh(new THREE.BufferGeometry(), cableMat[1])]; cables.forEach(c => { c.castShadow = true; scene.add(c); });
function layoutCables() {
  const T = [new THREE.Vector3(.055, .035, .09), new THREE.Vector3(.08, .035, .09)].map(v => psu.localToWorld(v.clone()));
  let ends;
  if (S.src === 'wire') ends = [new THREE.Vector3(0, TY + .02, 0), new THREE.Vector3(0, TY + .44, 0)];
  else if (S.src === 'loop') ends = [new THREE.Vector3(0, TY + .01, 0), new THREE.Vector3(0, TY + .01, 0)];
  else if (S.src === 'sol') ends = [solPath[0].clone(), solPath[solPath.length - 1].clone()];
  else { cables.forEach(c => c.visible = false); return; }
  cables.forEach((c, i) => { c.visible = true; const a = T[i], b = ends[i];
    if (S.src === 'sol' && b.x > 0) { const pts = [a, a.clone().add(new THREE.Vector3(0, -.02, .03)), new THREE.Vector3(-PL / 2 - .03, TY + .006, .06), new THREE.Vector3(-PL / 2 + .05, TY + .03, .03), new THREE.Vector3(b.x - .02, PY - .035, b.z + .01), new THREE.Vector3(b.x + .02, PY - .012, b.z), new THREE.Vector3(b.x + .02, PY + .02, b.z), new THREE.Vector3(b.x + .012, b.y + .01, b.z), b];
      c.geometry.dispose(); c.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 100, .0028, 8); return; }
    if (S.src === 'sol') { const sg = Math.sign(b.x) || 1; const pts = [a, a.clone().add(new THREE.Vector3(0, -.02, .03)), new THREE.Vector3(lerp(a.x, b.x, .4), TY + .006, lerp(a.z, b.z, .4) - .05 + i * .1), new THREE.Vector3(b.x + sg * .06, PY - .01, b.z - .02 + i * .04), new THREE.Vector3(b.x + sg * .025, b.y + .012, b.z), b];
      c.geometry.dispose(); c.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, .0028, 8); return; } const mid = a.clone().lerp(b, .5); mid.y = Math.max(a.y, b.y) + (i ? .12 : .05); mid.z += i ? .12 : .06;
    const low = a.clone().lerp(b, .25); low.y = TY + .006; c.geometry.dispose(); c.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, a.clone().add(new THREE.Vector3(0, -.02, .03)), low, mid, b]), 60, .0028, 8); });
}

/* ---------- alan hesabı ---------- */
let SEG = [];   // [sx,sy,sz, dlx,dly,dlz, I]
function buildSegments() {
  SEG = [];
  const I = S.I * S.dir;
  if (S.src === 'loop') { const n = 128; for (let k = 0; k < n; k++) { const a0 = k / n * 2 * Math.PI, a1 = (k + 1) / n * 2 * Math.PI; const p0 = [R_LOOP * Math.cos(a0), PY + R_LOOP * Math.sin(a0), 0], p1 = [R_LOOP * Math.cos(a1), PY + R_LOOP * Math.sin(a1), 0];
    SEG.push([(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, 0, p1[0] - p0[0], p1[1] - p0[1], 0, I]); } }
  if (S.src === 'sol' || S.src === 'bar') {
    const turns = S.src === 'sol' ? S.N : 30, r = S.src === 'sol' ? SOL.r : BAR.w * .56, L = S.src === 'sol' ? SOL.L : BAR.L, Ie = S.src === 'sol' ? I : 60 * (S.dir);
    const per = 32; for (let t = 0; t < turns; t++) { const x = -L / 2 + (t + .5) / turns * L; for (let k = 0; k < per; k++) { const a0 = k / per * 2 * Math.PI, a1 = (k + 1) / per * 2 * Math.PI;
      const cy = S.src === 'bar' ? FY + BAR.w / 2 : PY; const p0 = [x, cy + r * Math.cos(a0), r * Math.sin(a0)], p1 = [x, cy + r * Math.cos(a1), r * Math.sin(a1)];
      // bobin sarımı: +x ekseni etrafında (sağ el → alan +x)
      SEG.push([(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2, p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2], Ie]); } } }
}
function fieldAt(x, y, z) {
  let bx = 0, by = 0, bz = 0;
  if (!S.on && S.src !== 'bar') return [0, 0, 0];
  if (S.src === 'wire') { const r2 = x * x + z * z + 1e-6, k = MU0 * S.I * S.dir / (2 * Math.PI); bx = k * z / r2; bz = -k * x / r2; }
  else { const e2 = 2.5e-6; for (const s of SEG) { const rx = x - s[0], ry = y - s[1], rz = z - s[2], r2 = rx * rx + ry * ry + rz * rz + e2, inv = s[6] / (r2 * Math.sqrt(r2));
      bx += (s[4] * rz - s[5] * ry) * inv; by += (s[5] * rx - s[3] * rz) * inv; bz += (s[3] * ry - s[4] * rx) * inv; } const k = MU0 / (4 * Math.PI); bx *= k; by *= k; bz *= k; }
  return [bx, by, bz];
}
const GN = 112; const GB = new Float32Array(GN * GN * 2); let gridMax = 1e-9;
function buildGrid() {
  const ys = S.src === 'bar' ? FY + BAR.w / 2 : FY;
  for (let j = 0; j < GN; j++) for (let i = 0; i < GN; i++) { const x = -PL / 2 + (i + .5) / GN * PL, z = -PL / 2 + (j + .5) / GN * PL; const b = fieldAt(x, ys, z); GB[(j * GN + i) * 2] = b[0]; GB[(j * GN + i) * 2 + 1] = b[2]; }
  const mags = []; for (let k = 0; k < GN * GN; k += 7) mags.push(Math.hypot(GB[k * 2], GB[k * 2 + 1])); mags.sort((a, b) => a - b); gridMax = mags[Math.floor(mags.length * .85)] || 1e-9;
}
function sampleB(x, z) {
  const fx = (x + PL / 2) / PL * GN - .5, fz = (z + PL / 2) / PL * GN - .5; const i = clamp(Math.floor(fx), 0, GN - 2), j = clamp(Math.floor(fz), 0, GN - 2), u = clamp(fx - i, 0, 1), v = clamp(fz - j, 0, 1);
  const g = (ii, jj, c) => GB[((jj) * GN + ii) * 2 + c];
  const bx = (g(i, j, 0) * (1 - u) + g(i + 1, j, 0) * u) * (1 - v) + (g(i, j + 1, 0) * (1 - u) + g(i + 1, j + 1, 0) * u) * v;
  const bz = (g(i, j, 1) * (1 - u) + g(i + 1, j, 1) * u) * (1 - v) + (g(i, j + 1, 1) * (1 - u) + g(i + 1, j + 1, 1) * u) * v;
  return [bx, bz];
}
const blocked = (x, z) => { if (S.src === 'wire') return Math.hypot(x, z) < .007; if (S.src === 'loop') return Math.abs(z) < .006 && Math.abs(Math.abs(x) - R_LOOP) < .007; if (S.src === 'sol') return Math.abs(x) < SOL.L / 2 + .004 && Math.abs(Math.abs(z) - SOL.r) < .006; if (S.src === 'bar') return Math.abs(x) < BAR.L / 2 + .002 && Math.abs(z) < BAR.w / 2 + .002; return false; };

/* ---------- demir tozu ---------- */
const NG = isMobile ? 7000 : 12000;
const grainGeo = new THREE.BoxGeometry(.0028, .00045, .00055);
const grains = new THREE.InstancedMesh(grainGeo, new THREE.MeshStandardMaterial({ color: '#1f1f22', metalness: .45, roughness: .5 }), NG); grains.frustumCulled = false; scene.add(grains);
{ const R = rng(7), c = new THREE.Color(); for (let k = 0; k < NG; k++) { const v = .4 + R() * .6; c.setRGB(v, v * .97, v * .94); grains.setColorAt(k, c); } grains.instanceColor.needsUpdate = true; }
const GP = new Float32Array(NG * 2), GA = new Float32Array(NG), GT = new Float32Array(NG), GJ = new Float32Array(NG * 2);
const dO = new THREE.Object3D();
function sprinkle() { const R = rng((Math.random() * 1e9) | 0); for (let k = 0; k < NG; k++) { GP[k * 2] = (R() - .5) * PL * .94; GP[k * 2 + 1] = (R() - .5) * PL * .94; GA[k] = R() * Math.PI; GJ[k * 2] = (R() - .5) * .0004; GJ[k * 2 + 1] = R(); } alignT = 0; }
function computeTargets() {
  // tozlar alan çizgileri boyunca zincirlenir: alanın güçlü olduğu yere daha çok toplanır
  const R = rng(99); let k = 0, guard = 0;
  while (k < NG && guard++ < NG * 30) {
    const x = (R() - .5) * PL * .94, z = (R() - .5) * PL * .94; if (blocked(x, z)) continue;
    let [bx, bz] = sampleB(x, z); const m = Math.hypot(bx, bz); if (m < 1e-12) { GT[k] = GA[k]; GP[k * 2] = x; GP[k * 2 + 1] = z; k++; continue; }
    if (R() > clamp(Math.sqrt(m / gridMax), .12, 1)) continue;
    let px = x, pz = z; const chain = 3 + Math.floor(R() * 5), sgn = R() < .5 ? 1 : -1;
    for (let c = 0; c < chain && k < NG; c++) {
      let [ax, az] = sampleB(px, pz); const mm = Math.hypot(ax, az) || 1; ax /= mm; az /= mm;
      GP[k * 2] = px + (R() - .5) * .0006; GP[k * 2 + 1] = pz + (R() - .5) * .0006; const loose = 1 - clamp(Math.hypot(...sampleB(px, pz)) / gridMax * 2.5, 0, 1); GT[k] = Math.atan2(-az, ax) + (R() - .5) * (.3 + loose * 2.2); k++;
      px += ax * .0031 * sgn; pz += az * .0031 * sgn; if (Math.abs(px) > PL * .47 || Math.abs(pz) > PL * .47 || blocked(px, pz)) break;
    }
  }
  for (; k < NG; k++) { GP[k * 2] = (R() - .5) * PL * .94; GP[k * 2 + 1] = (R() - .5) * PL * .94; GT[k] = R() * Math.PI; }
  alignT = 0;
}
let alignT = 1, startA = null;
function layoutGrains(dt) {
  if (!grains.visible) return;
  if (alignT < 1) { if (!startA) startA = GA.slice(); alignT = Math.min(1, alignT + dt / 1.4); const e = smooth(0, 1, alignT);
    for (let k = 0; k < NG; k++) { let d = GT[k] - startA[k]; d = ((d + Math.PI / 2) % Math.PI + Math.PI) % Math.PI - Math.PI / 2; GA[k] = startA[k] + d * e; } if (alignT >= 1) startA = null; }
  const yy = S.src === 'bar' ? FY + .0003 : FY + .0003;
  for (let k = 0; k < NG; k++) { dO.position.set(GP[k * 2], yy, GP[k * 2 + 1]); dO.rotation.set(0, GA[k], 0); dO.scale.set(.5 + GJ[k * 2 + 1] * 1.1, 1, .8 + GJ[k * 2 + 1] * .6); dO.updateMatrix(); grains.setMatrixAt(k, dO.matrix); }
  grains.instanceMatrix.needsUpdate = true;
}

/* ---------- alan çizgileri ---------- */
const linesG = new THREE.Group(); scene.add(linesG);
const lineMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#4a9dff').multiplyScalar(2.4), toneMapped: false, transparent: true, opacity: .85 });
function buildLines() {
  linesG.traverse(o => { if (o.isMesh) o.geometry.dispose(); }); linesG.clear(); if (!S.lines || (!S.on && S.src !== 'bar')) return;
  const seeds = [];
  if (S.src === 'wire') for (const r of [.03, .055, .085, .12, .165]) seeds.push([r, 0]);
  else if (S.src === 'loop') for (const x of [-.12, -.095, -.052, -.034, -.016, 0, .016, .034, .052, .095, .12]) seeds.push([x, 0]);
  else if (S.src === 'sol') for (const z of [-.036, -.024, -.012, 0, .012, .024, .036]) seeds.push([0, z]);
  else for (const z of [-.011, -.006, 0, .006, .011]) seeds.push([0, z]);
  const coneG = new THREE.ConeGeometry(.0035, .01, 12); const ly = S.src === 'bar' ? FY + BAR.w / 2 : FY; const fb = (x, z) => { const b = fieldAt(x, ly, z); return [b[0], b[2]]; };
  for (const [sx, sz] of seeds) for (const sg of (S.src === 'wire' ? [1] : [1, -1])) {
    const pts = [new THREE.Vector3(sx, FY + .002, sz)]; let x = sx, z = sz;
    for (let s = 0; s < 600; s++) { let [bx, bz] = fb(x, z); let m = Math.hypot(bx, bz); if (m < 1e-12) break; const hx = x + bx / m * .0012 * sg, hz = z + bz / m * .0012 * sg; [bx, bz] = fb(hx, hz); m = Math.hypot(bx, bz); if (m < 1e-12) break; x += bx / m * .0024 * sg; z += bz / m * .0024 * sg; if (blocked(x, z)) break; if (s > 30 && Math.hypot(x - sx, z - sz) < .0025) { pts.push(pts[0].clone()); break; }
      if (Math.abs(x) > PL * .48 || Math.abs(z) > PL * .48) break; pts.push(new THREE.Vector3(x, FY + .002, z)); }
    if (pts.length < 4) continue;
    const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.min(400, pts.length * 2), .0011, 6), lineMat); linesG.add(m);
    for (const f of [.25, .6]) { const i = Math.floor(pts.length * f); if (i + 1 >= pts.length) continue; const a = pts[i], b = pts[i + 1]; const c = new THREE.Mesh(coneG, lineMat); c.position.copy(a); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).multiplyScalar(sg).normalize()); linesG.add(c); }
  }
}

/* ---------- pusulalar ---------- */
const faceTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f7f4ea'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 3;
  for (let d = 0; d < 360; d += 10) { const a = d * DEG, L = d % 90 === 0 ? 22 : 12; g.beginPath(); g.moveTo(128 + Math.cos(a) * 118, 128 + Math.sin(a) * 118); g.lineTo(128 + Math.cos(a) * (118 - L), 128 + Math.sin(a) * (118 - L)); g.stroke(); }
  g.fillStyle = '#b3261e'; g.font = '900 34px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('K', 128, 34); g.fillStyle = '#222'; g.fillText('G', 128, 222); g.fillText('D', 222, 128); g.fillText('B', 34, 128); });
function makeCompass(r) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.04, r * .35, 40), brass); base.position.y = r * .175; base.castShadow = true; g.add(base);
  const face = new THREE.Mesh(new THREE.CircleGeometry(r * .88, 40).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: faceTex, color: '#d9d3c2', roughness: .7 })); face.position.y = r * .36; face.rotation.y = 0; g.add(face);
  const needle = new THREE.Group(); needle.position.y = r * .5;
  for (const [sg, col] of [[1, '#e0231a'], [-1, '#262a31']]) { const sh = new THREE.Shape(); sh.moveTo(sg * r * .8, 0); sh.lineTo(0, r * .15); sh.lineTo(0, -r * .15); sh.closePath();
    const ng = new THREE.ExtrudeGeometry(sh, { depth: r * .07, bevelEnabled: true, bevelSize: r * .015, bevelThickness: r * .015, bevelSegments: 1 }); ng.rotateX(Math.PI / 2);
    const m = new THREE.Mesh(ng, new THREE.MeshStandardMaterial({ color: col, roughness: .35, metalness: sg > 0 ? .1 : .6 })); m.castShadow = true; needle.add(m); }
  g.add(needle);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(r * .07, r * .07, r * .08, 12), brass); pin.position.y = r * .5; g.add(pin);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(r * .9, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: .15, roughness: 0, envMapIntensity: 1.5, depthWrite: false })); dome.scale.y = .25; dome.position.y = r * .36; g.add(dome);
  const C = { g, needle, a: Math.random() * 6, w: 0, r }; scene.add(g); return C;
}
const compasses = [];
for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2 + .15; const c = makeCompass(.014); c.x = Math.cos(a) * .165; c.z = Math.sin(a) * .165; compasses.push(c); }
const big = makeCompass(.026); big.x = .095; big.z = .07; big.big = true; compasses.push(big);

/* ---------- akım yönü parçacıkları + sağ el kuralı ---------- */
const flowTex = canvasTex(64, 64, g => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, 'rgba(255,255,220,1)'); gr.addColorStop(.3, 'rgba(255,210,80,.9)'); gr.addColorStop(1, 'rgba(255,150,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
const flows = Array.from({ length: 72 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: flowTex, color: new THREE.Color(3, 2.3, 1.1), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); s.scale.setScalar(.008); scene.add(s); return { s, i, u: 0 }; });
let flowPh = 0;
function pathPoint(u) {
  u = ((u % 1) + 1) % 1;
  if (S.src === 'wire') return new THREE.Vector3(0, TY + .02 + u * .42, 0);
  if (S.src === 'loop') { const a = u * Math.PI * 2 - Math.PI / 2; return new THREE.Vector3(R_LOOP * Math.cos(a), PY + R_LOOP * Math.sin(a), 0); }
  if (S.src === 'sol' && solPath.length) { const f = u * (solPath.length - 1), i = Math.floor(f); return solPath[i].clone().lerp(solPath[Math.min(i + 1, solPath.length - 1)], f - i); }
  return new THREE.Vector3(0, -10, 0);
}
const hand = new THREE.Group(); scene.add(hand);
const handMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff9a3d').multiplyScalar(1.8), toneMapped: false, transparent: true, opacity: .9 });
{ const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.004, .004, .16, 16), handMat); shaft.position.y = .08; const head = new THREE.Mesh(new THREE.ConeGeometry(.011, .03, 20), handMat); head.position.y = .175; const thumb = new THREE.Group(); thumb.add(shaft, head); thumb.name = 'thumb'; hand.add(thumb);
  const arc = new THREE.Mesh(new THREE.TorusGeometry(.045, .0028, 10, 64, Math.PI * 1.6), handMat); arc.rotation.x = -Math.PI / 2; arc.name = 'arc'; hand.add(arc);
  const ah = new THREE.Mesh(new THREE.ConeGeometry(.008, .02, 16), handMat); ah.name = 'ah'; hand.add(ah); }

/* ---------- etkileşim ---------- */
let dragC = false; const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -FY);
W.pointerHook = (type, e) => {
  if (type === 'down') { const h = W.ray(e).intersectObject(big.g, true); if (!h.length) return false; dragC = true; $('aimhint').style.display = 'none'; W.orbit.auto = 0; return true; }
  if (type === 'move' && dragC) { const p = new THREE.Vector3(); if (W.ray(e).ray.intersectPlane(dragPlane, p)) { big.x = clamp(p.x, -PL / 2 + .03, PL / 2 - .03); big.z = clamp(p.z, -PL / 2 + .03, PL / 2 - .03); } }
  if (type === 'up') dragC = false;
};

/* ---------- arayüz ---------- */
const toastEl = $('toast'); let toastT = 0; const toast = m => { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 3400); };
function rebuild(sprinkleFirst) {
  Object.entries(srcG).forEach(([k, g]) => g.visible = k === S.src);
  if (S.src === 'sol') buildSolenoid();
  buildSegments(); buildGrid(); if (sprinkleFirst) sprinkle(); computeTargets(); buildLines(); layoutCables(); drawLCD();
  $('c-i').style.display = S.src === 'bar' ? 'none' : ''; $('c-n').style.display = S.src === 'sol' ? '' : 'none';
  $('btn-pow').style.display = $('btn-rev').style.display = S.src === 'bar' ? 'none' : '';
  const name = { wire: 'Düz tel', loop: 'Halka', sol: 'Bobin (selenoit)', bar: 'Çubuk mıknatıs' }[S.src];
  const sub = S.src === 'bar' ? 'N kutbu kırmızı uç' : !S.on ? 'Akım yok' : S.src === 'wire' ? (S.dir > 0 ? 'Akım yukarı doğru' : 'Akım aşağı doğru') : (S.dir > 0 ? 'Akım yönü: 1' : 'Akım yönü: 2 (ters)');
  $('h-mode').innerHTML = `${name}<small>${sub}</small>`;
}
document.querySelectorAll('#cards-src .a3c').forEach(b => b.onclick = () => { document.querySelectorAll('#cards-src .a3c').forEach(x => x.classList.toggle('on', x === b)); S.src = b.dataset.s; rebuild(true);
  if (S.src === 'sol') toast('Bobinin içinde tozlar düz çizgiler oluşturur: içerideki alan düzgündür.'); if (S.src === 'bar') toast('Bobinle çubuk mıknatısın alanını karşılaştır: çok benziyor!'); });
$('btn-pow').onclick = () => { S.on = !S.on; $('btn-pow').textContent = S.on ? '⏻ Akımı kes' : '⏻ Akımı aç'; if (!S.on) { sprinkle(); } rebuild(false); if (!S.on) { for (let k = 0; k < NG; k++) GT[k] = GA[k]; } };
$('btn-rev').onclick = () => { S.dir *= -1; rebuild(false); toast('Akım ters döndü: pusulalar da ters yönü gösterir. Tozların deseni aynı kalır (tozların yönü yoktur).'); };
$('btn-shake').onclick = () => { sprinkle(); computeTargets(); };
$('i-i').addEventListener('input', e => { S.I = +e.target.value; $('o-i').textContent = fmt(S.I, S.I % 1 ? 1 : 0) + ' A'; drawLCD(); clearTimeout(riT); riT = setTimeout(() => { buildSegments(); buildGrid(); buildLines(); }, 80); });
let riT = 0;
$('i-n').addEventListener('input', e => { S.N = +e.target.value; $('o-n').textContent = S.N; clearTimeout(riT); riT = setTimeout(() => rebuild(false), 150); });
const tg = (id, k, after) => $(id).addEventListener('click', e => { S[k] = !S[k]; e.currentTarget.classList.toggle('on', S[k]); after && after(); });
tg('tg-fil', 'fil', () => grains.visible = S.fil); tg('tg-comp', 'comp'); tg('tg-lines', 'lines', buildLines); tg('tg-flow', 'flow'); tg('tg-hand', 'hand'); tg('tg-earth', 'earth', () => toast(S.earth ? "Dünya'nın alanı (~30 µT) kuzeye doğru eklendi. Akımı kesince pusulalar kuzeyi gösterir." : "Dünya'nın alanı kaldırıldı."));
const segCam = $('seg-cam'); segCam.querySelectorAll('button').forEach(b => b.onclick = () => { segCam.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); S.cam = b.dataset.cam; setCam(); });
function setCam() { const o = W.orbit; o.auto = 0; if (S.cam === 'top') { o.target.set(0, FY, 0); o.r = .95; o.th = 0; o.ph = .02; } else { o.target.set(0, FY + .03, 0); o.r = 1.05; o.th = .45; o.ph = .92; } }
W.bindFullscreen($('btn-full'));

/* ---------- döngü ---------- */
let time = 0, lastUI = 0;
W.update = dt => {
  time += dt;
  layoutGrains(dt);
  // pusulalar
  const earth = S.earth ? 30e-6 : 0;
  compasses.forEach(c => { c.g.visible = S.comp || c.big; c.g.position.set(c.x, FY, c.z);
    const ys = S.src === 'bar' ? FY + BAR.w / 2 : FY + .01; let [bx, , bz] = fieldAt(c.x, ys, c.z); bz -= earth;
    if (Math.hypot(bx, bz) > 1e-9) { const tgt = Math.atan2(-bz, bx); let d = tgt - c.a; d = Math.atan2(Math.sin(d), Math.cos(d)); c.w += (d * 60 - c.w * 7) * dt; c.a += c.w * dt; }
    c.needle.rotation.y = c.a; c.B = Math.hypot(bx, bz); });
  // akım parçacıkları
  const flowOn = S.flow && S.on && S.src !== 'bar';
  const nF = S.src === 'wire' ? 16 : S.src === 'loop' ? 12 : 72; flowPh += dt * S.I / 10 * S.dir * (S.src === 'sol' ? .02 : .08);
  flows.forEach(f => { f.s.visible = flowOn && f.i < nF; if (!f.s.visible) return; f.u = f.i / nF + flowPh; const q = pathPoint(f.u); f.s.position.copy(q).addScaledVector(camera.position.clone().sub(q).normalize(), .007); });
  // sağ el kuralı
  hand.visible = S.hand && S.on && S.src !== 'bar';
  if (hand.visible) { const th = hand.getObjectByName('thumb'), arc = hand.getObjectByName('arc'), ah = hand.getObjectByName('ah');
    if (S.src === 'wire') { hand.scale.setScalar(1); hand.position.set(0, FY + .12, 0); hand.rotation.set(0, 0, S.dir > 0 ? 0 : Math.PI); th.visible = true; arc.visible = ah.visible = true;
      const a = Math.PI * 1.6; ah.position.set(.045 * Math.cos(a), 0, -.045 * Math.sin(a)); ah.rotation.set(0, 0, 0); ah.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-Math.sin(a), 0, -Math.cos(a))); }
    else { hand.position.set(0, PY, 0); hand.scale.setScalar(S.src === 'sol' ? 1.35 : 1); if (S.src === 'loop') hand.rotation.set(S.dir > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0); else hand.rotation.set(0, 0, S.dir > 0 ? -Math.PI / 2 : Math.PI / 2); arc.visible = ah.visible = th.visible = true; } }
  W.updateOrbit(dt, 5);
  if (time - lastUI > .12) { lastUI = time; ui(); }
};
function ui() {
  const B = big.B || 0, r = Math.hypot(big.x, big.z);
  const I = S.I, rows = [['|B| (hesaplanan)', fmt(B * 1e6, 1) + ' µT']];
  if (S.src === 'wire') rows.push(['Telden uzaklık r', fmt(r * 100, 1) + ' cm'], ['B = μ₀I / (2πr)', S.on ? fmt(MU0 * I / (2 * Math.PI * r) * 1e6, 1) + ' µT' : '0']);
  if (S.src === 'loop') rows.push(['Halka yarıçapı R', fmt(R_LOOP * 100, 0) + ' cm'], ['Merkezde B = μ₀I / 2R', S.on ? fmt(MU0 * I / (2 * R_LOOP) * 1e6, 1) + ' µT' : '0']);
  if (S.src === 'sol') rows.push(['Sarım N / uzunluk L', `${S.N} / ${fmt(SOL.L * 100, 0)} cm`], ['İçeride B ≈ μ₀NI / L', S.on ? fmt(MU0 * S.N * I / SOL.L * 1e6, 0) + ' µT' : '0']);
  if (S.earth) rows.push(["Dünya'nın alanı", '≈ 30 µT (kuzeye)']);
  $('vals').innerHTML = rows.map(q => `<tr><td>${q[0]}</td><td>${q[1]}</td></tr>`).join('');
  $('hud').innerHTML = S.src === 'bar' ? `<div class="a3p"><small>Kaynak</small><span>Mıknatıs</span></div><div class="a3p v"><small>Pusulada |B|</small><span>${fmt(B * 1e6, 0)} µT</span></div>`
    : `<div class="a3p"><small>Akım I</small><span>${S.on ? fmt(I, 1) + ' A' : 'Kapalı'}</span></div><div class="a3p v"><small>Pusulada |B|</small><span>${fmt(B * 1e6, 1)} µT</span></div>`;
  const cr = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize(); W.tag($('tag-c'), new THREE.Vector3(big.x, FY + .012, big.z).addScaledVector(cr, .05), `${fmt(B * 1e6, 1)} µT`);
  if (S.src === 'sol' || S.src === 'bar') { const L = S.src === 'sol' ? SOL.L : BAR.L; const nx = S.dir > 0 ? L / 2 + .025 : -L / 2 - .025;
    const tn = $('tag-n'), ts = $('tag-s'); tn.style.background = '#d8231c'; ts.style.background = '#2455ff'; tn.style.color = ts.style.color = '#fff';
    if (S.on || S.src === 'bar') { W.tag(tn, new THREE.Vector3(nx, PY + .06, 0), 'N'); W.tag(ts, new THREE.Vector3(-nx, PY + .06, 0), 'S'); } else { tn.style.display = ts.style.display = 'none'; } }
  else { $('tag-n').style.display = $('tag-s').style.display = 'none'; }
  if (S.src === 'wire' && S.on) W.tag($('tag-i'), new THREE.Vector3(0, TY + .47, 0), S.dir > 0 ? 'I ↑' : 'I ↓'); else $('tag-i').style.display = 'none';
}

/* ---------- başlat ---------- */
W.orbit.minR = .25; W.orbit.maxR = 3.5; W.orbit.minPh = .02;
sprinkle(); rebuild(false); setCam(); W.orbit.th = 1.4; W.orbit.r = 1.8; camera.position.copy(W.orbitPos()); W.orbit.look.copy(W.orbit.target);
setTimeout(() => { setCam(); W.orbit.auto = .03; }, 200);
W.loadEnv('lab').then(() => W.start());
window.__bfyLab = { W, S, rebuild, fieldAt, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) W.update(1 / 60); } };
