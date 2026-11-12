// Real idle/load recordings remain the main engine voice. EQ, combustion harmonics
// and a limited shift transient reinforce the recording without hard clipping.
export class RecordedEngine {
 constructor(){this.context=null;this.buffer=null;this.driveBuffer=null;this.source=null;this.driveSource=null;this.volume=.42;this.enabled=false;this.rev=false;this.pending=null;this.version=0;this.disposed=false;this.lastGear=1;this.shiftUntil=0;this.lastThrottle=0;this.lastBurst=-1;}
 ensureContext(){
  if(this.disposed)throw new Error('Ses oturumu kapandı. Sayfayı yenile.');
  const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('Bu tarayıcı ses oynatmayı desteklemiyor.');
  if(!this.context){
   const c=this.context=new C();this.gain=c.createGain();this.gain.gain.value=0;this.idleGain=c.createGain();this.loadGain=c.createGain();this.pulseGain=c.createGain();this.pulseGain.gain.value=0;
   this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=6500;
   this.bass=c.createBiquadFilter();this.bass.type='lowshelf';this.bass.frequency.value=170;this.bass.gain.value=4;
   this.presence=c.createBiquadFilter();this.presence.type='peaking';this.presence.frequency.value=850;this.presence.Q.value=.8;this.presence.gain.value=2.2;
   this.saturation=c.createWaveShaper();const curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i/(curve.length-1)*2-1;curve[i]=Math.tanh(x*1.55)/Math.tanh(1.55)*.85;}this.saturation.curve=curve;this.saturation.oversample='2x';
   this.limiter=c.createDynamicsCompressor();this.limiter.threshold.value=-8;this.limiter.knee.value=6;this.limiter.ratio.value=5;this.limiter.attack.value=.003;this.limiter.release.value=.14;
   this.idleGain.connect(this.filter);this.loadGain.connect(this.filter);this.pulseGain.connect(this.filter);this.filter.connect(this.bass);this.bass.connect(this.presence);this.presence.connect(this.saturation);this.saturation.connect(this.limiter);this.limiter.connect(this.gain);this.gain.connect(c.destination);
   const real=new Float32Array(13),imag=new Float32Array(13);for(let i=1;i<13;i++)imag[i]=(i%2?.65:1)/Math.pow(i,1.35);this.combustion=c.createPeriodicWave(real,imag);
   this.burstBuffer=c.createBuffer(1,Math.floor(c.sampleRate*.12),c.sampleRate);const data=this.burstBuffer.getChannelData(0);let seed=54;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*Math.exp(-i/data.length*7);}
  }
  return this.context;
 }
 async decode(file){const c=this.ensureContext();let b;try{b=await c.decodeAudioData(await file.arrayBuffer());}catch{throw new Error('Egzoz kaydı açılamadı. Yeniden dene.');}if(b.duration<.25)throw new Error('Egzoz kaydı eksik. Yeniden dene.');return b;}
 async loadDefault(){if(!this.pending)this.pending=Promise.all(['bfy-sahin-egzoz.wav','bfy-sahin-drive.wav'].map(async name=>{const r=await fetch(new URL('./'+name,import.meta.url));if(!r.ok)throw new Error('Egzoz kaydı yüklenemedi. Yeniden dene.');return this.decode(await r.blob());})).finally(()=>this.pending=null);return this.pending;}
 async start(){
  if(this.enabled)return true;const token=++this.version,c=this.ensureContext();await c.resume();
  if(!this.buffer){const [idle,drive]=await this.loadDefault();if(token!==this.version||this.disposed)return false;this.buffer=idle;this.driveBuffer=drive;}
  if(token!==this.version||this.disposed||document.hidden)return false;
  const make=(buffer,dest,rate)=>{const s=c.createBufferSource();s.buffer=buffer;s.loop=true;s.playbackRate.value=rate;s.connect(dest);s.onended=()=>s.disconnect();s.start();return s;};
  this.idleGain.gain.value=.8;this.loadGain.gain.value=0;this.pulseGain.gain.value=.02;
  this.source=make(this.buffer,this.idleGain,.82);this.driveSource=make(this.driveBuffer,this.loadGain,.72);
  this.pulse=c.createOscillator();this.pulse.setPeriodicWave(this.combustion);this.pulse.frequency.value=950/30;this.pulse.connect(this.pulseGain);this.pulse.onended=()=>this.pulseGain.gain.value=0;this.pulse.start();
  this.gain.gain.cancelScheduledValues(c.currentTime);this.gain.gain.setValueAtTime(0,c.currentTime);this.gain.gain.linearRampToValueAtTime(this.volume,c.currentTime+.08);
  this.enabled=true;this.lastGear=1;this.lastThrottle=0;this.shiftUntil=0;return true;
 }
 stop(){++this.version;if(this.source){const now=this.context.currentTime;this.gain.gain.cancelScheduledValues(now);this.gain.gain.setTargetAtTime(0,now,.015);for(const key of ['source','driveSource','pulse']){const s=this[key];s?.stop(now+.08);if(s)s.onended=()=>s.disconnect();this[key]=null;}}this.enabled=false;this.rev=false;}
 setVolume(value){this.volume=Math.max(0,Math.min(.6,Number(value)||0));if(this.enabled)this.gain.gain.setTargetAtTime(this.volume,this.context.currentTime,.06);}
 burst(amount=.065){const c=this.context,now=c.currentTime;if(now-this.lastBurst<.22)return;this.lastBurst=now;const s=c.createBufferSource(),g=c.createGain();s.buffer=this.burstBuffer;g.gain.value=amount;s.connect(g);g.connect(this.filter);s.onended=()=>{s.disconnect();g.disconnect();};s.start();}
 update(speed,running,telemetry={}){
  if(!this.enabled)return;const now=this.context.currentTime,kmh=Math.max(0,speed)*3.6,bands=[48,83,122,167,225];let gear=1;while(gear<5&&kmh>bands[gear-1])gear++;
  gear=telemetry.gear||gear;const low=gear===1?0:bands[gear-2]*.70,throttle=this.rev?1:telemetry.throttle??(running?1:0);
  const rpm=Math.max(850,Math.min(7000,telemetry.rpm??(this.rev?6100:running?Math.max(1300,1600+(kmh-low)/(bands[gear-1]-low)*5000):950)));
  if(gear!==this.lastGear){this.shiftUntil=now+.14;if(throttle>.45&&gear>this.lastGear)this.burst(.09);this.lastGear=gear;}
  if(this.lastThrottle>.65&&throttle<.15&&rpm>3800)this.burst(.055);this.lastThrottle=throttle;
  const shifting=now<this.shiftUntil,load=Math.min(1,Math.max(0,(rpm-1100)/3400)),blend=load*(.22+throttle*.78)*(shifting?.24:1);
  this.idleGain.gain.setTargetAtTime((1-blend)*.72,now,.06);this.loadGain.gain.setTargetAtTime(Math.sqrt(blend)*1.12,now,.045);
  this.source.playbackRate.setTargetAtTime(Math.min(1.5,.69+rpm/6500*.78),now,.09);
  this.driveSource.playbackRate.setTargetAtTime(Math.min(1.65,.62+rpm/6500*.98),now,.065);
  this.pulse.frequency.setTargetAtTime(rpm/30,now,.055);this.pulseGain.gain.setTargetAtTime((.025+load*.075+throttle*.045)*(shifting?.25:1),now,.045);
  this.bass.gain.setTargetAtTime(2.5+throttle*3,now,.08);this.filter.frequency.setTargetAtTime(2100+throttle*4600+load*500,now,.065);
  this.gain.gain.setTargetAtTime(this.volume*(shifting?.70:1),now,.035);
 }
 dispose(){this.stop();this.disposed=true;this.context?.close();}
}
