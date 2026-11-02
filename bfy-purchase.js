(function () {
  'use strict';
  const box = document.querySelector('.pf-buy');
  if (!box) return;
  const cards = Array.from(document.querySelectorAll('[data-pf-license]'));
  const options = new Map(cards.map(card => [card.dataset.pfLicense, card]));
  const roleInputs = box.querySelectorAll('[name="pf-role"]');
  const baseDemo = box.querySelector('[data-pf-demo]').getAttribute('href');
  function selectRole(role, updateAddress) {
    const card = options.get(role) || options.get('ogrenci');
    if (!card) return;
    role = card.dataset.pfLicense;
    const checkout = card.querySelector('a[data-urun]');
    const primary = box.querySelector('[data-pf-checkout]');
    const teacher = role === 'ogretmen';
    box.querySelector('[data-pf-name]').textContent = teacher ? 'Öğretmen lisansı' : 'Öğrenci lisansı';
    box.querySelector('[data-pf-price]').textContent = card.querySelector('.tutar').textContent;
    box.querySelector('[data-pf-scope]').textContent = teacher
      ? 'Öğrenci içeriğine ek olarak sınıf için çalışma kâğıdı, A/B formu ve çözümlü öğretmen kopyası.'
      : 'Kişisel çalışma ve adına özel PDF kitapçıklar.';
    primary.href = checkout.href;
    primary.dataset.urun = checkout.dataset.urun;
    primary.textContent = (teacher ? 'Öğretmen' : 'Öğrenci') + ' lisansını al ↗';
    roleInputs.forEach(input => { input.checked = input.value === role; });
    const demo = new URL(baseDemo, location.href);
    if (demo.searchParams.has('sinif')) {
      demo.searchParams.set('kime', role);
      box.querySelector('[data-pf-demo]').href = demo.pathname + demo.search + demo.hash;
    }
    if (updateAddress) {
      const u = new URL(location.href);
      u.searchParams.set('kime', role);
      history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    }
  }
  selectRole(new URLSearchParams(location.search).get('kime') || 'ogrenci', false);
  const choices = box.querySelector('.pf-roles');
  if (choices) choices.hidden = false;
  roleInputs.forEach(input => input.addEventListener('change', () => selectRole(input.value, true)));
  window.addEventListener('popstate', () => selectRole(new URLSearchParams(location.search).get('kime') || 'ogrenci', false));
})();
