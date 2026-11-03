// 9. sınıf · Not #2 · Vektörler (1/4) · FİZ.9.2.3 (+ aynı doğrultuda toplama, FİZ.9.2.4'e giriş)
const { kare, dogru, bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki } = require('../lib');

const MAVI = '#2563eb', TURUNCU = '#ea580c', YESIL = '#0f766e', MOR = '#7c3aed', GRI = '#475569', KIRMIZI = '#be185d';

// --- Şekiller ---
const fOku = (w) => kare({ cols: 13, rows: 5, s: 30, width: w, olcek: true,
  vecs: [
    { x: 1, y: 1.5, dx: 4, dy: 0, lab: 'A', c: MAVI, lp: 'u' },
    { x: 7, y: 1, dx: 0, dy: 3, lab: 'B', c: TURUNCU, lp: 'r' },
    { x: 9.5, y: 1, dx: 2, dy: 2, lab: 'C', c: YESIL },
  ],
  notes: [{ x: 1, y: 0.75, t: 'başlangıç', c: MAVI, size: 12 }, { x: 5, y: 0.75, t: 'uç', c: MAVI, size: 12 }],
});
const fEsit = (w) => kare({ cols: 15, rows: 5, s: 28, width: w, olcek: true,
  vecs: [
    { x: 1, y: 1, dx: 3, dy: 2, lab: 'A', c: MAVI },
    { x: 5, y: 2, dx: 3, dy: 2, lab: 'B', c: MAVI },
    { x: 11, y: 3, dx: -3, dy: -2, lab: 'C', c: TURUNCU },
    { x: 12, y: 1, dx: 2, dy: 3, lab: 'D', c: GRI, lp: 'l' },
  ],
});
const fKat = (w) => kare({ cols: 12, rows: 6, s: 28, width: w, olcek: true,
  cizgi: [{ x1: 6, y1: 0, x2: 6, y2: 6, c: '#94a3b8' }],
  vecs: [
    { x: 6, y: 5.5, dx: 2, dy: 0, lab: 'A', c: MAVI, lp: 'tip', it: false },
    { x: 6, y: 4.5, dx: 4, dy: 0, lab: '2A', c: YESIL, lp: 'tip', it: false },
    { x: 6, y: 3.5, dx: 1, dy: 0, lab: '½A', c: MOR, lp: 'tip', it: false },
    { x: 6, y: 2.5, dx: -2, dy: 0, lab: '−A', c: TURUNCU, lp: 'tip', it: false },
    { x: 6, y: 1.5, dx: -3, dy: 0, lab: '−1,5A', c: KIRMIZI, lp: 'tip', it: false },
  ],
});
const fTopla = (w) => dogru({ min: -1, max: 7, s: 40, width: w,
  rows: [{ x0: 0, d: 5, lab: 'A = 5 birim sağa', c: MAVI }, { x0: 5, d: -3, lab: 'B = 3 birim sola', c: TURUNCU }],
  R: { x0: 0, d: 2, lab: 'R = 2 birim sağa', c: '#0f172a' } });
const fOrn1 = (w) => kare({ cols: 11, rows: 4, s: 28, width: w, olcek: true,
  vecs: [
    { x: 1, y: 3, dx: 2, dy: 0, lab: 'K', c: MAVI, lp: 'u' },
    { x: 5, y: 3, dx: 4, dy: 0, lab: 'L', c: YESIL, lp: 'u' },
    { x: 8, y: 1, dx: -3, dy: 0, lab: 'M', c: TURUNCU, lp: 'u' },
  ],
});
const fS1 = (w) => kare({ cols: 15, rows: 6, s: 28, width: w,
  vecs: [
    { x: 1, y: 1, dx: 2, dy: 1, lab: 'K', c: MAVI },
    { x: 4, y: 3, dx: 4, dy: 2, lab: 'L', c: YESIL },
    { x: 9, y: 2, dx: -2, dy: -1, lab: 'M', c: TURUNCU },
    { x: 14, y: 4, dx: -4, dy: -1, lab: 'N', c: MOR },
  ],
});
const fS6 = kare({ cols: 9, rows: 3, s: 30, width: 66,
  vecs: [{ x: 1, y: 2, dx: 2, dy: 0, lab: 'P', c: MAVI, lp: 'u' }, { x: 8, y: 1, dx: -5, dy: 0, lab: 'R', c: TURUNCU, lp: 'u' }] });
const fS10 = kare({ cols: 12, rows: 7, s: 26, width: 64, vecs: [{ x: 5, y: 3, dx: 2, dy: 2, lab: 'A', c: MAVI }] });

// --- PDF gövdesi ---
const govde = [
  bolum(1, 'Vektörü kareli düzlemde okumak', `
<p>Vektör bir okla gösterilir. Kareli düzlemde her özelliğini doğrudan okuyabilirsin:</p>
<div class="ikili s"><div>${sekil(fOku(78))}</div>
<table class="t"><tr><th>Özellik</th><th>Nasıl okunur?</th></tr>
<tr><td><b>Başlangıç noktası</b></td><td>Okun kuyruğu (nokta)</td></tr>
<tr><td><b>Büyüklük</b></td><td>Okun boyu; yatay ya da düşeyse kare say. A = 4 birim, B = 3 birim.</td></tr>
<tr><td><b>Doğrultu</b></td><td>Okun üzerinde durduğu doğru: yatay, düşey ya da eğik (C).</td></tr>
<tr><td><b>Yön</b></td><td>Ok ucunun gösterdiği taraf: A sağa, B yukarı.</td></tr></table></div>
<p>Bir doğrultunun <b>iki yönü</b> vardır: yatay doğrultuda sağa ve sola, düşey doğrultuda yukarı ve aşağı.</p>`),

  bolum(2, 'Eşit ve zıt vektörler', `
${sekil(fEsit(118), 'A ve B eşit; C, A’nın zıt vektörü. D’nin boyu A ile aynı ama doğrultusu farklı.')}
<div class="ikili">
${kutu('ana', 'Eşit vektörler', 'Büyüklükleri, doğrultuları ve yönleri aynıdır: $\\vec A = \\vec B$. Nerede çizildikleri önemli değildir; bir vektörü boyunu ve yönünü bozmadan kaydırabilirsin.')}
${kutu('ana', 'Zıt vektörler', 'Büyüklükleri ve doğrultuları aynı, yönleri terstir: $\\vec C = -\\vec A$. Bir vektörle zıttının toplamı <b>sıfır vektördür</b>.')}
</div>
<p>D’nin boyu A ile aynıdır ($3$ sağa $2$ yukarı yerine $2$ sağa $3$ yukarı), ama doğrultusu farklı olduğu için A’ya eşit değildir.</p>`),

  bolum(3, 'Vektörü reel sayıyla çarpmak', `
<div class="ikili s"><div>${sekil(fKat(80), 'Hepsi yatay doğrultuda; dikey çizgi ortak başlangıç.')}</div>
<table class="t"><tr><th>$k$</th><th>$k\\vec A$’nın büyüklüğü</th><th>Yönü</th></tr>
<tr><td>$k = 2$</td><td>A’nın 2 katı</td><td>A ile aynı</td></tr>
<tr><td>$k = \\tfrac12$</td><td>A’nın yarısı</td><td>A ile aynı</td></tr>
<tr><td>$k = -1$</td><td>A ile eşit</td><td>A’ya ters</td></tr>
<tr><td>$k = -1{,}5$</td><td>A’nın 1,5 katı</td><td>A’ya ters</td></tr>
<tr><td>$k = 0$</td><td>sıfır</td><td>yön yok</td></tr></table></div>
${kutu('sari', 'Kural', 'Vektör bir $k$ sayısıyla çarpılınca doğrultusu değişmez. Büyüklüğü $|k|$ katına çıkar. $k$ pozitifse yön aynı kalır, negatifse ters döner.')}`),

  bolum(4, 'Aynı doğrultudaki vektörleri toplamak ve çıkarmak', `
<p>Toplamanın sonucu olan vektöre <b>bileşke vektör</b> denir ve $\\vec R$ ile gösterilir. İkinci vektörün başlangıcını birincinin ucuna koyarsın (uç uca ekleme); bileşke, ilk başlangıçtan son uca çizilir.</p>
<div class="ikili s"><div>${sekil(fTopla(84))}</div>
<table class="t"><tr><th>Durum</th><th>Bileşkenin büyüklüğü ve yönü</th></tr>
<tr><td>Aynı yönde</td><td>Büyüklükler toplanır; yön ortak yön.</td></tr>
<tr><td>Ters yönde</td><td>Büyük olandan küçük çıkarılır; yön büyük olanın yönü.</td></tr>
<tr><td>Zıt (eşit ve ters)</td><td>Bileşke sıfır vektör.</td></tr></table></div>
${kutu('ana', 'İşaretle hesapla', 'Bir yönü $+$ (örneğin sağ), tersini $-$ seç. Şekilde $R = (+5) + (-3) = +2$, yani 2 birim sağa.')}
${kutu('ana', 'Çıkarma = zıttını ekleme', '$\\vec A - \\vec B = \\vec A + (-\\vec B)$. Önce B’nin zıttını al, sonra A ile uç uca ekle. A 2 birim sağa, B 3 birim sola ise $-\\vec B$ 3 birim sağadır; $\\vec A - \\vec B$ = 5 birim sağa.')}`),

  hatalar([
    ['Boyları aynı olan vektörler eşittir.', 'Eşitlik için büyüklük, doğrultu ve yön üçü birden aynı olmalı.'],
    ['Vektörü başka yere çizince başka bir vektör olur.', 'Boyu ve yönü korunarak kaydırılan vektör aynı vektördür.'],
    ['$-\\vec A$, A’dan küçük bir vektördür.', 'Eksi işaret yalnız yönü ters çevirir; büyüklük aynı kalır.'],
    ['Ters yönlü iki vektörün bileşkesi her zaman sıfırdır.', 'Yalnız büyüklükleri eşitse (zıt vektörlerse) sıfırdır. 5 sağa ve 3 sola: 2 sağa.'],
    ['$\\vec A - \\vec B$ için büyüklükleri çıkarmak yeter.', 'B’nin zıttını ekle. 2 sağa eksi 3 sola, 1 sola değil 5 sağadır.'],
  ]),

  ornek(1, 'KATLARINI BUL', `
<div class="ikili s"><div>${sekil(fOrn1(64))}</div><div>
<p>Şekilde K, L ve M vektörleri yatay doğrultudadır. L ve M’yi K cinsinden yazalım.</p>
<p><b>L:</b> 4 birim sağa, K 2 birim sağa. Aynı yön, 2 kat boy: $\\vec L = 2\\vec K$.</p>
<p><b>M:</b> 3 birim sola. Ters yön ($k$ negatif), boyu $3 / 2 = 1{,}5$ kat: $\\vec M = -1{,}5\\,\\vec K$.</p></div></div>`),

  ornek(2, 'HALAT ÇEKME', `
<p>Halat çekme yarışında sol takım halatı toplam 650 N’la sola, sağ takım 500 N’la sağa çekiyor. Kuvvetler aynı doğrultuda.</p>
<p>Sağı $+$ seçelim: $R = (+500) + (-650) = -150$. Bileşke kuvvet <b>150 N, sola</b>; halat sola doğru hareketlenir.</p>
<p>Sağ takıma 200 N’la çeken biri katılırsa: $R = (+700) + (-650) = +50$, yani <b>50 N, sağa</b>. Kazanan taraf değişir.</p>`),

  `<h2 class="b"><span class="n">?</span>Sorular</h2>`,
  soru(1, { metin: 'Kareli düzlemde K, L, M ve N vektörleri çizilmiştir.', sekil: fS1(118),
    ek: '', kok: 'Buna göre I. $\\vec L = 2\\vec K$, &nbsp;II. $\\vec M = -\\vec K$, &nbsp;III. $\\vec N = -2\\vec K$ eşitliklerinden hangileri doğrudur?',
    siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'], k: 5 }),
  soru(2, { metin: '$\\vec A$ vektörü 4 birim büyüklüğünde ve kuzey yönündedir.', kok: '$-2\\vec A$ vektörü aşağıdakilerden hangisidir?',
    siklar: ['2 birim, güney', '8 birim, kuzey', '8 birim, güney', '4 birim, güney', '2 birim, kuzey'] }),
  soru(3, { metin: '$\\vec B = -0{,}5\\,\\vec A$ olarak veriliyor.', kok: 'B vektörü için aşağıdakilerden hangisi doğrudur?', k: 1,
    siklar: ['Büyüklüğü A’nın yarısıdır, yönü A ile aynıdır.', 'Büyüklüğü A’nın yarısıdır, yönü A’ya terstir.', 'Büyüklüğü A’nın 2 katıdır, yönü A’ya terstir.', 'Büyüklüğü A ile aynıdır, yönü A’ya terstir.', 'Doğrultusu A’nın doğrultusuna diktir.'] }),
  soru(4, { metin: 'Bir cisme aynı doğrultuda üç kuvvet etki ediyor: 12 N doğuya, 5 N batıya ve 3 N batıya.', kok: 'Bileşke kuvvet aşağıdakilerden hangisidir?',
    siklar: ['20 N, doğu', '4 N, doğu', '4 N, batı', '10 N, doğu', '14 N, doğu'] }),
  soru(5, { metin: '$\\vec A$ 3 birim sağa, $\\vec B$ 5 birim sola yöneliktir.', kok: '$\\vec A - \\vec B$ vektörü aşağıdakilerden hangisidir?',
    siklar: ['2 birim, sola', '2 birim, sağa', '8 birim, sağa', '8 birim, sola', '15 birim, sağa'] }),
  soru(6, { metin: 'Kareli düzlemdeki P ve R vektörleri aynı doğrultudadır.', sekil: fS6, kok: '$\\vec R = k\\,\\vec P$ ise $k$ kaçtır?',
    siklar: ['$2{,}5$', '$-2{,}5$', '$-2$', '$3$', '$-0{,}4$'], k: 5 }),
  soru(7, { metin: 'İki vektör için $\\vec A + \\vec B = 0$ olduğu biliniyor.<br>I. Büyüklükleri eşittir.<br>II. Doğrultuları aynıdır.<br>III. Yönleri aynıdır.', kok: 'Yargılarından hangileri kesinlikle doğrudur?',
    siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'I ve III', 'I, II ve III'], k: 5 }),
  soru(8, { metin: 'Bir kutuyu Ali 40 N’la sağa iterken Can 25 N’la ve Efe 15 N’la sola itiyor. Kuvvetlerin hepsi yatay doğrultuda.', kok: 'Can kutuyu bırakırsa kutuya etki eden bu kuvvetlerin bileşkesi ne olur?',
    siklar: ['Sıfır', '25 N, sağa', '25 N, sola', '55 N, sağa', '15 N, sola'] }),
  soru(9, { metin: 'Bir öğrenci düz bir koridorda önce 12 m doğuya, sonra 20 m batıya, en son 5 m doğuya yürüyor.', kok: 'Öğrencinin yer değiştirmesi ve aldığı yol aşağıdakilerden hangisidir?', k: 1,
    siklar: ['Yer değiştirme 3 m batı; yol 37 m', 'Yer değiştirme 3 m doğu; yol 37 m', 'Yer değiştirme 37 m batı; yol 37 m', 'Yer değiştirme 3 m batı; yol 3 m', 'Yer değiştirme 13 m batı; yol 37 m'] }),
  soru(10, { metin: '<b>Açık uçlu.</b> Kareli düzlemde $\\vec A$ vektörü verilmiştir.', sekil: fS10,
    kok: 'a) $2\\vec A$ ve $-1{,}5\\,\\vec A$ vektörlerini aynı düzleme çiziniz. b) $\\vec A + (-1{,}5\\,\\vec A)$ bileşkesini $\\vec A$ cinsinden yazıp yönünü belirtiniz.' }),

  cevaplar([
    ['C', 'K: 2 sağa 1 yukarı. L: 4 sağa 2 yukarı = $2\\vec K$ (I doğru). M: 2 sola 1 aşağı = $-\\vec K$ (II doğru). N: 4 sola 1 aşağı; $-2\\vec K$ olsaydı 4 sola 2 aşağı olurdu, doğrultusu farklı (III yanlış).'],
    ['C', 'Büyüklük $|-2| \\cdot 4 = 8$ birim. Eksi işaret yönü ters çevirir: güney.'],
    ['B', '$|k| = 0{,}5$: büyüklük yarıya iner. $k$ negatif: yön ters. Doğrultu değişmez.'],
    ['B', 'Doğuyu $+$ seç: $12 - 5 - 3 = +4$. Bileşke 4 N, doğu.'],
    ['C', '$\\vec A - \\vec B = \\vec A + (-\\vec B)$. $-\\vec B$ 5 birim sağa; $3 + 5 = 8$ birim sağa.'],
    ['B', 'P 2 birim sağa, R 5 birim sola. Boy oranı $5/2 = 2{,}5$; yönler ters, $k$ negatif: $k = -2{,}5$.'],
    ['C', 'Toplam sıfırsa $\\vec B = -\\vec A$: büyüklükler eşit, doğrultular aynı, yönler ters (III yanlış).'],
    ['B', 'Sağı $+$ seç. Can bırakınca $+40 - 15 = +25$: 25 N, sağa. (Can varken bileşke sıfırdı.)'],
    ['A', 'Doğuyu $+$ seç: $12 - 20 + 5 = -3$, yani 3 m batı. Yol skalerdir, yönsüz toplanır: $12 + 20 + 5 = 37$ m.'],
    ['–', 'a) A: 2 sağa 2 yukarı. $2\\vec A$: aynı yönde, 4 sağa 4 yukarı. $-1{,}5\\,\\vec A$: ters yönde, 3 sola 3 aşağı. b) $\\vec A - 1{,}5\\,\\vec A = -0{,}5\\,\\vec A$: büyüklüğü A’nın yarısı (1 sola 1 aşağı), yönü A’ya ters.'],
  ]),
  sonraki('Vektörler (2/4): farklı doğrultularda uç uca ekleme'),
].join('\n');

// --- Instagram slaytları (kapak ve son CTA otomatik) ---
const slaytlar = [
  { pill: 'KAREDE OKU', h: 'Vektörü <em>kareli düzlemde</em> oku', svg: fOku(), bd: 'Kare say: <b>büyüklük</b>. Okun durduğu doğru: <b>doğrultu</b>. Ok ucu: <b>yön</b>.' },
  { pill: 'EŞİT Mİ, ZIT MI?', h: 'Aynı boy = <em>eşit</em> mi?', svg: fEsit(), bd: '<b>A = B</b>: boy, doğrultu, yön aynı. <b>C = −A</b>: boy aynı, yön ters. <b>D</b>: boy aynı ama doğrultu farklı, eşit değil.' },
  { pill: 'SAYIYLA ÇARP', h: 'Vektörü bir <em>sayıyla</em> çarp', svg: fKat(), bd: 'Büyüklük $|k|$ katına çıkar. <b>k pozitif:</b> yön aynı. <b>k negatif:</b> yön ters. Doğrultu hiç değişmez.' },
  { pill: 'AYNI DOĞRULTUDA TOPLA', h: '5 sağa + 3 sola = <em>?</em>', svg: fTopla(), bd: 'Uç uca ekle, ilk başlangıçtan son uca çiz. Sağ $+$, sol $-$: $(+5) + (-3) = +2$, yani <b>2 birim sağa</b>.' },
  { pill: 'ÇIKARMA', h: 'Çıkarma = <em>zıttını ekle</em>', lst: ['$\\vec A - \\vec B = \\vec A + (-\\vec B)$', '$\\vec A$ = 2 birim sağa, $\\vec B$ = 3 birim sola', '$-\\vec B$ = 3 birim <b>sağa</b>', '$\\vec A - \\vec B$ = <b>5 birim sağa</b> (1 sola değil!)'] },
  { pill: 'DİKKAT', h: 'En sık 3 <em>hata</em>', lst: ['<span class="x">✗</span> Boyları aynıysa eşittir. <span class="v">✓</span> Yön ve doğrultu da aynı olmalı.', '<span class="x">✗</span> −A, A’dan küçüktür. <span class="v">✓</span> Boy aynı, sadece yön ters.', '<span class="x">✗</span> Ters yönlüler hep sıfır eder. <span class="v">✓</span> Sadece boyları eşitse.'] },
  { pill: 'SIRA SENDE', h: 'Hangileri <em>doğru</em>?', svg: fS1(), bd: 'I. $\\vec L = 2\\vec K$ &nbsp; II. $\\vec M = -\\vec K$ &nbsp; III. $\\vec N = -2\\vec K$', bant: ['Cevabını yorumlara yaz 👇', 'Çözüm PDF’te'] },
  { pill: 'GÜNLÜK HAYATTA', h: 'Halat çekmede <em>kim kazanır?</em>', lst: ['Sol takım <b>650 N</b> sola, sağ takım <b>500 N</b> sağa çekiyor.', 'Sağ $+$: $500 - 650 = -150$ → <b>150 N, sola</b>.', 'Sağa 200 N’luk biri katılırsa: $700 - 650 = +50$ → <b>50 N, sağa</b>. Kazanan değişir.'] },
];

module.exports = {
  sinif: 9, no: 2, gun: 'Pazartesi',
  slug: '9-fizik-notlari-2-vektorler-esit-zit-carpma',
  konuKisa: 'Vektörler (1/4)',
  pdfBaslik: 'Vektörler 1: Eşit, Zıt ve Reel Sayıyla Çarpılmış Vektörler',
  baslik: 'Vektörler 1: Eşit, Zıt ve Reel Sayıyla Çarpılmış Vektörler',
  alt: 'Kareli düzlemde vektör okuma, sayıyla çarpma, aynı doğrultuda toplama ve çıkarma. Konu özeti, sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
  slaytBaslik: 'Vektörler 1: eşit, zıt ve <span style="color:#22b8cf">katı alınmış</span> vektörler',
  slaytAlt: 'Kareli düzlemde oku, sayıyla çarp, aynı doğrultuda topla.',
  promoKonu: 'Vektörler',
  pdfOzet: 'Özet, 5 sık hata, 2 çözümlü örnek, <b>10 soru ve çözümleri.</b>',
  govde, slaytlar,
  aciklama: `
Aynı boydaki iki vektör eşit midir? 🤔 Kaydır, 30 saniyede öğren.

Kaydırınca: kareli düzlemde vektör okuma, eşit ve zıt vektörler, vektörü sayıyla çarpma, aynı doğrultuda toplama ve çıkarma, en sık 3 hata ve bir mini soru.

Notun tamamı ücretsiz PDF: özet, 5 sık hata, 2 çözümlü örnek, 10 soru ve çözümleri.
1) Takip et
2) Profildeki linke dokun
3) 9. sınıf bölümünden notu indir (üyelik yok)

7. slayttaki sorunun cevabını yorumlara yaz 👇
Her Pazartesi 9. sınıf için yeni not.

#9sınıf #9sınıffizik #maarifmodeli #fizik #fiziknotları #vektörler #vektör #benfizikyapamiyorum`,
  ilkYorum: '📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf · 7. slaytın cevabı PDF’in çözüm sayfasında. Gelecek hafta: uç uca ekleme yöntemi.',
  hub: {
    etiket: '9. SINIF · MAARİF MODELİ · NOT #2',
    baslik: 'Vektörler 1: eşit, zıt ve reel sayıyla çarpılmış vektörler',
    aciklama: 'Kareli düzlemde vektör, sayıyla çarpma, aynı doğrultuda toplama ve çıkarma. Sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
    takvimLink: 'Not #2 · Vektörler 1 ↓',
    tarih: '2026-11-02',
    devam: { href: '/9-sinif-fizik-paketi.html', img: '/img/fizik9/set.webp', lab: 'not9_yap', b: 'Devamı: Yapabilirim 9 · Vektörler', span: 'Konu notu, kavram kartları, yeni nesil sorular, adım adım çözümler', em: '₺599 →' },
  },
};
