import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Todo } from '../types';
import TodoItem from './TodoItem'; // Import TodoItem

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);

    // First, check if the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User not authenticated for fetching todos:', userError?.message);
      setError('Please log in to view your todos.'); // More specific error for unauthenticated users
      setLoading(false);
      return;
    }

    // If authenticated, proceed to fetch todos
    const { data, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching todos:', fetchError.message);
      setError('Failed to load todos: ' + fetchError.message); // Include Supabase error message
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      setError('User not authenticated.');
      return;
    }

    const { data, error } = await supabase
      .from('todos')
      .insert({ task: newTask.trim(), user_id: user.data.user.id })
      .select();

    if (error) {
      console.error('Error adding todo:', error.message);
      setError('Failed to add todo.');
    } else if (data && data.length > 0) {
      setTodos([data[0], ...todos]);
      setNewTask('');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleTodoDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleTodoToggleComplete = (id: string, isComplete: boolean) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, is_complete: isComplete } : todo
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-background dark:bg-dark-background">
      <div className="w-full max-w-2xl bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-xl animate-slide-down">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text dark:text-dark-text flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Todo List
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-error text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-surface dark:focus:ring-offset-dark-surface"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            ออกจากระบบ
          </button>
        </div>

        <form onSubmit={addTodo} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="เพิ่ม Todo ใหม่..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow p-3 border border-border dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
          />
          <button
            type="submit"
            className="bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface dark:focus:ring-offset-dark-surface flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            เพิ่ม
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-4 text-text dark:text-dark-text text-lg">กำลังโหลด Todo...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-error py-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && todos.length === 0 && !error && (
          <div className="text-center text-textSecondary dark:text-dark-textSecondary py-8">
            <p className="text-lg">ยังไม่มี Todo ในรายการของคุณ</p>
            <p className="text-sm mt-2">ลองเพิ่ม Todo ใหม่ดูสิ!</p>
          </div>
        )}

        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleTodoDelete}
              onToggleComplete={handleTodoToggleComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
