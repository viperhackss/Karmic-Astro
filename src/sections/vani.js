// Act VIII — testimonials performed by papercut shadow puppets, after the
// Tholu Bommalata of Andhra Pradesh: perforated silhouettes held against a
// lamp-lit screen and worked by rods from below.
import { starPath, crescentPath } from '../art/cosmos.js';

const LEATHER = {
  skin: '#1d0f31',
  red: '#25123f',
  yellow: '#2b1648',
  green: '#1d0f31',
  blue: '#25123f',
  line: '#13081f',
  hole: '#ffe6b0',
};

export const STORIES = [
  { text: 'My career was stuck for two years. Acharya ji read my Shani dasha and told me to wait till March. The offer letter came on 9 March!', name: 'Priya S.', meta: 'Pune · Career consultation', speaker: 0 },
  { text: 'We were nervous about our 16 gunas. The astrologer explained every dosha calmly and gave simple remedies. Married now, and very happy!', name: 'Karthik & Divya', meta: 'Chennai · Kundli Milan', speaker: 1 },
  { text: 'The daily rashiphal is the first thing I read with my chai. Short, sweet and surprisingly spot on.', name: 'Imran K.', meta: 'Lucknow · Daily horoscope', speaker: 1 },
  { text: 'I spoke to a tarot reader at 2 AM when I couldn’t sleep. She was kind, honest and didn’t try to sell me anything.', name: 'Neha R.', meta: 'Delhi · Tarot', speaker: 0 },
  { text: 'The Vastu tips for my new shop were practical, not superstitious. Sales are up and the space finally feels right.', name: 'Gurpreet S.', meta: 'Amritsar · Vastu', speaker: 1 },
];

const holes = (pts, r = 2.2) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${LEATHER.hole}"/>`).join('');
const row = (x1, y1, x2, y2, n, r) => holes(Array.from({ length: n }, (_, i) => [x1 + ((x2 - x1) * i) / (n - 1), y1 + ((y2 - y1) * i) / (n - 1)]), r);
const P = (d, fill, sw = 3) => `<path d="${d}" fill="${fill}" stroke="${LEATHER.line}" stroke-width="${sw}" stroke-linejoin="round"/>`;

/** A profile shadow puppet facing right; origin at the waist. */
function figure({ crown = true, bun = false, skirt = LEATHER.yellow, top = LEATHER.red, moustache = false } = {}) {
  const head = `
    ${bun ? P('M-30,-140 C-44,-140 -44,-120 -30,-118 C-24,-124 -24,-134 -30,-140 Z', LEATHER.line, 2) : ''}
    ${P('M-6,-104 C-16,-112 -20,-128 -16,-142 C-12,-156 0,-164 12,-162 C20,-160 24,-152 24,-146 L32,-136 L25,-133 L27,-127 L23,-124 C22,-118 18,-112 10,-108 Z', LEATHER.skin)}
    <path d="M4,-146 Q12,-152 20,-146 Q12,-141 4,-146 Z" fill="${LEATHER.hole}" stroke="${LEATHER.line}" stroke-width="1.6"/>
    <circle cx="13" cy="-146.5" r="2.2" fill="${LEATHER.line}"/>
    <path d="M2,-154 Q12,-160 22,-153" fill="none" stroke="${LEATHER.line}" stroke-width="2.4"/>
    ${moustache ? '<path d="M24,-131 C18,-128 12,-130 8,-134" fill="none" stroke="#2a1206" stroke-width="3" stroke-linecap="round"/>' : ''}
    <circle cx="-2" cy="-126" r="5" fill="${LEATHER.yellow}" stroke="${LEATHER.line}" stroke-width="1.6"/>
    ${crown
      ? `${P('M-18,-150 L-14,-188 L-6,-178 L2,-206 L10,-178 L18,-188 L22,-154 C8,-162 -6,-160 -18,-150 Z', LEATHER.yellow, 2.6)}${row(-12, -170, 16, -170, 6, 2)}${holes([[2, -190]], 3)}`
      : `${P('M-18,-148 C-20,-166 0,-174 18,-158 C8,-160 -6,-158 -18,-148 Z', LEATHER.line, 2)}`}`;
  const torso = `${P('M-22,-104 L18,-104 C26,-80 24,-40 16,0 L-18,0 C-24,-40 -28,-80 -22,-104 Z', top)}
    ${row(-14, -92, 12, -92, 6, 2)}${row(-12, -60, 10, -60, 5, 2.4)}${row(-14, -26, 12, -26, 6, 2)}
    <path d="M-16,-100 Q0,-82 16,-100" fill="none" stroke="${LEATHER.hole}" stroke-width="2.4" stroke-dasharray="0.1 5" stroke-linecap="round"/>`;
  const sk = `${P('M-20,0 L18,0 C30,40 44,90 50,140 L-46,140 C-40,90 -30,40 -20,0 Z', skirt)}
    ${P('M-34,92 L40,92 L44,112 L-40,112 Z', LEATHER.red, 2)}
    ${row(-30, 102, 36, 102, 9, 2.4)}${row(-18, 30, 18, 30, 5, 2.2)}${row(-26, 62, 30, 62, 7, 2.2)}
    ${holes([[-8, 128], [6, 128], [20, 128], [-22, 128], [34, 128], [-36, 128]], 3)}
    ${P('M-30,140 L-16,140 L-12,152 L-36,152 Z', LEATHER.skin, 2)}${P('M14,140 L28,140 L40,152 L16,152 Z', LEATHER.skin, 2)}`;
  const backArm = P('M-14,-96 C-28,-70 -32,-50 -28,-28 L-20,-28 C-22,-50 -18,-70 -6,-92 Z', LEATHER.skin, 2.4);
  const upper = `${P('M-7,0 L7,0 C9,16 8,32 6,46 L-5,46 C-8,32 -9,16 -7,0 Z', top, 2.4)}${holes([[0, 14], [0, 28]], 2)}`;
  const fore = `${P('M-5,0 L5,0 L7,40 L-4,40 Z', LEATHER.skin, 2.2)}${P('M-5,38 C-9,52 4,58 12,48 L7,38 Z', LEATHER.skin, 2.2)}
    <path d="M2,46 L2,420" stroke="${LEATHER.line}" stroke-width="2.6"/>`;
  return `<g class="sp-body">
      <path d="M0,-40 L0,420" stroke="${LEATHER.line}" stroke-width="4"/>
      ${backArm}${sk}${torso}${head}
      <g class="sp-upper" transform="translate(6 -96)">${upper}<g class="sp-fore" transform="translate(0 46)">${fore}</g></g>
    </g>`;
}

export function initVani(ctx) {
  const { gsap, reduced } = ctx;
  const svg = document.querySelector('[data-shadow-svg]');
  const quote = document.querySelector('[data-quote]');
  const text = quote.querySelector('[data-quote-text]');
  const nameEl = quote.querySelector('[data-quote-name]');
  const metaEl = quote.querySelector('[data-quote-meta]');
  const dots = quote.querySelector('[data-quote-dots]');

  svg.innerHTML = `
    <defs><filter id="sp-soft"><feGaussianBlur stdDeviation="0.8"/></filter></defs>
    <g fill="${LEATHER.skin}" opacity=".9">
      <path d="${crescentPath(34, 18, -10)}" transform="translate(120 90)"/>
      <path d="${starPath(220, 60, 10, 5)}"/><path d="${starPath(700, 70, 12, 4, 0.34)}"/><path d="${starPath(790, 140, 7, 5)}"/>
      <path d="M0,460 L0,420 C120,396 240,430 380,414 C520,398 640,428 900,404 L900,460 Z"/>
    </g>
    <g filter="url(#sp-soft)">
      <g class="sp sp-a" transform="translate(300 250)">${figure({ crown: false, bun: true, skirt: LEATHER.green, top: LEATHER.red })}</g>
      <g class="sp sp-b" transform="translate(610 250) scale(-1 1)">${figure({ crown: true, skirt: LEATHER.yellow, top: LEATHER.blue, moustache: true })}</g>
    </g>`;
  // Joint angles live in plain objects; GSAP tweens them and we write the
  // SVG transforms ourselves so each joint pivots exactly where its rivet is.
  const puppets = [...svg.querySelectorAll('.sp')].map((g) => ({
    body: g.querySelector('.sp-body'),
    upper: g.querySelector('.sp-upper'),
    fore: g.querySelector('.sp-fore'),
    s: { ua: 0, fa: 0, by: 0, bx: 0, br: 0 },
  }));
  const draw = () => {
    for (const p of puppets) {
      const { ua, fa, by, bx, br } = p.s;
      p.body.setAttribute('transform', `translate(${bx.toFixed(2)} ${by.toFixed(2)}) rotate(${br.toFixed(2)} 0 140)`);
      p.upper.setAttribute('transform', `translate(6 -96) rotate(${ua.toFixed(2)})`);
      p.fore.setAttribute('transform', `translate(0 46) rotate(${fa.toFixed(2)})`);
    }
  };
  gsap.ticker.add(draw);

  // Idle breathing.
  if (!reduced) {
    puppets.forEach((p, i) => {
      gsap.to(p.s, { by: -6, br: i ? -1.5 : 1.5, duration: 2.4 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(p.s, { ua: -10, duration: 2.8 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
  }

  function gesture(i) {
    if (reduced) return;
    const p = puppets[i];
    gsap.timeline()
      .to(p.s, { ua: -115, duration: 0.6, ease: 'back.out(2)', overwrite: 'auto' })
      .to(p.s, { fa: -70, duration: 0.4, ease: 'sine.inOut' }, '<0.1')
      .to(p.s, { fa: -30, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' })
      .to(p.s, { ua: -20, duration: 0.9, ease: 'sine.inOut' })
      .to(p.s, { fa: 0, duration: 0.6, ease: 'sine.inOut' }, '<')
      .add(() => gsap.to(p.s, { ua: -10, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    gsap.fromTo(p.s, { bx: 0 }, { bx: 10, duration: 0.3, yoyo: true, repeat: 1 });
  }

  dots.innerHTML = STORIES.map((_, i) => `<button aria-label="Story ${i + 1}"></button>`).join('');
  const dotBtns = [...dots.children];
  let idx = 0;
  let timer;
  function show(i) {
    idx = (i + STORIES.length) % STORIES.length;
    const s = STORIES[idx];
    text.textContent = s.text;
    nameEl.textContent = s.name;
    metaEl.textContent = `Sample story · ${s.meta}`;
    dotBtns.forEach((b, k) => b.classList.toggle('active', k === idx));
    quote.classList.remove('swap');
    void quote.offsetWidth;
    quote.classList.add('swap');
    gesture(s.speaker);
    clearTimeout(timer);
    timer = setTimeout(() => show(idx + 1), 7500);
  }
  quote.querySelector('[data-quote-prev]').addEventListener('click', () => show(idx - 1));
  quote.querySelector('[data-quote-next]').addEventListener('click', () => show(idx + 1));
  dotBtns.forEach((b, i) => b.addEventListener('click', () => show(i)));
  quote.addEventListener('mouseenter', () => clearTimeout(timer));
  quote.addEventListener('mouseleave', () => (timer = setTimeout(() => show(idx + 1), 4000)));
  show(0);
}
