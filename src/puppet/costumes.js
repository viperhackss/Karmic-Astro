// Papercut marionettes. Every piece is a flat sheet of card with a thin edge
// shadow, joined at shoulders and elbows by brass split-pins, the way paper
// puppets are made. The silhouettes still nod to South Indian string and
// leather puppetry: a tall kireetam crown, a sunburst halo, a jaw-band.
//
// Local frames (the rig rotates each part about its joint):
//   head      origin at the neck, face centred at (0,-52), up is -y
//   torso     origin at the neck, pelvis at (0,92)
//   upper arm origin at the shoulder, elbow at (0,50)
//   forearm   origin at the elbow, wrist at (0,46), hand below
//   skirt     origin at the pelvis, hem near y=124
import { C } from '../art/palette.js';
import { polar, starPath } from '../art/cosmos.js';

const E = 2.4; // paper edge thickness
const P = (d, fill, extra = '') =>
  `<path d="${d}" fill="${C.edge}" transform="translate(0 ${E})" ${extra}/><path d="${d}" fill="${fill}" ${extra}/>`;
const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const brad = (x = 0, y = 0) => `${dot(x, y + 1, 4.4, C.edge)}${dot(x, y, 4.2, C.gold)}${dot(x - 1.2, y - 1.2, 1.4, '#fff3c4')}`;
const tinyStar = (x, y, r, fill = C.gold) => `<path d="${starPath(x, y, r, 4, 0.34)}" fill="${fill}"/>`;

const HAIR = '#2a1f3d';
const WHITE = '#fff7ea';

/* ───────────── heads ───────────── */

function halo() {
  let rays = '';
  for (let i = 0; i < 18; i++) {
    const a = i * 20;
    const [x1, y1] = polar(46, a - 7);
    const [x2, y2] = polar(i % 2 ? 66 : 80, a);
    const [x3, y3] = polar(46, a + 7);
    rays += `<path d="M${x1},${y1} L${x2},${y2} L${x3},${y3} Z" fill="${i % 2 ? C.gold : C.saffron}"/>`;
  }
  return `<g transform="translate(0 -60)"><circle r="92" fill="url(#g-halo)"/>${rays}
    <circle r="50" cy="3" fill="${C.edge}"/><circle r="50" fill="${C.gold}"/><circle r="42" fill="${C.n4}"/></g>`;
}

function eye(side, lashes) {
  return `<g transform="scale(${side} 1)">
    <path d="M-20,-64.5 Q-12,-70 -4,-65.5" fill="none" stroke="${HAIR}" stroke-width="3.2" stroke-linecap="round"/>
    <g class="eye" data-side="${side}">
      <path d="M-20,-56 Q-12,-62 -4,-56 Q-12,-51 -20,-56 Z" fill="${WHITE}"/>
      <circle class="pupil" cx="-12" cy="-56.3" r="3" fill="${C.ink}"/>
      <circle class="pupil" cx="-13" cy="-57.4" r=".9" fill="#fff"/>
      <path d="M-20.5,-56.2 Q-12,-62.5 -3.5,-56.2" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    ${lashes ? `<path d="M-19,-58 l-3.4,-2.2 M-17,-59.8 l-2.4,-2.8" stroke="${C.ink}" stroke-width="1.2" stroke-linecap="round"/>` : ''}
  </g>`;
}

function face(v) {
  const skin = v.skin || C.skin;
  let s = '';
  s += P('M-8,-24 L-8,2 L8,2 L8,-24 Z', skin);
  s += P('M-25,-60 C-33,-60 -33,-44 -24,-44 Z', skin) + P('M25,-60 C33,-60 33,-44 24,-44 Z', skin);
  s += dot(-27, -38, 4.2, C.gold) + tinyStar(-27, -30, 4.2) + dot(27, -38, 4.2, C.gold) + tinyStar(27, -30, 4.2);
  s += `<ellipse cx="0" cy="-49.6" rx="25" ry="31" fill="${C.edge}"/><ellipse cx="0" cy="-52" rx="25" ry="31" fill="${skin}"/>`;
  s += `<path d="M10,-80 C26,-72 28,-40 14,-24 C22,-40 22,-66 10,-80 Z" fill="${v.shade || C.skinShade}" opacity=".45"/>`;
  s += dot(-14, -41, 5, C.rose).replace('/>', ' opacity=".35"/>') + dot(14, -41, 5, C.rose).replace('/>', ' opacity=".35"/>');
  if (v.chutti) s += P('M-26,-46 C-24,-18 -12,-12 0,-11 C12,-12 24,-18 26,-46 C20,-30 12,-24 0,-23 C-12,-24 -20,-30 -26,-46 Z', WHITE);
  if (v.beard) s += P('M-24,-44 C-25,-16 -12,-1 0,3 C12,-1 25,-16 24,-44 C17,-32 10,-28 0,-28 C-10,-28 -17,-32 -24,-44 Z', v.beardColor || '#ece4f7');
  s += eye(1, v.lashes) + eye(-1, v.lashes);
  if (v.glasses) s += `<g fill="none" stroke="${C.gold}" stroke-width="1.8"><circle cx="-12" cy="-56" r="8.5"/><circle cx="12" cy="-56" r="8.5"/><path d="M-3.5,-57 Q0,-60 3.5,-57"/></g>`;
  s += `<path d="M-1,-53 Q-4,-44 -3,-41 Q0,-39.6 4,-41" fill="none" stroke="${v.shade || C.skinShade}" stroke-width="1.8" stroke-linecap="round"/>`;
  if (v.nath) s += `<circle cx="6.6" cy="-39.4" r="4.6" fill="none" stroke="${C.gold}" stroke-width="1.6"/>`;
  s += `<path class="mouth" d="M-7,-31 Q0,-25.5 7,-31 Q0,-28.6 -7,-31 Z" fill="${C.coral}"/>`;
  if (v.moustache) s += P('M0,-35 C-6,-38 -14,-37.6 -19,-33 C-20,-29.4 -16.6,-28.4 -15.6,-31.4 C-11,-33.6 -5,-33 0,-32.2 C5,-33 11,-33.6 15.6,-31.4 C16.6,-28.4 20,-29.4 19,-33 C14,-37.6 6,-38 0,-35 Z', HAIR);
  if (v.mark === 'namam') s += `<path d="M-5,-82 L-4,-71 Q0,-67 4,-71 L5,-82" fill="none" stroke="${WHITE}" stroke-width="2.6" stroke-linecap="round"/><path d="M0,-82 L0,-70" stroke="${C.coral}" stroke-width="2.4" stroke-linecap="round"/>`;
  else if (v.mark === 'tripundra') s += `<path d="M-12,-78 H12 M-13,-74 H13 M-12,-70 H12" stroke="${WHITE}" stroke-width="2" stroke-linecap="round"/>${dot(0, -74, 2.4, C.coral)}`;
  else if (v.mark === 'bindi') s += dot(0, -68, 2.8, C.coral);
  else if (v.mark === 'tilak') s += `<path d="M0,-80 L0,-67" stroke="${C.coral}" stroke-width="3.2" stroke-linecap="round"/>`;
  return s;
}

function kireetam() {
  return `
    ${P('M-28,-76 C-44,-78 -46,-58 -34,-50 L-27,-57 Z', C.gold)}${P('M28,-76 C44,-78 46,-58 34,-50 L27,-57 Z', C.gold)}
    ${P('M-24,-82 L-16,-112 L-8,-117 L0,-146 L8,-117 L16,-112 L24,-82 Q0,-92 -24,-82 Z', C.gold)}
    <path d="${'M-10,-104 A12,12 0 1 0 10,-104 A9,9 0 1 1 -10,-104 Z'}" fill="${C.n2}"/>
    ${tinyStar(0, -128, 6, C.n2)}
    ${P('M-30,-73 Q0,-88 30,-73 L30,-80 Q0,-96 -30,-80 Z', C.goldDeep)}
    ${dot(-16, -81.5, 3, C.rose)}${dot(0, -85, 3.4, C.teal)}${dot(16, -81.5, 3, C.rose)}
    ${P(starPath(0, -152, 8, 4, 0.34), C.gold)}`;
}

function turban(color = C.saffron, plume = true) {
  return `${P('M-28,-64 C-34,-98 -12,-112 0,-110 C14,-112 34,-98 28,-64 C18,-74 -18,-74 -28,-64 Z', color)}
    <path d="M-27,-72 C-14,-90 14,-98 27,-86 L27,-80 C14,-92 -14,-84 -27,-66 Z" fill="#000" opacity=".14"/>
    <path d="M-24,-88 C-10,-100 12,-104 24,-98 L22,-94 C12,-100 -10,-96 -24,-84 Z" fill="#fff" opacity=".16"/>
    ${plume ? P('M4,-100 C8,-128 22,-138 26,-122 C20,-118 12,-110 9,-100 Z', WHITE) : ''}
    ${dot(0, -90, 6.4, C.gold)}${dot(0, -90, 2.6, C.teal)}`;
}

function veilBack(color = C.rose) {
  return P('M-34,-40 C-40,-104 -18,-124 0,-124 C18,-124 40,-104 34,-40 L48,16 L-48,16 Z', color);
}

function veilFront(color = C.rose) {
  let holes = '';
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const a = Math.PI * (1 - t);
    holes += dot(Math.cos(a) * 29, -60 - Math.sin(a) * 28, 1.5, C.gold);
  }
  return `${P('M-26,-58 C-28,-86 28,-86 26,-58 C18,-72 -18,-72 -26,-58 Z', HAIR)}
    ${P('M-31,-56 C-34,-100 34,-100 31,-56 C27,-90 -27,-90 -31,-56 Z', color)}${holes}
    <path d="M0,-86 L0,-74" stroke="${C.gold}" stroke-width="1.4"/>${dot(0, -72, 3.4, C.gold)}`;
}

function bun(hair = HAIR) {
  return `${P('M-13,-86 a13,13 0 1 0 26,0 a13,13 0 1 0 -26,0 Z', hair)}
    ${P('M-27,-54 C-31,-90 31,-90 27,-54 C20,-74 -20,-74 -27,-54 Z', hair)}
    ${tinyStar(10, -96, 5, C.gold)}`;
}

const shikha = (skin) => `${P('M-26,-60 C-28,-86 28,-86 26,-60 C20,-78 -20,-78 -26,-60 Z', skin)}
  <path d="M0,-83 C-2,-92 4,-98 8,-96 C4,-94 2,-90 3,-84" fill="none" stroke="${HAIR}" stroke-width="2.6" stroke-linecap="round"/>`;

export function headParts(v = {}) {
  const skin = v.skin || C.skin;
  let back = '';
  let front = '';
  if (v.halo) back += halo();
  if (v.headwear === 'veil') back += veilBack(v.veilColor);
  front += face({ ...v, skin });
  switch (v.headwear) {
    case 'kireetam': front += kireetam(); break;
    case 'turban': front += turban(v.turbanColor, v.plume !== false); break;
    case 'veil': front += veilFront(v.veilColor); break;
    case 'bun': front += bun(v.hair); break;
    case 'shikha': front += shikha(skin); break;
    default:
      front += P('M-27,-56 C-31,-92 31,-92 27,-56 C24,-70 14,-76 0,-75 C-14,-76 -24,-70 -27,-56 Z', v.hair || HAIR);
  }
  return { back, front };
}

/** Head-and-shoulders portrait for avatars. viewBox fits a circle crop. */
export function bust(v = {}) {
  const { back, front } = headParts(v);
  const robe = v.robe || C.n4;
  return `<svg class="art bust" viewBox="-62 -150 124 152" aria-hidden="true">
    ${back}
    ${P('M-46,4 C-46,-8 -32,-16 -10,-18 L10,-18 C32,-16 46,-8 46,4 Z', robe)}
    ${P('M-12,-17 L0,-2 L12,-17 Z', C.gold)}
    <g transform="translate(0 -16)">${front}</g>
  </svg>`;
}

/* ───────────── torso, arms, skirt ───────────── */

export function torsoPart({ robe = C.n4, collar = C.gold, sash = C.saffron, stars = true } = {}) {
  const body = 'M-14,0 L14,0 Q30,2 40,10 Q45,17 40,28 L30,92 L-30,92 L-40,28 Q-45,17 -40,10 Q-30,2 -14,0 Z';
  return `${P(body, robe)}
    <path d="M14,0 Q30,2 40,10 Q45,17 40,28 L30,92 L16,92 L26,26 Z" fill="#000" opacity=".12"/>
    ${P('M-41,13 L-30,7 L34,82 L27,92 Z', sash)}
    ${P('M-18,0 L0,26 L18,0 L10,0 L0,14 L-10,0 Z', collar)}
    ${stars ? tinyStar(-20, 44, 4.5) + tinyStar(18, 30, 3.6) + tinyStar(-10, 70, 3.2) : ''}
    ${P('M-32,82 L32,82 L32,94 L-32,94 Z', collar)}
    ${dot(0, 88, 3.4, C.n1)}`;
}

export function upperArmPart({ sleeve = C.n4 } = {}) {
  return `${P('M-10,-2 Q-12,26 -8,52 L8,52 Q12,26 10,-2 Q0,-8 -10,-2 Z', sleeve)}
    <path d="M3,-4 Q12,26 8,52 L3,52 Z" fill="#000" opacity=".12"/>${brad(0, 2)}`;
}

export function forearmPart({ skin = C.skin, prop = 'open', cuff = C.gold, mehendi = false } = {}) {
  let s = P('M-7,-2 L-6,44 L6,44 L7,-2 Z', skin);
  s += P('M-7.4,34 L7.4,34 L7.2,42 L-7.2,42 Z', cuff);
  s += P('M-7,43 Q-10,58 -4,66 Q0,70 4,66 Q10,58 7,43 Z', skin);
  s += P('M-6,47 Q-14,50 -13,57 Q-9,56 -6,53 Z', skin);
  if (mehendi) s += dot(0, 55, 2.6, C.coral).replace('/>', ' opacity=".7"/>');
  if (prop === 'scroll') {
    s += `<g transform="translate(0 56)">${P('M-26,-7 L26,-7 L26,7 L-26,7 Z', C.paper)}
      <path d="M-18,-2 H18 M-18,2.6 H12" stroke="${C.lilac}" stroke-width="1.4"/>
      ${P('M-31,-9 h8 v18 h-8 Z', C.gold)}${P('M23,-9 h8 v18 h-8 Z', C.gold)}</g>`;
  } else if (prop === 'orb') {
    s += `<g transform="translate(0 74)"><circle r="26" fill="url(#g-halo)"/>
      <ellipse rx="22" ry="6" transform="rotate(-18)" fill="none" stroke="${C.lilac}" stroke-width="2.4"/>
      ${dot(0, 1.6, 12, C.edge)}${dot(0, 0, 12, C.gold)}${dot(-4, -4, 3, '#fff3c4')}</g>`;
  } else if (prop === 'garland') {
    s += `<g transform="translate(0 58)"><path d="M0,0 C-10,24 10,40 26,30" fill="none" stroke="${C.saffron}" stroke-width="7" stroke-dasharray="0.1 7.4" stroke-linecap="round"/>
      <path d="M0,0 C-10,24 10,40 26,30" fill="none" stroke="${C.gold}" stroke-width="3.6" stroke-dasharray="0.1 7.4" stroke-linecap="round" stroke-dashoffset="3.7"/></g>`;
  }
  return s + brad(0, 0);
}

export function skirtPart({ main = C.n4, under = C.n5, hem = C.gold, panel = C.gold, shoes = C.saffron, stars = true } = {}) {
  const outer = 'M-30,0 L30,0 C42,40 74,92 84,122 C40,132 -40,132 -84,122 C-74,92 -42,40 -30,0 Z';
  const d = 'M-30,0 L30,0 C40,40 70,90 78,116 C40,126 -40,126 -78,116 C-70,90 -40,40 -30,0 Z';
  return `
    ${P('M-26,122 Q-36,122 -38,130 Q-28,135 -14,132 Z', shoes)}${P('M26,122 Q36,122 38,130 Q28,135 14,132 Z', shoes)}
    ${P(outer, under)}
    ${P(d, main)}
    <path d="M10,0 L30,0 C40,40 70,90 78,116 C64,120 50,122 36,123 Z" fill="#000" opacity=".14"/>
    ${P('M-8,4 L8,4 L16,120 L-16,120 Z', panel)}
    ${P('M-78,112 C-40,122 40,122 78,112 L78,118 C40,128 -40,128 -78,118 Z', hem)}
    ${stars ? tinyStar(-40, 70, 5) + tinyStar(42, 86, 4) + tinyStar(-56, 100, 3.4, C.mist) + tinyStar(30, 46, 3.4, C.mist) : ''}
    ${P('M-32,-4 L32,-4 L31,7 L-31,7 Z', hem)}`;
}

export function controllerPart() {
  return `
    <path d="M0,-6 L0,-38" stroke="url(#g-stick)" stroke-width="8" stroke-linecap="round"/>
    ${P(starPath(0, -46, 11, 5, 0.45), C.gold)}
    <rect x="-112" y="-4" width="224" height="11" rx="5.5" fill="${C.edge}"/>
    <rect x="-112" y="-6" width="224" height="11" rx="5.5" fill="url(#g-stick)"/>
    ${dot(0, -0.5, 7, C.gold)}${dot(-104, -0.5, 3, C.goldDeep)}${dot(104, -0.5, 3, C.goldDeep)}
    <path d="M-112,4 L-112,24 M112,4 L112,24" stroke="${C.thread}" stroke-width="1" opacity=".7"/>
    ${P(starPath(-112, 30, 7, 4, 0.34), C.gold)}${P(starPath(112, 30, 7, 4, 0.34), C.gold)}`;
}

/* ───────────── characters ───────────── */

export const COSTUMES = {
  jyotishi: {
    head: { headwear: 'kireetam', halo: true, chutti: true, moustache: true, mark: 'namam' },
    torso: { robe: C.n4, collar: C.gold, sash: C.saffron },
    upperArm: { sleeve: C.n4 },
    forearmL: { prop: 'orb' },
    forearmR: { prop: 'scroll' },
    skirt: { main: C.n4, under: C.n5, hem: C.gold, panel: C.gold },
  },
  groom: {
    head: { headwear: 'turban', turbanColor: C.saffron, moustache: true, mark: 'tilak', skin: '#d99260', shade: '#b8703f' },
    torso: { robe: '#f2dfb8', collar: C.gold, sash: C.coral, stars: false },
    upperArm: { sleeve: '#f2dfb8' },
    forearmL: { prop: 'open', skin: '#d99260' },
    forearmR: { prop: 'garland', skin: '#d99260' },
    skirt: { main: C.n4, under: C.n5, hem: C.gold, panel: C.saffron, shoes: C.gold },
  },
  bride: {
    head: { headwear: 'veil', veilColor: C.rose, nath: true, mark: 'bindi', lashes: true, skin: '#eaa877' },
    torso: { robe: C.coral, collar: C.gold, sash: C.rose, stars: false },
    upperArm: { sleeve: C.coral },
    forearmL: { prop: 'open', mehendi: true, skin: '#eaa877' },
    forearmR: { prop: 'garland', mehendi: true, skin: '#eaa877' },
    skirt: { main: C.coral, under: C.rose, hem: C.gold, panel: C.gold, shoes: C.gold },
  },
};
