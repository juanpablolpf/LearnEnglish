import styles from "./styles.module.css"

type Props = React.ComponentProps<"button"> & {
  title: string
  variant?: "primary" | "secondary" | "danger" | "outline"
  icon?: string
}

export function Button({
  title,
  variant = "primary",
  icon,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`
        ${styles.button}
        ${styles[variant]}
        ${className}
      `}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{title}</span>
    </button>
  )
}