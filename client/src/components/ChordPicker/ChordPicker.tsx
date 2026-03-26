import type { Chord } from "../../types/chord";
import { useState } from "react";

interface ChordPickerProps {
    onSelect: (chord: Chord) => void;
    onCancel: () => void;
    initialChord?: Chord;
}

const ChordPicker = ({ onSelect, onCancel, initialChord }: ChordPickerProps) => {
    const [root, setRoot] = useState(initialChord?.root ?? 'C');
    const [quality, setQuality] = useState(initialChord?.quality ?? 'major');
    const [beats, setBeats] = useState(initialChord?.beats ?? 4);
    const selectClass = "bg-gray-700 text-white rounded p-2 w-full";
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col gap-4">
                <select className={selectClass} value={root} onChange={e => setRoot(e.target.value)}>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>
                {/* <select>
                    <option value="natural">natural</option>
                    <option value="sharp">sharp</option>
                    <option value="flat">flat</option>
                </select> */}
                <select className={selectClass} value={quality} onChange={e => setQuality(e.target.value)}>
                    <option value="major">major</option>
                    <option value="minor">minor</option>
                    <option value="dom7">dom7</option>
                </select>
                <select className={selectClass} value={beats} onChange={e => setBeats(Number(e.target.value))}>
                    <option value="1">1 beat</option>
                    <option value="2">2 beats</option>
                    <option value="3">3 beats</option>
                    <option value="4">4 beats</option>
                </select>
                <button onClick={() => {onSelect({ root, quality, beats: beats })}}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default ChordPicker;