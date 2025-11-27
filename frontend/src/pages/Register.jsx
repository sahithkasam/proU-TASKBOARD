// src/pages/Register.jsx
import React, { useState } from 'react';
import { register } from '../api/auth.js';
import { useAuth } from '../state/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = await register(form);
      login(data); // reuse login context method to store token
      navigate('/board');
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 409) setError('Email already registered');
        else if (status === 400) setError(data.detail || data.message || 'Invalid input');
        else setError(data.message || `Registration failed (status ${status})`);
      } else if (err.request) {
        setError('Network error: backend unreachable');
      } else {
        setError('Unexpected error during registration');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Name<input value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} required /></label>
        <label>Role<select value={form.role} onChange={(e)=>setForm(f=>({...f,role:e.target.value}))}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select></label>
        <button disabled={loading}>{loading ? '...' : 'Create Account'}</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
