// BFY oyunları · ortak 3B yardımcıları
import { THREE, createWorld } from '../sim3d/bfy3d-core.js?v=5';

// 2B oyun tuvalini 3B sahnenin üstünde şeffaf bir katman yapar.
// Oyun mantığı kendi piksel koordinatlarında (G.W × G.H) kalır; çizim ve dokunma 3B'ye çevrilir.
export function overlayWorld(G, opts = {}) {
  const stage = document.getElementById('stage'), cv = G.canvas;
  const canvas = document.createElement('canvas'); canvas.id = 'g3d'; stage.insertBefore(canvas, stage.firstChild);
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .6s';
  const W = createWorld({ stage, canvas, fov: opts.fov || 38, near: opts.near || .2, far: opts.far || 9000, shadowBox: opts.shadowBox || 60, shadowFar: opts.shadowFar || 400, bloom: opts.bloom || [.25, .45, 1.1] });
  W.orbit.enabled = false;
  // katman tuvali: CSS boyutu × DPR, çizim CSS pikselinde
  const O = { cv, ctx: cv.getContext('2d'), w: 1, h: 1, dpr: 1 };
  O.sync = () => { const r = stage.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); const w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } O.w = r.width; O.h = r.height; O.dpr = d; O.ctx.setTransform(d, 0, 0, d, 0, 0); O.ctx.clearRect(0, 0, r.width, r.height); return O.ctx; };
  const v = new THREE.Vector3();
  // dünya → katman pikseli
  O.project = p => { v.copy(p).project(W.camera); return { x: (v.x * .5 + .5) * O.w, y: (-v.y * .5 + .5) * O.h, ok: v.z < 1 }; };
  // ekran → z = düzlem üzerindeki dünya noktası
  const rc = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3();
  O.pick = (clientX, clientY, z = 0) => { const r = canvas.getBoundingClientRect(); rc.setFromCamera(new THREE.Vector2((clientX - r.left) / r.width * 2 - 1, -(clientY - r.top) / r.height * 2 + 1), W.camera); plane.constant = -z; return rc.ray.intersectPlane(plane, hit) ? hit.clone() : null; };
  O.show = () => { canvas.style.opacity = 1; stage.classList.add('r3d'); };
  return { W, O, stage, canvas };
}

// Fotoğraf gerçekliğinde çim: dünya koordinatlı doku + geniş ölçekli renk oynaması + uzakta arka plana karışma
export function macroGround(m, { fade = [170, 420], key = 'g' } = {}) {
  const ob = m.onBeforeCompile; m.transparent = !!fade;
  m.onBeforeCompile = sh => { ob && ob(sh);
    sh.fragmentShader = sh.fragmentShader.replace('void main() {', `float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
      void main() {`).replace('#include <color_fragment>', `#include <color_fragment>
      { vec2 mq = vWPos.xz + uOff.xz; float n = vn(mq / 9.) * .55 + vn(mq / 37. + 7.) * .45; diffuseColor.rgb *= mix(.62, 1.25, n); }`)
      .replace('#include <opaque_fragment>', '#include <opaque_fragment>' + (fade ? `\n gl_FragColor.a *= 1.0 - smoothstep(${fade[0].toFixed(1)}, ${fade[1].toFixed(1)}, length(vWPos.xz - cameraPosition.xz));` : '')); };
  m.customProgramCacheKey = () => 'mg' + key;
  return m;
}
