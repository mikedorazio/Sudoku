import {Fragment} from 'react';
import Cell from './Cell';
import Candidate from './Candidate';

export default function Box({chunk, canChunk, originalValues, chunkIndex, selectedEntry, conflictedEntries, showSubscripts}) {
    //console.log("Box.chunk", chunk, originalValues, chunkIndex, selectedEntry, conflictedEntries, showSubscripts);
    //const isCellCandidateTrue = candidateValues;
    //console.log("canChunk", canChunk);

    return (
        <>
            {chunk.map((value, index) => (
                <Fragment key={index}>
                <Cell
                    value={value}
                    canValue={canChunk[index]}
                    originalValue={originalValues[chunkIndex*3+index]}
                    entryIndex={chunkIndex*3 + index}
                    selectedEntry={selectedEntry}
                    conflict={conflictedEntries.includes(chunkIndex * 3 + index)}
                    showSubscripts={showSubscripts}
                />
                <Candidate
                    entryIndex={chunkIndex*3 + index}
                    canValue={canChunk[index]}
                    selectedEntry={selectedEntry}
                />
                </Fragment>
            ))} 
        </>
    )
}