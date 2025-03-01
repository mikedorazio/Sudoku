export default function Candidate({entryIndex, canValue}) {

    let displayValue = canValue.selected ? "show" : "hide";
    if (entryIndex < 3) {
        console.log("Candidate.canValue", canValue);
    }

    let row = Math.floor(entryIndex / 9) ;
    let column = entryIndex % 9;
    let rowColumn = row + "," + column;
    const realNumbers = [1,2,3,4,5,6,7,8,9];
    const candidateNumbers = realNumbers.map((number, index) => {
        if (canValue.numbers.includes(number)) {
            return number;
        }
        else {
            return "";
        }
    })

    return (
        <div className="cell candidate-container" rowcol={rowColumn} displayvalue={displayValue} entryindex={entryIndex} row="0">
            {realNumbers.map((number, index) => {
                return <div key={index} className="cell-candidate" sub="{number}">
                         {canValue.selected ? candidateNumbers[index] : null}
                        </div>
            })}
        </div>
    );
}
