// Act V — Kundli Milan. Two marionettes under a painted mandap walk towards
// each other as the guna score rises, and dance if the match is auspicious.
import { Marionette } from '../puppet/marionette.js';
import { COSTUMES } from '../puppet/costumes.js';
import { birthChart } from '../astro/panchang.js';
import { ashtakoota } from '../astro/matching.js';
import { CITIES, RASHIS } from '../astro/data.js';
import { parrotGroup, lotusGroup, flower, triRing, dbl } from '../art/motifs.js';
import { C } from '../art/palette.js';

function mandap() {
  let arch = '';
  for (let x = 120; x < 680; x += 28) arch += `<path d="M${x},92 L${x + 14},112 L${x + 28},92 Z" fill="${(x / 28) % 2 ? C.red : C.yellow}" stroke="${C.ink}" stroke-width="1.6"/>`;
  return `
    <rect x="96" y="70" width="608" height="24" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>
    <rect x="96" y="70" width="608" height="24" fill="url(#mb-hatch-paper)" opacity=".5"/>
    ${arch}
    ${dbl('M96,60 Q400,-10 704,60', { w: 6, gap: 2 })}
    <path d="M96,60 Q400,-10 704,60 L704,70 L96,70 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.6"/>
    <path d="M96,60 Q400,-10 704,60 L704,70 L96,70 Z" fill="url(#mb-hatch-red)"/>
    <rect x="96" y="94" width="26" height="466" fill="${C.green}" stroke="${C.ink}" stroke-width="3"/>
    <rect x="96" y="94" width="26" height="466" fill="url(#mb-scales-paper)"/>
    <rect x="678" y="94" width="26" height="466" fill="${C.green}" stroke="${C.ink}" stroke-width="3"/>
    <rect x="678" y="94" width="26" height="466" fill="url(#mb-scales-paper)"/>
    <g transform="translate(60 120) scale(0.55)">${parrotGroup()}</g>
    <g transform="translate(740 120) scale(0.55)">${parrotGroup(true)}</g>
    <g transform="translate(58 470) scale(0.5)">${lotusGroup()}</g>
    <g transform="translate(742 470) scale(0.5)">${lotusGroup()}</g>
    <g transform="translate(400 30)">${triRing(16, 10, 22, C.red, C.yellow, 1.2)}${flower(0, 0, 12, C.pink, C.yellow, C.red)}</g>`;
}

export function initMilan(ctx) {
  const { gsap, ScrollTrigger, reduced, sound } = ctx;
  const section = document.getElementById('milan');
  const svg = section.querySelector('[data-milan-stage]');
  const form = section.querySelector('[data-milan-form]');
  const scoreNum = section.querySelector('[data-score-num]');
  const grid = section.querySelector('[data-koota-grid]');

  svg.innerHTML = `<g class="mandap">${mandap()}</g><g class="petals"></g>`;
  const gGroom = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const gBride = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.insertBefore(gGroom, svg.querySelector('.petals'));
  svg.insertBefore(gBride, svg.querySelector('.petals'));
  // The puppeteers work from above the canopy; strings drop in front of it.
  const opts = { scale: 0.66, headString: 214, idleAmp: 0.22, jigEvery: 3.5, reduced };
  const groom = new Marionette(gGroom, COSTUMES.groom, { ...opts, x: 400, y: 26, phase: 0 });
  const bride = new Marionette(gBride, COSTUMES.bride, { ...opts, x: 400, y: 26, phase: 2 });
  const FAR = 290;
  const NEAR = 120;
  groom.setBase(-FAR);
  bride.setBase(FAR);
  for (const [p, sx] of [[groom, -FAR], [bride, FAR]]) {
    p.ctrl.x = sx;
    p.target.x = sx;
    p.parts.forEach((pt) => {
      pt.x += sx;
      pt.px = pt.x;
    });
  }

  // Drag either puppet on the stage.
  let dragging = null;
  for (const p of [groom, bride]) {
    p.hit.style.touchAction = 'none';
    p.hit.addEventListener('pointerdown', (e) => {
      dragging = p;
      p.hit.setPointerCapture(e.pointerId);
    });
    p.hit.addEventListener('pointermove', (e) => {
      if (dragging !== p) return;
      const [x, y] = p.clientToSvg(e.clientX, e.clientY);
      p.pointTo(x, y);
    });
    p.hit.addEventListener('pointerup', () => {
      dragging = null;
      sound.bells(0.5);
      p.dance(0);
    });
  }

  function petals(n = 14) {
    const host = svg.querySelector('.petals');
    for (let i = 0; i < n; i++) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const colors = [[C.pink, C.yellow], [C.yellow, C.red], [C.orange, C.yellow], [C.red, C.yellow]][i % 4];
      g.innerHTML = flower(0, 0, 8 + Math.random() * 6, colors[0], colors[1], C.red);
      host.appendChild(g);
      gsap.fromTo(
        g,
        { x: 400 + (Math.random() - 0.5) * 120, y: 300, scale: 0.2, rotation: 0, opacity: 1 },
        {
          x: `+=${(Math.random() - 0.5) * 420}`,
          y: 40 + Math.random() * 160,
          scale: 1,
          rotation: (Math.random() - 0.5) * 540,
          opacity: 0,
          duration: 2.2 + Math.random() * 1.2,
          ease: 'power2.out',
          delay: i * 0.05,
          onComplete: () => g.remove(),
        },
      );
    }
  }

  const moonOf = (date, time) => birthChart({ date, time, place: CITIES[0] }).moon;

  function match(animate = true) {
    const fd = new FormData(form);
    const b = moonOf(fd.get('bdate'), fd.get('btime'));
    const g = moonOf(fd.get('gdate'), fd.get('gtime'));
    const res = ashtakoota({ rashi: b.rashi, nakshatra: b.nakshatra.index }, { rashi: g.rashi, nakshatra: g.nakshatra.index });
    const bn = String(fd.get('bname') || 'Groom');
    const gn = String(fd.get('gname') || 'Bride');

    const counter = { v: 0 };
    gsap.to(counter, {
      v: res.total,
      duration: animate ? 1.6 : 0,
      ease: 'power2.out',
      onUpdate: () => (scoreNum.textContent = (Math.round(counter.v * 2) / 2).toString()),
    });

    grid.innerHTML =
      `<p class="milan-verdict">${res.verdict}<small>${bn}: Moon in ${RASHIS[b.rashi].sa}, ${b.nakshatra.name} · ${gn}: Moon in ${RASHIS[g.rashi].sa}, ${g.nakshatra.name}</small></p>` +
      res.kootas
        .map(
          (k) => `<div class="koota"><header>${k.name}<span>${k.score}/${k.max}</span></header><p>${k.about}</p>
          <div class="meter"><i style="--v:${animate ? 0 : (k.score / k.max) * 100}%" data-v="${(k.score / k.max) * 100}"></i></div></div>`,
        )
        .join('');
    requestAnimationFrame(() => grid.querySelectorAll('.meter i').forEach((i) => i.style.setProperty('--v', `${i.dataset.v}%`)));

    const t = Math.min(1, res.total / 36);
    const gap = FAR - (FAR - NEAR) * t;
    groom.setBase(-gap);
    bride.setBase(gap);
    if (res.total >= 18) {
      setTimeout(() => {
        groom.celebrate(4);
        bride.celebrate(4, 0.55);
        if (!reduced) petals(res.total >= 28 ? 22 : 12);
        sound.bells(1);
      }, animate ? 900 : 0);
    }
    ScrollTrigger.refresh();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    match(true);
  });

  let visible = false;
  let played = false;
  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'bottom top',
    onToggle: (self) => {
      visible = self.isActive;
      if (visible && !played) {
        played = true;
        setTimeout(() => match(true), 500);
      }
    },
  });

  return {
    tick(dt) {
      if (!visible) return;
      groom.update(dt);
      bride.update(dt);
    },
  };
}
