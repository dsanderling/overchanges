# Overchanges

A full-stack web app for guitarists practicing soloing over chord changes. Build a chord progression, hit play, and the fretboard shows you exactly what to play — the scale you can noodle with on the current chord, and the target chord tones to aim for as the next chord approaches.

![Overchanges](https://img.shields.io/badge/status-active%20development-brightgreen)

## What it does

- **Chord Progression Editor** — build a progression from all 12 roots and 6 chord qualities (maj, min, dom7, maj7, m7, m7♭5), with per-chord beat duration
- **Key Detection** — a weighted heuristic scores all 12 keys against the progression's chord tones, with extra weight on the first chord (likely tonic) and dominant 7ths (strong V→I signal)
- **Mode Assignment** — each chord is mapped to a mode: diatonic chords get Ionian/Dorian/etc. by scale degree, secondary dominants get Mixolydian, and outside chords fall through to modal interchange
- **Live Fretboard** — SVG fretboard (frets 0–19, proper geometric fret spacing) showing:
  - **Blue dots** — current chord's scale tones (your noodling palette)
  - **Amber dots** — next chord's chord tones (your targets to resolve toward)
- **String Set Filter** — constrain the display to a set of 3 strings (e.g. strings 2–4) to practice triad shapes in one zone
- **Synchronized Playback** — Tone.js Transport drives a sample-accurate metronome and chord strum together, with visual state synced via `Tone.getDraw()`
- **Looping** — toggle loop mode to keep the progression running

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Audio | Tone.js (Web Audio API) |
| Fretboard | Custom SVG component |
| Backend | Node.js, Express |
| Theory engine | Custom JS — no external music theory libraries |

## Project structure

```
├── client/          # React frontend
│   └── src/
│       ├── components/
│       │   ├── ChordProgressionEditor/
│       │   ├── ChordPicker/
│       │   ├── ChordBox/
│       │   └── Fretboard/       # SVG fretboard + Note components
│       └── utils/
│           ├── chordAudio.ts    # Tone.js strum + tick
│           └── fretboard.ts     # Note → fret position mapping
└── api/             # Express backend
    └── theory/
        ├── notes.js             # Chromatic scale primitives
        ├── chordTones.js        # Chord interval definitions
        ├── scales.js            # Mode interval definitions
        ├── keyDetection.js      # Weighted key heuristic
        └── modeMapper.js        # Diatonic / secondary dom / modal interchange
```

## Running locally

**API** (port 5000):
```sh
cd api
npm install
npm run dev
```

**Client** (port 5173):
```sh
cd client
npm install
npm run dev
```

## Roadmap

- Guitar sample-based audio (Tone.js Sampler) for a more realistic chord sound
- Fret zone selector (e.g. show only frets 5–12) for position practice
- Voice leading highlights — flag notes that move by semitone between chords
- Clickable fret dots that play the note
