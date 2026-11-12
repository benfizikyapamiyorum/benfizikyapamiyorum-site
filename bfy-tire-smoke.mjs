import * as T from './bfy-three.module.min.js';
// One Points draw, fixed typed arrays, reusable slots; no per-puff meshes or textures.
export class TireSmoke {
 constructor(scene,capacity=96){
  this.capacity=capacity;this.limit=capacity;this.cursor=0;this.activeCount=0;this.seed=54;
  this.life=new Float32Array(capacity);this.duration=new Float32Array(capacity);this.velocity=new Float32Array(capacity*3);this.strength=new Float32Array(capacity);this.emission=new Float32Array(4);
  this.geometry=new T.BufferGeometry();
  for(const [name,size] of [['position',3],['puff',2]])this.geometry.setAttribute(name,new T.BufferAttribute(new Float32Array(capacity*size),size).setUsage(T.DynamicDrawUsage));
  const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const q=canvas.getContext('2d'),pixels=q.createImageData(64,64);
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){const dx=(x-31.5)/31.5,dy=(y-31.5)/31.5,r=Math.hypot(dx,dy),v=Math.pow(Math.max(0,1-r*r),1.3)*(.76+.24*Math.sin(x*.43)*Math.sin(y*.38)),i=(y*64+x)*4;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;pixels.data[i+3]=Math.round(v*255);}q.putImageData(pixels,0,0);
  this.texture=new T.CanvasTexture(canvas);
  this.material=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{cloud:{value:this.texture},pixelScale:{value:450},maxSize:{value:84}},
   vertexShader:'attribute vec2 puff; uniform float pixelScale; uniform float maxSize; varying float opacity; void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(puff.x*pixelScale/max(1.,-p.z),1.,maxSize);opacity=puff.y;}',
   fragmentShader:'uniform sampler2D cloud; varying float opacity; void main(){float a=texture2D(cloud,gl_PointCoord).a*opacity;if(a<.008)discard;gl_FragColor=vec4(.76,.78,.79,a);}'});
  this.mesh=new T.Points(this.geometry,this.material);this.mesh.frustumCulled=false;this.mesh.visible=false;this.mesh.renderOrder=2;scene.add(this.mesh);
 }
 random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 setQuality(high){this.limit=high?this.capacity:Math.min(48,this.capacity);this.material.uniforms.maxSize.value=high?84:64;for(let i=this.limit;i<this.capacity;i++){this.life[i]=0;this.geometry.attributes.puff.setXY(i,0,0);}this.geometry.attributes.puff.needsUpdate=true;this.geometry.setDrawRange(0,this.limit);}
 reset(){this.life.fill(0);this.emission.fill(0);this.geometry.attributes.puff.array.fill(0);this.geometry.attributes.puff.needsUpdate=true;this.activeCount=0;this.cursor=0;this.mesh.visible=false;}
 spawn(x,z,power){const i=this.cursor%this.limit;this.cursor=(i+1)%this.limit;this.activeCount++;this.life[i]=this.duration[i]=1.1+this.random()*.65;this.strength[i]=power;this.geometry.attributes.position.setXYZ(i,x+(this.random()-.5)*.12,.16,z+(this.random()-.5)*.12);this.velocity[i*3]=(this.random()-.5)*.65;this.velocity[i*3+1]=.32+this.random()*.35;this.velocity[i*3+2]=(this.random()-.5)*.65;}
 update(dt,contacts){
  dt=Math.max(0,Math.min(.04,dt));if(dt===0)return;
  // contacts: four [world x, world z, slip intensity] samples shared with the tyre marks.
  for(let w=0;w<4;w++){const power=Math.max(0,Math.min(1,contacts[w*3+2]));if(power<.22){this.emission[w]=0;continue;}this.emission[w]+=dt*(this.limit<96?10:16)*power;while(this.emission[w]>=1){this.emission[w]--;this.spawn(contacts[w*3],contacts[w*3+1],power);}}
  if(this.activeCount===0)return;
  const position=this.geometry.attributes.position,puff=this.geometry.attributes.puff;this.activeCount=0;
  for(let i=0;i<this.limit;i++){if(this.life[i]<=0)continue;this.life[i]=Math.max(0,this.life[i]-dt);if(!this.life[i]){puff.setXY(i,0,0);continue;}this.activeCount++;const age=1-this.life[i]/this.duration[i];position.setXYZ(i,position.getX(i)+this.velocity[i*3]*dt,position.getY(i)+this.velocity[i*3+1]*dt,position.getZ(i)+this.velocity[i*3+2]*dt);puff.setXY(i,.5+age*2.1,Math.min(1,age*9)*(1-age)*Math.sqrt(this.strength[i])*.78);}
  position.needsUpdate=true;puff.needsUpdate=true;this.mesh.visible=this.activeCount>0;
 }
 dispose(){this.mesh.removeFromParent();this.geometry.dispose();this.material.dispose();this.texture.dispose();}
}
