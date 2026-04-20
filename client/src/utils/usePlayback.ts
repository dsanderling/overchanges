import { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import type { Chord } from '../types/chord';
import { strumChord, tick } from './chordAudio';

interface ChordAnalysis {
  chordTones: string[];
}

const getTotalBeats = (chords: Chord[]) => chords.reduce((s, c) => s + c.beats, 0);

const getChordIdxForBeat = (beat: number, chords: Chord[], loop: boolean): number | null => {
  const total = getTotalBeats(chords);
  if (total === 0) return null;
  const b = loop ? beat % total : beat;
  if (b >= total) return null;
  let acc = 0;
  for (let i = 0; i < chords.length; i++) {
    acc += chords[i].beats;
    if (b < acc) return i;
  }
  return null;
};

export const usePlayback = (
  chords: Chord[],
  analysis: ChordAnalysis[],
  bpm: number,
  shouldLoop: boolean,
  muteTicks: boolean,
  muteChords: boolean,
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);

  const analysisRef = useRef(analysis);
  const chordsRef = useRef(chords);
  const shouldLoopRef = useRef(shouldLoop);
  const muteTicksRef = useRef(muteTicks);
  const muteChordsRef = useRef(muteChords);
  const beatRef = useRef(0);
  const prevChordIdxRef = useRef(-1);

  useEffect(() => { analysisRef.current = analysis; }, [analysis]);
  useEffect(() => { chordsRef.current = chords; }, [chords]);
  useEffect(() => { muteTicksRef.current = muteTicks; }, [muteTicks]);
  useEffect(() => { muteChordsRef.current = muteChords; }, [muteChords]);
  useEffect(() => { shouldLoopRef.current = shouldLoop; }, [shouldLoop]);
  useEffect(() => { Tone.getTransport().bpm.value = bpm; }, [bpm]);

  const stop = () => {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    setIsPlaying(false);
    setCurrentChordIndex(0);
    beatRef.current = 0;
    prevChordIdxRef.current = -1;
  };

  const start = async () => {
    await Tone.start();
    beatRef.current = 0;
    prevChordIdxRef.current = -1;

    const transport = Tone.getTransport();
    transport.cancel();
    transport.bpm.value = bpm;

    transport.scheduleRepeat((time) => {
      const beat = beatRef.current;
      const chords = chordsRef.current;
      const analysis = analysisRef.current;
      const muteChords = muteChordsRef.current;
      const muteTicks = muteTicksRef.current;

      const chordIdx = getChordIdxForBeat(beat, chords, shouldLoopRef.current);

      if (chordIdx === null) {
        Tone.getDraw().schedule(() => stop(), time);
        return;
      }

      if(!muteTicks) tick(time);

      //TODO: fix bug where a one-chord looping progression doesn't re-strum
      if (chordIdx !== prevChordIdxRef.current) {
        const chordAnalysis = analysis[chordIdx];
        if (chordAnalysis && !muteChords) strumChord(chordAnalysis.chordTones, time);
        prevChordIdxRef.current = chordIdx;
      }

      Tone.getDraw().schedule(() => setCurrentChordIndex(chordIdx), time);
      beatRef.current += 1;
    }, '4n');

    transport.start();
    setIsPlaying(true);
  };

  const handlePlayStop = () => (isPlaying ? stop() : start());

  return { isPlaying, currentChordIndex, handlePlayStop };
};
