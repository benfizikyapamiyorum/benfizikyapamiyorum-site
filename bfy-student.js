/* Three-question lessons: answers stay on this device. */
(() => {
  'use strict';
  const track = event => window.BFY?.track(event);
  const key = 'bfy_student_progress_v1';
  function readProgress() {
    try { const data = JSON.parse(localStorage.getItem(key)); return data && typeof data === 'object' ? data : null; }
    catch { return null; }
  }
  function saveProgress(data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} }
  const resume = document.getElementById('student-resume');
  if (resume) {
    const saved = readProgress();
    const choices = [...document.querySelectorAll('[data-topic-slug]')];
    const topic = saved && choices.find(el => el.dataset.topicSlug === saved.slug);
    if (topic) {
      resume.hidden = false;
      resume.querySelector('a').href = topic.href + '#mini-test';
      resume.querySelector('[data-resume-title]').textContent = topic.dataset.topicTitle;
    }
    try {
      const quiz = JSON.parse(localStorage.getItem('bfy_quiz_resume_v1'));
      if (quiz && [9,10,11].includes(quiz.grade) && /^FİZ\.(9|10|11)\.\d+\.\d+$/.test(quiz.code) && (!saved || quiz.updated > saved.updated)) {
        resume.hidden = false;
        resume.querySelector('a').href = 'testler-' + quiz.grade + '.html?mode=hizli&konu=' + encodeURIComponent(quiz.code);
        resume.querySelector('[data-resume-title]').textContent = typeof quiz.title === 'string' ? quiz.title : quiz.grade + '. sınıf';
      }
    } catch {}
  }
  const form = document.querySelector('[data-student-mini]');
  if (!form) return;
  let started = false, completed = false;
  const data = JSON.parse(document.getElementById('student-lesson-data').textContent);
  const result = document.getElementById('student-result');
  form.addEventListener('change', () => {
    if (!started) { started = true; track('test_start'); }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!started) { started = true; track('test_start'); }
    const values = new FormData(form);
    let correct = 0;
    data.questions.forEach((question, index) => {
      const ok = Number(values.get('q' + index)) === question.answer;
      if (ok) correct++;
      const feedback = document.getElementById('student-feedback-' + index);
      feedback.hidden = false;
      feedback.querySelector('h3').textContent = ok ? 'Doğru · ' + question.options[question.answer] : 'Tekrar bakalım · Doğru cevap: ' + question.options[question.answer];
      feedback.querySelector('p').textContent = question.why;
    });
    result.hidden = false;
    result.querySelector('[data-score]').textContent = correct + ' / 3 doğru';
    result.querySelector('[data-result-message]').textContent = correct === 3
      ? 'Üç soruyu da doğru yanıtladın. Şimdi konunun farklı sorularıyla pekiştir.'
      : 'Takıldığın soruların açıklamaları yukarıda. Konuyu deneyde gözle, ardından üç soruyla pekiştir.';
    if (!completed) { track('test_complete'); completed = true; }
    saveProgress({slug: data.slug, grade: data.grade, updated: Date.now()});
    result.focus({preventScroll: true});
    result.scrollIntoView({block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  });
})();
