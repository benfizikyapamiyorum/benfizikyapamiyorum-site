/* ===========================================================
   Yapabilirim — Yorum isteği eki
   Kitabı satın almış ve bir süre kullanmış öğrenciye ana ekranda bir kez
   "Kitap işine yaradı mı?" kartı gösterir. Kart sitedeki yorum formunu, ürün adı
   hazır yazılı olarak açar (/yorum/?urun=Yapabilirim 11). Buradan hiçbir veri
   gönderilmez; yorum formda yazılır ve onaydan sonra yayımlanır.
   Kitaba tek satırla bağlanır: <script defer src="/calis/yorum-ek.js?v=1"></script>
   (Kitap yeniden derlenirse bu satır derleme şablonunda, build.js içinde durur.)
   =========================================================== */
(function () {
  'use strict';
  var DEPO = 'bfy_yorum_v1', GUN = 864e5, EN_AZ_SORU = 30, EN_AZ_KONU = 2;
  function oku() { try { return JSON.parse(localStorage.getItem(DEPO)) || {}; } catch (e) { return {}; } }
  function yaz(o) { try { localStorage.setItem(DEPO, JSON.stringify(o)); } catch (e) { } }
  function tumSorular(konu) { return (konu.sorular || []).concat((konu.setler || []).reduce(function (a, st) { return a.concat(st.sorular || []); }, [])); }

  // Öğrencinin en çok çalıştığı ve lisansı olan sınıf; koşullar sağlanmıyorsa null.
  function uygunSinif() {
    var DJ = window.BFY_DIJITAL, K = DJ && DJ.K, BANK = window.BFY_BANK, ORTAK = window.BFY_ORTAK;
    if (!K || !BANK || !K.q || !ORTAK || typeof ORTAK.sinifSeviye !== 'function') return null;
    var say = {};
    Object.keys(BANK).forEach(function (kid) {
      var m = /^(9|10|11)\./.exec(kid); if (!m) return;
      var S = say[m[1]] || (say[m[1]] = { soru: 0, konu: 0 }), c = 0;
      tumSorular(BANK[kid]).forEach(function (q) { if (K.q[q.id]) c++; });
      S.soru += c; if (c) S.konu++;
    });
    var sn = null;
    ['9', '10', '11'].forEach(function (n) {
      var S = say[n]; if (!S || S.soru < EN_AZ_SORU || S.konu < EN_AZ_KONU) return;
      var lisans = 0; try { lisans = ORTAK.sinifSeviye(+n) > 0 ? 1 : 0; } catch (e) { }
      if (!lisans) return;
      if (sn == null || S.soru > say[sn].soru) sn = n;
    });
    return sn;
  }

  function kart(sn) {
    var urun = 'Yapabilirim ' + sn;
    return '<section class="yeni-kart" id="yorumKart" aria-label="Yorum yaz"><div class="yk-ust"><span class="yk-rozet">1 dakika</span><b>Kitap işine yaradı mı?</b>' +
      '<button type="button" class="yk-kapat" data-yorum-kapat aria-label="Kapat">✕</button></div>' +
      '<div class="yk-ozellik"><span class="yk-ik" aria-hidden="true">💬</span><div><b>Bir iki cümleyle yaz</b>' +
      '<p>Almayı düşünen arkadaşlarına yol gösterir. Beğenmediğin bir yer varsa onu da yaz, düzeltelim. Soyadın sitede görünmez, yalnızca baş harfi çıkar.</p></div></div>' +
      '<div class="yk-alt"><a class="btn yesil ince" href="/yorum/?urun=' + encodeURIComponent(urun) + '" target="_blank" rel="noopener" data-yorum-yaz>Yorum yaz</a></div></section>';
  }

  function yerlestir() {
    var uyg = document.getElementById('uyg'); if (!uyg || document.getElementById('yorumKart')) return;
    var h = location.hash || '#/'; if (!(h === '#/' || h === '#' || h === '')) return;
    if (uyg.querySelector('.yeni-kart')) return; // ana ekranda başka bir kart (veli karnesi, anket, yenilik) varken çıkma
    var a = oku(); if (a.yazdi || (a.sonra && Date.now() < a.sonra)) return;
    var hero = uyg.querySelector('.hero'); if (!hero) return;
    var sn = uygunSinif(); if (!sn) return;
    hero.insertAdjacentHTML('afterend', kart(sn));
  }

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var k;
    if (t.closest('[data-yorum-yaz]')) { var a = oku(); a.yazdi = Date.now(); yaz(a); k = document.getElementById('yorumKart'); if (k) setTimeout(function () { k.remove(); }, 400); }
    else if (t.closest('[data-yorum-kapat]')) { var b = oku(); b.sonra = Date.now() + 30 * GUN; yaz(b); k = document.getElementById('yorumKart'); if (k) k.remove(); }
  });

  function basla() {
    var uyg = document.getElementById('uyg'); if (!uyg) return;
    var bekle = null, dene = function () { clearTimeout(bekle); bekle = setTimeout(function () { try { yerlestir(); } catch (e) { } }, 160); };
    try { new MutationObserver(dene).observe(uyg, { childList: true }); } catch (e) { }
    window.addEventListener('hashchange', dene); dene();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
