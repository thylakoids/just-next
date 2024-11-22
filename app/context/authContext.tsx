'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { AuthState, AuthAction } from '../types/auth'

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null
})

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: { ...state.user, ...action.payload },
        loading: false
      }
    case 'LOGOUT':
      localStorage.removeItem('accessToken') // Clear token on logout
      localStorage.removeItem('refreshToken') // Clear refresh token on logout
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for token on initial load
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          accessToken,
          name: '', // Add required User properties
          role: '',
          refreshToken: ''
        } 
      })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}