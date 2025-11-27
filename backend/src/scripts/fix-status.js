// Migration script to fix in_progress -> in-progress
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task.js';

dotenv.config();

async function fixStatus() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all tasks with in_progress to in-progress
    const result = await Task.updateMany(
      { status: 'in_progress' },
      { $set: { status: 'in-progress' } }
    );

    console.log(`Updated ${result.modifiedCount} tasks from 'in_progress' to 'in-progress'`);
    
    // Show current status distribution
    const statusCounts = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    console.log('\nCurrent status distribution:');
    statusCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });

    await mongoose.connection.close();
    console.log('\nMigration complete!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

fixStatus();
