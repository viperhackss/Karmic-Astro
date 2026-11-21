// Madhubani (Mithila) motif library, drawn as SVG strings.
// Every motif follows the tradition's grammar: bold double outlines (two ink
// lines with a paper gap), no empty space, kachni hatching beside bharni
// solid fills, and auspicious subjects — fish, Surya, Chandra, lotus, kalash.
import { C } from './palette.js';

let uid = 0;
const nextId = (p) => `${p}${++uid}`;

/** Polar → cartesian with 0° pointing up. */
export const polar = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [+(r * Math.cos(a)).toFixed(2), +(r * Math.sin(a)).toFixed(2)];
};

/** The signature Madhubani double line. */
export const dbl = (d, { w = 5, gap = 1.8, color = C.ink, bg = C.paper, extra = '' } = {}) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>` +
  `<path d="${d}" fill="none" stroke="${bg}" stroke-width="${gap}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;

const shape = (d, fill, { stroke = C.ink, sw = 2.4, overlay = '', extra = '' } = {}) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>` +
  (overlay ? `<path d="${d}" fill="url(#${overlay})" ${extra}/>` : '');

const svgWrap = (viewBox, inner, cls = '', label = '') =>
  `<svg class="mb ${cls}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${inner}</svg>`;

/** Ring of saw-tooth triangles between radii r1 (base) and r2 (tips). */
export function triRing(n, r1, r2, fillA = C.red, fillB = C.yellow, sw = 1.4) {
  let s = '';
  const half = 180 / n;
  for (let i = 0; i < n; i++) {
    const a = i * (360 / n);
    const [x1, y1] = polar(r1, a - half);
    const [x2, y2] = polar(r2, a);
    const [x3, y3] = polar(r1, a + half);
    s += `<path d="M${x1},${y1} L${x2},${y2} L${x3},${y3} Z" fill="${i % 2 ? fillB : fillA}" stroke="${C.ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  }
  return s;
}

/** Ring of small dots. */
export function dotRing(n, r, size = 2, fill = C.ink) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = polar(r, (i * 360) / n);
    s += `<circle cx="${x}" cy="${y}" r="${size}" fill="${fill}"/>`;
  }
  return s;
}

/** 8-petal Madhubani flower, centred at (cx, cy). Returns a <g>. */
export function flower(cx, cy, r, a = C.red, b = C.yellow, centre = C.yellow) {
  let s = `<g transform="translate(${cx} ${cy})">`;
  for (let i = 0; i < 8; i++) {
    s += `<ellipse cx="0" cy="${-r * 0.55}" rx="${r * 0.26}" ry="${r * 0.46}" transform="rotate(${i * 45})" fill="${i % 2 ? b : a}" stroke="${C.ink}" stroke-width="${Math.max(0.8, r * 0.07)}"/>`;
  }
  s += `<circle r="${r * 0.28}" fill="${centre}" stroke="${C.ink}" stroke-width="${Math.max(0.8, r * 0.07)}"/><circle r="${r * 0.09}" fill="${C.ink}"/></g>`;
  return s;
}

/* ───────────────────────────── Fish (Matsya) ───────────────────────────── */

export function fishGroup({ a = C.green, b = C.red, c = C.yellow, head = C.pink, fins = C.red, flip = false } = {}) {
  const id = nextId('fish');
  const body = 'M30,55 C60,14 130,8 172,28 C196,40 198,70 172,82 C130,102 60,96 30,55 Z';
  const r1 = 'M0,0 L74,0 L74,20 C64,40 64,72 76,92 L76,110 L0,110 Z';
  const r2 = 'M74,0 L112,0 L112,12 C100,38 100,74 114,98 L114,110 L76,110 L76,92 C64,72 64,40 74,20 Z';
  const r3 = 'M112,0 L150,0 L150,20 C138,42 138,70 152,92 L152,110 L114,110 L114,98 C100,74 100,38 112,12 Z';
  const r4 = 'M150,0 L220,0 L220,110 L152,110 L152,92 C138,70 138,42 150,20 Z';
  return `<g ${flip ? 'transform="translate(220 0) scale(-1 1)"' : ''}>
    <clipPath id="${id}"><path d="${body}"/></clipPath>
    ${shape('M36,55 L6,20 C16,40 16,70 6,90 Z', b, { overlay: 'mb-hatch' })}
    ${dbl('M36,55 L6,20 C16,40 16,70 6,90 Z', { w: 4.4, gap: 1.4 })}
    ${shape('M84,22 C92,6 108,2 122,10 L116,18 C106,14 96,16 90,24 Z', fins, { overlay: 'mb-hatch' })}
    ${shape('M84,88 C92,104 108,108 122,100 L116,92 C106,96 96,94 90,86 Z', fins, { overlay: 'mb-hatch' })}
    <g clip-path="url(#${id})">
      <path d="${r1}" fill="${a}"/><path d="${r1}" fill="url(#mb-hatch-paper)"/>
      <path d="${r2}" fill="${b}"/><path d="${r2}" fill="url(#mb-scales-paper)"/>
      <path d="${r3}" fill="${c}"/><path d="${r3}" fill="url(#mb-dots)"/>
      <path d="${r4}" fill="${head}"/>
      ${dbl('M74,20 C64,40 64,72 76,92', { w: 4, gap: 1.3 })}
      ${dbl('M112,12 C100,38 100,74 114,98', { w: 4, gap: 1.3 })}
      ${dbl('M150,20 C138,42 138,70 152,92', { w: 4, gap: 1.3 })}
    </g>
    ${dbl(body, { w: 5.5, gap: 1.8 })}
    <circle cx="168" cy="46" r="9.5" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>
    <circle cx="169" cy="46.5" r="4.6" fill="${C.ink}"/>
    <circle cx="167.4" cy="44.6" r="1.4" fill="${C.paper}"/>
    <path d="M191,61 Q184,65 176,62" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/>
  </g>`;
}

export const fish = (opts = {}, cls = '') => svgWrap('0 0 220 110', fishGroup(opts), cls);

/** The classic Madhubani pair of fish circling each other — a symbol of good fortune. */
export function fishPairGroup() {
  return `
    <circle r="104" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>
    ${triRing(36, 92, 104, C.red, C.yellow)}
    <circle r="92" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>
    <circle r="86" fill="none" stroke="${C.ink}" stroke-width="1.2"/>
    <g transform="translate(-96 -84) scale(0.88)">${fishGroup({})}</g>
    <g transform="rotate(180) translate(-96 -84) scale(0.88)">${fishGroup({ a: C.blue, b: C.orange, c: C.yellow, head: C.green, fins: C.green })}</g>
    ${flower(0, 0, 16, C.pink, C.yellow, C.red)}`;
}
export const fishPair = (cls = '') => svgWrap('-110 -110 220 220', fishPairGroup(), cls, 'Two Madhubani fish, a symbol of good fortune');

/* ───────────────────────────── Surya (Sun) ───────────────────────────── */

export function sunGroup() {
  let rays = '';
  const petal = 'M0,-104 C13,-90 15,-72 0,-60 C-15,-72 -13,-90 0,-104 Z';
  for (let i = 0; i < 16; i++) {
    const t = `transform="rotate(${i * 22.5})"`;
    rays += `<path d="${petal}" ${t} fill="${i % 2 ? C.yellow : C.red}" stroke="${C.ink}" stroke-width="2.4"/>`;
    if (i % 2 === 0) rays += `<path d="${petal}" ${t} fill="url(#mb-hatch-paper)"/>`;
    rays += `<path d="M0,-96 L0,-70" ${t} stroke="${C.ink}" stroke-width="1.3"/>`;
    rays += `<path d="M0,-82 L6,-60 L-6,-60 Z" transform="rotate(${i * 22.5 + 11.25})" fill="${C.orange}" stroke="${C.ink}" stroke-width="1.4"/>`;
  }
  const eye = (s) => `<g transform="scale(${s} 1)">
      <path d="M-34,-10 Q-26,-22 -10,-20 Q-6,-20 -4,-16" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-32,-4 Q-18,-16 -4,-4 Q-18,4 -32,-4 Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="2.4"/>
      <path d="M-32,-4 L-39,-8" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/>
      <circle class="pupil" cx="-17" cy="-5" r="4.6" fill="${C.ink}"/>
    </g>`;
  return `<g class="sun-rays">${rays}</g>
    <circle r="60" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>
    ${triRing(28, 50, 60, C.red, C.orange, 1.2)}
    <circle r="49" fill="#f6c445" stroke="${C.ink}" stroke-width="3"/>
    <circle r="44" fill="none" stroke="${C.ink}" stroke-width="1"/>
    <circle cx="-26" cy="14" r="8" fill="${C.red}" opacity=".35"/>
    <circle cx="26" cy="14" r="8" fill="${C.red}" opacity=".35"/>
    ${eye(1)}${eye(-1)}
    <path d="M0,-32 L0,-24" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="0" cy="-36" r="3.4" fill="${C.red}"/>
    <path d="M1,-12 Q-6,6 -4,10 Q0,13 6,10" fill="none" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M-13,22 Q0,16 13,22 Q0,33 -13,22 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="1.8"/>`;
}
export const sunFace = (cls = '') => svgWrap('-110 -110 220 220', sunGroup(), cls, 'Madhubani Surya, the sun');

/* ───────────────────────────── Chandra (Moon) ───────────────────────────── */

export function moonGroup() {
  const cres = 'M12.86,-89.07 A90,90 0 1,0 71.84,54.19 A78,78 0 1,1 12.86,-89.07 Z';
  const id = nextId('moon');
  return `<clipPath id="${id}"><path d="${cres}"/></clipPath>
    <path d="${cres}" fill="#f7efd9"/>
    <g clip-path="url(#${id})">
      <circle r="90" fill="none" stroke="${C.blue}" stroke-width="18" opacity=".9"/>
      <circle r="90" fill="none" stroke="url(#mb-hatch-paper)" stroke-width="18"/>
      <circle r="78" fill="none" stroke="${C.ink}" stroke-width="1.4"/>
    </g>
    ${dbl(cres, { w: 5, gap: 1.6 })}
    <path d="M-74,-28 Q-60,-38 -46,-30" fill="none" stroke="${C.ink}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M-72,-14 Q-58,-4 -44,-14" fill="none" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M-68,-10 l-3,6 M-62,-7 l-1.5,6.5 M-55,-7 l1,6.5 M-49,-10 l3,5.5" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="-66" cy="8" r="5" fill="${C.pink}" opacity=".5"/>
    <path d="M-64,26 Q-56,21 -48,26 Q-56,33 -64,26 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="1.6"/>
    <circle cx="-58" cy="-44" r="3" fill="${C.red}"/>
    ${flower(46, -58, 12, C.yellow, C.paper, C.red)}
    ${flower(64, 16, 9, C.paper, C.yellow, C.red)}
    ${flower(24, 66, 7, C.yellow, C.paper, C.red)}`;
}
export const moonFace = (cls = '') => svgWrap('-110 -110 220 220', moonGroup(), cls, 'Madhubani Chandra, the moon');

/* ───────────────────────────── Lotus (Kamal) ───────────────────────────── */

export function lotusGroup() {
  const center = 'M0,50 C-24,22 -20,-28 0,-72 C20,-28 24,22 0,50 Z';
  const side = 'M0,50 C-22,26 -18,-16 0,-56 C18,-16 22,26 0,50 Z';
  const outer = 'M0,50 C-18,30 -14,-2 0,-36 C14,-2 18,30 0,50 Z';
  const petal = (d, rot, fill) => {
    const t = `transform="rotate(${rot} 0 50)"`;
    const inner = `transform="rotate(${rot} 0 50) translate(0 50) scale(0.55) translate(0 -50)"`;
    return `<path d="${d}" ${t} fill="${fill}" stroke="${C.ink}" stroke-width="2.4"/>
      <path d="${d}" ${inner} fill="${C.paper}" stroke="${C.ink}" stroke-width="1.6"/>
      <path d="${d}" ${inner} fill="url(#mb-hatch-red)"/>`;
  };
  return `
    <path d="M0,70 C-8,84 8,92 0,108" fill="none" stroke="${C.greenDeep}" stroke-width="7" stroke-linecap="round"/>
    ${petal(outer, -64, '#b52a5f')}${petal(outer, 64, '#b52a5f')}
    ${petal(side, -32, C.pink)}${petal(side, 32, C.pink)}
    ${petal(center, 0, '#ee6f98')}
    ${shape('M-46,50 C-40,76 40,76 46,50 Z', C.green, { overlay: 'mb-hatch-paper' })}
    ${dbl('M-46,50 C-40,76 40,76 46,50 Z', { w: 4.6, gap: 1.5 })}`;
}
export const lotus = (cls = '') => svgWrap('-100 -100 200 210', lotusGroup(), cls, 'Lotus');

/* ───────────────────────────── Kalash (sacred pot) ───────────────────────────── */

export function kalashGroup() {
  const id = nextId('kal');
  const belly = 'M-26,-6 C-74,4 -76,72 -24,86 L24,86 C76,72 74,4 26,-6 Z';
  let leaves = '';
  [-64, -32, 32, 64, 0].forEach((rot) => {
    const d = 'M0,-30 C-12,-50 -10,-74 0,-92 C10,-74 12,-50 0,-30 Z';
    leaves += `<path d="${d}" transform="rotate(${rot} 0 -30)" fill="${C.green}" stroke="${C.ink}" stroke-width="2.2"/>
      <path d="${d}" transform="rotate(${rot} 0 -30)" fill="url(#mb-hatch-paper)" opacity=".6"/>
      <path d="M0,-34 L0,-86" transform="rotate(${rot} 0 -30)" stroke="${C.ink}" stroke-width="1.4"/>`;
  });
  let tri = '';
  for (let x = -72; x < 72; x += 12) tri += `<path d="M${x},44 L${x + 6},30 L${x + 12},44 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="1.2"/>`;
  return `${leaves}
    <circle cx="0" cy="-54" r="22" fill="#b5651d" stroke="${C.ink}" stroke-width="2.6"/>
    <circle cx="0" cy="-54" r="22" fill="url(#mb-hatch)" opacity=".7"/>
    <path d="M-7,-74 L0,-88 L7,-74" fill="${C.green}" stroke="${C.ink}" stroke-width="2"/>
    <clipPath id="${id}"><path d="${belly}"/></clipPath>
    <path d="${belly}" fill="${C.red}"/>
    <g clip-path="url(#${id})">
      <rect x="-80" y="26" width="160" height="22" fill="${C.yellow}"/>${tri}
      <rect x="-80" y="48" width="160" height="40" fill="url(#mb-dots-paper)"/>
      <rect x="-80" y="-10" width="160" height="36" fill="url(#mb-scales-yellow)"/>
    </g>
    ${dbl('M-80,26 L80,26 M-80,48 L80,48', { w: 3.6, gap: 1.2 })}
    ${dbl(belly, { w: 5, gap: 1.7 })}
    ${flower(0, 66, 11, C.yellow, C.pink, C.green)}
    ${shape('M-24,-8 L24,-8 L20,-22 L-20,-22 Z', C.yellow, { overlay: 'mb-hatch-red' })}
    ${shape('M-34,-22 L34,-22 Q37,-30 30,-33 L-30,-33 Q-37,-30 -34,-22 Z', C.orange)}
    ${shape('M-22,86 L22,86 L30,98 L-30,98 Z', C.yellow, { overlay: 'mb-hatch' })}`;
}
export const kalash = (cls = '') => svgWrap('-100 -112 200 214', kalashGroup(), cls, 'Kalash, the sacred pot');

/* ───────────────────────────── Diya (lamp) ───────────────────────────── */

export function diyaGroup() {
  return `<circle cx="58" cy="-36" r="46" fill="url(#mb-lamp)" class="diya-glow"/>
    <g class="diya-flame" style="transform-origin:58px -10px">
      <path d="M58,-10 C46,-24 48,-44 58,-64 C68,-44 70,-24 58,-10 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2"/>
      <path d="M58,-13 C52,-22 53,-34 58,-44 C63,-34 64,-22 58,-13 Z" fill="${C.orange}"/>
    </g>
    ${shape('M44,4 C56,-2 64,-8 68,-12 C62,2 54,10 46,12 Z', C.orange, { overlay: 'mb-hatch' })}
    ${shape('M-56,6 C-48,36 48,36 56,6 C30,0 -30,0 -56,6 Z', C.orange)}
    <path d="M-52,12 C-30,20 30,20 52,12 L48,20 C30,27 -30,27 -48,20 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="1.6"/>
    <path d="M-44,24 C-24,32 24,32 44,24" fill="none" stroke="${C.yellow}" stroke-width="3" stroke-dasharray="0.1 7" stroke-linecap="round"/>
    ${dbl('M-56,6 C-30,14 30,14 56,6', { w: 3.6, gap: 1.2 })}
    ${shape('M-20,28 L20,28 L26,40 L-26,40 Z', C.red, { overlay: 'mb-hatch-paper' })}`;
}
export const diya = (cls = '') => svgWrap('-72 -90 150 136', diyaGroup(), cls, 'Diya lamp');

/* ───────────────────────────── Navagraha emblems ───────────────────────────── */

const crow = () => `
  ${shape('M-38,8 L-66,-6 L-60,12 L-68,26 Z', C.blue, { overlay: 'mb-hatch-paper' })}
  ${shape('M-42,10 C-30,-22 20,-28 38,-8 C32,14 0,32 -42,10 Z', C.blue)}
  <path d="M-42,10 C-30,-22 20,-28 38,-8 C32,14 0,32 -42,10 Z" fill="url(#mb-scales-paper)" opacity=".8"/>
  ${shape('M-22,0 C-8,-14 12,-12 22,0 C8,9 -8,9 -22,0 Z', C.indigo, { overlay: 'mb-hatch-paper' })}
  <circle cx="34" cy="-18" r="15" fill="${C.blue}" stroke="${C.ink}" stroke-width="2.4"/>
  ${shape('M46,-23 L68,-14 L46,-8 Z', C.yellow)}
  <circle cx="38" cy="-20" r="4.6" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.6"/><circle cx="39" cy="-20" r="2.2" fill="${C.ink}"/>
  <path d="M-6,22 L-10,44 M8,20 L6,44 M-16,44 L-4,44 M0,44 L12,44" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`;

const hood = () => `
  <path d="M-24,30 C-52,46 -22,66 0,58 C22,50 52,60 40,36" fill="none" stroke="${C.ink}" stroke-width="15" stroke-linecap="round"/>
  <path d="M-24,30 C-52,46 -22,66 0,58 C22,50 52,60 40,36" fill="none" stroke="#6c7189" stroke-width="10" stroke-linecap="round"/>
  <path d="M-24,30 C-52,46 -22,66 0,58 C22,50 52,60 40,36" fill="none" stroke="${C.paper}" stroke-width="2" stroke-dasharray="1 6" stroke-linecap="round"/>
  ${shape('M0,-62 C34,-58 46,-16 26,26 C18,40 -18,40 -26,26 C-46,-16 -34,-58 0,-62 Z', '#5a5f73')}
  <path d="M0,-62 C34,-58 46,-16 26,26 C18,40 -18,40 -26,26 C-46,-16 -34,-58 0,-62 Z" fill="url(#mb-scales-paper)" opacity=".85"/>
  ${shape('M0,-50 C14,-48 20,-30 14,-12 C8,0 -8,0 -14,-12 C-20,-30 -14,-48 0,-50 Z', C.yellow, { overlay: 'mb-hatch-red' })}
  <circle cx="-8" cy="-32" r="5" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.6"/><circle cx="-8" cy="-32" r="2.4" fill="${C.red}"/>
  <circle cx="8" cy="-32" r="5" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.6"/><circle cx="8" cy="-32" r="2.4" fill="${C.red}"/>
  <path d="M0,-6 L0,10 L-5,18 M0,10 L5,18" fill="none" stroke="${C.red}" stroke-width="2.4" stroke-linecap="round"/>`;

const tail = () => `
  <path d="M-34,44 C-64,22 -44,-22 -10,-18 C22,-14 22,22 0,24 C-14,26 -16,10 -6,8" fill="none" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>
  <path d="M-34,44 C-64,22 -44,-22 -10,-18 C22,-14 22,22 0,24 C-14,26 -16,10 -6,8" fill="none" stroke="#9a6735" stroke-width="11" stroke-linecap="round"/>
  <path d="M-34,44 C-64,22 -44,-22 -10,-18 C22,-14 22,22 0,24 C-14,26 -16,10 -6,8" fill="none" stroke="${C.yellow}" stroke-width="2.4" stroke-dasharray="1 6" stroke-linecap="round"/>
  <path d="M36,56 L36,-62" stroke="${C.ink}" stroke-width="3.4" stroke-linecap="round"/>
  ${shape('M36,-62 L76,-46 L36,-30 Z', C.red, { overlay: 'mb-hatch-yellow' })}`;

const pothi = () => {
  let leaves = '';
  [-22, -4, 14].forEach((y, i) => {
    leaves += `<rect x="-56" y="${y}" width="112" height="16" rx="8" fill="${i % 2 ? C.orange : C.yellow}" stroke="${C.ink}" stroke-width="2.2"/>
      <rect x="-56" y="${y}" width="112" height="16" rx="8" fill="url(#mb-hatch-red)" opacity=".5"/>`;
  });
  return `${shape('M-40,36 L40,36 L28,58 L-28,58 Z', C.red, { overlay: 'mb-hatch-paper' })}
    ${leaves}
    <path d="M-30,-30 L-30,36 M30,-30 L30,36" stroke="${C.red}" stroke-width="3"/>
    <circle cx="-30" cy="-6" r="3" fill="${C.ink}"/><circle cx="30" cy="-6" r="3" fill="${C.ink}"/>
    ${flower(0, -48, 18, C.yellow, C.red, C.green)}`;
};

const trikona = () => `
  ${shape('M0,-60 L54,40 L-54,40 Z', C.red, { overlay: 'mb-hatch-paper' })}
  ${dbl('M0,-60 L54,40 L-54,40 Z', { w: 4.6, gap: 1.6 })}
  ${shape('M0,-28 L28,24 L-28,24 Z', C.yellow, { overlay: 'mb-dots' })}
  <circle cx="0" cy="6" r="6" fill="${C.red}" stroke="${C.ink}" stroke-width="2"/>`;

const baan = () => `
  ${shape('M0,-62 L28,-24 L10,-24 L10,58 L-10,58 L-10,-24 L-28,-24 Z', C.green, { overlay: 'mb-hatch-paper' })}
  ${shape('M10,0 C30,-12 44,-6 50,4 C36,10 22,10 10,4 Z', C.greenDeep)}
  ${shape('M-10,20 C-30,8 -44,14 -50,24 C-36,30 -22,30 -10,24 Z', C.greenDeep)}
  ${shape('M-10,58 L-22,70 L-10,66 L0,74 L10,66 L22,70 L10,58 Z', C.yellow)}`;

export function grahaEmblem(key) {
  switch (key) {
    case 'sun': return `<g transform="scale(0.56)">${sunGroup()}</g>`;
    case 'moon': return `<g transform="translate(6 0) scale(0.6)">${moonGroup()}</g>`;
    case 'mars': return trikona();
    case 'mercury': return baan();
    case 'jupiter': return pothi();
    case 'venus': return flower(0, 0, 58, C.paper, C.pink, C.yellow);
    case 'saturn': return `<g transform="scale(0.95)">${crow()}</g>`;
    case 'rahu': return hood();
    case 'ketu': return tail();
    default: return '';
  }
}

/** Patterned roundel used for grahas and rashis. */
export function medallion(inner, { ring = C.red, triA = C.yellow, triB = C.orange, label = '', cls = '' } = {}) {
  return svgWrap('-100 -100 200 200', `
    <circle r="97" fill="${ring}" stroke="${C.ink}" stroke-width="3"/>
    ${triRing(32, 82, 96, triA, triB, 1.3)}
    <circle r="82" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>
    <circle r="76" fill="none" stroke="${C.ink}" stroke-width="1.2"/>
    ${dotRing(36, 79, 1.2)}
    ${inner}`, cls, label);
}

/* ───────────────────────────── Parrot (Tota) ───────────────────────────── */

export function parrotGroup(flip = false) {
  return `<g ${flip ? 'transform="scale(-1 1)"' : ''}>
    ${shape('M-30,30 L-80,70 L-70,50 L-88,52 Z', C.green, { overlay: 'mb-hatch-paper' })}
    ${shape('M-34,34 C-40,0 -10,-34 14,-34 C34,-34 40,-10 30,10 C20,30 -4,44 -34,34 Z', C.green)}
    <path d="M-34,34 C-40,0 -10,-34 14,-34 C34,-34 40,-10 30,10 C20,30 -4,44 -34,34 Z" fill="url(#mb-scales-paper)" opacity=".7"/>
    ${shape('M-24,20 C-20,-4 0,-12 12,-4 C6,12 -6,20 -24,20 Z', C.yellow, { overlay: 'mb-hatch-red' })}
    <circle cx="20" cy="-36" r="17" fill="${C.green}" stroke="${C.ink}" stroke-width="2.4"/>
    ${shape('M32,-44 C48,-44 50,-28 40,-22 C38,-30 36,-34 32,-34 Z', C.red)}
    <circle cx="24" cy="-40" r="5" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.6"/><circle cx="25" cy="-40" r="2.4" fill="${C.ink}"/>
    <path d="M6,-26 Q18,-18 34,-24" fill="none" stroke="${C.red}" stroke-width="3"/>
    <path d="M-4,34 L-6,50 M6,30 L6,50" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/></g>`;
}

/* ───────────────────────────── Peacock (Mor) ───────────────────────────── */

export function peacockGroup() {
  let tail = '';
  for (let i = 0; i < 7; i++) {
    const rot = -66 + i * 22;
    tail += `<g transform="rotate(${rot} -20 20)">
      <path d="M-20,20 C-34,-20 -30,-70 -20,-96 C-10,-70 -6,-20 -20,20 Z" fill="${C.green}" stroke="${C.ink}" stroke-width="2"/>
      <path d="M-20,20 C-34,-20 -30,-70 -20,-96 C-10,-70 -6,-20 -20,20 Z" fill="url(#mb-hatch-paper)" opacity=".55"/>
      <ellipse cx="-20" cy="-74" rx="10" ry="14" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.8"/>
      <ellipse cx="-20" cy="-72" rx="6" ry="9" fill="${C.blue}" stroke="${C.ink}" stroke-width="1.4"/>
      <circle cx="-20" cy="-70" r="2.6" fill="${C.ink}"/></g>`;
  }
  return `${tail}
    ${shape('M-40,40 C-48,10 -20,-8 4,0 C20,6 22,30 10,44 C-6,58 -32,58 -40,40 Z', C.blue)}
    <path d="M-40,40 C-48,10 -20,-8 4,0 C20,6 22,30 10,44 C-6,58 -32,58 -40,40 Z" fill="url(#mb-scales-paper)"/>
    ${shape('M0,2 C4,-20 16,-34 26,-46 C34,-40 30,-30 24,-22 C18,-12 14,0 12,8 Z', C.blue, { overlay: 'mb-hatch-paper' })}
    <circle cx="30" cy="-48" r="10" fill="${C.blue}" stroke="${C.ink}" stroke-width="2.2"/>
    ${shape('M38,-50 L52,-46 L38,-42 Z', C.yellow)}
    <circle cx="32" cy="-50" r="3" fill="${C.paper}"/><circle cx="32.6" cy="-50" r="1.4" fill="${C.ink}"/>
    <path d="M26,-58 L22,-72 M30,-58 L30,-74 M34,-58 L38,-72" stroke="${C.ink}" stroke-width="1.6"/>
    <circle cx="22" cy="-74" r="2.6" fill="${C.red}"/><circle cx="30" cy="-76" r="2.6" fill="${C.red}"/><circle cx="38" cy="-74" r="2.6" fill="${C.red}"/>
    <path d="M-20,54 L-22,74 M-6,54 L-4,74" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`;
}
export const peacock = (cls = '') => svgWrap('-130 -130 220 214', peacockGroup(), cls, 'Peacock');

/* ───────────────────────────── Tree of life ───────────────────────────── */

export function treeGroup() {
  const leaf = (x, y, rot, fill) => `<g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M0,0 C-10,-12 -8,-28 0,-36 C8,-28 10,-12 0,0 Z" fill="${fill}" stroke="${C.ink}" stroke-width="1.8"/>
      <path d="M0,-3 L0,-32" stroke="${C.ink}" stroke-width="1"/></g>`;
  let leaves = '';
  const spots = [
    [-60, -60, -50], [-40, -96, -20], [0, -112, 0], [40, -96, 20], [60, -60, 50], [-74, -20, -70], [74, -20, 70],
    [-30, -50, -30], [30, -50, 30], [0, -70, 0], [-50, 0, -60], [50, 0, 60],
  ];
  spots.forEach(([x, y, r], i) => (leaves += leaf(x, y, r, [C.green, C.red, C.yellow][i % 3])));
  return `
    ${shape('M-10,120 C-8,60 -14,30 -4,0 C6,30 12,60 10,120 Z', '#8a5a2b', { overlay: 'mb-hatch' })}
    ${dbl('M-4,0 C-30,-20 -50,-50 -50,-60 M4,0 C30,-20 50,-50 50,-60 M0,-10 C0,-50 0,-80 0,-100 M-6,20 C-30,10 -60,0 -72,-20 M6,20 C30,10 60,0 72,-20', { w: 5, gap: 1.6 })}
    ${leaves}
    ${flower(0, -96, 10, C.pink, C.yellow, C.red)}`;
}

/* Exported for zodiac medallions & star fields. */
export { svgWrap, shape };
