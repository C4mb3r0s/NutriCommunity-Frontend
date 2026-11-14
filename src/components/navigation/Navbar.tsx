import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './Navbar.module.css'

export function Navbar () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const fullName = [
    user.firstName,
    user.secondName,
    user.lastName,
    user.secondLastName
  ].filter(Boolean).join(' ')

  const handleLogout = async () => {
    setIsOpen(false)
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className={styles.navbar}>
      <Link className={styles.brand} to="/">
        <span className={styles.logo}>NC</span>
        <span>NutriCommunity</span>
      </Link>

      <div className={styles.userArea}>
        <button
          className={styles.userButton}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {user.firstName} {user.lastName}
        </button>

        {isOpen && (
          <div className={styles.menu}>
            <strong>{fullName}</strong>
            <span>{user.email}</span>
            <span>Rol: {user.roles.join(', ')}</span>
            {user.roles.includes('admin') && (
              <Link
                className={styles.menuLink}
                to="/admin"
                onClick={() => setIsOpen(false)}
              >
                Dashboard administrativo
              </Link>
            )}
            <button type="button" onClick={() => void handleLogout()}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
