// Act I — a stacked-paper zodiac wheel turns as you scroll; the sign under the
// gold star gets today's rashiphal, driven by the Moon's real transit.
import { RASHIS } from '../astro/data.js';
import { dailyHoroscope } from '../astro/horoscope.js';
import { rashiDisc, rashiBadge, glyphIcon } from '../art/zodiac.js';
import { polar, sunGroup, starPath, crescentPath } from '../art/cosmos.js';
import { C } from '../art/palette.js';

const SWATCH = {
  Saffron: '#f4a300', 'Turmeric Yellow': '#f2b01e', 'Leaf Green': '#3bb273', 'Peacock Blue': '#1f8fbf',
  'Vermilion Red': '#e5432f', 'Ivory White': '#fbf6ea', Indigo: '#4b54c8', 'Rose Pink': '#ff7aa2',
  'Marigold Orange': '#ff8f4d', 'Silver Grey': '#c3c3d0',
};
const R = 232;
const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);

const ring = (r, fill, edge = 6) => `<circle r="${r}" cy="${edge}" fill="${C.edge}"/><circle r="${r}" fill="${fill}"/>`;

export function initRashi(ctx) {
  const { ScrollTrigger, lenis } = ctx;
  const section = document.getElementById('rashi');
  const wheel = section.querySelector('[data-wheel]');
  const body = section.querySelector('[data-horoscope-body]');
  const tabs = [...section.querySelectorAll('[data-day]')];
  const indexList = section.querySelector('[data-rashi-index]');

  let dots = '';
  for (let i = 0; i < 72; i++) {
    const [x, y] = polar(300, i * 5);
    dots += `<circle cx="${x}" cy="${y}" r="${i % 6 ? 1.6 : 3}" fill="${i % 6 ? C.mist : C.gold}" opacity="${i % 6 ? 0.4 : 0.9}"/>`;
  }
  let spokes = '';
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = polar(168, i * 30 + 15);
    const [x2, y2] = polar(282, i * 30 + 15);
    spokes += `<path d="M${x1},${y1} L${x2},${y2}" stroke="${C.lilac}" stroke-opacity=".22" stroke-width="1.5"/>`;
  }
  const signs = RASHIS.map((r, i) => {
    const [x, y] = polar(R, i * 30);
    return `<g class="r-sign" data-i="${i}" tabindex="0" role="button" aria-label="${r.en} (${r.sa})" transform="translate(${x} ${y})">
      <g class="r-inner"><circle class="r-focus" r="46" fill="none" stroke="transparent"/>
        <g class="r-disc" transform="translate(0 -8) scale(0.4)">${rashiDisc(r)}</g>
        <g class="r-disc-active" transform="translate(0 -8) scale(0.4)" opacity="0">${rashiDisc(r, { active: true })}</g>
        <text class="r-label" y="44" text-anchor="middle">${r.en.toUpperCase()}</text>
      </g></g>`;
  }).join('');

  wheel.innerHTML = `
    <circle r="330" fill="url(#g-halo)" opacity=".18"/>
    <g filter="url(#paper)">${ring(316, C.n3)}</g>
    ${dots}
    <g filter="url(#paper)">${ring(286, C.n2)}</g>
    <g class="ring">
      ${spokes}
      <g filter="url(#paper)">${ring(172, C.n3)}${ring(150, C.n1, 4)}</g>
      <g class="hub" filter="url(#paper)">
        <g class="hub-rays" transform="scale(1.32)">${sunGroup(12)}</g>
        <path d="${crescentPath(40, 22, -14)}" fill="${C.edge}" transform="translate(-6 5)"/>
        <path d="${crescentPath(40, 22, -14)}" fill="${C.paper}" transform="translate(-6 0)"/>
      </g>
      ${signs}
    </g>
    <g filter="url(#paper-sm)"><path d="${starPath(0, -316, 18, 4, 0.34)}" fill="${C.gold}"/></g>`;

  const ringEl = wheel.querySelector('.ring');
  const hub = wheel.querySelector('.hub');
  const signEls = [...wheel.querySelectorAll('.r-sign')];
  const inners = signEls.map((s) => s.querySelector('.r-inner'));
  const actives = signEls.map((s) => s.querySelector('.r-disc-active'));

  indexList.innerHTML = RASHIS.map((r, i) => `<li><button data-i="${i}">${glyphIcon(r.key)}${r.en}</button></li>`).join('');
  const indexBtns = [...indexList.querySelectorAll('button')];

  let active = -1;
  let day = 0;

  function render(i, offset = day) {
    const r = RASHIS[i];
    const head = `<div class="r-head">${rashiBadge(r)}<div><h3>${r.en}<span class="deva">${r.hi}</span></h3><p>${r.sa} · ${r.dates}</p></div></div>`;
    if (offset === 'weekly') {
      body.innerHTML = `${head}<p class="r-summary">Weekly and monthly forecasts, with Shani and Guru transits, festivals and muhurats, live in the KarmicAstro app.</p><a class="btn btn-primary" href="#app">Get the app</a>`;
      return;
    }
    const h = dailyHoroscope(i, new Date(), offset);
    body.innerHTML = `${head}
      <p class="transit">☾ Moon in ${h.moonRashi.sa}, ${h.moonNakshatra} · ${ordinal(h.house)} house from you</p>
      <p class="r-summary">${h.summary}</p>
      <div class="areas">
        <div class="area"><b>Love</b><p>${h.love}</p><div class="meter"><i style="--v:${h.meters.love}%"></i></div></div>
        <div class="area"><b>Career</b><p>${h.career}</p><div class="meter"><i style="--v:${h.meters.career}%"></i></div></div>
        <div class="area"><b>Health</b><p>${h.health}</p><div class="meter"><i style="--v:${h.meters.health}%"></i></div></div>
      </div>
      <div class="lucky"><span><i class="swatch" style="background:${SWATCH[h.luckyColor] || C.gold}"></i>${h.luckyColor}</span><span>Lucky number ${h.luckyNumber}</span><span>${h.luckyTime}</span></div>
      <a class="text-link" href="#jyotishi">Ask a Jyotishi about your ${r.en} day →</a>`;
    body.classList.remove('flip');
    void body.offsetWidth;
    body.classList.add('flip');
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    signEls.forEach((s, k) => s.classList.toggle('active', k === i));
    indexBtns.forEach((b, k) => b.classList.toggle('active', k === i));
    render(i);
  }

  function rotateTo(f) {
    const theta = f * 30;
    ringEl.setAttribute('transform', `rotate(${-theta})`);
    hub.setAttribute('transform', `rotate(${theta})`);
    inners.forEach((inner, k) => {
      const d = Math.abs(((k - f + 18) % 12) - 6);
      const near = Math.max(0, 1 - d);
      inner.setAttribute('transform', `rotate(${theta}) scale(${(1 + near * 0.28).toFixed(3)})`);
      actives[k].setAttribute('opacity', near.toFixed(2));
    });
    setActive(((Math.round(f) % 12) + 12) % 12);
  }

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
    pin: true,
    anticipatePin: 1,
    onUpdate(self) {
      const f = self.progress * 11;
      const i = Math.floor(f);
      const frac = f - i;
      rotateTo(i + smoother(Math.min(1, Math.max(0, (frac - 0.25) / 0.5))));
    },
  });
  rotateTo(0);

  const goTo = (i) => {
    const y = st.start + ((st.end - st.start) * i) / 11 + 2;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  signEls.forEach((s, i) => {
    s.addEventListener('click', () => goTo(i));
    s.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goTo(i);
      }
    });
  });
  indexBtns.forEach((b, i) => b.addEventListener('click', () => goTo(i)));
  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-selected', String(x === t)));
      day = t.dataset.day === 'weekly' ? 'weekly' : Number(t.dataset.day);
      render(active, day);
    }),
  );
  return { st };
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
