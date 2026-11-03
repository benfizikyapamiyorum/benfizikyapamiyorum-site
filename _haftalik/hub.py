#!/usr/bin/env python3
"""Haftalık notu sitenin ücretsiz PDF sayfasına (ucretsiz/pdf.html) ekler.
Kullanım: python3 hub.py out/<slug>/meta.json <site klasörü>
- notlar/<slug>.pdf ve .webp dosyalarını kopyalar
- "Bu haftanın notu" kartını yeni notla değiştirir
- Takvimde notun tarihindeki satırı (data-not=TARİH) indirme bağlantısına çevirir
Eski notlar silinmez: önceki haftaların bağlantıları takvimde kalır."""
import json, re, shutil, sys, os

meta_p, site = sys.argv[1], sys.argv[2]
M = json.load(open(meta_p, encoding='utf-8'))
n, slug, H = M['sinif'], M['slug'], M['hub']
out = os.path.dirname(meta_p)
for ext in ('pdf', 'webp'):
    shutil.copyfile(os.path.join(out, f'{slug}.{ext}'), os.path.join(site, 'notlar', f'{slug}.{ext}'))

f = os.path.join(site, 'ucretsiz', 'pdf.html')
s = open(f, encoding='utf-8').read()

# 1) Bu haftanın notu kartı
m = re.search(r'<article class="pdf-hafta" id="not-%d">.*?</article>' % n, s, re.S)
assert m, 'kart bulunamadı'
renk = re.search(r'class="yk-grade" style="color:([^;]+);', m.group(0)).group(1)
d = H['devam']
devam = (f'<a class="ph-devam" href="{d["href"]}" data-bfy-event="pdf_upsell" data-bfy-lab="{d["lab"]}">'
         f'<img src="{d["img"]}" alt="" width="52" height="74" loading="lazy" style="object-fit:cover">'
         f'<div><b>{d["b"]}</b><span>{d["span"]}</span></div><em>{d["em"]}</em></a>')
kart = (f'<article class="pdf-hafta" id="not-{n}"><div class="ph-img"><img src="/notlar/{slug}.webp" alt="{n}. sınıf haftalık fizik notu kapak görseli" width="560" height="347" loading="lazy"></div>'
        f'<div class="ph-body"><span class="ph-tag">BU HAFTANIN NOTU · ÜCRETSİZ</span><p class="yk-grade" style="color:{renk};margin:0">{H["etiket"]}</p>'
        f'<h3>{H["baslik"]}</h3><p>{H["aciklama"]}</p><div class="yk-meta"><span>{M["sayfa"] - 1} sayfa</span><span>PDF</span><span>Üyelik yok</span></div>'
        f'<div class="ph-btns"><a class="button" href="/notlar/{slug}.pdf" download data-bfy-event="free_pdf_download">Notu indir ↓</a></div>{devam}</div></article>')
s = s[:m.start()] + kart + s[m.end():]

# 2) Takvim satırı
sec = re.search(r'<section class="tk" id="takvim-%d".*?</section>' % n, s, re.S)
assert sec, 'takvim bulunamadı'
blok = sec.group(0)
li = re.search(r'<li class="tk-r[^"]*" data-bas="[^"]+" data-son="[^"]+">(?:(?!</li>).)*?data-not="%s"(?:(?!</li>).)*?</li>' % H['tarih'], blok, re.S)
if not li:  # bu haftaya daha önce not bağlanmış: aynı haftanın satırını data-bas ile bul (eski bağlantı yeni notla değişir, eski PDF notlar/ içinde kalır)
    li = re.search(r'<li class="tk-r[^"]*" data-bas="%s" data-son="[^"]+">(?:(?!</li>).)*?</li>' % H.get('hafta', H['tarih']), blok, re.S)
assert li, 'takvim satırı bulunamadı: ' + H['tarih']
hafta = re.search(r'<small>Hafta (\d+)</small>', li.group(0))
lab = f'takvim_{n}_h{hafta.group(1) if hafta else "x"}'
yeni_li = re.sub(r'<span class="tk-bekle" data-not="%s">[^<]*</span>|<a class="tk-not" [^>]*>[^<]*</a>' % H['tarih'],
                 f'<a class="tk-not" href="/notlar/{slug}.pdf" download data-bfy-event="free_pdf_download" data-bfy-lab="{lab}">{H["takvimLink"]}</a>', li.group(0))
assert yeni_li != li.group(0)
blok2 = blok.replace(li.group(0), yeni_li)
s = s.replace(blok, blok2)
open(f, 'w', encoding='utf-8').write(s)
print('hub güncellendi:', slug, lab)
