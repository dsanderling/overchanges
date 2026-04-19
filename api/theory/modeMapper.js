import { noteIndex } from './notes.js';
import { IONIAN_DEGREES, MODES, getScaleNotes } from './scales.js';

// Chord qualities that are diatonic to Ionian at each scale degree
const DIATONIC_QUALITIES = {
  Ionian:     ['major', 'maj7'],
  Dorian:     ['minor', 'm7'],
  Phrygian:   ['minor', 'm7'],
  Lydian:     ['major', 'maj7'],
  Mixolydian: ['major', 'dom7'],
  Aeolian:    ['minor', 'm7'],
  Locrian:    ['minor', 'm7b5'],
};

const semitonesBetween = (root, key) => (noteIndex(root) - noteIndex(key) + 12) % 12;

const isDiatonic = (chord, key) => {
  const dist = semitonesBetween(chord.root, key);
  const degree = IONIAN_DEGREES.find(d => d.semitone === dist);
  if (!degree) return null;
  if (DIATONIC_QUALITIES[degree.mode].includes(chord.quality)) return degree.mode;
  return null;
};

const isSecondaryDominant = (chord, key) => {
  // A dom7 chord whose root is a fifth above any diatonic chord → Mixolydian
  if (chord.quality !== 'dom7') return false;
  const diatonicRoots = IONIAN_DEGREES.map(d => (noteIndex(key) + d.semitone) % 12);
  const expectedRoot = (noteIndex(chord.root) + 5) % 12; // a fifth below = resolve target
  return diatonicRoots.includes(expectedRoot);
};

const modalInterchangeMode = (chord) => {
  // Check all modes to see if this chord is diatonic to any parallel mode
  for (const [mode, intervals] of Object.entries(MODES)) {
    const degree = IONIAN_DEGREES.find(d => d.semitone === intervals[0]);
    if (!degree) continue;
    const scaleNotes = getScaleNotes(chord.root, mode);
    const qualities = DIATONIC_QUALITIES[mode];
    if (qualities?.includes(chord.quality) && scaleNotes.length > 0) return mode;
  }
  return 'Ionian'; // fallback
};

export const getMode = (chord, key) => {
  const diatonic = isDiatonic(chord, key);
  if (diatonic) return diatonic;

  if (isSecondaryDominant(chord, key)) return 'Mixolydian';

  return modalInterchangeMode(chord);
};
