/* ===========================================================
   Ben Fizik Yapamıyorum — Görünmez Ziyaret Sayacı v2 (REST)
   Firebase SDK YÜKLEMEZ: tek hafif istek ile sayar.
   • keepalive: sayfadan hemen çıkılsa bile istek tamamlanır
     (eski sürümdeki "eksik sayma" sorunu böylece çözüldü).
   • Sitede hiçbir şey göstermez; veriler gizli panelde:
     bfy-istatistik.html
   • Koleksiyonlar aynı: istatistik/ozet, istatistik_gun/<gün>,
     istatistik_sayfa/<sayfa> — panel değişmeden çalışır.
   • Her sayfa yüklemesi = 1 görüntüleme; her oturum = 1 ziyaret.
   =========================================================== */
(function () {
  // Local previews must not inflate the live website's counters.
  if (location.protocol !== "https:" || !/^(www\.)?benfizikyapamiyorum\.com$/.test(location.hostname)) {
    window.BFY = { track: function () { return Promise.resolve(false); } };
    return;
  }
  var PID = "benfizikyapamiyorum-oyun";
  var KEY = "AIzaSyAeX9tk4zgoa5c5y2pVH3V4r9ip2mrlMvg"; // public web config — sır değil

  // (İsteğe bağlı) Cloudflare beacon — dursun, zararı yok
  var CF_TOKEN = "ad11ad4c9c7844e8a52aa51384c804fa";
  if (CF_TOKEN) {
    try {
      var cf = document.createElement("script");
      cf.defer = true;
      cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
      cf.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
      document.head.appendChild(cf);
    } catch (e) { /* sessiz */ }
  }

  try {
    if (!window.fetch) return; // çok eski tarayıcı — sessizce vazgeç

    var BASE = "projects/" + PID + "/databases/(default)/documents/";
    var URL_ = "https://firestore.googleapis.com/v1/" + BASE.slice(0, -1) + ":commit?key=" + KEY;

    var now = new Date();
    var dateParts = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    var part = function(type) { return dateParts.find(function(p) { return p.type === type; }).value; };
    var today = part('year') + '-' + part('month') + '-' + part('day');
    var key = (location.pathname.replace(/^\//, "") || "index.html")
                .replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 90) || "index.html";

    // oturumda bir kez: ziyaret
    var yeniOturum = false;
    try {
      if (!sessionStorage.getItem("bfy_v")) {
        sessionStorage.setItem("bfy_v", "1");
        yeniOturum = true;
      }
    } catch (e) { /* gizli mod vb. — sadece görüntüleme sayılır */ }

    // Keep only a fixed channel label; no raw referrer URLs or personal identifiers.
    function channel() {
      var utm = new URLSearchParams(location.search).get('utm_source');
      if (utm === 'ogretmen') return 'ogretmen';
      if (utm === 'instagram' || utm === 'youtube' || utm === 'tiktok') return utm;
      var ref = '';
      try { ref = new URL(document.referrer).hostname; } catch (_) {}
      if (/(^|\.)google\.[a-z.]+$/.test(ref) || /(^|\.)bing\.com$/.test(ref)) return 'arama';
      if (/(^|\.)instagram\.com$/.test(ref)) return 'instagram';
      if (/(^|\.)youtube\.com$/.test(ref) || ref === 'youtu.be') return 'youtube';
      if (/(^|\.)tiktok\.com$/.test(ref)) return 'tiktok';
      return ref && !/^(www\.)?benfizikyapamiyorum\.com$/.test(ref) ? 'diger' : 'dogrudan';
    }
    var source = channel(), returning = false;
    try {
      if (yeniOturum) {
        sessionStorage.setItem('bfy_source_v1', source);
        returning = Boolean(localStorage.getItem('bfy_seen_v1'));
        localStorage.setItem('bfy_seen_v1', '1');
      } else {
        source = sessionStorage.getItem('bfy_source_v1') || source;
        sessionStorage.setItem('bfy_source_v1', source);
      }
    } catch (_) {}

    // +1 transformu
    function art(alan) { return { fieldPath: alan, increment: { integerValue: "1" } }; }

    // merge'li upsert yazımı (SDK'daki set(..., {merge:true}) karşılığı)
    function yaz(doc, fields, mask, transforms) {
      return {
        update: { name: BASE + doc, fields: fields },
        updateMask: { fieldPaths: mask },
        updateTransforms: transforms
      };
    }

    var ts = { timestampValue: now.toISOString() };
    var ozetT = [art("goruntuleme")];
    var gunT  = [art("goruntuleme")];
    if (yeniOturum) { ozetT.push(art("ziyaret")); gunT.push(art("ziyaret")); }
    if (yeniOturum) {
      gunT.push(art('kaynak_' + source));
      if (returning) { gunT.push(art('geri_donen_oturum')); ozetT.push(art('geri_donen_oturum')); }
    }
    // gün-bazlı sayfa kırılımı: aynı gün dokümanına s_<sayfa> alanı olarak +1
    gunT.push(art("s_" + key.replace(/[^a-zA-Z0-9]/g, "_")));

    var govde = {
      writes: [
        yaz("istatistik/ozet",        { guncelleme: ts },                      ["guncelleme"], ozetT),
        yaz("istatistik_gun/" + today, { gun: { stringValue: today } },        ["gun"],        gunT),
        yaz("istatistik_sayfa/" + key, { yol: { stringValue: location.pathname } }, ["yol"],  [art("goruntuleme")])
      ]
    };

    fetch(URL_, {
      method: "POST",
      keepalive: true, // sayfa kapansa da istek yaşar
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(govde)
    }).catch(function () { /* sessiz — site asla etkilenmesin */ });

    var allowed = ['student_start','test_start','test_complete','practice_click','lesson_lab','review_resource','share_open','share_copy','share_whatsapp','share_qr','shop_click'];
    window.BFY = {
      track: function(event) {
        if (allowed.indexOf(event) === -1) return Promise.resolve(false);
        var transforms = [art('e_' + event), art('e_' + event + '_' + source)];
        var payload = {writes:[
          yaz('istatistik/ozet', {guncelleme:{timestampValue:new Date().toISOString()}}, ['guncelleme'], [art('e_' + event)]),
          yaz('istatistik_gun/' + today, {gun:{stringValue:today}}, ['gun'], transforms)
        ]};
        return fetch(URL_, {method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
          .then(function(response) { return response.ok; }).catch(function() { return false; });
      }
    };
    document.addEventListener('click', function(event) {
      var link = event.target.closest('a');
      if (!link) return;
      if (link.dataset.bfyEvent) { window.BFY.track(link.dataset.bfyEvent); return; }
      try { if (/(^|\.)shopier\.com$/.test(new URL(link.href).hostname)) window.BFY.track('shop_click'); } catch (_) {}
    });
  } catch (e) { /* sessiz */ }
})();
