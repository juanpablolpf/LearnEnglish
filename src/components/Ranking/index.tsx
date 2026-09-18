import { useState } from "react"
import type { UserProfile } from "../../types"
import { getLeaderboard, type LeaderboardEntry } from "../../utils/auth"
import styles from "./styles.module.css"

type Props = {
  currentUser: UserProfile
  onStartStudy: () => void
}

export function Ranking({ currentUser, onStartStudy }: Props) {
  const [filter, setFilter] = useState<"xp" | "streak">("xp")
  const leaderboardRaw = getLeaderboard(currentUser)

  const leaderboard = [...leaderboardRaw].sort((a, b) => {
    if (filter === "streak") {
      return b.streak - a.streak || b.xp - a.xp
    }
    return b.xp - a.xp || b.streak - a.streak
  }).map((item, idx) => ({ ...item, rank: idx + 1 }))

  const top1 = leaderboard[0]
  const top2 = leaderboard[1]
  const top3 = leaderboard[2]

  const currentUserRank = leaderboard.find((u) => u.id === currentUser.id)

  return (
    <div className={styles.container}>
      {/* Header do Ranking */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.headerBadge}>🏆 Tabela de Classificação</span>
          <h2 className={styles.title}>Ranking dos Alunos Destaques</h2>
          <p className={styles.subtitle}>
            Estude diariamente, acerte palavras e suba no placar para se tornar o aluno destaque!
          </p>
        </div>

        {/* Filtros */}
        <div className={styles.filters}>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "xp" ? styles.activeFilter : ""}`}
            onClick={() => setFilter("xp")}
          >
            ⚡ Mais XP
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "streak" ? styles.activeFilter : ""}`}
            onClick={() => setFilter("streak")}
          >
            🔥 Maior Ofensiva
          </button>
        </div>
      </div>

      {/* Destaque Máximo: Aluno Campeão / Aluno Destaque */}
      {top1 && (
        <div className={styles.championSpotlight}>
          <div className={styles.spotlightBadge}>⭐ ALUNO DESTAQUE DA SEMANA</div>
          <div className={styles.spotlightContent}>
            <div className={styles.crownWrapper}>
              <span className={styles.crownEmoji}>👑</span>
              <div className={styles.championAvatar}>{top1.avatar}</div>
              <span className={styles.trophyPill}>🥇 1º Lugar</span>
            </div>

            <div className={styles.championInfo}>
              <h3 className={styles.championName}>
                {top1.name} {top1.isCurrentUser && <span className={styles.youBadge}>(Você)</span>}
              </h3>
              <p className={styles.championLevel}>
                Nível {top1.level} • {top1.levelTitle}
              </p>
              <div className={styles.championStatsGrid}>
                <div className={styles.cStat}>
                  <span className={styles.cStatVal}>⚡ {top1.xp.toLocaleString()}</span>
                  <span className={styles.cStatLbl}>Pontos de XP</span>
                </div>
                <div className={styles.cStat}>
                  <span className={styles.cStatVal}>🔥 {top1.streak}</span>
                  <span className={styles.cStatLbl}>Ofensiva</span>
                </div>
                <div className={styles.cStat}>
                  <span className={styles.cStatVal}>📚 {top1.wordsLearned}</span>
                  <span className={styles.cStatLbl}>Palavras</span>
                </div>
              </div>
            </div>

            <div className={styles.championAction}>
              <button type="button" className={styles.playBtn} onClick={onStartStudy}>
                {top1.isCurrentUser ? "Defender a Liderança 🚀" : "Estudar para Superar ⚔️"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pódio dos Top 3 (Se houver pelo menos 2 alunos) */}
      {top2 && (
        <div className={styles.podiumSection}>
          <h4 className={styles.podiumTitle}>Pódio de Honra</h4>
          <div className={styles.podiumGrid}>
            {/* 2º Lugar */}
            {top2 && (
              <div className={`${styles.podiumCard} ${styles.silver}`}>
                <div className={styles.podiumMedal}>🥈 2º</div>
                <div className={styles.podiumAvatar}>{top2.avatar}</div>
                <strong className={styles.podiumName}>{top2.name}</strong>
                <span className={styles.podiumXp}>⚡ {top2.xp} XP</span>
                <span className={styles.podiumSub}>🔥 {top2.streak} streak</span>
              </div>
            )}

            {/* 1º Lugar no Pódio Central */}
            {top1 && (
              <div className={`${styles.podiumCard} ${styles.gold}`}>
                <div className={styles.podiumMedal}>🥇 1º</div>
                <div className={styles.podiumAvatar}>{top1.avatar}</div>
                <strong className={styles.podiumName}>{top1.name}</strong>
                <span className={styles.podiumXp}>⚡ {top1.xp} XP</span>
                <span className={styles.podiumSub}>🔥 {top1.streak} streak</span>
              </div>
            )}

            {/* 3º Lugar */}
            {top3 && (
              <div className={`${styles.podiumCard} ${styles.bronze}`}>
                <div className={styles.podiumMedal}>🥉 3º</div>
                <div className={styles.podiumAvatar}>{top3.avatar}</div>
                <strong className={styles.podiumName}>{top3.name}</strong>
                <span className={styles.podiumXp}>⚡ {top3.xp} XP</span>
                <span className={styles.podiumSub}>🔥 {top3.streak} streak</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sua Posição Atual */}
      {currentUserRank && (
        <div className={styles.myRankCard}>
          <span className={styles.myRankLabel}>Sua Posição no Placar:</span>
          <div className={styles.myRankData}>
            <span className={styles.myRankNumber}>#{currentUserRank.rank}</span>
            <span className={styles.myAvatar}>{currentUser.avatar}</span>
            <div className={styles.myInfo}>
              <strong>{currentUser.name} (Você)</strong>
              <span>Nível {currentUserRank.level} • {currentUserRank.levelTitle}</span>
            </div>
          </div>
          <div className={styles.myStats}>
            <span>⚡ <strong>{currentUserRank.xp}</strong> XP</span>
            <span>🔥 <strong>{currentUserRank.streak}</strong> Ofensiva</span>
            <span>📚 <strong>{currentUserRank.wordsLearned}</strong> Palavras</span>
          </div>
        </div>
      )}

      {/* Tabela Completa */}
      <div className={styles.tableWrapper}>
        <table className={styles.rankingTable}>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Aluno</th>
              <th>Nível</th>
              <th>Ofensiva</th>
              <th>Palavras</th>
              <th>Total de XP</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((student: LeaderboardEntry) => {
              const isMe = student.id === currentUser.id
              let rankBadge = `#${student.rank}`
              if (student.rank === 1) rankBadge = "🥇 1º"
              else if (student.rank === 2) rankBadge = "🥈 2º"
              else if (student.rank === 3) rankBadge = "🥉 3º"

              return (
                <tr
                  key={student.id}
                  className={`${styles.tableRow} ${isMe ? styles.highlightMe : ""}`}
                >
                  <td className={styles.rankCell}>
                    <span className={styles.rankBadgeSpan}>{rankBadge}</span>
                  </td>
                  <td className={styles.studentCell}>
                    <div className={styles.studentFlex}>
                      <span className={styles.tableAvatar}>{student.avatar}</span>
                      <div className={styles.studentText}>
                        <strong className={styles.studentName}>
                          {student.name}
                          {isMe && <span className={styles.meTag}>Você</span>}
                        </strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.levelTag}>Nv. {student.level}</span>
                  </td>
                  <td>
                    <span className={styles.streakTag}>🔥 {student.streak}</span>
                  </td>
                  <td>
                    <span className={styles.wordsCount}>📚 {student.wordsLearned}</span>
                  </td>
                  <td className={styles.xpCell}>
                    <strong>⚡ {student.xp.toLocaleString()} XP</strong>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
