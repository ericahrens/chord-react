import * as Tone from "tone";


export const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
export const synth = new Tone.PolySynth(Tone.Synth).toDestination();


export class NoteSet {
    name: string
    offsets: Array<number>
    baseName: string
    rootNote: number

    constructor(name: string, offsets:Array<number>, baseName?: string, rootNote?: number) {
        this.name = name
        this.offsets = offsets
        this.baseName = baseName ?? name
        this.rootNote = rootNote ?? 0
    }

    getName = () : string => {
        return this.name
    }

    listNotes = () : string => {
        return this.offsets.map((v)=>notes[v]).join(' ')
    }

    getOffsets = (offset: number) : Array<number> => {
        const res = []
        for(const ov of this.offsets) {
            res.push((ov+offset)%12)
        }
        return res
    }

    getNotes = (octave: number) : Array<string> => {
        const res: Array<string> = []
        return this.offsets.map((v,i) => `${notes[v]}${octave + (v<this.rootNote ? 1:0)}`)
    } 

    getIndexes = () : Array<number> => {
        const res = []
        let last = -1
        for(const ov of this.offsets) {
            if(last === -1 || ov > last) {
                res.push(ov)
                last = ov
            } else {
                res.push(ov+12)
            }
        }
        return res
    }

    includedIn = (noteSet: NoteSet) : boolean => {
        for(const nv of this.offsets) {
            if(!noteSet.offsets.includes(nv)) {
                return false
            }
        }
        return true
    }

    playChord = (start: number, duration: number, playOffset: number) => {
        synth.triggerAttackRelease(this.getNotes(playOffset), duration, start);
    }
}

export const scales = [
    new NoteSet("Ionian", [0, 2, 4, 5, 7, 9, 11]),
    new NoteSet("Aeolian", [0, 2, 3, 5, 7, 8, 10]),
    new NoteSet("Locrian", [0, 1, 3, 5, 6, 8, 10]),
    new NoteSet("Mixolydian", [0, 2, 4, 5, 7, 9, 10]),
    new NoteSet("Pentatonic", [0, 2, 4, 7, 9]),
    new NoteSet("Pentatonic Minor", [0, 2, 3, 7, 10]), //
    new NoteSet("Dorian (B/g)", [0, 2, 3, 5, 7, 9, 10]), //
    new NoteSet("Phrygian (A-flat/f)", [0, 1, 3, 5, 7, 8, 10]), //
    new NoteSet("Lydian (D/e)", [0, 2, 4, 6, 7, 9, 11]), //
    new NoteSet("Diminished", [0, 2, 3, 5, 6, 8, 9, 10]), //
    new NoteSet("Major Blues", [0, 3, 4, 7, 9, 10]), //
    new NoteSet("Minor Blues", [0, 3, 4, 6, 7, 10]), //
    new NoteSet("Whole", [0, 2, 4, 6, 8, 10]), //
    new NoteSet("Arabian", [0, 2, 4, 5, 6, 8, 10]), //
    new NoteSet("Egyptian", [0, 2, 5, 7, 10]), //
    new NoteSet("Gypsi", [0, 2, 3, 6, 7, 8, 11]), //
    new NoteSet("Spanish", [0, 1, 3, 4, 5, 7, 8, 10])]

export const chords = [
    new NoteSet("minor", [0, 3, 7]),
    new NoteSet("major", [0, 4, 7]),
    new NoteSet("sus2", [0, 2, 7]), //
    new NoteSet("sus4", [0, 5, 7]), //
    new NoteSet("m7", [0, 3, 7, 10]), //
    new NoteSet("M7", [0, 4, 7, 10]), //
    new NoteSet("mMaj7", [0, 3, 7, 11]), //
    new NoteSet("Maj7", [0, 4, 7, 11]), //
    new NoteSet("7sus4",[0, 5, 7, 11]), //
    new NoteSet("dim7", [0, 3, 6, 9]), //
    new NoteSet("madd9", [0, 2, 3, 7]), //
    new NoteSet("Madd9", [0, 2, 4, 7]), //
    new NoteSet("m6", [0, 3, 7, 9]), //
    new NoteSet("M6", [0, 4, 7, 9]), //
    new NoteSet("mb5", [0, 3, 6]), //
    new NoteSet("Mb5", [0, 4, 6]), //
    new NoteSet("m7b5", [0, 3, 6, 10]), //
    new NoteSet("M7b5", [0, 4, 6, 10]), //
    new NoteSet("M#5", [0, 4, 8]), //
    new NoteSet("m7#5", [0, 3, 8, 10]), //
    new NoteSet("M7#5", [0, 4, 8, 10]), //
    new NoteSet("M7#5", [0, 3, 8]), //
    new NoteSet("m9no5", [0, 2, 3, 10]), //
    new NoteSet("M9no5", [0, 2, 4, 10]), //
    new NoteSet("Madd9b5", [0, 2, 4, 6]), //
    new NoteSet("Maj7b5", [0, 4, 6, 11]), //
    new NoteSet("m7b9no5", [0, 1, 4, 10]), //
    new NoteSet("sus4#5b9", [0, 1, 4, 10]), //
    new NoteSet("sus4add#5", [0, 1, 4, 10]), //
    new NoteSet("Maddb5", [0, 4, 6, 7]), //
    new NoteSet("M6add4no5", [0, 4, 5, 9]), //
    new NoteSet("Maj7/6no5", [0, 4, 9]), //
    new NoteSet("Maj9no5", [0, 2, 4, 11]), //
    new NoteSet("4th", [0, 5]), //
    new NoteSet("5th", [0, 7]), //
]

export const allChords: Array<NoteSet> = []

for(let base=0;base<12;base++) {
    for(const chord of chords) {
        const combinedName = `${notes[base]} ${chord.getName()}`
        allChords.push(new NoteSet(combinedName, chord.getOffsets(base), chord.getName(), base))
    }
}

const rotate = (val: number) => {
    return val < 0 ? 12+val : val
}

export const getMatchingChords = (scale: NoteSet) => {
    console.log(`Get Matching Chords ${scale.getName()}`)
    const base = scale.rootNote
    return allChords.filter((chord)=>chord.includedIn(scale)).sort((c1, c2) => rotate(c1.rootNote-base) - rotate(c2.rootNote-base))
}

export const getScale = (name: string) => {
    return scales.filter((scale) => scale.name.startsWith(name))[0]
}

export const deriveNoteSet = (baseNote: number, scale: NoteSet) => {
    return new NoteSet(`${notes[baseNote]} ${scale.getName()}`, scale.getOffsets(baseNote), scale.getName(), baseNote)
}