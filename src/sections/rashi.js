// Act I — the Rashi Chakra turns as you scroll; the sign at the top (under the
// diya) gets today's rashiphal on a palm-leaf card.
import { RASHIS } from '../astro/data.js';
import { dailyHoroscope } from '../astro/horoscope.js';
import { rashiMedallionGroup, rashiMedallion, glyphIcon } from '../art/zodiac.js';
import { fishPairGroup, triRing, dotRing, dbl, polar } from '../art/motifs.js';
import { C } from '../art/palette.js';

const SWATCH = {
  Saffron: '#f4a300', 'Turmeric Yellow': '#f2b01e', 'Leaf Green': '#2f8a4c', 'Peacock Blue': '#1f6f9a',
  'Vermilion Red': '#c92a1e', 'Ivory White': '#fbf6ea', Indigo: '#263a8a', 'Rose Pink': '#e0457b',
  'Marigold Orange': '#e8731a', 'Silver Grey': '#b9b9b9',
};
const R = 228;
const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);

export function initRashi(ctx) {
  const { ScrollTrigger, lenis } = ctx;
  const section = document.getElementById('rashi');
  const wheel = section.querySelector('[data-wheel]');
  const body = section.querySelector('[data-horoscope-body]');
  const tabs = [...section.querySelectorAll('[data-day]')];
  const indexList = section.querySelector('[data-rashi-index]');

  // ── Build the wheel ──
  let spokes = '';
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = polar(150, i * 30 + 15);
    const [x2, y2] = polar(292, i * 30 + 15);
    spokes += dbl(`M${x1},${y1} L${x2},${y2}`, { w: 4, gap: 1.3 });
  }
  let signs = '';
  RASHIS.forEach((r, i) => {
    const [x, y] = polar(R, i * 30);
    signs += `<g class="r-sign" data-i="${i}" tabindex="0" role="button" aria-label="${r.en} (${r.sa})" transform="translate(${x} ${y})">
      <g class="r-inner">
        <circle class="r-focus" r="50" fill="none" stroke="transparent"/>
        <g class="r-med" transform="translate(0 -8) scale(0.44)">${rashiMedallionGroup(r)}</g>
        <text class="r-label" y="56" text-anchor="middle">${r.en.toUpperCase()}</text>
      </g></g>`;
  });
  wheel.innerHTML = `
    <circle r="314" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>
    ${triRing(60, 294, 312, C.yellow, C.orange, 1.4)}
    <circle r="294" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>
    <circle r="286" fill="none" stroke="${C.ink}" stroke-width="1.4"/>
    <g class="ring">
      <circle r="290" fill="url(#mb-dots)" opacity=".18"/>
      ${spokes}
      <circle r="150" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/>
      ${triRing(40, 132, 150, C.red, C.green, 1.3)}
      <circle r="132" fill="${C.paper}" stroke="${C.ink}" stroke-width="3.4"/>
      ${dotRing(40, 126, 1.6)}
      <g class="hub" transform="scale(1.08)">${fishPairGroup()}</g>
      ${signs}
    </g>
    <path d="M0,-318 L-14,-338 L14,-338 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>`;

  const ring = wheel.querySelector('.ring');
  const hub = wheel.querySelector('.hub');
  const signEls = [...wheel.querySelectorAll('.r-sign')];
  const inners = signEls.map((s) => s.querySelector('.r-inner'));

  // Quick-jump index
  indexList.innerHTML = RASHIS.map((r, i) => `<li><button data-i="${i}">${glyphIcon(r.key)}${r.en}</button></li>`).join('');
  const indexBtns = [...indexList.querySelectorAll('button')];

  let active = -1;
  let day = 0;

  function render(i, offset = day) {
    if (offset === 'weekly') {
      body.innerHTML = `<div class="h-head">${rashiMedallion(RASHIS[i])}<div><h3>${RASHIS[i].en}<span class="deva">${RASHIS[i].hi}</span></h3><p>${RASHIS[i].dates}</p></div></div>
        <p class="h-summary">Weekly and monthly rashiphal, with Shani and Guru transits, festivals and muhurats, live in the KarmicAstro app.</p>
        <a class="btn btn-primary" href="#app">Get the app</a>`;
      return;
    }
    const h = dailyHoroscope(i, new Date(), offset);
    const r = h.rashi;
    const sw = SWATCH[h.luckyColor] || C.yellow;
    body.innerHTML = `
      <div class="h-head">${rashiMedallion(r)}<div><h3>${r.en}<span class="deva">${r.hi}</span></h3><p>${r.sa} · ${r.dates} · ${h.vaar.en}</p></div></div>
      <p class="h-transit">☾ Moon in ${h.moonRashi.sa}, ${h.moonNakshatra} · house ${h.house} from you</p>
      <p class="h-summary">${h.summary}</p>
      <div class="h-areas">
        <div class="h-area"><b>Love</b><p>${h.love}</p><div class="meter"><i style="--v:${h.meters.love}%"></i></div></div>
        <div class="h-area"><b>Career</b><p>${h.career}</p><div class="meter"><i style="--v:${h.meters.career}%"></i></div></div>
        <div class="h-area"><b>Health</b><p>${h.health}</p><div class="meter"><i style="--v:${h.meters.health}%"></i></div></div>
      </div>
      <div class="h-lucky">
        <span><i class="swatch" style="background:${sw}"></i>${h.luckyColor}</span>
        <span>No. ${h.luckyNumber}</span>
        <span>⏱ ${h.luckyTime}</span>
      </div>
      <a class="h-cta" href="#jyotishi">Ask a Jyotishi about your ${r.en} day →</a>`;
    body.classList.remove('flip');
    void body.offsetWidth;
    body.classList.add('flip');
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    signEls.forEach((s, k) => s.classList.toggle('active', k === i));
    indexBtns.forEach((b, k) => b.classList.toggle('active', k === i));
    render(i);
  }

  function rotateTo(f) {
    // f: fractional sign index (0..11)
    const theta = f * 30;
    ring.setAttribute('transform', `rotate(${-theta})`);
    hub.setAttribute('transform', `rotate(${theta * 1.5}) scale(1.08)`);
    inners.forEach((inner, k) => {
      const d = Math.abs(((k - f + 18) % 12) - 6);
      const scale = 1 + Math.max(0, 1 - d) * 0.22;
      inner.setAttribute('transform', `rotate(${theta}) scale(${scale.toFixed(3)})`);
    });
    setActive(((Math.round(f) % 12) + 12) % 12);
  }

  // ── Scroll scrubbing ──
  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
    pin: true,
    anticipatePin: 1,
    onUpdate(self) {
      const f = self.progress * 11;
      const i = Math.floor(f);
      const frac = f - i;
      const eased = i + smoother(Math.min(1, Math.max(0, (frac - 0.25) / 0.5)));
      rotateTo(eased);
    },
  });
  rotateTo(0);

  const goTo = (i) => {
    const y = st.start + ((st.end - st.start) * i) / 11 + 2;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  signEls.forEach((s, i) => {
    s.addEventListener('click', () => goTo(i));
    s.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goTo(i);
      }
    });
  });
  indexBtns.forEach((b, i) => b.addEventListener('click', () => goTo(i)));

  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-selected', String(x === t)));
      day = t.dataset.day === 'weekly' ? 'weekly' : Number(t.dataset.day);
      render(active, day);
    }),
  );

  return { st };
}
