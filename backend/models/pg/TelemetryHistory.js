const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

/** Телеметрия заполненности контейнеров (раньше Mongo HistoryNew) */
const TelemetryHistory = sequelize.define(
  'TelemetryHistory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    binId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fullness: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'telemetry_history',
    timestamps: false,
    indexes: [{ fields: ['binId', 'timestamp'] }],
  }
);

module.exports = TelemetryHistory;
