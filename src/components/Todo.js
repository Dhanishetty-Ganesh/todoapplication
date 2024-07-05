import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const colors = ["#ADD8E6", "#FFB6C1", "#FFA500", "#90EE90", "#FFD700", "#DDA0DD"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  const backgroundColor = useMemo(() => getRandomColor(), []);

  return (
    <div className="Todo" style={{ backgroundColor }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
        className="todo-checkbox"
      />
      <p className={`${task.completed ? "completed" : "incompleted"}`}>
        {task.task}
      </p>
      <div>
        <FontAwesomeIcon
          className="edit-icon"
          icon={faPenToSquare}
          onClick={() => editTodo(task.id)}
        />
        <FontAwesomeIcon
          className="delete-icon"
          icon={faTrash}
          onClick={() => deleteTodo(task.id)}
        />
      </div>
    </div>
  );
};
