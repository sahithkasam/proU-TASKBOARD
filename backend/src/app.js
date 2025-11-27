// src/app.js
// Express application setup: middleware & route mounting
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import employeeRoutes from './routes/employee.routes.js';

const app = express();

// CORS: allow all origins (open access for demo/portfolio)
app.use(cors({
  origin: '*', // Allow all origins
  credentials: false // Set to false when using origin: '*'
}));

// Parse JSON bodies
app.use(express.json());

// Simple health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Mount feature routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/employees', employeeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (basic)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err); // For debugging
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

export default app;
