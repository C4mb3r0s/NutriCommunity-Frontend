import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AdminRoute() {
  const { user } = useAuth()

  return user?.roles.includes('admin')
    ? <Outlet />
    : <Navigate to="/" replace />
}
