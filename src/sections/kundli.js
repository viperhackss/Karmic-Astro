// Act III — Janam Kundli in the North Indian diamond layout.
import { CITIES, RASHIS, GRAHA_BY_KEY } from '../astro/data.js';
import { birthChart } from '../astro/panchang.js';
import { C } from '../art/palette.js';
import { starPath } from '../art/cosmos.js';

// House centroids and sign-number anchors for a 400×400 chart.
const CENTRE = [
  [200, 104], [100, 38], [36, 100], [100, 200], [36, 300], [100, 362],
  [200, 296], [300, 362], [364, 300], [300, 200], [364, 100], [300, 38],
];
const NUM = [
  [200, 178], [100, 84], [84, 100], [178, 200], [84, 300], [100, 318],
  [200, 226], [300, 318], [318, 300], [226, 200], [318, 100], [300, 84],
];
const PLANET_COLOR = {
  sun: C.saffron, moon: C.paper, mars: C.coral, mercury: C.teal, jupiter: C.gold,
  venus: C.rose, saturn: C.sky, rahu: C.lilac, ketu: C.mist,
};

const LAGNA_TEXT = [
  'Aries rising: a born initiator. You meet life head-on and lead by example.',
  'Taurus rising: steady, sensual and loyal. You build things that last.',
  'Gemini rising: curious and quick. Conversations open doors for you.',
  'Cancer rising: intuitive and protective. Home and family are your strength.',
  'Leo rising: warm and radiant. People look to you when the stage lights come on.',
  'Virgo rising: precise and helpful. You turn chaos into a checklist.',
  'Libra rising: graceful and fair. You bring balance to every room.',
  'Scorpio rising: deep and magnetic. You see what others miss.',
  'Sagittarius rising: optimistic and wise. Travel and learning shape your fate.',
  'Capricorn rising: patient and ambitious. Your success grows slowly but surely.',
  'Aquarius rising: original and humane. You think a few years ahead of everyone.',
  'Pisces rising: dreamy and compassionate. Art and spirit guide your steps.',
];
const MOON_TEXT = {
  fire: 'Your Moon sits in a fire sign, so your emotions run bright, fast and brave.',
  earth: 'Your Moon sits in an earth sign, so you feel safest with routine, food and real things.',
  air: 'Your Moon sits in an air sign, so talking things through settles your heart.',
  water: 'Your Moon sits in a water sign, so you feel deeply and remember everything.',
};

export function fillCities(select, selected = 'New Delhi') {
  select.innerHTML = CITIES.map((c) => `<option value="${c.name}" ${c.name === selected ? 'selected' : ''}>${c.name}</option>`).join('');
}

function chartSVG(chart) {
  const lagna = chart.lagna.rashi;
  const byHouse = Array.from({ length: 12 }, () => []);
  chart.planets.forEach((p) => byHouse[p.house - 1].push(p));
  let houses = '';
  for (let h = 0; h < 12; h++) {
    const sign = ((lagna + h) % 12) + 1;
    const [nx, ny] = NUM[h];
    houses += `<text x="${nx}" y="${ny + 6}" text-anchor="middle" class="k-num" font-size="15" font-weight="700" fill="${C.lilac}" opacity=".75">${sign}</text>`;
    const list = byHouse[h].slice();
    if (h === 0) list.unshift({ key: 'asc', degree: chart.lagna.degree });
    const [cx, cy] = CENTRE[h];
    const lh = list.length > 3 ? 17 : 22;
    list.forEach((p, k) => {
      const y = cy + (k - (list.length - 1) / 2) * lh + 5;
      const label = p.key === 'asc' ? 'Asc' : GRAHA_BY_KEY[p.key].abbr;
      const color = p.key === 'asc' ? C.gold : PLANET_COLOR[p.key];
      houses += `<text class="k-planet" style="--i:${h + k}" x="${cx}" y="${y}" text-anchor="middle" font-size="${list.length > 3 ? 15 : 19}" font-weight="800" fill="${color}">${label}<tspan font-size="12" font-weight="600" dx="2">${Math.floor(p.degree)}°</tspan></text>`;
    });
  }
  return `<svg viewBox="-6 -6 412 412" role="img" aria-label="North Indian style birth chart">
    <rect x="0" y="0" width="400" height="400" rx="6" fill="rgba(7,6,26,.55)"/>
    <path d="M200,0 L400,200 L200,400 L0,200 Z" fill="rgba(157,140,240,.08)"/>
    <path d="M200,0 L300,100 L200,200 L100,100 Z" fill="rgba(246,198,91,.08)"/>
    <g fill="none" stroke-linecap="round">
      <path class="k-line" d="M0,0 H400 V400 H0 Z" stroke="${C.gold}" stroke-width="2" opacity=".8"/>
      <path class="k-line" d="M0,0 L400,400 M400,0 L0,400" stroke="${C.lilac}" stroke-width="1.4" opacity=".55"/>
      <path class="k-line" d="M200,0 L400,200 L200,400 L0,200 Z" stroke="${C.lilac}" stroke-width="1.4" opacity=".55"/>
    </g>
    <path d="${starPath(200, 200, 12, 4, 0.34)}" fill="${C.gold}"/>
    ${houses}
  </svg>`;
}

export function initKundli() {
  const form = document.querySelector('[data-kundli-form]');
  const chartBox = document.querySelector('[data-kundli-chart]');
  const facts = document.querySelector('[data-kundli-facts]');
  const reading = document.createElement('div');
  reading.className = 'reading';
  facts.parentElement.appendChild(reading);
  fillCities(form.querySelector('[data-city-select]'));

  function show(chart, caption, name) {
    chartBox.classList.remove('drawn');
    chartBox.innerHTML = chartSVG(chart) + `<span class="chart-caption">${caption}</span>`;
    void chartBox.offsetWidth;
    requestAnimationFrame(() => chartBox.classList.add('drawn'));
    const L = RASHIS[chart.lagna.rashi];
    const M = RASHIS[chart.moon.rashi];
    const S = RASHIS[chart.sun.rashi];
    const nak = chart.moon.nakshatra;
    facts.innerHTML = `
      <div class="fact"><small>Lagna · Ascendant</small><strong>${L.sa}</strong><span class="deva">${L.hi}</span><span class="deg">${Math.floor(chart.lagna.degree)}°</span></div>
      <div class="fact"><small>Rashi · Moon sign</small><strong>${M.sa}</strong><span class="deva">${M.hi}</span></div>
      <div class="fact"><small>Nakshatra</small><strong>${nak.name}</strong><span class="deg">pada ${nak.pada}</span></div>
      <div class="fact"><small>Surya · Sun sign</small><strong>${S.sa}</strong><span class="deva">${S.hi}</span></div>
      <div class="fact"><small>Janma Tithi</small><strong>${chart.tithi.paksha} ${chart.tithi.name}</strong></div>`;
    reading.innerHTML = `
        <h3>${name ? `${name}, here's your first glimpse` : 'Reading the sky right now'}</h3>
        <p>${LAGNA_TEXT[chart.lagna.rashi]} ${MOON_TEXT[M.element]}</p>
        <p>Your full Kundli covers Vimshottari dasha, doshas, yogas and remedies. A Jyotishi can walk you through it.</p>
        <a class="btn btn-primary" href="#jyotishi">Discuss my chart, free</a>`;
  }

  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600000);
  const nowChart = birthChart({
    date: ist.toISOString().slice(0, 10),
    time: ist.toISOString().slice(11, 16),
    place: CITIES[0],
  });
  show(nowChart, 'The sky right now · New Delhi');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const place = CITIES.find((c) => c.name === fd.get('place')) || CITIES[0];
    const name = String(fd.get('name') || '').trim();
    const chart = birthChart({ date: fd.get('date'), time: fd.get('time'), place });
    show(chart, `${name ? `Kundli of ${name}` : 'Your Kundli'} · ${place.name}`, name || 'Friend');
    chartBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
