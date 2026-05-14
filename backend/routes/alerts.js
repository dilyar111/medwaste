const router  = require('express').Router();
const Alert   = require('../models/pg/Alert');
const { authenticate } = require('../middleware/auth');
const { withMongoId, withMongoIdList } = require('../utils/mongoCompat');

// GET /api/alerts
router.get('/', authenticate, async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      order: [['timestamp', 'DESC']],
      limit: 100,
    });
    res.json(withMongoIdList(alerts));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Not found' });
    await alert.update({ resolved: true });
    res.json(withMongoId(alert));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/alerts/:id
router.delete('/:id', async (req, res) => {
  try {
    const n = await Alert.destroy({ where: { id: req.params.id } });
    if (!n) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alerts  (manual create)
router.post('/', async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(withMongoId(alert));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
