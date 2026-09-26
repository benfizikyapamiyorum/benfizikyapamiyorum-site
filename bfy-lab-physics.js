/* SI units unless a public function explicitly accepts centimetres. */
window.BFYPhysics={
 period(L,g,angle){let a=1,b=Math.cos(angle/2);for(let i=0;i<12;i++){const next=(a+b)/2;b=Math.sqrt(a*b);a=next;}return 2*Math.PI*Math.sqrt(L/g)/a;},
 motion(p,t){const x=p.x0+p.v0*t+.5*p.a*t*t,v=p.v0+p.a*t,turn=p.a?-p.v0/p.a:-1;let d=Math.abs(x-p.x0);if(turn>0&&turn<t){const xt=p.x0+p.v0*turn+.5*p.a*turn*turn;d=Math.abs(xt-p.x0)+Math.abs(x-xt);}return {t,x,v,a:p.a,d};},
 pendulum(theta,omega,h,g,L,b){const f=(q,w)=>-g/L*Math.sin(q)-b*w,k1=f(theta,omega),q2=theta+omega*h/2,w2=omega+k1*h/2,k2=f(q2,w2),q3=theta+w2*h/2,w3=omega+k2*h/2,k3=f(q3,w3),q4=theta+w3*h,w4=omega+k3*h,k4=f(q4,w4);return {theta:theta+h*(omega+2*w2+2*w3+w4)/6,omega:omega+h*(k1+2*k2+2*k3+k4)/6};},
 // Biot–Savart integration of a circular loop; loop axis x, observation plane z=0.
 ring(x,y,R,I){let bx=0,by=0;const n=96,dp=2*Math.PI/n;for(let j=0;j<n;j++){const a=(j+.5)*dp,co=Math.cos(a),si=Math.sin(a),dy=y-R*co,dz=-R*si,r2=x*x+dy*dy+dz*dz;if(r2<1e-10)continue;const inv=1/Math.pow(r2,1.5);bx+=(R*R-R*y*co)*inv;by+=R*x*co*inv;}const k=1e-7*I*dp;return {x:k*bx,y:k*by};},
 field(p,wx,wy){const x=wx/100,y=wy/100,I=p.I*p.dir;if(p.src==='wire'){const r=Math.max(.005,Math.hypot(x,y)),k=2e-7*I/(r*r);return {x:-k*y,y:k*x};}if(p.src==='loop')return this.ring(x,y,p.R/100,I);let bx=0,by=0;const n=32;for(let i=0;i<n;i++){const center=(i+.5)/n*p.L/100-p.L/200,q=this.ring(x-center,y,.05,I*p.N/n);bx+=q.x;by+=q.y;}return {x:bx,y:by};},
 projectile(p){const a=p.ang*Math.PI/180,ux=p.v0*Math.cos(a),uy=p.v0*Math.sin(a),pts=[];let apex=p.h0;
 if(!p.drag){const flight=(uy+Math.sqrt(uy*uy+2*p.g*p.h0))/p.g,n=Math.max(200,Math.ceil(flight/.02));for(let i=0;i<=n;i++){const t=flight*i/n,vx=ux,vy=uy-p.g*t;pts.push({t,x:ux*t,y:Math.max(0,p.h0+uy*t-.5*p.g*t*t),vx,vy,v:Math.hypot(vx,vy)});}apex=p.h0+uy*uy/(2*p.g);}
 else{let state=[0,p.h0,ux,uy],t=0;const h=.008,k=p.k/p.m,f=s=>{const v=Math.hypot(s[2],s[3]);return [s[2],s[3],-k*v*s[2],-p.g-k*v*s[3]];},pack=(s,t)=>({t,x:s[0],y:s[1],vx:s[2],vy:s[3],v:Math.hypot(s[2],s[3])});pts.push(pack(state,0));for(let i=0;i<60000;i++){const a=f(state),b=f(state.map((x,j)=>x+a[j]*h/2)),c=f(state.map((x,j)=>x+b[j]*h/2)),d=f(state.map((x,j)=>x+c[j]*h));const next=state.map((x,j)=>x+h*(a[j]+2*b[j]+2*c[j]+d[j])/6);if(next[1]<=0){const fraction=state[1]/(state[1]-next[1]);state=state.map((x,j)=>x+(next[j]-x)*fraction);state[1]=0;pts.push(pack(state,t+h*fraction));break;}state=next;t+=h;apex=Math.max(apex,state[1]);pts.push(pack(state,t));}}
 const last=pts[pts.length-1];let maxV=0;for(const q of pts)maxV=Math.max(maxV,q.v);return {pts,max:{x:last.x,y:apex,t:last.t,v:maxV},stats:{range:last.x,flight:last.t,apex}};
 }
};
