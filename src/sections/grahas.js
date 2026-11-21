// Act II — nine graha cards hang from a puppeteer's rod and slide past
// horizontally as you scroll, swaying with your scroll speed. Each shows where
// that graha is right now (sidereal, computed live) and whether it is vakri.
import { GRAHAS, RASHIS } from '../astro/data.js';
import { siderealPositions } from '../astro/ephemeris.js';
import { grahaEmblem, medallion } from '../art/motifs.js';
import { C } from '../art/palette.js';

const RINGS = {
  sun: [C.orange, C.yellow, C.red],
  moon: [C.blue, C.paper, C.yellow],
  mars: [C.red, C.yellow, C.orange],
  mercury: [C.green, C.yellow, C.paper],
  jupiter: [C.yellow, C.red, C.orange],
  venus: [C.pink, C.paper, C.yellow],
  saturn: [C.indigo, C.yellow, C.blue],
  rahu: ['#5a5f73', C.yellow, C.paper],
  ketu: ['#8a5a2b', C.yellow, C.red],
};

export function livePositions(date = new Date()) {
  const now = siderealPositions(date).positions;
  const later = siderealPositions(new Date(date.getTime() + 86400000)).positions;
  const out = {};
  for (const g of GRAHAS) {
    const lon = now[g.key];
    let delta = later[g.key] - lon;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    out[g.key] = { lon, rashi: RASHIS[Math.floor(lon / 30)], degree: lon % 30, retro: delta < 0 };
  }
  return out;
}

export function initGrahas(ctx) {
  const { gsap, ScrollTrigger, reduced } = ctx;
  const section = document.getElementById('navagraha');
  const track = section.querySelector('[data-graha-track]');
  const pos = livePositions();

  track.innerHTML = GRAHAS.map((g) => {
    const p = pos[g.key];
    const [ring, a, b] = RINGS[g.key];
    const retro = p.retro && !['rahu', 'ketu'].includes(g.key) ? ' <span class="retro">℞ vakri</span>' : '';
    return `<article class="graha-card framed">
      <div class="inner">
        ${medallion(grahaEmblem(g.key), { ring, triA: a, triB: b, label: `${g.name} emblem` })}
        <h3>${g.name}<span class="deva">${g.hi}</span></h3>
        <p class="en">${g.key === 'rahu' ? 'North node' : g.key === 'ketu' ? 'South node' : g.key}</p>
        <p class="graha-now">Now in ${p.rashi.sa} ${Math.floor(p.degree)}°${retro}</p>
        <p class="rules">${g.rules}</p>
        <dl><dt>Gem</dt><dd>${g.gem}</dd><dt>Day</dt><dd>${g.day}</dd><dt class="remedy-row">Remedy</dt><dd class="remedy-row">${g.remedy}</dd></dl>
      </div></article>`;
  }).join('');

  const cards = [...track.querySelectorAll('.graha-card')];
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const sway = cards.map((c) => gsap.quickTo(c, 'rotation', { duration: 0.8, ease: 'elastic.out(1, 0.35)' }));

  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        if (reduced) return;
        const v = Math.max(-1, Math.min(1, self.getVelocity() / 2500));
        sway.forEach((fn, i) => fn(-v * (5 + (i % 3))));
      },
    },
  });
  void ScrollTrigger;
}
