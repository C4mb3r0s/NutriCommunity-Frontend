import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { AuthContext } from './auth-context'
import type { LoginFormData } from '../schemas/auth.schema'
import type { AuthUser } from '../types/auth'
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken
} from '../services/auth.service'
import {
  clearAuthSession,
  configureAuthSession,
  setAccessToken as setSessionAccessToken
} from '../services/auth-session'

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
    setSessionAccessToken(result.accessToken)
    setAccessToken(result.accessToken)
    setUser(result.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await logoutRequest(accessToken)
      }
    } finally {
      clearAuthSession()
      setAccessToken(null)
      setUser(null)
    }
  }, [accessToken])

  useEffect(() => {
    configureAuthSession(
      async () => (await refreshAccessToken()).accessToken,
      () => {
        clearAuthSession()
        setAccessToken(null)
        setUser(null)
      }
    )

    if (!initializationRef.current) {
      initializationRef.current = (async () => {
        try {
          const { accessToken: refreshedAccessToken } = await refreshAccessToken()
          const { user: currentUser } = await getCurrentUser(refreshedAccessToken)

          setSessionAccessToken(refreshedAccessToken)
          setAccessToken(refreshedAccessToken)
          setUser(currentUser)
        } catch {
          clearAuthSession()
          setSessionAccessToken(null)
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
