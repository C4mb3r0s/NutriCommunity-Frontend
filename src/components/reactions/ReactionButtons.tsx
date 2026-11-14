import styles from './ReactionButtons.module.css'

interface ReactionButtonsProps {
  postId: string
  onReaction: (postId: string, type: 'like' | 'love' | 'amaze') => void
}

export function ReactionButtons({
  postId,
  onReaction
}: ReactionButtonsProps) {
  return (
    <div className={styles.group} aria-label="Reacciones">
      <button type="button" onClick={() => onReaction(postId, 'like')}>Like</button>
      <button type="button" onClick={() => onReaction(postId, 'love')}>Love</button>
      <button type="button" onClick={() => onReaction(postId, 'amaze')}>Amaze</button>
    </div>
  )
}
