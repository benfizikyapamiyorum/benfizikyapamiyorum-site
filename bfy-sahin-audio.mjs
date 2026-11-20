// Leveled real Şahin recordings: the original acceleration clip's 8 Hz amplitude
// flutter is removed offline. Pitch follows RPM; no synthetic combustion oscillator.
export class RecordedEngine {
 constructor(){this.context=null;this.buffer=null;this.driveBuffer=null;this.source=null;this.driveSource=null;this.volume=.42;this.enabled=false;this.rev=false;this.pending=null;this.version=0;this.disposed=false;this.lastGear=1;this.shiftUntil=0;this.lastThrottle=0;this.lastBurst=-1;}
 ensureContext(){
  if(this.disposed)throw new Error('Ses oturumu kapandı. Sayfayı yenile.');
  const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('Bu tarayıcı ses oynatmayı desteklemiyor.');
  if(!this.context){
   const c=this.context=new C();this.gain=c.createGain();this.gain.gain.value=0;this.idleGain=c.createGain();this.loadGain=c.createGain();
   this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=2400;
   this.bass=c.createBiquadFilter();this.bass.type='lowshelf';this.bass.frequency.value=145;this.bass.gain.value=6;
   this.presence=c.createBiquadFilter();this.presence.type='peaking';this.presence.frequency.value=1800;this.presence.Q.value=.65;this.presence.gain.value=-7;
   this.saturation=c.createWaveShaper();const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i/(curve.length-1)*2-1;curve[i]=Math.tanh(x*1.18)/Math.tanh(1.18)*.90;}this.saturation.curve=curve;this.saturation.oversample='none';
   this.limiter=c.createDynamicsCompressor();this.limiter.threshold.value=-8;this.limiter.knee.value=6;this.limiter.ratio.value=5;this.limiter.attack.value=.003;this.limiter.release.value=.14;
   this.idleGain.connect(this.filter);this.loadGain.connect(this.filter);this.filter.connect(this.bass);this.bass.connect(this.presence);this.presence.connect(this.saturation);this.saturation.connect(this.limiter);this.limiter.connect(this.gain);this.gain.connect(c.destination);
   this.burstBuffer=c.createBuffer(1,Math.floor(c.sampleRate*.12),c.sampleRate);const data=this.burstBuffer.getChannelData(0);let seed=54;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*Math.exp(-i/data.length*7);}
  }
  return this.context;
 }
 async decode(file){const c=this.ensureContext();let b;try{b=await c.decodeAudioData(await file.arrayBuffer());}catch{throw new Error('Egzoz kaydı açılamadı. Yeniden dene.');}if(b.duration<.25)throw new Error('Egzoz kaydı eksik. Yeniden dene.');return b;}
 async loadDefault(){if(!this.pending)this.pending=Promise.all(['bfy-sahin-idle-steady.wav','bfy-sahin-load-steady.wav'].map(async name=>{const r=await fetch(new URL('./'+name,import.meta.url));if(!r.ok)throw new Error('Egzoz kaydı yüklenemedi. Yeniden dene.');return this.decode(await r.blob());})).finally(()=>this.pending=null);return this.pending;}
 async start(){
  if(this.enabled)return true;const token=++this.version,c=this.ensureContext();await c.resume();
  if(!this.buffer){const [idle,drive]=await this.loadDefault();if(token!==this.version||this.disposed)return false;this.buffer=idle;this.driveBuffer=drive;}
  if(token!==this.version||this.disposed||document.hidden)return false;
  const make=(buffer,dest,rate)=>{const s=c.createBufferSource();s.buffer=buffer;s.loop=true;s.playbackRate.value=rate;s.connect(dest);s.onended=()=>s.disconnect();s.start();return s;};
  this.idleGain.gain.value=.95;this.loadGain.gain.value=0;
  this.source=make(this.buffer,this.idleGain,.76);this.driveSource=make(this.driveBuffer,this.loadGain,.64);

  this.gain.gain.cancelScheduledValues(c.currentTime);this.gain.gain.setValueAtTime(0,c.currentTime);this.gain.gain.linearRampToValueAtTime(this.volume,c.currentTime+.08);
  this.enabled=true;this.lastGear=1;this.lastThrottle=0;this.shiftUntil=0;return true;
 }
 stop(){++this.version;if(this.source){const now=this.context.currentTime;this.gain.gain.cancelScheduledValues(now);this.gain.gain.setTargetAtTime(0,now,.015);for(const key of ['source','driveSource']){const s=this[key];s?.stop(now+.08);if(s)s.onended=()=>s.disconnect();this[key]=null;}}this.enabled=false;this.rev=false;}
 setVolume(value){this.volume=Math.max(0,Math.min(.6,Number(value)||0));if(this.enabled)this.gain.gain.setTargetAtTime(this.volume,this.context.currentTime,.06);}
 burst(amount=.065){const c=this.context,now=c.currentTime;if(now-this.lastBurst<.22)return;this.lastBurst=now;const s=c.createBufferSource(),g=c.createGain();s.buffer=this.burstBuffer;g.gain.value=amount;s.connect(g);g.connect(this.filter);s.onended=()=>{s.disconnect();g.disconnect();};s.start();}
 update(speed,running,telemetry={}){
  if(!this.enabled)return;const now=this.context.currentTime,kmh=Math.max(0,speed)*3.6,bands=[48,83,122,167,225];let gear=1;while(gear<5&&kmh>bands[gear-1])gear++;
  gear=telemetry.gear||gear;const low=gear===1?0:bands[gear-2]*.70,throttle=this.rev?1:telemetry.throttle??(running?1:0);
  const rpm=Math.max(850,Math.min(7000,telemetry.rpm??(this.rev?6100:running?Math.max(1300,1600+(kmh-low)/(bands[gear-1]-low)*5000):950)));
  if(gear!==this.lastGear){this.shiftUntil=now+.14;if(throttle>.45&&gear>this.lastGear)this.burst(.09);this.lastGear=gear;}
  if(this.lastThrottle>.65&&throttle<.15&&rpm>3800)this.burst(.055);this.lastThrottle=throttle;
  const shifting=now<this.shiftUntil,load=Math.min(1,Math.max(0,(rpm-1100)/3400)),blend=Math.min(1,load*.45+throttle*.85)*(shifting?.24:1);
  this.idleGain.gain.setTargetAtTime((1-blend)**2*.92,now,.06);this.loadGain.gain.setTargetAtTime(Math.sqrt(blend)*1.18,now,.045);
  this.source.playbackRate.setTargetAtTime(Math.min(1.02,.72+rpm/7000*.24),now,.09);
  this.driveSource.playbackRate.setTargetAtTime(Math.min(1.14,.64+Math.sqrt(Math.max(0,(rpm-950)/5550))*.48),now,.065);
  // The recordings carry the combustion texture; no added periodic oscillator.
  this.bass.gain.setTargetAtTime(5+throttle*2,now,.08);this.filter.frequency.setTargetAtTime(1300+throttle*1800+load*500,now,.065);
  this.gain.gain.setTargetAtTime(this.volume*(shifting?.70:1),now,.035);
 }
 dispose(){this.stop();this.disposed=true;this.context?.close();}
}
