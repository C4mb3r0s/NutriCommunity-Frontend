import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getUsers, updateUserStatus } from '../../services/admin.service'
import type { AdminUser } from '../../types/user'
import styles from './AdminDashboardPage.module.css'

export function AdminDashboardPage() {
  const { accessToken } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    if (!accessToken) return

    try {
      const result = await getUsers(accessToken)
      setUsers(result.data)
    } catch {
      setError('No fue posible cargar los usuarios.')
    }
  }, [accessToken])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  const handleStatusChange = async (
    userId: string,
    status: 'active' | 'suspended' | 'deleted'
  ) => {
    if (!accessToken) return

    try {
      await updateUserStatus(accessToken, userId, status)
      await loadUsers()
    } catch {
      setError('No fue posible actualizar el estado del usuario.')
    }
  }

  return (
    <main className={styles.page}>
      <h1>Dashboard administrativo</h1>

      {error && <p role="alert">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName} {user.secondName} {user.lastName} {user.secondLastName}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button
                  type="button"
                  onClick={() => void handleStatusChange(user.id, 'active')}>Activar</button>
                <button
                  type="button"
                  onClick={() => void handleStatusChange(user.id, 'suspended')}>Suspender</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </main>
  )
}
