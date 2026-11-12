// Real recording: Tom Haigh (audible-edge), loop edit by qubodup, CC BY 3.0.
// One decoded buffer and one loop per active sound session; shares the engine's
// master volume and limiter but bypasses its exhaust EQ.
export class RecordedTires {
 constructor(engine){this.engine=engine;this.buffer=null;this.pending=null;this.source=null;this.enabled=false;this.version=0;this.disposed=false;}
 async start(){
  if(this.disposed)return false;if(this.enabled)return true;
  const token=++this.version,c=this.engine.ensureContext();await c.resume();
  if(token!==this.version||this.disposed||document.hidden)return false;
  if(!this.gain){this.gain=c.createGain();this.gain.gain.value=0;this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=5200;this.gain.connect(this.filter);this.filter.connect(this.engine.limiter);}
  if(!this.buffer){
   if(!this.pending)this.pending=fetch(new URL('./bfy-tire-skid.wav',import.meta.url)).then(async r=>{if(!r.ok)throw Error('Lastik sesi yüklenemedi.');return c.decodeAudioData(await r.arrayBuffer());}).then(b=>{if(b.duration<.25)throw Error('Lastik kaydı eksik.');this.buffer=b;return b;}).finally(()=>this.pending=null);
   try{await this.pending;}catch{throw Error('Lastik sesi yüklenemedi. Ses düğmesiyle yeniden deneyebilirsin.');}
  }
  if(token!==this.version||this.disposed||document.hidden)return false;
  this.gain.gain.cancelScheduledValues(c.currentTime);this.gain.gain.setValueAtTime(0,c.currentTime);
  const s=this.source=c.createBufferSource();s.buffer=this.buffer;s.loop=true;s.playbackRate.value=.94;s.connect(this.gain);s.onended=()=>s.disconnect();s.start();this.enabled=true;return true;
 }
 update(intensity,speed){if(!this.enabled)return;const now=this.engine.context.currentTime,k=Math.max(0,Math.min(1,(intensity-.12)/.88));this.gain.gain.setTargetAtTime(Math.pow(k,1.1)*.62,now,k>0?.045:.09);this.source.playbackRate.setTargetAtTime(.88+k*.12+Math.min(1,Math.max(0,speed)/40)*.05,now,.12);}
 stop(){++this.version;const s=this.source;if(s){const now=this.engine.context.currentTime;this.gain.gain.cancelScheduledValues(now);this.gain.gain.setTargetAtTime(0,now,.015);s.stop(now+.08);this.source=null;}this.enabled=false;}
 dispose(){this.stop();this.disposed=true;this.gain?.disconnect();this.filter?.disconnect();}
}
