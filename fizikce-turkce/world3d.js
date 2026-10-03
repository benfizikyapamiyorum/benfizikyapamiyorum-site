/* Ortak 3B sahneler: dünya koordinatları, kamera, derinlik sıralaması ve yerel SVG. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.FizikceWorld3D=api;if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>api.init(document));}})(typeof window!=='undefined'?window:globalThis,()=>{
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const numberFormat=new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),num=(n,d=0)=>Number.isFinite(n)?n:d,fmt=n=>numberFormat.format(n);
const cameras=new Map(),initial={yaw:-.38,pitch:.38};
const types=['floating','submerged','pressure','friction','rope','energy','road','start','acceleration','speed','route','circular','peak','projectile','fall','terminal','ohm','circuit','wave','heat','flow','coulomb','flux','refraction','wall'];
function camera(c={}){return {yaw:clamp(num(c.yaw,initial.yaw),-.95,.95),pitch:clamp(num(c.pitch,initial.pitch),.08,1.12)};}
function projector(c={}){c=camera(c);const cy=Math.cos(c.yaw),sy=Math.sin(c.yaw),cp=Math.cos(c.pitch),sp=Math.sin(c.pitch);
 return p=>{const x=p[0]*cy-p[2]*sy,z=p[0]*sy+p[2]*cy,y=p[1]*cp-z*sp,depth=10-p[1]*sp-z*cp,scale=690/depth;return {x:300+x*scale,y:209-y*scale,depth,scale};};
}
function project(p,c={}){return projector(c)(p);}
// x: sahne birimi (1 cm = .09 birim); zaman: fiziksel saniye.
function waveHeight(x,wavelength=10,time=0){const lambda=x<0?1.8:clamp(num(wavelength,10),5,20)*.09;return .56+.2*Math.sin(2*Math.PI*(x/lambda-2*num(time)));}
function animateWave(container,time){const root=container.querySelector('[data-world3d="wave"]');if(!root)return;const p=JSON.parse(root.dataset.world3dParams);p.time=time;root.dataset.world3dParams=JSON.stringify(p);root.querySelector('.world3d-viewport').innerHTML=svg('wave',p,cameras.get(root.dataset.world3dKey)||initial,root.dataset.world3dLabel);}
// Sabit fiziksel sınırlar tüm hareketi kapsar: oynatmada kamera cismi izlemez.
function sceneFrame(type,cam={}){
 const boxes={
  floating:[-1.35,2.2,0,2.4,-1.35,1.35],submerged:[-1.35,2.2,0,2.4,-1.35,1.35],pressure:[-1.35,1.35,0,2,-1.35,1.35],
  road:[-3.12,3.12,0,1.15,-.62,.9],start:[-3.12,3.12,0,1.15,-.62,.9],acceleration:[-3.12,3.12,0,1.15,-.62,.9],speed:[-3.12,3.12,0,1.15,-.62,.9],route:[-3.12,3.12,0,1.15,-.62,.9],
  friction:[-1.6,2.5,0,1.15,-.45,.55],energy:[-1.6,2.5,0,1.15,-.45,.55],rope:[-1.6,2.7,0,1.15,-.45,.55],wall:[-1.15,1.53,0,2.25,-.6,.6],
  peak:[-.5,.5,-.43,3.23,-.22,.22],terminal:[-.5,.5,-.43,3.23,-.22,.22],projectile:[-2.65,2.9,-.43,3.23,-.22,.3],fall:[-1.3,1.45,0,2.83,-.3,.3],
  circular:[-1.92,1.92,0,.38,-1.92,1.92],ohm:[-2.85,2.65,0,1.65,-1.4,1.35],circuit:[-2.85,2.65,0,1.65,-1.4,1.35],heat:[-1.95,2.15,-.03,2.05,-.7,.7],
  refraction:[-2,1.8,0,2.9,-.7,.7],flow:[-2.5,2.5,.36,1.64,-.64,.64],coulomb:[-2.4,2.4,.2,1.23,-.28,.28],flux:[-2.5,2.5,.1,2.3,-.9,.9]
 };
 const projectPoint=projector(cam),bounds=[];
 if(type==='wave'){
  for(const x of [-2.5,2.5])for(const y of [.36,.76])for(const z of [-1,1])bounds.push(projectPoint([x,y,z]));
  for(const v of [[-1.4,1.2,-1.3],[1.4,1.2,-1.3],[-.9,1.25,0],[.9,1.25,0],[0,.9,-1.2],[0,.9,1.2]])bounds.push(projectPoint(v));
 }else{
  const b=boxes[type];if(!b)throw new RangeError('Kadrajı eksik sahne: '+type);
  for(const x of b.slice(0,2))for(const y of b.slice(2,4))for(const z of b.slice(4,6))bounds.push(projectPoint([x,y,z]));
 }
 const left=Math.min(...bounds.map(v=>v.x))-35,right=Math.max(...bounds.map(v=>v.x))+35,top=Math.min(...bounds.map(v=>v.y))-30,bottom=Math.max(...bounds.map(v=>v.y))+24;
 return [left,top,right-left,bottom-top].map(n=>Number(n.toFixed(2)));
}
function svg(type,p={},cam={},label='Üç boyutlu fizik deneyi'){
 const faces=[],over=[],floor=[],q=projector(cam),attrs=s=>s||'';
 const poly=(ps,fill,stroke='#203f3a22',extra='')=>{const pts=ps.map(q);faces.push({d:pts.reduce((a,v)=>a+v.depth,0)/pts.length,s:`<polygon points="${pts.map(v=>`${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width=".7" ${attrs(extra)}/>`});};
 const path=(ps,color='#236b63',width=3,dash='',extra='',layer=over)=>{const pts=ps.map(q);layer.push(`<path d="${pts.map((v,i)=>`${i?'L':'M'}${v.x.toFixed(2)} ${v.y.toFixed(2)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${dash?`stroke-dasharray="${dash}"`:''} ${extra}/>`);};
 const tag=(v,t,color='#173f39')=>{const a=q(v);over.push(`<text x="${a.x.toFixed(2)}" y="${a.y.toFixed(2)}" text-anchor="middle" fill="${color}" class="world3d-label">${esc(t)}</text>`);};
 const arrow=(a,b,color='#267369',target='')=>{const x=q(a),y=q(b),ang=Math.atan2(y.y-x.y,y.x-x.x),r=8;if(Math.hypot(y.x-x.x,y.y-x.y)<1)return;over.push(`<g ${target?`data-concept-target="${target}"`:''}><path d="M${x.x} ${x.y}L${y.x} ${y.y}" stroke="${color}" stroke-width="3"/><path d="M${y.x} ${y.y}L${y.x-r*Math.cos(ang-.5)} ${y.y-r*Math.sin(ang-.5)}L${y.x-r*Math.cos(ang+.5)} ${y.y-r*Math.sin(ang+.5)}Z" fill="${color}"/></g>`);};
 const box=(x,y,z,w,h,d,palette=['#e5b261','#b9843b','#f5d998'],opacity=1)=>{const a=[x,y,z],b=[x+w,y,z],c=[x+w,y,z+d],e=[x,y,z+d],A=[x,y+h,z],B=[x+w,y+h,z],C=[x+w,y+h,z+d],E=[x,y+h,z+d],at=`opacity="${opacity}"`;poly([a,b,B,A],palette[0],undefined,at);poly([b,c,C,B],palette[1],undefined,at);poly([c,e,E,C],palette[0],undefined,at);poly([e,a,A,E],palette[1],undefined,at);poly([A,B,C,E],palette[2],undefined,at);};
 const sphere=(v,r,color='#dc9642',labelText='')=>{const a=q(v),R=r*a.scale;faces.push({d:a.depth,s:`<circle cx="${a.x}" cy="${a.y}" r="${R}" fill="${color}" stroke="#5b4b3122"/><ellipse cx="${a.x-R*.25}" cy="${a.y-R*.32}" rx="${R*.35}" ry="${R*.23}" fill="#ffffff77"/><path d="M${a.x-R*.8} ${a.y+R*.2}Q${a.x} ${a.y+R*1.2} ${a.x+R*.84} ${a.y+R*.05}" stroke="#413c3e33" stroke-width="${R*.13}" fill="none"/>`});if(labelText)tag([v[0],v[1]+r+.15,v[2]],labelText);};
 const ring=(x,y,z,r,n=28)=>Array.from({length:n},(_,i)=>[x+r*Math.cos(i*2*Math.PI/n),y,z+r*Math.sin(i*2*Math.PI/n)]);
 const cylinder=(x,y,z,r,h,water=false)=>{const a=ring(x,y,z,r),b=ring(x,y+h,z,r);for(let i=0;i<a.length;i++){const k=(i+1)%a.length,l=.5+.5*Math.cos(i/a.length*2*Math.PI);poly([a[i],a[k],b[k],b[i]],water?`rgba(56,${Math.round(148+l*40)},194,.32)`:`rgb(${Math.round(94+l*53)},${Math.round(128+l*56)},${Math.round(126+l*45)})`,'none');}poly(b,water?'#87d3ddaa':'#dae4cf','#5a9397', 'stroke-width="1.2"');};
 const glass=(x,y,z,r,h,waterHeight)=>{cylinder(x,y+.015,z,r*.97,waterHeight,true);const a=ring(x,y,z,r),b=ring(x,y+h,z,r);poly(a,'#c4dedb22','#789b9b');poly(b,'#e1f4f122','#82a8aa');for(const side of [-1,1])path([[x+side*r,y,z],[x+side*r,y+h,z]],'#82a8aa88',1);};
 const ground=()=>{const ps=[[-3,-.07,-1.7],[3,-.07,-1.7],[3,-.07,1.7],[-3,-.07,1.7]];floor.push(`<polygon points="${ps.map(v=>{const a=q(v);return `${a.x},${a.y}`;}).join(' ')}" fill="#e4ece1"/>`);for(let x=-3;x<=3;x+=.5)path([[x,-.06,-1.7],[x,-.06,1.7]],'#c7d7cd',.7,'','',floor);for(let z=-1.5;z<=1.5;z+=.5)path([[-3,-.06,z],[3,-.06,z]],'#c7d7cd',.7,'','',floor);};
 const car=(x,dir=1)=>{box(x-.48,.2,-.3,.96,.35,.6,['#dfa44c','#a86a35','#f4cd79']);box(x-.23,.55,-.25,.52,.27,.5,['#426c70','#335256','#badce0']);box(x+dir*.32,.47,-.3,.12,.07,.6,['#fbebaf','#ecd98f','#fff8d3']);for(const dx of [-.28,.28])for(const z of [-.34,.34])sphere([x+dx,.19,z],.14,'#36474b');};
 // Insulated leads and ceramic-mounted resistance wire share the same 3D circuit.
 const wire=(ps,color='#d85e4e')=>{path(ps,'#1f303d',7);path(ps,color,4.5);};
 const terminal=(x,y,z,color)=>{cylinder(x,y-.07,z,.085,.14);sphere([x,y+.08,z],.065,color);};
 const coil=(x,z,length=1.3,heat=0)=>{
   box(x-length/2-.08,.08,z-.29,length+.16,.14,.58,['#263e4b','#1b2f3b','#47606b']);
   box(x-length/2+.06,.22,z-.21,length-.12,.16,.42,['#dedac9','#bab5a5','#f7f0da']);
   for(const end of [-1,1]){box(x+end*length*.43-.05,.3,z-.16,.1,.26,.32,['#a0b0b4','#667d88','#e0e8e5']);terminal(x+end*length/2,.4,z,'#b7c7c8');}
   const ps=Array.from({length:121},(_,i)=>{const u=i/120;return [x-length*.4+u*length*.8,.56+.13*Math.cos(u*16*Math.PI),z+.17*Math.sin(u*16*Math.PI)];});
   path([[x-length/2,.4,z],ps[0]],'#94a6ab',3);path([ps[ps.length-1],[x+length/2,.4,z]],'#94a6ab',3);
   // Distinct power stages: subdued at 6 W, red at 13.5 W, vivid red at 24 W.
   const stops=[[0,[106,120,115]],[.25,[135,105,99]],[.5625,[216,77,61]],[1,[255,27,32]]];
   const upper=stops.findIndex(([h])=>h>=heat),hi=Math.max(1,upper),[h0,c0]=stops[hi-1],[h1,c1]=stops[hi],t=clamp((heat-h0)/(h1-h0),0,1),color=c0.map((v,i)=>Math.round(v+(c1[i]-v)*t));
   if(heat>.15)path(ps,`rgba(255,65,35,${heat*.3})`,11);
   path(ps,`rgb(${color.join(',')})`,3.5,'',`data-concept-wire data-power="${num(p.power)}"`);
 };
 // Readable instrument faces are anchored to their physical housings.
 const display=(v,value,caption)=>{const a=q(v);over.push(`<g transform="translate(${a.x},${a.y})" data-circuit-display="${esc(caption)}"><rect x="-36" y="-25" width="72" height="45" rx="7" fill="#142b36" stroke="#6b8390"/><rect x="-30" y="-20" width="60" height="25" rx="3" fill="#d9eed6"/><text x="0" y="-2" text-anchor="middle" fill="#244936" font-family="monospace" font-size="17" font-weight="700">${esc(value)}</text><text x="0" y="15" text-anchor="middle" fill="#e4eded" font-size="8" letter-spacing="1">${esc(caption)}</text></g>`);};

 ground();
 if(['floating','submerged','pressure'].includes(type)){
   const fraction=clamp(num(p.fraction,type==='submerged'?.7:.6),.05,.96);
   glass(0,0,0,1.35,2,1.45);
   if(type==='pressure'){sphere([-.65,.65,.25],.08,'#e7a045','K');sphere([.65,.65,.25],.08,'#e7a045','L');path([[-.65,1.45,.25],[-.65,.65,.25],[.65,.65,.25],[.65,1.45,.25]],'#a97231',2,'4 4');}
   else {if(p.boat){box(-.7,1.45-fraction*.5,-.6,1.4,.5,1.2);box(-.2,1.95-fraction*.5,-.2,.4,.3,.4,['#bf7660','#914f3b','#e1a07a']);}else box(-.48,1.45-fraction*.9,-.48,.96,.9,.96);arrow([1.65,1.2,.1],[1.65,2.15,.1],'#267369','buoyancy');arrow([2.2,1.2,.1],[2.2,.25,.1],'#ca6441','weight');}
 }else if(['road','start','acceleration','speed','route'].includes(type)){
   box(-2.9,0,-.62,5.8,.06,1.24,['#c5d0cb','#9eaea5','#cbd4ce']);path([[-2.8,.07,0],[2.8,.07,0]],'#fffdf3',2,'9 7');const pos=clamp(num(p.position),0,1),x=-2.15+4.3*pos,dir=num(p.velocity,1)<0?-1:1;car(x,dir);if(num(p.velocity,1)!==0)arrow([x,1.15,0],[x+dir*(.35+Math.min(Math.abs(num(p.velocity,1)),8)*.075),1.15,0]);if(p.acceleration)arrow([x,.95,.45],[x+Math.sign(p.acceleration)*.65,.95,.45],'#ca6441');
   tag([-2.5,.2,.9],'−');tag([2.5,.2,.9],'+');
 }else if(['friction','rope','energy','wall'].includes(type)){
   const x=clamp(num(p.offset),0,1)*2-1,force=num(p.force,3),friction=num(p.friction,3);
   if(type==='wall'){box(1.25,0,-.6,.28,2.25,1.2,['#b8c5b7','#829788','#d4dfcc']);sphere([-.65,1.65,0],.2);box(-.84,.5,-.15,.37,.87,.3,['#496e6b','#355650','#80968a']);path([[-.75,1.1,0],[.1,1.1,0],[1.25,1.1,0]],'#486967',7);path([[-.75,.6,0],[-1.15,0,.25]],'#486967',7);path([[-.75,.6,0],[-.35,0,-.25]],'#486967',7);if(force>0)arrow([-.2,1.8,0],[-.2+force/60,1.8,0],'#ca6441');}
   else{box(x,0,-.45,.85,.85,.9);if(force>0)arrow([x+.45,1.15,0],[x+.45+force/12,1.15,0],'#267369','push');if(friction>0)arrow([x+.4,.5,.55],[x+.4-friction/12,.5,.55],'#ca6441','friction');if(type==='rope'){box(1,0,-.45,.85,.85,.9);path([[x+.85,.45,0],[1,.45,0]],'#986c44',3);arrow([1.85,1.1,0],[2.7,1.1,0]);}}
 }else if(['peak','projectile','fall','terminal'].includes(type)){
   const height=clamp(num(p.height,1),0,1)*2.15+.22,x=type==='projectile'?-2.25+4.5*num(p.progress,.5):0;
   if(type==='projectile')path(Array.from({length:45},(_,i)=>{const u=i/44;return [-2.25+4.5*u,.22+8.6*u*(1-u),0];}),'#91a99c',1.4,'4 5');else path([[x,.2,0],[x,2.8,0]],'#91a99c',1.4,'4 5');
   if(type==='fall'){for(const [xx,r,l] of [[-1,.2,'1 kg'],[1,.3,'3 kg']]){sphere([xx,height,0],r,'#dda044',l);arrow([xx+.45,height,0],[xx+.45,height-.75,0],'#ca6441');}}
   else {sphere([x,height,0],.22);arrow([x+.42,height,0],[x+.42,height-.65,0],'#ca6441');if(p.velocity)arrow([x-.4,height,0],[x-.4,height+clamp(p.velocity/10,-.85,.85),0]);if(type==='projectile')arrow([x,height,.3],[x+.65,height,.3]);if(type==='terminal')arrow([x-.4,height,0],[x-.4,height+(p.terminal?.65:.39),0]);}
 }else if(type==='circular'){
   const a=num(p.angle),r=1.7,v=[r*Math.cos(a),.2,r*Math.sin(a)];path(Array.from({length:65},(_,i)=>[r*Math.cos(i*Math.PI/32),.02,r*Math.sin(i*Math.PI/32)]),'#829e92',2,'5 5');sphere(v,.18);sphere([0,.05,0],.045,'#46675c');arrow(v,[v[0]-.75*Math.sin(a),v[1],v[2]+.75*Math.cos(a)]);arrow(v,[v[0]*.5,v[1],v[2]*.5],'#ca6441');
 }else if(['ohm','circuit'].includes(type)){
   const parallel=p.parallel!==false,voltage=num(p.voltage,12),heat=clamp(num(p.power)/24,0,1);
   const resistance=type==='ohm'?6:parallel?2:8,current=voltage/resistance;
   // Separate sockets on the right face: no lead crosses the source or the other lead.
   box(-2.85,0,-.92,1,.7,1.84,['#324d60','#203746','#65818c']);
   box(-2.76,.7,-.83,.82,.08,1.66,['#afbdc3','#7e969e','#dce4df']);
   const positive=[-1.85,.4,-.7],negative=[-1.85,.4,.7];
   terminal(...positive,'#e66651');terminal(...negative,'#253846');
   display([-2.48,1.03,0],`${fmt(voltage)} V`,'GÜÇ KAYNAĞI');
   wire([positive,[-1.5,.4,-.7],[-1.5,.4,-1]]);
   wire([[1.5,.4,-1],[2.18,.4,-1.25],[2.18,.4,-.48]]);
   box(1.7,0,-.48,.96,.68,.96,['#d9ae55','#a17935','#f1ce7e']);
   terminal(2.18,.4,-.48,'#df6651');terminal(2.18,.4,.48,'#253846');
   display([2.18,.94,0],`${fmt(current)} A`,'AMPERMETRE');
   wire([[2.18,.4,.48],[2.18,.4,1.2],[-1.5,.4,1.2],[-1.5,.4,.7],negative],'#334652');
   for(const [point,sign,color] of [[positive,'+','#be493b'],[negative,'−','#334652']]){const a=q(point);over.push(`<g data-circuit-pole="${sign}"><circle cx="${a.x}" cy="${a.y}" r="10" fill="${color}" stroke="#fffdf5" stroke-width="2"/><text x="${a.x}" y="${a.y+5}" text-anchor="middle" fill="white" font-size="17" font-weight="700">${sign}</text></g>`);}
   if(type==='circuit'){
     if(parallel){wire([[-1.5,.4,-1],[-.625,.4,-1]]);wire([[.625,.4,-1],[1.5,.4,-1]]);wire([[-1.5,.4,-1],[-1.5,.4,0],[-.625,.4,0]]);wire([[.625,.4,0],[1.5,.4,0],[1.5,.4,-1]]);coil(0,0,1.25);coil(0,-1,1.25);}
     else{wire([[-1.5,.4,-1],[-1.275,.4,-1]]);wire([[-.225,.4,-1],[.225,.4,-1]]);wire([[1.275,.4,-1],[1.5,.4,-1]]);coil(-.75,-1,1.05);coil(.75,-1,1.05);}
     tag([0,1.4,-1.15],'4 Ω + 4 Ω');
   }else{wire([[-1.5,.4,-1],[-.925,.4,-1]]);wire([[.925,.4,-1],[1.5,.4,-1]]);coil(0,-1,1.85,heat);tag([0,1.4,-1.15],'DİRENÇ TELİ · 6 Ω');}
   arrow([-1.45,.44,-1],[-1.02,.44,-1],'#ffc965','current-out');
   arrow([1,.44,-1],[1.48,.44,-1],'#ffc965','current-through');
   if(type==='circuit'&&parallel)arrow([.7,.44,0],[1.22,.44,0],'#ffc965','current-branch');
   arrow([.65,.44,1.2],[-.15,.44,1.2],'#ffc965','current-return');tag([.25,.12,1.35],'I · eksi kutba dönüş','#465c67');

 }else if(type==='wave'){
   const lambda=clamp(num(p.wavelength,10),5,20),time=num(p.time),h=x=>waveHeight(x,lambda,time);
   // Düz enine şeritler; faz değişirken dalga tepeleri sağa ilerler.
   for(let i=0;i<80;i++){const x=-2.5+i/16,end=x+1/16;poly([[x,h(x),-1],[end,h(end),-1],[end,h(end),1],[x,h(x),1]],x<0?'#82c8d4cc':'#add0a9dd','none');}
   for(const [lo,hi,length,color] of [[-2.5,0,1.8,'#2c7b8a'],[0,2.5,lambda*.09,'#697f3d']]){
     for(let n=Math.ceil(lo/length-2*time-.25);n<=Math.floor(hi/length-2*time-.25);n++){const x=(n+2*time+.25)*length;path([[x,h(x)+.015,-1],[x,h(x)+.015,1]],color,2);}
   }
   path([[0,.9,-1.2],[0,.9,1.2]],'#567562',1.5,'4 5');arrow([-.9,1.25,0],[.9,1.25,0]);tag([-1.4,1.2,-1.3],'1. ortam');tag([1.4,1.2,-1.3],'2. ortam');
 }else if(type==='heat'){
   const m=num(p.mass,200),temps=[num(p.small,40),num(p.large,30)];for(const [i,x] of [[0,-1.25],[1,1.25]]){glass(x,0,0,.65,1.8,1.45*(i?m:100)/400);box(x-.7,-.03,-.7,1.4,.13,1.4,['#dd9760','#aa6245','#e9b06e']);const t=temps[i],xx=x+.8;path([[xx,.2,0],[xx,1.7,0]],'#d3ded1',9);path([[xx,.2,0],[xx,.25+clamp((t-20)/20,0,1)*1.35,0]],'#d46b49',4);sphere([xx,.2,0],.095,'#d46b49');tag([x,2.05,0],`${fmt(t)} °C`);}
 }else if(type==='refraction'){
   const i=num(p.i,Math.PI/6),r=num(p.r,Math.asin(Math.sin(i)/1.5));box(-1.8,0,-.7,3.6,1.25,1.4,['#b7dce1','#83b8c2','#d1eff0'],.56);path([[0,.1,0],[0,2.9,0]],'#81988d',1.5,'5 5','data-concept-target="normal"');const a=[-1.1*Math.sin(i),1.25+1.1*Math.cos(i),0],b=[0,1.25,0],d=[1.1*Math.sin(r),1.25-1.1*Math.cos(r),0];arrow(a,b,'#277168','incident');arrow(b,d,'#cc6842','refracted');if(p.photon){const f=p.photon,s=f.glass?b:a,e=f.glass?d:b;const u=f.fraction;sphere(s.map((v,j)=>v+(e[j]-v)*u),.07,'#f3bd43');}tag([-2,2.5,0],'Hava');tag([-2,.8,0],p.medium||'Cam');
 }else if(type==='flow'){
   const narrow=p.narrow!==false,r2=narrow?.64/Math.sqrt(2):.64,rs=[[-2.5,.64],[-.4,.64],[.45,r2],[2.5,r2]],rings=rs.map(([x,r])=>Array.from({length:32},(_,i)=>[x,1+r*Math.cos(i*Math.PI/16),r*Math.sin(i*Math.PI/16)]));for(let j=0;j<3;j++)for(let i=0;i<32;i++){const k=(i+1)%32;poly([rings[j][i],rings[j+1][i],rings[j+1][k],rings[j][k]],'#88c8d277','none');}for(const ring of rings)path([...ring,ring[0]],'#709b9e',1.2);arrow([-2,1,0],[-1,1,0]);arrow([.65,1,0],[narrow?2.35:1.65,1,0]);
 }else if(type==='coulomb'){
   const d=clamp(num(p.distance,1),1,3),len=.8/(d*d);sphere([-d*.65,.8,0],.28,'#dab365','+q₁');sphere([d*.65,.8,0],.28,'#dab365','+q₂');arrow([-d*.65-.35,.8,0],[-d*.65-.35-len,.8,0],'#cc6842');arrow([d*.65+.35,.8,0],[d*.65+.35+len,.8,0],'#cc6842');path([[-d*.65,.2,0],[d*.65,.2,0]],'#839d8f',1,'4 4');
 }else if(type==='flux'){
   for(const z of [-.8,0,.8])arrow([-2.5,1,z],[2.5,1,z]);if(p.parallel){poly([[-1,1,-.9],[1,1,-.9],[1,1,.9],[-1,1,.9]],'#e7bb6488','#b78035');arrow([0,1,0],[0,2.3,0],'#cc6842');}else{poly([[0,.1,-.9],[0,2,-.9],[0,2,.9],[0,.1,.9]],'#e7bb6488','#b78035');arrow([0,1,0],[1.4,1,0],'#cc6842');}}
 const viewBox=sceneFrame(type,cam).join(' ');
 faces.sort((a,b)=>b.d-a.d);
 return `<svg data-world3d-svg viewBox="${viewBox}" role="img" aria-label="${esc(label)}"><g data-world3d-floor>${floor.join('')}</g><g data-world3d-content>${faces.map(f=>f.s).join('')}${over.join('')}</g></svg>`;
}
function markup(type,params={},key=type,label='Üç boyutlu fizik deneyi',chips=[]){if(!types.includes(type))throw new RangeError('Bilinmeyen 3B sahne: '+type);const cam=cameras.get(key)||initial;return `<div class="world3d" data-world3d="${esc(type)}" data-world3d-key="${esc(key)}" data-world3d-params="${esc(JSON.stringify(params))}" data-world3d-label="${esc(label)}"><div class="world3d-top"><span>3B · DOKUN & KEŞFET</span><span>Elinle döndür ↔</span></div><div class="world3d-viewport" tabindex="0" role="group" aria-label="3B kamera: yatay sürükle veya klavyede ok tuşlarını kullan">${svg(type,params,cam,label)}</div><div class="world3d-toolbar" role="group" aria-label="3B bakış açısı"><button type="button" data-world3d-camera="left" aria-label="3B sahneyi sola döndür">↶ Sola</button><button type="button" data-world3d-camera="reset">İlk açı</button><button type="button" data-world3d-camera="top" aria-pressed="${cam.pitch>.9}">Üstten bak</button><button type="button" data-world3d-camera="right" aria-label="3B sahneyi sağa döndür">Sağa ↷</button></div>${['ohm','circuit'].includes(type)?`<div class="circuit-direction"><strong>Elektrik akımının yönü · dış devrede + → −</strong><span><b class="pole-positive">+ çıkış</b> → ${type==='ohm'?'Direnç':'Dirençler'} → Ampermetre → <b class="pole-negative">− dönüş</b></span></div><aside class="circuit-explanation"><strong>Not · Akım yönü ile elektronların hareketi</strong><p>Bu kapalı doğru akım devresinde sarı oklar, elektrik akımının kabul edilen yönünü gösterir: güç kaynağının <b>+ kutbundan</b> çıkar, dış devreyi izleyerek <b>− kutbuna</b> ulaşır. Dönüş kablosundaki ok da aynı yolu tamamlar.</p><p>Metal tellerde serbest elektronların net sürüklenme yönü bunun tersidir: <b>− kutuptan + kutba</b>. Dolayısıyla oklar elektronların hareketini göstermiyor. Kırmızı ve koyu kablo renkleri bağlantıları ayırt etmek içindir; her iki metal telde de hareketli yük taşıyıcıları elektronlardır.</p><a href="https://ogm-large-cdn.eba.gov.tr/materyal/Etkilesimlikitap/66098271-92a3-48d4-9320-2033cbd3c94e/pdf.pdf#page=178" target="_blank" rel="noopener noreferrer">MEB Fizik 10 · Elektrik · s. 177, Şekil 3.4 ↗</a></aside>`:''}${chips.length?`<div class="world3d-readings">${chips.map(([target,text])=>`<span ${target?`data-concept-target="${target}"`:''}>${esc(text)}</span>`).join('')}</div>`:''}<p class="world3d-note">Sürüklemek bakış açısını değiştirir. Nicelikleri alttaki deney kontrolleriyle değiştir. Boyutlar ve oklar temsili; değerleri etiketlerden oku.</p></div>`;}
function concept(type,m,state={}){
 const chips=[],add=(k,t)=>chips.push([k,t]);let p={};
 if(type==='floating'){p.fraction=m.fraction;add('weight','G ↓ 0,6 N');add('buoyancy','Fₖ ↑ 0,6 N');}
 if(type==='friction'){p={force:m.force,friction:m.friction,offset:num(state.distance)/14};add('push',`İtme → ${fmt(m.force)} N`);add('friction',`Sürtünme ← ${fmt(m.friction)} N`);}
 if(type==='ohm'){p={voltage:m.value,power:m.power};add('resistor','R = 6 Ω');add('voltage',`V = ${fmt(m.value)} V`);add('current',`I = ${fmt(m.current)} A`);add('heating',`P = ${fmt(m.power)} W · kızarma temsili`);}
 if(type==='wave'){p.wavelength=m.wavelength;p.time=num(state.waveTime);add('frequency','f = 2 Hz');add('speed',`v₂ = ${fmt(m.value)} cm/s`);add('wavelength',`λ₂ = ${fmt(m.wavelength)} cm`);}
 if(type==='heat'){p={mass:m.value,small:40,large:m.temperature};add('energy','Her kaba Q = 8400 J');add('temperature',`T₂ = ${fmt(m.temperature)} °C`);}
 if(type==='refraction'){p={i:m.i,r:m.r};if(Number.isFinite(state.demoProgress)){const t=2.5*state.demoProgress;p.photon={glass:t>1,fraction:t>1?(t-1)/1.5:t};}add('normal','Normal: yüzeye dik');add('incident',`i = ${fmt(m.value)}°`);add('refracted',`r = ${fmt(m.degrees)}°`);}
 let result=markup(type,p,'concept-'+type,m.result+' '+m.insight,chips);
 if(type==='refraction'){
  const a=[180-100*Math.sin(m.i),130-100*Math.cos(m.i)],b=[180+100*Math.sin(m.r),130+100*Math.cos(m.r)];
  result+=`<details class="world3d-schematic"><summary>Açıları perspektifsiz 2B şemada gör</summary><svg viewBox="0 0 360 260" role="img" aria-label="Yüzey normaline göre i ${fmt(m.value)} derece, r ${fmt(m.degrees)} derece"><rect x="15" y="130" width="330" height="118" fill="#c9e1e6"/><path d="M15 130H345M180 15V245" fill="none" stroke="#809e93" stroke-dasharray="4 4"/><path d="M${a[0]} ${a[1]}L180 130" fill="none" stroke="#267369" stroke-width="3"/><path d="M180 130L${b[0]} ${b[1]}" fill="none" stroke="#ca6441" stroke-width="3"/><text x="200" y="35" font-size="16">i = ${fmt(m.value)}°</text><text x="35" y="210" font-size="16">r = ${fmt(m.degrees)}°</text><text x="190" y="110" font-size="14">Normal</text></svg><p>3B görünümde açılar bakışa göre farklı görünür. Açıyı bu düzlemde, yüzeye dik kesikli çizgiden ölç.</p></details>`;
 }
 return result;
}
function detective(id,m,p){const defs={
'yogun-sivi':['floating',{fraction:m.volume/100}], 'termometre-duellosu':['heat',{small:m.small,large:m.large,mass:200}],
'geri-donus':['road',{position:m.position/4,velocity:p<=.5?1:-1}], 'eksi-ivme':['road',{position:1+m.position/6,velocity:m.velocity,acceleration:m.acceleration}],
'ohm-dedikodusu':['ohm',{voltage:m.voltage,power:m.voltage*m.current}], 'dalga-panik':['wave',{wavelength:m.wavelength}],
'duvar-mesaisi':['wall',{force:m.force}], 'surtunme-pazarligi':['friction',{force:m.push,friction:m.friction}],
'zirve-sifiri':['peak',{height:m.height/5,velocity:m.velocity}], 'viraj-sirri':['circular',{angle:m.angle}],
'isigin-pasaportu':['refraction',{i:0,r:0,photon:{glass:2.5*p>1,fraction:2.5*p>1?(2.5*p-1)/1.5:2.5*p}}]};return defs[id];}
function diagram(type,state={}){
 const mode=state.mode,phase=mode||'peak',u=phase==='up'?.25:phase==='down'?.75:.5;
 switch(type){
 case 'acceleration':return ['road',{position:.5,velocity:mode==='east'?6:-6,acceleration:-2}];
 case 'speed':case 'circular':return (mode||(type==='circular'?'circle':'straight'))==='circle'?['circular',{angle:.5}]:['road',{position:.5,velocity:3}];
 case 'route':return ['road',{position:0,velocity:-1}];case 'start':return ['road',{position:.15,velocity:0}];
 case 'submerged':return ['submerged',{fraction:.7}];case 'pressure':return ['pressure',{}];
 case 'flow':return ['flow',{narrow:mode!=='wide'}];case 'circuit':return ['circuit',{parallel:mode!=='series',voltage:12}];
 case 'fall':return ['fall',{height:.8}];case 'peak':return ['peak',{height:phase==='peak'?1:.55,velocity:phase==='peak'?0:phase==='up'?7:-7}];
 case 'projectile':return ['projectile',{progress:u,height:4*u*(1-u),velocity:10*(.5-u)}];
 case 'rope':return ['rope',{force:5,friction:0}];case 'energy':return ['energy',{force:8,friction:0}];
 case 'terminal':return ['terminal',{height:.75,terminal:mode==='terminal',velocity:0}];
 case 'coulomb':return ['coulomb',{distance:clamp(num(state.value,1),1,3)}];case 'flux':return ['flux',{parallel:mode==='parallel'}];
 default:return null;
 }}
// Oynatma sırasında kamera düğmeleri ve sürükleme yüzeyi DOM'da sabit kalır.
function update(container,html){
 const temp=document.createElement('div');temp.innerHTML=html;
 const old=container.querySelector('[data-world3d]'),next=temp.querySelector('[data-world3d]');
 if(!old||!next||old.dataset.world3dKey!==next.dataset.world3dKey){container.replaceChildren(...temp.childNodes);return;}
 old.dataset.world3dParams=next.dataset.world3dParams;old.dataset.world3dLabel=next.dataset.world3dLabel;
 old.querySelector('.world3d-viewport').replaceChildren(...next.querySelector('.world3d-viewport').childNodes);
 const readings=old.querySelector('.world3d-readings'),newReadings=next.querySelector('.world3d-readings');
 if(readings&&newReadings)readings.replaceChildren(...newReadings.childNodes);
 for(const selector of ['.detective-metrics','figcaption','.world3d-schematic']){const a=container.querySelector(selector),b=temp.querySelector(selector);if(a&&b)a.replaceChildren(...b.childNodes);}
}
function init(doc){let drag=null,frame=0;const pending=new Map();
 // Giriş olayları yalnız son kamerayı kaydeder; görünüm kare başına bir kez çizilir.
 function draw(root,c){c=camera(c);cameras.set(root.dataset.world3dKey,c);pending.set(root,c);if(frame)return;
  frame=requestAnimationFrame(()=>{frame=0;for(const [root,c] of pending){if(!root.isConnected||doc.hidden||root.closest('dialog:not([open])'))continue;
   const viewport=root.querySelector('.world3d-viewport');viewport.innerHTML=svg(root.dataset.world3d,JSON.parse(root.dataset.world3dParams),c,root.dataset.world3dLabel);
   root.querySelector('[data-world3d-camera="top"]').setAttribute('aria-pressed',String(c.pitch>.9));
  }pending.clear();});
 }
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden){cancelAnimationFrame(frame);frame=0;pending.clear();drag=null;}});
 function interact(root){root.dispatchEvent(new CustomEvent('world3dinteract',{bubbles:true}));}
 function move(root,action){interact(root);const c=cameras.get(root.dataset.world3dKey)||initial;draw(root,action==='reset'?initial:action==='top'?{...c,pitch:c.pitch>.9?initial.pitch:1.06}:{...c,yaw:c.yaw+(action==='left'?-.2:.2)});}
 doc.addEventListener('click',e=>{const b=e.target.closest('[data-world3d-camera]');if(b)move(b.closest('[data-world3d]'),b.dataset.world3dCamera);});
 doc.addEventListener('keydown',e=>{const v=e.target.closest('.world3d-viewport');if(!v)return;const root=v.closest('[data-world3d]'),c=cameras.get(root.dataset.world3dKey)||initial;if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();move(root,e.key==='Home'?'reset':e.key==='ArrowLeft'?'left':'right');}else if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();interact(root);draw(root,{...c,pitch:c.pitch+(e.key==='ArrowUp'?.12:-.12)});}});
 doc.addEventListener('pointerdown',e=>{const v=e.target.closest('.world3d-viewport');if(!v||e.button!==0)return;interact(v);drag={root:v.closest('[data-world3d]'),v,x:e.clientX,y:e.clientY,touch:e.pointerType==='touch',active:false};});
 doc.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.root.isConnected){drag=null;return;}const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.active){if(Math.hypot(dx,dy)<5)return;if(drag.touch&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}drag.active=true;drag.v.setPointerCapture(e.pointerId);}const c=cameras.get(drag.root.dataset.world3dKey)||initial;draw(drag.root,{yaw:c.yaw+dx*.007,pitch:c.pitch+(drag.touch?0:dy*.005)});drag.x=e.clientX;drag.y=e.clientY;});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])doc.addEventListener(event,()=>{drag=null;});
}
return {types,camera,project,sceneFrame,waveHeight,animateWave,svg,markup,concept,detective,diagram,update,init};
});
