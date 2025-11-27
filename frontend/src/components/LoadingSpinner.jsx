// src/components/LoadingSpinner.jsx
// Reusable loading component
import React from 'react';

export default function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px',
  };

  const spinnerStyle = {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: sizeMap[size],
    height: sizeMap[size],
    animation: 'spin 1s linear infinite',
  };

  const containerStyle = fullScreen
    ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }
    : {
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
      };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
