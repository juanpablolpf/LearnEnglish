import { Lock, Trophy, TrendingUp, Unlock, X, Zap, type LucideIcon } from "lucide-react"
import styles from "./styles.module.css"

export interface ToastMessage {
  id: string
  type: "achievement" | "levelup" | "xp" | "locked" | "unlocked"
  title: string
  subtitle?: string
}

const TOAST_KIND: Record<ToastMessage["type"], { label: string; icon: LucideIcon }> = {
  achievement: { label: "Conquista desbloqueada", icon: Trophy },
  levelup: { label: "Novo nível", icon: TrendingUp },
  xp: { label: "XP ganho", icon: Zap },
  locked: { label: "Versão completa", icon: Lock },
  unlocked: { label: "Acesso liberado", icon: Unlock },
}

type Props = {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function AchievementToast({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {toasts.map((toast) => {
        const { label, icon: Icon } = TOAST_KIND[toast.type]

        return (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
            onClick={() => onDismiss(toast.id)}
          >
            <span className={styles.icon} aria-hidden="true">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <div className={styles.content}>
              <span className={styles.badge}>{label}</span>
              <strong className={styles.title}>{toast.title}</strong>
              {toast.subtitle && <p className={styles.subtitle}>{toast.subtitle}</p>}
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Fechar aviso"
              onClick={(e) => {
                e.stopPropagation()
                onDismiss(toast.id)
              }}
            >
              <X size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
