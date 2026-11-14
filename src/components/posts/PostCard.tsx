import { useState } from 'react'
import type { Post } from '../../types/post'
import type { AuthUser } from '../../types/auth'
import { CommentButton } from '../comments/CommentButtons'
import { CommentsPanel } from '../comments/CommentsPanel'
import { ReactionButtons } from '../reactions/ReactionButtons'
import type { ReactionResponse, ReactionType } from '../../types/reaction'
import styles from './PostCard.module.css'

interface PostCardProps {
  post: Post
  currentUser: AuthUser
  onReaction: (postId: string, type: ReactionType) => Promise<ReactionResponse>
  onDelete: (postId: string) => void
}

export function PostCard({ post, currentUser, onReaction, onDelete }: PostCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const canDelete = currentUser.id === post.authorId || currentUser.roles.includes('admin')

  const handleDelete = () => {
    if (!window.confirm('¿Deseas eliminar esta publicación?')) return
    setIsMenuOpen(false)
    onDelete(post.id)
  }

  return (
    <article className={styles.card}>
      {canDelete && (
        <div className={styles.menuContainer}>
          <button
            className={styles.menuButton}
            type="button"
            aria-label="Opciones de publicación"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            ⋯
          </button>
          {isMenuOpen && (
            <div className={styles.menu}>
              <button type="button" onClick={handleDelete}>
                Eliminar publicación
              </button>
            </div>
          )}
        </div>
      )}
      <span className={styles.type}>{post.contentTypeName}</span>
      <p className={styles.author}>{post.authorName}</p>
      <h2>{post.title}</h2>
      {post.content && <p>
        {post.content}
      </p>}

      <div className={styles.actions}>
        <ReactionButtons
          postId={post.id}
          onReaction={onReaction}
        />

        <CommentButton onClick={() => setIsCommentsOpen((open) => !open)} />
      </div>

      {isCommentsOpen && <CommentsPanel postId={post.id} />}
    </article>
  )
}
