const express    = require('express');
const http       = require('http');
const cors       = require('cors');
require('dotenv').config();

const { connectPostgres, connectMongo, connectRedis } = require('./config/db');
const { initSocket } = require('./services/socket');

const app    = express();
const server = http.createServer(app); // ← http server для Socket.io

// ── Middlewares ───────────────────────────────────────────────
app.use(cors({
  origin:  process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Connect all databases ─────────────────────────────────────
connectPostgres();
connectMongo();
connectRedis();

// ── Init Socket.io ────────────────────────────────────────────
initSocket(server);

// ── Routes ────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('MedWaste API is running...'));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/telemetry',     require('./routes/telemetry'));
app.use('/api/bins',          require('./routes/bins'));
app.use('/api/alerts',        require('./routes/alerts'));
app.use('/api/drivers',       require('./routes/drivers'));
app.use('/api/utilizers',     require('./routes/utilizers'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/utilizer',      require('./routes/utilizer'));

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));