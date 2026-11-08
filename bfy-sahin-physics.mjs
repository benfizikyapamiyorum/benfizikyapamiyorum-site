// SI units. Cars start from rest under a constant net force, on separate lanes.
// This controlled classroom model is not a real engine/performance specification.
export function makeRace({mA=1000,mB=1400,fA=2000,fB=2000,distance=100}={}){
  if(![mA,mB,fA,fB,distance].every(Number.isFinite)||Math.min(mA,mB,fA,fB,distance)<=0)throw new RangeError('Pozitif kütle, kuvvet ve mesafe gerekli.');
  const aA=fA/mA,aB=fB/mB,tA=Math.sqrt(2*distance/aA),tB=Math.sqrt(2*distance/aB);
  return {mA,mB,fA,fB,distance,aA,aB,tA,tB,duration:Math.max(tA,tB),winner:Math.abs(tA-tB)<1e-9?'tie':tA<tB?'A':'B'};
}
export function raceSample(r,time){
  if(!Number.isFinite(time))throw new RangeError('Sonlu zaman gerekli.');
  const t=Math.max(0,Math.min(r.duration,time));
  // Both keep accelerating after the line until the slower car finishes.
  // No unmodelled stop or fake velocity change at the finish line.
  return {t,A:{x:.5*r.aA*t*t,v:r.aA*t,a:r.aA,p:r.fA*t,ke:.5*r.mA*(r.aA*t)**2,finished:t>=r.tA},B:{x:.5*r.aB*t*t,v:r.aB*t,a:r.aB,p:r.fB*t,ke:.5*r.mB*(r.aB*t)**2,finished:t>=r.tB}};
}
