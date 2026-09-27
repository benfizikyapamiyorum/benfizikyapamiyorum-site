(() => {
  const select=document.getElementById('trial-download-grade');
  if(!select)return;
  const weeks={9:'9. ve 23.',10:'14. ve 22.',11:'22. ve 32.'};
  function choose(grade){
    if(!weeks[grade])return;
    document.querySelectorAll('[data-trial-grade]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.trialGrade===grade)));
    document.querySelectorAll('[data-trial-panel]').forEach(p=>p.hidden=p.dataset.trialPanel!==grade);
    select.value=grade;
    const form=document.getElementById('denemeForm');
    form.elements.kaynak.value=`BFY Hoca Kiti - ${grade}. sınıf - ${weeks[grade]} hafta - HTML ve PDF`;
    document.getElementById('trial-delivery-label').textContent=`${grade}. sınıf · ${weeks[grade]} hafta · HTML + öğrenci ve öğretmen PDF’leri.`;
    document.getElementById('trial-download-link').href=`BFY${grade}_Ucretsiz_2_Hafta_Interaktif.zip`;
    document.getElementById('trial-online-link').href=`bfy-deneme-${grade}.html`;
  }
  document.querySelectorAll('[data-trial-grade]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.trialGrade)));
  document.querySelectorAll('[data-trial-jump]').forEach(a=>a.addEventListener('click',()=>choose(a.dataset.trialJump)));
  select.addEventListener('change',()=>choose(select.value));
  choose(new URLSearchParams(location.search).get('deneme')||'9');
})();