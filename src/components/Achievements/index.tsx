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
      {/* Header com Progresso Geral */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.headerBadge}>🏆 Mural de Conquistas</span>
          <h2 className={styles.title}>Suas Conquistas e Troféus</h2>
          <p className={styles.subtitle}>
            Desbloqueie troféus e ganhe XP bônus para subir de nível e liderar o ranking!
          </p>
        </div>

        <div className={styles.progressSummaryCard}>
          <div className={styles.summaryTop}>
            <span className={styles.summaryLabel}>Progresso Geral</span>
            <span className={styles.summaryCount}>
              {unlockedCount} / {totalCount}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${percentUnlocked}%` }}
            />
          </div>
          <span className={styles.summaryPercent}>{percentUnlocked}% Concluído</span>
        </div>
      </div>

      {/* Grid de Conquistas */}
      <div className={styles.achievementsGrid}>
        {ALL_ACHIEVEMENTS.map((ach) => {
          const isUnlocked = user.unlockedAchievementIds.includes(ach.id)
          const prog = getAchievementProgress(ach)

          return (
            <div
              key={ach.id}
              className={`${styles.achievementCard} ${
                isUnlocked ? styles.unlocked : styles.locked
              }`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <span className={styles.icon}>{ach.icon}</span>
                  {isUnlocked && <span className={styles.checkmark}>✓</span>}
                </div>
                <span className={styles.xpReward}>+{ach.xpReward} XP</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.achTitle}>{ach.title}</h3>
                <p className={styles.achDesc}>{ach.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.footerProgressBar}>
                  <div
                    className={styles.footerProgressFill}
                    style={{ width: `${isUnlocked ? 100 : prog.percent}%` }}
                  />
                </div>
                <div className={styles.footerLabelRow}>
                  <span className={styles.footerStatus}>
                    {isUnlocked
                      ? "Conquistada 🎉"
                      : `${prog.current} / ${prog.max}`}
                  </span>
                  {!isUnlocked && (
                    <span className={styles.footerPercent}>{prog.percent}%</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className={styles.ctaBox}>
        <div className={styles.ctaText}>
          <strong>Quer desbloquear mais conquistas?</strong>
          <p>Pratique agora qualquer um dos 16 temas e acumule XP!</p>
        </div>
        <button type="button" className={styles.ctaBtn} onClick={onStartStudy}>
          Continuar Estudando 🚀
        </button>
      </div>
    </div>
  )
}
