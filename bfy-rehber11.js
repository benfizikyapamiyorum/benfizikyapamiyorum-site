'use strict';
const questions = [...document.querySelectorAll('.rg-question')];
const resetButton = document.getElementById('reset-answers');
function updateProgress() {
  const answered = questions.filter(q => q.dataset.selected !== undefined);
  const correct = answered.filter(q => q.dataset.selected === q.dataset.answer);
  document.getElementById('progress-meter').value = answered.length;
  document.getElementById('progress-text').textContent = `${answered.length} / ${questions.length} soru yanıtlandı${answered.length ? ` · ${correct.length} doğru yanıt` : ''}`;
  document.getElementById('closing-progress').textContent = answered.length === 0
    ? 'Yanıtladığın soruların sayısı burada görünecek. Bu küçük çalışma, bütün üniteyi ölçen bir sınav değildir.'
    : `${questions.length} sorunun ${answered.length} tanesini yanıtladın; mevcut yanıtlarından ${correct.length} tanesi doğru. Açıklamaları okuyup seçimini değiştirebilirsin. Bu kısa çalışma bütün üniteyi ölçmez.`;
  resetButton.disabled = answered.length === 0;
}
questions.forEach(q => {
  q.querySelectorAll('.rg-option').forEach(button => {
    button.addEventListener('click', () => {
      q.dataset.selected = button.dataset.choice;
      const correct = q.dataset.selected === q.dataset.answer;
      q.classList.toggle('is-wrong', !correct);
      q.querySelectorAll('.rg-option').forEach(option => {
        const selected = option === button;
        option.setAttribute('aria-pressed', String(selected));
        option.classList.toggle('is-right', selected && correct);
        option.classList.toggle('is-wrong', selected && !correct);
      });
      const verdict = correct ? 'Doğru. Şimdi nedenine bakalım.' : 'Bir noktayı yeniden düşünelim.';
      q.querySelector('.rg-verdict').textContent = verdict;
      q.querySelector('.rg-feedback').hidden = false;
      q.querySelector('.rg-announcement').textContent = `${verdict} ${q.querySelector('.rg-feedback p').textContent}`;
      updateProgress();
    });
  });
});
resetButton.addEventListener('click', () => {
  questions.forEach(q => {
    delete q.dataset.selected;
    q.classList.remove('is-wrong');
    q.querySelector('.rg-feedback').hidden = true;
    q.querySelector('.rg-announcement').textContent = '';
    q.querySelectorAll('.rg-option').forEach(option => {
      option.setAttribute('aria-pressed', 'false');
      option.classList.remove('is-right', 'is-wrong');
    });
  });
  updateProgress();
});
updateProgress();
