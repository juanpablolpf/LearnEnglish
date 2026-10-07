import type { CSSProperties, ReactNode } from "react"
import { Lock } from "lucide-react"
import styles from "./styles.module.css"

interface ThemeCardProps {
  title: string
  icon: ReactNode
  description: string
  totalWords: number
  completedWords: number
  isReview?: boolean
  isLocked?: boolean
  accent?: string
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
  accent,
  onClick,
}: ThemeCardProps) {
  const percentage = totalWords > 0 ? Math.min(100, Math.round((completedWords / totalWords) * 100)) : 0

  return (
    <button
      type="button"
      className={`${styles.card} ${isReview ? styles.cardReview : ""} ${isLocked ? styles.cardLocked : ""}`}
      onClick={onClick}
      style={accent ? ({ "--accent": accent } as CSSProperties) : undefined}
    >
      <div className={styles.iconWrapper} aria-hidden="true">{icon}</div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {isLocked ? (
            <span className={styles.lockedBadge} title="Versão completa">
              <Lock size={12} strokeWidth={2} aria-hidden="true" />
              <span className={styles.lockedText}>Versão completa</span>
            </span>
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
