import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <ThemeToggle />
    </div>
  );
}
