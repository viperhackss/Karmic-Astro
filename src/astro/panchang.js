import { siderealPositions, ascendant, sunTimes, norm360 } from './ephemeris.js';
import { NAKSHATRAS, TITHIS, YOGAS, KARANAS_MOVABLE, VAARS, RASHIS, IST } from './data.js';

const NAK_SPAN = 360 / 27;

export function nakshatraOf(lon) {
  const idx = Math.floor(norm360(lon) / NAK_SPAN);
  const pada = Math.floor((norm360(lon) % NAK_SPAN) / (NAK_SPAN / 4)) + 1;
  return { index: idx, name: NAKSHATRAS[idx], pada };
}

export const rashiOf = (lon) => Math.floor(norm360(lon) / 30);

export function tithiOf(sunLon, moonLon) {
  const elong = norm360(moonLon - sunLon);
  const idx = Math.floor(elong / 12); // 0..29
  const shukla = idx < 15;
  const n = idx % 15;
  let name;
  if (n === 14) name = shukla ? 'Purnima' : 'Amavasya';
  else name = TITHIS[n];
  return { index: idx, name, paksha: shukla ? 'Shukla' : 'Krishna', elongation: elong };
}

export function karanaOf(elong) {
  const k = Math.floor(norm360(elong) / 6); // 0..59
  if (k === 0) return 'Kimstughna';
  if (k === 57) return 'Shakuni';
  if (k === 58) return 'Chatushpada';
  if (k === 59) return 'Naga';
  return KARANAS_MOVABLE[(k - 1) % 7];
}

export function yogaOf(sunLon, moonLon) {
  return YOGAS[Math.floor(norm360(sunLon + moonLon) / NAK_SPAN)];
}

/** Fraction of the Moon's disc that is lit, from the Sun–Moon elongation. */
export const illumination = (elong) => (1 - Math.cos((elong * Math.PI) / 180)) / 2;

/** Today's Panchang for a place (defaults to New Delhi). */
export function panchang(date = new Date(), place = { lat: 28.6139, lon: 77.209, tz: IST, name: 'New Delhi' }) {
  const { positions } = siderealPositions(date);
  const t = tithiOf(positions.sun, positions.moon);
  const local = new Date(date.getTime() + place.tz * 3600000);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth() + 1;
  const d = local.getUTCDate();
  const { sunrise, sunset } = sunTimes(y, m, d, place.lat, place.lon);
  return {
    date,
    place,
    vaar: VAARS[local.getUTCDay()],
    tithi: t,
    nakshatra: nakshatraOf(positions.moon),
    yoga: yogaOf(positions.sun, positions.moon),
    karana: karanaOf(t.elongation),
    moonRashi: RASHIS[rashiOf(positions.moon)],
    sunRashi: RASHIS[rashiOf(positions.sun)],
    illumination: illumination(t.elongation),
    waxing: t.elongation < 180,
    sunrise,
    sunset,
    positions,
  };
}

/** Birth chart (kundli) for a local IST birth date/time and place. */
export function birthChart({ date, time, place }) {
  const [Y, M, D] = date.split('-').map(Number);
  const [h, min] = (time || '12:00').split(':').map(Number);
  const utc = new Date(Date.UTC(Y, M - 1, D, h, min) - place.tz * 3600000);
  const { positions, ayanamsa } = siderealPositions(utc);
  const lagna = ascendant(utc, place.lat, place.lon);
  const lagnaRashi = rashiOf(lagna);
  const planets = Object.entries(positions).map(([key, lon]) => {
    const r = rashiOf(lon);
    return { key, lon, rashi: r, degree: lon % 30, house: ((r - lagnaRashi + 12) % 12) + 1 };
  });
  return {
    utc,
    ayanamsa,
    lagna: { lon: lagna, rashi: lagnaRashi, degree: lagna % 30 },
    moon: { rashi: rashiOf(positions.moon), nakshatra: nakshatraOf(positions.moon) },
    sun: { rashi: rashiOf(positions.sun) },
    tithi: tithiOf(positions.sun, positions.moon),
    planets,
  };
}
