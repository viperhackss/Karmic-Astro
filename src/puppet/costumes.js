// Puppet costumes. Each part is drawn in its own local frame so the rig can
// rotate it about a joint:
//   head  — origin at the neck, face centred at (0,-52), up is -y
//   torso — origin at the neck, pelvis at (0,92)
//   upper arm — origin at the shoulder, elbow at (0,50)
//   forearm — origin at the elbow, wrist at (0,46), hand below
//   skirt — origin at the pelvis, hem near y=124
// The look borrows from South Indian string and leather puppetry
// (Bommalattam, Gombeyata, Tholu Bommalata): Kathakali/Yakshagana kireetam
// crowns, the white chutti frill along the jaw, a halo disc, kohl-lined eyes.
import { C } from '../art/palette.js';
import { triRing, dotRing, dbl } from '../art/motifs.js';

const S = (d, fill, sw = 2.2, extra = '') => `<path d="${d}" fill="${fill}" stroke="${C.ink}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
const O = (d, pattern, extra = '') => `<path d="${d}" fill="url(#${pattern})" ${extra}/>`;

/* ───────────── heads ───────────── */

function halo(cx = 0, cy = -66) {
  return `<g transform="translate(${cx} ${cy})">
    <circle r="68" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>
    ${triRing(30, 57, 67, C.yellow, C.orange, 1.3)}
    <circle r="57" fill="${C.green}" stroke="${C.ink}" stroke-width="2.6"/>
    ${dotRing(30, 51, 1.7, C.paper)}
    <circle r="45" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.2"/>
    <circle r="45" fill="url(#mb-hatch-red)"/>
  </g>`;
}

function eye(side, { lashes = false } = {}) {
  // side: 1 = viewer's left, -1 = viewer's right (mirrored)
  return `<g transform="scale(${side} 1)">
    <path d="M-21,-65 Q-12,-72 -3,-66" fill="none" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round"/>
    <g class="eye" data-side="${side}">
      <path d="M-21,-56 Q-12,-63.5 -3,-56 Q-12,-50 -21,-56 Z" fill="#fff8e8" stroke="${C.ink}" stroke-width="2.2"/>
      <path d="M-21,-56 Q-18,-54 -17,-55.5" fill="none" stroke="${C.red}" stroke-width="1.4" opacity=".7"/>
      <circle class="pupil" cx="-12" cy="-56.4" r="3.2" fill="${C.ink}"/>
      <circle class="pupil" cx="-13" cy="-57.6" r=".9" fill="#fff"/>
    </g>
    <path d="M-21,-56 L-28,-59.5" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>
    ${lashes ? `<path d="M-18,-60 l-2,-3.5 M-13,-61.8 l-.6,-3.8 M-8,-61.4 l.8,-3.6" stroke="${C.ink}" stroke-width="1.3" stroke-linecap="round"/>` : ''}
  </g>`;
}

function face({ skin = C.skin, chutti = false, moustache = false, beard = false, mark = 'namam', nath = false, lashes = false, glasses = false, beardColor = '#f3ecdf' } = {}) {
  let s = '';
  // ears & earrings
  s += S('M-26,-60 C-34,-60 -34,-44 -25,-44 Z', skin, 2);
  s += S('M26,-60 C34,-60 34,-44 25,-44 Z', skin, 2);
  s += `<circle cx="-27" cy="-40" r="5.4" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.8"/><circle cx="-27" cy="-32.5" r="3" fill="${C.red}" stroke="${C.ink}" stroke-width="1.2"/>`;
  s += `<circle cx="27" cy="-40" r="5.4" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.8"/><circle cx="27" cy="-32.5" r="3" fill="${C.red}" stroke="${C.ink}" stroke-width="1.2"/>`;
  // neck
  s += S('M-8,-24 L-8,2 L8,2 L8,-24 Z', skin, 2);
  // face
  s += `<ellipse cx="0" cy="-52" rx="26" ry="32" fill="${skin}" stroke="${C.ink}" stroke-width="2.6"/>`;
  s += `<ellipse cx="-15" cy="-40" rx="6" ry="4" fill="${C.red}" opacity=".18"/><ellipse cx="15" cy="-40" rx="6" ry="4" fill="${C.red}" opacity=".18"/>`;
  if (chutti) {
    const outer = 'M-29,-50 C-30,-20 -16,-8 0,-7 C16,-8 30,-20 29,-50';
    s += S(`${outer} C24,-30 14,-20 0,-19 C-14,-20 -24,-30 -29,-50 Z`, '#fbf6ea', 1.6);
    s += `<path d="${outer}" fill="none" stroke="#fbf6ea" stroke-width="6" stroke-dasharray="0.1 6.2" stroke-linecap="round"/>`;
    s += `<path d="M-24,-36 C-20,-22 -10,-15 0,-14 C10,-15 20,-22 24,-36" fill="none" stroke="${C.red}" stroke-width="1.4" stroke-dasharray="2 3"/>`;
  }
  if (beard) {
    s += S('M-25,-44 C-26,-16 -12,0 0,4 C12,0 26,-16 25,-44 C18,-30 10,-26 0,-26 C-10,-26 -18,-30 -25,-44 Z', beardColor, 2);
    s += O('M-25,-44 C-26,-16 -12,0 0,4 C12,0 26,-16 25,-44 C18,-30 10,-26 0,-26 C-10,-26 -18,-30 -25,-44 Z', 'mb-hatch-fine', 'opacity=".35"');
  }
  s += eye(1, { lashes }) + eye(-1, { lashes });
  if (glasses) {
    s += `<g fill="none" stroke="${C.ink}" stroke-width="1.8"><circle cx="-12" cy="-56" r="9"/><circle cx="12" cy="-56" r="9"/><path d="M-3,-57 Q0,-60 3,-57 M-21,-57 L-27,-60 M21,-57 L27,-60"/></g>`;
  }
  // nose & mouth
  s += `<path d="M-1,-54 Q-5,-43 -4.5,-40 Q0,-37.5 5,-40" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round"/>`;
  if (nath) {
    s += `<circle cx="7.5" cy="-38.5" r="5.6" fill="none" stroke="${C.yellow}" stroke-width="1.8"/><circle cx="7.5" cy="-33" r="1.6" fill="${C.red}"/>`;
    s += `<path d="M12,-41 Q20,-46 25,-55" fill="none" stroke="${C.yellow}" stroke-width="1.4" stroke-dasharray="0.1 2.6" stroke-linecap="round"/>`;
  }
  s += `<path class="mouth" d="M-7,-30.5 Q0,-33.5 7,-30.5 Q0,-24.5 -7,-30.5 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="1.3"/>`;
  if (moustache) {
    const m = 'M0,-35.5 C-8,-38.5 -16,-37 -20,-32 C-22,-28.5 -18.5,-26.5 -16.5,-29.5';
    s += `<path d="${m}" fill="none" stroke="${C.ink}" stroke-width="3.2" stroke-linecap="round"/>`;
    s += `<path d="${m}" transform="scale(-1 1)" fill="none" stroke="${C.ink}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
  // forehead marks
  if (mark === 'namam') {
    s += `<path d="M-6,-82 L-5,-69 Q0,-64 5,-69 L6,-82" fill="none" stroke="#fffaf0" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M0,-82 L0,-68" stroke="${C.red}" stroke-width="2.6" stroke-linecap="round"/>`;
  } else if (mark === 'tripundra') {
    s += `<path d="M-14,-78 Q0,-81 14,-78 M-15,-73.5 Q0,-76.5 15,-73.5 M-14,-69 Q0,-72 14,-69" fill="none" stroke="#fffaf0" stroke-width="2.2" stroke-linecap="round"/>`;
    s += `<circle cx="0" cy="-73.8" r="2.6" fill="${C.red}"/>`;
  } else if (mark === 'bindi') {
    s += `<circle cx="0" cy="-68" r="3" fill="${C.red}" stroke="${C.ink}" stroke-width=".8"/>`;
  } else if (mark === 'tilak') {
    s += `<path d="M0,-80 L0,-66" stroke="${C.red}" stroke-width="3.6" stroke-linecap="round"/>`;
  }
  return s;
}

function kireetam() {
  return `
    ${S('M-30,-78 C-46,-80 -50,-58 -36,-50 L-28,-58 Z', C.yellow)}${O('M-30,-78 C-46,-80 -50,-58 -36,-50 L-28,-58 Z', 'mb-hatch-red')}
    ${S('M30,-78 C46,-80 50,-58 36,-50 L28,-58 Z', C.yellow)}${O('M30,-78 C46,-80 50,-58 36,-50 L28,-58 Z', 'mb-hatch-red')}
    ${S('M-24,-84 L-17,-112 L-9,-118 L0,-146 L9,-118 L17,-112 L24,-84 Q0,-94 -24,-84 Z', C.yellow, 2.4)}
    ${O('M-24,-84 L-17,-112 L-9,-118 L0,-146 L9,-118 L17,-112 L24,-84 Q0,-94 -24,-84 Z', 'mb-scales', 'opacity=".45"')}
    ${dbl('M-20,-100 Q0,-106 20,-100', { w: 3.4, gap: 1.1 })}
    ${dbl('M-13,-116 Q0,-120 13,-116', { w: 3, gap: 1 })}
    <circle cx="0" cy="-104" r="6.5" fill="${C.red}" stroke="${C.ink}" stroke-width="2"/><circle cx="0" cy="-104" r="2.4" fill="${C.yellow}"/>
    <path d="M-12,-108 l3,-4 l3,4 l-3,4 Z M6,-108 l3,-4 l3,4 l-3,4 Z" fill="${C.green}" stroke="${C.ink}" stroke-width="1"/>
    <circle cx="0" cy="-150" r="5" fill="${C.red}" stroke="${C.ink}" stroke-width="1.8"/>
    <path d="M-3,-154 L0,-166 L3,-154 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.4"/>
    ${S('M-30,-74 Q0,-90 30,-74 L30,-82 Q0,-98 -30,-82 Z', C.yellow, 2.2)}
    <circle cx="-17" cy="-82.5" r="3" fill="${C.red}" stroke="${C.ink}" stroke-width="1"/>
    <circle cx="0" cy="-86.6" r="3.2" fill="${C.green}" stroke="${C.ink}" stroke-width="1"/>
    <circle cx="17" cy="-82.5" r="3" fill="${C.red}" stroke="${C.ink}" stroke-width="1"/>`;
}

function turban(color = C.red, stripe = 'mb-hatch-yellow', plume = true) {
  const d = 'M-29,-66 C-34,-98 -12,-112 0,-110 C14,-112 34,-98 29,-66 C18,-76 -18,-76 -29,-66 Z';
  return `${S(d, color, 2.4)}${O(d, stripe)}
    ${dbl('M-28,-74 C-16,-90 14,-98 28,-86', { w: 3.2, gap: 1 })}
    ${dbl('M-26,-88 C-12,-100 12,-104 24,-98', { w: 3, gap: 1 })}
    ${plume ? `${S('M4,-100 C8,-128 22,-138 26,-122 C20,-118 12,-110 9,-100 Z', '#fbf6ea', 1.8)}
    <circle cx="26" cy="-118" r="2.4" fill="${C.red}"/>` : ''}
    <circle cx="0" cy="-90" r="6.5" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1.8"/><circle cx="0" cy="-90" r="2.6" fill="${C.green}"/>
    <path d="M-4,-83 L0,-76 L4,-83" fill="none" stroke="${C.yellow}" stroke-width="1.6" stroke-dasharray="0.1 2.4" stroke-linecap="round"/>`;
}

function veilBack(color = C.red) {
  const d = 'M-34,-40 C-40,-104 -18,-124 0,-124 C18,-124 40,-104 34,-40 L48,16 L-48,16 Z';
  return `${S(d, color, 2.4)}${O(d, 'mb-scales-yellow', 'opacity=".55"')}
    <path d="${d}" fill="none" stroke="${C.yellow}" stroke-width="4" stroke-dasharray="7 3"/>`;
}

function veilFront(color = C.red) {
  return `
    ${S('M-26,-58 C-28,-86 28,-86 26,-58 C18,-72 -18,-72 -26,-58 Z', C.ink, 1.6)}
    <path d="M0,-84 L0,-70" stroke="${C.red}" stroke-width="2.6" stroke-linecap="round"/>
    ${S('M-31,-56 C-34,-100 34,-100 31,-56 C27,-90 -27,-90 -31,-56 Z', color, 2)}
    <path d="M-29,-58 C-31,-95 31,-95 29,-58" fill="none" stroke="${C.yellow}" stroke-width="2.4" stroke-dasharray="0.1 4" stroke-linecap="round"/>
    <path d="M0,-86 L0,-74" stroke="${C.yellow}" stroke-width="1.4"/>
    <circle cx="0" cy="-72" r="3.6" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1"/><circle cx="0" cy="-72" r="1.4" fill="${C.red}"/>`;
}

function bun(hair = C.ink) {
  return `<circle cx="0" cy="-86" r="13" fill="${hair}" stroke="${C.ink}" stroke-width="1.8"/>
    <path d="M-14,-90 A14,14 0 0 1 14,-90" fill="none" stroke="#fffaf0" stroke-width="4" stroke-dasharray="0.1 4.2" stroke-linecap="round"/>
    ${S('M-27,-54 C-31,-90 31,-90 27,-54 C20,-74 -20,-74 -27,-54 Z', hair, 1.6)}
    <path d="M0,-82 L0,-70" stroke="${C.red}" stroke-width="2" stroke-linecap="round"/>`;
}

function shikha(skin) {
  return `${S('M-26,-60 C-28,-86 28,-86 26,-60 C20,-78 -20,-78 -26,-60 Z', skin, 2)}
    <path d="M0,-83 C-2,-92 4,-98 8,-96 C4,-94 2,-90 3,-84" fill="${C.ink}" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/>`;
}

export function headParts(v = {}) {
  const skin = v.skin || C.skin;
  let back = '';
  let front = '';
  if (v.halo) back += halo();
  if (v.headwear === 'veil') back += veilBack(v.veilColor);
  front += face({ ...v, skin });
  switch (v.headwear) {
    case 'kireetam': front += kireetam(); break;
    case 'turban': front += turban(v.turbanColor, v.turbanStripe, v.plume !== false); break;
    case 'veil': front += veilFront(v.veilColor); break;
    case 'bun': front += bun(v.hair); break;
    case 'shikha': front += shikha(skin); break;
    default:
      // short hair
      front += S('M-27,-56 C-31,-92 31,-92 27,-56 C24,-70 14,-76 0,-75 C-14,-76 -24,-70 -27,-56 Z', v.hair || '#2a1a14', 1.8);
      break;
  }
  return { back, front };
}

/** A framed bust for avatars (astrologer cards, chat). viewBox -60 -170 120 180 */
export function bust(v = {}) {
  const { back, front } = headParts(v);
  const robe = v.robe || C.red;
  return `<svg class="mb bust" viewBox="-70 -168 140 178" aria-hidden="true">
    ${back}
    ${S('M-44,10 C-44,-6 -30,-14 -10,-16 L10,-16 C30,-14 44,-6 44,10 Z', robe, 2.4)}
    ${O('M-44,10 C-44,-6 -30,-14 -10,-16 L10,-16 C30,-14 44,-6 44,10 Z', 'mb-scales-paper', 'opacity=".5"')}
    <path d="M-18,-15 Q0,4 18,-15" fill="none" stroke="${C.yellow}" stroke-width="3.6"/>
    <path d="M-24,-13 Q0,12 24,-13" fill="none" stroke="#fffaf0" stroke-width="3" stroke-dasharray="0.1 5" stroke-linecap="round"/>
    <g transform="translate(0 -14)">${front}</g>
  </svg>`;
}

/* ───────────── torso, arms, skirt ───────────── */

export function torsoPart({ jacket = C.red, placket = C.yellow, sash = C.yellow, pattern = 'mb-scales-paper' } = {}) {
  const body = 'M-14,0 L14,0 Q30,2 40,10 Q45,17 40,28 L30,92 L-30,92 L-40,28 Q-45,17 -40,10 Q-30,2 -14,0 Z';
  let zig = '';
  for (let y = 10; y < 84; y += 8) zig += `<path d="M-7,${y} L0,${y + 4} L7,${y}" fill="none" stroke="${C.red}" stroke-width="1.6"/>`;
  return `
    ${S(body, jacket, 2.6)}${O(body, pattern, 'opacity=".45"')}
    ${S('M-7,4 L7,4 L7,88 L-7,88 Z', placket, 1.6)}${zig}
    ${S('M-41,13 L-30,7 L34,82 L27,92 Z', sash, 2)}${O('M-41,13 L-30,7 L34,82 L27,92 Z', 'mb-hatch-red')}
    <path d="M-22,5 Q0,30 22,5" fill="none" stroke="${C.ink}" stroke-width="5"/>
    <path d="M-22,5 Q0,30 22,5" fill="none" stroke="${C.yellow}" stroke-width="3"/>
    <path d="M-28,8 Q0,46 28,8" fill="none" stroke="#fffaf0" stroke-width="3.4" stroke-dasharray="0.1 5.4" stroke-linecap="round"/>
    <circle cx="0" cy="26" r="6.5" fill="${C.red}" stroke="${C.ink}" stroke-width="1.8"/><circle cx="0" cy="26" r="2.4" fill="${C.yellow}"/>
    ${S('M-32,82 L32,82 L32,95 L-32,95 Z', C.yellow, 2)}
    <circle cx="-18" cy="88.5" r="3" fill="${C.red}"/><circle cx="0" cy="88.5" r="3.4" fill="${C.green}" stroke="${C.ink}" stroke-width=".8"/><circle cx="18" cy="88.5" r="3" fill="${C.red}"/>`;
}

export function upperArmPart({ sleeve = C.red, band = C.yellow } = {}) {
  const d = 'M-10,-2 Q-12,26 -8,52 L8,52 Q12,26 10,-2 Q0,-8 -10,-2 Z';
  return `${S(d, sleeve, 2.2)}${O(d, 'mb-hatch-paper', 'opacity=".35"')}
    ${S('M-11,8 L11,8 L11,15 L-11,15 Z', band, 1.6)}<circle cx="0" cy="11.5" r="2" fill="${C.red}"/>`;
}

export function forearmPart({ skin = C.skin, prop = 'open', bangle = C.yellow, mehendi = false } = {}) {
  let s = S('M-7,-2 L-6,44 L6,44 L7,-2 Z', skin, 2);
  s += S('M-7.4,33 L7.4,33 L7.2,38 L-7.2,38 Z', bangle, 1.2);
  s += S('M-7.2,39.5 L7.2,39.5 L7,44 L-7,44 Z', C.red, 1.2);
  // mitten hand with thumb
  s += S('M-7,43 Q-10,58 -4,66 Q0,70 4,66 Q10,58 7,43 Z', skin, 2);
  s += S('M-6,47 Q-14,50 -13,57 Q-9,56 -6,53 Z', skin, 1.6);
  s += `<path d="M-2,58 L-2,66 M2,58 L2,66" stroke="${C.ink}" stroke-width="1"/>`;
  if (mehendi) s += `<circle cx="0" cy="54" r="3" fill="${C.red}" opacity=".8"/><circle cx="0" cy="54" r="5.5" fill="none" stroke="${C.red}" stroke-width=".9" stroke-dasharray="1 1.6" opacity=".8"/>`;
  if (prop === 'scroll') {
    s += `<g transform="translate(0 56)">
      ${S('M-26,-7 L26,-7 L26,7 L-26,7 Z', '#f3e2bd', 2)}
      <path d="M-18,-3 H18 M-18,1 H14 M-18,4.6 H16" stroke="${C.red}" stroke-width="1" opacity=".8"/>
      <ellipse cx="-27" cy="0" rx="4" ry="9" fill="${C.red}" stroke="${C.ink}" stroke-width="1.8"/>
      <ellipse cx="27" cy="0" rx="4" ry="9" fill="${C.red}" stroke="${C.ink}" stroke-width="1.8"/></g>`;
  } else if (prop === 'garland') {
    s += `<g transform="translate(0 58)"><path d="M0,0 C-10,24 10,40 26,30" fill="none" stroke="${C.orange}" stroke-width="7" stroke-dasharray="0.1 7.2" stroke-linecap="round"/>
      <path d="M0,0 C-10,24 10,40 26,30" fill="none" stroke="${C.yellow}" stroke-width="4" stroke-dasharray="0.1 7.2" stroke-linecap="round" stroke-dashoffset="3.6"/></g>`;
  } else if (prop === 'diya') {
    s += `<g transform="translate(0 62) scale(0.32)">
      <path d="M-56,6 C-48,36 48,36 56,6 C30,0 -30,0 -56,6 Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="5"/>
      <path class="hand-flame" d="M0,-2 C-12,-16 -10,-36 0,-56 C10,-36 12,-16 0,-2 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/></g>`;
  }
  return s;
}

export function skirtPart({ main = C.blue, pattern = 'mb-scales-paper', hem = C.red, hemDots = C.yellow, pleat = C.yellow, shoes = C.red } = {}) {
  const d = 'M-30,0 L30,0 C40,40 70,90 80,118 Q60,128 40,120 Q20,130 0,122 Q-20,130 -40,120 Q-60,128 -80,118 C-70,90 -40,40 -30,0 Z';
  const hemPath = 'M-78,112 Q-60,122 -40,114 Q-20,124 0,116 Q20,124 40,114 Q60,122 78,112';
  return `
    <g class="feet">
      ${S('M-24,122 Q-36,122 -38,130 Q-28,135 -14,132 Z', shoes, 1.8)}<circle cx="-30" cy="128" r="1.8" fill="${C.yellow}"/>
      ${S('M24,122 Q36,122 38,130 Q28,135 14,132 Z', shoes, 1.8)}<circle cx="30" cy="128" r="1.8" fill="${C.yellow}"/>
    </g>
    ${S(d, main, 2.6)}${O(d, pattern, 'opacity=".55"')}
    <path d="M-10,4 L-26,118 M10,4 L26,118 M-20,4 L-56,116 M20,4 L56,116" stroke="${pleat}" stroke-width="2" opacity=".9"/>
    <path d="${hemPath}" fill="none" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/>
    <path d="${hemPath}" fill="none" stroke="${hem}" stroke-width="9" stroke-linecap="round"/>
    <path d="${hemPath}" fill="none" stroke="${hemDots}" stroke-width="3.6" stroke-dasharray="0.1 7" stroke-linecap="round"/>
    ${S('M-32,-4 L32,-4 L31,7 L-31,7 Z', C.yellow, 2)}${O('M-32,-4 L32,-4 L31,7 L-31,7 Z', 'mb-hatch-red')}`;
}

export function controllerPart() {
  let rings = '';
  [-84, -48, 48, 84].forEach((x) => (rings += `<rect x="${x - 3}" y="-7.5" width="6" height="15" fill="${C.red}" stroke="${C.ink}" stroke-width="1.2"/>`));
  return `
    <rect x="-5" y="-42" width="10" height="36" rx="3" fill="url(#mb-wood)" stroke="${C.ink}" stroke-width="2"/>
    <circle cx="0" cy="-46" r="8" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2"/>
    <rect x="-112" y="-7" width="224" height="14" rx="7" fill="url(#mb-wood)" stroke="${C.ink}" stroke-width="2.2"/>
    ${rings}
    <circle cx="0" cy="0" r="11" fill="${C.red}" stroke="${C.ink}" stroke-width="2"/><circle cx="0" cy="0" r="4" fill="${C.yellow}"/>
    <g class="tassel"><path d="M-112,4 L-116,26 L-108,26 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="1.4"/><circle cx="-112" cy="28" r="3" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1"/></g>
    <g class="tassel"><path d="M112,4 L108,26 L116,26 Z" fill="${C.red}" stroke="${C.ink}" stroke-width="1.4"/><circle cx="112" cy="28" r="3" fill="${C.yellow}" stroke="${C.ink}" stroke-width="1"/></g>`;
}

/* ───────────── complete characters ───────────── */

export const COSTUMES = {
  jyotishi: {
    head: { headwear: 'kireetam', halo: true, chutti: true, moustache: true, mark: 'namam' },
    torso: { jacket: C.red, placket: C.yellow, sash: C.yellow },
    upperArm: { sleeve: C.red, band: C.yellow },
    forearmL: { prop: 'open', mehendi: true },
    forearmR: { prop: 'scroll' },
    skirt: { main: C.blue, hem: C.red, pleat: C.yellow },
  },
  groom: {
    head: { headwear: 'turban', turbanColor: C.red, moustache: true, mark: 'tilak', skin: '#d08143' },
    torso: { jacket: C.yellow, placket: C.red, sash: C.red, pattern: 'mb-hatch-red' },
    upperArm: { sleeve: C.yellow, band: C.red },
    forearmL: { prop: 'open', skin: '#d08143' },
    forearmR: { prop: 'garland', skin: '#d08143' },
    skirt: { main: C.red, pattern: 'mb-scales-yellow', hem: C.yellow, hemDots: C.red, pleat: C.yellow },
  },
  bride: {
    head: { headwear: 'veil', veilColor: C.red, nath: true, mark: 'bindi', lashes: true, skin: '#e0995a' },
    torso: { jacket: C.pink, placket: C.yellow, sash: C.red, pattern: 'mb-dots-yellow' },
    upperArm: { sleeve: C.pink, band: C.yellow },
    forearmL: { prop: 'open', mehendi: true, skin: '#e0995a' },
    forearmR: { prop: 'garland', mehendi: true, skin: '#e0995a' },
    skirt: { main: C.red, pattern: 'mb-scales-yellow', hem: C.green, hemDots: C.yellow, pleat: C.yellow, shoes: C.green },
  },
};
