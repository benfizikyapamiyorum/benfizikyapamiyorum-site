export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const GEARS=[0,48,83,122,167,225];
export function drivetrain(speed,throttle=0){
 const kmh=Math.max(0,speed)*3.6;let gear=1;
 while(gear<5&&kmh>GEARS[gear])gear++;
 const low=gear===1?0:GEARS[gear-1]*.70;
 const rpm=clamp(gear===1&&kmh<8?950+throttle*1900:1600+(kmh-low)/(GEARS[gear]-low)*5000,900,6800);
 return {gear,rpm};
}
// Dynamic bicycle with saturated, combined-slip axle forces. Game-tuned values,
// not measured Sahin tyre data. Longitudinal and lateral forces share mu * Fz.
// References: code.eng.buffalo.edu/dat/sites/tire/tire.html and MathWorks
// Combined Slip Wheel 2DOF. World forward is +x; positive yaw turns toward +z.
export const steeringAngle=c=>c.steer*.48/(1+Math.abs(c.v)*.035);
export function makeDriver(id,lane,s=0){return{id,lane,s,v:0,vy:0,yaw:0,steer:0,time:0,done:false,finishTime:null,contacts:0,hit:0,damage:0,yawRate:0,direction:1,driftIntent:0,gear:1,rpm:950,accel:0,spin:0,rearWheelSpeed:0,frontSkid:0,rearSkid:0,slipAngle:0,drifting:false,driftScore:0,driftChain:0,driftGrace:0};}
export function resetSlip(c){c.vy=0;c.yawRate=0;c.spin=0;c.rearWheelSpeed=c.v/.303;c.frontSkid=c.rearSkid=c.slipAngle=0;c.accel=0;c.driftIntent=0;c.drifting=false;c.driftChain=0;c.driftGrace=0;}
// Direction changes require a near stop, including sideways movement.
export function setDirection(c,direction){if(c.done||Math.hypot(c.v,c.vy)>.6)return false;c.direction=direction<0?-1:1;c.v=0;resetSlip(c);c.gear=c.direction<0?-1:1;return true;}
function advance(c,dt,curvature,length,laps){
 const along=(c.v*Math.cos(c.yaw)-c.vy*Math.sin(c.yaw))/clamp(1-curvature*c.lane,.45,1.55),across=c.v*Math.sin(c.yaw)+c.vy*Math.cos(c.yaw);
 c.yaw+=(c.yawRate-curvature*along)*dt;c.yaw=Math.atan2(Math.sin(c.yaw),Math.cos(c.yaw));c.lane+=across*dt;c.s+=along*dt;
 if(Math.abs(c.lane)>13.2){const impact=Math.abs(across);c.lane=Math.sign(c.lane)*13.2;c.yaw=-Math.sign(c.lane)*Math.min(.7,.2+Math.abs(c.yaw)*.3);c.v*=.45;resetSlip(c);if(c.hit===0){c.contacts++;c.damage=clamp(c.damage+.035+impact*.018,0,1);}c.hit=.85;}
 if(c.s>=length*laps){c.s=length*laps;c.done=true;c.finishTime=c.time;}
}
export function combinedForce(x,y,limit){const scale=Math.min(1,limit/Math.max(.001,Math.hypot(x,y)));return{x:x*scale,y:y*scale};}
function integrate(c,input,dt,curvature,length,laps){
 c.time+=dt;c.hit=Math.max(0,c.hit-dt);
 const throttle=clamp(input.gas||0,0,1),brake=clamp(input.brake||0,0,1),hand=clamp(input.handbrake||0,0,1),steer=clamp(input.steer||0,-1,1);
 c.steer+=(steer-c.steer)*(1-Math.exp(-dt*8));
 const mass=1100,lf=1.18,lr=1.30,wb=lf+lr,offroad=Math.abs(c.lane)>7.4,mu=offroad?.48:1.05;
 if(c.direction<0){
  const braking=Math.max(brake,hand),speed=Math.abs(c.v),acceleration=(braking?0:throttle)*3.1*(1-c.damage*.32)*(offroad?.55:1)-braking*10-(speed>.001?.35+speed*.035:0);
  c.v=-clamp(speed+acceleration*dt,0,6);const rate=c.v/wb*Math.tan(steeringAngle(c));c.yawRate+=(rate-c.yawRate)*(1-Math.exp(-dt*12));c.vy+=(lr*rate-c.vy)*(1-Math.exp(-dt*12));
  if(Math.abs(c.v)<.05&&(!throttle||braking)){c.v=0;c.vy=0;c.yawRate=0;}c.gear=-1;c.rpm=950+Math.abs(c.v)*360+throttle*500;c.spin=c.frontSkid=c.rearSkid=c.slipAngle=0;c.drifting=false;c.driftChain=0;c.rearWheelSpeed=c.v/.303;
  advance(c,dt,curvature,length,laps);return;
 }
 c.driftIntent=hand&&c.v>5?.85:Math.max(0,c.driftIntent-dt);
 const delta=steeringAngle(c),cs=Math.cos(delta),sn=Math.sin(delta);
 const transfer=clamp(c.accel,-9,7)*mass*.46/wb;
 const frontLoad=mass*9.81*lr/wb-transfer,rearLoad=mass*9.81*lf/wb+transfer;
 const af=Math.atan2(c.vy+lf*c.yawRate,Math.max(3,c.v))-delta;
 const ar=Math.atan2(c.vy-lr*c.yawRate,Math.max(3,c.v));
 const lowSpeed=clamp(c.v/3,0,1),frontLimit=mu*frontLoad;
 // Rear grip falls past the peak slip angle and with locked rear wheels.
 const rearLimit=mu*rearLoad*1.10*(1-(c.driftIntent>0?.08:0)*clamp((Math.abs(ar)-.10)/.5,0,1))*(1-hand*.68);
 const rearLateral=-rearLimit*Math.tanh(76000*ar/Math.max(1,rearLimit))*lowSpeed;
 // Reserve rear grip for cornering. A brief handbrake tap deliberately releases this assistance.
 const available=Math.sqrt(Math.max(0,rearLimit*rearLimit-rearLateral*rearLateral));
 const requested=throttle*mass*(6.4-3.5*Math.min(1,c.v/68))*(1-c.damage*.32)*(1-hand)*(1-brake);
 const drive=c.driftIntent>0?requested:Math.min(requested,available*(c.v<3&&Math.abs(c.steer)<.2?1.18:.88));
 const front=combinedForce(-brake*mass*8.7,-frontLimit*Math.tanh(60000*af/frontLimit)*lowSpeed,frontLimit);
 const rear=combinedForce(drive-brake*mass*4.5-hand*mass*6,rearLateral,rearLimit);
 const demandRatio=drive/Math.max(1,Math.sqrt(Math.max(0,rearLimit*rearLimit-rear.y*rear.y)));
 const spinTarget=hand?0:clamp((demandRatio-1)*.9,0,1.5);
 c.spin+=(spinTarget-c.spin)*(1-Math.exp(-dt*(spinTarget>c.spin?12:7)));
 const drag=.28+.00058*c.v*c.v+(offroad?2.5+c.v*.085:0);
 const ax=(rear.x+front.x*cs-front.y*sn)/mass+c.vy*c.yawRate-drag;
 const ay=(rear.y+front.y*cs+front.x*sn)/mass-c.v*c.yawRate;
 const angular=(lf*(front.y*cs+front.x*sn)-lr*rear.y)/1550;
 if(c.v<2){const rate=c.v/wb*Math.tan(delta);c.yawRate+=(rate-c.yawRate)*(1-Math.exp(-dt*12));c.vy+=(lr*rate-c.vy)*(1-Math.exp(-dt*12));}
 else{c.yawRate=clamp(c.yawRate+angular*dt,-3.5,3.5);c.vy=clamp(c.vy+ay*dt,-35,35);}
 // Modest stability assistance only when the driver lifts or countersteers; never follows the road.
 if(!hand){const counter=steer*c.vy>0&&Math.abs(steer)>.12,settle=counter?5:throttle<.2?2.5:0;if(settle){c.vy*=Math.exp(-dt*settle);const target=c.v/wb*Math.tan(delta);c.yawRate+=(target-c.yawRate)*(1-Math.exp(-dt*settle));}}
 c.v=clamp(c.v+ax*dt,0,69);c.accel+=(ax-c.accel)*(1-Math.exp(-dt*6));
 if(c.v<.1&&Math.abs(c.vy)<.15){c.vy=0;c.yawRate=0;}
 // Separate body heading from its velocity: countersteering catches a slide.
 advance(c,dt,curvature,length,laps);
 c.slipAngle=Math.atan2(c.vy,Math.max(.5,c.v));
 c.frontSkid=clamp((Math.abs(af)-.07)*3+clamp(brake*mass*8.7/frontLimit-1,0,1)*clamp(c.v/5,0,1),0,1);
 c.rearSkid=clamp(Math.max(c.spin*.95,(Math.abs(ar)-.055)*3,hand*clamp(c.v/5,0,1)),0,1);
 c.rearWheelSpeed=hand?0:(c.v+c.spin*Math.max(7,c.v))/.303;
 c.drifting=!offroad&&c.hit===0&&c.v>5&&Math.abs(c.slipAngle)>.11&&Math.abs(c.slipAngle)<1.25&&c.rearSkid>.15;
 if(c.drifting){const points=Math.hypot(c.v,c.vy)*Math.min(.85,Math.abs(c.slipAngle))*dt*12;c.driftScore+=points;c.driftChain+=points;c.driftGrace=.7;}
 else{c.driftGrace=Math.max(0,c.driftGrace-dt);if(c.driftGrace===0||offroad||c.hit>0)c.driftChain=0;}
 Object.assign(c,drivetrain(c.v,throttle));c.rpm=clamp(c.rpm+c.spin*2400,950,6800);

}
export function stepDriver(c,input,dt,curvature,length,laps=2){
 if(c.done||dt<=0)return;dt=clamp(dt,0,.04);
 // Bounded substeps keep tyre saturation stable on both 30 Hz and 120 Hz screens.
 const steps=Math.ceil(dt*120),h=dt/steps;
 for(let i=0;i<steps&&!c.done;i++)integrate(c,input,h,curvature,length,laps);
}
export function stepRival(c,dt,curvature,length,pace=1,laps=2){
 if(c.done)return;c.time+=dt;c.hit=Math.max(0,c.hit-dt);
 const turn=Math.abs(curvature),target=Math.min(57*pace,Math.sqrt(6.1*pace/Math.max(.001,turn)));
 c.v+=clamp(target-c.v,-12,5.8*pace)*dt;c.v=Math.max(0,c.v);
 c.lane+=(c.targetLane-c.lane)*Math.min(1,dt*1.7);c.s+=c.v*dt;
 Object.assign(c,drivetrain(c.v,c.v<target?1:.2));
 if(c.s>=length*laps){c.s=length*laps;c.done=true;c.finishTime=c.time;}
}
export function resolveContact(a,b){
 if(a.done||b.done||a.hit>0||b.hit>0)return false;
 if(Math.abs(a.s-b.s)>4.1||Math.abs(a.lane-b.lane)>1.75)return false;
 const dir=a.lane===b.lane?(a.id>b.id?1:-1):Math.sign(a.lane-b.lane);
 a.lane=clamp(a.lane+dir*.48,-13.2,13.2);b.lane=clamp(b.lane-dir*.48,-13.2,13.2);
 const mean=(a.v+b.v)*.5;a.v=Math.min(a.v,mean)*.88;b.v=Math.min(b.v,mean)*.92;
 const damage=.025+Math.abs(a.v-b.v)*.006;a.damage=clamp((a.damage||0)+damage,0,1);b.damage=clamp((b.damage||0)+damage,0,1);a.hit=b.hit=.8;a.contacts++;b.contacts++;return true;
}
export function standings(cars){return[...cars].sort((a,b)=>a.done&&b.done?a.finishTime-b.finishTime:a.done?-1:b.done?1:b.s-a.s);}
