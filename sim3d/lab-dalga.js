// BFY · 3B Dalga Leğeni — 2B dalga denkleminin GPU'da sayısal çözümü (FDTD)
import { THREE, createWorld, worldUVMaterial, canvasTex, $, clamp, lerp, fmt, DEG, isMobile } from './bfy3d-core.js?v=3';

const TY = .76, LEGH = .26;
const L = .56;                               // su alanının kenarı (m)
const N = isMobile ? 192 : 256;              // ızgara
const DX = L / N;
const C_DEEP = .30, C_SHALLOW = .18;          // m/s (derin ~1 cm, sığ ~0,35 cm su)
const COURANT = .5, DT = COURANT * DX / C_DEEP;
const TRAYY = TY + LEGH, WATERY = TRAYY + .012;
const S = { src: 'point', f: 10, amp: 1, d: .08, bar: 'none', w: .03, depth: 'deep', edge: true, ruler: false, nodal: false, run: true, speed: 1, cam: 'orbit' };

/* ---------- dünya ---------- */
const stage = $('stage'), canvas = $('c3d');
const W = createWorld({ stage, canvas, fov: 32, near: .01, far: 400, shadowBox: 1, shadowFar: 8, bloom: [.18, .4, .97] });
const { scene, camera, renderer } = W;
W.sun.castShadow = false;
const cT = { col: W.tex('tex/concrete_col.jpg'), nor: W.tex('tex/concrete_nor.jpg', false), arm: W.tex('tex/concrete_arm.jpg', false) };
const floorMat = worldUVMaterial({ map: cT.col, normalMap: cT.nor, roughnessMap: cT.arm, tile: 1.6, tint: '#6d8a86', normalScale: .6, envMapIntensity: .5 });
floorMat.transparent = true;
{ const ob = floorMat.onBeforeCompile; floorMat.onBeforeCompile = sh => { ob(sh); sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.a *= 1.0 - smoothstep(1.8, 4.2, length(vWPos.xz));'); }; }
const floor = new THREE.Mesh(new THREE.CircleGeometry(4.5, 96).rotateX(-Math.PI / 2), floorMat); floor.receiveShadow = true; scene.add(floor);
W.gltf('models/WoodenTable_01/WoodenTable_01.gltf').then(o => { o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); o.scale.set(1, TY / .549, 1.15); o.position.set(.15, 0, 0); scene.add(o); });
W.gltf('models/chemistry_set/chemistry_set.gltf').then(o => { o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); o.scale.setScalar(.6); o.position.set(.72, TY, -.12); o.rotation.y = -.3; scene.add(o); });
const lamp = new THREE.SpotLight('#fffaf0', 11, 3, .5, .5, 1.2); lamp.position.set(0, TY + 1.25, .05); lamp.target.position.set(0, TY, 0); lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); lamp.shadow.bias = -.0004; scene.add(lamp, lamp.target);
const bulb = new THREE.Mesh(new THREE.SphereGeometry(.018, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff4d8').multiplyScalar(4), toneMapped: false })); bulb.position.copy(lamp.position); scene.add(bulb);
const shade = new THREE.Mesh(new THREE.ConeGeometry(.07, .08, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#2a2d30', metalness: .6, roughness: .4, side: THREE.DoubleSide })); shade.position.copy(lamp.position).add(new THREE.Vector3(0, .02, 0)); scene.add(shade);
const cordM = new THREE.Mesh(new THREE.CylinderGeometry(.003, .003, 1.2, 8), new THREE.MeshStandardMaterial({ color: '#111' })); cordM.position.copy(lamp.position).add(new THREE.Vector3(0, .65, 0)); scene.add(cordM);

/* ---------- simülasyon (ping-pong) ---------- */
const rtOpt = { type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping };
let rtA = new THREE.WebGLRenderTarget(N, N, rtOpt), rtB = new THREE.WebGLRenderTarget(N, N, rtOpt);
const maskData = new Uint8Array(N * N * 4); const maskTex = new THREE.DataTexture(maskData, N, N, THREE.RGBAFormat); maskTex.minFilter = maskTex.magFilter = THREE.NearestFilter;
const simMat = new THREE.ShaderMaterial({
  uniforms: { uState: { value: null }, uMask: { value: maskTex }, uTexel: { value: new THREE.Vector2(1 / N, 1 / N) }, uK: { value: COURANT * COURANT }, uDrive: { value: 0 },
    uType: { value: 0 }, uS1: { value: new THREE.Vector2(.5, .82) }, uS2: { value: new THREE.Vector2(.5, .82) }, uR: { value: 2.2 / N }, uLineY: { value: .88 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
  fragmentShader: `precision highp float; varying vec2 vUv; uniform sampler2D uState, uMask; uniform vec2 uTexel, uS1, uS2; uniform float uK, uDrive, uR, uLineY; uniform int uType;
    void main(){
      vec4 s = texture2D(uState, vUv); float u = s.r, up = s.g;
      float lap = texture2D(uState, vUv - vec2(uTexel.x, 0.)).r + texture2D(uState, vUv + vec2(uTexel.x, 0.)).r + texture2D(uState, vUv - vec2(0., uTexel.y)).r + texture2D(uState, vUv + vec2(0., uTexel.y)).r - 4. * u;
      vec4 m = texture2D(uMask, vUv);
      float un = 2. * u - up + uK * m.g * lap;
      un *= 1. - m.b * .12;
      if (m.r > .5) un = 0.;
      if (uType == 0 || uType == 1) { if (distance(vUv, uS1) < uR) un = uDrive; }
      if (uType == 1) { if (distance(vUv, uS2) < uR) un = uDrive; }
      if (uType == 2) { if (abs(vUv.y - uLineY) < uTexel.y * 1.2 && abs(vUv.x - .5) < .44) un = uDrive; }
      gl_FragColor = vec4(un, u, 0., 1.);
    }` });
const simScene = new THREE.Scene(), simCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat));
function clearSim() { const c = renderer.getClearColor(new THREE.Color()), a = renderer.getClearAlpha(); renderer.setClearColor(0x000000, 0); for (const rt of [rtA, rtB]) { renderer.setRenderTarget(rt); renderer.clear(); } renderer.setRenderTarget(null); renderer.setClearColor(c, a); }
let simT = 0, acc = 0;
function simStep() {
  simMat.uniforms.uState.value = rtA.texture; simMat.uniforms.uDrive.value = S.amp * Math.sin(2 * Math.PI * S.f * simT) * Math.min(1, simT * S.f / 1.5);
  renderer.setRenderTarget(rtB); renderer.render(simScene, simCam); renderer.setRenderTarget(null);
  [rtA, rtB] = [rtB, rtA]; simT += DT;
}

/* ---------- maske: engeller, derinlik, kenar sönümü ---------- */
const BARV = .52; // engel çizgisi (uv v)
const barrierRects = [];
function buildMask() {
  barrierRects.length = 0;
  const wc = Math.max(2, Math.round(S.w / DX)), th = 3, jb = Math.round(BARV * N);
  const addRect = (i0, i1, j0, j1) => barrierRects.push([i0, i1, j0, j1]);
  if (S.bar === 'slit') { const c = N / 2; addRect(0, c - wc / 2, jb, jb + th); addRect(c + wc / 2, N, jb, jb + th); }
  if (S.bar === 'double') { const c = N / 2, sep = Math.round(.05 / DX), g = Math.max(2, Math.round(.012 / DX)); addRect(0, c - sep / 2 - g / 2, jb, jb + th); addRect(c - sep / 2 + g / 2, c + sep / 2 - g / 2, jb, jb + th); addRect(c + sep / 2 + g / 2, N, jb, jb + th); }
  if (S.bar === 'block') { const c = N / 2, hw = Math.round(.045 / DX); addRect(c - hw, c + hw, jb, jb + th + 1); }
  const r2 = (C_SHALLOW / C_DEEP) ** 2, sp = 14;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = (j * N + i) * 4, u = i / N, v = j / N;
    let wall = 0; for (const [i0, i1, j0, j1] of barrierRects) if (i >= i0 && i < i1 && j >= j0 && j < j1) wall = 1;
    let shallow = S.depth === 'half' ? v < .42 : S.depth === 'slant' ? (v < .5 + (u - .5) * .55 - .08) : false;
    const e = Math.min(i, j, N - 1 - i, N - 1 - j); const damp = S.edge ? Math.pow(clamp(1 - e / sp, 0, 1), 2) : 0;
    maskData[k] = wall * 255; maskData[k + 1] = Math.round((shallow ? r2 : 1) * 255); maskData[k + 2] = Math.round(damp * 255); maskData[k + 3] = 255;
  }
  maskTex.needsUpdate = true; buildBarriers3D(); buildShallow3D();
}

/* ---------- dalga leğeni: çerçeve, cam taban, ayaklar ---------- */
const alu = new THREE.MeshStandardMaterial({ color: '#c9ced3', metalness: .9, roughness: .3 });
const dark = new THREE.MeshStandardMaterial({ color: '#1c1d20', metalness: .5, roughness: .45 });
const chrome = new THREE.MeshStandardMaterial({ color: '#e6e9ec', metalness: 1, roughness: .12 });
const tray = new THREE.Group(); scene.add(tray);
{ const t = .02, h = .035, O = L / 2 + t / 2;
  for (const [sx, sz, x, z] of [[L + 2 * t, t, 0, O], [L + 2 * t, t, 0, -O], [t, L, O, 0], [t, L, -O, 0]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, h, sz), alu); m.position.set(x, TRAYY + h / 2 - .004, z); m.castShadow = m.receiveShadow = true; tray.add(m); }
  const glass = new THREE.Mesh(new THREE.BoxGeometry(L, .004, L), new THREE.MeshPhysicalMaterial({ color: '#e8f6f0', transparent: true, opacity: .25, roughness: .05, envMapIntensity: 1.2, depthWrite: false })); glass.position.set(0, TRAYY - .002, 0); tray.add(glass);
  for (const x of [-O, O]) for (const z of [-O, O]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.009, .009, LEGH, 16), chrome); leg.position.set(x, TY + LEGH / 2, z); leg.castShadow = true; tray.add(leg);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(.018, .02, .012, 20), dark); foot.position.set(x, TY + .006, z); tray.add(foot); } }
// Kâğıt (projeksiyon ekranı)
const PAPER = .70;
const paperMat = new THREE.ShaderMaterial({
  uniforms: { uH: { value: null }, uMask: { value: maskTex }, uTexel: { value: new THREE.Vector2(1 / N, 1 / N) }, uGain: { value: 10 }, uNodal: { value: 0 }, uS1: { value: new THREE.Vector2() }, uS2: { value: new THREE.Vector2() }, uLam: { value: .03 }, uL: { value: L }, uBase: { value: new THREE.Color('#f4f1e8') } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `uniform sampler2D uH, uMask; uniform vec2 uTexel, uS1, uS2; uniform float uGain, uNodal, uLam, uL; uniform vec3 uBase; varying vec2 vUv;
    void main(){
      vec2 q = (vUv - .5) * ${(PAPER / (L * 1.12)).toFixed(4)} + .5;      // ışık kaynağı nedeniyle desen biraz büyür
      vec3 col = uBase * .95;
      if (q.x > 0. && q.x < 1. && q.y > 0. && q.y < 1.) {
        float h = texture2D(uH, q).r;
        float lap = texture2D(uH, q - vec2(uTexel.x,0.)).r + texture2D(uH, q + vec2(uTexel.x,0.)).r + texture2D(uH, q - vec2(0.,uTexel.y)).r + texture2D(uH, q + vec2(0.,uTexel.y)).r - 4.*h;
        float I = clamp(1. - lap * uGain, .15, 2.2);
        float wall = texture2D(uMask, q).r;
        col = uBase * I * mix(1., .08, wall);
        if (uNodal > .5) { float d = (distance(q, uS1) - distance(q, uS2)) * uL / uLam; float nod = 1. - smoothstep(0., .035, abs(fract(d) - .5)); if (q.y < uS1.y) col = mix(col, vec3(1., .35, .25), nod * .85); }
      } else { col = uBase * (.97 - .06 * length(vUv - .5)); }
      gl_FragColor = vec4(col, 1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }` });
const paper = new THREE.Mesh(new THREE.PlaneGeometry(PAPER, PAPER).rotateX(-Math.PI / 2), paperMat); paper.position.set(0, TY + .001, 0); scene.add(paper);

/* ---------- su yüzeyi ---------- */
const waterGeo = new THREE.PlaneGeometry(L, L, N - 1, N - 1); waterGeo.rotateX(-Math.PI / 2);
const waterMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 1, roughness: .02, ior: 1.333, thickness: .012, attenuationColor: new THREE.Color('#bfe9ea'), attenuationDistance: .5, envMapIntensity: 1.3, specularIntensity: 1 });
const WU = { uH: { value: null }, uTexel: { value: new THREE.Vector2(1 / N, 1 / N) }, uVis: { value: .0022 }, uDx: { value: DX } };
waterMat.onBeforeCompile = sh => {
  Object.assign(sh.uniforms, WU);
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform sampler2D uH; uniform vec2 uTexel; uniform float uVis, uDx;')
    .replace('#include <beginnormal_vertex>', `float hL = texture2D(uH, uv - vec2(uTexel.x,0.)).r, hR = texture2D(uH, uv + vec2(uTexel.x,0.)).r, hD = texture2D(uH, uv - vec2(0.,uTexel.y)).r, hU = texture2D(uH, uv + vec2(0.,uTexel.y)).r;
      float kk = uVis / (2. * uDx); vec3 objectNormal = normalize(vec3(-(hR - hL) * kk, 1., (hU - hD) * kk));
      #ifdef USE_TANGENT
      vec3 objectTangent = vec3(tangent.xyz);
      #endif`)
    .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.y += texture2D(uH, uv).r * uVis;');
};
const water = new THREE.Mesh(waterGeo, waterMat); water.position.set(0, WATERY, 0); water.renderOrder = 2; scene.add(water);

/* ---------- dalga üreteci (titreşen çubuk ve uçlar) ---------- */
const gen = new THREE.Group(); scene.add(gen);
const genStand = new THREE.Group(); scene.add(genStand);
{ const post = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .5, 16), chrome); post.position.set(-L / 2 - .08, TY + .25, -L / 2 + .02); genStand.add(post);
  const base = new THREE.Mesh(new THREE.BoxGeometry(.12, .015, .12), dark); base.position.set(-L / 2 - .08, TY + .0075, -L / 2 + .02); genStand.add(base);
  const motor = new THREE.Mesh(new THREE.BoxGeometry(.08, .06, .07), new THREE.MeshStandardMaterial({ color: '#b3261e', roughness: .45, metalness: .3 })); motor.position.set(-L / 2 - .08, WATERY + .11, -L / 2 + .02); genStand.add(motor); }
const genBar = new THREE.Mesh(new THREE.BoxGeometry(L * .9, .01, .016), alu); genBar.castShadow = true; gen.add(genBar);
const armBar = new THREE.Mesh(new THREE.BoxGeometry(.2, .008, .012), alu); gen.add(armBar);
const dippers = [0, 1].map(() => { const g = new THREE.Group(); const rod = new THREE.Mesh(new THREE.CylinderGeometry(.0018, .0018, .07, 10).translate(0, .035, 0), chrome); const ball = new THREE.Mesh(new THREE.SphereGeometry(.0055, 20, 14), new THREE.MeshStandardMaterial({ color: '#1f5fbf', roughness: .3, metalness: .2 })); g.add(rod, ball); gen.add(g); return g; });
const lineDipper = new THREE.Mesh(new THREE.BoxGeometry(L * .88, .012, .008), new THREE.MeshStandardMaterial({ color: '#1f5fbf', roughness: .35 })); gen.add(lineDipper);
const uvToWorld = (u, v) => new THREE.Vector3((u - .5) * L, WATERY, -(v - .5) * L);

/* ---------- engel ve sığ bölge görselleri ---------- */
const barG = new THREE.Group(); scene.add(barG);
const barMat = new THREE.MeshStandardMaterial({ color: '#8f989f', metalness: .85, roughness: .35 });
function buildBarriers3D() {
  barG.traverse(o => { if (o.isMesh) o.geometry.dispose(); }); barG.clear();
  for (const [i0, i1, j0, j1] of barrierRects) { const w = (Math.min(i1, N) - Math.max(i0, 0)) * DX, d = (j1 - j0) * DX; if (w <= 0) continue;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, .022, Math.max(d, .006)), barMat); const c = uvToWorld(((Math.max(i0, 0) + Math.min(i1, N)) / 2) / N, ((j0 + j1) / 2) / N); m.position.set(c.x, TRAYY + .011, c.z); m.castShadow = true; m.receiveShadow = true; barG.add(m); }
}
const shallowG = new THREE.Group(); scene.add(shallowG);
function buildShallow3D() {
  shallowG.traverse(o => { if (o.isMesh) o.geometry.dispose(); }); shallowG.clear();
  if (S.depth === 'deep') return;
  const mat = new THREE.MeshPhysicalMaterial({ color: '#e0f4ff', transparent: true, opacity: .35, roughness: .08, envMapIntensity: 1.3, depthWrite: false });
  if (S.depth === 'half') { const m = new THREE.Mesh(new THREE.BoxGeometry(L, .0065, L * .42), mat); const c = uvToWorld(.5, .21); m.position.set(c.x, TRAYY + .0033, c.z); shallowG.add(m); }
  else { const sh = new THREE.Shape(); const pts = []; for (const [u, v] of [[0, 0], [1, 0], [1, .5 + .5 * .55 - .08], [0, .5 - .5 * .55 - .08]]) pts.push(uvToWorld(u, v)); sh.moveTo(pts[0].x, -pts[0].z); pts.slice(1).forEach(p => sh.lineTo(p.x, -p.z));
    const g = new THREE.ExtrudeGeometry(sh, { depth: .0065, bevelEnabled: false }); g.rotateX(-Math.PI / 2); const m = new THREE.Mesh(g, mat); m.position.y = TRAYY; shallowG.add(m); }
}

/* ---------- arayüz ---------- */
const toastEl = $('toast'); let toastT = 0; const toast = m => { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 3400); };
function setSources() {
  const t = S.src === 'point' ? 0 : S.src === 'two' ? 1 : 2; simMat.uniforms.uType.value = t;
  const v = .84, du = S.d / L / 2;
  simMat.uniforms.uS1.value.set(t === 1 ? .5 - du : .5, v); simMat.uniforms.uS2.value.set(.5 + du, v);
  paperMat.uniforms.uS1.value.copy(simMat.uniforms.uS1.value); paperMat.uniforms.uS2.value.copy(simMat.uniforms.uS2.value);
  paperMat.uniforms.uNodal.value = S.nodal && t === 1 ? 1 : 0; paperMat.uniforms.uLam.value = C_DEEP / S.f;
  $('c-d').style.display = t === 1 ? '' : 'none';
  $('h-mode').innerHTML = (t === 0 ? 'Tek kaynak' : t === 1 ? 'İki kaynak' : 'Düz dalga') + `<small>${S.bar === 'slit' ? 'Tek yarık' : S.bar === 'double' ? 'Çift yarık' : S.bar === 'block' ? 'Engel' : 'Engelsiz'} · ${S.depth === 'deep' ? 'tek derinlik' : S.depth === 'half' ? 'sığ bölge var' : 'eğik sığ sınır'}</small>`;
}
const segs = (id, fn) => { const el = $(id); el.querySelectorAll('button').forEach(b => b.onclick = () => { el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); fn(b); }); };
segs('seg-src', b => { S.src = b.dataset.s; setSources(); clearSim(); simT = 0; if (S.src === 'two') toast('İki kaynak aynı anda titreşiyor. Kâğıtta sönen (karanlık-sabit) çizgiler düğüm çizgileridir.'); if (S.src === 'line') toast('Düz dalga: "Eğik sınır" ile kırılmayı, "Tek yarık" ile kırınımı dene.'); });
segs('seg-bar', b => { S.bar = b.dataset.b; $('c-w').style.display = S.bar === 'slit' ? '' : 'none'; buildMask(); setSources(); });
segs('seg-depth', b => { S.depth = b.dataset.d; buildMask(); setSources(); if (S.depth !== 'deep') toast('Cam levha suyu sığlaştırır: dalga yavaşlar, dalga boyu kısalır, frekans değişmez.'); });
segs('seg-speed', b => S.speed = +b.dataset.s);
segs('seg-cam', b => { S.cam = b.dataset.cam; setCam(); });
const rng = (id, fn) => $(id).addEventListener('input', e => fn(+e.target.value));
rng('i-f', v => { S.f = v; $('o-f').textContent = fmt(v, v % 1 ? 1 : 0) + ' Hz'; setSources(); });
rng('i-a', v => { S.amp = v; $('o-a').textContent = v < .6 ? 'Küçük' : v < 1.2 ? 'Orta' : 'Büyük'; });
rng('i-d', v => { S.d = v / 100; $('o-d').textContent = fmt(v, v % 1 ? 1 : 0) + ' cm'; setSources(); });
rng('i-w', v => { S.w = v / 100; $('o-w').textContent = fmt(v, v % 1 ? 1 : 0) + ' cm'; buildMask(); });
const tg = (id, k, after) => $(id).addEventListener('click', e => { S[k] = !S[k]; e.currentTarget.classList.toggle('on', S[k]); after && after(); });
tg('tg-edge', 'edge', () => { buildMask(); if (!S.edge) toast('Plaj kaldırıldı: dalgalar kenarlardan yansır.'); });
tg('tg-ruler', 'ruler'); tg('tg-nodal', 'nodal', () => { setSources(); if (S.nodal && S.src !== 'two') toast('Düğüm çizgileri iki kaynakta görünür.'); });
$('btn-go').onclick = () => { S.run = !S.run; $('btn-go').textContent = S.run ? '⏸ Durdur' : '▶ Devam'; };
$('btn-reset').onclick = () => { clearSim(); simT = 0; };
function setCam() { const o = W.orbit; o.auto = 0;
  if (S.cam === 'orbit') { o.target.set(0, TRAYY - .04, 0); o.r = 1.25; o.th = .35; o.ph = .92; }
  else if (S.cam === 'paper') { o.target.set(0, TY + .02, -.02); o.r = .78; o.th = .0; o.ph = 1.36; }
  else { o.target.set(0, WATERY, -.02); o.r = .62; o.th = .25; o.ph = 1.28; } }
W.bindFullscreen($('btn-full'));

/* ---------- λ ölçer ---------- */
const rulerTex = canvasTex(1024, 96, (g, w, h) => { g.fillStyle = 'rgba(255,248,200,.85)'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; g.font = '700 22px Arial'; g.textAlign = 'center';
  for (let mm = 0; mm <= 200; mm++) { const x = 12 + mm * (w - 24) / 200; const Lm = mm % 10 === 0 ? 40 : mm % 5 === 0 ? 28 : 16; g.fillRect(x - 1, 0, 2, Lm); if (mm % 10 === 0) g.fillText(mm / 10, x, 66); } });
const ruler = new THREE.Mesh(new THREE.BoxGeometry(.2, .002, .02), [null, null, new THREE.MeshStandardMaterial({ map: rulerTex, transparent: true, roughness: .4 }), null, null, null].map(m => m || new THREE.MeshStandardMaterial({ color: '#fff3b0', transparent: true, opacity: .6 })));
ruler.position.set(.02, WATERY + .006, -.06); scene.add(ruler);

/* ---------- döngü ---------- */
let time = 0, lastUI = 0;
W.update = dt => {
  time += dt;
  if (S.run) { acc += dt * S.speed; let n = 0; while (acc >= DT && n < 24) { simStep(); acc -= DT; n++; } if (n === 24) acc = 0; }
  const tex = rtA.texture; WU.uH.value = tex; paperMat.uniforms.uH.value = tex; paperMat.uniforms.uGain.value = 9 / S.amp;
  // üreteç görseli
  const z = Math.sin(2 * Math.PI * S.f * simT) * .0012 * S.amp; const t = simMat.uniforms.uType.value;
  const s1 = uvToWorld(simMat.uniforms.uS1.value.x, simMat.uniforms.uS1.value.y), s2 = uvToWorld(simMat.uniforms.uS2.value.x, simMat.uniforms.uS2.value.y);
  const gy = WATERY + .075 + z; genBar.position.set(0, gy, s1.z); armBar.position.set(-L / 2 - .02, gy, s1.z); armBar.scale.x = .6;
  dippers[0].visible = t !== 2; dippers[1].visible = t === 1; lineDipper.visible = t === 2;
  dippers[0].position.set(s1.x, WATERY - .004 + z, s1.z); dippers[1].position.set(s2.x, WATERY - .004 + z, s2.z);
  const ly = uvToWorld(.5, simMat.uniforms.uLineY.value); lineDipper.position.set(0, WATERY + z, ly.z);
  genBar.position.z = t === 2 ? ly.z : s1.z; armBar.position.z = genBar.position.z;
  ruler.visible = S.ruler;
  W.updateOrbit(dt, 5);
  if (time - lastUI > .15) { lastUI = time; ui(); }
};
function ui() {
  const lam = C_DEEP / S.f, lamS = C_SHALLOW / S.f;
  $('h-f').textContent = fmt(S.f, S.f % 1 ? 1 : 0) + ' Hz'; $('h-l').textContent = fmt(lam * 100, 1) + ' cm'; $('h-v').textContent = fmt(C_DEEP * 100, 0) + ' cm/s'; $('h-T').textContent = fmt(1 / S.f, 3) + ' s';
  const rows = [['Derin bölgede hız v', fmt(C_DEEP * 100, 0) + ' cm/s'], ['Derin bölgede λ = v / f', fmt(lam * 100, 2) + ' cm']];
  if (S.depth !== 'deep') rows.push(['Sığ bölgede hız', fmt(C_SHALLOW * 100, 0) + ' cm/s'], ['Sığ bölgede λ', fmt(lamS * 100, 2) + ' cm'], ['Frekans (iki bölgede de)', fmt(S.f, 1) + ' Hz']);
  if (S.src === 'two') rows.push(['Kaynaklar arası d', fmt(S.d * 100, 1) + ' cm'], ['Düğüm çizgisi sayısı ≈ 2·d/λ', String(2 * Math.floor(S.d / lam + .5))]);
  if (S.bar === 'slit') rows.push(['Yarık genişliği w', fmt(S.w * 100, 1) + ' cm'], ['w / λ', fmt(S.w / lam, 2) + (S.w / lam < 1.2 ? ' (belirgin kırınım)' : '')]);
  $('vals').innerHTML = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
  if (S.ruler) W.tag($('tag-l'), new THREE.Vector3(.02, WATERY + .03, -.06), `λ ≈ ${fmt(lam * 100, 1)} cm`); else $('tag-l').style.display = 'none';
}

/* ---------- başlat ---------- */
W.orbit.minR = .3; W.orbit.maxR = 4; W.orbit.minPh = .25;
buildMask(); setSources(); setCam(); W.orbit.th = 1.3; W.orbit.r = 2.1; camera.position.copy(W.orbitPos()); W.orbit.look.copy(W.orbit.target);
setTimeout(() => { setCam(); W.orbit.auto = 0; }, 200);
W.loadEnv('lab').then(() => { clearSim(); W.start(); });
window.__bfyLab = { W, S, advance(sec) { for (let t = 0; t < sec; t += 1 / 60) W.update(1 / 60); }, simAdvance(sec) { const n = Math.round(sec / DT); for (let i = 0; i < n; i++) simStep(); } };
