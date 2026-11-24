// Act VI — Aaj ka Panchang with a papercut moon showing tonight's real phase.
import { panchang, tithiOf } from '../astro/panchang.js';
import { siderealPositions } from '../astro/ephemeris.js';
import { CITIES } from '../astro/data.js';
import { fillCities } from './kundli.js';
import { C } from '../art/palette.js';
import { starPath } from '../art/cosmos.js';

const VAAR_DEVA = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const fmtTime = (d) =>
  new Date(d.getTime() + 5.5 * 3600000).toISOString().slice(11, 16).replace(/^(\d\d):(\d\d)$/, (_, h, m) => {
    const hh = Number(h);
    return `${((hh + 11) % 12) + 1}:${m} ${hh < 12 ? 'AM' : 'PM'}`;
  });
const fmtDate = (d, opts) => d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', ...opts });

function moonSVG(elong) {
  const r = 120;
  const k = Math.cos((elong * Math.PI) / 180);
  const rx = Math.abs(k) * r;
  const waxing = elong < 180;
  let shadow;
  if (waxing) shadow = `M0,${-r} A${r},${r} 0 0 0 0,${r} A${rx},${r} 0 0 ${k > 0 ? 0 : 1} 0,${-r} Z`;
  else shadow = `M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${k < 0 ? 0 : 1} 0,${-r} Z`;
  let ring = '';
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2;
    ring += `<circle cx="${(Math.cos(a) * 156).toFixed(1)}" cy="${(Math.sin(a) * 156).toFixed(1)}" r="${i % 5 ? 1.4 : 2.6}" fill="${i % 5 ? C.mist : C.gold}" opacity="${i % 5 ? 0.45 : 0.9}"/>`;
  }
  return `<svg viewBox="-175 -175 350 350" class="art" role="img" aria-label="Tonight's moon phase">
    <circle r="170" fill="url(#g-halo)" opacity=".25"/>
    ${ring}
    <g filter="url(#paper)">
      <circle r="${r}" cy="6" fill="${C.edge}"/>
      <circle r="${r}" fill="${C.paper}"/>
      <circle cx="-40" cy="-30" r="20" fill="#e6dac2"/><circle cx="34" cy="36" r="14" fill="#e6dac2"/>
      <circle cx="44" cy="-48" r="9" fill="#e6dac2"/><circle cx="-24" cy="58" r="10" fill="#e6dac2"/>
      <circle cx="-70" cy="30" r="7" fill="#e6dac2"/>
      <path d="${shadow}" fill="${C.n2}" opacity=".93"/>
    </g>
    <path d="${starPath(-140, -110, 12, 4, 0.34)}" fill="${C.gold}"/>
    <path d="${starPath(134, 120, 9, 4, 0.34)}" fill="${C.mist}"/>
  </svg>`;
}

function upcoming(from) {
  const found = {};
  const want = { 10: 'Ekadashi', 25: 'Ekadashi', 14: 'Purnima', 29: 'Amavasya' };
  const base = new Date(from);
  for (let d = 1; d <= 32 && Object.keys(found).length < 3; d++) {
    // Sunrise in India ≈ 01:00 UTC
    const day = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + d, 1, 0));
    const { positions } = siderealPositions(day);
    const t = tithiOf(positions.sun, positions.moon);
    const name = want[t.index];
    if (name && !found[name]) found[name] = { date: day, paksha: t.paksha, inDays: d };
  }
  return ['Ekadashi', 'Purnima', 'Amavasya']
    .filter((n) => found[n])
    .map((n) => ({ name: n, ...found[n] }))
    .sort((a, b) => a.inDays - b.inDays);
}

export function initPanchang() {
  const card = document.querySelector('[data-panchang]');
  const select = card.querySelector('[data-panchang-city]');
  const moonBox = document.querySelector('[data-moon-phase]');
  fillCities(select);

  function render() {
    const place = CITIES.find((c) => c.name === select.value) || CITIES[0];
    const now = new Date();
    const p = panchang(now, place);
    card.querySelector('[data-p-date]').textContent = fmtDate(now, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    card.querySelector('[data-p-vaar]').innerHTML = `<span class="deva">${VAAR_DEVA[VAAR_INDEX(p.vaar.en)]}</span> ${p.vaar.hi}`;
    card.querySelector('[data-p-limbs]').innerHTML = `
      <div><dt>Tithi</dt><dd>${p.tithi.name}<small>${p.tithi.paksha} paksha</small></dd></div>
      <div><dt>Nakshatra</dt><dd>${p.nakshatra.name}<small>pada ${p.nakshatra.pada}</small></dd></div>
      <div><dt>Yoga</dt><dd>${p.yoga}<small>Sun + Moon</small></dd></div>
      <div><dt>Karana</dt><dd>${p.karana}<small>half-tithi</small></dd></div>
      <div><dt>Vaar</dt><dd>${p.vaar.hi}<small>${p.vaar.en}</small></dd></div>
      <div><dt>Chandra Rashi</dt><dd>${p.moonRashi.sa}<small>${p.moonRashi.en}</small></dd></div>`;
    card.querySelector('[data-p-sun]').innerHTML = `<span>Sunrise <b>${fmtTime(p.sunrise)}</b></span><span>Sunset <b>${fmtTime(p.sunset)}</b></span><span>${place.name}</span>`;
    const up = upcoming(now);
    card.querySelector('[data-p-upcoming]').innerHTML = `<h4>Days to mark</h4><ul>${up
      .map((u) => `<li><strong>${u.paksha === 'Shukla' && u.name === 'Ekadashi' ? 'Shukla ' : u.name === 'Ekadashi' ? 'Krishna ' : ''}${u.name}</strong>${fmtDate(u.date, { weekday: 'short', day: 'numeric', month: 'short' })} · in ${u.inDays} day${u.inDays > 1 ? 's' : ''}</li>`)
      .join('')}</ul>`;
    moonBox.innerHTML = `${moonSVG(p.tithi.elongation)}<p><strong>${Math.round(p.illumination * 100)}%</strong> lit · ${p.waxing ? 'waxing' : 'waning'} moon</p>`;
  }
  const VAAR_INDEX = (en) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(en);
  select.addEventListener('change', render);
  render();
}
