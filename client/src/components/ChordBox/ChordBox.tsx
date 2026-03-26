import type { Chord } from "../../types/chord";

interface ChordBoxProps {
    chord: Chord;
    isActive: boolean;
    onEdit: () => void;
}

const ChordBox = ({chord, isActive, onEdit }: ChordBoxProps) => {
    return (
        <div onClick={onEdit} style={{ width: `${chord.beats * 48}px`}} 
            className={`${isActive ? 'bg-blue-600' : 'bg-gray-800' } text-white rounded-lg p-3`}>
            {chord.root} {chord.quality}
        </div>
    );
};

export default ChordBox;