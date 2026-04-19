import { useState, useEffect } from "react";
import type { Chord } from "../../types/chord";
import ChordBox from "../ChordBox/ChordBox";
import ChordPicker from "../ChordPicker/ChordPicker";
import { playTick } from "../../utils/audio";

const ChordProgressionEditor = () => {
    const [chords, setChords] = useState<Chord[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentBeat, setCurrentBeat] = useState<number>(0);
    const [bpm, setBpm] = useState<number>(120);
    const [shouldLoop, setShouldLoop] = useState<boolean>(true);

    useEffect(() => { // runs when dependencies change
        if(!isPlaying) {
            setCurrentBeat(0);
            return;
        }
        const interval = setInterval(() => { 
            setCurrentBeat(prev => prev + 1);
        }, 60000/bpm);

        return () => clearInterval(interval); //cleanup
    }, [isPlaying, bpm]); // dependencies

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
        }
        else {
            setChords(chords.map((c,i) => i === editingIndex ? chord : c));
        }
        setEditingIndex(null);
    }

    const getCurrentChordIndex = () => {
        let beats = 0;
        for (let i = 0; i < chords.length; i++) {
            beats += chords[i].beats;
            if (currentBeat < beats) return i;
        }
        return null; // past the end
    };
    const currentChordIndex = getCurrentChordIndex();

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
            <input type="checkbox" checked={shouldLoop} onChange={e => setShouldLoop(e.target.checked)}></input> <label>Loop?</label>
        </div>
        {editingIndex!==null && (
            <ChordPicker onSelect={handleSelect} onCancel={()=>{setEditingIndex(null);}} initialChord={editingIndex>=0 ? chords[editingIndex] : undefined} />
        )}
        </>
    );
};

export default ChordProgressionEditor;