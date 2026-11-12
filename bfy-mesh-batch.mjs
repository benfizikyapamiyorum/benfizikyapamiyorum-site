import * as T from './bfy-three.module.min.js';
// Combine static siblings by material, keeping each wheel and hinged group movable.
export function batchStaticMeshes(root,skip=new Set()){
 const visit=parent=>{
  if(skip.has(parent))return;
  for(const child of [...parent.children])if(!child.isMesh)visit(child);
  const groups=new Map();
  for(const child of parent.children){
   if(skip.has(child)||!child.isMesh||Array.isArray(child.material)||!child.visible||child.isInstancedMesh)continue;
   const key=child.material.uuid+':'+child.castShadow+':'+child.receiveShadow;
   if(!groups.has(key))groups.set(key,[]);groups.get(key).push(child);
  }
  for(const meshes of groups.values()){
   if(meshes.length<2)continue;
   const parts=meshes.map(m=>{m.updateMatrix();const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrix);return g;});
   const names=Object.keys(parts[0].attributes).filter(name=>parts.every(g=>g.attributes[name]?.itemSize===parts[0].attributes[name].itemSize));
   const geometry=new T.BufferGeometry();
   for(const name of names){const size=parts[0].attributes[name].itemSize,total=parts.reduce((n,g)=>n+g.attributes[name].array.length,0),array=new Float32Array(total);let offset=0;for(const g of parts){array.set(g.attributes[name].array,offset);offset+=g.attributes[name].array.length;}geometry.setAttribute(name,new T.BufferAttribute(array,size));}
   geometry.computeBoundingSphere();const merged=new T.Mesh(geometry,meshes[0].material);merged.castShadow=meshes[0].castShadow;merged.receiveShadow=meshes[0].receiveShadow;parent.add(merged);
   for(const m of meshes)parent.remove(m);for(const g of parts)g.dispose();
  }
 };
 visit(root);return root;
}
