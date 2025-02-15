import Cell from './Cell';

export default function Box({chunk, originalValues, chunkIndex, selectedEntry, conflictedEntries, showSubscripts}) {
    //console.log("Box.chunk", chunk, chunkIndex, selectedEntry, conflictedEntries, showSubscripts);

    return (
        <>
            {chunk.map((value, index) => (
                <Cell
                    key={index}
                    value={value}
                    originalValue={originalValues[chunkIndex*3+index]}
                    entryIndex={chunkIndex*3 + index}
                    selectedEntry={selectedEntry}
                    conflict={conflictedEntries.includes(chunkIndex * 3 + index)}
                    showSubscripts={showSubscripts}
                />   
            ))} 
        </>
    )
}