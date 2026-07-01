/* ===========================================================
   Ben Fizik Yapamıyorum — Görünmez Ziyaret Sayacı
   Kendi Firebase (Firestore) projen üzerinde çalışır.
   Sitede HİÇBİR ŞEY göstermez; verileri gizli istatistik
   sayfasında görürsün:  bfy-istatistik.html

   • Reklam engelleyiciler bloklayamaz (kendi Firebase'in).
   • Yeni hesap/kurulum yok; oyunların kullandığı proje.
   • Her sayfa yüklemesi = 1 "görüntüleme"; her oturum = 1 "ziyaret".
   =========================================================== */
(function () {
  var CFG = {
    apiKey: "AIzaSyAeX9tk4zgoa5c5y2pVH3V4r9ip2mrlMvg",
    authDomain: "benfizikyapamiyorum-oyun.firebaseapp.com",
    projectId: "benfizikyapamiyorum-oyun",
    storageBucket: "benfizikyapamiyorum-oyun.firebasestorage.app",
    messagingSenderId: "942775741325",
    appId: "1:942775741325:web:85dca63d6a17e2822cebc4"
  };

  // (İsteğe bağlı) Cloudflare beacon — dursun, zararı yok
  var CF_TOKEN = "ad11ad4c9c7844e8a52aa51384c804fa";
  if (CF_TOKEN) {
    var cf = document.createElement("script");
    cf.defer = true;
    cf.src = "https://static.cloudflareinsights.com/beacon.min.js";
    cf.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
    document.head.appendChild(cf);
  }

  // Firebase SDK'yı sırayla yükle, sonra say
  function load(src, cb) {
    // aynı script zaten yüklüyse tekrar yükleme
    if (document.querySelector('script[src="' + src + '"]')) { cb(); return; }
    var s = document.createElement("script");
    s.src = src; s.onload = cb; s.onerror = function(){ /* sessiz */ };
    document.head.appendChild(s);
  }

  function track() {
    try {
      if (typeof firebase === "undefined" || !firebase.firestore) return;
      if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(CFG);
      var db = firebase.firestore();
      var INC = firebase.firestore.FieldValue.increment(1);
      var TS  = firebase.firestore.FieldValue.serverTimestamp();
      var today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      var key = (location.pathname.replace(/^\//, "") || "index.html")
                  .replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 90) || "index.html";

      // her yüklemede: görüntüleme
      db.collection("istatistik").doc("ozet").set({ goruntuleme: INC, guncelleme: TS }, { merge: true });
      db.collection("istatistik_gun").doc(today).set({ goruntuleme: INC }, { merge: true });
      db.collection("istatistik_sayfa").doc(key).set({ yol: location.pathname, goruntuleme: INC }, { merge: true });

      // oturumda bir kez: ziyaret
      if (!sessionStorage.getItem("bfy_v")) {
        sessionStorage.setItem("bfy_v", "1");
        db.collection("istatistik").doc("ozet").set({ ziyaret: INC }, { merge: true });
        db.collection("istatistik_gun").doc(today).set({ ziyaret: INC }, { merge: true });
      }
    } catch (e) { /* sessiz — site asla etkilenmesin */ }
  }

  load("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js", function () {
    load("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js", track);
  });
})();
