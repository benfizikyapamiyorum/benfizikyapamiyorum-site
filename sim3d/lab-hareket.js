// BFY · 3B Hareket Grafikleri — rampada oyuncak araba, hareket sensörü, canlı x-t / v-t / a-t
import { THREE, createWorld, worldUVMaterial, canvasTex, Arrow, $, clamp, lerp, fmt, DEG, isMobile } from './bfy3d-core.js?v=3';

const G = 9.8, TY = .76, LT = 3.1, X_MIN = .12, X_MAX = 2.9, TMAX = 12;
const XS = -1.5;                       // şerit sıfırının dünya x'i
const LANES = { A: .13, B: -.13 };     // z konumları (A önde)
const BASE = TY + .018;                // ray tabanının masadaki yüksekliği
const S = { run: false, t: 0, speed: 1, cam: 'side', vec: true, acc: true, strobe: false, area: false, sonar: true, sc: 'const', done: false, meetShown: false };
const CAR = {
  A: { on: true, x0: .3, v0: .35, a: 0, col: '#d2412f' },
  B: { on: false, x0: .3, v0: 0, a: .2, col: '#2d6fd2' },
};

/* ---------- dünya ---------- */
const stage = $('stage'), canvas = $('c3d');
const W = createWorld({ stage, canvas, fov: 34, near: .02, far: 400, shadowBox: 2.3, shadowFar: 10, bloom: [.22, .4, 1.4] });
const { scene, camera } = W;
const cT = { col: W.tex('tex/concrete_col.jpg'), nor: W.tex('tex/concrete_nor.jpg', false), arm: W.tex('tex/concrete_arm.jpg', false) };
const floorMat = worldUVMaterial({ map: cT.col, normalMap: cT.nor, roughnessMap: cT.arm, tile: 1.6, tint: '#6d8a86', normalScale: .6, envMapIntensity: .5 });
floorMat.transparent = true;
{ const ob = floorMat.onBeforeCompile; floorMat.onBeforeCompile = sh => { ob(sh); sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.a *= 1.0 - smoothstep(2.6, 5.5, length(vWPos.xz));'); }; }
const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 96).rotateX(-Math.PI / 2), floorMat); floor.receiveShadow = true; scene.add(floor);
W.gltf('models/WoodenTable_01/WoodenTable_01.gltf').then(o => { o.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; });
  for (const x of [-.9, .9]) { const t = x < 0 ? o : o.clone(); t.scale.set(1, TY / .549, 1.15); t.position.set(x, 0, 0); scene.add(t); } });

const alu = new THREE.MeshStandardMaterial({ color: '#c3c9d0', metalness: 1, roughness: .32 });
const darkAlu = new THREE.MeshStandardMaterial({ color: '#40454c', metalness: .8, roughness: .4 });
const rubber = new THREE.MeshStandardMaterial({ color: '#1b1b1d', roughness: .85 });
const redRub = new THREE.MeshStandardMaterial({ color: '#b3261e', roughness: .7 });
const woodTex = canvasTex(256, 64, (g, w, h) => { g.fillStyle = '#b8864f'; g.fillRect(0, 0, w, h); for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(90,52,20,${.08 + Math.random() * .16})`; g.lineWidth = 1 + Math.random() * 2; g.beginPath(); const y = Math.random() * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + (Math.random() - .5) * 10, w * .6, y + (Math.random() - .5) * 10, w, y + (Math.random() - .5) * 6); g.stroke(); } });
const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: .7 });

/* ---------- şerit metre dokusu (1 m / parça) ---------- */
function tapeTex(m) {
  return canvasTex(2048, 64, (g, w, h) => {
    g.fillStyle = '#f2c82f'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a';
    for (let c = 0; c <= 100; c++) { const x = c / 100 * w; const L = c % 10 === 0 ? 30 : c % 5 === 0 ? 20 : 11; g.fillRect(Math.min(w - 3, x), 0, c % 10 === 0 ? 3 : 2, L); }
    g.font = '800 24px Arial'; g.textBaseline = 'bottom';
    for (let c = 10; c < 100; c += 10) { g.textAlign = 'center'; g.fillText(String(m * 100 + c), c / 100 * w, h - 4); }
    g.fillStyle = '#c62b1f'; g.textAlign = 'left'; g.font = '900 26px Arial'; g.fillText(m + ' m', 8, h - 4);
  });
}
const tapeMats = [0, 1, 2, 3].map(m => new THREE.MeshStandardMaterial({ map: tapeTex(m), roughness: .55 }));

/* ---------- ray (şerit) ---------- */
const TW = .135, LIP = .012, LIPH = .02, TH = .01;
function buildLane(key) {
  const L = { key, g: new THREE.Group(), z: LANES[key] };
  L.g.position.set(XS, BASE, L.z); scene.add(L.g);
  // taban + dudaklar
  const base = new THREE.Mesh(new THREE.BoxGeometry(LT, TH, TW), alu); base.position.set(LT / 2 - .12, TH / 2, 0); base.castShadow = base.receiveShadow = true; L.g.add(base);
  for (const s of [-1, 1]) { const lip = new THREE.Mesh(new THREE.BoxGeometry(LT, LIPH, LIP), alu); lip.position.set(LT / 2 - .12, LIPH / 2, s * (TW / 2 - LIP / 2)); lip.castShadow = true; L.g.add(lip);
    const groove = new THREE.Mesh(new THREE.BoxGeometry(LT, .003, .004), darkAlu); groove.position.set(LT / 2 - .12, TH + .0012, s * .035); L.g.add(groove); }
  // şerit metre (ön dudak üstünde)
  for (let m = 0; m < 3; m++) { const len = m < 2 ? 1 : .98; const tp = new THREE.Mesh(new THREE.PlaneGeometry(len, LIP * .95).rotateX(-Math.PI / 2), tapeMats[m]); if (len < 1) { const uv = tp.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * len); }
    tp.position.set(m + len / 2, LIPH + .0006, TW / 2 - LIP / 2); tp.receiveShadow = true; L.g.add(tp); }
  // tamponlar
  for (const x of [-.02, X_MAX + .125]) { const b = new THREE.Mesh(new THREE.BoxGeometry(.03, .035, TW - 2 * LIP - .004), redRub); b.position.set(x, TH + .0175, 0); b.castShadow = true; L.g.add(b); }
  // ayaklar
  for (const x of [-.08, LT - .2]) { const f = new THREE.Mesh(new THREE.BoxGeometry(.05, .018, TW + .02), rubber); f.position.set(x, -.009, 0); f.castShadow = true; L.g.add(f); }
  // hareket sensörü
  const sen = new THREE.Group(); sen.position.set(-.1, TH, 0); L.g.add(sen);
  const box = new THREE.Mesh(new THREE.BoxGeometry(.05, .075, .085), new THREE.MeshStandardMaterial({ color: '#23272e', roughness: .45, metalness: .2 })); box.position.y = .0375 + .005; box.castShadow = true; sen.add(box);
  const grille = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .006, 40).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#c9a04e', metalness: 1, roughness: .35 })); grille.position.set(.026, .0425, 0); sen.add(grille);
  const led = new THREE.Mesh(new THREE.SphereGeometry(.0035, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#3dff6a').multiplyScalar(2), toneMapped: false })); led.position.set(.026, .073, .03); sen.add(led); L.led = led;
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(.06, .018), new THREE.MeshBasicMaterial({ map: canvasTex(256, 76, (g, w, h) => { g.fillStyle = '#23272e'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2c230'; g.font = '800 40px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SENSÖR ' + key, w / 2, h / 2 + 2); }) }));
  lab.position.set(0, .06, .0428); sen.add(lab);
  // fırlatıcı (yaylı piston)
  const ln = new THREE.Group(); L.g.add(ln); L.launcher = ln;
  L.lmats = [new THREE.MeshStandardMaterial({ color: '#2a2d33', roughness: .5, transparent: true }), alu.clone(), rubber.clone()]; L.lmats[1].transparent = L.lmats[2].transparent = true;
  const lb = new THREE.Mesh(new THREE.BoxGeometry(.05, .04, .1), L.lmats[0]); lb.position.y = TH + .02; lb.castShadow = true; ln.add(lb);
  const pis = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .05, 16).rotateZ(Math.PI / 2), L.lmats[1]); pis.position.set(.035, TH + .022, 0); ln.add(pis); L.piston = pis;
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(.014, .014, .006, 20).rotateZ(Math.PI / 2), L.lmats[2]); pad.position.set(.06, TH + .022, 0); ln.add(pad); L.pad = pad;
  // yükseltme takozları
  L.blocks = new THREE.Group(); scene.add(L.blocks);
  // ses dalgaları
  L.pulses = []; L.pulseT = 0;
  // hayalet (eşit zaman) kopyaları
  L.ghosts = new THREE.Group(); L.g.add(L.ghosts); L.ghostN = 0;
  // oklar
  L.arV = new Arrow(scene, '#3fbf5f'); L.arA = new Arrow(scene, '#ff9a3d');
  L.th = 0; L.x = CAR[key].x0; L.v = CAR[key].v0; L.stopT = null; L.dist = 0; L.hist = []; L.state = 'ready';
  return L;
}
const lanes = { A: buildLane('A'), B: buildLane('B') };

/* ---------- araba modeli ---------- */
const CS = 5.7, R_RAW = 26.5, WHEEL_R = R_RAW * 1e-4 * CS;
const carTpl = { ready: null };
const ghostGeo = fetch('sim3d/models/ToyCar/ghost.bin').then(r => r.arrayBuffer()).then(buf => { const dv = new DataView(buf); const nv = dv.getUint32(0, true), nf = dv.getUint32(4, true);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buf, 8, nv * 3), 3)); g.setIndex(new THREE.BufferAttribute(new Uint16Array(buf, 8 + nv * 12, nf * 3), 1)); g.computeVertexNormals(); return g; }).catch(() => null);
let ghostG = null; ghostGeo.then(g => ghostG = g);
Promise.all([W.gltf('models/ToyCar/car.glb'), fetch('sim3d/models/ToyCar/wheels_meta.json').then(r => r.json())]).then(([sc, meta]) => {
  let body = null, glass = null; sc.traverse(o => { if (o.isMesh && o.material.name === 'ToyCar') body = o; if (o.isMesh && o.material.name === 'Glass') glass = o; });
  carTpl.body = body; carTpl.glass = glass; carTpl.meta = meta;
  for (const k of ['A', 'B']) makeCar(lanes[k], k);
});

/* yeşil gövde boyasını seçerek başka renge çevir (alevler ve krom aynı kalır) */
function recolor(tex, hueTo) {
  const img = tex && tex.image; if (!img || !img.width) return null;
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height), a = d.data;
  for (let i = 0; i < a.length; i += 4) {
    const r = a[i] / 255, gg = a[i + 1] / 255, b = a[i + 2] / 255, mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), dl = mx - mn; if (dl < .06) continue;
    let h = mx === r ? ((gg - b) / dl) % 6 : mx === gg ? (b - r) / dl + 2 : (r - gg) / dl + 4; h *= 60; if (h < 0) h += 360;
    const w = clamp(1 - Math.abs(h - 125) / 55, 0, 1) * clamp((dl / mx - .15) / .2, 0, 1); if (w <= 0) continue;
    const sat = dl / mx, v = mx; let nh = hueTo; const sat2 = Math.min(1, sat * (hueTo < 30 ? 1.05 : 1));
    const f = (n) => { const k = (n + nh / 60) % 6; return v - v * sat2 * Math.max(0, Math.min(k, 4 - k, 1)); };
    const R = f(5), Gc = f(3), B = f(1);
    a[i] = (r + (R - r) * w) * 255; a[i + 1] = (gg + (Gc - gg) * w) * 255; a[i + 2] = (b + (B - b) * w) * 255;
  }
  g.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c); t.flipY = tex.flipY; t.colorSpace = tex.colorSpace; t.wrapS = tex.wrapS; t.wrapT = tex.wrapT; t.channel = tex.channel; t.anisotropy = 8; return t;
}
function makeCar(L, key) {
  const { body, glass, meta } = carTpl;
  const root = new THREE.Group(); root.rotation.y = Math.PI / 2; root.scale.setScalar(CS); root.position.set(L.x, TH - 9.6e-4 * CS, 0); L.g.add(root);
  const raw = new THREE.Group(); raw.quaternion.set(.7071068, 0, 0, .7071067); raw.scale.setScalar(1e-4); root.add(raw);
  const mat = body.material.clone(); const rt = recolor(body.material.map, key === 'A' ? 2 : 218); if (rt) mat.map = rt;
  const idx = body.geometry.index.array, geoFor = (a, b) => { const g = new THREE.BufferGeometry(); for (const n in body.geometry.attributes) g.setAttribute(n, body.geometry.attributes[n]); g.setIndex(new THREE.BufferAttribute(idx.subarray(a * 3, b * 3), 1)); g.boundingSphere = body.geometry.boundingSphere; return g; };
  let s = 0; const cnt = meta.groups;
  const bm = new THREE.Mesh(geoFor(0, cnt[0]), mat); bm.frustumCulled = false; bm.castShadow = true; bm.receiveShadow = true; raw.add(bm); s = cnt[0];
  L.wheels = [];
  for (let i = 0; i < 4; i++) { const c = meta.centers[i]; const piv = new THREE.Group(); piv.position.set(c[0], c[1], c[2]); raw.add(piv);
    const wm = new THREE.Mesh(geoFor(s, s + cnt[i + 1]), mat); wm.frustumCulled = false; wm.position.set(-c[0], -c[1], -c[2]); wm.castShadow = true; piv.add(wm); s += cnt[i + 1]; L.wheels.push(piv); }
  if (glass) { const gm = new THREE.Mesh(glass.geometry, glass.material); raw.add(gm); }
  // konum işaretçisi (şerit metreyi gösteren kırmızı ibre)
  const ptr = new THREE.Mesh(new THREE.BoxGeometry(.0035, .0015, .013), new THREE.MeshBasicMaterial({ color: new THREE.Color(key === 'A' ? '#ff3b2a' : '#3b8bff').multiplyScalar(1.6), toneMapped: false })); ptr.position.set(0, LIPH + .0015, TW / 2 - LIP / 2); L.ptr = ptr;
  L.car = root; L.carY = TH - 9.6e-4 * CS; L.g.add(ptr);
  L.ghostMat = new THREE.MeshStandardMaterial({ color: key === 'A' ? '#ff8a78' : '#8ab8ff', transparent: true, opacity: .26, roughness: .4, depthWrite: false });
  applyLane(L);
}

/* ---------- kinematik ---------- */
const xAt = (c, t) => c.x0 + c.v0 * t + .5 * c.a * t * t, vAt = (c, t) => c.v0 + c.a * t;
function hitTime(c) { // tampona çarpma ya da TMAX
  let T = TMAX; const roots = [];
  for (const X of [X_MIN, X_MAX]) { const A = .5 * c.a, B = c.v0, C = c.x0 - X;
    if (Math.abs(A) < 1e-9) { if (Math.abs(B) > 1e-9) roots.push(-C / B); }
    else { const D = B * B - 4 * A * C; if (D >= 0) { const q = Math.sqrt(D); roots.push((-B - q) / (2 * A), (-B + q) / (2 * A)); } } }
  for (const r of roots) if (r > 1e-6 && r < T) T = r; return T;
}
function tiltOf(c) { return Math.asin(clamp(c.a / G, -1, 1)); }
function applyLane(L) {
  const c = CAR[L.key]; const th = tiltOf(c); L.th = th;
  // a>0 → +x yönü yokuş aşağı → sıfır ucu yüksek. Alçak uçtaki ayak masaya değer.
  L.g.rotation.z = -th;
  const FA = -.08, FB = LT - .2, pLow = th > 0 ? FB : FA, pHigh = th > 0 ? FA : FB;
  L.g.position.set(XS, TY + pLow * Math.sin(th) + .018 * Math.cos(th), L.z);
  L.blocks.clear(); L.g.updateMatrixWorld(true);
  const w = L.g.localToWorld(new THREE.Vector3(pHigh, -.018, 0));
  const h = w.y - TY, n = Math.floor(h / .025 + 1e-6);
  for (let i = 0; i <= n; i++) { const hh = i < n ? .025 : h - n * .025; if (hh < .002) continue; const b = new THREE.Mesh(new THREE.BoxGeometry(.075, hh - .0008, .16), woodMat); b.position.set(w.x, TY + i * .025 + hh / 2, L.z + (i % 2 ? .004 : -.003)); b.rotation.y = (i % 2 ? .03 : -.02); b.castShadow = b.receiveShadow = true; L.blocks.add(b); }
  L.g.visible = L.blocks.visible = c.on;
  resetLane(L);
}
function resetLane(L) {
  const c = CAR[L.key]; L.x = c.x0; L.v = c.v0; L.stopT = null; L.dist = 0; L.hist.length = 0; L.state = 'ready'; L.Tend = hitTime(c);
  L.ghosts.clear(); L.ghostN = 0; L.pulses.forEach(p => L.g.remove(p.m)); L.pulses.length = 0;
  L.launcher.visible = Math.abs(c.v0) > 1e-6; placeLauncher(L, 0);
  if (L.car) placeCar(L);
}
function placeLauncher(L, ext) {
  const c = CAR[L.key]; const dir = c.v0 >= 0 ? 1 : -1; const half = .11;
  L.launcher.position.set(c.x0 - dir * (half + .085), 0, 0); L.launcher.rotation.y = dir > 0 ? 0 : Math.PI;
  L.piston.position.x = .035 + ext; L.pad.position.x = .06 + ext;
}
function placeCar(L) { L.car.position.x = L.x; L.ptr.position.x = L.x; const ang = (L.x - CAR[L.key].x0) / WHEEL_R; L.wheels.forEach(w => w.rotation.x = ang); }

/* ---------- ses dalgası ---------- */
const ringTex = canvasTex(128, 128, g => { g.strokeStyle = 'rgba(140,200,255,1)'; g.lineWidth = 7; g.beginPath(); g.arc(64, 64, 54, 0, 7); g.stroke(); });
const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, color: new THREE.Color(1.3, 1.6, 2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide });
const ringGeo = new THREE.PlaneGeometry(1, 1).rotateY(Math.PI / 2);
function stepPulses(L, dt) {
  if (S.sonar && S.run && L.state === 'run') { L.pulseT -= dt; if (L.pulseT <= 0) { L.pulseT = .12; const m = new THREE.Mesh(ringGeo, ringMat.clone()); m.position.set(-.07, TH + .0425, 0); L.g.add(m); L.pulses.push({ m, x: -.07 }); } }
  for (let i = L.pulses.length - 1; i >= 0; i--) { const p = L.pulses[i]; p.x += dt * 2.2; const back = L.x - .11; const k = (p.x + .07) / Math.max(.05, back + .07);
    p.m.position.x = p.x; const s = .03 + (p.x + .07) * .06; p.m.scale.set(1, s, s); p.m.material.opacity = clamp(1 - k, 0, 1) * .8;
    if (p.x > back) { L.g.remove(p.m); p.m.material.dispose(); L.pulses.splice(i, 1); } }
}

/* ---------- simülasyon ---------- */
const active = () => ['A', 'B'].filter(k => CAR[k].on);
function simTo(t) {
  for (const k of active()) { const L = lanes[k], c = CAR[k];
    if (L.state === 'stopped') continue;
    const te = Math.min(t, L.Tend); const xPrev = L.x;
    L.x = xAt(c, te); L.v = vAt(c, te); L.dist += Math.abs(L.x - xPrev);
    if (t >= L.Tend - 1e-9) { L.state = 'stopped'; L.stopT = L.Tend; if (L.Tend < TMAX - 1e-6) { toast(`${k} arabası ${L.x < 1 ? 'baştaki' : 'sondaki'} tampona ulaştı (t = ${fmt(L.Tend, 2)} s). Grafik burada biter.`); } L.v = vAt(c, L.Tend); }
    else L.state = 'run';
    if (L.car) placeCar(L);
  }
}
function record(t) { for (const k of active()) { const L = lanes[k], c = CAR[k]; const te = Math.min(t, L.Tend); const last = L.hist[L.hist.length - 1]; if (last && last.t >= te - 1e-9) continue; L.hist.push({ t: te, x: xAt(c, te), v: vAt(c, te), a: c.a }); } }
function strobe(t) {
  if (!ghostG) return; const dtS = .5;
  for (const k of active()) { const L = lanes[k]; const c = CAR[k]; while (L.ghostN * dtS <= Math.min(t, L.Tend) + 1e-9) { const tt = L.ghostN * dtS; const m = new THREE.Mesh(ghostG, L.ghostMat);
      m.quaternion.copy(L.car.quaternion).multiply(new THREE.Quaternion(.7071068, 0, 0, .7071067)); m.scale.setScalar(CS * 1e-4); m.position.set(xAt(c, tt), L.carY + .0005, 0); m.renderOrder = 5; L.ghosts.add(m); L.ghostN++; } L.ghosts.visible = S.strobe; }
}
function checkMeet(prevT, t) {
  if (!(CAR.A.on && CAR.B.on) || S.meetShown) return;
  const d0 = xAt(CAR.A, Math.min(prevT, lanes.A.Tend)) - xAt(CAR.B, Math.min(prevT, lanes.B.Tend)), d1 = lanes.A.x - lanes.B.x;
  if (prevT > 0 && d0 * d1 < 0) { // doğrusal ara değer ile buluşma anı
    let lo = prevT, hi = t; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; const dm = xAt(CAR.A, Math.min(m, lanes.A.Tend)) - xAt(CAR.B, Math.min(m, lanes.B.Tend)); if (dm * d0 > 0) lo = m; else hi = m; }
    S.meet = { t: (lo + hi) / 2, x: xAt(CAR.A, (lo + hi) / 2) }; S.meetShown = true; toast(`Yan yana geldiler! t = ${fmt(S.meet.t, 2)} s, x = ${fmt(S.meet.x, 2)} m. Grafikte x-t çizgilerinin kesiştiği yer.`);
  }
}
function allDone() { return active().every(k => lanes[k].state === 'stopped'); }

/* ---------- grafik ---------- */
const gc = $('graph'), gx = gc.getContext('2d');
function ranges() {
  let vm = .3, am = .3, T = 1;
  for (const k of active()) { const c = CAR[k], Te = lanes[k].Tend; T = Math.max(T, Te); for (let i = 0; i <= 40; i++) vm = Math.max(vm, Math.abs(vAt(c, Te * i / 40))); am = Math.max(am, Math.abs(c.a)); }
  const nice = v => { const s = [.25, .5, 1, 1.5, 2]; for (const q of s) if (v <= q) return q; return Math.ceil(v); };
  return { T: Math.ceil(T), vm: nice(vm * 1.1), am: nice(am * 1.25) };
}
const tf = v => (Math.abs(v) < 1e-9 ? '0' : (+v.toFixed(2)).toString().replace('.', ',').replace('-', '−'));
function drawGraph() {
  const DPR = Math.min(devicePixelRatio || 1, 2); const r = gc.getBoundingClientRect(), Wd = r.width, Hh = r.height; if (!Wd) return;
  if (gc.width !== Math.round(Wd * DPR) || gc.height !== Math.round(Hh * DPR)) { gc.width = Math.round(Wd * DPR); gc.height = Math.round(Hh * DPR); }
  gx.setTransform(DPR, 0, 0, DPR, 0, 0); gx.clearRect(0, 0, Wd, Hh);
  const R = ranges(); const Lm = 46, Rm = 44, gap = 22, Tm = 18, Bm = 6; const rowH = (Hh - Tm - Bm - gap * 2) / 3, pw = Wd - Lm - Rm;
  const X = t => Lm + t / R.T * pw;
  const rows = [{ key: 'x', lo: 0, hi: 3, lab: 'x (m)', dec: 1, step: 1 }, { key: 'v', lo: -R.vm, hi: R.vm, lab: 'v (m/s)', dec: R.vm < 1 ? 2 : 1 }, { key: 'a', lo: -R.am, hi: R.am, lab: 'a (m/s²)', dec: R.am < 1 ? 2 : 1 }];
  const font = w => `${w} 11px "Plus Jakarta Sans", sans-serif`;
  rows.forEach((row, ri) => {
    const top = Tm + ri * (rowH + gap), Y = v => top + (row.hi - v) / (row.hi - row.lo) * rowH;
    gx.strokeStyle = '#f0e8d6'; gx.lineWidth = 1; gx.fillStyle = '#8a8375'; gx.font = font(600); gx.textAlign = 'right'; gx.textBaseline = 'middle';
    const ticks = row.key === 'x' ? [0, 1, 2, 3] : [row.lo, row.lo / 2, 0, row.hi / 2, row.hi];
    for (const v of ticks) { gx.beginPath(); gx.moveTo(Lm, Y(v)); gx.lineTo(Lm + pw, Y(v)); gx.stroke(); gx.fillText(tf(v), Lm - 6, Y(v)); }
    const tStep = R.T > 8 ? 2 : 1; gx.textAlign = 'center'; gx.textBaseline = 'top';
    for (let s = 0; s <= R.T; s += tStep) { gx.beginPath(); gx.moveTo(X(s), top); gx.lineTo(X(s), top + rowH); gx.stroke(); }
    // alan
    if (S.area && row.key !== 'x') for (const k of active()) { const H = lanes[k].hist; if (H.length < 2) continue; gx.fillStyle = k === 'A' ? 'rgba(210,65,47,.18)' : 'rgba(45,111,210,.18)'; gx.beginPath(); gx.moveTo(X(H[0].t), Y(0)); for (const p of H) gx.lineTo(X(p.t), Y(p[row.key])); gx.lineTo(X(H[H.length - 1].t), Y(0)); gx.closePath(); gx.fill(); }
    // eksenler
    const y0 = Y(Math.max(row.lo, 0)); gx.strokeStyle = '#0e0c08'; gx.lineWidth = 1.5; gx.beginPath(); gx.moveTo(Lm, top - 4); gx.lineTo(Lm, top + rowH); gx.moveTo(Lm, y0); gx.lineTo(Lm + pw + 6, y0); gx.stroke();
    gx.fillStyle = '#0e0c08'; gx.beginPath(); gx.moveTo(Lm + pw + 10, y0); gx.lineTo(Lm + pw + 3, y0 - 4); gx.lineTo(Lm + pw + 3, y0 + 4); gx.fill();
    gx.font = font(800); gx.textAlign = 'left'; gx.textBaseline = 'middle'; gx.fillText('t (s)', Lm + pw + 13, y0);
    gx.textBaseline = 'bottom'; gx.fillText(row.lab, Lm + 6, top - 2);
    // zaman değerleri (yalnızca en alt satırda, ekseni kalabalıklaştırmadan)
    if (ri === 2) { gx.font = font(600); gx.fillStyle = '#8a8375'; gx.textAlign = 'center'; gx.textBaseline = 'top'; for (let s = tStep; s <= R.T; s += tStep) gx.fillText(s, X(s), y0 + 4); }
    // çizgiler
    for (const k of active()) { const H = lanes[k].hist; if (!H.length) continue; gx.strokeStyle = k === 'A' ? '#d2412f' : '#2d6fd2'; gx.lineWidth = 2.6; gx.lineJoin = 'round'; gx.beginPath(); H.forEach((p, i) => i ? gx.lineTo(X(p.t), Y(p[row.key])) : gx.moveTo(X(p.t), Y(p[row.key]))); gx.stroke();
      const p = H[H.length - 1]; gx.fillStyle = gx.strokeStyle; gx.beginPath(); gx.arc(X(p.t), Y(p[row.key]), 3.6, 0, 7); gx.fill(); }
    if (S.meet && row.key === 'x') { gx.strokeStyle = '#c79a12'; gx.lineWidth = 2; gx.beginPath(); gx.arc(X(S.meet.t), Y(S.meet.x), 7, 0, 7); gx.stroke(); }
    // imleç
    if (S.t > 0) { gx.strokeStyle = 'rgba(226,64,48,.55)'; gx.lineWidth = 1.2; gx.setLineDash([4, 3]); gx.beginPath(); gx.moveTo(X(Math.min(S.t, R.T)), top); gx.lineTo(X(Math.min(S.t, R.T)), top + rowH); gx.stroke(); gx.setLineDash([]); }
  });
}

/* ---------- arayüz ---------- */
const toastEl = $('toast'); let toastT = 0; function toast(m, ms = 4200) { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), ms); }
const SC = {
  const: { name: 'Sabit hız', sub: 'Düz ray, a = 0', A: { x0: .3, v0: .35, a: 0 }, B: null },
  acc: { name: 'Hızlanan', sub: 'Ray eğik, a > 0', A: { x0: .3, v0: .1, a: .25 }, B: null },
  back: { name: 'Yavaşlayıp geri dönen', sub: 'Ray ters eğik, a < 0', A: { x0: .35, v0: 1, a: -.35 }, B: null },
  race: { name: 'Yarış', sub: 'A sabit hızlı, B duruştan hızlanıyor', A: { x0: .3, v0: .5, a: 0 }, B: { x0: .3, v0: 0, a: .2 } },
};
function syncUI() {
  for (const k of ['A', 'B']) { const c = CAR[k], l = k.toLowerCase();
    $('i-x' + l).value = c.x0; $('i-v' + l).value = c.v0; $('i-a' + l).value = c.a;
    $('o-x' + l).textContent = fmt(c.x0, 2) + ' m'; $('o-v' + l).textContent = fmt(c.v0, 2) + ' m/s'; $('o-a' + l).textContent = fmt(c.a, 2) + ' m/s²';
    const th = tiltOf(c) / DEG; $('n-' + l).innerHTML = Math.abs(c.a) < 1e-6 ? 'Ray düz: ivme sıfır.' : `Ray ${fmt(Math.abs(th), 1)}° eğik (a = g·sinθ). ${c.a > 0 ? 'Başlangıç ucu yüksek.' : 'Bitiş ucu yüksek.'}`; }
  $('box-b').classList.toggle('off', !CAR.B.on); $('tg-b').classList.toggle('on', CAR.B.on); $('tg-b').textContent = CAR.B.on ? 'Açık' : 'Kapalı';
}
function setScenario(k) {
  S.sc = k; const s = SC[k]; Object.assign(CAR.A, s.A); CAR.B.on = !!s.B; if (s.B) Object.assign(CAR.B, s.B);
  $('h-mode').innerHTML = `${s.name}<small>${s.sub}</small>`; syncUI(); resetAll();
  if (k === 'race') toast('Tahmin et: B arabası A\'yı nerede yakalar? Sonra ▶ Başlat.');
  if (k === 'back') toast('Araba yokuş yukarı fırlatılıyor: yavaşlar, durur ve geri döner. v-t grafiği sıfırı keserken x-t tepe yapar.');
}
function resetAll() { S.run = false; S.t = 0; S.meet = null; S.meetShown = false; S.done = false; for (const k of ['A', 'B']) applyLane(lanes[k]); record(0); $('btn-go').textContent = '▶ Başlat'; setCam(); }
function go() { if (S.done) { resetAll(); } if (S.run) { S.run = false; $('btn-go').textContent = '▶ Devam'; return; } S.run = true; $('btn-go').textContent = '⏸ Durdur'; $('aimhint').style.display = 'none'; if (S.t === 0) S.kick = 0; }
$('btn-go').onclick = go; $('btn-reset').onclick = resetAll;
$('btn-step').onclick = () => { if (S.done) return; S.run = false; $('btn-go').textContent = S.t > 0 ? '▶ Devam' : '▶ Başlat'; advanceSim(.25); };
document.querySelectorAll('#cards-sc .a3c').forEach(b => b.onclick = () => { document.querySelectorAll('#cards-sc .a3c').forEach(x => x.classList.toggle('on', x === b)); setScenario(b.dataset.sc); });
for (const k of ['A', 'B']) { const l = k.toLowerCase();
  for (const [p, key] of [['x', 'x0'], ['v', 'v0'], ['a', 'a']]) $('i-' + p + l).addEventListener('input', e => { CAR[k][key] = +e.target.value; document.querySelectorAll('#cards-sc .a3c').forEach(x => x.classList.remove('on')); $('h-mode').innerHTML = `Kendi ayarın<small>A${CAR.B.on ? ' ve B' : ''} için değerleri sen seçtin</small>`; syncUI(); resetAll(); }); }
$('tg-b').onclick = () => { CAR.B.on = !CAR.B.on; syncUI(); resetAll(); };
const tg = (id, k, after) => $(id).addEventListener('click', e => { S[k] = !S[k]; e.currentTarget.classList.toggle('on', S[k]); after && after(); });
tg('tg-v', 'vec'); tg('tg-a', 'acc'); tg('tg-strobe', 'strobe', () => { for (const k of ['A', 'B']) lanes[k].ghosts.visible = S.strobe; if (S.strobe) toast('Her 0,5 saniyede bir fotoğraf: aralıklar eşitse hız sabittir, açılıyorsa araba hızlanıyordur.'); });
tg('tg-area', 'area', () => S.area && toast('v-t altındaki boyalı alan = yer değiştirme (Δx). a-t altındaki alan = hız değişimi (Δv).')); tg('tg-sonar', 'sonar');
const segs = (id, fn) => { const el = $(id); el.querySelectorAll('button').forEach(b => b.onclick = () => { el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); fn(b); }); };
segs('seg-cam', b => { S.cam = b.dataset.cam; setCam(); }); segs('seg-speed', b => S.speed = +b.dataset.s);
function setCam() { const o = W.orbit; if (S.cam === 'orbit') { o.auto = 0; o.target.set(0, TY + .08, 0); o.r = 3.3; o.th = .55; o.ph = 1.12; } }
W.bindFullscreen($('btn-full'));

/* ---------- döngü ---------- */
function advanceSim(dt) {
  if (!active().length) return; const prev = S.t; S.t = Math.min(S.t + dt, TMAX);
  // kayıt için ara adımlar
  const n = Math.max(1, Math.ceil(dt / (1 / 60))); for (let i = 1; i <= n; i++) { const t = prev + (S.t - prev) * i / n; simTo(t); record(t); }
  checkMeet(prev, S.t); strobe(S.t);
  if (allDone() || S.t >= TMAX) { S.run = false; S.done = true; $('btn-go').textContent = '↺ Tekrar'; }
}
let lastUI = 0, time = 0;
W.update = dt => {
  time += dt;
  if (S.run) { S.kick = (S.kick || 0) + dt; advanceSim(dt * S.speed); }
  for (const k of ['A', 'B']) { const L = lanes[k], c = CAR[k]; if (!c.on || !L.car) continue;
    // fırlatıcı pistonu
    const ext = S.t > 0 ? clamp((S.kick || 0) / .06, 0, 1) * .03 : 0; placeLauncher(L, ext);
    const fade = S.t > 0 ? clamp(1 - ((S.kick || 0) - .35) / .4, 0, 1) : 1; L.lmats.forEach(m => { m.opacity = fade; m.depthWrite = fade > .99; }); L.launcher.visible = Math.abs(c.v0) > 1e-6 && fade > .01;
    stepPulses(L, dt);
    L.led.material.color.setRGB(...(S.run && L.state === 'run' && (time * 8 % 1) < .5 ? [3.5, .4, .3] : [.2, 2.4, .5]));
    // oklar (dünya uzayında, arabanın üstünde)
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(L.g.quaternion), fw = new THREE.Vector3(1, 0, 0).applyQuaternion(L.g.quaternion);
    const top = L.g.localToWorld(new THREE.Vector3(L.x, L.carY + .085, 0));
    if (S.vec && Math.abs(L.v) > .02) L.arV.set(top, fw.clone().multiplyScalar(L.v * .32), .0045); else L.arV.hide();
    if (S.acc && Math.abs(c.a) > .01) L.arA.set(top.clone().addScaledVector(up, .045), fw.clone().multiplyScalar(c.a * .45), .0045); else L.arA.hide();
  }
  cameraDirector(dt);
  W.updateOrbit(dt, S.cam === 'orbit' ? 5 : 3);
  if (time - lastUI > .08) { lastUI = time; ui(); drawGraph(); }
};
function cameraDirector() {
  if (S.cam === 'orbit') return; const o = W.orbit; o.auto = 0;
  const k = CAR.A.on ? 'A' : 'B'; const L = lanes[k]; const both = CAR.A.on && CAR.B.on;
  const p = L.g.localToWorld(new THREE.Vector3(L.x, L.carY, 0));
  if (S.cam === 'side') { let cx = p.x; if (both) cx = (p.x + lanes.B.g.localToWorld(new THREE.Vector3(lanes.B.x, 0, 0)).x) / 2; o.target.set(lerp(o.target.x, cx + (both ? 0 : .28), .08), TY + .03, 0); o.r = (isMobile ? 1.3 : 1) * (both ? 1.15 : .82); o.th = .18; o.ph = 1.1; }
  else { const dir = Math.sign(L.v || CAR[k].v0 || 1); o.target.set(p.x + dir * .6, p.y + .05, L.z); o.r = .55; o.th = dir > 0 ? -1.35 : 1.35; o.ph = 1.28; }
}
function ui() {
  const k = CAR.A.on ? 'A' : 'B'; const L = lanes[k], c = CAR[k];
  $('h-t').textContent = fmt(S.t, 2) + ' s';
  $('hud').innerHTML = `<div class="a3p"><small>Konum x</small><span>${fmt(L.x, 2)} m</span></div><div class="a3p v"><small>Hız v</small><span>${fmt(L.v, 2)} m/s</span></div><div class="a3p"><small>İvme a</small><span>${fmt(c.a, 2)} m/s²</span></div>`;
  const row = (n, f) => `<tr><td>${n}</td>${active().map(k => `<td class="c${k}">${f(k)}</td>`).join('')}</tr>`;
  const Dx = k => lanes[k].x - CAR[k].x0;
  $('vals').innerHTML = `<tr><th></th>${active().map(k => `<th class="c${k}">${k}</th>`).join('')}</tr>` +
    row('Konum x', k => fmt(lanes[k].x, 2) + ' m') + row('Hız v', k => fmt(lanes[k].v, 2) + ' m/s') + row('İvme a', k => fmt(CAR[k].a, 2) + ' m/s²') +
    row('Yer değiştirme Δx', k => fmt(Dx(k), 2) + ' m') + row('Alınan yol', k => fmt(lanes[k].dist, 2) + ' m') + row('Rampa açısı', k => fmt(Math.abs(tiltOf(CAR[k]) / DEG), 1) + '°');
  for (const kk of ['A', 'B']) { const el = $('tag-' + kk.toLowerCase()), LL = lanes[kk];
    if (!CAR[kk].on || !LL.car) { el.style.display = 'none'; continue; }
    const p = kk === 'A' ? LL.g.localToWorld(new THREE.Vector3(LL.x - .02, -.02, TW / 2 + .012)) : LL.g.localToWorld(new THREE.Vector3(LL.x + .07, LL.carY + .16, 0)); W.tag(el, p, `${kk} · ${fmt(LL.v, 2)} m/s`); }
  if (S.meet) { const p = lanes.A.g.localToWorld(new THREE.Vector3(S.meet.x + .12, -.02, TW / 2 + .01)); W.tag($('tag-m'), p, `Buluşma: ${fmt(S.meet.t, 1)} s`); } else $('tag-m').style.display = 'none';
}

/* ---------- başlat ---------- */
W.orbit.minR = .3; W.orbit.maxR = 6; W.orbit.maxPh = 1.5;
syncUI(); resetAll(); W.orbit.target.set(-.6, TY + .1, 0); W.orbit.r = 2.6; W.orbit.th = .7; W.orbit.ph = 1.05; camera.position.copy(W.orbitPos()); W.orbit.look.copy(W.orbit.target);
W.loadEnv('lab').then(() => W.start());
window.__bfyLab = { W, S, CAR, lanes, setScenario, resetAll, go, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) W.update(1 / 60); } };
