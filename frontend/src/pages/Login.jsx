// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { login } from '../api/auth.js';
import axios from '../api/axios.js';
import { useAuth } from '../state/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = await login(form);
      doLogin(data);
      navigate('/board');
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) setError(data.message || 'Invalid input');
        else if (status === 401) setError('Invalid email or password');
        else setError(data.message || `Login failed (status ${status})`);
      } else if (err.request) {
        setError('Network error: backend unreachable');
      } else {
        setError('Unexpected error during login');
      }
    } finally {
      setLoading(false);
    }
  }

  // Google Identity Services initialization
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return; // Skip if not configured
    const loadScript = () => {
      if (document.getElementById('google-identity-script')) return initGoogle();
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-identity-script';
      script.onload = initGoogle;
      document.body.appendChild(script);
    };
    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', type: 'standard' }
      );
    };
    const handleGoogleCredential = async (response) => {
      try {
        setError(null);
        const idToken = response.credential;
        const res = await axios.post('/auth/google', { idToken });
        doLogin(res.data);
        navigate('/board');
      } catch (err) {
        console.error('Google sign-in failed', err);
        setError('Google sign-in failed');
      }
    };
    loadScript();
  }, [doLogin, navigate]);

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email<input type="email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} required /></label>
        <button disabled={loading}>{loading ? '...' : 'Login'}</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
      <div style={{ marginTop: '1rem' }}>
        <div id="googleSignInDiv" />
      </div>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
