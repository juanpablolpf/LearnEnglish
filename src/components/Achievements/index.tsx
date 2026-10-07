import { ArrowRight, Check } from "lucide-react"
import type { UserProfile, Achievement } from "../../types"
import { ALL_ACHIEVEMENTS } from "../../utils/achievements"
import styles from "./styles.module.css"

type Props = {
  user: UserProfile
  onStartStudy: () => void
}

export function Achievements({ user, onStartStudy }: Props) {
  const totalLearnedWords = Object.values(user.completedWordIds).reduce(
    (acc, list) => acc + list.length,
    0
  )

  const unlockedCount = user.unlockedAchievementIds.length
  const totalCount = ALL_ACHIEVEMENTS.length
  const percentUnlocked = Math.round((unlockedCount / totalCount) * 100)

  function getAchievementProgress(ach: Achievement): { current: number; max: number; percent: number } {
    let current = 0
    const max = ach.requiredCount

    if (ach.category === "words") {
      if (ach.id === "daily_goal_complete") {
        current = user.todayWordsLearned
      } else {
        current = totalLearnedWords
      }
    } else if (ach.category === "streak") {
      current = Math.max(user.streak, user.bestStreak)
    } else if (ach.category === "xp") {
      if (ach.id === "level_5") {
        current = user.level
      } else {
        current = user.xp
      }
    }

    const percent = Math.min(100, Math.round((current / max) * 100))
    return { current, max, percent }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.spotlight} aria-hidden="true" />
        <h2 className={`title-display ${styles.title}`}>Suas conquistas</h2>
        <p className={styles.subtitle}>
          Cada conquista dá XP bônus para subir de nível e no ranking.
        </p>

        <div className={styles.progressSummary}>
          <div className={styles.summaryTop}>
            <span>{unlockedCount} de {totalCount} desbloqueadas</span>
            <span>{percentUnlocked}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${percentUnlocked}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.achievementsGrid}>
        {ALL_ACHIEVEMENTS.map((ach) => {
          const isUnlocked = user.unlockedAchievementIds.includes(ach.id)
          const prog = getAchievementProgress(ach)
          const Icon = ach.icon

          return (
            <div
              key={ach.id}
              className={`${styles.achievementCard} ${isUnlocked ? styles.unlocked : styles.locked}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.iconWrapper} aria-hidden="true">
                  <Icon size={19} strokeWidth={1.6} />
                </span>
                <span className={styles.xpReward}>+{ach.xpReward} XP</span>
              </div>

              <h3 className={styles.achTitle}>{ach.title}</h3>
              <p className={styles.achDesc}>{ach.description}</p>

              <div className={styles.cardFooter}>
                <div className={styles.footerProgressBar}>
                  <div
                    className={styles.footerProgressFill}
                    style={{ width: `${isUnlocked ? 100 : prog.percent}%` }}
                  />
                </div>
                <span className={styles.footerStatus}>
                  {isUnlocked ? (
                    <>
                      <Check size={13} strokeWidth={2} aria-hidden="true" /> Conquistada
                    </>
                  ) : (
                    `${prog.current} de ${prog.max}`
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.ctaBox}>
        <div className={styles.ctaText}>
          <strong>Quer desbloquear mais?</strong>
          <p>Pratique qualquer tema e acumule XP.</p>
        </div>
        <button type="button" className={styles.ctaBtn} onClick={onStartStudy}>
          Continuar estudando
          <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
