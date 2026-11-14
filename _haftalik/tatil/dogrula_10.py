#!/usr/bin/env python3
# 10. sınıf Ara Tatil Fizik Kampı: bütün sayısal sonuçların bağımsız doğrulaması.
# Çalıştır: python3 dogrula_10.py   (hata varsa AssertionError verir, yoksa "TAMAM" yazar)
from fractions import Fraction as Fr
import json, subprocess, os

g = 10
N = 0


def esit(ad, bulunan, beklenen):
    global N
    N += 1
    ayni = bulunan == beklenen if isinstance(beklenen, (str, list, bool)) else Fr(bulunan) == Fr(beklenen)
    assert ayni, f'{ad}: bulunan {bulunan}, beklenen {beklenen}'
    print(f'  ok  {ad}: {beklenen}')


def alan(pts):
    """Parçalı doğrusal grafiğin yatay eksenle arasındaki işaretli alan (yamuk kuralı)."""
    return sum(Fr(pts[i][1] + pts[i + 1][1], 2) * (pts[i + 1][0] - pts[i][0]) for i in range(len(pts) - 1))


def yol(pts):
    """Parçalı doğrusal hız–zaman grafiğinde alınan yol (işaret değişimi doğru parçası içindeyse böler)."""
    t = Fr(0)
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        if y1 * y2 < 0:
            xk = x1 + Fr(y1, y1 - y2) * (x2 - x1)
            t += abs(Fr(y1, 2) * (xk - x1)) + abs(Fr(y2, 2) * (x2 - xk))
        else:
            t += abs(Fr(y1 + y2, 2) * (x2 - x1))
    return t


print('KAPAK ve GÖVDE ŞEKİLLERİ')
a = 4
for t, x, v in [(1, 2, 4), (2, 8, 8), (3, 18, 12)]:
    esit(f'kapak x({t})', Fr(a * t * t, 2), x); esit(f'kapak v({t})', a * t, v)
esit('kapak aralıklar', [2 - 0, 8 - 2, 18 - 8] == [2, 6, 10], True)
# Gün 1 şekli: 5 m → 25 m → 15 m, 10 s
esit('G1 yol', (20 - 5) + (20 - 10), 25); esit('G1 Δx', 10 - 5, 5)
esit('G1 sürat', Fr(25, 5), 5); esit('G1 hız', Fr(5, 5), 1)
esit('G1 x–t eğim', Fr(80 - 20, 4), 15); esit('G1 ϑ–t alan', 15 * 4, 60)
# Gün 2 grafikleri: ϑ0 = 6, ϑ = 18, t = 4
esit('G2 eğim', Fr(18 - 6, 4), 3); esit('G2 alan', alan([(0, 6), (4, 18)]), 48); esit('G2 a–t alan', 3 * 4, 12)
esit('G2 model 2', 6 * 4 + Fr(1, 2) * 3 * 4 ** 2, 48)
# Fren kutusu: a = 5 m/s² ile 10 m/s ve 20 m/s
for v0, d in [(10, 10), (20, 40)]:
    t = Fr(v0, 5); esit(f'G2 fren {v0}', Fr(v0, 2) * t, d)
# Gün 3 şekli
esit('G3 W_F', 60 * 5, 300); esit('G3 W_s', -20 * 5, -100); esit('G3 net', 300 - 100, 200); esit('G3 Fnet Δx', (60 - 20) * 5, 200)
esit('G3 F–x alan', alan([(0, 40), (4, 40), (8, 0)]), 240); esit('G3 parça 1', 40 * 4, 160); esit('G3 parça 2', Fr(40 * 4, 2), 80)
# Gün 4 şekli ve örnek
W = 100 * g * 6
esit('G4 W', W, 6000); esit('G4 P_K', Fr(W, 10), 600); esit('G4 P_L', Fr(W, 30), 200)
esit('G4 günlük kWh', 2 * Fr(1, 2), 1); esit('G4 aylık TL', 1 * 30 * 3, 90); esit('G4 1 kWh', 1000 * 3600, 3_600_000)

print('ISINMA SORULARI (ilk 16 soru; numaralar ilk sürümdeki sıradır)')
# 1
p = [(0, 0), (4, 40), (6, 40), (10, -20)]
esit('S1 Δx', p[-1][1] - p[0][1], -20); esit('S1 yol', sum(abs(p[i + 1][1] - p[i][1]) for i in range(3)), 100)
# 2
t = Fr(200, 25 - 15); esit('S2 t', t, 20); esit('S2 x_K', 25 * t, 500); esit('S2 kontrol', 15 * t + 200, 500)
# 3
esit('S3 Δx', 8 * 3 + (-4) * 6, 0); esit('S3 yol', 8 * 3 + 4 * 6, 48)
# 4
esit('S4', Fr(400 + 200, 20), 30)
# 5
esit('S5 a', Fr(-8 - 20, 7), -4); esit('S5 ϑ=0', Fr(20, 4), 5)
esit('S5 Δx', alan([(0, 20), (7, -8)]), 42); esit('S5 yol', yol([(0, 20), (7, -8)]), 58)
# 6
tf = Fr(30, 5); df = Fr(30 + 0, 2) * tf
esit('S6 fren yolu', df, 90); esit('S6', 130 - 30 * 1 - df, 10)
# 7
esit('S7', 10 + 2 * 4 + (-3) * 4, 6)
# 8
t = 10; esit('S8 eşitlik', Fr(1, 2) * 2 * t * t, 10 * t); esit('S8 ϑ', 2 * t, 20); esit('S8 t=5 fark', 10 * 5 - Fr(1, 2) * 2 * 25, 25)
# 10
esit('S10', 50 * 4 - 20 * 6, 80)
# 11
esit('S11 halat', 200 * g * 15, 30000); esit('S11 net', 200 * g * 15 - 200 * g * 15, 0)
# 12
esit('S12 L', -850 * 2, -1700); esit('S12 net', (900 - 850) * 2, 100)
# 13
esit('S13', Fr(120 * g * 5, 60), 100)
# 14
esit('S14 Wh', (100 - 20) * 5 * 30, 12000); esit('S14 kWh', Fr(100 - 20, 1000) * 5 * 30, 12); esit('S14 TL', 12 * 3, 36)
# 15
esit('S15 W_E', 50 * g * 6, 3000); esit('S15 W_C', 60 * g * 6, 3600); esit('S15 P_E', Fr(3000, 10), 300); esit('S15 P_C', Fr(3600, 15), 240)
# 16
esit('S16 J', 2400 * 50 * 60, 7_200_000); esit('S16 kWh', Fr(2400, 1000) * Fr(50, 60), 2); esit('S16 tutarlılık', Fr(7_200_000, 3_600_000), 2)

print('EK ISINMA SORULARI (gün başına 6 yeni soru)')
# Gün 1
v = Fr(50 - (-30), 10); esit('E1 hız', v, 8); esit('E1 konum', -30 + v * 6, 18)
esit('E2 aralık', 21 - 1, 20); esit('E2 m/s', Fr(20 * 10, 10), 20); esit('E2 km/h', Fr(20 * 10, 10) * Fr(36, 10), 72)
t1, t2 = Fr(180, 90), Fr(180, 60); esit('E4 süre', t1 + t2, 5); esit('E4 ort. sürat', Fr(360, t1 + t2), 72)
vK = Fr(80 - 20, 6); t = Fr(120 - 20, vK + 15)
esit('E7 ϑ_K', vK, 10); esit('E7 t', t, 4); esit('E7 x_K', 20 + vK * t, 60); esit('E7 x_L', 120 - 15 * t, 60)
esit('E9 ilk', Fr(300 - 100, 4 + 6), 20); esit('E9 karşılaşma', Fr(300, 10), 30); esit('E9 ikinci', Fr(300 + 100, 10), 40)
def konum(tt):  # ϑ–t: 0–4 s 10 m/s, 4–6 s 0, 6–10 s −5 m/s; x0 = −30 m
    return -30 + 10 * min(tt, 4) + (-5) * max(0, tt - 6)
esit('E10 x(3)', konum(3), 0); esit('E10 x(4)', konum(4), 10); esit('E10 x(8)', konum(8), 0); esit('E10 x(10)', konum(10), -10)
esit('E10 sıfır geçişleri', [k for k in range(0, 41) if konum(Fr(k, 4)) == 0], [12, 32])
# Gün 2
aK, aL, aM = Fr(30 - 10, 10), Fr(12 - 0, 3), Fr(10 - 25, 5)
esit('E11 ivmeler', [aK, aL, aM] == [2, 4, -3], True); esit('E11 sıra', abs(aL) > abs(aM) > abs(aK), True)
v0, v1 = Fr(36 * 10, 36), Fr(108 * 10, 36)
esit('E12 m/s', [v0, v1] == [10, 30], True); esit('E12 a', Fr(v1 - v0, 4), 5); esit('E12 Δx', Fr(v0 + v1, 2) * 4, 80); esit('E12 model 2', v0 * 4 + Fr(1, 2) * 5 * 16, 80)
a = Fr(2 * 4, 2 ** 2); esit('E14 a', a, 2); esit('E14 ilk 4 s', Fr(1, 2) * a * 16, 16); esit('E14 2–4 s', Fr(1, 2) * a * 16 - 4, 12)
esit('E15 alan', alan([(0, 0), (20, 20), (50, 20), (60, 0)]), 900); esit('E15 ivme', abs(Fr(0 - 20, 60 - 50)), 2); esit('E15 hızlanma ivmesi', Fr(20, 20), 1)
d1 = Fr(0 + 10, 2) * 4; esit('E17 ilk kısım', d1, 20); esit('E17 süre', 4 + Fr(100 - d1, 10), 12)
t = Fr(30 - 10, 5); esit('E20 t', t, 4); esit('E20 K', Fr(30 + 10, 2) * t, 80); esit('E20 L', 10 * t, 40); esit('E20 fark', Fr(30 + 10, 2) * t - 10 * t, 40)
esit('E20 model 2', 30 * t - Fr(1, 2) * 5 * t * t, 80)
# Gün 3
esit('E23 Δx (m)', Fr(50, 100), Fr(1, 2)); esit('E23 iş', -8 * Fr(50, 100), -4)
esit('E25 iş', 80 * 5, 400)
esit('E27 0–3', alan([(0, 0), (3, 30)]), 45); esit('E27 toplam', alan([(0, 0), (6, 60)]), 180); esit('E27 3–6', alan([(3, 30), (6, 60)]), 135)
esit('E29', 50 * 0 + 50 * 2 + 50 * 0 - 50 * 1, 50)
esit('E30 F1', Fr(200, 4), 50); esit('E30 F2', Fr(200 - 200, 2), 0); esit('E30 F3', Fr(300 - 200, 4), 25)
# Gün 4
esit('E31 J', 10 * 5 * 60, 3000); esit('E31 kWh', Fr(10 * 100, 1000), 1)
esit('E33 yol', 5 * 60, 300); esit('E33 iş', 40 * 300, 12000); esit('E33 güç', Fr(12000, 60), 200)
esit('E34 kWh', 4529 - 4520, 9); esit('E34 W', Fr(9, 11 - 8) * 1000, 3000)
esit('E37 kWh', 2 * 2 + 1 * 4, 8); esit('E37 TL', 8 * 3, 24)
kalan = 60 - 15 * 2; esit('E39 kalan', kalan, 30); esit('E39 dakika', Fr(kalan, 30) * 60, 60)
panel = Fr(300, 1000) * 5 * 30; esit('E40 panel 30 gün', panel, 45); esit('E40', Fr(180, panel), 4)

print('DENEME')
# 1
vK, vL = Fr(90, 6), Fr(40 - 100, 6)
esit('D1 ϑ_K', vK, 15); esit('D1 ϑ_L', vL, -10); esit('D1', abs(vK * 8 - (100 + vL * 8)), 100)
# 2
v = Fr(30 - 10, 2); esit('D2 ϑ', v, 10); esit('D2', Fr(150 - 10, v), 14)
# 4
kalan = 440 - 80 * 1; t = Fr(kalan, 80 + 100)
esit('D4 t', t, 2); esit('D4', 80 * (1 + t), 240); esit('D4 kontrol', 80 * 3 + 100 * 2, 440)
# 5
a = Fr(10 - 6, 2); esit('D5 a', a, 2); v8 = 6 + a * 8; esit('D5 ϑ', v8, 22); esit('D5 Δx', Fr(6 + v8, 2) * 8, 112); esit('D5 model 2', 6 * 8 + Fr(1, 2) * a * 64, 112)
for tt, vv in [(2, 10), (4, 14), (6, 18)]:
    esit(f'D5 tablo t={tt}', 6 + a * tt, vv)
# 6
esit('D6 a_K', Fr(20, 10), 2); esit('D6 a_L', abs(Fr(-20, 10)), 2)
esit('D6 Δx_K', alan([(0, 0), (10, 20)]), 100); esit('D6 Δx_L', alan([(0, 20), (10, 0)]), 100)
esit('D6 K(5)', alan([(0, 0), (5, 10)]), 25); esit('D6 L(5)', alan([(0, 20), (5, 10)]), 75)
# 8
t = Fr(60, 4); esit('D8 t', t, 15); esit('D8', Fr(0 + 60, 2) * t, 450); esit('D8 model 2', Fr(1, 2) * 4 * t * t, 450)
# 9
esit('D9', alan([(0, 150), (10, 90)]), 1200)
# 10
esit('D10 kaldırma', 40 * 1, 40)
# 11
esit('D11 sporcu', 40 * 3, 120); esit('D11 sürtünme', -4 * 30, -120); esit('D11 net', 120 - 120, 0)
# 12 (F = 1, x = 1 birim)
WK, WL, WM = 1 * 3, 2 * 2, 3 * 1
esit('D12', WL > WK == WM, True)
# 13
gunluk = Fr(2000, 1000) * 1 + Fr(1000, 1000) * 3 + Fr(200, 1000) * 5
esit('D13 günlük', gunluk, 6); esit('D13', gunluk * 30 * 3, 540)
# 14
PK, PL = Fr(6000, 20), Fr(4000, 40)
esit('D14 P_K', PK, 300); esit('D14 P_L', PL, 100); esit('D14', Fr(12000, PK + PL), 30)
# 15
esit('D15', Fr(150 * 20, 50), 60)

# ---------- Yapı denetimi: 10.js içindeki cevap anahtarı ve biçim ----------
print('YAPI')
js = r"""
const N = require('./10.js');
const out = { gun: N.gunler.map(g => ({ n: g.sorular.length, c: g.sorular.map(q => q.cevap), s: g.sorular.map(q => q.siklar.length), k: g.kontrol.length })),
  d: N.deneme.map(q => ({ c: q.cevap, k: q.konu, s: q.siklar.length, sek: !!q.sekil })), sinif: N.sinif };
const metin = JSON.stringify([N.gunler.map(g => [g.baslik, g.alt, g.plan, g.kisa, g.kontrol, g.sorular.map(q => [q.metin, q.kok, q.onc, q.siklar, q.cozum])]), N.deneme.map(q => [q.metin, q.kok, q.onc, q.siklar, q.cozum]), N.planNot]);
out.ortaNokta = (metin.match(/·/g) || []).length;
console.log(JSON.stringify(out));
"""
klasor = os.path.dirname(os.path.abspath(__file__))
o = json.loads(subprocess.run(['node', '-e', js], cwd=klasor, capture_output=True, text=True, check=True).stdout)
esit('sınıf', o['sinif'], 10)
esit('gün sayısı', len(o['gun']), 4)
for i, gun in enumerate(o['gun'], 1):
    esit(f'gün {i} soru sayısı', gun['n'], 10); esit(f'gün {i} şık sayıları', all(s == 5 for s in gun['s']), True); esit(f'gün {i} kontrol 3-4', gun['k'] in (3, 4), True)
isinma = ''.join(c for gun in o['gun'] for c in gun['c'])
esit('ısınma anahtarı', isinma, 'CDBADCEAEB' 'CEABECDADB' 'CDBBEAECAD' 'EBADECDABC')
for i, gun in enumerate(o['gun'], 1):
    k = ''.join(gun['c'])
    esit(f'gün {i} her harf en az 1', all(h in k for h in 'ABCDE'), True)
    esit(f'gün {i} art arda 3 aynı harf yok', any(k[j] == k[j + 1] == k[j + 2] for j in range(8)), False)
esit('ısınma harf dağılımı 6-10', all(6 <= isinma.count(h) <= 10 for h in 'ABCDE'), True)
anahtar = ''.join(q['c'] for q in o['d'])
esit('deneme soru sayısı', len(o['d']), 15)
esit('deneme anahtarı', anahtar, 'CADBECDBBEADCAE')
esit('harf dağılımı 3er', sorted(anahtar.count(h) for h in 'ABCDE'), [3, 3, 3, 3, 3])
esit('art arda 3 aynı harf yok', any(anahtar[i] == anahtar[i + 1] == anahtar[i + 2] for i in range(13)), False)
esit('konu dağılımı', [sum(q['k'] == k for q in o['d']) for k in ('k1', 'k2', 'k3', 'k4')], [4, 4, 4, 3])
esit('şekilli deneme sorusu >= 6', sum(q['sek'] for q in o['d']) >= 6, True)
esit('deneme şık sayıları', all(q['s'] == 5 for q in o['d']), True)
esit('orta nokta yok', o['ortaNokta'], 0)

print(f'TAMAM: {N} denetim geçti.')
