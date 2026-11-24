# KarmicAstro

**Who pulls the strings of your destiny?**

KarmicAstro (placeholder name) is the landing page for a live astrology consultation app: chat, call or video with Vedic astrologers, plus free Kundli, Kundli Milan, daily Rashiphal and Panchang. The page plays like a short film, staged as a **papercut puppet show among the stars**.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # astrology engine tests (node:test)
npm run build    # static site in dist/
```

## The show

The page is a theatre programme in ten acts. A **film bar** at the bottom lets visitors watch it like a video: ▶ auto-plays through every act, the scrubber seeks, chapter diamonds jump between acts, and the timecode maps scroll position to time. Press `K` to play or pause. Any manual scroll pauses playback. 🔊 turns on a synthesized **tanpura drone** with **ghungroo bells**.

| Act | Section | What happens |
|---|---|---|
| Prologue | Hero stage | Paper clouds sink away and a papercut **Jyotishi marionette** drops in on its strings. Your cursor (or finger) is the puppeteer's controller. Click the puppet to make it dance and speak. |
| I · Rashiphal | Daily horoscope | Scrolling turns a stacked-paper **zodiac wheel**. The sign under the gold star gets a reading built from the Moon's real transit today. |
| II · Navagraha | Nine planets | Papercut planet cards hang from a glowing rail and slide sideways as you scroll, swaying with scroll speed. Each shows where the graha is **right now** and whether it is vakri (retrograde). |
| III · Kundli | Free birth chart | North Indian diamond chart with all nine grahas, Lagna, Rashi, Nakshatra and Tithi. |
| IV · Jyotishi | Astrologers | Filterable astrologer cards hang on strings. Chat/Call open a demo consultation. |
| V · Milan | Matchmaking | Ashtakoota Guna Milan (36 gunas). Bride and groom puppets walk closer as the score rises and dance if it's auspicious. |
| VI · Panchang | Today | Tithi, Vaar, Nakshatra, Yoga, Karana, sunrise and sunset for 31 cities, tonight's real moon phase, and the next Ekadashi, Purnima and Amavasya. |
| VII · Seva | Services | Papercut icon tiles for every product line. |
| VIII · Vani | Testimonials | Told by papercut **shadow puppets** against a lamp-lit screen. |
| Finale | App | App preview, store buttons, and paper clouds rise to close the show: *॥ शुभमस्तु ॥*. |

## Art direction

**Papercut cosmos.** Every illustration is a flat sheet of coloured card: a crisp edge shadow for paper thickness and a soft drop shadow for depth. Night-paper layers (indigo to violet) are lit by gold, saffron and rose. It is all hand-written SVG in `src/art/cosmos.js`: planets, moon, sunburst, rolling cloud bands, paper stars and service icons.

- A fixed canvas **starfield** (`src/art/starfield.js`) runs behind the whole page. Three depth layers drift at different speeds as you scroll, stars twinkle, and shooting stars cross now and then.
- The hero opens with paper clouds sinking away layer by layer. Paper stars dangle on threads, orbits turn, and layered hills shift with the pointer.
- Type: Instrument Serif headlines, Manrope text, Tiro Devanagari Hindi for small Hindi accents.

**Puppetry.** The marionettes (`src/puppet/`) are papercut puppets joined by brass split-pins. They keep a quiet nod to South Indian string and leather puppetry: a tall kireetam crown, a sunburst halo and a jaw-band. They run on real physics: Verlet particles hang the head and hands from a kinematic controller on rope constraints. The body swings as a pendulum, the skirt lags on a spring and flares, the eyes follow you, and "dances" are string flicks. The testimonials are told by perforated papercut shadow puppets, after the Tholu Bommalata of Andhra Pradesh.

## The astrology is real

`src/astro/` is a small, dependency-free Jyotish engine:
- **ephemeris.js**: Sun, Moon (with the main perturbation terms), Mercury to Saturn (with Jupiter–Saturn perturbations) and the mean lunar nodes, after Paul Schlyter's method. It also provides Lahiri ayanamsa, the sidereal ascendant, and sunrise/sunset. Accuracy is roughly a few arcminutes for 1900–2100. Unit tests check it against J2000 reference positions and 2026 events (Diwali Amavasya on 8–9 Nov, Purnima on 24 Nov).
- **panchang.js**: tithi, nakshatra and pada, yoga, karana, moon illumination, and the birth chart with whole-sign houses.
- **matching.js**: Ashtakoota with Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi. Yoni and Vashya use a simplified three-level scale.
- **horoscope.js**: daily rashiphal driven by the Moon's gochar (transit house from each sign), with seeded variety per sign per day.

Everything runs in the browser. Birth details never leave the page.

## Tech

Vite (vanilla JS, no framework) · GSAP + ScrollTrigger for pins and scrubbing · Lenis smooth scroll · Canvas starfield · Web Audio for sound · self-hosted fonts (Instrument Serif, Manrope, Tiro Devanagari Hindi).

```
src/
  art/        papercut cosmos (planets, clouds, icons), zodiac glyphs, starfield, SVG defs
  puppet/     marionette rig (Verlet) and costume parts
  astro/      ephemeris, panchang, matching, horoscope, reference tables
  sections/   one module per act
  film/       the film-bar player
  audio/      tanpura + ghungroo synth
  styles/     base, hero, acts, ui
tests/        engine tests
```

Accessibility: semantic sections and headings, a skip link, keyboard puppetry (arrow keys and Enter on the stage), keyboard-reachable signs and chapter markers, `aria-live` updates, and `prefers-reduced-motion` support (no smooth scroll, calmer puppets, no decorative loops).

## Deploying

The build is a static site with relative asset paths, so `dist/` can be hosted anywhere. `.github/workflows/deploy.yml` tests, builds and deploys to **GitHub Pages** on every push to `main` (enable Pages → "GitHub Actions" in the repo settings first).

## Placeholders to replace before launch

- Brand name, logo and domain ("KarmicAstro")
- Astrologer profiles, ratings, prices and order counts (`src/sections/astrologers.js`)
- Headline stats (5,000+ astrologers, 2 Cr+ consultations, 4.8★)
- Testimonials (`src/sections/vani.js`)
- App Store / Google Play links
- The chat is a scripted demo; wire Chat/Call to the real consultation backend
