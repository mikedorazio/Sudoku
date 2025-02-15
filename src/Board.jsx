import { useState, useEffect } from "react";
import Cell from "./Cell";
import useSudoku from "./hooks/useSudoku";
import initialBoard from './data.js';
import Keyboard from "./Keyboard";

export default function Board() {
    const [board, setBoard] = useState([...initialBoard]);
    const [showSubscripts, setShowSubscripts] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState("0,2");
    const { handleKeyup, handleMouseup, conflictedEntries} = useSudoku(board, setBoard, selectedEntry, setSelectedEntry);

    function handleSubscripts(event) {
        setShowSubscripts(event.target.checked);
    }

    useEffect(() => {
        window.addEventListener("keyup", handleKeyup);
        window.addEventListener("mouseup", handleMouseup);

        return () => {
            window.removeEventListener("keyup", handleKeyup);
            window.removeEventListener("mouseup", handleMouseup);
        };
    }, [handleKeyup, handleMouseup]);

    return (
        <div className="board-keyboard-container">
            <div className="board">
                {board.map((value, index) => (
                    <div key={index} className="entry" rownumber={Math.floor(index / 9)}>
                        <Cell
                            key={index}
                            value={value}
                            originalValue={initialBoard[index]}
                            entryIndex={index}
                            selectedEntry={selectedEntry}
                            conflict={conflictedEntries.includes(index)}
                            showSubscripts={showSubscripts}
                        />
                    </div>
                ))}
            </div>

            <div className="keyboard">
                <Keyboard />
                <label htmlFor="input-sub">
                <input id="input-sub" size="50" type="checkbox" name="showSubscripts" value={showSubscripts} 
                                    onChange={handleSubscripts} />
                Show Subscripts
                </label>
            </div>

           
        </div>
    );
}
