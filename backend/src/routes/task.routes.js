// src/routes/task.routes.js
// Task CRUD and status update endpoints
import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(auth);

// POST /api/tasks - create task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignee } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignee: assignee || null,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task', detail: err.message });
  }
});

// GET /api/tasks - list tasks (optionally by status or assignee)
router.get('/', async (req, res) => {
  try {
    const { status, assignee } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    const tasks = await Task.find(filter)
      .populate('assignee createdBy', 'name email role')
      .populate('comments.author', 'name email role')
      .populate('activityLog.user', 'name email role');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee createdBy', 'name email role')
      .populate('comments.author', 'name email role')
      .populate('activityLog.user', 'name email role');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch task' });
  }
});

// PUT /api/tasks/:id - update task fields
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', detail: err.message });
  }
});

// PATCH /api/tasks/:id/status - update only status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status required' });
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', detail: err.message });
  }
});

// DELETE /api/tasks/:id - remove task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// POST /api/tasks/:id/comments - add a comment to a task
router.post('/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comment = {
      text: text.trim(),
      author: req.user._id,
      createdAt: new Date()
    };

    task.comments.push(comment);

    // Add to activity log
    task.activityLog.push({
      action: 'commented',
      details: text.trim().substring(0, 50) + (text.length > 50 ? '...' : ''),
      user: req.user._id,
      timestamp: new Date()
    });

    await task.save();
    
    // Populate the comment author before sending response
    const updatedTask = await Task.findById(task._id)
      .populate('assignee createdBy', 'name email role')
      .populate('comments.author', 'name email role')
      .populate('activityLog.user', 'name email role');
    
    res.status(201).json(updatedTask);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Failed to add comment', detail: err.message });
  }
});

// GET /api/tasks/:id/comments - get all comments for a task
router.get('/:id/comments', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('comments.author', 'name email role');
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    res.json(task.comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// GET /api/tasks/:id/activity - get activity log for a task
router.get('/:id/activity', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('activityLog.user', 'name email role');
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    res.json(task.activityLog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch activity log' });
  }
});

// POST /api/tasks/:id/subtasks - add a subtask
router.post('/:id/subtasks', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Subtask title is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.subtasks.push({
      title: title.trim(),
      completed: false
    });

    await task.save();
    
    const updatedTask = await Task.findById(task._id)
      .populate('assignee createdBy', 'name email role');
    
    res.status(201).json(updatedTask);
  } catch (err) {
    console.error('Add subtask error:', err);
    res.status(500).json({ message: 'Failed to add subtask', detail: err.message });
  }
});

// PATCH /api/tasks/:id/subtasks/:subtaskId - toggle subtask completion
router.patch('/:id/subtasks/:subtaskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });

    subtask.completed = !subtask.completed;
    await task.save();
    
    const updatedTask = await Task.findById(task._id)
      .populate('assignee createdBy', 'name email role');
    
    res.json(updatedTask);
  } catch (err) {
    console.error('Toggle subtask error:', err);
    res.status(500).json({ message: 'Failed to toggle subtask', detail: err.message });
  }
});

// DELETE /api/tasks/:id/subtasks/:subtaskId - delete a subtask
router.delete('/:id/subtasks/:subtaskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.subtasks.pull(req.params.subtaskId);
    await task.save();
    
    const updatedTask = await Task.findById(task._id)
      .populate('assignee createdBy', 'name email role');
    
    res.json(updatedTask);
  } catch (err) {
    console.error('Delete subtask error:', err);
    res.status(500).json({ message: 'Failed to delete subtask', detail: err.message });
  }
});

// POST /api/tasks/:id/labels - add a label to task
router.post('/:id/labels', async (req, res) => {
  try {
    const { name, color } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Label name is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check if label already exists
    const existingLabel = task.labels.find(l => l.name.toLowerCase() === name.toLowerCase());
    if (existingLabel) {
      return res.status(400).json({ message: 'Label already exists on this task' });
    }

    task.labels.push({
      name: name.trim(),
      color: color || '#6366f1'
    });

    await task.save();
    
    const updatedTask = await Task.findById(task._id)
      .populate('assignee createdBy', 'name email role');
    
    res.status(201).json(updatedTask);
  } catch (err) {
    console.error('Add label error:', err);
    res.status(500).json({ message: 'Failed to add label', detail: err.message });
  }
});

// DELETE /api/tasks/:id/labels/:labelId - remove a label
router.delete('/:id/labels/:labelId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.labels.pull(req.params.labelId);
    await task.save();
    
    const updatedTask = await Task.findById(task._id)
      .populate('assignee createdBy', 'name email role');
    
    res.json(updatedTask);
  } catch (err) {
    console.error('Delete label error:', err);
    res.status(500).json({ message: 'Failed to delete label', detail: err.message });
  }
});

export default router;
