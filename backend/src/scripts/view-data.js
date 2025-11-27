// View all database data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/Employee.js';
import Task from '../models/Task.js';

dotenv.config();

async function viewData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all employees
    console.log('═══════════════════════════════════════════');
    console.log('👥 EMPLOYEES (Users & Admins)');
    console.log('═══════════════════════════════════════════\n');
    
    const employees = await Employee.find().select('-password').sort({ role: -1, createdAt: 1 });
    
    if (employees.length === 0) {
      console.log('No employees found. Run: npm run seed\n');
    } else {
      employees.forEach((emp, index) => {
        console.log(`${index + 1}. ${emp.name}`);
        console.log(`   📧 Email: ${emp.email}`);
        console.log(`   👤 Role: ${emp.role.toUpperCase()}`);
        console.log(`   🆔 ID: ${emp._id}`);
        if (emp.provider) {
          console.log(`   🔐 Auth: ${emp.provider} OAuth`);
        }
        console.log(`   📅 Created: ${emp.createdAt.toLocaleDateString()}`);
        console.log('');
      });
      
      const adminCount = employees.filter(e => e.role === 'admin').length;
      const memberCount = employees.filter(e => e.role === 'member').length;
      console.log(`📊 Summary: ${adminCount} admin(s), ${memberCount} member(s)\n`);
    }

    // Get all tasks
    console.log('═══════════════════════════════════════════');
    console.log('📋 TASKS');
    console.log('═══════════════════════════════════════════\n');
    
    const tasks = await Task.find()
      .populate('assignee', 'name email')
      .populate('createdBy', 'name')
      .sort({ status: 1, priority: -1 });
    
    if (tasks.length === 0) {
      console.log('No tasks found. Run: npm run seed\n');
    } else {
      const tasksByStatus = {
        'todo': [],
        'in-progress': [],
        'done': []
      };
      
      tasks.forEach(task => {
        tasksByStatus[task.status]?.push(task);
      });
      
      Object.entries(tasksByStatus).forEach(([status, tasks]) => {
        const statusLabel = status === 'in-progress' ? 'IN PROGRESS' : status.toUpperCase();
        console.log(`\n📌 ${statusLabel} (${tasks.length})`);
        console.log('─────────────────────────────────────────');
        
        tasks.forEach((task, index) => {
          const priorityEmoji = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
          console.log(`\n${index + 1}. ${priorityEmoji} ${task.title}`);
          console.log(`   Description: ${task.description || 'N/A'}`);
          console.log(`   Priority: ${task.priority}`);
          console.log(`   Assignee: ${task.assignee?.name || 'Unassigned'} ${task.assignee?.email ? `(${task.assignee.email})` : ''}`);
          console.log(`   Created by: ${task.createdBy?.name || 'Unknown'}`);
          if (task.dueDate) {
            console.log(`   Due: ${new Date(task.dueDate).toLocaleDateString()}`);
          }
          console.log(`   ID: ${task._id}`);
        });
      });
      
      console.log('\n');
      const priorityCounts = {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      };
      console.log(`📊 Summary: ${tasks.length} total tasks`);
      console.log(`   🔴 High: ${priorityCounts.high} | 🟡 Medium: ${priorityCounts.medium} | 🟢 Low: ${priorityCounts.low}\n`);
    }

    await mongoose.connection.close();
    console.log('═══════════════════════════════════════════');
    console.log('✅ Database view complete!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

viewData();
