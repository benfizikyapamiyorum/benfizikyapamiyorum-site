/* ===========================================================
   Ben Fizik Yapamıyorum — Site Analitiği
   Cloudflare Web Analytics (gizlilik dostu, çerez yok).

   KURULUM: dash.cloudflare.com → Analytics & Logs → Web Analytics
   → Add a site (benfizikyapamiyorum.com) → verdiği "token" değerini
   aşağıdaki CF_TOKEN içine yapıştır ve bu dosyayı GitHub'a yükle. Bitti.

   Token boşken hiçbir şey yüklenmez (site etkilenmez), o yüzden
   şimdiden tüm sayfalara bağlamak güvenlidir.
   =========================================================== */
(function () {
  var CF_TOKEN = "ad11ad4c9c7844e8a52aa51384c804fa"; // Cloudflare Web Analytics token

  if (!CF_TOKEN) return; // token yoksa hiçbir şey yapma
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
  document.head.appendChild(s);
})();
