import { useCallback, useEffect, useState } from 'react'
import { getComments } from '../../services/comment.service'
import type { Comment } from '../../types/comment'
import styles from './CommentsPanel.module.css'

interface CommentsPanelProps {
  postId: string
}

export function CommentsPanel({ postId }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadComments = useCallback(async (nextPage: number) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await getComments(postId, nextPage)
      setComments((currentComments) => nextPage === 1
        ? response.data
        : [...currentComments, ...response.data])
      setPage(nextPage)
      setHasMore(response.pagination.hasMore)
    } catch {
      setError('No fue posible cargar los comentarios.')
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    // The effect loads external data when the comments panel is opened.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadComments(1)
  }, [loadComments])

  return (
    <section className={styles.panel} aria-label="Comentarios de la publicación">
      <h3>Comentarios</h3>

      {error && <p className={styles.error} role="alert">{error}</p>}

      {!isLoading && !error && comments.length === 0 && (
        <p className={styles.empty}>Todavía no hay comentarios.</p>
      )}

      <div className={styles.list}>
        {comments.map((comment) => (
          <article className={styles.comment} key={comment.id}>
            <strong>{comment.authorName}</strong>
            <p>{comment.body}</p>
          </article>
        ))}
      </div>

      {isLoading && <p className={styles.loading}>Cargando comentarios...</p>}

      {hasMore && !isLoading && (
        <button
          className={styles.moreButton}
          type="button"
          onClick={() => void loadComments(page + 1)}
        >
          Ver más
        </button>
      )}
    </section>
  )
}
