// BFY · Keskin 360° arka plan.
// Three.js eşdikdörtgen (equirect) arka planı önce küp haritaya çevirip oradan örnekliyor: iki kez yeniden
// örnekleme detayı siliyor, 8K görüntüde de ~100 MB fazladan bellek harcıyor. Burada görüntü doğrudan,
// Catmull-Rom bikübik süzgeçle örneklenir: büyütülen bölgeler bulanık/basamaklı değil, net görünür.
import * as THREE from 'three';

const VS = /* glsl */`
varying vec2 vNdc;
void main() { vNdc = position.xy; gl_Position = vec4(position.xy, 1.0, 1.0); }`;

const FS = /* glsl */`
uniform sampler2D tSky; uniform vec2 uSize; uniform mat4 uInvProj; uniform mat4 uCamWorld; uniform mat3 uRot; uniform float uIntensity, uLod;
varying vec2 vNdc;
#define PI 3.141592653589793
vec2 equirectUv(vec3 d) { return vec2(atan(d.z, d.x) * (0.5 / PI) + 0.5, asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5); }
// 9 dokulu Catmull-Rom bikübik örnekleme (donanım çift doğrusal süzgeci ağırlıkları birleştirir)
vec4 sampleBicubic(vec2 uv) {
  vec2 sp = uv * uSize, tc = floor(sp - 0.5) + 0.5, f = sp - tc;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f)), w1 = 1.0 + f * f * (-2.5 + 1.5 * f), w2 = f * (0.5 + f * (2.0 - 1.5 * f)), w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2, o12 = w2 / w12;
  vec2 t0 = (tc - 1.0) / uSize, t3 = (tc + 2.0) / uSize, t12 = (tc + o12) / uSize;
  vec4 r = vec4(0.0);
  r += textureLod(tSky, vec2(t0.x, t0.y), 0.0) * w0.x * w0.y;   r += textureLod(tSky, vec2(t12.x, t0.y), 0.0) * w12.x * w0.y;  r += textureLod(tSky, vec2(t3.x, t0.y), 0.0) * w3.x * w0.y;
  r += textureLod(tSky, vec2(t0.x, t12.y), 0.0) * w0.x * w12.y; r += textureLod(tSky, vec2(t12.x, t12.y), 0.0) * w12.x * w12.y; r += textureLod(tSky, vec2(t3.x, t12.y), 0.0) * w3.x * w12.y;
  r += textureLod(tSky, vec2(t0.x, t3.y), 0.0) * w0.x * w3.y;   r += textureLod(tSky, vec2(t12.x, t3.y), 0.0) * w12.x * w3.y;  r += textureLod(tSky, vec2(t3.x, t3.y), 0.0) * w3.x * w3.y;
  return max(r, vec4(0.0));
}
void main() {
  vec4 v = uInvProj * vec4(vNdc, 1.0, 1.0); vec3 dir = normalize((uCamWorld * vec4(v.xyz / v.w, 0.0)).xyz);
  vec2 uv = equirectUv(uRot * dir);
  // keskin: bikübik tam çözünürlük; bulanık (alan derinliği): yumuşak küçültülmüş katmanlar
  vec4 c = uLod > 0.0 ? textureLod(tSky, uv, uLod) : sampleBicubic(uv);
  gl_FragColor = vec4(c.rgb * uIntensity, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export function createSky(scene, camera) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { tSky: { value: null }, uSize: { value: new THREE.Vector2(1, 1) }, uInvProj: { value: new THREE.Matrix4() }, uCamWorld: { value: new THREE.Matrix4() }, uRot: { value: new THREE.Matrix3() }, uIntensity: { value: 1 }, uLod: { value: 0 } },
    vertexShader: VS, fragmentShader: FS, depthTest: false, depthWrite: false, fog: false, toneMapped: true,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  mesh.frustumCulled = false; mesh.renderOrder = -1e6; mesh.visible = false; mesh.name = 'bfy-sky';
  const e = new THREE.Euler(), m4 = new THREE.Matrix4(); let lastRot = NaN;
  // her karede kamera matrisleri ve sahnenin arka plan ayarları (döndürme, yoğunluk, bulanıklık) aynen kullanılır
  mesh.onBeforeRender = (r, s, cam) => {
    const U = mat.uniforms; U.uInvProj.value.copy(cam.projectionMatrixInverse); U.uCamWorld.value.copy(cam.matrixWorld);
    U.uIntensity.value = scene.backgroundIntensity; U.uLod.value = scene.backgroundBlurriness > 0 ? scene.backgroundBlurriness * 60 : 0;
    const ry = scene.backgroundRotation.y; if (ry !== lastRot) { lastRot = ry; e.set(0, -ry, 0); U.uRot.value.setFromMatrix4(m4.makeRotationFromEuler(e)); }
  };
  scene.add(mesh);
  const sky = {
    mesh,
    // tex: eşdikdörtgen doku. Döndürme/yoğunluk/bulanıklık scene.background* ayarlarından okunur.
    // mips: bulanık arka plan gerekiyorsa küçültülmüş katmanlar üretilir (8K'da bellek için kapalı tutulur)
    set(tex, { mips = true } = {}) {
      if (!tex) { mesh.visible = false; mat.uniforms.tSky.value = null; return; }
      tex.generateMipmaps = mips; tex.minFilter = mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.ClampToEdgeWrapping; tex.needsUpdate = true;
      mat.uniforms.tSky.value = tex; mat.uniforms.uSize.value.set(tex.image.width, tex.image.height); mesh.visible = true;
      scene.background = null;
    },
    get texture() { return mat.uniforms.tSky.value; },
  };
  return sky;
}
