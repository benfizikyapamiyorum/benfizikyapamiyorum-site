/* Ben Fizik Yapamıyorum canlı ders sayfaları: ortak motor.
   Bölüm gezinme, tam ekran 16:9 sunum, kalem, PDF kaydetme, süre göstergesi, aç-göster, mini test ve çizim yardımcıları.
   Sayfa: <body data-ders="Ders adı"> içinde .wrap > .ust + section.bolum[data-ad][data-sure]; sonunda Ders.basla() çağrılır. */
(function () {
  var wrap = document.querySelector(".wrap"), ust = wrap.querySelector(".ust");
  ust.insertAdjacentHTML("beforeend", '<span class="sure2" id="sure2">Toplam <b id="sTop">0:00</b><span>Bu bölüm <b id="sBol">0:00</b> / <i id="sHed" style="font-style:normal">0:00</i></span><span class="sonraki" id="sSon"></span></span>');
  ust.insertAdjacentHTML("afterend", '<nav class="serit" id="serit" aria-label="Ders bölümleri"></nav>');
  wrap.insertAdjacentHTML("beforeend", '<div class="alt"><button class="btn" id="geri">← Geri</button><span class="yer" id="yer"></span><button class="btn ana" id="ileri">İleri →</button></div>');
  document.body.insertAdjacentHTML("beforeend", "<canvas id=\"kalemKat\" aria-hidden=\"true\"></canvas>\n<nav class=\"serit2\" id=\"serit2\" aria-label=\"Bölümler\"></nav>\n<div class=\"arac\" id=\"arac\" role=\"toolbar\" aria-label=\"Kalem ve sunum araçları\">\n  <button id=\"aGeri\" aria-label=\"Önceki bölüm\">‹</button><span class=\"yer2\" id=\"yer2\"></span><button id=\"aIleri\" aria-label=\"Sonraki bölüm\">›</button>\n  <span class=\"ayr\"></span>\n  <button class=\"renk\" data-renk=\"#14202e\" aria-label=\"Siyah kalem\" aria-pressed=\"true\"><i style=\"background:#14202e\"></i></button>\n  <button class=\"renk\" data-renk=\"#d92d20\" aria-label=\"Kırmızı kalem\" aria-pressed=\"false\"><i style=\"background:#d92d20\"></i></button>\n  <button class=\"renk\" data-renk=\"#1d4ed8\" aria-label=\"Mavi kalem\" aria-pressed=\"false\"><i style=\"background:#1d4ed8\"></i></button>\n  <button class=\"renk\" data-renk=\"#15803d\" aria-label=\"Yeşil kalem\" aria-pressed=\"false\"><i style=\"background:#15803d\"></i></button>\n  <button id=\"kKalin\" aria-pressed=\"false\">Kalın</button>\n  <button id=\"kSilgi\" aria-pressed=\"false\">Silgi</button>\n  <button id=\"kGeri\">Geri al</button>\n  <button id=\"kTemiz\">Temizle</button>\n  <span class=\"ayr\"></span>\n  <button id=\"kCiz\" class=\"cizd\" aria-pressed=\"false\" title=\"Açıkken parmak ve fare de yazar. Apple Pencil her zaman yazar.\">✎ Parmakla yaz</button>\n  <button id=\"tam\">⛶ Tam ekran</button>\n  <span class=\"ayr\"></span>\n  <button id=\"kKaydet\" title=\"Bu modda yazdığın bölümleri yazılarınla birlikte PDF olarak kaydet\">⤓ PDF</button>\n  <button id=\"sureAc\" aria-pressed=\"false\" aria-label=\"Çekim süresi\" title=\"Çekim süresi: toplam süre, bu bölümün süresi ve sıradaki bölüm\">⏱</button>\n</div>");
  function $(id) { return document.getElementById(id); }
  function tr(n, d) { return n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function kisa(n) { return n.toLocaleString("tr-TR", { maximumFractionDigits: 2 }); }
  var azalt = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- bölüm gezinme ---------- */
  var B = [].slice.call(document.querySelectorAll("section.bolum")), akt = 0, FS = false;
  B.forEach(function (b) {
    var ic = document.createElement("div"); ic.className = "ic";
    while (b.firstChild) ic.appendChild(b.firstChild);
    var d = document.createElement("div"); d.className = "bos"; d.textContent = "Çözüm alanı"; ic.appendChild(d);
    b.appendChild(ic); b._ic = ic; b._bos = d;
  });
  function seritYaz(id) { $(id).innerHTML = B.map(function (s, k) { return '<button data-i="' + k + '" aria-current="' + (k === akt) + '">' + (k + 1) + ". " + s.getAttribute("data-ad") + "</button>"; }).join(""); }
  function git(i) {
    akt = Math.max(0, Math.min(B.length - 1, i));
    B.forEach(function (s, k) { s.classList.toggle("acik", k === akt); });
    seritYaz("serit"); seritYaz("serit2");
    $("yer").textContent = $("yer2").textContent = (akt + 1) + " / " + B.length;
    $("geri").disabled = $("aGeri").disabled = akt === 0; $("ileri").disabled = $("aIleri").disabled = akt === B.length - 1;
    var s2 = $("serit2"), c = s2.querySelector('[aria-current="true"]'); if (c) s2.scrollLeft = Math.max(0, c.offsetLeft - (s2.clientWidth - c.offsetWidth) / 2);
    window.scrollTo(0, 0);
    sigdir(); if (window.__kalemCiz) window.__kalemCiz();
    if (window.__sureBolum) window.__sureBolum();
  }
  function seritTik(e) { var b = e.target.closest("button[data-i]"); if (b) git(+b.getAttribute("data-i")); }
  $("serit").addEventListener("click", seritTik); $("serit2").addEventListener("click", seritTik);
  $("geri").addEventListener("click", function () { git(akt - 1); });
  $("ileri").addEventListener("click", function () { git(akt + 1); });
  $("aGeri").addEventListener("click", function () { git(akt - 1); });
  $("aIleri").addEventListener("click", function () { git(akt + 1); });
  document.addEventListener("keydown", function (e) {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") git(akt + 1);
    if (e.key === "ArrowLeft" || e.key === "PageUp") git(akt - 1);
  });

  /* ---------- sunum modu: bölüm 16:9 sahneye kaydırmadan sığar, boş kalan yer çözüm alanı olur ---------- */
  var MINBOS = 130, sigBekle = 0;
  function sigdir() {
    B.forEach(function (s, k) { if (k !== akt || !FS) { s._ic.style.width = ""; s._ic.style.transform = ""; s._bos.style.height = ""; s._bos.style.minHeight = ""; } });
    if (!FS) return;
    var s = B[akt], ic = s._ic, bos = s._bos, cs = getComputedStyle(s);
    var W = s.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var H = s.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (W < 50 || H < 50) return;
    bos.style.minHeight = "0px"; bos.style.height = MINBOS + "px"; ic.style.setProperty("--gmax", Math.round(H * 0.56) + "px");
    var z = 1;
    for (var k = 0; k < 8; k++) {
      ic.style.width = (W / z) + "px"; ic.style.transform = z < 1 ? "scale(" + z + ")" : "";
      var nz = Math.min(1, H / ic.offsetHeight);
      if (Math.abs(nz - z) < 0.004) { z = Math.min(z, nz); break; }
      z = nz;
    }
    ic.style.width = (W / z) + "px"; ic.style.transform = z < 1 ? "scale(" + z + ")" : "";
    var bosH = bos.offsetHeight, fazla = H / z - ic.offsetHeight;
    bos.style.height = Math.max(MINBOS, bosH + fazla - 1) + "px";
    s.scrollTop = 0; s.parentNode.scrollTop = 0; window.scrollTo(0, 0);
  }
  function sigdirSonra() { clearTimeout(sigBekle); sigBekle = setTimeout(function () { sigdir(); if (window.__kalemCiz) window.__kalemCiz(); }, 420); }
  document.addEventListener("click", function (e) { if (FS && !e.target.closest(".arac,.serit2")) sigdirSonra(); }, true);
  document.addEventListener("input", function () { if (FS) sigdirSonra(); });

  /* ---------- tam ekran (tablet ve bilgisayar) ---------- */
  (function () {
    var kok = document.documentElement, ac = kok.requestFullscreen || kok.webkitRequestFullscreen, kapat = document.exitFullscreen || document.webkitExitFullscreen, b = $("tam");
    function acik() { return document.fullscreenElement || document.webkitFullscreenElement; }
    function lb() {
      var h = Math.min(window.innerWidth * 9 / 16, window.innerHeight), l = (window.innerHeight - h) / 2;
      document.documentElement.style.setProperty("--lb", l + "px");
      document.body.classList.toggle("dar", l < 46);
    }
    function mod(v) {
      FS = v; document.documentElement.classList.toggle("fs", v); document.body.classList.toggle("fs", v);
      b.textContent = v ? "Tam ekrandan çık" : "⛶ Tam ekran"; b.setAttribute("aria-pressed", String(v));
      lb(); window.scrollTo(0, 0); sigdir(); if (window.__kalemCiz) window.__kalemCiz();
      setTimeout(function () { lb(); sigdir(); if (window.__kalemCiz) window.__kalemCiz(); }, 350);
    }
    b.addEventListener("click", function () {
      if (FS) { mod(false); try { if (acik()) { var r = kapat.call(document); if (r && r.catch) r.catch(function () {}); } } catch (e) {} return; }
      mod(true);
      try { if (ac && !acik()) { var r2 = ac.call(kok); if (r2 && r2.catch) r2.catch(function () {}); } } catch (e) {}
    });
    function degisti() { if (!acik() && FS && ac) mod(false); else { lb(); sigdir(); } }
    document.addEventListener("fullscreenchange", degisti); document.addEventListener("webkitfullscreenchange", degisti);
    window.addEventListener("resize", function () { lb(); if (FS) sigdirSonra(); });
  })();

  /* ---------- çekim süresi: toplam, bu bölüm / hedef, sıradaki bölüm ---------- */
  (function () {
    var HEDEF = B.map(function (b) { return +b.getAttribute("data-sure") || 120; }), bas = 0, bolBas = 0, sayac = null;
    function ms(sn) { sn = Math.max(0, Math.floor(sn)); return Math.floor(sn / 60) + ":" + ("0" + sn % 60).slice(-2); }
    function yaz() {
      var simdi = Date.now(), b = (simdi - bolBas) / 1000, h = HEDEF[akt] || 120;
      $("sTop").textContent = ms((simdi - bas) / 1000); $("sBol").textContent = ms(b); $("sBol").className = b > h ? "asim" : ""; $("sHed").textContent = ms(h);
      $("sSon").textContent = akt < B.length - 1 ? "→ " + B[akt + 1].getAttribute("data-ad") : "son bölüm";
    }
    window.__sureBolum = function () { bolBas = Date.now(); if (document.body.classList.contains("sure")) yaz(); };
    $("sureAc").addEventListener("click", function () {
      var v = !document.body.classList.contains("sure"); document.body.classList.toggle("sure", v); this.setAttribute("aria-pressed", String(v));
      clearInterval(sayac); if (v) { bas = bolBas = Date.now(); yaz(); sayac = setInterval(yaz, 1000); }
    });
  })();

  /* ---------- kalem: Apple Pencil her zaman yazar; "Parmakla yaz" açıkken parmak ve fare de yazar ---------- */
  (function () {
    var kat = $("kalemKat"), kx = kat.getContext("2d"), dpr = 1, CIZ = {}, renk = "#14202e", kalin = false, silgi = false, ciziyor = {}, stylusVar = false, cizAcik = false;
    function anahtar() { return akt + (FS ? "f" : "n"); }
    function liste() { var k = anahtar(); return CIZ[k] || (CIZ[k] = []); }
    /* Tuvalin ekrandaki gerçek yeri ve boyutu her seferinde ölçülür: iPad'de 100vh ile görünen yükseklik farklı olduğu için kayma olmaz */
    var R = { l: 0, t: 0, sx: 1, sy: 1 };
    function boyut() {
      var w = document.documentElement.clientWidth || window.innerWidth, h = window.innerHeight;
      if (window.visualViewport) { h = Math.round(window.visualViewport.height * window.visualViewport.scale) || h; }
      dpr = Math.min(2, window.devicePixelRatio || 1);
      kat.style.width = w + "px"; kat.style.height = h + "px";
      if (kat.width !== Math.round(w * dpr) || kat.height !== Math.round(h * dpr)) { kat.width = Math.round(w * dpr); kat.height = Math.round(h * dpr); }
      olc(); hepsi();
    }
    function olc() { var r = kat.getBoundingClientRect(); R.l = r.left; R.t = r.top; R.sx = r.width ? kat.width / r.width : dpr; R.sy = r.height ? kat.height / r.height : dpr; }
    function hazirla(c) {
      kx.setTransform(R.sx, 0, 0, R.sy, -(window.scrollX + R.l) * R.sx, -(window.scrollY + R.t) * R.sy);
      kx.globalCompositeOperation = c.sil ? "destination-out" : "source-over";
      kx.strokeStyle = c.r; kx.fillStyle = c.r; kx.lineWidth = c.w; kx.lineCap = "round"; kx.lineJoin = "round";
    }
    function nokta(c, x, y) { hazirla(c); kx.beginPath(); kx.arc(x, y, c.w / 2, 0, 7); kx.fill(); }
    function cizgi(c) {
      var p = c.p; if (p.length === 2) { nokta(c, p[0], p[1]); return; }
      hazirla(c); kx.beginPath(); kx.moveTo(p[0], p[1]);
      for (var i = 2; i < p.length - 2; i += 2) kx.quadraticCurveTo(p[i], p[i + 1], (p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2);
      kx.lineTo(p[p.length - 2], p[p.length - 1]); kx.stroke();
    }
    /* yalnız yeni parçayı çiz: uzun çizgide gecikme olmaz */
    function parca(c) {
      var p = c.p, n = p.length; if (n < 4) { cizgi(c); return; }
      hazirla(c); kx.beginPath();
      if (n === 4) { kx.moveTo(p[0], p[1]); kx.lineTo((p[0] + p[2]) / 2, (p[1] + p[3]) / 2); }
      else { kx.moveTo((p[n - 6] + p[n - 4]) / 2, (p[n - 5] + p[n - 3]) / 2); kx.quadraticCurveTo(p[n - 4], p[n - 3], (p[n - 4] + p[n - 2]) / 2, (p[n - 3] + p[n - 1]) / 2); }
      kx.stroke();
    }
    function hepsi() { kx.setTransform(1, 0, 0, 1, 0, 0); kx.globalCompositeOperation = "source-over"; kx.clearRect(0, 0, kat.width, kat.height); liste().forEach(cizgi); kx.globalCompositeOperation = "source-over"; }
    window.__kalemCiz = function () { requestAnimationFrame(boyut); };
    function basla(id, x, y) { olc(); var c = { r: renk, w: silgi ? 34 : kalin ? 7 : 3.5, sil: silgi, p: [x + window.scrollX, y + window.scrollY], t: Date.now(), x0: x, y0: y, m: 0 }; ciziyor[id] = c; liste().push(c); nokta(c, c.p[0], c.p[1]); return c; }
    function ekle(id, x, y) { var c = ciziyor[id]; if (!c) return; c.p.push(x + window.scrollX, y + window.scrollY); c.m = Math.max(c.m, Math.abs(x - c.x0) + Math.abs(y - c.y0)); parca(c); }
    function bitir(id, x, y, tikla) {
      var c = ciziyor[id]; if (!c) return; delete ciziyor[id];
      if (c.p.length > 4) { c.p.push(c.p[c.p.length - 2], c.p[c.p.length - 1]); }
      /* kalemle kısa dokunuş = tıklama (düğmelere kalemle de basılabilsin) */
      /* yalnız bir düğmenin üstüne kısa dokunuş tıklamadır; başka her yerde nokta kalır */
      var h = null;
      if (tikla && c.m < 10 && Date.now() - c.t < 350) { var el = document.elementFromPoint(x, y); if (el && !el.closest("#kalemKat")) h = el.closest("button,a,input,label,select,[data-ac],[data-soru] button"); }
      if (h) { var L = liste(), i = L.indexOf(c); if (i > -1) L.splice(i, 1); hepsi(); if (h.focus) h.focus(); h.click(); }
      else hepsi();
    }
    /* Apple Pencil: dokunma olaylarıyla, sayfa kaymadan ve her vuruş tek seferde */
    function kalemDokunus(t) { return t.touchType === "stylus"; }
    function aracUstu(t) { var el = t.target && t.target.closest ? t.target : null; return el && el.closest(".arac,.serit2"); }
    document.addEventListener("touchstart", function (e) {
      var ok = false;
      [].forEach.call(e.changedTouches, function (t) { if (kalemDokunus(t) && !aracUstu(t)) { stylusVar = true; ok = true; basla("t" + t.identifier, t.clientX, t.clientY); } });
      if (ok) e.preventDefault();
    }, { passive: false, capture: true });
    document.addEventListener("touchmove", function (e) {
      var ok = false;
      [].forEach.call(e.changedTouches, function (t) { if (ciziyor["t" + t.identifier]) { ok = true; ekle("t" + t.identifier, t.clientX, t.clientY); } });
      if (ok) e.preventDefault();
    }, { passive: false, capture: true });
    function dokunusBitti(e) {
      var ok = false;
      [].forEach.call(e.changedTouches, function (t) { if (ciziyor["t" + t.identifier]) { ok = true; bitir("t" + t.identifier, t.clientX, t.clientY, e.type === "touchend"); } });
      if (ok && e.cancelable) e.preventDefault();
    }
    document.addEventListener("touchend", dokunusBitti, { passive: false, capture: true });
    document.addEventListener("touchcancel", dokunusBitti, { passive: false, capture: true });
    /* parmak, fare ya da başka kalem: "Parmakla yaz" açıkken katman olaylarıyla */
    kat.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "pen" && stylusVar) return;
      try { kat.setPointerCapture(e.pointerId); } catch (x) {}
      basla("p" + e.pointerId, e.clientX, e.clientY); e.preventDefault();
    });
    kat.addEventListener("pointermove", function (e) {
      if (!ciziyor["p" + e.pointerId]) return;
      var es = e.getCoalescedEvents ? e.getCoalescedEvents() : []; if (!es.length) es = [e];
      es.forEach(function (q) { ekle("p" + e.pointerId, q.clientX, q.clientY); }); e.preventDefault();
    });
    function pBitti(e) { bitir("p" + e.pointerId, e.clientX, e.clientY, false); }
    kat.addEventListener("pointerup", pBitti); kat.addEventListener("pointercancel", pBitti);
    kat.addEventListener("touchstart", function (e) { if (cizAcik) e.preventDefault(); }, { passive: false });
    kat.addEventListener("touchmove", function (e) { if (cizAcik) e.preventDefault(); }, { passive: false });
    /* araç çubuğu */
    $("arac").addEventListener("click", function (e) {
      var b = e.target.closest("[data-renk]"); if (!b) return;
      renk = b.getAttribute("data-renk"); silgi = false; $("kSilgi").setAttribute("aria-pressed", "false");
      [].forEach.call(document.querySelectorAll("[data-renk]"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    });
    $("kKalin").addEventListener("click", function () { kalin = !kalin; this.setAttribute("aria-pressed", String(kalin)); });
    $("kSilgi").addEventListener("click", function () { silgi = !silgi; this.setAttribute("aria-pressed", String(silgi)); });
    $("kGeri").addEventListener("click", function () { liste().pop(); hepsi(); });
    $("kTemiz").addEventListener("click", function () { CIZ[anahtar()] = []; hepsi(); });
    /* yazdıklarını kaydet: içinde bulunulan modda (normal ya da tam ekran) yazı olan her bölüm, yazısıyla birlikte bir PDF sayfası olur */
    function cizG(g, c) {
      g.globalCompositeOperation = c.sil ? "destination-out" : "source-over"; g.strokeStyle = c.r; g.fillStyle = c.r; g.lineWidth = c.w; g.lineCap = "round"; g.lineJoin = "round";
      var p = c.p; if (p.length === 2) { g.beginPath(); g.arc(p[0], p[1], c.w / 2, 0, 7); g.fill(); return; }
      g.beginPath(); g.moveTo(p[0], p[1]);
      for (var i = 2; i < p.length - 2; i += 2) g.quadraticCurveTo(p[i], p[i + 1], (p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2);
      g.lineTo(p[p.length - 2], p[p.length - 1]); g.stroke();
    }
    var OZ = ["--bwid", "--bh", "--bc", "--p-w", "--p-tr", "--p-bos", "--p-bosmin", "--p-gmax"];
    function kaydet() {
      var mod = FS ? "f" : "n", onceki = akt, yazili = [], dugme = $("kKaydet"), ilkW = 0;
      B.forEach(function (b, i) { if (CIZ[i + mod] && CIZ[i + mod].length) yazili.push(i); });
      [].forEach.call(document.querySelectorAll("img.yazi-baski, .baski-ust"), function (e) { e.parentNode.removeChild(e); });
      B.forEach(function (b) { OZ.forEach(function (o) { b.style.removeProperty(o); }); b.classList.remove("baski-yok"); });
      if (!yazili.length) { dugme.textContent = "Önce bir şey yaz"; setTimeout(function () { dugme.textContent = "⤓ PDF"; }, 1800); return; }
      window.scrollTo(0, 0);
      yazili.forEach(function (i) {
        git(i);
        var b = B[i], ic = b._ic, bos = b._bos, r = b.getBoundingClientRect(), c = document.createElement("canvas"), g = c.getContext("2d"), o = 2;
        if (!ilkW) ilkW = r.width;
        c.width = Math.round(r.width * o); c.height = Math.round(r.height * o);
        g.setTransform(o, 0, 0, o, -(r.left + window.scrollX) * o, -(r.top + window.scrollY) * o);
        CIZ[i + mod].forEach(function (z) { cizG(g, z); });
        var im = new Image(); im.className = "yazi-baski"; im.alt = ""; im.style.width = r.width + "px"; im.src = c.toDataURL("image/png"); b.appendChild(im);
        var et = document.createElement("div"); et.className = "baski-ust"; et.textContent = (document.body.getAttribute("data-ders") || document.title) + " | benfizikyapamiyorum.com"; b.appendChild(et);
        b.style.setProperty("--bwid", r.width + "px"); b.style.setProperty("--bh", Math.ceil(r.height) + "px"); b.style.setProperty("--bc", getComputedStyle(ic).gridTemplateColumns);
        if (FS) {
          b.style.setProperty("--p-w", ic.style.width || "auto"); b.style.setProperty("--p-tr", ic.style.transform || "none");
          b.style.setProperty("--p-bos", bos.style.height || "auto"); b.style.setProperty("--p-bosmin", "0px"); b.style.setProperty("--p-gmax", ic.style.getPropertyValue("--gmax") || "9999px");
        }
      });
      B.forEach(function (b, i) { b.classList.toggle("baski-yok", yazili.indexOf(i) < 0); });
      git(onceki);
      document.documentElement.style.setProperty("--bz", (1062 / ilkW).toFixed(4));
      setTimeout(function () { window.print(); }, 200);
    }
    $("kKaydet").addEventListener("click", kaydet);
    $("kCiz").addEventListener("click", function () { cizAcik = !cizAcik; document.body.classList.toggle("ciz", cizAcik); this.setAttribute("aria-pressed", String(cizAcik)); });
    var bekle = false;
    window.addEventListener("scroll", function () { if (bekle) return; bekle = true; requestAnimationFrame(function () { bekle = false; hepsi(); }); }, { passive: true });
    window.addEventListener("resize", boyut);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", boyut);
    document.addEventListener("fullscreenchange", function () { setTimeout(boyut, 300); }); document.addEventListener("webkitfullscreenchange", function () { setTimeout(boyut, 300); });
    boyut();
  })();

  /* ---------- aç-göster ve sorular ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-ac]");
    if (a) { $(a.getAttribute("data-ac")).classList.add("acik"); if (a.getAttribute("data-ac2")) $(a.getAttribute("data-ac2")).classList.add("acik"); a.style.display = "none"; return; }
    var b = e.target.closest("[data-soru] button"); if (!b) return;
    var kutu = b.parentNode; if (kutu.getAttribute("data-bitti")) return;
    var d = +kutu.getAttribute("data-d"), bs = [].slice.call(kutu.children), sec = bs.indexOf(b);
    kutu.setAttribute("data-bitti", sec === d ? "d" : "y");
    bs[d].classList.add("d"); if (sec !== d) b.classList.add("y");
    var ac = kutu.nextElementSibling; if (ac && ac.classList.contains("gizli")) ac.classList.add("acik");
    if (kutu.hasAttribute("data-test")) {
      var t = [].slice.call(document.querySelectorAll("[data-test]"));
      var dogru = t.filter(function (k) { return k.getAttribute("data-bitti") === "d"; }).length, biten = t.filter(function (k) { return k.getAttribute("data-bitti"); }).length;
      if ($("puan")) $("puan").textContent = "Sonuç: " + dogru + " / " + t.length + (biten === t.length ? (dogru === t.length ? ". Hepsi doğru." : ". Yanlış yaptığın sorunun açıklamasını bir kez daha oku.") : "");
    }
  });


  /* ---------- adım adım çözümler ---------- */
  function adimlar(listeId, dugmeId, sifirId, degisti) {
    var n = 0, AL = [].slice.call(document.querySelectorAll("#" + listeId + " li"));
    function ciz() {
      AL.forEach(function (li, i) { li.classList.toggle("acik", i < n); });
      $(dugmeId).textContent = n === 0 ? "İlk adımı göster" : n < AL.length ? "Sonraki adım" : "Çözüm tamam"; $(dugmeId).disabled = n >= AL.length;
      if (degisti) degisti(n);
    }
    $(dugmeId).addEventListener("click", function () { if (n < AL.length) { n++; ciz(); } });
    $(sifirId).addEventListener("click", function () { n = 0; ciz(); });
    ciz();
  }

  /* ---------- ortak çizim ---------- */
  var INK = "#1c2b26", F = '"Plus Jakarta Sans", system-ui, sans-serif', CW = 720, CH = 320;
  function hazirla(id) { var c = $(id), d = Math.min(2, window.devicePixelRatio || 1); c.width = CW * d; c.height = CH * d; var x = c.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0); return x; }
  function yazi(x, s, px, py, boy, renk, hiza, kalin) { x.font = (kalin || 700) + " " + boy + "px " + F; x.fillStyle = renk || INK; x.textAlign = hiza || "left"; x.textBaseline = "middle"; x.fillText(s, px, py); }
  function ok(x, x1, y1, x2, y2, renk, kal) {
    var L = Math.hypot(x2 - x1, y2 - y1); if (L < 4) return; var ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = Math.min(20, L * 0.6);
    x.strokeStyle = renk; x.fillStyle = renk; x.lineWidth = kal || 7; x.lineCap = "round";
    x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2 - ux * h, y2 - uy * h); x.stroke();
    x.beginPath(); x.moveTo(x2, y2); x.lineTo(x2 - ux * h - uy * h * 0.55, y2 - uy * h + ux * h * 0.55); x.lineTo(x2 - ux * h + uy * h * 0.55, y2 - uy * h - ux * h * 0.55); x.closePath(); x.fill();
  }
  function zemin(x, y, renk, m, olcek, adimM) {
    x.clearRect(0, 0, CW, CH); x.fillStyle = "#fbfdfb"; x.fillRect(0, 0, CW, CH);
    x.fillStyle = renk; x.fillRect(0, y, CW, CH - y); x.fillStyle = "rgba(0,0,0,.18)"; x.fillRect(0, y, CW, 3);
    if (!m) return;
    for (var i = 0; i <= m; i += adimM) { var px = 40 + i * olcek; x.fillStyle = "#ffffff"; x.fillRect(px - 1.5, y + 10, 3, 14); yazi(x, i + (i === m ? " m" : ""), px, y + 46, 20, "#ffffff", "center", 700); }
  }
  function kutu(x, px, py, w, h, etiket, boy) {
    var g = x.createLinearGradient(0, py, 0, py + h); g.addColorStop(0, "#f1f5f9"); g.addColorStop(1, "#94a3b8");
    x.fillStyle = g; x.strokeStyle = "#475569"; x.lineWidth = 2.5; x.beginPath(); x.roundRect(px, py, w, h, 10); x.fill(); x.stroke();
    yazi(x, etiket, px + w / 2, py + h / 2, boy || 22, INK, "center", 800);
  }

  function okS(x1, y1, x2, y2, renk) {
    var L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = 18, bx = x2 - ux * h, by = y2 - uy * h;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + (bx + ux).toFixed(1) + '" y2="' + (by + uy).toFixed(1) + '" stroke="' + renk + '" stroke-width="8" stroke-linecap="round"/>' +
      '<polygon points="' + x2 + ',' + y2 + ' ' + (bx - uy * 11).toFixed(1) + ',' + (by + ux * 11).toFixed(1) + ' ' + (bx + uy * 11).toFixed(1) + ',' + (by - ux * 11).toFixed(1) + '" fill="' + renk + '"/>';
  }
  function yz(x, y, s, renk, hiza, boy) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (hiza || "middle") + '" font-size="' + (boy || 22) + '" font-weight="800" fill="' + renk + '">' + s + '</text>'; }

  var yeniden = [];
  window.Ders = { $: $, tr: tr, kisa: kisa, azalt: azalt, bolumler: B, git: git, adimlar: adimlar, hazirla: hazirla, yazi: yazi, ok: ok, zemin: zemin, kutu: kutu, okS: okS, yz: yz, CW: CW, CH: CH, INK: INK,
    aktifMi: function (el) { var s = el.closest("section.bolum"); return !!s && s.classList.contains("acik"); },
    yenidenCiz: function (f) { yeniden.push(f); },
    basla: function () { git(0); yeniden.forEach(function (f) { f(); }); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { yeniden.forEach(function (f) { f(); }); }); } };
})();
