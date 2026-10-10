// BFY · Devre Ustası — 3B görüntü katmanı (laboratuvar masasında gerçek devre)
import { THREE, worldUVMaterial, canvasTex, clamp, lerp, rng, isMobile } from '../sim3d/bfy3d-core.js?v=5';
import { overlayWorld } from './ortak.js?v=2';

const G = window.BFY_GAME; if (!G) throw new Error('oyun yok');
const K = .0022, TY = .76, BY = TY + .012;            // 1 px = 2,2 mm; tahta yüzeyi
const cx = (G.A.x + G.B.x) / 2, cz = (G.A.y + G.D.y) / 2;
const toP = (x, y, h = 0) => new THREE.Vector3((x - cx) * K, BY + h, (y - cz) * K);
const { W, O } = overlayWorld(G, { fov: 34, near: .02, far: 60, shadowBox: 1.2, shadowFar: 8, bloom: [.28, .4, 1.0] });
const { scene, camera, sun } = W;
// Önceden derleme son işleme hedefine göre yapılmalı (ekrana göre derlenen ton eşlemeli çeşit oyunda kullanılmaz)
const prewarm = objs => { if (!W.prewarm) return Promise.resolve(); W.renderer.setRenderTarget(W.composer.renderTarget1); return W.prewarm(objs); };
sun.castShadow = true;

/* ---------- masa, zemin ---------- */
const cT = { col: W.tex('tex/concrete_col.jpg'), nor: W.tex('tex/concrete_nor.jpg', false), arm: W.tex('tex/concrete_arm.jpg', false) };
const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 64).rotateX(-Math.PI / 2), worldUVMaterial({ map: cT.col, normalMap: cT.nor, roughnessMap: cT.arm, tile: 1.6, tint: '#6d8a86', normalScale: .6, envMapIntensity: .5 })); floor.receiveShadow = true; scene.add(floor);
W.gltf('models/WoodenTable_01/WoodenTable_01.gltf').then(o => { o.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; }); o.scale.set(1, TY / .549, 1.3); scene.add(o); });
// devre tahtası (kontrplak)
const plyTex = canvasTex(1024, 640, (g, w, h) => { g.fillStyle = '#d8b98a'; g.fillRect(0, 0, w, h); const R = rng(3);
  for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(140,95,50,${.05 + R() * .12})`; g.lineWidth = 1 + R() * 3; g.beginPath(); const y = R() * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + (R() - .5) * 30, w * .6, y + (R() - .5) * 30, w, y + (R() - .5) * 20); g.stroke(); }
  g.fillStyle = 'rgba(60,40,20,.55)'; g.font = '800 30px Arial'; g.fillText('BFY · DEVRE TAHTASI', 36, h - 34); });
const board = new THREE.Mesh(new THREE.BoxGeometry(1.08, .024, .74), [0, 0, 0, 0, 0, 0].map((_, i) => i === 2 ? new THREE.MeshStandardMaterial({ map: plyTex, roughness: .75 }) : new THREE.MeshStandardMaterial({ color: '#b89464', roughness: .8 })));
board.position.set(0, TY + .0, 0); board.receiveShadow = board.castShadow = true; scene.add(board);

/* ---------- bakır tel ---------- */
const copper = new THREE.MeshStandardMaterial({ color: '#c8773f', metalness: 1, roughness: .28 });
const insul = new THREE.MeshStandardMaterial({ color: '#b3261e', roughness: .5 });
const corners = [G.A, G.B, G.C, G.D, G.A].map(p => toP(p.x, p.y, .012));
for (let i = 0; i < 4; i++) { const a = corners[i], b = corners[i + 1]; const m = new THREE.Mesh(new THREE.CylinderGeometry(.0042, .0042, 1, 12), i % 2 ? insul : insul); W.orient(m, a, b); m.castShadow = true; scene.add(m);
  const j = new THREE.Mesh(new THREE.SphereGeometry(.009, 14, 10), copper); j.position.copy(a); scene.add(j); }
// akım noktaları (parlayan)
const NDOT = 60, dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 2.6, 3.2), toneMapped: false });
const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(.0052, 10, 8), dotMat, NDOT); dots.frustumCulled = false; scene.add(dots);
const dO = new THREE.Object3D();

/* ---------- güç kaynağı (sol) ---------- */
const lcdC = document.createElement('canvas'); lcdC.width = 256; lcdC.height = 100; const lcdT = new THREE.CanvasTexture(lcdC); lcdT.colorSpace = THREE.SRGBColorSpace;
const black = new THREE.MeshStandardMaterial({ color: '#1b1c1f', roughness: .5, metalness: .3 }), chrome = new THREE.MeshStandardMaterial({ color: '#dfe3e8', metalness: 1, roughness: .15 });
const psu = new THREE.Group(); psu.position.copy(toP(G.battP.x, G.battP.y)); psu.position.x -= .075; scene.add(psu);
{ const body = new THREE.Mesh(new THREE.BoxGeometry(.13, .09, .2), [black, black, black, black, black, black]); body.position.y = .045; body.castShadow = true; psu.add(body);
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(.09, .035), new THREE.MeshBasicMaterial({ map: lcdT, toneMapped: false })); lcd.position.set(0, .058, .1005); psu.add(lcd);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(.013, .013, .014, 24).rotateZ(Math.PI / 2), chrome); knob.rotation.set(0, Math.PI / 2, 0); knob.position.set(.035, .026, .104); psu.add(knob); psu.userData.knob = knob;
  for (const [z, c] of [[-.04, '#d8231c'], [.04, '#161616']]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .02, 16), new THREE.MeshStandardMaterial({ color: c, roughness: .4 })); t.position.set(.03, .1, z); psu.add(t); }
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(.11, .022), new THREE.MeshBasicMaterial({ map: canvasTex(256, 52, (g, w, h) => { g.fillStyle = '#1b1c1f'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2c230'; g.font = '800 30px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GÜÇ KAYNAĞI', w / 2, h / 2 + 2); }) })); lab.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); lab.position.set(-.02, .0905, 0); psu.add(lab); }
function drawLCD(v) { const g = lcdC.getContext('2d'); g.fillStyle = '#071207'; g.fillRect(0, 0, 256, 100); g.fillStyle = '#5dff8a'; g.font = '700 64px ui-monospace,Menlo,monospace'; g.textAlign = 'right'; g.fillText(v.toFixed(1), 196, 74); g.font = '700 30px Arial'; g.fillText('V', 240, 74); lcdT.needsUpdate = true; }

/* ---------- direnç (üst): renk halkalı seramik ---------- */
const resG = new THREE.Group(); resG.position.copy(toP(G.resP.x, G.resP.y, .03)); scene.add(resG);
const resBody = new THREE.Mesh(new THREE.CapsuleGeometry(.018, .09, 8, 24).rotateZ(Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: '#d9c49a', roughness: .5, clearcoat: .4 })); resBody.castShadow = true; resG.add(resBody);
const bandMats = [0, 1, 2, 3].map(() => new THREE.MeshStandardMaterial({ roughness: .5 }));
[-.034, -.016, .002, .03].forEach((x, i) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(.0188, .0188, .007, 24).rotateZ(Math.PI / 2), bandMats[i]); b.position.x = x; resG.add(b); });
for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.0018, .0018, .05, 8), chrome); W.orient(leg, new THREE.Vector3(s * .06, 0, 0), new THREE.Vector3(s * .075, -.018, 0)); resG.add(leg); }
const RC = ['#111', '#6b3b1a', '#d8231c', '#ff8c1a', '#f2d21e', '#2f9a4c', '#2d6fd2', '#8b3fd9', '#8a8a8a', '#f4f4f4'];
function setBands(R) { const d = String(R).padStart(2, '0'); const a = +d[0], b = +d[d.length - 1]; const digits = R >= 10 ? [a, +String(R)[1], 0] : [R, 0, 9]; // R<10: R·0 × 0,1
  const cols = R >= 10 ? [RC[+String(R)[0]], RC[+String(R)[1]], RC[0], '#c9a04e'] : [RC[R], RC[0], '#c9a04e', '#c9a04e']; bandMats.forEach((m, i) => m.color.set(cols[i])); }

/* ---------- ampul (sağ) ---------- */
const bulbG = new THREE.Group(); bulbG.position.copy(toP(G.bulbP.x, G.bulbP.y)); bulbG.scale.setScalar(1.55); scene.add(bulbG);
{ const sock = new THREE.Mesh(new THREE.CylinderGeometry(.026, .03, .03, 28), black); sock.position.y = .015; bulbG.add(sock);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.017, .015, .028, 24), new THREE.MeshStandardMaterial({ color: '#b8bcc2', metalness: 1, roughness: .3 })); base.position.y = .042; bulbG.add(base);
  for (let i = 0; i < 4; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.0172, .0016, 6, 24).rotateX(Math.PI / 2), chrome); r.position.y = .033 + i * .006; bulbG.add(r); } }
const glassPts = []; for (let i = 0; i <= 30; i++) { const t = i / 30, y = t * .085; const r = t < .25 ? .015 + t / .25 * .012 : .027 + Math.sin((t - .25) / .75 * Math.PI) * .012 - (t > .85 ? (t - .85) / .15 * .02 : 0); glassPts.push(new THREE.Vector2(Math.max(.001, r), y)); }
const glassM = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .02, transmission: 1, thickness: .002, ior: 1.5, transparent: true, opacity: .5, envMapIntensity: 1.4, depthWrite: false });
const glass = new THREE.Mesh(new THREE.LatheGeometry(glassPts, 40), glassM); glass.position.y = .056; bulbG.add(glass);
const filM = new THREE.MeshBasicMaterial({ color: new THREE.Color(.05, .03, .02), toneMapped: false });
{ const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push(new THREE.Vector3(-.009 + t * .018, .105 + Math.sin(t * Math.PI * 7) * .0022, Math.cos(t * Math.PI * 7) * .0022)); }
  const fil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, .0007, 5), filM); bulbG.add(fil);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(.0006, .0006, 1, 5), new THREE.MeshStandardMaterial({ color: '#888', metalness: 1 })); W.orient(w, new THREE.Vector3(s * .004, .06, 0), new THREE.Vector3(s * .009, .105, 0)); bulbG.add(w); } }
const glowSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(128, 128, g => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(.25, 'rgba(255,200,120,.55)'); gr.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
glowSpr.position.y = .105; bulbG.add(glowSpr);
const bulbLight = new THREE.PointLight('#ffcf8a', 0, 2.2, 1.7); bulbLight.position.y = .105; bulbLight.castShadow = !isMobile; bulbLight.shadow.mapSize.set(512, 512); bulbLight.shadow.bias = -.002; bulbG.add(bulbLight);
bulbLight.shadow.autoUpdate = false;   // küp gölge (6 çizim) yalnız ampul yanarken güncellenir
// cam kırıkları: tek geometri, havuzlu meshler
const shardG = new THREE.PlaneGeometry(.008, .006), shards = [], shardPool = [];

/* ---------- ampermetre (alt) ---------- */
const amTex = document.createElement('canvas'); amTex.width = 256; amTex.height = 256; const amT = new THREE.CanvasTexture(amTex); amT.colorSpace = THREE.SRGBColorSpace;
let amMax = 5;
function drawDial(max) { const g = amTex.getContext('2d'); g.fillStyle = '#f5f1e6'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#222'; g.fillStyle = '#222'; g.lineWidth = 2; g.textAlign = 'center';
  for (let i = 0; i <= 50; i++) { const a = Math.PI * (1.15 - i / 50 * 1.3), L = i % 10 === 0 ? 22 : i % 5 === 0 ? 15 : 9; g.beginPath(); g.moveTo(128 + Math.cos(a) * 110, 200 - Math.sin(a) * 110); g.lineTo(128 + Math.cos(a) * (110 - L), 200 - Math.sin(a) * (110 - L)); g.stroke();
    if (i % 10 === 0) { g.font = '700 18px Arial'; g.fillText(String(Math.round(max * i / 50 * 10) / 10).replace('.', ','), 128 + Math.cos(a) * 76, 206 - Math.sin(a) * 76); } }
  g.fillStyle = '#b3261e'; g.font = '900 40px Arial'; g.fillText('A', 128, 170); amT.needsUpdate = true; }
const amG = new THREE.Group(); amG.position.copy(toP((G.C.x + G.D.x) / 2, G.C.y)); amG.position.z += .002; amG.scale.setScalar(1.25); scene.add(amG);
{ const box = new THREE.Mesh(new THREE.BoxGeometry(.13, .045, .1), black); box.position.y = .0225; box.castShadow = true; amG.add(box);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(.11, .085), new THREE.MeshStandardMaterial({ map: amT, roughness: .5 })); face.rotation.x = -Math.PI / 2; face.position.y = .0455; amG.add(face);
  const cover = new THREE.Mesh(new THREE.PlaneGeometry(.11, .085), new THREE.MeshPhysicalMaterial({ color: '#fff', roughness: .02, transparent: true, opacity: .12, envMapIntensity: 1.5 })); cover.rotation.x = -Math.PI / 2; cover.position.y = .047; amG.add(cover); }
const needle = new THREE.Mesh(new THREE.BoxGeometry(.001, .0008, .05).translate(0, 0, -.025), new THREE.MeshStandardMaterial({ color: '#c62b1f' })); needle.position.set(0, .0462, .0265); amG.add(needle);
let needleA = 0, needleW = 0;

/* ---------- kamera ---------- */
function fit() { const d = (isMobile ? 1.75 : 1.55) * Math.max(1, 1.42 / camera.aspect); camera.position.set(0, TY + d * .8, d * .62); camera.lookAt(0, TY - .01, .03); }

/* ---------- olaylar ---------- */
let shake = 0;
G.on = t => {
  const bp = bulbG.position.clone().add(new THREE.Vector3(0, .16, 0));
  if (t === 'burn') { shake = .012; glass.visible = false; for (let i = 0; i < 30; i++) { let s = shardPool.pop(); if (!s) { s = { m: new THREE.Mesh(shardG, glassM), v: new THREE.Vector3(), w: new THREE.Vector3(), t: 0 }; scene.add(s.m); }
      s.m.visible = true; s.m.position.copy(bp); s.m.rotation.set(0, 0, 0); s.v.set((Math.random() - .5) * 1.4, Math.random() * 1.4, (Math.random() - .5) * 1.4); s.w.set(Math.random() * 20, Math.random() * 20, 0); s.t = 0; shards.push(s); }
    for (let i = 0; i < 16; i++) W.puff(bp.clone(), new THREE.Vector3((Math.random() - .5) * .3, .1 + Math.random() * .3, (Math.random() - .5) * .3), { color: '#6a6a6a', size: .04, grow: 3, life: 1.8, drag: 1.5, op: .6 });
    for (let i = 0; i < 24; i++) W.puff(bp.clone(), new THREE.Vector3((Math.random() - .5) * 2, Math.random() * 1.6, (Math.random() - .5) * 2), { tex: W.dropTex, color: '#ffb44a', size: .008, grow: 0, life: .6, grav: 5, drag: .5, op: 1, add: true, hdr: 3 }); }
  if (t === 'solve') { for (let i = 0; i < 40; i++) W.puff(bp.clone(), new THREE.Vector3((Math.random() - .5) * .9, .3 + Math.random() * .8, (Math.random() - .5) * .9), { tex: W.dropTex, color: ['#ffd23f', '#ffffff', '#34e1ff'][i % 3], size: .01, grow: 0, life: 1.1, grav: 2.5, drag: .8, op: 1, add: true, hdr: 2 }); }
};

/* ---------- kare ---------- */
let lastR = -1, lastV = -1, bright = 0, time = 0;
function frame(dt) {
  time += dt; fit();
  const play = G.state === 'play', I = play ? G.I : 0, inB = play && !G.busy && Math.abs(I - G.target) <= G.tol && I <= G.burnMax, over = play && I > G.burnMax;
  if (G.V !== lastV) { lastV = G.V; drawLCD(G.V); }
  if (G.R !== lastR) { lastR = G.R; setBands(G.R); }
  const mx = Math.max(2, Math.ceil(G.burnMax * 1.2)); if (mx !== amMax) { amMax = mx; drawDial(mx); }
  // akım noktaları: I ile hızlanır, geleneksel akım yönü (+ uçtan saat yönünde)
  const n = Math.round(clamp(18 + I * 6, 18, NDOT)), col = over ? [3.2, .6, .5] : inB ? [3.2, 2.5, .6] : [.9, 2.4, 3.2]; dotMat.color.setRGB(...col);
  for (let i = 0; i < NDOT; i++) { if (i < n && play && G.bulbBurst <= 0) { const p = G.ptAt(G.flow * .9 + i * G.PERIM / n); dO.position.set((p.x - cx) * K, BY + .012, (p.y - cz) * K); dO.scale.setScalar(1); } else dO.scale.setScalar(0); dO.updateMatrix(); dots.setMatrixAt(i, dO.matrix); }
  dots.instanceMatrix.needsUpdate = true;
  // ampul parlaklığı ~ harcanan güç
  const target = play && G.bulbBurst <= 0 ? clamp(I * I / Math.max(.4, G.target * G.target), 0, 1.8) : 0; bright = lerp(bright, target, 1 - Math.exp(-dt * 10));
  if (G.bulbBurst <= 0 && !glass.visible) { glass.visible = true; for (const s of shards) { s.m.visible = false; shardPool.push(s); } shards.length = 0; }
  const hot = over ? [3, .9, .5] : [3, 2, 1]; filM.color.setRGB(.05 + hot[0] * bright, .03 + hot[1] * bright, .02 + hot[2] * bright);
  glowSpr.material.opacity = clamp(bright * .75, 0, .9); glowSpr.scale.setScalar(.03 + bright * .05); glowSpr.material.color.setRGB(...(over ? [1, .5, .45] : [1, .9, .75]));
  bulbLight.intensity = bright * .35; bulbLight.color.set(over ? '#ff8a70' : '#ffcf8a'); bulbLight.shadow.needsUpdate = bright > .02;
  // ibre (yaylı sönüm)
  const want = Math.PI * (-.65 + clamp(I / amMax, 0, 1.05) * 1.3); needleW += ((want - needleA) * 180 - needleW * 16) * dt; needleA += needleW * dt; needle.rotation.y = -needleA;
  psu.userData.knob.rotation.x = G.V * .25;
  for (let i = shards.length - 1; i >= 0; i--) { const s = shards[i]; s.t += dt; s.v.y -= 9.8 * dt; s.m.position.addScaledVector(s.v, dt); s.m.rotation.x += s.w.x * dt; s.m.rotation.y += s.w.y * dt; if (s.m.position.y < BY + .002) { s.m.position.y = BY + .002; s.v.set(0, 0, 0); s.w.set(0, 0, 0); } }
  if (shake > 0) { camera.position.x += (Math.random() - .5) * shake; camera.position.y += (Math.random() - .5) * shake; shake = Math.max(0, shake - dt * .03); }
  sun.target.position.set(0, TY, 0); sun.position.copy(W.sunDir).multiplyScalar(4).add(sun.target.position);
  W.frame(dt);
}
const proj = (kind, x, y) => kind === 'bulb' ? O.project(bulbG.position.clone().add(new THREE.Vector3(0, .16, 0))) : O.project(toP(x, y, .02));
drawLCD(6); drawDial(amMax); setBands(6);
// Önceden derleme: ampul gölgesi (küp), kırıklar ve parçacıklar ilk patlamada takılmasın
W.loadEnv('lab').then(async () => { fit(); try { bulbLight.shadow.needsUpdate = true; await prewarm([new THREE.Mesh(shardG, glassM)]); } catch (e) { console.error(e); } O.show(); window.BFY_R3D = { frame, ready: true, overlay: () => O.sync(), size: () => O, proj }; });
window.__r3d = { W, scene, camera };
