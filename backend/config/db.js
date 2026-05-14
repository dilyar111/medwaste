const path          = require('path');
const { Sequelize } = require('sequelize');
const redis         = require('redis');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// ── PostgreSQL ────────────────────────────────────────────────
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
});

async function connectPostgres() {
  try {
    require('../models/pg');
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL Error:', err.message);
  }
}

// ── Redis ─────────────────────────────────────────────────────
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('❌ Redis error:', err.message));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (err) {
    console.error('❌ Redis error:', err.message);
  }
}

module.exports = { sequelize, redisClient, connectPostgres, connectRedis };
