// Daily rashiphal built from the Moon's transit (gochar) relative to each
// rashi, with seeded variety so every sign reads differently each day.

import { RASHIS, VAARS } from './data.js';
import { siderealPositions } from './ephemeris.js';
import { rashiOf, nakshatraOf } from './panchang.js';

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

// Moon transiting the Nth house from your rashi (classical Chandra gochar).
const TRANSIT = [
  { good: true, text: 'The Moon walks through your own sign — you feel seen, centred and quietly confident.' },
  { good: false, text: 'The Moon in your 2nd house stirs talk of money and family; spend with intention.' },
  { good: true, text: 'With the Moon in your 3rd house, courage is high — send that message, start that project.' },
  { good: false, text: 'A 4th-house Moon turns you inward; home, mother and rest deserve your attention.' },
  { good: false, text: 'The Moon in your 5th house asks for patience with plans, children and speculation.' },
  { good: true, text: 'A 6th-house Moon helps you clear debts, beat deadlines and outwork rivals.' },
  { good: true, text: 'The Moon lights your 7th house — partnerships, deals and romance flow easily.' },
  { good: false, text: 'The Moon in your 8th house can feel heavy; avoid risks and keep secrets close.' },
  { good: true, text: 'With the Moon in your 9th house, blessings arrive through teachers, elders and travel.' },
  { good: true, text: 'A 10th-house Moon puts you on stage at work — be visible, ambitious and kind.' },
  { good: true, text: 'The Moon in your 11th house brings gains, good news and friends who show up.' },
  { good: false, text: 'A 12th-house Moon favours rest, charity and early nights over big launches.' },
];

const LOVE = {
  good: [
    'A warm conversation rekindles an old spark.',
    'Singles may meet someone through a friend of a friend.',
    'Your partner notices the small things you do — say what you feel.',
    'Plan something simple together this evening; it will mean a lot.',
  ],
  mixed: [
    'Listen more than you speak in matters of the heart today.',
    'A misunderstanding clears up if you stay gentle and patient.',
    'Give your partner space — closeness returns by evening.',
    'Avoid comparing your love story with anyone else’s.',
  ],
};
const CAREER = {
  good: [
    'A senior appreciates your work; ask for the responsibility you want.',
    'An idea you pitch now finds the right ears.',
    'Collaboration beats competition — team up on a tough task.',
    'Good day to sign, apply or interview.',
  ],
  mixed: [
    'Double-check emails and numbers before you hit send.',
    'Delays at work are temporary — keep your cool.',
    'Finish pending tasks before starting anything new.',
    'Office politics are best observed, not joined.',
  ],
};
const HEALTH = [
  'Start the day with warm water and a short walk.',
  'Mind your digestion — eat light and on time.',
  'A few minutes of pranayama will steady a restless mind.',
  'Your energy peaks in the morning; schedule demanding work early.',
  'Stretch your back and neck after long screen hours.',
  'Sleep early tonight; dreams may carry a message.',
];
const COLORS = ['Saffron', 'Turmeric Yellow', 'Leaf Green', 'Peacock Blue', 'Vermilion Red', 'Ivory White', 'Indigo', 'Rose Pink', 'Marigold Orange', 'Silver Grey'];
const WINDOWS = ['6:00 – 7:30 AM', '9:15 – 10:45 AM', '11:30 AM – 1:00 PM', '2:00 – 3:30 PM', '4:15 – 5:45 PM', '7:00 – 8:30 PM'];

/** dayOffset: 0 = today, 1 = tomorrow. */
export function dailyHoroscope(rashiIndex, baseDate = new Date(), dayOffset = 0) {
  const date = new Date(baseDate.getTime() + dayOffset * 86400000);
  // Read the Moon at local (IST) noon so the forecast matches the calendar day.
  const ist = new Date(date.getTime() + 5.5 * 3600000);
  const noon = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate(), 6, 30));
  const { positions } = siderealPositions(noon);
  const moonRashi = rashiOf(positions.moon);
  const house = ((moonRashi - rashiIndex + 12) % 12) + 1;
  const transit = TRANSIT[house - 1];
  const seed = (ist.getUTCFullYear() * 10000 + (ist.getUTCMonth() + 1) * 100 + ist.getUTCDate()) * 13 + rashiIndex * 7919;
  const rng = mulberry32(seed);
  const tone = transit.good ? 'good' : 'mixed';
  const base = transit.good ? 62 : 42;
  const meter = () => Math.min(98, Math.round(base + rng() * 34));
  return {
    rashi: RASHIS[rashiIndex],
    date: noon,
    vaar: VAARS[ist.getUTCDay()],
    moonRashi: RASHIS[moonRashi],
    moonNakshatra: nakshatraOf(positions.moon).name,
    house,
    summary: transit.text,
    love: pick(rng, LOVE[tone]),
    career: pick(rng, CAREER[tone]),
    health: pick(rng, HEALTH),
    luckyColor: pick(rng, COLORS),
    luckyNumber: 1 + Math.floor(rng() * 9),
    luckyTime: pick(rng, WINDOWS),
    meters: { love: meter(), career: meter(), health: meter() },
  };
}
