import styles from './CommentButton.module.css'

interface CommentButtonProps {
  onClick: () => void
}

export function CommentButton({ onClick }: CommentButtonProps) {
  return (
    <button className={styles.button} type="button" onClick={onClick}>Comentarios</button>
  )
}
