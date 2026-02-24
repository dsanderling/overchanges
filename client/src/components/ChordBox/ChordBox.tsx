import type { Chord } from "../../types/chord";

interface ChordBoxProps {
    chord: Chord;
}

const ChordBox: React.FC<ChordBoxProps> = ({ chord }) => {
    return (
        <div className="bg-gray-800 text-white rounded-lg p-3">
            {chord.root} {chord.quality}
        </div>
    );
};

export default ChordBox;