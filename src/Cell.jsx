export default function Cell({ value, canValue, autoValue, originalValue, entryIndex, selectedEntry, conflict, showSubscripts, showAutoCandidates }) {

    // only original values should have tile-start attribute
    let className = (value == originalValue && value != 0) ? "cell tile-start" : "cell";

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

    if (entryIndex < 3) {
        console.log("Cell.canValue", canValue.selected, "showAuto", autoValue.selected);
    }
    
    let displayValue = canValue.selected || (showAutoCandidates && autoValue.selected) ? "hide" : "show";
    
   
    //console.log("Cell.entryIndex", entryIndex, "row", row, "column", column, "rowColumn", rowColumn, "origValue", originalValue);

    return (
        <div key={entryIndex} className={className} rowcol={rowColumn} displayvalue={displayValue}  numbervalue={value}> {value != 0 ? value : " "} 
            {showSubscripts
            ?
            <sub className="entry-subscript">{entryIndex}</sub>
            :
            null}
        </div>
    )
}