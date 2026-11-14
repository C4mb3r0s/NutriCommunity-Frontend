import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../../components/auth/RegisterForm'
import styles from './LoginPage.module.css'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <section className={`${styles.card} ${styles.registerCard}`} aria-labelledby="register-title">
        <div className={styles.brand}>
          <span className={styles.logo}>NC</span>
          <span>NutriCommunity</span>
        </div>
        <h1 id="register-title">Crear cuenta</h1>
        <p>Regístrate para participar en la comunidad</p>
        <RegisterForm onSuccess={() => navigate('/login')} />
        <p>
          ¿Ya tienes una cuenta?{' '}
          <button className={styles.link} type="button" onClick={() => navigate('/login')}>
            Inicia sesión
          </button>
        </p>
      </section>
    </main>
  )
}
