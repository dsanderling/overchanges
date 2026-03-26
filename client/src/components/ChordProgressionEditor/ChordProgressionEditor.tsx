import { useState } from "react";
import type { Chord } from "../../types/chord";
import ChordBox from "../ChordBox/ChordBox";
import ChordPicker from "../ChordPicker/ChordPicker";

const ChordProgressionEditor = () => {
    const [chords, setChords] = useState<Chord[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const handleSelect = (chord: Chord) => {
        if (editingIndex === -1) {
            setChords([...chords, chord]);
        }
        else {
            setChords(chords.map((c,i) => i === editingIndex ? chord : c));
        }
        setEditingIndex(null);
    }

    return (
        <>
        <div className=" flex flex-wrap gap-3 p-4 bg-gray-900 rounded-xl min-h-[200px] max-w-2xl">
            {chords.map((chord, index) => (
                <ChordBox key={index} chord={chord} onEdit={() => setEditingIndex(index)}/>
            ))}
            <button onClick={() => setEditingIndex(-1)}>
                Add chord
            </button>
        </div>
        {editingIndex!==null && (
            <ChordPicker onSelect={handleSelect} onCancel={()=>{setEditingIndex(null);}} initialChord={editingIndex>=0 ? chords[editingIndex] : undefined} />
        )}
        </>
    );
};

export default ChordProgressionEditor;