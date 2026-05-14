/**
 * Подключает все PG-модели к одному sequelize (нужно до sequelize.sync()).
 */
const User = require('./User');
const Container = require('./Container');
const Task = require('./Task');
const Driver = require('./Driver');
const Utilizer = require('./Utilizer');
const TelemetryHistory = require('./TelemetryHistory');
const Alert = require('./Alert');
const Notification = require('./Notification');
const DisposalLog = require('./DisposalLog');

module.exports = {
  User,
  Container,
  Task,
  Driver,
  Utilizer,
  TelemetryHistory,
  Alert,
  Notification,
  DisposalLog,
};
