// Finale — app preview, counters, and paper clouds rising to close the show.
import { dailyHoroscope } from '../astro/horoscope.js';
import { panchang } from '../astro/panchang.js';
import { RASHIS } from '../astro/data.js';
import { bust } from '../puppet/costumes.js';
import { ASTROLOGERS } from './astrologers.js';
import { icon, cloudBand } from '../art/cosmos.js';
import { C } from '../art/palette.js';

export function initFinale(ctx) {
  const { gsap, reduced } = ctx;

  // Phone screen.
  const screen = document.querySelector('[data-phone-screen]');
  const today = panchang(new Date());
  const h = dailyHoroscope(RASHIS.indexOf(today.sunRashi));
  const date = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short' });
  screen.innerHTML = `
    <div class="ps-head"><span>${date} · ${today.tithi.paksha} ${today.tithi.name}</span><b>Namaste, Aarav</b></div>
    <div class="ps-card"><small>${h.rashi.en} today</small><p>${h.summary}</p></div>
    <p class="ps-row-title">Online now</p>
    <div class="ps-astros">${ASTROLOGERS.slice(0, 3)
      .map((a) => `<div class="ps-astro"><div class="av" style="--hue:${a.hue}">${bust(a.look)}</div>${a.name.split(' ').slice(-1)[0]}<em>₹${a.price}/min</em></div>`)
      .join('')}</div>
    <div class="ps-grid">
      <span><i>${icon('kundli')}</i>Kundli</span>
      <span><i>${icon('milan')}</i>Milan</span>
      <span><i>${icon('horoscope')}</i>Rashiphal</span>
      <span><i>${icon('puja')}</i>Puja</span>
    </div>
    <div class="ps-card"><small>Aaj ka Panchang</small><p>${today.tithi.paksha} ${today.tithi.name} · ${today.nakshatra.name} · ${today.yoga} yoga</p></div>
    <nav class="ps-nav"><span>Home</span><span>Chat</span><span>Call</span><span>Mall</span><span>Profile</span></nav>`;

  // Counters.
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    const obj = { v: 0 };
    const fmt = (v) => `${v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })}${el.dataset.suffix}`;
    el.textContent = fmt(reduced ? target : 0);
    if (reduced) return;
    gsap.to(obj, { v: target, duration: 2, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(obj.v)), scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  if (!reduced) {
    gsap.fromTo('.phone', { y: 70, rotation: 3 }, { y: -20, rotation: -3, ease: 'none', scrollTrigger: { trigger: '.act-app', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // Closing scene: paper clouds rise, layer by layer.
  const finale = document.querySelector('.finale');
  const host = finale.querySelector('[data-finale-clouds]');
  const bands = [
    { fill: C.n5, y: 60, amp: 46, bumps: 5, seed: 3, height: '86%' },
    { fill: C.n4, y: 56, amp: 40, bumps: 6, seed: 1.2, height: '66%' },
    { fill: C.n3, y: 50, amp: 34, bumps: 7, seed: 5.3, height: '46%' },
    { fill: C.n2, y: 46, amp: 28, bumps: 9, seed: 2.2, height: '26%' },
  ];
  host.innerHTML = bands
    .map((b, i) => `<div class="layer" style="height:${b.height};z-index:${i};filter:drop-shadow(0 -8px 16px rgba(4,2,20,.5))">${cloudBand({ ...b, h: 200 })}</div>`)
    .join('');
  const copy = finale.querySelector('.finale-copy');
  const layers = [...host.children];
  if (reduced) return;
  gsap.set(layers, { yPercent: 100 });
  gsap.set(copy, { autoAlpha: 0, y: 30 });
  gsap.timeline({ scrollTrigger: { trigger: finale, start: 'top 80%', end: 'top top', scrub: 0.8 } })
    .to(layers, { yPercent: 0, stagger: 0.12, ease: 'power2.out', duration: 1 })
    .to(copy, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.6);
}
