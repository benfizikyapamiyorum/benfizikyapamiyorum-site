/* Hazır içerikle çalışan, yalnızca bu sayfa açıkken bağlam tutan rehber. */
(function (root) {
  'use strict';
  const menu = ['Konu öğrenelim', 'Soruda takıldım', 'Denememi değerlendirelim', 'Bugün başlayalım', 'Sitede yol göster'];
  const modes = ['Sıfırdan anlat', 'Günlük hayattan örnek', 'Harfleri ve birimleri açıkla', 'Birlikte çözelim'];
  const lessons = {
    'Yol ve yer değiştirme': {
      intro: 'Yol, hareket boyunca katettiğin toplam uzunluktur. Yer değiştirme, başlangıç konumundan bitiş konumuna çizilen yönlü farktır. Gidip geri döndüğünde yol artar; başlangıca dönersen yer değiştirmen sıfır olur.',
      example: 'Evden 300 metre doğuya yürüyüp 100 metre batıya dönüyorsun. Toplam yolun 400 metre; yer değiştirmen 200 metre doğuya. Yolu hesaplarken parçaları toplar, yer değiştirmede başlangıç ve bitişi karşılaştırırsın.',
      formula: 'Δx = xₛₒₙ − xᵢₗₖ. x konum, Δx yer değiştirmedir; birimleri metredir (m). Δ “değişim” demektir. Tek boyutta seçtiğin pozitif yöne göre işaret kullanırsın. Ortalama sürat = toplam yol / geçen süre; ortalama hız = yer değiştirme / geçen süre.',
      question: 'Bir öğrenci 60 m doğuya, ardından 20 m batıya yürüyor. Toplam yol ve yer değiştirme hangisi?',
      choices: ['A) 80 m; 40 m doğuya', 'B) 40 m; 80 m doğuya', 'C) 80 m; 80 m doğuya'], correct: 0,
      hint: 'Yol için her iki yürüyüşü topla. Yer değiştirmede batıya gidişin, doğuya gidişin bir bölümünü geri aldığını düşün.',
      solution: 'Yol = 60 + 20 = 80 m. Doğuyu pozitif seçersek Δx = 60 − 20 = +40 m, yani 40 m doğuya. Yön değiştirmek, önceden yürüdüğün yolu silmez.', link: 'hareket-grafikleri-laboratuvari.html'
    },
    'Ohm yasası': {
      intro: 'Gerilim, devrede akım oluşmasıyla ilişkili potansiyel farkıdır. Direnç, akımın geçişine karşı gösterilen elektriksel etkidir. Sıcaklığı sabit, Ohm yasasına uyan bir dirençte gerilim arttıkça akım artar.',
      example: 'Aynı 6 Ω direnci önce 6 V, sonra 12 V gerilime bağladığını düşün. Sıcaklığın değişmediği modelde akım önce 1 A, sonra 2 A olur. Gerilimi iki katına çıkarmak, bu koşulda akımı da iki katına çıkarır.',
      formula: 'V = I·R. V: gerilim, birimi volt (V). I: elektrik akımı, birimi amper (A). R: direnç, birimi ohm (Ω). Akım soruluyorsa I = V/R. Buradaki I akımdır; başka konularda aynı harfin başka anlamı olabilir.',
      question: 'Uçlarına 12 V uygulanan 4 Ω ideal dirençten geçen akım kaç amperdir?', choices: ['A) 48 A', 'B) 3 A', 'C) 0,33 A'], correct: 1,
      hint: 'Aradığımız akım. V = I·R bağıntısında I yalnız kalınca gerilimi dirence bölersin.',
      solution: 'I = V/R = 12/4 = 3 A. 48 sonucu çarpmaktan çıkar; gerilim ile direnci çarpmak akımı vermez.', link: 'simulasyonlar.html'
    },
    'Enerji dönüşümü': {
      intro: 'Bir sistemde enerji biçim değiştirebilir. Sürtünme yokken ve yalnızca korunumlu kuvvetler iş yaparken mekanik enerji korunur. Sürtünme varsa mekanik enerjinin bir bölümü iç enerjiye dönüşebilir; toplam enerji yok olmaz.',
      example: 'Kaydıraktan inerken yerçekimi potansiyel enerjin azalır, kinetik enerjin artabilir. Sürtünme varsa enerjinin bir bölümü senin ve kaydırağın iç enerjisine dönüşür. Bu yüzden kaybedilen potansiyel enerjinin tamamı kinetik enerjiye dönüşmeyebilir.',
      formula: 'Eₖ = ½mv²; Eₚ = mgh. m: kütle (kg), v: sürat (m/s), g: yerçekimi ivmesi (m/s²), h: seçilen referans düzeyinden yükseklik (m). Enerjinin birimi joule (J). mgh, Dünya yüzeyine yakın ve g sabit kabul edilen durumlar içindir.',
      question: 'Kütlesi değişmeyen bir cismin sürati iki katına çıkarsa kinetik enerjisi nasıl değişir?', choices: ['A) İki katına çıkar', 'B) Değişmez', 'C) Dört katına çıkar'], correct: 2,
      hint: 'Formülde sürat tek başına değil, karesiyle bulunuyor. (2v)² kaç v² eder?',
      solution: 'Eₖ = ½m(2v)² = 4·½mv². Kinetik enerji dört katına çıkar. İki kat sonucu, süratin karesini dikkate almamaktan kaynaklanır.', link: 'enerji-sarkac-laboratuvari.html'
    },
    'Işığın yansıması': {
      intro: 'Işın yüzeye çarptığında geldiği ortama geri dönebilir: buna yansıma denir. Gelme ve yansıma açıları yüzeyden değil, çarpma noktasında yüzeye dik çizilen normalden ölçülür. Bu iki açı eşittir.',
      example: 'Düz aynaya eğik tuttuğun dar bir ışık demetini düşün. Çarpma noktasına bir normal çiz. Gelen ışın normalin bir yanında, yansıyan ışın öbür yanında eşit açı yapar. Aynayı döndürürsen normal de döner.',
      formula: 'i = r. i: gelme açısı, r: yansıma açısıdır. Bu örneklerde açıları derece (°) ile ölçüyoruz. Işının ayna yüzeyiyle yaptığı açı α ise i = 90° − α. Normal, yüzeye dik yardımcı çizgidir; fiziksel bir ışın değildir.',
      question: 'Gelen ışın, düz ayna yüzeyiyle 30° açı yapıyor. Yansıma açısı kaç derecedir?', choices: ['A) 30°', 'B) 60°', 'C) 90°'], correct: 1,
      hint: 'Verilen açı yüzeyle yapılmış. Önce normale göre açıyı bul; sonra yansıma yasasını uygula.',
      solution: 'Gelme açısı i = 90° − 30° = 60°. Yansıma açısı da r = 60°. Sık hata, yüzeyle yapılan 30°yi doğrudan yansıma açısı sanmaktır.', link: 'optik-laboratuvari.html'
    },
    'İtme ve momentum': {
      intro: 'Momentum, kütle ve hızın çarpımı olan vektörel büyüklüktür. İtme, momentumdaki değişime eşittir. Çarpışan sistemi ele aldığımızda dış kuvvetlerin toplam itmesi sıfırsa toplam momentum korunur; kinetik enerji her çarpışmada korunmak zorunda değildir.',
      example: 'Topu yakalarken ellerini topla birlikte biraz geri götürmek durdurma süresini uzatır. Aynı top aynı ilk hızdan duruyorsa momentum değişimi aynıdır; süre uzadığında ortalama durdurucu kuvvetin büyüklüğü azalır.',
      formula: 'p = mv; I = Fₒᵣₜ·Δt = Δp. p: momentum (kg·m/s), m: kütle (kg), v: hız (m/s), I: itme (N·s), Fₒᵣₜ: ortalama net kuvvet (N), Δt: süre (s). İtme ve momentum yönlüdür; tek boyutta işaretleri aynı yön seçimine göre kullan.',
      question: '2 kg kütleli cisim doğuya 3 m/s hızla giderken durduruluyor. Cisme uygulanan toplam itme nedir?', choices: ['A) 6 N·s doğuya', 'B) 0 N·s', 'C) 6 N·s batıya'], correct: 2,
      hint: 'Doğuyu pozitif seç: ilk momentum +6, son momentum 0. Değişim = son − ilk.',
      solution: 'I = Δp = 0 − 2·3 = −6 kg·m/s = −6 N·s. Eksi işaret batıyı gösterir. Son momentumun sıfır olması, momentum değişiminin sıfır olduğu anlamına gelmez.', link: 'simulasyonlar.html'
    }
  };
  function create() {
    let grade = '', target = '', topic = '', quiz = false;
    const result = (html, chips = menu) => ({html, chips});
    const topics = () => result('Birlikte kısa bir anlatım ve kontrol sorusu yapalım. Konunu seç; diğer fizik konularını da doğrudan yazabilirsin.', Object.keys(lessons));
    const start = () => result('Merhaba! Ben Fizo. Konuyu parçalara ayırabilir, takıldığın adımı bulabilir veya çalışma planını netleştirebiliriz. Önce hangi sınıftasın? İstersen bu adımı atla.', ['9. sınıftayım','10. sınıftayım','11. sınıftayım','12. sınıftayım','Mezunum','Şimdilik atla']);
    const question = () => { quiz = true; const l = lessons[topic]; return result('<b>Birlikte deneyelim · '+topic+'</b><br>'+l.question, [...l.choices, 'İpucu ver', 'Çözümü göster']); };
    function respond(input) {
      let q = input.trim();
      const normalized=q.toLocaleLowerCase('tr').replace(/[çğıöşü]/g,c=>({'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u'}[c])).replace(/[?!.,]+$/,'').trim();
      const aliases={'ohm yasasi nedir':'Ohm yasası','ohm':'Ohm yasası','enerji':'Enerji dönüşümü','momentum':'İtme ve momentum','yansima':'Işığın yansıması','yol ve yer degistirme':'Yol ve yer değiştirme','bana soru sor':'Birlikte çözelim','ipucu':'İpucu ver','anlamadim':'Günlük hayattan örnek','denemem kotu gecti':'Denememi değerlendirelim','nasil calismaliyim':'Bugün başlayalım','motivasyon':'Başlamakta zorlanıyorum','bazilari dogustan yetenekli':'Başlamakta zorlanıyorum'};
      q=aliases[normalized] || [...menu,...modes,...Object.keys(lessons)].find(x=>x.toLocaleLowerCase('tr')===q.toLocaleLowerCase('tr')) || q;
      if(quiz && /^[abc]$/i.test(q))q=lessons[topic].choices[q.toUpperCase().charCodeAt(0)-65];
      if(q === 'Baştan başlayalım'){grade='';target='';topic='';quiz=false;return start();}
      if(q === 'Ana seçenekler' || q === 'Şimdilik atla'){quiz=false;return result('Bugün nereden başlayalım?');}
      const g = q.match(/^(9|10|11|12)\. sınıftayım$/);
      if(g || q === 'Mezunum'){ grade = g ? g[1]+'. sınıf' : 'Mezun'; quiz=false;return result('Tamam, '+grade+' bilgisini bu sohbet boyunca aklımda tutacağım. Şu an önceliğin ne?', ['Okul sınavım','TYT hazırlığı','AYT hazırlığı','Şimdilik atla']); }
      if(['Okul sınavım','TYT hazırlığı','AYT hazırlığı'].includes(q)){target=q;return result('Önceliğimiz '+target.toLocaleLowerCase('tr')+'. Konu anlatımlarını fizik için; çalışma ve deneme değerlendirmesini diğer derslerine de uyarlayabiliriz.');}
      if(menu.includes(q)){quiz=false;}
      if(q === 'Konu öğrenelim' || q === 'Başka konu seç'){quiz=false;topic='';return topics();}
      if(lessons[q]){topic=q;quiz=false;return result('<b>'+q+'</b><br>'+lessons[q].intro, modes);}
      if(modes.includes(q)){
        if(!topic)return topics();
        quiz=false;
        if(q === 'Birlikte çözelim')return question();
        const key = q === modes[0] ? 'intro' : q === modes[1] ? 'example' : 'formula';
        return result('<b>'+topic+'</b><br>'+lessons[topic][key], [...modes.filter(x=>x!==q),'Başka konu seç']);
      }
      if(q === 'Tekrar deneyelim' && topic)return question();
      if(q === 'İpucu ver' || q === 'Çözümü göster' || /^[ABC]\)/.test(q)){
        if(!quiz || !topic)return result('Bu soruyu kapatmıştık. İstersen yeni bir alıştırma açalım.', ['Birlikte çözelim','Başka konu seç','Ana seçenekler']);
        const l=lessons[topic];
        if(q === 'İpucu ver')return result(l.hint, [...l.choices,'Çözümü göster']);
        if(q === 'Çözümü göster' || q === l.choices[l.correct]){
          quiz=false;return result((q === 'Çözümü göster' ? '<b>Adım adım çözüm</b>' : '<b>Doğru! Şimdi nedenine bakalım.</b>')+'<br>'+l.solution+'<br><br><a href="'+l.link+'">Simülasyonla incele →</a>', ['Tekrar deneyelim','Başka konu seç','Ana seçenekler']);
        }
        return result('Henüz değil; nerede ayrıldığımıza bakalım. '+l.hint, [...l.choices,'Çözümü göster']);
      }
      if(q === 'Soruda takıldım'){return result('Cevabı hemen görmek yerine takıldığın adımı bulalım. Hangisi sana daha yakın?', ['Sorunun ne istediğini anlayamıyorum','Formülü seçemiyorum','Şekli yorumlayamıyorum','İşlemde hata yapıyorum']);}
      const difficulties={
        'Sorunun ne istediğini anlayamıyorum':'Önce son cümleyi oku: hangi büyüklük isteniyor? Sonra verilenleri ayrı yaz. “Sabit hız”, “sürtünmesiz”, “duruyor” gibi koşulları işaretle. Sayıları kullanmadan olayı tek cümleyle anlatmayı dene.',
        'Formülü seçemiyorum':'Formül aramadan önce istenen ve bilinen büyüklükleri yaz. Sonra aralarındaki fiziksel ilişkiyi düşün: kuvvet mi, enerji değişimi mi, yük ve akım mı? Bağıntıyı seçince geçerli olduğu koşulu da kontrol et.',
        'Şekli yorumlayamıyorum':'Çizimi sadeleştir. Cismi, hareket yönünü ve eksenleri işaretle; kuvvet ile hız oklarını birbirine karıştırma. Grafikte önce eksen adlarını ve birimlerini oku. Eğim ya da alanın anlamı eksenlerdeki büyüklüklere bağlıdır.',
        'İşlemde hata yapıyorum':'Birimleri önce uyumlu hâle getir. Sayıları en son yerine koy; parantez ve yön işaretlerini ayrı kontrol et. Sonuç büyüklük ve birim olarak makul mü? Yanlış yaptığın işlem adımını not et, yalnızca doğru cevabı değil.'
      };
      if(difficulties[q]){quiz=false;return result('<b>Deneyebileceğin yöntem</b><br>'+difficulties[q]+'<br><br>İstersen şimdi bir fizik örneğinde bu yöntemi uygulayalım.', ['Konu öğrenelim','Bugün başlayalım','Ana seçenekler']);}
      if(q === 'Denememi değerlendirelim'){return result('Tek deneme sonucundan yeteneğin hakkında hüküm vermeyelim. Son denemendeki yanlış ve boşları düşün: en çok hangi nedenle puan kaybettin? Bu yöntem tüm derslerde kullanılabilir.', ['Konu eksiğim var','Biliyorum ama süre yetmiyor','Dikkat hatası yapıyorum','Nedenini bilmiyorum']);}
      const exam={
        'Konu eksiğim var':'Yanlış ve boşlardan aynı konuya ait olanları grupla. Önce bir konuyu seç: kısa tekrar → çözümlü örnek → 5 yeni soru. Ertesi gün aynı beceriyi başka soruyla kontrol et. Sadece çözümü okuyabilmek, tek başına çözebilmekle aynı değildir.',
        'Biliyorum ama süre yetmiyor':'Önce süre tutmadan gerçekten çözebildiğini kontrol et. Sonra küçük bir soru grubunda süre tut ve nerede durduğunu not et. Uzun takıldığın soruyu işaretleyip geçmeyi dene; geri dönme süreni de plana kat.',
        'Dikkat hatası yapıyorum':'“Dikkatsizlik” başlığını parçala: olumsuz ifade mi, birim mi, işaret mi, seçenek aktarımı mı? En sık görülen hata için tek kontrol alışkanlığı seç. Örneğin her soruda istenenin altını çiz; sonraki denemede o hatanın sayısını karşılaştır.',
        'Nedenini bilmiyorum':'Üç yanlışını çözümü kapalıyken yeniden dene. Yine yapamıyorsan konu veya yöntem; süresiz yapabiliyorsan süre yönetimi; soruyu yeniden okuyunca düzeliyorsa okuma/işlem adımlarını incele. Bunlar başlangıç ipuçlarıdır, kesin teşhis değil.'
      };
      if(exam[q]){return result('<b>Sonraki denemeye kadar</b><br>'+exam[q]+'<br><br>Netlerini ve ilerlemeni düzenli kaydetmek için <a href="https://fizo.benfizikyapamiyorum.com/">Fizo uygulamasına geçebilirsin</a>. Bu sayfa hesap verilerine erişmez.', ['Bugün başlayalım','Soruda takıldım','Ana seçenekler']);}
      if(q === 'Bugün başlayalım'){return result('Bugünün hedefi her şeyi bitirmek değil, tamamlanabilir bir adım atmak. Ne kadar zaman ayırabilirsin?', ['15 dakikam var','30 dakikam var','60 dakikam var','Başlamakta zorlanıyorum']);}
      const plans={
        '15 dakikam var':'3 dk: bir konu ve tek hedef seç. 5 dk: kısa anlatım veya bir çözümlü örnek incele. 5 dk: iki soruyu kendin dene. 2 dk: takıldığın yeri ve bir sonraki adımı yaz.',
        '30 dakikam var':'5 dk: önceki yanlışını ve ilgili kavramı incele. 10 dk: örnek çözümü adım adım takip et, sonra kapatıp yeniden kur. 10 dk: yeni sorular dene. 5 dk: yanlış nedenini ve yarın tekrar edeceğin noktayı kaydet.',
        '60 dakikam var':'10 dk: tek konuya odaklı tekrar. 20 dk: bağımsız soru çözümü. 5 dk: mola. 15 dk: yanlış ve boş analizi. 10 dk: çözümü kapatarak yeniden deneme ve ertesi günün kısa tekrarını seçme.',
        'Başlamakta zorlanıyorum':'Bugün kendine yalnızca 5 dakikalık bir başlangıç sözü ver: materyali aç, bir örneği oku, ilk adımı yaz. Bitince devam edip etmemeye karar verebilirsin. Zorlanman “yeteneksizsin” demek değil; hedefi küçülterek başlayabiliriz.'
      };
      if(plans[q]){return result('<b>Bugünün küçük planı</b><br>'+(grade||target ? [grade,target].filter(Boolean).join(' · ')+'<br><br>' : '')+plans[q]+'<br><br>Bu bir başlangıç önerisi; soru zorluğuna ve ihtiyacına göre süreleri değiştirebilirsin.', ['Konu öğrenelim','Planı uyguladım','Ana seçenekler']);}
      if(q === 'Planı uyguladım')return result('Emeğine sağlık! Şimdi kendine iki soru sor: “Neyi artık yardım almadan yapabiliyorum?” ve “Neyi yarın bir kez daha denemeliyim?” İlerlemeni çözdüğün soru sayısıyla birlikte bu iki cevapla değerlendir.', ['Birlikte çözelim','Ana seçenekler']);
      if(q === 'Sitede yol göster')return result('<b>İhtiyacına göre yol seç</b><br>• Deneyerek görmek: <a href="simulasyonlar.html">Fizik simülasyonları</a><br>• Kendini kontrol etmek: <a href="testler.html">Testler</a><br>• Ders kaynakları: <a href="materyaller.html">Materyaller</a><br>• Müfredatı incelemek: <a href="maarif-kazanim-rehberi.html">Kazanım rehberi</a><br>• Düzenli çalışma ve genel YKS takibi: <a href="https://fizo.benfizikyapamiyorum.com/">Fizo uygulaması</a><br><br>Burada kısa rehberlik yapıyoruz; kişisel takip kayıtların bu sohbetten okunmaz.', ['Ana seçenekler','Konu öğrenelim']);
      // A new free-text subject cancels a pending choice; never reuse a stale quiz.
      quiz=false;
      return null;
    }
    return {respond,start};
  }
  root.FizoRehber = {create};
})(typeof window === 'undefined' ? globalThis : window);
