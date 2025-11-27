// src/pages/RegisterImproved.jsx
// Modern register with react-hook-form and useAuth hook
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterImproved() {
  const { register: registerUser, isRegistering, registerError } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data;
    registerUser(userData);
  };

  const getErrorMessage = () => {
    if (!registerError) return null;
    if (registerError.response) {
      const { status, data } = registerError.response;
      if (status === 409) return 'Email already registered. Try logging in.';
      if (status === 400) return data.message || 'Invalid input';
      return data.message || `Registration failed (status ${status})`;
    }
    if (registerError.request) return 'Network error: backend unreachable';
    return 'Unexpected error during registration';
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
            <p className="brand-subtitle">Start managing your projects today</p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>Get Started in Seconds</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Collaborate with Team</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track Progress Easily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join us and boost your productivity</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form-modern">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
                {errors.name && (
                  <span className="error-msg">
                    <span className="error-icon">⚠️</span>
                    {errors.name.message}
                  </span>
                )}
              </div>

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
                  placeholder="Create a password (min 6 characters)"
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

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="label-icon">🔑</span>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <span className="error-msg">
                    <span className="error-icon">⚠️</span>
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              {getErrorMessage() && (
                <div className="alert-error">
                  <span className="alert-icon">❌</span>
                  <span>{getErrorMessage()}</span>
                </div>
              )}

              <button type="submit" disabled={isRegistering} className="btn-primary-large">
                {isRegistering ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p className="footer-text">
                Already have an account?{' '}
                <Link to="/login" className="footer-link">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
