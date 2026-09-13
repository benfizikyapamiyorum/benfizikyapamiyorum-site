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
  return texture((ctx,w,h)=>{
    ctx.fillStyle='#214d43';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#ffffff0b';ctx.lineWidth=1;
    for(let x=0;x<w;x+=55){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=55){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.fillStyle='#dcead1';ctx.font='700 45px sans-serif';ctx.fillText('BİRLİKTE KEŞFEDELİM.',55,80);
    ctx.fillStyle='#edf3d9';ctx.font='italic 123px Georgia';ctx.fillText('F = m · a',65,280);
    ctx.strokeStyle='#bdd2b4';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(670,455);ctx.lineTo(670,205);ctx.moveTo(670,455);ctx.lineTo(945,455);ctx.stroke();
    ctx.fillStyle='#d6e5bd';ctx.font='32px sans-serif';ctx.fillText('x',643,195);ctx.fillText('t',950,462);
    ctx.strokeStyle='#edc377';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(680,447);ctx.quadraticCurveTo(850,433,919,240);ctx.stroke();
    ctx.fillStyle='#a8c394';ctx.font='25px sans-serif';ctx.fillText('DÜŞÜN. SOR. DENE.',65,435);
    ctx.strokeStyle='#e4bb73';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(65,312);ctx.lineTo(548,312);ctx.stroke();
  },1024,600);
}

for(const canvas of canvases) {
  const card=canvas.closest('[data-role]');
  try{
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.94;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(36,1,.1,30);
    camera.position.set(3.1,2.55,5.6);camera.lookAt(0,.02,0);
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
    light.shadow.mapSize.set(1024,1024);light.shadow.normalBias=.025;light.shadow.bias=-.0002;
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
      const book=new THREE.Group();book.position.set(.02,-.66,.38);book.rotation.y=-.18;group.add(book);
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
      const orbit=new THREE.Group();orbit.position.set(-.23,.52,-.15);orbit.rotation.set(.18,.35,-.28);group.add(orbit);
      const ring=mesh(new THREE.TorusGeometry(.57,.022,12,80),gold,[0,0,0],orbit);ring.rotation.y=.35;
      const ring2=mesh(new THREE.TorusGeometry(.56,.017,12,80),green,[0,0,0],orbit);ring2.rotation.set(.95,-.5,.15);
      mesh(new THREE.SphereGeometry(.235,40,24),gold,[0,0,0],orbit);
      const electron=mesh(new THREE.SphereGeometry(.07,20,12),clay,[.45,.32,.1],orbit);
      const arrowGroup=new THREE.Group();arrowGroup.position.set(.82,-.13,.3);arrowGroup.rotation.z=-.38;group.add(arrowGroup);
      mesh(new THREE.CylinderGeometry(.022,.022,.75,12),clay,[0,0,0],arrowGroup);
      mesh(new THREE.ConeGeometry(.095,.22,24),clay,[0,.47,0],arrowGroup);
      const pencil=mesh(new THREE.CylinderGeometry(.032,.032,1.15,6),gold,[-.9,-.55,.13]);pencil.rotation.set(.12,0,-.48);
      mesh(new THREE.ConeGeometry(.034,.13,12),dark,[-1.19,-1.085,.11]).visible=false;
      animate=t=>{orbit.position.y=.52+Math.sin(t*.65)*.065;ring2.rotation.y=-.5+Math.sin(t*.36)*.28;electron.position.x=.45+Math.sin(t*.32)*.025;};
    }else{
      const board=new THREE.Group();board.position.set(0,.24,-.3);board.rotation.y=-.12;group.add(board);
      mesh(new THREE.BoxGeometry(1.83,1.23,.14),wood,[0,.30,0],board);
      const boardFace=mesh(new THREE.PlaneGeometry(1.69,1.08),new THREE.MeshStandardMaterial({map:boardTexture(),roughness:.9,envMapIntensity:.35}),[0,.30,.076],board);
      boardFace.castShadow=false;
      for(const x of [-.60,.60]){const leg=mesh(new THREE.BoxGeometry(.075,1.18,.075),wood,[x,-.55,-.015],board);leg.rotation.x=-.12;}
      mesh(new THREE.BoxGeometry(1.93,.07,.20),wood,[0,-.34,.075],board);
      const chalkStick=mesh(new THREE.CylinderGeometry(.025,.025,.28,16),chalk,[.39,-.29,.13],board);chalkStick.rotation.z=Math.PI/2;
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
      animate=t=>{const wave=Math.sin(t*1.7);swings[0].rotation.z=Math.max(0,wave)*.45;swings[3].rotation.z=Math.min(0,wave)*.45;};
    }
    let visible=false,lost=false,frame=0,previous=0,elapsed=0;
    const pointer={x:0,y:0};
    function draw(now=0){
      frame=0;
      if(!paused&&!motion.matches){
        elapsed+=previous?Math.min((now-previous)/1000,.05):0;
        animate(elapsed);
        group.rotation.y+=(pointer.x*.35-group.rotation.y)*.045;
        group.rotation.x+=(-pointer.y*.14-group.rotation.x)*.045;
      }
      previous=now;renderer.render(scene,camera);
      if(visible&&!document.hidden&&!paused&&!motion.matches&&!lost)frame=requestAnimationFrame(draw);
    }
    function refresh(){cancelAnimationFrame(frame);frame=0;previous=0;if(visible&&!document.hidden&&!lost)draw();}
    function resize(){
      const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
      renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;
      camera.position.set(3.1,2.55,5.6);if(camera.aspect<.86)camera.position.multiplyScalar(1.12);
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
    views.push({refresh});resize();card.classList.add('scene-ready');
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
motion.addEventListener('change',()=>{paused=motion.matches;updateControl();views.forEach(v=>v.refresh());});
document.addEventListener('visibilitychange',()=>views.forEach(v=>v.refresh()));
updateControl();
