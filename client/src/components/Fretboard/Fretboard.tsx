import React, { createContext, useContext } from 'react';

export interface VisibleFrets {
  start: number;
  end: number;
}

export interface FretboardContextValue {
  visibleFrets: VisibleFrets;
  fretLeft: number;
  fretRight: number;
  stringTop: number;
  stringBottom: number;
  nutWidth: number;
}

export const FretboardContext = createContext<FretboardContextValue>({
  visibleFrets: { start: 0, end: 19 },
  fretLeft: 50,
  fretRight: 870,
  stringTop: 25,
  stringBottom: 155,
  nutWidth: 6,
});

export const useFretboard = () => useContext(FretboardContext);

// Fraction of scale length from nut to fret bar n
export const fretBarFraction = (n: number) =>
  n === 0 ? 0 : 1 - Math.pow(2, -(n / 12));

export function fractionToX(fraction: number, ctx: FretboardContextValue): number {
  const { visibleFrets, fretLeft, fretRight } = ctx;
  const startF = fretBarFraction(visibleFrets.start);
  const endF = fretBarFraction(visibleFrets.end + 1);
  const t = (fraction - startF) / (endF - startF);
  return fretLeft + t * (fretRight - fretLeft);
}

// X center of the playing slot for fret n (0 = open string)
export function fretSlotX(fret: number, ctx: FretboardContextValue): number {
  if (fret === 0) return ctx.fretLeft - ctx.nutWidth - 18;
  const f1 = fretBarFraction(fret - 1);
  const f2 = fretBarFraction(fret);
  return fractionToX((f1 + f2) / 2, ctx);
}

// Y position for string n (1 = high E = top, 6 = low E = bottom)
export function stringY(string: number, ctx: FretboardContextValue): number {
  return ctx.stringTop + ((string - 1) / 5) * (ctx.stringBottom - ctx.stringTop);
}

const SINGLE_MARKERS = [3, 5, 7, 9, 15, 17, 19, 21];
const DOUBLE_MARKERS = [12, 24];

interface FretboardProps {
  visibleFrets?: VisibleFrets;
  width?: number;
  children?: React.ReactNode;
}

const Fretboard = ({
  visibleFrets = { start: 0, end: 19 },
  width = 900,
  children,
}: FretboardProps) => {
  const height = 180;
  const fretLeft = 50;
  const fretRight = width - 30;
  const stringTop = 25;
  const stringBottom = height - 25;
  const nutWidth = 6;

  const ctx: FretboardContextValue = {
    visibleFrets, fretLeft, fretRight, stringTop, stringBottom, nutWidth,
  };

  const fretBars = Array.from(
    { length: visibleFrets.end - visibleFrets.start + 2 },
    (_, i) => fractionToX(fretBarFraction(visibleFrets.start + i), ctx)
  );

  const visibleMarkers = [...SINGLE_MARKERS, ...DOUBLE_MARKERS].filter(
    f => f > visibleFrets.start && f <= visibleFrets.end
  );

  const markerY = stringBottom + 12; // below all strings, never overlaps notes

  return (
    <FretboardContext.Provider value={ctx}>
      <svg width={width} height={height + 20} style={{ background: '#1a1209', borderRadius: 8 }}>
        {/* Strings */}
        {Array.from({ length: 6 }, (_, i) => {
          const y = stringY(i + 1, ctx);
          return (
            <line
              key={i}
              x1={fretLeft - nutWidth}
              y1={y}
              x2={fretRight}
              y2={y}
              stroke="#999"
              strokeWidth={1 + i * 0.35}
            />
          );
        })}

        {/* Fret bars */}
        {fretBars.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={stringTop}
            x2={x}
            y2={stringBottom}
            stroke={i === 0 ? '#ccc' : '#555'}
            strokeWidth={i === 0 ? nutWidth : 1.5}
          />
        ))}

        {/* Fret markers — rendered below strings so they never hide behind notes */}
        {visibleMarkers.map(f => {
          const x = fretSlotX(f, ctx);
          const isDouble = DOUBLE_MARKERS.includes(f);
          return isDouble ? (
            <g key={f}>
              <circle cx={x - 6} cy={markerY} r={4} fill="#a07840" />
              <circle cx={x + 6} cy={markerY} r={4} fill="#a07840" />
            </g>
          ) : (
            <circle key={f} cx={x} cy={markerY} r={4} fill="#a07840" />
          );
        })}

        {children}
      </svg>
    </FretboardContext.Provider>
  );
};

export default Fretboard;
