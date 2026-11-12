import {makeDriver,stepDriver,stepRival,resolveContact,standings,drivetrain} from './bfy-drive-physics.mjs';
import {steeringFromDrag} from './bfy-drive-controls.mjs';
import {RecordedEngine} from './bfy-sahin-audio.mjs';
const assert=(v,m)=>{if(!v)throw Error(m);};
const drive=(dt,seconds,input,curvature=0)=>{const c=makeDriver(0,0);for(let t=0;t<Math.round(seconds/dt);t++)stepDriver(c,input,dt,curvature,2000);return c;};
const a=drive(1/60,10,{gas:1}),b=drive(1/30,10,{gas:1});assert(a.v>40&&a.s>220,'gas accelerates');assert(Math.abs(a.s-b.s)<2,'frame rate stability');
for(let i=0;i<240;i++)stepDriver(a,{brake:1},1/60,0,2000);assert(a.v===0,'brakes stop');
const turn=drive(1/60,10,{gas:1,steer:1});assert(turn.contacts>0&&Math.abs(turn.lane)<=13.2,'barrier collision bounds');
const x=makeDriver(0,0,10),y=makeDriver(1,.1,12);x.v=30;y.v=20;assert(resolveContact(x,y)&&x.v<30&&x.contacts===1,'contact transfer');assert(!resolveContact(x,y),'contact cooldown');
const fin=makeDriver(0,0,3980);fin.v=60;for(let i=0;i<60;i++)stepDriver(fin,{gas:1},1/60,0,2000);assert(fin.done&&fin.s===4000&&fin.finishTime>0,'two lap finish');const before=fin.finishTime;stepDriver(fin,{gas:1},1/60,0,2000);assert(fin.finishTime===before,'finish frozen');assert(standings([y,fin])[0]===fin,'finish ranking');
const ai=makeDriver(1,2,0);ai.targetLane=-2;for(let i=0;i<120;i++)stepRival(ai,1/60,.01,2000);assert(ai.v>0&&ai.lane<0&&Number.isFinite(ai.rpm),'rival driving');
assert(drivetrain(49/3.6).gear===2&&drivetrain(48/3.6).gear===1,'gear shift boundary');
let sources=[],fetches=0;const param=()=>({value:0,setTargetAtTime(v){this.value=v;},setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.value=v;},cancelScheduledValues(){}});
class Context{currentTime=0;sampleRate=44100;destination={};createPeriodicWave(){return{};}createBuffer(ch,n){return{getChannelData:()=>new Float32Array(n)};}createWaveShaper(){return{connect(){}};}createDynamicsCompressor(){return{threshold:param(),knee:param(),ratio:param(),attack:param(),release:param(),connect(){}};}createOscillator(){const s={frequency:param(),setPeriodicWave(){},connect(){},disconnect(){},start(){s.started=true;},stop(){s.stopped=true;}};return s;}createGain(){return{gain:param(),connect(){}};}createBiquadFilter(){return{frequency:param(),gain:param(),Q:param(),connect(){}};}async resume(){}async decodeAudioData(){return{duration:2.45};}createBufferSource(){const s={playbackRate:param(),connect(){},disconnect(){},start(){s.started=true;},stop(){s.stopped=true;}};sources.push(s);return s;}close(){}}
globalThis.window={AudioContext:Context};globalThis.document={hidden:false};const response=()=>({ok:true,blob:async()=>new Blob([new Uint8Array(100)])});globalThis.fetch=async()=>{fetches++;return response();};
let e=new RecordedEngine();assert(await e.start(),'audio starts');assert(fetches===2&&sources.length===2,'two real recordings');await e.start();assert(sources.length===2,'no stacked loops');e.update(0,false);const idle=e.loadGain.gain.value;e.update(30,true,{rpm:6000,throttle:1,gear:1});assert(e.loadGain.gain.value>idle&&e.driveSource.playbackRate.value>1,'gas drives load and pitch');const full=e.loadGain.gain.value;e.update(30,true,{rpm:4200,throttle:.4,gear:2});assert(e.loadGain.gain.value<full,'shift cuts load');e.stop();assert(sources.every(s=>s.stopped)&&!e.enabled,'both sources stop');await e.start();assert(fetches===2,'buffer reuse');e.stop();
let finish=[];globalThis.fetch=()=>new Promise(r=>finish.push(r));e=new RecordedEngine();const pending=e.start();await Promise.resolve();await Promise.resolve();e.stop();finish.forEach(r=>r(response()));assert(await pending===false&&!e.enabled,'pending start cancelled');
globalThis.fetch=async()=>({ok:false});let failed=false;try{await e.start();}catch{failed=true;}assert(failed&&!e.pending,'failure retry ready');globalThis.fetch=async()=>response();assert(await e.start(),'retry succeeds');e.stop();document.hidden=true;e=new RecordedEngine();assert(await e.start()===false,'hidden page silent');document.hidden=false;e.dispose();
const free=makeDriver(0,0);free.v=20;for(let i=0;i<60;i++)stepDriver(free,{},1/60,.01,2000);assert(Math.abs(free.yaw+.01*free.s)<.005,'no steering preserves world heading');assert(free.lane<-.5,'road turns away from straight-moving car');
const crash=makeDriver(0,12.9);crash.v=35;crash.yaw=.7;stepDriver(crash,{},.04,0,2000);assert(crash.damage>.1&&crash.v<20,'barrier impact causes damage');
const clean=drive(1/60,5,{gas:1}),damaged=makeDriver(0,0);damaged.damage=.8;for(let i=0;i<300;i++)stepDriver(damaged,{gas:1},1/60,0,2000);assert(damaged.v<clean.v,'damage reduces engine power');
assert(steeringFromDrag(0,0,150)===0&&steeringFromDrag(0,500,150)===1&&steeringFromDrag(0,-500,150)===-1,'analog wheel bounds');assert(steeringFromDrag(0,20,150,.6)<steeringFromDrag(0,20,150,1.4),'adjustable steering sensitivity');
console.log('PASS: free heading, off-road, impact damage, power loss, analog steering,  driving, brakes, FPS stability, steering/barriers, contacts, two-lap finish, ranking, AI, gears, dual audio, throttle/pitch, shifts, stop/reuse/cancel/retry/visibility.');
// Pointer cancellation must center the wheel without allowing a second finger to steal it.
const {installWheel}=await import('./bfy-drive-controls.mjs');
const listeners={},attrs={};const wheelElement={style:{setProperty(){}},classList:{toggle(){}},setAttribute(k,v){attrs[k]=v;},addEventListener(k,v){listeners[k]=v;},setPointerCapture(){},getBoundingClientRect(){return{width:150};}};
const wheel=installWheel(wheelElement,{canDrive:()=>true});
const pointer=(pointerId,clientX)=>({pointerId,clientX,preventDefault(){}});
listeners.pointerdown(pointer(1,10));listeners.pointermove(pointer(1,70));assert(wheel.value>.6,'drag steers');listeners.pointerdown(pointer(2,0));listeners.pointermove(pointer(2,-500));assert(wheel.value>.6,'second pointer cannot steal steering');listeners.pointercancel(pointer(1,70));assert(wheel.value===0&&!wheel.active&&attrs['aria-valuenow']==='0','cancel centers wheel');
// Geometry can be dented and restored exactly without compounding deformation.
const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{}});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
const {createSahin}=await import('./bfy-sahin-model.mjs');
const model=createSahin(),original=[];model.userData.body.traverse(o=>{if(o.isMesh)original.push({o,vertices:o.geometry.attributes.position.array.slice()});});
model.userData.setDamage(.7);assert(original.some(({o,vertices})=>o.geometry.attributes.position.array.some((v,i)=>v!==vertices[i])),'visible dents');assert(original.every(({o})=>o.geometry.attributes.position.array.every(Number.isFinite)),'damage geometry finite');model.userData.setDamage(0);assert(original.every(({o,vertices})=>o.geometry.attributes.position.array.every((v,i)=>v===vertices[i])),'restart restores exact geometry');
console.log('PASS: wheel multi-pointer/cancel and visible damage/repair geometry.');
