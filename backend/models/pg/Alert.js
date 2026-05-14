const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Alert = sequelize.define(
  'Alert',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    severity: {
      type: DataTypes.ENUM('critical', 'warning', 'info'),
      defaultValue: 'info',
    },
    type: {
      type: DataTypes.STRING(64),
      defaultValue: 'system',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    containerId: {
      type: DataTypes.STRING(100),
      defaultValue: '—',
    },
    location: {
      type: DataTypes.STRING(255),
      defaultValue: '—',
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'alerts',
    timestamps: false,
  }
);

module.exports = Alert;
