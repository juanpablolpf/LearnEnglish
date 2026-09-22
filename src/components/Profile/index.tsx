import { useState } from "react"
import type { UserProfile, AvatarId } from "../../types"
import {
  AVAILABLE_AVATARS,
  updateUserName,
  updateUserAvatar,
  updateDailyGoal,
  resetUserStats,
  calculateLevel,
} from "../../utils/auth"
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
    showSavedToast("Nome atualizado com sucesso!")
  }

  function handleSelectAvatar(avatar: AvatarId) {
    const updated = updateUserAvatar(avatar)
    onUserUpdated(updated)
    showSavedToast("Avatar alterado!")
  }

  function handleChangeGoal(newGoal: number) {
    setDailyGoal(newGoal)
    const updated = updateDailyGoal(newGoal)
    onUserUpdated(updated)
    showSavedToast(`Meta diária definida para ${newGoal} palavras!`)
  }

  function handleReset() {
    if (
      window.confirm(
        "Atenção: Tem certeza de que deseja resetar seu progresso de estudo (XP, palavras aprendidas e ofensiva) deste perfil?"
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
      {/* Header do Perfil */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarLargeWrapper}>
          <span className={styles.avatarLarge}>{user.avatar}</span>
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
                <h2 className={styles.userName}>{user.name}</h2>
                <button
                  type="button"
                  className={styles.editIconBtn}
                  onClick={() => setIsEditingName(true)}
                  title="Editar nome"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>

          <p className={styles.levelTitleText}>
            Classificação: <strong>{levelInfo.title}</strong>
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
            👥 Trocar / Novo Aluno
          </button>
        </div>
      </div>

      {saveMessage && <div className={styles.saveToast}>✓ {saveMessage}</div>}

      {/* Seção 0: Versão Completa (Pro) */}
      {user.isPro ? (
        <div className={styles.proBox}>
          <span className={styles.proIcon}>🔓</span>
          <div>
            <strong>Versão completa desbloqueada</strong>
            <p>Todos os temas e dicas ilimitadas estão liberados neste perfil.</p>
          </div>
        </div>
      ) : (
        <div className={styles.sectionBox}>
          <h3 className={styles.sectionTitle}>🔓 Desbloquear Versão Completa</h3>
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
            <p className={styles.unlockError}>Código inválido. Confira se digitou certinho.</p>
          )}
        </div>
      )}

      {/* Grid de Estatísticas Detalhadas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⚡</span>
          <div className={styles.statNumbers}>
            <strong className={styles.statVal}>{user.xp.toLocaleString()}</strong>
            <span className={styles.statLbl}>XP Total Acumulado</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔥</span>
          <div className={styles.statNumbers}>
            <strong className={styles.statVal}>{user.streak}</strong>
            <span className={styles.statLbl}>Ofensiva Atual (Recorde: {user.bestStreak})</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statIcon}>📚</span>
          <div className={styles.statNumbers}>
            <strong className={styles.statVal}>{totalLearnedWords}</strong>
            <span className={styles.statLbl}>Palavras Dominadas</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statIcon}>🏆</span>
          <div className={styles.statNumbers}>
            <strong className={styles.statVal}>
              {user.unlockedAchievementIds.length} / 12
            </strong>
            <span className={styles.statLbl}>Conquistas Desbloqueadas</span>
          </div>
        </div>
      </div>

      {/* Seção 1: Escolha do Avatar */}
      <div className={styles.sectionBox}>
        <h3 className={styles.sectionTitle}>🎭 Escolha seu Avatar</h3>
        <div className={styles.avatarGrid}>
          {AVAILABLE_AVATARS.map((av) => (
            <button
              key={av.id}
              type="button"
              className={`${styles.avatarBtn} ${
                user.avatar === av.id ? styles.selectedAvatar : ""
              }`}
              onClick={() => handleSelectAvatar(av.id)}
            >
              <span className={styles.avatarEmoji}>{av.id}</span>
              <span className={styles.avatarLabel}>{av.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Seção 2: Meta Diária de Palavras */}
      <div className={styles.sectionBox}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🎯 Meta Diária de Estudo</h3>
          <span className={styles.goalCurrentBadge}>
            Hoje: {user.todayWordsLearned} / {user.dailyGoal} palavras
          </span>
        </div>
        <p className={styles.sectionDesc}>
          Defina quantas palavras você quer aprender por dia para manter o hábito de estudos:
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
              {goalOption} palavras/dia
            </button>
          ))}
        </div>
      </div>

      {/* Seção 3: Gerenciamento do Perfil */}
      <div className={styles.dangerZone}>
        <div className={styles.dangerText}>
          <strong>Reiniciar Estatísticas</strong>
          <p>Zerar XP, ofensiva e palavras aprendidas para recomeçar do zero neste perfil.</p>
        </div>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={handleReset}
        >
          Resetar Progresso
        </button>
      </div>
    </div>
  )
}
