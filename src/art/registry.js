// Fills every [data-art] placeholder with its papercut SVG.
import { C } from './palette.js';
import { wrap, moonGroup, orbitSystem, planet, icon, crescentPath, sheet, star } from './cosmos.js';

const ART = {
  logo: () => wrap('-50 -50 100 100', `${sheet(crescentPath(40, 22, -12), C.gold, { edge: 3 })}${star(16, -16, 13, C.paper)}`, { shadow: false }),
  moon: () => wrap('-100 -100 200 200', moonGroup(), { label: 'Crescent moon' }),
  orbits: () => orbitSystem(),
};

export function paintArt(root = document) {
  root.querySelectorAll('[data-art]').forEach((el) => {
    if (el.dataset.painted) return;
    const key = el.dataset.art;
    let html = '';
    if (ART[key]) html = ART[key]();
    else if (key.startsWith('icon-')) html = icon(key.slice(5));
    else if (key.startsWith('planet-')) html = planet(key.slice(7));
    if (html) {
      el.innerHTML = html;
      el.dataset.painted = '1';
    }
  });
}
