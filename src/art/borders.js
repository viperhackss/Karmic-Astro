// Generates the Madhubani border tiles and paper textures as CSS custom
// properties, so stylesheets can use them as backgrounds and border-images.
import { C } from './palette.js';

const uri = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' '))}")`;
const svg = (w, h, body) => `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`;

/** Horizontal ribbon: double lines + alternating saw-tooth triangles. */
function triStrip(a = C.red, b = C.yellow, bg = C.paper) {
  const w = 28;
  const h = 26;
  return svg(w, h, `
    <rect width='${w}' height='${h}' fill='${bg}'/>
    <rect y='0' width='${w}' height='3' fill='${C.ink}'/>
    <rect y='5' width='${w}' height='1.6' fill='${C.ink}'/>
    <path d='M0,20 L7,8 L14,20 Z' fill='${a}' stroke='${C.ink}' stroke-width='1.3' stroke-linejoin='round'/>
    <path d='M14,20 L21,8 L28,20 Z' fill='${b}' stroke='${C.ink}' stroke-width='1.3' stroke-linejoin='round'/>
    <path d='M7,8 L14,20 L21,8 Z' fill='url(#h)'/>
    <defs><pattern id='h' width='4' height='4' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><line x1='0' y1='0' x2='0' y2='4' stroke='${C.ink}' stroke-width='0.9'/></pattern></defs>
    <rect y='20.4' width='${w}' height='1.6' fill='${C.ink}'/>
    <rect y='23' width='${w}' height='3' fill='${C.ink}'/>`);
}

/** Vertical ribbon for curtain hems: stacked triangles between double lines. */
function vStrip() {
  return svg(20, 24, `
    <rect width='20' height='24' fill='${C.yellow}'/>
    <path d='M4,0 L16,6 L4,12 Z' fill='${C.red}' stroke='${C.ink}' stroke-width='1.1' stroke-linejoin='round'/>
    <path d='M4,12 L16,18 L4,24 Z' fill='${C.green}' stroke='${C.ink}' stroke-width='1.1' stroke-linejoin='round'/>
    <rect x='0' width='2.6' height='24' fill='${C.ink}'/><rect x='17.4' width='2.6' height='24' fill='${C.ink}'/>`);
}

/** Vine ribbon with alternating leaves. */
function leafStrip(bg = C.paper) {
  const w = 60;
  const h = 34;
  return svg(w, h, `
    <rect width='${w}' height='${h}' fill='${bg}'/>
    <rect width='${w}' height='2.6' fill='${C.ink}'/><rect y='4.4' width='${w}' height='1.2' fill='${C.ink}'/>
    <rect y='${h - 2.6}' width='${w}' height='2.6' fill='${C.ink}'/><rect y='${h - 5.6}' width='${w}' height='1.2' fill='${C.ink}'/>
    <path d='M0,17 C15,7 15,7 30,17 C45,27 45,27 60,17' fill='none' stroke='${C.ink}' stroke-width='2.4'/>
    <path d='M15,11 C10,4 18,2 22,7 C20,11 18,12 15,11 Z' fill='${C.green}' stroke='${C.ink}' stroke-width='1.3'/>
    <path d='M45,23 C50,30 42,32 38,27 C40,23 42,22 45,23 Z' fill='${C.red}' stroke='${C.ink}' stroke-width='1.3'/>
    <circle cx='30' cy='17' r='3.4' fill='${C.yellow}' stroke='${C.ink}' stroke-width='1.2'/>
    <circle cx='0' cy='17' r='3.4' fill='${C.yellow}' stroke='${C.ink}' stroke-width='1.2'/>
    <circle cx='60' cy='17' r='3.4' fill='${C.yellow}' stroke='${C.ink}' stroke-width='1.2'/>
    <circle cx='8' cy='25' r='1.6' fill='${C.ink}'/><circle cx='52' cy='9' r='1.6' fill='${C.ink}'/>`);
}

/** Fish-scale ribbon. */
function scaleStrip(fill = C.blue, line = C.paper) {
  const w = 16;
  const h = 18;
  return svg(w, h, `
    <rect width='${w}' height='${h}' fill='${fill}'/>
    <path d='M0,2 A8,6 0 0 0 16,2 M-8,8 A8,6 0 0 0 8,8 M8,8 A8,6 0 0 0 24,8 M0,14 A8,6 0 0 0 16,14' fill='none' stroke='${line}' stroke-width='1.4'/>
    <rect width='${w}' height='2' fill='${C.ink}'/><rect y='${h - 2}' width='${w}' height='2' fill='${C.ink}'/>`);
}

/**
 * Square frame for CSS border-image (slice 34). Corners hold a lotus-like
 * flower; edges tile triangles between double lines.
 */
function frame(bg = C.paper, a = C.red, b = C.yellow, corner = C.red) {
  const S = 102; // 34 corner + 34 edge + 34 corner
  const k = 34;
  let tris = '';
  for (let x = k; x < S - k; x += 8.5) {
    // top & bottom
    tris += `<path d='M${x},26 L${x + 4.25},12 L${x + 8.5},26 Z' fill='${(x / 8.5) % 2 ? a : b}' stroke='${C.ink}' stroke-width='1.1'/>`;
    tris += `<path d='M${x},${S - 26} L${x + 4.25},${S - 12} L${x + 8.5},${S - 26} Z' fill='${(x / 8.5) % 2 ? a : b}' stroke='${C.ink}' stroke-width='1.1'/>`;
    // left & right
    tris += `<path d='M26,${x} L12,${x + 4.25} L26,${x + 8.5} Z' fill='${(x / 8.5) % 2 ? a : b}' stroke='${C.ink}' stroke-width='1.1'/>`;
    tris += `<path d='M${S - 26},${x} L${S - 12},${x + 4.25} L${S - 26},${x + 8.5} Z' fill='${(x / 8.5) % 2 ? a : b}' stroke='${C.ink}' stroke-width='1.1'/>`;
  }
  const lines = (o, t) => `
    <rect x='${k}' y='${o}' width='${S - 2 * k}' height='${t}' fill='${C.ink}'/>
    <rect x='${k}' y='${S - o - t}' width='${S - 2 * k}' height='${t}' fill='${C.ink}'/>
    <rect x='${o}' y='${k}' width='${t}' height='${S - 2 * k}' fill='${C.ink}'/>
    <rect x='${S - o - t}' y='${k}' width='${t}' height='${S - 2 * k}' fill='${C.ink}'/>`;
  const corners = [[17, 17], [S - 17, 17], [17, S - 17], [S - 17, S - 17]]
    .map(([cx, cy]) => {
      let petals = '';
      for (let i = 0; i < 8; i++) petals += `<ellipse cx='0' cy='-7' rx='3.2' ry='6' transform='rotate(${i * 45})' fill='${i % 2 ? b : C.paper}' stroke='${C.ink}' stroke-width='1'/>`;
      return `<g transform='translate(${cx} ${cy})'>
        <rect x='-16' y='-16' width='32' height='32' fill='${corner}' stroke='${C.ink}' stroke-width='2.4'/>
        <rect x='-12.5' y='-12.5' width='25' height='25' fill='none' stroke='${C.ink}' stroke-width='1'/>
        ${petals}<circle r='3.4' fill='${C.yellow}' stroke='${C.ink}' stroke-width='1'/></g>`;
    })
    .join('');
  return svg(S, S, `
    <rect width='${S}' height='${S}' fill='${bg}'/>
    ${lines(1, 3)}${lines(7, 1.4)}${lines(26, 1.4)}${lines(29.6, 3)}
    ${tris}${corners}`);
}

/** Handmade-paper grain. */
function paperGrain() {
  return svg(240, 240, `
    <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0 0.08  0 0 0 0.10 0'/></filter>
    <rect width='240' height='240' filter='url(#n)'/>`);
}

/** Night sky strewn with little Madhubani flower-stars. */
function starField() {
  const star = (x, y, r, c) => {
    let p = '';
    for (let i = 0; i < 8; i++) p += `<ellipse cx='0' cy='${-r * 0.55}' rx='${r * 0.24}' ry='${r * 0.45}' transform='rotate(${i * 45})' fill='${c}'/>`;
    return `<g transform='translate(${x} ${y})' opacity='0.85'>${p}<circle r='${r * 0.2}' fill='${C.red}'/></g>`;
  };
  return svg(320, 320, `
    ${star(40, 52, 9, C.yellow)}${star(210, 30, 6, C.paper)}${star(282, 150, 10, C.yellow)}
    ${star(120, 170, 6, C.paper)}${star(60, 268, 8, C.paper)}${star(238, 262, 6, C.yellow)}
    <g fill='${C.paper}' opacity='0.55'>
      <circle cx='150' cy='80' r='1.4'/><circle cx='18' cy='150' r='1.2'/><circle cx='300' cy='40' r='1.1'/>
      <circle cx='180' cy='230' r='1.3'/><circle cx='100' cy='110' r='1'/><circle cx='260' cy='200' r='1'/>
      <circle cx='20' cy='310' r='1.2'/><circle cx='310' cy='300' r='1.4'/></g>`);
}

export function installBorders() {
  const root = document.documentElement.style;
  root.setProperty('--mb-strip-tri', uri(triStrip()));
  root.setProperty('--mb-strip-tri-dark', uri(triStrip(C.red, C.yellow, C.indigo)));
  root.setProperty('--mb-strip-leaf', uri(leafStrip()));
  root.setProperty('--mb-strip-v', uri(vStrip()));
  root.setProperty('--mb-strip-scales', uri(scaleStrip()));
  root.setProperty('--mb-strip-scales-red', uri(scaleStrip(C.red, C.yellow)));
  root.setProperty('--mb-frame', uri(frame()));
  root.setProperty('--mb-frame-green', uri(frame(C.paper, C.green, C.yellow, C.green)));
  root.setProperty('--mb-frame-blue', uri(frame(C.paper, C.blue, C.yellow, C.blue)));
  root.setProperty('--mb-paper', uri(paperGrain()));
  root.setProperty('--mb-stars', uri(starField()));
}
