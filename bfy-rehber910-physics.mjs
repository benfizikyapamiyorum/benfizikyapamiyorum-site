export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export function pendulum(length=1, mass=1, time=0) {
  const period=2*Math.PI*Math.sqrt(length/10);
  return {period,angle:(8*Math.PI/180)*Math.cos(2*Math.PI*time/period),mass};
}
export function route(kind='corner') {
  return kind==='return' ? {path:6,dx:0,dz:0,result:0} : {path:7,dx:3,dz:-4,result:5};
}
export function buoyancy(density=800) {
  const volume=.001, weight=density*volume*10, fraction=Math.min(density/1000,1), lift=1000*10*volume*fraction;
  return {weight,fraction,lift,support:Math.max(0,weight-lift),floats:density<1000};
}
export function heating(heat=0,mass=1) {
  return {water:20+heat/(mass*4200),aluminium:20+heat/(mass*900)};
}
export function motion(time=0,acceleration=2) {
  const t=clamp(time,0,4);return {x:.5*acceleration*t*t,v:acceleration*t,area:.5*acceleration*t*t};
}
export function energy(height=2,mass=1) {
  const h=clamp(height,0,2);return {potential:mass*10*h,kinetic:mass*10*(2-h),total:mass*20,speed:Math.sqrt(20*(2-h))};
}
export function circuit(kind='series') {
  const parallel=kind==='parallel';return {resistance:parallel?3:12,total:parallel?2:.5,branch:parallel?1:.5,voltage:parallel?6:3,power:parallel?6:1.5};
}
export function wave(x,time=0,frequency=1,amplitude=.3) {
  return {wavelength:4/frequency,period:1/frequency,y:amplitude*Math.sin(2*Math.PI*(x/(4/frequency)-frequency*time))};
}
