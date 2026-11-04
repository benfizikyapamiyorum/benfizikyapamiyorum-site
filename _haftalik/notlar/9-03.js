// 9. sınıf · Not #3 · 1. yazılıya son tekrar (yazılı haftası) · FİZ.9.1.1–9.1.4, FİZ.9.2.1–9.2.3
const { kare, dogru, bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki } = require('../lib');

const MAVI = '#2563eb', TURUNCU = '#ea580c', YESIL = '#0f766e', MOR = '#7c3aed', KOYU = '#0f172a';

// --- Şekiller ---
const fYol = (w) => kare({ cols: 10, rows: 4, s: 30, width: w, olcek: false,
  vecs: [
    { x: 1, y: 3, dx: 7, dy: 0, lab: '1) 7 kare doğuya', c: MAVI, lp: 'u', it: false, size: 15 },
    { x: 8, y: 2, dx: -3, dy: 0, lab: '2) 3 kare batıya', c: TURUNCU, lp: 'u', it: false, size: 15 },
    { x: 1, y: 1, dx: 4, dy: 0, lab: 'yer değiştirme', c: KOYU, lp: 'u', it: false, size: 15, dash: '7 5' },
  ],
  cizgi: [{ x1: 1, y1: 0, x2: 1, y2: 4 }, { x1: 8, y1: 2, x2: 8, y2: 3 }],
  notes: [{ x: 9.5, y: 0.25, t: '1 kare = 10 m', c: '#64748b', size: 12, a: 'end' }] });
const fDogru = (w) => dogru({ min: -3, max: 5, s: 40, width: w,
  rows: [{ x0: 0, d: 4, lab: 'A = 4 birim sağa', c: MAVI }, { x0: 4, d: -6, lab: 'B = 6 birim sola', c: TURUNCU }],
  R: { x0: 0, d: -2, lab: 'R = 2 birim sola', c: KOYU } });
const fS5 = (w) => kare({ cols: 14, rows: 4, s: 28, width: w, olcek: false,
  cizgi: [{ x1: 6, y1: 0, x2: 6, y2: 4, c: '#94a3b8' }],
  vecs: [
    { x: 6, y: 3, dx: 6, dy: 0, lab: 'F₁', c: MAVI, lp: 'tip', it: false },
    { x: 6, y: 2, dx: -2, dy: 0, lab: 'F₂', c: TURUNCU, lp: 'tip', it: false },
    { x: 6, y: 1, dx: -1, dy: 0, lab: 'F₃', c: MOR, lp: 'tip', it: false },
  ],
  notes: [{ x: 13.7, y: 0.3, t: '1 kare = 4 N', c: '#64748b', size: 12, a: 'end' }, { x: 13.7, y: 3.6, t: 'doğu →', c: '#64748b', size: 12, a: 'end' }] });
const fS6 = kare({ cols: 11, rows: 4, s: 28, width: 70, olcek: false,
  vecs: [
    { x: 4, y: 3, dx: 5, dy: 0, lab: '1. bölüm', c: MAVI, lp: 'u', it: false, size: 14 },
    { x: 9, y: 2, dx: -8, dy: 0, lab: '2. bölüm', c: TURUNCU, lp: 'd', it: false, size: 14 },
  ],
  cizgi: [{ x1: 9, y1: 2, x2: 9, y2: 3 }],
  notes: [{ x: 3.6, y: 2.8, t: 'K', c: KOYU, size: 15, a: 'end', w: 800 }, { x: 0.75, y: 1.8, t: 'M', c: KOYU, size: 15, a: 'end', w: 800 }, { x: 9.4, y: 2.3, t: 'L', c: KOYU, size: 15, a: 'start', w: 800 }, { x: 10.9, y: 0.25, t: '1 kare = 10 m', c: '#64748b', size: 11.5, a: 'end' }] });
const fS9 = kare({ cols: 10, rows: 4, s: 28, width: 62, olcek: true,
  vecs: [
    { x: 1, y: 3, dx: 2, dy: 0, lab: 'A', c: MAVI, lp: 'u' },
    { x: 8, y: 2, dx: -4, dy: 0, lab: 'B', c: TURUNCU, lp: 'u' },
    { x: 2, y: 1, dx: 6, dy: 0, lab: 'C', c: YESIL, lp: 'u' },
  ] });

// --- PDF gövdesi ---
const govde = [
  kutu('sari', 'Yazılıda ne çıkıyor?', 'MEB konu-soru dağılım tablosuna göre 9. sınıf fizik 1. ortak yazılısı <b>Fizik Bilimi ve Kariyer Keşfi</b> ünitesinin tamamından ve <b>Kuvvet ve Hareket</b> ünitesinin ilk üç konusundan gelir. Uç uca ekleme ve paralelkenar yöntemi, temel kuvvetler ve hareket türleri bu yazılıda yok. Senaryolara göre soru sayıları 5. bölümde.'),

  bolum(1, 'Fizik bilimi ve alt dalları', `
<p>Fizik; madde, enerji, hareket ve bunlar arasındaki etkileşimleri gözlem, deney ve modellerle inceler. Bir olayın hangi alt dalla ilgili olduğunu <b>incelenen süreç</b> belirler, cihazın adı değil.</p>
<table class="t"><tr><th>Alt dal</th><th>Neyi inceler?</th><th>Örnek olay</th></tr>
<tr><td><b>Mekanik</b></td><td>Hareket, kuvvet, denge</td><td>Köprünün dengede durması</td></tr>
<tr><td><b>Elektromanyetizma</b></td><td>Elektrik yükü, akım, manyetizma</td><td>Pusula iğnesinin kuzeyi göstermesi</td></tr>
<tr><td><b>Termodinamik</b></td><td>Isı, sıcaklık, enerji aktarımı</td><td>Çaydanlıkta suyun ısınması</td></tr>
<tr><td><b>Optik</b></td><td>Işık, yansıma, kırılma</td><td>Gökkuşağının oluşması</td></tr>
<tr><td><b>Katı hâl fiziği</b></td><td>Katıların yapısı, yarı iletkenler</td><td>Telefon işlemcisindeki yarı iletkenler</td></tr>
<tr><td><b>Atom fiziği</b></td><td>Atomun yapısı, enerji düzeyleri</td><td>Neon lambanın renkli ışık vermesi</td></tr>
<tr><td><b>Nükleer fizik</b></td><td>Çekirdek, radyoaktif süreçler</td><td>Nükleer santralde çekirdeğin bölünmesi</td></tr>
<tr><td><b>Yüksek enerji ve plazma fiziği</b></td><td>Temel parçacıklar, iyonlaşmış madde</td><td>CERN’de parçacık çarpıştırma</td></tr></table>
${kutu('ana', 'Bir cihaz, birden çok alt dal', 'Telefonun kamerası optikle, işlemcisi katı hâl fiziğiyle, şarj olması elektromanyetizmayla ilgilidir. Yazılıda “hangi alt dal?” sorusunda olayı adlandır ve gerekçesini yaz.')}`),

  bolum(2, 'Fizik bilimine yön verenler ve kariyer keşfi', `
<table class="t"><tr><th>Bilim insanı</th><th>Çalışması</th><th>Alt dal</th><th>Ondan çıkarabileceğin</th></tr>
<tr><td><b>İbnülheysem</b></td><td>Işık ve görme</td><td>Optik</td><td>Bir iddiayı gözlem ve deneyle sınamak</td></tr>
<tr><td><b>Isaac Newton</b></td><td>Hareket yasaları, kütle çekimi</td><td>Mekanik</td><td>Olayı matematiksel bir modelle açıklamak</td></tr>
<tr><td><b>Marie Curie</b></td><td>Radyoaktivite</td><td>Nükleer fizik</td><td>Düzenli ölçüm ve sabırla veri toplamak</td></tr>
<tr><td><b>Feza Gürsey</b></td><td>Temel parçacıklar ve simetri</td><td>Yüksek enerji ve plazma fiziği</td><td>Kuramsal düşünme ve uluslararası iş birliği</td></tr></table>
<table class="t"><tr><th>Kurum</th><th>Fizikle ilişkisi</th><th>Meslek örneği</th></tr>
<tr><td>CERN</td><td>Parçacık araştırmaları</td><td>Fizikçi, mühendis</td></tr>
<tr><td>Türkiye Uzay Ajansı (TUA)</td><td>Uydu ve uzay araştırmaları</td><td>Fizik ya da uzay mühendisi</td></tr>
<tr><td>ASELSAN</td><td>Elektronik, algılama sistemleri</td><td>Elektrik-elektronik mühendisi</td></tr>
<tr><td>MTA</td><td>Yer bilimleri, ölçüm</td><td>Jeofizik mühendisi</td></tr></table>
${kutu('ana', 'Açık uçlu cevap kalıbı', '<b>Kurum + fizikle bağlantı + meslek.</b> “TUA’da uyduların yörüngede hareketi mekanikle hesaplanır; bu alanda uzay mühendisi çalışabilir.” Yalnız isim saymak tam puan getirmez.')}`),

  bolum(3, 'Temel ve türetilmiş nicelikler', `
<div class="ikili">
<table class="t"><tr><th>Temel nicelik</th><th>SI birimi</th></tr>
<tr><td>Uzunluk</td><td>metre (m)</td></tr><tr><td>Kütle</td><td>kilogram (kg)</td></tr><tr><td>Zaman</td><td>saniye (s)</td></tr>
<tr><td>Elektrik akımı</td><td>amper (A)</td></tr><tr><td>Sıcaklık</td><td>kelvin (K)</td></tr><tr><td>Madde miktarı</td><td>mol (mol)</td></tr><tr><td>Işık şiddeti</td><td>kandela (cd)</td></tr></table>
<table class="t"><tr><th>Türetilmiş nicelik</th><th>SI birimi</th></tr>
<tr><td>Alan</td><td>m²</td></tr><tr><td>Hacim</td><td>m³</td></tr><tr><td>Hız</td><td>m/s</td></tr><tr><td>İvme</td><td>m/s²</td></tr>
<tr><td>Özkütle</td><td>kg/m³</td></tr><tr><td>Kuvvet</td><td>newton (N) = kg·m/s²</td></tr><tr><td>Enerji</td><td>joule (J) = kg·m²/s²</td></tr></table></div>
${kutu('sari', 'Kural', 'SI’da <b>7 temel nicelik</b> vardır; başka niceliklerden elde edilmez. Geri kalan bütün nicelikler bunlardan <b>türetilir</b>. Birimi temel birimlerin çarpımı, bölümü ya da kuvveti olarak yazılıyorsa (m/s, kg/m³, m²) nicelik türetilmiştir.')}`),

  bolum(4, 'Skaler ve vektörel nicelikler, aynı doğrultudaki vektörler', `
<div class="ikili s"><div>${sekil(fYol(80), 'Hepsi aynı doğrultuda; oklar okunsun diye alt alta çizildi. Yol: 70 + 30 = 100 m. Yer değiştirme: 40 m doğu.')}</div>
<table class="t"><tr><th>Skaler (sayı + birim)</th><th>Vektörel (sayı + birim + yön)</th></tr>
<tr><td>Kütle, zaman, sıcaklık</td><td>Kuvvet, ağırlık</td></tr>
<tr><td>Hacim, özkütle, enerji</td><td>Hız, ivme</td></tr>
<tr><td>Alınan yol, sürat</td><td>Yer değiştirme</td></tr></table></div>
<p>Vektörel niceliği tam söylemek için yönü de vermek gerekir: “5 N” eksiktir, “5 N doğuya” tamdır. Skaler nicelikler sayı ve birimle tamamlanır: “2 kg”.</p>
<div class="ikili s"><div>${sekil(fDogru(78), 'Ters yönlü vektörler: büyük olandan küçüğü çıkar, yön büyüğün yönü.')}</div><div>
${kutu('ana', 'Aynı doğrultudaki vektörler', 'Bir yönü $+$ seç. Aynı yönlü vektörlerin büyüklükleri toplanır, ters yönlülerin çıkarılır. $R = (+4) + (-6) = -2$: 2 birim sola. $k\\vec A$ vektörü A ile aynı doğrultudadır; büyüklüğü $|k|$ katıdır, $k$ negatifse yönü terstir.')}
<p style="font-size:9.2pt;color:#5b6684">Bu öğrenme çıktısı (FİZ.9.2.3) yalnız senaryo 1, 2 ve 5’te var.</p></div></div>`),

  bolum(5, 'Senaryona göre neye ağırlık vermelisin?', `
<p>Okulun MEB’in beş senaryosundan birini seçer. Öğretmenine sor; tablo her öğrenme çıktısından kaç soru geleceğini gösterir.</p>
<table class="t"><tr><th>Öğrenme çıktısı</th><th>S1</th><th>S2</th><th>S3</th><th>S4</th><th>S5</th></tr>
<tr><td>FİZ.9.1.1 Fizik biliminin tanımı</td><td>1</td><td>1</td><td>–</td><td>1</td><td>–</td></tr>
<tr><td>FİZ.9.1.2 Fiziğin alt dalları</td><td>1</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>FİZ.9.1.3 Fizik bilimine yön verenler</td><td>1</td><td>–</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>FİZ.9.1.4 Kariyer keşfi</td><td>1</td><td>1</td><td>1</td><td>1</td><td>–</td></tr>
<tr><td>FİZ.9.2.1 Temel ve türetilmiş nicelikler</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>FİZ.9.2.2 Skaler ve vektörel nicelikler</td><td>1</td><td>1</td><td>1</td><td>–</td><td>1</td></tr>
<tr><td>FİZ.9.2.3 Aynı doğrultudaki vektörler</td><td>1</td><td>1</td><td>–</td><td>–</td><td>1</td></tr>
<tr><td><b>Toplam soru</b></td><td><b>7</b></td><td><b>7</b></td><td><b>6</b></td><td><b>6</b></td><td><b>5</b></td></tr></table>
${kutu('ana', 'Ortak çekirdek', 'Beş senaryonun hepsinde <b>fiziğin alt dalları</b> ve <b>temel-türetilmiş nicelikler</b> var. Önce bu ikisini sağlamlaştır. Senaryon 3 ya da 4 ise vektör sorusu gelmez; 4 ise skaler-vektörel sorusu da gelmez.')}`),

  hatalar([
    ['Kütle ile ağırlık aynı niceliktir.', 'Kütle skalerdir, birimi kg. Ağırlık bir kuvvettir, vektöreldir, birimi N.'],
    ['Sıcaklığın SI birimi santigrat derecedir (°C).', 'SI birimi kelvindir (K). Sıcaklık temel niceliktir.'],
    ['Newton (N) bir temel birimdir.', 'Türetilmiştir: N = kg·m/s². Kuvvet türetilmiş niceliktir.'],
    ['Yol ile yer değiştirme aynı şeydir.', 'Yol skalerdir, yönsüz toplanır. Yer değiştirme vektöreldir: 70 m doğu, 30 m batı yürüyen için yol 100 m, yer değiştirme 40 m doğu.'],
    ['Bir cihaz yalnız bir alt dalla ilgilidir.', 'Alt dalı incelenen süreç belirler. Telefonda kamera optik, işlemci katı hâl fiziği, şarj elektromanyetizma.'],
  ]),

  ornek(1, 'ALT DALLAR (MEB TARZI · 10 PUAN)', `
<p>Aşağıdaki olayların her biri en çok hangi fizik alt dalıyla ilgilidir? Gerekçesini yazınız. <i>(5 × 2 puan)</i></p>
<table class="t"><tr><th>Olay</th><th>Alt dal</th><th>Gerekçe</th></tr>
<tr><td>a) Gözlük camının ışığı kırarak net görmeyi sağlaması</td><td><b>Optik</b></td><td>Işığın kırılması incelenir.</td></tr>
<tr><td>b) Buzdolabının içerideki ısıyı dışarı aktarması</td><td><b>Termodinamik</b></td><td>Isı ve enerji aktarımı incelenir.</td></tr>
<tr><td>c) MR cihazında güçlü mıknatısların kullanılması</td><td><b>Elektromanyetizma</b></td><td>Manyetik etkiler incelenir.</td></tr>
<tr><td>d) Nükleer santralde çekirdeklerin bölünmesi</td><td><b>Nükleer fizik</b></td><td>Çekirdekteki dönüşüm incelenir.</td></tr>
<tr><td>e) Güneş panelindeki yarı iletken hücreler</td><td><b>Katı hâl fiziği</b></td><td>Katıların ve yarı iletkenlerin yapısı incelenir.</td></tr></table>
<p><i>Puanlama: her satırda alt dal 1, gerekçe 1 puan.</i></p>`),

  ornek(2, 'NİCELİKLER VE BİRİMLER (MEB TARZI · 10 PUAN)', `
<p><b>a)</b> 1 N, 1 kg kütleli bir cisme 1 m/s² ivme kazandıran kuvvettir. Buna göre kuvvetin birimi olan newtonu (N) temel birimler cinsinden yazınız. <i>(4 puan)</i><br><b>b)</b> Özkütlenin SI birimini yazıp niceliği temel/türetilmiş ve skaler/vektörel olarak sınıflandırınız. <i>(3 puan)</i><br><b>c)</b> “Hız; uzunluk ve zaman niceliklerinden türetilir.” yargısı doğru mudur? Gerekçesiyle yazınız. <i>(3 puan)</i></p>
<p><b>a)</b> Tanımdaki kütle birimi kg ile ivme birimi m/s² çarpılır: $1\\ \\text{N} = 1\\ \\text{kg} \\cdot \\text{m/s}^2$. Kg, m ve s temel birimlerdir.</p>
<p><b>b)</b> Özkütle = kütle / hacim, birimi <b>kg/m³</b>. İki niceliğin bölümünden elde edildiği için <b>türetilmiş</b>, yönü olmadığı için <b>skaler</b>.</p>
<p><b>c)</b> <b>Doğru.</b> Hız, yer değiştirmenin zamana bölümüdür; birimi m/s, uzunluk (m) ve zaman (s) birimlerinden oluşur.</p>
<p><i>Puanlama: a) kg ile m/s²’yi ilişkilendirmek 2, sonuç 2. b) birim 1, iki sınıflandırma 1 + 1. c) karar 1, gerekçe 2.</i></p>`),

  `<h2 class="b"><span class="n">?</span>Sorular <span style="font-size:9.5pt;font-weight:600;color:#5b6684;margin-left:6px">Çoktan seçmeliler 10’ar puan, açık uçlular 10 puan. Toplam 100.</span></h2>`,
  soru(1, { metin: 'Fiziğin alt dallarından optik, ışığı ve ışıkla ilgili olayları inceler.', kok: 'Aşağıdaki olaylardan hangisi en çok optikle ilgilidir?', k: 2,
    siklar: ['Sıcak asfaltta serap görülmesi', 'Buzun erimesi', 'Pusula iğnesinin kuzeyi göstermesi', 'Radyoaktif bir maddenin bozunması', 'Topun yokuş aşağı yuvarlanması'] }),
  soru(2, { metin: 'Bir öğrenci defterine dört birim yazıyor:<br>I. kilogram (kg) &nbsp;&nbsp;II. newton (N) &nbsp;&nbsp;III. kelvin (K) &nbsp;&nbsp;IV. metre/saniye (m/s)',
    kok: 'Bunlardan hangileri SI’daki temel birimlerdendir?', siklar: ['I ve II', 'I ve III', 'II ve IV', 'III ve IV', 'I, III ve IV'] }),
  soru(3, { metin: 'Nicelikler temel ya da türetilmiş, skaler ya da vektörel olarak sınıflandırılabilir.', kok: 'Aşağıdakilerden hangisi hem türetilmiş hem de vektörel bir niceliktir?',
    siklar: ['Kütle', 'Zaman', 'Enerji', 'Kuvvet', 'Sıcaklık'] }),
  soru(4, { metin: 'Katı hâl fiziği katıların yapısını ve özelliklerini inceler.', kok: 'Aşağıdakilerden hangisi en çok katı hâl fiziğinin çalışma alanına girer?', k: 2,
    siklar: ['Mercekle görüntü oluşturulması', 'Çaydanlıkta suyun ısınması', 'LED lambadaki yarı iletken malzemeler', 'Bir arabanın frenleyip yavaşlaması', 'Mıknatısın demir tozunu çekmesi'] }),
  soru(5, { metin: 'Yatay düzlemdeki bir kutuya aynı doğrultuda $F_1$, $F_2$ ve $F_3$ kuvvetleri etki ediyor. Kuvvetler kareli düzlemde ölçekli çizilmiştir.', sekil: fS5(84),
    kok: 'Bu üç kuvvetin bileşkesi aşağıdakilerden hangisidir?', siklar: ['36 N, doğu', '12 N, doğu', '12 N, batı', '20 N, doğu', '16 N, doğu'] }),
  soru(6, { metin: 'Bir öğrenci okul koridorunda K noktasından L’ye, sonra L’den M’ye yürüyor. Yürüyüş kareli düzlemde ölçekli gösterilmiştir; 2. bölüm L’den başlar, okunsun diye alt satıra çizilmiştir.', sekil: fS6,
    kok: 'Öğrencinin K’dan M’ye aldığı yol ve yer değiştirmesi aşağıdakilerden hangisidir?', k: 2,
    siklar: ['Yol 30 m; yer değiştirme 130 m batı', 'Yol 130 m; yer değiştirme 30 m doğu', 'Yol 130 m; yer değiştirme 130 m batı', 'Yol 80 m; yer değiştirme 30 m batı', 'Yol 130 m; yer değiştirme 30 m batı'] }),
  soru(7, { metin: '<b>Açık uçlu (10 puan).</b> Bilim insanları: <b>İbnülheysem, Isaac Newton, Marie Curie, Feza Gürsey</b>.<br>a) Işığın ve görmenin deneylerle incelenmesi<br>b) Hareket yasaları ve evrensel kütle çekimi<br>c) Radyoaktivite araştırmaları<br>d) Temel parçacıklar ve simetri üzerine kuramsal çalışmalar',
    kok: 'Her çalışmayı listedeki bir bilim insanıyla eşleştiriniz ve çalışmanın en çok hangi alt dalla ilgili olduğunu yazınız. <i>(4 × 2 puan)</i><br>e) Bu bilim insanlarından birinin çalışma biçiminden kendi öğrenmen için bir çıkarım yazınız. <i>(2 puan)</i>' }),
  soru(8, { metin: '<b>Açık uçlu (10 puan).</b> Uydu tasarlamak isteyen bir öğrenci Türkiye Uzay Ajansı (TUA) gibi bir kurumda çalışmayı hedefliyor.',
    kok: 'a) Bir uydunun tasarımında fizik bilgisinin kullanıldığı iki çalışmayı, ilgili alt dallarıyla birlikte yazınız. <i>(6 puan)</i><br>b) Bu kurumda çalışabilecek bir meslek adı yazınız. <i>(2 puan)</i><br>c) Öğrenci bu meslek hakkında güvenilir bilgiye nereden ulaşabilir? Bir kaynak yazınız. <i>(2 puan)</i>' }),
  soru(9, { metin: '<b>Açık uçlu (10 puan).</b> Kareli düzlemde aynı doğrultudaki A, B ve C vektörleri verilmiştir.', sekil: fS9,
    kok: 'a) $\\vec B$ vektörünü $\\vec A$ cinsinden yazınız. <i>(3 puan)</i><br>b) $\\vec C$ vektörünü $\\vec A$ cinsinden yazınız. <i>(3 puan)</i><br>c) $\\vec A + \\vec B + \\vec C$ bileşkesinin büyüklüğünü ve yönünü bulup $\\vec A$ cinsinden yazınız. <i>(4 puan)</i>' }),
  soru(10, { metin: '<b>Açık uçlu (10 puan).</b> Bir öğrencinin ölçüm tablosundaki nicelikler ve birimleri: zaman (s), ağırlık (N), hacim (m³), hız (m/s), madde miktarı (mol).',
    kok: 'Her niceliği temel ya da türetilmiş ve skaler ya da vektörel olarak sınıflandırınız. <i>(5 × 2 puan)</i>' }),

  cevaplar([
    ['A', 'Serap, ışığın sıcaklığı farklı hava katmanlarından geçerken kırılmasıyla oluşur: optik. B termodinamik, C elektromanyetizma, D nükleer fizik, E mekanik.'],
    ['B', 'kg (kütle) ve K (sıcaklık) temel birimdir. N = kg·m/s² ve m/s türetilmiştir.'],
    ['D', 'Kuvvet, kütle ve ivmeden türetilir; yönü vardır. Kütle, zaman ve sıcaklık temel ve skaler; enerji türetilmiş ama skaler.'],
    ['C', 'LED’deki yarı iletkenler katıların yapısıyla ilgilidir. A optik, B termodinamik, D mekanik, E elektromanyetizma.'],
    ['B', '1 kare = 4 N: $F_1 = 24$ N doğu, $F_2 = 8$ N batı, $F_3 = 4$ N batı. Doğu $+$: $24 - 8 - 4 = +12$. Bileşke 12 N, doğu.'],
    ['E', 'K’dan L’ye 5 kare (50 m) doğu, L’den M’ye 8 kare (80 m) batı. Yol $50 + 80 = 130$ m. Yer değiştirme $+50 - 80 = -30$: 30 m batı.'],
    ['–', 'a) İbnülheysem, optik. b) Newton, mekanik. c) Marie Curie, nükleer fizik. d) Feza Gürsey, yüksek enerji ve plazma fiziği. <i>(her biri: isim 1, alt dal 1)</i><br>e) Örnek: “İbnülheysem gibi bir bilgiyi deneyle sınamadan kabul etmemeliyim.” <i>(2)</i>'],
    ['–', 'a) Örnekler: uydunun yörüngedeki hareketinin hesaplanması (mekanik), güneş panelleri ve elektronik devreler (elektromanyetizma ya da katı hâl fiziği), kamera ve teleskop mercekleri (optik), uydunun ısınıp soğumasının denetimi (termodinamik). Her doğru çalışma ve alt dal 3. <i>(3 + 3)</i><br>b) Uzay mühendisi, fizikçi, elektrik-elektronik mühendisi. <i>(2)</i><br>c) Kurumun resmî internet sitesi, üniversitelerin bölüm tanıtımları, rehber öğretmen. <i>(2)</i>'],
    ['–', 'A: 2 birim sağa. B: 4 birim sola. C: 6 birim sağa.<br>a) Boy 2 katı, yön ters: $\\vec B = -2\\vec A$. <i>(3)</i><br>b) Boy 3 katı, yön aynı: $\\vec C = 3\\vec A$. <i>(3)</i><br>c) Sağ $+$: $2 - 4 + 6 = +4$. 4 birim sağa, yani $2\\vec A$. <i>(4)</i>'],
    ['–', 'Zaman: temel, skaler. Ağırlık: türetilmiş, vektörel. Hacim: türetilmiş, skaler. Hız: türetilmiş, vektörel. Madde miktarı: temel, skaler. <i>(her nicelik 1 + 1)</i>'],
  ]),
  sonraki('Yazılıdan sonra kaldığımız yerden: Vektörler 2, farklı doğrultularda uç uca ekleme'),
].join('\n');

// --- Instagram slaytları (kapak ve son CTA otomatik) ---
const slaytlar = [
  { pill: '1. YAZILI', h: 'Yazılıda <em>ne çıkıyor?</em>', lst: ['<b>Fiziğin alt dalları</b> ve <b>temel-türetilmiş nicelikler</b>: 5 senaryonun hepsinde', '<b>Bilim insanları, kariyer, skaler-vektörel</b>: çoğu senaryoda', '<b>Aynı doğrultudaki vektörler</b>: senaryo 1, 2 ve 5’te', 'Uç uca ekleme ve hareket bu yazılıda <b>yok</b>.'] },
  { pill: 'ALT DALLAR', h: 'Olaya bak, <em>alt dalı bul</em>', lst: ['Gökkuşağı → <b>optik</b>', 'Çaydanlıkta ısınan su → <b>termodinamik</b>', 'Pusula iğnesi → <b>elektromanyetizma</b>', 'Telefon işlemcisi → <b>katı hâl fiziği</b>', 'Nükleer santral → <b>nükleer fizik</b>'] },
  { pill: 'YÖN VERENLER', h: 'Kim, ne yaptı, <em>ne öğrenirim?</em>', lst: ['<b>İbnülheysem</b>: ışık ve görme. İddiayı deneyle sına.', '<b>Newton</b>: hareket yasaları. Olayı modelle açıkla.', '<b>Marie Curie</b>: radyoaktivite. Sabırla ölç.', '<b>Feza Gürsey</b>: temel parçacıklar. Kuramsal düşün.'] },
  { pill: 'NİCELİKLER', h: '7 temel nicelik, <em>gerisi türetilmiş</em>', lst: ['Uzunluk (m) · Kütle (kg) · Zaman (s)', 'Elektrik akımı (A) · Sıcaklık (K)', 'Madde miktarı (mol) · Işık şiddeti (cd)', 'Türetilmiş: hız m/s, kuvvet <b>N = kg·m/s²</b>'] },
  { pill: 'GÜNLÜK HAYATTA', h: 'Yol mu, <em>yer değiştirme mi?</em>', svg: fYol(), bd: '70 m doğu, 30 m batı. <b>Yol</b> (skaler): 100 m. <b>Yer değiştirme</b> (vektörel): <b>40 m doğu</b>.' },
  { pill: 'DİKKAT', h: 'Puan kaybettiren <em>3 hata</em>', lst: ['<span class="x">✗</span> Kütle = ağırlık. <span class="v">✓</span> Kütle skaler (kg), ağırlık vektörel (N).', '<span class="x">✗</span> Sıcaklığın SI birimi °C. <span class="v">✓</span> Kelvin (K).', '<span class="x">✗</span> Newton temel birim. <span class="v">✓</span> N = kg·m/s², türetilmiş.'] },
  { pill: 'SIRA SENDE', h: 'Bileşke kuvvet <em>kaç N?</em>', svg: fS5(), bd: '1 kare = 4 N. &nbsp;<b>A)</b> 36 N doğu &nbsp;<b>B)</b> 12 N doğu &nbsp;<b>C)</b> 12 N batı &nbsp;<b>D)</b> 20 N doğu &nbsp;<b>E)</b> 16 N doğu', bant: ['Cevabını yorumlara yaz 👇', 'Çözüm PDF’te'] },
  { pill: 'VEKTÖRLER', h: '4 sağa + 6 sola = <em>?</em>', svg: fDogru(), bd: 'Sağ $+$, sol $-$: $(+4) + (-6) = -2$, yani <b>2 birim sola</b>. Senaryo 1, 2 ve 5’te soru var.' },
];

module.exports = {
  sinif: 9, no: 3, gun: 'Pazartesi', yazili: true, yaziliNo: 1,
  slug: '9-fizik-notlari-3-1-yazili-son-tekrar',
  konuKisa: '1. yazılıya son tekrar',
  pdfBaslik: '1. Yazılıya Son Tekrar',
  baslik: '1. Yazılıya Son Tekrar: Fizik Bilimi, Nicelikler ve Vektörler',
  alt: 'MEB senaryolarına göre konu özeti, yazılıda en sık yapılan 5 hata, 2 çözümlü MEB tarzı soru, 10 soru, cevaplar ve puanlama.',
  slaytBaslik: '1. yazılıya <span style="color:#22b8cf">son tekrar</span>',
  slaytAlt: 'Alt dallar, nicelikler, vektörler: yazılıda çıkanlar.',
  promoKonu: 'Fizik bilimi ve nicelikler',
  pdfOzet: 'Konu özeti, 5 hata, 2 çözümlü MEB tarzı soru, <b>10 soru ve puanlama.</b>',
  govde, slaytlar,
  aciklama: `
Fizik yazılısına kaç gün kaldı? ⏳ Kaydır, son tekrarı 1 dakikada yap.

Kaydırınca: 1. yazılıda hangi konudan soru çıkıyor, fiziğin alt dalları, fizik bilimine yön verenler, 7 temel nicelik, yol ve yer değiştirme, en sık 3 hata ve bir mini soru.

Notun tamamı ücretsiz PDF: senaryolara göre konu özeti, 5 hata, 2 çözümlü MEB tarzı soru, 10 soru ve puanlama.
1) Takip et
2) Profildeki linke dokun
3) 9. sınıf bölümünden notu indir (üyelik yok)

Yazılıya 3 gün kaldıysa Yazılıya 3 Gün Kala 9 kitapçığındaki hazır planla çalışabilirsin.

7. slayttaki sorunun cevabını yorumlara yaz 👇
Her Pazartesi 9. sınıf için yeni not.

#9sınıf #9sınıffizik #maarifmodeli #fizik #fiziknotları #yazılı #ortakyazılı #nicelikler #benfizikyapamiyorum`,
  ilkYorum: '📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf · 7. slaytın cevabı PDF’in çözüm sayfasında. Yazılında başarılar!',
  hub: {
    etiket: '9. SINIF · MAARİF MODELİ · NOT #3',
    baslik: '1. yazılıya son tekrar: fizik bilimi, nicelikler ve vektörler',
    aciklama: 'MEB senaryolarına göre konu özeti, en sık yapılan 5 hata, 2 çözümlü MEB tarzı soru, 10 soru ve puanlama.',
    takvimLink: 'Not #3 · 1. yazılıya son tekrar ↓',
    tarih: '2026-11-02', hafta: '2026-11-02',
    devam: { href: '/yazili-3-gun-kala.html#sinif-sec', img: '/img/yazili3gun/kapak-9-1.webp', lab: 'not9_y3g', b: 'Devamı: Yazılıya 3 Gün Kala · 9. sınıf', span: '3 günlük plan, MEB tarzı sorular, prova yazılısı', em: '₺199 →' },
  },
};
