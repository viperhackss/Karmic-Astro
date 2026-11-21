// Finale — app preview, counters, and the curtain falling at the very end.
import { dailyHoroscope } from '../astro/horoscope.js';
import { panchang } from '../astro/panchang.js';
import { RASHIS } from '../astro/data.js';
import { bust } from '../puppet/costumes.js';
import { ASTROLOGERS } from './astrologers.js';
import { svgWrap, kalashGroup, fishPairGroup, moonGroup, diyaGroup } from '../art/motifs.js';

export function initFinale(ctx) {
  const { gsap, ScrollTrigger, reduced } = ctx;

  // Phone screen.
  const screen = document.querySelector('[data-phone-screen]');
  const today = panchang(new Date());
  const sign = RASHIS.indexOf(today.sunRashi);
  const h = dailyHoroscope(sign);
  const date = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short' });
  screen.innerHTML = `
    <div class="ps-head"><span>${date} · ${today.tithi.paksha} ${today.tithi.name}</span><b>Namaste, Aarav 🙏</b></div>
    <div class="ps-card"><small>${h.rashi.en} today</small><p>${h.summary}</p></div>
    <p class="ps-row-title">Live astrologers</p>
    <div class="ps-astros">${ASTROLOGERS.slice(0, 3)
      .map((a) => `<div class="ps-astro"><div class="av" style="--hue:${a.hue}">${bust(a.look)}</div>${a.name.split(' ').slice(-1)[0]}<em>₹${a.price}/min</em></div>`)
      .join('')}</div>
    <div class="ps-grid">
      <span><i>${svgWrap('-100 -112 200 214', kalashGroup())}</i>Kundli</span>
      <span><i>${svgWrap('-110 -110 220 220', fishPairGroup())}</i>Milan</span>
      <span><i>${svgWrap('-100 -100 200 200', moonGroup())}</i>Panchang</span>
      <span><i>${svgWrap('-72 -90 150 136', diyaGroup())}</i>Puja</span>
    </div>
    <div class="ps-card"><small>Aaj ka Panchang</small><p>${today.tithi.paksha} ${today.tithi.name} · ${today.nakshatra.name} · ${today.yoga} yoga</p></div>
    <div class="ps-card ps-live"><small>● Live puja</small><p>Shani Shanti path, Ujjain · join 1.2k devotees</p></div>
    <nav class="ps-nav"><span>Home</span><span>Chat</span><span>Call</span><span>Mall</span><span>Profile</span></nav>`;

  // Counters.
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    const obj = { v: 0 };
    const fmt = (v) => `${v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })}${el.dataset.suffix}`;
    el.textContent = fmt(reduced ? target : 0);
    if (reduced) return;
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => (el.textContent = fmt(obj.v)),
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // Phone float.
  if (!reduced) {
    gsap.fromTo('.phone', { y: 80, rotation: 4 }, { y: -20, rotation: -4, ease: 'none', scrollTrigger: { trigger: '.act-app', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // The curtain falls.
  const finale = document.querySelector('.finale');
  const curtains = finale.querySelectorAll('.curtain');
  const copy = finale.querySelector('.finale-copy');
  gsap.set(copy, { autoAlpha: 0, y: 30 });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: finale, start: 'top 85%', end: 'top top', scrub: 0.8 },
  });
  tl.to(curtains, { scaleX: 1, ease: 'power2.inOut', duration: 1 }).to(copy, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.7);
  void ScrollTrigger;
}
