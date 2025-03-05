const boardData = 
[
   [5,3,0,0,7,0,0,0,0,   
    6,0,0,1,9,5,0,0,0,   
    0,9,8,0,0,0,0,6,0,    
    8,0,0,0,6,0,0,0,3,   
    4,0,0,8,0,3,0,0,1,
    7,0,0,0,2,0,0,0,6,   
    0,6,0,0,0,0,2,8,0,    
    0,0,0,4,1,9,0,0,5,    
    0,0,0,0,8,0,0,7,9],

   [0,0,0,0,0,1,7,3,0,
    2,7,6,0,5,0,0,8,9,
    3,1,0,7,0,9,2,6,4,
    0,5,3,0,4,0,0,7,0,
    0,0,8,5,0,7,4,0,0,
    0,4,0,0,1,0,3,5,0,
    5,2,7,3,0,4,0,1,6,
    6,8,0,0,7,0,5,4,3,
    0,3,1,8,0,0,0,0,0],

   [4,0,6,1,2,5,0,0,0,
    0,0,3,4,0,0,0,9,0,
    0,0,7,0,0,3,6,1,4,
    2,0,4,0,0,0,0,0,7,
    0,0,0,5,8,0,3,0,6,
    3,6,0,0,0,4,0,0,9,
    7,3,9,0,0,0,4,0,0,
    0,5,0,3,4,1,9,0,0,
    0,4,0,9,6,0,5,0,3],

   [0,0,0,0,6,0,2,4,3,
    0,2,4,9,3,0,0,0,6,
    0,0,1,4,7,0,0,0,8,
    6,0,2,0,0,9,8,0,7,
    8,1,0,2,0,7,0,3,0,
    7,0,0,0,0,6,4,0,2,
    0,9,0,5,0,3,0,0,0,
    0,0,0,6,0,1,3,2,0,
    2,3,8,0,9,0,0,0,0],

   [8,9,1,5,7,0,0,0,0,
    4,0,7,0,1,8,9,0,0,
    0,0,0,4,0,9,1,8,7,
    6,0,0,0,0,0,0,3,8,
    0,5,4,6,0,1,0,9,0,
    7,0,0,2,0,0,4,0,0,
    0,0,0,8,9,3,0,0,4,
    5,4,3,0,0,0,0,0,9,
    0,2,0,1,5,0,0,0,6]

]
// Mikey did the second game in the list on 11-17-14

//console.log("in boardData");
let boardSize = boardData.length;
export let randomIndex = Math.floor(Math.random() * boardSize);
let initialBoard = boardData[randomIndex];

export let keyboardNumbers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
for (let i = 1; i <= 9; i++) {
    keyboardNumbers[i-1] = initialBoard.filter(v => v == i).length;
}

// get an array of all potential candidate entries for every cell
export let candidates = [];
for (let i = 0; i < 81; i++) {
    const candidateObject = {id: i, selected: false, numbers: []};
    candidates.push(candidateObject);
}

// get an array of all potential auto candidates for every cell
export let autoCandidates = [];
for (let i = 0; i < 81; i++) {
    const candidateObject = {id: i, selected: false, numbers: []};
    autoCandidates.push(candidateObject);
}

// combine the numbers, candidates and autos to make an object that will be used 
// for the entire application

export let theData = [];
for (let i = 0; i < 81; i++) {
    let currentEntry = {id: i, number: initialBoard[i], candidates: [], autoCandidates: [], visible: "number"};
    theData.push(currentEntry);
}

export default initialBoard;