import styles from './LoginErrorModal.module.css'

interface LoginErrorModalProps {
  message: string
  onClose: () => void
}

export function LoginErrorModal({
  message,
  onClose
}: LoginErrorModalProps) {
  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="login-error-title"
      >
        <h2 id="login-error-title">no se pudo iniciar sesión</h2>
        <p>{message}</p>
        <button type="button" onClick={onClose}>
          Cerrar
        </button>
      </section>
    </div>
  )
}

