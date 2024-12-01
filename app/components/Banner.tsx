'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/authContext'
import { fetchUserData, logoutUser } from '../utils/api'

export default function Banner() {
  const router = useRouter()
  const pathname = usePathname()
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
        // token expired
        console.error('Failed to fetch user data:', error)
        dispatch({ type: 'LOGOUT' })
        router.push('/login')
      }
    }

    getUserData()
  }, [state.isAuthenticated, state.user?.accessToken, dispatch, router])

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

  if (pathname === '/login') {
    return null
  }

  if (state.loading || !state.user?.name) {
    return null;
  }

  const isManager = state.user.role === 'manager'

  return (
    <div className={`${isManager ? 'bg-purple-600' : 'bg-blue-600'} text-white p-4`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div 
            className={`w-10 h-10 rounded-full ${isManager ? 'bg-purple-700' : 'bg-blue-700'} flex items-center justify-center font-semibold cursor-pointer transition-transform hover:scale-110`}
            title={state.user.name}
          >
            {state.user.name.charAt(0).toUpperCase()}
          </div>
          <span className={`px-2 py-1 rounded-full text-sm ${isManager ? 'bg-purple-700' : 'bg-blue-700'}`}>
            {state.user.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isManager 
              ? 'bg-purple-700 hover:bg-purple-800' 
              : 'bg-blue-700 hover:bg-blue-800'
          }`}
        >
          Logout
        </button>
      </div>
    </div>
  )
} 