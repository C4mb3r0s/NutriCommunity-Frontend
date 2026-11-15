import { createContext } from 'react'
import type { LoginFormData } from '../schemas/auth.schema'
import type { AuthUser } from '../types/auth'

export interface AuthContextValue {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (input: LoginFormData) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
