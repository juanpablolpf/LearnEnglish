import styles from "./styles.module.css"

interface ThemeCardProps {
  title: string
  icon: string
  description: string
  totalWords: number
  completedWords: number
  isReview?: boolean
  onClick: () => void
}

export function ThemeCard({
  title,
  icon,
  description,
  totalWords,
  completedWords,
  isReview = false,
  onClick,
}: ThemeCardProps) {
  const percentage = totalWords > 0 ? Math.min(100, Math.round((completedWords / totalWords) * 100)) : 0

  return (
    <button
      type="button"
      className={`${styles.card} ${isReview ? styles.cardReview : ""}`}
      onClick={onClick}
    >
      <div className={styles.iconWrapper}>{icon}</div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {isReview ? (
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

        {!isReview && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${percentage}%` }} />
          </div>
        )}
      </div>
    </button>
  )
}
