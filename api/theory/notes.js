export const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const noteIndex = (note) => CHROMATIC.indexOf(note);

export const noteAt = (root, semitones) =>
  CHROMATIC[(noteIndex(root) + semitones) % 12];
