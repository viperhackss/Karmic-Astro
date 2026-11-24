// Act II — nine planet cards hang from a glowing rail and slide past as you
// scroll, swaying with scroll speed. Each shows where that graha is right now
// (sidereal, computed live) and whether it is vakri (retrograde).
import { GRAHAS, RASHIS } from '../astro/data.js';
import { siderealPositions } from '../astro/ephemeris.js';
import { planet } from '../art/cosmos.js';

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

const EN = { rahu: 'North node', ketu: 'South node' };

export function initGrahas(ctx) {
  const { gsap, reduced } = ctx;
  const section = document.getElementById('navagraha');
  const track = section.querySelector('[data-graha-track]');
  const pos = livePositions();

  track.innerHTML = GRAHAS.map((g) => {
    const p = pos[g.key];
    const retro = p.retro && !['rahu', 'ketu'].includes(g.key) ? '<span class="retro">· vakri ℞</span>' : '';
    return `<article class="card graha-card">
      ${planet(g.key, 'planet-art', `${g.name}`)}
      <h3>${g.name}<span class="deva">${g.hi}</span></h3>
      <p class="en">${EN[g.key] || g.key}</p>
      <p class="now">Now in ${p.rashi.sa} ${Math.floor(p.degree)}° ${retro}</p>
      <p class="rules">${g.rules}</p>
      <dl><dt>Gem</dt><dd>${g.gem}</dd><dt>Day</dt><dd>${g.day}</dd><dt class="remedy-row">Remedy</dt><dd class="remedy-row">${g.remedy}</dd></dl>
    </article>`;
  }).join('');

  const cards = [...track.querySelectorAll('.graha-card')];
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
  const sway = cards.map((c) => gsap.quickTo(c, 'rotation', { duration: 0.9, ease: 'elastic.out(1, 0.35)' }));

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
        sway.forEach((fn, i) => fn(-v * (4 + (i % 3))));
      },
    },
  });
}
