import { BookOpen, ChevronDown, Flame, Gamepad2, Medal, Target, Trophy, User, Volume2, VolumeX } from "lucide-react"
import type { UserProfile, MainTab } from "../../types"
import { calculateLevel } from "../../utils/auth"
import { ThemeToggle } from "../ThemeToggle"
import { Avatar } from "../Avatar"
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
            <Flame className={`${styles.statIcon} ${styles.iconStreak}`} size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className={styles.statNumber}>{user.streak}</span>
          </div>

          {/* Meta Diária */}
          <div
            className={styles.statPill}
            title={`Meta diária: ${user.todayWordsLearned} de ${user.dailyGoal} palavras hoje (${goalPercent}%)`}
          >
            <Target className={`${styles.statIcon} ${styles.iconGoal}`} size={16} strokeWidth={1.75} aria-hidden="true" />
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
            <Avatar name={user.name} />
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userSub}>Trocar aluno <ChevronDown size={12} aria-hidden="true" /></span>
            </div>
          </button>

          <div className={styles.toolButtons}>
            <ThemeToggle isDark={user.darkMode} onToggle={onToggleTheme} />

            <button
              type="button"
              className={styles.iconBtn}
              onClick={onToggleSound}
              title={user.soundEnabled ? "Desativar sons" : "Ativar sons"}
              aria-label={user.soundEnabled ? "Desativar sons" : "Ativar sons"}
            >
              {user.soundEnabled
                ? <Volume2 size={17} strokeWidth={1.75} aria-hidden="true" />
                : <VolumeX size={17} strokeWidth={1.75} aria-hidden="true" />}
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
          <BookOpen className={styles.tabIcon} size={17} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.tabText}>Aprender</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "practice" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("practice")}
        >
          <Gamepad2 className={styles.tabIcon} size={17} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.tabText}>Praticar</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "ranking" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("ranking")}
        >
          <Trophy className={styles.tabIcon} size={17} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.tabText}>Ranking</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "achievements" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("achievements")}
        >
          <Medal className={styles.tabIcon} size={17} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.tabText}>Conquistas</span>
        </button>

        <button
          type="button"
          className={`${styles.tabItem} ${currentTab === "profile" ? styles.activeTab : ""}`}
          onClick={() => onSelectTab("profile")}
        >
          <User className={styles.tabIcon} size={17} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.tabText}>Meu Perfil</span>
        </button>
      </div>
    </nav>
  )
}
