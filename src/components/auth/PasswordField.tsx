import { useState } from 'react'
import styles from './LoginForm.module.css'

interface PasswordFieldProps {
  id: string
  name: string
  value: string
  autoComplete: string
  onChange: (value: string) => void
  ariaDescribedBy?: string
}

export function PasswordField({
  id,
  name,
  value,
  autoComplete,
  onChange,
  ariaDescribedBy
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={styles.passwordWrapper}>
      <input
        id={id}
        name={name}
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={ariaDescribedBy}
        required
      />
      <button
        className={styles.passwordToggle}
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        title={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isVisible
            ? <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>
            : <><path d="m3 3 18 18" /><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.2 4.2M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7a10.6 10.6 0 0 0 4.1-.8" /></>}
        </svg>
      </button>
    </div>
  )
}
