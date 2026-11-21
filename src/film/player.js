// The film bar: the page plays like a video. Play auto-scrolls through every
// act at a steady pace (pinned acts scrub along with it), the track is a
// scrubber with chapter markers, and the timecode maps scroll to time.
const SPEED = 170; // px per second of "film"

const mmss = (s) => {
  s = Math.max(0, Math.round(s));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function initPlayer(ctx) {
  const { gsap, ScrollTrigger, lenis, sound } = ctx;
  const bar = document.querySelector('[data-filmbar]');
  const playBtn = bar.querySelector('[data-fb-play]');
  const soundBtn = bar.querySelector('[data-fb-sound]');
  const track = bar.querySelector('[data-fb-track]');
  const fill = bar.querySelector('[data-fb-fill]');
  const ticksEl = bar.querySelector('[data-fb-ticks]');
  const chapterEl = bar.querySelector('[data-fb-chapter]');
  const timeEl = bar.querySelector('[data-fb-time]');
  const sections = [...document.querySelectorAll('[data-chapter]')];

  let chapters = [];
  let max = 1;
  let playing = false;
  let pos = 0;

  const scrollY = () => (lenis ? lenis.scroll : window.scrollY);
  const scrollTo = (y, immediate = false) => {
    if (lenis) lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration: 1.2, force: true });
    else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
  };

  function measure() {
    max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    chapters = sections.map((s) => ({
      name: s.dataset.chapter,
      en: s.dataset.chapterEn,
      top: Math.min(max, Math.max(0, s.getBoundingClientRect().top + scrollY())),
    }));
    ticksEl.innerHTML = chapters
      .map((c, i) => `<button class="fb-tick" data-i="${i}" style="left:${(c.top / max) * 100}%" aria-label="Jump to ${c.name}: ${c.en}"><span>${c.name} · ${c.en}</span></button>`)
      .join('');
    update();
  }

  function update() {
    const y = scrollY();
    const p = Math.min(1, y / max);
    fill.style.width = `${p * 100}%`;
    track.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    let cur = chapters[0];
    for (const c of chapters) if (c.top <= y + window.innerHeight * 0.35) cur = c;
    if (cur && chapterEl.textContent !== cur.name) {
      chapterEl.textContent = cur.name;
      chapterEl.title = cur.en;
    }
    ticksEl.querySelectorAll('.fb-tick').forEach((t, i) => t.classList.toggle('done', chapters[i].top <= y + 2));
    timeEl.textContent = `${mmss(y / SPEED)} / ${mmss(max / SPEED)}`;
    track.setAttribute('aria-valuetext', `${cur?.name ?? ''}, ${mmss(y / SPEED)}`);
  }

  function setPlaying(v) {
    playing = v;
    playBtn.setAttribute('aria-pressed', String(v));
    playBtn.setAttribute('aria-label', v ? 'Pause the story' : 'Play the story');
    if (v) {
      pos = scrollY();
      if (pos >= max - 4) {
        pos = 0;
        scrollTo(0, true);
      }
    }
  }

  gsap.ticker.add((_, dtMs) => {
    if (!playing) return;
    pos = Math.min(max, pos + (SPEED * dtMs) / 1000);
    scrollTo(pos, true);
    if (pos >= max) setPlaying(false);
  });

  // Any manual scrolling pauses playback, like grabbing a film reel.
  const interrupt = () => playing && setPlaying(false);
  window.addEventListener('wheel', interrupt, { passive: true });
  window.addEventListener('touchstart', (e) => !bar.contains(e.target) && interrupt(), { passive: true });
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key) && !e.target.closest('input, select, textarea, button, [role="slider"], svg[tabindex]')) interrupt();
    if (e.key.toLowerCase() === 'k' && !e.target.closest('input, textarea, select')) setPlaying(!playing);
  });

  playBtn.addEventListener('click', () => setPlaying(!playing));
  soundBtn.addEventListener('click', () => {
    const on = sound.toggle();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', on ? 'Turn off tanpura music' : 'Turn on tanpura music');
  });

  // Scrubbing.
  const seek = (clientX) => {
    const r = track.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    pos = p * max;
    scrollTo(pos, true);
  };
  let scrubbing = false;
  track.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.fb-tick')) return;
    scrubbing = true;
    setPlaying(false);
    track.setPointerCapture(e.pointerId);
    seek(e.clientX);
  });
  track.addEventListener('pointermove', (e) => scrubbing && seek(e.clientX));
  track.addEventListener('pointerup', () => (scrubbing = false));
  track.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const y = scrollY();
    const next = step > 0 ? chapters.find((c) => c.top > y + 4) : [...chapters].reverse().find((c) => c.top < y - 4);
    if (next) scrollTo(next.top);
  });
  ticksEl.addEventListener('click', (e) => {
    const t = e.target.closest('.fb-tick');
    if (!t) return;
    setPlaying(false);
    scrollTo(chapters[Number(t.dataset.i)].top + 1);
  });

  if (lenis) lenis.on('scroll', update);
  else window.addEventListener('scroll', update, { passive: true });
  ScrollTrigger.addEventListener('refresh', measure);
  window.addEventListener('load', measure);
  measure();

  // Tuck the bar away while a dialog is open.
  const chat = document.querySelector('[data-chat]');
  new MutationObserver(() => bar.classList.toggle('tucked', chat.open)).observe(chat, { attributes: true, attributeFilter: ['open'] });

  return { play: () => setPlaying(true), pause: () => setPlaying(false) };
}
