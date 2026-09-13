import * as THREE from './bfy-three.module.min.js';

const canvases = [...document.querySelectorAll('[data-audience-scene]')];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const control = document.getElementById('audience-motion');
const views = [];
let paused = motion.matches;

function texture(draw, width=1024, height=1024) {
  const paper=document.createElement('canvas');paper.width=width;paper.height=height;
  draw(paper.getContext('2d'),width,height);
  const map=new THREE.CanvasTexture(paper);map.colorSpace=THREE.SRGBColorSpace;
  map.anisotropy=4;return map;
}
function pageTexture(left) {
  return texture((ctx,w,h)=>{
    ctx.fillStyle='#fffbed';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#dce4d0';ctx.lineWidth=2;
    for(let y=160;y<h-60;y+=58){ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(w-60,y);ctx.stroke();}
    ctx.fillStyle='#295445';ctx.font='700 66px sans-serif';ctx.fillText(left?'FİZİK':'KEŞFET.',65,105);
    ctx.fillStyle='#849171';ctx.font='25px sans-serif';ctx.fillText(left?'MERAK ET. DENE. ANLA.':'BİR SORU, YENİ BİR YOL.',65,150);
    if(left){
      ctx.strokeStyle='#66835e';ctx.lineWidth=6;
      ctx.beginPath();ctx.moveTo(100,650);ctx.lineTo(100,285);ctx.moveTo(100,650);ctx.lineTo(860,650);ctx.stroke();
      ctx.strokeStyle='#ba714f';ctx.lineWidth=12;ctx.beginPath();
      for(let i=0;i<=150;i++){let x=100+i*5,y=470-Math.sin(i/22)*145;if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
      ctx.fillStyle='#295445';ctx.font='italic 96px Georgia';ctx.fillText('F = m · a',150,830);
    }else{
      ctx.strokeStyle='#b8934f';ctx.lineWidth=8;
      for(const angle of [-.6,.6]){ctx.save();ctx.translate(490,465);ctx.rotate(angle);ctx.beginPath();ctx.ellipse(0,0,285,110,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
      ctx.fillStyle='#c47a55';ctx.beginPath();ctx.arc(490,465,44,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#536a4d';ctx.font='36px sans-serif';ctx.fillText('Birlikte yapabiliriz.',90,840);
    }
  });
}
function boardTexture() {
  const sheet=document.createElement('canvas');sheet.width=1024;sheet.height=640;
  const ctx=sheet.getContext('2d'),w=sheet.width,h=sheet.height;
  const map=new THREE.CanvasTexture(sheet);map.colorSpace=THREE.SRGBColorSpace;
  map.generateMipmaps=false;map.minFilter=THREE.LinearFilter;
  const clamp=v=>Math.max(0,Math.min(1,v));
  let lastFrame=-1;
  const pen={x:68,y:240,writing:false,erasing:false};
  function update(time){
    const tick=Math.floor(time*24);if(tick===lastFrame)return pen;lastFrame=tick;
    const t=time%17;
    ctx.fillStyle='#214d43';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#ffffff09';ctx.lineWidth=1;
    for(let x=0;x<w;x+=55){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=55){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.fillStyle='#b8cbb0';ctx.font='600 26px sans-serif';ctx.fillText('BİRLİKTE, ADIM ADIM.',68,78);
    ctx.font='700 90px sans-serif';const headerWidth=ctx.measureText('Ben fizik').width;
    const head=clamp(t/1.2);
    ctx.save();ctx.beginPath();ctx.rect(65,130,headerWidth*head+3,125);ctx.clip();
    ctx.fillStyle='#fff8e6';ctx.fillText('Ben fizik',68,239);ctx.restore();
    ctx.font='700 91px sans-serif';
    const positive=t>=6.6,word=positive?'yapabiliyorum':'yapamıyorum';
    const width=ctx.measureText(word).width;
    const write=positive?clamp((t-6.7)/2.15):clamp((t-1.4)/1.85);
    const wipe=positive?0:clamp((t-5)/1.5);
    ctx.save();ctx.beginPath();ctx.rect(68+width*wipe,285,Math.max(0,width*(write-wipe))+2,135);ctx.clip();
    ctx.globalAlpha=t>15.5?clamp((17-t)/1.5):1;
    ctx.fillStyle=positive?'#d5f49c':'#fff8e6';ctx.fillText(word,68,387);ctx.restore();
    if(positive){
      ctx.strokeStyle='#d5f49c';ctx.globalAlpha=t>15.5?clamp((17-t)/1.5):1;
      ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(68,424);ctx.lineTo(68+width*clamp((t-9)/.75),424);ctx.stroke();ctx.globalAlpha=1;
    }
    ctx.fillStyle='#a9c3ad';ctx.font='25px sans-serif';ctx.fillText('DENE. ANLAT. CESARET VER.',68,560);
    pen.erasing=t>=5&&t<6.5;
    pen.writing=t<1.2||(t>=1.4&&t<3.25)||(t>=6.7&&t<8.85);
    pen.x=t<1.2?68+headerWidth*head:68+width*(pen.erasing?wipe:write);
    pen.y=(t<1.2?225:370)+Math.sin(t*26)*(pen.erasing?26:12);
    map.needsUpdate=true;return pen;
  }
  return {map,update};
}

for(const canvas of canvases) {
  const card=canvas.closest('[data-role]');
  try{
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.94;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(36,1,.1,30);
    const student=canvas.dataset.audienceScene==='ogrenci';
    camera.position.set(student?1.4:.65,student?2.1:.78,student?4.6:4.4);camera.lookAt(0,.02,0);
    const environmentScene=new THREE.Scene();environmentScene.background=new THREE.Color('#e7e8d6');
    for(const [pos,dim,power] of [[[-3,4,3],[3,5,1],4],[[4,3,1],[2,5,2],2],[[0,5,-4],[5,1,3],3]]){
      const lamp=new THREE.Mesh(new THREE.BoxGeometry(...dim),new THREE.MeshBasicMaterial({color:new THREE.Color(1,.97,.9).multiplyScalar(power)}));
      lamp.position.set(...pos);environmentScene.add(lamp);
    }
    const generator=new THREE.PMREMGenerator(renderer);
    const env=generator.fromScene(environmentScene,.025);scene.environment=env.texture;generator.dispose();
    environmentScene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
    scene.add(new THREE.HemisphereLight('#ffffec','#6b7453',1.4));
    const light=new THREE.DirectionalLight('#fff1cd',2.8);light.position.set(-3,6,5);light.castShadow=true;
    light.shadow.mapSize.set(512,512);light.shadow.normalBias=.025;light.shadow.bias=-.0002;
    light.shadow.camera.left=-3;light.shadow.camera.right=3;light.shadow.camera.top=3;light.shadow.camera.bottom=-3;
    scene.add(light);
    const fill=new THREE.DirectionalLight('#e3f4df',1.1);fill.position.set(4,2,-3);scene.add(fill);
    const group=new THREE.Group();scene.add(group);
    const green=new THREE.MeshStandardMaterial({color:'#315746',metalness:.15,roughness:.35});
    const clay=new THREE.MeshStandardMaterial({color:'#bb704f',metalness:.06,roughness:.42});
    const paper=new THREE.MeshStandardMaterial({color:'#faf4dd',metalness:0,roughness:.6});
    const wood=new THREE.MeshStandardMaterial({color:'#ccae79',metalness:.1,roughness:.42});
    const gold=new THREE.MeshStandardMaterial({color:'#d1ae69',metalness:.88,roughness:.23});
    const dark=new THREE.MeshStandardMaterial({color:'#203d34',metalness:.6,roughness:.3});
    const chalk=new THREE.MeshStandardMaterial({color:'#fff9df',roughness:.9});
    function mesh(geo,mat,pos=[0,0,0],parent=group){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
    const base=mesh(new THREE.CylinderGeometry(1.4,1.48,.18,80),paper,[0,-.99,0]);
    const edge=mesh(new THREE.TorusGeometry(1.39,.012,8,80),gold,[0,-.898,0]);edge.rotation.x=Math.PI/2;
    const floor=mesh(new THREE.PlaneGeometry(12,12),new THREE.ShadowMaterial({opacity:.14}),[0,-1.085,0],scene);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
    let animate;
    if(canvas.dataset.audienceScene==='ogrenci'){
      const book=new THREE.Group();book.position.set(.02,-.54,.5);book.rotation.set(.36,-.08,0);book.scale.setScalar(1.12);group.add(book);
      for(const side of [-1,1]){
        const cover=mesh(new THREE.BoxGeometry(.92,.05,1.3),green,[side*.46,0,0],book);cover.rotation.z=side*-.015;
        mesh(new THREE.BoxGeometry(.85,.09,1.22),paper,[side*.46,.065,0],book);
        const pageGeo=new THREE.PlaneGeometry(.86,1.22,20,1);pageGeo.rotateX(-Math.PI/2);
        const positions=pageGeo.attributes.position;
        for(let i=0;i<positions.count;i++){const u=(positions.getX(i)/.86+.5);positions.setY(i,.10*Math.pow(side===1?1-u:u,3));}
        pageGeo.computeVertexNormals();
        mesh(pageGeo,new THREE.MeshBasicMaterial({map:pageTexture(side===-1),side:THREE.DoubleSide}),[side*.45,.116,0],book);
      }
      mesh(new THREE.CylinderGeometry(.028,.028,1.22,12),wood,[0,.10,0],book).rotation.x=Math.PI/2;
      const leaf=new THREE.Group();leaf.position.set(0,.19,0);book.add(leaf);
      const leafGeo=new THREE.PlaneGeometry(.86,1.2);leafGeo.rotateX(-Math.PI/2);
      mesh(leafGeo,new THREE.MeshBasicMaterial({map:pageTexture(false),side:THREE.DoubleSide}),[.43,0,0],leaf);
      const bulb=new THREE.Group();bulb.position.set(-.08,.59,-.18);group.add(bulb);
      const glow=new THREE.MeshStandardMaterial({color:'#ffe2a0',emissive:'#ffc866',emissiveIntensity:.5,roughness:.27,metalness:.08});
      mesh(new THREE.SphereGeometry(.34,40,28),glow,[0,.1,0],bulb).scale.y=1.1;
      mesh(new THREE.CylinderGeometry(.13,.12,.2,28),gold,[0,-.27,0],bulb);
      for(const y of [-.21,-.27,-.33])mesh(new THREE.TorusGeometry(.133,.016,8,32),dark,[0,y,0],bulb).rotation.x=Math.PI/2;
      mesh(new THREE.SphereGeometry(.078,20,12),dark,[0,-.39,0],bulb).scale.y=.6;
      const rays=[];
      for(let i=0;i<7;i++){
        const a=i*Math.PI*2/7;
        const ray=mesh(new THREE.CylinderGeometry(.016,.016,.15,10),gold,[Math.sin(a)*.59,.1+Math.cos(a)*.59,0],bulb);
        ray.rotation.z=-a;rays.push(ray);
      }
      const pencil=new THREE.Group();pencil.position.set(.62,-.14,.67);pencil.rotation.set(.12,0,-.42);group.add(pencil);
      mesh(new THREE.CylinderGeometry(.034,.034,.84,6),clay,[0,.40,0],pencil);
      mesh(new THREE.ConeGeometry(.034,.12,12),wood,[0,-.065,0],pencil).rotation.z=Math.PI;
      mesh(new THREE.ConeGeometry(.012,.04,10),dark,[0,-.14,0],pencil).rotation.z=Math.PI;
      mesh(new THREE.CylinderGeometry(.035,.035,.075,16),gold,[0,.845,0],pencil);
      animate=t=>{
        const turn=t%7.5,progress=Math.min(turn/1.65,1);
        leaf.visible=turn<1.65;leaf.rotation.z=Math.PI*(progress*progress*(3-2*progress));
        pencil.position.x=.57+Math.sin(t*1.8)*.28;pencil.position.z=.61+Math.sin(t*3.6)*.04;
        pencil.rotation.z=-.42+Math.sin(t*2.4)*.14;
        bulb.position.y=.59+Math.sin(t*1.25)*.065;
        glow.emissiveIntensity=.35+(Math.sin(t*1.9)+1)*.4;
        rays.forEach((r,i)=>r.scale.y=.75+(Math.sin(t*1.9-i*.35)+1)*.35);
      };
    }else{
      const board=new THREE.Group();board.position.set(0,.22,-.32);board.rotation.y=-.04;group.add(board);
      mesh(new THREE.BoxGeometry(2.47,1.59,.14),wood,[0,.30,0],board);
      const handwriting=boardTexture(),faceWidth=2.31,faceHeight=1.44;
      const boardFace=mesh(new THREE.PlaneGeometry(faceWidth,faceHeight),new THREE.MeshBasicMaterial({map:handwriting.map}),[0,.30,.076],board);
      boardFace.castShadow=false;
      for(const x of [-.60,.60]){const leg=mesh(new THREE.BoxGeometry(.075,1.18,.075),wood,[x,-.55,-.015],board);leg.rotation.x=-.12;}
      mesh(new THREE.BoxGeometry(2.57,.07,.20),wood,[0,-.52,.075],board);
      const chalkStick=mesh(new THREE.CylinderGeometry(.025,.025,.23,16),chalk,[0,0,.16],board);chalkStick.rotation.z=-.7;
      const eraser=new THREE.Group();board.add(eraser);
      mesh(new THREE.BoxGeometry(.14,.30,.07),wood,[0,0,.16],eraser);
      mesh(new THREE.BoxGeometry(.14,.30,.025),dark,[0,0,.117],eraser);
      function closedBook(x,y,z,angle,material){
        const b=new THREE.Group();b.position.set(x,y,z);b.rotation.y=angle;group.add(b);
        mesh(new THREE.BoxGeometry(.88,.055,.65),material,[0,0,0],b);
        mesh(new THREE.BoxGeometry(.83,.085,.60),paper,[0,.06,0],b);
        mesh(new THREE.BoxGeometry(.88,.04,.65),material,[0,.12,0],b);
        mesh(new THREE.BoxGeometry(.035,.14,.65),material,[-.425,.052,0],b);
        return b;
      }
      closedBook(.56,-.79,.56,.18,clay);closedBook(.56,-.64,.56,-.15,green);
      const cradle=new THREE.Group();cradle.position.set(-.62,-.56,.65);cradle.scale.setScalar(.60);group.add(cradle);
      mesh(new THREE.BoxGeometry(1.15,.10,.66),green,[0,-.40,0],cradle);
      for(const z of [-.23,.23]){
        for(const x of [-.52,.52])mesh(new THREE.CylinderGeometry(.026,.026,.9,12),gold,[x,.08,z],cradle);
        const rail=mesh(new THREE.CylinderGeometry(.028,.028,1.10,12),gold,[0,.54,z],cradle);rail.rotation.z=Math.PI/2;
      }
      const swings=[];
      for(let i=0;i<4;i++){
        const p=new THREE.Group();p.position.set((i-1.5)*.235,.52,0);cradle.add(p);
        for(const z of [-.20,.20]){
          const start=new THREE.Vector3(0,0,z),end=new THREE.Vector3(0,-.54,0);
          const thread=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,start.distanceTo(end),6),dark);
          thread.position.copy(start).add(end).multiplyScalar(.5);
          thread.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.clone().sub(start).normalize());p.add(thread);
        }
        mesh(new THREE.SphereGeometry(.117,28,20),gold,[0,-.62,0],p);swings.push(p);
      }
      animate=t=>{
        const wave=Math.sin(t*2.2);swings[0].rotation.z=Math.max(0,wave)*.65;swings[3].rotation.z=Math.min(0,wave)*.65;
        const pen=handwriting.update(t);
        const x=-faceWidth/2+pen.x/1024*faceWidth,y=.30+faceHeight/2-pen.y/640*faceHeight;
        chalkStick.visible=pen.writing;chalkStick.position.set(x+.045,y+.065,.17);
        eraser.visible=pen.erasing;eraser.position.set(x,y+.035,0);
      };
    }
    // Reduced motion gets the completed encouraging message, never a blank board.
    animate(motion.matches?12:0);
    let visible=false,lost=false,frame=0,previous=0,elapsed=0;
    const pointer={x:0,y:0};
    function draw(now=0){
      frame=0;
      if(!paused&&!motion.matches){
        elapsed+=previous?Math.max(0,(now-previous)/1000):0;
        animate(elapsed);
        group.rotation.y+=(pointer.x*(student ? .32 : .12)-group.rotation.y)*.045;
        group.rotation.x+=(-pointer.y*.10-group.rotation.x)*.045;
      }
      previous=now;renderer.render(scene,camera);
      if(visible&&!document.hidden&&!paused&&!motion.matches&&!lost)frame=requestAnimationFrame(draw);
    }
    function refresh(){cancelAnimationFrame(frame);frame=0;previous=0;if(visible&&!document.hidden&&!lost)draw();}
    function resize(){
      const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
      renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;
      camera.position.set(student?1.4:.65,student?2.1:.78,student?4.6:4.4);if(camera.aspect<.86)camera.position.multiplyScalar(1.12);
      camera.lookAt(0,.02,0);camera.updateProjectionMatrix();
      if(!lost)renderer.render(scene,camera);refresh();
    }
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();},{threshold:.03}).observe(card);
    card.addEventListener('pointermove',event=>{
      if(!fine.matches||paused||motion.matches)return;
      const r=card.getBoundingClientRect();pointer.x=(event.clientX-r.left)/r.width-.5;pointer.y=(event.clientY-r.top)/r.height-.5;
    });
    card.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0;});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);card.classList.remove('scene-ready');});
    canvas.addEventListener('webglcontextrestored',()=>{lost=false;card.classList.add('scene-ready');resize();});
    views.push({refresh,still:()=>{animate(12);renderer.render(scene,camera);}});resize();card.classList.add('scene-ready');
  }catch{card.classList.remove('scene-ready');}
}

function updateControl(){
  if(!control)return;
  control.hidden=!views.length||motion.matches;
  control.setAttribute('aria-pressed',String(paused));
  control.setAttribute('aria-label',paused?'Rol kartlarındaki 3B hareketi başlat':'Rol kartlarındaki 3B hareketi durdur');
  control.querySelector('span').textContent=paused?'3B hareketi başlat':'3B hareketi durdur';
  control.firstChild.textContent=paused?'▷ ':'Ⅱ ';
}
control?.addEventListener('click',()=>{paused=!paused;updateControl();views.forEach(v=>v.refresh());});
motion.addEventListener('change',()=>{paused=motion.matches;updateControl();views.forEach(v=>{if(motion.matches)v.still();v.refresh();});});
document.addEventListener('visibilitychange',()=>views.forEach(v=>v.refresh()));
updateControl();
