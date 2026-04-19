import { Fretboard, Note } from '../Fretboard';
import { getPositions } from '../../utils/fretboard';

interface FretboardDisplayProps {
  scaleTones: string[];   // current chord's scale — shown in blue
  targetTones: string[];  // next chord's chord tones — shown in amber
}

const FretboardDisplay = ({ scaleTones, targetTones }: FretboardDisplayProps) => {
  const targetSet = new Set(targetTones);

  const notes: { string: number; fret: number; kind: 'primary' | 'blue' }[] = [];

  // Scale tones in blue, but skip any that are also targets (primary takes priority)
  for (const note of scaleTones) {
    if (!targetSet.has(note)) {
      getPositions(note).forEach(pos => notes.push({ ...pos, kind: 'blue' }));
    }
  }

  // Target (next chord) tones in amber, on top
  for (const note of targetTones) {
    getPositions(note).forEach(pos => notes.push({ ...pos, kind: 'primary' }));
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
