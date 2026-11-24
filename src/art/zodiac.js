// Rashi glyphs as gold paper cut-outs on small night-paper discs.
import { C } from './palette.js';

export const GLYPHS = {
  aries: 'M4,10 C3,5 7,3 9,5 C11,7 12,10 12,20 M20,10 C21,5 17,3 15,5 C13,7 12,10 12,20',
  taurus: 'M5,4 C6,9 9,10 12,10 C15,10 18,9 19,4 M12,10 A5,5 0 1 0 12.01,10',
  gemini: 'M5,4 Q12,7 19,4 M5,20 Q12,17 19,20 M9,5.4 V18.6 M15,5.4 V18.6',
  cancer: 'M7,6.4 C11,4.5 16,4.5 20,7.5 M17,17.6 C13,19.5 8,19.5 4,16.5 M9.6,9 A2.6,2.6 0 1 1 9.59,8.9 M19.6,15 A2.6,2.6 0 1 1 19.59,14.9',
  leo: 'M10,14 A3,3 0 1 1 9.99,13.9 M10,13 C10,8 9,5 13,4 C17,3 18,7 16,10 C14,13 13,16 15,19 C16,20.5 18,20.5 19,19',
  virgo: 'M3,6 C5,5 6,6 6,8 V18 M6,8 C6,5 10,5 10,8 V18 M10,8 C10,5 14,5 14,8 V16 C14,20 18,20 19,16 C20,12 17,11 15,14',
  libra: 'M4,19 H20 M4,15 H8 C7,9 17,9 16,15 H20',
  scorpio: 'M3,6 C5,5 6,6 6,8 V18 M6,8 C6,5 10,5 10,8 V18 M10,8 C10,5 14,5 14,8 V17 C14,19 16,20 19,19 M17,16.5 L19.5,19 L17,21.5',
  sagittarius: 'M5,19 L19,5 M12,5 H19 V12 M7,10 L14,17',
  capricorn: 'M3,6 L6,16 L9,6 C10,4 12,5 12,9 V15 C12,19 18,20 18,16 C18,13 14,12 13,15 C12,18 9,20 7,21',
  aquarius: 'M3,10 L7,7 L11,10 L15,7 L19,10 L21,8.5 M3,16 L7,13 L11,16 L15,13 L19,16 L21,14.5',
  pisces: 'M6,3 C11,8 11,16 6,21 M18,3 C13,8 13,16 18,21 M5,12 H19',
};

export function glyphGroup(key, { scale = 4, color = C.gold, width = 2.2 } = {}) {
  return `<g transform="scale(${scale}) translate(-12 -12)"><path d="${GLYPHS[key]}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

export const glyphIcon = (key, cls = '', color = 'currentColor') =>
  `<svg class="art ${cls}" viewBox="-14 -14 28 28" aria-hidden="true">${glyphGroup(key, { scale: 1, color, width: 2.4 })}</svg>`;

/** Small paper disc with a cut glyph, centred on (0,0), radius ~100. */
export function rashiDisc(rashi, { active = false } = {}) {
  return `<circle r="96" cy="8" fill="${C.edge}"/>
    <circle r="96" fill="${active ? C.gold : C.n2}"/>
    <circle r="80" fill="none" stroke="${active ? C.goldDeep : C.n4}" stroke-width="3"/>
    ${glyphGroup(rashi.key, { scale: 4.4, color: active ? C.n1 : C.gold, width: 2.1 })}`;
}

export const rashiBadge = (rashi, cls = '') =>
  `<svg class="art ${cls}" viewBox="-104 -104 208 216" aria-hidden="true"><g filter="url(#paper-sm)">${rashiDisc(rashi, { active: true })}</g></svg>`;
