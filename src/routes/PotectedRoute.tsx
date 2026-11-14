import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <main aria-live="polite">Verificando sesión...</main>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
