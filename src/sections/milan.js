// Act V — Kundli Milan. Two papercut marionettes under a paper arch walk towards
// each other as the guna score rises, and dance if the match is auspicious.
import { Marionette } from '../puppet/marionette.js';
import { COSTUMES } from '../puppet/costumes.js';
import { birthChart } from '../astro/panchang.js';
import { ashtakoota } from '../astro/matching.js';
import { CITIES, RASHIS } from '../astro/data.js';
import { sheet, star, starPath, crescentPath } from '../art/cosmos.js';
import { C } from '../art/palette.js';

/** Two layered paper arches under a crescent, hung with stars. */
function arch() {
  const archPath = (inset, top) =>
    `M${60 + inset},520 L${60 + inset},${top + 120} C${60 + inset},${top} ${740 - inset},${top} ${740 - inset},${top + 120} L${740 - inset},520 L810,520 L810,-10 L-10,-10 L-10,520 Z`;
  let hanging = '';
  [[210, 70, 9], [300, 40, 7], [500, 40, 7], [590, 70, 9]].forEach(([x, len, r], i) => {
    hanging += `<path d="M${x},0 L${x},${len}" stroke="${C.thread}" stroke-opacity=".5" stroke-width="1"/>
      <g class="m-star" style="--d:${5 + i}s">${star(x, len + r, r, i % 2 ? C.mist : C.gold, 5)}</g>`;
  });
  return `
    <ellipse cx="400" cy="330" rx="300" ry="190" fill="url(#g-halo)" opacity=".35"/>
    ${hanging}
    <g filter="url(#paper)">${sheet(archPath(28, 96), C.n3, { edge: 5 })}</g>
    <g filter="url(#paper)">${sheet(archPath(0, 58), C.n2, { edge: 5 })}</g>
    <g filter="url(#paper-sm)" transform="translate(652 176)">${sheet(crescentPath(30, 17, -8), C.paper, { edge: 3 })}</g>
    <g filter="url(#paper)">${sheet('M-10,520 L-10,462 C120,440 240,470 400,458 C560,446 680,470 810,452 L810,520 Z', '#120f33', { edge: 4 })}</g>
    <path d="${starPath(120, 190, 6, 4, 0.34)}" fill="${C.gold}"/><path d="${starPath(680, 220, 5, 4, 0.34)}" fill="${C.mist}"/>`;
}

export function initMilan(ctx) {
  const { gsap, ScrollTrigger, reduced, sound } = ctx;
  const section = document.getElementById('milan');
  const svg = section.querySelector('[data-milan-stage]');
  const form = section.querySelector('[data-milan-form]');
  const scoreNum = section.querySelector('[data-score-num]');
  const grid = section.querySelector('[data-koota-grid]');

  svg.innerHTML = `<g class="arch">${arch()}</g><g class="petals"></g>`;
  const gGroom = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const gBride = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.insertBefore(gGroom, svg.querySelector('.petals'));
  svg.insertBefore(gBride, svg.querySelector('.petals'));
  // The puppeteers work from above the canopy; strings drop in front of it.
  const opts = { scale: 0.62, headString: 214, idleAmp: 0.22, jigEvery: 3.5, reduced };
  const groom = new Marionette(gGroom, COSTUMES.groom, { ...opts, x: 400, y: 24, phase: 0 });
  const bride = new Marionette(gBride, COSTUMES.bride, { ...opts, x: 400, y: 24, phase: 2 });
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
      const colors = [C.gold, C.rose, C.mist, C.saffron];
      g.innerHTML = `<path d="${starPath(0, 0, 7 + Math.random() * 6, i % 2 ? 4 : 5, i % 2 ? 0.34 : 0.45)}" fill="${colors[i % 4]}"/>`;
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
    const scoreBox = section.querySelector('[data-milan-score]');
    gsap.to(counter, {
      v: res.total,
      duration: animate ? 1.6 : 0,
      ease: 'power2.out',
      onUpdate: () => {
        scoreNum.textContent = (Math.round(counter.v * 2) / 2).toString();
        scoreBox.style.setProperty('--p', ((counter.v / 36) * 100).toFixed(1));
      },
    });

    grid.innerHTML =
      `<p class="verdict">${res.verdict}<small>${bn}: Moon in ${RASHIS[b.rashi].sa}, ${b.nakshatra.name} · ${gn}: Moon in ${RASHIS[g.rashi].sa}, ${g.nakshatra.name}</small></p>` +
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
