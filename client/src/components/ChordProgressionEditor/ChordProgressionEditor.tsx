import { useState, useEffect } from "react";
import type { Chord } from "../../types/chord";
import ChordBox from "../ChordBox/ChordBox";
import ChordPicker from "../ChordPicker/ChordPicker";
import FretboardDisplay, { STRING_SETS } from "../FretboardDisplay/FretboardDisplay";
import { playTick } from "../../utils/audio";

interface ChordAnalysis {
    root: string;
    quality: string;
    beats: number;
    chordTones: string[];
    scaleTones: string[];
    mode: string;
}

const ChordProgressionEditor = () => {
    const [chords, setChords] = useState<Chord[]>([]);
    const [analysis, setAnalysis] = useState<ChordAnalysis[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentBeat, setCurrentBeat] = useState<number>(0);
    const [bpm, setBpm] = useState<number>(120);
    const [shouldLoop, setShouldLoop] = useState<boolean>(true);
    const [activeStringSet, setActiveStringSet] = useState(STRING_SETS[0]);

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

    useEffect(() => {
        if(!isPlaying) {
            setCurrentBeat(0);
            return;
        }
        const interval = setInterval(() => {
            setCurrentBeat(prev => prev + 1);
        }, 60000/bpm);

        return () => clearInterval(interval);
    }, [isPlaying, bpm]);

    useEffect(() => {
        if (!isPlaying) return;
        if (getCurrentChordIndex() === null) {
            setCurrentBeat(0);
            setIsPlaying(shouldLoop);
        }
        playTick();
    }, [currentBeat]);

    const handleSelect = (chord: Chord) => {
        if (editingIndex === -1) {
            setChords([...chords, chord]);
        } else {
            setChords(chords.map((c, i) => i === editingIndex ? chord : c));
        }
        setEditingIndex(null);
    };

    const getCurrentChordIndex = () => {
        let beats = 0;
        for (let i = 0; i < chords.length; i++) {
            beats += chords[i].beats;
            if (currentBeat < beats) return i;
        }
        return null;
    };

    const currentChordIndex = getCurrentChordIndex() ?? 0;
    const currentAnalysis = analysis[currentChordIndex];
    const nextAnalysis = analysis[currentChordIndex + 1];

    return (
        <>
        <div className="flex flex-wrap gap-3 p-4 bg-gray-900 rounded-xl min-h-[200px] max-w-2xl">
            {chords.map((chord, index) => (
                <ChordBox key={index} chord={chord} onEdit={() => setEditingIndex(index)} isActive={index===currentChordIndex}/>
            ))}
            <button onClick={() => setEditingIndex(-1)}>
                Add chord
            </button>
        </div>
        <div className="flex items-center gap-4 mt-4">
            <input className="bg-gray-700 text-white rounded p-2 w-20 text-center" type="text" value={bpm} onChange={e => setBpm(Number(e.target.value))} />
            <label>bpm</label>
            <button className={`${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white font-bold px-6 py-2 rounded-lg`} onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? 'Stop' : 'Play'}
            </button>
            <input type="checkbox" checked={shouldLoop} onChange={e => setShouldLoop(e.target.checked)} />
            <label>Loop</label>
        </div>
        {currentAnalysis && (
            <div className="mt-6 flex flex-col gap-2">
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
                <div className="text-sm text-gray-400">
                    <span className="text-blue-400 font-semibold">Blue</span> = {currentAnalysis.root} {currentAnalysis.mode} scale
                    {nextAnalysis && <> &nbsp;·&nbsp; <span className="text-amber-400 font-semibold">Amber</span> = {nextAnalysis.root} {nextAnalysis.quality} tones (next chord)</>}
                </div>
                <FretboardDisplay
                    scaleTones={currentAnalysis.scaleTones}
                    targetTones={nextAnalysis?.chordTones ?? analysis[0].chordTones}
                    activeStrings={activeStringSet.strings}
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
