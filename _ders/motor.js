const sahne=document.getElementById('sahne'), S=[...sahne.querySelectorAll('.sl')];
let si=0;
function olcek(){const k=Math.min(innerWidth/1920,innerHeight/1080);sahne.style.transform=`scale(${k}) translate(-50%,-50%)`;sahne.style.transformOrigin='0 0';sahne.style.left='50%';sahne.style.top='50%';}
// her slaytın yazı boyunu, bütün cevaplar açıkken sığacak şekilde küçült
function sigdir(sl){
  if(!sl.classList.contains('soru')&&!sl.classList.contains('konu'))return;
  const ad=[...sl.querySelectorAll('.adim')];ad.forEach(a=>a.classList.add('acik'));
  sl.style.display='block';let f=sl.classList.contains('konu')?40:30;sl.style.fontSize=f+'px';
  const tasar=()=>{const alt=sl.querySelector('.alt').offsetTop;return [...sl.querySelectorAll('.sol,.sag,.bag,.mad')].some(e=>e.getBoundingClientRect&&(e.offsetTop+e.offsetHeight>alt-8));};
  while(f>18&&tasar()){f-=1;sl.style.fontSize=f+'px';}
  ad.forEach(a=>a.classList.remove('acik'));sl.style.display='';
}
function adimlar(sl){
  // sıra: her madde için önce o maddeye bağlı tablo satırları, sonra cevap kutusu
  const dold=(sl.dataset.dold||'').split(',').filter(Boolean).map(Number), out=[];
  const satirlar=[...sl.querySelectorAll('tr.adim.satir')];
  sl.querySelectorAll('.adim').forEach(a=>{ if(a.matches('tr.satir'))return;
    const m=a.closest('.madde'); if(m&&dold.includes(+m.dataset.m)){ satirlar.forEach(s=>out.push(s)); }
    out.push(a);});
  return out;
}
function goster(i){S.forEach((s,k)=>s.classList.toggle('aktif',k===i));si=i;guncelle();if(typeof inkCiz==='function')inkCiz();}
function guncelle(){const sl=S[si],A=adimlar(sl),n=A.filter(a=>a.classList.contains('acik')).length;
  document.getElementById('sayac').textContent=`${si+1} / ${S.length}`;
  document.getElementById('ilerleme').style.width=((si+(A.length?n/A.length:1))/S.length*100)+'%';
  sl.querySelectorAll('.madde').forEach(m=>m.classList.remove('su'));
  const son=[...A].reverse().find(a=>a.classList.contains('acik')); const mm=son&&son.closest('.madde'); if(mm)mm.classList.add('su');
  vurgula(sl,son);}
function vurgula(sl,son){const sv=sl.querySelector('.vsvg');if(!sv)return;const v=son&&son.dataset&&son.dataset.vurgu;
  sv.classList.toggle('odak',!!v);sv.querySelectorAll('g.vek').forEach(g=>g.classList.toggle('on',!!v&&v.split(',').includes(g.dataset.ad)));}
function ileri(){const A=adimlar(S[si]),k=A.find(a=>!a.classList.contains('acik'));
  if(k){k.classList.add('acik');guncelle();if(k.scrollIntoView)0;return;} if(si<S.length-1)goster(si+1);}
function geri(){const A=adimlar(S[si]),k=[...A].reverse().find(a=>a.classList.contains('acik'));
  if(k){k.classList.remove('acik');guncelle();return;} if(si>0){goster(si-1);adimlar(S[si]).forEach(a=>a.classList.add('acik'));guncelle();}}
async function tamEkran(){const d=document,e=d.documentElement;try{if(!(d.fullscreenElement||d.webkitFullscreenElement)){(e.requestFullscreen?await e.requestFullscreen():e.webkitRequestFullscreen&&e.webkitRequestFullscreen());}else{(d.exitFullscreen?await d.exitFullscreen():d.webkitExitFullscreen&&d.webkitExitFullscreen());}}catch(x){}}
// ---- Kalem: Apple Pencil (ya da ✎ açıkken fare) çizer, parmak dokunuşu ilerletir. Her slaytın çizimi ayrı saklanır. ----
const ink=document.getElementById('ink'),cx=ink.getContext('2d'),CIZ={};let renk='#1d3b8f',silgi=false,fare=false,akt=null,yut=false;
function inkCiz(){cx.clearRect(0,0,1920,1080);(CIZ[si]||[]).forEach(st=>{cx.globalCompositeOperation=st.s?'destination-out':'source-over';cx.strokeStyle=st.r;cx.lineWidth=st.s?28:st.w;cx.lineCap=cx.lineJoin='round';cx.beginPath();st.p.forEach((q,i)=>i?cx.lineTo(q[0],q[1]):cx.moveTo(q[0],q[1]));if(st.p.length===1)cx.lineTo(st.p[0][0]+.1,st.p[0][1]);cx.stroke();});cx.globalCompositeOperation='source-over';}
function nokta(e){const r=ink.getBoundingClientRect();return[(e.clientX-r.left)*1920/r.width,(e.clientY-r.top)*1080/r.height];}
const kalemMi=e=>e.pointerType==='pen'||(fare&&e.pointerType==='mouse');
ink.addEventListener('pointerdown',e=>{if(!kalemMi(e))return;e.preventDefault();ink.setPointerCapture(e.pointerId);akt={r:renk,w:4.5,s:silgi,p:[nokta(e)]};(CIZ[si]=CIZ[si]||[]).push(akt);inkCiz();});
ink.addEventListener('pointermove',e=>{if(!akt||!kalemMi(e))return;e.preventDefault();(e.getCoalescedEvents?e.getCoalescedEvents():[e]).forEach(c=>akt.p.push(nokta(c)));inkCiz();});
const bitir=e=>{if(akt){akt=null;yut=true;setTimeout(()=>yut=false,350);}};ink.addEventListener('pointerup',bitir);ink.addEventListener('pointercancel',bitir);
ink.addEventListener('touchstart',e=>{if(e.touches[0]&&e.touches[0].touchType==='stylus')e.preventDefault();},{passive:false});
sahne.addEventListener('click',e=>{if(yut||akt)return;ileri();});
document.querySelectorAll('#kalembar [data-r]').forEach(b=>b.onclick=e=>{e.stopPropagation();renk=b.dataset.r;silgi=false;document.querySelectorAll('#kalembar button').forEach(x=>x.classList.toggle('on',x===b||(x.id==='fare'&&fare)));});
document.getElementById('silgi').onclick=e=>{e.stopPropagation();silgi=!silgi;e.currentTarget.classList.toggle('on',silgi);};
document.getElementById('temizle').onclick=e=>{e.stopPropagation();CIZ[si]=[];inkCiz();};
document.getElementById('fare').onclick=e=>{e.stopPropagation();fare=!fare;e.currentTarget.classList.toggle('on',fare);};

document.getElementById('ileri').onclick=e=>{e.stopPropagation();ileri();};
document.getElementById('geri').onclick=e=>{e.stopPropagation();geri();};
document.getElementById('tam').onclick=e=>{e.stopPropagation();tamEkran();};
addEventListener('keydown',e=>{if(['ArrowRight',' ','PageDown','Enter'].includes(e.key)){e.preventDefault();ileri();}
  else if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();geri();}
  else if(e.key==='f'||e.key==='F')tamEkran(); else if(e.key==='Home')goster(0);});
addEventListener('resize',olcek);
olcek();
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{document.body.classList.add('olcum');S.forEach(sigdir);document.body.classList.remove('olcum');goster(0);});
setTimeout(()=>{const ip=document.getElementById('ipucu');ip.style.opacity=0;setTimeout(()=>ip.remove(),700);},5000);
