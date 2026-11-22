/* BFY · Ortak Yorum & Sosyal Kanıt Sistemi
   Kullanım: Herhangi bir sayfaya <div class="clarity-wrap" data-bfy-yorumlar data-sayfa="ana"></div> ekle.
   Onaylanan yorumlar bfy-yorumlar.json dosyasından okunur; yeni yorumlar özel form gelen kutusuna gönderilir. */
(() => {
  'use strict';
  const slots = [...document.querySelectorAll('[data-bfy-yorumlar]')];
  if (!slots.length) return;

  const ROL_AD = { ogrenci: 'Öğrenci', veli: 'Veli', ogretmen: 'Öğretmen' };
  // Sitedeki deneme ve yıllık plan formlarıyla aynı, mevcut form gelen kutusu.
  const FORM_ENDPOINT = 'https://formspree.io/f/xykqweby';
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stars = n => '★'.repeat(Math.max(1, Math.min(5, Number(n) || 5))) + '☆'.repeat(5 - Math.max(1, Math.min(5, Number(n) || 5)));

  // Sitede soyadın yalnızca baş harfi görünür: "Elif Kaya" -> "Elif K."
  const basHarf = w => { const c = [...String(w || '').trim()][0]; return c ? c.toLocaleUpperCase('tr-TR') + '.' : ''; };
  const maskAd = ad => {
    const p = String(ad || '').trim().split(/\s+/).filter(Boolean);
    if (p.length < 2) return p[0] || '';
    return p.slice(0, -1).join(' ') + ' ' + basHarf(p[p.length - 1]);
  };

  const buyukBas = t => String(t || '').trim().split(/\s+/).filter(Boolean).map(w => { const c = [...w]; return c[0].toLocaleUpperCase('tr-TR') + c.slice(1).join('').toLocaleLowerCase('tr-TR'); }).join(' ');
  // Formdan gelen ad + soyad: "zeynep", "arslan kaya" -> "Zeynep A."
  const gorunenAd = (ad, soyad) => (buyukBas(ad) + ' ' + basHarf(soyad)).trim();

  let modalEl = null;
  let pickedStar = 5;
  let activePage = 'ana';
  let opener = null;
  let sending = false;

  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.className = 'bfy-rev-modal';
    modalEl.hidden = true;
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-label', 'Deneyimini paylaş');
    modalEl.innerHTML = `
      <div class="bfy-rev-dialog">
        <button type="button" class="bfy-rev-close" aria-label="Kapat">×</button>
        <h3>Deneyimini paylaş</h3>
        <p>Yorumun Timur Yıldırım’ın onayından sonra sitede yayınlanır. Soyadın sitede görünmez, yalnızca baş harfi yazılır.</p>
        <form id="bfy-rev-form" action="${FORM_ENDPOINT}" method="POST">
          <div class="bfy-rev-field">
            <label for="bfy-r-ad">Adın</label>
            <input id="bfy-r-ad" name="ad" required maxlength="30" autocomplete="given-name" placeholder="Örn. Zeynep">
          </div>
          <div class="bfy-rev-field">
            <label for="bfy-r-soyad">Soyadın</label>
            <input id="bfy-r-soyad" required maxlength="30" autocomplete="family-name" placeholder="Örn. Arslan">
            <small class="bfy-rev-onizle" id="bfy-r-onizle" aria-live="polite">Sitede yalnızca baş harfi görünür.</small>
          </div>
          <div class="bfy-rev-field">
            <label for="bfy-r-rol">Kimsin?</label>
            <select id="bfy-r-rol" name="rol">
              <option value="ogrenci">Öğrenci</option>
              <option value="veli">Veli</option>
              <option value="ogretmen">Fizik Öğretmeni</option>
            </select>
          </div>
          <div class="bfy-rev-field">
            <label for="bfy-r-urun">Hangi kaynak veya sınıf?</label>
            <input id="bfy-r-urun" name="etiket" maxlength="60" placeholder="Örn. 10. Sınıf · Yapabilirim TYT Maarif">
          </div>
          <div class="bfy-rev-field">
            <label>Puanın</label>
            <div class="bfy-rev-star-pick" id="bfy-r-stars">
              ${[1,2,3,4,5].map(n => `<button type="button" data-star="${n}" class="is-on" aria-label="${n} yıldız" aria-pressed="${n === 5}">★</button>`).join('')}
            </div>
          </div>
          <div class="bfy-rev-field">
            <label for="bfy-r-metin">Yorumun</label>
            <textarea id="bfy-r-metin" name="metin" required maxlength="320" placeholder="Sitedeki simülasyonlar, notlar veya dijital kitap sana nasıl yardımcı oldu?"></textarea>
          </div>
          <div class="bfy-rev-honey" aria-hidden="true"><label>Bu alanı boş bırak<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
          <button type="submit" class="bfy-rev-submit">Yorumu gönder</button>
          <p class="bfy-rev-note">Yorumun, adın ve soyadının baş harfi onaylandıktan sonra sitede görünür. Soyadının tamamı gönderilmez.</p>
        </form>
        <div class="bfy-rev-status" role="status" aria-live="polite" tabindex="-1" hidden></div>
      </div>`;
    document.body.appendChild(modalEl);

    const close = () => { modalEl.hidden = true; if (opener && opener.isConnected) opener.focus(); };
    modalEl.querySelector('.bfy-rev-close').addEventListener('click', close);
    modalEl.addEventListener('click', e => { if (e.target === modalEl) close(); });
    document.addEventListener('keydown', e => {
      if (modalEl.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const controls = [...modalEl.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)')].filter(x => x.tabIndex >= 0 && x.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    });

    const starBtns = [...modalEl.querySelectorAll('#bfy-r-stars button')];
    function updateStars() {
      starBtns.forEach(x => {
        x.classList.toggle('is-on', Number(x.dataset.star) <= pickedStar);
        x.setAttribute('aria-pressed', String(Number(x.dataset.star) === pickedStar));
      });
    }
    starBtns.forEach(b => b.addEventListener('click', () => {
      pickedStar = Number(b.dataset.star);
      updateStars();
    }));

    const form = modalEl.querySelector('#bfy-rev-form');
    const status = modalEl.querySelector('.bfy-rev-status');
    const adEl = modalEl.querySelector('#bfy-r-ad'), soyEl = modalEl.querySelector('#bfy-r-soyad'), onizle = modalEl.querySelector('#bfy-r-onizle');
    const onizleCiz = () => {
      const a = adEl.value.trim(), b = soyEl.value.trim();
      onizle.textContent = a && b ? 'Sitede böyle görünecek: ' + gorunenAd(a, b) : 'Sitede yalnızca baş harfi görünür.';
    };
    adEl.addEventListener('input', onizleCiz); soyEl.addEventListener('input', onizleCiz);
    form.addEventListener('reset', () => setTimeout(onizleCiz, 0));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (sending || !form.reportValidity() || form.elements._gotcha.value) return;
      const ad = gorunenAd(modalEl.querySelector('#bfy-r-ad').value, modalEl.querySelector('#bfy-r-soyad').value);
      const rol = modalEl.querySelector('#bfy-r-rol').value;
      const urun = modalEl.querySelector('#bfy-r-urun').value.trim() || ROL_AD[rol];
      const metin = modalEl.querySelector('#bfy-r-metin').value.trim();
      if (!ad || !metin) {
        status.hidden = false; status.dataset.state = 'error';
        status.textContent = 'Lütfen adını ve yorumunu yaz.'; status.focus(); return;
      }
      const body = new FormData(form);
      body.set('ad', ad); body.set('metin', metin); body.set('etiket', urun);
      body.set('puan', String(pickedStar)); body.set('rol_adi', ROL_AD[rol]);
      body.set('tur', 'site-yorumu'); body.set('sayfa', activePage);
      body.set('sayfa_url', location.origin + location.pathname);
      body.set('_subject', 'BFY · Onay bekleyen site yorumu');
      const submit = form.querySelector('[type="submit"]');
      const controls = [...form.querySelectorAll('input,textarea,select,button')];
      sending = true; form.setAttribute('aria-busy', 'true');
      controls.forEach(x => { x.disabled = true; }); submit.textContent = 'Gönderiliyor…';
      status.hidden = false; status.dataset.state = 'pending'; status.textContent = 'Yorumun gönderiliyor…';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(FORM_ENDPOINT, { method: 'POST', body, headers: { Accept: 'application/json' }, signal: controller.signal });
        const result = await response.json();
        if (!response.ok || result.ok === false || result.error || (result.errors && result.errors.length)) throw new Error('submission-failed');
        form.reset(); pickedStar = 5; updateStars(); form.hidden = true;
        status.dataset.state = 'success';
        status.textContent = 'Teşekkürler! Yorumun inceleme için alındı. Onaylandıktan sonra sitede görünecek.';
      } catch (error) {
        status.dataset.state = 'error';
        status.textContent = error.name === 'AbortError'
          ? 'Gönderim henüz doğrulanamadı. Yazdıkların korunuyor; bir süre sonra tekrar deneyebilirsin.'
          : 'Yorum gönderilemedi. Yazdıkların korunuyor; bağlantını kontrol edip tekrar deneyebilirsin.';
      } finally {
        clearTimeout(timer); sending = false; form.removeAttribute('aria-busy');
        controls.forEach(x => { x.disabled = false; }); submit.textContent = 'Yorumu gönder';
        if (!modalEl.hidden) status.focus();
      }
    });
    return modalEl;
  }

  function openModal(event) {
    opener = event.currentTarget;
    if (!sending) activePage = opener.closest('[data-bfy-yorumlar]').dataset.sayfa || 'ana';
    const modal = ensureModal();
    const form = modal.querySelector('form');
    if (form.hidden) { form.hidden = false; modal.querySelector('.bfy-rev-status').hidden = true; }
    if (!sending && activePage === 'hocakiti') modal.querySelector('#bfy-r-rol').value = 'ogretmen';
    modal.hidden = false;
    modal.querySelector(sending ? '.bfy-rev-close' : '#bfy-r-ad').focus();
  }

  function renderSlot(el, allReviews) {
    const sayfa = el.dataset.sayfa || 'ana';
    const limit = Number(el.dataset.limit || 6);
    const list = allReviews.filter(r => !r.sayfa || r.sayfa.includes(sayfa));
    let activeRole = 'all';

    function draw() {
      const filtered = activeRole === 'all' ? list : list.filter(r => r.rol === activeRole);
      const shown = filtered.slice(0, limit);
      const avg = list.length ? (list.reduce((a, b) => a + (Number(b.puan) || 5), 0) / list.length).toFixed(1) : null;

      if (!list.length) {
        el.innerHTML = `
          <section class="bfy-rev" aria-label="Kullanıcı yorumları">
            <div class="bfy-rev-empty">
              <div>
                <p class="overline" style="margin-bottom:6px!important">GERÇEK DENEYİMLER</p>
                <h3>${sayfa === 'hocakiti' ? 'Kiti kullanan öğretmenler ne diyor? İlk yorumu siz bırakın.' : 'Kullananlar ne diyor? İlk yorumu sen bırak.'}</h3>
                <p>${sayfa === 'hocakiti' ? 'Hoca Kiti’ni derste kullandıysanız kısa bir yorumla meslektaşlarınıza yol gösterebilirsiniz. Yorumlar onaylandıktan sonra yayınlanır.' : 'Simülasyonları, ücretsiz notları, Yapabilirim dijital kitaplarını veya Hoca Kiti’ni kullandıysan kısa bir yorumla diğer öğrencilere ve öğretmenlere yol gösterebilirsin.'}</p>
              </div>
              <button type="button" class="bfy-rev-write-btn" data-open-rev>✍️ Deneyimini paylaş →</button>
            </div>
          </section>`;
        el.querySelector('[data-open-rev]').addEventListener('click', openModal);
        return;
      }

      const rolesPresent = [...new Set(list.map(r => r.rol))];
      el.innerHTML = `
        <section class="bfy-rev" aria-label="Öğrenci, veli ve öğretmen yorumları">
          <div class="bfy-rev-head">
            <div>
              <p class="overline">GERÇEK KULLANICI YORUMLARI</p>
              <h2>Kullananlar ne diyor?</h2>
              <p class="bfy-rev-sub">Öğrencilerden, velilerden ve fizik öğretmenlerinden doğrulanmış geri bildirimler.</p>
            </div>
            <div class="bfy-rev-actions">
              <span class="bfy-rev-avg"><b>★ ${avg}</b> / 5 · ${list.length} yorum</span>
              <button type="button" class="bfy-rev-write-btn" data-open-rev>✍️ Yorum bırak</button>
            </div>
          </div>
          ${rolesPresent.length > 1 ? `
            <div class="bfy-rev-filters">
              <button type="button" class="bfy-rev-pill${activeRole === 'all' ? ' is-active' : ''}" data-rol="all">Tümü (${list.length})</button>
              ${rolesPresent.map(r => `<button type="button" class="bfy-rev-pill${activeRole === r ? ' is-active' : ''}" data-rol="${r}">${ROL_AD[r] || r}</button>`).join('')}
            </div>` : ''}
          <div class="bfy-rev-grid">
            ${shown.map(r => `
              <article class="bfy-rev-card">
                <div class="bfy-rev-top">
                  <span class="bfy-rev-stars" aria-label="${Number(r.puan) || 5} üzerinden 5 yıldız">${stars(r.puan)}</span>
                  <span class="bfy-rev-role is-${esc(r.rol)}">${esc(ROL_AD[r.rol] || 'Kullanıcı')}</span>
                </div>
                <p class="bfy-rev-text">“${esc(r.metin)}”</p>
                <div class="bfy-rev-foot">
                  <div>
                    <strong>${esc(maskAd(r.ad))}</strong>
                    <small>${esc(r.etiket || '')}</small>
                  </div>
                </div>
              </article>`).join('')}
          </div>
        </section>`;

      el.querySelector('[data-open-rev]').addEventListener('click', openModal);
      el.querySelectorAll('[data-rol]').forEach(b => b.addEventListener('click', () => {
        activeRole = b.dataset.rol;
        draw();
      }));
    }
    draw();
  }

  const jsonUrl = document.currentScript && document.currentScript.src
    ? new URL('bfy-yorumlar.json?v=20261122', document.currentScript.src).href
    : 'bfy-yorumlar.json?v=20261122';
  const kendiligindenAc = () => {
    const ister = location.hash === '#yorum-yaz' || /[?&]yorum=1\b/.test(location.search) || document.body.hasAttribute('data-yorum-ac');
    const btn = ister && document.querySelector('[data-bfy-yorumlar] [data-open-rev]');
    if (btn) btn.click();
  };
  fetch(jsonUrl)
    .then(r => r.ok ? r.json() : { yorumlar: [] })
    .then(d => {
      const items = Array.isArray(d) ? d : (Array.isArray(d && d.yorumlar) ? d.yorumlar : []);
      slots.forEach(s => renderSlot(s, items));
      kendiligindenAc();
    })
    .catch(() => {
      slots.forEach(s => renderSlot(s, []));
      kendiligindenAc();
    });
})();
