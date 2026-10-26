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
  // Hoca satış ortaklığı: ?ref= kodunu hatırlayan ve indirim kodu şeridini gösteren küçük betik.
  try { var rs = document.createElement('script'); rs.src = '/bfy-ref.js?v=20261026'; rs.async = true; document.head.appendChild(rs); } catch (e) { /* sessiz */ }
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
      if (utm === 'ogretmen' || utm === 'paylasim') return utm;
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
        var taggedSource = new URLSearchParams(location.search).get('utm_source');
        if (['instagram','youtube','tiktok','ogretmen','paylasim'].indexOf(taggedSource) === -1) source = sessionStorage.getItem('bfy_source_v1') || source;
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

    // Bounded attribution labels only; never save arbitrary query strings or visitor details.
    var labs = ["basinc-kaldirma-3d", "basinc-kaldirma-laboratuvari", "carpisma-laboratuvari", "dalga-3d", "dalga-laboratuvari", "devre-laboratuvari", "egik-atis-3d", "egik-atis-laboratuvari", "enerji-sarkac-3d", "enerji-sarkac-laboratuvari", "hareket-grafikleri-3d", "hareket-grafikleri-laboratuvari", "manyetik-alan-3d", "manyetik-alan-laboratuvari", "optik-3d", "optik-laboratuvari", "vektor-3d", "vektor-laboratuvari"];
    var campaigns = ['simulasyon','haftalik-gorev','yazili','yapabilirim','ogretmen','sinif'];
    var creatives = ['carpisma','kaldirma','atis','devre','vektor','hareket','optik','manyetik','enerji','dalga'];
    var query = new URLSearchParams(location.search), campaign='', creative='', paid=false, activeLab='';
    try {
      if (yeniOturum || ['instagram','youtube','tiktok','ogretmen','paylasim'].indexOf(query.get('utm_source'))!==-1) ['bfy_lab_v1','bfy_campaign_v1','bfy_creative_v1','bfy_paid_v1'].forEach(function(k){ sessionStorage.removeItem(k); });
      var fromQuery=query.get('utm_campaign'), content=query.get('utm_content');
      if(campaigns.indexOf(fromQuery)!==-1) sessionStorage.setItem('bfy_campaign_v1',fromQuery);
      if(creatives.indexOf(content)!==-1) sessionStorage.setItem('bfy_creative_v1',content);
      if(['cpc','paid_social','paid'].indexOf(query.get('utm_medium'))!==-1) sessionStorage.setItem('bfy_paid_v1','1');
      campaign=sessionStorage.getItem('bfy_campaign_v1')||''; creative=sessionStorage.getItem('bfy_creative_v1')||''; paid=sessionStorage.getItem('bfy_paid_v1')==='1';activeLab=sessionStorage.getItem('bfy_lab_v1')||'';
    } catch (_) { campaign=query.get('utm_campaign')||''; creative=query.get('utm_content')||''; }
    if(campaigns.indexOf(campaign)===-1) campaign=''; if(creatives.indexOf(creative)===-1) creative=''; if(labs.indexOf(activeLab)===-1) activeLab='';
    var allowed = ['home_student_offer','home_teacher_offer','test_offer_view','test_offer_click','game_student_offer','game_teacher_offer','whatsapp_order','student_start','test_start','test_complete','practice_click','lesson_lab','review_resource','share_open','share_copy','share_whatsapp','share_qr','shop_click','lab_open','lab_interact','lab_quiz_start','lab_quiz_complete','lab_product','lab_teacher','lab_share','product_view','challenge_open','challenge_start','challenge_complete','challenge_share','challenge_card','prova_start','prova_complete','prova_card','prova_upsell','prova_share','prova_duyuru','ref_visit','ref_code_copy'];
    window.BFY = {
      track: function(event, context) {
        if (allowed.indexOf(event) === -1) return Promise.resolve(false);
        context = context || {};
        if (labs.indexOf(context.lab) !== -1) { activeLab = context.lab; try { sessionStorage.setItem('bfy_lab_v1', activeLab); } catch (_) {} }
        var transforms = [art('e_' + event), art('e_' + event + '_' + source)];
        if (activeLab) transforms.push(art('l_' + activeLab.replace(/-/g,'_') + '_' + event));
        if (campaign) transforms.push(art('c_' + campaign.replace(/-/g,'_') + '_' + event));
        if (creative) transforms.push(art('v_' + creative + '_' + event));
        if (paid) transforms.push(art('ad_' + source + '_' + event));
        var rf = window.BFY_REF || '';
        if (!rf) { try { var rk = JSON.parse(localStorage.getItem('bfy_ref_v1')); if (rk && Date.now() - rk.t < 30 * 864e5) rf = rk.id || ''; } catch (_) {} }
        if (/^[a-z0-9]{2,30}$/.test(rf)) transforms.push(art('r_' + rf + '_' + event));
        var payload = {writes:[
          yaz('istatistik/ozet', {guncelleme:{timestampValue:new Date().toISOString()}}, ['guncelleme'], [art('e_' + event)]),
          yaz('istatistik_gun/' + today, {gun:{stringValue:today}}, ['gun'], transforms)
        ]};
        return fetch(URL_, {method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
          .then(function(response) { return response.ok; }).catch(function() { return false; });
      }
    };
    if (/^(9|10|11|tyt)-sinif-fizik-paketi\.html$/.test(key) || key === 'tyt-fizik-paketi.html' || key === 'materyaller.html') window.BFY.track('product_view');
    document.addEventListener('click', function(event) {
      var link = event.target.closest('a');
      if (!link) return;
      if (link.dataset.bfyEvent) { window.BFY.track(link.dataset.bfyEvent, {lab:link.dataset.bfyLab}); if (['home_student_offer','home_teacher_offer','test_offer_click','game_student_offer','game_teacher_offer'].indexOf(link.dataset.bfyEvent)!==-1) window.BFY.track('shop_click'); return; }
      try { if (/(^|\.)shopier\.com$/.test(new URL(link.href).hostname)) window.BFY.track('shop_click'); } catch (_) {}
    });
  } catch (e) { /* sessiz */ }
})();
