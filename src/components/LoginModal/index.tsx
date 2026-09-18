import { useState } from "react"
import type { UserProfile, AvatarId } from "../../types"
import { AVAILABLE_AVATARS, getAllUsers, loginAsUser, registerNewUser, calculateLevel } from "../../utils/auth"
import styles from "./styles.module.css"

type Props = {
  isOpen: boolean
  currentUser: UserProfile
  onClose: () => void
  onUserChanged: (user: UserProfile) => void
}

export function LoginModal({ isOpen, currentUser, onClose, onUserChanged }: Props) {
  const [tab, setTab] = useState<"switch" | "create">("switch")
  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>("🦁")
  const [error, setError] = useState("")

  if (!isOpen) return null

  const allUsers = getAllUsers()

  function handleSwitch(userId: string) {
    const switched = loginAsUser(userId)
    onUserChanged(switched)
    onClose()
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Por favor, digite o nome do aluno.")
      return
    }
    setError("")
    const created = registerNewUser(name.trim(), selectedAvatar)
    onUserChanged(created)
    setName("")
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.headerIcon}>🎓</span>
            <h2>Área do Aluno</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.tabButtons}>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === "switch" ? styles.activeTab : ""}`}
            onClick={() => setTab("switch")}
          >
            👥 Trocar de Aluno ({allUsers.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === "create" ? styles.activeTab : ""}`}
            onClick={() => setTab("create")}
          >
            ➕ Novo Aluno
          </button>
        </div>

        {tab === "switch" ? (
          <div className={styles.switchSection}>
            <p className={styles.sectionDesc}>
              Selecione seu perfil para continuar de onde parou ou adicione um novo:
            </p>

            <div className={styles.usersList}>
              {allUsers.map((user) => {
                const isSelected = user.id === currentUser.id
                const levelInfo = calculateLevel(user.xp)
                const totalWords = Object.values(user.completedWordIds).reduce(
                  (acc, list) => acc + list.length,
                  0
                )

                return (
                  <div
                    key={user.id}
                    className={`${styles.userCard} ${isSelected ? styles.selectedCard : ""}`}
                    onClick={() => handleSwitch(user.id)}
                  >
                    <div className={styles.userAvatar}>{user.avatar}</div>
                    <div className={styles.userInfo}>
                      <div className={styles.userNameRow}>
                        <strong>{user.name}</strong>
                        {isSelected && <span className={styles.currentBadge}>Ativo</span>}
                      </div>
                      <span className={styles.userStats}>
                        ⭐ Nível {levelInfo.level} ({levelInfo.title}) • 🔥 {user.streak} streak • 📚 {totalWords} palavras
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.selectBtn}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSwitch(user.id)
                      }}
                    >
                      {isSelected ? "Selecionado" : "Entrar →"}
                    </button>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              className={styles.newAccountPrompt}
              onClick={() => setTab("create")}
            >
              + Criar Perfil para Outro Aluno
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className={styles.createForm}>
            <p className={styles.sectionDesc}>
              Crie seu perfil personalizado para salvar seu XP, ofensiva e posição no ranking:
            </p>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.formGroup}>
              <label className={styles.label}>Nome do Aluno:</label>
              <input
                type="text"
                placeholder="Ex: João Paulo, Maria, Lucas..."
                className={styles.textInput}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError("")
                }}
                autoFocus
                maxLength={30}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Escolha seu Avatar:</label>
              <div className={styles.avatarGrid}>
                {AVAILABLE_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    className={`${styles.avatarOption} ${
                      selectedAvatar === av.id ? styles.selectedAvatar : ""
                    }`}
                    onClick={() => setSelectedAvatar(av.id)}
                    title={av.name}
                  >
                    <span className={styles.avatarEmoji}>{av.id}</span>
                    <span className={styles.avatarLabel}>{av.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setTab("switch")}
              >
                Voltar
              </button>
              <button type="submit" className={styles.submitBtn}>
                Cadastrar e Entrar 🚀
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
