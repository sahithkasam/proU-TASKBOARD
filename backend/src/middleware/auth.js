// src/middleware/auth.js
// Middleware to protect routes using JWT in Authorization header
import { verifyToken } from '../utils/jwt.js';
import Employee from '../models/Employee.js';

export default async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    const user = await Employee.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user; // attach sanitized user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
