import { noteAt } from './notes.js';

// Semitone intervals from root for each mode
export const MODES = {
  Ionian:     [0, 2, 4, 5, 7, 9, 11], // major
  Dorian:     [0, 2, 3, 5, 7, 9, 10],
  Phrygian:   [0, 1, 3, 5, 7, 8, 10],
  Lydian:     [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Aeolian:    [0, 2, 3, 5, 7, 8, 10], // natural minor
  Locrian:    [0, 1, 3, 5, 6, 8, 10],
};

export const getScaleNotes = (root, mode) => {
  const intervals = MODES[mode];
  if (!intervals) throw new Error(`Unknown mode: ${mode}`);
  return intervals.map(n => noteAt(root, n));
};

// Which scale degree each diatonic chord quality lives on (in Ionian)
// e.g. major chords on degrees 1, 4, 5 — minor on 2, 3, 6 — etc.
export const IONIAN_DEGREES = [
  { semitone: 0,  mode: 'Ionian' },
  { semitone: 2,  mode: 'Dorian' },
  { semitone: 4,  mode: 'Phrygian' },
  { semitone: 5,  mode: 'Lydian' },
  { semitone: 7,  mode: 'Mixolydian' },
  { semitone: 9,  mode: 'Aeolian' },
  { semitone: 11, mode: 'Locrian' },
];
