import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getUsers, updateUserStatus } from '../../services/admin.service'
import { RegisterUserModal } from '../../components/admin/RegisterUserModal'
import type { AdminUser } from '../../types/user'
import styles from './AdminDashboardPage.module.css'

export function AdminDashboardPage() {
  const { accessToken } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

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

  const handleDelete = (userId: string) => {
    if (!window.confirm('¿Deseas eliminar este usuario?')) return

    void handleStatusChange(userId, 'deleted')
  }

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <h1>Dashboard administrativo</h1>
        <button
          className={styles.registerButton}
          type="button"
          onClick={() => setIsRegisterOpen(true)}
        >
          Registrar usuario
        </button>
      </div>

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
          {users.map((user) => {
            const isProtected = user.roles === undefined || user.roles.includes('admin')

            return (
            <tr key={user.id}>
              <td>{user.firstName} {user.secondName} {user.lastName} {user.secondLastName}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                {isProtected
                  ? <span className={styles.protectedLabel}>Administrador protegido</span>
                  : <>
                    <button
                      className={styles.activateButton}
                      type="button"
                      onClick={() => void handleStatusChange(user.id, 'active')}>Activar</button>
                    <button
                      className={styles.suspendButton}
                      type="button"
                      onClick={() => void handleStatusChange(user.id, 'suspended')}>Suspender</button>
                    <button
                      className={styles.deleteButton}
                      type="button"
                      onClick={() => handleDelete(user.id)}>Eliminar</button>
                  </>}
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>

      {isRegisterOpen && accessToken && (
        <RegisterUserModal
          accessToken={accessToken}
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={() => {
            setIsRegisterOpen(false)
            void loadUsers()
          }}
        />
      )}
    </main>
  )
}
