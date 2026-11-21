// Prologue: curtains part, the Jyotishi marionette drops in on its strings,
// and the visitor's pointer becomes the puppeteer's controller.
import { Marionette } from '../puppet/marionette.js';
import { COSTUMES } from '../puppet/costumes.js';
import { panchang } from '../astro/panchang.js';

const LINES = [
  'Namaste! I read stars, not minds… mostly.',
  'Shani rewards patience. Also, finish that pending task.',
  'Rahu says dream big. Ketu says let go of the small stuff.',
  'Guru smiles on learners this week. Open a book!',
  'Mangal lends courage. Spend it kindly.',
  'Gently with my strings, please. Karma is watching!',
  'Want the full story? Your first chat is free.',
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

  const today = panchang(new Date());
  const lines = [`Today the Moon walks through ${today.nakshatra.name}. Tread softly, dream boldly.`, ...LINES];
  let lineIdx = 0;

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.appendChild(g);
  const puppet = new Marionette(g, COSTUMES.jyotishi, { reduced, headString: 228 });
  // Waits high above the proscenium until the curtains part, then drops in.
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
    const mobile = window.innerWidth <= 960;
    if (mobile) {
      const s = Math.min(0.92, (h - 60 - 72) / 540, w / 380);
      puppet.setFrame(w / 2, 34, s);
    } else {
      const floor = Math.max(72, h * 0.12);
      const s = Math.max(0.62, Math.min(1.08, (h - 118 - floor - 10) / 545));
      puppet.setFrame(w * 0.69, 112, s);
    }
  };
  layout();
  window.addEventListener('resize', layout);

  // Pointer = puppeteer's hand.
  let dragging = false;
  const toSvg = (e) => puppet.clientToSvg(e.clientX, e.clientY);
  section.addEventListener('pointermove', (e) => {
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

  // Keyboard puppetry.
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
  function perform() {
    puppet.dance(0);
    sound.bells();
    speech.textContent = lines[lineIdx++ % lines.length];
    speech.classList.add('show');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => speech.classList.remove('show'), 3600);
    hint.classList.add('gone');
  }

  function placeSpeech() {
    if (!speech.classList.contains('show')) return;
    const p = puppet.headClientPos();
    const r = section.getBoundingClientRect();
    const x = Math.max(150, Math.min(r.width - 150, p.x - r.left));
    speech.style.left = `${x}px`;
    speech.style.top = `${Math.max(140, p.y - r.top - 70)}px`;
  }

  // Curtain-up sequence.
  const curtains = section.querySelectorAll('.curtain');
  const title = section.querySelector('.curtain-title');
  const copy = section.querySelectorAll('.hero-copy > *');
  gsap.set(copy, { autoAlpha: 0, y: 34 });
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
  intro
    .to(title, { autoAlpha: 0, y: -30, duration: 0.6, ease: 'power2.in' }, 0.9)
    .to(curtains, { scaleX: () => Math.min(0.13, 60 / curtains[0].offsetWidth), duration: 1.8 }, 1.1)
    .add(() => puppet.setBase(0, 0), 1.5)
    .to(copy, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 1.9)
    .add(() => {
      speech.textContent = lines[0];
      lineIdx = 1;
      speech.classList.add('show');
      speechTimer = setTimeout(() => speech.classList.remove('show'), 4200);
    }, 3.2);

  // Parallax as the prologue scrolls away.
  if (!reduced) {
    gsap.to(section.querySelector('.hero-copy'), { yPercent: -18, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(section.querySelector('.sky-sun'), { y: -80, rotate: 30, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(section.querySelector('.sky-moon'), { y: -40, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } });
  }

  let visible = true;
  ScrollTrigger.create({ trigger: section, start: 'top bottom', end: 'bottom top', onToggle: (self) => (visible = self.isActive) });

  return {
    start: () => intro.play(),
    skipIntro: () => intro.progress(1),
    tick(dt) {
      if (!visible) return;
      puppet.update(dt);
      placeSpeech();
    },
  };
}
