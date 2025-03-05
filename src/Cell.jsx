export default function Cell({allData, originalValue, entryIndex, selectedEntry, conflict, showSubscripts }) {
    // only original values should have tile-start attribute
    let className = (allData.number == originalValue && allData.number != 0) ? "cell tile-start" : "cell";

    let row = Math.floor(entryIndex / 9) ;
    let column = entryIndex % 9;
    let rowColumn = row + "," + column;

    if (rowColumn === selectedEntry) {
        //console.log("updating to add selected");
        className = className + " selected";
    }

    if (conflict) {
        className = className + " conflict";
        //className = className + " subscript-circle"
    }
    
    //let displayValue = canValue.selected || (showAutoCandidates && autoValue.selected) ? "hide" : "show";
    
    if (entryIndex < 7) {
        console.log("Cell.allData", allData);
    }
    //console.log("Cell.entryIndex", entryIndex, "row", row, "column", column, "rowColumn", rowColumn, "origValue", originalValue);

    return (
        <div key={entryIndex} className={className} rowcol={rowColumn} displayvalue="show"
                                            numbervalue={allData.number}> {allData.number != 0 ? allData.number : " "} 
            {showSubscripts
            ?
            <sub className="entry-subscript">{entryIndex}</sub>
            :
            null}
        </div>
    )
}