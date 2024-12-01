'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AuthState, AuthAction } from '../types/auth'

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
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
    case 'INIT_AUTH':
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const router = useRouter()

  useEffect(() => {
    const initAuth = () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            accessToken,
            name: '',
            role: '',
            refreshToken: localStorage.getItem('refreshToken') || ''
          } 
        })
      } else {
        dispatch({ type: 'INIT_AUTH' })
        router.push('/login')
      }
    }

    initAuth()
  }, [router])

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