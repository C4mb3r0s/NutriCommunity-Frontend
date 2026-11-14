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
        <p>Inicia sesión para continuar con tu comunidad</p>

        <LoginForm onSuccess={() => navigate('/')} />

        <p>
          ¿Aún no tienes una cuenta?{' '}
          <button
            className={styles.link}
            type="button"
            onClick={() => navigate('/register')}
          >
            Regístrate
          </button>
        </p>
      </section>
    </main>
  )
}
