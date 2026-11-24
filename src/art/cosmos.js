// Papercut cosmos: every shape is a flat sheet of coloured paper, lifted off
// the one beneath by a crisp edge shadow (paper thickness) and a soft drop
// shadow. Planets, moons, clouds, stars and the small service icons live here.
import { C } from './palette.js';

let uid = 0;
const id = (p) => `${p}${++uid}`;

export const polar = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [+(r * Math.cos(a)).toFixed(2), +(r * Math.sin(a)).toFixed(2)];
};

/** One sheet of paper: an edge (thickness) under the face. */
export const sheet = (d, fill, { edge = 3, extra = '' } = {}) =>
  `<path d="${d}" fill="${C.edge}" transform="translate(0 ${edge})" ${extra}/><path d="${d}" fill="${fill}" ${extra}/>`;

export const disc = (r, fill, { cx = 0, cy = 0, edge = 3 } = {}) =>
  `<circle cx="${cx}" cy="${cy + edge}" r="${r}" fill="${C.edge}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;

export const wrap = (viewBox, inner, { cls = '', label = '', shadow = true } = {}) =>
  `<svg class="art ${cls}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><g ${shadow ? 'filter="url(#paper)"' : ''}>${inner}</g></svg>`;

/** A paper star with n points. */
export function starPath(cx, cy, r, n = 5, inner = 0.45) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const rr = i % 2 ? r * inner : r;
    const [x, y] = polar(rr, (i * 180) / n);
    d += `${i ? 'L' : 'M'}${(cx + x).toFixed(2)},${(cy + y).toFixed(2)} `;
  }
  return `${d}Z`;
}
export const star = (cx, cy, r, fill = C.gold, n = 4) => sheet(starPath(cx, cy, r, n, n === 4 ? 0.32 : 0.45), fill, { edge: Math.max(1, r * 0.12) });

/** Crescent: disc of radius r minus a disc shifted by (dx, dy). */
export function crescentPath(r, dx, dy = 0) {
  // Intersections of circle (0,0,r) and circle (dx,dy,r)
  const d = Math.hypot(dx, dy);
  const a = d / 2;
  const h = Math.sqrt(r * r - a * a);
  const mx = dx / 2;
  const my = dy / 2;
  const ux = -dy / d;
  const uy = dx / d;
  const p1 = [mx + ux * h, my + uy * h];
  const p2 = [mx - ux * h, my - uy * h];
  return `M${p1[0].toFixed(2)},${p1[1].toFixed(2)} A${r},${r} 0 1,1 ${p2[0].toFixed(2)},${p2[1].toFixed(2)} A${r},${r} 0 0,0 ${p1[0].toFixed(2)},${p1[1].toFixed(2)} Z`;
}

/* ───────────── planets (viewBox -100 -100 200 200) ───────────── */

function shaded(r, base, shade, extra = '') {
  const c = id('pl');
  return `<clipPath id="${c}"><circle r="${r}"/></clipPath>
    ${disc(r, base, { edge: 4 })}
    <g clip-path="url(#${c})">${extra}<circle cx="${r * 0.42}" cy="${r * 0.36}" r="${r}" fill="${shade}" opacity=".55"/></g>
    <circle cx="${-r * 0.38}" cy="${-r * 0.42}" r="${r * 0.12}" fill="#fff" opacity=".25"/>`;
}

export function sunGroup(rays = 12) {
  let s = '';
  for (let i = 0; i < rays; i++) {
    const [x1, y1] = polar(54, i * (360 / rays) - 9);
    const [x2, y2] = polar(96, i * (360 / rays));
    const [x3, y3] = polar(54, i * (360 / rays) + 9);
    s += `<path d="M${x1},${y1} L${x2},${y2} L${x3},${y3} Z" fill="${C.saffron}"/>`;
    const [a1, b1] = polar(54, (i + 0.5) * (360 / rays) - 7);
    const [a2, b2] = polar(80, (i + 0.5) * (360 / rays));
    const [a3, b3] = polar(54, (i + 0.5) * (360 / rays) + 7);
    s += `<path d="M${a1},${b1} L${a2},${b2} L${a3},${b3} Z" fill="${C.gold}"/>`;
  }
  return `<g class="sun-rays">${s}</g>${disc(58, C.gold, { edge: 4 })}${disc(44, '#ffd98a', { edge: 3 })}${star(0, 0, 18, C.saffron, 4)}`;
}

export function moonGroup() {
  return `${sheet(crescentPath(70, 34, -16), C.paper, { edge: 4 })}
    <circle cx="-40" cy="10" r="7" fill="#e3d6bd"/><circle cx="-26" cy="38" r="4.5" fill="#e3d6bd"/><circle cx="-50" cy="-22" r="4" fill="#e3d6bd"/>
    ${star(40, -46, 9, C.gold)}${star(56, 18, 6, C.mist)}`;
}

const PLANETS = {
  sun: () => sunGroup(),
  moon: () => moonGroup(),
  mars: () => shaded(66, '#e5533d', '#8f2a22', `<circle cx="-22" cy="-18" r="9" fill="#c8432f"/><circle cx="18" cy="26" r="6" fill="#c8432f"/><circle cx="30" cy="-30" r="4" fill="#c8432f"/>`),
  mercury: () => shaded(52, '#8fd8cc', '#2f7f78', `<circle cx="-16" cy="12" r="7" fill="#74c2b6"/><circle cx="14" cy="-18" r="5" fill="#74c2b6"/>`),
  jupiter: () =>
    shaded(74, '#f0c48a', '#8a4f2a', `
      <path d="M-80,-38 C-30,-48 30,-28 80,-40 L80,-22 C30,-12 -30,-30 -80,-20 Z" fill="#c9894f"/>
      <path d="M-80,2 C-30,-8 30,12 80,0 L80,16 C30,28 -30,8 -80,20 Z" fill="#d99a5b"/>
      <path d="M-80,36 C-30,28 30,46 80,34 L80,46 C30,58 -30,40 -80,50 Z" fill="#c9894f"/>
      <ellipse cx="26" cy="22" rx="16" ry="9" fill="#d0603e"/>`),
  venus: () =>
    shaded(60, '#ffd7c2', '#b8707a', `
      <path d="M-70,-20 C-30,-40 10,0 70,-24 L70,-10 C10,14 -30,-24 -70,-6 Z" fill="#f3b49a"/>
      <path d="M-70,24 C-30,8 20,40 70,18 L70,30 C20,52 -30,20 -70,36 Z" fill="#f3b49a"/>`),
  saturn: () => {
    const back = id('rb');
    const front = id('rf');
    const ring = 'M-96,0 A96,26 0 1,0 96,0 A96,26 0 1,0 -96,0 Z M-70,0 A70,16 0 1,1 70,0 A70,16 0 1,1 -70,0 Z';
    return `<clipPath id="${back}"><rect x="-110" y="-60" width="220" height="60"/></clipPath>
      <clipPath id="${front}"><rect x="-110" y="0" width="220" height="60"/></clipPath>
      <g transform="rotate(-16)">
        <g clip-path="url(#${back})"><path d="${ring}" fill="#b9a06a" fill-rule="evenodd"/></g>
      </g>
      ${shaded(54, '#ead08f', '#7d5a2a', `<rect x="-60" y="-14" width="120" height="10" fill="#d4b06b"/><rect x="-60" y="14" width="120" height="8" fill="#d4b06b"/>`)}
      <g transform="rotate(-16)">
        <g clip-path="url(#${front})"><path d="${ring}" fill="${C.edge}" fill-rule="evenodd" transform="translate(0 3)"/><path d="${ring}" fill="#e2c787" fill-rule="evenodd"/></g>
      </g>`;
  },
  rahu: () => `<circle r="88" fill="url(#g-corona)"/>
    ${disc(60, '#120f33', { edge: 0 })}<circle r="60" fill="none" stroke="${C.gold}" stroke-width="3"/>`,
};

export function planetGroup(key) {
  if (key === 'ketu') {
    // Comet: tail of paper strips behind a small lilac moonlet.
    return `${sheet('M10,-10 C-30,10 -70,50 -96,92 C-60,70 -30,52 4,26 Z', C.rose)}
      ${sheet('M14,-2 C-20,24 -40,60 -54,96 C-30,70 -10,48 18,26 Z', C.lilac)}
      ${sheet('M20,4 C0,30 -10,62 -14,98 C2,70 14,50 28,28 Z', C.mist)}
      <g transform="translate(22 -20)">${shaded(40, '#c8bbff', '#5a46b0')}</g>`;
  }
  return PLANETS[key] ? PLANETS[key]() : '';
}

export const planet = (key, cls = '', label = '') => wrap('-100 -100 200 200', planetGroup(key), { cls, label });

/* ───────────── hero scenery ───────────── */

/** A band of rolling paper clouds/hills across a 1600-wide strip. */
export function cloudBand({ y = 60, amp = 26, bumps = 7, fill = C.n3, h = 200, seed = 0 } = {}) {
  const w = 1600;
  const step = w / bumps;
  let d = `M0,${h} L0,${y}`;
  for (let i = 0; i < bumps; i++) {
    const x0 = i * step;
    const lift = amp * (0.6 + 0.4 * Math.sin(i * 1.7 + seed));
    d += ` C${x0 + step * 0.15},${y - lift} ${x0 + step * 0.85},${y - lift} ${x0 + step},${y}`;
  }
  d += ` L${w},${h} Z`;
  return `<svg class="band" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d="${d}" fill="${fill}"/></svg>`;
}

/** Concentric orbits with little paper planets (animated with CSS). */
export function orbitSystem() {
  const orbit = (r, ry, dur, planetFill, size, delay, tilt = -14) =>
    `<g transform="rotate(${tilt})">
      <ellipse rx="${r}" ry="${ry}" fill="none" stroke="${C.lilac}" stroke-opacity=".28" stroke-width="1.4" stroke-dasharray="3 7"/>
      <g class="orbit" style="--dur:${dur}s;--delay:${delay}s;--rx:${r}px;--ry:${ry}px">
        <circle class="orbit-body" r="${size}" fill="${planetFill}" filter="url(#paper-sm)"/>
      </g></g>`;
  return `<svg class="art orbits" viewBox="-420 -260 840 520" aria-hidden="true">
    ${orbit(200, 70, 26, C.teal, 7, 0)}
    ${orbit(290, 104, 40, C.rose, 10, -12)}
    ${orbit(380, 140, 62, C.gold, 13, -30)}
  </svg>`;
}

/* ───────────── small papercut icons (viewBox -50 -50 100 100) ───────────── */

const ICONS = {
  chat: () => `${sheet('M-34,-26 h56 a12,12 0 0 1 12,12 v28 a12,12 0 0 1 -12,12 h-30 l-18,14 v-14 h-8 a12,12 0 0 1 -12,-12 v-28 a12,12 0 0 1 12,-12 Z', C.lilac)}
    ${star(-6, 0, 12, C.gold)}`,
  call: () => `${sheet('M-26,-36 c8,-4 14,0 18,8 l6,12 c3,7 0,12 -6,16 c4,12 12,22 24,28 c4,-6 9,-9 16,-6 l12,6 c8,4 12,10 8,18 l-4,8 c-6,8 -16,10 -28,4 c-28,-14 -48,-36 -56,-62 c-3,-12 0,-22 10,-32 Z', C.teal)}
    <path d="M14,-34 a22,22 0 0 1 22,22 M14,-22 a10,10 0 0 1 10,10" fill="none" stroke="${C.gold}" stroke-width="5" stroke-linecap="round"/>`,
  video: () => `${sheet('M-40,-24 h50 a10,10 0 0 1 10,10 v32 a10,10 0 0 1 -10,10 h-50 a10,10 0 0 1 -10,-10 v-32 a10,10 0 0 1 10,-10 Z', C.rose)}
    ${sheet('M22,-8 l22,-14 v44 l-22,-14 Z', C.gold)}${star(-15, 2, 10, C.paper)}`,
  kundli: () => `${sheet('M-40,-40 h80 v80 h-80 Z', C.n4)}
    <path d="M-40,-40 L40,40 M40,-40 L-40,40 M0,-40 L40,0 L0,40 L-40,0 Z" fill="none" stroke="${C.gold}" stroke-width="3.5"/>
    <circle r="6" fill="${C.saffron}"/>`,
  milan: () => `${sheet('M-6,-14 a20,20 0 1 0 -26,30 l26,24 l0,0 Z', C.rose)}
    ${sheet('M6,-14 a20,20 0 1 1 26,30 l-26,24 Z', C.gold)}${star(0, -30, 9, C.paper)}`,
  horoscope: () => `${sheet(crescentPath(36, 20, -10), C.gold)}${star(22, -18, 10, C.paper)}${star(28, 20, 6, C.lilac)}`,
  puja: () => `<ellipse cx="0" cy="-12" rx="26" ry="30" fill="url(#g-halo)"/>
    ${sheet('M0,-40 C12,-22 12,-6 0,2 C-12,-6 -12,-22 0,-40 Z', C.gold)}
    ${sheet('M-40,8 C-30,36 30,36 40,8 C20,4 -20,4 -40,8 Z', C.saffron)}`,
  mall: () => `${sheet('M-30,-14 L-14,-34 H14 L30,-14 L0,36 Z', C.sky)}
    ${sheet('M-30,-14 H30 L0,36 Z', '#5aa7e8')}<path d="M-14,-34 L-6,-14 L0,36 M14,-34 L6,-14 M-6,-14 H6" stroke="${C.paper}" stroke-width="2" opacity=".6" fill="none"/>`,
  shield: () => `${sheet('M0,-40 L34,-26 V2 C34,24 18,38 0,44 C-18,38 -34,24 -34,2 V-26 Z', C.teal)}
    <path d="M-14,0 L-3,12 L16,-12" fill="none" stroke="${C.n1}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  orbit: () => `<ellipse rx="42" ry="14" transform="rotate(-20)" fill="none" stroke="${C.lilac}" stroke-width="4"/>
    ${disc(20, C.saffron)}${star(30, -26, 8, C.gold)}`,
  wallet: () => `${sheet('M-40,-24 h70 a10,10 0 0 1 10,10 v40 a10,10 0 0 1 -10,10 h-70 a10,10 0 0 1 -10,-10 v-40 a10,10 0 0 1 10,-10 Z', C.gold)}
    ${sheet('M10,-6 h30 v20 h-30 a10,10 0 0 1 0,-20 Z', C.saffron)}<circle cx="12" cy="4" r="4" fill="${C.n1}"/>`,
  lock: () => `${sheet('M-30,-6 h60 v44 h-60 Z', C.lilac)}
    <path d="M-18,-6 v-12 a18,18 0 0 1 36,0 v12" fill="none" stroke="${C.mist}" stroke-width="7"/>
    ${star(0, 16, 9, C.gold)}`,
};

export const icon = (key, cls = '') => wrap('-50 -50 100 100', ICONS[key](), { cls });
