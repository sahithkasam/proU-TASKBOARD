// src/pages/Employees.jsx
import React, { useEffect, useState } from 'react';
import { listEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employees.js';
import { useAuth } from '../state/AuthContext.jsx';

export default function Employees() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await listEmployees();
        setEmployees(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load employees');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const created = await createEmployee(form);
      setEmployees(prev => [created, ...prev]);
      setForm({ name: '', email: '', password: '', role: 'member' });
    } catch (err) {
      alert(err.response?.data?.message || 'Create failed');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const updated = await updateEmployee(editing._id, form);
      setEmployees(prev => prev.map(x => (x._id === updated._id ? updated : x)));
      setEditing(null);
      setForm({ name: '', email: '', password: '', role: 'member' });
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete employee?')) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(x => x._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  }

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="employees-page">
      <h2>Employees</h2>

      {isAdmin && (
        <form className="auth-form" onSubmit={editing ? handleUpdate : handleCreate} style={{marginBottom:'1rem'}}>
          <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
            <input placeholder="Name" value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} required />
            <input placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} required />
            <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} required={!editing} />
            <select value={form.role} onChange={(e)=>setForm(f=>({...f,role:e.target.value}))}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button>{editing ? 'Save' : 'Add'}</button>
            {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({ name:'', email:'', password:'', role:'member' }); }}>Cancel</button>}
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th>{isAdmin && <th>Actions</th>}</tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e._id}>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.role}</td>
              {isAdmin && (
                <td>
                  <button onClick={()=>{ setEditing(e); setForm({ name:e.name, email:e.email, password:'', role:e.role }); }}>Edit</button>
                  <button onClick={()=>handleDelete(e._id)} style={{marginLeft:'0.25rem'}}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
