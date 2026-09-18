export * from "./user"

export interface Challenge {
  id: number
  word: string
  tip: string
  phonetic?: string
  example?: string
  examplePt?: string
}

export interface LettersUsedProps {
  value: string
  correct: boolean
}

export type GameStatus = "playing" | "won" | "lost"

export interface UserStats {
  streak: number
  bestStreak: number
  completedWordIds: Record<string, number[]>
  difficultWords: Challenge[]
  soundEnabled: boolean
  darkMode: boolean
}
