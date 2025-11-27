// src/scripts/seed.js
// Populate local DB with sample employees and tasks
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../../../.env', import.meta.url).pathname });

import mongoose from 'mongoose';
import connectDB from '../../src/config/db.js';
import Employee from '../../src/models/Employee.js';
import Task from '../../src/models/Task.js';

async function run() {
  await connectDB();
  console.log('Seeding database...');

  // Clear collections (safe for local dev)
  await Task.deleteMany({});
  await Employee.deleteMany({});

  const admin = await Employee.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  });

  const member = await Employee.create({
    name: 'Member User',
    email: 'member@example.com',
    password: 'member123',
    role: 'member'
  });

  const tasks = await Task.insertMany([
    { title: 'Design database schema', description: 'Employees & Tasks models', status: 'todo', priority: 'high', createdBy: admin._id, assignee: admin._id },
    { title: 'Build auth endpoints', description: 'Register/Login with JWT', status: 'in-progress', priority: 'medium', createdBy: admin._id, assignee: member._id },
    { title: 'Create Kanban UI', description: 'Drag-and-drop board', status: 'done', priority: 'low', createdBy: admin._id, assignee: member._id }
  ]);

  console.log(`Seeded: employees=${2}, tasks=${tasks.length}`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error('Seed error:', err);
  await mongoose.connection.close();
  process.exit(1);
});
