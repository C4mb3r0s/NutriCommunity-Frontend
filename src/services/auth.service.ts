import type {
  LoginFormData,
  RegisterFormData
} from '../schemas/auth.schema'
import type { LoginResponse, AuthUser } from '../types/auth'
import { apiRequest } from './api'

export function login(input: LoginFormData): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input)
  })
}

export function register(
  input: RegisterFormData
): Promise<{ user: AuthUser }> {
  return apiRequest<{ user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input)
  })
}

export function getCurrentUser(
  accessToken: string
): Promise<{ user: AuthUser }> {
  return apiRequest<{ user: AuthUser }>('/api/auth/me', {
    accessToken
  })
}

export function refreshAccessToken(): Promise<{ accessToken: string }> {
  const csrfToken = getCsrfCookie()

  return apiRequest<{ accessToken: string }>('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken
    }
  })
}

export function logout(accessToken: string): Promise<void> {
  const csrfToken = getCsrfCookie()

  return apiRequest<void>('/api/auth/logout', {
    method: 'POST',
    accessToken,
    headers: {
      'X-CSRF-Token': csrfToken
    }
  })
}

function getCsrfCookie(): string {
  const cookie = document.cookie
    .split('; ')
    .find((value) => value.startsWith('csrf_token='))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : ''
}
