import type { LettersUsedProps } from "../../types"
import styles from "./styles.module.css"

interface VirtualKeyboardProps {
  lettersUsed: LettersUsedProps[]
  onSelectLetter: (letter: string) => void
  disabled?: boolean
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
]

export function VirtualKeyboard({
  lettersUsed,
  onSelectLetter,
  disabled = false,
}: VirtualKeyboardProps) {
  const usedMap = new Map<string, boolean>()
  lettersUsed.forEach((item) => {
    usedMap.set(item.value.toUpperCase(), item.correct)
  })

  return (
    <div className={styles.keyboard}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((char) => {
            const isUsed = usedMap.has(char)
            const isCorrect = isUsed && usedMap.get(char) === true
            const isWrong = isUsed && usedMap.get(char) === false

            return (
              <button
                key={char}
                type="button"
                className={`
                  ${styles.key}
                  ${isCorrect ? styles.keyCorrect : ""}
                  ${isWrong ? styles.keyWrong : ""}
                `}
                disabled={disabled || isUsed}
                onClick={() => onSelectLetter(char)}
              >
                {char}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
