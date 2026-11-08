# BFY ders sunumları (YouTube uzun video serisi)

Her ders için tek dosyalık, canlı bir sunum sayfası üretir: `sunum/<slug>.html`.
Adres: `https://benfizikyapamiyorum.com/sunum/<slug>.html` (arama motorlarına kapalı, noindex).

## Sayfa nasıl kullanılır (iPad + OBS "YouTube Yatay" sahnesi)
- Parmakla dokun: sıradaki adım açılır (madde, formül, çözüm adımı, tablo hücresi).
- Apple Pencil: sayfanın üstüne doğrudan yazar. Her slaytın çizimi ayrı saklanır.
- ‹ geri, › ileri, ⛶ tam ekran. Klavyede ok tuşları / boşluk da çalışır.
- Aynı link video açıklamasına konur, öğrenci de adım adım çözümü kendi açar.

## Yeni ders eklemek
1. `_ders/dersler/ornek-ders.js` dosyasını kopyala, `slug`, `baslik`, `dersAdi` ve slaytları değiştir.
2. `node _ders/build.js _ders/dersler/<ders>.js` çalıştır. Çıktı `sunum/<slug>.html`.
3. Tüm slaytları açık hâlde ekran görüntüsüyle denetle, sonra commit + push (site yayına girer).

## Slayt türleri (`_ders/kit.js`)
- `kapak({etiket, baslik, vurgu, aciklama})`: koyu açılış.
- `bolum({etiket, baslik, aciklama})`: bölüm arası.
- `konu({etiket, kod, baslik, giris, maddeler, sekil})`: maddeler tek tek açılır.
  Madde: `'metin'`, `{metin, vurgu:'F1'}` ya da `{formul:'R² = F₁² + F₂²', aciklama, vurgu}`.
- `soru({etiket, kod, baslik, baglam, tablo, sekil, maddeler, yatay})`: her maddenin çözümü
  `adimlar` dizisiyle adım adım, sonda `cevap` koyu kutuda açılır. Soru numarası otomatik.
- `kapanis({baslik, vurgu, aciklama})`: abone ve site çağrısı.
- Şekil: `k.svg(w, h, içerik)` ve `k.ok({x1,y1,x2,y2,ad,etiket,renk})`.
  Bir adımda `vurgu:'R'` yazılırsa o adım açıkken şekilde yalnızca `ad:'R'` olan ok parlar.

## Motor
`motor.css` ve `motor.js`, 1. yazılı sunumlarından (sunum/9-1-yazili.html) alınan, denenmiş motordur.
Yazı boyu, tüm adımlar açıkken slayta sığacak şekilde otomatik küçülür.
