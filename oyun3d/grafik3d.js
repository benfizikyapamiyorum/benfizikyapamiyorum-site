// BFY · Grafik Yarışı — 3B görüntü katmanı (dağ yolunda yarış arabası; üstte canlı v-t grafiği)
import { THREE, worldUVMaterial, canvasTex, clamp, lerp, rng, isMobile } from '../sim3d/bfy3d-core.js?v=5';
import { overlayWorld, macroGround } from './ortak.js?v=2';

const G = window.BFY_GAME; if (!G) throw new Error('oyun yok');
const { W, O } = overlayWorld(G, { fov: 40, near: .1, far: 6000, shadowBox: 20, shadowFar: 200, bloom: [.3, .4, 1.1] });
const { scene, camera, sun } = W;
// Önceden derleme son işleme hedefine göre yapılmalı (ekrana göre derlenen ton eşlemeli çeşit oyunda kullanılmaz)
const prewarm = objs => { if (!W.prewarm) return Promise.resolve(); W.renderer.setRenderTarget(W.composer.renderTarget1); return W.prewarm(objs); };
const VS = .33;                      // oyundaki hız birimi → m/s (görsel)

/* ---------- yol ve çevre (dünya sabit, arabayla birlikte kayar) ---------- */
const world = new THREE.Group(); scene.add(world);
const gT = { col: W.tex('tex/grass_col.jpg'), nor: W.tex('tex/grass_nor.jpg', false), rough: W.tex('tex/grass_rough.jpg', false) };
const grass = new THREE.Mesh(new THREE.PlaneGeometry(1400, 900).rotateX(-Math.PI / 2).translate(0, -.02, -300), macroGround(worldUVMaterial({ map: gT.col, normalMap: gT.nor, roughnessMap: gT.rough, tile: 3, tint: '#a9b67c', normalScale: 1, envMapIntensity: .6 }), { fade: [220, 520], key: 'gr' }));
grass.receiveShadow = true; world.add(grass);
const roadTex = canvasTex(1024, 256, (g, w, h) => { g.fillStyle = '#34363a'; g.fillRect(0, 0, w, h); const R = rng(2);
  for (let i = 0; i < 9000; i++) { const v = 40 + R() * 40; g.fillStyle = `rgba(${v},${v},${v + 4},${.25 + R() * .4})`; g.fillRect(R() * w, R() * h, 1 + R() * 2, 1 + R() * 2); }
  g.fillStyle = '#e9e6dc'; g.fillRect(0, 10, w, 7); g.fillRect(0, h - 17, w, 7);
  g.fillStyle = '#f2c230'; for (let x = 0; x < w; x += 128) g.fillRect(x + 10, h / 2 - 4, 70, 8); }, { repeat: [1, 1] });
roadTex.wrapS = THREE.RepeatWrapping; roadTex.anisotropy = 16;
const TILE = 16; roadTex.repeat.set(400 / TILE, 1);
const road = new THREE.Mesh(new THREE.PlaneGeometry(400, 9).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: roadTex, roughness: .85, metalness: 0 })); road.position.set(60, 0, 0); road.receiveShadow = true; scene.add(road);
const curb = new THREE.MeshStandardMaterial({ map: canvasTex(128, 32, (g, w, h) => { for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#d8231c'; g.fillRect(i * w / 4, 0, w / 4, h); } }, { repeat: [100, 1] }), roughness: .6 });
const curbs = [];
for (const z of [-4.8, 4.8]) { const c = new THREE.Mesh(new THREE.BoxGeometry(400, .12, .6), curb); c.position.set(60, .06, z); c.receiveShadow = true; scene.add(c); curbs.push(c); }
// yol kenarı: bariyer direkleri ve kilometre taşları (tekrarlı, kayar)
const postGeo = new THREE.BoxGeometry(.14, 1, .14), postMat = new THREE.MeshStandardMaterial({ color: '#f2f2f0', roughness: .5 });
const reflMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.3, .3), toneMapped: false });
const NP = 60, SP = 8, posts = new THREE.InstancedMesh(postGeo, postMat, NP), refl = new THREE.InstancedMesh(new THREE.BoxGeometry(.15, .12, .15), reflMat, NP);
posts.castShadow = true; scene.add(posts, refl);
const rail = new THREE.Mesh(new THREE.BoxGeometry(480, .28, .06), new THREE.MeshStandardMaterial({ color: '#b9bec6', metalness: .9, roughness: .3 })); rail.position.set(60, .7, -5.6); rail.castShadow = true; scene.add(rail);
/* ---------- araba ---------- */
const CS = 108, car = new THREE.Group(); scene.add(car); let wheels = [], brakeM = null, tail = null;
const carReady = Promise.all([W.gltf('models/ToyCar/car.glb'), fetch(new URL('../sim3d/models/ToyCar/wheels_meta.json', import.meta.url)).then(r => r.json())]).then(([sc, meta]) => {
  let body = null, glass = null; sc.traverse(o => { if (o.isMesh && o.material.name === 'ToyCar') body = o; if (o.isMesh && o.material.name === 'Glass') glass = o; });
  const root = new THREE.Group(); root.rotation.y = Math.PI / 2; root.scale.setScalar(CS); root.position.y = -9.6e-4 * CS; car.add(root);
  const raw = new THREE.Group(); raw.quaternion.set(.7071068, 0, 0, .7071067); raw.scale.setScalar(1e-4); root.add(raw);
  const mat = body.material.clone(); mat.envMapIntensity = 1.3;
  const idx = body.geometry.index.array, geoFor = (a, b) => { const g = new THREE.BufferGeometry(); for (const n in body.geometry.attributes) g.setAttribute(n, body.geometry.attributes[n]); g.setIndex(new THREE.BufferAttribute(idx.subarray(a * 3, b * 3), 1)); g.boundingSphere = body.geometry.boundingSphere; return g; };
  const cnt = meta.groups; let s = cnt[0];
  const bm = new THREE.Mesh(geoFor(0, cnt[0]), mat); bm.frustumCulled = false; bm.castShadow = bm.receiveShadow = true; raw.add(bm);
  for (let i = 0; i < 4; i++) { const c = meta.centers[i], piv = new THREE.Group(); piv.position.set(c[0], c[1], c[2]); raw.add(piv);
    const wm = new THREE.Mesh(geoFor(s, s + cnt[i + 1]), mat); wm.frustumCulled = false; wm.castShadow = true; wm.position.set(-c[0], -c[1], -c[2]); piv.add(wm); s += cnt[i + 1]; wheels.push(piv); }
  if (glass) raw.add(new THREE.Mesh(glass.geometry, glass.material));
  // fren lambaları ve egzoz
  brakeM = new THREE.MeshBasicMaterial({ color: new THREE.Color(.25, .02, .02), toneMapped: false });
  for (const z of [-.55, .55]) { const b = new THREE.Mesh(new THREE.BoxGeometry(.06, .12, .32), brakeM); b.position.set(-2.12, .72, z); car.add(b); }
});
const flameTex = canvasTex(64, 64, g => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, 'rgba(255,255,230,1)'); gr.addColorStop(.35, 'rgba(255,170,60,.9)'); gr.addColorStop(1, 'rgba(255,60,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, color: new THREE.Color(2.5, 1.6, .8), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); flame.position.set(-2.35, .38, .45); car.add(flame);
const shadowBlob = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.3).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: canvasTex(128, 64, g => { const gr = g.createRadialGradient(64, 32, 4, 64, 32, 60); gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 64); }), transparent: true, depthWrite: false })); shadowBlob.position.y = .015; car.add(shadowBlob);

/* ---------- kamera: yandan-arkadan takip, araba ekranın altında ---------- */
let camT = 0;
function fitCamera(v) { camT += 1 / 60; const d = (isMobile ? 17 : 15) * Math.max(1, 1.42 / camera.aspect), sway = Math.sin(camT * .3) * .6;
  camera.position.set(-5 - v * .012 + sway, 2.6, d); camera.lookAt(1.8, 4.6, 0); }

/* ---------- kare ---------- */
let dist = 0, vs = 0, time = 0;
const dO = new THREE.Object3D(), pA = new THREE.Vector3(), pB = new THREE.Vector3();   // W.puff konumu kopyalar: geçiciler yeniden kullanılır
function frame(dt) {
  time += dt;
  const play = G.state === 'play' || G.state === 'count' || G.state === 'between';
  const target = play ? G.v * VS : 6; vs = lerp(vs, target, 1 - Math.exp(-dt * 8));
  dist += vs * dt;
  // yol ve çevre kayması
  roadTex.offset.x = (dist / TILE) % 1; grass.material.userData.uOff.value.x = dist; curbs.forEach(c => c.material.map.offset.x = (dist / 4) % 1);
  for (let i = 0; i < NP; i++) { let x = ((i * SP - dist) % (NP * SP) + NP * SP) % (NP * SP) - 120; dO.position.set(x, .5, -5.6); dO.scale.set(1, 1, 1); dO.updateMatrix(); posts.setMatrixAt(i, dO.matrix); dO.position.y = .85; dO.updateMatrix(); refl.setMatrixAt(i, dO.matrix); }
  posts.instanceMatrix.needsUpdate = refl.instanceMatrix.needsUpdate = true;
  // araba: tekerlek dönüşü, süspansiyon, fren lambası, egzoz
  const wr = .36; wheels.forEach(w => w.rotation.x -= vs / wr * dt);
  car.position.y = Math.sin(time * 23) * .006 * clamp(vs / 20, 0, 1); car.rotation.z = lerp(car.rotation.z, (G.holding ? .012 : -.02) * clamp(vs / 10, 0, 1), 1 - Math.exp(-dt * 5));
  if (brakeM) brakeM.color.setRGB(...(!G.holding && play && vs > .5 ? [4, .25, .15] : [.25, .02, .02]));
  flame.visible = G.holding && play; flame.scale.setScalar(.35 + Math.random() * .3);
  if (G.holding && play && Math.random() < dt * 20) W.puff(pA.set(-2.4, .35, .45), pB.set(-3 - vs * .1, .4, 0), { color: '#c8c6c0', size: .4, grow: 3, life: .9, drag: 2, op: .35 });
  if (!G.holding && play && vs > 8 && Math.random() < dt * 14) for (const z of [-.8, .8]) W.puff(pA.set(-1.4, .1, z), pB.set(-vs * .2, .3, 0), { color: '#9a9690', size: .3, grow: 2.5, life: .7, drag: 2, op: .3 });
  fitCamera(vs);
  sun.target.position.set(0, 0, 0); sun.position.copy(W.sunDir).multiplyScalar(90);
  W.frame(dt);
}
// Önceden derleme: araba modeli (en çok 6 sn beklenir) ve egzoz parçacıkları ilk gazda takılmasın
W.loadEnv('alps').then(async () => { fitCamera(0);
  try { await Promise.race([carReady.catch(e => console.error(e)), new Promise(r => setTimeout(r, 6000))]); flame.visible = true; await prewarm([]); } catch (e) { console.error(e); }
  O.show(); window.BFY_R3D = { frame, ready: true, overlay: () => O.sync(), size: () => O }; });
window.__r3d = { W, scene, camera };
