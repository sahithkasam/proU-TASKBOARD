// src/components/Column.jsx
// Generic column wrapper for future extension (currently Board uses Droppable directly).
import React from 'react';

export default function Column({ title, children }) {
  return (
    <div className="board-column">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
