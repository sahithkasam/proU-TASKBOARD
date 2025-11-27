// src/middleware/requireRole.js
// Ensure the authenticated user has one of the allowed roles
export default function requireRole(...roles) {
  return function (req, res, next) {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
