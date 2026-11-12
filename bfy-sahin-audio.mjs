// Real recordings: idle and driving load. Credits are linked beside the controls.
export class RecordedEngine {
 constructor(){this.context=null;this.buffer=null;this.driveBuffer=null;this.source=null;this.driveSource=null;this.volume=.30;this.enabled=false;this.rev=false;this.pending=null;this.version=0;this.disposed=false;this.lastGear=1;this.shiftUntil=0;}
 ensureContext(){
  if(this.disposed)throw new Error('Ses oturumu kapandı. Sayfayı yenile.');
  const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('Bu tarayıcı ses oynatmayı desteklemiyor.');
  if(!this.context){this.context=new C();this.gain=this.context.createGain();this.gain.gain.value=0;this.idleGain=this.context.createGain();this.loadGain=this.context.createGain();this.filter=this.context.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=5500;this.idleGain.connect(this.filter);this.loadGain.connect(this.filter);this.filter.connect(this.gain);this.gain.connect(this.context.destination);}
  return this.context;
 }
 async decode(file){const c=this.ensureContext();let b;try{b=await c.decodeAudioData(await file.arrayBuffer());}catch{throw new Error('Egzoz kaydı açılamadı. Yeniden dene.');}if(b.duration<.25)throw new Error('Egzoz kaydı eksik. Yeniden dene.');return b;}
 async loadDefault(){if(!this.pending)this.pending=Promise.all(['bfy-sahin-egzoz.wav','bfy-sahin-drive.wav'].map(async name=>{const r=await fetch(new URL('./'+name,import.meta.url));if(!r.ok)throw new Error('Egzoz kaydı yüklenemedi. Yeniden dene.');return this.decode(await r.blob());})).finally(()=>this.pending=null);return this.pending;}
 async start(){
  if(this.enabled)return true;const token=++this.version,c=this.ensureContext();await c.resume();
  if(!this.buffer){const [idle,drive]=await this.loadDefault();if(token!==this.version||this.disposed)return false;this.buffer=idle;this.driveBuffer=drive;}
  if(token!==this.version||this.disposed||document.hidden)return false;
  const make=(buffer,dest,rate)=>{const s=c.createBufferSource();s.buffer=buffer;s.loop=true;s.playbackRate.value=rate;s.connect(dest);s.onended=()=>s.disconnect();s.start();return s;};
  this.idleGain.gain.value=.8;this.loadGain.gain.value=0;
  this.source=make(this.buffer,this.idleGain,.82);this.driveSource=make(this.driveBuffer,this.loadGain,.65);
  this.gain.gain.cancelScheduledValues(c.currentTime);this.gain.gain.setValueAtTime(0,c.currentTime);this.gain.gain.linearRampToValueAtTime(this.volume,c.currentTime+.06);
  this.enabled=true;this.lastGear=1;return true;
 }
 stop(){++this.version;if(this.source){const now=this.context.currentTime;this.gain.gain.cancelScheduledValues(now);this.gain.gain.setTargetAtTime(0,now,.015);for(const key of ['source','driveSource']){this[key]?.stop(now+.08);this[key]=null;}}this.enabled=false;this.rev=false;}
 setVolume(value){this.volume=Math.max(0,Math.min(.6,value));if(this.enabled)this.gain.gain.setTargetAtTime(this.volume,this.context.currentTime,.06);}
 update(speed,running,telemetry={}){
  if(!this.enabled)return;const now=this.context.currentTime,kmh=Math.max(0,speed)*3.6,bands=[48,83,122,167,225];let gear=1;while(gear<5&&kmh>bands[gear-1])gear++;
  gear=telemetry.gear||gear;const low=gear===1?0:bands[gear-2]*.70;
  const throttle=this.rev?1:telemetry.throttle??(running?1:0);
  const rpm=telemetry.rpm??(this.rev?6100:running?Math.max(1300,1600+(kmh-low)/(bands[gear-1]-low)*5000):950);
  if(gear!==this.lastGear){this.shiftUntil=now+.16;this.lastGear=gear;}
  const shifting=now<this.shiftUntil,load=Math.min(1,Math.max(0,(rpm-1000)/3800))*(.25+throttle*.75),blend=shifting?load*.2:load;
  this.idleGain.gain.setTargetAtTime((1-blend)*.75,now,.08);this.loadGain.gain.setTargetAtTime(blend*.92,now,.07);
  this.source.playbackRate.setTargetAtTime(Math.min(1.65,.68+rpm/6500*.95),now,.12);
  this.driveSource.playbackRate.setTargetAtTime(Math.min(1.8,.52+rpm/6500*1.18),now,.11);
  this.filter.frequency.setTargetAtTime(1700+throttle*4200+Math.min(800,kmh*5),now,.12);
  this.gain.gain.setTargetAtTime(this.volume*(shifting?.58:1),now,.04);
 }
 dispose(){this.stop();this.disposed=true;this.context?.close();}
}
