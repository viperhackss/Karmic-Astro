// Low-precision geocentric ephemeris for Jyotish (Vedic astrology) previews.
//
// Orbital elements and perturbation terms follow Paul Schlyter's
// "How to compute planetary positions" (elements referred to the equinox of
// date). Accuracy is roughly 1–2 arcminutes for the Sun and Moon and a few
// arcminutes for the planets between 1900 and 2100 — plenty to place every
// graha in the correct rashi and nakshatra for a landing-page preview.

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export const norm360 = (x) => ((x % 360) + 360) % 360;
const sind = (x) => Math.sin(x * RAD);
const cosd = (x) => Math.cos(x * RAD);
const atan2d = (y, x) => Math.atan2(y, x) * DEG;

/** Julian Day (UT) for a JS Date. */
export function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Schlyter day number: days since 1999-12-31 00:00 UT. */
const dayNumber = (jd) => jd - 2451543.5;

function elements(body, d) {
  switch (body) {
    case 'sun':
      return { N: 0, i: 0, w: 282.9404 + 4.70935e-5 * d, a: 1, e: 0.016709 - 1.151e-9 * d, M: 356.047 + 0.9856002585 * d };
    case 'moon':
      return { N: 125.1228 - 0.0529538083 * d, i: 5.1454, w: 318.0634 + 0.1643573223 * d, a: 60.2666, e: 0.0549, M: 115.3654 + 13.0649929509 * d };
    case 'mercury':
      return { N: 48.3313 + 3.24587e-5 * d, i: 7.0047 + 5.0e-8 * d, w: 29.1241 + 1.01444e-5 * d, a: 0.387098, e: 0.205635 + 5.59e-10 * d, M: 168.6562 + 4.0923344368 * d };
    case 'venus':
      return { N: 76.6799 + 2.4659e-5 * d, i: 3.3946 + 2.75e-8 * d, w: 54.891 + 1.38374e-5 * d, a: 0.72333, e: 0.006773 - 1.302e-9 * d, M: 48.0052 + 1.6021302244 * d };
    case 'mars':
      return { N: 49.5574 + 2.11081e-5 * d, i: 1.8497 - 1.78e-8 * d, w: 286.5016 + 2.92961e-5 * d, a: 1.523688, e: 0.093405 + 2.516e-9 * d, M: 18.6021 + 0.5240207766 * d };
    case 'jupiter':
      return { N: 100.4542 + 2.76854e-5 * d, i: 1.303 - 1.557e-7 * d, w: 273.8777 + 1.64505e-5 * d, a: 5.20256, e: 0.048498 + 4.469e-9 * d, M: 19.895 + 0.0830853001 * d };
    case 'saturn':
      return { N: 113.6634 + 2.3898e-5 * d, i: 2.4886 - 1.081e-7 * d, w: 339.3939 + 2.97661e-5 * d, a: 9.55475, e: 0.055546 - 9.499e-9 * d, M: 316.967 + 0.0334442282 * d };
    default:
      throw new Error(`Unknown body ${body}`);
  }
}

function solveKepler(M, e) {
  const Mr = norm360(M);
  let E = Mr + e * DEG * sind(Mr) * (1 + e * cosd(Mr));
  for (let k = 0; k < 8; k++) {
    const dE = (E - e * DEG * sind(E) - Mr) / (1 - e * cosd(E));
    E -= dE;
    if (Math.abs(dE) < 1e-7) break;
  }
  return E;
}

/** Position in the body's own reference frame (heliocentric, or geocentric for the Moon). */
function orbitalPosition({ N, i, w, a, e, M }) {
  const E = solveKepler(M, e);
  const xv = a * (cosd(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * sind(E);
  const v = atan2d(yv, xv);
  const r = Math.hypot(xv, yv);
  const vw = v + w;
  const x = r * (cosd(N) * cosd(vw) - sind(N) * sind(vw) * cosd(i));
  const y = r * (sind(N) * cosd(vw) + cosd(N) * sind(vw) * cosd(i));
  const z = r * sind(vw) * sind(i);
  return { lon: norm360(atan2d(y, x)), lat: atan2d(z, Math.hypot(x, y)), r };
}

function sunPosition(d) {
  const el = elements('sun', d);
  const E = solveKepler(el.M, el.e);
  const xv = cosd(E) - el.e;
  const yv = Math.sqrt(1 - el.e * el.e) * sind(E);
  const v = atan2d(yv, xv);
  return { lon: norm360(v + el.w), r: Math.hypot(xv, yv), M: el.M, L: norm360(el.M + el.w) };
}

function moonLongitude(d, sun) {
  const el = elements('moon', d);
  const pos = orbitalPosition(el);
  const Ms = sun.M;
  const Mm = el.M;
  const Lm = el.M + el.w + el.N;
  const D = Lm - sun.L;
  const F = Lm - el.N;
  const pert =
    -1.274 * sind(Mm - 2 * D) +
    0.658 * sind(2 * D) -
    0.186 * sind(Ms) -
    0.059 * sind(2 * Mm - 2 * D) -
    0.057 * sind(Mm - 2 * D + Ms) +
    0.053 * sind(Mm + 2 * D) +
    0.046 * sind(2 * D - Ms) +
    0.041 * sind(Mm - Ms) -
    0.035 * sind(D) -
    0.031 * sind(Mm + Ms) -
    0.015 * sind(2 * F - 2 * D) +
    0.011 * sind(Mm - 4 * D);
  return norm360(pos.lon + pert);
}

function planetLongitude(body, d, sun) {
  const el = elements(body, d);
  const helio = orbitalPosition(el);
  let { lon } = helio;
  if (body === 'jupiter' || body === 'saturn') {
    const Mj = elements('jupiter', d).M;
    const Ms = elements('saturn', d).M;
    if (body === 'jupiter') {
      lon +=
        -0.332 * sind(2 * Mj - 5 * Ms - 67.6) -
        0.056 * sind(2 * Mj - 2 * Ms + 21) +
        0.042 * sind(3 * Mj - 5 * Ms + 21) -
        0.036 * sind(Mj - 2 * Ms) +
        0.022 * cosd(Mj - Ms) +
        0.023 * sind(2 * Mj - 3 * Ms + 52) -
        0.016 * sind(Mj - 5 * Ms - 69);
    } else {
      lon +=
        0.812 * sind(2 * Mj - 5 * Ms - 67.6) -
        0.229 * cosd(2 * Mj - 4 * Ms - 2) +
        0.119 * sind(Mj - 2 * Ms - 3) +
        0.046 * sind(2 * Mj - 6 * Ms - 69) +
        0.014 * sind(Mj - 3 * Ms + 32);
    }
  }
  const xh = helio.r * cosd(helio.lat) * cosd(lon);
  const yh = helio.r * cosd(helio.lat) * sind(lon);
  const xg = xh + sun.r * cosd(sun.lon);
  const yg = yh + sun.r * sind(sun.lon);
  return norm360(atan2d(yg, xg));
}

/** Lahiri (Chitrapaksha) ayanamsa, linear approximation (good to ~1′ for 1900–2100). */
export function lahiriAyanamsa(jd) {
  const years = (jd - 2451545.0) / 365.25;
  return 23.85706 + 0.0139689 * years;
}

/** Tropical longitudes (degrees) of the Sun, Moon, five planets and the mean lunar nodes. */
export function tropicalPositions(date) {
  const jd = julianDay(date);
  const d = dayNumber(jd);
  const sun = sunPosition(d);
  const moonEl = elements('moon', d);
  const rahu = norm360(moonEl.N);
  const result = {
    sun: sun.lon,
    moon: moonLongitude(d, sun),
    mars: planetLongitude('mars', d, sun),
    mercury: planetLongitude('mercury', d, sun),
    jupiter: planetLongitude('jupiter', d, sun),
    venus: planetLongitude('venus', d, sun),
    saturn: planetLongitude('saturn', d, sun),
    rahu,
    ketu: norm360(rahu + 180),
  };
  return { jd, positions: result };
}

/** Sidereal (Lahiri) longitudes, which is what Jyotish uses. */
export function siderealPositions(date) {
  const { jd, positions } = tropicalPositions(date);
  const ayan = lahiriAyanamsa(jd);
  const out = {};
  for (const [k, v] of Object.entries(positions)) out[k] = norm360(v - ayan);
  return { jd, ayanamsa: ayan, positions: out };
}

export function obliquity(jd) {
  return 23.4393 - 3.563e-7 * dayNumber(jd);
}

/** Greenwich mean sidereal time in degrees. */
export function gmst(jd) {
  const T = (jd - 2451545.0) / 36525;
  return norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
}

/** Sidereal ascendant (lagna) for a moment and place (latitude N+, longitude E+). */
export function ascendant(date, lat, lon) {
  const jd = julianDay(date);
  const ramc = norm360(gmst(jd) + lon);
  const eps = obliquity(jd);
  const asc = atan2d(cosd(ramc), -(sind(ramc) * cosd(eps) + Math.tan(lat * RAD) * sind(eps)));
  return norm360(asc - lahiriAyanamsa(jd));
}

/** Sunrise and sunset (as JS Dates) for a calendar day at a place (latitude N+, longitude E+). */
export function sunTimes(year, month, day, lat, lon) {
  // Iterate twice around local noon for the solar declination and equation of time.
  const at = (hoursUT) => new Date(Date.UTC(year, month - 1, day) + hoursUT * 3600000);
  let noonUT = 12 - lon / 15;
  let ha = 90;
  for (let k = 0; k < 3; k++) {
    const jd = julianDay(at(noonUT));
    const d = dayNumber(jd);
    const sun = sunPosition(d);
    const eps = obliquity(jd);
    const ra = norm360(atan2d(cosd(eps) * sind(sun.lon), cosd(sun.lon)));
    const decl = Math.asin(sind(eps) * sind(sun.lon)) * DEG;
    let eot = sun.L - ra; // degrees
    if (eot > 180) eot -= 360;
    if (eot < -180) eot += 360;
    noonUT = 12 - lon / 15 - eot / 15;
    const cosH = (sind(-0.833) - sind(lat) * sind(decl)) / (cosd(lat) * cosd(decl));
    ha = Math.acos(Math.max(-1, Math.min(1, cosH))) * DEG;
  }
  return { sunrise: at(noonUT - ha / 15), sunset: at(noonUT + ha / 15), noon: at(noonUT) };
}
