// Reference tables for Jyotish.

export const RASHIS = [
  { key: 'aries', en: 'Aries', sa: 'Mesha', hi: 'मेष', dates: 'Mar 21 – Apr 19', element: 'fire', lord: 'mars' },
  { key: 'taurus', en: 'Taurus', sa: 'Vrishabha', hi: 'वृषभ', dates: 'Apr 20 – May 20', element: 'earth', lord: 'venus' },
  { key: 'gemini', en: 'Gemini', sa: 'Mithuna', hi: 'मिथुन', dates: 'May 21 – Jun 20', element: 'air', lord: 'mercury' },
  { key: 'cancer', en: 'Cancer', sa: 'Karka', hi: 'कर्क', dates: 'Jun 21 – Jul 22', element: 'water', lord: 'moon' },
  { key: 'leo', en: 'Leo', sa: 'Simha', hi: 'सिंह', dates: 'Jul 23 – Aug 22', element: 'fire', lord: 'sun' },
  { key: 'virgo', en: 'Virgo', sa: 'Kanya', hi: 'कन्या', dates: 'Aug 23 – Sep 22', element: 'earth', lord: 'mercury' },
  { key: 'libra', en: 'Libra', sa: 'Tula', hi: 'तुला', dates: 'Sep 23 – Oct 22', element: 'air', lord: 'venus' },
  { key: 'scorpio', en: 'Scorpio', sa: 'Vrishchika', hi: 'वृश्चिक', dates: 'Oct 23 – Nov 21', element: 'water', lord: 'mars' },
  { key: 'sagittarius', en: 'Sagittarius', sa: 'Dhanu', hi: 'धनु', dates: 'Nov 22 – Dec 21', element: 'fire', lord: 'jupiter' },
  { key: 'capricorn', en: 'Capricorn', sa: 'Makara', hi: 'मकर', dates: 'Dec 22 – Jan 19', element: 'earth', lord: 'saturn' },
  { key: 'aquarius', en: 'Aquarius', sa: 'Kumbha', hi: 'कुंभ', dates: 'Jan 20 – Feb 18', element: 'air', lord: 'saturn' },
  { key: 'pisces', en: 'Pisces', sa: 'Meena', hi: 'मीन', dates: 'Feb 19 – Mar 20', element: 'water', lord: 'jupiter' },
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

export const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
  'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi',
];

export const YOGAS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
  'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
];

export const KARANAS_MOVABLE = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];

export const VAARS = [
  { en: 'Sunday', hi: 'Ravivaar', lord: 'sun' },
  { en: 'Monday', hi: 'Somvaar', lord: 'moon' },
  { en: 'Tuesday', hi: 'Mangalvaar', lord: 'mars' },
  { en: 'Wednesday', hi: 'Budhvaar', lord: 'mercury' },
  { en: 'Thursday', hi: 'Guruvaar', lord: 'jupiter' },
  { en: 'Friday', hi: 'Shukravaar', lord: 'venus' },
  { en: 'Saturday', hi: 'Shanivaar', lord: 'saturn' },
];

export const GRAHAS = [
  { key: 'sun', name: 'Surya', hi: 'सूर्य', abbr: 'Su', color: '#e8731a', gem: 'Ruby (Manikya)', day: 'Sunday', rules: 'Soul, vitality, father, authority and self-confidence.', remedy: 'Offer water to the rising Sun; recite the Aditya Hridayam.' },
  { key: 'moon', name: 'Chandra', hi: 'चन्द्र', abbr: 'Mo', color: '#f3ecd8', gem: 'Pearl (Moti)', day: 'Monday', rules: 'Mind, emotions, mother, comfort and intuition.', remedy: 'Wear white on Mondays; keep water by your bedside overnight.' },
  { key: 'mars', name: 'Mangal', hi: 'मंगल', abbr: 'Ma', color: '#c92a1e', gem: 'Red Coral (Moonga)', day: 'Tuesday', rules: 'Courage, energy, siblings, property and drive.', remedy: 'Recite the Hanuman Chalisa; donate red lentils on Tuesdays.' },
  { key: 'mercury', name: 'Budh', hi: 'बुध', abbr: 'Me', color: '#2f8a4c', gem: 'Emerald (Panna)', day: 'Wednesday', rules: 'Intellect, speech, trade, wit and learning.', remedy: 'Feed green grass to cows; wear green on Wednesdays.' },
  { key: 'jupiter', name: 'Guru', hi: 'गुरु', abbr: 'Ju', color: '#f2b01e', gem: 'Yellow Sapphire (Pukhraj)', day: 'Thursday', rules: 'Wisdom, teachers, children, fortune and dharma.', remedy: 'Respect your teachers; donate turmeric and chana dal.' },
  { key: 'venus', name: 'Shukra', hi: 'शुक्र', abbr: 'Ve', color: '#e0457b', gem: 'Diamond (Heera)', day: 'Friday', rules: 'Love, beauty, art, comforts and marriage.', remedy: 'Wear perfume and clean whites; offer rice and sugar.' },
  { key: 'saturn', name: 'Shani', hi: 'शनि', abbr: 'Sa', color: '#263a8a', gem: 'Blue Sapphire (Neelam)', day: 'Saturday', rules: 'Discipline, karma, delays, longevity and justice.', remedy: 'Light a mustard-oil diya under a peepal tree on Saturdays.' },
  { key: 'rahu', name: 'Rahu', hi: 'राहु', abbr: 'Ra', color: '#5a5f73', gem: 'Hessonite (Gomed)', day: 'Saturday', rules: 'Ambition, illusion, foreign lands and sudden change.', remedy: 'Feed stray dogs; chant “Om Raam Rahave Namah”.' },
  { key: 'ketu', name: 'Ketu', hi: 'केतु', abbr: 'Ke', color: '#8a5a2b', gem: "Cat's Eye (Lehsunia)", day: 'Tuesday', rules: 'Detachment, past lives, spirituality and insight.', remedy: 'Donate a blanket; worship Lord Ganesha.' },
];

export const GRAHA_BY_KEY = Object.fromEntries(GRAHAS.map((g) => [g.key, g]));

// Places for birth-chart previews. All Indian cities use IST (UTC+05:30).
export const CITIES = [
  ['New Delhi', 28.6139, 77.209],
  ['Mumbai', 19.076, 72.8777],
  ['Bengaluru', 12.9716, 77.5946],
  ['Chennai', 13.0827, 80.2707],
  ['Kolkata', 22.5726, 88.3639],
  ['Hyderabad', 17.385, 78.4867],
  ['Pune', 18.5204, 73.8567],
  ['Ahmedabad', 23.0225, 72.5714],
  ['Jaipur', 26.9124, 75.7873],
  ['Lucknow', 26.8467, 80.9462],
  ['Patna', 25.5941, 85.1376],
  ['Madhubani', 26.3483, 86.0712],
  ['Darbhanga', 26.1542, 85.8918],
  ['Varanasi', 25.3176, 82.9739],
  ['Ujjain', 23.1765, 75.7885],
  ['Bhopal', 23.2599, 77.4126],
  ['Indore', 22.7196, 75.8577],
  ['Nagpur', 21.1458, 79.0882],
  ['Surat', 21.1702, 72.8311],
  ['Chandigarh', 30.7333, 76.7794],
  ['Amritsar', 31.634, 74.8723],
  ['Dehradun', 30.3165, 78.0322],
  ['Srinagar', 34.0837, 74.7973],
  ['Guwahati', 26.1445, 91.7362],
  ['Bhubaneswar', 20.2961, 85.8245],
  ['Visakhapatnam', 17.6868, 83.2185],
  ['Madurai', 9.9252, 78.1198],
  ['Mysuru', 12.2958, 76.6394],
  ['Kochi', 9.9312, 76.2673],
  ['Thiruvananthapuram', 8.5241, 76.9366],
  ['Panaji (Goa)', 15.4909, 73.8278],
].map(([name, lat, lon]) => ({ name, lat, lon, tz: 5.5 }));

export const IST = 5.5;
