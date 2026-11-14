import { useState, type FormEvent } from 'react'
import { ZodError } from 'zod'
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema'
import { ApiError } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { LoginErrorModal } from './LoginErrorModal'
import styles from './LoginForm.module.css'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [form, setForm] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    try {
      const input = loginSchema.parse(form)
      setIsSubmitting(true)
      await login(input)
      onSuccess()
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      {errorMessage && (
        <LoginErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </>
  )
}

function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return 'Revisa el correo y la contraseña. La contraseña es obligatoria y no puede superar los 128 caracteres.'
  }

  if (error instanceof ApiError) {
    if (error.status === 401) {
      return 'El correo o la contraseña no coinciden.'
    }

    if (error.status >= 500) {
      return 'El servidor no pudo procesar la solicitud. Intenta nuevamente más tarde.'
    }

    return error.message
  }

  return 'No fue posible conectar con el servidor. Verifica tu conexión e intenta nuevamente.'
}
