import { useState } from "react";

export default function useSudoku(board, setBoard, selectedEntry, setSelectedEntry, setKeyboardCount, previousNumber, 
                            setPreviousNumber, candidateValues, setCandidateValues)
 {
    const [conflictedEntries, setConflictedEntries] = useState([]);
    const [isNormalButton, setIsNormalButton] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);
    let currentNumber = 0;

    function getRowFromIndex(index) {
        //console.log("getRowFromIndex", index, Math.floor(index/9));
        return Math.floor(index / 9);
    }
    function getColumnFromIndex(index) {
        //console.log("getColumnFromIndex", index, index % 9);
        return index % 9;
    }
    function getSelectedRow() {
        let entry = selectedEntry.split(",");
        //console.log("getSelectedRow()", entry[0]);
        return +entry[0];
    }
    function getSelectedColumn() {
        let entry = selectedEntry.split(",");
        //console.log("getSelectedColumn", entry[1]);
        return +entry[1];
    }
    function getSelectedIndex() {
        return getSelectedRow() * 9 + getSelectedColumn();
    }
    function getValueFromIndex(index) {
        const row = getRowFromIndex(index);
        const col = getColumnFromIndex(index);
        const rowAndCol = row + "," + col;
        const element = document.querySelector(`[rowcol="${rowAndCol}"]`);
        const value = element.getAttribute("numbervalue");
        return value;
    }

    function setNewBoardEntry(key) {
        let row = getSelectedRow();
        let column = getSelectedColumn();
        let boardEntry = +row * 9 + +column;
        //console.log("setNewBoardEntry", selectedEntry, "key:", key);
        const newEntries = [...board];
        newEntries[boardEntry] = key;
        setBoard(newEntries);
    }

    // determines if two cells are in the same 3x3 subgrid
    function areCellsInSameSubgrid(row1, col1, row2, col2) {
        //console.log("areCellsInSameSubgrid", row1, col1, row2, col2);
        const subgridRow1 = Math.floor(row1 / 3);
        const subgridCol1 = Math.floor(col1 / 3);
        const subgridRow2 = Math.floor(row2 / 3);
        const subgridCol2 = Math.floor(col2 / 3);
        return subgridRow1 === subgridRow2 && subgridCol1 === subgridCol2;
    }

    // check the given cell against all the values in its 3x3 grid and row/column
    function checkGridForConflicts(cellIndex, conflictsSet) {
        //console.log("cgfc called with", cellIndex, conflictsSet, "selectedIndex");
        // TOFIX: if the currentRow is 3 or more rows away from the one we are checking it can never be in the same 3x3 grid
        const currentBoard = [...board];
        // update currentBoard with the current selection since state is old....
        currentBoard[getSelectedIndex()] = currentNumber;
        //console.log("cgfc.currentNumber", currentNumber);
        // if currentNumber is 0 can I return?
        let currentRow = getRowFromIndex(cellIndex);
        let currentColumn = getColumnFromIndex(cellIndex);
        let currentValue = currentBoard[cellIndex];
        let hasConflicts = false;
        for (let index = 0; index < 81; index++) {
            if (currentBoard[index] == 0) continue;
            if (index == cellIndex) continue;
            let entryRow = Math.floor(index / 9);
            let entryColumn = index % 9;
            //console.log("cgfc.entryRow", entryRow, "entryColumn", entryColumn);
            if (areCellsInSameSubgrid(currentRow, currentColumn, entryRow, entryColumn)) {
                // the board entry is in same 3x3 grid...check if there is a conflict
                //console.log("cgfc.checking index", index, "against value", currentValue);
                if (currentBoard[index] == currentValue) {
                    hasConflicts = true;
                    console.log("cgfc.CONFLICT1 (grid):", index, "with number", currentValue);
                    conflictsSet.add(index);
                }
            }
            // check if the board entry is in the same row
            if (entryRow == currentRow && (currentBoard[index] == currentValue)) {
                hasConflicts = true;
                console.log("cgfc.CONFLICT2: (row)", index, "with number", currentValue);
                conflictsSet.add(index);
            }
            // check if the board entry is in the same column
            if (entryColumn == currentColumn && (currentBoard[index] == currentValue)) {
                hasConflicts = true;
                console.log("cgfc.CONFLICT3: (column)", index, "with number", currentValue);
                conflictsSet.add(index);
            }
        };
        if (hasConflicts == false) {
            console.log("cgfc.DELETING: cellIndex had no conflicts", cellIndex);
            conflictsSet.delete(cellIndex);
        }
        else {
            // we skipped over the passed in cell so we need to add it to the collection of conflicts
            conflictsSet.add(cellIndex);
        }
        //console.log("cgfc.conflictsSet.end", conflictsSet, "currentValue", currentValue);
    }

    // determine the number of entries that have numbers in them
    function getGridCount() {
        let boardCountArray = board.filter(function(element) {
            return element !== 0;
        });
        return boardCountArray.length;
    }
    function updateNormalEntry(key) {
        showNormalEntryCell();
        let prevConflicts = new Set(conflictedEntries);
        let newConflicts = new Set();
        let completeSetOfConflicts = new Set();
        //console.log("updateNormalEntry.prevConflicts - Start", prevConflicts);
        currentNumber = key;
        setNewBoardEntry(key);
        // first check the current entry for conflicts
        //console.log("updateNormalEntry.currentNumber", currentNumber);
        checkGridForConflicts(getSelectedIndex(), newConflicts);
        completeSetOfConflicts = new Set([...newConflicts]);
        // now check old conflicts and see if they are still conflicts
        prevConflicts.forEach((entry) => {
            newConflicts = new Set();
            //console.log("updateNormalEntry.checking conflictedEntry", entry, " and its value is ", getValueFromIndex(entry));
            checkGridForConflicts(entry, newConflicts);
            completeSetOfConflicts = new Set([...completeSetOfConflicts, ...newConflicts]);
        });
        //console.log("updateNormalEntry.prevConflicts - End", prevConflicts);
        setConflictedEntries(Array.from(completeSetOfConflicts));
        //console.log("updateSelectedEntries. grid has the folling count of numbers", getGridCount() + 1);
        if (getGridCount() + 1 == 81 && completeSetOfConflicts.size == 0) {
            console.log("updateNormalEntry.GAME OVER....Congratulations.......");
            setIsGameOver(true);
        }
        // calculate keyboard count
        calculateKeyboardCount(key);
    }

    // if the Normal button is hit, the number keys are centered
    // if the Candidate button is hit, the number keys are in grid formation
    function handleNormalCandiateButtonClick(isNormalButton) {
        let normalButton = document.getElementById("normal-button");
        let candidateButton = document.getElementById("candidate-button");
       
        normalButton.style.background = isNormalButton ? "black" : "white";
        normalButton.style.color = isNormalButton ? "white" : "black";
        candidateButton.style.background = isNormalButton ? "white" : "black";
        candidateButton.style.color = isNormalButton ? "black" : "white";
        
        const normalKeyboardElement = document.getElementById("normal-keyboard");
        const candidateKeyboardElement = document.getElementById("candidate-keyboard");
        console.log("nk", normalKeyboardElement, "ck", candidateKeyboardElement);
        // TOFIX: just use a state variable and let the component handle the display of each of these
        if (isNormalButton) {
            normalKeyboardElement.setAttribute("style", "display: grid")
            candidateKeyboardElement.setAttribute("style", "display: none");
        }
        else {
            normalKeyboardElement.setAttribute("style", "display: none")
            candidateKeyboardElement.setAttribute("style", "display: grid");
        }
        //isNormalButton ? updateNormalButtonKeys() : updateCandidateButtonKeys();
        setIsNormalButton(isNormalButton);
    }

    // Handle the selection of a candidate number. Since the array of candidates has to match the initialBoard array
    // that will be sliced() into chunks, it is just easier to have the candidateValues as the full set (0 to 80)
    function handleCandidateNumber(number) {
        const index = getSelectedIndex();
        console.log("handleCandidateNumber.index", index, "candidateValues", candidateValues);
        const newEntries = candidateValues.map((entry) => {
            if (entry.id == index) {
                console.log("entry.id == index", entry.id, index, entry.numbers);
                if (entry.numbers.includes(number)) {
                    console.log("entry already included ", number);
                    // we need to remove it...
                    const newNumbers = entry.numbers.filter(item => item != number);
                    return {...entry, selected: true, numbers: newNumbers}
                }
                else {
                    // and the new number to the list
                    console.log("entry does not have ", number);
                    return {...entry, selected: true, numbers: [...entry.numbers, number]}
                }
            }
            else {
                return entry;
            }
        });
        setCandidateValues(newEntries);
    }

    function showNormalEntryCell() {
        const index = getSelectedIndex();
        console.log("showNormalEntryCell.index", index);

        const newEntries = candidateValues.map((entry) => {
            if (entry.id == index) {
                console.log("showNormalEntryCell.entry found selectedCell ", index);
                return {...entry, selected: false}
            }
            else {
                return entry;
            }
        });
        setCandidateValues(newEntries);
    }

    // handle keypad entry
    function handleKeyup({ key }) {
        //key = +key;
        console.log("handleKeyUp", key);
        if (/^[0-9]$/.test(key)) {
            console.log("a number was pressed", key);
            updateNormalEntry(key);
        }
        if (key == "Backspace" || key == "Delete") {
            updateNormalEntry(0);
        }
    }

    // handle mouse entry
    // 1. Mouse was clicked in the Board area
    // 2. Mouse was clicked on the Keyboard area on a number or x
    // 3. Mouse was clicked in the Keyboard area on the Normal or Candidate button
    // 4. Mouse was clicked outside of both Board and Keyboard (ignore)
    function handleMouseup(event) {
        //console.log("mouseUp", event.target, event);
        const selectedElement = event.target;
        //Show Subscripts label or input field was selected...just return
        if (selectedElement.tagName == "LABEL" || selectedElement.tagName == "INPUT") return;
        const boardSelected = selectedElement.classList.contains("cell");

        // 1. Board area was clicked.  Was an original number hit??
        if (boardSelected) {
            //console.log("mouseup.boardSelected", selectedElement.tagName);
            const tagName = selectedElement.tagName;
            const isTileStart = selectedElement.classList.contains("tile-start");
            if (isTileStart) return;
            const selectedCell = event.target.getAttribute("rowcol");
            let numberValue = event.target.getAttribute("numbervalue");
            if (numberValue == null || numberValue == undefined) numberValue = 0;
            setPreviousNumber(numberValue);
            //console.log("handleMouseup.numberValue", numberValue);
            setSelectedEntry(selectedCell);
            return;
        }
        // 2. Check the delete button
        let buttonId = event.target.className;
        console.log("buttonId", buttonId);
        //console.log("event.target.textContent", event.target.textContent);
        if (buttonId === "delete-button") {
            console.log("mouseUp.delete-button");
                updateNormalEntry(0);
                return;
        }
        // 3. Check the normal number keypad
        const isNormal = selectedElement.hasAttribute("normal-number");
        if (isNormal) {
            console.log("mouseUp normal-number hit");
            const number = selectedElement.getAttribute("normal-number");
            console.log("mouseUp normal-numer hit...sending to handleKeyup", number);
            setPreviousNumber(+number)
            updateNormalEntry(+number);
            return;
        }
       
        // 4. Handle a Candidate button click
        const isCandidate = selectedElement.hasAttribute("candidate-number");
        console.log("selectedElement", selectedElement, "isCandidate", isCandidate);
        if (isCandidate) {
            const number = selectedElement.getAttribute("candidate-number");
            console.log("mouseUp candidate-number hit", number);
            handleCandidateNumber(parseInt(number));
            return;
        }

        // 5. Either the Normal or Candidate button was pressed
        if (selectedElement.tagName == "BUTTON") {
            const isNormalButton = selectedElement.classList.contains("normal-button");
            const isCandidateButton = selectedElement.classList.contains("candidate-button");
            console.log("Normal or Candiate button hit", isNormalButton, isCandidateButton);
            handleNormalCandiateButtonClick(isNormalButton);
            return;
        }

        // the board was not clicked on
        console.log("Board and Keyboard were NOT hit");
    }

    // calculate how many times each number appears in the puzzle...We must add the current key that was hit since
    // the board state variable will not be update yet. We also must take into consideration any value that was
    // previously in the cell that we just entered a number into. This is held in the previousNumber state variable
    function calculateKeyboardCount(key) {
        const numberBoard =  [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < board.length; i++) {
            let j = board[i];
            if (j == 0 ) continue;
            numberBoard[j-1] = numberBoard[j-1] + 1;
        }
        if (key != 0) {
            //console.log("calculateKeyboardCount.adding on to key", key);
            numberBoard[key-1] = numberBoard[key-1] + 1;
        }
        if (previousNumber != 0) {
            //console.log("calculateKeyboardCount subracting 1 from numberBoard prev ", previousNumber);
            numberBoard[previousNumber-1] = numberBoard[previousNumber-1] - 1;
        }
        //console.log("calculateKeyboardCount", numberBoard, board);
        setPreviousNumber(key);
        setKeyboardCount(numberBoard);
    }

    return { handleKeyup, handleMouseup, conflictedEntries, isNormalButton, isGameOver };
}