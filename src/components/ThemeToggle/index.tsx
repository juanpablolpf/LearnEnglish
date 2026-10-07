import { Moon, Sun } from "lucide-react"
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
        aria-label={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
        className={styles.toggle}
        onClick={onToggle}
        title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
      >
        {isDark ? <Moon size={17} strokeWidth={1.75} /> : <Sun size={17} strokeWidth={1.75} />}
      </button>
    </div>
  )
}
