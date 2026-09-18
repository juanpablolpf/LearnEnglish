import type { Achievement, UserProfile } from "../types"

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_word",
    title: "Primeiro Passo",
    description: "Acerte sua primeira palavra em inglês",
    icon: "🌱",
    requiredCount: 1,
    category: "words",
    xpReward: 50,
  },
  {
    id: "words_10",
    title: "Aquecendo os Motores",
    description: "Domine 10 palavras de qualquer tema",
    icon: "🥉",
    requiredCount: 10,
    category: "words",
    xpReward: 100,
  },
  {
    id: "words_50",
    title: "Vocabulário Afiado",
    description: "Domine 50 palavras no aplicativo",
    icon: "🥈",
    requiredCount: 50,
    category: "words",
    xpReward: 250,
  },
  {
    id: "words_100",
    title: "Centurião do Inglês",
    description: "Domine 100 palavras essenciais",
    icon: "🥇",
    requiredCount: 100,
    category: "words",
    xpReward: 500,
  },
  {
    id: "words_250",
    title: "Mestre do Vocabulário",
    description: "Domine 250 palavras em inglês",
    icon: "💎",
    requiredCount: 250,
    category: "words",
    xpReward: 1000,
  },
  {
    id: "streak_3",
    title: "Chama Acesa",
    description: "Atinja uma ofensiva de 3 acertos seguidos",
    icon: "🔥",
    requiredCount: 3,
    category: "streak",
    xpReward: 50,
  },
  {
    id: "streak_10",
    title: "Inabalável",
    description: "Atinja uma sequência de 10 acertos seguidos",
    icon: "⚡",
    requiredCount: 10,
    category: "streak",
    xpReward: 200,
  },
  {
    id: "streak_25",
    title: "Modo Lendário",
    description: "Atinja uma sequência de 25 acertos seguidos",
    icon: "👑",
    requiredCount: 25,
    category: "streak",
    xpReward: 500,
  },
  {
    id: "xp_500",
    title: "Estudante Brilhante",
    description: "Acumule 500 pontos de XP",
    icon: "🌟",
    requiredCount: 500,
    category: "xp",
    xpReward: 100,
  },
  {
    id: "xp_2000",
    title: "Especialista em Línguas",
    description: "Acumule 2.000 pontos de XP",
    icon: "🏆",
    requiredCount: 2000,
    category: "xp",
    xpReward: 300,
  },
  {
    id: "level_5",
    title: "Nível 5 Conquistado",
    description: "Evolua seu perfil para o Nível 5",
    icon: "🚀",
    requiredCount: 5,
    category: "xp",
    xpReward: 250,
  },
  {
    id: "daily_goal_complete",
    title: "Meta Diária Cumprida",
    description: "Complete a sua meta diária de estudo de palavras",
    icon: "🎯",
    requiredCount: 1,
    category: "words",
    xpReward: 100,
  },
]

export function checkAndUnlockAchievements(user: UserProfile): string[] {
  const newlyUnlocked: string[] = []
  const totalLearnedWords = Object.values(user.completedWordIds).reduce(
    (acc, list) => acc + list.length,
    0
  )

  ALL_ACHIEVEMENTS.forEach((ach) => {
    if (user.unlockedAchievementIds.includes(ach.id)) return

    let shouldUnlock = false

    if (ach.category === "words") {
      if (ach.id === "daily_goal_complete") {
        shouldUnlock = user.todayWordsLearned >= user.dailyGoal
      } else {
        shouldUnlock = totalLearnedWords >= ach.requiredCount
      }
    } else if (ach.category === "streak") {
      shouldUnlock = user.bestStreak >= ach.requiredCount || user.streak >= ach.requiredCount
    } else if (ach.category === "xp") {
      if (ach.id === "level_5") {
        shouldUnlock = user.level >= 5
      } else {
        shouldUnlock = user.xp >= ach.requiredCount
      }
    }

    if (shouldUnlock) {
      user.unlockedAchievementIds.push(ach.id)
      user.xp += ach.xpReward
      newlyUnlocked.push(ach.title)
    }
  })

  return newlyUnlocked
}
