/* BFY · Ortak Yorum & Sosyal Kanıt Sistemi
   Kullanım: Herhangi bir sayfaya <div class="clarity-wrap" data-bfy-yorumlar data-sayfa="ana"></div> ekle.
   Yorumlar bfy-yorumlar.json dosyasından okunur; yeni yorum gönderimi moderasyon için WhatsApp'a yönlendirilir. */
(() => {
  'use strict';
  const slots = [...document.querySelectorAll('[data-bfy-yorumlar]')];
  if (!slots.length) return;

  const ROL_AD = { ogrenci: 'Öğrenci', veli: 'Veli', ogretmen: 'Öğretmen' };
  const WA_NO = '905425549386';
  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stars = n => '★'.repeat(Math.max(1, Math.min(5, Number(n) || 5))) + '☆'.repeat(5 - Math.max(1, Math.min(5, Number(n) || 5)));

  let modalEl = null;
  let pickedStar = 5;

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
        <p>Yorumun Timur Yıldırım’ın onayından sonra sitede yayınlanır. Dilersen soyadının sadece baş harfini yazabilirsin.</p>
        <form id="bfy-rev-form">
          <div class="bfy-rev-field">
            <label for="bfy-r-ad">Adın (ör. Elif K.)</label>
            <input id="bfy-r-ad" required maxlength="40" placeholder="Örn. Zeynep A.">
          </div>
          <div class="bfy-rev-field">
            <label for="bfy-r-rol">Kimsin?</label>
            <select id="bfy-r-rol">
              <option value="ogrenci">Öğrenci</option>
              <option value="veli">Veli</option>
              <option value="ogretmen">Fizik Öğretmeni</option>
            </select>
          </div>
          <div class="bfy-rev-field">
            <label for="bfy-r-urun">Hangi kaynak veya sınıf?</label>
            <input id="bfy-r-urun" maxlength="60" placeholder="Örn. 10. Sınıf · Yapabilirim TYT Maarif">
          </div>
          <div class="bfy-rev-field">
            <label>Puanın</label>
            <div class="bfy-rev-star-pick" id="bfy-r-stars">
              ${[1,2,3,4,5].map(n => `<button type="button" data-star="${n}" class="is-on" aria-label="${n} yıldız">★</button>`).join('')}
            </div>
          </div>
          <div class="bfy-rev-field">
            <label for="bfy-r-metin">Yorumun</label>
            <textarea id="bfy-r-metin" required maxlength="320" placeholder="Sitedeki simülasyonlar, notlar veya dijital kitap sana nasıl yardımcı oldu?"></textarea>
          </div>
          <button type="submit" class="bfy-rev-submit">Yorumu WhatsApp ile Gönder →</button>
          <p class="bfy-rev-note">Spam koruması için yorumlar onay sonrası yayınlanır.</p>
        </form>
      </div>`;
    document.body.appendChild(modalEl);

    const close = () => { modalEl.hidden = true; };
    modalEl.querySelector('.bfy-rev-close').addEventListener('click', close);
    modalEl.addEventListener('click', e => { if (e.target === modalEl) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modalEl.hidden) close(); });

    const starBtns = [...modalEl.querySelectorAll('#bfy-r-stars button')];
    starBtns.forEach(b => b.addEventListener('click', () => {
      pickedStar = Number(b.dataset.star);
      starBtns.forEach(x => x.classList.toggle('is-on', Number(x.dataset.star) <= pickedStar));
    }));

    modalEl.querySelector('#bfy-rev-form').addEventListener('submit', e => {
      e.preventDefault();
      const ad = modalEl.querySelector('#bfy-r-ad').value.trim();
      const rol = modalEl.querySelector('#bfy-r-rol').value;
      const urun = modalEl.querySelector('#bfy-r-urun').value.trim() || ROL_AD[rol];
      const metin = modalEl.querySelector('#bfy-r-metin').value.trim();
      if (!ad || !metin) return;
      const msg = `Merhaba Timur Hocam, siteye yorum bırakmak istiyorum:\n\nAd: ${ad}\nRol: ${ROL_AD[rol]}\nKaynak: ${urun}\nPuan: ${pickedStar}/5\nYorum: "${metin}"`;
      window.open(`https://wa.me/${WA_NO}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      close();
    });
    return modalEl;
  }

  function openModal() {
    ensureModal().hidden = false;
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
                <h3>Kullananlar ne diyor? İlk yorumu sen bırak.</h3>
                <p>Simülasyonları, ücretsiz notları, Yapabilirim dijital kitaplarını veya Hoca Kiti’ni kullandıysan kısa bir yorumla diğer öğrencilere ve öğretmenlere yol gösterebilirsin.</p>
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
                    <strong>${esc(r.ad)}</strong>
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

  const base = document.currentScript && document.currentScript.src.includes('/blog/') ? '../' : '';
  fetch(base + 'bfy-yorumlar.json?v=20261119')
    .then(r => r.ok ? r.json() : { yorumlar: [] })
    .then(d => {
      const items = Array.isArray(d) ? d : (Array.isArray(d && d.yorumlar) ? d.yorumlar : []);
      slots.forEach(s => renderSlot(s, items));
    })
    .catch(() => {
      slots.forEach(s => renderSlot(s, []));
    });
})();
