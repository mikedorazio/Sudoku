import { useState, useEffect } from "react";
import useSudoku from "./hooks/useSudoku";
import initialBoard, { keyboardNumbers, randomIndex } from "./data.js";
import Keyboard from "./Keyboard";
import Box from "./Box.jsx";
import { Fragment } from "react";

export default function Board() {
    const [board, setBoard] = useState([...initialBoard]);
    const [chunks, setChunks] = useState(initializeChunks);
    const [keyboardCount, setKeyboardCount] = useState([...keyboardNumbers]);
    const [showSubscripts, setShowSubscripts] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(getInitialSelection);
    const [previousNumber, setPreviousNumber] = useState(0);
    const { handleKeyup, handleMouseup, conflictedEntries, isNormalButton } = useSudoku(
        board,
        setBoard,
        selectedEntry,
        setSelectedEntry,
        setKeyboardCount,
        previousNumber,
        setPreviousNumber
    );

    console.log("Board Component rendering", keyboardCount, board, previousNumber);

    function getInitialSelection() {
        const firstZero = initialBoard.findIndex((element) => element === 0);
        //console.log("Board.getInitialSelection", initialBoard, firstZero);
        const row = Math.floor(firstZero / 9);
        const col = firstZero % 9;
        return row + "," + col;
    }

    function initializeChunks() {
        let chunks = [];
        for (let i = 0; i < initialBoard.length; i += 3) {
            //console.log("initializeChunks.board", board);
            chunks.push(initialBoard.slice(i, i + 3));
        }
        return chunks;
    }

    function handleSubscripts(event) {
        setShowSubscripts(event.target.checked);
    }

    useEffect(() => {
        //console.log("Board useEffect is rendering", board);
        let myChunks = [];
        for (let i = 0; i < initialBoard.length; i += 3) {
            myChunks.push(board.slice(i, i + 3));
        }
        //console.log("Board.useEffect setting chunks", myChunks);
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
        <>
            <h1>Apostle John's Sudoku Game (# {randomIndex + 1}) </h1>
            <div className="board-keyboard-container">
                <div className="sudoku-board" id="sudoku-board">
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
                            {index == 8 || index == 17 ? (
                                <>
                                    <div className="spacer"> </div>
                                    <div className="spacer"> </div>
                                    <div className="spacer"> </div>
                                </>
                            ) : null}
                        </Fragment>
                    ))}
                </div>

                <div className="buttons-keyboard-container">
                    <div className="keyboard-header">
                        <button className="normal-button" id="normal-button">Normal</button>
                        <button className="candidate-button" id="candidate-button">Candidate</button>
                    </div>
                    <div className="keyboard">
                        <Keyboard keyboardCount={keyboardCount} isNormalButton={isNormalButton} />
                        <label htmlFor="input-sub">
                            <input
                                id="input-sub"
                                type="checkbox"
                                name="showSubscripts"
                                value={showSubscripts}
                                onChange={handleSubscripts}
                            />
                            Show Subscripts
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}
