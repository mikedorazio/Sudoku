import { useState, useEffect } from "react";
import useSudoku from "./hooks/useSudoku";
import initialBoard, { keyboardNumbers, theData, randomIndex, autoCandidates } from "./data.js";
import Keyboard from "./Keyboard";
import Box from "./Box.jsx";
import { Fragment } from "react";
import ReactConfetti from "react-confetti";

export default function Board() {
    const [board, setBoard] = useState([...initialBoard]);
    const [allData, setAllData] = useState(theData);
    const [allChunks, setAllChunks] = useState(initializeAllChunks);
    const [keyboardCount, setKeyboardCount] = useState([...keyboardNumbers]);
    const [showSubscripts, setShowSubscripts] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(getInitialSelection);
    const [previousNumber, setPreviousNumber] = useState(0);
    const [showAutoCandidates, setShowAutoCandidates] = useState(false);
    const { handleKeyup, handleMouseup, conflictedEntries, isGameOver } = useSudoku(board, setBoard, allData, setAllData, selectedEntry, 
                                                                                    setSelectedEntry, setKeyboardCount, previousNumber, setPreviousNumber);

    console.log("Board Component rendering", allData);

    function getInitialSelection() {
        const firstZero = initialBoard.findIndex((element) => element === 0);
        //console.log("Board.getInitialSelection", initialBoard, firstZero);
        const row = Math.floor(firstZero / 9);
        const col = firstZero % 9;
        return row + "," + col;
    }

    function initializeAllChunks() {
        let chunks = [];
        for (let i = 0; i < allData.length; i += 3) {
            chunks.push(allData.slice(i, i + 3));
        }
        return chunks;
    }

    function handleSubscripts(event) {
        setShowSubscripts(event.target.checked);
    }
    function handleAutoCandidates(event) {
        setShowAutoCandidates(event.target.checked);
    }

    useEffect(() => {
        //console.log("Board useEffect is rendering", board, candidateValues);
        let aChunks = [];
        for (let i = 0; i < initialBoard.length; i += 3) {
            aChunks.push(allData.slice(i, i + 3));
        }
        //console.log("Board.useEffect setting chunks", myChunks);
        setAllChunks(aChunks);
    }, [board, allData]);

    useEffect(() => {
        window.addEventListener("keyup", handleKeyup);
        window.addEventListener("mouseup", handleMouseup);

        if (isGameOver) {
            window.removeEventListener("keyup", handleKeyup);
            window.removeEventListener("mouseup", handleMouseup);
        }
        return () => {
            window.removeEventListener("keyup", handleKeyup);
            window.removeEventListener("mouseup", handleMouseup);
        };
    }, [handleKeyup, handleMouseup]);

    return (
        <>
            {isGameOver && <ReactConfetti />}
            <h1>Apostle John's Sudoku Game (# {randomIndex + 1}) </h1>
            <div className="board-keyboard-container">
                <div className="sudoku-board" id="sudoku-board">
                    {allChunks.map((chunk, index) => (
                        <Fragment key={index}>
                            <div className="box" rownumber={Math.floor(index / 9)}>
                                <Box
                                    key={index}
                                    allChunk={allChunks[index]}
                                    originalValues={initialBoard}
                                    chunkIndex={index}
                                    selectedEntry={selectedEntry}
                                    conflictedEntries={conflictedEntries}
                                    showSubscripts={showSubscripts}
                                    showAutoCandidates={showAutoCandidates}
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
                        <Keyboard keyboardCount={keyboardCount} />
                        <div className="subscripts-container">
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
                        <div className="autocandidates-container">
                            <label htmlFor="input-autocandidates" ac="true">
                                <input
                                    id="input-autocandidates"
                                    type="checkbox"
                                    ac="true"
                                    name="showAutoCandidates"
                                    value={showAutoCandidates}
                                    onChange={handleAutoCandidates}
                                />
                                Auto Candidate Mode
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
