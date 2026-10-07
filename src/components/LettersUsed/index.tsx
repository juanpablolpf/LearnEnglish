import styles from "./styles.module.css"
import { Letter } from "../Letter"
import type { LettersUsedProps } from "../../types"

type Props = {
  data: LettersUsedProps[]
}

export function LettersUsed({ data }: Props) {
  if (data.length === 0) return null

  const wrongLetters = data.filter((item) => !item.correct)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5>Letras tentadas ({data.length})</h5>
        {wrongLetters.length > 0 && (
          <span className={styles.wrongCount}>
            {wrongLetters.length} {wrongLetters.length === 1 ? "erro" : "erros"}
          </span>
        )}
      </div>

      <div className={styles.lettersList}>
        {data.map(({ value, correct }) => (
          <Letter
            key={value}
            value={value}
            size="small"
            color={correct ? "correct" : "wrong"}
          />
        ))}
      </div>
    </div>
  )
}