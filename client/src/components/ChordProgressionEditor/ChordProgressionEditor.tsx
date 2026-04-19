import { useState, useEffect, useRef } from "react";
import * as Tone from 'tone';
import type { Chord } from "../../types/chord";
import ChordBox from "../ChordBox/ChordBox";
import ChordPicker from "../ChordPicker/ChordPicker";
import FretboardDisplay, { STRING_SETS } from "../FretboardDisplay/FretboardDisplay";
import { strumChord, tick } from "../../utils/chordAudio";

interface ChordAnalysis {
    root: string;
    quality: string;
    beats: number;
    chordTones: string[];
    scaleTones: string[];
    mode: string;
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

const ChordProgressionEditor = () => {
    const [chords, setChords] = useState<Chord[]>([]);
    const [analysis, setAnalysis] = useState<ChordAnalysis[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentChordIndex, setCurrentChordIndex] = useState<number>(0);
    const [bpm, setBpm] = useState<number>(120);
    const [shouldLoop, setShouldLoop] = useState<boolean>(true);
    const [activeStringSet, setActiveStringSet] = useState(STRING_SETS[0]);
    const [showBlue, setShowBlue] = useState<boolean>(true);

    // Refs so the Transport callback always sees fresh values
    const analysisRef = useRef(analysis);
    const chordsRef = useRef(chords);
    const shouldLoopRef = useRef(shouldLoop);
    const beatRef = useRef(0);
    const prevChordIdxRef = useRef(-1);

    useEffect(() => { analysisRef.current = analysis; }, [analysis]);
    useEffect(() => { chordsRef.current = chords; }, [chords]);
    useEffect(() => { shouldLoopRef.current = shouldLoop; }, [shouldLoop]);

    useEffect(() => {
        if (chords.length === 0) { setAnalysis([]); return; }
        fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chords }),
        })
            .then(r => r.json())
            .then(data => setAnalysis(data.analysis));
    }, [chords]);

    const stopPlayback = () => {
        const transport = Tone.getTransport();
        transport.stop();
        transport.cancel();
        setIsPlaying(false);
        setCurrentChordIndex(0);
        beatRef.current = 0;
        prevChordIdxRef.current = -1;
    };

    const startPlayback = async () => {
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

            const chordIdx = getChordIdxForBeat(beat, chords, shouldLoopRef.current);

            if (chordIdx === null) {
                Tone.getDraw().schedule(() => stopPlayback(), time);
                return;
            }

            tick(time);

            if (chordIdx !== prevChordIdxRef.current) {
                const chordAnalysis = analysis[chordIdx];
                if (chordAnalysis) strumChord(chordAnalysis.chordTones, time);
                prevChordIdxRef.current = chordIdx;
            }

            Tone.getDraw().schedule(() => setCurrentChordIndex(chordIdx), time);
            beatRef.current += 1;
        }, '4n');

        transport.start();
        setIsPlaying(true);
    };

    const handlePlayStop = () => {
        if (isPlaying) stopPlayback();
        else startPlayback();
    };

    const handleSelect = (chord: Chord) => {
        if (editingIndex === -1) {
            setChords([...chords, chord]);
        } else {
            setChords(chords.map((c, i) => i === editingIndex ? chord : c));
        }
        setEditingIndex(null);
    };

    const currentAnalysis = analysis[currentChordIndex];
    const nextAnalysis = analysis[currentChordIndex + 1];

    return (
        <>
        <div className="flex flex-wrap gap-3 p-4 bg-gray-900 rounded-xl min-h-[200px] max-w-2xl">
            {chords.map((chord, index) => (
                <ChordBox key={index} chord={chord} onEdit={() => setEditingIndex(index)} isActive={index === currentChordIndex} />
            ))}
            <button onClick={() => setEditingIndex(-1)}>Add chord</button>
        </div>
        <div className="flex items-center gap-4 mt-4">
            <input
                className="bg-gray-700 text-white rounded p-2 w-20 text-center"
                type="text"
                value={bpm}
                onChange={e => {
                    const val = Number(e.target.value);
                    setBpm(val);
                    Tone.getTransport().bpm.value = val;
                }}
            />
            <label>bpm</label>
            <button
                className={`${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white font-bold px-6 py-2 rounded-lg`}
                onClick={handlePlayStop}
            >
                {isPlaying ? 'Stop' : 'Play'}
            </button>
            <input type="checkbox" checked={shouldLoop} onChange={e => setShouldLoop(e.target.checked)} />
            <label>Loop</label>
        </div>
        {currentAnalysis && (
            <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Strings:</span>
                        {STRING_SETS.map(set => (
                            <button
                                key={set.label}
                                onClick={() => setActiveStringSet(set)}
                                className={`px-3 py-1 rounded text-sm font-medium ${activeStringSet.label === set.label ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                {set.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={showBlue} onChange={e => setShowBlue(e.target.checked)} />
                        <label>Show current chord</label>
                    </div>
                </div>
                <div className="text-sm text-gray-400">
                    {showBlue && <> <span className="text-blue-400 font-semibold">Blue</span> = {currentAnalysis.root} {currentAnalysis.mode} scale </>}
                    {nextAnalysis && <> &nbsp;·&nbsp; <span className="text-amber-400 font-semibold">Amber</span> = {nextAnalysis.root} {nextAnalysis.quality} tones (next chord)</>}
                </div>
                <FretboardDisplay
                    scaleTones={currentAnalysis.scaleTones}
                    targetTones={nextAnalysis?.chordTones ?? analysis[0].chordTones}
                    activeStrings={activeStringSet.strings}
                    showCurrentChord={showBlue}
                />
            </div>
        )}
        {editingIndex !== null && (
            <ChordPicker onSelect={handleSelect} onCancel={() => setEditingIndex(null)} initialChord={editingIndex >= 0 ? chords[editingIndex] : undefined} />
        )}
        </>
    );
};

export default ChordProgressionEditor;
