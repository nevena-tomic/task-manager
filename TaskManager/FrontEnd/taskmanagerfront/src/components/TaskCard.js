import React from 'react';
import '../styles/TaskCard.css'; 

function TaskCard({ task }) {
  return (
    <div className="task-card" >
      <h4>{task.title}</h4>
      <p>Status: {task.status}</p>
      {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
    </div>
  );
}

export default TaskCard;
