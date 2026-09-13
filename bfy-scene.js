import * as THREE from './bfy-three.module.min.js';

// A decorative, self-hosted WebGL scene; learning simulations stay on their own pages.
const stage = document.getElementById('physics-stage');
const canvas = document.getElementById('physics-canvas');
const button = document.getElementById('motion-toggle');
if (stage && canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
    camera.position.set(3.8, 3.1, 6.9);
    camera.lookAt(.05, .05, 0);

    const environmentScene = new THREE.Scene();
    environmentScene.background = new THREE.Color('#dbe5d4');
    for (const [position,scale,intensity] of [ [[-4,4,2],[4,5,2],4], [[4,2,4],[3,6,1],2], [[0,6,-3],[6,1,3],3] ]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(...scale), new THREE.MeshBasicMaterial({color:new THREE.Color(1, .97, .87).multiplyScalar(intensity)}));
      panel.position.set(...position);
      environmentScene.add(panel);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(environmentScene, .025);
    scene.environment = environment.texture;
    environmentScene.traverse(object => {object.geometry?.dispose(); object.material?.dispose();});
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight('#f8f5df', '#46573b', 2.1));
    const key = new THREE.DirectionalLight('#fff4d6', 4.2);
    key.position.set(-3, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024,1024);
    key.shadow.camera.left = -4; key.shadow.camera.right = 4;
    key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
    key.shadow.normalBias = .025;
    key.shadow.bias = -.0003;
    scene.add(key);
    const rim = new THREE.DirectionalLight('#f7ffd9', 2);
    rim.position.set(4, 2, -4); scene.add(rim);
    const gold = new THREE.MeshStandardMaterial({color:'#c6a666',metalness:.88,roughness:.25});
    const darkGreen = new THREE.MeshStandardMaterial({color:'#42604b',metalness:.68,roughness:.25});
    const ivory = new THREE.MeshStandardMaterial({color:'#e7e6cf',metalness:.08,roughness:.58});
    const brass = new THREE.MeshStandardMaterial({color:'#b7a579',metalness:.92,roughness:.29});
    const sculpture = new THREE.Group();
    sculpture.position.set(.22,.28,0);
    sculpture.rotation.z = -.22;
    scene.add(sculpture);
    function mesh(geometry, material, parent = sculpture) {
      const object = new THREE.Mesh(geometry,material);
      object.castShadow = true; object.receiveShadow = true;
      parent.add(object); return object;
    }
    const outer = mesh(new THREE.TorusGeometry(1.22,.055,16,112),brass);
    outer.rotation.y = -.28;
    const middle = mesh(new THREE.TorusGeometry(1.06,.08,20,112),darkGreen);
    middle.rotation.set(.52, .82, .13);
    const inner = mesh(new THREE.TorusGeometry(.89,.037,16,96),gold);
    inner.rotation.set(-.7, -.7, .45);
    const core = mesh(new THREE.SphereGeometry(.39,48,32),gold);
    const axis = mesh(new THREE.CylinderGeometry(.025,.025,2.64,16),brass);
    axis.rotation.z = -.25;
    const satellite = mesh(new THREE.SphereGeometry(.10,24,16),ivory);
    satellite.position.set(1.08,.57,.1);
    const satellite2 = mesh(new THREE.SphereGeometry(.065,20,12),gold);
    satellite2.position.set(-.78,-.78,-.1);

    const pedestal = mesh(new THREE.CylinderGeometry(1.43,1.5,.15,96),ivory,scene);
    pedestal.position.set(.18,-1.27,0);
    const pedestalLine = mesh(new THREE.TorusGeometry(1.44,.014,8,96),brass,scene);
    pedestalLine.rotation.x = Math.PI/2; pedestalLine.position.set(.18,-1.205,0);
    const support = mesh(new THREE.CylinderGeometry(.12,.19,.2,32),brass,scene);
    support.position.set(.18,-1.09,0);
    const floor = mesh(new THREE.PlaneGeometry(20,20), new THREE.ShadowMaterial({opacity:.16}),scene);
    floor.rotation.x = -Math.PI/2; floor.position.y=-1.355; floor.castShadow=false;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let paused = motion.matches, visible = true, contextLost = false, frame = 0, previousTime = 0, elapsed = 0;
    const pointer = {x:0,y:0};
    function draw(time = 0) {
      frame = 0;
      const moving = !paused && !motion.matches;
      if (moving) {
        const dt = previousTime ? Math.min((time-previousTime)/1000,.05) : 0;
        elapsed += dt;
        middle.rotation.y = .82 + Math.sin(elapsed*.22)*.38;
        inner.rotation.x = -.7 + Math.sin(elapsed*.28)*.4;
        core.rotation.y = elapsed*.1;
        sculpture.rotation.y += (pointer.x*.20 - sculpture.rotation.y)*.04;
        sculpture.rotation.x += (pointer.y*.10 - sculpture.rotation.x)*.04;
      }
      previousTime = time;
      renderer.render(scene,camera);
      if (moving && visible && !document.hidden && !contextLost) frame = requestAnimationFrame(draw);
    }
    function refresh() {
      cancelAnimationFrame(frame); frame=0; previousTime=0;
      if (visible && !document.hidden && !contextLost) draw();
    }
    function resize() {
      const {width,height} = stage.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width,height,false);
      camera.aspect = width/height;
      camera.position.set(3.8,3.1,6.9);
      if (camera.aspect < .77) camera.position.multiplyScalar(1.13);
      camera.lookAt(.03,.02,0);
      camera.updateProjectionMatrix();
      refresh();
    }
    function buttonState() {
      const stopped = paused || motion.matches;
      button.setAttribute('aria-pressed',String(stopped));
      button.setAttribute('aria-label',stopped ? '3B hareketi başlat' : '3B hareketi durdur');
      button.querySelector('.motion-label').textContent=stopped?'Başlat':'Durdur';
      button.firstElementChild.textContent=stopped?'▷':'Ⅱ';
      button.hidden = motion.matches;
    }
    button.addEventListener('click',() => {paused=!paused;buttonState();refresh();});
    motion.addEventListener('change',() => {paused=motion.matches;buttonState();refresh();});
    stage.addEventListener('pointermove',event => {
      if (!fine.matches || paused || motion.matches) return;
      const rect=stage.getBoundingClientRect();
      pointer.x=(event.clientX-rect.left)/rect.width-.5;
      pointer.y=(event.clientY-rect.top)/rect.height-.5;
    });
    stage.addEventListener('pointerleave',() => {pointer.x=0;pointer.y=0;});
    new ResizeObserver(resize).observe(stage);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();},{threshold:.02}).observe(stage);
    document.addEventListener('visibilitychange',refresh);
    canvas.addEventListener('webglcontextlost',event => {event.preventDefault();contextLost=true;stage.classList.remove('ready');button.hidden=true;cancelAnimationFrame(frame);});
    canvas.addEventListener('webglcontextrestored',()=>{contextLost=false;stage.classList.add('ready');buttonState();resize();});
    resize(); stage.classList.add('ready'); buttonState();
  } catch {
    // The static sculpture is already present; the page stays usable without WebGL.
    stage.classList.remove('ready');
    if (button) button.hidden=true;
  }
}
