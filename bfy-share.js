/* Local QR files: classroom links never call a third-party QR service. */
(() => {
  'use strict';
  const path = location.pathname.replace(/^\//, '').replace(/\/$/, '') || 'index.html';
  const filename = path === 'fizikce-turkce' ? 'fizikce-turkce' : path.replace(/\.html$/, '');
  if (!/^[a-z0-9-]+$/.test(filename)) return;
  const target = 'https://benfizikyapamiyorum.com/' + (filename === 'index' ? '' : filename === 'fizikce-turkce' ? 'fizikce-turkce/' : filename + '.html');
  const shareURL = target + '?utm_source=ogretmen&utm_medium=paylasim&utm_campaign=sinif';
  const track = event => window.BFY?.track(event);
  const section = document.createElement('aside');
  section.className = 'bfy-share';
  section.setAttribute('aria-label', 'Sınıfla paylaş');
  section.innerHTML = '<div><strong>Birlikte çalışmak daha kolay.</strong><p>Bu sayfanın bağlantısını paylaş veya QR kodu tahtada aç.</p></div><button type="button">Sınıfınla paylaş ↗</button>';
  const main = document.querySelector('main');
  if (!main) return;
  main.appendChild(section);
  const dialog = document.createElement('dialog');
  dialog.className = 'bfy-share-dialog';
  dialog.setAttribute('aria-labelledby', 'bfy-share-title');
  dialog.innerHTML = '<button type="button" class="bfy-share-close">Kapat ×</button><h2 id="bfy-share-title">Bu sayfayı sınıfınla paylaş</h2><p>Öğrenciler QR kodu okutarak aynı sayfayı açabilir.</p><img class="bfy-share-qr" alt="Bu sayfayı açan QR kod" width="220" height="220"><label for="bfy-share-link">Paylaşım bağlantısı</label><input id="bfy-share-link" type="text" readonly><div class="bfy-share-buttons"><button type="button" data-copy>Bağlantıyı kopyala</button><a data-whatsapp target="_blank" rel="noopener noreferrer">WhatsApp’ta paylaş</a><a data-qr target="_blank" rel="noopener">QR kodu aç</a></div><div role="status" class="bfy-share-status"></div>';
  document.body.appendChild(dialog);
  const open = section.querySelector('button');
  dialog.querySelector('img').src = '/bfy-qr-' + filename + '.svg';
  dialog.querySelector('input').value = shareURL;
  dialog.querySelector('[data-whatsapp]').href = 'https://wa.me/?text=' + encodeURIComponent('Bu fizik etkinliğini birlikte çözelim: ' + shareURL);
  dialog.querySelector('[data-qr]').href = '/bfy-qr-' + filename + '.svg';
  dialog.querySelector('[data-qr]').setAttribute('aria-label', 'QR kodu büyük boyutta aç');
  open.addEventListener('click', () => { dialog.showModal(); track('share_open'); });
  dialog.querySelector('.bfy-share-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => open.focus({preventScroll:true}));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.querySelector('[data-copy]').addEventListener('click', async () => {
    const status = dialog.querySelector('[role=status]');
    try { await navigator.clipboard.writeText(shareURL); status.textContent = 'Bağlantı kopyalandı.'; track('share_copy'); }
    catch { dialog.querySelector('input').select(); status.textContent = 'Bağlantıyı seçtim. Kopyala komutuyla paylaşabilirsin.'; }
  });
  dialog.querySelector('[data-whatsapp]').addEventListener('click', () => track('share_whatsapp'));
  dialog.querySelector('[data-qr]').addEventListener('click', () => track('share_qr'));
})();
