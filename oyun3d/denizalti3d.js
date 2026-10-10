// BFY · Denizaltı Kaptanı — 3B görüntü katmanı (su altı: ışık hüzmeleri, kostik desenler, yosun ormanı)
import { THREE, canvasTex, Arrow, clamp, lerp, rng, isMobile } from '../sim3d/bfy3d-core.js?v=5';
import { overlayWorld } from './ortak.js?v=2';

const G = window.BFY_GAME; if (!G) throw new Error('oyun yok');
const { W, O } = overlayWorld(G, { fov: 40, near: .1, far: 400, shadowBox: 26, shadowFar: 120, bloom: [.42, .5, .92] });
const { scene, camera, sun, hemi, renderer } = W;
// Önceden derleme son işleme hedefine göre yapılmalı (ekrana göre derlenen ton eşlemeli çeşit oyunda kullanılmaz)
const prewarm = objs => { if (!W.prewarm) return Promise.resolve(); W.renderer.setRenderTarget(W.composer.renderTarget1); return W.prewarm(objs); };
const S = 24;                                              // 24 oyun pikseli = 1 birim
const X = x => (x - G.W / 2) / S, Y = y => (G.SURF - y) / S;
const BEDY = Y(G.BED), R = rng(7);

/* ---------- su altı ışığı ve ortamı ---------- */
const WATER = { fresh: new THREE.Color('#0f5a5e'), sea: new THREE.Color('#0b4a70'), brine: new THREE.Color('#2a4a66') };
const fogC = WATER.fresh.clone(); scene.fog = new THREE.FogExp2(fogC, .024); scene.fog.color = fogC;
function gradEquirect(top, mid, bot, sunGlow) {
  return canvasTex(512, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(.47, mid); gr.addColorStop(.53, mid); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    if (sunGlow) { const s = g.createRadialGradient(w * .5, 0, 0, w * .5, 0, h * .55); s.addColorStop(0, 'rgba(255,255,255,.95)'); s.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = s; g.fillRect(0, 0, w, h * .6); } });
}
const envT = gradEquirect('#b9ecff', '#1d7596', '#04202e', true); envT.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = W.pmrem.fromEquirectangular(envT).texture; scene.environmentIntensity = .9;
scene.background = null;                                  // arka plan: sisle aynı ton eşlemeden geçen dev küre (renk dikişi olmasın)
const backdrop = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), new THREE.MeshBasicMaterial({ color: '#000', side: THREE.BackSide, fog: true, depthWrite: false })); backdrop.renderOrder = -10; scene.add(backdrop);
renderer.toneMappingExposure = 1.05;
hemi.color.set('#7fd0ec'); hemi.groundColor.set('#06202c'); hemi.intensity = 1.1;
sun.color.set('#d8f4ff'); sun.intensity = 2.6; W.sunDir.set(.28, 1, .35).normalize();

/* ---------- kostik (yüzeyden kırılan ışık) — hem zeminde hem yüzeyde ---------- */
const uTime = { value: 0 }, uScroll = { value: 0 };
const CAUSTIC = `
float caust(vec2 p, float t){ p = mod(p * 6.28318, 6.28318) - 250.; vec2 i = p; float c = 1.;
  for (int n = 0; n < 4; n++) { float tt = t * (1. - (3.5 / float(n + 1))); i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1. / length(vec2(p.x / (sin(i.x + tt) / .005), p.y / (cos(i.y + tt) / .005))); }
  c /= 4.; c = 1.17 - pow(c, 1.4); return pow(abs(c), 8.); }`;

/* ---------- deniz tabanı (kum, kıvrımlar, kayan) ---------- */
const PERIOD = 52;
const sandTex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#b79f78'; g.fillRect(0, 0, w, h); const r = rng(3);
  for (let y = 0; y < h; y += 2) { const a = .05 + .05 * Math.sin(y * .09) + .04 * Math.sin(y * .23 + 1); g.fillStyle = `rgba(70,52,30,${a})`; g.fillRect(0, y, w, 2); }
  for (let i = 0; i < 16000; i++) { const v = 120 + r() * 110; g.fillStyle = `rgba(${v},${v * .9},${v * .7},${.25 + r() * .35})`; g.fillRect(r() * w, r() * h, 1 + r() * 1.6, 1 + r() * 1.6); }
  for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${60 + r() * 40},${50 + r() * 30},${40},.5)`; g.beginPath(); g.ellipse(r() * w, r() * h, 1.5 + r() * 3, 1 + r() * 2, r() * 3, 0, 6.28); g.fill(); }
}, { repeat: [1, 1] });
const sandMat = new THREE.MeshStandardMaterial({ map: sandTex, roughness: .95, metalness: 0, color: '#c9d6d0', envMapIntensity: .5 });
sandMat.onBeforeCompile = sh => {
  sh.uniforms.uTime = uTime; sh.uniforms.uScroll = uScroll;
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
  sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; uniform float uTime, uScroll;' + CAUSTIC)
    .replace('#include <map_fragment>', `vec2 sq = vec2(vWP.x + uScroll, vWP.z); vec4 sampledDiffuseColor = texture2D(map, sq / 6.5); diffuseColor *= sampledDiffuseColor;`)
    .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      float cs = caust(sq / 11., uTime * .55) + .6 * caust(sq / 7.3 + .37, uTime * .7 + 2.);
      totalEmissiveRadiance += diffuseColor.rgb * vec3(.75, .95, 1.) * cs * .55 * smoothstep(-60., -8., vWP.z);`);
};
const bedGeo = new THREE.PlaneGeometry(PERIOD * 5, 240, 200, 110).rotateX(-Math.PI / 2);
{ const p = bedGeo.attributes.position, T = Math.PI * 2 / PERIOD;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i) - 100;
    const dune = Math.sin(x * T + z * .07) * .7 + Math.sin(x * T * 2 + 1.3 + z * .13) * .35 + Math.sin(x * T * 5 + z * .5) * .12;
    const back = clamp((-z - 6) / 50, 0, 1);            // arkada tepeler yükselir, oyun alanı düz
    p.setY(i, dune * (.25 + back * 1.6) + Math.min(back * back * 7, 9) - (z > 2 ? (z - 2) * .12 : 0)); p.setZ(i, z); }
  bedGeo.computeVertexNormals(); }
const bed = new THREE.Mesh(bedGeo, sandMat); bed.position.y = BEDY - .25; bed.receiveShadow = true; scene.add(bed);

/* ---------- su yüzeyi (alttan): parlak dalgalar, Snell penceresi ---------- */
const surfMat = new THREE.ShaderMaterial({ uniforms: { uTime, uScroll, uFog: { value: fogC } }, side: THREE.DoubleSide, fog: false,
  vertexShader: `varying vec3 vWP; void main(){ vec4 w = modelMatrix * vec4(position, 1.); vWP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `varying vec3 vWP; uniform float uTime, uScroll; uniform vec3 uFog; ${CAUSTIC}
    void main(){ vec2 q = vec2(vWP.x + uScroll, vWP.z); float c = caust(q / 9., uTime * .5) * .8 + caust(q / 4.1 + .2, uTime * .8) * .5;
      float d = length(vWP - cameraPosition); float win = exp(-d * .018);
      vec3 col = mix(vec3(.16, .52, .66), vec3(.75, .95, 1.), win * .8) + vec3(.8, .95, 1.) * c * (.35 + win);
      col = mix(uFog, col, exp(-d * d * .00026));
      gl_FragColor = vec4(col, 1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }` });
const surf = new THREE.Mesh(new THREE.PlaneGeometry(420, 260).rotateX(Math.PI / 2), surfMat); surf.position.set(0, 0, -90); scene.add(surf);

/* ---------- ışık hüzmeleri (god rays) ---------- */
const rayTex = canvasTex(64, 256, (g, w, h) => { const v = g.createLinearGradient(0, 0, 0, h); v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(.5, 'rgba(255,255,255,.35)'); v.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'destination-in'; const hz = g.createLinearGradient(0, 0, w, 0); hz.addColorStop(0, 'rgba(0,0,0,0)'); hz.addColorStop(.5, 'rgba(0,0,0,1)'); hz.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hz; g.fillRect(0, 0, w, h); });
const rays = [];
for (let i = 0; i < 16; i++) { const m = new THREE.MeshBasicMaterial({ map: rayTex, color: new THREE.Color('#bff0ff'), transparent: true, opacity: .1, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide });
  const w = 1.6 + R() * 4, h = 26 + R() * 18, r = new THREE.Mesh(new THREE.PlaneGeometry(w, h).translate(0, -h / 2, 0), m);
  r.userData = { x0: R() * 120 - 60, z: -4 - R() * 42, ph: R() * 6.28, sp: .3 + R() * .5, op: .05 + R() * .09 };
  r.rotation.z = -.28 + R() * .08; r.position.set(0, .1, r.userData.z); scene.add(r); rays.push(r); }

/* ---------- yosun ormanı (kelp) — gövde tepesi akıntıda salınır ---------- */
const kelpTex = canvasTex(64, 256, (g, w, h) => { g.clearRect(0, 0, w, h);
  for (let y = 0; y < h; y += 14) { const s = 1 - y / h * .35; g.fillStyle = `rgb(${70 + y * .15},${95 + y * .2},${40})`; g.beginPath(); g.ellipse(w / 2 + (y % 28 ? 9 : -9), y + 8, 12 * s, 8, (y % 28 ? .5 : -.5), 0, 6.28); g.fill(); }
  g.fillStyle = '#4b5a26'; g.fillRect(w / 2 - 2, 0, 4, h); });
const kelpMat = new THREE.MeshStandardMaterial({ map: kelpTex, alphaTest: .5, side: THREE.DoubleSide, roughness: .7, color: '#c8dc8a', envMapIntensity: .6, emissive: new THREE.Color('#1c2c10') });
kelpMat.onBeforeCompile = sh => { sh.uniforms.uTime = uTime;
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
    .replace('#include <begin_vertex>', `#include <begin_vertex>
      { float ph = instanceMatrix[3].z * 1.7 + instanceMatrix[3].x * .9; float k = uv.y * uv.y;
        transformed.x += (sin(uTime * 1.1 + ph + uv.y * 2.2) * .35 + .25) * k; transformed.z += cos(uTime * .8 + ph) * .2 * k; }`); };
const KN = isMobile ? 70 : 130, KSPAN = 160;
const kelp = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.5, 1, 1, 10).translate(0, .5, 0), kelpMat, KN); kelp.frustumCulled = false; scene.add(kelp);
const kelpD = []; for (let i = 0; i < KN; i++) { const band = R(); kelpD.push({ x0: R() * KSPAN, z: band < .15 ? 3 + R() * 3 : -3 - Math.pow(R(), .7) * 50, h: band < .15 ? 1.5 + R() * 2 : 3 + R() * 9, ry: (R() - .5) * 1.1 }); }
/* kayalar (gerçek taranmış model) */
const rocks = [];
W.gltf('models/boulder_01/boulder_01_lo.gltf').then(sc => { const src = []; sc.traverse(o => { if (o.isMesh) src.push(o); });
  const box = new THREE.Box3().setFromObject(sc), sz = box.getSize(new THREE.Vector3()), base = 1 / Math.max(sz.x, sz.z);
  for (let i = 0; i < (isMobile ? 12 : 20); i++) { const g = new THREE.Group(); const c = sc.clone(); g.add(c);
    c.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.material = o.material.clone(); o.material.color.set('#8fa4a0'); o.material.envMapIntensity = .5; } });
    const s = (1.2 + R() * 4.5) * base, z = i < 3 ? 2 + R() * 2 : -3 - R() * 40; g.scale.set(s * (1 + R() * .6), s * (.6 + R() * .6), s * (1 + R() * .5)); g.rotation.y = R() * 6;
    g.userData = { x0: R() * KSPAN, z, sink: box.min.y * g.scale.y }; scene.add(g); rocks.push(g); } });
/* deniz karı (plankton) */
const SNOW = isMobile ? 700 : 1400, snowG = new THREE.BufferGeometry(), snowP = new Float32Array(SNOW * 3), snowD = [];
for (let i = 0; i < SNOW; i++) snowD.push([R() * 90 - 45, BEDY + R() * -BEDY, -45 + R() * 70, .05 + R() * .25]);
snowG.setAttribute('position', new THREE.BufferAttribute(snowP, 3));
const snow = new THREE.Points(snowG, new THREE.PointsMaterial({ map: W.dropTex, size: .09, color: '#cfefff', transparent: true, opacity: .55, depthWrite: false, sizeAttenuation: true })); snow.frustumCulled = false; scene.add(snow);

/* ---------- denizaltı (prosedürel: gövde, kule, dümenler, pervane, lombozlar, farlar, balast camı) ---------- */
const sub = new THREE.Group(); scene.add(sub);
const paint = new THREE.MeshPhysicalMaterial({ color: '#f4b31a', roughness: .38, metalness: .15, clearcoat: 1, clearcoatRoughness: .25, envMapIntensity: 1.1 });
const dark = new THREE.MeshStandardMaterial({ color: '#2b3238', roughness: .5, metalness: .6 });
const steel = new THREE.MeshStandardMaterial({ color: '#b8c4cc', roughness: .28, metalness: .95 });
const prof = [[0, -1.46], [.12, -1.42], [.25, -1.3], [.42, -1.05], [.55, -.7], [.6, -.35], [.6, .55], [.57, .9], [.5, 1.12], [.38, 1.3], [.22, 1.41], [0, 1.46]].map(([r, y]) => new THREE.Vector2(r, y));
const hullGeo = new THREE.LatheGeometry(prof, 48).rotateZ(-Math.PI / 2);
const hull = new THREE.Mesh(hullGeo, paint); hull.castShadow = true; sub.add(hull);
// koyu şerit (su hattı) ve kaynak halkaları
for (const x of [-.75, -.05, .65]) { const b = new THREE.Mesh(new THREE.TorusGeometry(.598, .012, 6, 48).rotateY(Math.PI / 2), dark); b.position.x = x; sub.add(b); }
// kule
const sailSh = new THREE.Shape(); sailSh.moveTo(-.42, 0); sailSh.lineTo(-.32, .42); sailSh.quadraticCurveTo(-.25, .5, -.1, .5); sailSh.lineTo(.26, .5); sailSh.quadraticCurveTo(.4, .48, .44, .3); sailSh.lineTo(.5, 0); sailSh.closePath();
const sail = new THREE.Mesh(new THREE.ExtrudeGeometry(sailSh, { depth: .26, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 3, curveSegments: 10 }).translate(0, 0, -.13), paint);
sail.position.set(.15, .5, 0); sail.castShadow = true; sub.add(sail);
const peri = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .42, 10), steel); peri.position.set(.3, 1.15, 0); sub.add(peri);
const periH = new THREE.Mesh(new THREE.BoxGeometry(.12, .05, .05), steel); periH.position.set(.34, 1.36, 0); sub.add(periH);
const ant = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .3, 6), dark); ant.position.set(0, 1.12, 0); sub.add(ant);
const antL = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, .4, .3), toneMapped: false })); antL.position.set(0, 1.28, 0); sub.add(antL);
// kule dümenleri ve kıç kanatları
const fin = (w, h, t) => new THREE.Mesh(new THREE.BoxGeometry(w, h, t), paint);
for (const z of [-1, 1]) { const f = fin(.3, .025, .34); f.position.set(.22, .78, z * .3); sub.add(f); }
for (const a of [0, 1, 2, 3]) { const f = fin(.42, .03, .5); f.geometry.translate(0, 0, .25); f.position.set(-1.12, 0, 0); f.rotation.x = a * Math.PI / 2; sub.add(f); }
// pervane (kanallı)
const prop = new THREE.Group(); prop.position.x = -1.5; sub.add(prop);
prop.add(new THREE.Mesh(new THREE.SphereGeometry(.08, 16, 12).scale(1.4, 1, 1), steel));
for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(.03, .34, .11).translate(0, .19, 0), steel); b.rotation.x = i * Math.PI * 2 / 5; b.rotateY(.5); prop.add(b); }
const duct = new THREE.Mesh(new THREE.TorusGeometry(.44, .05, 10, 40).rotateY(Math.PI / 2), dark); duct.position.x = -1.5; sub.add(duct);
const ductIn = new THREE.Mesh(new THREE.CylinderGeometry(.44, .44, .16, 40, 1, true).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#39424a', metalness: .7, roughness: .4, side: THREE.DoubleSide })); ductIn.position.x = -1.5; sub.add(ductIn);
for (const a of [Math.PI / 4, -Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4]) { const st = new THREE.Mesh(new THREE.BoxGeometry(.03, .2, .03), dark); st.position.set(-1.46, Math.sin(a) * .3, Math.cos(a) * .3); st.rotation.x = -a + Math.PI / 2; sub.add(st); }
// lombozlar (içeride sıcak ışık)
const winMat = new THREE.MeshStandardMaterial({ color: '#10222c', emissive: new THREE.Color('#ffc979'), emissiveIntensity: 1.2, roughness: .05, metalness: .2, envMapIntensity: 2 });
for (const x of [-.45, 0, .45]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.12, .025, 8, 28), steel); r.position.set(x, .05, .585); sub.add(r);
  const g = new THREE.Mesh(new THREE.CircleGeometry(.11, 24), winMat); g.position.set(x, .05, .583); sub.add(g); }
// ön gözlem kubbesi
const dome = new THREE.Mesh(new THREE.SphereGeometry(.3, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: '#8fe8ff', roughness: .02, metalness: 0, transmission: 0, transparent: true, opacity: .55, envMapIntensity: 2.5, clearcoat: 1 }));
dome.position.set(1.3, .1, 0); sub.add(dome);
// balast tankı camı: su seviyesi = balast oranı (yan tarafta)
const tankBg = new THREE.Mesh(new THREE.PlaneGeometry(.95, .17), new THREE.MeshBasicMaterial({ color: '#0a1d2a' })); tankBg.position.set(-.1, -.28, .56); tankBg.rotation.x = -.45; sub.add(tankBg);
const tankFill = new THREE.Mesh(new THREE.PlaneGeometry(.91, .13).translate(.455, 0, 0), new THREE.MeshBasicMaterial({ color: new THREE.Color(.25, 1.1, 2.6), toneMapped: false }));
tankFill.position.set(-.555, -.28, .562); tankFill.rotation.x = -.45; sub.add(tankFill);
const decal = new THREE.Mesh(new THREE.PlaneGeometry(.62, .16), new THREE.MeshBasicMaterial({ map: canvasTex(256, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#10222c'; g.font = '900 46px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BFY-9', w / 2, h / 2 + 2); }), transparent: true }));
decal.position.set(.85, .3, .5); decal.rotation.y = .5; sub.add(decal);
// farlar + hacimsel ışık konisi
const lampM = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 4.6, 3.6), toneMapped: false });
for (const z of [-.22, .22]) { const l = new THREE.Mesh(new THREE.CircleGeometry(.06, 16), lampM); l.position.set(1.36, -.18, z); l.rotation.y = Math.PI / 2 + z * 1.6; sub.add(l); }
const spot = new THREE.SpotLight('#fff2d6', 90, 34, .42, .5, 1.6); spot.position.set(1.4, -.1, 0); sub.add(spot); sub.add(spot.target); spot.target.position.set(10, -1.2, 0);
const beamTex = canvasTex(8, 256, (g, w, h) => { const v = g.createLinearGradient(0, 0, 0, h); v.addColorStop(0, 'rgba(255,255,255,.95)'); v.addColorStop(.35, 'rgba(255,255,255,.35)'); v.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = v; g.fillRect(0, 0, w, h); });
const beam = new THREE.Mesh(new THREE.ConeGeometry(2.1, 11, 32, 1, true).translate(0, -5.5, 0).rotateZ(Math.PI / 2), new THREE.MeshBasicMaterial({ map: beamTex, color: new THREE.Color('#fff0cf'), transparent: true, opacity: .05, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }));
beam.position.set(1.38, -.15, 0); beam.rotation.z = -.1; sub.add(beam);
const subLight = new THREE.PointLight('#ffd9a0', 6, 6, 2); subLight.position.set(0, .2, 1.5); sub.add(subLight);
// yanıp sönme yalnız gövdeye: ışıklar gizlenirse ışık sayısı değişir ve tüm malzemeler yeniden derlenir
const subBody = sub.children.filter(o => !o.isLight && o !== spot.target);
// kuvvet okları: uzunluk kuvvetle orantılı (aynı V için G ∝ ρ, Fk ∝ ρsu)
const arG = new Arrow(scene, '#ff6f8d', { glow: 1.8 }), arF = new Arrow(scene, '#6fe4ff', { glow: 1.8 });
const FK = 1.7 / 1000;

/* ---------- kapılar, mayınlar, hazineler (oyun nesneleriyle eşleşen havuz) ---------- */
const rust = { col: W.tex('tex/rust_col.jpg'), nor: W.tex('tex/rust_nor.jpg', false), arm: W.tex('tex/rust_arm.jpg', false) };
const pillarMat = new THREE.MeshStandardMaterial({ color: '#8fc2c4', map: rust.col, normalMap: rust.nor, roughnessMap: rust.arm, metalness: .35, roughness: 1, envMapIntensity: 1 });
const hazard = new THREE.MeshStandardMaterial({ map: canvasTex(64, 64, (g, w, h) => { g.fillStyle = '#f1c21b'; g.fillRect(0, 0, w, h); g.fillStyle = '#16181a'; for (let i = -2; i < 4; i++) { g.beginPath(); g.moveTo(i * 22, 0); g.lineTo(i * 22 + 11, 0); g.lineTo(i * 22 + 11 + h, h); g.lineTo(i * 22 + h, h); g.fill(); } }, { repeat: [3, 1] }), roughness: .5, metalness: .2 });
const ringMat = () => new THREE.MeshBasicMaterial({ color: new THREE.Color(.3, 2.2, 2), transparent: true, opacity: .75, toneMapped: false, depthWrite: false });
const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(.25, 2.4, 2.1), toneMapped: false });
const lampOn = new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 3, .5), toneMapped: false }), lampOff = new THREE.MeshBasicMaterial({ color: '#5a4a18' });
const cylG = new THREE.CylinderGeometry(.33, .33, 1, 20, 1).translate(0, .5, 0), capG = new THREE.CylinderGeometry(.42, .42, .3, 24), bandG = new THREE.TorusGeometry(.43, .05, 8, 28).rotateX(Math.PI / 2);
const buoyG = new THREE.CylinderGeometry(.7, .55, .7, 24), buoyM = new THREE.MeshStandardMaterial({ color: '#d8471f', roughness: .5, metalness: .1 });
const baseG = new THREE.BoxGeometry(1.4, .6, 1.4), baseM = new THREE.MeshStandardMaterial({ color: '#6c706c', roughness: .9, map: W.tex('tex/concrete_col.jpg'), normalMap: W.tex('tex/concrete_nor.jpg', false) });
const lampG = new THREE.SphereGeometry(.11, 12, 10), ringG = new THREE.TorusGeometry(1, .045, 8, 64).rotateY(Math.PI / 2);
function makeGate() { const g = new THREE.Group();
  const top = new THREE.Mesh(cylG, pillarMat), bot = new THREE.Mesh(cylG, pillarMat); top.castShadow = bot.castShadow = true;
  const cT = new THREE.Mesh(capG, hazard), cB = new THREE.Mesh(capG, hazard), bT = new THREE.Mesh(bandG, glowMat), bB = new THREE.Mesh(bandG, glowMat);
  const lT = new THREE.Mesh(lampG, lampOn), lB = new THREE.Mesh(lampG, lampOn), buoy = new THREE.Mesh(buoyG, buoyM), base = new THREE.Mesh(baseG, baseM); base.castShadow = true;
  const ring = new THREE.Mesh(ringG, ringMat()); ring.renderOrder = 5;   // malzeme kapıya özel (renk/opaklık), havuzda yeniden kullanılır
  g.add(top, bot, cT, cB, bT, bB, lT, lB, buoy, base, ring);
  return { g, top, bot, cT, cB, bT, bB, lT, lB, buoy, base, ring, flash: 0 }; }
function layoutGate(o, gt) { const x = X(gt.x), yT = Y(gt.gy - gt.gapH / 2), yB = Y(gt.gy + gt.gapH / 2), r = (yT - yB) / 2;
  o.g.position.set(x, 0, 0);
  o.top.position.y = yT; o.top.scale.y = -yT + .05; o.bot.position.y = BEDY - .2; o.bot.scale.y = yB - BEDY + .2;
  o.cT.position.y = yT + .15; o.cB.position.y = yB - .15; o.bT.position.y = yT + .02; o.bB.position.y = yB - .02;
  o.lT.position.set(0, yT - .12, .38); o.lB.position.set(0, yB + .12, .38); o.buoy.position.y = -.28; o.base.position.y = BEDY + .05;
  o.ring.position.y = (yT + yB) / 2; o.ring.scale.setScalar(r - .02); }
const spikeG = new THREE.CylinderGeometry(.035, .06, .24, 8).translate(0, .62, 0), knobG = new THREE.SphereGeometry(.07, 10, 8).translate(0, .75, 0);
const mineMat = new THREE.MeshStandardMaterial({ color: '#9aa7ad', map: rust.col, normalMap: rust.nor, roughnessMap: rust.arm, metalness: .45, roughness: 1, envMapIntensity: 1.1 });
const mineLightOn = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, .3, .3), toneMapped: false }), mineLightOff = new THREE.MeshBasicMaterial({ color: '#4a1a20' });
const dirs = []; { const n = 14, ga = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - (i + .5) / n * 2, r = Math.sqrt(1 - y * y); dirs.push(new THREE.Vector3(Math.cos(i * ga) * r, y, Math.sin(i * ga) * r)); } }
const mineG = new THREE.SphereGeometry(.56, 28, 20), eqG = new THREE.TorusGeometry(.565, .03, 8, 40).rotateX(Math.PI / 2), mLampG = new THREE.SphereGeometry(.1, 12, 10);
let mineHaloM = null;
function makeMine() { const g = new THREE.Group(); const body = new THREE.Mesh(mineG, mineMat); body.castShadow = true; g.add(body);
  const eq = new THREE.Mesh(eqG, dark); g.add(eq);
  for (const d of dirs) { const s = new THREE.Mesh(spikeG, mineMat), k = new THREE.Mesh(knobG, steel); s.quaternion.setFromUnitVectors(up, d); k.quaternion.copy(s.quaternion); g.add(s, k); }
  const l = new THREE.Mesh(mLampG, mineLightOn); l.position.set(0, 0, .56); g.add(l);
  mineHaloM = mineHaloM || new THREE.SpriteMaterial({ map: haloTex, color: new THREE.Color(3, .25, .2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const h = new THREE.Sprite(mineHaloM); h.scale.setScalar(.9); h.position.z = .6; g.add(h);
  return { g, l, h }; }
const LINKS = 520, linkM = new THREE.InstancedMesh(new THREE.TorusGeometry(.11, .028, 6, 14).scale(1, 1.6, 1), steel, LINKS); linkM.frustumCulled = false; linkM.count = 0; scene.add(linkM);
const gemMat = new THREE.MeshStandardMaterial({ color: '#ffcf3d', metalness: .9, roughness: .12, emissive: new THREE.Color('#7a4f00'), emissiveIntensity: .9, flatShading: true, envMapIntensity: 1.6 });
const haloTex = canvasTex(64, 64, g => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 31); gr.addColorStop(0, 'rgba(255,240,180,1)'); gr.addColorStop(.3, 'rgba(255,200,80,.45)'); gr.addColorStop(1, 'rgba(255,160,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
const gemG = new THREE.OctahedronGeometry(.36, 0).scale(1, 1.35, 1);
function makeGem() { const g = new THREE.Group(); const m = new THREE.Mesh(gemG, gemMat); g.add(m);
  const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, color: new THREE.Color(2.2, 1.6, .7), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); h.scale.setScalar(1.6); g.add(h);
  return { g, m, h }; }
// Havuz: nesneler silinmez, gizlenip sonraki kapı/mayın/hazine için yeniden kullanılır (geometri/malzeme sızıntısı ve derleme yok)
const pools = { gate: new Map(), mine: new Map(), tre: new Map() }, free = { gate: [], mine: [], tre: [] }, makers = { gate: makeGate, mine: makeMine, tre: makeGem };
function take(k) { let o = free[k].pop(); if (!o) { o = makers[k](); scene.add(o.g); } o.flash = 0; return o; }
function drop(k, o) { o.g.visible = false; free[k].push(o); }
let stamp = 0;
function sync(list, k, place) { const map = pools[k]; stamp++;
  for (const it of list) { if (it.x < -200) continue; let o = map.get(it); if (!o) { o = take(k); map.set(it, o); } o.g.visible = true; place(o, it); o.seen = stamp; }
  for (const [it, o] of map) if (o.seen !== stamp) { drop(k, o); map.delete(it); } }

/* ---------- baloncuklar ve parçacıklar ---------- */
const BUB = 700, bubG = new THREE.BufferGeometry(), bubP = new Float32Array(BUB * 3); bubG.setAttribute('position', new THREE.BufferAttribute(bubP, 3));
const bubbles = new THREE.Points(bubG, new THREE.PointsMaterial({ map: W.dropTex, size: .22, color: new THREE.Color(1.4, 1.7, 1.9), transparent: true, opacity: .8, depthWrite: false, sizeAttenuation: true, fog: false })); bubbles.frustumCulled = false; scene.add(bubbles);
const bub3 = [];
const bubFree = [];
const addBub = (p, v, life = 2.5) => { if (bub3.length >= 480) return; const b = bubFree.pop() || { p: new THREE.Vector3(), v: new THREE.Vector3() };
  b.p.copy(p); b.v.copy(v); b.t = 0; b.life = life; b.w = Math.random() * 6; bub3.push(b); };
const tA = new THREE.Vector3(), tB = new THREE.Vector3(), tC = new THREE.Vector3();
const PN = 260, parG = new THREE.BufferGeometry(), parP = new Float32Array(PN * 3), parC = new Float32Array(PN * 3);
parG.setAttribute('position', new THREE.BufferAttribute(parP, 3)); parG.setAttribute('color', new THREE.BufferAttribute(parC, 3));
const parts = new THREE.Points(parG, new THREE.PointsMaterial({ map: haloTex, size: .5, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, sizeAttenuation: true })); parts.frustumCulled = false; scene.add(parts);
const tmpC = new THREE.Color();
/* patlama ışığı + şok dalgası */
const boomL = new THREE.PointLight('#ffb070', 0, 30, 2); scene.add(boomL);
const shockMat = new THREE.ShaderMaterial({ uniforms: { opacity: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  vertexShader: `varying vec3 vN, vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `varying vec3 vN, vV; uniform float opacity; void main(){ float r = pow(1. - abs(dot(vN, vV)), 3.); gl_FragColor = vec4(vec3(1.3, 1.7, 1.9) * r * opacity, 1.); }` });
const shock = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), shockMat); scene.add(shock); shock.material.opacity = 0;
let boomT = 9, camShake = 0;
function boom(x, y) { boomT = 0; boomL.position.set(X(x), Y(y), 2); shock.position.set(X(x), Y(y), 0); camShake = 1;
  for (let i = 0; i < 60; i++) addBub(tA.set(X(x) + (Math.random() - .5), Y(y) + (Math.random() - .5), (Math.random() - .5)), tB.set((Math.random() - .5) * 6, Math.random() * 5, (Math.random() - .5) * 6), 2 + Math.random() * 2);
  for (let i = 0; i < 6; i++) W.puff(new THREE.Vector3(X(x), Y(y), 0), new THREE.Vector3((Math.random() - .5) * 3, 1 + Math.random() * 2, (Math.random() - .5) * 3), { color: '#9fb4bd', size: 1.2, grow: 3, life: 2.2, drag: 1.5, op: .45, grav: -.6 }); }
/* olaylar */
let zoneFlash = 0;
G.on = (type, a) => {
  if (type === 'mine') boom(a.x, a.y);
  else if (type === 'hit') { camShake = Math.max(camShake, .7); for (let i = 0; i < 25; i++) addBub(tA.copy(sub.position).setY(sub.position.y + .3), tB.set((Math.random() - .5) * 4, 1 + Math.random() * 3, (Math.random() - .5) * 3)); }
  else if (type === 'gate') { const o = pools.gate.get(a.g); if (o) { o.flash = 1; o.ring.material.color.setRGB(...(a.ok ? (a.merkez ? [3, 2.3, .4] : [.4, 3, 1]) : [3, .3, .3])); } }
  else if (type === 'tre') { for (let i = 0; i < 16; i++) addBub(tA.set(X(a.x), Y(a.y), 0), tB.set((Math.random() - .5) * 3, Math.random() * 3, (Math.random() - .5) * 3), 1.2); }
  else if (type === 'zone') zoneFlash = 1;
  else if (type === 'reset') { for (const k in pools) { for (const [, o] of pools[k]) drop(k, o); pools[k].clear(); } }
};

/* ---------- halokline perdesi: iki farklı yoğunluktaki suyun sınırı ---------- */
const curtMat = new THREE.ShaderMaterial({ uniforms: { uTime, uCol: { value: new THREE.Color() } }, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false,
  vertexShader: `varying vec2 vU; varying vec3 vWP; uniform float uTime; void main(){ vU = uv; vec3 p = position; p.x += sin(p.y * .6 + uTime * 1.3) * .5 + sin(p.z * .3 + uTime) * .4; vec4 w = modelMatrix * vec4(p, 1.); vWP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `varying vec2 vU; varying vec3 vWP; uniform float uTime; uniform vec3 uCol; void main(){ float s = .5 + .5 * sin(vU.y * 9. - uTime * .9 + sin(vU.x * 5. + uTime * .6) * 1.2);
    float e = smoothstep(0., .15, vU.x) * smoothstep(1., .85, vU.x) * smoothstep(0., .1, vU.y) * smoothstep(1., .9, vU.y);
    float d = length(vWP - cameraPosition); gl_FragColor = vec4(uCol * (.35 + .65 * s), e * .13 * exp(-d * .012)); }` });
const curtain = new THREE.Mesh(new THREE.PlaneGeometry(70, -BEDY, 1, 40).rotateY(Math.PI / 2).translate(0, BEDY / 2, -20), curtMat); scene.add(curtain);

/* ---------- kamera ---------- */
const CY = Y(G.H / 2);
function fitCamera(t) { const hw = G.W / 2 / S, hh = G.H / 2 / S, tf = Math.tan(camera.fov * Math.PI / 360);
  const d = Math.max(hh / tf, hw / (tf * camera.aspect)) * 1.015;
  const sh = camShake * camShake, sx = (Math.random() - .5) * sh * .6, sy = (Math.random() - .5) * sh * .6;
  camera.position.set(sx + Math.sin(t * .21) * .35, CY - .9 + sy + Math.sin(t * .17) * .2, d); camera.lookAt(sx * .5, CY + sy * .5, 0); }

/* ---------- kare ---------- */
let time = 0, scroll = 0, propA = 0, roll = 0, subRot = 0;
const dO = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0), dn = new THREE.Vector3(0, -1, 0);
function frame(dt) {
  time += dt; uTime.value = time;
  const play = G.state === 'play', v = play ? G.speed / S : 1.4;       // birim/s
  scroll += v * dt; uScroll.value = scroll;
  // ortam rengi (suyun yoğunluğuna göre)
  const rs = G.rhoSu, tgt = rs < 1010 ? WATER.fresh : rs < 1100 ? WATER.sea : WATER.brine;
  fogC.lerp(tgt, 1 - Math.exp(-dt * 1.5)); scene.fog.density = lerp(scene.fog.density, rs > 1100 ? .03 : .024, 1 - Math.exp(-dt));
  // zemin (periyodik kaydırma), yosun, kayalar, ışık hüzmeleri, plankton
  bed.position.x = -(scroll % PERIOD);
  const wrap = (x0, span) => ((x0 - scroll) % span + span) % span - span / 2;
  for (let i = 0; i < KN; i++) { const k = kelpD[i]; dO.position.set(wrap(k.x0, KSPAN), BEDY - .2, k.z); dO.rotation.set(0, k.ry, 0); dO.scale.set(1, k.h, 1); dO.updateMatrix(); kelp.setMatrixAt(i, dO.matrix); }
  kelp.instanceMatrix.needsUpdate = true;
  for (const r of rocks) r.position.set(wrap(r.userData.x0, KSPAN), BEDY - .1 - r.userData.sink * .6, r.userData.z);
  for (const r of rays) { const u = r.userData; r.position.x = wrap(u.x0 + scroll * .75, 130); r.material.opacity = u.op * (.55 + .45 * Math.sin(time * u.sp + u.ph)); }
  for (let i = 0; i < SNOW; i++) { const s = snowD[i]; s[1] += Math.sin(time * .5 + i) * .002 - s[3] * .01 * dt; if (s[1] < BEDY) s[1] = 0;
    snowP[i * 3] = ((s[0] - scroll * .98 + time * s[3]) % 90 + 90) % 90 - 45; snowP[i * 3 + 1] = s[1]; snowP[i * 3 + 2] = s[2]; }
  snowG.attributes.position.needsUpdate = true;
  // denizaltı
  const gs = G.sub, sx = X(gs.x), sy = Y(gs.y);
  sub.position.set(sx, sy + Math.sin(time * 1.6) * .03, 0);
  subRot = lerp(subRot, -clamp(G.vy * .0012, -.22, .22), 1 - Math.exp(-dt * 6)); roll = Math.sin(time * .9) * .03;
  sub.rotation.set(roll, Math.sin(time * .4) * .06 - .12, subRot);
  const subOn = !(G.invuln > 0 && play && Math.sin(time * 20) > 0); for (const o of subBody) o.visible = subOn;
  propA += (play ? 14 + G.speed * .05 : 5) * dt; prop.rotation.x = propA;
  tankFill.scale.x = Math.max(.001, G.ballast); antL.visible = Math.sin(time * 4) > 0;
  winMat.emissiveIntensity = 1.1 + Math.sin(time * 7) * .05;
  // pervane izi ve balast baloncukları (tanka su girerken hava tahliye edilir)
  if (Math.random() < dt * (play ? 26 : 8)) { tC.set(-1.75, 0, 0).applyEuler(sub.rotation).add(sub.position);
    addBub(tA.set(tC.x, tC.y + (Math.random() - .5) * .5, tC.z + (Math.random() - .5) * .5), tB.set(-1.5 - Math.random() * 2, .4 + Math.random() * .6, (Math.random() - .5)), 1.6); }
  if (G.holding && play && Math.random() < dt * 30) addBub(tA.copy(sub.position).add(tB.set(-.3 + Math.random() * .7, .6, (Math.random() - .5) * .4)), tB.set(-v * .3, 1.6 + Math.random() * 1.2, (Math.random() - .5) * .6), 2.4);
  // kuvvet okları
  const r = G.rho();
  if (play || G.state === 'start') { arG.set(tA.set(sx, sy - .15, .9), tB.copy(dn).multiplyScalar(r * FK), .055); arF.set(tA.set(sx, sy + .15, .9), tB.copy(up).multiplyScalar(rs * FK), .055); }
  else { arG.hide(); arF.hide(); }
  // oyun nesneleri
  sync(G.gates, 'gate', (o, gt) => { layoutGate(o, gt); const bl = Math.sin(time * 5) > 0; o.lT.material = o.lB.material = bl ? lampOn : lampOff;
    o.flash = Math.max(0, o.flash - dt * 1.2); o.ring.material.opacity = gt.passed ? .25 + o.flash * .7 : .55 + .2 * Math.sin(time * 3); if (!gt.passed) o.ring.material.color.setRGB(.3, 2.2, 2);
    o.ring.rotation.x = time * .3; });
  let li = 0;
  sync(G.mines, 'mine', (o, m) => { const y = Y(m.y + Math.sin(m.bob) * 5); o.g.position.set(X(m.x), y, 0); o.g.rotation.set(Math.sin(m.bob) * .15, m.bob * .2, 0); const on = Math.sin(time * 6) > 0; o.l.material = on ? mineLightOn : mineLightOff; o.h.visible = on;
    if (m.chained) for (let yy = y - .72; yy > BEDY && li < LINKS; yy -= .3) { dO.position.set(X(m.x), yy, 0); dO.rotation.set(0, li % 2 ? Math.PI / 2 : 0, 0); dO.scale.set(1, 1, 1); dO.updateMatrix(); linkM.setMatrixAt(li++, dO.matrix); } });
  linkM.count = li; linkM.instanceMatrix.needsUpdate = true;
  sync(G.treas, 'tre', (o, t) => { o.g.position.set(X(t.x), Y(t.y), 0); o.m.rotation.y = time * 2 + t.tw * .2; o.h.material.opacity = .6 + .4 * Math.sin(t.tw * 2); });
  // baloncuklar: oyunun 2B baloncukları + 3B iz baloncukları
  let bi = 0;
  for (const b of G.bubbles) { if (bi >= BUB) break; bubP[bi * 3] = X(b.x); bubP[bi * 3 + 1] = Y(b.y); bubP[bi * 3 + 2] = .3; bi++; }
  for (let i = bub3.length - 1; i >= 0; i--) { const b = bub3[i]; b.t += dt; if (b.t > b.life || b.p.y > -.05) { bubFree.push(b); bub3[i] = bub3[bub3.length - 1]; bub3.pop(); continue; }
    b.v.multiplyScalar(Math.exp(-dt * 1.4)); b.v.y += 2.2 * dt; b.p.addScaledVector(b.v, dt); b.p.x += Math.sin(b.t * 6 + b.w) * .01 - (play ? v * .25 : 0) * dt;
    if (bi < BUB) { bubP[bi * 3] = b.p.x; bubP[bi * 3 + 1] = b.p.y; bubP[bi * 3 + 2] = b.p.z; bi++; } }
  bubG.setDrawRange(0, bi); bubG.attributes.position.needsUpdate = true;
  let pi = 0; for (const p of G.particles) { if (pi >= PN) break; const a = Math.max(0, 1 - p.age / p.life); parP[pi * 3] = X(p.x); parP[pi * 3 + 1] = Y(p.y); parP[pi * 3 + 2] = .5; tmpC.set(p.col).multiplyScalar(2.2 * a); parC[pi * 3] = tmpC.r; parC[pi * 3 + 1] = tmpC.g; parC[pi * 3 + 2] = tmpC.b; pi++; }
  parG.setDrawRange(0, pi); parG.attributes.position.needsUpdate = parG.attributes.color.needsUpdate = true;
  // patlama
  boomT += dt; boomL.intensity = boomT < .6 ? 900 * Math.pow(1 - boomT / .6, 2) : 0; shock.scale.setScalar(.5 + boomT * 9); shockMat.uniforms.opacity.value = boomT < .6 ? 1.4 * (1 - boomT / .6) : 0; shock.visible = boomT < .6;
  camShake = Math.max(0, camShake - dt * 1.6);
  // halokline: bir sonraki bölge sınırı ekrana girince görünür
  if (play) { const nb = G.nextBoundary(G.dist), bx = G.sub.x + (nb - G.dist) * G.PXM, next = G.ZONES[G.zoneAt(nb + 1)];
    curtain.visible = bx < G.W + 400 && bx > -200; curtain.position.x = X(bx); curtMat.uniforms.uCol.value.set(next.rho >= 1200 ? '#b58cff' : next.rho > 1010 ? '#5fc8ff' : '#6affc2'); }
  else curtain.visible = false;
  zoneFlash = Math.max(0, zoneFlash - dt);
  fitCamera(time);
  sun.target.position.set(sx, BEDY, 0); sun.position.copy(W.sunDir).multiplyScalar(60).add(sun.target.position);
  W.frame(dt);
}
fitCamera(0); O.show();
// Önceden derleme + doku yükleme: ilk kapı/mayın/hazine/patlamada takılma olmasın. Örnekler sonra havuza girer.
const texReady = ts => new Promise(res => { const t0 = performance.now(), chk = () => ts.every(t => t.image) || performance.now() - t0 > 5000 ? res() : setTimeout(chk, 60); chk(); });
const pv = new THREE.Vector3();
const R3D = { frame, ready: false, overlay: () => O.sync(), size: () => O, proj: (x, y) => O.project(pv.set(X(x), Y(y), 0)) };
(async () => {
  try { await texReady([rust.col, rust.nor, rust.arm, baseM.map, baseM.normalMap]);
    const s = { gate: take('gate'), mine: take('mine'), tre: take('tre') }; for (const k in s) scene.remove(s[k].g);
    curtain.visible = shock.visible = true;
    await prewarm([s.gate.g, s.mine.g, s.tre.g, new THREE.Mesh(lampG, lampOff), new THREE.Mesh(mLampG, mineLightOff)]);   // yanıp sönen lambaların ikinci malzemesi de
    for (const k in s) { s[k].g.position.set(0, 0, 0); scene.add(s[k].g); drop(k, s[k]); } curtain.visible = shock.visible = false;
  } catch (e) { console.error(e); }
  R3D.ready = true;
})();
window.BFY_R3D = R3D;
window.__r3d = { W, scene, camera, sub };
