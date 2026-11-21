# KarmicAstro

**Who pulls the strings of your destiny?**

KarmicAstro (placeholder name) is the landing page for a live astrology consultation app in the spirit of Astrotalk: chat, call or video with Vedic astrologers, plus free Kundli, Kundli Milan, daily Rashiphal and Panchang. The page plays like a short film. It is painted in **Madhubani (Mithila)** style and performed by **South Indian puppets**.

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
| Prologue | Hero stage | Curtains part and a Kathakali-crowned **Jyotishi marionette** drops in on its strings. Your cursor (or finger) is the puppeteer's controller. Click the puppet to make it dance and speak. |
| I · Rashiphal | Daily horoscope | Scrolling turns the Madhubani **Rashi Chakra**. The sign under the diya gets a palm-leaf reading built from the Moon's real transit today. |
| II · Navagraha | Nine planets | Graha cards hang from a rod and slide sideways as you scroll, swaying with scroll speed. Each shows where the graha is **right now** and whether it is vakri (retrograde). |
| III · Kundli | Free birth chart | North Indian diamond chart with all nine grahas, Lagna, Rashi, Nakshatra and Tithi. |
| IV · Jyotishi | Astrologers | Filterable astrologer cards hang on strings. Chat/Call open a demo consultation. |
| V · Milan | Matchmaking | Ashtakoota Guna Milan (36 gunas). Bride and groom puppets walk closer as the score rises and dance if it's auspicious. |
| VI · Panchang | Today | Tithi, Vaar, Nakshatra, Yoga, Karana, sunrise and sunset for 31 cities, tonight's real moon phase, and the next Ekadashi, Purnima and Amavasya. |
| VII · Seva | Services | Madhubani tiles for every product line. |
| VIII · Vani | Testimonials | Performed as **Tholu Bommalata** leather shadow puppets against a lamp-lit screen. |
| Finale | App | App preview, store buttons, and the curtain falls: *॥ शुभमस्तु ॥*. |

## Art direction

**Madhubani / Mithila painting (Bihar).** Every motif is hand-written SVG in `src/art/`: the fish pair (good fortune), Surya and Chandra faces, lotus, kalash, diya, peacock, parrot, tree of life, the Navagraha emblems and the twelve rashi roundels. They follow the tradition's grammar:
- the signature **double outline** (two ink lines with a paper gap)
- **kachni** hatching beside **bharni** solid fills
- no empty space
- the natural-pigment palette: lamp-black, sindoor red, turmeric, leaf green, indigo and kusum pink on handmade paper

Borders, frames and paper grain are generated as SVG tiles (`src/art/borders.js`) and used through CSS `border-image` and backgrounds.

**Puppetry.** *Kathputli* is strictly the Rajasthani string-puppet tradition. For the South Indian feel, the puppets draw on its southern cousins:
- **Bommalattam** (Tamil Nadu) and **Gombeyata** (Karnataka) string puppets
- **Kathakali/Yakshagana** costume cues: the tall *kireetam* crown, halo disc, the white *chutti* frill along the jaw, kohl-lined eyes and the Vaishnava *namam*
- **Tholu Bommalata** (Andhra Pradesh) for the translucent, perforated leather shadow puppets in Act VIII

The marionettes (`src/puppet/marionette.js`) are real physics. Verlet particles hang the head and hands from a kinematic wooden controller on rope constraints. The body swings as a pendulum, the skirt lags on a damped spring so it flares when the puppet twirls, the eyes follow you and blink, and "dances" are string flicks.

## The astrology is real

`src/astro/` is a small, dependency-free Jyotish engine:
- **ephemeris.js**: Sun, Moon (with the main perturbation terms), Mercury to Saturn (with Jupiter–Saturn perturbations) and the mean lunar nodes, after Paul Schlyter's method. It also provides Lahiri ayanamsa, the sidereal ascendant, and sunrise/sunset. Accuracy is roughly a few arcminutes for 1900–2100. Unit tests check it against J2000 reference positions and 2026 events (Diwali Amavasya on 8–9 Nov, Purnima on 24 Nov).
- **panchang.js**: tithi, nakshatra and pada, yoga, karana, moon illumination, and the birth chart with whole-sign houses.
- **matching.js**: Ashtakoota with Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi. Yoni and Vashya use a simplified three-level scale.
- **horoscope.js**: daily rashiphal driven by the Moon's gochar (transit house from each sign), with seeded variety per sign per day.

Everything runs in the browser. Birth details never leave the page.

## Tech

Vite (vanilla JS, no framework) · GSAP + ScrollTrigger for pins and scrubbing · Lenis smooth scroll · Web Audio for sound · self-hosted fonts (Rozha One, Yatra One, Mukta) with Devanagari support.

```
src/
  art/        Madhubani motifs, zodiac glyphs, border tiles, shared SVG patterns
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
