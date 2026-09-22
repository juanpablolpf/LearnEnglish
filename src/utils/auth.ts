import type { UserProfile, AvatarId, Challenge } from "../types"
import { checkAndUnlockAchievements } from "./achievements"
import { isValidProCode } from "./license"

const CURRENT_USER_KEY = "learn_english_current_user_v2"
const USERS_LIST_KEY = "learn_english_users_list_v2"
export const DICAS_INICIAIS = 3

export const AVAILABLE_AVATARS: { id: AvatarId; name: string }[] = [
  { id: "🦁", name: "Leão" },
  { id: "🦊", name: "Raposa" },
  { id: "🦉", name: "Coruja" },
  { id: "🚀", name: "Foguete" },
  { id: "👑", name: "Coroa" },
  { id: "⚡", name: "Raio" },
  { id: "💎", name: "Diamante" },
  { id: "🌟", name: "Estrela" },
  { id: "🐱", name: "Gato" },
  { id: "🧙", name: "Mago" },
]

function getTodayString(): string {
  return new Date().toISOString().split("T")[0]
}

export function calculateLevel(xp: number): { level: number; title: string; progressPercent: number; nextLevelXp: number } {
  // Level formula: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP, etc.
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 50)) + 1)
  
  const currentLevelBaseXp = Math.pow(level - 1, 2) * 50
  const nextLevelXp = Math.pow(level, 2) * 50
  const xpInCurrentLevel = xp - currentLevelBaseXp
  const xpNeededForLevel = nextLevelXp - currentLevelBaseXp
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)))

  let title = "Iniciante (A1)"
  if (level >= 15) title = "Mestre Fluente (C1/C2)"
  else if (level >= 10) title = "Avançado (B2)"
  else if (level >= 6) title = "Intermediário (B1)"
  else if (level >= 3) title = "Básico (A2)"

  return { level, title, progressPercent, nextLevelXp }
}

export function createDefaultUser(name: string, avatar: AvatarId = "🦁", isGuest = false): UserProfile {
  return {
    id: "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    name: name.trim() || (isGuest ? "Visitante" : "Estudante"),
    avatar,
    xp: 0,
    level: 1,
    dailyGoal: 10,
    todayWordsLearned: 0,
    lastActiveDate: getTodayString(),
    streak: 0,
    bestStreak: 0,
    unlockedAchievementIds: [],
    completedWordIds: {},
    difficultWords: [],
    soundEnabled: true,
    darkMode: false,
    isGuest,
    dicasRestantes: DICAS_INICIAIS,
    isPro: false,
  }
}

export function getCurrentUser(): UserProfile {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (raw) {
      const user: UserProfile = JSON.parse(raw)
      // Compatibilidade com perfis salvos antes da dica de frase em inglês existir
      if (typeof user.dicasRestantes !== "number") {
        user.dicasRestantes = DICAS_INICIAIS
      }
      // Compatibilidade com perfis salvos antes da versão Pro existir
      if (typeof user.isPro !== "boolean") {
        user.isPro = false
      }
      const today = getTodayString()
      // Resetar contador diário se for um novo dia
      if (user.lastActiveDate !== today) {
        user.todayWordsLearned = 0
        user.lastActiveDate = today
        saveCurrentUser(user)
      }
      return user
    }
  } catch (err) {
    console.error("Erro ao carregar usuário atual:", err)
  }

  // Se não existir, cria perfil inicial
  const defaultUser = createDefaultUser("Estudante", "🦁", true)
  saveCurrentUser(defaultUser)
  return defaultUser
}

export function saveCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))

    // Atualizar na lista de usuários
    const usersRaw = localStorage.getItem(USERS_LIST_KEY)
    const users: UserProfile[] = usersRaw ? JSON.parse(usersRaw) : []
    const idx = users.findIndex((u) => u.id === user.id)
    if (idx >= 0) {
      users[idx] = user
    } else {
      users.push(user)
    }
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users))
  } catch (err) {
    console.error("Erro ao salvar usuário:", err)
  }
}

export function addXpToUser(amount: number): { user: UserProfile; leveledUp: boolean; newAchievements: string[] } {
  const user = getCurrentUser()
  const oldLevel = calculateLevel(user.xp).level

  user.xp += amount
  const newLevelInfo = calculateLevel(user.xp)
  user.level = newLevelInfo.level
  const leveledUp = newLevelInfo.level > oldLevel

  // Verificar conquistas
  const newAchievements = checkAndUnlockAchievements(user)

  saveCurrentUser(user)
  return { user, leveledUp, newAchievements }
}

export function recordLearnedWord(themeKey: string, challenge: Challenge, xpGain = 15): { user: UserProfile; leveledUp: boolean; newAchievements: string[] } {
  const user = getCurrentUser()
  const currentList = user.completedWordIds[themeKey] || []

  if (!currentList.includes(challenge.id)) {
    user.completedWordIds[themeKey] = [...currentList, challenge.id]
    user.todayWordsLearned += 1
  }

  // Remover de palavras difíceis se acertou
  user.difficultWords = user.difficultWords.filter((w) => w.id !== challenge.id)

  const oldLevel = calculateLevel(user.xp).level
  user.xp += xpGain
  user.streak += 1
  if (user.streak > user.bestStreak) {
    user.bestStreak = user.streak
  }

  const newLevel = calculateLevel(user.xp).level
  user.level = newLevel
  const leveledUp = newLevel > oldLevel

  const newAchievements = checkAndUnlockAchievements(user)
  saveCurrentUser(user)
  return { user, leveledUp, newAchievements }
}

export function recordFailedWord(challenge: Challenge): UserProfile {
  const user = getCurrentUser()
  const exists = user.difficultWords.some((w) => w.word.toUpperCase() === challenge.word.toUpperCase())
  if (!exists) {
    user.difficultWords = [challenge, ...user.difficultWords]
  }
  user.streak = 0
  saveCurrentUser(user)
  return user
}

// Consome uma dica de frase em inglês, se ainda houver alguma disponível
export function usarDica(): UserProfile {
  const user = getCurrentUser()
  if (user.dicasRestantes > 0) {
    user.dicasRestantes -= 1
    saveCurrentUser(user)
  }
  return user
}

// Tenta desbloquear a versão completa (Pro) com um código de acesso.
// Retorna se o código era válido; o perfil só é alterado quando é.
export async function unlockPro(code: string): Promise<{ valid: boolean; user: UserProfile }> {
  const user = getCurrentUser()
  if (user.isPro) {
    return { valid: true, user }
  }

  const valid = await isValidProCode(code)
  if (valid) {
    user.isPro = true
    saveCurrentUser(user)
  }
  return { valid, user }
}

export function getAllUsers(): UserProfile[] {
  try {
    const usersRaw = localStorage.getItem(USERS_LIST_KEY)
    let users: UserProfile[] = usersRaw ? JSON.parse(usersRaw) : []
    
    // Se a lista estiver vazia, garante que o usuário atual esteja nela
    const current = getCurrentUser()
    if (users.length === 0) {
      users = [current]
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users))
    }
    return users
  } catch {
    return [getCurrentUser()]
  }
}

export function loginAsUser(userId: string): UserProfile {
  const users = getAllUsers()
  const found = users.find((u) => u.id === userId)
  if (found) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found))
    return found
  }
  return getCurrentUser()
}

export function registerNewUser(name: string, avatar: AvatarId = "🦁"): UserProfile {
  const newUser = createDefaultUser(name, avatar, false)
  const users = getAllUsers()
  users.push(newUser)
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users))
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
  return newUser
}

export function deleteUserProfile(userId: string): UserProfile {
  let users = getAllUsers()
  users = users.filter((u) => u.id !== userId)
  if (users.length === 0) {
    const defaultUser = createDefaultUser("Estudante", "🦁", true)
    users = [defaultUser]
  }
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users))
  const newCurrent = users[0]
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newCurrent))
  return newCurrent
}

export interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  avatar: AvatarId
  level: number
  levelTitle: string
  xp: number
  streak: number
  wordsLearned: number
  isCurrentUser: boolean
  isTopPerformer: boolean
}

// Alunos de exemplo para inspirar a comunidade e preencher o ranking
const SAMPLE_COMMUNITY_STUDENTS: Partial<UserProfile>[] = [
  {
    id: "sample_sarah",
    name: "Sarah Jenkins",
    avatar: "👑",
    xp: 3450,
    streak: 18,
    completedWordIds: { Daily: Array.from({ length: 48 }, (_, i) => i + 1), Travel: Array.from({ length: 42 }, (_, i) => i + 1) },
  },
  {
    id: "sample_pedro",
    name: "Pedro Henrique",
    avatar: "🚀",
    xp: 2120,
    streak: 12,
    completedWordIds: { Tech: Array.from({ length: 45 }, (_, i) => i + 1), Work: Array.from({ length: 35 }, (_, i) => i + 1) },
  },
  {
    id: "sample_elena",
    name: "Elena Rostova",
    avatar: "💎",
    xp: 1560,
    streak: 8,
    completedWordIds: { Food: Array.from({ length: 38 }, (_, i) => i + 1) },
  },
  {
    id: "sample_lucas",
    name: "Lucas Mendes",
    avatar: "⚡",
    xp: 890,
    streak: 5,
    completedWordIds: { Verbs: Array.from({ length: 30 }, (_, i) => i + 1) },
  },
]

export function getLeaderboard(currentUser: UserProfile): LeaderboardEntry[] {
  const localUsers = getAllUsers()
  
  // Combina usuários locais com alunos da comunidade
  const combinedMap = new Map<string, { user: UserProfile; isSample: boolean }>()
  
  localUsers.forEach((u) => {
    combinedMap.set(u.id, { user: u, isSample: false })
  })

  // Adiciona os alunos modelo se não houver conflito de ID
  SAMPLE_COMMUNITY_STUDENTS.forEach((sample) => {
    if (!combinedMap.has(sample.id!)) {
      const sampleUser = createDefaultUser(sample.name!, sample.avatar || "🌟", false)
      sampleUser.id = sample.id!
      sampleUser.xp = sample.xp || 0
      sampleUser.streak = sample.streak || 0
      sampleUser.completedWordIds = sample.completedWordIds || {}
      sampleUser.level = calculateLevel(sampleUser.xp).level
      combinedMap.set(sample.id!, { user: sampleUser, isSample: true })
    }
  })

  const rawList = Array.from(combinedMap.values()).map(({ user }) => {
    const totalWords = Object.values(user.completedWordIds).reduce(
      (acc, list) => acc + list.length,
      0
    )
    const levelInfo = calculateLevel(user.xp)
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      xp: user.xp,
      streak: user.streak,
      wordsLearned: totalWords,
      isCurrentUser: user.id === currentUser.id,
      isTopPerformer: false,
    }
  })

  // Ordena por XP decrescente, depois por streak decrescente
  rawList.sort((a, b) => b.xp - a.xp || b.streak - a.streak)

  // Atribui posições (Ranks)
  return rawList.map((entry, index) => ({
    ...entry,
    rank: index + 1,
    isTopPerformer: index === 0,
  }))
}

export function updateUserAvatar(avatar: AvatarId): UserProfile {
  const user = getCurrentUser()
  user.avatar = avatar
  saveCurrentUser(user)
  return user
}

export function updateUserName(name: string): UserProfile {
  const user = getCurrentUser()
  user.name = name.trim() || user.name
  saveCurrentUser(user)
  return user
}

export function updateDailyGoal(goal: number): UserProfile {
  const user = getCurrentUser()
  user.dailyGoal = Math.max(1, goal)
  saveCurrentUser(user)
  return user
}

export function resetUserStats(): UserProfile {
  const user = getCurrentUser()
  user.xp = 0
  user.level = 1
  user.streak = 0
  user.bestStreak = 0
  user.todayWordsLearned = 0
  user.unlockedAchievementIds = []
  user.completedWordIds = {}
  user.difficultWords = []
  saveCurrentUser(user)
  return user
}

