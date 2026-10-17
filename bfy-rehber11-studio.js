import * as THREE from './bfy-three.module.min.js';
import {projectile,flightDuration,wireFieldMicrotesla,lensImage} from './bfy-rehber11-physics.mjs?v=20261017-rehber1';
const gold=0xf4c65f, coral=0xf08060, teal=0x5dd6ce, cream=0xf0e5c9;
const fmt=(n,d=1)=>n.toLocaleString('tr-TR',{minimumFractionDigits:d,maximumFractionDigits:d});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const V=(x,y,z=0)=>new THREE.Vector3(x,y,z);
const mat=(color,metalness=.1,roughness=.45)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
function mesh(geometry,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function tube(points,color,r=.018,parent){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(12,points.length*2),r,8,false),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.3,roughness:.32}),parent);}
function line(points,color,parent,dashed=false){const m=dashed?new THREE.LineDashedMaterial({color,dashSize:.12,gapSize:.09,transparent:true,opacity:.8}):new THREE.LineBasicMaterial({color,transparent:true,opacity:.8});const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),m);if(dashed)l.computeLineDistances();parent.add(l);return l;}
function label(text,parent,x,y,z,width=1.3,color='#f8ead0',background=true){
 const c=document.createElement('canvas'),ctx=c.getContext('2d');
 let texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
 const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true}));
 sprite.position.set(x,y,z);sprite.renderOrder=5;
 const redraw=value=>{
  ctx.font='600 52px system-ui';const measured=ctx.measureText(value).width;
  c.width=Math.ceil(measured+48);c.height=88;
  if(background){ctx.fillStyle='rgba(15,37,40,.93)';ctx.beginPath();ctx.roundRect(2,2,c.width-4,84,14);ctx.fill();ctx.strokeStyle='rgba(215,194,143,.35)';ctx.lineWidth=2;ctx.stroke();}
  ctx.font='600 52px system-ui';ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(value,c.width/2,46);
  texture.dispose();texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;sprite.material.map=texture;sprite.material.needsUpdate=true;sprite.scale.set(width,width*88/c.width,1);
 };
 sprite.userData.redraw=redraw;redraw(text);parent.add(sprite);return sprite;
}
function board(parent,width=9,depth=4.5){
 const shape=new THREE.Shape(),w=width/2,d=depth/2,r=.22;
 shape.moveTo(-w+r,-d);shape.lineTo(w-r,-d);shape.quadraticCurveTo(w,-d,w,-d+r);shape.lineTo(w,d-r);shape.quadraticCurveTo(w,d,w-r,d);shape.lineTo(-w+r,d);shape.quadraticCurveTo(-w,d,-w,d-r);shape.lineTo(-w,-d+r);shape.quadraticCurveTo(-w,-d,-w+r,-d);
 const geo=new THREE.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.08,bevelThickness:.06,curveSegments:8});
 const m=mesh(geo,mat(0xbda87c,.2,.55),parent,0,-.33,0);m.rotation.x=-Math.PI/2;
 mesh(new THREE.BoxGeometry(width-.2,.08,depth-.2),mat(0x47514a,.5,.35),parent,0,-.36,0);
 const plane=mesh(new THREE.PlaneGeometry(60,60),mat(0x14343b,0,.85),parent,0,-.52,0);plane.rotation.x=-Math.PI/2;plane.castShadow=false;
 for(let x=-Math.floor(width/2);x<=Math.floor(width/2);x+=.5)line([V(x,-.015,-depth/2+.2),V(x,-.015,depth/2-.2)],0xaa986f,parent);
 for(let z=-Math.floor(depth/2);z<=Math.floor(depth/2);z+=.5)line([V(-width/2+.2,-.015,z),V(width/2-.2,-.015,z)],0xaa986f,parent);
}
function disposeGroup(group){group.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});group.clear();}
class Studio {
 constructor(root){
  this.root=root;this.viewport=root.querySelector('.st-viewport');this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x14343b);this.scene.fog=new THREE.Fog(0x14343b,21,48);
  this.camera=new THREE.PerspectiveCamera(36,1,.1,80);this.target=V(0,1,0);this.yaw=.3;this.elevation=.42;this.radius=13.5;this.visible=false;this.frame=0;this.last=0;
  this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power',alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.renderer.domElement.setAttribute('aria-hidden','true');this.viewport.prepend(this.renderer.domElement);
  this.scene.add(new THREE.HemisphereLight(0xeaf7ff,0x786949,2.4));const key=new THREE.DirectionalLight(0xffe5b4,3.3);key.position.set(-4,9,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-7,right:7,top:6,bottom:-6,near:.1,far:25});key.shadow.bias=-.001;this.scene.add(key);const fill=new THREE.DirectionalLight(0x81cddd,1.4);fill.position.set(6,4,-7);this.scene.add(fill);
  new ResizeObserver(()=>{const w=this.viewport.clientWidth,h=this.viewport.clientHeight;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.request();}).observe(this.viewport);
  root.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{this.setView(b.dataset.view);this.request();}));
  let drag=null;const c=this.renderer.domElement;
  c.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw:this.yaw,active:false};});
  c.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.active&&Math.abs(dy)>Math.abs(dx)+6){drag=null;return;}if(Math.abs(dx)>6){drag.active=true;c.setPointerCapture(e.pointerId);this.yaw=drag.yaw-dx*.006;this.elevation=.42;root.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view==='perspective')));this.request();}});
  ['pointerup','pointercancel','lostpointercapture'].forEach(name=>c.addEventListener(name,()=>{drag=null;}));
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.fail('3B görünüm şu an kullanılamıyor. Şematik çizim aşağıda; deney bağlantısını da açabilirsin.');});
  document.addEventListener('visibilitychange',()=>{this.last=0;if(!document.hidden)this.request();});
 }
 cameraUpdate(){const aspect=this.viewport.clientWidth/this.viewport.clientHeight;const radius=this.radius*(aspect<1.15?1.13:1);this.camera.position.set(this.target.x+radius*Math.sin(this.yaw)*Math.cos(this.elevation),this.target.y+radius*Math.sin(this.elevation),radius*Math.cos(this.yaw)*Math.cos(this.elevation));this.camera.lookAt(this.target);}
 setView(mode){const magnet=this.root.dataset.studio==='manyetizma';this.yaw=mode==='front'?0:.3;this.elevation=mode==='front'?(magnet?1.565:.045):.42;this.root.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));}
 request(){if(this.frame||!this.visible||document.hidden)return;this.frame=requestAnimationFrame(t=>{this.frame=0;const dt=this.last?Math.min((t-this.last)/1000,.05):0;this.last=t;const animate=this.update?.(dt);this.cameraUpdate();this.renderer.render(this.scene,this.camera);if(animate)this.request();else this.last=0;});}
 ready(){this.root.classList.add('st-ready');this.viewport.querySelector('.st-loading').hidden=true;new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.last=0;this.request();},{rootMargin:'100px'}).observe(this.viewport);}
 fail(message){this.root.classList.remove('st-ready');this.root.classList.add('st-unavailable');this.viewport.querySelector('.st-loading').textContent=message;this.viewport.querySelector('.st-loading').hidden=false;this.root.querySelectorAll('.st-controls button,.st-controls input,[data-view]').forEach(b=>b.disabled=true);}
}
function buildFlight(s){
 board(s.scene,9,4.2);s.target=V(0,1.25,0);s.radius=13.5;const scale=.2,start=-3.464;
 const bodies=[];
 for(const [angle,color,z] of [[30,coral,0],[60,gold,0]]){
  const duration=flightDuration(angle),pts=[];for(let i=0;i<=80;i++){const p=projectile(i/80*duration,angle);pts.push(V(start+p.x*scale,.13+p.y*scale,z));}
  tube(pts,color,.022,s.scene);const ball=mesh(new THREE.SphereGeometry(.15,32,24),mat(color,.65,.22),s.scene);const shadow=mesh(new THREE.CircleGeometry(.19,24),new THREE.MeshBasicMaterial({color:0x152d2e,transparent:true,opacity:.3,depthWrite:false}),s.scene);shadow.rotation.x=-Math.PI/2;
  bodies.push({ball,shadow,angle});label(`${angle}°`,s.scene,angle===30?-.5:.2,angle===30?1.5:3.55,.02,.75,angle===30?'#ffaf94':'#ffe08a');
 }
 // Distance scale and equal-range landing target.
 for(let n=0;n<=35;n+=5){const x=start+n*scale;line([V(x,.01,1.1),V(x,.01,1.3)],0x485553,s.scene);label(String(n),s.scene,x,.06,1.55,.47,'#334945',false);}
 const target=mesh(new THREE.RingGeometry(.25,.35,48),new THREE.MeshBasicMaterial({color:0xece1b6,side:THREE.DoubleSide}),s.scene,3.464,.018,0);target.rotation.x=-Math.PI/2;
 label('AYNI MENZİL',s.scene,3.32,.45,-.55,1.6);label('x / metre',s.scene,2.6,.1,1.95,1.1);
 mesh(new THREE.CylinderGeometry(.32,.4,.15,32),mat(0x263d3d,.6,.32),s.scene,start,.07,0);
 let time=0,playing=false,mode='';const play=s.root.querySelector('[data-action="play"]'),slider=s.root.querySelector('#flight-time'),note=s.root.querySelector('#flight-note'),end=flightDuration(60);
 function draw(){
  bodies.forEach(({ball,shadow,angle})=>{const p=projectile(time,angle);ball.position.set(start+p.x*scale,.16+p.y*scale,0);shadow.position.set(ball.position.x,.012,0);shadow.scale.setScalar(1+p.y*.035);shadow.material.opacity=.36/(1+p.y*.1);});
  slider.value=String(time);s.root.querySelector('#time-output').textContent=fmt(time,2)+' s';s.root.querySelector('[data-stage-time]').textContent=fmt(time,2)+' s';
  for(const a of [30,60])s.root.querySelector('#x'+a+'-output').innerHTML=fmt(projectile(time,a).x)+' <em>m</em>';
  const m=time<.01?'start':time<2?'flying':time<end-.01?'one':'both';
  if(m!==mode){mode=m;note.textContent={start:'Önce tahmin et: Hangi top yere daha erken ulaşır?',flying:'30° ile atılan top yatayda önde. 60° ile atılan daha yükseğe çıkıyor.',one:'30° ile atılan top yere ulaştı. 60° ile atılan top hâlâ havada.',both:'İki menzil de 34,6 m. Uçuş süreleri farklı: 2,00 s ve 3,46 s.'}[m];}
 }
 play.addEventListener('click',()=>{if(time>=end-.01)time=0;playing=!playing;play.textContent=playing?'Ⅱ Duraklat':time>0?'▶ Devam et':'▶ İki atışı başlat';s.last=0;s.request();});
 s.root.querySelector('[data-action="reset"]').addEventListener('click',()=>{time=0;playing=false;play.textContent='▶ İki atışı başlat';draw();s.request();});
 slider.addEventListener('input',()=>{time=Math.min(Number(slider.value),end);playing=false;play.textContent=time>=end-.01?'↺ Yeniden karşılaştır':'▶ Devam et';draw();s.request();});
 s.update=dt=>{if(playing){time=Math.min(time+dt,end);draw();if(time>=end){playing=false;play.textContent='↺ Yeniden karşılaştır';}}return playing;};draw();
}
function buildMagnet(s){
 board(s.scene,8.2,6.2);s.target=V(0,.8,0);s.radius=13.5;
 mesh(new THREE.CylinderGeometry(2.75,2.75,.07,80),mat(cream,.05,.8),s.scene,0,.055,0);
 mesh(new THREE.CylinderGeometry(.085,.085,4.4,32),mat(0xd99656,.8,.24),s.scene,0,1.85,0);
 mesh(new THREE.CylinderGeometry(.35,.43,.22,32),mat(0x384c4a,.65,.35),s.scene,0,.14,0);
 const fieldGroup=new THREE.Group();s.scene.add(fieldGroup);const arrows=[];const compasses=[];
 for(const r of [.85,1.35,2]){
  const pts=[];for(let k=0;k<=120;k++){const a=k/120*Math.PI*2;pts.push(V(r*Math.cos(a),.16,r*Math.sin(a)));}tube(pts,0x5eafa8,.014,fieldGroup);
  for(let n=0;n<3;n++){const a=n/3*Math.PI*2+.3;const p=V(r*Math.cos(a),.17,r*Math.sin(a));const arrow=new THREE.ArrowHelper(V(Math.sin(a),0,-Math.cos(a)),p,.35,teal,.13,.085);fieldGroup.add(arrow);arrows.push({arrow,a});}
 }
 for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
  const g=new THREE.Group();g.position.set(2*Math.cos(a),.18,2*Math.sin(a));s.scene.add(g);
  mesh(new THREE.CylinderGeometry(.43,.44,.1,48),mat(0x9e7f40,.8,.3),g);mesh(new THREE.CylinderGeometry(.36,.36,.02,48),mat(0xf9f0d8,0,.75),g,0,.062,0);
  const needle=new THREE.Group();needle.position.y=.09;g.add(needle);
  const north=mesh(new THREE.ConeGeometry(.09,.32,3),mat(coral,.25,.35),needle,.16,0,0);north.rotation.z=-Math.PI/2;north.rotation.x=Math.PI/2;
  const south=mesh(new THREE.ConeGeometry(.09,.32,3),mat(0x344e5a,.4,.35),needle,-.16,0,0);south.rotation.z=Math.PI/2;south.rotation.x=Math.PI/2;
  mesh(new THREE.SphereGeometry(.055,16,12),mat(0xb18e42,.8,.3),needle,0,.02,0);needle.rotation.y=Math.PI/2-a;compasses.push({needle,a,target:needle.rotation.y});
 }
 label('r = 10 cm',s.scene,2.45,.4,.85,1.3);label('N ucu: mercan',s.scene,0,.24,2.85,1.9,'#ffb69c');
 const currentArrow=new THREE.ArrowHelper(V(0,1,0),V(.28,2.2,0),1.05,gold,.3,.17);s.scene.add(currentArrow);
 const currentLabel=label('I = 10 A ↑',s.scene,.2,4.5,0,1.6);
 let current=10,dir=1;
 function change(){
  const b=wireFieldMicrotesla(current);s.root.querySelector('#field-output').innerHTML=fmt(b,0)+' <em>µT</em>';s.root.querySelector('[data-stage-field]').textContent=fmt(b,0)+' µT';s.root.querySelector('#current-direction').textContent=dir===1?'Yukarı ↑':'Aşağı ↓';
  s.root.querySelectorAll('[data-current]').forEach(btn=>btn.setAttribute('aria-pressed',String(Number(btn.dataset.current)===current)));
  s.root.querySelector('#magnet-note').textContent=`${current} A → ${fmt(b,0)} µT. ${dir===1?'Akım yukarı; alan yukarıdan bakıldığında saat yönünün tersinde.':'Akım aşağı; alan yukarıdan bakıldığında saat yönünde.'}`;
  currentArrow.setDirection(V(0,dir,0));currentArrow.position.y=dir===1?2.2:3.25;
  for(const {arrow,a} of arrows)arrow.setDirection(V(dir*Math.sin(a),0,-dir*Math.cos(a)));
  for(const c of compasses){c.target=Math.PI/2-c.a+(dir===1?0:Math.PI);if(reduced.matches)c.needle.rotation.y=c.target;}
  currentLabel.userData.redraw(`I = ${current} A ${dir===1?'↑':'↓'}`);s.request();
 }
 s.root.querySelectorAll('[data-current]').forEach(b=>b.addEventListener('click',()=>{current=Number(b.dataset.current);change();}));s.root.querySelector('[data-action="reverse"]').addEventListener('click',()=>{dir*=-1;change();});
 s.update=dt=>{let moving=false;for(const c of compasses){let delta=Math.atan2(Math.sin(c.target-c.needle.rotation.y),Math.cos(c.target-c.needle.rotation.y));if(Math.abs(delta)>.002){c.needle.rotation.y+=delta*Math.min(1,dt*9);moving=true;}}return moving;};change();
}
function buildOptics(s){
 board(s.scene,9.8,4.6);s.target=V(-.4,1.05,0);s.radius=14.7;s.yaw=.19;
 mesh(new THREE.BoxGeometry(9,.13,.55),mat(0x344744,.7,.28),s.scene,0,.12,0);
 for(let n=-36;n<=36;n+=6){const x=n*.115;line([V(x,.195,-.18),V(x,.195,.18)],0xd0b97b,s.scene);if(n!==0 && n%12===0)label(String(Math.abs(n)),s.scene,x,.12,.65,.55,'#334945',false);}
 const axis=1.25,scale=.115,h=.69,f=12*scale;
 line([V(-4.9,axis,0),V(4.9,axis,0)],0x789798,s.scene,true);
 mesh(new THREE.CylinderGeometry(.06,.06,axis,20),mat(0x718789,.7,.25),s.scene,0,axis/2,0);
 const glass=new THREE.MeshPhysicalMaterial({color:0xaee6ee,metalness:.05,roughness:.12,transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false,clearcoat:1});const lens=mesh(new THREE.SphereGeometry(1,48,32),glass,s.scene,0,axis,0);lens.scale.set(.16,1,1);
 const rim=mesh(new THREE.TorusGeometry(1,.026,12,72),mat(0x7db5b8,.65,.22),s.scene,0,axis,0);rim.rotation.y=Math.PI/2;
 for(const side of [-1,1]){for(const k of [1,2]){const x=side*k*f;mesh(new THREE.SphereGeometry(.045,16,12),mat(gold,.2,.4),s.scene,x,axis,0);label(k===1?'F':'2F',s.scene,x,axis-.27,.02,.45);}}
 label('f = 12 cm',s.scene,3.65,.08,1.6,1.3,'#334945',false);
 const dynamic=new THREE.Group();s.scene.add(dynamic);
 function candle(parent,x,base,height,image=false){
  const g=new THREE.Group();g.position.set(x,base,0);if(height<0)g.rotation.z=Math.PI;parent.add(g);const a=Math.abs(height),body=mat(image?(height>0?0x70c5bd:0xd8a65e):0xf5d188,.12,.36);if(image){body.transparent=true;body.opacity=height>0?.45:.78;}
  mesh(new THREE.CylinderGeometry(.09,.1,a*.8,24),body,g,0,a*.4,0);
  const flame=mesh(new THREE.SphereGeometry(.09,20,16),new THREE.MeshBasicMaterial({color:image?(height>0?0x8ae8dc:0xffce7f):0xffdf9b,transparent:true,opacity:.9}),g,0,a*.92,0);flame.scale.set(.65,a*.18/.09,.65);
  return g;
 }
 function change(distance){
  disposeGroup(dynamic);const result=lensImage(distance),x=-distance*scale,ix=result.distance*scale,ih=h*result.magnification;
  mesh(new THREE.CylinderGeometry(.055,.055,axis-.2,16),mat(0x536766,.7,.3),dynamic,x,(axis-.2)/2+.2,0);mesh(new THREE.CylinderGeometry(.23,.25,.07,24),mat(0xaa8b4e,.7,.3),dynamic,x,.24,0);candle(dynamic,x,axis,h);
  label('CİSİM',dynamic,x,axis+h+.33,.05,1);
  const zOffset=.018;
  if(result.real){
   mesh(new THREE.BoxGeometry(.055,1.85,1.48),new THREE.MeshStandardMaterial({color:0xe2ddc7,roughness:.8,transparent:true,opacity:.48,depthWrite:false}),dynamic,ix+.055,axis-.12,0);
   mesh(new THREE.CylinderGeometry(.06,.06,.5,16),mat(0x657471,.6,.4),dynamic,ix,.32,0);
   candle(dynamic,ix,axis,ih,true);label('GERÇEK GÖRÜNTÜ',dynamic,ix,2.52,0,2.2);
  }else{candle(dynamic,ix,axis,ih,true);label('SANAL GÖRÜNTÜ',dynamic,ix,axis+ih+.35,0,2.2,'#9ee6e0');}
  // Principal ray parallel to axis, then through the far focus.
  const endX=result.real?ix:1.15;
  tube([V(x,axis+h,zOffset),V(0,axis+h,zOffset)],gold,.015,dynamic);
  tube([V(0,axis+h,zOffset),V(endX,axis+h-h/f*endX,zOffset)],gold,.015,dynamic);
  // Undeviated ray through the optical centre.
  tube([V(x,axis+h,-zOffset),V(0,axis,-zOffset),V(endX,axis-h/(distance*scale)*endX,-zOffset)],coral,.014,dynamic);
  if(!result.real){line([V(0,axis+h,zOffset),V(ix,axis+ih,zOffset)],teal,dynamic,true);line([V(0,axis,-zOffset),V(ix,axis+ih,-zOffset)],teal,dynamic,true);}
  s.root.querySelectorAll('[data-distance]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.distance)===distance)));
  s.root.querySelector('#image-distance').innerHTML=fmt(Math.abs(result.distance),0)+' <em>cm</em>';
  s.root.querySelector('#image-scale').innerHTML=fmt(Math.abs(result.magnification),2)+' <em>kat</em>';
  const size=distance===30?'küçük':distance===24?'aynı boyda':'büyük';
  s.root.querySelector('[data-stage-image]').textContent=result.real?'Gerçek · ters':'Sanal · düz';
  s.root.querySelector('#optics-note').textContent=`${result.real?'Gerçek · ters':'Sanal · düz'} · ${size}. ${result.real?'Görüntü merceğin karşı tarafındaki ekranda elde edilir.':'Görüntü cismin bulunduğu tarafta, mercekten 12 cm uzakta görünür; ekranda elde edilemez.'}`;s.request();
 }
 s.root.querySelectorAll('[data-distance]').forEach(b=>b.addEventListener('click',()=>change(Number(b.dataset.distance))));change(30);
}
// Scene rendering stays local, and only visible scenes request animation frames.
const builders={hareket:buildFlight,manyetizma:buildMagnet,optik:buildOptics};
const lazy=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;lazy.unobserve(e.target);let studio;try{studio=new Studio(e.target);builders[e.target.dataset.studio](studio);studio.ready();}catch(error){console.error('Rehber sahnesi yüklenemedi:',error);if(studio)studio.fail('3B görünüm bu cihazda açılamadı. Şematik çizimi ve aşağıdaki açıklamaları kullanabilirsin.');else{e.target.classList.add('st-unavailable');e.target.querySelector('.st-loading').textContent='3B görünüm bu cihazda açılamadı. Şematik çizim ve açıklamalar aşağıda.';e.target.querySelectorAll('.st-controls button,.st-controls input,[data-view]').forEach(b=>b.disabled=true);}}}},{rootMargin:'350px'});
document.querySelectorAll('[data-studio]').forEach(el=>lazy.observe(el));
