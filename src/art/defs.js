// Shared SVG <defs>: paper-depth shadows and the few gradients the art uses.
// Injected once; every inline SVG on the page can reference them.
export function installDefs() {
  if (document.getElementById('paper-defs')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'paper-defs';
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `<defs>
    <filter id="paper" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#04021a" flood-opacity="0.55"/>
    </filter>
    <filter id="paper-sm" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" flood-color="#04021a" flood-opacity="0.5"/>
    </filter>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="g-sun" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="#fff1c2"/><stop offset=".55" stop-color="#f6c65b"/><stop offset="1" stop-color="#ff8f4d"/>
    </radialGradient>
    <radialGradient id="g-corona" cx="50%" cy="50%" r="50%">
      <stop offset=".55" stop-color="#f6c65b" stop-opacity=".9"/><stop offset=".72" stop-color="#ff8f4d" stop-opacity=".35"/><stop offset="1" stop-color="#ff8f4d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-halo" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#ffe3a0" stop-opacity=".75"/><stop offset="1" stop-color="#ff8f4d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g-screen" cx="50%" cy="55%" r="70%">
      <stop offset="0" stop-color="#fff4da"/><stop offset=".45" stop-color="#ffc979"/><stop offset=".8" stop-color="#e2793a"/><stop offset="1" stop-color="#7a2f1a"/>
    </radialGradient>
    <linearGradient id="g-stick" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e9c98f"/><stop offset="1" stop-color="#b98a4e"/>
    </linearGradient>
  </defs>`;
  document.body.prepend(svg);
}
