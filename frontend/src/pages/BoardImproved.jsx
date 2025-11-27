// src/pages/BoardImproved.jsx
// Modern Board with React Query hooks and better state management
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTasks } from '../hooks/useTasks';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskModal from '../shared/TaskModal';

const COLUMNS = {
  todo: { id: 'todo', title: 'To Do', status: 'todo' },
  'in-progress': { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
  done: { id: 'done', title: 'Done', status: 'done' },
};

export default function BoardImproved() {
  const { tasks, isLoading, createTask, updateStatus, updateTask, deleteTask } = useTasks();
  const { employees } = useEmployees();
  const { currentUser } = useAuth();
  const toast = useToast();
  const [modalTask, setModalTask] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const searchInputRef = useRef(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    assignee: 'all',
    showOverdue: false,
    showMyTasks: false,
  });

  // Apply filters - Define before useEffect to prevent initialization errors
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          task.title?.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Assignee filter
      if (filters.assignee !== 'all') {
        const taskAssigneeId = task.assignee?._id || task.assignee;
        if (taskAssigneeId !== filters.assignee) return false;
      }

      // Overdue filter
      if (filters.showOverdue) {
        if (!task.dueDate || new Date(task.dueDate) >= new Date()) return false;
      }

      // My Tasks filter
      if (filters.showMyTasks && currentUser) {
        const taskAssigneeId = task.assignee?._id || task.assignee;
        if (taskAssigneeId !== currentUser._id) return false;
      }

      return true;
    });
  }, [tasks, filters, currentUser]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Allow Escape to work even in inputs
        if (e.key === 'Escape') {
          e.target.blur();
          setShowCreateForm(false);
          setModalTask(null);
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          setShowCreateForm(prev => !prev);
          toast.info('New task form ' + (showCreateForm ? 'closed' : 'opened'));
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          toast.info('Search focused');
          break;
        case '?':
          e.preventDefault();
          setShowShortcutsHelp(prev => !prev);
          break;
        case 'escape':
          setShowCreateForm(false);
          setModalTask(null);
          setSelectedTasks(new Set());
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (selectedTasks.size === filteredTasks.length) {
              setSelectedTasks(new Set());
              toast.info('All tasks deselected');
            } else {
              setSelectedTasks(new Set(filteredTasks.map(t => t._id)));
              toast.info(`${filteredTasks.length} tasks selected`);
            }
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showCreateForm, filteredTasks, selectedTasks, toast]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    updateStatus({ id: draggableId, status: newStatus });
  };

  const tasksByStatus = useMemo(() => {
    const grouped = { todo: [], 'in-progress': [], done: [] };
    filteredTasks.forEach((task) => {
      if (grouped[task.status]) grouped[task.status].push(task);
    });
    return grouped;
  }, [filteredTasks]);

  const handleCreateTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority') || 'medium',
      assignee: formData.get('assignee') || null,
      dueDate: formData.get('dueDate') || null,
    };
    createTask(taskData);
    e.target.reset();
    setShowCreateForm(false);
  };

  // Bulk action handlers
  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedTasks.size} selected tasks?`)) return;
    
    const deletePromises = Array.from(selectedTasks).map(id => deleteTask(id));
    await Promise.all(deletePromises);
    setSelectedTasks(new Set());
    toast.success(`${deletePromises.length} tasks deleted`);
  };

  const handleBulkUpdateStatus = async (newStatus) => {
    const updatePromises = Array.from(selectedTasks).map(id => 
      updateStatus({ id, status: newStatus })
    );
    await Promise.all(updatePromises);
    setSelectedTasks(new Set());
    toast.success(`${updatePromises.length} tasks moved to ${newStatus}`);
  };

  const handleBulkUpdatePriority = async (newPriority) => {
    const updatePromises = Array.from(selectedTasks).map(id => 
      updateTask({ id, updates: { priority: newPriority } })
    );
    await Promise.all(updatePromises);
    setSelectedTasks(new Set());
    toast.success(`${updatePromises.length} tasks priority updated to ${newPriority}`);
  };

  const handleBulkAssign = async (assigneeId) => {
    const updatePromises = Array.from(selectedTasks).map(id => 
      updateTask({ id, updates: { assignee: assigneeId || null } })
    );
    await Promise.all(updatePromises);
    setSelectedTasks(new Set());
    const assigneeName = employees.find(e => e._id === assigneeId)?.name || 'Unassigned';
    toast.success(`${updatePromises.length} tasks assigned to ${assigneeName}`);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  const totalTasks = filteredTasks.length;
  const hasActiveFilters = filters.search || filters.priority !== 'all' || filters.assignee !== 'all' || filters.showOverdue || filters.showMyTasks;

  return (
    <div className="board-page">
      {/* Header with Title and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Task Board</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn-help" 
            onClick={() => setShowShortcutsHelp(true)}
            title="Keyboard Shortcuts (Press ?)"
          >
            ⌨️ Shortcuts
          </button>
          <button 
            className="btn-primary" 
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.95rem' }}
          >
            {showCreateForm ? '✕ Cancel' : '+ New Task (N)'}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <div className="modal-overlay" onClick={() => setShowShortcutsHelp(false)}>
          <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>⌨️ Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcutsHelp(false)} className="close-btn">×</button>
            </div>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <kbd>N</kbd>
                <span>Create new task</span>
              </div>
              <div className="shortcut-item">
                <kbd>/</kbd>
                <span>Focus search bar</span>
              </div>
              <div className="shortcut-item">
                <kbd>Esc</kbd>
                <span>Close modal / Cancel form</span>
              </div>
              <div className="shortcut-item">
                <kbd>Ctrl/Cmd</kbd> + <kbd>A</kbd>
                <span>Select/Deselect all tasks</span>
              </div>
              <div className="shortcut-item">
                <kbd>?</kbd>
                <span>Show keyboard shortcuts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedTasks.size > 0 && (
        <div className="bulk-actions-bar">
          <div className="bulk-info">
            <span className="bulk-count">{selectedTasks.size} selected</span>
            <button 
              className="bulk-clear" 
              onClick={() => setSelectedTasks(new Set())}
            >
              Clear Selection
            </button>
          </div>
          <div className="bulk-buttons">
            <select onChange={(e) => { handleBulkUpdateStatus(e.target.value); e.target.value = ''; }} defaultValue="">
              <option value="" disabled>Move to...</option>
              <option value="todo">📋 To Do</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="done">✅ Done</option>
            </select>
            <select onChange={(e) => { handleBulkUpdatePriority(e.target.value); e.target.value = ''; }} defaultValue="">
              <option value="" disabled>Set priority...</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <select onChange={(e) => { handleBulkAssign(e.target.value); e.target.value = ''; }} defaultValue="">
              <option value="" disabled>Assign to...</option>
              <option value="">Unassigned</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
            <button className="bulk-delete" onClick={handleBulkDelete}>
              🗑️ Delete
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <div className="filter-bar">
        {/* Search */}
        <div className="filter-search">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="🔍 Search tasks... (Press /)"
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        {/* Assignee Filter */}
        <select
          value={filters.assignee}
          onChange={(e) => setFilters(f => ({ ...f, assignee: e.target.value }))}
          className="filter-select"
        >
          <option value="all">All Assignees</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>

        {/* Quick Filters */}
        <button
          className={`filter-chip ${filters.showMyTasks ? 'active' : ''}`}
          onClick={() => setFilters(f => ({ ...f, showMyTasks: !f.showMyTasks }))}
        >
          👤 My Tasks
        </button>

        <button
          className={`filter-chip ${filters.showOverdue ? 'active' : ''}`}
          onClick={() => setFilters(f => ({ ...f, showOverdue: !f.showOverdue }))}
        >
          ⏰ Overdue
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            className="filter-clear"
            onClick={() => setFilters({ search: '', priority: 'all', assignee: 'all', showOverdue: false, showMyTasks: false })}
          >
            ✕ Clear
          </button>
        )}

        {/* Results Count */}
        <div className="filter-results">
          {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreateTask}
          style={{
            background: '#f9f9f9',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          <input name="title" placeholder="Task title" required style={{ width: '100%', marginBottom: '0.5rem' }} />
          <textarea name="description" placeholder="Description" style={{ width: '100%', marginBottom: '0.5rem' }} />
          <select name="priority" style={{ marginRight: '0.5rem' }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select name="assignee" style={{ marginRight: '0.5rem' }}>
            <option value="">Unassigned</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
          <input name="dueDate" type="date" style={{ marginRight: '0.5rem' }} />
          <button type="submit">Create</button>
        </form>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {Object.values(COLUMNS).map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: '#f4f4f4',
                    padding: '1rem',
                    borderRadius: '8px',
                    minHeight: '400px',
                  }}
                >
                  <h3>{column.title}</h3>
                  {tasksByStatus[column.status]?.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: 'white',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            position: 'relative',
                            border: selectedTasks.has(task._id) ? '2px solid #6366f1' : '1px solid transparent',
                            ...provided.draggableProps.style,
                          }}
                        >
                          {/* Selection Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedTasks.has(task._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectTask(task._id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              cursor: 'pointer',
                              width: '18px',
                              height: '18px',
                            }}
                          />
                          <div onClick={() => setModalTask(task)} style={{ flex: 1 }}>
                            <strong>{task.title}</strong>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                              {task.priority} • {task.assignee?.name || 'Unassigned'}
                            </div>
                            {/* Labels */}
                            {task.labels && task.labels.length > 0 && (
                              <div className="task-labels">
                                {task.labels.map(label => (
                                  <span 
                                    key={label._id}
                                    className="task-label-badge"
                                    style={{ backgroundColor: label.color }}
                                  >
                                    {label.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            {/* Subtasks Progress */}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
                                ✅ {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {modalTask && (
        <TaskModal
          task={modalTask}
          employees={employees}
          currentUser={currentUser}
          onClose={() => setModalTask(null)}
          onSave={(updatedData) => {
            updateTask({ id: modalTask._id, updates: updatedData });
            setModalTask(null);
          }}
          onDelete={(id) => {
            deleteTask(id);
            setModalTask(null);
          }}
        />
      )}
    </div>
  );
}
