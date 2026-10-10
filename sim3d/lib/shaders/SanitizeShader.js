// BFY · HDR temizleme geçişi.
// Yarım hassasiyetli (HalfFloat) tamponda çok parlak bir yansıma Inf/NaN'a taşabilir; parıltı (bloom) bu
// pikseli bulanıklaştırıp bütün ekrana yayar ve ACES ton eşleme NaN'ı siyaha çevirir → ekran kararır.
// Bu geçiş bloom'dan önce çalışır: NaN'ı sıfırlar, aşırı değerleri makul bir tavana keser.
export const SanitizeShader = {
  name: 'SanitizeShader',
  uniforms: { tDiffuse: { value: null }, uMax: { value: 48.0 } },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform float uMax; varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      // NaN kendine eşit değildir; Inf ise tavandan büyüktür
      if (c.r != c.r || c.g != c.g || c.b != c.b) c.rgb = vec3(0.0);
      c.rgb = clamp(c.rgb, 0.0, uMax);
      c.a = clamp(c.a, 0.0, 1.0);
      gl_FragColor = c;
    }`,
};
