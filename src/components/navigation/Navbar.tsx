import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import styles from './Navbar.module.css'

export const Navbar () {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const fullName = [
    user.firstName,
    user.secondLastName,
    user.lastName,
    user.secondLastName
  ].filter(Boolean).join(' ')

  return (
    <header className={styles.navbar}>
      <a className={styles.brand} href="/">
        <span className={styles.logo}>NC</span>
        <span>NutriCommunity</span>
      </a>

      <div>
        <button
          className={styles.userArea}
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
            <button type="button" onClick={() => void logout()}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
