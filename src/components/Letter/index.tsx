import styles from "./styles.module.css"

type Props = {
  value?: string
  size?: "default" | "small"
  color?: "default" | "correct" | "wrong" | "revealed"
  isSpecial?: boolean
}

export function Letter({
  value = "",
  size = "default",
  color = "default",
  isSpecial = false,
}: Props) {
  if (isSpecial) {
    return (
      <div className={`${styles.specialChar} ${size === "small" ? styles.specialCharSmall : ""}`}>
        {value === " " ? "\u00A0" : value}
      </div>
    )
  }

  const isVisible = Boolean(value)

  return (
    <div
      className={`
        ${styles.letter}
        ${size === "small" ? styles.letterSmall : ""}
        ${color === "correct" ? styles.letterCorrect : ""}
        ${color === "wrong" ? styles.letterWrong : ""}
        ${color === "revealed" ? styles.letterRevealed : ""}
        ${isVisible ? styles.letterFilled : ""}
      `}
    >
      <span>{value}</span>
    </div>
  )
}