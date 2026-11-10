// Hoca Kiti yükleyici: /hoca-kiti/k<S>/<dosya> kabuğundan çağrılır; lisanslı cihazda şifreli sayfayı çözüp açar.
(function () {
  var VERI = 'https://benfizikyapamiyorum.github.io/hoca-kiti-veri'; // şifreli dosyalar ayrı depoda (site 1 GB sınırı)
  var IPTAL = [];
  var m = location.pathname.match(/\/hoca-kiti\/k(9|10|11)\/(.*)$/);
  function mesaj(h) { document.body.innerHTML = '<div style="font:17px/1.6 system-ui,sans-serif;max-width:560px;margin:60px auto;padding:0 20px;color:#1a2233">' + h + '</div>'; }
  if (!m) { mesaj('Sayfa bulunamadı.'); return; }
  var S = m[1], AD = decodeURIComponent(m[2] || '') || 'index.html';
  var L = null;
  try { L = (JSON.parse(localStorage.getItem('bfy_hoca_kiti') || '{}') || {})[S]; } catch (e) {}
  var giris = '/hoca-kiti/?s=' + S + '&geri=' + encodeURIComponent(location.pathname + location.search + location.hash);
  if (!L || !L.a || IPTAL.indexOf(L.no) >= 0) { location.replace(giris); return; }
  if (!window.crypto || !crypto.subtle) { mesaj('Bu tarayıcı kiti açamıyor. Lütfen Chrome, Safari ya da Edge’in güncel sürümünü kullanın.'); return; }
  mesaj('<p style="color:#5B6573">Kit açılıyor…</p>');
  function b64u(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; return Uint8Array.from(atob(t), function (c) { return c.charCodeAt(0); }); }
  var anahtar;
  function coz(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('ag'); return r.arrayBuffer(); }).then(function (b) {
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(b, 0, 12) }, anahtar, new Uint8Array(b, 12));
    });
  }
  crypto.subtle.importKey('raw', b64u(L.a), 'AES-GCM', false, ['decrypt']).then(function (k) {
    anahtar = k;
    return coz(VERI + '/d' + S + '/m.bin');
  }).then(function (mb) {
    var man = JSON.parse(new TextDecoder().decode(mb));
    var d = man.dosyalar[AD];
    if (!d) { mesaj('<h2>Sayfa bulunamadı</h2><p><a href="/hoca-kiti/k' + S + '/">Kitin ana sayfasına dön →</a></p>'); return; }
    return coz(VERI + '/d' + S + '/' + d[0] + '.bin').then(function (hb) {
      var html = new TextDecoder().decode(hb);
      // PDF bağlantıları: şifreli PDF görüntüleyiciye yönlendir.
      var ek = '<script>(function(){var S=' + JSON.stringify(S) + ';document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href");if(!h||!/\\.pdf(\\?|#|$)/i.test(h))return;var u=new URL(h,location.href);var f=decodeURIComponent(u.pathname.split("/").pop());e.preventDefault();var hedef="/hoca-kiti/pdf.html?s="+S+"&f="+encodeURIComponent(f);if(a.target==="_blank")window.open(hedef,"_blank");else location.href=hedef;},true);})();<\/script>';
      html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, function (x) { return x + ek; }) : ek + html;
      document.open(); document.write(html); document.close();
    });
  }).catch(function (e) {
    if (e && e.name === 'OperationError') mesaj('<h2>Lisans bu kiti açmıyor</h2><p>Lisans linkinizi yeniden açın ya da bizimle iletişime geçin.</p><p><a href="' + giris + '">Lisans girişine git →</a></p>');
    else mesaj('<h2>Kit yüklenemedi</h2><p>İnternet bağlantınızı kontrol edip sayfayı yenileyin.</p>');
  });
})();
