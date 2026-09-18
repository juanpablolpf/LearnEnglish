import type { Challenge, UserStats } from "../types"

const STORAGE_KEY = "learn_english_app_stats_v1"

function getInitialDarkMode(): boolean {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }
  return false
}

const defaultStats: UserStats = {
  streak: 0,
  bestStreak: 0,
  completedWordIds: {},
  difficultWords: [],
  soundEnabled: true,
  darkMode: getInitialDarkMode(),
}

export function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStats
    const parsed = JSON.parse(raw)
    return { ...defaultStats, ...parsed }
  } catch {
    return defaultStats
  }
}

export function saveStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (err) {
    console.error("Erro ao salvar progresso:", err)
  }
}

export function markWordLearned(theme: string, wordId: number): UserStats {
  const stats = loadStats()
  const currentList = stats.completedWordIds[theme] || []
  if (!currentList.includes(wordId)) {
    stats.completedWordIds[theme] = [...currentList, wordId]
  }
  // Remover de difficultWords se tiver acertado
  stats.difficultWords = stats.difficultWords.filter((w) => w.id !== wordId)
  saveStats(stats)
  return stats
}

export function addDifficultWord(challenge: Challenge): UserStats {
  const stats = loadStats()
  const exists = stats.difficultWords.some((w) => w.word.toUpperCase() === challenge.word.toUpperCase())
  if (!exists) {
    stats.difficultWords = [challenge, ...stats.difficultWords]
  }
  saveStats(stats)
  return stats
}

export function updateStreak(won: boolean): UserStats {
  const stats = loadStats()
  if (won) {
    stats.streak += 1
    if (stats.streak > stats.bestStreak) {
      stats.bestStreak = stats.streak
    }
  } else {
    stats.streak = 0
  }
  saveStats(stats)
  return stats
}
