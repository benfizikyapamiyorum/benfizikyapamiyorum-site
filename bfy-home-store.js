/* Decorative 3D scenes load when their section is close, after the products. */
(() => {
  function loadNear(selector, source) {
    const target = document.querySelector(selector);
    if (!target) return;
    const load = () => import(source).catch(() => {
      // Existing static artwork remains usable if WebGL or the module is unavailable.
    });
    if (!('IntersectionObserver' in window)) { load(); return; }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      load();
    }, { rootMargin: '240px' });
    observer.observe(target);
  }
  loadNear('#physics-stage', './bfy-scene.js?v=20260920a');
  loadNear('#senin-icin', './bfy-audience3d.js?v=20260914a');
})();
