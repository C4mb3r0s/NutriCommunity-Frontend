import { useState } from 'react'
import type { ReactionResponse, ReactionType } from '../../types/reaction'
import styles from './ReactionButtons.module.css'

interface ReactionButtonsProps {
  postId: string
  onReaction: (postId: string, type: ReactionType) => Promise<ReactionResponse>
}

export function ReactionButtons({
  postId,
  onReaction
}: ReactionButtonsProps) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReaction = async (type: ReactionType) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await onReaction(postId, type)
      setSelectedReaction(response.type)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.group} aria-label="Reacciones">
      <button
        className={`${styles.button} ${styles.like} ${selectedReaction === 'like' ? styles.active : ''}`}
        type="button"
        disabled={isSubmitting}
        onClick={() => void handleReaction('like')}
      >
        Me gusta
      </button>
      <button
        className={`${styles.button} ${styles.love} ${selectedReaction === 'love' ? styles.active : ''}`}
        type="button"
        disabled={isSubmitting}
        onClick={() => void handleReaction('love')}
      >
        Me encanta
      </button>
      <button
        className={`${styles.button} ${styles.amaze} ${selectedReaction === 'amaze' ? styles.active : ''}`}
        type="button"
        disabled={isSubmitting}
        onClick={() => void handleReaction('amaze')}
      >
        Me asombra
      </button>
    </div>
  )
}
