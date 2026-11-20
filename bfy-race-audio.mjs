// Three shared recording buffers, three fixed rival voices, at most four impacts.
// All effects share the engine master/mute and stop on pause or page hide.
export function proximityMix(dx,dz,heading){
 const distance=Math.hypot(dx,dz),near=1/(1+(distance/10)**2);
 return{distance,gain:distance>=65?0:near*.34*Math.min(1,(65-distance)/15),pan:Math.max(-1,Math.min(1,(-Math.sin(heading)*dx+Math.cos(heading)*dz)/Math.max(5,distance)*.85)),cutoff:1100+near*4200};
}
export class RaceAudio {
 constructor(engine){this.engine=engine;this.buffers=null;this.pending=null;this.voices=[];this.shots=new Set();this.enabled=false;this.version=0;this.lastImpact=-Infinity;this.lastUpdate=-Infinity;this.disposed=false;}
 async load(){
  if(this.buffers)return this.buffers;
  if(!this.pending){const c=this.engine.ensureContext();this.pending=Promise.all(['bfy-rival-engine.wav','bfy-impact.wav','bfy-engine-start.wav'].map(async file=>{const r=await fetch(new URL('./'+file,import.meta.url));if(!r.ok)throw Error('Yarış sesleri yüklenemedi.');const b=await c.decodeAudioData(await r.arrayBuffer());if(b.duration<.2)throw Error('Yarış ses kaydı eksik.');return b;})).then(b=>this.buffers=b).finally(()=>this.pending=null);}
  return this.pending;
 }
 async start({ignition=false}={}){
  if(this.disposed||this.enabled)return false;
  const token=++this.version,c=this.engine.ensureContext();await c.resume();await this.load();
  if(token!==this.version||this.disposed||document.hidden||!this.engine.enabled)return false;
  for(let i=0;i<3;i++){
   const source=c.createBufferSource(),gain=c.createGain(),filter=c.createBiquadFilter(),pan=c.createStereoPanner?.()||c.createGain();
   source.buffer=this.buffers[0];source.loop=true;source.playbackRate.value=.8;gain.gain.value=0;filter.type='lowpass';filter.frequency.value=1800;
   source.connect(filter);filter.connect(gain);gain.connect(pan);pan.connect(this.engine.limiter);
   source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();pan.disconnect();};source.start(0,i*.71);
   this.voices.push({source,gain,filter,pan,distance:null});
  }
  this.enabled=true;this.lastUpdate=-Infinity;this.lastImpact=-Infinity;
  if(ignition)this.oneShot(this.buffers[2],.95,0,1);
  return true;
 }
 oneShot(buffer,level,position,rate){
  if(!this.enabled||this.shots.size>=4)return false;
  const c=this.engine.context,s=c.createBufferSource(),g=c.createGain(),pan=c.createStereoPanner?.()||c.createGain();
  s.buffer=buffer;s.playbackRate.value=rate;g.gain.value=level;if(pan.pan)pan.pan.value=position;
  s.connect(g);g.connect(pan);pan.connect(this.engine.limiter);
  const shot={source:s,gain:g,pan};this.shots.add(shot);s.onended=()=>{s.disconnect();g.disconnect();pan.disconnect();this.shots.delete(shot);};s.start();return true;
 }
 impact(strength=1,pan=0,distance=0){
  if(!this.enabled||strength<.7||distance>55)return false;
  const now=this.engine.context.currentTime;if(now-this.lastImpact<.18)return false;
  const force=Math.min(1,Math.max(0,strength/16)),attenuation=1/(1+(distance/12)**2);
  const played=this.oneShot(this.buffers[1],(.12+force*.85)*attenuation,Math.max(-1,Math.min(1,pan)),1.12-force*.24);
  if(played)this.lastImpact=now;return played;
 }
 update(listener,rivals){
  if(!this.enabled)return;const now=this.engine.context.currentTime,dt=now-this.lastUpdate;if(dt<1/20)return;this.lastUpdate=now;
  for(let i=0;i<this.voices.length;i++){
   const v=this.voices[i],r=rivals[i];if(!r){v.gain.gain.setTargetAtTime(0,now,.06);v.distance=null;continue;}
   const mix=proximityMix(r.x-listener.x,r.z-listener.z,listener.heading);
   const closing=v.distance===null||!Number.isFinite(dt)?0:(v.distance-mix.distance)/dt;
   const doppler=Math.max(.94,Math.min(1.06,1+closing/343));v.distance=mix.distance;
   const rpm=Math.max(900,Math.min(6800,r.rpm||950)),character=[1.04,.94,.85][i];
   v.source.playbackRate.setTargetAtTime((.53+rpm/6800*.70)*character*doppler,now,.12);
   v.gain.gain.setTargetAtTime(mix.gain*(.65+rpm/6800*.35),now,.10);
   v.filter.frequency.setTargetAtTime(mix.cutoff,now,.12);v.pan.pan?.setTargetAtTime(mix.pan,now,.10);
  }
 }
 stop(){
  ++this.version;const now=this.engine.context?.currentTime||0;
  for(const v of this.voices){v.gain.gain.cancelScheduledValues(now);v.gain.gain.setTargetAtTime(0,now,.01);v.source.stop(now+.05);}
  for(const s of this.shots){s.gain.gain.cancelScheduledValues(now);s.gain.gain.setTargetAtTime(0,now,.01);s.source.stop(now+.05);}
  this.voices=[];this.shots.clear();this.enabled=false;
 }
 dispose(){this.stop();this.disposed=true;}
}
