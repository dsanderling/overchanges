import express from 'express';
import cors from 'cors';
import { getChordTones } from './theory/chordTones.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /api/analyze
// Body: { chords: [{ root, quality, beats }, ...] }
// Returns: per-chord analysis (chord tones now; scale tones coming soon)
app.post('/api/analyze', (req, res) => {
  const { chords } = req.body;
  if (!Array.isArray(chords) || chords.length === 0)
    return res.status(400).json({ error: 'chords array required' });

  const analysis = chords.map(({ root, quality, beats }) => ({
    root,
    quality,
    beats,
    chordTones: getChordTones(root, quality),
    scaleTones: null, // TODO: key detection + mode mapping
  }));

  res.json({ analysis });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
