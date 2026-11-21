// Fills every [data-art] placeholder with its Madhubani SVG.
import { C } from './palette.js';
import { sunFace, moonFace, diya, fish, fishPair, svgWrap, sunGroup, treeGroup, peacockGroup, flower, dbl } from './motifs.js';

function hills() {
  const mound = (x, w, h, fill, overlay) =>
    `<path d="M${x - w / 2},200 C${x - w / 2},${200 - h * 1.2} ${x + w / 2},${200 - h * 1.2} ${x + w / 2},200 Z" fill="${fill}" stroke="${C.ink}" stroke-width="3"/>
     <path d="M${x - w / 2},200 C${x - w / 2},${200 - h * 1.2} ${x + w / 2},${200 - h * 1.2} ${x + w / 2},200 Z" fill="url(#${overlay})" opacity=".55"/>
     ${dbl(`M${x - w / 2 + 14},200 C${x - w / 2 + 14},${200 - h * 1.05} ${x + w / 2 - 14},${200 - h * 1.05} ${x + w / 2 - 14},200`, { w: 3, gap: 1, bg: '#f6e7c8' })}`;
  let back = '';
  let front = '';
  for (let i = 0; i < 9; i++) back += mound(i * 210 + 40, 300, 120 + (i % 3) * 22, '#1d5c33', 'mb-hatch-paper');
  for (let i = 0; i < 10; i++) front += mound(i * 180 - 20, 220, 70 + ((i + 1) % 3) * 16, '#2f8a4c', 'mb-scales-paper');
  const trees = [170, 790, 1420]
    .map((x, i) => `<g transform="translate(${x} ${78 + (i % 2) * 8}) scale(${0.55 + (i % 2) * 0.1})">${treeGroup()}</g>`)
    .join('');
  const birds = `<g transform="translate(560 112) scale(0.5)">${peacockGroup()}</g><g transform="translate(1160 118) scale(-0.45 0.45)">${peacockGroup()}</g>`;
  return `<svg viewBox="0 0 1600 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${back}${trees}${birds}${front}
    ${flower(300, 160, 12, C.pink, C.yellow, C.red)}${flower(980, 168, 10, C.yellow, C.paper, C.red)}${flower(1500, 160, 12, C.pink, C.yellow, C.red)}</svg>`;
}

const ART = {
  sun: () => sunFace('sun'),
  moon: () => moonFace('moon'),
  'sun-mini': () => svgWrap('-110 -110 220 220', sunGroup()),
  diya: () => diya('diya'),
  'fish-mini': () => fish({}, 'fish-mini'),
  'fish-pair': () => fishPair('fish-pair'),
  hills,
};

export function paintArt(root = document) {
  root.querySelectorAll('[data-art]').forEach((el) => {
    const make = ART[el.dataset.art];
    if (make && !el.dataset.painted) {
      el.innerHTML = make();
      el.dataset.painted = '1';
    }
  });
}
