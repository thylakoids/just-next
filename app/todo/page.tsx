'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/authContext'
import { fetchTodos, addTodo, toggleTodo, deleteTodo } from '../utils/api'
import BannerSkeleton from '../components/BannerSkeleton'
import TodoItem from '../components/TodoItem'

interface Todo {
  id: number;
  username: string;
  title: string;
  completed: boolean;
}

export default function TodoPage() {
  const { state } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadTodos = async () => {
    if (!state.user?.accessToken) return
    
    try {
      setLoading(true)
      const data = await fetchTodos(state.user.accessToken)
      setTodos(data)
    } catch (error) {
      setError('Failed to load todos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [state.user?.accessToken])

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!state.user?.accessToken || !newTodo.trim()) return

    try {
      setLoading(true)
      await addTodo(state.user.accessToken, { text: newTodo.trim() })
      setNewTodo('')
      await loadTodos()
    } catch (error) {
      setError('Failed to add todo')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTodo = async (todoId: string, currentCompleted: boolean) => {
    if (!state.user?.accessToken) return

    try {
      setLoading(true)
      await toggleTodo(state.user.accessToken, todoId, !currentCompleted)
      await loadTodos()
    } catch (error) {
      setError('Failed to toggle todo')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTodo = async (todoId: string) => {
    if (!state.user?.accessToken) return

    try {
      setLoading(true)
      await deleteTodo(state.user.accessToken, todoId)
      await loadTodos()
    } catch (error) {
      setError('Failed to delete todo')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!state.isAuthenticated || state.loading || !state.user?.name) {
    return <BannerSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="relative mb-6">
              <div className="absolute -left-2 -top-2 w-12 h-12 bg-green-100 rounded-lg transform -rotate-6"></div>
              <div className="relative">
                <h2 className="text-2xl font-semibold text-gray-900">Todo List</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your tasks</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAddTodo} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new todo..."
                  className="flex-1 px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !newTodo.trim()}
                  className="px-2 py-1 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  title={todo.title}
                  completed={todo.completed}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 