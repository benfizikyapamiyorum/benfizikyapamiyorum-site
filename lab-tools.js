/* ===========================================================
   Ben Fizik Yapamıyorum — Paylaşılan ölçüm araçları
   makeMeasureTools(host): sürüklenebilir şerit metre + açıölçer
   host = {
     ctx,                         // 2D bağlam (sahne canvas'ı)
     w2s: (p) => ({x,y}),         // dünya(m) -> ekran(px)
     s2w: (px,py) => ({x,y}),     // ekran(px) -> dünya(m)
     pxPerMeter: () => number,    // (opsiyonel) ölçek
     colors: { tape, prot, ink }  // (opsiyonel)
   }
   Kullanım: host.draw'ın sonunda MT.draw(); işaretçilerde MT.onDown/onMove/onUp.
   =========================================================== */
(function(){
  "use strict";

  function makeMeasureTools(host){
    const ctx = host.ctx;
    const w2s = host.w2s, s2w = host.s2w;
    const COL = Object.assign({ tape:'#b8902f', prot:'#2d7dd2', ink:'#0e0c08' }, host.colors||{});
    const R  = 74;   // açıölçer yarıçapı (px)
    const HR = 9;    // tutamak yarıçapı (px)

    const tape = { on:false, a:null, b:null };       // a,b dünya noktaları
    const prot = { on:false, c:null, deg:35 };        // c dünya merkez, deg yataydan açı
    let grab = null;

    function cw(){ return ctx.canvas.clientWidth || ctx.canvas.width; }
    function ch(){ return ctx.canvas.clientHeight || ctx.canvas.height; }

    function defTape(){ tape.a = s2w(cw()*0.30, ch()*0.55); tape.b = s2w(cw()*0.62, ch()*0.55); }
    function defProt(){ prot.c = s2w(cw()*0.34, ch()*0.66); prot.deg = 35; }
    function toggleTape(){ tape.on=!tape.on; if(tape.on && !tape.a) defTape(); return tape.on; }
    function toggleProt(){ prot.on=!prot.on; if(prot.on && !prot.c) defProt(); return prot.on; }
    function anyOn(){ return tape.on || prot.on; }

    const dist = (ax,ay,bx,by)=>Math.hypot(ax-bx,ay-by);
    function distToSeg(px,py,a,b){
      const vx=b.x-a.x, vy=b.y-a.y, wx=px-a.x, wy=py-a.y;
      const c1=vx*wx+vy*wy; if(c1<=0) return dist(px,py,a.x,a.y);
      const c2=vx*vx+vy*vy; if(c2<=c1) return dist(px,py,b.x,b.y);
      const t=c1/c2; return dist(px,py,a.x+t*vx,a.y+t*vy);
    }
    function armTip(){
      const c=w2s(prot.c), a=-prot.deg*Math.PI/180;
      return { x:c.x+R*Math.cos(a), y:c.y+R*Math.sin(a), c };
    }

    function hitTest(px,py){
      if (prot.on && prot.c){
        const t=armTip();
        if (dist(px,py,t.x,t.y) <= HR+5) return {tool:'prot', part:'arm'};
        if (dist(px,py,t.c.x,t.c.y) <= HR+6) return {tool:'prot', part:'center'};
      }
      if (tape.on && tape.a && tape.b){
        const a=w2s(tape.a), b=w2s(tape.b);
        if (dist(px,py,a.x,a.y) <= HR+5) return {tool:'tape', part:'a'};
        if (dist(px,py,b.x,b.y) <= HR+5) return {tool:'tape', part:'b'};
        if (distToSeg(px,py,a,b) <= 9)   return {tool:'tape', part:'body'};
      }
      return null;
    }
    function onDown(px,py){
      const h=hitTest(px,py);
      if(!h) return false;
      grab = h; grab.downW = s2w(px,py);
      if (h.tool==='tape' && h.part==='body'){ grab.a0={x:tape.a.x,y:tape.a.y}; grab.b0={x:tape.b.x,y:tape.b.y}; }
      return true;
    }
    function onMove(px,py){
      if(!grab) return false;
      const w = s2w(px,py);
      if (grab.tool==='tape'){
        if (grab.part==='a') tape.a = w;
        else if (grab.part==='b') tape.b = w;
        else { const dx=w.x-grab.downW.x, dy=w.y-grab.downW.y; tape.a={x:grab.a0.x+dx,y:grab.a0.y+dy}; tape.b={x:grab.b0.x+dx,y:grab.b0.y+dy}; }
      } else if (grab.tool==='prot'){
        if (grab.part==='center') prot.c = w;
        else {
          const c=w2s(prot.c);
          let d = Math.atan2(c.y-py, px-c.x)*180/Math.PI;   // yukarı pozitif
          if (d<0) d = (px>=c.x) ? 0 : 180;
          prot.deg = Math.max(0, Math.min(180, d));
        }
      }
      return true;
    }
    function onUp(){ const had=!!grab; grab=null; return had; }

    function handle(p,color){
      ctx.fillStyle='#fff'; ctx.strokeStyle=color; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(p.x,p.y,HR,0,7); ctx.fill(); ctx.stroke();
      ctx.fillStyle=color; ctx.beginPath(); ctx.arc(p.x,p.y,3,0,7); ctx.fill();
    }
    function chip(text,x,y,color){
      ctx.font='bold 13px ui-monospace, Menlo, monospace';
      const tw=ctx.measureText(text).width;
      ctx.fillStyle='rgba(255,255,255,.92)'; ctx.fillRect(x,y-14,tw+12,19);
      ctx.strokeStyle=color; ctx.lineWidth=1; ctx.strokeRect(x,y-14,tw+12,19);
      ctx.fillStyle=COL.ink; ctx.fillText(text, x+6, y);
    }

    function draw(){
      // ŞERİT METRE
      if (tape.on && tape.a && tape.b){
        const a=w2s(tape.a), b=w2s(tape.b);
        ctx.save();
        ctx.strokeStyle=COL.tape; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        handle(a,COL.tape); handle(b,COL.tape);
        const dW = Math.hypot(tape.a.x-tape.b.x, tape.a.y-tape.b.y);   // metre
        const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
        chip(dW.toFixed(2)+' m', mx-26, my-8, COL.tape);
        ctx.restore();
      }
      // AÇIÖLÇER
      if (prot.on && prot.c){
        const c=w2s(prot.c);
        ctx.save();
        ctx.strokeStyle='rgba(45,125,210,.85)'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(c.x,c.y,R,Math.PI,2*Math.PI); ctx.stroke();   // üst yarım daire
        ctx.beginPath(); ctx.moveTo(c.x-R,c.y); ctx.lineTo(c.x+R,c.y); ctx.stroke();
        ctx.fillStyle='rgba(45,125,210,.85)'; ctx.font='9px ui-monospace, monospace';
        for (let d=0; d<=180; d+=10){
          const a=-d*Math.PI/180, r1=R, r0=R-(d%30===0?11:6);
          ctx.beginPath(); ctx.moveTo(c.x+r0*Math.cos(a), c.y+r0*Math.sin(a)); ctx.lineTo(c.x+r1*Math.cos(a), c.y+r1*Math.sin(a)); ctx.stroke();
          if (d%30===0){ const xl=c.x+(R-22)*Math.cos(a), yl=c.y+(R-22)*Math.sin(a); ctx.fillText(d+'', xl-7, yl+3); }
        }
        const t=armTip();
        ctx.strokeStyle=COL.prot; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.moveTo(c.x,c.y); ctx.lineTo(t.x,t.y); ctx.stroke();
        ctx.fillStyle='#fff'; ctx.strokeStyle=COL.prot; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.arc(c.x,c.y,7,0,7); ctx.fill(); ctx.stroke();
        handle({x:t.x,y:t.y}, COL.prot);
        chip(prot.deg.toFixed(0)+'°', c.x+10, c.y-8, COL.prot);
        ctx.restore();
      }
    }

    return { tape, prot, toggleTape, toggleProt, anyOn, draw, onDown, onMove, onUp, hitTest };
  }

  window.makeMeasureTools = makeMeasureTools;
})();
