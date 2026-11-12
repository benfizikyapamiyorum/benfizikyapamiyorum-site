import * as T from './bfy-three.module.min.js';
// Original game meshes, informed by the silhouette and characteristic lights of each car.
export function createRival(kind){
 const car=new T.Group(),sport=kind==='porsche',bmw=kind==='bmw';
 const color=sport?'#eac54a':bmw?'#286da9':'#bbc3c6';
 const paint=new T.MeshPhysicalMaterial({color,metalness:.45,roughness:.25,clearcoat:1});
 const black=new T.MeshStandardMaterial({color:'#111820',roughness:.65});
 const glass=new T.MeshPhysicalMaterial({color:'#162b38',metalness:.35,roughness:.08,clearcoat:1});
 const metal=new T.MeshStandardMaterial({color:'#bdc8cd',metalness:.9,roughness:.21});
 const lamp=new T.MeshStandardMaterial({color:'#fff6dc',emissive:'#fff0cc',emissiveIntensity:1.7});
 const rear=new T.MeshStandardMaterial({color:'#a71818',emissive:'#ff2424',emissiveIntensity:.65});
 const mesh=(g,m,x=0,y=0,z=0,p=car)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;};
 const box=(x,y,z,w,h,d,m,p=car)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,p);
 const panel=(pts,m)=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts.flat(),3));const idx=[];for(let i=1;i<pts.length-1;i++)idx.push(0,i,i+1);g.setIndex(idx);g.computeVertexNormals();const mat=m.clone();mat.side=T.DoubleSide;return mesh(g,mat);};
 const line=(pts,m,r=.012)=>{const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(c,24,r,6,false),m);};
 const L=sport?2.21:2.30,W=sport?.94:.90,front=sport?1.24:1.36,back=sport?-1.23:-1.33;
 const shape=new T.Shape();shape.moveTo(-L,.39);shape.lineTo(back-.37,.39);shape.absarc(back,.34,.37,Math.PI,0,true);shape.lineTo(front-.37,.34);shape.absarc(front,.34,.37,Math.PI,0,true);shape.lineTo(L,.40);shape.lineTo(L,.73);shape.quadraticCurveTo(L-.3,.92,.75,.96);shape.lineTo(-1.1,1);shape.quadraticCurveTo(-L,1,-L,.70);shape.closePath();
 const g=new T.ExtrudeGeometry(shape,{depth:W*2-.08,bevelEnabled:true,bevelThickness:.04,bevelSize:.045,bevelSegments:3,curveSegments:20});g.translate(0,0,-W+.04);
 const pos=g.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);let z=pos.getZ(i);const taper=1-Math.max(0,Math.abs(x)-1.65)*.15;pos.setZ(i,z*taper);if(sport&&y>.72)pos.setY(i,y-.11*Math.max(0,x-.45));}g.computeVertexNormals();mesh(g,paint);
 box(0,.31,0,3.9,.16,1.6,black);
 if(sport){
  // Arched 911 roof flows into the rear engine cover; wide rear shoulders.
  const sections=[[-1.72,.97,.74],[-1.13,1.23,.70],[-.63,1.40,.65],[.13,1.41,.64],[.73,1.0,.77]];
  for(let i=0;i<sections.length-1;i++){const [x,y,w]=sections[i],[x2,y2,w2]=sections[i+1];panel([[x,y,-w],[x2,y2,-w2],[x2,y2,w2],[x,y,w]],i===0||i===3?glass:paint);}
  for(const s of [-1,1]){panel([[-1.45,1.0,s*.79],[-.92,1.28,s*.70],[-.60,1.36,s*.66],[.10,1.36,s*.66],[.65,1.02,s*.79]],glass);line([[-1.45,1.01,s*.80],[-.93,1.30,s*.71],[-.60,1.41,s*.67],[.13,1.42,s*.66],[.73,1.01,s*.79]],metal,.015);line([[-.90,1.03,s*.80],[-.60,1.36,s*.67]],paint,.022);}
  for(const s of [-1,1]){const h=mesh(new T.SphereGeometry(.18,24,14),lamp,1.99,.82,s*.67);h.scale.set(.24,1, .82);h.rotation.z=-.25;box(-2.19,.78,s*.57,.03,.13,.48,rear);box(2.19,.44,s*.56,.03,.14,.46,black);}
  box(-1.92,1.04,0,.24,.045,1.64,paint);for(const z of [-.57,.57])box(-1.91,.94,z,.06,.20,.04,black);
  for(let i=0;i<8;i++)box(-1.63+i*.045,1.018,0,.018,.008,1.05,black);
 }else{
  const rearX=bmw?-1.28:-1.37,roofBack=bmw?-.73:-.82,roofFront=.40,frontX=1.0,roofY=1.42;
  panel([[frontX,.98,-.84],[roofFront,roofY,-.68],[roofFront,roofY,.68],[frontX,.98,.84]],glass);
  panel([[rearX,.98,.83],[roofBack,roofY,.69],[roofBack,roofY,-.69],[rearX,.98,-.83]],glass);
  const roof=box((roofBack+roofFront)/2,roofY+.015,0,roofFront-roofBack,.04,1.39,paint);
  for(const s of [-1,1]){
   panel([[rearX,.99,s*.85],[roofBack,roofY,s*.69],[roofFront,roofY,s*.69],[frontX,.99,s*.85]],glass);
   line([[rearX,.99,s*.86],[roofBack,roofY+.015,s*.71],[roofFront,roofY+.015,s*.71],[frontX,.99,s*.86]],paint,.033);
   line([[-.30,1.01,s*.86],[-.30,1.43,s*.70]],black,.028);
   line([[rearX,.99,s*.86],[frontX,.99,s*.86]],metal,.012);
   box(.88,1.10,s*.96,.20,.10,.16,paint);
   box(-.27,.91,s*.914,.17,.026,.02,metal);
   if(!bmw){box(-1.04,.91,s*.914,.16,.026,.02,metal);line([[-.50,.46,s*.92],[-.50,.97,s*.92]],black,.003);}
   box(-2.29,.79,s*.61,.025,.16,.42,rear);
  }
  if(bmw){
   for(const s of [-1,1]){box(2.30,.77,s*.20,.03,.20,.30,metal);box(2.32,.77,s*.20,.03,.16,.25,black);for(let k=0;k<6;k++)box(2.34,.77,s*.20-.10+k*.04,.01,.15,.008,metal);for(const z of [.50,.73]){const h=mesh(new T.CircleGeometry(.085,20),lamp,2.30,.79,s*z);h.rotation.y=Math.PI/2;}}
   box(2.32,.46,0,.04,.16,1.40,black);box(-2.24,1.015,0,.14,.045,1.52,paint);
   for(const s of [-1,1]){box(.91,.87,s*.925,.22,.05,.01,black);for(let i=0;i<3;i++)box(.84+i*.06,.87,s*.936,.01,.045,.01,metal);}
  }else{
   box(2.30,.76,0,.03,.28,.95,metal);box(2.32,.76,0,.03,.23,.88,black);for(let i=0;i<3;i++)box(2.34,.68+i*.075,0,.015,.012,.86,metal);
   const ring=mesh(new T.TorusGeometry(.092,.009,6,24),metal,2.36,.77,0);ring.rotation.y=Math.PI/2;
   for(let i=0;i<3;i++){const a=i*2*Math.PI/3;line([[2.37,.77,0],[2.37,.77+Math.cos(a)*.085,Math.sin(a)*.085]],metal,.007);}
   for(const s of [-1,1]){box(2.28,.79,s*.68,.055,.16,.31,lamp);box(2.30,.46,s*.60,.04,.15,.34,black);}
   box(2.30,.45,0,.035,.16,.65,black);
  }
 }
 for(const s of [-1,1]){box(0,.40,s*(W+.025),2.0,.095,.05,paint);for(const z of [.53,.70]){const e=mesh(new T.CylinderGeometry(.035,.035,.13,16),metal,-L-.04,.32,s*z);e.rotation.z=Math.PI/2;}}
 const wheels=[];
 for(const x of [front,back])for(const s of [-1,1]){
  const w=new T.Group();w.position.set(x,.335,s*(W-.04));car.add(w);wheels.push(w);
  const tire=mesh(new T.CylinderGeometry(.335,.335,.25,32),black,0,0,0,w);tire.rotation.x=Math.PI/2;
  mesh(new T.TorusGeometry(.259,.012,6,36),metal,0,0,s*.132,w);
  const disk=mesh(new T.CylinderGeometry(.211,.211,.02,24),metal,0,0,s*.12,w);disk.rotation.x=Math.PI/2;
  const inner=mesh(new T.CylinderGeometry(.245,.245,.01,24),black,0,0,s*.132,w);inner.rotation.x=Math.PI/2;
  for(let i=0;i<10;i++){const a=i*Math.PI/5;const spoke=box(Math.cos(a)*.145,Math.sin(a)*.145,s*.145,.20,.018,.016,metal,w);spoke.rotation.z=a;}
  const hub=mesh(new T.CylinderGeometry(.054,.054,.03,20),metal,0,0,s*.15,w);hub.rotation.x=Math.PI/2;
 }
 car.userData={wheels,kind,setBrake(v){rear.emissiveIntensity=v?3:.65;}};return car;
}
