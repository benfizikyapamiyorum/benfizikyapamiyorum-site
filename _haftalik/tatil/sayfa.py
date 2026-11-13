#!/usr/bin/env python3
"""Ara tatil sayfası üretici.
python3 sayfa.py            → out/site/ altına önizleme (tatil/index.html, PDF'ler, img/tatil/*.webp)
python3 sayfa.py --yayin    → aynı dosyaları site deposuna (../../tatil, ../../img/tatil) kopyalar. Commit/push ayrıca yapılır.
Üst bilgi, menü ve alt bilgi paket/index.html sayfasından alınır; böylece site ile birebir aynı kalır."""
import json, os, re, shutil, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
YAYIN = '--yayin' in sys.argv
HEDEF = REPO if YAYIN else os.path.join(HERE, 'out', 'site')
SINIFLAR = [s for s in (9, 10, 11) if os.path.exists(os.path.join(HERE, 'out', str(s), 'meta.json'))]
RENK = {9: '#0e7490', 10: '#b7791f', 11: '#6d28d9'}
YAP = {9: '9-sinif-fizik-paketi.html', 10: '10-sinif-fizik-paketi.html', 11: '11-sinif-fizik-paketi.html'}

os.makedirs(os.path.join(HEDEF, 'tatil'), exist_ok=True)
os.makedirs(os.path.join(HEDEF, 'img', 'tatil'), exist_ok=True)
M = {}
for s in SINIFLAR:
    o = os.path.join(HERE, 'out', str(s))
    M[s] = json.load(open(os.path.join(o, 'meta.json'), encoding='utf8'))
    for f in (f'ara-tatil-fizik-kampi-{s}-sinif.pdf', f'ara-tatil-fizik-denemesi-{s}-sinif.pdf'):
        shutil.copy(os.path.join(o, f), os.path.join(HEDEF, 'tatil', f))
    for t in ('not', 'deneme'):
        im = Image.open(os.path.join(o, f'{t}-kapak.png')).convert('RGB')
        im.resize((640, int(640 * im.height / im.width)), Image.LANCZOS).save(os.path.join(HEDEF, 'img', 'tatil', f'{t}-kapak-{s}.webp'), 'WEBP', quality=86)
# paylaşım görseli (1200x630): üç kapak yan yana
if SINIFLAR:
    og = Image.new('RGB', (1200, 630), '#151c47')
    for i, s in enumerate(SINIFLAR):
        im = Image.open(os.path.join(HERE, 'out', str(s), 'not-kapak.png')).convert('RGB')
        im = im.resize((360, int(360 * im.height / im.width)), Image.LANCZOS)
        og.paste(im, (40 + i * 380, 60))
    og.save(os.path.join(HEDEF, 'img', 'tatil', 'paylasim.jpg'), quality=88)

src = open(os.path.join(REPO, 'paket', 'index.html'), encoding='utf8').read()
head_end = src.find('</head>')
head = src[:head_end]
TITLE = 'Ara Tatil Fizik Kampı: 9, 10, 11. Sınıf Ücretsiz Tekrar Notu ve Deneme | Ben Fizik Yapamıyorum'
DESC = 'Ara tatilde 5 gün, günde 30 dakika: 9, 10 ve 11. sınıf fizik için ücretsiz tekrar notu ve 15 soruluk deneme. Maarif Modeli. PDF olarak indir.'
head = re.sub(r'<title>.*?</title>', f'<title>{TITLE}</title>', head, flags=re.S)
head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{DESC}">', head)
head = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="https://benfizikyapamiyorum.com/tatil/">', head)
head = re.sub(r'<meta property="og:type" content="[^"]*">', '<meta property="og:type" content="website">', head)
head = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="Ara Tatil Fizik Kampı: ücretsiz tekrar notu ve deneme">', head)
head = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{DESC}">', head)
head = re.sub(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="https://benfizikyapamiyorum.com/tatil/">', head)
head = re.sub(r'<meta property="og:image" content="[^"]*">', '<meta property="og:image" content="https://benfizikyapamiyorum.com/img/tatil/paylasim.jpg">', head)
head = re.sub(r'<script type="application/ld\+json">.*?</script>', '', head, flags=re.S)
head = re.sub(r'<style>.*?</style>', '', head, flags=re.S)  # paket sayfasına özel stiller
ust = src[src.find('<body'):src.find('<main')]
alt = src[src.find('<footer class="site-footer">'):src.find('</footer>') + 9]

CSS = '''
.tt-hero{display:grid;grid-template-columns:1.1fr .9fr;gap:36px;align-items:center;margin-top:22px}
.tt-hero .stack{position:relative;height:470px}
.tt-hero .stack img{position:absolute;width:50%;height:auto;border-radius:14px;box-shadow:0 22px 50px rgba(15,22,56,.35);border:1px solid rgba(15,42,36,.1)}
.tt-hero .stack img:nth-child(1){left:2%;top:46px;transform:rotate(-7deg)}.tt-hero .stack img:nth-child(2){right:2%;top:46px;transform:rotate(7deg)}.tt-hero .stack img:nth-child(3){left:25%;top:0;z-index:2}
.tt-oz{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:20px}
.tt-oz div{background:#fff;border:1px solid rgba(15,42,36,.12);border-radius:18px;padding:16px 18px}
.tt-oz b{display:block;font-family:var(--serif,Fraunces,serif);font-size:30px;color:#173a30;line-height:1.1}
.tt-oz span{font-weight:600;font-size:14.5px;color:#4b5a55}
.tt-sinif{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:20px}
.tt-kart{background:#fff;border:1px solid rgba(15,42,36,.12);border-radius:22px;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-margin-top:110px;border-top:6px solid var(--tk)}
.tt-kart:target{outline:3px solid #e9be64;outline-offset:3px}
.tt-kart .kp{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tt-kart .kp img{width:100%;height:auto;border-radius:10px;border:1px solid rgba(15,42,36,.1);box-shadow:0 8px 20px rgba(15,22,56,.18)}
.tt-kart h3{margin:0;font-size:23px;line-height:1.2}.tt-kart .eyebrow{margin:2px 0 0;color:var(--tk)}
.tt-kart ol{margin:0;padding:0;list-style:none;display:grid;gap:6px;font-size:15px;line-height:1.4}
.tt-kart ol li{display:grid;grid-template-columns:62px 1fr;gap:8px;align-items:baseline}
.tt-kart ol b{font-size:12px;letter-spacing:.08em;color:var(--tk)}
.tt-kart .btns{display:grid;gap:8px;margin-top:auto}
.tt-kart .btns .button{text-align:center}
.tt-kart .btns .ikinci{background:#fff;color:#173a30;border:2px solid #173a30}
.tt-kart .eksik{border-top:1px dashed rgba(15,42,36,.2);padding-top:10px;font-size:14.5px;line-height:1.5}
.tt-kart .eksik b{display:block;margin-bottom:2px}.tt-kart .eksik a{display:block;font-weight:700;color:#173a30}
.tt-kart .eksik a em{font-style:normal;background:#173a30;color:#fff;border-radius:99px;padding:1px 9px;font-size:12.5px;margin-left:4px;white-space:nowrap}
.tt-adim{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px}
.tt-adim div{background:#f4f1e8;border-radius:18px;padding:16px 18px;font-size:15.5px;line-height:1.5}
.tt-adim b.n{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#173a30;color:#fff;font-weight:800;margin-bottom:8px}
.tt-adim h3{margin:0 0 4px;font-size:18px}
.tt-fark{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.tt-fark div{border-radius:20px;padding:18px 20px;font-size:15.5px;line-height:1.55;background:#fff;border:1px solid rgba(15,42,36,.12)}
.tt-fark div.p{background:#173a30;color:#fff;border-color:#173a30}.tt-fark div.p h3{color:#e9be64}
.tt-fark h3{margin:0 0 6px;font-size:19px}.tt-fark ul{margin:0;padding-left:19px}
.tt-fark .button{margin-top:12px;display:inline-block;background:#e9be64;color:#1c2522}
.tt-ig{margin-top:26px;background:linear-gradient(115deg,#151c47,#3a2f96 60%,#6a3fd0);color:#fff;border-radius:22px;padding:22px 26px;display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap}
.tt-ig h2{margin:0 0 4px;color:#fff;font-size:24px}.tt-ig p{margin:0;color:#e6e9ff}
.tt-ig a{background:#fff;color:#151c47;font-weight:800;border-radius:99px;padding:12px 22px;text-decoration:none;white-space:nowrap}
.tt-not{font-size:14px;color:#4b5a55;margin-top:14px}
@media(max-width:900px){.tt-hero{grid-template-columns:1fr}.tt-hero .stack{height:380px;max-width:460px;margin:0 auto;width:100%}.tt-oz{grid-template-columns:1fr 1fr}.tt-sinif,.tt-adim,.tt-fark{grid-template-columns:1fr}}
'''

def kart(s):
    m = M[s]
    gun = ''.join(f'<li><b>GÜN {g["no"]}</b><span>{g["baslik"]}</span></li>' for g in m['gunler']) + '<li><b>GÜN 5</b><span>Deneme: 15 soru, 30 dakika</span></li>'
    eksik = ''.join(f'<a href="paket/?utm_source=tatil_sayfa#{p["a"]}" data-bfy-event="pdf_upsell" data-bfy-lab="tatil{s}_paket{p["no"]}">Konu Soru Paketi #{p["no"]}: {p["ad"]}<em>₺99 →</em></a>' for p in m['paketler'])
    return f'''<article class="tt-kart" id="sinif-{s}" style="--tk:{RENK[s]}">
<div class="kp"><img src="img/tatil/not-kapak-{s}.webp" width="640" height="905" alt="{s}. sınıf Ara Tatil Fizik Kampı tekrar notu kapağı" loading="lazy"><img src="img/tatil/deneme-kapak-{s}.webp" width="640" height="905" alt="{s}. sınıf Ara Tatil Fizik Denemesi kapağı" loading="lazy"></div>
<div><p class="eyebrow">{s}. SINIF | MAARİF MODELİ</p><h3>{s}. sınıf Ara Tatil Fizik Kampı</h3></div>
<ol>{gun}</ol>
<div class="btns"><a class="button" href="tatil/ara-tatil-fizik-kampi-{s}-sinif.pdf" download data-bfy-event="free_pdf_download" data-bfy-lab="tatil_not_{s}">Tekrar notunu indir (PDF, {m["notSayfa"]} sayfa) ↓</a><a class="button ikinci" href="tatil/ara-tatil-fizik-denemesi-{s}-sinif.pdf" download data-bfy-event="free_pdf_download" data-bfy-lab="tatil_deneme_{s}">Denemeyi indir (PDF, 15 soru) ↓</a></div>
<div class="eksik"><b>Denemede eksik çıkan konu için:</b>{eksik}<a href="{YAP[s]}?utm_source=tatil_sayfa" data-bfy-event="pdf_upsell" data-bfy-lab="tatil{s}_yapabilirim">Bütün yıl için Yapabilirim {s}<em>₺599 →</em></a></div>
</article>'''

sinif_ad = ', '.join(str(s) for s in SINIFLAR[:-1]) + (' ve ' if len(SINIFLAR) > 1 else '') + str(SINIFLAR[-1]) if SINIFLAR else ''
stack = ''.join(f'<img src="img/tatil/not-kapak-{s}.webp" width="640" height="905" alt="">' for s in ([9, 11, 10] if len(SINIFLAR) == 3 else SINIFLAR))
main = f'''<main id="main" class="container student-layout"><nav class="student-crumbs" aria-label="Sayfa yolu"><a href="index.html">Ana sayfa</a> / <a href="ucretsiz/pdf">Ücretsiz notlar</a> / Ara Tatil Fizik Kampı</nav>
<div class="tt-hero"><div><p class="eyebrow" style="margin-top:28px">ÜCRETSİZ / {sinif_ad}. SINIF / ARA TATİL</p><h1>Ara Tatil Fizik Kampı</h1><p class="lead"><b>5 gün, günde 30 dakika.</b> Dönemin başından bugüne işlenen konuları şekillerle toparlayan tekrar notu ve sonunda 15 soruluk deneme. İkisi de ücretsiz, PDF.</p><p><a class="button" href="tatil/#siniflar" data-bfy-event="tatil_sinif_sec">Sınıfını seç ve indir ↓</a></p></div>
<div class="stack" aria-hidden="true">{stack}</div></div>
<div class="tt-oz"><div><b>4 gün</b><span>her gün tek konu, tek sayfa özet</span></div><div><b>16 soru</b><span>ısınma sorusu, kısa çözümleriyle</span></div><div><b>15 soru</b><span>deneme, 30 dakika, ayrı PDF</span></div><div><b>Tablo</b><span>denemenin sonunda eksik konu tablosu</span></div></div>
<section class="student-section" id="siniflar" style="scroll-margin-top:110px"><h2>Sınıfını seç</h2><p>Her sınıf için iki PDF var: önce tekrar notu (4 gün), sonra deneme (5. gün). Telefonda da okunur, yazdırıp çözmek daha iyi.</p>
<div class="tt-sinif">{''.join(kart(s) for s in SINIFLAR)}</div>
<p class="tt-not">Okulunun konu sırası farklı olabilir, öğretmeninin işlediği konuları esas al. PDF’ler ücretsizdir, parayla satılamaz.</p></section>
<section class="student-section"><h2>Nasıl çalışılır?</h2>
<div class="tt-adim"><div><b class="n">1</b><h3>Özeti oku</h3>Her gün tek sayfa özet var. Şekillere bakarak oku, formülün nereden geldiğini şeklin üstünde gör. Yaklaşık 10 dakika.</div><div><b class="n">2</b><h3>4 soruyu çöz</h3>Önce kendin çöz, sonra son sayfalardaki kısa çözümle karşılaştır. Yaklaşık 15 dakika.</div><div><b class="n">3</b><h3>5. gün denemeyi çöz</h3>Süre tut, bitince eksik konu tablosunu doldur. Hangi konuda puan kaybettiğini görürsün.</div></div></section>
<section class="student-section"><h2>Eksik konuyu kapatmak için</h2>
<div class="tt-fark"><div><h3>Bu ücretsiz kitapçık</h3><ul><li>Konu başına tek sayfa özet</li><li>16 ısınma sorusu ve 15 soruluk deneme (test)</li><li>Kısa çözümler ve eksik konu tablosu</li></ul></div>
<div class="p"><h3>Konu Soru Paketi (₺99)</h3><ul><li>Tek konudan 50 ve üzeri açık uçlu yazılı sorusu</li><li>Her maddeye adım adım çözüm ve puanlama</li><li>Her soruda “Dikkat” notu, yeni paketlerde 2 deneme yazılısı</li></ul><a class="button" href="paket/?utm_source=tatil_sayfa" data-bfy-event="pdf_upsell" data-bfy-lab="tatil_paketler">Paketlere bak →</a></div></div></section>
<div class="tt-ig"><div><h2>Okul açılınca her hafta yeni ücretsiz not</h2><p>Pazartesi 9, Çarşamba 10, Cuma 11. sınıf. Yeni notlar önce Instagram’da duyurulur.</p></div><a href="https://www.instagram.com/benfizikyapamiyorum/" rel="noopener" data-bfy-event="tatil_instagram">@benfizikyapamiyorum’u takip et →</a></div>
</main>'''
izleme = "<script>window.addEventListener('load',function(){try{if(window.BFY&&BFY.track)BFY.track('tatil_view')}catch(e){}});</script>"
html = head + f'<style>{CSS}</style></head>' + ust + main + alt + izleme + '</body></html>'
open(os.path.join(HEDEF, 'tatil', 'index.html'), 'w', encoding='utf8').write(html)
print('yazıldı:', os.path.join(HEDEF, 'tatil', 'index.html'), 'sınıflar:', SINIFLAR, '| yayın' if YAYIN else '| önizleme')
