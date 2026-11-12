export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const GEARS=[0,48,83,122,167,225];
export function drivetrain(speed,throttle=0){
 const kmh=Math.max(0,speed)*3.6;let gear=1;
 while(gear<5&&kmh>GEARS[gear])gear++;
 const low=gear===1?0:GEARS[gear-1]*.70;
 const rpm=clamp(gear===1&&kmh<8?950+throttle*1900:1600+(kmh-low)/(GEARS[gear]-low)*5000,900,6800);
 return {gear,rpm};
}
export function makeDriver(id,lane,s=0){return{id,lane,s,v:0,yaw:0,steer:0,time:0,done:false,finishTime:null,contacts:0,hit:0,damage:0,yawRate:0,gear:1,rpm:950};}
export function stepDriver(c,input,dt,curvature,length,laps=2){
 if(c.done)return;dt=clamp(dt,0,.04);c.time+=dt;c.hit=Math.max(0,c.hit-dt);
 const throttle=clamp(input.gas||0,0,1),brake=clamp(input.brake||0,0,1),steer=clamp(input.steer||0,-1,1);
 c.steer+=(steer-c.steer)*Math.min(1,dt*8);
 const acceleration=throttle*(7.7-4.6*Math.min(1,c.v/68))*(1-(c.damage||0)*.32)-.28-.00058*c.v*c.v-brake*15;
 c.v=clamp(c.v+acceleration*dt,0,69);
 // Bicycle steering in road coordinates. With zero steering, world heading stays
 // constant: subtract only the road's change of heading, never auto-align to it.
 const offroad=Math.abs(c.lane)>7.4,steerAngle=c.steer*.48/(1+c.v*.07),grip=offroad?.63:1;
 const targetYawRate=c.v/2.48*Math.tan(steerAngle)*grip;
 c.yawRate+=(targetYawRate-c.yawRate)*Math.min(1,dt*9);
 const along=c.v*Math.cos(c.yaw)/clamp(1-curvature*c.lane,.45,1.55);
 c.yaw+= (c.yawRate-curvature*along)*dt;c.yaw=Math.atan2(Math.sin(c.yaw),Math.cos(c.yaw));
 c.lane+=Math.sin(c.yaw)*c.v*dt;c.s+=along*dt;
 if(offroad)c.v=Math.max(0,c.v-(2.5+c.v*.085)*dt);
 if(Math.abs(c.lane)>13.2){const impact=Math.abs(Math.sin(c.yaw)*c.v);c.lane=Math.sign(c.lane)*13.2;c.yaw=-Math.sign(c.lane)*Math.min(.7,.2+Math.abs(c.yaw)*.3);c.yawRate=0;c.v*=.45;if(c.hit===0){c.contacts++;c.damage=clamp(c.damage+.035+impact*.018,0,1);}c.hit=.85;}
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
 a.lane=clamp(a.lane+dir*.48,-13.2,13.2);b.lane=clamp(b.lane-dir*.48,-13.2,13.2);
 const mean=(a.v+b.v)*.5;a.v=Math.min(a.v,mean)*.88;b.v=Math.min(b.v,mean)*.92;
 const damage=.025+Math.abs(a.v-b.v)*.006;a.damage=clamp((a.damage||0)+damage,0,1);b.damage=clamp((b.damage||0)+damage,0,1);a.hit=b.hit=.8;a.contacts++;b.contacts++;return true;
}
export function standings(cars){return[...cars].sort((a,b)=>a.done&&b.done?a.finishTime-b.finishTime:a.done?-1:b.done?1:b.s-a.s);}
