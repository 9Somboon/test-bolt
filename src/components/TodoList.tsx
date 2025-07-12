import React from 'react'
import TodoItem from './TodoItem'
import { ListTodo } from 'lucide-react'

interface Todo {
  id: string
  task: string
  is_complete: boolean
  created_at: string
}

interface TodoListProps {
  todos: Todo[]
  onUpdate: (id: string, is_complete: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
  loading: boolean
  error: string | null
}

const TodoList: React.FC<TodoListProps> = ({ todos, onUpdate, onDelete, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-xl shadow-lg border border-border">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-textSecondary text-lg">กำลังโหลด Todo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-xl shadow-lg border border-border text-error">
        <p className="text-xl font-semibold mb-2">เกิดข้อผิดพลาด:</p>
        <p className="text-center">{error}</p>
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-xl shadow-lg border border-border">
        <ListTodo className="w-16 h-16 text-textSecondary mb-4 opacity-70" />
        <p className="text-textSecondary text-xl font-medium">ยังไม่มี Todo ในรายการ</p>
        <p className="text-textSecondary text-md mt-2">ลองเพิ่ม Todo ใหม่ดูสิ!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default TodoList
