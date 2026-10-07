import { Flame, Heart, RotateCcw } from "lucide-react"
import styles from "./styles.module.css"

type Props = {
  lives: number
  maxLives: number
  streak: number
  onRestart: () => void
}

// Tema e som não aparecem aqui porque já ficam no topo do app
export function Header({ lives, maxLives, streak, onRestart }: Props) {
  return (
    <header className={styles.statsBar}>
      <div className={styles.livesWrapper}>
        <span className={styles.livesLabel}>Vidas</span>
        <div className={styles.hearts} aria-label={`${lives} de ${maxLives} vidas`}>
          {Array.from({ length: maxLives }).map((_, i) => (
            <Heart
              key={i}
              size={17}
              strokeWidth={1.75}
              aria-hidden="true"
              className={i < lives ? styles.heartActive : styles.heartLost}
            />
          ))}
        </div>
      </div>

      <div className={styles.right}>
        {streak > 0 && (
          <span className={styles.streakTag} title="Sequência de acertos">
            <Flame size={15} strokeWidth={1.75} aria-hidden="true" />
            <strong>{streak}</strong>
          </span>
        )}

        <button
          type="button"
          className={styles.iconBtn}
          onClick={onRestart}
          title="Reiniciar jogo"
          aria-label="Reiniciar jogo"
        >
          <RotateCcw size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
