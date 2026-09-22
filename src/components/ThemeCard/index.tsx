import styles from "./styles.module.css"

interface ThemeCardProps {
  title: string
  icon: string
  description: string
  totalWords: number
  completedWords: number
  isReview?: boolean
  isLocked?: boolean
  onClick: () => void
}

export function ThemeCard({
  title,
  icon,
  description,
  totalWords,
  completedWords,
  isReview = false,
  isLocked = false,
  onClick,
}: ThemeCardProps) {
  const percentage = totalWords > 0 ? Math.min(100, Math.round((completedWords / totalWords) * 100)) : 0

  return (
    <button
      type="button"
      className={`${styles.card} ${isReview ? styles.cardReview : ""} ${isLocked ? styles.cardLocked : ""}`}
      onClick={onClick}
    >
      <div className={styles.iconWrapper}>{isLocked ? "🔒" : icon}</div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {isLocked ? (
            <span className={styles.lockedBadge}>Versão completa</span>
          ) : isReview ? (
            <span className={styles.reviewBadge}>
              {totalWords} {totalWords === 1 ? "palavra" : "palavras"}
            </span>
          ) : (
            <span className={styles.badge}>
              {completedWords}/{totalWords}
            </span>
          )}
        </div>

        <p className={styles.description}>{description}</p>

        {!isReview && !isLocked && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${percentage}%` }} />
          </div>
        )}
      </div>
    </button>
  )
}
