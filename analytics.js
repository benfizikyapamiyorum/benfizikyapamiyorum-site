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
    var today = now.toISOString().slice(0, 10); // YYYY-MM-DD
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
  } catch (e) { /* sessiz */ }
})();
