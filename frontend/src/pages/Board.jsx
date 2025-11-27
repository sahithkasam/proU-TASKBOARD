// src/pages/Board.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchTasks, createTask, updateTaskStatus, updateTask, deleteTask } from '../api/tasks.js';
import TaskModal from '../shared/TaskModal.jsx';

const COLUMN_TITLES = { todo: 'Todo', in_progress: 'In Progress', done: 'Done' };
const COLUMNS = Object.keys(COLUMN_TITLES);

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [selected, setSelected] = useState(null); // task for modal

  async function load() {
    setLoading(true); setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const g = { todo: [], in_progress: [], done: [] };
    tasks.forEach(t => g[t.status].push(t));
    return g;
  }, [tasks]);

  async function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const from = source.droppableId; const to = destination.droppableId;
    if (from === to && destination.index === source.index) return;
    const id = draggableId;
    // optimistic update
    setTasks(prev => prev.map(t => (t._id === id ? { ...t, status: to } : t)));
    try {
      await updateTaskStatus(id, to);
    } catch {
      // revert on failure
      setTasks(prev => prev.map(t => (t._id === id ? { ...t, status: from } : t)));
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const task = await createTask({ title: newTitle });
      setTasks(prev => [task, ...prev]);
      setNewTitle('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  }

  async function handleSave(taskId, updates) {
    const updated = await updateTask(taskId, updates);
    setTasks(prev => prev.map(t => (t._id === taskId ? updated : t)));
  }

  async function handleDelete(taskId) {
    if (!confirm('Delete this task?')) return;
    await deleteTask(taskId);
    setTasks(prev => prev.filter(t => t._id !== taskId));
  }

  if (loading) return <p>Loading board...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="board-page">
      <form className="new-task-form" onSubmit={handleCreate}>
        <input placeholder="New task title" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} />
        <button>Add</button>
      </form>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          {COLUMNS.map(col => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div className="board-column" ref={provided.innerRef} {...provided.droppableProps}>
                  <h3>{COLUMN_TITLES[col]}</h3>
                  {grouped[col].map((t, idx) => (
                    <Draggable key={t._id} draggableId={t._id} index={idx}>
                      {(dragProvided) => (
                        <div className={`task-card priority-${t.priority}`} ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} onClick={()=>setSelected(t)}>
                          <strong>{t.title}</strong>
                          {t.description && <p>{t.description}</p>}
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

      {selected && (
        <TaskModal
          task={selected}
          onClose={() => setSelected(null)}
          onSave={async (updates) => { await handleSave(selected._id, updates); setSelected(null); }}
          onDelete={async () => { await handleDelete(selected._id); setSelected(null); }}
        />
      )}
    </div>
  );
}
