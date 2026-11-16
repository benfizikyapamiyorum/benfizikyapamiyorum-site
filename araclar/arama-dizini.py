#!/usr/bin/env python3
"""Site içi aramanın dizinini (bfy-arama.json) üretir.
Yeni sayfa eklendiğinde depo kökünde çalıştır:  python3 araclar/arama-dizini.py
Kaynaklar: sitemap.xml'deki sayfalar, ücretsiz not PDF'leri ve mağazadaki ürünler."""
import re, json, html, os, sys
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(KOK)
def norm(s):
    s = s.replace('İ', 'i').replace('I', 'ı').lower()
    for a, b in zip('çğıöşüâîû', 'cgiosuaiu'): s = s.replace(a, b)
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()
def temiz(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()
ATLA = {'grup-yarisi-deneme.html', 'grup-yarisi-10-deneme.html', 'tyt-deneme-1.html', 'hizmetler.html', 'asistan.html', 'ucretsiz.html', ''}
EK = ['prova/', 'ucretsiz/', 'paket/', 'sahin-ivme-yarisi.html', 'sahin-yaris.html', 'akilli-tahta.html', 'hakkimda.html', 'lisans-al/']
def tur(u):
    if 'yazili-sorulari' in u or u == 'prova/': return 'Yazılı'
    if re.search(r'laboratuvari|-3d\.html|^sahin-ivme|akilli-tahta|simulasyonlar', u): return 'Simülasyon'
    if u.startswith('testler'): return 'Test'
    if re.search(r'oyun|grup-yarisi|mercek-nisanci|denizalti|devre-ustasi|grafik-yarisi|^egik-atis\.html|dusus-gorevi|haftanin-fizik-gorevi|sahin-yaris', u): return 'Oyun'
    if re.search(r'^ders-|^dersler|^videolar', u): return 'Ders'
    if re.search(r'fizik-paketi|yks2027|yazili-3-gun-kala|kaynak-magazasi|igcse|materyaller|dijital-kitap|^tyt/|fizikce-turkce|^paket/|lisans-al', u): return 'Kitap ve paket'
    if 'yillik-plan' in u: return 'Öğretmen'
    if re.search(r'maarif|veliler', u): return 'Rehber'
    if u == 'ucretsiz/': return 'Not'
    if re.match(r'\d+-sinif-fizik-', u): return 'Konu'
    return 'Sayfa'
kayit = []
urls = [u.replace('https://benfizikyapamiyorum.com/', '') for u in re.findall(r'<loc>([^<]+)', open('sitemap.xml', encoding='utf-8').read())]
for u in dict.fromkeys(urls + EK):
    if u in ATLA: continue
    yol = u + 'index.html' if u.endswith('/') else u
    if not os.path.exists(yol): print('yok:', u, file=sys.stderr); continue
    s = open(yol, encoding='utf-8', errors='ignore').read()
    if re.search(r'<meta name="robots" content="[^"]*noindex', s) and u != 'lisans-al/': continue
    t = temiz((re.search(r'<title>(.*?)</title>', s, re.S) or [0, ''])[1])
    t = re.sub(r'\s*[|—–·-]\s*Ben Fizik Yapamıyorum.*$', '', t).strip() or temiz((re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S) or [0, u])[1])
    d = temiz((re.search(r'<meta name="description" content="([^"]*)"', s) or [0, ''])[1])
    bas = ' '.join(temiz(x) for x in re.findall(r'<h[123][^>]*>(.*?)</h[123]>', s, re.S)[:40])
    g = (re.match(r'(\d+)-sinif', u) or re.search(r'testler-(\d+)', u) or [0, ''])[1]
    kayit.append({'t': t, 'u': '/' + u, 'k': tur(u), 'g': g, 'd': d[:150], 'x': norm(d + ' ' + bas + ' ' + u.replace('-', ' '))[:320]})
NOTLAR = {'9-fizik-notlari-1-nicelikler': 'Nicelikler: temel, türetilmiş, skaler ve vektörel', '9-fizik-notlari-2-vektorler-esit-zit-carpma': 'Vektörler: eşit, zıt ve sayıyla çarpılmış vektörler', '9-fizik-notlari-3-1-yazili-son-tekrar': '1. yazılıya son tekrar',
 '10-fizik-notlari-1-sabit-hizli-hareket': 'Sabit hızlı hareket ve grafik okuma', '10-fizik-notlari-2-1-yazili-son-tekrar': '1. yazılıya son tekrar',
 '11-fizik-notlari-1-serbest-dusme-ve-atislar': 'Serbest düşme ve atışlar', '11-fizik-notlari-2-newton-hareket-yasalari': 'Newton’ın hareket yasaları', '11-fizik-notlari-3-1-yazili-son-tekrar': '1. yazılıya son tekrar', '11-fizik-notlari-4-serbest-cisim-diyagrami': 'Serbest cisim diyagramı'}
for f in sorted(os.listdir('notlar')):
    if not f.endswith('.pdf'): continue
    ad = f[:-4]; g = ad.split('-')[0]
    kayit.append({'t': f'{g}. sınıf fizik notu: ' + NOTLAR.get(ad, ad.split('-', 4)[-1].replace('-', ' ')), 'u': '/notlar/' + f, 'k': 'Not', 'g': g, 'd': 'Ücretsiz PDF not: konu özeti, çözümlü örnekler ve sorular.', 'x': norm('not pdf ucretsiz ozet ' + ad.replace('-', ' '))})
# Mağaza ürünleri: kartların başlık ve açıklamaları
m = open('kaynak-magazasi.html', encoding='utf-8').read()
for kart in re.findall(r'<article class="shop-card store-card".*?</article>', m, re.S):
    kid = re.search(r' id="([^"]+)"', kart).group(1)
    v = re.search(r'data-variants="([^"]*)"', kart)
    if v:
        for x in json.loads(html.unescape(v.group(1))):
            g = (re.match(r'(\d+)\.', x['title']) or re.search(r' (\d+)( ·|$)', x['title']) or [0, ''])[1]
            kayit.append({'t': x['title'], 'u': '/kaynak-magazasi.html#' + x['old'], 'k': 'Kitap ve paket', 'g': g, 'd': (x['price'] + ' · ' + x['desc'])[:150], 'x': norm(x['tag'] + ' ' + x['facts'] + ' ' + re.search(r'data-keys="([^"]*)"', kart).group(1) + ' satin al fiyat')})
    else:
        t = temiz(re.search(r'<h3[^>]*>(.*?)</h3>', kart, re.S).group(1)); d = temiz(re.search(r'class="product-desc"[^>]*>(.*?)</p>', kart, re.S).group(1)); p = temiz(re.search(r'<strong[^>]*>(.*?)</strong>', kart, re.S).group(1))
        kayit.append({'t': t, 'u': '/kaynak-magazasi.html#' + kid, 'k': 'Kitap ve paket', 'g': '', 'd': (p + ' · ' + d)[:150], 'x': norm(re.search(r'data-keys="([^"]*)"', kart).group(1) + ' satin al fiyat')})
gorulen = set(); son = []
for k in kayit:
    if k['u'] in gorulen: continue
    gorulen.add(k['u']); son.append(k)
json.dump(son, open('bfy-arama.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(son), 'kayıt,', os.path.getsize('bfy-arama.json'), 'bayt')
