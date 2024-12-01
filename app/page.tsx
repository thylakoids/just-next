'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from './context/authContext'
import { fetchAllUsers, addMember, delMember } from './utils/api'
import BannerSkeleton from './components/BannerSkeleton'
import TodoPanel from './components/TodoPanel'

interface User {
  name: string;
  role: string;
}

export default function DashboardPage() {
  const { state } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newMember, setNewMember] = useState({ name: '', password: '' })
  const [error, setError] = useState('')

  const fetchUsers = useCallback(async () => {
    if (state.user?.role === 'manager' && state.user?.accessToken) {
      try {
        setLoading(true)
        const data = await fetchAllUsers(state.user.accessToken)
        setUsers(data)
      } catch (error) {
        setError('Failed to fetch users: ' + error)
      } finally {
        setLoading(false)
      }
    }
  }, [state.user?.role, state.user?.accessToken])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!state.user?.accessToken) return

    try {
      setLoading(true)
      setError('')
      await addMember(state.user.accessToken, newMember)
      setShowAddModal(false)
      setNewMember({ name: '', password: '' })
      // Refetch users to update the list
      await fetchUsers()
    } catch (error) {
      setError('Failed to add member')
      console.error('Add member error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = async () => {
    if (!state.user?.accessToken || !selectedUser) return

    try {
      setLoading(true)
      setError('')
      await delMember(state.user.accessToken, { name: selectedUser.name })
      setShowDeleteModal(false)
      setSelectedUser(null)
      // Refetch users to update the list
      await fetchUsers()
    } catch (error) {
      setError('Failed to delete member')
      console.error('Delete member error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show loading skeleton while checking auth or fetching users
  if (!state.isAuthenticated || state.loading || !state.user?.name) {
    return (
      <>
        <BannerSkeleton />
        <div className="min-h-screen bg-gray-50">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!state.isAuthenticated) return null

  // If not a manager, show welcome message and todo section
  if (state.user.role !== 'manager') {
    return (
      <div className="min-h-screen bg-blue-50">
        <div className="p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="relative">
                <div className="absolute -left-2 -top-2 w-12 h-12 bg-blue-100 rounded-lg transform -rotate-6"></div>
                <div className="relative">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Welcome to the Dashboard
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    You are logged in as a team member
                  </p>
                </div>
              </div>
            </div>

            {/* Todo Section */}
            <TodoPanel />
          </div>
        </div>
      </div>
    )
  }

  // Manager view with user management panel and todo section
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Todo Section for Manager */}
          <TodoPanel />

          {/* User Management Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <div className="absolute -left-2 -top-2 w-12 h-12 bg-purple-100 rounded-lg transform -rotate-6"></div>
                <div className="relative">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    User Management
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your team members and their roles
                  </p>
                </div>
              </div>
              {state.user.role === 'manager' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Member
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div 
                    key={user.name}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span 
                        className={`px-2 py-1 rounded-full text-sm ${
                          user.role === 'manager' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role}
                      </span>
                      {state.user?.role === 'manager' && user.role !== 'manager' && (
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteModal(true)
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete member"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    'Add Member'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Member Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Delete Member</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUser(null)
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedUser.name}</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUser(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMember}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 