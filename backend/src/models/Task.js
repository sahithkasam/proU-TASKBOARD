// src/models/Task.js
// Task model: Kanban task with status workflow and assignee.
import mongoose from 'mongoose';

const STATUS = ['todo', 'in-progress', 'done'];

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: ["Title is required"],
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    status: {
      type: String,
      enum: STATUS,
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: Date
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Employee',
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    subtasks: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200
        },
        completed: {
          type: Boolean,
          default: false
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    labels: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          maxlength: 30
        },
        color: {
          type: String,
          required: true,
          default: '#6366f1'
        }
      }
    ],
    activityLog: [
      {
        action: {
          type: String,
          required: true
        },
        details: {
          type: String
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Employee'
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

// Index to quickly query by status & priority
TaskSchema.index({ status: 1, priority: 1 });

const Task = mongoose.model('Task', TaskSchema);
export default Task;
export { STATUS };
