import { useEffect, useState, type FormEvent } from 'react'
import { ZodError } from 'zod'
import { createPostSchema, type CreatePostFormData } from '../../schemas/post.schema'
import { ApiError } from '../../services/api'
import { createPost, getContentTypes } from '../../services/post.service'
import type { ContentType } from '../../types/post'
import styles from './CreatePostModal.module.css'

interface CreatePostModalProps {
  accessToken: string
  onClose: () => void
  onSuccess: () => void
}

export function CreatePostModal({ accessToken, onClose, onSuccess }: CreatePostModalProps) {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [form, setForm] = useState<CreatePostFormData>({
    title: '', description: '', contentTypeId: '', status: 'published'
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoadingTypes, setIsLoadingTypes] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadContentTypes = async () => {
      try {
        setContentTypes(await getContentTypes())
      } catch {
        setError('No fue posible cargar los tipos de contenido.')
      } finally {
        setIsLoadingTypes(false)
      }
    }

    void loadContentTypes()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
      const status = submitter?.dataset.status === 'draft' ? 'draft' : 'published'
      const input = createPostSchema.parse({ ...form, status })
      setIsSubmitting(true)
      await createPost(input, accessToken)
      onSuccess()
    } catch (submitError) {
      setError(getCreatePostError(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="create-post-title">
        <div className={styles.header}>
          <h2 id="create-post-title">Crear publicación</h2>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Cerrar formulario">×</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label htmlFor="post-title">Título</label>
          <input id="post-title" type="text" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />

          <label htmlFor="post-type">Tipo de contenido</label>
          <select id="post-type" value={form.contentTypeId} onChange={(event) => setForm({ ...form, contentTypeId: event.target.value })} disabled={isLoadingTypes} required>
            <option value="">Selecciona un tipo</option>
            {contentTypes.map((contentType) => <option key={contentType.id} value={contentType.id}>{contentType.name}</option>)}
          </select>

          <label htmlFor="post-description">Descripción</label>
          <textarea id="post-description" rows={6} maxLength={2000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />

          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" data-status="draft" disabled={isSubmitting || isLoadingTypes}>Guardar borrador</button>
            <button type="submit" data-status="published" disabled={isSubmitting || isLoadingTypes}>{isSubmitting ? 'Guardando...' : 'Publicar'}</button>
          </div>
        </form>

        {error && <p className={styles.error} role="alert">{error}</p>}
      </section>
    </div>
  )
}

function getCreatePostError(error: unknown): string {
  if (error instanceof ZodError) return error.issues[0]?.message ?? 'Revisa los datos de la publicación.'
  if (error instanceof ApiError) {
    if (error.status === 403) return 'No tienes permiso para crear esta publicación.'
    return error.message
  }
  return 'No fue posible crear la publicación.'
}
