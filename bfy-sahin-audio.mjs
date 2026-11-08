// Real exhaust sample, prepared from the source credited beside the controls.
// Device-selected recordings stay local. No synthesized engine is substituted.
export class RecordedEngine {
  constructor(){this.context=null;this.buffer=null;this.source=null;this.volume=.22;this.enabled=false;this.rev=false;this.pending=null;this.version=0;this.disposed=false;this.custom=false;}
  ensureContext(){
    if(this.disposed)throw new Error('Ses oturumu kapandı. Sayfayı yenile.');
    const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('Bu tarayıcı ses oynatmayı desteklemiyor.');
    if(!this.context){this.context=new C();this.gain=this.context.createGain();this.gain.gain.value=0;this.gain.connect(this.context.destination);}
    return this.context;
  }
  async decode(file){
    if(file.size>40*1024*1024)throw new Error('Lütfen 40 MB’tan küçük bir motor kaydı seç.');
    const context=this.ensureContext();let decoded;
    try{decoded=await context.decodeAudioData(await file.arrayBuffer());}catch{throw new Error('Ses dosyası açılamadı. WAV, MP3 veya M4A kaydı seç.');}
    if(decoded.duration<.25)throw new Error('Kayıt en az çeyrek saniye olmalı.');
    return decoded;
  }
  async load(file){const decoded=await this.decode(file);this.stop();this.buffer=decoded;this.custom=true;return decoded.duration;}
  async loadDefault(){
    if(!this.pending)this.pending=(async()=>{
      const response=await fetch(new URL('./bfy-sahin-egzoz.wav',import.meta.url));
      if(!response.ok)throw new Error('Egzoz kaydı yüklenemedi. Motoru çalıştır düğmesiyle yeniden dene.');
      return this.decode(await response.blob());
    })().catch(error=>{throw new Error(error.message==='Failed to fetch'?'Egzoz kaydı yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.':error.message);}).finally(()=>{this.pending=null;});
    return this.pending;
  }
  useDefault(){this.stop();this.buffer=null;this.custom=false;}
  async start(){
    if(this.enabled)return true;
    const token=++this.version,context=this.ensureContext();
    // Resume from the button gesture, before waiting for the download.
    await context.resume();
    if(!this.buffer){const buffer=await this.loadDefault();if(token!==this.version||this.disposed)return false;this.buffer=buffer;this.custom=false;}
    if(token!==this.version||this.disposed||document.hidden)return false;
    const s=context.createBufferSource();s.buffer=this.buffer;s.loop=true;s.playbackRate.value=.82;s.connect(this.gain);
    this.gain.gain.cancelScheduledValues(context.currentTime);this.gain.gain.setValueAtTime(0,context.currentTime);this.gain.gain.linearRampToValueAtTime(this.volume,context.currentTime+.04);
    s.onended=()=>s.disconnect();s.start();this.source=s;this.enabled=true;return true;
  }
  stop(){
    ++this.version;
    if(this.source){const now=this.context.currentTime;this.gain.gain.cancelScheduledValues(now);this.gain.gain.setTargetAtTime(0,now,.012);this.source.stop(now+.06);this.source=null;}
    this.enabled=false;this.rev=false;
  }
  setVolume(value){this.volume=Math.max(0,Math.min(.6,value));if(this.gain&&this.enabled)this.gain.gain.setTargetAtTime(this.volume,this.context.currentTime,.05);}
  update(speed,running){if(!this.enabled)return;const phase=(Math.max(0,speed)*3.6)%38;const rate=this.rev?1.65:running?.85+phase/38*.8:.82;this.source.playbackRate.setTargetAtTime(rate,this.context.currentTime,this.rev?.18:.28);}
  dispose(){this.stop();this.disposed=true;this.context?.close();}
}
