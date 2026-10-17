export const flightDuration = angle => 4 * Math.sin(angle * Math.PI / 180);
export function projectile(t, angle) {
  const a = angle * Math.PI / 180;
  const duration = flightDuration(angle);
  const elapsed = Math.max(0, Math.min(t, duration));
  return {x:20*Math.cos(a)*elapsed, y:Math.max(0,20*Math.sin(a)*elapsed-5*elapsed*elapsed), landed:t>=duration};
}
export const wireFieldMicrotesla = (current, radiusMetres=.1) => .2 * Math.abs(current) / radiusMetres;
export function lensImage(objectDistance, focalLength=12) {
  const distance = 1/(1/focalLength-1/objectDistance);
  return {distance, magnification:-distance/objectDistance, real:distance>0};
}
