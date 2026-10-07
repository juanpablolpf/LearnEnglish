import { useState } from "react"
import { Check, Flame, Pencil, Trophy, Unlock, Users, Zap, BookOpen } from "lucide-react"
import type { UserProfile } from "../../types"
import {
  updateUserName,
  updateDailyGoal,
  resetUserStats,
  calculateLevel,
} from "../../utils/auth"
import { ALL_ACHIEVEMENTS } from "../../utils/achievements"
import { Avatar } from "../Avatar"
import styles from "./styles.module.css"

type Props = {
  user: UserProfile
  onUserUpdated: (user: UserProfile) => void
  onOpenLogin: () => void
  onUnlockPro: (code: string) => Promise<boolean>
}

export function Profile({ user, onUserUpdated, onOpenLogin, onUnlockPro }: Props) {
  const [name, setName] = useState(user.name)
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoal)
  const [isEditingName, setIsEditingName] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [proCode, setProCode] = useState("")
  const [proStatus, setProStatus] = useState<"idle" | "checking" | "invalid">("idle")

  const levelInfo = calculateLevel(user.xp)
  const totalLearnedWords = Object.values(user.completedWordIds).reduce(
    (acc, list) => acc + list.length,
    0
  )

  function handleSaveName() {
    if (!name.trim()) return
    const updated = updateUserName(name.trim())
    onUserUpdated(updated)
    setIsEditingName(false)
    showSavedToast("Nome atualizado")
  }

  function handleChangeGoal(newGoal: number) {
    setDailyGoal(newGoal)
    const updated = updateDailyGoal(newGoal)
    onUserUpdated(updated)
    showSavedToast(`Meta diária: ${newGoal} palavras`)
  }

  function handleReset() {
    if (
      window.confirm(
        "Isso apaga o XP, as palavras aprendidas e a ofensiva deste perfil. Quer continuar?"
      )
    ) {
      const reset = resetUserStats()
      onUserUpdated(reset)
      showSavedToast("Progresso resetado.")
    }
  }

  function showSavedToast(msg: string) {
    setSaveMessage(msg)
    setTimeout(() => setSaveMessage(""), 3000)
  }

  async function handleUnlockPro() {
    if (!proCode.trim()) return
    setProStatus("checking")
    const valid = await onUnlockPro(proCode)
    if (valid) {
      setProCode("")
      setProStatus("idle")
    } else {
      setProStatus("invalid")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarLargeWrapper}>
          <Avatar name={user.name} size={72} />
          <span className={styles.levelBadgeLarge}>Nv. {levelInfo.level}</span>
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            {isEditingName ? (
              <div className={styles.editNameGroup}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.nameInput}
                  autoFocus
                  maxLength={25}
                />
                <button
                  type="button"
                  className={styles.saveNameBtn}
                  onClick={handleSaveName}
                >
                  Salvar
                </button>
                <button
                  type="button"
                  className={styles.cancelNameBtn}
                  onClick={() => {
                    setName(user.name)
                    setIsEditingName(false)
                  }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className={styles.nameDisplayGroup}>
                <h2 className={`title-display ${styles.userName}`}>{user.name}</h2>
                <button
                  type="button"
                  className={styles.editIconBtn}
                  onClick={() => setIsEditingName(true)}
                  title="Editar nome"
                  aria-label="Editar nome"
                >
                  <Pencil size={14} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <p className={styles.levelTitleText}>
            {levelInfo.title}
          </p>

          <div className={styles.xpBarContainer}>
            <div className={styles.xpBarTrack}>
              <div
                className={styles.xpBarFill}
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <span className={styles.xpText}>
              {user.xp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
            </span>
          </div>
        </div>

        <div className={styles.switchUserAction}>
          <button
            type="button"
            className={styles.switchUserBtn}
            onClick={onOpenLogin}
          >
            <Users size={15} strokeWidth={1.75} aria-hidden="true" />
            Trocar ou criar aluno
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={styles.saveToast} role="status">
          <Check size={15} strokeWidth={2} aria-hidden="true" />
          {saveMessage}
        </div>
      )}

      {user.isPro ? (
        <div className={styles.proBox}>
          <span className={styles.proIcon} aria-hidden="true">
            <Unlock size={18} strokeWidth={1.75} />
          </span>
          <div>
            <strong>Versão completa desbloqueada</strong>
            <p>Todos os temas e dicas ilimitadas estão liberados neste perfil.</p>
          </div>
        </div>
      ) : (
        <div className={styles.sectionBox}>
          <h3 className={styles.sectionTitle}>Desbloquear a versão completa</h3>
          <p className={styles.sectionDesc}>
            Libere todos os 16 temas e dicas ilimitadas com o código de acesso que você recebe na compra.
          </p>
          <div className={styles.unlockRow}>
            <input
              type="text"
              value={proCode}
              onChange={(e) => {
                setProCode(e.target.value)
                if (proStatus === "invalid") setProStatus("idle")
              }}
              placeholder="Ex: LEP-XXXX-XXXX-XXXX"
              className={styles.unlockInput}
              maxLength={40}
            />
            <button
              type="button"
              className={styles.unlockBtn}
              onClick={handleUnlockPro}
              disabled={!proCode.trim() || proStatus === "checking"}
            >
              {proStatus === "checking" ? "Verificando..." : "Desbloquear"}
            </button>
          </div>
          {proStatus === "invalid" && (
            <p className={styles.unlockError} role="alert">Código inválido. Confira se digitou certinho.</p>
          )}
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={`${styles.statIcon} ${styles.statXp}`} aria-hidden="true">
            <Zap size={18} strokeWidth={1.75} />
          </span>
          <div className={styles.statNumbers}>
            <strong className={styles.statVal}>{user.xp.toLocaleString("pt-BR")}</strong>
            <span className={styles.statLbl}>XP acumulado</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={`${styles.statIcon} ${styles.statStreak}`} aria-hidden="true">
            <Flame size={18} strokeWidth={1.75} />
          </span>
          <div className={styles.statNumbers}>
            <strong className={styles.statVal}>{user.streak}</strong>
            <span className={styles.statLbl}>Ofensiva atual (recorde: {user.bestStreak})</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={`${styles.statIcon} ${styles.statWords}`} aria-hidden="true">
            <BookOpen size={18} strokeWidth={1.75} />
          </span>
          <div className={styles.statNumbers}>
            <strong className={styles.statVal}>{totalLearnedWords}</strong>
            <span className={styles.statLbl}>Palavras dominadas</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={`${styles.statIcon} ${styles.statAch}`} aria-hidden="true">
            <Trophy size={18} strokeWidth={1.75} />
          </span>
          <div className={styles.statNumbers}>
            <strong className={styles.statVal}>
              {user.unlockedAchievementIds.length} / {ALL_ACHIEVEMENTS.length}
            </strong>
            <span className={styles.statLbl}>Conquistas</span>
          </div>
        </div>
      </div>

      <div className={styles.sectionBox}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Meta diária</h3>
          <span className={styles.goalCurrentBadge}>
            Hoje: {user.todayWordsLearned} / {user.dailyGoal} palavras
          </span>
        </div>
        <p className={styles.sectionDesc}>
          Quantas palavras você quer aprender por dia.
        </p>
        <div className={styles.goalsRow}>
          {[5, 10, 15, 20, 30].map((goalOption) => (
            <button
              key={goalOption}
              type="button"
              className={`${styles.goalBtn} ${
                dailyGoal === goalOption ? styles.activeGoal : ""
              }`}
              onClick={() => handleChangeGoal(goalOption)}
            >
              {goalOption} por dia
            </button>
          ))}
        </div>
      </div>

      <div className={styles.dangerZone}>
        <div className={styles.dangerText}>
          <strong>Recomeçar do zero</strong>
          <p>Zera o XP, a ofensiva e as palavras aprendidas deste perfil.</p>
        </div>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={handleReset}
        >
          Zerar progresso
        </button>
      </div>
    </div>
  )
}
