import { useState, useEffect } from "react";
import type { Chord } from "../../types/chord";
import ChordBox from "../ChordBox/ChordBox";
import ChordPicker from "../ChordPicker/ChordPicker";
import FretboardDisplay, { STRING_SETS } from "../FretboardDisplay/FretboardDisplay";
import { usePlayback } from "../../utils/usePlayback";

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
    const [bpm, setBpm] = useState<number>(120);
    const [shouldLoop, setShouldLoop] = useState<boolean>(true);
    const [activeStringSet, setActiveStringSet] = useState(STRING_SETS[0]);
    const [showBlue, setShowBlue] = useState<boolean>(true);
    const [muteTicks, setMuteTicks] = useState<boolean>(false);
    const [muteChords, setMuteChords] = useState<boolean>(false);

    const { isPlaying, currentChordIndex, handlePlayStop } = usePlayback(chords, analysis, bpm, shouldLoop, muteTicks, muteChords);

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

    const handleSelect = (chord: Chord) => {
        if (editingIndex === -1) {
            setChords([...chords, chord]);
        } else {
            setChords(chords.map((c, i) => i === editingIndex ? chord : c));
        }
        setEditingIndex(null);
    };

    const currentAnalysis = analysis[currentChordIndex];
    const nextAnalysis = currentChordIndex < analysis.length-1 ? analysis[currentChordIndex + 1] : analysis[0];

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
                onChange={e => setBpm(Number(e.target.value))}
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
            <input type="checkbox" checked={muteTicks} onChange={e => setMuteTicks(e.target.checked)} />
            <label>Mute Tick</label>
            <input type="checkbox" checked={muteChords} onChange={e => setMuteChords(e.target.checked)} />
            <label>Mute Strum</label>
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
                        <label>Show current chord's mode</label>
                    </div>
                </div>
                <div className="text-sm text-gray-400">
                    {showBlue && <> <span className="text-blue-400 font-semibold">Blue</span> = {currentAnalysis.root} {currentAnalysis.mode} scale &nbsp;·&nbsp;  </>}
                    <span className="text-amber-400 font-semibold">Amber</span> = {nextAnalysis.root} {nextAnalysis.quality} tones (next chord)
                </div>
                <FretboardDisplay
                    scaleTones={currentAnalysis.scaleTones}
                    targetTones={nextAnalysis.chordTones}
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
