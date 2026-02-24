import { useState } from "react";
import type { Chord } from "../../types/chord";
import ChordBox from "../ChordBox/ChordBox";

const ChordProgressionEditor: React.FC = () => {
    const [chords, setChords] = useState<Chord[]>([]);
    return (
        <div className="flex flex-wrap gap-3 p-4 bg-gray-900 rounded-xl min-h-[200px] max-w-2xl">
            {chords.map((chord, index) => (
                <ChordBox chord={chord}/>
            ))}
            <button onClick={() => setChords([...chords, { root: "C", quality: "maj", beats: 4 }])}>
                Add C Major
            </button>
        </div>
    );
};

export default ChordProgressionEditor;