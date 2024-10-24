import "./App.css";
import {
	getMatchingChords,
	deriveNoteSet,
	getScale,
	scales,
	notes,
} from "./Chord";
import React, { useState, useEffect } from "react";

const ComboBox = ({ selections, onChange }) => {
	return (
		<select
			className="select-style"
			onChange={(value) => onChange(value.target.value)}
		>
			{selections.map((sel) => (
				<option key={sel} value={sel}>
					{sel}
				</option>
			))}
		</select>
	);
};

const ChordDisplay = ({ chord }) => {
	return (
		<div className="chord-frame" key={chord.getName()}>
			<b>{chord.getName()}</b> <KeyboardSvg chord={chord} />
		</div>
	);
};

const KeyboardSvg = ({ chord }) => {
	const keyWidth = 10;
	const blackKeys = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12];
	const whiteOffset = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
	const blackOffset = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22];
	const index = chord.getIndexes();
	const idxColor = "#04dbb0";
	const baseNoteColor = "#f11";
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg class="chord-view" xmlns="http://www.w3.org/2000/svg">
			{whiteOffset.map((x, i) => (
				// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
				<rect
					x={i * keyWidth}
					y="0"
					width={keyWidth}
					height="29"
					fill={
						x === chord.rootNote
							? baseNoteColor
							: index.includes(x)
								? idxColor
								: "#fff"
					}
					stroke="#000"
					strokeWidth="1"
				/>
			))}
			{blackKeys.map((off, i) => (
				// biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
				<rect
					x={off * keyWidth + keyWidth * 0.6}
					y="0"
					width={keyWidth * 0.7}
					height="18"
					fill={
						blackOffset[i] === chord.rootNote
							? baseNoteColor
							: index.includes(blackOffset[i])
								? idxColor
								: "#fff"
					}
					stroke="#000"
					strokeWidth="1"
				/>
			))}
		</svg>
	);
};

function App() {
	const [baseNote, setBaseNote] = useState(0);
	const [repScale, setRepScale] = useState(
		deriveNoteSet(baseNote, getScale("Ionian")),
	);
	const [selScale, setSelScale] = useState("Ionian");

	const changeScale = (scale) => {
		setSelScale(scale);
		setRepScale(deriveNoteSet(baseNote, getScale(scale)));
	};

	const changeNote = (note) => {
		const index = notes.indexOf(note);
		setBaseNote(index);
		setRepScale(deriveNoteSet(index, getScale(selScale)));
	};

	return (
		<div className="main">
			<div className="App">
				<b>Chord App</b>
				<p />
				<ComboBox
					selections={notes.map((note) => note)}
					onChange={changeNote}
				/>
				&nbsp;
				<ComboBox
					selections={scales.map((scale) => scale.getName())}
					onChange={changeScale}
				/>
				<p />
				<b>{repScale.getName()}</b> {repScale.listNotes()}
				<p />
				{getMatchingChords(repScale).map((chord) => (
					<ChordDisplay key={chord.getName()} chord={chord} />
				))}
				<p />
			</div>
		</div>
	);
}

export default App;
