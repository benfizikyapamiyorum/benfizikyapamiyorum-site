# Haftalık ücretsiz fizik notu: görev tanımı

Timur Hoca'nın (Ben Fizik Yapamıyorum) Instagram "BFY Fizik Notları" serisi ve sitedeki ücretsiz PDF sayfası
(benfizikyapamiyorum.com/ucretsiz/pdf, Instagram bio linki) için her hafta not üretilir.

- **Pazartesi 9. sınıf, Çarşamba 10. sınıf, Cuma 11. sınıf.**
- Konu: `ucretsiz/pdf.html` içindeki `takvim-<sınıf>` bölümünde, o güne denk gelen satır (`data-not="YYYY-AA-GG"` olan `tk-bekle`). Satırdaki `tk-k` metni haftanın konusudur. Tatil satırında (`tk-tatil`) not yok.
- Not numarası: `notlar/<sınıf>-fizik-notlari-<no>-...pdf` dosyalarındaki en büyük numara + 1.
- Timur "yayınla" demeden siteye hiçbir şey gönderilmez.

## Klasör

`_haftalik/` (Jekyll bunu yayımlamaz):
- `lib.js` (PDF parçaları, kareli düzlem `kare()`, sayı doğrusu `dogru()`), `promo.js` (son sayfa: Yapabilirim tanıtımı), `slides.js` (Instagram 1080×1350), `build.js`, `hub.py`
- `notlar/<sınıf>-<no iki hane>.js`: her notun içeriği. **Biçim örneği: `notlar/9-02.js`** (Timur'un onayladığı düzen).

## Adımlar

1. `cd _haftalik && npm i` (katex, @fontsource/source-sans-3, qrcode; Playwright sistemde kurulu).
2. `notlar/<sınıf>-<no>.js` yaz. 9-02.js ile aynı yapı:
   - Başlık kutusu, 3–4 bölüm (her bölümde en az bir doğru ölçekli şekil ya da tablo), "Sık yapılan 5 hata", 2 çözümlü örnek (biri günlük hayattan, gerçekçi sayılarla), 10 soru (9 çoktan seçmeli + 1 açık uçlu; en az 3'ü şekilli), cevaplar ve çözümler, "Gelecek hafta" bandı (takvimdeki bir sonraki konu).
   - 8 içerik slaytı (kapak ve son CTA otomatik): kavramlar, şekiller, sık hatalar, "Sıra sende" mini soru (cevabı PDF'te), günlük hayattan örnek.
   - `aciklama` (Instagram açıklaması: kanca soru, kaydırınca ne var, "1) Takip et 2) Profildeki linke dokun 3) <sınıf>. sınıf bölümünden notu indir", "Her <gün> <sınıf>. sınıf için yeni not", hashtag'ler), `ilkYorum`, `hub` alanları (`tarih` = takvim satırının `data-not` değeri; `devam` Yapabilirim <sınıf> sayfasına).
3. Kurallar (ihlal = itibar kaybı):
   - Maarif Modeli programına ve o sınıfın düzeyine uy (9'da trigonometri yok, bileşenler yalnız dik koordinat sistemi). Kapsam dışı konu ekleme.
   - Terimler Maarif kitabındaki gibi: "yatay doğrultuda fırlatılan / eğik olarak fırlatılan" (atış yerine), "bileşke", "Newton'ın".
   - g = 10 m/s². Birimler SI. Her sayısal cevabı Python ile hesaplayıp doğrula.
   - Metinde "·" ayırıcıyı cümle içinde kullanma (yalnız etiket/başlıklarda). Cümleler noktayla biter.
   - Ders kitabından soru, sayı kümesi ya da bağlam kopyalama.
   - Şekiller gerçekçi ve ölçekli: oklar doğru uzunlukta, etiketler çakışmasız, kareli düzlemde koordinatlar tam sayı.
4. **Bağımsız kontrol:** Cevap anahtarını görmeyen ayrı bir ajana 10 soruyu baştan çözdür ve fizik/kapsam/dil hatası arat. Uyuşmazlık varsa düzelt.
5. `node build.js notlar/<dosya>.js` → `out/<slug>/`: PDF, kapak webp, `slayt/*.png`, `aciklama.txt`, `meta.json`.
6. **Görsel denetim:** PDF'in her sayfasını (pdftoppm -r 110) ve her slaytı Read ile tek tek incele. Taşma, çakışan etiket, boş sayfa, sayfa sonunda yarım kalan soru olmasın. Düzelt, yeniden derle.
7. Timur'a gönder (SendUserFile): PDF, kapak slaytı, tüm slaytlar (zip), açıklama metni ve ilk yorum. Kısa özet: konu, sayfa sayısı, mini sorunun cevabı. "Yayınlayayım mı?" diye sor.
8. "yayınla" gelince: `python3 hub.py out/<slug>/meta.json ..` → `git add notlar/<slug>.* ucretsiz/pdf.html _haftalik/notlar/<dosya>.js` → commit ("<sınıf>. sınıf haftalık not #<no>: <konu>") → push. 1–2 dakika sonra `curl https://benfizikyapamiyorum.com/ucretsiz/pdf` ile canlıda olduğunu doğrula ve Timur'a bildir.

## Yazılı haftaları: takvim konusu yerine "yazılıya son tekrar" notu (Timur'un kararı)

Okullarda ortak yazılı haftasındaysa ya da yazılıya 10 günden az kaldıysa takvimdeki yeni konunun notu **yazılmaz** (öğrencinin o an işine yaramaz). Onun yerine o sınıfın sıradaki yazılısı için **"<k>. yazılıya son tekrar"** notu hazırlanır:
- Kapsam: `ucretsiz/<sınıf>-Sinif-MEB-Senaryolari.pdf` (MEB ortak yazılı konu-soru dağılım senaryoları). Senaryoların ortak konularına ağırlık ver, okulun seçtiği senaryoya göre değişen konuları ayrıca belirt. Kapsam dışı konu yok (ör. 9. sınıf 1. yazılıda vektörler yok).
- Yapı: konu konu kısa özet (formül ve kavram kutuları, şekiller), "yazılıda en çok kaybedilen puanlar" (5 hata), 2 çözümlü MEB tarzı açık uçlu soru (alt maddeli, puanlı), 10 soru (en az 4'ü MEB tarzı açık uçlu ve puanlı, kalanı çoktan seçmeli), cevaplar ve puanlama. Maarif terimleri kullanılır.
- Not dosyasında `yazili: true, yaziliNo: <1|2>` ver: son sayfa otomatik olarak Yazılıya 3 Gün Kala tanıtımı olur. `hub.devam`: `{ href: '/yazili-3-gun-kala.html#sinif-sec', img: '/img/yazili3gun/kapak-<sınıf>-<k>.webp', lab: 'not<sınıf>_y3g', b: 'Devamı: Yazılıya 3 Gün Kala · <sınıf>. sınıf', span: '3 günlük plan, MEB tarzı sorular, prova yazılısı', em: '₺199 →' }`.
- Takvim satırı yine o haftanın `data-not` satırıdır; `takvimLink`: "Not #<no> · <k>. yazılıya son tekrar ↓". "Gelecek hafta" bandında takvimdeki bir sonraki gerçek konuyu yaz.
- Instagram: kanca "Yazılıya kaç gün kaldı?" tarzında; açıklamada Yazılıya 3 Gün Kala'yı tek cümleyle an.
- Yazılı tarihleri: 2026-2027 MEB çalışma takvimi ve ortak yazılı takvimini web'de ara ve resmî kaynaktan doğrula. Bilinen: 1. dönem 1. yazılılar Kasım'ın ilk iki haftası (ara tatil 16–20 Kasım). Bu dönemde (13 Kasım'a kadar) bütün notlar yazılı notudur.
- **Tek seferlik:** 4 Kasım (Çarşamba) çalışmasında 10. sınıf notuna ek olarak 9. sınıf "1. yazılıya son tekrar" notunu da hazırla; Instagram'a Perşembe 5 Kasım 20.00'ye planlanır (takvimde 2–6 Kasım satırının not bağlantısı bu notla değişir, vektör notu `notlar/` içinde kalır, sayfanın "Bu haftanın notu" kartı yazılı notu olur).

## Instagram (Timur'un kalıcı onayı: "yayınla" dediği notu Instagram'a da yükle)

"yayınla" onayından sonra carousel'i Meta Business Suite'te **o gün saat 20.00'ye** planla (20.00 geçtiyse en yakın yarım saate). Claude in Chrome kullan (Timur'un Chrome'u; Instagram web'de başka hesap açık olabilir, oradan paylaşma).

1. `https://business.facebook.com/latest/home` → "Gönderi oluştur".
2. "Şurada paylaş" açılır listesinde **yalnız benfizikyapamiyorum (Instagram)** seçili kalsın; Facebook sayfasının işaretini kaldır, Escape.
3. Dosya girişi gizli ve yerel dosya seçiciyi açar. Önce şu JS'i çalıştır, sonra "Fotoğraf/video ekle" düğmesine tıkla; input ekrana gelir, `find` ile ref'ini al ve `file_upload` ile `out/<slug>/slayt/jpg/` içindeki 10 JPG'yi **sırayla** (0_kapak, 1 … 9) yükle. Ardından `window.__bfyInput.style.display='none'`.
   `HTMLInputElement.prototype.click` yamalanır: type=file ise `id='bfy-file'`, `aria-label='bfy dosya girişi'`, görünür yap, DOM'a ekle, `window.__bfyInput=this`, yerel pencereyi açma.
4. "Metin" kutusuna `aciklama.txt`'deki açıklamayı yaz (ilk yorum hariç), sonunda Escape. 10 görsel ("1080 x 1350") ve metni JS ile doğrula.
5. "Planla" bölümünde "Tarih ve saat ayarla"yı aç, tarih bugün, saat 20:00. "Planla" düğmesi → "Gönderin planlandı" → **"Belki daha sonra"** (öne çıkarma/reklam YOK).
6. Planlayıcıda (`/latest/content_calendar`) o gün 20.00'de Instagram gönderisinin göründüğünü doğrula, Timur'a bildir.
7. 20.05'te kendine `send_later` kur: gönderinin yayınlandığını kontrol et; Business Suite'ten (Gelen Kutusu > Instagram yorumları ya da gönderi ayrıntısı) `ilkYorum` metnini ilk yorum olarak yaz. Sabitleme yapılamıyorsa Timur'a telefondan sabitlemesini söyle.
Chrome'a ulaşılamazsa paylaşma; dosyaları gönder ve Timur'a elle paylaşmasını hatırlat.
