import { useState, useEffect } from "react";
import useSudoku from "./hooks/useSudoku";
import initialBoard, { keyboardNumbers, randomIndex, candidates, autoCandidates } from "./data.js";
import Keyboard from "./Keyboard";
import Box from "./Box.jsx";
import { Fragment } from "react";
import ReactConfetti from "react-confetti";

export default function Board() {
    const [board, setBoard] = useState([...initialBoard]);
    const [chunks, setChunks] = useState(initializeChunks);
    const [candidateChunks, setCandidateChunks] = useState(initializeCandidateChunks);
    const [autoCandidateChunks, setAutCandidateChunks] = useState(initializeAutoCandidateChunks);
    const [keyboardCount, setKeyboardCount] = useState([...keyboardNumbers]);
    const [showSubscripts, setShowSubscripts] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(getInitialSelection);
    const [previousNumber, setPreviousNumber] = useState(0);
    const [candidateValues, setCandidateValues] = useState(candidates);
    const [autoCandidateValues, setAutoCandidateValues] = useState(autoCandidates);
    const [showAutoCandidates, setShowAutoCandidates] = useState(false);
    const { handleKeyup, handleMouseup, conflictedEntries, isNormalButton, isGameOver } = useSudoku(
                board,
                setBoard,
                selectedEntry,
                setSelectedEntry,
                setKeyboardCount,
                previousNumber,
                setPreviousNumber,
                candidateValues,
                setCandidateValues,
                autoCandidateValues,
                setAutoCandidateValues,
    );

    console.log("Board Component rendering", showAutoCandidates, autoCandidateValues);

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
            chunks.push(initialBoard.slice(i, i + 3));
        }
        return chunks;
    }
    function initializeCandidateChunks() {
        let chunks = [];
        for (let i = 0; i < candidates.length; i += 3) {
            chunks.push(candidates.slice(i, i + 3));
        }
        return chunks;
    }

    function initializeAutoCandidateChunks() {
        let chunks = [];
        for (let i = 0; i < autoCandidates.length; i += 3) {
            chunks.push(autoCandidates.slice(i, i + 3));
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
        let myChunks = [];
        let canChunks = [];
        let aChunks = [];
        for (let i = 0; i < initialBoard.length; i += 3) {
            myChunks.push(board.slice(i, i + 3));
            canChunks.push(candidateValues.slice(i, i + 3));
            aChunks.push(autoCandidateValues.slice(i, i + 3));
        }
        //console.log("Board.useEffect setting chunks", myChunks);
        setChunks(myChunks);
        setCandidateChunks(canChunks);
        setAutCandidateChunks(aChunks);
    }, [board, candidateValues, autoCandidateValues]);

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
                    {chunks.map((chunk, index) => (
                        <Fragment key={index}>
                            <div className="box" rownumber={Math.floor(index / 9)}>
                                <Box
                                    key={index}
                                    chunk={chunk}
                                    canChunk={candidateChunks[index]}
                                    autoChunk={autoCandidateChunks[index]}
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
