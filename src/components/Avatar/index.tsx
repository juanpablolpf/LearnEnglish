import styles from "./styles.module.css"

type Props = {
  name: string
  size?: number
  className?: string
}

export function Avatar({ name, size = 28, className = "" }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || "?"

  return (
    <span
      className={`${styles.avatar} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  )
}
