// Explicit experiment setups. Values use the units of each existing control.
const L=(values,clicks,question,options,demo={},go=[],toggles={})=>({values,clicks,question,options,demo,go,toggles});
export const lessons={
'devre-laboratuvari':[
 L({voltage:12,resistance:12},['[data-mode="single"]'],'Gerilim yarıya inerse akım?',['Yarıya iner','Değişmez','İki katına çıkar'],{voltage:6},[],{'#switch':true}),
 L({voltage:12,resistance:12},['[data-mode="series"]'],'İki eşit direnci paralel bağlayınca kaynak akımı?',['Dört katına çıkar','İki katına çıkar','Azalır'],{},['[data-mode="parallel"]'],{'#switch':true}),
 L({voltage:12,resistance:12},['[data-mode="single"]'],'Anahtar açılınca akım?',['Sıfır olur','Artar','Değişmez'],{},['#switch'],{'#switch':true})],
'carpisma-laboratuvari':[
 L({m1:2,m2:2,u1:4,u2:0,e:1},[],'Eşit kütleli esnek çarpışmada?',['Hızlar değiş tokuş olur','İkisi durur','Birlikte gider'],{},['#play']),
 L({m1:2,m2:6,u1:4,u2:0,e:0},[],'Yapışınca ortak hız?',['1 m/s','2 m/s','4 m/s'],{},['#play']),
 L({m1:2,m2:2,u1:4,u2:-4,e:1},[],'Toplam momentum sıfırsa enerji?',['Pozitif olabilir','Mutlaka sıfır','Negatif olur'],{},['#play'])],
'vektor-laboratuvari':[
 L({magA:4,angA:0,magB:3,angB:90},[],'Dik 3 ve 4 birim vektörün bileşkesi?',['5 birim','7 birim','1 birim'],{},[],{'#tgC':false}),
 L({magA:4,angA:0,magB:4,angB:180},[],'Zıt ve eşit vektörlerin toplamı?',['Sıfır','4 birim','8 birim'],{},[],{'#tgC':false}),
 L({magA:4,angA:0,magB:4,angB:120,magC:4,angC:240},['[data-mode="tiptotail"]'],'Kapalı üçgenin bileşkesi?',['Sıfır','4 birim','12 birim'],{},[],{'#tgC':true})],
'vektor-3d':[
 L({'i-vk':2.5,'i-va':0,'i-th':0},[],'Akıntı artarsa karşıya geçiş süresi?',['Değişmez','Artar','Azalır'],{'i-va':1.2},['#btn-go']),
 L({'i-vk':2.5,'i-va':1.2,'i-th':29},[],'Akıntıya karşı yönelince sürüklenme?',['Azalır','Artar','Hep aynı'],{},['#btn-go']),
 L({'i-vk':2.5,'i-va':1.2,'i-th':0},['[data-m="tip"]'],'Çizim yöntemini değiştirmek bileşkeyi?',['Değiştirmez','Artırır','Azaltır'],{},['[data-m="para"]','#btn-go'])],
'enerji-sarkac-laboratuvari':[
 L({L:1,th:10,m:1,planet:'9.8',dampOn:false},['[data-g="theta"]'],'İp iki kat uzarsa periyot?',['√2 kat','2 kat','Aynı'],{L:2},['#btnPlay']),
 L({L:1,th:10,m:1,planet:'9.8',dampOn:false},[],'Ay’da periyot?',['Uzar','Kısalır','Değişmez'],{planet:'1.6'},['#btnPlay']),
 L({L:1,th:30,m:1,planet:'9.8',dampOn:false,damp:.4},['[data-g="energy"]'],'Sönümle mekanik enerji?',['Azalır','Artar','Sabit'],{dampOn:true},['#btnPlay'])],
'enerji-sarkac-3d':[
 L({'i-L':80,'i-th':10,'i-b':0},['[data-c="mass"]'],'Kütle dörtte bire inerse periyot?',['Aynı kalır','Yarıya iner','Dörtte bire iner'],{},['#btn-go']),
 L({'i-L':80,'i-th':10,'i-b':0},['[data-c="len"]'],'İp dörtte bire inerse periyot?',['Yarıya iner','Aynı kalır','Dörtte bire iner'],{},['#btn-go']),
 L({'i-L':80,'i-th':30,'i-b':0},['[data-c="none"]'],'Sönümle mekanik enerji nereye gider?',['Isıya dönüşür','Yok olur','Artar'],{'i-b':.4},['#btn-go'])],
'hareket-grafikleri-laboratuvari':[
 L({x0:0,v0:4,a:-2,experimentDuration:'10'},[],'Hız sıfırdan geçince?',['Ters yönde hızlanır','Durur, kalır','İleri hızlanır'],{},['#btnPlay']),
 L({x0:0,v0:4,a:-2,experimentDuration:'10'},[],'4 s sonunda yer değiştirme / yol?',['0 m / 8 m','8 m / 8 m','0 m / 0 m'],{},['#btnPlay']),
 L({x0:0,v0:4,a:2},[],'Başlangıç konumu değişince hız grafiği?',['Aynı kalır','Ötelenir','Ters döner'],{x0:10},['#btnPlay'])],
'hareket-grafikleri-3d':[
 L({},['[data-sc="const"]'],'Eşit zaman aralıklarındaki yollar?',['Eşit','Artıyor','Azalıyor'],{},['#btn-go'],{'#tg-strobe':true}),
 L({},['[data-sc="back"]'],'Yön değiştirme anında hız?',['Sıfır','En büyük','Değişmez'],{},['#btn-go']),
 L({},['[data-sc="race"]'],'Başlangıçta öndeki araç hep kazanır mı?',['Hayır','Evet','İvme önemsiz'],{},['#btn-go'])],
'egik-atis-laboratuvari':[
 L({v:28,vB:28,a:30,aB:60,h:0,hB:0,dragOn:false,dragOnB:false,planet:'9.8',planetB:'9.8'},[],'30° ve 60° atışların menzilleri?',['Eşit','30° daha uzun','60° daha uzun'],{},['#btnFire'],{'#tgCompare':true}),
 L({v:28,vB:28,a:30,aB:60,h:10,hB:10,dragOn:false,dragOnB:false,planet:'9.8',planetB:'9.8'},[],'Yüksekten atışta tümler açıların menzilleri?',['Genellikle farklı','Her zaman eşit','İkisi sıfır'],{},['#btnFire'],{'#tgCompare':true}),
 L({v:28,vB:28,a:45,aB:45,h:0,hB:0,m:1,mB:1,dragOn:false,dragOnB:true,kB:.02},[],'Dirençli atışın menzili?',['Daha kısa','Daha uzun','Aynı'],{},['#btnFire'],{'#tgCompare':true})],
'egik-atis-3d':[
 L({'i-v0':18,'i-ang':45,'i-h0':0,'i-drag':false,'i-g10':false},['[data-p="earth"]'],'Direnç yokken yatay hız?',['Sabit','Artar','Azalır'],{},['#btn-fire'],{'#tg-strobe':true}),
 L({'i-v0':18,'i-ang':45,'i-h0':0,'i-drag':false,'i-g10':false},['[data-p="earth"]'],'Ay’da menzil?',['Artar','Azalır','Aynı'],{},['[data-p="moon"]','#btn-fire']),
 L({'i-v0':18,'i-ang':45,'i-h0':0,'i-drag':false},['[data-p="earth"]','[data-b="beach"]'],'Hava direnci menzili?',['Kısaltır','Uzatır','Değiştirmez'],{'i-drag':true},['#btn-fire'])],
'basinc-kaldirma-laboratuvari':[
 L({ro:600,rl:1000,s:.5,planet:'9.8'},[],'Yüzen cismin hacminin ne kadarı batar?',['%60','%40','%100'],{},['#btnDrop']),
 L({ro:600,rl:1000,s:.5,planet:'9.8'},[],'Boyut artınca batan hacim oranı?',['Değişmez','Artar','Azalır'],{s:.8},['#btnDrop']),
 L({ro:600,rl:1000,s:.5,planet:'9.8'},[],'Ay’da batan hacim oranı?',['Değişmez','Artar','Azalır'],{planet:'1.6'},['#btnDrop'])],
'basinc-kaldirma-3d':[
 L({'i-rho':1,'i-moon':false},['[data-m="free"]'],'Sıvı yoğunluğu artarsa yumurta?',['Daha kolay yüzer','Daha çok batar','Etkilenmez'],{'i-rho':1.2},['#btn-drop']),
 L({'i-rho':1,'i-dyn':30},['[data-m="dyn"]'],'Cisim suya inince dinamometre?',['Daha az gösterir','Daha fazla','Aynı'],{'i-dyn':0}),
 L({'i-rho':1},['[data-m="probe"]'],'Sıvıda derine indikçe basınç?',['Artar','Azalır','Sabit'],{},[])],
'dalga-laboratuvari':[
 L({A1:1,L1:3,f1:.5,dir1:'1'},[],'0,5 Hz için periyot?',['2 s','0,5 s','1 s'],{},[],{'#tgTwo':false}),
 L({A1:1,A2:1,L1:3,L2:3,f1:.6,f2:.6,dir1:'1',dir2:'-1'},[],'Eşit zıt yönlü dalgalar?',['Duran dalga','Hep yok olur','Frekans sıfırlanır'],{},[],{'#tgTwo':true}),
 L({A1:1,L1:2,f1:.5},[],'λ sabitken frekans iki kat olursa hız?',['İki kat','Aynı','Yarı'],{f1:1},[],{'#tgTwo':false})],
'dalga-3d':[
 L({'i-f':10,'i-a':1},['[data-s="point"]','[data-b="none"]','[data-d="deep"]'],'Aynı ortamda frekans artınca dalga boyu?',['Kısalır','Uzar','Sabit'],{'i-f':20}),
 L({'i-f':10,'i-w':8},['[data-s="line"]','[data-b="slit"]'],'Dar yarıkta yayılma?',['Belirginleşir','Yok olur','Frekans artar'],{'i-w':1}),
 L({'i-f':10},['[data-s="line"]','[data-b="none"]','[data-d="half"]'],'Sığ bölgeye geçen dalganın frekansı?',['Değişmez','Artar','Azalır'])],
'manyetik-alan-laboratuvari':[
 L({src:'wire',cur:5},[],'Aynı noktada akım iki kat olursa B?',['İki kat','Yarı','Aynı'],{cur:10}),
 L({src:'wire',cur:10},[],'Tel uzaklığı iki kat olursa B?',['Yarı','İki kat','Aynı']),
 L({src:'solenoid',cur:10,nturns:200,len:20},[],'Bobinin içinde alan yaklaşık?',['Düzgün','Sıfır','Her yerde ters'])],
'manyetik-alan-3d':[
 L({'i-i':10},['[data-s="wire"]'],'Akımı ters çevirince alan yönü?',['Ters döner','Aynı','Yok olur'],{},['#btn-rev'],{'#tg-earth':false,'#btn-pow':true}),
 L({'i-i':10,'i-n':20},['[data-s="sol"]'],'Bobin ve çubuk mıknatısın alanları?',['Benzer desen','Alakasız','İkisi sıfır'],{},['[data-s="bar"]']),
 L({'i-i':10},['[data-s="wire"]'],'Akım kesilince pusulayı ne yöneltir?',['Dünya alanı','Hiçbir şey','Önceki akım'],{},['#btn-pow'],{'#tg-earth':true,'#btn-pow':true})],
'optik-laboratuvari':[
 L({type:'convex_lens',f:12,do:24,ho:8},[],'Cisim 2f’deyse görüntü?',['Ters, aynı boy','Düz, büyük','Ters, küçük']),
 L({type:'convex_lens',f:12,do:8,ho:8},[],'Cisim odak içindeyse görüntü?',['Sanal, düz, büyük','Gerçek, ters','Görüntü yok']),
 L({type:'concave_lens',f:12,do:30,ho:8},[],'Iraksak merceğin görüntüsü?',['Sanal, düz, küçük','Gerçek, ters','Düz, büyük'])],
'optik-3d':[
 L({'i-r':1,'i-g':1,'i-b':0},['[data-m="color"]'],'Kırmızı ve yeşil ışık birleşince?',['Sarı','Mavi','Siyah']),
 L({'i-r':1,'i-g':1,'i-b':1},['[data-m="color"]','[data-o="apple"]'],'Kırmızı cisim yalnız yeşil ışıkta?',['Koyu görünür','Kırmızı parlar','Beyaz olur'],{'i-r':0,'i-b':0}),
 L({'i-f':12,'i-do':30,'i-s':40},['[data-m="bench"]','[data-e="conv"]'],'f=12, cisim 30 cm: net görüntü nerede?',['20 cm','30 cm','12 cm'],{'i-s':20})],
'sahin-ivme-yarisi':[
 L({},['[data-preset="force"]'],'Aynı kuvvette kim daha hızlı ivmelenir?',['Hafif araç','Ağır araç','İkisi aynı'],{},['#race-start']),
 L({},['[data-preset="accel"]'],'F/m eşitken yarış?',['Berabere','Hafif kazanır','Ağır kazanır'],{},['#race-start']),
 L({},['[data-preset="mass"]'],'Durgunluktan aynı süre sonra iki kat kuvvet?',['İki kat hız','√2 kat hız','Aynı hız'],{},['#race-start'])]
};
export function setValues(values,root=document){for(const [id,value] of Object.entries(values||{})){const el=root.querySelector('#'+CSS.escape(id));if(!el)throw Error('Kontrol bulunamadı: '+id);if(el.type==='checkbox')el.checked=!!value;else el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}}
export function pressed(el){if(el.id==='btn-pow')return el.textContent.includes('Akımı kes');return el.getAttribute('aria-pressed')==='true'||el.classList.contains('on')||el.classList.contains('active');}
export function clickAll(selectors,root=document){for(const selector of selectors||[]){const el=root.querySelector(selector);if(!el||el.disabled)throw Error('Deney henüz hazır değil: '+selector);el.click();}}
