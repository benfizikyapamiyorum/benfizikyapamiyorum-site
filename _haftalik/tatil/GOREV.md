# Ara Tatil Fizik Kampı: içerik yazım görevi

Timur Yıldırım (16 yıllık fizik öğretmeni, "Ben Fizik Yapamıyorum", benfizikyapamiyorum.com) için Kasım 2026 ara tatilinde
(16–20 Kasım) Instagram'dan ücretsiz dağıtılacak iki PDF üretiyoruz: **Tekrar Notu** (4 gün, günde tek konu) ve **Deneme** (15 soru, 30 dk).
Amaç takipçi çekmek ve öğrenciyi sitedeki 99 TL'lik Konu Soru Paketlerine yönlendirmek. Timur'un ölçütü: "mükemmel olmalı", görseller
"inanılmaz" olmalı, sıfır fizik hatası.

## Dosyalar (hepsi `/home/claude/benfizikyapamiyorum-site/_haftalik/tatil/`)

- `lib.js`: sayfa parçaları (`bolum, kutu, formul, sekil, ikili, p, kontrol, uclu, tablo, hata`). **Değiştirme.**
- `real.js`: gerçekçi SVG şekil kütüphanesi (`S, T, OK, OLCU, ACI, ROZET, ZEMIN, SAHNE, GOK, BULUT, GUNES, AGAC, BINA, UCURUM, KUTU, TOP, HAYALET, BASKET, ARABA, PLATFORM_ARABA, INSAN, EGIK, IP, MAKARA, TAVAN, YAY, KRONOMETRE, CETVEL, TERAZI, DINAMOMETRE, KARELI, GRAFIK`). **Değiştirme.** Eksik bir cisim gerekiyorsa kendi içerik dosyanda, aynı kalitede (degrade, gölge, hacim) yerel fonksiyon olarak çiz.
- `build.js`: `node build.js <sınıf>` → `out/<sınıf>/` altında iki PDF ve her sayfanın PNG'si (`n-01.png …` not, `d-1.png …` deneme, 100 dpi). **Değiştirme.**
- **`11.js`: biçim örneği. Önce baştan sona oku.** Senin dosyan (`9.js` ya da `10.js`) birebir aynı yapıda ve aynı `module.exports` alanlarıyla olacak.

## Yapı (11.js ile aynı)

- `kapakSekil`: kapak için geniş, etkileyici, konuyu anlatan bir sahne (`S(720, 330, 180, …)`).
- `gunler`: 4 gün. Her gün: `no, baslik, kisa (kapak çipi, kısa), alt, plan, govde, sorular (tam 4 soru), kontrol (3 ya da 4 "yapabiliyorum" cümlesi)`.
  - `govde`: en fazla A4'ün 2/3'ü kadar. Ders anlatmaz, **toparlar**: kısa cümleler, formül kutusu, en az 2 gerçekçi ve ölçekli şekil, 1 ya da 2 `hata(yanlış, doğru)`.
  - Her gün tam 2 sayfa olmalı (build çıktısı "gün N: 2 sayfa" der). 3 sayfaya taşarsa govdeyi kısalt.
- `deneme`: tam 15 soru, her biri `konu: 'k1'…'k4'` etiketli, 5 şıklı (A–E), `cevap` ve 1–3 cümlelik `cozum`. En az 6 soru şekilli ya da grafikli.
- `konular`: 4 konu, `paket` numarası ya da `null` (Yapabilirim'e yönlenir). `paketler`: son sayfada gösterilecek 2 paket.
- Doğru şıklar A–E arasında dengeli dağılsın (aynı harf art arda 3 kez gelmesin).

## Kırmızı çizgiler

1. **Sıfır fizik hatası.** Her sayısal sonucu ayrı bir Python betiğiyle (`dogrula_<sınıf>.py`, aynı klasöre) hesaplayıp doğrula. Her sorunun tek doğru şıkkı olduğundan emin ol; çeldiriciler tipik hatalardan gelsin.
2. **Maarif Modeli kapsamı ve o sınıfın düzeyi.** Kapsam dışı konu, formül ya da yöntem yok. 9. sınıfta trigonometri yok; vektör bileşenleri yalnız dik koordinat sistemi ve kareli düzlemde. Terimler ders kitabındaki gibi (ör. "bileşke", "yer değiştirme", "sürat", "Newton'ın").
   Ders kitabı metinleri: `/home/claude/yaziliya-3-gun-kala/kaynaklar/ders-kitaplari/<sınıf>-sinif/metin.md`. **Yalnız kapsamı, gösterimi ve düzeyi anlamak için.** Kitaptan metin, soru, şekil, örnek ve sayı kümesi kopyalanmaz.
   Önceki ücretsiz notlar (terminoloji için): `../notlar/9-02.js, 9-03.js, 10-02.js`.
3. **Tek adımlı basit soru yok.** Her soru ayırt edici ve düşündürücü: grafik okuma, öncüllü (I, II, III), iki adımlı hesap, günlük hayat bağlamı, kavram yanılgısı. Kurgular birbirini tekrar etmesin, ısınma soruları ile deneme soruları da birbirinin kopyası olmasın.
4. **Sayılar tam.** Veriler ve sonuçlar tam sayı. Ondalıklı sayı çok nadir (en fazla 1–2 yerde, 0,5 gibi yarımlar ya da birim dönüşümü gerektiriyorsa). g = 10 m/s². Hız sembolü **ϑ** (KaTeX `\vartheta`, SVG metninde `ϑ`).
5. **Ücretsiz, paralı paketten iyi olmasın.** Sorular çoktan seçmeli, çözümler kısa (1–3 cümle). Açık uçlu yazılı sorusu, puanlama, uzun çözüm yok: onlar 99 TL'lik pakette.

## Yazım

- Türkçe yazım ve noktalama tam. **Her cümle noktayla biter** (madde ve şekil altı dahil). Soru kökleri soru işaretiyle biter.
- "·" (orta nokta) hiçbir görünen metinde kullanılmaz (ayraç olarak da çarpma olarak da). Çarpma için KaTeX `\times` kullan (`\cdot` yok); ayraç için virgül ya da "|".
- Ondalık virgül: `0{,}6`. Birim sayıdan bir boşlukla ayrılır. Üst simge birimlerde `\text{m/s}^2`.
- Ton: öğrenciyle konuşan sakin, net öğretmen. "Süper", "muhteşem" yok. Gerçek okul ya da kurum adı yok.
- `govde` içinde `$…$` kullanan her metin `bolum`, `kutu`, `p`, `ikili` gibi bir yardımcıdan geçmeli (ham `<p>…$…$</p>` tek başına bırakılırsa TeX işlenmez; `p('…')` kullan).

## Şekil kuralları (Timur'un en hassas olduğu yer)

- Gerçekçi ve dolgun: `SAHNE`, `ZEMIN`, `KUTU`, `TOP`, `ARABA` gibi hacimli parçaları kullan. Düz çizgi, boş dikdörtgen, şematik çöp adam yok.
- Fiziksel olarak makul ve **ölçekli**: oklar büyüklükle orantılı, uzunluklar gerçek oranlı, yönler doğru. Bir fizik öğretmeni bakıp "bu mantıksız" dememeli.
- **Etiketler hiçbir cismin, okun ya da çizginin üstünden geçmez, birbirine binmez, çerçeveden taşmaz.**
- Grafiklerde yalnız `GRAFIK` kullan (eksen etiketi birimli ve yatay eksenin sağ ucunda, yanında).
- Kareli düzlemde koordinatlar tam sayı; `KARELI` kullan.
- Soru şeklinde cevabı ele veren etiket olmasın.

## Çalışma düzeni

1. `11.js`, `lib.js`, `real.js` oku. İlgili ders kitabı bölümlerine kapsam için bak.
2. İçerik dosyanı yaz, `dogrula_<sınıf>.py` ile sayıları doğrula.
3. `cd /home/claude/benfizikyapamiyorum-site/_haftalik/tatil && node build.js <sınıf>` çalıştır.
4. **Her sayfanın PNG'sini Read ile tek tek aç ve incele** (`out/<sınıf>/n-*.png`, `d-*.png`): taşma, binen etiket, işlenmemiş `$`, bölünmüş soru, boş alan, okunmayan yazı. Şekilleri gerekirse `node build.js <sınıf> 160` ile daha yüksek çözünürlükte üretip yakından kontrol et. Kusur kalmayana kadar düzelt ve yeniden derle. En az iki tam tur yap.
5. Yalnız kendi `<sınıf>.js` ve `dogrula_<sınıf>.py` dosyalarını yaz. Git commit ya da push yapma, başka dosyaya dokunma.
6. Bitince kısa rapor ver: gün başlıkları, deneme konu dağılımı ve cevap anahtarı, emin olamadığın kapsam kararları, kalan bilinen kusurlar.
