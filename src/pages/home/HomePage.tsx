import { useCallback, useEffect, useState } from 'react'
import { PostCard } from '../../components/posts/PostCard'
import { useAuth } from '../../hooks/useAuth'
import { getPosts, toggleReaction } from '../../services/post.service'
import type { Post, PostResponse } from '../../types/post'
import styles from './HomePage.module.css'

export function HomePage() {
  const { accessToken } = useAuth()
  const [result, setResult] = useState<PostResponse | null>(null)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const loadPosts = useCallback(async () => {
    try {
      setError(null)
      setResult(await getPosts(page))
    } catch {
      setError('No fue posible cargar las publicaciones')
    }
  }, [page])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  const handleReaction = async (
    postId: string,
    type: 'like' | 'love' | 'amaze'
  ) => {
    if (!accessToken) return

    try {
      await toggleReaction(postId, accessToken, type)
    } catch {
      setError('No fue posible registrar la reacción.')
    }
  }

  const handleComments = (postId: string) => {
    console.log(`Open comments for the post ${postId}`)
  }

  return (
    <main className={styles.page}>
      <header>
        <h1>Publicaciones</h1>
        <p>
          Descubre recetas y hábitos compartidos por la comunidad.
        </p>
      </header>

      {error && <p role="alert">{error}</p>}

      <section className={styles.grid} aria-label="Publicaciones">
        {result?.data.map((post: Post) => (
          <PostCard
            key={post.id}
            post={post}
            onReaction={handleReaction}
            onComments={handleComments}
          />
        ))}
      </section>

      <nav className={styles.pagination} aria-label="Paginación">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Página {page}</span>
        <button
          type="button"
          disabled={!result || page >= result.pagination.totalPages}
          onClick={() => setPage(page + 1)}>Siguiente</button>
      </nav>
    </main >
  )
}
