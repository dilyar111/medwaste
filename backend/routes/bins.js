const router           = require('express').Router();
const axios            = require('axios');
const { QueryTypes }   = require('sequelize');
const { sequelize }    = require('../config/db');
const TelemetryHistory = require('../models/pg/TelemetryHistory');

// GET /api/bins — последнее показание по каждому binId (как Mongo aggregate)
router.get('/', async (req, res) => {
  try {
    const rows = await sequelize.query(
      `SELECT DISTINCT ON (t."binId")
         t."binId",
         t.fullness,
         t.timestamp,
         c."location",
         c.lat,
         c.lon
       FROM telemetry_history t
       LEFT JOIN containers c ON c."qrCode" = t."binId"
       ORDER BY t."binId", t.timestamp DESC`,
      { type: QueryTypes.SELECT }
    );
    const bins = rows.map((r) => ({
      _id: r.binId,
      id: r.binId,
      fullness: r.fullness,
      status: 'active',
      timestamp: r.timestamp,
      location: r.location || 'Unknown location',
      lat: r.lat || 51.1283,
      lng: r.lon || 71.4305,
      updated: r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      }) : 'Unknown',
    }));
    res.json(bins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bins/history/:binId
router.get('/history/:binId', async (req, res) => {
  try {
    const data = await TelemetryHistory.findAll({
      where: { binId: req.params.binId },
      order: [['timestamp', 'DESC']],
      limit: 50,
    });
    res.json(
      data.map((row) => {
        const j = row.toJSON();
        return { ...j, _id: String(j.id) };
      })
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bins/predict/:binId
router.get('/predict/:binId', async (req, res) => {
  try {
    const { binId } = req.params;
    const data = await TelemetryHistory.findAll({
      where: { binId },
      order: [['timestamp', 'DESC']],
      limit: 20,
    });

    if (data.length < 2) {
      return res.json({
        binId,
        target_timestamp: Math.floor(Date.now() / 1000) + 7200,
        confidence: 85,
        hours_until_full: 2,
        note: 'fallback — not enough history',
      });
    }

    const history = data.map((i) => [i.fullness, new Date(i.timestamp).getTime() / 1000]);

    try {
      const { data: pyData } = await axios.post(
        process.env.PYTHON_AI_URL || 'http://localhost:8000/predict',
        { history },
        { timeout: 2000 }
      );
      return res.json({ binId, ...pyData });
    } catch {
      return res.json({
        binId,
        target_timestamp: Math.floor(Date.now() / 1000) + 3600,
        confidence: 94,
        hours_until_full: 2.5,
        note: 'AI offline, showing fallback',
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
