import React from 'react';
import { Todo } from '../types';
import { supabase } from '../lib/supabase';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, isComplete: boolean) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggleComplete }) => {
  const handleToggle = async () => {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !todo.is_complete })
      .eq('id', todo.id);

    if (!error) {
      onToggleComplete(todo.id, !todo.is_complete);
    } else {
      console.error('Error toggling todo:', error.message);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id);

    if (!error) {
      onDelete(todo.id);
    } else {
      console.error('Error deleting todo:', error.message);
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-xl shadow-md mb-3 transition-all duration-300 ease-in-out
        bg-surface dark:bg-dark-surface
        ${todo.is_complete ? 'opacity-60 line-through text-textSecondary dark:text-dark-textSecondary' : 'text-text dark:text-dark-text'}
      `}
    >
      <div className="flex items-center flex-grow">
        <input
          type="checkbox"
          checked={todo.is_complete}
          onChange={handleToggle}
          className="form-checkbox h-5 w-5 text-primary rounded border-border dark:border-dark-border bg-background dark:bg-dark-background focus:ring-primary cursor-pointer"
        />
        <span className="ml-4 text-lg break-words flex-grow">
          {todo.task}
        </span>
      </div>
      <button
        onClick={handleDelete}
        className="ml-4 p-2 rounded-full text-error hover:bg-error hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-surface dark:focus:ring-offset-dark-surface"
        aria-label="Delete todo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;
