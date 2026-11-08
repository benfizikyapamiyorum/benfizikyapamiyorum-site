(() => {
  const buttons=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-topic]')];
  buttons.forEach(button=>button.addEventListener('click',()=>{
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    cards.forEach(card=>card.hidden=button.dataset.filter!=='Tümü'&&card.dataset.topic!==button.dataset.filter);
    const shown=cards.filter(c=>!c.hidden);
    document.getElementById('catalog-count').textContent=`${shown.length} başlık · ${shown.reduce((n,c)=>n+c.querySelectorAll('.catalog-links a').length,0)} deney`;
  }));
})();
