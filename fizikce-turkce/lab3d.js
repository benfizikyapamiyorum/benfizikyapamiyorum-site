/* Yerel, bağımlılıksız 3B geometri. Kameraya göre perspektif ve derinlik sıralaması. */
(function(root){
  'use strict';
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
  const Physics={
    floating(rho){const density=clamp(rho,.8,1.6);return {density,volume:60/density,fraction:.6/density,weight:.6,buoyancy:.6};},
    friction(force){const f=clamp(force,0,12),moving=f>8,friction=moving?5:f;return {force:f,moving,friction,net:f-friction};},
    refraction(degrees){const i=clamp(degrees,0,70)*Math.PI/180,r=Math.asin(Math.sin(i)/1.5);return {i,r,degrees:r*180/Math.PI};},
    project(point,yaw,pitch,width,height){const [x,y,z]=point,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);const xx=cy*x-sy*z,zz=sy*x+cy*z,yy=cp*(y-.05)-sp*zz,depth=5.4-(sp*(y-.05)+cp*zz),scale=Math.min(width*.95,height*1.52)/depth;return {x:width/2+xx*scale,y:height*.51-yy*scale,depth};}
  };
  function create(canvas,onChange){
    const ctx=canvas.getContext('2d');if(!ctx)return null;
    let scene='float',value=1,yaw=-.5,pitch=.35,width=400,height=242,drag=null,frame=0;
    const format=n=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1}).format(n);
    let framing={scale:1,x:0,y:0};
    const project=p=>{const v=Physics.project(p,yaw,pitch,width,height);return {...v,x:v.x*framing.scale+framing.x,y:v.y*framing.scale+framing.y};};
    function fitScene(){
      const b=scene==='float'?[-1.4,1.4,-1.4,1.28,-.975,.975]:scene==='force'?[-1.68,1.68,-.63,1.57,-.53,.55]:[-1.41,1.3,-1.15,1.55,-.95,.95];
      const points=[];for(const x of b.slice(0,2))for(const y of b.slice(2,4))for(const z of b.slice(4,6))points.push(Physics.project([x,y,z],yaw,pitch,width,height));
      const left=Math.min(...points.map(p=>p.x)),right=Math.max(...points.map(p=>p.x)),top=Math.min(...points.map(p=>p.y)),bottom=Math.max(...points.map(p=>p.y));
      const scale=Math.min(Math.max(1,width-40)/(right-left),Math.max(1,height-44)/(bottom-top));
      framing={scale,x:width/2-(left+right)*scale/2,y:height/2-(top+bottom)*scale/2};
    }
    const poly=(points,color,alpha=1)=>({points,color,alpha,depth:points.reduce((sum,p)=>sum+project(p).depth,0)/points.length});
    function cube(center,size,color,alpha=1){
      const [x,y,z]=center,[w,h,d]=size;const v=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([a,b,c])=>[x+a*w/2,y+b*h/2,z+c*d/2]);
      const sides=[[0,1,2,3],[4,7,6,5],[3,2,6,7],[0,4,5,1],[1,5,6,2],[0,3,7,4]];const shades=[.77,.94,1.08,.62,.85,.68];
      return sides.map((face,i)=>poly(face.map(n=>v[n]),color.map(c=>clamp(Math.round(c*shades[i]),0,255)),alpha));
    }
    function path(points,color,lineWidth=2,dashed=false){ctx.beginPath();points.map(project).forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.setLineDash(dashed?[4,5]:[]);ctx.stroke();ctx.setLineDash([]);}
    function arrow(start,end,color,label){const a=project(start),b=project(end),dx=b.x-a.x,dy=b.y-a.y,ang=Math.atan2(dy,dx);ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-9*Math.cos(ang-.42),b.y-9*Math.sin(ang-.42));ctx.lineTo(b.x-9*Math.cos(ang+.42),b.y-9*Math.sin(ang+.42));ctx.closePath();ctx.fill();if(label)text(label,b.x,b.y-12,color);}
    function text(str,x,y,color='#24453c'){ctx.font='600 12px system-ui';const m=ctx.measureText(str);const xx=clamp(x,5,width-m.width-5),yy=clamp(y,16,height-7);ctx.fillStyle='rgba(247,249,238,.93)';ctx.fillRect(xx-4,yy-13,m.width+8,18);ctx.fillStyle=color;ctx.fillText(str,xx,yy);}
    function drawFace(face){const p=face.points.map(project);ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.closePath();ctx.fillStyle=`rgba(${face.color.join(',')},${face.alpha})`;ctx.fill();ctx.strokeStyle=`rgba(31,69,59,${Math.min(.2,face.alpha*.35)})`;ctx.lineWidth=.7;ctx.stroke();}
    function describe(){
      if(scene==='float'){const f=Physics.floating(value);return {title:'Sıvı yoğunluğu',min:.8,max:1.6,step:.1,value,unit:' g/cm³',lesson:'yuzuyor-ve-dengede',result:`Batan hacim: ${format(f.volume)} cm³. Yoğunluk artınca cisim daha az batar; kaldırma kuvveti yine 0,6 N.`,assumptions:'100 cm³, 60 g cisim · g = 10 m/s² · başka düşey kuvvet yok · yüzme dengesi',aria:`Üç boyutlu yüzen küp. Batan hacim ${format(f.volume)} santimetreküp. Kaldırma kuvveti ağırlığa eşit.`};}
      if(scene==='force'){const f=Physics.friction(value);return {title:'İtme kuvveti',min:0,max:12,step:1,value,unit:' N',lesson:'statik-surtunme',result:f.moving?`Kayma başladı. Sürtünme 5 N; net kuvvet ${format(f.net)} N sağa.`:`Kutu duruyor. Statik sürtünme ${format(f.friction)} N; net kuvvet sıfır.`,assumptions:'Yatay düzlem · statik sürtünme sınırı 8 N · kinetik sürtünme 5 N · N = G = 10 N',aria:`Kuvvet okları olan üç boyutlu kutu. İtme ${f.force} newton, sürtünme ${f.friction} newton.`};}
      const f=Physics.refraction(value);return {title:'Gelme açısı',min:0,max:70,step:5,value,unit:'°',lesson:'normale-yaklasiyor',result:`Gelme açısı ${value}°, kırılma açısı ${format(f.degrees)}°. ${value===0?'Işın normal boyunca yön değiştirmeden geçer.':'Işın camda normale yaklaşır.'}`,assumptions:'Hava: n = 1 · cam: n = 1,5 · açılar yüzey normalinden ölçülür',aria:`Üç boyutlu hava cam ara yüzeyi, normal ve ışınlar. Gelme açısı ${value} derece, kırılma açısı ${format(f.degrees)} derece.`};
    }
    function draw(){
      if(width<=0||height<=0)return;
      fitScene();
      ctx.clearRect(0,0,width,height);const faces=[],lines=[],arrows=[];
      // Döndürülen yer düzlemi: geometriyi ve derinliği görünür kılan sakin kılavuz.
      const floor=scene==='float'?-1.45:scene==='force'?-.02:-1.15;
      for(let i=-3;i<=3;i++){lines.push([[i*.45,floor,-1.35],[i*.45,floor,1.35]]);lines.push([[-1.35,floor,i*.45],[1.35,floor,i*.45]]);}
      lines.forEach(line=>path(line,'rgba(78,105,79,.13)',1));
      if(scene==='float'){
        const f=Physics.floating(value),bottom=-f.fraction,top=1-f.fraction;
        faces.push(...cube([0,bottom/2,0],[.96,f.fraction,.96],[103,154,133]));
        faces.push(...cube([0,top/2,0],[.96,top,.96],[194,219,151]));
        faces.push(...cube([0,-.7,0],[2.8,1.4,1.95],[138,190,207],.22));
        arrows.push([[.63,.15,.53],[.63,1.28,.53],'#255e50','Fₖ = 0,6 N']);
        arrows.push([[-.62,.2,.55],[-.62,-.96,.55],'#c06136','G = 0,6 N']);
      }else if(scene==='force'){
        const f=Physics.friction(value);faces.push(...cube([0,.45,0],[1.05,.9,.95],[189,213,146]));
        if(f.force>0)arrows.push([[0,.5,.53],[.3+f.force*.115,.5,.53],'#255e50',`İtme: ${f.force} N`]);
        if(f.friction>0)arrows.push([[0,.45,.55],[-.3-f.friction*.115,.45,.55],'#c06136',`Sürtünme: ${f.friction} N`]);
        arrows.push([[.04,.54,-.53],[.04,1.57,-.53],'#386a59','N = 10 N']);
        arrows.push([[.04,.48,-.53],[.04,-.63,-.53],'#956044','G = 10 N']);
      }else{
        const f=Physics.refraction(value);faces.push(...cube([0,-.52,0],[2.6,1.04,1.9],[154,199,210],.3));
        const start=[-Math.sin(f.i)*1.5,Math.cos(f.i)*1.5,0],end=[Math.sin(f.r)*1.16,-Math.cos(f.r)*1.16,0];
        arrows.push([start,[0,0,0],'#255e50','']);arrows.push([[0,0,0],end,'#c06136','']);
      }
      faces.sort((a,b)=>b.depth-a.depth).forEach(drawFace);
      if(scene==='float')path([[-1.4,0,-.975],[1.4,0,-.975],[1.4,0,.975],[-1.4,0,.975],[-1.4,0,-.975]],'rgba(52,111,123,.45)',1.2);
      if(scene==='light'){
        path([[0,-1.15,0],[0,1.55,0]],'#71856a',1.7,true);
        const f=Physics.refraction(value),pts=Array.from({length:18},(_,j)=>[-.43*Math.sin(f.i*j/17),.43*Math.cos(f.i*j/17),0]);path(pts,'#8c7853',1.6);
        let p=project([.1,1.55,0]);text('Normal',p.x,p.y);p=project([-1.22,.32,.82]);text('Hava',p.x,p.y);p=project([.82,-.86,.75]);text('Cam',p.x,p.y);
      }
      arrows.forEach(a=>arrow(...a));
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;draw();});}
    function resize(){const bounds=canvas.getBoundingClientRect();width=bounds.width;height=bounds.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);schedule();}
    function announce(){const info=describe();canvas.setAttribute('aria-label',info.aria);onChange(info);schedule();}
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
    canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.012;pitch=clamp(pitch+(e.clientY-drag.y)*.008,-.08,.95);drag={x:e.clientX,y:e.clientY};schedule();});
    const end=()=>{drag=null;canvas.classList.remove('dragging');};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
    new ResizeObserver(resize).observe(canvas);resize();announce();
    return {setScene(s){if(!['float','force','light'].includes(s))return;scene=s;value=s==='float'?1:s==='force'?3:30;yaw=-.5;pitch=.35;announce();},setValue(v){const info=describe();value=clamp(v,info.min,info.max);announce();},camera(action){if(action==='reset'){yaw=-.5;pitch=.35;}else yaw+=(action==='left'?-.3:.3);schedule();},describe};
  }
  const api={Physics,create};if(typeof module==='object'&&module.exports)module.exports=api;else root.FizikceLab3D=api;
})(typeof window!=='undefined'?window:globalThis);
