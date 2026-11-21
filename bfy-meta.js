/* Ben Fizik Yapamıyorum: Meta Pikseli (BFY Site ve Shopier, 1141312995299373).
   analytics.js bu dosyayı yalnızca canlı sitede yükler.
   Olaylar:
   - PageView: her sayfa.
   - ViewContent: veliler sayfasında sınıf seçilince (BFYMeta.view).
   - InitiateCheckout: Shopier ürün bağlantısına tıklanınca.
   - Contact: WhatsApp ya da Instagram mesaj bağlantısına tıklanınca.
   Satın alma (Purchase) Shopier'in kendi Meta Pixel uygulamasından gelir. */
(function () {
  if (window.BFYMeta) return;
  var PIXEL_ID = '1141312995299373';

  /* Meta'nın standart yükleyicisi */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  /* Shopier ürün kodu -> fiyat (TL). Sadece optimizasyon için yaklaşık değer. */
  var PRICE = {
    '51625370': 599, '51545360': 599, '51387941': 599,      // Yapabilirim 9, 10, 11
    '53129935': 699, '53129864': 699, '53129971': 699,      // + basılı 9. sınıf kitabı
    '51846067': 799, '53130017': 899,                        // TYT Maarif, + basılı
    '52282468': 599, '52504759': 599, '52504836': 999        // YKS 2027 TYT, AYT, TYT+AYT
  };

  function send(name, data) { try { fbq('track', name, data || {}); } catch (e) { /* sessiz */ } }

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.href || '';
    if (/(^|\.)shopier\.com\//.test(href.replace(/^https?:\/\//, ''))) {
      var m = href.match(/shopier\.com\/[^/?#]+\/(\d{5,})/);
      var id = m ? m[1] : '';
      var data = { content_type: 'product', currency: 'TRY' };
      if (id) { data.content_ids = [id]; if (PRICE[id]) data.value = PRICE[id]; }
      send('InitiateCheckout', data);
    } else if (/wa\.me\/|api\.whatsapp\.com|ig\.me\/m\/|instagram\.com\/direct/.test(href)) {
      send('Contact', { method: /wa\.me|whatsapp/.test(href) ? 'whatsapp' : 'instagram' });
    }
  }, true);

  window.BFYMeta = {
    view: function (name, id, value) {
      send('ViewContent', { content_name: name, content_ids: id ? [String(id)] : [], content_type: 'product', currency: 'TRY', value: value || undefined });
    }
  };
})();
