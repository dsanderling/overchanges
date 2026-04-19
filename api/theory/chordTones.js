import { noteAt } from './notes.js';

// Semitone intervals from root for each chord quality
const CHORD_INTERVALS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dom7:  [0, 4, 7, 10],
  maj7:  [0, 4, 7, 11],
  m7:    [0, 3, 7, 10],
  m7b5:  [0, 3, 6, 10],
};

export const getChordTones = (root, quality) => {
  const intervals = CHORD_INTERVALS[quality];
  if (!intervals) throw new Error(`Unknown chord quality: ${quality}`);
  return intervals.map(n => noteAt(root, n));
};
