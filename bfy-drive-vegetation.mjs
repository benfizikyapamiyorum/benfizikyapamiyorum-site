import * as T from './bfy-three.module.min.js';

// One shared tree, a bounded near pool and one baked distant silhouette.
// No per-tree meshes, per-frame geometry allocation or real-time foliage shadows.
export function createTreeGeometry(){
 let seed=548;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 const p=[],n=[],uv=[],index=[],wood=[];
 const branch=(a,b,r1,r2)=>{const d=new T.Vector3().subVectors(b,a),g=new T.CylinderGeometry(r2,r1,d.length(),6,1);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize()));g.translate(...a.clone().add(b).multiplyScalar(.5).toArray());wood.push(g.toNonIndexed());g.dispose();};
 branch(new T.Vector3(),new T.Vector3(.12,4.9,.05),.24,.055);
 const normal=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),center=new T.Vector3(),v=new T.Vector3();
 for(let cluster=0;cluster<15;cluster++){
  const angle=cluster*2.4,spread=cluster<11?1.55: .65,cy=cluster<11?3.8+(cluster%4)*.65:6.0;
  const tip=new T.Vector3(Math.cos(angle)*spread,cy,Math.sin(angle)*spread);
  branch(new T.Vector3(.07,2.3+cluster*.14,0),tip,.065,.012);
  for(let leaf=0;leaf<22;leaf++){
   const az=random()*Math.PI*2,r=Math.sqrt(random()),height=(random()-.5)*1.5;
   center.copy(tip).add(new T.Vector3(Math.cos(az)*r*1.35,height,Math.sin(az)*r*1.35));
   normal.set(random()-.5,.15+random()*.75,random()-.5).normalize();right.crossVectors(normal,new T.Vector3(0,0,1)).normalize();up.crossVectors(right,normal).normalize();
   const size=.38+random()*.25,wide=size*.50,base=p.length/3,slot=Math.floor(random()*5),x0=[.015,.177,.352,.515,.67][slot],x1=[.155,.34,.491,.653,.823][slot];
   for(const [sx,sy]of[[-1,-1],[1,-1],[-1,1],[1,1]]){v.copy(center).addScaledVector(right,sx*wide).addScaledVector(up,sy*size);p.push(v.x,v.y,v.z);n.push(normal.x,normal.y,normal.z);uv.push(sx<0?x0:x1,sy<0?.49:.985);}
   index.push(base,base+1,base+2,base+1,base+3,base+2);
  }
 }
 const foliage=new T.BufferGeometry();foliage.setAttribute('position',new T.Float32BufferAttribute(p,3));foliage.setAttribute('normal',new T.Float32BufferAttribute(n,3));foliage.setAttribute('uv',new T.Float32BufferAttribute(uv,2));foliage.setIndex(index);foliage.computeBoundingSphere();
 const trunk=new T.BufferGeometry();for(const key of ['position','normal','uv']){const size=wood[0].attributes[key].itemSize,data=new Float32Array(wood.reduce((s,g)=>s+g.attributes[key].array.length,0));let offset=0;for(const g of wood){data.set(g.attributes[key].array,offset);offset+=g.attributes[key].array.length;}trunk.setAttribute(key,new T.BufferAttribute(data,size));}wood.forEach(g=>g.dispose());trunk.computeBoundingSphere();return{foliage,trunk};
}

export class Vegetation{
 constructor(scene,positions){
  this.scene=scene;this.positions=positions.map(p=>({...p,distance:0}));this.limit=16;this.last=-Infinity;this.dummy=new T.Object3D();this.group=new T.Group();scene.add(this.group);this.resources=[];this.meshes=[];this.ready=false;this.disposed=false;
 }
 async load(renderer){
  const loader=new T.TextureLoader(),loaded=await Promise.allSettled(['bfy-leaves-color.jpg','bfy-leaves-alpha.jpg','bfy-bark-color.jpg'].map(f=>loader.loadAsync(f)));
  const maps=loaded.map(r=>r.status==='fulfilled'?r.value:null);if(this.disposed){maps.forEach(t=>t?.dispose());return;}this.resources.push(...maps.filter(Boolean));
  const [color,loadedAlpha,bark]=maps;let alpha=loadedAlpha;
  if(!alpha){const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d');q.fillStyle='#000';q.fillRect(0,0,128,128);q.fillStyle='#fff';for(const x of [.085,.258,.421,.584,.746]){q.beginPath();q.ellipse(x*128,33,8,29,0,0,Math.PI*2);q.fill();}alpha=new T.CanvasTexture(c);this.resources.push(alpha);}
 if(color)color.colorSpace=T.SRGBColorSpace;if(bark){bark.colorSpace=T.SRGBColorSpace;bark.wrapS=bark.wrapT=T.RepeatWrapping;bark.repeat.set(2,3);}
  const geometry=createTreeGeometry();
  const leafMat=new T.MeshLambertMaterial({map:color,alphaMap:alpha,alphaTest:.45,side:T.DoubleSide,color:color?'#b7c092':'#52643a',emissive:'#526b30',emissiveIntensity:.35});
  const barkMat=new T.MeshStandardMaterial({map:bark,color:'#a6a093',roughness:1});
  // Bake once, outside the animation loop. Far trees use just two triangles each.
  const bakeScene=new T.Scene(),tree=new T.Group();tree.add(new T.Mesh(geometry.foliage,leafMat),new T.Mesh(geometry.trunk,barkMat));bakeScene.add(tree,new T.HemisphereLight('#d7e1dc','#50563a',2));
  const sun=new T.DirectionalLight('#fff0d6',2.1);sun.position.set(-5,8,5);bakeScene.add(sun);
  const camera=new T.OrthographicCamera(-3.7,3.7,4,-4,.1,30);camera.position.set(0,3.5,15);camera.lookAt(0,3.5,0);
  const target=new T.WebGLRenderTarget(512,512,{depthBuffer:true});const oldTarget=renderer.getRenderTarget(),oldColor=renderer.getClearColor(new T.Color()),oldAlpha=renderer.getClearAlpha(),oldTone=renderer.toneMapping;
  try{renderer.setRenderTarget(target);renderer.setClearColor(0,0);renderer.toneMapping=T.NoToneMapping;renderer.clear();renderer.render(bakeScene,camera);}finally{renderer.setRenderTarget(oldTarget);renderer.setClearColor(oldColor,oldAlpha);renderer.toneMapping=oldTone;}
  const farMat=new T.MeshBasicMaterial({map:target.texture,alphaTest:.35,side:T.DoubleSide,color:'#ffffff'});
  const farGeo=new T.PlaneGeometry(7.4,8).translate(0,3.5,0);
  this.nearLeaf=new T.InstancedMesh(geometry.foliage,leafMat,16);this.nearWood=new T.InstancedMesh(geometry.trunk,barkMat,16);this.far=new T.InstancedMesh(farGeo,farMat,this.positions.length);
  this.meshes=[this.nearLeaf,this.nearWood,this.far];for(const mesh of this.meshes){mesh.frustumCulled=false;mesh.count=0;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);this.group.add(mesh);}this.resources.push(geometry.foliage,geometry.trunk,leafMat,barkMat,farMat,farGeo,target);this.ready=true;
 }
 setQuality(high){this.limit=high?16:8;this.last=-Infinity;}
 theme(night){this.far?.material.color.set(night?'#35404f':'#ffffff');if(this.nearLeaf)this.nearLeaf.material.emissiveIntensity=night?.015:.35;}
 update(camera,now){
  if(!this.ready||now-this.last<180)return;this.last=now;
  const cx=camera.position.x,cz=camera.position.z;
  for(const p of this.positions)p.distance=(p.x-cx)**2+(p.z-cz)**2;this.positions.sort((a,b)=>a.distance-b.distance);
  let near=0,far=0;const d=this.dummy;
  for(const p of this.positions){if(p.distance>650*650)break;const close=p.distance<85*85&&near<this.limit;d.position.set(p.x,-.10,p.z);d.scale.set(p.scale,p.scale,p.scale);d.rotation.set(0,close?p.angle:Math.atan2(cx-p.x,cz-p.z),0);d.updateMatrix();if(close){this.nearLeaf.setMatrixAt(near,d.matrix);this.nearWood.setMatrixAt(near++,d.matrix);}else this.far.setMatrixAt(far++,d.matrix);}
  this.nearLeaf.count=this.nearWood.count=near;this.far.count=far;for(const m of this.meshes)m.instanceMatrix.needsUpdate=true;
 }
 dispose(){this.disposed=true;this.scene.remove(this.group);this.resources.forEach(r=>r.dispose());this.resources.length=0;}
}
