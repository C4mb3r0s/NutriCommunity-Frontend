import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres').max(180),
  description: z.string().trim().max(2000).optional(),
  contentTypeId: z.uuid('Selecciona un tipo de contenido'),
  status: z.enum(['draft', 'published'])
})

export type CreatePostFormData = z.infer<typeof createPostSchema>
