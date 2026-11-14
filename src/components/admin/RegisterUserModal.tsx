import { RegisterForm } from '../auth/RegisterForm'
import styles from './RegisterUserModal.module.css'

interface RegisterUserModalProps {
  accessToken: string
  onClose: () => void
  onSuccess: () => void
}

export function RegisterUserModal({
  accessToken,
  onClose,
  onSuccess
}: RegisterUserModalProps) {
  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-user-title"
      >
        <div className={styles.header}>
          <h2 id="register-user-title">Registrar usuario</h2>
          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Cerrar registro"
          >
            ×
          </button>
        </div>

        <RegisterForm accessToken={accessToken} onSuccess={onSuccess} />
      </section>
    </div>
  )
}
