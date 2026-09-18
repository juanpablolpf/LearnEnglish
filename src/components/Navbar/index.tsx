import type { UserProfile, MainTab } from "../../types"
import { calculateLevel } from "../../utils/auth"
import { ThemeToggle } from "../ThemeToggle"
import logo from "../../assets/logo.png"
import styles from "./styles.module.css"

type Props = {
  user: UserProfile
  currentTab: MainTab
  onSelectTab: (tab: MainTab) => void
  onOpenLogin: () => void
  onToggleTheme: () => void
  onToggleSound: () => void
}

export function Navbar({
  user,
  currentTab,
  onSelectTab,
  onOpenLogin,
  onToggleTheme,
  onToggleSound,
}: Props) {
  const levelInfo = calculateLevel(user.xp)
  const goalPercent = Math.min(100, Math.round((user.todayWordsLearned / user.dailyGoal) * 100))

  return (
    <nav className={styles.navbar}>
      {/* Linha Superior: Logo + Gamificação + Perfil Rápido + Controles */}
      <div className={styles.topBar}>
        <div className={styles.brand} onClick={() => onSelectTab("learn")}>
          <img src={logo} alt="Learn English Logo" className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Learn English</span>
            <span className={styles.brandTag}>Pro Fluency</span>
          </div>
        </div>

        {/* Stats de Gamificação Centralizados */}
        <div className={styles.gamificationBar}>
          {/* Level & XP */}
          <div className={styles.levelCard} title={`XP: ${user.xp} / ${levelInfo.nextLevelXp}`}>
            <div className={styles.levelHeader}>
              <span className={styles.levelBadge}>Nv. {levelInfo.level}</span>
              <span className={styles.levelTitle}>{levelInfo.title}</span>
            </div>
            <div className={styles.xpBarWrapper}>
              <div
                className={styles.xpBarFill}
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Ofensiva (Streak) */}
          <div className={styles.statPill} title="Sequência de acertos seguidos">
            <span className={styles.statIcon}>🔥</span>
            <span className={styles.statNumber}>{user.streak}</span>
          </div>

          {/* Meta Diária */}
          <div
            className={styles.statPill}
            title={`Meta diária: ${user.todayWordsLearned} de ${user.dailyGoal} palavras hoje (${goalPercent}%)`}
          >
            <span className={styles.statIcon}>🎯</span>
            <span className={styles.statNumber}>
              {user.todayWordsLearned}/{user.dailyGoal}
            </span>
          </div>
        </div>

        {/* Usuário Ativo & Controles */}
        <div className={styles.userControls}>
          <button
            type="button"
            className={styles.userButton}
            onClick={onOpenLogin}
            title="Clique para trocar de aluno ou gerenciar perfis"
          >
            <span className={styles.userAvatarEmoji}>{user.avatar}</span>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userSub}>Trocar Aluno ▾</span>
            </div>
          </button>

          <div className={styles.toolButtons}>
            <ThemeToggle isDark={user.darkMode} onToggle={onToggleTheme} />

            <button
              type="button"
              className={styles.iconBtn}
              onClick={onToggleSound}
              title={user.soundEnabled ? "Desativar sons" : "Ativar sons"}
            >
              {user.soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      </div>

      {/* Linha Inferior: Abas de Navegação */}
      <div className={styles.tabsRow}>
        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "learn" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("learn")}
        >
          <span className={styles.tabIcon}>📚</span>
          <span className={styles.tabText}>Aprender</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "practice" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("practice")}
        >
          <span className={styles.tabIcon}>🎮</span>
          <span className={styles.tabText}>Praticar</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "ranking" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("ranking")}
        >
          <span className={styles.tabIcon}>🏆</span>
          <span className={styles.tabText}>Ranking</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "achievements" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("achievements")}
        >
          <span className={styles.tabIcon}>🥇</span>
          <span className={styles.tabText}>Conquistas</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "profile" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("profile")}
        >
          <span className={styles.tabIcon}>👤</span>
          <span className={styles.tabText}>Meu Perfil</span>
        </button>
      </div>
    </nav>
  )
}
