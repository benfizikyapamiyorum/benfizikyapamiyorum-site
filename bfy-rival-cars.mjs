import * as T from './bfy-three.module.min.js';
// Original game meshes, informed by the silhouette and characteristic lights of each car.
export function createRival(kind){
 const car=new T.Group(),sport=kind==='porsche',bmw=kind==='bmw';
 const color=sport?'#eac54a':bmw?'#286da9':'#bbc3c6';
 const paint=new T.MeshPhysicalMaterial({color,metalness:.45,roughness:.20,clearcoat:1,clearcoatRoughness:.12});
 const black=new T.MeshStandardMaterial({color:'#111820',roughness:.65});
 const glass=new T.MeshPhysicalMaterial({color:'#162b38',metalness:.35,roughness:.08,clearcoat:1});
 const metal=new T.MeshStandardMaterial({color:'#bdc8cd',metalness:.9,roughness:.21});
 const lamp=new T.MeshStandardMaterial({color:'#fff6dc',emissive:'#fff0cc',emissiveIntensity:1.7});
 const rear=new T.MeshStandardMaterial({color:'#a71818',emissive:'#ff2424',emissiveIntensity:.65});
 const mesh=(g,m,x=0,y=0,z=0,p=car)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;};
 const box=(x,y,z,w,h,d,m,p=car)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,p);
 const panel=(pts,m)=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts.flat(),3));const idx=[];for(let i=1;i<pts.length-1;i++)idx.push(0,i,i+1);g.setIndex(idx);g.computeVertexNormals();const mat=m.clone();mat.side=T.DoubleSide;if(pts.every(v=>v[0]<-2))g.translate(-.025,0,0);return mesh(g,mat);};
 const line=(pts,m,r=.012)=>{const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(c,24,r,6,false),m);};
 const L=sport?2.21:2.30,W=sport?.94:.90,front=sport?1.24:1.36,back=sport?-1.23:-1.33;
 const shape=new T.Shape();shape.moveTo(-L,.39);shape.lineTo(back-.37,.39);shape.absarc(back,.34,.37,Math.PI,0,true);shape.lineTo(front-.37,.34);shape.absarc(front,.34,.37,Math.PI,0,true);shape.lineTo(L,.40);shape.lineTo(L,sport?.62:.73);shape.quadraticCurveTo(L-.3,sport?.77:.92,.75,sport?.86:.96);shape.lineTo(-1.1,sport?.91:1);shape.quadraticCurveTo(-L,sport?.92:1,-L,.70);shape.closePath();
 const g=new T.ExtrudeGeometry(shape,{depth:W*2-.08,bevelEnabled:true,bevelThickness:.065,bevelSize:.055,bevelSegments:5,curveSegments:20});g.translate(0,0,-W+.04);
 const pos=g.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);let z=pos.getZ(i);const taper=1-Math.max(0,Math.abs(x)-1.55)*(sport?.21:.14);pos.setZ(i,z*taper);if(x>1.6)pos.setX(i,x-.09*Math.min(1,(x-1.6)/.6));if(x< -1.7)pos.setX(i,x+.08*Math.min(1,(-x-1.7)/.55));if(sport&&y>.72)pos.setY(i,y-.04*Math.max(0,x-.45));}g.computeVertexNormals();mesh(g,paint);
 box(0,.31,0,3.9,.16,1.6,black);
 if(sport){
  // 997: curved fastback, separate oval lamps, low central bonnet and broad rear hips.

  const roofCurve=new T.CatmullRomCurve3([new T.Vector3(-1.63,.92,.72),new T.Vector3(-1.08,1.12,.68),new T.Vector3(-.66,1.32,.61),new T.Vector3(-.07,1.34,.61),new T.Vector3(.37,1.24,.65),new T.Vector3(.87,.90,.76)]);
  const cabin=new T.BufferGeometry(),rp=[],ri=[];for(let i=0;i<=36;i++){const v=roofCurve.getPoint(i/36);for(let j=0;j<=20;j++){const z=(j/20*2-1)*v.z;rp.push(v.x,v.y+.045*(1-(z/v.z)**2),z);}if(i<36)for(let j=0;j<20;j++){const k=i*21+j;ri.push(k,k+1,k+21,k+1,k+22,k+21);}}cabin.setAttribute('position',new T.Float32BufferAttribute(rp,3));cabin.setIndex(ri);cabin.computeVertexNormals();for(let i=0;i<36;i++){const x=roofCurve.getPoint((i+.5)/36).x;cabin.addGroup(i*120,120,x>.32||x<-.72?1:0);}mesh(cabin,[paint,glass]);


  for(const s of [-1,1]){
   panel([[-1.34,.95,s*.77],[-.82,1.22,s*.66],[-.55,1.30,s*.62],[.30,1.27,s*.65],[.78,.94,s*.79]],glass);
   line([[-1.34,.95,s*.78],[-.82,1.24,s*.67],[-.55,1.32,s*.63],[.30,1.29,s*.66],[.80,.94,s*.80]],black,.018);
   line([[-.88,.96,s*.79],[-.54,1.30,s*.63]],paint,.027);line([[-.86,.48,s*.95],[-.86,.92,s*.85],[.67,.91,s*.86],[.72,.48,s*.94]],black,.003);
   box(.02,.89,s*.92,.18,.025,.025,paint);box(.70,1.02,s*.95,.19,.10,.18,paint);
   const fender=mesh(new T.SphereGeometry(1,32,16),paint,1.35,.70,s*.70);fender.scale.set(.88,.24,.26);
   const hip=mesh(new T.SphereGeometry(1,32,16),paint,-1.30,.73,s*.72);hip.scale.set(.72,.23,.25);
   const shoulder=mesh(new T.SphereGeometry(1,28,18),paint,1.70,.72,s*.68);shoulder.scale.set(.45,.21,.24);const h=mesh(new T.SphereGeometry(1,28,18),black,1.91,.907,s*.68);h.scale.set(.018,.125,.145);h.rotation.z=.85;
   const lens=mesh(new T.SphereGeometry(1,28,18),lamp,1.923,.922,s*.68);lens.scale.set(.009,.112,.132);lens.rotation.z=.85;
   const rearShape=[[-2.175,.70,s*.82],[-2.175,.86,s*.68],[-2.175,.84,s*.40],[-2.175,.73,s*.39]];panel(rearShape,rear);line([[-2.19,.754,s*.43],[-2.19,.77,s*.74]],lamp,.008);
   box(2.17,.43,s*.62,.045,.14,.36,black);box(2.18,.60,s*.64,.035,.027,.35,lamp);
  }
  const bonnet=new T.PlaneGeometry(1.40,1.0,20,16).rotateX(-Math.PI/2),bp=bonnet.attributes.position;for(let i=0;i<bp.count;i++){const x=bp.getX(i)+1.50,z=bp.getZ(i);bp.setXYZ(i,x,.88-(x-.80)*.145+.025*(1-(z/.5)**2),z);}bonnet.computeVertexNormals();mesh(bonnet,paint);
  for(const s of [-1,1])line([[.86,.89,s*.49],[1.65,.78,s*.46],[2.09,.70,s*.36]],black,.0028);
  box(2.20,.40,0,.03,.12,.65,black);box(-1.98,.995,0,.20,.045,1.47,paint);
  for(let i=0;i<9;i++)box(-1.72+i*.043,.98,0,.018,.009,1.0,black);
 }else{
  const rearX=bmw?-1.28:-1.37,roofBack=bmw?-.73:-.82,roofFront=.40,frontX=1.0,roofY=1.42;
  panel([[frontX,.98,-.84],[roofFront,roofY,-.68],[roofFront,roofY,.68],[frontX,.98,.84]],glass);
  panel([[rearX,.98,.83],[roofBack,roofY,.69],[roofBack,roofY,-.69],[rearX,.98,-.83]],glass);
  const roof=box((roofBack+roofFront)/2,roofY+.015,0,roofFront-roofBack,.045,1.39,bmw?black:paint);
  for(const s of [-1,1]){
   panel([[rearX,.99,s*.85],[roofBack,roofY,s*.69],[roofFront,roofY,s*.69],[frontX,.99,s*.85]],glass);
   line([[rearX,.99,s*.86],[roofBack,roofY+.015,s*.71],[roofFront,roofY+.015,s*.71],[frontX,.99,s*.86]],paint,.033);
   line([[-.30,1.01,s*.86],[-.30,1.43,s*.70]],black,.028);
   line([[rearX,.99,s*.86],[frontX,.99,s*.86]],metal,.012);
   box(.88,1.10,s*.96,.20,.10,.16,paint);
   box(-.27,.91,s*.914,.17,.026,.02,metal);
   if(!bmw){box(-1.04,.91,s*.914,.16,.026,.02,metal);line([[-.50,.46,s*.92],[-.50,.97,s*.92]],black,.003);}
   panel([[-2.31,.69,s*.82],[-2.31,.87,s*.82],[-2.31,.84,s*.40],[-2.31,.75,s*.34]],rear);line([[-2.325,.73,s*.78],[-2.325,.73,s*.43],[-2.325,.81,s*.43]],lamp,.008);
  }
  if(bmw){
   for(const s of [-1,1]){box(2.30,.77,s*.20,.03,.20,.30,metal);box(2.32,.77,s*.20,.03,.16,.25,black);for(let k=0;k<6;k++)box(2.34,.77,s*.20-.10+k*.04,.01,.15,.008,metal);box(2.29,.79,s*.64,.045,.20,.46,black);for(const z of [.53,.74]){const h=mesh(new T.CircleGeometry(.059,24),lamp,2.315,.79,s*z);h.rotation.y=Math.PI/2;const ring=mesh(new T.TorusGeometry(.078,.009,8,32),lamp,2.321,.79,s*z);ring.rotation.y=Math.PI/2;}}
   box(2.32,.46,0,.04,.16,1.40,black);const dome=mesh(new T.SphereGeometry(1,32,16),paint,1.27,.965,0);dome.scale.set(.66,.065,.28);for(const side of [-1,1]){box(1.35,.973,side*.43,.34,.014,.10,black);box(2.33,.46,side*.44,.025,.17,.045,paint);}box(-2.24,1.015,0,.14,.045,1.52,paint);
   for(const s of [-1,1]){box(.91,.87,s*.925,.22,.05,.01,black);for(let i=0;i<3;i++)box(.84+i*.06,.87,s*.936,.01,.045,.01,metal);}
  }else{
   box(2.30,.76,0,.03,.28,.95,metal);box(2.32,.76,0,.03,.23,.88,black);for(let i=0;i<3;i++)box(2.34,.68+i*.075,0,.015,.012,.86,metal);
   const ring=mesh(new T.TorusGeometry(.092,.009,6,24),metal,2.36,.77,0);ring.rotation.y=Math.PI/2;
   for(let i=0;i<3;i++){const a=i*2*Math.PI/3;line([[2.37,.77,0],[2.37,.77+Math.cos(a)*.085,Math.sin(a)*.085]],metal,.007);}
   for(const s of [-1,1]){box(2.29,.79,s*.68,.045,.20,.36,black);for(const z of [.59,.76]){const lens=mesh(new T.CircleGeometry(.062,24),lamp,2.32,.79,s*z);lens.rotation.y=Math.PI/2;}line([[2.33,.706,s*.53],[2.28,.73,s*.83]],lamp,.008);box(2.30,.46,s*.60,.04,.15,.34,black);}
   box(2.30,.45,0,.035,.16,.65,black);
  }
 }
 if(!sport){const hood=new T.PlaneGeometry(1.30,1.42,18,18).rotateX(-Math.PI/2),hp=hood.attributes.position;for(let i=0;i<hp.count;i++){const x=hp.getX(i)+1.64,z=hp.getZ(i);hp.setXYZ(i,x,1.0-(x-.99)*.17+.025*(1-(z/.71)**2),z);}hood.computeVertexNormals();mesh(hood,paint);for(const s of [-1,1])line([[1.02,.998,s*.57],[1.75,.875,s*.56],[2.24,.79,s*.49]],black,.003);}
 function badge(text,x,y,width){const c=document.createElement('canvas');c.width=512;c.height=96;const q=c.getContext('2d');q.font='600 56px Arial';q.textAlign='center';q.fillStyle='#e4e8e7';q.fillText(text,256,68);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const o=mesh(new T.PlaneGeometry(width,.068),new T.MeshStandardMaterial({map:t,transparent:true,metalness:.5,roughness:.3}),x,y,0);o.rotation.y=-Math.PI/2;}
 badge(sport?'C a r r e r a':bmw?'M3':'C 63 AMG',-L-.065,sport?.91:.98,sport?.61:.46);
 const pc=document.createElement('canvas');pc.width=512;pc.height=128;const pq=pc.getContext('2d');pq.fillStyle='#e9e9e2';pq.fillRect(0,0,512,128);pq.fillStyle='#1c2530';pq.font='bold 74px Arial';pq.textAlign='center';pq.fillText(sport?'54 BFY 911':bmw?'54 BFY M3':'54 BFY 63',256,91);const pt=new T.CanvasTexture(pc);pt.colorSpace=T.SRGBColorSpace;const pm=new T.MeshStandardMaterial({map:pt,roughness:.5});for(const side of [-1,1]){const plate=mesh(new T.PlaneGeometry(.47,.118),pm,side*(L+.069),.55,0);plate.rotation.y=side*Math.PI/2;}
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
