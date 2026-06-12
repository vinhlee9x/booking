import { createContext, useCallback, useContext, useEffect, useReducer } from 'react'
import * as authApi from '../api/auth'
import { registerUnauthorizedHandler } from '../api/client'
import type { AuthUser } from '../types'

type AuthStatus = 'loading' | 'authenticated' | 'guest'

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
}

type AuthAction =
  | { type: 'SET_USER'; user: AuthUser }
  | { type: 'SET_GUEST' }
  | { type: 'SET_LOADING' }

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, status: 'loading' }
    case 'SET_USER':
      return { user: action.user, status: 'authenticated' }
    case 'SET_GUEST':
      return { user: null, status: 'guest' }
  }
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: null, status: 'loading' })

  const setGuest = useCallback(() => dispatch({ type: 'SET_GUEST' }), [])

  useEffect(() => {
    registerUnauthorizedHandler(setGuest)
    authApi.fetchUser()
      .then((user) => dispatch({ type: 'SET_USER', user }))
      .catch(() => dispatch({ type: 'SET_GUEST' }))
  }, [setGuest])

  const login = useCallback(async (email: string, password: string) => {
    const user = await authApi.login(email, password)
    dispatch({ type: 'SET_USER', user })
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    dispatch({ type: 'SET_GUEST' })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, isAuthenticated: state.status === 'authenticated', login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
