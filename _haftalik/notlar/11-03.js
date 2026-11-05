// 11. sınıf Not #3. 1. yazılıya son tekrar. FİZ.11.1.1-5.
const { bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki, ok, txt } = require('../lib');
const { grafik } = require('./grafik');
const MOR = '#7c3aed';
const svg = (body,w=520,h=250) => `<svg class="sk" viewBox="0 0 ${w} ${h}" style="width:145mm;max-width:100%">${body}</svg>`;
const fDusme = () => grafik({tmax:4,dt:1,sx:70,ymax:40,dy:10,sy:5,xlab:'t (s)',ylab:'v (m/s)',cizgi:[{pts:[[0,0],[4,40]],c:MOR}],kesik:[[4,40]],notes:[{t:1.9,y:28,s:'eğim = 10 m/s²',c:MOR,size:18}],width:130});
const fYatay = () => {
  let b='<path d="M55 45 H105 V225 H470" fill="none" stroke="#64748b" stroke-width="3"/>';
  const X=t=>105+120*t,Y=t=>45+45*t*t;
  let pts=Array.from({length:41},(_,i)=>`${X(i/20)},${Y(i/20)}`).join(' ');
  b+=`<polyline points="${pts}" fill="none" stroke="${MOR}" stroke-width="3"/>`;
  for(let t of [0,0.5,1,1.5,2]) b+=`<circle cx="${X(t)}" cy="${Y(t)}" r="6" fill="${MOR}"/>`;
  b+=ok(105,45,185,45,'#2563eb')+txt(150,24,'v₀ yatay',{size:17});
  b+=txt(73,145,'h',{size:21})+txt(220,246,'Yatayda eşit sürede eşit yol.',{size:16});
  return svg(b,520,265);
};
const fEgik = () => {
  let b='<path d="M40 220 H495" stroke="#64748b" stroke-width="2"/>';
  let pts=Array.from({length:61},(_,i)=>{let t=i/20;return `${50+140*t},${220-16*(15*t-5*t*t)}`}).join(' ');
  b+=`<polyline points="${pts}" fill="none" stroke="${MOR}" stroke-width="3"/>`;
  b+=ok(260,40,350,40,'#2563eb')+ok(260,40,260,115,'#ea580c');
  b+=txt(306,23,'vₓ ≠ 0',{size:18,c:'#2563eb'})+txt(282,95,'g ↓',{a:'start',size:18,c:'#ea580c'});
  b+=txt(260,155,'Tepede vᵧ = 0',{size:19})+txt(260,180,'ama a = g aşağı.',{size:19});
  return svg(b,520,250);
};
const fKuvvet = (m=4,right=18,left=6) => {
  const cy=145,cx=260,scale=2.5;
  let b='<rect x="230" y="118" width="60" height="54" rx="5" fill="#f1ecfd" stroke="#7c3aed" stroke-width="2"/>';
  b+=ok(cx,cy,cx,cy-m*10*scale,'#0f766e')+ok(cx,cy,cx,cy+m*10*scale,'#ea580c');
  b+=ok(cx,cy,cx+right*scale,cy,'#2563eb')+ok(cx,cy,cx-left*scale,cy,'#be185d');
  b+=txt(cx+19,cy-m*10*scale+12,`N = ${m*10} N`,{a:'start',size:17,c:'#0f766e'});
  b+=txt(cx+19,cy+m*10*scale,`mg = ${m*10} N`,{a:'start',size:17,c:'#ea580c'});
  b+=txt(cx+right*scale+16,cy-9,`${right} N`,{a:'start',size:18,c:'#2563eb'});
  b+=txt(cx-left*scale-16,cy-9,`${left} N`,{a:'end',size:18,c:'#be185d'});
  b+=txt(85,40,`${m} kg`,{size:22,c:MOR})+txt(260,282,'Yatay yüzey sürtünmesizdir.',{size:17});
  return svg(b,520,300);
};
const senaryo=`<table class="t"><tr><th>Öğrenme çıktısı</th><th>S1</th><th>S2</th><th>S3</th><th>S4</th></tr><tr><td>11.1.1 Serbest düşmede ivme</td><td>2</td><td>1</td><td>1</td><td>1</td></tr><tr><td>11.1.2 Serbest düşmede kanıt</td><td>-</td><td>1</td><td>-</td><td>1</td></tr><tr><td>11.1.3 İki boyutta hareket</td><td>2</td><td>2</td><td>2</td><td>2</td></tr><tr><td>11.1.4 Newton'ın yasaları</td><td>2</td><td>2</td><td>2</td><td>2</td></tr><tr><td>11.1.5 Serbest cisim diyagramı</td><td>1</td><td>-</td><td>1</td><td>1</td></tr><tr><td><b>Toplam</b></td><td><b>7</b></td><td><b>6</b></td><td><b>6</b></td><td><b>7</b></td></tr></table>`;
const veri=`<table class="t"><tr><th>t (s)</th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>Aşağı yönde alınan yol (m)</th><td>0</td><td>5</td><td>20</td><td>45</td></tr></table>`;
const sorular=[
{metin:'Aynı yükseklikten, aynı anda ve ilk hızsız bırakılan m ve 3m kütleli cisimler için hava direnci ihmal ediliyor.',kok:'Cisimler yere hangi sırayla ulaşır?',siklar:['m önce','3m önce','Aynı anda','Yüksekliğe göre sıra değişir','Belirlenemez']},
{metin:'İlk hızsız serbest bırakılan bir cismin hareket verileri aşağıdadır.'+veri,kok:'Verilerden hangi sonuca ulaşılır?',siklar:['İvme sıfırdır.','Hız sabittir.','İvme her saniye artar.','İvme 10 m/s²’dir.','Kütle bilinmeden ivme bulunamaz.'],k:2},
{metin:'Bir cisim yerden 20 m yükseklikten 6 m/s hızla yatay doğrultuda fırlatılıyor.',sekil:fYatay().replace('width:145mm','width:85mm'),kok:'Cisim yere ulaşana kadar yatayda kaç metre ilerler?',siklar:['6','9','12','18','24']},
{metin:'Bir cisim yerden 20 m/s hızla, yatayla 30° açı yapacak biçimde yukarı doğru eğik olarak fırlatılıyor.',kok:'Yörüngenin tepe noktasında ivme vektörü nasıldır?',siklar:['Sıfır','10 m/s² yukarı','20 m/s² aşağı','10 m/s² yatay','10 m/s² aşağı'],k:2},
{metin:'Sürtünmesiz yatay yüzeydeki 4 kg cisme sağa 18 N, sola 6 N kuvvet uygulanıyor. Düşeyde N = mg.',sekil:fKuvvet().replace('width:145mm','width:105mm'),kok:'Cismin ivmesi nedir?',siklar:['3 m/s² sağa','6 m/s² sağa','3 m/s² sola','12 m/s² sağa','Sıfır'],k:2},
{metin:'Bir kitap masaya aşağı yönde 12 N kuvvet uyguluyor.',kok:'Bu kuvvetin Newton’ın üçüncü yasasındaki eş kuvveti hangisidir?',siklar:['Dünya’nın kitaba çekim kuvveti','Masanın kitaba 12 N yukarı kuvveti','Kitabın Dünya’ya çekim kuvveti','Masanın Dünya’ya çekim kuvveti','Kitaba etki eden net kuvvet'],k:1},
{metin:'<b>Açık uçlu (10 puan).</b> Bir cisim yerden 80 m yükseklikten ilk hızsız serbest bırakılıyor.',kok:'a) Yere ulaşma süresini bulunuz. (3 puan)<br>b) Yere çarpmadan hemen önceki süratini bulunuz. (3 puan)<br>c) Yere ulaşmadan önceki son 1 saniyede aldığı yolu bulunuz. (4 puan)',ek:'<div style="height:17mm"></div>'},
{metin:'<b>Açık uçlu (10 puan).</b> Bir cisim 45 m yüksekliğindeki platformdan 12 m/s hızla yatay doğrultuda fırlatılıyor.',kok:'a) Uçuş süresini bulunuz. (3 puan)<br>b) Yatayda aldığı yolu bulunuz. (3 puan)<br>c) Yere çarpmadan hemen önce hızının yatay ve düşey bileşenlerini yönleriyle yazınız. (4 puan)',ek:'<div style="height:17mm"></div>'},
{metin:'<b>Açık uçlu (10 puan).</b> Bir sporcu topu yatayla 37° açı yapacak şekilde 50 m/s hızla yukarı doğru fırlatıyor. Top fırlatıldığı yüksekliğe geri dönüyor. sin 37° = 3/5 ve cos 37° = 4/5 alınız.',kok:'a) İlk hızın yatay ve düşey bileşenlerini bulunuz. (2 puan)<br>b) Tepeye çıkış süresini bulunuz. (2 puan)<br>c) Başlangıca göre en büyük yüksekliği bulunuz. (3 puan)<br>d) Menzili bulunuz. (3 puan)',ek:'<div style="height:17mm"></div>'},
{metin:'<b>Açık uçlu (10 puan).</b> Sürtünmesiz düz yatay yüzeyde duran 5 kg araba, sağa doğru yatay ve sabit 20 N kuvvetle çekiliyor. Düşey doğrultuda hareket yoktur.',kok:'a) Arabaya etki eden gerçek kuvvetleri gösteren serbest cisim diyagramını çiziniz. (4 puan)<br>b) Net kuvveti ve ivmeyi bulunuz. (3 puan)<br>c) İlk hızı sıfır olan arabanın 3 s sonundaki hızını yönüyle yazınız. (3 puan)',ek:'<div style="height:17mm"></div>'}
];
const page='<div class="sb"></div>';
const govde=[
kutu('sari','Yazılıdan önce','Bu not, 11. sınıf 1. dönem 1. yazılı için serbest düşme, iki boyutta sabit ivmeli hareket ve Newton’ın yasalarını toplar. Okulunun seçtiği senaryoyu öğretmeninden öğren. Tüm sorularda <b>g = 10 m/s²</b> ve hava direnci ihmal edilmiştir.'),
bolum(1,'Hangi konudan kaç soru?',senaryo+'<p style="font-size:8.3pt">S1-S4, MEB konu-soru dağılım tablosundaki dört senaryodur. “-” o öğrenme çıktısından ayrı soru ayrılmadığını gösterir. Sürtünme, limit hız ve çembersel hareket bu tablonun 1. yazılı sütunlarında yer almaz.</p>'),
bolum(2,'Serbest düşme. Veriden ivmeye',`<p>Aynı yerde, hava direnci yokken bütün cisimler <b>kütlelerinden bağımsız olarak aynı g ivmesiyle</b> düşer. İlk hız sıfır ve aşağı yön pozitif seçilirse:</p>${kutu('ana','Üç bağlantı','<b>v = gt</b> &nbsp; | &nbsp; <b>h = ½gt²</b> &nbsp; | &nbsp; <b>v² = 2gh</b>')}${veri}<p>Eşit birer saniyede alınan yollar 5, 15, 25 m’dir. Oran <b>1 : 3 : 5</b> olur. Toplam yol t² ile orantılıdır. Bu veriler sabit ivmeli harekete kanıt oluşturur.</p>`),
page,
bolum(3,'İki boyutta hareket. Eksenleri ayır',`<div class="ikili"><div>${sekil(fYatay(),'Yatay doğrultuda fırlatılan cisim.')}</div><div><p>Yatay eksende <b>aₓ = 0</b>, dolayısıyla vₓ sabittir.</p><p>Düşey eksende <b>aᵧ = g</b> aşağı yönlüdür.</p><p>İki eksende geçen <b>süre aynıdır</b>. Önce düşey hareketten süreyi bul, sonra yatay uzaklığı hesapla.</p></div></div>${kutu('ana','Yatay doğrultuda fırlatma','Aşağı yön pozitif seçilirse <b>h = ½gt²</b> ve <b>vᵧ = gt</b> olur.<br>Yatayda <b>x = v₀t</b>. Yatay ilk hız, aynı h yüksekliğinden yere düşme süresini değiştirmez.')}<table class="t"><tr><th>Örnek</th><th>İşlem</th><th>Sonuç</th></tr><tr><td>h = 45 m, v₀ = 12 m/s</td><td>45 = 5t²</td><td>t = 3 s</td></tr><tr><td>Yatay uzaklık</td><td>x = 12 × 3</td><td>36 m</td></tr><tr><td>Düşey son hız</td><td>vᵧ = 10 × 3</td><td>30 m/s aşağı</td></tr></table><p>Hız bileşenlerini ayrı yaz. Hızın büyüklüğü istenirse dik bileşenlerden Pisagor bağıntısıyla bulunur.</p>`),
bolum(4,'Eğik olarak fırlatma. Tepede ne olur?',`<div class="ikili"><div>${sekil(fEgik())}</div><div><p>Yatay hız sabittir. Düşey hız çıkarken azalır, tepede sıfır olur, inerken aşağı yönde artar.</p><p><b>Tepede yalnız vᵧ sıfırdır.</b> vₓ sıfır değildir ve ivme yine g kadar aşağı yönlüdür.</p></div></div><table class="t"><tr><th>Yukarı yön pozitif</th><th>Bağıntı</th></tr><tr><td>İlk hız bileşenleri</td><td>v₀ₓ = v₀ cos θ, v₀ᵧ = v₀ sin θ</td></tr><tr><td>Düşey hız ve yer değiştirme</td><td>vᵧ = v₀ᵧ - gt, Δy = v₀ᵧt - ½gt²</td></tr><tr><td>Tepeye çıkış süresi</td><td>tç = v₀ᵧ / g</td></tr><tr><td>Aynı yüksekliğe dönüyorsa</td><td>T = 2tç, menzil = v₀ₓT</td></tr></table>`),
page,
bolum(5,'Newton’ın yasaları ve serbest cisim diyagramı',`<table class="t"><tr><th>Yasa</th><th>Yazılıda kullanacağın düşünce</th></tr><tr><td>1. yasa. Eylemsizlik</td><td>Net kuvvet sıfırsa hız değişmez. Cisim durabilir veya sabit hızla hareket edebilir.</td></tr><tr><td>2. yasa. Dinamiğin temel yasası</td><td>Net kuvvet = kütle × ivme. İvme net kuvvetle aynı yöndedir.</td></tr><tr><td>3. yasa. Etki-tepki</td><td>Eşit büyüklükte, zıt yönlü kuvvetler <b>farklı cisimlere</b> etki eder.</td></tr></table><div class="ikili"><div>${sekil(fKuvvet(),'Ok uzunlukları kuvvet büyüklükleriyle orantılıdır.')}</div><div><p>Önce inceleyeceğin cismi seç. O cisme etki eden <b>gerçek kuvvetleri</b> çiz.</p><p>Yatayda Fnet = 18 - 6 = <b>12 N sağa</b>.</p><p>a = 12 / 4 = <b>3 m/s² sağa</b>.</p><p>Düşeyde a = 0 olduğu için N = mg = 40 N.</p></div></div>${kutu('ana','Diyagrama fazladan kuvvet ekleme','“ma” net kuvvetin sonucudur. Diyagrama yeni bir kuvvet olarak çizilmez. Normal kuvvetin mg’ye eşitliği, düşeyde başka kuvvet olmadığında ve düşey ivme sıfırken geçerlidir.')}`),
hatalar([
['Ağır cisim daha çabuk düşer.','Hava direnci yokken aynı yerden aynı ilk hızla bırakılan cisimlerin ivmeleri ve düşme süreleri aynıdır.'],
['Yatay hız artarsa yere düşme süresi kısalır.','Aynı yükseklikten yatay fırlatmada süreyi düşey hareket belirler.'],
['Eğik fırlatmada tepede ivme sıfırdır.','Tepede vᵧ = 0 olur. İvme g büyüklüğünde aşağı yönlüdür.'],
['Cisim hareket ediyorsa net kuvvet vardır.','Sabit hızlı hareket için net kuvvet sıfırdır. Net kuvvet hızın değişimini belirler.'],
['Etki ve tepki aynı cisimde birbirini yok eder.','Etki-tepki kuvvetleri farklı cisimlere etki eder. Bir cismin diyagramında yalnız o cisme etki eden kuvvetler vardır.']]),
page,
bolum(6,'İki çözümlü yazılı sorusu','<p>İşlem basamaklarını ve yön seçimini göster. Sonucun yanında SI birimini yaz.</p>'),
ornek(1,'LABORATUVAR MASASI (10 PUAN)',`<p>Bir bilye 1,25 m yüksekliğindeki yatay masanın kenarından 2 m/s yatay hızla ayrılıyor.</p><p><b>a)</b> Yere ulaşma süresini bulunuz. (3 puan)<br><b>b)</b> Masa kenarının düşey izdüşümünden kaç metre uzağa düşer? (3 puan)<br><b>c)</b> Yere çarpmadan hemen önceki düşey hızını bulunuz. (4 puan)</p>${sekil(fYatay(),'Hava direnci ihmal edilir. Bilye yatay ilk hızla masadan ayrılır.')}<p><b>a)</b> 1,25 = ½ × 10 × t². Buradan t² = 0,25 ve <b>t = 0,5 s</b>.</p><p><b>b)</b> x = v₀t = 2 × 0,5 = <b>1 m</b>.</p><p><b>c)</b> vᵧ = gt = 10 × 0,5 = <b>5 m/s aşağı</b>.</p><p><i>Puanlama. a) düşey hareket denklemi 1, süre 2. b) yatay hareket denklemi 1, sonuç 2. c) işlem 2, büyüklük 1, yön 1.</i></p>`),
ornek(2,'DENEY ARABASI (10 PUAN)',`<p>Sürtünmesiz düz yatay yüzeydeki 3 kg deney arabasına sağa 15 N ve sola 3 N yatay kuvvet uygulanıyor. Araba başlangıçta duruyor.</p><p><b>a)</b> Serbest cisim diyagramını çiziniz. (4 puan)<br><b>b)</b> İvmeyi bulunuz. (3 puan)<br><b>c)</b> 2 s sonundaki hızını bulunuz. (3 puan)</p><p><b>a)</b> Ağırlık <b>30 N aşağı</b>, normal kuvvet <b>30 N yukarı</b>, uygulanan kuvvetler <b>15 N sağa</b> ve <b>3 N sola</b>.</p><p><b>b)</b> Fnet = 15 - 3 = 12 N sağa. a = 12 / 3 = <b>4 m/s² sağa</b>.</p><p><b>c)</b> v = 0 + 4 × 2 = <b>8 m/s sağa</b>.</p><p><i>Puanlama. a) dört doğru kuvvet ve yönün her biri 1. b) net kuvvet 1, ivmenin büyüklüğü ve yönü 2. c) bağıntı 1, sonuç ve yön 2.</i></p>`),
page,
bolum('?','Kendini dene. 6 çoktan seçmeli soru','<p>Her soru 10 puandır. Açık uçlu sorularla birlikte toplam 100 puan. g = 10 m/s². Hava direnci ihmal edilir.</p>'),
...sorular.slice(0,3).map((q,i)=>soru(i+1,q)),
page,
bolum('?','Kendini dene. Kuvvet ve hareket','<p>Her soru 10 puandır. g = 10 m/s². Hava direnci ihmal edilir.</p>'),
...sorular.slice(3,6).map((q,i)=>soru(i+4,q)),
page,
bolum('?','Yazılı provası. 4 açık uçlu soru','<p>g = 10 m/s². Hava direnci ihmal edilir. Her soruda bağıntıyı, işlemi, birimi ve gereken yönü göster.</p>'),
...sorular.slice(6).map((q,i)=>soru(i+7,q)),
page,
cevaplar([
['C','İvme g, kütleden bağımsızdır. Aynı yükseklik ve sıfır ilk hız için düşme süresi aynıdır.'],
['D','h = ½at². Örneğin t = 2 s için 20 = ½a × 4, buradan a = 10 m/s². Diğer veriler de bunu doğrular.'],
['C','20 = 5t² olduğundan t = 2 s. x = 6 × 2 = 12 m. <b>Instagram 7. slayttaki mini sorunun cevabı da C, 12 m.</b>'],
['E','Hava direnci yokken hareket boyunca tek ivme yer çekimi ivmesidir. Tepede de 10 m/s² aşağı yönlüdür.'],
['A','Yatay net kuvvet 18 - 6 = 12 N sağa. a = 12 / 4 = 3 m/s² sağa.'],
['B','Kitabın masaya uyguladığı kuvvetin eşi, masanın kitaba uyguladığı kuvvettir. Kuvvetler farklı cisimlere etki eder.'],
['-','a) 80 = 5t² → t = <b>4 s</b>. Denklem 1, süre 2 puan.<br>b) v = 10 × 4 = <b>40 m/s</b>. Bağıntı 1, sonuç 2 puan.<br>c) İlk 3 s’de 5 × 3² = 45 m düşer. Son saniyede 80 - 45 = <b>35 m</b>. İlk 3 s yolu 2, fark 2 puan.'],
['-','a) 45 = 5t² → <b>3 s</b>. Denklem 1, sonuç 2 puan.<br>b) x = 12 × 3 = <b>36 m</b>. Bağıntı 1, sonuç 2 puan.<br>c) vₓ = <b>12 m/s fırlatılma yönünde</b>, vᵧ = <b>30 m/s aşağı</b>. Her bileşen ve yönü 2 puan.'],
['-','a) v₀ₓ = 50 × 4/5 = <b>40 m/s</b>, v₀ᵧ = 50 × 3/5 = <b>30 m/s yukarı</b>. Her biri 1 puan.<br>b) 0 = 30 - 10t → <b>3 s</b>. Denklem ve sonuç 1’er puan.<br>c) hmax = 30 × 3 - 5 × 3² = <b>45 m</b>. Bağıntı 1, işlem ve sonuç 2 puan.<br>d) Aynı yüksekliğe dönüşte T = 6 s. Menzil = 40 × 6 = <b>240 m</b>. Süre 1, bağıntı ve sonuç 2 puan.'],
['-','a) <b>mg = 50 N aşağı, N = 50 N yukarı, çekme kuvveti = 20 N sağa</b>. Üç kuvvet ve doğru yönler 3, normal kuvvetin 50 N olması 1 puan.<br>b) Fnet = <b>20 N sağa</b>, a = 20 / 5 = <b>4 m/s² sağa</b>. Net kuvvet 1, ivme 2 puan.<br>c) v = 0 + 4 × 3 = <b>12 m/s sağa</b>. Bağıntı 1, sonuç ve yön 2 puan.']
]),
kutu('ana','Son kontrol','Kuvvet sorusunda cismi seç ve diyagramı çiz. Hareket sorusunda yön seç, eksenleri ayır, zamanı ortak kullan. Birimini yaz ve bulduğun sonucun fiziksel anlamını kontrol et.'),
sonraki('Serbest cisim diyagramı ile yeni yazılı soruları'),
'<p style="font-size:8pt;margin-top:10px">Kapsam kaynağı. MEB 2026-2027 11. sınıf fizik konu-soru dağılım tablosu. Sitedeki <a href="https://benfizikyapamiyorum.com/ucretsiz/11-Sinif-MEB-Senaryolari.pdf">MEB senaryoları derlemesi, sayfa 4</a>. Sorular BFY için özgün hazırlanmıştır. Bu çalışma resmî sınav sorusu değildir.</p>'
].join('\n');
const slaytlar=[
{pill:'1. YAZILI',h:'Yazılıda <em>ne çıkıyor?</em>',lst:['<b>Serbest düşme</b>. İvme ve veriden çıkarım.','<b>İki boyutta hareket</b>. Her senaryoda 2 soru.','<b>Newton’ın yasaları</b>. Her senaryoda 2 soru.','<b>Serbest cisim diyagramı</b>. Senaryo 1, 3 ve 4’te.'],bant:['4 MEB senaryosu','Toplam 6–7 soru']},
{pill:'SERBEST DÜŞME',h:'Kütle değişse de <em>ivme aynı.</em>',bd:'Hava direnci yok. İlk hız sıfır. Aşağı yön pozitif.',svg:fDusme(),lst:['<b>v = gt</b> &nbsp; ve &nbsp; <b>h = ½gt²</b>','Eşit sürelerde yollar <b>1 : 3 : 5</b> oranında.']},
{pill:'YATAY FIRLATMA',h:'Önce <em>süreyi bul.</em>',svg:fYatay(),lst:['Düşeyde <b>h = ½gt²</b> → süre.','Yatayda <b>x = v₀t</b> → uzaklık.'],bant:['Aynı yükseklik','Yatay hız süreyi değiştirmez']},
{pill:'EĞİK FIRLATMA',h:'Tepede <em>ne sıfır?</em>',svg:fEgik(),lst:['Yalnız düşey hız bileşeni <b>vᵧ = 0</b>.','Yatay hız devam eder. İvme <b>10 m/s² aşağı</b>.']},
{pill:'NEWTON',h:'Diyagramı çiz. <em>Net kuvveti bul.</em>',svg:fKuvvet(),bd:'Fnet = 18 - 6 = <b>12 N sağa</b>.<br>a = 12 / 4 = <b>3 m/s² sağa</b>.'},
{pill:'DİKKAT',h:'Puan kaybettiren <em>3 hata</em>',lst:['<span class="x">✗</span> Ağır cisim önce düşer.<br><span class="v">✓</span> Hava direnci yokken ivmeler aynıdır.','<span class="x">✗</span> Tepede ivme sıfırdır.<br><span class="v">✓</span> İvme yine g kadar aşağıdır.','<span class="x">✗</span> Etki-tepki aynı cisimdedir.<br><span class="v">✓</span> Farklı cisimlere etki eder.']},
{pill:'SIRA SENDE',h:'Yatayda <em>kaç metre?</em>',bd:'Cisim <b>20 m</b> yükseklikten <b>6 m/s</b> hızla yatay fırlatılıyor. g = 10 m/s². Hava direnci yok.',svg:fYatay().replace('width:145mm','width:145mm;max-height:290px'),sik:['6 m','9 m','12 m','18 m','24 m'],bant:['Cevabını yorumlara yaz','Çözüm PDF’te']},
{pill:'GÜNLÜK HAYAT',h:'Masadan ayrılan <em>bilye.</em>',bd:'Masa yüksekliği <b>1,25 m</b>.<br>Yatay hız <b>2 m/s</b>.<br>Hava direnci ihmal ediliyor.',lst:['1,25 = 5t² → <b>t = 0,5 s</b>','x = 2 × 0,5 → <b>1 m ileri</b>','vᵧ = 10 × 0,5 → <b>5 m/s aşağı</b>'],bant:['İki eksen','Tek süre']}
];
module.exports={sinif:11,no:3,gun:'Cuma',yazili:true,yaziliNo:1,slug:'11-fizik-notlari-3-1-yazili-son-tekrar',konuKisa:'1. yazılıya son tekrar',pdfBaslik:'1. Yazılıya Son Tekrar',baslik:'1. Yazılıya Son Tekrar',alt:'Serbest düşme, iki boyutta hareket ve Newton’ın yasaları. Konu özeti, 5 sık hata, 2 çözümlü örnek, 10 soru ve puanlama.',slaytBaslik:'1. yazılıya <em>son tekrar</em>',slaytAlt:'Serbest düşme, iki boyutta hareket, Newton’ın yasaları.',pdfOzet:'Konu özeti, 5 sık hata, 2 çözümlü örnek, <b>10 soru ve puanlama.</b>',govde,slaytlar,
aciklama:`Fizik yazılısına kaç gün kaldı? ⏳ 11. sınıflar, son tekrar burada.

Kaydır, yazılıdan önce şu noktaları kontrol et:
✅ Dört MEB senaryosunda hangi konudan kaç soru var?
✅ Serbest düşmede kütle ve ivme
✅ Yatay fırlatmada önce süre, sonra uzaklık
✅ Eğik fırlatmada tepe noktasında ne sıfır?
✅ Newton’ın yasaları ve serbest cisim diyagramı
❌ Puan kaybettiren 3 hata
❓ 7. slaytta bir mini soru

📄 Not #3 ücretsiz PDF olarak hazır. Konu özeti, 5 sık hata, 2 çözümlü örnek, 6 test sorusu, 4 açık uçlu soru, çözümler ve puanlama içeriyor.
1) Takip et
2) Profildeki linke dokun
3) 11. sınıf bölümünden notu indir (üyelik yok)

Yazılıya 3 Gün Kala 11 kitapçığındaki hazır planı da kullanabilirsin.

7. slayttaki sorunun cevabını yorumlara yaz 👇 Yazılıya girecek arkadaşına gönder.
Her Cuma 11. sınıf için yeni not.

#11sınıf #11sınıffizik #fizik #fiziknotları #benfizikyapamiyorum`,
ilkYorum:'📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf · 7. slaytın cevabı PDF’in çözüm sayfasında. Yazılında başarılar!',
hub:{etiket:'11. SINIF · MAARİF MODELİ · NOT #3',baslik:'1. yazılıya son tekrar: serbest düşme, iki boyutta hareket ve Newton’ın yasaları',aciklama:'MEB senaryolarına göre konu özeti, 5 sık hata, 2 çözümlü örnek, 10 soru, çözümler ve puanlama.',takvimLink:'Not #3 · 1. yazılıya son tekrar ↓',tarih:'2026-11-06',devam:{href:'/yazili-3-gun-kala.html#sinif-sec',img:'/img/yazili3gun/kapak-11-1.webp',lab:'not11_y3g',b:'Devamı: Yazılıya 3 Gün Kala · 11. sınıf',span:'3 günlük plan, MEB tarzı sorular, prova yazılısı',em:'İncele →'}}};
