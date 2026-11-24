// Act IV — astrologer cards hang on strings like puppets; Chat opens a demo
// consultation. All names and numbers are illustrative placeholders.
import { bust } from '../puppet/costumes.js';
import { C } from '../art/palette.js';

export const ASTROLOGERS = [
  { name: 'Acharya Raghav Shastri', skills: 'Vedic · KP · Prashna', langs: 'Hindi, English, Sanskrit', exp: 18, rating: 4.9, orders: '21k', price: 32, was: 45, tags: ['vedic', 'career', 'marriage'], hue: C.n5, status: 'online', badge: 'Top choice',
    look: { headwear: 'shikha', mark: 'tripundra', beard: true, robe: C.saffron } },
  { name: 'Meera Iyer', skills: 'Tarot · Love · Angel cards', langs: 'English, Tamil', exp: 9, rating: 4.8, orders: '12k', price: 25, was: 30, tags: ['tarot', 'love'], hue: C.rose, status: 'online',
    look: { headwear: 'bun', mark: 'bindi', lashes: true, skin: '#c98a55', robe: C.n4 } },
  { name: 'Pt. Devdutt Mishra', skills: 'Vedic · Vastu · Muhurat', langs: 'Hindi, Maithili, Bhojpuri', exp: 22, rating: 4.9, orders: '30k', price: 40, was: 52, tags: ['vedic', 'vastu', 'marriage'], hue: C.teal, status: 'busy',
    look: { headwear: 'turban', turbanColor: C.saffron, plume: false, mark: 'tilak', moustache: true, robe: C.n4 } },
  { name: 'Lakshmi Narayanan', skills: 'Numerology · Nadi astrology', langs: 'Tamil, Telugu, English', exp: 14, rating: 4.7, orders: '9k', price: 28, was: 35, tags: ['numerology', 'career'], hue: C.gold, status: 'online',
    look: { headwear: 'bun', mark: 'namam', skin: '#b8743f', shade: '#94572b', nath: true, robe: C.coral } },
  { name: 'Harpreet Kaur', skills: 'Palmistry · Face reading', langs: 'Punjabi, Hindi, English', exp: 11, rating: 4.8, orders: '7k', price: 22, was: 28, tags: ['love', 'career'], hue: C.lilac, status: 'online',
    look: { headwear: 'veil', veilColor: C.saffron, mark: 'none', lashes: true, skin: '#e3a676', robe: C.n4 } },
  { name: 'Anirban Sen', skills: 'KP · Career · Finance', langs: 'Bengali, English, Hindi', exp: 16, rating: 4.8, orders: '15k', price: 30, was: 38, tags: ['career', 'vedic'], hue: C.sky, status: 'online',
    look: { headwear: 'none', mark: 'tilak', glasses: true, moustache: true, robe: C.n3 } },
  { name: 'Sushila Hegde', skills: 'Prashna · Remedies', langs: 'Kannada, Konkani, Hindi', exp: 20, rating: 4.9, orders: '18k', price: 35, was: 42, tags: ['vedic', 'marriage', 'love'], hue: C.saffron, status: 'busy',
    look: { headwear: 'kireetam', mark: 'bindi', chutti: true, skin: '#d08a52', robe: C.n4 } },
  { name: 'Rohan Kapoor', skills: 'Vedic · Vastu for business', langs: 'English, Hindi', exp: 7, rating: 4.6, orders: '4k', price: 18, was: 24, tags: ['vastu', 'career', 'numerology'], hue: C.coral, status: 'online', badge: 'Rising star',
    look: { headwear: 'none', mark: 'none', beard: true, beardColor: '#2a1f3d', skin: '#d99a62', robe: C.n3 } },
];

const REPLIES = [
  [/career|job|work|promotion|business/i, 'Your 10th house lord and the current dasha decide timing for career. From what you share, the coming Guru transit looks supportive. Keep Thursdays disciplined and avoid signing in Rahu kaal.'],
  [/love|relationship|partner|crush|marri|wedding/i, 'For love and marriage I look at Shukra, the 7th house and the Navamsa chart. Share your partner’s birth details too and we can do a full Kundli Milan.'],
  [/money|finance|loan|invest|wealth/i, 'Wealth comes from the 2nd and 11th houses. Avoid big investments while the Moon transits your 8th house, and donate on Saturdays for Shani’s blessings.'],
  [/health|sleep|stress|anxi/i, 'For health, please consult a doctor first. Astrologically, a strong Moon brings calm. Try pranayama at sunrise and keep Mondays light.'],
];

export function initAstrologers(ctx) {
  const { sound } = ctx;
  const grid = document.querySelector('[data-astro-grid]');
  const filters = [...document.querySelectorAll('[data-filter]')];

  grid.innerHTML = ASTROLOGERS.map((a, i) => `
    <article class="card astro-card" style="--hue:${a.hue}" data-tags="${a.tags.join(' ')}">
      <div class="astro-top">
        <div class="avatar">${bust(a.look)}</div>
        <div>
          <h3>${a.name}</h3>
          <span class="status ${a.status === 'busy' ? 'busy' : ''}">${a.status === 'busy' ? 'In a session · ~4 min' : 'Online now'}</span>
        </div>
        ${a.badge ? `<span class="badge">${a.badge}</span>` : ''}
      </div>
      <p class="astro-skills">${a.skills}</p>
      <p class="astro-meta">${a.langs} · ${a.exp} yrs experience</p>
      <div class="astro-rate">
        <span class="rating" aria-label="Rated ${a.rating} out of 5"><i>★</i> ${a.rating} <small>(${a.orders})</small></span>
        <span class="price"><s>₹${a.was}</s>₹${a.price}/min</span>
      </div>
      <div class="astro-actions">
        <button class="btn btn-primary" data-chat-open="${i}">Chat</button>
        <button class="btn btn-ghost" data-call-open="${i}">Call</button>
      </div>
    </article>`).join('');

  const cards = [...grid.querySelectorAll('.astro-card')];
  filters.forEach((f) =>
    f.addEventListener('click', () => {
      filters.forEach((x) => x.classList.toggle('active', x === f));
      const tag = f.dataset.filter;
      cards.forEach((c) => c.classList.toggle('hide', tag !== 'all' && !c.dataset.tags.includes(tag)));
      ctx.ScrollTrigger.refresh();
    }),
  );

  // ── Chat demo ──
  const dlg = document.querySelector('[data-chat]');
  const log = dlg.querySelector('[data-chat-log]');
  const form = dlg.querySelector('[data-chat-form]');
  let current = null;
  let timers = [];

  const add = (who, text) => {
    const m = document.createElement('div');
    m.className = `msg ${who}`;
    m.textContent = text;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  };
  const typing = (then, delay = 1300) => {
    const t = document.createElement('div');
    t.className = 'msg them typing';
    t.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(t);
    log.scrollTop = log.scrollHeight;
    timers.push(
      setTimeout(() => {
        t.remove();
        then();
      }, delay),
    );
  };

  function open(i, mode = 'chat') {
    current = ASTROLOGERS[i];
    timers.forEach(clearTimeout);
    timers = [];
    dlg.querySelector('[data-chat-avatar]').innerHTML = bust(current.look);
    dlg.querySelector('[data-chat-avatar]').style.background = current.hue;
    dlg.querySelector('[data-chat-name]').textContent = current.name;
    dlg.querySelector('[data-chat-price]').textContent = `₹${current.price}/min · first 5 min free`;
    log.innerHTML = '';
    dlg.showModal();
    ctx.lenis?.stop();
    if (mode === 'call') {
      add('them', '📞 Voice and video calls connect inside the KarmicAstro app. Until then, let’s chat here!');
    }
    typing(() => add('them', `Namaste 🙏 I’m ${current.name.split(' ').slice(-2).join(' ')}. Please share your date, time and place of birth, and tell me what’s on your mind.`), 1100);
    sound.bells(0.4);
    form.querySelector('input').focus();
  }

  grid.addEventListener('click', (e) => {
    const chat = e.target.closest('[data-chat-open]');
    const call = e.target.closest('[data-call-open]');
    if (chat) open(Number(chat.dataset.chatOpen));
    if (call) open(Number(call.dataset.callOpen), 'call');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    add('me', text);
    input.value = '';
    const reply = REPLIES.find(([re]) => re.test(text))?.[1] ||
      'Thank you. I can see the Moon’s nakshatra will matter a lot here. Share your birth details and I’ll read your chart properly.';
    typing(() => {
      add('them', reply);
      typing(() => add('them', '✨ This is a demo chat. Continue this conversation in the KarmicAstro app. Your first 5 minutes are on us.'), 1600);
    }, 1500 + Math.random() * 600);
  });

  const close = () => {
    timers.forEach(clearTimeout);
    dlg.close();
  };
  dlg.querySelector('[data-chat-close]').addEventListener('click', close);
  dlg.addEventListener('close', () => ctx.lenis?.start());
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) close();
  });

  return { open };
}
