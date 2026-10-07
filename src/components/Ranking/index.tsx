import { useState } from "react"
import { ArrowRight, Flame, Zap } from "lucide-react"
import type { UserProfile } from "../../types"
import { getLeaderboard } from "../../utils/auth"
import { Avatar } from "../Avatar"
import styles from "./styles.module.css"

type Props = {
  currentUser: UserProfile
  onStartStudy: () => void
}

const PODIUM_ORDER = [
  { place: 2, className: styles.silver },
  { place: 1, className: styles.gold },
  { place: 3, className: styles.bronze },
]

export function Ranking({ currentUser, onStartStudy }: Props) {
  const [filter, setFilter] = useState<"xp" | "streak">("xp")

  const leaderboard = [...getLeaderboard(currentUser)]
    .sort((a, b) =>
      filter === "streak" ? b.streak - a.streak || b.xp - a.xp : b.xp - a.xp || b.streak - a.streak
    )
    .map((item, idx) => ({ ...item, rank: idx + 1 }))

  const currentUserRank = leaderboard.find((u) => u.id === currentUser.id)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.spotlight} aria-hidden="true" />
        <h2 className={`title-display ${styles.title}`}>Ranking dos alunos</h2>
        <p className={styles.subtitle}>
          Estude todo dia, acerte palavras e suba no placar.
        </p>

        <div className={styles.filters} role="group" aria-label="Ordenar ranking">
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "xp" ? styles.activeFilter : ""}`}
            onClick={() => setFilter("xp")}
            aria-pressed={filter === "xp"}
          >
            <Zap size={15} strokeWidth={1.75} aria-hidden="true" />
            Mais XP
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "streak" ? styles.activeFilter : ""}`}
            onClick={() => setFilter("streak")}
            aria-pressed={filter === "streak"}
          >
            <Flame size={15} strokeWidth={1.75} aria-hidden="true" />
            Maior ofensiva
          </button>
        </div>
      </div>

      {leaderboard.length >= 3 && (
        <ol className={styles.podiumGrid}>
          {PODIUM_ORDER.map(({ place, className }) => {
            const student = leaderboard[place - 1]
            return (
              <li key={student.id} className={`${styles.podiumCard} ${className}`}>
                <span className={styles.podiumPlace}>{place}º</span>
                <Avatar name={student.name} size={place === 1 ? 52 : 44} />
                <strong className={styles.podiumName}>
                  {student.name}
                  {student.isCurrentUser && <span className={styles.meTag}>Você</span>}
                </strong>
                <span className={styles.podiumXp}>{student.xp.toLocaleString("pt-BR")} XP</span>
                <span className={styles.podiumSub}>{student.streak} de ofensiva</span>
              </li>
            )
          })}
        </ol>
      )}

      {currentUserRank && (
        <div className={styles.myRankCard}>
          <span className={styles.myRankNumber}>{currentUserRank.rank}º</span>
          <Avatar name={currentUser.name} size={40} />
          <div className={styles.myInfo}>
            <strong>Sua posição</strong>
            <span>
              {currentUserRank.xp.toLocaleString("pt-BR")} XP, {currentUserRank.streak} de ofensiva,{" "}
              {currentUserRank.wordsLearned} palavras
            </span>
          </div>
          <button type="button" className={styles.playBtn} onClick={onStartStudy}>
            Estudar agora
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.rankingTable}>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Aluno</th>
              <th>Nível</th>
              <th>Ofensiva</th>
              <th>Palavras</th>
              <th>XP</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((student) => {
              const isMe = student.id === currentUser.id
              return (
                <tr key={student.id} className={isMe ? styles.highlightMe : undefined}>
                  <td className={styles.rankCell}>{student.rank}º</td>
                  <td>
                    <span className={styles.studentFlex}>
                      <Avatar name={student.name} size={30} />
                      <span className={styles.studentName}>
                        {student.name}
                        {isMe && <span className={styles.meTag}>Você</span>}
                      </span>
                    </span>
                  </td>
                  <td>{student.level}</td>
                  <td>{student.streak}</td>
                  <td>{student.wordsLearned}</td>
                  <td className={styles.xpCell}>{student.xp.toLocaleString("pt-BR")}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
