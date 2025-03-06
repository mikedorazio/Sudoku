export default function Candidate({entryIndex, canValue, autoValue, showAutoCandidates, selectedEntry}) {
    if (entryIndex < 5) {
        console.log("Candidate.showAutoCandidates", entryIndex, showAutoCandidates);
    }
    // TOFIX: probably dont need this. we can probably hard code "show" in the div
    //let displayValue = "show";

    let className = "cell candidate-container";
    let row = Math.floor(entryIndex / 9) ;
    let column = entryIndex % 9;
    let rowColumn = row + "," + column;
    if (rowColumn === selectedEntry) {
        //console.log("updating to add selected");
        className = className + " selected";
    }

    const realNumbers = [1,2,3,4,5,6,7,8,9];
    const canOrAuto = showAutoCandidates ? autoValue : canValue;
    if (entryIndex < 5) {
        console.log("Candidates.canOrAuto", canOrAuto);
    }
    const candidateNumbers = realNumbers.map((number, index) => {
        if (canOrAuto.includes(number)) {
            return number;
        }
        else {
            return "";
        }
    })

    if (entryIndex < 3) {
        console.log("Candidate.numbers" + canValue.numbers);
    }
    return (
        <div className={className} rowcol={rowColumn} displayvalue="show" entryindex={entryIndex} row="0">
            {realNumbers.map((number, index) => {
                return <div key={index} className="cell-candidate" sub={number}>
                         {candidateNumbers[index]}
                        </div>
            })}
        </div>
    );
}
