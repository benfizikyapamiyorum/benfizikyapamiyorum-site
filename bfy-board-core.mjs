// Bounded classroom data, independent of the rendering engine.
export const LIMITS = Object.freeze({strokes:120,points:512,history:20,saves:8});
export function appendPoint(points, point, threshold=1.5){
 if(!point.every(Number.isFinite))return false;
 const last=points.at(-1);if(last&&Math.hypot(last[0]-point[0],last[1]-point[1])<threshold)return false;
 if(points.length>=LIMITS.points){const reduced=points.filter((_,i)=>i===0||i%2===1);points.splice(0,points.length,...reduced);}
 points.push(point.map(v=>Math.max(0,Math.min(1000,v))));return true;
}
export function validStrokes(value){return Array.isArray(value)?value.slice(0,LIMITS.strokes).filter(s=>/^#[0-9a-f]{6}$/i.test(s?.color)&&Array.isArray(s.points)).map(s=>({color:s.color,points:s.points.slice(0,LIMITS.points).filter(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)).map(p=>p.map(v=>Math.max(0,Math.min(1000,v))))})):[];}
export function segmentDistance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy,t=d?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/d)):0;return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);}
export function braking({speed=50,reaction=.8,mu=.75}={}){const v=speed/3.6,a=Math.max(.05,mu)*9.81;return {v,a,reactionDistance:v*reaction,brakeDistance:v*v/(2*a),distance:v*reaction+v*v/(2*a),time:reaction+v/a};}
export function eggImpact({height=2,cushion=.15,mass=.06}={}){const v=Math.sqrt(2*9.81*height),a=v*v/(2*cushion);return{v,a,time:v/a,force:mass*(a+9.81),impulse:mass*v,gForce:(a+9.81)/9.81};}
const cross=(a,b)=>a.x*b.y-a.y*b.x;
export function traceRay(origin,direction,mirrors,bounds={w:1000,h:560},max=8){
 let p={...origin},d={...direction};const norm=Math.hypot(d.x,d.y);d.x/=norm;d.y/=norm;const segments=[];
 const walls=[{a:{x:0,y:0},b:{x:bounds.w,y:0}},{a:{x:bounds.w,y:0},b:{x:bounds.w,y:bounds.h}},{a:{x:bounds.w,y:bounds.h},b:{x:0,y:bounds.h}},{a:{x:0,y:bounds.h},b:{x:0,y:0}}];
 for(let bounce=0;bounce<max;bounce++){
  let hit=null;
  for(const [i,m] of [...mirrors,...walls].entries()){const s={x:m.b.x-m.a.x,y:m.b.y-m.a.y},q={x:m.a.x-p.x,y:m.a.y-p.y},den=cross(d,s);if(Math.abs(den)<1e-9)continue;const t=cross(q,s)/den,u=cross(q,d)/den;if(t>1e-4&&u>=0&&u<=1&&(!hit||t<hit.t))hit={t,s,i};}
  if(!hit)break;const end={x:p.x+d.x*hit.t,y:p.y+d.y*hit.t};segments.push({a:{...p},b:end,mirror:hit.i<mirrors.length});if(hit.i>=mirrors.length)break;
  const len=Math.hypot(hit.s.x,hit.s.y),n={x:-hit.s.y/len,y:hit.s.x/len},dot=d.x*n.x+d.y*n.y;d={x:d.x-2*dot*n.x,y:d.y-2*dot*n.y};p={x:end.x+d.x*.001,y:end.y+d.y*.001};
 }return segments;
}
export async function retryLoad(operation,attempts=3,wait=ms=>new Promise(r=>setTimeout(r,ms))){let error;for(let i=0;i<attempts;i++){try{return await operation(i);}catch(e){error=e;if(i<attempts-1)await wait(350*2**i);}}throw error;}
export function savedControlValue(value,{type,min=-Infinity,max=Infinity,options=[]}){
 if(type==='checkbox'){if(typeof value!=='boolean')throw Error('Yedekteki anahtar değeri geçersiz.');return value;}
 if(type==='select-one'){if(!options.includes(String(value)))throw Error('Yedekteki seçenek bu deneyde yok.');return String(value);}
 if(value===''||!Number.isFinite(Number(value)))throw Error('Yedekteki sayısal değer geçersiz.');
 return Math.max(min,Math.min(max,Number(value)));
}
