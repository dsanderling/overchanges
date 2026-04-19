import * as Tone from 'tone';

const chordSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'triangle' },
  envelope: { attack: 0.02, decay: 2.5, sustain: 0, release: 1.5 },
}).toDestination();

const tickSynth = new Tone.Synth({
  oscillator: { type: 'triangle' },
  envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.05 },
  volume: -8,
}).toDestination();

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Assign octaves so chord tones ascend from octave 3
const assignOctaves = (notes: string[]): string[] => {
  let octave = 3;
  let prevIdx = -1;
  return notes.map(note => {
    const idx = CHROMATIC.indexOf(note);
    if (prevIdx !== -1 && idx <= prevIdx) octave++;
    prevIdx = idx;
    return `${note}${octave}`;
  });
};

export const strumChord = (chordTones: string[], time: number) => {
  const voiced = assignOctaves(chordTones);
  voiced.forEach((note, i) => {
    chordSynth.triggerAttackRelease(note, '2n', time + i * 0.04);
  });
};

export const tick = (time: number) => {
  tickSynth.triggerAttackRelease('C5', '32n', time);
};
