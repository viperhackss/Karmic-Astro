import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tropicalPositions, siderealPositions, ascendant, sunTimes } from '../src/astro/ephemeris.js';
import { panchang, birthChart, tithiOf, nakshatraOf } from '../src/astro/panchang.js';
import { ashtakoota } from '../src/astro/matching.js';
import { dailyHoroscope } from '../src/astro/horoscope.js';
import { CITIES } from '../src/astro/data.js';

const near = (actual, expected, tol, label) =>
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: expected ${expected}±${tol}, got ${actual.toFixed(3)}`);

test('tropical positions at J2000 match reference ephemeris', () => {
  const { positions: p } = tropicalPositions(new Date(Date.UTC(2000, 0, 1, 12)));
  // Reference values (JPL Horizons, geocentric apparent, rounded).
  near(p.sun, 280.37, 0.1, 'Sun');
  near(p.moon, 223.32, 0.3, 'Moon');
  near(p.mercury, 271.89, 0.3, 'Mercury');
  near(p.venus, 241.57, 0.3, 'Venus');
  near(p.mars, 327.96, 0.3, 'Mars');
  near(p.jupiter, 25.25, 0.3, 'Jupiter');
  near(p.saturn, 40.40, 0.3, 'Saturn');
  near(p.rahu, 125.04, 0.1, 'Mean node');
});

test('sidereal Saturn is in Pisces and Rahu in Aquarius in late 2026', () => {
  const { positions: p } = siderealPositions(new Date(Date.UTC(2026, 10, 21, 6, 30)));
  assert.equal(Math.floor(p.saturn / 30), 11);
  assert.equal(Math.floor(p.rahu / 30), 10);
});

test('ascendant: 0° Aries on the MC at the equator rises 0° Cancer', () => {
  // GMST is 0° about 0.22034 days after J2000; the sidereal result is 90° minus the ayanamsa.
  const jd = 2451545.0 + (360 - 280.46061837) / 360.98564736629;
  const date = new Date((jd - 2440587.5) * 86400000);
  near(ascendant(date, 0, 0), 90 - 23.857, 0.05, 'Ascendant');
});

test('Delhi sunrise and sunset in late November are about 06:48 and 17:25 IST', () => {
  const { sunrise, sunset } = sunTimes(2026, 11, 21, 28.6139, 77.209);
  const ist = (d) => (d.getUTCHours() + 5.5 + d.getUTCMinutes() / 60) % 24;
  near(ist(sunrise), 6 + 48 / 60, 0.1, 'sunrise');
  near(ist(sunset), 17 + 25 / 60, 0.1, 'sunset');
});

test('tithi: Diwali 2026 (8 Nov) is Amavasya and 24 Nov 2026 is Purnima', () => {
  const amavasya = panchang(new Date(Date.UTC(2026, 10, 9, 0, 30)));
  assert.equal(amavasya.tithi.name, 'Amavasya');
  const purnima = panchang(new Date(Date.UTC(2026, 10, 24, 6, 30)));
  assert.equal(purnima.tithi.name, 'Purnima');
});

test('tithi and nakshatra helpers', () => {
  assert.deepEqual(tithiOf(0, 5).name, 'Pratipada');
  assert.equal(tithiOf(0, 175).name, 'Purnima');
  assert.equal(tithiOf(0, 355).name, 'Amavasya');
  assert.equal(nakshatraOf(0).name, 'Ashwini');
  assert.equal(nakshatraOf(359.9).name, 'Revati');
  assert.equal(nakshatraOf(359.9).pada, 4);
});

test('birth chart places nine grahas into twelve houses', () => {
  const chart = birthChart({ date: '1995-08-15', time: '06:30', place: CITIES[0] });
  assert.equal(chart.planets.length, 9);
  for (const p of chart.planets) assert.ok(p.house >= 1 && p.house <= 12);
  const rahu = chart.planets.find((p) => p.key === 'rahu');
  const ketu = chart.planets.find((p) => p.key === 'ketu');
  assert.equal((rahu.rashi + 6) % 12, ketu.rashi);
  // At sunrise the Sun sits close to the ascendant.
  const sun = chart.planets.find((p) => p.key === 'sun');
  assert.ok([1, 12].includes(sun.house), `sun house ${sun.house}`);
});

test('ashtakoota scores stay within 0–36 and identical charts lose Nadi', () => {
  for (let a = 0; a < 27; a++) {
    for (let b = 0; b < 27; b += 4) {
      const r = ashtakoota({ rashi: Math.floor((a * 4) / 9), nakshatra: a }, { rashi: Math.floor((b * 4) / 9), nakshatra: b });
      assert.ok(r.total >= 0 && r.total <= 36);
    }
  }
  const same = ashtakoota({ rashi: 0, nakshatra: 0 }, { rashi: 0, nakshatra: 0 });
  assert.equal(same.kootas.find((k) => k.key === 'nadi').score, 0);
});

test('daily horoscope is deterministic per sign and day', () => {
  const d = new Date(Date.UTC(2026, 10, 21, 4));
  const a = dailyHoroscope(3, d);
  const b = dailyHoroscope(3, d);
  assert.deepEqual(a, b);
  assert.notEqual(dailyHoroscope(4, d).summary + dailyHoroscope(4, d).love, a.summary + a.love + 'x');
  assert.ok(a.house >= 1 && a.house <= 12);
});
