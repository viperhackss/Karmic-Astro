// Shared SVG <defs>: the hatching (kachni) and filled (bharni) textures used
// across every Madhubani motif. Injected once; any inline SVG can reference them.
import { C } from './palette.js';

const lines = (id, color, size = 6, width = 1.1, angle = 45) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
    <line x1="0" y1="0" x2="0" y2="${size}" stroke="${color}" stroke-width="${width}"/>
  </pattern>`;

const dots = (id, color, size = 7, r = 1.1) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${color}"/>
  </pattern>`;

const scales = (id, color, w = 12, h = 8, sw = 1.2) => `
  <pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
    <path d="M0,0 A${w / 2},${h / 2} 0 0 0 ${w},0 M${-w / 2},${h / 2} A${w / 2},${h / 2} 0 0 0 ${w / 2},${h / 2} M${w / 2},${h / 2} A${w / 2},${h / 2} 0 0 0 ${w * 1.5},${h / 2}" fill="none" stroke="${color}" stroke-width="${sw}"/>
  </pattern>`;

const cross = (id, color, size = 7, width = 0.9) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <path d="M0,0 V${size} M0,0 H${size}" stroke="${color}" stroke-width="${width}"/>
  </pattern>`;

const zig = (id, color, w = 10, h = 6, sw = 1.2) => `
  <pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
    <path d="M0,${h * 0.75} L${w / 2},${h * 0.25} L${w},${h * 0.75}" fill="none" stroke="${color}" stroke-width="${sw}"/>
  </pattern>`;

export function installDefs() {
  if (document.getElementById('mb-defs')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'mb-defs';
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `<defs>
    ${lines('mb-hatch', C.ink)}
    ${lines('mb-hatch-fine', C.ink, 4, 0.8)}
    ${lines('mb-hatch-red', C.red, 5, 1.2)}
    ${lines('mb-hatch-paper', C.paper, 5, 1.2)}
    ${lines('mb-hatch-yellow', C.yellow, 5, 1.3, -45)}
    ${dots('mb-dots', C.ink)}
    ${dots('mb-dots-paper', C.paper, 7, 1.3)}
    ${dots('mb-dots-yellow', C.yellow, 8, 1.6)}
    ${dots('mb-dots-red', C.red, 7, 1.4)}
    ${scales('mb-scales', C.ink)}
    ${scales('mb-scales-paper', C.paper, 12, 8, 1.3)}
    ${scales('mb-scales-yellow', C.yellow, 14, 9, 1.6)}
    ${cross('mb-cross', C.ink)}
    ${cross('mb-cross-red', C.red, 6, 1)}
    ${zig('mb-zig', C.ink)}
    ${zig('mb-zig-yellow', C.yellow, 12, 7, 1.6)}
    <radialGradient id="mb-lamp" cx="50%" cy="60%" r="60%">
      <stop offset="0%" stop-color="#fff3c4"/>
      <stop offset="45%" stop-color="#ffc861"/>
      <stop offset="100%" stop-color="#c25b12" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mb-screen" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#fff1c9"/>
      <stop offset="55%" stop-color="#f3b35a"/>
      <stop offset="100%" stop-color="#8e3c0e"/>
    </radialGradient>
    <linearGradient id="mb-wood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a8733d"/>
      <stop offset="1" stop-color="#6d4220"/>
    </linearGradient>
    <filter id="mb-rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/>
    </filter>
  </defs>`;
  document.body.prepend(svg);
}
