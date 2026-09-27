// One-dimensional, frictionless rigid-body collision. Positions are centre coordinates in metres.
export function solve({m1=2,m2=2,u1=4,u2=0,e=1,x1=-5,x2=5,width=1.8}={}){
  if (![m1,m2,u1,u2,e,x1,x2,width].every(Number.isFinite)||m1<=0||m2<=0||width<=0||e<0||e>1||x2-x1<width) throw new RangeError('Geçersiz deney parametresi');
  const relative=u1-u2, impact=relative>0?(x2-x1-width)/relative:Infinity;
  const momentum=m1*u1+m2*u2, energy=.5*(m1*u1*u1+m2*u2*u2);
  const v1=(momentum-m2*e*relative)/(m1+m2),v2=(momentum+m1*e*relative)/(m1+m2);
  const after=.5*(m1*v1*v1+m2*v2*v2);
  // Keep the aftermath visible longer; collision time, velocities and conserved quantities stay unchanged.
  const duration=Number.isFinite(impact)?impact+Math.max(3,Math.min(5,16/Math.max(Math.abs(v1),Math.abs(v2),1))):6;
  return {m1,m2,u1,u2,e,x1,x2,width,impact,v1,v2,momentum,energy,after,loss:Math.max(0,energy-after),duration};
}
export function sample(s,t){
  t=Math.max(0,t); const hit=t>=s.impact, before=Math.min(t,s.impact), after=hit?t-s.impact:0;
  const x1=s.x1+s.u1*before+s.v1*after,x2=s.x2+s.u2*before+s.v2*after;
  const v1=hit?s.v1:s.u1,v2=hit?s.v2:s.u2;
  return {x1,x2,v1,v2,hit,p:s.m1*v1+s.m2*v2,ke:.5*(s.m1*v1*v1+s.m2*v2*v2)};
}
