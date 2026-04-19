import express from 'express';
import cors from 'cors';
import { getChordTones } from './theory/chordTones.js';
import { detectKey } from './theory/keyDetection.js';
import { getMode } from './theory/modeMapper.js';
import { getScaleNotes } from './theory/scales.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /api/analyze
// Body: { chords: [{ root, quality, beats }, ...] }
// Returns: per-chord analysis with chord tones, scale tones, and detected key/mode
app.post('/api/analyze', (req, res) => {
  const { chords } = req.body;
  if (!Array.isArray(chords) || chords.length === 0)
    return res.status(400).json({ error: 'chords array required' });

  const key = detectKey(chords);

  const analysis = chords.map(({ root, quality, beats }) => {
    const mode = getMode({ root, quality }, key);
    return {
      root,
      quality,
      beats,
      chordTones: getChordTones(root, quality),
      scaleTones: getScaleNotes(root, mode),
      mode,
      key,
    };
  });

  res.json({ key, analysis });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
