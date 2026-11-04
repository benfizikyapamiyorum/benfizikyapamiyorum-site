// 10. sınıf · Not #2 · 1. yazılıya son tekrar (yazılı haftası) · FİZ.10.1.1, FİZ.10.1.2, FİZ.10.1.3
const { bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki } = require('../lib');
const { grafik } = require('./grafik');

const MAVI = '#2563eb', TURUNCU = '#ea580c', YESIL = '#0f766e', MOR = '#7c3aed';

// --- Şekiller ---
const fXt = (w) => grafik({ tmax: 6, dt: 1, sx: 38, ymax: 50, dy: 10, sy: 3, xlab: 't (s)', ylab: 'x (m)', width: w,
  cizgi: [{ pts: [[0, 10], [6, 40]], c: MAVI }], kesik: [[6, 40]],
  notes: [{ t: 3.2, y: 31, s: 'eğim = 30 / 6 = 5 m/s', c: MAVI, a: 'end', size: 13.5 }] });
const fVtSabit = (w) => grafik({ tmax: 6, dt: 1, sx: 38, ymax: 7, dy: 1, sy: 20, xlab: 't (s)', ylab: 'v (m/s)', width: w,
  alan: [{ pts: [[0, 5], [6, 5]], c: MAVI }], cizgi: [{ pts: [[0, 5], [6, 5]], c: MAVI }],
  notes: [{ t: 3, y: 2.3, s: 'alan = 5 · 6 = 30 m', c: '#1d2b53', size: 14 }] });
const fVtIvme = (w) => grafik({ tmax: 6, dt: 1, sx: 38, ymax: 20, dy: 4, sy: 8, xlab: 't (s)', ylab: 'v (m/s)', width: w,
  alan: [{ pts: [[0, 4], [6, 16]], c: TURUNCU }], cizgi: [{ pts: [[0, 4], [6, 16]], c: TURUNCU }], kesik: [[6, 16]],
  notes: [{ t: 3, y: 4.5, s: 'alan = Δx = 60 m', c: '#1d2b53', size: 14 }, { t: 0.25, y: 13.2, s: 'eğim = a = 2 m/s²', c: TURUNCU, a: 'start', size: 13.5 }] });
const fAt = (w) => grafik({ tmax: 6, dt: 1, sx: 38, ymax: 3, dy: 1, sy: 30, xlab: 't (s)', ylab: 'a (m/s²)', width: w,
  alan: [{ pts: [[0, 2], [6, 2]], c: YESIL }], cizgi: [{ pts: [[0, 2], [6, 2]], c: YESIL }],
  notes: [{ t: 3, y: 0.85, s: 'alan = Δv = 12 m/s', c: '#1d2b53', size: 14 }] });
const fMetro = (w) => grafik({ tmax: 60, dt: 10, sx: 6.2, ymax: 25, dy: 5, sy: 6, xlab: 't (s)', ylab: 'v (m/s)', width: w,
  alan: [{ pts: [[0, 0], [20, 20], [50, 20], [60, 0]], c: MOR, o: 0.16 }],
  cizgi: [{ pts: [[0, 0], [20, 20], [50, 20], [60, 0]], c: MOR }], kesik: [[20, 20]],
  notes: [{ t: 13, y: 6, s: '200 m', size: 13 }, { t: 35, y: 9, s: '600 m', size: 13 }, { t: 54.2, y: 4, s: '100 m', size: 13, a: 'end' }] });
const fKars = (w) => grafik({ tmax: 20, dt: 4, sx: 16, ymax: 300, dy: 60, sy: 0.6, xlab: 't (s)', ylab: 'x (m)', width: w,
  cizgi: [{ pts: [[0, 0], [20, 300]], c: MAVI, lab: 'A', lx: 17.2, ly: 236 }, { pts: [[0, 300], [20, 100]], c: TURUNCU, lab: 'B', lx: 4, ly: 285 }],
  kesik: [[12, 180]], notes: [{ t: 12.5, y: 98, s: '(12 s, 180 m)', size: 13, a: 'start' }] });
const fS1 = grafik({ tmax: 8, dt: 1, sx: 30, ymax: 10, dy: 2, sy: 12, xlab: 't (s)', ylab: 'x (m)', width: 62,
  cizgi: [{ pts: [[0, 0], [2, 8], [4, 8], [8, 0]], c: MAVI }], kesik: [[2, 8], [4, 8]] });
const fS3 = (w) => grafik({ tmax: 10, dt: 2, sx: 26, ymax: 14, dy: 4, sy: 9, xlab: 't (s)', ylab: 'v (m/s)', width: w,
  cizgi: [{ pts: [[0, 0], [4, 12], [6, 12], [10, 0]], c: TURUNCU }], kesik: [[4, 12], [6, 12]] });
const fS5 = grafik({ tmax: 6, dt: 1, sx: 32, ymax: 3, dy: 1, sy: 26, xlab: 't (s)', ylab: 'a (m/s²)', width: 54,
  cizgi: [{ pts: [[0, 2], [5, 2]], c: YESIL }], kesik: [[5, 2]] });
const fS7 = grafik({ tmax: 6, dt: 1, sx: 34, ymax: 120, dy: 20, sy: 1.3, xlab: 't (s)', ylab: 'x (m)', width: 62,
  cizgi: [{ pts: [[0, 0], [6, 60]], c: MAVI, lab: 'K', lx: 5.6, ly: 70 }, { pts: [[0, 120], [6, 0]], c: TURUNCU, lab: 'L', lx: 1.2, ly: 111 }] });
const fS8 = grafik({ tmax: 7, dt: 1, sx: 32, ymin: -6, ymax: 10, dy: 2, sy: 10, xlab: 't (s)', ylab: 'v (m/s)', width: 62,
  cizgi: [{ pts: [[0, 8], [6, -4]], c: MOR }], kesik: [[6, -4]] });

// --- PDF gövdesi ---
const govde = [
  kutu('sari', 'Yazılıda ne çıkıyor?', 'MEB konu-soru dağılım tablosuna göre 10. sınıf fizik 1. ortak yazılısı yalnız <b>Kuvvet ve Hareket</b> ünitesinin ilk iki konusundan gelir: sabit hızlı hareket ve bir boyutta sabit ivmeli hareket. İş ve enerji bu yazılıda yok. Hangi senaryodan kaç soru geldiği 4. bölümde.'),

  bolum(1, 'Sabit hızlı hareket: eğim ve alan', `
<div class="ikili"><div>${sekil(fXt(76), 'Konum-zaman: doğru. Eğimi hızı verir.')}</div><div>${sekil(fVtSabit(76), 'Hız-zaman: yatay doğru. Alanı yer değiştirmeyi verir.')}</div></div>
<table class="t"><tr><th>Kavram</th><th>Ne demek?</th><th>Örnek (şekildeki cisim)</th></tr>
<tr><td><b>Konum</b> (x)</td><td>Cismin seçilen başlangıç noktasına göre yeri.</td><td>Başta 10 m, $t = 6$ s’de 40 m.</td></tr>
<tr><td><b>Yer değiştirme</b> (Δx)</td><td>Son konum eksi ilk konum. Vektöreldir, işareti yönü verir.</td><td>$\\Delta x = 40 - 10 = 30$ m.</td></tr>
<tr><td><b>Hız</b> (v)</td><td>$v = \\dfrac{\\Delta x}{\\Delta t}$. Sabit hızda x-t grafiği doğrudur.</td><td>$v = 30 / 6 = 5$ m/s.</td></tr>
<tr><td><b>Alınan yol</b></td><td>İzlenen yolun uzunluğu. Skalerdir, negatif olamaz.</td><td>Yön değişmediği için 30 m.</td></tr></table>
${kutu('ana', 'İki grafik, iki kural', '<b>x-t grafiğinde eğim = hız.</b> Eğim negatifse cisim negatif yönde gider. <b>v-t grafiğinde alan = yer değiştirme.</b> Eksenin altındaki alan negatif yönde yer değiştirmedir.')}`),

  bolum(2, 'İvme ve hız değişimi', `
<p>İvme, hızın birim zamandaki değişimidir: $a = \\dfrac{\\Delta v}{\\Delta t} = \\dfrac{v - v_0}{\\Delta t}$ ($v_0$ ilk hız, $v$ son hız). Birimi m/s². 2 m/s² ivme, hızın her saniye 2 m/s değiştiği demektir.</p>
<table class="t"><tr><th>Hız ve ivmenin işaretleri</th><th>Hareket</th><th>Örnek</th></tr>
<tr><td>Aynı işaretli ($v \\gt 0,\\ a \\gt 0$ ya da $v \\lt 0,\\ a \\lt 0$)</td><td><b>Hızlanır</b> (hızın büyüklüğü artar)</td><td>$v = -6$ m/s, $a = -2$ m/s²</td></tr>
<tr><td>Ters işaretli ($v \\gt 0,\\ a \\lt 0$ ya da $v \\lt 0,\\ a \\gt 0$)</td><td><b>Yavaşlar</b> (hızın büyüklüğü azalır)</td><td>$v = 12$ m/s, $a = -3$ m/s²</td></tr>
<tr><td>$a = 0$</td><td>Hız sabit</td><td>Sabit hızlı hareket</td></tr></table>
${kutu('ana', 'Hızlanıyor mu, yavaşlıyor mu?', 'İvmenin işaretine tek başına bakma. <b>Hız ile ivmeyi karşılaştır</b>: işaretleri aynıysa hızlanır, tersse yavaşlar. Negatif ivme her zaman yavaşlama değildir.')}`),

  bolum(3, 'Sabit ivmeli hareketin grafikleri ve matematiksel modeli', `
<div class="ikili"><div>${sekil(fVtIvme(76), 'v-t: eğik doğru. Eğim ivme, alan yer değiştirme.')}</div><div>${sekil(fAt(76), 'a-t: yatay doğru. Alan hız değişimi.')}</div></div>
<table class="t"><tr><th>Grafik</th><th>Eğimi</th><th>Altındaki alan</th></tr>
<tr><td>Konum-zaman (x-t)</td><td>hız</td><td>anlamı yok</td></tr>
<tr><td>Hız-zaman (v-t)</td><td>ivme</td><td>yer değiştirme (Δx)</td></tr>
<tr><td>İvme-zaman (a-t)</td><td>bu konuda kullanılmaz</td><td>hız değişimi (Δv)</td></tr></table>
${kutu('sari', 'Grafikten çıkan 3 eşitlik', '$v = v_0 + a\\,t$ &nbsp;(v-t doğrusunun denklemi)<br>$\\Delta x = v_0\\,t + \\tfrac12\\,a\\,t^2$ &nbsp;(v-t altındaki yamuğun alanı)<br>$\\Delta x = \\dfrac{v_0 + v}{2}\\,t$ &nbsp;(ortalama hız çarpı süre)<br>Şekildeki cisim: $v_0 = 4$ m/s, $a = 2$ m/s², $t = 6$ s. $v = 4 + 2 \\cdot 6 = 16$ m/s, $\\Delta x = 24 + 36 = 60$ m.')}
<p>Sabit ivmeli harekette x-t grafiği doğru değil eğridir (parabol). Hızlanan cisimde eğri giderek dikleşir, yavaşlayan cisimde yatıklaşır.</p>`),

  bolum(4, 'Senaryona göre neye ağırlık vermelisin?', `
<p>Okulun MEB’in dört senaryosundan birini seçer. Öğretmenine hangi senaryonun seçildiğini sor; tablo her öğrenme çıktısından kaç soru geleceğini gösterir.</p>
<table class="t"><tr><th>Öğrenme çıktısı</th><th>Senaryo 1</th><th>Senaryo 2</th><th>Senaryo 3</th><th>Senaryo 4</th></tr>
<tr><td>FİZ.10.1.1 Sabit hızlı hareket</td><td>3</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>FİZ.10.1.2 İvme ve hız değişimi</td><td>2</td><td>3</td><td>3</td><td>3</td></tr>
<tr><td>FİZ.10.1.3 Grafiklerden matematiksel model</td><td>2</td><td>–</td><td>1</td><td>2</td></tr>
<tr><td><b>Toplam soru</b></td><td><b>7</b></td><td><b>6</b></td><td><b>6</b></td><td><b>7</b></td></tr></table>
${kutu('ana', 'Ortak çekirdek', 'Dört senaryoda da <b>sabit hızlı hareket</b> ve <b>ivme</b> var: 1. ve 2. bölüm her senaryoda en az 5 soru eder. Senaryo 2’de grafikten matematiksel model (3. bölümdeki eşitlikler) ayrı soru olarak yok, ama ivme sorularında v-t grafiği yine karşına çıkabilir.')}`),

  hatalar([
    ['x-t grafiğinde çizgi yukarı çıkıyorsa cisim hızlanıyordur.', 'Çizgi doğruysa eğim sabittir, yani hız sabittir. Hızlanma x-t grafiğinde giderek dikleşen eğriyle görünür.'],
    ['Negatif ivme yavaşlama demektir.', 'Hız ve ivme aynı işaretliyse hızlanır. $v = -6$ m/s, $a = -2$ m/s² olan cisim hızlanır.'],
    ['v-t grafiğinin altındaki alanların toplamı alınan yoldur.', 'İşaretli toplam yer değiştirmedir. Yol için eksenin üstündeki ve altındaki alanlar işaretsiz toplanır.'],
    ['Hız sıfırsa ivme de sıfırdır.', 'Cisim yön değiştirirken bir an durur ama ivmesi sıfır değildir. v-t doğrusu zaman eksenini keserken hız sıfırdır, eğim (ivme) sıfır değildir.'],
    ['72 km/h doğrudan formüle yazılır.', 'SI birimine çevir: km/h’yi 3,6’ya böl. 72 km/h = 20 m/s.'],
  ]),

  ornek(1, 'METRO TRENİ (MEB TARZI · 10 PUAN)', `
<div class="ikili s"><div>${sekil(fMetro(84))}</div><div>
<p>Duran bir metro treni 20 s boyunca 1 m/s² ivmeyle düzgün hızlanıyor, sonra 30 s sabit hızla gidiyor, en son 10 s’de düzgün yavaşlayarak bir sonraki durakta duruyor.</p>
<p><b>a)</b> Hız-zaman grafiğini çiziniz. <i>(3 puan)</i><br><b>b)</b> Yavaşlarken ivmesi nedir? <i>(3 puan)</i><br><b>c)</b> İki durak arası uzaklık ve ortalama sürat nedir? <i>(4 puan)</i></p></div></div>
<p><b>a)</b> 20 s sonunda $v = 0 + 1 \\cdot 20 = 20$ m/s (72 km/h). Grafik: 0–20 s eğik çıkış, 20–50 s yatay, 50–60 s eğik iniş.</p>
<p><b>b)</b> $a = \\dfrac{0 - 20}{10} = -2$ m/s². Hız pozitif, ivme negatif: tren yavaşlar.</p>
<p><b>c)</b> Alanlar: $\\tfrac12 \\cdot 20 \\cdot 20 = 200$ m, $30 \\cdot 20 = 600$ m, $\\tfrac12 \\cdot 10 \\cdot 20 = 100$ m. Toplam <b>900 m</b>. Ortalama sürat $900 / 60 = 15$ m/s.</p>
<p><i>Puanlama: a) doğru eksenler 1, doğru 3 parça ve 20 m/s 2. b) formül 1, sonuç ve işaret 2. c) alanlar 3, ortalama sürat 1.</i></p>`),

  ornek(2, 'KARŞILAŞMA (MEB TARZI · 10 PUAN)', `
<div class="ikili s"><div>${sekil(fKars(80))}</div><div>
<p>Düz bir yolda A aracı x = 0’dan 15 m/s, B aracı x = 300 m’den 10 m/s büyüklüğündeki sabit hızlarla aynı anda birbirlerine doğru harekete başlıyor.</p>
<p><b>a)</b> Araçların konum-zaman grafiğini çiziniz. <i>(4 puan)</i><br><b>b)</b> Araçlar ne zaman ve nerede karşılaşır? <i>(6 puan)</i></p></div></div>
<p><b>a)</b> Pozitif yön A’nın hareket yönü olsun. A: $x_A = 15t$, eğimi pozitif doğru. B: $x_B = 300 - 10t$, eğimi negatif doğru.</p>
<p><b>b)</b> Karşılaşmada konumlar eşittir: $15t = 300 - 10t \\Rightarrow 25t = 300 \\Rightarrow t = 12$ s. Konum: $x = 15 \\cdot 12 = 180$ m. Grafikte iki doğrunun kesiştiği nokta.</p>
<p><i>Puanlama: a) her doğru 2. b) eşitliği kurmak 2, süre 2, konum 2.</i></p>`),

  `<h2 class="b"><span class="n">?</span>Sorular <span style="font-size:9.5pt;font-weight:600;color:#5b6684;margin-left:6px">Çoktan seçmeliler 10’ar puan, açık uçlular 10 puan. Toplam 100.</span></h2>`,
  soru(1, { metin: 'Doğrusal yolda hareket eden bir cismin konum-zaman grafiği verilmiştir.', sekil: fS1,
    kok: 'Cismin 0–8 s aralığındaki yer değiştirmesi ve aldığı yol aşağıdakilerden hangisidir?', k: 2,
    siklar: ['Yer değiştirme 0; yol 16 m', 'Yer değiştirme 16 m; yol 16 m', 'Yer değiştirme 0; yol 8 m', 'Yer değiştirme 8 m; yol 16 m', 'Yer değiştirme 16 m; yol 0'] }),
  soru(2, { metin: 'Doğu yönünde 18 m/s hızla giden bir bisikletlinin hızı 4 s’de düzgün olarak 6 m/s’ye iniyor. Doğu pozitif yön seçiliyor.',
    kok: 'Bisikletlinin ivmesi kaç m/s²’dir?', siklar: ['$3$', '$-3$', '$-6$', '$12$', '$-1{,}5$'] }),
  soru(3, { metin: 'Doğrusal yolda hareket eden bir cismin hız-zaman grafiği verilmiştir.', sekil: fS3(62),
    kok: 'Cismin 0–10 s aralığındaki yer değiştirmesi kaç metredir?', siklar: ['$48$', '$60$', '$72$', '$84$', '$96$'] }),
  soru(4, { metin: 'Bir cismin bir andaki hızı $v = -8$ m/s, sabit ivmesi $a = +2$ m/s²’dir.<br>I. Cisim yavaşlamaktadır.<br>II. Cisim negatif yönde hareket etmektedir.<br>III. 4 s sonra cismin hızı sıfır olur.',
    kok: 'Yargılarından hangileri doğrudur?', siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I, II ve III'] }),
  soru(5, { metin: '$t = 0$ anında 4 m/s hızla giden bir cismin ivme-zaman grafiği verilmiştir. İvme hız ile aynı yöndedir.', sekil: fS5,
    kok: 'Cismin 5. saniyenin sonundaki hızı kaç m/s’dir?', siklar: ['$10$', '$14$', '$6$', '$24$', '$20$'] }),
  soru(6, { metin: 'Bir bisiklet 3 m/s hızla giderken 6 s boyunca 0,5 m/s² sabit ivmeyle hızlanıyor.',
    kok: 'Bisiklet bu 6 s’de kaç metre yol alır?', siklar: ['$18$', '$36$', '$9$', '$27$', '$30$'] }),
  soru(7, { metin: '<b>Açık uçlu (10 puan).</b> Aynı doğrusal yolda hareket eden K ve L araçlarının konum-zaman grafiği verilmiştir.', sekil: fS7,
    kok: 'a) K ve L’nin hızlarını yönleriyle yazınız. <i>(4 puan)</i><br>b) Araçlar ne zaman ve hangi konumda karşılaşır? <i>(4 puan)</i><br>c) $t = 6$ s anında araçlar arasındaki uzaklık kaç metredir? <i>(2 puan)</i>' }),
  soru(8, { metin: '<b>Açık uçlu (10 puan).</b> Doğrusal yolda hareket eden bir cismin hız-zaman grafiği verilmiştir.', sekil: fS8,
    kok: 'a) Cismin ivmesini bulunuz. <i>(3 puan)</i><br>b) Cisim hangi zaman aralığında yavaşlar, hangisinde hızlanır? Gerekçesiyle yazınız. <i>(3 puan)</i><br>c) 0–6 s aralığında yer değiştirmeyi ve alınan yolu bulunuz. <i>(4 puan)</i>' }),
  soru(9, { metin: '<b>Açık uçlu (10 puan).</b> 72 km/h hızla giden bir sürücü kırmızı ışığı görüyor. 0,5 s sonra frene basıyor ve araç 4 s’de düzgün yavaşlayarak duruyor. Hareket yönü pozitif seçiliyor.',
    kok: 'a) Sürücü frene basana kadar araç kaç metre yol alır? <i>(2 puan)</i><br>b) Frenleme ivmesi nedir? <i>(3 puan)</i><br>c) Frenleme sırasında araç kaç metre yol alır? <i>(3 puan)</i><br>d) Sürücü ışığı durma çizgisine 45 m kala gördüyse araç çizgiyi geçer mi? <i>(2 puan)</i>' }),
  soru(10, { metin: '<b>Açık uçlu (10 puan).</b> Doğrusal yolda hareket eden bir cismin hızı SI birimlerinde $v = 6 + 2t$ eşitliğiyle veriliyor.',
    kok: 'a) Cismin ilk hızı ve ivmesi nedir? <i>(3 puan)</i><br>b) 5. saniyenin sonunda hızı kaç m/s’dir? <i>(2 puan)</i><br>c) 0–5 s aralığında yer değiştirmesi kaç metredir? <i>(3 puan)</i><br>d) Cismin 0–5 s aralığındaki hız-zaman grafiğini çiziniz. <i>(2 puan)</i>' }),

  cevaplar([
    ['A', '0–2 s: 8 m ileri. 2–4 s: durur. 4–8 s: 8 m geri, $x = 0$’a döner. Yer değiştirme $0 - 0 = 0$. Yol $8 + 8 = 16$ m.'],
    ['B', '$a = \\dfrac{6 - 18}{4} = \\dfrac{-12}{4} = -3$ m/s². Hız pozitif, ivme negatif: bisikletli yavaşlar.'],
    ['C', 'Alan: $\\tfrac12 \\cdot 4 \\cdot 12 + 2 \\cdot 12 + \\tfrac12 \\cdot 4 \\cdot 12 = 24 + 24 + 24 = 72$ m.'],
    ['E', 'I: işaretler ters, yavaşlar (doğru). II: hız negatif, negatif yönde gider (doğru). III: $v = -8 + 2 \\cdot 4 = 0$ (doğru).'],
    ['B', 'a-t altındaki alan $\\Delta v = 2 \\cdot 5 = 10$ m/s. $v = 4 + 10 = 14$ m/s.'],
    ['D', '$\\Delta x = v_0 t + \\tfrac12 a t^2 = 3 \\cdot 6 + \\tfrac12 \\cdot 0{,}5 \\cdot 36 = 18 + 9 = 27$ m. Yön değişmediği için yol da 27 m.'],
    ['–', 'a) K: $60 / 6 = 10$ m/s, pozitif yönde. L: $(0 - 120) / 6 = -20$ m/s, yani 20 m/s negatif yönde. <i>(her biri 2)</i><br>b) $10t = 120 - 20t \\Rightarrow t = 4$ s, $x = 40$ m. <i>(2 + 2)</i><br>c) $t = 6$ s’de K 60 m’de, L 0’da: 60 m. <i>(2)</i>'],
    ['–', 'a) $a = \\dfrac{-4 - 8}{6} = -2$ m/s². <i>(3)</i><br>b) 0–4 s: $v \\gt 0$, $a \\lt 0$, yavaşlar. 4–6 s: $v \\lt 0$, $a \\lt 0$, hızlanır (negatif yönde). <i>(3)</i><br>c) 0–4 s alanı $+\\tfrac12 \\cdot 4 \\cdot 8 = 16$ m, 4–6 s alanı $-\\tfrac12 \\cdot 2 \\cdot 4 = -4$ m. Yer değiştirme $16 - 4 = 12$ m, yol $16 + 4 = 20$ m. <i>(2 + 2)</i>'],
    ['–', '72 km/h $= 72 / 3{,}6 = 20$ m/s. a) $20 \\cdot 0{,}5 = 10$ m. <i>(2)</i><br>b) $a = (0 - 20) / 4 = -5$ m/s². <i>(3)</i><br>c) $\\tfrac{20 + 0}{2} \\cdot 4 = 40$ m. <i>(3)</i><br>d) Toplam $10 + 40 = 50$ m $\\gt 45$ m: çizgiyi 5 m geçer. <i>(2)</i>'],
    ['–', 'a) $v = v_0 + a t$ ile karşılaştır: $v_0 = 6$ m/s, $a = 2$ m/s². <i>(3)</i><br>b) $v = 6 + 2 \\cdot 5 = 16$ m/s. <i>(2)</i><br>c) $\\Delta x = 6 \\cdot 5 + \\tfrac12 \\cdot 2 \\cdot 25 = 30 + 25 = 55$ m (ya da yamuk alanı $\\tfrac{6 + 16}{2} \\cdot 5 = 55$ m). <i>(3)</i><br>d) (0 s, 6 m/s) ile (5 s, 16 m/s) noktalarını birleştiren doğru. <i>(2)</i>'],
  ]),
  sonraki('Yazılıdan sonra kaldığımız yerden: İş (kuvvet–yer değiştirme grafiği)'),
].join('\n');

// --- Instagram slaytları (kapak ve son CTA otomatik) ---
const slaytlar = [
  { pill: '1. YAZILI', h: 'Yazılıda <em>ne çıkıyor?</em>', lst: ['<b>Sabit hızlı hareket</b>: 4 senaryonun hepsinde, 2–3 soru', '<b>İvme ve hız değişimi</b>: hepsinde, 2–3 soru', '<b>Grafikten matematiksel model</b>: senaryo 1, 3 ve 4’te', 'İş ve enerji bu yazılıda <b>yok</b>.'] },
  { pill: 'SABİT HIZ', h: 'x-t’de <em>eğim</em> = hız', svg: fXt(), bd: 'Konum-zaman grafiği doğruysa hız sabittir. Eğim: $30 / 6 = $ <b>5 m/s</b>.' },
  { pill: 'İVME', h: 'Hızlanıyor mu, <em>yavaşlıyor mu?</em>', lst: ['$a = \\dfrac{\\Delta v}{\\Delta t}$, birimi m/s²', '<b>v ile a aynı işaretli</b> → hızlanır', '<b>v ile a ters işaretli</b> → yavaşlar', '$v = -6$, $a = -2$: negatif ivme ama <b>hızlanıyor!</b>'] },
  { pill: 'GRAFİK OKU', h: 'v-t’de eğim ivme, <em>alan yol</em>', svg: fVtIvme(), bd: 'Eğim: <b>2 m/s²</b>. Alan (yamuk): $\\tfrac{4 + 16}{2} \\cdot 6 =$ <b>60 m</b>.' },
  { pill: 'FORMÜLLER', h: 'Grafikten çıkan <em>3 eşitlik</em>', lst: ['$v = v_0 + a\\,t$', '$\\Delta x = v_0\\,t + \\tfrac12\\,a\\,t^2$', '$\\Delta x = \\dfrac{v_0 + v}{2}\\,t$', 'km/h → m/s: <b>3,6’ya böl</b> (72 km/h = 20 m/s)'] },
  { pill: 'DİKKAT', h: 'Puan kaybettiren <em>3 hata</em>', lst: ['<span class="x">✗</span> Negatif ivme = yavaşlama. <span class="v">✓</span> v ile a’nın işaretini karşılaştır.', '<span class="x">✗</span> v-t alanları toplamı = yol. <span class="v">✓</span> İşaretli toplam yer değiştirme.', '<span class="x">✗</span> Hız sıfırsa ivme sıfır. <span class="v">✓</span> Dönüş anında ivme vardır.'] },
  { pill: 'SIRA SENDE', h: '0–10 s’de <em>kaç metre?</em>', svg: fS3(), bd: 'Yer değiştirme: &nbsp;<b>A)</b> 48 &nbsp;<b>B)</b> 60 &nbsp;<b>C)</b> 72 &nbsp;<b>D)</b> 84 &nbsp;<b>E)</b> 96', bant: ['Cevabını yorumlara yaz 👇', 'Çözüm PDF’te'] },
  { pill: 'GÜNLÜK HAYATTA', h: 'İki durak arası <em>kaç metre?</em>', svg: fMetro(), bd: 'Metro 20 s hızlanır, 30 s sabit gider, 10 s’de durur. Alanlar: $200 + 600 + 100 =$ <b>900 m</b>.' },
];

module.exports = {
  sinif: 10, no: 2, gun: 'Çarşamba', yazili: true, yaziliNo: 1,
  slug: '10-fizik-notlari-2-1-yazili-son-tekrar',
  konuKisa: '1. yazılıya son tekrar',
  pdfBaslik: '1. Yazılıya Son Tekrar',
  baslik: '1. Yazılıya Son Tekrar: Sabit Hızlı ve Sabit İvmeli Hareket',
  alt: 'MEB senaryolarına göre konu özeti, grafik okuma, yazılıda en sık yapılan 5 hata, 2 çözümlü MEB tarzı soru, 10 soru, cevaplar ve puanlama.',
  slaytBaslik: '1. yazılıya <span style="color:#e9a400">son tekrar</span>',
  slaytAlt: 'Sabit hız, ivme, grafikler: yazılıda çıkanlar.',
  promoKonu: 'Hareket',
  pdfOzet: 'Konu özeti, 5 hata, 2 çözümlü MEB tarzı soru, <b>10 soru ve puanlama.</b>',
  govde, slaytlar,
  aciklama: `
Fizik yazılısına kaç gün kaldı? ⏳ Kaydır, son tekrarı 1 dakikada yap.

Kaydırınca: 1. yazılıda hangi konudan soru çıkıyor, x-t ve v-t grafiğinde eğim ve alan, hızlanma mı yavaşlama mı, 3 formül, en sık 3 hata ve bir mini soru.

Notun tamamı ücretsiz PDF: senaryolara göre konu özeti, 5 hata, 2 çözümlü MEB tarzı soru, 10 soru ve puanlama.
1) Takip et
2) Profildeki linke dokun
3) 10. sınıf bölümünden notu indir (üyelik yok)

Yazılıya 3 gün kaldıysa Yazılıya 3 Gün Kala 10 kitapçığındaki hazır planla çalışabilirsin.

7. slayttaki sorunun cevabını yorumlara yaz 👇
Her Çarşamba 10. sınıf için yeni not.

#10sınıf #10sınıffizik #maarifmodeli #fizik #fiziknotları #yazılı #ortakyazılı #ivme #benfizikyapamiyorum`,
  ilkYorum: '📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf · 7. slaytın cevabı PDF’in çözüm sayfasında. Yazılında başarılar!',
  hub: {
    etiket: '10. SINIF · MAARİF MODELİ · NOT #2',
    baslik: '1. yazılıya son tekrar: sabit hızlı ve sabit ivmeli hareket',
    aciklama: 'MEB senaryolarına göre konu özeti, grafik okuma, en sık yapılan 5 hata, 2 çözümlü MEB tarzı soru, 10 soru ve puanlama.',
    takvimLink: 'Not #2 · 1. yazılıya son tekrar ↓',
    tarih: '2026-11-04',
    devam: { href: '/yazili-3-gun-kala.html#sinif-sec', img: '/img/yazili3gun/kapak-10-1.webp', lab: 'not10_y3g', b: 'Devamı: Yazılıya 3 Gün Kala · 10. sınıf', span: '3 günlük plan, MEB tarzı sorular, prova yazılısı', em: '₺199 →' },
  },
};
