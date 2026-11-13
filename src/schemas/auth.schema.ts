import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email().trim(),
  passport: z.string().min(10).max(128)
})

export type LoginFormData = z.infer<typeof loginSchema>
