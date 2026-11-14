import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import type { LoginFormData } from '../schemas/auth.schema'
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken
} from '../services/auth.service'
import type { AuthUser } from '../types/auth'

interface AuthContextValue {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isInitializing: boolean
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
  const [isInitializing, setIsInitializing] = useState(true)
  const initializationRef = useRef<Promise<void> | null>(null)

  const login = useCallback(async (input: LoginFormData) => {
    const result = await loginRequest(input)
    setAccessToken(result.accessToken)
    setUser(result.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await logoutRequest(accessToken)
      }
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [accessToken])

  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = (async () => {
        try {
          const { accessToken: refreshedAccessToken } = await refreshAccessToken()
          const { user: currentUser } = await getCurrentUser(refreshedAccessToken)

          setAccessToken(refreshedAccessToken)
          setUser(currentUser)
        } catch {
          setAccessToken(null)
          setUser(null)
        } finally {
          setIsInitializing(false)
        }
      })()
    }
  }, [])

  const value = useMemo(() => ({
    accessToken,
    user,
    isAuthenticated: Boolean(accessToken && user),
    isInitializing,
    login,
    logout

  }), [accessToken, user, isInitializing, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
