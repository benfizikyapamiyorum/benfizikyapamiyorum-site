import {batchStaticMeshes} from './bfy-mesh-batch.mjs';
import * as T from './bfy-three.module.min.js';
// Original geometry; proportions checked against front, side and rear Şahin photographs. +X is forward.
export function createSahin({color='#cfd1ca',plate='54 BFY 54'}={}){
  const car=new T.Group(),body=new T.Group();car.add(body);body.position.y=-.085;
  const paint=new T.MeshPhysicalMaterial({color,metalness:.08,roughness:.22,clearcoat:1,clearcoatRoughness:.09,envMapIntensity:1.15});
  const black=new T.MeshStandardMaterial({color:'#15181b',roughness:.67});
  const rubber=new T.MeshStandardMaterial({color:'#101113',roughness:.88});
  const chrome=new T.MeshStandardMaterial({color:'#d4d9d9',metalness:.94,roughness:.17});
  const trim=new T.MeshStandardMaterial({color:'#363c40',metalness:.55,roughness:.4});
  const glass=new T.MeshPhysicalMaterial({color:'#718383',metalness:0,roughness:.08,ior:1.52,envMapIntensity:1.4,clearcoat:1,transparent:true,opacity:.64,depthWrite:false,side:T.DoubleSide});
  const lamp=new T.MeshPhysicalMaterial({color:'#f4eed9',metalness:.15,roughness:.19,clearcoat:1,emissive:'#fff0c5',emissiveIntensity:.13});
  const amber=new T.MeshStandardMaterial({color:'#e89d2e',roughness:.22,metalness:.2,emissive:'#b45c03',emissiveIntensity:.16});
  const red=new T.MeshStandardMaterial({color:'#a71716',roughness:.21,emissive:'#c62a17',emissiveIntensity:.18});
  const mesh=(parent,g,m,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
  // Small rolled edges catch the environment without a subdivision modifier.
  const box=(p,x,y,z,w,h,d,m)=>{let g=new T.BoxGeometry(w,h,d);if((m===paint||m===black)&&Math.min(w,h,d)>.045){g.dispose();g=new T.BoxGeometry(w,h,d,3,3,3);const a=g.attributes.position,r=Math.min(w,h,d)*.16,core=new T.Vector3(w/2-r,h/2-r,d/2-r),v=new T.Vector3(),c=new T.Vector3();for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i);c.set(T.MathUtils.clamp(v.x,-core.x,core.x),T.MathUtils.clamp(v.y,-core.y,core.y),T.MathUtils.clamp(v.z,-core.z,core.z));v.sub(c).normalize().multiplyScalar(r).add(c);a.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();}return mesh(p,g,m,x,y,z);};
  const poly=(p,pts,m)=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts.flat(),3));const idx=[];for(let i=1;i<pts.length-1;i++)idx.push(0,i,i+1);g.setIndex(idx);g.computeVertexNormals();return mesh(p,g,m);};
  const tube=(p,pts,m,r=.008)=>{const path=new T.CurvePath();for(let i=1;i<pts.length;i++)path.add(new T.LineCurve3(new T.Vector3(...pts[i-1]),new T.Vector3(...pts[i])));return mesh(p,new T.TubeGeometry(path,Math.max(8,pts.length*5),r,6,false),m);};
  // Continuous lower shell, with actual wheel openings (not discs painted on a box).
  const shape=new T.Shape();shape.moveTo(-2.09,.42);shape.lineTo(-1.57,.42);shape.lineTo(-1.57,.32);shape.absarc(-1.21,.32,.36,Math.PI,0,true);shape.lineTo(-.85,.37);shape.lineTo(.91,.37);shape.lineTo(.91,.32);shape.absarc(1.27,.32,.36,Math.PI,0,true);shape.lineTo(1.63,.42);shape.lineTo(2.12,.42);shape.lineTo(2.12,.88);shape.lineTo(.78,.985);shape.lineTo(-1.35,1.01);shape.lineTo(-2.1,.93);shape.closePath();
  const shell=new T.ExtrudeGeometry(shape,{depth:1.62,bevelEnabled:true,bevelSize:.025,bevelThickness:.022,bevelSegments:4,curveSegments:28,steps:1});shell.translate(0,0,-.81);
  const shellP=shell.attributes.position;for(let i=0;i<shellP.count;i++){const x=shellP.getX(i),y=shellP.getY(i),z=shellP.getZ(i);const end=Math.max(0,(Math.abs(x)-1.92)/.22);const tuck=y<.5?(.5-y)*.12:y>.87?(y-.87)*.24:0;shellP.setZ(i,z*(1-tuck-end*.025));}shell.computeVertexNormals();mesh(body,shell,paint);
  box(body,0,.38,0,3.70,.12,1.35,black);
  // Tapered cabin with separate door glass, B pillars, and painted C pillars.
  const cabinPoints=[[-1.57,.985],[.80,.965],[.23,1.46],[-.93,1.46]];
  const windowPoints=[[[-.30,1.045],[.652,1.045],[.191,1.405],[-.30,1.405]],[[-1.202,1.045],[-.385,1.045],[-.385,1.405],[-.89,1.405]]];
  const sideZ=(y,side)=>side*(.795-(y-.98)*.27);
  for(const side of [-1,1]){
    const sh=new T.Shape();cabinPoints.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();
    windowPoints.forEach(ps=>{const hole=new T.Path();[...ps].reverse().forEach(([x,y],i)=>i?hole.lineTo(x,y):hole.moveTo(x,y));hole.closePath();sh.holes.push(hole);});
    const g=new T.ShapeGeometry(sh);const pos=g.attributes.position;for(let i=0;i<pos.count;i++)pos.setZ(i,sideZ(pos.getY(i),side));g.computeVertexNormals();const sidePaint=paint.clone();sidePaint.side=T.DoubleSide;mesh(body,g,sidePaint);
    windowPoints.forEach(ps=>{const pts=ps.map(([x,y])=>[x,y,sideZ(y,side)+side*.002]);poly(body,pts,glass);tube(body,[...pts,pts[0]],black,.013);});
    tube(body,[[-1.035,1.055,sideZ(1.055,side)+side*.005],[-.805,1.396,sideZ(1.396,side)+side*.005]],black,.009);

    if(side===1)tube(body,[[-1.79,.76,.837],[-1.56,.76,.837],[-1.56,.89,.837],[-1.79,.89,.837],[-1.79,.76,.837]],trim,.0025);
    // Door seams and rub strips follow the real four-door proportions.
    for(const x of [-1.29,-.345,.76])tube(body,[[x,.47,side*.832],[x,.86,side*.833],[x===.76?.77:x,1.005,side*.802]],trim,.004);
    for(const [x,len]of[[-1.78,.46],[-.19,1.91],[1.87,.46]])box(body,x,.64,side*.843,len,.058,.032,black);
    tube(body,[[-.8,.40,side*.83],[.85,.40,side*.83]],black,.017);
    for(const x of [-1.06,-.20]){box(body,x,.91,side*.838,.16,.055,.025,black);box(body,x+.012,.918,side*.854,.106,.018,.012,trim);}
    box(body,1.66,.806,side*.837,.085,.045,.015,amber);
    // Stock-shaped mirrors on short black stems.
    box(body,.62,1.06,side*.84,.10,.06,.16,black);
    const mirror=box(body,.62,1.09,side*.954,.21,.12,.14,paint);mirror.rotation.y=side*.12;
    box(body,.52,1.095,side*.955,.012,.083,.115,chrome);
    // Polished wheel arch edge, kept narrow like the stamped fender.
    for(const x of [-1.21,1.27]){const arc=[];for(let j=0;j<=32;j++){const a=Math.PI-j/32*Math.PI;arc.push([x+Math.cos(a)*.367,.32+Math.sin(a)*.367,side*.837]);}tube(body,arc,paint,.014);}
  }
  const frontGlass=[[.775,.985,-.772],[.775,.985,.772],[.225,1.445,.665],[.225,1.445,-.665]];
  const rearGlass=[[-1.50,1.004,.772],[-1.50,1.004,-.772],[-.925,1.445,-.665],[-.925,1.445,.665]];
  for(const pts of [frontGlass,rearGlass]){poly(body,pts,glass);tube(body,[...pts,pts[0]],black,.018);}
  const heater=new T.MeshStandardMaterial({color:'#645848',roughness:.65,transparent:true,opacity:.5});
  for(let i=1;i<8;i++){const t=i/9,y=1.004+.441*t,x=-1.50+.575*t,width=.772-.107*t;tube(body,[[x+.002,y,-width*.94],[x+.002,y,width*.94]],heater,.0015);}
  const roofG=new T.PlaneGeometry(1.18,1.34,16,20);roofG.rotateX(-Math.PI/2);
  const roofPos=roofG.attributes.position;for(let i=0;i<roofPos.count;i++){const x=roofPos.getX(i),z=roofPos.getZ(i);roofPos.setY(i,1.468+.024*(1-(x/.59)**2)*(1-(z/.67)**2));roofPos.setX(i,x-.35);}roofG.computeVertexNormals();mesh(body,roofG,paint);
  for(const side of [-1,1])tube(body,[[-1.55,1.012,side*.81],[-.935,1.467,side*.69],[.235,1.467,side*.69],[.80,.984,side*.81]],chrome,.007);
  // Dashboard, seats and steering wheel visible through the dark glass.
  box(body,.51,1.015,0,.32,.10,1.32,black);
  for(const z of [-.39,.39]){box(body,-.14,.92,z,.44,.12,.47,black);const seat=box(body,-.36,1.12,z,.11,.40,.45,black);seat.rotation.z=-.12;box(body,-.36,1.34,z,.12,.13,.26,black);}
  box(body,-.93,1.02,0,.29,.25,1.25,black);
  const steering=mesh(body,new T.TorusGeometry(.13,.015,7,24),black,.36,1.13,-.4);steering.rotation.y=Math.PI/2;steering.rotation.z=-.25;
  // Resting wipers, slotted scuttle and a very shallow stamped bonnet crown.
  for(const z of [-.34,.23])tube(body,[[.767,1.004,z],[.714,1.055,z-.30]],black,.007);
  for(let k=0;k<25;k++)box(body,.81,.997,-.57+k*.047,.055,.004,.006,black);
  const hood=new T.PlaneGeometry(1.25,1.40,24,24);hood.rotateX(-Math.PI/2);const hp=hood.attributes.position;
  for(let i=0;i<hp.count;i++){const local=hp.getX(i),z=hp.getZ(i),x=local+1.445;hp.setX(i,x);hp.setY(i,.985-(x-.78)*.078+.006+.015*(1-(z/.70)**2)*(1-(local/.625)**2));}hood.computeVertexNormals();mesh(body,hood,paint);
  for(const side of [-1,1])tube(body,[[.84,.99,side*.704],[1.93,.906,side*.704],[2.07,.895,side*.67]],trim,.002);
  tube(body,[[2.075,.891,-.67],[2.075,.891,.67]],trim,.002);
  // Thick black bumpers and a modest lowered front lip.
  function bumper(x,y,front){const sh=new T.Shape();sh.moveTo(-.81,-.09);sh.lineTo(.81,-.09);sh.quadraticCurveTo(.858,-.09,.86,-.035);sh.lineTo(.86,.055);sh.quadraticCurveTo(.858,.09,.79,.09);sh.lineTo(-.79,.09);sh.quadraticCurveTo(-.858,.09,-.86,.055);sh.lineTo(-.86,-.035);sh.quadraticCurveTo(-.858,-.09,-.81,-.09);const g=new T.ExtrudeGeometry(sh,{depth:.13,bevelEnabled:true,bevelSize:.013,bevelThickness:.012,bevelSegments:3,steps:1});g.rotateY(Math.PI/2);g.scale(1,.78,1);g.translate(x,y,0);mesh(body,g,black);for(const side of [-1,1])box(body,x-(front?.12:-.12),y,side*.81,.21,.14,.045,black);}
  bumper(2.105,.525,true);bumper(-2.23,.515,false);
  box(body,2.11,.375,0,.16,.028,1.60,black);box(body,-2.09,.405,0,.10,.07,1.54,paint);
  for(const x of [-2.25,2.26])box(body,x,.55,0,.008,.010,1.51,trim);
  // Front valance with recessed fog lights and cooling slots.
  box(body,2.10,.408,0,.07,.075,1.45,paint);
  for(const side of [-1,1]){box(body,2.14,.411,side*.55,.025,.057,.19,black);box(body,2.156,.411,side*.55,.009,.036,.135,lamp);}
  for(let i=0;i<4;i++)box(body,2.145,.385+i*.016,0,.01,.005,.48,black);
  // Rectangular headlamps, corner amber indicators and horizontal grille slats.
  box(body,2.135,.765,0,.027,.245,1.52,black);
  const lensCanvas=document.createElement('canvas');lensCanvas.width=512;lensCanvas.height=256;const lc=lensCanvas.getContext('2d');const lg=lc.createLinearGradient(0,0,0,256);lg.addColorStop(0,'#778b96');lg.addColorStop(.16,'#e4e9e5');lg.addColorStop(.42,'#b2bfc1');lg.addColorStop(.58,'#d5ddda');lg.addColorStop(.8,'#9baeb5');lg.addColorStop(1,'#e5eae4');lc.fillStyle=lg;lc.fillRect(0,0,512,256);for(const [pts,col]of [[[[14,14],[498,14],[390,80],[120,80]],'#f2f4eebb'],[[[14,242],[498,242],[390,170],[120,170]],'#eef2edaa'],[[[14,14],[14,242],[120,170],[120,80]],'#71858c66'],[[[498,14],[498,242],[390,170],[390,80]],'#71858c66']]){lc.fillStyle=col;lc.beginPath();pts.forEach(([x,y],i)=>i?lc.lineTo(x,y):lc.moveTo(x,y));lc.closePath();lc.fill();}lc.fillStyle='#d9e1db';lc.fillRect(190,90,130,65);for(let k=0;k<52;k++){lc.fillStyle=k%2?'#ffffff20':'#10182022';lc.fillRect(k*10,0,2,256);}for(let k=0;k<10;k++){lc.fillStyle='#ffffff25';lc.fillRect(0,k*26,512,1);}const lensTex=new T.CanvasTexture(lensCanvas);lensTex.colorSpace=T.SRGBColorSpace;lensTex.anisotropy=8;const lensMat=new T.MeshPhysicalMaterial({map:lensTex,bumpMap:lensTex,bumpScale:.003,roughness:.14,metalness:.14,clearcoat:1,emissive:'#fff0c5',emissiveIntensity:0});
  red.map=lensTex;red.roughness=.16;red.emissiveIntensity=.07;amber.map=lensTex;
  for(const side of [-1,1]){
    box(body,2.157,.768,side*.568,.032,.221,.334,chrome);
    const lens=mesh(body,new T.PlaneGeometry(.326,.213),lensMat,2.178,.768,side*.568);lens.rotation.y=Math.PI/2;
    box(body,2.159,.768,side*.772,.034,.22,.064,amber);
    box(body,-2.123,.77,side*.57,.035,.19,.38,red);box(body,-2.145,.77,side*.748,.01,.17,.065,lamp);box(body,-2.147,.722,side*.54,.012,.068,.14,lamp);box(body,-2.148,.79,side*.40,.012,.13,.06,amber);
  }
  box(body,2.16,.763,0,.026,.21,.72,black);for(let i=0;i<5;i++)box(body,2.18,.684+i*.036,0,.014,.012,.70,trim);
  const badge=box(body,2.20,.775,0,.015,.093,.075,new T.MeshStandardMaterial({color:'#617d92',metalness:.7,roughness:.3}));
  box(body,2.21,.79,0,.005,.012,.048,chrome);box(body,2.211,.765,0,.005,.049,.012,chrome);
  // Plates are original canvas lettering, sharp at close-up distance.
  function plateTexture(){const c=document.createElement('canvas');c.width=1536;c.height=336;const q=c.getContext('2d');q.fillStyle='#f3f3e9';q.fillRect(0,0,c.width,c.height);q.strokeStyle='#202427';q.lineWidth=12;q.strokeRect(6,6,c.width-12,c.height-12);q.fillStyle='#25467d';q.fillRect(13,13,110,310);q.fillStyle='white';q.font='bold 54px Arial';q.textAlign='center';q.fillText('TR',68,275);q.fillStyle='#10161b';q.font='bold 210px Arial';q.textAlign='center';q.fillText(plate,825,247);for(const x of [160,1400]){q.fillStyle='#505659';q.beginPath();q.arc(x,36,8,0,Math.PI*2);q.fill();}const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;return tex;}
  const plateMat=new T.MeshStandardMaterial({map:plateTexture(),roughness:.5});
  for(const x of [2.269,-2.151]){const y=x>0?.525:.77;box(body,x,y,0,.018,.155,.57,black);const p=mesh(body,new T.PlaneGeometry(.525,.115),plateMat,x+(x>0?.011:-.011),y,0);p.rotation.y=x>0?Math.PI/2:-Math.PI/2;}
  function word(text,x,y,z,width){const c=document.createElement('canvas');c.width=512;c.height=96;const q=c.getContext('2d');q.font='600 58px Arial';q.textAlign='center';q.fillStyle='#d5dce2';q.fillText(text,256,67);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const o=mesh(body,new T.PlaneGeometry(width,.065),new T.MeshStandardMaterial({map:t,transparent:true,metalness:.4,roughness:.4}),x,y,z);o.rotation.y=-Math.PI/2;}
  word('ŞAHİN',-2.125,.95,-.55,.25);word('TOFAŞ',-2.125,.95,.55,.27);
  const exhaust=mesh(body,new T.CylinderGeometry(.052,.052,.24,32,1,true),chrome,-2.20,.31,.58);exhaust.rotation.z=Math.PI/2;const exhaustDark=mesh(body,new T.CircleGeometry(.043,32),black,-2.325,.31,.58);exhaustDark.rotation.y=-Math.PI/2;
  // Fine moulded tread: one shared normal-free bump texture for all four tyres.
  const tyreCanvas=document.createElement('canvas');tyreCanvas.width=tyreCanvas.height=256;const tq=tyreCanvas.getContext('2d');tq.fillStyle='#969696';tq.fillRect(0,0,256,256);tq.strokeStyle='#353535';tq.lineWidth=4;for(let j=0;j<32;j++){tq.beginPath();tq.moveTo(j*9,0);tq.lineTo(j*9-8,96);tq.lineTo(j*9+6,160);tq.lineTo(j*9-2,256);tq.stroke();}for(const y of [65,100,156,191]){tq.fillStyle='#333';tq.fillRect(0,y,256,3);}const tyreBump=new T.CanvasTexture(tyreCanvas);tyreBump.wrapS=tyreBump.wrapT=T.RepeatWrapping;rubber.bumpMap=tyreBump;rubber.bumpScale=.004;rubber.roughness=.83;
  // Deep-dish, polished five-spoke wheels with exposed rivets and a lower-profile tyre.
  const wheels=[],wheelPivots=[];
  const rimFace=new T.MeshStandardMaterial({color:'#eee9dc',metalness:.88,roughness:.20});
  for(const x of [-1.21,1.27])for(const side of [-1,1]){
    const pivot=new T.Group();pivot.position.set(x,.303,side*.805);car.add(pivot);wheelPivots.push(pivot);
    const w=new T.Group();pivot.add(w);wheels.push(w);
    const profile=[[.243,-.12],[.273,-.13],[.297,-.11],[.307,-.075],[.307,.075],[.297,.11],[.273,.13],[.243,.12]].map(([r,z])=>new T.Vector2(r,z));
    const tire=mesh(w,new T.LatheGeometry(profile,48),rubber);tire.rotation.x=Math.PI/2;
    const barrel=mesh(w,new T.CylinderGeometry(.245,.245,.24,48,1,true),chrome);barrel.rotation.x=Math.PI/2;
    const face=side*.142;
    mesh(w,new T.TorusGeometry(.239,.012,8,48),chrome,0,0,face);
    mesh(w,new T.TorusGeometry(.210,.007,6,40),chrome,0,0,face-side*.033);
    const rotor=mesh(w,new T.CylinderGeometry(.185,.185,.01,32),trim,0,0,face-side*.055);rotor.rotation.x=Math.PI/2;
    box(pivot,.156,.025,face-side*.045,.055,.14,.04,red);
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5,sp=box(w,Math.cos(a)*.137,Math.sin(a)*.137,face-side*.022,.185,.038,.022,rimFace);sp.rotation.z=a;
      const accent=box(w,Math.cos(a)*.145,Math.sin(a)*.145,face-side*.008,.151,.009,.005,chrome);accent.rotation.z=a;
    }
    const hub=mesh(w,new T.CylinderGeometry(.065,.065,.027,24),rimFace,0,0,face-side*.011);hub.rotation.x=Math.PI/2;
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5;mesh(w,new T.SphereGeometry(.008,6,4),black,Math.cos(a)*.041,Math.sin(a)*.041,face+side*.008);}
    for(let i=0;i<24;i++){const a=i*Math.PI/12;mesh(w,new T.SphereGeometry(.005,5,4),chrome,Math.cos(a)*.224,Math.sin(a)*.224,face+side*.007);}
    mesh(w,new T.TorusGeometry(.301,.003,4,40),trim,0,0,side*.092);
  }
  // Hinged boot lid, twin subwoofers and a compact original BFY amplifier.
  const boot=new T.Group();boot.position.set(-1.51,1.015,0);body.add(boot);
  const lid=box(boot,-.30,-.035,0,.60,.024,1.48,paint);lid.rotation.z=.12;
  const lining=box(boot,-.30,-.052,0,.55,.012,1.40,black);lining.rotation.z=.12;
  const soundRack=new T.Group();body.add(soundRack);
  box(soundRack,-1.77,1.033,0,.65,.055,1.38,black);
  const subwoofers=[];
  for(const z of [-.37,.37]){
    const surround=mesh(soundRack,new T.TorusGeometry(.205,.025,10,40),rubber,-1.77,1.074,z);surround.rotation.x=Math.PI/2;
    const cone=mesh(soundRack,new T.ConeGeometry(.183,.065,40,1,true),trim,-1.77,1.064,z);cone.rotation.x=Math.PI;subwoofers.push(cone);
    const cap=mesh(soundRack,new T.SphereGeometry(.068,20,10),black,-1.77,1.077,z);cap.scale.y=.32;
    const ring=mesh(soundRack,new T.TorusGeometry(.226,.005,5,48),new T.MeshBasicMaterial({color:'#d661b3'}),-1.77,1.066,z);ring.rotation.x=Math.PI/2;
  }
  box(soundRack,-1.42,1.065,0,.12,.045,.5,chrome);
  for(let k=0;k<9;k++)box(soundRack,-1.42,1.09,-.2+k*.05,.1,.005,.008,black);
  soundRack.visible=false;
  const headSpots=[];
  for(const side of [-1,1]){const light=new T.SpotLight('#fff0cb',0,48,.34,.5,1.5);light.position.set(2.22,.76,side*.57);const target=new T.Object3D();target.position.set(22,.2,side*.57);body.add(light,target);light.target=target;headSpots.push(light);}
  // Preserve the 2.48 m wheelbase, but shorten the excessive front overhang.
  // Deform each mesh in body coordinates so the lights, bumper and plate stay together.
  body.updateMatrixWorld(true);const bodyInv=body.matrixWorld.clone().invert(),point=new T.Vector3();
  body.traverse(o=>{if(!o.isMesh)return;const g=o.geometry.clone(),oldNormals=g.attributes.normal.clone(),localToBody=new T.Matrix4().multiplyMatrices(bodyInv,o.matrixWorld),back=localToBody.clone().invert(),p=g.attributes.position;
    for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i).applyMatrix4(localToBody);if(point.x>1.40)point.x=1.40+(point.x-1.40)*.71;point.applyMatrix4(back);p.setXYZ(i,point.x,point.y,point.z);}g.computeVertexNormals();const normals=g.attributes.normal;for(let i=0;i<normals.count;i++){if(Math.abs(oldNormals.getZ(i))>.995)normals.setXYZ(i,0,0,Math.sign(oldNormals.getZ(i)));}o.geometry.dispose();o.geometry=g;});
  headSpots.forEach(light=>light.position.x=2.0);
  batchStaticMeshes(car,new Set([soundRack]));
  // Keep original vertices so repairing/restarting is exact and damage never compounds.
  const dentMeshes=[];body.updateMatrixWorld(true);const damageInv=body.matrixWorld.clone().invert();
  body.traverse(o=>{if(!o.isMesh)return;const toBody=new T.Matrix4().multiplyMatrices(damageInv,o.matrixWorld);dentMeshes.push({o,base:o.geometry.attributes.position.array.slice(),normals:o.geometry.attributes.normal.array.slice(),toBody,back:toBody.clone().invert()});});
  const cracks=new T.Group();body.add(cracks);const crackMat=new T.MeshBasicMaterial({color:'#e0e8e4',transparent:true,opacity:.48});
  for(let j=0;j<7;j++){const a=j*Math.PI*2/7,pts=[];for(let k=0;k<4;k++){const r=k*.055,z=.19+Math.cos(a)*r,y=1.20+Math.sin(a)*r;pts.push([.775-(y-.985)*1.195+.009,y,z]);}tube(cracks,pts,crackMat,.0018);}cracks.visible=false;
  let damageNow=-1;
  function setDamage(amount){const d=Math.max(0,Math.min(1,amount||0));if(Math.abs(d-damageNow)<.005)return;damageNow=d;paint.roughness=.24+d*.25;cracks.visible=d>.35;
   for(const {o,base,normals,toBody,back} of dentMeshes){const attr=o.geometry.attributes.position;for(let i=0;i<attr.count;i++){point.set(base[i*3],base[i*3+1],base[i*3+2]).applyMatrix4(toBody);const front=Math.max(0,(point.x-1.25)/.8),rear=Math.max(0,(-point.x-1.8)/.5);point.x-=front*d*.22;point.x+=rear*d*.10;if(point.y>.55&&point.y<1.03)point.y-=front*d*(.07+.04*Math.sin(point.z*17));if(Math.abs(point.z)>.7&&point.y<.95)point.z*=1-d*.05*Math.max(front,rear);point.applyMatrix4(back);attr.setXYZ(i,point.x,point.y,point.z);}attr.needsUpdate=true;if(d===0){attr.array.set(base);o.geometry.attributes.normal.array.set(normals);o.geometry.attributes.normal.needsUpdate=true;}else o.geometry.computeVertexNormals();o.geometry.computeBoundingSphere();}
  }
  car.userData={wheels,wheelPivots,body,paint,boot,soundRack,subwoofers,setDamage,
    setLights(on){lamp.emissiveIntensity=on?2.5:.13;lensMat.emissiveIntensity=on?2.4:0;red.emissiveIntensity=on?1.2:.18;headSpots.forEach(light=>light.intensity=on?100:0);},
    setBoot(amount){boot.rotation.z=-amount*1.1;soundRack.visible=amount>.08;},
    pulse(value){subwoofers.forEach(cone=>cone.position.y=1.064+value*.018);}
  };
  return car;
}
