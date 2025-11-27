// src/routes/auth.routes.js
// Authentication endpoints: register & login
import express from 'express';
import Employee from '../models/Employee.js';
import { signToken } from '../utils/jwt.js';
import auth from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const oauthClient = googleClientId ? new OAuth2Client(googleClientId) : null;

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const employee = await Employee.create({ name, email, password, role });
    const token = signToken({ id: employee._id, role: employee.role });
    res.status(201).json({ user: employee, token });
  } catch (err) {
    console.error('[Register Debug] Incoming body:', req.body);
    console.error('[Register Debug] Error stack:', err.stack);
    // Duplicate email (unique index) safety net
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    // Mongoose validation errors
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid input', detail: err.message });
    }
    res.status(500).json({ message: 'Registration failed', detail: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken({ id: user._id, role: user.role });
    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;

// GET /api/auth/me - return current authenticated user
router.get('/me', auth, async (req, res) => {
  // req.user is attached by auth middleware (sans password)
  res.json({ user: req.user });
});

// POST /api/auth/google - authenticate using Google ID token
router.post('/google', async (req, res) => {
  try {
    if (!oauthClient) return res.status(500).json({ message: 'Google auth not configured' });
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken required' });
    const ticket = await oauthClient.verifyIdToken({ idToken, audience: googleClientId });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;
    if (!email) return res.status(400).json({ message: 'Google token missing email' });
    let user = await Employee.findOne({ provider: 'google', providerId: sub });
    if (!user) {
      // If an account exists with same email but local, you may want to merge; here we reuse it.
      user = await Employee.findOne({ email });
      if (user && !user.provider) {
        user.provider = 'google';
        user.providerId = sub;
        await user.save();
      }
    }
    if (!user) {
      user = await Employee.create({
        name: name || email.split('@')[0],
        email,
        provider: 'google',
        providerId: sub,
        role: 'member'
      });
    }
    const token = signToken({ id: user._id, role: user.role });
    res.json({ user, token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: 'Google authentication failed', detail: err.message });
  }
});
