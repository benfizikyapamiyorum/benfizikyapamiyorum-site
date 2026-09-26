// BFY · 3B Optik Laboratuvarı — renk karışımı + optik ray (mercek ve ayna)
import { THREE, createWorld, worldUVMaterial, canvasTex, $, clamp, lerp, smooth, fmt, DEG, isMobile } from './bfy3d-core.js';

const TY = .76;
const S = { mode: 'color', cam: 'orbit', L: { r: { on: true, k: 1 }, g: { on: true, k: 1 }, b: { on: true, k: 1 } }, obj: 'post', beam: true, labels: true,
  el: 'conv', f: .12, dO: .30, h: .06, dS: .40, rays: true, focus: true, ghost: true };

/* ---------- dünya ---------- */
const stage = $('stage'), canvas = $('c3d');
const W = createWorld({ stage, canvas, fov: 32, near: .01, far: 400, shadowBox: 1, shadowFar: 8, bloom: [.35, .5, .9] });
const { scene, camera, renderer } = W;
renderer.toneMapping = THREE.NeutralToneMapping;
W.sun.castShadow = false;
const cT = { col: W.tex('tex/concrete_col.jpg'), nor: W.tex('tex/concrete_nor.jpg', false), arm: W.tex('tex/concrete_arm.jpg', false) };
const floorMat = worldUVMaterial({ map: cT.col, normalMap: cT.nor, roughnessMap: cT.arm, tile: 1.6, tint: '#6d8a86', normalScale: .6, envMapIntensity: .5 });
floorMat.transparent = true;
{ const ob = floorMat.onBeforeCompile; floorMat.onBeforeCompile = sh => { ob(sh); sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.a *= 1.0 - smoothstep(1.8, 4.2, length(vWPos.xz));'); }; }
const floor = new THREE.Mesh(new THREE.CircleGeometry(4.5, 96).rotateX(-Math.PI / 2), floorMat); floor.receiveShadow = true; scene.add(floor);
W.gltf('models/WoodenTable_01/WoodenTable_01.gltf').then(o => { o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); o.scale.set(1, TY / .549, 1.15); o.position.set(0, 0, 0); scene.add(o); });
const black = new THREE.MeshStandardMaterial({ color: '#141517', metalness: .5, roughness: .45 });
const alu = new THREE.MeshStandardMaterial({ color: '#c9ced3', metalness: .9, roughness: .3 });
const chrome = new THREE.MeshStandardMaterial({ color: '#e6e9ec', metalness: 1, roughness: .12 });
const dimLamp = new THREE.SpotLight('#ffe9c8', 0, 3, .6, .7, 1.4); dimLamp.position.set(-.3, TY + 1.3, .8); dimLamp.target.position.set(0, TY, 0); scene.add(dimLamp, dimLamp.target);

/* =====================================================================
   A) RENK KARIŞIMI
   ===================================================================== */
const colorG = new THREE.Group(); scene.add(colorG);
const SCR = { z: -.28, w: .9, h: .58, y0: TY + .03 };
const screen = new THREE.Mesh(new THREE.BoxGeometry(SCR.w, SCR.h, .012), new THREE.MeshStandardMaterial({ color: '#f4f4f2', roughness: .97, metalness: 0 }));
screen.position.set(0, SCR.y0 + SCR.h / 2, SCR.z); screen.receiveShadow = true; colorG.add(screen);
for (const x of [-.36, .36]) { const ft = new THREE.Mesh(new THREE.BoxGeometry(.04, .03, .16), black); ft.position.set(x, TY + .015, SCR.z + .02); colorG.add(ft); }
const PROJ = [
  { k: 'r', col: '#ff0000', x: -.2, aim: new THREE.Vector3(-.085, TY + .37, SCR.z) },
  { k: 'g', col: '#00ff00', x: .2, aim: new THREE.Vector3(.085, TY + .37, SCR.z) },
  { k: 'b', col: '#0000ff', x: 0, aim: new THREE.Vector3(0, TY + .225, SCR.z) },
];
const PZ = .44, PY = TY + .12, ANG = .24;
const beamMat = col => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
  uniforms: { c: { value: new THREE.Color(col) }, k: { value: .12 } },
  vertexShader: 'varying float vT; varying vec3 vN, vV; void main(){ vT = uv.y; vec4 mv = modelViewMatrix * vec4(position,1.); vV = normalize(-mv.xyz); vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv; }',
  fragmentShader: 'uniform vec3 c; uniform float k; varying float vT; varying vec3 vN, vV; void main(){ float f = pow(abs(dot(vN, vV)), 1.6); float a = k * f * (.35 + .65 * (1. - vT)); gl_FragColor = vec4(c * a, 1.); }' });
PROJ.forEach(p => {
  const g = new THREE.Group(); colorG.add(g); p.g = g;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.042, .048, .14, 32).rotateX(Math.PI / 2), black); body.castShadow = true; g.add(body);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.04, .006, 12, 40), chrome); ring.position.z = -.072; g.add(ring);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(.036, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(p.col).multiplyScalar(3), toneMapped: false })); lens.position.z = -.0715; lens.rotation.y = Math.PI; g.add(lens); p.lens = lens;
  const fins = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .03), black); fins.position.z = .07; g.add(fins);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, PY - TY, 16), chrome); stand.position.y = -(PY - TY) / 2; g.add(stand);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(.04, .045, .012, 32), black); foot.position.y = -(PY - TY) + .006; g.add(foot);
  const L = new THREE.SpotLight(p.col, 0, 0, ANG, .18, 0); L.castShadow = true; L.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024); L.shadow.bias = -.0006; L.shadow.normalBias = .01; L.shadow.camera.near = .05; L.shadow.camera.far = 2;
  colorG.add(L, L.target); p.L = L;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1, .06, 1, 48, 1, true).translate(0, -.5, 0), beamMat(p.col)); beam.renderOrder = 8; colorG.add(beam); p.beam = beam;
  p.dir = new THREE.Vector3().subVectors(p.aim, new THREE.Vector3(p.x, PY, PZ)).normalize();
});
function layoutProj() {
  PROJ.forEach(p => {
    const pos = new THREE.Vector3(p.x, PY, PZ); p.g.position.copy(pos); p.g.lookAt(pos.clone().add(p.dir)); // grup -z yönüne bakar
    p.g.rotateY(Math.PI);
    const lensPos = pos.clone().addScaledVector(p.dir, .075); p.L.position.copy(lensPos);
    const t = (SCR.z + .007 - lensPos.z) / p.dir.z, hit = lensPos.clone().addScaledVector(p.dir, t); p.hit = hit; p.dist = t;
    p.L.target.position.copy(hit); p.L.target.updateMatrixWorld();
    const st = S.L[p.k], I = st.on ? st.k : 0; p.L.intensity = I * 3; p.lens.material.color.set(p.col).multiplyScalar(.2 + 2.8 * I);
    const R = Math.tan(ANG) * t; p.R = R * .93; // görünür daire yarıçapı (yarı gölge ortası)
    p.beam.visible = S.beam && I > 0 && S.mode === 'color'; p.beam.position.copy(hit); p.beam.scale.set(R, t, R); p.beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.dir);
    p.beam.material.uniforms.k.value = .09 * I;
  });
}
// Işık önündeki cisimler
const objG = new THREE.Group(); colorG.add(objG);
const OB = { x: 0, z: -.1 };
const post = new THREE.Mesh(new THREE.CylinderGeometry(.016, .016, .44, 32).translate(0, .22, 0), new THREE.MeshStandardMaterial({ color: '#f2f2f2', roughness: .6 })); post.castShadow = true;
const postBase = new THREE.Mesh(new THREE.CylinderGeometry(.04, .045, .012, 32).translate(0, .006, 0), black); const postG = new THREE.Group(); postG.add(post, postBase);
const cubes = new THREE.Group(); [['#d8231c', -.07], ['#1fa83a', 0], ['#2455ff', .07]].forEach(([c, x]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.05, .05, .05).translate(0, .025, 0), new THREE.MeshStandardMaterial({ color: c, roughness: .5 })); m.position.x = x; m.castShadow = true; cubes.add(m); });
const holders = { post: postG, cubes, apple: new THREE.Group(), duck: new THREE.Group() };
const standM = () => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .16, 12).translate(0, .08, 0), chrome); const b = new THREE.Mesh(new THREE.CylinderGeometry(.035, .04, .01, 24).translate(0, .005, 0), black); const plate = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .006, 24).translate(0, .163, 0), chrome); g.add(p, b, plate); return g; };
for (const [k, file, len] of [['apple', 'food_apple_01', .09], ['duck', 'rubber_duck_toy', .13]]) {
  const st = standM(); holders[k].add(st);
  W.gltf(`models/${file}/${file}.gltf`).then(src => { const m = src.clone(true); m.traverse(q => { if (q.isMesh) { q.castShadow = true; q.receiveShadow = true; } });
    const bb = new THREE.Box3().setFromObject(m), sz = new THREE.Vector3(); bb.getSize(sz); const sc = len / Math.max(sz.x, sz.z); m.scale.setScalar(sc); m.position.set(-(bb.min.x + bb.max.x) / 2 * sc, .166 - bb.min.y * sc, -(bb.min.z + bb.max.z) / 2 * sc); if (k === 'duck') m.rotation.y = .5; holders[k].add(m); });
}
Object.values(holders).forEach(h => { objG.add(h); h.visible = false; });
function setObj(k) { S.obj = k; Object.entries(holders).forEach(([n, h]) => h.visible = n === k); document.querySelectorAll('#cards-obj .a3c').forEach(b => b.classList.toggle('on', b.dataset.o === k)); }
objG.position.set(OB.x, TY, OB.z);

/* ---------- renk bölgesi etiketleri ---------- */
const NAMES = { r: 'Kırmızı', g: 'Yeşil', b: 'Mavi', rg: 'Sarı', gb: 'Camgöbeği', rb: 'Magenta', rgb: 'Beyaz' };
const TAGCOL = { r: '#ff3b30', g: '#34c759', b: '#2f6bff', rg: '#ffe23a', gb: '#3ae6ff', rb: '#ff3af0', rgb: '#ffffff' };
function colorTags() {
  const tags = [1, 2, 3, 4, 5, 6, 7].map(i => $('tag-' + i)); tags.forEach(t => t.style.display = 'none');
  if (S.mode !== 'color' || !S.labels) return;
  const act = PROJ.filter(p => S.L[p.k].on && S.L[p.k].k > .05);
  const bins = {}; const nx = 64, ny = 40;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = -SCR.w / 2 + (i + .5) / nx * SCR.w, y = SCR.y0 + (j + .5) / ny * SCR.h;
    let key = ''; for (const p of act) if (Math.hypot(x - p.hit.x, y - p.hit.y) < p.R * .96) key += p.k;
    if (!key) continue; key = ['r', 'g', 'b'].filter(c => key.includes(c)).join('');
    (bins[key] = bins[key] || [0, 0, 0]); bins[key][0] += x; bins[key][1] += y; bins[key][2]++;
  }
  let ti = 0;
  Object.entries(bins).sort((a, b) => b[1][2] - a[1][2]).forEach(([k, [sx, sy, n]]) => { if (n < 12 || ti >= 7) return; const el = tags[ti++];
    W.tag(el, new THREE.Vector3(sx / n, sy / n + .012, SCR.z + .01), NAMES[k]); el.style.background = TAGCOL[k]; el.style.color = k === 'b' || k === 'r' ? '#fff' : '#111'; });
}

/* =====================================================================
   B) OPTİK RAY: mercek / ayna
   ===================================================================== */
const benchG = new THREE.Group(); scene.add(benchG); benchG.visible = false;
const RZ = .05, AY = TY + .21, RAIL = .62;
{ const railTex = canvasTex(2048, 64, (g, w, h) => { g.fillStyle = '#c3c8cd'; g.fillRect(0, 0, w, h); g.fillStyle = '#16181a'; g.font = '700 22px Arial'; g.textAlign = 'center';
    for (let cm = -62; cm <= 62; cm++) { const x = (cm + 62) / 124 * w; const L = cm % 10 === 0 ? 34 : cm % 5 === 0 ? 24 : 14; g.fillRect(x - 1, 0, 2, L); if (cm % 10 === 0) g.fillText(Math.abs(cm), x, 58); } });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(RAIL * 2, .022, .05), [alu, alu, new THREE.MeshStandardMaterial({ map: railTex, metalness: .6, roughness: .35 }), alu, alu, alu]); rail.position.set(0, TY + .011, RZ); rail.castShadow = rail.receiveShadow = true; benchG.add(rail);
  for (const x of [-RAIL + .05, RAIL - .05]) { const ft = new THREE.Mesh(new THREE.BoxGeometry(.04, .012, .12), black); ft.position.set(x, TY + .006, RZ); benchG.add(ft); } }
const carrier = () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(.05, .024, .07), black); b.position.y = TY + .034; b.castShadow = true; g.add(b); const knob = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .02, 16).rotateX(Math.PI / 2), chrome); knob.position.set(0, TY + .034, RZ + .045 - RZ); g.add(knob); return g; };
const postTo = (h) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.005, .005, h, 16).translate(0, h / 2, 0), chrome); m.position.y = TY + .046; return m; };
// Eleman
const elG = new THREE.Group(); elG.position.set(0, 0, RZ); benchG.add(elG);
elG.add(carrier());
const elPost = postTo(AY - TY - .046 - .055); elG.add(elPost);
const glassMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, roughness: 0, ior: 1.52, thickness: .012, envMapIntensity: 1.2, attenuationColor: new THREE.Color('#d8f2ff'), attenuationDistance: .4 });
function lensGeo(conv) { const a = .052, pts = []; const n = 24;
  for (let i = 0; i <= n; i++) { const r = a * i / n; const t = conv ? .0065 * (1 - (r / a) ** 2) + .0012 : .0022 + .0055 * (r / a) ** 2; pts.push(new THREE.Vector2(r, t)); }
  for (let i = n; i >= 0; i--) { const r = a * i / n; const t = conv ? .0065 * (1 - (r / a) ** 2) + .0012 : .0022 + .0055 * (r / a) ** 2; pts.push(new THREE.Vector2(r, -t)); }
  const g = new THREE.LatheGeometry(pts, 64); g.rotateZ(Math.PI / 2); return g; }
const lensConv = new THREE.Mesh(lensGeo(true), glassMat), lensDiv = new THREE.Mesh(lensGeo(false), glassMat);
const lensRing = new THREE.Mesh(new THREE.TorusGeometry(.055, .004, 12, 64).rotateY(Math.PI / 2), black);
const mirrorMat = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 1, roughness: .03, envMapIntensity: 1.3, side: THREE.DoubleSide });
function mirrorGeo(concave) { const R = .26, a = .05, th = Math.asin(a / R); const g = new THREE.SphereGeometry(R, 64, 16, 0, Math.PI * 2, 0, th); g.rotateZ(concave ? -Math.PI / 2 : Math.PI / 2); g.translate(concave ? -R : R, 0, 0); return g; }
const mirCave = new THREE.Mesh(mirrorGeo(true), mirrorMat), mirVex = new THREE.Mesh(mirrorGeo(false), mirrorMat);
const mirBack = new THREE.Mesh(new THREE.CylinderGeometry(.053, .053, .006, 48).rotateZ(Math.PI / 2), black);
[lensConv, lensDiv, lensRing, mirCave, mirVex, mirBack].forEach(m => { m.position.y = AY; m.castShadow = true; elG.add(m); });
function showElement() { const e = S.el; lensConv.visible = e === 'conv'; lensDiv.visible = e === 'div'; lensRing.visible = e === 'conv' || e === 'div'; mirCave.visible = e === 'concave'; mirVex.visible = e === 'convex'; mirBack.visible = e === 'concave' || e === 'convex'; mirBack.position.x = e === 'concave' ? .012 : e === 'convex' ? .012 : 0; }
// Mum (cisim)
function candle(h, ghost = false) {
  const g = new THREE.Group(); const hw = h - .02;
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(.011, .012, hw, 32).translate(0, hw / 2, 0), ghost ? new THREE.MeshStandardMaterial({ color: '#fff0d8', transparent: true, opacity: .55, emissive: '#5a3a10', emissiveIntensity: .4 }) : new THREE.MeshPhysicalMaterial({ color: '#fbf1dc', roughness: .5, transmission: .15, thickness: .02 }));
  wax.castShadow = !ghost; g.add(wax);
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(.0009, .0009, .006, 6).translate(0, hw + .003, 0), new THREE.MeshBasicMaterial({ color: '#222' })); g.add(wick);
  const fg = new THREE.SphereGeometry(1, 24, 16); { const p = fg.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); const k = y > 0 ? 1 - y * .75 : 1; p.setXYZ(i, p.getX(i) * .0055 * k, (y + 1) * .0095, p.getZ(i) * .0055 * k); } fg.computeVertexNormals(); }
  const flame = new THREE.Mesh(fg, new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb040').multiplyScalar(ghost ? 1.8 : 3.2), transparent: ghost, opacity: ghost ? .8 : 1, toneMapped: false })); flame.position.y = hw + .001; g.add(flame);
  const core = new THREE.Mesh(fg, new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff4d0').multiplyScalar(3.5), toneMapped: false })); core.scale.setScalar(.5); core.position.y = hw + .002; if (!ghost) g.add(core);
  g.userData = { flame, wax, h }; return g;
}
const candleG = new THREE.Group(); benchG.add(candleG); candleG.add(carrier()); const candlePost = postTo(AY - TY - .046); candleG.add(candlePost);
let candleM = candle(S.h); candleM.position.y = AY; candleG.add(candleM);
const flameLight = new THREE.PointLight('#ffae4a', .35, .8, 2); candleG.add(flameLight);
let ghostM = candle(S.h, true); benchG.add(ghostM);
// Ekran
const scrTexC = document.createElement('canvas'); scrTexC.width = scrTexC.height = 256; const scrTex = new THREE.CanvasTexture(scrTexC); scrTex.colorSpace = THREE.SRGBColorSpace;
const scrG = new THREE.Group(); benchG.add(scrG); scrG.add(carrier()); scrG.add(postTo(AY - TY - .046 - .07));
const cardMat = new THREE.MeshStandardMaterial({ color: '#57534c', roughness: .95, emissiveMap: scrTex, emissive: '#ffffff', emissiveIntensity: 3.2 });
const card = new THREE.Mesh(new THREE.BoxGeometry(.004, .16, .16), [cardMat, cardMat, black, black, black, black]);
card.position.y = AY; card.castShadow = true; scrG.add(card);
// Işınlar ve işaretler
const rayMats = ['#ff7a3d', '#39d0ff', '#ff4fd8'].map(c => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(2.2), toneMapped: false, transparent: true, opacity: .95 }));
const rayMatsDash = rayMats.map(m => { const q = m.clone(); q.opacity = .55; return q; });
const segGeo = new THREE.CylinderGeometry(.0011, .0011, 1, 8);
const rayPool = []; let rayUsed = 0;
function seg(a, b, mat) { let m = rayPool[rayUsed]; if (!m) { m = new THREE.Mesh(segGeo, mat); benchG.add(m); rayPool.push(m); } m.material = mat; m.visible = true; W.orient(m, a, b); rayUsed++; }
function dashed(a, b, mat) { const d = b.clone().sub(a), L = d.length(), n = Math.max(1, Math.floor(L / .012)); for (let i = 0; i < n; i += 2) seg(a.clone().addScaledVector(d, i / n), a.clone().addScaledVector(d, Math.min(1, (i + 1) / n)), mat); }
const fMarks = [0, 1, 2, 3].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(.0045, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color('#4aa3ff').multiplyScalar(2.2), toneMapped: false })); benchG.add(m); return m; });
const axisLine = new THREE.Mesh(new THREE.CylinderGeometry(.0006, .0006, RAIL * 2, 6).rotateZ(Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(.6), transparent: true, opacity: .35, toneMapped: false })); axisLine.position.set(0, AY, RZ); benchG.add(axisLine);

function optics() {
  const isMir = S.el === 'concave' || S.el === 'convex';
  const f = (S.el === 'conv' || S.el === 'concave') ? S.f : -S.f, dO = S.dO, h = S.h;
  const inv = 1 / f - 1 / dO, dI = Math.abs(inv) < 1e-6 ? Infinity : 1 / inv, m = isFinite(dI) ? -dI / dO : Infinity;
  const real = isFinite(dI) && dI > 0;
  const xImg = isFinite(dI) ? (isMir ? -dI : dI) : NaN;
  return { isMir, f, dO, h, dI, m, real, xImg };
}
function layoutBench() {
  const O = optics(); const X0 = -S.dO;
  candleG.position.set(X0, 0, RZ);
  if (candleM.userData.h !== S.h) { candleG.remove(candleM); candleM = candle(S.h); candleM.position.y = AY; candleG.add(candleM); benchG.remove(ghostM); ghostM = candle(S.h, true); benchG.add(ghostM); }
  flameLight.position.set(0, AY + S.h, 0);
  candleM.userData.flame.scale.set(1, 1 + Math.sin(performance.now() * .013) * .06, 1);
  // ekran: mercekte sağda, aynada solda (eksenden biraz geride)
  const sx = O.isMir ? -S.dS : S.dS; scrG.position.set(sx, 0, O.isMir ? RZ - .085 : RZ);
  card.visible = true;
  // odaklar
  const F = Math.abs(O.f); [[-F], [F], [-2 * F], [2 * F]].forEach(([x], i) => { fMarks[i].position.set(x, AY, RZ); fMarks[i].visible = S.focus && Math.abs(x) < RAIL; });
  // ışınlar
  rayUsed = 0;
  if (S.rays) {
    const P = new THREE.Vector3(X0, AY + O.h, RZ), toW = (x, y) => new THREE.Vector3(x, AY + y, RZ);
    const rays = [];
    rays.push({ y: O.h, s: 0 });                                   // paralel gelen
    rays.push({ y: 0, s: -O.h / O.dO });                           // merkez / tepe
    if (Math.abs(O.dO - O.f) > .004) { const s = -O.h / (O.dO - O.f); rays.push({ y: O.h + s * O.dO, s }); } // odağa doğru
    rays.forEach((r, i) => {
      const mat = rayMats[i], md = rayMatsDash[i];
      const hitX = 0; seg(P, toW(hitX, r.y), mat);
      let sOut = r.s - r.y / O.f;
      const L = .62;
      if (!O.isMir) { seg(toW(0, r.y), toW(L, r.y + sOut * L), mat); if (!O.real && isFinite(O.dI)) dashed(toW(0, r.y), toW(O.dI, r.y + sOut * O.dI), md); }
      else { seg(toW(0, r.y), toW(-L, r.y + sOut * L), mat); if (!O.real && isFinite(O.dI)) dashed(toW(0, r.y), toW(-O.dI, r.y + sOut * O.dI), md); }
    });
  }
  for (let i = rayUsed; i < rayPool.length; i++) rayPool[i].visible = false;
  // görüntü hayaleti
  const onScr = O.real && isFinite(O.xImg) && Math.abs(sx - O.xImg) < .006;
  if (S.ghost && !onScr && isFinite(O.m) && Math.abs(O.xImg) < RAIL + .1 && Math.abs(O.m) < 6) {
    ghostM.visible = true; ghostM.position.set(O.xImg, AY, RZ); ghostM.scale.set(Math.abs(O.m), O.m, Math.abs(O.m)); // m<0 → ters
    ghostM.userData.wax.material.opacity = O.real ? .75 : .3; ghostM.userData.flame.material.opacity = O.real ? .9 : .4;
  } else ghostM.visible = false;
  // ekrandaki görüntü
  drawScreen(O, sx);
  return O;
}
let lastScr = '';
function drawScreen(O, sx) {
  const defocus = O.real && isFinite(O.xImg) ? Math.abs(sx - O.xImg) : 1;
  const key = [O.real, Math.round(defocus * 1000), Math.round(O.m * 100), S.h].join('|'); if (key === lastScr) return; lastScr = key;
  const g = scrTexC.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 256, 256);
  if (!O.real || !isFinite(O.m)) { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 130); gr.addColorStop(0, 'rgba(255,170,80,.10)'); gr.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); scrTex.needsUpdate = true; return; }
  const px = 256 / .16, blur = clamp(defocus * 1100, 0, 46), H = Math.abs(O.m * O.h * px), sgn = O.m < 0 ? 1 : -1; // ters görüntü tuvalde aşağı
  const sharp = clamp(1 - defocus * 14, 0, 1);
  // bulanıkken ışık geniş bir lekeye yayılır
  const spot = g.createRadialGradient(128, 128 + sgn * H * .8, 0, 128, 128 + sgn * H * .8, 18 + blur * 2.2); spot.addColorStop(0, `rgba(255,190,90,${.55 * (1 - sharp) + .08})`); spot.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = spot; g.fillRect(0, 0, 256, 256);
  g.save(); g.filter = `blur(${blur.toFixed(1)}px)`; g.translate(128, 128); g.globalAlpha = .35 + .65 * sharp;
  const w = Math.max(3, H * .19);
  g.fillStyle = 'rgba(235,200,150,.8)'; g.fillRect(-w / 2, 0, w, sgn * H * .72);                 // alevin aydınlattığı mum gövdesi
  const fy = sgn * H * .86, fr = Math.max(2.5, H * .1);
  const gr = g.createRadialGradient(0, fy, 0, 0, fy, fr * 2.2); gr.addColorStop(0, 'rgba(255,255,235,1)'); gr.addColorStop(.35, 'rgba(255,200,90,.95)'); gr.addColorStop(1, 'rgba(255,110,20,0)');
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, fy, fr * 1.1, fr * 2.2, 0, 0, 7); g.fill(); g.restore();
  scrTex.needsUpdate = true;
}
function imgText(O) {
  if (!isFinite(O.dI)) return 'Cisim odakta: ışınlar paralel çıkar, görüntü oluşmaz (sonsuzda).';
  const kind = O.real ? 'Gerçek' : 'Sanal', dir = O.m < 0 ? 'ters' : 'düz', size = Math.abs(O.m) > 1.02 ? 'büyük' : Math.abs(O.m) < .98 ? 'küçük' : 'eşit boy';
  return `${kind} · ${dir} · ${size}`;
}

/* =====================================================================
   Etkileşim
   ===================================================================== */
let drag = null; const dragPlane = new THREE.Plane();
W.pointerHook = (type, e) => {
  if (type === 'down') {
    const rc = W.ray(e);
    if (S.mode === 'color') {
      const targets = [...PROJ.map(p => p.g), objG]; const hit = rc.intersectObjects(targets, true); if (!hit.length) return false;
      let o = hit[0].object; while (o && !targets.includes(o)) o = o.parent; dragPlane.set(new THREE.Vector3(0, 1, 0), -(o === objG ? TY : PY)); drag = { o, p: PROJ.find(p => p.g === o) }; return true;
    } else {
      const targets = [candleG, scrG]; const hit = rc.intersectObjects(targets, true); if (!hit.length) return false;
      let o = hit[0].object; while (o && !targets.includes(o)) o = o.parent; dragPlane.set(new THREE.Vector3(0, 0, 1), -RZ); drag = { o }; return true;
    }
  }
  if (type === 'move' && drag) { const pt = new THREE.Vector3(); if (!W.ray(e).ray.intersectPlane(dragPlane, pt)) return;
    if (drag.p) { drag.p.x = clamp(pt.x, -.42, .42); }
    else if (drag.o === objG) { OB.x = clamp(pt.x, -.35, .35); OB.z = clamp(pt.z, -.18, .3); objG.position.set(OB.x, TY, OB.z); }
    else if (drag.o === candleG) { const isMir = S.el === 'concave' || S.el === 'convex'; S.dO = clamp(-pt.x, .03, .55); $('i-do').value = (S.dO * 100).toFixed(1); updBenchLabels(); }
    else if (drag.o === scrG) { const isMir = S.el === 'concave' || S.el === 'convex'; S.dS = clamp(isMir ? -pt.x : pt.x, .05, .58); $('i-s').value = (S.dS * 100).toFixed(1); updBenchLabels(); } }
  if (type === 'up') drag = null;
};

/* =====================================================================
   Arayüz
   ===================================================================== */
const toastEl = $('toast'); let toastT = 0; const toast = m => { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 3400); };
const segs = (id, fn) => { const el = $(id); el.querySelectorAll('button').forEach(b => b.onclick = () => { el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); fn(b); }); };
segs('seg-mode', b => setMode(b.dataset.m));
segs('seg-cam', b => { S.cam = b.dataset.cam; setCam(); });
document.querySelectorAll('#lights button').forEach(b => b.onclick = () => { const k = b.dataset.l; S.L[k].on = !S.L[k].on; b.classList.toggle('on', S.L[k].on); });
['r', 'g', 'b'].forEach(k => $('i-' + k).addEventListener('input', e => { S.L[k].k = +e.target.value; $('o-' + k).textContent = '%' + Math.round(S.L[k].k * 100); }));
document.querySelectorAll('#cards-obj .a3c').forEach(b => b.onclick = () => { setObj(b.dataset.o); if (b.dataset.o === 'apple') toast('Kırmızı elmayı yalnızca yeşil ya da mavi ışıkla aydınlat: nasıl görünüyor?'); if (b.dataset.o === 'cubes') toast('Işıkları tek tek kapatıp aç: her küp yalnızca kendi rengini yansıtır.'); });
document.querySelectorAll('#cards-el .a3c').forEach(b => b.onclick = () => { S.el = b.dataset.e; document.querySelectorAll('#cards-el .a3c').forEach(x => x.classList.toggle('on', x === b)); showElement(); updBenchLabels(); });
const bindR = (id, fn) => $(id).addEventListener('input', e => { fn(+e.target.value); updBenchLabels(); });
bindR('i-f', v => S.f = v / 100); bindR('i-do', v => S.dO = v / 100); bindR('i-h', v => S.h = v / 100); bindR('i-s', v => S.dS = v / 100);
$('btn-snap').onclick = () => { const O = optics(); if (!O.real) { toast('Sanal görüntü ekrana düşmez: ekranı nereye koyarsan koy görüntü toplanmaz.'); return; } const d = Math.abs(O.xImg); if (d > .58) { toast('Görüntü rayın dışında kalıyor; cismi uzaklaştır.'); return; } animateScreen(d); };
let snapAnim = null; function animateScreen(d) { snapAnim = { from: S.dS, to: d, t: 0 }; }
const tg = (id, k) => $(id).addEventListener('click', e => { S[k] = !S[k]; e.currentTarget.classList.toggle('on', S[k]); });
tg('tg-beam', 'beam'); tg('tg-labels', 'labels'); tg('tg-rays', 'rays'); tg('tg-focus', 'focus'); tg('tg-ghost', 'ghost');
function updBenchLabels() {
  $('o-f').textContent = fmt(S.f * 100, S.f * 100 % 1 ? 1 : 0) + ' cm'; $('o-do').textContent = fmt(S.dO * 100, S.dO * 100 % 1 ? 1 : 0) + ' cm'; $('o-h').textContent = fmt(S.h * 100, S.h * 100 % 1 ? 1 : 0) + ' cm'; $('o-s').textContent = fmt(S.dS * 100, S.dS * 100 % 1 ? 1 : 0) + ' cm';
}
function setMode(m) {
  S.mode = m; colorG.visible = m === 'color'; benchG.visible = m === 'bench';
  ['p-color', 'tg-color', 'learn-color'].forEach(id => $(id).style.display = m === 'color' ? '' : 'none'); ['p-bench', 'tg-bench', 'learn-bench'].forEach(id => $(id).style.display = m === 'bench' ? '' : 'none');
  $('tg-color').style.display = m === 'color' ? 'flex' : 'none'; $('tg-bench').style.display = m === 'bench' ? 'flex' : 'none';
  $('learn-color').style.display = m === 'color' ? 'grid' : 'none'; $('learn-bench').style.display = m === 'bench' ? 'grid' : 'none';
  // oda ışığı: renk karışımında karanlık, rayda loş
  scene.backgroundIntensity = m === 'color' ? .045 : .16; scene.environmentIntensity = m === 'color' ? .03 : .22; W.hemi.intensity = m === 'color' ? .01 : .06; W.sun.intensity = 0; dimLamp.intensity = m === 'color' ? 0 : 2.2;
  PROJ.forEach(p => p.L.visible = m === 'color'); flameLight.visible = m === 'bench';
  $('h-mode').innerHTML = m === 'color' ? 'Renk karışımı<small>Işıklar toplanır</small>' : 'Optik ray<small>Mercek ve ayna</small>';
  [1, 2, 3, 4, 5, 6, 7].forEach(i => $('tag-' + i).style.display = 'none');
  setCam();
}
function setCam() { const o = W.orbit; o.auto = 0;
  if (S.mode === 'color') { if (S.cam === 'front') { o.target.set(0, TY + .3, -.05); o.r = 1.55; o.th = 0; o.ph = 1.45; } else if (S.cam === 'side') { o.target.set(0, TY + .25, 0); o.r = 1.4; o.th = 1.25; o.ph = 1.3; } else { o.target.set(0, TY + .28, -.02); o.r = 1.55; o.th = .55; o.ph = 1.28; } }
  else { if (S.cam === 'front') { o.target.set(0, AY, RZ); o.r = 1.35; o.th = 0; o.ph = 1.5; } else if (S.cam === 'side') { o.target.set(0, AY, RZ); o.r = .9; o.th = -1.1; o.ph = 1.35; } else { o.target.set(-.02, AY - .02, RZ); o.r = 1.3; o.th = .45; o.ph = 1.3; } } }
W.bindFullscreen($('btn-full'));

/* ---------- döngü ---------- */
let time = 0, lastUI = 0;
W.update = dt => {
  time += dt;
  if (snapAnim) { snapAnim.t += dt / .7; const k = smooth(0, 1, Math.min(1, snapAnim.t)); S.dS = lerp(snapAnim.from, snapAnim.to, k); $('i-s').value = (S.dS * 100).toFixed(1); updBenchLabels(); if (snapAnim.t >= 1) { snapAnim = null; toast('Ekranda net görüntü!'); } }
  if (S.mode === 'color') { layoutProj(); } else { const O = layoutBench(); if (time - lastUI > .1) { lastUI = time; benchUI(O); } }
  W.updateOrbit(dt, 5);
  if (S.mode === 'color' && time - lastUI > .1) { lastUI = time; colorTags(); colorUI(); }
};
function colorUI() {
  $('hud').innerHTML = ['r', 'g', 'b'].map(k => `<div class="a3p" style="box-shadow:inset 3px 0 0 ${k === 'r' ? '#ff3b30' : k === 'g' ? '#34c759' : '#2f6bff'}"><small>${k === 'r' ? 'Kırmızı' : k === 'g' ? 'Yeşil' : 'Mavi'}</small><span>${S.L[k].on ? '%' + Math.round(S.L[k].k * 100) : 'Kapalı'}</span></div>`).join('');
}
function benchUI(O) {
  const cm = v => fmt(v * 100, 1) + ' cm';
  $('hud').innerHTML = `<div class="a3p"><small>f</small><span>${fmt(O.f * 100, 1)} cm</span></div><div class="a3p"><small>d<sub>o</sub></small><span>${cm(O.dO)}</span></div><div class="a3p v"><small>d<sub>g</sub></small><span>${isFinite(O.dI) ? cm(O.dI) : '∞'}</span></div><div class="a3p"><small>Büyütme m</small><span>${isFinite(O.m) ? fmt(O.m, 2) : '∞'}</span></div>`;
  const onScreen = O.real && isFinite(O.xImg) && Math.abs((O.isMir ? -S.dS : S.dS) - O.xImg) < .008;
  $('imginfo').innerHTML = `<b>Görüntü:</b> ${imgText(O)}<br>1/f = 1/d<sub>o</sub> + 1/d<sub>g</sub> → 1/${fmt(O.f * 100, 1)} = 1/${fmt(O.dO * 100, 1)} + 1/${isFinite(O.dI) ? fmt(O.dI * 100, 1) : '∞'}<br>${O.real ? (onScreen ? '✅ Ekranda net görüntü var.' : 'Ekranı görüntünün yerine götürürsen net görüntü oluşur.') : 'Sanal görüntü: ekranda toplanmaz, göz ancak ' + (O.isMir ? 'aynaya' : 'merceğe') + ' bakınca görür.'}`;
  const t1 = $('tag-1'), t2 = $('tag-2'); t1.style.background = t2.style.background = 'rgba(14,12,8,.86)'; t1.style.color = t2.style.color = '#fff';
  if (S.focus) { W.tag(t1, new THREE.Vector3(-Math.abs(O.f), AY - .012, RZ), 'F'); W.tag(t2, new THREE.Vector3(Math.abs(O.f), AY - .012, RZ), 'F'); } else { t1.style.display = t2.style.display = 'none'; }
  const t3 = $('tag-3'); if (ghostM.visible) { t3.style.background = '#f2c230'; t3.style.color = '#1c1403'; W.tag(t3, new THREE.Vector3(O.xImg, AY + (O.m < 0 ? O.m * O.h - .02 : O.m * O.h + .03), RZ), O.real ? 'Gerçek görüntü' : 'Sanal görüntü'); } else t3.style.display = 'none';
}

/* ---------- başlat ---------- */
W.orbit.minR = .3; W.orbit.maxR = 4; W.orbit.minPh = .3;
setObj('post'); showElement(); updBenchLabels();
W.loadEnv('lab').then(() => { setMode('color'); W.orbit.th = 1.3; W.orbit.r = 2.2; camera.position.copy(W.orbitPos()); W.orbit.look.copy(W.orbit.target); setTimeout(() => { setCam(); W.orbit.auto = .03; }, 200); W.start(); });
window.__bfyLab = { W, S, setMode, setObj, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) W.update(1 / 60); } };
