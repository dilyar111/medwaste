const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

/** Журнал утилизации (раньше Mongo disposal_logs) */
const DisposalLog = sequelize.define(
  'DisposalLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    containerId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    driverId: { type: DataTypes.INTEGER, allowNull: false },
    utilizerId: { type: DataTypes.INTEGER, allowNull: false },
    wasteType: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D'),
      allowNull: true,
    },
    weightKg: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    fullness: { type: DataTypes.DOUBLE, allowNull: true },
    method: {
      type: DataTypes.STRING(64),
      defaultValue: 'incineration',
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'disposal_logs',
    timestamps: false,
  }
);

module.exports = DisposalLog;
