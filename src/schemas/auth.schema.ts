import { z } from 'zod'

export const passwordSchema = z.string()
  .min(10, 'La contraseña debe tener al menos 10 caracteres')
  .max(128, 'La contraseña no puede superar los 128 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[1-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-a0-9\s]/, 'Debe contener al menos un caracter especial')

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(10).max(128)
})

export const registerSchema = z.object({
  firstName: z.string()
    .trim()
    .min(2, 'El nombre de tener al menos 2 caracteres')
    .max(80),

  secondName: z.string()
    .trim()
    .max(80)
    .nullish(),

  lastName: z.string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(80),

  secondLastName: z.string()
    .trim()
    .max(80)
    .nullish(),

  email: z.email()
    .trim()
    .max(255),

  password: passwordSchema
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
