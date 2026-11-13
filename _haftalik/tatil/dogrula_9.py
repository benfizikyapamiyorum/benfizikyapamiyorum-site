#!/usr/bin/env python3
"""9. sınıf Ara Tatil Fizik Kampı: sayısal ve yapısal doğrulama.
Çalıştır: python3 dogrula_9.py  (9.js ile aynı klasörde)
Her sayısal sonuç burada bağımsız olarak yeniden hesaplanır ve 9.js içindeki doğru şıkla karşılaştırılır."""
import json, math, os, re, subprocess, sys
from fractions import Fraction as Fr

D = os.path.dirname(os.path.abspath(__file__))
js = "const N=require('./9.js');const f=q=>({metin:q.metin,onc:q.onc||null,kok:q.kok,siklar:q.siklar,cevap:q.cevap,cozum:q.cozum,konu:q.konu||null,sekil:!!q.sekil});" \
     "console.log(JSON.stringify({gunler:N.gunler.map(g=>({no:g.no,baslik:g.baslik,kisa:g.kisa,alt:g.alt,plan:g.plan,kontrol:g.kontrol,govde:g.govde,sorular:g.sorular.map(f)})),deneme:N.deneme.map(f),konular:N.konular,paketler:N.paketler,planNot:N.planNot,sinif:N.sinif}))"
N = json.loads(subprocess.check_output(['node', '-e', js], cwd=D))
isinma = [q for g in N['gunler'] for q in g['sorular']]
den = N['deneme']
hata = []


def kontrol(kosul, mesaj):
    print(('  OK    ' if kosul else '  HATA  ') + mesaj)
    if not kosul:
        hata.append(mesaj)


def dogru_sik(q):
    return q['siklar']['ABCDE'.index(q['cevap'])]


def sik_esit(q, beklenen, ad):
    kontrol(dogru_sik(q) == beklenen, f"{ad}: hesap = {beklenen!r}, anahtardaki şık = {dogru_sik(q)!r} ({q['cevap']})")
    kontrol(q['siklar'].count(beklenen) == 1, f"{ad}: doğru değer şıklarda yalnız bir kez geçiyor")


def kmh_ms(v):  # km/h -> m/s
    return Fr(v * 1000, 3600)


def topla(*vs):
    return tuple(sum(c) for c in zip(*vs))


def boy(v):
    r = math.isqrt(v[0] ** 2 + v[1] ** 2)
    assert r * r == v[0] ** 2 + v[1] ** 2, f'tam kare değil: {v}'
    return r


def oncul(q, dogrular, ad):
    """dogrular: [True/False, ...] -> beklenen şık metni"""
    ad_ = ['I', 'II', 'III']
    sec = [ad_[i] for i, d in enumerate(dogrular) if d]
    if len(sec) == 1:
        m = 'Yalnız ' + sec[0]
    elif len(sec) == 2:
        m = f'{sec[0]} ve {sec[1]}'
    else:
        m = 'I, II ve III'
    sik_esit(q, m, ad)


print('== Yapı ==')
kontrol(N['sinif'] == 9, 'sinif = 9')
kontrol(len(N['gunler']) == 4, '4 gün var')
for g in N['gunler']:
    kontrol(len(g['sorular']) == 4, f"Gün {g['no']}: tam 4 ısınma sorusu")
    kontrol(3 <= len(g['kontrol']) <= 4, f"Gün {g['no']}: 3 ya da 4 kontrol cümlesi")
    kontrol(g['govde'].count('class="hata"') in (1, 2), f"Gün {g['no']}: 1 ya da 2 hata kutusu")
    kontrol(g['govde'].count('<svg') >= 2, f"Gün {g['no']}: en az 2 şekil ({g['govde'].count('<svg')})")
kontrol(len(den) == 15, 'Deneme: tam 15 soru')
dag = {k: sum(1 for q in den if q['konu'] == k) for k in ('k1', 'k2', 'k3', 'k4')}
kontrol(dag == {'k1': 3, 'k2': 4, 'k3': 4, 'k4': 4}, f'Deneme konu dağılımı 3-4-4-4: {dag}')
kontrol(sum(1 for q in den if q['sekil']) >= 6, f"Deneme: en az 6 şekilli soru ({sum(1 for q in den if q['sekil'])})")
kontrol([k['paket'] for k in N['konular']] == [None, 1, 1, 3], 'konular: paket eşlemesi null, 1, 1, 3')
kontrol([p['no'] for p in N['paketler']] == [1, 3], 'paketler: 1 ve 3')
for ad, L in (('Isınma', isinma), ('Deneme', den)):
    for i, q in enumerate(L, 1):
        if len(q['siklar']) != 5 or len(set(q['siklar'])) != 5 or q['cevap'] not in 'ABCDE':
            kontrol(False, f'{ad} {i}: 5 farklı şık ve geçerli cevap harfi')
    key = ''.join(q['cevap'] for q in L)
    kontrol(not re.search(r'(.)\1\1', key), f'{ad} anahtarı: aynı harf art arda 3 kez yok ({key})')
    say = {h: key.count(h) for h in 'ABCDE'}
    kontrol(min(say.values()) >= 2 and max(say.values()) <= len(L) // 3 + 1, f'{ad} anahtarı dengeli: {say}')
kontrol(len({q['metin'] + q['kok'] for q in isinma + den}) == 31, '31 soru birbirinden farklı (metin + kök)')

print('== Yazım ==')
ham = json.dumps(N, ensure_ascii=False)
gorunen = re.sub(r'<svg.*?</svg>', '', ham, flags=re.S)
kontrol('·' not in ham, 'Orta nokta (·) hiçbir yerde yok')
kontrol('\\\\cdot' not in re.sub(r'\d\s*\\\\cdot\s*\d', '', ham), '\\cdot yalnız sayılar arasında')
duz = json.dumps([[q['metin'], q['onc'], q['kok'], q['siklar'], q['cozum']] for q in isinma + den] + [[g['alt'], g['plan'], g['kontrol']] for g in N['gunler']], ensure_ascii=False)
duz += re.sub(r'<svg.*?</svg>|<span class="katex.*?</span></span></span>|style="[^"]*"', '', ' '.join(g['govde'] for g in N['gunler']), flags=re.S)
kontrol(not re.search(r'\d\.\d', duz.replace('08.30', '')), 'Soru, çözüm ve gövde metinlerinde ondalık nokta yok (virgül kullanılıyor)')
for g in N['gunler']:
    for alan in ('alt', 'plan'):
        kontrol(g[alan].rstrip('”').endswith(('.', '?')), f"Gün {g['no']} {alan}: nokta ya da soru işaretiyle bitiyor")
    for c in g['kontrol']:
        kontrol(c.endswith('.'), f"Gün {g['no']} kontrol cümlesi noktayla bitiyor: {c[:40]}")
for ad, L in (('Isınma', isinma), ('Deneme', den)):
    for i, q in enumerate(L, 1):
        if not q['kok'].endswith('?'):
            kontrol(False, f'{ad} {i}: soru kökü soru işaretiyle bitiyor')
        if not q['cozum'].endswith('.'):
            kontrol(False, f'{ad} {i}: çözüm noktayla bitiyor')
        if len(re.findall(r'[.!?](?:\s|$)', re.sub(r'\$[^$]*\$', 'x', q['cozum']))) > 4:
            kontrol(False, f'{ad} {i}: çözüm kısa (en çok 3-4 cümle)')
        for o in (q['onc'] or []):
            if not o.endswith(('.', ',')):
                kontrol(False, f'{ad} {i}: öncül noktayla bitiyor: {o[:40]}')
print('  OK    Soru kökleri, çözümler ve öncüller biçim taramasından geçti' if not hata else '')
yasak = ['süper', 'muhteşem', 'sin', 'cos', 'trigonometri', 'ters yönlü']
kontrol(not any(re.search(r'\b' + y + r'\b', gorunen.replace('Trigonometri yok', '').lower()) for y in yasak), 'Yasak sözcük ve trigonometrik ifade yok')

print('== Tekrar notu gövdesindeki sayılar ==')
kontrol(kmh_ms(72) == 20, 'Gün 2: 72 km/h = 20 m/s')
kontrol(1 * 10 == 10, 'Gün 2: 1 kg kütleli cismin ağırlığı 10 N (g = 10 N/kg)')
kontrol('DINAMO(dx, dy, 10, k)' in open(os.path.join(D, '9.js'), encoding='utf-8').read(), 'Gün 2: dinamometre ölçeğinde gösterge 10 N çizgisinde')
kontrol('\\\\tfrac' not in json.dumps([q['cozum'] for q in isinma + den]), 'Çözümlerde küçük kesir (tfrac) yok')
kontrol(boy((4, 3)) == 5, 'Kapak ve Gün 4: 4 ve 3 dik ise bileşke 5 (balon: 4 m/s, 3 m/s -> 5 m/s)')
A, B = (4, 1), (1, 3)
kontrol(topla(A, B) == (5, 4), 'Gün 4: uç uca ve paralelkenar şekli, A(4,1) + B(1,3) = R(5,4)')
kontrol((4 + 2, 4 - 2) == (6, 2), 'Gün 4: aynı yönlü 4 + 2 = 6, zıt yönlü 4 - 2 = 2')
kontrol(all(boy(v) == r for v, r in (((3, 4), 5), ((6, 8), 10), ((5, 12), 13))), 'Gün 4: 3-4-5, 6-8-10, 5-12-13 üçlüleri')
A3 = (4, 2)
kontrol(tuple(Fr(1, 2) * c for c in A3) == (2, 1) and tuple(Fr(-3, 2) * c for c in A3) == (-6, -3), 'Gün 3: D = A/2 = (2,1), E = -3A/2 = (-6,-3), A = (4,2)')

print('== Isınma soruları ==')
oncul(isinma[0], [True, True, False], 'Isınma 1 (çaydanlık termodinamik, mıknatıs elektromanyetizma, kırık kaşık optik)')
sik_esit(isinma[1], 'Optik, katı hâl fiziği, mekanik', 'Isınma 2')
oncul(isinma[2], [True, True, True], 'Isınma 3')
oncul(isinma[3], [True, True, False], 'Isınma 4')
oncul(isinma[4], [True, False, True], 'Isınma 5 (sıcaklığın SI birimi kelvin)')
v = kmh_ms(18); yol = v * 10 * 60
kontrol(v == 5, 'Isınma 6: 18 km/h = 5 m/s')
sik_esit(isinma[5], str(int(yol)), 'Isınma 6 (5 m/s x 600 s)')
# birim üsleri: (kg, m, s)
Nw = (1, 1, -2)
yay = tuple(a - b for a, b in zip(Nw, (0, 1, 0)))
kontrol(yay == (1, 0, -2), f'Isınma 7: N/m = kg^1 m^0 s^-2 {yay}')
sik_esit(isinma[6], 'Kütle ve zaman', 'Isınma 7')
silgi_cm = Fr(15 - 3, 4)
sik_esit(isinma[7], str(int(silgi_cm * 10)), 'Isınma 8 ((15 - 3) cm / 4 = 3 cm = 30 mm)')
oncul(isinma[8], [False, False, True], 'Isınma 9')
K, L_, M, Nv, P = (3, 1), (3, 1), (-3, -1), (1, 3), (6, 2)
capraz = lambda a, b: a[0] * b[1] - a[1] * b[0]
i10 = [K == Nv, capraz(K, M) == 0, P == tuple(2 * c for c in L_)]
kontrol(K[0] ** 2 + K[1] ** 2 == Nv[0] ** 2 + Nv[1] ** 2 and K != Nv, 'Isınma 10: K ile N aynı boyda ama eşit değil')
oncul(isinma[9], i10, 'Isınma 10')
Kx = -12  # batı negatif
Lx = Fr(-1, 3) * Kx; Mx = 2 * Lx
sik_esit(isinma[10], f"{abs(int(Mx))} N, {'doğu' if Mx > 0 else 'batı'}", 'Isınma 11 (L = 4 N doğu, M = 8 N doğu)')
vK, vM, vL = 25, 25, -25
oncul(isinma[11], [vK == vM, abs(vK) == abs(vL), vK == vL], 'Isınma 12')
adim = [(7, 0), (0, 3), (-3, 0)]
yol13 = sum(abs(a) + abs(b) for a, b in adim) * 100; uz13 = boy(topla(*adim)) * 100
sik_esit(isinma[12], f'{yol13} ve {uz13}', 'Isınma 13 (yol 1300 m, uzaklık 500 m)')
F1, F2 = Fr(14 + 2, 2), Fr(14 - 2, 2)
kontrol((F1, F2) == (8, 6), 'Isınma 14: kuvvetler 8 N ve 6 N')
sik_esit(isinma[13], str(boy((int(F1), int(F2)))), 'Isınma 14 (dik: 10 N)')
R15 = topla((3, 2), (-1, 2), (2, -4))
kontrol(R15 == (4, 0), f'Isınma 15: K + L + M = {R15}')
sik_esit(isinma[14], '4 birim, doğu', 'Isınma 15')
Fv = (-3 * 2, 4 * 2)
oncul(isinma[15], [abs(Fv[0]) == 6, abs(Fv[1]) == 4, boy(Fv) == 10], 'Isınma 16 (Fx = 6 N, Fy = 8 N, F = 10 N)')

print('== Deneme ==')
sik_esit(den[0], 'Mekanik, optik, termodinamik', 'Deneme 1')
oncul(den[1], [False, True, True], 'Deneme 2')
oncul(den[2], [True, False, True], 'Deneme 3 (Newton birikimli bilgi, İbnülheysem deneye dayanır, Curie ve nükleer tıp)')
oncul(den[3], [True, True, False], 'Deneme 4 (süratin SI birimi m/s)')
sur = {'otomobil': kmh_ms(90), 'motosiklet': Fr(30), 'kamyon': Fr(1200, 60)}
kontrol(sur == {'otomobil': 25, 'motosiklet': 30, 'kamyon': 20}, f'Deneme 5: otomobil 25 m/s, motosiklet 30 m/s, kamyon 20 m/s')
kontrol(len(set(sur.values())) == 3, 'Deneme 5: üç sürat birbirinden farklı (tek sıralama)')
sira = ', '.join(sorted(sur, key=sur.get, reverse=True))
sik_esit(den[4], sira[0].upper() + sira[1:], 'Deneme 5 (büyükten küçüğe sıralama)')
kontrol('fGosterge(90' in open(os.path.join(D, '9.js'), encoding='utf-8').read().split("konu: 'k2', metin: 'Aynı otoyolda")[1][:400], 'Deneme 5: şekildeki gösterge 90 km/h çiziyor')
b6 = tuple(a + b - c for a, b, c in zip(Nw, (0, 0, 1), (1, 0, 0)))
kontrol(b6 == (0, 1, -1), f'Deneme 6: N s / kg = kg^0 m^1 s^-1 {b6}')
sik_esit(den[5], 'Sürat', 'Deneme 6')
bilye_kg = Fr(2150 - 150, 4) / 1000
sik_esit(den[6], str(float(bilye_kg)).replace('.', ','), 'Deneme 7 ((2150 - 150) g / 4 = 500 g = 0,5 kg)')
oncul(den[7], [True, True, False], 'Deneme 8 (sıcaklık temel niceliktir)')
K9 = (2, -1); aday = {'1': (-4, 2), '2': (4, -2), '3': (-2, 1), '4': (-4, -2), '5': (4, 2)}
hedef = tuple(-2 * c for c in K9)
uyan = [k for k, vv in aday.items() if vv == hedef]
kontrol(len(uyan) == 1, f'Deneme 9: -2K = {hedef} yalnız bir adayla eşleşiyor {uyan}')
sik_esit(den[8], uyan[0], 'Deneme 9')
Bv = (1, 0); Av = tuple(3 * c for c in Bv); Cv = tuple(-c for c in Bv)
zit_yon = capraz(Av, Cv) == 0 and Av[0] * Cv[0] + Av[1] * Cv[1] < 0
oncul(den[9], [zit_yon, zit_yon and boy(Av) == boy(Cv), topla(Av, tuple(3 * c for c in Cv)) == (0, 0)], 'Deneme 10')
oncul(den[10], [False, False, True], 'Deneme 11 (vektörel nicelikler: kuvvet ve hız)')
aralik = (12 - 5, 12 + 5)
olamaz = [sk for sk in den[11]['siklar'] if not aralik[0] <= int(sk.split()[0]) <= aralik[1]]
kontrol(len(olamaz) == 1, f'Deneme 12: aralık {aralik}, dışarıda kalan tek şık {olamaz}')
sik_esit(den[11], olamaz[0], 'Deneme 12')
kontrol('5 N ve 12 N' in den[11]['metin'] and boy((5, 12)) == 13, 'Deneme 12: kuvvetler 5 N ve 12 N, dik durumda 13 N aralığın içinde')
sik_esit(den[12], str(boy((8 * 5, 6 * 5))), 'Deneme 13 (40 N ve 30 N dik: 50 N)')
sik_esit(den[13], str(boy(topla((5, -2), (-2, 6)))), 'Deneme 14 (A + B = (3, 4): 5 birim)')
K15, L15, M15 = (2, 3), (4, -3), (-6, 0)
kontrol(topla((1, 2), K15) == (3, 5) and topla((3, 5), L15) == (7, 2) and topla((7, 2), M15) == (1, 2), 'Deneme 15: şekilde K (1,2)->(3,5), L (3,5)->(7,2), M (7,2)->(1,2) uç uca ve kapalı')
oncul(den[14], [topla(K15, L15, M15) == (0, 0), topla(K15, L15) == M15, boy(topla(K15, L15)) == 6], 'Deneme 15 (K + L = (6, 0) = -M)')

print()
print('Isınma anahtarı :', ' '.join(q['cevap'] for q in isinma))
print('Deneme anahtarı :', ' '.join(q['cevap'] for q in den))
print('SONUÇ:', 'TÜM KONTROLLER GEÇTİ' if not hata else f'{len(hata)} HATA')
sys.exit(1 if hata else 0)
