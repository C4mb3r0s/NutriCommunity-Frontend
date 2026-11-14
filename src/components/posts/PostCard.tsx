import type { Post } from '../../types/post'
import { CommentButton } from '../comments/CommentButtons'
import { ReactionButtons } from '../reactions/ReactionButtons'
import styles from './PostCard.module.css'

interface PostCardProps {
  post: Post
  onReaction: (postId: string, type: 'like' | 'love' | 'amaze') => void
  onComments: (postId: string) => void
}

export function PostCard({ post, onReaction, onComments }: PostCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.type}>{post.contentTypeId}</span>
      <h2>{post.title}</h2>
      {post.description && <p>
        {post.description}
      </p>}

      <div className={styles.actions}>
        <ReactionButtons
          postId={post.id}
          onReaction={onReaction}
        />

        <CommentButton onClick={() => onComments(post.id)} />
      </div>
    </article>
  )
}
