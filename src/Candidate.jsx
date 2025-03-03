export default function Candidate({entryIndex, canValue, autoValue, showAutoCandidates, selectedEntry}) {

    let displayValue = canValue.selected || (showAutoCandidates && autoValue.selected) ? "show" : "hide";

    let className = "cell candidate-container";
    let row = Math.floor(entryIndex / 9) ;
    let column = entryIndex % 9;
    let rowColumn = row + "," + column;
    if (rowColumn === selectedEntry) {
        //console.log("updating to add selected");
        className = className + " selected";
    }

    const realNumbers = [1,2,3,4,5,6,7,8,9];
    const candidateNumbers = realNumbers.map((number, index) => {
        if (autoValue.numbers.includes(number)) {
            return number;
        }
        else {
            return "";
        }
    })

    //console.log("Candidate.");
    return (
        <div className={className} rowcol={rowColumn} displayvalue={displayValue} entryindex={entryIndex} row="0">
            {realNumbers.map((number, index) => {
                return <div key={index} className="cell-candidate" sub={number}>
                         {autoValue.selected ? candidateNumbers[index] : null}
                        </div>
            })}
        </div>
    );
}
