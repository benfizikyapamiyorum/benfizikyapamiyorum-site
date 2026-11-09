// Hoca Kiti DENEME yükleyici: /hoca-kiti/t<S>/<dosya> kabuğundan çağrılır.
(function () {
  var MAG = {"9":"https://www.shopier.com/47806607","10":"https://www.shopier.com/47980342","11":"https://www.shopier.com/51257681"}, FIY = { 9: '1.299', 10: '1.699', 11: '1.999' };
  var m = location.pathname.match(/\/hoca-kiti\/t(9|10|11)\/(.*)$/);
  var css = 'font:17px/1.6 Inter,system-ui,sans-serif;max-width:600px;margin:60px auto;padding:0 20px;color:#1a2233';
  function sayfa(h) { document.body.innerHTML = '<div style="' + css + '">' + h + '</div>'; }
  var btn = 'display:inline-block;margin:8px 8px 0 0;padding:12px 18px;border-radius:12px;font-weight:700;text-decoration:none;';
  if (!m) { sayfa('Sayfa bulunamadı.'); return; }
  var S = m[1], q = new URLSearchParams(location.search), AD = q.get('pdf') || decodeURIComponent(m[2] || '') || 'index.html';
  var L = null; try { L = (JSON.parse(localStorage.getItem('bfy_hoca_deneme') || '{}') || {})[S]; } catch (e) {}
  if (!L || !L.a) { location.replace('/hoca-kiti/deneme.html'); return; }
  var al = '<a style="' + btn + 'background:#E0731F;color:#fff" href="' + MAG[S] + '" target="_blank" rel="noopener">Tam kiti al, ₺' + FIY[S] + '</a>';
  var bugun = new Date().toISOString().slice(0, 10);
  if (bugun > L.bitis) { sayfa('<h2 style="color:#1B2F5E">Deneme süreniz bitti.</h2><p>36 haftanın tamamı, yazılılar ve PDF\'ler tam kitte. E-postanıza gönderilen indirim kodunu Shopier\'de ödeme sırasında kullanabilirsiniz.</p>' + al); return; }
  function kilit(neden) {
    sayfa('<p style="color:#E0731F;font-weight:700;margin:0">Tam kitte</p><h2 style="color:#1B2F5E;margin:4px 0 8px">' + neden + '</h2><p>Denemede açık haftalar: ' + L.hs.map(function (n) { return 'Hafta ' + n; }).join(' ve ') + '. Tam kitte 36 haftanın tamamı, 12 yazılı ve cevaplı PDF\'ler var; kitte yapılan her düzeltme size de gelir.</p>' + al + '<a style="' + btn + 'background:#fff;color:#1B2F5E;border:2px solid #1B2F5E" href="/hoca-kiti/t' + S + '/">Z Kitap\'a dön</a>');
  }
  function b64u(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; return Uint8Array.from(atob(t), function (c) { return c.charCodeAt(0); }); }
  function anahtar(k) { return crypto.subtle.importKey('raw', b64u(k), 'AES-GCM', false, ['decrypt']); }
  function coz(url, k) { return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error('ag'); return r.arrayBuffer(); }).then(function (b) { return anahtar(k).then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(b, 0, 12) }, key, new Uint8Array(b, 12)); }); }); }
  sayfa('<p style="color:#5B6573">Deneme açılıyor…</p>');
  coz('/hoca-kiti/e' + S + '/m.bin', L.a).then(function (mb) {
    var d = JSON.parse(new TextDecoder().decode(mb)).dosyalar[AD];
    if (!d) { kilit(/\.pdf$/i.test(AD) ? 'Cevaplı öğretmen PDF\'leri tam kitte.' : 'Bu sayfa tam kitte.'); return; }
    if (d[2] === -1) { kilit(/YAZILI/i.test(AD) ? 'Yazılılar tam kitte.' : 'Bu sayfa tam kitte.'); return; }
    var k = d[2] > 0 ? (L.k || {})[d[2]] : L.a;
    if (!k) { kilit('Hafta ' + d[2] + ' tam kitte.'); return; }
    return coz('/hoca-kiti/e' + S + '/' + d[0] + '.bin', k).then(function (buf) {
      if (/\.pdf$/i.test(AD)) {
        var u = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
        sayfa('<h2 style="color:#1B2F5E">' + AD.replace(/_/g, ' ').replace(/\.pdf$/, '') + '</h2><p>Deneme sürümünde öğrenci nüshası damgalıdır.</p><a style="' + btn + 'background:#1B2F5E;color:#fff" href="' + u + '" target="_blank" rel="noopener">PDF\'i aç</a>' + al);
        return;
      }
      var etiket = (L.ad || '') + (L.m ? ', ' + L.m : '') + ', deneme';
      var kalan = Math.max(0, Math.round((new Date(L.bitis + 'T23:59:59') - new Date()) / 864e5));
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="460" height="230"><text x="20" y="130" transform="rotate(-22 230 115)" font-family="Inter,Arial" font-size="17" fill="rgba(27,47,94,0.10)">' + etiket.replace(/[&<>]/g, '') + '</text></svg>';
      var ek = '<style>@media print{html,body{display:none!important}}body{-webkit-user-select:none;user-select:none}#bfyDF{position:fixed;inset:0;pointer-events:none;z-index:2147483646;background-image:url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")}#bfyDB{position:fixed;right:14px;bottom:84px;z-index:2147483647;display:flex;gap:8px;align-items:center;max-width:calc(100vw - 28px);padding:6px 6px 6px 12px;background:rgba(27,47,94,.94);color:#fff;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.25);font:600 13px/1.3 Inter,system-ui,sans-serif}#bfyDB a{background:#E0731F;color:#fff;text-decoration:none;padding:6px 11px;border-radius:999px;font-weight:700;white-space:nowrap}</style>' +
        '<script>(function(){var S=' + JSON.stringify(S) + ';document.addEventListener("contextmenu",function(e){e.preventDefault()},true);document.addEventListener("keydown",function(e){var k=(e.key||"").toLowerCase();if((e.ctrlKey||e.metaKey)&&(k==="s"||k==="p"||k==="u")){e.preventDefault();e.stopPropagation();}},true);' +
        'window.print=function(){alert("Deneme sürümünde yazdırma kapalıdır. Öğrenci nüshası PDF olarak açılabilir.")};' +
        'document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href");if(!h||!/\\.pdf(\\?|#|$)/i.test(h))return;e.preventDefault();var f=decodeURIComponent(new URL(h,location.href).pathname.split("/").pop());location.href="/hoca-kiti/t"+S+"/?pdf="+encodeURIComponent(f);},true);' +
        'document.addEventListener("DOMContentLoaded",function(){var f=document.createElement("div");f.id="bfyDF";document.body.appendChild(f);var b=document.createElement("div");b.id="bfyDB";b.innerHTML=' + JSON.stringify('Deneme, ' + kalan + ' gün kaldı<a href="' + MAG[S] + '" target="_blank" rel="noopener">Tam kiti al, ₺' + FIY[S] + '</a>') + ';document.body.appendChild(b);});})();<\/script>';
      var html = new TextDecoder().decode(buf);
      html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, function (x) { return x + ek; }) : ek + html;
      document.open(); document.write(html); document.close();
    });
  }).catch(function (e) {
    if (e && e.name === 'OperationError') { localStorage.removeItem && 0; sayfa('<h2>Deneme açılamadı</h2><p>Deneme linkinizi e-postanızdan yeniden açın.</p>'); }
    else sayfa('<h2>Kit yüklenemedi</h2><p>İnternet bağlantınızı kontrol edip sayfayı yenileyin.</p>');
  });
})();
