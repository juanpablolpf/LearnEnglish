import styles from "./styles.module.css"

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
  showLabel?: boolean
}

export function ThemeToggle({ isDark, onToggle, showLabel = false }: ThemeToggleProps) {
  return (
    <div className={styles.container}>
      {showLabel && (
        <span className={styles.label}>
          {isDark ? "Modo Escuro" : "Modo Claro"}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        className={`${styles.toggle} ${isDark ? styles.toggleDark : styles.toggleLight}`}
        onClick={onToggle}
        title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
      >
        <span className={styles.trackIcon}>☀️</span>
        <span className={styles.trackIcon}>🌙</span>
        <div className={`${styles.thumb} ${isDark ? styles.thumbDark : styles.thumbLight}`}>
          {isDark ? "🌙" : "☀️"}
        </div>
      </button>
    </div>
  )
}
