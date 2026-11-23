// 9. sınıf · Not #4 · Vektörler 2 (takvim: Vektörler 3/4) · FİZ.9.2.4 farklı doğrultularda toplama: uç uca ekleme ve paralelkenar
const { kare, bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki } = require('../lib');

const MAVI = '#2563eb', TURUNCU = '#ea580c', YESIL = '#0f766e', MOR = '#7c3aed', KOYU = '#0f172a', GRI = '#94a3b8';

// --- Şekiller (koordinatlar kare biriminde, hepsi tam sayı) ---
// A = 4 sağa, B = 3 yukarı → R = 4 sağa 3 yukarı = 5 birim
const fUc = (w) => kare({ cols: 8, rows: 5, s: 32, width: w, olcek: true,
  vecs: [
    { x: 1, y: 1, dx: 4, dy: 0, lab: 'A', c: MAVI, lp: 'd' },
    { x: 5, y: 1, dx: 0, dy: 3, lab: 'B', c: TURUNCU, lp: 'r' },
    { x: 1, y: 1, dx: 4, dy: 3, lab: 'R', c: KOYU, lp: [-16, -14], dash: '8 5' },
  ] });
// Paralelkenar: A = 4 sağa, B = 2 sağa 3 yukarı → R = 6 sağa 3 yukarı
const fPar = (w) => kare({ cols: 8, rows: 5, s: 32, width: w, olcek: true,
  cizgi: [{ x1: 5, y1: 1, x2: 7, y2: 4, c: GRI }, { x1: 3, y1: 4, x2: 7, y2: 4, c: GRI }],
  vecs: [
    { x: 1, y: 1, dx: 4, dy: 0, lab: 'A', c: MAVI, lp: 'd' },
    { x: 1, y: 1, dx: 2, dy: 3, lab: 'B', c: TURUNCU, lp: 'l' },
    { x: 1, y: 1, dx: 6, dy: 3, lab: 'R', c: KOYU, lp: [14, 16] },
  ] });
// Çok vektör: K = 2 sağa 3 yukarı, L = 4 sağa, M = 1 sağa 3 aşağı → R = 7 sağa
const fCok = (w) => kare({ cols: 9, rows: 5, s: 30, width: w, olcek: true,
  vecs: [
    { x: 1, y: 1, dx: 2, dy: 3, lab: 'K', c: MAVI, lp: 'l' },
    { x: 3, y: 4, dx: 4, dy: 0, lab: 'L', c: TURUNCU, lp: 'u' },
    { x: 7, y: 4, dx: 1, dy: -3, lab: 'M', c: YESIL, lp: 'r' },
    { x: 1, y: 1, dx: 7, dy: 0, lab: 'R', c: KOYU, lp: 'd', dash: '8 5' },
  ] });
// Örnek 1: P = 2 sağa 3 yukarı, Q = 4 sağa 3 aşağı (ayrı çizilmiş) → R = 6 sağa
const fOrnA = (w) => kare({ cols: 10, rows: 5, s: 28, width: w, olcek: true,
  vecs: [
    { x: 1, y: 1, dx: 2, dy: 3, lab: 'P', c: MAVI, lp: 'l' },
    { x: 5, y: 4, dx: 4, dy: -3, lab: 'Q', c: TURUNCU, lp: 'r' },
  ] });
const fOrnB = (w) => kare({ cols: 8, rows: 5, s: 28, width: w, olcek: false,
  vecs: [
    { x: 1, y: 1, dx: 2, dy: 3, lab: 'P', c: MAVI, lp: 'l' },
    { x: 3, y: 4, dx: 4, dy: -3, lab: 'Q', c: TURUNCU, lp: 'r' },
    { x: 1, y: 1, dx: 6, dy: 0, lab: 'R', c: KOYU, lp: 'd', dash: '8 5' },
  ] });
// Soru 1: A = 2 sağa 3 yukarı, B = 3 sağa 1 aşağı (ayrı) → 5 sağa 2 yukarı
const fS1 = kare({ cols: 10, rows: 5, s: 28, width: 62, olcek: true,
  vecs: [
    { x: 1, y: 1, dx: 2, dy: 3, lab: 'A', c: MAVI, lp: 'l' },
    { x: 5, y: 3, dx: 3, dy: -1, lab: 'B', c: TURUNCU, lp: 'u' },
  ] });
// Soru 4: kapalı üçgen K + L + M = 0
const fS4 = (w) => kare({ cols: 7, rows: 5, s: 30, width: w, olcek: false,
  vecs: [
    { x: 1, y: 1, dx: 4, dy: 0, lab: 'K', c: MAVI, lp: 'd' },
    { x: 5, y: 1, dx: -2, dy: 3, lab: 'L', c: TURUNCU },
    { x: 3, y: 4, dx: -2, dy: -3, lab: 'M', c: YESIL },
  ] });
// Soru 5: ortak başlangıçlı A (5 sağa) ve B (1 sağa 3 yukarı); X ve Y köşegenleri
const fS5 = kare({ cols: 9, rows: 5, s: 28, width: 58, olcek: false,
  cizgi: [{ x1: 6, y1: 1, x2: 7, y2: 4, c: GRI }, { x1: 2, y1: 4, x2: 7, y2: 4, c: GRI }],
  vecs: [
    { x: 1, y: 1, dx: 5, dy: 0, lab: 'A', c: MAVI, lp: 'd' },
    { x: 1, y: 1, dx: 1, dy: 3, lab: 'B', c: TURUNCU, lp: 'l' },
    { x: 1, y: 1, dx: 6, dy: 3, lab: 'X', c: KOYU, lp: 'tip' },
    { x: 6, y: 1, dx: -4, dy: 3, lab: 'Y', c: MOR, lp: [34, 14], nokta: false },
  ] });
// Soru 9: A = 3 sağa 1 yukarı, R = A + B = 1 sağa 4 yukarı → B = 2 sola 3 yukarı
const fS9 = kare({ cols: 6, rows: 6, s: 28, width: 42, olcek: true,
  vecs: [
    { x: 1, y: 1, dx: 3, dy: 1, lab: 'A', c: MAVI, lp: 'd' },
    { x: 1, y: 1, dx: 1, dy: 4, lab: 'R', c: KOYU, lp: 'l', dash: '8 5' },
  ] });
// Soru 10: A = 3 sağa 2 yukarı, B = 1 sağa 2 aşağı, C = 3 yukarı
const fS10 = kare({ cols: 12, rows: 5, s: 26, width: 70, olcek: true,
  vecs: [
    { x: 1, y: 1, dx: 3, dy: 2, lab: 'A', c: MAVI },
    { x: 6, y: 4, dx: 1, dy: -2, lab: 'B', c: TURUNCU, lp: 'r' },
    { x: 10, y: 1, dx: 0, dy: 3, lab: 'C', c: YESIL, lp: 'r' },
  ] });

// --- PDF gövdesi ---
const govde = [
  bolum(1, 'Uç uca ekleme yöntemi', `
<p>Geçen notta aynı doğrultudaki vektörleri topladık. Şimdi doğrultuları farklı olan vektörleri toplayacağız. Yöntem aynı: <b>ikinci vektörün başlangıcını birincinin ucuna koy.</b></p>
<div class="ikili s"><div>${sekil(fUc(70), 'A 4 birim sağa, B 3 birim yukarı.')}</div>
<table class="t"><tr><th>Adım</th><th>Ne yaparsın?</th></tr>
<tr><td><b>1</b></td><td>A’yı çiz.</td></tr>
<tr><td><b>2</b></td><td>B’yi boyunu ve yönünü bozmadan kaydır; başlangıcı A’nın ucunda olsun.</td></tr>
<tr><td><b>3</b></td><td>Bileşke $\\vec R$’yi A’nın başlangıcından B’nin ucuna çiz.</td></tr></table></div>
${kutu('ana', 'Kareli düzlemde bileşkeyi oku', 'Bileşke, ilk başlangıçtan son uca kaç kare sağa (sola) ve kaç kare yukarı (aşağı) gidildiğini gösterir. Şekilde $\\vec R$: 4 birim sağa, 3 birim yukarı.')}
${kutu('sari', 'Dik iki vektörde büyüklük', 'A ile B birbirine dik olduğu için $\\vec R$ bir dik üçgenin hipotenüsüdür. Pisagor bağıntısıyla $R = \\sqrt{4^2 + 3^2} = 5$ birim. Dikkat: $4 + 3 = 7$ değil.')}`),

  bolum(2, 'Sıra fark etmez, vektör sayısı da', `
<div class="ikili s"><div>${sekil(fCok(72), 'K, L ve M uç uca eklendi.')}</div><div>
<p>İkiden fazla vektörü de aynı şekilde eklersin: her vektörün başlangıcı bir öncekinin ucuna gelir. Bileşke, <b>ilk başlangıçtan son uca</b> çizilir.</p>
<p>Şekilde K 2 sağa 3 yukarı, L 4 sağa, M 1 sağa 3 aşağıdır. Yukarı ve aşağı gidişler birbirini götürür: $\\vec R$ = <b>7 birim sağa</b>.</p></div></div>
${kutu('ana', 'Sıra değişmez', '$\\vec A + \\vec B = \\vec B + \\vec A$. Önce L’yi, sonra K’yi, en son M’yi eklesen de aynı uç noktaya varırsın; bileşke değişmez.')}
${kutu('ana', 'Kapalı şekil = sıfır bileşke', 'Uç uca eklenen vektörlerin sonuncusunun ucu ilk başlangıca geri dönüyorsa (kapalı bir üçgen ya da çokgen oluşuyorsa) bileşke <b>sıfır vektördür</b>.')}`),

  bolum(3, 'Paralelkenar yöntemi', `
<div class="ikili s"><div>${sekil(fPar(70), 'Kesikli çizgiler A ve B’ye paralel.')}</div><div>
<p>İki vektör <b>aynı noktadan</b> başlıyorsa paralelkenar yöntemi daha pratiktir:</p>
<p><b>1.</b> A’nın ucundan B’ye, B’nin ucundan A’ya paralel çizgi çiz.<br><b>2.</b> Çizgilerin kesiştiği köşe paralelkenarı tamamlar.<br><b>3.</b> $\\vec R$, ortak başlangıçtan bu köşeye çizilen köşegendir.</p>
<p>Şekilde $\\vec R$ = 6 birim sağa, 3 birim yukarı.</p></div></div>
${kutu('sari', 'İki yöntem, aynı sonuç', 'Paralelkenarın üst kenarı, B’nin A’nın ucuna kaydırılmış hâlidir. Yani paralelkenar yöntemi, uç uca eklemenin iki vektör için kısa yoludur. Paralelkenar bir seferde <b>iki</b> vektör için kurulur; üç vektörde önce ikisini topla, sonra bileşkeyi üçüncüyle topla.')}`),

  bolum(4, 'Bileşke ne kadar büyük olabilir?', `
<p>Büyüklükleri 4 birim ve 3 birim olan iki vektörün bileşkesi, aralarındaki açıya göre değişir:</p>
<table class="t"><tr><th>Vektörlerin durumu</th><th>Bileşkenin büyüklüğü</th><th>Not</th></tr>
<tr><td>Aynı yönde</td><td>$4 + 3 = 7$ birim</td><td>En büyük değer</td></tr>
<tr><td>Birbirine dik</td><td>$\\sqrt{4^2 + 3^2} = 5$ birim</td><td>Pisagor</td></tr>
<tr><td>Ters yönde</td><td>$4 - 3 = 1$ birim</td><td>En küçük değer</td></tr></table>
${kutu('ana', 'Kural', 'Aradaki açı büyüdükçe bileşke küçülür. Büyüklükleri $A$ ve $B$ olan iki vektörün bileşkesi her zaman <span style="white-space:nowrap">$|A - B| \\le R \\le A + B$</span> aralığındadır. 4 ve 3 birimlik vektörler için $1 \\le R \\le 7$.')}`),

  hatalar([
    ['4 birim ile 3 birimin bileşkesi 7 birimdir.', 'Yalnız aynı yöndeyseler 7 birimdir. Dikseler 5, ters yöndeyseler 1 birimdir.'],
    ['Bileşke, son vektörün ucundan ilk başlangıca çizilir.', 'Tersi: ilk başlangıçtan son uca. Ok ucu, son vektörün ucundadır.'],
    ['Paralelkenarda iki ucu birleştiren köşegen bileşkedir.', 'Bileşke, ortak başlangıçtan çıkan köşegendir. Öteki köşegen farkı ($\\vec B - \\vec A$) gösterir.'],
    ['Vektörlerin eklenme sırası değişirse bileşke de değişir.', '$\\vec A + \\vec B = \\vec B + \\vec A$; sıra ne olursa olsun aynı uç noktaya varılır.'],
    ['Bileşke, toplanan vektörlerin her birinden büyüktür.', '4 ve 3 birimlik ters yönlü vektörlerin bileşkesi 1 birimdir; ikisinden de küçük. Kapalı şekilde sıfırdır.'],
  ]),

  ornek(1, 'KARELİ DÜZLEMDE BİLEŞKE', `
<div class="ikili"><div>${sekil(fOrnA(66), 'P ve Q ayrı yerlerde çizilmiş.')}</div><div>${sekil(fOrnB(54), 'Q, P’nin ucuna kaydırıldı.')}</div></div>
<p>$\\vec P + \\vec Q$ bileşkesini bulalım. P 2 sağa 3 yukarı, Q 4 sağa 3 aşağıdır. Q’yu boyunu ve yönünü bozmadan P’nin ucuna kaydırırız. Q’nun ucu, P’nin başlangıcıyla aynı yüksekliğe iner.</p>
<p>Yatayda $2 + 4 = 6$ birim sağa, düşeyde $3 - 3 = 0$. Bileşke $\\vec R$ = <b>6 birim sağa</b>. Düşey gidişler birbirini götürdüğü için bileşke yatay çıkar.</p>`),

  ornek(2, 'KAYIĞI KIYIYA ÇEKMEK', `
<p>İki arkadaş durgun sudaki bir kayığı iple çekiyor. Biri 80 N’la doğuya, diğeri 60 N’la kuzeye çekiyor; ipler birbirine dik.</p>
<p>Uç uca ekleyince 80 N ve 60 N dik kenarlı bir dik üçgen oluşur: $R = \\sqrt{80^2 + 60^2} = \\sqrt{10\\,000} = 100$ N. Bileşke doğu ile kuzey arasında, doğuya daha yakın bir yöndedir.</p>
<p>İkisi de doğuya çekseydi bileşke $80 + 60 = 140$ N olurdu. İpleri dik tutmak 40 N kaybettiriyor. Kayığa daha büyük bileşke kuvvet uygulamak için ipleri aynı yöne yakın tutmak gerekir.</p>`),

  `<h2 class="b"><span class="n">?</span>Sorular</h2>`,
  soru(1, { metin: 'Kareli düzlemde A ve B vektörleri çizilmiştir.', sekil: fS1, kok: '$\\vec A + \\vec B$ bileşkesi aşağıdakilerden hangisidir?', k: 2,
    siklar: ['5 birim sağa, 4 birim yukarı', '5 birim sağa, 2 birim yukarı', '1 birim sağa, 4 birim yukarı', '5 birim sağa, 3 birim yukarı', '1 birim sola, 2 birim yukarı'] }),
  soru(2, { metin: 'Bir cisme yatay düzlemde 6 N’luk kuvvet doğuya, 8 N’luk kuvvet kuzeye etki ediyor.', kok: 'Bileşke kuvvetin büyüklüğü kaç N’dur?',
    siklar: ['2', '7', '10', '14', '48'], k: 5 }),
  soru(3, { metin: 'Büyüklükleri 5 birim ve 3 birim olan iki vektör, aralarındaki açı değiştirilerek toplanıyor.', kok: 'Bileşkenin büyüklüğü aşağıdakilerden hangisi olamaz?',
    siklar: ['2 birim', '4 birim', '6 birim', '8 birim', '9 birim'], k: 5 }),
  soru(4, { metin: 'Kareli düzlemde K, L ve M vektörleri uç uca çizilmiştir.', sekil: fS4(40),
    kok: 'Buna göre I. $\\vec K + \\vec L + \\vec M = \\vec 0$, &nbsp;II. $\\vec K + \\vec L = -\\vec M$, &nbsp;III. $\\vec L + \\vec M = -\\vec K$ eşitliklerinden hangileri doğrudur?',
    siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'], k: 5 }),
  soru(5, { metin: 'Aynı noktadan başlayan A ve B vektörleriyle paralelkenar kurulmuş, X ve Y köşegen vektörleri çizilmiştir.', sekil: fS5,
    kok: 'X ve Y vektörleri için aşağıdakilerden hangisi doğrudur?', k: 2,
    siklar: ['$\\vec X = \\vec A + \\vec B$, &nbsp;$\\vec Y = \\vec A - \\vec B$', '$\\vec X = \\vec A - \\vec B$, &nbsp;$\\vec Y = \\vec A + \\vec B$', '$\\vec X = \\vec B - \\vec A$, &nbsp;$\\vec Y = \\vec A + \\vec B$', '$\\vec X = \\vec A + \\vec B$, &nbsp;$\\vec Y = \\vec B - \\vec A$', '$\\vec X = \\vec A + \\vec B$, &nbsp;$\\vec Y = \\vec A + \\vec B$'] }),
  soru(6, { metin: 'İki vektörün bileşkesinin alabileceği en küçük değer 7 birim, en büyük değer 17 birimdir.', kok: 'Bu iki vektör birbirine dik olacak şekilde toplanırsa bileşkenin büyüklüğü kaç birim olur?',
    siklar: ['10', '13', '15', '17', '24'], k: 5 }),
  soru(7, { metin: 'Üç çocuk yatay düzlemdeki bir oyuncak arabaya bağlı ipleri çekiyor: Ece 30 N’la doğuya, Mert 40 N’la kuzeye, Ada 30 N’la batıya.', kok: 'Arabaya etki eden bu üç kuvvetin bileşkesi aşağıdakilerden hangisidir?',
    siklar: ['10 N, kuzey', '70 N, kuzey', '100 N, kuzey', '40 N, kuzey', '50 N, doğu'], k: 5 }),
  soru(8, { metin: 'I. İki vektörün bileşkesi, her zaman bu vektörlerin her birinden büyüktür.<br>II. Vektörlerin toplanma sırası değişirse bileşke değişmez.<br>III. Paralelkenar yönteminde vektörler aynı başlangıç noktasından çizilir.', kok: 'Yargılarından hangileri doğrudur?',
    siklar: ['Yalnız II', 'II ve III', 'Yalnız III', 'I ve II', 'I, II ve III'], k: 5 }),
  soru(9, { metin: 'Kareli düzlemde $\\vec A$ ve $\\vec R = \\vec A + \\vec B$ bileşkesi aynı noktadan başlayacak şekilde çizilmiştir.', sekil: fS9, kok: '$\\vec B$ vektörü aşağıdakilerden hangisidir?', k: 2,
    siklar: ['2 birim sola, 3 birim yukarı', '4 birim sağa, 5 birim yukarı', '2 birim sağa, 3 birim aşağı', '2 birim sola, 5 birim yukarı', '3 birim sola, 4 birim yukarı'] }),
  soru(10, { metin: '<b>Açık uçlu.</b> Kareli düzlemde A, B ve C vektörleri verilmiştir.', sekil: fS10,
    kok: 'a) $\\vec A + \\vec B$ bileşkesini uç uca ekleme yöntemiyle çiziniz ve kaç birim, hangi yönde olduğunu yazınız.<br>b) $\\vec A + \\vec C$ bileşkesini paralelkenar yöntemiyle çiziniz.<br>c) $\\vec A + \\vec B + \\vec C$ bileşkesinin büyüklüğünü bulunuz.' }),

  cevaplar([
    ['B', 'B’yi A’nın ucuna kaydır. Yatay: $2 + 3 = 5$ sağa. Düşey: $3 - 1 = 2$ yukarı. Bileşke 5 birim sağa, 2 birim yukarı.'],
    ['C', 'Kuvvetler dik: $R = \\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$ N. ($6 + 8 = 14$ yalnız aynı yönde olurdu.)'],
    ['E', '$5 - 3 \\le R \\le 5 + 3$, yani $2 \\le R \\le 8$. 9 birim bu aralığın dışında.'],
    ['E', 'M’nin ucu K’nin başlangıcına dönüyor: kapalı üçgen, I doğru. I’den $\\vec K + \\vec L = -\\vec M$ (II) ve $\\vec L + \\vec M = -\\vec K$ (III) da çıkar.'],
    ['D', 'X ortak başlangıçtan çıkan köşegen: $\\vec A + \\vec B$. Y, A’nın ucundan B’nin ucuna gidiyor: $\\vec A + \\vec Y = \\vec B$, yani $\\vec Y = \\vec B - \\vec A$.'],
    ['B', '$A + B = 17$, $A - B = 7$ → $A = 12$, $B = 5$. Dik: $R = \\sqrt{12^2 + 5^2} = \\sqrt{169} = 13$ birim.'],
    ['D', 'Ece ve Ada aynı büyüklükte, ters yönde: birbirini götürür. Geriye Mert’in 40 N’u kalır: 40 N, kuzey.'],
    ['B', 'I yanlış: ters yönlü 5 ve 3 birimin bileşkesi 2 birimdir. II doğru ($\\vec A + \\vec B = \\vec B + \\vec A$). III doğru.'],
    ['A', '$\\vec B = \\vec R - \\vec A$. Yatay: $1 - 3 = -2$ (2 sola). Düşey: $4 - 1 = 3$ (3 yukarı).'],
    ['–', 'a) B’yi A’nın ucuna kaydır: yatay $3 + 1 = 4$ sağa, düşey $2 - 2 = 0$. Bileşke 4 birim sağa. b) C’yi A’nın başlangıcına kaydır, paralelkenarı tamamla; ortak başlangıçtan çıkan köşegen 3 birim sağa, 5 birim yukarı. c) Yatay $3 + 1 + 0 = 4$, düşey <span style="white-space:nowrap">$2 - 2 + 3 = 3$</span>: $R = \\sqrt{4^2 + 3^2} = 5$ birim.'],
  ]),
  sonraki('Vektörler 3: vektörü dik koordinat sisteminde bileşenlerine ayırma'),
].join('\n');

// --- Instagram slaytları (kapak ve son CTA otomatik) ---
const slaytlar = [
  { pill: 'UÇ UCA EKLE', h: 'B’yi A’nın <em>ucuna</em> koy', svg: fUc(), bd: 'Bileşke $\\vec R$: <b>ilk başlangıçtan son uca.</b> Burada 4 birim sağa, 3 birim yukarı.' },
  { pill: '4 + 3 = 7 Mİ?', h: 'Dik vektörlerde <em>Pisagor</em>', lst: ['A = <b>4 birim</b> sağa, B = <b>3 birim</b> yukarı', 'Uç uca ekleyince dik üçgen oluşur.', '$R = \\sqrt{4^2 + 3^2} =$ <b>5 birim</b>', '<span class="x">✗</span> 7 birim <b>değil!</b> 7 yalnız aynı yönde olur.'] },
  { pill: 'PARALELKENAR', h: 'Aynı noktadan başlıyorsa <em>paralelkenar</em>', svg: fPar(), bd: 'Uçlardan paralel çiz. Bileşke: <b>ortak başlangıçtan çıkan köşegen.</b>' },
  { pill: 'ÇOK VEKTÖR', h: 'Üç vektörü <em>art arda</em> ekle', svg: fCok(), bd: 'Yukarı ve aşağı gidişler birbirini götürür. $\\vec R$ = <b>7 birim sağa</b>. Sıra değişse de sonuç aynı.' },
  { pill: 'EN BÜYÜK, EN KÜÇÜK', h: '4 ve 3 birim: bileşke <em>kaç olur?</em>', lst: ['Aynı yönde: $4 + 3 =$ <b>7</b> (en büyük)', 'Dik: $\\sqrt{4^2 + 3^2} =$ <b>5</b>', 'Ters yönde: $4 - 3 =$ <b>1</b> (en küçük)', 'Kural: $|A - B| \\le R \\le A + B$'] },
  { pill: 'DİKKAT', h: 'En sık 3 <em>hata</em>', lst: ['<span class="x">✗</span> Bileşke son uçtan başa çizilir. <span class="v">✓</span> Baştan son uca.', '<span class="x">✗</span> Paralelkenarda uçları birleştiren köşegen. <span class="v">✓</span> Ortak başlangıçtan çıkan.', '<span class="x">✗</span> Bileşke hep büyüktür. <span class="v">✓</span> Ters yönde küçülür, kapalı şekilde sıfırdır.'] },
  { pill: 'SIRA SENDE', h: 'Hangileri <em>doğru</em>?', svg: fS4(), bd: 'I. $\\vec K + \\vec L + \\vec M = \\vec 0$ &nbsp; II. $\\vec K + \\vec L = -\\vec M$ &nbsp; III. $\\vec L + \\vec M = -\\vec K$', bant: ['Cevabını yorumlara yaz 👇', 'Çözüm PDF’te'] },
  { pill: 'GÜNLÜK HAYATTA', h: 'Kayığı iki iple <em>çekmek</em>', lst: ['Biri <b>80 N</b> doğuya, diğeri <b>60 N</b> kuzeye çekiyor. İpler dik.', '$R = \\sqrt{80^2 + 60^2} =$ <b>100 N</b>', 'Aynı yöne çekselerdi <b>140 N</b>. Dik çekmek 40 N kaybettiriyor.'] },
];

module.exports = {
  sinif: 9, no: 4, gun: 'Pazartesi',
  slug: '9-fizik-notlari-4-vektorler-uc-uca-paralelkenar',
  konuKisa: 'Vektörler 2',
  pdfBaslik: 'Vektörler 2: Uç Uca Ekleme ve Paralelkenar Yöntemi',
  baslik: 'Vektörler 2: Uç Uca Ekleme ve Paralelkenar Yöntemi',
  alt: 'Farklı doğrultulardaki vektörleri toplama, çok vektörlü toplama, kapalı şekiller ve bileşkenin en büyük ve en küçük değeri. Konu özeti, sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
  slaytBaslik: 'Vektörler 2: <span style="color:#22b8cf">uç uca</span> ekleme ve paralelkenar',
  slaytAlt: 'Farklı doğrultulardaki vektörleri topla, bileşkeyi kareli düzlemde oku.',
  promoKonu: 'Vektörler',
  pdfOzet: 'Özet, 5 sık hata, 2 çözümlü örnek, <b>10 soru ve çözümleri.</b>',
  govde, slaytlar,
  aciklama: `
4 birimlik vektörle 3 birimlik vektörün toplamı 7 birim midir? 🤔 Kaydır, 30 saniyede öğren.

Kaydırınca: uç uca ekleme yöntemi, dik vektörlerde Pisagor, paralelkenar yöntemi, üç vektörü art arda toplama, bileşkenin en büyük ve en küçük değeri, en sık 3 hata ve bir mini soru.

Notun tamamı ücretsiz PDF: özet, 5 sık hata, 2 çözümlü örnek, 10 soru ve çözümleri.
1) Takip et
2) Profildeki linke dokun
3) 9. sınıf bölümünden notu indir (üyelik yok)

7. slayttaki sorunun cevabını yorumlara yaz 👇
Her Pazartesi 9. sınıf için yeni not.

#9sınıf #9sınıffizik #maarifmodeli #fizik #fiziknotları #vektörler #vektör #bileşkevektör #benfizikyapamiyorum`,
  ilkYorum: '📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf · 7. slaytın cevabı PDF’in çözüm sayfasında. Gelecek hafta: vektörü bileşenlerine ayırma.',
  hub: {
    etiket: '9. SINIF · MAARİF MODELİ · NOT #4',
    baslik: 'Vektörler 2: uç uca ekleme ve paralelkenar yöntemi',
    aciklama: 'Farklı doğrultularda vektör toplama, kapalı şekiller, bileşkenin en büyük ve en küçük değeri. Sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
    takvimLink: 'Not #4 · Vektörler 2 ↓',
    tarih: '2026-11-23',
    devam: { href: '/9-sinif-fizik-paketi.html', img: '/img/fizik9/set.webp', lab: 'not9_yap', b: 'Devamı: Yapabilirim 9 · Vektörler', span: 'Konu notu, kavram kartları, yeni nesil sorular, adım adım çözümler', em: '₺599 →' },
  },
};
