/* ===========================================================
   BFY Hoca Satış Ortaklığı — yönlendirme kodu
   • ?ref=<hoca> ile gelen ziyaretçiyi 30 gün hatırlar.
   • Yalnızca /ortak/hocalar.json içinde kayıtlı hocalar geçerlidir.
   • Sitede ince bir şerit gösterir: hocanın indirim kodu + kopyala.
   • Shopier bağlantısına tıklanınca kodu panoya kopyalar.
   • Ziyaretçi hakkında kişisel bilgi saklamaz; yalnızca hoca etiketi.
   =========================================================== */
(function () {
  var GUN = 30, LS_KEY = 'bfy_ref_v1', OK = /^[a-z0-9]{2,30}$/;
  function lsGet() { try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch (e) { return null; } }
  function lsSet(v) { try { localStorage.setItem(LS_KEY, JSON.stringify(v)); } catch (e) {} }
  function lsDel() { try { localStorage.removeItem(LS_KEY); } catch (e) {} }

  var q = '';
  try { q = (new URLSearchParams(location.search).get('ref') || new URLSearchParams(location.search).get('hoca') || '').toLowerCase().replace(/[^a-z0-9]/g, ''); } catch (e) {}
  var kayit = lsGet();
  if (kayit && (!OK.test(kayit.id || '') || Date.now() - (kayit.t || 0) > GUN * 864e5)) { lsDel(); kayit = null; }
  if (!q && !kayit) return;

  fetch('/ortak/hocalar.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    var H = (j && j.hocalar) || {};
    var yeni = false;
    if (OK.test(q) && H[q] && H[q].aktif !== false) {
      yeni = !kayit || kayit.id !== q;
      kayit = { id: q, t: Date.now() };
      lsSet(kayit);
    }
    if (!kayit || !H[kayit.id] || H[kayit.id].aktif === false) { if (kayit && !H[kayit.id]) lsDel(); return; }
    var h = H[kayit.id];
    window.BFY_REF = kayit.id;
    var track = function (ev) { try { window.BFY && window.BFY.track && window.BFY.track(ev); } catch (e) {} };
    if (yeni) track('ref_visit');
    serit(h, track);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var host = ''; try { host = new URL(a.href).hostname; } catch (_) {}
      if (/(^|\.)shopier\.com$/.test(host)) { kopyala(h.kod, true); }
    }, true);
  }).catch(function () {});

  function kopyala(kod, sessiz) {
    var bitti = function () { if (!sessiz) bildir('Kod kopyalandı: ' + kod); else bildir('İndirim kodun panoda: ' + kod + ' · Shopier ödeme adımında yapıştır'); };
    try { navigator.clipboard.writeText(kod).then(bitti, function () {}); } catch (e) {}
  }
  function bildir(t) {
    var b = document.getElementById('bfyRefToast');
    if (!b) { b = document.createElement('div'); b.id = 'bfyRefToast'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
    b.textContent = t; b.className = 'on'; clearTimeout(b._t); b._t = setTimeout(function () { b.className = ''; }, 3200);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function serit(h, track) {
    try { if (sessionStorage.getItem('bfy_ref_kapali') === '1') return; } catch (e) {}
    var css = document.createElement('style');
    css.textContent = '#bfyRef{position:relative;z-index:61;background:#e9be64;color:#1c2522;font:600 14px/1.35 "Plus Jakarta Sans",system-ui,sans-serif}#bfyRef .in{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:8px 44px 8px 16px;text-align:center}#bfyRef b{font-weight:800}#bfyRef code{font:800 14px/1 "Plus Jakarta Sans",system-ui,sans-serif;letter-spacing:.06em;background:#fff;border:1.5px dashed #1c2522;border-radius:7px;padding:5px 9px}#bfyRef button{font:inherit;font-weight:800;cursor:pointer;border-radius:7px}#bfyRef .kp{background:#1c2522;color:#fff;border:0;padding:6px 11px}#bfyRef .x{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:0;font-size:20px;line-height:1;padding:6px;color:#1c2522}@media(max-width:640px){#bfyRef .l{display:none}#bfyRef .in{gap:8px;padding:7px 38px 7px 12px;font-size:13px}#bfyRef code{font-size:13px;padding:4px 7px}#bfyRef .kp{padding:5px 9px}}#bfyRefToast{position:fixed;left:50%;bottom:22px;transform:translate(-50%,20px);opacity:0;z-index:9999;background:#1c2522;color:#fff;font:700 14px/1.4 "Plus Jakarta Sans",system-ui,sans-serif;padding:11px 16px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);transition:.25s;pointer-events:none;max-width:calc(100% - 32px);text-align:center}#bfyRefToast.on{opacity:1;transform:translate(-50%,0)}';
    document.head.appendChild(css);
    var d = document.createElement('div');
    d.id = 'bfyRef'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Hoca indirim kodu');
    d.innerHTML = '<div class="in"><span>🎓 <b>' + esc(h.ad) + '</b> öğrencilerine <b>' + esc(h.indirim || '%10') + ' indirim</b><span class="l">: Shopier ödeme adımında bu kodu yaz</span></span><code>' + esc(h.kod) + '</code><button type="button" class="kp">Kodu kopyala</button></div><button type="button" class="x" aria-label="Şeridi kapat">×</button>';
    d.querySelector('.kp').onclick = function () { kopyala(h.kod, false); track('ref_code_copy'); };
    d.querySelector('.x').onclick = function () { d.remove(); try { sessionStorage.setItem('bfy_ref_kapali', '1'); } catch (e) {} };
    var ekle = function () { document.body.insertBefore(d, document.body.firstChild); };
    if (document.body) ekle(); else document.addEventListener('DOMContentLoaded', ekle);
  }
})();
