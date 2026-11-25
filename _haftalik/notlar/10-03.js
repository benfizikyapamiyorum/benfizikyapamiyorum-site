// 10. sınıf · Not #3 · Enerji biçimleri (takvim: Hafta 10) · FİZ.10.2.3 Enerji biçimlerini karşılaştırabilme
const { bolum, kutu, sekil, hatalar, ornek, soru, cevaplar, sonraki, ok, txt } = require('../lib');

const MAVI = '#2563eb', TURUNCU = '#ea580c', YESIL = '#0f766e', MOR = '#7c3aed', PEMBE = '#be185d', SARI = '#d97706', GRI = '#64748b', KOYU = '#1d2b53';
let _id = 0;
const svg = (b, w, h, mm, defs = '') => `<svg class="sk" viewBox="0 0 ${w} ${h}" style="width:${mm}mm;max-width:100%"><defs>${defs}</defs>${b}</svg>`;
const golge = (id) => `<filter id="${id}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.18"/></filter>`;
const grad = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

// Küçük simgeler (merkez cx, cy)
const ikon = {
  pil: (x, y, c) => `<rect x="${x - 15}" y="${y - 10}" width="28" height="20" rx="3" fill="#fff" stroke="${c}" stroke-width="2.4"/><rect x="${x + 13}" y="${y - 4}" width="4" height="8" rx="1" fill="${c}"/><rect x="${x - 12}" y="${y - 7}" width="7" height="14" rx="1" fill="${c}"/><rect x="${x - 3}" y="${y - 7}" width="7" height="14" rx="1" fill="${c}" opacity=".7"/>`,
  simsek: (x, y, c) => `<polygon points="${x + 3},${y - 15} ${x - 9},${y + 2} ${x - 1},${y + 2} ${x - 4},${y + 15} ${x + 9},${y - 3} ${x + 1},${y - 3}" fill="${c}" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>`,
  teker: (x, y, c) => `<circle cx="${x}" cy="${y}" r="14" fill="#fff" stroke="${c}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="3.5" fill="${c}"/>` +
    [0, 60, 120].map(a => { const r = a * Math.PI / 180; return `<line x1="${x - 11 * Math.cos(r)}" y1="${y - 11 * Math.sin(r)}" x2="${x + 11 * Math.cos(r)}" y2="${y + 11 * Math.sin(r)}" stroke="${c}" stroke-width="1.6"/>`; }).join(''),
  isi: (x, y, c) => [-8, 0, 8].map(d => `<path d="M${x + d} ${y + 14} c -6 -5 6 -9 0 -14 c -6 -5 6 -9 0 -14" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`).join(''),
  gunes: (x, y, c) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}"/>` + Array.from({ length: 8 }, (_, i) => { const r = i * Math.PI / 4; return `<line x1="${x + 11 * Math.cos(r)}" y1="${y + 11 * Math.sin(r)}" x2="${x + 16 * Math.cos(r)}" y2="${y + 16 * Math.sin(r)}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`; }).join(''),
  alev: (x, y, c) => `<path d="M${x} ${y - 15} C ${x + 12} ${y - 4} ${x + 11} ${y + 13} ${x} ${y + 14} C ${x - 11} ${y + 13} ${x - 12} ${y - 2} ${x - 3} ${y - 7} C ${x - 3} ${y} ${x + 2} ${y + 1} ${x} ${y - 15} Z" fill="${c}"/><path d="M${x} ${y + 1} C ${x + 5} ${y + 5} ${x + 4} ${y + 12} ${x} ${y + 12} C ${x - 4} ${y + 12} ${x - 5} ${y + 6} ${x} ${y + 1} Z" fill="#fde68a"/>`,
};

// Enerji kutusu: renkli, gölgeli, simgeli
const ekutu = (x, y, w, h, c, acik, ik, bas, alt, fid, gid) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="url(#${gid})" stroke="${c}" stroke-width="2.2" filter="url(#${fid})"/>` +
  (ik ? ikon[ik](x + 28, y + h / 2, c) : '') +
  txt(x + (ik ? 52 : w / 2), y + h / 2 - (alt ? 3 : -6), bas, { a: ik ? 'start' : 'middle', size: 17, c, hw: 0 }) +
  (alt ? txt(x + (ik ? 52 : w / 2), y + h / 2 + 17, alt, { a: ik ? 'start' : 'middle', size: 13.5, w: 600, c: '#334155', hw: 0 }) : '');

// 1) Scooter enerji zinciri (Çözümlü örnek 1 ve slayt)
const fScooter = (mm = 150) => {
  const n = ++_id, f = `g${n}`, defs = golge(f) + grad(`a${n}`, '#ecfdf5', '#d1fae5') + grad(`b${n}`, '#eff6ff', '#dbeafe') + grad(`c${n}`, '#fff7ed', '#ffedd5') + grad(`d${n}`, '#fdf2f8', '#fce7f3');
  let b = '';
  b += ekutu(14, 30, 168, 72, YESIL, '', 'pil', 'Kimyasal', 'bataryada', f, `a${n}`);
  b += ekutu(232, 30, 168, 72, MAVI, '', 'simsek', 'Elektrik', 'kablo, motor', f, `b${n}`);
  b += ekutu(450, 30, 168, 72, TURUNCU, '', 'teker', 'Mekanik', 'tekerlek döner', f, `c${n}`);
  b += ok(184, 66, 228, 66, KOYU, 3.4) + txt(206, 56, '4000 J', { size: 13, w: 800 });
  b += ok(402, 66, 446, 66, KOYU, 3.4) + txt(424, 56, '3000 J', { size: 13, w: 800 });
  b += `<path d="M316 104 C 316 128 316 136 316 150" fill="none" stroke="${PEMBE}" stroke-width="3.2" stroke-dasharray="7 5"/>` + ok(316, 140, 316, 158, PEMBE, 3.2);
  b += txt(328, 134, '1000 J', { a: 'start', size: 13, c: PEMBE });
  b += ekutu(232, 160, 168, 64, PEMBE, '', 'isi', 'Isı ve ses', 'çevreye geçer', f, `d${n}`);
  b += txt(316, 18, '10 saniyelik sürüş', { size: 14, w: 700, c: GRI, hw: 0 });
  return svg(b, 632, 236, mm, defs);
};

// 2) Benzinli motorda 100 J kimyasal enerjinin dağılımı (akış şeması). 1,4 px/J.
const fMotor = (mm = 150) => {
  const n = ++_id, k = 1.4, defs = golge(`g${n}`) + grad(`k${n}`, '#34d399', '#0f766e');
  const x0 = 150, x1 = 330, y0 = 40;
  const parcalar = [['Mekanik', 'tekerlekleri döndürür', 30, TURUNCU], ['Isı', 'motor, egzoz, frenler', 68, '#dc2626'], ['Ses', 'titreşim ve gürültü', 2, MOR]];
  let b = `<rect x="22" y="${y0}" width="${x0 - 22}" height="${100 * k}" rx="6" fill="url(#k${n})" filter="url(#g${n})"/>`;
  b += txt(86, y0 + 50 * k - 4, 'Kimyasal', { size: 18, c: '#fff', halo: false }) + txt(86, y0 + 50 * k + 17, '100 J (yakıt)', { size: 15, w: 700, c: '#ecfdf5', halo: false });
  let yl = y0, yr = y0 - 14;
  parcalar.forEach(([ad, alt, j, c], i) => {
    const h = j * k, gap = 22;
    const p = `M${x0} ${yl} C ${x0 + 90} ${yl} ${x1 - 90} ${yr} ${x1} ${yr} L ${x1 + 40} ${yr} L ${x1 + 40} ${yr + h} L ${x1} ${yr + h} C ${x1 - 90} ${yr + h} ${x0 + 90} ${yl + h} ${x0} ${yl + h} Z`;
    b += `<path d="${p}" fill="${c}" opacity="${j < 5 ? 0.9 : 0.78}"/>`;
    const ym = yr + Math.max(h, 2) / 2;
    b += txt(x1 + 50, ym - 2, `${ad}: ${j} J`, { a: 'start', size: 17, c });
    b += txt(x1 + 50, ym + 17, alt, { a: 'start', size: 14, w: 600, c: '#475569', hw: 0 });
    yl += h; yr += h + gap + (i === 0 ? 8 : 0);
  });
  return svg(b, 560, 248, mm, defs);
};

// 3) Kamp feneri: gündüz ve akşam zinciri (slayt ve örnek 2)
const fFener = (mm = 150) => {
  const n = ++_id, f = `g${n}`, defs = golge(f) + grad(`y${n}`, '#fffbeb', '#fef3c7') + grad(`b${n}`, '#eff6ff', '#dbeafe') + grad(`a${n}`, '#ecfdf5', '#d1fae5');
  const w = 136, h = 62;
  let b = txt(16, 20, 'Gündüz', { a: 'start', size: 14, w: 800, c: GRI, hw: 0 }) + txt(16, 126, 'Akşam', { a: 'start', size: 14, w: 800, c: GRI, hw: 0 });
  b += ekutu(14, 30, w, h, SARI, '', 'gunes', 'Işık', 'güneşten', f, `y${n}`);
  b += ekutu(218, 30, w, h, MAVI, '', 'simsek', 'Elektrik', 'panelde', f, `b${n}`);
  b += ekutu(422, 30, w, h, YESIL, '', 'pil', 'Kimyasal', 'pilde depo', f, `a${n}`);
  b += ok(152, 61, 214, 61, KOYU, 3.2) + ok(356, 61, 418, 61, KOYU, 3.2);
  b += `<path d="M490 94 C 490 116 490 124 490 132" fill="none" stroke="${KOYU}" stroke-width="3.2"/>` + ok(490, 126, 490 - 0.01, 136, KOYU, 3.2, 12);
  b += ekutu(422, 138, w, h, YESIL, '', 'pil', 'Kimyasal', 'pil boşalır', f, `a${n}`);
  b += ekutu(218, 138, w, h, MAVI, '', 'simsek', 'Elektrik', 'LED devresi', f, `b${n}`);
  b += ekutu(14, 138, w, h, SARI, '', 'gunes', 'Işık + ısı', 'LED yanar', f, `y${n}`);
  b += ok(420, 169, 358, 169, KOYU, 3.2) + ok(216, 169, 154, 169, KOYU, 3.2);
  return svg(b, 572, 212, mm, defs);
};

// 4) Soru: cam fanus, içinde zil ve LED, havası boşaltılıyor
const fFanus = (mm = 70) => {
  const n = ++_id, defs = `<radialGradient id="cam${n}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.6" stop-color="#e0f2fe" stop-opacity="0.45"/><stop offset="1" stop-color="#bae6fd" stop-opacity="0.6"/></radialGradient>` + grad(`t${n}`, '#94a3b8', '#475569') + golge(`g${n}`);
  let b = '';
  b += `<rect x="40" y="200" width="240" height="16" rx="4" fill="url(#t${n})" filter="url(#g${n})"/>`;
  b += `<path d="M70 200 L70 110 C 70 40 250 40 250 110 L250 200 Z" fill="url(#cam${n})" stroke="#7dd3fc" stroke-width="2.5"/>`;
  b += `<rect x="150" y="34" width="20" height="14" rx="3" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>`;
  b += `<path d="M98 86 C 92 104 92 126 98 150" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.8"/>`;
  // zil
  b += `<rect x="86" y="184" width="44" height="16" rx="3" fill="#475569"/><rect x="92" y="186" width="14" height="10" rx="2" fill="#16a34a"/>`;
  b += `<rect x="116" y="150" width="5" height="34" fill="#64748b"/><circle cx="118" cy="146" r="17" fill="#facc15" stroke="#a16207" stroke-width="2"/><circle cx="112" cy="140" r="5" fill="#fef9c3" opacity="0.9"/><circle cx="118" cy="146" r="3" fill="#a16207"/>`;
  b += `<line x1="98" y1="184" x2="99" y2="158" stroke="#334155" stroke-width="2.5"/><circle cx="100" cy="155" r="4.5" fill="#334155"/>`;
  b += `<path d="M142 132 q 6 6 0 12 M148 127 q 10 11 0 22" fill="none" stroke="#a16207" stroke-width="2" stroke-linecap="round"/>`;
  b += txt(108, 118, 'zil', { size: 14, c: '#334155' });
  // LED
  b += `<rect x="208" y="176" width="3" height="24" fill="#64748b"/><rect x="216" y="176" width="3" height="24" fill="#64748b"/><path d="M204 178 L204 160 C 204 148 222 148 222 160 L222 178 Z" fill="#f87171" stroke="#b91c1c" stroke-width="1.8"/><circle cx="213" cy="158" r="17" fill="#fca5a5" opacity="0.35"/>`;
  b += txt(213, 134, 'LED', { size: 14, c: '#334155' });
  // pil ve hortum
  b += `<path d="M270 208 C 300 208 300 150 330 150" fill="none" stroke="#334155" stroke-width="7" stroke-linecap="round"/><rect x="326" y="128" width="54" height="44" rx="8" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>`;
  b += txt(353, 156, 'pompa', { size: 13, c: '#334155', hw: 0 });
  b += ok(318, 186, 352, 196, GRI, 2.4, 10) + txt(352, 214, 'hava dışarı', { size: 12.5, w: 700, c: GRI, hw: 0 });
  return svg(b, 400, 228, mm, defs);
};

// 5) Soru: termik santral zinciri, boşluklar I, II, III
const fSantral = (mm = 160) => {
  const n = ++_id, f = `g${n}`, defs = golge(f) + grad(`a${n}`, '#ecfdf5', '#d1fae5') + grad(`s${n}`, '#f8fafc', '#e2e8f0');
  const w = 128, h = 64, ys = 26;
  let b = ekutu(10, ys, w, h, YESIL, '', 'alev', 'Kimyasal', 'kömür', f, `a${n}`);
  const xs = [176, 342, 508], ad = ['I', 'II', 'III'], alt = ['kazanda su kaynar', 'buhar türbini döndürür', 'jeneratör'];
  xs.forEach((x, i) => {
    b += `<rect x="${x}" y="${ys}" width="${w}" height="${h}" rx="12" fill="url(#s${n})" stroke="${GRI}" stroke-width="2.2" stroke-dasharray="6 4" filter="url(#${f})"/>`;
    b += txt(x + w / 2, ys + 34, ad[i], { size: 22, c: KOYU, hw: 0 });
    b += txt(x + w / 2, ys + h + 20, alt[i], { size: 13.5, w: 700, c: '#475569', hw: 0 });
  });
  [[138, 176], [304, 342], [470, 508]].forEach(([a, c]) => { b += ok(a + 2, ys + h / 2, c - 4, ys + h / 2, KOYU, 3); });
  return svg(b, 646, 120, mm, defs);
};

// 6) Soru ve slayt: aynı ışığı veren iki ampulün her saniyelik enerji dökümü. 6 px/J.
const fAmpul = (mm = 150) => {
  const n = ++_id, k = 6, x0 = 150, defs = golge(`g${n}`);
  const satir = (y, ad, top, isik, isi, soruIsi) => {
    let b = txt(16, y + 24, ad, { a: 'start', size: 16, c: KOYU, hw: 0 });
    b += `<rect x="${x0}" y="${y}" width="${isik * k}" height="36" fill="#facc15" stroke="#a16207" stroke-width="1.5"/>`;
    b += `<rect x="${x0 + isik * k}" y="${y}" width="${isi * k}" height="36" fill="#f97316" stroke="#c2410c" stroke-width="1.5" filter="url(#g${n})"/>`;
    b += `<path d="M${x0} ${y - 6} l 0 -6 l ${top * k} 0 l 0 6" fill="none" stroke="${MAVI}" stroke-width="1.8"/>`;
    b += txt(x0 + (top * k) / 2, y - 18, `elektrik: ${top} J`, { size: 14, c: MAVI });
    b += txt(x0 + (isik * k) / 2, y + 56, `ışık ${isik} J`, { size: 13.5, c: '#a16207' });
    const lx = x0 + isik * k + (isi * k) / 2;
    b += soruIsi ? txt(x0 + isik * k + isi * k + 10, y + 24, 'ısı: ?', { a: 'start', size: 15, c: '#c2410c' })
      : txt(lx, y + 24, `ısı ${isi} J`, { size: 15, c: '#fff', hc: '#c2410c', hw: 0 });
    return b;
  };
  let b = satir(40, 'Akkor ampul', 60, 3, 57, false) + satir(140, 'LED ampul', 9, 3, 6, true);
  b += `<rect x="150" y="212" width="16" height="12" fill="#facc15" stroke="#a16207"/>` + txt(172, 222, 'ışık', { a: 'start', size: 13, w: 700, hw: 0 });
  b += `<rect x="222" y="212" width="16" height="12" fill="#f97316" stroke="#c2410c"/>` + txt(244, 222, 'ısı', { a: 'start', size: 13, w: 700, hw: 0 });
  b += txt(320, 222, 'Her saniyelik döküm', { a: 'start', size: 13, w: 700, c: GRI, hw: 0 });
  return svg(b, 540, 234, mm, defs);
};

// --- PDF gövdesi ---
const tab = (ust, satirlar) => `<table class="t"><tr>${ust.map(u => `<th>${u}</th>`).join('')}</tr>${satirlar.map(r => `<tr>${r.map((h, i) => `<td>${i === 0 ? `<b>${h}</b>` : h}</td>`).join('')}</tr>`).join('')}</table>`;

const govde = [
  bolum(1, 'Yedi enerji biçimi', `
<p>Enerji tek bir şey ama farklı biçimlerde karşımıza çıkar. Her biçimin bir kaynağı ve kendine özgü bir taşınma yolu vardır.</p>
${tab(['Biçim', 'Neden kaynaklanır?', 'Örnek'], [
    ['Mekanik', 'Cismin hareketi (kinetik) ve konumu (potansiyel). İkisinin toplamı.', 'Yokuştan inen bisikletli, kurulu yay'],
    ['Kimyasal', 'Moleküllerin kimyasal bağlarında depolanır, tepkimeyle açığa çıkar.', 'Yakıt, besin, telefon bataryası'],
    ['Nükleer', 'Atom çekirdeğinin bölünmesi ya da çekirdeklerin birleşmesi.', 'Güneş, nükleer santral'],
    ['Isı', 'Sıcaklık farkı yüzünden sıcak cisimden soğuk cisme aktarılan enerji.', 'Ocaktaki tencere, sıcak çay'],
    ['Işık', 'Bir kaynaktan dalgalar hâlinde yayılır, boşlukta da yayılır.', 'Güneş, LED, ekran'],
    ['Ses', 'Ortamdaki moleküllerin titreşmesi. Maddesel ortam ister.', 'Hoparlör, gitar teli'],
    ['Elektrik', 'İletkendeki yüklerin, potansiyel fark sayesinde hareketi.', 'Priz, şarj kablosu'],
  ])}
${kutu('ana', 'Ortak noktaları', 'Hepsinin birimi <b>joule (J)</b>dür. Hepsi bir kaynaktan gelir, çevreyi etkiler ve <b>birbirine dönüşebilir</b>. Her dönüşümde enerjinin bir kısmı istemediğimiz biçimlere, çoğunlukla ısıya geçer.')}`),

  bolum(2, 'Enerji zinciri: biçimden biçime', `
${sekil(fScooter(150), 'Elektrikli scooter: 10 saniyede bataryadan çekilen enerjinin dökümü.')}
<p>Bir cihazı anlamanın en kolay yolu enerjinin izini sürmektir: <b>nereden girdi, hangi biçimlerden geçti, sonunda ne oldu?</b> Scooterda bataryadaki kimyasal enerji önce elektriğe, motorda da mekanik enerjiye dönüşür. Motor ve tekerlekler ısınır, biraz da ses çıkar.</p>
${kutu('sari', 'Enerji kaybolmaz', 'Girenle çıkanların toplamı eşittir: <span style="white-space:nowrap">$4000 = 3000 + 1000$ J.</span> “Enerji kaybı” dediğimiz şey, enerjinin <b>işimize yaramayan</b> bir biçime, çoğunlukla ısıya geçmesidir. Yok olan enerji yoktur.')}`),

  bolum(3, 'Hangi cihaz neyi neye çevirir?', `
${sekil(fMotor(118), 'Benzinli otomobil motoru: her 100 J kimyasal enerjinin yaklaşık dökümü.')}
<div>
${tab(['Cihaz', 'Giren', 'İstenen çıkan'], [
    ['Mikrofon', 'ses', 'elektrik'],
    ['Hoparlör', 'elektrik', 'ses'],
    ['Güneş paneli', 'ışık', 'elektrik'],
    ['Jeneratör', 'mekanik', 'elektrik'],
    ['Elektrik motoru', 'elektrik', 'mekanik'],
    ['Fotosentez', 'ışık', 'kimyasal'],
  ])}</div>
${kutu('ana', 'Elektrik neden bu kadar yaygın?', 'Elektrik enerjisi telle uzak yerlere kolayca taşınır ve neredeyse her biçime çevrilebilir: ışık, ısı, ses, hareket. Ama kendisi bir başlangıç kaynağı değildir. Kömürden, rüzgârdan, güneşten ya da çekirdekten elde edilir. Bu yüzden <b>ikincil enerji</b> denir.')}`),

  bolum(4, 'Biçimler nasıl ayrılır?', `
${tab(['Karşılaştır', 'Benzer', 'Farklı'], [
    ['Işık ve ses', 'İkisi de dalga hâlinde yayılır, enerji taşır.', 'Ses maddesel ortam ister, boşlukta yayılmaz. Işık boşlukta da yayılır.'],
    ['Kimyasal ve elektrik', 'İkisi de cihazları çalıştırmakta kullanılır.', 'Kimyasal enerji uzun süre depolanır (pil, yakıt). Elektrik telle anında taşınır.'],
    ['Isı ve mekanik', 'İkisi de iş yapmakta kullanılabilir (buhar türbini).', 'Isı sıcaklık farkı olunca akar. Mekanik enerji cismin hareketine ve konumuna bağlıdır.'],
  ])}
${kutu('sari', 'Isı, sıcaklık, iç enerji', '<b>İç enerji</b>, maddedeki moleküllerin sahip olduğu kinetik enerji ile potansiyel enerjinin toplamıdır. <b>Isı</b>, sıcaklık farkı yüzünden bir yerden başka yere aktarılan enerjidir. Cisim ısı “içermez”, iç enerjiye sahiptir. Sıcaklıkları eşit iki cisim arasında ısı alışverişi olmaz.')}`),

  hatalar([
    ['Enerji dönüşüm sırasında yok olur.', 'Toplam enerji korunur. “Kayıp” enerji, istemediğimiz bir biçime (çoğunlukla ısıya) geçen enerjidir.'],
    ['Pil, içinde elektrik depolar.', 'Pil <b>kimyasal</b> enerji depolar. Devreye bağlanınca kimyasal enerji elektrik enerjisine dönüşür.'],
    ['Ses de ışık gibi boşlukta yayılır.', 'Ses, titreşecek moleküllere yani maddesel ortama ihtiyaç duyar. Uzay boşluğunda ses yayılmaz.'],
    ['Isı ile sıcaklık aynı şeydir.', 'Isı aktarılan enerjidir, birimi J. Sıcaklık ölçülen bir büyüklüktür, birimi °C ya da K.'],
    ['Duran bir cismin mekanik enerjisi yoktur.', 'Yüksekte duran bir cismin ya da kurulu bir yayın potansiyel enerjisi vardır. Bu da mekanik enerjidir.'],
  ]),

  ornek(1, 'ELEKTRİKLİ SCOOTER', `
<p>Bir scooter 10 saniyelik sürüşte bataryasından 4000 J enerji çekiyor. Bu sürede motor, kablolar ve tekerlekler çevreye 1000 J ısı ve ses veriyor (2. bölümdeki şekil).</p>
<p><b>a) Zincir:</b> kimyasal (batarya) → elektrik (kablo ve motor) → mekanik (tekerlek). Yan ürün: ısı ve ses.</p>
<p><b>b) Mekanik enerjiye dönüşen:</b> enerji korunduğu için $4000 - 1000 = 3000$ J.</p>
<p><b>c) Bataryanın verdiği güç:</b> geçen haftaki bağıntıyla $P = \\dfrac{E}{t} = \\dfrac{4000}{10} = 400$ W.</p>`),

  ornek(2, 'GÜNEŞ PANELLİ KAMP FENERİ', `
${sekil(fFener(140), 'Gündüz depola, akşam kullan.')}
<p>Fenerin paneli gündüz ışığı elektriğe çevirir, bu elektrik pilde kimyasal enerji olarak depolanır. Akşam pil, LED’i yakar. Gün boyunca pilde 36 000 J enerji birikmiş olsun. LED her saniye 3 J elektrik enerjisi harcıyor.</p>
<p>Pildeki enerjinin tamamı LED’e gitseydi fener $36\\,000 \\div 3 = 12\\,000$ s yani <b>200 dakika</b> yanardı. LED’in harcadığı her 3 J’ün yaklaşık 1 J’ü ışığa, 2 J’ü ısıya dönüşür. Fener başından uzun süre tutulunca hafifçe ısınmasının nedeni budur.</p>`),

  `<h2 class="b"><span class="n">?</span>Sorular</h2>`,
  soru(1, { metin: 'Kömürle çalışan bir termik santralde enerji, aşağıdaki sırayla biçim değiştiriyor.', sekil: fSantral(160),
    kok: 'I, II ve III ile gösterilen enerji biçimleri aşağıdakilerden hangisinde doğru verilmiştir?', k: 2,
    siklar: ['I: Isı, &nbsp;II: Elektrik, &nbsp;III: Mekanik', 'I: Mekanik, &nbsp;II: Isı, &nbsp;III: Elektrik', 'I: Isı, &nbsp;II: Mekanik, &nbsp;III: Elektrik', 'I: Elektrik, &nbsp;II: Isı, &nbsp;III: Mekanik', 'I: Işık, &nbsp;II: Mekanik, &nbsp;III: Elektrik'] }),
  soru(2, { metin: 'Cam bir fanusun içinde pille çalışan bir zil ve yanan bir LED var. Zil çalarken fanusun havası pompayla yavaş yavaş boşaltılıyor.', sekil: fFanus(78),
    kok: '<span style="font-weight:400">I. Zilin sesi giderek azalır.<br>II. LED’in ışığı dışarıdan görülmez olur.<br>III. Zilin çekici titreşmeye devam eder.</span><br>Yargılarından hangileri doğrudur?',
    siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'I ve III', 'I, II ve III'] }),
  soru(3, { metin: 'Aynı miktarda ışık veren bir akkor ampul ile bir LED ampulün her saniyelik enerji dökümü şekilde verilmiştir.', sekil: fAmpul(118),
    kok: 'LED ampul, akkor ampule göre her saniye kaç J daha az ısı verir?',
    siklar: ['6', '51', '54', '57', '63'] }),
  soru(4, { metin: 'Enerji, farklı yerlerde farklı biçimlerde depolanabilir.', kok: 'Aşağıdakilerin hangisinde enerji kimyasal enerji olarak depolanmış <u>değildir</u>?', k: 2,
    siklar: ['Telefon bataryası', 'Barajda biriken su', 'Kuru odun', 'Bir dilim ekmek', 'Kibrit başı'] }),
  soru(5, { metin: 'Elif kahvaltıdan sonra 4. kattaki evine merdivenle çıkıyor ve kapının önünde duruyor.', k: 2,
    kok: '<span style="font-weight:400">I. Besinlerdeki kimyasal enerjinin bir kısmı Elif’in potansiyel enerjisine dönüşmüştür.<br>II. Elif’in vücudunda ısı açığa çıkmış ve bir kısmı çevreye geçmiştir.<br>III. Merdiven çıkarken harcanan enerjinin bir kısmı yok olmuştur.</span><br>Yargılarından hangileri doğrudur?',
    siklar: ['Yalnız I', 'Yalnız III', 'I ve II', 'II ve III', 'I, II ve III'] }),
  soru(6, { metin: 'Bir bardakta ve bir demlikte aynı sıcaklıkta çay var. Demlikteki çayın kütlesi bardaktakinin 5 katıdır.',
    kok: '<span style="font-weight:400">I. Demlikteki çayın iç enerjisi daha büyüktür.<br>II. Demlikteki çay, bardaktakinden daha fazla ısı içerir.<br>III. Bardaktaki çay demliğe dökülürse aralarında ısı alışverişi olmaz.</span><br>Yargılarından hangileri doğrudur?',
    siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'II ve III', 'I ve III'] }),
  soru(7, { metin: 'Gücü 2000 W olan bir su ısıtıcısı 3 dakika çalıştırılıyor. Bu sürede suya 300 000 J ısı aktarılıyor, kalan enerji ısıtıcının gövdesini ve çevreyi ısıtıyor.',
    kok: 'Suya aktarılmayan enerji kaç J’dür?',
    siklar: ['60 000', '300 000', '360 000', '6000', '660 000'] }),
  soru(8, { metin: `Bazı cihazlara giren enerji ve cihazdan istenen enerji biçimi tabloda verilmiştir.<table class="t" style="max-width:120mm;margin:8px 0"><tr><th></th><th>Cihaz</th><th>Giren</th><th>İstenen çıkan</th></tr>
<tr><td><b>I</b></td><td>Mikrofon</td><td>ses</td><td>elektrik</td></tr>
<tr><td><b>II</b></td><td>Hoparlör</td><td>elektrik</td><td>ses</td></tr>
<tr><td><b>III</b></td><td>Güneş paneli</td><td>ışık</td><td>elektrik</td></tr>
<tr><td><b>IV</b></td><td>Kibrit</td><td>kimyasal</td><td>ısı ve ışık</td></tr>
<tr><td><b>V</b></td><td>Elektrik motoru</td><td>mekanik</td><td>elektrik</td></tr></table>`,
    kok: 'Hangi satırdaki bilgi yanlıştır?', siklar: ['I', 'II', 'III', 'IV', 'V'] }),
  soru(9, { metin: 'Enerji biçimlerinin hepsinde ortak olan özellikler vardır.', kok: 'Aşağıdakilerden hangisi enerji biçimlerinin <u>ortak</u> özelliği değildir?', k: 1,
    siklar: ['Hepsi yalnız maddesel bir ortamda yayılır.', 'Birimleri joule (J)’dür.', 'Birbirlerine dönüşebilirler.', 'Dönüşümlerde bir kısmı istenmeyen biçimlere geçer.', 'Oluşmaları için bir kaynak gerekir.'] }),
  soru(10, { metin: '<b>Açık uçlu.</b> Elektrikli bir otomobil, uzun bir yokuştan sabit hızla iniyor. Bu sırada fren pedalına basılınca motor jeneratör gibi çalışıyor ve bataryayı şarj ediyor. İniş sırasında 10 saniyede otomobilin mekanik enerjisi 200 000 J azalıyor, bataryada 120 000 J kimyasal enerji depolanıyor.',
    kok: 'a) Otomobil sabit hızla indiğine göre mekanik enerjinin hangi bileşeni azalmaktadır?<br>b) Frenleme sırasındaki enerji dönüşümünü zincir hâlinde yazınız.<br>c) Bataryaya depolanamayan enerji kaç J’dür, bu enerji hangi biçimlere dönüşmüş olabilir?' }),

  cevaplar([
    ['C', 'Kömürün kimyasal enerjisi yanınca ısı olur (I). Isı suyu buhara çevirir, buhar türbini döndürür: mekanik (II). Jeneratör mekanik enerjiyi elektriğe çevirir (III).'],
    ['D', 'Hava azaldıkça sesi taşıyacak molekül azalır: ses giderek azalır (I doğru). Işık boşlukta da yayılır, LED görünmeye devam eder (II yanlış). Zil pille çalıştığı için çekici titreşmeye devam eder, yalnız ses dışarı taşınamaz (III doğru).'],
    ['B', 'LED: $9 - 3 = 6$ J ısı. Akkor: 57 J ısı. Fark: $57 - 6 = 51$ J.'],
    ['B', 'Barajdaki su yüksekte durduğu için enerjisi potansiyel enerjidir, yani mekanik enerji. Batarya, odun, ekmek ve kibrit başı kimyasal enerji depolar.'],
    ['C', 'Elif yükseldiği için potansiyel enerjisi arttı (I doğru). Kaslar çalışırken ısı açığa çıkar (II doğru). Enerji yok olmaz, bir kısmı ısıya geçer (III yanlış).'],
    ['E', 'Aynı sıcaklıkta daha çok madde, daha çok iç enerji demektir (I doğru). Cisimler ısı içermez, iç enerjiye sahiptir (II yanlış). Sıcaklıklar eşit olduğu için ısı alışverişi olmaz (III doğru).'],
    ['A', '3 dk = 180 s. Harcanan elektrik enerjisi: $2000 \\times 180 = 360\\,000$ J. Suya aktarılmayan: <span style="white-space:nowrap">$360\\,000 - 300\\,000 = 60\\,000$ J.</span>'],
    ['E', 'Elektrik motoru elektrik enerjisini mekanik enerjiye çevirir. Mekanik enerjiyi elektriğe çeviren jeneratördür.'],
    ['A', 'Işık boşlukta da yayılır. Ses ise maddesel ortam ister. Diğer dördü bütün enerji biçimleri için doğrudur.'],
    ['–', 'a) Hız sabit olduğu için kinetik enerji değişmez. Otomobil alçaldığı için <b>potansiyel enerji</b> azalır. b) Mekanik (tekerlek) → elektrik (motor jeneratör gibi çalışır) → kimyasal (batarya). c) $200\\,000 - 120\\,000 = 80\\,000$ J. Bu enerji motorda, kablolarda, frenlerde ve tekerleklerde ısıya, bir kısmı da sese dönüşmüştür.'],
  ]),
  sonraki('Mekanik enerji: kinetik ve potansiyel enerji'),
].join('\n');

// --- Instagram slaytları (kapak ve son CTA otomatik) ---
const slaytlar = [
  { pill: '7 BİÇİM', h: 'Enerjinin <em>yedi</em> biçimi', lst: ['<b>Mekanik:</b> hareket ve konum', '<b>Kimyasal:</b> yakıt, besin, batarya', '<b>Nükleer:</b> atom çekirdeği', '<b>Isı:</b> sıcaktan soğuğa akan enerji', '<b>Işık</b>, <b>ses</b> ve <b>elektrik</b>'] },
  { pill: 'ENERJİ ZİNCİRİ', h: 'Enerjinin <em>izini</em> sür', svg: fScooter(), bd: 'Kimyasal → elektrik → mekanik. Yol boyunca bir kısmı <b>ısı ve ses</b> olur.' },
  { pill: 'KAYBOLMAZ', h: 'Enerji <em>yok olmaz</em>, biçim değiştirir', svg: fMotor(), bd: 'Benzinli motorda 100 J’ün yalnız 30 J’ü arabayı yürütür. Gerisi çoğunlukla <b>ısıya</b> gider.' },
  { pill: 'IŞIK MI, SES Mİ?', h: 'Uzayda patlama <em>duyulmaz</em>', lst: ['İkisi de dalga hâlinde yayılır, enerji taşır.', '<span class="x">✗</span> Ses boşlukta yayılmaz, titreşecek molekül ister.', '<span class="v">✓</span> Işık boşlukta da yayılır.', 'Bu yüzden patlamayı görürsün ama duymazsın.'] },
  { pill: 'DEPOLAMA', h: 'Enerji nerede <em>saklanır?</em>', lst: ['<b>Kimyasal:</b> pil, yakıt, besin', '<b>Potansiyel (mekanik):</b> barajdaki su, kurulu yay', 'Işık ve ses doğrudan depolanmaz, başka biçime çevrilir.', 'Pil elektrik değil, <b>kimyasal enerji</b> depolar.'] },
  { pill: 'DİKKAT', h: 'En sık 3 <em>hata</em>', lst: ['<span class="x">✗</span> Enerji dönüşümde yok olur. <span class="v">✓</span> Isıya geçer, toplam korunur.', '<span class="x">✗</span> Isı ile sıcaklık aynıdır. <span class="v">✓</span> Isı aktarılan enerjidir (J).', '<span class="x">✗</span> Duran cismin mekanik enerjisi yoktur. <span class="v">✓</span> Yüksekteyse potansiyel enerjisi var.'] },
  { pill: 'SIRA SENDE', h: 'LED kaç J daha az <em>ısı</em> verir?', svg: fAmpul(), bd: 'İki ampul aynı ışığı veriyor. LED, akkor ampule göre her saniye kaç J daha az ısı verir?', bant: ['Cevabını yorumlara yaz 👇', 'Çözüm PDF’te'] },
  { pill: 'GÜNLÜK HAYATTA', h: 'Güneş panelli <em>kamp feneri</em>', svg: fFener(), bd: 'Gündüz ışık → elektrik → kimyasal. Akşam kimyasal → elektrik → <b>ışık + ısı</b>.' },
];

module.exports = {
  sinif: 10, no: 3, gun: 'Çarşamba',
  slug: '10-fizik-notlari-3-enerji-bicimleri',
  konuKisa: 'Enerji biçimleri',
  pdfBaslik: 'Enerji Biçimleri',
  baslik: 'Enerji Biçimleri ve Enerji Dönüşümleri',
  alt: 'Yedi enerji biçimi, enerji zincirleri, “enerji kaybı” ne demek, biçimlerin benzer ve farklı yönleri. Konu özeti, sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
  slaytBaslik: 'Enerji <span style="color:#e9a400">biçimleri</span> ve dönüşümler',
  slaytAlt: 'Enerjinin izini sür: nereden girdi, neye dönüştü?',
  promoKonu: 'Enerji',
  pdfOzet: 'Özet, 5 sık hata, 2 çözümlü örnek, <b>10 soru ve çözümleri.</b>',
  govde, slaytlar,
  aciklama: `
Pil elektrik mi depolar? 🔋 Kaydır, 30 saniyede öğren.

Kaydırınca: enerjinin yedi biçimi, scooterda enerji zinciri, enerji neden kaybolmaz, ışık ile sesin farkı, enerjinin nerede saklandığı, en sık 3 hata ve bir mini soru.

Notun tamamı ücretsiz PDF: özet, 5 sık hata, 2 çözümlü örnek, 10 soru ve çözümleri.
1) Takip et
2) Profildeki linke dokun
3) 10. sınıf bölümünden notu indir (üyelik yok)

7. slayttaki sorunun cevabını yorumlara yaz 👇
Her Çarşamba 10. sınıf için yeni not.

#10sınıf #10sınıffizik #maarifmodeli #fizik #fiziknotları #enerji #enerjibiçimleri #enerjidönüşümü #benfizikyapamiyorum`,
  ilkYorum: '📌 PDF profildeki linkte: benfizikyapamiyorum.com/ucretsiz/pdf. 7. slaytın cevabı PDF’in çözüm sayfasında. Gelecek hafta: kinetik ve potansiyel enerji.',
  hub: {
    etiket: '10. SINIF · MAARİF MODELİ · NOT #3',
    baslik: 'Enerji biçimleri ve enerji dönüşümleri',
    aciklama: 'Yedi enerji biçimi, enerji zincirleri, enerji kaybı ne demek, biçimlerin benzer ve farklı yönleri. Sık yapılan 5 hata, 2 çözümlü örnek, 10 soru ve çözümleri.',
    takvimLink: 'Not #3 · Enerji biçimleri ↓',
    tarih: '2026-11-25',
    devam: { href: '/10-sinif-fizik-paketi.html', img: '/img/fizik10/set.webp', lab: 'not10_yap', b: 'Devamı: Yapabilirim 10 · Enerji', span: 'Konu notu, kavram kartları, yeni nesil sorular, adım adım çözümler', em: '₺599 →' },
  },
};
