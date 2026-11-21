// Act VI — Aaj ka Panchang with a Madhubani moon showing tonight's real phase.
import { panchang, tithiOf } from '../astro/panchang.js';
import { siderealPositions } from '../astro/ephemeris.js';
import { CITIES } from '../astro/data.js';
import { fillCities } from './kundli.js';
import { C } from '../art/palette.js';
import { flower, triRing, dotRing } from '../art/motifs.js';

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
  return `<svg viewBox="-170 -170 340 340" class="mb" role="img" aria-label="Tonight's moon phase">
    ${triRing(48, 150, 168, C.yellow, C.paper, 1.4)}
    <circle r="150" fill="${C.indigo}" stroke="${C.ink}" stroke-width="3"/>
    ${dotRing(48, 140, 1.8, C.yellow)}
    <circle r="${r}" fill="#f7efd9" stroke="${C.ink}" stroke-width="4"/>
    <circle r="${r}" fill="url(#mb-dots)" opacity=".12"/>
    <g>
      <path d="M-58,-34 Q-40,-50 -22,-36" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
      <path d="M22,-36 Q40,-50 58,-34" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-56,-16 Q-40,-28 -24,-16 Q-40,-8 -56,-16 Z" fill="#fff" stroke="${C.ink}" stroke-width="3"/>
      <circle cx="-40" cy="-17" r="5.5" fill="${C.ink}"/>
      <path d="M24,-16 Q40,-28 56,-16 Q40,-8 24,-16 Z" fill="#fff" stroke="${C.ink}" stroke-width="3"/>
      <circle cx="40" cy="-17" r="5.5" fill="${C.ink}"/>
      <path d="M2,-14 Q-6,14 -4,20 Q2,24 9,20" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
      <path d="M-18,44 Q0,36 18,44 Q0,58 -18,44 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="2.4"/>
      <circle cx="0" cy="-58" r="6" fill="${C.red}"/>
      <circle cx="-62" cy="18" r="11" fill="${C.pink}" opacity=".35"/><circle cx="62" cy="18" r="11" fill="${C.pink}" opacity=".35"/>
    </g>
    <path d="${shadow}" fill="${C.indigo}" opacity=".84"/>
    <path d="${shadow}" fill="url(#mb-hatch-paper)" opacity=".18"/>
    <circle r="${r}" fill="none" stroke="${C.ink}" stroke-width="4"/>
    ${flower(-150, -120, 14, C.yellow, C.paper, C.red)}${flower(140, 128, 12, C.yellow, C.paper, C.red)}
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
    card.querySelector('[data-p-vaar]').textContent = `${VAAR_DEVA[VAAR_INDEX(p.vaar.en)]} · ${p.vaar.hi}`;
    card.querySelector('[data-p-limbs]').innerHTML = `
      <div><dt>Tithi</dt><dd>${p.tithi.name}<small>${p.tithi.paksha} paksha</small></dd></div>
      <div><dt>Nakshatra</dt><dd>${p.nakshatra.name}<small>pada ${p.nakshatra.pada}</small></dd></div>
      <div><dt>Yoga</dt><dd>${p.yoga}<small>Sun + Moon</small></dd></div>
      <div><dt>Karana</dt><dd>${p.karana}<small>half-tithi</small></dd></div>
      <div><dt>Vaar</dt><dd>${p.vaar.hi}<small>${p.vaar.en}</small></dd></div>
      <div><dt>Chandra Rashi</dt><dd>${p.moonRashi.sa}<small>${p.moonRashi.en}</small></dd></div>`;
    card.querySelector('[data-p-sun]').innerHTML = `<span>☀ Sunrise <b>${fmtTime(p.sunrise)}</b></span><span>☾ Sunset <b>${fmtTime(p.sunset)}</b></span><span>📍 ${place.name}</span>`;
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
