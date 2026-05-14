const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/pg/User');
const { saveSession, deleteSession } = require('../services/redis');
const { authenticate } = require('../middleware/auth');

const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    // Only allow safe roles on self-register
    const safeRole = ['admin', 'personnel', 'driver', 'utilizer'].includes(role)
      ? role
      : 'personnel'; // default role

    const newUser = await User.create({
      fullName: fullName || email.split('@')[0],
      email,
      password: hashed,
      role: safeRole,
    });

    res.status(201).json({ ok: true, message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user)         return res.status(400).json({ error: 'User not found' });
    if (!user.password) return res.status(400).json({ error: 'Password not set. Contact admin.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Sign JWT with role
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, fullName: user.fullName },
      SECRET,
      { expiresIn: '7d' }
    );

    // Save to Redis → enables server-side logout
    await saveSession(user.id, token);

    res.json({
      token,
      email:    user.email,
      fullName: user.fullName,
      role:     user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────
router.post('/logout', authenticate, async (req, res) => {
  try {
    await deleteSession(req.user.userId);
    res.json({ ok: true, message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'email', 'fullName', 'role', 'isAvailable', 'createdAt'],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/auth/me
router.patch('/me', authenticate, async (req, res) => {
  try {
    const { fullName, department, phone } = req.body;
    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (fullName   !== undefined) user.fullName   = String(fullName).trim();
    if (department !== undefined) user.department = department;
    if (phone      !== undefined) user.phone      = phone;

    await user.save();
    res.json({ id: user.id, email: user.email, fullName: user.fullName, 
               role: user.role, department: user.department, phone: user.phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.password) return res.status(400).json({ error: 'Password is not set for this account' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ ok: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;