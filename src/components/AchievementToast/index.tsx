import styles from "./styles.module.css"

export interface ToastMessage {
  id: string
  type: "achievement" | "levelup" | "xp"
  title: string
  subtitle?: string
  icon?: string
}

type Props = {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function AchievementToast({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => onDismiss(toast.id)}
        >
          <div className={styles.icon}>{toast.icon || "🎉"}</div>
          <div className={styles.content}>
            <span className={styles.badge}>
              {toast.type === "levelup"
                ? "🚀 NOVO NÍVEL!"
                : toast.type === "achievement"
                ? "🏆 CONQUISTA DESBLOQUEADA!"
                : "⚡ XP GANHO!"}
            </span>
            <strong className={styles.title}>{toast.title}</strong>
            {toast.subtitle && <p className={styles.subtitle}>{toast.subtitle}</p>}
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={(e) => {
              e.stopPropagation()
              onDismiss(toast.id)
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
