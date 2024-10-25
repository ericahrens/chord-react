import type { NoteSet } from "./Chord"
import React, { type FC } from 'react'

interface ChordSeqProps {
    chordList: Array<NoteSet>
}

export const ChordSeq = ({ chordList }: ChordSeqProps) => {
    return (
        <div className="chord-seq-section">
            {chordList.map((chord, i) =>
                <div key={`${chord.getName()}_${i}`} className="chord-seq-box">{chord.getName()}</div>
            )}
        </div>
    )
}