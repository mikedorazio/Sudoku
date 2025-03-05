import { useState } from "react";

export default function useSudoku(board, setBoard, allData, setAllData, selectedEntry, setSelectedEntry, setKeyboardCount, previousNumber, setPreviousNumber)
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

    function setNewBoardEntry(key) {
        let row = getSelectedRow();
        let column = getSelectedColumn();
        let boardEntry = +row * 9 + +column;
        //console.log("setNewBoardEntry", selectedEntry, "key:", key);
        // TOFIX: can we do a shallow copy here???
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

    // check the given cell value at given index against all the values in its 3x3 grid and row/column
    function checkGridForConflicts(cellIndex, conflictsSet) {
        //console.log("cgfc called with cellIndex", cellIndex, "currentNumber", currentNumber);
        const currentBoard = JSON.parse(JSON.stringify(allData));
        // update currentBoard with the current selection since state is old....
        currentBoard[cellIndex].number = currentNumber;
        //console.log("cgfc.currentNumber", currentNumber);
        let currentRow = getRowFromIndex(cellIndex);
        let currentColumn = getColumnFromIndex(cellIndex);
        // TOFIX : dont need to do this...just assign it currentNumber
        let currentValue = currentBoard[cellIndex].number;
        let hasConflicts = false;
        for (let index = 0; index < 81; index++) {
            if (currentBoard[index].number == 0) continue;
            if (index == cellIndex) continue;
            let entryRow = Math.floor(index / 9);
            let entryColumn = index % 9;
            //console.log("cgfc.entryRow", entryRow, "entryColumn", entryColumn);
            if (areCellsInSameSubgrid(currentRow, currentColumn, entryRow, entryColumn)) {
                // the board entry is in same 3x3 grid...check if there is a conflict
                //console.log("cgfc.checking index", index, "against value", currentValue);
                if (currentBoard[index].number == currentValue) {
                    hasConflicts = true;
                    //console.log("cgfc.CONFLICT1 (grid):", index, "with number", currentValue);
                    conflictsSet.add(index);
                }
            }
            // check if the board entry is in the same row
            if (entryRow == currentRow && (currentBoard[index].number == currentValue)) {
                hasConflicts = true;
                //console.log("cgfc.CONFLICT2: (row)", index, "with number", currentValue);
                conflictsSet.add(index);
            }
            // check if the board entry is in the same column
            if (entryColumn == currentColumn && (currentBoard[index].number == currentValue)) {
                hasConflicts = true;
                //console.log("cgfc.CONFLICT3: (column)", index, "with number", currentValue);
                conflictsSet.add(index);
            }
        };
        if (hasConflicts == false) {
            //console.log("cgfc.DELETING: cellIndex had no conflicts", cellIndex);
            conflictsSet.delete(cellIndex);
        }
        else {
            // we skipped over the passed in cell so we need to add it to the collection of conflicts
            conflictsSet.add(cellIndex);
        }
        //console.log("cgfc.conflictsSet.end", conflictsSet, "currentValue", currentValue);
    }

    // determine the number of entries that have numbers in them. this can be used to see if the game is over.
    function getGridCount() {
        let boardCountArray = board.filter(function(element) {
            return element !== 0;
        });
        return boardCountArray.length;
    }
    // update the cell after a normal number was entered
    function updateNormalEntry(key) {
        showNormalEntryCell(key);
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
setAutoCandidateValuesOn(key);
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
        setIsNormalButton(isNormalButton);
    }

    // Handle the selection of a candidate number. 
    function handleCandidateNumber(number) {
        const index = getSelectedIndex();
        let tempAllData = JSON.parse(JSON.stringify(allData));
        console.log("handleCandidateNumber.index", index, "candidateValues", allData[index].candidates);
        if (allData[index].candidates.includes(number)) {
            console.log("handleCandidateNumber.entry.id == index", index, number);
            console.log("handleCandidateNumber.entry already included ", number);
            // we need to remove it...   
        }
        else {
            // add the new number to the list
            console.log("handleCandidateNumber.entry does not have ", number);
            tempAllData[index].candidates.push(number);
        }
        tempAllData[index].visible = "candidates";
        setAllData(tempAllData);
    }

    function showNormalEntryCell(number) {
        const index = getSelectedIndex();
        console.log("showNormalEntryCell.index", index); 
        // copy the array into temp array, update the properties at index, set the allData state variable
        let tempAllData = [...allData];
        tempAllData[index].visible = "number"
        tempAllData[index].number = number;
        setAllData(tempAllData);
    }

    function setAutoCandidateValuesOn(index) {
        console.log("setAutoCandidateValues().entered with allData", allData);
        let candidates = [];
        let conflicts = {};
        let tempAllData = JSON.parse(JSON.stringify(allData));
        console.log("setAutoCandidateValues().tempAllData", tempAllData);
        // for every cell in the grid
        for (let i = 0; i < 81; i++) {
            let candidateObject = {};
            let autoCandidates = [];
            //console.log("setAutoCandidateValues", board[i]);
            if (allData[i].number != 0) {
                // skip entry since a normal number is already there
                console.log("setAutoCandidateValues skipping with previous number", i, board[i]);
                tempAllData[i].visible = "number";
            }
            else {
                if (i < 10) console.log("setAutoCandidateValues setting true with", i, board[i]);
                // for every eligible number, see if it is a good candidate
                for (let j = 1; j <= 9; j++) {
                    conflicts = new Set();
                    currentNumber = j;
                    checkGridForConflicts(i, conflicts);
                    if (i < 10) console.log("setAutoCandidatValues.conflicts", i, j, conflicts);
                    if (conflicts.size == 0) {   
                         autoCandidates.push(j); 
                         tempAllData[i].visible = "autos";
                    }           
                }
                if (i == index) {
                    tempAllData[i].visible = "number";
                }
                else {
                    tempAllData[i].visible = "autos";
                }
                tempAllData[i].autoCandidates = autoCandidates;
             }
            if (i < 10) console.log("setAutoCandidates pushing candidate object", candidateObject);
        }
        console.log("setAutoCandidates....will push tempAllData", tempAllData);
        setAllData(tempAllData);
        // console.log("getAutoCandidates.board", board, candidates);
    }

    function setAutoCandidateValuesOff(index) {
        console.log("setAutoCandidateValuesOff");
        // TOFIX: can we do a shallow copy here?
        let tempAllData = [...allData];
        for (let i = 0; i < 81; i++) {
            tempAllData[i].visible = "number";
        }
        setAllData(tempAllData);
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

    // handle mouse input
    // 1. Mouse clicked on Auto Candidate Mode
    // 2. Mouse clicked in the Board area
    // 3. Mouse clicked on the delete button
    // 4. Mouse clicked in the Keyboard area on the Normal or Candidate button
    // 5. Mouse clicked on a Candidate entry
    // 5. Mouse clicked outside of both Board and Keyboard (ignore)
    function handleMouseup(event) {
        console.log("handleMouseup.mouseUp", event.target, event, allData);
        const selectedElement = event.target;
        // 1. Auto Candidate Mode
        if (selectedElement.tagName == "LABEL" || selectedElement.tagName == "INPUT") {
            if (selectedElement.hasAttribute("ac")) {
                const value = selectedElement.getAttribute("value");
                console.log("handleMouseup.handle auto candidate mode", value);
                value === "false" ?  setAutoCandidateValuesOn(-1) : setAutoCandidateValuesOff(-1);
            }
            return;
        }
        // 2. Board area was clicked.  Was an original number hit??
        const boardSelected = selectedElement.classList.contains("cell");
        if (boardSelected) {
            console.log("handleMouseup.boardSelected", selectedElement.tagName);
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
        // 3. Check the delete button
        let buttonId = event.target.className;
        console.log("handleMouseup.buttonId", buttonId);
        //console.log("event.target.textContent", event.target.textContent);
        if (buttonId === "delete-button") {
            console.log("handleMouseup.delete-button clicked");
            console.log("mouseUp.delete-button");
                updateNormalEntry(0);
                return;
        }
        // 4. Check the normal number keypad
        const isNormal = selectedElement.hasAttribute("normal-number");
        if (isNormal) {
            console.log("handleMouseup.mouseUp normal-number hit");
            const number = selectedElement.getAttribute("normal-number");
            console.log("mouseUp normal-numer hit...sending to handleKeyup", number);
            setPreviousNumber(+number)
            updateNormalEntry(+number);
            return;
        }
       
        // 5. Handle a Candidate button click
        const isCandidate = selectedElement.hasAttribute("candidate-number");
        console.log("handleMouseup.selectedElement", selectedElement, "isCandidate", isCandidate);
        if (isCandidate) {
            const number = selectedElement.getAttribute("candidate-number");
            console.log("handleMouseUp candidate-number hit", number);
            handleCandidateNumber(parseInt(number));
            return;
        }

        // 6. Either the Normal or Candidate button was pressed
        if (selectedElement.tagName == "BUTTON") {
            const isNormalButton = selectedElement.classList.contains("normal-button");
            const isCandidateButton = selectedElement.classList.contains("candidate-button");
            console.log("handleMouseup.Normal or Candiate button hit", isNormalButton, isCandidateButton);
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