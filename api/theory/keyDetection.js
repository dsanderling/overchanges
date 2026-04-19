import { CHROMATIC, noteIndex } from './notes.js';
import { MODES } from './scales.js';
import { getChordTones } from './chordTones.js';

const FIRST_CHORD_MULTIPLIER = 3;
const DOM7_KEY_BONUS = 4;

const scoreKey = (key, noteSet) => {
  const diatonic = new Set(MODES.Ionian.map(n => (noteIndex(key) + n) % 12));
  return [...noteSet].reduce((score, note) => {
    return score + (diatonic.has(noteIndex(note)) ? 1 : 0);
  }, 0);
};

export const detectKey = (chords) => {
  // Collect all chord tones, weighting the first chord more heavily
  const weightedNotes = new Map(); // note -> max weight seen

  chords.forEach((chord, i) => {
    const weight = i === 0 ? FIRST_CHORD_MULTIPLIER : 1;
    getChordTones(chord.root, chord.quality).forEach(note => {
      weightedNotes.set(note, Math.max(weightedNotes.get(note) ?? 0, weight));
    });
  });

  // Score each of the 12 keys
  const scores = CHROMATIC.map(key => {
    const diatonic = new Set(MODES.Ionian.map(n => (noteIndex(key) + n) % 12));

    let score = 0;
    for (const [note, weight] of weightedNotes) {
      if (diatonic.has(noteIndex(note))) score += weight;
    }

    // Bonus: if a dom7 chord's root is a fifth above this key's tonic,
    // it's likely the V7, strongly implying this key
    chords.forEach(chord => {
      if (chord.quality === 'dom7') {
        const expectedV = (noteIndex(key) + 7) % 12;
        if (noteIndex(chord.root) === expectedV) score += DOM7_KEY_BONUS;
      }
    });

    return { key, score };
  });

  scores.sort((a, b) => b.score - a.score);
  return scores[0].key;
};
