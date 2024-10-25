'use client'

import { type NoteSet, scales, deriveNoteSet, getScale, notes, getMatchingChords } from "./Chord";
import { useEffect, useState } from "react";
import { ChordDisplay } from "./Keyboard";
import { ChordSeq } from "./ChordSeq";


interface ComboBoxProps {
  selections: Array<string>,
  onChange: (selValue: string) => void,
  selected?: string
}

const ComboBox = ({ selections, onChange, selected }: ComboBoxProps) => {
  return (
    <select
      className="select-style"
      onChange={(value) => onChange(value.target.value)}
      value={selected}
    >
      {selections.map((sel: string) => (
        <option key={sel} value={sel}>
          {sel}
        </option>
      ))}
    </select>
  );
};

const octaves = ["1", "2", "3", "4", "5"]

export default function Home() {
  const [baseNote, setBaseNote] = useState<number>(0);
  const [repScale, setRepScale] = useState<NoteSet>(
    deriveNoteSet(baseNote, getScale("Ionian")),
  );
  const [selScale, setSelScale] = useState("Ionian");
  const [playOffset, setPlayOffset] = useState(4)
  const [chordList, setChordList] = useState<Array<NoteSet>>([])

  const changeScale = (scale: string) => {
    setSelScale(scale);
    setRepScale(deriveNoteSet(baseNote, getScale(scale)));
  };

  const changeNote = (note: string) => {
    const index = notes.indexOf(note);
    setBaseNote(index);
    setRepScale(deriveNoteSet(index, getScale(selScale)));
  };

  const changeOctave = (value: string) => {
    const oct: number = Number.parseInt(value)
    setPlayOffset(oct)
  }

  const handleChordAdd = (chord: NoteSet) => {
    const newSeq = [...chordList]
    newSeq.push(chord)
    setChordList(newSeq)
  }

  useEffect(() => {
    console.log(`chord list = ${chordList}`)
  }, [chordList])

  return (
    <div className="main-chord">
      <div style={{ marginTop: '20px' }}><b>Chord App</b>
      </div>
      <div>
        <ComboBox
          selections={notes.map((note) => note)}
          onChange={changeNote}
        />
        &nbsp;
        <ComboBox
          selections={scales.map((scale) => scale.getName())}
          onChange={changeScale}
        />
        <span style={{ margin: '0px 10px 0px 20px' }}>Play Octave</span>
        <ComboBox
          selections={octaves}
          onChange={changeOctave}
          selected={playOffset.toString()}
        />
      </div>
      <div>
        <b>{repScale.getName()}</b> {repScale.listNotes()}
      </div>
      <ChordSeq chordList={chordList} />
      <div className="center-box">
        {getMatchingChords(repScale).map((chord) => (
          <ChordDisplay key={chord.getName()} chord={chord} playOffset={playOffset} handleChord={handleChordAdd} />
        ))}
      </div>
    </div>
  );
}
