/* BFY 11. sınıf paketi: CSS 3B cihaz vitrini (tablet + telefonlar).
   Kullanım: <div class="c3d-sahne" data-c3d> içinde <div class="c3d-kutu" data-w data-h data-d style="--x --y --z --ry --rx --rz"><img></div>
   Her kutu 6 yüzlü gerçek bir 3B cisim olur; sahne fareyle hafifçe döner, cihazlar süzülür. */
(() => {
  'use strict';
  const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function kur(sahne) {
    sahne.querySelectorAll('.c3d-kutu').forEach((kutu, i) => {
      if (kutu.dataset.kuruldu) return;
      const W = +kutu.dataset.w, H = +kutu.dataset.h, D = +kutu.dataset.d || 12;
      const img = kutu.querySelector('img');
      kutu.style.width = W + 'px'; kutu.style.height = H + 'px'; kutu.style.marginLeft = -W / 2 + 'px'; kutu.style.marginTop = -H / 2 + 'px';
      const yuz = (sinif, w, h, tf, ic) => {
        const f = document.createElement('div');
        f.className = 'c3d-yuz ' + sinif;
        f.style.width = w + 'px'; f.style.height = h + 'px';
        f.style.left = (W - w) / 2 + 'px'; f.style.top = (H - h) / 2 + 'px';
        f.style.transform = tf;
        if (ic) f.appendChild(ic);
        kutu.appendChild(f);
      };
      yuz('c3d-on', W, H, `translateZ(${D / 2}px)`, img);
      yuz('c3d-arka', W, H, `rotateY(180deg) translateZ(${D / 2}px)`);
      yuz('c3d-yan', D, H, `rotateY(90deg) translateZ(${W / 2}px)`);
      yuz('c3d-yan', D, H, `rotateY(-90deg) translateZ(${W / 2}px)`);
      yuz('c3d-yan c3d-ust', W, D, `rotateX(90deg) translateZ(${H / 2}px)`);
      yuz('c3d-yan', W, D, `rotateX(-90deg) translateZ(${H / 2}px)`);
      kutu.style.animationDelay = (-i * 1.7) + 's';
      kutu.dataset.kuruldu = 1;
    });
    // Sahneyi kabın genişliğine sığdır
    const tas = sahne.querySelector('.c3d-tas');
    const olcekle = () => { const w = sahne.clientWidth, gen = (w < 600 && sahne.dataset.genMobil) ? +sahne.dataset.genMobil : (+sahne.dataset.gen || 640); tas.style.setProperty('--olcek', Math.min(1, w / gen).toFixed(3)); };
    olcekle(); window.addEventListener('resize', olcekle);
    if (azHareket) return;
    let hx = 0, hy = 0, mx = 0, my = 0, calis = false;
    const don = () => { mx += (hx - mx) * 0.08; my += (hy - my) * 0.08; tas.style.setProperty('--fx', (mx * 10).toFixed(2) + 'deg'); tas.style.setProperty('--fy', (-my * 7).toFixed(2) + 'deg'); if (Math.abs(hx - mx) + Math.abs(hy - my) > 0.002) requestAnimationFrame(don); else calis = false; };
    const hedef = (x, y) => { hx = x; hy = y; if (!calis) { calis = true; requestAnimationFrame(don); } };
    sahne.closest('section, .f11-vitrin, body').addEventListener('pointermove', e => {
      const r = sahne.getBoundingClientRect();
      hedef(Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / r.width)), Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / r.height)));
    });
    sahne.closest('section, .f11-vitrin, body').addEventListener('pointerleave', () => hedef(0, 0));
  }
  const bas = () => document.querySelectorAll('[data-c3d]').forEach(kur);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bas); else bas();
})();
