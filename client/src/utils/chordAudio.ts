import * as Tone from 'tone';

const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'triangle' },
  envelope: {
    attack: 0.005,
    decay: 2.5,
    sustain: 0,
    release: 1.5,
  },
}).toDestination();

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Assign octaves so notes ascend from octave 3, like a guitar voicing
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

export const strumChord = (chordTones: string[]) => {
  Tone.start();
  const voiced = assignOctaves(chordTones);
  const now = Tone.now();
  voiced.forEach((note, i) => {
    synth.triggerAttackRelease(note, '4n', now + i * 0.04);
  });
};
