(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollTo = el => el?.scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start'});
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('main-nav');
  function closeMenu() {
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) {
      closeMenu();
      document.querySelectorAll('.nav-more[open]').forEach(el => el.open = false);
    }
    if (event.target.closest('#main-nav a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (menu?.classList.contains('open')) { closeMenu(); menuButton.focus(); }
    document.querySelectorAll('.nav-more[open]').forEach(el => {
      el.open = false;
      el.querySelector('summary').focus();
    });
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

  const roles = [...document.querySelectorAll('[data-role]')];
  const resources = [...document.querySelectorAll('[data-audience]')];
  const allButton = document.getElementById('show-all');
  function selectRole(role, move = false) {
    if (!['ogrenci','ogretmen','all'].includes(role)) role = 'ogrenci';
    roles.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.role === role)));
    let count = 0;
    resources.forEach(card => {
      card.hidden = role !== 'all' && !card.dataset.audience.split(' ').includes(role);
      if (!card.hidden) count++;
    });
    const heading = document.getElementById('resource-title');
    if (heading) heading.innerHTML = role === 'ogretmen' ? 'Dersine değer katan <em>kaynaklar.</em>' : role === 'all' ? 'Her ihtiyaca <em>bir kaynak.</em>' : 'Öğrenmenin <em>birçok yolu var.</em>';
    const counter = document.getElementById('resource-count');
    if (counter) counter.textContent = `${count} ${role === 'ogretmen' ? 'öğretmen kaynağı' : role === 'ogrenci' ? 'öğrenci kaynağı' : 'kaynak'}`;
    if (allButton) allButton.hidden = role === 'all';
    try { localStorage.setItem('bfy-aud', role); } catch { /* Browsing with storage disabled still works. */ }
    if (move) scrollTo(document.getElementById('kaynaklar'));
  }
  if (resources.length) {
    let saved = 'ogrenci';
    try { saved = localStorage.getItem('bfy-aud') || saved; } catch {}
    // Existing product deep links remain reachable even if a different role was saved.
    if (resources.some(card => `#${card.id}` === location.hash)) saved = 'all';
    selectRole(saved);
    roles.forEach(button => button.addEventListener('click', () => selectRole(button.dataset.role, true)));
    allButton?.addEventListener('click', () => selectRole('all'));
    window.addEventListener('hashchange', () => {
      const target = resources.find(card => `#${card.id}` === location.hash);
      if (target?.hidden) { selectRole('all'); scrollTo(target); }
    });
  }

  const gradeButtons = [...document.querySelectorAll('[data-preview-grade]')];
  function selectGrade(grade) {
    gradeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.previewGrade === grade)));
    document.querySelectorAll('[data-grade]').forEach(card => card.hidden = card.dataset.grade !== grade);
  }
  if (gradeButtons.length) {
    selectGrade('9');
    gradeButtons.forEach(button => button.addEventListener('click', () => selectGrade(button.dataset.previewGrade)));
  }
  const dialog = document.getElementById('preview-dialog');
  if (dialog) {
    const full = document.getElementById('preview-full');
    const wrap = dialog.querySelector('.dialog-image-wrap');
    let opener;
    document.querySelectorAll('[data-preview]').forEach(button => {
      button.addEventListener('click', () => {
        opener = button;
        full.src = button.dataset.preview;
        full.alt = button.dataset.caption;
        document.getElementById('preview-title').textContent = button.dataset.caption;
        wrap.classList.remove('zoomed');
        dialog.showModal();
        wrap.scrollTo(0, 0);
      });
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => opener?.focus({preventScroll:true}));
    full.addEventListener('click', () => {
      wrap.classList.toggle('zoomed');
      wrap.scrollTo(0, 0);
    });
  }

  const form = document.getElementById('denemeForm');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type=submit]');
    if (button.disabled) return;
    const error = document.getElementById('denemeError');
    error.hidden = true;
    form.elements._subject.value = '🎁 KİT DENEME PAKETİ indirildi — ' + form.elements.ad.value.trim().slice(0,40);
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = 'Gönderiliyor…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}, signal:controller.signal});
      if (!response.ok) throw new Error('Form submission failed');
      form.hidden = true;
      const success = document.getElementById('denemeSuccess');
      success.hidden = false;
      success.focus({preventScroll:true});
      scrollTo(success);
    } catch {
      error.hidden = false;
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.innerHTML = original;
    }
  });

  document.querySelectorAll('.newsletter-form').forEach(details => {
    details.addEventListener('toggle', () => {
      const iframe = details.querySelector('iframe[data-src]');
      if (details.open && iframe) { iframe.src = iframe.dataset.src; delete iframe.dataset.src; }
    });
  });

  const demoFrame = document.getElementById('kit-live-demo');
  if (demoFrame) {
    let currentWeek = '07';
    let started = false;
    const titles = {'07':'Skaler ve Vektörel Nicelikler','23':'Kaldırma Kuvveti · Deney Haftası'};
    const placeholder = document.getElementById('demo-placeholder');
    const loadButton = document.getElementById('demo-load');
    function chooseWeek(week) {
      currentWeek = week;
      const url = `BFY9_Hafta${week}_KIT_interaktif.html`;
      document.querySelectorAll('[data-demo-week]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoWeek === week)));
      document.getElementById('demo-open').href = url;
      document.getElementById('demo-topic').textContent = titles[week];
      placeholder.querySelector('.eyebrow').textContent = `9. SINIF · HAFTA ${Number(week)}`;
      demoFrame.title = `BFY Hoca Kiti — 9. sınıf ${Number(week)}. hafta: ${titles[week]}`;
      if (started) demoFrame.src = url;
    }
    document.querySelectorAll('[data-demo-week]').forEach(button => button.addEventListener('click', () => chooseWeek(button.dataset.demoWeek)));
    loadButton.addEventListener('click', () => {
      started = true;
      placeholder.hidden = true;
      demoFrame.hidden = false;
      chooseWeek(currentWeek);
    });
  }
  // Pointer depth is decorative. Touch, keyboard and reduced-motion users get the same content.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.kit-display,.spotlight-books').forEach(surface => {
    const target = surface.querySelector('[data-tilt]');
    if (!target) return;
    surface.addEventListener('pointermove', event => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const rect = surface.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      target.style.rotate = `${-y} ${x} 0 ${Math.hypot(x,y)*7}deg`;
    });
    surface.addEventListener('pointerleave', () => target.style.rotate = 'none');
    reducedMotion.addEventListener('change', () => target.style.rotate = 'none');
  });
})();
