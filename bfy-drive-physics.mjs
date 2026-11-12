export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const GEARS=[0,48,83,122,167,225];
export function drivetrain(speed,throttle=0){
 const kmh=Math.max(0,speed)*3.6;let gear=1;
 while(gear<5&&kmh>GEARS[gear])gear++;
 const low=gear===1?0:GEARS[gear-1]*.70;
 const rpm=clamp(gear===1&&kmh<8?950+throttle*1900:1600+(kmh-low)/(GEARS[gear]-low)*5000,900,6800);
 return {gear,rpm};
}
export function makeDriver(id,lane,s=0){return{id,lane,s,v:0,yaw:0,steer:0,time:0,done:false,finishTime:null,contacts:0,hit:0,gear:1,rpm:950};}
export function stepDriver(c,input,dt,curvature,length,laps=2){
 if(c.done)return;dt=clamp(dt,0,.04);c.time+=dt;c.hit=Math.max(0,c.hit-dt);
 const throttle=clamp(input.gas||0,0,1),brake=clamp(input.brake||0,0,1),steer=clamp(input.steer||0,-1,1);
 c.steer+=(steer-c.steer)*Math.min(1,dt*8);
 const acceleration=throttle*(7.7-4.6*Math.min(1,c.v/68))-.28-.00058*c.v*c.v-brake*15;
 c.v=clamp(c.v+acceleration*dt,0,69);
 // Assisted arcade steering: the road heading is followed, but fast turns push the car outward.
 c.yaw+=(c.steer*(.40+c.v*.008)-c.yaw*3.2-curvature*c.v*.48)*dt;
 c.yaw=clamp(c.yaw,-.50,.50);c.lane+=Math.sin(c.yaw)*c.v*dt;
 const shoulder=Math.abs(c.lane)>6.15;
 if(shoulder)c.v=Math.max(0,c.v-(3+c.v*.11)*dt);
 if(Math.abs(c.lane)>7.1){c.lane=Math.sign(c.lane)*7.1;c.yaw*=-.25;c.v*=.72;if(c.hit===0)c.contacts++;c.hit=.8;}
 c.s+=c.v*Math.max(.75,Math.cos(c.yaw))*dt;
 Object.assign(c,drivetrain(c.v,throttle));
 if(c.s>=length*laps){c.s=length*laps;c.done=true;c.finishTime=c.time;}
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
 a.lane=clamp(a.lane+dir*.48,-7.1,7.1);b.lane=clamp(b.lane-dir*.48,-7.1,7.1);
 const mean=(a.v+b.v)*.5;a.v=Math.min(a.v,mean)*.88;b.v=Math.min(b.v,mean)*.92;
 a.hit=b.hit=.8;a.contacts++;b.contacts++;return true;
}
export function standings(cars){return[...cars].sort((a,b)=>a.done&&b.done?a.finishTime-b.finishTime:a.done?-1:b.done?1:b.s-a.s);}
