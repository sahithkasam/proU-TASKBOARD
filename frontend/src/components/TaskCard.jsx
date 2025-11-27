// src/components/TaskCard.jsx
// (Optional extraction) Not yet used; Board currently renders inline. Provided for future reuse.
import React from 'react';

export default function TaskCard({ task, dragProvided }) {
  return (
    <div
      className={`task-card priority-${task.priority}`}
      ref={dragProvided.innerRef}
      {...dragProvided.draggableProps}
      {...dragProvided.dragHandleProps}
    >
      <strong>{task.title}</strong>
      {task.description && <p>{task.description}</p>}
    </div>
  );
}
