// BFY · 3B Enerji ve Sarkaç Laboratuvarı
import { THREE, createWorld, Arrow, worldUVMaterial, canvasTex, $, clamp, lerp, smooth, fmt, DEG, isMobile } from './bfy3d-core.js';

const TY = .76, TOPY = TY + 1.16, PIV = new THREE.Vector3(0, TOPY - .03, 0);
const BRASS_RHO = 8500;
const S = { L: .8, th0: 30 * DEG, m: 1, b: 0, g: 9.8, cmp: 'none', run: false, speed: 1, tubes: true, vec: true, force: false, trail: true, cam: 'orbit', gk: 'E' };
const bobR = m => Math.cbrt(3 * m / (4 * Math.PI * BRASS_RHO));

/* ---------- dünya ---------- */
const stage = $('stage'), canvas = $('c3d');
const W = createWorld({ stage, canvas, fov: 32, near: .01, far: 400, shadowBox: 1.4, shadowFar: 8, bloom: [.2, .45, .95] });
const { scene, camera } = W;
W.sun.castShadow = false;
camera.position.set(1.2, 1.5, 2.4);

// zemin + masa
const cT = { col: W.tex('tex/concrete_col.jpg'), nor: W.tex('tex/concrete_nor.jpg', false), arm: W.tex('tex/concrete_arm.jpg', false) };
const floorMat = worldUVMaterial({ map: cT.col, normalMap: cT.nor, roughnessMap: cT.arm, tile: 1.6, tint: '#6d8a86', normalScale: .6, envMapIntensity: .5 });
floorMat.transparent = true;
{ const ob = floorMat.onBeforeCompile; floorMat.onBeforeCompile = sh => { ob(sh); sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.a *= 1.0 - smoothstep(1.8, 4.2, length(vWPos.xz));'); }; }
const floor = new THREE.Mesh(new THREE.CircleGeometry(4.5, 96).rotateX(-Math.PI / 2), floorMat); floor.receiveShadow = true; scene.add(floor);
W.gltf('models/WoodenTable_01/WoodenTable_01.gltf').then(o => { o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); o.scale.set(1, TY / .549, 1.15); o.position.set(.1, 0, 0); scene.add(o); });
W.gltf('models/chemistry_set/chemistry_set.gltf').then(o => { o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); o.scale.setScalar(.65); o.position.set(-.62, TY, -.16); o.rotation.y = .25; scene.add(o); });
const lamp = new THREE.SpotLight('#fff4e2', 9, 4.5, .55, .6, 1.3); lamp.position.set(.3, TY + 2.1, .9); lamp.target.position.set(0, TY + .4, 0); lamp.castShadow = true;
lamp.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048); lamp.shadow.bias = -.0003; scene.add(lamp, lamp.target);

/* ---------- askı düzeneği ---------- */
const chrome = new THREE.MeshStandardMaterial({ color: '#e3e6ea', metalness: 1, roughness: .13 });
const black = new THREE.MeshStandardMaterial({ color: '#1a1b1d', metalness: .5, roughness: .45 });
const brass = new THREE.MeshStandardMaterial({ color: '#d8a64e', metalness: 1, roughness: .2 });
const brassDark = new THREE.MeshStandardMaterial({ color: '#b48a3e', metalness: 1, roughness: .3 });
{
  const base = new THREE.Mesh(new THREE.BoxGeometry(.16, .025, .5), black); base.position.set(0, TY + .0125, 0); base.castShadow = base.receiveShadow = true; scene.add(base);
  for (const z of [-.2, .2]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, TOPY - TY, 24), chrome); r.position.set(0, (TOPY + TY) / 2, z); r.castShadow = true; scene.add(r);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(.018, .02, .03, 24), black); foot.position.set(0, TY + .04, z); scene.add(foot); }
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(.009, .009, .44, 24).rotateX(Math.PI / 2), chrome); bar.position.set(0, TOPY, 0); bar.castShadow = true; scene.add(bar);
  for (const z of [-.2, .2]) { const c = new THREE.Mesh(new THREE.BoxGeometry(.03, .03, .03), black); c.position.set(0, TOPY, z); scene.add(c); }
}
// Açıölçer (akrilik yarım daire)
const protTex = canvasTex(1024, 512, (g, w, h) => { g.clearRect(0, 0, w, h); const cx = w / 2, cy = 0, R = 500;
  g.fillStyle = 'rgba(230,245,255,.16)'; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, 0, Math.PI); g.fill();
  g.strokeStyle = 'rgba(20,30,40,.85)'; g.fillStyle = 'rgba(20,30,40,.9)'; g.textAlign = 'center'; g.font = '700 26px Arial';
  for (let d = -90; d <= 90; d++) { const a = Math.PI / 2 + d * DEG, L = d % 10 === 0 ? 46 : d % 5 === 0 ? 30 : 16; g.lineWidth = d % 10 === 0 ? 3 : 1.6;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.lineTo(cx + Math.cos(a) * (R - L), cy + Math.sin(a) * (R - L)); g.stroke();
    if (d % 10 === 0 && Math.abs(d) < 90) { const rr = R - 70; g.save(); g.translate(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); g.rotate(a - Math.PI / 2); g.fillText(Math.abs(d) + '°', 0, 8); g.restore(); } }
  g.lineWidth = 2; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, R); g.stroke(); });
const prot = new THREE.Mesh(new THREE.PlaneGeometry(.44, .22), new THREE.MeshBasicMaterial({ map: protTex, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: true }));
prot.position.set(PIV.x, PIV.y - .11, -.022); prot.renderOrder = 3; scene.add(prot);

/* ---------- sarkaçlar ---------- */
function makePend(z) {
  const g = new THREE.Group(); scene.add(g);
  const clampM = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .03, 24).rotateX(Math.PI / 2), black); clampM.position.set(PIV.x, PIV.y + .015, z); g.add(clampM);
  const str = new THREE.Mesh(new THREE.CylinderGeometry(.0009, .0009, 1, 6), new THREE.MeshStandardMaterial({ color: '#f1ece0', roughness: .8 })); str.castShadow = true; g.add(str);
  const bob = new THREE.Group(); g.add(bob);
  const sph = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), brass); sph.castShadow = true; bob.add(sph);
  const hookM = new THREE.Mesh(new THREE.CylinderGeometry(.18, .26, .5, 20), brassDark); bob.add(hookM);
  const P = { z, g, str, bob, sph, hookM, L: S.L, m: S.m, th: S.th0, w: 0, E0: 0, t: 0, lastCross: -1, T: 0, trail: [], pivot: new THREE.Vector3(PIV.x, PIV.y, z) };
  return P;
}
const P1 = makePend(0), P2 = makePend(.1); P2.g.visible = false;
const trailGeo = n => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 4), 4)); return g; };
const TRN = 260;
const trails = [P1, P2].map(p => { const l = new THREE.Line(trailGeo(TRN), new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, toneMapped: false })); l.frustumCulled = false; scene.add(l); return l; });

function layoutPend(P) {
  const r = bobR(P.m), bx = P.pivot.x + Math.sin(P.th) * P.L, by = P.pivot.y - Math.cos(P.th) * P.L;
  const c = new THREE.Vector3(bx, by, P.z);
  P.bob.position.copy(c); P.sph.scale.setScalar(r); P.hookM.scale.setScalar(r * .5); P.hookM.position.set(0, r * 1.05, 0);
  P.bob.rotation.z = P.th;
  const top = P.pivot.clone(), bot = c.clone().add(new THREE.Vector3(-Math.sin(P.th), Math.cos(P.th), 0).multiplyScalar(r * 1.25));
  W.orient(P.str, bot, top);
  return c;
}
function energies(P) { const v = P.L * P.w; const KE = .5 * P.m * v * v, PE = P.m * S.g * P.L * (1 - Math.cos(P.th)); return { KE, PE, Q: Math.max(0, P.E0 - KE - PE), v, h: P.L * (1 - Math.cos(P.th)) }; }
function reset(P, th) { P.th = th; P.w = 0; P.t = 0; P.lastCross = -1; P.T = 0; P.E0 = P.m * S.g * P.L * (1 - Math.cos(th)); P.trail.length = 0; }
function stepP(P, h) {
  const c = S.b * .55, gL = S.g / P.L;
  const f = (th, w) => [w, -gL * Math.sin(th) - c * w];
  const [k1a, k1b] = f(P.th, P.w), [k2a, k2b] = f(P.th + k1a * h / 2, P.w + k1b * h / 2), [k3a, k3b] = f(P.th + k2a * h / 2, P.w + k2b * h / 2), [k4a, k4b] = f(P.th + k3a * h, P.w + k3b * h);
  const thN = P.th + h / 6 * (k1a + 2 * k2a + 2 * k3a + k4a), wN = P.w + h / 6 * (k1b + 2 * k2b + 2 * k3b + k4b);
  if (P.th < 0 && thN >= 0 && wN > 0) { const tc = P.t + h * (-P.th) / (thN - P.th); if (P.lastCross >= 0) P.T = tc - P.lastCross; P.lastCross = tc; }
  P.th = thN; P.w = wN; P.t += h;
}
function syncCompare() {
  P2.g.visible = trails[1].visible = S.cmp !== 'none';
  P1.L = S.L; P1.m = S.m;
  P2.L = S.cmp === 'len' ? S.L / 4 : S.L; P2.m = S.cmp === 'mass' ? S.m / 4 : S.m;
}

/* ---------- enerji tüpleri ---------- */
const TUBE = { x: .44, z: .06, h: .32, r: .03, gap: .1 };
const tubeGlass = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: .18, roughness: .04, envMapIntensity: 1.5, side: THREE.DoubleSide, depthWrite: false });
const tubes = [['KE', '#ff7a3d'], ['PE', '#3d8bff'], ['Q', '#9a9a9a']].map(([k, col], i) => {
  const g = new THREE.Group(); g.position.set(TUBE.x + i * TUBE.gap, TY, TUBE.z); scene.add(g);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r, TUBE.r, TUBE.h, 40, 1, true), tubeGlass); glass.position.y = TUBE.h / 2 + .012; glass.renderOrder = 5; g.add(glass);
  const baseM = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r * 1.35, TUBE.r * 1.45, .012, 40), black); baseM.position.y = .006; baseM.castShadow = true; g.add(baseM);
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(TUBE.r * .86, TUBE.r * .86, 1, 40).translate(0, .5, 0), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .9, roughness: .3, transparent: true, opacity: .92 })); liq.position.y = .012; g.add(liq);
  const cap = new THREE.Mesh(new THREE.TorusGeometry(TUBE.r, .003, 10, 40).rotateX(Math.PI / 2), chrome); cap.position.y = TUBE.h + .012; g.add(cap);
  const light = new THREE.PointLight(col, 0, .5, 2); light.position.y = .15; g.add(light);
  return { g, liq, light, k };
});
const plaque = new THREE.Mesh(new THREE.PlaneGeometry(.26, .05), new THREE.MeshStandardMaterial({ map: canvasTex(512, 100, (g2, w, h) => { g2.fillStyle = '#0e0c08'; g2.fillRect(0, 0, w, h); g2.fillStyle = '#fff'; g2.font = '800 44px "Plus Jakarta Sans", Arial'; g2.textAlign = 'center'; g2.fillText('E = KE + PE + Q', w / 2, 66); }), roughness: .5 }));
plaque.position.set(TUBE.x + TUBE.gap, TY + .026, TUBE.z + .07); plaque.rotation.x = -.6; scene.add(plaque);

/* ---------- oklar ---------- */
const arV = new Arrow(scene, '#ffc93a'), arG = new Arrow(scene, '#ff4a3d'), arT = new Arrow(scene, '#4ad16a'), arTan = new Arrow(scene, '#ff9a3d');

/* ---------- grafik ---------- */
const gc = $('graph'), gx = gc.getContext('2d'); const hist = []; const HMAX = 12;
function drawGraph() {
  const DPR = Math.min(devicePixelRatio || 1, 2); const r = gc.getBoundingClientRect(), Wd = r.width, Hh = r.height; if (!Wd) return;
  if (gc.width !== Math.round(Wd * DPR)) { gc.width = Math.round(Wd * DPR); gc.height = Math.round(Hh * DPR); }
  gx.setTransform(DPR, 0, 0, DPR, 0, 0); gx.clearRect(0, 0, Wd, Hh);
  const L = 50, R = 52, T = 14, B = 24, pw = Wd - L - R, ph = Hh - T - B;
  const t1 = hist.length ? hist[hist.length - 1].t : 0, t0 = Math.max(0, t1 - HMAX);
  let lo = 0, hi = 1;
  if (S.gk === 'E') { hi = Math.max(.01, P1.E0) * 1.1; } else if (S.gk === 'th') { hi = Math.max(5, S.th0 / DEG) * 1.15; lo = -hi; } else { const vm = Math.sqrt(2 * S.g * S.L * (1 - Math.cos(S.th0))); hi = Math.max(.1, vm) * 1.15; lo = -hi; }
  const X = t => L + (t - t0) / HMAX * pw, Y = v => T + (hi - v) / (hi - lo) * ph;
  gx.strokeStyle = '#f0e8d6'; gx.lineWidth = 1; gx.fillStyle = '#8a8375'; gx.font = '600 11px "Plus Jakarta Sans", sans-serif';
  gx.textAlign = 'right'; gx.textBaseline = 'middle'; for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4; gx.beginPath(); gx.moveTo(L, Y(v)); gx.lineTo(L + pw, Y(v)); gx.stroke(); gx.fillText(fmt(v, Math.abs(hi) < 2 ? 2 : 0), L - 6, Y(v)); }
  gx.textAlign = 'center'; gx.textBaseline = 'top'; for (let s = Math.ceil(t0); s <= t0 + HMAX; s += 2) { gx.beginPath(); gx.moveTo(X(s), T); gx.lineTo(X(s), T + ph); gx.stroke(); gx.fillText(s, X(s), T + ph + 5); }
  const y0 = Y(Math.max(lo, 0)); gx.strokeStyle = '#0e0c08'; gx.lineWidth = 1.5; gx.beginPath(); gx.moveTo(L, T - 4); gx.lineTo(L, T + ph); gx.moveTo(L, y0); gx.lineTo(L + pw + 8, y0); gx.stroke();
  gx.fillStyle = '#0e0c08'; gx.font = '800 12px "Plus Jakarta Sans", sans-serif'; gx.textAlign = 'left'; gx.textBaseline = 'middle'; gx.fillText('t (s)', L + pw + 12, y0);
  gx.textBaseline = 'top'; gx.fillText(S.gk === 'E' ? 'E (J)' : S.gk === 'th' ? 'θ (°)' : 'v (m/s)', L + 8, T - 10);
  const line = (key, col, w = 2.5) => { gx.strokeStyle = col; gx.lineWidth = w; gx.beginPath(); let f = true; for (const p of hist) { if (p.t < t0) continue; const px = X(p.t), py = Y(p[key]); f ? gx.moveTo(px, py) : gx.lineTo(px, py); f = false; } gx.stroke(); };
  if (S.gk === 'E') { line('ke', '#ff7a3d'); line('pe', '#2d7dd2'); line('tot', '#0e0c08', 2); line('q', '#9a9a9a', 2);
    gx.font = '700 11px "Plus Jakarta Sans", sans-serif'; [['KE', '#ff7a3d'], ['PE', '#2d7dd2'], ['KE+PE', '#0e0c08'], ['Isı Q', '#9a9a9a']].forEach(([n, c], i) => { gx.fillStyle = c; gx.fillText(n, L + pw - 190 + i * 50, T); }); }
  else if (S.gk === 'th') line('th', '#e26d4f'); else line('v', '#c79a12');
}

/* ---------- etkileşim ---------- */
let grab = false; const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
W.pointerHook = (type, e) => {
  if (type === 'down') { const hit = W.ray(e).intersectObject(P1.bob, true); if (!hit.length) return false; grab = true; S.run = false; $('aimhint').style.display = 'none'; W.orbit.auto = 0; return true; }
  if (type === 'move' && grab) { const p = new THREE.Vector3(); if (!W.ray(e).ray.intersectPlane(plane, p)) return; let th = Math.atan2(p.x - PIV.x, PIV.y - p.y); th = clamp(th, -80 * DEG, 80 * DEG); S.th0 = Math.abs(th) < 3 * DEG ? 3 * DEG * Math.sign(th || 1) : th; $('i-th').value = Math.round(Math.abs(S.th0) / DEG); $('o-th').textContent = Math.round(Math.abs(S.th0) / DEG) + '°'; resetAll(); }
  if (type === 'up' && grab) { grab = false; go(); }
};

/* ---------- arayüz ---------- */
const toastEl = $('toast'); let toastT = 0; const toast = m => { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 3200); };
function resetAll() { syncCompare(); reset(P1, S.th0); reset(P2, S.th0); hist.length = 0; S.run = false; $('btn-go').textContent = '▶ Bırak'; }
function go() { if (!S.run && (P1.t > 0)) { S.run = true; $('btn-go').textContent = '⏸ Durdur'; return; } if (S.run) { S.run = false; $('btn-go').textContent = '▶ Devam'; return; } S.run = true; $('btn-go').textContent = '⏸ Durdur'; }
$('btn-go').onclick = go; $('btn-reset').onclick = resetAll;
const bindR = (id, out, fn) => $(id).addEventListener('input', e => { fn(+e.target.value); resetAll(); });
bindR('i-L', 'o-L', v => { S.L = v / 100; $('o-L').textContent = v + ' cm'; });
bindR('i-th', 'o-th', v => { S.th0 = v * DEG * Math.sign(S.th0 || 1); $('o-th').textContent = v + '°'; });
bindR('i-m', 'o-m', v => { S.m = v; $('o-m').textContent = fmt(v, 2) + ' kg'; });
bindR('i-b', 'o-b', v => { S.b = v; $('o-b').textContent = v === 0 ? 'Yok' : fmt(v, 2); });
document.querySelectorAll('#cards-g .a3c').forEach(b => b.onclick = () => { document.querySelectorAll('#cards-g .a3c').forEach(x => x.classList.toggle('on', x === b)); S.g = +b.dataset.g; const n = b.textContent.replace(/[\d,]+$/, '').trim(); $('h-g').innerHTML = `${n}<small>g = ${fmt(S.g, S.g % 1 ? 2 : 1).replace(/0$/, '')} m/s²</small>`; resetAll(); toast(S.g < 3 ? `${n}: g küçük, sarkaç yavaş sallanır.` : S.g > 20 ? `${n}: g büyük, sarkaç hızlı sallanır.` : `${n}`); });
const segs = (id, fn) => { const el = $(id); el.querySelectorAll('button').forEach(b => b.onclick = () => { el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); fn(b); }); };
segs('seg-cmp', b => { S.cmp = b.dataset.c; resetAll(); if (S.cmp === 'mass') toast('Aynı boy, dörtte bir kütle: ikisi aynı ritimde sallanır. Periyot kütleye bağlı değil.'); if (S.cmp === 'len') toast('Dörtte bir boy: periyot yarıya iner (T ∝ √L).'); });
segs('seg-speed', b => S.speed = +b.dataset.s);
segs('seg-graph', b => S.gk = b.dataset.g);
segs('seg-cam', b => { S.cam = b.dataset.cam; setCam(); });
const tg = (id, k) => $(id).addEventListener('click', e => { S[k] = !S[k]; e.currentTarget.classList.toggle('on', S[k]); });
tg('tg-tubes', 'tubes'); tg('tg-vec', 'vec'); tg('tg-force', 'force'); tg('tg-trail', 'trail');
function setCam() { const o = W.orbit; o.auto = 0;
  if (S.cam === 'front') { o.target.set(.12, TY + .62, 0); o.r = 2.1; o.th = 0; o.ph = 1.53; }
  else if (S.cam === 'orbit') { o.target.set(.2, TY + .56, 0); o.r = 1.95; o.th = .3; o.ph = 1.38; } }
W.bindFullscreen($('btn-full'));

/* ---------- döngü ---------- */
let lastUI = 0, time = 0;
W.update = dt => {
  time += dt;
  if (S.run) { const h = dt * S.speed, n = Math.max(1, Math.ceil(h / .002)); for (let i = 0; i < n; i++) { stepP(P1, h / n); if (P2.g.visible) stepP(P2, h / n); }
    const e = energies(P1); hist.push({ t: P1.t, ke: e.KE, pe: e.PE, tot: e.KE + e.PE, q: e.Q, th: P1.th / DEG, v: e.v }); if (hist.length > 3000) hist.splice(0, hist.length - 3000); }
  const c1 = layoutPend(P1), c2 = P2.g.visible ? layoutPend(P2) : null;
  [[P1, c1, trails[0], [1, .75, .3]], [P2, c2, trails[1], [.5, .8, 1]]].forEach(([P, c, tr, col]) => {
    if (!c) return; tr.visible = S.trail; if (S.run) { P.trail.push(c.clone()); if (P.trail.length > TRN) P.trail.shift(); }
    const pos = tr.geometry.attributes.position, cl = tr.geometry.attributes.color, n = P.trail.length;
    for (let i = 0; i < TRN; i++) { const p = P.trail[Math.min(i, n - 1)] || c; pos.setXYZ(i, p.x, p.y, p.z); const a = i < n ? Math.pow(i / Math.max(1, n - 1), 1.5) * .9 : 0; cl.setXYZ(i, col[0] * 2, col[1] * 2, col[2] * 2); cl.setW(i, a); }
    pos.needsUpdate = cl.needsUpdate = true; tr.geometry.setDrawRange(0, Math.max(0, n)); });
  // kamera
  if (S.cam === 'follow') { W.orbit.target.lerp(c1, 1 - Math.exp(-dt * 6)); W.orbit.r = lerp(W.orbit.r, .75, 1 - Math.exp(-dt * 2)); W.orbit.th = lerp(W.orbit.th, .45, 1 - Math.exp(-dt * 2)); W.orbit.ph = lerp(W.orbit.ph, 1.42, 1 - Math.exp(-dt * 2)); }
  W.updateOrbit(dt, 5);
  // enerji tüpleri
  const e = energies(P1), E0 = Math.max(P1.E0, 1e-9);
  tubes.forEach(t => { t.g.visible = S.tubes; const val = t.k === 'KE' ? e.KE : t.k === 'PE' ? e.PE : e.Q; const f = clamp(val / E0, 0, 1); t.liq.scale.y = Math.max(.0005, f * (TUBE.h - .01)); t.light.intensity = f * .35; t.val = val; });
  const tagOn = S.tubes; [['tag-ke', 0, 'KE'], ['tag-pe', 1, 'PE'], ['tag-q', 2, 'Q']].forEach(([id, i, n]) => { const el = $(id); if (!tagOn) { el.style.display = 'none'; return; } W.tag(el, new THREE.Vector3(TUBE.x + i * TUBE.gap, TY + TUBE.h + .055, TUBE.z), n); });
  // oklar
  const r = bobR(P1.m), vt = new THREE.Vector3(Math.cos(P1.th), Math.sin(P1.th), 0).multiplyScalar(P1.L * P1.w);
  if (S.vec && Math.abs(P1.w) > 1e-3) { arV.set(c1.clone().add(new THREE.Vector3(0, 0, r + .004)), vt.clone().multiplyScalar(.1), .004); W.tag($('tag-v'), c1.clone().add(vt.clone().multiplyScalar(.1)).add(new THREE.Vector3(0, .03, r)), `v = ${fmt(Math.abs(e.v), 2)} m/s`); } else { arV.hide(); $('tag-v').style.display = 'none'; }
  if (S.force) { const Fg = P1.m * S.g, Tn = P1.m * (S.g * Math.cos(P1.th) + P1.L * P1.w * P1.w), sc = .012;
    arG.set(c1.clone().add(new THREE.Vector3(0, 0, r + .006)), new THREE.Vector3(0, -Fg * sc, 0), .0035);
    arT.set(c1.clone().add(new THREE.Vector3(0, 0, r + .006)), new THREE.Vector3(-Math.sin(P1.th), Math.cos(P1.th), 0).multiplyScalar(Tn * sc), .0035);
    arTan.set(c1.clone().add(new THREE.Vector3(0, 0, r + .008)), new THREE.Vector3(Math.cos(P1.th), Math.sin(P1.th), 0).multiplyScalar(-Fg * Math.sin(P1.th) * sc), .003); }
  else { arG.hide(); arT.hide(); arTan.hide(); }
  if (time - lastUI > .08) { lastUI = time; ui(e); }
  drawGraph();
};
function ui(e) {
  $('h-t').textContent = fmt(P1.t, 2) + ' s'; $('h-th').textContent = fmt(P1.th / DEG, 1) + '°'; $('h-v').textContent = fmt(Math.abs(e.v), 2) + ' m/s'; $('h-h').textContent = fmt(e.h * 100, 1) + ' cm'; $('h-ke').textContent = fmt(e.KE, 2) + ' J'; $('h-pe').textContent = fmt(e.PE, 2) + ' J'; $('h-q').textContent = fmt(e.Q, 2) + ' J';
  const T0 = 2 * Math.PI * Math.sqrt(S.L / S.g), th0 = Math.abs(S.th0), Tex = T0 * (1 + th0 * th0 / 16 + 11 * th0 ** 4 / 3072);
  $('h-T').textContent = P1.T > 0 ? fmt(P1.T, 3) + ' s' : '—';
  $('h-Tf').textContent = `2π√(L/g) = ${fmt(T0, 3)} s` + (P2.g.visible && P2.T > 0 ? ` · 2. sarkaç: ${fmt(P2.T, 3)} s` : '');
  $('vals').innerHTML = `<tr><td>Kinetik enerji KE = ½mv²</td><td>${fmt(e.KE, 3)} J</td></tr><tr><td>Potansiyel enerji PE = mgh</td><td>${fmt(e.PE, 3)} J</td></tr>
    <tr><td>Mekanik enerji KE + PE</td><td>${fmt(e.KE + e.PE, 3)} J</td></tr><tr><td>Isıya dönüşen Q</td><td>${fmt(e.Q, 3)} J</td></tr>
    <tr><td>Başlangıç enerjisi E₀ = mgL(1 − cos θ₀)</td><td>${fmt(P1.E0, 3)} J</td></tr>
    <tr><td>Periyot (küçük açı) 2π√(L/g)</td><td>${fmt(T0, 3)} s</td></tr><tr><td>Periyot (θ₀ düzeltmeli)</td><td>${fmt(Tex, 3)} s</td></tr>
    <tr><td>En alttaki hız √(2gh₀)</td><td>${fmt(Math.sqrt(2 * S.g * S.L * (1 - Math.cos(S.th0))), 2)} m/s</td></tr>`;
}

/* ---------- başlat ---------- */
W.orbit.minR = .35; W.orbit.maxR = 5; W.orbit.minPh = .3;
resetAll(); setCam(); W.orbit.th = 1.2; W.orbit.r = 3.2; camera.position.copy(W.orbitPos()); W.orbit.look.copy(W.orbit.target);
setTimeout(() => { setCam(); W.orbit.auto = .04; }, 200);
W.loadEnv('lab').then(() => W.start());
window.__bfyLab = { W, S, P1, P2, go, resetAll, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) W.update(1 / 60); } };
