export const clampSteer=v=>Math.max(-1,Math.min(1,v));
export function steeringFromDrag(start,dx,width,sensitivity=1){return clampSteer(start+dx/Math.max(44,width*.62)*sensitivity);}
export function installWheel(element,{canDrive,sensitivity=()=>1}){
 const state={value:0,active:false,pointer:null,startX:0,startValue:0};
 const render=()=>{element.style.setProperty('--turn',`${state.value*110}deg`);element.setAttribute('aria-valuenow',String(Math.round(state.value*100)));element.classList.toggle('turning',state.active);};
 const reset=()=>{state.value=0;state.active=false;state.pointer=null;render();};
 element.addEventListener('pointerdown',e=>{if(!canDrive()||state.pointer!==null)return;e.preventDefault();state.pointer=e.pointerId;state.startX=e.clientX;state.startValue=state.value;state.active=true;element.setPointerCapture(e.pointerId);render();});
 element.addEventListener('pointermove',e=>{if(e.pointerId!==state.pointer)return;state.value=steeringFromDrag(state.startValue,e.clientX-state.startX,element.getBoundingClientRect().width,sensitivity());render();});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(name,e=>{if(e.pointerId===state.pointer)reset();});
 element.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home'].includes(e.key)||!canDrive())return;e.preventDefault();e.stopPropagation();state.active=true;state.value=e.key==='Home'?0:clampSteer(state.value+(e.key==='ArrowRight'?.16:-.16));render();});
 element.addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.stopPropagation();reset();}});element.addEventListener('blur',reset);
 render();return{get value(){return state.value;},get active(){return state.active;},reset};
}
