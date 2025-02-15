import { useState, useEffect } from "react";
import Cell from "./Cell";
import useSudoku from "./hooks/useSudoku";
import initialBoard from "./data.js";
import Keyboard from "./Keyboard";
import Box from "./Box.jsx";
import { Fragment } from "react";

export default function Board() {
    const [board, setBoard] = useState([...initialBoard]);
    const [chunks, setChunks] = useState(initializeChunks);
    const [showSubscripts, setShowSubscripts] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState("0,2");
    const { handleKeyup, handleMouseup, conflictedEntries } = useSudoku(board, setBoard, chunks, setChunks, selectedEntry, setSelectedEntry);

    console.log("Board Component rendering");
    
    function initializeChunks() {
        let chunks = [];
        for (let i = 0; i < initialBoard.length; i += 3) {
            chunks.push(initialBoard.slice(i, i + 3));
        }
        return chunks;
    }

    function handleSubscripts(event) {
        setShowSubscripts(event.target.checked);
    }

    useEffect(() => {
        console.log("Board useEffect is rendering");
        let myChunks = [];
        for (let i = 0; i < initialBoard.length; i += 3) {
            myChunks.push(board.slice(i, i + 3));
        }
        setChunks(myChunks);
    }, [board]);

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
            <div className="sudoku-board">
                {chunks.map((chunk, index) => (
                    <Fragment key={index}>
                    <div className="box" rownumber={Math.floor(index / 9)}>
                        <Box
                            key={index}
                            chunk={chunk}
                            originalValues={initialBoard}
                            chunkIndex={index}
                            selectedEntry={selectedEntry}
                            conflictedEntries={conflictedEntries}
                            showSubscripts={showSubscripts}
                        />
                    </div>
                    {index == 8 || index == 17 ? 
                        <>
                        <div className="spacer"> </div>
                        <div className="spacer"> </div>
                        <div className="spacer"> </div>
                        </>
                        : null
                    }
                    </Fragment>
                ))}
            </div>

            <div className="keyboard">
                <Keyboard />
                <label htmlFor="input-sub">
                    <input
                        id="input-sub"
                        size="50"
                        type="checkbox"
                        name="showSubscripts"
                        value={showSubscripts}
                        onChange={handleSubscripts}
                    />
                    Show Subscripts
                </label>
            </div>
        </div>
    );
}
