import { useState } from "react"
import { ArrowRight, Plus, X } from "lucide-react"
import type { UserProfile } from "../../types"
import { getAllUsers, loginAsUser, registerNewUser, calculateLevel } from "../../utils/auth"
import { Avatar } from "../Avatar"
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
      setError("Digite o nome do aluno.")
      return
    }
    setError("")
    const created = registerNewUser(name.trim())
    onUserChanged(created)
    setName("")
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <div className={styles.header}>
          <h2 className={`title-display ${styles.title}`} id="login-title">Área do aluno</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            <X size={17} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.tabButtons}>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === "switch" ? styles.activeTab : ""}`}
            onClick={() => setTab("switch")}
          >
            Trocar de aluno ({allUsers.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === "create" ? styles.activeTab : ""}`}
            onClick={() => setTab("create")}
          >
            Novo aluno
          </button>
        </div>

        {tab === "switch" ? (
          <div className={styles.switchSection}>
            <p className={styles.sectionDesc}>
              Escolha o seu perfil para continuar de onde parou.
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
                  <button
                    key={user.id}
                    type="button"
                    className={`${styles.userCard} ${isSelected ? styles.selectedCard : ""}`}
                    onClick={() => handleSwitch(user.id)}
                  >
                    <Avatar name={user.name} size={38} />
                    <span className={styles.userInfo}>
                      <span className={styles.userNameRow}>
                        <strong>{user.name}</strong>
                        {isSelected && <span className={styles.currentBadge}>Ativo</span>}
                      </span>
                      <span className={styles.userStats}>
                        Nível {levelInfo.level}, {levelInfo.title}. {user.streak} de ofensiva, {totalWords} palavras
                      </span>
                    </span>
                    <span className={styles.selectBtn}>
                      {isSelected ? "Selecionado" : (
                        <>Entrar <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" /></>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className={styles.newAccountPrompt}
              onClick={() => setTab("create")}
            >
              <Plus size={15} strokeWidth={1.75} aria-hidden="true" />
              Criar perfil para outro aluno
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className={styles.createForm}>
            <p className={styles.sectionDesc}>
              Crie um perfil para salvar o seu XP, a sua ofensiva e a sua posição no ranking.
            </p>

            {error && <div className={styles.errorBanner} role="alert">{error}</div>}

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="new-student-name">Nome do aluno</label>
              <input
                id="new-student-name"
                type="text"
                placeholder="Ex: Maria"
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

            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setTab("switch")}
              >
                Voltar
              </button>
              <button type="submit" className={styles.submitBtn}>
                Criar e entrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
