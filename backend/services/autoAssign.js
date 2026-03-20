const User      = require('../models/pg/User');
const Task      = require('../models/pg/Task');
const Container = require('../models/pg/Container');

// ── Find nearest available driver ────────────────────────────
// Uses Haversine formula to calculate distance from driver to container
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Assign nearest available driver to a container
async function autoAssignDriver(containerId) {
  const container = await Container.findByPk(containerId);
  if (!container) throw new Error('Container not found');

  // All available drivers
  const drivers = await User.findAll({
    where: { role: 'driver', isAvailable: true },
  });

  if (drivers.length === 0) return null;

  // Sort by distance if container has coordinates
  let chosen = drivers[0];
  if (container.lat && container.lon) {
    const withDistance = drivers
      .filter(d => d.lastLat && d.lastLon)
      .map(d => ({
        driver: d,
        dist: haversine(d.lastLat, d.lastLon, container.lat, container.lon),
      }))
      .sort((a, b) => a.dist - b.dist);

    if (withDistance.length > 0) chosen = withDistance[0].driver;
  }

  // Create task and mark driver as unavailable
  const task = await Task.create({
    containerId,
    driverId:   chosen.id,
    status:     'pending',
    priority:   'high',
    assignedAt: new Date(),
  });

  await chosen.update({ isAvailable: false });

  console.log(`✅ Auto-assigned driver ${chosen.id} to container ${containerId}`);
  return task;
}

// Assign nearest available utilizer when driver picks up waste
async function autoAssignUtilizer(taskId) {
  const task = await Task.findByPk(taskId);
  if (!task) throw new Error('Task not found');

  const utilizer = await User.findOne({
    where: { role: 'utilizer', isAvailable: true },
  });

  if (!utilizer) {
    console.warn('⚠️ No available utilizer found');
    return null;
  }

  await task.update({ utilizerId: utilizer.id });
  await utilizer.update({ isAvailable: false });

  console.log(`✅ Auto-assigned utilizer ${utilizer.id} to task ${taskId}`);
  return task;
}

module.exports = { autoAssignDriver, autoAssignUtilizer };