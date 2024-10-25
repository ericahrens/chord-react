'use client'

import { useState } from "react";
import { synth, type NoteSet } from "./Chord";

interface KeyboardSvgProps {
	chord: NoteSet
	playOffset: number
	handleChord?: (chord: NoteSet) => void
}

export const KeyboardSvg = ({ chord, playOffset, handleChord }: KeyboardSvgProps) => {

	const keyWidth = 10
	const blackKeys = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12]
	const whiteOffset = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23]
	const blackOffset = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22]
	const index = chord.getIndexes()
	const idxColor = "#04dbb0"
	const baseNoteColor = "#f11"
	const [held, setHeld] = useState<boolean>(false)

	const playNote = (event: React.MouseEvent<SVGSVGElement>) => {
		if (held) {
			synth.triggerRelease(chord.getNotes(playOffset))
		}
		synth.triggerAttack(chord.getNotes(playOffset));
		if(event.shiftKey && handleChord) {
			handleChord(chord)
		} 
		setHeld(true)
	}

	const releaseNote = () => {
		synth.triggerRelease(chord.getNotes(playOffset))
		setHeld(false)
	}

	const getKeyColor = (offset: number) => {
		if (offset === chord.rootNote) {
			return held ? '#000' : baseNoteColor
		}
		if (index.includes(offset)) {
			return held ? '#001' : idxColor
		}
		return '#fff'
	}

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<svg className="chord-view" xmlns="http://www.w3.org/2000/svg"
		onMouseDown={(event) => playNote(event)} onMouseUp={releaseNote}>
			{whiteOffset.map((x, i) => (
				<rect
					key={`w_${x}`}
					x={i * keyWidth}
					y="0"
					width={keyWidth}
					height="29"
					fill={getKeyColor(x)}
					stroke="#000"
					strokeWidth="1"
				/>
			))}
			{blackKeys.map((off, i) => (
				<rect
					key={`b_${off}`}
					x={off * keyWidth + keyWidth * 0.6}
					y="0"
					width={keyWidth * 0.7}
					height="18"
					fill={getKeyColor(blackOffset[i])}
					stroke="#000"
					strokeWidth="1"
				/>
			))}
		</svg>
	)
}

interface ChordDisplayProps {
	chord: NoteSet
	playOffset: number
	handleChord?: (chord: NoteSet) => void
}

export const ChordDisplay = ({ chord, playOffset,handleChord }: ChordDisplayProps) => {
	return (
		<div className="chord-frame" key={chord.getName()}>
			<div><b>{chord.getName()}</b></div> <KeyboardSvg chord={chord} playOffset={playOffset} handleChord={handleChord}/>
		</div>
	)
}
