// Chromatic index of each open string (string 1 = high E, string 6 = low E)
const OPEN_STRINGS = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface FretPosition {
  string: number; // 1–6
  fret: number;   // 0–19
}

export const getPositions = (note: string, maxFret = 19): FretPosition[] => {
  const idx = CHROMATIC.indexOf(note);
  if (idx === -1) return [];
  const positions: FretPosition[] = [];
  for (let s = 0; s < 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      if ((OPEN_STRINGS[s] + f) % 12 === idx) {
        positions.push({ string: s + 1, fret: f });
      }
    }
  }
  return positions;
};
