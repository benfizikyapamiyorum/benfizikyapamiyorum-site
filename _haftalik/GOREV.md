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

## Instagram

Paylaşım saati 19.00–21.00. Sıra: kapak (`*_slayt_0_kapak.png`), sonra 1'den 9'a. Açıklama ve ilk yorum `aciklama.txt`'de.
