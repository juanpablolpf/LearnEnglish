import { useState, useEffect, useCallback } from "react"
import type { Challenge, GameStatus } from "../../types"
import { speakWord } from "../../utils/speech"
import { Check, Flame, Lightbulb, RotateCcw, Volume2 } from "lucide-react"
import styles from "./styles.module.css"

interface ResultModalProps {
  isOpen: boolean
  status: GameStatus
  challenge: Challenge | null
  streak: number
  onNext: () => void
  onRetry: () => void
  onBackToThemes: () => void
}

export function ResultModal({
  isOpen,
  status,
  challenge,
  streak,
  onNext,
  onRetry,
  onBackToThemes,
}: ResultModalProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handlePlayAudio = useCallback(async () => {
    if (!challenge) return
    setIsSpeaking(true)
    await speakWord(challenge.word)
    setIsSpeaking(false)
  }, [challenge])

  // Tocar pronúncia automaticamente ao abrir o modal
  useEffect(() => {
    if (isOpen && challenge) {
      handlePlayAudio()
    }
  }, [isOpen, challenge, handlePlayAudio])

  if (!isOpen || !challenge) return null

  const isWon = status === "won"

  async function handlePlaySentence() {
    if (!challenge?.example) return
    setIsSpeaking(true)
    await speakWord(challenge.example, 0.9)
    setIsSpeaking(false)
  }

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.modal} ${isWon ? styles.modalWon : styles.modalLost}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        <div className={styles.headerIcon} aria-hidden="true">
          {isWon ? <Check size={22} strokeWidth={2} /> : <Lightbulb size={22} strokeWidth={1.75} />}
        </div>

        <h2 className={`title-display ${styles.title}`} id="result-title">
          {isWon ? "Você acertou" : "Quase lá"}
        </h2>

        <p className={styles.subtitle}>
          {isWon
            ? "Você memorizou mais uma palavra em inglês!"
            : "A palavra correta é:"}
        </p>

        {/* Cartão de Vocabulário & Pronúncia */}
        <div className={styles.wordCard}>
          <div className={styles.wordHeader}>
            <div>
              <span className={styles.englishWord}>{challenge.word}</span>
              {challenge.phonetic && (
                <span className={styles.phonetic}>{challenge.phonetic}</span>
              )}
            </div>

            <button
              type="button"
              className={`${styles.audioButton} ${isSpeaking ? styles.audioPlaying : ""}`}
              onClick={handlePlayAudio}
              title="Ouvir pronúncia em inglês"
            >
              <Volume2 size={17} strokeWidth={1.75} aria-hidden="true" />
              <span>Ouvir</span>
            </button>
          </div>

          <div className={styles.translation}>
            <span className={styles.translationLabel}>Tradução</span>
            <strong>{challenge.tip}</strong>
          </div>

          {/* Exemplo de Frase */}
          {challenge.example && (
            <div className={styles.exampleSection}>
              <div className={styles.exampleHeader}>
                <span className={styles.exampleTitle}>Exemplo em frase</span>
                <button
                  type="button"
                  className={styles.listenSentenceBtn}
                  onClick={handlePlaySentence}
                  title="Ouvir a frase inteira"
                  aria-label="Ouvir a frase inteira"
                >
                  <Volume2 size={15} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.exampleEn}>"{challenge.example}"</p>
              {challenge.examplePt && (
                <p className={styles.examplePt}>({challenge.examplePt})</p>
              )}
            </div>
          )}
        </div>

        {/* Streak Counter */}
        {streak > 0 && (
          <div className={styles.streakBadge}>
            <Flame size={15} strokeWidth={1.75} aria-hidden="true" />
            Sequência atual: <strong>{streak} {streak === 1 ? "palavra" : "palavras"}</strong>
          </div>
        )}

        {/* Ações */}
        <div className={styles.actions}>
          {isWon ? (
            <button type="button" className={styles.primaryButton} onClick={onNext}>
              Próxima palavra
            </button>
          ) : (
            <button type="button" className={styles.retryButton} onClick={onRetry}>
              <RotateCcw size={15} strokeWidth={1.75} aria-hidden="true" />
              Tentar novamente
            </button>
          )}

          <button type="button" className={styles.secondaryButton} onClick={onBackToThemes}>
            Voltar aos temas
          </button>
        </div>
      </div>
    </div>
  )
}
