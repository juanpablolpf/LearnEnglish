import { useState, useEffect, useCallback } from "react"
import type { Challenge, GameStatus } from "../../types"
import { speakWord } from "../../utils/speech"
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
      <div className={`${styles.modal} ${isWon ? styles.modalWon : styles.modalLost}`}>
        <div className={styles.headerIcon}>
          {isWon ? "🎉" : "💡"}
        </div>

        <h2 className={styles.title}>
          {isWon ? "Excelente! Você acertou!" : "Continue praticando!"}
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              <span>Ouvir</span>
            </button>
          </div>

          <div className={styles.translation}>
            <span className={styles.translationLabel}>Tradução:</span>
            <strong>{challenge.tip}</strong>
          </div>

          {/* Exemplo de Frase */}
          {challenge.example && (
            <div className={styles.exampleSection}>
              <div className={styles.exampleHeader}>
                <span className={styles.exampleTitle}>Exemplo em Frase:</span>
                <button
                  type="button"
                  className={styles.listenSentenceBtn}
                  onClick={handlePlaySentence}
                  title="Ouvir a frase inteira"
                >
                  🔊
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
            🔥 Sequência atual: <strong>{streak} {streak === 1 ? "palavra" : "palavras"}</strong>
          </div>
        )}

        {/* Ações */}
        <div className={styles.actions}>
          {isWon ? (
            <button type="button" className={styles.primaryButton} onClick={onNext}>
              Próxima Palavra ➔
            </button>
          ) : (
            <button type="button" className={styles.retryButton} onClick={onRetry}>
              🔄 Tentar Novamente
            </button>
          )}

          <button type="button" className={styles.secondaryButton} onClick={onBackToThemes}>
            Voltar aos Temas
          </button>
        </div>
      </div>
    </div>
  )
}
