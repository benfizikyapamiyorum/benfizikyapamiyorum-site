// The November offer must not remain advertised after its end date (Turkey time).
(() => {
  const offer = document.querySelector('[data-atolye-november-offer]');
  const end = new Date('2026-12-01T00:00:00+03:00').getTime();
  const update = () => { if (offer) offer.hidden = Date.now() >= end; };
  update();
  document.addEventListener('visibilitychange', update);
})();
