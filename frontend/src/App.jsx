// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginImproved from './pages/LoginImproved.jsx';
import RegisterImproved from './pages/RegisterImproved.jsx';
import BoardImproved from './pages/BoardImproved.jsx';
import DashboardImproved from './pages/DashboardImproved.jsx';
import EmployeesImproved from './pages/EmployeesImproved.jsx';
import Layout from './components/Layout.jsx';
import { useAuth } from './hooks/useAuth.js';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to={token ? '/board' : '/login'} replace />} />
        <Route
          path="/board"
          element={
            <ProtectedRoute>
              <BoardImproved />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeesImproved />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/login" element={<LoginImproved />} />
      <Route path="/register" element={<RegisterImproved />} />
      <Route path="*" element={<p>404 Not Found</p>} />
    </Routes>
  );
}

