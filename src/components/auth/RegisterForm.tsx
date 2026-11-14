import { useState, type FormEvent } from 'react'
import { ZodError } from 'zod'
import { registerSchema, type RegisterFormData } from '../../schemas/auth.schema'
import { ApiError } from '../../services/api'
import { registerAdmin } from '../../services/auth.service'
import { LoginErrorModal } from './LoginErrorModal'
import { PasswordField } from './PasswordField'
import styles from './LoginForm.module.css'

interface RegisterFormProps {
  accessToken: string
  onSuccess: () => void
}

type RegisterFormState = RegisterFormData & { confirmPassword: string }

export function RegisterForm({ accessToken, onSuccess }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterFormState>({
    firstName: '', secondName: '', lastName: '', secondLastName: '',
    email: '', password: '', confirmPassword: ''
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof RegisterFormState, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    try {
      const { confirmPassword, ...registrationData } = form
      const input = registerSchema.parse(registrationData)

      if (input.password !== confirmPassword) {
        throw new Error('PASSWORDS_DO_NOT_MATCH')
      }

      setIsSubmitting(true)
      await registerAdmin(input, accessToken)
      onSuccess()
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form className={`${styles.form} ${styles.registerForm}`} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="firstName">Primer nombre</label>
          <input id="firstName" name="firstName" type="text" autoComplete="given-name" value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="secondName">Segundo nombre (opcional)</label>
          <input id="secondName" name="secondName" type="text" value={form.secondName ?? ''} onChange={(event) => updateField('secondName', event.target.value)} />
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName">Primer apellido</label>
          <input id="lastName" name="lastName" type="text" autoComplete="family-name" value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="secondLastName">Segundo apellido (opcional)</label>
          <input id="secondLastName" name="secondLastName" type="text" value={form.secondLastName ?? ''} onChange={(event) => updateField('secondLastName', event.target.value)} />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-email">Correo electrónico</label>
          <input id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-password">Contraseña</label>
          <PasswordField id="register-password" name="password" autoComplete="new-password" value={form.password} onChange={(password) => updateField('password', password)} ariaDescribedBy="password-requirements" />
          <small id="password-requirements">Mínimo 10 caracteres, una mayúscula, una minúscula, un número y un carácter especial.</small>
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <PasswordField id="confirmPassword" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={(password) => updateField('confirmPassword', password)} />
        </div>

        <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      {errorMessage && (
        <LoginErrorModal title="No se pudo crear la cuenta" message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
    </>
  )
}

function getRegisterErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === 'PASSWORDS_DO_NOT_MATCH') {
    return 'Las contraseñas no coinciden.'
  }

  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? 'Revisa los datos del formulario.'
  }

  if (error instanceof ApiError) {
    if (error.status === 409) return 'Ya existe una cuenta con ese correo electrónico.'
    if (error.status >= 500) return 'El servidor no pudo crear la cuenta. Intenta nuevamente más tarde.'
    return error.message
  }

  return 'No fue posible conectar con el servidor. Verifica tu conexión e intenta nuevamente.'
}
