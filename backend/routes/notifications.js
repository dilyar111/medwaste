const router       = require('express').Router();
const Notification = require('../models/pg/Notification');
const { authenticate } = require('../middleware/auth');
const { withMongoId, withMongoIdList } = require('../utils/mongoCompat');

// GET /api/notifications
router.get('/', authenticate, async (req, res) => {
  try {
    console.log('Notifications request, userId:', req.user.userId);
    const notes = await Notification.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(withMongoIdList(notes));
  } catch (err) {
    console.error('Notifications DB error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const row = await Notification.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.update({ read: true });
    res.json(withMongoId(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
