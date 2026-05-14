const router    = require('express').Router();
const TelemetryHistory = require('../models/pg/TelemetryHistory');
const Alert     = require('../models/pg/Alert');
const Container = require('../models/pg/Container');
const Task      = require('../models/pg/Task');
const { autoAssignDriver }        = require('../services/autoAssign');
const { checkTelemetryRateLimit } = require('../services/redis');
const { sendEmailAlert }          = require('../services/email');
const { emitTelemetry, emitAlert } = require('../services/Socket');
const { withMongoId }             = require('../utils/mongoCompat');
const { Op } = require('sequelize');

// POST /api/telemetry
router.post('/', async (req, res) => {
  try {
    const { binId, fullness } = req.body;
    console.log(`📥 Telemetry received: ${binId} = ${fullness}%`);

    if (!binId || fullness === undefined) {
      return res.status(400).json({ error: 'binId and fullness are required' });
    }

    const allowed = await checkTelemetryRateLimit(binId);
    if (!allowed) return res.status(429).json({ message: 'Rate limited' });

    const entry = await TelemetryHistory.create({
      binId,
      fullness: Number(fullness),
      timestamp: new Date(),
    });

    emitTelemetry(binId, Number(fullness), entry.timestamp);

    if (fullness >= 80) {
      console.log(`🔥 Fullness >= 80 triggered for ${binId}`);
      const existingAlert = await Alert.findOne({
        where: { containerId: binId, resolved: false },
      });
      console.log(`🔍 Existing alert:`, existingAlert ? 'found' : 'none');
      if (!existingAlert) {
        console.log(`📢 Creating alert for ${binId}`);
        const alert = await Alert.create({
          containerId: binId,
          severity:  'critical',
          title:     `Critical: Container ${binId} is ${fullness}% full`,
          message:   `Container ${binId} has reached ${fullness}% capacity. Immediate collection required.`,
          timestamp: new Date(),
        });
        emitAlert(withMongoId(alert));

        await sendEmailAlert(binId, fullness);
      }

      const container = await Container.findOne({ where: { qrCode: binId } });
      console.log(`📦 Container found:`, container ? container.id : 'NOT FOUND');
      if (container) {
        const existing = await Task.findOne({
          where: {
            containerId: binId,
            status: { [Op.in]: ['assigned', 'in_transit', 'at_utilization'] },
          },
        });
        if (!existing) {
          await autoAssignDriver(container.id, fullness);
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
