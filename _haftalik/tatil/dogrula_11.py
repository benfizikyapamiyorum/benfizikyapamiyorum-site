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
