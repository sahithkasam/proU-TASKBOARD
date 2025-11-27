// src/pages/LoginImproved.jsx
// Modern login with react-hook-form and useAuth hook
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import apiClient from '../lib/axios';

export default function LoginImproved() {
  const { login, googleLogin, isLoggingIn, loginError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data);
  };

  // Google Identity Services initialization
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

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
        callback: handleGoogleCredential,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', type: 'standard' }
      );
    };

    const handleGoogleCredential = async (response) => {
      try {
        googleLogin(response.credential);
      } catch (err) {
        console.error('Google sign-in failed', err);
      }
    };

    loadScript();
  }, [googleLogin]);

  const getErrorMessage = () => {
    if (!loginError) return null;
    if (loginError.response) {
      const { status, data } = loginError.response;
      if (status === 400) return data.message || 'Invalid input';
      if (status === 401) return 'Invalid email or password';
      return data.message || `Login failed (status ${status})`;
    }
    if (loginError.request) return 'Network error: backend unreachable';
    return 'Unexpected error during login';
  };

  return (
    <div className="auth-page">
      <div className="auth-container-modern">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="brand-content">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="brand-title">ProU TaskBoard</h1>
            <p className="brand-subtitle">Manage your projects efficiently</p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Beautiful & Intuitive</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Fast & Responsive</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to continue to your workspace</p>
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#6366f1'
              }}>
                💡 <strong>Tip:</strong> Register as "Administrator" to manage employees and tasks
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form-modern">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format',
                    },
                  })}
                />
                {errors.email && (
                  <span className="error-msg">
                    <span className="error-icon">⚠️</span>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                {errors.password && (
                  <span className="error-msg">
                    <span className="error-icon">⚠️</span>
                    {errors.password.message}
                  </span>
                )}
              </div>

              {getErrorMessage() && (
                <div className="alert-error">
                  <span className="alert-icon">❌</span>
                  <span>{getErrorMessage()}</span>
                </div>
              )}

              <button type="submit" disabled={isLoggingIn} className="btn-primary-large">
                {isLoggingIn ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p className="footer-text">
                Don't have an account?{' '}
                <Link to="/register" className="footer-link">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
