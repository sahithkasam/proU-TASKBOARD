// src/routes/employee.routes.js
// List employees (protected). Future: admin-only create/update/delete.
import express from 'express';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';
import Employee from '../models/Employee.js';

const router = express.Router();
router.use(auth);

// GET /api/employees - list all employees (basic fields)
router.get('/', async (_req, res) => {
  try {
    const employees = await Employee.find().select('name email role createdAt');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

// POST /api/employees - create employee (admin only)
router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { name, email, password, role = 'member' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const created = await Employee.create({ name, email, password, role });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create employee', detail: err.message });
  }
});

// PUT /api/employees/:id - update employee (admin only)
router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    if (name !== undefined) employee.name = name;
    if (email !== undefined) employee.email = email;
    if (role !== undefined) employee.role = role;
    if (password) employee.password = password; // will be hashed by pre-save hook
    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update employee', detail: err.message });
  }
});

// DELETE /api/employees/:id - remove employee (admin only)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});

export default router;
