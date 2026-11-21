// Act VII — services as Madhubani tiles.
import { svgWrap, parrotGroup, peacockGroup, sunGroup, kalashGroup, fishPairGroup, moonGroup, diyaGroup, lotusGroup } from '../art/motifs.js';

export const SERVICES = [
  { title: 'Chat with Astrologer', text: 'Instant answers from verified Jyotishis, 24×7.', art: () => svgWrap('-70 -70 140 140', parrotGroup()), tint: '#cfe8d5', href: '#jyotishi', tag: '1st chat free' },
  { title: 'Talk on Call', text: 'Private voice calls in 12 Indian languages.', art: () => svgWrap('-110 -120 200 200', peacockGroup()), tint: '#d6def5', href: '#jyotishi' },
  { title: 'Video Consultation', text: 'Face-to-face readings, from palmistry to tarot.', art: () => svgWrap('-110 -110 220 220', sunGroup()), tint: '#fde3b0', href: '#jyotishi' },
  { title: 'Free Janam Kundli', text: 'Your birth chart with dasha, yogas and doshas.', art: () => svgWrap('-100 -112 200 214', kalashGroup()), tint: '#f9d3c4', href: '#kundli', tag: 'Free' },
  { title: 'Kundli Milan', text: 'Ashtakoota matching and Manglik check.', art: () => svgWrap('-110 -110 220 220', fishPairGroup()), tint: '#fde3ef', href: '#milan' },
  { title: 'Daily Rashiphal', text: 'Moon-transit forecasts for all 12 signs.', art: () => svgWrap('-100 -100 200 200', moonGroup()), tint: '#dfe3f6', href: '#rashi' },
  { title: 'Puja & Remedies', text: 'Book live pujas, mantra jaap and daan in your name.', art: () => svgWrap('-72 -90 150 136', diyaGroup()), tint: '#fde8c9', href: '#app' },
  { title: 'Astro Mall', text: 'Certified gemstones, rudraksha and yantras.', art: () => svgWrap('-100 -100 200 210', lotusGroup()), tint: '#f8d6e2', href: '#app' },
];

export function initSeva(ctx) {
  const { gsap, reduced } = ctx;
  const grid = document.querySelector('[data-seva-grid]');
  grid.innerHTML = SERVICES.map(
    (s) => `<a class="seva" href="${s.href}" style="--tint:${s.tint}">
      ${s.tag ? `<span class="tag">${s.tag}</span>` : ''}
      <span class="icon">${s.art()}</span>
      <h3>${s.title}</h3><p>${s.text}</p></a>`,
  ).join('');
  if (!reduced) {
    gsap.from(grid.children, {
      y: 60,
      rotation: (i) => (i % 2 ? 3 : -3),
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: grid, start: 'top 85%' },
    });
  }
}
