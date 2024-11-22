'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import { fetchAllUsers } from '../utils/api'
import BannerSkeleton from '../components/BannerSkeleton'

interface User {
  name: string;
  role: string;
}

export default function DashboardPage() {
  const { state } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getUsers() {
      if (state.user?.role === 'manager' && state.user?.accessToken) {
        try {
          setLoading(true)
          const data = await fetchAllUsers(state.user.accessToken)
          setUsers(data)
        } catch (error) {
          console.error('Failed to fetch users:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    getUsers()
  }, [state.user?.role, state.user?.accessToken])

  // Show loading skeleton while checking auth or fetching users
  if (!state.isAuthenticated || state.loading || !state.user?.name) {
    return (
      <>
        <BannerSkeleton />
        {/* Content Skeleton */}
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

  if (!state.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              User Management
            </h2>
            
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
                    <span 
                      className={`px-2 py-1 rounded-full text-sm ${
                        user.role === 'manager' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 