// Act VII — services as papercut tiles.
import { icon } from '../art/cosmos.js';

export const SERVICES = [
  { title: 'Chat', text: 'Instant answers from verified Jyotishis, 24×7.', icon: 'chat', href: '#jyotishi', tag: 'First chat free' },
  { title: 'Call', text: 'Private voice calls in 12 Indian languages.', icon: 'call', href: '#jyotishi' },
  { title: 'Video', text: 'Face-to-face readings, from palmistry to tarot.', icon: 'video', href: '#jyotishi' },
  { title: 'Free Kundli', text: 'Birth chart with dasha, yogas and doshas.', icon: 'kundli', href: '#kundli' },
  { title: 'Kundli Milan', text: 'Ashtakoota matching and Manglik check.', icon: 'milan', href: '#milan' },
  { title: 'Rashiphal', text: 'Moon-transit forecasts for all 12 signs.', icon: 'horoscope', href: '#rashi' },
  { title: 'Puja & remedies', text: 'Live pujas, mantra jaap and daan in your name.', icon: 'puja', href: '#app' },
  { title: 'Astro Mall', text: 'Certified gemstones, rudraksha and yantras.', icon: 'mall', href: '#app' },
];

export function initSeva(ctx) {
  const { gsap, reduced } = ctx;
  const grid = document.querySelector('[data-seva-grid]');
  grid.innerHTML = SERVICES.map(
    (s) => `<a class="card seva" href="${s.href}">
      ${s.tag ? `<span class="tag">${s.tag}</span>` : ''}
      ${icon(s.icon, 'icon')}
      <h3>${s.title}</h3><p>${s.text}</p></a>`,
  ).join('');
  if (!reduced) {
    gsap.from(grid.children, {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 88%' },
    });
  }
}
