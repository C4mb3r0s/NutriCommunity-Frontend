import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../../components/auth/LoginForm'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="login-title">
        <div className={styles.brand}>
          <span className={styles.logo}>NC</span>
          <span>NutriCommunity</span>
        </div>

        <h1>Bienvenido</h1>
        <p>Inicia sesión para continuas con tu comunidad</p>

        <LoginForm onSuccess={() => navigate('/')} />
      </section>
    </main>
  )
}
