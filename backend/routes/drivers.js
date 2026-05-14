const router   = require('express').Router();
const { Op }   = require('sequelize');
const Driver   = require('../models/pg/Driver');
const User     = require('../models/pg/User');
const Task     = require('../models/pg/Task');
const Container = require('../models/pg/Container');
const { authenticate } = require('../middleware/auth');
const { setDriverAvailable } = require('../services/redis');
const { autoAssignUtilizer } = require('../services/autoAssign');
const { haversineKm } = require('../utils/geo');

function mapRouteStatus(taskStatus) {
  if (taskStatus === 'completed') return 'completed';
  if (taskStatus === 'cancelled') return 'cancelled';
  return 'active';
}

function taskToRoute(task, driverById) {
  const c = task.container;
  const cLat = c?.lat;
  const cLon = c?.lon;
  const drv = task.driverId != null ? driverById.get(task.driverId) : null;
  const u = drv?.user;
  const uLat = u?.lastLat;
  const uLon = u?.lastLon;

  let coordinates;
  if (cLat != null && cLon != null && uLat != null && uLon != null) {
    coordinates = [
      [Number(uLat), Number(uLon)],
      [Number(cLat), Number(cLon)],
    ];
  } else if (cLat != null && cLon != null) {
    coordinates = [
      [Number(cLat) - 0.015, Number(cLon) - 0.015],
      [Number(cLat), Number(cLon)],
    ];
  } else {
    coordinates = [
      [43.238, 76.945],
      [43.255, 76.928],
    ];
  }

  const dist = haversineKm(
    coordinates[0][0],
    coordinates[0][1],
    coordinates[1][0],
    coordinates[1][1]
  );
  const distance = dist != null ? Math.round(dist * 10) / 10 : 0;

  return {
    id: task.id,
    taskId: task.id,
    name: c?.qrCode ? `→ ${c.qrCode}` : `Task #${task.id}`,
    distance,
    bins: 1,
    status: mapRouteStatus(task.status),
    coordinates,
    assignedAt: task.assignedAt,
    completedAt: task.completedAt,
    containerId: task.containerId,
    taskStatus: task.status,
    driverPlate: drv?.plateNumber || null,
  };
}

// ── POST /api/drivers/register ────────────────────────────────
router.post('/register', authenticate, async (req, res) => {
  try {
    const {
      licenseNumber, licenseExpiry, company,
      plateNumber, vehicleModel, vehicleYear, capacity,
      emergencyName, emergencyPhone, emergencyRelation,
    } = req.body;

    if (new Date(licenseExpiry) < new Date()) {
      return res.status(400).json({ message: 'Cannot register with an expired license.' });
    }

    const existing = await Driver.findOne({ where: { userId: req.user.userId } });
    if (existing) return res.status(400).json({ message: 'You already have a registration.' });

    const newDriver = await Driver.create({
      userId: req.user.userId,
      licenseNumber,
      licenseExpiry,
      company,
      plateNumber,
      vehicleModel,
      vehicleYear,
      capacity,
      emergencyContact: { name: emergencyName, phone: emergencyPhone, relation: emergencyRelation },
      status: 'pending',
    });

    res.status(201).json({ message: 'Application sent! Waiting for admin approval.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/drivers/my-status ────────────────────────────────
router.get('/my-status', authenticate, async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    res.json(driver || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/drivers/tasks ────────────────────────────────────
// Driver sees all their own tasks
router.get('/tasks', authenticate, async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    if (!driver) return res.status(404).json({ message: 'Driver profile not found' });

    const tasks = await Task.findAll({
      where: { driverId: driver.id },
      order: [['assignedAt', 'DESC']],
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/drivers/route-history ───────────────────────────
// Задачи как «маршруты» для карты (водитель — свои; admin/personnel — все / ?driverId=)
// GET /api/drivers/route-history
router.get('/route-history', authenticate, async (req, res) => {
  try {
    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    if (!driver) return res.status(404).json({ message: 'Driver profile not found' });

    const { period, status } = req.query;

    const where = { driverId: driver.id };
    if (status && status !== 'all') where.status = status;

    // Period filter
    if (period && period !== 'all') {
      const now  = new Date();
      const from = new Date();
      if (period === 'today') from.setHours(0, 0, 0, 0);
      if (period === 'week')  from.setDate(now.getDate() - 7);
      if (period === 'month') from.setMonth(now.getMonth() - 1);
      const { Op } = require('sequelize');
      where.assignedAt = { [Op.gte]: from };
    }

    const tasks = await Task.findAll({
      where,
      order: [['assignedAt', 'DESC']],
    });

    // Format as routes
    const routes = tasks.map(t => ({
      id:          t.id,
      name:        `Route #${t.id} — ${t.containerId}`,
      status:      t.status,
      distance:    (Math.random() * 10 + 1).toFixed(1), // TODO: real distance
      bins:        1,
      assignedAt:  t.assignedAt,
      completedAt: t.completedAt,
      coordinates: [[51.1800, 71.4500], [51.1700, 71.4400]], // TODO: real coords
    }));

    res.json({ routes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/drivers/tasks/:id/status ──────────────────────
// Driver updates task status (assigned → in_transit → completed)
router.patch('/tasks/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    // 1. ОБЯЗАТЕЛЬНО добавь 'completed' сюда
    const allowed = ['in_transit', 'cancelled', 'completed']; 

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
    }

    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    if (!driver) return res.status(404).json({ message: 'Driver profile not found' });

    const task = await Task.findOne({
      where: { id: req.params.id, driverId: driver.id },
    });
    if (!task) return res.status(404).json({ message: 'Task not found or not yours' });

    const updates = { status };
    if (status === 'completed') updates.completedAt = new Date();

    await task.update(updates);

    // Логика автоматизации
    if (status === 'in_transit') {
      await autoAssignUtilizer(task.id);
    }

    // Если задача завершена или отменена — освобождаем ресурсы
    if (status === 'completed' || status === 'cancelled') {
      // Освобождаем в таблице Users
      await User.update({ isAvailable: true }, { where: { id: req.user.userId } });
      
      // Освобождаем в Redis (если используешь для автоназначения)
      if (typeof setDriverAvailable === 'function') {
        await setDriverAvailable(driver.id, true);
      }
      console.log(`Driver ${req.user.userId} is now available`);
    }

    res.json(task);
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH /api/drivers/availability ──────────────────────────
// Driver toggles their own availability
router.patch('/availability', authenticate, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    console.log(`TRYING TO FREE DRIVER: ${req.user.userId}`);

    await User.update(
      { isAvailable },
      { where: { id: req.user.userId } }
    );

    // Also update Redis cache
    const driver = await Driver.findOne({ where: { userId: req.user.userId } });
    if (driver) await setDriverAvailable(driver.id, isAvailable);

    res.json({ ok: true, isAvailable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;