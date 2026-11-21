// Act III — Janam Kundli in the North Indian diamond layout.
import { CITIES, RASHIS, GRAHA_BY_KEY } from '../astro/data.js';
import { birthChart } from '../astro/panchang.js';
import { C } from '../art/palette.js';
import { triRing } from '../art/motifs.js';

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
  sun: '#c25410', moon: '#1f4e9c', mars: C.red, mercury: C.green, jupiter: '#b07a00',
  venus: '#c2326a', saturn: C.indigo, rahu: '#4a4f63', ketu: '#7a4a1f',
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
    houses += `<text x="${nx}" y="${ny + 6}" text-anchor="middle" class="k-num" font-size="17" font-weight="800" fill="${C.red}">${sign}</text>`;
    const list = byHouse[h].slice();
    if (h === 0) list.unshift({ key: 'asc', degree: chart.lagna.degree });
    const [cx, cy] = CENTRE[h];
    const lh = list.length > 3 ? 17 : 22;
    list.forEach((p, k) => {
      const y = cy + (k - (list.length - 1) / 2) * lh + 5;
      const label = p.key === 'asc' ? 'Asc' : GRAHA_BY_KEY[p.key].abbr;
      const color = p.key === 'asc' ? C.ink : PLANET_COLOR[p.key];
      houses += `<text class="k-planet" style="--i:${h + k}" x="${cx}" y="${y}" text-anchor="middle" font-size="${list.length > 3 ? 15 : 19}" font-weight="800" fill="${color}">${label}<tspan font-size="12" font-weight="600" dx="2">${Math.floor(p.degree)}°</tspan></text>`;
    });
  }
  return `<svg viewBox="-24 -24 448 448" role="img" aria-label="North Indian style birth chart">
    <rect x="-24" y="-24" width="448" height="448" fill="${C.paper}"/>
    <rect x="0" y="0" width="400" height="400" fill="#fffaf0"/>
    <path d="M200,0 L400,200 L200,400 L0,200 Z" fill="#fdf0d5"/>
    <g fill="none" stroke="${C.ink}" stroke-linecap="round">
      <path class="k-line" d="M0,0 H400 V400 H0 Z" stroke-width="4"/>
      <path class="k-line" d="M0,0 L400,400 M400,0 L0,400" stroke-width="2.6"/>
      <path class="k-line" d="M200,0 L400,200 L200,400 L0,200 Z" stroke-width="2.6"/>
    </g>
    <g transform="translate(200 200)">${triRing(16, 10, 22, C.red, C.yellow, 1)}<circle r="10" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.6"/></g>
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
      <div class="fact"><small>Lagna · Ascendant</small><strong>${L.sa}</strong><span class="deva">${L.hi}</span> <span>${Math.floor(chart.lagna.degree)}°</span></div>
      <div class="fact"><small>Rashi · Moon sign</small><strong>${M.sa}</strong><span class="deva">${M.hi}</span></div>
      <div class="fact"><small>Nakshatra</small><strong>${nak.name}</strong> <span>pada ${nak.pada}</span></div>
      <div class="fact"><small>Surya · Sun sign</small><strong>${S.sa}</strong><span class="deva">${S.hi}</span></div>
      <div class="fact"><small>Janma Tithi</small><strong>${chart.tithi.paksha} ${chart.tithi.name}</strong></div>`;
    reading.innerHTML = `
        <h3>${name ? `${name}, here's your first glimpse` : 'Reading the sky right now'}</h3>
        <p>${LAGNA_TEXT[chart.lagna.rashi]} ${MOON_TEXT[M.element]}</p>
        <p>Your full Kundli covers Vimshottari dasha, doshas, yogas and remedies. A Jyotishi can walk you through it.</p>
        <a class="btn btn-yellow" href="#jyotishi">Discuss my chart, free</a>`;
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
