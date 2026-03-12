const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const axios     = require('axios');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Alert = require('./models/Alert');
const User = require('./models/User');
const Driver = require('./models/Driver');
const Notification = require('./models/Notification');
const app = express();

// ── Middlewares ───────────────────────────────────────────────
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ── MongoDB ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ── Model (ONE place, no conflicts) ──────────────────────────
const historySchema = new mongoose.Schema({
  binId:     { type: String, required: true },
  fullness:  { type: Number, required: true },
  timestamp: { type: Date,   default: Date.now }
}, { strict: false });

const History = mongoose.model('HistoryNew', historySchema);


// ── REGISTER ──
app.post('/api/auth/register', async (req, res) => {
    console.log("📥 Register attempt:", req.body);
  try {
    const { email, password } = req.body;

    // 1. Проверяем, нет ли уже такого юзера
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // 2. Шифруем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Сохраняем
    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      role: 'user' //  все новые юзеры — обычные пользователи
    });
    await newUser.save();

    res.status(201).json({ ok: true, message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN ──
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // ТУТ ДОЛЖНА БЫТЬ РОЛЬ
      process.env.JWT_SECRET || 'supersecretkey', 
      { expiresIn: '24h' }
    );

    // Отправляем роль и токен фронтенду
    res.json({ token, email: user.email, role: user.role }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    
    // ДОБАВЬ ЭТОТ LOG, чтобы увидеть правду в терминале:
    console.log("DEBUG: Role from token is ->", decoded.role);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ── Routes ────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.send("MedWaste API is running...");
});

app.get('/api/notifications', async (req, res) => {
  // Просто возвращаем пустой массив, чтобы Dashboard не ругался
  res.json([]);
});

// ⚠️ IMPORTANT: specific route BEFORE parameterized route
// POST telemetry from sensor
app.post('/api/telemetry', async (req, res) => {
  try {
    console.log("📥 Received from sensor:", req.body);

    const { binId, fullness, timestamp } = req.body;

    // Validate required fields
    if (!binId || fullness === undefined) {
      return res.status(400).json({ error: "binId and fullness are required" });
    }

    const newEntry = new History({
      binId,
      fullness: Number(fullness),
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    const saved = await newEntry.save();

    if (fullness >= 80) {
        sendEmailAlert(binId, fullness);
      await Alert.create({
         severity: "critical", type: "fullness",
         title: `Container ${binId} Almost Full`,
         message: `${binId} reached ${fullness.toFixed(1)}% — immediate collection required.`,
         containerId: binId,
       });
     } else if (fullness >= 60) {
       await Alert.create({
         severity: "warning", type: "fullness",
         title: `High Fill Level — ${binId}`,
         message: `${binId} is at ${fullness.toFixed(1)}%. Schedule pickup within 24h.`,
         containerId: binId,
        });
     }

    console.log("✅ Saved to MongoDB:", saved._id);
    res.status(200).json({ ok: true, id: saved._id });

  } catch (err) {
    console.error("❌ Save error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET all latest readings (one per bin)
app.get('/api/bins', async (req, res) => {
  try {
    const bins = await History.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$binId", fullness: { $first: "$fullness" }, timestamp: { $first: "$timestamp" } } }
    ]);
    res.json(bins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET history for a specific bin
app.get('/api/history/:binId', async (req, res) => {
  try {
    const data = await History
      .find({ binId: req.params.binId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET AI prediction for a bin  ← parameterized route LAST
app.get('/api/predict/:binId', async (req, res) => {
  try {
    const { binId } = req.params;

    const data = await History
      .find({ binId })
      .sort({ timestamp: -1 })
      .limit(20);

    if (data.length < 2) {
      console.log("⚠️ Not enough data, returning fallback prediction");
      return res.json({
        binId,
        target_timestamp:  Math.floor(Date.now() / 1000) + 7200,
        confidence:        85,
        hours_until_full:  2,
        note:              "fallback — not enough history"
      });
    }

    const historyForPython = data.map(item => [
      item.fullness,
      new Date(item.timestamp).getTime() / 1000
    ]);

    try {
      const pythonResponse = await axios.post(
        'http://localhost:8000/predict',
        { history: historyForPython },
        { timeout: 2000 }
      );
      return res.json({ binId, ...pythonResponse.data });

    } catch (pyErr) {
      console.warn("⚠️ Python AI offline, using fallback");
      return res.json({
        binId,
        target_timestamp:  Math.floor(Date.now() / 1000) + 3600,
        confidence:        94,
        hours_until_full:  2.5,
        note:              "AI offline, showing fallback"
      });
    }

  } catch (err) {
    console.error("❌ Predict error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});


// GET all alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(100);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH resolve
app.patch('/api/alerts/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
    if (!alert) return res.status(404).json({ error: "Not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE dismiss
app.delete('/api/alerts/:id', async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 2. Универсальная функция отправки
const sendEmailAlert = (binId, fullness) => {
  const mailOptions = {
    from: `"MedWaste AI" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `🚨 Critical Alert: Container ${binId}`,
    html: `
      <div style="font-family: sans-serif; border: 2px solid #e11d48; padding: 20px; border-radius: 10px;">
        <h2 style="color: #e11d48;">Overfill Detected</h2>
        <p>Container <b>${binId}</b> is at <b>${fullness}%</b> capacity.</p>
        <p>Immediate collection is required to maintain safety standards.</p>
        <hr style="border: 0.5px solid #eee;">
        <p style="font-size: 0.8rem; color: #666;">MedWaste Smart Monitoring System</p>
      </div>
    `
  };

transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log("❌ Email error:", error.message);
    else console.log("📧 Email sent successfully:", info.response);
  });
};


//Driver registration (linked to user by email from sessionStorage)

app.post('/api/drivers/register', async (req, res) => {
  try {
    const { email, ...driverData } = req.body;
    
    // 1. Ищем пользователя
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Проверяем лицензию
    const expiryDate = new Date(req.body.licenseExpiry);
    if (expiryDate < new Date()) {
      return res.status(400).json({ message: "Cannot register with an expired license." });
    }

    // 3. Создаем водителя со всеми данными + статус PENDING
    const newDriver = new Driver({
      userId: user._id,
      licenseNumber: driverData.licenseNumber,
      licenseExpiry: driverData.licenseExpiry,
      company: driverData.company,
      plateNumber: driverData.plateNumber,
      vehicleModel: driverData.vehicleModel,
      vehicleYear: driverData.vehicleYear,
      capacity: driverData.capacity,
      emergencyContact: {
        name: driverData.emergencyName,
        phone: driverData.emergencyPhone,
        relation: driverData.emergencyRelation
      },
      status: 'pending' // <-- ВОТ ЭТО ВАЖНО: теперь он появится у админа
    });

    await newDriver.save();
    res.status(201).json({ message: "Application sent! Waiting for admin approval." });
  } catch (err) {
    console.error("Driver reg error:", err);
    res.status(500).json({ error: err.message });
  }
});



// 1. Получить список всех заявок со статусом pending
app.get('/api/admin/drivers/pending', isAdmin, async (req, res) => {
  try {
    const allDrivers = await Driver.find().populate('userId', 'email');
    console.log("Found drivers in DB:", allDrivers); // Посмотри это в консоли ТЕРМИНАЛА
    res.json(allDrivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Одобрить или отклонить заявку
app.patch('/api/admin/drivers/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' или 'rejected'
    const driver = await Driver.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `Status updated to ${status}`, driver });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  // Внутри PATCH /api/admin/drivers/:id/status
   const { status } = req.body;
   const driver = await Driver.findByIdAndUpdate(req.params.id, { status }, { new: true });

// Создаем уведомление для водителя
    await Notification.create({
      userId: driver.userId,
      title: status === 'approved' ? 'Application Approved! 🎉' : 'Application Update',
      message: status === 'approved' 
         ? 'Congratulations! You are now an official MedWaste driver. You can start accepting tasks.' 
         : 'Your application was declined. Please check your document details and try again.',
       type: status === 'approved' ? 'success' : 'error'
     });

});




// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));