/* Shared smartboard workspace. Existing experiment nodes and physics stay alive. */
(() => {
  'use strict';
  const init = () => {
    const grid = document.querySelector('.a3-grid,.lab-grid,.lab,.layout');
    const stage = document.getElementById('stage');
    if (!grid || !stage || document.getElementById('bfy-board')) return;
    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => [...root.querySelectorAll(s)];
    const title = document.title.split('|')[0].split(':')[0].trim();
    const home = document.createComment('BFY experiment original position');
    grid.before(home);
    const opener = document.createElement('button');
    opener.type = 'button'; opener.className = 'board-launch';
    opener.innerHTML = '<span aria-hidden="true">▣</span><span>Akıllı tahtada aç<small>Büyük kontroller · çizim · ders akışı</small></span><span aria-hidden="true">↗</span>';
    grid.before(opener);
    const shell = document.createElement('section');
    shell.id = 'bfy-board'; shell.hidden = true;
    shell.setAttribute('role','dialog'); shell.setAttribute('aria-modal','true'); shell.setAttribute('aria-labelledby','board-title');
    shell.innerHTML = `
      <header class="board-head"><a class="board-brand" href="akilli-tahta.html" aria-label="Akıllı tahta deney kütüphanesi">bfy<span>LAB</span></a><div class="board-heading"><small>AKILLI TAHTA / DENEY MASASI</small><h2 id="board-title"></h2></div><nav aria-label="Tahta kontrolleri"><button type="button" data-action="lesson" aria-expanded="false" aria-controls="board-lesson">Ders akışı</button><button type="button" data-action="fullscreen" aria-pressed="false">Tam ekran</button><button type="button" data-action="close" aria-label="Tahta modundan çık">Çık ×</button></nav></header>
      <div class="board-work"></div>
      <aside id="board-lesson" class="board-lesson" aria-label="Ders akışı" hidden><div class="board-lesson-head"><span>DENE · GÖZLEMLE · AÇIKLA</span><button type="button" data-action="lesson" aria-label="Ders akışını kapat">×</button></div><p class="board-count"></p><h3></h3><p class="board-instruction"></p><div class="board-prompt">Önce sınıfa sor: Sence ne olacak? Tahminleri aldıktan sonra deneyi birlikte yapın.</div><button type="button" data-action="reveal" aria-expanded="false">Açıklamayı göster</button><p class="board-answer" hidden></p><div class="board-lesson-nav"><button type="button" data-action="previous">← Önceki</button><button type="button" data-action="next">Sonraki →</button></div></aside>
      <footer class="board-dock"><div class="board-toolset" role="group" aria-label="Sahne araçları"><button type="button" data-tool="interact" aria-pressed="true">↖ <span>Deneyi yönet</span></button><button type="button" data-tool="pen" aria-pressed="false">✎ <span>Kalem</span></button><button type="button" data-tool="erase" aria-pressed="false">⌫ <span>Silgi</span></button></div><div class="board-toolset board-colors" role="group" aria-label="Kalem rengi"><button type="button" data-color="#f7c65b" style="--ink:#f7c65b" aria-label="Sarı kalem" aria-pressed="true"></button><button type="button" data-color="#ff665f" style="--ink:#ff665f" aria-label="Kırmızı kalem" aria-pressed="false"></button><button type="button" data-color="#56c8ff" style="--ink:#56c8ff" aria-label="Mavi kalem" aria-pressed="false"></button><button type="button" data-color="#ffffff" style="--ink:#ffffff" aria-label="Beyaz kalem" aria-pressed="false"></button></div><div class="board-toolset"><button type="button" data-action="undo" disabled>↶ <span>Geri al</span></button><button type="button" data-action="clear" disabled>Çizimi temizle</button></div><span class="board-status" role="status" aria-live="polite">Sahneyi sürükle, değişkenleri keşfet.</span><a href="akilli-tahta.html" class="board-library">Deneyler ↗</a></footer>`;
    $('#board-title', shell).textContent = title;
    document.body.append(shell);
    const lessonData = $$('.bfy-experiment').map(el => ({title:$('h4',el)?.textContent, instruction:$(':scope > p',el)?.textContent, answer:$('details p',el)?.textContent}));
    if (!lessonData.length) $('[data-action="lesson"]',shell).hidden = true;
    const main = grid.firstElementChild;
    grid.classList.add('board-grid'); main.classList.add('board-scene-column');
    grid.lastElementChild.classList.add('board-controls');
    // Give every visual slider a proper label, without replacing its listeners.
    const rangeSyncs=[];
    $$('input[type="range"]',grid).forEach((input,i) => {
      const label = input.closest('.ctrl,.row,.timeline')?.querySelector('label');
      if (label) { if (!input.id) input.id = `board-range-${i}`; if (!label.htmlFor) label.htmlFor=input.id; }
      if (input.id === 'timeline') return;
      const wrap = document.createElement('div'); wrap.className='board-stepper'; input.before(wrap); wrap.append(input);
      const name = (label ? [...label.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').trim() : '') || input.getAttribute('aria-label') || 'Değer';
      const buttons = [-1,1].map(dir => {
        const btn=document.createElement('button'); btn.type='button'; btn.className='board-step'; btn.textContent=dir<0?'−':'+';
        btn.setAttribute('aria-label',`${name} ${dir<0?'azalt':'artır'}`);
        btn.addEventListener('click',()=>{ if(input.disabled)return; dir<0?input.stepDown():input.stepUp(); input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})); sync(); });
        dir<0?wrap.prepend(btn):wrap.append(btn); return btn;
      });
      const sync=()=>{buttons[0].disabled=input.disabled||+input.value<=+(input.min||0);buttons[1].disabled=input.disabled||+input.value>=+(input.max||100);};
      rangeSyncs.push(sync); input.addEventListener('input',sync); input.addEventListener('change',sync);
      new MutationObserver(sync).observe(input,{attributes:true,attributeFilter:['disabled','min','max','step']}); sync();
    });
    grid.addEventListener('click',()=>queueMicrotask(()=>rangeSyncs.forEach(sync=>sync())));
    const svgNS='http://www.w3.org/2000/svg', ink=document.createElementNS(svgNS,'svg');
    ink.classList.add('board-ink'); ink.setAttribute('viewBox','0 0 1000 1000'); ink.setAttribute('preserveAspectRatio','none'); ink.setAttribute('aria-hidden','true');
    stage.append(ink);
    let active=false, tool='interact', color='#f7c65b', pointer=null, path=null, points=[], strokes=[], history=[], lesson=0, previousFocus, inerted=[];
    const say=text=>$('.board-status',shell).textContent=text;
    const historyState=()=>{ $('[data-action="undo"]',shell).disabled=!history.length; $('[data-action="clear"]',shell).disabled=!strokes.length; };
    const render=()=>{ ink.replaceChildren(); strokes.forEach(s=>{const p=document.createElementNS(svgNS,'polyline'); p.setAttribute('points',s.points.map(p=>p.join(',')).join(' '));p.setAttribute('fill','none');p.setAttribute('stroke',s.color);p.setAttribute('stroke-width','4');p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');p.setAttribute('vector-effect','non-scaling-stroke');ink.append(p);}); historyState(); };
    const remember=()=>{ history.push(strokes.slice()); if(history.length>60)history.shift(); };
    function setTool(next){ tool=next; ink.dataset.tool=tool; ink.style.pointerEvents=active&&tool!=='interact'?'auto':'none'; ink.style.cursor=tool==='erase'?'cell':'crosshair'; $$('[data-tool]',shell).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===tool))); say(tool==='interact'?'Sahneyi sürükle, değişkenleri keşfet.':tool==='pen'?'Sahnenin üzerine çiz. Deneye dönmek için “Deneyi yönet”.':'Silmek istediğin çizgiye dokun.'); }
    function lessonRender(){ const d=lessonData[lesson]; if(!d)return; $('.board-count',shell).textContent=`DENEY ${String(lesson+1).padStart(2,'0')} / ${String(lessonData.length).padStart(2,'0')}`;$('.board-lesson h3',shell).textContent=d.title;$('.board-instruction',shell).textContent=d.instruction;$('.board-answer',shell).textContent=d.answer;$('.board-answer',shell).hidden=true;const reveal=$('[data-action="reveal"]',shell);reveal.textContent='Açıklamayı göster';reveal.setAttribute('aria-expanded','false');$('[data-action="previous"]',shell).disabled=lesson===0;$('[data-action="next"]',shell).disabled=lesson===lessonData.length-1; }
    function open(){
      if(active)return; active=true; previousFocus=document.activeElement;
      $('.board-work',shell).append(grid); shell.hidden=false;document.body.classList.add('board-active');
      inerted=[...document.body.children].filter(el=>el!==shell && !el.inert && !['SCRIPT','STYLE','LINK'].includes(el.tagName));inerted.forEach(el=>el.inert=true);
      // Prevent the old fullscreen controls from hiding the teacher controls.
      const url=new URL(location.href);url.searchParams.set('tahta','1');historyReplace(url);
      rangeSyncs.forEach(sync=>sync()); setTool('interact'); lessonRender(); $('[data-action="close"]',shell).focus(); window.dispatchEvent(new Event('resize'));
    }
    function historyReplace(url){window.history.replaceState(window.history.state,'',url);}
    async function close(){
      if(document.fullscreenElement===shell)try{await document.exitFullscreen();}catch{}
      active=false;setTool('interact');home.after(grid);shell.hidden=true;document.body.classList.remove('board-active');inerted.forEach(el=>el.inert=false);inerted=[];
      const url=new URL(location.href);url.searchParams.delete('tahta');historyReplace(url);window.dispatchEvent(new Event('resize'));(previousFocus?.isConnected?previousFocus:opener).focus();
    }
    opener.addEventListener('click',open);
    shell.addEventListener('click',async e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.dataset.tool)setTool(b.dataset.tool);
      if(b.dataset.color){color=b.dataset.color;$$('[data-color]',shell).forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));setTool('pen');}
      switch(b.dataset.action){
        case 'close':await close();break;
        case 'fullscreen':try{if(document.fullscreenElement===shell)await document.exitFullscreen();else if(shell.requestFullscreen)await shell.requestFullscreen();else say('Bu tarayıcıda tam ekran yok; tahta çalışma alanı açık.');}catch{say('Tam ekran açılamadı. Tahta çalışma alanını kullanmaya devam edebilirsin.');}break;
        case 'lesson':{const panel=$('#board-lesson',shell);panel.hidden=!panel.hidden;$('[data-action="lesson"]',shell).setAttribute('aria-expanded',String(!panel.hidden));break;}
        case 'reveal':{const answer=$('.board-answer',shell);answer.hidden=!answer.hidden;b.setAttribute('aria-expanded',String(!answer.hidden));b.textContent=answer.hidden?'Açıklamayı göster':'Açıklamayı gizle';break;}
        case 'next':lesson=Math.min(lessonData.length-1,lesson+1);lessonRender();break;
        case 'previous':lesson=Math.max(0,lesson-1);lessonRender();break;
        case 'undo':if(history.length){strokes=history.pop();render();}break;
        case 'clear':if(strokes.length){remember();strokes=[];render();say('Çizimler temizlendi. Geri al ile geri getirebilirsin.');}break;
      }
    });
    document.addEventListener('fullscreenchange',()=>{const b=$('[data-action="fullscreen"]',shell);const full=document.fullscreenElement===shell;b.setAttribute('aria-pressed',String(full));b.textContent=full?'Küçült':'Tam ekran';});
    shell.addEventListener('keydown',e=>{
      // Keep legacy experiment keyboard shortcuts away from text and tahta tools.
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(!$('#board-lesson',shell).hidden){$('#board-lesson',shell).hidden=true;$('[data-action="lesson"]',shell).setAttribute('aria-expanded','false');$('[data-action="lesson"]',shell).focus();}else if(tool!=='interact')setTool('interact');else close();}
      if(e.key==='Tab'){const focusable=$$('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),summary,[tabindex="0"]',shell).filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
    });
    // Consume drawing events before legacy orbit/canvas handlers see them.
    const point=e=>{const r=ink.getBoundingClientRect();return [Math.max(0,Math.min(1000,(e.clientX-r.left)/r.width*1000)),Math.max(0,Math.min(1000,(e.clientY-r.top)/r.height*1000))];};
    ink.addEventListener('pointerdown',e=>{
      if(pointer!==null||!e.isPrimary||e.button>0)return;e.preventDefault();e.stopPropagation();pointer=e.pointerId;ink.setPointerCapture(pointer);
      if(tool==='erase'){const el=document.elementFromPoint(e.clientX,e.clientY);const index=[...ink.children].indexOf(el);if(index>=0){remember();strokes.splice(index,1);render();}return;}
      remember();points=[point(e)];points.push([points[0][0]+.01,points[0][1]+.01]);path={points,color};strokes.push(path);render();
    });
    ink.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;e.preventDefault();e.stopPropagation();if(path){points.push(point(e));ink.lastElementChild.setAttribute('points',points.map(p=>p.join(',')).join(' '));}});
    const finish=e=>{if(pointer!==e.pointerId)return;e.stopPropagation();if(ink.hasPointerCapture(pointer))ink.releasePointerCapture(pointer);pointer=null;path=null;historyState();};
    ink.addEventListener('pointerup',finish);ink.addEventListener('pointercancel',finish);ink.addEventListener('lostpointercapture',finish);
    ink.addEventListener('wheel',e=>{e.preventDefault();e.stopPropagation();},{passive:false});
    // Late legacy modules may insert their 3D canvas; the overlay stays on top via z-index.
    if(new URLSearchParams(location.search).get('tahta')==='1')open();
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
