// BFY · Mercek Keskin Nişancı — 3B görüntü katmanı (optik masa: lazer, aynalar, cam mercekler, prizmalar)
import { THREE, canvasTex, clamp, lerp, rng, isMobile } from '../sim3d/bfy3d-core.js?v=5';
import { overlayWorld } from './ortak.js?v=2';

const G = window.BFY_GAME, OP = window.BFY_OPTIK; if (!G || !OP) throw new Error('oyun yok');
const K = .001, TY = .76, PY = TY + .012, BHW = G.BH * K;          // 1 px = 1 mm · ışın yüksekliği 75 mm
const CX = 440, CZ = 340, D = Math.PI / 180;
const toV = (x, y, h = BHW) => new THREE.Vector3((x - CX) * K, PY + h, (y - CZ) * K);
const { W, O } = overlayWorld(G, { fov: 24, near: .02, far: 40, shadowBox: .8, shadowFar: 6, bloom: [.34, .38, .95] });
const { scene, camera, sun, renderer } = W;
// Önceden derleme son işleme hedefine göre yapılmalı (ekrana göre derlenen ton eşlemeli çeşit oyunda kullanılmaz)
const prewarm = objs => { if (!W.prewarm) return Promise.resolve(); W.renderer.setRenderTarget(W.composer.renderTarget1); return W.prewarm(objs); };
sun.castShadow = true;

/* ---------- oda, masa, optik tabla ---------- */
const cT = { col: W.tex('tex/concrete_col.jpg'), nor: W.tex('tex/concrete_nor.jpg', false) };
const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: cT.col, normalMap: cT.nor, color: '#4a4f5a', roughness: .9 }));
cT.col.repeat.set(4, 4); cT.nor.repeat.set(4, 4); floor.receiveShadow = true; scene.add(floor);
W.gltf('models/WoodenTable_01/WoodenTable_01.gltf').then(o => { o.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; }); o.scale.set(.75, TY / .549, 1.2); scene.add(o); });
const plateTex = canvasTex(1024, 620, (g, w, h) => { g.fillStyle = '#1b1d22'; g.fillRect(0, 0, w, h); const R = rng(5);
  for (let i = 0; i < 26000; i++) { const v = 26 + R() * 18; g.fillStyle = `rgba(${v},${v + 1},${v + 5},.5)`; g.fillRect(R() * w, R() * h, 3 + R() * 9, 1); }
  const sx = w / 900, sy = h / 540;
  for (let x = 30; x < 900; x += 20) for (let y = 30 + 0; y < 540; y += 20) { const px = x * sx, py = y * sy, big = (x - 10) % 40 === 0 && (y - 10) % 40 === 20;
    g.fillStyle = big ? '#07080a' : '#0c0d10'; g.beginPath(); g.arc(px, py, big ? 3.4 : 2.2, 0, 6.28); g.fill(); g.strokeStyle = 'rgba(150,160,175,.22)'; g.lineWidth = 1; g.beginPath(); g.arc(px, py + .4, big ? 3.8 : 2.6, .2, 2.9); g.stroke(); }
  g.fillStyle = 'rgba(220,225,235,.28)'; g.font = '800 15px Arial'; g.fillText('BFY · OPTİK MASASI · M6 / 20 mm', 12, h - 9); });
const plate = new THREE.Mesh(new THREE.BoxGeometry(.9, .012, .54), [0, 1, 2, 3, 4, 5].map(i => i === 2 ? new THREE.MeshStandardMaterial({ map: plateTex, roughness: .5, metalness: .55, envMapIntensity: .6 }) : new THREE.MeshStandardMaterial({ color: '#2a2c31', roughness: .4, metalness: .7 })));
plate.position.set(0, TY + .006, 0); plate.receiveShadow = true; plate.castShadow = true; scene.add(plate);

/* ---------- malzemeler ---------- */
const anod = new THREE.MeshStandardMaterial({ color: '#16171b', roughness: .38, metalness: .55, envMapIntensity: .8 });
const alu = new THREE.MeshStandardMaterial({ color: '#c3c8cf', roughness: .3, metalness: 1, envMapIntensity: 1 });
const mirrorM = new THREE.MeshStandardMaterial({ color: '#f2f6fa', roughness: .02, metalness: 1, envMapIntensity: 1.6 });
const glassM = isMobile ? new THREE.MeshPhysicalMaterial({ color: '#cfefff', roughness: .02, metalness: 0, transparent: true, opacity: .32, envMapIntensity: 1.8, clearcoat: 1, depthWrite: false })
  : new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .03, metalness: 0, transmission: 1, ior: 1.5, thickness: .03, attenuationColor: new THREE.Color('#bfefff'), attenuationDistance: .35, envMapIntensity: 1.4, specularIntensity: 1 });
const lensTint = { lens: '#dff8ff', dlens: '#efe2ff' };
const ringM = { lens: new THREE.MeshStandardMaterial({ color: '#1f86b8', roughness: .35, metalness: .6, emissive: new THREE.Color('#0a3550') }), dlens: new THREE.MeshStandardMaterial({ color: '#7b45cf', roughness: .35, metalness: .6, emissive: new THREE.Color('#2a1050') }) };
const fixedMark = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, .9, .25), toneMapped: false });
const rotMark = new THREE.MeshBasicMaterial({ color: new THREE.Color(.4, 1.6, 2.4), toneMapped: false });

// Parça geometrileri/malzemeleri paylaşılır: parça kaldırılınca GPU'da sızan bir şey kalmaz
const shared = o => { o.userData.shared = true; return o; };
const disposeDeep = o => W.disposeDeep ? W.disposeDeep(o) : o.parent && o.parent.remove(o);
[anod, alu, mirrorM, glassM, ringM.lens, ringM.dlens, fixedMark, rotMark].forEach(shared);
const postG = {}, postBaseG = shared(new THREE.CylinderGeometry(.013, .014, .008, 20).translate(0, .004, 0));
function post(h = BHW - .01) { const g = new THREE.Group(), k = h.toFixed(5); const pg = postG[k] || (postG[k] = shared(new THREE.CylinderGeometry(.0065, .0065, h, 16).translate(0, h / 2, 0)));
  const p = new THREE.Mesh(pg, alu); p.castShadow = true;
  const b = new THREE.Mesh(postBaseG, anod); b.castShadow = true; g.add(p, b); return g; }
const markG = shared(new THREE.SphereGeometry(.004, 10, 8));
const mirG = { face: shared(new THREE.BoxGeometry(.08, .062, .005)), frame: shared(new THREE.BoxGeometry(.084, .006, .009)), hold: shared(new THREE.BoxGeometry(.02, .012, .012)) };
function makeMirror(fixed) { const g = new THREE.Group();
  const face = new THREE.Mesh(mirG.face, [anod, anod, anod, anod, mirrorM, mirrorM]); face.position.y = BHW; face.castShadow = true;
  const frame = new THREE.Mesh(mirG.frame, anod); frame.position.y = BHW - .034; const ft = frame.clone(); ft.position.y = BHW + .034;
  const hold = new THREE.Mesh(mirG.hold, anod); hold.position.y = BHW - .04;
  g.add(face, frame, ft, hold, post(BHW - .045)); if (fixed) { const m = new THREE.Mesh(markG, fixed === 'rot' ? rotMark : fixedMark); m.position.set(0, BHW + .042, 0); g.add(m); }
  return g; }
function lensGeo(conv) { const R = .05, pts = [], N = 18;
  const th = r => conv ? .003 + .012 * (1 - (r / R) ** 2) : .004 + .011 * (r / R) ** 2;
  for (let i = 0; i <= N; i++) { const r = R * i / N; pts.push(new THREE.Vector2(r, th(r) / 2)); }
  for (let i = N; i >= 0; i--) { const r = R * i / N; pts.push(new THREE.Vector2(r, -th(r) / 2)); }
  return new THREE.LatheGeometry(pts, 64).rotateX(Math.PI / 2); }
const geoL = { lens: shared(lensGeo(true)), dlens: shared(lensGeo(false)) };
// mercek camı türe göre tek malzeme (eskiden her mercekte kopya)
const lensM = {}; for (const type of ['lens', 'dlens']) { const m = shared(glassM.clone()); m.color.set(isMobile ? lensTint[type] : '#ffffff'); if (!isMobile) m.attenuationColor.set(lensTint[type]); lensM[type] = m; }
const lensRingG = shared(new THREE.TorusGeometry(.0515, .0042, 10, 64)), tabG = shared(new THREE.BoxGeometry(.012, .012, .008));
function makeLens(type, fixed) { const g = new THREE.Group();
  const l = new THREE.Mesh(geoL[type], lensM[type]); l.position.y = BHW;
  const ring = new THREE.Mesh(lensRingG, ringM[type]); ring.position.y = BHW;
  const tab = new THREE.Mesh(tabG, anod); tab.position.y = BHW - .056;
  g.add(l, ring, tab, post(BHW - .06)); if (fixed) { const mk = new THREE.Mesh(markG, fixed === 'rot' ? rotMark : fixedMark); mk.position.set(0, BHW + .058, 0); g.add(mk); }
  return g; }
function prismGeo() { const s = new THREE.Shape(); const P = OP.prismPoly(0, 0, 0); s.moveTo(P[0][0] * K, P[0][1] * K); s.lineTo(P[1][0] * K, P[1][1] * K); s.lineTo(P[2][0] * K, P[2][1] * K); s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: .11, bevelEnabled: true, bevelThickness: .0015, bevelSize: .0015, bevelSegments: 2 }).rotateX(Math.PI / 2).translate(0, .11, 0); }
const geoP = shared(prismGeo()), prismBaseG = shared(new THREE.CylinderGeometry(.03, .03, .004, 24).translate(0, .002, 0)), prismEdgeG = shared(new THREE.EdgesGeometry(geoP, 30));
const prismEdgeM = shared(new THREE.LineBasicMaterial({ color: '#cfefff', transparent: true, opacity: .55 }));
function makePrism() { const g = new THREE.Group(); const m = new THREE.Mesh(geoP, glassM); m.position.y = .004; m.castShadow = !isMobile; g.add(m);
  const base = new THREE.Mesh(prismBaseG, anod); g.add(base);
  const e = new THREE.LineSegments(prismEdgeG, prismEdgeM); e.position.y = .004; g.add(e); return g; }

/* ---------- lazer, hedef, kristaller, duvarlar, cam ---------- */
const laser = new THREE.Group(); scene.add(laser);
{ const body = new THREE.Mesh(new THREE.CylinderGeometry(.016, .016, .08, 32).rotateZ(Math.PI / 2).translate(-.02, 0, 0), anod); body.position.y = BHW; body.castShadow = true;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.012, .016, .012, 32).rotateZ(-Math.PI / 2).translate(.026, 0, 0), alu); cap.position.y = BHW;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(.0165, .0165, .01, 32).rotateZ(Math.PI / 2).translate(-.01, 0, 0), new THREE.MeshStandardMaterial({ color: '#d0202e', roughness: .35, metalness: .5 })); band.position.y = BHW;
  const ap = new THREE.Mesh(new THREE.CircleGeometry(.004, 16).rotateY(Math.PI / 2).translate(.0322, 0, 0), new THREE.MeshBasicMaterial({ color: new THREE.Color(8, .4, .4), toneMapped: false })); ap.position.y = BHW;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(.05, .011).translate(-.028, 0, 0), new THREE.MeshBasicMaterial({ map: canvasTex(256, 52, (g, w, h) => { g.fillStyle = '#f2c21b'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.font = '900 30px Arial'; g.fillText('⚠ LAZER 650 nm', 8, 37); }) }));
  label.position.set(0, BHW + .0162, 0); label.rotation.x = -Math.PI / 2; laser.add(body, cap, band, ap, label, post(BHW - .016));
  const cl = new THREE.Mesh(new THREE.BoxGeometry(.03, .01, .034), anod); cl.position.set(-.02, BHW - .018, 0); laser.add(cl); }
const laserRot = new THREE.Mesh(new THREE.TorusGeometry(.045, .0025, 8, 48).rotateX(Math.PI / 2), rotMark); laserRot.position.y = .003; laser.add(laserRot);
const target = new THREE.Group(); scene.add(target);
const ringTex = canvasTex(256, 64, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#f4f4f4' : '#d61f36'; g.fillRect(i * w / 8, 0, w / 8, h); } });
const tMat = new THREE.MeshStandardMaterial({ map: ringTex, roughness: .5, emissive: new THREE.Color('#000'), emissiveMap: ringTex });
const tCore = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.5, .3, .35), toneMapped: false });
{ const cyl = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .034, 40), tMat); cyl.position.y = BHW; cyl.castShadow = true;
  const top = new THREE.Mesh(new THREE.SphereGeometry(.012, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), tCore); top.position.y = BHW + .017;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.0205, .002, 8, 40).rotateX(Math.PI / 2), alu); rim.position.y = BHW + .017; const rim2 = rim.clone(); rim2.position.y = BHW - .017;
  target.add(cyl, top, rim, rim2, post(BHW - .018)); }
// ışık hedef grubunda değil sahnede: hedef gizlenince ışık sayısı değişip her şey yeniden derlenmesin
const tLight = new THREE.PointLight('#46ff9a', 0, .6, 2); scene.add(tLight);
const haloTex = canvasTex(64, 64, g => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 31); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
const gemMat = () => new THREE.MeshStandardMaterial({ color: '#7ff0ff', metalness: .3, roughness: .05, emissive: new THREE.Color('#0a4a60'), emissiveIntensity: 1, flatShading: true, envMapIntensity: 2 });
const wallEdgeM = shared(new THREE.LineBasicMaterial({ color: '#3b3e46' })), glassEdgeM = shared(new THREE.LineBasicMaterial({ color: '#bfefff', transparent: true, opacity: .45 }));
const gemG = shared(new THREE.OctahedronGeometry(.011, 0).scale(1, 1.4, 1));
// kristaller havuzlu (malzemeleri kristale özel: parlaklık ayrı ayrı değişir); duvar/cam geometrileri bölüm değişince serbest bırakılır
const gemFree = [];
function makeGem() { const g = new THREE.Group(); const m = new THREE.Mesh(gemG, gemMat()); g.add(m);
  const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, color: new THREE.Color(.6, 2, 2.4), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); h.scale.setScalar(.05); g.add(h);
  const ps = post(BHW - .02); g.add(ps); ps.position.y = -BHW; ps.scale.set(.5, 1, .5); return { g, m, h, on: 0 }; }
let levelObjs = [], gems = [];
function clearLevel() { for (const o of levelObjs) disposeDeep(o); for (const gm of gems) { scene.remove(gm.g); gemFree.push(gm); } levelObjs = []; gems = []; }
function buildLevel(L) {
  clearLevel();
  for (const w of (L.walls || [])) { const m = new THREE.Mesh(new THREE.BoxGeometry((w[2] - w[0]) * K - .002, .09, (w[3] - w[1]) * K - .002), anod); m.position.copy(toV((w[0] + w[2]) / 2, (w[1] + w[3]) / 2, .045)); m.castShadow = m.receiveShadow = true; scene.add(m); levelObjs.push(m);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), wallEdgeM); e.position.copy(m.position); scene.add(e); levelObjs.push(e); }
  for (const r of (L.glass || [])) { const m = new THREE.Mesh(new THREE.BoxGeometry((r[2] - r[0]) * K, .12, (r[3] - r[1]) * K), glassM); m.position.copy(toV((r[0] + r[2]) / 2, (r[1] + r[3]) / 2, .06)); scene.add(m); levelObjs.push(m);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), glassEdgeM); e.position.copy(m.position); scene.add(e); levelObjs.push(e); }
  (L.gems || []).forEach(p => { const gm = gemFree.pop() || makeGem(); gm.on = 0; gm.g.position.copy(toV(p[0], p[1])); scene.add(gm.g); gems.push(gm); });
  target.position.copy(toV(L.target.x, L.target.y, 0)); tLight.position.copy(target.position).y += BHW + .03;
}

/* ---------- parçalar: oyundaki nesnelerle eşleşen havuz ---------- */
const pmap = new Map(), tpV = new THREE.Vector3();
function syncPieces() { const seen = new Set();
  for (const p of G.pieces) { let o = pmap.get(p); if (!o) { const fx = p.fixed ? (p.rot ? 'rot' : 'lock') : null; o = p.type === 'mirror' ? makeMirror(fx) : p.type === 'prism' ? makePrism() : makeLens(p.type, fx); scene.add(o); pmap.set(p, o); o.userData.pop = 0; }
    seen.add(p); const tp = setV(tpV, p.x, p.y, 0); o.position.lerp(tp, o.position.distanceTo(tp) > .2 ? 1 : .45); const ta = -p.a * D; let da = ta - o.rotation.y; da = Math.atan2(Math.sin(da), Math.cos(da)); o.rotation.y += da * .45;
    o.userData.pop = Math.max(0, o.userData.pop - .06); o.scale.setScalar(1 + o.userData.pop * .15 + (G.drag && G.drag.p === p && G.drag.moved ? .06 : 0)); }
  for (const [k, o] of pmap) if (!seen.has(k)) { disposeDeep(o); pmap.delete(k); } }

/* ---------- ışın ---------- */
const MAXS = 90, coreM = new THREE.MeshBasicMaterial({ color: new THREE.Color(9, .55, .5), toneMapped: false });
const glowM = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, .08, .16), transparent: true, opacity: .2, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
const cylG = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);
const cores = [], glows = [];
for (let i = 0; i < MAXS; i++) { const c = new THREE.Mesh(cylG, coreM), g = new THREE.Mesh(cylG, glowM); c.visible = g.visible = false; c.frustumCulled = g.frustumCulled = false; scene.add(c, g); cores.push(c); glows.push(g); }
const flareM = new THREE.SpriteMaterial({ map: haloTex, color: new THREE.Color(5, .5, .6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
const flares = []; for (let i = 0; i < 40; i++) { const s = new THREE.Sprite(flareM); s.visible = false; scene.add(s); flares.push(s); }
const endL = new THREE.PointLight('#ff2a40', 0, .5, 2); scene.add(endL);
const beamL = new THREE.PointLight('#ff3048', 0, .7, 2); scene.add(beamL);
// ışında uçuşan toz (hacimsel görünüm)
const DN = isMobile ? 220 : 420, dustG = new THREE.BufferGeometry(), dustP = new Float32Array(DN * 3), dustC = new Float32Array(DN * 3), dust = [];
for (let i = 0; i < DN; i++) dust.push({ u: Math.random(), s: Math.random(), j: [(Math.random() - .5) * .006, (Math.random() - .5) * .006], ph: Math.random() * 6.28 });
dustG.setAttribute('position', new THREE.BufferAttribute(dustP, 3)); dustG.setAttribute('color', new THREE.BufferAttribute(dustC, 3));
const dustPts = new THREE.Points(dustG, new THREE.PointsMaterial({ map: haloTex, size: .0045, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); dustPts.frustumCulled = false; scene.add(dustPts);
const up = new THREE.Vector3(0, 1, 0), tv = new THREE.Vector3();
const setV = (v, x, y, h = BHW) => v.set((x - CX) * K, PY + h, (y - CZ) * K);
const lenPool = [], lens = [], cum = [], NOSEG = [];   // kare başına yeni dizi/vektör ayrılmasın
function drawBeam(res, time) {
  const segs = res ? res.segs : NOSEG; let n = 0, total = 0; lens.length = 0;
  for (const s of segs) { const l = lenPool[lens.length] || (lenPool[lens.length] = [new THREE.Vector3(), new THREE.Vector3(), 0]); const a = setV(l[0], s[0], s[1]), b = setV(l[1], s[2], s[3]), L = a.distanceTo(b); l[2] = L; lens.push(l); total += L;
    if (n < MAXS && L > 1e-4) { const c = cores[n], g = glows[n]; W.orient(c, a, b); W.orient(g, a, b); const fl = 1 + Math.sin(time * 40 + n) * .04;
      c.scale.x = c.scale.z = .0011 * fl; g.scale.x = g.scale.z = (s[4] ? .0034 : .0048) * fl; c.visible = g.visible = true; n++; } }
  for (let i = n; i < MAXS; i++) cores[i].visible = glows[i].visible = false;
  // etkileşim noktalarında parlama
  let f = 0; if (res) for (const e of res.ev) { if (f >= flares.length) break; const s = flares[f++]; setV(s.position, e.x, e.y); s.scale.setScalar(.014 + Math.sin(time * 30 + f) * .0015); s.visible = true; }
  for (let i = f; i < flares.length; i++) flares[i].visible = false;
  if (lens.length) { const last = lens[lens.length - 1]; endL.position.copy(last[1]); endL.intensity = res.hit ? 0 : .1; beamL.position.copy(lens[0][0]).lerp(last[1], .5); beamL.intensity = .15; }
  // toz
  let acc = 0; cum.length = lens.length; for (let i = 0; i < lens.length; i++) cum[i] = (acc += lens[i][2]);
  for (let i = 0; i < DN; i++) { const d = dust[i]; d.u += .0015; if (d.u > 1) d.u -= 1; if (!total) { dustC[i * 3] = dustC[i * 3 + 1] = dustC[i * 3 + 2] = 0; continue; }
    const at = d.s * total; let k = 0; while (k < cum.length - 1 && cum[k] < at) k++; const l = lens[k], prev = k ? cum[k - 1] : 0, tt = l[2] ? (at - prev) / l[2] : 0;
    tv.copy(l[0]).lerp(l[1], tt); dustP[i * 3] = tv.x + d.j[0] * Math.sin(time + d.ph); dustP[i * 3 + 1] = tv.y + d.j[1] * Math.cos(time * .7 + d.ph); dustP[i * 3 + 2] = tv.z + d.j[0] * Math.cos(time * 1.3 + d.ph);
    const b = Math.max(0, Math.sin(time * 2.3 + d.ph * 3)) ** 3 * 2.2; dustC[i * 3] = b; dustC[i * 3 + 1] = b * .2; dustC[i * 3 + 2] = b * .25; }
  dustG.attributes.position.needsUpdate = dustG.attributes.color.needsUpdate = true;
}

/* ---------- olaylar ---------- */
let winFx = 0;
G.on = (type, a) => {
  if (type === 'level') { buildLevel(G.L); for (const [, o] of pmap) disposeDeep(o); pmap.clear(); winFx = 0; }
  else if (type === 'add') { requestAnimationFrame(() => { const o = pmap.get(a.p); if (o) o.userData.pop = 1; }); }
  else if (type === 'win') { winFx = 1; const p = toV(a.x, a.y);
    for (let i = 0; i < 26; i++) { const ang = Math.random() * 6.28, sp = .1 + Math.random() * .25; W.puff(p, new THREE.Vector3(Math.cos(ang) * sp, .15 + Math.random() * .3, Math.sin(ang) * sp), { tex: haloTex, add: true, color: ['#46ffa0', '#ffd34d', '#ff5d77', '#7ff0ff'][i % 4], hdr: 3, size: .012, grow: .2, life: 1.1, grav: .35, drag: 1.2, op: 1 }); } }
  else if (type === 'gem') { const g = gems[a.i]; if (g) g.on = 1.6; }
};

/* ---------- kamera: tablayı kadraja sığdır (üstte HUD için pay) ---------- */
const dir = new THREE.Vector3(0, 1, .5).normalize(), look = new THREE.Vector3(0, PY, .012);
function fit() { const hud = document.getElementById('hud'), sh = W.stage.getBoundingClientRect().height || 1, topN = hud ? Math.min(.8, 1 - 2 * (hud.getBoundingClientRect().height + 4) / sh) : .8;
  const corners = [[0, 80, 0], [880, 80, 0], [0, 600, 0], [880, 600, 0], [40, 96, BHW + .01], [840, 96, BHW + .01]].map(([x, y, h]) => toV(x, y, h));
  camera.setViewOffset(1, 1, 0, (topN - .97) / 4, 1, 1);   // tablayı HUD altındaki boş alanın ortasına al
  let lo = .3, hi = 6; for (let it = 0; it < 30; it++) { const d = (lo + hi) / 2; camera.position.copy(look).addScaledVector(dir, d); camera.lookAt(look); camera.updateMatrixWorld(); camera.updateProjectionMatrix();
    let ok = true; for (const c of corners) { const p = c.clone().project(camera); if (Math.abs(p.x) > .97 || p.y > topN || p.y < -.97) { ok = false; break; } } if (ok) hi = d; else lo = d; }
  camera.position.copy(look).addScaledVector(dir, hi); camera.lookAt(look); }
let fitN = 0, lastAsp = 0;

/* ---------- kare ---------- */
let time = 0;
const rc = new THREE.Raycaster(), pl = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(PY + BHW)), hit = new THREE.Vector3();
function frame(dt) {
  time += dt; if ((fitN++ % 30) === 0 || camera.aspect !== lastAsp) { lastAsp = camera.aspect; fit(); }
  const L = G.L;
  if (L) { laser.visible = target.visible = true; setV(laser.position, L.laser.x, L.laser.y, 0); laser.rotation.y = -L.laser.a * D; laserRot.visible = !!L.laser.rot; laserRot.material.opacity = 1;
    syncPieces(); drawBeam(G.res, time);
    const hitT = G.res && G.res.hit; tCore.color.setRGB(...(hitT ? [.4, 3, 1.2] : [2.5 + Math.sin(time * 4) * .5, .3, .35])); tMat.emissive.setRGB(...(hitT ? [.3, 1, .5] : [0, 0, 0])); tLight.intensity = hitT ? 1.2 + Math.sin(time * 10) * .3 : 0;
    gems.forEach((g, i) => { const onB = G.res && G.res.gems.has(i); g.on = Math.max(onB ? 1 : 0, g.on - dt * 2); g.m.rotation.y = time * (1 + g.on * 3); g.g.position.y = PY + BHW + Math.sin(time * 2 + i) * .002;
      g.m.material.emissive.setRGB(.04 + g.on * .5, .3 + g.on * 1.6, .38 + g.on * 1.8); g.h.material.opacity = .35 + g.on * .6; g.h.scale.setScalar(.04 + g.on * .012); }); }
  else { laser.visible = target.visible = false; drawBeam(null, time); }
  winFx = Math.max(0, winFx - dt * .6);
  sun.target.position.set(0, PY, 0); sun.position.copy(W.sunDir).multiplyScalar(4).add(sun.target.position);
  W.frame(dt);
}
// Önceden derleme: ilk mercek/prizma/ayna/kristalde takılma olmasın (iletim (transmission) hedefi de burada ayrılır)
async function warm() {
  const gm = makeGem(), wall = new THREE.Mesh(mirG.hold, anod), gl = new THREE.Mesh(mirG.hold, glassM), we = new THREE.LineSegments(prismEdgeG, wallEdgeM), ge = new THREE.LineSegments(prismEdgeG, glassEdgeM);
  await prewarm([makeMirror('rot'), makeMirror('lock'), makeLens('lens', 'rot'), makeLens('dlens'), makePrism(), gm.g, wall, gl, we, ge]);
  gemFree.push(gm);
}
W.loadEnv('lab').then(async () => { scene.environmentIntensity = .75; renderer.toneMappingExposure = .9; scene.backgroundBlurriness = .06; fit(); try { await warm(); } catch (e) { console.error(e); } if (G.L) buildLevel(G.L); O.show();
  window.BFY_R3D = { frame, ready: true, overlay: () => O.sync(), size: () => O, proj: (x, y, h = G.BH) => O.project(toV(x, y, h * K)),
    pick: (cx, cy) => { const r = W.canvas.getBoundingClientRect(); rc.setFromCamera(new THREE.Vector2((cx - r.left) / r.width * 2 - 1, -(cy - r.top) / r.height * 2 + 1), camera); return rc.ray.intersectPlane(pl, hit) ? { x: hit.x / K + CX, y: hit.z / K + CZ } : null; } }; });
window.__r3d = { W, scene, camera };
