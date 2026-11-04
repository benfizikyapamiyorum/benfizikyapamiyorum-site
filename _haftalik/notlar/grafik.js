// Hareket grafikleri (konum-zaman, hız-zaman, ivme-zaman) için ölçekli SVG çizici.
// f = { tmax, ymin, ymax, dt (t aralığı), dy (y aralığı), sx (px / s), sy (px / birim), xlab, ylab,
//       cizgi:[{pts:[[t,y],...], c, w, lab, lx, ly, la}], alan:[{pts:[[t,y],...], c}], kesik:[[t,y]], width (mm) }
const { txt, FONT } = require('../lib');

function grafik(f) {
  const sx = f.sx || 40, sy = f.sy || 10, L = 52, T = 26, R = 64, B = 34;
  const W = f.tmax * sx, H = (f.ymax - (f.ymin || 0)) * sy;
  const X = t => L + t * sx, Y = y => T + (f.ymax - y) * sy;
  let b = '';
  // ızgara ve çentik etiketleri
  for (let t = f.dt; t <= f.tmax + 1e-9; t += f.dt) {
    b += `<line x1="${X(t)}" y1="${T - 4}" x2="${X(t)}" y2="${T + H}" stroke="#e2e8f0" stroke-width="1"/>`;
    b += txt(X(t), ((f.ymin || 0) < 0 ? T + H : Y(0)) + 17, +t.toFixed(2), { size: 12.5, w: 600, c: '#475569', hw: 3 });
  }
  for (let y = Math.ceil((f.ymin || 0) / f.dy) * f.dy; y <= f.ymax + 1e-9; y += f.dy) {
    if (Math.abs(y) < 1e-9) continue;
    b += `<line x1="${L}" y1="${Y(y)}" x2="${L + W + 8}" y2="${Y(y)}" stroke="#e2e8f0" stroke-width="1"/>`;
    b += txt(L - 7, Y(y) + 4.5, +y.toFixed(2), { size: 12.5, w: 600, c: '#475569', a: 'end', halo: false });
  }
  b += txt(L - 7, Y(0) + 4.5, 0, { size: 12.5, w: 600, c: '#475569', a: 'end', halo: false });
  (f.alan || []).forEach(a => {
    const p = a.pts.map(([t, y]) => `${X(t)},${Y(y)}`).join(' ');
    b += `<polygon points="${X(a.pts[0][0])},${Y(0)} ${p} ${X(a.pts[a.pts.length - 1][0])},${Y(0)}" fill="${a.c}" opacity="${a.o || 0.22}"/>`;
  });
  // eksenler
  const ax = (x1, y1, x2, y2) => {
    const an = Math.atan2(y2 - y1, x2 - x1), h = 9;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1d2b53" stroke-width="1.8"/><polygon points="${x2},${y2} ${x2 - h * Math.cos(an) + 4 * Math.sin(an)},${y2 - h * Math.sin(an) - 4 * Math.cos(an)} ${x2 - h * Math.cos(an) - 4 * Math.sin(an)},${y2 - h * Math.sin(an) + 4 * Math.cos(an)}" fill="#1d2b53"/>`;
  };
  b += ax(L, T + H + ((f.ymin || 0) < 0 ? 0 : 6), L, T - 16);
  b += ax(L - 4, Y(0), L + W + 24, Y(0));
  b += txt(L + 6, T - 12, f.ylab, { size: 14, w: 800, a: 'start' });
  b += txt(L + W + 30, Y(0) + 5, f.xlab, { size: 14, w: 800, a: 'start' });
  (f.kesik || []).forEach(([t, y]) => {
    b += `<line x1="${X(t)}" y1="${Y(y)}" x2="${X(t)}" y2="${Y(0)}" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="4 4"/>`;
    b += `<line x1="${L}" y1="${Y(y)}" x2="${X(t)}" y2="${Y(y)}" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="4 4"/>`;
  });
  (f.cizgi || []).forEach(c => {
    b += `<polyline points="${c.pts.map(([t, y]) => `${X(t)},${Y(y)}`).join(' ')}" fill="none" stroke="${c.c || '#2563eb'}" stroke-width="${c.w || 3.2}" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (c.lab) b += txt(X(c.lx), Y(c.ly), c.lab, { c: c.c || '#2563eb', size: c.size || 15, a: c.la || 'middle' });
  });
  (f.notes || []).forEach(n => { b += txt(X(n.t), Y(n.y), n.s, { c: n.c || '#334155', size: n.size || 13, w: n.w || 700, a: n.a || 'middle' }); });
  const vw = L + W + R, vh = T + H + B;
  return `<svg class="sk" viewBox="0 0 ${vw} ${vh}" style="width:${f.width || vw * 0.24}mm;max-width:100%">${b}</svg>`;
}

module.exports = { grafik };
