export default function Cell({ value, originalValue, entryIndex, selectedEntry, conflict, showSubscripts }) {

    // only original values should have tile-start attribute
    let className = (value == originalValue && value != 0) ? "cell tile-start" : "cell";

    let row = Math.floor(entryIndex / 9) ;
    let column = entryIndex % 9;
    let rowColumn = row + "," + column;

    if (rowColumn === selectedEntry) {
        console.log("updating to add selected");
        className = className + " selected";
    }

    if (conflict) {
        className = className + " conflict";
        //className = className + " subscript-circle"
    }

    //console.log("Cell.showSubscripts", showSubscripts);
    //console.log("entryIndex", entryIndex, "row", row, "column", column, "rowColumn", rowColumn, "origValue", originalValue);

    return (
        <div key={entryIndex} className={className} rowcol={rowColumn} value={value}> {value != 0 ? value : " "} 
            {showSubscripts
            ?
            <sub className="entry-subscript">{entryIndex}</sub>
            :
            null}
        </div>
    )
}