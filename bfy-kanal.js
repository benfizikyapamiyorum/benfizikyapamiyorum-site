/* ===========================================================
   Ben Fizik Yapamıyorum — WhatsApp Kanalı çağrısı
   Sayfada <div data-bfy-kanal="..."></div> olan her yere kanal kartını çizer.
   Kanal bağlantısı aşağıdaki KANAL satırına yazılır. Boşken hiçbir şey görünmez.
   Türler: (boş) = öğrenci, "prova" = prova sonucu, "veli" = veli karnesi.
   =========================================================== */
(function () {
  var KANAL = ''; // örnek: https://whatsapp.com/channel/0029Va...
  if (!/^https:\/\/(www\.)?whatsapp\.com\/channel\/[A-Za-z0-9_-]+$/.test(KANAL)) return;
  var METIN = {
    '': ['Yeni notlar önce WhatsApp kanalında', 'Haftalık notlar, yazılı provaları ve yeni içerikler çıkar çıkmaz kanala düşer. Numaran diğer takipçilere görünmez.'],
    prova: ['2. yazılı provası açılınca haberin olsun', 'Yeni provalar, haftalık notlar ve yazılı öncesi son tekrarlar WhatsApp kanalında duyurulur. Numaran diğer takipçilere görünmez.'],
    veli: ['Veliler için WhatsApp kanalı', 'Haftalık fizik notları, yazılı provaları ve yazılı takvimi kanalda duyurulur. Numaranız diğer takipçilere görünmez.']
  };
  function ciz() {
    var yerler = document.querySelectorAll('[data-bfy-kanal]');
    if (!yerler.length) return;
    if (!document.getElementById('bfy-kanal-css')) {
      var st = document.createElement('style'); st.id = 'bfy-kanal-css';
      st.textContent = '.bfy-kanal{margin:18px 0;background:#214e41;color:#fff;border-radius:20px;padding:18px 22px;display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;justify-content:space-between;font-family:"Plus Jakarta Sans",Arial,sans-serif}' +
        '.bfy-kanal div{flex:1 1 260px;min-width:0}.bfy-kanal b{display:block;font-size:1.05rem;line-height:1.3;color:#fff}.bfy-kanal p{margin:4px 0 0;color:#d6e5dd;font-size:.92rem;line-height:1.5}' +
        '.bfy-kanal a{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:10px 18px;border-radius:8px;background:#e9be64;color:#203d35;font-weight:800;font-size:.95rem;text-decoration:none}' +
        '.bfy-kanal a:hover{filter:brightness(1.05)}.bfy-kanal a:focus-visible{outline:3px solid #fff;outline-offset:2px}';
      document.head.appendChild(st);
    }
    Array.prototype.forEach.call(yerler, function (y) {
      if (y.getAttribute('data-hazir')) return;
      var tur = y.getAttribute('data-bfy-kanal') || '', m = METIN[tur] || METIN[''];
      var s = document.createElement('aside'); s.className = 'bfy-kanal'; s.setAttribute('aria-label', 'WhatsApp kanalı');
      var d = document.createElement('div'), b = document.createElement('b'), p = document.createElement('p'), a = document.createElement('a');
      b.textContent = m[0]; p.textContent = m[1]; d.appendChild(b); d.appendChild(p);
      a.href = KANAL; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Kanala katıl ↗';
      a.setAttribute('data-bfy-event', 'kanal_katil'); a.setAttribute('data-bfy-lab', tur || 'genel');
      s.appendChild(d); s.appendChild(a); y.appendChild(s); y.setAttribute('data-hazir', '1');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ciz); else ciz();
})();
