// src/shared/TaskModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';

export default function TaskModal({ task, onClose, onSave, onDelete, employees = [], currentUser }) {
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    status: 'todo',
    assignee: '',
    dueDate: '' 
  });
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'subtasks', 'comments', 'activity'
  const [newSubtask, setNewSubtask] = useState('');
  const [newLabel, setNewLabel] = useState({ name: '', color: '#6366f1' });
  
  const toast = useToast();
  const isAdmin = currentUser?.role === 'admin';
  
  useEffect(() => {
    setForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      assignee: task.assignee?._id || task.assignee || '',
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : ''
    });
    
    // Load comments from task
    if (task.comments) {
      setComments(task.comments);
    }
  }, [task]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.warning('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await axios.post(
        `http://localhost:5001/api/tasks/${task._id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setComments(response.data.comments || []);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) {
      toast.warning('Please enter a subtask title');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/tasks/${task._id}/subtasks`,
        { title: newSubtask },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      onSave(response.data);
      setNewSubtask('');
      toast.success('Subtask added!');
    } catch (error) {
      console.error('Failed to add subtask:', error);
      toast.error('Failed to add subtask');
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5001/api/tasks/${task._id}/subtasks/${subtaskId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      onSave(response.data);
      toast.success('Subtask updated!');
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
      toast.error('Failed to update subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/tasks/${task._id}/subtasks/${subtaskId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      onSave(response.data);
      toast.success('Subtask deleted!');
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      toast.error('Failed to delete subtask');
    }
  };

  const handleAddLabel = async () => {
    if (!newLabel.name.trim()) {
      toast.warning('Please enter a label name');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/tasks/${task._id}/labels`,
        newLabel,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      onSave(response.data);
      setNewLabel({ name: '', color: '#6366f1' });
      toast.success('Label added!');
    } catch (error) {
      console.error('Failed to add label:', error);
      toast.error(error.response?.data?.message || 'Failed to add label');
    }
  };

  const handleDeleteLabel = async (labelId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/tasks/${task._id}/labels/${labelId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      onSave(response.data);
      toast.success('Label removed!');
    } catch (error) {
      console.error('Failed to delete label:', error);
      toast.error('Failed to remove label');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  function overlayClick(e) { if (e.target.classList.contains('modal-overlay')) onClose(); }

  return (
    <div className="modal-overlay" onClick={overlayClick}>
      <div className="modal-card-large">
        <div className="modal-header">
          <h3>Task Details {!isAdmin && <span style={{fontSize: '0.85rem', color: '#999'}}>(View Only)</span>}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            📋 Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'subtasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('subtasks')}
          >
            ✅ Subtasks ({task.subtasks?.length || 0})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 Comments ({comments.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            🕐 Activity
          </button>
        </div>

        <div className="modal-body">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="tab-content">
              <label>
                Title
                <input 
                  value={form.title} 
                  onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} 
                  disabled={!isAdmin}
                />
              </label>
              <label>
                Description
                <textarea 
                  value={form.description} 
                  onChange={(e)=>setForm(f=>({...f,description:e.target.value}))}
                  disabled={!isAdmin}
                  rows="4"
                />
              </label>
              
              {isAdmin && (
                <>
                  <label>
                    Status
                    <select value={form.status} onChange={(e)=>setForm(f=>({...f,status:e.target.value}))}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </label>
                  <label>
                    Assignee
                    <select value={form.assignee} onChange={(e)=>setForm(f=>({...f,assignee:e.target.value}))}>
                      <option value="">Unassigned</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
              
              <label>
                Priority
                <select 
                  value={form.priority} 
                  onChange={(e)=>setForm(f=>({...f,priority:e.target.value}))}
                  disabled={!isAdmin}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label>
                Due Date
                <input 
                  type="date" 
                  value={form.dueDate} 
                  onChange={(e)=>setForm(f=>({...f,dueDate:e.target.value}))}
                  disabled={!isAdmin}
                />
              </label>
            </div>
          )}

          {/* Subtasks Tab */}
          {activeTab === 'subtasks' && (
            <div className="tab-content">
              <div className="subtasks-section">
                {/* Progress Bar */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="subtask-progress">
                    <div className="progress-text">
                      {task.subtasks.filter(st => st.completed).length} of {task.subtasks.length} completed
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{
                          width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Add Subtask */}
                <div className="subtask-input-box">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                    placeholder="Add a subtask..."
                    className="subtask-input"
                  />
                  <button 
                    onClick={handleAddSubtask}
                    disabled={!newSubtask.trim()}
                    className="btn-add-subtask"
                  >
                    Add
                  </button>
                </div>

                {/* Subtask List */}
                <div className="subtasks-list">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    task.subtasks.map(subtask => (
                      <div key={subtask._id} className="subtask-item">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleToggleSubtask(subtask._id)}
                          className="subtask-checkbox"
                        />
                        <span className={`subtask-title ${subtask.completed ? 'completed' : ''}`}>
                          {subtask.title}
                        </span>
                        <button
                          onClick={() => handleDeleteSubtask(subtask._id)}
                          className="btn-delete-subtask"
                          title="Delete subtask"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-subtasks">No subtasks yet. Add one above!</p>
                  )}
                </div>

                {/* Labels Section */}
                <div className="labels-section">
                  <h4>Labels</h4>
                  
                  {/* Add Label */}
                  <div className="label-input-box">
                    <input
                      type="text"
                      value={newLabel.name}
                      onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
                      placeholder="Label name..."
                      className="label-input"
                    />
                    <input
                      type="color"
                      value={newLabel.color}
                      onChange={(e) => setNewLabel({...newLabel, color: e.target.value})}
                      className="color-picker"
                    />
                    <button 
                      onClick={handleAddLabel}
                      disabled={!newLabel.name.trim()}
                      className="btn-add-label"
                    >
                      Add
                    </button>
                  </div>

                  {/* Labels Display */}
                  <div className="labels-list">
                    {task.labels && task.labels.length > 0 ? (
                      task.labels.map(label => (
                        <span 
                          key={label._id} 
                          className="label-badge"
                          style={{ backgroundColor: label.color }}
                        >
                          {label.name}
                          <button
                            onClick={() => handleDeleteLabel(label._id)}
                            className="label-remove"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="no-labels">No labels yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="tab-content">
              <div className="comments-section">
                {/* Comment Input */}
                <div className="comment-input-box">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    className="comment-textarea"
                  />
                  <div className="comment-actions">
                    <button 
                      onClick={handleAddComment}
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="btn-comment-submit"
                    >
                      {isSubmittingComment ? 'Adding...' : 'Add Comment'}
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="empty-message">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.slice().reverse().map((comment, index) => (
                      <div key={index} className="comment-item">
                        <div className="comment-avatar">
                          {comment.author?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-author">{comment.author?.name || 'Unknown'}</span>
                            <span className="comment-time">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="tab-content">
              <div className="activity-section">
                {task.activityLog && task.activityLog.length > 0 ? (
                  <div className="activity-list">
                    {task.activityLog.slice().reverse().map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">
                          {activity.action === 'commented' ? '💬' :
                           activity.action === 'created' ? '✨' :
                           activity.action === 'updated' ? '✏️' :
                           activity.action === 'status_changed' ? '🔄' : '📝'}
                        </div>
                        <div className="activity-content">
                          <p className="activity-text">
                            <strong>{activity.user?.name || 'Someone'}</strong> {activity.action} 
                            {activity.details && `: ${activity.details}`}
                          </p>
                          <span className="activity-time">{formatDate(activity.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No activity yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          {isAdmin && <button className="danger" onClick={onDelete}>Delete</button>}
          <div style={{flex:1}} />
          <button onClick={onClose}>Close</button>
          {isAdmin && activeTab === 'details' && (
            <button onClick={()=>onSave({ 
              ...form, 
              dueDate: form.dueDate ? new Date(form.dueDate) : null,
              assignee: form.assignee || null
            })}>
              Save Changes
            </button>
          )}
        </div>
      </div>
      <style>{`
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fadeIn 0.2s ease-out}
        @keyframes fadeIn{from{opacity:0}}
        
        .modal-card-large{background:#fff;border-radius:16px;max-width:700px;width:92%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.3s ease-out}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}}
        
        .modal-header{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 1.5rem 1rem 1.5rem;border-bottom:1px solid #e5e7eb}
        .modal-header h3{margin:0;font-size:1.5rem;font-weight:600;color:#1f2937}
        .close-btn{background:none;border:none;font-size:2rem;color:#6b7280;cursor:pointer;padding:0;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all 0.2s}
        .close-btn:hover{background:#f3f4f6;color:#1f2937}
        
        .modal-tabs{display:flex;gap:0.5rem;padding:0 1.5rem;border-bottom:2px solid #e5e7eb}
        .tab-btn{background:none;border:none;padding:0.75rem 1rem;cursor:pointer;font-size:0.95rem;font-weight:500;color:#6b7280;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all 0.2s;display:flex;align-items:center;gap:0.5rem}
        .tab-btn:hover{color:#1f2937;background:#f9fafb}
        .tab-btn.active{color:#6366f1;border-bottom-color:#6366f1}
        
        .modal-body{padding:1.5rem;overflow-y:auto;flex:1}
        .tab-content{display:flex;flex-direction:column;gap:1rem}
        
        .modal-body input,.modal-body textarea,.modal-body select{width:100%;padding:0.625rem 0.75rem;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;transition:all 0.2s;font-family:inherit}
        .modal-body input:focus,.modal-body textarea:focus,.modal-body select:focus{outline:none;border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.1)}
        .modal-body input:disabled,.modal-body textarea:disabled,.modal-body select:disabled{background:#f9fafb;cursor:not-allowed;color:#9ca3af}
        .modal-body label{font-size:0.9rem;font-weight:500;color:#374151;display:flex;flex-direction:column;gap:0.375rem}
        
        /* Comments Section */
        .comments-section{display:flex;flex-direction:column;gap:1.5rem}
        .comment-input-box{background:#f9fafb;padding:1rem;border-radius:12px;border:1px solid #e5e7eb}
        .comment-textarea{resize:vertical;min-height:80px;background:#fff;font-size:0.95rem}
        .comment-actions{display:flex;justify-content:flex-end;margin-top:0.75rem}
        .btn-comment-submit{background:#6366f1;color:#fff;border:none;padding:0.5rem 1.25rem;border-radius:8px;cursor:pointer;font-weight:500;font-size:0.9rem;transition:all 0.2s}
        .btn-comment-submit:hover:not(:disabled){background:#4f46e5;transform:translateY(-1px)}
        .btn-comment-submit:disabled{opacity:0.5;cursor:not-allowed}
        
        .comments-list{display:flex;flex-direction:column;gap:1rem;max-height:400px;overflow-y:auto}
        .comment-item{display:flex;gap:0.75rem;padding:1rem;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;transition:all 0.2s}
        .comment-item:hover{background:#f3f4f6;border-color:#d1d5db}
        .comment-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;flex-shrink:0}
        .comment-content{flex:1;min-width:0}
        .comment-header{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem}
        .comment-author{font-weight:600;color:#1f2937;font-size:0.95rem}
        .comment-time{font-size:0.8rem;color:#9ca3af}
        .comment-text{margin:0;color:#4b5563;font-size:0.95rem;line-height:1.5;word-wrap:break-word}
        
        /* Activity Section */
        .activity-section{display:flex;flex-direction:column;gap:1rem}
        .activity-list{display:flex;flex-direction:column;gap:0.75rem;max-height:400px;overflow-y:auto}
        .activity-item{display:flex;gap:0.75rem;padding:0.875rem;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb}
        .activity-icon{font-size:1.5rem;line-height:1}
        .activity-content{flex:1}
        .activity-text{margin:0 0 0.25rem 0;color:#374151;font-size:0.9rem;line-height:1.4}
        .activity-time{font-size:0.8rem;color:#9ca3af}
        
        .empty-message{text-align:center;padding:3rem 1rem;color:#9ca3af;font-size:0.95rem}
        
        .modal-actions{display:flex;gap:0.5rem;justify-content:flex-end;padding:1rem 1.5rem;border-top:1px solid #e5e7eb;background:#f9fafb}
        .modal-actions button{padding:0.625rem 1.25rem;border:none;border-radius:8px;cursor:pointer;font-size:0.9rem;font-weight:500;transition:all 0.2s}
        .modal-actions button:not(.danger){background:#6366f1;color:#fff}
        .modal-actions button:not(.danger):hover{background:#4f46e5;transform:translateY(-1px)}
        .danger{background:#ef4444;color:#fff}
        .danger:hover{background:#dc2626;transform:translateY(-1px)}
        
        @media(max-width:768px){
          .modal-card-large{max-width:95%;max-height:90vh}
          .modal-header{padding:1rem}
          .modal-body{padding:1rem}
          .modal-tabs{padding:0 1rem}
          .tab-btn{padding:0.625rem 0.75rem;font-size:0.85rem}
          .comment-avatar{width:36px;height:36px;font-size:1rem}
        }
      `}</style>
    </div>
  );
}
