import { useFretboard, fretSlotX, stringY } from './Fretboard';

export type NoteKind = 'regular' | 'primary' | 'root' | 'blue';

interface NoteProps {
  string: number; // 1–6, 1 = high E
  fret: number;   // 0 = open
  kind?: NoteKind;
  children?: React.ReactNode;
}

const KIND_STYLE: Record<NoteKind, { fill: string; text: string; stroke?: string; opacity?: number }> = {
  root:    { fill: '#f59e0b', text: '#000', stroke: '#fff' }, // amber + white border — root tone
  primary: { fill: '#f59e0b', text: '#000' },                 // amber — other chord tones
  blue:    { fill: '#3b82f6', text: '#fff', opacity: 0.6 },   // blue  — scale tones
  regular: { fill: '#6b7280', text: '#fff' },                  // gray
};

const R = 13;

const Note = ({ string, fret, kind = 'regular', children }: NoteProps) => {
  const ctx = useFretboard();
  const x = fretSlotX(fret, ctx);
  const y = stringY(string, ctx);
  const { fill, text, stroke, opacity } = KIND_STYLE[kind];

  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={R} fill={fill} stroke={stroke} strokeWidth={stroke ? 2 : 0} />
      {children && (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={text}
          fontSize={9}
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          {children}
        </text>
      )}
    </g>
  );
};

export default Note;
