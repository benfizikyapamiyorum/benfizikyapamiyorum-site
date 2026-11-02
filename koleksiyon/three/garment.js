import * as T from '../../bfy-three.module.min.js';

export const printWidths = {'kirilma':19.2,'rezonans':22.08,'momentum':19.2,'induksiyon':21.12,'itki':21.94,'girisim':23.04,'alan':23.04,'esik':22.63,'girdap':22.15,'kabarti':26.66,'sade-bfy':6.003,'manyetik-bfy':21,'tutulma':24.003};
const smallWidths={kirilma:6.42,rezonans:4.19,momentum:5.62,induksiyon:5.93,itki:1.84,girisim:1.84,alan:1.84};
const tau=Math.PI*2;
function surface(u,v){
 const a=u*tau,y=-1.25+v*2.4;
 const w=.79+.035*Math.sin(v*Math.PI)-.06*Math.pow(v,6);
 const depth=.235+.035*Math.sin(v*Math.PI);
 const folds=.009*Math.sin(a*12+v*4)*Math.pow(Math.sin(v*Math.PI),2);
 return new T.Vector3(Math.sin(a)*(w+folds),y+.10*v*v*Math.abs(Math.sin(a)),Math.cos(a)*(depth+folds));
}
function gridGeometry(fn,n=64,m=48){
 const pos=[],uv=[],idx=[];
 for(let j=0;j<=m;j++)for(let i=0;i<=n;i++){const p=fn(i/n,j/m);pos.push(p.x,p.y,p.z);uv.push(i/n,j/m);}
 for(let j=0;j<m;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+1,c=a+n+1,d=c+1;idx.push(a,c,b,b,c,d);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
function clothTexture(){
 const pixels=new Uint8Array(128*128*4);
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){let v=133+((x*73+y*31)%11)+(x%2?7:0)-(y%3?0:5),i=(y*128+x)*4;pixels[i]=pixels[i+1]=pixels[i+2]=v;pixels[i+3]=255;}
 const tex=new T.DataTexture(pixels,128,128);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(9,14);tex.needsUpdate=true;return tex;
}
function clothDepth(x,y){
 const edge=Math.max(0,1-(x/.81)**2),vertical=Math.max(0,Math.sin(Math.PI*T.MathUtils.clamp((y+1.3)/2.6,0,1)));
 return .125+.11*Math.sqrt(edge)*Math.pow(vertical,.4)+.004*Math.sin(x*19+y*11)*edge*vertical;
}
function softClothGeometry(shape){
 const source=new T.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelThickness:.045,bevelSize:.05,bevelSegments:6,curveSegments:24,steps:1});source.translate(0,0,-.08);
 const p=source.attributes.position,n=source.attributes.normal,uv=source.attributes.uv,positions=[],normals=[],uvs=[];
 function emit(a,b,c,level,sign){
  if(level){const mid=(x,y)=>x.map((v,i)=>(v+y[i])/2),ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);emit(a,ab,ca,level-1,sign);emit(ab,b,bc,level-1,sign);emit(ca,bc,c,level-1,sign);emit(ab,bc,ca,level-1,sign);return;}
  for(const v of [a,b,c]){const [x,y,z,nx,ny,nz,u,w]=v;if(sign){const h=clothDepth(x,y),dx=(clothDepth(x+.001,y)-clothDepth(x-.001,y))/.002,dy=(clothDepth(x,y+.001)-clothDepth(x,y-.001))/.002,no=new T.Vector3(-dx,-dy,sign).normalize();positions.push(x,y,sign*h);normals.push(no.x,no.y,no.z);}else{positions.push(x,y,z);normals.push(nx,ny,nz);}uvs.push(u,w);}
 }
 for(let i=0;i<p.count;i+=3){const vs=[0,1,2].map(k=>[p.getX(i+k),p.getY(i+k),p.getZ(i+k),n.getX(i+k),n.getY(i+k),n.getZ(i+k),uv.getX(i+k),uv.getY(i+k)]);const sign=Math.abs(vs[0][5])>.999&&Math.abs(vs[1][5])>.999&&Math.abs(vs[2][5])>.999?Math.sign(vs[0][5]):0;emit(...vs,sign?3:0,sign);}
 source.dispose();const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));return g;
}
export function makeGarment(kind,color='#17191b'){
 const group=new T.Group(),texture=clothTexture();
 const cloth=new T.MeshStandardMaterial({color,roughness:.96,metalness:0,bumpMap:texture,bumpScale:.007,side:T.DoubleSide});
 const rib=cloth.clone();rib.color.copy(cloth.color).multiplyScalar(.85);rib.bumpScale=.012;
 const mesh=(g,mat=cloth)=>{const m=new T.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;};
 const outline=new T.Shape();
 outline.moveTo(-.25,1.27);outline.quadraticCurveTo(-.49,1.20,-.72,1.10);
 if(kind==='hoodie'){
  outline.bezierCurveTo(-.91,1.01,-1.03,.45,-1.09,.05);outline.lineTo(-1.27,-1.06);outline.quadraticCurveTo(-1.27,-1.16,-1.16,-1.17);outline.lineTo(-.96,-1.14);outline.lineTo(-.81,-.11);outline.quadraticCurveTo(-.79,.16,-.75,.34);
 }else{outline.quadraticCurveTo(-.93,1.02,-1.39,.77);outline.lineTo(-1.17,.23);outline.lineTo(-.82,.42);outline.quadraticCurveTo(-.77,.46,-.76,.34);}
 outline.lineTo(-.76,-1.12);outline.quadraticCurveTo(-.77,-1.25,-.61,-1.27);outline.quadraticCurveTo(0,-1.31,.61,-1.27);outline.quadraticCurveTo(.77,-1.25,.76,-1.12);outline.lineTo(.76,.34);
 if(kind==='hoodie'){
  outline.quadraticCurveTo(.79,.16,.81,-.11);outline.lineTo(.96,-1.14);outline.lineTo(1.16,-1.17);outline.quadraticCurveTo(1.27,-1.16,1.27,-1.06);outline.lineTo(1.09,.05);outline.bezierCurveTo(1.03,.45,.91,1.01,.72,1.10);
 }else{outline.quadraticCurveTo(.77,.46,.82,.42);outline.lineTo(1.17,.23);outline.lineTo(1.39,.77);outline.quadraticCurveTo(.93,1.02,.72,1.10);}
 outline.quadraticCurveTo(.49,1.20,.25,1.27);outline.quadraticCurveTo(0,1.08,-.25,1.27);
 mesh(softClothGeometry(outline));
 const seamMat=new T.LineBasicMaterial({color:new T.Color(color).multiplyScalar(.7),transparent:true,opacity:.45});
 const neckline=new T.CatmullRomCurve3([new T.Vector3(-.25,1.27,.14),new T.Vector3(0,1.16,.16),new T.Vector3(.25,1.27,.14)]);
 mesh(new T.TubeGeometry(neckline,36,.026,8,false),rib);
 for(const sign of [-1,1]){const pts=[new T.Vector3(sign*.66,1.09,clothDepth(sign*.66,1.09)+.006),new T.Vector3(sign*.78,.83,clothDepth(sign*.78,.83)+.006),new T.Vector3(sign*.80,.48,clothDepth(sign*.80,.48)+.006)];group.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),seamMat));}
 const hemPoints=[new T.Vector3(-.70,-1.18,clothDepth(-.70,-1.18)+.006),new T.Vector3(0,-1.22,clothDepth(0,-1.22)+.006),new T.Vector3(.70,-1.18,clothDepth(.70,-1.18)+.006)];group.add(new T.Line(new T.BufferGeometry().setFromPoints(hemPoints),seamMat));
 if(kind==='hoodie'){
  const hood=mesh(gridGeometry((u,v)=>{const a=(u-.5)*Math.PI,q=Math.pow(Math.sin(v*Math.PI),.55);return new T.Vector3(Math.sin(a)*.37*q,.90+v*.61,.04-Math.cos(a)*(.25+.10*q));},48,40));
  const pocketShape=new T.Shape();pocketShape.moveTo(-.53,-.93);pocketShape.lineTo(.53,-.93);pocketShape.lineTo(.39,-.43);pocketShape.lineTo(-.39,-.43);pocketShape.closePath();
  const pocketGeometry=new T.ShapeGeometry(pocketShape,20);const pocketPosition=pocketGeometry.attributes.position;for(let i=0;i<pocketPosition.count;i++){const x=pocketPosition.getX(i),y=pocketPosition.getY(i),v=(y+1.25)/2.4,w=.79+.035*Math.sin(v*Math.PI)-.06*Math.pow(v,6),d=.235+.035*Math.sin(v*Math.PI);pocketPosition.setZ(i,clothDepth(x,y)+.015);}pocketGeometry.computeVertexNormals();mesh(pocketGeometry,rib);
  const seam=[new T.Vector3(-.5,-.90,.27),new T.Vector3(-.36,-.46,.27),new T.Vector3(.36,-.46,.27),new T.Vector3(.5,-.90,.27)];group.add(new T.Line(new T.BufferGeometry().setFromPoints(seam),seamMat));
 }
 group.userData.resources=[texture,cloth,rib,seamMat];return group;
}
function makeMug(){
 const group=new T.Group(),white=new T.MeshStandardMaterial({color:0xfaf9f4,roughness:.24,metalness:0,side:T.DoubleSide});
 const add=(g,m=white)=>{const o=new T.Mesh(g,m);group.add(o);return o;};
 add(new T.CylinderGeometry(.7,.68,1.65,96,1,true));
 const inside=new T.MeshStandardMaterial({color:0xe6e6e1,roughness:.3,side:T.BackSide});add(new T.CylinderGeometry(.635,.615,1.52,96,1,true),inside).position.y=.035;
 const rim=add(new T.TorusGeometry(.667,.034,16,96));rim.rotation.x=Math.PI/2;rim.position.y=.825;
 const bottom=add(new T.CylinderGeometry(.68,.66,.075,96));bottom.position.y=-.8;
 const floor=add(new T.CircleGeometry(.62,96));floor.rotation.x=-Math.PI/2;floor.position.y=-.71;
 const handle=add(new T.TorusGeometry(.40,.085,20,64));handle.scale.y=1.32;handle.position.set(.84,.03,0);
 return group;
}
function disposeGroup(group){
 const mats=new Set(),textures=new Set(group.userData.resources?.filter(x=>x.isTexture)||[]);
 group.traverse(o=>{o.geometry?.dispose();if(o.material)for(const m of [].concat(o.material)){mats.add(m);if(m.map)textures.add(m.map);}});
 mats.forEach(x=>x.dispose());textures.forEach(x=>x.dispose());
}
function decalGeometry(width,height,front,chest){
 const centerX=chest ? .34 : 0,top=chest ? .85 : .86;
 return gridGeometry((u,v)=>{
  const x=centerX+(u-.5)*width,y=top-(1-v)*height;
  const yy=(y+1.25)/2.4,w=.79+.035*Math.sin(yy*Math.PI)-.06*Math.pow(yy,6),depth=.235+.035*Math.sin(yy*Math.PI);
  const z=clothDepth(x,y)+.012;
  return new T.Vector3(front?x:-x,y,front?z:-z);
 },28,28);
}
export async function mountGarment({host,product,kind,base,color,onReady,onError}){
 let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch(error){onError?.(error);return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',product.name+' döndürülebilir 3B ürün. Sol ve sağ ok tuşlarıyla çevirin.');host.append(canvas);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,30);camera.position.set(0,.27,6.3);camera.lookAt(0,.23,0);
 scene.add(new T.HemisphereLight(0xfff8e9,0x7b898b,2));
 for(const [x,y,z,power] of [[-3,5,4,2.5],[4,2,-3,1.8],[2,1,4,.7]]){const l=new T.DirectionalLight(0xffffff,power);l.position.set(x,y,z);scene.add(l);}
 const pivot=new T.Group();scene.add(pivot);let model=null,generation=0,currentKind=kind,currentView=product.series==='anime'?'back':'front',angle=currentView==='back'?Math.PI:0,tilt=0,zoom=kind==='mug'?4.4:6.3,currentColor=color,drag=null,frame=0,disposed=false;
 pivot.rotation.y=angle;
 const loader=new T.TextureLoader();
 function draw(){if(disposed)return;pivot.rotation.set(tilt,angle,0);canvas.dataset.rotation=angle.toFixed(3);canvas.dataset.color=currentColor?.id||'siyah';camera.position.z=zoom;renderer.render(scene,camera);}
 function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();draw();}
 async function update(nextKind,nextColor=currentColor){
  currentColor=nextColor;
  currentKind=nextKind;const token=++generation;const next=nextKind==='mug'?makeMug():makeGarment(nextKind,nextColor?.hex);const anime=product.series==='anime';
  const sides=nextKind==='mug'?[]:(anime?['front','back']:['front']);
  try{
   if(nextKind==='mug'){
    const texture=await loader.loadAsync(base+'assets/baski-dalga-kupa-front.webp');texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
    if(disposed||token!==generation){texture.dispose();disposeGroup(next);return;}
    const print=new T.Mesh(new T.CylinderGeometry(.704,.686,1.46,128,1,true,Math.PI/2+.25,Math.PI*2-.5),new T.MeshStandardMaterial({map:texture,roughness:.3,transparent:true,side:T.DoubleSide}));next.add(print);
   }
   for(const side of sides){
    const texture=await loader.loadAsync(base+'assets/baski-'+product.id+'-'+side+(nextColor?.light?'-light':'')+'.webp');texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
    if(disposed||token!==generation){texture.dispose();disposeGroup(next);return;}
    const chest=side==='front'&&(anime||product.id==='sade-bfy'),cm=chest&&anime?smallWidths[product.id]:printWidths[product.id];
    const width=cm/60*1.6,height=width*texture.image.height/texture.image.width;
    const material=new T.MeshStandardMaterial({map:texture,transparent:true,roughness:.95,depthWrite:false,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2});
    const print=new T.Mesh(decalGeometry(width,height,side==='front',chest),material);print.renderOrder=1;next.add(print);
   }
   if(model){pivot.remove(model);disposeGroup(model);}model=next;pivot.add(model);resize();onReady?.();
  }catch(error){disposeGroup(next);onError?.(error);}
 }
 function setView(view){currentView=view;angle=view==='back'?Math.PI:0;tilt=0;draw();}
 function pointerDown(e){if(e.button>0)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';canvas.dataset.dragging='true';}
 function pointerMove(e){if(!drag)return;angle+=(e.clientX-drag.x)*.012;tilt=T.MathUtils.clamp(tilt+(e.clientY-drag.y)*.006,-.22,.22);drag={x:e.clientX,y:e.clientY};draw();}
 function pointerUp(){drag=null;canvas.style.cursor='grab';canvas.dataset.dragging='false';}
 function key(e){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home')setView(currentView);else if(e.key==='ArrowLeft'||e.key==='ArrowRight')angle+=e.key==='ArrowLeft'?-.18:.18;else zoom=T.MathUtils.clamp(zoom+(e.key==='ArrowUp'?-.25:.25),4,7.5);draw();}}
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();onError?.(new Error('3B görüntü bağlantısı kesildi'));});canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerUp);canvas.addEventListener('keydown',key);
 const ro=new ResizeObserver(resize);ro.observe(host);resize();await update(kind);
 return {update,setView,zoom(delta){zoom=T.MathUtils.clamp(zoom+delta,4,7.5);draw();},dispose(){disposed=true;generation++;ro.disconnect();if(model)disposeGroup(model);renderer.dispose();canvas.remove();cancelAnimationFrame(frame);}};
}
