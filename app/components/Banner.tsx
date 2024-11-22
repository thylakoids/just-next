'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/authContext'
import { fetchUserData, logoutUser } from '../utils/api'

export default function Banner() {
  const router = useRouter()
  const { state, dispatch } = useAuth()
  const dataFetched = useRef(false)

  useEffect(() => {
    async function getUserData() {
      if (!state.isAuthenticated || !state.user?.accessToken || dataFetched.current) return

      try {
        dataFetched.current = true
        dispatch({ type: 'SET_LOADING' })
        const userData = await fetchUserData(state.user.accessToken)
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: userData 
        })
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        dispatch({ type: 'LOGOUT' })
        router.push('/login')
      }
    }

    getUserData()
  }, []) // only run on mount

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await logoutUser(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
      router.push('/login')
    }
  }

  if (state.loading || !state.user?.name) {
    return null;
  }

  return (
    <div className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>Welcome, {state.user.name}!</span>
          <span className="px-2 py-1 bg-blue-700 rounded-full text-sm">
            {state.user.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
} 