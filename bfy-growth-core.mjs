export const tasks = [
  {id:'kaldirma',path:'basinc-kaldirma-3d.html',title:'Yumurtayı askıda bırak',intro:'Yumurtayı suya bırak. Sıvının özkütlesini değiştirerek yumurtayı ne yüzen ne batan duruma getir.',rule:'Serbest bırakma modunda yumurta tamamen suyun içinde olmalı. Sıvının özkütlesini ayarla; yumurta tabana değiyorsa onu tutup suyun ortasına bırak.',hint:'Tamamen suya batmış cisim askıda kalırken cismin ve sıvının özkütleleri eşittir.',answer:'Bu modelde yumurtanın özkütlesi 1,07 g/cm³. Sıvı da bu değerdeyken kaldırma kuvveti ağırlığı dengeler.'},
  {id:'carpisma',path:'carpisma-laboratuvari.html',title:'Çarpışmadan sonra 1 m/s',intro:'2 kg kütleli A aracı 4 m/s hızla, duran B aracına çarpsın. Araçlar yapışsın; ortak hızları 1 m/s olsun.',rule:'A: 2 kg ve +4 m/s. B: ilk hız 0. Esneklik 0. Yalnızca B’nin kütlesini bul; filmi çarpışma sonrasına kadar izle.',hint:'Başlangıç momentumu 8 kg·m/s. Yapıştıktan sonra iki aracın toplam kütlesini kullan.',answer:'B’nin kütlesi 6 kg: 2×4 = (2+6)×1. Momentum korunur; kinetik enerjinin bir kısmı iç enerjiye dönüşür.'},
  {id:'atis',path:'egik-atis-3d.html',title:'Üç atışta 30 metre',intro:'20 m/s hızla atılan topu 30 metre uzaktaki hedefe ulaştır. Açıyı bulmak için üç atış hakkın var.',rule:'Dünya, g = 10 m/s², başlangıç yüksekliği 0, hava direnci kapalı. Hız sabit; yalnızca açıyı değiştir. Hedefin ±1,2 m çevresi isabet sayılır.',hint:'Aynı seviyeye düşen atışta R = v₀² sin(2θ) / g. 45° en büyük menzili verir.',answer:'R = 40 sin(2θ). Yaklaşık 24° veya 66° ile 30 metreye ulaşırsın; aynı menzil iki farklı açıyla elde edilebilir.'},
  {id:'devre',path:'devre-laboratuvari.html',title:'Kaynak akımını iki katına çıkar',intro:'12 V kaynak ve her biri 12 Ω olan iki ampulle kaynak akımını 2 A yap. Gerilimi ve ampul dirençlerini değiştirme.',rule:'İki ampulün bağlantı biçimini seç. Anahtar kapalı olmalı; ampermetrede 2 A görmelisin.',hint:'Paralel kollarda her ampulün uçlarındaki gerilim kaynak gerilimine eşittir. Kaynak akımı kolların toplamıdır.',answer:'Paralel bağla: Rₑş = 6 Ω, I = 12/6 = 2 A. Her koldan 1 A geçer.'}
];
const dayMs=86400000, anchor=Date.UTC(2026,9,12);
export function weekInfo(now=new Date(), requested='') {
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const part=k=>parts.find(p=>p.type===k).value;
  let d=new Date(`${part('year')}-${part('month')}-${part('day')}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);
  const current=d.toISOString().slice(0,10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(requested)) {
    const chosen=new Date(requested+'T00:00:00Z');
    if (Number.isFinite(+chosen)&&chosen.toISOString().slice(0,10)===requested&&chosen.getUTCDay()===1&&+chosen>=anchor&&+chosen<=+d) d=chosen;
  }
  const index=((Math.floor((+d-anchor)/(7*dayMs))%tasks.length)+tasks.length)%tasks.length;
  const end=new Date(+d+6*dayMs);
  const fmt=x=>new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',timeZone:'UTC'}).format(x);
  return {key:d.toISOString().slice(0,10),current,index,task:tasks[index],label:`${fmt(d)} – ${fmt(end)}`,next:new Date(+d+7*dayMs).toISOString().slice(0,10)};
}
const near=(a,b,t=.01)=>Number.isFinite(a)&&Math.abs(a-b)<=t;
export function assess(id,s) {
  if (!s) return {ok:false,message:'Laboratuvar henüz hazır değil. Sahne açıldıktan sonra tekrar dene.'};
  if (id==='kaldirma') {
    const ok=s.selected==='egg'&&s.mode==='free'&&s.inTank&&!s.hung&&!s.grab&&s.clearFloor&&s.submerged>.99&&near(s.density,1070,1)&&Math.abs(s.velocity)<.02;
    return {ok,message:ok?tasks[0].answer:'Serbest bırakma modunda yumurtayı suya bırak; sıvı özkütlesini değiştir. Tabana değiyorsa yumurtayı tutup suyun ortasına bırak; tamamen su içindeyken hareketinin durulmasını bekle.'};
  }
  if (id==='carpisma') {
    const ok=near(s.m1,2)&&near(s.u1,4)&&near(s.u2,0)&&near(s.e,0)&&near(s.m2,6)&&s.hit&&near(s.v1,1)&&near(s.v2,1);
    return {ok,message:ok?tasks[1].answer:'A’nın 2 kg ve +4 m/s, B’nin ilk hızının 0, esnekliğin 0 olduğundan emin ol. B’nin kütlesini ayarla ve çarpışma sonrasını izle.'};
  }
  if (id==='atis') {
    if (!s.weekly) return {ok:false,message:'Önce “Görevi başlat” ile haftalık hedefi kur.'};
    if (!s.landed) return {ok:false,message:'Atışın tamamlanmasını bekle, sonra sonucu kontrol et.'};
    const valid=near(s.v0,20)&&near(s.g,10)&&near(s.h0,0)&&s.planet==='earth'&&!s.drag;
    const ok=valid&&s.tries<=3&&s.tries>0&&near(s.range,30,1.2);
    return {ok,message:ok?`${s.tries}. atışta isabet! ${tasks[2].answer}`:s.tries>=3?'Üç atış tamamlandı. İpucunu inceleyip görevi yeniden başlatabilirsin.':`Hedef henüz tutmadı. ${Math.max(0,3-s.tries)} atış hakkın var; açıyı ayarlayıp yeniden dene.`};
  }
  if (id==='devre') {
    const ok=s.mode==='parallel'&&s.closed&&near(s.V,12)&&near(s.R,12)&&near(s.I,2);
    return {ok,message:ok?tasks[3].answer:'Kaynağı 12 V, her ampulü 12 Ω yap. İki ampulün bağlantı biçimini değiştirip anahtarı kapat.'};
  }
  return {ok:false,message:'Bu görev bulunamadı.'};
}
