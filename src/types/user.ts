import type { LucideIcon } from "lucide-react"
import type { Challenge } from "./index"

export interface UserProfile {
  id: string
  name: string
  email?: string
  xp: number
  level: number
  dailyGoal: number // target words per day (e.g. 10)
  todayWordsLearned: number
  lastActiveDate: string // YYYY-MM-DD
  streak: number
  bestStreak: number
  unlockedAchievementIds: string[]
  completedWordIds: Record<string, number[]>
  difficultWords: Challenge[]
  soundEnabled: boolean
  darkMode: boolean
  isGuest: boolean
  dicasRestantes: number // quantas vezes ainda pode revelar a frase de exemplo em inglês
  isPro: boolean // desbloqueou a versão completa (todos os temas + dicas ilimitadas) com um código de acesso
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: LucideIcon
  requiredCount: number
  category: "words" | "streak" | "xp" | "quiz" | "speech" | "flashcards"
  xpReward: number
}

export type MainTab = "learn" | "practice" | "ranking" | "achievements" | "profile"
export type StudyMode = "hangman" | "flashcards" | "quiz" | "speech"
