import {tasks,weekInfo,assess} from './bfy-growth-core.mjs?v=20261015-growth1';
const $=(q,root=document)=>root.querySelector(q),params=new URLSearchParams(location.search);
const week=weekInfo(new Date(),params.get('hafta')||'');
const lab=$('[data-bfy-lab]')?.dataset.bfyLab;
const track=(event)=>window.BFY?.track(event,lab?{lab}:{});
const safeStore={get(k){try{return localStorage.getItem(k);}catch{return null;}},set(k,v){try{localStorage.setItem(k,v);}catch{}}};
const taskURL=t=>`${t.path}?gorev=${t.id}&hafta=${week.key}#haftalik-gorev`;
for(const title of document.querySelectorAll('[data-bfy-week-title]')){
 title.textContent=`${week.label}: ${week.task.title}.`;
 const a=title.closest('.bfy-teaser')?.querySelector('a');if(a){a.href=taskURL(week.task);a.textContent='Bu haftanın görevini aç →';a.dataset.bfyEvent='challenge_open';}
}
for(const a of document.querySelectorAll('[data-task-link]')){const t=tasks.find(t=>t.id===a.dataset.taskLink);if(t){a.href=taskURL(t);a.dataset.bfyEvent='challenge_open';}}
$(`[data-task-card="${week.index}"]`)?.classList.add('current');
if(lab){track('lab_open');let activated=false;const count=e=>{if(activated||!e.isTrusted||e.target.closest('.bfy-growth'))return;if(e.target.closest('button,input,select,canvas')){activated=true;track('lab_interact');}};document.addEventListener('click',count);document.addEventListener('input',count);}
for(const mini of document.querySelectorAll('.bfy-mini')){
 let started=false;mini.addEventListener('toggle',()=>{if(mini.open&&!started){started=true;track('lab_quiz_start');}});
 const form=$('form',mini),answers=JSON.parse($('.bfy-quiz-data',mini).textContent);let recorded=false;
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const fd=new FormData(form);let score=0;const result=$('.bfy-result',form);result.replaceChildren();
 const headline=document.createElement('strong');const list=document.createElement('ol');answers.forEach((a,i)=>{const correct=Number(fd.get('q'+i))===a.answer;if(correct)score++;const li=document.createElement('li');li.textContent=`${correct?'Doğru':'Tekrar düşün'}: ${a.explanation}`;list.append(li);});headline.textContent=`${answers.length} soruda ${score} doğru.`;result.append(headline,list);result.classList.toggle('success',score===answers.length);if(!recorded){track('lab_quiz_complete');recorded=true;}
 });
}
async function copy(text,status){try{await navigator.clipboard.writeText(text);status.textContent='Bağlantı kopyalandı.';return true;}catch{status.textContent='Bağlantıyı kopyalayabilirsin: ';const input=document.createElement('input');input.className='bfy-share-fallback';input.value=text;input.readOnly=true;status.append(input);input.focus();input.select();return false;}}
$('[data-bfy-share-lab]')?.addEventListener('click',async()=>{const url=new URL(location.pathname,'https://benfizikyapamiyorum.com');url.search='utm_source=paylasim&utm_medium=link&utm_campaign=simulasyon';if(await copy(url.href,$('[data-bfy-share-status]')))track('lab_share');});
const panel=$('[data-bfy-mission]');
if(panel){
 const task=tasks.find(t=>t.id===panel.dataset.bfyMission),body=$('.bfy-mission-content',panel),summary=$('summary',panel);
 summary.textContent=`Fizik görevi: ${task.title}`;
 if(params.get('gorev')===task.id)panel.open=true;
 body.innerHTML=`<p class="bfy-eyebrow">${week.label}${week.task.id===task.id?' · HAFTANIN GÖREVİ':' · GÖREV KOLEKSİYONU'}</p><h2>${task.title}</h2><p>${task.intro}</p><p><strong>Koşullar:</strong> ${task.rule}</p><div class="bfy-actions"><button type="button" class="bfy-btn" data-start>Görevi başlat</button><button type="button" class="bfy-btn secondary" data-check disabled>Sonucu kontrol et</button></div><details><summary>İpucu göster</summary><p>${task.hint}</p></details><div class="bfy-result" role="status" aria-live="polite"></div><div class="bfy-actions" data-result-actions hidden><button type="button" class="bfy-btn secondary" data-card>Sonuç kartını indir</button><button type="button" class="bfy-btn secondary" data-share>Görevi paylaş</button></div><p class="bfy-note" data-save-note></p><p class="bfy-note" data-copy-status role="status"></p><a href="haftanin-fizik-gorevi.html">Diğer görevleri gör →</a>`;
 const status=$('.bfy-result',body),key=`bfy-task-v1:${week.key}:${task.id}`;let started=false,completed=false,lastResult='';
 if(safeStore.get(key))$('[data-save-note]',body).textContent='Bu görevi bu tarayıcıda daha önce tamamladın. Yeniden deneyebilirsin.';
 function adapter(){return window.BFYGrowthLab;}
 $('[data-start]',body).addEventListener('click',()=>{
   if(!adapter()?.prepare){status.textContent='Sahne hazırlanıyor. Laboratuvar açıldıktan sonra tekrar bas.';return;}
   adapter().prepare(task.id);started=true;completed=false;lastResult='';status.classList.remove('success');status.textContent='Görev hazır. Yukarıdaki koşulları kullanarak deneyin ayarlarını değiştir; ardından sonucu kontrol et.';$('[data-check]',body).disabled=false;$('[data-result-actions]',body).hidden=true;track('challenge_start');
 });
 $('[data-check]',body).addEventListener('click',()=>{
   if(!started)return;const result=assess(task.id,adapter()?.read?.());status.textContent=result.message;status.classList.toggle('success',result.ok);
   if(result.ok){lastResult=result.message;$('[data-result-actions]',body).hidden=false;if(!completed){completed=true;track('challenge_complete');safeStore.set(key,'complete');}$('[data-save-note]',body).textContent='Tamamlama kaydı bu tarayıcıya kaydedildi. Paylaşılan bağlantı sonucu değil, aynı görevi açar.';}
 });
 function shareURL(){const u=new URL(taskURL(task),'https://benfizikyapamiyorum.com/');u.searchParams.set('utm_source','paylasim');u.searchParams.set('utm_medium','gorev');u.searchParams.set('utm_campaign','haftalik-gorev');return u.href;}
 $('[data-share]',body).addEventListener('click',async()=>{if(!completed)return;const target=$('[data-copy-status]',body);if(navigator.share){try{await navigator.share({title:task.title,text:'Bu fizik görevini tamamladım. Sen de dene!',url:shareURL()});track('challenge_share');return;}catch(e){if(e.name==='AbortError')return;}}if(await copy(shareURL(),target))track('challenge_share');});
 $('[data-card]',body).addEventListener('click',()=>{
   if(!completed)return;const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1080;const c=canvas.getContext('2d');c.fillStyle='#203d35';c.fillRect(0,0,1080,1080);c.fillStyle='#d9edaf';c.font='700 26px system-ui';c.fillText('BEN FİZİK YAPAMIYORUM',72,100);c.fillStyle='#fffef9';c.font='700 70px system-ui';c.fillText('Görev tamamlandı.',72,240);
   function lines(text,y,font,color,max=930){c.font=font;c.fillStyle=color;let line='';for(const word of text.split(' ')){if(c.measureText(line+word+' ').width>max){c.fillText(line.trim(),72,y);y+=54;line='';}line+=word+' ';}if(line)c.fillText(line.trim(),72,y);return y+64;}
   let y=lines(task.title,350,'700 48px system-ui','#d9edaf');y=lines(lastResult,y+28,'32px system-ui','#fffef9');c.font='28px system-ui';c.fillStyle='#d9edaf';c.fillText(week.label,72,865);c.fillStyle='#fffef9';c.fillText('Sen de dene:',72,930);c.font='24px system-ui';c.fillText('benfizikyapamiyorum.com/haftanin-fizik-gorevi.html',72,976);
   canvas.toBlob(blob=>{if(!blob){$('[data-copy-status]',body).textContent='Kart oluşturulamadı; görev bağlantısını paylaşabilirsin.';return;}const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`bfy-${task.id}-${week.key}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(u),30000);track('challenge_card');},'image/png');
 });
}
