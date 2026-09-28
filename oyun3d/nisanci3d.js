// BFY · Eğik Atış Nişancı — 3B görüntü katmanı
import { THREE, worldUVMaterial, canvasTex, clamp, rng, isMobile } from '../sim3d/bfy3d-core.js?v=4';
import { overlayWorld, macroGround } from './ortak.js?v=1';

const G = window.BFY_GAME; if (!G) throw new Error('oyun yok');
const M = G.PXM, toX = x => (x - G.W / 2) / M, toY = y => (G.GROUND - y) / M;
const { W, O, stage } = overlayWorld(G, { fov: 36, shadowBox: 60, bloom: [.2, .45, 1.2] });
const { scene, camera, sun } = W;

/* ---------- zemin ---------- */
const gT = { col: W.tex('tex/grass_col.jpg'), nor: W.tex('tex/grass_nor.jpg', false), rough: W.tex('tex/grass_rough.jpg', false) };
const gm = macroGround(worldUVMaterial({ map: gT.col, normalMap: gT.nor, roughnessMap: gT.rough, tile: 3, tint: '#aab87e', normalScale: 1, envMapIntensity: .6 }), { fade: [180, 460], key: 'nis' });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1200).rotateX(-Math.PI / 2).translate(0, 0, -300), gm); ground.receiveShadow = true; scene.add(ground);
// atış alanı çizgileri (10 m'de bir) + metre tabelaları
const lineMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .55 });
const x0 = toX(G.ORIGIN.x);
for (let m = 10; m <= 70; m += 10) {
  const l = new THREE.Mesh(new THREE.PlaneGeometry(.16, 5).rotateX(-Math.PI / 2), lineMat); l.position.set(x0 + m, .02, -2.5); scene.add(l);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.8, .9), new THREE.MeshStandardMaterial({ map: canvasTex(128, 64, (g, w, h) => { g.fillStyle = '#f6f3ea'; g.fillRect(0, 0, w, h); g.strokeStyle = '#222'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); g.fillStyle = '#222'; g.font = '800 34px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(m + ' m', w / 2, h / 2 + 2); }), roughness: .7 }));
  sign.position.set(x0 + m, 1.1, -5.6); scene.add(sign);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .7, 8), new THREE.MeshStandardMaterial({ color: '#555' })); post.position.set(x0 + m, .35, -5.62); scene.add(post);
}
/* ---------- top (mancınık yerine ahşap tekerlekli top) ---------- */
const iron = new THREE.MeshStandardMaterial({ color: '#2a2d31', metalness: .9, roughness: .35 }), wood = new THREE.MeshStandardMaterial({ color: '#7a5634', roughness: .7 }), brass = new THREE.MeshStandardMaterial({ color: '#c9a04e', metalness: 1, roughness: .3 });
const cannon = new THREE.Group(); scene.add(cannon);
const oy = toY(G.ORIGIN.y); cannon.position.set(x0, 0, 0);
const carriage = new THREE.Mesh(new THREE.BoxGeometry(2.2, .5, 1.3), wood); carriage.position.y = .95; cannon.add(carriage);
for (const z of [-.8, .8]) { const wh = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .18, 28).rotateX(Math.PI / 2), wood); wh.position.set(0, .9, z); cannon.add(wh); const hub = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .26, 16).rotateX(Math.PI / 2), brass); hub.position.copy(wh.position); cannon.add(hub);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.9, .06, 8, 32), iron); rim.position.copy(wh.position); cannon.add(rim); }
const pivot = new THREE.Group(); pivot.position.set(0, oy, 0); cannon.add(pivot);
{ const pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new THREE.Vector2(.42 - t * .1 + (t > .92 ? .08 : 0), t * 2.6)); }
  const barrel = new THREE.Mesh(new THREE.LatheGeometry(pts, 32).rotateZ(-Math.PI / 2), iron); barrel.position.x = -.5; pivot.add(barrel);
  const bRing = new THREE.Mesh(new THREE.TorusGeometry(.4, .05, 8, 24).rotateY(Math.PI / 2), brass); bRing.position.x = .3; pivot.add(bRing);
  const cas = new THREE.Mesh(new THREE.SphereGeometry(.4, 20, 14), iron); cas.position.x = -.5; pivot.add(cas); }
cannon.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
const MUZ = 2.1;   // namlu ucu

/* ---------- balonlar ---------- */
const balloons = new Map();
function balloonMesh(t) {
  const g = new THREE.Group(), r = t.r / M * 1.25;
  const m = new THREE.MeshPhysicalMaterial({ color: t.col, roughness: .18, metalness: 0, clearcoat: 1, clearcoatRoughness: .06, sheen: .4, sheenColor: new THREE.Color('#ffffff') });
  const b = new THREE.Mesh(new THREE.SphereGeometry(r, 36, 28), m); b.scale.set(.92, 1.06, .92); b.castShadow = true; g.add(b);
  const knot = new THREE.Mesh(new THREE.ConeGeometry(r * .16, r * .22, 12).rotateX(Math.PI), m); knot.position.y = -r * 1.1; g.add(knot);
  const str = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 2.2, 5), new THREE.MeshBasicMaterial({ color: '#eeeeee' })); str.position.y = -r * 1.1 - 1.1; g.add(str);
  g.userData.r = r; scene.add(g); return g;
}
const walls3 = new Map();
const brickTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#7a3d2a'; g.fillRect(0, 0, w, h); const R = rng(9);
  for (let y = 0; y < 8; y++) for (let x = -1; x < 5; x++) { const bx = x * 64 + (y % 2) * 32, by = y * 32; g.fillStyle = `hsl(${12 + R() * 10},${40 + R() * 15}%,${30 + R() * 12}%)`; g.fillRect(bx + 2, by + 2, 60, 28); } }, { repeat: [1, 1] });
brickTex.wrapS = brickTex.wrapT = THREE.RepeatWrapping;
function wallMesh(w) { const hm = w.h / M, wm = w.w / M; const t = brickTex.clone(); t.needsUpdate = true; t.repeat.set(3, hm / 2.2); const m = new THREE.Mesh(new THREE.BoxGeometry(wm, hm, 8), new THREE.MeshStandardMaterial({ map: t, roughness: .85 })); m.position.set(toX(w.x), hm / 2, 0); m.castShadow = m.receiveShadow = true; scene.add(m); return m; }

/* ---------- mermi, iz ---------- */
const ball = new THREE.Mesh(new THREE.SphereGeometry(.42, 24, 18), iron); ball.castShadow = true; scene.add(ball);
const TRN = 40, trailG = new THREE.BufferGeometry(); trailG.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRN * 3), 3));
const trail = new THREE.Points(trailG, new THREE.PointsMaterial({ color: new THREE.Color(2.2, 1.4, .6), size: 10, sizeAttenuation: false, transparent: true, opacity: .75, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending })); trail.frustumCulled = false; scene.add(trail);

/* ---------- rüzgâr tulumu ---------- */
const sock = new THREE.Group(); sock.position.set(4, 0, -6); scene.add(sock);
{ const pole = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, 6, 10), new THREE.MeshStandardMaterial({ color: '#d0d4d8', metalness: .8, roughness: .3 })); pole.position.y = 3; pole.castShadow = true; sock.add(pole); }
const sockPivot = new THREE.Group(); sockPivot.position.y = 5.8; sock.add(sockPivot);
const sockTex = canvasTex(256, 64, (g, w, h) => { for (let i = 0; i < 5; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#ff5a1f'; g.fillRect(i * w / 5, 0, w / 5, h); } });
const sockMesh = new THREE.Mesh(new THREE.CylinderGeometry(.45, .2, 2.4, 20, 6, true).rotateZ(-Math.PI / 2).translate(1.2, 0, 0), new THREE.MeshStandardMaterial({ map: sockTex, side: THREE.DoubleSide, roughness: .7 }));
sockMesh.castShadow = true; sockPivot.add(sockMesh);

/* ---------- efektler ---------- */
const shard = new THREE.PlaneGeometry(.35, .25), shards = [];
function pop(t) { const p = new THREE.Vector3(toX(t.x), toY(t.y), 0), c = new THREE.Color(t.col);
  for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(shard, new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: .3 })); m.position.copy(p); scene.add(m); shards.push({ m, v: new THREE.Vector3((Math.random() - .5) * 14, (Math.random() - .2) * 12, (Math.random() - .5) * 14), w: new THREE.Vector3(Math.random() * 12, Math.random() * 12, 0), t: 0 }); }
  for (let i = 0; i < 26; i++) W.puff(p.clone(), new THREE.Vector3((Math.random() - .5) * 16, Math.random() * 12, (Math.random() - .5) * 16), { tex: W.dropTex, color: ['#ffffff', '#ffe08a', t.col][i % 3], size: .6, grow: 0, life: 1.2, grav: 7, drag: .4, op: 1, add: true, hdr: 1.8 }); }
function smoke(p, n = 12, col = '#e8e6e0') { for (let i = 0; i < n; i++) W.puff(p.clone(), new THREE.Vector3((Math.random() - .3) * 4, Math.random() * 2.5, (Math.random() - .5) * 4), { color: col, size: 1.2, grow: 3, life: 1.8, drag: 1.4, op: .6 }); }
let shake = 0;
G.on = (type, a) => {
  if (type === 'launch') { const d = aimDir(); const m = new THREE.Vector3(x0, oy, 0).addScaledVector(d, MUZ); smoke(m, 18); for (let i = 0; i < 6; i++) W.puff(m.clone(), d.clone().multiplyScalar(6 + i * 2), { tex: W.dropTex, color: '#ffcf80', size: 2 - i * .2, grow: .5, life: .15, drag: 0, op: 1, add: true, hdr: 3 }); shake = .35; kick = .45; }
  if (type === 'hit') { pop(a); shake = .25; }
  if (type === 'ground') smoke(new THREE.Vector3(toX(a), .3, 0), 10, '#b8ab8a');
  if (type === 'wall') { const p = G.proj; if (p) smoke(new THREE.Vector3(toX(p.x), toY(p.y), 0), 12, '#a57a60'); }
};

/* ---------- ortam ---------- */
let lastAng = .6, kick = 0;
function aimDir() { const a = lastAng; return new THREE.Vector3(Math.cos(a), Math.sin(a), 0); }
function fitCamera() {
  const tv = Math.tan(camera.fov * Math.PI / 360), top = toY(0) + 2, wX = G.W / M + 4;
  const d = Math.max(top * .5 / tv, wX * .5 / (tv * camera.aspect));
  camera.position.set(0, top * .5 + d * .1, d); camera.lookAt(0, top * .5 - 1.2, 0);
}

/* ---------- kare ---------- */
let time = 0;
function frame(dt) {
  time += dt;
  fitCamera();
  // balonlar
  const alive = new Set();
  for (const t of G.targets) { if (t.hit) continue; alive.add(t); let g = balloons.get(t); if (!g) { g = balloonMesh(t); balloons.set(t, g); }
    g.position.set(toX(t.x), toY(t.y + Math.sin(t.bob) * 5), 0); g.rotation.z = Math.sin(t.bob * .7) * .08 + G.wind * -.004; }
  for (const [t, g] of balloons) if (!alive.has(t)) { scene.remove(g); balloons.delete(t); }
  // duvarlar
  const ws = new Set(G.walls); for (const w of ws) if (!walls3.has(w)) walls3.set(w, wallMesh(w));
  for (const [w, m] of walls3) if (!ws.has(w)) { scene.remove(m); walls3.delete(w); }
  // namlu açısı
  if (G.aiming && G.aim) lastAng = G.aimVec().ang;
  pivot.rotation.z = lastAng; kick = Math.max(0, kick - dt * 2); pivot.position.x = -kick * .6;
  // mermi
  const p = G.proj; ball.visible = !!p;
  const tp = trailG.attributes.position.array;
  if (p) { ball.position.set(toX(p.x), toY(p.y), 0); for (let i = 0; i < TRN; i++) { const q = p.trail[Math.max(0, p.trail.length - 1 - Math.floor(i * p.trail.length / TRN))] || p; tp.set([toX(q.x), toY(q.y), 0], i * 3); } trailG.setDrawRange(0, Math.min(TRN, p.trail.length)); }
  else trailG.setDrawRange(0, 0);
  trailG.attributes.position.needsUpdate = true;
  // parçalar
  for (let i = shards.length - 1; i >= 0; i--) { const s = shards[i]; s.t += dt; s.v.y -= 9.8 * dt; s.v.multiplyScalar(Math.exp(-dt * 1.2)); s.m.position.addScaledVector(s.v, dt); s.m.rotation.x += s.w.x * dt; s.m.rotation.y += s.w.y * dt;
    if (s.m.position.y < .02) { s.m.position.y = .02; s.v.set(0, 0, 0); s.w.set(0, 0, 0); } if (s.t > 6) { scene.remove(s.m); s.m.material.dispose(); shards.splice(i, 1); } }
  // rüzgâr tulumu: rüzgâr yönüne döner, şiddetle kalkar
  const w = G.wind, k = clamp(Math.abs(w) / 12, 0, 1);
  sockPivot.rotation.y = w >= 0 ? 0 : Math.PI; sockPivot.rotation.z = -(1 - k) * 1.25 + Math.sin(time * 6) * .04 * k; sockMesh.rotation.x = Math.sin(time * 9) * .15 * k;
  // gölge kutusu sabit
  sun.target.position.set(0, 0, 0); sun.position.copy(W.sunDir).multiplyScalar(160);
  if (shake > 0) { camera.position.x += (Math.random() - .5) * shake; camera.position.y += (Math.random() - .5) * shake; shake = Math.max(0, shake - dt * 1.5); }
  W.frame(dt);
}
const proj = (x, y) => O.project(new THREE.Vector3(toX(x), toY(y), 0));
const pick = (cx, cy) => { const h = O.pick(cx, cy, 0); return h ? { x: h.x * M + G.W / 2, y: G.GROUND - h.y * M } : null; };
W.loadEnv('alps').then(() => { fitCamera(); O.show(); window.BFY_R3D = { frame, ready: true, overlay: () => O.sync(), proj, pick }; });
window.__r3d = { W, scene, camera };
