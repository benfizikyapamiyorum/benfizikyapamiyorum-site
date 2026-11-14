# 11. sınıf sayısal doğrulama (g = 10)
from math import sqrt, isclose
g=10
assert sqrt(80/5)==4 and 80-5*9==35
assert 40*4/2==80 and 80-20*2/2==60
assert 20*5-5*25==-25
assert sqrt(30**2+(g*sqrt(80/5))**2)==50
assert 30**2/20==45 and 40*6==240
assert sqrt(5/5)==1 and 8/1==8
assert 30/(4+6)*4==12
assert 4*12/2==24 and 4*12/3==16
assert 0.5*((30-10)/5)*16==32
assert 6*g-50*0.8==20 and isclose(50*0.6/6,5)
assert (720-600)/60==2
assert 20/5*3==12
assert (40-4*g*0.6)/4==4
# deneme
t=(80+20)/20; assert t==5 and 5*t*t==125
t=(30+10)/g; assert t==4 and 30*t-5*t*t==40 and 30*2-5*4==40
assert (20+40)*2/2==60
t=60/30; assert 30*t-5*t*t==40 and 60-5*t*t==40
t=sqrt(20/5); assert g*t==20 and 20*t==40
assert 20**2/20==20 and 15*(2*20/g)==60
assert sqrt(5/5)==1 and 10/1==10
assert 24/6*3==12
assert 16/(12/2+12/6)==2
assert 72/3.6==20 and 1000*20/5==4000 and 20/2*5==50
assert 30==3*g and 50==(2+3)*g
assert isclose(g*0.8,8) and isclose(2*g*0.6,12)
assert (6000-5000)/500*3==6
print('11: hepsi doğru')
# --- ek ısınma soruları (gün başına 6 yeni soru) ---
# Gün 1
assert 5*3+5*3**2==60 and 5+g*3==35                      # köprüden aşağı atılan taş
assert 5*3**2-5*2**2==25 and g*3-g*2==10                  # 1 s arayla bırakılan K ve L
assert 30/g==3 and 30**2/(2*g)==45 and abs(30-g*1)==abs(30-g*5)==20 and 30*6-5*36==0   # h-t grafiği
tK=sqrt(20/5); assert tK==2 and (20-5*(tK-1)**2)/(tK-1)==15   # K bırakılır, L 1 s sonra atılır
v0=g*(2+8)/2; assert v0==50 and v0*2-5*4==80 and v0*8-5*64==80  # P noktasından iki geçiş
# Gün 2
assert 60/60==1 and 5*1**2==5                             # okçu
assert isclose(2*0.8/g*0.6, 2*0.6/g*0.8) and 0.8>0.6      # 37 ve 53: menzil eşit, L daha uzun havada
t=sqrt(20/5); assert t==2 and 24*t==48 and sqrt(48**2+20**2)==52   # yer değiştirme
assert sqrt(40**2+(50-g*2)**2)==50 and 40*2==80 and all(sqrt(40**2+(50-g*x/10)**2)>50 for x in range(0,20))  # bileşen grafiği
assert isclose(25*0.8,20) and isclose(25*0.6,15) and 40/20==2 and 15*2-5*4==10 and 15/g<2   # çatıya düşen top
assert 40/20==2 and 2<sqrt(45/5) and 45-5*2**2==25        # K ve L çarpışması
# Gün 3
assert sqrt((5-2)**2+4**2)*2==10 and 10/2==5              # kareli zeminde üç kuvvet
v=8/2*2; assert v==8 and v+0*2==8 and v+(-4/2)*2==4       # F-t grafiği
a=4/2; assert 10/a==5 and a*(8-5)==6                      # zıt yönlü kuvvet
assert 12/3==4 and (3+5)*4==32                            # ipin dayanımı
# Gün 4
assert 2*g+2*3==26 and 2*g==20                            # kova
assert isclose(g*0.6,6) and isclose(sqrt(2*6*12),12)      # eğik düzlem, 12 m
a=(4*g-1*g)/(1+4); assert a==6 and a*1==6 and 1*g+1*a==16 and 4*g-4*a==16   # Atwood
a=(6*g-6*g*0.6)/(6+6); assert isclose(a,2) and isclose(6*g-6*a,48) and isclose(6*g*0.6+6*a,48)  # eğik düzlem + makara
print('11: ek sorular doğru')
