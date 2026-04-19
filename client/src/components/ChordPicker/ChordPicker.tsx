import type { Chord } from "../../types/chord";
import { useState } from "react";

interface ChordPickerProps {
    onSelect: (chord: Chord) => void;
    onCancel: () => void;
    initialChord?: Chord;
}

const ROOTS = [
    { value: 'C',  label: 'C' },
    { value: 'C#', label: 'C# / D♭' },
    { value: 'D',  label: 'D' },
    { value: 'D#', label: 'D# / E♭' },
    { value: 'E',  label: 'E' },
    { value: 'F',  label: 'F' },
    { value: 'F#', label: 'F# / G♭' },
    { value: 'G',  label: 'G' },
    { value: 'G#', label: 'G# / A♭' },
    { value: 'A',  label: 'A' },
    { value: 'A#', label: 'A# / B♭' },
    { value: 'B',  label: 'B' },
];

const QUALITIES = [
    { value: 'major', label: 'Major' },
    { value: 'minor', label: 'Minor' },
    { value: 'dom7',  label: 'Dominant 7' },
    { value: 'maj7',  label: 'Major 7' },
    { value: 'm7',    label: 'Minor 7' },
    { value: 'm7b5',  label: 'Minor 7♭5' },
];

const ChordPicker = ({ onSelect, onCancel, initialChord }: ChordPickerProps) => {
    const [root, setRoot] = useState(initialChord?.root ?? 'C');
    const [quality, setQuality] = useState(initialChord?.quality ?? 'major');
    const [beats, setBeats] = useState(initialChord?.beats ?? 4);
    const selectClass = "bg-gray-700 text-white rounded p-2 w-full";
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col gap-4 min-w-[220px]">
                <select className={selectClass} value={root} onChange={e => setRoot(e.target.value)}>
                    {ROOTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <select className={selectClass} value={quality} onChange={e => setQuality(e.target.value)}>
                    {QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                </select>
                <select className={selectClass} value={beats} onChange={e => setBeats(Number(e.target.value))}>
                    <option value="1">1 beat</option>
                    <option value="2">2 beats</option>
                    <option value="3">3 beats</option>
                    <option value="4">4 beats</option>
                </select>
                <button onClick={() => onSelect({ root, quality, beats })}>Confirm</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default ChordPicker;