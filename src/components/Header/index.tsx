import logo from "../../assets/logo.png"
import restart from "../../assets/restart.svg"
import { ThemeToggle } from "../ThemeToggle"
import styles from "./styles.module.css"

type Props = {
  lives: number
  maxLives: number
  streak: number
  soundEnabled: boolean
  isDark: boolean
  onToggleSound: () => void
  onToggleTheme: () => void
  onRestart: () => void
}

export function Header({
  lives,
  maxLives,
  streak,
  soundEnabled,
  isDark,
  onToggleSound,
  onToggleTheme,
  onRestart,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <img src={logo} alt="Logo" className={styles.logo} />

        <div className={styles.controls}>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          <button
            type="button"
            className={styles.iconBtn}
            onClick={onToggleSound}
            title={soundEnabled ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={onRestart}
            title="Reiniciar jogo"
          >
            <img src={restart} alt="Ícone de reiniciar" />
          </button>
        </div>
      </div>

      <header className={styles.statsBar}>
        {/* Vidas / Tentativas */}
        <div className={styles.livesWrapper}>
          <span className={styles.livesLabel}>Vidas:</span>
          <div className={styles.hearts}>
            {Array.from({ length: maxLives }).map((_, i) => (
              <span
                key={i}
                className={`${styles.heart} ${i < lives ? styles.heartActive : styles.heartLost}`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className={styles.streakTag}>
            🔥 <strong>{streak}</strong>
          </div>
        )}
      </header>
    </div>
  )
}