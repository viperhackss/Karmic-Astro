// Prologue: paper clouds sink away, the astrologer marionette drops in on its
// strings, and the visitor's pointer becomes the puppeteer's controller.
// Paper hills and hanging stars drift with the pointer for depth.
import { Marionette } from '../puppet/marionette.js';
import { COSTUMES } from '../puppet/costumes.js';
import { panchang } from '../astro/panchang.js';
import { cloudBand, starPath } from '../art/cosmos.js';
import { C } from '../art/palette.js';

const LINES = [
  'Namaste! I read stars, not minds… mostly.',
  'Shani rewards patience. Also, finish that pending task.',
  'Rahu says dream big. Ketu says let go of the small stuff.',
  'Guru smiles on learners this week. Open a book!',
  'Gently with my strings, please. Karma is watching.',
  'Want the full story? Your first chat is free.',
];

const HANGING = [
  { x: 6, len: 120, size: 30, d: 6.5, c: C.gold },
  { x: 33, len: 70, size: 20, d: 5.2, c: C.mist },
  { x: 52, len: 160, size: 26, d: 7.4, c: C.gold },
  { x: 88, len: 230, size: 34, d: 6.1, c: C.saffron },
  { x: 96, len: 96, size: 18, d: 5.6, c: C.mist },
];

export function initHero(ctx) {
  const { gsap, ScrollTrigger, reduced, sound } = ctx;
  const section = document.getElementById('prastavana');
  const svg = section.querySelector('[data-hero-stage]');
  const speech = section.querySelector('[data-speech]');
  const hint = section.querySelector('[data-puppet-hint]');
  const hintText = section.querySelector('[data-hint-text]');
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse) hintText.textContent = 'Drag the puppet. Tap it to make it dance.';

  // Hanging paper stars.
  section.querySelector('[data-hanging]').innerHTML = HANGING.map(
    (h, i) => `<div class="hang" style="left:${h.x}%;--len:${h.len}px;--size:${h.size}px;--d:${h.d}s;--delay:${-i * 1.3}s">
      <svg viewBox="-12 -12 24 24"><path d="${starPath(0, 0, 11, i % 2 ? 4 : 5, i % 2 ? 0.34 : 0.45)}" fill="${h.c}"/></svg></div>`,
  ).join('');

  // Layered paper hills.
  const hills = section.querySelector('[data-hills]');
  const bands = [
    { fill: C.n4, y: 64, amp: 44, bumps: 5, seed: 1 },
    { fill: C.n3, y: 58, amp: 40, bumps: 6, seed: 2.4 },
    { fill: C.n2, y: 52, amp: 34, bumps: 8, seed: 4.1 },
    { fill: '#0a0920', y: 46, amp: 26, bumps: 9, seed: 0.7 },
  ];
  hills.innerHTML = bands.map((b) => `<div class="layer">${cloudBand({ ...b, h: 200 })}</div>`).join('');
  const layers = [...hills.querySelectorAll('.layer')];

  // Live counter (illustrative).
  const online = section.querySelector('[data-online]');
  let count = 312;
  if (!reduced) setInterval(() => {
    count = Math.max(286, Math.min(348, count + Math.round((Math.random() - 0.45) * 6)));
    online.textContent = count;
  }, 2600);

  // Puppet.
  const today = panchang(new Date());
  const lines = [`Tonight the Moon walks through ${today.nakshatra.name}. Tread softly, dream boldly.`, ...LINES];
  let lineIdx = 0;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.appendChild(g);
  const puppet = new Marionette(g, COSTUMES.jyotishi, { reduced, headString: 228 });
  puppet.setBase(0, -760);
  puppet.ctrl.y = -760;
  puppet.parts.forEach((p) => {
    p.y -= 760;
    p.py = p.y;
  });
  svg.setAttribute('tabindex', '0');

  const layout = () => {
    const w = svg.clientWidth;
    const h = svg.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    if (window.innerWidth <= 960) {
      const s = Math.min(0.88, (h - 40) / 560, w / 380);
      puppet.setFrame(w / 2, 26, s);
    } else {
      const top = 96;
      const s = Math.max(0.62, Math.min(1.08, (h - top - 70) / 545));
      puppet.setFrame(w * 0.7, top, s);
    }
  };
  layout();
  window.addEventListener('resize', layout);

  // Pointer → puppeteer + parallax.
  let dragging = false;
  let mx = 0;
  const toSvg = (e) => puppet.clientToSvg(e.clientX, e.clientY);
  section.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    if (e.pointerType === 'mouse' || dragging) {
      const [x, y] = toSvg(e);
      puppet.pointTo(x, y);
      hint.classList.add('gone');
    }
  });
  puppet.hit.style.touchAction = 'none';
  puppet.hit.addEventListener('pointerdown', (e) => {
    dragging = true;
    svg.classList.add('dragging');
    puppet.hit.setPointerCapture(e.pointerId);
    const [x, y] = toSvg(e);
    puppet.pointTo(x, y);
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    svg.classList.remove('dragging');
    if (puppet.hit.hasPointerCapture?.(e.pointerId)) puppet.hit.releasePointerCapture(e.pointerId);
  };
  puppet.hit.addEventListener('pointerup', endDrag);
  puppet.hit.addEventListener('pointercancel', endDrag);
  puppet.hit.addEventListener('click', () => perform());
  svg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      puppet.target.x += e.key === 'ArrowLeft' ? -50 : 50;
      puppet.setTilt(e.key === 'ArrowLeft' ? 0.6 : -0.6);
      puppet.lastInput = puppet.t;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      perform();
    }
  });

  let speechTimer;
  function say(text, ms = 3600) {
    speech.textContent = text;
    speech.classList.add('show');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => speech.classList.remove('show'), ms);
  }
  function perform() {
    puppet.dance(0);
    sound.bells();
    say(lines[lineIdx++ % lines.length]);
    hint.classList.add('gone');
  }
  function placeSpeech() {
    if (!speech.classList.contains('show')) return;
    const p = puppet.headClientPos();
    const r = section.getBoundingClientRect();
    speech.style.left = `${Math.max(140, Math.min(r.width - 140, p.x - r.left))}px`;
    speech.style.top = `${Math.max(120, p.y - r.top - 74)}px`;
  }

  // Intro: the paper clouds sink layer by layer, then the puppet drops in.
  const intro = section.querySelector('[data-intro]');
  const introLayers = [...intro.querySelectorAll('.intro-layer')];
  const introTitle = intro.querySelector('.intro-title');
  const copy = section.querySelectorAll('.hero-copy > *');
  gsap.set(copy, { autoAlpha: 0, y: 30 });
  gsap.set(introTitle, { autoAlpha: 0, y: 16 });
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
  tl.to(introTitle, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.1)
    .to(introTitle, { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power2.in' }, 1.3)
    .to([...introLayers].reverse(), { yPercent: 120, duration: 1.4, stagger: 0.12 }, 1.45)
    .set(intro, { display: 'none' })
    .add(() => puppet.setBase(0, 0), 1.9)
    .to(copy, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 2.0)
    .add(() => {
      lineIdx = 1;
      say(lines[0], 4200);
    }, 3.3);

  // Scroll parallax.
  if (!reduced) {
    const st = { trigger: section, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(section.querySelector('.hero-copy'), { yPercent: -16, ease: 'none', scrollTrigger: st });
    gsap.to(section.querySelector('.big-moon'), { y: -90, ease: 'none', scrollTrigger: st });
    gsap.to(section.querySelector('.orbits-wrap'), { y: -60, ease: 'none', scrollTrigger: st });
    layers.forEach((l, i) => gsap.to(l, { y: -(4 - i) * 26, ease: 'none', scrollTrigger: st }));
  }

  let visible = true;
  ScrollTrigger.create({ trigger: section, start: 'top bottom', end: 'bottom top', onToggle: (self) => (visible = self.isActive) });

  let px = 0;
  return {
    start: () => tl.play(),
    skipIntro: () => tl.progress(1),
    tick(dt) {
      if (!visible) return;
      puppet.update(dt);
      placeSpeech();
      if (!reduced) {
        px += (mx - px) * Math.min(1, dt * 3);
        layers.forEach((l, i) => (l.style.translate = `${(-px * (i + 1) * 7).toFixed(2)}px 0`));
      }
    },
  };
}
