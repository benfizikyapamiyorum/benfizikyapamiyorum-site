(function () {
  'use strict';
  const box = document.querySelector('.pf-buy');
  if (!box) return;
  const cards = Array.from(document.querySelectorAll('[data-pf-license]'));
  const options = new Map(cards.map(card => [card.dataset.pfLicense, card]));
  const roleInputs = box.querySelectorAll('[name="pf-role"]');
  const demoBtn = box.querySelector('[data-pf-demo]');
  const baseDemo = demoBtn.getAttribute('href');
  const baseDemoText = demoBtn.innerHTML;
  function selectRole(role, updateAddress) {
    const card = options.get(role) || options.get('ogrenci');
    if (!card) return;
    role = card.dataset.pfLicense;
    const checkout = card.querySelector('a[data-urun]');
    const primary = box.querySelector('[data-pf-checkout]');
    const teacher = role === 'ogretmen';
    const kamp = role === 'kamp';
    box.querySelector('[data-pf-name]').textContent = kamp
      ? 'Bağlam Temelli Özet & Yazılı Kamp Föyü (PDF)'
      : teacher ? 'Öğretmen lisansı' : 'Öğrenci lisansı';
    box.querySelector('[data-pf-price]').textContent = card.querySelector('.tutar').textContent;
    box.querySelector('[data-pf-scope]').textContent = kamp
      ? '4 ünite fasikülü, 80 bağlam temelli soru + 16 açık uçlu yazılı. Öğrenci ve öğretmen çift baskı PDF birlikte (güncellemesiz statik paket).'
      : teacher
        ? 'Öğrenci içeriğine ek olarak sınıf için çalışma kâğıdı, A/B formu ve çözümlü öğretmen kopyası.'
        : 'Kişisel çalışma ve adına özel PDF kitapçıklar.';
    primary.href = checkout.href;
    primary.dataset.urun = checkout.dataset.urun;
    primary.textContent = kamp
      ? 'Kamp föyünü al (₺199) ↗'
      : (teacher ? 'Öğretmen' : 'Öğrenci') + ' lisansını al ↗';
    roleInputs.forEach(input => { input.checked = input.value === role; });
    if (kamp && card.dataset.pfDemo) {
      demoBtn.href = card.dataset.pfDemo;
      demoBtn.target = '_blank';
      demoBtn.innerHTML = '5 sayfa örnek PDF <span aria-hidden="true">↗</span>';
    } else {
      demoBtn.removeAttribute('target');
      demoBtn.innerHTML = baseDemoText;
      const demo = new URL(baseDemo, location.href);
      if (demo.searchParams.has('sinif')) {
        demo.searchParams.set('kime', role);
        demoBtn.href = demo.pathname + demo.search + demo.hash;
      } else {
        demoBtn.href = baseDemo;
      }
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
