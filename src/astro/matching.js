// Ashtakoota (8-fold) Guna Milan from each partner's Moon nakshatra and rashi.
// Tables follow the common North Indian tradition; Yoni and Vashya use a
// simplified scale (same / neutral / enemy) for this preview.

import { RASHIS } from './data.js';

const GANA = 'DMRMDMDDRRMMDRDRDRRMMDRRMMD'; // Deva, Manushya, Rakshasa per nakshatra
const NADI = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
const YONI = [
  'horse', 'elephant', 'sheep', 'serpent', 'serpent', 'dog', 'cat', 'sheep', 'cat', 'rat', 'rat', 'cow',
  'buffalo', 'tiger', 'buffalo', 'tiger', 'deer', 'deer', 'dog', 'monkey', 'mongoose', 'monkey', 'lion',
  'horse', 'lion', 'cow', 'elephant',
];
const YONI_ENEMIES = [
  ['horse', 'buffalo'], ['elephant', 'lion'], ['sheep', 'monkey'], ['serpent', 'mongoose'],
  ['dog', 'deer'], ['cat', 'rat'], ['cow', 'tiger'],
];
const VARNA = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4]; // by rashi: Brahmin 4 … Shudra 1
const VASHYA = ['quad', 'quad', 'human', 'water', 'wild', 'human', 'human', 'insect', 'human', 'quad', 'human', 'water'];

const FRIENDS = {
  sun: { f: ['moon', 'mars', 'jupiter'], e: ['venus', 'saturn'] },
  moon: { f: ['sun', 'mercury'], e: [] },
  mars: { f: ['sun', 'moon', 'jupiter'], e: ['mercury'] },
  mercury: { f: ['sun', 'venus'], e: ['moon'] },
  jupiter: { f: ['sun', 'moon', 'mars'], e: ['mercury', 'venus'] },
  venus: { f: ['mercury', 'saturn'], e: ['sun', 'moon'] },
  saturn: { f: ['mercury', 'venus'], e: ['sun', 'moon', 'mars'] },
};
const relation = (a, b) => (a === b ? 'f' : FRIENDS[a].f.includes(b) ? 'f' : FRIENDS[a].e.includes(b) ? 'e' : 'n');

function grahaMaitri(lordA, lordB) {
  if (lordA === lordB) return 5;
  const pair = [relation(lordA, lordB), relation(lordB, lordA)].sort().join('');
  return { ff: 5, fn: 4, nn: 3, ef: 1, en: 0.5, ee: 0 }[pair];
}

function gana(boy, girl) {
  const b = GANA[boy];
  const g = GANA[girl];
  if (b === g) return 6;
  const table = { DM: 6, MD: 5, DR: 1, RD: 0, MR: 0, RM: 0 };
  return table[b + g];
}

function tara(fromNak, toNak) {
  const count = ((toNak - fromNak + 27) % 27) + 1;
  return [3, 5, 7].includes(count % 9) ? 0 : 1.5;
}

function yoni(a, b) {
  const ya = YONI[a];
  const yb = YONI[b];
  if (ya === yb) return 4;
  if (YONI_ENEMIES.some(([x, y]) => (x === ya && y === yb) || (x === yb && y === ya))) return 0;
  return 2;
}

function bhakoot(boyRashi, girlRashi) {
  const d = ((boyRashi - girlRashi + 12) % 12) + 1;
  return [2, 12, 5, 9, 6, 8].includes(d) ? 0 : 7;
}

/**
 * @param boy  { rashi: 0-11, nakshatra: 0-26 }
 * @param girl { rashi: 0-11, nakshatra: 0-26 }
 */
export function ashtakoota(boy, girl) {
  const kootas = [
    { key: 'varna', name: 'Varna', max: 1, score: VARNA[boy.rashi] >= VARNA[girl.rashi] ? 1 : 0, about: 'Spiritual temperament' },
    { key: 'vashya', name: 'Vashya', max: 2, score: VASHYA[boy.rashi] === VASHYA[girl.rashi] ? 2 : 1, about: 'Mutual attraction' },
    { key: 'tara', name: 'Tara', max: 3, score: tara(girl.nakshatra, boy.nakshatra) + tara(boy.nakshatra, girl.nakshatra), about: 'Health & destiny' },
    { key: 'yoni', name: 'Yoni', max: 4, score: yoni(boy.nakshatra, girl.nakshatra), about: 'Intimacy & nature' },
    { key: 'maitri', name: 'Graha Maitri', max: 5, score: grahaMaitri(RASHIS[boy.rashi].lord, RASHIS[girl.rashi].lord), about: 'Friendship of minds' },
    { key: 'gana', name: 'Gana', max: 6, score: gana(boy.nakshatra, girl.nakshatra), about: 'Temperament' },
    { key: 'bhakoot', name: 'Bhakoot', max: 7, score: bhakoot(boy.rashi, girl.rashi), about: 'Love & family welfare' },
    { key: 'nadi', name: 'Nadi', max: 8, score: NADI[boy.nakshatra] === NADI[girl.nakshatra] ? 0 : 8, about: 'Health & progeny' },
  ];
  const total = kootas.reduce((s, k) => s + k.score, 0);
  let verdict;
  if (total >= 28) verdict = 'An excellent match — the stars applaud!';
  else if (total >= 18) verdict = 'A good match — most kootas agree.';
  else verdict = 'Below 18 gunas — talk to an astrologer about remedies.';
  return { kootas, total, verdict };
}
