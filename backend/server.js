const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const axios     = require('axios');
require('dotenv').config();

const app = express();

// ── Middlewares ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MongoDB ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ── Model (ONE place, no conflicts) ──────────────────────────
const historySchema = new mongoose.Schema({
  binId:     { type: String, required: true },
  fullness:  { type: Number, required: true },
  timestamp: { type: Date,   default: Date.now }
}, { strict: false });

const History = mongoose.model('HistoryNew', historySchema);

// ── Routes ────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.send("MedWaste API is running...");
});

// ⚠️ IMPORTANT: specific route BEFORE parameterized route
// POST telemetry from sensor
app.post('/api/telemetry', async (req, res) => {
  try {
    console.log("📥 Received from sensor:", req.body);

    const { binId, fullness, timestamp } = req.body;

    // Validate required fields
    if (!binId || fullness === undefined) {
      return res.status(400).json({ error: "binId and fullness are required" });
    }

    const newEntry = new History({
      binId,
      fullness: Number(fullness),
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    const saved = await newEntry.save();
    console.log("✅ Saved to MongoDB:", saved._id);
    res.status(200).json({ ok: true, id: saved._id });

  } catch (err) {
    console.error("❌ Save error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET all latest readings (one per bin)
app.get('/api/bins', async (req, res) => {
  try {
    const bins = await History.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$binId", fullness: { $first: "$fullness" }, timestamp: { $first: "$timestamp" } } }
    ]);
    res.json(bins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET history for a specific bin
app.get('/api/history/:binId', async (req, res) => {
  try {
    const data = await History
      .find({ binId: req.params.binId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET AI prediction for a bin  ← parameterized route LAST
app.get('/api/predict/:binId', async (req, res) => {
  try {
    const { binId } = req.params;

    const data = await History
      .find({ binId })
      .sort({ timestamp: -1 })
      .limit(20);

    if (data.length < 2) {
      console.log("⚠️ Not enough data, returning fallback prediction");
      return res.json({
        binId,
        target_timestamp:  Math.floor(Date.now() / 1000) + 7200,
        confidence:        85,
        hours_until_full:  2,
        note:              "fallback — not enough history"
      });
    }

    const historyForPython = data.map(item => [
      item.fullness,
      new Date(item.timestamp).getTime() / 1000
    ]);

    try {
      const pythonResponse = await axios.post(
        'http://localhost:8000/predict',
        { history: historyForPython },
        { timeout: 2000 }
      );
      return res.json({ binId, ...pythonResponse.data });

    } catch (pyErr) {
      console.warn("⚠️ Python AI offline, using fallback");
      return res.json({
        binId,
        target_timestamp:  Math.floor(Date.now() / 1000) + 3600,
        confidence:        94,
        hours_until_full:  2.5,
        note:              "AI offline, showing fallback"
      });
    }

  } catch (err) {
    console.error("❌ Predict error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));