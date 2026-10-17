import * as THREE from './bfy-three.module.min.js';
import {clamp,pendulum,route,buoyancy,heating,motion,energy,circuit,wave} from './bfy-rehber910-physics.mjs?v=20261017-rehber910';
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
 let previous;
 const redraw=value=>{
  if(value===previous)return;previous=value;
  ctx.font='600 52px system-ui';const measured=ctx.measureText(value).width;
  c.width=Math.ceil(measured+48);c.height=88;
  if(background){ctx.fillStyle='rgba(15,37,40,.93)';ctx.beginPath();ctx.roundRect(2,2,c.width-4,84,14);ctx.fill();ctx.strokeStyle='rgba(215,194,143,.35)';ctx.lineWidth=2;ctx.stroke();}
  ctx.font='600 52px system-ui';ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(value,c.width/2,46);
  texture.dispose();texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;sprite.material.map=texture;sprite.material.needsUpdate=true;sprite.scale.set(width,width*88/c.width,1);
 };
 sprite.userData.redraw=redraw;redraw(text);parent.add(sprite);return sprite;
}
function board(parent,width=9,depth=4.5,spacing=.5){
 const shape=new THREE.Shape(),w=width/2,d=depth/2,r=.22;
 shape.moveTo(-w+r,-d);shape.lineTo(w-r,-d);shape.quadraticCurveTo(w,-d,w,-d+r);shape.lineTo(w,d-r);shape.quadraticCurveTo(w,d,w-r,d);shape.lineTo(-w+r,d);shape.quadraticCurveTo(-w,d,-w,d-r);shape.lineTo(-w,-d+r);shape.quadraticCurveTo(-w,-d,-w+r,-d);
 const geo=new THREE.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.08,bevelThickness:.06,curveSegments:8});
 const m=mesh(geo,mat(0xbda87c,.2,.55),parent,0,-.33,0);m.rotation.x=-Math.PI/2;
 mesh(new THREE.BoxGeometry(width-.2,.08,depth-.2),mat(0x47514a,.5,.35),parent,0,-.36,0);
 const plane=mesh(new THREE.PlaneGeometry(60,60),mat(0x14343b,0,.85),parent,0,-.52,0);plane.rotation.x=-Math.PI/2;plane.castShadow=false;
 for(let x=-Math.floor(width/2);x<=Math.floor(width/2);x+=spacing)line([V(x,-.015,-depth/2+.2),V(x,-.015,depth/2-.2)],0xaa986f,parent);
 for(let z=-Math.floor(depth/2);z<=Math.floor(depth/2);z+=spacing)line([V(-width/2+.2,-.015,z),V(width/2-.2,-.015,z)],0xaa986f,parent);
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
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.failed=true;this.fail('3B görünüm şu an kullanılamıyor. Şematik çizimi ve açıklamaları kullanabilirsin.');});
  document.addEventListener('visibilitychange',()=>{this.last=0;if(!document.hidden)this.request();});
 }
 cameraUpdate(){const aspect=this.viewport.clientWidth/this.viewport.clientHeight;const radius=this.radius*(aspect<1.15?1.25:1);this.camera.position.set(this.target.x+radius*Math.sin(this.yaw)*Math.cos(this.elevation),this.target.y+radius*Math.sin(this.elevation),radius*Math.cos(this.yaw)*Math.cos(this.elevation));this.camera.lookAt(this.target);}
 setView(mode){const magnet=['vektor','elektrik'].includes(this.root.dataset.studio);this.yaw=mode==='front'?0:.3;this.elevation=mode==='front'?(magnet?1.565:.045):.42;this.root.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===mode)));}
 request(){if(this.failed||this.frame||!this.visible||document.hidden)return;this.frame=requestAnimationFrame(t=>{this.frame=0;const dt=this.last?Math.min((t-this.last)/1000,.05):0;this.last=t;const animate=this.update?.(dt);this.cameraUpdate();this.renderer.render(this.scene,this.camera);if(animate)this.request();else this.last=0;});}
 ready(){this.root.classList.add('st-ready');this.viewport.querySelector('.st-loading').hidden=true;new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.last=0;this.request();},{rootMargin:'100px'}).observe(this.viewport);}
 fail(message){this.root.classList.remove('st-ready');this.root.classList.add('st-unavailable');this.viewport.querySelector('.st-loading').textContent=message;this.viewport.querySelector('.st-loading').hidden=false;this.root.querySelectorAll('.st-controls button,.st-controls input,[data-view]').forEach(b=>b.disabled=true);}
}
const out=(s,key,value)=>{const el=s.root.querySelector(`[data-out="${key}"]`);if(el&&el.textContent!==String(value))el.textContent=value;};
const selected=(s,key,value)=>s.root.querySelectorAll(`[data-${key}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(value)===b.dataset[key])));
function arrow(parent,from,to,color,r=.025){const d=to.clone().sub(from),len=d.length();if(len<.02)return;const head=Math.min(.28,len*.22);tube([from,to.clone().addScaledVector(d,-head/len)],color,r,parent);const cone=mesh(new THREE.ConeGeometry(head*.35,head,20),mat(color,.35,.35),parent);cone.position.copy(to.clone().addScaledVector(d,-head/(2*len)));cone.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());}
function beam(parent,a,b,r,color){const delta=b.clone().sub(a),m=mesh(new THREE.CylinderGeometry(r,r,delta.length(),16),mat(color,.6,.35),parent);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),delta.normalize());return m;}
function timeline(s,max,draw,{speed=1,loop=false,unit='s',digits=2}={}){
 let value=0,playing=false;const slider=s.root.querySelector('[data-time]'),button=s.root.querySelector('[data-action="play"]'),initial=button.textContent;
 function render(){slider.value=value;out(s,'time',fmt(value,digits)+' '+unit);draw(value);}
 button.addEventListener('click',()=>{if(value>=max&&!loop)value=0;playing=!playing;button.textContent=playing?'Ⅱ Duraklat':'▶ Devam et';s.last=0;render();s.request();});
 s.root.querySelector('[data-action="reset"]').addEventListener('click',()=>{value=0;playing=false;button.textContent=initial;render();s.request();});
 slider.addEventListener('input',()=>{value=Number(slider.value);playing=false;button.textContent='▶ Devam et';render();s.request();});
 s.update=dt=>{if(playing){value+=dt*speed;if(value>=max){if(loop)value%=max;else{value=max;playing=false;button.textContent='↺ Yeniden başlat';}}render();}return playing;};
 render();return {redraw:render,get value(){return value;}};
}
function pendulumScene(s){
 board(s.scene,9,4.8);s.target=V(0,2,0);s.radius=15.6;
 for(const x of [-3.7,3.7]){mesh(new THREE.BoxGeometry(.75,.16,.9),mat(0x344d4c,.6,.3),s.scene,x,.08,0);beam(s.scene,V(x,.15,0),V(x,4.2,0),.07,0x9b9f92);}
 beam(s.scene,V(-3.7,4.2,0),V(3.7,4.2,0),.085,0xd0b47a);
 const rigs=[-1.8,1.8].map((x,i)=>{const rig=new THREE.Group();rig.position.set(x,4.1,0);s.scene.add(rig);mesh(new THREE.SphereGeometry(.11,20,16),mat(cream,.7,.2),s.scene,x,4.1,0);const cord=mesh(new THREE.CylinderGeometry(.018,.018,1,12),mat(cream,.4,.5),rig);const bob=mesh(new THREE.SphereGeometry(.22,32,24),mat(i?coral:gold,.75,.22),rig);return {rig,cord,bob};});
 label('REFERANS',s.scene,-1.8,.42,1.1,1.65);label('1 m · 1 kg',s.scene,-1.8,.05,1.85,1.5,'#324c49',false);
 const caption=label('1 m · 1 kg',s.scene,1.8,.05,1.85,1.5,'#324c49',false);label('DEĞİŞKEN',s.scene,1.8,.42,1.1,1.65);
 let length=1,mass=1;
 function draw(t){rigs.forEach((r,i)=>{const l=i?length:1,m=i?mass:1,p=pendulum(l,m,t);r.rig.rotation.z=p.angle;const scale=l*1.3;r.cord.scale.y=scale;r.cord.position.y=-scale/2;r.bob.position.y=-scale;r.bob.scale.setScalar(Math.cbrt(m));});out(s,'hud',fmt(t,2)+' s · eş zamanlı gözlem');}
 const time=timeline(s,8,draw);function change(){selected(s,'mass',mass);selected(s,'length',length);caption.userData.redraw(`${length} m · ${mass} kg`);out(s,'periodA',fmt(pendulum(1).period,2)+' s');out(s,'periodB',fmt(pendulum(length).period,2)+' s');out(s,'note',length===1?'Kütle farklı olsa da iki sarkaç birlikte salınıyor. Bu modelde süreyi kütle değiştirmez.':'Sağdaki ip daha uzun; bir tam salınımı daha uzun sürer. Kütleyi değiştirerek sonucu tekrar kontrol et.');time.redraw();s.request();}
 s.root.querySelectorAll('[data-mass]').forEach(b=>b.addEventListener('click',()=>{mass=+b.dataset.mass;change();}));s.root.querySelectorAll('[data-length]').forEach(b=>b.addEventListener('click',()=>{length=+b.dataset.length;change();}));change();
}
function vectorScene(s){
 board(s.scene,9,7,1);s.target=V(0,.25,0);s.radius=14.7;s.elevation=.75;s.yaw=.08;
 const group=new THREE.Group();s.scene.add(group);let mode='corner';
 label('DOĞU →',s.scene,2.7,.1,3.05,1.7,'#314c49',false);label('KUZEY ↑',s.scene,-3.15,.2,-2.7,1.7,'#314c49',false);
 function change(){disposeGroup(group);const start=V(-2,.14,2),turn=V(1,.14,2),end=mode==='corner'?V(1,.14,-2):start.clone();
  arrow(group,start,turn,gold,.04);if(mode==='corner'){arrow(group,turn,end,coral,.04);arrow(group,start.clone().add(V(0,.045,0)),end.clone().add(V(0,.045,0)),teal,.03);label('4 m',group,1.6,.4,-.15,.8);label('5 m',group,-1,.5,-.3,.8,'#b7fff5');}else{arrow(group,turn.clone().add(V(0,.07,-.25)),start.clone().add(V(0,.07,-.25)),coral,.04);label('Geri: 3 m',group,-.2,.4,.7,1.5,'#ffc1ab');label('Δr = 0',group,-1.8,.6,1.9,1.25,'#b7fff5');}
  for(const [p,color] of [[start,cream],[end,teal]]){const ring=mesh(new THREE.TorusGeometry(.17,.035,10,32),mat(color,.4,.3),group,p.x,.05,p.z);ring.rotation.x=Math.PI/2;}
  label('3 m',group,-.45,.25,2.55,.8);label('BAŞLANGIÇ',group,-2.3,.5,2.7,1.55);if(mode==='corner')label('BİTİŞ',group,1.4,.5,-2.2,1);
  const r=route(mode);out(s,'path',r.path+' m');out(s,'result',r.result+' m');out(s,'hud',`${r.path} m yol · ${r.result} m yer değiştirme`);out(s,'note',mode==='corner'?'Yol okları toplam 7 m. Başlangıç–bitiş vektörü 5 m; bu vektörün yönü de vardır.':'Başlangıca döndün. 6 m yürüdün ama konumun değişmedi; yer değiştirme sıfır.');selected(s,'route',mode);s.request();}
 s.root.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.route;change();}));change();
}
function buoyancyScene(s){
 board(s.scene,8,5);s.target=V(0,1.35,0);s.radius=12.6;s.yaw=.35;
 const glass=new THREE.MeshPhysicalMaterial({color:0xb8e5e6,transparent:true,opacity:.13,roughness:.15,metalness:.05,side:THREE.DoubleSide,depthWrite:false});
 for(const x of [-2.5,2.5])mesh(new THREE.BoxGeometry(.04,2.8,2.9),glass,s.scene,x,1.45,0);
 for(const z of [-1.45,1.45])mesh(new THREE.BoxGeometry(5,2.8,.04),glass,s.scene,0,1.45,z);
 mesh(new THREE.BoxGeometry(5,.13,2.9),mat(0x839b97,.6,.3),s.scene,0,.08,0);
 const water=mesh(new THREE.BoxGeometry(4.94,2.05,2.84),new THREE.MeshPhysicalMaterial({color:0x4da5be,transparent:true,opacity:.19,roughness:.15,depthWrite:false}),s.scene,0,1.175,0);water.castShadow=false;
 const surface=mesh(new THREE.PlaneGeometry(4.94,2.84),new THREE.MeshBasicMaterial({color:0x70d1dc,transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false}),s.scene,0,2.2,0);surface.rotation.x=-Math.PI/2;
 for(let x=-2.2;x<=2.2;x+=.4)beam(s.scene,V(x,.28,-1.3),V(x,.28,1.3),.025,0x758a83);
 const cube=mesh(new THREE.BoxGeometry(1,1,1),mat(gold,.3,.45),s.scene);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(cube.geometry),new THREE.LineBasicMaterial({color:0xffebae}));cube.add(edges);
 const forces=new THREE.Group();s.scene.add(forces);let density=800;
 label('SU · 1.000 kg/m³',s.scene,-.7,.2,2.1,2.8,'#324c49',false);
 function change(){const r=buoyancy(density);cube.position.set(0,r.floats?2.2+.5-r.fraction:.805,0);cube.material.color.setHex(density===1200?0x99a8b3:gold);disposeGroup(forces);
  const y=cube.position.y;arrow(forces,V(.7,y,0),V(.7,y+r.lift*.09,0),teal);label('Fₖ '+fmt(r.lift,0)+' N',forces,1.55,y+.5,.02,1.3,'#b0fff3');arrow(forces,V(-.7,y,0),V(-.7,y-r.weight*.09,0),coral);label('G '+fmt(r.weight,0)+' N',forces,-1.55,y-.3,.02,1.3,'#ffc4a9');
  if(r.support){arrow(forces,V(0,.15,.95),V(0,.15+r.support*.18,.95),cream);label('N = 2 N',forces,2.1,.45,1.65,1.25);}
  selected(s,'density',density);out(s,'fraction','%'+fmt(r.fraction*100,0));out(s,'lift',fmt(r.lift,0)+' N');out(s,'weight',fmt(r.weight,0)+' N');out(s,'support',fmt(r.support,0)+' N');out(s,'hud',r.floats?'Yüzme dengesi':'Izgarada denge');out(s,'note',r.floats?`Hacmin %${fmt(r.fraction*100,0)}’i suda. Fₖ = G = ${fmt(r.weight,0)} N; blok serbestçe yüzüyor.`:'Blok tamamen batmış: G = 12 N, Fₖ = 10 N. Izgaranın 2 N desteğiyle duruyor; serbestken batardı.');s.request();}
 s.root.querySelectorAll('[data-density]').forEach(b=>b.addEventListener('click',()=>{density=+b.dataset.density;change();}));change();
}
function heatScene(s){
 board(s.scene,9,5);s.target=V(0,1.1,0);s.radius=14.5;s.yaw=.22;const thermometers=[];
 for(const [x,color] of [[-2,teal],[2,coral]]){
  mesh(new THREE.CylinderGeometry(1,1.1,.2,48),mat(0x29494c,.5,.3),s.scene,x,.13,0);
  const coil=mesh(new THREE.TorusGeometry(.7,.045,12,48),new THREE.MeshStandardMaterial({color:0xb87546,emissive:0x5e2414}),s.scene,x,.25,0);coil.rotation.x=-Math.PI/2;
  if(x<0){mesh(new THREE.CylinderGeometry(.82,.82,1.5,48,1,true),new THREE.MeshPhysicalMaterial({color:0xcaeeef,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide}),s.scene,x,1.08,0);mesh(new THREE.CylinderGeometry(.79,.79,1.1,48),new THREE.MeshStandardMaterial({color:0x4d9fae,transparent:true,opacity:.6}),s.scene,x,.9,0);}
  else mesh(new THREE.BoxGeometry(1.3,1.3,1.3),mat(0xbac3c5,.65,.32),s.scene,x,.95,0);
  beam(s.scene,V(x+.78,.3,.6),V(x+.78,2.7,.6),.055,0xe5dfc3);const liquid=mesh(new THREE.CylinderGeometry(.035,.035,1,16),new THREE.MeshBasicMaterial({color}),s.scene);const temp=label('20,0 °C',s.scene,x,2.8,.02,1.5);
  for(let t=20;t<=40;t+=5){const y=.7+(t-20)*.08;line([V(x+.68,y,.61),V(x+.88,y,.61)],0x6e6c58,s.scene);}
  label(x<0?'SU · 1 kg':'ALÜMİNYUM · 1 kg',s.scene,x,.1,1.75,2.1,'#324c49',false);thermometers.push({x,liquid,temp,coil});
 }
 timeline(s,18000,q=>{const temps=heating(q);thermometers.forEach((a,i)=>{const t=i?temps.aluminium:temps.water,len=.4+(t-20)*.08;a.liquid.position.set(a.x+.78,.3+len/2,.61);a.liquid.scale.y=len;a.temp.userData.redraw(fmt(t,1)+' °C');a.coil.material.emissiveIntensity=q>0?1.4:.1;});out(s,'water',fmt(temps.water,1)+' °C');out(s,'aluminium',fmt(temps.aluminium,1)+' °C');out(s,'hud','Her maddeye '+fmt(q,0)+' J');out(s,'note',q===0?'İki madde de 20 °C. Eşit ısı verildiğinde sıcaklık artışlarını karşılaştır.':'Eşit kütlelere eşit ısı verildi. Öz ısısı daha küçük olan alüminyumun sıcaklığı daha fazla arttı.');},{speed:3000,unit:'J',digits:0});
}
function cart(parent,color=coral){const g=new THREE.Group();parent.add(g);mesh(new THREE.BoxGeometry(.65,.22,.5),mat(color,.6,.25),g,0,.29,0);mesh(new THREE.BoxGeometry(.32,.13,.4),mat(0xe4d8b4,.25,.4),g,0,.46,0);for(const x of [-.23,.23])for(const z of [-.28,.28]){const w=mesh(new THREE.CylinderGeometry(.12,.12,.08,24),mat(0x263b3a,.65,.35),g,x,.12,z);w.rotation.x=Math.PI/2;}return g;}
function motionScene(s){
 board(s.scene,10,4.4);s.target=V(0,.55,0);s.radius=14.7;s.yaw=.2;
 for(const z of [-.24,.24])beam(s.scene,V(-4,.06,z),V(4,.06,z),.04,0x556a67);
 const car=cart(s.scene);const ghosts=new THREE.Group();s.scene.add(ghosts);for(let n=0;n<=16;n+=2){label(String(n),s.scene,-3.8+n*.475,.05,.9,.5,'#324c49',false);line([V(-3.8+n*.475,.03,.4),V(-3.8+n*.475,.03,.6)],0x6c7a67,s.scene);}label('x / metre',s.scene,3,.05,1.6,1.3,'#324c49',false);
 let acceleration=2;const dots=[];for(let n=1;n<=4;n++){const g=cart(ghosts,0xa8bcb6);g.traverse(o=>{if(o.material){o.material.transparent=true;o.material.opacity=.2;o.material.depthWrite=false;}});dots.push({g,n});}
 const speedArrow=new THREE.ArrowHelper(V(1,0,0),V(0,.85,0),1,teal,.2,.12);s.scene.add(speedArrow);
 const time=timeline(s,4,t=>{const r=motion(t,acceleration);car.position.x=-3.8+r.x*.475;speedArrow.position.set(car.position.x,.95,0);speedArrow.visible=r.v>.01;speedArrow.setLength(Math.max(.01,r.v*.12),.18,.1);out(s,'position',fmt(r.x,1)+' m');out(s,'speed',fmt(r.v,1)+' m/s');out(s,'hud','t = '+fmt(t,2)+' s');out(s,'graphnote','Taralı alan = '+fmt(r.area,1)+' m yer değiştirme.');const x=32+t*60,y=87-r.v*8.75;s.root.querySelector('[data-graph-area]').setAttribute('d',`M32 87L${x} ${y}L${x} 87Z`);s.root.querySelector('[data-graph-dot]').setAttribute('cx',x);s.root.querySelector('[data-graph-dot]').setAttribute('cy',y);});
 function change(){selected(s,'acceleration',acceleration);for(const {g,n} of dots)g.position.x=-3.8+motion(n,acceleration).x*.475;s.root.querySelector('[data-graph-line]').setAttribute('d',`M32 87L272 ${87-acceleration*4*8.75}`);out(s,'note',`İvme ${acceleration} m/s²: hız her saniye ${acceleration} m/s artar. Silik araçlar 1 s aralıklarla konumları gösterir.`);time.redraw();s.request();}
 s.root.querySelectorAll('[data-acceleration]').forEach(b=>b.addEventListener('click',()=>{acceleration=+b.dataset.acceleration;change();}));change();
}
function energyScene(s){
 board(s.scene,9.5,4.8);s.target=V(0,1.25,0);s.radius=14.3;s.yaw=.18;
 mesh(new THREE.BoxGeometry(6.2,.3,1.4),mat(0x465e58,.5,.45),s.scene,0,.1,0);
 const shape=new THREE.Shape();shape.moveTo(-3,.25);shape.lineTo(-3,2.25);shape.lineTo(3,.25);shape.closePath();const ramp=mesh(new THREE.ExtrudeGeometry(shape,{depth:1.2,bevelEnabled:false}),mat(0x697d76,.5,.45),s.scene,0,0,-.6);
 for(const z of [-.7,.7])beam(s.scene,V(-3,2.28,z),V(3,.28,z),.04,0xdac68b);
 line([V(-3.6,.25,0),V(-3.6,2.25,0)],0xd6bd7c,s.scene,true);label('2 m',s.scene,-3.8,1.25,.2,.75);label('h = 0',s.scene,3.1,.08,1.25,1.1,'#324c49',false);
 const block=mesh(new THREE.BoxGeometry(.65,.45,.7),mat(coral,.65,.3),s.scene);block.rotation.z=-Math.atan(1/3);const marker=label('1 kg',s.scene,-3,3.2,0,1);
 let mass=1,height=2,playing=false,t=0;const slider=s.root.querySelector('[data-height]'),button=s.root.querySelector('[data-action="play"]');
 function draw(){const r=energy(height,mass),x=3-3*height;block.position.set(x+.225/Math.sqrt(10),height+.25+.675/Math.sqrt(10),0);marker.position.set(x,height+1.1,0);marker.userData.redraw(mass+' kg');slider.value=height;out(s,'height',fmt(height,2)+' m');out(s,'speed',fmt(r.speed,2)+' m/s');out(s,'total',fmt(r.total,0)+' J');out(s,'potential',fmt(r.potential,1)+' J');out(s,'kinetic',fmt(r.kinetic,1)+' J');out(s,'hud','Eₚ + Eₖ = '+fmt(r.total,0)+' J');s.root.querySelector('[data-bar="potential"]').style.width=(r.potential/r.total*100)+'%';s.root.querySelector('[data-bar="kinetic"]').style.width=(r.kinetic/r.total*100)+'%';}
 button.addEventListener('click',()=>{if(height<.001){height=2;t=0;}playing=!playing;button.textContent=playing?'Ⅱ Duraklat':'▶ Devam et';s.last=0;s.request();});s.root.querySelector('[data-action="reset"]').addEventListener('click',()=>{playing=false;t=0;height=2;button.textContent='▶ Cismi bırak';draw();s.request();});slider.addEventListener('input',()=>{height=+slider.value;t=2*Math.sqrt(1-height/2);playing=false;button.textContent='▶ Devam et';draw();s.request();});
 s.root.querySelectorAll('[data-mass]').forEach(b=>b.addEventListener('click',()=>{mass=+b.dataset.mass;selected(s,'mass',mass);out(s,'note',mass===1?'Toplam enerji 20 J. Yükseklik azalırken potansiyel enerji kinetik enerjiye dönüşür.':'Toplam enerji 40 J oldu. Aynı yükseklikte sürat değişmedi; her iki enerji iki katına çıktı.');draw();s.request();}));s.update=dt=>{if(playing){t=Math.min(t+dt,2);height=2*(1-t*t/4);draw();if(t===2){playing=false;button.textContent='↺ Yeniden bırak';}}return playing;};draw();
}
function circuitScene(s){
 board(s.scene,9.2,6.2);s.target=V(0,.3,0);s.radius=14.3;s.yaw=.13;s.elevation=.7;
 const dynamic=new THREE.Group();s.scene.add(dynamic);let connection='series',playing=false,time=0,paths=[],dots=[];
 const source=mesh(new THREE.BoxGeometry(1.4,.55,1),mat(0x304c50,.6,.3),s.scene,0,.3,2);label('6 V',s.scene,0,.75,2,1);label('+',s.scene,-.8,.4,2,.4,'#ffc2a5');label('−',s.scene,.8,.4,2,.4,'#adf5ed');
 function wire(points,color){const pts=points.map(p=>V(p[0],.16,p[1]));for(let i=1;i<pts.length;i++)beam(dynamic,pts[i-1],pts[i],.035,color);}
 function resistor(x,z,name){mesh(new THREE.BoxGeometry(1.05,.25,.38),mat(name==='R₁'?gold:coral,.35,.45),dynamic,x,.3,z);for(const dx of [-.22,0,.22])mesh(new THREE.BoxGeometry(.055,.27,.39),mat(0x79563d,.1,.5),dynamic,x+dx,.3,z);label(name+' · 6 Ω',dynamic,x,.75,z,1.5);}
 function path(points){const vectors=points.map(p=>V(p[0],.2,p[1]));const lengths=[0];for(let i=1;i<vectors.length;i++)lengths.push(lengths.at(-1)+vectors[i].distanceTo(vectors[i-1]));return {vectors,lengths,total:lengths.at(-1)};}
 function at(p,d){let n=1;while(n<p.lengths.length-1&&p.lengths[n]<d)n++;const u=(d-p.lengths[n-1])/(p.lengths[n]-p.lengths[n-1]);return p.vectors[n-1].clone().lerp(p.vectors[n],u);}
 function change(){disposeGroup(dynamic);paths=[];dots=[];
  if(connection==='series'){wire([[-.8,2],[-3,2],[-3,-1.3],[3,-1.3],[3,2],[.8,2]],0x62a99f);resistor(-1.35,-1.3,'R₁');resistor(1.35,-1.3,'R₂');paths.push(path([[-.8,2],[-3,2],[-3,-1.3],[3,-1.3],[3,2],[.8,2]]));}
  else{wire([[-.8,2],[-3,2],[-3,-1.7]],0x62a99f);wire([[.8,2],[3,2],[3,-1.7]],0x62a99f);for(const z of [-1.7,.25]){wire([[-3,z],[3,z]],0x62a99f);resistor(0,z,z<0?'R₁':'R₂');paths.push(path([[-.8,2],[-3,2],[-3,z],[3,z],[3,2],[.8,2]]));}label('1 A',dynamic,1.8,.55,-1.7,.7,'#b6fff1');label('1 A',dynamic,1.8,.55,.25,.7,'#b6fff1');}
  const r=circuit(connection);out(s,'resistance',fmt(r.resistance,0)+' Ω');out(s,'total',fmt(r.total,1)+' A');out(s,'branch',fmt(r.branch,1)+' A');out(s,'voltage',fmt(r.voltage,0)+' V');out(s,'hud',connection==='series'?'Seri · tek akım yolu':'Paralel · iki akım kolu');out(s,'note',connection==='series'?'Rₑş = 12 Ω. Kaynaktan ve her dirençten 0,5 A geçer; her dirençte gerilim 3 V.':'Rₑş = 3 Ω. Her kolda 1 A; kaynaktan toplam 2 A geçer. Her dirençte gerilim 6 V.');selected(s,'connection',connection);
  paths.forEach((p,j)=>{for(let i=0;i<7;i++){const dot=mesh(new THREE.SphereGeometry(.065,14,10),new THREE.MeshBasicMaterial({color:cream}),dynamic);dots.push({dot,p,index:i});}});position();s.request();}
 function position(){dots.forEach(({dot,p,index})=>dot.position.copy(at(p,(time*.9+index*p.total/7)%p.total)));}
 const b=s.root.querySelector('[data-action="play"]');b.addEventListener('click',()=>{playing=!playing;b.textContent=playing?'Ⅱ Duraklat':'▶ Akım yollarını izle';s.last=0;s.request();});s.root.querySelector('[data-action="reset"]').addEventListener('click',()=>{playing=false;time=0;b.textContent='▶ Akım yollarını izle';position();s.request();});s.root.querySelectorAll('[data-connection]').forEach(b=>b.addEventListener('click',()=>{connection=b.dataset.connection;change();}));s.update=dt=>{if(playing){time+=dt;position();}return playing;};change();
}
function waveScene(s){
 board(s.scene,10,4.5);s.target=V(0,1.2,0);s.radius=15.2;s.yaw=.14;s.elevation=.3;
 const beads=[],points=[],N=81,base=1.45;
 for(let i=0;i<N;i++){points.push(V(-4+i*.1,base,0));if(i%2===0){const sphere=mesh(new THREE.SphereGeometry(i===40?.115:.052,16,12),mat(i===40?teal:gold,.5,.3),s.scene);beads.push({sphere,i});}}
 const geometry=new THREE.BufferGeometry().setFromPoints(points);const string=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:gold}));s.scene.add(string);
 line([V(-4,base,0),V(4,base,0)],0x7b9692,s.scene,true);line([V(0,.15,0),V(0,2.7,0)],0x5c9892,s.scene,true);
 for(let x=0;x<=8;x+=2){label(String(x),s.scene,x-4,.05,1.1,.5,'#324c49',false);}label('x / metre',s.scene,3,.05,1.85,1.2,'#324c49',false);
 arrow(s.scene,V(1.8,2.65,0),V(3.9,2.65,0),coral);label('YAYILMA →',s.scene,2.8,3.1,0,1.8,'#ffbba1');label('İŞARETLİ NOKTA',s.scene,0,.35,1.8,2,'#aff5e9');
 const lengthGroup=new THREE.Group();s.scene.add(lengthGroup);let frequency=1,amplitude=.3;
 const time=timeline(s,2,t=>{const attr=geometry.getAttribute('position');for(let i=0;i<N;i++){const y=base+wave(i*.1,t,frequency,amplitude).y;attr.setY(i,y);}attr.needsUpdate=true;beads.forEach(({sphere,i})=>sphere.position.set(-4+i*.1,attr.getY(i),0));out(s,'hud','v = 4 m/s · 0,5× oynatma');},{speed:.5,loop:true});
 function change(){const w=wave(0,0,frequency,amplitude);selected(s,'frequency',frequency);selected(s,'amplitude',amplitude);out(s,'wavelength',fmt(w.wavelength,0)+' m');out(s,'period',fmt(w.period,1)+' s');out(s,'note',`${frequency} Hz → dalga boyu ${w.wavelength} m. Genlik ${fmt(amplitude,1)} m. Turkuaz noktanın yatay konumu sabit.`);disposeGroup(lengthGroup);const left=-3.7,right=left+w.wavelength;line([V(left,.3,-1.35),V(right,.3,-1.35)],0xf3dc9b,lengthGroup);for(const x of [left,right])line([V(x,.3,-1.55),V(x,.3,-1.15)],0xf3dc9b,lengthGroup);label('λ = '+w.wavelength+' m',lengthGroup,(left+right)/2,.6,-1.4,1.4);time.redraw();s.request();}
 s.root.querySelectorAll('[data-frequency]').forEach(b=>b.addEventListener('click',()=>{frequency=+b.dataset.frequency;change();}));s.root.querySelectorAll('[data-amplitude]').forEach(b=>b.addEventListener('click',()=>{amplitude=+b.dataset.amplitude;change();}));change();
}
const builders={kesif:pendulumScene,vektor:vectorScene,kaldirma:buoyancyScene,isi:heatScene,hareket:motionScene,enerji:energyScene,elektrik:circuitScene,dalga:waveScene};
const lazy=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;lazy.unobserve(e.target);let studio;try{studio=new Studio(e.target);builders[e.target.dataset.studio](studio);studio.ready();}catch(error){console.error('Rehber sahnesi yüklenemedi:',error);if(studio)studio.fail('3B görünüm bu cihazda açılamadı. Şemayı ve açıklamaları kullanabilirsin.');else{e.target.classList.add('st-unavailable');e.target.querySelector('.st-loading').textContent='3B görünüm bu cihazda açılamadı. Şema ve açıklamalar aşağıda.';e.target.querySelectorAll('.st-controls button,.st-controls input,[data-view]').forEach(b=>b.disabled=true);}}}},{rootMargin:'350px'});
document.querySelectorAll('[data-studio]').forEach(el=>lazy.observe(el));
