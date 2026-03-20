const router    = require('express').Router();
const History   = require('../models/mongo/History');
const Container = require('../models/pg/Container');
const Task      = require('../models/pg/Task');
const { autoAssignDriver } = require('../services/autoAssign');

// POST /api/telemetry
router.post('/', async (req, res) => {
  try {
    const { binId, fullness } = req.body;

    if (!binId || fullness === undefined) {
      return res.status(400).json({ error: 'binId and fullness are required' });
    }

    // 1. Save raw reading to MongoDB
    await new History({ binId, fullness: Number(fullness) }).save();

    // 2. If critical threshold — auto-assign driver (PostgreSQL)
    if (fullness >= 80) {
      const container = await Container.findOne({ where: { qrCode: binId } });
      if (container) {
        const existing = await Task.findOne({
          where: { containerId: container.id, status: ['pending', 'in_transit'] },
        });
        if (!existing) {
          await autoAssignDriver(container.id);
          console.log(`🚨 Auto-assigned driver for ${binId} at ${fullness}%`);
        }
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ Telemetry error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;