const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    title: { type: DataTypes.STRING(500), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    type: {
      type: DataTypes.ENUM('success', 'error', 'info'),
      defaultValue: 'info',
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'notifications',
    timestamps: false,
    updatedAt: false,
  }
);

module.exports = Notification;
