import React, { useState } from 'react'
import { Plus } from 'lucide-react'

interface TodoFormProps {
  onAdd: (task: string) => Promise<void>
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newTask.trim()) return

    setLoading(true)
    try {
      await onAdd(newTask)
      setNewTask('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4 p-6 bg-surface rounded-xl shadow-inner border border-border mb-8">
      <input
        type="text"
        placeholder="เพิ่ม Todo ใหม่..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="flex-grow px-5 py-3 bg-gray-800 border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 text-lg"
        disabled={loading}
      />
      <button
        type="submit"
        className="flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
        disabled={loading}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" /> เพิ่ม
          </>
        )}
      </button>
    </form>
  )
}

export default TodoForm
