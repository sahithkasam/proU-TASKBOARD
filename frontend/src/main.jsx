// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.jsx';
import { AuthProvider } from './state/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import { queryClient } from './lib/queryClient.js';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastProvider>
            <AuthProvider>
              <App />
              <ToastContainer />
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
