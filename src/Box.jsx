import Cell from './Cell';
import Candidate from './Candidate';

export default function Box({chunk, originalValues, chunkIndex, selectedEntry, conflictedEntries, showSubscripts}) {
    //console.log("Box.chunk", chunk, originalValues, chunkIndex, selectedEntry, conflictedEntries, showSubscripts);

    return (
        <>
            {chunk.map((value, index) => (
                <>
                <Cell
                    key={chunkIndex}
                    value={value}
                    originalValue={originalValues[chunkIndex*3+index]}
                    entryIndex={chunkIndex*3 + index}
                    selectedEntry={selectedEntry}
                    conflict={conflictedEntries.includes(chunkIndex * 3 + index)}
                    showSubscripts={showSubscripts}
                />
                <Candidate
                    key={chunkIndex*3 + index}
                    value={value}
                    entryIndex={chunkIndex*3 + index}
                    selectedEntry={selectedEntry}
                />
                </>
            ))} 
        </>
    )
}