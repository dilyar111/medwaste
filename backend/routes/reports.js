const router = require('express').Router();
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    // Тянем данные: контейнер + последняя телеметрия + кто вез (Task)
    const reportData = await sequelize.query(
      `SELECT 
        c."qrCode", c."location", c."wasteType",
        t.fullness, t.timestamp as "lastUpdate",
        tk.id as "taskId", tk.status as "taskStatus",
        u.email as "driverEmail", d."plateNumber"
       FROM "Containers" c
       LEFT JOIN LATERAL (
         SELECT fullness, timestamp FROM telemetry_history 
         WHERE "binId" = c."qrCode" ORDER BY timestamp DESC LIMIT 1
       ) t ON true
       LEFT JOIN "Tasks" tk ON tk."containerId" = c."qrCode" AND tk.status = 'completed'
       LEFT JOIN "Drivers" d ON tk."driverId" = d.id
       LEFT JOIN "Users" u ON d."userId" = u.id`,
      { type: QueryTypes.SELECT }
    );

    const totalContainers = reportData.length;
    const avgFullness = totalContainers
      ? Math.round(reportData.reduce((sum, r) => sum + Number(r.fullness || 0), 0) / totalContainers)
      : 0;

    res.json({
      overview: {
        totalContainers,
        avgFullness,
        needAttention: reportData.filter(r => r.fullness >= 80).length,
        totalWeight: totalContainers * 1.8 // Примерный расчет
      },
      departments: reportData.map(r => ({
        name: r.location || 'Unknown',
        bins: 1,
        avgFullness: r.fullness || 0,
        totalWeight: 1.8,
        needsAttention: r.fullness >= 80 ? 1 : 0,
        driver: r.driverEmail || 'System',
        plate: r.plateNumber || 'N/A',
        time: r.lastUpdate
      })),
      wasteTypes: [
        { name: 'Sharp Medical Waste', pct: 100, color: '#1A6EFF' }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;