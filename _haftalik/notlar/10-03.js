// 10. sınıf · Not #3 · Enerji biçimleri · FİZ.10.2.3
// Yedi enerji biçimi (mekanik, kimyasal, nükleer, ısı, ışık, ses, elektrik), benzerlik ve farkları, dönüşümler, enerji kaybı.
const { txt, ok, bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki } = require('../lib');

const R = {
  mek: '#0f766e', kim: '#b45309', nuk: '#be123c', isi: '#c2410c', isik: '#a16207', ses: '#2563eb', elk: '#7c3aed', koyu: '#1d2b53',
};

// --- SVG yardımcıları ---
const svg = (w, h, b, mm) => `<svg class="sk" viewBox="0 0 ${w} ${h}" style="width:${mm || w * 0.22}mm;max-width:100%">${b}</svg>`;

// Yedi enerji biçimi kartları (4 + 3)
function fKartlar(mm) {
  const K = [['Mekanik', 'hareket ve konum', R.mek], ['Kimyasal', 'bağlarda depolanır', R.kim], ['Nükleer', 'atom çekirdeğinden', R.nuk], ['Isı', 'sıcaklık farkıyla geçer', R.isi],
    ['Işık', 'boşlukta da yayılır', R.isik], ['Ses', 'madde ortamı ister', R.ses], ['Elektrik', 'yüklerin hareketi', R.elk]];
  const w = 176, h = 74, g = 12;
  let b = '';
  K.forEach(([ad, alt, c], i) => {
    const sat = i < 4 ? 0 : 1, sut = i < 4 ? i : i - 4;
    const x = 8 + sut * (w + g) + (sat ? (w + g) / 2 : 0), y = 8 + sat * (h + g);
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="11" fill="#fff" stroke="${c}" stroke-width="2.6"/><rect x="${x}" y="${y}" width="10" height="${h}" rx="5" fill="${c}"/>`;
    b += txt(x + 22, y + 32, ad, { c, size: 22, a: 'start', halo: false }) + txt(x + 22, y + 58, alt, { c: '#334155', size: 15, w: 700, a: 'start', halo: false });
  });
  return svg(4 * w + 3 * g + 16, 2 * h + g + 16, b, mm);
}

// Dönüşüm zinciri: kutular soldan sağa; alt satır enerji biçimi, oklarda isteğe bağlı etiket
function zincir(f) {
  const bw = f.bw || 150, bh = f.bh || 80, gap = f.gap || 54, n = f.items.length, top = f.okEt ? 26 : 8;
  let b = '';
  f.items.forEach((it, i) => {
    const x = 8 + i * (bw + gap), y = top;
    b += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="12" fill="#fff" stroke="${it.c || R.koyu}" stroke-width="2.6"/>`;
    b += txt(x + bw / 2, y + 33, it.ust, { c: R.koyu, size: it.us || 18, halo: false });
    b += txt(x + bw / 2, y + 61, it.alt, { c: it.c || R.koyu, size: it.as || 17, halo: false });
    if (i < n - 1) {
      b += ok(x + bw + 6, y + bh / 2, x + bw + gap - 6, y + bh / 2, '#334155', 3.2, 12);
      if (f.okEt && f.okEt[i]) b += txt(x + bw + gap / 2, y - 8, f.okEt[i], { c: '#475569', size: 14, w: 700, halo: false });
    }
  });
  return svg(16 + n * bw + (n - 1) * gap, top + bh + 8, b, f.width);
}

// Ölçekli enerji şeritleri: her satır, J ile orantılı parçalar. s = px / J
function serit(f) {
  const s = f.s, L = f.L || 120, rh = 52, top = 12;
  let b = '', y = top, maxW = 0;
  f.rows.forEach(r => {
    b += txt(L - 12, y + rh / 2 + 6, r.lab, { c: R.koyu, size: 22, a: 'end', halo: false });
    let x = L;
    const alt = [];
    r.seg.forEach(sg => {
      const w = sg.J * s;
      b += `<rect x="${x}" y="${y}" width="${w}" height="${rh}" fill="${sg.c}" opacity="${sg.o || 0.9}" stroke="#fff" stroke-width="2"/>`;
      const et = sg.et || `${sg.t} ${sg.J} J`;
      if (w >= et.length * 10.6 + 14) b += txt(x + w / 2, y + rh / 2 + 7, et, { c: '#fff', size: 20, halo: false });
      else alt.push([x + w / 2, et, sg.c]);
      x += w;
    });
    maxW = Math.max(maxW, x);
    y += rh;
    if (alt.length) {
      let sonX = -1e9;
      alt.forEach(([cx, et, c]) => {
        const ew = et.length * 10;
        let tx = Math.max(cx, sonX + ew / 2 + 10);
        b += `<line x1="${cx}" y1="${y}" x2="${cx}" y2="${y + 10}" stroke="${c}" stroke-width="1.6"/>`;
        b += txt(tx, y + 31, et, { c, size: 19, halo: false, a: 'middle' });
        sonX = tx + ew / 2;
      });
      y += 40;
    }
    y += f.ara || 14;
  });
  if (f.olcek) b += txt(maxW, y + 6, f.olcek, { size: 15, w: 600, c: '#64748b', a: 'end', halo: false });
  return svg(Math.max(maxW, L + 200) + 44, y + (f.olcek ? 12 : 0), b, f.width);
}

// --- Şekiller ---
const fRuzgar = (w) => zincir({ width: w, bw: 140, gap: 46, items: [
  { ust: 'Rüzgâr', alt: 'mekanik', c: R.mek }, { ust: 'Türbin kanadı', alt: 'mekanik', c: R.mek, us: 16 },
  { ust: 'Jeneratör', alt: 'elektrik', c: R.elk }, { ust: 'Kablolar', alt: 'elektrik', c: R.elk }, { ust: 'Ütü', alt: 'ısı', c: R.isi }] });
const fFan = (w) => serit({ width: w, s: 5.6, L: 128, olcek: 'Uzunluklar enerjiyle orantılı', rows: [
  { lab: 'Giren', seg: [{ J: 100, t: 'Elektrik', c: R.elk }] },
  { lab: 'Çıkan', seg: [{ J: 70, t: 'Hareket (hava)', c: R.mek }, { J: 25, t: 'Isı', c: R.isi }, { J: 5, t: 'Ses', c: R.ses }] }] });
const fGunes = (w) => zincir({ width: w, bw: 150, gap: 44, okEt: ['ışık', '', ''], items: [
  { ust: 'Güneş', alt: 'nükleer', c: R.nuk }, { ust: 'Buğday', alt: 'kimyasal', c: R.kim },
  { ust: 'Ekmek', alt: 'kimyasal', c: R.kim }, { ust: 'Yürüyen sen', alt: 'mekanik + ısı', c: R.mek, as: 16 }] });
const fAmpul = (w) => serit({ width: w, s: 9, L: 96, olcek: 'Her saniye · uzunluklar enerjiyle orantılı', rows: [
  { lab: 'Akkor', seg: [{ J: 3, t: 'Işık', c: R.isik }, { J: 57, t: 'Isı', c: R.isi }] },
  { lab: 'LED', seg: [{ J: 3, t: 'Işık', c: R.isik }, { J: 6, t: 'Isı', c: R.isi }] }] });
const fS3 = (w) => zincir({ width: w, bw: 168, gap: 70, okEt: ['gündüz', 'gece'], items: [
  { ust: 'Güneş paneli', alt: '?', c: R.koyu }, { ust: 'Akü', alt: '?', c: R.koyu }, { ust: 'Sokak lambası', alt: '?', c: R.koyu }] });
const fS4 = (w) => serit({ width: w, s: 1.12, L: 96, olcek: 'Her saniye · uzunluklar enerjiyle orantılı', rows: [
  { lab: 'Giren', seg: [{ J: 500, t: 'Elektrik', c: R.elk }] },
  { lab: 'Çıkan', seg: [{ J: 400, t: 'Hareket', c: R.mek }, { J: 80, et: 'Isı ?', c: R.isi }, { J: 20, t: 'Ses', c: R.ses }] }] });
const fS9 = (w) => zincir({ width: w, bw: 142, gap: 44, items: [
  { ust: 'Baraj gölü', alt: 'su yüksekte', c: R.mek, as: 15 }, { ust: 'Boru', alt: 'su akar', c: R.mek, as: 15 },
  { ust: 'Türbin', alt: 'döner', c: R.mek, as: 15 }, { ust: 'Jeneratör', alt: '', c: R.elk }, { ust: 'Şehir', alt: 'lambalar', c: R.isik, as: 15 }] });

// --- PDF gövdesi ---
const govde = [
  bolum(1, 'Yedi enerji biçimi', `
${sekil(fKartlar(150), 'Ders kitabında incelenen yedi enerji biçimi.')}
<table class="t"><tr><th>Biçim</th><th>Nereden gelir?</th><th>Örnek</th></tr>
<tr><td><b>Mekanik</b></td><td>Cismin hareketinden (kinetik) ve konumundan (potansiyel). İkisinin toplamı.</td><td>Yokuştan inen bisiklet, kurulmuş oyuncak arabanın yayı.</td></tr>
<tr><td><b>Kimyasal</b></td><td>Moleküllerdeki bağlarda depolanır, kimyasal tepkimeyle açığa çıkar.</td><td>Besinler, odun, benzin, pil.</td></tr>
<tr><td><b>Nükleer</b></td><td>Atom çekirdeğinden. Çekirdekler bölünür ya da birleşir.</td><td>Güneş’te hafif çekirdeklerin birleşmesi, santralde uranyum.</td></tr>
<tr><td><b>Isı</b></td><td>Sıcaklıkları farklı maddeler arasında aktarılan enerji. Sıcaktan soğuğa geçer.</td><td>Sıcak çaydan bardağa ve ele geçen enerji.</td></tr>
<tr><td><b>Işık</b></td><td>Bir kaynaktan çıkar, dalgalar hâlinde yayılır.</td><td>Güneş ışığı, lamba, ekran.</td></tr>
<tr><td><b>Ses</b></td><td>Titreşen maddeden çıkar, ortamdaki taneciklerin titreşimiyle yayılır.</td><td>Hoparlör, gök gürültüsü.</td></tr>
<tr><td><b>Elektrik</b></td><td>İletkendeki yüklerin hareketinden.</td><td>Prizden çekilen enerji, yıldırım.</td></tr></table>`),

  bolum(2, 'Benzerlikler ve farklar', `
${kutu('ana', 'Hepsinin ortak özellikleri', 'Birimi <b>joule (J)</b>’dür. Hepsi bir <b>kaynaktan</b> elde edilir. Hepsi başka biçimlere <b>dönüşebilir</b>.')}
<table class="t"><tr><th>Farkın türü</th><th>Örnekler</th></tr>
<tr><td><b>Depolanabilir</b></td><td>Kimyasal (besin, yakıt, pil), nükleer (uranyum yakıt), mekanik (barajda tutulan su, gerilmiş yay).</td></tr>
<tr><td><b>Aktarılırken ortaya çıkar</b></td><td>Isı sıcaklık farkı oldukça geçer, ışık ve ses bir kaynaktan yayılır, elektrik kablolarla taşınır.</td></tr>
<tr><td><b>Ortam ister mi?</b></td><td>Ses madde ortamı (katı, sıvı, gaz) ister, boşlukta yayılmaz. Işık boşlukta da yayılır; Güneş ışığı uzaydan geçerek gelir.</td></tr>
<tr><td><b>Kullanım kolaylığı</b></td><td>Elektrik enerjisi uzağa kolay taşınır ve başka biçimlere kolay dönüşür; bu yüzden en çok kullanılan biçimdir.</td></tr></table>`),

  bolum(3, 'Enerji dönüşümleri', `
<p>Enerji bir biçimden başka bir biçime dönüşür. Dönüşümde bir biçim azalırken başka bir biçim artar. Aşağıda rüzgârdan ütüye giden yol var:</p>
${sekil(fRuzgar(160), 'Rüzgâr santralinden eve: mekanik → elektrik → ısı.')}
${kutu('ana', 'Zinciri yazarken', 'Her kutuda enerjinin <b>o anki biçimini</b> yaz, araya ok koy: mekanik → elektrik → ısı. Cihazın adını değil, enerjinin biçimini yazarsın. Cihazın <b>yapılış amacı</b> asıl dönüşümü söyler: ütü ısı için, lamba ışık için, hoparlör ses için yapılır.')}`),

  bolum(4, 'Enerji yok olmaz: kayıp nereye gider?', `
<div class="ikili s"><div>${sekil(fFan(88), 'Vantilatör: her 100 J elektrik enerjisinin dağılımı.')}</div><div>
<p>Vantilatör 100 J elektrik enerjisi alıyor. 70 J havayı hareket ettiriyor (istenen), 25 J motoru ısıtıyor, 5 J sese dönüşüyor.</p>
<p>Toplam: $70 + 25 + 5 = 100$ J. <b>Giren enerji = çıkan enerjilerin toplamı.</b></p></div></div>
${kutu('sari', 'Enerji kaybı ne demek?', 'Enerji yok olmaz, yoktan da var olmaz. “Kayıp”, enerjinin istemediğimiz biçimlere dönüşmesidir; çoğunlukla <b>ısı</b>, bazen <b>ses</b>. Çalışan cihazların ısınması bundandır.')}`),

  hatalar([
    ['Cihaz çalışırken enerjinin bir kısmı yok olur.', 'Yok olmaz; istenmeyen biçimlere (çoğunlukla ısı, ses) dönüşür. Giren enerji, çıkanların toplamına eşittir.'],
    ['Pil elektrik enerjisi depolar.', 'Pil kimyasal enerji depolar. Devre kapanınca kimyasal enerji elektrik enerjisine dönüşür.'],
    ['Uzayda bir patlama hem görülür hem duyulur.', 'Işık boşlukta yayılır, görülür. Ses madde ortamı ister, boşlukta duyulmaz.'],
    ['Isı ile sıcaklık aynı şeydir.', 'Isı, sıcaklık farkı yüzünden aktarılan enerjidir ve joule ile ölçülür. Sıcaklık bir enerji değildir.'],
    ['Zincirde cihaz adlarını sıralamak yeterlidir.', 'Her adımda enerjinin biçimini yaz: kimyasal → elektrik → ışık. “Pil → kablo → lamba” bir enerji zinciri değildir.'],
  ]),

  ornek(1, 'ENERJİNİN YOLCULUĞU', `
${sekil(fGunes(140))}
<p><b>Güneş:</b> çekirdeklerin birleşmesiyle nükleer enerji açığa çıkar, ışık olarak Dünya’ya ulaşır. <b>Buğday:</b> fotosentezle ışık enerjisini kimyasal enerji olarak depolar. <b>Ekmek:</b> bu kimyasal enerjiyi taşır. <b>Sen:</b> ekmeği yiyip yürürken kimyasal enerji mekanik enerjiye ve ısıya dönüşür.</p>
<p>Zincir: <b>nükleer → ışık → kimyasal → mekanik + ısı.</b> Yürürken vücudunun ısınması enerji kaybının bir örneğidir.</p>`),

  ornek(2, 'AKKOR AMPUL Mİ, LED Mİ?', `
<div class="ikili s"><div>${sekil(fAmpul(84))}</div><div>
<p>İki ampul her saniye aynı miktarda, 3 J ışık veriyor. Akkor ampul her saniye 60 J, LED ampul 9 J elektrik enerjisi alıyor.</p>
<p>Isıya giden: akkor $60 - 3 = 57$ J, LED $9 - 3 = 6$ J. Akkor her saniye $57 - 6 = 51$ J daha fazla ısı üretir.</p>
<p>1 saatte (3600 s) fark: $51 \\cdot 3600 = 183\\,600$ J. Aynı ışık için harcanan bu fazla enerjinin hepsi ısıya gider.</p></div></div>`),

  `<h2 class="b"><span class="n">?</span>Sorular</h2>`,
  soru(1, { metin: 'Üç enerji biçiminin birer özelliği verilmiştir.<br>I. Atom çekirdeklerinin bölünmesi ya da birleşmesiyle açığa çıkar.<br>II. Yayılmak için madde ortamı gerekir.<br>III. Sıcaklıkları farklı maddeler arasında aktarılır.', kok: 'I, II ve III hangi enerji biçimleridir?', k: 3,
    siklar: ['Nükleer, ses, ısı', 'Kimyasal, ışık, ısı', 'Nükleer, ışık, elektrik', 'Kimyasal, ses, mekanik', 'Nükleer, ses, elektrik'] }),
  soru(2, { metin: 'Enerji birçok maddede ya da cisimde depolanmış olarak bulunur.', kok: 'Aşağıdakilerin hangisinde depolanan enerji kimyasal enerji değildir?', k: 5,
    siklar: ['Ekmek', 'Benzin', 'Telefon bataryası', 'Odun', 'Gerilmiş ok yayı'] }),
  soru(3, { metin: 'Bir sokak lambası gündüz güneş paneliyle aküsünü şarj ediyor, gece aküden çalışıyor.', sekil: fS3(118),
    kok: 'Panele gelen ışıktan gece lambadan çıkan ışığa kadar enerjinin geçtiği biçimler sırasıyla hangisidir?', k: 1,
    siklar: ['ışık → kimyasal → elektrik → ışık', 'ışık → elektrik → kimyasal → elektrik → ışık', 'ısı → elektrik → kimyasal → ışık', 'ışık → elektrik → ışık', 'elektrik → kimyasal → ışık'] }),
  soru(4, { metin: 'Elektrikli bir scooter’ın motoru her saniye 500 J elektrik enerjisi alıyor. Şekilde bu enerjinin dağılımı ölçekli gösterilmiştir.', sekil: fS4(118),
    kok: 'Motorda her saniye kaç J enerji ısıya dönüşür?', k: 5, siklar: ['20 J', '60 J', '80 J', '100 J', '420 J'] }),
  soru(5, { metin: 'Ay yüzeyindeki bir astronot, uzaktaki bir aracın lambalarının yanıp söndüğünü görüyor ama aracın hiçbir sesini duymuyor.<br>I. Işık boşlukta yayılabilir.<br>II. Ses yayılmak için madde ortamı ister.<br>III. Aracın motoru çalışmıyordur.', kok: 'Astronotun bu gözlemi yargılardan hangileriyle kesin olarak açıklanır?', k: 5,
    siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'] }),
  soru(6, { metin: 'Bazı araçlarda gerçekleşen asıl enerji dönüşümleri verilmiştir.', kok: 'Hangisi yanlıştır?', k: 1,
    siklar: ['Ütü: elektrik → ısı', 'Hoparlör: elektrik → ses', 'Gaz ocağı: kimyasal → ısı', 'Santraldeki jeneratör: elektrik → mekanik', 'Şarj olan telefon: elektrik → kimyasal'] }),
  soru(7, { metin: 'Bütün enerji biçimleri için şu yargılar veriliyor:<br>I. Birimi joule’dür.<br>II. Boşlukta yayılabilir.<br>III. Başka enerji biçimlerine dönüşebilir.', kok: 'Hangileri doğrudur?', k: 5,
    siklar: ['Yalnız I', 'Yalnız III', 'I ve III', 'I ve II', 'I, II ve III'] }),
  soru(8, { metin: 'Bir el fenerinin pili belirli bir sürede 1200 J kimyasal enerji harcıyor. Bunun 1080 J’si devreye elektrik enerjisi olarak geçiyor, kalanı pilde ısıya dönüşüyor. LED, aldığı elektrik enerjisinin 360 J’sini ışığa, kalanını ısıya dönüştürüyor.', kok: 'Bu sürede toplam kaç J ısı açığa çıkar?', k: 5,
    siklar: ['720 J', '840 J', '120 J', '360 J', '1080 J'] }),
  soru(9, { metin: 'Bir hidroelektrik santralde enerji şekildeki sırayla şehre ulaşıyor.', sekil: fS9(150),
    ek: '<p>I. Baraj gölündeki su, konumundan dolayı mekanik enerjiye sahiptir.<br>II. Türbinde elektrik enerjisi mekanik enerjiye dönüşür.<br>III. Jeneratörde mekanik enerji elektrik enerjisine dönüşür.</p><p><b>Yargılarından hangileri doğrudur?</b></p>' +
      '<div class="siklar" style="--k:5"><span><b>A)</b>Yalnız I</span><span><b>B)</b>Yalnız III</span><span><b>C)</b>I ve II</span><span><b>D)</b>II ve III</span><span><b>E)</b>I ve III</span></div>' }),
  soru(10, { metin: '<b>Açık uçlu.</b> Bir öğrenci bisikletine dinamolu LED far takıyor. Pedal çevirdikçe tekerleğe sürtünen dinamo dönüyor ve far yanıyor. Dinamoya her saniye 6 J mekanik enerji aktarılıyor; dinamo bunun 3 J’sini elektrik enerjisine dönüştürüyor. Far, aldığı elektrik enerjisinin 1 J’sini ışığa dönüştürüyor. Kayıpların hepsi ısıya gidiyor.',
    kok: 'a) Öğrencinin yediği besinden farın ışığına kadar enerji dönüşüm zincirini yazınız. b) Dinamo ve farda her saniye toplam kaç J enerji ısıya dönüşür? 1 dakikada kaç J olur? c) Arkadaşı “Far yanarken enerji yok oluyor.” diyor. Haklı mı? Açıklayınız.' }),

  cevaplar([
    ['A', 'Çekirdekten gelen: nükleer. Ortam isteyen: ses. Sıcaklık farkıyla aktarılan: ısı.'],
    ['E', 'Ekmek, benzin, batarya ve odun kimyasal enerji depolar. Gerilmiş yay, şeklinin değişmesinden dolayı mekanik (potansiyel) enerji depolar.'],
    ['B', 'Panel: ışık → elektrik. Gündüz akü şarj olur: elektrik → kimyasal. Gece akü boşalır: kimyasal → elektrik. Lamba: elektrik → ışık.'],
    ['C', 'Giren = çıkanların toplamı: $500 = 400 + Q + 20$, $Q = 80$ J. (100 J, sesi unutanların cevabı.)'],
    ['C', 'Işığın gelmesi I’i, sesin gelmemesi II’yi açıklar. Motor çalışsa bile ses Ay’da yayılmaz; III kesin değildir.'],
    ['D', 'Jeneratör dönme hareketini elektriğe çevirir: mekanik → elektrik. Ters yazılmış.'],
    ['C', 'Birim joule ve dönüşebilme ortaktır. Ses boşlukta yayılmaz; II hepsi için doğru değildir.'],
    ['B', 'Pilde ısı: $1200 - 1080 = 120$ J. LED’de ısı: $1080 - 360 = 720$ J. Toplam: $120 + 720 = 840$ J.'],
    ['E', 'Yüksekteki su konumundan dolayı mekanik enerjiye sahiptir (I). Türbinde akan suyun mekanik enerjisi türbinin dönme hareketine geçer; elektrik oluşmaz (II yanlış). Jeneratör: mekanik → elektrik (III).'],
    ['–', 'a) Kimyasal (besin) → mekanik (kaslar, pedal, tekerlek) → elektrik (dinamo) → ışık (far); her adımda bir kısmı ısıya gider. b) Dinamoda $6 - 3 = 3$ J, farda $3 - 1 = 2$ J; toplam 5 J her saniye. 1 dakikada $5 \\cdot 60 = 300$ J. c) Haklı değil. Enerji yok olmaz; ışık ve ısı olarak çevreye yayılır. Her saniye giren 6 J = 1 J ışık + 5 J ısı.'],
  ]),
  sonraki('Mekanik enerji: kinetik ve potansiyel enerji'),
].join('\n');

// --- Instagram slaytları (kapak ve son CTA otomatik) ---
const slaytlar = [
  { pill: '7 BİÇİM', h: 'Enerjinin <em>yedi biçimi</em>', svg: fKartlar(), bd: 'Hepsinin birimi <b>joule</b>. Hepsi bir kaynaktan gelir, hepsi <b>birbirine dönüşebilir</b>.' },
  { pill: 'DEPOLA, TAŞI', h: 'Hangisi <em>depolanır?</em>', lst: ['<b>Kimyasal:</b> besin, yakıt, pil', '<b>Nükleer:</b> uranyum yakıt', '<b>Mekanik:</b> barajdaki su, gerilmiş yay', '<b>Isı, ışık, ses, elektrik:</b> aktarılırken ortaya çıkar'] },
  { pill: 'UZAYDA', h: 'Uzayda patlama <em>duyulur mu?</em>', lst: ['<b>Işık</b> boşlukta da yayılır: patlamayı <b>görürsün</b>.', '<b>Ses</b> madde ortamı ister: <b>duymazsın</b>.', 'Güneş’in ışığı gelir, sesi gelmez.'] },
  { pill: 'DÖNÜŞÜM', h: 'Ekmeğin enerjisi <em>nereden geliyor?</em>', svg: fGunes(), bd: '<b>nükleer → ışık → kimyasal → mekanik + ısı</b>. Yürüdüğün enerji Güneş’in çekirdeğinden başladı.' },
  { pill: 'KORUNUM', h: 'Enerji <em>yok olmaz</em>', svg: fFan(), bd: 'Vantilatör: $100 = 70 + 25 + 5$ J. “Kayıp”, istenmeyen biçimlere dönüşen enerjidir: çoğunlukla <b>ısı</b>.' },
  { pill: 'DİKKAT', h: 'En sık 3 <em>hata</em>', lst: ['<span class="x">✗</span> Pil elektrik depolar. <span class="v">✓</span> Kimyasal enerji depolar.', '<span class="x">✗</span> Enerji cihazda yok olur. <span class="v">✓</span> Isıya, sese dönüşür.', '<span class="x">✗</span> Pil → kablo → lamba bir zincirdir. <span class="v">✓</span> Biçim yaz: kimyasal → elektrik → ışık.'] },
  { pill: 'SIRA SENDE', h: 'Scooter motorunda <em>kaç J ısıya</em> dönüşür?', svg: fS4(), bd: 'Her saniye: &nbsp;<b>A)</b> 20 &nbsp;<b>B)</b> 60 &nbsp;<b>C)</b> 80 &nbsp;<b>D)</b> 100 &nbsp;<b>E)</b> 420 J', bant: ['Cevabını yorumlara yaz 👇', 'Çözüm PDF’te'] },
  { pill: 'GÜNLÜK HAYATTA', h: 'Akkor mu, <em>LED mi?</em>', svg: fAmpul(), bd: 'İkisi de saniyede <b>3 J ışık</b> veriyor. Akkor <b>57 J</b>, LED <b>6 J</b> ısı üretiyor. Aynı ışık için LED her saniye <b>51 J</b> daha az ısı üretir.' },
];

module.exports = {
  sinif: 10, no: 3, gun: 'Çarşamba',
  slug: '10-fizik-notlari-3-enerji-bicimleri',
  konuKisa: 'Enerji biçimleri',
  pdfBaslik: 'Enerji Biçimleri ve Dönüşümleri',
  baslik: 'Enerji Biçimleri ve Dönüşümleri',
  alt: 'Yedi enerji biçimi, benzerlik ve farkları, dönüşüm zincirleri ve enerji kaybı. Konu özeti, sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
  slaytBaslik: 'Enerji <span style="color:#e9a400">biçimleri</span> ve dönüşümleri',
  slaytAlt: 'Yedi biçim, dönüşüm zincirleri, kayıp enerji nereye gider?',
  promoKonu: 'Enerji',
  pdfOzet: 'Özet, 5 sık hata, 2 çözümlü örnek, <b>10 soru ve çözümleri.</b>',
  govde, slaytlar,
  aciklama: `
Uzayda bir patlama olsa duyar mıydın? 🤔 Kaydır, 30 saniyede öğren.

Kaydırınca: enerjinin yedi biçimi, hangisi depolanır, ses ve ışığın farkı, ekmeğin enerjisinin Güneş’ten gelen yolculuğu, enerji neden yok olmaz, en sık 3 hata, bir mini soru ve akkor ile LED ampul karşılaştırması.

Notun tamamı ücretsiz PDF: özet, 5 sık hata, 2 çözümlü örnek, 10 soru ve çözümleri.
1) Takip et
2) Profildeki linke dokun
3) 10. sınıf bölümünden notu indir (üyelik yok)

7. slayttaki sorunun cevabını yorumlara yaz 👇
Her Çarşamba 10. sınıf için yeni not.

#10sınıf #10sınıffizik #maarifmodeli #fizik #fiziknotları #enerji #enerjibiçimleri #enerjidönüşümü #benfizikyapamiyorum`,
  ilkYorum: '📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf · 7. slaytın cevabı PDF’in çözüm sayfasında. Gelecek hafta: kinetik ve potansiyel enerji.',
  hub: {
    etiket: '10. SINIF · MAARİF MODELİ · NOT #3',
    baslik: 'Enerji biçimleri ve dönüşümleri',
    aciklama: 'Yedi enerji biçimi, benzerlik ve farkları, dönüşüm zincirleri, enerji kaybı. Sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
    takvimLink: 'Not #3 · Enerji biçimleri ↓',
    tarih: '2026-11-25',
    devam: { href: '/10-sinif-fizik-paketi.html', img: '/img/fizik10/set.webp', lab: 'not10_yap', b: 'Devamı: Yapabilirim 10 · Enerji', span: 'Konu notu, kavram kartları, yeni nesil sorular, adım adım çözümler', em: '₺599 →' },
  },
};
