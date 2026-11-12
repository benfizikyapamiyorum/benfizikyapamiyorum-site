import * as T from './bfy-three.module.min.js';
// A bounded ring of tyre ribbons: one draw call, no mesh/texture per frame.
// Track-space edge tests stop each tyre independently at the asphalt boundary.
export class SkidMarks {
 constructor(scene,capacity=3072){
  this.contacts=new Float32Array(12);this.capacity=capacity;this.cursor=0;this.count=0;this.last=Array(4).fill(null);
  this.geometry=new T.BufferGeometry();
  for(const [name,size] of [['position',3],['uv',2],['stamp',2]])this.geometry.setAttribute(name,new T.BufferAttribute(new Float32Array(capacity*6*size),size).setUsage(T.DynamicDrawUsage));
  this.geometry.setDrawRange(0,0);
  this.material=new T.ShaderMaterial({transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,uniforms:{now:{value:0}},
   vertexShader:'attribute vec2 stamp; varying vec2 tex; varying vec2 age; void main(){tex=uv;age=stamp;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float now; varying vec2 tex; varying vec2 age; void main(){float edge=smoothstep(0.,.12,tex.x)*smoothstep(0.,.12,1.-tex.x);float groove=.72+.28*smoothstep(.25,.6,fract(tex.x*7.));float fade=1.-smoothstep(48.,72.,now-age.x);gl_FragColor=vec4(.035,.039,.042,edge*groove*age.y*fade*.72);}',side:T.DoubleSide});
  this.mesh=new T.Mesh(this.geometry,this.material);this.mesh.frustumCulled=false;this.mesh.renderOrder=1;scene.add(this.mesh);
 }
 breakTrail(){this.last.fill(null);this.contacts.fill(0);}
 reset(){for(const a of Object.values(this.geometry.attributes))a.clearUpdateRanges();this.cursor=0;this.count=0;this.breakTrail();this.geometry.setDrawRange(0,0);}
 add(wheel,x,z,intensity,now,onAsphalt=true){
  if(!onAsphalt||intensity<.12){this.last[wheel]=null;return;}
  const p=this.last[wheel];if(!p){this.last[wheel]={x,z};return;}
  const dx=x-p.x,dz=z-p.z,d=Math.hypot(dx,dz);
  if(d>3){this.last[wheel]={x,z};return;} // collision/recovery/teleport, never a cross-track stripe
  if(d<.16)return;
  const nx=-dz/d*.105,nz=dx/d*.105,vertices=[[p.x+nx,p.z+nz],[p.x-nx,p.z-nz],[x+nx,z+nz],[x+nx,z+nz],[p.x-nx,p.z-nz],[x-nx,z-nz]];
  const uv=[[0,0],[1,0],[0,d],[0,d],[1,0],[1,d]],offset=this.cursor*6;
  for(let i=0;i<6;i++){this.geometry.attributes.position.setXYZ(offset+i,vertices[i][0],.041,vertices[i][1]);this.geometry.attributes.uv.setXY(offset+i,...uv[i]);this.geometry.attributes.stamp.setXY(offset+i,now,Math.min(1,intensity));}
  for(const a of Object.values(this.geometry.attributes)){a.addUpdateRange(offset*a.itemSize,6*a.itemSize);a.needsUpdate=true;}
  this.cursor=(this.cursor+1)%this.capacity;this.count=Math.min(this.capacity,this.count+1);this.geometry.setDrawRange(0,this.count*6);this.last[wheel]={x,z};
 }
 update(c,world,now){
  this.material.uniforms.now.value=now;
  for(const a of Object.values(this.geometry.attributes))a.clearUpdateRanges();
  const a=world.sample(c.s),heading=Math.atan2(a.t.z,a.t.x)+c.yaw,fx=Math.cos(heading),fz=Math.sin(heading),nx=-fz,nz=fx,cx=a.p.x+a.n.x*c.lane,cz=a.p.z+a.n.z*c.lane;
  for(let i=0;i<4;i++){
   const rear=i<2,x=rear?-1.21:1.27,z=i%2? .805:-.805;
   const wx=cx+fx*x+nx*z,wz=cz+fz*x+nz*z;
   const at=world.sample(c.s+(wx-cx)*a.t.x+(wz-cz)*a.t.z);
   const lateral=(wx-at.p.x)*at.n.x+(wz-at.p.z)*at.n.z;
   const asphalt=Math.abs(lateral)<7.15&&c.hit===0,moving=Math.hypot(c.v,c.vy)>.25;
   const slip=asphalt&&(moving||(rear&&c.spin>.16))?(rear?c.rearSkid:c.frontSkid):0;
   this.contacts[i*3]=wx;this.contacts[i*3+1]=wz;this.contacts[i*3+2]=slip;
   this.add(i,wx,wz,slip,now,asphalt&&moving);
  }
 }
 dispose(){this.mesh.removeFromParent();this.geometry.dispose();this.material.dispose();}
}
