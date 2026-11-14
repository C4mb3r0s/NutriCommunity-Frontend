import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import type { LoginFormData } from '../schemas/auth.schema'
import { login as loginRequest, logout as logoutRequest } from '../services/auth.service'
import type { AuthUser } from '../types/auth'

interface AuthContextValue {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  login: (input: LoginFormData) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = useCallback(async (input: LoginFormData) => {
    const result = await loginRequest(input)
    setAccessToken(result.accessToken)
    setUser(result.user)
  }, [])

  const logout = useCallback(async () => {
    if (accessToken) {
      await logoutRequest(accessToken)
    }

    setAccessToken(null)
    setUser(null)
  }, [accessToken])

  const value = useMemo(() => ({
    accessToken,
    user,
    isAuthenticated: Boolean(accessToken && user),
    login,
    logout

  }), [accessToken, user, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
