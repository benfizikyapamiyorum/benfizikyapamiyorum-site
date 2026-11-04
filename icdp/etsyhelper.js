window.ESETUP = async function (k) {
  const sl = ms => new Promise(r => setTimeout(r, ms));
  const out = [];
  let b = [...document.querySelectorAll('button,a')].find(x => /Switch to standard list/.test(x.innerText));
  if (b) { b.click(); await sl(3000); }
  window.ED = window.ED || await (await fetch('https://benfizikyapamiyorum.com/icdp/etsydata.json?' + Date.now())).json();
  const LB = () => document.querySelector('[aria-label="Physical or digital listing type"]');
  if (!LB()) {
    const top = [...document.querySelectorAll('*')].find(e => e.children.length <= 2 && /^\+\s*Worksheets/.test((e.innerText || '').trim()) && e.offsetParent);
    if (top) { (top.querySelector('b,strong,span') || top).click(); await sl(2000); }
  }
  for (let t = 0; t < 3 && !LB(); t++) {
    const el = document.querySelector('#listing-editor_category-search-typeahead');
    el.focus(); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, 'worksheet');
    el.dispatchEvent(new Event('input', { bubbles: true })); await sl(3500);
    const o = [...document.querySelectorAll('[role=option]')].find(e => /^Worksheets/.test(e.innerText));
    if (o) o.click(); await sl(2000);
  }
  out.push(LB() ? 'cat' : 'CATFAIL');
  const lb = LB();
  lb.parentElement.parentElement.querySelector('button').click(); await sl(700);
  [...lb.querySelectorAll('li[role=option]')].find(e => /Digital/.test(e.textContent)).click(); await sl(1500);
  out.push(document.querySelector('input[name=whatContent]') ? 'digital' : 'DIGFAIL');
  const pick = (name, re) => { const r = [...document.querySelectorAll('input[name=' + name + ']')].find(x => re.test(x.labels[0].innerText)); r.click(); return r.checked; };
  out.push([pick('whoMade', /I did/), pick('isSupply', /finished/), pick('whatContent', /AI generator/)].join(''));
  const D = ED[k];
  const setv = (e, v) => { const p = Object.getPrototypeOf(e); Object.getOwnPropertyDescriptor(p, 'value').set.call(e, v);['input', 'change', 'blur'].forEach(t => e.dispatchEvent(new Event(t, { bubbles: true }))); };
  setv(document.querySelector('textarea[name=title]'), D.title);
  setv(document.querySelector('textarea[name=description]'), D.description);
  setv(document.querySelector('input[name="variations.configuration.price"]'), String(D.price));
  setv(document.querySelector('input[name=quantity]'), '999');
  out.push(document.querySelector('textarea[name=title]').value.length, document.querySelector('textarea[name=description]').value.length, document.querySelector('input[name="variations.configuration.price"]').value);
  return out.join(' ') + ' | TAGS: ' + D.tags.join(', ');
};
window.ECHECK = function () {
  const t = document.body.innerText;
  return (t.match(/IGCSE-Physics-0625-[^\n]*\.(pdf|docx|zip)/g) || []).length + ' files | tags13:' + /All 13 used/.test(t) + ' | photos:' + (t.match(/(\d+) remaining/g) || []).join(',');
};
