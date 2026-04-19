Here is a concise project specification formatted as a Markdown file. You can save this as `README-dev.md` or simply paste it into Claude Code. It outlines the architecture, the "Key Calculator" logic, and the voice-leading features we discussed.

---

# Project Specs: Fretboard Flow (MVP)

## 1. Overview
A full-stack web application designed for guitarists to practice "soloing over changes." The app visualizes chord tones and modal extensions while highlighting musical transitions (voice leading) between chords in a progression.

## 2. Tech Stack
* **Frontend:** React (TypeScript), Tailwind CSS, Lucide Icons.
* **Backend:** .NET 8 Web API.
* **Theory Engine:** Custom C# logic (no external theory APIs).
* **Communication:** RESTful JSON.

---

## 3. Functional Components

### A. Progression Editor (React)
* An interface to input a sequence of chords (e.g., `Emaj7 - Bm - A - Emaj7`).
* Support for Major, Minor, Dominant 7, maj7, m7, and m7b5 chords.
* A "Play" mode with a visual metronome that advances through the progression.

### B. Music Theory Engine (.NET)
* **Key Calculator:** Uses a weighted heuristic to determine the "Parent Key" of a progression (e.g., recognizing that a `Bm` in an `E` progression is a borrowed Mixolydian chord).
* **Mode Mapper:** Assigns a mode to each chord based on its function (Diatonic, Secondary Dominant, or Modal Interchange).
* **Note Diff Algorithm:** Compares `Chord N` with `Chord N-1` to identify "Voice Leading" notes (chromatic movements of $\pm1$ semitone).

### C. Dynamic Fretboard (React + SVG)
* **Layered Visualization:**
    * **Level 1 (Primary):** Chord Tones (1, 3, 5, 7) - Large, high-contrast dots.
    * **Level 2 (Transition):** "The Flavor Note" - Pulsing or highlighted dots showing the voice-leading shift from the previous chord.
    * **Level 3 (Scale):** Modal intervals - Small, hollow circles for context.
* **Interactive:** Clicking a fret plays the note (using Tone.js).

---

## 4. Key Logic Requirements

### The "Heuristic" Scoring
The backend should score each of the 12 keys against the note set of the progression:
* Points for note matches in the diatonic scale.
* Heavy weighting for the first chord (likely Tonic) and the presence of Dominant 7ths (identifying the V chord).

### Functional "Outside" Chord Logic
1.  **Diatonic:** Map to Ionian, Dorian, etc.
2.  **Secondary Dominant:** Check if a Major/7 chord is a 5th above a diatonic chord $\rightarrow$ Mixolydian.
3.  **Modal Interchange:** Check parallel modes (Aeolian, Mixolydian, etc.) for a match $\rightarrow$ Dorian/Aeolian.

### Voice Leading (The "Note Diff")
Identify when a chord tone in the current chord is one semitone away from a chord tone in the previous chord (e.g., $D$ in $Bm$ moving to $D\#$ in $Emaj7$).

---

## 5. Implementation Phases
1.  **Phase 1:** .NET API that returns notes for any given chord name.
2.  **Phase 2:** React Fretboard that renders these notes as SVG dots.
3.  **Phase 3:** Implementation of the Key Calculator and "Outside Chord" modal logic.
4.  **Phase 4:** Implementation of the "Note Diff" to highlight voice-leading targets.

---

**Would you like me to generate a sample JSON response that the .NET backend would send to the React frontend to show how these different note "priorities" are structured?**