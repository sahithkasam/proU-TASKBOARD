import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const token = localStorage.getItem('token');

  return (
    <header className="app-header">
      <h1>ProU TaskBoard</h1>
      <nav>
        {token && (
          <>
            <NavLink to="/board">Board</NavLink>
            <NavLink to="/employees">Employees</NavLink>
          </>
        )}
        {!token && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
      {currentUser && (
        <div className="user-info">
          <span>{currentUser.name}</span>
          <span className="user-role">{currentUser.role}</span>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </header>
  );
}
