// Playback only: engine sound comes from a real recording chosen on the device.
// Audio is never uploaded; no synthetic motor is substituted for a missing sample.
export class RecordedEngine {
  constructor(){this.context=null;this.buffer=null;this.source=null;this.volume=.22;this.enabled=false;this.rev=false;}
  async load(file){
    if(file.size>40*1024*1024)throw new Error('Lütfen 40 MB’tan küçük bir motor kaydı seç.');
    const C=window.AudioContext||window.webkitAudioContext;if(!C)throw new Error('Bu tarayıcı ses oynatmayı desteklemiyor.');
    if(!this.context){this.context=new C();this.gain=this.context.createGain();this.gain.gain.value=this.volume;this.gain.connect(this.context.destination);}
    const decoded=await this.context.decodeAudioData(await file.arrayBuffer());
    if(decoded.duration<.25)throw new Error('Kayıt en az çeyrek saniye olmalı.');
    this.stop();this.buffer=decoded;return decoded.duration;
  }
  async start(){if(!this.buffer)throw new Error('Önce bir motor kaydı seç.');await this.context.resume();if(this.enabled)return;const s=this.context.createBufferSource();s.buffer=this.buffer;s.loop=true;s.connect(this.gain);s.start();this.source=s;this.enabled=true;}
  stop(){if(this.source){this.source.stop();this.source.disconnect();this.source=null;}this.enabled=false;this.rev=false;}
  setVolume(value){this.volume=Math.max(0,Math.min(.6,value));if(this.gain)this.gain.gain.setTargetAtTime(this.volume,this.context.currentTime,.05);}
  update(speed,running){if(!this.enabled)return;const phase=(Math.max(0,speed)*3.6)%38;const rate=this.rev?1.9:running?.85+phase/38: .65;this.source.playbackRate.setTargetAtTime(rate,this.context.currentTime,this.rev?.18:.28);}
  dispose(){this.stop();this.context?.close();}
}
