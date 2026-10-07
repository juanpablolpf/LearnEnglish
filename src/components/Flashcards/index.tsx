import { useState, useEffect } from "react"
import type { Challenge } from "../../types"
import { speakWord } from "../../utils/speech"
import { sounds } from "../../utils/soundEffects"
import { ArrowLeft, Check, RotateCcw, Volume2 } from "lucide-react"
import styles from "./styles.module.css"

type Props = {
  words: Challenge[]
  themeTitle: string
  soundEnabled: boolean
  onWordMastered: (challenge: Challenge) => void
  onWordFailed: (challenge: Challenge) => void
  onBack: () => void
}

export function Flashcards({
  words,
  themeTitle,
  soundEnabled,
  onWordMastered,
  onWordFailed,
  onBack,
}: Props) {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCount, setMasteredCount] = useState(0)

  const currentWord = words[index]

  useEffect(() => {
    setIsFlipped(false)
  }, [index])

  // Automatically speak the word when navigating to a new card
  useEffect(() => {
    if (currentWord) {
      speakWord(currentWord.word)
    }
  }, [currentWord])

  if (!currentWord) {
    return (
      <div className={styles.completedContainer}>
        <span className={styles.completedIcon} aria-hidden="true">
          <Check size={22} strokeWidth={2} />
        </span>
        <h2 className={`title-display ${styles.completedTitle}`}>Sessão concluída</h2>
        <p className={styles.completedSubtitle}>
          Você revisou as {words.length} palavras deste tema e dominou {masteredCount}.
        </p>
        <button type="button" className={styles.backBtnLarge} onClick={onBack}>
          Voltar ao menu
        </button>
      </div>
    )
  }

  function handleFlip() {
    setIsFlipped(!isFlipped)
  }

  function handleMastered() {
    if (soundEnabled) sounds.playCorrect()
    onWordMastered(currentWord)
    setMasteredCount((prev) => prev + 1)
    goToNext()
  }

  function handleNeedReview() {
    if (soundEnabled) sounds.playWrong()
    onWordFailed(currentWord)
    goToNext()
  }

  function goToNext() {
    if (index + 1 < words.length) {
      setIndex(index + 1)
    } else {
      setIndex(words.length) // trigger complete screen
    }
  }

  function handleSpeak(e: React.MouseEvent, text: string) {
    e.stopPropagation()
    speakWord(text)
  }

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topRow}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={15} strokeWidth={1.75} aria-hidden="true" />
          Voltar
        </button>
        <div className={styles.metaBadge}>
          <span className={styles.themeName}>{themeTitle}</span>
          <span className={styles.counter}>
            {index + 1} / {words.length}
          </span>
        </div>
      </div>

      {/* 3D Flip Card */}
      <div className={styles.cardScene} onClick={handleFlip}>
        <div className={`${styles.card3d} ${isFlipped ? styles.isFlipped : ""}`}>
          {/* Frente do Card (Inglês) */}
          <div className={styles.cardFaceFront}>
            <span className={styles.flipHint}>Toque para virar o cartão</span>

            <div className={styles.wordSection}>
              <h2 className={styles.englishWord}>{currentWord.word}</h2>
              {currentWord.phonetic && (
                <span className={styles.phonetic}>{currentWord.phonetic}</span>
              )}
            </div>

            <button
              type="button"
              className={styles.audioBtn}
              onClick={(e) => handleSpeak(e, currentWord.word)}
              title="Ouvir pronúncia nativa"
            >
              <Volume2 size={16} strokeWidth={1.75} aria-hidden="true" />
              Ouvir pronúncia
            </button>
          </div>

          {/* Verso do Card (Português & Exemplo) */}
          <div className={styles.cardFaceBack}>
            <span className={styles.flipHint}>Toque para virar</span>

            <div className={styles.backContent}>
              <span className={styles.translationLabel}>Tradução</span>
              <h3 className={styles.portugueseTip}>{currentWord.tip}</h3>

              {currentWord.example && (
                <div className={styles.exampleBox}>
                  <div className={styles.exampleHeader}>
                    <span>Exemplo em frase</span>
                    <button
                      type="button"
                      className={styles.miniAudioBtn}
                      onClick={(e) => handleSpeak(e, currentWord.example!)}
                      aria-label="Ouvir a frase"
                    >
                      <Volume2 size={14} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </div>
                  <p className={styles.exampleEn}>"{currentWord.example}"</p>
                  {currentWord.examplePt && (
                    <p className={styles.examplePt}>"{currentWord.examplePt}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionsBar}>
        <button
          type="button"
          className={styles.reviewActionBtn}
          onClick={handleNeedReview}
        >
          <RotateCcw size={15} strokeWidth={1.75} aria-hidden="true" />
          Preciso revisar
        </button>

        <button
          type="button"
          className={styles.masterActionBtn}
          onClick={handleMastered}
        >
          <Check size={15} strokeWidth={2} aria-hidden="true" />
          Já dominei (+15 XP)
        </button>
      </div>
    </div>
  )
}
