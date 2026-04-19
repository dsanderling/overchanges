import { Fretboard, Note } from '../Fretboard';
import { getPositions } from '../../utils/fretboard';

export const STRING_SETS = [
  { label: 'All',  strings: [1, 2, 3, 4, 5, 6] },
  { label: '1–3',  strings: [1, 2, 3] },
  { label: '2–4',  strings: [2, 3, 4] },
  { label: '3–5',  strings: [3, 4, 5] },
  { label: '4–6',  strings: [4, 5, 6] },
];

interface FretboardDisplayProps {
  scaleTones: string[];   // current chord's scale — shown in blue
  targetTones: string[];  // next chord's chord tones — shown in amber
  activeStrings: number[];
}

const FretboardDisplay = ({ scaleTones, targetTones, activeStrings }: FretboardDisplayProps) => {
  const targetSet = new Set(targetTones);
  const stringSet = new Set(activeStrings);

  const notes: { string: number; fret: number; kind: 'primary' | 'blue' }[] = [];

  // Scale tones in blue, but skip any that are also targets (primary takes priority)
  for (const note of scaleTones) {
    if (!targetSet.has(note)) {
      getPositions(note)
        .filter(pos => stringSet.has(pos.string))
        .forEach(pos => notes.push({ ...pos, kind: 'blue' }));
    }
  }

  // Target (next chord) tones in amber, on top
  for (const note of targetTones) {
    getPositions(note)
      .filter(pos => stringSet.has(pos.string))
      .forEach(pos => notes.push({ ...pos, kind: 'primary' }));
  }

  return (
    <Fretboard width={1100}>
      {notes.map(({ string, fret, kind }, i) => (
        <Note key={i} string={string} fret={fret} kind={kind} />
      ))}
    </Fretboard>
  );
};

export default FretboardDisplay;
