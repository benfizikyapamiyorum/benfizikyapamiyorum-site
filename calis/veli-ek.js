/* ===========================================================
   Yapabilirim — Veli Karnesi eki
   Öğrencinin bu cihazdaki ilerlemesinden haftalık karne üretir ve WhatsApp ile veliye
   gönderilecek bağlantıyı hazırlar. Karne bağlantının içinde taşınır; sunucuya hiçbir
   şey kaydedilmez, ad ve cevaplar gönderilmez. Karne sayfası: /veli/
   Kitaba tek satırla bağlanır: <script defer src="/calis/veli-ek.js?v=1"></script>
   (Kitap yeniden derlenirse bu satırın derleme şablonunda da durması gerekir.)
   =========================================================== */
(function () {
  'use strict';
  var DEPO = 'bfy_veli_v1', GUN = 864e5;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function oku() { try { return JSON.parse(localStorage.getItem(DEPO)) || {}; } catch (e) { return {}; } }
  function yaz(o) { try { localStorage.setItem(DEPO, JSON.stringify(o)); } catch (e) { } }
  function gunKod(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function b64u(o) { var u = new TextEncoder().encode(JSON.stringify(o)), s = ''; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function tumSorular(konu) { return (konu.sorular || []).concat((konu.setler || []).reduce(function (a, st) { return a.concat(st.sorular || []); }, [])); }

  function karne() {
    var DJ = window.BFY_DIJITAL, K = DJ && DJ.K, BANK = window.BFY_BANK; if (!K || !BANK || !K.q) return null;
    var simdi = Date.now(), siniflar = {}, QH = {};
    Object.keys(BANK).forEach(function (kid) {
      var m = /^(9|10|11)\./.exec(kid); if (!m) return;
      var sn = +m[1], konu = BANK[kid], S = siniflar[sn] || (siniflar[sn] = { c: 0, d: 0, h7: 0, konular: [] }), kc = 0, kd = 0;
      tumSorular(konu).forEach(function (q) { QH[q.id] = { q: q, sn: sn }; var r = K.q[q.id]; if (!r) return; kc++; if (r.d) kd++; if (r.t && simdi - r.t < 7 * GUN) S.h7++; });
      S.c += kc; S.d += kd; if (kc) S.konular.push({ id: kid, ad: konu.ad, c: kc, d: kd });
    });
    var sn = null; [9, 10, 11].forEach(function (n) { if (siniflar[n] && siniflar[n].c > 0 && (sn == null || siniflar[n].c > siniflar[sn].c)) sn = n; });
    if (sn == null) sn = [9, 10, 11].indexOf(+K.sinif) !== -1 ? +K.sinif : null;
    if (sn == null) return null;
    var S = siniflar[sn] || { c: 0, d: 0, h7: 0, konular: [] };
    var gunler = Array.isArray(K.gunler) ? K.gunler : [], g7 = 0, seri = 0, i, d;
    for (i = 0; i < 7; i++) if (gunler.indexOf(gunKod(new Date(simdi - i * GUN))) !== -1) g7++;
    d = new Date(simdi); if (gunler.indexOf(gunKod(d)) === -1) d = new Date(simdi - GUN);
    while (gunler.indexOf(gunKod(d)) !== -1 && seri < 1000) { seri++; d = new Date(d.getTime() - GUN); }
    var konular = S.konular.slice().sort(function (a, b) { return b.c - a.c; }).slice(0, 10)
      .sort(function (a, b) { return a.id.localeCompare(b.id, undefined, { numeric: true }); });
    // Hata türleri: kitabın "Hata profilin" bölümüyle aynı sınıflandırıcı; aynı soruda aynı yanlış şık bir kez sayılır.
    var YN = window.BFY_YANILGI, ht = [];
    if (YN && YN.sikTur && YN.TURLER) {
      try {
        var gor = {}, say = {}, top = 0;
        var ekle = function (id, s) { var x = QH[id]; if (!x || x.sn !== sn || x.q.tur !== 'cs' || typeof s !== 'number' || s === x.q.dogru) return; var k = id + ':' + s; if (gor[k]) return; gor[k] = 1; var t = YN.sikTur(x.q, s); if (!t) return; top++; say[t] = (say[t] || 0) + 1; };
        (K.yh || []).forEach(function (x) { ekle(x.q, x.s); });
        Object.keys(K.q).forEach(function (id) { var r = K.q[id]; if (r && !r.d) ekle(id, r.s); });
        if (top >= 3) ht = Object.keys(say).filter(function (t) { return t !== 'diger' && YN.TURLER[t]; }).sort(function (a, b) { return say[b] - say[a]; }).slice(0, 2).map(function (t) { return YN.TURLER[t].ad; });
      } catch (e) { ht = []; }
    }
    var lis = 0; try { lis = window.BFY_ORTAK && window.BFY_ORTAK.sinifSeviye(sn) > 0 ? 1 : 0; } catch (e) { }
    var o = { v: 1, k: 'c', s: sn, t: gunKod(new Date(simdi)), c: S.c, dg: S.d, h7: S.h7, g7: g7, sr: seri, l: lis, z: konular.map(function (x) { return [x.ad, x.c, x.d]; }) };
    if (ht.length) o.ht = ht;
    return o;
  }
  function baglanti(o) { return 'https://benfizikyapamiyorum.com/veli/#d=' + b64u(o); }

  function kart(o, ana) {
    var oran = o.c ? Math.round(100 * o.dg / o.c) : 0, link = baglanti(o);
    var mesaj = 'Bu haftaki fizik çalışma karnem: son 7 günde ' + o.h7 + ' soru çözdüm, doğruluk oranım %' + oran + '. Ayrıntılar burada: ' + link;
    var baslik = o.l ? 'Bu haftaki emeğini velin de görsün' : 'Tam sürümü velinden mi isteyeceksin?';
    var metin = o.l
      ? 'Karnende son 7 günde çözdüğün soru sayısı, doğruluk oranın ve konu konu durumun yer alır. Adın ve cevapların gönderilmez.'
      : 'Önce çalıştığını göster: karneni gönder. Karnede son 7 günde çözdüğün soru sayısı, doğruluk oranın ve konu konu durumun yer alır. Adın ve cevapların gönderilmez.';
    return '<section class="yeni-kart" id="veliKart" aria-label="Veli karnesi"><div class="yk-ust"><span class="yk-rozet">Yeni</span><b>' + baslik + '</b>' +
      (ana ? '<button type="button" class="yk-kapat" data-veli-kapat aria-label="Kapat">✕</button>' : '') + '</div>' +
      '<div class="yk-ozellik"><span class="yk-ik" aria-hidden="true">👪</span><div><b>Veli karnesi</b><p>' + metin + '</p></div></div>' +
      '<div class="yk-alt"><a class="btn yesil ince" href="https://wa.me/?text=' + encodeURIComponent(mesaj) + '" target="_blank" rel="noopener noreferrer" data-veli-gonder>WhatsApp ile gönder</a>' +
      '<a class="btn cizgi ince" href="' + esc(link) + '" target="_blank" rel="noopener">Önce karneme bak</a></div></section>';
  }
  function yerlestir() {
    var uyg = document.getElementById('uyg'); if (!uyg || document.getElementById('veliKart')) return;
    var h = location.hash || '#/', ana = h === '#/' || h === '#' || h === '', ilerleme = /^#\/ilerleme/.test(h);
    if (!ana && !ilerleme) return;
    var hero = uyg.querySelector('.hero'); if (!hero) return;
    var o = karne(); if (!o) return;
    if (ana) { var a = oku(); if (o.c < 10 || o.h7 < 1 || (a.son && Date.now() - a.son < 6 * GUN) || (a.sonra && Date.now() < a.sonra)) return; }
    else if (o.c < 1) return;
    hero.insertAdjacentHTML('afterend', kart(o, ana));
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    if (t.closest('[data-veli-gonder]')) { var a = oku(); a.son = Date.now(); yaz(a); }
    else if (t.closest('[data-veli-kapat]')) { var b = oku(); b.sonra = Date.now() + 7 * GUN; yaz(b); var k = document.getElementById('veliKart'); if (k) k.remove(); }
  });
  function basla() {
    var uyg = document.getElementById('uyg'); if (!uyg) return;
    var bekle = null, dene = function () { clearTimeout(bekle); bekle = setTimeout(function () { try { yerlestir(); } catch (e) { } }, 60); };
    try { new MutationObserver(dene).observe(uyg, { childList: true }); } catch (e) { }
    window.addEventListener('hashchange', dene); dene();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
