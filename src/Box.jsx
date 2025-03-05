import {Fragment} from 'react';
import Cell from './Cell';
import Candidate from './Candidate';

export default function Box({allChunk, originalValues, chunkIndex, selectedEntry, conflictedEntries, showSubscripts, showAutoCandidates}) {
    //console.log("Box.chunk", chunk, originalValues, chunkIndex, selectedEntry, conflictedEntries, showSubscripts);
    //const isCellCandidateTrue = candidateValues;

    return (
        <>
            {allChunk.map((chunk, index) => (
                <Fragment key={index}>
                    {chunk.visible == "number" ?
                        <Cell
                            allData={allChunk[index]}
                            originalValue={originalValues[chunkIndex*3+index]}
                            entryIndex={chunkIndex*3 + index}
                            selectedEntry={selectedEntry}
                            conflict={conflictedEntries.includes(chunkIndex * 3 + index)}
                            showSubscripts={showSubscripts}
                        />
                    :
                        <Candidate
                            entryIndex={chunkIndex*3 + index}
                            canValue={chunk.candidates}
                            autoValue={chunk.autoCandidates}
                            showAutoCandidates={showAutoCandidates}
                            selectedEntry={selectedEntry}
                        />
                    }
                </Fragment>
            ))} 
        </>
    )
}