import './fonts.js';
import './styles/base.css';
import './styles/hero.css';
import './styles/acts.css';
import './styles/ui.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { installDefs } from './art/defs.js';
import { paintArt } from './art/registry.js';
import { initStarfield } from './art/starfield.js';
import { Sound } from './audio/tanpura.js';
import { initHero } from './sections/hero.js';
import { initRashi } from './sections/rashi.js';
import { initGrahas } from './sections/grahas.js';
import { initKundli } from './sections/kundli.js';
import { initAstrologers } from './sections/astrologers.js';
import { initMilan } from './sections/milan.js';
import { initPanchang } from './sections/panchang-ui.js';
import { initSeva } from './sections/seva.js';
import { initVani } from './sections/vani.js';
import { initFinale } from './sections/finale.js';
import { initPlayer } from './film/player.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

installDefs();
initStarfield({ reduced });
paintArt();

// Smooth scrolling, synced to GSAP's ticker so pins and puppets share a clock.
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9, anchors: { offset: 0 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const ctx = { gsap, ScrollTrigger, lenis, reduced, sound: new Sound() };

const hero = initHero(ctx);
initRashi(ctx);
initGrahas(ctx);
initKundli(ctx);
initAstrologers(ctx);
const milan = initMilan(ctx);
initPanchang(ctx);
initSeva(ctx);
initVani(ctx);
initFinale(ctx);
initPlayer(ctx);

// One clock for every marionette.
gsap.ticker.add((_, dtMs) => {
  const dt = Math.min(0.05, dtMs / 1000);
  hero.tick(dt);
  milan.tick(dt);
});

// Header: solid after the prologue, hidden while scrolling down.
const header = document.querySelector('[data-header]');
let lastY = 0;
const onScroll = () => {
  const y = lenis ? lenis.scroll : window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  header.classList.toggle('hidden', y > window.innerHeight && y > lastY + 2);
  if (y < lastY - 2) header.classList.remove('hidden');
  lastY = y;
};
if (lenis) lenis.on('scroll', onScroll);
else window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu.
const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('.site-nav');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }
});

// Curtain up once fonts are ready.
const start = () => {
  ScrollTrigger.refresh();
  if (reduced) hero.skipIntro();
  else hero.start();
};
if (document.fonts?.ready) document.fonts.ready.then(start);
else window.addEventListener('load', start);
window.addEventListener('load', () => ScrollTrigger.refresh());
