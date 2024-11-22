'use client'

import React, { createContext, useContext, useReducer } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  user: string | null;
  role: string | null;
  token: string | null;
};

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { name: string; role: string; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_ERROR' };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  token: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        user: action.payload.name,
        role: action.payload.role,
        token: action.payload.token,
      };
    case 'LOGOUT':
    case 'AUTH_ERROR':
      return initialState;
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 